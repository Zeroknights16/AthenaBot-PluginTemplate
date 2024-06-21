const handler = require('../../../../main/discord/core/handler/handler.js');

module.exports = class testHandler extends handler {
	constructor(heart) {
		super(heart, 'test');
		heart.core.discord.core.cache.manager.register(new heart.core.discord.core.cache.interface(heart, 'testCache'));
	}

	getCache() {
		return this.heart.core.discord.core.cache.manager.get('testCache');
	}
};