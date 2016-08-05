import Promise from 'bluebird'
import * as _ from './litedash'
import { log } from './logger'

const METHOD = 'dump'

/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 *
 * @description
 * Data dumping functions
 *
 * @module lib/core/dump
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 *
 * @ignore
 */
export default function (knex, options = {}) {
  return function(schema, transaction) {
    let output = {}
    let tables = _.isHash(schema) ? _.keys(schema) : _.ensureArray(schema)

    let dumpEx = function (trx) {
      return Promise.each(tables, (table) => {
        output[table] = []

        return knex.select('*').from(table).then((results) => {
          _.forEach(results, (result) => {
            output[table].push(result)
          })
        })
      }).then(() => {
        _.forEach(output, (value, name) => {
          if (!_.isArray(value) || !value.length) delete output[name]
        })
        return output
      })
    }

    let t = transaction ? dumpEx(transaction) : knex.transaction((trx) => dumpEx(trx))

    return t.then((result) => {
      log.trace({
        METHOD,
        tables,
        results
      })
      return result
    }).catch(function(err) {
      log.error({
        METHOD,
        msg: 'A dump error occured',
        tables,
        error: err
      })
    })
  }
}