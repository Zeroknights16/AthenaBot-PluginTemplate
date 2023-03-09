const EventListener = require('../../../../src/modules/events/manager.js');

module.exports = class DebugEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'messageCreate' });
	}

	async execute(message) {
		console.log(message.content);
	}
};