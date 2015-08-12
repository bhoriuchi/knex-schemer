// Author: Branden Horiuchi <bhoriuchi@gmail.com>
// Description: Helper functions
//


module.exports = function(config) {
	
	
	// shorten up the constant references
	var CONST   = config.constants;
	var TYPE    = CONST.type;
	var OPTS    = CONST.options;
	var knex    = config.knex;
	var Promise = config.promise;
	var _       = config.lodash;
	
	
	
	
	
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
				primary.push(colName);
			}
		}
		return primary;
	}
	
	

	
	
	
	// determine if a column is ignoreable
	function ignorable(col, colName) {
		
		colName = colName || null;
		
		// check for individual ignorable conditions
		var related = (_.intersection(Object.keys(col), Object.keys(CONST.relations)).length === 0) ? false : true;
		var extend  = (_.intersection(Object.keys(col), Object.keys(CONST.extend)).length === 0) ? false : true;
		var ignore  = (!col.hasOwnProperty(OPTS.ignore)) ? false : col.ignore;
		var dashCol = (colName !== null && colName.substring(0,1) === '_') ? true: false;
		
		
		// check for any ignorable conditions
		if (ignore || related || extend || dashCol) {
			return true;
		}
		
		
		// otherwise not ignorable
		return false;
	}
	
	
	
	
	
	// check if the column is nullable
	function nullable(col) {
		
		return (!col.hasOwnProperty(OPTS.nullable) || col[OPTS.nullable] === false) ? false : true;
	}
	
	
	// default to
	function hasDefault(col) {
		if (col.hasOwnProperty(OPTS.defaultTo)) {
			return true;
		}
		return false;
	}
	
	
	// function to check if a column is required
	function required(col, colName) {
		
		if (!nullable(col) && !ignorable(col, colName) && !hasDefault(col)) {
			return true;
		}
		return false;
	}
	
	
	
	
	
	// function to check if a column is optional
	function optional(col, colName) {
		if (!ignorable(col, colName) && (nullable(col) || hasDefault(col))) {
			return true;
		}
		return false;
	}
	
	
	
	
	
	// function to check field
	function checkSchema(data, tableSchema) {
		
		// make sure that we are working with objects
		if (!Array.isArray(data) ||
				typeof (tableSchema) !== 'object' ||
				data.length === 0) {
			
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
				if (!data[i].hasOwnProperty(colName) && required(col, colName) && (!col.hasOwnProperty('increments') || !col.increments)) {
					console.log('property or required mismatch');
					return false;
				}
			}
		}
		
		// if this was reached, the schema is valid
		return true;
	}
	
	
	
	
	
	// return functions
	return {
		getPrimaryKeys: getPrimaryKeys,
		ignorable: ignorable,
		checkSchema: checkSchema,
		required: required,
		optional: optional,
		nullable: nullable
	};
};