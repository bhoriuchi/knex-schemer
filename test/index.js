var chai = global.chai = require('chai')
var expect = global.expect = chai.expect

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
    "debug": false
  }
}

var knex = global.knex = require('knex')(config.mysql)

// set up schemer
var schemer = global.schemer = require('../index')(knex)

// import tests
var unitTests = require('./unit')

// run tests
unitTests()