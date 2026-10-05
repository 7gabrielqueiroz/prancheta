# PRANCHETA

Jogo de gerenciamento de futebol (multiplayer assíncrono, navegador). Tagline: "O jogo começa fora de campo."

## Regras que valem para qualquer trabalho de UI
- A identidade está em `docs/BRAND.md`; o sistema de componentes e padrões em `docs/DESIGN_SYSTEM.md`. São **regra**, não sugestão.
- Valores visuais (cor, tipo, espaço, raio, motion) vivem só em `design-tokens/tokens.json`. Gere os derivados com `node design-tokens/build.mjs`. Nunca escreva hex/px solto em componente.
- Fontes: Inter (UI), Sora (títulos/marca), JetBrains Mono (placar, xG, valores ao vivo). Ícones: Lucide. Sem emoji permanente.
- Escuro por padrão; verde só para ação/seleção/positivo. Sem card dentro de card; sombra só em camadas flutuantes.
- Cor nunca é o único sinal; nada depende só de hover; tudo por teclado.
- Não reaproveitar a identidade antiga (pixel art, Silkscreen, sprites).

## Contexto do projeto
- `reference/` = código do jogo de origem ("Treineiros", do próprio autor), extraído de um HAR. **Somente referência.** Contém regras de jogo, motor de partida e dados. O jogo é privado; manter jogadores e clubes originais é decisão do dono.
- `reference/serve-ref.mjs` sobe o original localmente em http://localhost:5180 (offline, sem backend).
- Não usar nem gravar a URL/chave do Supabase do original em código novo.
- Logo definida: `brand/logo-board.webp` (prancheta em forma de P) e regras em `docs/BRAND.md` §3. Toda tela nova usa essa logo. Faltam os vetores (SVG); NÃO redesenhar à mão.
- Fase 1 (concluída, `docs/PHASE1.md`): `app/` = Vite + motor em ES modules + golden master (`cd app && npm test`).
- `app/src/engine/` é FONTE desde a Fase 2 (edite ali; o conversor do motor está travado). `app/src/net/netcore.js` e `app/src/ui/` ainda são gerados por `npm run convert`.
- Mudança no motor tem de manter o golden idêntico, ou regenerá-lo conscientemente e dizer por quê.
- Fase 2 (em andamento, `docs/PHASE2.md`): `supabase/migrations/` (esquema + RLS, já aplicadas no projeto Supabase `plakfjhvtlgkyiqnfdpz`) e `server/` (Store, tick, worker, comandos). Testes: `cd server && npm test` (74, PGlite, ~2,5 min). Comandos prontos: liga, clube, tática, mercado e finanças. Próximo: treino, carreira e ADM; rodar o worker no banco real; Auth e cliente.
- Migration nova: criar o arquivo em `supabase/migrations/`, passar nos testes locais e só então aplicar no projeto real (o conteúdo aplicado tem de ser idêntico ao arquivo).
- Comando novo: handler em `server/src/commands/` (liga e tática em `handlers.js`, mercado em `market.js`); validar TODO o payload com os validadores de `common.js` antes de chamar o motor (ele confia em ids, valores e quantidades); chamar a função do motor via `asMe`/`Wd.asDesk` + teste de caminho feliz e de recusa em `server/tests/commands.test.js`.
- O cliente nunca grava estado de jogo: só envia linhas em `commands`. Segredos (`msalt`) ficam em `league_secrets` e nunca vão ao cliente.
- O motor tem estado global por processo: em testes, use `freshRuntime(vi)` (server/tests/helpers.js) e não importe `src/` estaticamente.
- O SQL do Supabase original NÃO existe aqui; o backend é desenho novo. A UI nova (docs/DESIGN_SYSTEM.md) vem depois do backend.
