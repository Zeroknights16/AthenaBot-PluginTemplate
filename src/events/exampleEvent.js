const EventListener = require('../../../../src/modules/events/manager.js');
const { Events } = require('discord.js');

module.exports = class exampleEvent extends EventListener {
	constructor(client) {
		super(client, { event: Events.MessageCreate, once: false, name: 'Example', default: false, plugin: 'general' }); // default: used for interaction events, keep it as "false", use "true" to bypass custom interaction handler
	}

	async execute(message) {
		console.log(message.content);
	}
};
