// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Functions for loading data
//



module.exports = function(config) {
	
	
	// shorten up the constant references
	var CONST   = config.constants;
	var TYPE    = CONST.type;
	var OPTS    = CONST.options;
	var knex    = config.knex;
	var Promise = config.promise;
	var _       = config.lodash;
	var util    = config.util;
		
	
	
	
	
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
							
							// if a value is optional
							else if (util.optional(colSchema, colName)) {
								dataCol[colName] = null;
							}
							
							// anything else cannot be added
							else if (!util.ignorable(colSchema, colName)){
								validRow = false;
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
						util.checkSchema(data[table], schema[table])) {

					return knex.table(table).insert(data[table]);
				}
				else {
					console.log(data[table]);
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
		convertAndLoad: convertAndLoad,
		checkSchema: util.checkSchema
	};
};