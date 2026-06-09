import { Router } from 'express';
import { getPresences, isReady, injectMockPresence } from './bot.js';

const router = Router();

const SNOWFLAKE_RE = /^\d{17,20}$/;

router.get('/data/:discorduserid', (req, res) => {
  const userId = req.params.discorduserid;

  if (!SNOWFLAKE_RE.test(userId)) {
    return res.status(400).json({ error: 'Invalid Discord user ID format' });
  }

  if (!isReady()) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  const presence = getPresences().get(userId);

  if (!presence) {
    return res.status(404).json({
      error: 'No presence data found. The bot must share a guild with this user and the user must be online.',
    });
  }

  const user = presence.member?.user;

  const activities = presence.activities.map(a => {
    const ts = a.timestamps;
    const assets = a.assets;
    const party = a.party;
    const secrets = a.secrets;
    const flags = a.flags?.bitfield ?? 0;

    return {
      application: {
        id: a.applicationId || null,
        name: a.name || null,
      },
      state: a.state || null,
      details: a.details || null,
      timestamps: {
        start: ts?.start?.getTime() || null,
        end: ts?.end?.getTime() || null,
      },
      assets: {
        large_image: assets?.largeImage || null,
        large_text: assets?.largeImageText || null,
        small_image: assets?.smallImage || null,
        small_text: assets?.smallImageText || null,
      },
      party: party ? {
        id: party.id || null,
        size: party.size?.[0] ?? null,
        max: party.size?.[1] ?? null,
      } : null,
      buttons: a.buttons?.map(label => ({ label })) || [],
      secrets: secrets ? {
        join: secrets.join || null,
        spectate: secrets.spectate || null,
        match: secrets.match || null,
      } : { join: null, spectate: null, match: null },
      instance: (flags & 1) === 1,
    };
  });

  const richPresence = activities.find(
    a => a.application.id && (a.timestamps.start || a.timestamps.end || a.assets.large_image)
  ) || activities[0] || null;

  res.json({
    userId: presence.userId,
    username: user?.username || null,
    globalName: user?.globalName || null,
    avatar: user?.displayAvatarURL({ size: 128 }) || null,
    activities,
    richPresence,
  });
});

router.post('/mock', (_req, res) => {
  if (!isReady()) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  const mockUserId = '000000000000000001';
  injectMockPresence(mockUserId);
  res.json({ message: 'Mock presence injected', userId: mockUserId });
});

export default router;
