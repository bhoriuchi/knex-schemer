// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Main entry point for schemer functions
//

var Promise = require('bluebird');





module.exports = function(knex) {
	
	
	// import local modules
	var constants = require('./constants');
	var manager = require('./manage')({
		knex: knex,
		constants: constants,
		promise: Promise
	});
	
	
	
	
	
	// return the public functions and variables
	return {
		sync: function(schema) {
			return manager.sync(schema);
		},
		syncTable: function(tableName, tableSchema) {
			return manager.syncTable(tableName, tableSchema);
		},
		drop: function(schema) {
			return manager.drop(schema);
		},
		dropTable: function(tableName) {
			return manager.dropTable(tableName);
		},
		constants: constants
	};
};