# PRANCHETA — o que falta para concluir

Tamanho: **P** (dias) · **M** (1–2 semanas) · **G** (várias semanas) · **GG** (um mês ou mais). São ordens de grandeza para uma pessoa focada, não promessas.

## Estado atual
- Marca, design system e tokens: **feitos** (`docs/BRAND.md`, `docs/DESIGN_SYSTEM.md`, `design-tokens/`).
- Fase 1 (base moderna + golden master do motor): **feita**.
- Fase 2 (servidor autoritativo): **em andamento**; esquema com RLS aplicado no Supabase real, Store, tick, worker e comandos de liga, clube, tática, mercado e finanças, com 74 testes. Faltam treino, carreira, ADM, rodar o worker no banco real, Auth e o cliente.
- Logo: **definida** (`brand/logo-board.webp`, regras em `docs/BRAND.md` §3). Faltam os arquivos vetoriais.
- Interface PRANCHETA: **não começou**. Existe só a UI legada, que não funciona sem backend.

## A. Backend e multiplayer (Fase 2) — G
| Item | Tam. |
|---|---|
| ~~Esquema SQL + RLS + testes de política~~ **feito** (falta validar no Supabase real) | M |
| ~~Store Postgres com paridade ao original~~ **feito** | P |
| Auth (substitui token + segredo por mesa) | P |
| Camada de comandos: infraestrutura, liga, clube, tática, **mercado e finanças feitos**; faltam treino, carreira, ADM, coletivas | G |
| Worker com lease e idempotência **feito** (não rodou no banco real); faltam health check e isolamento do motor por liga | M |
| Chat da liga, notificações, bug report | M |
| Criar e gerir liga: convites, ADM, vagas, pausa, expulsão | M |
| Backup, export e importação da liga atual | P |

## B. Interface PRANCHETA — GG
| Tela / entrega | Tam. |
|---|---|
| Design system em código (24 componentes, estados, acessibilidade) | G |
| Login/entrada, criação do treinador, sorteio de clube | M |
| Visão Geral ("mesa do treinador") | M |
| Elenco + ficha do jogador | M |
| **Tática** (campo, formação, estilo, gatilhos), tela-assinatura | G |
| Treinamento e base | M |
| **Mercado** (filtros, tabela, negociação, propostas, empréstimos, pré-contrato) | G |
| Calendário e Classificação (várias competições) | M |
| **Partida** (placar, linha do tempo, escalações, estatísticas, notas) | G |
| Finanças e Diretoria | M |
| Notícias | M |
| Liga: convites, ADM, chat | M |
| Responsivo tablet/mobile + PWA | G |

## C. Funcionalidades legadas — decisão: **todas entram**
Decisão do dono em 05/10/2026. Nada será cortado; a ordem de entrega é que muda (ver "Marcos").

A lógica (regras, eventos, mercado, calendário) **já existe e está testada** em `app/src/engine/`. O que precisa ser refeito é a **interface** (e a ligação com o servidor), no visual PRANCHETA. Linhas do `reference/netcore.js` por funcionalidade, como medida de volume de UI a portar:

| Funcionalidade | Linhas de UI legada | Tam. |
|---|---:|---|
| Base: componentes, perfil do jogador, negociação | 327 | M |
| Telas: início, clube, elenco, mercado | 602 | G |
| Torneios, notícias, modais, jogo ao vivo, ações | 1.338 | GG |
| Entrada, criação do treinador, sorteio do clube, liga online | 416 | M |
| Clubes adversários, ficha da partida, escalações no campinho, alertas | 201 | M |
| **Partida em 2D** (campo visto de cima, estilo FM) | 685 | GG |
| DM, ficha do treinador, escalações em lista, banco manual, filtros, notificações | 564 | G |
| **Coletivas** pré e pós-jogo (+ banco v2 + revisão v191: perguntas × respostas) | 749 + 499 + 260 | GG |
| **Três jornais** (O Treineiro, Inteira-Hora, CHANCE) | 484 | G |
| Fim de temporada, premiação, arquivo, perfil permanente | 214 | M |
| Card principal = agenda navegável, histórico de transferências | 639 | G |
| **Sorteio ao vivo das copas** | 358 | M |
| **Sorteio da Copa do Brasil** (transmissão "Seu Zé TV") | 127 | P |
| Chat da liga ("Zona mista") | 118 | M |
| Liga online (cliente: sincronização, convites, ADM) | 693 | substituído pela Fase 2 |
| Ícones e sons | 133 | P |

Lógica de domínio que alimenta isso (já portada e coberta pelo golden): `season.js` 2.330 linhas, `market.js` 1.385, `events.js` 1.179, `world.js` 589, `core.js` 444, `match.js` 350, `train.js` 173.

Pontos de atenção por ser "tudo":
- **Coletivas e jornais** têm texto escrito à mão em grande volume (milhares de linhas de frases). Isso migra como **dado** (arquivo de conteúdo), não como código, e o tom precisa ser revisado contra `docs/BRAND.md` ("direto e esportivo"). O humor dos jornais é do jogo original; **decida se o tom fica ou muda** na identidade nova.
- **Partida em 2D** é a maior peça isolada. A identidade pede o "mapa tático" como evolução futura; reaproveitar o 2D como visão opcional da tela de Partida é o caminho natural.
- **Sorteios ao vivo** são encenações do que o motor já decidiu; dependem só de dados do servidor.
- Tudo precisa seguir o design system (sem pixel art, sem emoji permanente, acessível por teclado).

### Marcos de entrega (ordem recomendada)
1. **MVP jogável** (caminho mínimo abaixo): servidor + Visão Geral, Elenco, Tática, Mercado, Partida, Classificação.
2. **Competições completas**: calendário/agenda, copas, continentais, sorteios ao vivo.
3. **Carreira**: fim de temporada, premiação, arquivo, perfil, demissões e propostas de emprego.
4. **Social**: chat, DM, ficha do treinador, notificações, jornais.
5. **Imprensa**: coletivas pré e pós-jogo.
6. **Partida em 2D** como visão opcional.
Cada marco é jogável e testável sozinho; nenhuma funcionalidade fica de fora, só chega depois.

## D. Identidade e assets — M
- Logo **definida**; faltam os **arquivos-fonte em SVG** (símbolo, horizontal, empilhada, mono) e PNG 512/192 do ícone.
- Ícones de PWA, favicon, imagem de compartilhamento.
- Trocar sprites/pixel art e textos "Treineiros" por visual e texto PRANCHETA.
- Escudos e fotos: o original usa dados do Transfermarkt. Como o jogo é privado, manter é decisão sua. O HAR traz o mapa de aparência dos jogadores, não as fotos; se forem usadas, faltam os arquivos.

## E. Qualidade — G
- Golden master estendido: **temporada completa** e **ações humanas** (compra, escalação, negociação).
- Testes de componentes e e2e (Playwright) nos fluxos críticos.
- Teste de carga do tick (liga de 60 treinadores).
- Revisão de segurança antes de abrir para amigos (RLS, comandos, segredos).
- Acessibilidade (teclado, contraste, leitor de tela) em cada tela.

## F. Operação — P/M
Hospedagem do front e do worker, domínio, variáveis de ambiente, monitoramento, alertas, backup do banco, plano de migração de liga em andamento.

## Caminho mínimo para jogar com amigos (MVP)
1. Backend (A) sem chat e sem notificações.
2. Login → clube → Visão Geral → Elenco → Tática → Mercado → Partida → Classificação.
3. Tick no servidor, 1 liga, 1 divisão, convite por código.
4. O resto (jornais, coletivas, 2D, copas ao vivo, fama) entra depois, um por vez.

## Modelo e esforço recomendados por tipo de tarefa
Recomendação minha, pela natureza da tarefa. Não medi desempenho entre modelos.

| Tarefa | Modelo | Esforço |
|---|---|---|
| Esquema SQL, RLS, modelo de segurança, concorrência do tick | Opus 5.5 (Fable 5.1 se travar) | alto |
| Store Postgres, comandos, API, worker | Sonnet 5.5 | médio |
| Símbolo do logo (SVG) e identidade visual | Fable 5.1 | alto |
| Telas-assinatura (Tática, Partida) e design system | Sonnet 5.5 (skill de frontend) | alto |
| Demais telas a partir do design system | Sonnet 5.5 | médio |
| Revisão de segurança antes de abrir para outras pessoas | Opus 5.5 | muito alto |
| Testes, docs, renomeações, conversões mecânicas | Haiku 4.5 ou Sonnet 5.5 | baixo |
