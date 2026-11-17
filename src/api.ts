/** API base. Empty = same origin (dev proxy or single host). Set VITE_API_URL when the API is hosted separately. */
const BASE = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

/** JSON POST with timeout. Never throws: the app must work without the backend. */
export async function post(path: string, body: unknown, ms = 6000): Promise<boolean> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    return r.ok;
  } catch { return false; } finally { clearTimeout(t); }
}

/** Warm a sleeping free-tier API while the learner reads the page. */
export function wake(): void { if (BASE) fetch(BASE + '/api/health').catch(() => undefined); }
