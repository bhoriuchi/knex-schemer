/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Data dumping functions
 * 
 * @module lib/core/dump
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 * 
 * @ignore
 */
module.exports = function(config) {
	
	// modules
	var _       = config.lodash;
	var knex    = config.knex;
	var promise = config.promise;
	var util    = config.util;
	
	// dump function
	return function(opts) {
		
		var schema, tables, output, transaction, t;
		output = {};
		
		if (typeof(opts) !== 'object') {
			console.log('WARN: no options were passed to dump');
			return {};
		}
	
		// determine the schema and tables to dump
		if (!_.has(opts, 'schema')) {
			schema      = opts;
			tables      = _.keys(schema);
		}
		else {
			schema      = opts.schema;
			tables      = opts.tables || _.keys(schema);
			tables      = Array.isArray(tables) ? tables : [tables];
			transaction = opts.transaction;
		}
		
		
		// function to do the actual data dump
		var dumpEx = function(trx) {
			
			// loop through each table and dump the data
			return promise.each(tables, function(table) {
				
				// create a new table
				output[table] = [];
				
				// get all data from the table
				return knex.select('*').from(table).then(function(results) {
					
					// add each result to the table
					_.forEach(results, function(result) {
						output[table].push(result);
					});
				});
			})
			.then(function() {
				
				// remove tables that have no results
				_.forEach(output, function(value, name) {
					if (!Array.isArray(value) || value.length === 0) {
						delete output[name];
					}
				});
				
				// return the output
				return output;
			});
		};
		

		// create or use transaction
		// use existing or create a new transaction
		if (transaction) {
			t = dumpEx(transaction);
		}
		else {
			t = knex.transaction(function(trx) {
				return dumpEx(trx);
			});
		}
		
		// wrap the transaction in a bluebird promise
		// this is in order to use caught instead of catch
		return util.wrapPromise(t)
		.caught(function(e) {
			console.log({
				message: 'A dump error occured',
				error: e
			});
		});
		
	};
};