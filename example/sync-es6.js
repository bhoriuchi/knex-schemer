let db = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'db',
    password: 'password',
    database: 'test',
    charset: 'utf8'
  },
  debug: false
}

let knex = require('knex')(db)
let schemer = require('../src/index').default(knex)

const schema = {
  user: {
    table: {},
    columns: {
      id: {
        type: 'integer',
        primary: true,
        increments: true
      },
      name: {
        type: 'string'
      },
      description: {
        type: 'string',
        nullable: true
      }
    }
  }
}

schemer.sync(schema).then(result => {
  console.log(result);
  process.exit();
})
.catch(error => {
  console.error(error.stack)
  process.exit()
})