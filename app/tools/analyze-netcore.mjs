import fs from 'node:fs'; import * as acorn from 'acorn'; import * as walk from 'acorn-walk';
const src = fs.readFileSync(new URL('../../reference/netcore.js', import.meta.url), 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', locations: true, onComment: [] });
const top = ast.body; console.log('top-level:', top.map(s => s.type).join(','));
const iife = top[0].expression.callee.body.body;   // corpo do IIFE
console.log('statements in iife:', iife.length);
// seções por marcador "// =====" nas linhas
const lines = src.split('\n');
const marks = []; lines.forEach((l, i) => { if (/^\/\/ =====/.test(l)) marks.push(i + 1); });
console.log('markers', marks.length);
const kinds = {}; for (const s of iife) kinds[s.type] = (kinds[s.type] || 0) + 1; console.log(kinds);
const decl = new Map(); // name -> {kind, line}
for (const s of iife) {
  if (s.type === 'VariableDeclaration') for (const d of s.declarations) { const names = []; walk.simple(d.id, { Identifier(n) { names.push(n.name); } }); for (const n of names) decl.set(n, { kind: s.kind, line: s.loc.start.line }); }
  else if (s.type === 'FunctionDeclaration') decl.set(s.id.name, { kind: 'function', line: s.loc.start.line });
}
console.log('decls', decl.size, 'let:', [...decl].filter(([, v]) => v.kind === 'let').map(([k, v]) => k + '@' + v.line).join(' '));
// top-level statements que não são declarações (efeitos)
console.log('effects:', iife.filter(s => !['VariableDeclaration', 'FunctionDeclaration'].includes(s.type)).map(s => s.type + '@' + s.loc.start.line).slice(0, 60).join(' '));
