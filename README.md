# bean

A REST API that returns a Discord user's Rich Presence data as JSON. Uses a Discord bot connected via Gateway to listen for presence updates and serves the data through an HTTP endpoint.

## How it works

A Discord bot connects to the Gateway with the `GuildPresences` and `GuildMembers` intents. On startup it fetches all members from all guilds it belongs to and caches their presence data. Real-time `presenceUpdate` events keep the cache fresh. The Express API serves this cached data at `GET /data/:discorduserid`.

## Prerequisites

- Node.js 18 or later
- A Discord bot token with **Presence Intent** and **Server Members Intent** enabled in the [Discord Developer Portal](https://discord.com/developers/applications)
- The bot must be invited to at least one server with the users whose presence you want to query

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
PORT=8000
```

## Usage

```bash
npm start
```

The server starts on the configured port (default 8000). The bot connects to Discord and begins caching presences.

### Testing with mock data

```bash
curl.exe -X POST http://localhost:8000/mock
# {"message":"Mock presence injected","userId":"000000000000000001"}

curl.exe -s http://localhost:8000/data/000000000000000001
```

### End-to-end testing with a second bot

Create a second Discord bot application, enable the bot, invite it to the same server as the main bot, and add its token to `.env`:

```
TEST_BOT_TOKEN=your_second_bot_token_here
```

Then run:

```bash
npm run test:presence
```

This sets a rich presence on the test bot so you can query it via the API using its user ID (printed on startup).

---

## API

### `GET /`

Health check. Returns `200` when the server is running.

```json
{"status":"ok","bot":"ready"}
```

### `GET /data/:discorduserid`

Returns the rich presence data for the given Discord user ID.

| Status | Meaning |
|--------|---------|
| `200` | Presence data returned |
| `400` | Invalid Discord user ID format |
| `404` | No presence data found |
| `503` | Bot is not yet connected to Discord |

**Example:**

```bash
curl.exe -s http://localhost:8000/data/123456789012345678
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
        "start": 1781034661000,
        "end": 1781045461000
      },
      "assets": {
        "large_image": "vscode_logo",
        "large_text": "Visual Studio Code",
        "small_image": "file_js",
        "small_text": "JavaScript"
      },
      "party": {
        "id": "party-abc-123",
        "size": 2,
        "max": 4
      },
      "buttons": [
        { "label": "Join Website" }
      ],
      "secrets": {
        "join": null,
        "spectate": null,
        "match": null
      },
      "instance": true
    }
  ],
  "richPresence": {}
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
| `richPresence` | object | The first activity that has rich presence data (application ID + timestamps or assets), or the first activity otherwise |

#### Activity fields

| Field | Type | Description |
|-------|------|-------------|
| `application.id` | string | Discord application ID |
| `application.name` | string | Application name (replaces the "Playing" prefix) |
| `state` | string | Current status or sub-state |
| `details` | string | Top-level description of what the user is doing |
| `timestamps.start` | number | Unix millisecond timestamp for elapsed timer |
| `timestamps.end` | number | Unix millisecond timestamp for countdown timer |
| `assets.large_image` | string | Large image asset key or URL |
| `assets.large_text` | string | Tooltip text for the large image |
| `assets.small_image` | string | Small image asset key or URL |
| `assets.small_text` | string | Tooltip text for the small image |
| `party.id` | string | Party/lobby identifier |
| `party.size` | number | Current party size |
| `party.max` | number | Maximum party size |
| `buttons` | array | Button labels (URLs are not available through the Gateway) |
| `secrets.join` | string | Join secret for direct multiplayer invites |
| `secrets.spectate` | string | Spectate secret |
| `secrets.match` | string | Match secret |
| `instance` | boolean | Whether this is an active game session |

### `POST /mock`

Injects a fake presence into the cache for testing. Returns the mock user ID.

```bash
curl.exe -X POST http://localhost:8000/mock
```

**Response:**
```json
{"message":"Mock presence injected","userId":"000000000000000001"}
```

---

## Project structure

```
bean/
  src/
    index.js  -- Express server entry point
    bot.js    -- Discord client, presence cache, mock injection
    api.js    -- REST routes
  test/
    set-presence.js -- Sets a real rich presence using a second bot
  .env.example
  .gitignore
  package.json
  README.md
```

## Notes

- The bot caches presences from all members in all guilds it shares with them on startup.
- Presences are updated in real time via the Gateway `presenceUpdate` event.
- Only users in a mutual guild with the bot can have their presence queried.
- Button URLs and secret values are typically not available to bots that are not the application owner.
