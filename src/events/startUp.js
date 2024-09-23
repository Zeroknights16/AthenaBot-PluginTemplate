const event = require('../../../../main/discord/core/events/event.js');
const { Events } = require('discord.js');

module.exports = class startUp extends event {
	constructor(heart) {
		super(heart, { name: 'startUp', event: { discord: Events.ClientReady, bypassManager: false, dm: false } });
	}

	execute() {
		this.heart.core.console.log(this.heart.core.console.type.log, 'The bot is ready now :)');
	}
};