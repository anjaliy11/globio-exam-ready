import { useState } from 'react';
import { track } from './track';

const SITE = 'https://globio.ai';
const CTA: Record<string, [string, string]> = {
  ready: ['Book with confidence', 'Talk to Globio about exam-day preparation and your next step toward Germany.'],
  almost: ['Close the gap faster', 'Talk to Globio about practising your weakest skills before you book.'],
  'not-yet': ['Build a plan', 'Talk to Globio about a structured path to A1 and beyond.'],
};

export default function Growth({ id, pct, label, verdict }: { id: string; pct: number; label: string; verdict: string }) {
  const [msg, setMsg] = useState('');
  const [title, body] = CTA[verdict] ?? CTA['almost'];
  const text = `I checked my German A1 readiness: ${pct}% (${label}). Check yours:`;
  const share = async () => {
    track(id, 'share');
    const link = location.origin;
    try {
      if (navigator.share) { await navigator.share({ title: 'Am I exam-ready?', text, url: link }); return; }
      await navigator.clipboard.writeText(`${text} ${link}`);
      setMsg('Copied. Paste it anywhere.');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setMsg(`Could not copy. Select and copy: ${text} ${link}`);
    }
  };
  return (
    <section className="grow">
      <div className="card share" aria-label="Your result card">
        <p className="mono">German A1 check</p>
        <p className="big small">{pct}%</p>
        <p><strong>{label}</strong></p>
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="row">
        <a className="go" href={`${SITE}?utm_source=exam-ready&utm_medium=result&utm_campaign=${verdict}`} target="_blank" rel="noopener noreferrer" onClick={() => track(id, 'cta')}>Talk to Globio</a>
        <button className="ghost" onClick={share}>Share my result</button>
      </div>
      {msg && <p className="mono" role="status">{msg}</p>}
    </section>
  );
}
