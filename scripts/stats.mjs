// Builds the animated "Recent activity" card from the GitHub contribution calendar.
// CI:    GITHUB_TOKEN=... node scripts/stats.mjs --user apollo0515 --out dist/stats.svg
// Local: node scripts/stats.mjs --mock --out assets/stats-preview.svg

import { THEMES, ACCENT, esc, rng, r2, svg, write } from './lib.mjs';

const D = THEMES.dark;
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]?.startsWith('--') || all[i + 1] === undefined ? true : all[i + 1]]);
  return acc;
}, []));
const USER = args.user || process.env.GITHUB_REPOSITORY_OWNER || 'apollo0515';
const OUT = args.out || 'dist/stats.svg';

async function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is not set (or pass --mock).');
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-stats' },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub API: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  return { total: cal.totalContributions, days: cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, n: d.contributionCount })) };
}

function mockCalendar() {
  const rand = rng(42), days = [];
  const end = new Date(); end.setUTCHours(0, 0, 0, 0);
  for (let i = 370; i >= 0; i--) {
    const d = new Date(end); d.setUTCDate(d.getUTCDate() - i);
    const active = i < 160 ? rand() < 0.55 : rand() < 0.12;
    days.push({ date: d.toISOString().slice(0, 10), n: active ? Math.ceil(rand() * rand() * 14) : 0 });
  }
  return { total: days.reduce((s, d) => s + d.n, 0), days };
}

function analyse({ total, days }) {
  const today = new Date().toISOString().slice(0, 10);
  const past = days.filter((d) => d.date <= today);
  let longest = 0, run = 0;
  for (const d of past) { run = d.n ? run + 1 : 0; longest = Math.max(longest, run); }
  // Current streak counts back from today; an empty today doesn't break it yet.
  let current = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    if (past[i].n) current++;
    else if (i === past.length - 1) continue;
    else break;
  }
  const best = past.reduce((b, d) => (d.n > b.n ? d : b), { n: 0, date: '' });
  const activeDays = past.filter((d) => d.n).length;
  const weeks = [];
  for (let i = 0; i < past.length; i += 7) {
    const w = past.slice(i, i + 7);
    weeks.push({ start: w[0].date, n: w.reduce((s, d) => s + d.n, 0) });
  }
  return { total, current, longest, best, activeDays, weeks: weeks.slice(-53) };
}

const fmtDate = (iso) => iso
  ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).toUpperCase()
  : '—';

function render(s) {
  const W = 1200, H = 400;
  const kpis = [
    { v: s.total, label: 'CONTRIBUTIONS', sub: 'in the last 12 months', color: ACCENT.ember },
    { v: s.current, label: 'CURRENT STREAK', sub: s.current === 1 ? 'day in a row' : 'days in a row', color: ACCENT.gold },
    { v: s.longest, label: 'LONGEST STREAK', sub: 'days, personal best', color: ACCENT.ice },
    { v: s.activeDays, label: 'ACTIVE DAYS', sub: `best day ${s.best.n} on ${fmtDate(s.best.date)}`, color: ACCENT.mint },
  ];
  const kpiSvg = kpis.map((k, i) => {
    const x = 56 + (i % 2) * 230, y = 150 + Math.floor(i / 2) * 140;
    return `<g class="kpi" style="animation-delay:${r2(0.2 + i * 0.12)}s">
<text class="mono" x="${x}" y="${y - 58}" font-size="11" letter-spacing="2.5" fill="${k.color}">${k.label}</text>
<text class="display" x="${x - 3}" y="${y}" font-size="64" fill="${D.text}">${k.v.toLocaleString('en-US')}</text>
<text class="sans" x="${x}" y="${y + 26}" font-size="14" fill="${D.muted}">${esc(k.sub)}</text></g>`;
  }).join('');

  // Weekly bar chart.
  const CX = 560, CW = 590, BASE = 318, CH = 210;
  const max = Math.max(1, ...s.weeks.map((w) => w.n));
  const step = CW / s.weeks.length, bw = Math.max(3, step - 4);
  const bars = s.weeks.map((w, i) => {
    const x = CX + i * step;
    const h = w.n ? Math.max(6, (w.n / max) * CH) : 3;
    const fill = w.n ? 'url(#bar)' : D.line;
    return `<rect class="b" style="animation-delay:${r2(0.4 + i * 0.022)}s" x="${r2(x)}" y="${r2(BASE - h)}" width="${r2(bw)}" height="${r2(h)}" rx="${r2(Math.min(bw / 2, 3))}" fill="${fill}"/>`;
  }).join('');
  let lastMonth = '';
  const months = s.weeks.map((w, i) => {
    const m = new Date(`${w.start}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    if (m === lastMonth || i > s.weeks.length - 3) return '';
    lastMonth = m;
    return `<text x="${r2(CX + i * step)}" y="${BASE + 26}">${m}</text>`;
  }).join('');
  const avg = s.weeks.reduce((a, w) => a + w.n, 0) / s.weeks.length;
  const avgY = r2(BASE - (avg / max) * CH);
  const peakIdx = s.weeks.reduce((b, w, i) => (w.n > s.weeks[b].n ? i : b), 0);
  const peakX = r2(CX + peakIdx * step + bw / 2), peakY = r2(BASE - (s.weeks[peakIdx].n / max) * CH);

  const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}}
@keyframes fadeIn{from{opacity:0}}
@keyframes grow{from{transform:scaleY(0)}}
.kpi{animation:fadeUp .9s cubic-bezier(.2,.75,.15,1) both}
.b{transform-box:fill-box;transform-origin:50% 100%;animation:grow 1.1s cubic-bezier(.2,.75,.15,1) both}
.late{animation:fadeIn 1s ease 1.8s both}
.scan{animation:scan 7s ease-in-out 2.5s infinite}
@keyframes scan{0%{transform:translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateX(${CW}px);opacity:0}}`;
  const defs = `<clipPath id="cc"><rect width="${W}" height="${H}" rx="24"/></clipPath>
<linearGradient id="bar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ACCENT.ember}" stop-opacity=".55"/><stop offset="1" stop-color="${ACCENT.gold}"/></linearGradient>
<linearGradient id="sc" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="h1"><stop offset="0" stop-color="${ACCENT.ember}" stop-opacity=".18"/><stop offset="1" stop-color="${ACCENT.ember}" stop-opacity="0"/></radialGradient>`;
  const body = `<g clip-path="url(#cc)">
<rect width="${W}" height="${H}" fill="${D.panel}"/>
<circle cx="${CX + CW * 0.7}" cy="${BASE}" r="380" fill="url(#h1)"/>
<path d="M520 48V${H - 48}" stroke="${D.line}"/>
${kpiSvg}
<g stroke="${D.line}" stroke-dasharray="2 6">${[0.25, 0.5, 0.75, 1].map((f) => `<path d="M${CX} ${r2(BASE - f * CH)}H${CX + CW}"/>`).join('')}</g>
<text class="mono" x="${CX}" y="62" font-size="11" letter-spacing="2.5" fill="${D.muted}">WEEKLY CONTRIBUTIONS<tspan dx="18" fill="${ACCENT.ice}">- - AVG ${avg.toFixed(1)}/WK</tspan></text>
<text class="mono" x="${CX + CW}" y="62" font-size="11" letter-spacing="2" fill="${D.dim}" text-anchor="end">UPDATED ${fmtDate(new Date().toISOString().slice(0, 10))}</text>
${bars}
<rect class="scan" x="${CX - 60}" y="${BASE - CH - 10}" width="60" height="${CH + 10}" fill="url(#sc)"/>
<path d="M${CX} ${BASE}H${CX + CW}" stroke="${D.dim}"/>
<g class="late">
  <path d="M${CX} ${avgY}H${CX + CW}" stroke="${ACCENT.ice}" stroke-opacity=".7" stroke-dasharray="4 5"/>
  <circle cx="${peakX}" cy="${peakY - 12}" r="3.5" fill="${ACCENT.gold}"/>
  <circle cx="${peakX}" cy="${peakY - 12}" r="3.5" stroke="${ACCENT.gold}"><animate attributeName="r" values="3.5;12" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></circle>
</g>
<g class="mono" font-size="10.5" letter-spacing="1.5" fill="${D.dim}">${months}</g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" stroke="${D.line}"/>`;
  return svg({
    w: W, h: H, title: `${USER}: ${s.total} contributions in the last year`,
    desc: `Current streak ${s.current} days, longest ${s.longest} days, ${s.activeDays} active days.`,
    fonts: ['display', 'sans', 'mono'], css, defs, body,
  });
}

const cal = args.mock ? mockCalendar() : await fetchCalendar();
write(OUT, render(analyse(cal)));
