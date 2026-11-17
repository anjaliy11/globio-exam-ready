import { useState, type CSSProperties } from 'react';

const PILLS = [
  ['Guten Morgen', 'good morning', 'coral'], ['der Bahnhof', 'train station', 'blue'], ['halb drei', '2:30', 'yellow'],
  ['kein', 'no / not a', 'green'], ['siebenundvierzig', '47', 'pink'], ['geschlossen', 'closed', 'navy'],
  ['Käse', 'cheese', 'yellow'], ['Heute gehe ich', 'Today I go', 'blue'],
] as const;

/** Tap a word to flip it to English. Pure fun, and a taste of what the check covers. */
export default function Pills() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const toggle = (i: number) => setFlipped((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  return (
    <div className="pills">
      {PILLS.map(([de, en, c], i) => (
        <button key={de} className={`wp ${c}`} style={{ '--r': `${((i % 5) - 2) * 3}deg` } as CSSProperties}
          aria-pressed={flipped.includes(i)} aria-label={`${de}, means ${en}`} onClick={() => toggle(i)}>
          {flipped.includes(i) ? en : de}
        </button>
      ))}
    </div>
  );
}
