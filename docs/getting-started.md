# Getting Started

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
