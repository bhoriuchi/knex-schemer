/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Utility functions
 * 
 * @module lib/core/util
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
	

	/**
	 * Extend a schema object
	 * @param {Object} model - Model to extend.
	 * @param {Object} extending - Model that is extending.
	 * @returns {Object} Extended model. 
	 */
	function extend(model, extending) {
		return _.merge(_.cloneDeep(model), _.cloneDeep(extending));
	}

	
	/**
	 * Obtain primary keys from the schema definition
	 * @param {SchemaDefinition} schema - Schema definition.
	 * @returns {String[]|Number[]} Primary Key. 
	 */
	function getPrimaryKeys(schema) {
		
		var primary = [];
		
		_.forEach(schema, function(col, name) {
			if (col.primary === true) {
				primary.push(name);
			}
		});
		
		return primary;
	}

	
	/**
	 * Determine if a column is ignore-able
	 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
	 * @param {String} name - Name of the column to analyze.
	 * @returns {Boolean} 
	 */
	function ignorable(col, colName) {
		
		// get object keys
		var keys = _.keys(col);
		var rels = _.keys(CONST.relations);
		var exts = _.keys(CONST.extend);
		
		// verify that the column name is a string
		colName = (typeof(colName) === 'string') ? colName : '';
		
		// check for individual ignore-able conditions
		var related = (_.intersection(keys, rels).length === 0)  ? false : true;
		var extend  = (_.intersection(keys, exts).length === 0)  ? false : true;
		var virtual = _.contains(keys, OPTS.virtuals)               ? true  : false;
		var dashCol = (colName.length > 0 && colName[0] === '_') ? true  : false;
		var ignore  = (!_.has(col, OPTS.ignore))                 ? false : col.ignore;
		
		// check for any ignore-able conditions
		if (ignore || related || extend || dashCol || virtual) {
			return true;
		}
		
		// otherwise not ignore-able
		return false;
	}
	

	/**
	 * Determine if a column is null-able
	 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
	 * @returns {Boolean} 
	 */
	function nullable(col) {
		return (!_.has(col, OPTS.nullable) || col.nullable === false) ? false : true;
	}
	
	
	/**
	 * Determine if a column has a default
	 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
	 * @returns {Boolean} 
	 */
	function hasDefault(col) {
		return _.has(col, OPTS.defaultTo);
	}
	
	
	/**
	 * Determine if a column is required
	 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
	 * @param {String} name - Name of the column to analyze.
	 * @returns {Boolean} 
	 */
	function required(col, colName) {
		return (!nullable(col) && !ignorable(col, colName) && !hasDefault(col));
	}
	
	
	/**
	 * Determine if a column is optional
	 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
	 * @param {String} name - Name of the column to analyze.
	 * @returns {Boolean} 
	 */
	function optional(col, colName) {
		return (!ignorable(col, colName) && (nullable(col) || hasDefault(col)));
	}
	
	
	
	/**
	 * Check that the data being entered is compatible with the schema
	 * @param {Object[]} data - Data to validate.
	 * @param {SchemaDefinition} schema - Schema definition of the table the data belongs to.
	 * @returns {Boolean} 
	 */
	function checkSchema(data, tableSchema) {
		
		// validate the arguments
		if (!Array.isArray(data) || data.length === 0 ||
			typeof (tableSchema) !== 'object') {
			return false;
		}
		
		// loop through each data object and column
		_.forEach(data, function(datum) {
			_.forEach(tableSchema, function(col, colName) {
				
				if (!_.has(datum, colName) && required(col, colName) &&
					(!_.has(col, 'increments') || !col.increments)) {
					
					console.log('WARN: property or required mismatch on', colName, col);
					return false;
				}
			});
		});
		
		// valid if no violations have returned
		return true;
	}
	
	
	/**
	 * Place an object inside a promise and return the promise
	 * @param {Object} object - Object to resolve.
	 * @returns {Promise} 
	 */
	function wrapPromise(obj) {
		return new Promise(function(resolve) {
			resolve(obj);
		});
	}
	

	// return functions
	return {
		extend:         extend,
		checkSchema:    checkSchema,
		getPrimaryKeys: getPrimaryKeys,
		ignorable:      ignorable,
		nullable:       nullable,
		optional:       optional,
		required:       required,
		wrapPromise:    wrapPromise
	};
};