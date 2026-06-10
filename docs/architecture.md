# Architecture

## How it works

A Discord bot connects to the Gateway with the `GuildPresences` and `GuildMembers` intents. On startup it fetches all members from all guilds it belongs to and caches their presence data. Real-time `presenceUpdate` events keep the cache fresh. The Express API serves this cached data at `GET /data/:discorduserid`.

## Notes

- The bot caches presences from all members in all guilds it shares with them on startup.
- Presences are updated in real time via the Gateway `presenceUpdate` event.
- Only users in a mutual guild with the bot can have their presence queried.
- Button URLs and secret values are typically not available to bots that are not the application owner.
