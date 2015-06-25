// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Main entry point for schemer functions
//

var Promise = require('bluebird');
var lodash  = require('lodash');




module.exports = function(knex) {
	
	
	// import local modules
	var constants = require('./constants');
	
	var config = {
			knex: knex,
			constants: constants,
			promise: Promise,
			lodash: lodash
		};

	var manager = require('./manage')(config);
	var loader = require('./loader')(config);
	
	
	
	
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
		loadData: function(data, schema) {
			return loader.loadData(data, schema);
		},
		convert: function(data, schema) {
			return loader.convert(data, schema);
		},
		convertAndLoad: function(data, schema) {
			return loader.convertAndLoad(data, schema);
		},
		constants: constants
	};
};