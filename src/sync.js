import _ from './liteutils'
import { TYPES } from './constants'

/*
function reduce (collection, iteratee, accumulator) {
  console.log({collection, accumulator})
  accumulator = accumulator !== undefined
    ? accumulator
    : _.isArray(collection)
      ? collection.length
        ? collection[0]
        : undefined
      : _.keys(collection).length
        ? collection(_.keys(collection)[0])
        : undefined

  _.forEach(collection, (value, key) => {
    accumulator = iteratee(accumulator, value, key, collection)
  })

  return accumulator
}
*/

export default class Syncer {
  constructor (knex, schema, options) {
    let { transaction } = options
    this.knex = knex
    this.schema = schema
    this.options = options
    this.trx = null

    // ensure that there is a transaction and call sync
    return transaction
      ? () => {
        this.trx = transaction
        return this.sync()
      }
      : knex.transaction(trx => {
        this.trx = trx
        return this.sync()
      })
  }

  alterTable (name, definition) {

  }

  createColumn (table, colName, colDef) {
    return this.setColumnOptions(
      this.setColumnType(table, colName, colDef),
      colName,
      colDef
    )
  }

  createTable (name, { table, columns }) {
    return this.trx.schema.createTable(name, table => {
      // add each column
      _.forEach(columns, (colDef, colName) => {
        this.createColumn(table, colName, colDef)
      })

      this.setTablePrimaryKey(table, columns)
      this.setTableForeignKey(table, columns)
      this.setTableIndexes(table, columns)
      this.setTableUniques(table, columns)
    })
  }

  setColumnOptions (column, name, col) {
    if (col.references) column = column.references(col.references)
    if (col.inTable) column = column.inTable(col.inTable)
    if (col.onDelete) column = column.onDelete(col.onDelete)
    if (col.onUpdate) column = column.onUpdate(col.onUpdate)
    if (col.defaultTo) column = column.defaultTo(col.defaultTo)
    if (col.unsigned === true) column = column.unsigned()
    column = col.nullable === true
      ? column.nullable()
      : column.notNullable()
    if (col.first === true) column = column.first()
    if (col.after) column = column.after(col.after)
    if (col.comment) column = column.comment(col.comment)
    if (col.collate) column = column.collate(col.collate)

    return column
  }

  setColumnType (table, name, col) {
    switch (col.type) {
      case TYPES.BIG_INTEGER:
        return table.bigInteger(name)
      case TYPES.BINARY:
        return table.binary(name, col.length)
      case TYPES.BOOLEAN:
        return table.boolean(name)
      case TYPES.DATE:
        return table.date(name)
      case TYPES.DATE_TIME:
        return table.dateTime(name)
      case TYPES.DECIMAL:
        return table.decimal(name, col.precision, col.scale)
      case TYPES.ENUM:
        return table.enu(name, col.values)
      case TYPES.FLOAT:
        return table.float(name, col.precision, col.scale)
      case TYPES.INCREMENTS:
        return table.increments(name)
      case TYPES.INTEGER:
        return table.integer(name)
      case TYPES.JSON:
        return table.json(name)
      case TYPES.JSONB:
        return table.jsonb(name)
      case TYPES.STRING:
        return table.string(name, col.length)
      case TYPES.TEXT:
        return table.text(name, col.textType)
      case TYPES.TIME:
        return table.time(name)
      case TYPES.TIMESTAMP:
        return table.timestamp(name, col.standard)
      case TYPES.UUID:
        return table.uuid(name)
      default:
        return table.specificType(name, col.type)
    }
  }

  setTableIndexes (table, columns) {
    let indexes = {}

    // generate a list of indexes
    _.forEach(columns, (colDef, colName) => {
      if (colDef.index === true) {
        indexes[colName] = {
          name: undefined,
          cols: [colName],
          type: colDef.indexType
        }
      } else if (typeof colDef.index === 'string') {
        if (indexes[colDef.index]) {
          indexes[colDef.index].cols.push(colName)
          indexes[colDef.index].type = indexes[colDef.index].type || colDef.indexType
        } else {
          indexes[colDef.index] = {
            name: colDef.index,
            cols: [colName],
            type: colDef.indexType
          }
        }
      }
    })

    // create the indexes
    _.forEach(indexes, ({ name, cols, type }) => {
      table.index(cols, name, type)
    })
  }

  setTableUniques (table, columns) {
    let uniques = {}

    // generate a list of indexes
    _.forEach(columns, (colDef, colName) => {
      if (colDef.unique === true) {
        uniques[colName] = [colName]
      } else if (typeof colDef.unique === 'string') {
        if (indexes[colDef.unique]) {
          uniques[colDef.unique].push(colName)
        } else {
          uniques[colDef.unique] = [colName]
        }
      }
    })

    // create the constraints
    _.forEach(uniques, (cols) => {
      table.unique(cols)
    })
  }

  setTablePrimaryKey (table, columns) {
    // create constraint for primary key(s)
    let primary = _.reduce(columns, (keys, colDef, colName) => {
      if (colDef.primary === true) keys.push(colName)
      return keys
    }, [])

    if (primary.length) table.primary(primary)
  }

  setTableForeignKey (table, columns) {
    // create constraint for foreign key(s)
    let foreign = _.reduce(columns, (keys, colDef, colName) => {
      if (colDef.foreign === true) keys.push(colName)
      return keys
    }, [])

    if (_.isArray(foreign) && foreign.length) table.foreign(foreign)
  }

  setTableOptions (table, opts) {
    if (opts.timestamps) {
      let { useTimestamps, defaultToNow } = _.isHash(opts.timestamps)
        ? opts.timestamps
        : {}
      table.timestamps(useTimestamps, defaultToNow)
    }

    if (opts.comment) table.comment(opts.comment)
    if (opts.engine) table.engine(opts.engine)
    if (opts.charset) table.charset(opts.charset)
    if (opts.collate) table.collate(opts.collate)
    if (opts.inherits) table.inherits(opts.inherits)
  }

  sync () {
    return Promise.all(_.map(this.schema, (definition, name) => {
      return this.syncTable(name, definition)
    }))
      .then(console.log)
  }

  syncTable (name, definition) {
    return this.trx.schema.hasTable(name)
      .then(exists => {
        return exists
          ? this.alterTable(name, definition)
          : this.createTable(name, definition)
      })
  }
}