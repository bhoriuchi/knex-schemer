'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Promise$1 = _interopDefault(require('bluebird'));
var manakin = _interopDefault(require('manakin'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function isString(obj) {
  return typeof obj === 'string';
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isDate(obj) {
  return obj instanceof Date;
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function isHash(obj) {
  return isObject(obj) && !isArray(obj) && !isDate(obj) && obj !== null;
}

function uniq(arr) {
  return [].concat(toConsumableArray(new Set(arr)));
}

function includes(obj, key) {
  try {
    return isArray(obj) && obj.indexOf(key) !== -1;
  } catch (err) {
    return false;
  }
}

function intersection(a, b) {
  if (!isArray(a) || !isArray(b)) return [];
  var ven = [];
  forEach(a, function (val) {
    if (includes(b, val)) ven.push(val);
  });
  return uniq(ven);
}

function ensureArray() {
  var obj = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  return isArray(obj) ? obj : [obj];
}

function keys(obj) {
  try {
    return Object.keys(obj);
  } catch (err) {
    return [];
  }
}

function stringToPathArray(pathString) {
  // taken from lodash - https://github.com/lodash/lodash
  var pathRx = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;
  var pathArray = [];

  if (isString(pathString)) {
    pathString.replace(pathRx, function (match, number, quote, string) {
      pathArray.push(quote ? string : number !== undefined ? Number(number) : match);
      return pathArray[pathArray.length - 1];
    });
  }
  return pathArray;
}

function has(obj, path) {
  var value = obj;
  var fields = isArray(path) ? path : stringToPathArray(path);
  if (fields.length === 0) return false;
  try {
    for (var f in fields) {
      if (!value[fields[f]]) return false;else value = value[fields[f]];
    }
  } catch (err) {
    return false;
  }
  return true;
}

function forEach(obj, fn) {
  try {
    if (Array.isArray(obj)) {
      var idx = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var val = _step.value;

          if (fn(val, idx) === false) break;
          idx++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      for (var key in obj) {
        if (fn(obj[key], key) === false) break;
      }
    }
  } catch (err) {
    return;
  }
}

function merge() {
  var args = Array.prototype.slice.call(arguments);
  if (args.length === 0) return {};else if (args.length === 1) return args[0];else if (!isHash(args[0])) return {};
  var targetObject = args[0];
  var sources = args.slice(1);

  //  define the recursive merge function
  var _merge = function _merge(target, source) {
    for (var k in source) {
      if (!target[k] && isHash(source[k])) {
        target[k] = _merge({}, source[k]);
      } else if (target[k] && isHash(target[k]) && isHash(source[k])) {
        target[k] = merge(target[k], source[k]);
      } else {
        if (isArray(source[k])) {
          target[k] = [];
          for (var x in source[k]) {
            if (isHash(source[k][x])) {
              target[k].push(_merge({}, source[k][x]));
            } else if (isArray(source[k][x])) {
              target[k].push(_merge([], source[k][x]));
            } else {
              target[k].push(source[k][x]);
            }
          }
        } else if (isDate(source[k])) {
          target[k] = new Date(source[k]);
        } else {
          target[k] = source[k];
        }
      }
    }
    return target;
  };

  //  merge each source
  for (var k in sources) {
    if (isHash(sources[k])) _merge(targetObject, sources[k]);
  }
  return targetObject;
}

/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 * @description
 * Constant values
 * 
 * @module lib/core/constants
 * @returns {Object}
 */
var CONST = {
	type: {
		integer: 'integer',
		bigInteger: 'bigInteger',
		string: 'string',
		text: 'text',
		float: 'float',
		decimal: 'decimal',
		boolean: 'boolean',
		date: 'date',
		dateTime: 'dateTime',
		time: 'time',
		timestamp: 'timestamp',
		binary: 'binary',
		json: 'json',
		jsonb: 'jsonb',
		uuid: 'uuid',
		enum: 'enum'
	},
	options: {
		type: 'type',
		size: 'size',
		textType: 'textType',
		precision: 'precision',
		scale: 'scale',
		increments: 'increments',
		standard: 'standard',
		length: 'length',
		jsonb: 'jsonb',
		index: 'index',
		indexName: 'indexName',
		indexType: 'indexType',
		primary: 'primary',
		unique: 'unique',
		compositeUnique: 'compositeUnique',
		references: 'references',
		inTable: 'inTable',
		onDelete: 'onDelete',
		onUpdate: 'onUpdate',
		defaultTo: 'defaultTo',
		unassigned: 'unassigned',
		nullable: 'nullable',
		first: 'first',
		after: 'after',
		comment: 'comment',
		ignore: 'ignore',
		virtuals: 'virtuals'
	},
	relations: {
		hasOne: 'hasOne',
		hasMany: 'hasMany',
		belongsTo: 'belongsTo',
		belongsToMany: 'belongsToMany',
		morphOne: 'morphOne',
		morphMany: 'morphMany',
		morphTo: 'morphTo'
	},
	extend: {
		extendProto: 'extendProto',
		extendClass: 'extendClass'
	}
};

var OPTS = CONST.options;

function pushUniq(val) {
  var arr = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  if (!includes(arr, val)) arr.push(val);
  return arr;
}

/**
 * Extend a schema object
 * @param {Object} model - Model to extend.
 * @param {Object} extending - Model that is extending.
 * @returns {Object} Extended model.
 */
function extend(model, extending) {
  return merge({}, model, extending);
}

/**
 * Obtain primary keys from the schema definition
 * @param {SchemaDefinition} schema - Schema definition.
 * @returns {String[]|Number[]} Primary Key.
 */
function getPrimaryKeys(schema) {
  var primary = [];
  forEach(schema, function (col, name) {
    if (col.primary === true) primary.push(name);
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
  var keys$$ = keys(col);
  var rels = keys(CONST.relations);
  var exts = keys(CONST.extend);

  // verify that the column name is a string
  colName = isString(colName) ? colName : '';

  // check for individual ignore-able conditions
  var related = intersection(keys$$, rels).length === 0 ? false : true;
  var extend = intersection(keys$$, exts).length === 0 ? false : true;
  var virtual = includes(keys$$, OPTS.virtuals) ? true : false;
  var dashCol = colName.length > 0 && colName[0] === '_' ? true : false;
  var ignore = !has(col, OPTS.ignore) ? false : col.ignore;

  // check for any ignore-able conditions
  if (ignore || related || extend || dashCol || virtual) return true;
  return false;
}

/**
 * Place an object inside a promise and return the promise
 * @param {Object} object - Object to resolve.
 * @returns {Promise}
 */
function wrapPromise(obj) {
  return new Promise$1(function (resolve) {
    return resolve(obj);
  });
}

/**
 * Determine if a column is null-able
 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
 * @returns {Boolean}
 */
function nullable(col) {
  return !has(col, OPTS.nullable) || col.nullable === false ? false : true;
}

/**
 * Determine if a column has a default
 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
 * @returns {Boolean}
 */
function hasDefault(col) {
  return has(col, OPTS.defaultTo);
}

/**
 * Determine if a column is optional
 * @param {SchemaDefinition} schema - Schema definition of the column to analyze.
 * @param {String} name - Name of the column to analyze.
 * @returns {Boolean}
 */
function optional(col, colName) {
  return !ignorable(col, colName) && (nullable(col) || hasDefault(col));
}

/**
 * Check that the data being entered is compatible with the schema
 * @param {Object[]} data - Data to validate.
 * @param {SchemaDefinition} schema - Schema definition of the table the data belongs to.
 * @returns {Boolean}
 */
function checkSchema(data, tableSchema) {
  if (!isArray(data) || !data.length || !isObject(tableSchema)) return false;

  forEach(data, function (datum) {
    forEach(tableSchema, function (col, colName) {
      if (!has(datum, colName) && required(col, colName) && !col.increments) {
        console.log('WARN: property or required mismatch on ' + colName + '["' + col + '"]');
        return false;
      }
    });
  });
  return true;
}

var util = {
  pushUniq: pushUniq,
  extend: extend,
  getPrimaryKeys: getPrimaryKeys,
  ignorable: ignorable,
  wrapPromise: wrapPromise,
  nullable: nullable,
  hasDefault: hasDefault,
  optional: optional,
  checkSchema: checkSchema
};

var con = manakin.local;

var FATAL = 60;
var ERROR = 50;
var WARN = 40;
var INFO = 30;
var DEBUG = 20;
var TRACE = 10;

var config = {
  logLevel: INFO,
  logger: {
    fatal: function fatal(body) {
      if (config.logLevel && config.logLevel <= FATAL) con.error({ level: FATAL, type: 'FATAL', body: body });
    },
    error: function error(body) {
      if (config.logLevel && config.logLevel <= ERROR) con.error({ level: ERROR, type: 'ERROR', body: body });
    },
    warn: function warn(body) {
      if (config.logLevel && config.logLevel <= WARN) con.warn({ level: WARN, type: 'WARN', body: body });
    },
    info: function info(body) {
      if (config.logLevel && config.logLevel <= INFO) con.log({ level: INFO, type: 'INFO', body: body });
    },
    debug: function debug(body) {
      if (config.logLevel && config.logLevel <= DEBUG) con.log({ level: DEBUG, type: 'DEBUG', body: body });
    },
    trace: function trace(body) {
      if (config.logLevel && config.logLevel <= TRACE) con.log({ level: TRACE, type: 'TRACE', body: body });
    }
  }
};

function setLevel(level) {
  if (!isNaN(level) && level >= 0) config.logLevel = level;
}

function setLogger(logger) {
  if (isObject(logger)) config.logger = logger;
}

function configureLogger() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (config.level) setLevel(config.level);
  if (config.logger) setLogger(config.logger);
}

var log = {
  fatal: function fatal() {
    if (config.logger.fatal) config.logger.fatal.apply(this, arguments);
  },
  error: function error() {
    if (config.logger.error) config.logger.error.apply(this, arguments);
  },
  warn: function warn() {
    if (config.logger.warn) config.logger.warn.apply(this, arguments);
  },
  info: function info() {
    if (config.logger.info) config.logger.info.apply(this, arguments);
  },
  debug: function debug() {
    if (config.logger.debug) config.logger.debug.apply(this, arguments);
  },
  trace: function trace() {
    if (config.logger.trace) config.logger.trace.apply(this, arguments);
  }
};

var logger = {
  FATAL: FATAL,
  ERROR: ERROR,
  WARN: WARN,
  INFO: INFO,
  DEBUG: DEBUG,
  TRACE: TRACE,
  setLevel: setLevel,
  setLogger: setLogger,
  configureLogger: configureLogger,
  log: log
};

var TYPE = CONST.type;
var OPTS$1 = CONST.options;
var getPrimaryKeys$1 = getPrimaryKeys;

function manage (knex) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  /**
   * Creates a new column in the table using a column schema
   * @param {Table} table - Knex.js table object.
   * @param {String} name - Column name.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @param {Object[]} primary - Primary key.
   * @ignore
   */
  var createColumn = function createColumn(table, colName, col, primary) {

    // create a column variable
    var column = null;

    // check for increments
    if (col.increments === true) {
      // check for UUID type
      if (col.type === TYPE.uuid) {

        // UUIDs cannot be auto-incremented or given a
        // default value when used as a primary/incrementing key
        // the insert code should check the schema definition and
        // supply a UUID on insert
        column = table.uuid(colName);
        delete col.defaultTo;
      } else {
        column = table.increments(colName);
      }
    } else {
      // verify type field is present
      if (!has(col, OPTS$1.type)) return null;

      // check types
      switch (col.type) {
        case TYPE.integer:
          column = table.integer(colName);
          break;
        case TYPE.bigInteger:
          column = table.bigInteger(colName);
          break;
        case TYPE.string:
          column = table.string(colName, col.size);
          break;
        case TYPE.text:
          column = table.text(colName, col.textType);
          break;
        case TYPE.float:
          column = table.float(colName, col.precision, col.scale);
          break;
        case TYPE.decimal:
          column = table.decimal(colName, col.precision, col.scale);
          break;
        case TYPE.boolean:
          column = table.boolean(colName);
          break;
        case TYPE.comment:
          column = table.comment(col.comment);
          break;
        case TYPE.date:
          column = table.date(colName);
          break;
        case TYPE.dateTime:
          column = table.dateTime(colName);
          break;
        case TYPE.time:
          column = table.time(colName);
          break;
        case TYPE.timestamp:
          column = table.timestamp(colName, col.standard);
          break;
        case TYPE.binary:
          column = table.binary(colName, col.length);
          break;
        case TYPE.json:
          column = table.json(colName);
          break;
        case TYPE.jsonb:
          column = table.jsonb(colName);
          break;
        case TYPE.uuid:
          column = table.uuid(colName);
          break;
        case TYPE.enum:
          column = table.enu(colName, col.values);
          break;
        default:
          column = table.specificType(colName, col.value);
          break;
      }
    }

    if (col.index === true) column.index(col.indexName, col.indexType);
    if (col.primary === true && primary.length === 1) column.primary();
    if (col.unique === true) column.unique();
    if (col.references) column.references(col.references);
    if (col.inTable) column.inTable(col.inTable);
    if (col.onDelete) column.onDelete(col.onDelete);
    if (col.onUpdate) column.onUpdate(col.onUpdate);
    if (has(col, OPTS$1.defaultTo)) column.defaultTo(col.defaultTo);
    if (col.unassigned === true) column.unassigned();

    if (col.nullable === true) column.nullable();else column.notNullable();

    if (col.first === true) column.first();
    if (col.after) column.after(col.after);
    if (col.comment) column.comment(col.comment);
    if (col.collate) column.collate(col.collate);
  };

  /**
   * Creates a table
   * @param {Table} table - Knex.js table object.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @ignore
   */
  var createTable = function createTable(table, schema) {
    var primary = getPrimaryKeys(schema);

    forEach(schema, function (col, colName) {
      if (!ignorable(col, colName)) createColumn(table, colName, col, primary);

      // look for compositeUnique
      if (col.compositeUnique) {
        (function () {
          var cmpArr = [colName];

          forEach(ensureArray(col.compositeUnique), function (name) {
            if (has(schema, name)) pushUniq(name, cmpArr);
          });

          // make sure there are at least 2 columns
          if (cmpArr.length > 1) table.unique(cmpArr);
        })();
      }
    });

    // set any composite keys
    if (isArray(primary) && primary.length > 1) table.primary(primary);
  };

  /**
   * Creates or updates a table schema
   * @param {String} table - Table name.
   * @param {SchemaDefinition} schema - Column schema definition.
   * @param {Transaction} transaction - Knex.js transaction.
   * @returns {Promise}
   * @ignore
   */
  var syncTable = function syncTable(tableName, schema, trx) {
    return trx.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
        return trx.schema.createTable(tableName, function (table) {
          createTable(table, schema);
        }).then(function () {
          return knex(tableName).columnInfo().transacting(trx);
        });
      } else {
        return knex(tableName).columnInfo().transacting(trx).then(function (info) {
          return Promise$1.map(keys(info), function (colName) {
            if (!has(schema, colName)) {
              return trx.schema.table(tableName, function (table) {
                table.dropColumn(colName);
              });
            }
          }).then(function () {
            return info;
          });
        }).then(function (info) {
          return Promise$1.map(keys(schema), function (colName) {
            if (!has(info, colName)) {
              return trx.schema.table(tableName, function (table) {
                createColumn(table, colName, schema[colName], []);
              });
            }
          }).then(function () {
            return knex(tableName).columnInfo().transacting(trx);
          });
        });
      }
    });
  };

  /**
   * Creates or updates a database schema
   * @param {SchemaDefinition} schema - Database schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  var sync = function sync(schema, trx) {
    var returnVal = {};
    var syncEx = function syncEx(trx) {
      return Promise$1.each(keys(schema), function (tableName) {
        if (schema[tableName]._temporary === true) return;

        return syncTable(tableName, schema[tableName], trx).then(function (result) {
          returnVal[tableName] = result;
        });
      }).then(function () {
        return returnVal;
      });
    };

    var t = trx ? syncEx(trx) : knex.transaction(function (trx) {
      return syncEx(trx);
    });

    return t.catch(function (err) {
      log.error({ msg: 'A sync error occured', error: err });
    });
  };

  /**
   * Drops a table
   * @param {String} name - Table name to drop.
   * @param {Transaction} transaction - Knex.js transaction.
   * @returns {Promise}
   * @ignore
   */
  function dropTable(tableName, trx) {
    return trx.schema.dropTableIfExists(tableName).then(function () {
      var result = {};
      result[tableName] = true;
      return result;
    });
  }

  /**
   * Drops all the tables defined in the schema definition
   * @param {SchemaDefinition} schema - Database schema to drop.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  function drop(schema, trx) {
    var dropEx = function dropEx(trx) {
      return Promise$1.map(keys(schema), function (tableName) {
        return dropTable(tableName, trx);
      });
    };
    var t = trx ? dropEx(trx) : knex.transaction(function (trx) {
      return dropEx(trx);
    });

    return t.catch(function (err) {
      log.error({ msg: 'A drop error occured', error: err });
    });
  }

  return {
    createColumn: createColumn,
    createTable: createTable,
    drop: drop,
    dropTable: dropTable,
    getPrimaryKeys: getPrimaryKeys$1,
    syncTable: syncTable,
    sync: sync
  };
}

var OPTS$2 = CONST.options;
/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 *
 * @description
 * Data loading functions
 *
 * @module lib/core/loader
 * @param {Object} modules - A hash of modules.
 * @returns {Object}
 *
 * @ignore
 */
function load (knex) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  /**
   * Attempt to convert data to be compatible with the schema definition
   * @param {Object} data - Data to analyze.
   * @param {Object} schema - Schema definition.
   * @returns {Object} Converted data.
   */
  var convert = function convert(data, schema) {
    var converted = {};

    forEach(data, function (table, tableName) {
      if (has(schema, tableName)) {
        converted[tableName] = [];

        forEach(table, function (datum) {
          var dataCol = {};
          var validRow = true;

          forEach(schema[tableName], function (col, colName) {
            if (has(datum, colName)) {
              dataCol[colName] = datum[colName];
            } else if (optional(col, colName)) {
              dataCol[colName] = has(col, OPTS$2.defaultTo) ? col.defaultTo : null;
            } else if (!ignorable(col, colName) && !col.increments) {
              log.warn('Field ' + colName + ' has invalid/missing data in ' + tableName + ':' + datum + ' and will not be inserted');
              validRow = false;
            }
          });

          if (validRow) converted[tableName].push(dataCol);
        });
      }
    });
    return converted;
  };

  /**
   * Load data into the database
   * @param {Object} data - Data to load.
   * @param {Object} schema - Schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  var loadData = function loadData(data, schema, transaction) {
    var loadEx = function loadEx(trx) {
      return Promise$1.map(keys(data), function (tableName) {
        var table = data[tableName];

        return trx.schema.hasTable(tableName).then(function (exists) {
          if (exists && isArray(table) && checkSchema(table, schema[tableName])) {
            return trx.table(tableName).insert(table);
          } else {
            log.warn('Failed to load data for ' + tableName + '. Incorrectly formatted or missing required data');
          }
        });
      });
    };

    var t = transaction ? loadEx(transaction) : knex.transaction(function (trx) {
      return loadEx(trx);
    });

    return wrapPromise(t).catch(function (err) {
      log.error({ msg: 'A load error occured', error: err });
    });
  };

  /**
   * Convert and load the data in one method call
   * @param {Object} data - Data to load.
   * @param {Object} schema - Schema definition.
   * @param {Transaction} [transaction] - Knex.js transaction.
   * @returns {Promise}
   */
  var convertAndLoad = function convertAndLoad(data, schema, transaction) {
    return loadData(convert(data, schema), schema, transaction);
  };

  var checkSchema$$ = checkSchema;

  // return the methods
  return {
    loadData: loadData,
    convert: convert,
    convertAndLoad: convertAndLoad,
    checkSchema: checkSchema$$
  };
}

var METHOD = 'dump';

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
function dumper (knex) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (schema, transaction) {
    var output = {};
    var tables = isHash(schema) ? keys(schema) : ensureArray(schema);

    var dumpEx = function dumpEx(trx) {
      return Promise$1.each(tables, function (table) {
        output[table] = [];

        return knex.select('*').from(table).then(function (results) {
          forEach(results, function (result) {
            output[table].push(result);
          });
        });
      }).then(function () {
        forEach(output, function (value, name) {
          if (!isArray(value) || !value.length) delete output[name];
        });
        return output;
      });
    };

    var t = transaction ? dumpEx(transaction) : knex.transaction(function (trx) {
      return dumpEx(trx);
    });

    return t.then(function (result) {
      log.trace({
        METHOD: METHOD,
        tables: tables,
        results: results
      });
      return result;
    }).catch(function (err) {
      log.error({
        METHOD: METHOD,
        msg: 'A dump error occured',
        tables: tables,
        error: err
      });
    });
  };
}

var type = 'knex-schemer';
var version = '1.0.0';

/**
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 *
 * @description
 * Design, create, and update a relational database schema using JSON
 *
 * @module knex-schemer
 * @param {knex} knex - An instance of knex.
 * @returns {Object}
 */
function index (knex) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var manager = manage(knex, options);
  var loader = load(knex, options);
  var dump = dumper(knex, options);
  logger.configureLogger(options.log);

  return Object.assign({
    type: type,
    version: version,
    constants: CONST,
    knex: knex,
    manager: manager,
    loader: loader,
    dump: dump,
    util: util
  }, manager, loader, logger);
}

module.exports = index;