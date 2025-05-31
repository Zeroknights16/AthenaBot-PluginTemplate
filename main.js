const plugin = require('../../main/discord/core/plugins/plugin.js');
const testHandler = require('./src/handler/test.js');

/* eslint-disable no-unused-vars, no-constant-condition */
if (null) {
	const heartType = require('../../types/heart.js');
	const pluginType = require('../../types/discord/core/plugins/plugin.js');
}
/* eslint-enable no-unused-vars, no-constant-condition  */

/**
 * A class representing the test plugin.
 * @class
 * @extends pluginType
 */
module.exports = class test extends plugin {
	/**
     * Creates an instance of this plugin.
     * @param {heartType} heart - The heart of the bot.
     */
	constructor(heart) {
		super(heart, { name: 'test', author: 'Zeroknights', version: '1.0.0', priority: 0, dependencies: ['core'], softDependencies: [], nodeDependencies: [], channels: [] });
	}

	async preLoad() {
		this.heart.core.console.log(this.heart.core.console.type.startup, 'The plugin is pre-loading now...');
		const helloConfig = new this.heart.core.discord.core.config.interface(
			this.heart,
			{ name: 'hello', plugin: this.getName() },
			{
				config: {
					bot_name: undefined,
					bot_id: undefined,
					bot: undefined,
				}
			},
		);
		const loadHelloConfig = await this.heart.core.discord.core.config.manager.load(helloConfig);
		if (!loadHelloConfig) {
			this.setDisabled();
			this.heart.core.console.log(this.heart.core.console.type.error, `Disabling plugin ${this.getName()}...`);
			return;
		}
	}

	async load() {
		this.heart.core.console.log(this.heart.core.console.type.startup, 'The plugin is loading now...');
		this.heart.core.discord.core.handler.manager.register(new testHandler(this.heart));
	}
};