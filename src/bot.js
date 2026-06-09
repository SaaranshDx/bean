import { Client, GatewayIntentBits } from 'discord.js';

const presences = new Map();
let ready = false;
let client;

export function injectMockPresence(userId) {
  const mock = {
    userId,
    member: {
      user: {
        id: userId,
        username: 'MockUser',
        globalName: 'Mock User',
        displayAvatarURL: () => `https://cdn.discordapp.com/avatars/${userId}/mock.png`,
      },
    },
    activities: [{
      applicationId: '383226320970055681',
      name: 'Mock Application',
      type: 0,
      state: 'Running mock tests',
      details: 'Testing the Rich Presence API',
      timestamps: {
        start: new Date(Date.now() - 7_200_000),
        end: new Date(Date.now() + 3_600_000),
      },
      assets: {
        largeImage: 'mock_large',
        largeImageText: 'Mock Large Image',
        smallImage: 'mock_small',
        smallImageText: 'Mock Small Image',
      },
      party: {
        id: 'mock-party-001',
        size: [3, 5],
      },
      buttons: ['Mock Button 1', 'Mock Button 2'],
      secrets: {
        join: 'mock-join-secret',
        spectate: 'mock-spectate-secret',
        match: 'mock-match-secret',
      },
      flags: { bitfield: 1 },
    }],
  };

  presences.set(userId, mock);
  return userId;
}

export function getPresences() {
  return presences;
}

export function isReady() {
  return ready;
}

export async function startBot(token) {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.on('ready', async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        await guild.members.fetch();
        for (const [, member] of guild.members.cache) {
          if (member.presence) {
            presences.set(member.id, member.presence);
          }
        }
      } catch {
        // guild may be unavailable or too large
      }
    }
    ready = true;
  });

  client.on('presenceUpdate', (_oldPresence, newPresence) => {
    if (newPresence) {
      presences.set(newPresence.userId, newPresence);
    }
  });

  await client.login(token);
  return client;
}
