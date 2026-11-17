import { describe, expect, it } from 'vitest';
import { QUESTIONS, TIPS } from './data';
import { score } from './scoring';

const all = (f: (i: number) => boolean) => Object.fromEntries(QUESTIONS.map((q, i) => [q.id, f(i) ? q.answer : (q.answer + 1) % q.options.length]));

describe('question bank', () => {
  it('has 15 questions, 5 per skill, unique ids', () => {
    expect(QUESTIONS).toHaveLength(15);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(15);
    for (const s of ['vocabulary', 'grammar', 'reading']) expect(QUESTIONS.filter((q) => q.skill === s)).toHaveLength(5);
  });
  it('has valid answers and a tip for every topic', () => {
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(TIPS[q.topic]).toBeDefined();
    }
  });
});

describe('score', () => {
  it('all correct is ready with 2 filler tips', () => {
    const r = score(QUESTIONS, all(() => true));
    expect(r.verdict).toBe('ready'); expect(r.pct).toBe(1); expect(r.tips).toHaveLength(2);
  });
  it('all wrong is not-yet with exactly 3 tips', () => {
    const r = score(QUESTIONS, all(() => false));
    expect(r.verdict).toBe('not-yet'); expect(r.tips).toHaveLength(3);
  });
  it('no answers does not crash', () => {
    expect(score(QUESTIONS, {}).verdict).toBe('not-yet');
  });
  it('weak skill caps an 80%+ overall at almost', () => {
    const r = score(QUESTIONS, all((i) => i < 13));
    expect(r.pct).toBeGreaterThanOrEqual(0.8);
    expect(r.skills[2].pct).toBeLessThan(0.6);
    expect(r.verdict).toBe('almost');
  });
  it('missing only easy items stays ready', () => {
    const r = score(QUESTIONS, all((i) => ![0, 5, 10].includes(i)));
    expect(r.verdict).toBe('ready');
  });
  it('a wrong hard item costs more than a wrong easy item (finer skill scores)', () => {
    const easy = score(QUESTIONS, all((i) => i !== 0)).skills[0].pct;
    const hard = score(QUESTIONS, all((i) => i !== 4)).skills[0].pct;
    expect(hard).toBeLessThan(easy);
  });
});
