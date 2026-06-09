import 'dotenv/config';
import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

const token = process.env.TEST_BOT_TOKEN;
if (!token) {
  console.error('TEST_BOT_TOKEN is required. Create a second bot app in the Discord Developer Portal,'
    + ' invite it to the same server as the main bot, and set its token in .env');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Test bot connected: ${client.user.tag}`);
  console.log(`User ID: ${client.user.id}`);
  console.log('Use this ID to query GET /data/<userId> on the API');

  client.user.setPresence({
    activities: [{
      name: 'Bean Test Suite',
      type: ActivityType.Playing,
      state: 'Running integration tests',
      details: 'Testing the Rich Presence API',
      timestamps: {
        start: Date.now(),
      },
      assets: {
        largeImage: 'bean_large',
        largeText: 'Bean Test Application',
        smallImage: 'bean_small',
        smallText: 'Test Mode',
      },
      party: {
        id: 'test-party-001',
        size: [2, 4],
      },
      buttons: ['Join Test', 'View Repo'],
    }],
  });

  console.log('Rich presence set. Press Ctrl+C to exit.');
});

process.on('SIGINT', () => {
  client.destroy();
  process.exit(0);
});

await client.login(token);
