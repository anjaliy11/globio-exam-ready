import { useEffect, useState } from 'react';
import { QUESTIONS, SKILL_LABEL } from './data';
import { band, score, type Verdict } from './scoring';
import Growth from './Growth';
import { track } from './track';
import { scribble } from './scribble';
import Feedback from './Feedback';
import { Info, Shell } from './Layout';
import Pills from './Pills';

const KEY = 'globio.examready.v1';
interface Saved { id: string; conf: number | null; answers: Record<string, number>; done: boolean }
const uid = () => { try { return crypto.randomUUID(); } catch { return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); } };
const fresh = (): Saved => ({ id: uid(), conf: null, answers: {}, done: false });

function load(): Saved {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!r || typeof r !== 'object') return fresh();
    const answers: Record<string, number> = {};
    for (const q of QUESTIONS) { const v = r.answers?.[q.id]; if (Number.isInteger(v) && v >= 0 && v < q.options.length) answers[q.id] = v; }
    const conf = Number.isInteger(r.conf) && r.conf >= 1 && r.conf <= 5 ? r.conf : null;
    const id = typeof r.id === 'string' && /^[a-zA-Z0-9-]{8,64}$/.test(r.id) ? r.id : uid();
    return { id, conf, answers, done: !!r.done && conf !== null && Object.keys(answers).length === QUESTIONS.length };
  } catch { return fresh(); }
}
const persist = (s: Saved) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage blocked: app still works */ } };

const HEAD: Record<Verdict, [string, string]> = {
  ready: ['Looks ready.', 'On this check you are in good shape to book. Finish the steps below first.'],
  almost: ['Almost ready.', 'You are close. Fix the weak spots below, then retake the check.'],
  'not-yet': ['Not ready yet.', 'Booking now risks your exam fee. Practise the steps below first.'],
};

export default function App() {
  const [s, setS] = useState<Saved>(load);
  const [idx, setIdx] = useState(() => Math.max(0, QUESTIONS.findIndex((q) => s.answers[q.id] === undefined)));
  const update = (n: Saved) => { setS(n); persist(n); };
  useEffect(() => {
    track(s.id, 'view');
    if (s.conf === null) return;
    track(s.id, 'start');
    track(s.id, s.done ? 'complete' : 'q' + (idx + 1));
  }, [s.id, s.conf, s.done, idx]);

  if (s.conf === null) return (
    <Shell nav><main className="hero" id="start">
      <p className="mono">German A1 · 15 questions · 10 minutes · free</p>
      <h1>Know you are ready before you book.</h1>
      <p className="lead">Failing the A1 exam costs the fee and months of your plan. Take a 10-minute check. Get a readiness score by skill and exactly what to practise.</p>
      <svg className="arrow" viewBox="0 0 160 80" aria-hidden="true"><path pathLength="1" d="M5 12C70 -8 40 62 95 50S135 30 152 56M152 56l-15-4M152 56l-7-13" /></svg>
      <div className="card">
        <p><strong>First, how ready do you feel?</strong></p>
        <div className="row" role="group" aria-label="Confidence from 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => <button key={n} className="chip" onClick={() => update({ ...s, conf: n })}>{n}</button>)}
        </div>
        <p className="mono">1 = not at all · 5 = completely. Tap a number to start. Answers stay on your device.</p>
      </div>
      <Pills />
      <p className="mono">Tap a word to flip it. These are the kinds of words the check uses.</p>
    </main><Info /></Shell>
  );

  if (!s.done) {
    const q = QUESTIONS[idx], sel = s.answers[q.id], last = idx === QUESTIONS.length - 1;
    return (
      <Shell><main>
        <p className="mono">{SKILL_LABEL[q.skill]} · Question {idx + 1} of {QUESTIONS.length}</p>
        <div className="dots" aria-hidden="true">{QUESTIONS.map((x, n) => <i key={x.id} className={(s.answers[x.id] !== undefined ? 'd ' : '') + (n === idx ? 'cur' : '')} />)}</div>
        {q.passage && <blockquote lang="de">{q.passage}</blockquote>}
        <h2 id="q">{q.prompt}</h2>
        <div role="radiogroup" aria-labelledby="q" className="opts">
          {q.options.map((o, i) => (
            <button key={o} role="radio" aria-checked={sel === i} className={'opt' + (sel === i ? ' on' : '')}
              onClick={() => update({ ...s, answers: { ...s.answers, [q.id]: i } })}>{o}</button>
          ))}
        </div>
        <div className="row">
          <button className="ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Back</button>
          <button className="go" disabled={sel === undefined} onClick={() => (last ? update({ ...s, done: true }) : setIdx(idx + 1))}>{last ? 'See my result' : 'Next'}</button>
        </div>
      </main></Shell>
    );
  }

  const r = score(QUESTIONS, s.answers), [h, sub] = HEAD[r.verdict];
  const gap = s.conf >= 4 && r.verdict !== 'ready' ? 'You felt confident, but this check shows gaps. Trust the gaps.'
    : s.conf <= 2 && r.verdict === 'ready' ? 'You are readier than you feel.' : '';
  const wrong = QUESTIONS.filter((q) => s.answers[q.id] !== q.answer);
  return (
    <Shell><main>
      <svg className="line small" viewBox="0 0 600 300" aria-hidden="true"><path key={r.correct} pathLength="1" d={scribble(1 - r.pct)} /></svg>
      <h1 className={'v-' + r.verdict}>{h}</h1>
      <p>{sub}</p>
      <p className="big">{Math.round(r.pct * 100)}%</p>
      <p><strong>{r.correct} of {r.total} correct.</strong> With {r.total} questions, your true level is likely between {Math.round(r.low * 100)}% and {Math.round(r.high * 100)}%.</p>
      {gap && <p>{gap}</p>}
      <h2>By skill</h2>
      <p className="mono">Each skill has 5 questions and harder ones count more. Treat a skill as a signal, not an exact score.</p>
      {r.skills.map((k) => (
        <div key={k.skill} className="skill">
          <span>{SKILL_LABEL[k.skill]}</span>
          <div className="bar" role="img" aria-label={`${k.correct} of ${k.total} correct`}><i className={k.pct < 0.6 ? 'low' : ''} style={{ width: `${k.pct * 100}%` }} /></div>
          <span>{k.correct}/{k.total} {band(k.pct)}</span>
        </div>
      ))}
      <h2>Practise before you book</h2>
      <ol>{r.tips.map((t) => <li key={t.title}><strong>{t.title}.</strong> {t.action}</li>)}</ol>
      <Growth id={s.id} pct={Math.round(r.pct * 100)} label={h.replace('.', '')} verdict={r.verdict} />
      {wrong.length > 0 && <details><summary>Review {wrong.length} missed question{wrong.length > 1 ? 's' : ''}</summary>
        {wrong.map((q) => <p key={q.id}><strong>{q.prompt}</strong><br />Answer: {q.options[q.answer]}. {q.why}</p>)}</details>}
      <p className="mono">How we decide: Ready = 80% or more and no skill under 60%. The real pass mark is 60%, so we add a safety margin. This is an estimate, not a prediction. Listening, writing and speaking are not tested here.</p>
      <Feedback id={s.id} conf={s.conf} answers={s.answers} />
      <button className="go" onClick={() => { update(fresh()); setIdx(0); }}>Retake the check</button>
    </main></Shell>
  );
}
