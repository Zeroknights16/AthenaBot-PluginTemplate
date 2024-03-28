const { SlashCommandBuilder } = require('discord.js');
const command = require('../../../../main/discord/core/commands/command.js');

module.exports = class test extends command {
	constructor(heart) {
		super(heart, {
			data: new SlashCommandBuilder()
				.setName('test')
				.setDescription('Test command'),
			contextMenu: false,
			global: true,
			category: 'general',
		});
	}

	async execute(interaction) {

		try {
			interaction.reply({ content: 'Hello world' });
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing command ${this.getName()}}`);
			new this.heart.core.error.interface(this.heart, err);
		}
	}
};