# Architecture

## How it works

A Discord bot connects to the Gateway with the `GuildPresences` and `GuildMembers` intents. On startup it fetches all members from all guilds it belongs to and caches their presence data. Real-time `presenceUpdate` events keep the cache fresh. The Express API serves this cached data publicly at `GET /api/data/:discorduserid` under the hosted base URL `https://beanapi.mizucode.qzz.io`.

`GET /` is a health check that reports the HTTP server status and the bot connection state.

## Notes

- The hosted instance caches presences from all members in all guilds it shares with the bot on startup.
- Presences are updated in real time via the Gateway `presenceUpdate` event.
- Only users in a mutual guild with the bot can have their presence queried.
- Button URLs and secret values are typically not available to bots that are not the application owner, so those fields are usually `null`.
- CORS is enabled so the API can be called directly from browser clients.
- Absent presence fields are serialized as `null` rather than being omitted, so response shapes stay stable for consumers.
