const pluginManager = require('../../src/modules/plugins/manager.js');
const devConfig = require('./dev.json');
const manager = require('./manager.js')

const writer = {
	'%config_name%': {
		'config': {},
		'lang': {
			'success': {},
			'errors': {},
		},
	},
};

module.exports = class examplePlugin extends pluginManager {
	constructor(client) {
		super(client, devConfig, manager, writer);
	}
};
