import Promise from 'bluebird'
import * as _ from './litedash'
import * as util from './util'
import CONST from './constants'
import { log } from './logger'

const TYPE = CONST.type
const OPTS = CONST.options
const getPrimaryKeys = util.getPrimaryKeys

export default function (knex, options = {}) {
  /**
   * Creates a new column in the table using a column schema
   * @param {Table} table - Knex.js table object.
   * @param {String} name - Column name.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @param {Object[]} primary - Primary key.
   * @ignore
   */
  let createColumn = function (table, colName, col, primary) {

    // create a column variable
    let column = null

    // check for increments
    if (col.increments === true) {
      // check for UUID type
      if (col.type === TYPE.uuid) {

        // UUIDs cannot be auto-incremented or given a
        // default value when used as a primary/incrementing key
        // the insert code should check the schema definition and
        // supply a UUID on insert
        column = table.uuid(colName)
        delete col.defaultTo
      } else {
        column = table.increments(colName)
      }
    } else {
      // verify type field is present
      if (!_.has(col, OPTS.type)) return null

      // check types
      switch (col.type) {
        case TYPE.integer:
          column = table.integer(colName)
          break
        case TYPE.bigInteger:
          column = table.bigInteger(colName)
          break
        case TYPE.string:
          column = table.string(colName, col.size)
          break
        case TYPE.text:
          column = table.text(colName, col.textType)
          break
        case TYPE.float:
          column = table.float(colName, col.precision, col.scale)
          break
        case TYPE.decimal:
          column = table.decimal(colName, col.precision, col.scale)
          break
        case TYPE.boolean:
          column = table.boolean(colName)
          break
        case TYPE.comment:
          column = table.comment(col.comment)
          break
        case TYPE.date:
          column = table.date(colName)
          break
        case TYPE.dateTime:
          column = table.dateTime(colName)
          break
        case TYPE.time:
          column = table.time(colName)
          break
        case TYPE.timestamp:
          column = table.timestamp(colName, col.standard)
          break
        case TYPE.binary:
          column = table.binary(colName, col.length)
          break
        case TYPE.json:
          column = table.json(colName)
          break
        case TYPE.jsonb:
          column = table.jsonb(colName)
          break
        case TYPE.uuid:
          column = table.uuid(colName)
          break
        case TYPE.enum:
          column = table.enu(colName, col.values)
          break
        default:
          column = table.specificType(colName, col.value)
          break
      }
    }

    // MySQL specific
    if (col.engine) column.engine(col.engine)
    if (col.charset) column.charset(col.charset)
    if (col.collate) column.collate(col.collate)

    // PostgreSQL specific
    if (col.inherits) column.inherits(col.inherits)

    // General
    if (col.index === true) column.index(col.indexName, col.indexType)
    if (col.primary === true && primary.length === 1) column.primary()
    if (col.unique === true) column.unique()
    if (col.references) column.references(col.references)
    if (col.inTable) column.inTable(col.inTable)
    if (col.onDelete) column.onDelete(col.onDelete)
    if (col.onUpdate) column.onUpdate(col.onUpdate)
    if (_.has(col, OPTS.defaultTo)) column.defaultTo(col.defaultTo)
    if (col.unassigned === true) column.unassigned()

    if (col.nullable === true) column.nullable()
    else column.notNullable()

    if (col.first === true) column.first()
    if (col.after) column.after(col.after)
    if (col.comment) column.comment(col.comment)
    if (col.collate) column.collate(col.collate)
  }

  /**
   * Creates a table
   * @param {Table} table - Knex.js table object.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @ignore
   */
  let createTable = function (table, schema) {
    let primary = util.getPrimaryKeys(schema)

    _.forEach(schema, (col, colName) => {
      if (!util.ignorable(col, colName)) createColumn(table, colName, col, primary)

      // look for compositeUnique
      if (col.compositeUnique) {
        let cmpArr = [colName]

        _.forEach(_.ensureArray(col.compositeUnique), (name) => {
          if (_.has(schema, name)) util.pushUniq(name, cmpArr)
        })

        // make sure there are at least 2 columns
        if (cmpArr.length > 1) table.unique(cmpArr)
      }
    })

    // set any composite keys
    if (_.isArray(primary) && primary.length > 1) table.primary(primary)
  }

  /**
   * Creates or updates a table schema
   * @param {String} table - Table name.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @param {Transaction} transaction - Knex.js transaction.
   * @returns {Promise}
   * @ignore
   */
  let syncTable = function (tableName, schema, trx) {
    return trx.schema.hasTable(tableName).then((exists) => {
      if (!exists) {
        return trx.schema.createTable(tableName, (table) => {
          createTable(table, schema)
        }).then(() => {
          return knex(tableName).columnInfo().transacting(trx)
        })
      } else {
        return knex(tableName).columnInfo().transacting(trx).then((info) => {
          return Promise.map(_.keys(info), (colName) => {
            if (!_.has(schema, colName)) {
              return trx.schema.table(tableName, (table) => {
                table.dropColumn(colName)
              })
            }
          }).then(() => {
            return info
          })
        }).then((info) => {
          return Promise.map(_.keys(schema), (colName) => {
            if (!_.has(info, colName)) {
              return trx.schema.table(tableName, (table) => {
                createColumn(table, colName, schema[colName], [])
              })
            }
          }).then(() => {
            return knex(tableName).columnInfo().transacting(trx)
          })
        })
      }
    })
  }

  /**
   * Creates or updates a database schema
   * @param {SchemaDefinition} schema - Database schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  let sync = function (schema, trx) {
    let returnVal = {}
    let syncEx = (trx) => {
      return Promise.each(_.keys(schema), (tableName) => {
        if (schema[tableName]._temporary === true) return

        return syncTable(tableName, schema[tableName], trx).then((result) => {
          returnVal[tableName] = result
        })
      }).then(() => {
        return returnVal
      })
    }

    let t = trx ? syncEx(trx) : knex.transaction((trx) => syncEx(trx))

    return t.catch((err) => {
      log.error({ msg: 'A sync error occured', error: err })
    })
  }

  /**
   * Drops a table
   * @param {String} name - Table name to drop.
   * @param {Transaction} transaction - Knex.js transaction.
   * @returns {Promise}
   * @ignore
   */
  function dropTable(tableName, trx) {
    return trx.schema.dropTableIfExists(tableName).then(() => {
      let result = {}
      result[tableName] = true
      return result
    })
  }


  /**
   * Drops all the tables defined in the schema definition
   * @param {SchemaDefinition} schema - Database schema to drop.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  function drop(schema, trx) {
    let dropEx = (trx) => Promise.map(_.keys(schema), (tableName) => dropTable(tableName, trx))
    let t = trx ? dropEx(trx) : knex.transaction((trx) => dropEx(trx))

    return t.catch((err) => {
      log.error({ msg: 'A drop error occured', error: err })
    })
  }

  return {
    createColumn,
    createTable,
    drop,
    dropTable,
    getPrimaryKeys,
    syncTable,
    sync
  }
}