import Promise from 'bluebird'
import * as _ from './litedash'
import CONST from './constants'

const OPTS = CONST.options

export function pushUniq (val, arr = []) {
  if (!_.includes(arr, val)) arr.push(val)
  return arr
}

/**
 * Obtain primary keys from the schema definition
 * @param {SchemaDefinition} schema - Schema definition.
 * @returns {String[]|Number[]} Primary Key.
 */
export function getPrimaryKeys (schema) {
  let primary = [];
  _.forEach(schema, (col, name) => {
    if (col.primary === true) primary.push(name);
  })
  return primary;
}

/**
 * Determine if a column is ignore-able
 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
 * @param {String} name - Name of the column to analyze.
 * @returns {Boolean}
 */
export function ignorable (col, colName) {
  let keys = _.keys(col)
  let rels = _.keys(CONST.relations)
  let exts = _.keys(CONST.extend)

  // verify that the column name is a string
  colName = _.isString(colName) ? colName : ''

  // check for individual ignore-able conditions
  var related = (_.intersection(keys, rels).length === 0) ? false : true
  var extend  = (_.intersection(keys, exts).length === 0) ? false : true
  var virtual = _.includes(keys, OPTS.virtuals) ? true : false
  var dashCol = (colName.length > 0 && colName[0] === '_') ? true : false
  var ignore  = (!_.has(col, OPTS.ignore)) ? false : col.ignore

  // check for any ignore-able conditions
  if (ignore || related || extend || dashCol || virtual) return true;
  return false
}

/**
 * Place an object inside a promise and return the promise
 * @param {Object} object - Object to resolve.
 * @returns {Promise}
 */
export function wrapPromise(obj) {
  return new Promise((resolve) => resolve(obj))
}