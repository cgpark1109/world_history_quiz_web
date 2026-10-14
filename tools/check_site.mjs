#!/usr/bin/env node
// Link checker for the static site.
//
// Usage:
//   python -m http.server 8000            (in the repo, or in its parent to test a sub-path)
//   node tools/check_site.mjs http://127.0.0.1:8000/
//   node tools/check_site.mjs http://127.0.0.1:8000/world_history_quiz_web/
//
// Fetches the page and every local asset referenced by HTML src/href, by CSS
// url(), by src/href attributes inside JS template strings, and by fetch()
// calls in JS (templates are expanded for every era/type from app.js).
// Fails on any non-200 response and on any root-absolute path ("/x"), which
// would break when the site is served under a sub-path.

const base = new URL(process.argv[2] || 'http://127.0.0.1:8000/');
const failures = [];
const checked = new Map();
const external = new Set();

async function get(url) {
  const res = await fetch(url, { redirect: 'manual' });
  const body = res.status === 200 ? await res.text() : '';
  return { status: res.status, body, type: res.headers.get('content-type') || '' };
}

async function check(url, from) {
  const key = url.href.split('#')[0];
  if (checked.has(key)) return checked.get(key);
  const result = await get(key);
  checked.set(key, result);
  const mark = result.status === 200 ? 'ok ' : 'ERR';
  console.log(`${mark} ${result.status} ${key.replace(base.href, '')}  (from ${from})`);
  if (result.status !== 200) failures.push(`${result.status} ${key} (from ${from})`);
  return result;
}

function classify(ref, from) {
  if (!ref || ref.startsWith('#') || ref.startsWith('data:') || ref.startsWith('mailto:')) return null;
  if (/^https?:\/\//.test(ref)) {
    external.add(ref);
    return null;
  }
  if (ref.startsWith('/')) {
    failures.push(`root-absolute path "${ref}" in ${from}`);
    return null;
  }
  return ref;
}

const attrRefs = (text) => [...text.matchAll(/\b(?:src|href)\s*=\s*"([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
// og:image etc. use absolute URLs on the canonical site; check the local copy.
const CANONICAL = 'https://cgpark1109.github.io/world_history_quiz_web/';
const metaRefs = (text) =>
  [...text.matchAll(/\bcontent\s*=\s*"([^"]*)"/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(CANONICAL) && u.length > CANONICAL.length)
    .map((u) => u.slice(CANONICAL.length));
const cssRefs =(text) => [...text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map((m) => m[1]);

function jsArray(text, name) {
  const m = text.match(new RegExp(`const ${name}\\s*=\\s*\\[([^\\]]*)\\]`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
}

function fetchRefs(text) {
  const refs = [];
  const eras = jsArray(text, 'ERAS');
  const cats = jsArray(text, 'CATEGORIES');
  const keys = eras.flatMap((e) => cats.map((c) => `${e}_${c}`));
  for (const m of text.matchAll(/fetch\(\s*(['`])([^'`]+)\1/g)) {
    const raw = m[2];
    if (!raw.includes('${')) {
      refs.push(raw);
      continue;
    }
    // data/${key}.json, with key = `${era}_${cat}`
    if (/^[^$]*\$\{\w+\}[^$]*$/.test(raw) && keys.length) {
      for (const k of keys) refs.push(raw.replace(/\$\{\w+\}/, k));
    } else {
      failures.push(`cannot expand fetch template ${raw}`);
    }
  }
  return refs;
}

async function main() {
  console.log(`Checking ${base.href}\n`);
  const pages = [base, new URL('index.html', base)];
  for (const page of pages) {
    const { status, body } = await check(page, 'start');
    if (status !== 200) continue;
    for (const ref of [...attrRefs(body), ...metaRefs(body)]) {
      const rel = classify(ref, page.href);
      if (!rel) continue;
      const url = new URL(rel, page);
      const res = await check(url, page.pathname);
      if (res.status !== 200) continue;
      if (url.pathname.endsWith('.css')) {
        for (const r of cssRefs(res.body)) {
          const relCss = classify(r, url.pathname);
          if (relCss) await check(new URL(relCss, url), url.pathname);
        }
      }
      if (url.pathname.endsWith('.js')) {
        for (const r of fetchRefs(res.body)) {
          const relJs = classify(r, `${url.pathname} fetch()`);
          if (relJs) await check(new URL(relJs, page), `${url.pathname} fetch()`);
        }
        for (const r of attrRefs(res.body)) {
          if (r.includes('${')) continue; // built at runtime from checked routes/links
          const relJs = classify(r, `${url.pathname} markup`);
          if (relJs) await check(new URL(relJs, page), `${url.pathname} markup`);
        }
      }
    }
  }

  // Every data file must be valid JSON.
  for (const [url, res] of checked) {
    if (res.status === 200 && url.endsWith('.json')) {
      try {
        JSON.parse(res.body);
      } catch (error) {
        failures.push(`invalid JSON: ${url} (${error.message})`);
      }
    }
  }

  console.log(`\nExternal links (not fetched): \n  ${[...external].sort().join('\n  ')}`);
  console.log(`\nChecked ${checked.size} local URLs.`);
  if (failures.length) {
    console.log(`\nFAILED (${failures.length}):\n  ${failures.join('\n  ')}`);
    process.exit(1);
  }
  console.log('OK: no missing files, no root-absolute paths.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
