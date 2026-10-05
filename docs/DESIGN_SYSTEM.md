# PRANCHETA — Design System

Regras de construção da interface. Complementa [BRAND.md](BRAND.md) (o *porquê*); este documento é o *como*.

**Status:** especificação. Nenhuma tela ou componente foi implementado ainda. Tudo aqui é contrato para o que será construído.

## Sumário
1. [Tokens](#1-tokens) · 2. [Espaçamento](#2-espaçamento) · 3. [Raio, borda e sombra](#3-raio-borda-e-sombra) · 4. [Tipografia](#4-tipografia) · 5. [Layout](#5-layout-da-aplicação) · 6. [Componentes](#6-componentes) · 7. [Estados](#7-estados) · 8. [Padrões de página](#8-padrões-de-página) · 9. [Acessibilidade](#9-acessibilidade) · 10. [Motion](#10-motion) · 11. [Responsivo](#11-comportamento-responsivo) · 12. [Dados e formatação](#12-dados-e-formatação) · 13. [Checklist](#13-checklist-de-revisão-de-tela)

---

## 1. Tokens

| Arquivo | Papel |
|---|---|
| `design-tokens/tokens.json` | **Fonte única.** Editar só aqui. |
| `design-tokens/tokens.css` | Variáveis CSS (`--color-surface`, `--space-4`…). Gerado. |
| `design-tokens/tokens.ts` | Objeto tipado `tokens` para JS/TS (canvas, gráficos, testes). Gerado. |
| `design-tokens/build.mjs` | `node design-tokens/build.mjs` regenera os dois acima. |

Regras:

- Interface **só** usa tokens. Nada de hex, px de espaçamento ou `font-family` escritos direto em componente.
- Em CSS: `var(--color-primary)`. Em TS: `tokens.color.primary`.
- Convenção de nome CSS: `--{grupo}-{subgrupo}-{nome}` em kebab-case (`--font-family-display`, `--layout-control-height-md`).
- Valores marcados `DERIVADO` em `tokens.json` foram acrescentados à paleta original e aguardam aprovação final (ver BRAND §4.2).

### 1.1 Cor — mapa semântico

| Necessidade | Token |
|---|---|
| Fundo da página | `--color-bg` |
| Painel / tabela / card | `--color-surface` |
| Camada sobre painel (drawer, modal, dropdown, hover de linha) | `--color-surface-elevated` |
| Divisor | `--color-border` |
| Limite de input/select/botão secundário | `--color-border-strong` |
| Ação principal, seleção | `--color-primary` (hover/ativo: `--color-primary-highlight`) |
| Texto em botão primário | `--color-on-primary` |
| Fundo de item selecionado / badge positivo | `--color-primary-muted` |
| Texto | `--color-text-primary`, `--color-text-secondary`, `--color-text-disabled` |
| Estado | `--color-success` / `warning` / `danger` / `info` e variantes `*-muted` |
| Foco | `--color-focus-ring` |
| Fundo atrás de modal | `--color-overlay` |

---

## 2. Espaçamento

Escala de **4 px**. Só use os degraus dos tokens.

| Token | px | Uso típico |
|---|---:|---|
| `--space-1` | 4 | Ícone ↔ texto, gap mínimo |
| `--space-2` | 8 | Gap entre elementos relacionados, padding de badge |
| `--space-3` | 12 | Padding interno de célula, gap em grupos |
| `--space-4` | 16 | Padding de card compacto, gap padrão |
| `--space-5` | 20 | — |
| `--space-6` | 24 | Padding de card/painel, gap entre seções internas |
| `--space-8` | 32 | Gap entre painéis |
| `--space-10` | 40 | Respiro de seção |
| `--space-12` | 48 | Margem de página larga |
| `--space-16` | 64 | Estados vazios, hero de login |

Regras: espaço agrupa. Elementos relacionados ficam a ≤ 12 px; blocos distintos a ≥ 24 px. Prefira espaço e contraste de superfície a linhas para separar.

---

## 3. Raio, borda e sombra

| Token | Valor | Onde |
|---|---:|---|
| `--radius-xs` | 4 px | Tag, badge pequeno |
| `--radius-sm` | 6 px | Botão, input, select, tab |
| `--radius-md` | 8 px | Botão grande, card compacto |
| `--radius-lg` | 12 px | Card, painel, modal, drawer |
| `--radius-full` | 999 px | Badge pílula, avatar, indicador de forma |

- Nada além de 12 px em contêineres. Sem cantos "de app infantil".
- Borda: `1px solid var(--color-border)` em painéis; `--color-border-strong` em controles interativos.
- **Sombra:** um único token, `--shadow-overlay`, **exclusivo** de camadas flutuantes (modal, drawer, dropdown, tooltip). Cards e painéis de página **não** têm sombra. Hierarquia vem de `surface` → `surface-elevated`, borda e espaço.

---

## 4. Tipografia

Famílias: `--font-family-ui` (Inter), `--font-family-display` (Sora), `--font-family-mono` (JetBrains Mono). Carregar com `font-display: swap` e subset latino + latino estendido; incluir fallback do sistema.

### 4.1 Escala (papéis)

| Papel | Família | Tamanho | Peso | Line-height | Notas |
|---|---|---:|---:|---|---|
| `score` | mono | 72 px (`--font-size-score`) | 700 | tight | Só placar da tela de partida |
| `display` | display | 48 px | 700 | tight | Login, hero |
| `h1` | display | 32 px | 700 | tight | Título de página |
| `h2` | display | 24 px | 600 | snug | Título de seção/painel |
| `h3` | ui | 20 px | 600 | snug | Subseção |
| `body-lg` | ui | 16 px | 400 | normal | Texto corrido, narração de eventos |
| `body` | ui | 14 px | 400 | normal | **Padrão** da interface e tabelas |
| `body-strong` | ui | 14 px | 600 | normal | Nome em linha de tabela |
| `caption` | ui | 12–13 px | 500 | snug | Legendas, metadados |
| `label` | ui | 12 px | 600 | snug | CAIXA ALTA, tracking `--font-tracking-caps` |
| `data` | mono | 14–20 px | 500–600 | tight | xG, posse, minuto, finanças em destaque |

### 4.2 Regras

- Títulos de página e nomes de clube em destaque usam **Sora**; todo o resto, **Inter**.
- Mono é para dado ao vivo ou comparável (placar, minuto, xG, valor em R$ em destaque). **Não** use mono em corpo de texto, menus, nem em colunas comuns de tabela.
- Colunas numéricas em tabela: Inter + `font-variant-numeric: tabular-nums`, alinhadas à direita.
- Rótulos de seção (`label`) em caixa alta com `--font-tracking-caps`; nunca em parágrafo.
- Corpo mínimo 14 px na interface densa; nunca abaixo de 12 px.

---

## 5. Layout da aplicação

### 5.1 Estrutura desktop

```
┌───────────────┬────────────────────────────────────────────────────┐
│  SIDEBAR      │  TOPBAR  (56 px)                                   │
│  248 px       │  Clube · Temporada · Rodada/data · Próxima partida │
│  (72 recolh.) │  · Notificações · Perfil                           │
│               ├────────────────────────────────────────────────────┤
│  PRANCHETA    │                                                    │
│  Visão Geral  │   ÁREA CENTRAL                                     │
│  Elenco       │   (conteúdo da página, máx. 1440 px)               │
│  Tática       │                                                    │
│  Treinamento  │                                                    │
│               │                                                    │
│  COMPETIÇÕES  │                                                    │
│  Calendário   │                                                    │
│  Classificação│                                                    │
│               │                                                    │
│  CLUBE        │                                                    │
│  Mercado      │                                                    │
│  Finanças     │                                                    │
│  Diretoria    │                                                    │
│               │                                                    │
│  MUNDO        │                                                    │
│  Notícias     │                                                    │
│               │                                                    │
│  CONFIGURAÇÕES│                                                    │
└───────────────┴────────────────────────────────────────────────────┘
```

- **Sidebar:** recolhível para 72 px (só ícones, com `Tooltip` e `aria-label`). O estado recolhido persiste por usuário. Item ativo: fundo `--color-primary-muted`, texto `--color-text-primary`, **barra vertical de 3 px em `--color-primary`** à esquerda (o estado não depende só de cor). Grupos com `label` (COMPETIÇÕES, CLUBE, MUNDO) em caixa alta.
- **Topbar:** clube atual (troca de clube quando houver mais de um), temporada, rodada/data do universo, **próxima partida** com contagem, notificações, perfil. Sempre visível.
- **Área central:** largura máxima `--layout-content-max-width`; padding `--space-6` (desktop). Grade de 12 colunas, gap `--space-6`.
- Navegação deve ser possível 100% por teclado; sidebar é uma `nav` com landmarks.

### 5.2 Ordem de leitura de qualquer tela

Toda tela responde, de cima para baixo e nesta ordem:

1. **O que está acontecendo?** (estado atual)
2. **Algo exige minha atenção?** (alertas, pendências)
3. **Qual é minha próxima decisão?** (ação primária)

Se um bloco não ajuda em nenhuma das três, ele é candidato a sair da tela.

---

## 6. Componentes

Catálogo oficial. Nenhum componente fora desta lista entra em tela sem ser antes especificado aqui.

Convenções: tamanho de controle `sm 32 / md 40 / lg 48 px` (`--layout-control-height-*`); alvo de toque mínimo 40 px.

### 6.1 Primitivos

| Componente | Descrição | Variantes | Regras |
|---|---|---|---|
| **Button** | Ação. | `primary` (verde sólido, `on-primary`), `secondary` (borda `border-strong`, fundo transparente), `ghost` (sem borda), `danger` | Raio `sm`/`md`. Rótulo = verbo. 1 `primary` por região. Estado *loading* mantém a largura. |
| **IconButton** | Ação só com ícone. | `secondary`, `ghost` | `aria-label` obrigatório. Alvo ≥ 40 px (32 px só em tabela densa, com área de clique ampliada). |
| **Input** | Texto/numérico. | `default`, `search`, `error` | Borda `border-strong`; foco anel `focus-ring`; label sempre visível (nada de placeholder como label); erro com texto + ícone, não só cor. |
| **Select** | Escolha única/múltipla. | `single`, `multi` | Navegação por teclado completa; opções agrupáveis. |
| **Tabs** | Alternar visões da mesma página. | `underline` (padrão), `segmented` | Ativa: texto primário + traço 2 px `primary`. Teclas ← → . |
| **Card** | Contêiner de bloco. | `default`, `interactive` | `surface`, borda `border`, raio `lg`, **sem sombra**. **Proibido card dentro de card**: subdivida com espaço, `border` ou título de seção. |
| **Badge** | Rótulo de status/posição/tag. | `neutral`, `success`, `warning`, `danger`, `info`, `primary` | Fundo `*-muted` + texto da cor + ícone opcional. Raio `xs` ou `full`. Sempre com texto (ex.: "Lesionado"), não só cor. |
| **Tooltip** | Dica curta. | — | Nunca carrega informação essencial. Aparece também no **foco** por teclado. Não existe só em hover. |
| **Progress** | Barra de progresso/condição. | `default`, `segmented` | Valor numérico sempre visível junto. Cor por faixa (ver §7.2) + ícone/seta em estado crítico. |

### 6.2 Sobreposições

| Componente | Descrição | Regras |
|---|---|---|
| **Modal** | Decisão que bloqueia a tela (confirmar venda, encerrar contrato). | Raio `lg`, `surface-elevated`, `shadow-overlay`, `overlay` atrás. Foco preso; `Esc` fecha; foco volta ao gatilho. **Use pouco.** Se o conteúdo for consultivo, prefira Drawer ou página. |
| **Drawer** | Painel lateral (ficha rápida do atleta, filtros, detalhes de proposta). | Direita, 420–560 px. Mantém contexto da tabela abaixo. Mesmas regras de foco do Modal. |
| **Dropdown** | Menu de ações. | `surface-elevated`, `shadow-overlay`, teclas ↑ ↓ Enter Esc. |
| **Notification** | Toast e item da central de notificações. | `info/success/warning/danger`; ícone + título curto + ação opcional; toast some em 6 s (pausa no foco/hover) e **sempre** fica registrado na central. |

### 6.3 Dados

| Componente | Descrição | Regras |
|---|---|---|
| **DataTable** | Tabela principal do produto. | Cabeçalho fixo, ordenação por clique/teclado (`aria-sort`), filtros rápidos acima, seleção de linha, comparação (marcar 2–4), abertura rápida (Drawer) ao clicar/Enter. Linha 44 px (`default`) ou 36 px (`compact`). Zebra **não**; hover em `surface-elevated`. Colunas numéricas à direita com `tabular-nums`. Coluna fixa do nome em rolagem horizontal. |
| **PlayerAvatar** | Foto/avatar do atleta. | Tamanhos 24/32/40/64/96; `radius-full`; fallback com iniciais sobre `surface-elevated`. |
| **ClubBadge** | Escudo do clube. | Tamanhos 16/24/32/48/64; fallback neutro com sigla. Não aplicar filtro de cor. |
| **PlayerRating** | OVR e notas de partida. | OVR: número grande (Sora/Inter 700). Nota de partida 0–10 com 1 casa em mono. Faixas por cor **e** por texto/ícone. |
| **FormIndicator** | Forma recente (últimos 5). | 5 marcas `V / E / D`; cada uma tem **letra** dentro (cor sozinha não basta). Mais recente à direita. |
| **StatComparison** | Duas equipes lado a lado (posse, xG, chutes…). | Valores em mono nas pontas, barra dividida ao centro, rótulo no meio. Lado do usuário em `primary`, adversário em `text-secondary`. |
| **Scoreboard** | Placar. | Ver §8.3. Mostra clubes (Sora), placar (mono, `--font-size-score`), minuto (mono), status. Anima só a mudança de gol. |
| **MatchEvent** | Item da linha do tempo. | Minuto (mono) · tipo (ícone + rótulo: GOL, CARTÃO, SUBSTITUIÇÃO…) · narração (`body-lg`). Entrada animada discreta. Gol tem destaque (`primary`), cartão usa ícone com forma distinta por cor. |

---

## 7. Estados

Todo componente interativo define **todos** os estados abaixo antes de ser aceito.

| Estado | Tratamento |
|---|---|
| **Default** | Conforme variante. |
| **Hover** | Mudança sutil de superfície/brilho. **Nunca** revela ação essencial: tudo que aparece no hover também existe no foco e em toque. |
| **Focus (teclado)** | Anel `2px solid --color-focus-ring` + offset 2 px. Sempre visível; nunca `outline: none` sem substituto. |
| **Active/pressed** | Escurece/realça levemente; sem salto de layout. |
| **Selected** | Fundo `--color-primary-muted` + marcador (barra, check ou borda `primary`). |
| **Disabled** | `--color-text-disabled`, sem hover, `aria-disabled`; explique o motivo quando possível ("Mercado fechado"). |
| **Loading** | Skeleton para conteúdo; spinner só em botão. Mantém dimensões. |
| **Error** | Cor `danger` + ícone + texto objetivo + como resolver. |
| **Empty** | Mensagem direta + próxima ação ("Nenhuma proposta. Abrir mercado."). |

### 7.1 Estados de domínio

| Situação | Cor | Marca adicional (obrigatória) |
|---|---|---|
| Disponível / ok | `success` | Ícone de check ou nada |
| Lesionado | `danger` | Ícone de cruz/curativo + texto "Lesionado" |
| Suspenso | `warning` | Ícone de cartão + texto "Suspenso" |
| Cansado / atenção | `warning` | Ícone + valor % |
| Proposta recebida | `info` | Ícone + contador |
| Positivo / subindo | `success` | Seta ↑ |
| Estável | `text-secondary` | Seta → |
| Negativo / caindo | `danger` | Seta ↓ |

### 7.2 Faixas de condição física

| Faixa | Cor | Complemento |
|---|---|---|
| ≥ 85% | `success` | — |
| 65–84% | `text-primary` (neutro) | — |
| 40–64% | `warning` | ícone de alerta |
| < 40% | `danger` | ícone de alerta + texto "Crítico" |

---

## 8. Padrões de página

### 8.1 Visão Geral — "mesa do treinador"

Prioridade, de cima para baixo:

1. **Próxima partida** (bloco dominante): adversário, **FORA/CASA**, data e hora (`Domingo • 18:30`), botão `Preparar partida`.
2. Pendências que exigem atenção (escalação incompleta, proposta, jogador indisponível).
3. Últimos resultados + `FormIndicator`.
4. Posição na tabela (trecho da classificação em volta do clube).
5. Condição do elenco e indisponíveis.
6. Notícias relevantes e movimentações de mercado.
7. Próximos compromissos.

**Não** montar uma parede de KPIs. Cada número precisa levar a uma decisão ou a uma tela.

### 8.2 Elenco

`DataTable` densa:

`NOME · POS · OVR · IDADE · COND · MORAL` (+ colunas opcionais: contrato, valor, forma, jogos, gols).

- Ordenação em todas as colunas; filtros rápidos por posição e disponibilidade; comparação (2–4 atletas); clique/Enter abre `Drawer` do atleta.
- Moral: ↑ → ↓ com `aria-label`. COND em % com faixa de §7.2. POS como `Badge neutral`.
- Cor com moderação: só em COND crítica, lesão/suspensão e OVR de destaque.

### 8.3 Partida (tela de assinatura)

```
CRUZEIRO                  FLAMENGO          ← Sora, ClubBadge
               2 — 1                        ← mono, --font-size-score
                 72'                        ← mono
POSSE      54%      ▬▬▬▬▬▬▬  46%
xG         1.84     ▬▬▬▬▬▬▬  0.91          ← StatComparison
CHUTES     14       ▬▬▬▬▬▬▬   8

LINHA DO TEMPO
 67'  ● GOL   Matheus encontra o atacante entre os zagueiros.
              Finalização cruzada no canto.
```

- Fundo `bg`, destaque em `primary` para o lado do usuário, placar muito legível (contraste ≥ 7:1).
- Abas: **Linha do tempo · Escalações · Estatísticas · Notas** (mapa tático: futuro).
- Atualização ao vivo: novo evento entra no topo da linha do tempo com animação curta; gol anima o placar (§10). Leitor de tela recebe os eventos via região `aria-live="polite"`.
- Controles de ritmo (pausar/avançar) discretos, com atalho de teclado.

### 8.4 Jogador

Cabeçalho: nome (Sora), `PlayerAvatar`, idade, nacionalidade, posição, valor, salário, contrato. **OVR grande** em destaque.

Atributos em três grupos: **TÉCNICOS · FÍSICOS · MENTAIS**. Mostrar força e fraqueza **sem barras coloridas gigantes**: lista compacta com número (tabular) e marcador discreto (ponto/traço fino), destacando só os 3 melhores e os 3 piores com ícone. Comparação com a média da posição ou do elenco como referência neutra.

### 8.5 Tática (tela de assinatura — "prancheta")

- Campo estilizado **escuro** (linhas finas em `border-strong`, nada de gramado texturizado), vertical, com os 11 slots por formação.
- Painel lateral direito: **Formação** (ex.: 4-3-3), **Estilo** (ex.: Posse) e, no futuro, pressão, linha defensiva, velocidade, amplitude, transição.
- Slot de jogador: `PlayerAvatar` + sobrenome + OVR + indicador de condição; `selected` com anel `primary`.
- Interação: **selecionar → escolher destino** é o fluxo base (funciona por teclado e toque); **arrastar** é aprimoramento futuro, nunca o único caminho.
- Banco e reservas em lista lateral/abaixo; substituição por seleção.
- Mostra, ao vivo, o impacto: aviso de jogador fora de posição, indisponível ou cansado.

### 8.6 Mercado

Ferramenta de scouting profissional:

- Filtros: posição, idade, nacionalidade, valor, salário, atributos. Filtros ativos viram chips removíveis.
- Resultado em `DataTable`; coluna de destaque com 3 atributos relevantes à posição.
- Linha: nome, `Pos • idade`, OVR, valor (`R$ 28 mi`), atributos-chave, ação `Ver jogador`.
- Comparação lado a lado e lista de observação.
- Propostas em `Drawer`; confirmação final em `Modal`.

### 8.7 Classificação

Colunas: `#  CLUBE  J  V  E  D  GP  GC  SG  PTS`.

- Clube do usuário: fundo `primary-muted` + marca lateral (barra 3 px `primary`).
- Zona de título, classificação continental e rebaixamento: **barra lateral colorida + legenda com texto** (cor não é o único sinal). Intensidade discreta.
- Números tabulares, `PTS` em peso 700.

---

## 9. Acessibilidade

Meta: **WCAG 2.2 AA**.

- **Contraste:** texto ≥ 4,5:1 (corpo) e ≥ 3:1 (texto grande 18,66 px bold / 24 px); componentes e ícones ≥ 3:1. Valores medidos da paleta estão em BRAND §4.3. `--color-border` **não** serve para limitar controle.
- **Foco visível** em todo elemento interativo (§7). Ordem de foco = ordem visual.
- **Teclado:** tudo operável sem mouse. Tabelas: setas/Tab, Enter abre, Espaço seleciona. Menus: ↑ ↓ Enter Esc. Tabs: ← →.
- **Não depender de cor:** todo estado de cor tem ícone/texto/forma (§7.1).
- **Alvos:** ≥ 40 px (`--layout-min-touch-target`).
- **Sem dependência de hover:** o que aparece no hover aparece também no foco e em toque.
- **Semântica:** `nav`, `main`, `header`, `table` real com `th scope`, `aria-sort`, `aria-live` para placar/eventos, `aria-label` em IconButton, `aria-current="page"` na sidebar.
- **Movimento:** respeitar `prefers-reduced-motion` (os tokens de duração zeram automaticamente em `tokens.css`).
- **Tamanho de texto:** layout não quebra com zoom de 200%.
- Tema: dark nativo (`color-scheme: dark`). Modo claro **não** faz parte do escopo inicial.

---

## 10. Motion

Rápido, discreto, funcional. Tokens: `--motion-duration-{instant 80, fast 140, base 220, slow 360}` e `--motion-easing-{standard, enter, exit}`.

| Quando | Efeito | Duração |
|---|---|---|
| Placar muda | Número troca com leve escala/fade; destaque `primary` por 1,2 s e volta | `base` |
| Evento de partida entra | Desliza 8 px + fade, no topo da lista | `base` |
| Dado atualiza (tabela, posse, xG) | Flash suave de fundo `primary-muted` na célula | `fast` |
| Seleção (linha, slot, aba) | Troca de fundo/borda | `fast` |
| Troca de página | Fade curto do conteúdo central (sem deslocar a sidebar) | `base` |
| Modal/Drawer | Fade do overlay + deslize do painel | `base` (saída `fast`, easing `exit`) |

Proibido: animação decorativa contínua, parallax, bounce, confete (exceto, se vier a existir, um único momento de título, com opção de desligar).
`prefers-reduced-motion: reduce` → durações a 0 ms; mudanças de estado seguem comunicadas por cor/ícone/texto.

---

## 11. Comportamento responsivo

Breakpoints: `sm 640 · md 960 · lg 1280 · xl 1600` (`--breakpoint-*`). Desktop é a experiência principal, mas **a estrutura é pensada para adaptar** (mobile-first no CSS; desktop-first no design).

| Faixa | Layout |
|---|---|
| ≥ 1280 (lg+) | Sidebar 248 px + conteúdo; Drawer lateral convive com a tabela. |
| 960–1279 (md) | Sidebar recolhida (72 px) por padrão; painéis laterais da Tática e do Mercado viram abaixo/Drawer. |
| 640–959 (sm) | Sidebar vira **gaveta** aberta por botão; navegação principal pode migrar para barra inferior (Visão Geral, Elenco, Tática, Mercado, Mais). Tabelas rolam horizontalmente com coluna do nome fixa. |
| < 640 | Uma coluna. Drawer ocupa a tela. Tabelas viram **lista de cartas por linha** só quando a rolagem horizontal for inviável; a lista mantém as mesmas colunas prioritárias. |

Regras:

- Nada depende de hover nem de arrastar; sempre há caminho por toque e teclado.
- Alvos ≥ 40 px em toque.
- Prioridade de colunas definida por tabela (o que some primeiro: contrato → valor → idade; nunca nome, POS, OVR).
- Conteúdo crítico (próxima partida, escalação pendente) permanece no topo em qualquer largura.

---

## 12. Dados e formatação

Locale `pt-BR`.

| Dado | Formato | Exemplo |
|---|---|---|
| Placar | `2 — 1` (tela de partida) / `2 - 1` (listas), mono | `2 — 1` |
| Minuto | `72'`, acréscimo `45+2'` | `45+2'` |
| Posse, condição | inteiro com `%` | `57%` |
| xG | 2 casas, ponto decimal em mono; sufixo `xG` só em rótulo isolado | `1.84` |
| Dinheiro (lista) | `R$ 28 mi`, `R$ 450 mil` | `R$ 28 mi` |
| Dinheiro (detalhe) | `R$ 42.500.000` (mono quando em destaque) | `R$ 42.500.000` |
| Data de jogo | `Domingo • 18:30` | — |
| Posições | Siglas PT-BR: GOL, ZAG, LD, LE, VOL, MC, MEI, PE, PD, SA, CA | `CA` |
| Forma | `V E D` (mais recente à direita) | `V V E D V` |
| Variação | seta + valor | `↑ +3` |

---

## 13. Checklist de revisão de tela

Antes de aceitar qualquer tela:

- [ ] Responde "o que está acontecendo / o que exige atenção / qual a próxima decisão"?
- [ ] Só usa tokens (nenhum hex, px solto ou fonte direta)?
- [ ] No máximo 1 botão primário por região; verde só em ação/seleção/positivo?
- [ ] Nenhum card dentro de card; sem sombra fora de camadas flutuantes?
- [ ] Todos os estados definidos (hover, foco, ativo, selecionado, desabilitado, carregando, erro, vazio)?
- [ ] Nenhuma informação só por cor; nenhuma função só por hover?
- [ ] Operável por teclado, com foco visível e alvos ≥ 40 px?
- [ ] Contraste conferido (texto 4,5:1; componentes 3:1)?
- [ ] Textos no tom da marca (curtos, diretos, sem burocracia)?
- [ ] Mono só em dado ao vivo/comparável; Sora só em título/marca?
- [ ] Ícones Lucide, sem emoji permanente?
- [ ] Respeita `prefers-reduced-motion`?
- [ ] Funciona em 960 px e tem plano claro para < 640 px?
