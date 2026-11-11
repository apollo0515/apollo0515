// Writes preview.html: the README inside a GitHub-like profile column, using local
// assets and dist/ (run `npm run stats:mock` first for a sample activity card).
// Open preview.html, or preview.html#light for the light theme.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

let html = readFileSync(join(ROOT, 'README.md'), 'utf8')
  .replaceAll('https://raw.githubusercontent.com/apollo0515/apollo0515/output/', 'dist/');
if (!existsSync(join(ROOT, 'dist/snake-dark.svg'))) {
  html = html.replace(/<p align="center">\s*<picture>[\s\S]*?snake[\s\S]*?<\/picture>\s*<\/p>/,
    '<p align="center" class="note">(contribution snake appears here once the workflow has run)</p>');
}
// Plain-markdown paragraphs → <p>
html = html.replace(/^(?!\s*<|\s*$)(.+)$/gm, '<p>$1</p>');

writeFileSync(join(ROOT, 'preview.html'), `<!doctype html><meta charset="utf-8">
<title>Profile preview</title>
<style>
  :root{--bg:#0d1117;--fg:#e6edf3;--muted:#9198a1}
  :root.light{--bg:#ffffff;--fg:#1f2328;--muted:#59636e}
  body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif}
  main{max-width:830px;margin:40px auto;padding:0 16px}
  img{max-width:100%}
  p{margin:0 0 16px}
  sub{color:var(--muted)}
  .note{color:var(--muted);font-size:13px}
</style>
<script>if (location.hash === '#light') document.documentElement.classList.add('light');</script>
<main>${html}</main>
<script>
  // Mirror GitHub: pick <picture> sources from the page theme, not the OS.
  const dark = !document.documentElement.classList.contains('light');
  document.querySelectorAll('picture').forEach((p) => {
    const src = p.querySelector('source');
    if (src) { if (dark) p.querySelector('img').src = src.srcset; src.remove(); }
  });
</script>
`);
console.log('Wrote preview.html');
