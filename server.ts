import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import dotenv from 'dotenv';
import { CURATED_EXERCISES, TRACKS } from './src/data/curatedExercises.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = Number(process.argv[portArgIdx + 1]);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const nginxPort = process.env.NGINX_PORT ? Number(process.env.NGINX_PORT) : undefined;
  if (envPort && envPort !== nginxPort) {
    return envPort;
  }
  if (process.env.DEFAULT_APP_PORT) {
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }
  return 3000;
}

const app = express();
const PORT = resolvePort();

app.use(express.json());

// REST API Endpoints for Proof Tracks & Exercises
app.get('/api/tracks', (_req: Request, res: Response) => {
  res.json({ tracks: TRACKS });
});

app.get('/api/exercises', (req: Request, res: Response) => {
  const { track, level } = req.query;
  let filtered = CURATED_EXERCISES;
  if (track && typeof track === 'string') {
    filtered = filtered.filter((ex) => ex.trackId === track);
  }
  if (level && typeof level === 'string') {
    filtered = filtered.filter((ex) => ex.level === level);
  }
  return res.json({ exercises: filtered });
});

app.get('/api/exercises/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const exercise = CURATED_EXERCISES.find((ex) => ex.id === id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' });
  }
  return res.json({ exercise });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'MathQuest', timestamp: new Date().toISOString() });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const vitePromise = import('vite').then(({ createServer }) =>
      createServer({
        server: {
          middlewareMode: true,
          hmr: false,
          ws: false,
        },
        appType: 'spa',
      })
    );

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    vitePromise.catch((err) => {
      console.error('Fatal error initializing Vite middleware:', err);
      process.exit(1);
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`MathQuest server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting MathQuest server:', err);
  process.exit(1);
});
