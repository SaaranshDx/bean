# Getting Started

Bean is available as a hosted API. There is nothing to install and no account to create -- just send `GET` requests to the public base URL.

**Base URL**

```
https://beanapi.mizucode.qzz.io
```

## Installation

The API itself is already hosted and ready to call. The only setup step is adding the Bean bot to a Discord server, so it can see the members whose presence you want to query.

**Invite Bean to your server:**

[**+ Add Bean to Discord**](https://discord.com/oauth2/authorize?client_id=1514018940735590480)

1. Open the link above and pick a server you administer.
2. Approve the requested permissions.
3. Bean joins the server and begins caching presence data for its members.

You need **Manage Server** permission to add it. Once the bot is in the server, anyone who is online in that server can be looked up through the API.

## Prerequisites

- A Discord user ID (17 to 20 digits). Enable Developer Mode in Discord, then right-click a user and choose **Copy User ID**.
- Any HTTP client: `curl`, a browser, Postman, or an HTTP library in your language of choice.

## Verify the service

```bash
curl.exe -s https://beanapi.mizucode.qzz.io
```

```json
{"message":"Welcome to bean documentation at https://github.com/SaaranshDx/bean/blob/main/docs/README.md","status":"ok","bot":"ready"}
```

`"bot":"ready"` means the service is connected to Discord and caching presence data.

## Fetch presence data

Replace the ID with the Discord user you want to look up:

```bash
curl.exe -s https://beanapi.mizucode.qzz.io/api/data/123456789012345678
```

You get back a JSON object with the user's status, per-platform client status, and their current activities. See the [API Reference](api.md) for the full field list.

## Using the API

### JavaScript (fetch)

```js
const res = await fetch('https://beanapi.mizucode.qzz.io/api/data/123456789012345678');
const data = await res.json();
console.log(data.globalName, data.status);
```

### Python (requests)

```python
import requests

res = requests.get("https://beanapi.mizucode.qzz.io/api/data/123456789012345678")
res.raise_for_status()
data = res.json()
print(data["globalName"], data["status"])
```

### Browser

CORS is enabled, so you can call the API straight from a web page:

```js
const res = await fetch('https://beanapi.mizucode.qzz.io/api/data/123456789012345678');
const { globalName, status, richPresence } = await res.json();
```

## Troubleshooting

| Status | Cause | Fix |
|--------|-------|-----|
| `400` | Malformed user ID | Use the full snowflake ID, digits only |
| `404` | No cached presence | The user must be online and share a server with the bot |
| `503` | Bot not connected yet | Retry after a few seconds |

Run the health check on `GET /` to confirm the bot is `ready` before assuming a lookup is broken.
