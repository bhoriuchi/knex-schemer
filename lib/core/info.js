/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Custom info functions
 * 
 * @module lib/core/info
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 * 
 * @ignore
 */
module.exports = function(config) {
	
	// modules
	var _     = config.lodash;
	var knex  = config.knex;
	var util  = config.util;
	
	// get connection info
	var client = knex.client.config.client;
	var dbname = knex.client.connectionSettings.database;
	
	
	function postgresType(raw) {
		
		if (raw.indexOf('character varying') !== -1) {
			return 'string';
		}
		else if (raw === 'bigint') {
			return 'bigInteger';
		}
		else if (raw === 'bytea') {
			return 'binary';
		}
		else if (raw.indexOf('timestamp with time zone') !== -1) {
			return 'timestamp';
		}
		else if (raw.indexOf('numeric') !== -1) {
			return 'decimal';
		}
		else if (raw === 'real') {
			return 'float';
		}
		else if (raw.indexOf('time without time zone') !== -1) {
			return 'time';
		}
		else {
			return raw;
		}
		
	}
	
	
	
	/**
	 * Get column info SQL
	 */
	function columnInfo(table, transaction) {
		
		var t, sql;
		
		// create a function to do the work
		var columnInfoEx = function(trx) {
			if (client === 'mysql' || client === 'maria' || client === 'mariadb') {

				return trx.raw(
					'select * from information_schema.columns ' +
					'where table_schema = \'' + dbname +
					'\' and table_name = \'' + table + '\''
				)
				.then(function(result) {
					
					if (result.length > 0 && result[0].length > 0) {
						var info = {};
						
						// create a custom info object
						_.forEach(result[0], function(column) {
							
							console.log(column);
							
							var name = column.COLUMN_NAME;
							
							info[name]              = {};
							
							if (column.COLUMN_DEFAULT) {
								info[name].defaultValue = column.COLUMN_DEFAULT;
							}

							info[name].type         = column.DATA_TYPE;
							info[name].maxLength    = column.CHARACTER_MAXIMUM_LENGTH;
							info[name].octetLength  = column.CHARACTER_OCTET_LENGTH;
							info[name].nullable     = column.IS_NULLABLE === 'YES';
							info[name].scale        = column.NUMERIC_SCALE;
							info[name].precision    = column.NUMERIC_PRECISION || column.DATETIME_PRECISION;
							info[name].unsigned     = _.includes(column.COLUMN_TYPE.split(' '), 'unsigned');
							info[name].primary      = column.COLUMN_KEY ? _.includes(column.COLUMN_KEY.split(','), 'PRI') : false;
							info[name].unique       = column.COLUMN_KEY ? _.includes(column.COLUMN_KEY.split(','), 'UNI') : false;
						});
						return info;
					}
				});
			}
			else if (client === 'pg' || client === 'postgres' || client === 'postgresdb') {

				// postgres specific column info query
				sql =  'select (select a.attname from pg_index i, pg_attribute a ' +
					'where i.indrelid = \'' + table + '\'::regclass and i.indisprimary ' +
					'and a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) ' +
					'and a.attname = c.column_name) as primary_key, ' +
					'c.column_name, c.column_default, c.data_type, ' +
					'c.character_maximum_length, c.character_octet_length, ' +
					'c.is_nullable, c.numeric_scale, c.numeric_precision, ' +
					'c.datetime_precision ' +
					'from information_schema.columns c ' +
					'where c.table_name = \'' + table + '\'';
				
				
				// execute query
				return trx.raw(sql)
				.then(function(result) {
					
					if (_.has(result, 'rows') && result.rows.length > 0) {
						var info = {};
						
						// create a custom info object
						_.forEach(result.rows, function(column) {
							
							var name = column.column_name;
							
							info[name]              = {};
							
							// get the column default							
							if (column.column_default) {
								var def =  column.column_default.split('::');
								
								if (def.length === 2 && def[1] === column.data_type) {
									info[name].defaultValue = def[0].replace(/\'/g, '');
								}
							}

							
							info[name].type         = postgresType(column.data_type);
							info[name].maxLength    = column.character_maximum_length;
							info[name].octetLength  = column.character_octet_length;
							info[name].nullable     = column.is_nullable === 'YES';
							info[name].scale        = column.numeric_scale;
							info[name].precision    = column.numeric_precision || column.datetime_precision;
							info[name].unsigned     = false; // postgres does not have unsigned types
							info[name].primary      = column.primary_key === column.column_name;
							info[name].unique       = null; //column.COLUMN_KEY ? _.includes(column.COLUMN_KEY.split(','), 'UNI') : false;
							
						});
						return info;
					}
				});
			}
			else {
				return knex(table).columnInfo().transacting(trx);
			}
		};
		
		// use an existing transaction or create
		// a new transaction to run the info
		if (transaction) {
			t = columnInfoEx(transaction);
		}
		else {
			t = knex.transaction(function(trx) {
				return columnInfoEx(trx);
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
	
	return {
		columnInfo: columnInfo
	};
};