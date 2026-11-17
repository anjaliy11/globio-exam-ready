import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { QUESTIONS } from '../src/data';

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'gx-'));
const { app } = await import('./app');
let srv: Server, base = '';
beforeAll(() => new Promise<void>((ok) => { srv = app.listen(0, () => { base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`; ok(); }); }));
afterAll(() => { srv.close(); });

const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.answer]));
const send = (b: unknown, raw?: string) => fetch(base + '/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ?? JSON.stringify(b) });

describe('api', () => {
  it('accepts a valid submission and reports calibration', async () => {
    expect((await send({ id: 'abcd-1234', conf: 4, answers, rating: 'about-right' })).status).toBe(200);
    expect((await send({ id: 'abcd-1234', conf: 4, answers, rating: 'about-right', outcome: 'passed' })).status).toBe(200);
    const s = await (await fetch(base + '/api/stats')).json();
    expect(s.responses).toBe(1);
    expect(s.byVerdict.ready).toEqual({ n: 1, passed: 1, failed: 0 });
  });
  it('rejects bad input without crashing', async () => {
    const ok = { id: 'abcd-1234', conf: 3, answers, rating: 'too-low' };
    for (const bad of [{ ...ok, id: 'x' }, { ...ok, conf: 9 }, { ...ok, rating: 'meh' }, { ...ok, outcome: 'maybe' }, { ...ok, answers: { v1: 99 } }, { ...ok, answers: [] }, null])
      expect((await send(bad)).status).toBe(400);
    expect((await send(null, '{bad json')).status).toBe(400);
    expect((await fetch(base + '/api/nope')).status).toBe(404);
  });
  it('records anonymous funnel events and rejects bad ones', async () => {
    const ev = (e: string, id = 'zzzz-0001') => fetch(base + '/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, e }) });
    for (const e of ['view', 'start', 'q1', 'q2', 'q2', 'complete']) expect((await ev(e)).status).toBe(200);
    await ev('view', 'zzzz-0002');
    for (const e of ['q16', 'q0', 'hack', '']) expect((await ev(e)).status).toBe(400);
    const s = await (await fetch(base + '/api/stats')).json();
    expect(s.funnel.view).toBe(2); expect(s.funnel.q2).toBe(1); expect(s.funnel.complete).toBe(1);
  });
  it('allows only configured CORS origins and answers preflight', async () => {
    process.env.ALLOWED_ORIGIN = 'https://app.example';
    const ok = await fetch(base + '/api/health', { headers: { Origin: 'https://app.example' } });
    expect(ok.headers.get('access-control-allow-origin')).toBe('https://app.example');
    const no = await fetch(base + '/api/health', { headers: { Origin: 'https://evil.example' } });
    expect(no.headers.get('access-control-allow-origin')).toBeNull();
    expect((await fetch(base + '/api/submit', { method: 'OPTIONS', headers: { Origin: 'https://app.example' } })).status).toBe(204);
  });
});
