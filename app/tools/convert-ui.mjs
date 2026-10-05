// Quebra reference/netcore.js (IIFE de 8.800 linhas) em módulos ES, sem alterar a lógica:
//   src/net/netcore.js   núcleo da liga (sem DOM; reutilizável no servidor)
//   src/ui/assets/*      imagens que estavam embutidas como data URI
//   src/ui/looks.js      mapa de aparência dos jogadores
//   src/ui/app.js        o resto da UI/liga legada (escopo compartilhado preservado)
import fs from 'node:fs'; import * as acorn from 'acorn'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = p => fileURLToPath(new URL(p, import.meta.url));
const src = fs.readFileSync(here('../../reference/netcore.js'), 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' });
const body = ast.body[0].expression.callee.body.body;
const cut = []; // [start,end,replacement]
const text = n => src.slice(n.start, n.end);
const out = (p, s) => { fs.mkdirSync(path.dirname(here(p)), { recursive: true }); fs.writeFileSync(here(p), s); };

// 1) NETCORE
const nc = body.find(s => s.type === 'VariableDeclaration' && s.declarations[0].id.name === 'NETCORE');
out('../src/net/netcore.js', `// Gerado por tools/convert-ui.mjs a partir de reference/netcore.js. Lógica inalterada.
import { WORLD, SEASON, EVENTS } from '../engine/index.js';
${text(nc).replace(/^const NETCORE =/, 'export const NETCORE =')}
`);
cut.push([nc.start, nc.end, '']);

// 2) data URIs -> arquivos
const assetImports = [];
const ASSETS = { LOGO_URI: 'logo-legacy', TSPN_URI: 'tspn', ZETV_URI: 'zetv', FAB_IMG: 'fab', CHANCE_LOGO: 'chance-logo' };
for (const s of body) {
  if (s.type !== 'VariableDeclaration' || s.declarations.length !== 1) continue;
  const d = s.declarations[0], name = d.id.name;
  if (!(name in ASSETS) || !d.init || d.init.type !== 'Literal') continue;
  const m = /^data:image\/(\w+);base64,(.*)$/s.exec(d.init.value); if (!m) continue;
  const file = `${ASSETS[name]}.${m[1]}`;
  fs.mkdirSync(here('../src/ui/assets/'), { recursive: true });
  fs.writeFileSync(here('../src/ui/assets/' + file), Buffer.from(m[2], 'base64'));
  assetImports.push(`import ${name} from './assets/${file}?url';`);
  cut.push([s.start, s.end, '']);
}

// 3) mapa de aparência (IIFE anônima enorme)
const looks = body.find(s => s.type === 'ExpressionStatement' && s.end - s.start > 30000);
if (looks) {
  out('../src/ui/looks.js', `// Gerado por tools/convert-ui.mjs. Aparência medida nas fotos (pele/cabelo). Lógica inalterada.\nimport { SPR } from '../engine/index.js';\n${text(looks)}\n`);
  cut.push([looks.start, looks.end, '']); assetImports.push("import './looks.js';");
}

// 4) resto = app.js
let rest = src.slice(body[0].start, body.at(-1).end);
const base = body[0].start;
cut.sort((a, b) => b[0] - a[0]);
for (const [a, b, r] of cut) rest = rest.slice(0, a - base) + r + rest.slice(b - base);
const RAW_LINE = "const RAW = JSON.parse(document.getElementById('data').textContent);";
if (!rest.includes(RAW_LINE)) throw new Error('RAW line not found');
rest = rest.replace(RAW_LINE, "const RAW = await (await fetch(import.meta.env.BASE_URL + 'data/players.json')).json();");
const header = `// Gerado por tools/convert-ui.mjs a partir de reference/netcore.js. Lógica inalterada.
// UI legada: será substituída pela interface PRANCHETA (docs/DESIGN_SYSTEM.md).
import { CORE, WORLD, SIM, SEASON, TRAIN, MARKET, EVENTS, SPR } from '../engine/index.js';
import { NETCORE } from '../net/netcore.js';
${assetImports.join('\n')}
`;
out('../src/ui/app.js', header + '// Escopo de função preservado: o original tem declarações de função duplicadas, inválidas no topo de um módulo.\nawait (async () => {\n' + rest + '\n})();\n');
console.log('ok', { nc: nc.end - nc.start, assets: assetImports.length, looks: looks ? looks.end - looks.start : 0, app: rest.length });
