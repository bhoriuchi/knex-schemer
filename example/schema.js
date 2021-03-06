
module.exports = function(c) {
	
	// version 1 database schema definition
	var schema_v1 = {

			key_value_pair: {
				object_type: {type: c.type.string, size: 50},
				object_id: {type: c.type.integer},
				key: {type: c.type.string, size: 100},
				value: {type: c.type.text},
				type: {type: c.type.string, size: 50, nullable: true}
			},
			credential: {
				id: {type: c.type.integer, primary: true, increments: true},
				name: {type: c.type.string, size: 200},
				username: {type: c.type.string, size: 100},
				encryptedKey: {type: c.type.string, size: 255},
				description: {type: c.type.string, size: 500, nullable: true, defaultTo: 'testdefault'},
				user: {belongsTo: 'tag_translation'},
				test: {extendProto: function() { return 'test'; }},
				_auth: {read: function() { return 'permission check here'; }}
			},
			key_value_parse_config: {
				id: {type: c.type.integer, primary: true, increments: true},
				type: {type: c.type.string, size: 50},
				splitDelimiter: {type: c.type.string, size: 8, nullable: true},
				splitKeyIndex: {type: c.type.integer, nullable: true},
				splitValueIndex: {type: c.type.integer, nullable: true},
				regexKey: {type: c.type.string, size: 255, nullable: true},
				regexValue: {type: c.type.string, size: 255, nullable: true}
			},
			tag_translation: {
				extType: {type: c.type.integer},
				tag_id: {type: c.type.integer},
				value: {type: c.type.string, size: 255},
				ignoreCase: {type: c.type.boolean},
				testvalue2: {type: c.type.string, size: 5},
				testvalue3: {type: c.type.string, size: 5}
			},
			types: {
				bigInteger: {type: 'bigInteger'},
				bool: {type: 'boolean'},
				binary: {type: 'binary', length: 10},
				date: {type: 'date'},
				dateTime: {type: 'dateTime'},
				decimal: {type: 'decimal', precision: 5, scale: 2},
				float: {type: 'float', precision: 5, scale: 2},
				integer: {type: 'integer', unsigned: false, primary: true},
				json: {type: 'json'},
				string: {type: 'string', size: 100, unique: true},
				text: {type: 'text', textType: 'text'},
				mediumtext: {type: 'text', textType:'mediumtext'},
				longtext: {type: 'text', textType: 'longtext'},
				time: {type: 'time'},
				timestamp: {type: 'timestamp'},
				uuid: {type: 'uuid'}
			}
	};
	
	
	// version 2 database schema definition
    var schema_v2 = {

            key_value_pair: {
                object_type: {type: c.type.string, size: 50},
                object_id: {type: c.type.integer},
                key: {type: c.type.string, size: 100},
                value: {type: c.type.text},
                type: {type: c.type.string, size: 50, nullable: true}
            },
            credential: {
                id: {type: c.type.integer, primary: true, increments: true},
                name: {type: c.type.string, size: 2},
                username: {type: c.type.string, size: 100},
                encryptedKey: {type: c.type.string, size: 255},
        // description: {type: c.type.string, size: 500, nullable: true, index: true},
                foo: {type: c.type.string, size: 55, nullable: true, index: true, unique: true},
                user: {belongsTo: 'tag_translation'},
                test: {extendProto: function() { return 'test'; }},
                _auth: {read: function() { return 'permission check here'; }}
            },
            key_value_parse_config: {
                id: {type: c.type.integer, primary: true, increments: true},
                type: {type: c.type.string, size: 50},
                splitDelimiter: {type: c.type.string, size: 8, nullable: true},
                splitKeyIndex: {type: c.type.integer, nullable: true},
                splitValueIndex: {type: c.type.integer, nullable: true},
                regexKey: {type: c.type.string, size: 255, nullable: true},
                regexValue: {type: c.type.string, size: 255, nullable: true}
            },
            tag_translation: {
                extType: {type: c.type.integer},
                tag_id: {type: c.type.integer},
                value: {type: c.type.string, size: 255},
                ignoreCase: {type: c.type.boolean},
                testvalue2: {type: c.type.string, size: 5},
                testvalue3: {type: c.type.string, size: 5}
            }
    };
	
	
	return {
		v1: schema_v1,
		v2: schema_v2
	};
};