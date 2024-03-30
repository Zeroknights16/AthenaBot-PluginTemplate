const plugin = require('../../main/discord/core/plugins/plugin.js');

module.exports = class templatePlugin extends plugin {
	constructor(heart) {
		super(heart, { name: 'template', author: 'Zeroknights', version: '1.0.0', priority: 2, dependencies: [], softDependencies: ['general'] });
	}

	async preLoad() {
		const testConfig = new this.heart.core.discord.core.config.interface(
			this.heart,
			{ name: 'test', plugin: this.getName() },
			{
				'config': {
					'activity': {
						'status': undefined,
						'activity_type': undefined,
						'activity': undefined,
					},
				},
				'lang': {
					'success': {
						'info': undefined,
						'mcserver': undefined,
						'ping': undefined,
						'restart': undefined,
						'server': undefined,
						'stealemoji': undefined,
						'uptime': undefined,
						'confirmation': undefined,
						'confirmation_success': undefined,
						'reload': undefined,
					},
					'errors': {
						'not_online': undefined,
						'restart_running': undefined,
						'owneronly_command': undefined,
						'no_permission_command': undefined,
						'on_cooldown_command': undefined,
						'no_permission_function': undefined,
						'on_cooldown_function': undefined,
						'different_help_list': undefined,
						'confirmation_timed_out': undefined,
						'invalid_emoji': undefined,
						'invalid_guild': undefined,
						'invalid_config': undefined,
					},
				},
			},
		);
		const loadConfig = await this.heart.core.discord.core.config.manager.load(testConfig);
		if (!loadConfig) {
			this.setDisabled();
			this.heart.core.console.log(this.heart.core.console.type.error, `Disabling plugin ${this.getName()}...`);
			return;
		}
	}

	async load() {
		const config = this.heart.core.discord.core.config.manager.get('test').get();
		console.log(config);
	}
};