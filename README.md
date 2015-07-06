

# knex-schemer
---



knex-schemer is a tool that allows you to define a database schema in JSON format and create/update/delete that schema using basic functions. This approach allows you to re-use and extend the schema definition in different parts of your application. It also allows you to create and update database tables quickly. As named, the tool requires a knex instance to operate.

* See the **[WIKI](https://github.com/bhoriuchi/knex-schemer/wiki)** for full documentation
* And the **[Change Log](https://github.com/bhoriuchi/knex-schemer/wiki/Change-Log)** for what's new

# Install
---
```bash
npm install -g knex-schemer
```

# Usage
---
```js
// require the package passing a knex instance
var factory = require('knex-schemer')(knex);

```

##### Complete Example
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