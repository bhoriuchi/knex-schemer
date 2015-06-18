

# knex-schemer
---
knex-schemer is a tool that allows you to define a database schema in JSON format and create/update/delete that schema using basic functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a knex instance to operate.
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
			encryptedKey: {type: c.type.string, size: 255}		}
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


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.