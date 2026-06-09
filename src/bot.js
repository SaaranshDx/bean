import { Client, GatewayIntentBits } from 'discord.js';

const presences = new Map();
let ready = false;
let client;

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
