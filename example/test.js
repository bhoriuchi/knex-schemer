// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Example of usage
//


// create a database connection
var db = {
	"client": "mysql",
	"connection": {
		"host": "127.0.0.1",
		"user": "db",
		"password": "password",
		"database": "mims",
		"charset": "utf8"
	},
	"debug": false
};





// import the modules
var knex    = require('knex')(db);
var schemer = require('../lib/schemer')(knex);
var c       = schemer.constants;





// version 1 database schema definition
var schema_v1 = {

		key_value_pair: {
			object_type: {type: c.type.string, size: 50},
			object_id: {type: c.type.integer},
			key: {type: c.type.string, size: 100},
			value: {type: c.type.text},
			type: {type: c.type.string, size: 50, nullable: true}
		},
		credential: {
			id: {type: c.type.integer, primary: true, increments: true},
			name: {type: c.type.string, size: 255},
			username: {type: c.type.string, size: 100},
			encryptedKey: {type: c.type.string, size: 255},
			created: {type: c.type.string, size: 100}
		},
		key_value_parse_config: {
			id: {type: c.type.integer, primary: true, increments: true},
			type: {type: c.type.string, size: 50},
			splitDelimiter: {type: c.type.string, size: 8, nullable: true},
			splitKeyIndex: {type: c.type.integer, nullable: true},
			splitValueIndex: {type: c.type.integer, nullable: true},
			regexKey: {type: c.type.string, size: 255, nullable: true},
			regexValue: {type: c.type.string, size: 255, nullable: true}
		},
		tag_translation: {
			extType: {type: c.type.integer},
			tag_id: {type: c.type.integer},
			value: {type: c.type.string, size: 255},
			ignoreCase: {type: c.type.boolean},
			testvalue2: {type: c.type.string, size: 5},
			testvalue3: {type: c.type.string, size: 5}
		}
};





// test a sync
schemer.sync(schema_v1).then(function(result) {
	console.log(result);
	process.exit();
});





