const scheduledTask = require('../../../../main/discord/core/schedule/schedule.js');

module.exports = class loop extends scheduledTask {
	constructor(heart) {
		super(heart, 'loop', { repeat: true, interval: 60000 });
	}

	execute() {
		console.log('Ey! 60 seconds have passed since the last time :-:');
	}
};