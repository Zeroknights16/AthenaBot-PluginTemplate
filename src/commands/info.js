// This is the actual /info command of AthenaBot. It's a bit more complex than the test command, but it's still quite simple.
// It should explain quite well how to implement a command. If you have any questions, feel free to create a ticket.

const { SlashCommandBuilder, PresenceUpdateStatus, roleMention, MessageFlags } = require('discord.js');
const moment = require('moment');
const command = require('../../../../main/discord/core/commands/command.js');

/* eslint-disable no-unused-vars, no-constant-condition */
if (null) {
	const heartType = require('../../../../types/heart.js');
	const commandType = require('../../../../types/discord/core/commands/commands.js');
	const { CommandInteraction } = require('discord.js');
}
/* eslint-enable no-unused-vars, no-constant-condition  */


/**
 * Info command class.
 * @class
 * @extends commandType
 */
module.exports = class info extends command {
	/**
     * Creates an instance of the command.
     * @param {heartType} heart - The heart of the bot.
     * @param {Object} cmdConfig - The command configuration.
     */
	constructor(heart, cmdConfig) {
		super(heart, {
			name: 'info',
			data: new SlashCommandBuilder()
				.setName(cmdConfig.commands.info?.name || 'info')
				.setDescription(cmdConfig.commands.info?.description || 'User Information')
				.addUserOption(option => option.setName('user').setDescription('User')),
			contextMenu: false,
			global: true,
			category: 'general',
            bypass: true,
		});
	}

	/**
     * Executes the command.
     * @param {CommandInteraction} interaction - The interaction object.
     * @param {Object} langConfig - The language configuration.
     */
	async execute(interaction, langConfig) {
		try {
			const member = interaction.options.getMember('user') ?? interaction.guild.members.cache.get(interaction.user.id);

			const roles = member.roles.cache.map(r => {
				if (r.id !== interaction.guild.id) {
					return roleMention(r.id);
				}
			}).sort() || 'None';
			roles.pop();

			const userInfo = await this.heart.core.database.userData.get(interaction.guild.id, interaction.user.id);

			const placeholders = {
				nickname: member.nickname !== null ? `${member.nickname}` : 'None',
				bot: member.user.bot == true ? '%custom_emoji_28%' : '%custom_emoji_29%',
				status: member.presence?.status ?? PresenceUpdateStatus.Offline,
				presence: (member.presence?.activities.length == 0 ? null : member.presence?.activities.join(', ')) ?? 'none',
				registered: moment.utc(member.user.createdAt).format('dddd, MMMM Do YYYY'),
				joined: moment.utc(member.joinedTimestamp).format('dddd, MMMM Do YYYY'),
				muted: member.communicationDisabledUntilTimestamp == null ? '%custom_emoji_29%' : '%custom_emoji_28%',
				booster: member.premiumSinceTimestamp == null ? '%custom_emoji_29%' : '%custom_emoji_28%',
				roles: roles,
				message_sent: userInfo.messages,
				ticket_opened: userInfo.ticketsOpened,
				verified: userInfo.verifiedAt == 0 ? '%custom_emoji_29%' : '%custom_emoji_28%',
				level: userInfo.level,
				invites: userInfo.invites,
				coins: userInfo.economy_coins_total,
			};
			interaction.reply({ embeds: [this.heart.core.util.discord.resolveEmbed(langConfig.embeds.info, placeholders, interaction.guild, member.user)] });
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing command ${this.getName()}`);
			new this.heart.core.error.interface(this.heart, err);
			interaction.reply({ embeds: [this.heart.core.util.discord.generateErrorEmbed(langConfig.lang.unexpected_command_error.replace(/%command%/g, `/${interaction.commandName}`))], flags: MessageFlags.Ephemeral });
		}
	}
};