const event = require('../../../../main/discord/core/events/event.js');
const { Events } = require('discord.js');

module.exports = class messageResponse extends event {
	constructor(heart) {
		super(heart, { name: 'messageResponse', event: { discord: Events.MessageCreate, bypassManager: false } });
	}

	async execute(message) {
		message.reply({ content: 'Hello World' });
	}
};