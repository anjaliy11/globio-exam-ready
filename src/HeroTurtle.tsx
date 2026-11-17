import { useState } from 'react';

const QUIPS = [
  'Shell we check if you are ready?',
  'Slow and steady passes A1.',
  'Der, die, das... I am still learning too.',
  'Book the exam, not a surprise.',
];

/** Friendly mascot for the start page. Tap the speech bubble for another quip. */
export default function HeroTurtle() {
  const [i, setI] = useState(0);
  return (
    <aside className="hero-art" aria-label="Friendly turtle mascot">
      <button type="button" className="quip" onClick={() => setI((n) => (n + 1) % QUIPS.length)} aria-label="Show another turtle quote">
        <span role="status" aria-live="polite">{QUIPS[i]}</span>
        <small>tap for another</small>
      </button>

      <svg className="art-svg" viewBox="0 0 420 300" aria-hidden="true">
        <path d="M70 150C40 90 110 40 190 60C260 20 360 60 380 130C410 190 350 260 280 250C250 285 170 280 150 245C90 250 40 200 70 150Z" fill="#9fdcbc" />
        <g stroke="#0d0d12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M175 185C168 215 172 240 178 254L208 254C212 236 208 212 204 190Z" fill="#8fd3b0" />
          <path d="M278 192C276 216 278 240 283 254L311 254C315 236 311 214 308 194Z" fill="#8fd3b0" />
          <path d="M118 172C98 190 98 232 110 254L152 254C160 232 152 200 152 176Z" fill="#bfeed6" />
          <path d="M318 190C312 215 313 240 320 254L360 254C366 232 360 206 352 186Z" fill="#bfeed6" />
          <path d="M114 254q5 -7 10 0M128 254q5 -7 10 0M324 254q5 -7 10 0M338 254q5 -7 10 0" />
          <path d="M128 172C124 96 205 56 288 68C352 80 380 138 366 184C300 200 190 198 128 172Z" fill="#a9e5c8" />
          <path d="M196 66C204 110 204 152 198 192M252 60C264 104 264 150 258 196M312 70C326 112 326 152 320 196M134 128C200 112 300 112 372 138M140 160C210 150 300 150 366 168" />
          <path d="M112 118C122 138 128 152 134 166M84 122C92 142 108 156 124 170" />
          <g className="nod">
            <ellipse cx="98" cy="92" rx="40" ry="36" fill="#bfeed6" />
            <circle cx="82" cy="86" r="8" fill="#fff" strokeWidth="2" /><circle cx="82" cy="87" r="3" fill="#0d0d12" />
            <circle cx="112" cy="84" r="9" fill="#fff" strokeWidth="2" /><circle cx="112" cy="85" r="3.2" fill="#0d0d12" />
            <path d="M80 106Q98 122 118 104" />
            <circle cx="95" cy="98" r="1.8" fill="#0d0d12" /><circle cx="103" cy="98" r="1.8" fill="#0d0d12" />
          </g>
        </g>
      </svg>

      <p className="art-tag">Slow and steady wins. Just check before you book.</p>
    </aside>
  );
}