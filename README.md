

# knex-schemer
---



knex-schemer is a tool that allows you to define a database schema in JSON format and create/update/delete that schema using basic functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a knex instance to operate.

## Whats New?
---
* 06/22/2015
  * added **load** function to load data into the table
  * added **convert** function to format load data so that it can be inserted
  * added **convertAndLoad** function which combines **load** and **convert** into a single function
  * updated version to **0.1.3**

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

Ignore can be used to define a key in the schema but not create it in the database. This is useful when programmatically defining relationships

##### Example
```js
var schema = {
	credential: {
		id: {type: c.type.integer, primary: true, increments: true},
		name: {type: c.type.string, size: 255},
		username: {type: c.type.string, size: 100},
		encryptedKey: { type: c.type.string, size: 255 }
		user: { ignore: true, table: 'user' }
	}
};
```

# Loading Data
---
Data can be loaded using the load function. It is recommended that you first run your data through the convert function and use the output of that function to insert the data or the combined convertAndLoad function.

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