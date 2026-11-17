import type { Question, Skill } from './data';
import { FILLERS, TIPS } from './data';

/** All thresholds live here. Change them in one place. */
export const CONFIG = { readyOverall: 0.8, readyFloor: 0.6, almostOverall: 0.6 };
export type Verdict = 'ready' | 'almost' | 'not-yet';
export interface SkillScore { skill: Skill; correct: number; total: number; pct: number }
export interface Tip { title: string; action: string }
export interface Result { skills: SkillScore[]; correct: number; total: number; pct: number; low: number; high: number; verdict: Verdict; tips: Tip[] }

/** Wilson 95% interval: how far a short check can be trusted. */
export function wilson(k: number, n: number): [number, number] {
  if (n === 0) return [0, 1];
  const z = 1.96, p = k / n, d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const m = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - m), Math.min(1, c + m)];
}

/** Plain-language band for a skill. 5 items per skill is a signal, not a measurement. */
export function band(pct: number): 'Strong' | 'Okay' | 'Needs work' {
  return pct >= CONFIG.readyOverall ? 'Strong' : pct >= CONFIG.readyFloor ? 'Okay' : 'Needs work';
}

/** Items are weighted by difficulty (1 to 3): a hard item answered right says more than an easy one. */
const weight = (qs: Question[]) => qs.reduce((s, q) => s + q.difficulty, 0);

export function score(qs: Question[], answers: Record<string, number>): Result {
  const right = (q: Question) => answers[q.id] === q.answer;
  const order: Skill[] = ['vocabulary', 'grammar', 'reading'];
  const skills = order.map((skill) => {
    const mine = qs.filter((q) => q.skill === skill), got = mine.filter(right), w = weight(mine);
    return { skill, correct: got.length, total: mine.length, pct: w ? weight(got) / w : 0 };
  });
  const total = qs.length, correct = skills.reduce((s, x) => s + x.correct, 0);
  const pct = total ? weight(qs.filter(right)) / weight(qs) : 0;
  const floorOk = skills.every((s) => s.pct >= CONFIG.readyFloor);
  const verdict: Verdict = pct >= CONFIG.readyOverall && floorOk ? 'ready' : pct >= CONFIG.almostOverall ? 'almost' : 'not-yet';
  const [low, high] = wilson(pct * total, total);

  const skillPct = new Map(skills.map((s) => [s.skill, s.pct]));
  const missed = new Map<string, { n: number; pct: number }>();
  for (const q of qs) if (!right(q)) {
    const cur = missed.get(q.topic);
    missed.set(q.topic, { n: (cur?.n ?? 0) + 1, pct: skillPct.get(q.skill) ?? 0 });
  }
  const tips: Tip[] = [...missed.entries()]
    .sort((a, b) => b[1].n - a[1].n || a[1].pct - b[1].pct)
    .slice(0, 3).map(([t]) => TIPS[t]).filter(Boolean);
  for (const f of FILLERS) if (tips.length < 3 && (tips.length < 2 || verdict !== 'not-yet')) tips.push(f);
  return { skills, correct, total, pct, low, high, verdict, tips };
}
