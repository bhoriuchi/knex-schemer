/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Data loading functions
 * 
 * @module lib/loader
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 */
module.exports = function(config) {
	
	
	// constants
	var CONST   = config.constants;
	var TYPE    = CONST.type;
	var OPTS    = CONST.options;
	
	
	// modules
	var knex    = config.knex;
	var Promise = config.promise;
	var _       = config.lodash;
	var util    = config.util;
		
	
	/**
	 * Attempt to convert data to be compatible with the schema definition
	 * @param {Object} data - Data to analyze.
	 * @param {Object} schema - Schema definition.
	 * @returns {Object[]} Converted data. 
	 */ 
	function convert(data, schema) {
	
		// create an object to store the converted data
		var converted = {};
		
		// loop through each table in the data object
		_.forEach(data, function(dTable, dName) {
			
			// verify that the schema has the table
			if (_.has(schema, dName)) {
				
				// create a new key to store data
				converted[dName] = [];
				
				// loop through each data object in the current table
				_.forEach(dTable, function(datum) {
					
					var dataCol  = {};
					var validRow = true;
					
					// loop through each column in the table
					_.forEach(schema[dName], function(col, colName) {
						
						// if a value exists, add it
						if (_.has(datum, colName)) {
							dataCol[colName] = datum[colName];
						}
						
						// if a value is optional or has a default
						else if (util.optional(col, colName)) {
							dataCol[colName] = _.has(col, OPTS.defaultTo) ? col.defaultTo : null;
						}
						
						// anything else cannot be added
						else if (!util.ignorable(col, colName) &&
								(!_.has(col, OPTS.increments) || !col.increments)){
							console.log(
								'WARN: the field',
								colName, 'is missing or has invalid data in',
								dName + ':', datum, 'and will not be inserted'
							);
							validRow = false;
						}
					});
					
					// add the dataColumn
					if (validRow) {
						converted[dName].push(dataCol);
					}
				});
			}
		});
		
		// return the converted data
		return converted;
	}
	
	
	/**
	 * Load data into the database
	 * @param {Object} data - Data to load.
	 * @param {Object} schema - Schema definition.
	 * @returns {Promise} 
	 */ 
	function loadData(data, schema) {
		
		// create a new transaction
		var t = knex.transaction(function(trx) {
			
			// map the results of each promise
			return Promise.map(_.keys(data), function(tableName) {
				
				// reference the data table
				var dTable = data[tableName];
				
				// check if the table exists
				return trx.schema.hasTable(tableName).then(function(exists) {
					
					// check that the data is stored in an array and that
					// it is valid
					if (exists && Array.isArray(dTable) &&
							util.checkSchema(dTable, schema[tableName])) {

						// insert the data
						return trx.table(tableName).insert(dTable);
					}
					else {
						console.log('WARN: Failed to load data for', tableName,
							', the data was incorrectly formatted or missing required data');
					}
				});
			});
		});
		
		// wrap the transaction in a bluebird promise
		// this is in order to use caught instead of catch
		return util.wrapPromise(t)
		.caught(function(e) {
			console.log({
				message: 'A load error occured',
				error: e
			});
		});
	}
	
	
	/**
	 * Convert and load the data in one method call
	 * @param {Object} data - Data to load.
	 * @param {Object} schema - Schema definition.
	 * @returns {Promise} 
	 */ 
	function convertAndLoad(data, schema) {
		return loadData(convert(data, schema), schema);
	}
	

	// return the methods
	return {
		loadData:       loadData,
		convert:        convert,
		convertAndLoad: convertAndLoad,
		checkSchema:    util.checkSchema
	};
};