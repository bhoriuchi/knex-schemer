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

export const TYPES = {
  BIG_INTEGER: 'bigInteger',
  BINARY: 'binary',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATE_TIME: 'dateTime',
  DECIMAL: 'decimal',
  ENUM: 'enum',
  FLOAT: 'float',
  INCREMENTS: 'increments',
  INTEGER: 'integer',
  JSON: 'json',
  JSONB: 'jsonb',
  STRING: 'string',
  TEXT: 'text',
  TIME: 'time',
  TIMESTAMP: 'timestamp',
  UUID: 'uuid'
}

export default {
	type: {
		integer: 'integer',
		bigInteger: 'bigInteger',
		comment: 'comment',
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
}