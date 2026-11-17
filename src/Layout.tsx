import type { ReactNode } from 'react';

export function Shell({ nav, children }: { nav?: boolean; children: ReactNode }) {
  return (
    <div id="top">
      <header className="site">
        <div className="bar-in">
          <a className="brand" href="#top" aria-label="Am I exam-ready, top of page"><span className="dot" />Am I exam-ready?</a>
          {nav && (
            <nav aria-label="Page sections">
              <a href="#how">How it works</a><a href="#why">Why it helps</a><a href="#faq">FAQ</a><a className="cta" href="#start">Start the check</a>
            </nav>
          )}
        </div>
      </header>
      {children}
      <footer className="site">
        <div className="bar-in foot">
          <p><strong>Am I exam-ready?</strong> A free German A1 readiness check for learners planning a career abroad.</p>
          <p className="mono">Practice check only. Not the official exam. Not affiliated with Goethe-Institut or ÖSD. Built as a take-home for Globio.</p>
        </div>
      </footer>
    </div>
  );
}

const STEPS = [
  ['Rate yourself', 'Pick 1 to 5 for how ready you feel. We compare it with your result at the end.'],
  ['Answer 15 questions', '5 on vocabulary, 5 on grammar, 5 on reading short German messages and notices. About 10 minutes.'],
  ['Get your plan', 'See your readiness by skill, how far to trust the score, and the 2 to 3 things to practise before you book.'],
];
const FAQ = [
  ['Is this the real exam?', 'No. It is a short practice check that mirrors the kind of skills the A1 exam needs.'],
  ['Does it test listening, writing and speaking?', 'No. The real exam does, so a good result here is a good sign, not a guarantee. Practise those parts too.'],
  ['How do you decide I am ready?', 'Ready means 80% or more overall and no skill under 60%. The real pass mark is 60%, so we keep a safety margin.'],
  ['How accurate is a 15-question check?', 'It is an estimate, so we show a range. We also compare results with real exam outcomes to keep improving it.'],
  ['What happens to my answers?', 'Your answers stay on your device unless you choose to share feedback, which has no name or email. We also count anonymous steps, like "finished the check", with a random ID. Turn on Do Not Track and we skip that too.'],
];

export function Info() {
  return (
    <div className="info">
      <section id="how"><h2>How it works</h2>
        <ol className="steps">{STEPS.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}</ol>
      </section>
      <section id="why"><h2>Why it helps</h2>
        <p>Many learners finish A1 and book the exam without knowing if they are ready. Some fail and lose the exam fee and months of their plan. This check tells you where you stand before you pay.</p>
        <ul><li>Know if you are ready to book, or should wait.</li><li>Find your weakest skill instead of studying everything.</li><li>Get specific practice steps, not generic advice.</li></ul>
      </section>
      <section id="faq"><h2>Questions</h2>
        {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </section>
    </div>
  );
}
