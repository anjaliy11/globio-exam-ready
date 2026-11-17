/** Red line path. tangle 1 = knotted, 0 = nearly straight. Ends stay anchored. */
export function scribble(tangle: number, w = 600, h = 300, n = 200): string {
  const k = Number.isFinite(tangle) ? Math.min(1, Math.max(0, tangle)) : 1;
  const R = h * 0.4 * k, c = 2 + 3 * k;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n, e = Math.sin(Math.PI * u), a = 2 * Math.PI * c * u;
    const x = 30 + (w - 60) * u + R * 0.9 * Math.cos(a) * e;
    const y = h / 2 + (R * Math.sin(a + 1) + R * 0.5 * Math.sin(1.7 * a)) * e;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
}
