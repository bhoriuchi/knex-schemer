import util from './util'
import manage from './manage'
import load from './load'
import dumper from './dump'
import constants from './constants'
import logger from './logger'

const type = 'knex-schemer'
const version = '1.0.0'

/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 *
 * @description
 * Design, create, and update a relational database schema using JSON
 *
 * @module knex-schemer
 * @param {knex} knex - An instance of knex.
 * @returns {Object}
 */
export default function (knex, options = {}) {
  let manager = manage(knex, options)
  let loader = load(knex, options)
  let dump = dumper(knex, options)
  logger.configureLogger(options.log)

  return Object.assign({
    type,
    version,
    constants,
    knex,
    manager,
    loader,
    dump,
    util
  }, manager, loader, logger)
}