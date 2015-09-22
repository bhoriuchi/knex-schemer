/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * @version 0.1.11
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
		constants: require('./constants'),
		promise:   require('bluebird'),
		lodash:    require('lodash')
	};
	
	
	// import the utility module
	mods.util   = require('./util')(mods);

	// import the info module
	mods.info   = require('./info')(mods);

	// require the loader and manager
	var manager = require('./manage')(mods);
	var loader  = require('./loader')(mods);
	

	// return the public functions and variables
	return {
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
		util:           mods.util
	};
};