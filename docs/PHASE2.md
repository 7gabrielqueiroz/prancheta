# Fase 2 — servidor como única autoridade

Status: **em andamento**. Feito: esquema SQL com RLS aplicado no projeto Supabase, armazenamento em Postgres, tick, worker, comandos de liga, tática e **mercado/finanças**, com 74 testes. Falta: comandos de treino, carreira e ADM, rodar o worker contra o banco real, Auth e o cliente.

## Projeto Supabase
- Ref `plakfjhvtlgkyiqnfdpz`, região `us-west-2`, Postgres 17. Criado em 05/10/2026, só para a PRANCHETA.
- Migrations aplicadas: `init`, `private_helpers`, `commit_with_commands` (as três de `supabase/migrations/`).
- Verificador de segurança do Supabase: sem alertas; só dois avisos informativos esperados (`league_secrets` e `tick_log` têm RLS ligado e nenhuma política, de propósito).
- **Região:** `us-west-2` fica longe do Brasil. Para um jogo assíncrono a latência não é problema; se incomodar, a troca de região exige recriar o projeto (enquanto está vazio é barato).

## Problemas do original que esta fase resolve
1. **Cliente como autoridade.** O navegador edita o estado da liga e envia diff + merge de 3 vias (`league_commit`). Se o servidor cai, um celular "vira líder" e simula partidas. O código tem reparos para os efeitos disso (compras desfeitas, `lossCheck`, `fixYn285`).
2. **Resultado previsível.** A semente de cada partida é `hash(S.seed | temporada | rodada | ...)` e `S.seed` vai para todos os clientes. Quem tem o mundo consegue simular a própria partida antes da hora e escolher a melhor escalação.
3. **Tudo visível para todos.** O cliente baixa a mesa de todos os treinadores (tática, negociações, finanças).
4. **Sem identidade real.** Token + segredo por mesa em vez de login.
5. **Escolha de clube sem conferência.** `claimClub` aceitava um clube escolhido mesmo em liga de sorteio; só a interface impedia.

## Princípio
**O cliente nunca grava estado de jogo. Ele lê o que as políticas permitem e envia comandos; só o worker executa o motor e grava.**

## Modelo de dados (híbrido)
O motor muta um objeto `S` de 1 a 1,6 MB em centenas de pontos. Normalizar o mundo inteiro exigiria reescrever o motor e perderia os testes de regressão. Então:

| Dado | Onde | Quem lê |
|---|---|---|
| Usuários, ligas, membros, convites | tabelas relacionais | membros da liga (convites: só o ADM) |
| Mundo da liga | `league_worlds.data` (texto JSON, versão) | membros da liga |
| Mesa do treinador | `league_desks` (uma linha por treinador, versão própria) | **só o dono** |
| Segredos (`msalt`) | `league_secrets` | **ninguém** (só o servidor) |
| Comandos | `commands` (fila, idempotente, auditável) | só quem enviou |
| Chat, bug report | tabelas próprias | membros / o autor |
| Operação (lease, erros, log de tick) | colunas de `leagues` sem grant, `tick_log` | ninguém |

`text` e não `jsonb` para o estado: `jsonb` reordena chaves, e o motor itera objetos na ordem de inserção. Há teste que confere que o texto volta byte a byte.

As funções que as políticas usam (`is_member`, `my_desk_key`, `is_league_admin`, `shares_league_with`) ficam no esquema `private`, fora da API.

## Segredo de partida (`msalt`)
`S.seed` continua no mundo (o cliente usa para tabelas e sorteios). A semente das partidas passa a ser `hash(msalt | seed | ...)`, e `msalt` fica em `league_secrets`. O Store tira o segredo do mundo ao gravar e o devolve ao carregar ([league-state.js](../server/src/league-state.js)).

- Única alteração de regra no motor até aqui (3 linhas em [season.js](../app/src/engine/season.js)). Sem `msalt` o resultado é idêntico ao do original; o golden do motor continua passando.
- `app/src/engine/` é **fonte** desde então; o conversor do motor ficou travado (`--force`).
- Limite conhecido: sorteios de copas e tabela de jogos ainda derivam de `S.seed`; um cliente pode conhecer um sorteio antes da "transmissão ao vivo". Não dá vantagem esportiva.

## Comandos
O cliente insere uma linha em `commands` (`id` gerado por ele = idempotência) e acompanha o `status` dela. O banco garante: só membro envia para a liga; ninguém escolhe status, resultado ou usuário; no máximo 30 pendentes por usuário.

### Como o worker processa ([worker.js](../server/src/worker.js))
1. **Sem liga** (`league.create`, `league.join`): fora do lease, idempotentes.
2. **Por liga**: pega o lease → carrega → aplica os comandos pendentes em ordem → avança o relógio do motor → **um único commit** que grava mundo, mesas, membros novos **e conclui os comandos**.
   - Comando recusado (`Reject`) ou que quebra no meio: o estado volta ao último ponto bom; os comandos seguintes continuam.
   - Commit recusado (versão, lease perdido, comando já concluído por outro): nada é gravado e os comandos continuam pendentes.
   - Cada comando marca a presença do treinador (`desks.*.seen`), que o motor usa na regra de inatividade.

### Comandos implementados
| Comando | O que faz | Validações |
|---|---|---|
| `league.create` | Cria mundo, segredo e o vínculo do criador como ADM. A liga nasce com `id` = `id` do comando. | nome, modo, divisões; 3 ligas novas por usuário a cada 24 h |
| `league.join` | Entra pelo código (só o vínculo). | código, liga ativa, não removido |
| `club.claim` | Sorteio, escolha ou código de vaga; cria a mesa. Porta de `claimClub`/`joinAs`. | liga cheia; **escolha só em liga de escolha**; vaga válida; nome e estilo |
| `tactics.set` | Formação, estilo, escalação, banco, cobrador, capitão, gatilhos. Só muda o que foi enviado. | formação/estilo existentes; jogadores do próprio elenco; sem repetidos; titular fora do banco |
| `desk.seen` | Sinal de presença. | ter mesa |

#### Mercado e finanças ([market.js](../server/src/commands/market.js))
Todos exigem mesa com clube (espectador, sem clube ou demitido são recusados) e validam o payload antes de o motor ver qualquer valor (`common.js`): ids de jogador existentes, dinheiro finito, não negativo e com teto, anos de contrato de 1 a 5, quantidades inteiras ≥ 1.

| Comando | Função do motor | Observações |
|---|---|---|
| `market.bid` | `MK.bid` | Proposta por jogador; clube da IA responde na hora, clube de treinador recebe na mesa dele; `swap` = jogador seu na troca |
| `market.contract` | `MK.contract` | Exige taxa acertada (ou jogador livre); `pre` = pré-contrato. Com a janela fechada vira acordo pendente e a taxa sai do caixa |
| `market.negDrop` | `MK.negDrop` | Desiste do acordo de taxa |
| `market.renew` / `release` | `MK.renew` / `MK.release` | |
| `market.setListing` | `MK.setListing` | Lista de transferência ou de empréstimo (`6m` ou `1t`) |
| `market.acceptOffer` / `declineOffer` / `counterOffer` / `respondCounter` | idem | Propostas recebidas, da IA ou de outro treinador |
| `market.requestLoan` / `buyOption` / `recallLoan` | idem | Empréstimos |
| `market.takePack` / `skipPack` | idem | Pacote do dia |
| `market.cashOut` / `starsToDia` | idem | Estrelas e diamantes |
| `finance.wageBudget` | `MK.budget` | Teto salarial, limitado pela folha e pelo caixa |

**Convenção de resultado:** o comando termina `done` com `result.outcome` = resposta do motor (`{ status | ok, msg, ... }`). Uma recusa do motor ("o clube não vende por isso") é resposta de jogo, não erro de pedido: pode ter mudado estado (a contagem de três recusas) e o cliente a mostra ao usuário. Só pedido inválido vira `rejected`.

**Negociação entre treinadores** mexe em duas mesas (proposta na mesa do vendedor; aceite move jogador e dinheiro). Roda dentro do mesmo commit, e o teste confere que o caixa só muda de mãos e que as versões das duas mesas sobem juntas.

**A interface antiga tinha um "portão do mundo fresco"** (`gate()`: buscar o mundo atualizado antes de agir) para contornar estado velho no navegador. Com o servidor como autoridade ele não existe mais.

### Como escrever um comando novo ([handlers.js](../server/src/commands/handlers.js))
```js
'market.bid'(ctx) {
  const key = deskOf(ctx);                       // recusa se o usuário não tem mesa
  need(/* regra */, 'codigo', 'Mensagem para o usuário.');
  return Wd.asDesk(ctx.S, key, () => MK.bid(ctx.S, ...));   // a mesma função do motor que a UI antiga chamava
}
```
Regras: validar **tudo** que vem do `payload` (o cliente é hostil); nunca confiar em id de jogador, clube ou valor sem conferir contra `S`; a função do motor decide a regra de jogo, o handler decide se o pedido é legítimo. Cada comando novo ganha teste de caminho feliz e de recusa.

### Faltam
Treino e base, carreira (demissão, vagas, propostas de emprego), ADM (vaga, expulsar, pausar, transferir, avançar), coletivas, DM e moderação do chat (o chat já tem tabela e política).

**Mercado sem teste de caminho feliz:** `requestLoan`, `buyOption`, `recallLoan` (só a validação é testada; precisam de um jogador listado para empréstimo) e `market.contract` com `pre: true` (pré-contrato).

## Tick
[tick.js](../server/src/tick.js) `advance(S)`: `dupClubFix`, `idleTick`, `admTick` e `SEASON.process` enquanto houver pendência. No banco: `leagues_with_work` (tick vencido ou comando pendente), `acquire_league_lease` / `release_league_lease` (uma execução por liga; com erro a liga sai da fila por 3 minutos), `commit_league`.

Não existe eleição de líder no cliente. Se o worker cair, o jogo **pausa**.

## Rodar o worker
```
cd server
cp .env.example .env      # preencher DATABASE_URL com a string de conexão do Supabase
npm start
```
[main.js](../server/src/main.js) faz uma volta a cada 5 s e acorda quando chega comando (`LISTEN`). **Ainda não foi executado contra o banco real** (falta a string de conexão, que é segredo e não deve ser colada no chat).

## Testes (`cd server && npm test`)
74 testes num Postgres de verdade em memória (PGlite), com um arremedo mínimo do ambiente Supabase ([supabase-shim.sql](../server/tests/supabase-shim.sql)).

- **Políticas** ([rls.test.js](../server/tests/rls.test.js), 31): anon não lê nada; não-membro não vê liga, mundo nem membros; cada treinador lê só a própria mesa; segredos e colunas de operação inacessíveis; membro removido perde acesso; 12 escritas diretas negadas; funções do servidor não executáveis pelo cliente; regras de comando, chat e perfil; versões, lease e fila. O teste falha quando a política de mesa é enfraquecida de propósito.
- **Paridade com o original** ([store.test.js](../server/tests/store.test.js), 6): o oráculo é o tick de servidor do jogo original (`NETCORE.tickOne`, código inalterado). O que o nosso tick **grava** é igual **byte a byte**: 3 dias no `MemoryStore`, 2 dias no `PgStore`. Mais: `msalt` muda os resultados, é reprodutível e não aparece em nada que o cliente lê.
- **Mercado** ([market.test.js](../server/tests/market.test.js), 26): duas mesas humanas e um membro sem clube. 43 pedidos inválidos (todos recusados, jogo idêntico byte a byte depois); `cashOut` negativo; contratar livre; proposta e contrato com a IA, incluindo as 3 recusas; negociação entre treinadores (proposta, contraproposta, aceite, recusa) com conservação do caixa; vender e contrapropor à IA; renovar, dispensar, listar; pacote, estrelas, diamante, teto salarial; janela fechada com acordo pendente. Conferido por sabotagem: afrouxar a validação de `cashOut` derruba os testes certos.
- **Comandos** ([commands.test.js](../server/tests/commands.test.js), 13): ponta a ponta. O cliente insere como usuário autenticado (passando pelo RLS), o worker processa com o motor real, o cliente lê pelo RLS. Cobre criar liga, repetição após queda, entrar, sortear clube, tática válida e 9 recusas, comando que quebra no meio, lease de outro worker, comando já concluído, relógio andando junto, limite de ligas.

### Conferido no projeto real
Um teste de fumaça de 22 pontos, dentro de um bloco que desfaz tudo: membro lê mundo e só a própria mesa; segredos, colunas de operação, escrita direta e funções do servidor negados; comando e chat aceitos; não-membro não vê nada e não envia comando; anon negado em tudo. Nenhum dado ficou gravado.

### O que os testes não cobrem
- A suíte completa contra o Supabase real (só o teste de fumaça). PostgREST, Auth e Realtime não foram exercitados.
- O worker em laço contra o banco real; carga (liga de 60); temporada completa pelo worker.
- Os comandos que faltam.

## Regras do motor que o cliente precisa respeitar
- **Inatividade:** o treinador que não age por 72 h (Turbo) ou 120 h (Normal), em tempo real, é demitido. O `desk.seen` de cada comando é o que conta. Os testes que avançam vários dias precisam enviar presença, senão a mesa vira "sem clube".
- **Janela de transferências:** aberta na pré-temporada até a rodada 16, fechada de 16 a 32, aberta de 32 a 40 e fechada depois. Fechada, negociar com a IA continua possível, mas o jogador só chega na abertura (acordo pendente).

## Descoberta: o motor tem estado global por processo
Duas execuções do mesmo cenário **no mesmo processo** dão resultados diferentes, inclusive com o tick original. O motor guarda estado global (banco de jogadores `P`, caches) que uma liga deixa para a seguinte. Com uma instância nova do motor por cenário, tudo é reprodutível (é assim que os testes rodam: `freshRuntime`).

Consequência: no worker, o resultado de uma liga pode depender de quais ligas o processo já processou. O original vive com isso em produção. **Não investigado ainda.** Opções: isolar cada liga em processo/thread próprio, ou localizar e eliminar o vazamento. Com uma liga só (o caso inicial) o problema não aparece.

## Próximos passos (ordem)
1. Rodar o worker contra o projeto real e criar a primeira liga de verdade.
2. Comandos de treino, carreira e ADM (um por vez, com teste); teste de caminho feliz de empréstimos e pré-contrato.
3. Auth (e-mail ou link mágico) e o cliente: login, leitura por RLS, envio de comandos, Realtime.
4. Decidir o isolamento do motor por liga.
5. Rodar a suíte de políticas inteira contra o projeto real antes de abrir para outras pessoas.
