import Promise from 'bluebird'
import * as _ from './litedash'
import * as util from './util'
import CONST from './constants'
import { log } from './logger'

const OPTS = CONST.options
/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 *
 * @description
 * Data loading functions
 *
 * @module lib/core/loader
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 *
 * @ignore
 */
export default function (knex) {

  /**
   * Attempt to convert data to be compatible with the schema definition
   * @param {Object} data - Data to analyze.
   * @param {Object} schema - Schema definition.
   * @returns {Object} Converted data.
   */
  let convert = function (data, schema) {
    let converted = {}

    _.forEach(data, (table, tableName) => {
      if (_.has(schema, tableName)) {
        converted[tableName] = []

        _.forEach(table, (datum) => {
          let dataCol  = {}
          let validRow = true

          _.forEach(schema[tableName], (col, colName) => {
            if (_.has(datum, colName)) {
              dataCol[colName] = datum[colName]
            } else if (util.optional(col, colName)) {
              dataCol[colName] = _.has(col, OPTS.defaultTo) ? col.defaultTo : null
            } else if (!util.ignorable(col, colName) && (!col.increments)){
              log.warn(`Field ${colName} has invalid/missing data in ${tableName}:${datum} and will not be inserted`)
              validRow = false
            }
          })

          if (validRow) converted[tableName].push(dataCol)
        })
      }
    })
    return converted
  }


  /**
   * Load data into the database
   * @param {Object} data - Data to load.
   * @param {Object} schema - Schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  let loadData = function (data, schema, transaction) {
    let loadEx = function(trx) {
      return Promise.map(_.keys(data), (tableName) => {
        let table = data[tableName]

        return trx.schema.hasTable(tableName).then(function(exists) {
          if (exists && _.isArray(table) && util.checkSchema(table, schema[tableName])) {
            return trx.table(tableName).insert(table)
          } else {
            log.warn(`Failed to load data for ${tableName}. Incorrectly formatted or missing required data`)
          }
        })
      })
    }

    let t = transaction ? loadEx(transaction) : knex.transaction((trx) => loadEx(trx))

    return util.wrapPromise(t).catch(function(err) {
      log.error({ msg: 'A load error occured', error: err })
    })
  }


  /**
   * Convert and load the data in one method call
   * @param {Object} data - Data to load.
   * @param {Object} schema - Schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  let convertAndLoad = function (data, schema, transaction) {
    return loadData(convert(data, schema), schema, transaction)
  }

  let checkSchema = util.checkSchema

  // return the methods
  return {
    loadData,
    convert,
    convertAndLoad,
    checkSchema
  }
}