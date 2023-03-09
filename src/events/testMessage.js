const EventListener = require('../../../../src/modules/events/manager.js');

module.exports = class DebugEventListener extends EventListener {
	constructor(client) {
		super(client, { event: 'messageCreate', once: false, name: null, default: false });
	}

	async execute(message) {
		console.log(message.content);
	}
};
