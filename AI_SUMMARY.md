## AthenaBot Plugin AI Summary

This file captures what an AI needs to know to design and implement a new AthenaBot plugin based on the template wiki and the fun plugin reference.

### 1) Plugin structure and entry point
Required folders and typical layout:

- /plugins/<plugin_name>/main.js
- /plugins/<plugin_name>/data/configs/en-<config_name>.json5
- /plugins/<plugin_name>/data/dashboard/en-<config_name>.json
- /plugins/<plugin_name>/src/commands/
- /plugins/<plugin_name>/src/events/
- /plugins/<plugin_name>/src/handler/
- /plugins/<plugin_name>/src/models/
- /plugins/<plugin_name>/src/schedules/
- /plugins/<plugin_name>/src/routes/
- /plugins/<plugin_name>/src/dashboard/

The main entry point is main.js. It must export a class extending the core plugin base:

- const plugin = require('../../main/discord/core/plugins/plugin.js');
- module.exports = class <PluginName> extends plugin { ... }

### 2) Plugin class and lifecycle
Constructor signature and metadata:

- super(heart, {
	name,
	author,
	version,
	requiredAthenaVersion,
	priority,
	dependencies,
	softDependencies,
	nodeDependencies,
	channels,
	dashboard: { cannotDisable }
});

Key fields:

- name: unique plugin name
- requiredAthenaVersion: minimum bot version; plugin auto-disables if not met
- priority: higher loads earlier; use carefully
- dependencies: required plugins (usually include core)
- softDependencies: optional plugins for extra features
- nodeDependencies: NPM packages installed before load. Do not import these at top-level in main.js.
- channels: list of { name, description } for /setup channel selection
- dashboard.cannotDisable: prevents disabling in dashboard

Lifecycle:

- preLoad(): define and load configs; disable plugin if config load fails
- load(): register handlers and other init tasks

Channels:

- Use this.heart.core.database.config.getChannel('<channel_name>') to fetch configured channel IDs.

### 3) Config system (core requirements)
Config file rules:

- Default config file path: /data/configs/en-<config_name>.json5
- File must start with a top-level config object
- Config comments are allowed in json5 file

In main.js, define the config schema with undefined values for configurable fields:

const myConfig = new this.heart.core.discord.core.config.interface(
	this.heart,
	{ name: '<config_name>', plugin: this.getName(), dashboardConfigurable: true },
	{ config: { key: undefined, nested: { key: undefined }, list: undefined } }
);

Important notes:

- Use the exact same key structure between json5 and main.js schema.
- Any configurable value should be undefined in main.js.
- Arrays must be set to undefined in main.js even if the contents are objects.
- Objects inside arrays are not auto-updated when configs are migrated.

Config loading and updates:

- Athena compares edited config in /configuration with schema from main.js
- Missing keys are auto-added, comments refreshed, defaults applied

Read config:

- Plugin config: this.heart.core.discord.core.config.manager.get('<config_name>').get()
- Common config: this.heart.core.config.common.get()

### 4) Dashboard config editor (schema file)
To enable dashboard editing:

- Provide /data/dashboard/en-<config_name>.json
- Pass dashboardConfigurable: true in config interface

Schema basics:

- Keys map to config keys under config
- Each key defines a field or group

Common types:

- 0 string
- 1 number
- 2 boolean
- 3 array of strings
- 4 array of numbers
- 5 array of booleans
- 10 group of related settings
- 1000 array of objects (value_schema)
- 1001 dynamic object where each key maps to array of objects
- 1002 dynamic object where each key maps to a single object

Keep schema keys and config keys in sync to avoid empty values or save failures.

### 5) Dashboard custom pages
To ship dashboard pages:

- Create /src/dashboard/addon.json
- Required: name, slug
- Optional: icon (Tabler key), description

Folder mapping:

- src/dashboard/pages -> /addons/<slug>
- src/dashboard/components -> dashboard/components/addons/<slug>
- src/dashboard/api -> dashboard/app/api/addons/<slug>

Use Web API routes for config data (example):

- GET /api/dashboard/config/<config_name>/data
- POST /api/dashboard/config/<config_name>/save

### 6) Commands
Command files live in /src/commands/<command_name>.js and extend the command base.

Command definition example:

- data: SlashCommandBuilder
- contextMenu: true or false
- global: usually true unless you want guild-only behavior
- category: help category (often general or feature name)
- bypass: keep true
- permissionLevel: permission level string or null for everyone

Key practices:

- Always use try/catch.
- Do not throw errors directly. Use new this.heart.core.error.interface(this.heart, err).
- Reply with error or warning embeds using embed helpers.

Autocomplete:

- Implement async autocomplete(interaction) if needed.

### 7) Events
Event files live in /src/events/<event_name>.js and extend the event base.

Event config:

- name: unique event identifier
- event.discord: Discord event name or Athena custom event name
- bypassManager: keep false unless required
- dm: only relevant for InteractionCreate events
- bypassRestrictions: keep true
- permissionLevel: for InteractionCreate component actions

InteractionCreate patterns:

- Component customId format: iynx:athenabot:<interaction_name>:<additional_data>
- interactionId array is passed to execute as extra argument
- Typical access check: ensure interactionId[3] equals interaction.user.id

The fun plugin also uses a custom field usePermission in event config for some components. Follow existing internal patterns if required by core permissions.

### 8) Custom Athena events
Listen by setting event.discord to the event name, for example:

- event.discord: 'athena:levelUp'

Emit safely:

- await this.heart.manager.discord.eventManager.emitSafe('athena:levelUp', userId, level)

Event names are case-sensitive and must match between emitters and listeners.

Custom event catalog (from wiki):

Core:
- athena:error(errorInterface)

Economy:
- athena:bankUpgrade(userId, bankLevel)
- athena:shopPurchase(userId, itemId, cost)
- athena:jobUpgrade(userId, jobKey, jobLevel)
- athena:lootboxRollPurchase(userId, purchasedRolls)
- athena:lootboxOpen(userId, rewardType, rewardAmount)
- athena:questClaim(userId, period, finishedQuestCount, rewards)
- athena:rankUpgrade(userId, newRank)

Fun:
- athena:levelUp(userId, level)
- athena:countingGameSuccess(userId, counterValue)
- athena:countingGameFail(userId, evaluatedInput, expectedCounter)
- athena:hangmanEnd(userId, won, streak, winStreakCurrent)
- athena:higherLowerEnd(userId, streak, highscore)
- athena:starboardSend(userId, messageId, reactionCount)
- athena:starboardReaction(userId, messageId, reactionCount)

Giveaway:
- athena:giveawayEnter(userId, giveawayMessageId, entryCount)
- athena:giveawayLeave(userId, giveawayMessageId, entryCount)

Join to create (temp voice):
- athena:tempVoiceCreate(voiceChannelId, ownerUserId, sourceChannelId)
- athena:tempVoiceDelete(voiceChannelId, ownerUserId)
- athena:tempVoiceOwnerChange(voiceChannelId, previousOwnerUserId, newOwnerUserId)
- athena:tempVoiceOwnerSet(voiceChannelId, executorUserId, newOwnerUserId)
- athena:tempVoiceName(voiceChannelId, executorUserId, newName)
- athena:tempVoiceLimit(voiceChannelId, executorUserId, newLimit)
- athena:tempVoiceVisibility(voiceChannelId, executorUserId, visibility)
- athena:tempVoiceKick(voiceChannelId, executorUserId, targetUserId)
- athena:tempVoiceBlacklist(voiceChannelId, executorUserId, targetUserId)
- athena:tempVoiceUnblacklist(voiceChannelId, executorUserId, targetUserId)

Management:
- athena:applySavedRoles(userId, roleCount)
- athena:autoRole(userId, roleCount)
- athena:saveRoles(userId, roleCount)
- athena:pollVote(userId, pollId, optionId)
- athena:pollVoteRevoke(userId, pollId, optionId)
- athena:suggestionCreate(userId, suggestionNumber)
- athena:suggestionStatus(staffUserId, suggestionId, status)
- athena:suggestionReview(staffUserId, suggestionId, approved)

Moderation:
- athena:blacklist(type, targetUserId, executorUserId, punishmentId)
- athena:unblacklist(type, targetUserId, executorUserId, punishmentId)
- athena:ban(targetUserId, executorUserId, punishmentId, manual)
- athena:unban(targetUserId, executorUserId, punishmentId, manual)
- athena:kick(targetUserId, executorUserId, punishmentId, manual)
- athena:mute(targetUserId, executorUserId, punishmentId, manual)
- athena:unmute(targetUserId, executorUserId, punishmentId, manual)
- athena:warn(targetUserId, executorUserId, punishmentId)
- athena:unwarn(targetUserId, executorUserId, punishmentId)
- athena:strike(targetUserId, executorUserId, punishmentId, strikeAmount)
- athena:automodAction(userId, ruleName, warning)

Music:
- athena:nodeConnect(nodeName)
- athena:nodeDisconnect(nodeName, disconnectCount)
- athena:nodeError(nodeName, errorMessageOrNull)
- athena:playerCreate(guildIdOrNull, defaultVolume)
- athena:trackStart(guildId, requesterUserId, title)
- athena:trackEnd(guildId, titleOrNull, remainingQueueLength)
- athena:queueEnd(guildId, textChannelId)

Security:
- athena:autoVerify(userId)
- athena:verifyFail(userId, remainingAttempts)
- athena:verifySuccess(userId)

Social:
- athena:twitchLive(username, messageId, viewerCount)
- athena:twitchOffline(username)
- athena:youtubeNotification(authorName, videoId, discordChannelId)

Staff management:
- athena:verifyStaffRoles()
- athena:verifyStaffRolesFail(invalidRoleIds)
- athena:strikelistView(viewerUserId, targetMemberId, punishmentId, page)
- athena:taskClaim(userId, taskId)
- athena:taskEditOpen(userId, taskId, type)
- athena:taskEdit(userId, taskId, type)

Tickets:
- athena:ticketCreate(ticket)
- athena:ticketAdd(ticket, addedUserId)
- athena:ticketRemove(ticket, removedUserId)
- athena:ticketRename(ticket, newName)
- athena:ticketClaim(ticket, claimerUserId)
- athena:ticketUnclaim(ticket, unclaimerUserId)
- athena:ticketClose(ticket)
- athena:ticketLower(ticket, level)
- athena:ticketElevate(ticket, level)
- athena:applicationStart(userId, applicationIndex)
- athena:applicationSubmit(userId, applicationIndex, answersCount, submitted)
- athena:applicationCancel(userId, applicationIndex)
- athena:applicationChannelCreate(application)
- athena:applicationChatAllow(applicantUserId, staffUserId, appChannelId)
- athena:applicationChatDeny(applicantUserId, staffUserId, appChannelId)
- athena:applicationHistoryView(staffUserId, applicantUserId, appChannelId)
- athena:applicationAccept(application, roleName, staffUserId)
- athena:applicationDeny(application, staffUserId, reason, timeoutMs)
- athena:applicationAutoClose(application)

### 9) Handlers
Handlers are shared logic components. Create them in /src/handler/<name>.js and register in main.js load():

- this.heart.core.discord.core.handler.manager.register(new Handler(this.heart));

Fetch handlers anywhere:

- const handler = this.heart.core.discord.core.handler.manager.get('<handler_name>');

Athena provides built-in handlers (mod, permissions, cooldowns, leaderboard, economy, etc). Prefer using these for consistency.

### 10) Schedules
Schedules run recurring tasks. Create in /src/schedules/<name>.js and extend schedule base.

- super(heart, '<name>', { repeat: true, interval: <ms> })

Notes:

- Schedules are not immediate. Execution can be delayed up to 20 seconds by the queue.
- Always use try/catch and error interface.

### 11) MongoDB models
Models extend modelBuilder and live in /src/models/<name>.js:

- super('<model_name>', { field: Type, ... })

Access models:

- const model = this.heart.core.database.getModel('<model_name>').getModel();

This returns a Mongoose model instance.

### 12) User data API (critical)
Do not access user data through raw Mongo. Always use the userData API to avoid cache desync.

Fetch:

- const userDoc = await this.heart.core.database.userData.get(guildId, userId)

Save:

- this.heart.core.database.userData.save(guildId, userId, { field: newValue })


### 13) Cache API
Caches are extended Discord Collections:

- Register: this.heart.core.discord.core.cache.manager.register(new cache.interface(heart, '<cache_name>'))
- Get: const cache = this.heart.core.discord.core.cache.manager.get('<cache_name>')

Functions:

- cache.set(key, value)
- cache.get(key)
- cache.has(key)
- cache.delete(key)
- cache.deleteAfter(key)
- cache.cache for raw Collection

### 14) Utils API
Helper functions from this.heart.core.util.util:

- secureEval(string)
- ms(string) and ms(number)
- resolveTime(string)
- sleep(ms)
- getRandomElement(array)
- upperCase(string)
- generateRandom(minLen, maxLen, charArray)
- isNumber(string)
- isEquation(string)
- validateHex(string)
- isPicture(filename)
- validateURL(string)

### 15) Embed and Emoji APIs
Embeds:

- generateErrorEmbed(message)
- generateWarnEmbed(message)
- resolveEmbed(embedConfig, placeholders, guild, user)

resolveEmbed supports placeholders in embed config strings:

- Custom placeholders: %placeholder_name%
- Default placeholders include user, guild, time, random, and custom emojis

Important:

- User placeholders only resolve if a user instance is provided
- Guild placeholders only resolve if a guild instance is provided

Emojis:

- %custom_emoji_<number>% in resolveEmbed
- emoji manager: this.heart.core.discord.core.emoji.manager.getEmoji(<id>)

### 16) REST API routes
Create routes in /src/routes/<name>.js extending the web_api route base:

- super(heart, { name, path: 'api/<path>', type: 'get|post|put|delete' }, { ip: false, key: false })

Notes:

- Web API plugin must be enabled
- Use res.status(...).send(this.generateSuccessResponse(...)) helpers
- Auth key and IP whitelist can be enabled per route

### 17) Plugin manager API
Check and access plugins and other components:

- this.core.discord.core.plugin.manager.isLoaded('<plugin>')
- this.heart.core.discord.core.plugin.manager.get('<plugin>')
- Same pattern for command, event, schedule managers

Plugin instance functions:

- getName, getAuthor, getVersion, getPriority
- getDependencies, getSoftDependencies, getNodeDependencies
- getChannelNames
- setDisabled, setEnabled, isEnabled

### 18) Patterns from the fun plugin (reference implementation)
Main plugin setup:

- Defines a large config with dashboardConfigurable: true
- Registers a game handler in load()
- Registers leaderboard entries via leaderboard handler
- Lists channels for /setup (counting_game, levelup, starboard, birthday, quote_of_the_day, question_of_the_day)

Commands:

- Use lang config for embed templates and warnings
- Use economy handler only if economy plugin is loaded
- Track stats via this.heart.core.database.stats.addStatistic
- Use game handler to avoid concurrent games per user (isPlaying / setPlaying)

Events:

- Interaction customId encodes userId, wager, timestamp
- Enforces that only the original user can interact
- Uses resolveEmbed and resolveButton for consistent UI
- Emits custom events like athena:hangmanEnd and athena:starboardSend

Handlers:

- game handler stores in-memory state and uses caches
- Hangman and Guess The Number use caches keyed by messageId

Schedules:

- questionOTD schedule uses common config timezone and weekly schedule
- Fetches configured channel via database.config.getChannel
- Uses guild model to store last send and index

Models:

- starboard model stores message metadata and reaction counts

### 19) Implementation checklist for new plugins
Use this checklist when implementing a new customer plugin:

1) Define plugin name, version, dependencies, and requiredAthenaVersion.
2) Define channels needed for /setup.
3) Create default config (json5) and matching schema in main.js (with undefined values).
4) If dashboard editing is needed, add /data/dashboard/en-<config>.json.
5) Register handlers in load() and reuse core handlers when possible.
6) Implement commands (SlashCommandBuilder) with try/catch and error interface.
7) Implement events for component interactions using the customId format.
8) Implement schedules and models if the feature needs periodic tasks or Mongo storage.
9) Use userData API for user state and never touch Mongo user data directly.
10) Use embed helpers and emoji manager for consistent UI.
11) If needed, add REST routes and dashboard pages.
12) Add stats tracking and emit Athena custom events where relevant.
