// Shared design tokens and SVG helpers for the profile graphics.
// Every graphic is a self-contained SVG: fonts are embedded (ASCII subsets in ./fonts),
// animation is CSS + SMIL only, so it renders inside GitHub's <img> sandbox.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, '..');

// "Fire & ice" palette, taken from the avatar.
export const THEMES = {
  dark: {
    bg: '#07090f', panel: '#0b0f19', panel2: '#0f1522', line: '#1c2433',
    text: '#eef1f7', muted: '#97a1b5', dim: '#5d677b', grid: '#ffffff',
  },
  light: {
    bg: '#ffffff', panel: '#f6f7fa', panel2: '#eef0f5', line: '#dde1ea',
    text: '#11151f', muted: '#4c5568', dim: '#8a93a6', grid: '#000000',
  },
};
export const ACCENT = {
  ember: '#ff6a2b', gold: '#ffb648', ice: '#5ccbff', violet: '#9b8cff',
  mint: '#43e0a8', sky: '#6aa8ff', red: '#ff4d4d', champagne: '#e8c88f',
};

const FONT_FILES = {
  display: ['display.woff2', 'Display', 'normal', 400],
  displayItalic: ['display-italic.woff2', 'Display', 'italic', 400],
  sans: ['sans-400.woff2', 'Sans', 'normal', 400],
  sansBold: ['sans-600.woff2', 'Sans', 'normal', 600],
  mono: ['mono.woff2', 'Mono', 'normal', 400],
};
const fontCache = {};
export function fontFaces(...keys) {
  return keys.map((k) => {
    const [file, family, style, weight] = FONT_FILES[k];
    fontCache[file] ??= readFileSync(join(here, 'fonts', file)).toString('base64');
    return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
      `src:url(data:font/woff2;base64,${fontCache[file]}) format('woff2');}`;
  }).join('');
}

export const FAMILY = {
  display: `'Display','Iowan Old Style',Georgia,serif`,
  sans: `'Sans','Segoe UI',-apple-system,Helvetica,Arial,sans-serif`,
  mono: `'Mono',ui-monospace,Consolas,Menlo,monospace`,
};
// JetBrains Mono advance width is exactly 0.6em, which lets us lay out mono text precisely.
export const monoWidth = (text, size) => text.length * size * 0.6;

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Deterministic randomness so rebuilding produces identical files.
export function rng(seed = 7) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const r2 = (n) => Math.round(n * 100) / 100;

const BASE_CSS = `
.display{font-family:${FAMILY.display}}
.sans{font-family:${FAMILY.sans}}
.mono{font-family:${FAMILY.mono}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
`;

export function svg({ w, h, title, desc = '', fonts = [], css = '', defs = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc || title)}</desc>
<style>${fontFaces(...fonts)}${BASE_CSS}${css}</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

export function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log(`  ${rel.padEnd(34)} ${(content.length / 1024).toFixed(1).padStart(6)} KB`);
}

// Pill-shaped tag with mono text, width measured exactly.
export function chip(x, y, label, { size = 12, color, stroke, fill = 'none', padX = 12, h = 28 } = {}) {
  const w = monoWidth(label, size) + padX * 2;
  return {
    w,
    svg: `<g transform="translate(${r2(x)} ${r2(y)})">` +
      `<rect width="${r2(w)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>` +
      `<text class="mono" x="${padX}" y="${h / 2 + size * 0.36}" font-size="${size}" fill="${color}">${esc(label)}</text></g>`,
  };
}

// Row of chips, left to right.
export function chipRow(x, y, labels, opts) {
  let cx = x;
  return labels.map((l) => {
    const c = chip(cx, y, l, opts);
    cx += c.w + 8;
    return c.svg;
  }).join('');
}

// Path for a rotated ellipse (usable as motion path).
export function ellipsePath(cx, cy, rx, ry, deg) {
  const t = (deg * Math.PI) / 180;
  const x1 = cx + rx * Math.cos(t), y1 = cy + rx * Math.sin(t);
  const x2 = cx - rx * Math.cos(t), y2 = cy - rx * Math.sin(t);
  return `M${r2(x1)} ${r2(y1)}A${rx} ${ry} ${deg} 1 1 ${r2(x2)} ${r2(y2)}A${rx} ${ry} ${deg} 1 1 ${r2(x1)} ${r2(y1)}Z`;
}
