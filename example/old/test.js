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
		"database": "test",
		"charset": "utf8"
	},
	"debug": false
};





// import the modules
var knex    = require('knex')(db);
var schemer = require('../../lib/schemer')(knex);
var schema  = require('./schema')(schemer.constants);
var data    = require('./sample-data');

// drop the tables
schemer.drop(schema.v1).then(function() {
	// test a sync
	return schemer.sync(schema.v1).then(function(result) {
		
		// load the data
		return schemer.convertAndLoad(data, schema.v1).then(function() {
			process.exit();
		});
	});
});





