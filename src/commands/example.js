const Discord = require('discord.js');
const commandManager = require('../../../../src/modules/commands/manager.js');

module.exports = class testCommand extends commandManager {
	constructor(client) {
		super(client, {
			data: new Discord.SlashCommandBuilder()
				.setName('test')
				.setDescription('Test command')
				.addUserOption(option => option.setName('user').setDescription('User')),
			category: 'general',
			plugin: 'general',
			global: false,
			ownerOnly: false,
			custom: null,
		});
	}

	async execute(interaction) {
		interaction.reply({ content: 'hello world' });
	}
};
