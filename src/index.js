import util from './util'
import manage from './manage'
import load from './load'
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
export default function (knex) {
  let manager = manage(knex)
  let loader = load(knex)

  return Object.assign({
    type,
    version,
    constants,
    knex,
    manager,
    loader,
    util
  }, manager, loader, logger)
}