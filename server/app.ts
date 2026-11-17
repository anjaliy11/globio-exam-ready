import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { QUESTIONS } from '../src/data';
import { score } from '../src/scoring';

export const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));

const dir = () => path.resolve(process.env.DATA_DIR ?? 'data');
const RATINGS = ['too-low', 'about-right', 'too-high'], OUTCOMES = ['passed', 'failed', 'not-taken'];
const ID = /^[a-zA-Z0-9-]{8,64}$/, EVENT = /^(view|start|complete|share|cta|q([1-9]|1[0-5]))$/;
const hits = new Map<string, { n: number; t: number }>();

function append(name: string, row: object): boolean {
  try { fs.mkdirSync(dir(), { recursive: true }); fs.appendFileSync(path.join(dir(), name), JSON.stringify(row) + '\n'); return true; } catch { return false; }
}
function rows(name: string): Record<string, string>[] {
  const out: Record<string, string>[] = [];
  try { for (const l of fs.readFileSync(path.join(dir(), name), 'utf8').split('\n')) { try { if (l) out.push(JSON.parse(l)); } catch { /* skip bad line */ } } } catch { /* no file yet */ }
  return out;
}

/** CORS: only origins listed in ALLOWED_ORIGIN (comma-separated). Needed when the frontend is hosted separately. */
app.use('/api', (req, res, next) => {
  const allowed = (process.env.ALLOWED_ORIGIN ?? '').split(',').map((s) => s.trim()).filter(Boolean), o = req.headers.origin;
  if (o && (allowed.includes(o) || allowed.includes('*'))) {
    res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/api', (req, res, next) => {
  const ip = req.ip ?? 'x', now = Date.now(), h = hits.get(ip);
  if (!h || now - h.t > 60_000) { hits.set(ip, { n: 1, t: now }); return next(); }
  if (++h.n > 120) return res.status(429).json({ error: 'Too many requests' });
  next();
});

app.get('/api/health', (_q, res) => res.json({ ok: true }));

app.post('/api/event', (req, res) => {
  const { id, e } = req.body ?? {};
  if (typeof id !== 'string' || !ID.test(id) || typeof e !== 'string' || !EVENT.test(e)) return res.status(400).json({ error: 'invalid event' });
  if (!append('events.jsonl', { t: new Date().toISOString(), id, e })) return res.status(500).json({ error: 'Could not save' });
  res.json({ ok: true });
});

/** Validates everything and recomputes the score server-side. Never trusts a client score. */
app.post('/api/submit', (req, res) => {
  const { id, conf, answers, rating, outcome } = req.body ?? {};
  if (typeof id !== 'string' || !ID.test(id)) return res.status(400).json({ error: 'invalid id' });
  if (!Number.isInteger(conf) || conf < 1 || conf > 5) return res.status(400).json({ error: 'invalid confidence' });
  if (!RATINGS.includes(rating)) return res.status(400).json({ error: 'invalid rating' });
  if (outcome !== undefined && !OUTCOMES.includes(outcome)) return res.status(400).json({ error: 'invalid outcome' });
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return res.status(400).json({ error: 'invalid answers' });
  const clean: Record<string, number> = {};
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (!Number.isInteger(v) || v < 0 || v >= q.options.length) return res.status(400).json({ error: `invalid answer ${q.id}` });
    clean[q.id] = v;
  }
  const r = score(QUESTIONS, clean);
  const row = { t: new Date().toISOString(), id, conf, rating, ...(outcome ? { outcome } : {}), correct: r.correct, verdict: r.verdict, answers: clean };
  if (!append('responses.jsonl', row)) return res.status(500).json({ error: 'Could not save' });
  res.json({ ok: true });
});

/** Calibration (real pass rate per verdict) and funnel (unique learners per step). */
app.get('/api/stats', (_q, res) => {
  const byId = new Map<string, Record<string, string>>();
  for (const o of rows('responses.jsonl')) byId.set(o.id, { ...byId.get(o.id), ...o });
  const byVerdict: Record<string, { n: number; passed: number; failed: number }> = {}, ratings: Record<string, number> = {};
  for (const o of byId.values()) {
    const b = (byVerdict[o.verdict] ??= { n: 0, passed: 0, failed: 0 });
    b.n++; if (o.outcome === 'passed') b.passed++; if (o.outcome === 'failed') b.failed++;
    ratings[o.rating] = (ratings[o.rating] ?? 0) + 1;
  }
  const seen = new Map<string, Set<string>>();
  for (const o of rows('events.jsonl')) { if (!seen.has(o.e)) seen.set(o.e, new Set()); seen.get(o.e)!.add(o.id); }
  const funnel = Object.fromEntries([...seen.entries()].map(([k, v]) => [k, v.size]));
  res.json({ responses: byId.size, byVerdict, ratings, funnel });
});

const dist = path.resolve('dist');
if (fs.existsSync(dist)) app.use(express.static(dist));
app.use('/api', (_q, res) => res.status(404).json({ error: 'Not found' }));
app.use((_e: Error, _q: express.Request, res: express.Response, _n: express.NextFunction) => res.status(400).json({ error: 'Bad request' }));
