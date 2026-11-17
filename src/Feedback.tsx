import { useState } from 'react';
import { post } from './api';

const RATE = [['too-low', 'Felt too low'], ['about-right', 'About right'], ['too-high', 'Felt too high']] as const;
const OUT = [['passed', 'I passed'], ['failed', 'I failed'], ['not-taken', 'Not taken yet']] as const;

/** Opt-in. Sends answers, confidence, rating and (optional) real exam outcome. No name or email. */
export default function Feedback({ id, conf, answers }: { id: string; conf: number; answers: Record<string, number> }) {
  const [rating, setRating] = useState(''), [outcome, setOutcome] = useState('');
  const [st, setSt] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle');
  const send = async () => {
    if (st === 'busy' || !rating) return;
    setSt('busy');
    setSt((await post('/api/submit', { id, conf, answers, rating, ...(outcome ? { outcome } : {}) })) ? 'ok' : 'err');
  };
  if (st === 'ok') return <section><h2>Thank you</h2><p>Your anonymous result was sent. It helps us check this score against real exam outcomes.</p></section>;
  const group = (items: readonly (readonly [string, string])[], val: string, set: (v: string) => void, label: string) => (
    <div className="row" role="group" aria-label={label}>
      {items.map(([k, l]) => <button key={k} className={'pill' + (val === k ? ' on' : '')} aria-pressed={val === k} onClick={() => set(val === k ? '' : k)}>{l}</button>)}
    </div>
  );
  return (
    <section>
      <h2>Help us check this score</h2>
      <p><strong>Does the result match how you feel?</strong></p>
      {group(RATE, rating, setRating, 'Rating')}
      <p><strong>Optional: have you taken the real exam?</strong></p>
      {group(OUT, outcome, setOutcome, 'Exam outcome')}
      <button className="go" disabled={!rating || st === 'busy'} onClick={send}>{st === 'busy' ? 'Sending…' : 'Send anonymously'}</button>
      {st === 'err' && <p className="warn">Could not send right now. Your result is safe on this device. Try again later.</p>}
    </section>
  );
}
