# PRANCHETA — Marca

> **O jogo começa fora de campo.**

Este documento é regra. Toda decisão de UI, UX, texto e comunicação da PRANCHETA deve ser coerente com ele. Quando houver dúvida, vale o que está aqui; se o documento estiver errado, altere-o primeiro e depois o produto.

Tokens e componentes: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) · valores em [`design-tokens/tokens.json`](../design-tokens/tokens.json).

---

## 1. Posicionamento

PRANCHETA é um jogo de gerenciamento de futebol. O usuário **não controla jogadores em campo**. Ele vence por:

- escalação;
- tática;
- preparação;
- contratações;
- desenvolvimento do elenco;
- leitura do adversário;
- decisões ao longo da temporada.

A sensação que a interface deve produzir:

> "Estou entrando na central de comando de um treinador de futebol."

A marca deve transmitir **estratégia, inteligência, competição, comando, futebol, dados e profissionalismo**.

### O que a PRANCHETA não é

| Não parecer | Por quê |
|---|---|
| Infantil, cartunesco, arcade | O público toma decisões; a interface precisa tratá-lo como profissional. |
| Site de apostas | Sem néon agressivo, odds, contadores piscando, urgência artificial. |
| Fantasy game | O foco é o clube e o treinador, não colecionar cards. |
| App financeiro | Dinheiro é uma parte do jogo, não a identidade dele. |
| Dashboard corporativo genérico | Nada de grade de KPIs vazia. Cada bloco deve servir a uma decisão. |

> **Ruptura intencional com o jogo de origem.** A identidade anterior (pixel art, fonte Silkscreen, escudos e bandeiras em sprite, tom brincalhão) **não** é reaproveitada. A PRANCHETA tem visual próprio.

---

## 2. Personalidade

Moderna · premium · estratégica · competitiva · limpa · objetiva · esportiva sem clichês · predominantemente escura.

**Palavras-chave internas:** TACTICAL · CONTROL · FOOTBALL · DATA · DECISION · MATCHDAY · MANAGER.

Direção visual: *football management* + *tactical analysis* + *modern sports software* + *premium game UI*. Sem copiar visualmente nenhum produto existente.

---

## 3. Logotipo

**Definido em 05/10/2026.** Prancha de referência: [`brand/logo-board.webp`](../brand/logo-board.webp). Toda tela nova usa esta logo.

### 3.1 Símbolo

Uma **prancheta** (com a presilha no topo) cujo contorno forma a letra **P**: o corpo da prancheta é a haste, e a "barriga" do P sai pela direita. Dentro dela, uma jogada desenhada:

- três **pontos** (jogadores);
- uma **linha curva contínua** que sobe até um **X** (o alvo da jogada);
- uma **linha tracejada com seta** descendo (movimentação sem bola).

O símbolo é levemente inclinado para a direita, com cantos arredondados e traço grosso e uniforme. Atende ao conceito original (prancheta tática + movimentação + letra P) e não usa nenhum dos elementos proibidos.

### 3.2 Wordmark

`PRANCHETA` em caixa alta, **lettering próprio**: sans geométrica pesada, com o **"A" sem a barra horizontal** (os dois "A" da palavra). Cor `textPrimary` sobre fundo escuro.

> O wordmark é **arte, não texto**. Nunca recomponha "PRANCHETA" digitando em Sora ou em outra fonte: use sempre o arquivo do logo. Sora continua sendo a fonte de títulos da interface (§5), mas não substitui o wordmark.

### 3.3 Assinatura

Tagline abaixo do wordmark, em caixa alta com espaçamento largo entre letras, cor `textSecondary`:
`O JOGO COMEÇA FORA DE CAMPO.`

Só nas versões de apresentação (login, landing, peças). Dentro do jogo, o logo aparece **sem** a tagline.

### 3.4 Versões

| Versão | Composição | Uso |
|---|---|---|
| **Principal horizontal** | símbolo verde + wordmark claro (+ tagline) | Login, landing, sidebar expandida (sem tagline) |
| **Ícone** | símbolo verde sobre quadrado escuro de cantos arredondados | Ícone do app/PWA, favicon, sidebar recolhida, avatar de rede social |
| **Monocromática empilhada** | símbolo e wordmark em uma cor só, símbolo acima | Fundos sem controle de cor, impressão, fundo claro (em `bg`) ou escuro (em `textPrimary`) |

### 3.5 Cor e acabamento

- Símbolo em verde da marca: gradiente de `primary` (`#39E079`) para `primaryHighlight` (`#7CFFAC`).
- **Dentro da interface, use a versão chapada** (verde sólido `primary` ou o gradiente simples), **sem o brilho/glow** que aparece na prancha. O brilho é acabamento de peça de apresentação; a regra do sistema é "poucas sombras, nada de glow" (§9). O logo é a única exceção permitida, e só em login, landing e material promocional.
- Nunca recolorir o símbolo com `warning`, `danger` ou `info`. Nunca aplicar o verde no wordmark.

### 3.6 Área de respiro e tamanho mínimo

- **Respiro:** margem livre ao redor do logo igual à largura da presilha da prancheta.
- **Tamanho mínimo:** símbolo 16 px (favicon; abaixo de 24 px usar a versão simplificada, sem a linha tracejada); versão horizontal 120 px de largura.

### 3.7 Proibido

Distorcer, girar, trocar as cores, aplicar contorno, sombra dura ou efeito 3D; colocar sobre foto ou fundo sem contraste; redesenhar o símbolo; recompor o wordmark em fonte de texto; usar bola, chuteira, troféu, apito, escudo de clube ou mascote junto do logo.

### 3.8 Arquivos (pendente)

A prancha recebida é uma **imagem única em baixa resolução, com fundo e brilho**; não serve como asset de produção. Para usar a logo nas telas faltam os arquivos-fonte:

- símbolo em **SVG** (verde chapado e monocromático);
- versão horizontal e versão empilhada em **SVG**;
- ícone do app em **PNG 512 e 192** (e SVG) para o PWA e o favicon.

Enquanto os vetores não chegarem, **não redesenhe a logo à mão**: um traçado aproximado vira uma segunda logo. As telas reservam o espaço do logo e recebem o arquivo final quando existir.

---

## 4. Cores

Fonte: [`tokens.json`](../design-tokens/tokens.json). Nomes abaixo = nomes dos tokens.

### 4.1 Paleta principal

| Token | Hex | Papel |
|---|---|---|
| `bg` (Night Pitch) | `#08120E` | Fundo da aplicação |
| `surface` | `#101C17` | Painéis, tabelas, cards |
| `surfaceElevated` | `#16241D` | Drawer, modal, dropdown, hover de linha |
| `primary` | `#39E079` | Ações, seleção, positivo, destaque estratégico |
| `primaryHighlight` | `#7CFFAC` | Hover/ativo do primário, números em destaque, foco |
| `textPrimary` | `#F5F7F6` | Texto principal |
| `textSecondary` | `#94A39B` | Texto de apoio, rótulos |
| `border` | `#26372E` | Divisores |
| `success` | `#39E079` | Estado positivo |
| `warning` | `#F2C94C` | Atenção |
| `danger` | `#FF5D5D` | Erro, indisponível, rebaixamento |
| `info` | `#58A6FF` | Informação neutra |

### 4.2 Tokens derivados (adicionados ao sistema)

Estes **não estavam** na paleta original; foram derivados e precisam de aprovação final de design. Existem porque a paleta pura deixa lacunas de acessibilidade.

| Token | Valor | Motivo |
|---|---|---|
| `onPrimary` | `#08120E` | Texto sobre botão verde. Contraste 10,98:1. |
| `borderStrong` | `#5A7567` | `border` tem contraste 1,4:1: serve para divisor, **não** para delimitar input/select/botão (mínimo 3:1 para componentes). `borderStrong` dá 3,48:1 sobre `surface`. |
| `primaryMuted`, `successMuted`, `warningMuted`, `dangerMuted`, `infoMuted` | cor a 14% | Fundo de badge, linha selecionada, alerta, sem competir com o texto. |
| `textDisabled` | `#5B6B62` | Somente estado desabilitado (isento de contraste mínimo pelo WCAG). |
| `focusRing` | `#7CFFAC` | Anel de foco. |
| `overlay` | `rgba(4,9,7,.72)` | Fundo de modal e drawer. |

### 4.3 Contraste medido

Calculado com a fórmula de luminância relativa do WCAG 2.x, sobre `bg` / `surface` / `surfaceElevated`:

| Cor | bg | surface | elevated | Uso de texto |
|---|---:|---:|---:|---|
| `textPrimary` | 17,69 | 16,26 | 14,97 | Qualquer |
| `textSecondary` | 7,23 | 6,64 | 6,11 | Qualquer (AAA em corpo no `bg`) |
| `primary` | 10,98 | 10,09 | 9,29 | Qualquer |
| `warning` | 12,00 | 11,02 | 10,15 | Qualquer |
| `info` | 7,54 | 6,92 | 6,37 | Qualquer |
| `danger` | 6,32 | 5,81 | 5,35 | Qualquer (AA) |
| `border` | 1,51 | 1,39 | 1,28 | **Nunca** para texto ou limite de controle |

### 4.4 Regras de uso

1. **Evitar excesso de verde.** Grandes superfícies ficam escuras/neutras. O verde marca *o que importa*: ação principal, seleção, indicador positivo, destaque estratégico.
2. **No máximo um botão primário (verde sólido) por região** da tela.
3. Verde significa "ação" e "positivo". Não use verde como decoração.
4. **Cor nunca é o único canal de informação.** Todo estado de cor tem também ícone, texto ou forma (ver [DESIGN_SYSTEM.md §9](DESIGN_SYSTEM.md#9-acessibilidade)).
5. `warning`, `danger` e `info` aparecem só quando houver estado correspondente. Sem uso decorativo.

---

## 5. Tipografia

| Papel | Fonte | Onde |
|---|---|---|
| Interface | **Inter** | Corpo, menus, botões, tabelas, formulários |
| Títulos | **Sora** | Nome de clube em destaque, títulos de página, títulos de seção (o wordmark é arte própria, ver §3.2) |
| Dados e números especiais | **JetBrains Mono** | Placar, posse, xG, valores financeiros, minutos |

Exemplos:

- Sora → `CRUZEIRO x FLAMENGO`
- Inter → `Próxima partida`, `Escalação`, `Mercado`, `Treinamento`
- JetBrains Mono → `2 - 1`, `57%`, `1.84 xG`, `R$ 42.500.000`

**Não exagerar no monoespaçado.** Ele é para dado que o olho compara ou que muda ao vivo (placar, minuto, xG, saldo). Colunas numéricas comuns de tabela (OVR, idade, pontos) usam **Inter com `font-variant-numeric: tabular-nums`**, não mono.

---

## 6. Tom de voz

Direto e esportivo. Frase curta, verbo no imperativo quando houver ação, sem burocracia.

| Use | Evite |
|---|---|
| Próxima partida | Visualizar informações sobre o próximo compromisso |
| Defina sua escalação | É necessário configurar a formação |
| Mercado aberto | O período de transferências encontra-se em andamento |
| Proposta recebida | Você possui uma nova notificação de oferta |
| Jogador indisponível | Atleta impossibilitado de atuar |
| Preparar partida | Iniciar processo de preparação |
| Rodada concluída | A rodada foi finalizada com sucesso |

Regras:

- Português do Brasil.
- Sem exclamação gratuita, sem gíria forçada, sem humor infantil.
- Botão = verbo ou ação curta ("Preparar partida", "Enviar proposta"), nunca "Clique aqui" ou "OK" quando existir uma ação mais clara.
- Mensagens de erro dizem o que houve e o que fazer: "Escalação incompleta. Falta 1 titular."
- Valores: `R$ 28 mi` em listas densas; `R$ 28.000.000` em detalhe.

---

## 7. Tagline

> **"O jogo começa fora de campo."**

Aparece em landing, login e peças promocionais. **Não** repetir constantemente dentro do jogo.

---

## 8. Ícones e imagem

- Biblioteca: **Lucide Icons**. Traço 1,75–2 px, tamanhos 16 / 20 / 24.
- Sem emojis como elemento permanente de interface. (Em texto livre de usuário, tudo bem.)
- Sem ilustrações infantis, mascotes ou pixel art.
- Escudos de clubes e fotos de jogadores são **conteúdo**, não decoração: usam `ClubBadge` e `PlayerAvatar` com fallback neutro quando não houver imagem.

---

## 9. Usos e proibições (resumo)

**Pode:**
- Fundos escuros, verde como acento, tipografia forte, tabelas densas e legíveis.
- Motion curto para placar, evento, atualização de dado, seleção e transição de página.

**Não pode:**
- Gradientes chamativos, brilho/glow em excesso, sombras pesadas.
- Cards dentro de cards; borda em tudo.
- Verde em grandes áreas.
- Animação decorativa contínua.
- Bola, chuteira, troféu, apito ou escudo genérico como ornamento.
- Misturar elementos da identidade antiga do jogo de origem.
- Layouts que dependam exclusivamente de hover.

---

## 10. Governança

- Os valores de cor, tipo, espaçamento, raio e motion vivem **somente** em `design-tokens/tokens.json`. Telas consomem tokens; não escrevem hex.
- Mudança de identidade = PR que altera este documento, `DESIGN_SYSTEM.md` e `tokens.json` juntos.
- Qualquer componente novo precisa estar no catálogo do design system antes de ser usado em duas telas.
