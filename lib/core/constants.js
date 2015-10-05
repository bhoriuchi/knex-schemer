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
module.exports = {
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
		uuid: 'uuid'
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
		ignore: 'ignore'
	},
	relations: {
		hasOne: 'hasOne',
		hasMany: 'hasMany',
		belongsTo: 'belongsTo',
		belongsToMany: 'belongsToMany'
	},
	extend: {
		extendProto: 'extendProto',
		extendClass: 'extendClass'
	}
};