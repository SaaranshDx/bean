import 'dotenv/config';
import express from 'express';
import { startBot, isReady } from './bot.js';
import apiRouter from './api.js';
import cors from 'cors'

const PORT = process.env.PORT || 3000;

const app = express();


app.use(cors({
    origin: "https://saaranshdx.github.io"
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(apiRouter);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', bot: isReady() ? 'ready' : 'connecting' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error('DISCORD_BOT_TOKEN environment variable is required');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  await startBot(token);
  console.log('Discord bot connected');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
