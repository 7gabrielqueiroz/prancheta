// Converte os scripts clássicos do motor (reference/*.js) em módulos ES, sem alterar a lógica.
// Dependência anterior (na ordem original de carga) -> import estático.
// Dependência posterior (usada só dentro de funções) -> variável ligada depois por __bind() (evita ciclo de avaliação).
import fs from 'node:fs';
if (!process.argv.includes('--force')) { console.error('src/engine agora é fonte (Fase 2). Rodar este conversor apaga edições manuais. Use --force só para recomeçar do zero.'); process.exit(1); } import * as acorn from 'acorn'; import * as walk from 'acorn-walk';
const ORDER = [['core', 'CORE'], ['world', 'WORLD'], ['match', 'SIM'], ['season', 'SEASON'], ['train', 'TRAIN'], ['market', 'MARKET'], ['events', 'EVENTS'], ['sprites', 'SPR']];
const NAMES = ORDER.map(o => o[1]);
fs.mkdirSync(new URL('../src/engine/', import.meta.url), { recursive: true });
const graph = {};
ORDER.forEach(([file, name], idx) => {
  const src = fs.readFileSync(new URL(`../../reference/${file}.js`, import.meta.url), 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' });
  const used = new Set();
  walk.simple(ast, { Identifier(n) { if (NAMES.includes(n.name) && n.name !== name) used.add(n.name); } });
  const before = [], after = [];
  for (const u of used) (NAMES.indexOf(u) < idx ? before : after).push(u);
  graph[name] = { before, after };
  const fileOf = nm => ORDER[NAMES.indexOf(nm)][0];
  let head = `// Gerado por tools/convert-engine.mjs a partir de reference/${file}.js. Lógica inalterada.\n`;
  for (const b of before) head += `import { ${b} } from './${fileOf(b)}.js';\n`;
  if (after.length) head += `let ${after.join(', ')};\nexport const __bind = d => { ${after.map(a => `${a} = d.${a};`).join(' ')} };\n`;
  const body = src.replace(new RegExp(`^const ${name} = `, 'm'), `export const ${name} = `);
  fs.writeFileSync(new URL(`../src/engine/${file}.js`, import.meta.url), head + body);
});
const idx = `// Ponto de entrada do motor. Liga as dependências posteriores (ver convert-engine.mjs).
${ORDER.map(([f, n]) => `import * as ${f}_m from './${f}.js';`).join('\n')}
${ORDER.map(([f, n]) => `export const ${n} = ${f}_m.${n};`).join('\n')}
const deps = { ${NAMES.join(', ')} };
${ORDER.filter(([f, n]) => graph[n].after.length).map(([f]) => `${f}_m.__bind(deps);`).join('\n')}
`;
fs.writeFileSync(new URL('../src/engine/index.js', import.meta.url), idx);
console.log(JSON.stringify(graph, null, 1));
