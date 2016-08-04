// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Example of usage
//


// create a database connection
var db = {
	"client": "pg",
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


schemer.config.info.columnInfo('types').then(function(results) {
	console.log(results);
	process.exit();
});




