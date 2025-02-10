const { SlashCommandBuilder } = require('discord.js');
const command = require('../../../../main/discord/core/commands/command.js');

module.exports = class test extends command {
	constructor(heart, cmdConfig) {
		super(heart, {
			name: 'test',
			data: new SlashCommandBuilder()
				.setName(cmdConfig.commands.test?.name || 'test')
				.setDescription(cmdConfig.commands.test?.description || 'Test command'),
			contextMenu: false,
			global: true,
			category: 'general',
			bypass: true,
		});
	}

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
