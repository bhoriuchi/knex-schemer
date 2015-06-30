// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Main entry point for schemer functions
//

var Promise = require('bluebird');
var lodash  = require('lodash');




module.exports = function(knex) {
	
	
	// import local modules
	var constants = require('./constants');
	
	
	// create an object with the required modules
	// this will be passed to the loader/manager
	var config = {
			knex: knex,
			constants: constants,
			promise: Promise,
			lodash: lodash
		};
	
	
	// import util
	var util = require('./util')(config);
	
	
	// add the util to the config
	lodash.merge(config, { util: util });


	// require the loader and manager
	var manager = require('./manage')(config);
	var loader  = require('./loader')(config);
	
	
	
	
	// return the public functions and variables
	return {
		sync: manager.sync,
		syncTable: manager.syncTable,
		drop: manager.drop,
		dropTable: manager.dropTable,
		loadData: loader.loadData,
		convert: loader.convert,
		convertAndLoad: loader.convertAndLoad,
		constants: constants,
		manager: manager,
		loader: loader,
		util: util
	};
};