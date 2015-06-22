// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Functions for loading data
//



module.exports = function(config) {
	
	
	// shorten up the constant references
	var TYPE    = config.constants.type;
	var OPTS    = config.constants.options;
	var knex    = config.knex;
	var Promise = config.promise;
	
	// function to check field
	function checkSchema(data, tableSchema) {
		
		// make sure that we are working with objects
		if (!Array.isArray(data) || typeof (tableSchema) !== 'object') {
			return false;
		}
		
		var cols = Object.keys(tableSchema);
		
		for(var i = 0; i < data.length; i++) {
			
			if (typeof (data[i]) !== 'object') {
				return false;
			}
			
			for(var j = 0; j < cols.length; j++) {
				
				var colName = cols[j];
				var col     = tableSchema[colName];
				
				// check if the current column is not nullable and is missing the column and
				// is not an ignore column or ignore is set to false
				if ((!col.hasOwnProperty(OPTS.nullable) || col[OPTS.nullable] === false) &&
						!data[i].hasOwnProperty(colName) &&
						(!col.hasOwnProperty(OPTS.ignore) || col[OPTS.ignore] === false)) {
					return false;
				}
			}
		}
		
		// if this was reached, the schema is valid
		return true;
	}
	
	
	
	
	
	// return data with data that is usable to the schema
	function convert(data, schema) {
	
		var outData = {};
		
		if (typeof (data) === 'object' || typeof (schema) === 'object') {
			
			//  get the keys
			var dataTables   = Object.keys(data);
			var schemaTables = Object.keys(schema);
			
			// loop through the data tables
			for (var i = 0; i < dataTables.length; i++) {
				
				var dt  = dataTables[i];
				var dta = data[dt];
				
				// check that the table is in the schema
				if (schema.hasOwnProperty(dt)) {
					
					var tableSchema = schema[dt];
					var cols        = Object.keys(tableSchema);
					outData[dt]     = [];
					
					// loop through the specific table data
					for (var j = 0; j < dta.length; j++) {
						
						var dtData   = dta[j];
						var dataCol  = {};
						var validRow = true;
						
						// loop through each defined column
						for (var k = 0; k < cols.length; k++) {
							
							var colName   = cols[k];
							var colSchema = tableSchema[colName];
							
							
							// if a value exists, add it
							if (dtData.hasOwnProperty(colName)) {
								dataCol[colName] = dtData[colName];
							}
							
							// if a value foesnt exist and its nullable, add a null
							else if (colSchema.hasOwnProperty(OPTS.nullable) &&
									colSchema[OPTS.nullable]) {
								dataCol[colName] = null;
							}
							
							// anything else cannot be added
							else {
								
								if (!colSchema.hasOwnProperty(OPTS.ignore) || colSchema[OPTS.ignore] !== true) {
									validRow = false;
								}
							}
						}
						
						// add the dataColumn
						if (validRow) {
							outData[dt].push(dataCol);
						}
					}
				}
			}
		}
		
		return outData;
	}
	
	
	
	
	
	// load the table data
	function loadData(data, schema) {
		
		return Promise.each(Object.keys(data), function(table) {
			return knex.schema.hasTable(table).then(function(exists) {
				if (exists && Array.isArray(data[table]) &&
						checkSchema(data[table], schema[table])) {
					
					return knex.table(table).insert(data[table]);
				}
				else {
					console.log('Failed to load data for ' + table);
				}
			});
		});
	}
	
	
	
	
	
	// function to convert and load all the data
	function convertAndLoad(data, schema) {
		
		var convertedData = convert(data, schema);
		return loadData(convertedData, schema);
	}
	
	
	
	
	
	// public functions
	return {
		loadData: loadData,
		convert: convert,
		convertAndLoad: convertAndLoad
	};
};