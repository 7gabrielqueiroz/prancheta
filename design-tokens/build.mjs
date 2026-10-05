// Gera tokens.css e tokens.ts a partir de tokens.json. Uso: node design-tokens/build.mjs
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const src = JSON.parse(fs.readFileSync(new URL('tokens.json', dir), 'utf8'));
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const flat = [];
(function walk(node, path) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && 'value' in v) flat.push({ path: [...path, k], value: v.value });
    else walk(v, [...path, k]);
  }
})(src, []);

const cssVar = p => '--' + p.map(kebab).join('-');
const css = [
  '/* GERADO por design-tokens/build.mjs a partir de tokens.json. Não edite. */',
  ':root {',
  '  color-scheme: dark;',
  ...flat.map(t => `  ${cssVar(t.path)}: ${t.value};`),
  '}',
  '',
  '@media (prefers-reduced-motion: reduce) {',
  '  :root {',
  '    --motion-duration-instant: 0ms;',
  '    --motion-duration-fast: 0ms;',
  '    --motion-duration-base: 0ms;',
  '    --motion-duration-slow: 0ms;',
  '  }',
  '}',
  ''
].join('\n');
fs.writeFileSync(new URL('tokens.css', dir), css);

const strip = n => {
  const o = {};
  for (const [k, v] of Object.entries(n)) {
    if (k.startsWith('$')) continue;
    o[k] = v && typeof v === 'object' && 'value' in v ? v.value : strip(v);
  }
  return o;
};
const ts = `// GERADO por design-tokens/build.mjs a partir de tokens.json. Não edite.
export const tokens = ${JSON.stringify(strip(src), null, 2)} as const;
export type Tokens = typeof tokens;
`;
fs.writeFileSync(new URL('tokens.ts', dir), ts);
console.log(`${flat.length} tokens -> tokens.css, tokens.ts`);
