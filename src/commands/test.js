const { SlashCommandBuilder } = require('discord.js');
const command = require('../../../../main/discord/core/commands/command.js');

/* eslint-disable no-unused-vars */
const heartType = require('../../../../types/heart.js');
const commandType = require('../../../../types/discord/core/commands/commands.js');
const { CommandInteraction } = require('discord.js');
/* eslint-enable no-unused-vars */


/**
 * Test command class.
 * @class
 * @extends commandType
 */
module.exports = class test extends command {
	/**
     * Creates an instance of the command.
     * @param {heartType} heart - The heart of the bot.
     * @param {Object} cmdConfig - The command configuration.
     */
	constructor(heart, cmdConfig) {
		super(heart, {
			name: 'test',
			data: new SlashCommandBuilder()
				.setName(cmdConfig.commands.test?.name || 'test')
				.setDescription(cmdConfig.commands.test?.description || 'Test command'),
			contextMenu: false,
			global: true,
			category: 'general',

			// Make sure this is set to true.
			// This will let the command bypass any permission checks which otherwise would lead to errors.
			// Use Discord's built in permission system or built your own one.
			bypass: true,
		});
	}

	/**
     * Executes the command.
     * @param {CommandInteraction} interaction - The interaction object.
     * @param {Object} langConfig - The language configuration.
     */
	async execute(interaction, langConfig) {
		try {
			interaction.reply({ text: 'Hello World!', ephemeral: true });
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing command ${this.getName()}`);
			new this.heart.core.error.interface(this.heart, err);
			interaction.reply({ embeds: [this.heart.core.util.discord.generateErrorEmbed(langConfig.lang.unexpected_command_error.replace(/%command%/g, `/${interaction.commandName}`))], ephemeral: true });
		}
	}
};
