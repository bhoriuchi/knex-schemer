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
var schemer = require('../lib/schemer')(knex);
var schema  = require('./schema')(schemer.constants);
var data    = require('./sample-data');

// test a sync
console.log('Starting Sync');
return schemer.sync(schema.v2).then(function(result) {
	console.log(result);
	console.log('Sync Complete');
	process.exit();
});





