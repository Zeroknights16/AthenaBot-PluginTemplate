const listenerManager = require('../../../../src/modules/listener/manager.js');

module.exports = class botActivity extends listenerManager {
	constructor(client) {
		super(client, { listener: 'botActivity', duration: 8000, nextRun: Date.now() + 8000, disabled: false });
	}

	async execute() {
			this.client.user.setPresence({ activities: [{ name: '/help' }] });
	}
};
