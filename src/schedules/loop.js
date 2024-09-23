const scheduledTask = require('../../../../main/discord/core/schedule/schedule.js');

module.exports = class loop extends scheduledTask {
	constructor(heart) {
		super(heart, 'loop', { repeat: true, interval: 60000 });
	}

	execute() {
		this.heart.core.console.log(this.heart.core.console.type.log, '60 seconds have passed since the last time :-:');
	}
};