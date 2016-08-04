var _ = require('lodash')
// var userData = require('../data/users')
var userSchema = require('../schema/users')

describe('Manage', function () {

  it('Should drop and create a database from a schema definition', function (done) {
    var schema = _.cloneDeep(userSchema)

    var output = [
      {
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
    ]

    schemer.drop(schema).then(function () {
      return schemer.sync(schema).then(function (result) {
        expect(result).to.deep.equal(output)
        done()
      })
    }).catch(function (err) {
      done(err)
    })
  })
})