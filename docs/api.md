# API Reference

## `GET /`

Health check. Returns `200` when the server is running.

```json
{"status":"ok","bot":"ready"}
```

## `GET /data/:discorduserid`

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

### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Discord user ID |
| `username` | string | Discord username |
| `globalName` | string | Display name |
| `avatar` | string | Avatar URL |
| `activities` | array | All of the user's current activities |
| `richPresence` | object | The first activity that has rich presence data (application ID + timestamps or assets), or the first activity otherwise |

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
| `buttons` | array | Button labels (URLs are not available through the Gateway) |
| `secrets.join` | string | Join secret for direct multiplayer invites |
| `secrets.spectate` | string | Spectate secret |
| `secrets.match` | string | Match secret |
| `instance` | boolean | Whether this is an active game session |

## `POST /mock`

Injects a fake presence into the cache for testing. Returns the mock user ID.

```bash
curl.exe -X POST http://localhost:8000/mock
```

**Response:**

```json
{"message":"Mock presence injected","userId":"000000000000000001"}
```
