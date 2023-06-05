const { Collection } = require('discord.js');

module.exports = class exampleManager {
	constructor(client) {
		this.client = client;
		this.violations = new Collection();
	}

	addViolation(userId, type) {
		const data = this.violations.get(type);
		if (!data.has(userId)) {
			data.set(userId, [`${Date.now()}`]);
		}
	}

};
