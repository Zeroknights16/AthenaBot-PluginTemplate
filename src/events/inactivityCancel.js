// This is the actual inactivity closure button event. 
// It should explain quite well how to implement an interaction event. If you have any questions, feel free to create a ticket.

const event = require('../../../../main/discord/core/events/event.js');
const { Events, MessageFlags } = require('discord.js');

/* eslint-disable no-unused-vars, no-constant-condition */
if (null) {
	const heartType = require('../../../../types/heart.js');
	const eventType = require('../../../../types/discord/core/events/events.js');
	const { Interaction } = require('discord.js');
}
/* eslint-enable no-unused-vars, no-constant-condition  */


/**
 * Ticket inactivity event class.
 * @class
 * @extends eventType
 */
module.exports = class ticketInactivity extends event {
	/**
     * Creates an instance of the event.
     * @param {heartType} heart - The heart of the bot.
     */
	constructor(heart) {
        // Make sure to keep bypassRestrictions to true due to permission checks.
        // Set dm to true if the interaction is fired in dms.
		super(heart, { name: 'ticketInactivity', event: { discord: Events.InteractionCreate, bypassManager: false, dm: false, bypassRestrictions: true } });
	}

	/**
     * Executes the event.
     * @param {Interaction} interaction - The interaction object.
	 * @param {Array<string>} interactionId - The interaction id.
	 * @param {Object} langConfig - The language configuration.
     */
	async execute(interaction, interactionId, langConfig) {
		try {
			const ticketConfig = this.heart.core.discord.core.config.manager.get('tickets').get();
			if (!ticketConfig.config.inactivity_closure.enabled) return this.setDisabled(true);

			const ticketHandler = this.heart.core.discord.core.handler.manager.get('tickets');
			const ticket = await ticketHandler.resolveChannel(interaction.channelId, interaction.guild);
			if (!ticket?.getCreatorId()) return;

			interaction.message.delete();

			ticket.setWarningSent(false);
			ticket.updateInactivity();
			await ticket.save();
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing event ${this.getName()}`);
			new this.heart.core.error.interface(this.heart, err);
			interaction.reply({ embeds: [this.heart.core.util.discord.generateErrorEmbed(langConfig.lang.unexpected_function_error.replace(/%function%/g, `${this.getName()}`))], flags: MessageFlags.Ephemeral });
		}
	}
};