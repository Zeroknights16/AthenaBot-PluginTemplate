const event = require('../../../../main/discord/core/events/event.js');
const { Events } = require('discord.js');

/* eslint-disable no-unused-vars */
const heartType = require('../../../../types/heart.js');
const eventType = require('../../../../types/discord/core/events/events.js');
const { Client } = require('discord.js');
/* eslint-enable no-unused-vars */


/**
 * Startup event class.
 * @class
 * @extends eventType
 */
module.exports = class startUp extends event {
	/**
     * Creates an instance of the event.
     * @param {heartType} heart - The heart of the bot.
     */
	constructor(heart) {
		super(heart, { name: 'startUp', event: { discord: Events.ClientReady, bypassManager: false, dm: false } });
	}

	/**
     * Executes the event.
     * @param {Client} client - The client object.
     */
	execute(client) {
		this.heart.core.console.log(this.heart.core.console.type.log, 'The bot is ready now :)');
	}
};