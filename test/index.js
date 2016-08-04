var chai = global.chai = require('chai')
var expect = global.expect = chai.expect
var mockdb = global.mockdb = require('mock-knex')
var tracker = global.tracker = mockdb.getTracker()
var useMock = global.useMock = true

var config = {
  mysql: {
    "client": "mysql",
    "connection": {
      "host": "127.0.0.1",
      "user": "db",
      "password": "password",
      "database": "test",
      "charset": "utf8"
    },
    "debug": true
  },
  mock: {
    client: 'mysql'
  }
}

var knex = global.knex = useMock ? require('knex')(config.mock) : require('knex')(config.mysql)
if (useMock) mockdb.mock(knex)

// set up schemer
var schemer = global.schemer = require('../index')(knex)

// import tests
var unitTests = require('./unit')

// run tests
unitTests()