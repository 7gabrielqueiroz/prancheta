# Fase 1 — mesma jogabilidade, base moderna

Status: **concluída** (com ressalvas abaixo). Objetivo: tirar o jogo de um HTML único de 3,4 MB e colocá-lo num projeto Vite com módulos ES, dados sob demanda e teste de regressão do motor, **sem mudar nenhuma regra de jogo**.

## O que existe
```
app/
  index.html                 casca mínima (2 KB)
  public/data/players.json   jogadores e clubes originais; carregado por fetch
  src/engine/                motor em módulos ES (core, world, match, season, train, market, events, sprites)
  src/net/netcore.js         núcleo da liga (sem DOM; reutilizável no servidor)
  src/ui/app.js              UI e liga legadas (substituídas pela interface PRANCHETA)
  src/ui/looks.js            mapa de aparência dos jogadores
  src/ui/assets/             imagens que estavam embutidas em base64
  tests/                     regressão do motor (golden master)
  tools/                     conversores e gerador do golden
```

## Como foi feito (e como repetir)
O código-fonte original não está disponível; tudo veio do HAR. Os conversores em `app/tools/` geram os módulos a partir de `reference/*.js` **sem reescrever lógica**:

- `convert-engine.mjs`: cada `const X = (() => {...})()` vira `export const X`. Dependência de módulo anterior vira `import`. Dependência de módulo posterior (usada só dentro de funções) é ligada por `__bind()` em `engine/index.js`, o que evita ciclos de avaliação.
- `convert-ui.mjs`: separa `NETCORE`, as imagens (data URI → arquivo), o mapa de aparência e o resto da UI. A UI continua com o escopo de função original (`await (async () => {...})()`), porque o original tem funções declaradas em duplicidade, o que é inválido no topo de um módulo ES.
- **Atualização (Fase 2):** `src/engine/` passou a ser fonte e o conversor do motor está travado. `npm run convert` regenera só `src/net/netcore.js` e `src/ui/`.
- `npm run convert` regenerava tudo. Edições manuais em `src/engine`, `src/net` e `src/ui` serão sobrescritas por ele. **Quando começar a evoluir o código à mão, remova o conversor do fluxo** e trate `src/` como fonte.

## Testes
```
cd app
npm test          # golden master do motor (~30 s)
npm run golden    # regenera o golden a partir do motor ORIGINAL (reference/)
npm run build
```
O golden roda 8 dias de temporada turbo (56 rodadas, 3 treinadores humanos, seed e relógio fixos) e compara o hash SHA-1 do estado inteiro da liga em 8 checkpoints. O motor modular produziu **hashes idênticos** aos do motor original. O golden é determinístico (duas execuções do original deram o mesmo arquivo).

Cobertura: calendário, partidas, mercado de IA, treino, notícias e eventos do servidor. **Não cobre a UI.** Não cobre mudar de temporada completa (só 8 dias) nem ações de humanos (compras, escalação, negociação).

## Resultado medido
| | Original | Agora |
|---|---:|---:|
| Arquivo principal | 3,44 MB HTML único (1,13 MB gzip) | `index.html` 2,4 KB |
| JS | inline | 1,13 MB (423 KB gzip), cache por hash |
| CSS | inline | 281 KB (115 KB gzip) |
| Dados de jogadores | inline | `players.json` 1,4 MB (361 KB gzip), fetch separado |

O ganho de peso é pequeno (~900 KB gzip no total contra 1,13 MB). O ganho real é **cache e manutenção**: dados, código e imagens passam a ter arquivos próprios.

## Ressalvas
1. **O jogo precisa de backend.** No original (e aqui, com o mesmo erro) o fluxo "Sortear meu clube" falha sem a liga online (`divList` recebe estado nulo). Não há modo offline funcional. Foi o que o HAR permitiu verificar: só a tela inicial e a criação do treinador foram exercitadas no navegador. O restante da UI não foi testado manualmente.
2. **O esquema SQL e as funções do Supabase original não estão no HAR** (só as respostas). A Fase 2 desenha o servidor do zero, guiada pelo contrato que o `netcore.js` revela (`league_commit`, `league_versions`, `league_world_get`, `chat_list`, `desk_claim`…).
3. A UI legada ainda mostra "Treineiros", pixel art e as fontes antigas. Isso será substituído pela interface PRANCHETA (`docs/DESIGN_SYSTEM.md`); não vale investir em refatorar `src/ui/app.js`.
4. O módulo `sprites` (pixel art) permanece no motor porque `EVENTS` o referencia. Sai junto com a UI antiga.
5. Dados reais (jogadores, clubes, fotos do Transfermarkt) ficam por decisão do dono; o jogo é privado.
