const pluginManager = require('../../src/modules/plugins/manager.js');
const configFile = require('./dev.json');

module.exports = class testPlugin extends pluginManager {
	constructor(client) {
		super(client, configFile);
	}
};