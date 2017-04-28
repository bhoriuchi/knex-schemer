import _ from './liteutils'

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

  createColumn (table, name, definition) {

  }

  createTable (name, definition) {
    return this.trx.schema.createTable(name, table => {
      // add each column
      _.forEach(definition, (definition, name) => {
        this.createColumn(table, name, definition)
      })

      // create constraint for primary key(s)
      let primary = _.reduce(definition, (keys, colDef, colName) => {
        if (colDef.primary === true) keys.push(colName)
      }, [])

      if (primary.length) table.primary(primary)
    })
  }

  sync () {
    return Promise.all(_.map(this.schema, (definition, name) => {
      return this.syncTable(name, definition)
    }))
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