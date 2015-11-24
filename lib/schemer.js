/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Design, create, and update a relational database schema using JSON
 * 
 * @module knex-schemer
 * @param {knex} knex - An instance of knex.
 * @returns {Object}
 */
module.exports = function(knex) {

	// create an object with the required modules
	// this will be passed to the loader/manager
	var mods = {
		knex:      knex,
		constants: require('./core/constants'),
		promise:   require('bluebird'),
		lodash:    require('lodash')
	};
	
	
	// import the utility module
	mods.util   = require('./core/util')(mods);

	// import the info module
	mods.info   = require('./core/info')(mods);

	// require the loader and manager
	var manager = require('./core/manage')(mods);
	var loader  = require('./core/loader')(mods);
	var dump    = require('./core/dump')(mods);
	

	// return the public functions and variables
	return {
		type:           'knex-schemer',
		version:        '0.1.16',
		config:         mods,
		convert:        loader.convert,
		convertAndLoad: loader.convertAndLoad,
		constants:      mods.constants,
		drop:           manager.drop,
		dropTable:      manager.dropTable,
		loadData:       loader.loadData,
		loader:         loader,
		manager:        manager,
		sync:           manager.sync,
		syncTable:      manager.syncTable,
		dump:           dump,
		util:           mods.util
	};
};