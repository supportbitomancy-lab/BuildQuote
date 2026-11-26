// Adds the listing found in an approved GitHub issue to listings.json (strictly validated).
const fs = require('fs');
const body = process.env.BODY || '';
const m = body.match(/```json\s*([\s\S]*?)```/);
if (!m) throw new Error('No JSON block found in the issue');
const r = JSON.parse(m[1]);
const str = (v, n) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n);
const o = {
  id: Date.now(), k: r.k === 'r' ? 'r' : 'm', t: str(r.t, 120), c: str(r.c, 60),
  p: Number(r.p), u: str(r.u, 20), city: str(r.city, 60), s: str(r.s, 80),
  ph: String(r.ph || '').replace(/\D/g, ''), n: str(r.n, 400),
  ar: Math.max(0, Number(r.ar) || 0), bh: Math.max(0, parseInt(r.bh) || 0),
  dl: ['Sale', 'Rent'].includes(r.dl) ? r.dl : '', x: 0
};
if (o.t.length < 3 || !(o.p > 0) || !o.city || !o.s || o.ph.length !== 10) throw new Error('Listing failed validation');
const f = 'listings.json';
const a = JSON.parse(fs.readFileSync(f, 'utf8'));
a.unshift(o);
fs.writeFileSync(f, JSON.stringify(a, null, 1));
console.log('Added', o.t);
