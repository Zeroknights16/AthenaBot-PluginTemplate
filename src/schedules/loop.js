const scheduledTask = require('../../../../main/discord/core/schedule/schedule.js');

/* eslint-disable no-unused-vars */
const heartType = require('../../../../types/heart.js');
const scheduleType = require('../../../../types/discord/core/schedule/schedule.js');
/* eslint-enable no-unused-vars */


/**
 * A class representing the loop schedule.
 * @class
 * @extends scheduleType
 */
module.exports = class loop extends scheduledTask {
	/**
     * Creates an instance of this schedule.
     * @param {heartType} heart - The heart of the bot.
     */
	constructor(heart) {
		super(heart, 'loop', { repeat: true, interval: 60000 });
	}

	execute() {
		this.heart.core.console.log(this.heart.core.console.type.log, '60 seconds have passed since the last time :-:');
	}
};