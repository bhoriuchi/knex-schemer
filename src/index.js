import utils from './litedash'
import manage from './manage'
import constants from './constants'

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
  let sync = manager.sync

  return {
    constants,
    knex,
    manager,
    sync,
    utils
  }
}