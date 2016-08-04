import util from './util'
import manage from './manage'
import load from './load'
import constants from './constants'

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
    sync,
    util
  }, manager, loader)
}

/*

 convert:        loader.convert,
 convertAndLoad: loader.convertAndLoad,
 constants:      mods.constants,
 drop:           manager.drop,
 dropTable:      manager.dropTable,
 loadData:       loader.loadData,
 loader:         loader,
 manager:        manager,
 sync:           manager.sync,
 syncTable:      manager.syncTable,
 dump:           dump,
 util:           mods.util
 */