

# knex-schemer
---



knex-schemer is a tool that allows you to define a database schema in JSON format and create/update/delete that schema using basic functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a knex instance to operate.

## Whats New?
---
* 06/25/2015
  * added ignore when relationships (hasOne, hasMany, belongsTo, belongsToMany) are specified to work with bookshelf-factory (in development)
  * fixed bug where an SQL exception was thrown if the load data was an empty array
  * updated version to **0.1.6**
* 06/22/2015
  * added **load** function to load data into the table
  * added **convert** function to format load data so that it can be inserted
  * added **convertAndLoad** function which combines **load** and **convert** into a single function
  * updated version to **0.1.5**

## Install
```bash
npm install -g knex-schemer
```


## Usage
---
```js
var schemer = require('knex-schemer')(knex);
var c       = schemer.constants;

// schema definition
var schema = {

		user: {
			id: {type: c.type.integer, primary: true, increments: true},
			name: {type: c.type.string, size: 255},
			username: {type: c.type.string, size: 100},
			email: {type: c.type.string, size: 200}
		},
		credential: {
			id: {type: c.type.integer, primary: true, increments: true},
			name: {type: c.type.string, size: 255},
			username: {type: c.type.string, size: 100},
			encryptedKey: {type: c.type.string, size: 255}
		}
};


// drop all tables
schemer.drop(schema).then(function() {
	// post drop actions
});

// create or update all tables
schemer.sync(schema).then(function() {
	// post sync actions
});


```

## Methods
---
**.sync(** *schema* **)**
<br>
Creates tables based on the the defined schema if they do not exist. If a table does exist, the actual columns in the database will be added or dropped based on the schema definition

<br>
**.syncTable(** *tableName*, *tableSchema* **)**
<br>
Creates or updates a single table. Returns a promise object

<br>
**.drop(** *schema* **)**
<br>
Drops all tables in the schema definition. Returns a promise object

<br>
**.dropTable(** *tableName* **)**
<br>
Drops a single table. Returns a promise object

<br>
**.load(** *data*, *schema* **)**
<br>
Inserts data into the database. Returns a promise object

<br>
**.convert(** *data*, *schema* **)**
<br>
Converts data to a format that is usable by the load function using the schema definition. Not necessary if data has been formatted correctly. Returns an object containing all of the data to load correctly formatted

<br>
**.convertAndLoad(** *data*, *schema* **)**
<br>
Combines the convert and load functions into a single call. Returns a promise object

<br>

## Sync
---
Currently the sync function creates tables that do not exist. If the table does exist it will first drop any columns that do not exist in the schema definition and add any that do not exist in the current table. In the future, the sync method will also update the column's type and attributes. Re-ordering columns is not currently on the road map since not all database platforms have a clean method.


## Schema Object
---
A schema object currently defines all of the tables in the database connected by the knex instance. It does not currently set any database settings.
<br><br>
The schema object's keys are used as the table names and each key value is an object containing the tables schema.

##### Format
```js
var schema = {
    <table 1 name>: {
        <column 1 name>: { type: <data type>, [additional column options] },
        <column 2 name>: { type: <data type>, [additional column options] },
        ...
    },
    <table 2 name>: {
        <column 1 name>: { type: <data type>, [additional column options] },
        <column 2 name>: { type: <data type>, [additional column options] },
        ...
    },
    ...
};
```

##### Example
```js
var schema = {
	user: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		email: {type: c.type.string, size: 200}
	},
	credential: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		encryptedKey: {type: c.type.string, size: 255}
	}
};
```
## Column Options
---
Column options are taken directly from knex. **Please familiarize yourself with valid combinations of types and options as schemer currently will not validate the schema supplied to it**.
<br><br>
Currently the following options and values are available. The main list item is the option and its sublist are the valid values. Types are defined in schemer.constants.type, options are defined in schemer.constants.options. All values that are not numbers, true/false, or knex objects should be supplied as strings.

* **type** (required option)
  * integer
  * bigInteger
  * string
  * text
  * float
  * decimal
  * boolean
  * date
  * dateTime
  * time
  * timestamp
  * binary
  * json
  * uuid
* **size** (used with string type option)
  * a number value
* **textType** (only used with text type option)
  * text
  * mediumtext
  * longtext
* **precision** (used with float and decimal type option)
  * a number value
* **scale** (used with float and decimal type option)
  * a number value
* **standard** (used with timestamp type option)
  * a timestamp standard
* **length** (used with binary type option)
  * a number value
* **jsonb** (used with json type option)
  * true
  * false
* **index**
  * true
  * false
* **indexName** (used with index to specify the index name)
  * a string that will be used as the index name
* **indexType** (used with index, only applies to PostgreSQL)
  * index type
* **primary** (table schemas with multiple primary columns will create a composite key)
  * true
  * false
* **unique**
  * true
  * false
* **references**
  * column
* **inTable**
  * table
* **onDelete**
  * command
* **onUpdate**
  * command
* **defaultTo**
  * value
* **unassigned** (used with integer type option)
  * true
  * false
* **nullable** (defaults to false)
  * true
  * false
* **first**
  * true
  * false
* **after**
  * field
* **comment**
  * value
* **ignore** (special option to ignore column)
  * true
  * false
* **hasOne** (used by bookshelf-factory ignores column)
  * table name
* **hasMany** (used by bookshelf-factory ignores column)
  * table name
* **belongsTo** (used by bookshelf-factory ignores column)
  * table name
* **belongsToMany** (used by bookshelf-factory ignores column)
  * table name
  
# Extending Schema
---
One benefit to an object based definition is that you can supply additional schema options that are not necessarily used in building the database schema, but can be used by other processes and methods in your application.

##### Example
```js
var schema = {
	credential: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		encryptedKey: {
            type: c.type.string, 
            size: 255, 
            encrypt: function (key) {
                return customEncryption(key);
            }
        }
	}
};

```
in the above example the encrypt option means nothing to schemer, but it can potentially organize functions and attributes that are related to the database column

# Ignoring
---

Ignore can be used to define a key in the schema but not create it in the database. This is useful when programmatically defining relationships or custom functions. To ignore a column any one of the following can be supplied

* ignore: true
* hasOne: "table name"
* hasMany: "table name"
* belongsTo: "table name"
* belongsToMany: "table name"

##### Example
```js
var schema = {
	credential: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		encryptedKey: { type: c.type.string, size: 255 },
		user: { belongsTo: true, table: 'user' },
		note: {ignore: true}
	}
};
```

# Loading Data
---
Data can be loaded using the load function. It is recommended that you first run your data through the convert function and use the output of that function to insert the data or the combined convertAndLoad function

##### Load Data Format
```js
var data = {
    <table 1 name>: [
        {
            <Row 1 column 1 name>: <Row 1 column 1 data>,
            <Row 1 column 2 name>: <Row 1 column 2 data>,
            ...
        },
        {
            <Row 2 column 1 name>: <Row 2 column 1 data>,
            <Row 2 column 2 name>: <Row 2 column 2 data>,
            ...
        },
        ...
    ],
    <table 2 name>: [
        ...
    ],
    ...
};
```

##### Example
```js
var schemer = require('knex-schemer')(knex);
var c       = schemer.constants;

// schema definition
var schema = {

	user: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		email: {type: c.type.string, size: 200}
	},
	credential: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		encryptedKey: {type: c.type.string, size: 255}
	}
};

// data to load
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


## Tools
---
Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.