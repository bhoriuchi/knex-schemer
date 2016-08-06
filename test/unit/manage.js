var _ = require('lodash')
// var userData = require('../data/users')
var userSchema = require('../schema/users')
var userSchemaV2 = require('../schema/users_v2')

var output = {
  user: {
    id: {
      defaultValue: null,
      type: 'int',
      maxLength: null,
      nullable: false
    },
    name: {
      defaultValue: null,
      type: 'varchar',
      maxLength: 255,
      nullable: false
    },
    email: {
      defaultValue: null,
      type: 'varchar',
      maxLength: 255,
      nullable: true
    }
  }
}
var output2 = {
  user: {
    id: {
      defaultValue: null,
      type: 'int',
      maxLength: null,
      nullable: false
    },
    name: {
      defaultValue: null,
      type: 'varchar',
      maxLength: 255,
      nullable: false
    },
    description: {
      defaultValue: null,
      type: 'varchar',
      maxLength: 255,
      nullable: true
    }
  }
}

describe('Manage', function () {

  it('Should drop and create a database from a schema definition', function (done) {
    var schema = _.cloneDeep(userSchema)

    knex.transaction(function (trx) {
      schemer.drop(schema, trx).then(function (dropped) {
        expect(dropped).to.deep.equal([ { user: true } ])
        return schemer.sync(schema, trx).then(function (result) {
          expect(result).to.deep.equal(output)
          return schemer.drop(schema, trx).then(function (cleanup) {
            expect(cleanup).to.deep.equal([ { user: true } ])
            done()
          })
        })
      })
    }).catch(function (err) {
      done(err)
    })
  })

  it('Should sync table columns with an updated schema', function (done) {
    var schema = _.cloneDeep(userSchema)
    var schemaV2 = _.cloneDeep(userSchemaV2)

    knex.transaction(function (trx) {
      schemer.drop(schema, trx).then(function (dropped) {
        expect(dropped).to.deep.equal([ { user: true } ])
        return schemer.sync(schema, trx).then(function (result) {
          expect(result).to.deep.equal(output)
          return schemer.sync(schemaV2, trx).then(function (updated) {
            expect(updated).to.deep.equal(output2)
            return schemer.drop(schema, trx).then(function (cleanup) {
              expect(cleanup).to.deep.equal([ { user: true } ])
              done()
            })
          })
        })
      })
    }).catch(function (err) {
      done(err)
    })
  })
})