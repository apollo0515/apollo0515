// Generates every static profile graphic into ../assets.
// Run: node scripts/build.mjs   (edit the data blocks below, then rebuild)

import {
  THEMES, ACCENT, FAMILY, monoWidth, esc, rng, r2, svg, write, chipRow, ellipsePath,
} from './lib.mjs';

const D = THEMES.dark;
const EASE = 'cubic-bezier(.2,.75,.15,1)';
const MOTION_CSS = `
@keyframes rise{from{transform:translateY(120px)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}}
@keyframes fadeIn{from{opacity:0}}
@keyframes draw{from{stroke-dashoffset:1}}
`;

// ───────────────────────── content ─────────────────────────

const PROFILE = {
  name: 'Apollo',
  status: 'AVAILABLE FOR FREELANCE PROJECTS',
  focus: 'Next.js platforms · real-time 3D · headless WordPress · commerce',
  metaLeft: 'PORTFOLIO — VOL. 2026',
  metaRight: 'GITHUB.COM/APOLLO0515',
};

const TYPING = [
  'Shipping production-grade Next.js & React platforms.',
  'Building real-time 3D worlds with Three.js & WebGL.',
  'Crafting headless WordPress for premium brands.',
  'From blank canvas to deployed product, end to end.',
];

const PROJECTS = [
  {
    slug: 'orbis', name: 'Orbis', accent: ACCENT.ice, motif: 'globe',
    kicker: 'TRAVEL · 3D · MARKETPLACE', tagline: 'The living atlas',
    desc: ['A real-time WebGL globe with true', 'sunlight and live flights, plus a', 'guided-tour marketplace.'],
    tags: ['React', 'Three.js', 'Supabase', 'TypeScript'],
  },
  {
    slug: 'vitalia', name: 'Vitalia', accent: ACCENT.mint, motif: 'pulse',
    kicker: 'HEALTHCARE · SAAS', tagline: 'Health, beautifully orchestrated',
    desc: ['Appointments, telehealth, records,', 'vitals and AI-guided care in one', 'calm, modern platform.'],
    tags: ['Next.js 16', 'Drizzle', 'Postgres', 'Motion'],
  },
  {
    slug: 'atrium', name: 'Atrium', accent: ACCENT.gold, motif: 'house',
    kicker: 'ARCHITECTURE · 3D', tagline: 'Architecture, explored',
    desc: ['Homes generated live from parametric', 'blueprints. Orbit, cut away floors', 'or walk through at any hour.'],
    tags: ['React 19', 'R3F', 'Express', 'Tailwind'],
  },
  {
    slug: 'aurelia', name: 'Aurelia', accent: ACCENT.champagne, motif: 'deco',
    kicker: 'HOSPITALITY · PLATFORM', tagline: 'Five-star operations',
    desc: ['Booking engine, front desk, folios', 'and housekeeping for a luxury hotel', 'on headless WordPress.'],
    tags: ['Next.js', 'WordPress', 'REST API', 'Playwright'],
  },
  {
    slug: 'aeralis', name: 'Aeralis', accent: ACCENT.sky, motif: 'flight',
    kicker: 'AIRLINE · WORDPRESS', tagline: 'An airline, built on WordPress',
    desc: ['Fare search, connecting itineraries,', 'seat maps and scannable boarding', 'passes on a real route network.'],
    tags: ['WordPress', 'Block theme', 'PHP 8', 'PHPUnit'],
  },
  {
    slug: 'strikezone', name: 'Strikezone', accent: ACCENT.red, motif: 'scope',
    kicker: 'GAME · WEBGL', tagline: 'Wave survival in the browser',
    desc: ['A first-person shooter with scanned', 'PBR materials and IK-posed enemies.', 'Zero install, one click to play.'],
    tags: ['Three.js', 'WebGL', 'PBR', 'JavaScript'],
  },
];

const TOOLKIT = [
  { title: 'FRONTEND', accent: ACCENT.ice, items: ['TypeScript', 'React 19', 'Next.js 16', 'Tailwind CSS 4', 'Radix UI', 'Motion'] },
  { title: '3D & MOTION', accent: ACCENT.ember, items: ['Three.js', 'React Three Fiber', 'WebGL', 'PBR materials', 'SVG & Canvas', 'Recharts'] },
  { title: 'BACKEND & DATA', accent: ACCENT.mint, items: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'Supabase', 'REST APIs'] },
  { title: 'CMS & COMMERCE', accent: ACCENT.gold, items: ['WordPress', 'Block themes', 'PHP 8', 'Keystatic', 'Shopify', 'Elementor'] },
];
const TOOLKIT_FOOT = [['QUALITY', 'Playwright · Pest · PHPUnit · ESLint'], ['SHIP', 'Netlify · Docker · GitHub Actions']];

const SECTIONS = [
  { file: 'work', index: '01', title: 'Selected', italic: 'work', caption: 'SIX BUILDS · 2026' },
  { file: 'toolkit', index: '02', title: 'The', italic: 'toolkit', caption: 'WHAT I BUILD WITH' },
  { file: 'activity', index: '03', title: 'Recent', italic: 'activity', caption: 'UPDATED DAILY' },
  { file: 'contact', index: '04', title: 'Let’s', italic: 'talk', caption: 'OPEN FOR PROJECTS' },
];

// ───────────────────────── hero ─────────────────────────

function hero() {
  const W = 1200, H = 460, SX = 905, SY = 228;
  const rand = rng(515);

  const rays = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2;
    const r1 = 82, r2_ = r1 + 14 + rand() * (i % 3 === 0 ? 70 : 34);
    return `<line x1="${r2(SX + Math.cos(a) * r1)}" y1="${r2(SY + Math.sin(a) * r1)}" x2="${r2(SX + Math.cos(a) * r2_)}" y2="${r2(SY + Math.sin(a) * r2_)}"/>`;
  }).join('');

  const TILT = -14;
  const orbits = [
    { rx: 128, ry: 36, dur: 7, r: 5, color: ACCENT.ice, dash: '' },
    { rx: 188, ry: 54, dur: 13, r: 7, color: ACCENT.gold, dash: '3 7' },
    { rx: 252, ry: 74, dur: 21, r: 4.5, color: ACCENT.violet, dash: '1 9' },
  ];
  // Orbit is split in two halves so planets can pass behind the sun.
  const half = (o, front) => {
    const t = (TILT * Math.PI) / 180, pts = [];
    for (let i = 0; i <= 48; i++) {
      const u = (front ? 0 : Math.PI) + (i / 48) * Math.PI;
      const x = o.rx * Math.cos(u), y = o.ry * Math.sin(u);
      pts.push(`${r2(SX + x * Math.cos(t) - y * Math.sin(t))},${r2(SY + x * Math.sin(t) + y * Math.cos(t))}`);
    }
    return `<polyline points="${pts.join(' ')}" stroke="${o.color}" stroke-opacity="${front ? 0.55 : 0.28}" stroke-width="1.2" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>`;
  };
  const planet = (o, front) => {
    const path = ellipsePath(SX, SY, o.rx, o.ry, TILT);
    const vis = front
      ? `<animate attributeName="opacity" values="1;0" keyTimes="0;.5" calcMode="discrete" dur="${o.dur}s" repeatCount="indefinite"/>`
      : '';
    return `<g opacity="1"><circle r="${o.r * 2.6}" fill="${o.color}" opacity=".18"/><circle r="${o.r}" fill="${o.color}"/>` +
      `<animateMotion path="${path}" dur="${o.dur}s" repeatCount="indefinite"/>${vis}</g>`;
  };

  const embers = Array.from({ length: 54 }, (_, i) => {
    const near = i % 3 !== 0;
    const x = near ? SX - 260 + rand() * 520 : rand() * W;
    const y = H + 10 - rand() * 60;
    const rise = 160 + rand() * 300, drift = (rand() - 0.5) * 80;
    const dur = 5 + rand() * 8, r = 0.8 + rand() * 1.9;
    const color = [ACCENT.gold, ACCENT.ember, '#ffd9a0', ACCENT.ice][Math.floor(rand() * (near ? 3 : 4))];
    return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${color}" opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${r2(drift / 2)} ${r2(-rise / 2)};${r2(drift)} ${r2(-rise)}" dur="${r2(dur)}s" begin="-${r2(rand() * dur)}s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;.95;.6;0" keyTimes="0;.2;.7;1" dur="${r2(dur)}s" begin="-${r2(rand() * dur)}s" repeatCount="indefinite"/></circle>`;
  }).join('');

  const crop = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 18}V${y}H${x + dx * 18}"/>`;

  const css = `${MOTION_CSS}
.b1{animation:d1 19s ease-in-out infinite alternate}
.b2{animation:d2 23s ease-in-out infinite alternate}
.b3{animation:d3 17s ease-in-out infinite alternate}
@keyframes d1{to{transform:translate(-90px,50px)}}
@keyframes d2{to{transform:translate(120px,-70px)}}
@keyframes d3{to{transform:translate(-60px,60px)}}
.glow{transform-box:fill-box;transform-origin:center;animation:pulse 5s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.12);opacity:.75}}
.rays{transform-origin:${SX}px ${SY}px;animation:spin 90s linear infinite}
.corona{transform-origin:${SX}px ${SY}px;animation:spin 40s linear infinite reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.sun{animation:fadeIn 1.6s ease .1s both}
.k{animation:fadeUp .9s ${EASE} .15s both}
.name{animation:rise 1.3s ${EASE} .25s both}
.role{animation:fadeUp 1s ${EASE} .65s both}
.focus{animation:fadeUp 1s ${EASE} .8s both}
.rule{stroke-dasharray:1;animation:draw 1.6s ${EASE} .9s both}
.meta{animation:fadeIn 1.2s ease 1.2s both}
.live{transform-box:fill-box;transform-origin:center;animation:ping 2s ease-out infinite}
@keyframes ping{from{transform:scale(1);opacity:.7}to{transform:scale(3.2);opacity:0}}
`;

  const defs = `
<clipPath id="frame"><rect width="${W}" height="${H}" rx="28"/></clipPath>
<clipPath id="nameClip"><rect x="60" y="120" width="720" height="180"/></clipPath>
<radialGradient id="gEmber"><stop offset="0" stop-color="${ACCENT.ember}"/><stop offset="1" stop-color="${ACCENT.ember}" stop-opacity="0"/></radialGradient>
<radialGradient id="gIce"><stop offset="0" stop-color="${ACCENT.ice}"/><stop offset="1" stop-color="${ACCENT.ice}" stop-opacity="0"/></radialGradient>
<radialGradient id="gViolet"><stop offset="0" stop-color="${ACCENT.violet}"/><stop offset="1" stop-color="${ACCENT.violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="sunCore" cx=".42" cy=".4" r=".6">
  <stop offset="0" stop-color="#fffaf0"/><stop offset=".3" stop-color="#ffe2a0"/>
  <stop offset=".65" stop-color="${ACCENT.gold}"/><stop offset="1" stop-color="${ACCENT.ember}"/>
</radialGradient>
<radialGradient id="sunGlow"><stop offset="0" stop-color="${ACCENT.ember}" stop-opacity=".55"/><stop offset=".45" stop-color="${ACCENT.ember}" stop-opacity=".16"/><stop offset="1" stop-color="${ACCENT.ember}" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1" fill="${D.grid}" fill-opacity=".09"/></pattern>
<radialGradient id="fade" cx=".6" cy=".45" r=".7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="dotMask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
<linearGradient id="shimmer" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
  <stop offset="0" stop-color="${D.text}"/><stop offset=".42" stop-color="${D.text}"/>
  <stop offset=".5" stop-color="#ffd38f"/><stop offset=".58" stop-color="${D.text}"/><stop offset="1" stop-color="${D.text}"/>
  <animateTransform attributeName="gradientTransform" type="translate" from="-1200 0" to="0 0" dur="7s" repeatCount="indefinite"/>
</linearGradient>
<linearGradient id="ruleGrad" x1="0" x2="1"><stop offset="0" stop-color="${ACCENT.ember}"/><stop offset=".35" stop-color="${D.line}"/><stop offset="1" stop-color="${D.line}" stop-opacity="0"/></linearGradient>`;

  const body = `
<g clip-path="url(#frame)">
  <rect width="${W}" height="${H}" fill="${D.bg}"/>
  <circle class="b1" cx="1000" cy="120" r="430" fill="url(#gEmber)" opacity=".30"/>
  <circle class="b2" cx="160" cy="520" r="470" fill="url(#gIce)" opacity=".20"/>
  <circle class="b3" cx="640" cy="-60" r="330" fill="url(#gViolet)" opacity=".16"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dotMask)"/>

  <g class="sun">
    <circle class="glow" cx="${SX}" cy="${SY}" r="235" fill="url(#sunGlow)"/>
    ${orbits.map((o) => half(o, false)).join('')}
    ${orbits.map((o) => planet(o, false)).join('')}
    <g class="rays" stroke="${ACCENT.gold}" stroke-opacity=".32" stroke-width="1.2" stroke-linecap="round">${rays}</g>
    <circle class="corona" cx="${SX}" cy="${SY}" r="104" stroke="${ACCENT.gold}" stroke-opacity=".45" stroke-dasharray="2 9"/>
    <circle cx="${SX}" cy="${SY}" r="72" fill="url(#sunCore)"/>
    <circle cx="${SX}" cy="${SY}" r="72" stroke="#fff" stroke-opacity=".25"/>
    ${orbits.map((o) => half(o, true)).join('')}
    ${orbits.map((o) => planet(o, true)).join('')}
  </g>
  ${embers}

  <g class="k">
    <circle class="live" cx="90" cy="104" r="4" fill="${ACCENT.mint}"/>
    <circle cx="90" cy="104" r="4" fill="${ACCENT.mint}"/>
    <text class="mono" x="106" y="109" font-size="13" letter-spacing="3" fill="${D.muted}">${esc(PROFILE.status)}</text>
  </g>
  <g clip-path="url(#nameClip)"><g class="name">
    <text class="display" x="78" y="262" font-size="156" fill="url(#shimmer)" letter-spacing="-2">${esc(PROFILE.name)}<tspan fill="${ACCENT.ember}">.</tspan></text>
  </g></g>
  <text class="role sans" x="84" y="324" font-size="25" fill="${D.text}">Full-stack developer crafting <tspan class="display" font-style="italic" font-size="31" fill="${ACCENT.gold}">immersive</tspan> digital products.</text>
  <text class="focus sans" x="84" y="360" font-size="17" fill="${D.muted}">${esc(PROFILE.focus)}</text>

  <path class="rule" d="M84 398H1116" stroke="url(#ruleGrad)" pathLength="1"/>
  <g class="meta mono" font-size="12" letter-spacing="2.5" fill="${D.dim}">
    <text x="84" y="428">${esc(PROFILE.metaLeft)}</text>
    <text x="1116" y="428" text-anchor="end">${esc(PROFILE.metaRight)}</text>
  </g>
  <g stroke="${D.dim}" stroke-opacity=".7">
    ${crop(24, 24, 1, 1)}${crop(W - 24, 24, -1, 1)}${crop(24, H - 24, 1, -1)}${crop(W - 24, H - 24, -1, -1)}
  </g>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="28" stroke="${D.line}"/>`;

  write('assets/hero.svg', svg({
    w: W, h: H, title: 'Apollo, full-stack developer',
    desc: 'Animated banner: a glowing sun with orbiting planets beside the name Apollo.',
    fonts: ['display', 'displayItalic', 'sans', 'mono'], css, defs, body,
  }));
}

// ───────────────────────── typing intro ─────────────────────────

function typing(themeName) {
  const T = THEMES[themeName];
  const W = 1200, H = 72, SIZE = 24, CW = SIZE * 0.6, Y = 46;
  const TYPE = 0.05, DEL = 0.018, HOLD = 2.4, GAP = 0.45;
  const prefix = '> ';

  let t = 0;
  const lines = TYPING.map((raw) => {
    const text = prefix + raw;
    const n = text.length, x0 = (W - n * CW) / 2;
    const start = t;
    t += n * TYPE + HOLD + n * DEL + GAP;
    return { text, n, x0, start };
  });
  const TOTAL = t;
  const k = (s) => r2(Math.min(s / TOTAL, 1) * 10000) / 10000;

  const caret = [[0, lines[0].x0]];
  const parts = lines.map((L, i) => {
    const frames = [[0, 0]];
    for (let c = 1; c <= L.n; c++) frames.push([L.start + c * TYPE, c * CW]);
    const del0 = L.start + L.n * TYPE + HOLD;
    for (let c = 1; c <= L.n; c++) frames.push([del0 + c * DEL, (L.n - c) * CW]);
    caret.push([L.start, L.x0], ...frames.slice(1).map(([s, w]) => [s, L.x0 + w]));
    const values = frames.map((f) => r2(f[1])).join(';');
    const times = frames.map((f) => k(f[0])).join(';');
    return `<clipPath id="c${i}"><rect x="${r2(L.x0)}" y="0" width="0" height="${H}">` +
      `<animate attributeName="width" values="${values}" keyTimes="${times}" calcMode="discrete" dur="${r2(TOTAL)}s" repeatCount="indefinite"/></rect></clipPath>` +
      `<text class="mono" x="${r2(L.x0)}" y="${Y}" font-size="${SIZE}" textLength="${r2(L.n * CW)}" lengthAdjust="spacing" clip-path="url(#c${i})" fill="${T.text}">` +
      `<tspan fill="${ACCENT.ember}">${esc(prefix)}</tspan>${esc(L.text.slice(prefix.length))}</text>`;
  });
  caret.sort((a, b) => a[0] - b[0]);

  const css = `.caret{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;
  const body = `${parts.join('\n')}
<rect class="caret" x="0" y="${Y - SIZE + 2}" width="3" height="${SIZE + 4}" rx="1" fill="${ACCENT.ember}">
  <animate attributeName="x" values="${caret.map((c) => r2(c[1])).join(';')}" keyTimes="${caret.map((c) => k(c[0])).join(';')}" calcMode="discrete" dur="${r2(TOTAL)}s" repeatCount="indefinite"/>
</rect>`;
  write(`assets/intro-${themeName}.svg`, svg({
    w: W, h: H, title: TYPING.join(' '), fonts: ['mono'], css, body,
  }));
}

// ───────────────────────── section headers ─────────────────────────

function section(s, themeName) {
  const T = THEMES[themeName];
  const W = 1200, H = 130;
  const css = `${MOTION_CSS}
.t{animation:rise 1.2s ${EASE} both}
.i{animation:fadeUp .8s ${EASE} .1s both}
.cap{animation:fadeIn 1s ease .6s both}
.rule{stroke-dasharray:1;animation:draw 1.8s ${EASE} .3s both}`;
  const defs = `
<clipPath id="clip"><rect x="0" y="10" width="${W}" height="110"/></clipPath>
<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${ACCENT.ember}"/><stop offset=".3" stop-color="${T.line}"/><stop offset="1" stop-color="${T.line}" stop-opacity="0"/></linearGradient>
<linearGradient id="it" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${ACCENT.ember}"/><stop offset="1" stop-color="${ACCENT.gold}"/></linearGradient>`;
  const body = `
<text class="i mono" x="4" y="34" font-size="14" letter-spacing="3" fill="${ACCENT.ember}">${s.index} —</text>
<g clip-path="url(#clip)"><g class="t">
  <text class="display" x="0" y="98" font-size="66" fill="${T.text}" letter-spacing="-.5">${esc(s.title)} <tspan font-style="italic" fill="url(#it)">${esc(s.italic)}</tspan></text>
</g></g>
<text class="cap mono" x="${W - 4}" y="96" font-size="13" letter-spacing="3" fill="${T.dim}" text-anchor="end">${esc(s.caption)}</text>
<path class="rule" d="M2 122H${W - 2}" stroke="url(#g)" stroke-width="1.2" pathLength="1"/>
<circle r="2.5" fill="${ACCENT.gold}" opacity="0">
  <animateMotion path="M2 122H${W - 2}" dur="6s" begin="2s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="0;1;0" keyTimes="0;.15;1" dur="6s" begin="2s" repeatCount="indefinite"/>
</circle>`;
  write(`assets/section-${s.file}-${themeName}.svg`, svg({
    w: W, h: H, title: `${s.title} ${s.italic}`.replace('’', "'"),
    fonts: ['display', 'displayItalic', 'mono'], css, defs, body,
  }));
}

// ───────────────────────── project cards ─────────────────────────

const MX = 468, MY = 162; // motif centre

const MOTIFS = {
  globe(a) {
    const R = 98;
    const lats = [-60, -30, 0, 30, 60].map((y) => {
      const rx = Math.sqrt(R * R - y * y);
      return `<ellipse cx="${MX}" cy="${MY + y}" rx="${r2(rx)}" ry="${r2(rx * 0.16)}"/>`;
    }).join('');
    const mers = [0, 1, 2, 3].map((i) =>
      `<ellipse cx="${MX}" cy="${MY}" rx="${R}" ry="${R}"><animate attributeName="rx" values="${R};0;${R}" keyTimes="0;.5;1" calcSplines=".45 0 .55 1;.45 0 .55 1" calcMode="spline" dur="12s" begin="-${i * 3}s" repeatCount="indefinite"/></ellipse>`).join('');
    const route = `M${MX - 74} ${MY + 38}Q${MX - 10} ${MY - 170} ${MX + 70} ${MY - 46}`;
    return {
      defs: `<clipPath id="gc"><circle cx="${MX}" cy="${MY}" r="${R}"/></clipPath>
<pattern id="gd" width="11" height="11" patternUnits="userSpaceOnUse"><circle cx="5.5" cy="5.5" r="1.3" fill="${a}" fill-opacity=".5"/>
<animateTransform attributeName="patternTransform" type="translate" from="0 0" to="22 0" dur="6s" repeatCount="indefinite"/></pattern>
<radialGradient id="gs" cx=".35" cy=".3" r=".8"><stop offset=".3" stop-color="${D.panel}" stop-opacity="0"/><stop offset="1" stop-color="${D.panel}" stop-opacity=".95"/></radialGradient>`,
      body: `<circle cx="${MX}" cy="${MY}" r="${R}" fill="${D.panel2}"/>
<g clip-path="url(#gc)"><rect x="${MX - R - 30}" y="${MY - R}" width="${2 * R + 60}" height="${2 * R}" fill="url(#gd)"/>
<circle cx="${MX}" cy="${MY}" r="${R}" fill="url(#gs)"/></g>
<g stroke="${a}" stroke-opacity=".28">${lats}${mers}</g>
<circle cx="${MX}" cy="${MY}" r="${R}" stroke="${a}" stroke-opacity=".6"/>
<path d="${route}" stroke="${a}" stroke-width="1.6" stroke-dasharray="4 6"><animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite"/></path>
${[[MX - 74, MY + 38], [MX + 70, MY - 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${a}"/><circle cx="${x}" cy="${y}" r="4" stroke="${a}"><animate attributeName="r" values="4;14" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite"/></circle>`).join('')}
<circle r="4.5" fill="#fff"><animateMotion path="${route}" dur="3.2s" repeatCount="indefinite"/></circle>`,
    };
  },

  pulse(a) {
    const x0 = 366, w = 208, y0 = 84, h = 160, base = MY + 18;
    const ecg = `M${x0} ${base}H${x0 + 40}q7 -12 14 0H${x0 + 70}l6 10l9 -78l10 104l7 -36H${x0 + 122}q10 -22 20 0H${x0 + w}`;
    return {
      defs: `<pattern id="eg" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" stroke="${a}" stroke-opacity=".09"/></pattern>
<clipPath id="ec"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="16"/></clipPath>
<filter id="eglow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`,
      body: `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="16" fill="${D.panel2}" stroke="${a}" stroke-opacity=".3"/>
<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#eg)" clip-path="url(#ec)"/>
<g clip-path="url(#ec)">
<path d="${ecg}" stroke="${a}" stroke-opacity=".18" stroke-width="2" stroke-linejoin="round"/>
<path d="${ecg}" pathLength="1" stroke="${a}" stroke-width="5" stroke-dasharray=".28 .72" filter="url(#eglow)" opacity=".6"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="2.4s" repeatCount="indefinite"/></path>
<path d="${ecg}" pathLength="1" stroke="${a}" stroke-width="2.2" stroke-linejoin="round" stroke-dasharray=".28 .72"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="2.4s" repeatCount="indefinite"/></path>
<circle r="4" fill="#fff"><animateMotion path="${ecg}" keyPoints=".28;1;0;.28" keyTimes="0;.72;.72;1" calcMode="linear" dur="2.4s" repeatCount="indefinite"/></circle>
</g>
<text class="mono" x="${x0 + 16}" y="${y0 + 28}" font-size="12" letter-spacing="1.5" fill="${D.muted}">HEART RATE</text>
<g transform="translate(${x0 + w - 30} ${y0 + 23})"><path d="M-8 -1C-8-6-2-8 0-4C2-8 8-6 8-1C8 4 0 8 0 8C0 8-8 4-8-1Z" fill="${a}"><animateTransform attributeName="transform" type="scale" values="1;1.25;1;1.12;1" keyTimes="0;.12;.24;.36;1" dur="1.2s" additive="sum" repeatCount="indefinite"/></path></g>
<text class="display" x="${x0 + 16}" y="${y0 + h - 18}" font-size="36" fill="${D.text}">72<tspan class="mono" font-size="12" fill="${D.muted}" dx="6">BPM</tspan></text>
<text class="mono" x="${x0 + w - 16}" y="${y0 + h - 22}" font-size="12" fill="${a}" text-anchor="end">SpO2 98%</text>`,
    };
  },

  house(a) {
    const s = 34, ox = MX - 6, oy = MY + 44;
    const P = (x, y, z) => [r2(ox + (x - y) * 0.866 * s), r2(oy + (x + y) * 0.5 * s - z * s)];
    const box = (x, y, z, dx, dy, dz) => {
      const c = [[0, 0, 0], [dx, 0, 0], [dx, dy, 0], [0, dy, 0]].map(([a_, b]) => [x + a_, y + b]);
      const lo = c.map(([px, py]) => P(px, py, z)), hi = c.map(([px, py]) => P(px, py, z + dz));
      const ring = (q) => `M${q[0]}L${q[1]}L${q[2]}L${q[3]}Z`;
      return ring(lo) + ring(hi) + lo.map((p, i) => `M${p}L${hi[i]}`).join('');
    };
    const lower = box(-1.6, -1.1, 0, 3.2, 2.2, 1.1);
    const upper = box(-0.6, -1.6, 1.1, 2.6, 2.0, 0.95);
    const glass = [P(1.6, -1.1, 0.12), P(1.6, 0.9, 0.12), P(1.6, 0.9, 0.95), P(1.6, -1.1, 0.95)];
    const ground = [-2.6, -1.3, 0, 1.3, 2.6].map((v) => `M${P(v, -2.6, 0)}L${P(v, 2.6, 0)}M${P(-2.6, v, 0)}L${P(2.6, v, 0)}`).join('');
    const sunArc = `M${MX - 105} ${MY - 10}A110 92 0 0 1 ${MX + 105} ${MY - 10}`;
    return {
      defs: `<radialGradient id="hs"><stop offset="0" stop-color="${a}" stop-opacity=".9"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>`,
      body: `<path d="${ground}" stroke="${a}" stroke-opacity=".12"/>
<path d="${sunArc}" stroke="${a}" stroke-opacity=".2" stroke-dasharray="2 6"/>
<g><circle r="18" fill="url(#hs)"/><circle r="6" fill="#fff4dc"/><animateMotion path="${sunArc}" dur="10s" repeatCount="indefinite"/></g>
<path d="M${glass.join('L')}Z" fill="${a}" opacity=".0"><animate attributeName="opacity" values="0;0;.28;.28;0" keyTimes="0;.35;.5;.85;1" dur="7s" repeatCount="indefinite"/></path>
<path d="${lower}${upper}" pathLength="1" stroke="${a}" stroke-width="1.6" stroke-linejoin="round" stroke-dasharray="1 1">
  <animate attributeName="stroke-dashoffset" values="1;0;0;0" keyTimes="0;.42;.85;1" dur="7s" repeatCount="indefinite"/>
  <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;.42;.88;1" dur="7s" repeatCount="indefinite"/>
</path>
<text class="mono" x="${MX + 104}" y="${MY + 110}" font-size="11" letter-spacing="1.5" fill="${D.dim}" text-anchor="end">PLAN · A-01</text>`,
    };
  },

  deco(a) {
    const baseY = 262;
    const arches = [0, 1, 2, 3].map((i) => {
      const w = 176 - i * 36, top = 96 + i * 20, x1 = MX - w / 2, x2 = MX + w / 2;
      return `<path d="M${x1} ${baseY}V${top + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x2} ${top + w / 2}V${baseY}" pathLength="1" stroke="${a}" stroke-opacity="${0.85 - i * 0.15}" stroke-width="${i === 0 ? 1.8 : 1.2}" stroke-dasharray="1 1">` +
        `<animate attributeName="stroke-dashoffset" values="1;0;0;1" keyTimes="0;.35;.85;1" dur="8s" begin="${i * 0.25}s" repeatCount="indefinite"/></path>`;
    }).join('');
    const rays = Array.from({ length: 13 }, (_, i) => {
      const ang = Math.PI + (i / 12) * Math.PI;
      return `M${MX} ${baseY - 4}L${r2(MX + Math.cos(ang) * 50)} ${r2(baseY - 4 + Math.sin(ang) * 50)}`;
    }).join('');
    const star = (cx, cy, r) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const ang = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
        return `${r2(cx + Math.cos(ang) * rr)},${r2(cy + Math.sin(ang) * rr)}`;
      });
      return pts.join(' ');
    };
    const stars = [0, 1, 2, 3, 4].map((i) =>
      `<polygon points="${star(MX - 48 + i * 24, 50, 8)}" fill="${a}" opacity=".25"><animate attributeName="opacity" values=".25;1;1;.25" keyTimes="0;.1;.8;1" dur="5s" begin="${i * 0.35}s" repeatCount="indefinite"/></polygon>`).join('');
    return {
      defs: `<radialGradient id="dg" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="${a}" stop-opacity=".35"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>`,
      body: `${stars}
<rect x="${MX - 88}" y="140" width="176" height="${baseY - 140}" fill="url(#dg)"/>
<path d="${rays}" stroke="${a}" stroke-opacity=".4"><animate attributeName="stroke-opacity" values=".15;.55;.15" dur="4s" repeatCount="indefinite"/></path>
${arches}
<path d="M${MX - 110} ${baseY}H${MX + 110}" stroke="${a}" stroke-opacity=".6"/>
<text class="mono" x="${MX}" y="${baseY + 22}" font-size="11" letter-spacing="4" fill="${D.dim}" text-anchor="middle">GRAND SUITE</text>`,
    };
  },

  flight(a) {
    const A = [MX - 92, MY + 70], B = [MX + 78, MY - 50];
    const route = `M${A[0]} ${A[1]}C${MX - 70} ${MY - 40} ${MX - 10} ${MY - 96} ${B[0]} ${B[1]}`;
    const plane = 'M12 0L-6 -9L-3 -1H-9L-12 -5H-14L-12 0L-14 5H-12L-9 1H-3L-6 9Z';
    const grid = [-1, 0, 1].map((i) => `M${MX - 120} ${MY + i * 52}Q${MX} ${MY + i * 52 - 26} ${MX + 120} ${MY + i * 52}`).join('') +
      [-1, 0, 1].map((i) => `M${MX + i * 60} ${MY - 110}Q${MX + i * 60 + 18} ${MY} ${MX + i * 60} ${MY + 110}`).join('');
    const port = ([x, y], code, dx, dy = 4) => `<circle cx="${x}" cy="${y}" r="5" fill="${a}"/><circle cx="${x}" cy="${y}" r="5" stroke="${a}"><animate attributeName="r" values="5;18" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite"/></circle>` +
      `<text class="mono" x="${x + dx}" y="${y + dy}" font-size="13" letter-spacing="1.5" fill="${D.text}" text-anchor="${dx < 0 ? 'end' : dx > 0 ? 'start' : 'middle'}">${code}</text>`;
    return {
      defs: '',
      body: `<path d="${grid}" stroke="${a}" stroke-opacity=".1"/>
<path d="${route}" stroke="${a}" stroke-opacity=".25" stroke-width="1.5"/>
<path d="${route}" stroke="${a}" stroke-width="1.5" stroke-dasharray="3 7"><animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.2s" repeatCount="indefinite"/></path>
${port(A, 'LIS', -14)}${port(B, 'JFK', 0, -16)}
<path d="${plane}" fill="#fff"><animateMotion path="${route}" rotate="auto" dur="5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1"/>
<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1" dur="5s" repeatCount="indefinite"/></path>
<text class="mono" x="${MX - 92}" y="${MY - 86}" font-size="11" letter-spacing="2" fill="${D.dim}">AE 214 · GATE B12</text>
<text class="mono" x="${MX - 92}" y="${MY - 68}" font-size="11" letter-spacing="2" fill="${a}">BOARDING<animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></text>`,
    };
  },

  scope(a) {
    const R = 100;
    const ticks = Array.from({ length: 72 }, (_, i) => {
      const ang = (i / 72) * Math.PI * 2, l = i % 6 === 0 ? 12 : 5;
      return `M${r2(MX + Math.cos(ang) * R)} ${r2(MY + Math.sin(ang) * R)}L${r2(MX + Math.cos(ang) * (R - l))} ${r2(MY + Math.sin(ang) * (R - l))}`;
    }).join('');
    const bracket = (sx, sy) => `M${sx * 26} ${sy * 14}V${sy * 26}H${sx * 14}`;
    const ranges = ['RNG 214m', 'RNG 187m', 'RNG 152m', 'RNG 096m'];
    return {
      defs: `<clipPath id="sc"><circle cx="${MX}" cy="${MY}" r="${R - 2}"/></clipPath>
<linearGradient id="sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity="0"/><stop offset="1" stop-color="${a}" stop-opacity=".35"/></linearGradient>`,
      body: `<circle cx="${MX}" cy="${MY}" r="${R}" fill="${D.panel2}" stroke="${a}" stroke-opacity=".55"/>
<g clip-path="url(#sc)"><rect x="${MX - R}" y="${MY - R - 40}" width="${2 * R}" height="40" fill="url(#sl)"><animateTransform attributeName="transform" type="translate" values="0 0;0 ${2 * R + 40}" dur="3.2s" repeatCount="indefinite"/></rect></g>
<path d="${ticks}" stroke="${a}" stroke-opacity=".6"><animateTransform attributeName="transform" type="rotate" from="0 ${MX} ${MY}" to="360 ${MX} ${MY}" dur="40s" repeatCount="indefinite"/></path>
<circle cx="${MX}" cy="${MY}" r="62" stroke="${a}" stroke-opacity=".45" stroke-dasharray="14 8"><animateTransform attributeName="transform" type="rotate" from="360 ${MX} ${MY}" to="0 ${MX} ${MY}" dur="18s" repeatCount="indefinite"/></circle>
<path d="M${MX - R + 6} ${MY}H${MX - 12}M${MX + 12} ${MY}H${MX + R - 6}M${MX} ${MY - R + 6}V${MY - 12}M${MX} ${MY + 12}V${MY + R - 6}" stroke="${a}" stroke-width="1.4"/>
<g transform="translate(${MX} ${MY})"><g stroke="#fff" stroke-width="2">${bracket(-1, -1)}${bracket(1, -1)}${bracket(-1, 1)}${bracket(1, 1)}<animateTransform attributeName="transform" type="scale" values="1;.82;1" dur="1.6s" additive="sum" repeatCount="indefinite"/></g></g>
<circle cx="${MX}" cy="${MY}" r="3" fill="${a}"><animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite"/></circle>
${ranges.map((r, i) => `<text class="mono" x="${MX + R}" y="${MY + R + 24}" font-size="12" letter-spacing="1.5" fill="${a}" text-anchor="end" opacity="0">${r}<animate attributeName="opacity" values="${ranges.map((_, j) => (i === j ? 1 : 0)).join(';')}" calcMode="discrete" dur="4.8s" repeatCount="indefinite"/></text>`).join('')}
<text class="mono" x="${MX - R}" y="${MY + R + 24}" font-size="12" letter-spacing="1.5" fill="${D.dim}">WAVE 07</text>`,
    };
  },
};

function card(p, i) {
  const W = 600, H = 360, a = p.accent;
  const m = MOTIFS[p.motif](a);
  const css = `${MOTION_CSS}
.run{stroke-dasharray:14 86;animation:run 8s linear infinite}
.run2{stroke-dasharray:14 86;animation:run 8s linear infinite;animation-delay:-4s}
@keyframes run{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.motif{animation:fadeIn 1.4s ease .2s both}
.tt{animation:rise 1.1s ${EASE} .1s both}
.tx{animation:fadeUp .9s ${EASE} .45s both}
.tg{animation:fadeUp .9s ${EASE} .65s both}`;
  const defs = `<clipPath id="cc"><rect width="${W}" height="${H}" rx="22"/></clipPath>
<clipPath id="tc"><rect x="20" y="62" width="380" height="104"/></clipPath>
<radialGradient id="halo"><stop offset="0" stop-color="${a}" stop-opacity=".22"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>${m.defs}`;
  const body = `
<g clip-path="url(#cc)">
  <rect width="${W}" height="${H}" fill="${D.panel}"/>
  <circle cx="${MX}" cy="${MY}" r="230" fill="url(#halo)"/>
  <g class="motif">${m.body}</g>
  <text class="mono" x="34" y="48" font-size="13" letter-spacing="1.5"><tspan fill="${a}">N°0${i + 1}</tspan><tspan fill="${D.dim}" dx="10">${esc(p.kicker)}</tspan></text>
  <g clip-path="url(#tc)"><g class="tt">
    <text class="display" x="32" y="122" font-size="60" fill="${D.text}" letter-spacing="-.5">${esc(p.name)}</text>
    <text class="display" x="34" y="156" font-size="23" font-style="italic" fill="${a}">${esc(p.tagline)}</text>
  </g></g>
  <g class="tx sans" font-size="17" fill="${D.muted}">
    ${p.desc.map((l, j) => `<text x="34" y="${200 + j * 25}">${esc(l)}</text>`).join('')}
  </g>
  <g class="tg">${chipRow(34, 294, p.tags, { size: 13, color: D.text, stroke: D.line, fill: D.panel2, h: 32 })}</g>
</g>
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="22" stroke="${D.line}" stroke-width="1.5"/>
<rect class="run" x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="22" pathLength="100" stroke="${a}" stroke-width="2" stroke-linecap="round"/>
<rect class="run2" x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="22" pathLength="100" stroke="${a}" stroke-opacity=".35" stroke-width="1.5" stroke-linecap="round"/>`;
  write(`assets/work-${p.slug}.svg`, svg({
    w: W, h: H, title: `${p.name}: ${p.tagline}`, desc: p.desc.join(' '),
    fonts: ['display', 'displayItalic', 'sans', 'mono'], css, defs, body,
  }));
}

// ───────────────────────── toolkit ─────────────────────────

function toolkit() {
  const W = 1200, H = 400, COLW = 268, X0 = 52, Y0 = 70;
  const all = TOOLKIT.flatMap((c) => c.items).length;
  const cycle = all * 0.5;
  let n = 0;
  const cols = TOOLKIT.map((c, ci) => {
    const x = X0 + ci * (COLW + 18);
    const items = c.items.map((it, ii) => {
      const k = n++;
      const y = Y0 + 62 + ii * 40;
      return `<g class="it" style="animation-delay:${r2(0.3 + k * 0.04)}s">
<text class="mono" x="${x}" y="${y}" font-size="11" fill="${D.dim}">${String(ii + 1).padStart(2, '0')}</text>
<text class="sans" x="${x + 30}" y="${y}" font-size="19" fill="${D.text}">${esc(it)}</text>
<circle cx="${x + COLW - 14}" cy="${y - 6}" r="3.5" fill="${c.accent}" opacity=".18"><animate attributeName="opacity" values=".18;1;.18" keyTimes="0;.04;.16" dur="${cycle}s" begin="${r2(k * 0.5)}s" repeatCount="indefinite"/></circle>
</g>`;
    }).join('');
    return `<g>
<text class="mono" x="${x}" y="${Y0}" font-size="12" letter-spacing="3" fill="${c.accent}">${esc(c.title)}</text>
<path class="rule" d="M${x} ${Y0 + 18}H${x + COLW}" stroke="${c.accent}" stroke-opacity=".5" pathLength="1" style="animation-delay:${0.2 + ci * 0.15}s"/>
${items}</g>`;
  }).join('');
  const css = `${MOTION_CSS}
.it{animation:fadeUp .8s ${EASE} both}
.rule{stroke-dasharray:1;animation:draw 1.4s ${EASE} both}
.foot{animation:fadeIn 1.2s ease 1.2s both}
.sweep{animation:sweep 9s ease-in-out infinite}
@keyframes sweep{from{transform:translateX(-400px)}to{transform:translateX(1400px)}}`;
  const defs = `<clipPath id="cc"><rect width="${W}" height="${H}" rx="24"/></clipPath>
<linearGradient id="sw" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".045"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="h1"><stop offset="0" stop-color="${ACCENT.ember}" stop-opacity=".16"/><stop offset="1" stop-color="${ACCENT.ember}" stop-opacity="0"/></radialGradient>
<radialGradient id="h2"><stop offset="0" stop-color="${ACCENT.ice}" stop-opacity=".12"/><stop offset="1" stop-color="${ACCENT.ice}" stop-opacity="0"/></radialGradient>`;
  const body = `<g clip-path="url(#cc)">
<rect width="${W}" height="${H}" fill="${D.panel}"/>
<circle cx="1150" cy="0" r="420" fill="url(#h1)"/><circle cx="0" cy="${H}" r="420" fill="url(#h2)"/>
<rect class="sweep" x="0" y="0" width="300" height="${H}" fill="url(#sw)" transform="skewX(-12)"/>
${cols}
<path d="M${X0} ${H - 52}H${W - X0}" stroke="${D.line}"/>
<text class="foot mono" x="${X0}" y="${H - 22}" font-size="12" letter-spacing="1.5" fill="${D.muted}">${TOOLKIT_FOOT.map(([k, v], i) => `<tspan fill="${ACCENT.ember}" dx="${i ? 36 : 0}">${k}</tspan><tspan dx="12">${esc(v)}</tspan>`).join('')}</text>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" stroke="${D.line}"/>`;
  write('assets/toolkit.svg', svg({
    w: W, h: H, title: 'Toolkit',
    desc: TOOLKIT.map((c) => `${c.title}: ${c.items.join(', ')}`).join('. '),
    fonts: ['sans', 'mono'], css, defs, body,
  }));
}

// ───────────────────────── footer ─────────────────────────

function footer(themeName) {
  const T = THEMES[themeName];
  const W = 1200, H = 230, CX = 600, HY = 120;
  const rays = Array.from({ length: 40 }, (_, i) => {
    const ang = (i / 40) * Math.PI * 2, r1 = 58, r2_ = 58 + (i % 2 ? 16 : 34);
    return `M${r2(CX + Math.cos(ang) * r1)} ${r2(HY + Math.sin(ang) * r1)}L${r2(CX + Math.cos(ang) * r2_)} ${r2(HY + Math.sin(ang) * r2_)}`;
  }).join('');
  const css = `${MOTION_CSS}
.sun{animation:up 2.4s ${EASE} both}
@keyframes up{from{transform:translateY(70px)}}
.rays{transform-origin:${CX}px ${HY}px;animation:spin 60s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.line{stroke-dasharray:1;animation:draw 2s ${EASE} .2s both}
.q{animation:fadeUp 1s ${EASE} .8s both}
.s{animation:fadeIn 1s ease 1.2s both}`;
  const defs = `<clipPath id="sky"><rect width="${W}" height="${HY}"/></clipPath>
<radialGradient id="core" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff6e0"/><stop offset=".5" stop-color="${ACCENT.gold}"/><stop offset="1" stop-color="${ACCENT.ember}"/></radialGradient>
<radialGradient id="gl"><stop offset="0" stop-color="${ACCENT.ember}" stop-opacity=".4"/><stop offset="1" stop-color="${ACCENT.ember}" stop-opacity="0"/></radialGradient>
<linearGradient id="hz" x1="0" x2="1"><stop offset="0" stop-color="${T.line}" stop-opacity="0"/><stop offset=".5" stop-color="${ACCENT.ember}"/><stop offset="1" stop-color="${T.line}" stop-opacity="0"/></linearGradient>`;
  const body = `<g clip-path="url(#sky)"><g class="sun">
<circle cx="${CX}" cy="${HY}" r="170" fill="url(#gl)"/>
<path class="rays" d="${rays}" stroke="${ACCENT.gold}" stroke-opacity=".45" stroke-linecap="round"/>
<circle cx="${CX}" cy="${HY}" r="46" fill="url(#core)"/>
</g></g>
<path class="line" d="M80 ${HY}H${W - 80}" stroke="url(#hz)" stroke-width="1.4" pathLength="1"/>
<text class="q display" x="${CX}" y="${HY + 60}" font-size="38" font-style="italic" fill="${T.text}" text-anchor="middle">Let’s build something remarkable.</text>
<text class="s mono" x="${CX}" y="${HY + 96}" font-size="12" letter-spacing="3" fill="${T.dim}" text-anchor="middle">APOLLO0515 · FULL-STACK DEVELOPER · ${new Date().getFullYear()}</text>`;
  write(`assets/footer-${themeName}.svg`, svg({
    w: W, h: H, title: "Let's build something remarkable.",
    fonts: ['display', 'displayItalic', 'mono'], css, defs, body,
  }));
}

// ───────────────────────── run ─────────────────────────

console.log('Building profile graphics');
hero();
PROJECTS.forEach(card);
toolkit();
for (const theme of ['dark', 'light']) {
  typing(theme);
  SECTIONS.forEach((s) => section(s, theme));
  footer(theme);
}

export { PROJECTS, FAMILY };
