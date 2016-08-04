var _ = require('lodash')
// var userData = require('../data/users')
var userSchema = require('../schema/users')

describe('Manage', function () {

  it('Should create a database from a schema definition', function (done) {

    // var data = _.cloneDeep(userData)
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

    if (useMock) {
      tracker.install()
      tracker.on('query', function (query, step) {
        [
          function () {
            expect(query.sql).to.equal('BEGIN;')
            query.response(true)
          },
          function () {
            expect(query.sql).to.equal('show tables like ?')
            query.response(false)
          },
          function () {
            expect(query.sql).to.equal('create table `user` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `email` varchar(255) null)')
            query.response([
              {
                fieldCount: 0,
                affectedRows: 0,
                insertId: 0,
                serverStatus: 2,
                warningCount: 0,
                message: '',
                protocol41: true,
                changedRows: 0
              },
              undefined
            ])
          },
          function () {
            expect(query.sql).to.equal('select * from information_schema.columns where table_name = ? and table_schema = ?')
            query.response(output)
          },
          function () {
            expect(query.sql).to.equal('COMMIT;')
            query.response(true)
          },
          function () {
            query.response(output)
          }
        ][step - 1]()
      })
    }

    schemer.sync(schema).then(function (result) {
      console.log(result)
      expect(result).to.deep.equal(output)
      done()
    }).catch(function (err) {
      done(err)
    })
  })
})