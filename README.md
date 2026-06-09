# bean

A REST API that returns a Discord user's Rich Presence data as JSON. Uses a Discord bot connected via Gateway to listen for presence updates and serves the data through an HTTP endpoint.

## How it works

A Discord bot connects to the Gateway with the `GuildPresences` intent. It maintains an in-memory cache of all user presences from mutual guilds. The Express API serves this cached data at `/data/:discorduserid`.

## Prerequisites

- Node.js 18 or later
- A Discord bot token with the following intents enabled in the Discord Developer Portal:
  - Presence Intent
  - Server Members Intent

## Setup

```bash
git clone <repo>
cd bean
npm install
cp .env.example .env
```

Edit `.env` and add your bot token:

```
DISCORD_BOT_TOKEN=your_token_here
PORT=3000
```

## Usage

```bash
npm start
```

The server starts on the configured port (default 3000). The bot connects to Discord and begins caching presences.

## API

### `GET /data/:discorduserid`

Returns the rich presence data for the given Discord user ID. The bot must share a guild with the user and the user must be online with an active rich presence.

**Example:**

```bash
curl http://localhost:3000/data/123456789012345678
```

**Response structure:**

```json
{
  "userId": "123456789012345678",
  "username": "username",
  "globalName": "Display Name",
  "avatar": "https://cdn.discordapp.com/avatars/...",
  "activities": [
    {
      "application": {
        "id": "383226320970055681",
        "name": "Visual Studio Code"
      },
      "state": "Editing main.js",
      "details": "Working on bean",
      "timestamps": {
        "start": 1700000000000,
        "end": null
      },
      "assets": {
        "large_image": "vscode_logo",
        "large_text": "Visual Studio Code",
        "small_image": "file_js",
        "small_text": "JavaScript"
      },
      "party": null,
      "buttons": [],
      "secrets": {
        "join": null,
        "spectate": null,
        "match": null
      },
      "instance": false
    }
  ],
  "richPresence": { }
}
```

#### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Discord user ID |
| `username` | string | Discord username |
| `globalName` | string | Display name |
| `avatar` | string | Avatar URL |
| `activities` | array | All of the user's current activities |
| `richPresence` | object | The first activity that has rich presence data (application ID + timestamps or assets) |

#### Activity fields

| Field | Type | Description |
|-------|------|-------------|
| `application.id` | string | Discord application ID |
| `application.name` | string | Application name (replaces the "Playing" prefix) |
| `state` | string | Current status or sub-state |
| `details` | string | Top-level description of what the user is doing |
| `timestamps.start` | number | Unix millisecond timestamp for elapsed timer |
| `timestamps.end` | number | Unix millisecond timestamp for countdown timer |
| `assets.large_image` | string | Large image asset key |
| `assets.large_text` | string | Tooltip text for the large image |
| `assets.small_image` | string | Small image asset key |
| `assets.small_text` | string | Tooltip text for the small image |
| `party.id` | string | Party/lobby identifier |
| `party.size` | number | Current party size |
| `party.max` | number | Maximum party size |
| `buttons` | array | Button labels (URLs are not available from the Gateway API) |
| `secrets.join` | string | Join secret for direct multiplayer invites |
| `secrets.spectate` | string | Spectate secret |
| `secrets.match` | string | Match secret |
| `instance` | boolean | Whether this is an active game session |

#### Error responses

| Status | Meaning |
|--------|---------|
| `400` | Invalid Discord user ID format |
| `404` | No presence data found for the given user |
| `503` | Bot is not yet connected to Discord |

### `GET /`

Health check.

```json
{
  "status": "ok",
  "bot": "ready"
}
```

## Notes

- The bot caches presences from all members in all guilds it shares with them on startup.
- Presences are updated in real time via the Gateway `presenceUpdate` event.
- Only users in a mutual guild with the bot can have their presence queried.
- Button URLs and secret values are typically not available to bots that are not the application owner.
