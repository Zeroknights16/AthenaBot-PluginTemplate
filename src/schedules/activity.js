const scheduledTask = require('../../../../main/discord/core/schedule/schedule.js');

module.exports = class botActivity extends scheduledTask {
	constructor(heart) {
		super(heart, 'botActivity', { repeat: true, interval: 30000, nextRun: null });
		this.runs = 0;
	}

	async execute() {
		this.heart.core.discord.setPresence(`Hello World #${this.runs++}`);
	}
};