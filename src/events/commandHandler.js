const EventListener = require('../../../../src/modules/events/manager.js');

module.exports = class commandHandler extends EventListener {
	constructor(client) {
		super(client, { event: 'interactionCreate', name: 'test', default: false });
		this.client = client;
	}

	async execute(interaction) {
		const command = this.client.commandLoader.commands.get(interaction.commandName);
		if (!command) console.log('err');

		command.execute(interaction);
	}
};