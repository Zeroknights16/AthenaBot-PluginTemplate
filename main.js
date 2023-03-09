const pluginManager = require('../../src/modules/plugins/manager.js');
const devConfig = require('./dev.json');

module.exports = class examplePlugin extends pluginManager {
	constructor(client) {
		super(client, devConfig);
	}
};
