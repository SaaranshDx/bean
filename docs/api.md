# API Reference

**Base URL:** `https://beanapi.mizucode.qzz.io`

All endpoints are public `GET` requests over HTTPS. No authentication, API key, or rate-limit signup is required. CORS is enabled, so the API can be called directly from browser clients.

---

## `GET /`

Service health check. Returns `200` with the bot connection status.

```bash
curl.exe -s https://beanapi.mizucode.qzz.io
```

**Response:**

```json
{"message":"Welcome to bean documentation at https://github.com/SaaranshDx/bean/blob/main/docs/README.md","status":"ok","bot":"ready"}
```

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Link to this documentation |
| `status` | string | `ok` when the HTTP server is serving requests |
| `bot` | string | `ready` when the Discord bot is connected and caching presences |

---

## `GET /api/data/:discorduserid`

Returns the rich presence data for the given Discord user ID.

The `:discorduserid` path parameter must be a valid Discord snowflake: 17 to 20 digits.

```bash
curl.exe -s https://beanapi.mizucode.qzz.io/api/data/123456789012345678
```

| Status | Meaning |
|--------|---------|
| `200` | Presence data returned |
| `400` | Invalid Discord user ID format |
| `404` | No presence data found |
| `503` | Bot is not yet connected to Discord |
| `500` | Internal server error |

**Error responses:**

```json
{ "error": "Invalid Discord user ID format" }
```

```json
{ "error": "No presence data found. The bot must share a guild with this user and the user must be online." }
```

```json
{ "error": "Discord bot is not ready yet" }
```

**Response structure:**

```json
{
  "userId": "123456789012345678",
  "username": "username",
  "globalName": "Display Name",
  "avatar": "https://cdn.discordapp.com/avatars/...",
  "status": "online",
  "clientStatus": {
    "desktop": "online",
    "mobile": "idle"
  },
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
        { "label": "Join Website", "url": null }
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

### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Discord user ID |
| `username` | string | Discord username |
| `globalName` | string | Display name |
| `avatar` | string | Avatar URL |
| `status` | string | User's Discord status: `online`, `idle`, `dnd`, or `offline` |
| `clientStatus` | object | Per-platform status (`desktop`, `mobile`, `web`, `embedded`); key present only when the user is active on that platform |
| `activities` | array | All of the user's current activities |
| `richPresence` | object | The first activity that has rich presence data (application ID + timestamps or assets), or the first activity otherwise |

Absent values are returned as `null` rather than being omitted. A user with no activities has an empty `activities` array and a `null` `richPresence`.

### Activity fields

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
| `buttons` | array | Button labels as `{ "label", "url" }` objects; `url` is `null` when Discord does not share it |
| `secrets.join` | string | Join secret for direct multiplayer invites |
| `secrets.spectate` | string | Spectate secret |
| `secrets.match` | string | Match secret |
| `instance` | boolean | Whether this is an active game session |
