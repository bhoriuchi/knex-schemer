import Promise from 'bluebird'
import * as _ from './litedash'
import * as util from './util'
import { log } from './logger'

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
export default function (knex) {
  return function(opts) {
    let schema = null
    let tables = null
    let output = {}
    let transaction = null

    if (!_.isHash(opts)) {
      log.warn('No options were passed to dump')
      return {}
    }

    if (!opts.schema) {
      schema      = opts
      tables      = _.keys(schema)
    } else {
      schema      = opts.schema
      tables      = _.ensureArray(opts.tables || _.keys(schema))
      transaction = opts.transaction
    }

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

    return util.wrapPromise(t).catch(function(err) {
      log.error({ msg: 'A dump error occured', error: err })
    })
  }
}