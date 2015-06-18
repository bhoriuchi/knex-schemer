// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Functions for managing the database tables based 
//              on a schema definition
//


module.exports = function(config) {
	
	
	// shorten up the constant references
	var TYPE    = config.constants.type;
	var OPTS    = config.constants.options;
	var knex    = config.knex;
	var Promise = config.promise;
	
	
	
	
	// function to obtain primary keys from the schema config
	function getPrimaryKeys(schema) {
		
		var cols = Object.keys(schema);
		var primary = [];
		
		// first check for composite keys
		for (var i = 0; i < cols.length; i++) {

			var colName = cols[i];
			var col = schema[colName];
			
			// check for primary keys
			if (col.hasOwnProperty(OPTS.primary) && col.primary) {
				if (primary.length === 0) {
					primary.push(colName);
				}
			}
		}
		return primary;
	}
	

	
	
	
	// creates a new column in the table based on the column schema
	function createColumn(table, colName, col, primary) {
		
		var column;
		
		// check for increments
		if (col.hasOwnProperty(OPTS.increments) && col.increments) {
			column = table.increments(colName);
		}
		
		// check for all other types
		else {
			
			// verify type field is present
			if (!col.hasOwnProperty(OPTS.type)) {
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
				column = (col.hasOwnProperty(OPTS.size)) ? table.string(colName, col.size) : table.string(colName);
			}
			else if (col.type === TYPE.text) {
				column = (col.hasOwnProperty(OPTS.textType)) ? table.text(colName, col.textType) : table.text(colName);
			}
			else if (col.type === TYPE.float) {
				column = (col.hasOwnProperty(OPTS.precision) && col.hasOwnProperty(OPTS.scale)) ?
						table.float(colName, col.precision, col.scale) : table.float(colName);
			}
			else if (col.type === TYPE.decimal) {
				column = (col.hasOwnProperty(OPTS.precision) && col.hasOwnProperty(OPTS.scale)) ?
						table.decimal(colName, col.precision, col.scale) : table.decimal(colName);
			}
			else if (col.type === TYPE.boolean) {
				column = table.boolean(colName);
			}
			else if (col.type === TYPE.date) {
				column = table.boolean(colName);
			}
			else if (col.type === TYPE.dateTime) {
				column = table.dateTime(colName);
			}
			else if (col.type === TYPE.time) {
				column = table.time(colName);
			}
			else if (col.type === TYPE.timestamp) {
				column = (col.hasOwnProperty(OPTS.standard)) ? table.timestamp(colName, col.standard) : table.timestamp(colName);
			}
			else if (col.type === TYPE.binary) {
				column = (col.hasOwnProperty(OPTS.length)) ? table.binary(colName, col.length) : table.binary(colName);
			}
			else if (col.type === TYPE.json) {
				column = (col.hasOwnProperty(OPTS.jsonb)) ? table.json(colName, col.jsonb) : table.json(colName);
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
		if (col.hasOwnProperty(OPTS.index) && col.index) {
			if (col.hasOwnProperty(OPTS.indexName) && col.hasOwnProperty(OPTS.indexType)) {
				column.index(col.indexName, col.indexType);
			}
			else {
				column.index();
			}
		}
		
		// primary modifier
		if (col.hasOwnProperty(OPTS.primary) && col.primary && primary.length === 1) {
			column.primary();
		}
		
		// unique modifier
		if (col.hasOwnProperty(OPTS.unique) && col.unique) {
			column.unique();
		}
		
		// references modifier
		if (col.hasOwnProperty(OPTS.references)) {
			column.references(col.references);
		}
		
		// inTable modifier
		if (col.hasOwnProperty(OPTS.inTable)) {
			column.inTable(col.inTable);
		}
		
		// onDelete modifier
		if (col.hasOwnProperty(OPTS.onDelete)) {
			column.onDelete(col.onDelete);
		}
		
		// onUpdate modifier
		if (col.hasOwnProperty(OPTS.onUpdate)) {
			column.onUpdate(col.onUpdate);
		}
		
		// defaultTo modifier
		if (col.hasOwnProperty(OPTS.defaultTo)) {
			column.defaultTo(col.defaultTo);
		}
		
		// unsigned modifier
		if (col.hasOwnProperty(OPTS.unassigned) && col.unassigned) {
			column.unassigned();
		}
		
		// nullable or not nullable
		if (col.hasOwnProperty(OPTS.nullable) && col.nullable) {
			column.nullable();
		}
		else {
			column.notNullable();
		}
		
		// first
		if (col.hasOwnProperty(OPTS.first) && col.first) {
			column.first();
		}
		
		// after
		if (col.hasOwnProperty(OPTS.after)) {
			column.after(col.after);
		}
		
		if (col.hasOwnProperty(OPTS.comment)) {
			column.comment(col.comment);
		}
	
	}

	
	
	
	
	// function to create table schema
	function createTableFunction(table, schema) {
		
		var cols = Object.keys(schema);
		var primary = getPrimaryKeys(schema);
		
		// loop through each column defined
		for (var i = 0; i < cols.length; i++) {
			
			var colName = cols[i];
			var col = schema[colName];
			
			createColumn(table, colName, col, primary);
		}
		
		// set any composite keys
		if (Array.isArray(primary) && primary.length > 1) {
			table.unique(primary);
		}
	}
	
	
	
	
	
	// creates a table if it doesnt exist
	function syncTable(tableName, schema) {
		
		var currentColumns, columns, index, currentInfo, lastCol;
		
		return config.knex.schema
		.hasTable(tableName)
		.then(function(exists) {

			if (!exists) {
				return config.knex.schema.createTable(tableName, function(table) {
					createTableFunction(table, schema);
				});
			}
			else {
				
				// get the defined columns
				columns = Object.keys(schema);
				index   = 0;
				lastCol = '';
				
				// get the table definition
				return knex(tableName).columnInfo().then(function(info) {
					return info;
				})
				.then(function(info) {
					
					// set the info for use through out the function
					currentInfo    = info;
					currentColumns = Object.keys(info);

					// remove any columns that should not exist
					Promise.each(currentColumns, function(col) {
						
						if (!schema.hasOwnProperty(col)) {
							return knex.schema.table(tableName, function(table) {
								table.dropColumn(col);
							});
						}
				
					});
				})
				.then(function() {
					
					// add any missing columns
					Promise.each(columns, function(colName) {
						
						if (!currentInfo.hasOwnProperty(colName)) {
							return knex.schema.table(tableName, function(table) {
								var primary = [];
								var col = schema[colName];
								createColumn(table, colName, col, primary);
							});
						}
				
					});
				})
				.then(function() {
					
					// future update of column types and properties goes here
					return;
				});
			}
		});
	}
	
	
	
	
	
	// function to sync tables with defined schema
	function sync(dbSchema) {

		return Promise.each(Object.keys(dbSchema), function(tableName) {
			return syncTable(tableName, dbSchema[tableName]).then(function(result) {
				return result;
			});
		});
		
	}
	
	
	
	
	
	// drops a single table by name
	function dropTable(tableName) {
		return knex.schema.dropTableIfExists(tableName);
	}
	
	
	
	
	
	// function to drop all tables specified
	function drop(dbSchema) {
		
		return Promise.each(Object.keys(dbSchema), function(tableName) {
			return dropTable(tableName);
		});
	}
	
	
	
	
	
	// return public functions
	return {
		sync: sync,
		syncTable: syncTable,
		drop: drop,
		dropTable: dropTable
	};
};