import { useEffect, useRef } from 'react';

/** Turtle that lazily follows the pointer. Static on touch screens or reduced motion. */
export default function Turtle() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) { node.classList.add('rest'); return; }
    let tx = innerWidth - 120, ty = innerHeight - 120, x = tx, y = ty, flip = 1, raf = 0;
    const move = (e: PointerEvent) => { tx = Math.min(Math.max(e.clientX + 24, 8), innerWidth - 72); ty = Math.min(Math.max(e.clientY + 20, 8), innerHeight - 56); };
    const tick = () => {
      const dx = tx - x; x += dx * 0.06; y += (ty - y) * 0.06;
      if (Math.abs(dx) > 1.5) flip = dx < 0 ? -1 : 1;
      node.style.transform = `translate(${x}px,${y}px) scaleX(${flip})`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener('pointermove', move); raf = requestAnimationFrame(tick);
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={el} className="turtle" aria-hidden="true">
      <svg viewBox="0 0 64 48" width="56" height="42">
        <ellipse className="leg" cx="20" cy="40" rx="6" ry="4" fill="#6fbf73" />
        <ellipse className="leg l2" cx="44" cy="40" rx="6" ry="4" fill="#6fbf73" />
        <path d="M8 28 L1 31 L9 32Z" fill="#6fbf73" />
        <ellipse cx="32" cy="26" rx="22" ry="16" fill="#2f8f5b" />
        <path d="M18 26h28M26 12l-4 14 6 14M38 12l4 14-6 14" stroke="#1d6b42" strokeWidth="2" fill="none" />
        <circle cx="57" cy="25" r="7" fill="#6fbf73" /><circle cx="59" cy="23" r="1.6" fill="#0b0b0b" />
      </svg>
    </div>
  );
}
