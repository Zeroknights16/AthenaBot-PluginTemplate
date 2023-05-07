const pluginManager = require('../../src/modules/plugins/manager.js');
const devConfig = require('./dev.json');
// const manager = require('./manager.js')

module.exports = class examplePlugin extends pluginManager {
	constructor(client) {
		super(client, devConfig, manager);
	}
};
