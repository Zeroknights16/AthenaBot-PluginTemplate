const { SlashCommandBuilder, MessageFlags, channelMention } = require('discord.js');
const command = require('../../../../main/discord/core/commands/command.js');

/* eslint-disable no-unused-vars, no-constant-condition */
if (null) {
	const heartType = require('../../../../types/heart.js');
	const commandType = require('../../../../types/discord/core/commands/commands.js');
	const { CommandInteraction } = require('discord.js');
}
/* eslint-enable no-unused-vars, no-constant-condition  */


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
		const helloConfig = heart.core.discord.core.config.manager.get('hello').get();

		super(heart, {
			name: 'test',
			data: new SlashCommandBuilder()
				.setName(cmdConfig.commands.test?.name || 'test')
				.setDescription(cmdConfig.commands.test?.description || 'Test command'),
			contextMenu: false,
			global: true,
			category: 'general',
			// Make sure this is set to true.
			bypass: true,
			// If you want to bypass the built in permission system, set this to null.
			// (e.g. if everyone should be able to use the command or you use your own permission system)
			//
			// Otherwise set this to a permission level of the permission configuration file.
			// The best way to do so is, to create a config file for your addon and let them set a permission level for their commands.
			// If this is set to an invalid permission level, Athena will handle this case automatically.
			permissionLevel: helloConfig.config.permissions.test_command,
		});
	}

	/**
     * Executes the command.
     * @param {CommandInteraction} interaction - The interaction object.
     * @param {Object} langConfig - The language configuration.
     */
	async execute(interaction, langConfig) {
		try {
			// Importing the configured channel "hello_world"
			const channelId = this.heart.core.database.config.getChannel('hello_world')
			const channel = guild.channels.cache.get(channelId);
			if (!channel) return interaction.reply({ content: 'Your "hello world" channel is not setuped. Please use /setup', flags: MessageFlags.Ephemeral });

			interaction.reply({ content: `Hello World! The configured channel can be found here ${channelMention(channelId)}` });
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing command ${this.getName()}`);
			new this.heart.core.error.interface(this.heart, err);
			interaction.reply({ embeds: [this.heart.core.util.discord.generateErrorEmbed(langConfig.lang.unexpected_command_error.replace(/%command%/g, `/${interaction.commandName}`))], flags: MessageFlags.Ephemeral });
		}
	}
};
