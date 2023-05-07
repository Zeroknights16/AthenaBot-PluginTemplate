const EventListener = require('../../../../src/modules/events/manager.js');

module.exports = class exampleEvent extends EventListener {
	constructor(client) {
		super(client, { event: 'messageCreate', once: false, name: 'Example', default: false, plugin: 'general' }); // default: used for interaction events, keep it as "false", use "true" to bypass custom interaction handler
	}

	async execute(message) {
		console.log(message.content);
	}
};
