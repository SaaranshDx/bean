# bean

A hosted REST API that returns a Discord user's Rich Presence data as JSON. A Discord bot connected via Gateway listens for presence updates and serves the data through a public HTTP endpoint.

**Base URL**

```
https://beanapi.mizucode.qzz.io
```

## Quick start

Check that the service is up:

```bash
curl.exe -s https://beanapi.mizucode.qzz.io
```

```json
{"message":"Welcome to bean documentation at https://github.com/SaaranshDx/bean/blob/main/docs/README.md","status":"ok","bot":"ready"}
```

Fetch presence data for a Discord user:

```bash
curl.exe -s https://beanapi.mizucode.qzz.io/api/data/123456789012345678
```

No API key, account, or signup is required. Send plain `GET` requests from anything that can make HTTP calls.

## Installation

The API is hosted and ready to use. To look up presences, add the Bean bot to a server whose members you want to query:

[**+ Add Bean to Discord**](https://discord.com/oauth2/authorize?client_id=1514018940735590480)

Online users in that server are then queryable through the API.

## Documentation

- Getting Started -- Making your first request, clients, and practical usage
- API Reference -- Endpoints, response structure, status codes, and field descriptions
- Architecture -- How the hosted service works and important notes
- Project Structure -- File and directory layout of the server source

## Source

The service is open source at [github.com/SaaranshDx/bean](https://github.com/SaaranshDx/bean).
