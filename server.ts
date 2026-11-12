import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import dotenv from 'dotenv';
import { CURATED_EXERCISES, TOPICS } from './src/data/curatedExercises.ts';
import { HistoryLog, UserStats } from './src/types/math.ts';

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

// In-memory persistent history store (with fallback for server sessions)
let serverHistoryLogs: HistoryLog[] = [];

// REST API Endpoints

// 1. Get all math topics
app.get('/api/topics', (_req: Request, res: Response) => {
  res.json({ topics: TOPICS });
});

// 2. Get curated exercises (optionally filtered by topic)
app.get('/api/exercises', (req: Request, res: Response) => {
  const { topic } = req.query;
  if (topic && typeof topic === 'string') {
    const filtered = CURATED_EXERCISES.filter((ex) => ex.topicId === topic);
    return res.json({ exercises: filtered });
  }
  return res.json({ exercises: CURATED_EXERCISES });
});

// 3. Get specific exercise by ID
app.get('/api/exercises/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const exercise = CURATED_EXERCISES.find((ex) => ex.id === id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' });
  }
  return res.json({ exercise });
});

// 4. Get practice history and aggregated statistics
app.get('/api/history', (_req: Request, res: Response) => {
  const totalAttempts = serverHistoryLogs.length;
  const succeededCount = serverHistoryLogs.filter((l) => l.outcome === 'success').length;
  const failedCount = serverHistoryLogs.filter((l) => l.outcome === 'failed').length;
  const successPercentage = totalAttempts > 0 ? (succeededCount / totalAttempts) * 100 : 0;
  const failurePercentage = totalAttempts > 0 ? (failedCount / totalAttempts) * 100 : 0;
  const totalPoints = serverHistoryLogs
    .filter((l) => l.outcome === 'success')
    .reduce((sum, l) => sum + l.pointsEarned, 0);

  const stats: UserStats = {
    succeededCount,
    failedCount,
    totalAttempts,
    successPercentage,
    failurePercentage,
    totalPoints,
  };

  res.json({
    logs: serverHistoryLogs,
    stats,
  });
});

// 5. Submit a practice outcome log (Green success or Red fail)
app.post('/api/history/log', (req: Request, res: Response) => {
  const { exerciseId, outcome, timeSpentSeconds } = req.body;

  if (!exerciseId || (outcome !== 'success' && outcome !== 'failed')) {
    return res.status(400).json({ error: 'Invalid payload: exerciseId and outcome required' });
  }

  const exercise = CURATED_EXERCISES.find((ex) => ex.id === exerciseId);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  const newLog: HistoryLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    exerciseId,
    exerciseTitle: exercise.title,
    topicId: exercise.topicId,
    outcome,
    pointsEarned: outcome === 'success' ? exercise.pointsValue : 0,
    timeSpentSeconds: typeof timeSpentSeconds === 'number' ? timeSpentSeconds : 0,
    timestamp: new Date().toISOString(),
  };

  serverHistoryLogs.unshift(newLog);

  // Keep last 100 entries
  if (serverHistoryLogs.length > 100) {
    serverHistoryLogs = serverHistoryLogs.slice(0, 100);
  }

  return res.status(201).json({ success: true, log: newLog });
});

// 6. Cadence schedule info
app.get('/api/schedule', (_req: Request, res: Response) => {
  res.json({
    cadenceHours: 5,
    intervalMs: 5 * 60 * 60 * 1000,
    totalCuratedExercises: CURATED_EXERCISES.length,
    description: 'A new mathematical exercise unlocks every 5 hours',
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'MathQuest', timestamp: new Date().toISOString() });
});

// Setup Vite middleware or production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    // Initialize Vite asynchronously so port 3000 binds immediately for health checks
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

    // Warm up Vite in background and log any config failure immediately
    vitePromise.catch((err) => {
      console.error('Fatal error initializing Vite middleware:', err);
      process.exit(1);
    });
  } else {
    // Production mode: serve built assets from dist
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
