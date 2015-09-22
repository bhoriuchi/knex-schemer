# ☯ knex-schemer
| <h4>❁ Overview</h4> |
| :--- |
| <br>***knex-schemer*** is a tool that allows you to define a database schema in [`JSON`](http://json.org/) using *Knex-Schemer Definition Format*  or [`KSDF`](https://github.com/bhoriuchi/knex-schemer/wiki/Knex-Schemer-Definition-Format) and create/update/delete that schema using basic transactional functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a [`knex`](http://knexjs.org/) instance to operate.<br><br> |
| <h4>❁ Documentation</h4> |
| <ul><li>See the [`WIKI`](https://github.com/bhoriuchi/knex-schemer/wiki) for full documentation</li><li>And the [`Change Log`](https://github.com/bhoriuchi/knex-schemer/wiki/Change-Log) for what's new!</li></ul> |
| <h4>❁ Install</h4> |
| <pre>npm install -g knex-schemer</pre> |
| <h4>❁ Examples</h4> |

<h5>☴ Full define, drop, create, and load example</h5>
Defines a schema and dataset, then drops any existing tables, creates them, and loads the data
```js
// require the module
var schemer = require('knex-schemer')(knex);
var types   = schemer.constants.types;

// create a schema
var schema = {

    user: {
        id: { type: type.integer, primary: true, increments: true },
        name: { type: type.string },
        username: { type: type.string, size: 32 },
        email: { type: type.string }
    },
    credential: {
        id: { type: type.integer, primary: true, increments: true },
        name: { type: type.string },
        username: { type: type.string },
        encryptedKey: { type: type.string }
    }
};

// define data to load
var data = {
    user: [
        {
            id: 1,
            name: 'Jack Shepard',
            username: 'jshepard',
            email: 'thechosenone@theisland.org'
        },
        {
            id: 2,
            name: 'Kate Austen',
            username: 'kausten',
            email: 'kateplusfate@theisland.org'
        }
    ],
    credential: [
        {
            id: 1,
            name: 'swan',
            username: 'operator',
            encryptedKey: '4815162342'
        }
    ]
};

// drop all tables
schemer.drop(schema).then(function() {

    // create or update all tables
    return schemer.sync(schema).then(function() {

        // convert and load the data
        return schemer.convertAndLoad(data, schema).then(function() {
            // post load operations
        });
    });
});
```

<h5>☴ Full transactional drop, create, and load example</h5>
Borrowing the schema and data from the first example, the operations can share the same transaction using knex.transaction()

```js
// create a knex transaction
knex.transaction(function(trx) {
    // pass the transaction as the last argument in each method
    schemer.drop(schema, trx).then(function() {
        return schemer.sync(schema, trx).then(function(result) {
            return schemer.convertAndLoad(data, schema, trx);
        });
    });
})
.then(function() {
    // do something on success
})
.catch(function(e) {
    // do something on error
});
```