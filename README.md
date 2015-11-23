# ☯ knex-schemer
---
`knex-schemer` is a tool that allows you to define a database schema in [`JSON`](http://json.org/) using *Knex-Schemer Definition Format*  or [`KSDF`](https://github.com/bhoriuchi/knex-schemer/wiki/Knex-Schemer-Definition-Format) and create/update/delete that schema using basic transactional functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a [`knex`](http://knexjs.org/) instance to operate

* See the [`WIKI`](https://github.com/bhoriuchi/knex-schemer/wiki) for full documentation
* And the [`Change Log`](https://github.com/bhoriuchi/knex-schemer/wiki/Change-Log) for what's new!

---

## Documentation
---
### API

#### `schemer.convert`( `data`, `schema` )

* `data` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Data to convert
* `schema` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Database schema object

removes data columns and tables that do not exist in the schema and returns a converted data object

#### `schemer.convertAndLoad`( `data`, `schema`, [`transaction`] )

* `data` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Data to convert
* `schema` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Database schema object
* [`transaction`] [`Transaction`](http://knexjs.org/#Transactions) - transaction to use

converts the data object and loads the data into the database

#### `schemer.drop`( `schema`, [`transaction`] )

* `schema` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Database schema object
* [`transaction`] [`Transaction`](http://knexjs.org/#Transactions) - transaction to use

drops all tables defined in the schema object

#### `schemer.sync`( `schema`, [`transaction`] )

* `schema` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Database schema object
* [`transaction`] [`Transaction`](http://knexjs.org/#Transactions) - transaction to use

creates the tables defined in the schema object if they do not exist. If the tables do exist, the row definitions are updated to reflect the schema object. Table alteration is limited to what is supported by `knex.js`

#### `schemer.dump`( `options` )

* `options` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Hash of options or a schema object
  * `schema` [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) - Schema object
  * [`tables`] [`String[]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) - Array of table names to dump 

dumps database data into a data object that can be used by `schemer.load()`


<br>

---

### Examples
---
#### Full define, drop, create, and load example
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

#### Full transactional drop, create, and load example
Borrowing the schema and data from the first example, the operations can share the same transaction using `knex.transaction()`

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