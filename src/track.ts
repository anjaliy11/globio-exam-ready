import { post } from './api';

const sent = new Set<string>();
/** Anonymous funnel event: random id + step name only. Respects Do Not Track. Sent once per id per page load. */
export function track(id: string, e: string): void {
  try { if (navigator.doNotTrack === '1') return; } catch { /* ignore */ }
  const k = id + e;
  if (sent.has(k)) return;
  sent.add(k);
  void post('/api/event', { id, e }, 4000);
}
