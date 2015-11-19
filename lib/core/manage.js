/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Schema create and update functions
 * 
 * @module lib/core/manage
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
	 * Creates a new column in the table using a column schema
	 * @param {Table} table - Knex.js table object.
	 * @param {String} name - Column name.
	 * @param {SchemaDefinition} schema - Column schema definition.
	 * @param {Object[]} primary - Primary key.
	 * @ignore
	 */
	function createColumn(table, colName, col, primary) {
		
		// create a column variable
		var column;
		
		// check for increments
		if (_.has(col, OPTS.increments) && col.increments === true) {
			
			// check for UUID type
			if (col.type === TYPE.uuid) {
				
				// UUIDs cannot be auto-incremented or given a
				// default value when used as a primary/incrementing key
				// the insert code should check the schema definition and
				// supply a UUID on insert
				column = table.uuid(colName);
				delete col.defaultTo;
			}
			else {
				column = table.increments(colName);
			}
		}
		
		// check for all other types
		else {
			
			// verify type field is present
			if (!_.has(col, OPTS.type)) {
				return null;
			}
			
			// check types
			if (col.type === TYPE.integer) {
				column = table.integer(colName);
			}
			
			else if (col.type === TYPE.bigInteger) {
				column = table.bigInteger(colName);
			}
			
			else if (col.type === TYPE.string) {
				column = _.has(col, OPTS.size) ?
						table.string(colName, col.size) : table.string(colName);
			}
			
			else if (col.type === TYPE.text) {
				column = _.has(col, OPTS.textType) ?
						table.text(colName, col.textType) : table.text(colName);
			}
			
			else if (col.type === TYPE.float) {
				column = (_.has(col, OPTS.precision) && _.has(col, OPTS.scale)) ?
						table.float(colName, col.precision, col.scale) : table.float(colName);
			}
			
			else if (col.type === TYPE.decimal) {
				column = (_.has(col, OPTS.precision) && _.has(col, OPTS.scale)) ?
						table.decimal(colName, col.precision, col.scale) : table.decimal(colName);
			}
			
			else if (col.type === TYPE.boolean) {
				column = table.boolean(colName);
			}
			
			else if (col.type === TYPE.date) {
				column = table.date(colName);
			}
			
			else if (col.type === TYPE.dateTime) {
				column = table.dateTime(colName);
			}
			
			else if (col.type === TYPE.time) {
				column = table.time(colName);
			}
			
			else if (col.type === TYPE.timestamp) {
				column = _.has(col, OPTS.standard) ?
						table.timestamp(colName, col.standard) : table.timestamp(colName);
			}
			
			else if (col.type === TYPE.binary) {
				column = _.has(col, OPTS.length) ?
						table.binary(colName, col.length) : table.binary(colName);
			}
			
			else if (col.type === TYPE.json) {
				column = _.has(col, OPTS.jsonb) ?
						table.json(colName, col.jsonb) : table.json(colName);
			}
			
			else if (col.type === TYPE.uuid) {
				column = table.uuid(colName);
			}
			
			else {
				console.log('Unknown type: ' + col.type);
				return null;
			}
		}
	
		// index modifier
		if (col.index === true) {
			if (_.has(col, OPTS.indexName) && _.has(col, OPTS.indexType)) {
				column.index(col.indexName, col.indexType);
			}
			else {
				column.index();
			}
		}
		
		// primary modifier
		if (col.primary === true && primary.length === 1) {
			column.primary();
		}
		
		// unique modifier
		if (col.unique === true) {
			column.unique();
		}
		
		// references modifier
		if (_.has(col, OPTS.references)) {
			column.references(col.references);
		}
		
		// inTable modifier
		if (_.has(col, OPTS.inTable)) {
			column.inTable(col.inTable);
		}
		
		// onDelete modifier
		if (_.has(col, OPTS.onDelete)) {
			column.onDelete(col.onDelete);
		}
		
		// onUpdate modifier
		if (_.has(col, OPTS.onUpdate)) {
			column.onUpdate(col.onUpdate);
		}
		
		// defaultTo modifier
		if (_.has(col, OPTS.defaultTo)) {
			column.defaultTo(col.defaultTo);
		}
		
		// unsigned modifier
		if (col.unassigned === true) {
			column.unassigned();
		}
		
		// null-able or not null-able
		if (col.nullable === true) {
			column.nullable();
		}
		else {
			column.notNullable();
		}
		
		// first
		if (col.first === true) {
			column.first();
		}
		
		// after
		if (_.has(col, OPTS.after)) {
			column.after(col.after);
		}
		
		if (_.has(col, OPTS.comment)) {
			column.comment(col.comment);
		}
	}


	/**
	 * Creates a table
	 * @param {Table} table - Knex.js table object.
	 * @param {SchemaDefinition} schema - Column schema definition.
	 * @ignore
	 */
	function createTable(table, schema) {
		
		// get the primary keys
		var primary = util.getPrimaryKeys(schema);
		
		// look at each column
		_.forEach(schema, function(col, colName) {
			
			// check if the column is ignorable
			if (!util.ignorable(col, colName)) {
				createColumn(table, colName, col, primary);
			}
			
			// look for compositeUnique 
			if (col.compositeUnique) {
				
				// create an array to hold the composite key columns
				var cmpArr = [colName];

				// put the value into a unique array
				var cu = Array.isArray(col.compositeUnique) ? col.compositeUnique : [col.compositeUnique];
				
				// validate each column name and add it to the array
				_.forEach(cu, function(name) {
					if (_.has(schema, name)) {
						cmpArr.push(name);
					}
				});
				
				// remove duplicates
				cmpArr = _.uniq(cmpArr);
				
				// make sure there are at least 2 columns
				if (cmpArr.length > 1) {
					table.unique(cmpArr);
				}
			}
		});

		// set any composite keys
		if (Array.isArray(primary) && primary.length > 1) {
			table.primary(primary);
		}
	}


	/**
	 * Creates or updates a table schema
	 * @param {String} table - Table name.
	 * @param {SchemaDefinition} schema - Column schema definition.
	 * @param {Transaction} transaction - Knex.js transaction.
	 * @returns {Promise}
	 * @ignore
	 */
	function syncTable(tableName, schema, trx) {
		
		// check if the database has the table
		return trx.schema.hasTable(tableName).then(function(exists) {
			
			// if the table does not exist, create it
			if (!exists && _.find(schema, 'type')) {
				return trx.schema.createTable(tableName, function(table) {
					createTable(table, schema);
				});
			}
			
			// if it does exist, update it as needed
			else {
				
				// get the table definition
				return knex(tableName)
				.columnInfo()
				.transacting(trx)
				.then(function(info) {
					
					console.log('column info', info);
					
					// remove any columns that should not exist
					return Promise.map(_.keys(info), function(colName) {
						
						// if the schema definition doesn't contain the
						// column, drop the column
						if (!_.has(schema, colName)) {
							return trx.schema.table(tableName, function(table) {
								table.dropColumn(colName);
							});
						}
					})
					.then(function() {
						
						// since the next then needs to use info, return it
						return info;
					});
				})
				.then(function(info) {
					
					// add any missing columns
					return Promise.map(_.keys(schema), function(colName) {
						
						// if the column info does not contain the column
						if (!_.has(info, colName)) {
							
							// call the table and create the column
							return trx.schema.table(tableName, function(table) {
								createColumn(table, colName, schema[colName], []);
							});
						}
					})
					.then(function() {
						return info;
					});
				});
			}
		});
	}
	
	
	/**
	 * Creates or updates a database schema
	 * @param {SchemaDefinition} schema - Database schema definition.
	 * @param {Transaction} [transaction] - Knex.js transaction.
	 * @returns {Promise}
	 */
	function sync(schema, transaction) {

		var t;
		
		// create a function to do the actual work
		var syncEx = function(trx) {
			
			// loop through each table
			return Promise.map(_.keys(schema), function(tableName) {
				
				// handle temporary tables by not creating them
				if (schema[tableName]._temporary === true) {
					return;
				}
				
				// call the syncTable method to sync the current table
				return syncTable(tableName, schema[tableName], trx)
				.then(function(result) {
					return result;
				});
			});
		};
		
		// use an existing transaction or create
		// a new transaction to run the sync
		if (transaction) {
			t = syncEx(transaction);
		}
		else {
			t = config.knex.transaction(function(trx) {
				return syncEx(trx);
			});
		}

		
		// wrap the transaction in a bluebird promise
		// this is in order to use caught instead of catch
		return util.wrapPromise(t)
		.caught(function(e) {
			console.log({
				message: 'A sync error occured',
				error: e
			});
		});
	}
	
	
	/**
	 * Drops a table
	 * @param {String} name - Table name to drop.
	 * @param {Transaction} transaction - Knex.js transaction.
	 * @returns {Promise}
	 * @ignore
	 */
	function dropTable(tableName, trx) {
		return trx.schema.dropTableIfExists(tableName);
	}
	

	/**
	 * Drops all the tables defined in the schema definition
	 * @param {SchemaDefinition} schema - Database schema to drop.
	 * @param {Transaction} [transaction] - Knex.js transaction.
	 * @returns {Promise}
	 */
	function drop(schema, transaction) {
		
		var t;
		
		// define a function that does the actual dropping
		var dropEx = function(trx) {
			return Promise.map(_.keys(schema), function(tableName) {
				return dropTable(tableName, trx);
			});
		};
		
		// check for a transaction and use it or create a new one
		if (transaction) {
			t = dropEx(transaction);
		}
		else {
			t = knex.transaction(function(trx) {
				return dropEx(trx);
			});
		}

		// wrap the transaction in a bluebird promise
		// this is in order to use caught instead of catch
		return util.wrapPromise(t)
		.caught(function(e) {
			console.log({
				message: 'A drop error occured',
				error: e
			});
		});
	}
	

	// return methods
	return {
		createTable:    createTable,
		createColumn:   createColumn,
		drop:           drop,
		dropTable:      dropTable,
		getPrimaryKeys: util.getPrimaryKeys,
		sync:           sync,
		syncTable:      syncTable
	};
};