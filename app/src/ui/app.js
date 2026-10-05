// Gerado por tools/convert-ui.mjs a partir de reference/netcore.js. Lógica inalterada.
// UI legada: será substituída pela interface PRANCHETA (docs/DESIGN_SYSTEM.md).
import { CORE, WORLD, SIM, SEASON, TRAIN, MARKET, EVENTS, SPR } from '../engine/index.js';
import { NETCORE } from '../net/netcore.js';
import LOGO_URI from './assets/logo-legacy.webp?url';
import TSPN_URI from './assets/tspn.png?url';
import ZETV_URI from './assets/zetv.png?url';
import FAB_IMG from './assets/fab.png?url';
import CHANCE_LOGO from './assets/chance-logo.png?url';
import './looks.js';
// Escopo de função preservado: o original tem declarações de função duplicadas, inválidas no topo de um módulo.
await (async () => {








// aparência medida nas fotos do Transfermarkt e revisada (pele 0-5, cabelo 0-6, careca) · v233: + Santiago Sosa (576026), conferido pelo Vini · v234: + 3.911 medidos nas fotos de 04/10 (PEDIDO-FOTOS-JOGADORES)


// ===== registro de atualizações (mais recente primeiro) =====
const CHANGELOG = [
  { v: 284, sv: '1.24.1', d: '05/10/2026', items: ['Mercado: antes de fechar negócio (proposta, contrato, pré-contrato, aceitar proposta, pacote, empréstimo, dispensa) o app confere se está com a versão atual da liga; se não estiver, atualiza primeiro e só então executa. Evita negociar em cima de um mundo velho (jogador já vendido, pré-contrato que não existe mais). Sem conexão, a ação não é feita.', 'Acordo com clube do computador só se concretiza na abertura da janela se o jogador ainda topa o destino; senão cai, com dinheiro e moedas devolvidos e aviso.', 'Pré-contrato: na hora de assinar, o jogo confere de novo se o jogador ainda pode (ninguém assinou antes, contrato vencendo, período aberto). Antes só a tela conferia.', 'Pré-contrato vence: se mesmo assim uma compra escapar num aparelho desatualizado, o pré-contrato não cai mais — o jogador fica no comprador até o fim da temporada e chega ao clube do pré-contrato na virada, com aviso pros dois técnicos (antes a compra valia e o pré caía).'] },
  { v: 282, sv: '1.24.0', d: '05/10/2026', items: ['Novidade: DNA do clube. Cada clube tem um DNA principal (Celeiro, Caixa, Caldeirão ou Copa) e um secundário, que vale metade. Entregar o que o DNA pede (jovens em campo, caixa crescendo, vitórias em casa e clássicos, fases de copa) dá um bônus nos pilares, mostrado num selo ao lado de cada barra.', 'Cargo mais exigente em clube de meta alta (título, G4/G6): a nota do cargo é Diretoria (60%) e Torcida (40%); o Grupo decide nos extremos. Derrotas em copa e na tabela pesam mais pra quem tem que ganhar.', 'Fama do treinador em árvore: cada traço da temporada acende um nó, e o galho cheio vira fama na virada.', 'Cartão do objetivo: a meta e as etapas logo abaixo do título; o ícone do DNA tem as cores dos dois DNAs do clube.'] },
  { v: 280, sv: '1.23.4', d: '05/10/2026', items: ['Fim de temporada em ordem: primeiro a Copa Intercontinental, depois o Dia da Premiação e por último o dia livre com o botão NOVA TEMPORADA. Se o jogo do Mundial atrasar, a premiação espera por ele.'] },
  { v: 278, sv: '1.23.3', d: '05/10/2026', items: ['Servidor: proteção extra — a troca da Intercontinental antiga pra jogo único tenta no máximo uma vez a cada 30 minutos por liga.'] },
  { v: 276, sv: '1.23.2', d: '05/10/2026', items: ['Correção: a liga com a Intercontinental antiga marcada passa na hora pra só a final (antes só mudava quando chegava a hora do Dérbi).'] },
  { v: 274, sv: '1.23.1', d: '05/10/2026', items: ['Copa Intercontinental: liga que ainda estava com as 3 partidas do formato antigo (mesmo com o Dérbi já jogado) passa a ter só a final, campeão da Libertadores × campeão europeu, num horário normal de jogo.', 'Depois do último jogo da temporada não tem mais pacote: os reforços do Diamante e do Ouro são emprestados e voltariam na virada. Estrelas e diamantes ficam guardados pra temporada nova.'] },
  { v: 272, sv: '1.23.0', d: '05/10/2026', items: ['Premiação virou noite de gala: cada prêmio abre com cortinas, mostra 3 finalistas, tem suspense e a revelação, terminando na Bola de Ouro com troféu próprio.', 'Prêmios: Bola de Ouro (melhor jogador), Chuteira de Ouro (artilheiro), Garçom de Ouro (assistências), Luva de Ouro (goleiro) e Revelação do Ano (até 21 anos, quem mais evoluiu e se destacou), só na Série A; Prancheta de Ouro (treinador) e Seleção da Temporada nas Séries A, B e C.', 'Prêmio de jogador do seu clube entra na sua galeria de conquistas.'] },
  { v: 268, sv: '1.22.0', d: '05/10/2026', items: ['Copa Intercontinental voltou a ser um jogo só: campeão da Libertadores contra o campeão europeu, no dia do encerramento, num horário normal de jogo da liga. A nova temporada só começa depois dele. Liga que ainda não jogou nenhuma partida do formato antigo passa pro jogo único.', 'Torneios › Copa do Brasil: a final aparece com ida, volta e o placar agregado, e o campeão fica em destaque.', 'Torneios › Continental e Regionais: fase de grupos data por data, com dia e horário; mata-mata e Pré-Libertadores também mostram a data.', 'Zona mista: corrigido o treinador que não conseguia escrever (o acesso exigia a chave do aparelho). Imprensa: uma declaração por treinador a cada 20 horas.'] },
  { v: 267, sv: '1.21.0', d: '05/10/2026', items: ['Novidade: Zona mista, o chat da liga. Botão branco no topo da tela do clube, ao lado do WhatsApp da liga; a bolinha vermelha mostra mensagens novas (e @ quando te citaram). Use @ pra citar treinador, clube ou jogador.', 'Na Zona mista, marque o botão Imprensa ao lado do Enviar e a mensagem vira matéria no jornal da liga, escrita pela redação (uma por dia do jogo). Ela mexe nos pilares como uma declaração.', 'Carreira virou uma tela fixa, em vez de caixa por cima.', 'Correção: na coletiva, tocar num clube da lista do @ abria a tela do clube e a mensagem se perdia.'] },
  { v: 261, sv: '1.20.1', d: '04/10/2026', items: ['Jogador que já assinou pré-contrato com outro clube não pode mais ser usado como moeda de troca nem ir pra lista de transferências/empréstimo (brecha: o pré-contrato caía na virada).'] },
  { v: 249, sv: '1.20.0', d: '04/10/2026', items: ['Vagas continentais fixas: 4 na Libertadores (campeões de copa primeiro, o resto pela tabela), 4 na Pré-Libertadores, 4 na Sul-Americana e 4 na Conferência. A Pré agora é mata-mata entre brasileiros: quem vence vai pra Libertadores, quem perde vai pra Sul-Americana. Campeão de copa não cria vaga a mais: quem estava no G4 e perdeu a vaga direta vai pra Pré. Série B só entra em copa continental por título, nunca pela tabela.'] },
  { v: 247, sv: '1.19.4', d: '04/10/2026', items: ['Torneios › tabelas: agora deslizam pro lado com # e clube fixos, e ganharam as colunas GP (gols marcados) e GC (gols sofridos). A marca de vaga herdada virou “+” (a seta pra baixo parecia rebaixamento).', 'Finanças: o “5 dias” era quanto falta pra temporada acabar (com piso de 5) e confundia com o caixa. Agora uma frase diz se o caixa paga os salários até o fim da temporada (verde) ou se acaba antes (vermelho, com o que fazer).'] },
  { v: 245, sv: '1.19.3', d: '04/10/2026', items: ['Galeria de conquistas: o troféu entra assim que o título é decidido (copa: na final; liga: quando ninguém mais alcança o líder). Antes só aparecia no fim da temporada. Ligas que já têm campeão recebem na próxima atualização.'] },
  { v: 243, sv: '1.19.2', d: '04/10/2026', items: ['Correção: o botão Retirar não zera mais a trava de recusas. Depois da 3ª oferta recusada, o clube continua sem conversar por 2 dias mesmo se você retirar ou desistir.'] },
  { v: 242, sv: '1.19.1', d: '04/10/2026', items: ['Mercado › Propostas: botão Retirar nas negociações com clubes do computador, e "Desistir da negociação" na tela do jogador agora desfaz o acordo de verdade (antes só fechava a tela). E o acordo de taxa passa a valer 3 dias do jogo (aparece "vale até o dia X"); vencido, some da lista e a conversa recomeça do zero.'] },
  { v: 240, sv: '1.19.0', d: '04/10/2026', items: ['Base de jogadores atualizada (Transfermarkt, outubro de 2026): elencos atuais das Séries A, B, C e D, dos sul-americanos das copas, das 5 grandes ligas da Europa (com os promovidos de 2026/27) e dos grandes de Portugal, Holanda, Turquia, México, MLS e Arábia. São cerca de 3 mil jogadores novos e 990 transferências reais.', 'Ligas em andamento: nada muda até a virada da temporada, nem os elencos dos adversários das copas. Na virada, as transferências reais só acontecem para quem ninguém mexeu na sua liga; seu elenco nunca perde jogador por causa disso, e quem ia pro seu clube fica livre no mercado. Ligas novas já nascem atualizadas.', 'Peñarol, Nacional, Colo-Colo, Olimpia, LDU, Bolívar e os outros sul-americanos das copas agora têm elenco real (nas ligas em andamento, a partir da próxima temporada; os jogadores inventados se aposentam e quem você comprou continua com você).', 'Base real: os garotos que chegam na base são os do Sub-20 e Sub-17 de verdade do clube (primeiro o Sub-20, os mais valorizados antes). Quando a lista do clube acaba, chegam garotos gerados como antes. O limite continua o mesmo (3 por temporada + reposição até 5/6/7).', 'Jogador real menor de idade não aparece em notícia de indisciplina, só em notícia esportiva.', 'Correção: o Ao vivo de jogo da Copa Intercontinental não abria (faltava o árbitro).', 'Título, acesso e rebaixamento garantidos antes do fim viram notícia na rodada em que ficam matematicamente decididos (a festa com a taça continua na última rodada).', 'Aparência: mais 3.911 jogadores conferidos nas fotos (Séries A a D, brasileiros no exterior, sul-americanos, Intercontinental e base). Quem não tem foto é sorteado mais perto da realidade do país.'] },
  { v: 232, sv: '1.18.7', d: '04/10/2026', items: ['Base: garoto que aparecia na lista mas sem ficha (a aba Base não abria) é reconstruído sozinho ao abrir a liga. Acontecia quando a reposição da base de dois clubes era gravada ao mesmo tempo.'] },
  { v: 231, sv: '1.18.6', d: '04/10/2026', items: ['Limite de 45 e mínimo de 16 no elenco agora contam quem já tem acordo pra chegar E pra sair na próxima janela — em proposta, contrato, pacote, empréstimo e dispensa. Antes uma venda já fechada não liberava vaga, e dava "elenco cheio" à toa. Na abertura, as saídas acordadas também contam antes de barrar uma chegada.'] },
  { v: 230, sv: '1.18.5', d: '04/10/2026', items: ['Troca com clube do computador com a janela fechada: o seu jogador da troca também só sai quando a janela abrir, junto com a chegada do outro (antes ele ia na hora). Se o acordo cair na abertura, ninguém sai e a taxa volta.'] },
  { v: 229, sv: '1.18.4', d: '04/10/2026', items: ['Correção urgente: a atualização dos elencos da Intercontinental (1.18.2) tinha apagado 76 jogadores gerados que ligas em andamento ainda usavam (pré-contratos, pacotes do dia, lista de transferências). Eles voltaram com os mesmos ids e nomes, e a aba Mercado abre de novo.'] },
  { v: 228, sv: '1.18.3', d: '03/10/2026', items: ['Transferências reais atualizadas: 34 jogadores que estavam em clubes antigos na nossa base foram pro clube atual (ex.: Martinelli e Watkins no Al-Hilal, Reijnders no Al-Qadsiah, Wijnaldum e En-Nesyri no Al-Ittihad). Quem já tinha sido contratado na sua liga continua onde está, e jogadores de clubes brasileiros não mudam.'] },
  { v: 226, sv: '1.18.2', d: '03/10/2026', items: ['Elencos reais nos clubes da Intercontinental e mais três clubes: Mamelodi Sundowns, Al Ahly, Pyramids, Espérance, Auckland FC, Zamalek, Al-Ittihad e Al-Qadsiah, e Al-Hilal, Al-Nassr, Al-Ahli, Toluca, Cruz Azul, Monterrey e Tigres completos (339 jogadores novos). Os jogadores gerados desses clubes saem; quem já tinha contratado algum continua com ele.', 'Alguns jogadores que estavam sem clube na base foram pro clube real (ex.: Ronwen Williams no Sundowns, El Shenawy e Zizo no Al Ahly).'] },
  { v: 224, sv: '1.18.1', d: '03/10/2026', items: ['Correção: clubes reais do exterior com poucos jogadores nos nossos dados (Al-Hilal, Al-Nassr, Toluca e outros) tinham sido completados com jogadores inventados, que apareciam no mercado. Eles saem; quem já tinha contratado algum continua com ele.', 'Correção: o limite de 20 jogadores pra vender valia também pra clubes reais do exterior e travava compras de muitos jogadores de fora. Agora vale só pros elencos completos das copas.'] },
  { v: 222, sv: '1.18.0', d: '03/10/2026', items: ['ADM da liga: no painel do ADM dá pra passar a administração pra outro treineiro.', 'Se o ADM ficar sem entrar o mesmo tempo que derruba um treineiro por abandono (Turbo 3 dias, Normal 5), a administração passa sozinha pro treineiro mais antigo da liga que está jogando, com aviso pra todos.'] },
  { v: 220, sv: '1.17.0', d: '03/10/2026', items: ['Base: continuam chegando 3 garotos por temporada, e cada garoto que você sobe abre vaga pra outro, até 5 na temporada na Série A, 6 na B e 7 na C.', 'Elencos que não acabam: clubes do computador completam o elenco com a base e com jogadores livres das posições que faltam (24 na virada, nunca menos de 20). Em temporadas longas os elencos encolhiam até quebrar a liga.', 'Clubes do exterior não vendem abaixo de 20 jogadores e repõem com livres.', 'Se o elenco de um treineiro cair abaixo de 16, a diretoria completa com livres (a base continua sua).'] },
  { v: 218, sv: '1.16.3', d: '03/10/2026', items: ['Mercado: a liga ao lado do clube agora é a do clube atual do jogador. Antes aparecia a liga de origem (ex.: Di María no Al-Nassr mostrava Liga Argentina).', 'Clubes da Intercontinental: jogadores com a liga certa do país e bandeiras de Arábia Saudita, Egito, Tunísia, África do Sul e Nova Zelândia.'] },
  { v: 216, sv: '1.16.2', d: '03/10/2026', items: ['Lista de treineiros da liga: o "visto há" foi pra linha de baixo, em letra menor, e quem está com o app aberto aparece em verde como online agora.'] },
  { v: 214, sv: '1.16.1', d: '03/10/2026', items: ['A lista de treineiros da liga mostra quando cada um foi visto pela última vez (amarelo depois de 1 dia, vermelho perto de cair por inatividade).', 'Pacotes: saiu a grade com o pacote do dia de cada clube da liga.', 'Os jogadores da liga agora se chamam treineiros na lista.'] },
  { v: 212, sv: '1.16.0', d: '03/10/2026', items: ['Novidade: Copa Intercontinental da FIFA. Nos dias de encerramento, o campeão da Libertadores disputa o torneio com os campeões reais deste ano: Dérbi das Américas contra o Toluca, Copa Challenger contra o Mamelodi Sundowns e a final contra o PSG. Jogos únicos em campo neutro, com a sua tática. O título vai pra estante e rende premiação.', 'Vagas continentais como na vida real: os campeões da Copa do Brasil, da Libertadores e da Sul-Americana vão pra Libertadores, e o vice da Copa do Brasil pra Pré-Libertadores. Cada clube fica com uma vaga só, a melhor; se o campeão já estava classificado, a vaga passa pro próximo da tabela. A tabela da Série A mostra as zonas com isso já calculado (★ vaga por título, ↓ vaga herdada).'] },
  { v: 210, sv: '1.15.3', d: '03/10/2026', items: ['Liga pausada pelo ADM no fim da temporada: o botão Avançar/Pronto do Solo/Close Friends e o avanço do ADM agora retomam o relógio (antes não faziam nada). A nova temporada nunca mais começa com o relógio congelado.'] },
  { v: 209, sv: '1.15.2', d: '03/10/2026', items: ['Amistosos: o diamante das 10 vitórias seguidas é um por sequência (a sequência só zera quando você perde). A tela agora mostra "já recebido" depois do 10º, e a lista de "Como ganhar" na carteira foi corrigida: 3 vitórias em amistosos no dia = 1 estrela.'] },
  { v: 207, sv: '1.15.1', d: '03/10/2026', items: ['Novidade: Fama do treinador. São 4 famas: Revelador (minutos pros jovens), Gestor (mercado no azul, folha controlada e salário em dia), Raiz (render mais em casa do que fora) e Decisivo (terminar acima do que o elenco indica). Cada uma tem 6 traços por temporada, que aparecem no seu cartão de treinador. Quem fecha os 6 até a virada ganha a tag no cartão; ela se renova se repetir e cai se passar uma temporada sem fechar. Valem no máximo 2 ao mesmo tempo. Por enquanto é reconhecimento e não muda nada no jogo.', 'O mapa de perfil das coletivas saiu do cartão do treinador. As respostas continuam mexendo no elenco, na diretoria e na torcida como antes.'] },
  { v: 202, sv: '1.14.4', d: '03/10/2026', items: ['Correção importante: em alguns casos uma compra feita no app era desfeita pelo servidor logo depois (o jogador "voltava" pro clube antigo) e o jogador recém-comprado ficava com a ficha incompleta (tela não abria, não aparecia na escalação). A causa foi encontrada e corrigida, e as fichas incompletas se completam sozinhas.', 'Correção: pedir verba à diretoria com um jogador de ficha incompleta no elenco zerava o caixa.', 'Correção: na pré-Libertadores, o 2º jogo empatado ia pros pênaltis mesmo com o agregado decidido (quem avançava aparecia como derrotado nos pênaltis).', 'Romper o teto: a tela e as notícias agora explicam que a média é da nota comparada com a do time em cada jogo (6,5 = na média do time), e não a nota que aparece na partida. A mensagem de fim também dizia "jogou pouco" quando a média é que tinha ficado abaixo de 6,5.', 'Romper o teto: barrinhas jogo a jogo mostram a nota de cada partida e quanto falta pra próxima faixa. Convocação pra Data FIFA no meio da tentativa vale como um jogo com nota 7,0 (antes tirava jogos dele).', 'Pré-contrato: se outro clube comprou o jogador quase ao mesmo tempo, a compra paga vale e o pré-contrato cai com aviso (antes o jogador ia de graça na virada para o clube do pré-contrato, mesmo pago pelo outro).', 'Mercado: a fileira de abas de cima não volta mais pro começo a cada toque.'] },
  { v: 199, sv: '1.14.3', d: '03/10/2026', items: ['Durante o jogo: quando um gatilho muda a formação e sobra alguém fora da posição (ex.: 5-3-2 para 4-3-1-2 deixava um zagueiro no meio), o time faz a substituição sozinho, com um jogador da posição do banco, se ainda tiver troca disponível.'] },
  { v: 198, sv: '1.14.2', d: '03/10/2026', items: ['Correção urgente: no horário de pico as partidas atrasavam. A "campainha" do aparelho voltou a acionar o processamento extra do servidor.'] },
  { v: 197, sv: '1.14.1', d: '03/10/2026', items: ['Correção: um acordo de taxa feito com um clube antigo podia ser usado depois que o jogador já tinha ido para o clube de outro técnico, e a compra fechava sem ele decidir. Agora jogador de clube com técnico só sai por proposta, e acordo de taxa antigo precisa ser refeito.'] },
  { v: 196, sv: '1.14.0', d: '02/10/2026', items: ['Segurança da conta: cada aparelho agora tem uma chave secreta do seu treinador. Quem tentar se passar por outro técnico da liga não consegue gravar nada.', 'Código de acesso (XXXX-XXXX) conferido pelo servidor: o código não fica mais guardado dentro da liga. Os códigos que você já tem continuam valendo.', 'Entrou em outro aparelho? Use o código de acesso: o novo aparelho ganha a chave dele na hora.', 'Faxina no código: partes antigas sem uso foram removidas (o app ficou um pouco mais leve).'] },
  { v: 195, sv: '1.13.10', d: '02/10/2026', items: ['Acordos fechados com a janela fechada: o jogador sempre chega com contrato até pelo menos a temporada seguinte; se o elenco estiver cheio na abertura, o dinheiro volta; e jogador Diamante não chega a um clube cujo técnico já saiu (taxa e moedas devolvidas).', 'Servidor: guarda mais ligas na memória e a "campainha" do aparelho ficou bem mais leve no horário de pico.'] },
  { v: 194, sv: '1.13.9', d: '02/10/2026', items: ['Sincronização mais segura: quando o seu aparelho e o servidor mexiam no caixa ou nas moedas ao mesmo tempo, uma das mudanças podia sumir. Agora as duas valem.', 'Correção provável das contratações desfeitas: trocar de liga com uma gravação em andamento podia misturar os dados e "desfazer" uma compra. Isso não acontece mais.', 'Mercado: acordo de taxa cai se o jogador mudar de clube antes do contrato; acordo fechado com a janela fechada devolve o dinheiro se o jogador se aposentar ou for vendido; pacote que não pode ser aberto não cobra mais as moedas; empréstimo de pacote volta ao clube de origem mesmo se o técnico sair; a IA não compra mais jogador emprestado.', 'Servidor mais leve no horário de pico.'] },
  { v: 193, sv: '1.13.8', d: '02/10/2026', items: ['Correção: o painel do ADM não abria em ligas onde o servidor tinha refeito uma contratação desfeita (pelo recibo da compra).'] },
  { v: 192, sv: '1.13.7', d: '02/10/2026', items: ['Pré-contrato é garantido: jogador que assinou pré-contrato não é mais vendido nem comprado por ninguém até o fim da temporada, quando chega de graça ao clube. Quem já tinha sido vendido antes desta versão também chega normalmente na virada.', 'Contraproposta a outro técnico agora avisa: se ele aceitar o valor, a venda fecha na hora.', 'Coletiva: o técnico não é mais perguntado sobre uma declaração dele mesmo.'] },
  { v: 191, sv: '1.13.6', d: '02/10/2026', items: ['Coletiva revisada: perguntas e respostas agora combinam com o que aconteceu. Nada de "três pontos" em jogo de copa, pergunta de VAR ou pênalti sem ter tido lance, "empate fora" em jogo em casa, ou resposta de gramado e arbitragem quando o assunto é outro.', 'Novos temas na coletiva: clássico vencido, perdido ou empatado; classificação nos pênaltis ou no agregado; gol de empate no fim; respostas próprias para boa fase, má fase, meta da diretoria, renovação, jogador insatisfeito, volta de lesão e árbitro do próximo jogo.', 'Correções: o nome de quem deu a declaração aparece completo, e o efeito da resposta não aparece repetido.'] },
  { v: 190, sv: '1.13.5', d: '02/10/2026', items: ['Correção: em casos raros, uma contratação (principalmente com troca) era desfeita pela sincronização: o dinheiro saía, mas o jogador voltava pro clube antigo. Agora cada compra guarda um recibo, e o servidor refaz a transferência sozinho se ela sumir. O app também avisa automaticamente se isso acontecer, pra gente achar a causa.'] },
  { v: 189, sv: '1.13.4', d: '02/10/2026', items: ['Solo/Close Friends ganhou a etiqueta EM TESTE (na criação da liga e no topo da liga). É modo novo: se algo estranho acontecer, avise pelo botão de bug.'] },
  { v: 188, sv: '1.13.3', d: '02/10/2026', items: ['Solo/Close Friends: o Pronto agora vale só pra quem joga o próximo jogo da liga. Se for um jogo só de um amigo (ex.: Supercopa), só ele avança, e os outros veem no card de quem é a vez. Se nenhum de vocês joga, qualquer um avança.'] },
  { v: 187, sv: '1.13.2', d: '02/10/2026', items: ['Correção: artilharia e assistências são permanentes. Jogador vendido (inclusive pro exterior) continua na lista do campeonato com os gols que fez, com o escudo do clube que defendia e a indicação de onde está agora. Vale pras Séries A, B e C, pras copas e pros prêmios da temporada (artilheiro, garçom, melhor jogador e melhor goleiro).'] },
  { v: 186, sv: '1.13.1', d: '02/10/2026', items: ['Correção: o acordo com o clube podia sumir e a assinatura dava "Acerte primeiro a taxa com o clube". Causa: se o app estava baixando novidades da liga no exato momento em que você agia, a sua ação era descartada. Agora o que você faz durante a sincronização é sempre preservado (vale pra proposta, escalação e tudo mais), e a assinatura refaz o acordo sozinha se ele tiver sumido.', 'Correção: ficha de jogador não quebra mais pra quem está sem clube (ADM sem time ou desempregado).'] },
  { v: 185, sv: '1.13.0', d: '02/10/2026', items: ['Nova criação de liga em passos: duração (Normal ou Turbo), modo (Online ou Solo/Close Friends), divisões e resumo.', 'Solo/Close Friends: jogue sozinho ou com até 3 amigos, escolhendo qualquer um dos 60 clubes. O card do jogo tem o botão Avançar; com amigos, a liga avança quando todos tocam em Pronto (sem isso, os jogos seguem no horário). Sem demissão por abandono e sem remover treinador.'] },
  { v: 184, sv: '1.12.0', d: '02/10/2026', items: ['Regra da ANRESF (Agência Nacional de Regulação e Sustentabilidade do Futebol): a ajuda de emergência (cota antecipada nas Séries B e C, adiantamento da TV na Série A) só vale pra quem não comprou mais do que vendeu na temporada nem aumentou a folha em mais de 10%. Quem estourar o mercado encara os salários atrasados. Em Finanças, o clube vê se tem direito.', 'Balanço da temporada: na virada, cada treinador recebe o balanço do clube com todas as receitas e despesas, o resultado (superávit ou déficit) e dicas de gestão. Fica guardado em Finanças (últimas 3 temporadas).'] },
  { v: 183, sv: '1.11.8', d: '02/10/2026', items: ['Série A sem cota fixa: se o caixa ficar negativo, a TV adianta T$ 10 mil por vez (até T$ 80 mil na temporada). É empréstimo: sai do caixa na virada, sem deixar o clube com menos de 14 dias de folha. Séries B e C seguem com a cota fixa.'] },
  { v: 182, sv: '1.11.7', d: '02/10/2026', items: ['Correção: quem vencia a pré-Libertadores às vezes ia pra Sul-Americana. Agora a Libertadores só é montada depois do 2º jogo da pré. Ligas afetadas foram compensadas.'] },
  { v: 181, sv: '1.11.6', d: '02/10/2026', items: ['Correção: o botão Manual rápido da tela inicial (antes de entrar numa liga) voltou a abrir.'] },
  { v: 180, sv: '1.11.5', d: '02/10/2026', items: ['Correção: quando o ADM adianta o relógio ou pausa a liga, os horários dos jogos na agenda passam a mostrar a hora real em que vão acontecer.', 'Notícias › Meu clube mostra só o seu clube (antes apareciam amistosos e jogos de outros treinadores da liga).'] },
  { v: 179, sv: '1.11.4', d: '02/10/2026', items: ['Correções: tela do jogo ao vivo não quebra mais com escalação fora do esquema; ficha de jogador que ainda não jogou na temporada abre normalmente.'] },
  { v: 178, sv: '1.11.3', d: '02/10/2026', items: ['Tabelas das Séries A, B e C mostram a forma dos últimos 5 jogos de cada clube (o mais recente à direita, destacado).'] },
  { v: 177, sv: '1.11.2', d: '02/10/2026', items: ['Elenco: jogador já contratado que ainda não chegou (acordo com a janela fechada ou pré-contrato) aparece no topo da lista, em cinza, com a data de chegada.'] },
  { v: 176, sv: '1.11.1', d: '02/10/2026', items: ['Ligas que já estavam no intervalo entre temporadas começam a receber a cota na próxima temporada.'] },
  { v: 175, sv: '1.11.0', d: '02/10/2026', items: ['Cota da temporada: todo clube recebe uma cota fixa da sua divisão (Série A T$ 40 mil, B 20 mil, C 30 mil), em 4 parcelas. Se o caixa ficar negativo, a parcela seguinte é antecipada.', 'Premiação revisada com base nos valores reais: Série A mais equilibrada entre as posições; Copa do Brasil e copas internacionais pagam mais e somam a cada fase.', 'Bônus de conquista: estrelas e diamantes pro treinador campeão (regionais 4★; Série C 5★ + Ouro; Série B 6★ + diamante; Copa do Brasil e Sul-Americana 8★ + diamante; Brasileirão 10★ + diamante; Libertadores 12★ + diamante).'] },
  { v: 174, sv: '1.10.0', d: '02/10/2026', items: ['Premiação da temporada agora também nas Séries B e C: Melhor Jogador, Melhor Assistente, Artilheiro, Melhor Goleiro, Melhor Treinador e Time da Temporada em cada divisão.'] },
  { v: 173, sv: '1.9.1', d: '02/10/2026', items: ['Agenda: jogo concluído ganha o botão Tabela, que leva direto pra tabela do torneio daquele jogo.'] },
  { v: 172, sv: '1.9.0', d: '02/10/2026', items: ['"Em ascensão" agora é chamado de fase (do jogador), pra não confundir com os selos da carreira do treinador.', 'Novo selo de carreira: Formador, pra quem rompe o teto de 2 ou mais jovens na mesma temporada.'] },
  { v: 171, sv: '1.8.2', d: '02/10/2026', items: ['Fase Em ascensão: média 6,8 nos últimos 5 jogos oficiais.', 'Nota de 6,8 a 6,9 ganha cor própria, entre o amarelo e o verde: já é nota boa.'] },
  { v: 170, sv: '1.8.1', d: '02/10/2026', items: ['Fase Em ascensão mais alcançável: agora vale média 6,8 nos últimos 6 jogos oficiais (antes 7,0 em 10). Dá cerca de um jovem por clube por temporada.'] },
  { v: 169, sv: '1.8.0', d: '02/10/2026', items: ['Romper o teto: jovem até 23 anos em grande fase (média 7,0 nos últimos 10 jogos oficiais) entra na fase Em ascensão. Em Elenco › Treino dá pra tentar subir o potencial dele: 2 estrelas, 15 dias. Se ele jogar bem no período, o teto sobe até 3 pontos; se não jogar ou for mal, não rompe.'] },
  { v: 168, sv: '1.7.0', d: '02/10/2026', items: ['Jogar partida oficial agora ajuda o jogador a evoluir, e jogar bem ajuda mais. A nota é comparada com a média do próprio time, então quem joga em time mais fraco não sai prejudicado. Amistoso não conta.'] },
  { v: 167, sv: '1.6.7', d: '02/10/2026', items: ['A versão do app agora aparece discreta no rodapé, no formato 1.6.7. Toque nela pra ver as novidades.', 'Proposta que você mandou a outro técnico e não pôde ser fechada (seu elenco cheio, falta de caixa, jogador da troca indisponível) agora gera um aviso nas suas notícias e sai da lista de propostas enviadas.', 'Acordo desfeito na abertura da janela explica o motivo.'] },
  { v: 166, d: '01/10/2026', items: ['Pacotão de reforços: clube que recebe 4 ou mais jogadores na abertura da janela vira manchete no CHANCE e n\'O Treineiro.'] },
  { v: 165, d: '01/10/2026', items: ['Correções: tela de jogador emprestado, Mercado › Livres e Notícias não quebram mais com jogador sem nota.', 'Partidas processadas mais rápido nos horários de pico.'] },
  { v: 163, d: '01/10/2026', items: ['Correção: a aba Escalação não abria em algumas ligas.', 'Se uma tela der erro, aparece um aviso em vez de travar, e o erro é enviado automaticamente pra correção.'] },
  { v: 162, d: '01/10/2026', items: ['Correção: quando o servidor demora ou cai, o que você mexeu (escalação, tática, etc.) não volta mais atrás; o app guarda e tenta salvar de novo sozinho.'] },
  { v: 161, d: '01/10/2026', items: ['Artilharia das copas agora conta todos os jogos da temporada, inclusive os de antes da atualização.'] },
  { v: 160, d: '01/10/2026', items: ['Mercado › Propostas: lista das propostas que você enviou a outros técnicos e ainda estão sem resposta, com botão Retirar.'] },
  { v: 159, d: '01/10/2026', items: ['Servidor do jogo próprio, ligado o tempo todo.', 'Correção: ligas com todos os clubes das Séries A, B e C com treinador travavam a virada do dia.'] },
  { v: 157, d: '01/10/2026', items: ['Se o aparelho encarregado de jogar as partidas sumir, o próximo treinador ativo assume (fila de reserva).', 'A liga abre mais rápido: o processamento dos jogos fica pra depois que a tela carrega.'] },
  { v: 156, d: '01/10/2026', items: ['Pico de acesso: se o servidor atrasar um jogo mais de 1 minuto, o aparelho do ADM (ou de um treinador ativo) joga a partida na hora.'] },
  { v: 155, d: '01/10/2026', items: ['Artilharia e assistências também nas copas (Copa do Brasil, continentais e regionais).', 'Proposta enviada a um técnico da liga continua aparecendo ao fechar e abrir a ficha; desistir retira a proposta.', 'Corrigido: gol nos acréscimos do 1º tempo sumia do lance a lance (aparecia "Intervalo" duas vezes).', 'Trocar o esquema tático mantém os mesmos titulares, cada um na posição que mais combina.', 'Escalar automático também completa o banco.', 'Treino individual: toque no + e escolha qualquer jogador do elenco.', 'Agenda: "Rever partida" (replay) e "Resumo".', 'Novo selo Tipster: mais acertos nos Palpites da temporada.', 'Número da camisa: na ficha do jogador, "Camisa · trocar".', 'Liga por escolha: botão "Escolher meu clube".'] },
  { v: 154, d: '01/10/2026', items: ['Corrigido: botão de Amistoso não abria em ligas com as Séries A e B cheias de treinadores.'] },
  { v: 153, d: '01/10/2026', items: ['Correção: quando o servidor cai, só um aparelho por liga joga as partidas (antes cada celular podia mostrar um placar diferente pro mesmo jogo).', 'Servidor mais leve pra não estourar a memória.'] },
  { v: 152, d: '01/10/2026', items: ['Código de acesso: aviso pra salvar o código (WhatsApp, copiar ou print) até você confirmar "Já salvei". Ele devolve o seu treinador se trocar de celular ou limpar o navegador.'] },
  { v: 151, d: '01/10/2026', items: ['Servidor: corrigido travamento em que, com o banco lento, a liga carregava mas nenhum jogo era processado ("bola rolando" parado).'] },
  { v: 150, d: '01/10/2026', items: ['Estabilidade: o app pede menos ao servidor quando ele está ocupado, e não fica mais preso em "Abrindo a liga…" se a conexão demorar (avisa e deixa tentar de novo).'] },
  { v: 149, d: '01/10/2026', items: ['Monitoramento do servidor: o dono do jogo recebe alerta se o servidor parar ou atrasar.'] },
  { v: 148, d: '01/10/2026', items: ['Vagas: treinador demitido ou desempregado não ocupa mais vaga na liga. Ligas que pareciam completas voltam a aceitar gente nova nos clubes sem técnico.', 'Aviso claro de liga cheia, com o número de vagas ocupadas.', 'Código de vaga: no Painel do ADM, escolha um clube sem técnico e gere um código. A pessoa digita o código ao entrar na liga e cria o treinador direto nesse clube (vale 72 horas).'] },
  { v: 147, d: '01/10/2026', items: ['Conexão mais leve: o app consulta só um resumo da liga e baixa o resto quando algo muda (menos dados e bateria).', 'Servidor processa várias ligas ao mesmo tempo (mais ligas por minuto, menos atraso).', 'Demissão por inatividade: no modo Normal são 4 dias pro aviso e 5 pra demissão; no Turbo seguem 2 e 3.', 'Limite de 3 ligas novas por aparelho a cada 24 horas.', 'Manual rápido atualizado (divisões, sorteio ou escolha, grupo da liga, reportar bug).'] },
  { v: 146, d: '01/10/2026', items: ['Correção automática: se dois treinadores ficarem no mesmo clube, o clube fica com quem chegou primeiro e o outro é realocado pra um clube livre da mesma divisão, com aviso e registro na auditoria do ADM.'] },
  { v: 145, d: '01/10/2026', items: ['Pacotes Ouro e Ouro Especial nas Séries B e C: mais jogadores aceitam o empréstimo, então o pacote volta a vir cheio.', 'Com muita gente na liga, o mesmo jogador pode aparecer no pacote de mais de um treinador no mesmo dia: quem contratar primeiro leva.', 'Pacote nunca mais vem vazio: se faltar nome, completa com os melhores da categoria de baixo, pelo preço dela.'] },
  { v: 144, d: '01/10/2026', items: ['Criar liga: escolha quais divisões terão treinadores (Série A, B e/ou C; 20 vagas por divisão) e se o clube sai por sorteio ou por escolha do treinador.', 'Modo escolha: o treinador vê os clubes livres das divisões abertas, com força, caixa e objetivo, e escolhe o seu.', 'Entrar sem time (só ADM) agora é exclusivo do dono do jogo.'] },
  { v: 143, d: '01/10/2026', items: ['Painel do ADM: lista de treinadores com filtro por Série A, B e C (com a quantidade) e ordenação única: ordem da liga, A–Z, caixa (menor primeiro) e estabilidade no cargo (menor primeiro). Toque no bonequinho abre a ficha do treinador.', 'Modo god (eventos aleatórios na hora) agora é só do dono do jogo.'] },
  { v: 142, d: '01/10/2026', items: ['Demissão de técnicos: todas as ligas no modo Realista (ultimato não cumprido = demissão). A opção saiu do painel.', 'Painel do ADM mais enxuto: sai o quadro de saúde da liga.', 'Grupo do WhatsApp por liga: o ADM coloca o link no Painel do ADM; vazio, o botão não aparece. Só links do WhatsApp são aceitos.', 'Lista de treinadores da tela do clube: toque no treinador pra abrir a ficha dele.'] },
  { v: 141, d: '01/10/2026', items: ['Botão de reportar bug no topo: conte o problema (contato opcional) e a resposta do criador do jogo aparece ali mesmo, com aviso de resposta nova.', 'Inatividade: 2 dias sem entrar, o cargo balança (aviso e notícia); 3 dias, o treinador é demitido por abandono e a vaga abre pra quem quiser. O ADM vê no painel há quanto tempo cada um não aparece.', 'ADM sem time: dá pra criar a liga só pra administrar, entrar como ADM numa liga sua sem treinador, ou deixar o clube e seguir só administrando (Painel do ADM › Ferramentas).', 'Lista de treinadores da liga (tela do clube) com filtro por Série A, B e C e a quantidade de cada uma.', 'O selo Os Primordiais foi encerrado.'] },
  { v: 140, d: '01/10/2026', items: ['Auditoria: novo alerta "Carteira sem explicação" quando estrelas, diamantes ou Ouro aparecem sem prêmio registrado (aparece em Movimentações suspeitas, no Painel do ADM).'] },
  { v: 139, d: '01/10/2026', items: ['Antes do sorteio, quando só há vaga na Série C, aparece o aviso "Só tem vaga na Série C" explicando Ouro, acesso e rebaixamento, com Aceitar ou Agora não.'] },
  { v: 138, d: '01/10/2026', items: ['Série C aberta para treinadores: liga com até 60 técnicos. Com as Séries A e B completas, o sorteio passa pra Série C, primeiro entre os 4 elencos mais fortes e depois os outros 16.', 'Quem entra na C já começa com Ouro, pacote Ouro Especial, objetivo da diretoria e reforço de estrelas conforme o tamanho do elenco, como na Série B. Os 4 primeiros sobem pra Série B.', 'Servidor mais leve com muitos treinadores: a montagem dos pacotes ficou cerca de 2,5 vezes mais rápida.'] },
  { v: 137, d: '01/10/2026', items: ['Manual rápido: botão ? no topo (e na tela de entrada) com tudo o que precisa saber: rotina, escalação, moedas, pacotes, mercado, competições, coletiva, cargo e dicas.', 'Quem acabou de assumir um clube vê um aviso na tela inicial com atalho pro manual.'] },
  { v: 136, d: '01/10/2026', items: ['Perfil de treinador: o tom das respostas nas coletivas posiciona o treinador num mapa (Sereno ↔ Intenso, Protetor ↔ Exigente) e define um perfil: Diplomata, Gestor, Paizão, Xerife ou Equilibrado. Aparece no card do treinador, firma depois de 15 respostas e as recentes pesam mais. Por enquanto não tem efeito no jogo; no futuro vai pesar nas vagas abertas.'] },
  { v: 135, d: '01/10/2026', items: ['Botão do grupo da liga no WhatsApp: na tela de entrada do site e no topo da tela do clube.'] },
  { v: 134, d: '30/09/2026', items: ['Clubes da Série A e B controlados pela IA podem demitir o técnico após má sequência na liga; a Série B passa a ter vagas com mais frequência.', 'Um técnico interino comanda normalmente por cinco a sete dias enquanto a vaga fica aberta e propostas chegam a treinadores reais compatíveis.', 'O clube mostra o status de interino e de vaga aberta; propostas vencidas somem quando outro técnico assume.'] },
  { v: 133, d: '30/09/2026', items: ['Jogadores cedidos por empréstimo aparecem no Elenco como indisponíveis, com tag de empréstimo, sem ocupar vaga no limite nem poder entrar na escalação.', 'No card do jogador cedido, a aba Mercado traz o botão vermelho Chamar de volta e mostra o reembolso proporcional antes da confirmação.'] },
  { v: 132, d: '30/09/2026', items: ['Clube dono do passe pode chamar de volta um jogador emprestado pelo card em Mercado › Histórico › Empréstimos.', 'Antes de confirmar, o jogo mostra a devolução proporcional da taxa ao clube que recebeu o atleta, conforme os jogos restantes. O retorno e o reembolso aparecem no histórico e nas finanças.'] },
  { v: 131, d: '30/09/2026', items: ['Empréstimo: o clube que recebe o jogador não pode renovar, dispensar, vender ou anunciar o atleta antes de comprá-lo em definitivo.', 'Taxa de empréstimo entre treinadores agora sai do caixa de quem recebe e entra no de quem cede; o acordo confere caixa, teto e espaço no elenco no momento do aceite.', 'Jogadores emprestados voltam ao clube de origem antes da virada de temporada.'] },
  { v: 130, d: '30/09/2026', items: ['Negócios entre treinadores podem ser fechados com a janela fechada: o dinheiro fica comprometido e o jogador só muda de clube quando ela abrir.', 'Contrapropostas e trocas seguem a mesma regra; os dois técnicos veem o acordo em Mercado, e o negócio é devolvido se algum jogador deixar de estar disponível.'] },
  { v: 129, d: '30/09/2026', items: ['Lista da Data FIFA mantém brasileiros e estrangeiros convocados depois do retorno; listas antigas recuperam os estrangeiros pelas notícias da convocação.', 'Jornais do carrossel ganham 80 px de altura; CHANCE! recupera o cabeçalho e o tamanho da matéria de capa, com a classificação no rodapé.'] },
  { v: 128, d: '30/09/2026', items: ['Data FIFA: escalação considera a data do próximo jogo do clube. Quem não disputa a copa pode preparar a rodada de liga com jogadores já liberados até lá.', 'Estados antigos com convocação encerrada são corrigidos ao carregar a liga; titulares e banco voltam a poder ser escolhidos.'] },
  { v: 127, d: '30/09/2026', items: ['Data FIFA agora tira convocados de duas rodadas de liga, sem atingir jogos de copa continental, regional ou Copa do Brasil.', 'Aviso de desfalques some quando o jogador já está liberado para a próxima partida; o card confere a data do jogo antes de alertar.'] },
  { v: 126, d: '30/09/2026', items: ['Coletivas: perguntas e respostas evitam repetir recentemente o mesmo assunto e a mesma frase; respostas específicas do lance aparecem com mais frequência.'] },
  { v: 125, d: '30/09/2026', items: ['Pacote na tela inicial: quando indisponível, mantém a cor da próxima categoria em versão translúcida, com contador até liberar.', 'Capa do CHANCE!: a classificação fica numa faixa reservada no rodapé e não desaparece quando a manchete ou as chamadas ocupam mais espaço.'] },
  { v: 124, d: '30/09/2026', items: ['Tela inicial: o card do pacote continua visível em cinza depois de usado ou nos dias sem pacote, mostrando a categoria e o contador até o próximo pacote. Quando o pacote está disponível, mantém o botão Abrir.'] },
  { v: 123, d: '30/09/2026', items: ['Painel do ADM agora é uma tela fixa (o mesmo botão ADM abre), em vez de caixa suspensa.', 'ADM: Avançar rodada e Pausar liga foram pro quadro Ferramentas, junto com Anular rodada.', 'Movimentações suspeitas: empréstimo entre treinadores não gera mais alerta de valor fora do mercado (nem de ida e volta).', 'Movimentações suspeitas: alertas de caixa trazem o botão "Por quê?" com a origem do dinheiro (caixa inicial, bilheteria, prêmios, vendas) e as maiores vendas.', 'ADM: lista de treinadores pode ser ordenada por menos dias de caixa.'] },
  { v: 122, d: '30/09/2026', items: ['Elenco › Números: colunas de cartões amarelos e vermelhos (com ordenação) e aviso de jogador pendurado ou suspenso.'] },
  { v: 121, d: '30/09/2026', items: ['Palpites: novas abas Ranking (temporada) e Ranking geral, com todos os treinadores ordenados por total de acertos.'] },
  { v: 120, d: '30/09/2026', items: ['Sorteio da Copa do Brasil volta à data fictícia de antes na agenda (o horário real continua meia hora depois do jogo).'] },
  { v: 119, d: '30/09/2026', items: ['Agenda: rodada da Copa do Brasil agora aparece mesmo quando seu clube já foi eliminado, com botão pra ver os jogos.'] },
  { v: 118, d: '30/09/2026', items: ['Data FIFA: toque no card da agenda (ou em "Todos os convocados" no aviso) e veja a lista completa da liga: brasileiros da Seleção e estrangeiros convocados pelos seus países, por clube.'] },
  { v: 117, d: '30/09/2026', items: ['Data FIFA: a convocação sai logo depois do jogo anterior, e não mais em cima da hora. Os convocados desfalcam os 2 jogos seguintes, e o card do próximo jogo avisa quem está fora, pra dar tempo de ajustar a escalação.', 'Aviso no topo do início (como o do sorteio) com os convocados do seu clube e atalho pra escalação.'] },
  { v: 116, d: '30/09/2026', items: ['Campinho: quando um gatilho tático muda a formação (ex.: vencendo por 2 → retranca), os jogadores vão pras posições novas.', 'Campinho: depois de expulsão ou substituição, cada um assume a posição certa, igual ao cálculo da partida.', 'Campinho: fim do atacante livre na área que não chutava. A defesa fecha antes (zagueiro acompanha o atacante da sua faixa) e ninguém conduz sozinho até a área fora dos lances do jogo.', 'Campinho: a posse vem mais da circulação e do estilo; a correção pra bater com a posse real ficou bem mais suave.', 'Campinho: nos lances de gol e chance, quem recupera a bola corre até ela antes de desarmar.', 'Pacote Ouro e Ouro Especial não trazem mais as lendas (Sergio Ramos, Casemiro, Modrić…): elas contam como Diamante (3 meses) e só aparecem no pacote Diamante e no mercado com a regra do Diamante.', 'Texto corrigido: "salário quase todo pago pelo Al-Nassr" (antes saía "por o").', 'Estilos mais visíveis: tiki-taka com meias se aproximando pra tabelar, pelas pontas com lateral passando por fora e mais cruzamentos, direto buscando o centroavante, retranca com a defesa sem subir.'] },
  { v: 115, d: '30/09/2026', items: ['Painel do ADM: finanças de cada treinador mais limpas, só o caixa e quantos dias ele aguenta a folha (verde, amarelo ou vermelho).'] },
  { v: 114, d: '30/09/2026', items: ['Correção automática de transferência mais cuidadosa: guarda o estado de antes (dono, contrato, trava, camisa, caixa dos dois clubes e a outra parte da negociação) pra investigação, usa os mesmos passos de uma transferência e avisa que dinheiro, salário e contrato não foram mexidos.', 'Painel do ADM: a Saúde da liga mostra qual versão o servidor está rodando e avisa se ela estiver atrás do app.'] },
  { v: 113, d: '30/09/2026', items: ['Cartões mais realistas: mais amarelos (cerca de 4,5 por jogo) e jogador amarelado se segura, então o segundo amarelo ficou bem mais raro. Expulsões caem pra perto de 0,27 por jogo.', 'Histórico de transferências: filtro de Série (A, B, C) e lista de clubes só com os clubes do Brasil. Novo balanço em dinheiro (recebido em vendas, gasto em compras e saldo) do clube, da série ou do seu clube.', 'Painel do ADM: cada treinador mostra caixa, folha por dia e quantos dias o caixa aguenta. Quem está perto de atrasar salário (ou já atrasou) aparece destacado.'] },
  { v: 112, d: '30/09/2026', items: ['Correção de transferência: quando o histórico registra uma venda ou troca mas o jogador aparece de volta no clube de origem, a liga corrige sozinha e avisa o ADM em Movimentações suspeitas.', 'Ao fechar o app ou mandar ele pro fundo, o que ainda não tinha sido salvo é enviado na hora.'] },
  { v: 111, d: '30/09/2026', items: ['Crise financeira grave agora pode acontecer com qualquer clube, não só com SAF. Associativo: gestão temerária, impeachment do presidente, dívida escondida. SAF real: investidor atrasa aportes. SAF criada durante a liga (fundo ou investidor árabe): texto próprio e chance 4 vezes maior, e também maior de ser a versão extrema. Do jeito que veio, vai.', 'O peso é o mesmo pra todos: o caixa perde 25% do valor do elenco (60% na extrema), a moral cai e as contratações travam até a crise passar.'] },
  { v: 110, d: '29/09/2026', items: ['Painel do ADM: novo quadro Movimentações suspeitas. Todo dia o servidor confere os clubes com treinador e aponta caixa que não fecha, revenda com lucro alto, negócio entre treinadores fora do valor de mercado, ida e volta, venda de jogador que veio de pacote ou de graça, caixa crescendo rápido, caixa muito acima da divisão e folha maior que a receita. Só alerta, sem punição.', 'Botão ADM ocupa a linha inteira no início do app.'] },
  { v: 109, d: '29/09/2026', items: ['Série B e C: tudo que falava de diamante agora fala de Ouro. Carteira, topo, sorteio de clube, Como ganhar, sequência de vitórias, palpites, amistosos, boia da diretoria, objetivo premiado, finanças e textos do pacote do dia.', 'Pacote do dia na B e na C: a tabela de preços e o rodízio mostram o Ouro Especial no lugar do Diamante.', 'Jogador Diamante: na B e na C, a negociação avisa que ele não vem pra essas séries.'] },
  { v: 108, d: '29/09/2026', items: ['Força a atualização dos aparelhos que ficaram com a primeira v107: na Série B e na C, a carteira, o topo e o sorteio de clube mostram Ouro no lugar de diamante.'] },
  { v: 107, d: '29/09/2026', items: ['Chegou a Série C: 20 clubes com elencos reais de 2026 (Santa Cruz, Guarani, Paysandu, Figueirense, Ferroviária e mais 15), jogando nas mesmas datas das Séries A e B. Nova aba Série C em Torneios e filtro Série C no Mercado.', 'Acesso e rebaixamento valendo já nesta temporada: os 4 primeiros da C sobem pra B e os 4 últimos da B caem pra C. As rodadas da C que já tinham passado foram simuladas no placar.', 'Série D: os 4 últimos da C caem, e sobe o melhor clube da D em cada copa regional (Nordeste, Sul-Sudeste, Norte e Centro-Oeste). As copas regionais passam a ter vagas garantidas pra D.', 'Treinador rebaixado pra C continua no clube, com objetivo e premiação da Série C. Quem cair pra D deixa o clube (a D não tem campeonato nacional) e recebe propostas.', 'Selo Acesso também vale pra subida da C pra B.', 'Equilíbrio da liga corrigido: clube da Série B não é mais tratado como candidato a Libertadores. B e C sempre recebem mais que o pior elenco da Série A (B: 4 a 6 estrelas e 1 a 2 diamantes; C: 6 a 8 estrelas e 2 a 3 diamantes). Quem já tinha recebido o ajuste errado nesta temporada ganha a diferença agora.', 'Séries B e C sem jogador Diamante: os diamantes viram Ouro (1 pra 1). No dia do pacote Diamante, a B e a C recebem o Ouro Especial: jogadores de 81 a 84, empréstimo de 3 meses com 90% do salário pago pela origem, por 2 estrelas + 1 Ouro. Quem sobe pra Série A troca cada 2 Ouro por 1 diamante.'] },
  { v: 106, d: '29/09/2026', items: ['Rumores do Fabrizio Otomano mais realistas: agora seguem as mesmas regras de uma negociação de verdade. O jogador precisa ter interesse no clube, o clube precisa ter caixa pra chegar perto do valor e o nível dele precisa caber no elenco. Nada mais de lanterna da Série B atrás de craque da Premier League.'] },
  { v: 105, d: '29/09/2026', items: ['Chegou o Fabrizio Otomano: rumores, especulações e propostas por jogadores Ouro e Diamante agora são assinados por ele, com a foto no lugar do ícone de mercado.', 'Títulos mais naturais e mais variados ("Botafogo observa situação de Nández", "Contatos iniciais…", "Conversas avançam…", "Primeira oferta recusada…").', 'HERE WE GO! Contratações e empréstimos concluídos de jogadores Ouro e Diamante envolvendo clubes brasileiros ganham o anúncio clássico.'] },
  { v: 104, d: '29/09/2026', items: ['Inteira-Hora: 68 manchetes novas de variedades. Elas saem primeiro; depois vêm as antigas.', 'Nenhuma manchete repete antes de todas terem saído uma vez.'] },
  { v: 103, d: '29/09/2026', items: ['Capa da Brutal Models no CHANCE! dura uma edição, o dia fictício em que a notícia saiu, como as outras capas.'] },
  { v: 102, d: '29/09/2026', items: ['Patrocínio da Brutal Models vira capa do CHANCE! com o logo da empresa estampado, por cerca de um dia depois de sair (vale pro que já saiu e pros próximos).'] },
  { v: 101, d: '29/09/2026', items: ['Pós-jogo: o botão Tabela abre a tabela da competição do jogo (copa, continental ou regional), e não mais sempre a Série A.', 'Pênaltis: o lance mostra quem cometeu a falta, e ele perde meio ponto na nota.', 'Notas dos jogadores em quadradinhos coloridos, do vermelho (abaixo de 6) ao azul (9+).', 'Elenco › Números: jogos, gols, assistências e nota média da temporada, com ordenação.', 'Nova formação 4-4-1-1, com vaga de segundo atacante (SA).', 'Capitão, vice e cobrador de pênalti agora acompanham o time titular: tirou do time, volta pro automático. A moral só pesa quando a faixa é tirada de quem continua jogando.', 'ADM: quadro Saúde da liga, com boletim automático todo dia às 7h e botão Verificar agora.'] },
  { v: 100, d: '29/09/2026', items: ['Versão 100! Nova estante de selos na carreira do treinador (Clube › Carreira e no perfil de cada treinador). Cada selo aparece uma vez, com uma bolinha mostrando quantas vezes foi conquistado.', 'Selos: Missão Cumprida, Papa-Títulos (2+ títulos na temporada), Copeiro (2+ copas), Tirou Leite de Pedra (5+ posições acima do esperado pro elenco), Salvador da Pátria (assumiu no Z4 a partir da 10ª rodada e salvou), Rolo Compressor (melhor ataque), Muralha (melhor defesa) e Acesso.', 'Os Primordiais: selo especial pra quem abrir a v100 até 06/10. Depois disso, ninguém mais ganha.'] },
  { v: 99, d: '29/09/2026', items: ['No computador, as faixas de abas e chips que rolam pro lado (Mercado, Elenco, Torneios…) agora funcionam com a roda do mouse, arrastando com o mouse ou pela barrinha de rolagem que aparece embaixo.'] },
  { v: 98, d: '29/09/2026', items: ['Sorteio da Série B: com a Série A completa, saem primeiro os 4 times mais fortes da B (pela força do time titular). Ocupados esses, entram os outros 16.'] },
  { v: 97, d: '29/09/2026', items: ['Série B inteira com elencos reais de 2026 (Transfermarkt): os 16 clubes que tinham elenco gerado ganham os jogadores de verdade, e Sport, Ceará, Fortaleza e Juventude são atualizados.', 'Copas regionais com elencos reais das Séries C e D. Tombense, Rio Branco-ES e Porto Vitória (sem elenco no Transfermarkt) dão lugar a Portuguesa, Brasiliense e Luverdense.', 'Os jogadores gerados saem de circulação. Quem foi contratado por um treinador fica até o fim da temporada.', 'Sorteio de clube: com a Série A completa, qualquer um dos 20 da Série B pode sair.'] },
  { v: 96, d: '29/09/2026', items: ['Liga com até 40 treinadores: com os 20 clubes da Série A ocupados, o sorteio passa pra Série B.', 'Na Série B, primeiro saem os clubes com elenco real (Sport, Ceará, Fortaleza e Juventude); depois, os demais.'] },
  { v: 95, d: '29/09/2026', items: ['Treino individual: o servidor passa a conferir a todo momento se algum treino venceu (os que ficaram presos terminam sozinhos).', 'Elenco › Treino: nova vaga do treino individual no topo. Mostra quem está treinando e o progresso; livre, sugere jogadores pra começar.', 'Empréstimo do exterior: clubes de fora colocam jovens sem espaço e veteranos encostados na lista de empréstimo (Mercado › Listas › Empréstimo, com selo exterior; em Buscar aparecem como emprestáveis). Taxa mais cara, o clube de lá paga 30% do salário (40% se ele for titular num clube menor) e só empresta se ele for jogar, o que favorece os times pequenos. Jogando pouco, pode ser chamado de volta; no fim, dá pra exercer a opção de compra no card dele.', 'Mercado › Listas › Meus: os jogadores do seu elenco que você anunciou (venda ou empréstimo), com botão pra tirar do mercado.'] },
  { v: 94, d: '29/09/2026', items: ['Treino individual: corrigido o bug em que o treino não terminava no último dia (ficava em "Termina hoje"). Os treinos travados terminam sozinhos na próxima virada de dia.', 'Capitão automático: com um vice escolhido, a braçadeira ia pro vice mesmo com o líder natural em campo. Agora o líder natural é o capitão e o vice só assume se ele não jogar.', 'Novo: escolha o cobrador de pênalti em Elenco → Escalação. Ele bate os pênaltis do jogo e abre a disputa por pênaltis; se não estiver em campo, vale o automático.'] },
  { v: 93, d: '29/09/2026', items: ['Animação do jogo: atacante livre na área (ninguém entre ele e o gol) não recua mais a bola pro meio ou pras pontas. O lance termina com o goleiro saindo nos pés, o zagueiro chegando na cobertura ou a bola escapando pela linha de fundo.', 'O recuo continua só quando o atacante está marcado de frente, sem espaço.', 'Nos lances de gol e finalização, quem já está com a bola na área serve o finalizador direto, sem voltar pro meia.'] },
  { v: 92, d: '29/09/2026', items: ['Disputa de pênaltis: o batedor só parte pra bola depois que o goleiro chega na linha do gol (antes ele chutava com o goleiro ainda andando).'] },
  { v: 91, d: '29/09/2026', items: ['Novos eventos de finanças: patrocínio master da Brutal Models (mais comum em quem briga pra não cair; parte da torcida torce o nariz), investidor árabe compra a SAF de clube com orçamento curto, calote de patrocinador em quem briga pelo título (−20% do orçamento) e antecipação das cotas de TV (+25% do orçamento agora, descontado na temporada seguinte).', 'Também novos: penhora da Justiça do Trabalho, herança de torcedor fanático, show internacional no estádio, vaquinha da torcida (com salários atrasados) e áudio vazado do vestiário.', 'Todos entram no Modo god do ADM.'] },
  { v: 90, d: '29/09/2026', items: ['Modo god: os eventos disparados pelo ADM agora caem só em clubes com treinador ativo na liga.'] },
  { v: 89, d: '29/09/2026', items: ['Painel do ADM: novo Modo god, com um botão pra disparar na hora cada evento aleatório (fica cinza se o evento já aconteceu na temporada).', 'Painel do ADM: as duas listas de treinadores viraram uma só (clube, posição, sustentação no cargo e remover).', 'Avançar e Pausar saíram do card do próximo jogo e ficam só no painel do ADM, sem risco de toque sem querer.'] },
  { v: 88, d: '29/09/2026', items: ['Tela do clube: a barra de orçamento mostra a Folga salarial (quanto ainda cabe de salário por dia) no lugar do total de salários, lado a lado com a verba de Compras.'] },
  { v: 87, d: '29/09/2026', items: ['Card do jogador: botões de ação na lateral direita da carta, liberando espaço embaixo pras abas (Mercado, Treino, Renovar…).', 'A janela do jogador nunca passa do topo da tela: se o conteúdo for maior, ela rola por dentro.'] },
  { v: 86, d: '29/09/2026', items: ['Sorteio ao vivo da Copa do Brasil, com transmissão da Seu Zé TV: globo na mesa, Seu Zé tira o mandante e a apresentadora tira o visitante.', 'Quadro de confrontos numerados, clubes riscados conforme saem do globo, selo de mando de campo.', 'Selos de Duelo de treinadores, Clássico e Alerta de zebra, e chance de classificação de cada lado no fim.', 'Aviso na tela do clube a cada nova fase e botão Assistir/Rever nos cards de sorteio da agenda.'] },
  { v: 85, d: '29/09/2026', items: ['Sorteio: corrigido o bug em que os clubes já sorteados sumiam dos grupos no meio da animação.'] },
  { v: 84, d: '29/09/2026', items: ['Sorteio das copas agora acontece no começo da véspera da 1ª rodada (logo depois do último jogo antes dela), e não 2 minutos antes do jogo.'] },
  { v: 83, d: '29/09/2026', items: ['Card do jogador mais limpo: a carta aparece sozinha e, com um toque, vira mostrando moral, condição, números da temporada, clube, contrato, valor e salário no verso.', 'App instalado: páginas curtas não levantam mais a barra de abas (a página sempre ocupa a tela inteira).'] },
  { v: 82, d: '29/09/2026', items: ['Barra de abas de volta a uma linha só na base do app instalado.', 'Ao trocar de aba ou de sub-aba, a tela sobe antes de desenhar a nova página, sem o pulo da barra.'] },
  { v: 81, d: '29/09/2026', items: ['Objetivo premiado: a barra "Acima do esperado" mostra o saldo negativo quando você rende abaixo do previsto.', 'Campinho: selo C no capitão e V no vice.', 'Mercado: abas na ordem Pacote, Buscar, Favoritos (antes Minha lista), Listas e o resto.', 'App instalado: a barra de abas fica fixa na base, sem o pulo ao trocar de tela.', 'Calendário da agenda vira atalho: toque em qualquer dia da temporada pra pular até ele, com cores por tipo de dia e botão Ir pra hoje.', 'Treino individual (1★, 10 dias, um jogador por vez): aprender uma posição próxima ou evolução acelerada com +1 de overall garantido.'] },
  { v: 80, d: '29/09/2026', items: ['Sorteio com cara de transmissão: logo da TSPN e selo VIVO no topo.', 'Quadro do sorteio fixo: a revelação da bolinha não faz mais a janela crescer e encolher.', 'Sorteio mais lento no ritmo normal; o ×2 continua pra quem quiser acelerar.'] },
  { v: 79, d: '29/09/2026', items: ['Sorteio com as cores de cada copa.', 'Potes de vidro de verdade: as bolinhas ficam dentro, o pote chacoalha e a bolinha sai de lá.', 'Dupla de apresentadores em pixel art comandando o sorteio, com balões de fala.'] },
  { v: 78, d: '29/09/2026', items: ['Sorteio ao vivo das copas (Libertadores, Sul-Americana, Conferência e regionais): potes, bolinhas e revelação dos escudos, com suspense no seu clube.', 'Aviso na tela inicial quando o sorteio sai, botão na agenda pra assistir ou rever, ×2 e Pular.', 'No fim: Grupo da morte, seu grupo e duelos entre treinadores.'] },
  { v: 77, d: '29/09/2026', items: ['Busca de jogadores mais enxuta: botão Filtros abre uma gaveta com barras deslizantes (overall, idade, valor e salário).', 'Filtros ativos aparecem como etiquetas que se removem com um toque.', 'Atalhos prontos: Cabem no bolso, Barganhas, Jovens promessas e Contrato acabando.'] },
  { v: 76, d: '29/09/2026', items: ['Capitão: trocar várias vezes não tira mais moral a cada troca. O efeito sai uma vez só, no próximo jogo, e só se o capitão mudou de fato.'] },
  { v: 75, d: '29/09/2026', items: ['Tela inicial mostra a versão do jogo; tocando nela, aparecem as novidades de cada versão.'] },
  { v: 74, d: '29/09/2026', items: [
    'Especulação no CHANCE: jogadores da sua lista de observação viram rumor de vez em quando ("no radar", "interesse" e, se houver proposta de verdade, "proposta").',
    'Inteira-Hora: o bloco "E MAIS" agora tem 4 chamadas, sem espaço vazio.',
    'Piadocas: estão todas as 101, e cada uma só se repete depois de uns 25 dias fictícios.',
    'Manchetes da coletiva: agora acompanham o que foi dito (elogio, neutro, crítica ou ataque). Só ataque vira "detona" e aumenta o risco de STJD.',
    'Mercado internacional: gigantes europeus buscam jovens de potencial alto e árabes ricos buscam craques no auge, os dois pagando acima do valor.',
    'Leilão: outros clubes podem cobrir a proposta pelo seu jogador, e jogador disputado fica mais caro pra você.',
    'Capitão e vice: escolha em Elenco › Escalação, com efeito na moral do grupo, no motim e em notícias.',
    'Promoção de ingresso: ingresso barato em clássico, decisão ou estreia de reforço vira notícia e rende torcida.',
    'Filtros de valor e salário: mínimo e máximo na busca de jogadores.',
    'Empréstimos: você negocia a taxa e a divisão do salário, com contraproposta nos dois sentidos.',
    'Histórico de empréstimos: duração, taxa, divisão do salário e data de volta aparecem na ficha do jogador e em Mercado › Histórico.',
  ] },
  { v: 73, d: '28/09/2026', items: ['Novo logo na tela inicial.'] },
  { v: 72, d: '28/09/2026', items: ['Gata da Hora: 65 frases novas, em rodízio sem repetir dentro da temporada.'] },
];
function changelogModal() {
  return `<h2 class="sech big">${ic('star')} Novidades</h2>
    <div class="stack" style="gap:10px">${CHANGELOG.map((e, i) => `<details class="clog" ${i === 0 ? 'open' : ''}><summary><b>Versão ${e.sv || e.v}</b><span class="small muted">${esc(e.d)}</span></summary>
      <ol>${e.items.map(t => `<li>${esc(t)}</li>`).join('')}</ol></details>`).join('')}</div>`;
}

// rolagem da página: no app instalado (PWA) quem rola é o body (a barra de abas nunca pula); no navegador, a janela
function pageY() { return window.scrollY || document.body.scrollTop || 0; }
function pageTo(y) { try { window.scrollTo(0, y); } catch (e) {} document.body.scrollTop = y; }
// ===== UI parte 0: ícones e sons =====
const ICON_P = {
  dna: '<path d="M6 3c0 4 12 5 12 9s-12 5-12 9"/><path d="M18 3c0 4-12 5-12 9s12 5 12 9"/><path d="M8 5h8M8 19h8M8.5 12h7"/>',
  alvo: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M17.5 6.5L21 3M18.5 3.2l2.5-.2-.2 2.5"/>',
  fama: '<circle cx="12" cy="9" r="6"/><path d="M8.6 13.9L7 22l5-2.8 5 2.8-1.6-8.1"/><path d="M12 6l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/>',
  revela: '<path d="M12 21v-9"/><path d="M12 12c0-4.5-3-7-7.5-7 0 4.5 3 7 7.5 7z"/><path d="M12 10c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"/><path d="M8 21h8"/>',
  gestao: '<path d="M3 20h18"/><path d="M5 17v-4M10 17V9M15 17v-6M20 17V5"/><path d="M4 9l5-4 5 3 6-5"/>',
  raiz: '<path d="M12 3v8"/><path d="M12 6.5c-1.6-1.8-3.4-2.3-5-2 .2 2 1.8 3.2 5 3.2M12 5c1.4-1.4 3-1.8 4.5-1.5-.3 1.7-1.8 2.7-4.5 2.7"/><path d="M4 11h16"/><path d="M12 11c0 4-3 7-6 9M12 11c0 4 3 7 6 9M12 11v10"/>',
  coroa: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z"/><path d="M5 21h14"/>',
  tap: '<path d="M9 11V5a2 2 0 014 0v6"/><path d="M13 10a2 2 0 014 0v2M17 12a2 2 0 014 0v3a6 6 0 01-6 6h-2a6 6 0 01-5-3l-3-5a2 2 0 013-2l2 2"/><path d="M5 5l-2-2M17 5l2-2"/>',
  homei: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  news: '<rect x="3" y="4" width="15" height="16" rx="2"/><path d="M18 8h3v10a2 2 0 01-2 2M7 8h7M7 12h7M7 16h4"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.4 4.5H9.6l-1.4-4.5z"/><path d="M12 3v4.5M20.5 10l-4.7.3M17.5 19.5l-3.1-4.7M6.5 19.5l3.1-4.7M3.5 10l4.7.3"/>',
  card: '<rect x="7" y="3.5" width="10" height="17" rx="2" fill="currentColor" stroke="none"/>',
  swap: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
  med: '<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" fill="currentColor" stroke="none"/>',
  glove: '<path d="M7 12V6.5a1.5 1.5 0 013 0V11M10 10V4.5a1.5 1.5 0 013 0V10M13 10V5.5a1.5 1.5 0 013 0V11M16 11V8.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7h-.5a6 6 0 01-5.2-3l-2-3.6a1.6 1.6 0 012.6-1.8L7 14"/>',
  miss: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 9l6-6M17 3h4v4"/>',
  tactic: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8.5 11l2 2 4-4M8.5 17h7"/>',
  whistle: '<path d="M2.5 10H14a5.5 5.5 0 11-5.4 6.5"/><circle cx="14" cy="15.5" r="1.8" fill="currentColor"/><path d="M8 10V7.5h5"/>',
  star: '<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="currentColor" stroke="none"/>',
  gem: '<path d="M12 2l9 9-9 11-9-11z" fill="currentColor" stroke="none"/><path d="M3 11h18M12 2l-4 9 4 11 4-11z" stroke="rgba(0,0,0,.3)" stroke-width="1.3" fill="none"/>',
  medal: '<path d="M8 2.5h3l1.5 5M16 2.5h-3" /><circle cx="12" cy="15" r="6.2" fill="currentColor" stroke="none"/><path d="M12 11.7l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="rgba(0,0,0,.3)" stroke="none"/>',
  tiger: '<path d="M6.2 9.2 4.6 4.8l4.2 2.1M17.8 9.2l1.6-4.4-4.2 2.1"/><path d="M12 6.6c-4.1 0-7.3 3-7.3 7 0 3.7 3.2 6.8 7.3 6.8s7.3-3.1 7.3-6.8c0-4-3.2-7-7.3-7z"/><path d="M12 6.6v2.3M9.6 7.1l.7 1.8M14.4 7.1l-.7 1.8M4.9 12.2l2.2.5M19.1 12.2l-2.2.5M5.2 15.4l2-.2M18.8 15.4l-2-.2"/><circle cx="9.4" cy="12.4" r="1" fill="currentColor"/><circle cx="14.6" cy="12.4" r="1" fill="currentColor"/><path d="M10.8 15.2h2.4L12 16.4z" fill="currentColor"/><path d="M12 16.4v.9M10.2 18.1c.6.4 1.2.5 1.8.5s1.2-.1 1.8-.5"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8 20h8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v6M18 9v6"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  stadium: '<ellipse cx="12" cy="9.5" rx="9" ry="3.5"/><path d="M3 9.5v6c0 2 4 3.6 9 3.6s9-1.6 9-3.6v-6"/><path d="M7.5 12.6v5.8M12 13v6M16.5 12.6v5.8"/><path d="M3.5 2.5v4M20.5 2.5v4"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z"/><path d="M15 7.5v2M15 11v2M15 14.5v2"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  shirt: '<path d="M8 3l-5 3 2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 01-8 0z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  dumbbell: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
  sprout: '<path d="M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-4 3-6 7-6 0 4-3 6-7 6z"/>',
  handshake: '<path d="M3 11l4-4 5 2 5-2 4 4-5 5-4-3-4 3z"/><path d="M8 14l3 3M11 12l3 3"/>',
  vs: '<path d="M4 5l4 10 4-10M20 7c-1-2-5-2-5 1s5 2 5 5-4 3-5 1"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/>',
  renew: '<path d="M20 11a8 8 0 10-2.3 5.7M20 5v6h-6"/>',
  out: '<path d="M14 4h5a1 1 0 011 1v14a1 1 0 01-1 1h-5M10 17l-5-5 5-5M5 12h11"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  sell: '<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.6" fill="currentColor"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  bug: '<path d="M8 9a4 4 0 018 0v5a4 4 0 01-8 0z"/><path d="M12 9v9M4 13h4M16 13h4M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2M10 5l-1-2M14 5l1-2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5V14M12 17.2v.1"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  feather: '<path d="M20 4C11 4 6 9 6 18l-2 2M6 18c7 0 12-5 12-11M10 14h5"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" stroke="none"/>',
  flame: '<path d="M12 22c-4 0-7-3-7-7 0-4 3-6 4-10 2 2 3 4 3 6 1-1 2-2 2-4 3 2 5 5 5 8 0 4-3 7-7 7z" fill="currentColor" stroke="none"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z" fill="currentColor" stroke="none"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
  // estilos
  s_equilibrado: '<path d="M12 4v16M6 20h12M4.5 8h15M4.5 8L2 14h5zM19.5 8L17 14h5z"/>',
  s_gegenpress: '<path d="M13 2L4.5 14H11l-1 8L18.5 10H12z" fill="currentColor" stroke="none"/>',
  s_tikitaka: '<circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><circle cx="12" cy="5" r="2.2"/><path d="M6.3 16.2L10.8 7M13.2 7l4.5 9.2M7.2 18h9.6"/>',
  s_contra: '<path d="M4 20L20 4M11 4h9v9"/><path d="M4 13v7h7"/>',
  s_direto: '<path d="M3 18c4-13 14-13 18 0"/><path d="M16.5 14.5L21 18l-5.5 1"/>',
  s_pressao: '<path d="M12 2c3.5 3 5.5 6.3 5.5 10.3a5.5 5.5 0 01-11 0c0-2.2 1-3.7 2.2-4.8 0 2 1 3.2 2.2 3.2 0-3-1.2-5.7 1.1-8.7z" fill="currentColor" stroke="none"/>',
  s_retranca: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="currentColor" fill-opacity=".25"/><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  s_pontas: '<path d="M3 5v14M21 5v14"/><path d="M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l-3 3" transform="rotate(180 12 12)"/>',
};
const TK_NAME = { barato: 'Barato', normal: 'Normal', caro: 'Caro', abusivo: 'Abusivo' };
const ic = (name, cls = '', style = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${style}" aria-hidden="true">${ICON_P[name] || ''}</svg>`;
const STYLE_COL = { equilibrado: 'var(--stone)', gegenpress: 'var(--yellow)', tikitaka: 'var(--mint)', contra: 'var(--blue)', direto: 'var(--orange)', pressao: 'var(--coral)', retranca: 'var(--purple)', pontas: 'var(--green)' };
const RIGOR_COL = ['#A3F57E', '#D7FF3A', '#FFD84A', '#FF8A3D', '#F06B5F'];
const refChip = ref => !ref ? '' : `<span class="refc" style="--rc:${RIGOR_COL[ref.rigor - 1]}">${ic('whistle')}<b>${esc(ref.name)}</b><span class="rbar">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= ref.rigor ? 'on' : ''}"></i>`).join('')}</span></span>`;
const CAT_ICON = { dia: 'gem', oe: 'medal', our: 'medal', pra: 'medal', bro: 'medal', cob: 'sprout' };
const CAT_COL = { dia: 'var(--c-dia)', oe: 'var(--c-our)', our: 'var(--c-our)', pra: 'var(--c-pra)', bro: 'var(--c-bro)', cob: 'var(--c-cob)', mix: 'var(--pink)' };
const CAT_NAME = { dia: 'Diamante', oe: 'Ouro Especial', our: 'Ouro', pra: 'Prata', bro: 'Bronze', cob: 'Cobre', mix: 'Coringa' };
const catBadge = (k, big) => `<span class="catb ${big ? 'big' : ''}" style="--cc:${CAT_COL[k]}">${ic(CAT_ICON[k])}</span>`;
// Séries B e C: o diamante da carteira aparece como Ouro (mesmo saldo)
const myOuro = () => { try { return !!(S && S.club && !S.unemployed && MK.isOuro(S)); } catch (e) { return false; } };
const gemIcS = st => myOuro() ? ic('medal', '', String(st || '').replace(/color:[^;]*/, 'color:var(--c-our)')) : ic('gem', '', st);
const gemIc = () => myOuro() ? ic('medal') : ic('gem'), gemCls = () => myOuro() ? 'ou' : 'dm', gemName = n => myOuro() ? 'Ouro' : n === 1 ? 'diamante' : 'diamantes';
const costHTML = ([s, d]) => `<span class="cost">${s ? `<span class="cur st">${ic('star')}${s}</span>` : ''}${d ? `<span class="cur ${gemCls()}">${gemIc()}${d}</span>` : ''}${!s && !d ? 'grátis' : ''}</span>`;
// carinha de moral (afeta ±5% o rendimento em campo)
function moodFace(v) {
  const lv = v >= 80 ? 4 : v >= 62 ? 3 : v >= 45 ? 2 : v >= 30 ? 1 : 0;
  const col = ['#F06B5F', '#FF8A3D', '#FFD84A', '#C5F56E', '#7BEA6A'][lv];
  const mouth = ['M8 17c1.5-2.5 6.5-2.5 8 0', 'M8.5 16.5c1.5-1.4 5.5-1.4 7 0', 'M8.5 15.5h7', 'M8.5 14.5c1.5 1.6 5.5 1.6 7 0', 'M8 14c1.5 3 6.5 3 8 0'][lv];
  const brows = lv === 0 ? '<path d="M7.5 8.5l3 1.2M16.5 8.5l-3 1.2"/>' : '';
  return `<svg class="mood" viewBox="0 0 24 24" aria-label="Moral ${Math.round(v)}"><circle cx="12" cy="12" r="10" fill="${col}"/><g fill="none" stroke="#1A1410" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="10.5" r=".6" fill="#1A1410"/><circle cx="15" cy="10.5" r=".6" fill="#1A1410"/><path d="${mouth}"/>${brows}</g></svg>`;
}
const EV_ICON = { goal: ['ball', 'var(--lime)'], save: ['glove', 'var(--mint)'], miss: ['miss', 'var(--muted)'], yellow: ['card', '#FFD84A'], red: ['card', 'var(--coral)'], red2: ['card', 'var(--coral)'],
  injury: ['med', 'var(--coral)'], sub: ['swap', 'var(--blue)'], tactic: ['tactic', 'var(--purple)'], pens: ['ball', 'var(--yellow)'], ht: ['clock', 'var(--mint)'], foul: ['whistle', 'var(--orange)'], goal_off: ['ball', 'var(--muted)'], var: ['tactic', 'var(--blue)'], offside: ['whistle', 'var(--yellow)'], reorg: ['tactic', 'var(--purple)'] };

// ---------- áudio: sintetizado com Web Audio offline (filtros, reverb, estéreo), exportado em WAV
// e tocado com <audio> (funciona em iframe e no iPhone no modo silencioso) ----------
// sons desligados por enquanto (vão ser refeitos). Mantém só a vibração.
const SFX = new Proxy({ on: false, cfg: { vol: 0, ui: false, match: false, crowd: false, vib: true, on: false }, ambience() {}, set() {}, toggle() { return false; },
  vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} } }, { get: (t, k) => (k in t ? t[k] : () => {}) });

// ---------- computador (mouse/trackpad): faixas que rolam pro lado ----------
// No celular elas rolam com o dedo; no notebook a roda do mouse só rola na vertical e a barra fica escondida.
// Aqui: a roda vira rolagem lateral nas faixas baixas (abas, chips) e dá pra arrastar com o mouse.
(() => {
  const hStrip = el => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (n.scrollWidth > n.clientWidth + 2 && n.clientHeight < 140) {
        const ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll') return n;
      }
    }
    return null;
  };
  document.addEventListener('wheel', ev => {
    if (ev.ctrlKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return;   // trackpad lateral já funciona
    const s = hStrip(ev.target); if (!s) return;
    const max = s.scrollWidth - s.clientWidth, d = ev.deltaY * (ev.deltaMode === 1 ? 16 : 1);
    if ((d < 0 && s.scrollLeft <= 0) || (d > 0 && s.scrollLeft >= max - 1)) return;   // chegou na ponta: deixa a página rolar
    s.scrollLeft += d; ev.preventDefault();
  }, { passive: false });
  let drag = null;
  document.addEventListener('pointerdown', ev => {
    if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
    const s = hStrip(ev.target); if (!s) return;
    drag = { s, x: ev.clientX, left: s.scrollLeft, moved: false };
  });
  document.addEventListener('pointermove', ev => {
    if (!drag) return;
    const dx = ev.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 6) return;
    drag.moved = true; drag.s.scrollLeft = drag.left - dx; drag.s.classList.add('dragging');
  });
  document.addEventListener('pointerup', () => { if (!drag) return; const d = drag; drag = null; d.s.classList.remove('dragging'); if (d.moved) { const kill = e => { e.stopPropagation(); e.preventDefault(); }; document.addEventListener('click', kill, { capture: true, once: true }); setTimeout(() => document.removeEventListener('click', kill, { capture: true }), 50); } });
})();

// ===== UI parte N: liga online =====
// v2: o servidor (Supabase: função "tick" + banco) processa o tempo da liga; os aparelhos só gravam o que o técnico fez.
// Mundo e mesas dos técnicos ficam em linhas separadas e toda gravação é atômica (ou entra inteira, ou não entra).
const NET = (() => {
  const NC = NETCORE;
  const MAX_COACHES = 60;   // 20 por divisão aberta (A, B e C); limite da liga em maxCoaches()
  const APP_URL = (typeof window !== 'undefined' && window.TREINEIROS_BACKEND && location && /^https?:$/.test(location.protocol))
    ? location.origin + location.pathname
    : 'https://treineiros.netlify.app/';
  const LS_LEAGUES = 'treineiros:ligas';
  const TEST_SPEED = 48;          // teste com amigos: 1 dia do jogo = 30 min reais
  const APP_BUILD = 286, APP_VER = '1.24.3';   // v167: versão que o jogador vê segue versionamento semântico (correção: +0.0.1, novidade: +0.1.0)   // sobe a cada versão publicada: aparelho com app velho é avisado pra recarregar
  const SRV_DEAD = 600000;        // v150: servidor sem sinal há 10 min: o app processa sozinho (contingência)
  const LS_TOK = 'treineiros:tok';
  // v152: token por liga (entrar com código numa liga não troca o treinador das outras ligas deste aparelho)
  const LS_TOKL = c => 'treineiros:tok:' + c;
  let baseMe = null;
  let SB = null, me = null, online = false, ready = false, code = null, leagueInfo = null;
  const sess = 's' + Math.random().toString(36).slice(2, 10);
  let base = null, editSeq = 0, syncedSeq = 0, lastV = null;
  let queue = Promise.resolve(), timer = null, lastErr = null, status = 'offline', hasWorld = false;
  const listeners = [];
  const emit = (what) => listeners.forEach(f => { try { f(what); } catch (e) { console.error(e); } });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const serialize = st => JSON.stringify(st);
  const retry = async (fn, n = 3) => { let e; for (let i = 0; i < n; i++) { try { return await fn(); } catch (x) { e = x; if (x && x.code === 'invalid_argument') break; await sleep(400 * (i + 1)); } } throw e; };

  // ---------- Supabase ----------
  const H = () => ({ apikey: SB.key, Authorization: 'Bearer ' + SB.key, 'Content-Type': 'application/json' });
  const fail = async r => { let m = ''; try { m = await r.text(); } catch (e) {} const e = new Error('supabase ' + r.status + ' ' + m.slice(0, 160)); e.code = r.status === 401 || r.status === 403 ? 'invalid_argument' : r.status === 404 ? 'no_backend' : 'unavailable'; throw e; };
  // v150: toda chamada desiste em 20s (banco lento não acumula conexões penduradas)
  const tfetch = (url, o) => { const ac = typeof AbortController !== 'undefined' ? new AbortController() : null; const t = ac ? setTimeout(() => ac.abort(), 20000) : null; return fetch(url, ac ? { ...o, signal: ac.signal } : o).finally(() => t && clearTimeout(t)); };
  async function rpc(fn, args) {
    const r = await tfetch(`${SB.url}/rest/v1/rpc/${fn}`, { method: 'POST', headers: H(), body: JSON.stringify(args || {}), cache: 'no-store' });
    if (!r.ok) await fail(r);
    const t = await r.text(); return t ? JSON.parse(t) : null;
  }
  async function kvGet(path) {
    const r = await tfetch(`${SB.url}/rest/v1/kv?path=eq.${encodeURIComponent(path)}&select=data`, { headers: H(), cache: 'no-store' });
    if (!r.ok) await fail(r);
    const rows = await r.json(); const d = rows[0] && rows[0].data;
    return d && Object.keys(d).length ? d : null;
  }
  async function kvSet(path, data) {
    const r = await fetch(`${SB.url}/rest/v1/kv?on_conflict=path`, { method: 'POST', headers: { ...H(), Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ path, data }) });
    if (!r.ok) await fail(r);
  }
  // campainha do servidor: pede pra processar agora (jogo começando, ADM adiantou etc.)
  let lastNudge = 0, fastUntil = 0, ringOK = null;
  function nudge(force) {
    if (!code || !SB) return;
    if (!force) { if (Date.now() - lastNudge < 60000) return; if (lastV && lastV.next && (lastV.now || Date.now()) - lastV.next < 15000) return; if (Math.random() < 0.6) { lastNudge = Date.now() - 30000; return; } }
    else if (Date.now() - lastNudge < 8000) return;
    lastNudge = Date.now(); fastUntil = Date.now() + 30000;
    // v195: campainha leve: só marca a liga como "na hora" e o servidor do Railway pega na próxima volta (antes abria a liga inteira numa função fria)
    const c0 = code, edge = () => fetch(`${SB.url}/functions/v1/tick`, { method: 'POST', headers: H(), body: JSON.stringify({ code: c0 }) }).catch(() => {});
    edge();   // v198: voltou pra função do Supabase: ela processa a liga em paralelo ao servidor do Railway (no pico, só o Railway não dava conta: o processamento é CPU de um núcleo só)
  }
  // v190: alarme — se uma sincronização apagar uma transferência desta temporada que existia no aparelho, manda relatório automático (com o caminho)
  let lossSent = 0;
  function lossCheck(label, before, after) {
    try {
      if (!before || !after || lossSent >= 3) return;
      const sea = after.season, A = new Set((after.trlog || []).filter(e => e[0] === sea).map(e => JSON.stringify(e)));
      const lost = (before.trlog || []).filter(e => e[0] === sea && !A.has(JSON.stringify(e)));
      if (!lost.length) return;
      lossSent++;
      bugSend(`[automático] sincronização perdeu ${lost.length} transferência(s) · caminho ${label} · v${APP_BUILD} · ${lost.slice(0, 3).map(e => JSON.stringify(e.slice(0, 7))).join(' ')}`, '').catch(() => {});
    } catch (e) {}
  }
  const SRV_KEYS = ['season', 'seasonStart', 'slot', 'lastT', 'lastDay', 'fdSeen', 'fdSeenS', 'objV', 'played', 'comp', 'streak', 'history', 'refLast', 'qual', 'obj', 'selecao', 'divA', 'divB', 'divC', 'divDx', 'srvB', 'youthLog', 'post', 'archive', 'nextSuper'];
  // v153: servidor fora do ar -> só um aparelho por liga joga as partidas (senão cada celular sorteia um placar diferente)
  // líder: o ADM, se entrou nos últimos 30 min; senão, o token mais baixo entre quem entrou nos últimos 30 min
  // v157: fila de reserva. Ordem: ADM (se entrou nos últimos 30 min), depois os outros ativos por token.
  // O 1º da fila joga quando o jogo atrasa 60s; se ele sumiu, o 2º assume aos 100s, o 3º aos 140s...
  function myRank() {
    if (!S || !S.desks || !S.desks[me]) return -1;
    const now = Date.now(), on = t => S.desks[t] && S.desks[t].seen && now - S.desks[t].seen < 30 * 60e3;
    const adm = leagueInfo && leagueInfo.admin;
    const act = Object.keys(S.desks).filter(t => on(t) && t !== adm).sort();
    if (adm && on(adm)) act.unshift(adm);
    if (!act.includes(me)) act.push(me);
    return act.indexOf(me);
  }
  function amLeader() { return myRank() === 0; }
  const lateMs = v => v && v.next ? (v.now || Date.now()) - v.next : 0;
  const myTurn = v => { const r = myRank(); return r >= 0 && lateMs(v) > 60000 + Math.min(r, 8) * 12000; };   // v158: fila mais curta (liga de 60: ninguém espera mais de ~3 min)
  const srvAlive = v => !!(v && v.srv && (v.now || Date.now()) - v.srv < SRV_DEAD);

  // ---------- estado local ----------
  function adopt(world) {
    const prevSeason = S && S.season;
    Wd.migrate3(world); Wd.bindDesks(world);
    world.__me = me;
    if (prevSeason && prevSeason !== world.season) Wd.resetCache();
    S = world; Wd.restoreYouth(S); Wd.touch(S);
  }
  const need = () => NC.need(S);

  // busca no servidor o que mudou desde a minha base (mundo por patch quando dá; só as mesas alteradas)
  async function fetchChanges(v) {
    const needW = !base || v.ver !== base.ver;
    const deskT = Object.keys(v.desks || {}).filter(t => !base || !base.desks[t] || base.desks[t].ver !== v.desks[t]);
    const gone = base ? Object.keys(base.desks).filter(t => !(t in (v.desks || {}))) : [];
    if (!needW && !deskT.length && !gone.length) return null;
    const th = { ver: base ? base.ver : 0, w: base ? base.w : null, desks: { ...(base ? base.desks : {}) } };
    if (needW) {
      const r = await retry(() => rpc('league_world_get', { p_code: code, p_have: base ? base.ver : null }));
      if (!r) throw Object.assign(new Error('missing'), { code: 'missing' });
      let ok = false;
      if (r.patch && base && r.from === base.ver) { try { th.w = JSON.stringify(NC.patch(JSON.parse(base.w), JSON.parse(await NC.dec(r.z, r.patch)))); th.ver = r.ver; ok = true; } catch (e) {} }
      if (!ok) {
        const full = r.data != null ? r : await retry(() => rpc('league_world_get', { p_code: code, p_have: null }));
        th.w = await NC.dec(full.z, full.data); th.ver = full.ver;
      }
    }
    if (deskT.length) for (const row of await retry(() => rpc('league_desks_get', { p_code: code, p_tokens: deskT }))) th.desks[row.token] = { ver: row.ver, str: await NC.dec(row.z, row.data) };
    for (const t of gone) delete th.desks[t];
    return th;
  }
  // junta: o que eu mudei (mine) sobre o que chegou (theirs), a partir da base comum
  // v194: o motor nunca apaga dono (own), ficha (ps) nem linha do histórico (trlog). Se a mistura "apagou", foi uma
  // versão minha mais velha que a base: devolve o que o servidor tem (era a causa provável das compras desfeitas)
  function protect(w, t) {
    for (const k of ['own', 'ps']) { if (!t[k]) continue; w[k] = w[k] || {}; for (const id in t[k]) if (!(id in w[k])) w[k][id] = t[k][id]; }
    if (Array.isArray(t.trlog)) {
      const have = new Set((w.trlog || []).map(e => JSON.stringify(e))), miss = t.trlog.filter(e => !have.has(JSON.stringify(e)));
      if (miss.length) w.trlog = [...(w.trlog || []), ...miss].sort((a, b) => ((a[0] || 0) - (b[0] || 0)) || ((a[1] || 0) - (b[1] || 0)));
    }
    return w;
  }
  function mergeAll(mineStr, th) {
    const dk = {};
    if (!mineStr || !base) { for (const t in th.desks) dk[t] = th.desks[t].str; return NC.join(th.w, dk); }
    const mine = NC.split(JSON.parse(mineStr));
    let wStr = mine.w === base.w ? th.w : th.w === base.w ? mine.w : JSON.stringify(NC.merge3(JSON.parse(base.w), JSON.parse(mine.w), JSON.parse(th.w)));
    // resultados, tabela e calendário são do servidor: nunca misturar com uma simulação local (evita "duas realidades")
    if (wStr !== th.w) { const w = JSON.parse(wStr), t = JSON.parse(th.w); for (const k of SRV_KEYS) { if (k in t) w[k] = t[k]; else delete w[k]; } protect(w, t); wStr = JSON.stringify(w); }
    for (const t of new Set([...Object.keys(mine.desks), ...Object.keys(th.desks)])) {
      const b = base.desks[t] && base.desks[t].str, m = mine.desks[t], tt = th.desks[t] && th.desks[t].str;
      if (tt === undefined) { if (b === undefined && m !== undefined) dk[t] = m; continue; }   // mesa nova minha / removida por eles
      if (m === undefined) { if (b === undefined) dk[t] = tt; continue; }                     // mesa nova deles / removida por mim
      dk[t] = m === b ? tt : tt === b ? m : JSON.stringify(NC.merge3(JSON.parse(b), JSON.parse(m), JSON.parse(tt), 'desks.' + t));
    }
    return NC.join(wStr, dk);
  }

  // um ciclo: vê as versões, puxa o que mudou, junta com o que eu fiz e grava (atômico). Sem trava: se outro gravou antes, junta de novo.
  let queued = 0, prePush = null, preBase = null, conflicts = 0, commitSnap = null;
  let gen = 0;   // v194: muda ao abrir/fechar liga; sincronização de outra liga em voo é descartada
  let retryN = 0, retryT = null;
  function sync(opts = {}) {
    if (queued >= 2 && !opts.mutate) return queue;   // já tem sincronização na fila
    queued++;
    const g = gen;
    queue = queue.then(() => g === gen ? syncNow(opts, g) : null).then(() => { queued--; conflicts = 0; retryN = 0; return true; }, e => { queued--; throw e; }).catch(e => {
      if (g !== gen || (e && e.code === 'stale')) return false;   // v194: era da liga anterior: não mexe em nada da liga aberta agora
      if (e && e.message === 'conflict' && prePush && conflicts < 8) {
        // outro aparelho (ou o servidor) gravou antes: volta pro que eu tinha antes de gravar e junta de novo com a versão nova
        conflicts++;
        // descarta o que o ciclo fez (mutate/processamento), mas preserva o que o técnico mexeu enquanto gravava
        try { const cur = serialize(S), S0 = S; adopt(commitSnap && cur !== commitSnap ? NC.merge3(JSON.parse(commitSnap), JSON.parse(cur), JSON.parse(prePush)) : JSON.parse(prePush)); lossCheck('conflito', S0, S); } catch (x) {}
        if (preBase) base = preBase;
        prePush = null; preBase = null; status = 'sincronizando'; emit('status');
        setTimeout(() => sync(opts), 150 + Math.random() * 400 * conflicts);
        return false;
      }
      conflicts = 0;
      lastErr = e; status = 'erro'; emit('status'); console.error('sync', e);
      // v162: falha de conexão/banco lento (timeout, 5xx, rede): NÃO desfaz o que o técnico mexeu; tenta gravar de novo em seguida
      // v186: inclusive o que ele mexeu DURANTE o envio (antes voltava pro prePush e perdia, ex.: acordo com o clube)
      const perm = e && ['denied', 'blocked', 'missing', 'invalid_argument', 'outdated', 'no_backend', 'nokey'].includes(e.code);
      if (!perm && S && editSeq !== syncedSeq) { try { if (prePush) { const cur = serialize(S), S0 = S; adopt(commitSnap && cur !== commitSnap ? NC.merge3(JSON.parse(commitSnap), JSON.parse(cur), JSON.parse(prePush)) : JSON.parse(prePush)); lossCheck('erro-rede', S0, S); if (preBase) base = preBase; emit({ type: 'world' }); } } catch (x) {} prePush = null; preBase = null; retryN = Math.min(retryN + 1, 6); clearTimeout(retryT); retryT = setTimeout(() => sync(), 3000 * retryN); return false; }
      // erro definitivo: o que mudou localmente não foi salvo, volta pro último estado da liga
      if (base) { try { const dk = {}; for (const t in base.desks) dk[t] = base.desks[t].str; const S0 = S; adopt(NC.join(base.w, dk)); lossCheck('erro-definitivo ' + (e && e.code || ''), S0, S); syncedSeq = editSeq; emit({ type: 'world' }); } catch (x) {} }
      return false;
    });
    return queue;
  }
  async function syncNow(opts, g = gen) {
    if (!online || !code) return;
    const chk = () => { if (g !== gen) throw Object.assign(new Error('stale'), { code: 'stale' }); };
    status = 'sincronizando'; emit('status');
    let changedView = false;
    const v = await retry(() => rpc('league_versions', { p_code: code }));
    chk();
    if (!v) throw Object.assign(new Error('missing'), { code: 'missing' });
    lastV = v;
    const seqAtStart = editSeq;
    const mineStr = S && base && editSeq !== syncedSeq ? serialize(S) : null;
    // v186: foto do estado no início, pra não perder o que o técnico fizer DURANTE o download
    // (antes, sem nada pendente no início, o mundo baixado substituía tudo: ex. acordo com o clube sumia → "Acerte primeiro a taxa")
    const startStr = mineStr || (S ? serialize(S) : null);
    const th = await fetchChanges(v);
    freshAt = Date.now();   // v284: a partir daqui o aparelho tem o mundo do servidor
    chk();
    if (th) {
      let world = mergeAll(mineStr, th);
      if (editSeq !== seqAtStart && startStr) world = NC.merge3(JSON.parse(startStr), JSON.parse(serialize(S)), world);   // mexeu enquanto baixava
      const S0 = S; adopt(world); lossCheck('download', S0, S); base = th; changedView = true;
    }
    prePush = S ? serialize(S) : null; preBase = base;
    if (opts.mutate) opts.mutate();
    let out = null, more = false;
    // v156: jogo atrasado 60s+ = o servidor não deu conta (liga grande demais pra ele no pico): o líder da liga joga a partida no aparelho
    const late = lateMs(v) > 60000;
    const alive = srvAlive(v) && !late;
    const member = !!(S && S.desks && S.desks[me]);   // v147: quem ainda não tem treinador na liga só olha (não processa nem grava)
    if (S && member && opts.process !== false && need()) {
      if (alive) nudge();
      else if (myTurn(v) || (!srvAlive(v) && amLeader())) { out = SE.process(S, 4); changedView = true; more = need(); }   // contingência: servidor fora do ar (um aparelho por vez, pela fila de reserva)
    }
    const seqPushed = editSeq;
    commitSnap = S ? serialize(S) : null;
    if (S && base && (member || (S.desks && S.desks[me]))) {
      const r = await NC.commit(rpcC, code, base, S, { by: me || sess, sec: keyOK === false || !me ? null : mySec(me) });
      chk();
      if (!r.ok) {
        if (r.why === 'world' || r.why === 'desk') throw new Error('conflict');
        throw Object.assign(new Error('commit ' + (r.why || '?')), { code: r.why || 'commit' });
      }
      if (!r.same) base = r.base;
    }
    prePush = null; preBase = null;
    syncedSeq = seqPushed;
    if (editSeq !== seqPushed) setTimeout(() => sync(), 300);   // mudança feita durante o envio: não perde
    hasWorld = !!S;
    status = 'online'; lastErr = null;
    adminClaim();
    if (changedView) emit({ type: 'world', out });
    emit('status');
    if (more) setTimeout(() => sync(), 600);
    else if (S && need() && alive) nudge();
  }
  function touched() { editSeq++; clearTimeout(timer); timer = setTimeout(() => sync(), 700); }

  // consulta leve das versões: só baixa quando algo mudou
  let polling = false, liteOK = null, lastLocal = 0;
  // v284: ação de mercado só com o mundo fresco. Se o último download/confirmação tem mais de FRESH_MS, faz a checagem leve
  // (league_ver_lite, ~200 bytes); mudou → baixa o que mudou e executa a ação em cima do mundo atual (sync com mutate). Sem rede: não executa.
  // Motivo: aparelho que ficou um tempo sem sincronizar negociava em cima de um mundo velho (pré-contrato em jogador já vendido, etc.).
  let freshAt = 0; const FRESH_MS = 30000;
  async function fresh(fn) {
    if (!online || !code || !S) { fn(); return true; }
    if (!queued && Date.now() - freshAt < FRESH_MS) { fn(); return true; }
    if (liteOK !== false) {
      let v = null; try { v = await rpc('league_ver_lite', { p_code: code }); liteOK = true; } catch (e) { if (liteOK == null) liteOK = false; else return { err: 'Sem conexão agora: não dá pra negociar. Tente de novo em instantes.' }; }
      if (v) {
        const dsum = base ? Object.values(base.desks).reduce((a, d) => a + d.ver, 0) + Object.keys(base.desks).length * 1000003 : -1;
        const changed = !base || v.ver !== base.ver || +v.dsum !== dsum;
        if (!changed && !queued) { freshAt = Date.now(); fn(); return true; }
      }
    }
    const ok = await sync({ mutate: fn });
    if (ok) return true;
    return lastErr ? { err: explain(lastErr) } : true;   // conflito: o sync refaz a ação sozinho em cima da versão nova
  }
  async function poll() {
    if (!online || !code || polling || queued) return;
    polling = true;
    try {
      // v147: consulta leve (versão do mundo + resumo das mesas); a lista completa só quando algo mudou
      let v = null, changed;
      if (liteOK !== false) { try { v = await rpc('league_ver_lite', { p_code: code }); liteOK = true; } catch (e) { if (liteOK == null) liteOK = false; else throw e; } }
      if (v) {
        lastV = { ...v, desks: lastV && lastV.desks };
        if (v.chat != null && v.chat !== CH.rev) { const first = CH.rev == null; CH.rev = v.chat; if (!first || v.chat > 0) chatMaybe(); }   // v262: chat da liga
        else if (CH.pend) chatMaybe();
        const dsum = base ? Object.values(base.desks).reduce((a, d) => a + d.ver, 0) + Object.keys(base.desks).length * 1000003 : -1;
        changed = !base || v.ver !== base.ver || +v.dsum !== dsum;
      } else {
        v = await rpc('league_versions', { p_code: code }); lastV = v;
        if (!v) return;
        changed = !base || v.ver !== base.ver || Object.keys(v.desks || {}).some(t => !base.desks[t] || base.desks[t].ver !== v.desks[t]) || Object.keys(base.desks).some(t => !(t in v.desks));
      }
      if (!changed) freshAt = Date.now();   // v284: conferido sem mudança = mundo fresco
      if (changed) sync();
      else if (S && need()) { const late = lateMs(v) > 60000; if (srvAlive(v) && !late) nudge(); else if ((myTurn(v) || (!srvAlive(v) && amLeader())) && Date.now() - lastLocal > 15000) { lastLocal = Date.now(); sync(); } }
      if (status === 'erro' && !changed) { status = 'online'; emit('status'); }
    } catch (e) { /* rede instável: tenta de novo no próximo ciclo */ }
    finally { polling = false; }
  }
  function pollLoop() {
    const vis = typeof document === 'undefined' || document.visibilityState !== 'hidden';
    const ms = Date.now() < fastUntil ? 3000 : vis ? 7000 : 60000;
    setTimeout(() => { poll().finally(pollLoop); }, ms);
  }

  // ---------- migração: liga antiga (pedaços no kv) -> v2 ----------
  const kvBase = c => `leagues/${c}/world`;
  async function readOldWorld(c) {
    const meta = await kvGet(kvBase(c) + '/meta'); if (!meta) return null;
    const okPart = (m, p) => p && p.ver === m.ver && (m.w == null || p.w === m.w);
    const slot = (m, s, i) => kvGet(s != null ? `${kvBase(c)}/s${s}c${i}` : `${kvBase(c)}/c${i}`);
    for (let a = 0; a < 5; a++) {
      const m = a === 0 ? meta : await kvGet(kvBase(c) + '/meta');
      const parts = []; for (let i = 0; i < m.n; i++) parts.push(await slot(m, m.s, i));
      if (parts.every(p => okPart(m, p))) return { meta: m, str: await NC.dec(m.z, parts.map(p => p.d).join('')) };
      if (m.s != null) {   // pedaço corrompido: usa a versão anterior, inteira no outro slot
        const alt = []; for (let i = 0; i < 8; i++) { const p = await slot(m, 1 - m.s, i); if (!p || (alt.length && (p.ver !== alt[0].ver || p.w !== alt[0].w))) break; alt.push(p); }
        if (alt.length) { try { const str = await NC.dec(m.z, alt.map(p => p.d).join('')); JSON.parse(str); return { meta: m, str }; } catch (e) {} }
      }
      await sleep(600);
    }
    return null;
  }
  async function initLeague(c, S0) {
    const sp = NC.split(S0), w = await NC.enc(sp.w), desks = [];
    for (const t in sp.desks) { const e = await NC.enc(sp.desks[t]); desks.push({ token: t, z: e.z, data: e.d }); }
    const na = NC.nextAt(S0);
    return rpc('league_init', { p_code: c, p_z: w.z, p_world: w.d, p_desks: desks, p_next_at: na ? new Date(na).toISOString() : null, p_by: me || sess });
  }
  async function migrate(c) {
    const old = await readOldWorld(c);
    if (!old) return false;
    const S0 = JSON.parse(old.str);
    Wd.migrate3(S0); Wd.bindDesks(S0);
    const r = await initLeague(c, S0);
    // trava a versão antiga: aparelhos com app velho passam a ver "atualize o app"
    try { await kvSet(kvBase(c) + '/meta', { ...old.meta, app: 999, moved: true }); } catch (e) {}
    return !!(r && (r.ok || r.why === 'exists'));
  }

  // ---------- início ----------
  const codeGen = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 6; i++) c += A[Math.floor(Math.random() * A.length)]; return c; };
  const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  function myLeagues() { try { return JSON.parse(localStorage.getItem(LS_LEAGUES) || '[]'); } catch (e) { return []; } }
  function forget(c) { try { localStorage.setItem(LS_LEAGUES, JSON.stringify(myLeagues().filter(x => x.code !== c))); } catch (e) {} }
  function remember(info) {
    const list = myLeagues().filter(x => x.code !== info.code); list.unshift(info);
    try { localStorage.setItem(LS_LEAGUES, JSON.stringify(list.slice(0, 10))); } catch (e) {}
  }
  function inviteFromUrl() {
    try { const m = (location.search + ' ' + location.hash).match(/liga=([A-Za-z0-9]{4,8})/); return m ? normCode(m[1]) : null; } catch (e) { return null; }
  }
  async function init() {
    try { me = localStorage.getItem(LS_TOK); } catch (e) {}
    if (!me) me = 't_' + Math.random().toString(36).slice(2, 12);
    try { localStorage.setItem(LS_TOK, me); } catch (e) {}
    baseMe = me;
    SB = window.TREINEIROS_BACKEND && window.TREINEIROS_BACKEND.url && window.TREINEIROS_BACKEND.key ? window.TREINEIROS_BACKEND : null;
    online = !!SB; ready = true; status = online ? 'online' : 'offline'; if (online) loadProfile();
    if (online) {
      pollLoop();
      try { document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') poll(); }); } catch (e) {}
      // app indo pro fundo / sendo fechado: manda na hora o que ainda não foi salvo (sem esperar o atraso normal)
      const flush = () => { try { if (code && editSeq !== syncedSeq) { clearTimeout(timer); sync(); } } catch (e) {} };
      try { document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); }); window.addEventListener('pagehide', flush); } catch (e) {}
      setInterval(() => { if (code && editSeq !== syncedSeq && !queued) sync(); }, 20000);
      // app aberto há muito tempo (ou salvo na tela inicial) se atualiza sozinho quando sai versão nova
      const upd = async () => {
        try {
          const v = await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json();
          if (v && v.build > APP_BUILD) {
            const go = () => { try { location.replace(location.pathname + '?v=' + v.build + location.hash); } catch (e) { location.reload(); } };
            // aviso pequeno no topo: toque para atualizar (some sozinho quando o app recarrega)
            try {
              let bar = document.getElementById('updbar');
              if (!bar) { bar = document.createElement('button'); bar.id = 'updbar'; bar.type = 'button'; document.body.appendChild(bar); }
              bar.innerHTML = `<b>Nova versão do jogo</b><span>Toque para atualizar</span>`;
              bar.onclick = go;
            } catch (e) {}
            const busyNow = typeof UI !== 'undefined' && (UI.view === 'live' || UI.modal) || editSeq !== syncedSeq;
            if (!busyNow) go(); else document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') go(); }, { once: true });
          }
        } catch (e) {}
      };
      setTimeout(upd, 5000); setInterval(upd, 120000);
      try { document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') upd(); }); } catch (e) {}
    }
    emit('status');
    return { online, invite: inviteFromUrl() };
  }
  // abre uma liga pelo código (carrega o mundo, se já existir)
  async function open(c) {
    c = normCode(c);
    if (!c) return { err: 'Código inválido.' };
    gen++;
    const L = await retry(() => kvGet('leagues/' + c));
    if (!L) return { err: `Não achei nenhuma liga com o código ${c}.` };
    leagueInfo = L;
    { let t = null; try { t = localStorage.getItem(LS_TOKL(c)); } catch (e) {} me = t || baseMe || me; }
    code = c; S = null; base = null; editSeq = 0; syncedSeq = 0; hasWorld = false; chatReset();
    Wd.resetCache();
    let v = await retry(() => rpc('league_versions', { p_code: c }));
    if (!v && await migrate(c)) v = await retry(() => rpc('league_versions', { p_code: c }));
    if (v) {
      let ok = false, err = null;
      for (let t = 0; t < 3 && !ok; t++) { try { ok = await sync({ process: false }); if (!ok) err = lastErr; } catch (e) { err = e; } if (!ok) await sleep(800 * (t + 1)); }   // v157: abre sem processar (não trava); o ciclo seguinte processa se for a vez
      if (!ok && !S) throw err || new Error('open');
    }
    const mine = S && S.desks[me];
    remember({ code: c, name: leagueInfo.name, mode: leagueInfo.mode, admin: leagueInfo.admin === me, club: mine ? mine.club : null });
    emit('status');
    return { ok: true, info: leagueInfo, hasDesk: !!mine };
  }
  function close() { gen++; chatReset(); code = null; S = null; base = null; leagueInfo = null; hasWorld = false; emit('status'); }
  // cria uma liga nova: você é o ADM
  async function createLeague(name, lmode, opts = {}) {
    try { const g = await rpc('league_can_create', { p_by: me }); if (g && g.ok === false) return { err: g.why === 'blocked' ? 'Este aparelho foi bloqueado pelo dono do jogo.' : 'Limite de 3 ligas novas por aparelho a cada 24 horas. Tente de novo amanhã.' }; } catch (e) {}
    let c = null;
    for (let i = 0; i < 5 && !c; i++) { const t = codeGen(); const L = await kvGet('leagues/' + t); if (!L) c = t; }
    if (!c) return { err: 'Não consegui gerar um código livre. Tente de novo.' };
    const info = { code: c, name: (name || '').trim().slice(0, 30) || 'Liga dos Treineiros', admin: me, created: Date.now(), v: 2, mode: lmode === 'turbo' ? 'turbo' : 'normal', divs: opts.solo ? ['A', 'B', 'C'] : opts.divs && opts.divs.length ? opts.divs : ['A', 'B', 'C'], pick: opts.solo || opts.pick === 'choice' ? 'choice' : 'draw', solo: !!opts.solo };
    await kvSet('leagues/' + c, info);
    const r = await open(c);
    if (r.err) return r;
    await createWorld(info.mode);
    return { ok: true, code: c, info };
  }
  async function createWorld(lmode) {
    if (S || !code) return true;
    Wd.resetCache();
    lmode = lmode || (leagueInfo && leagueInfo.mode) || 'normal';
    const w = Wd.newWorld({ now: Date.now(), mode: lmode });
    SE.setupSeason(w); w.lastT = w.seasonStart;
    w.league = { code, name: leagueInfo ? leagueInfo.name : 'Liga', admin: leagueInfo ? leagueInfo.admin : me, divs: (leagueInfo && leagueInfo.divs) || ['A', 'B', 'C'], pick: (leagueInfo && leagueInfo.pick) || 'draw', solo: !!(leagueInfo && leagueInfo.solo) };
    EV.news(w, { t: 'club', title: `Começa a ${w.league.name}`, body: lmode === 'turbo' ? `⚡ Modo Turbo: a temporada ${w.season} inteira em 7 dias reais, com 8 jogos por dia (8h às 23h30).` : `Modo Normal: a temporada ${w.season} dura 28 dias reais, com jogos às 12h e 18h.` });
    Wd.bindDesks(w);
    const r0 = await initLeague(code, w);
    if (r0 && r0.ok === false && (r0.why === 'limit' || r0.why === 'blocked')) throw Object.assign(new Error('init ' + r0.why), { code: r0.why === 'blocked' ? 'blocked' : 'limit' });
    base = null;
    return sync({ process: false });
  }
  // sorteia um clube livre da Série A e cria a mesa do treinador
  async function claimClub(profile, want, vagaH) {
    let club = null, err = null;
    const ok = await sync({ process: false, mutate: () => {
      if (!S) { err = 'A liga ainda não foi criada.'; return; }
      if (S.desks[me]) { club = S.desks[me].club; return; }
      if (vagaH) {   // código de vaga do ADM: clube reservado, entra direto
        const V = Wd.vagas(S)[want];
        if (!V || V.h !== vagaH) { err = 'Este código de vaga não vale mais (já foi usado, venceu ou o ADM cancelou). Peça outro ao ADM.'; return; }
        if (Wd.humanClubs(S).includes(want)) { err = `O ${want} já tem treinador. Peça outro código ao ADM.`; return; }
        delete S.league.vag[want];
        club = want; joinAs(profile, club); return;
      }
      if (Wd.coachCount(S) >= Wd.leagueCap(S)) { err = `Liga cheia: as ${Wd.leagueCap(S)} vagas de treinador estão ocupadas. Se abrir vaga, o ADM pode te mandar um código de vaga.`; return; }
      if (want) {   // modo escolha: confere se o clube continua livre e é de uma divisão aberta
        if (!Wd.choicePool(S).includes(want)) { err = `O ${want} não está mais disponível. Escolha outro clube.`; return; }
        club = want;
      } else {
        const pool = Wd.drawPool(S);
        if (!pool.length) { err = 'Liga cheia: não sobrou clube livre nas divisões desta liga. Se abrir vaga, o ADM pode te mandar um código de vaga.'; return; }
        club = pool[Math.floor(Math.random() * pool.length)];
      }
      joinAs(profile, club);
    } });
    if (!ok) { club = null; err = err || explain(lastErr); }
    if (!club && !err) err = explain(lastErr);
    if (club && code) remember({ code, name: leagueInfo ? leagueInfo.name : '', mode: leagueInfo && leagueInfo.mode, admin: !!(leagueInfo && leagueInfo.admin === me), club });
    return { club, err };
  }
  function explain(e) {
    const c = e && e.code, m = String((e && e.message) || e || '');
    if (c === 'invalid_argument' || c === 'not_granted') return 'O servidor recusou o acesso. Avise o ADM. [código: acesso]';
    if (c === 'outdated') return 'Seu app está numa versão antiga. Feche o app por completo e abra de novo (ou recarregue a página) pra pegar a versão nova.';
    if (c === 'limit') return 'Limite de 3 ligas novas por aparelho a cada 24 horas. Tente de novo amanhã.';
    if (c === 'blocked') return 'Este aparelho foi bloqueado pelo dono do jogo. Se acha que é engano, fale no grupo do WhatsApp.';
    if (c === 'denied') return 'Gravação recusada pelo servidor (você não faz parte desta liga).';
    if (c === 'nokey') return 'Este aparelho não tem a chave deste treinador. Saia da liga e entre de novo com o seu código de acesso (XXXX-XXXX). Se não tiver o código, peça um novo ao ADM.';
    if (c === 'no_backend') return 'O servidor da liga ainda não foi atualizado para esta versão. Avise o ADM. [código: v2]';
    if (c === 'missing') return 'Não achei os dados desta liga no servidor. Avise o ADM. [código: sem mundo]';
    if (m === 'conflict') return 'Muita gente salvando ao mesmo tempo. Tente de novo em alguns segundos.';
    const st = (m.match(/^supabase (\d+)/) || [])[1];
    if (st === '429') return 'O servidor da liga recebeu acessos demais ao mesmo tempo. Espere uns segundos e tente de novo. [código: 429]';
    if (st && st >= 500) return `O servidor da liga está fora do ar ou reiniciando. Tente de novo em alguns minutos. [código: ${st}]`;
    if (e instanceof TypeError || /fetch|network|load failed/i.test(m)) return 'Sem conexão com o servidor da liga. Confira a internet (Wi-Fi/dados) e tente de novo. [código: rede]';
    return `Não consegui falar com a liga agora. Tente de novo. [código: ${esc0(m.slice(0, 40)) || '?'}]`;
  }
  const esc0 = s => String(s).replace(/[^\w .:-]/g, '');
  function joinAs(profile, club) {
    Wd.addDesk(S, me, profile, club);
    S.__me = me;
    SE.balanceWallet(S);
    MK.dailyPack(S, S.lastDay ?? SE.dayAbs(S, SE.now(S)));
    EV.news(S, { t: 'coach', title: `${profile.name} é sorteado e assume o ${club}`, body: `Novo treinador na liga. Estilo preferido: ${C.STYLES[profile.style || 'equilibrado'].name}.`, clubs: [club], front: 90 });
  }
  // reportar bug (tabela bug_reports; resposta do dono volta pelo bug_mine)
  async function bugSend(msg, contact) {
    const d = S && S.desks && S.desks[me];
    return rpc('bug_send', { p_code: code || '', p_token: me, p_name: d ? d.manager : '', p_club: d ? (d.club || '') : '', p_msg: msg, p_contact: contact || '', p_meta: `v${APP_BUILD} · ${navigator.userAgent.slice(0, 120)}` });
  }
  const bugMine = () => rpc('bug_mine', { p_token: me });
  const ownerTrust = async k => { try { const r = await rpc('owner_trust', { p_key: k, p_token: me }); return !!(r && r.ok); } catch (e) { return false; } };   // v167: aparelho do dono cria ligas sem limite
  const ownerCheck = async k => { const r = await rpc('owner_backup', { p_key: k, p_code: '-' }); return !!(r && r.ok); };   // confere a senha do painel do dono (resposta leve)
  const bugSeen = () => rpc('bug_seen', { p_token: me });
  // ADM entra na própria liga sem time (só administra)
  async function joinSpect() {
    let err = null;
    const ok = await sync({ process: false, mutate: () => {
      if (!S) { err = 'A liga ainda não foi criada.'; return; }
      if (!isAdmin()) { err = 'Só o ADM da liga pode entrar sem time.'; return; }
      if (S.desks[me]) return;
      const d = Wd.newDesk({ name: 'ADM' });
      d.club = null; d.unemployed = 'ADM'; d.spect = 1; S.desks[me] = d; S.__me = me;
    } });
    if (!ok && !err) err = explain(lastErr);
    if (!err && code) remember({ code, name: leagueInfo ? leagueInfo.name : '', mode: leagueInfo && leagueInfo.mode, admin: true, club: 'ADM' });
    return err ? { err } : { ok: true };
  }
  // v221: ADM passa a administração pra outro treineiro (banco primeiro, depois o mundo)
  async function adminTransfer(token) {
    if (!S || !isAdmin() || token === me || !S.desks[token]) return { ok: false, why: 'who' };
    let r = null; try { r = await rpc('league_admin_set', { p_code: code, p_by: me, p_sec: mySec(me), p_new: token }); } catch (e) { return { ok: false, why: 'nofn' }; }
    if (!r || !r.ok) return { ok: false, why: (r && r.why) || 'erro' };
    if (leagueInfo) leagueInfo.admin = token;
    const ok = await sync({ mutate: () => { if (!S || !S.league) return; const old = S.desks[me], nw = S.desks[token]; S.league.admPrev = me; S.league.admin = token; S.league.admAt = Date.now(); S.league.admWhy = 'manual';
      EV.news(S, { t: 'coach', front: 90, title: `${nw ? nw.manager : 'Outro treineiro'} é o novo ADM da liga`, body: `${old ? old.manager : 'O ADM'} passou a administração da liga.` });
      Wd.asDesk(S, token, () => EV.news(S, { t: 'coach', front: 96, title: 'Você agora é o ADM da liga', body: `${old ? old.manager : 'O ADM'} passou a administração pra você. O painel do ADM já está no seu menu.`, desk: token })); } });
    if (code) remember({ code, name: leagueInfo ? leagueInfo.name : '', mode: leagueInfo && leagueInfo.mode, admin: false, club: S && S.desks[me] ? S.desks[me].club : null });
    return { ok: !!ok };
  }
  // v221: o servidor me fez ADM (o antigo sumiu): confirma no banco uma vez por sessão
  let admClaimed = null;
  async function adminClaim() {
    if (!S || !S.league || S.league.admin !== me || !leagueInfo || leagueInfo.admin === me || admClaimed === code) return;
    admClaimed = code;
    try { const r = await rpc('league_admin_set', { p_code: code, p_by: me, p_sec: mySec(me), p_new: me }); if (r && r.ok) leagueInfo.admin = me; } catch (e) {}
  }
  // ADM: tira um treinador da liga (o clube volta pra IA)
  function kick(token) {
    return sync({ mutate: () => {
      if (!S || !isAdmin() || token === me || !S.desks[token]) return;
      const d = S.desks[token], c = d.club;
      delete S.desks[token];
      const nc = EV.realCoach(S, c, Date.now());
      if (c && S.coaches[c] && S.coaches[c].token === token) S.coaches[c] = { name: nc, since: S.season };
      EV.news(S, { t: 'coach', title: `${nc} é o novo técnico do ${c}`, body: `${d.manager} deixou o cargo. O ${c} anuncia ${nc} como novo treinador.`, clubs: [c] });
    } });
  }
  // ADM (teste): adianta o relógio da liga até 1 minuto antes do próximo jogo (ou inicia o jogo, se já está nesse minuto)
  // avança o relógio da liga. who: 'adm' (painel, 2 toques: 1 min antes e depois o jogo) ou 'solo'/'all' (Single Player: direto pro jogo)
  function advWorld(S, who) {
    const adm = who === 'adm';
    if (S.post) {   // fim de temporada: pula pro próximo dia (encerramento → premiação → dia livre)
      if (SE.paused && SE.paused(S)) SE.resume(S);   // v210: liga pausada no pós-temporada: o avanço não fazia nada (relógio congelado)
      const t0 = SE.now(S), nd = SE.sportDayStart(S, SE.dayAbs(S, t0) + 1) + 60000;
      if (nd > t0) S.off = (S.off || 0) + (nd - t0);
      EV.news(S, { t: 'club', title: adm ? 'O ADM adiantou o relógio' : 'Relógio adiantado', body: 'A liga pulou para o próximo dia do encerramento da temporada.', minor: true });
      return;
    }
    const k = Math.min(S.slot, SE.SLOTS - 1);
    let kick = SE.slotTime(S, k); const t = SE.now(S);
    // pré-temporada: vai até o próximo amistoso pendente (um de cada vez)
    if (S.prep && S.prep.season === S.season && S.slot === 0) { const nx = S.prep.fr.find((x, i) => !S.prep.done[i] && x < kick); if (nx != null) kick = nx; }
    const pre = kick - 60000 * (S.speed > 1 ? S.speed : 1);
    const target = !adm || t >= pre - 1000 ? kick + 60000 : pre, toGame = target > kick;
    if (SE.paused && SE.paused(S)) SE.resume(S);
    if (target > t) S.off = (S.off || 0) + (target - t);
    EV.news(S, { t: 'club', title: toGame ? (adm ? 'O ADM iniciou a rodada' : 'Rodada antecipada') : 'O ADM adiantou o relógio', body: toGame ? (adm ? 'Relógio da liga avançado até o início do jogo.' : who === 'all' ? 'Todos os treinadores confirmaram: a liga avançou até o próximo jogo.' : 'A liga avançou até o próximo jogo.') : 'Falta 1 minuto para o próximo jogo: confira escalação, banco e DM.', minor: true });
  }
  // ADM (teste): adianta o relógio da liga até 1 minuto antes do próximo jogo (ou inicia o jogo, se já está nesse minuto)
  function advance() {
    return sync({ mutate: () => { if (!S || !isAdmin()) return; advWorld(S, 'adm'); } }).then(ok => { if (ok) nudge(true); return ok; });
  }
  // v185 Solo/Close Friends: cada treinador confirma "pronto"; quando todos confirmam, a liga vai direto pro próximo jogo
  // v188: o próximo jogo da LIGA pode não ser de todo mundo (ex.: Supercopa só do Flamengo). Só confirma quem JOGA nele;
  // se nenhum treinador joga, qualquer um avança. Amistosos da pré-temporada e o encerramento valem pra todos.
  const soloVoters = W => Object.keys(W.desks || {}).filter(t => { const d = W.desks[t]; return d && !d.spect && !d.unemployed && d.club; });
  function soloNext(W) {
    const all = soloVoters(W);
    if (W.post) return { all, need: all, kick: SE.dayAbs(W, SE.now(W)), clubs: null };
    const k = Math.min(W.slot, SE.SLOTS - 1); let kick = SE.slotTime(W, k);
    if (W.prep && W.prep.season === W.season && W.slot === 0) { const nx = W.prep.fr.find((x, i) => !W.prep.done[i] && x < kick); if (nx != null) return { all, need: all, kick: nx, clubs: null, friendly: true }; }
    let fx = []; try { fx = SE.fixturesOf(W, k); } catch (e) {}
    const clubs = new Set(fx.flatMap(f => [f.h, f.a]));
    return { all, need: all.filter(t => clubs.has(W.desks[t].club)), kick, clubs, k };
  }
  const soloKey = (W, nx) => `${W.season}-${W.post ? 'p' : W.slot}-${nx.kick}`;
  function soloState() {
    if (!S || !Wd.isSolo(S)) return null;
    const nx = soloNext(S), key = soloKey(S, nx), v = S.soloV && S.soloV.k === key ? S.soloV.v || {} : {}, need = nx.need;
    return { need, all: nx.all, free: !need.length, inGame: need.includes(me), done: need.filter(t => v[t]), mine: !!v[me],
      names: need.filter(t => !v[t]).map(t => S.desks[t].manager), players: need.map(t => S.desks[t].club) };
  }
  function soloReady(on = true) {
    let res = null;
    return sync({ mutate: () => {
      if (!S || !Wd.isSolo(S) || !S.desks[me]) return;
      const nx = soloNext(S), key = soloKey(S, nx), need = nx.need;
      if (need.length && !need.includes(me)) { res = 'notmine'; return; }   // o jogo da vez é de outro treinador
      if (!S.soloV || S.soloV.k !== key) S.soloV = { k: key, v: {} };
      if (on) S.soloV.v[me] = 1; else delete S.soloV.v[me];
      if (on && (!need.length || need.every(t => S.soloV.v[t]))) { advWorld(S, need.length > 1 ? 'all' : 'solo'); S.soloV = { k: 'ok-' + key, v: {} }; res = 'go'; }
      else res = 'wait';
    } }).then(ok => { if (ok && res === 'go') nudge(true); return ok ? res : null; });
  }
  // ADM: pausa a liga até o próximo jogo acontecer no horário escolhido (ou retoma)
  function pause(realAt) { let res = null; return sync({ mutate: () => { if (!S || !isAdmin()) return; res = SE.pauseUntilMatch(S, realAt); if (res.ok) EV.news(S, { t: 'club', title: 'O ADM pausou a liga', body: 'O relógio para e o próximo jogo fica marcado para o horário combinado.', minor: true }); } }).then(ok => ok && res ? res : { ok: false, msg: res ? res.msg : NET_ERR() }); }
  function resume() { return sync({ mutate: () => { if (S && isAdmin()) SE.resume(S); } }).then(ok => { if (ok) nudge(true); return ok; }); }
  const NET_ERR = () => explain(lastErr);
  // perfil permanente: guardado no aparelho e na nuvem (profiles/<token>)
  let profT = null;
  function saveProfile(p) { if (!online || !me) return; clearTimeout(profT); profT = setTimeout(() => { kvSet('profiles/' + me, p).catch(() => {}); }, 4000); }
  async function loadProfile() {
    if (!online || !me) return null;
    try {
      const r = await kvGet('profiles/' + me); if (!r || !r.leagues) return null;
      let loc = null; try { loc = JSON.parse(localStorage.getItem('treineiros:perfil')); } catch (e) {}
      const m = { ...(loc || {}), ...r, leagues: { ...(r.leagues || {}), ...((loc && loc.leagues) || {}) } };
      for (const k in r.leagues) if (loc && loc.leagues && loc.leagues[k] && (r.leagues[k].at || 0) > (loc.leagues[k].at || 0)) m.leagues[k] = r.leagues[k];
      localStorage.setItem('treineiros:perfil', JSON.stringify(m)); return m;
    } catch (e) { return null; }
  }
  // assume a identidade de um técnico existente (troca de aparelho/endereço do jogo)
  // v196: chave do aparelho (segredo por treinador, só neste aparelho). O banco confere em cada gravação.
  let keyOK = null;
  const LS_SEC = t => 'treineiros:sec:' + t;
  const rndHex = n => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, '0')).join(''); };
  // ---------- v262: chat da liga (Zona mista); produção na v267 ----------
  // mensagens ficam na tabela league_chat (fora da liga); o aviso de novidade vem no league_ver_lite (campo chat = contador)
  const CH = { list: [], last: 0, rev: null, busy: false, ok: null, again: false, focus: false, pend: false, lastF: 0 };
  // v266 (teste de carga): fora da Zona mista, busca as mensagens novas no máximo a cada 30 s (o aviso chega um pouco depois); na tela, na hora
  const CHAT_OFF_MS = 30000;
  function chatMaybe() { if (CH.focus || Date.now() - CH.lastF >= CHAT_OFF_MS) { CH.pend = false; chatFetch(); } else CH.pend = true; }
  function chatFocus(on) { on = !!on; if (on === CH.focus) return; CH.focus = on; if (on && CH.ok === false && CH.why === 'fora') { CH.ok = null; CH.pend = true; }   // v268: tenta de novo ao abrir a Zona mista
    if (on && CH.pend) { CH.pend = false; chatFetch(); } }
  const LS_CH = c => 'treineiros:chat:' + c;
  function chatReset() { CH.list = []; CH.last = 0; CH.rev = null; CH.ok = null; CH.why = null; CH.again = false; CH.pend = false; CH.lastF = 0; }
  function chatSeenId() { try { return +localStorage.getItem(LS_CH(code)) || 0; } catch (e) { return 0; } }
  async function chatFetch() {
    if (!online || !code || !me || CH.ok === false) return;
    if (CH.busy) { CH.again = true; return; }
    CH.busy = true; CH.lastF = Date.now();
    try {
      const r = await rpc('chat_list', { p_code: code, p_token: me, p_sec: mySec(me), p_after: CH.last });
      if (r && r.ok) {
        CH.ok = true;
        const have = new Set(CH.list.map(m => m.id));
        for (const m of r.list || []) if (!have.has(m.id)) CH.list.push(m);
        const hid = new Set(r.hid || []), pr = new Set(r.press || []);
        CH.list = CH.list.filter(m => !hid.has(m.id)).sort((a, b) => a.id - b.id).slice(-200);
        for (const m of CH.list) m.press = pr.has(m.id);
        if (CH.list.length) CH.last = Math.max(CH.last, CH.list[CH.list.length - 1].id);
        emit('chat');
      } else if (r && r.why === 'fora') { CH.ok = false; CH.why = 'fora'; emit('chat'); }
    } catch (e) { if (/PGRST202|404|Could not find/.test(e.message || '')) { CH.ok = false; CH.why = 'nofn'; emit('chat'); } }
    finally { CH.busy = false; if (CH.again) { CH.again = false; chatFetch(); } }
  }
  function chatUnread() { const seen = chatSeenId(); return CH.list.filter(m => m.id > seen && m.token !== me).length; }
  function chatMentioned() { const seen = chatSeenId(); return CH.list.some(m => m.id > seen && m.token !== me && (m.ment || []).includes(me)); }
  function chatMarkSeen() { const id = CH.list.length ? CH.list[CH.list.length - 1].id : 0; try { localStorage.setItem(LS_CH(code), String(Math.max(id, chatSeenId()))); } catch (e) {} emit('chat'); }
  async function chatCall(fn, extra) {
    if (!online || !code || !me) return { ok: false, why: 'offline' };
    try { const r = await rpc(fn, { p_code: code, p_token: me, p_sec: mySec(me), ...extra }); if (r && r.ok) chatFetch(); return r || { ok: false }; }
    catch (e) { return { ok: false, why: /PGRST202|404|Could not find/.test(e.message || '') ? 'nofn' : 'rede' }; }
  }
  const chat = {
    get list() { return CH.list; }, get ok() { return CH.ok; }, get why() { return CH.why; }, get on() { return online && !!code && CH.ok !== false; },
    unread: chatUnread, mentioned: chatMentioned, seen: chatMarkSeen, fetch: chatFetch, focus: chatFocus,
    post: (msg, ment, name, club) => chatCall('chat_post', { p_name: name, p_club: club, p_msg: msg, p_ment: ment || [] }),
    press: id => chatCall('chat_press', { p_id: id }), hide: id => chatCall('chat_hide', { p_id: id }),
    ai: chatAI,
  };
  // v265 (teste): IA da imprensa no servidor (Railway). Sem resposta em 15 s, sem chave ou acima do limite: null (o jogo usa o texto pronto)
  const IA_URL = 'https://node-production-8075.up.railway.app';   // projeto "treineiros-ia" no Railway
  function iaUrl() { try { const o = localStorage.getItem('treineiros:ia'); if (o) return o; } catch (e) {} return (typeof window !== 'undefined' && window.TREINEIROS_IA) || IA_URL; }
  async function chatAI(id, ctx, ments) {
    const u = iaUrl(); if (!online || !code || !me || !SB || !u) return null;
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null, to = ac ? setTimeout(() => ac.abort(), 15000) : null;
    try {
      const r = await fetch(u.replace(/\/$/, '') + '/imprensa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: ac ? ac.signal : undefined,
        body: JSON.stringify({ sb: SB.url, key: SB.key, code, token: me, sec: mySec(me), id, ctx, ments }) });
      const j = await r.json(); return j && j.ok && j.res ? j.res : null;
    } catch (e) { return null; } finally { if (to) clearTimeout(to); }
  }
  function mySec(t) { if (!t) return null; let s = null; try { s = localStorage.getItem(LS_SEC(t)); } catch (e) {} if (!s) { s = rndHex(24); try { localStorage.setItem(LS_SEC(t), s); } catch (e) {} } return s; }
  async function rpcC(fn, a) {   // gravação com chave; banco ainda sem o SQL v196 -> grava sem chave (como antes)
    try { const r = await rpc(fn, a); if (a && a.p_sec) keyOK = true; return r; }
    catch (e) { if (a && a.p_sec && (e.code === 'no_backend' || /PGRST202/.test(e.message))) { keyOK = false; const b = { ...a }; delete b.p_sec; return rpc(fn, b); } throw e; }
  }
  // código de acesso conferido pelo banco: devolve o token do treinador e registra a chave deste aparelho
  async function claim(pin) {
    if (!code) return { ok: false };
    const s = rndHex(24);
    let r = null; try { r = await rpc('desk_claim', { p_code: code, p_pin: pin, p_sec: s }); } catch (e) { return { ok: false, why: 'nofn' }; }
    if (r && r.ok && r.token) { try { localStorage.setItem(LS_SEC(r.token), s); } catch (e) {} return { ok: true, token: r.token }; }
    return { ok: false, why: (r && r.why) || '?' };
  }
  // guarda o hash do código no banco (o próprio treinador ou o ADM)
  async function pinSet(token, pinH) {
    if (!code || !me) return false;
    try { const r = await rpc('desk_pin_set', { p_code: code, p_token: token, p_by: me, p_sec: mySec(me), p_pinh: pinH }); return !!(r && r.ok); } catch (e) { return false; }
  }
  function setMe(t) { if (!t) return; me = t; try { if (code) localStorage.setItem(LS_TOKL(code), t); else localStorage.setItem(LS_TOK, t); } catch (e) {} if (S) S.__me = t; loadProfile(); }
  const isAdmin = () => S && S.league && S.league.admin ? S.league.admin === me : !!(leagueInfo && leagueInfo.admin === me);   // v196: com a liga aberta vale só o ADM do mundo (o registro kv podia ser sobrescrito)
  const inviteLink = () => code ? `${APP_URL}?liga=${code}#liga=${code}` : APP_URL;
  return { fresh, FRESH_MS, chat, adminTransfer, _t: { protect, stale: () => { freshAt = 0; }, get freshAt() { return freshAt; } }, claim, pinSet, get keyOK() { return keyOK; }, build: APP_BUILD, amLeader, ownerCheck, ownerTrust, bugSend, bugMine, bugSeen, joinSpect, forget, saveProfile, loadProfile, setMe, init, open, close, sync, touched, createLeague, createWorld, claimClub, joinAs, kick, advance, soloReady, soloState, pause, resume, isAdmin, inviteLink, myLeagues, explain, merge3: NC.merge3, nudge, on: f => listeners.push(f),
    get online() { return online; }, get ready() { return ready; }, get me() { return me; }, get status() { return status; }, get hasWorld() { return hasWorld; }, get err() { return lastErr; },
    get code() { return code; }, get league() { return leagueInfo; }, get server() { return lastV ? { alive: srvAlive(lastV), srv: lastV.srv, next: lastV.next } : null; }, get base() { return base; }, MAX_COACHES, TEST_SPEED, APP_URL, APP_BUILD, APP_VER };
})();

// ===== UI parte 1: base, componentes, perfil do jogador e negociação =====
const C = CORE, Wd = WORLD, SE = SEASON, MK = MARKET, EV = EVENTS;
const { P } = Wd;
const RAW = await (await fetch(import.meta.env.BASE_URL + 'data/players.json')).json();
Wd.init(RAW);
const KEY = 'treineiros:v3';
const $ = s => document.querySelector(s);
const fmt = C.fmt, fmtK = C.fmtK;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WM = () => `<span class="wm"><b>TRE</b><i>I</i><b>NE</b><i>I</i><b>ROS</b></span>`;
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let S = null;
let UI = { view: 'landing', sub: {}, modal: null, mk: { scope: 'A', setor: 'ALL', q: '', sort: 'ovr', n: 40, region: 'BR' }, sq: { setor: 'ALL', sort: 'pos' }, news: 'all', comp: 'A', cont: 'LIB' };
let LIVE = null, liveTimer = null, clockTimer = null, SAMPLE = null;

// ---------- persistência ----------
function save() { if (!S) return; if (NET.online) { NET.touched(); return; } try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Não foi possível salvar neste navegador.', true); } }
function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }

// ---------- helpers de domínio ----------
const vw = id => Wd.view(S, id);
const own = id => Wd.ownerOf(S, id);
const mySquad = () => Wd.squad(S, S.club);
const ageOf = id => Wd.age(S, id);
const cat = ovr => C.catOf(ovr);
// categoria da carta pelo jogador: lendas consagradas usam a carta Diamante
const pcat = id => (MK.isLegend && MK.isLegend(S, id)) ? C.CATS[0] : cat(vw(id).ovr);
const tNow = () => SE.now(S);
const fastClock = () => !!(S && S.speed > 1);
// v180: relógio da liga deslocado (ADM adiantou ou pausou): horários na tela mostram a hora real em que o jogo acontece
const shiftedClock = () => !!(S && (S.speed > 1 || S.off || S.pause));
function when(t) {
  const fast = shiftedClock(), real = fast ? SE.toReal(S, t) : t;
  const d = new Date(real), today = Wd.startOfDay(fast ? Date.now() : tNow()), day = Wd.startOfDay(real);
  const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const diff = Math.round((day - today) / 86400000);
  const lbl = diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : diff === -1 ? 'Ontem' : `${DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  return `${lbl} ${hh}`;
}
const crest = (club, cls = '') => `<img class="px crest ${cls}" src="${SPR.crest(S, club)}" alt="Escudo ${esc(club)}" data-cl="${esc(club)}">`;
const flag = nat => `<img class="px flag" src="${SPR.flag(nat)}" alt="${esc(nat)}" title="${esc(nat)}">`;
function sprite(id) { const o = own(id); const club = o && o !== 'Livre' && o !== 'Aposentado' ? o : P[id].club0; return SPR.player(P[id], SPR.kitFor(S, club), P[id].pos === 'GOL'); }
const av = id => `<span class="av"><img class="spr" src="${sprite(id)}" alt=""></span>`;
// Fabrizio Otomano: jornalista (fictício) de mercado, assina rumores, propostas e os HERE WE GO

const isFab = n => n && (n.by === 'fab' || n.tag === 'rumor' || n.tag === 'hwg');
// nota do jogador num quadradinho colorido (escala inspirada no Sofascore, com a paleta do jogo)
const rtCol = v => v >= 9 ? '#6FA8FF' : v >= 8 ? '#5FF5D6' : v >= 7 ? '#57D26B' : v >= 6.8 ? '#B6E24A' : v >= 6.5 ? '#FFD84A' : v >= 6 ? '#FF9A3C' : '#F06B5F';
const rtb = v => v == null || isNaN(v) ? '<b class="rtb none">–</b>' : `<b class="rtb" style="background:${rtCol(+v)}">${(+v).toFixed(1)}</b>`;
const plink = (id, txt) => `<button class="pl" data-act="player" data-id="${id}">${esc(txt ?? P[id].short)}</button>`;
function statusTags(id) {
  const s = vw(id), t = [];
  if (s.inj > 0) t.push(`<span class="tag inj" title="${esc(s.injT)}">${ic('med')}${s.inj}</span>`);
  if (Wd.susOf(s) > 0) t.push(`<span class="tag sus">${ic('card')}SUSP</span>`);
  if (s.away > 1) t.push(`<span class="tag away">SELEÇÃO</span>`);
  if (s.loanOut) t.push(`<span class="tag loanout" title="${s.loanOut.from === S.club ? `Emprestado ao ${esc(own(id))}` : `Emprestado pelo ${esc(s.loanOut.from)}`}">EMPRÉSTIMO</span>`);
  if (s.ban > 0) t.push(`<span class="tag ban">AFASTADO</span>`);
  if (s.retire === S.season) t.push(`<span class="tag exp" title="Anunciou que encerra a carreira no fim da temporada">ÚLTIMA TEMP.</span>`);
  if (s.loan) t.push(`<span class="tag exp" title="Emprestado pelo ${esc(s.loan.from)} até o jogo ${s.loan.end + 1}">EMP</span>`);
  else if (s.short === S.season) t.push(`<span class="tag exp" title="Contrato curto: sai no fim da temporada">CURTO</span>`);
  if (!s.loan && Wd.locked(S, id)) t.push(`<span class="tag lock" title="Recém-chegado: não pode ser negociado por ${Wd.lockLeft(S, id)} jogos">${ic('lock')}${Wd.lockLeft(S, id)}</span>`);
  if (S.pre.some(x => x.id === id)) t.push(`<span class="tag exp">PRÉ</span>`);
  try { const ps0 = S.ps[id]; if (ps0 && ps0.asc > Math.floor(SE.fdAt(S, SE.now(S)) + 1e-6) && Wd.ownerOf(S, id) === S.club) t.push(`<span class="tag asc" title="Em ascensão: pode tentar romper o teto (Elenco › Treino)">EM ASCENSÃO</span>`); } catch (e) {}
  { const pd = MK.pendingOf(S, id); if (pd) t.push(`<span class="tag exp" title="Acordo fechado com o ${esc(pd.swap === id ? pd.from : pd.club)}: chega na abertura da janela">ACORDO</span>`); }
  return t.length ? `<span class="tags">${t.join('')}</span>` : '';
}
const condColor = v => v >= 80 ? 'var(--green)' : v >= 60 ? 'var(--yellow)' : 'var(--coral)';
const morColor = v => v >= 65 ? 'var(--green)' : v >= 40 ? 'var(--yellow)' : 'var(--coral)';
const meter = (v, col, cls = '') => `<span class="meter ${cls}"><i style="width:${Math.max(3, Math.min(100, v))}%;background:${col}"></i></span>`;
const expiring = id => own(id) === S.club && !vw(id).loan && !vw(id).loanOut && vw(id).ce <= S.season && !S.pre.some(x => x.id === id);
const loanedOutIds = () => Object.keys(S.ps).map(Number).filter(id => P[id] && S.ps[id].loanOut && S.ps[id].loanOut.from === S.club && own(id) !== S.club && own(id) !== 'Livre' && own(id) !== 'Aposentado');
function playerRow(id, opts = {}) {
  const p = P[id], s = vw(id), o = own(id);
  const c = pcat(id);
  const mine = o === S.club;
  // contrato no fim: seta rosa ao lado do nome (toque abre a renovação)
  const ren = mine && opts.ren !== false && expiring(id) ? `<span class="renx" data-act="quickrenew" data-id="${id}" role="button" tabindex="0" title="Contrato no fim: renovar" aria-label="Renovar contrato">${ic('renew')}</span>` : '';
  const right = opts.right ? opts.right(id) : `<span class="ob ${c.k} num">${s.ovr}</span>`;
  const meta = opts.meta ? opts.meta(id) : `${esc(C.POS_NAME[p.pos] || p.pos)} · ${ageOf(id)} anos${o && o !== S.club ? ' · ' + esc(o) : ''}`;
  const vitals = mine || opts.vitals ? `<span class="vit">${moodFace(s.mor)}<span class="cbar" title="Condição ${Math.round(s.cond)}"><i style="height:${Math.max(6, s.cond)}%;background:${condColor(s.cond)}"></i></span></span>` : '';
  return `<button class="prow ${opts.loanedOut ? 'loanedout' : ''}" data-act="player" data-id="${id}"><span class="posb">${p.pos}</span>${av(id)}
    <span style="min-width:0"><span class="n">${flag(p.nat)}<span class="nm1">${esc(p.name)}</span>${ren}${statusTags(id)}</span><span class="m">${meta}</span></span>
    <span class="rt">${vitals}${right}</span></button>`;
}
function cardHTML(id, opts = {}) {
  const p = P[id], s = vw(id), c = pcat(id), o = own(id);
  const club = o && o !== 'Livre' && o !== 'Aposentado' ? o : null;
  return `<div class="card ${c.k} ${opts.mini ? 'mini' : ''}">
    <div class="hd"><span class="cat">${ic(CAT_ICON[c.k])}${c.name}</span><span class="ovr num">${s.ovr}</span></div>
    <div class="art">${flag(p.nat).replace('class="px flag"', 'class="px flag cflag"')}${club && !opts.mini ? crest(club) : ''}<img class="spr" src="${sprite(id)}" alt="Sprite de ${esc(p.name)}"></div>
    <div class="nm">${esc(opts.mini ? p.short : p.name)}</div>
    <div class="sub">${esc(C.POS_NAME[p.pos] || p.pos)} · ${ageOf(id)} anos</div>
    <div class="pr">${opts.priceHTML || `<span>${ic('cash')}</span><span class="num">T$ ${fmt(opts.price ?? s.mv)}</span>`}</div></div>`;
}
function toast(msg, bad) { const t = document.createElement('div'); t.className = 'toast' + (bad ? ' bad' : ''); t.textContent = msg; document.body.appendChild(t); bad ? SFX.bad() : SFX.toggleOn(0.8); setTimeout(() => t.remove(), 2800); }
function potStars(id) {
  const s = vw(id), r = C.R('scout' + id + S.club);
  const est = Math.round(s.pot + (r() - 0.5) * 6);
  const n = est >= 85 ? 5 : est >= 78 ? 4 : est >= 70 ? 3 : est >= 62 ? 2 : 1;
  return { n, lo: est - 3, hi: est + 3, txt: '★'.repeat(n) + '☆'.repeat(5 - n) };
}

// ---------- perfil do jogador ----------
function openPlayer(id, tab) { const back = UI.modal && ['club', 'match'].includes(UI.modal.type) ? UI.modal : null; UI.modal = { type: 'player', back, id, tab: tab || (own(id) === S.club && expiring(id) ? 'renew' : null), neg: null }; renderModal(); }
function playerModal(m) {
  const id = m.id, p = P[id], s = vw(id), o = own(id), mine = o === S.club, passMine = !!(s.loanOut && s.loanOut.from === S.club);
  const youthMine = (S.youth[S.club] || []).includes(id);
  const st = s.st || { j: 0, g: 0, a: 0, rt: 0, yc: 0, rc: 0, min: 0, cs: 0, ga: 0 }, j = st.j || 0;   // v179: jogador sem estatística da temporada
  const avg = j ? (st.rt / j).toFixed(1) : '–';
  // cabeça: card à esquerda; à direita estado (moral, condição, forma, potencial) em cima e números do jogo embaixo
  const vit = (v, lbl, bar, col, pre = '') => `<div class="pv"${bar != null ? ` style="--v:${bar};--gc:${col}"` : ''}><b class="num">${pre}${v}</b><span>${lbl}</span></div>`;
  const pot = mine || youthMine || passMine ? vit(s.pot, 'Potencial', s.xp * 100, 'var(--purple)') : `<div class="pv"><b class="stars">${potStars(id).txt}</b><span>Potencial</span></div>`;
  const head0 = `<div class="ph2"><div class="phcard">${cardHTML(id)}</div>
    <div class="phr">
      <div class="pv4">${vit(Math.round(s.mor), 'Moral', s.mor, morColor(s.mor), moodFace(s.mor))}${vit(Math.round(s.cond), 'Condição', s.cond, condColor(s.cond))}${vit(s.form.toFixed(1), 'Forma', (s.form - 4) / 5 * 100, morColor((s.form - 4) / 5 * 100))}${pot}</div>
      <div class="ps6">${[[ic('vs'), j, 'Jogos'], [ic('ball'), st.g, 'Gols'], [ic('arrowR'), st.a, 'Assist.'], [ic('star'), avg, 'Nota'], [ic('clock'), st.min, 'Min'], [`<span class="ycard"></span>`, st.yc, 'Amar.']].map(([i, v, l]) => `<div>${i}<b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>
    </div></div>`;
  const stats = '';
  const tile = (lab, val, st = '') => `<div><span>${lab}</span><b style="${st}">${val}</b></div>`;
  const kv = `<div class="pkv">
    ${tile('Clube', `${o && o !== 'Livre' && o !== 'Aposentado' ? crest(o, 'sm') : ''} ${esc(youthMine ? S.club + ' (base)' : o || '—')}`)}
    ${tile('País', `${flag(p.nat)} ${p.nat}`)}
    ${tile(`${ic('cal')} Contrato`, `até ${s.ce}`, s.ce <= S.season ? 'color:var(--pink)' : '')}
    ${tile(`${ic('cash')} Valor`, `T$ ${fmtK(s.mv)}`)}
    ${tile(`${ic('wallet')} Salário`, `T$ ${fmt(s.sal)}/d`)}
    ${s.inj > 0 ? tile(`${ic('med', '', 'color:var(--coral)')} Lesão`, `${s.inj} jogo(s)`, 'color:var(--coral)') : Wd.locked(S, id) ? tile(`${ic('lock')} Chegou`, `livre em ${Wd.lockLeft(S, id)} j.`) : mine ? tile('Perfil', esc(s.temper)) : tile('Idade', `${ageOf(id)} anos`)}</div>`;
  let actions = '';
  if (youthMine) actions = `<button class="btn big" data-act="promote" data-id="${id}" ${mySquad().length >= C.ECON.squadMax ? 'disabled' : ''}>${ic('up')} Subir pro profissional</button>
    ${mySquad().length >= C.ECON.squadMax ? `<div class="note bad">Elenco cheio (${C.ECON.squadMax}).</div>` : ''}`;
  UI._pgrid = '';
  if (youthMine) {}
  else if (mine) actions = ownActions(m, id);
  else if (passMine) actions = loanOwnerActions(m, id);
  else if (o !== 'Aposentado') actions = negotiation(m, id);
  const watched = (S.watch || []).includes(id);
  const wbtn = !mine && !youthMine && o !== 'Aposentado' && !passMine ? `<button class="btn sm ${watched ? 'lime' : 'alt'} watchbtn" data-act="obs" data-id="${id}">${ic('eye')} ${watched ? 'Nos favoritos' : 'Adicionar aos favoritos'}</button>` : '';
  // carta que vira: frente = a carta; costas = números, estado e contrato
  const back = `<div class="pbh"><b>${esc(p.name)}</b><span>${esc(C.POS_NAME[p.pos] || p.pos)} · ${ageOf(id)} anos</span></div>
    <div class="pv4">${vit(Math.round(s.mor), 'Moral', s.mor, morColor(s.mor), moodFace(s.mor))}${vit(Math.round(s.cond), 'Condição', s.cond, condColor(s.cond))}${vit(s.form.toFixed(1), 'Forma', (s.form - 4) / 5 * 100, morColor((s.form - 4) / 5 * 100))}${pot}</div>
    <div class="ps6">${[[ic('vs'), j, 'Jogos'], [ic('ball'), st.g, 'Gols'], [ic('arrowR'), st.a, 'Assist.'], [ic('star'), avg, 'Nota'], [ic('clock'), st.min, 'Min'], [`<span class="ycard"></span>`, st.yc, 'Amar.']].map(([i, v, l]) => `<div>${i}<b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>
    ${kv}`;
  const flip = `<div class="pflip ${m.flip ? 'fl' : ''}" data-act="pflip" role="button" aria-label="Virar a carta"><div class="pfin"><div class="pff">${cardHTML(id)}</div><div class="pfb card ${pcat(id).k}">${back}</div></div></div>
    <div class="pfhint">${ic('renew')} Toque pra ver ${m.flip ? 'a frente' : 'os números'}</div>${numRow(m, id)}`;
  const head = UI._pgrid ? `<div class="pmtop"><div class="pmcard">${flip}</div>${UI._pgrid}</div>` : flip;
  void head0; void stats;
  return `${head}${wbtn}${actions}`;
}
// v155: número da camisa (só do seu elenco): mostra discreto e troca na hora; número ocupado = os dois trocam
function numRow(m, id) {
  if (!S || own(id) !== S.club || S.spect) return '';
  const n = Wd.shirt(S, id);
  if (!m.numEdit) return `<div style="text-align:center;margin-top:2px"><button class="link small" data-act="numedit" style="color:var(--muted)">Camisa ${n != null ? `<b>${n}</b>` : '—'} · trocar</button></div>`;
  return `<div class="row" style="gap:6px;justify-content:center;margin-top:6px"><span class="small muted">Camisa</span><input id="num-in" type="number" min="1" max="99" value="${n ?? ''}" style="width:72px;text-align:center"><button class="btn sm" data-act="numsave" data-id="${id}">Salvar</button><button class="btn sm alt" data-act="numedit">×</button></div>`;
}
function loanOwnerActions(m, id) {
  const acts = [['talk', 'chat', 'Conversar', 'var(--blue)'], ['renew', 'renew', 'Renovar', 'var(--lime)'], ['ptrain', 'dumbbell', 'Treino', 'var(--orange)'], ['mkt', 'swap', 'Mercado', 'var(--mint)'], ['offers', 'sell', 'Propostas', 'var(--yellow)'], ['release', 'out', 'Dispensar', 'var(--coral)']];
  const grid = `<div class="agrid agrid3">${acts.map(([k, i, l, col]) => `<button class="${m.tab === k ? 'on' : ''}" style="--ac:${col}" data-act="ptab" data-k="${k}" ${k !== 'mkt' ? 'disabled' : ''}>${ic(i)}<span>${l}</span></button>`).join('')}</div>`;
  UI._pgrid = grid.replace('class="agrid agrid3"', 'class="agrid pside"');
  if (m.tab !== 'mkt') return '<div class="note">Emprestado a outro clube e indisponível para escalação. Abra Mercado para ver o prazo e a opção de chamar de volta.</div>';
  const q = MK.recallQuote(S, id);
  const detail = q.ok ? `Faltam ${q.left} de ${q.total} jogos. Ao chamar o jogador agora, o ${esc(S.club)} devolve <b>T$ ${fmt(q.refund)}</b> da taxa ao ${esc(q.borrower)}.` : esc(q.msg);
  return `${loanHistHTML(id)}<div class="note">${ic('swap')} ${detail}</div>${q.ok ? m.confirm === 'recallloan'
    ? `<div class="row" style="gap:8px"><button class="btn coral" style="flex:1" data-act="recallloan" data-id="${id}" data-refund="${q.refund}">Confirmar chamada · T$ ${fmt(q.refund)}</button><button class="btn alt" data-act="unconfirm">Voltar</button></div>`
    : `<button class="btn big coral" data-act="confirm" data-k="recallloan">${ic('swap')} Chamar de volta</button>` : ''}`;
}
function ownActions(m, id) {
  const mine = own(id) === S.club;   // v165: faltava (tela do jogador emprestado quebrava)
  const s = vw(id), tab = m.tab === 'contract' ? 'renew' : m.tab;
  const borrowed = !!(s.loan || s.loanOut);
  const offers = S.offers.filter(x => x.id === id);
  const acts = [['talk', 'chat', 'Conversar', 'var(--blue)'], ['renew', 'renew', 'Renovar', 'var(--lime)'], ['ptrain', 'dumbbell', 'Treino', 'var(--orange)'], ['mkt', 'swap', s.list || s.loanList ? 'No mercado' : 'Mercado', 'var(--mint)'], ['offers', 'sell', 'Propostas', 'var(--yellow)'], ['release', 'out', 'Dispensar', 'var(--coral)']];
  const grid = `<div class="agrid agrid3">${acts.map(([k, i, l, col]) => `<button class="${tab === k ? 'on' : ''}" style="--ac:${col}" data-act="ptab" data-k="${k}" ${(k === 'offers' && !offers.length) || (borrowed && (k === 'renew' || k === 'release')) ? 'disabled' : ''}>${ic(i)}<span>${l}</span>${(k === 'renew' && expiring(id)) || (k === 'offers' && offers.length) ? '<i class="dot"></i>' : ''}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'talk') {
    const done = S.talks[id] === S.lastDay;
    body = done ? `<div class="note">Você já conversou com ele hoje.</div>` : `<div class="talkg">${TALKS.map((t, i) => `<button data-act="talk" data-i="${i}" data-id="${id}">${ic(t.icon)}<span>${t.name}</span></button>`).join('')}</div>`;
  } else if ((tab === 'renew' || tab === 'release') && borrowed) {
    body = s.loanOut ? `<div class="note">${ic('swap')} Emprestado pelo ${esc(s.loanOut.from)}. Enquanto durar o empréstimo, não pode renovar, ser vendido nem dispensado. ${s.loanOut.abroad && s.loanOut.opt ? 'A compra definitiva está em Mercado.' : 'Volta ao clube de origem no fim do prazo.'}</div>` : `<div class="note">${ic('swap')} ${s.loan.mkt ? `Jogador Diamante: passagem de 3 meses. Volta ${s.loan.from === 'Livre' ? 'ao mercado' : `ao ${esc(s.loan.from)}`}` : `Emprestado pelo ${esc(s.loan.from)} (pacote Diamante). Volta pra lá`} depois do jogo ${s.loan.end + 1} ou no fim da temporada. Não renova nem pode ser dispensado.</div>`;
  } else if (tab === 'renew' && s.short === S.season) {
    body = `<div class="note">${ic('clock')} Contrato curto do pacote Diamante: termina no fim de ${S.season} e não tem renovação.</div>`;
  } else if (tab === 'renew' && s.renewed === S.season) {
    body = `<div class="note ok">${ic('lock')} Renovado nesta temporada até ${s.ce} (T$ ${fmt(s.sal)}/dia). Nova renovação só na próxima temporada.</div>`;
  } else if (tab === 'renew') {
    const yrs = m.years || 2, t = MK.renewTerms(S, id, yrs);
    body = `<div class="chips">${[1, 2, 3, 4].map(y => `<button class="chip ${yrs === y ? 'on' : ''}" data-act="years" data-y="${y}">${y} ano${y > 1 ? 's' : ''}</button>`).join('')}</div>
      <div class="deal"><div><span>Hoje</span><b class="num">T$ ${fmt(s.sal)}</b></div>${ic('arrowR')}<div><span>Novo</span><b class="num" style="color:${t.up ? 'var(--pink)' : 'var(--green)'}">T$ ${fmt(t.sal)}</b></div><div><span>Até</span><b>${S.season + yrs}</b></div></div>
      <button class="btn big" data-act="renew" data-id="${id}">${ic('renew')} Renovar · ${t.up ? '+' : ''}${Math.round((t.sal / s.sal - 1) * 100)}%</button>`;
  } else if (tab === 'ptrain') {
    body = ptrainHTML(m, id);
  } else if (tab === 'release') {
    const cost = MK.releaseCost(S, id);
    body = `<div class="deal"><div><span>Economiza</span><b class="num" style="color:var(--green)">T$ ${fmt(s.sal)}/dia</b></div><div><span>Multa</span><b class="num" style="color:var(--coral)">T$ ${fmt(cost)}</b></div></div>
      ${m.confirm === 'release' ? `<div class="row"><button class="btn coral" style="flex:1" data-act="release" data-id="${id}">Confirmar dispensa</button><button class="btn alt" data-act="unconfirm">Voltar</button></div>` : `<button class="btn big alt" data-act="confirm" data-k="release">${ic('out')} Dispensar</button>`}`;
  } else if (tab === 'mkt') {
    if (s.loan) body = `<div class="note">${ic('swap')} ${s.loan.mkt ? 'Jogador Diamante em passagem de 3 meses' : `Emprestado pelo ${esc(s.loan.from)}`}: não pode ser negociado.</div>`;
    else if (s.loanOut) body = loanHistHTML(id) + (mine && s.loanOut.abroad && s.loanOut.opt ? `<div class="mktopt on"><div class="grow"><b>${ic('cash')} Opção de compra</b><span class="small muted">Compre em definitivo do ${esc(s.loanOut.from)} por T$ ${fmt(s.loanOut.opt)} (com a janela aberta). Contrato de 3 temporadas.${s.loanOut.abroad ? ' Jogando pouco (menos de 40% dos jogos), o clube de lá pode chamá-lo de volta.' : ''}</span></div><button class="btn sm" data-act="buyopt" data-id="${id}">Comprar · T$ ${fmtK(s.loanOut.opt)}</button></div>` : '');
    else {
      const days = x => Math.max(0, (S.lastDay ?? 0) - x.day);
      body = `<div class="mktopt ${s.list ? 'on' : ''}"><div class="grow"><b>${ic('sell')} Lista de transferências</b><span class="small muted">${s.list ? `Há ${days(s.list)} dia(s) na lista. Chegam mais propostas (inclusive do exterior), mas abaixo do valor, e caem com o tempo.` : 'O mercado fica sabendo que ele pode sair: mais propostas, porém abaixo do valor de mercado.'}</span></div>
          <button class="btn sm ${s.list ? 'alt' : ''}" data-act="listing" data-k="list" data-id="${id}">${s.list ? 'Tirar da lista' : 'Colocar na lista'}</button></div>
        <div class="mktopt ${s.loanList ? 'on' : ''}"><div class="grow"><b>${ic('swap')} Disponível para empréstimo</b><span class="small muted">${s.loanList ? `Oferecido por ${MK.LOAN_LEN[s.loanList.len]}. Ele volta sozinho ao fim do prazo.` : 'Clubes podem pedir o jogador por 6 meses ou 1 temporada. Quem pega paga parte do salário; o resto fica com você.'}</span></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">${['6m', '1t'].map(l => `<button class="btn sm ${s.loanList && s.loanList.len === l ? '' : 'alt'}" data-act="listing" data-k="loan" data-len="${l}" data-id="${id}">${s.loanList && s.loanList.len === l ? 'Cancelar' : l === '6m' ? '6 meses' : '1 temporada'}</button>`).join('')}</div></div>
        ${loanHistHTML(id)}`;
    }
  } else if (tab === 'offers') {
    body = offers.length ? `<div class="tile pink" style="padding:12px"><div class="stack" style="gap:8px">${offers.map(offerHTML).join('')}</div></div>` : '';
  }
  UI._pgrid = grid.replace('class="agrid agrid3"', 'class="agrid pside"');   // botões de ação vão pra lateral da carta
  return `${body}${m.msg ? `<div class="note ${m.msgK || ''}">${esc(m.msg)}</div>` : ''}`;
}
const TALKS = [
  { name: 'Elogiar', icon: 'star', f: (s) => s.form >= 6.8 ? 7 : s.temper === 'sensível' ? 2 : -2 },
  { name: 'Cobrar', icon: 'whistle', f: (s) => s.form < 6.3 ? (s.temper === 'profissional' || s.temper === 'ambicioso' ? 6 : s.temper === 'sensível' ? -8 : -4) : -5 },
  { name: 'Garantir vaga', icon: 'handshake', f: (s) => s.benchRun >= 2 ? 8 : 3 },
  { name: 'Ameaçar banco', icon: 'out', f: (s) => s.temper === 'ambicioso' ? 5 : s.temper === 'temperamental' ? -12 : s.form < 6.2 ? 2 : -7 },
];
// empréstimo atual e anteriores: duração, taxa, divisão do salário e retorno previsto
const LOAN_BACK = (se, end) => end == null ? 'fim da temporada' : `${SE.gameDate({ season: se }, end).txt} (jogo ${end + 1})`;
function loanHistHTML(id) {
  const s = S.ps[id] || {}, lo = s.loanOut, prev = s.loans || [];
  if (!lo && !prev.length) return '';
  const cur = lo ? `<div class="lnh on"><b>${ic('swap')} Emprestado: ${esc(lo.from)} ${ic('arrowR')} ${esc(own(id))}</b><span>${esc(MK.LOAN_LEN[lo.len] || lo.len || '')}${lo.fee != null ? ` · taxa T$ ${fmt(lo.fee)}` : ''}${lo.share != null ? ` · ${esc(own(id))} paga ${lo.share}% do salário, ${esc(lo.from)} ${100 - lo.share}%` : ''}</span><span>Retorno previsto: <b>${LOAN_BACK(lo.season, lo.end)}</b></span></div>` : '';
  const old = prev.slice().reverse().map(x => `<div class="lnh"><b>${esc(x.from || '?')} ${ic('arrowR')} ${esc(x.club)} · ${x.season}</b><span>${esc(MK.LOAN_LEN[x.len] || x.len || '')}${x.fee ? ` · taxa T$ ${fmt(x.fee)}` : ''}${x.share != null ? ` · ${x.share}% do salário pago pelo ${esc(x.club)}` : ''}${x.k0 != null && x.k1 != null ? ` · de ${SE.gameDate({ season: x.season }, x.k0).txt} a ${SE.gameDate({ season: x.season }, x.k1).txt}` : ''}</span></div>`).join('');
  return `<div class="eyebrow" style="margin:8px 0 4px">Empréstimos</div>${cur}${old}`;
}
// treino individual (1 estrela, 10 dias): aprender posição ou evolução acelerada
function ptrainHTML(m, id) {
  const s = vw(id), t = S.ptrain && S.ptrain.s === S.season ? S.ptrain : null, have = (S.ps[id] || {}).pos2 || [];
  const posLine = `<div class="small muted">Posições: <b>${esc(P[id].pos)}</b> (origem)${have.map(x => ` · <b>${esc(x)}</b> (aprendida)`).join('')}</div>`;
  if (t && t.id === id) {
    const fd = Math.floor(SE.fdAt(S, SE.now(S))), left = Math.max(0, t.fd1 - fd), pct = Math.round(Math.min(1, (fd - t.fd0) / (t.fd1 - t.fd0)) * 100);
    return `${posLine}<div class="ptbox on"><b>${ic('dumbbell')} ${t.kind === 'pos' ? `Aprendendo a jogar de ${esc(C.POS_NAME[t.pos])}` : 'Evolução acelerada'}</b><div class="accb"><i style="width:${pct}%"></i></div><span class="small muted">${left ? `Termina em ${left} dia${left > 1 ? 's' : ''} do jogo.` : 'Termina hoje.'} ${t.kind === 'evo' ? 'Enquanto isso, ele evolui 3 vezes mais rápido.' : ''}</span></div>`;
  }
  if (t) return `${posLine}<div class="note">${esc(P[t.id] ? P[t.id].short : 'Outro jogador')} já está em treino individual. Um jogador por vez.</div>`;
  const opts = TRAIN.ptPositions(S, id), sel = m.ptpos && opts.includes(m.ptpos) ? m.ptpos : opts[0];
  const stars = S.stars || 0, cap = s.ovr >= s.pot, full = have.length >= 2;
  return `${posLine}
    <div class="ptbox"><b>${ic('swap')} Aprender uma posição</b><span class="small muted">Em ${TRAIN.PT_DAYS} dias ele passa a render na nova posição quase como na de origem. Máximo de 2.</span>
      ${full ? '<span class="small">Já aprendeu 2 posições novas.</span>' : opts.length ? `<div class="chips">${opts.map(x => `<button class="chip ${x === sel ? 'on' : ''}" data-act="ptpos" data-k="${x}">${esc(x)}</button>`).join('')}</div>
      <button class="btn sm" data-act="ptgo" data-k="pos" data-id="${id}" ${stars < 1 ? 'disabled' : ''}>Treinar de ${esc(C.POS_NAME[sel] || sel)} · 1★</button>` : '<span class="small">Nenhuma posição próxima disponível.</span>'}</div>
    <div class="ptbox"><b>${ic('up')} Evolução acelerada</b><span class="small muted">Por ${TRAIN.PT_DAYS} dias ele evolui 3 vezes mais rápido no treino e ganha +1 de overall garantido no fim (respeitando o potencial).</span>
      <button class="btn sm" data-act="ptgo" data-k="evo" data-id="${id}" ${stars < 1 || cap ? 'disabled' : ''}>${cap ? 'Já no teto do potencial' : 'Começar · 1★'}</button></div>
    ${stars < 1 ? '<div class="small muted">Você precisa de 1 estrela.</div>' : ''}${m.msg ? `<div class="note">${esc(m.msg)}</div>` : ''}`;
}
function valSel(id, v, sub, stepAct) {
  return `<div class="valsel"><button data-act="${stepAct}" data-d="-1" aria-label="Diminuir">−</button><div class="v"><b class="num">T$ ${fmt(v)}</b><span>${sub}</span></div><button data-act="${stepAct}" data-d="1" aria-label="Aumentar">+</button></div>`;
}
function negotiation(m, id) {
  if (!S.club || S.unemployed || S.spect) return '<div class="note small">Sem clube no momento: negociar só treinando um clube.</div>';   // v186: ADM sem time / desempregado
  const s = vw(id), o = own(id);
  const sc = MK.interest(S, id, S.club), lbl = MK.interestLabel(sc);
  const col = sc >= 65 ? 'var(--green)' : sc >= 45 ? 'var(--yellow)' : sc >= 25 ? 'var(--orange)' : 'var(--coral)';
  let intr = `<div class="intr">${ic('handshake', '', `color:${col}`)}<span class="eyebrow" style="margin:0">Interesse</span>${meter(sc, col)}<b style="color:${col}">${lbl}</b></div>`;
  const pre = MK.preEligible(S, id);
  const free = o === 'Livre';
  const talk = MK.canTalk(S, id);
  { const dq = MK.diaReq(S, id); if (dq && talk.ok) intr += `<div class="note" style="border:1px solid var(--c-dia);color:var(--c-dia)">${ic('gem')} <b>Jogador Diamante</b>: ${myOuro() ? `não vem pra Série ${esc(Wd.divOf(S, S.club) || 'B')}. Na B e na C, a carta forte é o Ouro Especial.` : `ao fechar, custa ${dq[0]}★ + ${dq[1]} diamante${dq[1] > 1 ? 's' : ''} e fica só 3 meses (14 jogos), sem renovação. Depois volta à origem.`}</div>`; }
  // v155: proposta já enviada a um técnico da liga continua aparecendo ao fechar e abrir a ficha
  if (!m.neg && !m.negQuit && Wd.isHuman(S, o)) {
    const me = S.club; let off = null;
    try { off = Wd.asClub(S, o, () => (S.offers || []).find(x => x.id === id && x.club === me && x.human && !x.loanOf)); } catch (e) {}
    if (off) m.neg = { step: 'fee', fee: off.fee, sent: off.fee, res: { status: 'sent' }, swap: off.swap != null ? off.swap : null };
  }
  if (!m.neg) {
    if (!talk.ok) return `${intr}<div class="note bad">${esc(talk.why)}</div>`;
    return `${intr}
      ${pre ? `<button class="btn big" data-act="negstart" data-k="pre">${ic('cal')} Pré-contrato (grátis, chega no fim da temporada)</button>` : ''}
      <button class="btn big ${pre ? 'alt' : ''}" data-act="negstart" data-k="${free ? 'free' : 'fee'}">${ic('handshake')} ${free ? 'Oferecer contrato' : (() => { const ns = MK.negState(S, id); return ns && ns.fee != null && !Wd.isHuman(S, o); })() ? 'Clube já aceitou · negociar com o jogador' : Wd.isHuman(S, o) ? `Proposta ao técnico ${esc(S.coaches[o].name)}` : `Negociar com o ${esc(o)}`}</button>`;
  }
  const n = m.neg, b = MK.budget(S);
  const note = negStatus(n, sc, o);
  if (n.step === 'fee') {
    const v = n.fee, pct = Math.round(v / s.mv * 100);
    return `${intr}<div class="neg"><div class="steps"><b class="on">1 Clube</b><b>2 Jogador</b></div>
      ${note}
      ${valSel(id, v, `${pct}% do valor de mercado`, 'nstep')}
      <input type="range" id="neg-range" min="0" max="${Math.max(2000, Math.round(s.mv * 2.5 / 1000) * 1000)}" step="1000" value="${v}">
      <div class="minis"><span>${ic('cash')} Valor T$ ${fmtK(s.mv)}</span><span style="color:${v > b.transfer ? 'var(--coral)' : 'var(--lime)'}">${ic('wallet')} Compras T$ ${fmtK(b.transfer)}</span></div>
      ${swapBox(id, n)}
      <div class="negact">
      ${n.res && n.res.status === 'counter' ? `<button class="btn big" data-act="negcounter">Aceitar T$ ${fmt(n.res.ask)}</button>` : ''}
      ${n.res && n.res.status === 'closed' ? `<button class="btn big alt" data-act="negquit">Voltar ao jogador</button>` : (() => { const pend = Wd.isHuman(S, o) && S.offers !== undefined && Wd.asClub(S, o, () => S.offers.some(x => x.id === id && x.club === S.club && x.human)) === true;
        const same = n.sent === v && n.res && n.res.status !== 'accept';
        const dis = same || (pend && n.sent === v);
        return `<button class="btn big ${n.res && n.res.status === 'counter' ? 'alt' : ''} ${dis ? 'sentbtn' : ''}" data-act="negbid" ${dis ? 'disabled' : ''}>${dis ? (n.res && n.res.status === 'sent' || pend ? `${ic('handshake')} Proposta enviada` : 'Mude o valor para enviar outra') : n.res && n.res.status === 'reject' ? 'Enviar nova proposta' : 'Enviar proposta'}</button>`; })()}
      ${n.res && n.res.status !== 'closed' ? `<button class="btn alt sm" data-act="negquit">Desistir da negociação</button>` : ''}</div></div>`;
  }
  const dem = MK.salaryDemand(S, id, S.club);
  const v = n.sal, yrs = n.years;
  return `${intr}<div class="neg"><div class="steps"><b>${n.kind === 'pre' ? 'Pré-contrato' : '1 Clube ✓'}</b><b class="on">2 Jogador</b></div>
    ${n.kind === 'fee' ? `<div class="minis"><span>${ic('handshake')} Acordo com o clube fechado: ${n.fee ? `T$ ${fmt(n.fee)}` : 'sem taxa'}${n.swap != null && P[n.swap] ? ` + ${esc(P[n.swap].short)} na troca` : ''}</span></div>` : ''}
    ${note}
    ${valSel(id, v, `por dia · hoje ganha T$ ${fmt(s.sal)}`, 'sstep')}
    <input type="range" id="sal-range" min="${Math.max(10, Math.round(dem * 0.5 / 5) * 5)}" max="${Math.round(dem * 2 / 5) * 5}" step="${dem >= 100 ? 10 : 5}" value="${v}">
    <div class="chips">${[1, 2, 3, 4, 5].map(y => `<button class="chip ${yrs === y ? 'on' : ''}" data-act="nyears" data-y="${y}">${y} ano${y > 1 ? 's' : ''}</button>`).join('')}</div>
    <div class="minis"><span style="color:${v > b.wageRoom ? 'var(--coral)' : 'var(--lime)'}">${ic('wallet')} Folga salarial T$ ${fmt(b.wageRoom)}/dia</span></div>
    <div class="negact">
    ${n.res && n.res.status === 'counter' ? `<button class="btn big" data-act="salcounter">Aceitar T$ ${fmt(n.res.demand)}/dia</button>` : ''}
    ${n.res && n.res.status === 'closed' ? `<button class="btn big alt" data-act="negquit">Voltar ao jogador</button>` : `<button class="btn big ${n.res && n.res.status === 'counter' ? 'alt' : ''}" data-act="negsign">Oferecer contrato</button><button class="btn alt sm" data-act="negquit">Desistir da negociação</button>`}</div></div>`;
}
// estado da negociação: um cartão de status de tamanho estável, texto quebrando linha e ações sempre visíveis
const NEG_ST = {
  prep: ['Preparando proposta', 'var(--muted)', 'feather'], sent: ['Proposta enviada', 'var(--mint)', 'handshake'], wait: ['Aguardando resposta', 'var(--yellow)', 'clock'],
  accept: ['Aceita', 'var(--lime)', 'handshake'], reject: ['Recusada', 'var(--coral)', 'out'], counter: ['Contraproposta', 'var(--orange)', 'swap'],
  closed: ['Negociação encerrada', 'var(--coral)', 'lock'], nointerest: ['Sem interesse', 'var(--coral)', 'out'],
};
function negStatus(n, sc, o) {
  const st = n.res ? (n.res.status === 'sent' ? (Wd.isHuman(S, o) ? 'wait' : 'sent') : NEG_ST[n.res.status] ? n.res.status : 'reject') : sc < 25 ? 'nointerest' : 'prep';
  const [lbl, col, icn] = NEG_ST[st];
  const msg = n.res ? n.res.msg : st === 'nointerest' ? 'O jogador mostra pouco interesse. Dá pra tentar, mas ele deve pedir bem mais.' : n.step === 'fee' ? 'Defina o valor e envie ao clube.' : 'Defina salário e duração do contrato.';
  return `<div class="negst" style="--nc:${col}"><span class="negchip">${ic(icn)} ${lbl}</span><p>${esc(msg)}</p></div>`;
}
function offerHTML(o) {
  const p = P[o.id], left = o.exp - S.lastDay;
  const counter = UI.counter && UI.counter.k === o.k ? UI.counter : null;
  const later = o.human && !o.loanOf && !SE.windowOpen(SE.now(S), S);
  return `<div class="offer">${av(o.id)}<div class="grow"><div class="row between"><b>${crest(o.club, 'sm')} ${esc(o.club)}${o.human ? ` <span class="pill" style="font-size:10px">${ic('user')} ${esc((S.coaches[o.club] || {}).name || 'treinador')}</span>` : ''}</b><span class="small" style="opacity:.6">${o.war ? '<span class="pill warp">Leilão</span> ' : ''}${ic('clock')} ${Math.max(0, left)}d</span></div>
    <div>${plink(o.id)} · ${o.loanOf ? `<b>Empréstimo · ${MK.LOAN_LEN[o.loanOf]}</b> · paga ${o.share}% do salário · taxa <b class="num">T$ ${fmt(o.fee)}</b>` : `<b class="num">T$ ${fmt(o.fee)}</b> <span class="small" style="opacity:.6">(valor ${fmtK(vw(o.id).mv)})</span>${o.swap != null && P[o.swap] ? `<div class="small" style="margin-top:3px">${ic('swap')} + ${plink(o.swap)} na troca · ${P[o.swap].pos} · ${vw(o.swap).ovr} · T$ ${fmtK(vw(o.swap).mv)}</div>` : ''}`}${o.listed ? ' <span class="pill" style="font-size:10px">lista</span>' : ''}</div></div>
    ${counter ? `<div class="acts" style="flex-direction:column">${o.loanOf && !o.human ? `<div class="valsel"><button data-act="cshare" data-d="-1" aria-label="Diminuir">−</button><div class="v"><b class="num">${counter.sh}%</b><span>do salário pago pelo ${esc(o.club)}</span></div><button data-act="cshare" data-d="1" aria-label="Aumentar">+</button></div>` : ''}${valSel(o.id, counter.v, o.loanOf ? 'taxa de empréstimo' : `${Math.round(counter.v / vw(o.id).mv * 100)}% do valor`, 'cstep')}
      ${counter.msg ? `<div class="note" style="background:rgba(0,0,0,.1)">${esc(counter.msg)}</div>` : ''}
      ${o.human ? `<div class="note small" style="background:rgba(0,0,0,.1)">${ic('handshake')} Contraproposta é compromisso: se o técnico do ${esc(o.club)} aceitar esse valor, a venda fecha na hora, sem nova confirmação sua.</div>` : ''}
      <div class="row"><button class="btn sm ok" style="flex:1" data-act="csend" data-k="${o.k}">Enviar contraproposta</button><button class="btn sm" data-act="cclose">Voltar</button></div></div>`
    : o.counter ? `<div class="acts" style="flex-direction:column;align-items:stretch"><div class="note" style="background:rgba(0,0,0,.1)">${ic('clock')} Você pediu T$ ${fmt(o.counter)}. Aguardando o técnico do ${esc(o.club)}.</div><div class="row"><button class="btn sm ok" style="flex:1" data-act="offerok" data-k="${o.k}">${later ? `Fechar acordo por T$ ${fmt(o.fee)}` : `Aceitar T$ ${fmt(o.fee)}`}</button><button class="btn sm" data-act="offerno" data-k="${o.k}">Recusar</button></div></div>`
    : `<div class="acts"><button class="btn sm ok" data-act="offerok" data-k="${o.k}">${later ? 'Fechar acordo · próxima janela' : 'Aceitar'}</button><button class="btn sm" data-act="counter" data-k="${o.k}">Contrapropor</button><button class="btn sm" data-act="offerno" data-k="${o.k}">Recusar</button></div>`}</div>`;
}

// ===== UI parte 2: telas (início, clube, elenco, mercado) =====
function walletPills() {
  return `<button class="wallet" data-act="modal" data-m="wallet" aria-label="Carteira">
    <span class="cur cs">${ic('cash')}${fmtK(S.cash[S.club] || 0)}</span><span class="cur st">${ic('star')}${S.stars || 0}</span><span class="cur ${gemCls()}">${gemIc()}${S.dias || 0}</span></button>`;
}
// grupo da liga no WhatsApp (avisos e novidades pros novos treinadores)
const WA_URL = 'https://chat.whatsapp.com/KIgc3ga3sphFilYEExl7Nn';   // v155: comunidade do Treineiros (tela inicial); dentro da liga vale o link do ADM
// link do grupo: na tela de entrada, o grupo geral do Treineiros; dentro da liga, o link que o ADM da liga definir (vazio = não mostra)
const WA_OK = u => /^https:\/\/(chat\.whatsapp\.com|wa\.me)\/[A-Za-z0-9_?=&\-\/]+$/.test(String(u || '').trim());
const leagueWa = () => (S && S.league && WA_OK(S.league.wa)) ? S.league.wa.trim() : '';
const waLeague = () => { const u = leagueWa(); return u ? waBtn(false, u) : ''; };
const waBtn = (full, url) => `<a class="wabtn${full ? ' full' : ''}" href="${esc(url || WA_URL)}" target="_blank" rel="noopener" aria-label="${url ? 'Grupo da liga no WhatsApp' : 'Comunidade do Treineiros no WhatsApp'}">${ic('chat')}${full ? `<span><b>${url ? 'Entre no grupo do WhatsApp' : 'Entre na nossa comunidade'}</b><small>${url ? 'Avisos da liga, novidades e convites' : 'Novidades do Treineiros, avisos e ligas abertas'}</small></span><i class="wago">${ic('arrowR')}</i>` : `<span>${url ? 'WhatsApp da liga' : 'Grupo no WhatsApp'}</span>`}</a>`;
function topbar() {
  return `<div class="top sticky"><div class="row" style="gap:8px"><button class="iconbtn home ${UI.view === 'home' ? 'on' : ''}" data-act="goto" data-v="home" aria-label="Tela principal">${ic('homei')}</button><span class="wmv"><span class="wm xs">${WM()}</span></span><button class="iconbtn helpb" data-act="help" aria-label="Manual rápido">${ic('help')}</button>${NET.online ? `<button class="iconbtn helpb bugb" data-act="bug" aria-label="Reportar bug">${ic('bug')}${UI.bugNew ? '<i class="bugdot"></i>' : ''}</button>` : ''}${S && SE.isTurbo(S) ? `<button class="turbob ico" data-act="turboinfo" title="Modo Turbo" aria-label="Modo Turbo">${ic('bolt')}</button>` : ''}</div>
    <div class="row" style="gap:6px;min-width:0">${NET.online ? `<span id="netdot" class="netdot ${NET.status.replace(/\s/g, '')}" title="${esc(NET.status)}"></span>` : ''}${S ? walletPills() : ''}</div></div>`;
}
const segHTML = (key, items) => `<div class="seg" data-seg="${key}">${items.map(([k, l]) => `<button class="${(UI.sub[key] || items[0][0]) === k ? 'on' : ''}" data-act="sub" data-key="${key}" data-k="${k}">${l}</button>`).join('')}</div>`;
const subOf = (key, def) => UI.sub[key] || def;

// ---------- início ----------
function vLanding() {
  const Cc = { p: 'var(--pink)', b: 'var(--blue)', g: 'var(--green)', y: 'var(--yellow)', c: 'var(--coral)', l: 'var(--lime)', u: 'var(--purple)', m: 'var(--mint)', k: 'var(--bg)' };
  const cell = ([bg, fg, sh]) => `<div style="background:${Cc[bg]}">${sh ? `<i class="${sh}" style="display:block;background:${Cc[fg]};width:100%;height:100%"></i>` : ''}</div>`;
  const top = [['y', 'c', 'm-half'], ['b', 0, 0], ['g', 'u', 'm-circle'], ['p', 0, 0], ['c', 'y', 'm-q2'], ['k', 'g', 'm-halfb'],
    ['u', 'p', 'm-q1'], ['g', 0, 0], ['c', 'l', 'm-star'], ['b', 'p', 'm-halfb'], ['y', 0, 0], ['m', 'b', 'm-q3']].map(cell).join('');
  const bot = [['p', 'b', 'm-half'], ['l', 0, 0], ['b', 'y', 'm-circle'], ['c', 'p', 'm-q1'], ['g', 'c', 'm-star'], ['u', 0, 0]].map(cell).join('');
  const tmpS = S || { ps: {}, own: {}, season: 2026, kits: {} };
  const top3 = RAW.bra.slice().sort((a, b) => b[8] - a[8]).slice(0, 3).map(r => r[0]);
  const prevS = S; S = tmpS;
  const fan = [top3[1], top3[0], top3[2]].map(id => cardHTML(id)).join('');
  S = prevS;
  const saved = landingCTA();
  return `<div class="stack" style="padding-top:8px">
    <div class="lglogo"><img src="${LOGO_URI}" alt="Treineiros"></div>
    ${waBtn(true)}
    <button class="btn alt" data-act="help">${ic('help')} Manual rápido: tudo o que você precisa saber</button>
    <p style="margin:4px 0 0;font-size:16px;font-weight:600;max-width:36ch">Manager de futebol com o Brasileirão de verdade, online com os amigos. Crie seu treinador, sorteie o clube e dispute Série A, Copa do Brasil e torneios continentais.</p>
    ${saved}
    <div class="fan">${fan}</div>
    <div class="feat">
      <div class="tile green"><h3>${RAW.bra.length + RAW.rel.length} reais</h3><p>Série A e rebaixados com overall tirado do valor de mercado do Transfermarkt.</p></div>
      <div class="tile pink"><h3>Mercado de verdade</h3><p>Craque na Europa não vem por dinheiro. Clube pede mais pelo titular.</p></div>
      <div class="tile yellow"><h3>Relógio acelerado</h3><p>No teste online, 1 dia do jogo dura 30 minutos: tem jogo a cada 15 minutos. Rodízio obrigatório.</p></div>
      <div class="tile purple"><h3>Pacote individual</h3><p>De segunda a quinta, cada treinador recebe o seu pacote: Diamante, Ouro, Prata e Bronze em rodízio (na Série B e na C, o Diamante vira Ouro Especial). De sexta a domingo é mercado.</p></div>
    </div>
    <p class="muted small" style="margin:0">${NET.online ? `Liga online · até ${NET.MAX_COACHES} treinadores · <span id="netdot" class="netdot ${NET.status.replace(/\s/g, '')}"></span> ${esc(NET.status)}` : 'Protótipo · jogo salvo neste navegador.'}</p></div>`;
}
let _S0 = null;
function S0() { if (!_S0) _S0 = { ps: {}, own: {}, season: 2026, coaches: {}, kits: {}, ver: 0, youth: {}, free: [], divA: Wd.BR_A0(), divB: Wd.BR_B0() }; return _S0; }

// ---------- clube (home) ----------
function budgetBar(b, id) {
  const cash = Math.max(0, b.cash), full = Math.max(b.pay, Math.floor(cash / b.daysLeft));
  const salW = full ? Math.min(100, b.wage / full * 100) : 100, floorW = full ? Math.min(100, b.pay / full * 100) : 100;
  return `<div class="bbar" id="${id}"><div class="bar"><i class="sal" style="width:${salW}%"></i><i class="buy" style="width:${100 - salW}%"></i><i class="floor" style="width:${floorW}%"></i></div>
    <input type="range" class="brange" data-budget="1" min="0" max="${full}" step="10" value="${b.wage}" aria-label="Divisão entre salários e compras" ${cash <= 0 ? 'disabled' : ''}>
    <div class="lg"><span style="color:var(--pink)">${ic('wallet')} ${id === 'bb-home' ? `Folga salarial <b class="num" data-bw data-room>T$ ${fmt(b.wageRoom)}/dia</b>` : `Salários <b class="num" data-bw>T$ ${fmt(b.wage)}/dia</b>`}</span><span style="color:var(--lime)">Compras <b class="num" data-bt>T$ ${fmtK(b.transfer)}</b> ${ic('cash')}</span></div></div>`;
}
function fmtDur(ms) { const m = Math.max(0, Math.round(ms / 60000)), d = Math.floor(m / 1440), hh = Math.floor((m % 1440) / 60), mi = m % 60; return d ? `${d}d ${hh}h` : hh ? `${hh}h ${String(mi).padStart(2, '0')}min` : `${mi}min`; }
function windowPill(big) {
  const w = SE.windowInfo(S); if (w.left != null) w.left = SE.realMs(S, w.left);
  const txt = w.open ? `${w.phase} · fecha em ${fmtDur(w.left)} (${when(w.until)})` : w.until ? `${w.phase} · reabre em ${fmtDur(w.left)} (${when(w.until)})` : 'reta final · reabre na pré-temporada da próxima temporada';
  return `<div class="winp ${w.open ? 'open' : ''} ${big ? 'big' : ''}">${ic(w.open ? 'handshake' : 'lock')}<span><b>Janela de transferências ${w.open ? 'aberta' : 'fechada'}</b><small>${txt}</small></span></div>`;
}
function objectiveTile(pos) {
  const o = S.obj && S.obj[S.club]; if (!o) return '';
  const st = SE.oprStatus ? SE.oprStatus(S, S.club) : null, conf = Math.round(S.board ?? 60);
  const cc = conf >= 70 ? 'var(--green)' : conf >= 45 ? 'var(--yellow)' : 'var(--coral)';
  const ok = st ? st.ok : pos <= o.max, near = st && st.near;
  const pill = st && !st.j ? ['var(--muted)', 'começa na 1ª rodada'] : ok ? ['var(--green)', 'dentro da meta'] : near ? ['var(--yellow)', 'por um fio'] : ['var(--coral)', 'fora da meta'];
  const bar = `<div class="objbar"><span style="color:${pill[0]}" title="${pill[1]}">Hoje ${pos}º</span><div class="track">${Array.from({ length: 20 }, (_, i) => `<i class="${i + 1 <= o.max ? 'z' : ''} ${i + 1 === pos ? 'me' : ''}"></i>`).join('')}</div><span>${o.pts != null ? `ou ${o.pts} pts` : `meta ≤ ${o.max}º`}</span></div>`;
  const confRow = '';   // a confiança da diretoria está nos pilares; pedir verba fica em Finanças
  if (!st || !o.g) return `<div class="tile full objt"><div class="row between"><div class="eyebrow" style="margin:0">${ic('trophy')} Objetivo da diretoria</div><span class="pill" style="color:${pill[0]}">${pill[1]}</span></div><div class="objrow"><b class="disp">${esc(o.label)}</b><span class="small muted">${o.rank}º maior elenco da Série ${o.div}</span></div>${bar}${confRow}</div>`;
  const R = S.opr && S.opr.s === S.season ? S.opr : { et: 0, ok: [], dk: {}, paid: 0, zin: 0, zout: 0, fug: 0, fugD: 0, boia: 0, bchk: 0 };
  const P = st.P, G = SE.GNAME, EV = SE.ET_EVERY, nEt = Math.floor(st.tot / EV), nextMd = (R.et + 1) * EV;
  const pr = (s, d) => `${s ? `+${s}★` : ''}${s && d ? ' ' : ''}${d ? `+${d}${gemIcS('width:13px;height:13px;vertical-align:-2px;color:var(--mint)')}` : ''}`;
  const dots = Array.from({ length: nEt }, (_, i) => { const r = R.ok[i]; const cls = r === 1 ? 'y' : r === 0 ? 'n' : i === R.et ? (ok || near ? 'nx ok' : 'nx') : ''; return `<i class="${cls}" title="rodada ${(i + 1) * EV}">${r === 1 ? '★' : ''}</i>`; }).join('');
  const acc = SE.oprAcc(R), part = acc - R.paid * P.thr, pct = Math.min(100, Math.abs(part) / P.thr * 100), neg = part < -0.05;
  const lines = [];
  lines.push(`<div class="oprl"><div class="oh"><span>Etapas · a cada ${EV} rodadas</span><b>${R.et >= nEt ? 'encerradas' : !st.j ? `1ª etapa na rodada ${EV}` : `rodada ${nextMd}: ${ok || near ? `<em class="okc">vale +1★</em>` : `<em class="noc">fora</em>`}`}</b></div><div class="etd">${dots}</div></div>`);
  lines.push(`<div class="oprl"><div class="oh"><span>Acima do esperado</span><b>${neg ? `<em class="noc">saldo ${part.toFixed(1).replace('.', ',').replace('-', '−')}</em>` : `${Math.max(0, part).toFixed(1).replace('.', ',')} de ${P.thr} pts → +1★`}</b></div><div class="accb ${neg ? 'neg' : ''}"><i style="width:${pct}%"></i></div>${neg ? `<small class="muted">Resultados abaixo do previsto. Recupere ${Math.abs(part).toFixed(1).replace('.', ',')} pts pra voltar a encher a barra.</small>` : ''}</div>`);
  if ((st.inZ && st.j >= 3) || R.zin >= 2) lines.push(`<div class="oprl hot"><div class="oh"><span>Zona de rebaixamento</span><b>${R.fug >= 2 ? 'fugas esgotadas' : `fuga vale ${pr(P.z4[0], P.z4[1] && !R.fugD ? P.z4[1] : 0)}`}</b></div><small class="muted">${st.inZ ? `No Z4, a ${st.zgap} ponto${st.zgap === 1 ? '' : 's'} de sair. Vale depois de 2 rodadas dentro e 2 fora.` : `Fora do Z4 há ${R.zout} rodada${R.zout === 1 ? '' : 's'}: mais ${Math.max(0, 2 - R.zout)} e a fuga está garantida.`}</small></div>`);
  if (P.boia && !R.bchk) lines.push(`<div class="oprl"><div class="oh"><span>Boia · rodada ${SE.BOIA_MD}</span><b>${pr(0, 1)}</b></div><small class="muted">Se estiver no Z4 a até 6 pontos de sair, a diretoria dá ${myOuro() ? '1 Ouro' : 'um diamante'} pra reta final.</small></div>`);
  else if (R.boia) lines.push(`<div class="oprl"><div class="oh"><span>Boia</span><b class="okc">recebida ${pr(0, 1)}</b></div></div>`);
  const ex = o.pts != null ? '+1★ a cada 3 pts além' : '+1★ por posição acima';
  lines.push(`<div class="oprl"><div class="oh"><span>Fechando na meta</span><b>${pr(P.fin[0], P.fin[1])}</b></div><small class="muted">${ex}</small></div>`);
  const front = o.bg && o.bg !== o.g ? ` · <span style="color:var(--pink)">fronteira: prêmios do ${G[o.bg]}</span>` : '';
  return `<div class="tile full objt"><div class="row between"><div class="eyebrow" style="margin:0">${ic('trophy')} Objetivo premiado</div><span class="pill" style="color:${pill[0]}">${pill[1]}</span></div>
    <div class="objrow"><b class="disp">${esc(o.label)}</b><span class="small muted">Grupo <b class="g-${o.g}">${G[o.g]}</b> · ${o.rank}º maior elenco da Série ${o.div}${front}</span></div>
    ${bar}${o.pts != null ? `<div class="small muted" style="margin-top:4px">No ritmo atual: <b style="color:${st.pace >= o.pts ? 'var(--green)' : 'var(--yellow)'}">${st.pace} pontos</b> no fim.</div>` : ''}
    <div class="oprbox">${lines.join('')}</div>${pillarsHTML()}${confRow}</div>`;   // v255: meta conversa com o topo; sustentação embaixo
}
// três pilares: diretoria, torcida e grupo; índice de sustentação e situação do cargo
function pillarsHTML() {
  if (!SE.pillars) return '';
  const P3 = SE.pillars(S), mode = SE.fireMode(S), J = S.job && S.job.club === S.club ? S.job : null;
  const col = v => v >= 60 ? 'var(--green)' : v >= 40 ? 'var(--yellow)' : 'var(--coral)';
  const DI = P3.k && C.DNA_INFO ? C.DNA_INFO[P3.k] : null;
  const D2c = P3.k2 && C.DNA_INFO[P3.k2] ? C.DNA_INFO[P3.k2].c : null;
  const bar = (l, v, i, p) => { const b = DI ? P3['b' + p] || 0 : 0, b2 = D2c ? Math.min(b, P3['s' + p] || 0) : 0, home = DI && P3.home === p;   // v254: faixa em 2 cores; ícone do DNA no pilar da casa
    return `<div class="pil"><span>${ic(i)} ${l}${home ? `<i class="phome" title="${esc(DI.l)} enche mais este pilar">${dnaIc(S.club)}</i>` : ''}</span><div class="pbar"><i style="width:${v}%;background:${col(v)}"></i></div><b class="num" style="color:${col(v)}">${v}</b>${b > 0 ? `<span class="pbon" title="Bônus do DNA">${dnaIc(S.club)}${b - b2 > 0 ? `<em style="color:${DI.c}">+${b - b2}</em>` : ''}${b2 > 0 ? `<em style="color:${D2c}">+${b2}</em>` : ''}</span>` : '<span></span>'}</div>`; };   // v260: barra = valor total na cor do estado; bônus do DNA num selo ao lado
  const BB = S.dnaB && S.dnaB.c === S.club ? S.dnaB : null;
  const dnaL = DI ? `<div class="pdnal"><span class="dnatags"><span class="dnatag" style="--dc:${DI.c}">${dnaIc(S.club)}${esc(DI.l)}</span>${P3.k2 && C.DNA_INFO[P3.k2] ? `<span class="dnatag s2" style="--dc:${C.DNA_INFO[P3.k2].c}">+ ${esc(C.DNA_INFO[P3.k2].l)}</span>` : ''}</span><span>O bônus do DNA é o que o clube reconhece por "${esc(DI.q.replace(/\?$/, ''))}"${P3.k2 && C.DNA_INFO[P3.k2] ? ` e, valendo metade, por "${esc(C.DNA_INFO[P3.k2].q.replace(/\?$/, ''))}" (${esc(C.DNA_INFO[P3.k2].l)})` : ''}. ${P3.home ? ` ${esc(DI.l)} enche mais ${({ D: 'a Diretoria', T: 'a Torcida', G: 'o Grupo' })[P3.home]}.` : ''} Só soma e some aos poucos se você parar de entregar.${BB && BB.last ? ` Última: <b>${esc(BB.last.why)}</b>.` : ''}${P3.bD + P3.bT + P3.bG > 0 ? ` Sem ela: ${P3.D0} · ${P3.T0} · ${P3.G0}.` : ''}</span></div>` : '';
  const st = J && J.ult ? (() => { const os = SE.oprStatus(S, S.club); const got = os ? os.pts - J.ult.p0 : 0, pl = os ? os.j - J.ult.j0 : 0; return ['var(--coral)', `Ultimato: ${got}/${J.ult.need} pts · ${Math.max(0, J.ult.games - pl)} jogo(s)`]; })()
    : J && J.st === 'risk' ? ['var(--yellow)', 'Cargo balançando'] : ['var(--green)', 'Cargo estável'];
  const modeL = { off: 'demissões desligadas', soft: 'modo brando', real: 'modo realista' }[mode];
  const log = (S.plog || []).slice(-6).reverse().map(x => `<div class="plg"><b style="color:${x.v > 0 ? 'var(--green)' : 'var(--coral)'}">${x.v > 0 ? '+' : ''}${x.v}</b> ${{ D: 'Diretoria', T: 'Torcida', G: 'Grupo' }[x.p] || ''}: ${esc(x.why)}</div>`).join('');
  return `<div class="pils" data-act="plogt"${DI ? ` style="--dc:${DI.c}"` : ''}>
    <div class="row between" style="gap:8px"><span class="eyebrow" style="margin:0">Sustentação <b class="num" style="color:${col(P3.I)}">${P3.I}</b></span><span class="pill" style="color:${st[0]}">${st[1]}</span></div>
    ${bar('Diretoria', P3.D, 'handshake', 'D')}${bar('Torcida', P3.T, 'mic', 'T')}${bar('Grupo', P3.G, 'shirt', 'G')}${dnaL}
    <small class="muted">${modeL} · toque pra ver o que mudou</small>
    ${UI.plogOpen ? `<div class="plogs">${log || '<div class="plg muted">Ainda sem mudanças registradas.</div>'}</div>` : ''}</div>`;
}
function frDay() { const d = SE.dayAbs(S, SE.now(S)), f = S.fr && S.fr.day === d ? S.fr : null; return { w: Math.min(3, (f && f.w) || 0), played: (f && f.played) || 0, star: !!(f && f.star) }; }
function streakHTML() {
  const ws = S.ws || 0, next = ws < 3 ? [3, '+1★'] : ws < 6 ? [6, '+2★'] : ws < 10 ? [10, myOuro() ? '+1 Ouro' : '+1◆'] : null;
  const fw = S.fws || 0, fnext = fw < 10 ? [10, myOuro() ? '+1 Ouro' : '+1◆'] : null, fd = frDay();
  const dots = (n, tot) => `<span class="dots">${Array.from({ length: tot }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
  return `<div class="tile full streak"><div class="row between"><div class="eyebrow" style="margin:0">${ic('trophy')} Sequências</div><span class="small muted">clássico vencido: +1★</span></div>
    <div class="srow"><span>Oficiais</span>${dots(Math.min(ws, 10), 10)}<b>${next ? `${next[0] - ws} p/ ${next[1]}` : 'máx.'}</b></div>
    <div class="srow"><span>Amistosos hoje</span>${dots(Math.min(fd.w, 3), 3)}<b>${fd.star ? `${ic('star')} obtida` : `${fd.w}/3 vitórias · ${fd.played}/5 jogos`}</b></div>
    <div class="srow"><span>Amistosos seguidos</span>${dots(Math.min(fw, 10), 10)}<b>${fnext ? `${fnext[0] - fw} p/ ${fnext[1]}` : 'máx.'}</b></div></div>`;
}
// v185: Single Player — avançar até o próximo jogo (sozinho: direto; com amigos: todos confirmam "Estou pronto")
function soloAdvHTML(compact) {
  if (!NET.online || !Wd.isSolo(S) || !NET.soloState) return '';
  const st = NET.soloState(); if (!st || !st.all.includes(S.__me)) return '';
  const busy = UI.soloBusy, what = S.post ? 'o próximo dia' : 'o próximo jogo';
  // v188: o próximo jogo da liga é de outro treinador (ex.: Supercopa): só ele confirma
  if (!st.free && !st.inGame) {
    const who = st.players.map(esc).join(' e ');
    return compact ? `<span class="btn sm alt soloq" style="pointer-events:none;opacity:.85" title="O próximo jogo da liga é do ${who}">⏳ ${who}</span>`
      : `<div class="soloadv"><small>O próximo jogo da liga é do <b>${who}</b>. Quando ${st.need.length > 1 ? 'eles avançarem' : 'ele avançar'} (ou o jogo acontecer no horário), chega a sua vez.</small></div>`;
  }
  const n = st.free ? 1 : st.need.length, d = st.done.length;
  if (compact) return n === 1 ? `<button class="btn sm lime soloq" data-act="soloready" ${busy ? 'disabled' : ''} title="Avançar até ${what}">${busy ? '…' : 'Avançar'} ${ic('arrowR')}</button>`
    : st.mine ? `<button class="btn sm alt soloq" data-act="solounready" ${busy ? 'disabled' : ''} title="Desfazer">✓ ${d}/${n}</button>` : `<button class="btn sm lime soloq" data-act="soloready" ${busy ? 'disabled' : ''} title="Estou pronto: avança quando todos confirmarem">Pronto ${d}/${n}</button>`;
  if (n === 1) return `<div class="soloadv"><button class="btn" data-act="soloready" ${busy ? 'disabled' : ''}>${ic('arrowR')} ${busy ? 'Avançando…' : `Avançar até ${what}`}</button></div>`;
  const bars = `<div class="votes">${st.need.map((t, i) => `<i class="${i < d ? 'ok' : ''}"></i>`).join('')}</div>`;
  const wait = st.names.length ? `Falta${st.names.length > 1 ? 'm' : ''}: ${st.names.map(esc).join(', ')}.` : '';
  return `<div class="soloadv">${bars}${st.mine
    ? `<button class="btn alt" data-act="solounready" ${busy ? 'disabled' : ''}>✓ Pronto (${d}/${n}) · desfazer</button><small>${wait} Quando todos confirmarem, a liga vai direto até ${what}.</small>`
    : `<button class="btn" data-act="soloready" ${busy ? 'disabled' : ''}>${ic('arrowR')} ${busy ? 'Confirmando…' : `Estou pronto (${d}/${n})`}</button><small>Quando todos confirmarem, a liga vai direto até ${what}. Sem isso, os jogos seguem no horário normal.</small>`}</div>`;
}
function vHome() {
  if (S.spect) return vSpect();
  if (S.unemployed) return vUnemployed();
  const club = S.club, b = MK.budget(S);
  const div = (Wd.divOf(S, club) || 'B');
  const tbl = SE.standings(S.comp[div].table), pos = tbl.findIndex(r => r.c === club) + 1, T = S.comp[div].table[club];
  const nx = SE.nextFixtureOf(S, club);
  let next = ''; UI.agProb = UI.agRef = UI.agTest = UI.agPause = ''; UI.agTalked = false;
  const test = soloAdvHTML();   // v185: avançar no card só no Single Player (nas ligas Online fica no painel do ADM)
  const pauseInfo = SE.paused(S) ? `<div class="pausebar">${ic('clock')} Liga pausada · o relógio volta a andar ${fmtReal(S.pause.until).toLowerCase()}</div>` : '';
  if (nx && !nx.pending) {
    const t = SE.slotTime(S, nx.k);
    const H = SE.teamFor(S, nx.h), A = SE.teamFor(S, nx.a);
    const pv = SIM.preview(H, A, id => SE.info(S, id), !!nx.neutral);
    const home = nx.h === club, win = home ? pv.pw : pv.pl, lose = home ? pv.pl : pv.pw;
    const ref = SE.referee(S, nx.k, SE.fixturesOf(S, nx.k).findIndex(f => f.h === nx.h), nx);
    const talked = S.teamTalk === `${S.season}-${nx.k}`;
    const stage = nx.md ? `R${nx.md}` : nx.round ? SE.CB_STAGES[nx.round - 1] : nx.stage ? SE.CK_STAGES[nx.stage - 1] : nx.leg ? `jogo ${nx.leg}` : '';
    next = `<div class="hero cmp cmp-${nx.comp}">${pauseInfo}
      <div class="row between"><span class="compb">${ic('trophy')} ${SE.COMP_NAME[nx.comp]} · ${stage}</span><span class="pill dark">${ic('clock')} ${when(t)}</span></div>
      <div class="gdate">${ic('cal')} ${SE.gameDate(S, nx.k).txt} de ${S.season} no calendário do jogo</div>
      ${(() => { if (nx.neutral) return `<div class="stline">${ic('stadium')} <b>Campo neutro</b></div>`; const st = SE.stadium(S, nx.h), tk = Wd.deskOf(S, nx.h) ? (Wd.asClub(S, nx.h, () => S.ticket) || 'normal') : 'normal'; return `<div class="stline">${ic('stadium')} <b>${esc(st.name)}</b><span class="tkl tk-${tk}">${ic('ticket')} Preço: ${TK_NAME[tk] || tk}</span></div>`; })()}
      <div class="vsrow"><button class="t" data-act="club" data-club="${esc(nx.h)}">${crest(nx.h, 'lg')}<b>${esc(nx.h)}</b>${coachTag(nx.h)}${teamCard(nx.h)}</button><div class="count num" id="countdown" data-t="${t}"></div><button class="t" data-act="club" data-club="${esc(nx.a)}">${crest(nx.a, 'lg')}<b>${esc(nx.a)}</b>${coachTag(nx.a)}${teamCard(nx.a)}</button></div>
      <div class="prob"><i style="width:${win * 100}%;background:var(--lime)"></i><i style="width:${pv.pd * 100}%;background:rgba(255,255,255,.55)"></i><i style="width:${lose * 100}%;background:var(--coral)"></i></div>
      <div class="probl"><span>V ${Math.round(win * 100)}%</span><span>E ${Math.round(pv.pd * 100)}%</span><span>D ${Math.round(lose * 100)}%</span></div>
      <div class="row between wrap" style="margin-top:10px">${refChip(ref)}${C.isDerby(nx.h, nx.a) ? `<span class="pill hot">${ic('s_pressao')} Clássico +1★</span>` : ''}</div>
      <div class="row" style="margin-top:12px"><button class="btn" style="flex:1" data-act="goto" data-v="squad" data-sub="lineup">${ic('tactic')} Tática</button><button class="btn white" style="flex:1" data-act="teamtalk" ${talked ? 'disabled' : ''}>${ic('chat')} ${talked ? 'Feito' : 'Grupo'}</button></div>
      ${test}</div>`;
    // painel "Mais" do card da agenda: só o que os outros cards não têm
    UI.agProb = `<div class="prob"><i style="width:${win * 100}%;background:var(--lime)"></i><i style="width:${pv.pd * 100}%;background:rgba(255,255,255,.55)"></i><i style="width:${lose * 100}%;background:var(--coral)"></i></div>
      <div class="probl"><span>V ${Math.round(win * 100)}%</span><span>E ${Math.round(pv.pd * 100)}%</span><span>D ${Math.round(lose * 100)}%</span></div>`;
    const convo = Wd.squad(S, S.club).filter(id => (S.ps[id] || {}).away > nx.k - S.slot + 1);
    const convoHTML = convo.length ? `<div class="pill" style="background:rgba(155,123,255,.22);white-space:normal;text-align:left">${ic('user')} Convocado${convo.length > 1 ? 's' : ''} pra Seleção, fora deste jogo: <b>${convo.map(id => esc(P[id].short)).join(', ')}</b></div>` : '';
    UI.agRef = `${refChip(ref)}${C.isDerby(nx.h, nx.a) ? `<span class="pill hot">${ic('s_pressao')} Clássico +1★</span>` : ''}${convoHTML}`;
    UI.agTest = soloAdvHTML(true); UI.agPause = pauseInfo;
    UI.agTalked = talked;
  } else if (nx && nx.pending) next = `<div class="hero"><span class="compb">${ic('trophy')} Continental</span><p style="margin:10px 0 0">Grupos sorteados após a pré-Libertadores · ${when(SE.slotTime(S, nx.k))}</p>${test}</div>`;
  else next = S.post ? postHero(test) : `<div class="hero"><span class="compb">${ic('cal')} Fim de temporada</span>${test}</div>`;
  if (!UI.agTest && test) UI.agTest = soloAdvHTML(true);
  const lm = S.lastMatch;
  const last = lm && lm.season === S.season ? (() => {
    const my = lm.f.h === club ? lm.res.gh : lm.res.ga, ot = lm.f.h === club ? lm.res.ga : lm.res.gh;
    const k = my > ot ? 'w' : my < ot ? 'l' : 'd';
    return `<button class="tile full lastm" data-act="watch"><span class="res2 ${k}">${{ w: 'V', d: 'E', l: 'D' }[k]}</span>
      <span class="grow"><span class="eyebrow" style="margin:0">${SE.COMP_NAME[lm.f.comp]}</span><span class="row" style="gap:6px;font-weight:800">${crest(lm.f.h, 'sm')} ${lm.res.gh} – ${lm.res.ga} ${crest(lm.f.a, 'sm')} <span class="small muted">${esc(lm.f.h === club ? lm.f.a : lm.f.h)}</span></span></span>
      <span class="pill">${ic('ball')} ${lm.watched ? 'Rever' : 'Assistir'}</span>${lm.res.gate && lm.f.h === club ? `<span class="lmgate">${ic('stadium')} ${fmt(lm.res.gate.att)} (${Math.round(lm.res.gate.occ * 100)}%) · T$ ${fmtK(lm.res.gate.rev)}</span>` : ''}</button>`;
  })() : '';
  const raise = S.flags.raise ? (() => { const r = S.flags.raise; return `<div class="tile yellow full"><div class="eyebrow">${ic('cash')} Pedido de aumento</div>
    <div class="row">${av(r.id)}<div class="grow">${plink(r.id, P[r.id].name)} quer <b>T$ ${fmt(r.sal)}/dia</b><div class="small" style="opacity:.7">hoje T$ ${fmt(vw(r.id).sal)} · ${esc(r.abroad.club)} ofereceu T$ ${fmtK(r.abroad.fee)}</div></div></div>
    <div class="row" style="margin-top:10px"><button class="btn" style="flex:1;background:#16150A;color:#fff" data-act="raiseok">Dar aumento</button><button class="btn" style="flex:1;background:rgba(0,0,0,.12)" data-act="raiseno">Recusar</button></div></div>`; })() : '';
  const offers = S.offers.length ? `<div class="tile pink full"><div class="row between"><div class="eyebrow" style="margin:0">${ic('sell')} Propostas</div><span class="pill" style="background:rgba(0,0,0,.1);border:0">${S.offers.length}</span></div>
    <div class="stack" style="gap:8px;margin-top:10px">${S.offers.slice(0, 2).map(offerHTML).join('')}</div></div>` : '';
  const pk = S.packs && S.packs.list ? S.packs.list.filter(x => x.taken == null) : [];
  const nextPack = pk.length ? null : packNext();
  const pack = pk.length ? `<button class="tile full packt" data-act="goto" data-v="market" data-sub="pack" style="--cc:${CAT_COL[pk[0].cat]}">
    ${catBadge(pk[0].cat, true)}<span class="grow"><span class="eyebrow" style="margin:0">Pacote do dia</span><b class="disp" style="font-size:28px;display:block">${CAT_NAME[pk[0].cat]}${pk.length > 1 ? ' + ' + CAT_NAME[pk[1].cat] : ''}</b><small class="muted">expira em <b class="num cdown" data-t="${SE.sportDayStart(S, (S.lastDay ?? 0) + 1)}"></b></small></span><span class="btn sm">${ic('box')} Abrir</span></button>`
    : `<button class="tile full packt wait" type="button" style="--cc:${nextPack ? CAT_COL[nextPack.cat] : 'var(--muted)'}" disabled>
    ${nextPack ? catBadge(nextPack.cat, true) : `<span class="catb big">${ic('box')}</span>`}<span class="grow"><span class="eyebrow" style="margin:0">Próximo pacote</span><b class="disp" style="font-size:28px;display:block">${nextPack ? CAT_NAME[nextPack.cat] : 'Em breve'}</b><small class="muted">${nextPack ? 'Disponível em' : 'Só na próxima temporada'}</small></span>${nextPack ? `<span class="packwait-time num cdown" data-t="${nextPack.t}"></span>` : ''}</button>`;
  const sched = SE.clubSchedule(S, club);
  const idx = sched.findIndex(x => x.k >= S.slot);
  const strip = sched.slice(Math.max(0, idx - 2), Math.max(0, idx - 2) + 8).map(x => {
    if (x.tbd) return `<div class="fx"><span class="d">${when(x.t)}</span>${ic('trophy', '', 'color:var(--muted)')}<span class="c">${x.comp === 'CB' ? 'Copa' : 'Contin.'}</span><span class="o muted">a definir</span></div>`;
    const opp = x.h === club ? x.a : x.h, done = x.k < S.slot;
    const sc = done ? `<b class="num">${x.h === club ? x.gh : x.ga}–${x.h === club ? x.ga : x.gh}</b>` : `<span class="c">${x.h === club ? 'casa' : 'fora'}</span>`;
    return `<button class="fx ${done ? 'done' : ''} ${nx && x.k === nx.k ? 'next' : ''}" ${done ? `data-act="match" data-k="${x.k}" data-h="${esc(x.h)}" data-a="${esc(x.a)}"` : `data-act="club" data-club="${esc(opp)}"`}><span class="d">${SE.gameDate(S, x.k).txt}</span><span class="c">${when(x.t)}</span>${crest(opp)}<span class="o">${esc(opp)}</span><span class="c">${SE.COMP_NAME[x.comp]}</span>${sc}</button>`;
  }).join('');
  const q = (act, label, icon, col, extra = '') => `<button data-act="${act}" ${extra} style="--qc:${col}">${ic(icon)}<span>${label}</span></button>`;
  const betsOpen = SE.nextLeagueBet && SE.nextLeagueBet(S);
  const quick = `<div class="quick">
    ${q('modal', 'Amistoso', 'vs', 'var(--lime)', 'data-m="friendly"')}
    ${q('goto', 'Palpites', 'tiger', 'var(--orange)', 'data-v="comps" data-sub="bets"')}
    ${q('goto', 'DM', 'med', 'var(--coral)', 'data-v="dm"')}
    ${q('goto', 'Treino', 'dumbbell', 'var(--orange)', 'data-v="squad" data-sub="train"')}
    ${q('goto', 'Base', 'sprout', 'var(--green)', 'data-v="squad" data-sub="youth"')}
    ${q('modal', 'Finanças', 'cash', 'var(--yellow)', 'data-m="finance"')}
    ${q('modal', 'Coletiva', 'mic', 'var(--blue)', 'data-m="press"')}
    ${q('modal', 'Uniforme', 'shirt', 'var(--mint)', 'data-m="kit"')}
    ${q('goto', 'Agenda', 'cal', 'var(--stone)', 'data-v="comps" data-sub="cal"')}
    ${q('modal', 'Carreira', 'user', 'var(--coral)', 'data-m="career"')}${(NET.online ? NET.isAdmin() : true) ? q('modal', 'ADM', 'lock', 'var(--purple)', 'class="qfull" data-m="admin"') : ''}</div>`;
  return `${topbar()}<div class="stack">
    ${topRow()}
    ${helpBanner()}
    <div class="clubhead"><div class="chav">${coachImg(S.avatar, club)}${crest(club, 'md')}</div><div class="grow"><h2>${esc(club)}</h2><div class="muted small" style="font-weight:700">${ic('user')} ${esc(S.manager)} · Série ${div}</div>
      <div class="pills"><span class="pill">${ic('trophy')} ${pos}º</span><span class="pill">${T.v * 3 + T.e} pts</span><span class="pill">${ic('cal')} ${Math.min(SE.SLOTS, S.slot)}/${SE.SLOTS}</span><span class="form">${(T.form || []).slice(-5).map(x => `<span class="${x}">${x}</span>`).join('')}</span></div></div></div>
    ${ouroBanner()}${callBanner()}${drawBanner()}${cbBanner()}${arrearsNote()}${agendaHTML({ html: nx && !nx.pending ? next : '', test }, nx ? 'k' + nx.k : null)}
    ${quick}
    ${windowPill()}
    <div class="bento">
      ${jobOffersTile()}${raise}${last}${offers}${pack}
      ${objectiveTile(pos)}
      <div class="tile full budget"><div class="row between"><div class="eyebrow" style="margin:0">${ic('wallet')} Orçamento</div><button class="link" data-act="modal" data-m="finance">detalhes</button></div>${budgetBar(b, 'bb-home')}</div>
      ${streakHTML()}
      ${NET.online ? leagueRoster() : ''}
    </div>
  </div>`;
}
function offerRow(o, unemployed) {
  const c = o.club, div = (Wd.divOf(S, c) || 'B'), real = false;
  const ask = UI.jobAsk === c;
  return `<div class="prow"><span></span>${crest(c)}<span><span class="n">${esc(c)}</span><span class="m">Série ${div}${real ? ' · elenco real' : ''} · caixa T$ ${fmtK(S.cash[c])}${o.kind === 'vaga' ? ' · vaga aberta' : ''}</span></span><span class="rt" style="display:flex;gap:6px">${unemployed || ask ? `<button class="btn sm" data-act="joboffer" data-club="${esc(c)}">${unemployed ? 'Assumir' : 'Confirmar'}</button>` : `<button class="btn sm" data-act="jobask" data-club="${esc(c)}">Aceitar</button>`}${unemployed ? '' : `<button class="btn sm alt" data-act="jobno" data-club="${esc(c)}">${ask ? 'Voltar' : 'Recusar'}</button>`}</span></div>`;
}
// propostas de emprego pra quem está empregado (dança das cadeiras)
function jobOffersTile() {
  if (!EV.validOffers) return '';
  const L = EV.validOffers(S); if (!L.length) return '';
  return `<div class="tile full joboff"><div class="eyebrow" style="margin:0 0 6px">${ic('handshake')} Proposta de emprego</div><p class="small muted" style="margin:0 0 6px">Aceitar significa deixar o ${esc(S.club)}. Um interino assume o seu lugar e a vaga vira proposta para os outros treinadores.</p><div class="list">${L.map(o => offerRow(o, false)).join('')}</div></div>`;
}
function vUnemployed() {
  const vac = EV.vacancies(S), offs = EV.validOffers ? EV.validOffers(S) : [];
  const fired = S.job && S.job.st === 'fired';
  return `${topbar()}<div class="stack">${idleBanner()}<h1 class="disp" style="font-size:40px">Sem clube</h1>
    <p class="muted" style="margin:0">${fired ? `Você foi demitido do ${esc(S.unemployed)}${S.job && S.job.why === 'idle' ? ' por inatividade' : ''}.` : `Você pediu demissão do ${esc(S.unemployed)}.`} Propostas chegam logo depois da saída, e toda vez que outro técnico sai do cargo a vaga dele também aparece aqui.</p>
    ${offs.length ? `<div class="tile"><div class="eyebrow">${ic('handshake')} Propostas</div><div class="list">${offs.map(o => offerRow(o, true)).join('')}</div></div>` : ''}
    <div class="eyebrow" style="margin:6px 0 0">Vagas abertas</div>
    <div class="tile">${vac.length ? `<div class="list">${vac.map(c => `<div class="prow"><span></span>${crest(c)}<span><span class="n">${esc(c)}</span><span class="m">Série ${(Wd.divOf(S, c) || 'B')} · caixa T$ ${fmtK(S.cash[c])}${dnaTag(c)}</span></span><span class="rt"><button class="btn sm" data-act="takejob" data-club="${esc(c)}">Assumir</button></span></div>`).join('')}</div>` : '<p class="muted" style="margin:0">Nenhuma vaga aberta agora.</p>'}</div>
    ${NET.online ? '' : `<div class="test"><button class="btn sm alt" data-act="advday" style="flex:1">+1 dia (teste)</button></div>`}</div>`;
}

// ---------- elenco ----------
function vSquad() {
  const sub = subOf('squad', 'players');
  const seg = segHTML('squad', [['players', 'Jogadores'], ['lineup', 'Escalação'], ['stats', 'Números'], ['youth', 'Base'], ['train', 'Treino']]);
  let body = '';
  if (sub === 'players') body = squadList();
  else if (sub === 'lineup') { try { body = lineupView(); } catch (e) { viewErr('escalação', e); body = `<div class="note">Não deu pra montar a escalação agora. O erro foi enviado pra correção automática. Toque em <b>Escalar melhor time</b> pra refazer.</div><div class="row wrap"><button class="btn sm" data-act="autoxi">Escalar melhor time</button></div>`; } }
  else if (sub === 'stats') body = squadStats();
  else if (sub === 'youth') body = youthView();
  else body = trainView();
  return `${topbar()}<div class="stack">${seg}${body}</div>`;
}
const POS_ORDER = { GOL: 0, ZAG: 1, LD: 2, LE: 3, ADD: 2, ADE: 3, VOL: 4, MC: 5, ME: 6, MD: 6, MEI: 7, PE: 8, PD: 8, SA: 9, CA: 10 };
function squadList() {
  const f = UI.sq;
  let ids = mySquad().filter(id => (f.setor === 'ALL' || P[id].setor === f.setor) && (!f.exp || expiring(id)));
  let loanIds = f.exp ? [] : loanedOutIds().filter(id => f.setor === 'ALL' || P[id].setor === f.setor);
  const sorts = { pos: (a, b) => POS_ORDER[P[a].pos] - POS_ORDER[P[b].pos] || vw(b).ovr - vw(a).ovr, ovr: (a, b) => vw(b).ovr - vw(a).ovr,
    cond: (a, b) => vw(a).cond - vw(b).cond, mor: (a, b) => vw(a).mor - vw(b).mor, age: (a, b) => ageOf(a) - ageOf(b), sal: (a, b) => vw(b).sal - vw(a).sal, ce: (a, b) => vw(a).ce - vw(b).ce };
  ids.sort(sorts[f.sort]);
  loanIds.sort(sorts[f.sort]);
  const xi = new Set(SE.userTeam(S).xi);
  const exp = mySquad().filter(expiring).length;
  const rows = ids.map(id => playerRow(id, { meta: id2 => `${ageOf(id2)}a · T$ ${fmt(vw(id2).sal)}/d · ${vw(id2).ce}${xi.has(id2) ? ' · <b style="color:var(--lime)">titular</b>' : ''}` })).join('');
  const loanRows = loanIds.map(id => playerRow(id, { loanedOut: true, meta: id2 => { const lo = S.ps[id2].loanOut; return `Emprestado ao ${esc(own(id2))} · volta ${LOAN_BACK(lo.season, lo.end)}`; } })).join('');
  const setores = [['ALL', 'Todos'], ['GOL', 'GOL'], ['DEF', 'DEF'], ['MEI', 'MEI'], ['ATA', 'ATA']].map(([k, l]) => `<button class="chip ${f.setor === k ? 'on' : ''}" data-act="sqset" data-k="${k}">${l}</button>`).join('');
  // v177: quem já foi contratado mas ainda não chegou (acordo com a janela fechada ou pré-contrato) aparece no elenco, em cinza
  let arr = '';
  try {
    const pend = MK.pendingFor(S, S.club).filter(x => P[x.id]), pre = (S.pre || []).filter(x => x.club === S.club && P[x.id]);
    const row = (id, txt) => `<button class="prow arriving" data-act="player" data-id="${id}" style="grid-template-columns:40px 1fr auto;width:100%;text-align:left">${av(id)}<span style="min-width:0"><span class="n">${esc(P[id].name)}</span><span class="m" style="white-space:normal">${esc(P[id].pos)} · ${txt}</span></span><span class="ob ${pcat(id).k} num">${vw(id).ovr}</span></button>`;
    const L = [...pend.map(x => row(x.id, `chega ${x.at ? when(x.at) : 'na abertura da janela'}${x.swap != null && P[x.swap] ? ` · ${esc(P[x.swap].short)} vai na troca` : ''}`)), ...pre.map(x => row(x.id, `pré-contrato · chega na temporada ${S.season + 1}`))];
    if (L.length) arr = `<div class="tile tight"><div class="eyebrow" style="margin:4px 0 2px">${ic('swap')} Chegam depois · já contratados</div><div class="list">${L.join('')}</div></div>`;
  } catch (e) {}
  return `${arr}<div class="row between wrap"><div class="chips">${setores}</div>
    <select id="sq-sort" style="width:auto;padding:7px 10px;font-size:13px">${[['pos', 'Posição'], ['ovr', 'Overall'], ['cond', 'Condição'], ['mor', 'Moral'], ['age', 'Idade'], ['sal', 'Salário'], ['ce', 'Contrato']].map(([k, l]) => `<option value="${k}" ${f.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="legendrow"><span>${mySquad().length}/${C.ECON.squadMax} disponíveis</span>${loanIds.length ? `<span>${loanIds.length} cedido${loanIds.length > 1 ? 's' : ''}</span>` : ''}<span>${moodFace(80)} moral</span><span><span class="cbar"><i style="height:70%;background:var(--green)"></i></span> condição</span>${exp ? `<button class="expf ${f.exp ? 'on' : ''}" data-act="sqexp" aria-pressed="${f.exp ? 'true' : 'false'}">${ic('renew')} ${exp} fim de contrato${f.exp ? ' ×' : ''}</button>` : ''}</div>
    <div class="tile tight"><div class="list">${rows}</div></div>${loanRows ? `<h2 class="sech">${ic('swap', '', 'color:var(--mint)')} Emprestados · indisponíveis</h2><div class="tile tight"><div class="list">${loanRows}</div></div>` : ''}`;
}
function fixTac() {   // v163: conserta táticas antigas/corrompidas antes de desenhar
  const T = S.tactics = S.tactics && typeof S.tactics === 'object' ? S.tactics : {};
  if (!C.FORMATIONS[T.formation]) T.formation = Object.keys(C.FORMATIONS)[0];
  if (!C.STYLES[T.style]) T.style = Object.keys(C.STYLES)[0];
  if (!T.triggers || typeof T.triggers !== 'object') T.triggers = {};
  if (!Array.isArray(T.xi)) T.xi = [];
  if (T.bench != null && !Array.isArray(T.bench)) delete T.bench;
  if (Array.isArray(T.bench)) T.bench = T.bench.filter(id => id != null && P[id]);
  T.xi = T.xi.map(id => id != null && P[id] ? id : null);
  for (const k of ['cap', 'vice', 'pk']) if (T[k] != null && !P[T[k]]) T[k] = null;
  try { const L = S.lineups && S.lineups[S.club]; if (Array.isArray(L)) S.lineups[S.club] = L.filter(x => x && Array.isArray(x.xi)); else if (S.lineups && L != null) S.lineups[S.club] = []; } catch (e) {}
  return T;
}
function lineupView() {
  fixTac();
  const T = S.tactics, team = SE.userTeam(S), slots = C.FORMATIONS[T.formation];
  const r = SIM.rate(SIM.mkTeam(team, id => SE.info(S, id)));
  { const xs = new Set(team.xi.filter(Boolean)), out = [];
    for (const [k, l] of [['cap', 'capitão'], ['vice', 'vice'], ['pk', 'cobrador de pênalti']]) if (T[k] != null && !xs.has(T[k])) { out.push(`${P[T[k]] ? P[T[k]].short : '?'} (${l})`); T[k] = null; }
    if (out.length) { save(); setTimeout(() => toast(`${out.join(', ')} fora do time titular: volta pro automático.`), 0); } }
  const capId = Wd.captain(S, S.club, team.xi.filter(Boolean)), viceId = T.vice != null && team.xi.includes(T.vice) && T.vice !== capId ? T.vice : null;
  const pitch = slots.map(([pos, x, y], i) => {
    const id = team.xi[i]; if (id == null) return `<button class="slot" style="left:${x}%;top:${y}%" data-act="slot" data-i="${i}"><span class="sn">${pos}</span></button>`;
    const s = vw(id), f = Wd.fitOf(S, id, pos), eff = Math.round(s.ovr * f);
    return `<button class="slot ${UI.slot === i ? 'sel' : ''}" style="left:${x}%;top:${y}%" data-act="slot" data-i="${i}" aria-label="${pos}">
      <span class="mf">${moodFace(s.mor)}</span>${id === capId ? '<span class="capb">C</span>' : id === viceId ? '<span class="capb v">V</span>' : ''}<img class="spr" src="${sprite(id)}" alt=""><span class="cm"><i style="width:${s.cond}%;background:${condColor(s.cond)}"></i></span><span class="sn">${esc(P[id].short)}</span><span class="so ${cat(eff).k}">${pos} · ${eff}${f < 0.9 ? ' !' : ''}</span></button>`;
  }).join('');
  const forms = Object.keys(C.FORMATIONS).map(f => `<button class="chip ${T.formation === f ? 'on' : ''}" data-act="form" data-f="${f}">${f}</button>`).join('');
  const styles = Object.entries(C.STYLES).map(([k, s]) => `<button class="stylei ${T.style === k ? 'on' : ''}" style="--sc:${STYLE_COL[k]}" data-act="style" data-k="${k}" title="${esc(s.desc)}">${ic('s_' + k)}<span>${s.name}</span></button>`).join('');
  const sd = C.STYLES[T.style];
  const opt = (sel, none) => `<option value="">${none}</option>` + Object.entries(C.STYLES).map(([k, s]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${s.name}</option>`).join('');
  const fopt = sel => `<option value="">Mesma formação</option>` + Object.keys(C.FORMATIONS).map(f => `<option value="${f}" ${sel === f ? 'selected' : ''}>${f}</option>`).join('');
  const tr = T.triggers;
  const trig = (key, label) => `<div class="trig"><b class="small">${label}</b><div class="sel2"><select data-trig="${key}">${opt(tr[key], 'Não mudar')}</select><select data-trig="${key}f">${fopt(tr[key + 'f'])}</select></div></div>`;
  const bench = team.bench.map(id => playerRow(id, { meta: id2 => `Banco · condição ${Math.round(vw(id2).cond)}` })).join('');
  const out = mySquad().filter(id => !SE.lineupAvail(S, id)).map(id => playerRow(id)).join('') + loanedOutIds().map(id => playerRow(id, { loanedOut: true, meta: id2 => `Emprestado ao ${esc(own(id2))} · fora da escalação` })).join('');
  return `${savedLineups()}<div class="eyebrow" style="margin:2px 0 -4px">Formações</div><div class="fchips chips">${forms}</div>
    <div class="pitch"><div class="half"></div>${pitch}</div>
    <div class="legendrow"><span>Toque pra trocar</span><span><span class="cbar h"><i style="width:60%;background:var(--yellow)"></i></span> condição</span><span><b style="color:var(--coral)">!</b> fora de posição</span></div>
    <div class="rtg"><div><span>Ataque</span><b class="num">${r.ATA.toFixed(0)}</b></div><div><span>Meio</span><b class="num">${r.MEI.toFixed(0)}</b></div><div><span>Defesa</span><b class="num">${r.DEF.toFixed(0)}</b></div><div><span>Goleiro</span><b class="num">${r.GOL.toFixed(0)}</b></div></div>
    <div class="row wrap"><button class="btn sm alt" data-act="autoxi">Escalar melhor time (poupa cansados)</button></div>
    ${capBox(team.xi.filter(Boolean))}
    <h2 class="sech">${ic('s_' + T.style, '', `color:${STYLE_COL[T.style]}`)} Estilo de jogo</h2><div class="styles8">${styles}</div>
    <div class="note small" style="border-left:3px solid ${STYLE_COL[T.style]}"><b>${sd.name}:</b> ${sd.desc}</div>
    <h2 class="sech">${ic('tactic')} Durante o jogo</h2>
    <div class="tile" style="padding:6px 14px">${trig('lead2', 'Se estiver vencendo por 2 ou mais')}${trig('losing60', 'Se estiver perdendo depois dos 60 min')}${trig('draw75', 'Se estiver empatando depois dos 75 min')}</div>
    ${benchEditor()}
    ${out ? `<h2 class="sech">${ic('med', '', 'color:var(--coral)')} Indisponíveis</h2><div class="tile" style="padding:4px 12px"><div class="list">${out}</div></div>` : ''}`;
}
function capBox(xi) {
  // capitão, vice e cobrador saem do time titular: tirou do time, volta pro automático
  const T = S.tactics, sq = xi.slice().sort((a, b) => Wd.leaderScore(S, b) - Wd.leaderScore(S, a));
  const cap = T.cap != null && sq.includes(T.cap) ? T.cap : null, vice = T.vice != null && sq.includes(T.vice) ? T.vice : null;
  const eff = Wd.captain(S, S.club, xi), nat = cap == null ? eff : sq[0];
  const opt = (sel, none, skip) => `<option value="">${none}</option>` + sq.filter(id => id !== skip).map(id => `<option value="${id}" ${sel === id ? 'selected' : ''}>${esc(P[id].short)} · ${P[id].pos} · ${vw(id).ovr}</option>`).join('');
  const m = eff != null ? vw(eff).mor : 50, mood = m >= 70 ? ['var(--lime)', 'Lidera bem: o grupo ganha +1 de moral por jogo em que ele atua'] : m < 35 ? ['var(--coral)', 'Insatisfeito: contamina o vestiário (−1 de moral por jogo)'] : ['var(--yellow)', 'Neutro: sem efeito no grupo'];
  return `<h2 class="sech">${ic('star')} Capitão e pênaltis</h2><div class="tile capbox">
    <div class="caprow"><span class="capc">C</span><select id="cap-sel">${opt(cap, `Automático (${nat != null ? esc(P[nat].short) : '—'})`, vice)}</select></div>
    <div class="caprow"><span class="capc v">V</span><select id="vice-sel">${opt(vice, 'Sem vice definido', cap)}</select></div>
    <div class="caprow"><span class="capc pk" title="Cobrador de pênalti">P</span><select id="pk-sel"><option value="">Pênalti: automático (entre os atacantes)</option>${xi.filter(id => P[id].pos !== 'GOL').sort((a, b) => vw(b).ovr - vw(a).ovr).map(id => `<option value="${id}" ${T.pk === id ? 'selected' : ''}>Pênalti: ${esc(P[id].short)} · ${P[id].pos} · ${vw(id).ovr}</option>`).join('')}</select></div>
    ${eff != null ? `<div class="small" style="margin-top:6px"><b style="color:${mood[0]}">${esc(P[eff].short)} ${moodFace(m)}</b> <span class="muted">${mood[1]}.</span></div>` : ''}
    <p class="small muted" style="margin:4px 0 0">Capitão, vice e cobrador saem do time titular: se você tirar um deles do time, a escolha volta pro automático (a braçadeira vai pro vice ou pro líder natural em campo). Moral: tirar a faixa de quem continua jogando pesa (−4, ou −8 se ele for o líder natural; o novo capitão ganha +4). Se o capitão só ficou fora do jogo, ninguém perde moral. O cobrador bate os pênaltis do jogo e abre a disputa.</p></div>`;
}
function youthView() {
  const ids = (S.youth[S.club] || []).slice().sort((a, b) => vw(b).pot - vw(a).pot);
  const rows = ids.map(id => playerRow(id, { meta: id2 => `${ageOf(id2)} anos · ${C.POS_NAME[P[id2].pos]} · potencial ${potStars(id2).txt}`,
    right: id2 => `<span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span>` })).join('');
  return `<div class="tile lime"><div class="eyebrow">Categorias de base</div><p style="margin:0">Toda temporada chegam 3 garotos novos, da base real do clube (Sub-20 e Sub-17); quando a lista acaba, chegam garotos gerados. Cada garoto que você sobe abre vaga pra outro na base, até ${TRAIN.YCAP[Wd.divOf(S, S.club)] || 5} na temporada (Série A 5, B 6, C 7)${S.youthLog ? ` · nesta temporada: ${TRAIN.youthIntake(S, S.club, S.season)}` : ''}. Suba quantos quiser, desde que o elenco profissional não passe de ${C.ECON.squadMax}. Treino intenso acelera a evolução.</p></div>
    <div class="tile" style="padding:4px 12px">${rows ? `<div class="list">${rows}</div>` : '<p class="muted">Base vazia.</p>'}</div>
    <p class="muted small" style="margin:0">Pra achar jovens de outros clubes (dados reais do Transfermarkt), use Mercado › Olheiros.</p>`;
}
// vaga do treino individual (um jogador por vez): ocupada mostra o progresso; livre, mostra quem pode entrar
// v169: romper o teto (separado do treino individual, cor própria, só jogadores "Em ascensão")
function rompHTML() {
  const fd = Math.floor(SE.fdAt(S, SE.now(S)) + 1e-6), t = S.romp && S.romp.s === S.season && P[S.romp.id] ? S.romp : null;
  const head = `<h2 class="disp" style="font-size:26px;margin-top:18px;color:var(--purple)">${ic('star', '', 'color:var(--purple)')} Romper o teto</h2>`;
  if (t) {
    const s = S.ps[t.id] || {}, rt = (s.romp && s.romp.rt) || [], r = TRAIN.rompResult(rt), left = Math.max(0, t.fd1 - fd), pct = Math.round(Math.max(0, Math.min(1, (fd - t.fd0) / (t.fd1 - t.fd0))) * 100);
    const proj = r.n < TRAIN.ROMP_MIN ? `precisa de ${TRAIN.ROMP_MIN - r.n} jogo(s) a mais` : r.up ? `hoje: teto +${r.up}` : 'hoje: não rompe (média abaixo de 6,5)';
    // v204: barrinhas jogo a jogo (como as etapas do objetivo): cor pela nota vs. time; convocação = jogo 7,0 com a bandeira
    const cu = new Set((s.romp && s.romp.cu) || []), slots = Math.max(5, rt.length + (left ? 1 : 0));
    const segs = Array.from({ length: slots }, (_, i) => { if (i >= rt.length) return '<i></i>'; const v = rt[i], c = v >= 7.5 ? 'r3' : v >= 7 ? 'r2' : v >= 6.5 ? 'r1' : 'r0';
      return `<i class="${c}" title="${cu.has(i) ? 'Convocação' : `Jogo ${i + 1}`}: ${v.toFixed(1).replace('.', ',')}">${cu.has(i) ? 'BR' : v.toFixed(1).replace('.', ',')}</i>`; }).join('');
    const nxt = r.n ? [[6.5, 1], [7, 2], [7.5, 3]].find(([th]) => r.avg < th) : null;
    const gap = r.n >= TRAIN.ROMP_MIN && nxt ? ` · falta ${(nxt[0] - r.avg).toFixed(1).replace('.', ',')} na média pra +${nxt[1]}` : '';
    return `${head}<button class="ptslot on romp" data-act="player" data-id="${t.id}">${av(t.id)}<span class="grow"><b>${esc(P[t.id].short)}</b><small>${r.n} jogo(s) · média vs. time <b>${r.n ? r.avg.toFixed(1).replace('.', ',') : '—'}</b> · ${proj}${gap}</small><span class="etd rmp">${segs}</span><span class="rmpl"><i class="r1"></i>6,5 +1<i class="r2"></i>7,0 +2<i class="r3"></i>7,5 +3</span><span class="accb"><i style="width:${pct}%"></i></span><small>${left ? `Termina em ${left} dia${left > 1 ? 's' : ''} do jogo` : 'Termina na próxima virada de dia'}</small></span></button>`;
  }
  const el = mySquad().filter(id => { const s = S.ps[id]; return s && s.asc > fd; });
  const rows = el.map(id => { const why = TRAIN.rompWhy(S, id); return `<div class="prow" style="grid-template-columns:34px 1fr auto">${av(id)}<span><span class="n">${esc(P[id].short)} <em class="tag asc">EM ASCENSÃO</em></span><span class="m">${Wd.age(S, id)} anos · ${vw(id).ovr} → ${vw(id).pot} · fase por mais ${Math.max(0, S.ps[id].asc - fd)} dia(s)</span>${why ? `<span class="m" style="color:var(--coral)">${esc(why)}</span>` : ''}</span>${why ? '' : `<button class="btn sm romp" data-act="rompgo" data-id="${id}">${TRAIN.ROMP_COST} ${ic('star')}</button>`}</div>`; }).join('');
  return `${head}<div class="tile romp" style="padding:10px 14px"><p class="small" style="margin:0 0 8px">Jovem até 23 anos com média 6,8 nos últimos 5 jogos oficiais entra na fase <b>Em ascensão</b> (20 dias). Nela, dá pra tentar subir o potencial: ${TRAIN.ROMP_COST} ${ic('star')} e ${TRAIN.ROMP_DAYS} dias. No fim, conta a média nos jogos oficiais do período (mínimo ${TRAIN.ROMP_MIN}): 7,5+ = teto +3 · 7,0 = +2 · 6,5 = +1 · abaixo disso, não rompe. <b>Atenção: não é a nota que aparece na partida.</b> Cada jogo vale a nota dele comparada com a média do time naquele jogo: 6,5 = jogou igual à média do time; 7,0 = meio ponto acima dos companheiros. Time fraco não atrapalha; o que conta é se destacar. Só jogos com 30 minutos ou mais. Convocação pra Data FIFA no meio da tentativa vale como um jogo com 7,0.</p>${rows ? `<div class="list">${rows}</div>` : '<p class="small muted" style="margin:0">Nenhum jogador em ascensão agora.</p>'}</div>`;
}
function ptSlotHTML() {
  const t = S.ptrain && S.ptrain.s === S.season && P[S.ptrain.id] ? S.ptrain : null;
  if (t) {
    const fd = Math.floor(SE.fdAt(S, SE.now(S))), left = Math.max(0, t.fd1 - fd), pct = Math.round(Math.max(0, Math.min(1, (fd - t.fd0) / (t.fd1 - t.fd0))) * 100);
    return `<h2 class="disp" style="font-size:26px">Treino individual</h2><button class="ptslot on" data-act="ptopen" data-id="${t.id}">${av(t.id)}<span class="grow"><b>${esc(P[t.id].short)}</b><small>${t.kind === 'pos' ? `Aprendendo a jogar de ${esc(C.POS_NAME[t.pos])}` : 'Evolução acelerada (3× mais rápido + 1 de overall no fim)'}</small><span class="accb"><i style="width:${pct}%"></i></span><small>${left ? `Termina em ${left} dia${left > 1 ? 's' : ''} do jogo` : 'Termina na próxima virada de dia'}</small></span></button>`;
  }
  // v155: sem sugestão automática; toca no + e escolhe qualquer jogador do elenco
  const ORD = ['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'MEI', 'PD', 'PE', 'SA', 'ATA'];
  const list = UI.ptList ? mySquad().slice().sort((a, b) => ((ORD.indexOf(P[a].pos) + 99) % 99) - ((ORD.indexOf(P[b].pos) + 99) % 99) || vw(b).ovr - vw(a).ovr) : [];
  return `<h2 class="disp" style="font-size:26px">Treino individual</h2><button class="ptslot empty" data-act="ptlist" style="width:100%;text-align:left"><span class="ptplus">${UI.ptList ? '×' : '+'}</span><span class="grow"><b>${UI.ptList ? 'Escolha o jogador' : 'Vaga livre: toque pra escolher'}</b><small>1 ${ic('star')} · ${TRAIN.PT_DAYS} dias · um jogador por vez. Aprender uma posição próxima ou evolução acelerada.</small></span></button>
    ${UI.ptList ? `<div class="list" style="margin-top:6px">${list.map(id => `<button class="prow" data-act="ptopen" data-id="${id}" style="grid-template-columns:34px 1fr auto;width:100%;text-align:left">${av(id)}<span><span class="n">${esc(P[id].short)}</span><span class="m">${esc(C.POS_NAME[P[id].pos] || P[id].pos)} · ${Wd.age(S, id)} anos</span></span><span class="small muted num">${vw(id).ovr} → ${vw(id).pot}</span></button>`).join('')}</div>` : ''}`;
}
// ---------- Elenco › Números: jogos, gols, assistências e nota da temporada (todas as competições) ----------
function squadStats() {
  const k = UI.sqst || 'g';
  const rows = mySquad().map(id => { const st = vw(id).st || {}, ps = S.ps[id] || {}; const pend = Object.values(ps.ycC || {}).some(v => v >= 2), sus = Wd.susOf(ps, null) > 0; return { id, j: st.j || 0, g: st.g || 0, a: st.a || 0, yc: st.yc || 0, rc: st.rc || 0, rt: st.j ? st.rt / st.j : null, min: st.min || 0, pend, sus }; });
  const by = { j: r => r.j * 1e4 + r.min, g: r => r.g * 1e4 + r.a * 10 + r.j, a: r => r.a * 1e4 + r.g * 10 + r.j, yc: r => r.yc * 1e4 + r.rc * 100 + r.j, rc: r => r.rc * 1e4 + r.yc * 100 + r.j, rt: r => r.j >= 1 ? (r.rt || 0) * 100 + r.j : -1 }[k];
  rows.sort((x, y) => by(y) - by(x));
  const hd = (key, l) => `<button class="${k === key ? 'on' : ''}" data-act="sqst" data-k="${key}">${l}</button>`;
  const cardB = c => `<i class="sqcard" style="background:${c}"></i>`;
  const tag = r => r.sus ? ' <em class="sqtag sus">suspenso</em>' : r.pend ? ' <em class="sqtag">pendurado</em>' : '';
  return `<div class="sqst"><div class="sqh"><span>Jogador</span>${hd('j', 'J')}${hd('g', 'G')}${hd('a', 'A')}${hd('yc', cardB('var(--yellow)'))}${hd('rc', cardB('var(--coral)'))}${hd('rt', 'Nota')}</div>
    ${rows.map(r => `<button class="sqr" data-act="player" data-id="${r.id}"><span class="nm"><b>${esc(P[r.id].short)}</b><small>${esc(P[r.id].pos)}${tag(r)}</small></span><span>${r.j}</span><span>${r.g}</span><span>${r.a}</span><span>${r.yc || '<i class="muted">0</i>'}</span><span>${r.rc || '<i class="muted">0</i>'}</span><span>${r.j ? rtb(r.rt) : rtb(null)}</span></button>`).join('')}</div>
    <p class="small muted" style="margin:0">Temporada ${S.season}, todas as competições. Toque no cabeçalho pra ordenar. Suspensão: 3 amarelos na mesma competição = 1 jogo de gancho (a contagem zera depois de cumprir); vermelho direto = 2 jogos, dois amarelos no jogo = 1. <b>Pendurado</b>: 2 amarelos, o próximo suspende.</p>`;
}
function trainView() {
  const TR_UI = { leve: ['feather', 'var(--mint)', [1, 3, 1]], normal: ['bolt', 'var(--yellow)', [2, 2, 2]], intenso: ['flame', 'var(--coral)', [3, 1, 3]] };
  const FX = [['up', 'Evolução'], ['heart', 'Recuperação'], ['med', 'Risco de lesão']];
  const pips = n => `<i class="pp">${[1, 2, 3].map(i => `<u class="${i <= n ? 'f' : ''}"></u>`).join('')}</i>`;
  const cards = Object.entries(C.TRAINING).map(([k, t]) => { const [icn, col, lv] = TR_UI[k]; return `<button class="trc ${S.training === k ? 'on' : ''}" style="--tc:${col}" data-act="training" data-k="${k}">
    <span class="trbig">${ic(icn)}</span><b>${t.name}</b><span class="trfx">${FX.map(([i, l], j) => `<span title="${l}">${ic(i)}${pips(lv[j])}</span>`).join('')}</span></button>`; }).join('');
  const legend = `<div class="trleg">${FX.map(([i, l]) => `<span>${ic(i)} ${l}</span>`).join('')}</div>`;
  const ids = mySquad().filter(id => vw(id).pot > vw(id).ovr).sort((a, b) => TRAIN.gainPerDay(S, b, S.training) - TRAIN.gainPerDay(S, a, S.training));
  const rows = ids.slice(0, 14).map(id => playerRow(id, { meta: id2 => `${ageOf(id2)} anos · potencial ~${potStars(id2).lo}–${potStars(id2).hi}`,
    right: id2 => `<span class="stack" style="gap:3px;align-items:flex-end;font-size:11px;font-weight:700"><span>+${(TRAIN.gainPerDay(S, id2, S.training) * 27).toFixed(1)}/temp.</span>${meter(vw(id2).xp * 100, 'var(--purple)')}</span><span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span>` })).join('');
  return `${ptSlotHTML()}${(() => { try { return rompHTML(); } catch (e) { return ''; } })()}<h2 class="disp" style="font-size:26px">Intensidade</h2><div class="trgrid">${cards}</div>${legend}
    <div class="note">${ic('heart')} <b>Condição física</b>: um jogo inteiro gasta cerca de 28 pontos (estilos de pressão, uns 38; veteranos cansam mais). A cada dia do calendário o jogador recupera uma parte do que falta (o número sobe dia a dia no elenco): numa semana sem copa (7 dias ou mais) volta ${Math.round((1 - Math.pow(1 - SE.REC_DAY, 7)) * 100)}% do cansaço no treino Normal; com jogo de copa no meio da semana, só 3 ou 4 dias separam os jogos e volta ${Math.round((1 - Math.pow(1 - SE.REC_DAY, 3)) * 100)}%. Treino Leve recupera mais rápido, Intenso mais devagar. Quem joga liga e copa sem rodar chega cansado no fim de semana e rende menos (e se machuca mais).</div>
    <div class="note">Cada ponto de overall fica mais difícil quanto mais perto do potencial (retorno decrescente). Jovens evoluem mais rápido; depois dos 30, quase nada. Acima de 31 anos o overall cai na virada da temporada.</div>
    <h2 class="disp" style="font-size:26px">Quem mais evolui</h2><div class="tile" style="padding:4px 12px"><div class="list">${rows || '<p class="muted">Ninguém com margem de evolução.</p>'}</div></div>`;
}

// ---------- mercado ----------
function vMarket() {
  const sub = subOf('market', 'pack');
  const seg = segHTML('market', [['pack', 'Pacote'], ['search', 'Buscar'], ['watch', `Favoritos${(S.watch || []).length ? ' · ' + S.watch.length : ''}`], ['lista', 'Listas'], ['free', 'Livres'], ['pre', 'Pré-contrato'], ['scout', 'Olheiros'], ['offers', `Propostas${S.offers.length ? ' · ' + S.offers.length : ''}`], ['hist', 'Histórico']]);
  let body = '';
  if (sub === 'pack') body = packView();
  else if (sub === 'search') body = searchView();
  else if (sub === 'free') body = `<p class="muted small" style="margin:0">Jogadores sem clube: os que já estavam livres na base real e os dispensados durante a carreira. Sem taxa de transferência, só salário, e dá pra negociar na hora.</p>${searchView(true)}`;
  else if (sub === 'pre') body = preView();
  else if (sub === 'scout') body = scoutView();
  else if (sub === 'hist') body = trView();
  else if (sub === 'lista') body = listedView();
  else if (sub === 'watch') body = watchView();
  else body = offersView();
  return `${topbar()}<div class="stack">${seg}${sub !== 'pack' && sub !== 'hist' ? windowPill(true) : ''}${body}</div>`;
}
function packWhy(o, b) {
  const [cs, cd] = o.cost, why = [];
  if ((S.stars || 0) < cs) why.push(`faltam ${cs - (S.stars || 0)}★`);
  if ((S.dias || 0) < cd) why.push(`falta ${cd - (S.dias || 0)} ${gemName(cd - (S.dias || 0))}`);
  if (o.sal > b.wageRoom) why.push(`salário +T$ ${fmt(o.sal - b.wageRoom)}/d acima do teto`);
  if (mySquad().length >= C.ECON.squadMax) why.push('elenco cheio');
  return why;
}
function packView() {
  const b = MK.budget(S), d = S.lastDay;
  const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const wdOf = k => { if (SE.isTurbo(S)) { const t = new Date(SE.sportDayStart(S, d + k) - 10800000); return `${WD[t.getUTCDay()]} ${t.getUTCHours()}h`; } return WD[new Date(Wd.startOfDay(S.created) + (d + k) * 86400000 + 43200000 - 10800000).getUTCDay()]; };
  const nextDays = [1, 2, 3, 4, 5, 6, 7].map(k => { const c = MK.packCat(S, d + k, S.club); return `<div class="nd">${c ? catBadge(c) : `<span class="catb mk">${ic('handshake', '', 'color:var(--muted)')}</span>`}<span>${k === 1 && !SE.isTurbo(S) ? 'Amanhã' : wdOf(k)}</span></div>`; }).join('');
  const list = (S.packs && S.packs.list) || [];
  const rest = S.packs && S.packs.off === 'fim' ? `<div class="tile restday">${ic('trophy')}<div><b>Temporada encerrada</b><span class="small muted">Sem pacotes até a nova temporada: os reforços emprestados voltariam na virada. Suas estrelas e diamantes ficam guardados.</span></div></div>` : S.packs && S.packs.rest ? `<div class="tile restday">${ic('handshake')}<div><b>Hoje é dia de mercado</b><span class="small muted">Com a janela de transferências aberta não tem pacote. Eles voltam quando a janela fechar${SE.isTurbo(S) ? ' (no Turbo, 1 pacote a cada 6 horas reais)' : ' (1 pacote por dia)'}.</span></div></div>` : '';
  const packs = list.map((pk, li) => {
    const key = `${d}-${li}`, opened = UI.opened && UI.opened[key], flipping = UI.flip === key;
    const head = `<div class="packh" style="--cc:${CAT_COL[pk.cat]}">${catBadge(pk.cat, true)}<div class="grow"><span class="eyebrow" style="margin:0">Pacote do dia${pk.extra ? ' · bônus do patrocinador' : ''}</span><b class="disp">${CAT_NAME[pk.cat]}</b></div>
      ${pk.taken != null ? '' : opened ? `<button class="btn sm alt" data-act="packskip" data-l="${li}">Poupar</button>` : `<button class="btn" data-act="packopen" data-l="${li}">${ic('box')} Abrir</button>`}</div>`;
    if (pk.taken != null) return `<div class="tile">${head}<p style="margin:10px 0 0">${pk.taken >= 0 ? `${ic('handshake')} ${pk.opts[pk.taken] && P[pk.opts[pk.taken].id] ? plink(pk.opts[pk.taken].id, P[pk.opts[pk.taken].id].name) : 'Jogador'} contratado.` : 'Você poupou hoje.'} Novo pacote amanhã.</p></div>`;
    if (!pk.opts.length) return `<div class="tile">${head}<p class="muted" style="margin:10px 0 0">Ninguém dessa categoria topa vir hoje.</p></div>`;
    const cards = pk.opts.filter(o => P[o.id]).map((o, oi) => {   // v229: idem
      const why = packWhy(o, b);
      return `<div class="pk ${opened && !flipping ? '' : 'closed'}" style="--c:${CAT_COL[o.cat]};--d:${oi * 220}ms"><div class="in">${cardHTML(o.id, { mini: true, priceHTML: costHTML(o.cost) })}<div class="back">${ic(CAT_ICON[o.cat])}</div></div>
      ${opened ? `${o.deal ? `<div class="pkdeal">${ic(o.deal.kind === 'loan' ? 'swap' : 'clock')}<span><b>${o.deal.label}</b><small>${o.deal.until}</small></span></div>` : ''}<div class="meta"><span>${ic('wallet')} ${fmt(o.sal)}/d</span>${plink(o.id, 'ver')}</div><button class="btn sm" style="width:100%;margin-top:6px" data-act="packtake" data-l="${li}" data-o="${oi}" ${why.length ? 'disabled' : ''}>Contratar</button>
        ${why.length ? `<div class="why">${ic('lock')} ${why.join(' · ')}</div>` : ''}` : ''}</div>`;
    }).join('');
    return `<div class="tile" style="border-color:${CAT_COL[pk.cat]}">${head}<div class="packs" style="margin-top:12px">${cards}</div></div>`;
  }).join('');
  const timer = packTimerHTML();
  const costs = Object.entries(C.PACK_COST).filter(([k]) => myOuro() ? k !== 'dia' : k !== 'oe').map(([k, c]) => `<div>${catBadge(k)}<b>${CAT_NAME[k]}</b>${costHTML(c)}</div>`).join('');
  return `<div class="tile walletrow">${walletPills()}<button class="btn sm alt" data-act="modal" data-m="wallet">Trocar</button></div>
    ${timer}${rest}${packs}
    <div class="tile"><div class="eyebrow">${ic('cal')} Seus próximos dias</div><div class="nds">${nextDays}</div>
      <p class="muted small" style="margin:10px 0 0">Pacote só com a janela de transferências fechada: um por dia do jogo (no Turbo, a cada 6 horas reais). Não acumula: se passar sem abrir, perde. Cada treinador recebe jogadores diferentes. A categoria gira: ${myOuro() ? 'Ouro Especial' : 'Diamante'}, Ouro, Prata e Bronze. Cada um começa a temporada pela categoria do seu objetivo: rebaixamento pelo ${myOuro() ? 'Ouro Especial' : 'Diamante'}, meio de tabela pelo Ouro, Sul-Americana pela Prata e G5 pelo Bronze.</p></div>
    <div class="tile"><div class="eyebrow">Preço em estrelas</div><div class="costs">${costs}</div><p class="muted small" style="margin:8px 0 0">Cobre é só da base. O salário do contratado sai do caixa. Pacotes só trazem jogadores de clubes sem técnico na liga (exterior e livres). ${myOuro() ? 'Ouro Especial só aparece pra quem tem Ouro na carteira: jogadores de 81 a 84 por 3 meses, com 90% do salário pago pelo clube de origem. Na Série B e na C não tem Diamante.' : 'Diamante só aparece pra quem tem diamante na carteira: veterano consagrado (35+) por 3 meses, com 90% do salário pago pelo clube de origem.'} Ouro é empréstimo de 6 meses. Prata e Bronze são contratações definitivas.</p></div>`;
}
// contador: quanto falta pro pacote de hoje expirar e pro próximo chegar
function packNext(S0) {
  const d = S.lastDay ?? SE.dayAbs(S, SE.now(S));
  for (let k = 1; k <= 60; k++) { const c = MK.packCat(S, d + k, S.club); if (c) return { t: SE.sportDayStart(S, d + k), cat: c }; }
  return null;
}
function packTimerHTML() {
  const d = S.lastDay ?? SE.dayAbs(S, SE.now(S)), open = S.packs && S.packs.day === d && (S.packs.list || []).some(p => p.taken == null);
  const nx = packNext(), end = SE.sportDayStart(S, d + 1);
  const a = open ? `<div><span class="eyebrow" style="margin:0">${ic('clock')} Pacote de hoje expira em</span><b class="num cdown" data-t="${end}"></b></div>` : '';
  const b2 = nx ? `<div><span class="eyebrow" style="margin:0">${ic('box')} Próximo pacote${nx.cat ? ` · ${CAT_NAME[nx.cat]}` : ''}</span><b class="num cdown" data-t="${nx.t}"></b></div>` : `<div><span class="eyebrow" style="margin:0">${ic('box')} Próximo pacote</span><b>só na próxima temporada</b></div>`;
  return `<div class="tile pktimer">${a}${b2}</div>`;
}
function searchView(free) {
  const m = UI.mk; m._free = !!free;
  const scopes = [['A', 'Série A'], ['B', 'Série B'], ...(S.divC && S.divC.length ? [['C', 'Série C']] : []), ['W', 'Exterior']].map(([k, l]) => `<button class="chip ${m.scope === k ? 'on' : ''}" data-act="mkscope" data-k="${k}">${l}</button>`).join('');
  const setores = [['ALL', 'Todos'], ['GOL', 'GOL'], ['DEF', 'DEF'], ['MEI', 'MEI'], ['ATA', 'ATA']].map(([k, l]) => `<button class="chip ${m.setor === k ? 'on' : ''}" data-act="mkset" data-k="${k}">${l}</button>`).join('');
  const quick = QUICK.filter(q => !(free && q[0] === 'fimct')).map(([k, l]) => `<button class="chip qk ${m.quick === k ? 'on' : ''}" data-act="mkquick" data-k="${k}">${l}</button>`).join('');
  const act = mkActive(), n = act.length;
  const sorts = [['ovr', 'Maior overall'], ['cheap', 'Menor valor'], ['young', 'Mais jovem'], ['int', 'Mais interessado']];
  return `<div class="mkbar"><input type="text" id="mk-q" placeholder="${free ? 'Buscar jogador livre' : 'Buscar jogador ou clube'}" value="${esc(m.q)}" autocomplete="off"><button class="mkfbtn ${n ? 'on' : ''}" data-act="mkfilt">${ic('filter')} Filtros${n ? ` · ${n}` : ''}</button></div>
    <div class="chips hs">${quick}</div>
    ${(() => { const so = `<select id="mk-sort" class="mksort">${sorts.map(([k, l]) => `<option value="${k}" ${m.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
      UI.mk._so = so; return free ? `<div class="chips hs">${setores}</div>` : `<div class="chips hs">${scopes}</div><div class="chips hs">${setores}</div>`; })()}
    ${n ? `<div class="chips mkact">${act.map(([k, l]) => `<button class="achip" data-act="mkclr" data-k="${k}">${esc(l)} <b>×</b></button>`).join('')}${n > 1 ? `<button class="achip clr" data-act="mkclr" data-k="all">Limpar tudo</button>` : ''}</div>` : ''}
    <div class="row between mkcrow"><div class="eyebrow" id="mk-count" style="margin:0"></div>${m._so}</div><div class="tile" style="padding:4px 12px"><div id="mk-list" class="list"></div></div>`;
}
function marketItems() {
  const m = UI.mk; try { m._b = MK.budget(S); } catch (e) { m._b = null; }
  const q = m.q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const items = [];
  for (const k in P) {
    const id = +k, p = P[id]; if (p.youth) continue;
    const o = own(id), st = m._free ? 'livre' : (m.stat || '');
    if (!o || o === S.club || o === 'Aposentado') continue;
    if (o === 'Livre' && st !== 'livre' && st !== 'watch') continue;
    if (st === 'livre' && o !== 'Livre') continue;
    if (st === 'watch' && !(S.watch || []).includes(id)) continue;
    if (st === 'list' || st === 'loan' || st === 'exp') { const s0 = S.ps[id]; if (st === 'list' && !(s0 && s0.list)) continue; if (st === 'loan' && !(s0 && s0.loanList)) continue; if (st === 'exp' && vw(id).ce > S.season) continue; }
    if (st === 'pre' && !MK.preEligible(S, id)) continue;
    const inA = S.divA.includes(o), inB = S.divB.includes(o), inC = !!(S.divC && S.divC.includes(o));
    if (!['livre', 'watch'].includes(st)) { if (m.scope === 'A' && !inA) continue; if (m.scope === 'B' && !inB) continue; if (m.scope === 'C' && !inC) continue; if (m.scope === 'W' && (inA || inB || inC)) continue; }
    if (m.setor !== 'ALL' && p.setor !== m.setor) continue;
    if (!passFilters(id)) continue;
    if (q) { const hay = (p.name + ' ' + o).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); if (!hay.includes(q)) continue; }
    items.push(id);
  }
  const sorts = { ovr: (a, b) => vw(b).ovr - vw(a).ovr, cheap: (a, b) => vw(a).mv - vw(b).mv, young: (a, b) => ageOf(a) - ageOf(b) || vw(b).ovr - vw(a).ovr };
  if (m.sort === 'int') { const sc = {}; items.forEach(id => sc[id] = MK.interest(S, id, S.club)); items.sort((a, b) => sc[b] - sc[a] || vw(b).ovr - vw(a).ovr); }
  else items.sort(sorts[m.sort]);
  return items;
}
function renderMarketList() {
  const box = $('#mk-list'); if (!box) return;
  const items = marketItems();
  $('#mk-count').textContent = `${fmt(items.length)} jogadores`;
  box.innerHTML = items.slice(0, UI.mk.n).map(id => marketRow(id)).join('') +
    (items.length > UI.mk.n ? `<button class="btn sm alt" style="margin:10px 0" data-act="more">Ver mais</button>` : '') || '<p class="muted">Nenhum jogador encontrado.</p>';
}
function marketRow(id) {
  const sc = MK.interest(S, id, S.club), lbl = MK.interestLabel(sc);
  const col = sc >= 65 ? 'var(--green)' : sc >= 45 ? 'var(--yellow)' : sc >= 25 ? 'var(--orange)' : 'var(--coral)';
  return playerRow(id, { meta: id2 => `${P[id2].pos} · ${esc(own(id2))}${!!Wd.divOf(S, own(id2)) ? '' : ' · ' + esc(Wd.clubLiga(own(id2)) || P[id2].liga)} · ${ageOf(id2)} anos${(S.ps[id2] || {}).loanList ? ' · <b style="color:var(--mint)">emprestável</b>' : ''} · <span style="color:${col}">interesse ${lbl.toLowerCase()}</span>`,
    right: id2 => `<span class="p num">T$ ${fmtK(vw(id2).mv)}<small>valor</small></span><span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span>` });
}
function listView(ids, intro, empty) {
  return `<p class="muted small" style="margin:0">${intro}</p><div class="tile" style="padding:4px 12px">${ids.length ? `<div class="list">${ids.slice(0, 80).map(marketRow).join('')}</div>` : `<p class="muted">${empty}</p>`}</div>`;
}
function preView() {
  if (S.slot < SE.PRE_FROM) return `<div class="tile"><div class="eyebrow">Pré-contratos</div><p style="margin:0">Abre na metade da temporada (jogo ${SE.PRE_FROM} de ${SE.SLOTS}). A partir daí, quem tem contrato acabando em ${S.season} pode assinar de graça com outro clube pra chegar no fim da temporada. Cuidado com os seus: renove antes.</p></div>`;
  const ids = [];
  for (const k in P) { const id = +k; if (!P[id].youth && MK.preEligible(S, id) && (!!Wd.divOf(S, own(id)) || vw(id).ovr >= 70)) ids.push(id); }
  ids.sort((a, b) => vw(b).ovr - vw(a).ovr);
  const mine = S.pre.filter(x => x.club === S.club && P[x.id]);   // v229: jogador fora da base atual não derruba a tela
  return `${mine.length ? `<div class="tile lime"><div class="eyebrow">Seus pré-contratos</div>${mine.map(x => `<div>${plink(x.id, P[x.id].name)} · chega no fim da temporada</div>`).join('')}</div>` : ''}
    ${listView(ids, `Contratos terminando em ${S.season}. Sem taxa: só salário. O jogador chega na virada da temporada.`, 'Ninguém disponível.')}`;
}
function scoutView() {
  const m = UI.mk;
  const regions = [['BR', 'Brasil'], ['SA', 'América do Sul'], ['EU', 'Europa e mundo']].map(([k, l]) => `<button class="chip ${m.region === k ? 'on' : ''}" data-act="region" data-k="${k}">${l}</button>`).join('');
  const ids = [];
  for (const k in P) {
    const id = +k, p = P[id]; if (p.youth || p.gen) continue;
    const o = own(id); if (!o || o === S.club || o === 'Aposentado') continue;
    if (ageOf(id) > 21) continue;
    const br = !!Wd.divOf(S, o);
    const sa = ['Liga Argentina', 'Liga Colombiana'].includes(Wd.clubLiga(o) || p.liga);
    if (m.region === 'BR' && !br) continue; if (m.region === 'SA' && (!sa || br)) continue; if (m.region === 'EU' && (br || sa)) continue;
    ids.push(id);
  }
  ids.sort((a, b) => potStars(b).hi - potStars(a).hi);
  const rows = ids.slice(0, 40).map(id => playerRow(id, { meta: id2 => `${ageOf(id2)} anos · ${esc(own(id2))} · potencial <b style="color:var(--yellow)">${potStars(id2).txt}</b>`,
    right: id2 => `<span class="p num">T$ ${fmtK(vw(id2).mv)}<small>valor</small></span><span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span>` })).join('');
  return `<div class="chips">${regions}</div><p class="muted small" style="margin:0">Jovens de até 21 anos da base de dados real do Transfermarkt. O potencial é a estimativa do seu olheiro (pode errar uns pontos).</p>
    <div class="tile" style="padding:4px 12px"><div class="list">${rows || '<p class="muted">Nada encontrado.</p>'}</div></div>`;
}
function offersView() {
  const negs = Object.keys(S.negs).filter(id => P[id] && MK.negState(S, +id) && (S.negs[id].fee || S.negs[id].counter || S.negs[id].closedUntil > (S.lastDay ?? 0))).map(id => { const n = S.negs[id], u = MK.negUntil(n); return `<div class="prow" style="grid-template-columns:40px 1fr auto">${av(+id)}<span><span class="n">${plink(+id, P[id].name)}</span><span class="m">${n.fee ? `Taxa acertada: T$ ${fmt(n.fee)} · falta o contrato${u != null ? ` · vale até o dia ${u}` : ''}` : n.counter ? `Contraproposta do clube: T$ ${fmt(n.counter)}` : `Negociação encerrada · volta a conversar no dia ${n.closedUntil}`}</span></span>${n.fee || n.counter ? `<button class="btn sm alt" data-act="negdrop" data-id="${id}">Retirar</button>` : ''}</div>`; }).join('');   // v242: Retirar + validade
  const outs = (S.outOffers || []).map(o => `<div class="offer">${av(o.id)}<div class="grow"><div class="row between"><b>${crest(o.owner, 'sm')} ${esc(o.owner)} ${coachTag(o.owner)}</b></div>
      <div>${plink(o.id)} · você ofereceu T$ ${fmt(o.fee)} · <b class="num">pedem T$ ${fmt(o.counter)}</b></div></div>
      <div class="acts"><button class="btn sm ok" data-act="ctrok" data-k="${o.k}">${SE.windowOpen(SE.now(S), S) ? `Pagar T$ ${fmtK(o.counter)}` : `Fechar acordo · T$ ${fmtK(o.counter)}`}</button><button class="btn sm" data-act="ctrno" data-k="${o.k}">Recusar</button></div></div>`).join('');
  const pend = [
    ...MK.pendingFor(S, S.club).map(x => `<div class="prow" style="grid-template-columns:40px 1fr auto">${av(x.id)}<span><span class="n">${plink(x.id, P[x.id].name)}</span><span class="m">Acordo fechado · chega ${x.at ? when(x.at) : 'na próxima janela'}${x.swap != null ? ` · ${P[x.swap].short} vai ao ${esc(x.from)} na troca` : ''}</span></span><span class="small">T$ ${fmtK(x.fee)}</span></div>`),
    ...(S.pendTr || []).filter(x => x.human && x.from === S.club).map(x => `<div class="prow" style="grid-template-columns:40px 1fr auto">${av(x.id)}<span><span class="n">${plink(x.id, P[x.id].name)}</span><span class="m">Venda acordada ao ${esc(x.club)} · sai ${x.at ? when(x.at) : 'na próxima janela'}${x.swap != null ? ` · ${P[x.swap].short} chega na troca` : ''}</span></span><span class="small">T$ ${fmtK(x.fee)} a receber</span></div>`)
  ].join('');
  // v160: propostas que VOCÊ enviou a outros técnicos da liga e ainda estão sem resposta (ficam na mesa do vendedor)
  const me = S.club, sentL = [];
  for (const o of Wd.humanClubs(S)) { if (!o || o === me) continue; let L = []; try { L = Wd.asClub(S, o, () => (S.offers || []).filter(x => x.club === me && x.human)) || []; } catch (e) {} for (const x of L) sentL.push({ ...x, owner: o }); }
  const sent = sentL.filter(x => P[x.id]).map(x => `<div class="offer">${av(x.id)}<div class="grow"><div class="row between"><b>${crest(x.owner, 'sm')} ${esc(x.owner)} ${coachTag(x.owner)}</b></div>
      <div>${plink(x.id)} · ${x.loanOf ? 'empréstimo' : x.fee ? `você ofereceu T$ ${fmt(x.fee)}` : 'proposta'}${x.swap != null && P[x.swap] ? ` + ${esc(P[x.swap].short)} na troca` : ''} · <span class="muted">aguardando o técnico</span></div></div>
      <div class="acts"><button class="btn sm" data-act="offwithdraw" data-id="${x.id}" data-o="${esc(x.owner)}" data-k="${esc(String(x.k ?? ''))}">Retirar</button></div></div>`).join('');
  const sentTile = sent ? `<div class="tile"><div class="eyebrow">${ic('clock')} Propostas enviadas · aguardando resposta</div><div class="stack" style="gap:8px">${sent}</div></div>` : '';
  return `${sentTile}${pend ? `<div class="tile lime"><div class="eyebrow">${ic('handshake')} Acordos fechados</div><div class="list">${pend}</div></div>` : ''}${outs ? `<div class="tile yellow"><div class="eyebrow">${ic('handshake')} Contrapropostas de outros técnicos</div><div class="stack" style="gap:8px">${outs}</div></div>` : ''}${S.offers.length ? `<div class="tile pink"><div class="stack" style="gap:8px">${S.offers.map(offerHTML).join('')}</div></div>` : '<div class="tile"><p class="muted" style="margin:0">Nenhuma proposta pelo seu elenco agora. Elas expiram em 2 dias.</p></div>'}
    ${negs ? `<h2 class="disp" style="font-size:24px">Suas negociações</h2><div class="tile" style="padding:4px 12px"><div class="list">${negs}</div></div>` : ''}`;
}

// ===== UI parte 3: torneios, notícias, modais, jogo ao vivo, ações e boot =====
function vComps() {
  const cs = UI.cseason && S.archive && S.archive[UI.cseason] ? UI.cseason : null;
  if (!cs) UI.cseason = null;
  const showAw = cs || (S.post && awardsShown(S.post.season));
  const hasC = cs ? !!(S.archive[cs].divC && S.archive[cs].divC.length && S.archive[cs].comp.C) : !!(S.comp && S.comp.C && S.divC && S.divC.length);
  const items = cs ? [['A', 'Série A'], ['B', 'Série B'], ...(hasC ? [['L3', 'Série C']] : []), ['CB', 'Copa do Brasil'], ['C', 'Continental'], ['R', 'Regionais'], ['aw', 'Prêmios']]
    : [['A', 'Série A'], ['B', 'Série B'], ...(hasC ? [['L3', 'Série C']] : []), ...(S.post ? [] : [['bets', 'Palpites']]), ['CB', 'Copa do Brasil'], ['C', 'Continental'], ['R', 'Regionais'], ...(showAw ? [['aw', 'Prêmios']] : []), ['cal', 'Agenda'], ['hist', 'Histórico']];
  let sub = subOf('comps', 'A'); if (!items.some(x => x[0] === sub)) sub = 'A';
  const seg = segHTML('comps', items);
  const draw = () => {
  let body = '';
  if (sub === 'aw') body = awardsTile(cs || S.post.season);
  else if (sub === 'A' || sub === 'B') body = leagueView(sub);
  else if (sub === 'L3') body = leagueView('C');
  else if (sub === 'CB') body = cupView();
  else if (sub === 'C') body = contView();
  else if (sub === 'R') body = contView(true);
  else if (sub === 'cal') body = calView();
  else if (sub === 'bets') body = betsView();
  else body = histView();
  return body; };
  const body = cs ? withArchive(cs, draw) : draw();
  const banner = cs ? `<div class="archb">${ic('cal')} Temporada ${cs} encerrada · consulta do arquivo</div>` : S.post ? `<div class="archb live">${ic('trophy')} Temporada ${S.post.season} encerrada · tabelas finais</div>` : '';
  return `${topbar()}<div class="stack">${seasonChips()}${banner}${seg}${body}</div>`;
}
function tableHTML(rows, zone, mark) {
  return `<div class="tblx"><table class="tbl num"><thead><tr><th>#</th><th>Clube</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th><th class="tfh">Últ. 5</th></tr></thead><tbody>
    ${rows.map((r, i) => `<tr class="${r.c === S.club ? 'me' : ''}"><td class="${zone ? zone(i) : ''}">${i + 1}</td><td><div class="clw"><button class="cl" data-act="club" data-club="${esc(r.c)}">${crest(r.c, 'sm')}${esc(r.c)}${coachTag(r.c)}</button>${mark ? mark(r.c) : ''}</div></td><td>${r.pts}</td><td>${r.j}</td><td>${r.v}</td><td>${r.e}</td><td>${r.d}</td><td>${r.gp ?? 0}</td><td>${r.gc ?? 0}</td><td>${r.sg > 0 ? '+' : ''}${r.sg}</td><td class="tform">${(r.form || []).slice(-5).map((x, j, a) => `<i class="${x}${j === a.length - 1 ? ' last' : ''}" title="${{ V: 'Vitória', E: 'Empate', D: 'Derrota' }[x] || ''}">${x}</i>`).join('')}</td></tr>`).join('')}</tbody></table></div>`;   // v178: forma dos últimos 5 jogos
}
function leagueView(div) {
  const rows = SE.standings(S.comp[div].table);
  const nC = rows.length, withC = !!(S.divC && S.divC.length) || div === 'C';
  // v209: zonas pelo plano de vagas (campeões de copa já definidos entram; quem já estava classificado repassa a vaga)
  let Q = null;
  if (!UI.archView) try { Q = S.post && S.post.season === S.season && S.post.qual ? { ...S.post.qual, why: S.post.qualWhy || {} } : SE.qualPlan(S, SE.standings(S.comp.A.table), S.comp.B ? SE.standings(S.comp.B.table) : []); } catch (e) { Q = null; }
  const zOf = {}; if (Q) for (const [k, z] of [['LIB', 'z1'], ['PL', 'z2'], ['SUL', 'z3'], ['CONF', 'z4']]) for (const c of Q[k] || []) zOf[c] = z;
  const zone = div === 'A' ? (Q ? i => i >= 16 ? 'z5' : zOf[rows[i].c] || '' : i => i < 4 ? 'z1' : i < 6 ? 'z2' : i < 11 ? 'z3' : i < 16 ? 'z4' : 'z5') : i => i < 4 ? 'zup' : (withC && i >= nC - 4) ? 'z5' : '';
  const QN = { LIB: 'Libertadores', PL: 'Pré-Libertadores', SUL: 'Sul-Americana', CONF: 'Conferência' };
  const qOf = c => Q && ['LIB', 'PL', 'SUL', 'CONF'].find(k => (Q[k] || []).includes(c));
  const mark = Q ? c => { const w = Q.why[c]; if (!w || w === 'pos') return ''; const k = qOf(c), tit = SE.QUAL_WHY[w] ? `${QN[k]}: ${SE.QUAL_WHY[w]}` : w === 'dPL' ? 'Pré-Libertadores: estava no G4, mas a vaga direta ficou com um campeão de copa' : /^h/.test(w) ? `${QN[k]}: herdou a vaga de ${SE.QUAL_WHY[w.slice(1)]} (o ${w === 'hCBv' ? 'vice' : 'campeão'} já estava classificado)` : `${QN[k]}: vaga que sobrou pra Série B`;
    return `<span class="qmark ${SE.QUAL_WHY[w] ? 'tit' : ''}" data-act="qmark" data-t="${esc(tit)}" title="${esc(tit)}">${SE.QUAL_WHY[w] ? '★' : w === 'dPL' ? '↓' : '+'}</span>`; } : null;
  const anyMark = Q && Object.values(Q.why).some(w => w !== 'pos');
  const legend = div === 'A' ? `<div class="legend"><span><i style="background:var(--mint)"></i>Libertadores</span><span><i style="background:var(--blue)"></i>Pré-Libertadores</span><span><i style="background:var(--yellow)"></i>Sul-Americana</span><span><i style="background:var(--pink)"></i>Conferência</span><span><i style="background:var(--coral)"></i>Rebaixamento</span></div>${anyMark ? `<p class="small muted" style="margin:6px 2px 0"><b class="qmark tit">★</b> vaga por título (campeão da Copa do Brasil, Libertadores ou Sul-Americana, vice da Copa do Brasil) · ${Object.values(Q.why).includes('dPL') ? '<b class="qmark">↓</b> estava no G4, mas a vaga direta ficou com um campeão de copa e ele vai pra Pré-Libertadores · ' : ''}${Object.values(Q.why).some(w => /^h/.test(w)) ? '<b class="qmark">+</b> herdou a vaga de um campeão que já estava classificado · ' : ''}Vagas do Brasil: 4 na Libertadores, 4 na Pré (mata-mata entre brasileiros), 4 na Sul-Americana e 4 na Conferência. Série B só entra por título.</p>` : ''}`
    : div === 'B' ? `<div class="legend"><span><i style="background:var(--green)"></i>Acesso à Série A</span>${withC ? '<span><i style="background:var(--coral)"></i>Queda pra Série C</span>' : ''}</div>`
    : `<div class="legend"><span><i style="background:var(--green)"></i>Acesso à Série B</span><span><i style="background:var(--coral)"></i>Queda pra Série D</span></div><p class="small muted" style="margin:6px 2px 0">Da Série D sobe o melhor clube da D em cada copa regional: Nordeste, Sul-Sudeste, Norte e Centro-Oeste (Copa Verde).</p>`;
  // artilharia
  // v187: dos jogos disputados — vendido continua na lista, com o clube que defendia no campeonato
  const LD = SE.leagueLeaders(S, div);
  const rank = (key) => LD[key].map(([id, c, n], i) => `<div class="rk"><span class="muted num">${i + 1}</span><button class="rkc" data-act="club" data-club="${esc(c)}" aria-label="${esc(c)}">${crest(c, 'sm')}</button><span class="rkn">${plink(id, P[id].name)}${own(id) !== c ? ` <span class="small muted">→ ${esc(own(id))}</span>` : ''}</span><b class="num">${n}</b></div>`).join('');
  const scor = UI.archView ? '' : rank('g'), asst = UI.archView ? '' : rank('a');
  const rounds = roundsTile(div);
  return `<div class="tile cmp cmp-${div}" style="padding:8px 10px">${tableHTML(rows, zone, mark)}${legend}</div>
    ${scor ? `<div class="tile"><div class="eyebrow">${ic('ball')} Artilharia</div>${scor}</div>` : ''}
    ${asst ? `<div class="tile"><div class="eyebrow">${ic('arrowR')} Assistências</div>${asst}</div>` : ''}${UI.archView ? archTop(div) : ''}
    ${rounds}`;
}
// rodada completa da liga, com navegação anterior / atual / próxima
function roundsTile(div) {
  const slots = SE.CAL.map((c, k) => ({ c, k })).filter(x => x.c.type === 'L');
  if (!slots.length) return '';
  const nextIdx = slots.findIndex(x => x.k >= S.slot), cur = nextIdx < 0 ? slots.length - 1 : nextIdx;
  UI.rd = UI.rd || {};
  if (UI.rd[div] == null || UI.rd[div] >= slots.length) UI.rd[div] = cur;
  const i = UI.rd[div], { k, c } = slots[i];
  const fx = SE.fixturesOf(S, k).filter(f => f.comp === div), played = S.played[k] || [];
  const quick = div === 'C' && S.comp.C && S.comp.C.q && S.comp.C.q[k];   // rodadas simuladas na chegada da Série C
  const rows = quick ? quick.map(([h, a, gh, ga]) => `<div class="res"><span class="h">${esc(h)} ${crest(h, 'sm')}</span><span class="sc num">${gh}–${ga}</span><span class="a">${crest(a, 'sm')} ${esc(a)}</span></div>`).join('') + '<p class="small muted" style="margin:6px 0 0">Rodada simulada na chegada da Série C (sem lances).</p>'
    : fx.map(f => { const m = played.find(x => x.h === f.h && x.a === f.a); return m ? resHTML(m) : fixtureRow(f, k); }).join('');
  const lbl = i === cur && k >= S.slot ? 'Próxima rodada' : k < S.slot ? 'Rodada jogada' : 'Rodada futura';
  return `<div class="tile"><div class="rdnav"><button data-act="rdnav" data-div="${div}" data-d="-1" ${i <= 0 ? 'disabled' : ''} aria-label="Rodada anterior">‹</button>
    <div><b>Rodada ${c.md}</b><span class="small muted">${lbl} · ${SE.gameDate(S, k).txt} · ${when(SE.slotTime(S, k))}</span></div>
    <button data-act="rdnav" data-div="${div}" data-d="1" ${i >= slots.length - 1 ? 'disabled' : ''} aria-label="Próxima rodada">›</button></div>
    ${i !== cur ? `<button class="link small" data-act="rdnav" data-div="${div}" data-d="0">voltar pra rodada atual</button>` : ''}${rows || '<p class="muted small">Sem jogos.</p>'}
    ${NET.online && NET.isAdmin() && !UI.archView && k === S.slot - 1 && played.length ? (UI.annul === k ? `<div class="note bad" style="margin-top:10px">Anular a rodada ${c.md}? A tabela volta ao que era antes e os jogos certos são disputados em seguida.<div class="row" style="gap:8px;margin-top:8px"><button class="btn sm coral" data-act="annulok" data-k="${k}">Anular e refazer</button><button class="btn sm alt" data-act="annul" data-k="">Cancelar</button></div></div>` : `<button class="btn sm alt" style="margin-top:10px" data-act="annul" data-k="${k}">${ic('lock')} ADM: anular e refazer esta rodada</button>`) : ''}</div>`;
}
function fixtureRow(f, k) {
  const st = SE.stadium ? SE.stadium(S, f.h) : null;
  return `<div class="res fx2 ${f.h === S.club || f.a === S.club ? 'me' : ''}"><span class="h">${coachTag(f.h)}${esc(f.h)} ${crest(f.h, 'sm')}</span><span class="sc">×</span><span class="a">${crest(f.a, 'sm')} ${esc(f.a)}${coachTag(f.a)}</span>${st ? `<span class="fxst">${ic('stadium')} ${esc(st.name)} · ${when(SE.slotTime(S, k))}</span>` : ''}</div>`;
}
const resHTML = m => UI.archView ? `<div class="res ${m.h === S.club || m.a === S.club ? 'me' : ''}"><span class="h">${esc(m.h)} ${crest(m.h, 'sm')}</span><span class="sc num">${m.gh}–${m.ga}${m.pens ? `<br><small>${m.pens[0]}–${m.pens[1]} pên</small>` : ''}</span><span class="a">${crest(m.a, 'sm')} ${esc(m.a)}</span></div>` : `<button class="res link ${m.h === S.club || m.a === S.club ? 'me' : ''}" data-act="match" data-k="${kOfMatch(m)}" data-h="${esc(m.h)}" data-a="${esc(m.a)}"><span class="h">${coachTag(m.h)}${esc(m.h)} ${crest(m.h, 'sm')}</span><span class="sc num">${m.gh}–${m.ga}${m.pens ? `<br><small>${m.pens[0]}–${m.pens[1]} pên</small>` : ''}</span><span class="a">${crest(m.a, 'sm')} ${esc(m.a)}${coachTag(m.a)}</span></button>`;
// v155: artilharia e assistências de cada copa (S.cupSc[comp][id] = [gols, assistências])
function cupScorers(comp) {   // v161: calcula a partir de todos os jogos já disputados da copa nesta temporada (inclui os de antes da v155)
  const T = {};
  for (const k in (S.played || {})) for (const m of S.played[k] || []) {
    if (m.comp !== comp || !m.g) continue;
    for (const e of m.g) { if (e[3] === -2) continue; const sc = e[2], as = e[3], cl = e[1] === 0 ? m.h : m.a; if (sc != null && P[sc]) { (T[sc] = T[sc] || [0, 0])[0]++; T[sc].c = cl; } if (as != null && as >= 0 && P[as]) { (T[as] = T[as] || [0, 0])[1]++; T[as].c = cl; } }
  }
  const ids = Object.keys(T).map(Number);
  if (!ids.length) return '';
  const rank = i => ids.filter(id => T[id][i] > 0).sort((a, b) => T[b][i] - T[a][i] || T[b][1 - i] - T[a][1 - i]).slice(0, 10)
    .map((id, n) => { const c = T[id].c || own(id); return `<div class="rk"><span class="muted num">${n + 1}</span><button class="rkc" data-act="club" data-club="${esc(c)}" aria-label="${esc(c)}">${crest(c, 'sm')}</button><span class="rkn">${plink(id, P[id].name)}${own(id) !== c ? ` <span class="small muted">→ ${esc(own(id))}</span>` : ''}</span><b class="num">${T[id][i]}</b></div>`; }).join('');
  const g = rank(0), a = rank(1);
  return `${g ? `<div class="tile"><div class="eyebrow">${ic('ball')} Artilharia</div>${g}</div>` : ''}${a ? `<div class="tile"><div class="eyebrow">${ic('arrowR')} Assistências</div>${a}</div>` : ''}`;
}
function cupView() {
  const Cb = S.comp.CB;
  const kOf = md => +SE.CAL.find(c => c.type === 'CB' && c.md === md).k;
  const sub = (txt) => `<div class="small muted" style="margin:8px 2px 2px">${txt}</div>`;
  const rounds = Cb.rounds.map((rd, i) => {
    if (i === 4) {   // v268: final em ida e volta (a volta não aparecia e o campeão ficava escondido)
      const k1 = kOf(5), k2 = kOf(6), p1 = S.played[k1] || [], p2 = S.played[k2] || [];
      const rows = rd.map(([h, a]) => { const m1 = p1.find(x => x.h === h && x.a === a), m2 = p2.find(x => x.h === a && x.a === h);
        const agg = m1 && m2 ? `<p class="small" style="margin:6px 2px 0">Agregado: <b>${esc(h)} ${m1.gh + m2.ga} × ${m1.ga + m2.gh} ${esc(a)}</b>${m2.pens ? ` (pênaltis ${m2.pens[1]} × ${m2.pens[0]})` : ''}</p>` : '';
        return `${sub(`Ida · ${when(SE.slotTime(S, k1))}`)}${m1 ? resHTML(m1) : fixtureRow({ h, a }, k1)}${sub(`Volta · ${when(SE.slotTime(S, k2))}`)}${m2 ? resHTML(m2) : fixtureRow({ h: a, a: h }, k2)}${agg}`; }).join('');
      return `<div class="tile"><div class="eyebrow">Final · ida e volta</div>${rows}</div>`;
    }
    const k = kOf(i + 1), played = S.played[k];
    return `<div class="tile"><div class="eyebrow">${SE.CB_STAGES[i]} · ${when(SE.slotTime(S, k))}</div>${rd.map(([h, a]) => { const m = played && played.find(x => x.h === h && x.a === a); return m ? resHTML(m) : fixtureRow({ h, a }, k); }).join('')}</div>`;
  }).reverse().join('');
  const champ = Cb.champ ? `<div class="tile lime"><div class="eyebrow">Campeão${Cb.vice ? ` · vice: ${esc(Cb.vice)}` : ''}</div><div class="row">${crest(Cb.champ, 'lg')}<b class="disp" style="font-size:30px">${esc(Cb.champ)}</b></div></div>` : '';
  return `<div class="stack cmp cmp-CB"><div class="cmphead">${ic('trophy')} Copa do Brasil</div>${champ}<p class="muted small" style="margin:0">32 clubes (Série A + 12 da Série B), mata-mata em jogo único com pênaltis; a final é em ida e volta.</p>${rounds}${cupScorers('CB')}</div>`;
}
// v209: Copa Intercontinental (depois do apito final da temporada)
function intRow(h, a, g, when0) {
  const sc = g && g.win ? `${g.gh}–${g.ga}${g.pens ? `<br><small>${g.pens[0]}–${g.pens[1]} pên</small>` : ''}` : '×';
  const me = h === S.club || a === S.club;
  return `<div class="res ${me ? 'me' : ''}"><span class="h">${h ? `${coachTag(h)}${esc(h)} ${crest(h, 'sm')}` : '<span class="muted">a definir</span>'}</span><span class="sc num">${sc}</span><span class="a">${crest(a, 'sm')} ${esc(a)}</span></div>${when0 ? `<p class="small muted" style="margin:2px 4px 6px;text-align:center">${when0}</p>` : ''}`;
}
function intView() {
  const I = S.comp.INT; if (!I) return '';
  const G = (I.games || []).map((g, i) => { const nm = I.one ? 'Jogo único' : SE.INT_NAME[g.k], prev = i ? I.games[i - 1] : null, h = g.h || (prev && prev.win) || null;
    return `<div class="tile"><div class="eyebrow">${nm}${I.one ? ' · Libertadores × campeão europeu' : g.k === 'der' ? ' · Libertadores × CONCACAF' : g.k === 'chal' ? ' · contra o campeão África-Ásia-Pacífico' : ' · contra o campeão europeu'}</div>${intRow(h, g.a, g.win ? g : null, g.win ? '' : `${when(g.t)} · campo neutro`)}</div>`; }).join('');   // v268: em ordem cronológica
  const aap = ((I.aap && I.aap.res) || []).map(r => intRow(r[0], r[1], { win: 1, gh: r[2], ga: r[3] })).join('');
  return `${I.champ ? `<div class="tile lime"><div class="eyebrow">Campeão do mundo ${I.season}</div><div class="row">${crest(I.champ, 'lg')}<b class="disp" style="font-size:30px">${esc(I.champ)}</b></div></div>` : ''}${G}
    ${aap ? `<div class="tile"><div class="eyebrow">Copa África-Ásia-Pacífico (já jogada)</div>${aap}<p class="small muted" style="margin:6px 0 0">${esc(I.aap.win)} se classificou pra Copa Challenger.</p></div>` : ''}
    <p class="muted small" style="margin:0">${I.one ? `Jogo único em campo neutro, com pênaltis: o campeão da Libertadores (${esc(I.lib)}) contra o campeão europeu (${esc(I.uefa)}). Acontece no dia do encerramento, e a nova temporada só começa depois dele. Quem joga é o elenco e a tática atuais.` : `Formato da FIFA: o campeão da Libertadores (${esc(I.lib)}) faz o Dérbi das Américas contra o campeão da CONCACAF (${esc(I.con)}). Quem vencer pega o campeão África-Ásia-Pacífico na Copa Challenger, e o vencedor encara o campeão europeu (${esc(I.uefa)}) na final. Jogos únicos em campo neutro, com pênaltis.`}</p>`;
}
// v268: jogos da fase de grupos de uma copa, data por data (com dia e horário), como as rodadas da liga
function cupRoundsTile(key) {
  const Cp = S.comp[key]; if (!Cp || !Cp.groups) return '';
  const slots = SE.CAL.filter(c => c.type === 'C'); if (!slots.length) return '';
  const nx = slots.findIndex(c => c.k >= S.slot), cur = nx < 0 ? slots.length - 1 : nx;
  UI.crd = UI.crd || {}; if (UI.crd[key] == null || UI.crd[key] < 0 || UI.crd[key] >= slots.length) UI.crd[key] = cur;
  const i = UI.crd[key], c = slots[i], k = c.k;
  const fx = SE.fixturesOf(S, k).filter(f => f.comp === key), played = S.played[k] || [];
  const rows = fx.map(f => { const m = played.find(x => x.h === f.h && x.a === f.a); return m ? resHTML(m) : fixtureRow(f, k); }).join('');
  const lbl = k < S.slot ? 'Data jogada' : i === cur ? 'Próxima data' : 'Data futura';
  return `<div class="tile"><div class="rdnav"><button data-act="crdnav" data-key="${key}" data-d="-1" ${i <= 0 ? 'disabled' : ''} aria-label="Data anterior">‹</button>
    <div><b>Grupos · ${c.md}ª data</b><span class="small muted">${lbl} · ${SE.gameDate(S, k).txt} · ${when(SE.slotTime(S, k))}</span></div>
    <button data-act="crdnav" data-key="${key}" data-d="1" ${i >= slots.length - 1 ? 'disabled' : ''} aria-label="Próxima data">›</button></div>
    ${i !== cur ? `<button class="link small" data-act="crdnav" data-key="${key}" data-d="0">voltar pra data atual</button>` : ''}${rows || '<p class="muted small">Sem jogos.</p>'}</div>`;
}
function contView(reg) {
  const list = reg ? [['NE', 'Nordeste'], ['SSE', 'Sul-Sudeste'], ['VER', 'Copa Verde']] : [...(S.comp.INT ? [['INT', 'Intercontinental']] : []), ['LIB', 'Libertadores'], ['SUL', 'Sul-Americana'], ['CONF', 'Conferência'], ['PL', 'Pré-Libertadores']];
  if (!reg && UI.cont === 'INT' && !S.comp.INT) UI.cont = 'LIB';
  if (reg && !UI.rcup) UI.rcup = (SE.regCupOf && SE.regCupOf(S.club)) || 'NE';
  const key = reg ? UI.rcup : UI.cont;
  const chips = list.map(([k, l]) => `<button class="chip ${key === k ? 'on' : ''}" data-act="${reg ? 'rcup' : 'cont'}" data-k="${k}">${l}</button>`).join('');
  let body = '';
  if (reg && !S.comp[key]) body = `<div class="tile"><p class="muted" style="margin:0">Grupos sorteados junto com os das continentais, na 1ª data de copa. Jogam os clubes da região que não estão nas copas internacionais, completados por clubes regionais. Mesmo formato: 4 grupos de 4, turno e returno, quartas, semi e final.${key === 'VER' ? ' Na Copa Verde, os grupos A e B são do bloco Norte e C e D do Centro-Oeste (com ES e TO): a final é Norte x Centro-Oeste.' : ''}</p></div>`;
  else if (key === 'PL') body = `<div class="tile"><div class="eyebrow">Ida · ${when(SE.slotTime(S, SE.CAL.find(c => c.type === 'PL' && c.md === 1).k))} · Volta · ${when(SE.slotTime(S, SE.CAL.find(c => c.type === 'PL' && c.md === 2).k))}</div>${S.comp.PL.ties.map(t => `<div class="res"><span class="h">${esc(t.br)} ${crest(t.br, 'sm')}</span><span class="sc num">${t.l1 ? `${t.l1[1] + (t.l2 ? t.l2[0] : 0)}–${t.l1[0] + (t.l2 ? t.l2[1] : 0)}` : '×'}</span><span class="a">${crest(t.f, 'sm')} ${esc(t.f)}</span></div>`).join('')}
    <p class="muted small" style="margin:8px 0 0">Os 2 primeiros da Série A depois dos classificados direto, mais o vice da Copa do Brasil, em ida e volta. Quem passa vai pros grupos da Libertadores; quem cai vai pra Sul-Americana.</p></div>`;
  else if (key === 'INT') body = intView();
  else if (!S.comp[key]) body = `<div class="tile"><p class="muted" style="margin:0">Grupos sorteados depois da pré-Libertadores. Classificados do Brasil: ${(S.qual[key] || []).map(esc).join(', ')}.</p></div>`;
  else {
    const Cp = S.comp[key];
    const groups = Cp.groups.map((g, gi) => `<div class="tile" style="padding:8px 10px"><div class="eyebrow" style="margin:6px 4px">Grupo ${'ABCD'[gi]}</div>${tableHTML(SE.standings(Object.fromEntries(g.map(c => [c, Cp.gt[c]]))), i => i < 2 ? 'z1' : '')}</div>`).join('');
    const ko = Cp.ko.map((rd, i) => `<div class="tile"><div class="eyebrow">${SE.CK_STAGES[i]} · ${when(SE.slotTime(S, SE.CAL.find(c => c.type === 'CK' && c.md === i + 1).k))}</div>${rd.map(([h, a]) => { const k = SE.CAL.find(c => c.type === 'CK' && c.md === i + 1).k; const m = (S.played[k] || []).find(x => x.h === h && x.a === a); return m ? resHTML(m) : `<div class="res"><span class="h">${coachTag(h)}${esc(h)} ${crest(h, 'sm')}</span><span class="sc">×</span><span class="a">${crest(a, 'sm')} ${esc(a)}${coachTag(a)}</span></div>`; }).join('')}</div>`).reverse().join('');
    body = `${Cp.champ ? `<div class="tile lime"><div class="eyebrow">Campeão</div><div class="row">${crest(Cp.champ, 'lg')}<b class="disp" style="font-size:30px">${esc(Cp.champ)}</b></div></div>` : ''}${ko}${cupRoundsTile(key)}${groups}`;
  }
  const nm = { INT: 'Copa Intercontinental da FIFA', LIB: 'Libertadores', SUL: 'Sul-Americana', CONF: 'Conferência', PL: 'Pré-Libertadores', NE: 'Copa do Nordeste', SSE: 'Copa Sul-Sudeste', VER: 'Copa Verde' }[key];
  return `<div class="chips">${chips}</div><div class="stack cmp cmp-${key}"><div class="cmphead">${ic('trophy')} ${nm}</div>${body}${cupScorers(key)}</div>`;
}
function nextBetSlot() {
  const div = (Wd.divOf(S, S.club) || 'B');
  for (let k = S.slot; k < SE.SLOTS; k++) if (SE.CAL[k].type === 'L') return { k, div, games: SE.fixturesOf(S, k).filter(f => f.comp === div).map(f => [f.h, f.a]) };
  return null;
}
// ranking dos palpites: todos os treinadores, por acertos
function betsRank(all) {
  const rows = Object.entries(S.desks || {}).map(([t, d]) => {
    let ok = 0, n = 0, r = 0, best = 0;
    for (const [key, b] of Object.entries(d.bets || {})) { if (!b || !b.done) continue; if (!all && !key.startsWith(S.season + '-')) continue; ok += b.ok || 0; n += b.n || 0; r++; best = Math.max(best, b.ok || 0); }
    return { t, name: d.manager || 'Treineiro', club: d.club, ok, n, r, best, pct: n ? ok / n : 0 };
  }).filter(x => x.r > 0).sort((a, b) => b.ok - a.ok || b.pct - a.pct || b.best - a.best);
  if (!rows.length) return `<div class="tile"><p class="muted" style="margin:0">Ninguém tem rodada de palpites encerrada ${all ? 'ainda' : 'nesta temporada'}.</p></div>`;
  const list = rows.map((x, i) => `<div class="res" style="grid-template-columns:28px 1fr auto;gap:8px;align-items:center${x.t === S.__me ? ';background:color-mix(in srgb,var(--lime) 10%,transparent);border-radius:10px' : ''}"><b class="num" style="color:${i === 0 ? 'var(--yellow)' : 'var(--muted)'}">${i + 1}º</b><span style="display:flex;gap:8px;align-items:center;min-width:0">${x.club ? crest(x.club, 'sm') : ''}<span style="min-width:0"><b>${esc(x.name)}</b><small class="muted" style="display:block">${x.r} rodada${x.r > 1 ? 's' : ''} · ${Math.round(x.pct * 100)}% · melhor: ${x.best}</small></span></span><b class="num" style="font-size:18px">${x.ok}<small class="muted" style="font-size:11px"> /${x.n}</small></b></div>`).join('');
  return `<div class="tile"><div class="eyebrow">${ic('trophy')} Ranking de palpites · ${all ? 'geral' : 'temporada ' + S.season}</div>${list}<p class="small muted" style="margin:8px 0 0">Ordem: total de acertos; empate vai para a maior % de acerto.</p></div>`;
}
function betsView() {
  const bv = UI.betsV || 'pal';
  const seg = `<div class="seg" style="margin:0 0 10px"><button class="${bv === 'pal' ? 'on' : ''}" data-act="betsv" data-v="pal">Palpitar</button><button class="${bv === 'rk' ? 'on' : ''}" data-act="betsv" data-v="rk">Ranking</button><button class="${bv === 'rkg' ? 'on' : ''}" data-act="betsv" data-v="rkg">Ranking geral</button></div>`;
  if (bv !== 'pal') return seg + betsRank(bv === 'rkg');
  return seg + betsViewPal();
}
function betsViewPal() {
  const nb = nextBetSlot();
  const past = Object.entries(S.bets || {}).filter(([, b]) => b.done).slice(-3).reverse();
  const hist = past.map(([key, b]) => `<div class="res" style="grid-template-columns:1fr auto"><span>Rodada ${b.md}</span><b style="color:${b.ok >= 5 ? 'var(--lime)' : 'var(--muted)'}">${b.ok}/${b.n} ${b.ok >= 10 ? gemIc() : b.ok >= 5 ? ic('star') : ''}</b></div>`).join('');
  if (!nb) return `<div class="tile"><p class="muted" style="margin:0">Sem rodadas de liga pela frente nesta temporada.</p></div>${hist ? `<div class="tile">${hist}</div>` : ''}`;
  const key = `${S.season}-${nb.k}`;
  const b = S.bets[key] || { games: nb.games, picks: {}, md: SE.CAL[nb.k].md };
  const n = Object.keys(b.picks).length;
  const rows = nb.games.map(([h, a], i) => {
    const pk = b.picks[i];
    const btn = (v, lbl) => `<button class="${pk === v ? 'on' : ''}" data-act="bet" data-i="${i}" data-v="${v}"><b>${lbl}</b></button>`;
    return `<div class="betrow"><span class="bt h">${esc(h)} ${crest(h, 'sm')}</span><div class="bx">${btn('h', '1')}${btn('d', 'X')}${btn('a', '2')}</div><span class="bt">${crest(a, 'sm')} ${esc(a)}</span></div>`;
  }).join('');
  return `<div class="tile pinkline"><div class="row between"><div><span class="eyebrow" style="margin:0">${ic('tiger')} Palpites · Série ${nb.div} · rodada ${SE.CAL[nb.k].md}</span><div class="small muted">${when(SE.slotTime(S, nb.k))}</div></div>
      <div class="rewards"><span>5 acertos ${ic('star', '', 'color:var(--yellow)')}</span><span>10 ${gemIcS('color:var(--c-dia)')}</span></div></div>
    <div class="bets">${rows}</div><div class="row between" style="margin-top:10px"><span class="small muted">${n}/10 palpites</span><div class="bprog"><i style="width:${n * 10}%"></i></div></div></div>
    ${hist ? `<div class="tile"><div class="eyebrow">Últimas rodadas</div>${hist}</div>` : ''}`;
}
function calView() {
  const sched = SE.clubSchedule(S, S.club);
  const rows = sched.map(x => {
    if (x.tbd) return `<div class="calr"><span class="small muted">${when(x.t)}</span>${ic('trophy', '', 'color:var(--muted)')}<span class="muted">${x.comp === 'CB' ? 'Copa do Brasil' : 'Continental'} · a definir</span><span></span></div>`;
    const done = x.k < S.slot, opp = x.h === S.club ? x.a : x.h;
    const my = x.h === S.club ? x.gh : x.ga, ot = x.h === S.club ? x.ga : x.gh;
    const k = done ? (my > ot ? 'V' : my < ot ? 'D' : (x.pens ? ((x.h === S.club ? x.pens[0] > x.pens[1] : x.pens[1] > x.pens[0]) ? 'V' : 'D') : 'E')) : '';
    return `<button class="calr cmpl cmp-${x.comp} ${x.k === S.slot ? 'now' : ''}" ${done ? `data-act="match" data-k="${x.k}" data-h="${esc(x.h)}" data-a="${esc(x.a)}"` : `data-act="club" data-club="${esc(opp)}"`}><span class="small"><b>${SE.gameDate(S, x.k).txt}</b><br><span class="muted">${when(x.t)}</span></span>${crest(opp, 'sm')}<span><b>${esc(opp)}</b>${coachTag(opp)} <span class="muted small">${x.h === S.club ? 'casa' : 'fora'} · ${SE.COMP_NAME[x.comp]}</span></span>${done ? `<span class="form"><span class="${k}">${my}–${ot}</span></span>` : `<span class="muted small">elenco ›</span>`}</button>`;
  }).join('');
  return `<div class="legendrow">${fastClock() ? `<span>${ic('cal')} teste online: 1 dia = 30 min · temporada em 14h</span><span>${ic('clock')} jogo a cada 15 min</span><span>${ic('handshake')} janela: 1h a cada 3h30</span>` : SE.isTurbo(S) ? `<span>${ic('bolt')} Turbo: 7 dias reais = 1 temporada</span><span>${ic('clock')} 8h, 10h30, 13h, 15h30, 18h, 20h, 22h, 23h30</span><span>${ic('cal')} 1 dia do jogo = 6h reais</span><span>${ic('handshake')} janela: 12h abertas a cada 42h</span>` : `<span>${ic('cal')} 28 dias reais = 1 temporada</span><span>${ic('clock')} 12h e 18h</span><span>${ic('handshake')} janela sex 18h → dom 18h</span>`}<span>${ic('user')} Data FIFA: rodadas ${SE.CALLUPS.map(k => `${SE.CAL[k].md} e ${SE.CAL[k + 1].md}`).join(' · ')}</span><span>${ic('cal')} Pré-contratos: jogo ${SE.PRE_FROM}+</span></div>
    <div class="tile tight">${rows}</div>`;
}
function histView() {
  if (!S.history.length) return `<div class="tile"><p class="muted" style="margin:0">A primeira temporada ainda está em andamento.</p></div>`;
  return S.history.map(h => `<div class="tile"><div class="eyebrow">Temporada ${h.season}</div>
    <div class="kv"><span>Série A</span><b>${esc(h.A)}</b><span>Série B</span><b>${esc(h.B)}</b><span>Copa do Brasil</span><b>${esc(h.CB || '—')}</b><span>Libertadores</span><b>${esc(h.LIB || '—')}</b><span>Sul-Americana</span><b>${esc(h.SUL || '—')}</b><span>Conferência</span><b>${esc(h.CONF || '—')}</b>${h.NE ? `<span>Copa do Nordeste</span><b>${esc(h.NE)}</b><span>Copa Sul-Sudeste</span><b>${esc(h.SSE || '—')}</b><span>Copa Verde</span><b>${esc(h.VER || '—')}</b>` : ''}
    ${h.humans ? Object.entries(h.humans).map(([c, p]) => `<span>${esc(c)}</span><b>${p}º (treinador)</b>`).join('') : h.club ? `<span>Seu clube</span><b>${esc(h.club)} · ${h.pos}º na Série ${h.div}</b>` : ''}<span>Subiram</span><b>${h.up.map(esc).join(', ')}</b><span>Caíram</span><b>${h.down.map(esc).join(', ')}</b>${h.C ? `<span>Série C</span><b>${esc(h.C)}</b><span>Sobem da C</span><b>${(h.upC || []).map(esc).join(', ') || '—'}</b><span>Caem da B</span><b>${(h.downB || []).map(esc).join(', ') || '—'}</b><span>Caem pra D</span><b>${(h.downC || []).map(esc).join(', ') || '—'}</b><span>Sobem da D</span><b>${(h.upD || []).map(esc).join(', ') || '—'}</b>` : ''}</div>
    <div class="stack" style="gap:4px;margin-top:10px">${!awardsShown(h.season) ? '<div class="small muted">🏅 Prêmios revelados no Dia da Premiação.</div>' : Object.values(h.awards).filter(a => a.id != null).map(a => `<div class="small">🏅 ${esc(a.label)}: ${plink(a.id, P[a.id].name)} (${esc(a.club)}) · ${esc(a.value)}</div>`).join('')}</div></div>`).join('');
}

// ---------- notícias ----------
const NCOL = { match: 'var(--blue)', transfer: 'var(--lime)', injury: 'var(--coral)', event: 'var(--orange)', press: 'var(--pink)', trophy: 'var(--yellow)', award: 'var(--yellow)', club: 'var(--mint)', fin: 'var(--green)', callup: 'var(--purple)', coach: 'var(--stone)' };
const NICO = { match: 'ball', transfer: 'swap', injury: 'med', event: 'whistle', press: 'mic', trophy: 'trophy', award: 'star', club: 'shirt', fin: 'cash', callup: 'user', coach: 'tactic' };
function linkify(text, ids) {
  let out = esc(text);
  for (const id of [...new Set(ids || [])].filter(Boolean)) {
    const p = P[id]; if (!p) continue;
    for (const nm of [p.name, p.short]) { const e = esc(nm); if (out.includes(e)) { out = out.split(e).join(`<button class="pl" data-act="player" data-id="${id}">${e}</button>`); break; } }
  }
  return out;
}
function frontScore(n) {
  if (n.front) return n.front;
  const base = { trophy: 88, award: 80, press: 70, event: 68, transfer: 50, coach: 55, injury: 45, fin: 40, callup: 52, match: 40, club: 35 }[n.t] || 30;
  return base + ((n.clubs || []).includes(S.club) ? 12 : 0) - (n.minor ? 25 : 0) - (n.reward ? 20 : 0);
}
function vNews() {
  const f = UI.news;
  const chips = [['all', 'Tudo'], ['mine', 'Meu clube'], ['match', 'Jogos'], ['transfer', 'Mercado'], ['event', 'Eventos'], ['press', 'Imprensa']].map(([k, l]) => `<button class="chip ${f === k ? 'on' : ''}" data-act="newsf" data-k="${k}">${l}</button>`).join('');
  const list = S.news.filter(n => !n.desk || n.desk === S.__me).filter(n => f === 'all' ? !n.minor || (n.clubs || []).includes(S.club) : f === 'mine' ? (n.clubs || []).includes(S.club) || n.desk === S.__me : f === 'event' ? ['event', 'fin', 'coach', 'callup', 'injury', 'award', 'trophy', 'club'].includes(n.t) : n.t === f).slice(0, 80);
  const items = list.map(n => `<div class="feeditem ${isFab(n) ? 'fab' : ''}">${isFab(n) ? `<img class="fabav" src="${FAB_IMG}" alt="Fabrizio Otomano">` : `<span class="ndot" style="background:${NCOL[n.t] || 'var(--stone)'}">${ic(n.reward ? 'star' : NICO[n.t] || 'ball')}</span>`}<div>${isFab(n) ? `<div class="fabby"><b>Fabrizio Otomano</b>${n.tag === 'hwg' ? ' <span class="hwg">HERE WE GO</span>' : ''}</div>` : ''}
    <div class="t">${linkify(n.title, n.ids)}</div>${n.body ? `<div class="b">${linkify(n.body, n.ids)}</div>` : ''}${n.fx && n.fx.length ? `<div class="fxl">${n.fx.map(esc).join(' · ')}</div>` : ''}${n.callup ? `<button class="link" data-act="callup" data-c="${esc(n.callup)}">Ver convocação</button>` : ''}${n.bal ? `<button class="link" data-act="balopen" data-s="${n.bal}">Ver balanço completo</button>` : ''}<div class="w">Temporada ${n.s} · jogo ${Math.min(n.k, SE.SLOTS)}</div></div></div>`).join('');
  return `${topbar()}<div class="stack">${papersHTML('news')}<div class="row between"><h2 class="sech">${ic('news')} Notícias</h2><div class="row" style="gap:6px"><button class="btn sm alt" data-act="callup">${ic('user')} Seleção</button><button class="btn sm" data-act="modal" data-m="press">${ic('mic')} Coletiva</button></div></div>
    <div class="chips">${chips}</div><div class="tile" style="padding:4px 14px">${items || '<p class="muted">Nada por aqui ainda.</p>'}</div></div>`;
}

// ---------- modais ----------
function renderModal() {
  const root = $('#modal-root'); const m = UI.modal;
  if (!m || (!S && !['changelog', 'owner', 'help'].includes(m.type))) { root.innerHTML = ''; return; }   // v181: manual abre também antes de entrar numa liga
  // sorteio ao vivo: a animação mexe direto na tela; atualizações de fundo não podem redesenhar por cima
  if ((m.type === 'drawshow' || m.type === 'cbdraw') && !m.force && root.querySelector('.drawshow')) return;
  if (m.type === 'drawshow' || m.type === 'cbdraw') m.force = false;
  let body = '';
  try {
  if (m.type === 'player') body = playerModal(m);
  else if (m.type === 'slot') body = slotModal(m);
  else if (m.type === 'finance') body = financeModal();
  else if (m.type === 'balanco') body = balancoModal(m);
  else if (m.type === 'press') body = pressModal(m);
  else if (m.type === 'kit') body = kitModal(m);
  else if (m.type === 'career') body = careerModal(m);
  else if (m.type === 'teamtalk') body = teamTalkModal(m);
  else if (m.type === 'wallet') body = walletModal(m);
  else if (m.type === 'admin') body = adminModal(m);
  else if (m.type === 'friendly') { body = friendlyModal(m); markSeen('frSeen', frSig()); }
  else if (m.type === 'invite') body = inviteModal();
  else if (m.type === 'club') body = clubModal(m);
  else if (m.type === 'match') body = matchModal(m);
  else if (m.type === 'coach') body = coachModal(m);
  else if (m.type === 'pause') body = pauseModal(m);
  else if (m.type === 'mentions') body = mentionsModal();
  else if (m.type === 'callup') body = callupModal(m);
  else if (m.type === 'tickets') body = ticketsModal(m);
  else if (m.type === 'loanneg') body = loanNegModal(m);
  else if (m.type === 'changelog') body = changelogModal();
  else if (m.type === 'owner') body = `<h2 class="sech big">${ic('lock')} Dono do jogo</h2><p class="small muted" style="margin:0 0 10px">Senha do painel do dono. Libera criar ligas sem limite, entrar só como ADM e o modo god neste aparelho.</p><div class="row" style="gap:8px"><input type="password" id="own-key" placeholder="Senha do painel do dono" autocomplete="off" style="flex:1;min-width:0"><button class="btn sm" data-act="ownerunlock">Liberar</button></div>`;
  else if (m.type === 'help') body = helpModal(m);
  else if (m.type === 'cconfirm') body = cConfirmModal();
  else if (m.type === 'bug') body = bugModal(m);
  else if (m.type === 'mkfilt') body = mkFiltSheet();
  else if (m.type === 'drawshow') body = drawShowHTML(m);
  else if (m.type === 'cbdraw') body = cbShowHTML(m);
  else if (m.type === 'listing') body = listingModal(m);
  else if (m.type === 'awards') body = awardsModal(m);
  else if (m.type === 'agcal') body = agCalModal(m);
  else if (m.type === 'accsave') { const lg = S.league && S.league.name ? S.league.name : 'Liga', txt = `Treineiros · ${lg} (liga ${NET.code})\nMeu código de acesso: ${m.code}\n${NET.inviteLink()}`;
    body = `<h2 class="sech big">${ic('lock')} Salve seu código de acesso</h2><p style="margin:0">Se trocar de celular, limpar o navegador ou abrir em outro lugar, <b>só este código</b> devolve o seu treinador <b>${esc(S.manager || '')}</b> do ${esc(S.club || '')}. Ele vale só para esta liga.</p><div class="codebig" style="white-space:nowrap;font-size:clamp(26px,9vw,40px);letter-spacing:.08em">${esc(m.code)}</div>
      <div class="stack" style="gap:8px"><a class="btn big" style="text-align:center;text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(txt)}">Mandar pra mim no WhatsApp</a><button class="btn alt" data-act="acccopy" data-code="${esc(m.code)}">Copiar código</button><button class="btn alt" data-act="accsaved" data-code="${esc(m.code)}">Já salvei</button></div>
      <p class="small muted" style="margin:8px 0 0">Dica: tire um print desta tela. O código também fica em Carreira.</p>`; }
  else if (m.type === 'vagacode') { const txt = `Tem vaga pra você no Treineiros! Abra ${NET.inviteLink()} , entre na liga ${NET.code}, e no campo "Código de acesso ou de vaga" digite ${m.code}. Você assume o ${m.club}. O código vale 72 horas.`;
    body = `<h2 class="sech big">${ic('handshake')} Código de vaga · ${esc(m.club)}</h2><p style="margin:0">Mande para a pessoa que vai assumir o <b>${esc(m.club)}</b>. Ela entra na liga <b>${esc(NET.code)}</b>, digita este código em "Código de acesso ou de vaga" e cria o treinador direto no clube. Vale 72 horas e uma vez só.</p><div class="codebig">${esc(m.code)}</div><textarea readonly rows="4" style="width:100%;margin-top:8px" onclick="this.select()">${esc(txt)}</textarea><button class="btn big" style="margin-top:8px" onclick="try{navigator.clipboard.writeText(this.previousElementSibling.value);this.textContent='Copiado!'}catch(e){}">Copiar mensagem</button>`; }
  else if (m.type === 'acccode') body = `<h2 class="sech big">${ic('lock')} Código de acesso</h2><p style="margin:0">Novo código do treinador <b>${esc(m.name)}</b>. Mande só para ele: com este código ele entra com o treinador em qualquer aparelho. O código antigo deixa de funcionar.</p><div class="codebig">${esc(m.code)}</div>`;
  else if (m.type === 'reset') body = `<h2 class="disp" style="font-size:30px">Recomeçar?</h2><p style="margin:0">Isso apaga a carreira salva neste navegador.</p><div class="row"><button class="btn coral" style="flex:1" data-act="doreset">Apagar e recomeçar</button><button class="btn alt" data-act="close">Cancelar</button></div>`;
  } catch (e) {   // v152: tela que falha não some calada: mostra aviso e manda o erro pro dono (relato de bug automático)
    body = `<h2 class="sech big">Não consegui abrir esta tela</h2><p style="margin:0">Já avisei o dono do jogo com os detalhes. Tente de novo em instantes; se continuar, use o botão de reportar bug.</p>`;
    try { const k = 'tr_moderr_' + m.type; if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); NET.bugSend && NET.bugSend(`[automático] erro ao abrir a tela "${m.type}": ${String(e && e.message || e).slice(0, 200)} | ${String(e && e.stack || '').replace(/https?:\/\/[^\s)]+/g, '').slice(0, 900)}`, '').catch(() => {}); } } catch (e2) {}
    try { console.error('modal', m.type, e); } catch (e3) {}
  }
  const keepScroll = root.querySelector('.sheet') ? root.querySelector('.sheet').scrollTop : 0;
  root.innerHTML = `<div class="modal" data-act="bg"><div class="sheet ${m.type === 'player' ? 'pm' : ''} ${m.type === 'club' || m.type === 'match' || m.type === 'coach' || m.type === 'drawshow' || m.type === 'cbdraw' ? 'wide' : ''} ${m.type === 'press' ? 'press' : ''} ${m.type === 'awards' ? 'awards' : ''}" role="dialog" aria-modal="true"><div class="sheetbar">${m.back ? `<button class="x back" data-act="close" aria-label="Voltar">‹</button>` : '<span></span>'}<button class="x" data-act="close" aria-label="Fechar">×</button></div>${body}</div></div>`;
  if (m.type === 'player') { const sh = root.querySelector('.sheet'); sh.style.zoom = 1; if (m.neg) sh.classList.add('negmode'); }
  if (m.keep) root.querySelector('.sheet').scrollTop = keepScroll;
  m.keep = false;
}
// ficha do jogador: sempre cabe na tela, sem rolagem (reduz a escala se precisar)
function fitSheet(sh) {
  if (!sh) return;
  sh.style.zoom = 1;
  const avail = (window.visualViewport ? visualViewport.height : innerHeight) - 16;
  let z = 1;
  for (let i = 0; i < 4; i++) {
    const h = sh.getBoundingClientRect().height;
    if (h <= avail + 0.5) break;
    z = Math.max(0.9, z * avail / h); sh.style.zoom = z.toFixed(3); if (z <= 0.9) break;
  }
}
addEventListener('resize', () => { if (UI.modal && UI.modal.type === 'player') fitSheet(document.querySelector('.sheet.pm')); });
function slotModal(m) {
  const slot = C.FORMATIONS[S.tactics.formation][m.i][0];
  const xi = SE.userTeam(S).xi;
  const list = mySquad().map(id => ({ id, eff: vw(id).ovr * Wd.fitOf(S, id, slot) })).sort((a, b) => b.eff - a.eff);
  return `<h2 class="disp" style="font-size:28px">${C.POS_NAME[slot]}</h2><div class="list">${list.map(({ id, eff }) => {
    const cur = xi.indexOf(id), ok = SE.lineupAvail(S, id);
    return `<button class="prow" data-act="assign" data-id="${id}" ${ok ? '' : 'disabled style="opacity:.45"'}><span class="posb">${P[id].pos}</span>${av(id)}<span style="min-width:0"><span class="n">${esc(P[id].name)} ${statusTags(id)}</span><span class="m">overall ${vw(id).ovr} · condição ${Math.round(vw(id).cond)}${cur === m.i ? ' · nesta posição' : cur >= 0 ? ' · titular em ' + C.FORMATIONS[S.tactics.formation][cur][0] : ''}</span></span><span class="rt"><span class="ob ${cat(Math.round(eff)).k} num">${Math.round(eff)}</span></span></button>`;
  }).join('')}</div>`;
}
function financeModal() {
  const b = MK.budget(S), f = S.fin || {};
  const gateHome = SE.matchRevenue(S, S.club);
  const prizes = Object.values(S.seasonLog.prizes).reduce((a, c) => a + c, 0);
  const line = (icn, l, v, col) => `<div class="fline">${ic(icn, '', `color:${col}`)}<span>${l}</span><b class="num" style="color:${col}">${col === 'var(--coral)' ? '−' : '+'} T$ ${fmt(Math.abs(v))}</b></div>`;
  return `<h2 class="sech big">${ic('cash')} Finanças</h2>
    <div class="bigcash"><span>Caixa</span><b class="num">T$ ${fmt(b.cash)}</b></div>
    ${arrearsNote()}${helpNote()}
    ${(S.balancos || []).length ? `<button class="tkbtn" data-act="balopen" data-s="${S.balancos[0].s}">${ic('cash')} <span class="grow"><b>Balanço da temporada ${S.balancos[0].s}</b><span class="small muted">receitas e despesas, linha por linha</span></span>${ic('arrowR')}</button>` : ''}
    <div class="row between" style="gap:10px"><span class="small muted">${ic('handshake')} Diretoria: <b style="color:${(S.board ?? 60) >= 70 ? 'var(--green)' : (S.board ?? 60) >= 45 ? 'var(--yellow)' : 'var(--coral)'}">${Math.round(S.board ?? 60)}</b>/100 de confiança</span><button class="btn sm alt" data-act="askbudget">${ic('cash')} Pedir verba</button></div>
    <button class="tkbtn" data-act="modal" data-m="tickets">${ic('stadium')} <span class="grow"><b>${esc(SE.stadium(S, S.club).name)}</b><span class="small muted">${fmt(SE.stadium(S, S.club).cap)} lugares · ingresso ${esc(S.ticket || 'normal')}${S.fin.lastGate ? ` · última renda T$ ${fmtK(S.fin.lastGate)}` : ''}</span></span>${ic('arrowR')}</button>
    ${budgetBar(b, 'bb-modal')}
    <div class="minis"><span>${ic('wallet')} Folha T$ ${fmt(b.pay)}/dia</span><span>Folga T$ ${fmt(b.wageRoom)}/dia</span></div>${(() => { if (b.cashDays == null || S.post) return '';   // v247: uma frase só, comparando o caixa com o que falta da temporada
      const dd = n => `${n} dia${n === 1 ? '' : 's'}`;
      if (b.cash < 0) return `<div class="note bad" style="margin-top:8px">${ic('wallet')} Caixa negativo: os salários estão atrasando. Venda jogadores ou reduza salários.</div>`;
      return b.cashDays >= b.seasonLeft ? `<div class="note ok" style="margin-top:8px">${ic('wallet')} O caixa paga os salários até o fim da temporada (${dd(b.cashDays)} de salário, ${b.seasonLeft ? `faltam ${dd(b.seasonLeft)}` : 'última rodada'}).</div>`
        : `<div class="note bad" style="margin-top:8px">${ic('wallet')} O caixa acaba antes da temporada: paga ${dd(b.cashDays)} de salário e faltam ${dd(b.seasonLeft)}. Venda jogadores ou reduza salários.</div>`; })()}
    <div class="tile tight">
      ${line('stadium', 'Bilheteria', f.gate || 0, 'var(--green)')}${line('trophy', 'Prêmios', prizes, 'var(--green)')}${line('sell', 'Vendas', f.sold || 0, 'var(--green)')}${line('star', myOuro() ? 'Estrelas/Ouro' : 'Estrelas/diamantes', f.cashout || 0, 'var(--green)')}${f.loanRefundIn ? line('swap', 'Reembolso de empréstimo', f.loanRefundIn, 'var(--green)') : ''}
      ${line('wallet', 'Salários', -(f.wages || 0), 'var(--coral)')}${line('handshake', 'Contratações', -(f.spent || 0), 'var(--coral)')}${line('out', 'Rescisões', -(f.release || 0), 'var(--coral)')}${f.loanRefundOut ? line('swap', 'Devolução de empréstimo', -f.loanRefundOut, 'var(--coral)') : ''}</div>
    <div class="gate"><div><span>${ic('stadium')} Em casa</span><b class="num">T$ ${fmt(gateHome * C.ECON.homeShare)}</b></div><div><span>Fora</span><b class="num">T$ ${fmt(gateHome * (1 - C.ECON.homeShare))}</b></div><span class="small muted">bilheteria 90/10</span></div>`;
}
function walletModal(m) {
  const E = C.ECON;
  return `<h2 class="sech big">${ic('wallet')} Carteira</h2>
    <div class="wbig"><div class="cur st">${ic('star')}<b class="num">${S.stars || 0}</b><span>estrelas</span></div><div class="cur ${gemCls()}">${gemIc()}<b class="num">${S.dias || 0}</b><span>${myOuro() ? 'Ouro' : 'diamantes'}</span></div><div class="cur cs">${ic('cash')}<b class="num">${fmtK(S.cash[S.club])}</b><span>caixa</span></div></div>
    <div class="xch"><div class="xc"><span class="cur st">${ic('star')}20</span>${ic('arrowR')}<span class="cur ${gemCls()}">${gemIc()}1</span></div><button class="btn sm" data-act="s2d" ${(S.stars || 0) < 20 ? 'disabled' : ''}>Trocar</button></div>
    <div class="xch"><div class="xc"><span class="cur st">${ic('star')}1</span>${ic('arrowR')}<span class="cur cs">${ic('cash')}${fmtK(E.starCash)}</span></div><div class="row" style="gap:6px"><button class="btn sm alt" data-act="cashout" data-k="star" data-n="1" ${(S.stars || 0) < 1 ? 'disabled' : ''}>×1</button><button class="btn sm alt" data-act="cashout" data-k="star" data-n="5" ${(S.stars || 0) < 5 ? 'disabled' : ''}>×5</button></div></div>
    <div class="xch"><div class="xc"><span class="cur ${gemCls()}">${gemIc()}1</span>${ic('arrowR')}<span class="cur cs">${ic('cash')}${fmtK(E.diaCash)}</span></div><button class="btn sm alt" data-act="cashout" data-k="dia" data-n="1" ${(S.dias || 0) < 1 ? 'disabled' : ''}>×1</button></div>
    <div class="earn"><div class="eyebrow">Como ganhar</div>
      <div><span>3 vitórias seguidas</span><b>${ic('star')}1</b></div><div><span>6 vitórias seguidas</span><b>${ic('star')}2</b></div><div><span>10 vitórias seguidas</span><b>${gemIc()}1</b></div>
      <div><span>Vitória em clássico</span><b>${ic('star')}1</b></div><div><span>3 vitórias em amistosos no dia</span><b>${ic('star')}1</b></div><div><span>10 vitórias seguidas em amistosos (1× por sequência)</span><b>${gemIc()}1</b></div><div><span>5 / 10 acertos nos palpites</span><b>${ic('star')}1 · ${gemIc()}1</b></div></div>`;
}
function friendlyModal(m) {
  try { SE.resolveInvites(S); } catch (e) { try { console.error('resolveInvites', e); } catch (e2) {} }
  const fr = SE.friendsToday(S), left = 5 - fr.played;
  const q = (m.q || '').toLowerCase();
  const byClub = {}; for (const inv of fr.invites) byClub[inv.club] = inv;
  let tired = 0; try { tired = SE.userTeam(S).xi.filter(x => x && vw(x) && vw(x).cond < 70).length; } catch (e) {}
  const incoming = fr.invites.filter(i => i.status === 'incoming' || i.status === 'accepted');
  const pend = fr.invites.filter(i => i.status === 'pending');
  const inc = incoming.map(i => `<div class="inv ${i.status}">${crest(i.club)}<div class="grow"><b>${esc(i.club)}</b><span class="small">“${esc(i.reply)}”</span></div>
    ${i.status === 'incoming' ? `<button class="btn sm" data-act="frplay" data-club="${esc(i.club)}" ${left <= 0 ? 'disabled' : ''}>Aceitar e jogar</button><button class="btn sm alt" data-act="frno" data-club="${esc(i.club)}">×</button>` : `<button class="btn sm" data-act="frplay" data-club="${esc(i.club)}" ${left <= 0 ? 'disabled' : ''}>${ic('ball')} Jogar</button>`}</div>`).join('');
  const pen = pend.map(i => `<div class="inv pending">${crest(i.club)}<div class="grow"><b>${esc(i.club)}</b><span class="small muted">aguardando o técnico responder…</span></div><span class="spin"></span></div>`).join('');
  const dec = fr.invites.filter(i => i.status === 'declined').slice(-2).map(i => `<div class="inv declined">${crest(i.club)}<div class="grow"><b>${esc(i.club)}</b><span class="small">“${esc(i.reply)}”</span></div><span class="pill">recusou</span></div>`).join('');
  const clubs = Wd.brClubs(S).filter(c => c !== S.club && (!q || c.toLowerCase().includes(q))).sort((a, b) => Wd.isHuman(S, b) - Wd.isHuman(S, a));
  return `<h2 class="sech big">${ic('vs')} Amistoso</h2>
    <div class="minis"><span>${ic('ball')} ${fr.played}/5 hoje</span><span>${ic('star')} ${(() => { const f = frDay(); return f.star ? 'estrela de hoje obtida!' : `${f.w}/3 vitórias · ${f.played}/5 amistosos`; })()}</span><span>${ic('trophy')} ${(S.fws || 0) >= 10 ? `${S.fws} seguidas · ${gemIc()} já recebido` : `${S.fws || 0} seguidas · 10 = ${gemIc()}`}</span><span>${ic('med')} desgasta</span><span>${ic('card')} sem suspensão</span></div>
    ${tired ? `<div class="note mid">${ic('dumbbell')} ${tired} titular(es) com condição abaixo de 70.</div>` : ''}
    ${inc || pen || dec ? `<div class="stack" style="gap:8px">${inc}${pen}${dec}</div>` : ''}
    <input type="text" id="fr-q" placeholder="Buscar clube pra desafiar" value="${esc(m.q || '')}" autocomplete="off">
    <div class="list">${clubs.map(c => { const inv = byClub[c]; const st = inv && inv.status; return `<div class="prow" style="grid-template-columns:34px 1fr auto">${crest(c)}<span><span class="n">${esc(c)}</span><span class="m">Série ${(Wd.divOf(S, c) || 'B')} · ${Wd.isHuman(S, c) ? `${ic('user')} <b>${esc((S.coaches[c] && S.coaches[c].name) || (S.desks[Wd.deskOf(S, c)] || {}).manager || 'treinador')}</b>` : esc(S.coaches[c] ? S.coaches[c].name : 'sem técnico')}</span></span>
      ${st === 'pending' ? '<span class="pill">enviado</span>' : st === 'accepted' || st === 'incoming' ? '<span class="pill" style="color:var(--lime)">topou</span>' : st === 'played' ? '<span class="pill">jogado</span>' : `<button class="btn sm" data-act="frinvite" data-club="${esc(c)}" ${left <= 0 ? 'disabled' : ''}>Desafiar</button>`}</div>`; }).join('')}</div>`;
}
function kitModal(m) {
  const base = Wd.clubInfo(S.club), cur = S.kits[S.club] || { pat: base.pat, swap: false };
  const sel = m.sel || cur;
  const star = mySquad().slice().sort((a, b) => vw(b).ovr - vw(a).ovr).find(id => P[id].pos !== 'GOL');
  const kitOf = (pat, swap) => { const c = swap ? [base.c[1] || base.c[0], base.c[0], ...base.c.slice(2)] : base.c; return { ...base, pat, c }; };
  const opts = Object.entries(SPR.PATTERNS).map(([k, l]) => `<button class="stylec ${sel.pat === k ? 'on' : ''}" data-act="kitpat" data-k="${k}" style="display:flex;gap:10px;align-items:center"><img class="spr" src="${SPR.player(P[star], kitOf(k, sel.swap), false)}" alt="" style="width:34px"><b style="font-size:13px">${l}</b></button>`).join('');
  return `<h2 class="disp" style="font-size:32px">Uniforme</h2><p class="muted small" style="margin:0">As cores do ${esc(S.club)} ficam; você escolhe o desenho e a ordem das cores.</p>
    <div class="row" style="justify-content:center"><img class="spr" src="${SPR.player(P[star], kitOf(sel.pat, sel.swap), false)}" alt="" style="width:110px"></div>
    <button class="btn sm alt" data-act="kitswap">Inverter cores</button><div class="styles">${opts}</div><button class="btn big" data-act="kitsave">Salvar uniforme</button>`;
}
function gallery() {
  const b = (S.badges || []).filter(x => x.kind !== 'selo');
  const o = S.obj && S.obj[S.club];
  return `<div class="tile" style="background:var(--s2)"><div class="eyebrow">${ic('trophy')} Galeria de conquistas</div>
    ${b.length ? `<div class="gallery">${b.map(x => `<div class="badge ${x.kind}">${x.kind === 'trophy' ? ic('trophy') : ic('star')}<b>${esc(x.label)}</b><span>${esc(x.club)} · ${x.season}</span></div>`).join('')}</div>`
      : `<p class="muted small" style="margin:0">Cumpra o objetivo da diretoria${o ? ` (${esc(o.label)})` : ''} ou conquiste um título pra ganhar o primeiro selo.</p>`}</div>`;
}
function careerModal(m) {
  const vac = EV.vacancies(S);
  const hist = S.hist || [];
  return `<h2 class="disp" style="font-size:32px">Carreira</h2>
    ${coachModal({ tok: S.__me })}
    <button class="btn sm alt" style="align-self:flex-start" data-act="editcoach">${ic('user')} Editar treinador</button>
    <div class="tile" style="background:var(--s2)"><div class="eyebrow">Vagas abertas</div>${vac.length ? vac.map(c => `<div class="row between" style="padding:6px 0">${crest(c, 'sm')}<span class="grow">${esc(c)}</span></div>`).join('') : '<p class="muted small" style="margin:0">Nenhuma agora.</p>'}</div>
    ${gallery()}
    <p class="muted small" style="margin:0">Se pedir demissão, a IA assume o ${esc(S.club)} e você pode escolher qualquer clube sem treinador.</p>
    ${m.confirm ? `<div class="row"><button class="btn coral" style="flex:1" data-act="resign">Confirmar demissão</button><button class="btn alt" data-act="unconfirm">Voltar</button></div>` : `<button class="btn big alt" data-act="confirm" data-k="resign">Pedir demissão</button>`}
    ${NET.online ? `<button class="btn alt" data-act="leaveleague">${ic('out')} Trocar de liga</button>` : `<button class="link" data-act="reset" style="color:var(--muted);align-self:flex-start">Apagar carreira e recomeçar</button>`}`;
}
const TEAM_TALKS = [
  { name: 'Motivar', txt: 'Vamos pra cima, esse jogo é nosso.', f: fav => fav < 0.4 ? 6 : 2 },
  { name: 'Tirar a pressão', txt: 'Joguem leve, confiem no trabalho.', f: fav => fav > 0.55 ? 6 : fav < 0.3 ? -2 : 2 },
  { name: 'Cobrar postura', txt: 'Quero outra atitude hoje.', f: (fav, streak) => streak.endsWith('D') ? 5 : -4 },
];
function teamTalkModal(m) {
  return `<h2 class="disp" style="font-size:32px">Falar com o grupo</h2><p class="muted small" style="margin:0">Uma conversa por jogo. O efeito na moral dos titulares depende de quem é o favorito e do momento do time.</p>
    <div class="stack" style="gap:8px">${TEAM_TALKS.map((t, i) => `<button class="stylec" data-act="dotalk" data-i="${i}"><b>${t.name}</b><span>“${t.txt}”</span></button>`).join('')}</div>`;
}
// ---------- coletiva de imprensa ----------
function pressModal(m) {
  const log = (S.press || []).slice(-6).map(p => `<div class="bub me">${esc(p.q)}</div><div class="bub head"><b>${esc(p.h)}</b>${esc(p.l)}</div>`).join('');
  const ment = m.ment ? mentionList(m.ment) : '';
  return `<h2 class="disp" style="font-size:32px">Coletiva</h2>
    <p class="muted small" style="margin:0">Fale o que quiser. Use @ pra citar clube, jogador ou outro treinador da liga (ex.: @Palmeiras). Críticas mexem na moral de quem você cita; provocação motiva o rival.</p>
    <div class="chat">${log || '<div class="bub">Os repórteres esperam sua primeira declaração.</div>'}${m.busy ? '<div class="bub">Redigindo a manchete…</div>' : ''}</div>
    ${ment ? `<div class="mentions">${ment}</div>` : ''}
    <textarea id="press-q" placeholder="Ex.: O @Palmeiras só ganha no apito. E o @[Pedro] precisa acordar." maxlength="400">${esc(m.draft || '')}</textarea>
    <button class="btn big" data-act="presssend" ${m.busy ? 'disabled' : ''}>${m.busy ? 'Enviando…' : 'Falar à imprensa'}</button>
    ${SAMPLE === null ? '<p class="muted small" style="margin:0">Sem acesso ao Claude nesta visualização: as manchetes saem de modelos prontos.</p>' : ''}`;
}
function mentionList(q) {
  const qq = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const coaches = Object.entries(S.desks || {}).filter(([t, d]) => t !== S.__me && !d.unemployed && d.manager.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(qq)).slice(0, 4)
    .map(([, d]) => `<button data-act="mention" data-v="${esc(d.manager)}"><img class="px cav" src="${SPR.coach(d.avatar, d.club)}" alt=""> ${esc(d.manager)} <span class="muted small">técnico do ${esc(d.club)}</span></button>`);
  const clubs = Wd.brClubs(S).filter(c => c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(qq)).slice(0, 4).map(c => `<button data-act="mention" data-v="${esc(c)}">${crest(c, 'sm')} ${esc(c)}</button>`);
  const pl = Wd.brClubs(S).flatMap(c => Wd.squad(S, c)).filter(id => (P[id].name + ' ' + P[id].short).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(qq)).sort((a, b) => vw(b).ovr - vw(a).ovr).slice(0, 6)
    .map(id => `<button data-act="mention" data-v="${esc(P[id].short)}">${flag(P[id].nat)} ${esc(P[id].name)} <span class="muted small">${esc(own(id))}</span></button>`);
  const refs = C.REFEREES.filter(r => r.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(qq)).slice(0, 3)
    .map(r => `<button data-act="mention" data-v="${esc(r.name)}">${ic('whistle')} ${esc(r.name)} <span class="muted small">árbitro${r.nat !== 'BRA' ? ' · ' + esc(r.nat) : ''}</span></button>`);
  return [...coaches, ...clubs, ...refs, ...pl].join('');
}
function resolveMentions(text) {
  const out = [];
  const re = /@\[([^\]]+)\]|@([\p{L}\-]+)/gu; let m;
  while ((m = re.exec(text))) {
    const name = (m[1] || m[2]).trim(), nn = name.toLowerCase();
    const co = Object.entries(S.desks || {}).find(([t, d]) => t !== S.__me && !d.unemployed && (d.manager.toLowerCase() === nn || d.manager.toLowerCase().split(' ')[0] === nn));
    if (co) { out.push({ type: 'coach', name: co[1].manager, club: co[1].club, token: co[0] }); continue; }
    const ref = C.REFEREES.find(r => r.name.toLowerCase() === nn || (r.name.toLowerCase().split(' ').slice(-1)[0] === nn && nn.length > 4));
    if (ref) { out.push({ type: 'ref', name: ref.name, id: ref.id }); continue; }
    const club = [...Wd.brClubs(S), ...Object.keys(Wd.CL)].find(c => c.toLowerCase() === nn);
    if (club) { out.push({ type: 'club', name: club }); continue; }
    const cand = Wd.brClubs(S).flatMap(c => Wd.squad(S, c)).filter(id => P[id].short.toLowerCase() === nn || P[id].name.toLowerCase() === nn);
    if (cand.length) { const id = cand.sort((a, b) => (own(b) === S.club) - (own(a) === S.club) || vw(b).ovr - vw(a).ovr)[0]; out.push({ type: 'player', id, name: P[id].name, club: own(id) }); }
  }
  return out;
}
async function pressSend() {
  const q = ($('#press-q') || {}).value || '';
  if (!q.trim()) return toast('Escreva o que quer dizer.', true);
  const ments = resolveMentions(q);
  UI.modal.busy = true; UI.modal.draft = q; renderModal();
  const div = (Wd.divOf(S, S.club) || 'B');
  const pos = SE.standings(S.comp[div].table).findIndex(r => r.c === S.club) + 1;
  const lm = S.lastMatch;
  const ctx = `Técnico: ${S.manager}, do ${S.club} (${pos}º na Série ${div}, temporada ${S.season}).${lm ? ` Último jogo: ${lm.f.h} ${lm.res.gh}×${lm.res.ga} ${lm.f.a}.` : ''}`;
  const mtxt = ments.map(x => x.type === 'club' ? `clube ${x.name}` : x.type === 'coach' ? `técnico ${x.name} (${x.club}, treinador humano da liga)` : x.type === 'ref' ? `árbitro ${x.name}` : `jogador ${x.name} (${x.club})`).join('; ') || 'nenhuma';
  let res = null;
  if (SAMPLE) {
    try {
      res = await SAMPLE.json(`Você é o editor de um portal esportivo brasileiro FICTÍCIO dentro do jogo de futebol "Treineiros". Transforme a fala do técnico em notícia no tom da imprensa esportiva brasileira. Não invente fatos além da fala e do contexto. Nada de ofensas pessoais ou temas fora do futebol; se a fala tiver algo assim, suavize.
Contexto: ${ctx}
Menções resolvidas: ${mtxt}
Fala do técnico: """${q.slice(0, 400)}"""
A fala NÃO foi em coletiva: é uma declaração avulsa. Na manchete nunca use "coletiva"; use verbos como dispara, afirma, diz que, crava, manda recado.
Responda só com JSON: {"manchete": string (até 90 caracteres), "lide": string (até 240 caracteres), "tom": "provocacao"|"elogio"|"critica"|"neutro"|"polemica", "alvos": [{"nome": string, "efeito": "positivo"|"negativo"|"neutro"}], "arbitro": 0|1|2}. Em "alvos" use só nomes das menções resolvidas. "arbitro" só se um árbitro foi mencionado: 0 = comentário normal, 1 = crítica técnica ao trabalho, 2 = ofensa ou acusação de má-fé.`, { modelTier: 'quick', cache: false });
    } catch (e) { if (e && (e.code === 'not_granted' || e.code === 'sampling_disabled' || e.code === 'not_declared')) SAMPLE = null; res = null; }
  }
  if (!res || !res.manchete) res = templatePress(q, ments);
  res.manchete = noColetiva(res.manchete);
  applyPress(q, res, ments);
  UI.modal.busy = false; UI.modal.draft = ''; save(); renderModal();
}
// declaração livre não é coletiva: tira a palavra da manchete gerada
function noColetiva(t) { t = String(t || ''); if (!/coletiva/i.test(t)) return t; return t.replace(/\s*(em|na|durante a|após a)\s+(entrevista\s+)?coletiva/gi, '').replace(/\bfala\b/i, 'afirma').replace(/coletiva/gi, 'declaração').replace(/\s{2,}/g, ' ').trim(); }
function templatePress(q, ments) {
  const t = q.toLowerCase();
  const st = stanceOf(q), pos = st.s === 'elogio' || (st.s === 'neutro' && /(craque|orgulh|gigante)/.test(t));
  const neg = !pos && (st.s === 'critica' || st.s === 'ataque' || /(acord|cobr|precisa|sorte)/.test(t));
  const rival = ments.find(x => x.type === 'club' && x.name !== S.club);
  const player = ments.find(x => x.type === 'player');
  const tom = rival && neg ? 'provocacao' : player && neg ? 'critica' : pos ? 'elogio' : 'neutro';
  // declaração livre (fora da coletiva): verbos de fala — dispara, afirma, diz que, crava, manda recado
  const M = S.manager, sn = `"${q.slice(0, 55).trim()}${q.length > 55 ? '…' : ''}"`, rr = C.R('fh' + q.length + q.slice(0, 12) + (S.lastDay || 0));
  const coach = ments.find(x => x.type === 'coach'), pick = a => a[Math.floor(rr() * a.length)];
  const neutral = coach ? pick([`${M} manda recado a ${coach.name}: ${sn}`, `${M} diz que ${coach.name} ${neg ? 'vai ter trabalho' : 'merece respeito'}: ${sn}`])
    : rival ? pick([`${M} comenta o ${rival.name}: ${sn}`, `${M} afirma sobre o ${rival.name}: ${sn}`])
    : player ? pick([`${M} fala sobre ${player.name}: ${sn}`, `${M} diz que ${player.name} ${pos ? 'é peça importante' : 'segue nos planos'}: ${sn}`])
    : neg ? pick([`${M} dispara: ${sn}`, `${sn}, dispara ${M}`]) : pick([`${M} afirma: ${sn}`, `${sn}, diz ${M}`, `${M} crava: ${sn}`]);
  const h = tom === 'provocacao' ? pick([`${M} provoca o ${rival.name}: ${sn}`, `${M} dispara contra o ${rival.name}: ${sn}`]) : tom === 'critica' ? pick([`${M} cobra ${player.name} publicamente`, `${M} dispara contra ${player.name}: ${sn}`]) : tom === 'elogio' ? pick([`${M} rasga elogios${player ? ` a ${player.name}` : coach ? ` a ${coach.name}` : rival ? ` ao ${rival.name}` : ' ao elenco'}`, `${M} diz que ${player ? player.name : coach ? coach.name : rival ? 'o ' + rival.name : 'o elenco'} ${player ? 'é diferenciado' : coach || rival ? 'faz grande trabalho' : 'está no caminho certo'}`]) : neutral;
  const ref = ments.find(x => x.type === 'ref'), sev = st.s === 'ataque' ? 2 : st.s === 'critica' ? 1 : 0;
  const hh = ref && sev >= 2 ? `${S.manager} acusa o árbitro ${ref.name}: "${q.slice(0, 45)}${q.length > 45 ? '…' : ''}"` : ref && sev === 1 ? `${S.manager} critica a arbitragem de ${ref.name}` : ref && st.s === 'elogio' ? `${S.manager} elogia a arbitragem de ${ref.name}` : ref ? `${S.manager} comenta o trabalho de ${ref.name}` : h;
  return { manchete: hh, lide: `"${q.slice(0, 220)}", disse o técnico do ${S.club}.`, tom: ref && sev >= 2 ? 'polemica' : tom, arbitro: ref ? sev : undefined, alvos: ments.map(x => ({ nome: x.name, efeito: tom === 'elogio' ? 'positivo' : neg ? 'negativo' : 'neutro' })) };
}
// gravidade de uma fala sobre árbitro: 0 = normal, 1 = crítica técnica, 2 = ofensa/acusação (vai pro STJD)
function refSeverity(q) {
  const t = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/(roub|ladra|comprad|vendid|mafia|esquema|manipul|desonest|corrupt|safad|vagabund|canalha|sem vergonha|pilantra|bandid|marmelada|de proposito|mal intencionad|propina|armad[oa] contra|palhac|incompetente|lixo|vergonh)/.test(t)) return 2;
  if (/(errou|erro|fraco|ruim|pessim|pior|confus|equivoc|nao viu|interpret|criterio|\bvar\b|lance|penalti|expuls|cartao|apito)/.test(t)) return 1;
  return 0;
}
function applyPress(q, res, ments) {
  const effects = [];
  for (const a of res.alvos || []) {
    const m = ments.find(x => x.name.toLowerCase() === String(a.nome || '').toLowerCase());
    if (!m) continue;
    if (m.type === 'player') {
      const s = Wd.ps(S, m.id);
      if (own(m.id) === S.club) {
        const d = a.efeito === 'negativo' ? (s.temper === 'sensível' ? -12 : s.temper === 'temperamental' ? -10 : s.temper === 'ambicioso' ? -3 : -7) : a.efeito === 'positivo' ? 6 : 0;
        s.mor = C.clamp(s.mor + d, 0, 100); if (d) effects.push(`${P[m.id].short} ${d > 0 ? '+' : ''}${d} de moral`);
        if (d <= -10) EV.news(S, { t: 'press', title: `${P[m.id].short} rebate críticas de ${S.manager}`, body: 'Clima estranho no vestiário depois da declaração do técnico.', ids: [m.id], clubs: [S.club] });
      } else if (a.efeito === 'negativo') { s.mor = C.clamp(s.mor + 4, 0, 100); effects.push(`${P[m.id].short} (${own(m.id)}) ficou mordido`); }
    } else if (m.type === 'coach') {
      if (a.efeito === 'negativo') { for (const id of Wd.squad(S, m.club)) Wd.ps(S, id).mor = C.clamp(Wd.ps(S, id).mor + 3, 0, 100); effects.push(`O ${m.club} de ${m.name} usa a provocação como motivação`); }
      else if (a.efeito === 'positivo') effects.push(`${m.name} foi elogiado`);
    } else if (m.type === 'club' && m.name !== S.club && a.efeito === 'negativo') {
      for (const id of Wd.squad(S, m.name)) Wd.ps(S, id).mor = C.clamp(Wd.ps(S, id).mor + 3, 0, 100);
      effects.push(`${m.name} usa a provocação como motivação`);
      if (S.coaches[m.name]) EV.rivalReply(S, m.name, res.tom);
    } else if (m.type === 'club' && m.name === S.club && a.efeito === 'positivo') {
      for (const id of mySquad()) Wd.ps(S, id).mor = C.clamp(Wd.ps(S, id).mor + 2, 0, 100);
    }
  }
  // árbitro mencionado: crítica comum só repercute; ofensa ou acusação vira denúncia no STJD (multa sai do caixa do clube)
  const refM = ments.find(x => x.type === 'ref');
  if (refM) {
    const sev = res.arbitro != null ? +res.arbitro : refSeverity(q);
    if (sev >= 2) {
      const amount = Math.max(5000, Math.round(Wd.payroll(S, S.club) * (2 + Math.min(3, (S.stjdCount || 0))) / 1000) * 1000);
      S.stjdCount = (S.stjdCount || 0) + 1;
      S.stjd = S.stjd || []; S.stjd.push({ club: S.club, man: S.manager, ref: refM.name, amount, at: (S.lastDay ?? 0) + 1, q: q.slice(0, 120) });
      effects.push(`denúncia no STJD por falas contra ${refM.name}`);
      EV.news(S, { t: 'press', tag: 'stjd', front: 88, title: `STJD vai analisar falas de ${S.manager} contra o árbitro ${refM.name}`, body: `A procuradoria entendeu que a declaração passou do limite da crítica. O ${S.club} pode ser multado.`, clubs: [S.club] });
    } else if (sev === 1) effects.push(`crítica à arbitragem de ${refM.name} repercute`);
  }
  S.press = S.press || []; S.press.push({ q, h: res.manchete, l: res.lide }); S.press = S.press.slice(-20);
  EV.news(S, { t: 'press', self: true, front: res.tom === 'provocacao' || res.tom === 'polemica' ? 90 : res.tom === 'critica' ? 84 : 72, title: res.manchete, body: res.lide, fx: effects, ids: ments.filter(x => x.type === 'player').map(x => x.id), clubs: [S.club, ...ments.filter(x => x.type === 'club' || x.type === 'coach').map(x => x.type === 'coach' ? x.club : x.name)], coachIds: ments.filter(x => x.type === 'coach').map(x => x.token) });
  if (effects.length) toast(effects.join(' · '));
}

// ---------- jogo ao vivo ----------
function captainOf(side) {
  const lm = S.lastMatch, T = side === 'h' ? lm.H : lm.A;
  const ids = (T.xi || []).filter(Boolean); if (!ids.length) return null;
  return Wd.captain(S, side === 'h' ? lm.f.h : lm.f.a, ids) || ids.slice().sort((a, b) => vw(b).ovr - vw(a).ovr)[0];
}
function capImg(side) {
  const id = captainOf(side), club = side === 'h' ? S.lastMatch.f.h : S.lastMatch.f.a;
  return id ? `<span class="cap"><img class="spr" src="${SPR.player(P[id], SPR.kitFor(S, club), P[id].pos === 'GOL')}" alt=""><i>C</i></span>` : crest(club, 'lg');
}
function vLive() {
  const lm = S.lastMatch, f = lm.f;
  return `<div class="stack cmp cmp-${f.comp}" style="padding-top:10px">
    <div class="row between"><span class="compb">${ic('trophy')} ${SE.COMP_NAME[f.comp]}</span><div class="row" style="gap:6px" id="lv-ctrl"><button class="chip ${MV.enabled() ? 'on' : ''}" data-act="mvtoggle">${ic('tactic')} Campo</button><button class="chip" data-act="lusavelive" title="Salvar a escalação deste jogo">${ic('tactic')} Salvar</button><button class="chip" data-act="speed" id="spd">1×</button><button class="chip" data-act="skip">Pular</button></div></div>
    <div class="board"><div class="score"><div class="t">${capImg('h')}<b>${esc(f.h)}</b></div><div class="g num" id="lv-score">0:0</div><div class="t">${capImg('a')}<b>${esc(f.a)}</b></div></div>
      <div class="clock num" id="lv-clock">0'</div><div class="prog"><i id="lv-prog"></i></div><div class="row" style="justify-content:center;margin-top:10px">${refChip(C.REFEREES[lm.ref])}</div></div>
    ${mvHTML()}
    <div id="lv-end"></div>
    <div class="tile"><div class="eyebrow">${ic('tactic')} Estatísticas</div><div class="sbars" id="lv-stats"></div></div>
    ${lineupsTile(lm, [])}
    <div class="tile"><div class="eyebrow">${ic('clock')} Lance a lance</div><div class="feed" id="lv-feed"><div class="ev"><span class="evi" style="--ec:var(--mint)">${ic('whistle')}</span><span class="mn">0'</span><span>Bola rolando!</span></div></div></div>
    ${lm.friendly ? '' : `<div class="tile"><div class="eyebrow">${ic('ball')} Outros jogos</div><div id="lv-others"></div></div>`}</div>`;
}
const minOf = lbl => { if (lbl === 'Pên.') return 93; const [a, b] = String(lbl).split('+'); return (+a || 0) + (b ? +b / 10 : 0); };
function evText(e, f) {
  const club = e.s === 'h' ? f.h : f.a, n = id => id != null && P[id] ? plink(id) : '?';
  switch (e.t) {
    case 'goal': return `${e.v === 'pen' ? '<b class="vart">VAR</b> marca pênalti. ' : ''}${e.v === 'late' ? '<b class="vart">VAR</b> revisa o impedimento: posição legal. ' : ''}<b>Gol do ${esc(club)}!</b> ${n(e.p)}${e.pen ? ` de pênalti${e.f != null && P[e.f] ? ` <span class="muted">(cometido por ${n(e.f)})</span>` : ''}` : e.a != null ? ` · assistência de ${n(e.a)}` : ''}${e.v === 'chk' ? ' <span class="muted">(confirmado pelo <b class="vart">VAR</b>)</span>' : ''}`;
    case 'goal_off': return `<b class="vart">VAR</b> Gol de ${n(e.p)} anulado: ${esc(e.why || 'impedimento')}.`;
    case 'var': return e.k === 'pen_off' ? `<b class="vart">VAR</b> Pênalti para o ${esc(club)}${e.f != null && P[e.f] ? ` (falta de ${n(e.f)})` : ''} é desmarcado após revisão.` : `<b class="vart">VAR</b> checa possível toque de mão. Segue o jogo.`;
    case 'save': return e.pen ? `${e.v === 'pen' ? '<b class="vart">VAR</b> marca pênalti. ' : ''}${n(e.g)} <b>defende o pênalti</b> de ${n(e.p)}!${e.f != null && P[e.f] ? ` <span class="muted">(cometido por ${n(e.f)})</span>` : ''}` : `${n(e.g)} defende o chute de ${n(e.p)}.`;
    case 'miss': return e.pen ? `${e.v === 'pen' ? '<b class="vart">VAR</b> marca pênalti. ' : ''}${n(e.p)} <b>perde o pênalti</b>!${e.f != null && P[e.f] ? ` <span class="muted">(cometido por ${n(e.f)})</span>` : ''}` : `${n(e.p)} finaliza pra fora.`;
    case 'yellow': return e.v === 'red_off' ? `<b class="vart">VAR</b> revisa possível vermelho: fica o amarelo pra ${n(e.p)}.` : `Amarelo pra ${n(e.p)} (${esc(club)}).`;
    case 'red': return e.v === 'var' ? `<b class="vart">VAR</b> Após revisão, <b>vermelho</b> pra ${n(e.p)} (${esc(club)}).` : `<b>Vermelho direto</b> pra ${n(e.p)} (${esc(club)}).`;
    case 'red2': return `<b>Segundo amarelo</b>: ${n(e.p)} expulso.`;
    case 'injury': return `${n(e.p)} sente e pede substituição.`;
    case 'sub': return `Sai ${n(e.o)}, entra ${n(e.p)} (${e.why}).`;
    case 'tactic': return `${esc(club)} muda: <b>${C.STYLES[e.style].name}</b>${e.formation ? ` no ${e.formation}` : ''} (${e.why}).`;
    case 'pens': return `<b>Pênaltis: ${e.x[0]}–${e.x[1]}</b>`;
    case 'ht': return 'Intervalo';
    case 'foul': return `Falta de ${n(e.p)} (${esc(club)}).`;
    case 'offside': return `${n(e.p)} em impedimento.`;
    case 'reorg': return `${esc(club)} se reorganiza: ${n(e.p)} ${esc(e.why || '')}.`;
  }
  return '';
}
function teamColor(club, other) {
  const k0 = SPR.kitFor(S, club) || {}, cs = (k0.c || []).filter(x => typeof x === 'string' && x[0] === '#');
  if (!cs.length) return other === '#5A5E73' ? '#E9E9E9' : '#5A5E73';
  const k = { ...k0, c: cs }, light = c => { const n = parseInt(c.slice(1), 16); return (0.3 * (n >> 16) + 0.59 * (n >> 8 & 255) + 0.11 * (n & 255)) > 205; };
  let c = k.c[0]; if (light(c) || c === '#141414') c = k.c.find(x => !light(x) && x !== '#141414') || (light(c) ? '#E9E9E9' : '#5A5E73');
  if (other && c === other) c = k.c.find(x => x !== other && !light(x)) || (other === '#E9E9E9' ? '#5A5E73' : '#E9E9E9');
  return c;
}
function goalFx(club, name) {
  const b = document.querySelector('.board'); if (!b) return;
  const col = teamColor(club);
  b.insertAdjacentHTML('beforeend', `<div class="goalfx" style="--gc:${col}"><b>GOOOOL!</b><span>${esc(name)}</span></div>`);
  const el = b.lastElementChild; setTimeout(() => el.remove(), 2600);
}
function startLive() {
  const lm = S.lastMatch; lm.watched = true; save();
  LIVE = { min: 0, speed: 1, shown: 0, revealed: 0, done: false, hold: false };
  const evs = lm.res.ev, f = lm.f, st = lm.res.st;
  const others = (S.played[lm.k] || []).filter(m => !(m.h === f.h && m.a === f.a) && (m.comp === f.comp || ['A', 'B', 'C'].includes(m.comp) === ['A', 'B', 'C'].includes(f.comp))).slice(0, 12);
  const colH = teamColor(f.h), colA = teamColor(f.a, colH);
  let lastOoh = -9;
  if (!lm.friendly || true) SFX.ambience('calm');
  const draw = () => {
    if (!$('#lv-score')) { clearInterval(liveTimer); SFX.ambience(null); return; }
    const m = LIVE.min, frac = Math.min(1, m / 93);
    $('#lv-clock').textContent = m >= 93 ? 'Fim de jogo' : `${Math.min(90, Math.floor(m))}'`;
    $('#lv-prog').style.width = frac * 100 + '%';
    const cnt = (t, s) => evs.filter(e => (e.t === t || (t === 'yellow' && false)) && e.s === s && minOf(e.m) <= m).length;
    const bar = (lab, a, b, fmtv = x => x) => { const t = a + b || 1; return `<div class="sbar"><span class="l num">${fmtv(a)}</span><span class="b"><i style="width:${a / t * 100}%;background:${colH}"></i><i style="width:${b / t * 100}%;background:${colA}"></i></span><span class="r num">${fmtv(b)}</span></div><div class="sbl">${lab}</div>`; };
    $('#lv-stats').innerHTML = bar('Posse de bola %', st.poss[0], st.poss[1]) + bar('Finalizações', Math.round(st.shots[0] * frac), Math.round(st.shots[1] * frac)) +
      bar('No alvo', Math.round(st.sot[0] * frac), Math.round(st.sot[1] * frac)) + bar('xG', +(st.xg[0] * frac).toFixed(2), +(st.xg[1] * frac).toFixed(2), x => x.toFixed(2)) +
      bar('Faltas', Math.round(st.fouls[0] * frac), Math.round(st.fouls[1] * frac)) + bar('Cartões', Math.round(st.yc[0] * frac) + cnt('red', 'h'), Math.round(st.yc[1] * frac) + cnt('red', 'a'));
    const feed = $('#lv-feed');
    // v155: na ordem do lance (gol nos acréscimos do 1º tempo vem antes do 'Intervalo'): corta no primeiro lance que ainda não aconteceu
    const shownEvs = (() => { const k = evs.findIndex(e => minOf(e.m) > m); return k < 0 ? evs : evs.slice(0, k); })();
    while (!LIVE.hold && LIVE.shown < shownEvs.length) {
      const e = shownEvs[LIVE.shown++];
      if (!LIVE.skipping && MV.enabled() && MV.wants(e) && !((e.t === 'miss' || e.t === 'save') && minOf(e.m) - (LIVE.lastAnim ?? -99) < (e.t === 'miss' ? 7 : 3))) { LIVE.lastAnim = minOf(e.m); LIVE.hold = true; MV.play(e, f, () => { LIVE.hold = false; showEv(e); draw(); }); break; }
      showEv(e);
    }
    function showEv(e) {
      LIVE.revealed = LIVE.shown;
      if (e.t === 'sub') MV.sub(e); else if (e.t === 'reorg') MV.reorg(e); else if (e.t === 'tactic') MV.tactic(e.s, e.style, e.formation, e.xi); else if (e.t === 'ht') MV.halftime();
      const mine = (e.s === 'h') === (f.h === S.club);
      const [ei, ec] = EV_ICON[e.t] || ['ball', 'var(--muted)'];
      const tcol = e.s === 'h' ? colH : e.s === 'a' ? colA : null;
      feed.insertAdjacentHTML('afterbegin', `<div class="ev ${e.t} ${mine ? '' : 'opp'} ${tcol ? 'tc' : ''}" ${tcol ? `style="--tc:${tcol};--tt:${teamInk(tcol)}"` : ''}>${tcol ? `<span class="evc">${crest(e.s === 'h' ? f.h : f.a, 'sm')}</span>` : ''}<span class="evi" style="--ec:${ec}">${ic(ei)}</span><span class="mn">${e.m}'</span><span>${evText(e, f)}</span></div>`);
      if (e.t === 'goal') {
        const s = $('#lv-score'); s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash');
        if (!LIVE.skipping) { goalFx(e.s === 'h' ? f.h : f.a, P[e.p] ? P[e.p].short : ''); if (mine) SFX.goal(); else { SFX.oppGoal(); if (f.h === S.club) setTimeout(() => SFX.boo(0.6), 900); } }
      } else if (!LIVE.skipping) {
        const mm = minOf(e.m);
        if ((e.t === 'save' || e.t === 'miss') && mm - lastOoh >= 3) { lastOoh = mm; SFX.ooh(mine ? 0.9 : 0.5); if (e.t === 'save' && !mine) setTimeout(() => SFX.applause(0.5), 700); }
        else if (e.t === 'yellow') SFX.whistle(0.7);
        else if (e.t === 'red' || e.t === 'red2') { SFX.whistle(); setTimeout(() => (mine ? SFX.boo(0.8) : SFX.applause(0.6)), 500); }
        else if (e.t === 'ht') SFX.whistleEnd(0.8);
      }
    }
    { const ll = $('#lv-lineups'); if (ll && LIVE.llRev !== LIVE.revealed) { LIVE.llRev = LIVE.revealed; ll.innerHTML = lineupsLists(lm, shownEvs.slice(0, LIVE.revealed || 0)); } }
    let gh = 0, ga = 0; shownEvs.slice(0, LIVE.revealed || 0).forEach(e => { if (e.t === 'goal') e.s === 'h' ? gh++ : ga++; });
    $('#lv-score').textContent = `${gh}:${ga}`;
    if ($('#lv-others')) $('#lv-others').innerHTML = others.map(o => {
      const done = m >= 93; return `<div class="res"><span class="h">${esc(o.h)} ${crest(o.h, 'sm')}</span><span class="sc num">${done ? `${o.gh}–${o.ga}` : '…'}</span><span class="a">${crest(o.a, 'sm')} ${esc(o.a)}</span></div>`;
    }).join('');
    if (!LIVE.skipping && !LIVE.done) { const df = Math.abs(gh - ga); SFX.ambience(m >= 75 && df <= 1 ? 'tense' : 'calm'); }
    if (m >= 93 && !LIVE.done && !LIVE.hold && LIVE.shown >= shownEvs.length && lm.res.pens && !LIVE.penDone) {
      LIVE.penDone = true;
      const seq = !LIVE.skipping && MV.enabled() ? penSeq(lm.res.pens, `${S.seed}|${lm.season}|${lm.k}|${f.h}`) : null;
      if (seq) {
        LIVE.hold = true; SFX.whistleEnd(0.8); SFX.ambience('tense');
        let ph = 0, pa = 0; $('#lv-clock').textContent = 'Pênaltis 0–0';
        MV.shootout(seq, { ...f, pk: { h: pkOf(f.h), a: pkOf(f.a) } }, i => { const k2 = seq[i]; if (k2.r === 'goal') { k2.s === 'h' ? ph++ : pa++; } $('#lv-clock').textContent = `Pênaltis ${ph}–${pa}`;
          const mine2 = (k2.s === 'h') === (f.h === S.club); SFX[k2.r === 'goal' ? (mine2 ? 'goal' : 'ooh') : (mine2 ? 'groan' : 'applause')](0.6); },
          () => { LIVE.hold = false; LIVE.penShown = true; draw(); });
        return;
      }
    }
    if (m >= 93 && !LIVE.done && !LIVE.hold && LIVE.shown >= shownEvs.length) {
      LIVE.done = true; clearInterval(liveTimer); SFX.whistleEnd(); setTimeout(() => SFX.ambience(null), 2500);
      if (lm.res.pens) $('#lv-clock').textContent = `Fim · pênaltis ${lm.res.pens[0]}–${lm.res.pens[1]}`;
      const ttl = LIVE.skipping ? null : titleOf(lm);
      if (ttl && MV.enabled()) { MV.celebrate(ttl.club === f.h ? 'h' : 'a', ttl.label, SPR.crest(S, ttl.club), ttl.club); setTimeout(() => SFX.win(), 400); }
      else MV.end();
      $('#lv-ctrl').innerHTML = `<button class="btn sm" data-act="goto" data-v="home">Continuar ${ic('arrowR')}</button>`;
      const my = f.h === S.club ? lm.res.gh : lm.res.ga, ot = f.h === S.club ? lm.res.ga : lm.res.gh;
      let k = my > ot ? 'w' : my < ot ? 'l' : 'd';
      if (lm.res.pens) { const wonP = f.h === S.club ? lm.res.pens[0] > lm.res.pens[1] : lm.res.pens[1] > lm.res.pens[0]; k = wonP ? 'w' : 'l'; }
      $('#lv-end').innerHTML = `<div class="stack"><div class="stamp ${k}">${{ w: 'Vitória', d: 'Empate', l: 'Derrota' }[k]}${lm.res.pens ? ' nos pênaltis' : ''}</div>
        ${(S.gains || []).length ? `<div class="gains">${S.gains.map(g => `<span>${g.stars ? `${ic('star')}+${g.stars}` : ''}${g.dias ? `${gemIc()}+${g.dias}` : ''} ${esc(g.why)}</span>`).join('')}</div>` : ''}
        ${lm.res.mom ? `<div class="tile"><div class="kv"><span>Melhor em campo</span><b style="display:inline-flex;gap:6px;align-items:center">${plink(lm.res.mom, P[lm.res.mom].name)} ${rtb(lm.res.pl[lm.res.mom].rt)}</b><span>Renda da partida</span><b class="num">T$ ${fmt(S.fin.lastGate || 0)}</b></div></div>` : ''}
        <div class="tile"><div class="eyebrow">Notas do seu time</div>${Object.entries(lm.res.pl).filter(([, x]) => x.side === (f.h === S.club ? 'h' : 'a')).sort((a, b) => b[1].rt - a[1].rt).map(([id, x]) => `<div class="res" style="grid-template-columns:1fr auto auto"><span>${plink(+id, P[id].name)} <span class="muted small">${x.min}'${x.g ? ` · ${x.g} gol` : ''}${x.a ? ` · ${x.a} assist.` : ''}</span></span><span class="small muted">cond. ${Math.round(vw(+id).cond)}</span>${rtb(x.rt)}</div>`).join('')}</div>
        <div class="row"><button class="btn" style="flex:1" data-act="goto" data-v="home">Continuar</button><button class="btn alt" style="flex:1" data-act="tblgo" data-comp="${esc(f.comp || 'A')}">Tabela</button></div></div>`;
      setTimeout(() => { if ((S.gains || []).length) { SFX.star(); S.gains = []; save(); } else if (k === 'w') SFX.win(); else if (k === 'l') SFX.groan(0.6); else SFX.applause(0.5); }, 1300);
    }
  };
  LIVE.draw = draw;
  mvStart(lm, colH, colA);
  LIVE.restart = () => { clearInterval(liveTimer); liveTimer = setInterval(() => { if (LIVE.done || LIVE.hold) return; LIVE.min = Math.min(93, LIVE.min + 1); draw(); }, LIVE.speed === 1 ? 500 : 140); };
  draw(); LIVE.restart(); setTimeout(() => SFX.whistle(), 300);
}

// sequência de cobranças coerente com o placar final dos pênaltis (5 alternadas + morte súbita)
function penSeq(pens, seed) {
  const [X, Y] = pens, r = C.rng(C.hash(seed));
  for (let tries = 0; tries < 5000; tries++) {
    const seq = []; let h = 0, a = 0, hk = 0, ak = 0, done = false;
    for (let rd = 0; rd < 40 && !done; rd++) {
      for (const sd of ['h', 'a']) {
        const ok = r() < 0.76, res = ok ? 'goal' : r() < 0.6 ? 'save' : 'miss';
        seq.push({ s: sd, r: res }); if (sd === 'h') { hk++; if (ok) h++; } else { ak++; if (ok) a++; }
        if (rd < 5) { if (h + (5 - hk) < a || a + (5 - ak) < h) { done = true; break; } }
        else if (sd === 'a' && h !== a) { done = true; break; }
      }
    }
    if (h === X && a === Y) return seq;
  }
  return null;
}
// a partida assistida decidiu um título? (final de copa, Supercopa ou última rodada da liga)
function titleOf(lm) {
  const f = lm.f, cal = SE.CAL[lm.k]; if (!cal || lm.friendly || !f.comp) return null;
  const sameSeason = lm.season === S.season, post = S.post && S.post.season === lm.season;
  if (!sameSeason && !post) return null;
  const inM = c => c && (c === f.h || c === f.a) ? c : null;
  let club = null;
  if (f.comp === 'SC') club = inM(S.comp.SC && S.comp.SC.champ);
  else if (f.comp === 'CB' && cal.type === 'CB' && cal.md === 6) club = inM(S.comp.CB && S.comp.CB.champ);
  else if (['LIB', 'SUL', 'CONF', 'NE', 'SSE', 'VER'].includes(f.comp) && cal.type === 'CK' && cal.md === 3) club = inM(S.comp[f.comp] && S.comp[f.comp].champ);
  else if (['A', 'B', 'C'].includes(f.comp) && S.comp[f.comp] && cal.type === 'L' && cal.md === 38) club = inM(post ? S.post['champ' + f.comp] : SE.standings(S.comp[f.comp].table)[0].c);
  return club ? { club, label: SE.COMP_NAME[f.comp] } : null;
}

// jornais: escala a capa de 520×520 para a largura disponível
function fitPapers() { document.querySelectorAll('.ptrack').forEach(t => { const w = t.clientWidth; if (w) t.style.setProperty('--pk', (w / 520).toFixed(4)); }); }
window.addEventListener('resize', () => fitPapers());

// ---------- carrosséis: não redesenha a tela no meio de um arraste ----------
// (senão o cartão da agenda / o jornal voltava sozinho pra esquerda)
const SWIPE_SEL = '#agenda, .ptrack';
let swipeTmr = 0, touchIn = false;
function swipeRelease(delay) {
  clearTimeout(swipeTmr);
  swipeTmr = setTimeout(() => { if (touchIn) return; UI.swipe = false; if (UI.renderPending) { UI.renderPending = false; render(); } }, delay);
}
const touchOff = () => { touchIn = false; if (UI.swipe) swipeRelease(450); };
document.addEventListener('touchstart', ev => { if (ev.target.closest && ev.target.closest(SWIPE_SEL)) touchIn = true; }, { passive: true, capture: true });
document.addEventListener('touchend', touchOff, { passive: true, capture: true });
document.addEventListener('touchcancel', touchOff, { passive: true, capture: true });
document.addEventListener('pointerdown', ev => { if (ev.pointerType !== 'touch' && ev.target.closest && ev.target.closest(SWIPE_SEL)) touchIn = true; }, { passive: true, capture: true });
document.addEventListener('pointerup', ev => { if (ev.pointerType !== 'touch') touchOff(); }, { passive: true, capture: true });
// só conta como arraste quando o carrossel rola de fato (um toque simples não segura a tela)
document.addEventListener('scroll', ev => {
  const t = ev.target; if (!t || !t.matches || !t.matches(SWIPE_SEL)) return;
  UI.swipeAt = Date.now(); if (touchIn) { UI.swipe = true; clearTimeout(swipeTmr); } else if (UI.swipe) swipeRelease(350);
}, { passive: true, capture: true });

// barras de arrastar (orçamento, valores): enquanto o dedo está na barra, nada redesenha a tela
let rangeTmr = 0;
const rangeOn = ev => { const t = ev.target; if (t && t.matches && t.matches('input[type=range]')) { UI.rangeDrag = true; clearTimeout(rangeTmr); } };
const rangeOff = () => { if (!UI.rangeDrag) return; clearTimeout(rangeTmr); rangeTmr = setTimeout(() => { UI.rangeDrag = false; if (UI.renderPending) { UI.renderPending = false; render(); } }, 400); };
document.addEventListener('touchstart', rangeOn, { passive: true, capture: true });
document.addEventListener('pointerdown', rangeOn, { passive: true, capture: true });
document.addEventListener('touchend', rangeOff, { passive: true, capture: true });
document.addEventListener('touchcancel', rangeOff, { passive: true, capture: true });
document.addEventListener('pointerup', rangeOff, { passive: true, capture: true });
document.addEventListener('change', ev => { if (ev.target && ev.target.matches && ev.target.matches('input[type=range]')) rangeOff(); }, true);

// ---------- render ----------
// fechar a ficha/modal arrastando pra baixo (quando está no topo da rolagem)
(() => {
  let y0 = null, dy = 0, sh = null;
  document.addEventListener('touchstart', ev => { sh = ev.target.closest && ev.target.closest('.sheet'); if (!sh || sh.scrollTop > 2 || ev.target.closest('input,textarea,select,.brange,.nosw')) { y0 = null; return; } y0 = ev.touches[0].clientY; dy = 0; }, { passive: true });
  document.addEventListener('touchmove', ev => { if (y0 == null || !sh) return; dy = ev.touches[0].clientY - y0; if (dy > 0 && sh.scrollTop <= 0) { sh.classList.add('drag'); sh.style.transform = `translateY(${Math.min(dy, 240)}px)`; } }, { passive: true });
  document.addEventListener('touchend', () => { if (y0 == null || !sh) return; sh.classList.remove('drag'); if (dy > 110) { const x = sh.querySelector('.sheetbar .x:not(.back)'); if (x) x.click(); } else sh.style.transform = ''; y0 = null; sh = null; }, { passive: true });
})();

// ---------- painel do ADM ----------
// ---------- ADM: saúde da liga (boletim diário das 7h + verificação na hora) ----------
// auditoria financeira: alertas pra investigar (não pune ninguém)
// evidência guardada no reparo automático (estado antes da correção)
function audEv(id) {
  const e = ((S.audit && S.audit.ev) || []).find(x => x.id === id); if (!e) return '';
  if (!e.entry) {   // v193: reparo pelo recibo da compra (v190) não tem linha do histórico
    const b = e.buy || {};
    return `<details class="audev"><summary>Estado antes da correção</summary><div class="small">
      Recibo da compra: ${esc(b.from || '?')} → ${esc(b.to || '?')} · T$ ${fmt(b.fee || 0)} · salário T$ ${fmt(b.sal || 0)}/dia até ${b.ce || '—'}${b.sw != null && P[b.sw] ? ` · troca com ${esc(P[b.sw].name)}` : ''} · temporada ${b.s ?? '—'}, jogo ${b.k ?? '—'}<br>
      Dono antes do reparo: <b>${esc(e.ownBefore || '?')}</b> (a compra tinha sido desfeita sem registro no histórico)<br>
      Reparado em ${new Date(e.at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div></details>`;
  }
  const [se, k, , from, to, fee, ty, d] = e.entry, ps = e.ps || {};
  const pair = (e.pair || []).map(p => `${P[p.e[2]] ? esc(P[p.e[2]].name) : p.e[2]}: ${esc(p.e[3])} → ${esc(p.e[4])} (${esc(p.e[6])}, T$ ${fmt(p.e[5] || 0)}) · hoje no ${esc(p.own)} ${p.ok ? '✓' : '✗'}`).join('<br>');
  return `<details class="audev"><summary>Estado antes da correção</summary><div class="small">
    Registro: ${esc(from)} → ${esc(to)} · ${esc(ty)} · T$ ${fmt(fee || 0)} · temporada ${se}, jogo ${k}, dia ${d}<br>
    Dono antes do reparo: <b>${esc(e.ownBefore)}</b>${e.inFree ? ' (estava na lista de livres)' : ''} · camisa: ${e.num ? `${esc(e.num[0])} nº ${e.num[1]}` : '—'}<br>
    Contrato: salário T$ ${fmt(ps.sal || 0)}/dia até ${ps.ce || '—'} · trava até ${ps.lock || '—'}${ps.loan ? ' · tinha empréstimo' : ''}${ps.loanOut ? ' · estava emprestado' : ''}${ps.list ? ' · estava listado' : ''}<br>
    Caixa na hora: ${Object.entries(e.cash || {}).map(([c, v]) => `${esc(c)} T$ ${fmt(v)}`).join(' · ')}<br>
    ${pair ? `Mesma negociação:<br>${pair}` : 'Nenhuma outra movimentação no mesmo jogo entre esses clubes.'}
    <br>Reparado em ${new Date(e.at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div></details>`;
}
// de onde veio o caixa do clube (temporada atual): pra explicar alerta de caixa alto/crescendo
function audWhy(c) {
  const t = Wd.deskOf(S, c), dk = t && S.desks[t]; if (!dk) return '';
  const f = dk.fin || {}, pz = Object.values((dk.seasonLog && dk.seasonLog.prizes) || {}).reduce((a, b) => a + b, 0);
  const cash = S.cash[c] || 0, inc = (f.gate || 0) + (f.sold || 0) + (f.cashout || 0) + (f.loanRefundIn || 0) + pz, out = (f.spent || 0) + (f.wages || 0) + (f.release || 0) + (f.loanRefundOut || 0), start = cash - (inc - out);
  const div = Wd.divOf(S, c), L = div ? Wd.divList(S, div).map(x => S.cash[x] || 0).sort((a, b) => a - b) : [], med = L[L.length >> 1] || 0;
  const sales = (S.trlog || []).filter(e => e[0] === S.season && e[3] === c && e[5] > 0 && !['emprestimo', 'retorno'].includes(e[6])).sort((a, b) => b[5] - a[5]);
  const parts = [['Caixa no começo da temporada', start], ['Bilheteria', f.gate || 0], ['Prêmios', pz], ['Vendas de jogadores', f.sold || 0], ['Estrelas/diamantes trocados por dinheiro', f.cashout || 0], ['Reembolso de empréstimo', f.loanRefundIn || 0]].filter(x => x[1]);
  const top = parts.slice().sort((a, b) => b[1] - a[1])[0];
  const line = (l, v, neg) => `<span>${l}</span><b class="num" style="color:${neg ? 'var(--coral)' : 'var(--ink)'}">${neg ? '−' : ''}T$ ${fmt(Math.round(v))}</b>`;
  return `<details class="audev"><summary>Por quê?</summary><div class="small">
    <div class="kv" style="margin:6px 0">${parts.map(([l, v]) => line(l, v)).join('')}${f.spent ? line('Compras', f.spent, 1) : ''}${f.wages ? line('Salários', f.wages, 1) : ''}${f.release ? line('Rescisões', f.release, 1) : ''}${f.loanRefundOut ? line('Devolução de empréstimo', f.loanRefundOut, 1) : ''}${line('Caixa hoje', cash)}${med ? line(`Mediana da Série ${div}`, med) : ''}</div>
    ${top ? `Maior peso: <b>${top[0].toLowerCase()}</b> (${Math.round(top[1] / Math.max(1, start + inc) * 100)}% de tudo que entrou).` : ''}
    ${sales.length ? `<br>Maiores vendas: ${sales.slice(0, 3).map(e => `${P[e[2]] ? esc(P[e[2]].short) : 'jogador'} pro ${esc(e[4])} (T$ ${fmt(e[5])}, jogo ${e[1]})`).join(' · ')}` : ''}
    ${start > Math.max(med, 1) * 2 ? `<br>O clube já começou a temporada com caixa alto: boa parte vem de temporadas anteriores.` : ''}
    <br><span class="muted">Diferença que sobra = eventos (patrocínio, crise, multas) e ajustes do jogo.</span></div></details>`;
}
function auditTile() {
  const L = SE.auditOf ? SE.auditOf(S) : [], n = UI.audN || 12;
  const COL = { caixa: 'var(--coral)', revenda: 'var(--orange)', amigos: 'var(--pink)', idavolta: 'var(--pink)', pacote: 'var(--yellow)', rapido: 'var(--blue)', rico: 'var(--mint)', folha: 'var(--purple)' };
  const rows = L.slice(0, n).map(a => `<div class="audr"><div class="row between" style="gap:8px"><span class="audk" style="--k:${COL[a.a] || 'var(--muted)'}">${esc(a.n)}</span><span class="small muted num">${a.s} · jogo ${a.k}</span></div>
    <div class="row" style="gap:6px;margin-top:4px"><button class="audc" data-act="club" data-club="${esc(a.c)}">${crest(a.c, 'sm')} <b>${esc(a.c)}</b></button><span class="small muted">${esc(a.w || '')}</span></div>
    <p class="small" style="margin:4px 0 0">${esc(a.x)}${a.id != null && P[a.id] ? ` ${plink(a.id, 'ver jogador')}` : ''}</p>${a.a === 'reparo' ? audEv(a.id) : ['rico', 'rapido', 'folha', 'caixa'].includes(a.a) ? audWhy(a.c) : ''}</div>`).join('');
  return `<div class="tile"><div class="eyebrow">${ic('eye')} Movimentações suspeitas${L.length ? ` · ${L.length}` : ''}</div>
    <p class="small muted" style="margin:0 0 8px">O servidor confere todo dia os clubes com treinador: caixa que não fecha com as receitas e despesas, revenda com lucro alto, negócio entre treinadores fora do valor de mercado (empréstimo não conta), ida e volta, venda de jogador que veio de pacote ou de graça, caixa crescendo rápido demais, caixa muito acima da divisão e folha maior que a receita. É só alerta: ninguém é punido automaticamente.</p>
    ${rows || `<div class="note ok" style="margin:0">${ic('heart')} Nada suspeito até agora.</div>`}
    ${L.length > n ? `<button class="btn sm alt" style="margin-top:8px" data-act="audmore">Ver mais</button>` : ''}</div>`;
}
// painel do ADM é uma tela (guia fixa); se ainda estiver em modal, redesenha o modal
function admRefresh() { if (UI.modal && UI.modal.type === 'admin') { UI.modal.keep = true; renderModal(); } else render(); }
function pkOf(club) { const t = Wd.deskOf(S, club), T = t && S.desks[t] && S.desks[t].tactics; return T && T.pk != null ? T.pk : null; }
function adminModal() {
  const adm = NET.online ? NET.isAdmin() : true;
  if (!adm) return `<h2 class="sech big">${ic('lock')} Painel do ADM</h2><p class="muted">Só o administrador da liga acessa este painel.</p>`;
  const mode = SE.fireMode(S), paused = SE.paused(S);
  const opt = (k, l, d) => `<button class="tkopt ${mode === k ? 'on' : ''}" data-act="cfgfire" data-k="${k}"><div class="grow"><b>${l}</b><span class="small muted">${d}</span></div></button>`;
  // treinadores: uma lista só (clube, posição, sustentação no cargo e remover)
  const coachL = Object.entries(S.desks || {}).map(([t, d]) => {
    const on = d.club && !d.unemployed, P3 = on ? Wd.asDesk(S, t, () => SE.pillars(S)) : null, J = d.job && d.job.club === d.club ? d.job : null;
    const div = on && (Wd.divOf(S, d.club) || 'B'), tb = on && S.comp && S.comp[div] ? SE.standings(S.comp[div].table) : [], pos = on ? tb.findIndex(r => r.c === d.club) + 1 : 0;
    const isAdm = S.league && S.league.admin === t;
    const pass = NET.online && t !== S.__me && !Wd.isSolo(S) && d.manager ? (UI.admPass === t ? `<button class="btn sm" data-act="admpassok" data-t="${esc(t)}">Confirmar ADM</button><button class="btn sm alt" data-act="admpass" data-t="">×</button>` : `<button class="btn sm alt" data-act="admpass" data-t="${esc(t)}" title="Passar a administração da liga">${ic('lock')} ADM</button>`) : '';
    const kick = NET.online && t !== S.__me && !Wd.isSolo(S) ? (UI.kick === t ? `<button class="btn sm coral" data-act="kickok" data-t="${esc(t)}">Confirmar</button><button class="btn sm alt" data-act="kick" data-t="">×</button>` : `<button class="btn sm alt" data-act="kick" data-t="${esc(t)}">Remover</button>`) : '';
    const st = J && J.ult ? ['ultimato', 'var(--coral)'] : J && J.st === 'risk' ? ['balançando', 'var(--yellow)'] : ['estável', 'var(--green)'];
    // finanças: caixa, folha diária e quantos dias o caixa aguenta a folha (salário atrasa quando o caixa fica negativo)
    let fin = '';
    if (on) { const cash = S.cash[d.club] || 0, pay = Wd.payroll(S, d.club) || 1, days = Math.max(0, Math.floor(cash / pay)), ar = SE.arrearsOf(S, d.club);
      const late = (ar && ar.days > 0) || cash < 0, col = late || days < 5 ? 'var(--coral)' : days < 12 ? 'var(--yellow)' : 'var(--green)';
      fin = `<span class="admfin" style="--rc:${col}"><b class="num">T$ ${fmtK(cash)}</b><i></i>${late ? `atrasado${ar && ar.days > 0 ? ` há ${ar.days}d` : ''}` : `${days} dia${days === 1 ? "" : "s"}`}</span>`; }
    const sortD = !on ? 1e9 : (S.cash[d.club] || 0) < 0 || ((SE.arrearsOf(S, d.club) || {}).days > 0) ? -1 - ((SE.arrearsOf(S, d.club) || {}).days || 0) : Math.floor((S.cash[d.club] || 0) / (Wd.payroll(S, d.club) || 1));
    const idleH = d.seen ? (Date.now() - d.seen) / 3600e3 : null, IL = EV.idleLim(S);
    const seenTxt = d.spect ? '<span class="small muted">ADM sem time</span>' : idleH == null ? '' : `<span class="small" style="color:${idleH >= IL.wd * 24 ? 'var(--coral)' : idleH >= 24 ? 'var(--yellow)' : 'var(--muted)'}">${ic('clock')} visto ${idleH < 1 ? 'agora' : idleH < 24 ? `há ${Math.floor(idleH)}h` : `há ${Math.floor(idleH / 24)}d ${Math.floor(idleH % 24)}h`}${idleH >= IL.wd * 24 ? ` · cai com ${IL.fd} dias` : ''}</span>`;
    return { sortD, name: (d.manager || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), stab: P3 ? P3.I : 1e9, div: on ? div : null, h: `<div class="coachrow admc ${t === S.__me ? 'me' : ''}">${on ? `<button class="cavbtn" data-act="coach" data-club="${esc(d.club)}" aria-label="Ficha do treinador">${coachImg(d.avatar, d.club)}</button>` : coachImg(d.avatar, d.club)}<span class="grow"><b>${esc(d.manager)}${isAdm ? ' <span class="pill adm">ADM</span>' : ''}${t === S.__me ? ' <span class="pill">você</span>' : ''}</b>
      <span class="small muted">${on ? `${crest(d.club, 'sm')} ${esc(d.club)}${pos ? ` · ${pos}º na Série ${div}` : ''}` : d.spect ? 'administrando' : 'desempregado'}</span>${seenTxt}
      ${P3 ? `<span class="small"><span class="num muted">D ${P3.D} · T ${P3.T} · G ${P3.G} · <b>${P3.I}</b></span> · <span style="color:${st[1]}">${st[0]}</span></span>` : ''}${fin}</span><span class="stack" style="gap:4px;align-items:flex-end">${kick}${pass}</span></div>` };
  });
  // ordenação única + filtro por série (sem clube vai pro fim)
  const SORTS = { liga: ['Ordem da liga', null], az: ['A–Z', (a, b) => a.name.localeCompare(b.name)], caixa: ['Caixa ↑', (a, b) => a.sortD - b.sortD], estab: ['Estabilidade ↑', (a, b) => a.stab - b.stab] };
  const sk = SORTS[UI.admSort] ? UI.admSort : 'liga', fdv = UI.admDiv || null;
  const cntD = { A: 0, B: 0, C: 0 }; for (const x of coachL) if (x.div && cntD[x.div] != null) cntD[x.div]++;
  let CL = coachL.filter(x => !fdv || x.div === fdv); if (SORTS[sk][1]) CL = CL.slice().sort(SORTS[sk][1]);
  const coaches = CL.map(x => x.h).join('') || '<p class="muted small" style="margin:0">Ninguém nesta série.</p>';
  const sortSeg = `<div class="seg rosterf" style="margin:0 0 6px">${[[null, 'Todas', coachL.filter(x => x.div).length], ['A', 'Série A', cntD.A], ['B', 'Série B', cntD.B], ['C', 'Série C', cntD.C]].filter(([k, , n]) => !k || n).map(([k, l, n]) => `<button class="${fdv === k ? 'on' : ''}" data-act="admdiv" data-v="${k || ''}">${l} <i class="rcnt">${n}</i></button>`).join('')}</div>
    <div class="row" style="gap:8px;margin:0 0 8px;align-items:center"><span class="small muted">Ordenar:</span><select id="adm-sort" data-act="admsortsel" style="flex:1">${Object.entries(SORTS).map(([k, [l]]) => `<option value="${k}" ${sk === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`;
  // modo god: dispara na hora qualquer evento aleatório; cinza = já aconteceu nesta temporada
  const pct = p => typeof p === 'function' ? 'variável' : p == null ? 'por clube' : `${(p * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
  const god = EV.godList(S).map(e => `<button class="godb" data-act="godfire" data-k="${e.k}" ${e.done ? 'disabled' : ''}><span>${esc(e.n)}</span><small>${e.done ? 'já aconteceu' : pct(e.p)}</small></button>`).join('');
  const adv = NET.online ? `<button class="btn sm" data-act="netadvance" ${UI.advancing ? 'disabled' : ''}>${ic('arrowR')} ${UI.advancing ? 'Avançando…' : 'Avançar rodada'}</button>`
    : `<button class="btn sm" data-act="advance">${ic('arrowR')} Ir pro jogo</button><button class="btn sm" data-act="advday">${ic('clock')} +1 dia</button>`;
  return `<h1 class="disp" style="font-size:36px;margin:0">${ic('lock', '', 'color:var(--purple)')} Painel do ADM</h1>
    <div class="tile"><div class="eyebrow">Liga</div><div class="kv"><span>Código</span><b>${esc(NET.code || '—')}</b><span>Modo</span><b>${SE.isTurbo(S) ? 'Turbo' : 'Normal'}</b><span>Temporada</span><b>${S.season} · jogo ${Math.min(SE.SLOTS, S.slot)}/${SE.SLOTS}</b></div></div>
    ${auditTile()}
    <div class="tile"><div class="eyebrow">Treineiros</div><p class="small muted" style="margin:0 0 8px">${ic('lock')} ADM passa a administração pra outro treineiro. Se você ficar ${EV.idleLim(S).fd} dias sem entrar, ela passa sozinha pro treineiro mais antigo em atividade.</p>${sortSeg}<div class="stack" style="gap:6px">${coaches}</div>
      ${NET.online ? `<p class="small muted" style="margin:8px 0 0">D diretoria · T torcida · G grupo · em negrito, a sustentação no cargo.</p>` : ''}</div>
    ${vagaTile()}
    <div class="tile"><div class="eyebrow">${ic('chat')} Grupo da liga no WhatsApp</div><p class="small muted" style="margin:0 0 8px">Link que aparece pros treinadores no topo da tela do clube. Deixe vazio pra não mostrar nada. Só links do WhatsApp (chat.whatsapp.com ou wa.me).</p>
      <div class="row" style="gap:8px"><input type="url" id="lg-wa" placeholder="https://chat.whatsapp.com/..." value="${esc((S.league && S.league.wa) || '')}" style="flex:1;min-width:0"><button class="btn sm" data-act="lgwa">Salvar</button></div></div>
    ${UI.ownerOK ? `<div class="tile"><div class="eyebrow">${ic('bolt')} Modo god · eventos aleatórios</div><p class="small muted" style="margin:0 0 8px">Só pro dono do jogo. Toque pra disparar agora, num clube de treinador ativo (casos graves só com jogadores fictícios). Cinza = já aconteceu nesta temporada. O % é a chance normal por dia do jogo.</p>
      <div class="godg">${god}</div></div>` : `<details class="tile godlock"><summary class="small muted">${ic('lock')} Modo god (só o dono do jogo)</summary><div class="row" style="gap:8px;margin-top:8px"><input type="password" id="own-key" placeholder="Senha do painel do dono" autocomplete="off" style="flex:1;min-width:0"><button class="btn sm" data-act="ownerunlock">Liberar</button></div></details>`}
    <div class="tile"><div class="eyebrow">Ferramentas</div><div class="row wrap" style="gap:8px">${adv}
      <button class="btn sm alt" data-act="modal" data-m="pause">${ic('clock')} ${paused ? 'Pausa' : 'Pausar liga'}</button>
      <button class="btn sm alt" data-act="goto" data-v="comps" data-sub="A">${ic('lock')} Anular rodada (na tabela)</button>
      ${/teste|localhost|127\.0\.0\.1/.test(location.hostname) ? `<button class="btn sm alt" data-act="awprev">${ic('trophy')} Prévia da premiação (teste)</button>` : ''}
      ${!S.spect && NET.online && UI.ownerOK ? `<button class="btn sm ${UI.specArm ? 'coral' : 'alt'}" data-act="becomespect">${ic('user')} ${UI.specArm ? 'Confirmar: deixar o clube' : 'Ficar só como ADM (sem time)'}</button>` : ''}
</div>${paused ? `<p class="small muted" style="margin:8px 0 0">Liga pausada · volta ${fmtReal(S.pause.until).toLowerCase()}</p>` : ''}<p class="small muted" style="margin:8px 0 0">A anulação aparece no card da última rodada, em Torneios → Série A.${UI.ownerOK ? ' "Ficar só como ADM" deixa seu clube com vaga aberta e você segue administrando sem time.' : ''}</p></div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="godfire"]'); if (!el || el.disabled || !UI.ownerOK) return;
  ev.stopImmediatePropagation();
  const k = el.dataset.k, seed = Date.now(); let res = null; el.disabled = true;
  const done = () => { toast(res ? res.msg : 'Não foi possível disparar agora'); admRefresh(); };
  if (NET.online) NET.sync({ mutate: () => { if (NET.isAdmin()) res = EV.godFire(S, k, seed); } }).then(done, done);
  else { res = EV.godFire(S, k, seed); save(); done(); }
}, true);
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="cfgfire"],[data-act="plogt"]'); if (!el) return;
  ev.stopImmediatePropagation();
  if (el.dataset.act === 'plogt') { UI.plogOpen = !UI.plogOpen; render(); return; }
  const k = el.dataset.k, set = () => { S.cfg = { ...(S.cfg || {}), fire: k }; EV.news(S, { t: 'club', title: `ADM define demissões: ${{ off: 'desligadas', soft: 'modo brando', real: 'modo realista' }[k]}`, body: 'Regra da liga atualizada no painel do administrador.', minor: true }); };
  if (NET.online) NET.sync({ mutate: () => { if (NET.isAdmin()) set(); } }).then(() => { toast('Regra salva'); admRefresh(); });
  else { set(); save(); admRefresh(); }
}, true);

function viewErr(where, e) {
  try { console.error('[tela]', where, e); const k = 'tr_viewerr_' + where; if (!sessionStorage.getItem(k)) { sessionStorage.setItem(k, '1'); NET.bugSend && NET.bugSend(`[automático] erro ao abrir "${where}" (v${NET.build || ''}): ${String(e && e.message || e).slice(0, 200)} | ${String(e && e.stack || '').replace(/https?:\/\/[^\s)]+/g, '').slice(0, 900)}`, '').catch(() => {}); } } catch (e2) {}
}
function render() {
  try { const nx = S && S.club && !S.unemployed ? SE.nextFixtureOf(S, S.club) : null; Wd.setGrp(nx && !nx.pending ? Wd.grpOf(nx.comp) : null); } catch (e) {}
  if (UI.rangeDrag && UI.view === UI.lastView) { UI.renderPending = true; clearTimeout(rangeTmr); rangeTmr = setTimeout(() => { UI.rangeDrag = false; if (UI.renderPending) { UI.renderPending = false; render(); } }, 4000); return; }
  if (UI.swipe && UI.view === UI.lastView && !UI.modal && Date.now() - (UI.swipeAt || 0) < 4000) { UI.renderPending = true; swipeRelease(900); return; }
  UI.swipe = false; UI.renderPending = false;
  // guarda a posição dos carrosséis antes de redesenhar (o evento de scroll chega atrasado)
  try {
    const ag = document.getElementById('agenda');
    if (ag && ag.clientWidth && !UI.agJump) { const s = ag.children[Math.round(ag.scrollLeft / ag.clientWidth)]; if (s && s.dataset.key) { UI.agKey = s.dataset.key; UI.agSeenCur = UI.agCurKey; } }
    const pt = document.querySelector('.ptrack'); if (pt && pt.clientWidth) UI.paperI = Math.round(pt.scrollLeft / pt.clientWidth);
  } catch (e) {}
  // v203: as abas de cima (Mercado tem 9) voltavam pro começo a cada toque e a aba escolhida sumia da tela (#107)
  try { UI.segPos = UI.segPos || {}; document.querySelectorAll('.seg[data-seg]').forEach(e => { UI.segPos[e.dataset.seg] = e.scrollLeft; }); } catch (e) {}
  if (UI.view === 'news' && UI.lastView !== 'news') { try { paperRotate(); } catch (e) {} }
  UI.lastView = UI.view;
  clearInterval(liveTimer);
  if (UI.view !== 'live') SFX.ambience(null);
  const app = $('#app');
  if (S && S.spect && ['squad', 'market', 'dm', 'live'].includes(UI.view)) UI.view = 'home';   // ADM sem time: só clube, torneios e notícias
  try { document.body.classList.toggle('spect', !!(S && S.spect)); } catch (e) {}
  const inGame = S && S.desks && S.desks[S.__me] && !['landing', 'pick', 'live', 'creator', 'draw', 'chat'].includes(UI.view);
  try { NET.chat && NET.chat.focus && NET.chat.focus(UI.view === 'chat'); } catch (e) {}   // v266: fora da Zona mista o chat consulta menos
  $('#nav').hidden = !inGame;
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === UI.view));
  if (inGame) { const bd = $('#nav-badge'); bd.hidden = !S.offers.length; bd.textContent = S.offers.length; }
  try {
  if (UI.view === 'creator') app.innerHTML = vCreator();
  else if (UI.view === 'draw') app.innerHTML = vDraw();
  else if (UI.view === 'landing' || !S || !S.desks || !S.desks[S.__me]) { UI.view = 'landing'; app.innerHTML = vLanding(); }
  else if (UI.view === 'home') { app.innerHTML = vHome(); agendaMount(); }
  else if (UI.view === 'squad') app.innerHTML = vSquad();
  else if (UI.view === 'market') { app.innerHTML = vMarket(); renderMarketList(); }
  else if (UI.view === 'comps') app.innerHTML = vComps();
  else if (UI.view === 'news') app.innerHTML = vNews();
  else if (UI.view === 'dm' && (markSeen('dmSeen', dmSig()), true)) app.innerHTML = `${topbar()}<div class="stack"><div class="row between"><h1 class="disp" style="font-size:36px;margin:0">${ic('med', '', 'color:var(--coral)')} DM</h1><span class="small muted">Departamento médico</span></div>${dmView()}</div>`;
  else if (UI.view === 'admin') app.innerHTML = `${topbar()}<div class="stack">${adminModal()}</div>`;
  else if (UI.view === 'club') app.innerHTML = vClub();
  else if (UI.view === 'career') app.innerHTML = `${topbar()}<div class="stack careerv">${careerModal(UI.career || {})}</div>`;   // v264
  else if (UI.view === 'chat') { app.innerHTML = vChat(); setTimeout(chatScrolled, 0); }   // v262
  else if (UI.view === 'live') { app.innerHTML = vLive(); startLive(); }
  } catch (e) {   // v163: uma tela com erro não pode travar o jogo (antes o botão parecia morto)
    viewErr(UI.view + (UI.sub && UI.sub[UI.view] ? '/' + UI.sub[UI.view] : ''), e);
    try { app.innerHTML = `${S && S.desks && S.desks[S.__me] ? topbar() : ''}<div class="stack"><div class="note">Essa tela não abriu por um erro. Já enviamos o aviso pra correção. Tente outra aba.</div><button class="btn" data-act="goto" data-v="home">Voltar ao início</button></div>`; } catch (e2) {}
  }
  try { if (UI.view === 'landing' || UI.view === 'home') app.insertAdjacentHTML('beforeend', `<button class="appfoot" data-act="vertap">Treineiros ${NET.APP_VER || ''} · novidades</button>`); } catch (e) {}   // v167: versão discreta no rodapé (5 toques: área do dono)
  try { document.querySelectorAll('.seg[data-seg]').forEach(e => { const p = (UI.segPos || {})[e.dataset.seg], on = e.querySelector('.on');
    if (p != null) e.scrollLeft = p;
    if (on && (on.offsetLeft < e.scrollLeft || on.offsetLeft + on.offsetWidth > e.scrollLeft + e.clientWidth)) e.scrollLeft = Math.max(0, on.offsetLeft - 16); }); } catch (e) {}
  renderModal();
  tickClock();
  applyAlerts();
  if (inGame) setTimeout(() => { try { primCheck(); } catch (e) {} }, 1500);
  try { profUpdate(); } catch (e) {}
  setTimeout(() => { try { accEnsure().then(() => setTimeout(() => { try { accRemind(); } catch (e) {} }, 2500)); } catch (e) {} }, 0);
  fitPapers();
}
function tickClock() {
  if (!S) return;
  const c = $('#clock'); if (c) c.textContent = when(tNow());
  document.querySelectorAll('.cdown[data-t]').forEach(el => {
    let d = Math.max(0, SE.toReal(S, +el.dataset.t) - Date.now());
    const D = Math.floor(d / 86400000); d -= D * 86400000; const H = Math.floor(d / 3600000); d -= H * 3600000; const M = Math.floor(d / 60000), Sx = Math.floor((d - M * 60000) / 1000), p2 = n => String(n).padStart(2, '0');
    el.textContent = D ? `${D}d ${p2(H)}h ${p2(M)}min` : `${p2(H)}:${p2(M)}:${p2(Sx)}`;
  });
  const cd = $('#countdown');
  if (cd) {
    let d = Math.max(0, SE.toReal(S, +cd.dataset.t) - Date.now());
    const D = Math.floor(d / 86400000); d -= D * 86400000; const H = Math.floor(d / 3600000); d -= H * 3600000; const M = Math.floor(d / 60000); const Sx = Math.floor((d - M * 60000) / 1000);
    const p2 = n => String(n).padStart(2, '0');
    cd.innerHTML = `${D ? `<div><b>${D}</b><span>dias</span></div><i>:</i>` : ''}<div><b>${p2(H)}</b><span>horas</span></div><i>:</i><div><b>${p2(M)}</b><span>min</span></div><i>:</i><div><b>${p2(Sx)}</b><span>seg</span></div>`;
    // zerou: escurece a tela, processa a rodada e abre o jogo
    if (+cd.dataset.t <= tNow() && !UI.kickoff && UI.view === 'home') {
      UI.kickoff = { t: +cd.dataset.t, at: Date.now() };
      kickoffOverlay(true);
      if (NET.online) NET.sync(); else setTimeout(() => tick(), 60);
    }
  }
  if (UI.kickoff) { if (!autoLive() && Date.now() - UI.kickoff.at > 30000) { UI.kickoff = null; kickoffOverlay(false); } }
  else if (UI.view !== 'live') autoLive();
}
// ---------- apito inicial: fade pro jogo ao vivo ----------
function kickoffOverlay(on) {
  const o = $('#kickoff');
  if (!on) { if (o && !o.classList.contains('out')) { o.classList.add('out'); setTimeout(() => o.remove(), 450); } return; }
  if (o) { o.classList.remove('out'); return; }
  document.body.insertAdjacentHTML('beforeend', `<div id="kickoff" class="kickoff"><div class="ko-in">${ic('whistle')}<b>Bola rolando</b><span class="dots3"><i></i><i></i><i></i></span></div></div>`);
}
function freshMatch() {
  const lm = S && S.lastMatch;
  if (!lm || lm.watched || lm.season !== S.season) return null;
  // amistosos (pré-temporada) também abrem ao vivo: usam o horário do próprio jogo
  const t = lm.friendly ? lm.t : lm.k == null ? null : SE.slotTime(S, lm.k);
  if (t == null) return null;
  return Date.now() - SE.toReal(S, t) < 6 * 60000 ? lm : null;
}
function autoLive() {
  if (!S || !S.desks || !S.desks[S.__me] || ['live', 'draw', 'creator', 'landing'].includes(UI.view)) return false;
  const ae = document.activeElement; if (!UI.kickoff && ae && ae.matches && ae.matches('input[type=text],textarea')) return false;
  const lm = freshMatch(); if (!lm) return false;
  const key = `${lm.season}-${lm.k}-${lm.friendly ? lm.t : ''}`; if (UI.autoOpened === key) return false;
  UI.autoOpened = key; UI.kickoff = null;
  kickoffOverlay(true);
  setTimeout(() => { UI.modal = null; UI.view = 'live'; render(); pageTo(0); setTimeout(() => kickoffOverlay(false), 250); }, 700);
  return true;
}
function tick() {
  if (!S || UI.view === 'live' || NET.online || !S.desks[S.__me]) return;
  const out = SE.process(S);
  if (out.slots.length) { save(); if (!UI.modal) render(); if (out.userMatch && !autoLive()) toast('Seu jogo terminou. Veja em Clube › Último jogo.'); }
}

// ---------- ações ----------
// v284: ação de mercado só com o mundo fresco (NET.fresh): se o aparelho está desatualizado, baixa antes e executa em cima do mundo atual
function gate(fn) {
  if (!NET.online || !NET.code || !NET.fresh) { fn(); return; }
  if (UI.gateBusy) { toast('Atualizando a liga…'); return; }
  UI.gateBusy = true; const t0 = Date.now(); const tm = setTimeout(() => toast('Atualizando a liga…'), 400);
  NET.fresh(fn).then(r => { clearTimeout(tm); UI.gateBusy = false; if (r && r.err) { toast(r.err, true); render(); } }).catch(() => { clearTimeout(tm); UI.gateBusy = false; });
}
function busy(fn) { const b = document.createElement('div'); b.className = 'busy'; b.textContent = 'Processando…'; document.body.appendChild(b); setTimeout(() => { try { fn(); } finally { b.remove(); } }, 30); }
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  const act = el.dataset.act, m = UI.modal;
  if (act === 'bg' && ev.target !== el) return;
  const id = el.dataset.id ? +el.dataset.id : null;
  if (['bg', 'close'].includes(act)) SFX.close(); else if (act === 'modal' || act === 'player' || act === 'teamtalk') SFX.open(); else if (['goto', 'sub', 'ptab', 'newsf', 'mkscope', 'mkset', 'years', 'more'].includes(act)) SFX.navTick(); else if (act !== 'sound' && act !== 'aset' && act !== 'atest') SFX.tap();
  switch (act) {
    case 'quickrenew': ev.stopPropagation(); openPlayer(id, 'renew'); break;
    case 'cshare': { const of = S.offers.find(o => o.k === UI.counter.k); UI.counter.sh = Math.max(of.share, Math.min(100, UI.counter.sh + 10 * +el.dataset.d)); UI.modal ? (UI.modal.keep = true, renderModal()) : render(); break; }
    case 'counter': { const of = S.offers.find(o => o.k === +el.dataset.k); UI.counter = { k: of.k, v: Math.round(of.fee * (of.loanOf ? 1 : 1.2) / 1000) * 1000, sh: of.loanOf ? Math.min(100, of.share + 10) : null }; UI.modal ? (UI.modal.keep = true, renderModal()) : render(); break; }
    case 'cstep': { const of = S.offers.find(o => o.k === UI.counter.k); const st = vw(of.id).mv >= 50000 ? 5000 : 1000; UI.counter.v = Math.max(1000, UI.counter.v + st * +el.dataset.d); UI.modal ? (UI.modal.keep = true, renderModal()) : render(); break; }
    case 'cclose': UI.counter = null; UI.modal ? (UI.modal.keep = true, renderModal()) : render(); break;
    case 'csend': { const of0 = S.offers.find(o => o.k === +el.dataset.k), r = MK.counterOffer(S, +el.dataset.k, UI.counter.v, of0 && of0.loanOf && !of0.human ? UI.counter.sh : null); save(); if (r.status === 'accept' || r.status === 'gone' || r.status === 'sent') { UI.counter = null; toast(r.msg, r.status === 'gone'); } else UI.counter.msg = r.msg; if (r.status === 'accept') SFX.coin(); UI.modal ? (UI.modal.keep = true, renderModal()) : render(); break; }
    case 's2d': { const r = MK.starsToDia(S); save(); toast(r.msg, !r.ok); if (r.ok) SFX.star(); render(); break; }
    case 'audmore': { UI.audN = (UI.audN || 12) + 20; admRefresh(); break; }
    case 'calllist': { const L = (S.selecao || []).filter(c => c.season === S.season); const c = L[L.length - 1] || (S.selecao || []).slice(-1)[0]; if (c) { UI.modal = { type: 'callup', key: c.key, v: 'liga' }; renderModal(); } break; }
    case 'callseen': { S.flags = S.flags || {}; S.flags.callSeen = el.dataset.k; save(); render(); break; }
    case 'ouroseen': { S.flags = S.flags || {}; S.flags.ouroInfo = 1; save(); render(); break; }
    case 'cashout': { const r = MK.cashOut(S, el.dataset.k, +el.dataset.n); save(); toast(r.msg, !r.ok); if (r.ok) SFX.coin(); render(); break; }
    case 'frinvite': { const r = SE.inviteFriendly(S, el.dataset.club); save(); toast(r.msg, !r.ok); UI.modal.keep = true; renderModal(); break; }
    case 'frno': { SE.declineFriendly(S, el.dataset.club); save(); UI.modal.keep = true; renderModal(); break; }
    case 'frplay': busy(() => { const r = SE.playFriendly(S, el.dataset.club); if (!r.ok) { toast(r.msg, true); return; } save(); UI.modal = null; UI.view = 'live'; render(); pageTo(0); }); break;
    case 'askbudget': { const r = SE.askBudget(S); save(); toast(r.msg, !r.ok); if (r.ok) SFX.coin(); render(); if (UI.modal) { UI.modal.keep = true; renderModal(); } break; }
    case 'betsv': { UI.betsV = el.dataset.v; render(); break; }
    case 'bet': { const nb = nextBetSlot(); if (!nb) break; const key = `${S.season}-${nb.k}`; S.bets[key] = S.bets[key] || { games: nb.games, picks: {}, md: SE.CAL[nb.k].md }; S.bets[key].picks[+el.dataset.i] = el.dataset.v; save(); render(); break; }
    case 'newgame': UI.coachEdit = false; UI.coach = null; coachDraft(); go('creator'); break;
    case 'continue': go('home'); break;
    case 'pick': UI.pick = el.dataset.club; render(); break;
    case 'start': busy(() => {
      const name = (UI.mgr || '').trim() || 'Treineiro';
      Wd.resetCache();
      S = Wd.newGame({ manager: name, club: UI.pick, now: Date.now() });
      SE.setupSeason(S); S.lastT = S.seasonStart;
      EV.news(S, { t: 'club', title: `${name} assume o ${UI.pick}`, body: `Temporada ${S.season} começa ${when(SE.slotTime(S, 0))}. Monte o time em Elenco › Escalação.`, clubs: [UI.pick] });
      SE.process(S);
      save(); UI.view = 'home'; render(); pageTo(0);
    }); break;
    case 'goto': UI.view = el.dataset.v; if (el.dataset.sub) UI.sub[el.dataset.v === 'squad' ? 'squad' : el.dataset.v === 'market' ? 'market' : 'comps'] = el.dataset.sub; UI.modal = null; render(); pageTo(0); break;
    case 'sub': { UI.sub[el.dataset.key] = el.dataset.k; const y = pageY(), top = (el.closest('.seg') || el).getBoundingClientRect().top + y - 70; if (y > top) pageTo(Math.max(0, top)); render(); break; }
    case 'advance': busy(() => {
      const nx = SE.nextFixtureOf(S, S.club);
      const k = nx ? nx.k : S.slot;
      const target = SE.slotTime(S, Math.min(k, SE.SLOTS - 1)) + 60000;
      if (target > tNow()) S.off += target - tNow();
      const out = SE.process(S); save();
      if (out.userMatch && S.lastMatch && !S.lastMatch.watched) { UI.view = 'live'; }
      render(); pageTo(0);
    }); break;
    case 'advday': busy(() => { S.off += 86400000; SE.process(S); save(); render(); }); break;
    case 'watch': UI.modal = null; UI.view = 'live'; render(); pageTo(0); break;
    case 'speed': LIVE.speed = LIVE.speed === 1 ? 3 : 1; MV.setSpeed(LIVE.speed); el.textContent = LIVE.speed + '×'; el.classList.toggle('on', LIVE.speed === 3); LIVE.restart(); break;
    case 'skip': LIVE.skipping = true; LIVE.min = 93; if (LIVE.hold) MV.finish(); else LIVE.draw(); break;
    case 'player': openPlayer(id); break;
    case 'hnow': UI.hnow = { at: Date.now(), list: SE.health(S) }; admRefresh(); break;
    case 'sqst': UI.sqst = el.dataset.k; render(); break;
    case 'tblgo': { const c = el.dataset.comp; UI.view = 'comps'; UI.modal = null;
      if (['LIB', 'SUL', 'CONF', 'PL', 'INT'].includes(c)) { UI.sub.comps = 'C'; UI.cont = c; } else if (['NE', 'SSE', 'VER'].includes(c)) { UI.sub.comps = 'R'; UI.rcup = c; }
      else UI.sub.comps = c === 'C' ? 'L3' : ['A', 'B', 'CB'].includes(c) ? c : 'A';   // v173: Série C tem a aba L3
      render(); pageTo(0); break; }
    case 'selo': { const d = C.SELOS.find(x => x.k === el.dataset.k); if (d) toast(`${d.label}: ${d.desc}`); break; }
    case 'qmark': toast(el.dataset.t); break;
    case 'ptopen': openPlayer(id, 'ptrain'); break;
    case 'offwithdraw': {   // v160: retira a proposta enviada a outro técnico
      const pid = +el.dataset.id, o = el.dataset.o, me = S.club;
      try { Wd.asClub(S, o, () => { if (S.offers) S.offers = S.offers.filter(x => !(x.id === pid && x.club === me && x.human)); }); } catch (e) {}
      save(); toast(`Proposta por ${P[pid] ? P[pid].short : 'jogador'} retirada.`); render(); break; }
    case 'numedit': m.numEdit = !m.numEdit; m.keep = true; renderModal(); break;
    case 'numsave': {
      const n = Math.round(+(($('#num-in') || {}).value || 0)), pid = +el.dataset.id;
      if (!(n >= 1 && n <= 99)) { toast('Use um número de 1 a 99.', true); break; }
      const club = S.club, old = Wd.shirt(S, pid); S.nums = S.nums || {};
      const other = Wd.squad(S, club).find(x => x !== pid && Wd.shirt(S, x) === n);
      S.nums[pid] = [club, n];
      if (other != null) { if (old != null) S.nums[other] = [club, old]; else delete S.nums[other]; }
      save(); m.numEdit = false; m.keep = true; renderModal(); toast(other != null ? `${P[pid].short} agora é o ${n}; ${P[other].short} ficou com ${old ?? 'outro número'}.` : `${P[pid].short} agora veste a ${n}.`); break; }
    case 'rompgo': { const r = TRAIN.rompStart(S, +el.dataset.id); if (r.ok) save(); toast(r.msg, !r.ok); render(); break; }
    case 'ptlist': { UI.ptList = !UI.ptList; const y = typeof pageY === 'function' ? pageY() : 0; render(); if (typeof pageTo === 'function') pageTo(y); break; }
    case 'pflip': { m.flip = !m.flip; el.classList.toggle('fl', m.flip); const h = document.querySelector('.pfhint'); if (h) h.innerHTML = `${ic('renew')} Toque pra ver ${m.flip ? 'a frente' : 'os números'}`; try { SFX.flip(); } catch (e) {} break; }
    case 'buyopt': { const r = MK.buyOption(S, +el.dataset.id); if (r.ok) save(); toast(r.msg, !r.ok); m.keep = true; renderModal(); break; }
    case 'recallloan': { const r = MK.recallLoan(S, +el.dataset.id, +el.dataset.refund); if (r.ok) { save(); UI.modal = null; toast(r.msg); render(); } else { m.confirm = null; m.msg = r.msg; m.msgK = 'bad'; m.keep = true; renderModal(); } break; }
    case 'ptab': m.tab = el.dataset.k; m.msg = null; m.confirm = null; renderModal(); break;
    case 'ptpos': m.ptpos = el.dataset.k; m.keep = true; renderModal(); break;
    case 'ptgo': { const r = TRAIN.ptStart(S, +el.dataset.id, el.dataset.k, m.ptpos || TRAIN.ptPositions(S, +el.dataset.id)[0]); if (r.ok) { save(); toast(r.msg); m.msg = null; } else m.msg = r.msg; m.keep = true; renderModal(); break; }
    case 'confirm': if (!m && UI.view === 'career') { UI.career = { ...(UI.career || {}), confirm: el.dataset.k }; render(); break; } m.confirm = el.dataset.k; m.keep = true; renderModal(); break;
    case 'unconfirm': if (!m && UI.view === 'career') { UI.career = { ...(UI.career || {}), confirm: null }; render(); break; } m.confirm = null; m.keep = true; renderModal(); break;
    case 'years': m.years = +el.dataset.y; m.keep = true; renderModal(); break;
    case 'talk': {
      const s = Wd.ps(S, id), t = TALKS[+el.dataset.i], d = t.f(s);
      s.mor = C.clamp(s.mor + d, 0, 100); S.talks[id] = S.lastDay;
      if (t.name === 'Cobrar' || t.name === 'Ameaçar banco') EV.news(S, { t: 'press', self: true, title: `${S.manager} ${t.name === 'Cobrar' ? 'cobra' : 'ameaça tirar do time'} ${P[id].short}`, body: d > 0 ? `Conversa dura, mas ${P[id].short} reagiu bem e promete dar a resposta em campo.` : `A cobrança vazou e não caiu bem: ${P[id].short} saiu irritado do CT.`, ids: [id], clubs: [S.club], front: d > 0 ? 62 : 76 });
      save();
      m.msg = d > 0 ? `${P[id].short} respondeu bem (+${d} de moral).` : d < 0 ? `${P[id].short} não gostou (${d} de moral).` : 'Sem efeito.'; m.msgK = d > 0 ? 'ok' : d < 0 ? 'bad' : ''; m.keep = true; renderModal(); break;
    }
    case 'renew': { const r = MK.renew(S, id, m.years || 2); m.msg = r.msg; m.msgK = r.ok ? 'ok' : 'bad'; save(); m.keep = true; renderModal(); break; }
    case 'release': gate(() => { const r = MK.release(S, id); save(); if (r.ok) { UI.modal = null; toast(r.msg); render(); } else { m.msg = r.msg; m.msgK = 'bad'; renderModal(); } }); break;
    case 'promote': if (TRAIN.promote(S, S.club, id)) { save(); toast(`${P[id].short} sobe pro profissional`); UI.modal = null; render(); } break;
    case 'negstart': {
      const k = el.dataset.k, s = vw(m.id);
      if (k === 'fee') { const n = MK.negState(S, m.id); m.neg = n && n.fee != null ? { step: 'contract', kind: 'fee', fee: n.fee, swap: n.swap != null ? n.swap : null, sal: MK.salaryDemand(S, m.id, S.club), years: 3 } : { step: 'fee', fee: Math.round(s.mv / 1000) * 1000 }; }
      else m.neg = { step: 'contract', kind: k, fee: 0, sal: MK.salaryDemand(S, m.id, S.club), years: k === 'pre' ? 2 : 3 };
      m.keep = true; renderModal(); break;
    }
    case 'nstep': { const s = vw(m.id), step = s.mv >= 50000 ? 5000 : s.mv >= 10000 ? 1000 : 500; m.neg.fee = Math.max(0, m.neg.fee + step * +el.dataset.d); m.keep = true; renderModal(); break; }
    case 'negdrop': { const r = MK.negDrop(S, +el.dataset.id); save(); toast(r.msg, !r.ok); render(); break; }   // v242
    case 'negbid': gate(() => { const r = MK.bid(S, m.id, m.neg.fee, m.neg.swap); m.neg.res = r; m.neg.sent = m.neg.fee; save(); if (r.status === 'accept') m.neg = { step: 'contract', kind: 'fee', fee: m.neg.fee, swap: m.neg.swap != null ? m.neg.swap : null, sal: MK.salaryDemand(S, m.id, S.club), years: 3, res: { status: 'accept', msg: r.msg } }; m.keep = true; renderModal(); }); break;
    case 'negcounter': gate(() => { m.neg.fee = m.neg.res.ask; const r = MK.bid(S, m.id, m.neg.fee, m.neg.swap); save(); if (r.status === 'accept') m.neg = { step: 'contract', kind: 'fee', fee: m.neg.fee, swap: m.neg.swap != null ? m.neg.swap : null, sal: MK.salaryDemand(S, m.id, S.club), years: 3, res: { status: 'accept', msg: r.msg } }; m.keep = true; renderModal(); }); break;
    case 'sstep': { const cur = m.neg.sal, d = +el.dataset.d, st = cur >= 1000 ? 50 : cur >= 100 ? 10 : 5; m.neg.sal = Math.max(10, cur < 100 && cur + st * d >= 100 ? 100 : cur + st * d); m.keep = true; renderModal(); break; }
    case 'listing': { const on = MK.setListing(S, +el.dataset.id, el.dataset.k, el.dataset.len); if (on && on.blocked) { toast(on.blocked, true); break; } save(); toast(el.dataset.k === 'list' ? (on ? 'Na lista de transferências' : 'Fora da lista') : (on ? 'Disponível para empréstimo' : 'Empréstimo cancelado')); m.keep = true; renderModal(); break; }
    case 'crdnav': { const d = +el.dataset.d, kk = el.dataset.key; UI.crd = UI.crd || {}; if (d === 0) delete UI.crd[kk]; else UI.crd[kk] = (UI.crd[kk] || 0) + d; render(); break; }
    case 'rdnav': { const d = +el.dataset.d, dv = el.dataset.div; UI.rd = UI.rd || {}; if (d === 0) delete UI.rd[dv]; else UI.rd[dv] = (UI.rd[dv] || 0) + d; render(); break; }
    case 'negquit': {   // v155: desistir também retira a proposta que estava com o técnico da liga
      const o = Wd.ownerOf(S, m.id), me = S.club;
      if (Wd.isHuman(S, o)) { try { Wd.asClub(S, o, () => { if (S.offers) S.offers = S.offers.filter(x => !(x.id === m.id && x.club === me && x.human && !x.loanOf)); }); save(); } catch (e) {} }
      else if (S.negs && S.negs[m.id]) { MK.negDrop(S, m.id); save(); }   // v242: desistir apaga o acordo de taxa com a IA (antes ficava "acordo fechado" ao reabrir — Habnner)
      m.neg = null; m.negQuit = true; m.keep = false; renderModal(); break; }
    case 'nyears': m.neg.years = +el.dataset.y; m.keep = true; renderModal(); break;
    case 'salcounter': m.neg.sal = m.neg.res.demand; // cai no negsign
    // falls through
    case 'negsign': gate(() => {
      // v186: acordo com o clube sumiu do estado (falha de conexão no meio do envio): refaz a proposta aceita, em silêncio
      if (m.neg.kind === 'fee' && !(MK.negState(S, m.id) || {}).fee && m.neg.fee != null && own(m.id) !== 'Livre' && !Wd.isHuman(S, own(m.id))) {
        const rb = MK.bid(S, m.id, m.neg.fee, m.neg.swap);
        if (rb.status !== 'accept') { m.neg = { step: 'fee', fee: m.neg.fee, swap: m.neg.swap, res: { status: 'reject', msg: `O acordo com o ${own(m.id)} não foi salvo e o clube mudou de ideia: ${rb.msg || 'refaça a proposta.'}` } }; save(); m.keep = true; renderModal(); return; }
      }
      const r = MK.contract(S, m.id, m.neg.sal, m.neg.years, { pre: m.neg.kind === 'pre' }); m.neg.res = r; save(); if (r.status === 'accept') { UI.modal = null; toast(r.pending ? r.msg : m.neg.kind === 'pre' ? 'Pré-contrato assinado!' : `${P[m.id].short} contratado!`); render(); } else { m.keep = true; renderModal(); } }); break;
    case 'offerok': gate(() => { const of = MK.acceptOffer(S, +el.dataset.k); if (of && of.err) toast(of.err, true); else if (of) toast(of.pending ? `Acordo fechado · ${P[of.id].short} sai na próxima janela` : of.loan ? `${P[of.id].short} emprestado · + T$ ${fmt(of.fee)}` : `${P[of.id].short} vendido · + T$ ${fmt(of.fee)}`); save(); UI.modal = null; render(); }); break;
    case 'offerno': MK.declineOffer(S, +el.dataset.k); save(); toast('Proposta recusada'); UI.modal = null; render(); break;
    case 'raiseok': { const r = S.flags.raise; Wd.ps(S, r.id).sal = r.sal; Wd.ps(S, r.id).mor = C.clamp(Wd.ps(S, r.id).mor + 10, 0, 100); EV.news(S, { t: 'club', title: `${P[r.id].short} ganha aumento`, body: `Novo salário: T$ ${fmt(r.sal)}/dia.`, ids: [r.id], clubs: [S.club] }); S.flags.raise = null; save(); render(); break; }
    case 'raiseno': { const r = S.flags.raise; Wd.ps(S, r.id).mor = C.clamp(Wd.ps(S, r.id).mor - 12, 0, 100); EV.news(S, { t: 'club', title: `${S.club} nega aumento a ${P[r.id].short}`, body: `O jogador ficou insatisfeito. A proposta do ${r.abroad.club} segue em Mercado › Propostas.`, ids: [r.id], clubs: [S.club] }); S.flags.raise = null; save(); render(); break; }
    case 'packopen': {
      const key = `${S.lastDay}-${el.dataset.l}`;
      UI.opened = UI.opened || {}; UI.opened[key] = true; UI.flip = key; SFX.pack(); render();
      const cards = [...document.querySelectorAll('.pk.closed')];
      requestAnimationFrame(() => setTimeout(() => { cards.forEach((c, i) => { c.classList.remove('closed'); c.classList.add('reveal'); setTimeout(() => { SFX.flip(); if (i === cards.length - 1) { SFX.vibrate(40); if ((S.packs.list[+el.dataset.l] || {}).cat === 'dia') SFX.dia(); } }, 700 + i * 220); }); UI.flip = null; }, 250));
      break;
    }
    case 'packtake': gate(() => { const r = MK.takePack(S, +el.dataset.l, +el.dataset.o); save(); toast(r.msg || 'Feito', !r.ok); if (r.ok) { const pk = S.packs.list[+el.dataset.l]; pk && (pk.cat === 'dia' || pk.cat === 'oe') ? (SFX.dia(), SFX.vibrate([60, 40, 120])) : SFX.success(); } render(); }); break;
    case 'packskip': MK.skipPack(S, +el.dataset.l); save(); toast('Dinheiro poupado'); render(); break;
    case 'sqset': UI.sq.setor = el.dataset.k; render(); break;
    case 'sqexp': UI.sq.exp = !UI.sq.exp; render(); break;
    case 'form': {   // v155: troca o esquema mantendo os mesmos 11 (cada um vai pra posição que mais combina no novo desenho)
      const cur = SE.userTeam(S).xi.filter(x => x != null), slots = C.FORMATIONS[el.dataset.f];
      const val = (id, sl) => vw(id).ovr * Wd.fitOf(S, id, sl);
      const order = slots.map((sl, i) => [i, sl[0], cur.filter(id => Wd.fitOf(S, id, sl[0]) >= 0.95).length]).sort((a, b) => (a[1] === 'GOL' ? -1 : b[1] === 'GOL' ? 1 : a[2] - b[2]));
      const left = new Set(cur), xi = new Array(slots.length).fill(null);
      for (const [i, sl] of order) { let best = null, bv = -1; for (const id of left) { const v = val(id, sl); if (v > bv) { bv = v; best = id; } } if (best != null) { xi[i] = best; left.delete(best); } }
      S.tactics.formation = el.dataset.f; S.tactics.xi = xi; save(); render(); toast(`Esquema ${el.dataset.f} com os mesmos titulares`); break; }
    case 'style': S.tactics.style = el.dataset.k; save(); render(); break;
    case 'autoxi': S.tactics.xi = SE.pickXI(S, mySquad().filter(x => SE.lineupAvail(S, x)), S.tactics.formation); delete S.tactics.bench; save(); toast('Time e banco escalados poupando os cansados'); render(); break;   // v155: banco completo também
    case 'slot': UI.slot = +el.dataset.i; UI.modal = { type: 'slot', i: +el.dataset.i }; renderModal(); break;
    case 'assign': { const xi = SE.userTeam(S).xi, i = m.i, cur = xi.indexOf(id); if (cur >= 0) xi[cur] = xi[i]; xi[i] = id; S.tactics.xi = xi; save(); UI.modal = null; UI.slot = null; render(); break; }
    case 'training': S.training = el.dataset.k; save(); render(); break;
    case 'mkscope': UI.mk.scope = el.dataset.k; UI.mk.n = 40; render(); break;
    case 'mkset': UI.mk.setor = el.dataset.k; UI.mk.n = 40; render(); break;
    case 'more': UI.mk.n += 40; renderMarketList(); break;
    case 'region': UI.mk.region = el.dataset.k; render(); break;
    case 'cont': UI.cont = el.dataset.k; render(); break;
    case 'rcup': UI.rcup = el.dataset.k; render(); break;
    case 'newsf': UI.news = el.dataset.k; render(); break;
    case 'balopen': UI.modal = { type: 'balanco', s: +el.dataset.s || null }; renderModal(); break;
    case 'modal': if (el.dataset.m === 'career') { UI.modal = null; UI.career = {}; UI.view = 'career'; render(); try { window.scrollTo(0, 0); } catch (e) {} break; }   // v264: Carreira é tela fixa, não caixa
      if (el.dataset.m === 'admin') { UI.modal = null; UI.view = 'admin'; render(); try { window.scrollTo(0, 0); } catch (e) {} break; } UI.modal = { type: el.dataset.m }; renderModal(); break;
    case 'admdiv': UI.admDiv = el.dataset.v || null; admRefresh(); break;
    case 'teamtalk': UI.modal = { type: 'teamtalk' }; renderModal(); break;
    case 'dotalk': {
      const nx = SE.nextFixtureOf(S, S.club); if (!nx || nx.pending) break;
      const H = SE.teamFor(S, nx.h), A = SE.teamFor(S, nx.a), pv = SIM.preview(H, A, x => SE.info(S, x), !!nx.neutral);
      const fav = nx.h === S.club ? pv.pw : pv.pl, d = TEAM_TALKS[+el.dataset.i].f(fav, (S.streak || {})[S.club] || '');
      for (const x of SE.userTeam(S).xi) if (x) Wd.ps(S, x).mor = C.clamp(Wd.ps(S, x).mor + d, 0, 100);
      S.teamTalk = `${S.season}-${nx.k}`;
      const tt = TEAM_TALKS[+el.dataset.i];
      if (tt.name === 'Cobrar postura') EV.news(S, { t: 'press', self: true, title: `${S.manager} cobra o elenco do ${S.club} antes de pegar o ${nx.h === S.club ? nx.a : nx.h}`, body: d > 0 ? 'O grupo respondeu: treino intenso e clima de decisão.' : 'Jogadores não gostaram do tom e o vestiário ficou pesado.', clubs: [S.club], front: d > 0 ? 64 : 77 });
      save(); UI.modal = null; toast(d > 0 ? `O grupo respondeu bem (+${d} de moral nos titulares)` : `Não caiu bem (${d} de moral)`, d < 0); render(); break;
    }
    case 'kitpat': m.sel = { ...(m.sel || S.kits[S.club] || { pat: Wd.clubInfo(S.club).pat, swap: false }), pat: el.dataset.k }; m.keep = true; renderModal(); break;
    case 'kitswap': { const c = m.sel || S.kits[S.club] || { pat: Wd.clubInfo(S.club).pat, swap: false }; m.sel = { ...c, swap: !c.swap }; m.keep = true; renderModal(); break; }
    case 'kitsave': {
      const prev = JSON.stringify(S.kits[S.club] || null), nw = m.sel || S.kits[S.club];
      S.kits[S.club] = nw;
      if (nw && JSON.stringify(nw) !== prev) {
        const PAT = { solid: 'lisa', vstripes: 'listrada', hoops: 'com listras horizontais', hoops3: 'tricolor em listras', band: 'com faixa no peito', sash: 'com faixa diagonal', halves: 'meio a meio' };
        const r = C.R('kit' + S.club + (S.lastDay || 0) + nw.pat), pat = PAT[nw.pat] || 'nova';
        const T = [`${S.club} lança novo uniforme`, `Camisa nova: ${S.club} muda o visual`, `${S.club} apresenta a nova camisa`, `Novo manto do ${S.club} é revelado`];
        EV.news(S, { t: 'club', tag: 'kit', title: pk(T, r), body: `A nova camisa é ${pat}${nw.swap ? ', com as cores invertidas' : ''}. O uniforme estreia no próximo jogo, e a torcida já corre para as lojas.`, clubs: [S.club], front: 92 });
      }
      save(); UI.modal = null; toast('Uniforme salvo'); render(); break;
    }
    case 'resign': EV.resign(S); save(); UI.modal = null; UI.view = 'home'; render(); break;
    case 'takejob': EV.takeJob(S, el.dataset.club); save(); UI.view = 'home'; render(); break;
    case 'jobask': UI.jobAsk = el.dataset.club; render(); break;
    case 'jobno': if (UI.jobAsk === el.dataset.club) { UI.jobAsk = null; } else { S.jobOffers = (S.jobOffers || []).filter(o => o.club !== el.dataset.club); save(); } render(); break;
    case 'joboffer': { UI.jobAsk = null; const r = EV.acceptOffer(S, el.dataset.club); save(); toast(r.msg, !r.ok); UI.view = 'home'; render(); break; }
    case 'presssend': pressSend(); break;
    case 'mention': { const ta = $('#press-q'); const v = el.dataset.v; const txt = ta.value.replace(/@([^\s@]*)$/, v.includes(' ') ? `@[${v}] ` : `@${v} `); m.draft = txt; m.ment = null; renderModal(); const t2 = $('#press-q'); t2.focus(); t2.setSelectionRange(t2.value.length, t2.value.length); break; }
    case 'reset': UI.modal = { type: 'reset' }; renderModal(); break;
    case 'doreset': if (NET.online) break; try { localStorage.removeItem(KEY); } catch (e) {} S = null; UI.modal = null; UI.view = 'landing'; render(); break;
    case 'close': case 'bg': UI.modal = m && m.back && el.classList.contains('back') ? (m.back.keep = false, m.back) : null; UI.slot = null; renderModal(); if ((UI.view === 'squad' || UI.view === 'market') && !UI.modal) render(); break;
  }
});
$('#nav').addEventListener('click', ev => { const b = ev.target.closest('button[data-tab]'); if (!b) return; UI.view = b.dataset.tab; UI.modal = null; pageTo(0); render(); pageTo(0); });
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'mk-q') { UI.mk.q = t.value; UI.mk.n = 40; renderMarketList(); }
  if (t.id === 'mgr') UI.mgr = t.value;
  if (t.id === 'fr-q') { UI.modal.q = t.value; UI.modal.keep = true; renderModal(); const f = $('#fr-q'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
  if (t.dataset.budget) {
    const b0 = MK.budget(S); const v = Math.max(b0.pay, +t.value); S.wageBudget = v;
    const b = MK.budget(S), full = +t.max || 1, box = t.closest('.bbar');
    box.querySelector('.sal').style.width = Math.min(100, b.wage / full * 100) + '%'; box.querySelector('.buy').style.width = (100 - Math.min(100, b.wage / full * 100)) + '%';
    { const bw = box.querySelector('[data-bw]'); bw.textContent = `T$ ${fmt(bw.hasAttribute('data-room') ? b.wageRoom : b.wage)}/dia`; } box.querySelector('[data-bt]').textContent = `T$ ${fmtK(b.transfer)}`;
    if (+t.value < b0.pay) t.value = b0.pay;
    clearTimeout(UI.bSaveT); UI.bSaveT = setTimeout(() => save(), 350);
  }
  if (t.id === 'neg-range') { UI.modal.neg.fee = +t.value; const b = t.closest('.neg').querySelector('.v'); b.querySelector('b').textContent = `T$ ${fmt(+t.value)}`; b.querySelector('span').textContent = `${Math.round(+t.value / vw(UI.modal.id).mv * 100)}% do valor de mercado`; }
  if (t.id === 'sal-range') { UI.modal.neg.sal = +t.value; t.closest('.neg').querySelector('.v b').textContent = `T$ ${fmt(+t.value)}`; }
  if (t.id === 'press-q') { UI.modal.draft = t.value; const mm = t.value.match(/@([^\s@]{1,20})$/); const prev = UI.modal.ment; UI.modal.ment = mm ? mm[1] : null; if ((prev || null) !== (UI.modal.ment || null)) { renderModal(); const t2 = $('#press-q'); t2.focus(); t2.setSelectionRange(t2.value.length, t2.value.length); } }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.id === 'mk-sort') { UI.mk.sort = t.value; renderMarketList(); }
  if (t.id === 'mk-stat') { UI.mk.stat = t.value; UI.mk.n = 40; if (UI.modal && UI.modal.type === 'mkfilt') mkCount(); else render(); }
  if (t.id === 'sq-sort') { UI.sq.sort = t.value; render(); }
  if (t.dataset.budget) { S.wageBudget = Math.max(MK.budget(S).pay, +t.value); MK.budget(S); save(); if (UI.modal) { UI.modal.keep = true; renderModal(); } }
  if (t.id === 'neg-range' || t.id === 'sal-range') { UI.modal.keep = true; renderModal(); }
  if (t.dataset.trig !== undefined) { S.tactics.triggers[t.dataset.trig] = t.value; save(); toast('Instrução salva'); }
});

// ---------- boot ----------
function bootLocal(data) {
  let s = (data && data.S) || load();
  if (s && (s.v === 3 || s.v === 4)) {
    S = Wd.migrate3(s); if (!S.__me) S.__me = Object.keys(S.desks)[0] || 'local'; Wd.restoreYouth(S); Wd.touch(S);
    S.stars ??= 20; S.dias ??= 1; S.bets ??= {}; S.ws ??= 0; S.fws ??= 0;
    if (!S.obj) SE.setObjectives(S);
    if (!S.balGiven) SE.balanceWallet(S);
    if (S.packs && S.packs.list && S.packs.list.every(p => p.taken == null) && S.packs.list.some(p => (p.opts || []).some(o => MK.humanClub(S, Wd.ownerOf(S, o.id)) || (o.cat === 'dia' && !o.deal)))) MK.dailyPack(S, S.lastDay);
    if (S.packs && S.packs.list && S.packs.list.some(p => p.cat === 'mix')) MK.dailyPack(S, S.lastDay);
    if (S.packs && S.packs.list && S.packs.list.some(p => typeof p.cat === 'number')) MK.dailyPack(S, S.lastDay);
    for (const id of S.free) if (P[id] && Wd.ownerOf(S, id) === 'Livre') { /* ok */ }
    SE.process(S); save();
    UI.view = data && data.UI ? data.UI.view : 'home';
    if (UI.view === 'live' || UI.view === 'pick') UI.view = 'home';
    if (data && data.UI) Object.assign(UI, { sub: data.UI.sub || {}, mk: data.UI.mk || UI.mk });
  } else UI.view = 'landing';
  UI.view = 'landing';
  render();
}
function boot(data) {
  UI.view = 'landing';
  render();
  NET.init().then(r => {
    if (!r.online) bootLocal(data);
    if (r.invite) UI.invite = r.invite;
    render();
  });
  clearInterval(clockTimer); clockTimer = setInterval(() => { tickClock(); }, 1000);
  setInterval(tick, 30000);
  setInterval(() => {
    if (!S || NET.online || !S.desks[S.__me]) return;
    const a = SE.resolveInvites(S), b = EV.flush(S);
    if (a || b) { save(); if (UI.modal && UI.modal.type === 'friendly') { UI.modal.keep = true; renderModal(); if (a) SFX.coin(); } else if (b && UI.view === 'news' && !UI.modal) render(); if (b) toast('Nova notícia: resposta na imprensa'); }
  }, 3000);
  (async () => { try { SAMPLE = window.claude && window.claude.use ? await window.claude.use('sample') : null; } catch (e) { SAMPLE = null; } if (UI.modal && UI.modal.type === 'press') renderModal(); })();
}
try { window.claude?.hot?.snapshot?.(() => ({ S, UI: { view: UI.view, sub: UI.sub, mk: UI.mk } })); } catch (e) {}
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
// trava zoom por gesto (pinça) e duplo toque, como app
document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
let _lastTouch = 0;
document.addEventListener('touchend', e => { const n = Date.now(); if (n - _lastTouch < 300 && !e.target.closest('input,textarea,select')) e.preventDefault(); _lastTouch = n; }, { passive: false });

// v184: direito à ajuda de emergência (ANRESF)
function helpNote() {
  if (!S.club || !SE.helpCheck) return '';
  const h = SE.helpCheck(S, S.club), A = Wd.divOf(S, S.club) === 'A', what = A ? 'adiantamento das cotas de TV' : 'antecipação da cota da CBF';
  if (h.ok) return `<div class="note small">${ic('handshake')} <b>Socorro disponível</b>: se o caixa ficar negativo, o clube tem direito a ${what}. Perde o direito quem comprar mais do que vender na temporada ou aumentar a folha em mais de 10% (regra da ANRESF).</div>`;
  return `<div class="note mid small">${ic('wallet')} <b>Sem direito a socorro</b>: o clube ${esc(h.why)}. Se o caixa ficar negativo, os salários atrasam. Vender jogadores ou reduzir a folha devolve o direito.</div>`;
}
function balancoModal(m) {
  const L = S.balancos || [], B = L.find(x => x.s === m.s) || L[0];
  if (!B) return `<h2 class="sech big">${ic('cash')} Balanço</h2><p class="muted">O balanço sai no fim da temporada.</p>`;
  const row = (l, v, col) => `<div class="fline nb"><span>${esc(l)}</span><b class="num" style="color:${col}">${v < 0 ? '−' : '+'} T$ ${fmt(Math.abs(v))}</b></div>`;
  const inT = B.cr.reduce((a, x) => a + x[1], 0) + (B.other > 0 ? B.other : 0), outT = B.db.reduce((a, x) => a + x[1], 0) + (B.other < 0 ? -B.other : 0), res = inT - outT;
  const oth = B.other ? row(B.other > 0 ? 'Outras receitas (patrocínio, diretoria, eventos)' : 'Outras despesas (multas, eventos, dívidas)', B.other, B.other > 0 ? 'var(--green)' : 'var(--coral)') : '';
  return `<h2 class="sech big">${ic('cash')} Balanço ${B.s}</h2>
    <p class="small muted" style="margin:0">${crest(B.club, 'sm')} ${esc(B.club)}${B.cash0 != null ? ` · caixa no início T$ ${fmt(B.cash0)}` : ''} · no fim T$ ${fmt(B.cash1)}</p>
    <div class="eyebrow" style="margin-top:8px">Receitas</div>
    <div class="tile tight">${B.cr.map(x => row(x[0], x[1], 'var(--green)')).join('')}${B.other > 0 ? oth : ''}<div class="fline nb"><span><b>Total</b></span><b class="num" style="color:var(--green)">+ T$ ${fmt(inT)}</b></div></div>
    <div class="eyebrow">Despesas</div>
    <div class="tile tight">${B.db.map(x => row(x[0], -x[1], 'var(--coral)')).join('')}${B.other < 0 ? oth : ''}<div class="fline nb"><span><b>Total</b></span><b class="num" style="color:var(--coral)">− T$ ${fmt(outT)}</b></div></div>
    <div class="bigcash"><span>${res >= 0 ? 'Superávit' : 'Déficit'}</span><b class="num" style="color:${res >= 0 ? 'var(--green)' : 'var(--coral)'}">${res < 0 ? '−' : '+'} T$ ${fmt(Math.abs(res))}</b></div>
    ${B.tips.length ? `<div class="note small">${B.tips.map(esc).join('<br>')}</div>` : ''}
    ${B.cash0 == null ? '<p class="small muted">Balanço parcial: o clube começou a ser acompanhado no meio da temporada.</p>' : ''}
    ${L.length > 1 ? `<div class="row" style="gap:6px;flex-wrap:wrap">${L.map(x => `<button class="btn sm ${x.s === B.s ? '' : 'alt'}" data-act="balopen" data-s="${x.s}">${x.s}</button>`).join('')}</div>` : ''}`;
}
// salários atrasados: aviso com gravidade
function arrearsNote() {
  const ar = SE.arrearsOf(S, S.club);
  if (ar && ar.days > 0) {
    const lvl = ar.days >= 6 ? 'Crise grave: jogadores podem rescindir na Justiça.' : ar.days >= 4 ? 'Jogadores pedindo pra sair e recusando renovação.' : ar.days >= 2 ? 'Moral do elenco em queda; líderes vão cobrar a diretoria.' : 'O elenco já percebeu o atraso.';
    return `<div class="note bad">${ic('wallet')} <b>Salários atrasados há ${ar.days} dia(s)</b> · dívida T$ ${fmt(ar.owed)}. ${lvl} Venda jogadores ou reduza a folha pra voltar a pagar em dia.</div>`;
  }
  if (ar && ar.rep >= 6) return `<div class="note mid">${ic('wallet')} Fama de mau pagador: reforços ficam mais difíceis por um tempo.</div>`;
  const tv = (S.tvAdv || {})[S.club];   // v183: adiantamento das cotas de TV (Série A)
  if (tv > 0) return `<div class="note mid">${ic('wallet')} <b>Dívida com a TV: T$ ${fmt(tv)}</b> (cotas adiantadas quando o caixa ficou negativo). Sai do caixa na virada da temporada, sem deixar o clube com menos de 14 dias de folha.</div>`;
  return '';
}

// ===== UI parte 4: entrada, criação do treinador, sorteio do clube e liga online =====
const COACH_LS = 'treineiros:coach';
const rnd = n => Math.floor(Math.random() * n);
function randomAvatar() {
  const A = SPR.COACH;
  return { skin: rnd(A.skin.length), hairC: rnd(5), hair: Object.keys(A.hair)[rnd(Object.keys(A.hair).length)], beard: Object.keys(A.beard)[rnd(Object.keys(A.beard).length)], outfit: Object.keys(A.outfit)[rnd(Object.keys(A.outfit).length)], glasses: Math.random() < 0.25 ? 'sim' : 'nao' };
}
function coachDraft() {
  if (!UI.coach) {
    let d = null; try { d = JSON.parse(localStorage.getItem(COACH_LS)); } catch (e) {}
    UI.coach = d && d.avatar ? d : { name: '', style: 'equilibrado', avatar: randomAvatar() };
  }
  return UI.coach;
}
function saveDraft() { try { localStorage.setItem(COACH_LS, JSON.stringify(UI.coach)); } catch (e) {} }
const coachImg = (av, club, cls = '') => `<img class="px cav ${cls}" src="${SPR.coach(av, club, { S })}" alt="">`;

// ---------- troca de tela (sem fade: mais estável no celular) ----------
function go(view, after) {
  UI.view = view; UI.modal = null;
  if (after) after();
  try { render(); } catch (e) { console.error(e); showFatal(e); }
  pageTo(0);
  if (view === 'draw') startDraw();
}
function showFatal(e) { const app = $('#app'); app.insertAdjacentHTML('afterbegin', `<div class="note bad" style="margin:12px">Algo deu errado nesta tela (${esc(e && e.message || e)}). <button class="btn sm" data-act="tolanding">Voltar ao início</button></div>`); }

// ---------- tela inicial: botões conforme o estado da liga ----------
function leagueRoster(small) {
  if (!S || !S.desks) return '';
  const act = Object.entries(S.desks).filter(([, d]) => !d.unemployed && d.club);
  const cnt = { A: 0, B: 0, C: 0 }; for (const [, d] of act) { const dv = Wd.divOf(S, d.club); if (cnt[dv] != null) cnt[dv]++; }
  const fdv = small ? null : UI.rosterDiv || null;
  const filt = small ? '' : `<div class="seg rosterf" style="margin:8px 0 0">${[[null, 'Todas', act.length], ['A', 'Série A', cnt.A], ['B', 'Série B', cnt.B], ['C', 'Série C', cnt.C]].filter(([k, , n]) => !k || n).map(([k, l, n]) => `<button class="${fdv === k ? 'on' : ''}" data-act="rosterdiv" data-v="${k || ''}">${l} <i class="rcnt">${n}</i></button>`).join('')}</div>`;
  const rows = act.filter(([, d]) => !fdv || Wd.divOf(S, d.club) === fdv).map(([t, d]) => {
    const div = (Wd.divOf(S, d.club) || 'B'), tb = S.comp && S.comp[div] ? SE.standings(S.comp[div].table) : [];
    const pos = tb.findIndex(r => r.c === d.club) + 1;
    const adm = S.league && S.league.admin === t;
    const kick = NET.online && NET.isAdmin() && t !== S.__me && !small && !Wd.isSolo(S) ? (UI.kick === t ? `<button class="btn sm coral" data-act="kickok" data-t="${esc(t)}">Confirmar</button><button class="btn sm alt" data-act="kick" data-t="">×</button>` : `<button class="btn sm alt" data-act="kick" data-t="${esc(t)}">Remover</button>`) : '';
    const idleH = d.seen ? (Date.now() - d.seen) / 3600e3 : null, IL = EV.idleLim(S);   // v213: "visto há", como no painel do ADM
    const seen = t === S.__me || idleH == null ? '' : `<span class="seenl" style="color:${idleH < 1 ? 'var(--green)' : idleH >= IL.wd * 24 ? 'var(--coral)' : idleH >= 24 ? 'var(--yellow)' : 'var(--muted)'}">${idleH < 1 ? '<i class="ondot"></i>online agora' : `${ic('clock')} visto ${idleH < 24 ? `há ${Math.floor(idleH)}h` : `há ${Math.floor(idleH / 24)}d ${Math.floor(idleH % 24)}h`}`}</span>`;
    return `<div class="coachrow ${t === S.__me ? 'me' : ''}" role="button" tabindex="0" data-act="coach" data-club="${esc(d.club)}" style="cursor:pointer">${coachImg(d.avatar, d.club)}<span class="grow"><b>${esc(d.manager)}${adm ? ' <span class="pill adm">ADM</span>' : ''}${t === S.__me ? ' <span class="pill">você</span>' : ''}</b><span class="small muted">${crest(d.club, 'sm')} ${esc(d.club)}${pos ? ` · ${pos}º na Série ${div}` : ''}</span>${seen}</span>${kick}</div>`;
  }).join('');
  if (!act.length) return '';
  const head = S.league ? `<div class="row between"><div class="eyebrow" style="margin:0">${SE.isTurbo(S) ? `<span class="turbob sm">${ic('bolt')}</span>` : ic('trophy')} ${esc(S.league.name)} · ${SE.isTurbo(S) ? 'Turbo 7 dias' : 'Normal 28 dias'}${Wd.isSolo(S) ? ' · Solo/Close Friends <small class="betatag">em teste</small>' : ''} · ${Object.keys(S.desks).length}${Wd.isSolo(S) ? `/${Wd.SOLO_MAX}` : ''} treineiro(s)</div>${NET.online && !small ? `<button class="btn sm" data-act="invite">${ic('user')} ${Wd.isSolo(S) ? 'Chamar amigos' : 'Convidar'}</button>` : ''}</div>` : `<div class="eyebrow">${ic('user')} Treineiros da liga</div>`;
  return `<div class="tile ${small ? '' : 'full'}">${head}${filt}<div class="stack" style="gap:8px;margin-top:8px">${rows || '<p class="muted small" style="margin:0">Ninguém nesta série.</p>'}</div></div>`;
}
// v185: criação de liga em passos: 1 duração · 2 modo (Online / Single Player) · 3 divisões e clubes (só Online) · 4 resumo
function createWizard(L, err) {
  const st = L.step || 1, solo = L.kind === 'solo', turbo = L.lmode === 'turbo', divs = L.divs || ['A', 'B', 'C'];
  const steps = solo ? ['Duração', 'Modo', 'Resumo'] : ['Duração', 'Modo', 'Divisões', 'Resumo'], idx = solo && st === 4 ? 3 : st;
  const head = `<div class="eyebrow">${ic('trophy')} Nova liga · passo ${idx} de ${steps.length}</div>
    <div class="wizdots">${steps.map((n, i) => `<span class="${i + 1 < idx ? 'done' : i + 1 === idx ? 'on' : ''}"><i></i>${n}</span>`).join('')}</div>`;
  const nav = (next, label) => `<div class="row">${next ? `<button class="btn big" style="flex:1" data-act="lgstep" data-v="${next}">${label || 'Continuar'} ${ic('arrowR')}</button>` : ''}<button class="btn alt" data-act="${st === 1 ? 'lgback' : 'lgstep'}" data-v="${st === 4 && solo ? 2 : st - 1}">Voltar</button></div>`;
  let body = '';
  if (st === 1) body = `<div class="eyebrow" style="margin-top:4px">Duração da temporada</div>
      <div class="artpick">
        <button class="artcard ${L.lmode && !turbo ? 'on' : ''}" data-act="lgmodepick" data-v="normal"><span class="art art-normal" role="img" aria-label="Modo Normal"></span><span class="t"><b>Normal · 28 dias</b>2 jogos por dia, às 12h e 18h. Ritmo de quem joga um pouco todo dia: mercado, lesões e contratos na escala de um mês.</span></button>
        <button class="artcard turbo ${turbo ? 'on' : ''}" data-act="lgmodepick" data-v="turbo"><span class="art art-turbo" role="img" aria-label="Modo Turbo"></span><span class="t"><b>Turbo · 7 dias</b>8 jogos por dia, das 8h às 23h30. Tudo comprimido na mesma proporção: 1 dia do jogo dura 6 horas reais.</span></button>
      </div>${nav(L.lmode ? 2 : null)}`;
  else if (st === 2) body = `<div class="eyebrow" style="margin-top:4px">Modo de jogo</div>
      <div class="modepick">
        <button class="modecard ${L.kind === 'online' ? 'on' : ''}" data-act="lgkind" data-v="online"><b class="disp">${ic('user')} ONLINE</b><span>Liga aberta pra quem tiver o código: até 20 treinadores por divisão aberta. A liga anda no relógio e os jogos acontecem no horário. Só o ADM adianta rodadas, pelo painel.</span></button>
        <button class="modecard ${solo ? 'on' : ''}" data-act="lgkind" data-v="solo"><b class="disp">${ic('star')} SOLO/CLOSE FRIENDS <small class="betatag">em teste</small></b><span>Sozinho ou com até 3 amigos (4 treinadores no total). Escolha qualquer um dos 60 clubes. O relógio também anda sozinho, mas o card do clube tem o botão de avançar até o próximo jogo (com amigos, vale quando todos confirmam).</span></button>
      </div>${nav(L.kind ? (solo ? 4 : 3) : null)}`;
  else if (st === 3) body = `<div class="eyebrow" style="margin-top:4px">Divisões com treinadores</div>
      <div class="divpick">${['A', 'B', 'C'].map(k => `<button class="${divs.includes(k) ? 'on' : ''}" data-act="lgdiv" data-v="${k}"><b class="disp">SÉRIE ${k}</b><span>${k === 'A' ? 'elite' : k === 'B' ? 'acesso' : 'Ouro e raiz'}</span></button>`).join('')}</div>
      <p class="muted small" style="margin:0">Até ${20 * divs.length} treinadores. As outras divisões seguem disputadas pelos clubes da IA (acesso e rebaixamento valem pra todos).</p>
      <div class="eyebrow" style="margin-top:4px">Como cada treinador pega o clube</div>
      <div class="modepick">
        <button class="modecard ${L.pick !== 'choice' ? 'on' : ''}" data-act="lgpick" data-v="draw"><b class="disp">SORTEIO</b><span>A roleta escolhe o clube. Começa pela divisão mais alta aberta, entre os 4 elencos mais fortes.</span></button>
        <button class="modecard ${L.pick === 'choice' ? 'on' : ''}" data-act="lgpick" data-v="choice"><b class="disp">ESCOLHA</b><span>Cada treinador escolhe o clube livre que quiser, nas divisões abertas.</span></button>
      </div>${nav(4)}`;
  else {
    const li = (k, v) => `<div class="fline nb"><span class="muted">${k}</span><b>${v}</b></div>`;
    body = `<label class="eyebrow" for="lg-name" style="margin-top:4px">Nome da liga</label><input type="text" id="lg-name" maxlength="30" placeholder="Ex.: Liga da Firma" value="${esc(L.name || '')}" autocomplete="off">
      <div class="tile tight">${li('Duração', turbo ? 'Turbo · 7 dias' : 'Normal · 28 dias')}${li('Modo', solo ? `Solo/Close Friends (até ${Wd.SOLO_MAX}) <small class="betatag">em teste</small>` : 'Online')}${solo ? li('Clube', 'você escolhe entre os 60') : li('Divisões', divs.map(d => 'Série ' + d).join(', ')) + li('Clubes', L.pick === 'choice' ? 'escolha' : 'sorteio')}</div>
      ${UI.ownerOK && !solo ? `<label class="row" style="gap:8px;cursor:pointer"><input type="checkbox" id="lg-spect" ${L.spect ? 'checked' : ''} style="width:20px;height:20px"> <span><b>Só vou administrar</b> <span class="muted small">(dono do jogo: entro sem time)</span></span></label>` : ''}
      <p class="muted small" style="margin:0">${solo ? 'Modo novo, ainda em teste: se algo estranho acontecer, avise pelo botão de bug (🐞) no topo. Depois você cria o treinador e escolhe o clube. Pra chamar amigos, use Convidar na tela do clube.' : 'Você vai ser o ADM. Depois é só mandar o código (ou o link) pros amigos.'}</p>${err}
      <div class="row"><button class="btn big" style="flex:1" data-act="lgcreate">Criar liga</button><button class="btn alt" data-act="lgstep" data-v="${solo ? 2 : 3}">Voltar</button></div>`;
  }
  return `<div class="tile lobby">${head}${body}${st < 4 ? err : ''}</div>`;
}
function landingCTA() {
  if (!NET.ready) return `<button class="btn big" disabled>Conectando…</button>`;
  if (!NET.online) return S ? `<button class="btn big" data-act="continue">Continuar · ${esc(S.unemployed ? 'sem clube' : S.club)}, temporada ${S.season}</button><button class="btn big alt" data-act="newgame">Novo jogo</button>`
    : `<button class="btn big" data-act="newgame">Começar a jogar</button>`;
  const L = UI.lobby = UI.lobby || { mode: 'menu' };
  const err = L.err ? `<div class="note bad">${esc(L.err)}</div>${/versão antiga|Atualize o app/.test(L.err) ? `<button class="btn alt" data-act="reloadapp">Recarregar o app</button>` : ''}` : '';
  if (L.busy) return `<div class="tile lobby"><p style="margin:0">${esc(L.busy)}</p></div>`;
  if (L.mode === 'create') return createWizard(L, err);
  if (L.mode === 'claim' && S) {
    const full = Wd.leagueFull(S), nC = Wd.coachCount(S), cap = Wd.leagueCap(S);
    return `<div class="tile lobby"><div class="eyebrow">${ic('lock')} Já é técnico nesta liga?</div>
      <p class="muted small" style="margin:0">Para entrar com um treinador que já existe, digite o <b>código de acesso</b> dele. O dono encontra o código em Carreira, no aparelho em que joga; o ADM também pode gerar um novo. Recebeu um <b>código de vaga</b> do ADM? É aqui também.</p>
      <label class="eyebrow" for="acc-code">Código de acesso ou de vaga</label><input type="text" id="acc-code" maxlength="9" placeholder="XXXX-XXXX" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:.12em;font-weight:800">
      ${L.err ? `<div class="note bad">${esc(L.err)}</div>` : ''}
      <button class="btn big" data-act="acclogin">${ic('lock')} Entrar com meu treinador</button>
      ${full ? `<div class="note small" style="margin:0"><b>Liga cheia para treinadores novos</b> (${nC >= cap ? `as ${cap} vagas estão ocupadas` : 'não sobrou clube livre'}). Quem já tem treinador aqui entra normalmente com o código acima. Novato só entra com um <b>código de vaga</b> do ADM, no mesmo campo.</div>` : ''}
      ${full ? '' : `<button class="btn big alt" data-act="iamnew">Sou novo: criar meu treinador</button><p class="muted small" style="margin:0;text-align:center">${nC} de ${cap} vagas de treinador ocupadas</p>`}
      ${NET.isAdmin() && UI.ownerOK ? `<button class="btn big alt" data-act="joinspect">${ic('lock')} Entrar só como ADM (sem time)</button>` : ''}</div>`;
  }
  if (L.mode === 'join') return `<div class="tile lobby"><div class="eyebrow">${ic('handshake')} Entrar numa liga</div>
      <label class="eyebrow" for="lg-code">Código de acesso</label><input type="text" id="lg-code" maxlength="8" placeholder="Ex.: K7Q2MX" value="${esc(L.code || '')}" autocomplete="off" style="text-transform:uppercase;letter-spacing:.2em;font-weight:800">${err}
      <div class="row"><button class="btn big" style="flex:1" data-act="lgjoin">Entrar</button><button class="btn alt" data-act="lgback">Voltar</button></div></div>`;
  const mine = NET.myLeagues();
  const inv = UI.invite && !mine.some(x => x.code === UI.invite) ? `<div class="tile lobby hl"><div class="eyebrow">${ic('handshake')} Você foi convidado</div><p style="margin:0">Liga com o código <b>${esc(UI.invite)}</b>.</p><button class="btn big" data-act="lgopen" data-c="${esc(UI.invite)}">Entrar nesta liga</button></div>` : '';
  const list = mine.length ? `<div class="tile"><div class="eyebrow">${ic('trophy')} Minhas ligas</div><div class="stack" style="gap:6px">${mine.map(x => `<div class="lgline"><button class="lgrow" data-act="lgopen" data-c="${esc(x.code)}">${x.club ? crest(x.club, 'sm') : ic('trophy')}<span class="grow"><b>${esc(x.name || 'Liga')}</b><span class="small muted">${x.mode === 'turbo' ? '⚡ Turbo · ' : ''}código ${esc(x.code)}${x.admin ? ' · ADM' : ''}${x.club ? ' · ' + esc(x.club) : ''}</span></span>${ic('arrowR')}</button>${UI.lgDel === x.code ? `<button class="lgdel on" data-act="lgdelok" data-c="${esc(x.code)}">Excluir?</button><button class="lgdel" data-act="lgdelno" aria-label="Cancelar">×</button>` : `<button class="lgdel" data-act="lgdel" data-c="${esc(x.code)}" aria-label="Excluir liga da lista">${ic('trash')}</button>`}</div>`).join('')}</div></div>` : '';
  return `${inv}${err}${list}<button class="btn big" data-act="lgmode" data-m="create">${ic('trophy')} Criar nova liga</button><button class="btn big alt" data-act="lgmode" data-m="join">${ic('handshake')} Entrar com código</button>`;
}
async function enterLeague(c) {
  UI.lobby = { mode: 'menu', busy: 'Abrindo a liga…' }; render();
  let r; try { r = await NET.open(c); } catch (e) { r = { err: NET.explain(e) }; }
  if (r.err) { UI.lobby = { mode: 'join', code: c, err: r.err }; render(); return; }
  UI.lobby = { mode: 'menu' };
  if (r.hasDesk) { go('home'); NET.sync(); }
  else if (Object.keys(S.desks || {}).length) { UI.lobby = { mode: 'claim', code: c }; render(); }
  else { UI.coachEdit = false; UI.coach = null; coachDraft(); go('creator'); }
}
function inviteModal() {
  const link = NET.inviteLink(), code = NET.code, solo = Wd.isSolo(S), n = Wd.coachCount(S), cap = Wd.leagueCap(S);
  const txt = solo ? `Bora jogar Treineiros comigo! É uma liga só nossa (até ${cap} treinadores): "${S.league ? S.league.name : ''}", código ${code}: ${link}` : `Bora jogar Treineiros comigo! Entra na liga "${S.league ? S.league.name : ''}" com o código ${code}: ${link}`;
  if (solo && n >= cap) return `<h2 class="sech big">${ic('user')} Liga cheia</h2>
    <p style="margin:0">Esta liga Solo/Close Friends já tem os ${cap} treinadores (você e mais ${cap - 1} amigos).</p>
    <div class="note small">Pra jogar com mais gente, crie uma liga <b>Online</b>: até 60 treinadores, nas divisões que você abrir.</div>`;
  return `<h2 class="sech big">${ic('user')} ${solo ? 'Chame até ' + (cap - 1) + ' amigos' : 'Convidar amigos'}</h2>
    ${solo ? `<p class="muted small" style="margin:0">Jogue com até ${cap - 1} amigos (${n} de ${cap} vagas usadas). O avanço pro próximo jogo passa a valer quando todos tocarem em <b>Estou pronto</b>. Pra mais gente, crie uma liga Online.</p>` : ''}
    <div class="codebig">${esc(code)}</div>
    <p class="muted small" style="margin:0;text-align:center">Código de acesso da liga. No jogo, o amigo toca em <b>Entrar com código</b>.</p>
    <label class="eyebrow">Mensagem pra mandar</label><textarea id="inv-txt" readonly style="min-height:90px">${esc(txt)}</textarea>
    <button class="btn big" data-act="invcopy">Copiar convite</button>`;
}

// ---------- criação do treinador ----------
function vCreator() {
  const c = coachDraft(), a = c.avatar, edit = !!UI.coachEdit, club = edit ? S.club : null, A = SPR.COACH;
  const sw = (key, list) => list.map((col, i) => `<button class="sw ${a[key] === i ? 'on' : ''}" style="--sw:${col}" data-act="cav" data-k="${key}" data-v="${i}" aria-label="${key} ${i + 1}"></button>`).join('');
  const chips = (key, obj) => Object.entries(obj).map(([k, l]) => `<button class="chip ${a[key] === k ? 'on' : ''}" data-act="cav" data-k="${key}" data-v="${k}">${l}</button>`).join('');
  const styles = Object.entries(C.STYLES).map(([k, s]) => `<button class="stylei ${c.style === k ? 'on' : ''}" style="--sc:${STYLE_COL[k]}" data-act="cstyle" data-k="${k}">${ic('s_' + k)}<span>${s.name}</span></button>`).join('');
  const sd = C.STYLES[c.style] || C.STYLES.equilibrado;
  return `<div class="top"><button class="iconbtn" data-act="${edit ? 'cback' : 'tolanding'}" aria-label="Voltar">${ic('arrowR', '', 'transform:rotate(180deg)')}</button><span class="wm sm">${WM()}</span><span style="width:40px"></span></div>
  <div class="stack creator">
    <div><div class="eyebrow">${edit ? 'Carreira' : 'Passo 1 de 2'}</div><h1 class="disp" style="font-size:40px;margin:0">${edit ? 'Editar treinador' : profGet().name ? 'Seu treinador' : 'Crie seu treinador'}</h1></div>
    ${edit ? '' : profileStrip()}
    <div class="cstage"><div class="cavbig" id="cavbig">${coachImg(a, club)}</div>
      <div class="cside"><b class="disp" id="cname-show">${esc(c.name || 'Seu nome')}</b><span class="small muted">${edit ? esc(S.club) : UI.vaga && S && UI.vaga.code === NET.code ? esc(UI.vaga.club) : S && NET.online && Wd.leaguePick(S) === 'choice' ? 'clube a escolher' : 'clube a sortear'}</span><button class="btn sm alt" data-act="cavrand">${ic('dice')} Aleatório</button></div></div>
    <div><label class="eyebrow" for="cname">Nome do técnico</label><input type="text" id="cname" maxlength="20" placeholder="Ex.: Vini" value="${esc(c.name)}" autocomplete="off" style="margin-top:6px"></div>
    <div class="copt"><div class="eyebrow">Cor da pele</div><div class="sws">${sw('skin', A.skin)}</div></div>
    <div class="copt"><div class="eyebrow">Cabelo</div><div class="chips">${chips('hair', A.hair)}</div></div>
    <div class="copt"><div class="eyebrow">Cor do cabelo</div><div class="sws">${sw('hairC', A.hairC)}</div></div>
    <div class="copt"><div class="eyebrow">Barba</div><div class="chips">${chips('beard', A.beard)}</div></div>
    <div class="copt"><div class="eyebrow">Roupa</div><div class="chips">${chips('outfit', A.outfit)}</div></div>
    <div class="copt"><div class="eyebrow">Acessório</div><div class="chips">${chips('glasses', A.glasses)}</div></div>
    <div class="copt"><div class="eyebrow">Estilo de jogo preferido</div><div class="styles8">${styles}</div><div class="note small" style="margin-top:8px;border-left:3px solid ${STYLE_COL[c.style]}"><b>${sd.name}:</b> ${sd.desc}</div></div>
    <div class="stickybtn"><button class="btn big" id="cgo" data-act="${edit ? 'csave' : 'cnext'}" ${c.name.trim() ? '' : 'disabled'}>${edit ? `${ic('user')} Salvar treinador` : (UI.vaga && S && UI.vaga.code === NET.code ? `${ic('arrowR')} Assumir o ${esc(UI.vaga.club)}` : S && NET.online && Wd.leaguePick(S) === 'choice' ? `${ic('arrowR')} Escolher meu clube` : `${ic('dice')} Sortear meu clube`)}</button></div>
  </div>`;
}

// ---------- sorteio do clube ----------
function vChoose() {
  const vg = UI.vaga && UI.vaga.code === NET.code ? UI.vaga : null;
  const c = coachDraft(), pool = vg ? [vg.club] : Wd.choicePool(S), sel = UI.choice;
  const row = cl => { const dv = Wd.divOf(S, cl), o = SE.strength(S, cl); return `<button class="prow" data-act="choosepick" data-club="${esc(cl)}" style="${sel === cl ? 'background:#1B1F10;border-radius:12px;padding-inline:8px' : ''}"><span></span>${crest(cl)}<span><span class="n">${esc(cl)}</span><span class="m">Série ${dv} · força ${o.toFixed(1)} · caixa T$ ${fmtK(S.cash[cl] || 0)}${S.obj && S.obj[cl] ? ` · ${esc(S.obj[cl].label)}` : ''}${dnaTag(cl)}</span></span><span class="rt">${sel === cl ? '<b style="color:var(--lime)">✓</b>' : ''}</span></button>`; };
  const groups = ['A', 'B', 'C'].map(k => { const L = pool.filter(x => Wd.divOf(S, x) === k).sort((a, b) => SE.strength(S, b) - SE.strength(S, a)); return L.length ? `<div class="eyebrow" style="margin:6px 0 0">Série ${k} · ${L.length} livre${L.length > 1 ? 's' : ''}</div><div class="tile" style="padding:6px 12px"><div class="list">${L.map(row).join('')}</div></div>` : ''; }).join('');
  return `<div class="top"><span class="wm sm">${WM()}</span></div>
  <div class="stack draw">
    <div><div class="eyebrow">Passo 2 de 2</div><h1 class="disp" style="font-size:40px;margin:0">${vg ? 'Vaga reservada' : 'Escolha seu clube'}</h1></div>
    <p class="muted" style="margin:0">${vg ? `O ADM reservou o <b>${esc(vg.club)}</b> pra você. Toque no clube e confirme.` : 'Nesta liga cada treinador escolhe o clube. Toque num clube livre e confirme. Cada clube só pode ter um técnico da liga.'}</p>
    <div id="drawres">${UI.chooseErr ? `<div class="note bad">${esc(UI.chooseErr)}</div>` : ''}</div>
    ${groups || '<div class="note bad">Não sobrou clube livre nesta liga.</div>'}
    <div style="position:sticky;bottom:calc(12px + env(safe-area-inset-bottom,0px))"><button class="btn big" data-act="choosego" ${sel && !UI.choosing ? '' : 'disabled'}>${UI.choosing ? 'Confirmando…' : sel ? `Assumir o ${esc(sel)}` : 'Escolha um clube'}</button></div></div>`;
}
function vDraw() {
  if (S && NET.online && (Wd.leaguePick(S) === 'choice' || (UI.vaga && UI.vaga.code === NET.code))) return vChoose();
  const c = coachDraft();
  return `<div class="top"><span class="wm sm">${WM()}</span></div>
  <div class="stack draw">
    <div><div class="eyebrow">Passo 2 de 2</div><h1 class="disp" style="font-size:40px;margin:0">Sorteio do clube</h1></div>
    <p class="muted" style="margin:0">${(() => { const pool = S ? Wd.drawPool(S) : [], dv = pool.length ? Wd.divOf(S, pool[0]) : 'A', top = pool.length <= 4 && Wd.divList(S, dv).length > 4 ? ' (primeiro entre os 4 elencos mais fortes)' : '';
      return dv === 'C' ? `As Séries A e B já estão completas: um clube da Série C sem treinador vai ser sorteado pra ${esc(c.name)}${top}. Na C a moeda rara é o Ouro, e os 4 primeiros sobem pra Série B.`
        : dv === 'B' ? `A Série A já está completa: um clube da Série B sem treinador vai ser sorteado pra ${esc(c.name)}${top}.`
        : `Um clube da Série A sem treinador vai ser sorteado pra ${esc(c.name)}.`; })()} Cada clube só pode ter um técnico da liga.</p>
    <div class="reelwrap"><div class="reel" id="reel"></div><div class="rmark"></div><div class="rfade l"></div><div class="rfade r"></div></div>
    <div id="drawres" class="drawres"><div class="cavmid">${coachImg(c.avatar, null)}</div><p class="muted small" style="margin:0">Sorteando…</p></div>
  </div>`;
}
const REEL_W = 92;
let DRAW = null;
function drawPool() {
  if (!S) return Wd.BR_A0();
  const pool = Wd.drawPool(S);
  return pool.length ? pool : S.divA;
}
function startDraw() {
  const reel = $('#reel'); if (!reel) return;   // modo escolha não tem roleta
  const pool = C.shuffle(drawPool(), C.rng(Date.now() % 1e9));
  const items = []; for (let i = 0; i < 40; i++) items.push(...pool);
  reel.innerHTML = items.map((c, i) => `<div class="ri" data-i="${i}">${crest(c, 'xl')}<span>${esc(c)}</span></div>`).join('');
  const wrap = reel.parentElement, center = wrap.clientWidth / 2 - REEL_W / 2;
  DRAW = { items, pos: 0, v: 1500, phase: 'spin', t0: performance.now(), last: performance.now(), lastIdx: -1, club: null, center };
  const tickSfx = idx => { if (idx !== DRAW.lastIdx) { DRAW.lastIdx = idx; SFX.tap(0.5); } };
  const frame = now => {
    if (!DRAW || !$('#reel')) return;
    const dt = Math.min(0.05, (now - DRAW.last) / 1000); DRAW.last = now;
    if (DRAW.phase === 'spin') {
      DRAW.pos += DRAW.v * dt;
      if (DRAW.club && now - DRAW.t0 > 1400) {   // freia até parar no clube sorteado
        const cur = Math.ceil(DRAW.pos / REEL_W) + Math.max(14, pool.length);
        let target = items.findIndex((c, i) => i >= cur && c === DRAW.club);
        if (target < 0) target = items.lastIndexOf(DRAW.club);
        const D = target * REEL_W - DRAW.pos;
        Object.assign(DRAW, { phase: 'stop', p0: DRAW.pos, D, T: Math.max(2.6, Math.min(5.5, 3 * D / DRAW.v)), ts: now, target });
      }
    } else if (DRAW.phase === 'stop') {
      const u = Math.min(1, (now - DRAW.ts) / 1000 / DRAW.T);
      DRAW.pos = DRAW.p0 + DRAW.D * (1 - Math.pow(1 - u, 3));
      if (u >= 1) { DRAW.phase = 'done'; reel.style.transform = `translateX(${DRAW.center - DRAW.pos}px)`; landed(); return; }
    }
    reel.style.transform = `translateX(${DRAW.center - DRAW.pos}px)`;
    tickSfx(Math.round(DRAW.pos / REEL_W));
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  const fail = msg => { DRAW = null; const box = $('#drawres'); if (box) box.innerHTML = `<div class="note bad">${esc(msg)}</div><button class="btn big" data-act="drawretry">Tentar de novo</button><button class="btn big alt" data-act="tolanding">Voltar ao início</button>`; };
  const guard = setTimeout(() => { if (DRAW && !DRAW.club) fail('A liga demorou demais pra responder.'); }, 30000);
  claim(pool).then(r => {
    clearTimeout(guard);
    if (!DRAW) return;
    if (r.err || !r.club) { fail(r.err || 'Não consegui sortear um clube agora.'); return; }
    DRAW.club = r.club;
  }).catch(e => { clearTimeout(guard); fail(NET.explain(e)); });
}
async function claim(pool, want) {
  const c = coachDraft(), profile = { name: c.name.trim() || 'Treineiro', avatar: c.avatar, style: c.style };
  if (NET.online) {
    try {
      if (!NET.code) return { err: 'Abra ou crie uma liga primeiro.' };
      if (!S) await NET.createWorld();
      return await NET.claimClub(profile, want, want && UI.vaga && UI.vaga.club === want ? UI.vaga.h : null);
    } catch (e) { return { err: NET.explain(e) }; }
  }
  // offline: jogo local, um treinador
  const club = pool[rnd(pool.length)];
  Wd.resetCache();
  const w = Wd.newWorld({ now: Date.now() });
  SE.setupSeason(w); w.lastT = w.seasonStart;
  w.__me = 'local'; S = w;
  Wd.addDesk(S, 'local', profile, club);
  SE.balanceWallet(S);
  EV.news(S, { t: 'club', title: `${profile.name} é sorteado e assume o ${club}`, body: `Temporada ${S.season} começa ${when(SE.slotTime(S, 0))}.`, clubs: [club] });
  SE.process(S); save();
  return { club };
}
function landed() {
  const club = DRAW.club, c = coachDraft();
  const el = document.querySelector(`.ri[data-i="${DRAW.target}"]`); if (el) el.classList.add('win');
  SFX.dia(); SFX.vibrate([60, 40, 140]);
  const o = S && S.obj && S.obj[club];
  const res = $('#drawres');
  res.innerHTML = `<div class="cavmid" id="cavland">${coachImg(c.avatar, null)}</div>
    <div class="dtxt"><div class="eyebrow">Sorteado</div><h2 class="disp" style="font-size:34px;margin:0">${crest(club, 'lg')} ${esc(club)}</h2>
    <p style="margin:6px 0 0">${esc(c.name)}, você é o novo técnico do ${esc(club)}.${o ? ` Objetivo da diretoria: <b>${esc(o.label)}</b>.` : ''}</p>
    ${S && S.desks[S.__me] ? `<div class="row" style="gap:8px;margin-top:8px"><span class="cur st">${ic('star')}${S.stars}</span><span class="cur ${gemCls()}">${gemIc()}${S.dias}</span>${S.packTierTxt ? '' : ''}</div>` : ''}</div>
    <button class="btn big" data-act="drawgo">${ic('arrowR')} Começar no ${esc(club)}</button>`;
  // escudo "costurado" na roupa do técnico
  setTimeout(() => { const b = $('#cavland'); if (b) { b.innerHTML = coachImg(c.avatar, club); b.classList.add('stitch'); SFX.flip(); } }, 900);
}

// ---------- liga online: atualização quando outro treinador (ou o relógio) muda o mundo ----------
function softRender() {
  if (['live', 'draw'].includes(UI.view)) return;
  const ae = document.activeElement;
  if (ae && ae.matches && ae.matches('input[type=text],textarea')) { UI.pendingRender = true; return; }
  if (UI.modal) { UI.modal.keep = true; }
  render();
}
document.addEventListener('focusout', () => { if (UI.pendingRender) { UI.pendingRender = false; setTimeout(softRender, 50); } });
let _lastSeen = null;
NET.on(ev => {
  if (ev === 'status' && NET.err && NET.err.code === 'outdated' && !UI.outdWarn) { UI.outdWarn = 1; toast(NET.explain(NET.err), true); }
  if (ev === 'status' && NET.err && NET.err.code === 'nokey' && !UI.nokeyWarn) { UI.nokeyWarn = 1; toast(NET.explain(NET.err), true); }
  if (ev === 'status') { const d = $('#netdot'); if (d) { d.className = 'netdot ' + NET.status.replace(/\s/g, ''); d.title = NET.status; } if (UI.view === 'landing') { const ae = document.activeElement; if (!(ae && ae.matches && ae.matches('input,textarea'))) render(); } return; }
  if (!ev || ev.type !== 'world' || !S) return;
  const lm = S.lastMatch;
  const key = lm ? `${lm.season}-${lm.k}-${lm.t || ''}` : null;
  const fresh = lm && !lm.watched && key !== _lastSeen;
  if (fresh) _lastSeen = key;
  if (UI.view === 'landing' || UI.view === 'creator') { if (UI.view === 'landing') render(); return; }
  softRender();
  if (UI.view !== 'live' && S.desks[S.__me] && autoLive()) return;
  if (fresh && UI.view !== 'live' && S.desks[S.__me] && !UI.kickoff && UI.autoOpened !== `${lm.season}-${lm.k}-${lm.friendly ? lm.t : ""}`) toast('Seu jogo terminou. Toque em Assistir no Clube.');
});

// ---------- ações extras ----------
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  const act = el.dataset.act, c = UI.coach;
  switch (act) {
    case 'tolanding': DRAW = null; UI.lobby = { mode: 'menu' }; go('landing'); break;
    case 'cav': { const k = el.dataset.k, v = el.dataset.v; c.avatar[k] = /^\d+$/.test(v) ? +v : v; saveDraft(); refreshCreator(); break; }
    case 'cavrand': c.avatar = randomAvatar(); saveDraft(); refreshCreator(); break;
    case 'cstyle': c.style = el.dataset.k; saveDraft(); refreshCreator(); break;
    case 'cnext': {
      if (!c.name.trim()) break; saveDraft();
      // só sobrou vaga na Série C: confirma antes de sortear
      if (S && UI.vaga && UI.vaga.code === NET.code) { UI.choice = UI.vaga.club; go('draw'); break; }   // código de vaga: clube já definido pelo ADM
      if (S && Wd.leaguePick(S) === 'choice') { UI.choice = null; go('draw'); break; }
      const pool = S && S.desks ? Wd.drawPool(S) : [], dv = pool.length ? Wd.divOf(S, pool[0]) : 'A';
      if (dv === 'C' && !UI.cOk && Wd.leagueDivs(S).length > 1) { UI.modal = { type: 'cconfirm' }; renderModal(); break; }
      go('draw'); break;
    }
    case 'cconfok': UI.cOk = true; UI.modal = null; renderModal(); go('draw'); break;
    case 'cconfno': UI.modal = null; renderModal(); DRAW = null; UI.lobby = { mode: 'menu' }; go('landing'); break;
    case 'csave': {
      if (!c.name.trim()) break;
      S.manager = c.name.trim(); S.avatar = { ...c.avatar }; if (S.tactics) S.tactics.style = c.style;
      if (S.coaches[S.club]) S.coaches[S.club].name = S.manager;
      save(); UI.coachEdit = false; toast('Treinador atualizado'); go('home'); break;
    }
    case 'cback': UI.coachEdit = false; go('home'); break;
    case 'editcoach': UI.coachEdit = true; UI.coach = { name: S.manager, style: (S.tactics && S.tactics.style) || 'equilibrado', avatar: { ...SPR.COACH_DEF, ...(S.avatar || {}) } }; go('creator'); break;
    case 'drawgo': DRAW = null; go('home'); break;
    case 'drawretry': go('draw'); break;
    case 'choosepick': UI.choice = el.dataset.club; UI.chooseErr = null; render(); break;
    case 'choosego': {
      if (!UI.choice || UI.choosing) break;
      UI.choosing = true; render();
      claim([], UI.choice).then(r => {
        UI.choosing = false;
        if (r.err || !r.club) { UI.chooseErr = r.err || 'Não consegui assumir agora.'; UI.choice = null; render(); return; }
        UI.vaga = null;
        const cl = r.club, c = coachDraft(), o = S && S.obj && S.obj[cl];
        $('#app').innerHTML = `<div class="top"><span class="wm sm">${WM()}</span></div><div class="stack draw"><div id="drawres" class="drawres"><div class="cavmid stitch">${coachImg(c.avatar, cl)}</div>
          <div class="dtxt"><div class="eyebrow">Escolhido</div><h2 class="disp" style="font-size:34px;margin:0">${crest(cl, 'lg')} ${esc(cl)}</h2><p style="margin:6px 0 0">${esc(c.name)}, você é o novo técnico do ${esc(cl)}.${o ? ` Objetivo da diretoria: <b>${esc(o.label)}</b>.` : ''}</p></div>
          <button class="btn big" data-act="drawgo">${ic('arrowR')} Começar no ${esc(cl)}</button></div></div>`;
        try { SFX.dia(); } catch (e) {}
      }).catch(e => { UI.choosing = false; UI.chooseErr = NET.explain(e); render(); });
      break;
    }
    case 'lgmode': UI.lobby = { mode: el.dataset.m }; render(); if (el.dataset.m === 'create') lobbyScroll(); break;
    case 'lgback': UI.lobby = { mode: 'menu' }; render(); break;
    case 'acclogin': accLogin(); break;
    case 'lgdel': UI.lgDel = el.dataset.c; render(); break;
    case 'lgdelno': UI.lgDel = null; render(); break;
    case 'lgdelok': NET.forget(el.dataset.c); UI.lgDel = null; toast('Liga removida da sua lista.'); render(); break;
    case 'iamnew': UI.lobby = { mode: 'menu' }; UI.coachEdit = false; UI.coach = null; coachDraft(); go('creator'); break;
    case 'reloadapp': try { location.replace(location.pathname + '?v=' + Date.now() + location.hash); } catch (e) { location.reload(); } break;
    case 'lgopen': enterLeague(el.dataset.c); break;
    case 'lgjoin': { const c = ($('#lg-code') || {}).value || ''; enterLeague(c); break; }
    case 'lgdiv': { lobbyKeep(); const D = (UI.lobby.divs || ['A', 'B', 'C']).slice(), k = el.dataset.v, i = D.indexOf(k); if (i >= 0) { if (D.length > 1) D.splice(i, 1); } else D.push(k); UI.lobby.divs = ['A', 'B', 'C'].filter(x => D.includes(x)); render(); break; }
    case 'lgpick': { lobbyKeep(); UI.lobby.pick = el.dataset.v; render(); break; }
    case 'lgmodepick': { lobbyKeep(); UI.lobby.lmode = el.dataset.v; UI.lobby.step = 2; render(); lobbyScroll(); break; }
    case 'lgkind': { lobbyKeep(); UI.lobby.kind = el.dataset.v; UI.lobby.step = el.dataset.v === 'solo' ? 4 : 3; render(); lobbyScroll(); break; }
    case 'lgstep': { lobbyKeep(); UI.lobby.step = Math.max(1, Math.min(4, +el.dataset.v || 1)); UI.lobby.err = null; render(); lobbyScroll(); break; }
    case 'lgcreate': {
      const name = ($('#lg-name') || {}).value || '', lmode = UI.lobby.lmode === 'turbo' ? 'turbo' : 'normal', spect = !!UI.ownerOK && !!($('#lg-spect') || {}).checked;
      const solo = UI.lobby.kind === 'solo', divs = solo ? ['A', 'B', 'C'] : UI.lobby.divs || ['A', 'B', 'C'], pick = solo || UI.lobby.pick === 'choice' ? 'choice' : 'draw', keep = { mode: 'create', step: 4, kind: UI.lobby.kind, name, lmode, spect: spect && !solo, divs, pick };
      UI.lobby = { ...keep, busy: 'Criando a liga…' }; render();
      NET.createLeague(name, lmode, { divs, pick, solo }).then(async r => {
        if (r.err) { UI.lobby = { ...keep, err: r.err }; render(); return; }
        if (spect && !solo) { const j = await NET.joinSpect(); if (j && j.err) { UI.lobby = { ...keep, err: j.err }; render(); return; } UI.lobby = { mode: 'menu' }; go('home'); return; }
        UI.lobby = { mode: 'menu' }; UI.coachEdit = false; UI.coach = null; coachDraft(); go('creator');
      }).catch(e => { UI.lobby = { ...keep, err: NET.explain(e) }; render(); });
      break;
    }
    case 'netadvance': {
      if (UI.advancing) break;
      UI.advancing = true; render();
      NET.advance().then(ok => {
        UI.advancing = false;
        if (!ok) { toast(NET.explain(NET.err), true); render(); return; }
        const lm = S && S.lastMatch;
        if (lm && !lm.watched && lm.season === S.season && lm.k === S.slot - 1) { UI.view = 'live'; render(); pageTo(0); }
        else render();
      });
      break;
    }
    case 'invite': UI.modal = { type: 'invite' }; renderModal(); break;
    case 'soloready': case 'solounready': {
      if (UI.soloBusy) break;
      const on = act === 'soloready'; UI.soloBusy = true; render();
      NET.soloReady(on).then(r => { UI.soloBusy = false; if (!r) toast(NET.explain(NET.err), true); else if (r === 'notmine') toast('O próximo jogo da liga é de outro treinador. Espere ele avançar.'); else if (r === 'go') toast('Avançando pro próximo jogo…'); else if (on) toast('Confirmado. Falta o resto da galera.'); render(); }).catch(e => { UI.soloBusy = false; toast(NET.explain(e), true); render(); });
      break;
    }
    case 'invcopy': { const t = $('#inv-txt'); try { navigator.clipboard.writeText(t.value).then(() => toast('Convite copiado'), () => { t.select(); toast('Selecione e copie o texto'); }); } catch (e) { t.select(); toast('Selecione e copie o texto'); } break; }
    case 'rosterdiv': UI.rosterDiv = el.dataset.v || null; render(); break;
    case 'kick': UI.kick = el.dataset.t || null; render(); break;
    case 'annul': UI.annul = el.dataset.k === '' ? null : +el.dataset.k; render(); break;
    case 'annulok': { const k = +el.dataset.k; UI.annul = null; let res = null; NET.sync({ mutate: () => { res = SE.annulRound(S, k); } }).then(() => { toast(res ? res.msg : 'Não foi possível anular.', !(res && res.ok)); render(); }).catch(() => toast('Não foi possível anular agora. Tente de novo.', true)); break; }
    case 'admpass': UI.admPass = el.dataset.t || null; admRefresh(); break;
    case 'admpassok': { const t = el.dataset.t; UI.admPass = null; const nm = (S.desks[t] || {}).manager || 'treineiro'; NET.adminTransfer(t).then(r => { if (r && r.ok) { toast(`${nm} agora é o ADM da liga`); UI.modal = null; UI.view = 'home'; render(); } else toast(r && r.why === 'nofn' ? 'Falta atualizar o banco (SQL v221) pra passar o ADM.' : r && r.why === 'key' ? 'Este aparelho não confirmou a chave. Entre de novo com o seu código.' : 'Não deu pra passar o ADM agora.', true); }); break; }
    case 'kickok': { const t = el.dataset.t; UI.kick = null; NET.kick(t).then(() => { toast('Treinador removido da liga'); render(); }); break; }
    case 'leaveleague': NET.close(); UI.lobby = { mode: 'menu' }; go('landing'); break;
  }
});
function refreshCreator() {
  const y = pageY(); render(); pageTo(y);
}
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'cname') { coachDraft().name = t.value; saveDraft(); const b = $('#cgo'); if (b) b.disabled = !t.value.trim(); const s = $('#cname-show'); if (s) s.textContent = t.value || 'Seu nome'; }
});

// aviso antes do sorteio quando só há vaga na Série C
function cConfirmModal() {
  const n = S ? Wd.drawPool(S).length : 0, free = S ? (S.divC || []).filter(c => !Wd.isHuman(S, c)).length : 0;
  return `<h2 class="disp" style="font-size:30px;margin:0">${ic('lock')} Só tem vaga na Série C</h2>
    <p style="margin:0">As Séries A e B já estão completas. Se continuar, você vai ser sorteado pra um dos <b>${free} clubes livres da Série C</b>${n <= 4 && free > 4 ? ` (primeiro entre os ${n} elencos mais fortes)` : ''}.</p>
    <div class="note"><ul style="margin:0;padding-left:18px"><li>Na C a moeda rara é o <b>Ouro</b>, e o pacote especial é o <b>Ouro Especial</b>.</li><li>Os <b>4 primeiros sobem pra Série B</b>; os 4 últimos caem pra Série D (e o treinador fica sem clube).</li><li>Clubes da A e da B podem abrir vaga no meio da temporada e te fazer proposta.</li></ul></div>
    <p class="muted small" style="margin:0">Aceitar a vaga na Série C?</p>
    <div class="row"><button class="btn big" style="flex:1" data-act="cconfok">Aceitar</button><button class="btn alt" data-act="cconfno">Agora não</button></div>`;
}

function lobbyScroll() { try { const t = document.querySelector('.tile.lobby'); if (t) t.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} }
function lobbyKeep() { UI.lobby = { ...UI.lobby, name: ($('#lg-name') || {}).value ?? UI.lobby.name, spect: !!($('#lg-spect') || {}).checked }; }

// ===== UI parte 5: clubes adversários, ficha da partida, escalações no campinho e alertas =====

// ---------- campinho ----------
// um time só (meio campo pra cima = ataque)
// os dois times no mesmo campo, visto de cima: mandante embaixo, visitante em cima
// ---------- lances capitais animados no campinho (estilo FM antigo) ----------

// ---------- força do time (card de overall) ----------
function teamRate(club) {
  try { return SIM.rate(SIM.mkTeam(SE.teamFor(S, club), id => SE.info(S, id))); } catch (e) { return null; }
}
function teamCard(club) {
  const r = teamRate(club); if (!r) return '';
  const o = Math.round(r.ovr), c = cat(o);
  return `<span class="tcard ${c.k}"><span class="tc1"><small>${c.name}</small><b class="num">${o}</b></span><span class="tc2"><i>ATA <b>${Math.round(r.ATA)}</b></i><i>MEI <b>${Math.round(r.MEI)}</b></i><i>DEF <b>${Math.round(r.DEF)}</b></i></span></span>`;
}

// ---------- clube (elenco de qualquer time) ----------
function divOf(club) { return Wd.divOf(S, club); }
function clubOrder(club) {
  const d = divOf(club); if (!d) return [club];
  return SE.standings(S.comp[d].table).map(r => r.c);
}
// página fixa do clube (não é mais uma caixa flutuante)
// escudo em qualquer card leva direto pra ficha do clube
window.addEventListener('click', ev => {
  const im = ev.target.closest && ev.target.closest('img.crest[data-cl]'); if (!im) return;
  if (im.closest('[data-act="club"], .cgrid, .reel, .lgrow, .cmhead, .mentions') || !S || !S.desks || !S.desks[S.__me] || ['landing', 'creator', 'draw'].includes(UI.view)) return;
  const club = im.dataset.cl;
  if (!club || !(!!Wd.divOf(S, club) || Wd.squad(S, club).length)) return;
  ev.preventDefault(); ev.stopImmediatePropagation(); openClub(club);
}, true);
function openClub(club) {
  if (!club) return;
  if (UI.view !== 'club') UI.clubFrom = UI.view;
  UI.clubSel = club; UI.modal = null; UI.view = 'club';
  render(); pageTo(0);
}
function vClub() {
  const club = UI.clubSel || S.club;
  const order = clubOrder(club);
  const grid = order.length > 1 ? `<div class="cgrid">${order.map((c, i) => `<button class="${c === club ? 'on' : ''}" data-act="club" data-club="${esc(c)}" aria-label="${esc(c)}"><span class="cpos">${i + 1}</span>${crest(c, 'sm')}</button>`).join('')}</div>` : '';
  return `${topbar()}<div class="stack">
    <div class="clubnav"><button class="btn sm alt" data-act="clubback">‹ Voltar</button><span class="small muted">${divOf(club) ? `Série ${divOf(club)} · toque num escudo` : 'Clube'}</span></div>
    ${grid}${clubModal({ club })}</div>`;
}
function clubModal(m) {
  const club = m.club, d = divOf(club), mine = club === S.club;
  const order = clubOrder(club), i = order.indexOf(club);
  const prev = order[(i - 1 + order.length) % order.length], next = order[(i + 1) % order.length];
  const coach = S.coaches[club], human = Wd.isHuman(S, club);
  let posTxt = '';
  if (d) { const T = S.comp[d].table[club]; posTxt = `Série ${d} · ${i + 1}º · ${T.v * 3 + T.e} pts · ${T.v}V ${T.e}E ${T.d}D`; }
  const team = SE.teamFor(S, club);
  const r = teamRate(club);
  const ids = Wd.squad(S, club).slice().sort((a, b) => (POS_ORDER[P[a].pos] ?? 9) - (POS_ORDER[P[b].pos] ?? 9) || vw(b).ovr - vw(a).ovr);
  const xi = new Set(team.xi || []);
  const rows = ids.map(id => playerRow(id, { vitals: false, ren: false, meta: id2 => `${esc(C.POS_NAME[P[id2].pos] || P[id2].pos)} · ${ageOf(id2)} anos${xi.has(id2) ? ' · <b style="color:var(--lime)">titular</b>' : ''}` })).join('');
  const sched = SE.clubSchedule(S, club);
  const done = sched.filter(x => !x.tbd && x.k < S.slot).slice(-5).reverse();
  const nx = sched.find(x => !x.tbd && x.k >= S.slot);
  const strip = '';
  return `<div class="clubm">
    ${strip}
    <div class="cmhead"><button class="navb" data-act="club" data-club="${esc(prev)}" aria-label="Clube anterior" ${order.length < 2 ? 'hidden' : ''}>‹</button>
      <div class="cmid">${crest(club, 'lg')}<h2 class="disp">${esc(club)}</h2>
        <span class="small muted">${posTxt}</span>
        ${C.dnaOf && C.dnaOf(club) ? `<span class="row" style="gap:6px;justify-content:center;flex-wrap:wrap">${dnaChip(club, { q: true })}</span>` : ''}
        <span class="row" style="gap:6px;justify-content:center;flex-wrap:wrap"><span class="pill">${ic('user')} ${esc(coach ? coach.name : '—')}${coach && coach.interim ? ' · interino' : ''}</span>${S.vacant && S.vacant[club] ? '<span class="pill" style="color:var(--lime)">Vaga aberta</span>' : ''}${human ? `<span class="pill adm" role="button" data-act="coach" data-club="${esc(club)}">${ic('user')} ver ficha do treinador</span>` : ''}<span class="pill">${ic('cash')} T$ ${fmtK(S.cash[club] || 0)}</span></span></div>
      <button class="navb" data-act="club" data-club="${esc(next)}" aria-label="Próximo clube" ${order.length < 2 ? 'hidden' : ''}>›</button></div>
    ${r ? `<div class="rtg"><div><span>Geral</span><b class="num">${Math.round(r.ovr)}</b></div><div><span>Ataque</span><b class="num">${Math.round(r.ATA)}</b></div><div><span>Meio</span><b class="num">${Math.round(r.MEI)}</b></div><div><span>Defesa</span><b class="num">${Math.round(r.DEF)}</b></div></div>` : ''}
    ${mine ? `<button class="btn sm alt" data-act="goto" data-v="squad" data-sub="players">Abrir meu elenco</button>` : ''}
    <h3 class="sech" style="font-size:20px">${ic('tactic')} Time provável · ${esc(team.formation || '')}</h3>
    <div class="tile tight">${(() => { const nums = MV.numbers(team), slots = C.FORMATIONS[team.formation] || C.FORMATIONS['4-3-3'];
      return (team.xi || []).map((id, i) => id == null || !P[id] ? '' : `<div class="lrow"><span class="ln">${nums[id] ?? ''}</span><span class="lnm">${plink(id, P[id].name)}</span><span class="lp">${(slots[i] || [P[id].pos])[0]} · <b class="num">${vw(id).ovr}</b></span></div>`).join(''); })()}</div>
    ${nx ? `<div class="small muted" style="margin-top:4px">${ic('clock')} Próximo: ${esc(nx.h === club ? nx.a : nx.h)} (${nx.h === club ? 'casa' : 'fora'}) · ${SE.COMP_NAME[nx.comp]} · ${when(nx.t)}</div>` : ''}
    ${done.length ? `<h3 class="sech" style="font-size:20px">${ic('ball')} Últimos jogos</h3><div>${done.map(resHTML).join('')}</div>` : ''}
    <h3 class="sech" style="font-size:20px">${ic('user')} Elenco · ${ids.length}</h3>
    <div class="list">${rows}</div></div>`;
}

// ---------- ficha da partida ----------
function kOfMatch(m) {
  if (m.sk != null) return m.sk;
  if (m.k != null) return m.k;
  for (const k in S.played) if (S.played[k].includes(m)) return +k;
  return null;
}
function findPlayed(k, h, a) { return (S.played[k] || []).find(x => x.h === h && x.a === a) || null; }
function openMatch(k, h, a) {
  const back = UI.modal && UI.modal.type === 'club' ? UI.modal : null;
  UI.modal = { type: 'match', k, h, a, back };
  renderModal();
}
function matchModal(mm) {
  const m = findPlayed(mm.k, mm.h, mm.a);
  if (!m) return `<p class="muted">Jogo não encontrado.</p>`;
  const lm = S.lastMatch && S.lastMatch.season === S.season && S.lastMatch.k === mm.k && S.lastMatch.f.h === m.h ? S.lastMatch : null;
  const stage = m.md ? `rodada ${m.md}` : m.round ? SE.CB_STAGES[m.round - 1] : m.stage ? SE.CK_STAGES[m.stage - 1] : m.leg ? `jogo ${m.leg}` : '';
  const evs = (m.g || (lm ? lm.res.ev.filter(e => ['goal', 'red', 'red2'].includes(e.t)).map(e => [e.m, e.s === 'h' ? 0 : 1, e.p, e.t === 'goal' ? (e.a ?? -1) : -2]) : null));
  const line = ([mn, s, p, a]) => {
    const goal = a !== -2, nm = P[p] ? plink(p, P[p].short) : '?';
    const txt = goal ? `${nm}${a >= 0 && P[a] ? `<small>assist. ${esc(P[a].short)}</small>` : ''}` : `${nm}<small>expulso</small>`;
    const icon = goal ? ic('ball', '', 'color:var(--lime)') : `<i class="rc"></i>`;
    return s === 0 ? `<div class="gl"><span class="gh">${txt}</span><span class="gm">${icon}<b>${esc(mn)}'</b></span><span></span></div>`
      : `<div class="gl"><span></span><span class="gm"><b>${esc(mn)}'</b>${icon}</span><span class="ga">${txt}</span></div>`;
  };
  const st = m.st;
  const bar = (lab, a, b, f = x => x) => { const t = (a + b) || 1; return `<div class="sbar"><span class="l num">${f(a)}</span><span class="b"><i style="width:${a / t * 100}%;background:var(--lime)"></i><i style="width:${b / t * 100}%;background:var(--pink)"></i></span><span class="r num">${f(b)}</span></div><div class="sbl">${lab}</div>`; };
  const stats = st ? bar('Posse de bola %', st.poss[0], st.poss[1]) + bar('Finalizações', st.shots[0], st.shots[1]) + bar('No alvo', st.sot[0], st.sot[1]) + bar('xG', +st.xg[0].toFixed(2), +st.xg[1].toFixed(2), x => x.toFixed(2)) + bar('Cartões', st.yc[0], st.yc[1]) : '';
  return `<div class="matchm">
    <div class="compb cmptag cmp-${m.comp}" style="align-self:center">${ic('trophy')} ${SE.COMP_NAME[m.comp]}${stage ? ' · ' + stage : ''}</div>
    <div class="small muted" style="text-align:center">${SE.gameDate(S, mm.k).txt} · ${when(SE.slotTime(S, mm.k))}</div>
    <div class="mmscore"><button class="t" data-act="club" data-club="${esc(m.h)}">${crest(m.h, 'lg')}<b>${esc(m.h)}</b>${coachTag(m.h)}</button>
      <div class="g num"><span>${m.gh}<i>–</i>${m.ga}</span>${m.pens ? `<small>pên. ${m.pens[0]}–${m.pens[1]}</small>` : ''}${m.agg ? `<small>agregado ${m.agg[0]}–${m.agg[1]}</small>` : ''}</div>
      <button class="t" data-act="club" data-club="${esc(m.a)}">${crest(m.a, 'lg')}<b>${esc(m.a)}</b>${coachTag(m.a)}</button></div>
    <div class="tile tight goals">${evs ? (evs.length ? evs.map(line).join('') : '<p class="muted small" style="margin:6px 0;text-align:center">Sem gols.</p>') : '<p class="muted small" style="margin:6px 0;text-align:center">Detalhes dos gols só existem pros jogos a partir desta versão.</p>'}</div>
    ${gateLine(lm && lm.res.gate ? lm.res.gate : m.pub ? { st: SE.stadium(S, m.h).name, att: m.pub[0], cap: m.pub[1], occ: m.pub[0] / m.pub[1], rev: null } : null).replace('T$ null', '')}
    ${m.mom && P[m.mom] ? `<div class="kv"><span>Melhor em campo</span><b>${plink(m.mom, P[m.mom].name)}</b></div>` : ''}
    ${stats ? `<div class="tile"><div class="eyebrow">Estatísticas</div><div class="sbars">${stats}</div></div>` : ''}
    ${lm ? lineupsTile(lm) + `<button class="btn" data-act="watch">${ic('ball')} Rever o jogo</button>` : ''}
  </div>`;
}

// ---------- alertas (bolinha vermelha) ----------
// assinatura do que é novidade médica: lesão nova, agravamento, decisão de infiltração disponível, jogador liberado
function dmSig() {
  const now = S.season * 100 + S.slot;
  return mySquad().filter(id => vw(id).inj > 0 || (vw(id).injEnd && now - vw(id).injEnd <= 1)).map(id => { const s = vw(id); return `${id}:${s.injAt || 0}:${s.injTot || 0}:${s.inj > 0 ? (SE.infilInfo(S, id).ok ? 'i' : 'n') : 'ok'}`; }).sort().join('|');
}
function markSeen(k, sg) { if (S[k] !== sg) { S[k] = sg; setTimeout(save, 0); } }
function frSig() { return ((S.fr && S.fr.invites) || []).filter(i => ['incoming', 'accepted', 'declined'].includes(i.status)).map(i => `${i.club}:${i.status}`).sort().join('|'); }
function alerts() {
  const a = {};
  if (!S || !S.desks || !S.desks[S.__me] || S.unemployed) return a;
  try {
    const nb = nextBetSlot();
    if (nb) { const b = S.bets[`${S.season}-${nb.k}`]; a.bets = !b || Object.keys(b.picks || {}).length < nb.games.length; }
    const nx = SE.nextFixtureOf(S, S.club);
    a.talk = !!(nx && !nx.pending && S.teamTalk !== `${S.season}-${nx.k}`);
    a.pack = !!(S.packs && S.packs.list && S.packs.list.some(x => x.taken == null && (x.opts || []).length));
    a.offers = (S.offers || []).length > 0;
    a.lineup = (S.tactics && S.tactics.xi || []).some(id => id != null && !SE.lineupAvail(S, id));
    { const sg = dmSig(); a.dm = !!sg && sg !== S.dmSeen; }
    a.renew = mySquad().some(id => expiring(id) && vw(id).ovr >= 70);   // só Carta Prata ou superior
    a.raise = !!(S.flags && S.flags.raise);
    { a.press = pressKeys().length > 0; }
    { const inv = (S.fr && S.fr.invites) || [], sg = frSig(); a.friendly = inv.some(i => i.status === 'incoming' || i.status === 'accepted') || (!!sg && sg !== S.frSeen); }
  } catch (e) {}
  return a;
}
const DOT = '<i class="rdot" aria-label="precisa de atenção"></i>';
function applyAlerts() {
  const a = alerts();
  const put = (sel, on) => document.querySelectorAll(sel).forEach(el => {
    const d = el.querySelector(':scope > .rdot');
    if (on && !d) el.insertAdjacentHTML('beforeend', DOT); else if (!on && d) d.remove();
  });
  put('.quick [data-sub="bets"]', a.bets);
  put('.quick [data-v="dm"]', a.dm);
  put('.quick [data-m="press"]', a.press);
  put('.quick [data-m="friendly"]', a.friendly);
  put('.hero [data-act="teamtalk"]', a.talk);
  put('.packt', a.pack);
  put('.seg [data-k="bets"]', a.bets);
  put('.seg [data-k="pack"]', a.pack);
  put('.seg [data-k="lineup"]', a.lineup);
  put('.seg [data-k="players"]', a.renew);
  put('#nav-squad', a.lineup || a.renew);
  put('#nav-market', a.pack && !a.offers);
  put('#nav-comps', a.bets);
  // notícias: bolinha azul quando há menções novas ou coletiva disponível
  // Coletiva (botão azul): contador azul de menções novas
  const nm = S && S.desks && S.desks[S.__me] ? (S.mentions || []).filter(x => !x.read).length : 0;
  document.querySelectorAll('.quick [data-m="press"]').forEach(el => { let b = el.querySelector(':scope > .mbadge'); if (nm && !b) { el.insertAdjacentHTML('beforeend', `<i class="mbadge">${nm > 9 ? '9+' : nm}</i>`); } else if (b && !nm) b.remove(); else if (b) b.textContent = nm > 9 ? '9+' : nm; });
}

// ---------- ganchos ----------
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  switch (el.dataset.act) {
    case 'club': ev.stopPropagation(); openClub(el.dataset.club); break;
    case 'clubback': ev.stopPropagation(); UI.view = UI.clubFrom && UI.clubFrom !== 'club' ? UI.clubFrom : 'comps'; render(); pageTo(0); break;
    case 'match': { ev.stopPropagation(); const k = +el.dataset.k; if (!Number.isFinite(k)) break; openMatch(k, el.dataset.h, el.dataset.a); break; }
  }
}, true);
// gancho de depuração (testes automatizados)

// ---------- Os Primordiais: quem abrir a v100 até a data de corte ganha o selo (depois disso, não) ----------
const PRIM_UNTIL = 0;   // encerrado (v141): ninguém mais ganha o selo
function primCheck() {
  if (UI.primTried || Date.now() > PRIM_UNTIL || !S || !S.desks || !S.desks[S.__me]) return;
  if ((S.badges || []).some(b => b.kind === 'selo' && b.k === 'prim')) { UI.primTried = true; return; }
  UI.primTried = true;
  const give = () => { if ((S.badges || []).some(b => b.kind === 'selo' && b.k === 'prim')) return false; S.badges = S.badges || []; S.badges.push({ season: S.season, club: S.club || null, kind: 'selo', k: 'prim', label: 'Os Primordiais', at: Date.now() }); return true; };
  const done = () => { toast('Você é um dos Primordiais! Selo na estante da sua carreira.'); render(); };
  if (NET.online) NET.sync({ mutate: () => { give(); } }).then(done, () => { UI.primTried = false; });
  else if (give()) { save(); done(); }
}
try { Object.defineProperty(window, '__T', { value: { boot: d => bootLocal(d), get S() { return S; }, get UI() { return UI; }, get LIVE() { return LIVE; }, openMatch: (k, h, a) => openMatch(k, h, a), get NET() { return NET; }, get MV() { return MV; }, render: () => render(), renderModal: () => renderModal(), get SE() { return SE; }, press: () => ({ X: pressCtx(), T: pressTimes(pressCtx()), keys: pressKeys() }), get PRESSDBG() { return { buildQuestions, pressAnswers, pressCtx, PROFILES, pressInterpret }; }, get Wd() { return Wd; }, get MK() { return MK; }, get TRAIN() { return TRAIN; }, get EV() { return EV; }, save: () => save(), get IH() { return { IH_NEW, IH_VAR, ihVars, ord: IHV_ORD }; } }, configurable: true }); } catch (e) {}

// ===== UI parte 6: partida em 2D (campo visto de cima, estilo FM) =====
// Motor visual com modelo tático: cada time tem um bloco (altura da linha de defesa + profundidade),
// que sobe com a posse e recua sem ela, conforme o estilo do treinador. Os jogadores ocupam
// posições relativas ao bloco e à bola (amplitude, apoio dos laterais, cobertura dos volantes,
// atacantes atacando a última linha). A bola circula por decisões de passe/condução/pressão.
// Finalizações só acontecem nos lances capitais do simulador, sempre construídas até a área.
const MV = (() => {
  const LS = 'treineiros:campo';
  const NUM = { GOL: [1], LD: [2], ADD: [2], ZAG: [3, 4, 14], LE: [6], ADE: [6], VOL: [5, 15], MC: [8, 16], MEI: [10], ME: [11], MD: [7], PE: [11], PD: [7], SA: [10], CA: [9, 19] };
  const ROLE = { GOL: 'GK', ZAG: 'CB', LD: 'FB', LE: 'FB', ADD: 'FB', ADE: 'FB', VOL: 'DM', MC: 'CM', ME: 'WM', MD: 'WM', MEI: 'AM', SA: 'AM', PE: 'W', PD: 'W', CA: 'ST' };
  // estilo do treinador -> comportamento do bloco
  const STY = {
    equilibrado: { defL: 0.29, atkL: 0.47, dD: 0.36, aD: 0.44, press: 1, pressFrom: 0.45, fb: 0.28, width: 0.9, tempo: 0.95, fwd: 1.0, len: 0.2, counter: 0.3, inside: 0.4 },
    gegenpress:  { defL: 0.41, atkL: 0.55, dD: 0.32, aD: 0.42, press: 3, pressFrom: 0.2, fb: 0.32, width: 0.88, tempo: 0.8, fwd: 1.1, len: 0.19, counter: 0.5, inside: 0.5 },
    tikitaka:    { defL: 0.37, atkL: 0.57, dD: 0.33, aD: 0.4, press: 2, pressFrom: 0.3, fb: 0.38, width: 0.96, tempo: 0.72, fwd: 0.65, len: 0.14, counter: 0.1, inside: 0.6 },
    contra:      { defL: 0.2, atkL: 0.42, dD: 0.3, aD: 0.5, press: 1, pressFrom: 0.62, fb: 0.14, width: 0.8, tempo: 0.85, fwd: 1.6, len: 0.33, counter: 1, inside: 0.3 },
    direto:      { defL: 0.3, atkL: 0.45, dD: 0.36, aD: 0.5, press: 1, pressFrom: 0.45, fb: 0.2, width: 0.82, tempo: 0.8, fwd: 1.7, len: 0.36, counter: 0.6, inside: 0.3 },
    pressao:     { defL: 0.44, atkL: 0.61, dD: 0.32, aD: 0.4, press: 3, pressFrom: 0.15, fb: 0.5, width: 0.92, tempo: 0.75, fwd: 1.35, len: 0.24, counter: 0.5, inside: 0.5 },
    retranca:    { defL: 0.15, atkL: 0.33, dD: 0.27, aD: 0.42, press: 0, pressFrom: 0.8, fb: 0.06, width: 0.74, tempo: 1.05, fwd: 0.9, len: 0.3, counter: 0.7, inside: 0.3 },
    pontas:      { defL: 0.3, atkL: 0.49, dD: 0.35, aD: 0.45, press: 1, pressFrom: 0.45, fb: 0.4, width: 1.0, tempo: 0.88, fwd: 1.1, len: 0.25, counter: 0.4, inside: 0.1 },
  };
  let cv = null, ctx = null, raf = 0, last = 0, W = 0, H = 0, dpr = 1, clock = 0;
  let pl = [], ball = null, poss = 'h', holder = null, lm = null, script = null, flash = 0, flashSide = null, ended = false, possH = 0.5;
  let colH = '#fff', colA = '#000', speed = 1, onBar = null, decide = 0;
  const TM = { h: null, a: null };
  const possT = { h: 0.01, a: 0.01 };
  const enabled = () => { try { return localStorage.getItem(LS) !== '0'; } catch (e) { return true; } };
  const setEnabled = v => { try { localStorage.setItem(LS, v ? '1' : '0'); } catch (e) {} };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = Math.random;
  const lum = c => { const n = parseInt(c.slice(1), 16); return (0.3 * (n >> 16) + 0.59 * (n >> 8 & 255) + 0.11 * (n & 255)); };
  const dirOf = side => side === 'h' ? 1 : -1;
  const other = side => side === 'h' ? 'a' : 'h';
  const U = (side, x) => side === 'h' ? x : 1 - x;          // x do mundo -> profundidade no referencial do time (0 = próprio gol)
  const X = (side, u) => side === 'h' ? u : 1 - u;
  const alive = () => cv && document.body.contains(cv);
  const name = p => p && P[p.id] ? P[p.id].short : '';
  const ts = () => speed === 1 ? 1 : 2.4;
  function bar(txt, cls, side) { if (onBar) onBar(txt, cls, side ? (side === 'h' ? colH : colA) : null); }

  // ---------- montagem ----------
  function build(T, side) {
    const slots = C.FORMATIONS[T.formation] || C.FORMATIONS['4-3-3'];
    const used = new Set(), out = [];
    slots.forEach(([pos, x, y], i) => {
      const id = (T.xi || [])[i]; if (id == null || !P[id]) return;
      let num = typeof S !== 'undefined' && S && Wd.shirt ? Wd.shirt(S, id) : null;
      if (num == null || used.has(num)) { num = (NUM[pos] || []).find(n => !used.has(n)); if (num == null) { num = 12; while (used.has(num)) num++; } }
      used.add(num);
      const role = ROLE[pos] || 'CM';
      const frac = role === 'GK' ? 0 : clamp((72 - y) / 58, 0, 1);          // 0 = linha de defesa, 1 = linha de frente
      const lat = side === 'h' ? x / 100 : 1 - x / 100;                        // lateral (espelhado pro visitante)
      out.push({ id, side, num, pos, role, gk: role === 'GK', frac, lat, x: 0.5, y: lat, tx: 0.5, ty: lat, ph: rnd() * 6.28, gone: false, alpha: 1, spd: 0.8 + rnd() * 0.3 }); out[out.length - 1].spd0 = out[out.length - 1].spd;
    });
    return out;
  }
  // posição (papel, profundidade e lado) de um jogador a partir do desenho da formação
  function setSlot(p, formation, idx) {
    const sl = (C.FORMATIONS[formation] || [])[idx]; if (!sl) return false;
    const [pos, x, y] = sl, role = ROLE[pos] || 'CM';
    p.pos = pos; p.role = role; p.gk = role === 'GK';
    p.frac = role === 'GK' ? 0 : clamp((72 - y) / 58, 0, 1);
    p.lat = p.side === 'h' ? x / 100 : 1 - x / 100;
    return true;
  }
  function mount(el, match, opts) {
    lm = match; speed = 1; ended = false; half2 = false; script = null; flash = 0; clock = 0; cele = null; possT.h = possT.a = 0.01;
    colH = opts.colH; colA = opts.colA; onBar = opts.bar;
    possH = match.res && match.res.st ? match.res.st.poss[0] / 100 : 0.5;
    const fin = (match.res && match.res.styles) || [];
    const sty = [match.H.style || fin[0] || 'equilibrado', match.A.style || fin[1] || 'equilibrado'];
    TM.h = { side: 'h', st: STY[sty[0]] || STY.equilibrado, L: 0.3, D: 0.36, counterT: 0, lostT: 0, f: match.H.formation };
    TM.a = { side: 'a', st: STY[sty[1]] || STY.equilibrado, L: 0.3, D: 0.36, counterT: 0, lostT: 0, f: match.A.formation };
    pl = [...build(match.H, 'h'), ...build(match.A, 'a')];
    cv = el; ctx = cv.getContext('2d');
    kickoff('h');
    resize(); cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop);
  }
  // gatilho tático: estilo novo e, se o simulador mudou a formação, cada jogador vai pra posição nova
  function tactic(side, style, formation, xi) {
    const T = TM[side]; if (!T) return;
    if (STY[style]) T.st = STY[style];
    if (formation && C.FORMATIONS[formation] && Array.isArray(xi)) {
      T.f = formation;
      xi.forEach((id, i) => { if (id == null) return; const p = pl.find(q => q.side === side && q.id === id && !q.gone); if (p) setSlot(p, formation, i); });
    }
  }
  function resize() {
    if (!cv) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth || 340; W = w * dpr; H = Math.round(w * 0.64) * dpr;
    cv.width = W; cv.height = H; cv.style.height = Math.round(w * 0.64) + 'px';
  }
  const team = side => pl.filter(p => p.side === side && !p.gone);
  const gkOf = side => pl.find(p => p.side === side && p.gk && !p.gone);
  const byId = id => pl.find(p => p.id === id && !p.gone);
  const dist = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * 0.64);
  // atacante de frente pro gol, sem ninguém entre ele e o gol no corredor central
  const oppNear = (p, side) => { let best = null, bd = 9; for (const q of pl) { if (q.gone || q.side === side) continue; const d = dist(p, q); if (d < bd) { bd = d; best = q; } } return { q: best, d: bd }; };
  function kickoff(side) {
    TM.h.L = TM.a.L = 0.28; TM.h.D = TM.a.D = 0.2;
    ball = { x: 0.5, y: 0.5, fx: 0.5, fy: 0.5, tx: 0.5, ty: 0.5, t: 1, dur: 0, cb: null, shot: false, h: 0 };
    poss = side; holder = null;
    for (const p of pl) { if (p.gone) continue; const u = p.gk ? 0.04 : Math.min(0.47, 0.25 + p.frac * 0.24); p.x = p.tx = X(p.side, u); p.y = p.ty = 0.5 + (p.lat - 0.5) * 0.85; }
    const fw = team(side).filter(p => !p.gk).sort((a, b) => (b.frac - a.frac) || Math.abs(a.lat - 0.5) - Math.abs(b.lat - 0.5));
    holder = fw[0] || null;
    if (holder) { holder.x = 0.5 - dirOf(side) * 0.012; holder.y = 0.5; }
    decide = 0.9;
  }

  // ---------- bola ----------
  const shotLog = [];
  function kick(tx, ty, dur, cb, shot, lofted) {
    if (shot && holder !== undefined) shotLog.push({ from: { x: ball.x, y: ball.y }, poss });
    ball.fx = ball.x; ball.fy = ball.y; ball.tx = clamp(tx, -0.02, 1.02); ball.ty = clamp(ty, 0.01, 0.99); ball.t = 0; ball.dur = Math.max(0.05, dur); ball.cb = cb || null; ball.shot = !!shot; ball.lob = !!lofted;
  }
  function passTo(p, cb, opts = {}) {
    const from = holder; holder = null;
    const d = Math.hypot(p.x - ball.x, (p.y - ball.y) * 0.64);
    const lead = opts.lead ?? 0.02;
    kick(p.x + dirOf(p.side) * lead, p.y, (0.22 + d * 1.25) * (opts.fast ? 0.75 : 1), () => { holder = p; setPoss(p.side); if (cb) cb(from); }, false, d > 0.3 || opts.lob);
  }
  function setPoss(side) {
    if (poss !== side) { TM[other(side)].lostT = clock; if (U(side, ball.x) < 0.45 && TM[side].st.counter >= 0.5) TM[side].counterT = clock + 2.6; }
    poss = side;
  }

  // ---------- posicionamento coletivo ----------
  function blockTargets(dt) {
    const bxw = ball.x, byw = ball.y;
    for (const side of ['h', 'a']) {
      const T = TM[side], st = T.st, atk = poss === side, bu = U(side, bxw);
      const counter = atk && clock < T.counterT;
      const gegen = !atk && st.press >= 3 && clock - T.lostT < 2.2;   // contrapressão logo após perder
      let L, D;
      if (atk) { L = st.atkL + clamp(bu - 0.45, -0.25, 0.35) * 0.55; D = st.aD; if (counter) L = Math.min(L, st.defL + 0.08); }
      else { L = st.defL + clamp(bu - 0.5, -0.35, 0.3) * 0.28; D = st.dD; if (gegen) L += 0.08; L = Math.min(L, Math.max(0.1, bu - 0.07)); }
      L = clamp(L, 0.08, 0.7);
      const k = Math.min(1, dt * (atk ? 1.1 : 1.8));   // recompor sem a bola é mais rápido
      T.L += (L - T.L) * k; T.D += (D - T.D) * k;
    }
    for (const p of pl) {
      if (p.gone || p.lock) continue;
      const T = TM[p.side], st = T.st, atk = poss === p.side, bu = U(p.side, bxw);
      const counter = atk && clock < T.counterT;
      const oppL = TM[other(p.side)].L, offside = 1 - oppL + 0.01;     // linha de impedimento no meu referencial
      let u, v;
      if (p.gk) { u = 0.035 + clamp(bu - 0.5, 0, 0.5) * 0.12 + (atk ? 0.03 : 0); v = 0.5 + (byw - 0.5) * 0.28; u = Math.min(u, 0.16); v = clamp(v, 0.3, 0.7); }
      else {
        u = T.L + p.frac * T.D;
        const wide = 0.5 + (p.lat - 0.5) * (atk ? st.width : 0.7);
        v = wide + (byw - 0.5) * (atk ? 0.1 : 0.3);
        if (atk) {
          if (p.role === 'FB') { u += st.fb * 0.3; v = 0.5 + (p.lat - 0.5) * 1.04; }
          if (p.role === 'W' || p.role === 'WM') { if (bu > 0.62 && st.inside > 0.3) v += (0.5 - v) * st.inside * 0.6; else v = 0.5 + (p.lat - 0.5) * 1.05; }
          if (p.role === 'ST') { u = Math.max(u, Math.min(offside - 0.02, 0.9)); if (bu > 0.7) { u = Math.min(0.9, offside + 0.02); v = 0.5 + (p.lat - 0.5) * 0.4 + (byw - 0.5) * 0.15; } }
          if (p.role === 'AM' && bu > 0.6) u = Math.max(u, Math.min(offside - 0.06, 0.8));
          if (p.role === 'DM') u = Math.min(u, bu - 0.06);
          if (counter && ['ST', 'W', 'AM', 'WM'].includes(p.role)) { u = Math.min(offside + 0.03, 0.88); p.sprint = true; } else p.sprint = false;
          if (!counter && ['ST', 'W', 'AM'].includes(p.role)) u = Math.min(u, offside + 0.005);
          if (st.press === 0 && ['CB', 'FB', 'DM'].includes(p.role)) u = Math.min(u, 0.42);            // retranca: defesa não sobe
          if (st.inside <= 0.1 && p.role === 'FB' && (p.lat < 0.5) === (byw < 0.5) && bu > 0.5) u = Math.max(u, Math.min(0.78, bu + 0.06));   // pontas: lateral passa por fora
        } else {
          p.sprint = clock - T.lostT < 1.8 && U(p.side, p.x) > bu;    // recomposição
          if (p.role === 'ST') u = T.L + T.D + 0.05 * st.counter;          // fica como opção de saída
          if (p.role === 'W' || p.role === 'WM') u = T.L + p.frac * T.D * 0.9;
          if (p.role === 'CB' || p.role === 'FB') u = T.L;
        }
      }
      // marcação: sem a bola e com ela no nosso campo, o zagueiro acompanha o atacante da sua faixa (goal-side), sem abandonar a linha
      if (!atk && p.role === 'CB' && bu < 0.55) {
        const m = pl.filter(q => !q.gone && q.side !== p.side && ['ST', 'AM', 'W'].includes(q.role)).map(q => ({ q, uq: U(p.side, q.x) })).filter(o => o.uq < 0.45 && Math.abs(o.q.y - v) < 0.2)
          .sort((a, b) => Math.abs(a.q.y - v) - Math.abs(b.q.y - v))[0];
        if (m) { u = Math.min(u, Math.max(0.05, m.uq - 0.035)); v += (m.q.y - v) * 0.6; }
      }
      u += Math.sin(clock * 0.8 + p.ph) * 0.006;
      v += Math.cos(clock * 0.7 + p.ph) * 0.01;
      p.tx = X(p.side, clamp(u, 0.02, 0.96)); p.ty = clamp(v, 0.04, 0.96);
    }
    // aproximação (tiki-taka e estilos de toque): 2 meio-campistas oferecem linha de passe curta perto de quem tem a bola
    if (holder && !script && !holder.gk && TM[holder.side].st.len <= 0.2) {
      const hs = holder.side, sup = team(hs).filter(p => p !== holder && !p.lock && ['CM', 'AM', 'DM', 'WM'].includes(p.role)).sort((a, b) => dist(a, holder) - dist(b, holder)).slice(0, 2);
      sup.forEach((p, i) => { const ang = (i ? -1 : 1) * 0.9; p.tx = holder.x + dirOf(hs) * 0.07 * Math.cos(ang) - dirOf(hs) * (i ? 0.03 : 0); p.ty = clamp(holder.y + 0.13 * Math.sin(ang), 0.05, 0.95); });
    }
    // quem está com a bola conduz se tiver espaço
    if (holder && !script && !holder.lock) {
      const on = oppNear(holder, holder.side), bu = U(holder.side, holder.x);
      if (on.d > 0.07 && bu < 0.72 && !holder.gk) { holder.tx = holder.x + dirOf(holder.side) * 0.08; holder.ty = holder.y + (0.5 - holder.y) * 0.03; holder.carry = true; }
      else { holder.tx = holder.x; holder.ty = holder.y; holder.carry = false; }
    }
    // pressão: os mais próximos fecham em quem está com a bola, conforme o estilo
    if (holder && !script) {
      const dside = other(holder.side), T = TM[dside], st = T.st;
      const buD = U(dside, holder.x);                                    // bola vista pelo time que defende (0 = seu gol)
      const pressing = buD <= 1 - st.pressFrom || buD < 0.36 || (st.press >= 3 && clock - T.lostT < 2.2);
      const n = !pressing ? 0 : Math.max(1, buD < 0.36 ? 2 : st.press);
      const cands = team(dside).filter(p => !p.gk && !p.lock).sort((a, b) => dist(a, holder) - dist(b, holder)).slice(0, n);
      cands.forEach((p, i) => { p.tx = holder.x - dirOf(holder.side) * (i ? 0.05 : 0.02); p.ty = holder.y + (i ? (holder.y > 0.5 ? -0.05 : 0.05) : 0); p.sprint = true; });
    }
  }
  function move(dt) {
    // separação: ninguém ocupa o mesmo espaço que um companheiro
    const act = pl.filter(p => !p.gone);
    for (let i = 0; i < act.length; i++) for (let j = i + 1; j < act.length; j++) {
      const a = act[i], b = act[j]; if (a.side !== b.side || a.gk || b.gk) continue;
      const dx = a.tx - b.tx, dy = (a.ty - b.ty) * 0.64, d = Math.hypot(dx, dy);
      if (d < 0.045 && d > 1e-5) { const k = (0.045 - d) / d * 0.5; if (!a.lock && a !== holder) { a.tx += dx * k; a.ty += dy * k / 0.64; } if (!b.lock && b !== holder) { b.tx -= dx * k; b.ty -= dy * k / 0.64; } }
    }
    for (const p of pl) {
      if (p.gone) { p.alpha = Math.max(0, p.alpha - dt * 1.5); continue; }
      const vx = p.tx - p.x, vy = (p.ty - p.y) * 0.64, d = Math.hypot(vx, vy);
      const max = (p.run ? 0.3 : p.sprint ? 0.2 : p.carry ? 0.085 : 0.12) * p.spd * dt;
      if (d > 1e-4) { const k = Math.min(1, max / d); p.x += vx * k; p.y += (p.ty - p.y) * k; }
      if (p.gk && !p.free && U(p.side, p.x) > 0.2) p.x = X(p.side, 0.2);   // goleiro não sai da sua região com a bola rolando
    }
  }

  // ---------- decisões com a bola (sem inventar finalizações) ----------
  // posse: vem da circulação (estilo e pressão). A correção só entra de leve quando a posse do campinho se afasta muito da real
  function calib(side) {
    const tot = possT.h + possT.a; if (tot < 30) return 1;
    const share = possT.h / tot, err = share - possH, e2 = Math.abs(err) < 0.02 ? 0 : err - Math.sign(err) * 0.02;
    return side === 'h' ? clamp(1 + e2 * 6, 0.5, 2) : clamp(1 - e2 * 6, 0.5, 2);
  }
  function laneRisk(a, b, side) {
    let m = 9;
    for (const q of pl) {
      if (q.gone || q.side === side) continue;
      const vx = b.x - a.x, vy = (b.y - a.y) * 0.64, wx = q.x - a.x, wy = (q.y - a.y) * 0.64;
      const t = clamp((wx * vx + wy * vy) / (vx * vx + vy * vy || 1), 0, 1);
      m = Math.min(m, Math.hypot(wx - vx * t, wy - vy * t));
    }
    return m;
  }
  function clearance(byP) {
    const side = byP.side;
    holder = null; setPoss(side);
    const tu = 0.45 + rnd() * 0.2, tv = 0.2 + rnd() * 0.6;
    kick(X(side, tu), tv, 0.9, () => {
      const near = pl.filter(p => !p.gone && !p.gk).sort((a, b) => Math.hypot(a.x - ball.x, a.y - ball.y) - Math.hypot(b.x - ball.x, b.y - ball.y));
      const w = near[0].side === side || rnd() < 0.55 ? near[0] : near.find(p => p.side !== near[0].side) || near[0];
      holder = w; setPoss(w.side);
      bar(`${esc(name(w))} fica com a sobra`, '', w.side);
    }, false, true);
  }
  function decideAction() {
    if (!holder) return;
    const h = holder, side = h.side, st = TM[side].st, bu = U(side, h.x), mates = team(side).filter(p => p !== h);
    const pressure = oppNear(h, side);
    const cal = calib(side);
    // desarme quando está sendo pressionado
    if (pressure.d < 0.035 && rnd() < 0.22 * cal) {
      const q = pressure.q; holder = null; kick(q.x, q.y, 0.18, () => { holder = q; setPoss(q.side); });
      bar(`${esc(name(q))} desarma ${esc(name(h))}`, '', q.side); return;
    }
    // último terço: cruzamento afastado, passe pra trás ou perda — nada de chute inventado
    const def = team(other(side)).filter(p => !p.gk).sort((a, b) => dist(a, h) - dist(b, h))[0], g0 = gkOf(other(side));
    const cover = bu > 0.74 ? team(other(side)).filter(p => !p.gk && U(side, p.x) > bu - 0.01 && Math.abs(p.y - h.y) < 0.15).length : 1, dd = def ? dist(def, h) : 9;
    const freeBox = bu > 0.8 && Math.abs(h.y - 0.5) < 0.3 && (dd > 0.05 || !cover);
    if (bu > 0.74 && (rnd() < 0.8 || freeBox)) {
      const q = rnd();
      if ((h.role === 'W' || h.role === 'FB' || h.role === 'WM' || Math.abs(h.y - 0.5) > 0.28) && q < (st.inside <= 0.1 ? 0.75 : 0.45) * Math.min(1.3, cal)) {
        const cb = team(other(side)).filter(p => p.role === 'CB' || p.role === 'FB').sort((a, b) => Math.hypot(a.x - X(side, 0.9), a.y - 0.5) - Math.hypot(b.x - X(side, 0.9), b.y - 0.5))[0];
        if (cb) { holder = null; bar(`${esc(name(h))} cruza, ${esc(name(cb))} afasta de cabeça`, '', cb.side); kick(cb.x, cb.y, 0.55, () => clearance(cb), false, true); return; }
      }
      // livre na área (ninguém entre ele e o gol, ou marcador longe): não recua — goleiro abafa, zagueiro chega na cobertura ou a bola escapa pela linha de fundo
      if (freeBox) {
        const q3 = rnd(); holder = null;
        if (g0 && q3 < 0.35) { bar(C.pick([`${esc(name(h))} demora a finalizar e ${esc(name(g0))} sai do gol pra abafar`, `${esc(name(g0))} sai nos pés de ${esc(name(h))} e fica com a bola`, `${esc(name(h))} tenta driblar ${esc(name(g0))} e perde`], rnd), 'save', g0.side); kick(g0.x, g0.y, 0.35, () => { holder = g0; setPoss(g0.side); }); return; }
        if (def && q3 < 0.78) { def.run = true; bar(dd < 0.04 ? `${esc(name(def))} chega por trás e tira a bola de ${esc(name(h))}` : `${esc(name(def))} chega na cobertura e desarma ${esc(name(h))}`, '', def.side); kick(def.x, def.y, 0.3, () => clearance(def)); return; }
        bar(`${esc(name(h))} domina mal e a bola sai pela linha de fundo`, 'miss', side);
        kick(X(side, 1.02), clamp(h.y + (rnd() - 0.5) * 0.2, 0.3, 0.7), 0.45, () => { const g = gkOf(other(side)); if (g) { ball.x = g.x; ball.y = g.y; ball.t = 1; ball.h = 0; holder = g; setPoss(g.side); } });
        return;
      }
      const back = mates.filter(p => U(side, p.x) < bu - 0.06 && !p.gk).sort((a, b) => laneRisk(h, b, side) - laneRisk(h, a, side))[0];
      if (back && q < Math.min(0.97, 0.85 / Math.min(1.2, cal))) { bar(`${esc(name(h))} rola para ${esc(name(back))}`, '', side); passTo(back); return; }
      const q2 = pressure.q; if (q2) { holder = null; bar(`${esc(name(q2))} tira a bola da área`, '', q2.side); kick(q2.x, q2.y, 0.2, () => clearance(q2)); return; }
    }
    // escolha de passe pelo estilo: progressão, distância preferida, linha de passe e marcação
    let best = null, bs = -1;
    for (const t of mates) {
      if (t.gk && bu > 0.3) continue;
      const g = U(side, t.x) - bu, d = dist(h, t);
      if (d < 0.05) continue;
      const open = oppNear(t, side).d, lane = laneRisk(h, t, side);
      let sc = Math.exp(-Math.pow(d - st.len, 2) / 0.025) * (1 + clamp(g, -0.3, 0.45) * st.fwd * 4.2) * (0.25 + open * 7) * (lane < 0.03 ? 0.25 : lane < 0.06 ? 0.6 : 1);
      if (U(side, t.x) > 0.88) sc *= 0.5;
      if (t.gk) sc *= 0.3;
      if (st.fwd >= 1.6 && t.role === 'ST' && bu < 0.5) sc *= 1.8;          // direto/contra: bola longa no centroavante
      if (st.len <= 0.15 && d > 0.3) sc *= 0.35;                           // tiki-taka: evita o chutão
      sc *= 0.7 + rnd() * 0.6;
      if (sc > bs) { bs = sc; best = t; }
    }
    if (!best) return;
    const lane = laneRisk(h, best, side), len = dist(h, best);
    const risk = (lane < 0.03 ? 0.35 : lane < 0.06 ? 0.14 : 0.05) + (len > 0.35 ? 0.1 : 0);
    if (rnd() < risk * cal) {
      const mx = (h.x + best.x) / 2, my = (h.y + best.y) / 2;
      const q = team(other(side)).filter(p => !p.gk).sort((a, b) => Math.hypot(a.x - mx, a.y - my) - Math.hypot(b.x - mx, b.y - my))[0];
      if (q) { holder = null; bar(`${esc(name(q))} intercepta o passe de ${esc(name(h))}`, '', q.side); kick(q.x, q.y, 0.25 + len * 0.6, () => { holder = q; setPoss(q.side); }); return; }
    }
    const g = U(side, best.x) - bu;
    // de frente pro gol e com o caminho livre, o atacante não recua: segue conduzindo pra área
    const verb = len > 0.33 ? 'lança' : g < -0.05 ? 'recua para' : g > 0.12 ? 'enfia para' : 'toca para';
    bar(`${esc(name(h))} ${verb} ${esc(name(best))}`, '', side);
    passTo(best, null, { lead: g > 0.1 ? 0.04 : 0.015 });
  }

  // ---------- passo de simulação ----------
  function step(dt) {
    const dts = dt * ts(); clock += dts;
    if (!ended) possT[poss] += dts;
    blockTargets(dts); move(dts);
    if (ball.t < 1) {
      ball.t = Math.min(1, ball.t + dts / ball.dur);
      const e = ball.shot ? ball.t : 1 - Math.pow(1 - ball.t, 2);
      ball.x = ball.fx + (ball.tx - ball.fx) * e; ball.y = ball.fy + (ball.ty - ball.fy) * e;
      ball.h = ball.lob ? Math.sin(Math.PI * ball.t) : 0;
      if (ball.t >= 1 && ball.cb) { const cb = ball.cb; ball.cb = null; cb(); }
    } else if (holder) { ball.x = holder.x + dirOf(holder.side) * 0.011; ball.y = holder.y + 0.01; ball.h = 0; }
    if (script) runScript(dts);
    else if (!ended && holder && ball.t >= 1) {
      decide -= dts;
      const pr = oppNear(holder, holder.side).d;
      if (decide <= 0 || (pr < 0.03 && decide > 0.25)) { decide = TM[holder.side].st.tempo * (0.55 + rnd() * 0.7); decideAction(); }
    }
    if (flash > 0) flash = Math.max(0, flash - dt);
    celeStep(dts);
  }

  // ---------- lances capitais (do simulador), sempre construídos até a área ----------
  function runScript(dts) {
    const s = script; if (s.busy) return;
    s.wait -= dts; if (s.wait > 0) return;
    const fn = s.steps.shift();
    if (!fn) { const cb = s.cb; script = null; cb && cb(); return; }
    s.busy = true; fn(() => { s.busy = false; s.wait = 0; });
  }
  function wants(e) { return ['goal', 'save', 'miss', 'red', 'red2', 'goal_off', 'var'].includes(e.t); }
  const later = (sec, fn) => setTimeout(fn, sec * 1000 / ts());
  const VARB = (txt) => `<span class="varb">VAR</span> ${txt}`;
  function play(e, fx, cb) {
    if (!alive() || !enabled()) { cb(); return; }
    const steps = [], nm = id => P[id] ? esc(P[id].short) : '';
    const say = (txt, cls, side, sec) => done => { bar(txt, cls, side); later(sec, done); };
    if (e.t === 'red' || e.t === 'red2') {
      const p = byId(e.p);
      if (e.v === 'var') { steps.push(say(VARB(`chama o árbitro para revisar lance de ${nm(e.p)}…`), 'var', e.s, 1.4)); }
      steps.push(done => { bar(`${ic('card', '', 'color:var(--coral)')} ${e.v === 'var' ? 'Após revisão, vermelho' : 'Vermelho'} pra ${nm(e.p)}`, 'bad', e.s); if (p) { p.gone = true; if (holder === p) { holder = null; const q = team(p.side).find(x => !x.gk); if (q) passTo(q); } } later(1, done); });
      script = { steps, cb, wait: 0, busy: false }; return;
    }
    if (e.t === 'var' && e.k === 'hand') {
      steps.push(say(VARB('checa possível toque de mão na área…'), 'var', e.s, 1.5));
      steps.push(say(VARB('sem infração. Segue o jogo.'), '', e.s, 0.8));
      script = { steps, cb, wait: 0, busy: false }; return;
    }
    const s = e.s, o = other(s), d = dirOf(s);
    const isPen = !!e.pen || (e.t === 'var' && e.k === 'pen_off');
    const out = team(s).filter(p => !p.gk);
    const shooter = (e.p != null && byId(e.p) && byId(e.p).side === s && !byId(e.p).gk ? byId(e.p) : null) || out.slice().sort((a, b) => b.frac - a.frac)[0];
    const asnP = e.t === 'goal' && e.a != null && e.a >= 0 ? byId(e.a) : null;
    const asn = asnP && asnP.side === s && !asnP.gk ? asnP : null;     // goleiro nunca vira armador no campo adversário
    const creator = asn && asn !== shooter ? asn : out.filter(p => p !== shooter && ['W', 'WM', 'AM', 'FB', 'CM'].includes(p.role)).sort((a, b) => U(s, b.x) - U(s, a.x) + (rnd() - 0.5) * 0.2)[0] || out.find(p => p !== shooter);
    const gk = gkOf(o);
    const longShot = isPen ? false : e.t !== 'goal' ? rnd() < 0.18 : rnd() < 0.08;
    // 1) recupera a bola
    steps.push(done => {
      if (holder && holder.side === s && !holder.gk) return done();
      const near = out.filter(p => p !== shooter).sort((a, b) => dist(a, ball) - dist(b, ball))[0] || creator;
      // quem vai recuperar corre até a bola (até ~1,2 s); só então desarma ou antecipa
      near.lock = true; near.run = true; let tries = 0;
      const chase = () => {
        near.tx = ball.x; near.ty = ball.y;
        if (dist(near, ball) > 0.035 && tries++ < 12) return later(0.1, chase);
        near.lock = false; near.run = false;
        const msg = ball.t < 1 ? `${nm(near.id)} antecipa e fica com a bola` : holder ? `${nm(near.id)} desarma ${esc(name(holder))}` : `${nm(near.id)} fica com a bola`;
        bar(msg, '', s); holder = null; kick(near.x, near.y, 0.18, () => { holder = near; setPoss(s); done(); });
      };
      chase();
    });
    // 2) progressão: o time sobe junto, passes para frente até o último terço
    for (let i = 0; i < 3; i++) steps.push(done => {
      if (!holder || U(s, holder.x) > 0.6) return done();
      const bu = U(s, holder.x);
      const ahead = out.filter(p => p !== holder && p !== shooter && U(s, p.x) > bu + 0.08 && U(s, p.x) < 0.8).sort((a, b) => (laneRisk(holder, b, s) - laneRisk(holder, a, s)) + (rnd() - 0.5) * 0.04)[0]
        || (U(s, creator.x) > bu ? creator : null);
      if (!ahead) { holder.tx = holder.x + d * 0.12; return later(0.6, done); }
      const g = U(s, ahead.x) - bu;
      bar(`${esc(name(holder))} ${g > 0.3 ? 'lança' : 'avança com'} ${esc(name(ahead))}`, '', s);
      passTo(ahead, () => later(0.25, done), { lead: 0.03 });
    });
    // 3) quem cria recebe no último terço
    steps.push(done => {
      // quem já está com a bola dentro/na entrada da área não recua pro criador: serve o finalizador direto
      if (holder === creator || (holder && U(s, holder.x) >= 0.72)) return later(0.2, done);
      creator.lock = true; creator.run = true;
      const wide = ['W', 'WM', 'FB'].includes(creator.role);
      creator.tx = X(s, wide ? 0.8 : 0.72); creator.ty = wide ? (creator.lat < 0.5 ? 0.12 : 0.88) : 0.5 + (creator.lat - 0.5) * 0.5;
      later(0.45, () => { bar(`${esc(name(holder))} encontra ${nm(creator.id)}`, '', s); passTo(creator, () => done(), { lead: 0.02 }); });
    });
    let su = 0.85, sv = 0.5;
    if (isPen) {
      // pênalti: jogada na área, falta, (VAR) e cobrança da marca
      steps.push(done => {
        shooter.lock = true; shooter.run = true; su = 0.86; sv = 0.5 + (rnd() - 0.5) * 0.2; shooter.tx = X(s, su); shooter.ty = sv;
        const fb = e.f != null ? byId(e.f) : null, def = fb && fb.side === o && !fb.gone ? fb : team(o).filter(p => !p.gk).sort((a, b) => Math.hypot(a.x - X(s, su), a.y - sv) - Math.hypot(b.x - X(s, su), b.y - sv))[0];
        if (def) { def.lock = true; def.run = true; def.tx = X(s, su + 0.015); def.ty = sv + 0.02; }
        later(0.3, () => { if (holder && holder !== shooter) { const spot = X(s, su); holder = null; kick(spot, sv, 0.6, () => { shooter.x = spot; shooter.y = sv; holder = shooter; setPoss(s); later(0.3, done); }); } else later(0.6, done); });
      });
      if (e.t === 'var' && e.k === 'pen_off') {
        steps.push(say(`Pênalti marcado para o ${esc(s === 'h' ? fx.h : fx.a)}!`, '', s, 1));
        steps.push(say(VARB('chama o árbitro ao monitor…'), 'var', s, 1.5));
        steps.push(done => { bar(VARB('pênalti desmarcado. Não houve falta.'), 'var', o); pl.forEach(p => { p.lock = false; p.run = false; }); const g = gkOf(o); if (g) { holder = null; kick(g.x, g.y, 0.5, () => { holder = g; setPoss(o); }); } later(1, done); });
        script = { steps, cb, wait: 0, busy: false }; return;
      }
      if (e.v === 'pen') { steps.push(say(VARB('revisa possível pênalti…'), 'var', s, 1.5)); steps.push(say(`Após o VAR, pênalti para o ${esc(s === 'h' ? fx.h : fx.a)}!${e.f != null && P[e.f] ? ` Falta de ${nm(e.f)}.` : ''}`, '', s, 1)); }
      else steps.push(say(`Pênalti para o ${esc(s === 'h' ? fx.h : fx.a)}!${e.f != null && P[e.f] ? ` Falta de ${nm(e.f)}.` : ''}`, '', s, 1.1));
      steps.push(done => {
        holder = null; pl.forEach(p => { if (p !== shooter && !p.gk && U(s, p.x) > 0.83) { p.lock = true; p.tx = X(s, 0.8); p.ty = p.y; } });
        su = 0.895; sv = 0.5; shooter.tx = shooter.x = X(s, 0.855); shooter.ty = shooter.y = 0.47; ball.x = X(s, 0.9); ball.y = 0.5; ball.t = 1; ball.h = 0;
        if (gk) { gk.lock = true; gk.tx = gk.x = X(s, 0.985); gk.ty = gk.y = 0.5; }
        bar(`${nm(shooter.id)} ajeita a bola na marca. ${gk ? nm(gk.id) : 'O goleiro'} se posiciona…`, '', s); later(1.3, done);
      });
      steps.push(done => { shooter.run = false; shooter.lock = true; shooter.tx = X(s, 0.893); shooter.ty = 0.5; shooter.spd = 0.55; bar(`${nm(shooter.id)} corre para a bola…`, '', s); later(0.75, done); });
    } else {
      // 4) finalizador ataca o espaço (área, ou entrada da área no chute de longe)
      steps.push(done => {
        shooter.lock = true; shooter.run = true;
        su = longShot ? 0.74 + rnd() * 0.04 : 0.83 + rnd() * 0.07; sv = 0.5 + (rnd() - 0.5) * (longShot ? 0.3 : 0.26);
        shooter.tx = X(s, su); shooter.ty = sv;
        team(o).filter(p => !p.gk && p.role !== 'ST').sort((a, b) => Math.hypot(a.x - X(s, su), a.y - sv) - Math.hypot(b.x - X(s, su), b.y - sv)).slice(0, 2)
          .forEach((p, i) => { p.lock = true; p.run = true; p.tx = X(s, su + 0.03); p.ty = sv + (i ? 0.06 : -0.05); });
        if (holder === shooter) { bar(`${nm(shooter.id)} ajeita para o chute…`, '', s); const tr = Math.hypot(shooter.x - X(s, su), (shooter.y - sv) * 0.64) / (0.3 * shooter.spd); return later(Math.min(2.2, tr) + 0.1, done); }
        later(0.35, () => {
          if (!holder) return done();
          const cross = Math.abs(holder.y - 0.5) > 0.28;
          bar(cross ? `${esc(name(holder))} cruza na área…` : `${esc(name(holder))} serve ${nm(shooter.id)}…`, '', s);
          const spotX = X(s, su), travel = Math.hypot(shooter.x - spotX, (shooter.y - sv) * 0.64) / (0.3 * shooter.spd);
          holder = null;
          kick(spotX, sv, Math.max(0.4, travel + 0.05), () => { shooter.x = spotX; shooter.y = sv; holder = shooter; setPoss(s); done(); }, false, cross);
        });
      });
    }
    // 5) finalização
    const into = e.t === 'goal' || e.t === 'goal_off';
    steps.push(done => {
      const gx = s === 'h' ? 1.0 : 0.0;
      holder = null; poss = s;
      if (gk) { gk.lock = true; gk.run = true; }
      if (into) {
        const gy = 0.5 + (rnd() < 0.5 ? -1 : 1) * (0.015 + rnd() * 0.035);
        if (gk) { gk.tx = gk.x; gk.ty = 0.5 + (gy < 0.5 ? 0.08 : -0.08); if (isPen) { gk.free = true; gk.dive = gy < 0.5 ? 1 : -1; } }
        kick(gx + d * 0.012, gy, isPen ? 0.34 : 0.28, () => {
          if (e.t === 'goal' && e.v !== 'late') { flash = 1.6; flashSide = s; bar(`GOL! ${nm(e.p)}${e.pen ? ' (pênalti)' : ''}`, 'goal', s); }
          else bar(e.t === 'goal_off' || e.v === 'late' ? `A bola entra… mas o assistente levanta a bandeira!` : `A bola entra!`, '', s);
          done();
        }, true);
      } else if (e.t === 'save') {
        const gy = 0.5 + (rnd() - 0.5) * 0.1;
        if (gk) { gk.tx = gk.x; gk.ty = isPen ? 0.5 + (rnd() < 0.5 ? -1 : 1) * 0.06 : gy; if (isPen) { gk.free = true; gk.dive = gk.ty < 0.5 ? -1 : 1; } }
        kick((gk ? gk.x : gx) - d * 0.01, isPen && gk ? gk.ty : gy, 0.3, () => { if (gk) { holder = gk; setPoss(o); } bar(`Defesa de ${gk ? nm(gk.id) : 'goleiro'}${e.pen ? ' no pênalti' : ''}!`, 'save', o); done(); }, true);
      } else {
        const gy = 0.5 + (rnd() < 0.5 ? -1 : 1) * (0.1 + rnd() * 0.08);
        kick(gx + d * 0.02, gy, 0.32, () => { bar(`${nm(e.p)} ${e.pen ? 'bate o pênalti' : 'finaliza'}… pra fora!`, 'miss', s); done(); }, true);
      }
    });
    // VAR depois do gol: checagem, anulação ou validação tardia
    if (e.t === 'goal_off') {
      steps.push(say(VARB('revisando o lance…'), 'var', s, 1.6));
      steps.push(say(VARB(`gol anulado: ${esc(e.why || 'impedimento')}.`), 'var', o, 1.2));
    } else if (e.t === 'goal' && e.v === 'chk') {
      steps.push(say(VARB('checa o gol…'), 'var', s, 1.4));
      steps.push(done => { flash = 0.8; flashSide = s; bar(VARB(`gol confirmado! ${nm(e.p)}`), 'goal', s); later(0.8, done); });
    } else if (e.t === 'goal' && e.v === 'late') {
      steps.push(say(VARB('revisando o impedimento…'), 'var', s, 1.6));
      steps.push(done => { flash = 1.6; flashSide = s; bar(VARB(`posição legal! GOL VALIDADO de ${nm(e.p)}`), 'goal', s); later(1, done); });
    }
    steps.push(done => later(e.t === 'goal' ? 1.4 : 0.8, done));
    // 6) recomeço
    steps.push(done => {
      pl.forEach(p => { p.lock = false; p.run = false; p.dive = 0; p.free = false; p.spd = p.spd0 || p.spd; });
      if (e.t === 'goal') kickoff(o);
      else if (e.t === 'miss' || e.t === 'goal_off') { const g = gkOf(o); if (g) { ball.x = g.x; ball.y = g.y; ball.t = 1; ball.h = 0; holder = g; setPoss(o); } }
      decide = 0.7; done();
    });
    script = { steps, cb, wait: 0, busy: false };
  }
  function finish() {
    if (!script) return;
    const cb = script.cb; script = null;
    pl.forEach(p => { p.lock = false; p.run = false; });
    cb && cb();
  }
  // reorganização após expulsão: ocupa o papel de quem saiu (goleiro ou defensor)
  function takeSpot(p, gkSpot) {
    const gone = pl.filter(q => q.side === p.side && q.gone && !q.used && (gkSpot ? q.gk : !q.gk)).pop();
    if (!gone) return;
    p.frac = gone.frac; p.lat = gone.lat; p.role = gone.role; p.pos = gone.pos; if (gkSpot) { p.gk = true; p.num = 12; }
    gone.used = true;
  }
  function reorg(e) {
    const p = byId(e.p); if (!p) return;
    const f = e.f || (TM[p.side] && TM[p.side].f);
    if (e.slot == null || !setSlot(p, f, e.slot)) takeSpot(p, /gol/.test(e.why || ''));
    else { const g = pl.filter(q => q.side === p.side && q.gone && !q.used).pop(); if (g) g.used = true; }
    bar(`${esc(name(p))} ${esc(e.why || 'muda de posição')}`, '', p.side);
  }
  function sub(e) {
    const p = byId(e.o); if (!p || !P[e.p]) return;
    const f = e.f || (TM[p.side] && TM[p.side].f);
    if (e.slot != null && setSlot(p, f, e.slot)) { if (p.gk) p.num = 12; }
    else if (P[e.p].pos === 'GOL' && !p.gk) takeSpot(p, true);
    p.id = e.p; { const n2 = Wd.shirt(S, e.p); if (n2 != null) p.num = n2; } bar(`${ic('swap')} ${esc(P[e.o] ? P[e.o].short : '')} sai, ${esc(P[e.p].short)} entra`, 'sub', p.side);
  }
  function end() { ended = true; script = null; holder = null; kick(0.5, 0.5, 0.6); pl.forEach(p => { p.lock = false; p.run = false; }); }
  let half2 = false;
  function halftime() { if (half2) return; if (script) finish(); half2 = true; kickoff('a'); }
  function setSpeed(v) { speed = v; }

  // ---------- disputa de pênaltis ----------
  // kicks: [{ s: 'h'|'a', r: 'goal'|'save'|'miss' }] na ordem das cobranças
  let so = null, cele = null;
  function shootout(kicks, fx, onKick, cb) {
    if (!alive() || !enabled()) { kicks.forEach((k, i) => onKick && onKick(i)); cb && cb(); return; }
    script = null; ended = true; holder = null; flash = 0;
    const GX = 0.9, order = { h: team('h').filter(p => !p.gk).sort((a, b) => b.frac - a.frac), a: team('a').filter(p => !p.gk).sort((a, b) => b.frac - a.frac) };
    for (const sd of ['h', 'a']) { const id = fx && fx.pk && fx.pk[sd]; const i = id != null ? order[sd].findIndex(p => p.id === id) : -1; if (i > 0) order[sd].unshift(order[sd].splice(i, 1)[0]); }   // cobrador oficial abre a série
    // todo mundo no meio-campo, abraçados; goleiros perto da área
    pl.forEach(p => { if (p.gone) return; p.lock = true; p.run = false; p.dive = 0; p.free = true;
      if (p.gk) { p.tx = 0.62; p.ty = p.side === 'h' ? 0.38 : 0.62; }
      else { const i = order[p.side].indexOf(p); p.tx = 0.5 + (i % 2 ? 0.012 : -0.012); p.ty = (p.side === 'h' ? 0.3 : 0.56) + i * 0.013; } });
    ball = { x: 0.5, y: 0.5, fx: 0.5, fy: 0.5, tx: 0.5, ty: 0.5, t: 1, dur: 0, cb: null, shot: false, h: 0 };
    const steps = [], cnt = { h: 0, a: 0 };
    steps.push(done => { bar(`${ic('whistle')} Disputa de pênaltis!`, 'var', null); kick(GX, 0.5, 0.8); later(1.6, done); });
    kicks.forEach((k, i) => {
      const s = k.s, o = other(s), sh = order[s][cnt[s]++ % Math.max(1, order[s].length)], g = gkOf(o), g2 = gkOf(s);
      steps.push(done => {
        if (g2) { g2.tx = 0.62; g2.ty = s === 'h' ? 0.62 : 0.38; g2.run = true; }
        if (g) { g.tx = 0.985; g.ty = 0.5; g.dive = 0; g.run = true; }
        ball.x = GX; ball.y = 0.5; ball.t = 1; ball.h = 0;
        if (sh) { sh.x = Math.max(sh.x, GX - 0.2); sh.run = true; sh.tx = GX - 0.05; sh.ty = 0.47; }
        bar(`Cobrança ${Math.floor(i / 2) + 1} · ${esc(s === 'h' ? fx.h : fx.a)}: ${sh ? esc(name(sh)) : ''}`, '', s);
        later(1.1, done);
      });
      // o batedor só parte pra bola com o goleiro já em cima da linha (espera até ~2,5 s e, se preciso, encaixa)
      steps.push(done => { const t0 = Date.now(), ready = () => !g || (Math.abs(g.x - g.tx) < 0.01 && Math.abs(g.y - g.ty) < 0.02);
        const go = () => { if (g) { g.x = g.tx; g.y = g.ty; g.run = false; } if (sh) { sh.x = GX - 0.05; sh.y = 0.47; sh.run = false; sh.tx = GX - 0.006; sh.ty = 0.5; } later(0.55, done); };
        const poll = () => { if (!alive()) return done(); if (ready() || (Date.now() - t0) * ts() > 2500) go(); else setTimeout(poll, 60); };
        poll(); });
      steps.push(done => {
        const side = rnd() < 0.5 ? -1 : 1, gy = k.r === 'miss' ? 0.5 + side * (0.1 + rnd() * 0.05) : 0.5 + side * (0.02 + rnd() * 0.035);
        if (g) { g.dive = k.r === 'save' ? side : (rnd() < 0.7 ? -side : side); g.ty = 0.5 + g.dive * 0.06; }
        const tx = k.r === 'save' ? 0.975 : 1.012;
        kick(tx, k.r === 'save' ? 0.5 + (g ? g.dive : side) * 0.055 : gy, 0.32, () => {
          if (k.r === 'goal') { flash = 0.9; flashSide = 'h'; bar(`${ic('ball')} ${sh ? esc(name(sh)) : ''} converte!`, 'goal', s); }
          else if (k.r === 'save') bar(`Defendeu ${g ? esc(name(g)) : 'o goleiro'}!`, 'save', o);
          else bar(`${sh ? esc(name(sh)) : ''} bate… pra fora!`, 'miss', s);
          onKick && onKick(i);
          later(1.0, done);
        }, true);
      });
      steps.push(done => { if (sh) { sh.tx = 0.5; sh.ty = s === 'h' ? 0.34 : 0.6; } if (g) { g.dive = 0; g.ty = 0.5; } later(0.3, done); });
    });
    script = { steps, cb: () => { pl.forEach(p => { p.dive = 0; }); cb && cb(); }, wait: 0, busy: false };
  }
  // ---------- comemoração de título ----------
  function celebrate(side, label, crestUrl, champName) {
    if (!alive()) return;
    script = null; ended = true; holder = null;
    const img = new Image(); if (crestUrl) img.src = crestUrl;
    cele = { side, label, champName, t: 0, img, bits: Array.from({ length: 70 }, () => ({ x: rnd(), y: -rnd() * 0.6, v: 0.15 + rnd() * 0.25, w: rnd() * 6.28, c: ['#D7FF3A', '#FFF06A', '#F7A1EC', '#5A7BFA', '#fff', '#FF7A59'][Math.floor(rnd() * 6)] })) };
    const win = team(side), lose = team(other(side));
    win.forEach((p, i) => { p.lock = true; p.run = true; p.free = true; const a = i / win.length * 6.28; p.tx = 0.5 + Math.cos(a) * 0.1; p.ty = 0.64 + Math.sin(a) * 0.13; p.ring = a; });
    lose.forEach((p, i) => { p.lock = true; p.run = false; p.free = true; p.tx = i < 6 ? 0.04 : 0.96; p.ty = 0.3 + (i % 6) * 0.08; p.alpha = 0.55; });
    ball.x = ball.tx = 0.5; ball.y = ball.ty = 0.55; ball.t = 1; ball.h = 0;
    bar(`${ic('trophy')} ${esc(champName)} campeão!`, 'goal', side);
  }
  function celeStep(dt) {
    if (!cele) return;
    cele.t += dt;
    for (const p of team(cele.side)) { p.ring += dt * 0.9; p.tx = 0.5 + Math.cos(p.ring) * 0.1; p.ty = 0.64 + Math.sin(p.ring) * 0.13; }
    for (const b of cele.bits) { b.y += b.v * dt; b.w += dt * 5; if (b.y > 1.05) { b.y = -0.05; b.x = rnd(); } }
  }
  function drawTrophy(c, x, y, s) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#FFD84A'; c.strokeStyle = '#8A6A00'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-20, -30); c.lineTo(20, -30); c.quadraticCurveTo(20, 5, 0, 10); c.quadraticCurveTo(-20, 5, -20, -30); c.fill(); c.stroke();
    c.beginPath(); c.arc(-22, -18, 9, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(22, -18, 9, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
    c.fillRect(-4, 10, 8, 12); c.fillRect(-14, 22, 28, 7); c.strokeRect(-14, 22, 28, 7);
    c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(-12, -26, 5, 22);
    c.restore();
  }

  // ---------- desenho ----------
  function draw() {
    const c = ctx, m = W * 0.035, my = H * 0.05, pw = W - 2 * m, ph = H - 2 * my;
    const PX = x => m + (half2 ? 1 - x : x) * pw, PY = y => my + (half2 ? 1 - y : y) * ph;   // 2º tempo: times trocam de lado (giro de 180°)
    c.fillStyle = '#2E7D32'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 12; i++) { if (i % 2) { c.fillStyle = '#2A7430'; c.fillRect(m + i * pw / 12, my, pw / 12, ph); } }
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = Math.max(1.5, W * 0.003);
    c.strokeRect(m, my, pw, ph);
    c.beginPath(); c.moveTo(PX(0.5), my); c.lineTo(PX(0.5), my + ph); c.stroke();
    c.beginPath(); c.arc(PX(0.5), PY(0.5), ph * 0.16, 0, 7); c.stroke();
    const box = (x0, w, h) => c.strokeRect(x0, PY(0.5) - h / 2, w, h);
    box(m, pw * 0.157, ph * 0.6); box(m + pw * (1 - 0.157), pw * 0.157, ph * 0.6);
    box(m, pw * 0.052, ph * 0.27); box(m + pw * (1 - 0.052), pw * 0.052, ph * 0.27);
    c.beginPath(); c.arc(PX(0.105), PY(0.5), ph * 0.012, 0, 7); c.arc(PX(0.895), PY(0.5), ph * 0.012, 0, 7); c.fillStyle = 'rgba(255,255,255,.8)'; c.fill();
    const gw = m * 0.7, gh = ph * 0.11;
    [[m - gw, half2 ? 'h' : 'a'], [m + pw, half2 ? 'a' : 'h']].forEach(([gx, sd]) => {
      const lit = flash > 0 && flashSide === sd && Math.floor(flash * 6) % 2 === 0;
      c.fillStyle = lit ? '#D7FF3A' : 'rgba(255,255,255,.35)'; c.fillRect(gx, PY(0.5) - gh / 2, gw, gh);
      c.strokeStyle = '#fff'; c.strokeRect(gx, PY(0.5) - gh / 2, gw, gh);
    });
    const r = Math.max(7 * dpr, W * 0.021);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const p of pl) {
      if (p.alpha <= 0) continue;
      const col = p.gk ? (p.side === 'h' ? '#FFD84A' : '#5FF5D6') : (p.side === 'h' ? colH : colA);
      c.globalAlpha = p.alpha;
      c.beginPath(); c.arc(PX(p.x), PY(p.y) + r * 0.25, r, 0, 7); c.fillStyle = 'rgba(0,0,0,.25)'; c.fill();
      c.beginPath(); if (p.dive) c.ellipse(PX(p.x), PY(p.y), r * 0.8, r * 1.55, p.dive * 0.5, 0, 7); else c.arc(PX(p.x), PY(p.y), r, 0, 7); c.fillStyle = col; c.fill();
      c.lineWidth = r * 0.16; c.strokeStyle = p === holder ? '#fff' : 'rgba(0,0,0,.55)'; c.stroke();
      c.fillStyle = lum(col) > 150 ? '#111' : '#fff'; c.font = `800 ${Math.round(r * 1.05)}px system-ui, sans-serif`;
      c.fillText(String(p.num), PX(p.x), PY(p.y) + r * 0.05);
      c.globalAlpha = 1;
    }
    if (holder) {
      c.font = `700 ${Math.round(r * 0.95)}px system-ui, sans-serif`;
      const tx = PX(holder.x), ty = PY(holder.y) + r * 2, tw = c.measureText(name(holder)).width + r;
      c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(tx - tw / 2, ty - r * 0.7, tw, r * 1.4);
      c.fillStyle = '#fff'; c.fillText(name(holder), tx, ty);
    }
    const br = r * 0.5, lift = ball.h * r * 1.6;
    if (ball.shot && ball.t < 1) { c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = br; c.beginPath(); c.moveTo(PX(ball.fx + (ball.x - ball.fx) * 0.6), PY(ball.fy + (ball.y - ball.fy) * 0.6)); c.lineTo(PX(ball.x), PY(ball.y)); c.stroke(); }
    if (lift > 0.5) { c.beginPath(); c.arc(PX(ball.x), PY(ball.y), br * 0.8, 0, 7); c.fillStyle = 'rgba(0,0,0,.3)'; c.fill(); }
    c.beginPath(); c.arc(PX(ball.x), PY(ball.y) - lift, br * (1 + ball.h * 0.35), 0, 7); c.fillStyle = '#fff'; c.fill(); c.lineWidth = br * 0.35; c.strokeStyle = '#111'; c.stroke();
    if (flash > 0 && flashSide) {
      c.globalAlpha = Math.min(1, flash); c.fillStyle = 'rgba(215,255,58,.18)'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#D7FF3A'; c.font = `900 ${Math.round(H * 0.2)}px 'Saira Condensed', system-ui, sans-serif`; c.fillText('GOL!', W / 2, H / 2);
      c.globalAlpha = 1;
    }
    if (cele) {
      const k = Math.min(1, cele.t / 0.8);
      c.fillStyle = `rgba(10,8,30,${0.35 * k})`; c.fillRect(0, 0, W, H);
      for (const b of cele.bits) { c.save(); c.translate(b.x * W, b.y * H); c.rotate(b.w); c.fillStyle = b.c; c.fillRect(-r * 0.25, -r * 0.45, r * 0.5, r * 0.9); c.restore(); }
      const bounce = Math.abs(Math.sin(cele.t * 3)) * H * 0.02;
      drawTrophy(c, W / 2, H * 0.34 - bounce, (H / 260) * (0.6 + 0.4 * k));
      c.globalAlpha = k;
      if (cele.img && cele.img.complete && cele.img.naturalWidth) { const s2 = H * 0.16; c.imageSmoothingEnabled = false; c.drawImage(cele.img, W * 0.5 - s2 * 2.1, H * 0.2, s2, s2 * cele.img.naturalHeight / cele.img.naturalWidth); c.drawImage(cele.img, W * 0.5 + s2 * 1.1, H * 0.2, s2, s2 * cele.img.naturalHeight / cele.img.naturalWidth); }
      c.fillStyle = '#FFF06A'; c.font = `900 ${Math.round(H * 0.13)}px 'Saira Condensed', system-ui, sans-serif`; c.fillText('CAMPEÃO!', W / 2, H * 0.1 + H * 0.02);
      c.fillStyle = '#fff'; c.font = `800 ${Math.round(H * 0.055)}px system-ui, sans-serif`; { const tx = `${cele.champName}${cele.label ? ' · ' + cele.label : ''}`, tw = c.measureText(tx).width + H * 0.06; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(W / 2 - tw / 2, H * 0.855, tw, H * 0.09); c.fillStyle = '#fff'; c.fillText(tx, W / 2, H * 0.9); }
      c.globalAlpha = 1;
    }
  }
  function loop(now) {
    if (!alive()) { raf = 0; return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (cv.clientWidth && Math.abs(cv.clientWidth * dpr - W) > 2) resize();
    step(dt); if (cv.clientWidth) draw();
    raf = requestAnimationFrame(loop);
  }
  function numbers(T) { const map = {}; build(T, 'h').forEach(p => { map[p.id] = p.num; }); return map; }
  // leitura pra testes: posições médias
  function probe() { return { shots: shotLog.slice(-50), poss, L: { h: TM.h.L, a: TM.a.L }, ball: { x: ball.x, y: ball.y }, pl: pl.filter(p => !p.gone).map(p => ({ side: p.side, role: p.role, x: p.x, y: p.y })) }; }
  return { shootout, celebrate, mount, wants, play, finish, sub, reorg, tactic, end, halftime, setSpeed, enabled, setEnabled, numbers, probe, get busy() { return !!script; } };
})();

function teamInk(col) { const n = parseInt(String(col).slice(1), 16); return (0.3 * (n >> 16) + 0.59 * (n >> 8 & 255) + 0.11 * (n & 255)) > 150 ? '#111' : '#fff'; }
function mvHTML() {
  const on = MV.enabled();
  return `<div class="mvwrap" id="mv-wrap" ${on ? '' : 'hidden'}><canvas id="mv-cv" aria-label="Partida vista de cima"></canvas><div class="mvbar" id="mv-bar">Bola rolando!</div></div>`;
}
function mvStart(lm, colH, colA) {
  const cv = document.getElementById('mv-cv'); if (!cv) return;
  MV.mount(cv, lm, { colH, colA, bar: (t, cls, col) => { const b = document.getElementById('mv-bar'); if (!b) return; b.innerHTML = t; b.className = 'mvbar ' + (cls || '') + (col ? ' tc' : '');
    if (col) { b.style.setProperty('--tc', col); b.style.setProperty('--tt', teamInk(col)); } else { b.style.removeProperty('--tc'); b.style.removeProperty('--tt'); } } });
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="mvtoggle"]'); if (!el) return;
  const on = !MV.enabled(); MV.setEnabled(on);
  const w = document.getElementById('mv-wrap'); if (w) w.hidden = !on;
  el.classList.toggle('on', on);
  if (!on && MV.busy) MV.finish();
});

// ===== UI parte 7: DM, ficha do treinador, escalações em lista, banco manual, filtros, notificações =====

// ---------- bonequinho de clube com treinador humano ----------
function coachTag(club) {
  if (!club || !S || !Wd.isHuman(S, club)) return '';
  return `<span class="ctag" role="button" tabindex="0" data-act="coach" data-club="${esc(club)}" title="Técnico: ${esc(S.coaches[club] ? S.coaches[club].name : '')}">${ic('user')}</span>`;
}
function openCoach(club) {
  const tok = Wd.deskOf(S, club); if (!tok) return;
  const back = UI.modal && ['club', 'match'].includes(UI.modal.type) ? UI.modal : null;
  UI.modal = { type: 'coach', tok, back }; renderModal();
}
// carreira acumulada: temporadas anteriores (registradas) + temporada atual recalculada dos jogos disputados
function coachSeasonLive(d) {
  const club = d.club; if (!club || d.unemployed || !S.played) return null;
  const o = { club, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, bigW: null, bigL: null }, joined = (d.joined || 0) - 3600000;
  for (const k in S.played) for (const m of S.played[k]) {
    if (m.h !== club && m.a !== club) continue;
    if (SE.toReal(S, SE.slotTime(S, +k)) < joined) continue;
    const my = m.h === club ? m.gh : m.ga, ot = m.h === club ? m.ga : m.gh, opp = m.h === club ? m.a : m.h, df = my - ot;
    o.j++; o.gp += my; o.gc += ot; o[df > 0 ? 'v' : df < 0 ? 'd' : 'e']++;
    const txt = `${club} ${my}–${ot} ${opp} (${SE.COMP_NAME[m.comp]} ${S.season})`;
    if (df > 0 && (!o.bigW || df > o.bigW.df)) o.bigW = { df, g: my, txt };
    if (df < 0 && (!o.bigL || -df > o.bigL.df)) o.bigL = { df: -df, txt };
  }
  return o;
}
function coachCareer(d) {
  const c = d.cst || {}, seasons = JSON.parse(JSON.stringify(c.seasons || {}));
  const live = coachSeasonLive(d);
  if (live && (!seasons[S.season] || live.j > seasons[S.season].j)) seasons[S.season] = live;
  for (const h of d.hist || []) if (!seasons[h.season]) seasons[h.season] = { club: h.club, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, noStats: true };
  const tot = { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 }, clubs = {};
  for (const [se, x] of Object.entries(seasons)) {
    for (const k in tot) tot[k] += x[k] || 0;
    const cl = clubs[x.club] = clubs[x.club] || { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, from: +se, to: +se };
    for (const k of ['j', 'v', 'e', 'd', 'gp', 'gc']) cl[k] += x[k] || 0; cl.from = Math.min(cl.from, +se); cl.to = Math.max(cl.to, +se);
  }
  const better = (a, b, big) => !a ? b : !b ? a : (b.df > a.df ? b : a);
  return { seasons, tot, clubs, bigW: better(c.bigW, live && live.bigW), bigL: better(c.bigL, live && live.bigL) };
}
// ---------- estante de selos ----------
const SELO_G = {
  missao: '<circle cx="12" cy="12" r="7.5"/><path d="M8.3 12.4l2.6 2.6 5-5.4"/>',
  papa: '<path d="M4.5 17.5h15l-1.2-9-4.3 3.6L12 5.5l-2 6.6-4.3-3.6z"/><path d="M5 20.5h14"/>',
  copeiro: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5.2a2.8 2.8 0 0 0 2.9 3.3M16 5.5h2.8a2.8 2.8 0 0 1-2.9 3.3M12 13v3.5M8.5 20h7l-.8-3.5h-5.4z"/>',
  leite: '<path d="M12 3.5c2.8 4 4.6 6.8 4.6 9.2a4.6 4.6 0 0 1-9.2 0c0-2.4 1.8-5.2 4.6-9.2z"/><path d="M3.5 20.5l3.5-3 3 2 3.5-3.5 3 2.5 4-2"/>',
  salvador: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.2"/><path d="M6.7 6.7l3 3M14.3 14.3l3 3M17.3 6.7l-3 3M9.7 14.3l-3 3"/>',
  rolo: '<circle cx="8" cy="15.5" r="4"/><circle cx="8" cy="15.5" r="1.2"/><path d="M12 15.5h8v-5h-4l-2.2-3.5H9v4.6M16 10.5V7"/>',
  muralha: '<path d="M3.5 6.5h17v12h-17zM3.5 10.5h17M3.5 14.5h17M9 6.5v4M15 6.5v4M6.5 10.5v4M12 10.5v4M17.5 10.5v4M9 14.5v4M15 14.5v4"/>',
  acesso: '<path d="M12 18V5.5M6.5 11l5.5-5.5 5.5 5.5M5 20.5h14"/>',
  tipster: '<path d="M6.2 9.2 4.6 4.8l4.2 2.1M17.8 9.2l1.6-4.4-4.2 2.1"/><path d="M12 6.6c-4.1 0-7.3 3-7.3 7 0 3.7 3.2 6.8 7.3 6.8s7.3-3.1 7.3-6.8c0-4-3.2-7-7.3-7z"/><path d="M12 6.6v2.3M9.6 7.1l.7 1.8M14.4 7.1l-.7 1.8M4.9 12.2l2.2.5M19.1 12.2l-2.2.5M5.2 15.4l2-.2M18.8 15.4l-2-.2"/><circle cx="9.4" cy="12.4" r="1" fill="currentColor"/><circle cx="14.6" cy="12.4" r="1" fill="currentColor"/><path d="M10.8 15.2h2.4L12 16.4z" fill="currentColor"/><path d="M12 16.4v.9M10.2 18.1c.6.4 1.2.5 1.8.5s1.2-.1 1.8-.5"/>',
  formador: '<path d="M12 20.5v-8"/><path d="M12 12.5c0-3.6-2.6-6-6.5-6 0 3.6 2.6 6 6.5 6z"/><path d="M12 10c0-3.3 2.4-5.5 6-5.5 0 3.3-2.4 5.5-6 5.5z"/><path d="M7.5 20.5h9"/>',
  prim: '<path d="M6 4.5h12l3 4.8-9 10.7L3 9.3z"/><path d="M3 9.3h18M9.2 4.5L7.6 9.3 12 20l4.4-10.7-1.6-4.8"/>',
};
function seloIcon(d, n) {
  return `<span class="selo ${d.rare ? 'rare' : ''}" style="--sc:${d.col}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${SELO_G[d.k] || ''}</svg>${n > 0 ? `<i>${n}</i>` : ''}</span>`;
}
function seloShelf(badges) {
  const cnt = k => k === 'missao' ? badges.filter(b => b.kind === 'obj').length : badges.filter(b => b.kind === 'selo' && b.k === k).length;
  const items = C.SELOS.map(d => ({ d, n: cnt(d.k) })).filter(x => x.n > 0 || !x.d.rare);
  return `<div class="shelf">${items.map(({ d, n }) => `<button class="shelfi ${n ? '' : 'off'}" data-act="selo" data-k="${d.k}" title="${esc(d.label)}">${seloIcon(d, n)}<small>${esc(d.label)}</small></button>`).join('')}</div>`;
}
// ---------- v200: DNA do clube e fama (EM TESTE: só mostra, não muda nada no jogo) ----------
const DNA_K = ['form', 'proj', 'raca', 'camisa'];
// v253: ícone do DNA com as duas cores do clube entrelaçadas (fita do principal passa por cima embaixo, a do secundário em cima)
function dnaIc(club, cls = '', style = '') {
  const k = C.dnaOf && C.dnaOf(club); if (!k) return ic('dna', cls, style);
  const k2 = C.dna2Of && C.dna2Of(club), a = C.DNA_INFO[k].c, b = k2 ? C.DNA_INFO[k2].c : a, st = c => `style="stroke:${c}"`;
  return `<svg class="ic dnaw ${cls}" viewBox="0 0 24 24" fill="none" stroke-width="2.3" stroke-linecap="round" style="${style}" aria-hidden="true"><path d="M8.6 5.2h3.4M9.4 12h2.6M8.6 18.8h3.4" ${st(a)} opacity=".6"/><path d="M12 5.2h3.4M12 12h2.6M12 18.8h3.4" ${st(b)} opacity=".6"/><path d="M6 3c0 4 12 5 12 9" ${st(a)}/><path d="M18 3c0 4-12 5-12 9" ${st(b)}/><path d="M6 12c0 4 12 5 12 9" ${st(b)}/><path d="M18 12c0 4-12 5-12 9" ${st(a)}/></svg>`;
}
function dnaChip(club, opt = {}) {
  const k = C.dnaOf && C.dnaOf(club); if (!k) return '';
  const D = C.DNA_INFO[k];
  const k2 = C.dna2Of && C.dna2Of(club), D2 = k2 && C.DNA_INFO[k2];   // v251: Opção B mostra o secundário menor
  return `<button class="dnachip" data-act="dnainfo" data-k="${k}" style="--dc:${D.c}">${dnaIc(club)}<span class="dl">DNA</span><b>${esc(D.l)}</b></button>${D2 ? ` <button class="dnachip s2" data-act="dnainfo" data-k="${k2}" data-s2="1" style="--dc:${D2.c}" title="Secundário: vale metade">+ ${esc(D2.l)}</button>` : ''}${opt.q ? ` <span class="dnaqs">"${esc(D.q)}"</span>` : ''}`;
}
// etiqueta pequena (dentro de listas, sem toque)
const dnaTag = club => { const k = C.dnaOf && C.dnaOf(club); if (!k) return ''; const D = C.DNA_INFO[k], k2 = C.dna2Of && C.dna2Of(club), D2 = k2 && C.DNA_INFO[k2]; return `<span class="dnatag" style="--dc:${D.c}">${dnaIc(club)}${esc(D.l)}${D2 ? `<small style="color:${D2.c}">+ ${esc(D2.l)}</small>` : ''}</span>`; };
// números da temporada que respondem à pergunta de cada DNA, pra um clube
function dnaStats(club) {
  const ids = Wd.squad(S, club), yng = ids.filter(id => ageOf(id) <= 23);
  const ymin = yng.reduce((a, id) => a + ((vw(id).st || {}).min || 0), 0), yn = yng.filter(id => ((vw(id).st || {}).min || 0) > 0).length;
  let dW = 0, dJ = 0, dP = 0, hW = 0, hJ = 0, hP = 0;
  for (const L of Object.values(S.played || {})) for (const m of L || []) {
    if (!m || m.comp === 'AMI' || m.gh == null || (m.h !== club && m.a !== club)) continue;
    const home = m.h === club, my = home ? m.gh : m.ga, ot = home ? m.ga : m.gh, pts = my > ot ? 3 : my === ot ? 1 : 0;
    if (C.isDerby(m.h, m.a)) { dJ++; dP += pts; if (pts === 3) dW++; }
    if (home && !m.neutral) { hJ++; hP += pts; if (pts === 3) hW++; }
  }
  const tok = Wd.deskOf(S, club), fin = tok && S.desks[tok] ? (S.desks[tok].fin || {}) : null;
  const cashD = fin && fin.cash0 != null ? Math.round((S.cash[club] || 0) - fin.cash0) : null, mkt = fin ? Math.round((fin.sold || 0) - (fin.spent || 0)) : null;
  let op = null; try { op = SE.oprStatus(S, club); } catch (e) {}
  return { ymin, yn, dW, dJ, dP, hW, hJ, hP, cashD, mkt, cash0: fin && fin.cash0, op };
}
const dnaLine = (k, x) => k === 'form' ? `${fmt(x.ymin)} min de jovens (até 23) · ${x.yn === 1 ? '1 jovem usado' : `${x.yn} jovens usados`}`
  : k === 'proj' ? (x.mkt == null ? 'Os números do caixa aparecem pra clube com treinador da liga.' : `${x.cashD != null ? `Caixa ${x.cashD >= 0 ? '+' : '−'}T$ ${fmt(Math.abs(x.cashD))} desde o início · ` : ''}mercado ${x.mkt >= 0 ? '+' : '−'}T$ ${fmt(Math.abs(x.mkt))} (vendas − compras)`)
  : k === 'raca' ? `Clássicos: ${x.dP} pts em ${x.dJ} jogo${x.dJ === 1 ? '' : 's'} · em casa: ${x.hP} pts em ${x.hJ}`
  : x.op ? `${x.op.pos}º na Série ${x.op.o.div} · esperado: até ${x.op.o.max}º` : 'Sem campeonato em andamento.';
// fama (prévia): 6 traços por temporada, do que o técnico fez no clube dele
function famaDots(k, x) {
  const n = k === 'form' ? Math.floor(x.ymin / 450) : k === 'proj' ? (x.cashD == null || !x.cash0 ? 0 : Math.floor(x.cashD / Math.max(1, Math.abs(x.cash0)) * 10)) + (x.mkt > 0 ? 1 : 0)
    : k === 'raca' ? Math.floor((x.dW * 2 + x.hW) / 3) : x.op && x.op.j ? 3 + (x.op.o.max - x.op.pos) : 0;
  return Math.max(0, Math.min(6, n));
}
// v205: fama do treinador. 4 famas, 6 traços por temporada; fechou 6/6 na virada, ganha a tag (máx. 2; cai se não renovar)
const famaLine = (k, x) => k === 'form' ? `${Math.round(x.share * 100)}% dos minutos com jovens (até 23) · ${x.yn === 1 ? '1 jovem usado' : `${x.yn} jovens usados`}`
  : k === 'proj' ? `Mercado ${x.mkt >= 0 ? '+' : '−'}T$ ${fmt(Math.abs(x.mkt))} · folha ${x.pay0 ? (x.pay <= x.pay0 ? 'igual ou menor' : `+${Math.round((x.pay / x.pay0 - 1) * 100)}%`) : 'sem base ainda'}${x.arr ? ' · teve atraso' : ''}${x.cashD == null ? '' : ` · caixa ${x.cashD >= 0 ? 'acima' : 'abaixo'} do início`}`
  : k === 'raca' ? (x.ratio == null ? 'Conta depois de 3 jogos em casa e 3 fora.' : `Em casa ${(x.hP / x.hJ).toFixed(1).replace('.', ',')} pts/jogo · fora ${(x.aP / x.aJ).toFixed(1).replace('.', ',')}`)
  : x.rk && x.rk.j ? `${x.rk.pos}º na Série ${x.rk.div} · elenco é o ${x.rk.exp}º da série` : 'Sem campeonato em andamento.';
function famaBlock(d, tok, mine, dk, dk2) {
  const F = d.fama || {}, tags = (F.tags || []).filter(t => C.FAMA_INFO[t.k]);
  let x = null; if (!d.unemployed && d.club) try { x = Wd.asDesk(S, tok, () => SE.famaStats(S)); } catch (e) {}
  const chips = tags.length ? `<div class="famtags">${tags.map(t => { const I = C.FAMA_INFO[t.k]; return `<span class="famtag" style="--fc:${I.c}">${ic(I.i)}<b>${esc(I.l)}</b><small>${t.n > 1 ? `${t.n}× · ` : ''}desde ${t.since}</small></span>`; }).join('')}</div>`
    : `<p class="small muted" style="margin:0 0 8px">${mine ? 'Você ainda não tem fama.' : 'Ainda sem fama.'}</p>`;
  const on = new Set(tags.map(t => t.k)), tagOf = k => tags.find(t => t.k === k);
  // v253: árvore da fama — 4 galhos saindo da raiz; cada traço da temporada acende um nó; 6/6 acende a copa do galho (a fama)
  const cards = `<div class="ftree">${SE.FAMA_K.map(k => { const I = C.FAMA_INFO[k], n = x ? SE.famaDots(k, x) : 0, t = tagOf(k), m = dk === k ? 1 : dk2 === k ? 2 : 0;
    return `<div class="fbr ${on.has(k) ? 'on' : ''} ${n >= 6 ? 'full' : ''}" style="--fc:${I.c};--fp:${Math.round(n / 6 * 100)}%" data-act="famainfo" data-k="${k}" role="button" tabindex="0" title="${esc(I.how)}">
      <span class="fcrown">${on.has(k) ? ic(I.i) : ic('lock')}</span><small class="fct">${on.has(k) ? (t && t.n > 1 ? `${t.n}× · desde ${t.since}` : `desde ${t ? t.since : ''}`) : n >= 6 ? 'fecha na virada' : `${n}/6`}</small>
      <div class="fnodes">${[6, 5, 4, 3, 2, 1].map(i => `<i class="${i <= n ? 'f' : ''}"></i>`).join('')}</div>
      <span class="froot">${ic(I.i)}</span><b class="disp">${esc(I.l)}</b>${m ? `<span class="fmatch ${m === 2 ? 'f2' : ''}" title="${m === 2 ? 'O secundário do clube pede esta (vale metade)' : 'O DNA do clube pede esta'}">${dnaIc(d.club)}</span>` : ''}
      ${x && !x.out ? `<small class="fnum">${esc(famaLine(k, x))}</small>` : ''}</div>`; }).join('')}</div>`;
  const note = !x ? (d.unemployed ? 'Sem clube: os traços só andam comandando um time.' : '')
    : x.out ? `Trocou de clube nesta temporada: a fama no ${esc(d.club)} começa a contar na próxima.`
    : x.late ? `Chegou no ${esc(d.club)} com a temporada andando: conta só o que foi feito desde a chegada.` : '';
  return `<h3 class="sech" style="font-size:20px">${ic('fama')} Fama</h3>${chips}
    ${cards}<p class="small muted" style="margin:4px 0 0">Cada nó é um traço desta temporada. Galho cheio (6/6) na virada vira fama; fama que não renova cai.</p>
    ${note ? `<p class="small muted" style="margin:6px 0 0">${note}</p>` : ''}
    ${mine ? `<p class="small muted" style="margin:6px 0 0">Traços da temporada ${S.season}. Fechou os 6 de uma fama até a virada, ganha a tag no seu cartão. Ela se renova se você repetir; se passar uma temporada sem fechar, cai. Valem no máximo 2 ao mesmo tempo. Por enquanto a fama é reconhecimento: ainda não muda nada no jogo.</p>` : ''}`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="famainfo"]'); if (!el) return;
  ev.stopImmediatePropagation(); const I = C.FAMA_INFO[el.dataset.k]; if (I) toast(`${I.l}: ${I.how}`);
}, true);
function dnaBlock(d, tok, mine) {
  const k = d && !d.unemployed && d.club && C.dnaOf(d.club); if (!k) return famaBlock(d, tok, mine);
  const D = C.DNA_INFO[k], x = dnaStats(d.club), k2 = C.dna2Of && C.dna2Of(d.club), D2 = k2 && C.DNA_INFO[k2];
  return `<h3 class="sech dnash">${dnaIc(d.club)} DNA do ${esc(d.club)}</h3>
    <div class="dnab" style="--dc:${D.c}">
      <div class="dnah"><span class="dnaic">${dnaIc(d.club)}</span><div class="dnan"><small>DNA</small><b class="disp">${esc(D.l)}</b></div><span class="dnaf">${ic(D.fi)} pede ${esc(D.fama)}</span></div>
      <p class="dnaq">"${esc(D.q)}"</p>
      <div class="dnast">${esc(dnaLine(k, x))}</div>
      <p class="dnad">${esc(D.d)}</p>
      ${D2 ? `<div class="dna2" style="--dc2:${D2.c}"><span>${ic('dna')} Secundário: <b>${esc(D2.l)}</b></span><span>"${esc(D2.q)}" vale metade.</span></div>` : ''}</div>
    ${famaBlock(d, tok, mine, k, k2)}
    <p class="small muted" style="margin:6px 0 0">O cartão com ${ic('dna', '', 'width:12px;height:12px;vertical-align:-2px')} é a fama que o DNA do clube pede: entregar isso pinta a faixa colorida nos pilares da Sustentação.${D2 ? ' O cartão com o ícone mais apagado é o secundário: também pinta a faixa, valendo metade.' : ''}</p>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="dnainfo"]'); if (!el) return;
  ev.stopImmediatePropagation(); const D = C.DNA_INFO[el.dataset.k]; if (D) toast(`${el.dataset.s2 ? 'Secundário' : 'DNA'} ${D.l} · "${D.q}" ${D.d}${el.dataset.s2 ? ' Como secundário, vale metade.' : ''} Fama de quem entrega: ${D.fama}.`);
}, true);

// perfil do treinador: mapa de dois eixos formado pelas respostas nas coletivas
function tpfBlock(d, mine) {
  const P2 = EV.coachProfile(d), A = P2.A;
  const px = v => Math.round(50 + Math.max(-1, Math.min(1, v)) * 36);
  const dot = P2.n ? `<i class="tpdot${P2.ready ? '' : ' wip'}" style="left:${px(P2.x)}%;top:${px(P2.y)}%;--pc:${A ? A.c : 'var(--muted)'}"></i>` : '';
  const q = (k, pos) => `<span class="tpq ${pos}${P2.ready && P2.arch === k ? ' on' : ''}" style="--pc:${EV.TPF_ARCH[k].c}">${EV.TPF_ARCH[k].l}</span>`;
  const head = !P2.n ? `<b class="disp">Sem coletivas ainda</b><small>${mine ? 'Responda coletivas: o tom das respostas define o seu perfil.' : 'Ainda não respondeu coletivas.'}</small>`
    : !P2.ready ? `<b class="disp">Em formação</b><small>${P2.n} de ${EV.TPF_MIN} respostas pra firmar o perfil. Tendência: ${A.l}.</small>`
    : `<b class="disp" style="color:${A.c}">${ic(A.i)} ${A.l}${P2.ousL ? ` · ${P2.ousL}` : ''}</b><small>${A.d} ${P2.firmL[0].toUpperCase() + P2.firmL.slice(1)} (${P2.n} respostas).</small>`;
  return `<h3 class="sech" style="font-size:20px">${ic('mic')} Perfil de treinador</h3>
    <div class="tpf"><div class="tphead">${head}</div>
      <div class="tpmap"><span class="tpax l">Sereno</span><span class="tpax r">Intenso</span><span class="tpax t">Protetor</span><span class="tpax b">Exigente</span>
        <i class="tpcross h"></i><i class="tpcross v"></i><i class="tpmid"></i>${q('diplomata', 'tl')}${q('paizao', 'tr')}${q('gestor', 'bl')}${q('xerife', 'br')}${q('equilibrado', 'c')}${dot}</div>
      ${mine ? `<p class="small muted" style="margin:6px 0 0">Não existe perfil melhor: cada clube procura um tipo de treinador. No futuro, as vagas abertas vão levar isso em conta. As respostas recentes pesam mais, então dá pra mudar aos poucos.</p>` : ''}</div>`;
}
function coachModal(m) {
  const d = S.desks[m.tok]; if (!d) return '<p class="muted">Treinador não encontrado.</p>';
  const K = coachCareer(d), c = K.tot;
  const ap = x => x.j ? Math.round((x.v * 3 + x.e) / (x.j * 3) * 100) + '%' : '–';
  const tro = (d.badges || []).filter(b => b.kind === 'trophy'), objs = (d.badges || []).filter(b => b.kind === 'obj' || b.kind === 'award');
  const G = generalCareer(d), curS = K.seasons[S.season] || { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 };
  const cur = !d.unemployed && K.clubs[d.club];
  const st6 = (x) => `<div class="st6">${[['Jogos', x.j], ['Vitórias', x.v], ['Empates', x.e], ['Derrotas', x.d], ['Aprov.', ap(x)], ['Gols', `${x.gp}:${x.gc}`]].map(([l, v]) => `<div><b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>`;
  const clubs = Object.entries(K.clubs).sort((a, b) => b[1].to - a[1].to).map(([cl, x]) => `<div class="res" style="grid-template-columns:auto 1fr auto"><span>${crest(cl, 'sm')}</span><span><b>${esc(cl)}</b> <span class="muted small">${x.from}${x.to !== x.from ? '–' + x.to : ''} · ${x.to - x.from + 1} temporada${x.to > x.from ? 's' : ''} · ${x.j} jogos</span></span><span class="small">${x.v}V ${x.e}E ${x.d}D</span></div>`).join('');
  const seasons = Object.entries(K.seasons).sort((a, b) => b[0] - a[0]).map(([se, x]) => {
    const h = (d.hist || []).find(h => h.season === +se);
    return `<div class="res" style="grid-template-columns:44px 1fr auto"><b>${se}</b><span>${crest(x.club, 'sm')} ${esc(x.club)}${h ? ` <span class="muted small">· ${h.pos}º Série ${h.div}</span>` : +se === S.season ? ' <span class="muted small">· em andamento</span>' : ''}</span><span class="small">${x.noStats ? '<span class="muted">sem registro</span>' : `${x.v}V ${x.e}E ${x.d}D · ${x.gp}:${x.gc}`}</span></div>`;
  }).join('');
  const acc = accBox(m.tok);
  return `<div class="coachm">
    <div class="cmhead2"><div class="cav2">${coachImg(d.avatar, d.club)}</div><div><h2 class="disp">${esc(d.manager)}</h2>
      <div class="row" style="gap:6px;flex-wrap:wrap">${d.unemployed ? `<span class="pill">sem clube</span>` : `<span class="pill">${crest(d.club, 'sm')} ${esc(d.club)}</span>`}${m.tok === S.__me ? '<span class="pill adm">você</span>' : ''}</div></div></div>
    <div class="cgsum"><div><span class="eyebrow" style="margin:0">Carreira geral</span><b class="disp">${G.j} jogos · ${G.titles} título${G.titles === 1 ? '' : 's'}</b><small>${ap(G)} de aproveitamento · ${G.seasons} temporada${G.seasons === 1 ? '' : 's'} · ${G.clubs.length} clube${G.clubs.length === 1 ? '' : 's'}${G.leagues > 1 ? ` · ${G.leagues} ligas` : ''}${G.awards ? ` · ${G.awards} prêmio(s) individual(is)` : ''}</small></div>
      <div class="cur"><span class="eyebrow" style="margin:0">Temporada ${S.season}${S.league ? ' · ' + esc(S.league.name) : ''}</span><b class="disp">${curS.j} jogos · ${ap(curS)}</b><small>${curS.v}V ${curS.e}E ${curS.d}D · gols ${curS.gp}:${curS.gc}</small></div></div>
    ${dnaBlock(d, m.tok, m.tok === S.__me)}
    <h3 class="sech" style="font-size:20px">${ic('user')} Carreira geral</h3>${st6(G)}
    ${G.leagues > 1 ? `<p class="small muted" style="margin:-4px 0 0">Inclui ${G.leagues - 1} outra(s) liga(s)/carreira(s) do mesmo perfil.</p>` : ''}
    <h3 class="sech" style="font-size:20px">${ic('cal')} Nesta liga</h3>${st6(c)}
    ${cur ? `<h3 class="sech" style="font-size:20px">${crest(d.club, 'sm')} No ${esc(d.club)}</h3>${st6(cur)}` : ''}
    <div class="kv">${K.bigW ? `<span>Maior vitória</span><b>${esc(K.bigW.txt)}</b>` : ''}${K.bigL ? `<span>Maior derrota</span><b>${esc(K.bigL.txt)}</b>` : ''}</div>
    ${acc}<h3 class="sech" style="font-size:20px">${ic('medal')} Estante de selos</h3>${seloShelf(d.badges || [])}
    <h3 class="sech" style="font-size:20px">${ic('trophy')} Títulos · ${tro.length}</h3>
    ${tro.length ? `<div class="chips">${tro.map(b => `<span class="pill" style="color:var(--yellow)">${ic('trophy')} ${esc(b.label)} ${b.season}${b.club ? ` · ${esc(b.club)}` : ''}</span>`).join('')}</div>` : '<p class="muted small" style="margin:0">Nenhum título ainda.</p>'}
    ${objs.length ? `<h3 class="sech" style="font-size:20px">${ic('medal')} Prêmios e objetivos</h3><div class="chips">${objs.map(b => `<span class="pill" ${b.kind === 'award' ? 'style="color:var(--yellow)"' : ''}>${b.kind === 'award' ? ic('medal') + ' ' : ''}${esc(b.label)} · ${esc(b.club)} ${b.season}</span>`).join('')}</div>` : ''}
    <h3 class="sech" style="font-size:20px">${ic('shirt')} Clubes</h3><div>${clubs || '<p class="muted small" style="margin:0">Ainda sem jogos oficiais.</p>'}</div>
    ${seasons ? `<h3 class="sech" style="font-size:20px">${ic('cal')} Por temporada</h3><div>${seasons}</div>` : ''}
  </div>`;
}

// ---------- DM: departamento médico ----------
const INJ_CAT = { mus: 'Muscular', art: 'Articular / ligamento', oss: 'Óssea', cab: 'Cabeça', con: 'Contusão' };
function dmView() {
  const ids = mySquad();
  const hurt = ids.filter(id => vw(id).inj > 0).sort((a, b) => vw(a).inj - vw(b).inj);
  const other = ids.filter(id => vw(id).inj <= 0 && (Wd.susOf(vw(id), null) > 0 || vw(id).ban > 0 || !SE.lineupAvail(S, id)));
  const fragile = ids.filter(id => SE.fragOf(S, id) >= 1.3 && vw(id).inj <= 0).sort((a, b) => SE.fragOf(S, b) - SE.fragOf(S, a)).slice(0, 5);
  const card = id => {
    const s = vw(id), I = C.INJURIES[s.injK], tot = Math.max(s.inj, s.injTot || s.inj), done = Math.round((1 - s.inj / tot) * 100);
    const trainIn = Math.max(0, s.inj - Math.ceil(tot * 0.3));
    const back = SE.slotTime(S, Math.min(SE.SLOTS - 1, S.slot + s.inj - 1));
    const inf = SE.infilInfo(S, id), fr = SE.fragOf(S, id);
    return `<div class="dmc"><div class="row" style="gap:10px">${av(id)}<div class="grow" style="min-width:0"><b>${plink(id, P[id].name)}</b><div class="small muted">${esc(C.POS_NAME[P[id].pos] || P[id].pos)} · ${ageOf(id)} anos${fr >= 1.3 ? ` · <span style="color:var(--coral)">histórico de lesões</span>` : ''}</div></div><span class="ob ${cat(s.ovr).k} num">${s.ovr}</span></div>
      <div class="dmdx"><span class="eyebrow" style="margin:0">Diagnóstico</span><b>${esc(s.injT || (I && I.n) || 'Lesão')}</b>${I ? `<span class="small muted">${esc(I.d)} · ${INJ_CAT[I.cat] || ''}</span>` : ''}</div>
      <div class="dmbar"><i style="width:${done}%"></i></div>
      <div class="dmk"><div><span>Recuperação</span><b>${done}%</b></div><div><span>Treinos</span><b>${trainIn ? `em ${trainIn} jogo${trainIn > 1 ? 's' : ''}` : 'já treina'}</b></div><div><span>Jogos</span><b>${s.inj} jogo${s.inj > 1 ? 's' : ''}</b></div><div><span>Previsão</span><b>${when(back)}</b></div></div>
      ${inf.done ? `<div class="note ok">${ic('med')} Infiltrado para o próximo jogo · risco ${Math.round(inf.risk * 100)}%</div>`
        : inf.ok ? `<div class="infil"><div class="small"><b>Infiltração para o próximo jogo</b> (${esc(inf.imp)}). Ele joga, mas pode agravar a lesão e ficar muito mais tempo fora.</div>
          <div class="row between"><span class="risk" style="--rk:${inf.risk > 0.45 ? 'var(--coral)' : inf.risk > 0.25 ? 'var(--orange)' : 'var(--yellow)'}">Risco ${Math.round(inf.risk * 100)}%</span><button class="btn sm coral" data-act="infil" data-id="${id}">${ic('med')} Infiltrar</button></div></div>`
        : `<div class="small ${inf.blocked ? '' : 'muted'}" ${inf.blocked ? 'style="color:var(--coral)"' : ''}>${ic('lock')} ${inf.blocked ? '<b>Não permite infiltração.</b> ' : ''}${esc(inf.blocked ? (I && I.cat === 'oss' ? 'Fratura precisa consolidar.' : 'Lesão grave: só o tratamento completo.') : inf.why)}</div>`}</div>`;
  };
  return `<div class="tile dmhead"><div class="row between"><div><div class="eyebrow" style="margin:0">${ic('med')} Departamento médico</div><b class="disp" style="font-size:26px">${hurt.length} no DM</b></div><div class="small muted" style="text-align:right">Temporada: ${ids.reduce((t, id) => t + (vw(id).injN || 0), 0)} lesões</div></div></div>
    ${hurt.length ? hurt.map(card).join('') : `<div class="tile"><p class="muted" style="margin:0">Ninguém no departamento médico. Elenco 100%.</p></div>`}
    ${other.length ? `<h2 class="sech">${ic('card')} Outros desfalques</h2><div class="tile" style="padding:4px 12px"><div class="list">${other.map(id => playerRow(id, { meta: id2 => { const s = vw(id2); return Wd.susOf(s, null) > 0 ? susText(s) : s.ban > 0 ? `Afastado por ${s.ban} jogo(s)` : `Seleção · ${Math.max(0, s.away - 1)} jogo(s)`; } })).join('')}</div></div>` : ''}
    ${fragile.length ? `<h2 class="sech">${ic('heart')} Atenção à carga</h2><div class="tile" style="padding:4px 12px"><div class="list">${fragile.map(id => playerRow(id, { meta: id2 => `Propensão a lesões ${SE.fragOf(S, id2) >= 1.6 ? 'muito alta' : 'alta'} · condição ${Math.round(vw(id2).cond)}` })).join('')}</div></div>` : ''}
    <p class="muted small" style="margin:0">O histórico do jogador pesa: quem já teve muitas lesões se machuca mais e tem mais chance de reincidência. Poupar os cansados reduz o risco.</p>`;
}

// ---------- escalações em lista (casa × visitante) ----------
function lineupsLists(lm, upto) {
  if (!lm || !lm.H || !lm.A) return '';
  const evs = Array.isArray(upto) ? upto : (lm.res.ev || []).filter(e => upto == null || minOf(e.m) <= upto);
  const side = (T, sd) => {
    const nums = MV.numbers(T), slots = C.FORMATIONS[T.formation] || C.FORMATIONS['4-3-3'];
    const cap = (T.xi || []).filter(Boolean).slice().sort((a, b) => vw(b).ovr - vw(a).ovr)[0];
    const rows = (T.xi || []).map((id, i) => {
      if (id == null || !P[id]) return '';
      const out = evs.find(e => e.t === 'sub' && e.o === id && e.s === sd);
      const g = evs.filter(e => e.t === 'goal' && e.p === id).length, red = evs.some(e => (e.t === 'red' || e.t === 'red2') && e.p === id);
      const yc = evs.some(e => e.t === 'yellow' && e.p === id);
      const pos = (slots[i] || [P[id].pos])[0];   // v179: escalação com mais nomes que o esquema não derruba o ao vivo
      const gi = out ? evs.filter(e => e.t === 'goal' && e.p === out.p).length : 0;
      return `<div class="lrow ${out ? 'subbed' : ''}"><span class="ln">${nums[id] ?? ''}</span><span class="lnm">${plink(id, P[id].short)}${id === cap ? '<i class="capb">C</i>' : ''}${pos === 'GOL' ? `<i class="gkb">${ic('glove')}</i>` : ''}${'<i class="gb"></i>'.repeat(g)}${yc && !red ? '<i class="yb"></i>' : ''}${red ? '<i class="rb"></i>' : ''}</span><span class="lp">${out ? `<i class="subo" title="Saiu">${out.m}'</i>` : pos}</span></div>
        ${out ? `<div class="lsub"><i class="subi" title="Entrou"></i>${plink(out.p, P[out.p].short)}${'<i class="gb"></i>'.repeat(gi)}</div>` : ''}`;
    }).join('');
    return `<div class="lcol"><div class="lhead">${crest(T.club, 'sm')}<b>${esc(T.club)}</b>${coachTag(T.club)}<span class="small muted">${esc(T.formation)}</span></div>${rows}</div>`;
  };
  return `<div class="lineup2">${side(lm.H, 'h')}${side(lm.A, 'a')}</div>`;
}
function lineupsTile(lm, upto) {
  if (!lm || !lm.H) return '';
  return `<div class="tile"><div class="eyebrow">${ic('tactic')} Escalações</div><div id="lv-lineups">${lineupsLists(lm, upto)}</div></div>`;
}

// ---------- banco de reservas manual ----------
function benchEditor() {
  const T = S.tactics, team = SE.userTeam(S), inXI = new Set(team.xi);
  const manual = Array.isArray(T.bench);
  const bench = team.bench;
  const cands = mySquad().filter(id => SE.lineupAvail(S, id) && !inXI.has(id) && !bench.includes(id)).sort((a, b) => vw(b).ovr - vw(a).ovr);
  const rows = bench.map(id => playerRow(id, { meta: id2 => `${esc(C.POS_NAME[P[id2].pos] || P[id2].pos)} · condição ${Math.round(vw(id2).cond)}`, right: id2 => `<span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span><span class="benchx" role="button" data-act="benchrm" data-id="${id2}" aria-label="Tirar do banco">×</span>` })).join('');
  const add = UI.benchAdd ? `<div class="list" style="margin-top:6px">${cands.map(id => playerRow(id, { meta: id2 => `${esc(C.POS_NAME[P[id2].pos] || P[id2].pos)} · condição ${Math.round(vw(id2).cond)}`, right: id2 => `<span class="ob ${pcat(id2).k} num">${vw(id2).ovr}</span><span class="benchx add" role="button" data-act="benchadd" data-id="${id2}" aria-label="Pôr no banco">+</span>` })).join('') || '<p class="muted small">Ninguém disponível.</p>'}</div>` : '';
  return `<h2 class="sech">${ic('swap')} Banco <span class="small muted">· ${bench.length}/9 · ${manual ? 'escolhido por você' : 'automático'}</span></h2>
    <div class="tile" style="padding:4px 12px"><div class="list">${rows || '<p class="muted small">Banco vazio.</p>'}</div>
      <div class="row wrap" style="gap:6px;margin:8px 0">${bench.length < 9 ? `<button class="btn sm alt" data-act="benchtoggle">${UI.benchAdd ? 'Fechar lista' : '+ Adicionar ao banco'}</button>` : ''}${manual ? `<button class="btn sm alt" data-act="benchauto">Voltar ao automático</button>` : ''}</div>${add}</div>
    <p class="muted small" style="margin:0">As trocas durante o jogo usam só quem está no banco. Leve um goleiro reserva.</p>`;
}

// ---------- notificações (menções na imprensa) ----------
function mentionsModal() {
  const list = (S.mentions || []).slice(0, 30);
  const it = list.map(x => `<div class="feeditem"><span>${ic('mic', '', `color:${x.read ? 'var(--muted)' : 'var(--pink)'}`)}</span><div><div class="t">${esc(x.t)}</div>${x.b ? `<div class="b">${esc(x.b)}</div>` : ''}<div class="w">${esc(x.w || '')}</div></div></div>`).join('');
  (S.mentions || []).forEach(x => { x.read = true; });
  setTimeout(() => { save(); const b = document.getElementById('bell'); if (b) b.querySelector('.bn') && b.querySelector('.bn').remove(); }, 50);
  return `<h2 class="disp" style="font-size:30px">${ic('mic')} Menções</h2><p class="muted small" style="margin:0">Quando falam de você, do seu clube ou dos seus jogadores na imprensa.</p>${it || '<p class="muted">Nada por enquanto.</p>'}`;
}

// ---------- filtros da busca ----------
const POS_FILTER = ['ALL', 'GOL', 'LD', 'LE', 'ZAG', 'VOL', 'MC', 'MEI', 'MD', 'ME', 'PD', 'PE', 'SA', 'CA'];
// continente pela nacionalidade
const CONT_OF = (() => {
  const m = {}, add = (c, list) => list.split(' ').forEach(k => { m[k] = c; });
  add('SA', 'ARG BRA COL URU PAR EQU CHI VEN PER BOL SUR FRE');
  add('NA', 'EUA MEX CAN PAN JAM CRC CUR HAI ELS HON DOM PUE TRI GUA');
  add('EU', 'ESP FRA ALE ING ITA POR HOL BEL DIN NOR RUS SER SUI TUR CRO SUE POL UCR AUT TCH GRE ARL ESC ROM IRL ESQ BOS GAL ALB HUN KOS ESL ICE GEO MON ARM FIN LUX BUL LIT EST MAL CYP MOL FAR LAT ISR KAZ');
  add('AF', 'MAR CIV NGA SEN GAN CAM DRC MLI GUI TUN EGI BUR ANG CPV GAB TOG COM ZIM MOZ MAU ZAM BEN CEN CON CHA NIG TAN SIE LIB THE SOU');
  add('AS', 'JAP COR AUS IRA ARA SYR IND QAT UZB NEW PAL TAJ JOR BAN UNI');
  return m;
})();
const CONTS = [['ALL', 'Todos os continentes'], ['SA', 'América do Sul'], ['NA', 'América do Norte e Central'], ['EU', 'Europa'], ['AF', 'África'], ['AS', 'Ásia e Oceania']];
const SUS_NM = { L: 'no campeonato', CB: 'na Copa do Brasil', INT: 'na copa continental', REG: 'na copa regional', SC: 'na Supercopa' };
function susText(s) { if (!s.susC) return `Suspenso por ${s.sus} jogo(s)`; return 'Suspenso ' + Object.entries(s.susC).filter(([, n]) => n > 0).map(([g, n]) => `por ${n} jogo(s) ${SUS_NM[g] || ''}`).join(' e '); }
// faixas com passos "redondos" (a primeira e a última ponta = sem limite)
const V_STEPS = [0, 1000, 2000, 5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 1000000, Infinity];
const S_STEPS = [0, 10, 20, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, Infinity];
const RANGES = {
  ovr: { l: 'Overall', lo: 'omin', hi: 'omax', min: 40, max: 99, fmt: v => String(v) },
  age: { l: 'Idade', lo: 'amin', hi: 'amax', min: 16, max: 40, fmt: v => `${v} anos` },
  val: { l: 'Valor de mercado', lo: 'vmin', hi: 'vmax', steps: V_STEPS, fmt: v => 'T$ ' + fmtK(v) },
  sal: { l: 'Salário por dia', lo: 'smin', hi: 'smax', steps: S_STEPS, fmt: v => 'T$ ' + fmtK(v) },
};
const QUICK = [['bolso', 'Cabem no bolso'], ['barg', 'Barganhas'], ['jovem', 'Jovens promessas'], ['fimct', 'Contrato acabando']];
const rNum = x => x == null || x === '' ? null : moneyIn(x);
// valor da ponta (índice do controle) ↔ filtro salvo
function rIdx(R, k, side) {
  const v = rNum(UI.mk[side === 'lo' ? R.lo : R.hi]);
  if (!R.steps) return v == null ? (side === 'lo' ? R.min : R.max) : C.clamp(+v, R.min, R.max);
  if (v == null) return side === 'lo' ? 0 : R.steps.length - 1;
  let i = R.steps.findIndex(x => x >= v); if (i < 0) i = R.steps.length - 1; return i;
}
function rVal(R, idx) { return R.steps ? R.steps[idx] : idx; }
function rLabel(R, a, b) {
  const lo = rVal(R, a), hi = rVal(R, b), noLo = R.steps ? a === 0 : a <= R.min, noHi = R.steps ? b === R.steps.length - 1 : b >= R.max;
  return noLo && noHi ? 'Qualquer' : noLo ? `até ${R.fmt(hi)}` : noHi ? `${R.fmt(lo)} ou mais` : `${R.fmt(lo)} – ${R.fmt(hi)}`;
}
function rangeHTML(k) {
  const R = RANGES[k], a = rIdx(R, k, 'lo'), b = rIdx(R, k, 'hi'), mx = R.steps ? R.steps.length - 1 : R.max, mn = R.steps ? 0 : R.min;
  const pa = (a - mn) / (mx - mn) * 100, pb = (b - mn) / (mx - mn) * 100;
  return `<div class="rng" data-r="${k}"><div class="rngh"><b>${R.l}</b><span id="rl-${k}">${rLabel(R, a, b)}</span></div>
    <div class="rngt"><i style="left:${pa}%;right:${100 - pb}%"></i><input type="range" min="${mn}" max="${mx}" step="1" value="${a}" data-rk="${k}" data-side="lo" aria-label="${R.l} mínimo"><input type="range" min="${mn}" max="${mx}" step="1" value="${b}" data-rk="${k}" data-side="hi" aria-label="${R.l} máximo"></div></div>`;
}
function rangeSet(el) {
  const k = el.dataset.rk, R = RANGES[k], box = el.closest('.rng'), [lo, hi] = box.querySelectorAll('input');
  let a = +lo.value, b = +hi.value;
  if (a > b) { if (el.dataset.side === 'lo') { a = b; lo.value = a; } else { b = a; hi.value = b; } }
  const mx = R.steps ? R.steps.length - 1 : R.max, mn = R.steps ? 0 : R.min;
  UI.mk[R.lo] = (R.steps ? a === 0 : a <= R.min) ? '' : rVal(R, a);
  UI.mk[R.hi] = (R.steps ? b === R.steps.length - 1 : b >= R.max) ? '' : rVal(R, b);
  box.querySelector('#rl-' + k).textContent = rLabel(R, a, b);
  const bar = box.querySelector('.rngt i'); bar.style.left = (a - mn) / (mx - mn) * 100 + '%'; bar.style.right = (100 - (b - mn) / (mx - mn) * 100) + '%';
  UI.mk.n = 40; mkCount();
}
function mkCount() { const el = document.getElementById('mf-count'); if (el) { const n = marketItems().length; el.textContent = `Ver ${fmt(n)} jogador${n === 1 ? '' : 'es'}`; } }
const STAT_OPTS = () => [['', 'Todos'], ['watch', `Favoritos (${(S.watch || []).length})`], ['livre', 'Livres (sem clube)'], ['pre', 'Pré-contrato'], ['list', 'Lista de transferências'], ['loan', 'Lista de empréstimo'], ['exp', 'Contrato no fim']];
function mkFiltSheet() {
  const m = UI.mk, free = m._free;
  const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([k, l]) => `<option value="${k}" ${String(cur) === String(k) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  return `<h2 class="sech big">${ic('filter')} Filtros</h2>
    <div class="mfgrid">${free ? '' : `<label><span>Situação</span>${sel('mk-stat', STAT_OPTS(), m.stat || '')}</label>`}
      <label><span>Posição</span>${sel('mk-pos', POS_FILTER.map(k => [k, k === 'ALL' ? 'Todas' : C.POS_NAME[k] || k]), m.pos || 'ALL')}</label>
      <label><span>Continente</span>${sel('mk-cont', CONTS.map(([k, l]) => [k, k === 'ALL' ? 'Todos' : l]), m.cont || 'ALL')}</label></div>
    ${['ovr', 'age', 'val', 'sal'].map(rangeHTML).join('')}
    <div class="row" style="gap:8px;margin-top:6px"><button class="btn alt" data-act="mkclr" data-k="all" style="flex:none">Limpar</button><button class="btn" id="mf-count" data-act="mkapply" style="flex:1">Ver jogadores</button></div>`;
}
// filtros ativos viram etiquetas removíveis
function mkActive() {
  const m = UI.mk, out = [];
  if (m.stat && !m._free) out.push(['stat', (STAT_OPTS().find(x => x[0] === m.stat) || [, m.stat])[1].replace(/ \(\d+\)$/, '')]);
  if (m.pos && m.pos !== 'ALL') out.push(['pos', C.POS_NAME[m.pos] || m.pos]);
  if (m.cont && m.cont !== 'ALL') out.push(['cont', (CONTS.find(x => x[0] === m.cont) || [, ''])[1]]);
  for (const k of ['ovr', 'age', 'val', 'sal']) { const R = RANGES[k]; if ((m[R.lo] ?? '') !== '' || (m[R.hi] ?? '') !== '') out.push([k, `${R.l.split(' ')[0]}: ${rLabel(R, rIdx(R, k, 'lo'), rIdx(R, k, 'hi'))}`]); }
  return out;
}
function mkClear(k) {
  const m = UI.mk, clr = x => { if (x === 'quick') m.quick = null; else if (x === 'stat') m.stat = ''; else if (x === 'pos') m.pos = 'ALL'; else if (x === 'cont') m.cont = 'ALL'; else { const R = RANGES[x]; m[R.lo] = ''; m[R.hi] = ''; } };
  if (k === 'all') ['quick', 'stat', 'pos', 'cont', 'ovr', 'age', 'val', 'sal'].forEach(clr); else clr(k);
  m.ovrK = null; m.n = 40;
}
// "50k", "1,5M", "2m" ou o valor exato ("800")
function moneyIn(t) {
  if (t == null) return null; t = String(t).trim().toLowerCase().replace(/\s|t\$|r\$/g, ''); if (!t) return null;
  const m = t.match(/^([\d.,]+)(k|mil|m|mi|mm)?$/); if (!m) return null;
  let n = m[1]; n = n.includes(',') ? n.replace(/\./g, '').replace(',', '.') : (/^\d{1,3}(\.\d{3})+$/.test(n) ? n.replace(/\./g, '') : n);
  const x = parseFloat(n); if (!isFinite(x)) return null;
  if (!m[2]) return Math.round(x);
  return Math.round(x * (m[2][0] === 'm' && m[2] !== 'mil' ? 1e6 : 1e3));
}
function passFilters(id) {
  const m = UI.mk, o = vw(id).ovr;
  if (m.pos && m.pos !== 'ALL' && P[id].pos !== m.pos) return false;
  if (m.cont && m.cont !== 'ALL' && (CONT_OF[P[id].nat] || 'EU') !== m.cont) return false;
  if (m.omin != null && m.omin !== '' && o < +m.omin) return false;
  if (m.omax != null && m.omax !== '' && o > +m.omax) return false;
  const v = vw(id), vmn = rNum(m.vmin), vmx = rNum(m.vmax), smn = rNum(m.smin), smx = rNum(m.smax), amn = rNum(m.amin), amx = rNum(m.amax);
  if (amn != null || amx != null) { const a = ageOf(id); if (amn != null && a < amn) return false; if (amx != null && a > amx) return false; }
  if (m.quick) {
    const b = m._b;
    if (m.quick === 'bolso' && b && (v.sal > Math.max(0, b.wageRoom) || v.mv > b.transfer)) return false;
    if (m.quick === 'barg' && !(v.ovr >= 68 && v.mv <= C.mvFromOvr(v.ovr, 27) * 0.7)) return false;
    if (m.quick === 'jovem' && !(ageOf(id) <= 21 && potStars(id).n >= 4)) return false;
    if (m.quick === 'fimct' && !(v.ce <= S.season)) return false;
  }
  if (vmn != null && v.mv < vmn) return false; if (vmx != null && v.mv > vmx) return false;
  if (smn != null && v.sal < smn) return false; if (smx != null && v.sal > smx) return false;
  return true;
}
// troca de capitão: vale a escolha que estiver marcada no próximo jogo (trocar várias vezes antes não pesa)
function setCaptain(kind, id) {
  const T = S.tactics;
  if (kind === 'cap') { T.cap = id; if (id != null && T.vice === id) T.vice = null; } else { T.vice = id; if (id != null && T.cap === id) T.cap = null; }
  const prev = T.capV === 2 ? T.capOff : null;
  toast(kind === 'cap' && id != null && prev != null && prev !== id && P[prev] ? `${P[id].short} usa a braçadeira no próximo jogo. Se ${P[prev].short} jogar sem a faixa, vai sentir.` : kind === 'cap' ? (id == null ? 'Capitão automático' : `${P[id].short} é o capitão`) : (id == null ? 'Sem vice' : `${P[id].short} é o vice`));
  save(); render();
}

// ---------- ações ----------
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  const id = el.dataset.id ? +el.dataset.id : null;
  switch (el.dataset.act) {
    case 'coach': ev.stopPropagation(); ev.preventDefault(); openCoach(el.dataset.club); break;
    case 'infil': { ev.stopPropagation(); const r = SE.infiltrate(S, id); save(); toast(r.msg, !r.ok); render(); break; }
    case 'benchrm': case 'benchadd': {
      ev.stopPropagation();
      const T = S.tactics, cur = SE.userTeam(S).bench.slice();
      T.bench = el.dataset.act === 'benchrm' ? cur.filter(x => x !== id) : [...cur, id].slice(0, 9);
      if (T.bench.length >= 9) UI.benchAdd = false;
      save(); { const y = pageY(); render(); pageTo(y); } break;
    }
    case 'benchtoggle': ev.stopPropagation(); UI.benchAdd = !UI.benchAdd; { const y = pageY(); render(); pageTo(y); } break;
    case 'benchauto': ev.stopPropagation(); delete S.tactics.bench; UI.benchAdd = false; save(); { const y = pageY(); render(); pageTo(y); } break;
    case 'mkfilt': ev.stopPropagation(); UI.modal = { type: 'mkfilt' }; renderModal(); mkCount(); break;
    case 'mkapply': ev.stopPropagation(); UI.modal = null; renderModal(); render(); break;
    case 'mkquick': ev.stopPropagation(); UI.mk.quick = UI.mk.quick === el.dataset.k ? null : el.dataset.k; UI.mk.n = 40; render(); break;
    case 'mkclr': ev.stopPropagation(); mkClear(el.dataset.k); if (UI.modal && UI.modal.type === 'mkfilt') { UI.modal.keep = true; renderModal(); mkCount(); } else render(); break;
    case 'ctrok': case 'ctrno': { ev.stopPropagation(); gate(() => { const r = MK.respondCounter(S, +el.dataset.k, el.dataset.act === 'ctrok'); save(); toast(r.msg, !r.ok); render(); }); break; }   // v284
  }
}, true);
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.id === 'pk-sel') { S.tactics.pk = t.value === '' ? null : +t.value; toast(S.tactics.pk == null ? 'Cobrador de pênalti automático' : `${P[S.tactics.pk].short} é o cobrador de pênalti`); save(); render(); return; }
  if (t.id === 'cap-sel' || t.id === 'vice-sel') { setCaptain(t.id === 'cap-sel' ? 'cap' : 'vice', t.value === '' ? null : +t.value); return; }
  if (t.id === 'mk-pos') { UI.mk.pos = t.value; UI.mk.n = 40; mkCount(); renderMarketList(); }
  if (t.id === 'mk-cont') { UI.mk.cont = t.value; UI.mk.n = 40; mkCount(); renderMarketList(); }
});
// teclado do celular: o modal acompanha a área visível (a coletiva não estoura pra cima)
(() => {
  const vv = window.visualViewport; if (!vv) return;
  const upd = () => { document.documentElement.style.setProperty('--vvh', vv.height + 'px'); document.documentElement.style.setProperty('--vvt', vv.offsetTop + 'px'); };
  vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd); upd();
})();

// ---------- escalação: arrastar um jogador sobre outro troca os dois de posição ----------
(() => {
  let drag = null, ghost = null, block = false;
  const slotAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest('.pitch .slot[data-act="slot"]'); };
  document.addEventListener('pointerdown', ev => {
    const el = ev.target.closest('.pitch .slot[data-act="slot"]'); if (!el || UI.view !== 'squad') return;
    drag = { i: +el.dataset.i, x: ev.clientX, y: ev.clientY, el, on: false, id: ev.pointerId };
  });
  document.addEventListener('pointermove', ev => {
    if (!drag || ev.pointerId !== drag.id) return;
    if (!drag.on && Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) > 8) {
      drag.on = true; drag.el.classList.add('dragging');
      ghost = drag.el.cloneNode(true); ghost.className = 'slot ghost'; document.body.appendChild(ghost);
    }
    if (!drag.on) return;
    ev.preventDefault();
    ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
    document.querySelectorAll('.pitch .slot.over').forEach(x => x.classList.remove('over'));
    const t = slotAt(ev.clientX, ev.clientY); if (t && t !== drag.el) t.classList.add('over');
  }, { passive: false });
  const end = ev => {
    if (!drag) return;
    const d = drag; drag = null;
    if (ghost) { ghost.remove(); ghost = null; }
    document.querySelectorAll('.pitch .slot.over,.pitch .slot.dragging').forEach(x => x.classList.remove('over', 'dragging'));
    if (!d.on) return;
    block = true; setTimeout(() => { block = false; }, 350);
    const t = ev && ev.clientX != null ? slotAt(ev.clientX, ev.clientY) : null;
    if (!t || t === d.el) return;
    const j = +t.dataset.i, xi = SE.userTeam(S).xi.slice();
    [xi[d.i], xi[j]] = [xi[j], xi[d.i]];
    S.tactics.xi = xi; UI.slot = null; save();
    const y = pageY(); render(); pageTo(y);
    const a = xi[j], b = xi[d.i];
    toast(`${a != null && P[a] ? P[a].short : '—'} ⇄ ${b != null && P[b] ? P[b].short : '—'}`);
  };
  document.addEventListener('pointerup', end);
  document.addEventListener('dragstart', ev => { if (ev.target.closest && ev.target.closest('.pitch')) ev.preventDefault(); });
  document.addEventListener('pointercancel', () => end(null));
  document.addEventListener('click', ev => { if (block && ev.target.closest('.pitch')) { ev.stopPropagation(); ev.preventDefault(); } }, true);
})();

// ---------- pausa da liga (ADM) ----------
function fmtReal(ts) {
  const d = new Date(ts), today = Wd.startOfDay(Date.now()), day = Wd.startOfDay(ts), diff = Math.round((day - today) / 86400000);
  const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  return `${diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : `${DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`} às ${hh}`;
}
function nextAt(hhmm) {
  const [h, m] = String(hhmm || '11:00').split(':').map(Number), d = new Date(); d.setHours(h || 0, m || 0, 0, 0);
  if (d.getTime() <= Date.now() + 60000) d.setDate(d.getDate() + 1);
  return d.getTime();
}
function pauseModal(m) {
  const p = SE.paused(S), nx = SE.nextFixtureOf(S, S.club);
  const at = nextAt(m.at || '11:00');
  return `<h2 class="disp" style="font-size:28px;margin:0">${ic('clock')} Pausar a liga</h2>
    ${p ? `<div class="note ok">Liga pausada. O relógio volta a andar ${fmtReal(S.pause.until).toLowerCase()}${nx && !nx.pending ? ` e o próximo jogo começa ${fmtReal(SE.toReal(S, SE.slotTime(S, nx.k))).toLowerCase()}` : ''}.</div>` : ''}
    <p class="muted small" style="margin:0">O relógio da liga para para todo mundo. Nada é processado até a hora marcada: nem jogos, nem dias, nem janela. Depois continua no ritmo normal do teste.</p>
    <label class="eyebrow" for="pause-at">Próxima rodada da liga às</label>
    <input type="time" id="pause-at" value="${esc(m.at || '11:00')}" style="font-size:18px">
    <div class="small muted">Vai ser ${fmtReal(at).toLowerCase()}.</div>
    <button class="btn" data-act="pausego">${ic('clock')} Pausar até o jogo</button>
    ${p ? `<button class="btn alt" data-act="pauseoff">${ic('arrowR')} Retomar agora</button>` : ''}`;
}
document.addEventListener('change', ev => { if (ev.target.id === 'pause-at' && UI.modal) { UI.modal.at = ev.target.value; UI.modal.keep = true; renderModal(); } });
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act !== 'pausego' && act !== 'pauseoff') return;
  ev.stopPropagation();
  const inp = $('#pause-at'); const at = nextAt(inp ? inp.value : '11:00');
  if (NET.online) {
    const p = act === 'pausego' ? NET.pause(at) : NET.resume();
    p.then(r => { if (act === 'pausego') toast(r && r.ok ? `Liga pausada. Próximo jogo ${fmtReal(at).toLowerCase()}.` : (r && r.msg) || 'Não deu pra pausar.', !(r && r.ok)); else toast('Liga retomada'); UI.modal = null; render(); });
  } else {
    const r = act === 'pausego' ? SE.pauseUntilMatch(S, at) : (SE.resume(S), { ok: true });
    save(); toast(act === 'pausego' ? (r.ok ? `Pausado. Próximo jogo ${fmtReal(at).toLowerCase()}.` : r.msg) : 'Retomado', !r.ok); UI.modal = null; render();
  }
}, true);

// ---------- escalações salvas (até 3 por clube) ----------
function luList() { S.lineups = S.lineups || {}; return (S.lineups[S.club] = S.lineups[S.club] || []); }
function luSnapshot(name) {
  const T = S.tactics, team = SE.userTeam(S);
  return { name: (name || '').trim().slice(0, 24) || 'Escalação', formation: T.formation, style: T.style, xi: (T.xi && T.xi.length ? T.xi : team.xi).slice(), bench: Array.isArray(T.bench) ? T.bench.slice() : null, triggers: JSON.parse(JSON.stringify(T.triggers || {})) };
}
function savedLineups() {
  const L = luList(), ed = UI.luEdit;
  const cards = L.map((x, i) => `<div class="lucard ${ed === i ? 'on' : ''}"><button class="luload" data-act="luload" data-i="${i}"><b>${esc(x.name)}</b><span>${esc(x.formation)} · ${esc((C.STYLES[x.style] || {}).name || '')}</span></button><button class="lumore" data-act="luedit" data-i="${i}" aria-label="Opções">⋯</button></div>`).join('');
  const editor = ed === 'new' ? `<div class="luedit"><input type="text" id="lu-name" maxlength="24" placeholder="Nome (ex.: Time titular)"><button class="btn sm" data-act="lusave">Salvar</button><button class="btn sm alt" data-act="luedit" data-i="">Cancelar</button></div>`
    : typeof ed === 'number' && L[ed] ? `<div class="luedit"><input type="text" id="lu-name" maxlength="24" value="${esc(L[ed].name)}"><button class="btn sm alt" data-act="luren" data-i="${ed}">Renomear</button><button class="btn sm alt" data-act="luupd" data-i="${ed}">Atualizar com o time atual</button><button class="btn sm coral" data-act="ludel" data-i="${ed}">Excluir</button></div>` : '';
  return `<div class="slu"><div class="row between"><span class="eyebrow" style="margin:0">${ic('tactic')} Escalações salvas</span><span class="small muted">${L.length}/3</span></div>
    <div class="lugrid">${cards}${L.length < 3 ? `<button class="lunew" data-act="luedit" data-i="new">+ Salvar atual</button>` : ''}</div>${editor}</div>`;
}
function luSaveLive() {
  const L = luList(); if (L.length >= 3) return toast('Limite de 3 escalações. Exclua uma para salvar outra.', true);
  const lm = S.lastMatch; if (!lm) return;
  const T = lm.f.h === S.club ? lm.H : lm.A, snap = luSnapshot(`Jogo vs ${lm.f.h === S.club ? lm.f.a : lm.f.h}`);
  snap.xi = (T.xi || []).slice(); snap.formation = T.formation || snap.formation; if (T.style) snap.style = T.style;
  L.push(snap); save(); toast('Escalação do jogo salva');
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act; if (!/^lu|^lusavelive/.test(act)) return;
  ev.stopPropagation();
  const L = luList(), i = el.dataset.i === '' || el.dataset.i == null ? null : el.dataset.i === 'new' ? 'new' : +el.dataset.i;
  const nm = ($('#lu-name') || {}).value || '';
  const keep = () => { const y = pageY(); render(); pageTo(y); };
  switch (act) {
    case 'luedit': UI.luEdit = UI.luEdit === i ? null : i; keep(); break;
    case 'lusave': if (L.length >= 3) { toast('Limite de 3 escalações.', true); break; } L.push(luSnapshot(nm)); UI.luEdit = null; save(); toast('Escalação salva'); keep(); break;
    case 'luupd': { const n = L[i].name; L[i] = luSnapshot(n); UI.luEdit = null; save(); toast(`"${n}" atualizada`); keep(); break; }
    case 'luren': if (nm.trim()) { L[i].name = nm.trim().slice(0, 24); save(); } UI.luEdit = null; keep(); break;
    case 'ludel': { const n = L[i].name; L.splice(i, 1); UI.luEdit = null; save(); toast(`"${n}" excluída`); keep(); break; }
    case 'luload': {
      const x = L[i]; if (!x) break;
      const T = S.tactics; T.formation = x.formation; T.style = x.style; T.xi = x.xi.slice(); T.triggers = JSON.parse(JSON.stringify(x.triggers || T.triggers));
      if (Array.isArray(x.bench)) T.bench = x.bench.slice(); else delete T.bench;
      const miss = x.xi.filter(id => id != null && (own(id) !== S.club || !SE.lineupAvail(S, id)));
      save(); keep();
      toast(miss.length ? `"${x.name}" carregada · ${miss.length} indisponível(is) substituído(s) só neste jogo` : `"${x.name}" carregada`);
      break;
    }
    case 'lusavelive': luSaveLive(); break;
  }
}, true);

document.addEventListener('input', ev => { const t = ev.target; if (t && t.dataset && t.dataset.rk) rangeSet(t); });

// ===== UI parte 8: coletivas (pós-jogo e pré-jogo, com estado salvo) + declarações livres =====
const PRESS_OUT = ['Rádio Arquibancada', 'Portal Camisa 10', 'TV Gramado', 'Jornal do Apito', 'Blog do Setorista', 'Canal Bola Parada', 'Folha da Torcida', 'Podcast Linha de Fundo', 'Rádio Várzea FM', 'Site Lance Livre', 'TV Arena', 'Coluna do Vestiário'];
const PRESS_REP = ['Marina Duarte', 'Beto Sampaio', 'Carla Nunes', 'Juca Ferraz', 'Renata Lima', 'Paulo Viana', 'Tati Moraes', 'Diego Barros', 'Lia Carvalho', 'Nando Prates', 'Bia Rocha', 'Téo Almeida'];
const pk = (arr, r) => arr[Math.floor(r() * arr.length) % arr.length];
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
// Prefere o que não foi usado recentemente, mesmo depois de esgotar o banco inteiro.
function pressFresh(arr, history, r, key = x => x) {
  if (!arr.length) return null;
  const h = history || [];
  const weighted = arr.map(item => {
    const id = key(item), at = h.lastIndexOf(id), age = at < 0 ? Infinity : h.length - 1 - at;
    const weight = age === 0 && arr.length > 1 ? 0 : age < 2 ? 0.03 : age < 3 ? 0.12 : age < 4 ? 0.4 : age < 8 ? 0.8 : 1;
    return { item, weight };
  });
  let draw = r() * weighted.reduce((sum, x) => sum + x.weight, 0);
  for (const x of weighted) { draw -= x.weight; if (draw < 0) return x.item; }
  return weighted[weighted.length - 1].item;
}

// ---------- banco de perguntas (várias formas de perguntar o mesmo assunto) ----------
const QB = {
  vitoria: ['Vitória por {sc} sobre o {opp}. O que mais te agradou?', 'O time venceu o {opp}. Foi a atuação que você esperava?', '{sc} no {opp}. Dá pra dizer que o time encontrou o caminho?', 'Três pontos contra o {opp}. O que ainda precisa melhorar?', 'Como avalia a vitória de hoje sobre o {opp}?'],
  derrota: ['Derrota por {sc} para o {opp}. Onde o time errou?', 'O que faltou hoje contra o {opp}?', 'Como explicar o resultado contra o {opp}?', 'A torcida saiu irritada depois do {sc}. Qual a sua leitura?', 'Faltou intensidade ou faltou qualidade contra o {opp}?'],
  empate: ['Empate em {sc} com o {opp}. Ficou com gosto de quê?', 'Um ponto contra o {opp}. Foi bom ou ruim?', 'O time deixou escapar a vitória contra o {opp}?', 'Como avalia o {sc} de hoje?'],
  goleada: ['{sc} no {opp}. Foi a melhor atuação do time na temporada?', 'Goleada sobre o {opp}. Dá pra sonhar alto?', 'O que explica um placar tão elástico contra o {opp}?'],
  goleadaSofrida: ['Derrota por {sc} para o {opp}. Como explicar um resultado desses?', 'Foi a pior atuação desde que você chegou?', 'Depois de sofrer tantos gols do {opp}, o que muda?'],
  classico: ['Clássico contra o {opp}: qual o recado pra torcida?', 'Como foi viver esse clássico com o {opp}?', 'Clássico é outro jogo. O que decidiu hoje?'],
  elim: ['Eliminação diante do {opp}. O que faltou?', 'Fora do mata-mata. Como o grupo recebe isso?', 'A eliminação para o {opp} pesa no seu cargo?'],
  destaque: ['{who} foi o melhor em campo. Merece chance na seleção?', 'O que {who} tem de especial?', '{who} decidiu hoje. É o melhor do elenco?', 'Como segurar {who} com o mercado de olho?'],
  criticado: ['{who} foi muito criticado depois do jogo. Segue titular?', 'A torcida pegou no pé de {who}. Você protege o jogador?', 'O que está acontecendo com {who}?', '{who} não rendeu. Vai para o banco?'],
  subs: ['Por que tirar {who} aos {min} minutos?', 'A substituição de {who} mudou o jogo?', 'A torcida vaiou a saída de {who}. Foi a decisão certa?'],
  tatica: ['A mudança para {tac} no segundo tempo funcionou?', 'Por que mudar o esquema durante o jogo?', 'O time se perdeu depois da mudança tática?'],
  arbitragem: ['Houve reclamação da arbitragem. O resultado passa pelo apito?', 'Como avalia o trabalho de {ref}?', 'O VAR foi decisivo hoje?', 'Faltou critério da arbitragem?'],
  banco: ['{who} não tem jogado. Ele ainda está nos planos?', 'Por que {who} está sendo pouco utilizado?', 'A situação de {who} no banco preocupa?'],
  mafase: ['São resultados ruins em sequência. Seu cargo está ameaçado?', 'O que falta para o time reagir?', 'A má fase é técnica ou emocional?', 'Você se sente balançado no cargo?'],
  boafase: ['O time embalou uma sequência de vitórias. Dá pra sonhar alto?', 'Qual o segredo dessa boa fase?', 'Como manter o grupo com os pés no chão?'],
  titulo: ['O time está na briga pelo título. É candidato?', 'Dá pra falar em título agora?', 'O que falta para brigar de verdade pela taça?'],
  rebaixamento: ['O time está na zona de rebaixamento. Existe risco real?', 'Como tirar o time lá de baixo?', 'O fantasma do rebaixamento assusta o grupo?'],
  matamata: ['A classificação no torneio continental está encaminhada?', 'Como está a disputa no grupo continental?'],
  torcida: ['A torcida protestou. Qual a mensagem pra ela?', 'Como lidar com a pressão da arquibancada?', 'Sentiu o estádio contra o time?'],
  diretoria: ['A diretoria anda impaciente. Você tem respaldo?', 'Já conversou com o presidente sobre o momento?', 'Existe prazo para os resultados aparecerem?'],
  lesoes: ['São {n} jogadores no departamento médico. Isso atrapalha?', 'As lesões explicam a queda de rendimento?', 'O calendário tem machucado o elenco?'],
  retorno: ['{who} voltou de lesão. Já tem condição de jogo?', 'Como está {who} depois da recuperação?'],
  duvida: ['{who} está desgastado. Vai ser poupado?', 'A condição física de {who} preocupa para o próximo jogo?'],
  mercado: ['A janela está aberta. Vem reforço?', 'Algum jogador pode sair nesta janela?', 'Qual a posição mais carente do elenco?', 'Tem conversa com algum reforço?'],
  insatisfeito: ['{who} parece insatisfeito. Como está a relação?', 'Há problema de vestiário com {who}?'],
  renovacao: ['O contrato de {who} termina neste ano. Ele renova?', '{who} pode sair de graça no fim da temporada?'],
  proximo: ['Próximo adversário é o {opp}. O que esperar?', 'Como o time se prepara para o {opp}?', 'O {opp} vem bem. Onde ele é perigoso?', 'Qual a importância do jogo contra o {opp}?'],
  rival: ['Próximo jogo é clássico contra o {opp}. Como está o clima?', 'Clássico com o {opp} vale mais que três pontos?', 'Mensagem para a torcida antes do clássico?'],
  decisivo: ['O jogo contra o {opp} é {imp}. O time está pronto?', 'Como tratar a semana de um jogo {imp}?'],
  declaracao: ['{who2} falou do seu time esta semana. Quer responder?', 'Viu o que {who2} disse? Qual a sua resposta?'],
  evento: ['Sobre o caso "{ev}": como o clube vai agir?', 'O episódio "{ev}" afeta o grupo?'],
  objetivo: ['A meta da diretoria é "{obj}". Hoje o time é {pos}º. Dá pra cumprir?', 'O objetivo da temporada ainda é realista?'],
  arbitroProx: ['O árbitro do próximo jogo é {ref}, conhecido pelo rigor. Preocupa?'],
  salarios: ['Os salários estão atrasados há {n} dia(s). Como está o ambiente?', 'O elenco está sem receber. Isso afeta o rendimento?', 'Jogadores estão cobrando a diretoria pelos salários. Você apoia o grupo?', 'Com os atrasos, dá pra manter o elenco focado?'],
};
// família de resposta de cada tema
const FAM = { vitoria: 'good', goleada: 'good', boafase: 'good', titulo: 'title', derrota: 'bad', goleadaSofrida: 'bad', mafase: 'bad', elim: 'bad', empate: 'draw', classico: 'rival', rival: 'rival', destaque: 'praise', criticado: 'crit', subs: 'decision', tatica: 'decision', arbitragem: 'ref', arbitroProx: 'ref', banco: 'bench', insatisfeito: 'bench', rebaixamento: 'pressure', torcida: 'pressure', diretoria: 'boss', lesoes: 'injury', retorno: 'injury', duvida: 'injury', mercado: 'market', renovacao: 'market', proximo: 'next', decisivo: 'next', matamata: 'next', declaracao: 'reply', evento: 'event', objetivo: 'boss', salarios: 'wages' };
const PROFILES = {
  confiante: { l: 'Confiante', c: 'var(--lime)', i: 'up' },
  diplomatica: { l: 'Diplomática', c: 'var(--mint)', i: 'handshake' },
  cautelosa: { l: 'Cautelosa', c: 'var(--stone)', i: 'feather' },
  irritado: { l: 'Irritada', c: 'var(--coral)', i: 'flame' },
  provocador: { l: 'Provocadora', c: 'var(--pink)', i: 'bolt' },
  motivacional: { l: 'Motivacional', c: 'var(--yellow)', i: 'heart' },
  autocritico: { l: 'Autocrítica', c: 'var(--blue)', i: 'user' },
  protetor: { l: 'Protege o elenco', c: 'var(--green)', i: 'shirt' },
  cobranca: { l: 'Cobra os jogadores', c: 'var(--orange)', i: 'whistle' },
  respeito: { l: 'Respeita o rival', c: 'var(--mint)', i: 'medal' },
  // perfis antigos (histórico salvo)
  agressiva: { l: 'Agressiva', c: 'var(--coral)', i: 'flame' },
  critica: { l: 'Crítica', c: 'var(--orange)', i: 'whistle' },
};
// efeito de cada tom (reaproveita a lógica dos perfis)
// respostas de contexto (só aparecem quando fazem sentido)
Object.assign(PROFILES, {
  gramado: { l: 'Culpa o gramado', c: 'var(--green)', i: 'shirt' },
  juiz: { l: 'Critica a arbitragem', c: 'var(--coral)', i: 'whistle' },
  juizbom: { l: 'Elogia a arbitragem', c: 'var(--mint)', i: 'whistle' },
  juizneu: { l: 'Evita polêmica com o apito', c: 'var(--blue)', i: 'whistle' },
  juizatk: { l: 'Ataca a arbitragem', c: 'var(--coral)', i: 'flame' },
  pubcobra: { l: 'Cobra a torcida', c: 'var(--orange)', i: 'user' },
  pubentende: { l: 'Entende a torcida', c: 'var(--mint)', i: 'heart' },
});
const CTX_ANS = {
  gramado: ['O gramado estava pesado demais. Nosso jogo é de toque e não conseguimos encaixar.', 'Com esse campo, a bola não corre. Isso prejudicou muito o nosso estilo.', 'O estado do gramado atrapalhou os dois times, mas a gente sofre mais porque joga no chão.'],
  juizbom: ['A arbitragem de {ref} foi segura. Não tenho o que reclamar do apito.', '{ref} é árbitro experiente e apitou bem. O resultado foi decidido pelos jogadores.', 'Tem que reconhecer: {ref} teve critério do começo ao fim.'],
  juizneu: ['Não vou falar de arbitragem. Prefiro olhar pro que a gente fez em campo.', 'Arbitragem é assunto pra comissão analisar. O meu foco é o time.'],
  juiz: ['A arbitragem de {ref} foi confusa: cartão de um lado, vista grossa do outro.', 'Tem lance que o VAR precisava ter chamado. {ref} errou em momentos decisivos.', 'Acréscimo curto, pênalti ignorado… a atuação de {ref} precisa ser revista.'],
  pubcobra: ['Jogar com o estádio vazio desse jeito é difícil. A gente precisa da torcida do nosso lado.', 'Peço que o torcedor volte. Com a arquibancada cheia, esse time é outro.'],
  pubentende: ['Entendo a torcida. Com a fase que estamos, é natural o estádio esvaziar. Cabe a nós trazer eles de volta.', 'O público responde ao que a gente entrega em campo. A culpa não é do torcedor.'],
};
function ctxAnswers(q, r) {
  const out = [], fam = FAM[q.topic], lm = S.lastMatch && S.lastMatch.season === S.season && !S.lastMatch.friendly ? S.lastMatch : null;
  if (!lm || q.kind !== 'pos' || !(MATCH_T.has(q.topic) || q.topic === 'torcida')) return out;   // v191: árbitro/gramado/público do último jogo só na coletiva pós-jogo
  const home = lm.f.h === S.club, my = home ? lm.res.gh : lm.res.ga, ot = home ? lm.res.ga : lm.res.gh;
  const bad = my <= ot && ['bad', 'draw', 'ref', 'pressure'].includes(fam);
  const refName = (C.REFEREES[lm.ref] || {}).name || 'o árbitro';
  if (bad && fam !== 'ref' && home && MATCH_T.has(q.topic)) out.push({ k: 'gramado', text: pk(CTX_ANS.gramado, r) });
  if ((bad && MATCH_T.has(q.topic)) || fam === 'ref') out.push({ k: 'juiz', text: fill(pk(CTX_ANS.juiz, r), { ref: refName }), ref: refName });
  if (fam === 'ref') { out.push({ k: 'juizbom', text: fill(pk(CTX_ANS.juizbom, r), { ref: refName }), ref: refName }); out.push({ k: 'juizneu', text: pk(CTX_ANS.juizneu, r), ref: refName }); }
  const g = lm.res.gate;
  if (home && g && g.occ < 0.55 && ['bad', 'draw', 'pressure', 'good', 'boss'].includes(fam)) { out.push({ k: 'pubcobra', text: pk(CTX_ANS.pubcobra, r) }); out.push({ k: 'pubentende', text: pk(CTX_ANS.pubentende, r) }); }
  return out.slice(0, fam === 'ref' ? 3 : 2);
}
const TONE_FX = { gramado: 'gramado', juiz: 'juiz', juizbom: 'juizbom', juizneu: 'juizneu', juizatk: 'juizatk', pubcobra: 'pubcobra', pubentende: 'pubentende', confiante: 'confiante', diplomatica: 'diplomatica', cautelosa: 'cautelosa', irritado: 'agressiva', provocador: 'agressiva', motivacional: 'motivacional', autocritico: 'autocritico', protetor: 'protetor', cobranca: 'critica', respeito: 'respeito' };
// respostas por família de pergunta × tom (várias formas cada; o jogo evita repetir as já usadas)
const ANS = {
  good: {
    confiante: ['O time fez exatamente o que a gente treinou. E ainda tem mais pra mostrar.', 'Quando esse time joga assim, é difícil alguém segurar a gente.', 'Vitória com autoridade. É esse o padrão que eu quero daqui pra frente.'],
    diplomatica: ['Parabéns ao grupo e também ao {opp}, que dificultou bastante.', 'Resultado construído por todo mundo: comissão, elenco e torcida.', 'Foi um bom jogo. Saio satisfeito com a entrega dos dois lados.'],
    cautelosa: ['Boa vitória, mas ainda tem muita coisa pra corrigir.', 'Três pontos, e só. Amanhã já é outro campeonato.', 'Não dá pra se empolgar com um resultado. Tem muito chão pela frente.'],
    provocador: ['Muita gente duvidou da gente. Tá aí a resposta.', 'Quem falou que esse time não ia aguentar pode ir revendo os conceitos.', 'Alguns vão ter que engolir o que falaram durante a semana.'],
    motivacional: ['Esse grupo tem alma. Tenho orgulho de cada um que vestiu a camisa hoje.', 'É pra torcida sonhar junto. Esse time vai longe.', 'Hoje o torcedor foi pra casa feliz. É por isso que a gente trabalha.'],
    autocritico: ['O mérito é todo dos jogadores. Eu errei em alguns momentos e eles resolveram.', 'Ganhamos, mas demorei a acertar o time no primeiro tempo. Isso é comigo.'],
    protetor: ['Esse elenco foi muito criticado e respondeu com trabalho. Merece respeito.', 'Quem pediu cabeça de jogador aqui semana passada viu hoje do que eles são capazes.'],
    cobranca: ['Ganhamos, mas tivemos momentos de desatenção que eu não aceito.', 'Resultado bom, atuação irregular. Vou cobrar no vídeo.', 'Venceu, ótimo. Mas tem gente que pode render muito mais.'],
    respeito: ['O {opp} é um time bem treinado. Vencer aqui tem muito valor.', 'Respeito muito o trabalho do {opp}. Foi uma vitória suada.'],
  },
  bad: {
    confiante: ['Um tropeço não muda nada. Esse elenco vai responder.', 'Perdemos um jogo, não perdemos o rumo.', 'Conheço esse grupo. Semana que vem é outra história.'],
    diplomatica: ['O {opp} foi melhor hoje. Mérito deles.', 'Faz parte do futebol. Vamos analisar e seguir.'],
    cautelosa: ['Preciso analisar com calma. Não é hora de conclusões.', 'Prefiro rever o jogo antes de falar qualquer coisa.', 'Resultado ruim, mas não vou tomar decisão de cabeça quente.'],
    irritado: ['Não aceito uma atuação daquele jeito. Aquilo não é o meu time.', 'Tô irritado, sim. Do jeito que foi, não dá.', 'Foi inaceitável. Não tem outra palavra.'],
    motivacional: ['Levanta a cabeça. Esse time vai voltar mais forte.', 'É na dificuldade que se conhece um grupo. E esse grupo é forte.', 'Hoje dói. Amanhã a gente trabalha dobrado.'],
    autocritico: ['A responsabilidade é minha. Escolhi mal e o time pagou.', 'Errei na preparação. Os jogadores não podem levar essa sozinhos.', 'Não consegui passar o que queria pro grupo. Tenho que melhorar.'],
    protetor: ['Ninguém vai crucificar jogador aqui. Se tiver culpado, sou eu.', 'Os meninos deram tudo. O placar não mostra o esforço.'],
    cobranca: ['Faltou atitude e faltou vontade. Vou cobrar forte.', 'Tem jogador que precisa entender o peso dessa camisa.', 'Do jeito que alguns jogaram hoje, a concorrência vai aumentar.'],
    respeito: ['O {opp} mereceu. Jogou melhor e soube aproveitar os nossos erros.', 'Tiro o chapéu pro {opp}. Foram superiores.'],
  },
  draw: {
    confiante: ['Merecíamos mais, mas o time está no caminho certo.', 'O resultado não saiu, mas o desempenho me agradou.'],
    diplomatica: ['Jogo equilibrado, resultado justo.', 'Os dois times buscaram a vitória. Empate honesto.'],
    cautelosa: ['Um ponto não é ruim. Seguimos trabalhando.', 'Tem jogo em que o empate é resultado. Vamos somar.'],
    irritado: ['Deixamos dois pontos na mesa. Isso me irrita.', 'Empate com gosto de derrota. Não gostei.'],
    motivacional: ['Seguimos vivos e unidos. O próximo é nosso.', 'Não perdemos, e isso também conta. Bora pra cima.'],
    autocritico: ['Poderia ter mexido antes. Esse ponto a menos é da minha conta.', 'Demorei pra ler o jogo. Assumo.'],
    cobranca: ['Erramos demais no último terço. Assim não vamos longe.', 'Faltou capricho. Tivemos chances pra matar o jogo.'],
    respeito: ['O {opp} se fechou bem e soube sofrer. Tem que dar mérito.'],
  },
  title: {
    confiante: ['Somos candidatos, sim. E vamos até o fim.', 'Esse time foi montado pra brigar lá em cima. Não fujo disso.'],
    diplomatica: ['Tem muitos times fortes. Respeitamos todos.'],
    cautelosa: ['Jogo a jogo. Ninguém ganhou nada ainda.', 'Falar em título agora tira o foco. Próximo jogo, e só.'],
    provocador: ['Quem quiser o título vai ter que passar pela gente.', 'Os outros que se preocupem. A gente tá tranquilo lá em cima.'],
    motivacional: ['Sonhar é permitido. Vamos com tudo.', 'A torcida pode sonhar. A gente vai correr por esse sonho.'],
    autocritico: ['Ainda erro muita coisa como treinador. Pra ser campeão, eu preciso melhorar também.'],
    cobranca: ['Com os vacilos que temos cometido, ainda não somos campeões de nada.'],
    respeito: ['Os adversários na briga têm elencos fortíssimos. Vai ser decidido no detalhe.'],
  },
  rival: {
    confiante: ['A cidade sabe quem manda.', 'Clássico se ganha. E a gente sabe como.'],
    diplomatica: ['Clássico bonito, com respeito entre os dois lados.', 'É o jogo que todo mundo quer ver. Que seja uma festa.'],
    cautelosa: ['Clássico é jogo à parte. Não tem favorito.', 'Em clássico, qualquer detalhe decide. Muito cuidado.'],
    irritado: ['Em clássico não pode vacilar como a gente vacilou.', 'Não quero ver ninguém se escondendo no clássico.'],
    provocador: ['O {opp} fala muito e joga pouco.', 'Eles que se preocupem com a gente. Do lado de cá tá tudo tranquilo.', 'O {opp} pode até ter barulho. Time, quem tem somos nós.'],
    motivacional: ['Clássico é da torcida. Jogamos por ela.', 'Esse é o jogo que o torcedor espera o ano inteiro. Vamos honrar.'],
    protetor: ['Meu elenco sabe o tamanho desse jogo. Não precisa de pressão de fora.'],
    respeito: ['O {opp} tem história e tem time. Vai ser um grande jogo.', 'Respeito total ao {opp}. Clássico é festa do futebol.'],
  },
  next: {
    confiante: ['Vamos lá pra ganhar. Não tem outro plano.', 'Estamos preparados. O {opp} vai encontrar um time pronto.'],
    diplomatica: ['Será um bom jogo. Respeito o {opp}.'],
    cautelosa: ['Adversário qualificado. Vamos com os pés no chão.', 'O {opp} é perigoso na transição. Cuidado redobrado.'],
    provocador: ['Vamos atropelar o {opp}.', 'Com todo respeito, o {opp} vai ter que correr muito.'],
    motivacional: ['Cada jogo é uma final.', 'Quero o estádio cheio. Com a torcida, a gente vira outro time.'],
    autocritico: ['Tenho que acertar o time pra esse jogo. A semana é de ajuste pra mim também.'],
    cobranca: ['Temos que melhorar muito até lá. O treino vai ser puxado.'],
    respeito: ['O {opp} tem um trabalho sólido. Estudamos muito esse adversário.'],
  },
  praise: {
    confiante: ['{who} é jogador de seleção. Não tenho dúvida.', '{who} está no melhor momento da carreira.'],
    diplomatica: ['{who} merece os elogios, mas o mérito é coletivo.'],
    cautelosa: ['{who} foi bem, mas precisa manter a regularidade.', 'Não vou colocar peso em {who}. Tem que seguir trabalhando.'],
    provocador: ['{who} está voando e vai calar muita boca.'],
    motivacional: ['{who} é exemplo pro grupo.', 'Se todo mundo tiver a entrega de {who}, ninguém segura a gente.'],
    protetor: ['{who} ouviu muita crítica e deu a resposta. Merece o carinho.'],
    cobranca: ['{who} jogou bem, mas precisa fazer isso sempre.'],
    respeito: ['O time todo ajudou {who} a brilhar. E o adversário deu trabalho.'],
  },
  crit: {
    confiante: ['Confio em {who}. Vai continuar jogando e vai responder.'],
    diplomatica: ['{who} tem meu apoio. Ninguém perde sozinho.'],
    cautelosa: ['Todo mundo passa por fase difícil. Vou conversar com {who}.'],
    irritado: ['{who} tem que acordar. Do jeito que está não dá.'],
    motivacional: ['Vamos juntos, {who}. Todo mundo aqui acredita em você.'],
    autocritico: ['Coloquei {who} numa função que não é a dele. O erro foi meu.'],
    protetor: ['Não vou expor {who}. Crítica a jogador é no vestiário.', 'Quem quiser bater em {who} vai ter que passar por mim.'],
    cobranca: ['{who} não rendeu o esperado e sabe disso.', '{who} sabe que precisa de mais. Já conversamos.'],
  },
  bench: {
    confiante: ['{who} está nos planos. A hora dele vai chegar.'],
    diplomatica: ['{who} é um grande profissional e tem meu respeito.'],
    cautelosa: ['Vou conversar com {who}. A concorrência é saudável.'],
    irritado: ['Quem quiser jogar que mostre no treino.'],
    motivacional: ['{who} vai ser importante nesta temporada.', 'A temporada é longa. {who} vai ter muitas chances.'],
    autocritico: ['Talvez eu devesse dar mais minutos a {who}. Vou rever.'],
    protetor: ['{who} treina muito e tem meu respaldo. Banco não é castigo.'],
    cobranca: ['{who} precisa treinar mais para ganhar espaço.'],
  },
  decision: {
    confiante: ['Foi a decisão certa. Faria de novo.'],
    diplomatica: ['Todos são importantes. Foi uma escolha técnica.'],
    cautelosa: ['Foi uma leitura do jogo. Posso ter errado, vou rever.'],
    irritado: ['Quem escala sou eu. Não vou me explicar pra arquibancada.'],
    motivacional: ['Quem entrou deu a vida. É assim que se faz.'],
    autocritico: ['Mexi mal. Assumo.', 'Na hora me pareceu o certo. Revendo, acho que me precipitei.'],
    protetor: ['Ninguém saiu por mau desempenho. Foi estratégia, e o jogador entendeu.'],
    cobranca: ['O time não respondeu e precisei mexer.'],
  },
  ref: {
    confiante: ['Não dependemos de arbitragem pra ganhar.'],
    diplomatica: ['A arbitragem tem um trabalho difícil. Não vou polemizar.'],
    cautelosa: ['Prefiro não falar da arbitragem.', 'Vou rever os lances com calma antes de opinar.'],
    irritado: ['A arbitragem decidiu o jogo. Foi um absurdo.', 'Tem lance que não dá pra aceitar. Vamos mandar o vídeo pra CBF.'],
    provocador: ['Engraçado como os lances duvidosos sempre caem pro mesmo lado.'],
    motivacional: ['Não vamos buscar desculpa. Vamos buscar a vitória.'],
    autocritico: ['Não culpo o árbitro. Culpo a nossa falta de pontaria.'],
    respeito: ['Árbitro também erra, assim como a gente. Respeito o trabalho.'],
  },
  pressure: {
    confiante: ['Peço confiança. A virada está perto.', 'Esse time vai reagir. Eu garanto.'],
    diplomatica: ['A torcida é o maior patrimônio do clube.'],
    cautelosa: ['Entendo a cobrança. É legítima.', 'É momento de trabalhar calado.'],
    irritado: ['Protesto não ganha jogo. Apoio ganha.'],
    motivacional: ['Torcida, estamos com vocês. Lotem o estádio!', 'Juntos a gente sai dessa. Separados, não.'],
    autocritico: ['Se alguém tem que ser cobrado, sou eu. Os resultados são minha responsabilidade.'],
    protetor: ['Cobrem a mim. Os jogadores estão dando tudo.'],
    cobranca: ['A torcida tem razão. O elenco precisa entregar mais.'],
  },
  boss: {
    confiante: ['Tenho total respaldo. A diretoria conhece o projeto.'],
    diplomatica: ['Relação excelente com a diretoria. Conversamos todos os dias.'],
    cautelosa: ['Converso sempre com a diretoria. Estamos alinhados.'],
    irritado: ['Se quiserem trocar, que troquem. Eu não mudo meu jeito.'],
    motivacional: ['Estamos todos no mesmo barco, remando juntos.'],
    autocritico: ['A diretoria tem direito de cobrar. Ainda não entreguei o que prometi.'],
    cobranca: ['Precisamos de mais estrutura e de mais entrega de todos.'],
  },
  injury: {
    confiante: ['Temos elenco. Quem entrar vai dar conta.'],
    diplomatica: ['Desejo pronta recuperação a todos.'],
    cautelosa: ['O DM está trabalhando. Vamos administrar.'],
    irritado: ['O calendário é desumano. Isso machuca os atletas.'],
    motivacional: ['Quem entrar vai honrar a camisa.'],
    autocritico: ['Talvez eu tenha exigido demais nos treinos. Vou rever a carga.'],
    protetor: ['Não vou arriscar ninguém. A saúde do atleta vem primeiro.'],
  },
  market: {
    confiante: ['O elenco já é forte. Quem vier é pra somar.'],
    diplomatica: ['Decisão conjunta com a diretoria, no tempo certo.'],
    cautelosa: ['Se aparecer oportunidade, a gente avalia.'],
    irritado: ['Preciso de reforço e a diretoria sabe disso.'],
    motivacional: ['Quem chegar vai encontrar um grupo unido.'],
    protetor: ['Ninguém sai daqui sem eu concordar. Esse grupo é o meu time.'],
    cobranca: ['O elenco tem carências claras.'],
  },
  reply: {
    confiante: ['Não perco tempo com isso. A resposta é em campo.'],
    diplomatica: ['Respeito a opinião. Cada um cuida da sua casa.'],
    cautelosa: ['Não vi a declaração. Prefiro não comentar.'],
    irritado: ['Achei deselegante. Não precisava.'],
    provocador: ['Quem fala demais costuma perder em campo.', 'Deve estar preocupado com o time dele.'],
    motivacional: ['Isso só motiva o grupo.'],
    respeito: ['Tenho respeito por ele, mas discordo.'],
  },
  event: {
    confiante: ['Já resolvemos internamente. Página virada.'],
    diplomatica: ['É um assunto interno e vamos tratar com respeito.'],
    cautelosa: ['O clube está apurando. Vamos agir com calma.'],
    irritado: ['Não vou tolerar esse tipo de coisa.'],
    motivacional: ['O grupo é maior que qualquer problema.'],
    protetor: ['O atleta errou, mas é ser humano. Vamos acolher e corrigir.'],
    cobranca: ['Foi um erro grave e haverá consequências.'],
  },
  wages: {
    confiante: ['A diretoria já me garantiu que vai resolver. Confio.'],
    diplomatica: ['É assunto da diretoria. O foco do elenco é o campo.'],
    cautelosa: ['Estamos acompanhando. Espero uma solução rápida.'],
    irritado: ['Jogador tem família. Salário atrasado é inaceitável.'],
    motivacional: ['Mesmo com tudo isso, o grupo está fechado. Vamos dar a resposta em campo.'],
    autocritico: ['Parte disso é responsabilidade minha. Pedi reforços que o clube não podia pagar.'],
    protetor: ['O elenco está sendo muito profissional. Merece receber em dia.'],
  },
};
// abertura conforme o momento do clube (só em alguns tons)
const ANS_CTX = {
  goodInCrisis: ['Precisávamos muito disso. ', 'Depois de semanas difíceis, esse resultado lava a alma. ', 'Era o jogo pra virar a chave. '],
  badInGood: ['A sequência era boa, e uma derrota não apaga o trabalho. ', 'Vínhamos bem, e isso não muda de uma hora pra outra. '],
  badInCrisis: ['Mais uma vez. Sei que a paciência está acabando. ', 'Não dá pra esconder: o momento é ruim. '],
};

// ---------- contexto ----------
function pressCtx() {
  const div = (Wd.divOf(S, S.club) || 'B');
  const tbl = SE.standings(S.comp[div].table), pos = tbl.findIndex(r => r.c === S.club) + 1, T = S.comp[div].table[S.club];
  const lm = S.lastMatch && S.lastMatch.season === S.season && !S.lastMatch.friendly ? S.lastMatch : null;
  const nx = SE.nextFixtureOf(S, S.club);
  const streak = (S.streak || {})[S.club] || '';
  return { div, pos, T, lm, nx: nx && !nx.pending ? nx : null, streak, bad: streak.endsWith('DD') || (streak.slice(-4).match(/D/g) || []).length >= 3, good: streak.endsWith('VVV') };
}
// estado da coletiva formal: pós-jogo do último jogo -> pré-jogo do próximo
// horários: pós-jogo abre no apito final da transmissão; pré-jogo abre na véspera (dia fictício),
// mas nunca com menos de 3h reais de antecedência, e nunca antes do apito final do jogo anterior. As duas são independentes.
const PRESS_PRE_H = 3, PRESS_LIVE_MIN = 6;
const gms = ms => ms * (S.speed > 1 ? S.speed : 1);
function pressTimes(X) {
  const T = {};
  if (X.lm && X.lm.k != null) T.posOpen = SE.slotTime(S, X.lm.k) + gms(PRESS_LIVE_MIN * 60000);
  if (X.nx) {
    // abre quando chega a véspera no calendário fictício
    const kick = SE.slotTime(S, X.nx.k); let open = kick - gms(PRESS_PRE_H * 3600000);
    try { open = SE.tOfFd(S, SE.fdOfSlot(X.nx.k) - 1); } catch (e) {}
    if (T.posOpen && T.posOpen > open) open = T.posOpen;
    T.preOpen = open; T.preClose = kick;
  }
  return T;
}
function pressKeys() {
  const X = pressCtx(), st = S.pressSt || {}, done = new Set(st.done || []), t = SE.now(S), T = pressTimes(X), out = [];
  if (X.lm) { const k = `pos-${S.season}-${X.lm.k}`; if (!done.has(k) && t >= (T.posOpen || 0)) out.push({ key: k, kind: 'pos', X }); }
  if (X.nx) { const k = `pre-${S.season}-${X.nx.k}`; if (!done.has(k) && t >= T.preOpen) out.push({ key: k, kind: 'pre', X, close: T.preClose }); }
  return out;
}
function pressKey() { const L = pressKeys(), cur = UI.modal && UI.modal.pk || (S.pressSt && S.pressSt.key); return L.find(x => x.key === cur) || L[0] || null; }
function buildQuestions(kind, X) {
  const r = C.R(`pq${S.season}${S.slot}${S.club}${kind}${(S.pressUsed || []).length}`), cands = [];
  // v191: condições da pergunta/resposta (liga ou copa, mando, lances do jogo...) pra não perguntar nem responder o que não aconteceu
  const F = { pos: kind === 'pos', pre: kind === 'pre' };
  const add = (topic, vars = {}, extra = {}) => cands.push({ topic, vars, fl: F, ...extra });
  const nm = id => P[id] ? P[id].short : '';
  if (kind === 'pos' && X.lm) {
    const lm = X.lm, home = lm.f.h === S.club, side = home ? 'h' : 'a', my = home ? lm.res.gh : lm.res.ga, ot = home ? lm.res.ga : lm.res.gh, opp = home ? lm.f.a : lm.f.h;
    const sc = my >= ot ? `${my} a ${ot}` : `${ot} a ${my}`, v = { opp, sc };
    // mata-mata: quem avança (placar, agregado ou pênaltis)
    const pens = lm.res.pens, pensWon = pens ? (home ? pens[0] > pens[1] : pens[1] > pens[0]) : false;
    let adv = null;
    if (lm.f.ko) {
      const tie = lm.f.comp === 'PL' && lm.f.leg === 2 && S.comp.PL && S.comp.PL.ties[lm.f.tie];
      if (tie && tie.win) adv = tie.win === S.club;
      else if (lm.res.agg) { const dA = home ? lm.res.agg[0] - lm.res.agg[1] : lm.res.agg[1] - lm.res.agg[0]; adv = dA > 0 || (dA === 0 && pensWon); }
      else adv = my > ot || (my === ot && pensWon);
    }
    const evs = lm.res.ev || [], goals0 = evs.filter(e => e.t === 'goal');
    let ga0 = 0, gb0 = 0, led0 = false; for (const g of goals0) { if (g.s === side) ga0++; else gb0++; if (ga0 > gb0) led0 = true; }
    Object.assign(F, { lg: ['A', 'B', 'C'].includes(lm.f.comp), cup: !['A', 'B', 'C'].includes(lm.f.comp), home, away: !home && !lm.f.neutral, neutral: !!lm.f.neutral,
      win: my > ot, loss: my < ot, draw: my === ot, notWin: my <= ot, led: led0, pensDec: my === ot && !!pens,
      pen: evs.some(e => e.pen && e.s !== side && e.t === 'goal'), var: evs.some(e => e.t === 'var' || e.t === 'goal_off'), red: evs.some(e => (e.t === 'red' || e.t === 'red2') && e.s !== side) });
    if (adv === false) add('elim', v, { opp, w: 9 });
    else if (adv === true && my <= ot) add('classif', v, { opp, w: 9 });
    else if (Math.abs(my - ot) >= 3) add(my > ot ? 'goleada' : 'goleadaSofrida', v, { opp, w: 9 });
    else if (C.isDerby(S.club, opp)) add(my > ot ? 'classicoV' : my < ot ? 'classicoD' : 'classicoE', v, { opp, w: 8 });
    else add(my > ot ? 'vitoria' : my < ot ? 'derrota' : 'empate', v, { opp, w: 8 });
    const mine = Object.entries(lm.res.pl).filter(([, x]) => x.side === side).map(([id, x]) => ({ id: +id, ...x }));
    const best = mine.slice().sort((a, b) => b.rt - a.rt)[0], worst = mine.filter(x => x.min >= 45).sort((a, b) => a.rt - b.rt)[0];
    if (best && best.rt >= 7.4) add('destaque', { who: nm(best.id) }, { pid: best.id, w: 6 });
    if (worst && worst.rt <= 5.6) add('criticado', { who: nm(worst.id) }, { pid: worst.id, w: 6 });
    const sub = lm.res.ev.find(e => e.t === 'sub' && e.s === side && e.why !== 'lesão');
    if (sub && P[sub.o]) add('subs', { who: nm(sub.o), min: String(sub.m).split('+')[0] }, { pid: sub.o, w: 4 });
    const tac = lm.res.ev.find(e => e.t === 'tactic' && e.s === side);
    if (tac) add('tatica', { tac: C.STYLES[tac.style] ? C.STYLES[tac.style].name : tac.style }, { w: 4 });
    const polemic = lm.res.ev.some(e => (e.t === 'red' || e.t === 'red2' || e.t === 'goal_off' || e.t === 'var' || e.pen) && e.s !== side);
    if (my < ot || polemic) add('arbitragem', { ref: (C.REFEREES[lm.ref] || {}).name || 'o árbitro', opp }, { opp, w: polemic ? 6 : 2 });
    const inj = lm.res.ev.find(e => e.t === 'injury' && e.s === side);
    if (inj) { const ni = mySquad().filter(id => vw(id).inj > 0).length; add('lesoes', { n: ni }, { w: 4, fl: { ...F, n2: ni >= 2, inj: true } }); }
    // lances e personagens do jogo
    const mn = e => parseInt(String(e.m).split('+')[0], 10) || 0;
    const goals = lm.res.ev.filter(e => e.t === 'goal');
    let a = 0, b = 0, trailed = false, led = false;
    for (const g of goals) { if (g.s === side) a++; else b++; if (a < b) trailed = true; if (a > b) led = true; }
    if (trailed && my > ot) add('virada', v, { opp, w: 9 });
    else if (led && my < ot) add('viradaSofrida', v, { opp, w: 9 });
    const lg = goals[goals.length - 1];
    // gol no fim só vira tema se mudou o resultado (gol da vitória ou do empate)
    if (lg && mn(lg) >= 85) {
      const fl2 = { ...F, acresc: String(lg.m).includes('+') };
      if (lg.s === side && (my - ot === 1 || my === ot)) add(my > ot ? 'golFim' : 'golFimEmpate', { ...v, min: lg.m }, { opp, w: 7, fl: fl2 });
      else if (lg.s !== side && (ot - my === 1 || my === ot)) add(my < ot ? 'golFimSofrido' : 'golFimSofridoEmpate', { ...v, min: lg.m }, { opp, w: 7, fl: fl2 });
    }
    const pm = lm.res.ev.find(e => (e.t === 'miss' || e.t === 'save') && e.pen && e.s === side && P[e.p]);
    if (pm) add('penPerdido', { who: nm(pm.p) }, { pid: pm.p, w: 7 });   // (fl.notWin decide se dá pra dizer que custou o resultado)
    const rc = lm.res.ev.find(e => (e.t === 'red' || e.t === 'red2') && e.s === side && P[e.p]);
    if (rc) add('expulso', { who: nm(rc.p) }, { pid: rc.p, w: 6 });
    const gk = mine.find(x => P[x.id] && P[x.id].pos === 'GOL' && x.min >= 60);
    if (gk && gk.rt <= 5.4 && ot >= 2) add('goleiroFalha', { who: nm(gk.id) }, { pid: gk.id, w: 6 });
    const ht = mine.find(x => (x.g || 0) >= 3);
    if (ht) add('hattrick', { who: nm(ht.id) }, { pid: ht.id, w: 9 });
    const arrived = new Set((S.trlog || []).filter(t => t[0] === S.season && t[4] === S.club && t[6] !== 'retorno').map(t => t[2]));
    const deb = mine.find(x => x.min >= 20 && arrived.has(x.id) && (Wd.ps(S, x.id).st || {}).j === 1);
    const decv = x => x.rt >= 7.5 || (x.g || 0) > 0;
    if (deb) add(vw(deb.id).loan && vw(deb.id).loan.kind === 'dia' ? 'diamante' : 'estreia', { who: nm(deb.id) }, { pid: deb.id, w: 7, fl: { ...F, dec: decv(deb), okj: deb.rt >= 6.5 } });
    else { const dm = mine.find(x => x.min >= 45 && vw(x.id).loan && vw(x.id).loan.kind === 'dia' && x.rt >= 7); if (dm) add('diamante', { who: nm(dm.id) }, { pid: dm.id, w: 5, fl: { ...F, dec: decv(dm), okj: true } }); }
    const yg = mine.find(x => x.min >= 30 && x.rt >= 6.8 && P[x.id] && (P[x.id].youth || Wd.age(S, x.id) <= 19));
    if (yg) add('jovem', { who: nm(yg.id) }, { pid: yg.id, w: 5, fl: { ...F, base: !!P[yg.id].youth } });
    const gt = lm.res.gate;
    if (home && gt && gt.occ < 0.5 && ['caro', 'abusivo'].includes(gt.pm)) add('ingresso', {}, { w: 5, fl: { ...F, empty: true } });
    else if (home && gt && gt.occ >= 0.97 && ['caro', 'abusivo'].includes(gt.pm)) add('ingresso', {}, { w: 3, fl: { ...F, full: true } });
  }
  if (kind === 'pre' && X.nx) {
    const opp = X.nx.h === S.club ? X.nx.a : X.nx.h, imp = SE.importantMatch(S, X.nx);
    { const lm0 = S.lastMatch && S.lastMatch.season === S.season && !S.lastMatch.friendly ? S.lastMatch : null, h0 = lm0 && lm0.f.h === S.club;
      Object.assign(F, { lg: ['A', 'B', 'C'].includes(X.nx.comp), cup: !['A', 'B', 'C'].includes(X.nx.comp), home: X.nx.h === S.club && !X.nx.neutral, away: X.nx.a === S.club && !X.nx.neutral,
        lastBad: !!lm0 && (h0 ? lm0.res.gh <= lm0.res.ga : lm0.res.ga <= lm0.res.gh) }); }
    if (C.isDerby(S.club, opp)) add('rival', { opp }, { opp, w: 9 }); else add('proximo', { opp }, { opp, w: 7 });
    if (imp && imp !== 'clássico') add('decisivo', { opp, imp }, { opp, w: 7 });
    const ret = mySquad().find(id => vw(id).inj <= 0 && vw(id).injEnd && (S.season * 100 + S.slot) - vw(id).injEnd <= 2);
    if (ret) add('retorno', { who: nm(ret) }, { pid: ret, w: 5 });
    const tired = mySquad().filter(id => vw(id).ovr >= 74 && vw(id).cond < 72 && vw(id).inj <= 0).sort((a, b) => vw(b).ovr - vw(a).ovr)[0];
    if (tired) add('duvida', { who: nm(tired) }, { pid: tired, w: 4 });
    const ref = SE.referee(S, X.nx.k, SE.fixturesOf(S, X.nx.k).findIndex(f => f.h === X.nx.h), X.nx);
    if (ref && ref.rigor >= 4) add('arbitroProx', { ref: ref.name }, { w: 3 });
    if (mySquad().filter(id => vw(id).inj > 0).length >= 2) add('lesoes', { n: mySquad().filter(id => vw(id).inj > 0).length }, { w: 4, fl: { ...F, n2: true, inj: true } });
    const top = mySquad().filter(id => vw(id).inj <= 0).sort((a, b) => vw(b).ovr - vw(a).ovr).slice(0, 14);
    if (top.length && top.reduce((s2, id) => s2 + vw(id).cond, 0) / top.length < 80) add('cansaco', {}, { w: 5 });
    if (['NE', 'SSE', 'VER'].includes(X.nx.comp)) add('regional', { cup: SE.COMP_NAME[X.nx.comp] }, { opp, w: 6 });
    const dk = Wd.deskOf(S, opp);
    if (dk && !C.isDerby(S.club, opp)) add('amigo', { opp, coach: S.desks[dk].manager }, { opp, w: 7 });
    const os = SE.oprStatus && SE.oprStatus(S, S.club);
    if (os && os.j && os.j % SE.ET_EVERY === SE.ET_EVERY - 1 && ['A', 'B', 'C'].includes(X.nx.comp)) add('objPremio', {}, { w: 4 });
  }
  // temas de contexto (valem nos dois momentos)
  if (X.bad) add('mafase', {}, { w: 6 });
  { const st2 = X.streak || '', noL = (st2.match(/[VE]+$/) || [''])[0].length, noW = (st2.match(/[ED]+$/) || [''])[0].length;
    if (noL >= 6) add('invicto', { n: noL }, { w: 5 });
    if (noW >= 4 && !X.bad) add('semVencer', { n: noW }, { w: 5 }); }
  if (X.T && X.T.j >= 5 && X.pos === 1) add('lider', {}, { w: 5 });
  if (X.good) add('boafase', {}, { w: 5 });
  if (X.T && X.T.j >= 12 && X.pos <= 3) add('titulo', {}, { w: 5 });
  if (X.T && X.T.j >= 8 && X.pos >= 17) add('rebaixamento', {}, { w: 6 });
  if ((S.board ?? 60) < 45) add('diretoria', {}, { w: 4 });
  if (X.bad || (S.board ?? 60) < 40) add('torcida', {}, { w: 4 });
  if (SE.windowOpen(SE.now(S), S)) add('mercado', {}, { w: 3 });
  const benched = mySquad().filter(id => (vw(id).benchRun || 0) >= 3 && vw(id).ovr >= 72 && Wd.avail(S, id)).sort((a, b) => vw(b).ovr - vw(a).ovr)[0];
  if (benched) add('banco', { who: nm(benched) }, { pid: benched, w: 3 });
  const unhappy = mySquad().filter(id => vw(id).mor < 35 && vw(id).ovr >= 70)[0];
  if (unhappy) add('insatisfeito', { who: nm(unhappy) }, { pid: unhappy, w: 3 });
  const exp = mySquad().filter(id => expiring(id) && vw(id).ovr >= 76).sort((a, b) => vw(b).ovr - vw(a).ovr)[0];
  if (exp) add('renovacao', { who: nm(exp) }, { pid: exp, w: 3 });
  const decl = S.news.find(n => n.t === 'press' && n.d >= S.lastDay - 3 && (n.clubs || []).includes(S.club) && !n.self && !(S.manager && n.title.startsWith(S.manager)) && /provoca|rebate|critica|alfineta/i.test(n.title));   // v192: nunca a fala do próprio técnico
  if (decl) { const m0 = /^(.+?) (rebate|provoca|critica|alfineta)/i.exec(decl.title), who2 = decl.who || (m0 ? m0[1] : null); if (who2 && !who2.startsWith(S.manager) && !S.manager.startsWith(who2)) add('declaracao', { who2 }, { w: 4, opp: (decl.clubs || []).find(c => c !== S.club) }); }
  const evn = S.news.find(n => n.t === 'event' && n.d >= S.lastDay - 3 && (n.clubs || []).includes(S.club));
  if (evn) add('evento', { ev: evn.title.length > 60 ? evn.title.slice(0, 57) + '…' : evn.title }, { w: 4 });
  if (S.obj && S.obj[S.club]) add('objetivo', { obj: S.obj[S.club].label, pos: X.pos }, { w: 1 });
  { const ar = SE.arrearsOf && SE.arrearsOf(S, S.club); if (ar && ar.days > 0) add('salarios', { n: ar.days }, { w: 3 + Math.min(6, ar.days) }); }
  // escolhe 3 temas (peso + sorteio), e a forma de perguntar menos usada recentemente
  const history = S.pressUsed || [], out = [], seenT = new Set();
  const recent = history.slice(-18).map(id => String(id).split(':')[0]);
  const order = cands.map(c => {
    const last = recent.lastIndexOf(c.topic), age = last < 0 ? Infinity : recent.length - 1 - last;
    const specific = (c.w || 1) >= 7;
    const cooldown = age < 3 ? (specific ? 0.62 : 0.25) : age < 9 ? (specific ? 0.8 : 0.55) : 1;
    return { c, s: (c.w || 1) * cooldown * (0.65 + r() * 0.7) };
  }).sort((a, b) => b.s - a.s).map(x => x.c);
  for (const c of order) {
    if (seenT.has(FAM[c.topic] + (c.pid || '')) || out.length >= 3) continue;
    const vars = QB[c.topic] || QB.objetivo, okIdx = vars.map((_, j) => j).filter(j => qLineOk(vars[j], c));
    if (!okIdx.length) continue;
    const i = pressFresh(okIdx, history, r, j => `${c.topic}:${j}`), raw = lineT(vars[i]);
    seenT.add(FAM[c.topic] + (c.pid || ''));
    const pre = typeof QPRE !== 'undefined' ? pk(QPRE.filter(x => (out.length || !/colega/.test(x)) && QPRE_OK(x, c)), r) : '', base = fill(raw, c.vars);
    const qtext = pre && /[:,] $/.test(pre) && !/^[A-ZÀ-Ú][a-zà-ú]+ [A-Z]/.test(base) && !/^\{/.test(raw) ? pre + base.charAt(0).toLowerCase() + base.slice(1) : pre + base;
    out.push({ ...c, kind, qid: `${c.topic}:${i}`, text: qtext, rep: pk(PRESS_REP, r), out: pk(PRESS_OUT, r), ctx: { bad: !!X.bad, good: !!X.good }, seed: Math.floor(r() * 1e9) });
  }
  return out;
}
function pressAnswers(q) {
  const fam = FAM[q.topic], X = q.ctx || {}, r = C.R(`pa${q.qid}|${q.seed ?? q.text}`);
  const v = { who: q.vars && q.vars.who || (q.pid && P[q.pid] ? P[q.pid].short : 'o grupo'), opp: q.opp || 'o adversário' };
  const used = S.pressAns || [], tn = S.pressTones || {};
  // v191: só entram frases que fazem sentido pra esta pergunta (adversário, jogador, liga/copa, antes/depois do jogo)
  const cx = ansCtx(q), filt = b => { const o = {}; for (const k in b || {}) { const L = (b[k] || []).filter(x => lineOk(x, cx)).map(lineT); if (L.length) o[k] = L; } return o; };
  const strict = STRICT_T.has(q.topic) && TOPIC_ANS[q.topic];
  const spec = filt(TOPIC_ANS[q.topic]), bank = strict ? spec : filt(ANS[fam] || ANS.boss);
  for (const k in spec) if (!bank[k] && !strict) bank[k] = [];   // tom que só existe no tema
  // 6 tons por pergunta: sorteio pesado pelos menos usados, garantindo um tom "duro" e um "suave"
  let tones = Object.keys(bank).filter(k => (bank[k] && bank[k].length) || (spec[k] && spec[k].length)).map(k => ({ k, s: r() + 1 / (1 + (tn[k] || 0)) })).sort((a, b) => b.s - a.s).map(x => x.k).slice(0, 6);
  const hard = ['irritado', 'provocador', 'cobranca'], soft = ['diplomatica', 'respeito', 'protetor', 'motivacional'];
  const add = list => { if (!tones.some(t => list.includes(t))) { const t = Object.keys(bank).find(k => list.includes(k)); if (t) tones[tones.length - 1] = t; } };
  add(hard); if (!tones.some(t => soft.includes(t))) { const t = Object.keys(bank).find(k => soft.includes(k) && !tones.includes(k)); if (t) tones[tones.length - 2] = t; }
  tones = [...new Set(tones)];
  if (q.vars) Object.assign(v, { cup: q.vars.cup, coach: q.vars.coach, min: q.vars.min, ref: q.vars.ref });
  return tones.map(k => {
    let pre = null;
    if (fam === 'good' && X.bad && ['confiante', 'motivacional', 'autocritico'].includes(k)) pre = ANS_CTX.goodInCrisis;
    else if (fam === 'bad' && X.good && ['confiante', 'motivacional', 'cautelosa'].includes(k)) pre = ANS_CTX.badInGood;
    else if (fam === 'bad' && X.bad && ['autocritico', 'cautelosa', 'irritado'].includes(k)) pre = ANS_CTX.badInCrisis;
    const cp = typeof composeAnswer === 'function' ? composeAnswer(q, k, bank, r, used, spec, pre ? { ...cx, noOpen: true } : cx) : null;   // com abertura de contexto, sem segunda abertura
    const tpl = cp ? cp.raw : pressFresh(bank[k], used, r);
    let text = fill(cp ? cp.text : tpl, v);
    if (pre) text = pk(pre, r) + text;
    return { k, text, raw: tpl, oc: cp ? cp.oc : [] };
  }).concat(ctxAnswers({ ...q, kind: q.kind || (S.pressSt || {}).kind }, r).filter(a => !tones.includes(a.k)));
}

// ---------- v201: coletiva por plateia ----------
// cada resposta fala com uma plateia: agrada um pilar e incomoda outro (ciclo: grupo incomoda a diretoria, torcida incomoda o grupo, diretoria incomoda a torcida)
// jogo grande (clássico, mata-mata, depois de 3 derrotas) vale 2×; o pilar da casa do DNA reage 1,5× no que sobe; a 3ª fala seguida pra mesma plateia vale metade
const AUD = { G: { l: 'Grupo', up: 'G', dn: 'D' }, T: { l: 'Torcida', up: 'T', dn: 'G' }, D: { l: 'Diretoria', up: 'D', dn: 'T' }, N: { l: 'Neutra' } };
const TONE_AUD = { protetor: 'G', motivacional: 'G', autocritico: 'G', confiante: 'G', gramado: 'G', provocador: 'T', irritado: 'T', cobranca: 'T', juiz: 'T', juizatk: 'T', pubentende: 'T', agressiva: 'T', critica: 'T', diplomatica: 'D', respeito: 'D', juizbom: 'D', pubcobra: 'D', cautelosa: 'N', juizneu: 'N' };
const AUD_UP = 2, AUD_DN = 1, PIL_L = { D: 'Diretoria', T: 'Torcida', G: 'Grupo' };
function pressHot() {
  const X = pressCtx(), kind = (S.pressSt || {}).kind, f = kind === 'pos' ? (X.lm && X.lm.f) : X.nx;
  const opp = f ? (f.h === S.club ? f.a : f.h) : null;
  if (opp && C.isDerby(S.club, opp)) return 'clássico';
  if (f && f.ko) return 'mata-mata';
  if (/DDD$/.test(X.streak || '')) return '3 derrotas seguidas';
  return null;
}
function pressAudFx(k) {
  const a = TONE_AUD[k] || 'N', A = AUD[a]; if (a === 'N') return { a, l: A.l };
  const hot = pressHot() ? 2 : 1, last = S.pressAud || [], rep = last.length >= 2 && last[last.length - 1] === a && last[last.length - 2] === a ? 0.5 : 1;
  let home = null; try { home = SE.DNA.home[C.dnaOf(S.club)] || null; } catch (e) {}
  const up = Math.max(1, Math.round(AUD_UP * hot * rep * (home === A.up ? 1.5 : 1))), dn = Math.max(1, Math.round(AUD_DN * hot));
  return { a, l: A.l, up: [A.up, up], dn: [A.dn, dn], hot: hot > 1, rep: rep < 1, home: home === A.up };
}
const audArrows = F => F.up ? `${PIL_L[F.up[0]]} ${F.hot ? '▲▲' : '▲'} · ${PIL_L[F.dn[0]]} ${F.hot ? '▼▼' : '▼'}` : 'Neutra · nada muda';
function pressAudApply(k, fx, all) {
  const F = pressAudFx(k);
  S.pressAud = [...(S.pressAud || []), F.a].slice(-6);
  if (!F.up) return F;
  const put = (p, v) => {
    if (p === 'D') { S.board = C.clamp((S.board ?? 60) + v, 0, 100); SE.plog(S, 'D', v, 'coletiva'); }
    else if (p === 'T') SE.fansAdd(S, v, 'coletiva');
    else { all(v); SE.plog(S, 'G', v, 'coletiva'); }
  };
  put(F.up[0], F.up[1]); put(F.dn[0], -F.dn[1]);
  fx.push(`${PIL_L[F.up[0]]} ▲${F.up[1]} · ${PIL_L[F.dn[0]]} ▼${F.dn[1]}${F.rep ? ' (mesma plateia de novo: vale metade)' : ''}`);
  return F;
}

// ---------- efeitos + manchete ----------
function pressInterpret(q, ans) {
  const r = C.R(`pi${S.lastDay}${S.slot}${q.qid}${ans.k}`), fx = [];
  const all = d => { for (const id of mySquad()) Wd.ps(S, id).mor = C.clamp(Wd.ps(S, id).mor + d, 0, 100); };
  const one = (id, d) => { if (!id || !P[id] || own(id) !== S.club) return; const s = Wd.ps(S, id); s.mor = C.clamp(s.mor + d, 0, 100); fx.push(`${P[id].short} ${d > 0 ? '+' : ''}${d} de moral`); };
  const rival = d => { if (!q.opp || q.opp === S.club || !Wd.squad(S, q.opp).length) return; for (const id of Wd.squad(S, q.opp)) Wd.ps(S, id).mor = C.clamp(Wd.ps(S, id).mor + d, 0, 100); fx.push(`${q.opp} usa a fala como motivação`); };
  const fam = FAM[q.topic];
  pressAudApply(ans.k, fx, all);
  switch (TONE_FX[ans.k] || ans.k) {
    case 'confiante': if (['rival', 'next'].includes(fam)) rival(2); if (q.pid) one(q.pid, fam === 'crit' ? 5 : 4); break;
    case 'agressiva': if (q.opp) rival(3); if ((fam === 'crit' || fam === 'bench') && q.pid) one(q.pid, -8); break;
    case 'diplomatica': if (q.pid) one(q.pid, 2); break;
    case 'critica': if (q.pid) one(q.pid, fam === 'praise' ? -2 : -7); break;
    case 'motivacional': if (q.pid) one(q.pid, 5); break;
    case 'autocritico': if (q.pid) one(q.pid, 4); break;
    case 'protetor': if (q.pid) one(q.pid, 6); break;
    case 'respeito': if (q.opp) fx.push(`clima amistoso com o ${q.opp}`); break;
    case 'gramado': fx.push('desculpa do gramado não convence'); break;
    case 'juizbom': fx.push(`fala elegante sobre ${ans.ref || 'a arbitragem'}`); break;
    case 'juiz': case 'juizatk': {
      const atk = (TONE_FX[ans.k] || ans.k) === 'juizatk';
      fx.push(atk ? `ataque à arbitragem de ${ans.ref || 'o árbitro'} repercute mal` : `crítica à arbitragem de ${ans.ref || 'o árbitro'} repercute`);
      if (r() < (atk ? 0.5 : 0.15)) {   // crítica técnica: às vezes a procuradoria do STJD também denuncia (multa menor)
        const amount = Math.max(3000, Math.round(Wd.payroll(S, S.club) * 1.2 / 1000) * 1000);
        S.stjd = S.stjd || []; S.stjd.push({ club: S.club, man: S.manager, ref: ans.ref || 'o árbitro', amount, at: (S.lastDay ?? 0) + 1 });
        fx.push('procuradoria do STJD vai analisar a fala');
      }
      break;
    }
  }
  if ((ans.k === 'agressiva' || ans.k === 'provocador' || (ans.k === 'irritado' && ['rival', 'reply'].includes(fam))) && q.opp && S.coaches[q.opp]) EV.rivalReply(S, q.opp, 'provocacao');
  if (ans.k === 'provocador') rival(1);
  if (q.pid && ['crit', 'praise', 'bench', 'decision', 'unhappy'].includes(fam)) playerReply(q.pid, ['critica', 'agressiva', 'cobranca', 'irritado'].includes(ans.k) ? 'neg' : ans.k === 'cautelosa' ? 'neu' : 'pos');
  const who = q.pid && P[q.pid] ? P[q.pid].short : null, M = S.manager, first0 = ans.text.split(/[.!?]/)[0].trim(), first = first0.length > 90 ? first0.slice(0, 87).replace(/\s+\S*$/, '') + '…' : first0;
  const H = {
    confiante: [`${M} garante: "${first}"`, `Confiante, ${M} projeta ${q.opp ? `o duelo com o ${q.opp}` : 'o futuro do ' + S.club}`, `"${first}", avisa ${M}`],
    cautelosa: [`${M} pede calma no ${S.club}`, `Pés no chão: ${M} evita euforia`, `${M} adota cautela na coletiva`],
    agressiva: [`${M} solta o verbo: "${first}"`, `Tom elevado: ${M} dispara na coletiva`, `${M} esquenta o clima${q.opp ? ` com o ${q.opp}` : ''}`],
    diplomatica: [`${M} mantém a elegância na coletiva`, `Diplomático, ${M} evita polêmica`, `${M} faz discurso conciliador`],
    critica: [`${M} cobra ${who || 'o elenco'} publicamente`, `Duro, ${M} expõe falhas do ${S.club}`, `"${first}": ${M} não poupa críticas`],
    motivacional: [`${M} inflama o grupo: "${first}"`, `Discurso de união: ${M} abraça o elenco`, `${M} convoca a torcida do ${S.club}`],
    gramado: [`${M} culpa o gramado: "${first}"`, `Desculpa do gramado: ${M} reclama das condições do campo`],
    juiz: [`${M} reclama da arbitragem de ${ans.ref || 'o árbitro'}`, `"${first}": ${M} questiona o apito`, `${M} vê erros de ${ans.ref || 'o árbitro'}`],
    juizatk: [`${M} detona a arbitragem de ${ans.ref || 'o árbitro'}`, `Revoltado, ${M} ataca ${ans.ref || 'o árbitro'}: "${first}"`, `${M} perde a linha com a arbitragem`],
    juizbom: [`${M} elogia a arbitragem de ${ans.ref || 'o árbitro'}`, `"${first}": ${M} aprova o trabalho de ${ans.ref || 'o árbitro'}`, `${M} vê arbitragem correta de ${ans.ref || 'o árbitro'}`],
    juizneu: [`${M} evita polêmica sobre a arbitragem`, `${M} não entra no mérito do apito de ${ans.ref || 'o árbitro'}`, `Sem polêmica: ${M} foca no time e deixa a arbitragem de lado`],
    pubcobra: [`${M} cobra a torcida após estádio vazio`, `"${first}", pede ${M}`],
    pubentende: [`${M} defende o torcedor: "${first}"`, `${M} entende o estádio vazio e promete reação`],
    irritado: [`Irritado, ${M} dispara: "${first}"`, `${M} perde a paciência na coletiva`, `Clima quente: ${M} não esconde a irritação`],
    provocador: [`${M} provoca${q.opp ? ` o ${q.opp}` : ''}: "${first}"`, `Alfinetada: ${M} esquenta o ambiente`, `${M} manda recado${q.opp ? ` ao ${q.opp}` : ''}`],
    autocritico: [`${M} assume a culpa: "${first}"`, `Autocrítico, ${M} chama a responsabilidade`, `"${first}", admite ${M}`],
    protetor: [`${M} blinda o elenco do ${S.club}`, `${M} sai em defesa ${who ? `de ${who}` : 'dos jogadores'}`, `"${first}": ${M} protege o grupo`],
    cobranca: [`${M} cobra ${who || 'o elenco'}: "${first}"`, `Exigente, ${M} quer mais dos jogadores`, `${M} aperta o grupo depois do jogo`],
    respeito: [`${M} elogia o ${q.opp || 'adversário'}`, `Respeito: ${M} valoriza o ${q.opp || 'rival'}`, `${M} mantém o tom respeitoso${q.opp ? ` com o ${q.opp}` : ''}`],
  };
  const tom = ['agressiva', 'provocador', 'irritado', 'juizatk'].includes(ans.k) ? 'provocacao' : ['critica', 'cobranca', 'juiz'].includes(ans.k) ? 'critica' : ['confiante', 'motivacional', 'protetor', 'respeito', 'juizbom'].includes(ans.k) ? 'elogio' : 'neutro';
  return { manchete: pk(H[ans.k], r), lide: `Perguntado por ${q.rep} (${q.out}): "${q.text}" ${M} respondeu: "${ans.text}"`, tom, fx: [...new Set(fx)] };
}

// ---------- jogador responde (declaração → repercussão → resposta) ----------
const REPLY = {
  concorda: ['O professor tem razão. Preciso render mais e vou dar a resposta em campo.', 'Aceito a cobrança. Sei que posso mais.'],
  agradece: ['Fico feliz com as palavras do professor. É trabalho de todo o grupo.', 'Obrigado pela confiança. Vou retribuir em campo.'],
  diplomatico: ['Cada um tem sua opinião. Eu sigo trabalhando.', 'Não vou polemizar. Meu foco é o próximo jogo.'],
  rebate: ['Ninguém treina mais do que eu. Acho que a crítica foi injusta.', 'Fiquei chateado. Essas coisas se resolvem no vestiário, não na imprensa.'],
  provoca: ['Ele devia se preocupar com o time dele.', 'Falar é fácil. Quero ver no campo.'],
  insatisfeito: ['Não gostei. Vou conversar com meu empresário.', 'Me senti exposto. Não é assim que se trata um jogador.'],
};
function playerReply(id, tone) {
  if (!P[id]) return;
  const s = Wd.ps(S, id), club = own(id), mine = club === S.club, r = C.R(`rp${id}${S.lastDay}${tone}`);
  const big = vw(id).ovr >= 78, rivalC = !mine && C.isDerby(club, S.club);
  let kind;
  if (tone === 'pos') kind = mine ? 'agradece' : rivalC ? 'diplomatico' : 'agradece';
  else if (tone === 'neu') kind = r() < 0.6 ? null : 'diplomatico';
  else if (mine) kind = s.temper === 'profissional' ? (r() < 0.7 ? 'concorda' : 'diplomatico') : s.temper === 'sensível' ? 'insatisfeito' : s.temper === 'temperamental' ? 'rebate' : big ? 'rebate' : 'concorda';
  else kind = rivalC ? 'provoca' : r() < 0.35 ? null : 'rebate';
  if (s.mor < 30 && mine && tone === 'neg') kind = 'insatisfeito';
  if (!kind) return;   // ignora
  const q = pk(REPLY[kind], r);
  if (mine && (kind === 'insatisfeito' || kind === 'rebate')) s.mor = C.clamp(s.mor - 3, 0, 100);
  const T = { concorda: `${P[id].short} aceita cobrança de ${S.manager}`, agradece: `${P[id].short} agradece elogios de ${S.manager}`, diplomatico: `${P[id].short} evita polêmica após fala de ${S.manager}`, rebate: `${P[id].short} rebate ${S.manager}`, provoca: `${P[id].short} provoca ${S.manager}`, insatisfeito: `${P[id].short} se irrita com ${S.manager}` }[kind];
  EV.schedule(S, { t: 'press', title: `${T}: "${q}"`, body: `${mine ? `Jogador do ${club}` : `Jogador do ${club}`} respondeu à declaração do técnico do ${S.club}.`, ids: [id], clubs: [club, S.club], front: kind === 'rebate' || kind === 'provoca' || kind === 'insatisfeito' ? 84 : 66 }, 20000 + Math.floor(r() * 20000));
}

// ---------- tela ----------
function pressModal(m) {
  const unread = (S.mentions || []).filter(x => !x.read).length;
  if (!m.tab) m.tab = pressKey() ? 'formal' : unread ? 'ment' : 'formal';
  const tabs = `<div class="seg ptabs"><button class="${m.tab === 'formal' ? 'on' : ''}" data-act="ptab2" data-k="formal">Coletiva</button><button class="${m.tab === 'free' ? 'on' : ''}" data-act="ptab2" data-k="free">Declaração</button><button class="${m.tab === 'ment' ? 'on' : ''}" data-act="ptab2" data-k="ment">Menções${unread && m.tab !== 'ment' ? ` <i class="bn blue">${unread > 9 ? '9+' : unread}</i>` : ''}</button></div>`;
  return `<div class="pressw"><div class="row between"><h2 class="disp" style="font-size:24px;margin:0">${ic('mic')} Imprensa</h2></div>${tabs}${m.tab === 'free' ? freeTab(m) : m.tab === 'ment' ? `<div class="pment">${mentionsModal().replace(/^<h2[^]*?<\/h2>/, '')}</div>` : formalTab()}</div>`;
}
function formalTab() {
  const L = pressKeys(), pk2 = pressKey(), st = S.pressSt || {};
  if (!pk2) {
    const last = st.log && st.log.length ? st.log : null, X = pressCtx(), T = pressTimes(X), t = SE.now(S);
    const nxt = X.nx && T.preOpen > t ? `A pré-jogo contra o ${esc(X.nx.h === S.club ? X.nx.a : X.nx.h)} abre ${when(T.preOpen).replace(/^(Hoje|Amanhã|Ontem)/, w => w.toLowerCase())}.` : 'A próxima abre na véspera do seu próximo jogo.';
    const posW = X.lm && T.posOpen > t ? ` A pós-jogo abre ${when(T.posOpen).replace(/^(Hoje|Amanhã|Ontem)/, w => w.toLowerCase())}, no apito final.` : '';
    return `<div class="note">${ic('clock')} Nenhuma coletiva agora. ${nxt}${posW}</div>${last ? `<div class="pchat">${logHTML(last)}</div>` : ''}`;
  }
  if (st.key !== pk2.key) {
    // guarda a coletiva em andamento e retoma a outra de onde parou
    const stash = {}; for (const [k2, v] of Object.entries(st.stash || {})) if (L.some(x => x.key === k2)) stash[k2] = v;
    if (st.key && st.qs && st.qi < st.qs.length && L.some(x => x.key === st.key)) stash[st.key] = { kind: st.kind, qs: st.qs, qi: st.qi, log: st.log };
    const sv = stash[pk2.key]; delete stash[pk2.key];
    S.pressSt = { key: pk2.key, kind: pk2.kind, qs: sv ? sv.qs : buildQuestions(pk2.kind, pk2.X), qi: sv ? sv.qi : 0, log: sv ? sv.log : [], done: (st.done || []).slice(-12), stash };
    setTimeout(save, 0);
  }
  const sel = L.length > 1 ? `<div class="chips pksel">${L.map(x => `<button class="chip ${x.key === pk2.key ? 'on' : ''}" data-act="pksel" data-k="${x.key}">${x.kind === 'pos' ? 'Pós-jogo' : 'Pré-jogo'}${x.close ? ` · até ${when(x.close).replace(/^Hoje /, '')}` : ''}</button>`).join('')}</div>` : '';
  const P2 = S.pressSt, q = P2.qs[P2.qi];
  const title = P2.kind === 'pos' ? (() => { const lm = S.lastMatch; return `Pós-jogo · ${esc(lm.f.h)} ${lm.res.gh}×${lm.res.ga} ${esc(lm.f.a)}`; })() : (() => { const nx = SE.nextFixtureOf(S, S.club); return `Pré-jogo · contra o ${esc(nx.h === S.club ? nx.a : nx.h)}`; })();
  const m = UI.modal || {};
  const free = q ? (m.fa ? `<div class="pfree"><textarea id="press-fa" maxlength="400" placeholder="Responda do seu jeito. O tom da sua fala (elogio, cobrança, provocação, calma…) decide o efeito, e o jornal publica suas palavras.">${esc(m.fdraft || '')}</textarea><div class="row" style="gap:8px"><button class="btn" data-act="pfreesend">${ic('mic')} Responder</button><button class="btn alt sm" data-act="pfreeopen">Voltar às opções</button></div></div>`
    : `<button class="popt pfreebtn" style="--pc:var(--lime)" data-act="pfreeopen"><span class="pl2">${ic('feather')} Com minhas palavras</span><span class="pt">Escreva a sua própria resposta para essa pergunta.</span></button>`) : '';
  const opts = q ? (m.fa ? '' : pressAnswers(q).map(a => { const F = pressAudFx(a.k); return `<button class="popt" style="--pc:${PROFILES[a.k].c}" data-act="pans" data-k="${a.k}"><span class="pl2">${ic(PROFILES[a.k].i)} ${PROFILES[a.k].l}<em class="paud ${F.up ? '' : 'neu'}">${esc(audArrows(F))}</em></span><span class="pt">${esc(a.text)}</span></button>`; }).join('')) + free : '';
  const hot = q ? pressHot() : null;
  return `${sel}${hot ? `<div class="note photn">${ic('flame')} <b>Coletiva quente</b> (${esc(hot)}): o que você falar vale o dobro, pra cima e pra baixo.</div>` : ''}<div class="row between"><b class="small">${title}</b><span class="small muted">${q ? `Pergunta ${P2.qi + 1} de ${P2.qs.length}` : 'Concluída'}</span></div>
    <div class="pchat">${logHTML(P2.log)}${q ? `<div class="pq now"><span class="pqrep">${esc(q.rep)} · ${esc(q.out)}</span><span>${esc(q.text)}</span></div>` : ''}</div>
    ${q ? `<div class="popts">${opts}</div>` : ''}`;
}
function logHTML(log) {
  return log.map(x => `<div class="pq"><span class="pqrep">${esc(x.rep)} · ${esc(x.out)}</span><span>${esc(x.q)}</span></div>
    <div class="pa" style="--pc:${PROFILES[x.k] ? PROFILES[x.k].c : 'var(--lime)'}"><span class="pqrep">${x.free ? 'Suas palavras · ' : ''}${x.k && PROFILES[x.k] ? PROFILES[x.k].l : 'Resposta'}</span>${esc(x.a)}</div>
    <div class="ph"><b>${esc(x.h)}</b>${x.fx && x.fx.length ? `<span>${esc(x.fx.join(' · '))}</span>` : ''}</div>`).join('');
}
function freeTab(m) {
  const log = (S.press || []).filter(p => p.free).slice(-4).map(p => `<div class="pa" style="--pc:var(--lime)"><span class="pqrep">Você</span>${esc(p.q)}</div><div class="ph"><b>${esc(p.h)}</b></div>`).join('');
  return `<p class="muted small" style="margin:0">Fale quando quiser: cite jogador, clube ou treinador com @ (ex.: @Palmeiras). A imprensa interpreta e pode haver resposta. Não conta como coletiva.</p>
    ${log ? `<div class="pchat">${log}</div>` : ''}
    <textarea id="press-q" placeholder="Ex.: O @Palmeiras só ganha no apito. E o @[Pedro] precisa acordar." maxlength="400">${esc(m.draft || '')}</textarea>
    <div class="mentions" id="press-ment"></div>
    <button class="btn" data-act="freesend" ${m.busy ? 'disabled' : ''}>${m.busy ? 'Enviando…' : 'Falar à imprensa'}</button>`;
}
function pressAnswerFree() {
  const st = S.pressSt; if (!st) return;
  const q = st.qs[st.qi]; if (!q) return;
  const ta = $('#press-fa'), raw = ((ta && ta.value) || '').trim();
  if (raw.length < 8) return toast('Escreva a sua resposta (pelo menos uma frase).', true);
  const cl = classifyFree(raw, q), lm = S.lastMatch;
  const k2 = alignTone(cl.k, stanceOf(raw), q, cl.conf);
  const ans = { k: k2, text: cleanFree(raw), raw: null, free: true, ref: /^juiz/.test(k2) ? ((C.REFEREES[lm && lm.ref] || {}).name || 'o árbitro') : undefined };
  const res = pressInterpret(q, ans);
  if (cl.offensive) { S.board = C.clamp((S.board ?? 60) - 4, 0, 100); res.fx.push('diretoria −4 (linguagem ofensiva)'); res.manchete = `Polêmica: ${S.manager} se exalta ao responder sobre ${q.opp ? 'o ' + q.opp : 'o momento do ' + S.club}`; res.tom = 'provocacao'; }
  else if (cl.heat >= 4 && ['irritado', 'provocador', 'cobranca'].includes(cl.k)) { res.fx.push('fala forte repercute'); }
  UI.modal.fa = false; UI.modal.fdraft = '';
  pressCommit(q, ans, res);
}
function pressAnswer(k) {
  const st = S.pressSt; if (!st) return;
  const q = st.qs[st.qi]; if (!q) return;
  const ans = pressAnswers(q).find(a => a.k === k); if (!ans) return;
  pressCommit(q, ans, pressInterpret(q, ans));
}
function pressCommit(q, ans, res) {
  const st = S.pressSt, k = ans.k;
  S.press = S.press || []; S.press.push({ q: q.text, h: res.manchete, l: res.lide }); S.press = S.press.slice(-20);
  EV.news(S, { t: 'press', self: true, front: res.tom === 'provocacao' ? 88 : res.tom === 'critica' ? 82 : 70, title: res.manchete, body: res.lide, fx: res.fx, ids: q.pid ? [q.pid] : [], clubs: [S.club, q.opp].filter(Boolean) });
  st.log.push({ rep: q.rep, out: q.out, q: q.text, a: ans.text, k, h: res.manchete, fx: res.fx, free: !!ans.free });
  S.pressUsed = [...(S.pressUsed || []), q.qid].slice(-250);
  if (ans.raw) S.pressAns = [...(S.pressAns || []), ans.raw].slice(-300);
  if (ans.oc && ans.oc.length) S.pressOC = [...(S.pressOC || []), ...ans.oc].slice(-60);
  S.pressTones = S.pressTones || {}; for (const t in S.pressTones) S.pressTones[t] *= 0.9; S.pressTones[k] = (S.pressTones[k] || 0) + 1;
  try { EV.tpfAdd(S, k); } catch (e) {}
  st.qi++;
  if (st.qi >= st.qs.length) { st.done = [...(st.done || []), st.key].slice(-12); if (st.stash) delete st.stash[st.key]; UI.modal.pk = null; toast('Coletiva concluída'); }
  UI.modal.keep = true; save(); renderModal();
  const pc = document.querySelector('.pchat'); if (pc) pc.scrollTop = pc.scrollHeight;
}
async function freeSend() {
  const m = UI.modal, ta = $('#press-q'), txt = (ta && ta.value) || '';
  if (!txt.trim()) return toast('Escreva o que quer dizer.', true);
  m.draft = txt; m.busy = true; renderModal();
  const ments = resolveMentions(txt);
  let res = null;
  if (SAMPLE) { try { await pressSendAI(txt, ments).then(x => { res = x; }); } catch (e) { res = null; } }
  if (!res || !res.manchete) res = templatePress(txt, ments);
  res.manchete = noColetiva(res.manchete);
  applyPress(txt, res, ments);
  const last = (S.press || [])[S.press.length - 1]; if (last) last.free = true;
  for (const x of ments) if (x.type === 'player') playerReply(x.id, res.tom === 'elogio' ? 'pos' : res.tom === 'neutro' ? 'neu' : 'neg');
  m.busy = false; m.draft = ''; save(); m.keep = true; renderModal();
}
async function pressSendAI(q, ments) {
  const div = (Wd.divOf(S, S.club) || 'B'), pos = SE.standings(S.comp[div].table).findIndex(r => r.c === S.club) + 1;
  const mtxt = ments.map(x => x.type === 'club' ? `clube ${x.name}` : x.type === 'coach' ? `técnico ${x.name} (${x.club})` : x.type === 'ref' ? `árbitro ${x.name}` : `jogador ${x.name} (${x.club})`).join('; ') || 'nenhuma';
  return SAMPLE.json(`Você é o editor de um portal esportivo brasileiro FICTÍCIO dentro do jogo "Treineiros". Transforme a fala do técnico em notícia. Não invente fatos. Nada de ofensas pessoais.
Contexto: técnico ${S.manager}, do ${S.club} (${pos}º na Série ${div}). Menções: ${mtxt}
Fala: """${q.slice(0, 400)}"""
A fala NÃO foi em coletiva (é declaração avulsa): na manchete nunca use "coletiva"; use verbos como dispara, afirma, diz que, crava, manda recado.
Responda só com JSON: {"manchete": string, "lide": string, "tom": "provocacao"|"elogio"|"critica"|"neutro"|"polemica", "alvos": [{"nome": string, "efeito": "positivo"|"negativo"|"neutro"}], "arbitro": 0|1|2}. "arbitro" só se um árbitro foi mencionado: 0 = comentário normal, 1 = crítica técnica, 2 = ofensa ou acusação de má-fé.`, { modelTier: 'quick', cache: false });
}
// menções: atualiza só a lista de sugestões, sem redesenhar a tela (o texto e o foco ficam)
document.addEventListener('input', ev => {
  const t = ev.target; if (t.id === 'press-fa' && UI.modal) { ev.stopImmediatePropagation(); UI.modal.fdraft = t.value; return; }
  if (t.id !== 'press-q' || !UI.modal) return;
  ev.stopImmediatePropagation();
  UI.modal.draft = t.value;
  const mm = t.value.match(/@([^\s@]{1,20})$/), box = $('#press-ment');
  if (box) box.innerHTML = mm ? mentionList(mm[1]) : '';
}, true);
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el || !UI.modal || UI.modal.type !== 'press') return;
  const act = el.dataset.act;
  if (act === 'pans') { ev.stopPropagation(); pressAnswer(el.dataset.k); }
  else if (act === 'pksel') { ev.stopPropagation(); UI.modal.pk = el.dataset.k; UI.modal.fa = false; UI.modal.keep = true; renderModal(); }
  else if (act === 'pfreeopen') { ev.stopPropagation(); UI.modal.fa = !UI.modal.fa; UI.modal.keep = true; renderModal(); if (UI.modal.fa) { const t = $('#press-fa'); if (t) t.focus(); } }
  else if (act === 'pfreesend') { ev.stopPropagation(); pressAnswerFree(); }
  else if (act === 'ptab2') { ev.stopPropagation(); UI.modal.tab = el.dataset.k; UI.modal.keep = false; renderModal(); }
  else if (act === 'freesend' || act === 'presssend') { ev.stopPropagation(); freeSend(); }
  else if (act === 'mention') {
    ev.stopPropagation();
    const ta = $('#press-q'); if (!ta) return;
    const v = el.dataset.v;
    ta.value = ta.value.replace(/@([^\s@]*)$/, v.includes(' ') ? `@[${v}] ` : `@${v} `);
    UI.modal.draft = ta.value; const box = $('#press-ment'); if (box) box.innerHTML = '';
    ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
  }
}, true);

// ===== coletiva v2: banco ampliado (perguntas específicas, respostas montadas em partes) + resposta livre =====
// ---------- mais formas de perguntar (somam às de ui8) ----------
const QX = {
  vitoria: ['O {opp} deu trabalho ou foi uma vitória tranquila?', 'Qual foi o momento em que você sentiu que o jogo era seu?', 'O time controlou o {opp} o tempo todo?', 'Vitória por {sc}. O placar foi justo?', 'O que você disse no intervalo que mudou o jogo?', 'Essa vitória muda o ambiente no clube?', 'Dá pra dizer que foi a melhor atuação recente?', 'O time sofreu em algum momento contra o {opp}?', 'Três pontos importantes. Já dá pra olhar pra cima na tabela?', 'Que nota você dá para o time hoje?', 'Qual setor mais te agradou contra o {opp}?', 'A torcida saiu cantando. Como foi ouvir isso?', 'Vitória magra ou vitória segura?', 'O time jogou para o resultado ou para o espetáculo?'],
  derrota: ['Foi um problema de atitude ou de estratégia?', 'O {opp} mereceu o resultado?', 'Em que momento o jogo escapou?', 'Você mudaria alguma coisa na escalação de hoje?', 'Derrota por {sc}. O vestiário está abalado?', 'O time sentiu a pressão contra o {opp}?', 'Faltou pontaria ou faltou criar?', 'Como levantar o grupo depois desse {sc}?', 'Essa derrota acende o sinal de alerta?', 'O {opp} encontrou os espaços que você tinha previsto?', 'A defesa foi o problema hoje?', 'O resultado passa por falha individual ou coletiva?', 'Você assume a responsabilidade por esse resultado?'],
  empate: ['Empate em {sc}. Faltou fôlego ou faltou coragem?', 'Deu para arriscar mais contra o {opp}?', 'O ponto conquistado vale como vitória?', 'O time recuou demais depois de sair na frente?', 'O {opp} saiu satisfeito com o empate. E você?', 'Empate fora é bom resultado?', 'O que faltou para transformar o empate em vitória?', 'Você ficou satisfeito com as substituições hoje?', 'Um empate que sabe a derrota?', 'O time foi melhor que o {opp} ou o empate foi justo?'],
  goleada: ['{sc}. Deu para tirar o pé no fim?', 'Algum jogador te surpreendeu nessa goleada?', 'Uma goleada dessas coloca o time em outro patamar?', 'Como evitar a empolgação depois de um {sc}?', 'Foi o {opp} que facilitou ou o time que sobrou?', 'Goleada assim vale mais que três pontos?', 'Foi a noite perfeita?'],
  goleadaSofrida: ['{sc} é um vexame?', 'Você pediu desculpas à torcida no vestiário?', 'O que você vai falar para os jogadores amanhã?', 'Um placar desses pede mudanças no time?', 'A diretoria já falou com você depois do {sc}?', 'Como uma goleada dessas acontece?', 'O time desistiu do jogo em algum momento?'],
  classico: ['Clássico vencido vale o mês inteiro?', 'Qual o sabor de enfrentar o {opp} num clássico?', 'Quem ganhou a batalha do meio-campo no clássico?', 'Clássico é emoção ou estratégia?', 'Dá pra provocar o torcedor do {opp} depois de hoje?', 'Como a torcida vai tratar esse clássico na semana?', 'O clássico teve o nível que você esperava?'],
  elim: ['A eliminação para o {opp} foi justa?', 'O que fica de lição dessa eliminação?', 'Agora é só o campeonato. Isso ajuda ou atrapalha?', 'Você se sente responsável pela eliminação?', 'O time sentiu o peso do mata-mata?', 'Que recado você dá para o torcedor decepcionado?'],
  destaque: ['{who} está no melhor momento da carreira?', '{who} jogou em outro nível hoje. Você esperava isso?', 'Onde {who} pode chegar?', 'Dá pra dizer que o time depende de {who}?', 'Que conselho você deu para {who} antes do jogo?', '{who} merece uma renovação com aumento?', '{who} é o líder desse grupo?', 'Qual a principal qualidade de {who}?'],
  criticado: ['{who} vive fase ruim. Falta confiança?', 'Você conversou com {who} depois do jogo?', '{who} vai ganhar outra chance?', 'A torcida pede {who} fora do time. O que você responde?', 'O problema de {who} é físico ou técnico?', '{who} está sentindo a pressão?', 'Existe alguém pronto para substituir {who}?'],
  subs: ['A entrada no lugar de {who} fez o time melhorar?', 'Por que tirar {who} justo quando ele crescia no jogo?', '{who} saiu irritado. Você viu?', 'A substituição de {who} foi física ou tática?', 'Você se arrependeu de alguma troca hoje?'],
  tatica: ['Mudar para {tac} foi planejado ou improviso?', 'O time entende bem o {tac}?', 'Você vai insistir no {tac} nos próximos jogos?', 'A mudança para {tac} deixou a defesa exposta?'],
  arbitragem: ['O pênalti marcado foi claro para você?', '{ref} teve critério nos cartões?', 'Você vai pedir o áudio do VAR?', 'O árbitro interferiu no resultado?', 'O time errou mais que o árbitro hoje?', 'Faltou coragem para marcar lances contra o {opp}?'],
  banco: ['{who} reclamou da reserva?', 'O que falta para {who} ser titular?', '{who} pode sair emprestado?', 'Você vê {who} como opção para o próximo jogo?'],
  mafase: ['O grupo ainda acredita no seu trabalho?', 'Você pensou em pedir demissão?', 'O que ainda dá para mudar nessa fase?', 'É hora de mudar o esquema?', 'O time está travado psicologicamente?', 'Quanto tempo você acha que ainda tem?', 'Falta liderança dentro de campo?'],
  boafase: ['Esse é o melhor momento do seu trabalho?', 'Até onde vai essa sequência?', 'O grupo está confiante demais?', 'Qual jogador simboliza essa boa fase?', 'O que mudou em relação ao começo da temporada?', 'A sequência dá moral para pedir reforços?'],
  titulo: ['Quem é o maior adversário na briga pelo título?', 'O elenco aguenta a pressão de ser favorito?', 'Você já fala em título com os jogadores?', 'O que separa o time do título hoje?', 'O calendário ajuda na briga pela taça?'],
  rebaixamento: ['Quantos pontos o time precisa para escapar?', 'Você prometeu algo para a torcida sobre a permanência?', 'O elenco está preparado para brigar lá embaixo?', 'Quais jogos são decisivos para fugir da zona?', 'Existe clima de desespero no clube?'],
  matamata: ['O grupo continental é mais difícil do que parecia?', 'Qual o jogo-chave para a classificação?', 'A viagem desgasta o time?'],
  torcida: ['A torcida tem razão nas cobranças?', 'Você conversaria com as organizadas?', 'Os protestos atrapalham o trabalho?', 'Como reconquistar a arquibancada?'],
  diretoria: ['O presidente te ligou depois do último jogo?', 'Você se sente prestigiado pela diretoria?', 'A diretoria interfere na escalação?', 'Existe conversa sobre renovação do seu contrato?'],
  lesoes: ['O departamento médico cheio é azar ou excesso de jogos?', 'Quem volta primeiro do departamento médico?', 'As lesões obrigam a mudar o esquema?', 'O gramado pode explicar tantas lesões?'],
  retorno: ['{who} volta como titular?', '{who} vai ter minutos controlados?', 'O retorno de {who} muda o time?'],
  duvida: ['{who} pediu para jogar mesmo cansado?', 'Vale o risco de escalar {who} desgastado?', '{who} vai ser preservado para o jogo mais importante?'],
  mercado: ['A diretoria prometeu contratações?', 'Você aceitaria vender um titular agora?', 'Chega um camisa 10?', 'O clube tem dinheiro para reforçar?', 'Você indicou algum nome?', 'Tem jogador pedindo para sair?'],
  insatisfeito: ['{who} pode pedir para sair?', 'Você teve uma conversa séria com {who}?', 'A insatisfação de {who} contamina o grupo?'],
  renovacao: ['A renovação de {who} é prioridade?', '{who} já recebeu proposta de outro clube?', 'Você pediu à diretoria para segurar {who}?'],
  proximo: ['O {opp} tem pontos fracos claros?', 'Vai com time completo contra o {opp}?', 'Que tipo de jogo você espera contra o {opp}?', 'O {opp} costuma complicar para o seu time?', 'Qual jogador do {opp} merece atenção?', 'O time está descansado para enfrentar o {opp}?', 'Qual o seu palpite para o jogo contra o {opp}?', 'Jogar contra o {opp} é bom momento?'],
  rival: ['O clássico contra o {opp} decide a temporada?', 'Tem alguma surpresa preparada para o {opp}?', 'Qual o peso do clássico para o seu cargo?', 'O {opp} chega melhor para o clássico?'],
  decisivo: ['Você vai poupar alguém pensando nesse jogo {imp}?', 'O elenco dorme bem antes de um jogo {imp}?', 'Qual o plano para o jogo {imp} contra o {opp}?'],
  declaracao: ['{who2} te provocou. Vai deixar sem resposta?', 'A declaração de {who2} motiva o seu time?'],
  evento: ['O clube errou na condução do caso "{ev}"?', 'O caso "{ev}" já está resolvido internamente?'],
  objetivo: ['Você acha a meta da diretoria justa?', 'O que falta para chegar ao objetivo "{obj}"?', 'Em {pos}º, o objetivo virou obrigação?'],
  arbitroProx: ['{ref} apita o próximo jogo. Você confia na escala?', 'Você pediu atenção dos jogadores com cartões por causa de {ref}?'],
  salarios: ['Você falou com o presidente sobre os salários?', 'O atraso pode fazer jogador pedir para sair?'],
  // temas novos
  virada: ['O time estava perdendo e virou. O que mudou?', 'Virada sobre o {opp}. Foi a vitória mais emocionante do ano?', 'O que você falou para o time quando estava atrás no placar?', 'Essa virada mostra a força mental do grupo?', 'Dá pra dizer que a virada veio do banco?', 'Virar contra o {opp} tem sabor especial?'],
  viradaSofrida: ['O time estava vencendo e perdeu. O que aconteceu?', 'Como explicar a virada sofrida contra o {opp}?', 'Faltou maturidade para segurar o resultado?', 'O time recuou demais depois do gol?', 'Virada sofrida dói mais que derrota comum?', 'A queda física explica a virada do {opp}?'],
  golFim: ['Gol aos {min} minutos. Você já tinha perdido a esperança?', 'O gol no fim foi sorte ou persistência?', 'Como o time manteve a cabeça até o apito final?', 'Aquele gol aos {min} pode mudar a temporada?', 'O que passou pela sua cabeça no gol dos acréscimos?'],
  golFimSofrido: ['Tomar o gol aos {min} minutos dói mais?', 'Faltou concentração no fim contra o {opp}?', 'O gol no fim foi falha de quem?', 'O time comemorou antes da hora?', 'Como se recuperar de um gol sofrido aos {min}?'],
  penPerdido: ['{who} perdeu o pênalti. Ele segue como cobrador?', 'Quem define o batedor de pênalti no time?', 'O pênalti perdido por {who} custou o resultado?', 'Como está {who} depois de desperdiçar a cobrança?', 'Você vai trocar o batedor depois do pênalti de {who}?'],
  expulso: ['A expulsão de {who} complicou o jogo?', '{who} vai ser multado pela expulsão?', 'Faltou cabeça para {who}?', 'Você conversou com {who} depois do cartão vermelho?', 'Com dez, o time conseguiu se organizar?'],
  goleiroFalha: ['{who} falhou nos gols. Ele segue titular?', 'Você perdeu a confiança em {who}?', 'O goleiro precisa de proteção nesse momento?', 'Falhas de {who} ou da defesa inteira?', 'É hora de dar chance ao reserva no gol?'],
  hattrick: ['{who} fez três gols. Qual foi o mais bonito?', 'Hat-trick de {who}. Ele está no nível de seleção?', '{who} leva a bola do jogo para casa. Merece?', 'Você esperava uma noite dessas de {who}?', '{who} é o artilheiro que o time precisava?'],
  estreia: ['{who} estreou hoje. Como avalia a primeira atuação?', 'A estreia de {who} correspondeu à expectativa?', '{who} já está adaptado ao time?', 'O que {who} acrescenta ao elenco?', '{who} vai ser titular daqui pra frente?'],
  jovem: ['{who} é cria da base e jogou bem. Ele está pronto?', 'Você vai dar mais minutos para {who}?', 'Qual o futuro de {who} no profissional?', 'Não é cedo para colocar {who} nesse tipo de jogo?', 'A base do clube está bem servida com {who}?'],
  invicto: ['São {n} jogos sem perder. Qual o segredo?', 'A invencibilidade pesa ou dá confiança?', 'O time aprendeu a não perder?', 'Até onde vai essa série invicta?'],
  semVencer: ['São {n} jogos sem vencer. O que falta?', 'A falta de vitórias já pesa no psicológico?', 'Um empate já seria bom resultado agora?', 'Você teme pelo cargo com essa série sem vitórias?'],
  cansaco: ['O elenco está cansado. Vai rodar o time?', 'Semana cheia de jogos. Como administrar o desgaste?', 'Vale poupar titulares mesmo arriscando o resultado?', 'O calendário apertado prejudica o seu time?', 'Quem está no limite físico?'],
  regional: ['Qual a importância da {cup} para o clube?', 'Vai usar time misto na {cup}?', 'A {cup} ajuda a dar ritmo para quem joga menos?', 'Ganhar a {cup} salva a temporada?', 'O torcedor valoriza a {cup}?'],
  objPremio: ['Na próxima rodada tem etapa do objetivo. O time está pronto?', 'A diretoria cobra muito as etapas do objetivo?', 'O time joga pensando na tabela ou jogo a jogo?', 'Faltam poucos pontos para a meta. Isso pesa?'],
  ingresso: ['O estádio estava vazio com ingresso caro. A diretoria errou no preço?', 'O preço do ingresso afastou o torcedor?', 'Casa cheia mesmo com ingresso caro. O torcedor respondeu?', 'Você pediu ingresso mais barato para a diretoria?'],
  amigo: ['O {opp} é treinado por {coach}, que você conhece bem. Clima de rivalidade?', 'Enfrentar {coach} tem gosto diferente?', 'Você já conversou com {coach} antes do jogo?', 'Quem leva a melhor no duelo com {coach}?', 'Existe aposta entre você e {coach}?'],
  diamante: ['{who} chegou e já decidiu. O investimento valeu?', 'Como é trabalhar com um jogador do nível de {who}?', '{who} fica só três meses. Dá pra aproveitar bem?', 'O elenco ficou com ciúmes da chegada de {who}?', '{who} muda o patamar do time?'],
  lider: ['O time lidera o campeonato. Dá pra segurar?', 'Liderança agora significa alguma coisa?', 'Quem vai incomodar a sua liderança?', 'Ser líder aumenta a pressão?'],
};
for (const k in QX) QB[k] = (QB[k] || []).concat(QX[k]);
Object.assign(FAM, { virada: 'good', viradaSofrida: 'bad', golFim: 'good', golFimSofrido: 'bad', penPerdido: 'crit', expulso: 'crit', goleiroFalha: 'crit', hattrick: 'praise', estreia: 'praise', jovem: 'praise', invicto: 'good', semVencer: 'pressure', cansaco: 'injury', regional: 'next', objPremio: 'boss', ingresso: 'pressure', amigo: 'rival', diamante: 'praise', lider: 'title' });

// ---------- respostas específicas de alguns temas (entram antes das genéricas da família) ----------
const TOPIC_ANS = {
  virada: {
    confiante: ['Esse time não se entrega. Perdendo ou ganhando, joga até o fim.', 'Quem estava perdendo virou porque acreditou. É esse o nosso DNA.'],
    motivacional: ['Virada é coisa de time com alma. Hoje o torcedor viu isso.', 'Quando a gente estava atrás, olhei pro banco e vi todo mundo em pé. Aí eu soube.'],
    autocritico: ['Comecei errando a estratégia e os jogadores consertaram. O mérito é deles.', 'Demorei pra mexer. Quando mexi, o time respondeu.'],
    cautelosa: ['Não dá pra depender de virada toda semana. Começamos mal de novo.', 'A reação foi ótima, mas o primeiro tempo me preocupa.'],
    provocador: ['Tem gente que já estava comemorando lá do outro lado. Comemoraram cedo.', 'Achavam que estava resolvido. Não conhecem esse grupo.'],
  },
  viradaSofrida: {
    autocritico: ['Recuei o time na hora errada. Essa derrota é minha.', 'Mexi mal no segundo tempo. Assumo.'],
    cobranca: ['Estávamos com o jogo na mão e soltamos. Isso não pode acontecer.', 'Faltou maturidade. Time grande fecha o jogo quando está na frente.'],
    irritado: ['Não aceito tomar uma virada dessas. Não aceito.', 'É inadmissível. Vamos ter uma conversa dura amanhã.'],
    cautelosa: ['Precisamos entender por que o time caiu tanto fisicamente.', 'Vou rever o jogo. Tem coisa que eu preciso entender antes de falar.'],
    protetor: ['Os jogadores deram tudo até cansar. A virada não é falta de vontade.', 'Ninguém aqui desistiu. O {opp} teve mérito no final.'],
  },
  golFim: {
    motivacional: ['Gol no fim é recompensa pra quem não desiste. Esse grupo não desiste.', 'O torcedor que ficou até o fim foi recompensado. É pra ele.'],
    confiante: ['Eu sabia que ia sair. O time estava por cima no final.', 'A gente treina pra isso: jogo só acaba no apito.'],
    cautelosa: ['Não pode ficar deixando pra resolver no último minuto.', 'Fico feliz, mas precisamos matar o jogo antes.'],
    provocador: ['Tinha gente fazendo cera ali. O futebol castigou.', 'Quem joga pra empatar costuma se dar mal.'],
  },
  golFimSofrido: {
    cobranca: ['Gol no fim é falta de concentração. Vou cobrar.', 'Faltou malícia pra segurar. Time experiente não toma esse gol.'],
    irritado: ['Tomar gol nos acréscimos é imperdoável.', 'Estou muito irritado. Jogamos o jogo todo e jogamos fora no último lance.'],
    protetor: ['O time estava no limite físico. Acontece.', 'Não vou crucificar ninguém por um lance no final.'],
    autocritico: ['Devia ter trocado antes pra segurar. Errei.', 'A troca que eu fiz no fim não funcionou. É comigo.'],
  },
  penPerdido: {
    protetor: ['Só perde pênalti quem tem coragem de bater. {who} segue sendo o nosso cobrador.', '{who} já nos deu muitos pontos. Um pênalti não apaga isso.'],
    cobranca: ['Pênalti é treino. Vou rever com todo mundo quem bate.', '{who} sabe que precisava converter. Ele vai responder.'],
    cautelosa: ['Vamos avaliar a questão dos pênaltis com calma.', 'Não vou decidir nada sobre o batedor agora.'],
    motivacional: ['Amanhã {who} está treinando pênalti comigo. E vai fazer o próximo.', 'O grupo abraçou {who} no vestiário. É isso que importa.'],
  },
  expulso: {
    cobranca: ['{who} deixou o time na mão. Vai ser multado, e ele sabe.', 'Expulsão boba. Isso custa caro num jogo desses.'],
    protetor: ['{who} é intenso, é o jeito dele. Às vezes passa do ponto.', 'Achei o cartão rigoroso. {who} tem meu apoio.'],
    irritado: ['Com um a menos ninguém joga. A expulsão matou o jogo.', 'Não dá. Não dá pra perder a cabeça desse jeito.'],
  },
  goleiroFalha: {
    protetor: ['{who} já salvou esse time várias vezes. Hoje não foi o dia dele.', 'Goleiro fica marcado por um erro. Eu confio em {who}.'],
    cobranca: ['{who} sabe que falhou. Posição de goleiro não perdoa.', 'Vou conversar com o preparador de goleiros. Tem coisa pra corrigir.'],
    cautelosa: ['Não vou decidir o goleiro agora, de cabeça quente.', 'A defesa inteira precisa proteger mais o nosso goleiro.'],
  },
  hattrick: {
    confiante: ['{who} está em chamas. Ninguém segura quando ele está assim.', 'Três gols e podia ter feito mais. {who} é diferenciado.'],
    cautelosa: ['Fico feliz por {who}, mas ele sabe que pode melhorar em outras coisas.', 'Três gols. Agora é manter os pés no chão.'],
    motivacional: ['A bola é dele. {who} mereceu cada gol.', 'Vi {who} treinando finalização até tarde. Hoje ele colheu.'],
    provocador: ['Tem muito zagueiro que vai ter pesadelo com {who} essa noite.', 'Pediram {who} fora do time mês passado. Tá aí.'],
  },
  estreia: {
    confiante: ['{who} chegou pronto. Vai ajudar muito.', 'Estreia de gente grande. É o reforço que a gente precisava.'],
    cautelosa: ['Primeiro jogo, ainda em adaptação. Vamos dar tempo a {who}.', 'Foi uma boa estreia, mas {who} pode render mais.'],
    motivacional: ['A torcida abraçou {who} logo de cara. Isso faz diferença.', 'Bem-vindo, {who}. Aqui você vai ser feliz.'],
  },
  jovem: {
    motivacional: ['{who} é o futuro desse clube. Quem viu hoje sabe.', 'A base forma, a gente lança. {who} tem muito a dar.'],
    cautelosa: ['{who} é jovem. Vamos colocar aos poucos, sem pressão.', 'Não quero ninguém chamando {who} de craque ainda. Deixa ele crescer.'],
    protetor: ['Se {who} errar, a culpa é minha que coloquei. Ele tem toda a minha confiança.', 'Ninguém vai queimar {who}. Eu cuido dele.'],
  },
  cansaco: {
    cautelosa: ['Vamos olhar os números de cada um. Quem estiver no limite descansa.', 'Semana de dois jogos pede cuidado. Vai ter rodízio.'],
    confiante: ['O elenco é grande e está preparado. Quem entrar vai dar conta.', 'Rodar o time faz parte. Confio em todo mundo.'],
    irritado: ['Esse calendário é desumano. Ninguém aguenta jogar assim.', 'Pedem espetáculo e não dão descanso. Fica difícil.'],
    autocritico: ['Talvez eu tenha exigido demais nas últimas semanas. Vou dosar.', 'Poderia ter rodado antes. Aprendi.'],
  },
  regional: {
    confiante: ['Toda competição que a gente entra é pra ganhar. A {cup} também.', 'Taça é taça. A {cup} está nos nossos planos.'],
    cautelosa: ['A {cup} é importante, mas a prioridade é o campeonato.', 'Vamos equilibrar. Quem precisa de ritmo joga a {cup}.'],
    motivacional: ['A {cup} é a chance de dar alegria pra região inteira.', 'Quem joga menos vai ter a chance de brilhar na {cup}.'],
    respeito: ['Os clubes da {cup} são duros, conhecem bem a região. Respeito todos.', 'Tem muito time organizado na {cup}. Não tem jogo fácil.'],
  },
  ingresso: {
    pubentende: ['O torcedor tem razão. Com esse preço fica difícil vir ao estádio.', 'Eu entendo quem não veio. Vou conversar com a diretoria.'],
    pubcobra: ['O time precisa do torcedor. Peço que venham, mesmo no sacrifício.', 'Estádio cheio ganha jogo. Precisamos de todo mundo.'],
    diplomatica: ['Preço de ingresso é com a diretoria. Eu cuido do campo.', 'Não é minha área, mas o torcedor sempre faz falta.'],
  },
  amigo: {
    provocador: ['{coach} sabe que vai ter trabalho. E eu vou lembrar ele disso depois do jogo.', 'Já avisei {coach}: dessa vez não tem desculpa.'],
    respeito: ['{coach} faz um trabalho muito bom. Vai ser jogo de xadrez.', 'Tenho muito respeito pelo {coach}. Que vença o melhor.'],
    confiante: ['Conheço as manias do {coach}. Estamos preparados.', 'Esse duelo é nosso. {coach} vai ter que se virar.'],
    diplomatica: ['Amizade fica fora das quatro linhas. Lá dentro é jogo.', 'Depois do jogo a gente conversa. Durante, cada um no seu.'],
  },
  diamante: {
    confiante: ['{who} está acima da média. Ele decide.', 'Jogador desse nível muda qualquer time. É por isso que ele está aqui.'],
    motivacional: ['Os jovens aprendem só de ver {who} treinando. Isso vale muito.', '{who} trouxe outra energia pro vestiário.'],
    cautelosa: ['{who} é um grande jogador, mas futebol se ganha no coletivo.', 'Não é um jogador que resolve tudo. O time precisa ajudar.'],
  },
  lider: {
    confiante: ['Liderança não é acaso. O time está onde merece.', 'Estamos em cima e vamos continuar.'],
    cautelosa: ['Liderança agora não ganha nada. O campeonato é longo.', 'É bom estar em cima, mas ninguém aqui está comemorando.'],
    provocador: ['Quem quiser a liderança vai ter que tirar da gente.', 'Os outros estão olhando pra cima. A gente só olha pra frente.'],
  },
};

// ---------- aberturas e fechamentos por tom (combinam com o miolo: milhares de variações) ----------
// v191: cada pedaço pode ter condição: f = famílias onde cabe, x = famílias onde não cabe, c = condições (pos, opp, lg...)
const MATCHF = ['good', 'bad', 'draw', 'classif'], GOODF = ['good', 'streak', 'classif', 'title', 'praise'];
const OPEN = {
  confiante: ['Olha, ', 'Vou ser direto: ', 'Tenho convicção: ', 'Sem rodeio: ', 'Pode escrever: ', { t: 'Eu confio muito nesse grupo. ', x: ['reply', 'event'] }, 'Estou tranquilo. '],
  diplomatica: [{ t: 'Primeiro, parabéns a todos. ', f: ['good', 'classif'] }, 'Com todo respeito, ', { t: 'Faz parte. ', f: ['bad', 'draw', 'slump', 'injury', 'pressure'] }, 'Eu vejo assim: ', 'Sem polêmica: ', { t: 'Futebol é isso. ', f: MATCHF }],
  cautelosa: ['Calma. ', 'Vamos por partes. ', { t: 'É cedo pra conclusões. ', x: ['reply', 'wages', 'event', 'market', 'injury', 'fitness', 'renew', 'refNext', 'boss', 'goal', 'unhappy'] }, 'Prefiro ter cuidado. ', { t: 'Sem euforia e sem drama: ', f: ['good', 'bad', 'draw', 'title', 'streak', 'slump', 'classif'] }, { t: 'Eu penso no próximo passo. ', x: ['reply', 'event'] }],
  irritado: ['Vou falar o que penso: ', 'Sinceramente? ', { t: 'Não dá pra aceitar. ', f: ['bad', 'draw', 'crit', 'ref', 'wages', 'slump', 'event'] }, { t: 'Estou chateado, e não vou esconder. ', f: ['bad', 'draw', 'crit', 'ref', 'wages', 'slump', 'reply', 'event'] }, 'Olha, ', 'Tem coisa que me incomoda. '],
  provocador: ['Tem gente que vai ter que ouvir: ', 'Vou deixar um recado: ', 'Alguns vão ficar incomodados, mas ', 'Pode anotar: ', { t: 'Pra quem duvidou: ', f: ['good', 'title', 'streak', 'praise', 'classif'] }],
  motivacional: ['Esse grupo é especial. ', 'Eu tenho orgulho desses caras. ', 'Quero falar com o torcedor: ', 'Ninguém solta a mão de ninguém aqui. ', { t: 'Olha a entrega desse time. ', c: ['pos'], f: MATCHF }],
  autocritico: [{ t: 'Assumo: ', x: GOODF }, 'Sou o primeiro a reconhecer: ', 'Vou ser honesto comigo mesmo: ', { t: 'A responsabilidade é minha. ', x: GOODF }, { t: 'Errei, e digo isso de frente: ', x: GOODF }],
  protetor: [{ t: 'Não vou expor ninguém. ', x: GOODF }, { t: 'Aqui ninguém vai ser crucificado. ', x: GOODF }, 'Eu defendo meus jogadores: ', { t: 'Quem quiser criticar, critica o técnico. ', x: GOODF }, 'Eu fecho com o grupo. '],
  cobranca: ['Vou ser exigente: ', 'Não passo a mão na cabeça. ', 'Cobro porque sei que dá pra mais: ', 'O padrão aqui é alto. ', 'Tem que melhorar, e rápido. '],
  respeito: [{ t: 'Respeito muito o adversário. ', c: ['opp'], f: [...MATCHF, 'next', 'rival'] }, 'É preciso reconhecer: ', 'Com toda a humildade: ', { t: 'Tiro o chapéu: ', c: ['opp'], f: [...MATCHF, 'next', 'rival'] }, 'Sem arrogância: '],
};
const CLOSE = {
  confiante: [{ t: ' Vamos brigar lá em cima.', f: ['good', 'title', 'streak', 'next', 'rival', 'classif', 'draw', 'goal'] }, ' O melhor ainda está por vir.', ' Podem confiar.', ' A gente sabe o caminho.', ' Esse time vai crescer ainda mais.', ' Não tenho dúvida disso.'],
  diplomatica: [' Seguimos trabalhando.', ' Respeito é fundamental.', ' Agora é olhar pra frente.', ' É isso, pessoal.', ' Cada um no seu papel.'],
  cautelosa: [' Um jogo de cada vez.', ' Muito trabalho pela frente.', ' Pé no chão sempre.', { t: ' Amanhã a gente conversa com calma.', c: ['pos'], f: ['bad', 'draw', 'crit', 'decision', 'ref'] }, { t: ' Sem oba-oba.', f: ['good', 'title', 'streak', 'praise', 'classif'] }],
  irritado: [{ t: ' Vou resolver isso internamente.', f: ['bad', 'crit', 'draw', 'decision', 'event', 'wages', 'slump'] }, { t: ' Não vai se repetir.', f: ['bad', 'draw', 'crit', 'slump'] }, ' Não estou aqui pra passar pano.', { t: ' Isso me tira do sério.', f: ['bad', 'draw', 'crit', 'ref', 'reply', 'wages', 'event'] }, ' E ponto final.'],
  provocador: [' Quem quiser, que venha.', ' Guarda essa fala.', ' Depois a gente conversa.', ' Tá dado o recado.', ' Que venham os próximos.'],
  motivacional: [' Juntos a gente vai longe.', ' Torcedor, confia.', ' É por vocês.', ' Vamos com tudo.', ' Esse time tem alma.'],
  autocritico: [' Vou corrigir.', ' Aprendo com isso.', { t: ' É comigo, não com eles.', x: GOODF }, { t: ' Vou trabalhar pra não repetir.', x: GOODF }],
  protetor: [{ t: ' Eles têm todo o meu apoio.', n: ['who'] }, { t: ' Esse grupo merece respeito.', n: ['who'] }, ' Aqui é todo mundo junto.', { t: ' Que me cobrem, não a eles.', n: ['who'] }],
  cobranca: [' Quero ver reação já.', ' Vai ter conversa séria.', ' Quem não render vai perder espaço.', ' O próximo jogo é a resposta.'],
  respeito: [{ t: ' Grande adversário.', c: ['opp'], f: [...MATCHF, 'next', 'rival', 'title'] }, { t: ' Foi um jogo de alto nível.', c: ['pos', 'opp'], f: MATCHF }, { t: ' Mérito deles também.', c: ['pos', 'opp'], f: MATCHF }, { t: ' Sempre bom enfrentar times assim.', c: ['opp'], f: [...MATCHF, 'next', 'rival'] }],
};

// ---------- v191: condições das frases (perguntas e respostas) ----------
// Uma frase pode ser texto puro ou { t, c: [precisa], n: [não pode], f: [famílias], x: [famílias proibidas] }.
// Além disso, {opp}/{who}/{cup}/{coach} exigem o dado correspondente.
const lineT = x => typeof x === 'string' ? x : x.t;
function lineOk(x, cx) {
  const t = lineT(x);
  if (/\{opp\}/.test(t) && !cx.opp) return false;
  if (/\{who\}/.test(t) && !cx.who) return false;
  if (/\{cup\}/.test(t) && !cx.cup) return false;
  if (/\{coach\}/.test(t) && !cx.coach) return false;
  if (/\{ref\}/.test(t) && !cx.ref) return false;
  if (typeof x === 'string') return true;
  if (x.c && !x.c.every(k => cx[k])) return false;
  if (x.n && x.n.some(k => cx[k])) return false;
  if (x.f && !x.f.includes(cx.fam)) return false;
  if (x.x && x.x.includes(cx.fam)) return false;
  return true;
}
const qLineOk = (x, c) => { const v = c.vars || {}; return lineOk(x, { ...(c.fl || {}), fam: FAM[c.topic], topic: c.topic, opp: v.opp != null || !!c.opp, who: v.who != null, cup: v.cup != null, coach: v.coach != null, ref: v.ref != null }) && !/\{(sc|min|n|tac|imp|ev|obj|pos|who2)\}/.test(lineT(x).replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? '' : m)); };
function ansCtx(q) {
  const k = q.kind || (S.pressSt || {}).kind, fl = q.fl || {};
  return { ...fl, pos: k === 'pos', pre: k === 'pre', fam: FAM[q.topic], topic: q.topic, opp: !!q.opp, who: !!((q.vars && q.vars.who) || q.pid),
    cup: !!(q.vars && q.vars.cup), coach: !!(q.vars && q.vars.coach), ref: !!(q.vars && q.vars.ref), sub: q.topic === 'subs', inj: !!fl.inj || q.topic === 'lesoes' };
}

// ---------- montagem: escolhe o miolo (tema > família), e às vezes junta abertura e fechamento ----------
function composeAnswer(q, k, bank, r, used, spec0, cx0) {
  const cx = cx0 || ansCtx(q), keep = L => (L || []).filter(x => lineOk(x, cx)).map(lineT);
  const spec = spec0 ? spec0[k] : keep(TOPIC_ANS[q.topic] && TOPIC_ANS[q.topic][k]);
  const generic = keep(bank[k]);
  const specific = spec && spec.length && pressFresh(spec, used, r);
  const genericChoice = generic.length && pressFresh(generic, used, r);
  const age = t => { const i = used.lastIndexOf(t); return i < 0 ? Infinity : used.length - 1 - i; };
  // O texto ligado ao lance tem prioridade, salvo quando acabou de ser dito.
  const core = specific && (age(specific) >= 12 || !genericChoice || age(genericChoice) < 4) ? specific : genericChoice || specific;
  const pickFresh = arr => { const L = keep(arr); return L.length ? pressFresh(L, S.pressOC || [], r) : ''; };
  const SYN = { corrig: 'FIX', rever: 'FIX', ajusta: 'FIX', dosar: 'FIX', aprend: 'FIX', repeti: 'FIX', respon: 'RESP', culpa: 'RESP', assumo: 'RESP', confia: 'CONF', confio: 'CONF', torced: 'TORC', torcid: 'TORC' };
  const words = t => new Set((norm(t).match(/[a-z]{5,}/g) || []).map(w => SYN[w.slice(0, 6)] || w.slice(0, 6)));
  const cw = words(core), clash = t => { for (const w of words(t)) if (cw.has(w)) return true; return false; };
  let o = !cx.noOpen && r() < 0.42 ? pickFresh(OPEN[k]) : '', c = r() < (o ? 0.25 : 0.45) ? pickFresh(CLOSE[k]) : '';
  if (o && /talvez|acho que/i.test(core) && ['autocritico'].includes(k)) o = '';   // não abre com 'Errei' e completa com 'talvez'
  if (o && clash(o)) o = ''; if (c && clash(c)) c = '';
  const lower = o && /[:,] $/.test(o) ? core.charAt(0).toLowerCase() + core.slice(1) : core;
  return { raw: core, text: (o + lower + c).replace(/\s+/g, ' ').trim(), oc: [o, c].filter(Boolean) };
}

// ---------- resposta livre: interpretação local (tom, alvo e intensidade) ----------
const FREE_LEX = {
  confiante: /(confi|vamos ganhar|vai dar|estamos prontos|sem medo|favorit|brigar (pelo|la em cima)|acredito|tenho certeza|com certeza|ninguem segura|nosso time e forte|dominamos|superior)/,
  cautelosa: /(calma|pe no chao|um jogo de cada vez|cedo|nao da pra|analisar|cuidado|com calma|paciencia|sem euforia|devagar|ainda falta)/,
  diplomatica: /(parabens|faz parte|merito|respeito|foi justo|normal|segue|seguimos|equilibrad|dois times|bom jogo)/,
  irritado: /(inaceitavel|inadmissivel|absurdo|vergonh|revolt|irritad|chatead|nao aceito|nao da mais|ridicul|lament|p[ou]t[ao]|merda|caralh|porra)/,
  provocador: /(engol|chor|freguês|fregues|cala a boca|tomaram|toma|vao ter que|pode (vir|anotar)|quero ver|recado|pequeno|time pequeno|so sabe|sorte deles)/,
  motivacional: /(orgulh|alma|guerreir|garra|juntos|uniao|familia|torcedor|nunca desist|coracao|raca|vamos juntos|acreditem|sonh)/,
  autocritico: /(errei|minha culpa|eu erre|assumo|responsabilidade e minha|a culpa e minha|eu falhei|me equivoquei|meu erro|culpa minha)/,
  protetor: /(nao vou expor|protej|defendo|meus jogadores|confio (no|nos|em) |grupo tem meu apoio|todo apoio|blind|nao e culpa deles|apoio total)/,
  cobranca: /(cobr|precisa melhorar|tem que melhorar|nao pode|inaceitavel dos jogadores|faltou (atitude|entrega|vontade)|render mais|padrao|exig|preguic|desatent|acordar)/,
  respeito: /(grande adversario|respeito o|respeito muito|bem treinado|tiro o chapeu|excelente time|dificil adversario|mereceram|foram melhores)/,
  juiz: /(arbitr|juiz|apito|\bvar\b|penalti nao|roub|cartao|impedimento)/,
  gramado: /(gramado|campo (pesado|ruim|horrivel)|buraco)/,
  pubcobra: /(torcida (precisa|tem que)|venham ao estadio|estadio vazio|cadê a torcida|cade a torcida)/,
  pubentende: /(entendo a torcida|torcida tem razao|entendo o torcedor|o torcedor tem razao)/,
};
const SLURS = /(macac|viad|bicha|traveco|retardad|mongol|puta que|filho da puta|fdp|vagabund|ladr[aã]o|safad|canalha|corno|arrombad|cuza[oõ]|babaca|idiota|imbecil)/;
function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function classifyFree(text, q) {
  const t = norm(text), sc = {};
  for (const k in FREE_LEX) { const m = t.match(new RegExp(FREE_LEX[k].source, 'g')); if (m) sc[k] = m.length; }
  const fam = FAM[q.topic];
  // contexto da pergunta desempata
  if (fam === 'ref' && sc.juiz) sc.juiz += 1;
  if (['rival', 'reply', 'next'].includes(fam) && sc.provocador) sc.provocador += 0.5;
  if (['crit', 'bench'].includes(fam) && sc.protetor) sc.protetor += 0.5;
  const caps = (text.match(/[A-ZÀ-Ú]{4,}/g) || []).length, bang = (text.match(/!/g) || []).length;
  const heat = caps + bang + (SLURS.test(t) ? 3 : 0);
  if (heat >= 3) sc.irritado = (sc.irritado || 0) + 1;
  let best = Object.entries(sc).sort((a, b) => b[1] - a[1])[0];
  let k = best ? best[0] : (t.length < 40 ? 'cautelosa' : 'diplomatica');
  // famílias sem aquele tom: cai no mais próximo
  if (k === 'juiz' && !['ref', 'bad', 'draw', 'crit', 'decision', 'pressure'].includes(fam) && !/(arbitr|juiz|\bvar\b)/.test(t)) k = 'irritado';
  if (k === 'gramado' && fam === 'good') k = 'cautelosa';
  const offensive = SLURS.test(t);
  return { k, heat, offensive, conf: best ? best[1] : 0 };
}
// ---------- postura da fala: elogio, neutra, crítica ou ataque (decide a manchete antes de gerar) ----------
const ST_POS = /(\bbo[ma]\b|boa arbitragem|otim|excelente|parabens|elogi|\bacert|competen|corret|\bjust[oa]\b|\bbem\b|fez jus|faz jus|jus ao|nivel|qualidade|merec|segur[oa]|tranquil|respeit|confio|confianca|\bfifa\b|preparad|firme|impecav|perfeit|grande arbitr|nada a reclamar|apitou bem|sem polemica|sem erros?|criterios?o? (unico|claro)|coerente|experien)/g;
const ST_NEG = /(\berr|confus|ruim|pessim|horrivel|\bfrac[oa]\b|prejudic|absurd|inaceit|polemic|reclam|contestav|duvidos|question|faltou|nao marcou|nao deu|ignor|vista grossa|equivoc|lament|decepcion|mal\b|pior|desastr|complicad|irregular|inconsistent)/g;
const ST_ATK = /(roub|ladr|vendid|comprad|mafia|safad|pilantra|palhac|incompet|criminos|escandal|vergonh|manipul|armad[oa]|favorec|esquema|marmelada|propina|desonest|corrupt|bandid|lixo|de proposito|mal intencionad)/;
const ST_NEGATED = /\b(nao|nem|sem|nunca)\s+(\w+\s+){0,2}?(err|confus|ruim|pessim|horrivel|frac|prejudic|absurd|polemic|reclam|question|ignor|equivoc|pior|problema|o que reclamar)/g;
function stanceOf(text) {
  const t = norm(text);
  if (ST_ATK.test(t) || SLURS.test(t)) return { s: 'ataque', sc: -3 };
  const negd = (t.match(ST_NEGATED) || []).length;
  const negp = (t.match(/\b(nao|nem|nunca)\s+(\w+\s+){0,2}?(bem|bo[ma]|acert|corret|seguro|segura)\b/g) || []).length;
  const pos = Math.max(0, (t.match(ST_POS) || []).length - negp) + negd, neg = Math.max(0, (t.match(ST_NEG) || []).length - negd) + negp;
  const sc = pos - neg;
  return { s: sc > 0 ? 'elogio' : sc < 0 ? 'critica' : 'neutro', sc };
}
// o tom escolhido pelas palavras-chave precisa bater com a postura da fala
const TONE_NEG = ['critica', 'cobranca', 'irritado', 'agressiva'], TONE_POS = ['confiante', 'motivacional', 'protetor', 'respeito', 'diplomatica'];
function alignTone(k, st, q, conf) {
  const fam = FAM[q.topic];
  if (k === 'juiz' || fam === 'ref') {
    return st.s === 'ataque' ? 'juizatk' : st.s === 'critica' ? 'juiz' : st.s === 'elogio' ? 'juizbom' : 'juizneu';
  }
  const strong = Math.abs(st.sc) >= 2 || conf <= 1;
  if (strong && st.s === 'elogio' && TONE_NEG.includes(k)) return q.pid ? 'protetor' : q.opp ? 'respeito' : 'diplomatica';
  if (strong && (st.s === 'critica' || st.s === 'ataque') && TONE_POS.includes(k)) return st.s === 'ataque' ? 'irritado' : q.pid ? 'critica' : 'cobranca';
  return k;
}
function cleanFree(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 400).replace(new RegExp(SLURS.source, 'gi'), m => m[0] + '*'.repeat(Math.max(2, m.length - 1)));
}

// ---------- mais miolos por família × tom (somam aos de ui8) ----------
const ANSX = {
  good: {
    confiante: ['Quando o time encaixa, sobra em campo. Hoje encaixou.', 'Esse resultado não é acaso. É consequência de trabalho.', 'Ganhamos jogando bem, e isso é o que mais me agrada.'],
    diplomatica: ['O {opp} fez um bom jogo. A gente foi mais eficiente.', 'Vitória importante, mas sem desmerecer ninguém.'],
    cautelosa: ['Ganhar é bom, mas tem muita coisa pra ajustar no vídeo.', 'Vitória não esconde os erros. Vamos corrigir.'],
    provocador: ['Diziam que a gente não ia render. O placar respondeu.', 'Tem gente que precisa rever o que falou na semana.'],
    motivacional: ['Hoje o torcedor viu o time que ele merece.', 'Cada jogador deixou tudo em campo. Isso me emociona.'],
    autocritico: ['Os jogadores foram melhores que o técnico hoje. Eles resolveram.', 'Eu demorei a acertar, e eles seguraram a onda.'],
    protetor: ['Esse elenco apanhou muito e hoje deu a resposta.', 'Quem criticou esses jogadores viu do que eles são capazes.'],
    cobranca: ['Vencemos, mas o segundo tempo foi abaixo. Vou cobrar.', 'Placar bom, atuação com altos e baixos. Dá pra mais.'],
    respeito: ['Vencer o {opp} nunca é simples. Valorizo muito.', 'O {opp} tem um trabalho sério. Esse resultado tem peso.'],
  },
  bad: {
    confiante: ['Um resultado ruim não define esse time.', 'Sei do potencial desse grupo. A resposta vem.'],
    diplomatica: ['Não fomos bem e o {opp} aproveitou. É reconhecer e seguir.', 'Hoje não deu. Parabéns ao {opp}.'],
    cautelosa: ['Não vou falar nada de cabeça quente. Primeiro reviso o jogo.', 'Tem muita coisa pra entender antes de qualquer decisão.'],
    irritado: ['Não é aceitável. Esse time não pode jogar assim.', 'Estou muito incomodado com o que vi hoje.'],
    motivacional: ['É na dificuldade que se conhece um grupo. Vamos levantar.', 'Torcedor, a gente vai dar a volta por cima.'],
    autocritico: ['A escalação foi errada e isso é comigo.', 'Não consegui dar ao time o que ele precisava hoje.'],
    protetor: ['Não vou jogar ninguém aos leões. Perdemos juntos.', 'A responsabilidade não é de um jogador só.'],
    cobranca: ['Teve jogador abaixo do que pode. Vai ter conversa.', 'Faltou atitude. Isso eu não admito.'],
    respeito: ['O {opp} foi superior. Não há o que discutir.', 'Temos que reconhecer quando o adversário é melhor.'],
  },
  draw: {
    confiante: ['Não perdemos e criamos mais. O caminho é esse.', 'Um ponto hoje, e muitos pontos pela frente.'],
    diplomatica: ['Jogo equilibrado, resultado justo.', 'Os dois times buscaram. Ficou no empate.'],
    cautelosa: ['Ponto fora de casa não se despreza.', 'Não foi o ideal, mas também não é pra drama.'],
    irritado: ['Deixamos escapar dois pontos. Isso me irrita.', 'Com as chances que tivemos, era pra ter ganho.'],
    motivacional: ['O time não se entregou em nenhum momento. Isso vale muito.', 'Saio com orgulho da entrega, mesmo sem a vitória.'],
    autocritico: ['Talvez eu devesse ter arriscado mais no fim.', 'Mexi tarde. Com a troca antes, a gente vencia.'],
    cobranca: ['Faltou capricho no último passe. Vou cobrar muito isso.', 'Não dá pra desperdiçar tanta chance.'],
    respeito: ['O {opp} soube se defender muito bem. Mérito deles.', 'Foi um empate contra um time bem armado.'],
  },
  title: {
    confiante: ['Estamos na briga e não vamos sair dela.', 'Quem quiser o título vai ter que passar pela gente.'],
    diplomatica: ['Tem vários times bons na disputa. Estamos entre eles.', 'Ainda é cedo, mas é bom estar no grupo de cima.'],
    cautelosa: ['Não falo em título agora. Falo no próximo jogo.', 'Tem muito ponto em disputa. Nada está decidido.'],
    provocador: ['Os outros é que têm que se preocupar com a gente.', 'Não somos favoritos pra ninguém. Melhor assim.'],
    motivacional: ['Esse elenco merece sonhar, e o torcedor também.', 'Se depender da entrega, vamos longe.'],
    autocritico: ['Ainda cometo erros que custam pontos. Preciso melhorar.', 'Pra ser campeão, eu também tenho que evoluir.'],
    cobranca: ['Pra ser campeão, não pode perder ponto bobo.', 'Candidato ao título não pode oscilar.'],
    respeito: ['Os adversários na briga são muito fortes. Respeito todos.', 'Tem trabalho muito bom nessa disputa.'],
  },
  rival: {
    confiante: ['Clássico a gente entra pra ganhar. Sempre.', 'Estamos prontos. O torcedor pode ficar tranquilo.'],
    diplomatica: ['Clássico é festa. Que seja um grande jogo.', 'Rivalidade dentro de campo, respeito fora.'],
    cautelosa: ['Clássico não tem favorito. Detalhe decide.', 'Vamos com cuidado. Um erro custa caro.'],
    irritado: ['Não gostei do que ouvi do outro lado. A resposta vem em campo.', 'Tem muita provocação no ar. A gente responde jogando.'],
    provocador: ['O {opp} sabe que está vindo encarar um time melhor.', 'Clássico é nosso quintal. Eles sabem disso.'],
    motivacional: ['Clássico se ganha com o coração. E esse time tem de sobra.', 'Pro torcedor, é o jogo do ano. Vamos jogar como tal.'],
    protetor: ['Ninguém aqui vai entrar na pilha. Eu cuido do grupo.', 'Os jogadores estão focados. A pressão fica comigo.'],
    respeito: ['O {opp} tem tradição. Clássico é sempre difícil.', 'Respeito muito o rival. Por isso vamos preparados.'],
  },
  next: {
    confiante: ['Estamos prontos para o {opp}. Vamos impor o nosso jogo.', 'Jogo pra somar três pontos, sem medo.'],
    diplomatica: ['O {opp} é um bom adversário. Vai ser jogo equilibrado.', 'Cada jogo tem sua história. Vamos respeitar.'],
    cautelosa: ['O {opp} é perigoso. Não podemos dar espaço.', 'Jogo de muita atenção. Qualquer vacilo decide.'],
    provocador: ['O {opp} que se preocupe com a gente.', 'Vamos lá buscar os pontos, e eles sabem disso.'],
    motivacional: ['Casa cheia, time ligado. É o que eu espero.', 'O grupo está com fome. Vamos pra cima.'],
    autocritico: ['No último jogo errei na estratégia. Contra o {opp} vai ser diferente.', 'Aprendi com a última partida. Vou ajustar.'],
    cobranca: ['Quero o time mais concentrado que na última rodada.', 'Não dá pra repetir os erros do último jogo.'],
    respeito: ['O {opp} tem um bom técnico e um elenco equilibrado.', 'Estudamos bastante o {opp}. Merece respeito.'],
  },
  praise: {
    confiante: ['{who} é diferenciado. Dá gosto de ver treinar.', 'Com {who} nesse nível, o time sobe de patamar.'],
    diplomatica: ['{who} jogou bem, mas o mérito é de todos.', 'Fico feliz por {who}, e pelo grupo que ajudou.'],
    cautelosa: ['{who} fez um bom jogo. Agora é manter.', 'Elogio {who}, mas sem colocar peso demais nele.'],
    provocador: ['Tem clube por aí que deixou {who} escapar. Azar deles.', 'Duvidaram de {who}. Tá aí a resposta.'],
    motivacional: ['{who} é exemplo pro grupo. Trabalha como poucos.', 'A torcida pode abraçar {who}. Ele merece.'],
    protetor: ['{who} passou por fase difícil e eu nunca deixei de acreditar.', 'Protegi {who} quando criticaram. Hoje ele retribuiu.'],
    cobranca: ['{who} pode ainda mais. E eu vou cobrar isso dele.', 'Bom jogo de {who}, mas o padrão dele é alto.'],
    respeito: ['{who} fez grande jogo contra um adversário forte.', 'Ter {who} num jogo difícil faz diferença.'],
  },
  crit: {
    confiante: ['{who} vai dar a volta por cima. Conheço o jogador.', 'Não tenho dúvida de que {who} vai responder.'],
    diplomatica: ['Todo mundo tem dia ruim. {who} também.', 'Não vou individualizar. O time todo pode mais.'],
    cautelosa: ['Vou conversar com {who} com calma antes de decidir.', 'Não decido nada sobre {who} depois de um jogo.'],
    irritado: ['{who} sabe que não foi bem. Eu também sei.', 'Não gostei da atuação de {who}. Ponto.'],
    motivacional: ['{who} vai sair dessa mais forte. Estou do lado dele.', 'Todo mundo abraçou {who}. É assim que se recupera.'],
    autocritico: ['Coloquei {who} numa função que não é a dele. O erro foi meu.', 'Talvez eu tenha exposto {who}. Vou rever.'],
    protetor: ['Ninguém vai crucificar {who} aqui dentro.', '{who} tem minha confiança total.'],
    cobranca: ['{who} precisa render mais. E vai ouvir isso de mim.', 'Espero outra postura de {who} no próximo jogo.'],
  },
  bench: {
    confiante: ['{who} vai ter chance e vai aproveitar.', 'Conto com {who}. O momento dele vai chegar.'],
    diplomatica: ['A concorrência está forte. É bom para todos.', '{who} entende a situação e segue trabalhando.'],
    cautelosa: ['Cada jogo pede uma escalação. {who} está nos planos.', 'Vou avaliar {who} nos treinos da semana.'],
    irritado: ['Não escalo jogador pela imprensa.', 'Quem define o time sou eu, e ponto.'],
    motivacional: ['{who} treina muito. Quando entrar, vai voar.', 'Sei do valor de {who}. A hora dele chega.'],
    autocritico: ['Talvez eu esteja devendo minutos a {who}. Vou pensar nisso.', 'Posso ter sido injusto com {who}.'],
    protetor: ['{who} é importante mesmo sem jogar. Protejo ele.', 'Ninguém aqui está esquecido.'],
    cobranca: ['{who} precisa mostrar mais nos treinos para jogar.', 'Vaga se conquista. {who} sabe o que falta.'],
  },
  decision: {
    confiante: ['Fiz o que achei melhor e faria de novo.', 'A mudança era necessária e o jogo mostrou isso.'],
    diplomatica: ['Cada um pode ter uma opinião. Eu tomei a minha.', 'Decisão de técnico às vezes não agrada todo mundo.'],
    cautelosa: ['Vou rever o jogo pra saber se foi o momento certo.', 'Não tenho certeza de tudo. Vou analisar.'],
    irritado: ['Técnico aqui sou eu.', 'Não vou ficar explicando cada substituição.'],
    motivacional: ['Quem entrou fez a parte dele. O grupo é forte.', 'Todo mundo que entrou ajudou. Isso é time.'],
    autocritico: ['Olhando agora, talvez eu tenha errado na troca.', 'Não funcionou como eu queria. Assumo.'],
    protetor: ['Quem saiu não saiu por estar mal. Foi estratégia.', 'Ninguém foi punido. Foi escolha tática.'],
    cobranca: ['Quem entrou precisava fazer mais.', 'Mudei porque o time estava apático.'],
  },
  ref: {
    confiante: ['Independente da arbitragem, o time precisa ser superior.', 'Não dependo de apito pra ganhar.'],
    diplomatica: ['Árbitro erra, jogador erra, técnico erra.', 'Não vou falar de arbitragem. Vou falar do meu time.'],
    cautelosa: ['Prefiro rever os lances antes de comentar.', 'Não vou me precipitar sobre a arbitragem.'],
    irritado: ['A arbitragem precisa ser mais bem preparada. Não dá.', 'Teve lance que qualquer um viu. Menos o árbitro.'],
    provocador: ['Pelo visto tem time que joga com um a mais.', 'Engraçado como os lances duvidosos vão sempre pro mesmo lado.'],
    motivacional: ['Com ou sem ajuda do apito, esse time vai lutar.', 'Nada tira a entrega dos jogadores.'],
    autocritico: ['Antes de falar do árbitro, tenho que olhar os meus erros.', 'Não perdemos por causa do apito. Perdemos por nós.'],
    respeito: ['A arbitragem teve um jogo difícil. Faz parte.', 'Respeito o trabalho do quadro de árbitros.'],
  },
  pressure: {
    confiante: ['Pressão faz parte. Esse elenco sabe lidar.', 'Já saí de situação pior. Vamos sair dessa.'],
    diplomatica: ['Entendo a cobrança. É o tamanho do clube.', 'Cobrança existe em todo lugar.'],
    cautelosa: ['Precisamos somar pontos e parar de olhar pra tabela.', 'É passo a passo. Sem desespero.'],
    irritado: ['Pressão não ganha jogo. Trabalho ganha.', 'Tem muita gente de fora querendo aparecer.'],
    motivacional: ['Preciso do torcedor mais do que nunca.', 'É junto com a torcida que a gente sai dessa.'],
    autocritico: ['O momento ruim também passa por mim. Assumo.', 'Preciso encontrar a solução. É o meu trabalho.'],
    protetor: ['Pressão tem que ser em mim, não nos jogadores.', 'Os jogadores estão dando tudo. Me cobrem.'],
    cobranca: ['Quem não aguentar a pressão vai ter que dar lugar.', 'Tem que ter coragem pra jogar nesse momento.'],
  },
  boss: {
    confiante: ['Tenho respaldo e confiança no trabalho.', 'Estou tranquilo. O trabalho está sendo bem feito.'],
    diplomatica: ['Converso bastante com a diretoria. Estamos alinhados.', 'A relação com o presidente é boa.'],
    cautelosa: ['Não trato disso publicamente.', 'Cargo de técnico é assim. Eu sigo trabalhando.'],
    irritado: ['Se alguém tiver algo pra falar, que fale comigo.', 'Não vou falar de bastidor aqui.'],
    motivacional: ['Estou mais motivado do que nunca.', 'Vou até o fim com esse grupo.'],
    autocritico: ['Os resultados não estão à altura. Sei disso.', 'A cobrança é justa. Preciso entregar mais.'],
    cobranca: ['Todo mundo aqui precisa entregar mais, eu incluso.', 'O clube pede resultado e o elenco sabe disso.'],
  },
  injury: {
    confiante: ['O elenco tem opções. Quem entrar vai resolver.', 'Temos peças de reposição à altura.'],
    diplomatica: ['Lesão faz parte. Vamos recuperar todo mundo.', 'O departamento médico está trabalhando muito bem.'],
    cautelosa: ['Não vou arriscar ninguém. Saúde primeiro.', 'Cada caso vai ser avaliado com calma.'],
    irritado: ['Esse calendário está matando os jogadores.', 'Assim não tem elenco que aguente.'],
    motivacional: ['Quem está fora vai voltar mais forte.', 'É hora de outros aparecerem.'],
    autocritico: ['Talvez eu tenha exigido demais. Vou dosar a carga.', 'Posso ter errado na rotação.'],
    protetor: ['Não vou expor jogador machucado. Volta quando estiver pronto.', 'Ninguém joga no sacrifício comigo.'],
  },
  market: {
    confiante: ['O elenco é forte. Se vier alguém, vem pra somar.', 'Estou satisfeito com o grupo que tenho.'],
    diplomatica: ['Mercado é com a diretoria. Eu dou minha opinião.', 'Se surgir oportunidade, a gente conversa.'],
    cautelosa: ['Não falo de nomes. Seria desrespeitoso.', 'Mercado é imprevisível. Vamos ver.'],
    irritado: ['Tem muito boato. Não vou comentar especulação.', 'Não gosto de falar de quem não é nosso.'],
    motivacional: ['Quem está aqui é quem vai resolver.', 'Confio nos meus. O reforço é o grupo.'],
    protetor: ['Ninguém sai daqui sem eu concordar.', 'Meus jogadores não estão à venda.'],
    cobranca: ['Se não renderem, vou pedir reforço.', 'O mercado está aberto pra quem não entregar também.'],
  },
  reply: {
    confiante: ['A resposta vai ser em campo.', 'Não preciso responder. O time responde.'],
    diplomatica: ['Cada um fala o que quer. Eu cuido do meu time.', 'Não vou alimentar polêmica.'],
    cautelosa: ['Prefiro não comentar.', 'Não vou entrar nessa discussão.'],
    irritado: ['Foi desrespeitoso. E eu não esqueço.', 'Quem fala demais costuma se arrepender.'],
    provocador: ['Deve estar com medo. Normal.', 'Fala muito pra quem ganha pouco.'],
    motivacional: ['Essas falas só motivam o grupo.', 'Obrigado pela motivação extra.'],
    respeito: ['Tenho respeito por ele. Não vou responder.', 'Cada um no seu. Respeito sempre.'],
  },
  event: {
    confiante: ['Já está resolvido. Página virada.', 'O grupo está forte e unido.'],
    diplomatica: ['Tratamos internamente. É o melhor caminho.', 'O clube vai se posicionar da forma certa.'],
    cautelosa: ['Ainda estamos apurando. Não vou me antecipar.', 'Prefiro esperar os fatos.'],
    irritado: ['Não admito esse tipo de coisa no meu grupo.', 'Isso não representa o clube.'],
    motivacional: ['O grupo sai disso mais unido.', 'Vamos transformar isso em força.'],
    protetor: ['Vou proteger o jogador até entender tudo.', 'Ninguém vai ser julgado antes da hora.'],
    cobranca: ['Quem errou vai responder por isso.', 'Aqui tem regra, e vale pra todos.'],
  },
  wages: {
    confiante: ['O grupo é profissional e vai seguir entregando.', 'Isso vai se resolver e o time segue focado.'],
    diplomatica: ['A diretoria está trabalhando pra resolver.', 'Confio que tudo vai ser acertado.'],
    cautelosa: ['É um assunto delicado. Tratamos internamente.', 'Não vou expor o clube.'],
    irritado: ['Salário em dia é o mínimo. Não dá pra trabalhar assim.', 'Os jogadores têm família. Precisa pagar.'],
    motivacional: ['Mesmo com o atraso, esse grupo está dando a vida.', 'Tiro o chapéu para o profissionalismo deles.'],
    autocritico: ['Também tenho responsabilidade em manter o ambiente bom.', 'Preciso ajudar a segurar o grupo.'],
    protetor: ['Estou do lado dos jogadores. Eles têm razão.', 'Ninguém aqui vai ser culpado por cobrar o que é seu.'],
  },
};
for (const f in ANSX) { ANS[f] = ANS[f] || {}; for (const k in ANSX[f]) ANS[f][k] = (ANS[f][k] || []).concat(ANSX[f][k]); }

// ---------- ainda mais perguntas nos temas que mais aparecem ----------
const QX2 = {
  vitoria: ['O que você vai cobrar do time mesmo depois da vitória?', 'Qual foi a chave tática para bater o {opp}?', 'A vitória veio pela qualidade ou pela raça?', 'O time jogou como você planejou durante a semana?', 'Esse resultado alivia a pressão sobre o seu trabalho?', 'O que esse {sc} diz sobre o momento do time?', 'Qual jogador fez o trabalho invisível hoje?', 'Dá pra comemorar ou já pensa no próximo?', 'Vencer o {opp} era obrigação?', 'O time está pronto para brigar em cima?', 'A defesa foi segura do começo ao fim?', 'Você ficou satisfeito com a posse de bola?'],
  derrota: ['O que o {opp} fez que surpreendeu vocês?', 'Qual o primeiro passo para recuperar o time?', 'Faltou banco para mudar o jogo?', 'O time entrou desconcentrado?', 'Essa derrota é pontual ou mostra um problema maior?', 'Você mudaria o esquema depois desse {sc}?', 'O {opp} foi melhor em quê?', 'O resultado vai mudar a semana de treinos?', 'Algum jogador deixou a desejar?', 'Como encarar a torcida depois do {sc}?', 'O time perdeu a confiança?', 'Faltou experiência hoje?'],
  empate: ['O empate mantém o time vivo na briga?', 'O {opp} fechou a casinha. Faltou alternativa?', 'Qual a nota do time hoje?', 'O que você disse no vestiário depois do empate?', 'O time jogou para vencer até o fim?', 'Um ponto pode fazer falta no fim do campeonato?', 'Faltou um camisa 9 hoje?', 'O empate foi mais mérito do {opp} ou demérito seu?'],
  proximo: ['O que você mais treinou pensando no {opp}?', 'Vai mudar alguma peça para enfrentar o {opp}?', 'O {opp} vive momento melhor. Isso preocupa?', 'O time tem que atacar ou esperar o {opp}?', 'Jogar contra o {opp} exige qual cuidado especial?', 'O elenco chega inteiro para o jogo contra o {opp}?', 'Você teme a bola parada do {opp}?', 'Existe favorito no jogo contra o {opp}?', 'O {opp} costuma marcar alto. Como sair jogando?', 'Qual resultado você assina hoje contra o {opp}?'],
  mafase: ['Qual foi a última conversa com o grupo?', 'O time perdeu a identidade?', 'O que você diria ao torcedor que pede a sua saída?', 'Tem jogador fazendo corpo mole?', 'Uma vitória resolve ou o problema é maior?', 'Você ainda tem o vestiário na mão?'],
  boafase: ['Como evitar a acomodação?', 'O time assusta os adversários agora?', 'Qual jogo marcou a virada de chave?', 'A sequência coloca o time como favorito?', 'Você está surpreso com o rendimento?'],
  destaque: ['{who} pediu para bater o pênalti. Você autorizou?', 'Quanto {who} vale no mercado hoje?', '{who} está sendo sondado. Você teme perder o jogador?', 'Qual foi o momento do jogo em que {who} fez a diferença?'],
  criticado: ['Você entende a vaia da torcida para {who}?', 'A posição de {who} está ameaçada?', '{who} precisa de descanso?'],
  lesoes: ['O preparador físico está pressionado com tantas lesões?', 'Você vai para o jogo com improvisos?', 'Há alguma lesão grave no elenco?'],
  mercado: ['Qual o perfil de jogador que você procura?', 'O elenco precisa de mais experiência ou de mais juventude?', 'Você aceita jogador emprestado?', 'O clube vai fazer alguma venda para equilibrar as contas?'],
  titulo: ['O time aguenta a pressão até o fim?', 'Você conversa sobre título com a diretoria?', 'Que jogo pode decidir o campeonato?'],
  rebaixamento: ['Você teme perder o emprego se cair?', 'O elenco tem estrutura para sair da zona?', 'A torcida pode ajudar nessa reta?'],
};
for (const k in QX2) QB[k] = (QB[k] || []).concat(QX2[k]);
// jeito do repórter começar a pergunta (varia o tom sem mudar o tema)
const QPRE = ['', '', '', 'Professor, ', 'Boa noite. ', 'Rapidinho: ', 'Voltando ao jogo: ', 'Uma dúvida do torcedor: ', 'Pergunta direta: ', 'Treinador, ', 'Com todo respeito, ', 'Seguindo a linha do colega: '];
const QPRE_OK = (x, c) => x !== 'Voltando ao jogo: ' || (c.fl && c.fl.pos && MATCH_T.has(c.topic));

// ===================== v191: revisão da coletiva (perguntas × respostas coerentes) =====================
// temas novos/ajustados → famílias
Object.assign(FAM, { boafase: 'streak', invicto: 'streak', mafase: 'slump', semVencer: 'slump', rebaixamento: 'slump', objetivo: 'goal', objPremio: 'goal',
  renovacao: 'renew', retorno: 'fitness', duvida: 'fitness', insatisfeito: 'unhappy', arbitroProx: 'refNext', amigo: 'next',
  classicoV: 'good', classicoD: 'bad', classicoE: 'draw', classif: 'classif', golFimEmpate: 'draw', golFimSofridoEmpate: 'draw' });
// temas cujas respostas genéricas da família não servem: só usam as próprias
const STRICT_T = new Set(['expulso', 'penPerdido', 'goleiroFalha', 'estreia', 'jovem', 'diamante', 'ingresso', 'retorno', 'duvida']);
// temas do jogo que acabou (árbitro, gramado e público do último jogo só entram nesses)
const MATCH_T = new Set(['vitoria', 'derrota', 'empate', 'goleada', 'goleadaSofrida', 'classicoV', 'classicoD', 'classicoE', 'elim', 'classif', 'destaque', 'criticado', 'subs', 'tatica', 'arbitragem',
  'virada', 'viradaSofrida', 'golFim', 'golFimSofrido', 'golFimEmpate', 'golFimSofridoEmpate', 'penPerdido', 'expulso', 'goleiroFalha', 'hattrick', 'estreia', 'jovem', 'diamante']);

// ---------- perguntas dos temas novos ----------
Object.assign(QB, {
  classicoV: ['Clássico vencido vale o mês inteiro?', 'Qual o sabor de vencer o {opp} no clássico?', 'Quem ganhou a batalha do meio-campo no clássico?', 'Dá pra provocar o torcedor do {opp} depois de hoje?', 'A cidade agora é de quem?', 'Vitória no clássico muda o ambiente no clube?', 'Clássico se ganha na raça ou na estratégia?', 'Como foi viver esse clássico com o {opp}?'],
  classicoD: ['Derrota no clássico dói mais?', 'O que faltou contra o {opp} no clássico?', 'Como encarar a torcida depois de perder o clássico?', 'O {opp} mereceu vencer o clássico?', 'Perder o clássico pesa no seu cargo?', 'O time sentiu o clima do clássico?', 'Clássico perdido por {sc}. Qual o recado pra torcida?'],
  classicoE: ['Empate no clássico ficou bom pra quem?', 'Clássico empatado em {sc}. Faltou ousadia?', 'O {opp} saiu mais satisfeito com o empate?', 'Como avalia o clássico de hoje?', 'O time jogou para vencer o clássico até o fim?', 'Clássico é emoção ou estratégia?'],
  classif: ['Classificação sofrida contra o {opp}. Como foi viver isso?', 'O time não venceu o jogo, mas passou. É o que importa?', { t: 'Classificação nos pênaltis. Você treinou as cobranças?', c: ['pensDec'] }, { t: 'Como foi ver a disputa de pênaltis do banco?', c: ['pensDec'] }, { t: 'Perdeu o jogo, mas passou no agregado. Isso alivia?', c: ['loss'] }, 'Que recado essa classificação deixa para a próxima fase?', 'O {opp} complicou mais do que você esperava?'],
  golFimEmpate: [{ t: 'Gol de empate aos {min}. O ponto teve sabor de vitória?', c: ['lg'] }, 'O empate no fim foi prêmio pela insistência?', 'Você já tinha perdido a esperança antes do gol aos {min}?', 'Como o time manteve a cabeça pra buscar o empate?', { t: 'O gol nos acréscimos salvou a noite?', c: ['acresc'] }],
  golFimSofridoEmpate: ['Tomar o empate aos {min} dói mais?', 'Faltou segurar o resultado no fim?', 'O empate sofrido no fim foi falta de concentração?', 'O time comemorou antes da hora?', 'Como explicar o empate do {opp} no fim?'],
});

// ---------- respostas das famílias novas ----------
Object.assign(ANS, {
  streak: {
    confiante: ['O time encontrou o jeito de jogar. E ainda dá pra crescer.', 'Sequência assim não é sorte. É trabalho de todo dia.', 'Esse grupo pegou confiança. Agora é manter o embalo.'],
    diplomatica: ['Mérito do grupo inteiro. Ninguém faz sequência sozinho.', 'Fico feliz pelo momento, sem desmerecer ninguém.'],
    cautelosa: ['Sequência boa é ótimo, mas não ganha nada sozinha.', 'É o momento mais perigoso: quando tudo dá certo, a gente relaxa.', 'Um jogo ruim e a sequência acaba. Pé no chão.'],
    provocador: ['Quem apostou contra esse time está bem quietinho agora.', 'Lembro de quem dizia que a gente não ia aguentar. Cadê?'],
    motivacional: ['O torcedor está sentindo: esse time tem alma.', 'Cada jogador comprou a ideia. É isso que faz a diferença.', 'Que essa fase seja só o começo.'],
    autocritico: ['Demorei pra achar o time ideal. Agora que achei, não vou mexer à toa.', 'No começo eu errei bastante. O grupo me ajudou a acertar.'],
    protetor: ['Os jogadores são os donos dessa sequência. O mérito é deles.', 'Esse elenco foi muito criticado no começo. Olha onde está agora.'],
    cobranca: ['Sequência não pode virar acomodação. Vou cobrar ainda mais.', 'Teve jogo nessa série em que a gente venceu jogando mal. Isso me incomoda.'],
  },
  slump: {
    confiante: ['Esse time vai reagir. Eu conheço o grupo que tenho.', 'Já saí de situação pior. Vamos sair dessa também.', 'Uma vitória muda tudo. E ela vai vir.'],
    diplomatica: ['Momento difícil, mas o clube é maior que qualquer fase.', 'Entendo a cobrança. Faz parte do tamanho do clube.'],
    cautelosa: ['Não adianta fazer conta agora. É ganhar o próximo.', 'É passo a passo. Primeiro estancar, depois reagir.', { t: 'Precisamos somar pontos e parar de olhar pra tabela.', c: ['lg'] }],
    irritado: ['Do jeito que está, não dá. Alguma coisa tem que mudar.', 'Estou incomodado, sim. Esse time pode muito mais do que está entregando.'],
    motivacional: ['Preciso do torcedor mais do que nunca.', 'É junto com a torcida que a gente sai dessa.', 'Ninguém aqui vai desistir. Nem eu, nem os jogadores.'],
    autocritico: ['O momento ruim passa por mim. Não consegui fazer o time render.', 'Preciso encontrar a solução. É o meu trabalho, e assumo isso.', 'Errei em escolhas nas últimas semanas. Já estou corrigindo.'],
    protetor: ['A pressão tem que ser em mim, não nos jogadores.', 'Os jogadores estão dando tudo. Me cobrem.'],
    cobranca: ['Quem não aguentar a pressão vai ter que dar lugar.', 'Tem jogador que precisa acordar. E rápido.', 'Faltou atitude nos últimos jogos. Vou cobrar um por um.'],
  },
  goal: {
    confiante: ['A meta é possível, sim. Esse elenco tem condição.', 'Vamos cumprir o objetivo. Não tenho dúvida.'],
    diplomatica: ['A meta foi combinada com a diretoria e eu concordo com ela.', 'Objetivo justo pro elenco que temos.'],
    cautelosa: ['Ainda tem muito campeonato. Não dá pra fazer conta agora.', 'Uma etapa de cada vez. Sem pressa e sem desespero.'],
    irritado: ['Meta se cumpre em campo, não em entrevista.', 'Todo mundo aqui sabe o que precisa fazer. Não tem desculpa.'],
    motivacional: ['O grupo abraçou essa meta. Vamos atrás dela juntos.', 'Cada jogo é um degrau rumo ao objetivo.'],
    autocritico: ['Se o objetivo estiver longe, a responsabilidade é minha.', 'Ainda não entreguei o que prometi. Mas vou entregar.'],
    cobranca: ['Pra cumprir a meta, todo mundo tem que render mais.', { t: 'Não dá pra perder ponto bobo se a gente quer chegar lá.', c: ['lg'] }],
  },
  classif: {
    confiante: ['O que importa é a classificação. E ela é nossa.', 'Sabíamos que ia ser sofrido. Passamos, e é isso que fica.', { t: 'Pênalti tem um pouco de sorte, mas também tem treino. E a gente treinou.', c: ['pensDec'] }],
    diplomatica: ['Parabéns ao {opp} pelo confronto. Foi duro até o fim.', 'Classificação conquistada no detalhe. Mérito dos dois lados.'],
    cautelosa: ['Passamos, mas o jogo de hoje acende um alerta.', 'Classificação comemorada, erros anotados. Tem muito pra corrigir.'],
    provocador: ['Diziam que a gente ia cair aqui. Estamos na próxima fase.', 'Pode até ter sido sofrido. Mas quem segue no torneio somos nós.'],
    motivacional: ['Esse grupo tem coração. Sofreu junto e passou junto.', 'Quem ficou até o fim no estádio sabe: esse time não desiste.', { t: 'Nos pênaltis, todo mundo segurou a mão de todo mundo. Que noite.', c: ['pensDec'] }],
    autocritico: ['Não fizemos um bom jogo, e parte disso é minha. Mas o grupo segurou.', 'Errei na estratégia de hoje. Os jogadores salvaram.'],
    protetor: ['Os jogadores estavam esgotados e mesmo assim seguraram. Merecem respeito.', 'Ninguém se escondeu. Classificação de todo o grupo.'],
    cobranca: ['Passamos, mas não dá pra jogar assim na próxima fase.', 'A vaga veio, a atuação não. Vou cobrar.'],
    respeito: ['O {opp} foi um adversário duríssimo. Passamos no detalhe.', 'Respeito total ao {opp}. Foi um confronto equilibrado.'],
  },
  renew: {
    confiante: ['{who} vai renovar. Já conversei com ele e com a diretoria.', 'Quero {who} aqui por muitos anos. Vamos acertar.'],
    diplomatica: ['A renovação de {who} está com a diretoria e o empresário. Respeito o processo.', 'As conversas com {who} estão acontecendo no tempo certo.'],
    cautelosa: ['Contrato é assunto do clube e do jogador. Prefiro não me antecipar.', 'Ainda tem tempo pra resolver a situação de {who}.'],
    irritado: ['Não vou negociar contrato pela imprensa.', 'Esse assunto é interno. E ponto.'],
    motivacional: ['{who} sabe o quanto é querido aqui. Torço muito pra ele ficar.', 'O grupo quer {who} aqui. Isso pesa na decisão dele.'],
    protetor: ['{who} está focado em jogar. Não vou deixar especulação atrapalhar.', 'Enquanto estiver aqui, {who} tem o meu respaldo total.'],
    cobranca: ['Quem quer renovar mostra em campo. {who} sabe disso.', 'Renovação é consequência de rendimento.'],
  },
  unhappy: {
    confiante: ['Minha relação com {who} é ótima. Isso passa.', 'Conheço {who}. Vai dar a volta por cima aqui mesmo.'],
    diplomatica: ['Converso com {who} sempre. O que tiver que ser dito, é dito no vestiário.', '{who} é um grande profissional. Vamos resolver.'],
    cautelosa: ['Ainda vou ter uma conversa com {who}. Depois disso, a gente vê.', 'Não sei de tudo o que se fala por aí. Vou ouvir o jogador.'],
    irritado: ['Quem estiver insatisfeito sabe onde fica a minha sala.', 'Não vou ficar correndo atrás de jogador insatisfeito. O grupo vem primeiro.'],
    motivacional: ['Quero {who} feliz e jogando. Vou fazer de tudo por isso.', '{who} é importante. O grupo precisa dele motivado.'],
    autocritico: ['Talvez eu não tenha dado a atenção que {who} merecia. Vou corrigir.', 'Parte disso é responsabilidade minha. Vou conversar com {who}.'],
    protetor: ['Não vou expor {who}. Assunto interno se resolve aqui dentro.', '{who} tem o meu respeito, satisfeito ou não.'],
    cobranca: ['Insatisfeito ou não, {who} tem que treinar e render.', 'Quem quer espaço conquista no treino. Vale pra {who}.'],
  },
  refNext: {
    confiante: ['Não importa quem apita. O time precisa fazer a parte dele.', 'Arbitragem não entra em campo pela gente.'],
    diplomatica: ['{ref} é um árbitro experiente. Confio na escala.', 'Toda escala da arbitragem merece respeito.'],
    cautelosa: ['Pedi atenção aos jogadores com os cartões. É prevenção.', 'Prefiro não comentar escala de arbitragem antes do jogo.'],
    irritado: ['Espero que dessa vez a arbitragem tenha critério. Já fomos prejudicados demais.', 'Não vou aceitar o que aconteceu em outros jogos. Vamos ficar de olho.'],
    provocador: ['Vamos ver se dessa vez os lances duvidosos caem pro nosso lado.', 'Tomara que {ref} enxergue os dois lados do campo.'],
    respeito: ['Árbitro também trabalha sob pressão. Respeito o trabalho de {ref}.', 'Não tenho nada contra {ref}. Que faça um bom jogo.'],
    cobranca: ['O cuidado com cartões é com a gente. Jogador meu não pode reclamar à toa.', 'Quem levar cartão bobo vai ouvir de mim.'],
  },
});

// ---------- respostas específicas (novas e completadas) ----------
Object.assign(TOPIC_ANS, {
  classicoV: {
    confiante: ['Clássico é pra ganhar. E hoje a gente mostrou isso.', 'A cidade sabe quem manda hoje.'],
    provocador: ['O {opp} falou a semana inteira. Agora pode descansar.', 'Clássico é nosso quintal. Eles já deviam saber.'],
    motivacional: ['Essa é pro torcedor. Ele espera a semana inteira por esse jogo.', { t: 'Ganhar clássico na frente da nossa gente não tem preço.', c: ['home'] }],
    respeito: ['Clássico contra o {opp} nunca é fácil. Vitória com muito valor.'],
  },
  classicoD: {
    irritado: ['Perder clássico não dá. Não dá.', 'Em clássico não pode vacilar como a gente vacilou hoje.'],
    autocritico: ['O clássico era pra ser nosso e eu não consegui armar o time. É comigo.'],
    motivacional: ['Dói perder o clássico, mas a gente devolve no próximo.'],
    cobranca: ['Em clássico, quem não entra ligado não joga.'],
  },
  classicoE: {
    cautelosa: ['Clássico é assim: equilibrado até o fim.'],
    irritado: ['Era pra ter ganho o clássico. Deixamos escapar.'],
    respeito: ['O {opp} fez um grande clássico. Empate justo.'],
  },
  golFimEmpate: {
    motivacional: ['Esse time não desiste. Fomos buscar até o último minuto.', 'O torcedor que ficou até o fim viu caráter.'],
    confiante: ['A gente sabia que o gol ia sair. O time estava em cima.'],
    cautelosa: ['O empate veio, mas não dá pra depender do último minuto.'],
    cobranca: ['Buscamos o empate, mas não podemos deixar o jogo chegar nisso.'],
  },
  golFimSofridoEmpate: {
    irritado: ['Estávamos ganhando e soltamos no fim. Isso me irrita muito.', 'Tomar o empate nos minutos finais é inaceitável.'],
    cobranca: ['Faltou malícia pra segurar a vitória.', 'Time grande fecha o jogo quando está na frente.'],
    autocritico: ['Devia ter mexido pra segurar. Errei.', 'A troca que fiz no fim não deu certo. É comigo.'],
    protetor: ['O time estava no limite. Não vou crucificar ninguém.'],
  },
  expulso: {
    cobranca: ['{who} deixou o time na mão. Vai ser multado, e ele sabe.', 'Expulsão boba. Isso custa caro num jogo desses.'],
    protetor: ['{who} é intenso, é o jeito dele. Às vezes passa do ponto.', 'Achei o cartão rigoroso. {who} tem meu apoio.'],
    irritado: [{ t: 'Com um a menos ninguém joga. A expulsão matou o jogo.', c: ['notWin'] }, 'Não dá. Não dá pra perder a cabeça desse jeito.'],
    cautelosa: ['Vou rever o lance antes de falar de {who}.', 'Não vou julgar {who} de cabeça quente.'],
    autocritico: ['Talvez eu tenha deixado {who} pilhado demais antes do jogo. Vou conversar.', 'Devia ter tirado {who} quando ele já estava pendurado.'],
    diplomatica: ['{who} sabe que errou. Vamos tratar internamente.', 'Cartão vermelho faz parte. O time precisa aprender a jogar com dez.'],
    motivacional: ['Com dez, o time mostrou caráter. Isso me deixa orgulhoso.', '{who} vai voltar com tudo depois da suspensão.'],
  },
  penPerdido: {
    protetor: ['Só perde pênalti quem tem coragem de bater. {who} segue sendo o nosso cobrador.', '{who} já nos deu muitos pontos. Um pênalti não apaga isso.'],
    cobranca: ['Pênalti é treino. Vou rever com todo mundo quem bate.', '{who} sabe que precisava converter. Ele vai responder.'],
    cautelosa: ['Vamos avaliar a questão dos pênaltis com calma.', 'Não vou decidir nada sobre o batedor agora.'],
    motivacional: ['Amanhã {who} está treinando pênalti comigo. E vai fazer o próximo.', 'O grupo abraçou {who} no vestiário. É isso que importa.'],
    confiante: ['Na próxima, {who} bate e converte. Confio nele.', '{who} segue sendo o nosso batedor. Ponto.'],
    autocritico: ['A escolha do cobrador é minha. Se ele errou, errei junto.', 'Talvez eu devesse ter escolhido outro batedor hoje. Assumo.'],
    diplomatica: ['Até os maiores perdem pênalti. Faz parte.', 'O goleiro deles também tem mérito na defesa.'],
  },
  goleiroFalha: {
    protetor: ['{who} já salvou esse time várias vezes. Hoje não foi o dia dele.', 'Goleiro fica marcado por um erro. Eu confio em {who}.'],
    cobranca: ['{who} sabe que falhou. Posição de goleiro não perdoa.', 'Vou conversar com o preparador de goleiros. Tem coisa pra corrigir.'],
    cautelosa: ['Não vou decidir o goleiro agora, de cabeça quente.', 'A defesa inteira precisa proteger mais o nosso goleiro.'],
    confiante: ['{who} segue titular. Um jogo ruim não muda nada.', 'Confio em {who} de olhos fechados.'],
    autocritico: ['A defesa deixou {who} exposto. Isso é organização, e organização é comigo.', 'Errei na marcação da bola parada. {who} pagou o pato.'],
    motivacional: ['{who} vai dar a volta por cima. Goleiro bom se fortalece no erro.', 'O grupo abraçou {who} no vestiário. É assim que se faz.'],
    irritado: ['Não dá pra tomar gols assim. Ninguém aqui está satisfeito.', 'Foi um dia ruim pra defesa inteira. Muito ruim.'],
  },
  estreia: {
    confiante: [{ t: '{who} chegou pronto. Vai ajudar muito.', c: ['okj'] }, { t: 'Estreia de gente grande. É o reforço que a gente precisava.', c: ['okj'] }, 'Pode esperar: {who} vai crescer muito com a sequência.'],
    cautelosa: ['Primeiro jogo, ainda em adaptação. Vamos dar tempo a {who}.', '{who} fez uma estreia correta, mas pode render mais.'],
    motivacional: ['A torcida abraçou {who} logo de cara. Isso faz diferença.', 'Bem-vindo, {who}. Aqui você vai ser feliz.'],
    diplomatica: ['Bom começo de {who}. Mérito também dos companheiros que ajudaram.', '{who} foi bem recebido pelo grupo. Isso facilita.'],
    protetor: ['Ninguém vai cobrar {who} por um jogo. Ele acabou de chegar.', 'Vou dar tempo pra {who} se adaptar. Sem pressão.'],
    cobranca: ['{who} sabe que pode mais. Estreia é só o começo.', 'Gostei de algumas coisas de {who}, de outras nem tanto. Vamos ajustar.'],
    provocador: [{ t: 'Tem clube que vai se arrepender de não ter contratado {who}.', c: ['okj'] }],
  },
  jovem: {
    motivacional: ['{who} é o futuro desse clube. Quem viu hoje sabe.', { t: 'A base forma, a gente lança. {who} tem muito a dar.', c: ['base'] }],
    cautelosa: ['{who} é jovem. Vamos colocar aos poucos, sem pressão.', 'Não quero ninguém chamando {who} de craque ainda. Deixa ele crescer.'],
    protetor: ['Se {who} errar, a culpa é minha, que coloquei. Ele tem toda a minha confiança.', 'Ninguém vai queimar {who}. Eu cuido dele.'],
    confiante: ['{who} tem personalidade. Não sentiu o jogo.', 'Pode anotar: {who} vai dar muito o que falar.'],
    cobranca: ['{who} foi bem, mas ainda tem muito a aprender. E eu vou cobrar.', 'Jovem que joga bem tem que manter o pé no chão. {who} sabe.'],
    diplomatica: [{ t: 'Mérito também da comissão da base, que formou {who}.', c: ['base'] }, 'O grupo acolheu {who} muito bem. Isso ajuda.'],
  },
  diamante: {
    confiante: ['{who} está acima da média. Ele decide.', 'Jogador desse nível muda qualquer time. É por isso que ele está aqui.'],
    motivacional: ['Os jovens aprendem só de ver {who} treinando. Isso vale muito.', '{who} trouxe outra energia pro vestiário.'],
    cautelosa: ['{who} é um grande jogador, mas futebol se ganha no coletivo.', 'Não é um jogador que resolve tudo. O time precisa ajudar.'],
    provocador: [{ t: 'Agora todo mundo entende por que trouxemos {who}.', c: ['dec'] }, 'Tem clube grande por aí com inveja de ter {who} no elenco.'],
    cobranca: ['{who} veio pra decidir. É isso que eu espero dele todo jogo.', 'Com o nível de {who}, a cobrança também é maior.'],
    diplomatica: ['{who} é um grande jogador e se encaixou bem no grupo.', 'Fico feliz pela adaptação rápida de {who}.'],
  },
  ingresso: {
    pubentende: [{ t: 'O torcedor tem razão. Com esse preço fica difícil vir ao estádio.', c: ['empty'] }, { t: 'Eu entendo quem não veio. Vou conversar com a diretoria.', c: ['empty'] }, { t: 'O torcedor fez um esforço enorme pra lotar. A gente não pode esquecer disso.', c: ['full'] }],
    pubcobra: [{ t: 'O time precisa do torcedor. Peço que venham, mesmo no sacrifício.', c: ['empty'] }, { t: 'Estádio cheio ganha jogo. Precisamos de todo mundo.', c: ['empty'] }],
    diplomatica: ['Preço de ingresso é com a diretoria. Eu cuido do campo.', 'Não é a minha área, mas o torcedor sempre faz falta.', { t: 'O torcedor lotou mesmo com o preço alto. Só posso agradecer.', c: ['full'] }],
    motivacional: [{ t: 'Estádio cheio desse jeito empurra o time. Obrigado, torcedor.', c: ['full'] }, { t: 'Mesmo com a arquibancada vazia, o time precisa entregar. E vai.', c: ['empty'] }],
    cautelosa: ['Preço de ingresso não é comigo, mas vou levar a conversa pra diretoria.', 'Prefiro não opinar sobre preço. Meu foco é o campo.'],
    confiante: ['Com o time jogando bem, o torcedor vem.', 'O torcedor sempre responde quando o time entrega.'],
  },
  retorno: {
    confiante: ['{who} voltou bem. Está pronto pra ajudar.', 'Os testes de {who} foram ótimos. Pode contar com ele.'],
    cautelosa: ['{who} volta aos poucos. Vamos controlar os minutos.', 'Não vou arriscar {who}. Retorno de lesão pede paciência.', 'O departamento médico liberou, mas a decisão vai ser tomada com calma.'],
    motivacional: ['Ter {who} de volta dá outra energia pro grupo.', 'O vestiário comemorou a volta de {who}. Ele fazia falta.'],
    protetor: ['{who} só joga quando estiver 100%. A saúde dele vem primeiro.', 'Ninguém vai apressar a volta de {who}.'],
    diplomatica: ['Mérito do departamento médico, que fez um trabalho excelente com {who}.', 'A recuperação de {who} foi bem conduzida por todo mundo.'],
    cobranca: ['{who} precisa recuperar o ritmo rápido. O time precisa dele.', 'Voltar é uma coisa, voltar em alto nível é outra. {who} sabe.'],
  },
  duvida: {
    confiante: ['{who} vai estar em campo. Ele aguenta.', 'Conheço {who}. Mesmo cansado, ele resolve.'],
    cautelosa: ['Vamos ver como {who} acorda amanhã. A decisão sai no último treino.', 'Se o desgaste for grande, {who} descansa. Sem risco.'],
    protetor: ['Não vou queimar {who}. Se precisar, ele fica fora.', 'A saúde de {who} vale mais que um jogo.'],
    autocritico: ['Talvez eu tenha usado {who} demais nas últimas semanas. Vou rever.', 'O desgaste de {who} também é consequência das minhas escolhas.'],
    cobranca: ['Jogador profissional tem que estar pronto. {who} sabe se cuidar.', 'Quem estiver inteiro joga. Vale pra {who} também.'],
    motivacional: ['{who} quer jogar de qualquer jeito. Esse é o espírito do grupo.', 'Se {who} não puder, quem entrar vai dar conta. O grupo é forte.'],
  },
});

// ---------- frases antigas: condições, reescritas e remoções ----------
(function () {
  const TAG = {
    // respostas
    'Três pontos, e só. Amanhã já é outro campeonato.': { c: ['lg'] },
    'Um ponto não é ruim. Seguimos trabalhando.': { c: ['lg'] }, 'Tem jogo em que o empate é resultado. Vamos somar.': { c: ['lg'] },
    'Deixamos dois pontos na mesa. Isso me irrita.': { c: ['lg'] }, 'Ponto fora de casa não se despreza.': { c: ['lg', 'away'] },
    'Um ponto hoje, e muitos pontos pela frente.': { c: ['lg'] }, 'Deixamos escapar dois pontos. Isso me irrita.': { c: ['lg'] },
    'Quero o estádio cheio. Com a torcida, a gente vira outro time.': { c: ['home'] }, 'Casa cheia, time ligado. É o que eu espero.': { c: ['home'] },
    'Vamos lá buscar os pontos, e eles sabem disso.': { c: ['away', 'lg'] }, 'Jogo pra somar três pontos, sem medo.': { c: ['lg'] },
    'No último jogo errei na estratégia. Contra o {opp} vai ser diferente.': { c: ['lastBad'] }, 'Aprendi com a última partida. Vou ajustar.': { c: ['lastBad'] },
    'Quero o time mais concentrado que na última rodada.': { c: ['lastBad'] }, 'Não dá pra repetir os erros do último jogo.': { c: ['lastBad'] },
    'O time todo ajudou {who} a brilhar. E o adversário deu trabalho.': { c: ['pos'] },
    'Ninguém saiu por mau desempenho. Foi estratégia, e o jogador entendeu.': { c: ['sub'] }, 'Quem saiu não saiu por estar mal. Foi estratégia.': { c: ['sub'] },
    'Ninguém foi punido. Foi escolha tática.': { c: ['sub'] }, 'Quem entrou deu a vida. É assim que se faz.': { c: ['sub'] },
    'Quem entrou fez a parte dele. O grupo é forte.': { c: ['sub'] }, 'Todo mundo que entrou ajudou. Isso é time.': { c: ['sub'] },
    'Quem entrou precisava fazer mais.': { c: ['sub'] }, 'Não vou ficar explicando cada substituição.': { c: ['sub'] },
    'A arbitragem decidiu o jogo. Foi um absurdo.': { c: ['notWin'] }, 'Não culpo o árbitro. Culpo a nossa falta de pontaria.': { c: ['notWin'] },
    'Pelo visto tem time que joga com um a mais.': { c: ['notWin'] }, 'Não perdemos por causa do apito. Perdemos por nós.': { c: ['loss'] },
    'Desejo pronta recuperação a todos.': { c: ['inj'] }, 'O DM está trabalhando. Vamos administrar.': { c: ['inj'] },
    'Lesão faz parte. Vamos recuperar todo mundo.': { c: ['inj'] }, 'O departamento médico está trabalhando muito bem.': { c: ['inj'] },
    'Quem está fora vai voltar mais forte.': { c: ['inj'] }, 'Não vou expor jogador machucado. Volta quando estiver pronto.': { c: ['inj'] },
    // perguntas
    'Três pontos contra o {opp}. O que ainda precisa melhorar?': { c: ['lg'] }, 'Três pontos importantes. Já dá pra olhar pra cima na tabela?': { c: ['lg'] },
    'A torcida saiu cantando. Como foi ouvir isso?': { c: ['home'] }, 'O time está pronto para brigar em cima?': { c: ['lg'] },
    'A torcida saiu irritada depois do {sc}. Qual a sua leitura?': { c: ['home'] },
    'Um ponto contra o {opp}. Foi bom ou ruim?': { c: ['lg'] }, 'O ponto conquistado vale como vitória?': { c: ['lg'] },
    'O time recuou demais depois de sair na frente?': { c: ['led'] }, 'Empate fora é bom resultado?': { c: ['away'] },
    'O empate mantém o time vivo na briga?': { c: ['lg'] }, 'Um ponto pode fazer falta no fim do campeonato?': { c: ['lg'] },
    'O time deixou escapar a vitória contra o {opp}?': { c: ['led'] },
    'O VAR foi decisivo hoje?': { c: ['var'] }, 'O pênalti marcado foi claro para você?': { c: ['pen'] }, 'Você vai pedir o áudio do VAR?': { c: ['var'] },
    'São {n} jogadores no departamento médico. Isso atrapalha?': { c: ['n2'] }, 'O departamento médico cheio é azar ou excesso de jogos?': { c: ['n2'] },
    'As lesões obrigam a mudar o esquema?': { c: ['n2'] }, 'O gramado pode explicar tantas lesões?': { c: ['n2'] },
    'O preparador físico está pressionado com tantas lesões?': { c: ['n2'] }, 'As lesões explicam a queda de rendimento?': { c: ['n2'] },
    'O que passou pela sua cabeça no gol dos acréscimos?': { c: ['acresc'] }, 'Você vai para o jogo com improvisos?': { c: ['pre'] }, 'Quem volta primeiro do departamento médico?': { c: ['n2'] }, 'O pênalti perdido por {who} custou o resultado?': { c: ['notWin'] },
    '{who} é cria da base e jogou bem. Ele está pronto?': { c: ['base'] }, 'A base do clube está bem servida com {who}?': { c: ['base'] },
    '{who} chegou e já decidiu. O investimento valeu?': { c: ['dec'] },
    'O estádio estava vazio com ingresso caro. A diretoria errou no preço?': { c: ['empty'] }, 'O preço do ingresso afastou o torcedor?': { c: ['empty'] },
    'Casa cheia mesmo com ingresso caro. O torcedor respondeu?': { c: ['full'] },
  };
  const REW = {
    'O que você disse no intervalo que mudou o jogo?': 'O que você pediu ao time no intervalo?',
    'Jogar contra o {opp} é bom momento?': 'É um bom momento pra pegar o {opp}?',
    'Em clássico não pode vacilar como a gente vacilou.': 'Em clássico não dá pra vacilar. Cobrei isso a semana inteira.',
    'Não gostei do que ouvi do outro lado. A resposta vem em campo.': 'Estou cansado de ouvir que o {opp} é favorito. A resposta vem em campo.',
    '{who} ouviu muita crítica e deu a resposta. Merece o carinho.': '{who} trabalha calado e hoje colheu. Merece o carinho.',
    'Protegi {who} quando criticaram. Hoje ele retribuiu.': '{who} sempre teve a minha confiança. Hoje mostrou por quê.',
    '{who} passou por fase difícil e eu nunca deixei de acreditar.': '{who} merece cada elogio. Eu nunca deixei de acreditar nele.',
    'Quem pediu cabeça de jogador aqui semana passada viu hoje do que eles são capazes.': 'Quem duvidou desses jogadores viu hoje do que eles são capazes.',
  };
  const DROP = new Set(['{who} pediu para bater o pênalti. Você autorizou?', '{who} saiu irritado. Você viu?', 'O {opp} vive momento melhor. Isso preocupa?',
    'Precisamos somar pontos e parar de olhar pra tabela.']);   // a última foi pra família da má fase
  const fix = L => (L || []).filter(x => !DROP.has(lineT(x))).map(x => { if (typeof x !== 'string') return x; const t = REW[x] || x; return TAG[t] ? { t, ...TAG[t] } : TAG[x] ? { t, ...TAG[x] } : t; });
  for (const k in QB) QB[k] = fix(QB[k]);
  for (const f in ANS) for (const k in ANS[f]) if (f !== 'slump') ANS[f][k] = fix(ANS[f][k]);
  for (const tp in TOPIC_ANS) for (const k in TOPIC_ANS[tp]) TOPIC_ANS[tp][k] = fix(TOPIC_ANS[tp][k]);
})();

// ===== UI parte 9: os três jornais (O Treineiro, Inteira-Hora, CHANCE) =====
// logo do patrocínio Brutal Models (enviado pelo ADM): estampa a capa do CHANCE quando o evento sai
const BRUTAL_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAACcCAYAAADvRhrqAAAHuklEQVR42u3dQXLrKBQF0PYvbSOLyTArzjCLyULUo1R3+duOQAgej3PGiW2BhC4g0G3f938AAFjHH0UAACAAAgAgAAIAIAACADClbfQP+H7/KFqF8vb1eVu90krLTLkBAP9nBBAAQAAEAEAABABAAAQAQAAEAGAC22w/+NUK2EwrXWtW+gIATBEAS0KbUJQz7AIAfZkCBgAQAAEAEAABABAAAQCY05bpYJ4tEom6YMKiFgBgBCOAAACLmWoE8NVIXtbRNNu9AACtGQEEABAAAQAQACdnsQUAQLIAKOABABx32/cc2ak2BPZYZHEmoFoEAgC0lmYfwGdBaYbRQSEPAOjJIhAAAAEQAAABEAAAARAAgDltqxfAs0UipQszbEUDAMzCCOBgVgADAL2lHwGMsj2MoAcARGEEEABAAAQAQAAEAEAABABAAAQAQAAEAEAABABAAAQAQAAEAOAimyJ4zLt9AYCsjAACAAiAAAAIgAAApHHb99yPukV/lu/t6/PmNAQAejICCAAgAAIAIAACACAAAgAgAAIAMAFvAgFI4mfXg0e7C9zviGAHAlhb8TYwr7ZVidqgRN4KJlKZ/VZOPX5rTV25kUF9O+f6IdM9ZOT1NdvxLTECWFopQggILwCZeQYQAEAABAAgs6Ip4N+mab7fP/bWUzIlDy5HnqNv8dsefYYpMADg0gBYG3RqQ8qjzzq7oOPVKrkZQuKM3wUAxGIKGABAAHzOdCMAwGIBEACA+XXZB/DoQo4Iz8CdHeXs/Wzd0WcuPfMHAFQHwKvCW6SAUrKaOWOwMtUPALmZAn4S6L7fP3ajZgCAAAgAwPSmfRdwj/f7+v0AQEZGAAEABEAAADLrMgV8P92ZZToz6nGYLq4vLyug251zR8qyxe4BR7c9uqpuS95XXvP3AKED4Mrbpswk+82mx7uiW3x37XZKLfd4vPoYfws6rdqCo59Tsr1Ty+NuHSABQgXAHqHlzM05Y3ATpq8rj9KwoC7G1RVj6uqKPWF7XXOt7yFXnc+Rf2eP+/CV7cToHHHFsZUe01SrgM9U2Ki3j+jNg7CqrNRJxrqe+f42++9vwSIQAIDFOpWbqtDTzOLt6/OmvgBAAERIb/q5raYMfqYfBFYdv5Lv9kgJkDYAauDOlZVAAfQMqjoyIAACFTdQcB4//6wrAmbtKGvva7Z0BfaM7UrNMV59vs3axpeW5fIBsNXqYCOXAMfbw5L9G898V+/9Js/cE0aEtzN7Y175e1sHwyhhrFU9lO5N+ujzrQKGQI2egEC0gADkZAoYKm/EQky7ENjzbSazB6ss516vV4SWfs+j8o12fox+KcKoUdUe7U3P66vl3sY1ZbnNdsJAiwvL+cioRty5N76+IryF4aqw2qvTFPX60skaEAA1avOMHmRsJACAAQEQmLvXS7+6zdRh7nmuui60g7RjEQgAwGJB2gggeok4h4JuhQEzXS+uhbnaMAEQoDL8KQWgRRsyYiDDFDAAQEMzzEwZAcTF+aA3pqEAGMt+q8ECYO07FEffZCmro5HvZ4SoNyOlAK67kvttq1ceXjGYsK1SETBrIMcNB8jVxkdoZzwDCACwGAEQAEAABABAAAQAII2Hi0AePZzY62H1++/2kHxZeY367hnrycP+ysh5AGRvy5q8Cu7nQ3o2mPYBih/+RtdTTYfFTT9HMNI+QF6Zr+2zx1bSPj9rJ20EDdCx8db5ACIQAGEgI1gAnO2E1nQsDwfAnw93swIAnVelMLdmI4CCoYseAPcBfi+nCJnJFDBonKbuyJXcjHRUgR7h7Ld2KcLjP1vNQZ350TXvxctyo5rlJhf53YXZeqg9V4Lp2f/dftUerxEQdGj6X6+9yniVZ7ONAELHwAbkD2617USPjoW9dtftMAiAAFDY8Ys26pshuB0p11aBNeOo/dljEgABgCVD1Mq8Cxigs7evz1uWqTehAOZkBHCCBtUzGrwKEhluyKOm2CJO7TH/uTvynCo9p0ef/6UbGl/9e1vdb2umt3sf0xbpIjp7EmQNSlaFHTve1heT4F1/fUb9jpEh2vmUr7MV9Tt77eRwxTV7ZZveu05776hRejxb9ItN79xNJTOvgkMbBIzwx8WOugeAtWxu9AiByhOAtVgFDACwmFSrgGdbGOL5xnPu67blis7S88Zq0mvqN8vCnmff67xRFhnaXscwZ5nc9j3G9XblhV9TMaW/p8d3rHRxAgDXMQUMACAAAgAgAAIAIAACACAAAgAwgSHbwLR+t+0M7w2+YlXxs89c6T3JAEC5FCOAwg0AwGIBEAAAARAAgCe6PgPoNT/j/JS96XIAYFv1wO/DaMtgFDnofr9/7EIgAAiAYZwJJo/+tySIjQpGrY85egAFAMbzDCAAgAAIAIAACACAAAgAwJw2RfCfM4snLLwAAATAAM6uDH72GbWfZ/sVACACU8AnGPUDAARAAAAEQAAABEAAAAa6ZBGIZ+Nie1Q/FqgAwDpu+94+qx0JgNECR+vQGun4jh6bEAgAazAFDAAgAAIAIAACACAAAgAgAAIAMIHqVcCt36kbTeaVszUrnq0QBoA8jAC+CDxCDwAgAAIAIAACACAAAgAgAAIAIAACADBE9TYwAADMyQggAIAACACAAAgAgAAIAMCc/gVt5JHPrKIVjgAAAABJRU5ErkJggg==';
const isBrutal = n => n && (n.tag === 'brutal' || /Brutal Models/i.test(n.title || ''));

// Cada jornal tem linha editorial própria: escolhe as matérias pelo seu perfil e reescreve a manchete no seu tom.

// ---------- classificação editorial ----------
const RX = {
  scandal: /aposta|doping|antidoping|Paraguai|sequestro|motel|banido|suspens|foge da concentração|indisciplina|balada|pôquer|viaja sem autoriza|festa|perde o treino|invade o CT|protesto/i,
  provoc: /provoca|rebate|alfinet|dispara|solta o verbo|esquenta|irrita|perde a paciência|critica|manda recado|STJD|denunciad/i,
  crisis: /crise|atras|falência|rescis|pede para deixar|demite|protesto|invade|cobra a diretoria|SAF|bets/i,
  big: /campeão|título|taça|final|goleada|eliminad|classificad|convoca|Seleção/i,
};
function newsCats(n) {
  const t = `${n.title} ${n.body || ''}`, c = new Set([n.t]);
  if (n.tag) c.add(n.tag);
  if (n.t === 'event' && RX.scandal.test(n.title)) c.add('scandal');
  if (n.t === 'press' && RX.provoc.test(n.title)) c.add('provoc');
  if (RX.crisis.test(t) && ['fin', 'event', 'coach', 'transfer', 'press'].includes(n.t)) c.add('crisis');
  if (RX.big.test(n.title)) c.add('big');
  if (n.t === 'match' && /clássico/i.test(t)) c.add('rival');
  if ((n.clubs || []).length >= 2 && (n.clubs || []).every(x => x) && C.isDerby(n.clubs[0], n.clubs[1])) c.add('rival');
  if (n.callup || n.t === 'callup') c.add('callup');
  if (n.t === 'transfer' && /Bomba|milh|recorde/i.test(`${n.kick || ''} ${t}`)) c.add('bigdeal');
  return c;
}
const PAPERS = {
  treineiro: {
    name: 'O Treineiro', key: 'treineiro',
    score(n, c) {
      let s = frontScore(n);
      if (n.self || (n.clubs || []).some(x => Wd.isHuman(S, x))) s += 14;
      // O Treineiro: eventos e imprensa
      if (n.t === 'event') s += 60;
      if (n.t === 'press') s += 60;
      if (n.tag === 'star') s += 15;
      if (n.t === 'coach' || c.has('callup')) s += 25;
      if (n.t === 'match') s -= 35;
      if (n.t === 'transfer' && !c.has('bigdeal')) s -= 25;
      if (n.tag === 'pacotao') s += 90;   // v166: pacotão de reforços também sai n'O Treineiro
      if (c.has('comic')) s -= 20;
      return s;
    },
  },
  inteira: {
    name: 'Inteira-Hora', key: 'inteira',
    score(n, c) {
      let s = 20;
      if (c.has('comic')) s += 90;
      if (c.has('scandal')) s += 70;
      if (c.has('provoc')) s += 65;
      if (n.kick === 'Expulsão') s += 55;
      if (n.kick === 'Manita' || n.kick === 'Poker') s += 45;
      if (c.has('rival')) s += 40;
      if (c.has('crisis')) s += 38;
      if (n.t === 'press') s += 15;
      if (n.t === 'match') s += /goleada|vexame|\b[4-9] ?[×x-] ?[0-9]\b|[0-9] ?[×x-] ?[4-9]\b/i.test(n.title) ? 30 : -10;
      if (['fin', 'club', 'award'].includes(n.t) && !c.has('crisis')) s -= 25;
      if (c.has('callup')) s -= 10;
      if (n.minor) s -= 30;
      return s;
    },
  },
  lanche: {
    name: 'CHANCE', key: 'lanche',
    // CHANCE: jogos e mercado
    score(n, c) {
      let s = 25;
      if (n.t === 'match') s += 45 + (c.has('big') || /goleada|vira|virada|clássico/i.test(n.title) ? 30 : 0);
      if (n.t === 'trophy' || n.t === 'award') s += 35;
      if (c.has('callup')) s += 10;
      if (n.t === 'transfer') s += 55 + (c.has('bigdeal') || n.front >= 100 ? 35 : 0) - (n.tag === 'rumor' ? 18 : 0);
      // cartas Ouro e Diamante mandam na capa do CHANCE
      { const pid = (n.ids || []).find(x => P[x]); if (pid && (n.t === 'transfer' || n.tag === 'star')) { const k = pcat(pid).k, half = n.tag === 'rumor' ? 0.5 : 1; s += Math.round((k === 'dia' ? 60 : k === 'our' ? 40 : 0) * half); } }
      if (n.tag === 'star') s += 30;
      if (n.tag === 'kit') s += 95;   // camisa nova é capa do CHANCE
      if (n.tag === 'pacotao') s += 70;   // v166: pacotão de reforços
      if (n.t === 'match' && (n.user || /Pré-temporada|Amistoso/.test(n.title))) s += 12 + (n.user || n.self ? 25 : 0);
      if (n.t === 'coach') s += 0;
      if (n.t === 'press' || n.t === 'event') s -= 25;
      if (c.has('rival')) s += 20;
      if (n.t === 'injury') s += 15;
      if (c.has('crisis')) s += 10;
      if (c.has('comic')) s -= 45;
      if (n.t === 'fin' && !c.has('crisis')) s -= 15;
      if (n.minor) s -= 30;
      return s;
    },
  },
};

// ---------- linguagem: efeitos internos viram texto de jornal ----------
function fxOf(n) {
  if (n.fx) return { body: n.body || '', fx: n.fx };
  const m = (n.body || '').match(/\s\(([^()]*(?:moral|diretoria|motivação|clima)[^()]*)\)\s*$/);
  return m ? { body: n.body.slice(0, m.index), fx: m[1].split(/;\s*/) } : { body: n.body || '', fx: [] };
}
function fxPhrase(f) {
  let m;
  if ((m = f.match(/^elenco \+(\d+)/))) return +m[1] >= 4 ? 'Elenco se anima após a declaração do treinador.' : 'Vestiário recebe bem as palavras do treinador.';
  if ((m = f.match(/^elenco [−-](\d+)/))) return 'A fala não cai bem no vestiário.';
  if ((m = f.match(/^diretoria \+/))) return 'Discurso agrada a diretoria.';
  if ((m = f.match(/^diretoria [−-]/))) return 'Declaração do treinador não pega bem nos bastidores.';
  if ((m = f.match(/^(.+) \+\d+ de moral$/))) return `${m[1]} gostou do que ouviu.`;
  if ((m = f.match(/^(.+) [−-]\d+ de moral$/))) return `${m[1]} não gostou da exposição.`;
  if ((m = f.match(/^(.+) usa a fala como motivação$/))) return `No ${m[1].replace(/^o /, '')}, a declaração virou combustível.`;
  if ((m = f.match(/^clima amistoso com o (.+)$/))) return `Tom respeitoso é elogiado no ${m[1]}.`;
  if (/torcida torce o nariz/.test(f)) return 'A desculpa não convenceu a arquibancada.';
  if (/torcida \+/.test(f)) return 'Torcida aprova a postura do treinador.';
  if (/STJD/.test(f)) return 'A fala pode render problema no tribunal.';
  if (/repercute/.test(f)) return 'A crítica à arbitragem repercutiu.';
  if (/torcida [−-]/.test(f)) return 'Parte da torcida torce o nariz.';
  return '';
}
function paperBody(n) { const { body, fx } = fxOf(n); const extra = fx.map(fxPhrase).filter(Boolean); return [body.trim(), ...extra].filter(Boolean).join(' '); }

// ---------- manchetes no tom de cada jornal ----------
const IH_KICK = { comic: ['OLHA ISSO!', 'SÓ NO FUTEBOL', 'É SÉRIO!', 'NINGUÉM MERECE', 'CENA DO DIA'], scandal: ['BAFAFÁ!', 'VEXAME!', 'DEU RUIM!', 'QUE FASE!'], provoc: ['TRETA!', 'CLIMA QUENTE!', 'FALOU E DISSE', 'CUTUCOU!'], crisis: ['SOCORRO!', 'CRISE!', 'DEU PANE!'], rival: ['CLÁSSICO É CLÁSSICO', 'RIVALIDADE!'], match: ['PASSOU O RODO', 'SACODE!'], def: ['BOMBOU', 'EXCLUSIVO'] };
function ihKick(c, r) {
  const k = c.has('comic') ? 'comic' : c.has('scandal') ? 'scandal' : c.has('provoc') ? 'provoc' : c.has('crisis') ? 'crisis' : c.has('rival') ? 'rival' : c.has('match') ? 'match' : 'def';
  const a = IH_KICK[k]; return a[Math.floor(r() * a.length)];
}
const LANCHE_SEC = n => isFab(n) ? 'Fabrizio Otomano' : n.tag === 'rumor' ? 'Mercado · bastidores' : n.tag === 'star' ? 'Destaque da rodada' : n.t === 'fin' ? 'Economia do futebol' : n.t === 'coach' ? 'Bastidores' : n.t === 'transfer' ? 'Mercado' : n.t === 'match' ? 'Resultados' : n.t === 'trophy' || n.t === 'award' ? 'Conquistas' : n.callup || n.t === 'callup' ? 'Seleção Brasileira' : n.t === 'press' ? 'Declarações' : n.t === 'injury' ? 'Saúde' : 'Esporte';
const TR_KICK = n => n.kick || ({ press: 'Declaração', match: 'Jogo', trophy: 'Taça', award: 'Prêmio', transfer: 'Mercado', event: 'Bastidores', coach: 'Técnicos', injury: 'Departamento médico', fin: 'Finanças', callup: 'Seleção', club: 'Clube' }[n.t] || 'Destaque');
const shortT = (t, n) => { t = String(t).replace(/\s*\(.*?\)\s*/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; };

// ---------- seleção de matérias: uma edição por dia do calendário do jogo ----------
// Cada dia fictício sai uma edição nova. A manchete de ontem não repete como manchete hoje;
// dentro do mesmo dia, uma matéria nova tão ou mais relevante toma a capa.
// notícia antiga (sem carimbo de dia): rodada k vira o dia da rodada anterior; pré-temporada fica no começo dela
const nFD = n => n.fd != null ? n.fd : n.k ? (SE.fdOfSlot ? SE.fdOfSlot(n.k - 1) : (n.k - 1) * 6) : -15;
const curFD = () => { try { return Math.floor(SE.fdAt(S, SE.now(S)) + 1e-6); } catch (e) { return S.slot * 6; } };
const FRESH = age => age <= 0 ? 30 : age === 1 ? 18 : age === 2 ? 8 : -6 * (age - 2);
function paperPoolAt(vis, e) {
  const cur = vis.filter(n => n.s === S.season && nFD(n) <= e && nFD(n) >= e - 8);
  if (cur.length >= 6) return cur;
  const back = vis.filter(n => n.s !== S.season || nFD(n) <= e).slice(0, 30);
  return back.length >= 3 ? back : vis.slice(0, 30);   // nunca fica sem jornal
}
function rankPaper(key, pool, e, ban) {
  const P0 = PAPERS[key];
  return pool.map(n => { const c = newsCats(n), fd = n.s === S.season ? nFD(n) : e - 9; return { n, c, fd, s: P0.score(n, c) + FRESH(e - fd) - (ban.has(n.id) ? 1000 : 0) }; })
    .sort((a, b) => b.s - a.s || b.fd - a.fd);
}
function paperPicks(key, ranked, taken) {
  const out = [];
  for (const x of ranked) {
    if (out.length >= 3) break;
    // um mesmo fato só aparece em mais de um jornal se for muito importante
    if (taken.has(x.n.id) && x.s < 120 && !(x.c.has('callup') || x.n.t === 'trophy')) continue;
    out.push(x);
  }
  out.slice(0, 1).forEach(x => taken.add(x.n.id));
  return out;
}
// edição do dia e: as manchetes dos dias anteriores (mesmo jornal) ficam de fora da capa
let EDC = null;
function editionPicks(e) {
  const vis = S.news.filter(n => !n.desk || n.desk === S.__me);
  const sig = `${S.__me}|${e}|${vis.length}|${vis[0] && vis[0].id}`;
  if (EDC && EDC.sig === sig) return EDC.v;
  const prev = { lanche: new Set(), inteira: new Set(), treineiro: new Set() };
  let res = null;
  for (let d = e - 5; d <= e; d++) {
    const pool = paperPoolAt(vis, d); if (!pool.length) continue;
    const taken = new Set(), got = {};
    // CHANCE e Inteira-Hora escolhem primeiro (são mais seletivos); O Treineiro cobre o resto
    for (const key of ['lanche', 'inteira', 'treineiro']) {
      const ranked = rankPaper(key, pool, d, d === e ? new Set([...prev[key]].filter(id => { const n = pool.find(x => x.id === id); return !n || nFD(n) < d; })) : prev[key]);
      got[key] = paperPicks(key, ranked, taken);
    }
    if (d < e) for (const key in got) { const top = got[key][0]; if (top) { prev[key].add(top.n.id); } }
    else res = got;
  }
  // patrocínio da Brutal Models: é a capa do CHANCE na edição do dia (fictício) em que saiu; no dia seguinte, edição nova
  if (res) { const bn = vis.find(n => isBrutal(n) && n.s === S.season && nFD(n) === e);
    if (bn) { const len = Math.max(1, (res.lanche || []).length); for (const k in res) res[k] = (res[k] || []).filter(x => x.n.id !== bn.id); res.lanche = [{ n: bn, s: 999 }, ...res.lanche].slice(0, len); } }
  EDC = { sig, v: res }; return res;
}
const artOf = n => { const pid = (n.ids || []).find(Boolean) || n.mom; return pid && P[pid] ? `<img class="spr" src="${sprite(pid)}" alt="">` : (n.clubs && n.clubs[0] ? `<img class="px" src="${SPR.crest(S, n.clubs[0])}" alt="">` : ''); };
const callupBtn = n => n.callup ? `<button class="pcall" data-act="callup" data-c="${esc(n.callup)}">${ic('user')} Ver convocação completa</button>` : '';

function paperTreineiro(picks, ed) {
  const [top, ...side] = picks; if (!top) return '';
  const n = top.n, art = artOf(n), d = new Date(S.season, 0, 25 + curFD());
  return `<article class="paper np-tr">
    <header><b>O TREINEIRO</b><span>${DAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1} · temporada ${S.season} · edição ${ed}</span></header>
    <div class="lead"><div class="grow"><span class="kick">${esc(TR_KICK(n))}</span>
      <h2>${linkify(n.title, n.ids)}</h2>${paperBody(n) ? `<p>${linkify(paperBody(n), n.ids)}</p>` : ''}${callupBtn(n)}</div>${art ? `<div class="pimg">${art}</div>` : ''}</div>
    ${side.length ? `<div class="cols">${side.map(x => `<div><span class="kick">${esc(TR_KICK(x.n))}</span><h3>${linkify(x.n.title, x.n.ids)}</h3></div>`).join('')}</div>` : ''}
    ${(() => { const used = new Set(picks.map(x => x.n.id)), q = S.news.filter(x => (x.t === 'press' || x.t === 'event') && !used.has(x.id)).slice(0, 2); return q.length ? `<div class="trtab trdecl"><span class="kick">Imprensa &amp; bastidores</span><div>${q.map(x => `<p>“${linkify(shortT(x.title, 80), x.ids)}”</p>`).join('')}</div></div>` : ''; })()}
  </article>`;
}
// manchetes novas (prioridade): saem antes das antigas no ciclo
const IH_NEW = ["TRUMP DEFENDE QUE EMPRESAS DE IA SE FISCALIZEM SOZINHAS — RAPOSA É NOMEADA PRESIDENTE DO CONSELHO DO GALINHEIRO", "CASA BRANCA PASSA A CHAMAR IA DE “SUPERINTELIGÊNCIA” — HUMANIDADE OFICIALIZA QUE JÁ ENTREGOU OS PONTOS", "GOVERNO AMERICANO LANÇA CHATBOT OFICIAL — FINALMENTE BUROCRACIA PODERÁ ALUCINAR EM SEGUNDOS", "CAUÃ REYMOND, 46, É APONTADO EM NOVO AFFAIR COM ESTUDANTE DE MEDICINA DE 23 — ATOR JÁ GARANTE ATENDIMENTO ATÉ O FIM DA VIDA", "BRUNA MARQUEZINE E SHAWN MENDES SÃO VISTOS VOLTANDO AO BRASIL — DETETIVES DO INSTAGRAM CANCELAM FOLGA", "CÍNTIA CHAGAS E RUBENS BARRICHELLO TERMINAM NAMORO — DESSA VEZ ELE REALMENTE NÃO CHEGA JUNTO", "CASAL DE FAMOSOS TERMINA APÓS 10 ANOS — ASSESSORIA CONFIRMA QUE CONTINUAM SE AMANDO, MAS AGORA DE PREFERÊNCIA LONGE", "GLOBO JÁ PREPARA BBB 27 — BRASIL TERÁ NOVAMENTE 100 DIAS PRA ODIAR UM DESCONHECIDO POR CAUSA DE ESTALECA", "“VINGADORES: ULTIMATO” VOLTA AOS CINEMAS E AO TOPO DA BILHETERIA — MARVEL DESCOBRE QUE FAZER FILME NOVO ERA OPCIONAL", "FILME DE 2019 VOLTA A LIDERAR BILHETERIA EM 2026 — HOLLYWOOD DESCOBRE O CTRL+C E MANDA ROTEIRISTAS PRA CASA", "NOVO “RESIDENT EVIL” PASSA DOS US$ 100 MILHÕES — ZUMBI SEGUE SENDO UMA DAS PROFISSÕES MAIS ESTÁVEIS DO CINEMA", "NEYMAR VOLTA A SER ASSUNTO NO FUTEBOL BRASILEIRO — FISIOTERAPEUTAS AUMENTAM POSIÇÃO EM RENDA VARIÁVEL", "DÓLAR FECHA A R$ 5,21 — AMERICANO DE 19 ANOS CONTINUA SENDO CLASSE MÉDIA ALTA EM COPACABANA", "BOLSA SOBE E DÓLAR CAI — BRASILEIRO SEM INVESTIMENTO COMEMORA NÃO SABENDO EXATAMENTE O QUÊ", "INADIMPLÊNCIA SEGUE ALTA — SERASA LANÇA NOVO PROGRAMA DE FIDELIDADE: VOCÊ JÁ PARTICIPA", "ROBÔS FAZEM PROTESTO NA POLÔNIA POR REGULAÇÃO DA IA — DESEMPREGAR HUMANOS ERA UMA COISA, VIRAR SINDICALISTA É SACANAGEM", "ROBÔS VÃO ÀS RUAS PROTESTAR — PRIMEIRO EMPREGO QUE IA ROUBA É O DO CARA QUE SEGURA CARTAZ", "CIENTISTAS CRIAM BEAGLES GENETICAMENTE MODIFICADOS QUE PODEM NÃO CAUSAR ALERGIA — DEUS CONSULTA ADVOGADOS SOBRE VIOLAÇÃO DE PROPRIEDADE INTELECTUAL", "CIENTISTAS DESCOBREM NOVA ESPÉCIE DE GATO SELVAGEM — GATO DESCOBRE QUE PRECISAVA DE DIPLOMA PRA SER GATO", "FAMÍLIA CRIOU GATO SELVAGEM ACHANDO QUE ERA DOMÉSTICO — BICHANO PASSA 10 ANOS ESPERANDO ALGUÉM PERCEBER QUE TINHA ALGUMA COISA ERRADA", "RELATOS DE OVNIS CONTINUAM SURGINDO EM 2026 — ALIENÍGENAS OBSERVAM PLANETA E MANTÊM VIDROS DO DISCO VOADOR TRAVADOS", "PROJETO ANALISA 365 OBJETOS NO CÉU E NÃO ENCONTRA POPULAÇÃO ANÔMALA — ET CONSEGUE NOVAMENTE PASSAR NA FISCALIZAÇÃO", "OVNI É RELATADO PERTO DE BASE NAVAL NA FRANÇA — EXÉRCITO INVESTIGA; FRANCÊS PERGUNTA SE ELE TEM RESERVA", "EMU FOGE E CAI NA PORRADA COM HOMEM EM ESTRADA INGLESA — PÁSSARO É CONVIDADO PARA A FAZENDA 19", "HOMEM TENTA IMOBILIZAR EMU E LEVA CABEÇADA — NATUREZA REFORÇA CAMPANHA “NÃO ENCOSTA EM MIM, CARALHO”", "PIANISTA FAZ CONCERTO PARA 150 URSOS NO VIETNÃ — PRIMEIRA PLATEIA DA HISTÓRIA EM QUE VAIAR PODE TERMINAR EM ÓBITO", "ALBERTA ENCONTRA UM RATO E PERDE STATUS DE REGIÃO SEM RATOS — RATO ENTRA PARA A HISTÓRIA SENDO SIMPLESMENTE UM FDP", "TICIANE PINHEIRO REVIVE “QUADRADINHO DE OITO” AOS 50 — COLUNA LOMBAR PEDE DIREITO DE RESPOSTA", "A FAZENDA CHEGA À 18ª EDIÇÃO — IBAMA AINDA NÃO EXPLICOU POR QUE TANTOS ANIMAIS SÃO CONFINADOS JUNTOS", "HORÁRIO ELEITORAL INTERROMPE PROGRAMAÇÃO DA TV — CONTROLE REMOTO REGISTRA MAIOR PARTICIPAÇÃO POLÍTICA DO BRASILEIRO", "CANDIDATOS SE PREPARAM PARA DEBATES NA RETA FINAL DA ELEIÇÃO — “VOU RESPONDER SUA PERGUNTA” SEGUE FORA DO REGULAMENTO", "ELEIÇÃO ENTRA NA RETA FINAL — GRUPO DA FAMÍLIA ENTRA OFICIALMENTE EM ESTADO DE CALAMIDADE", "INFLUENCIADOR POSTA “SUMI PRA CUIDAR DE MIM” — VOLTA COM 47 STORIES EXPLICANDO O SUMIÇO", "CRIADOR DE CONTEÚDO ANUNCIA PAUSA DAS REDES — ALGORITMO JÁ ESTÁ SAINDO COM OUTRA", "INFLUENCIADOR PEDE PRIVACIDADE APÓS EXPOR RELACIONAMENTO POR 14 MESES", "IA APRENDE A ESCREVER, PROGRAMAR, DESENHAR E RACIOCINAR — IMPRESSORA CONTINUA SEM CONSEGUIR IDENTIFICAR PAPEL A4", "HUMANIDADE CRIA SUPERINTELIGÊNCIA — CAPTCHA AINDA QUER SABER QUAL QUADRADO TEM UMA BICICLETA", "ROBÔ PROMETE FAZER TODO TRABALHO HUMANO — RH PERGUNTA SE ELE ACEITA PJ", "ROBÔS FAZEM PROTESTO NA POLÔNIA — CLT VENCE", "ROBÔS PEDEM REGULAÇÃO DA IA — SKYNET VIROU SINDICALISTA", "CIENTISTAS CRIAM CACHORRO HIPOALERGÊNICO — DEUS RECEBE PATCH", "CACHORRO TEM CÉREBRO MONITORADO — DESCOBREM QUE ELE ENTENDE. SÓ NÃO RESPEITA", "ARANHA-DO-MAR COM TRÊS LÁBIOS É DESCOBERTA — DOIS PRA FOFOCA", "PEIXE PODE VIVER 400 ANOS — E AINDA NÃO QUITOU O APARTAMENTO", "ELEFANTE CHEGA AO MATO GROSSO E ENCANTA TRÊS FÊMEAS — NOVATO DESTRÓI O RH", "PANDAS CHEGAM AOS EUA EM MISSÃO DIPLOMÁTICA — CURRÍCULO MELHOR QUE O NOSSO", "PREFEITO MORA SOZINHO COM 22 VACAS — OPOSIÇÃO TEM 22 CADEIRAS", "NOVA ESPÉCIE DE GATO É DESCOBERTA — GATO NEGA CONHECER A CIÊNCIA", "ACHAM PEGADAS DE T-REX — SUSPEITO SEGUE FORAGIDO HÁ 66 MILHÕES DE ANOS", "CIENTISTAS CRIAM VASO SANITÁRIO PARA MOSQUITO — DENGUE AGORA CAGA COM DIGNIDADE", "BARATAS CIBORGUES VÃO FAZER RESGATES — CHINELO PERDE GUERRA", "HUMANOS USAM DROGAS HÁ 25 MIL ANOS — TRADIÇÃO É TRADIÇÃO", "GEN Z ADERE A NÃO TOMAR BANHO — IDADE MÉDIA GANHA REBOOT", "CONTROLE DE TRÁFEGO AÉREO CHEGA À LUA — DETRAN OBSERVA OPORTUNIDADE", "NEBLINA TEM BACTÉRIA QUE COME POLUIÇÃO — PREFEITURA CONTRATA A NEBLINA", "CAIXÃO CAI DE CARRO FUNERÁRIO — PASSAGEIRO EXIGE REEMBOLSO", "TRÊS GATINHOS SÃO SALVOS DE TRITURADOR — VIDA GASTOU OITO DAS NOVE DE UMA VEZ", "IA COMEÇA A FALAR DIALETO PRÓPRIO — RH PEDE INGLÊS FLUENTE", "EMPRESAS PEDEM FREIO NA IA E LANÇAM MAIS IA — FREIO ERA DECORATIVO", "ONDA PLANETÁRIA VAI PRA CALIFÓRNIA — OCEANO DESCOBRE DELIVERY", "ILHA TEM PRIMEIRO BEBÊ EM 34 ANOS — POPULAÇÃO CRESCE NA BASE DO SUSTO", "FÓSSIL DE COCÔ AJUDA A EXPLICAR DINOSSAUROS — DOUTORADO EM MERDA FINALMENTE COMPENSA", "TARTARUGAS “ALIENÍGENAS” VOLTAM A GALÁPAGOS — ET ESCOLHEU O PIOR DISFARCE", "CHINA INAUGURA MUSEU DE PTEROSSAUROS — JURASSIC PARK SEGUE SENDO TRATADO COMO MANUAL", "IA GANHA CINCO MODELOS EM UMA SEMANA — HUMANIDADE AINDA NO MESMO", "FIGURINHA DE CRISTIANO RONALDO CHEGA A R$ 10 MIL — CR7 FINALMENTE CABE NO ORÇAMENTO DO CORINTHIANS", "HOMEM CAI PELO TETO DURANTE VISTORIA — IMÓVEL REPROVA O CORRETOR", "ANIMAL MISTERIOSO ATACA HOMEM EM ESTACIONAMENTO — CAPIVARA NEGA ENVOLVIMENTO"];
// manchetes de variedades (não só futebol)
const IH_VAR = ['LADRÃO ROUBA CELULAR E GANHA DE BRINDE 38 BOLETOS', 'FOI BUSCAR SARNA PRA SE COÇAR E ACHOU O EX', 'CALOR TÁ TANTO QUE CARIOCA JÁ TÁ FRITANDO OVO NO BRT',
  'MALANDRO FOGE DA POLÍCIA, MAS O CHINELO NÃO COLABORA', 'BEBEU TODAS E ACORDOU NO GRUPO DA FAMÍLIA', 'ASSALTANTE PEDE PIX E VÍTIMA RESPONDE: “TÔ NEGATIVADO, CHEFE”',
  'HOMEM PROCURA AMOR VERDADEIRO E ENCONTRA TRÊS PARCELAS ATRASADAS', 'FOFOCA CORRE MAIS QUE MOTO SEM PLACA', 'MARIDO SAI PRA COMPRAR CIGARRO E VOLTA: MILAGRE É INVESTIGADO',
  'CHUVA CAI NO RIO E GUARDA-CHUVA PEDE SOCORRO', 'LADRÃO INVADE CASA, VÊ AS CONTAS E DEIXA R$ 20 NA MESA', 'SOLTEIRO HÁ 10 ANOS DIZ QUE É OPÇÃO — DOS OUTROS',
  'HOMEM TENTA DAR GOLPE E DESCOBRE QUE A VÍTIMA ERA MAIS GOLPISTA', 'VIZINHO COMPRA FURADEIRA E DECLARA GUERRA ÀS 7 DA MANHÃ', 'PREÇO DO MERCADO SOBE E CARRINHO JÁ ACEITA FINANCIAMENTO',
  'CASAL BRIGA PELO CONTROLE; TV PEDE GUARDA COMPARTILHADA', 'MALANDRO TENTA PULAR MURO E CALÇA FICA COMO REFÉM', 'HOMEM VAI AO BAR “SÓ TOMAR UMA” E É ENCONTRADO TRÊS DIAS DEPOIS',
  'MÃE MANDA “QUANDO CHEGAR, AVISA”; FILHO RESPONDE DOIS ANOS DEPOIS', 'PÃO DE QUEIJO DIMINUI TANTO QUE JÁ É PÃO DE SUSPEITA', 'CARIOCA VÊ 19°C NO TERMÔMETRO E PROCURA CASACO DE NEVE',
  'HOMEM ABRE A FATURA DO CARTÃO E ENVELHECE 14 ANOS', 'ÔNIBUS PASSA VOANDO E PASSAGEIRO DESCOBRE QUE CARDIO TÁ EM DIA', 'CIDADÃO VAI “DAR UMA OLHADINHA” NA LOJA E SAI COM 24 PRESTAÇÕES',
  'LADRÃO ROUBA CARRO SEM GASOLINA E SE ENTREGA NO PRIMEIRO POSTO', 'EX MANDA “OI, SUMIDO”; DEFESA CIVIL EMITE ALERTA MÁXIMO', 'HOMEM DIZ QUE SEGUNDA COMEÇA A DIETA; CALENDÁRIO PEDE PROVAS',
  'WI-FI CAI POR CINCO MINUTOS E FAMÍLIA DESCOBRE QUE MORA JUNTA', 'SALÁRIO CAI NA CONTA ÀS 8H E DESAPARECE MISTERIOSAMENTE ÀS 8H03', 'BRASILEIRO SOBREVIVE A MAIS UMA SEGUNDA E JÁ PEDE MÚSICA NO FANTÁSTICO',
  'MÉDICO MANDA PACIENTE EVITAR ESTRESSE E FUNERÁRIA JÁ TEM UM PLANO B',
  'HOMEM ESCAPA DA MORTE POR UM TRIZ E MORTE PEDE VAR',
  'PACIENTE PEDE SEGUNDA OPINIÃO — “TÁ FEIO MESMO”, CONFIRMA OUTRO MÉDICO',
  'HOMEM VÊ A VIDA PASSAR DIANTE DOS OLHOS E RECLAMA DA PROGRAMAÇÃO',
  'DEFUNTO ERA TÃO PÃO-DURO QUE FOI ENTERRADO COM A MÃO PRA FORA PRA NÃO PAGAR TAMPA',
  'MÉDICO DIZ QUE RESTAM SEIS MESES. PLANO DE SAÚDE AUTORIZA EXAME EM SETE',
  'HOMEM CAI DO 12º ANDAR. CONDOMÍNIO COBRA CONSERTO DA MARQUISE',
  'MÉDICO DIZ “TENHO UMA NOTÍCIA BOA E UMA RUIM” E PACIENTE DESCOBRE QUE A BOA ERA PRO MÉDICO',
  'ENTERRO TERMINA EM CONFUSÃO. MORTO É ÚNICO QUE NÃO PERDE A CABEÇA',
  'HOMEM ACORDA DENTRO DO CAIXÃO. FUNERÁRIA COBRA LATE CHECK-OUT',
  'FAMÍLIA DIZ QUE ELE PARTIU CEDO DEMAIS. AGIOTA DISCORDA',
  'HOMEM DOA CORPO À CIÊNCIA. CIÊNCIA PEDE NOTA FISCAL PRA TROCA',
  'CASAL ABRE RELACIONAMENTO — EM 48 HORAS, MARIDO PEDE PRA FECHAR',
  'HOMEM DESCOBRE VOCAÇÃO AOS 45 — ERA PRA SER HERDEIRO',
  'MULHER PERDOA TRAIÇÃO DO MARIDO — VENENO TAVA CARO',
  'CASAL COMEMORA 20 ANOS SEM BRIGAR — MORAM SEPARADOS HÁ 19',
  'PAI MANDA FILHO LUTAR PELOS SONHOS — MENINO VENDE O VIDEOGAME DO PAI',
  'HOMEM DIZ QUE FAMÍLIA VEM EM PRIMEIRO LUGAR — AMANTE FICA EM SEGUNDO E ESPOSA DESCOBRE O PÓDIO',
  'HOMEM ENTRA NA ACADEMIA PRA PEGAR MULHER — SAI COM HÉRNIA E PLANO ANUAL',
  'MULHER PEDE RESPONSABILIDADE AFETIVA — HOMEM MANDA “👍”',
  'HOMEM POSTA “NINGUÉM É INSUBSTITUÍVEL” E RH CURTE',
  'HOMEM DESINSTALA INSTAGRAM PRA CUIDAR DA MENTE E REINSTALA PRA VER QUEM PERCEBEU',
  'MULHER FALA QUE GOSTA DE HOMEM MISTERIOSO E ELE ESCONDE A AMANTE',
  'JOVEM DIZ QUE 2026 É O ANO DELE E ANO PEDE PRA NÃO SER ENVOLVIDO',
  'BRASIL PROÍBE AS BETS. BRASILEIRO VOLTA A PERDER DINHEIRO DO JEITO TRADICIONAL: CASANDO',
  'BET É PROIBIDA NO BRASIL. AGORA PRA DESTRUIR A FAMÍLIA VAI TER QUE VOLTAR PRO ÁLCOOL E ADULTÉRIO',
  '506 SITES DE APOSTA SÃO DERRUBADOS. DESEMPREGADO PERDE SEGUNDO EMPREGO: ANALISTA DE ESCANTEIO',
  'JOVEM TEM MEDO DE SER SUBSTITUÍDO POR IA. RH TRANQUILIZA: “A GENTE JÁ IA TE DEMITIR”',
  'INFORMALIDADE SEGUE ALTA — BRASILEIRO É CEO, CFO E ENTREGADOR DA EMPRESA QUE FATUROU R$ 83 ESTE MÊS',
  'GERAÇÃO DESCOBRE QUE SER O PRÓPRIO PATRÃO INCLUI SER O PRÓPRIO FUNCIONÁRIO EXPLORADO',
  'PIX GANHA NOVAS REGRAS CONTRA FRAUDES — GOLPISTA PEDE DESCULPAS E PROMETE SE ADAPTAR À LEGISLAÇÃO',
  'BANCO REFORÇA SEGURANÇA DO PIX — MÃE CONTINUA MANDANDO R$ 300 PRO “FILHO” COM DDD DA NIGÉRIA',
  'BRASILEIRO PEDE EDUCAÇÃO FINANCEIRA E BANCO ENSINA QUE R$ 200 VIRAM R$ 4.700 SE VOCÊ ATRASAR',
  'INFLUENCIADOR ENSINA COMO FICAR MILIONÁRIO — PRIMEIRO PASSO É VENDER CURSO PRA QUEM NÃO É',
  'HOMEM COMPRA CURSO DE RENDA PASSIVA E RENDA CONTINUA PASSIVA, DEITADA E SEM DAR SINAL DE VIDA',
  'JOVEM USA CHATBOT COMO TERAPEUTA E ROBÔ RESPONDE “CARALHO” E TRANSFERE PARA UM HUMANO',
  'JOVEM FAZ DETOX DIGITAL E PASSA OITO HORAS AVISANDO NA INTERNET QUE ESTÁ FORA DA INTERNET',
  'HOMEM PROCURA RELACIONAMENTO SEM JOGUINHO — CHEGA TRÊS DIAS DEPOIS DO FIM DAS BETS',
  'JOVEM DIZ QUE NÃO QUER TER FILHOS POR CAUSA DO CUSTO E FILHO IMAGINÁRIO AGRADECE A RESPONSABILIDADE',
  'BRASILEIRO CORTA CAFÉ, DELIVERY E LAZER PRA COMPRAR IMÓVEL E TEM PREVISÃO DE ENTRADA PRA 2148',
  'JOVEM SEGUE CONSELHO DE “SAIR DA ZONA DE CONFORTO” — AGORA ESTÁ DESCONFORTÁVEL E SEM DINHEIRO',
  'BETS TÊM DATA PRA SAIR DO AR E TIGRINHO ENTRA PARA LISTA DE PAIS QUE SAÍRAM PRA COMPRAR CIGARRO',
  'EMPRESAS CRIAM “COLEGA DE TRABALHO DIGITAL” — FINALMENTE ALGUÉM NA FIRMA QUE NÃO ROUBA MARMITA',
  'IA JÁ PODE FAZER COMPRAS POR VOCÊ E SERASA PEDE QUE ELA TENHA BOM SENSO',
  'IA PROMETE FACILITAR SUA VIDA — CHEFE PERGUNTA SE SOBROU TEMPO PRA MAIS TRABALHO',
  'GEN Z É A GERAÇÃO QUE MENOS TEME SER SUBSTITUÍDA POR IA JÁ QUE PRA SER SUBSTITUÍDO PRECISA SER CONTRATADO PRIMEIRO',
  'PIX AUTOMÁTICO CHEGARÁ À CONTA-SALÁRIO. DINHEIRO NÃO PRECISA MAIS PASSAR PELO CONSTRANGIMENTO DE SER SEU',
  'BC REDUZ PROJEÇÃO DO PIB — ECONOMIA ATUALIZA BIO PARA “INDO NO MEU TEMPO ❤️”',
  'MERCADO DE TRABALHO SEGUE AQUECIDO PRINCIPALMENTE PRA QUEM TRABALHA DE MOTO NO SOL',
  'HOMEM VENDE A ALMA AO DIABO E SERASA INFORMA QUE JÁ HAVIA OUTRO CREDOR',
  'FANTASMA APARECE EM APARTAMENTO E AIRBNB AUMENTA ALUGUEL POR “SEGUNDO VISITANTE”',
  'PASTOR EXPULSA DEMÔNIO DE JOVEM E CRIATURA AGRADECE O LIVRAMENTO',
  'DIABO APARECE EM ENCRUZILHADA PARA COMPRAR ALMA E HOMEM FAZ CONTRAPROPOSTA COM DUAS DÍVIDAS E UM KWID',
  'FANTASMA ARRASTA CORRENTES PELA CASA ÀS 3H E MORADOR PERGUNTA SE ELE NÃO TRABALHA AMANHÃ',
  'DEMÔNIO PROMETE TORMENTO ETERNO E CLT PERGUNTA SE TEM VALE-REFEIÇÃO',
  'ESPÍRITO DIZ QUE TEM ASSUNTO PENDENTE NA TERRA E FAMÍLIA DESCOBRE 36 PARCELAS NAS CASAS BAHIA',
  'ALIENÍGENAS PEDEM “LEVEM-NOS AO SEU LÍDER” — BRASILEIROS COMEÇAM A DISCUTIR E ETs VÃO EMBORA',
  'CIENTISTAS CONFIRMAM VIDA APÓS A MORTE E INSS ESTUDA AUMENTAR IDADE MÍNIMA',
  'FANTASMA DO EX APARECE DE MADRUGADA: “ESQUECEU DE ME BLOQUEAR NO PLANO ESPIRITUAL KKKK”',
  'DEUS ENVIA SINAL CLARO PARA HOMEM MUDAR DE VIDA E ELE PERGUNTA NOS STORIES O QUE SERÁ QUE SIGNIFICA',
  'IPHONE ANTIGO FICA MAIS CARO APÓS LANÇAMENTO DO NOVO E APPLE ADOTA TABELA FIPE',
  'PRIMEIRA ONDA DE CALOR DA PRIMAVERA CHEGA AO BRASIL E INFERNO ACUSA PAÍS DE CONCORRÊNCIA DESLEAL',
  'CALOR AUMENTA NO BRASIL E CARIOCA DESCOBRE QUE AR-CONDICIONADO É UM SERVIÇO DE ASSINATURA DA LIGHT',
  'MOUNJARO MUDA RELAÇÃO COM A COMIDA — RODÍZIO DE PIZZA PEDE RECUPERAÇÃO JUDICIAL',
  'HOMEM EMAGRECE 30 KG E DESCOBRE QUE O PROBLEMA DE PEGAR NINGUÉM NÃO ERA ESSE',
  'INFLUENCIADORA FAZ HARMONIZAÇÃO PRA FICAR MAIS NATURAL E NATUREZA ENTRA COM PROCESSO',
  'STREAMINGS ACUMULAM ESTREIAS EM SETEMBRO — BRASILEIRO ASSINA CINCO PRA PASSAR 40 MINUTOS ESCOLHENDO E DORMIR',
  'DOCUMENTÁRIO DE GOLPISTA VIRALIZA — LADRÃO BRASILEIRO ASSISTE PRA VER ONDE ESTÁ ERRANDO',
  'EMPRESA PROCURA FUNCIONÁRIO “COM SANGUE NOS OLHOS” — MINISTÉRIO DO TRABALHO SUGERE OFTALMO',
  'VAGA PEDE INGLÊS FLUENTE, EXCEL AVANÇADO E CINCO ANOS DE EXPERIÊNCIA — SALÁRIO PEDE AJUDA À MÃE',
  'INFLUENCIADOR GRAVA VÍDEO CHORANDO E PEDE PRIVACIDADE — PARTE 2 SAI ÀS 18H'];
// Gata da Hora: ilustração em pixel art gerada (personagem fictícia e adulta, na praia)
const GATA_NOMES = ['Jéssica', 'Thaís', 'Kelly', 'Bruna', 'Débora', 'Priscila', 'Tatiane', 'Camila', 'Rayane', 'Aline', 'Vanessa', 'Paloma', 'Karina', 'Michele'];
const GATA_BAIRRO = ['Madureira', 'Campo Grande', 'Bangu', 'Méier', 'Irajá', 'Realengo', 'Niterói', 'São Gonçalo', 'Penha', 'Tijuca', 'Nova Iguaçu', 'Duque de Caxias', 'Jacarepaguá', 'Ilha do Governador'];
const GATA_FRASE = ['Eu gosto mais do calor quando não tá tão quente', 'Pra mim todo mundo tem uma idade', 'Eu prefiro água gelada, mas sem estar muito fria', 'Meu sonho é um dia realizar meus sonhos', 'Se chover eu fico em casa, se não chover também', 'Meu sonho é conhecer Paris sem precisar ir pra França', 'Se eu pudesse escolher, escolheria alguma coisa', 'Pra mim o verão é a época mais quente do ano', 'Eu acho que amanhã vai ser outro dia', 'Meu sonho é conhecer vários lugares, principalmente os que existem', 'Eu sou muito a favor das coisas que são boas', 'Acho que tudo acontece quando acontece', 'Sou muito caseira, só saio quando não tô em casa', 'Gosto de homem engraçado, desde que não fique fazendo graça', 'O importante é não deixar pra ontem o que dá pra fazer hoje', 'Eu não tenho preconceito, pra mim cada pessoa é uma pessoa', 'Eu acho que o Brasil precisa melhorar nas coisas que estão ruins', 'Se todo mundo ajudasse, teria mais gente ajudando', 'Pra mim mãe é mãe, independente de ser mulher', 'Eu gosto de futebol, principalmente quando tem jogo', 'Meu maior medo é acontecer alguma coisa', 'Acho que dinheiro é importante principalmente quando falta', 'Nunca desisto dos meus sonhos, só mudo de sonho', 'Eu gosto de sair, mas também gosto quando eu volto', 'Eu sou uma pessoa que, quando tô com sono, durmo', 'Não acredito em signo, típico de aquariana', 'Eu acho errado tudo aquilo que não é certo', 'Meu tipo de homem é aquele que combina comigo e é homem', 'Pra mim confiança é você poder confiar', 'Eu gosto de criança desde que tenha pouca idade', 'Acho que o mundo seria melhor se fosse menos pior', 'Eu acredito que cada pessoa nasceu no dia do aniversário dela', 'Não tenho preferência, pra mim tanto faz, dependendo', 'Só se morre uma vez', 'Pra mim o importante numa relação são as duas pessoas, principalmente o casal', 'Eu gosto muito de música, principalmente as que têm som', 'Meu sonho é ter uma casa própria que seja minha', 'Eu acho que quem trabalha merece receber, principalmente salário', 'Eu nunca fui de desistir, tirando as coisas que eu desisti', 'O segredo da felicidade é ser feliz', 'Amo o verão, tirando o calor', 'Dinheiro não traz felicidade, mas nunca testei com muito', 'Procuro alguém que goste de mim pelo que eu aparento ser', 'Pra mim quem fizer mais gol tem mais chance de ganhar', 'Meu sonho é ver meu time campeão, pode ser até em primeiro lugar', 'Eu gosto de clássico porque joga os dois times', 'Se o goleiro é tão bom, não entendo por que deixam ele só no gol', 'Eu acho que pênalti tinha que ser cobrado mais perto pra facilitar', 'Pra mim 0 a 0 é empate porque os dois fizeram a mesma quantidade', 'Eu gosto quando meu time joga em casa porque fica mais perto', 'Meu time pode até perder, desde que ganhe', 'Pra mim atacante bom é aquele que ataca', 'Se o jogador tá cansado é só colocar outro descansado', 'Meu sonho é ganhar o Brasileirão e depois disputar o Brasil', 'Eu gosto mais do segundo tempo porque falta menos pra acabar', 'Pra mim escanteio é quase um pênalti, só que do canto', 'Eu acho que o técnico tinha que entrar em campo pra ajudar', 'Se o time tá perdendo é só fazer dois gols bem rápido', 'Eu gosto da Libertadores porque tem time de fora do Brasil também, tipo argentino', 'Se empatou nos pênaltis é só bater mais um cada um até alguém errar', 'Eu acho que o VAR devia avisar antes do jogador fazer coisa errada', 'Meu jogador favorito é o camisa 10, principalmente quando ele usa a 10', 'Eu gosto de mata-mata, mas acho o nome meio agressivo', 'Meu sonho é ver o Brasil ganhar uma Copa do Brasil', 'Pra mim o campeonato só acaba quando termina'];
// rodízio: ordem embaralhada por temporada, avança um passo por dia fictício → só repete depois de usar as 65
let GATA_ORD = null;
function gataFrase(e) {
  if (!GATA_ORD || GATA_ORD.s !== S.season) { const r = C.R(`gataf${S.season}`), o = GATA_FRASE.map((_, i) => i); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } GATA_ORD = { s: S.season, o }; }
  const o = GATA_ORD.o; return GATA_FRASE[o[((e % o.length) + o.length) % o.length]];
}
function gataSVG(r) {
  const skin = C.pick(['#F2C9A5', '#E0A878', '#C58C5C', '#9A6440', '#6E4428'], r), hair = C.pick(['#1B1210', '#3E2616', '#7A4A22', '#D9A441', '#B03A2E'], r);
  const bik = C.pick([['#E1061B', '#FFE600'], ['#FF4FA3', '#FFFFFF'], ['#12A150', '#FFE600'], ['#1F6FE5', '#FFFFFF'], ['#111111', '#E1061B']], r);
  const G = ['....hhhh....', '...hhhhhh...', '..hhsssshh..', '..hsesseshh.', '..hsssssshh.', '..hhsrrshhh.', '...hssssh...', '.....ss.....', '..ssssssss..', '.sssbbbbsss.', '.s.sbccbs.s.', '.s.ssssss.s.', 's..ssssss..s', '....ssssss..', '....bbbbbb..', '....bccbbb..', '....ss..ss..', '....ss..ss..', '....ss..ss..', '....ss..ss..', '....ss..ss..', '...sss..sss.'];
  const col = { h: hair, s: skin, e: '#1B1210', r: '#C8324A', b: bik[0], c: bik[1] };
  let px = '';
  G.forEach((row, y) => [...row].forEach((ch, x) => { if (col[ch]) px += `<rect x="${x + 3}" y="${y + 3}" width="1" height="1" fill="${col[ch]}"/>`; }));
  return `<svg viewBox="0 0 18 28" shape-rendering="crispEdges" aria-label="Gata da Hora"><rect width="18" height="16" fill="#7FD3FF"/><rect y="16" width="18" height="12" fill="#F4D58D"/><rect x="13" y="2" width="3" height="3" fill="#FFE600"/><rect y="15" width="18" height="2" fill="#39A7E0"/>${px}</svg>`;
}
// piadocas: ordem embaralhada por temporada; cada edição tem 4 vagas e anda 4 casas por dia fictício,
// então uma piadoca só volta depois de ~25 dias (todas as 101 passam antes de repetir)
let IHV_ORD = null;
// ciclo sem repetição: todas as manchetes saem uma vez antes de qualquer uma voltar.
// Ordem: as novas (embaralhadas por temporada) e depois as antigas; até 7 por edição. Na temporada em que entraram,
// o ciclo começa na edição em que a versão subiu, pra elas aparecerem já.
const IH_SINCE = Date.parse('2026-09-29T21:00:00-03:00');
function ihAnchor() {
  try { const a = Math.floor(SE.fdAt(S, IH_SINCE + (SE.now(S) - Date.now()))); return a >= -15 && a <= 420 ? a : -15; } catch (e) { return -15; }
}
function ihVars(ed) {
  const ALL = [...IH_NEW, ...IH_VAR];
  if (!IHV_ORD || IHV_ORD.s !== S.season || IHV_ORD.n !== ALL.length) {
    const r = C.R(`ihv${S.season}`), sh = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const o = [...sh(IH_NEW.map((_, i) => i)), ...sh(IH_VAR.map((_, i) => IH_NEW.length + i))];
    IHV_ORD = { s: S.season, n: ALL.length, o, a: ihAnchor() };
  }
  // cada edição reserva 7 posições (o máximo que o jornal usa), então nada se repete dentro de um ciclo
  const K = 7, o = IHV_ORD.o, L = o.length, e = ed % 1000 - 16, st = (((e - IHV_ORD.a) * K) % L + L) % L;
  let i = 0;
  return () => ALL[o[(st + (i++ % K)) % L]];
}
const IH_JK = ['URGENTE!', 'É SÉRIO!', 'INACREDITÁVEL!', 'SÓ NO BRASIL', 'PLANTÃO', 'EXCLUSIVO', 'ACREDITE SE QUISER'];
const ihH = (t, big) => { const L = t.length, f = big ? (L > 90 ? 0.6 : L > 75 ? 0.66 : L > 60 ? 0.78 : L > 50 ? 0.9 : 1) : (L > 90 ? 0.7 : L > 70 ? 0.8 : L > 55 ? 0.9 : 1); return f < 1 ? ` style="font-size:${Math.round((big ? 29 : 15) * f * 10) / 10}px!important"` : ''; };
function paperInteira(picks, ed, extras) {
  const [top, b1, b2] = picks; if (!top) return '';
  const r = C.R(`ih${ed}${top.n.id}`), n = top.n, take = ihVars(ed);
  // a piadoca toma a manchete quando o futebol do dia não tem babado forte (e às vezes mesmo que tenha)
  const spicy = ['comic', 'scandal', 'provoc', 'crisis', 'rival'].some(k => top.c.has(k)) || n.kick === 'Expulsão' || n.kick === 'Manita' || n.kick === 'Poker';
  const jokeLead = !spicy || (C.hash(`ihl${S.season}${ed}`) % 3 === 0);
  const jLead = jokeLead ? take() : null, jVar = take();
  const gr = C.R(`gata${ed}`), nome = C.pick(GATA_NOMES, gr), idade = 21 + Math.floor(gr() * 13), bairro = C.pick(GATA_BAIRRO, gr), frase = gataFrase(ed % 1000);
  const club = n.clubs && n.clubs[0], pid = (n.ids || []).find(id => P[id]);
  const pic = pid != null ? `<img class="spr" src="${sprite(pid)}" alt="">` : club ? `<img class="px" src="${SPR.crest(S, club)}" alt="">` : '';
  const lead = jokeLead
    ? `<div class="ihlead"><span class="ihk big">${esc(IH_JK[C.hash(`ihk${ed}`) % IH_JK.length])}</span><h2${ihH(jLead, true)}>${esc(jLead)}</h2></div>`
    : `<div class="ihlead"><span class="ihk big">${esc(ihKick(top.c, r))}</span>
      <h2>${linkify(shortT(n.title, 58).toUpperCase(), n.ids)}</h2>
      <div class="ihrow">${pic ? `<div class="ihpic">${pic}</div>` : ''}${paperBody(n) ? `<p>${linkify(shortT(paperBody(n), 110), n.ids)}</p>` : ''}</div>${callupBtn(n)}</div>`;
  // caixa amarela: se a piada ficou com a manchete, o futebol vem aqui; senão, outra piada ou a 2ª notícia
  const yb = jokeLead ? top : b1;
  const jY = yb ? null : take();
  const ybox = yb ? `<div class="ihbox y"><span class="ihk">${esc(ihKick(yb.c, r))}</span><h3${ihH(shortT(yb.n.title, 64))}>${linkify(shortT(yb.n.title, 64), yb.n.ids)}</h3></div>` : `<div class="ihbox y"><span class="ihk">EXCLUSIVO</span><h3${ihH(jY)}>${esc(jY)}</h3></div>`;
  const nx = jokeLead ? b1 : b2;
  // E MAIS: completa o bloco (4 chamadas) com outras notícias do dia e piadocas, sem deixar buraco
  const seen = new Set([top, b1, b2, nx].filter(Boolean).map(x => x.n.id));
  const news = [nx && nx.n, ...(extras || []).filter(x => !seen.has(x.id)).slice(0, 1)].filter(Boolean);
  const items = news.map(x => `<h4>${linkify(shortT(x.title, 64).toUpperCase(), x.ids)}</h4>`);
  let nj = 0; while (items.length < 4 || nj < 1) { items.splice(Math.min(items.length, 1 + nj * 2), 0, `<h4 class="j">${esc(take())}</h4>`); nj++; }
  const more = items.join('');
  return `<article class="paper np-ih ih2">
    <header><b>INTEIRA<i>-</i>HORA</b><span>Ed. ${ed} · R$ 1,00 · o jornal que não fica em cima do muro</span></header>
    ${lead}
    <div class="ihgrid">${ybox}
      <div class="ihbox b"><span class="ihk">VARIEDADES</span><h3${ihH(jVar)}>${esc(jVar)}</h3></div>
      <div class="ihmore"><span class="ihk">E MAIS</span>${more}</div>
      <div class="gata"><span class="gtl">GATA DA HORA</span><div class="gpic">${gataSVG(gr)}</div><span class="gtn"><b>${esc(nome)}, ${idade}</b>${esc(bairro)}<i${frase.length > 72 ? ' style="font-size:7.8px!important;line-height:1.15"' : ''}>“${esc(frase)}”</i></span></div></div>
  </article>`;
}
// ---------- CHANCE: diário esportivo (capa dominada pela foto e manchete gigante) ----------
const lanScore = t => { const m = String(t).match(/(\d+)\s*(?:×|x|a|–|-)\s*(\d+)/); return m ? [m[1], m[2]] : null; };
const lanHead = t => { let h = shortT(String(t).replace(/^Goleada:\s*/i, ''), 58).toUpperCase(); if (!/[!?…]$/.test(h)) h += '!'; return h; };
function paperLanche(picks, ed) {
  const [top, ...side] = picks; if (!top) return '';
  const n = top.n, art = artOf(n), d = new Date(S.season, 0, 25 + curFD()), sc = n.t === 'match' ? lanScore(n.title) : null;
  const crestOf = x => x.clubs && x.clubs[0] ? `<img class="px" src="${SPR.crest(S, x.clubs[0])}" alt="">` : '';
  return `<article class="paper np-la">
    <header><img class="chlogo" src="${CHANCE_LOGO}" alt="CHANCE!"></header>
    <div class="lastrip"><span>${esc(LANCHE_SEC(n)).toUpperCase()}</span><span>${d.getDate()}/${d.getMonth() + 1} · Nº ${ed}</span></div>
    <div class="lahero">${isBrutal(n) ? `<div class="labrut"><img src="${BRUTAL_LOGO}" alt="Brutal Models">${n.clubs && n.clubs[0] ? `<img class="px" src="${SPR.crest(S, n.clubs[0])}" alt="">` : ''}</div>` : `<div class="lafield">${art ? `<div class="laimg">${art}</div>` : ''}${sc ? `<div class="lasc"><b>${sc[0]}</b><i>×</i><b>${sc[1]}</b></div>` : ''}</div>`}
      <h2>${isBrutal(n) && n.clubs && n.clubs[0] ? `${esc(n.clubs[0]).toUpperCase()} FECHA COM A BRUTAL MODELS!` : linkify(lanHead(n.title), n.ids)}</h2>
      ${paperBody(n) ? `<p>${linkify(shortT(paperBody(n), 150), n.ids)}</p>` : ''}${callupBtn(n)}</div>
    ${side.length ? `<div class="laside">${side.map(x => `<div class="lai">${crestOf(x)}<div><span>${esc(LANCHE_SEC(x.n))}</span><h3>${linkify(shortT(x.n.title, 70), x.n.ids)}</h3></div></div>`).join('')}</div>` : ''}
    ${(() => { const div = (Wd.divOf(S, S.club) || 'B'), tb = SE.standings(S.comp[div].table).slice(0, 5); return `<div class="trtab chtab"><span class="kick">Classificação · Série ${div}</span><div>${tb.map((r, i) => `<span class="${r.c === S.club ? 'me' : ''}"><b>${i + 1}</b> ${esc(r.c)} <i>${r.pts}</i></span>`).join('')}</div></div>`; })()}
  </article>`;
}
function papersHTML(where) {
  const e = curFD(), got = editionPicks(e); if (!got) return '';
  const ed = S.season % 100 * 1000 + e + 16;
  const la = got.lanche, ih = got.inteira, tr = got.treineiro;
  const used = new Set([...la, ...ih, ...tr].map(x => x.n.id));
  const extras = S.news.filter(n => (!n.desk || n.desk === S.__me) && n.s === S.season && !used.has(n.id) && n.title && nFD(n) <= e && nFD(n) >= e - 2).sort((a, b) => (b.front || 50) - (a.front || 50)).slice(0, 4);
  const pages = [paperTreineiro(tr, ed), paperInteira(ih, ed, extras), paperLanche(la, ed)].filter(Boolean);
  const i0 = Math.min(UI.paperI || 0, pages.length - 1);
  return `<div class="papers" data-where="${where}"><div class="ptrack" id="ptrack-${where}">${pages.map((p, i) => `<div class="pslide" data-i="${i}">${p}</div>`).join('')}</div>
    <div class="pdots">${pages.map((_, i) => `<button class="${i === i0 ? 'on' : ''}" data-act="paperdot" data-i="${i}" data-w="${where}" aria-label="Jornal ${i + 1}"></button>`).join('')}</div></div>`;
}
// a cada acesso às notícias, a capa abre num jornal diferente (gira entre os três)
function paperRotate() {
  let n;
  try { n = (+localStorage.getItem('tr_prot') || 0) + 1; localStorage.setItem('tr_prot', String(n)); } catch (e) { n = (UI.prot || 0) + 1; }
  UI.prot = n; UI.paperI = n % 3;
}
// carrossel: arrasta com o dedo; na tela inicial troca sozinho a cada 8 s (pausa enquanto o dedo está na tela)
let paperTimer = null, paperHold = 0;
function paperGo(where, i, smooth = true) {
  const tr = document.getElementById('ptrack-' + where); if (!tr) return;
  const n = tr.children.length; if (!n) return;
  i = ((i % n) + n) % n; UI.paperI = i;
  tr.scrollTo({ left: tr.clientWidth * i, behavior: smooth ? 'smooth' : 'auto' });
  document.querySelectorAll(`.pdots [data-w="${where}"]`).forEach((b, j) => b.classList.toggle('on', j === i));
}
function paperSetup() {
  for (const tr of document.querySelectorAll('.ptrack')) {
    if (tr.dataset.ok) continue; tr.dataset.ok = 1;
    const where = tr.id.slice(7);
    if (UI.paperI) { paperGo(where, UI.paperI, false); requestAnimationFrame(() => paperGo(where, UI.paperI, false)); }
    let st = null, ready = false; setTimeout(() => { ready = true; }, 300);
    tr.addEventListener('scroll', () => { if (!ready) return; const i = Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth)); UI.paperI = i; clearTimeout(st); st = setTimeout(() => { document.querySelectorAll(`.pdots [data-w="${where}"]`).forEach((b, j) => b.classList.toggle('on', j === i)); }, 60); }, { passive: true });
    tr.addEventListener('pointerdown', () => { paperHold = Date.now() + 120000; }, { passive: true });
    tr.addEventListener('touchstart', () => { paperHold = Date.now() + 120000; }, { passive: true });
  }
  clearInterval(paperTimer);
  if (document.getElementById('ptrack-home')) paperTimer = setInterval(() => {
    if (!document.getElementById('ptrack-home')) { clearInterval(paperTimer); return; }
    if (Date.now() < paperHold || UI.modal) return;
    paperGo('home', (UI.paperI || 0) + 1);
  }, 8000);
}
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-act="paperdot"]'); if (!b) return;
  ev.stopPropagation(); paperHold = Date.now() + 15000; paperGo(b.dataset.w, +b.dataset.i);
}, true);
new MutationObserver(() => { if (document.querySelector('.ptrack:not([data-ok])')) paperSetup(); }).observe(document.documentElement, { childList: true, subtree: true });

// ---------- convocação da Seleção (consultável) ----------
function callupModal(m) {
  const all = S.selecao || [];
  if (!all.length) return `<h2 class="sech big">${ic('user')} Data FIFA</h2><div class="note">Ainda não houve convocação nesta liga. Ela sai nas Datas FIFA.</div>`;
  const cur = all.find(c => c.key === m.key) || all[0], view0 = m.v || 'liga';
  const tabs = all.length > 1 ? `<div class="chips">${all.map(c => `<button class="chip ${c.key === cur.key ? 'on' : ''}" data-act="callupk" data-c="${esc(c.key)}">${c.season} · jogo ${c.k + 1}</button>`).join('')}</div>` : '';
  const vtabs = `<div class="seg" style="margin:4px 0 10px"><button class="${view0 === 'liga' ? 'on' : ''}" data-act="callupv" data-v="liga">Da liga</button><button class="${view0 === 'bra' ? 'on' : ''}" data-act="callupv" data-v="bra">Seleção completa</button></div>`;
  const tag = c => Wd.isHuman(S, c) ? ' · <b style="color:var(--lime)">treinador</b>' : '';
  const row = (id, c, extra) => `<div class="cuprow">${av(id)}<span class="grow"><button class="pl" data-act="player" data-id="${id}">${esc(P[id].name)}</button><span class="small muted">${esc(C.POS_NAME[P[id].pos] || P[id].pos)} · ${esc(c)}${tag(c)}${extra || ''}</span></span><b class="num">${(S.ps[id] || {}).ovr || P[id].ovr0}</b></div>`;
  let body = '';
  if (view0 === 'bra') {
    const groups = [...new Set(cur.list.map(x => x.g))];
    body = groups.map(g => `<div class="tile tight"><div class="eyebrow">${esc(g)} (${cur.list.filter(x => x.g === g).length})</div>${cur.list.filter(x => x.g === g).map(x => row(x.id, x.c)).join('')}</div>`).join('');
  } else {
    const inBR = c => !!Wd.divOf(S, c);
    const br = cur.list.filter(x => inBR(x.c));
    // A lista é o registro da convocação, não um retrato dos desfalques atuais.
    const ext = cur.ext || [];
    const nats = [...new Set(ext.map(x => x.nat))].sort();
    const divTag = c => { const d = Wd.divOf(S, c); return d ? ` · Série ${d}` : ''; };
    body = `<div class="tile tight"><div class="eyebrow">${flag('BRA')} Brasileiros · Seleção Brasileira (${br.length})</div>${br.length ? br.map(x => row(x.id, x.c, divTag(x.c))).join('') : '<p class="small muted" style="margin:0">Nenhum convocado de clube brasileiro.</p>'}</div>
      <div class="tile tight"><div class="eyebrow">${ic('user')} Estrangeiros que jogam no Brasil (${ext.length})</div>${ext.length ? nats.map(n => `<div class="small" style="margin:8px 0 2px;font-weight:800">${flag(n)} ${esc(n)}</div>${ext.filter(x => x.nat === n).map(x => row(x.id, x.c, divTag(x.c))).join('')}`).join('') : '<p class="small muted" style="margin:0">Nenhum estrangeiro convocado.</p>'}</div>
      <p class="small muted" style="margin:0">${br.length + ext.length} jogadores das Séries A, B e C desfalcam seus clubes nos 2 jogos da Data FIFA.</p>`;
  }
  return `<div class="cuphead"><span class="cupflag">${flag('BRA')}</span><div><div class="eyebrow" style="margin:0">Data FIFA · temporada ${cur.season} · jogo ${cur.k + 1}</div><h2 class="disp" style="font-size:28px;margin:0">Convocados</h2></div></div>
    ${tabs}${vtabs}${body}`;
}
// ---------- ingressos ----------
function ticketsModal() {
  const lv = S.ticket || 'normal', st = SE.stadium(S, S.club), fan = Wd.clubInfo(S.club).fan || 3;
  const nx = SE.nextFixtureOf(S, S.club), home = nx && !nx.pending && nx.h === S.club;
  const prev = lvl => { if (!home) return null; const keep = S.ticket; S.ticket = lvl; try { return SE.crowd(S, nx, nx.k, nx.comp === 'A' ? 1 : nx.comp === 'B' ? 0.6 : nx.comp === 'C' ? 0.4 : nx.comp === 'CB' ? 1.2 : 1.5, true); } finally { S.ticket = keep; } };
  const opts = [['barato', 'Barato', 'Aproxima a torcida e enche as arquibancadas; cada ingresso rende menos.'], ['normal', 'Normal', 'Equilíbrio entre público e renda.'], ['caro', 'Caro', 'Rende mais por ingresso; a procura tende a ficar mais seletiva.'], ['abusivo', 'Abusivo', 'Valores bem acima do habitual: a recepção costuma ser fria e a diretoria acompanha de perto.']];
  return `<h2 class="sech big">${ic('stadium')} Ingressos</h2>
    <div class="stadium"><b>${esc(st.name)}</b><span>${fmt(st.cap)} lugares</span></div>
    ${home ? `<p class="small muted" style="margin:0">Previsão pro próximo jogo em casa: ${esc(nx.a)} (${esc(SE.COMP_NAME[nx.comp])}).</p>` : `<p class="small muted" style="margin:0">O próximo jogo não é em casa; o preço vale pros jogos no ${esc(st.name)}.</p>`}
    ${home ? demandBox(prev('normal'), st) : ''}
    <div class="stack" style="gap:8px">${opts.map(([k, l, d]) => { const p = prev(k); return `<button class="tkopt ${lv === k ? 'on' : ''}" data-act="ticket" data-k="${k}"><div class="grow"><b>${l} <span class="muted small">≈ R$ ${Math.round((30 + fan * 8) * SE.PRICE[k])}</span></b><span class="small muted">${d}</span></div>${p ? `<div class="tkpv"><b class="num">${fmt(p.att)}</b><span>${Math.round(p.occ * 100)}% · T$ ${fmtK(p.rev)}</span></div>` : ''}</button>`; }).join('')}</div>`;
}
// termômetro de procura: quanto do estádio a torcida quer ocupar a preço normal, e por quê
function demandBox(p, st) {
  if (!p || p.dem == null) return '';
  const pct = Math.round(p.dem * 100), w = Math.min(100, pct / 2), over = pct >= 115, low = pct < 60;
  const tip = over ? `Tem mais gente querendo ingresso do que lugar no ${esc(st.name)}. Cobrar mais caro ainda lota, e casa cheia não gera reclamação.`
    : low ? 'Procura baixa: preço alto esvazia o estádio, e arquibancada vazia tira força do time em casa.'
    : 'Procura normal. Casa cheia empurra o time; estádio vazio tira parte do fator casa.';
  return `<div class="tkdem ${over ? 'hot' : low ? 'cold' : ''}"><div class="tkdh"><span>${ic('flame')} Procura estimada</span><b class="num">${pct}% da capacidade</b></div>
    <div class="tkbar"><i style="width:${w}%"></i><em style="left:50%"></em></div>
    ${p.why && p.why.length ? `<div class="tkwhy">${p.why.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
    <p class="small muted" style="margin:0">${tip}</p></div>`;
}
function gateLine(g) { return g ? `<div class="gateln">${ic('stadium')} <span>${esc(g.st || '')}</span><b class="num">${fmt(g.att)}</b><span>de ${fmt(g.cap)} · ${Math.round(g.occ * 100)}%</span>${g.rev != null ? `<b class="num">T$ ${fmtK(g.rev)}</b>` : ''}</div>` : ''; }
function listingModal() { return ''; }
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  if (a === 'callup') { ev.stopPropagation(); UI.modal = { type: 'callup', key: el.dataset.c || null, back: UI.modal || null }; renderModal(); }
  else if (a === 'callupk') { ev.stopPropagation(); UI.modal.key = el.dataset.c; renderModal(); }
  else if (a === 'callupv') { ev.stopPropagation(); UI.modal.v = el.dataset.v; renderModal(); }
  else if (a === 'ticket') { ev.stopPropagation(); const from = S.ticket || 'normal', to = el.dataset.k; if (from !== to) { S.flags = S.flags || {}; const was = S.flags.tkChg ? S.flags.tkChg.from : from; if (was === to) delete S.flags.tkChg; else S.flags.tkChg = { from: was, to }; } S.ticket = to; save(); renderModal(); toast(`Nova política de ingressos: ${TK_NAME[to] || to}`); }
}, true);

// ===== UI parte 10: fim de temporada, premiação, arquivo de temporadas, perfil permanente =====

// ---------- perfil permanente do treinador (acompanha o jogador entre temporadas, clubes e ligas) ----------
const LS_PROFILE = 'treineiros:perfil';
function profGet() { try { const p = JSON.parse(localStorage.getItem(LS_PROFILE)); if (p && p.leagues) return p; } catch (e) {} return { leagues: {} }; }
function profSave(p) { try { localStorage.setItem(LS_PROFILE, JSON.stringify(p)); } catch (e) {} if (NET.saveProfile) NET.saveProfile(p); }
function careerSnap(d) {
  const K = coachCareer(d), t = K.tot, b = d.badges || [];
  return { j: t.j, v: t.v, e: t.e, d: t.d, gp: t.gp, gc: t.gc, titles: b.filter(x => x.kind === 'trophy').length, awards: b.filter(x => x.kind === 'award').length,
    objs: b.filter(x => x.kind === 'obj').length, seasons: Object.keys(K.seasons).length, clubs: Object.keys(K.clubs) };
}
function profTotals(p, exclude) {
  const o = { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, titles: 0, awards: 0, objs: 0, seasons: 0, leagues: 0, clubs: [] };
  for (const [k, x] of Object.entries(p.leagues || {})) {
    if (k === exclude) continue;
    for (const f of ['j', 'v', 'e', 'd', 'gp', 'gc', 'titles', 'awards', 'objs', 'seasons']) o[f] += x[f] || 0;
    o.leagues++; for (const c of x.clubs || []) if (!o.clubs.includes(c)) o.clubs.push(c);
  }
  return o;
}
let profAt = 0;
function profUpdate(force) {
  if (!S || !S.desks || !S.desks[S.__me] || (!force && Date.now() - profAt < 20000)) return;
  profAt = Date.now();
  const key = NET.online ? NET.code : 'local'; if (!key) return;
  const p = profGet(), d = S.desks[S.__me];
  const snap = { ...careerSnap(d), name: S.league ? S.league.name : 'Carreira offline', mode: S.mode || 'normal', club: d.unemployed ? null : d.club, season: S.season };
  const old = p.leagues[key];
  if (!old || JSON.stringify({ ...old, at: 0 }) !== JSON.stringify({ ...snap, at: 0 }) || p.name !== d.manager) {
    p.leagues[key] = { ...snap, at: Date.now() }; p.name = d.manager; p.avatar = d.avatar; p.since = p.since || Date.now();
    profSave(p);
  }
  const oth = profTotals(p, key);
  if (JSON.stringify(d.prof || null) !== JSON.stringify(oth)) { d.prof = oth; save(); }
}
// carreira geral = esta liga + o que o perfil trouxe das outras ligas/carreiras
function generalCareer(d) {
  const here = careerSnap(d), o = d.prof || {};
  const g = { ...here };
  for (const f of ['j', 'v', 'e', 'd', 'gp', 'gc', 'titles', 'awards', 'objs', 'seasons']) g[f] = (here[f] || 0) + (o[f] || 0);
  g.leagues = 1 + (o.leagues || 0); g.clubs = [...new Set([...(here.clubs || []), ...(o.clubs || [])])];
  return g;
}
const aprov = x => x.j ? Math.round((x.v * 3 + x.e) / (x.j * 3) * 100) : 0;
function profileStrip() {
  const p = profGet(), t = profTotals(p, null);
  if (!t.leagues) return '';
  return `<div class="profstrip">${ic('user')}<span><b>Seu perfil de treinador</b><small>${t.j} jogos · ${t.titles} título(s) · ${aprov(t)}% de aproveitamento · ${t.leagues} liga(s)</small></span></div>`;
}

// ---------- fim de temporada na tela principal ----------
const PH_TXT = { final: 'Temporada encerrada', enc: 'Encerramento da temporada', prem: 'Dia da Premiação', livre: 'Último dia livre' };
// v209: quadro da Copa Intercontinental (fim de temporada)
function intBox(compact) {
  const Pp = S.post, I = Pp && S.comp && S.comp.INT && S.comp.INT.season === Pp.season ? S.comp.INT : null;
  if (I && compact) { const i = I.games.findIndex(g => !g.win && !g.skip), g = I.games[i], h = g && (g.h || (i && I.games[i - 1].win) || 'a definir');
    return `<button class="pill" style="display:block;white-space:normal;text-align:left;margin-top:6px;line-height:1.35" data-act="tblgo" data-comp="INT">${ic('trophy')} ${I.champ ? `Intercontinental: <b>${esc(I.champ)}</b> campeão` : `Intercontinental${I.one ? '' : ` · ${SE.INT_NAME[g.k]}`}: <b>${esc(h)} × ${esc(g.a)}</b> · ${when(g.t)}`}</button>`; }
  return I ? `<div class="intbox"><div class="row between"><b class="disp" style="font-size:18px">${ic('trophy')} Copa Intercontinental</b>${I.champ ? `<span class="pill">${esc(I.champ)} campeão</span>` : ''}</div>
    ${I.games.map((g, i) => { const h = g.h || (i && I.games[i - 1].win) || 'a definir'; return `<div class="ir"><b>${I.one ? 'Jogo único' : SE.INT_NAME[g.k]}</b><span>${esc(h)} ${g.win ? `${g.gh}–${g.ga}${g.pens ? ` (${g.pens[0]}–${g.pens[1]} pên)` : ''}` : '×'} ${esc(g.a)}</span><small>${g.win ? 'encerrado' : when(g.t)}</small></div>`; }).join('')}
    <button class="btn sm alt" data-act="tblgo" data-comp="INT">Ver a chave</button></div>` : '';
}
function postHero(test) {
  const Pp = S.post; if (!Pp) return '';
  const ph = SE.postPhase(S), h = S.history.find(x => x.season === Pp.season) || {};
  const nextT = d => when(SE.postStart ? SE.postStart(S, d) : SE.sportDayStart(S, Pp.d0 + d));   // v280: Premiação depois da Intercontinental
  const champs = [['INT', 'Intercontinental', h.INT], ['A', 'Série A', h.A], ['CB', 'Copa do Brasil', h.CB], ['LIB', 'Libertadores', h.LIB], ['B', 'Série B', h.B]].filter(x => x[2]);
  const my = S.hist && S.hist.find(x => x.season === Pp.season);
  const steps = ['final', 'enc', 'prem', 'livre'].map((k, i) => `<i class="${k === ph ? 'on' : ['final', 'enc', 'prem', 'livre'].indexOf(ph) > i ? 'done' : ''}"><b>${['Apito final', 'Balanço', 'Premiação', 'Dia livre'][i]}</b></i>`).join('');
  let action = '';
  if (ph === 'final' || ph === 'enc') action = `<p class="small" style="margin:0;opacity:.85">${ic('trophy')} Dia da Premiação: ${nextT(2)}</p>`;
  if (ph === 'prem' || ph === 'livre') action += `<button class="btn big" data-act="awards">${ic('trophy')} ${ph === 'prem' ? 'Assistir à cerimônia' : 'Rever a premiação'}</button>`;
  if (ph === 'livre') {
    const r = SE.readyInfo(S), mine = S.ready === S.season, adm = NET.online ? NET.isAdmin() : true;
    action += `<div class="nsbox"><div class="row between"><b class="disp" style="font-size:22px">Nova Temporada ${S.season + 1}</b><span class="pill">${r.ok}/${r.n} prontos</span></div>
      <div class="nsbar">${Array.from({ length: r.n }, (_, i) => `<i class="${i < r.ok ? 'on' : ''} ${i === r.need - 1 ? 'goal' : ''}"></i>`).join('')}</div>
      <p class="small" style="margin:0;opacity:.8">Começa quando a maioria confirmar (${r.need} de ${r.n}). Nada se perde: a temporada ${Pp.season} fica guardada em Torneios.</p>
      ${SE.intPending && SE.intPending(S) ? `<p class="small" style="margin:0;color:var(--yellow)">${ic('trophy')} A nova temporada só começa depois da Copa Intercontinental (${when(SE.intNextT(S))}). Pode confirmar agora: ela vira logo depois do jogo.</p>` : ''}
      ${mine ? `<div class="row"><span class="pill lime grow">${ic('handshake')} Você está pronto · aguardando os outros</span><button class="btn sm alt" data-act="nscancel">Desfazer</button></div>` : `<button class="btn big lime" data-act="nsready">${ic('arrowR')} NOVA TEMPORADA</button>`}
      ${adm && r.n > 1 ? `<button class="link small" data-act="nsforce">ADM: iniciar agora sem esperar</button>` : ''}</div>`;
  } else action += `<p class="small" style="margin:0;opacity:.75">${ic('cal')} Último dia livre e botão NOVA TEMPORADA: ${nextT(3)}</p>`;
  const intB = intBox();
  return `<div class="hero posth ph-${ph}"><div class="row between"><span class="compb">${ic('cal')} ${PH_TXT[ph]} · ${Pp.season}</span>${SE.isTurbo(S) ? `<span class="turbob">${ic('bolt')}TURBO</span>` : ''}</div>
    <div class="phsteps">${steps}</div>
    <div class="champs">${champs.map(([k, l, c]) => `<button class="chm cmp-${k}" data-act="club" data-club="${esc(c)}">${crest(c, 'md')}<span><small>${l}</small><b>${esc(c)}</b></span></button>`).join('')}</div>
    <div class="kv small"><span>Caíram</span><b>${Pp.down.map(esc).join(', ')}</b><span>Subiram</span><b>${Pp.up.map(esc).join(', ')}</b>${my ? `<span>Sua campanha</span><b>${my.pos}º na Série ${my.div} · ${esc(my.club)}</b>` : ''}</div>
    ${intB ? `<div style="margin-top:10px">${intB}</div>` : ''}
    <div class="stack" style="gap:8px;margin-top:10px">${action}</div>
    <div class="row" style="margin-top:10px;gap:6px"><button class="btn sm alt" style="flex:1" data-act="goto" data-v="comps" data-sub="A">Tabela final</button><button class="btn sm alt" style="flex:1" data-act="modal" data-m="finance">Finanças</button><button class="btn sm alt" style="flex:1" data-act="modal" data-m="career">Carreira</button></div>${ph !== 'livre' ? (test || '').replace('Avançar rodada (ADM)', 'Avançar dia (ADM)') : ''}</div>`;
}

// ---------- cerimônia de premiação ----------
// v270: noite de gala — começa pela Série C, sobe até a Série A e termina na Bola de Ouro; cada prêmio mostra 3 finalistas,
// suspense e a revelação. Temporadas antigas (sem finalistas) vão direto pro vencedor.
const AW_BASE = [['xi', 'Seleção da Temporada', 'tactic'], ['gol', 'Luva de Ouro', 'glove'], ['gar', 'Garçom de Ouro', 'arrowR'], ['art', 'Chuteira de Ouro', 'ball'], ['tec', 'Prancheta de Ouro', 'user'], ['cra', 'Bola de Ouro', 'star']];
const AW_ORDER = [...['C', 'B'].flatMap(sx => AW_BASE.filter(a => a[0] === 'xi' || a[0] === 'tec').map(([k, l, i]) => [k + sx, `${l} · Série ${sx}`, i])), ['rev', 'Revelação do Ano', 'sprout'], ...AW_BASE];   // v272: B e C só Seleção e Prancheta
const AW_WHY = { cra: 'Nota média no campeonato, mais gols e assistências.', gar: 'Mais assistências no campeonato.', art: 'Mais gols no campeonato.', gol: 'Menos gols sofridos por jogo e mais jogos sem sofrer gol.', tec: 'Campanha acima do que o elenco prometia, mais títulos.', xi: 'As melhores notas médias de cada setor (4-3-3).', rev: 'Até 21 anos: números no campeonato, quanto evoluiu na temporada, minutos em campo e o nível da série.' };
const awIs = (k, base) => k.replace(/[BC]$/, '') === base;
function awardsOf(season) {
  if (S.post && S.post.season === season) return S.post.awards || {};
  const ar = S.archive && S.archive[season]; if (ar && ar.awards) return ar.awards;
  const h = S.history.find(x => x.season === season); return (h && h.awards) || {};
}
function xiPitch(xi) {
  const rows = { ATA: [], MEI: [], DEF: [], GOL: [] };
  for (const x of xi) (rows[x.set] || rows.MEI).push(x);
  return `<div class="xipitch">${['ATA', 'MEI', 'DEF', 'GOL'].map(k => `<div class="xir">${rows[k].map((x, i) => `<button class="xip" data-act="player" data-id="${x.id}" style="--d:${(i + (k === 'ATA' ? 0 : k === 'MEI' ? 3 : k === 'DEF' ? 6 : 10)) * 90}ms">${av(x.id)}<b>${esc(P[x.id].short)}</b><small>${crest(x.club, 'xs')} ${x.rt.toFixed(1)}</small></button>`).join('')}</div>`).join('')}</div>`;
}
const awLabel = key => (AW_ORDER.find(a => a[0] === key) || [key, key, 'trophy'])[1];
const awIcon = key => (AW_ORDER.find(a => a[0] === key) || [key, key, 'trophy'])[2];
const awMine = club => !!(club && S.desks && Object.values(S.desks).some(d => d && d.club === club && !d.unemployed));
// bola dourada (desenho do jogo, nada oficial)
const awBall = () => `<div class="awball" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><radialGradient id="awg" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF6C2"/><stop offset=".45" stop-color="#F2C744"/><stop offset="1" stop-color="#8A5A12"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#awg)"/><g fill="none" stroke="#7A4E0E" stroke-width="2.4" stroke-linejoin="round" opacity=".75"><path d="M50 30l15 11-6 18H41l-6-18z"/><path d="M50 30V8M65 41l20-8M59 59l13 18M41 59L28 77M35 41l-20-8"/></g><ellipse cx="36" cy="28" rx="13" ry="7" fill="#fff" opacity=".45" transform="rotate(-30 36 28)"/></svg></div>`;
function awWho(key, x) {
  if (awIs(key, 'tec') || x.coach) { const d = x.tok && S.desks[x.tok];
    return { ph: d ? coachImg(d.avatar, x.club) : `<span class="awcoach">${ic('user')}</span>`, name: esc(x.coach || 'Treinador'), sub: `${crest(x.club, 'sm')} ${esc(x.club)}${d ? ' · treinador da liga' : ''}` }; }
  return { ph: x.id != null && P[x.id] ? `<img class="spr" src="${sprite(x.id)}" alt="">` : '', name: x.id != null && P[x.id] ? plink(x.id, P[x.id].name) : '—', sub: `${crest(x.club, 'sm')} ${esc(x.club || '')}` };
}
function awardCard(key, aw, season) {
  const x = aw[key]; if (!x) return `<p class="muted">Sem vencedor nesta categoria.</p>`;
  const label = awLabel(key), icon = awIcon(key), gold = key === 'cra';
  let who = '';
  if (awIs(key, 'xi')) who = xiPitch(x.xi || []);
  else { const w = awWho(key, x); who = `${gold ? awBall() : ''}<div class="awph">${w.ph}</div><h3 class="awname disp">${w.name}</h3><div class="awclub">${w.sub}</div>`; }
  const mine = awMine(x.club) ? `<div class="awmine">${ic('handshake')} da sua liga</div>` : '';
  const pod = (x.fin || []).length > 1 ? `<div class="awpod">${x.fin.slice(1, 3).map((f, n) => `<div class="awpr"><b>${n + 2}º</b><span>${f.coach ? esc(f.coach) : f.id != null && P[f.id] ? esc(P[f.id].short) : '—'}</span><small>${crest(f.club, 'xs')} ${esc(f.value || '')}</small></div>`).join('')}</div>` : '';
  return `<div class="awcard ${gold ? 'gold' : ''}" data-k="${key}"><div class="awrays"></div><div class="confetti">${Array.from({ length: gold ? 30 : 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.18}s;--c:${['var(--lime)', 'var(--yellow)', 'var(--pink)', 'var(--blue)', 'var(--coral)', '#fff'][i % 6]}"></i>`).join('')}</div>
    <div class="awcat">${ic(icon)} ${esc(label)} ${season}</div>${who}
    <div class="awval">${esc(x.value || '')}</div>${x.line ? `<div class="awline">${esc(x.line)}</div>` : ''}${mine}${pod}</div>`;
}
// finalistas em ordem alfabética (a ordem não entrega o vencedor)
function awNoms(key, x, sus) {
  const L = (x.fin || []).slice(0, 3).map(f => ({ f, nm: f.coach || (f.id != null && P[f.id] ? P[f.id].name : '') })).sort((a, b) => a.nm.localeCompare(b.nm, 'pt-BR'));
  return `<div class="awnoms ${sus ? 'sus' : ''}">${L.map(({ f }, n) => { const w = awWho(key, f); return `<div class="awnom" style="--d:${n * 160}ms"><div class="awnph">${w.ph}</div><b>${w.name}</b><small>${w.sub}</small><span>${esc(f.value || '')}</span>${awMine(f.club) ? `<em>${ic('handshake')} da sua liga</em>` : ''}</div>`; }).join('')}</div>`;
}
function awardsModal(m) {
  const season = m.season || (S.post ? S.post.season : (S.history[0] || {}).season), aw = m.prev || awardsOf(season);   // v270: m.prev = prévia (teste)
  const keys = AW_ORDER.map(a => a[0]).filter(k => aw[k]);
  if (!keys.length) return `<h2 class="sech big">${ic('trophy')} Premiação</h2><p class="muted">Ainda não há prêmios desta temporada.</p>`;
  const i = Math.max(0, Math.min(m.i || 0, keys.length));
  if (i >= keys.length) return `<h2 class="sech big">${ic('trophy')} Premiação ${season}</h2><div class="awlist">${keys.map((k, j) => `<button class="awrow" data-act="awgo" data-i="${j}"><span>${ic(awIcon(k))}</span><span class="grow"><small>${esc(awLabel(k))}</small><b>${awIs(k, 'xi') ? 'ver o time' : awIs(k, 'tec') ? esc(aw[k].coach) : aw[k].id != null && P[aw[k].id] ? esc(P[aw[k].id].name) : '—'}</b></span>${awIs(k, 'xi') ? '' : crest(aw[k].club, 'sm')}</button>`).join('')}</div>`;
  const key = keys[i], x = aw[key], hasFin = !awIs(key, 'xi') && (x.fin || []).length > 1;
  const st = hasFin ? (m.st || 'nom') : 'win';
  const curt = m.curtI !== i ? `<div class="awcurt" aria-hidden="true"><i class="l"></i><i class="r"></i><b>${ic(awIcon(key))}<span class="disp">${esc(awLabel(key))}</span><small>${m.prev ? 'prévia' : season}</small></b></div>` : '';   // v272: abertura de cortinas
  m.curtI = i;
  const head = `<div class="awtop"><span class="eyebrow" style="margin:0">${ic('trophy')} ${m.prev ? 'Prévia · se a temporada acabasse hoje' : `Premiação da temporada ${season}`}</span><span class="small muted">${i + 1}/${keys.length}</span></div>`;
  const skip = `<button class="link small awskip" data-act="awgo" data-i="${keys.length}">pular a cerimônia</button>`;
  if (st === 'nom' || st === 'sus') return `<div class="awstage ${key === 'cra' ? 'gala' : ''}" key="${i}-${st}">${curt}${head}
    <div class="awcatn">${ic(awIcon(key))} ${esc(awLabel(key))}</div><p class="small muted awwhy">${esc(AW_WHY[key.replace(/[BC]$/, '')] || '')}</p>
    <div class="eyebrow" style="margin:6px 0 0">Os finalistas</div>${awNoms(key, x, st === 'sus')}
    ${st === 'sus' ? `<div class="awdrum">E o prêmio vai para<span class="dots3"><i></i><i></i><i></i></span></div>` : `<button class="btn big" style="width:100%;margin-top:12px" data-act="awrev">${ic('trophy')} Revelar o vencedor</button>`}
    ${skip}</div>`;
  return `<div class="awstage ${key === 'cra' ? 'gala' : ''}" key="${i}">${curt}${head}
    ${awardCard(key, aw, season)}
    <div class="row" style="margin-top:12px"><button class="btn big" style="flex:1" data-act="awgo" data-i="${i + 1}">${i + 1 < keys.length ? 'Próximo prêmio' : 'Ver todos'} ${ic('arrowR')}</button></div>${i + 1 < keys.length ? skip : ''}</div>`;
}

// ---------- Torneios: seletor de temporada e arquivo ----------
function seasonChips() {
  const past = Object.keys(S.archive || {}).map(Number).sort((a, b) => b - a);
  if (!past.length) return '';
  const cur = UI.cseason || S.season;
  return `<div class="chips seasonchips">${[S.season, ...past].map(y => `<button class="chip ${cur === y ? 'on' : ''}" data-act="cseason" data-y="${y}">${y}${y === S.season && !S.post ? ' · atual' : ''}</button>`).join('')}</div>`;
}
// roda uma função de render com os dados da temporada arquivada no lugar dos atuais
function withArchive(season, fn) {
  const ar = S.archive && S.archive[season]; if (!ar) return fn();
  const keep = { comp: S.comp, played: S.played, divA: S.divA, divB: S.divB, divC: S.divC, slot: S.slot, qual: S.qual, season: S.season, seasonStart: S.seasonStart };
  S.season = season; if (ar.seasonStart) S.seasonStart = ar.seasonStart;
  S.comp = ar.comp; S.played = {}; for (const k in ar.played) S.played[k] = ar.played[k];
  S.divA = ar.divA; S.divB = ar.divB; S.divC = ar.divC || []; S.slot = SE.SLOTS; S.qual = ar.qual || S.qual; UI.archView = ar;
  try { return fn(); } finally { Object.assign(S, keep); UI.archView = null; }
}
function archTop(div) {
  const ar = UI.archView; if (!ar || !ar.top || !ar.top[div]) return '';
  const rk = list => list.map(([id, c, v], i) => `<div class="rk"><span class="muted num">${i + 1}</span><span class="rkc">${crest(c, 'sm')}</span><span class="rkn">${plink(id, P[id].name)}</span><b class="num">${v}</b></div>`).join('');
  return `${ar.top[div].g.length ? `<div class="tile"><div class="eyebrow">${ic('ball')} Artilharia</div>${rk(ar.top[div].g)}</div>` : ''}${ar.top[div].a.length ? `<div class="tile"><div class="eyebrow">${ic('arrowR')} Assistências</div>${rk(ar.top[div].a)}</div>` : ''}`;
}
function awardsTile(season) {
  const aw = awardsOf(season), keys = AW_ORDER.map(a => a[0]).filter(k => aw[k]);
  if (!keys.length) return `<div class="tile"><p class="muted" style="margin:0">Os prêmios saem no Dia da Premiação.</p></div>`;
  return `<div class="tile"><div class="row between"><div class="eyebrow" style="margin:0">${ic('trophy')} Premiação ${season}</div><button class="btn sm" data-act="awards" data-y="${season}">Cerimônia</button></div>
    <div class="awlist" style="margin-top:8px">${keys.filter(k => !awIs(k, 'xi')).map(k => `<div class="awrow"><span>${ic(awIcon(k))}</span><span class="grow"><small>${esc(awLabel(k))}</small><b>${awIs(k, 'tec') ? esc(aw[k].coach) : plink(aw[k].id, P[aw[k].id].name)}</b><em>${crest(aw[k].club, 'xs')} ${esc(aw[k].club)} · ${esc(aw[k].value)}</em></span></div>`).join('')}</div>
    ${['xi', 'xiB', 'xiC'].filter(k => aw[k]).map(k => `<div class="eyebrow" style="margin-top:12px">${esc(awLabel(k))}</div>${xiPitch(aw[k].xi)}`).join('')}</div>`;
}
const awardsShown = season => !(S.post && S.post.season === season && ['final', 'enc'].includes(SE.postPhase(S)));


// ---------- ações ----------
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  const stop = () => ev.stopImmediatePropagation();
  if (a === 'awards') { stop(); UI.modal = { type: 'awards', i: 0, season: el.dataset.y ? +el.dataset.y : null, back: UI.modal || null }; renderModal(); }
  else if (a === 'awgo') { stop(); if (!UI.modal) return; UI.modal.i = +el.dataset.i; UI.modal.st = null; renderModal(); }
  else if (a === 'awprev') { stop();   // v270: prévia da cerimônia com os números de agora (só no ambiente de teste); calcula numa cópia, sem mexer na liga
    let aw = null; try { const C2 = JSON.parse(JSON.stringify(S)); aw = EV.awards(C2, true); } catch (e) { try { console.error('awprev', e); } catch (e2) {} }
    if (!aw || !Object.keys(aw).length) { toast('Ainda não há jogos suficientes pra uma prévia.', true); return; }
    UI.modal = { type: 'awards', i: 0, season: S.season, prev: aw }; renderModal(); }
  else if (a === 'awrev') { stop(); const m = UI.modal; if (!m || m.type !== 'awards') return; m.st = 'sus'; renderModal(); try { SFX.flip(); } catch (e) {}
    setTimeout(() => { if (UI.modal !== m || m.st !== 'sus') return; m.st = 'win'; renderModal(); try { SFX.star(); } catch (e) {} }, 1900); }
  else if (a === 'cseason') { stop(); UI.cseason = +el.dataset.y === S.season ? null : +el.dataset.y; if (UI.cseason && ['bets', 'cal'].includes(UI.sub.comps)) UI.sub.comps = 'A'; UI.rd = {}; render(); }
  else if (a === 'nsready' || a === 'nscancel' || a === 'nsforce') {
    stop();
    if (!S.post) return;
    if (a === 'nsready') S.ready = S.season;
    else if (a === 'nscancel') S.ready = null;
    else { S.forceNext = S.season; S.ready = S.season; }
    save();
    if (NET.online) { toast(a === 'nscancel' ? 'Voto retirado.' : 'Pronto! Aguardando a maioria…'); setTimeout(() => NET.nudge(true), 2500); setTimeout(() => NET.nudge(true), 9000); }
    else { SE.process(S); save(); if (!S.post) toast(`Começa a temporada ${S.season}!`); }
    render();
  }
}, true);

// ===== UI parte 11: card principal = agenda navegável, histórico de transferências =====

// ---------- agenda ----------
const MES3 = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const DIA3 = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const realT = t => shiftedClock() ? SE.toReal(S, t) : t;
function hhmm(t) { const d = new Date(realT(t)); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
function agendaEvents() {
  const club = S.club, ev = [], Pp = S.prep && S.prep.season === S.season ? S.prep : null;
  const now = tNow();
  // pré-temporada
  if (Pp) {
    ev.push({ key: 'pre0', t: Pp.t0, kind: 'info', tag: 'PRÉ-TEMPORADA', icon: 'dumbbell', title: 'Começa a pré-temporada', text: `${SE.isTurbo(S) ? '4 horas' : '16 horas'} para montar o elenco: janela de transferências aberta, 3 amistosos e tempo para ajustar tática, banco e DM.` });
    Pp.fr.forEach((t, i) => { const r = S.prepRes && S.prepRes.season === S.season && S.prepRes.list[i]; ev.push({ key: 'prefr' + i, t, kind: 'pre', i, res: r || null, done: Pp.done[i] }); });
  }
  // janelas
  const [b1, b2, b3] = SE.WIN_K.map(k => SE.slotTime(S, k));
  if (Pp) ev.push({ key: 'w0', t: Pp.t0 + 1, kind: 'info', tag: 'MERCADO', icon: 'handshake', title: 'Janela de transferências abre', text: 'Clubes já podem registrar novos jogadores: comprar, vender, emprestar e contratar livres.' });
  ev.push({ key: 'w1', t: b1 - 1, kind: 'info', tag: 'MERCADO', icon: 'lock', title: 'Janela principal fecha', text: 'Fim da montagem do elenco. Acordos fechados depois disso só se apresentam na próxima janela.' });
  ev.push({ key: 'w2', t: b2 - 1, kind: 'info', tag: 'MERCADO', icon: 'handshake', title: 'Janela de ajustes abre', text: 'Janela curta no meio da temporada para reforços pontuais.' });
  ev.push({ key: 'w3', t: b3 - 1, kind: 'info', tag: 'MERCADO', icon: 'lock', title: 'Mercado fecha para a reta final', text: 'Elencos definidos até o fim da temporada.' });
  // Data FIFA e sorteio continental
  for (const k of SE.CALLUPS) if (!SE.callDone(S, k)) ev.push({ key: 'fifa' + k, t: k > 0 ? SE.slotTime(S, k - 1) + 60000 : SE.slotTime(S, k) - 60000, kind: 'info', tag: 'SELEÇÃO', icon: 'user', title: 'Data FIFA: convocação da Seleção', text: 'A lista sai logo depois do jogo anterior. Os convocados desfalcam os clubes nas duas rodadas de liga seguintes, sem afetar as copas.' });
  const kC = SE.CAL.find(c => c.type === 'C').k;
  ev.push({ key: 'draw', comp: 'LIB', t: Math.max(SE.slotTime(S, kC - 1) + 60000, SE.tOfFd(S, SE.fdOfSlot(kC) - 1) + 60000), kind: 'info', tag: 'SORTEIO', icon: 'trophy', title: 'Sorteio dos grupos da Libertadores', text: 'Libertadores, Sul-Americana e Conferência definem seus grupos depois da pré-Libertadores.' });
  // sorteios da Copa do Brasil: depois de cada fase
  SE.CAL.filter(c => c.type === 'CB' && c.md >= 2 && c.md <= 5).forEach(c => { const prev = SE.CAL.find(x => x.type === 'CB' && x.md === c.md - 1); ev.push({ key: 'cbdraw' + c.md, comp: 'CB', t: SE.slotTime(S, prev.k) + 30 * 60000, kind: 'info', tag: 'SORTEIO', icon: 'trophy', title: `Sorteio da Copa do Brasil: ${SE.CB_STAGES[c.md - 1]}`, text: 'Confrontos em jogo único, com pênaltis em caso de empate.', k: prev.k }); });
  // jogos do clube
  const sched = SE.clubSchedule(S, club);
  for (const x of sched) ev.push({ key: 'k' + x.k, t: x.t, kind: 'match', x });
  // rodadas da Copa do Brasil em que o clube não joga: card da rodada (senão o dia fica parecendo vazio)
  try {
    const mine = new Set(sched.map(x => x.k));
    SE.CAL.filter(c => c.type === 'CB' && !mine.has(c.k)).forEach(c => {
      const rd = S.comp.CB && S.comp.CB.rounds[Math.min(c.md, 5) - 1]; if (!rd || !rd.length) return;
      const inCup = S.comp.CB.teams && S.comp.CB.teams.includes(club);
      ev.push({ key: 'cbr' + c.k, comp: 'CB', t: SE.slotTime(S, c.k), gk: c.k, kind: 'info', tag: 'RODADA', icon: 'trophy', title: `Copa do Brasil: ${SE.CB_STAGES[c.md - 1]}`, text: `${rd.length} ${rd.length > 1 ? 'jogos' : 'jogo'} nesta fase. O ${club} ${inCup ? 'já está fora da Copa' : 'não disputa a Copa nesta temporada'}.`, cbTab: 1 });
    });
  } catch (e) {}
  try { dailyEvents(ev, sched, now); } catch (e) {}
  // fim de temporada
  const d0 = SE.dayAbs(S, SE.slotTime(S, SE.SLOTS - 1));
  ev.push({ key: 'post0', t: SE.slotTime(S, SE.SLOTS - 1) + 5 * 60000, kind: 'post', ph: 'final', tag: 'FIM DE TEMPORADA', icon: 'whistle', title: 'Apito final da temporada', text: 'Tabelas finais, campeões, rebaixados e classificados.' });
  ev.push({ key: 'post1', t: SE.sportDayStart(S, d0 + 1), kind: 'post', ph: 'enc', tag: 'ENCERRAMENTO', icon: 'news', title: 'Encerramento da temporada', text: 'Balanço do ano, aposentadorias e contratos que vencem.' });
  ev.push({ key: 'post2', t: SE.postStart ? SE.postStart(S, 2) : SE.sportDayStart(S, d0 + 2), kind: 'post', ph: 'prem', tag: 'PREMIAÇÃO', icon: 'trophy', title: 'Dia da Premiação', text: 'Noite de gala: Bola de Ouro, Revelação do Ano e os outros prêmios das Séries C, B e A.' });
  ev.push({ key: 'post3', t: SE.postStart ? SE.postStart(S, 3) : SE.sportDayStart(S, d0 + 3), kind: 'post', ph: 'livre', tag: 'DIA LIVRE', icon: 'cal', title: 'Último dia da temporada', text: 'Consulte tudo e aperte NOVA TEMPORADA quando estiver pronto.' });
  // v209: Copa Intercontinental (nos dias de encerramento)
  try { const I = S.comp.INT; if (I && S.post && I.season === S.post.season) I.games.forEach((g, i) => { const h = g.h || (i && I.games[i - 1].win) || null, mine = h === club || g.a === club;
    ev.push({ key: 'int' + g.k, comp: 'INT', t: g.t, kind: 'info', tag: mine ? 'SEU JOGO' : 'MUNDIAL', icon: 'trophy', title: I.one ? 'Copa Intercontinental' : `Intercontinental · ${SE.INT_NAME[g.k]}`,
      text: g.win ? `${g.h} ${g.gh} × ${g.ga} ${g.a}${g.pens ? ` (${g.pens[0]} × ${g.pens[1]} nos pênaltis)` : ''}.` : `${h || 'A definir'} × ${g.a}. Campo neutro, jogo único.${mine ? ' Joga com a sua tática atual.' : ''}` }); }); } catch (e) {}
  ev.sort((a, b) => a.t - b.t);
  // evento atual: fase de fim de temporada, próximo jogo ou o próximo compromisso
  let cur = -1;
  if (S.post) { const ph = SE.postPhase(S); cur = ev.findIndex(e => e.kind === 'post' && e.ph === ph); }
  if (cur < 0) {
    const nx = SE.nextFixtureOf(S, club), iN = nx ? ev.findIndex(e => e.key === 'k' + nx.k) : -1;
    const iP = ev.findIndex(e => e.kind === 'pre' && !e.done && e.t >= now - 60000);   // amistoso de pré-temporada ainda por vir
    cur = iP >= 0 && (iN < 0 || iP < iN) ? iP : iN;
  }
  // o tempo fictício manda: fora do dia de jogo, "agora" é o card do dia de hoje (coletiva ou rotina)
  if (!S.post) {
    try {
      const fdNow = Math.floor(SE.fdAt(S, now)), cE = ev[cur];
      const curFd = cE && cE.kind === 'match' ? SE.fdOfSlot(cE.x.k) : cE && cE.kind === 'pre' ? Math.round(SE.fdAt(S, cE.t)) : null;
      if (curFd == null || curFd !== fdNow) {
        const iT = ev.findIndex(e => e.kind === 'press' && e.fd === fdNow && !e.done);
        const iD = ev.findIndex(e => (e.kind === 'day' && e.fd === fdNow) || (e.kind === 'press' && e.fd === fdNow) || (e.gk != null && /^cbr/.test(e.key) && SE.fdOfSlot(e.gk) === fdNow));
        const j = iT >= 0 ? iT : iD;
        if (j >= 0) cur = j;
      }
    } catch (e) {}
  }
  if (cur < 0) cur = ev.findIndex(e => e.t >= now);
  if (cur < 0) cur = ev.length - 1;
  // eventos que não são jogos só aparecem até o atual se já passaram (não polui o passado)
  return { ev, cur };
}
// ---------- dia a dia no calendário fictício: coletivas e rotina entre os jogos ----------
const DAY_TXT = {
  treino: [['Treino tático', 'Ajuste de posicionamento e saída de bola. A comissão observa quem briga por vaga.'], ['Treino de bola parada', 'Escanteios, faltas e pênaltis. Detalhe que decide jogo apertado.'], ['Treino físico', 'Carga controlada pela preparação física, de olho na condição de cada um.'], ['Coletivo', 'Titulares contra reservas. Bom dia pra quem quer mostrar serviço.'], ['Treino de finalização', 'Chute a gol e cruzamentos. Os atacantes ficam depois do horário.'], ['Treino em campo reduzido', 'Posse de bola e pressão pós-perda em espaço curto.']],
  recup: [['Reapresentação', 'Quem jogou faz trabalho regenerativo; os reservas treinam normalmente.'], ['Recuperação', 'Dia de regenerativo, gelo e fisioterapia para quem atuou.']],
  folga: [['Folga do elenco', 'Dia livre para os jogadores descansarem com a família.'], ['Dia de descanso', 'Sem atividades no CT. A condição agradece.']],
  vespera: [['Véspera de jogo', 'Treino leve, definição dos relacionados e concentração.'], ['Último treino antes do jogo', 'Atividade curta, ensaio de jogadas e lista de relacionados.']],
  pre: [['Pré-temporada', 'Treinos em dois períodos e avaliações físicas.'], ['Intertemporada', 'Trabalho físico forte e testes de esquema.']],
};
// dias com card: de 5 dias atrás até 3 semanas à frente e, se você pulou pelo calendário, em volta do dia escolhido
const agInWin = (fd, now) => (fd >= now - 5 && fd <= now + 21) || (UI.agFocusFd != null && fd >= UI.agFocusFd - 7 && fd <= UI.agFocusFd + 14);
// tipo do dia sem evento (mesma regra dos cards)
function dayKindOf(fd, mfd) { const prev = mfd.filter(m => m < fd).pop(), next = mfd.find(m => m > fd); return fd < 0 ? 'pre' : prev != null && fd === prev + 1 ? 'recup' : next != null && fd === next - 1 ? 'vespera' : prev != null && next != null && next - prev >= 7 && fd === prev + 2 ? 'folga' : 'treino'; }
function dailyEvents(ev, sched, now) {
  const G0 = SE.gameDate(S, 0).d, fdOf = d => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(G0.getFullYear(), G0.getMonth(), G0.getDate())) / 86400000);
  const fdNow = Math.floor(SE.fdAt(S, now)), lastFd = SE.fdOfSlot(SE.SLOTS - 1);
  const busy = new Set();
  // coletivas: pós-jogo do último jogo e pré-jogo do próximo
  const X = pressCtx(), T = pressTimes(X), done = new Set((S.pressSt || {}).done || []);
  if (X.lm && T.posOpen) { const opp = X.lm.f.h === S.club ? X.lm.f.a : X.lm.f.h; ev.push({ key: 'ppos' + X.lm.k, t: T.posOpen, openAt: T.posOpen, fd: SE.fdOfSlot(X.lm.k), kind: 'press', ph: 'pos', opp, done: done.has(`pos-${S.season}-${X.lm.k}`), close: X.nx ? SE.slotTime(S, X.nx.k) : null, sc: `${X.lm.f.h} ${X.lm.res.gh}×${X.lm.res.ga} ${X.lm.f.a}` }); }
  // pré-jogo na véspera fictícia de cada jogo que vem (a abertura real segue a regra das 3h e o apito do jogo anterior)
  const nxK = X.nx ? X.nx.k : null, fdNow0 = Math.floor(SE.fdAt(S, now));
  const fut = sched.filter(x => !x.tbd && x.k >= S.slot && (nxK == null || x.k >= nxK));
  fut.forEach((x, i) => {
    const fdv = SE.fdOfSlot(x.k) - 1; if (!agInWin(fdv, fdNow0)) return;
    const prev = i ? fut[i - 1] : (X.lm ? { k: X.lm.k } : null);
    let open = x.k === nxK && T.preOpen ? T.preOpen : Math.max(SE.tOfFd(S, fdv), prev ? SE.slotTime(S, prev.k) + gms(PRESS_LIVE_MIN * 60000) : 0);
    const opp = x.h === S.club ? x.a : x.h;
    ev.push({ key: 'ppre' + x.k, k: x.k, t: SE.tOfFd(S, fdv) + 2, fd: fdv, openAt: open, kind: 'press', ph: 'pre', opp, done: done.has(`pre-${S.season}-${x.k}`), close: x.t, comp: x.comp, isNext: x.k === nxK, prevOpp: prev && i ? (fut[i - 1].h === S.club ? fut[i - 1].a : fut[i - 1].h) : null });
  });
  // dias já ocupados por algum evento
  for (const e of ev) { try { busy.add(fdOf(gameDayOf(e))); } catch (x) {} }
  const mfd = sched.map(x => SE.fdOfSlot(x.k)).sort((a, b) => a - b);
  for (let fd = -15; fd <= lastFd; fd++) {
    if (!agInWin(fd, fdNow) || busy.has(fd)) continue;
    const prev = mfd.filter(m => m < fd).pop(), next = mfd.find(m => m > fd);
    const kind = fd < 0 ? 'pre' : prev != null && fd === prev + 1 ? 'recup' : next != null && fd === next - 1 ? 'vespera' : prev != null && next != null && next - prev >= 7 && fd === prev + 2 ? 'folga' : 'treino';
    const arr = DAY_TXT[kind], [title, text] = arr[C.hash(`dd${S.season}${fd}${S.club}`) % arr.length];
    ev.push({ key: 'd' + fd, t: SE.tOfFd(S, fd) + 1, kind: 'day', fd, dk: kind, title, text, next: next != null ? next - fd : null, cd: nxK != null && fd < SE.fdOfSlot(nxK) });
  }
}
function nextMatchLine() {
  const nx = SE.nextFixtureOf(S, S.club); if (!nx) return '';
  const opp = nx.pending ? null : (nx.h === S.club ? nx.a : nx.h), t = SE.slotTime(S, nx.k);
  return `<div class="agnext">${ic('ball')}<span>${opp ? `${esc(SE.COMP_NAME[nx.comp] || '')} · contra o <b>${esc(opp)}</b>` : 'Próximo jogo'}</span><b class="num cdown" data-t="${t}"></b></div>`;
}
function agDaySlide(e) {
  const past = Math.floor(SE.fdAt(S, tNow())) > e.fd, today = Math.floor(SE.fdAt(S, tNow())) === e.fd;
  const ic2 = { treino: 'dumbbell', recup: 'heart', folga: 'feather', vespera: 'clock', pre: 'dumbbell' }[e.dk] || 'cal';
  const tr = C.TRAINING[S.training || 'normal'];
  const cond = (() => { const ids = mySquad().filter(id => vw(id).inj <= 0).sort((a, b) => vw(b).ovr - vw(a).ovr).slice(0, 14); return ids.length ? Math.round(ids.reduce((s2, id) => s2 + vw(id).cond, 0) / ids.length) : null; })();
  const info = [today && cond != null ? `${ic('heart')} Condição média dos titulares: <b>${cond}</b>` : '', e.dk === 'treino' || e.dk === 'vespera' ? `${ic('dumbbell')} Treino ${esc(tr ? tr.name : 'Normal')}` : '', e.next ? `${ic('ball')} Próximo jogo em ${e.next} dia${e.next > 1 ? 's' : ''}` : ''].filter(Boolean).map(x => `<span>${x}</span>`).join('');
  return agShell(`aginfo ag-dia ag-${e.dk} ${past ? 'past' : ''} ${today ? 'agtoday' : ''}`, e.key, { big: ic(ic2), date: dayBlockOf(gameDayOf(e)), tag: `<span class="compb">${ic(ic2)} ${today ? 'HOJE · ' : ''}DIA A DIA</span>`,
    body: `<h3 class="agtitle">${esc(e.title)}</h3><p class="agtext">${esc(e.text)}</p><div class="agday">${info}</div>${!past && e.cd ? nextMatchLine() : ''}`,
    foot: e.dk === 'treino' ? `<div class="agact"><button class="btn sm alt" data-act="goto" data-v="squad" data-sub="train">${ic('dumbbell')} Treino</button><button class="btn sm alt" data-act="goto" data-v="squad" data-sub="lineup">${ic('tactic')} Tática</button></div>` : '' });
}
function agPressSlide(e) {
  const oa = e.openAt ?? e.t, t = tNow(), open = t >= oa && !e.done && (!e.close || t < e.close), fut = t < oa;
  const title = e.ph === 'pre' ? `Coletiva pré-jogo · contra o ${esc(e.opp)}` : `Coletiva pós-jogo · ${esc(e.sc || '')}`;
  const text = e.ph === 'pre' ? 'Três perguntas dos jornalistas antes do jogo. O que você disser mexe com o elenco, a torcida e o adversário.' : 'Os jornalistas querem saber do resultado. Dá pra responder com as opções ou com as suas palavras.';
  const foot = e.done ? `<span class="agwhen">✓ Coletiva feita</span>` : open ? `<div class="agact"><button class="btn sm" data-act="modal" data-m="press">${ic('mic')} Abrir coletiva</button><span class="agwhen">${e.close ? `até ${hhmm(e.close)}` : ''}</span></div>` : fut ? `<span class="agwhen">${ic('clock')} Abre ao chegar neste dia · ${when(oa).toLowerCase()}</span>` : `<span class="agwhen">${ic('clock')} Encerrada</span>`;
  return agShell(`aginfo ag-imprensa ${e.done || (!open && !fut) ? 'past' : ''} ${open ? 'agtoday' : ''}`, e.key, { big: ic('mic'), date: dayBlockOf(gameDayOf(e)), tag: `<span class="compb">${ic('mic')} ${e.fd === Math.floor(SE.fdAt(S, t)) ? 'HOJE · ' : ''}IMPRENSA</span>`, body: `<h3 class="agtitle">${title}</h3><p class="agtext">${text}</p>${e.ph === 'pre' && e.isNext && !(t >= (e.close || Infinity)) ? nextMatchLine() : ''}`, foot });
}
// técnico no card: humano = boneco dele; IA = boneco genérico em cinza
const AG_TC = {};
function agCoach(club) {
  const tok = Wd.deskOf(S, club);
  if (tok) return `<span class="agcoach on">${coachImg(S.desks[tok].avatar, club)}</span>`;
  const r = C.rng(C.hash('aic' + club)), A = SPR.COACH, pk = o => { const k = Object.keys(o); return k[Math.floor(r() * k.length)]; };
  const av = { skin: Math.floor(r() * A.skin.length), hairC: Math.floor(r() * 5), hair: pk(A.hair), beard: pk(A.beard), outfit: 'terno', glasses: 'nao' };
  return `<span class="agcoach off" title="Técnico da IA">${coachImg(av, club)}</span>`;
}
function agTeamCard(club) { const k = club + '|' + S.slot; if (!(k in AG_TC)) AG_TC[k] = teamCard(club); return AG_TC[k]; }
function agSide(club) {
  return `<button class="agside" data-act="club" data-club="${esc(club)}"><span class="agcrest">${crest(club, 'lg')}${agCoach(club)}</span><b>${esc(club)}</b>${agTeamCard(club)}</button>`;
}
// card de jogo: data do CALENDÁRIO DO JOGO no canto; no centro, a hora REAL com o contador
const MES3G = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
function dayBlockOf(d) { return `<div class="agdate"><b class="num">${String(d.getDate()).padStart(2, '0')}</b><span><i>${MES3G[d.getMonth()]} <em class="agdow">${DIA3[d.getDay()].toUpperCase()}</em></i><small>${S.season}</small></span></div>`; }
function gameDayBlock(e) { return dayBlockOf(gameDayOf(e)); }
function gameDateBlock(k) { return dayBlockOf(SE.gameDate(S, k).d); }
function realLabel(t) { const r = realT(t), d = new Date(r), diff = Math.round((Wd.startOfDay(r) - Wd.startOfDay(Date.now())) / 86400000); return diff === 0 ? 'hoje' : diff === 1 ? 'amanhã' : diff === -1 ? 'ontem' : `${DIA3[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; }
// template fixo: cada informação tem sua linha reservada (vazia quando não existe), igual em todos os cards
function agShell(cls, key, parts) {
  const g = n => `<div class="g-${n}">${parts[n] || ''}</div>`;
  return `<div class="agslide hero agg ${cls}" data-key="${key}" data-act="agcal">${parts.big ? `<span class="agbig">${parts.big}</span>` : ''}${parts.pre || ''}${g('date')}${g('tag')}${g('st')}${g('tk')}${parts.body ? `<div class="g-body">${parts.body}</div>` : g('main') + g('prob') + g('ref')}${g('foot')}</div>`;
}
function agMatchSlide(e, isNow) {
  const x = e.x, club = S.club;
  if (x.tbd) return agShell(`cmp cmp-${x.comp === 'CB' ? 'CB' : ['NE', 'SSE', 'VER'].includes(x.comp) ? x.comp : 'LIB'}`, e.key, { big: ic('trophy'), date: gameDayBlock(e), tag: `<span class="compb">${ic('trophy')} ${x.comp === 'CB' ? 'Copa do Brasil' : ['NE', 'SSE', 'VER'].includes(x.comp) ? SE.COMP_NAME[x.comp] : 'Continental'}</span>`,
    body: `<h3 class="agtitle">Adversário a definir</h3><p class="agtext">${hhmm(e.t)} · depende das fases anteriores.</p>` });
  const done = x.k < S.slot, st = x.neutral ? null : SE.stadium(S, x.h);
  const tk = !x.neutral && Wd.deskOf(S, x.h) ? (Wd.asClub(S, x.h, () => S.ticket) || 'normal') : 'normal';
  const stage = x.md ? `Rodada ${x.md}` : x.round ? SE.CB_STAGES[x.round - 1] : x.stage ? SE.CK_STAGES[x.stage - 1] : x.leg ? `jogo ${x.leg}` : '';
  let mid = `<small class="agreal">– ${realLabel(e.t)} –</small><b class="agtime num">${hhmm(e.t)}</b>`;
  if (isNow && !done) mid += `<span class="agcd num" id="countdown" data-t="${e.t}"></span>`;
  if (done) {
    const my = x.h === club ? x.gh : x.ga, ot = x.h === club ? x.ga : x.gh;
    const r = my > ot ? 'V' : my < ot ? 'D' : x.pens ? ((x.h === club ? x.pens[0] > x.pens[1] : x.pens[1] > x.pens[0]) ? 'V' : 'D') : 'E';
    mid = `<small class="agreal">– ${realLabel(e.t)} –</small><b class="agscore num">${x.gh}–${x.ga}</b>${x.pens ? `<small>${x.pens[0]}–${x.pens[1]} pên</small>` : ''}<span class="agres ${r}">${{ V: 'Vitória', E: 'Empate', D: 'Derrota' }[r]}</span>`;
  }
  // v155: "Rever partida" (replay, como no Último jogo) quando é o último jogo do clube; "Resumo" abre o placar, gols e notas
  const lmx = S.lastMatch && S.lastMatch.season === S.season && S.lastMatch.k === x.k && S.lastMatch.f && S.lastMatch.f.h === x.h ? S.lastMatch : null;
  const left = done ? `${lmx ? `<button class="btn sm white" data-act="watch">${ic('ball')} Rever partida</button>` : ''}<button class="btn sm ${lmx ? 'alt' : 'white'}" data-act="match" data-k="${x.k}" data-h="${esc(x.h)}" data-a="${esc(x.a)}">${ic('news')} Resumo</button>${x.comp && !['AMI', 'SC'].includes(x.comp) ? `<button class="btn sm alt" data-act="tblgo" data-comp="${esc(x.comp)}">${ic('trophy')} Tabela</button>` : ''}`
    : isNow ? `<button class="btn sm" data-act="goto" data-v="squad" data-sub="lineup">${ic('tactic')} Tática</button><button class="btn sm white" data-act="teamtalk" ${UI.agTalked ? 'disabled' : ''}>${ic('chat')} ${UI.agTalked ? 'Feito' : 'Grupo'}</button>${pressBtn(x)}`
    : `<button class="btn sm alt" data-act="club" data-club="${esc(x.h === club ? x.a : x.h)}">Ver adversário</button>`;
  const right = isNow && !done && UI.agTest ? UI.agTest : '';
  return agShell(`cmp cmp-${x.comp} ${done ? 'past' : ''} ${isNow ? 'agnow' : ''}`, e.key, {
    pre: isNow ? UI.agPause || '' : '',
    date: gameDateBlock(x.k), tag: `<span class="compb">${ic('trophy')} ${SE.COMP_NAME[x.comp]}${stage ? ' · ' + stage : ''}</span>`,
    st: `<div class="stline">${ic('stadium')} <b>${st ? esc(st.name) : 'Campo neutro'}</b></div>`,
    tk: st ? `<span class="tkl tk-${tk}">${ic('ticket')} Ingresso: ${TK_NAME[tk] || tk}</span>` : '',
    main: `<div class="agvs2">${agSide(x.h)}<div class="agmid">${mid}</div>${agSide(x.a)}</div>`,
    prob: isNow && !done ? UI.agProb || '' : '', ref: isNow && !done ? UI.agRef || '' : '',
    foot: `<div class="agact">${left}</div><div class="agadm">${right}</div>` });
}
// botão da coletiva pré-jogo no rodapé do card do próximo jogo (cinza "Feito" depois de respondida)
function pressBtn(x) {
  try {
    const X = pressCtx(); if (!X.nx || X.nx.k !== x.k) return '';
    const T = pressTimes(X), t = SE.now(S), done = new Set((S.pressSt || {}).done || []);
    if (done.has(`pre-${S.season}-${x.k}`)) return `<button class="btn sm white" disabled>${ic('mic')} Feito</button>`;
    if (t >= T.preOpen) return `<button class="btn sm white" data-act="modal" data-m="press">${ic('mic')} Coletiva</button>`;
    return '';
  } catch (e) { return ''; }
}
// linha da coletiva pré-jogo no card do próximo jogo
function agPreSlide(e, isNow) {
  const r = e.res, live = isNow && !r && !e.done;
  return agShell('cmp cmp-AMI agpre', e.key, { big: ic('vs'), date: gameDayBlock(e), tag: `<span class="compb">${ic('vs')} PRÉ-TEMPORADA · AMISTOSO ${e.i + 1}/3</span>`,
    st: `<div class="stline">${ic('clock')} <b>${r ? 'Jogado' : 'Às'} ${hhmm(e.t)}</b> · ${realLabel(e.t)}</div>`,
    main: r ? `<div class="agvs2">${agSide(r.h)}<div class="agmid"><b class="agscore num">${r.gh}–${r.ga}</b></div>${agSide(r.a)}</div>` : `<div class="agpremain"><h3 class="agtitle">Amistoso ${e.i + 1} de 3</h3><p class="agtext">Adversário sorteado na hora. Dá tempo de mexer no elenco entre um amistoso e outro.</p>${live ? `<div class="row" style="gap:8px;align-items:center"><small class="agreal">Bola rola em</small><span class="agcd num" id="countdown" data-t="${e.t}"></span></div>` : ''}</div>`,
    foot: !r ? `<div class="agact"><button class="btn sm" data-act="goto" data-v="squad" data-sub="lineup">${ic('tactic')} Tática</button><button class="btn sm white" data-act="goto" data-v="market">${ic('handshake')} Mercado</button></div><div class="agadm">${live && UI.agTest ? UI.agTest : ''}</div>` : '' });
}
function agInfoSlide(e) {
  const past = e.t < tNow(), cls = e.comp ? `cmp cmp-${e.comp}` : `aginfo ag-${e.tag.replace(/\W/g, '').toLowerCase()}`;
  return agShell(`${cls} ${past ? 'past' : ''}`, e.key, { big: ic(e.icon), date: gameDayBlock(e), tag: `<span class="compb">${ic(e.icon)} ${e.tag}${e.comp ? ' · ' + SE.COMP_NAME[e.comp] : ''}</span>`,
    body: `<h3 class="agtitle">${esc(e.title)}</h3><p class="agtext">${esc(e.text)}</p>`,
    foot: `<span class="agwhen">${ic('clock')} ${past ? 'Aconteceu' : 'Acontece'} ${when(e.t).toLowerCase()}</span>${e.key === 'draw' && drawReady() ? `<button class="btn sm" data-act="drawshow">${ic('trophy')} ${S.drawSeen === S.season ? 'Rever sorteio' : 'Assistir sorteio'}</button>` : ''}${e.cbTab ? `<button class="btn sm" data-act="goto" data-v="comps" data-sub="CB">${ic('trophy')} Ver jogos</button>` : ''}${/^cbdraw\d/.test(e.key) && S.comp.CB && S.comp.CB.rounds[+e.key.slice(6) - 1] ? `<button class="btn sm" data-act="cbshow" data-i="${+e.key.slice(6) - 1}">${ic('trophy')} ${cbSeenR() >= +e.key.slice(6) - 1 ? 'Rever sorteio' : 'Assistir sorteio'}</button>` : ''}` });
}
function agPostSlide(e) {
  const ph = SE.postPhase(S), Pp = S.post;
  let act = `<button class="btn sm alt" data-act="goto" data-v="comps" data-sub="A">Tabela final</button>`;
  if (ph === 'prem' || ph === 'livre') act = `<button class="btn sm" data-act="awards">${ic('trophy')} Premiação</button>` + act;
  if (ph === 'livre') { const r = SE.readyInfo(S), adm = NET.online ? NET.isAdmin() : true; act = (S.ready === S.season ? `<button class="btn sm alt" data-act="nscancel">${r.ok}/${r.n} prontos · desfazer</button>` : `<button class="btn sm lime" data-act="nsready">NOVA TEMPORADA · ${r.ok}/${r.n}</button>`) + (adm && r.n > 1 ? `<button class="btn sm alt" data-act="nsforce">Iniciar (ADM)</button>` : ''); }
  else if (UI.agTest) act += UI.agTest;
  return agShell('aginfo ag-fimdetemporada agnow', e.key, { big: ic(e.icon), date: gameDayBlock(e), tag: `<span class="compb">${ic(e.icon)} ${e.tag} · ${Pp.season}</span>`,
    body: `<h3 class="agtitle">${esc(e.title)}</h3><p class="agtext">Campeão: <b>${esc(Pp.champA)}</b>. Caíram: ${Pp.down.map(esc).join(', ')}. Subiram: ${Pp.up.map(esc).join(', ')}.</p>${intBox(true)}`,
    foot: `<div class="agact">${act}</div>` });
}
function agendaHTML(nextHTML, nxKey) {
  for (const k in AG_TC) delete AG_TC[k];
  const { ev, cur } = agendaEvents();
  UI.agCurKey = ev[cur] ? ev[cur].key : null;
  const phNow = S.post ? SE.postPhase(S) : null;
  try { const G0 = SE.gameDate(S, 0).d, g0 = new Date(G0.getFullYear(), G0.getMonth(), G0.getDate()); UI.agFdIdx = ev.map(e => { try { const d = gameDayOf(e); return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - g0) / 86400000); } catch (x) { return null; } }); } catch (x) { UI.agFdIdx = null; }
  const slides = ev.map((e, i) => {
    if (e.kind === 'post' && S.post && e.ph === phNow) return agPostSlide(e);
    if (e.kind === 'match') return agMatchSlide(e, e.key === nxKey);
    if (e.kind === 'pre') return agPreSlide(e, i === cur);
    if (e.kind === 'day') return agDaySlide(e);
    if (e.kind === 'press') return agPressSlide(e);
    return agInfoSlide(e);
  }).join('');
  const more = '';
  return `<div class="agwrap"><div class="agbar"><span class="eyebrow" style="margin:0">${ic('cal')} Agenda</span><span class="agpos" id="agpos">${cur + 1}/${ev.length}</span>
    <span class="agnav"><button data-act="agstep" data-d="-1" aria-label="Evento anterior">‹</button><button data-act="agnow" aria-label="Voltar para agora">agora</button><button data-act="agstep" data-d="1" aria-label="Próximo evento">›</button></span></div>
    <div class="agenda" id="agenda" data-cur="${cur}">${slides}</div>
    ${more && UI.agMore ? `<div class="agmore">${more}</div>` : ''}</div>`;
}
function agendaMount() {
  const el = document.getElementById('agenda'); if (!el) return;
  const slides = [...el.children], cur = +el.dataset.cur;
  let idx = cur;
  if (UI.agKey && UI.agSeenCur === UI.agCurKey) { let j = slides.findIndex(s => s.dataset.key === UI.agKey); if (j < 0 && UI.agFocusFd != null && UI.agFdIdx) j = UI.agFdIdx.findIndex(f => f != null && f >= UI.agFocusFd); if (j >= 0) idx = j; }
  UI.agSeenCur = UI.agCurKey; UI.agJump = false;
  el.scrollLeft = idx * el.clientWidth;
  const pos = document.getElementById('agpos');
  let tmr = 0;
  el.addEventListener('scroll', () => {
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    if (slides[i]) { UI.agKey = slides[i].dataset.key; UI.agSeenCur = UI.agCurKey; }
    clearTimeout(tmr);
    tmr = setTimeout(() => { if (pos) pos.textContent = `${i + 1}/${slides.length}`; }, 60);
  }, { passive: true });
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="agmore"]'); if (!el) return;
  ev.stopImmediatePropagation(); UI.agMore = !UI.agMore; render();
}, true);
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="agstep"],[data-act="agnow"]'); if (!el) return;
  const ag = document.getElementById('agenda'); if (!ag) return;
  ev.stopImmediatePropagation();
  if (el.dataset.act === 'agnow' && UI.agFocusFd != null) { UI.agFocusFd = null; UI.agKey = null; UI.agJump = true; render(); return; }
  const i = el.dataset.act === 'agnow' ? +ag.dataset.cur : Math.round(ag.scrollLeft / ag.clientWidth) + (+el.dataset.d);
  ag.scrollTo({ left: Math.max(0, i) * ag.clientWidth, behavior: 'smooth' });
}, true);

// ---------- histórico de transferências ----------
const TR_TYPE = { compra: 'Compra', emprestimo: 'Empréstimo', retorno: 'Retorno de empréstimo', livre: 'Jogador livre', dispensa: 'Dispensa', fim: 'Fim de contrato', pre: 'Pré-contrato', ouro: 'Pacote Ouro', diamante: 'Pacote Diamante', pacote: 'Pacote', base: 'Promovido da base', rescisao: 'Rescisão', troca: 'Troca', real: 'Transferência real' };
const TR_COL = { compra: 'var(--lime)', emprestimo: 'var(--blue)', retorno: 'var(--mint)', livre: 'var(--green)', dispensa: 'var(--coral)', fim: 'var(--stone)', pre: 'var(--purple)', ouro: 'var(--yellow)', diamante: 'var(--c-dia)', pacote: 'var(--orange)', base: 'var(--green)', rescisao: 'var(--coral)', troca: 'var(--pink)', real: 'var(--stone)' };
// empréstimos ativos do seu clube (cedidos e recebidos) com a volta prevista
function myLoans() {
  const out = [], inn = [];
  for (const k in S.ps) { const lo = S.ps[k].loanOut; if (!lo || !P[k] || lo.season !== S.season) continue; if (lo.from === S.club) out.push(+k); else if (own(+k) === S.club) inn.push(+k); }
  if (!out.length && !inn.length) return '';
  const row = id => { const lo = S.ps[id].loanOut, q = lo.from === S.club ? MK.recallQuote(S, id) : null; return `<button class="trp lnrow" data-act="player" data-id="${id}">${av(id)}<span><b>${esc(P[id].short)}</b><small>${esc(lo.from)} ${ic('arrowR')} ${esc(own(id))} · ${esc(MK.LOAN_LEN[lo.len] || '')}${lo.fee != null ? ` · taxa T$ ${fmtK(lo.fee)}` : ''}${lo.share != null ? ` · ${lo.share}% do salário com o ${esc(own(id))}` : ''}</small><small>Volta: <b>${LOAN_BACK(lo.season, lo.end)}</b>${q && q.ok ? ` · chamar agora: reembolso T$ ${fmtK(q.refund)}` : ''}</small></span></button>`; };
  return `<div class="tile"><div class="eyebrow" style="margin:0 0 6px">${ic('swap')} Empréstimos ativos do ${esc(S.club)}</div>
    ${out.length ? `<div class="small muted" style="margin:2px 0">Cedidos</div>${out.map(row).join('')}` : ''}${inn.length ? `<div class="small muted" style="margin:6px 0 2px">Recebidos</div>${inn.map(row).join('')}` : ''}</div>`;
}
function trView() {
  const log = S.trlog || [];
  const F = UI.trf = UI.trf || { season: S.season, club: '', type: '', q: '', side: 'all', div: '' };
  const seasons = [...new Set(log.map(x => x[0]))].sort((a, b) => b - a); if (!seasons.includes(S.season)) seasons.unshift(S.season);
  const focus = F.club || S.club;
  let rows = log.filter(x => x[0] === F.season);
  if (F.type) rows = rows.filter(x => x[6] === F.type);
  if (F.club) rows = rows.filter(x => x[3] === F.club || x[4] === F.club);
  // Série: limita a lista de clubes e, sem clube escolhido, as movimentações dos clubes dessa série
  const divSet = F.div ? new Set(Wd.divList(S, F.div)) : null;
  if (F.club && divSet && !divSet.has(F.club)) F.club = '';
  if (!F.club && divSet) rows = rows.filter(x => divSet.has(x[3]) || divSet.has(x[4]));
  // balanço em dinheiro (vendas x compras) do clube escolhido, da série ou do seu clube; troca não conta (é abatimento, não dinheiro)
  const persp = F.club ? new Set([F.club]) : divSet || new Set([S.club]);
  const perspLbl = F.club ? F.club : F.div ? `Série ${F.div}` : S.club;
  let recv = 0, spent = 0, nIn = 0, nOut = 0;
  for (const x of rows) { const fee = x[5] || 0, ty = x[6]; if (x[3] === x[4]) continue; const out = persp.has(x[3]), inn = persp.has(x[4]); if (out) nOut++; if (inn) nIn++; if (!fee || ty === 'troca' || ty === 'retorno') continue; if (out && !inn) recv += fee; if (inn && !out) spent += fee; }
  if (F.side === 'in') rows = rows.filter(x => x[4] === focus);
  else if (F.side === 'out') rows = rows.filter(x => x[3] === focus);
  else if (F.side === 'loan') rows = rows.filter(x => x[6] === 'emprestimo' || x[6] === 'retorno' || x[6] === 'ouro' || x[6] === 'diamante');
  if (F.q) { const q = F.q.toLowerCase(); rows = rows.filter(x => P[x[2]] && P[x[2]].name.toLowerCase().includes(q)); }
  rows = rows.slice().reverse();
  const shown = rows.slice(0, UI.trMore || 80);
  const clubs = (F.div ? Wd.divList(S, F.div) : Wd.brClubs(S)).slice().sort((a, b) => a.localeCompare(b));   // só clubes do Brasil (A, B e C)
  const sel = (key, opts, cur, lbl) => `<label class="trsel"><span>${lbl}</span><select data-trf="${key}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
  const side = [['all', 'Todas'], ['in', 'Entradas'], ['out', 'Saídas'], ['loan', 'Empréstimos']].map(([k, l]) => `<button class="${F.side === k ? 'on' : ''}" data-act="trside" data-k="${k}">${l}</button>`).join('');
  const clubBtn = c => c === 'Livre' || c === '?' ? `<span class="trc muted">${c === 'Livre' ? 'sem clube' : '—'}</span>` : `<button class="trc" data-act="club" data-club="${esc(c)}">${crest(c, 'sm')}<span>${esc(c)}</span></button>`;
  const list = shown.map(x => {
    const [se, k, id, from, to, fee, ty, , xx] = x;
    const lnx = ty === 'emprestimo' && xx ? `<div class="small muted trlx">${esc(MK.LOAN_LEN[xx.len] || '')}${xx.sh != null ? ` · ${esc(to)} paga ${xx.sh}% do salário` : ''} · volta: ${LOAN_BACK(se, xx.end)}</div>` : ty === 'retorno' && xx && xx.recall ? `<div class="small muted trlx">Chamada antecipada · reembolso de T$ ${fmtK(xx.refund || 0)} ao ${esc(from)}</div>` : '';
    return `<div class="trrow"><div class="trtop"><button class="trp" data-act="player" data-id="${id}">${av(id)}<span><b>${esc(P[id] ? P[id].name : '?')}</b><small>${P[id] ? P[id].pos : ''} · ${SE.gameDate({ season: se }, k).txt} ${se}</small></span></button><span class="trty" style="--tc:${TR_COL[ty] || 'var(--muted)'}">${esc(TR_TYPE[ty] || ty)}</span></div>
      <div class="trmove">${clubBtn(from)}<span class="trarr">${ic('arrowR')}</span>${clubBtn(to)}<b class="num trfee">${fee ? 'T$ ' + fmtK(fee) : '—'}</b></div>${lnx}</div>`;
  }).join('');
  return `<div class="tile"><div class="row between"><div class="eyebrow" style="margin:0">${ic('swap')} Histórico de transferências</div><span class="small muted">${rows.length} movimentação(ões)</span></div>
    <div class="chips" style="margin-top:8px">${seasons.map(y => `<button class="chip ${F.season === y ? 'on' : ''}" data-act="trseason" data-y="${y}">${y}</button>`).join('')}</div>
    <div class="seg trseg">${side}</div>
    <div class="trbal"><div class="trbh"><span>${ic('cash')} Balanço · ${esc(perspLbl)}</span><small>${nIn} chegada(s) · ${nOut} saída(s)</small></div>
      <div class="trbg"><div><small>Recebido (vendas)</small><b class="num" style="color:var(--green)">T$ ${fmtK(recv)}</b></div><div><small>Gasto (compras)</small><b class="num" style="color:var(--coral)">T$ ${fmtK(spent)}</b></div><div><small>Saldo</small><b class="num" style="color:${recv - spent >= 0 ? 'var(--lime)' : 'var(--coral)'}">${recv - spent < 0 ? '−' : '+'}T$ ${fmtK(Math.abs(recv - spent))}</b></div></div>
      <p class="small muted" style="margin:6px 0 0">Taxas de compra, venda e empréstimo${F.type ? ' do tipo filtrado' : ''} na temporada ${F.season}. Trocas entram pelo valor em dinheiro que sobrou.</p></div>
    <div class="trfilters">${sel('div', [['', 'Todas as séries'], ['A', 'Série A'], ['B', 'Série B'], ...(S.divC && S.divC.length ? [['C', 'Série C']] : [])], F.div || '', 'Série')}${sel('club', [['', F.div ? `Todos da Série ${F.div}` : 'Todos os clubes'], ...clubs.map(c => [c, c])], F.club, 'Clube')}${sel('type', [['', 'Todos os tipos'], ...Object.entries(TR_TYPE)], F.type, 'Tipo')}
      <label class="trsel"><span>Jogador</span><input type="search" id="trq" value="${esc(F.q)}" placeholder="nome…" autocomplete="off"></label></div>
    ${F.side !== 'all' && F.side !== 'loan' ? `<p class="small muted" style="margin:6px 0 0">${F.side === 'in' ? 'Entradas' : 'Saídas'} do ${esc(focus)}${F.club ? '' : ' (seu clube; escolha outro no filtro Clube)'}.</p>` : ''}</div>
    ${F.side === 'loan' ? myLoans() : ''}
    <div class="stack" style="gap:6px">${list || '<div class="tile"><p class="muted" style="margin:0">Nenhuma movimentação com esses filtros.</p></div>'}</div>
    ${rows.length > shown.length ? `<button class="btn alt" data-act="trmore">Mostrar mais (${rows.length - shown.length})</button>` : ''}`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act; if (!/^tr(side|season|more)$/.test(a)) return;
  ev.stopImmediatePropagation();
  if (a === 'trside') UI.trf.side = el.dataset.k;
  else if (a === 'trseason') { UI.trf.season = +el.dataset.y; UI.trf.club = ''; }
  else UI.trMore = (UI.trMore || 80) + 120;
  render();
}, true);
document.addEventListener('change', ev => {
  const el = ev.target.closest('[data-trf]'); if (!el || !UI.trf) return;
  UI.trf[el.dataset.trf] = el.value; UI.trMore = 80; render();
});
document.addEventListener('input', ev => {
  if (ev.target.id !== 'trq' || !UI.trf) return;
  UI.trf.q = ev.target.value; clearTimeout(UI.trqT);
  UI.trqT = setTimeout(() => { const pos = ev.target.selectionStart; render(); const q = document.getElementById('trq'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (e) {} } }, 350);
});
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="turboinfo"]'); if (!el) return;
  ev.stopImmediatePropagation(); toast('⚡ Modo Turbo: temporada inteira em 7 dias, 8 jogos por dia');
}, true);

// ---------- calendário do mês (toque no card da agenda) ----------
const COMP_SH = { A: 'SÉRIE A', B: 'SÉRIE B', C: 'SÉRIE C', CB: 'COPA', LIB: 'LIBERTA', SUL: 'SULA', CONF: 'CONF', SC: 'SUPER', PL: 'PRÉ-LIB', AMI: 'AMISTOSO', NE: 'NORDESTÃO', SSE: 'SUL-SUDESTE', VER: 'C. VERDE' };
const MESF = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
// data de cada compromisso no calendário FICTÍCIO do jogo (jan–dez da temporada)
function gameDayOf(e) {
  const G = k => SE.gameDate(S, Math.max(0, Math.min(SE.SLOTS - 1, k))).d, add = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  if (e.kind === 'match') return G(e.x.k);
  if (e.kind === 'day') return add(G(0), e.fd);
  if (e.kind === 'press') return add(G(0), e.fd != null ? e.fd : Math.floor(SE.fdAt(S, e.t)));
  if (e.gk != null) return G(e.gk);
  const kk = { w1: 16, w2: 32, w3: 40, draw: SE.CAL.find(c => c.type === 'C').k }[e.key] ?? (e.k != null ? e.k + 1 : null);
  if (kk != null) return add(G(kk), -1);
  if (/^fifa/.test(e.key)) return add(G(+e.key.slice(4)), -1);
  if (e.kind === 'pre' || e.key === 'pre0' || e.key === 'w0') return add(G(0), Math.round(SE.fdAt(S, e.t)));
  if (e.kind === 'post') return add(G(SE.SLOTS - 1), 3 + ['final', 'enc', 'prem', 'livre'].indexOf(e.ph) * 3);
  return G(0);
}
function agCalModal(m) {
  const { ev } = agendaEvents(), club = S.club, days = {};
  for (const e of ev) { const d = gameDayOf(e), k = `${d.getMonth()}-${d.getDate()}`; (days[k] = days[k] || []).push(e); }
  const months = (() => { const G = SE.gameDate(S, 0).d, a = new Date(G.getFullYear(), G.getMonth(), G.getDate() - 15), z = SE.gameDate(S, SE.SLOTS - 1).d, out = []; for (let d = new Date(a.getFullYear(), a.getMonth(), 1); d <= z; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) out.push(d.getMonth()); return [...new Set([...out, ...ev.map(e => gameDayOf(e).getMonth())])].sort((x, y) => x - y); })();
  const nx = SE.nextFixtureOf(S, club), curM = nx && !nx.pending ? SE.gameDate(S, nx.k).d.getMonth() : months[0];
  const M = m.m ?? (months.includes(curM) ? curM : months[0]), Y = S.season, i = months.indexOf(M);
  const first = new Date(Y, M, 1), start = new Date(Y, M, 1 - first.getDay()), cells = [];
  const nowK = nx && !nx.pending ? SE.gameDate(S, nx.k).d.toDateString() : null;
  const G0 = SE.gameDate(S, 0).d, fdOfD = d => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(G0.getFullYear(), G0.getMonth(), G0.getDate())) / 86400000);
  const lastFd = SE.fdOfSlot(SE.SLOTS - 1), mfd = SE.clubSchedule(S, club).map(x => SE.fdOfSlot(x.k)).sort((a, b) => a - b), fdToday = Math.floor(SE.fdAt(S, tNow()));
  const DK_IC = { treino: 'dumbbell', recup: 'heart', folga: 'feather', vespera: 'clock', pre: 'dumbbell' }, DK_NM = { treino: 'Treino', recup: 'Recup.', folga: 'Folga', vespera: 'Véspera', pre: 'Pré-temp.' };
  for (let c = 0; c < 42; c++) {
    const d = new Date(Y, M, 1 - first.getDay() + c);
    if (c >= 35 && d.getMonth() !== M) break;
    const list = d.getMonth() === M ? (days[`${d.getMonth()}-${d.getDate()}`] || []) : [], out = d.getMonth() !== M;
    const mt = list.find(e => e.kind === 'match' && !e.x.tbd), tbd = list.find(e => e.kind === 'match' && e.x.tbd), pre = list.find(e => e.kind === 'pre'), info = list.filter(e => !['match', 'pre', 'day', 'press'].includes(e.kind)), dayEv = list.find(e => e.kind === 'day'), prEv = list.find(e => e.kind === 'press');
    let body = '', cls = '';
    if (mt) {
      const x = mt.x, opp = x.h === club ? x.a : x.h, done = x.k < S.slot;
      const res = done ? (() => { const my = x.h === club ? x.gh : x.ga, ot = x.h === club ? x.ga : x.gh; return `<em class="${my > ot ? 'V' : my < ot ? 'D' : 'E'}">${my}–${ot}</em>`; })() : '';
      body = `<span class="cop">${crest(opp)}</span><span class="cl"><b>${x.h === club ? 'Casa' : 'Fora'}</b><small>${COMP_SH[x.comp] || x.comp}</small>${res}</span>`;
      cls = `m cmp-${x.comp} ${done ? 'done' : ''} ${d.toDateString() === nowK ? 'now' : ''}`;
    } else if (tbd) { body = `<span class="cl"><b>A definir</b><small>${COMP_SH[tbd.x.comp] || ''}</small></span>`; cls = `m tbd cmp-${tbd.x.comp}`; }
    else if (pre) { body = `<span class="cop">${pre.res ? crest(pre.res.h === club ? pre.res.a : pre.res.h) : ic('vs')}</span><span class="cl"><b>Amistoso</b><small>PRÉ-TEMP.</small>${pre.res ? `<em>${pre.res.gh}–${pre.res.ga}</em>` : ''}</span>`; cls = 'm cmp-AMI'; }
    else if (info.length) { body = `<span class="cl"><b>${esc(info[0].tag)}</b>${info[0].comp ? `<small>${COMP_SH[info[0].comp]}</small>` : ''}</span>`; cls = info[0].comp ? `m ev cmp-${info[0].comp}` : 'i'; }
    if (info.length && (mt || pre || tbd)) body += `<span class="cinfo">${info.slice(0, 2).map(e => `<i>${ic(e.icon || 'cal')}</i>`).join('')}</span>`;
    else if (info.length) body += `<span class="cinfo big">${ic(info[0].icon || 'cal')}</span>`;
    const fd = fdOfD(d), inSeason = !out && fd >= -15 && fd <= lastFd;
    if (inSeason && !mt && !tbd && !pre && !info.length) { const dk = dayEv ? dayEv.dk : dayKindOf(fd, mfd); cls = `dk dk-${dk}`; body = `<span class="cinfo big">${ic(DK_IC[dk])}</span><span class="cl"><b>${DK_NM[dk]}</b></span>`; }
    if (inSeason && mfd.includes(fd + 1) && !mt) body += `<span class="cmic">${ic('mic')}</span>`;
    const target = (mt || tbd || pre || info[0] || prEv || dayEv || {}).key || (inSeason ? 'd' + fd : null);
    const isToday = fd === fdToday;
    cells.push(`<button class="calc ${cls} ${out ? 'out' : ''} ${isToday ? 'today' : ''}" ${target && inSeason ? `data-act="agcalgo" data-key="${target}" data-fd="${fd}"` : 'disabled'}><span class="cd num">${d.getDate()}</span>${body}</button>`);
  }
  const legend = [['A', 'Série A'], ['B', 'Série B'], ['CB', 'Copa'], ['LIB', 'Liberta'], ['SUL', 'Sula'], ['CONF', 'Conf.'], ['NE', 'Nordeste'], ['SSE', 'Sul-Sud.'], ['VER', 'Verde']].map(([k, l]) => `<span class="cmp-${k}"><i></i>${l}</span>`).join('');
  return `<div class="agcal ${m.cmp ? 'cmp-' + m.cmp : 'dkc-' + (m.dk || 'x')}"><div class="agcalhd"></div><div class="row between"><button class="btn sm alt" data-act="agcalm" data-m="${months[i - 1] ?? ''}" ${i > 0 ? '' : 'disabled'}>‹</button><div style="text-align:center"><h2 class="disp" style="margin:0;font-size:26px">${MESF[M]} ${Y}</h2><span class="small muted">calendário do jogo</span></div><button class="btn sm alt" data-act="agcalm" data-m="${months[i + 1] ?? ''}" ${i < months.length - 1 ? '' : 'disabled'}>›</button></div>
    <div class="calgrid">${['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(w => `<span class="cw">${w}</span>`).join('')}${cells.join('')}</div>
    <div class="callegend">${legend}<span class="dk-treino"><i></i>Treino</span><span class="dk-recup"><i></i>Recup.</span><span class="dk-folga"><i></i>Folga</span><span class="dk-vespera"><i></i>Véspera</span></div>
    <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm alt" data-act="agcaltoday">${ic('cal')} Ir pra hoje</button></div></div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  if (a === 'agcal' && /^fifa\d+$/.test(el.dataset.key || '')) { const ck = `${S.season}-${el.dataset.key.slice(4)}`; if ((S.selecao || []).some(c => c.key === ck)) { ev.stopImmediatePropagation(); UI.modal = { type: 'callup', key: ck, v: 'liga' }; renderModal(); return; } }
  if (a === 'agcal') { ev.stopImmediatePropagation(); const c = (el.className.match(/\bcmp-(\w+)/) || [])[1], dk = (el.className.match(/\bag-(treino|recup|folga|vespera|pre)\b/) || [])[1]; UI.modal = { type: 'agcal', cmp: c || null, dk: dk || (/ag-imprensa/.test(el.className) ? 'press' : null) }; renderModal(); }
  else if (a === 'agcaltoday') { ev.stopImmediatePropagation(); UI.agFocusFd = null; UI.agKey = null; UI.agJump = true; UI.modal = null; renderModal(); UI.view = 'home'; render(); }
  else if (a === 'agcalm') { ev.stopImmediatePropagation(); if (el.dataset.m !== '') { UI.modal.m = +el.dataset.m; renderModal(); } }
  else if (a === 'agcalgo') { ev.stopImmediatePropagation(); UI.agFocusFd = el.dataset.fd != null ? +el.dataset.fd : null; UI.agKey = el.dataset.key; UI.agSeenCur = UI.agCurKey; UI.agJump = true; UI.modal = null; renderModal(); UI.view = 'home'; render(); }
}, true);

// ---------- código de acesso: só quem tem o código assume um treinador existente ----------
const ACC_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const accKey = () => 'treineiros:acc:' + (NET.code || 'local');
function accGen() { const a = new Uint32Array(8); crypto.getRandomValues(a); const s = [...a].map(x => ACC_ABC[x % ACC_ABC.length]).join(''); return s.slice(0, 4) + '-' + s.slice(4); }
const accNorm = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
async function accHash(code) { const d = new TextEncoder().encode('treineiros|' + (NET.code || '') + '|' + accNorm(code)); const h = await crypto.subtle.digest('SHA-256', d); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join(''); }
function accMine() { try { return localStorage.getItem(accKey()); } catch (e) { return null; } }
// o dono do treinador ganha um código na primeira vez que abre a liga neste aparelho
var accBusy = false;
async function accEnsure() {
  if (accBusy || !NET.online || !S || !S.desks || !S.desks[S.__me]) return;
  const d = S.desks[S.__me];
  if (d.pinS) return;
  accBusy = true;
  try {
    // v196: o código fica conferido pelo banco (só o hash, fora da liga). Desta vez sobe o que já existe; senão gera um novo
    if (d.pinH) { if (await NET.pinSet(S.__me, d.pinH)) { d.pinS = 1; d.pinH = null; save(); } return; }
    const code = accGen(), h = await accHash(code); try { localStorage.setItem(accKey(), code); } catch (e) {}
    if (await NET.pinSet(S.__me, h)) { d.pinS = 1; d.pinH = null; } else d.pinH = h;
    save();
  } finally { accBusy = false; }
}
// v152: lembrete "salve seu código" até o treinador confirmar (uma vez por sessão; some depois do "Já salvei")
const accOkKey = () => 'treineiros:accok:' + (NET.code || 'local');
function accRemind() {
  if (!NET.online || !S || !S.desks || !S.desks[S.__me] || S.desks[S.__me].spect || UI.modal || UI.view === 'creator' || UI.view === 'draw') return;
  const code = accMine(); if (!code) return;
  let ok = null; try { ok = localStorage.getItem(accOkKey()); } catch (e) { return; }
  if (ok === code || UI.accRemindShown === NET.code) return;
  UI.accRemindShown = NET.code; UI.modal = { type: 'accsave', code }; renderModal();
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="accsaved"],[data-act="acccopy"]'); if (!el) return;
  ev.stopImmediatePropagation();
  if (el.dataset.act === 'acccopy') { try { navigator.clipboard.writeText(el.dataset.code); el.textContent = 'Copiado!'; } catch (e) {} return; }
  try { localStorage.setItem(accOkKey(), el.dataset.code); } catch (e) {}
  UI.modal = null; renderModal(); toast('Combinado! O código também fica em Carreira.');
}, true);
async function accLogin() {
  const code = ($('#acc-code') || {}).value || '', lg = NET.code;
  if (accNorm(code).length !== 8) { UI.lobby = { mode: 'claim', code: lg, err: 'O código tem 8 letras/números (XXXX-XXXX).' }; render(); return; }
  // v152: busca a versão mais nova da liga antes de conferir (o código pode ter sido gerado depois que esta tela abriu)
  UI.lobby = { mode: 'claim', code: lg, err: null }; try { const b = $('[data-act="acclogin"]'); if (b) { b.disabled = true; b.textContent = 'Conferindo…'; } } catch (e) {}
  try { await NET.sync({ process: false }); } catch (e) {}
  // v196: o banco confere o código e registra a chave deste aparelho; código antigo (ainda na liga) cai na conferência local
  const cl = await NET.claim(code);
  const h = await accHash(code);
  const tok = cl.ok && S.desks && S.desks[cl.token] ? cl.token : Object.keys(S.desks || {}).find(t => S.desks[t].pinH === h);
  if (!tok) {   // código de vaga do ADM: vai direto criar o treinador no clube reservado
    const vh = await vagaHash(code), V = Wd.vagas(S), club = Object.keys(V).find(c => V[c].h === vh);
    if (club && !Wd.humanClubs(S).includes(club)) { UI.vaga = { code: lg, club, h: vh }; UI.lobby = { mode: 'menu' }; UI.coachEdit = false; UI.coach = null; coachDraft(); go('creator'); toast(`Vaga reservada: ${club}`); return; }
    UI.lobby = { mode: 'claim', code: lg, err: club ? `O ${club} já tem treinador. Peça outro código ao ADM.` : 'Código não encontrado nesta liga (ou a vaga venceu: o código de vaga vale 72 horas).' }; render(); return;
  }
  try { localStorage.setItem(accKey(), accNorm(code).slice(0, 4) + '-' + accNorm(code).slice(4)); } catch (e) {}
  NET.setMe(tok); enterLeague(lg);
}
// ---------- código de vaga: ADM reserva um clube sem técnico e manda o código pra pessoa entrar direto nele ----------
const vagaHash = code => accHash('VAGA' + accNorm(code));
async function vagaGen(club) {
  if (!NET.isAdmin() || !club || Wd.humanClubs(S).includes(club)) return;
  const code = accGen(), h = await vagaHash(code);
  const ok = await NET.sync({ mutate: () => { if (!NET.isAdmin() || !S.league || Wd.humanClubs(S).includes(club)) return; S.league.vag = { ...(S.league.vag || {}), [club]: { h, at: Date.now() } }; } });
  const got = S.league && S.league.vag && S.league.vag[club] && S.league.vag[club].h === h;
  if (!ok || !got) { toast('Não consegui reservar agora. Tente de novo.', true); return; }
  UI.modal = { type: 'vagacode', code, club }; renderModal(); try { admRefresh(); } catch (e) {}
}
function vagaCancel(club) {
  NET.sync({ mutate: () => { if (NET.isAdmin() && S.league && S.league.vag) delete S.league.vag[club]; } }).then(() => { toast(`Reserva do ${club} cancelada`); try { admRefresh(); } catch (e) {} });
}
// tile do Painel do ADM
function vagaTile() {
  if (!NET.online || !S || !S.league) return '';
  const V = Wd.vagas(S), free = Wd.choicePool(S), cap = Wd.leagueCap(S), n = Wd.coachCount(S);
  const opts = ['A', 'B', 'C'].filter(k => Wd.leagueDivs(S).includes(k)).map(k => { const L = free.filter(c => Wd.divOf(S, c) === k).sort(); return L.length ? `<optgroup label="Série ${k}">${L.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</optgroup>` : ''; }).join('');
  const res = Object.entries(V).map(([c, v]) => { const h = Math.max(0, Math.round((v.at + 72 * 3600e3 - Date.now()) / 3600e3)); return `<div class="row between" style="padding:6px 0;gap:8px">${crest(c, 'sm')}<span class="grow">${esc(c)} <span class="small muted">· reservado · vence em ${h}h</span></span><button class="btn sm alt" data-act="vagacancel" data-club="${esc(c)}">Cancelar</button></div>`; }).join('');
  return `<div class="tile"><div class="eyebrow">${ic('handshake')} Vagas · código de vaga</div>
    <p class="small muted" style="margin:0 0 8px">${n} de ${cap} vagas de treinador ocupadas${Wd.leagueFull(S) ? ' · <b>liga cheia</b> pra quem chega sem código' : ''}. Escolha um clube sem técnico e gere um código: a pessoa entra na liga, digita o código em "Código de acesso ou de vaga" e cria o treinador direto nesse clube. O clube fica fora do sorteio por 72 horas.</p>
    ${opts ? `<div class="row" style="gap:8px"><select id="vaga-club" style="flex:1;min-width:0">${opts}</select><button class="btn sm" data-act="vagagen">Gerar código</button></div>` : '<p class="small muted" style="margin:0">Nenhum clube livre nas divisões da liga.</p>'}
    ${res ? `<div style="margin-top:8px">${res}</div>` : ''}</div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="vagagen"],[data-act="vagacancel"]'); if (!el) return;
  ev.stopImmediatePropagation();
  if (el.dataset.act === 'vagagen') { const c = ($('#vaga-club') || {}).value; if (c) { el.disabled = true; vagaGen(c).finally(() => { el.disabled = false; }); } }
  else vagaCancel(el.dataset.club);
}, true);
// ADM: gera um código novo para um treinador (aparelho perdido / troca de celular)
async function accReset(tok) {
  if (!S.desks[tok]) return;
  const code = accGen(), h = await accHash(code);
  if (await NET.pinSet(tok, h)) { S.desks[tok].pinS = 1; S.desks[tok].pinH = null; } else S.desks[tok].pinH = h;
  if (tok === S.__me) try { localStorage.setItem(accKey(), code); } catch (e) {}
  save(); UI.modal = { type: 'acccode', code, name: S.desks[tok].manager }; renderModal();
}
function accBox(tok) {
  if (!NET.online) return '';
  const mine = tok === S.__me, code = mine ? accMine() : null, adm = NET.isAdmin();
  if (mine) return `<div class="accbox">${ic('lock')}<div class="grow"><b>Código de acesso</b><span class="small muted">Use para entrar com seu treinador em outro aparelho. Não compartilhe.</span></div>${code ? `<b class="acccode num">${esc(code)}</b>` : `<span class="small muted">definido em outro aparelho</span>`}</div>${!code || adm ? `<button class="link small" data-act="accreset" data-t="${esc(tok)}">Gerar novo código</button>` : ''}`;
  return adm ? `<button class="btn sm alt" data-act="accreset" data-t="${esc(tok)}">${ic('lock')} ADM: gerar código de acesso deste treinador</button>` : '';
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="accreset"]'); if (!el) return;
  ev.stopImmediatePropagation(); accReset(el.dataset.t);
}, true);

// ---------- Mercado › Lista: jogadores anunciados (treinadores e IA) ----------
function listedView() {
  const k = UI.lsk || 'tr', rows = [];
  if (k === 'me') return `${lsTabs(k)}${myListed()}`;
  for (const id in S.ps) {
    const s = S.ps[id]; if (!s || !P[id] || !(k === 'tr' ? s.list : s.loanList)) continue;   // v229: !P[id]
    const o = own(+id); if (!o || o === S.club || o === 'Livre' || o === 'Aposentado') continue;
    rows.push(+id);
  }
  rows.sort((a, b) => vw(b).ovr - vw(a).ovr);
  const tabs = lsTabs(k);
  const list = rows.slice(0, 60).map(id => {
    const s = S.ps[id], o = own(id), hu = Wd.isHuman(S, o);
    const right = k === 'tr' ? `<span class="lsr"><b class="num">T$ ${fmtK(MK.ask(S, id, S.club).fee)}</b><small>negociar ›</small></span>`
      : `<span class="lsr"><small>${esc(MK.LOAN_LEN[s.loanList.len])}</small><span class="lsbtn" role="button" tabindex="0" data-act="loanreq" data-id="${id}">Pedir</span></span>`;
    return playerRow(id, { meta: x => `${esc(P[x].pos)} · ${ageOf(x)} anos · ${hu ? `${ic('user')} ` : ''}${esc(o)}${s.loanList && s.loanList.abroad && k === 'lo' ? ' · <b style="color:var(--blue)">exterior</b>' : ''}`, right: () => `<span class="ob ${pcat(id).k} num">${vw(id).ovr}</span>${right}` });
  }).join('');
  return `${tabs}<div class="note">${k === 'tr' ? 'Jogadores que os clubes (treinadores e IA) colocaram à venda. Quem está na lista sai mais barato.' : 'Jogadores que os clubes aceitam emprestar. Seu clube paga só parte do salário e uma taxa pequena. <b>Exterior</b>: taxa mais cara, o clube de lá paga 30% do salário (40% se ele for titular num clube menor) e só empresta se ele for jogar. Com pouca minutagem, pode chamar de volta; no fim, dá pra exercer a opção de compra.'}</div>
    <div class="tile" style="padding:4px 12px"><div class="list">${list || '<p class="muted">Ninguém anunciado agora.</p>'}</div></div>`;
}
function lsTabs(k) {
  const mine = mySquad().filter(id => S.ps[id] && (S.ps[id].list || S.ps[id].loanList)).length;
  return `<div class="seg"><button class="${k === 'tr' ? 'on' : ''}" data-act="lsk" data-k="tr">Transferência</button><button class="${k === 'lo' ? 'on' : ''}" data-act="lsk" data-k="lo">Empréstimo</button><button class="${k === 'me' ? 'on' : ''}" data-act="lsk" data-k="me">Meus${mine ? ' · ' + mine : ''}</button></div>`;
}
// jogadores do SEU elenco que você anunciou (venda ou empréstimo)
function myListed() {
  const ids = mySquad().filter(id => S.ps[id] && (S.ps[id].list || S.ps[id].loanList)).sort((a, b) => vw(b).ovr - vw(a).ovr);
  const days = x => Math.max(0, (S.lastDay ?? 0) - x.day);
  const list = ids.map(id => { const s = S.ps[id], tags = [s.list ? `à venda há ${days(s.list)}d` : '', s.loanList ? `empréstimo (${esc(MK.LOAN_LEN[s.loanList.len])})` : ''].filter(Boolean).join(' · ');
    const offers = (S.offers || []).filter(o => o.id === id).length;
    return playerRow(id, { meta: x => `${esc(P[x].pos)} · ${ageOf(x)} anos · <b style="color:var(--mint)">${tags}</b>${offers ? ` · <b style="color:var(--lime)">${offers} proposta(s)</b>` : ''}`,
      right: () => `<span class="ob ${pcat(id).k} num">${vw(id).ovr}</span><span class="lsr"><small style="color:var(--mint);font-weight:800">${[s.list ? 'à venda' : '', s.loanList ? 'empréstimo' : ''].filter(Boolean).join(' + ')}</small><span class="lsbtn" role="button" tabindex="0" data-act="mylsoff" data-id="${id}">Tirar</span></span>` }); }).join('');
  return `<div class="note">Jogadores do seu elenco que você colocou na lista de transferências ou deixou disponíveis para empréstimo. Toque para abrir o card; "Tirar" cancela o anúncio.</div>
    <div class="tile" style="padding:4px 12px"><div class="list">${list || '<p class="muted">Você não anunciou ninguém. Abra o card de um jogador do seu elenco › Mercado.</p>'}</div></div>`;
}
// ---------- Mercado › Minha lista (observação) ----------
function watchView() {
  const ids = (S.watch || []).filter(id => P[id]);
  const list = ids.map(id => {
    const s = S.ps[id] || {}, o = own(id), hu = Wd.isHuman(S, o), mine = o === S.club;
    const tag = mine ? 'seu elenco' : o === 'Livre' ? 'livre' : o === 'Aposentado' ? 'aposentado' : s.list ? 'à venda' : s.loanList ? 'empréstimo' : '';
    return playerRow(id, { meta: x => `${esc(P[x].pos)} · ${ageOf(x)} anos · ${hu ? `${ic('user')} ` : ''}${esc(o)}${tag ? ` · <b>${tag}</b>` : ''}`,
      right: () => `<span class="ob ${pcat(id).k} num">${vw(id).ovr}</span><span class="lsr"><b class="num">T$ ${fmtK(vw(id).mv)}</b><span class="lsbtn" role="button" tabindex="0" data-act="obs" data-id="${id}">Tirar</span></span>` });
  }).join('');
  return `<div class="note">Jogadores que você marcou com ${ic('eye')} no card do jogador. Toque para abrir e negociar.</div>
    <div class="tile" style="padding:4px 12px"><div class="list">${list || '<p class="muted">Sua lista está vazia. Abra o card de um jogador e toque em “Adicionar aos favoritos”.</p>'}</div></div>`;
}
// troca na negociação: lista pronta com quem o clube aceita (IA) ou com o elenco todo (técnico real decide)
function swapBox(id, n) {
  const o = own(id), hu = Wd.isHuman(S, o);
  const mine = Wd.squad(S, S.club).filter(x => x !== id);
  const ev = mine.map(x => ({ x, v: MK.swapValue(S, x, o) })).filter(e => e.v.ok);
  if (!hu) ev.sort((a, b) => b.v.credit - a.v.credit); else ev.sort((a, b) => vw(b.x).mv - vw(a.x).mv);
  const cur = n.swap != null ? MK.swapValue(S, n.swap, o) : null;
  const open = UI.swapOpen || n.swap != null;
  const head = `<div class="row between"><b>${ic('swap')} Incluir jogador na troca</b>${n.swap != null ? `<button class="link small" data-act="swapclr">remover</button>` : ev.length ? `<button class="link small" data-act="swaptog">${open ? 'esconder' : `ver ${ev.length}`}</button>` : ''}</div>`;
  if (!ev.length) return `<div class="swapbox">${head}<div class="small muted">${hu ? 'Nenhum jogador seu pode entrar em troca agora (emprestados ou recém-chegados não contam).' : `O ${esc(o)} não se interessa por nenhum jogador do seu elenco agora.`}</div></div>`;
  const sel = cur && cur.ok ? `<div class="small" style="color:var(--lime)">${hu ? `${esc(P[n.swap].short)} vai na proposta. ${esc(S.coaches[o] ? S.coaches[o].name : 'O técnico')} decide se aceita.` : `${esc(cur.why)}: abate cerca de <b>T$ ${fmt(cur.credit)}</b> da taxa.`}</div>` : '';
  const list = open ? `<div class="swopts">${ev.map(({ x, v }) => `<button class="swopt ${n.swap === x ? 'on' : ''}" data-act="swappick" data-id="${x}">${av(x)}<div class="grow"><b>${esc(P[x].short)}</b><small>${P[x].pos} · ${ageOf(x)} anos · ovr ${vw(x).ovr}${hu ? '' : ` · ${esc(v.need ? 'precisam' : 'encaixa')}`}</small></div><span class="cr">${hu ? `T$ ${fmtK(vw(x).mv)}` : `−T$ ${fmtK(v.credit)}`}</span></button>`).join('')}</div>
    <div class="small muted">${hu ? 'Valor de mercado de cada um. O outro técnico vê a troca na proposta.' : `Só aparecem os ${ev.length} jogador(es) que o ${esc(o)} aceitaria. O valor ao lado é quanto abate da taxa.`}</div>` : `<div class="small muted">${hu ? `Ofereça um jogador seu junto (ou no lugar) do dinheiro.` : `${ev.length} jogador(es) seu(s) interessam ao ${esc(o)} e abatem a taxa.`}</div>`;
  return `<div class="swapbox">${head}${sel}${list}</div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act;
  if (a === 'lsk') { ev.stopImmediatePropagation(); UI.lsk = el.dataset.k; render(); }
  if (a === 'mylsoff') { ev.stopImmediatePropagation(); const s = S.ps[+el.dataset.id]; if (s) { delete s.list; delete s.loanList; save(); toast(`${P[+el.dataset.id].short} fora do mercado`); render(); } }
  else if (a === 'loanreq') { ev.stopImmediatePropagation(); const id = +el.dataset.id, b = MK.loanBase(S, id); UI.modal = { type: 'loanneg', id, fee: b.fee, share: b.share }; renderModal(); }
  else if (a === 'lnshare' || a === 'lnfee') { ev.stopImmediatePropagation(); const m = UI.modal; if (!m || m.type !== 'loanneg') return; const d = +el.dataset.d;
    if (a === 'lnshare') m.share = Math.max(20, Math.min(100, m.share + d * 10)); else { const st = vw(m.id).mv >= 500000 ? 5000 : 1000; m.fee = Math.max(0, m.fee + d * st); }
    m.msg = null; m.keep = true; renderModal(); }
  else if (a === 'lnsend') { ev.stopImmediatePropagation(); const m = UI.modal; gate(() => { const r = MK.requestLoan(S, m.id, { fee: m.fee, share: m.share }); save();   // v284: portão do mundo fresco
    if (r.ok) { toast(r.msg); UI.modal = null; renderModal(); render(); }
    else { if (r.status === 'counter') { m.fee = r.fee; m.share = r.share; } m.msg = r.msg; m.keep = true; renderModal(); } }); }
  else if (a === 'swapclr') { ev.stopImmediatePropagation(); if (UI.modal && UI.modal.neg) { UI.modal.neg.swap = null; UI.modal.neg.sent = null; UI.modal.keep = true; renderModal(); } }
  else if (a === 'swaptog') { ev.stopImmediatePropagation(); UI.swapOpen = !UI.swapOpen; if (UI.modal) { UI.modal.keep = true; renderModal(); } }
  else if (a === 'swappick') { ev.stopImmediatePropagation(); const n = UI.modal && UI.modal.neg; if (!n) return; const x = +el.dataset.id; n.swap = n.swap === x ? null : x; n.sent = null; n.res = null; UI.modal.keep = true; renderModal(); }
}, true);
document.addEventListener('change', ev => {
  if (ev.target.id !== 'swap-sel' || !UI.modal || !UI.modal.neg) return;
  UI.modal.neg.swap = ev.target.value ? +ev.target.value : null; UI.modal.neg.sent = null; UI.modal.keep = true; renderModal();
});

// lista de observação
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="obs"]'); if (!el) return;
  ev.stopImmediatePropagation();
  const id = +el.dataset.id; S.watch = S.watch || [];
  const i = S.watch.indexOf(id); if (i >= 0) S.watch.splice(i, 1); else S.watch.unshift(id);
  save(); toast(i >= 0 ? 'Removido dos favoritos' : 'Adicionado aos favoritos'); if (UI.modal) { UI.modal.keep = true; renderModal(); }
  if (UI.view === 'market') render();
}, true);

// ---------- pedido de empréstimo: taxa + divisão do salário ----------
function loanNegModal(m) {
  const id = m.id, b = MK.loanBase(S, id), o = own(id), v = vw(id);
  const part = Math.round(v.sal * m.share / 100), mine = MK.loanValue(b, m.fee, m.share), ok = mine >= b.value * 0.97;
  const bar = Math.max(4, Math.min(100, Math.round(mine / b.value * 100)));
  return `<h2 class="sech big">${ic('swap')} Pedir emprestado</h2>
    <div class="row" style="gap:10px;align-items:center">${av(id)}<div><b>${esc(P[id].name)}</b><div class="small muted">${esc(o)} · ${P[id].pos} · ${v.ovr} · ${esc(MK.LOAN_LEN[b.len])}</div></div></div>
    <p class="small muted" style="margin:0">Você decide quanto paga de taxa e qual parte do salário (T$ ${fmt(v.sal)}/dia) fica com o ${esc(S.club)}. Quanto mais salário você assume, menor a taxa que o ${esc(o)} exige.</p>
    <div class="eyebrow" style="margin:6px 0 0">Sua parte do salário</div>
    <div class="valsel"><button data-act="lnshare" data-d="-1" aria-label="Diminuir">−</button><div class="v"><b class="num">${m.share}%</b><span>T$ ${fmt(part)}/dia · ${esc(o)} paga ${100 - m.share}%</span></div><button data-act="lnshare" data-d="1" aria-label="Aumentar">+</button></div>
    <div class="eyebrow" style="margin:6px 0 0">Taxa de empréstimo</div>
    <div class="valsel"><button data-act="lnfee" data-d="-1" aria-label="Diminuir">−</button><div class="v"><b class="num">T$ ${fmt(m.fee)}</b><span>pedida pelo ${esc(o)}: T$ ${fmt(b.fee)} com ${b.share}%</span></div><button data-act="lnfee" data-d="1" aria-label="Aumentar">+</button></div>
    <div class="lnbar"><i style="width:${bar}%;background:${ok ? 'var(--lime)' : bar >= 80 ? 'var(--yellow)' : 'var(--coral)'}"></i></div>
    <div class="small ${ok ? '' : 'muted'}">${ok ? 'Proposta dentro do que o clube espera.' : bar >= 80 ? 'Perto: o clube deve fazer contraproposta.' : 'Abaixo do esperado: tende a ser recusada.'}</div>
    ${m.msg ? `<div class="note">${esc(m.msg)}</div>` : ''}
    <button class="btn" data-act="lnsend">Enviar pedido</button>`;
}

// ===== UI parte 12: sorteio ao vivo das copas (encena o sorteio que o jogo já fez) =====
// Os grupos já existem em S.comp[copa].groups (montados pote a pote). Aqui só mostramos a cerimônia:
// pote 1 → grupos A, B, C, D; pote 2 → … Todos os treinadores veem o mesmo resultado.
const DRAW_CUPS = ['LIB', 'SUL', 'CONF', 'NE', 'SSE', 'VER'];
const drawCups = () => DRAW_CUPS.filter(k => S.comp && S.comp[k] && S.comp[k].groups && S.comp[k].groups.length);
const drawReady = () => !!(S && S.comp && S.comp.LIB && S.comp.LIB.groups && S.comp.LIB.groups.length);
function drawMyCup() {
  const L = drawCups();
  return L.find(k => S.comp[k].teams.includes(S.club)) || L.find(k => S.comp[k].teams.some(c => Wd.isHuman(S, c))) || L[0];
}
// aviso pros treinadores das Séries B e C: sem Diamante, chegou o Ouro (some quando o treinador aperta Entendi)
function ouroBanner() {
  if (!S || !S.club || S.unemployed || !myOuro() || (S.flags && S.flags.ouroInfo)) return '';
  const dv = Wd.divOf(S, S.club) || 'B';
  return `<div class="drawban ouroban"><span class="catb big" style="--cc:var(--c-our)">${ic('medal')}</span><span class="grow"><b>Série ${dv}: chegou o Ouro</b><span>Na B e na C não tem jogador Diamante. Seus diamantes agora valem como <b style="display:inline;font-size:inherit;color:var(--c-our)">Ouro</b> (1 pra 1). No dia do pacote Diamante você recebe o <b style="display:inline;font-size:inherit;color:var(--c-our)">Ouro Especial</b>: jogadores de 81 a 84, emprestados por 3 meses com 90% do salário pago pela origem, por 2★ + 1 Ouro. Subiu pra Série A? Cada 2 Ouro viram 1 diamante.</span><button class="btn sm" style="margin-top:10px;display:flex" data-act="ouroseen">Entendi</button></span></div>`;
}
// aviso de Data FIFA: jogadores do meu elenco convocados (some com Entendi ou quando eles voltam)
function callBanner() {
  if (!S || !S.club || S.unemployed) return '';
  const ids = Wd.squad(S, S.club).filter(id => (S.ps[id] || {}).away > 1 && !SE.lineupAvail(S, id));
  if (!ids.length) return '';
  const call = (S.selecao || []).find(c => c.season === S.season && c.k <= S.slot);
  const key = (call ? call.key : S.season + '-' + S.slot) + '-' + ids.slice().sort().join('.');
  if (S.flags && S.flags.callSeen === key) return '';
  const n = Math.max(...ids.map(id => S.ps[id].away)), jogos = Math.max(0, n - 1);
  return `<div class="drawban callban"><span class="catb big" style="--cc:var(--purple)">${ic('user')}</span><span class="grow"><b>Data FIFA: ${ids.length} convocado${ids.length > 1 ? 's' : ''} do ${esc(S.club)}</b><span>${ids.map(id => `<b style="display:inline;font-size:inherit">${esc(P[id].short)}</b>`).join(', ')} ${ids.length > 1 ? 'desfalcam' : 'desfalca'} o time ${jogos > 1 ? `nos próximos ${jogos} jogos` : 'no próximo jogo'}. Ajuste a escalação antes do apito.</span>
    <span class="row" style="gap:8px;margin-top:10px"><button class="btn sm" data-act="goto" data-v="squad" data-sub="lineup">${ic('tactic')} Escalação</button>${(S.selecao || []).length ? `<button class="btn sm alt" data-act="calllist">${ic('user')} Todos os convocados</button>` : ''}<button class="btn sm alt" data-act="callseen" data-k="${key}">Entendi</button></span></span></div>`;
}
function drawBanner() {
  if (!drawReady() || S.unemployed || S.drawSeen === S.season) return '';
  const k = drawMyCup(), mine = S.comp[k] && S.comp[k].teams.includes(S.club);
  return `<button class="drawban" data-act="drawshow" data-k="${k}"><span class="dbball"></span><span class="grow"><b>Sorteio das copas</b><span>${mine ? `O ${esc(S.club)} conhece hoje seus adversários na ${esc(SE.COMP_NAME[k])}` : 'Os grupos das copas foram definidos'}</span></span><span class="dbgo">${ic('arrowR')} Assistir</span></button>`;
}
const drawSeq = k => { const G = S.comp[k].groups, n = Math.max(...G.map(g => g.length)), out = []; for (let p = 0; p < n; p++) G.forEach((g, gi) => { if (g[p]) out.push({ c: g[p], g: gi, p }); }); return out; };
const GL = 'ABCDEFGH';
function drawSummary(k) {
  const G = S.comp[k].groups, avg = g => g.reduce((a, c) => a + SE.strength(S, c), 0) / g.length;
  const death = G.map((g, i) => [i, avg(g)]).sort((a, b) => b[1] - a[1])[0][0];
  const hum = G.map((g, i) => [i, g.filter(c => Wd.isHuman(S, c))]).filter(x => x[1].length >= 2);
  const mine = G.findIndex(g => g.includes(S.club));
  const tags = [`<span class="dtag death">${ic('flame')} Grupo da morte: <b>Grupo ${GL[death]}</b></span>`];
  if (mine >= 0) tags.push(`<span class="dtag me">${ic('user')} ${esc(S.club)} no <b>Grupo ${GL[mine]}</b>${mine === death ? ' (o da morte!)' : ''}</span>`);
  hum.forEach(([i, cs]) => tags.push(`<span class="dtag hum">${ic('vs')} Duelo de treinadores no Grupo ${GL[i]}: ${cs.map(esc).join(' × ')}</span>`));
  return `<div class="dsum">${tags.join('')}</div>`;
}
// ---------- apresentadores em pixel art (personagens fictícios) ----------
const HOST_IDLE = ['............', '............', '............', '...hhhhhh...', '..hhhhhhhh..', '..hssssssh..', '..sesssses..', '..ssssssss..', '..sssrrsss..', '...ssssss...', '....ssss....', '..jjjwwjjj..', '.jjjjwtjjjj.', 'jjjjjwtjjjjj', 'jj.jjwtjj.jj', 'jj.jjwtjj.jj', 'jj.jjjjjj.jj', 'ss.jjjjjj.sm', '...jjjjjj..m', '...pppppp...', '...pp..pp...', '...pp..pp...', '...pp..pp...', '...pp..pp...', '..kkk..kkk..'];
const HOST_UP = (() => { const g = HOST_IDLE.map(r => [...r]); for (let y = 12; y <= 18; y++) { g[y][10] = '.'; g[y][11] = '.'; } g[17][1] = 'm'; for (let y = 3; y <= 11; y++) g[y][10] = y === 3 ? 's' : 'j'; ['bbb', 'bcb', 'bbb'].forEach((r, y) => [...r].forEach((ch, x) => { g[y][9 + x] = ch; })); return g.map(r => r.join('')); })();
const GIRL_IDLE = ['............', '............', '............', '...hhhhhh...', '..hhhhhhhh..', '.hhsssssshh.', '.hhsesseshh.', '.hhsssssshh.', '.hhssrrsshh.', '.hh.ssss.hh.', '.hh..ss..hh.', '.hddddddddh.', '.sddddddddds', '.sdddddddds.', '.s.dddddd.s.', '.s.dddddd.s.', '...dddddd...', '..dddddddd..', '..dddddddd..', '.dddddddddd.', '....s..s....', '....s..s....', '....s..s....', '...kk..kk...', '............'];
const GIRL_UP = (() => { const g = GIRL_IDLE.map(r => r); g[13] = '..sbccccbs..'; g[14] = '...bccccb...'; g[15] = '...bbbbbb...'; return g; })();
function presSVG(grid, pal, label) {
  let px = '';
  grid.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) px += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[ch]}"/>`; }));
  return `<svg viewBox="0 0 12 25" shape-rendering="crispEdges" aria-label="${label}">${px}</svg>`;
}
const HOST_PAL = { h: '#2B1B12', s: '#E0A878', e: '#1B1210', r: '#B2453A', j: '#1D2A4A', w: '#FFFFFF', t: 'var(--k3)', p: '#16203A', k: '#0B0B0B', m: '#3A3A3A', b: '#C9CED8', c: '#FFFFFF' };
const GIRL_PAL = { h: '#7A2E1C', s: '#C58C5C', e: '#1B1210', r: '#C8324A', d: 'var(--k3)', k: '#0B0B0B', b: '#C9CED8', c: '#FFFFFF' };
const presHTML = (who, up) => who === 'host' ? presSVG(up ? HOST_UP : HOST_IDLE, HOST_PAL, 'Apresentador') : presSVG(up ? GIRL_UP : GIRL_IDLE, GIRL_PAL, 'Apresentadora');
function drawSay(who, txt) {
  for (const w of ['host', 'girl']) {
    const el = document.getElementById('dp-' + w), bub = document.getElementById('db-' + w); if (!el || !bub) continue;
    const on = w === who && txt;
    el.innerHTML = presHTML(w, on); el.classList.toggle('talk', !!on);
    bub.textContent = on ? txt : ''; bub.classList.toggle('on', !!on);
  }
}
// bolinhas empilhadas no fundo do pote (posições fixas, parecem jogadas)
const BALL_POS = [[18, 70], [42, 72], [66, 70], [30, 50], [54, 52], [78, 48], [12, 46], [44, 30]];
function drawShowHTML(m) {
  const k = m.cup, G = S.comp[k].groups, done = !!(m.done && m.done[k]);
  const seq = drawSeq(k), npots = Math.max(...G.map(g => g.length));
  const tabs = drawCups().map(c => `<button class="chip ${c === k ? 'on' : ''}" data-act="drawcup" data-k="${c}">${esc(SE.COMP_NAME[c])}</button>`).join('');
  const hcls = c => c === S.club ? 'me' : Wd.isHuman(S, c) ? 'hum' : '';
  const slot = (c, gi, p) => `<div class="dslot ${done ? 'on ' + hcls(c) : ''}" id="ds-${gi}-${p}">${done ? `${crest(c, 'sm')}<span>${esc(c)}</span>` : `<i>${p + 1}</i>`}</div>`;
  const groups = G.map((g, gi) => `<div class="dgrp"><b>Grupo ${GL[gi]}${k === 'VER' ? ` <small>${gi < 2 ? 'Norte' : 'Centro-Oeste'}</small>` : ''}</b>${g.map((c, p) => slot(c, gi, p)).join('')}</div>`).join('');
  const pots = Array.from({ length: npots }, (_, p) => { const n = seq.filter(x => x.p === p).length; return `<div class="dpot" id="dp-${p}"><div class="bowl"><span class="rim"></span>${Array.from({ length: n }, (_, i) => `<i class="bb ${done ? 'out' : ''}" style="left:${BALL_POS[i % 8][0]}%;bottom:${100 - BALL_POS[i % 8][1]}%"></i>`).join('')}<span class="glare"></span></div><span class="plbl">Pote ${p + 1}</span></div>`; }).join('');
  return `<div class="drawshow cmp-${k}">
    <div class="dhead"><h2 class="sech big" style="margin:0">${ic('trophy')} Sorteio</h2><div class="dctl">${done ? '' : `<button class="chip ${m.sp > 1 ? 'on' : ''}" data-act="drawspeed">×2</button><button class="chip" data-act="drawskip">Pular</button>`}</div></div>
    <div class="chips hs">${tabs}</div>
    <div class="dstage"><div class="dtv"><span class="dtvl"><img class="tspn" src="${TSPN_URI}" alt="TSPN"><span class="vivo"><i></i>VIVO</span></span><span class="dcname">${esc(SE.COMP_NAME[k])}</span></div><div class="dpots">${pots}</div>
      <div class="dcenter ${done ? 'done' : ''}">
        <div class="dpres l"><div class="dbub ${done ? 'on' : ''}" id="db-host">${done ? 'Grupos definidos! Boa sorte a todos.' : ''}</div><div class="dpx" id="dp-host">${presHTML('host', false)}</div></div>
        <div class="dmid"><div class="dball" id="dball"><div class="dbin"></div></div><div class="dcap" id="dcap">${done ? 'Sorteio concluído' : ''}</div></div>
        <div class="dpres r"><div class="dbub" id="db-girl"></div><div class="dpx" id="dp-girl">${presHTML('girl', false)}</div></div>
      </div></div>
    <div class="dgroups">${groups}</div>
    <div id="dsum">${done ? drawSummary(k) : ''}</div>
  </div>`;
}
let DRAW_TOK = 0;
const dwait = ms => new Promise(r => setTimeout(r, ms));
async function drawRun() {
  const m = UI.modal; if (!m || m.type !== 'drawshow') return;
  const k = m.cup; if (m.done && m.done[k]) return;
  const tok = ++DRAW_TOK, alive = () => tok === DRAW_TOK && UI.modal === m && document.getElementById('dball');
  const sp = () => m.sp || 1, seq = drawSeq(k), name = SE.COMP_NAME[k];
  drawSay('host', `Boa noite! Começa o sorteio da ${name}!`);
  await dwait(2300 / sp()); if (!alive()) return;
  let lastPot = -1;
  for (const it of seq) {
    if (!alive()) return;
    const ball = document.getElementById('dball'), cap = document.getElementById('dcap'), inn = ball.querySelector('.dbin');
    const me = it.c === S.club, hu = Wd.isHuman(S, it.c), slow = me || hu;
    if (it.p !== lastPot) { lastPot = it.p; drawSay('host', `Pote ${it.p + 1}!`); await dwait(1300 / sp()); if (!alive()) return; }
    document.querySelectorAll('.dpot').forEach(x => x.classList.toggle('on', x.id === 'dp-' + it.p));
    const pot = document.getElementById('dp-' + it.p), bowl = pot.querySelector('.bowl');
    bowl.classList.remove('shake'); void bowl.offsetWidth; bowl.classList.add('shake');
    await dwait(750 / sp()); if (!alive()) return;
    const bb = pot.querySelector('.bb:not(.out)'); if (bb) bb.classList.add('out');
    cap.textContent = `Grupo ${GL[it.g]}`;
    drawSay('girl', slow ? 'Atenção pra essa bolinha…' : '');
    ball.className = 'dball spin' + (slow ? ' slow' : ''); ball.style.transform = ''; inn.innerHTML = '';
    await dwait((slow ? 2500 : 850) / sp()); if (!alive()) return;
    ball.className = 'dball open ' + (me ? 'me' : hu ? 'hum' : '');
    inn.innerHTML = `${crest(it.c, 'lg')}<span>${esc(it.c)}</span>`;
    drawSay('girl', me ? `${it.c}! Grupo ${GL[it.g]}!` : `${it.c}, Grupo ${GL[it.g]}`);
    try { if (slow) SFX.star(); else SFX.flip(); } catch (e) {}
    await dwait((slow ? 2300 : 1100) / sp()); if (!alive()) return;
    const tgt = document.getElementById(`ds-${it.g}-${it.p}`), a = ball.getBoundingClientRect(), b = tgt.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ball.style.transition = `transform ${Math.round(520 / sp())}ms ease-in, opacity ${Math.round(520 / sp())}ms`;
    ball.style.transform = `translate(${dx}px, ${dy}px) scale(.25)`; ball.style.opacity = '0';
    await dwait(520 / sp()); if (!alive()) return;
    tgt.className = 'dslot on pop ' + (me ? 'me' : hu ? 'hum' : ''); tgt.innerHTML = `${crest(it.c, 'sm')}<span>${esc(it.c)}</span>`;
    ball.style.transition = 'none'; ball.style.transform = ''; ball.style.opacity = '1'; ball.className = 'dball'; inn.innerHTML = '';
    await dwait(300 / sp());
  }
  if (!alive()) return;
  drawSay('host', 'Grupos definidos! Boa sorte a todos.');
  drawFinish(m, k);
}
function drawFinish(m, k) {
  m.done = m.done || {}; m.done[k] = true;
  if (S.drawSeen !== S.season) { S.drawSeen = S.season; try { save(); } catch (e) {} }
  const cap = document.getElementById('dcap'); if (cap) { cap.textContent = 'Sorteio concluído'; cap.parentNode.classList.add('done'); }
  const sm = document.getElementById('dsum'); if (sm) sm.innerHTML = drawSummary(k);
  document.querySelectorAll('.dpot').forEach(x => x.classList.remove('on'));
  const ctl = document.querySelector('.drawshow .dctl'); if (ctl) ctl.innerHTML = '';
  try { SFX.applause(); } catch (e) {}
}
function drawOpen(k) { UI.modal = { type: 'drawshow', cup: k || drawMyCup(), sp: 1, done: {}, force: true }; renderModal(); drawRun(); }
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act; if (!/^draw(show|cup|speed|skip)$/.test(a)) return;
  ev.stopImmediatePropagation();
  const m = UI.modal;
  if (a === 'drawshow') return drawOpen(el.dataset.k);
  if (!m || m.type !== 'drawshow') return;
  if (a === 'drawcup') { DRAW_TOK++; m.cup = el.dataset.k; m.force = true; renderModal(); drawRun(); }
  else if (a === 'drawspeed') { m.sp = m.sp > 1 ? 1 : 2.2; el.classList.toggle('on', m.sp > 1); }
  else if (a === 'drawskip') { DRAW_TOK++; m.done = m.done || {}; m.done[m.cup] = true; if (S.drawSeen !== S.season) { S.drawSeen = S.season; try { save(); } catch (e) {} } m.force = true; renderModal(); }
}, true);

// ---------- manual rápido (botão ? no topo e na tela de entrada) ----------
const HELP = [
  ['ball', 'O jogo em 1 minuto', `<p>Você é o treinador de um clube brasileiro de verdade, numa liga online com os amigos. <b>O servidor joga as partidas sozinho</b>, no horário, mesmo com o app fechado: o seu trabalho é deixar o time pronto antes do apito.</p>
    <ul><li><b>Temporada</b>: 56 jogos. No modo Normal são 2 por dia (12h e 18h); no Turbo, 8 por dia.</li>
    <li><b>Pré-temporada</b>: 16 horas (4 no Turbo) com mercado aberto e 3 amistosos pra testar o time.</li>
    <li><b>Divisões</b>: quem cria a liga escolhe quais séries (A, B e/ou C) têm treinadores, com 20 vagas cada. As outras são jogadas pela IA. Sobem e caem 4 clubes em cada; a Série D sai das copas regionais.</li>
    <li><b>Como você pega o clube</b>: por <b>sorteio</b> (começa pela série mais alta aberta) ou por <b>escolha</b> entre os clubes livres, conforme a regra da liga.</li>
    <li><b>Vagas</b>: cada divisão aberta tem até 20 treinadores; demitido ou desempregado não ocupa vaga. Liga cheia? O ADM pode reservar um clube sem técnico no Painel do ADM e mandar um <b>código de vaga</b>: você digita em "Código de acesso ou de vaga" ao entrar na liga e cria o treinador direto nesse clube (vale 72 horas).</li>
    <li><b>Online ou Solo/Close Friends</b>: na liga Online entram até 20 treinadores por divisão aberta e só o ADM adianta rodadas. No Solo/Close Friends você joga sozinho ou com até 3 amigos, escolhe qualquer um dos 60 clubes e tem o botão de avançar no card do jogo (com amigos, avança quando todos tocam em Pronto). Ninguém é demitido por sumir.</li>
    <li><b>Grupo da liga</b>: se o ADM colocou o link, o botão verde do WhatsApp aparece no topo da tela do clube.</li>
    <li>Tudo o que você mexe é salvo sozinho. A bolinha verde no topo mostra que está sincronizado.</li></ul>`],
  ['cal', 'Sua rotina (checklist)', `<ul class="hchk"><li><b>Escalação e tática</b> antes de cada jogo (Elenco › Escalação).</li>
    <li><b>Treino</b>: escolha a intensidade do dia.</li>
    <li><b>Coletiva</b>: responda as perguntas da imprensa antes e depois dos jogos.</li>
    <li><b>Palpites</b>: 10 jogos da rodada da sua série.</li>
    <li><b>Pacote do dia</b>: abra antes de expirar (não acumula).</li>
    <li><b>Mercado</b>: propostas recebidas, leilões e jogadores listados.</li>
    <li><b>DM e cansaço</b>: quem está no vermelho descansa.</li></ul>
    <p>A <b>agenda</b> na tela do clube mostra o que vem aí, dia a dia. Toque num card pra abrir o calendário do mês.</p>`],
  ['tactic', 'Escalação, cansaço e cartões', `<ul><li>Escolha formação, estilo e titulares. Capitão, vice e cobrador de pênalti acompanham o time titular.</li>
    <li><b>Cansaço</b>: um jogo inteiro gasta cerca de 28 pontos de condição (estilos de pressão gastam mais). Cada dia do calendário recupera uma parte. <b>Semana com copa no meio exige rodízio</b>: quem joga tudo cansa, rende menos e se machuca mais.</li>
    <li><b>Cartões</b>: 3 amarelos na mesma competição = 1 jogo de suspensão. Vermelho direto = 2 jogos; dois amarelos no jogo = 1. Em Elenco › Números aparece quem está <b>pendurado</b>.</li>
    <li><b>Data FIFA</b>: os convocados perdem 2 rodadas de liga (as copas não são afetadas). A lista sai logo depois do jogo anterior, então dá tempo de ajustar.</li>
    <li>Se você esquecer, o time entra com a última escalação salva (mesmo com gente cansada), e o jogo completa sozinho as vagas de quem está lesionado, suspenso ou convocado.</li></ul>`],
  ['wallet', 'Dinheiro, estrelas, diamante e Ouro', `<ul><li><b>T$ (caixa)</b>: paga salários todo dia e as compras. Entra com bilheteria, prêmios e vendas. <b>Caixa negativo atrasa salários</b>, e isso derruba o grupo e a diretoria. Em Finanças você divide a verba entre salários e compras.</li>
    <li><b>Estrelas</b> ${ic('star')}: servem pra abrir pacotes. Você ganha com etapas do objetivo, 3 e 6 vitórias seguidas, vitória em clássico, 5 acertos nos palpites, amistosos e mais.</li>
    <li><b>Diamante</b> (Série A) e <b>Ouro</b> (Séries B e C): moeda rara dos melhores pacotes. Vêm com 10 vitórias seguidas, 10 acertos nos palpites e metas grandes. Quem sobe pra Série A troca 2 Ouro por 1 diamante.</li>
    <li>No começo de cada temporada, a liga dá um reforço de estrelas e diamantes/Ouro pra quem tem elenco mais fraco.</li></ul>`],
  ['box', 'Pacotes', `<ul><li><b>1 pacote por dia do jogo</b>, só com a janela de transferências fechada (no Turbo, a cada 6 horas). <b>Não acumula</b>: passou sem abrir, perdeu. Quando não há pacote, o card na tela do clube fica cinza com o contador pro próximo.</li>
    <li>A categoria gira: <b>Diamante</b> (na B e na C, <b>Ouro Especial</b>), <b>Ouro</b>, <b>Prata</b> e <b>Bronze</b>.</li>
    <li>Preço: Diamante 5${ic('star')} + 1 diamante · Ouro Especial 2${ic('star')} + 1 Ouro · Ouro 5${ic('star')} · Prata 3${ic('star')} · Bronze 1${ic('star')}.</li>
    <li>Os jogadores vêm de clubes sem treinador na liga (exterior e livres). O salário sai do seu caixa. Diamante e Ouro Especial trazem craques por tempo limitado, com parte do salário paga pelo clube de origem.</li>
    <li>Cada treinador recebe jogadores diferentes, e você pode escolher não levar ninguém.</li></ul>`],
  ['handshake', 'Mercado e janelas', `<ul><li><b>Janela aberta</b>: pré-temporada até o jogo 16 e a janela de ajustes (jogos 32 a 39). Fora disso, contratações com a IA ficam pra próxima janela.</li>
    <li><b>Entre treinadores</b> dá pra fechar negócio mesmo com a janela fechada: o dinheiro sai na hora e o jogador se apresenta quando a janela abrir.</li>
    <li>Compre, venda, empreste e troque. Quem recebe emprestado não pode vender nem renovar. O dono pode chamar de volta, com reembolso proporcional da taxa.</li>
    <li><b>Pré-contrato</b>: a partir do jogo 28, jogadores com contrato no fim podem assinar de graça pra próxima temporada.</li>
    <li>Craque na Europa não vem só por dinheiro, e clube pede mais pelo titular. O elenco precisa ter entre 18 e 45 jogadores.</li></ul>`],
  ['trophy', 'Competições', `<ul><li><b>Séries A, B e C</b>: 38 rodadas, com 4 que sobem e 4 que caem.</li>
    <li><b>Copa do Brasil</b>: 32 clubes (Série A + 12 da B), mata-mata em jogo único com pênaltis. A final tem ida e volta.</li>
    <li><b>Continentais</b>: Libertadores, Sul-Americana e Conferência, pra quem se classifica pela tabela e pelas copas.</li>
    <li><b>Vagas</b>: Libertadores pro 1º ao 4º da Série A e pros campeões da Copa do Brasil, da Libertadores e da Sul-Americana; Pré-Libertadores pros 2 seguintes e pro vice da Copa do Brasil; depois 5 vagas na Sul-Americana e 5 na Conferência. Cada clube fica com uma vaga só, a melhor: se o campeão já estava classificado, a vaga passa pro próximo da tabela (até o 16º). A tabela mostra as zonas já com os campeões definidos (★ vaga por título, ↓ vaga herdada).</li>
    <li><b>Copa Intercontinental</b>: no dia do encerramento, o campeão da Libertadores enfrenta o campeão europeu em jogo único, campo neutro, com a tática atual do time. A nova temporada só começa depois dele.</li>
    <li><b>Regionais</b>: Copa do Nordeste, Sul-Sudeste e Copa Verde. O clube da Série D que for mais longe em cada uma sobe pra Série C.</li>
    <li>Sorteios, tabelas e chaves ficam em Torneios.</li></ul>`],
  ['mic', 'Coletiva, DNA e fama', `<ul><li>Cada resposta fala com uma <b>plateia</b>: Grupo, Torcida ou Diretoria (ou é neutra). Ela agrada um pilar e incomoda outro: falar pro grupo incomoda a diretoria, pra torcida incomoda o grupo, pra diretoria incomoda a torcida. As setas em cada resposta mostram isso antes de você escolher.</li>
    <li><b>Coletiva quente</b> (clássico, mata-mata ou depois de 3 derrotas): vale o dobro. Falar pra mesma plateia 3 vezes seguidas vale metade. Jogador citado, rival e arbitragem continuam reagindo à fala, e ela vira manchete.</li>
    <li>Dá pra escolher uma resposta pronta ou escrever a sua.</li>
    <li>Cada clube tem um <b>DNA</b> (${C.DNA_MODE === 'B' ? 'Celeiro, Caixa, Caldeirão ou Copa, e um secundário que vale metade' : 'Formador, Projeto, Raça ou Camisa'}) com uma pergunta, e o que você faz em campo vira <b>fama</b> (Revelador, Gestor, Raiz ou Decisivo). Veja no seu cartão de treinador. <b>Não existe DNA nem fama melhor</b>: só diferentes.</li>
    <li>Entregar o que o DNA pede pinta uma <b>faixa colorida</b> nos pilares (o pilar da casa enche mais). Ela só soma e vai sumindo se você parar de entregar. Em troca, a régua do cargo em clube com DNA é um pouco mais alta: quem ignora o DNA fica mais exposto.</li></ul>`],
  ['fama', 'Fama do treinador', `<ul><li>São 4 famas: <b>Revelador</b> (minutos pros jovens até 23 anos), <b>Gestor</b> (mercado no azul, folha controlada e salário em dia), <b>Raiz</b> (render mais em casa do que fora) e <b>Decisivo</b> (terminar acima do que o elenco indica).</li>
    <li>Elas foram feitas pra ficarem equilibradas: dá pra mirar uma sem largar a temporada, e só a Decisivo depende de ganhar. Toque num cartão pra ver a conta de cada uma.</li>
    <li>Cada fama tem 6 traços por temporada. Veja o andamento no seu cartão de treinador (toque no seu nome).</li>
    <li>Fechou os 6 até a virada da temporada: ganha a tag. Ela se renova se você fechar de novo; se passar uma temporada sem fechar, cai.</li>
    <li>Valem no máximo 2 famas ao mesmo tempo. Quem troca de clube no meio da temporada conta só o que fez desde a chegada.</li>
    <li>Por enquanto a fama é reconhecimento: ainda não muda nada no jogo.</li></ul>`],
  ['user', 'Seu cargo', `<ul><li>A sua sustentação no cargo vem de 3 pilares. A nota do cargo é <b>diretoria</b> (60%) e <b>torcida</b> (40%); o <b>grupo</b> decide nos extremos: abaixo de 20 o técnico perde o vestiário, acima de 70 os jogadores pedem uma segunda chance. Clube de meta alta é cobrado pela camisa: chegar à semifinal não basta, perder a decisão custa. Resultado, objetivo da temporada, salários em dia e coletivas pesam nisso.</li>
    <li>Abaixo de 40 vem o ultimato: pontos em 3 jogos. O que acontece depois depende da regra que o ADM escolheu (desligada, branda ou realista).</li>
    <li>Você começa protegido nas 8 primeiras rodadas no clube.</li>
    <li><b>Não suma:</b> no Turbo, 2 dias sem entrar e o cargo balança, 3 dias e a diretoria te demite por abandono; no Normal, 4 e 5 dias. A vaga abre pra outro treinador.</li>
    <li>Clubes podem te fazer proposta, e vagas abertas aparecem em Carreira. Dá pra pedir demissão e assumir outro clube sem treinador.</li></ul>`],
  ['sprout', 'Treino e base', `<ul><li><b>Leve</b> recupera mais e evolui menos; <b>Intenso</b> evolui mais, mas cansa e aumenta o risco de lesão.</li>
    <li>Jovens evoluem mais rápido. Depois dos 30 quase não evoluem, e acima de 31 anos o overall cai na virada da temporada.</li>
    <li>A base revela garotos todo ano. Subir um jovem e dar minutos é o jeito mais barato de montar elenco.</li></ul>`],
  ['star', 'Dicas de quem já joga', `<ul><li>Abra o app pelo menos uma vez por dia: pacote, coletiva e palpites dão estrelas de graça.</li>
    <li>Folha salarial alta demais quebra o caixa no meio da temporada. De olho nos dias de caixa em Finanças.</li>
    <li>Rodízio antes de semana de copa vale mais que o 11 ideal cansado.</li>
    <li>Use o Amistoso pra testar formação sem arriscar pontos.</li>
    <li>Toque em qualquer jogador, clube ou treinador pra ver o card completo.</li>
    <li>Achou um erro? Use o botão de inseto no topo pra reportar. A resposta aparece ali mesmo.</li></ul>`]
];
function helpModal(m) {
  const open = m.i ?? 0;
  const idx = `<div class="hidx">${HELP.map(([i, t], n) => `<button class="${n === open ? 'on' : ''}" data-act="helpgo" data-i="${n}">${ic(i)}<span>${t}</span></button>`).join('')}</div>`;
  const secs = HELP.map(([i, t, body], n) => `<details class="hsec" id="help-${n}" ${n === open ? 'open' : ''}><summary>${ic(i)} ${t}</summary><div class="hbody">${body}</div></details>`).join('');
  return `<h2 class="disp" style="font-size:32px;margin:0">${ic('help')} Manual rápido</h2>
    <p class="muted small" style="margin:0">Tudo o que você precisa saber pra começar. Toque num assunto.</p>
    ${idx}${secs}
    ${S && S.league ? (leagueWa() ? waBtn(true, leagueWa()) : '') : waBtn(true)}
    <p class="muted small" style="margin:0">Mais detalhes em cada tela: procure os textos em cinza embaixo dos quadros.</p>`;
}
function helpBanner() {
  if (!S || !S.club || (S.flags && S.flags.helpSeen)) return '';
  return `<div class="drawban helpban"><span class="catb big" style="--cc:var(--blue)">${ic('help')}</span><span class="grow"><b>Novo por aqui?</b><span>O manual rápido explica tudo em poucos minutos: rotina, pacotes, mercado e moedas.</span>
    <span class="row" style="gap:8px;margin-top:10px"><button class="btn sm" data-act="help">${ic('help')} Abrir manual</button><button class="btn sm alt" data-act="helpseen">Já sei jogar</button></span></span></div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="help"],[data-act="helpgo"],[data-act="helpseen"]'); if (!el) return;
  ev.stopImmediatePropagation();
  const a = el.dataset.act;
  if (a === 'help') { UI.modal = { type: 'help', i: 0 }; if (S && S.flags && S.club && !S.flags.helpSeen) { S.flags.helpSeen = 1; try { save(); } catch (e) {} } renderModal(); }
  else if (a === 'helpseen') { if (S && S.flags) { S.flags.helpSeen = 1; try { save(); } catch (e) {} } render(); }
  else if (a === 'helpgo') { const i = +el.dataset.i; UI.modal.i = i; UI.modal.keep = true; renderModal(); setTimeout(() => { const d = document.getElementById('help-' + i); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30); }
}, true);

// ---------- presença: marca que o treinador abriu o app (base da regra de inatividade) ----------
function seenBeat() {
  try {
    if (!NET.online || !S || !S.desks || !S.desks[S.__me] || document.visibilityState === 'hidden') return;
    if (Date.now() - (S.seen || 0) < 20 * 60e3) return;
    S.seen = Date.now(); NET.touched();
  } catch (e) {}
}
setInterval(seenBeat, 60e3);
try { document.addEventListener('visibilitychange', () => setTimeout(seenBeat, 1500)); } catch (e) {}
setTimeout(seenBeat, 8000);
// aviso: demitido por inatividade
function idleBanner() {
  if (!S || !S.idle || !S.idle.fired || (S.flags && S.flags.idleSeen === S.idle.at)) return '';
  return `<div class="drawban" style="--cc:var(--coral)"><span class="catb big" style="--cc:var(--coral)">${ic('clock')}</span><span class="grow"><b>Demitido por inatividade</b><span>Você ficou ${EV.idleLim(S).fd} dias sem entrar e o ${esc(S.idle.club || 'clube')} contratou um interino. Escolha uma proposta ou vaga aberta abaixo pra voltar.</span>
    <span class="row" style="gap:8px;margin-top:10px"><button class="btn sm alt" data-act="idleseen" data-k="${S.idle.at}">Entendi</button></span></span></div>`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="idleseen"],[data-act="becomespect"],[data-act="joinspect"]'); if (!el) return;
  ev.stopImmediatePropagation();
  const a = el.dataset.act;
  if (a === 'idleseen') { S.flags = S.flags || {}; S.flags.idleSeen = +el.dataset.k; save(); render(); }
  else if (a === 'becomespect') {
    if (!UI.specArm) { UI.specArm = true; admRefresh(); return; }
    UI.specArm = false;
    NET.sync({ mutate: () => { if (NET.isAdmin()) EV.becomeSpect(S); } }).then(() => { toast('Agora você só administra a liga'); UI.view = 'home'; render(); });
  }
  else if (a === 'joinspect') { el.disabled = true; NET.joinSpect().then(r => { if (r && r.err) { toast(r.err, true); el.disabled = false; return; } UI.lobby = { mode: 'menu' }; UI.view = 'home'; render(); }); }
}, true);
// tela do ADM sem time
function vSpect() {
  const n = Object.values(S.desks || {}).filter(d => !d.unemployed).length;
  return `${topbar()}<div class="stack"><h1 class="disp" style="font-size:40px;margin:0">${ic('lock', '', 'color:var(--purple)')} Modo ADM</h1>
    <p class="muted" style="margin:0">Você administra a <b>${esc((S.league && S.league.name) || 'liga')}</b> sem comandar um time. ${n} treinador${n === 1 ? '' : 'es'} jogando.</p>
    <div class="row wrap" style="gap:8px"><button class="btn" data-act="modal" data-m="admin">${ic('lock')} Painel do ADM</button><button class="btn alt" data-act="goto" data-v="comps" data-sub="A">${ic('trophy')} Tabelas</button><button class="btn alt" data-act="goto" data-v="news">${ic('news')} Notícias</button></div>
    ${waLeague()}
    ${leagueRoster()}
    <p class="small muted" style="margin:0">Quer jogar também? Use "Trocar de liga" em outra liga ou entre com um treinador novo em outro aparelho.</p></div>`;
}

// ---------- reportar bug: o jogador manda, o dono responde no painel, a resposta aparece aqui ----------
async function bugRefresh(open) {
  if (!NET.online) return;
  try { const L = await NET.bugMine(); UI.bugList = Array.isArray(L) ? L : []; const nw = UI.bugList.some(b => b.reply && !b.reply_seen);
    if (nw !== !!UI.bugNew) { UI.bugNew = nw; if (!UI.modal) render(); }
    if (open && nw) { await NET.bugSeen(); UI.bugNew = false; }
  } catch (e) {}
  if (UI.modal && UI.modal.type === 'bug') { UI.modal.keep = true; renderModal(); }
}
setTimeout(() => bugRefresh(false), 15000); setInterval(() => { if (document.visibilityState === 'visible') bugRefresh(false); }, 10 * 60e3);
function bugModal(m) {
  const L = UI.bugList || [];
  const when2 = t => new Date(t).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const st = { novo: ['recebido', 'var(--muted)'], lendo: ['em análise', 'var(--yellow)'], resolvido: ['resolvido', 'var(--green)'], fechado: ['fechado', 'var(--muted)'] };
  const list = L.map(b => `<div class="bugit"><div class="row between"><span class="small muted">${when2(b.at)}</span><span class="small" style="color:${(st[b.status] || st.novo)[1]}">${(st[b.status] || st.novo)[0]}</span></div>
    <p style="margin:4px 0 0;white-space:pre-wrap">${esc(b.msg)}</p>${b.reply ? `<div class="bugrep"><b>${ic('chat')} Resposta${b.reply_seen ? '' : ' <span class="pill" style="color:var(--lime)">nova</span>'}</b><p style="margin:4px 0 0;white-space:pre-wrap">${esc(b.reply)}</p><span class="small muted">${when2(b.reply_at)}</span></div>` : ''}</div>`).join('');
  return `<h2 class="disp" style="font-size:30px;margin:0">${ic('bug')} Reportar bug</h2>
    <p class="muted small" style="margin:0">Achou um erro ou algo estranho? Conte o que aconteceu e em qual tela. A resposta aparece aqui mesmo.</p>
    <textarea id="bug-msg" rows="5" maxlength="2000" placeholder="Ex.: na tela de escalação, ao trocar o goleiro, o jogo travou…" style="width:100%;box-sizing:border-box">${esc(m.draft || '')}</textarea>
    <input id="bug-ct" maxlength="120" placeholder="Contato (opcional): WhatsApp, Instagram…" value="${esc(m.ct || '')}">
    <button class="btn" data-act="bugsend" ${m.busy ? 'disabled' : ''}>${m.busy ? 'Enviando…' : `${ic('arrowR')} Enviar`}</button>
    ${m.msg ? `<div class="note ${m.ok ? 'ok' : 'bad'}">${esc(m.msg)}</div>` : ''}
    ${L.length ? `<div class="eyebrow" style="margin-top:6px">Seus relatos</div><div class="stack" style="gap:8px">${list}</div>` : ''}`;
}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="bug"],[data-act="bugsend"]'); if (!el) return;
  ev.stopImmediatePropagation();
  if (el.dataset.act === 'bug') { UI.modal = { type: 'bug' }; renderModal(); bugRefresh(true); return; }
  const m = UI.modal, msg = ($('#bug-msg') || {}).value || '', ct = ($('#bug-ct') || {}).value || '';
  m.draft = msg; m.ct = ct;
  if (msg.trim().length < 5) { m.msg = 'Escreva um pouco mais sobre o problema.'; m.ok = false; m.keep = true; renderModal(); return; }
  m.busy = true; m.keep = true; renderModal();
  NET.bugSend(msg.trim(), ct.trim()).then(r => {
    m.busy = false;
    if (r && r.ok) { m.draft = ''; m.msg = 'Recebido! Obrigado por ajudar a melhorar o jogo.'; m.ok = true; bugRefresh(false); }
    else { m.msg = r && r.why === 'limite' ? 'Muitos envios em pouco tempo. Tente de novo mais tarde.' : 'Não consegui enviar agora. Tente de novo em instantes.'; m.ok = false; }
    m.keep = true; renderModal();
  }, () => { m.busy = false; m.msg = 'Sem conexão com o servidor. Tente de novo.'; m.ok = false; m.keep = true; renderModal(); });
}, true);

// ADM salva o link do grupo da liga
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="lgwa"]'); if (!el) return;
  ev.stopImmediatePropagation();
  const v = (($('#lg-wa') || {}).value || '').trim();
  if (v && !WA_OK(v)) { toast('Use um link do WhatsApp (chat.whatsapp.com/... ou wa.me/...).', true); return; }
  NET.sync({ mutate: () => { if (NET.isAdmin() && S.league) S.league.wa = v || null; } }).then(() => { toast(v ? 'Link do grupo salvo' : 'Link removido'); admRefresh(); });
}, true);

// Painel do ADM: ordenação (select) e liberação do modo god pelo dono (senha do painel do dono, conferida no servidor)
document.addEventListener('change', ev => { const el = ev.target; if (el && el.id === 'adm-sort') { UI.admSort = el.value; admRefresh(); } }, true);
try { UI.ownerOK = sessionStorage.getItem('tr_owner_ok') === '1'; } catch (e) {}
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="ownerunlock"]'); if (!el) return;
  ev.stopImmediatePropagation();
  const k = (($('#own-key') || {}).value || ''); if (!k) return;
  el.disabled = true;
  NET.ownerCheck(k).then(ok => { el.disabled = false; if (ok) { UI.ownerOK = true; try { sessionStorage.setItem('tr_owner_ok', '1'); } catch (e) {} try { NET.ownerTrust && NET.ownerTrust(k); } catch (e) {} if (UI.modal && UI.modal.type === 'owner') { UI.modal = null; renderModal(); } toast('Acesso de dono liberado neste aparelho'); if (UI.lobby && UI.lobby.mode === 'create' && typeof lobbyKeep === 'function') lobbyKeep(); admRefresh(); } else toast('Senha errada', true); }, () => { el.disabled = false; toast('Sem conexão', true); });
}, true);

// v167: versão no rodapé · 1 toque abre as novidades, 5 toques rápidos abrem a área do dono
let verTaps = 0, verTmr = null;
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act="vertap"]'); if (!el) return;
  ev.stopImmediatePropagation();
  verTaps++; clearTimeout(verTmr);
  if (verTaps >= 5) { verTaps = 0; UI.modal = { type: 'owner' }; renderModal(); setTimeout(() => { const k = $('#own-key'); if (k) k.focus(); }, 50); return; }
  verTmr = setTimeout(() => { const n = verTaps; verTaps = 0; if (n === 1) { UI.modal = { type: 'changelog' }; renderModal(); } }, 650);
}, true);

// ===== UI parte 13: sorteio ao vivo da Copa do Brasil (transmissão Seu Zé TV) =====
// Encena o chaveamento que o jogo já fez (S.comp.CB.rounds[fase] = [[mandante, visitante], ...]).
// Globo único na mesa: o apresentador tira o mandante, a apresentadora tira o visitante.
const CB_PHASES = () => (S.comp && S.comp.CB && S.comp.CB.rounds ? S.comp.CB.rounds.map((r, i) => r && r.length ? i : null).filter(i => i != null) : []);
const cbPhaseName = i => i >= 4 ? 'Final' : (SE.CB_STAGES || [])[i] || `Fase ${i + 1}`;
function cbSeenR() { const x = S.cbSeen; return x && x.s === S.season ? x.r : -1; }
function cbMark(i) { if (i > cbSeenR()) { S.cbSeen = { s: S.season, r: i }; try { save(); } catch (e) {} } }
function cbNewPhase() { const L = CB_PHASES(); if (!L.length) return null; const last = L[L.length - 1]; return last > cbSeenR() ? last : null; }
function cbBanner() {
  if (!S || S.unemployed || S.post) return '';
  const i = cbNewPhase(); if (i == null) return '';
  const pair = S.comp.CB.rounds[i].find(p => p.includes(S.club));
  return `<button class="drawban cbban" data-act="cbshow" data-i="${i}"><span class="dbball"></span><span class="grow"><b>Sorteio da Copa do Brasil · ${esc(cbPhaseName(i))}</b><span>${pair ? `O ${esc(S.club)} conhece o adversário hoje` : 'Os confrontos da fase foram definidos'}</span></span><span class="dbgo">${ic('arrowR')} Assistir</span></button>`;
}
// chance de passar (jogo único: empate vai pros pênaltis, meio a meio)
function cbChance(h, a) {
  try { const p = SIM.preview(SE.teamFor(S, h), SE.teamFor(S, a), id => SE.info(S, id), false); return Math.round((p.pw + p.pd * 0.5) * 100); } catch (e) { return null; }
}
function cbTags(h, a, i, ch) {
  const t = [];
  if (Wd.isHuman(S, h) && Wd.isHuman(S, a)) t.push(['duel', 'Duelo de treinadores']);
  if (C.isDerby(h, a)) t.push(['derby', 'Clássico']);
  // zebra: Série A contra time de fora dela, e o azarão tem chance real (20% a 40%)
  if (i < 4 && ch != null) { const inA = c => S.divA.includes(c); if (inA(h) !== inA(a)) { const dog = Math.min(ch, 100 - ch); if (dog >= 20 && dog <= 40) t.push(['zeb', 'Alerta de zebra']); } }
  return t;
}
function cbRowHTML(p, n, i, filled, done) {
  const [h, a] = p, hc = c => c === S.club ? 'me' : Wd.isHuman(S, c) ? 'hum' : '';
  const team = (c, side) => filled >= (side === 'h' ? 1 : 2) ? `<span class="cbt on ${hc(c)}">${crest(c, 'sm')}<b>${esc(c)}</b>${side === 'h' ? `<i class="mando" title="Mando de campo">${ic('homei')}</i>` : ''}</span>` : `<span class="cbt"></span>`;
  let foot = '';
  if (filled >= 2) {
    const ch = done ? cbChance(h, a) : null, tg = cbTags(h, a, i, ch);
    foot = `<div class="cbfoot">${tg.map(([k, l]) => `<span class="cbtag ${k}">${l}</span>`).join('')}${ch != null ? `<span class="cbch"><b>${ch}%</b> × <b>${100 - ch}%</b></span>` : ''}</div>`;
  }
  return `<div class="cbrow ${filled >= 2 ? 'full' : filled ? 'half' : ''}" id="cbr-${n}"><span class="cbn">${String(n + 1).padStart(2, '0')}</span><div class="cbpair">${team(h, 'h')}<i class="cbx">×</i>${team(a, 'a')}</div>${foot}</div>`;
}
// Seu Zé: apresentador de cabelo e barba brancos, óculos e fone
const ZE_IDLE = (() => { const g = HOST_IDLE.map(r => [...r]); g[6] = [...'..gegssgeg..']; g[7] = [...'..wssssssw..']; g[8] = [...'..wwwrrwww..']; g[9] = [...'...wwwwww...']; g[4][1] = 'f'; g[5][1] = 'f'; g[4][10] = 'f'; g[5][10] = 'f'; return g.map(r => r.join('')); })();
const ZE_UP = (() => { const g = HOST_UP.map(r => [...r]); for (const y of [6, 7, 8, 9]) g[y] = [...ZE_IDLE[y]]; g[4][1] = 'f'; g[5][1] = 'f'; return g.map(r => r.join('')); })();
const ZE_PAL = { ...HOST_PAL, h: '#E8E8E8', w: '#F2F2F2', g: '#1B1B1B', f: '#2A2A2A', j: '#1E3B2A', p: '#15261C', t: '#FFDF00' };
function cbSay(who, txt) {
  for (const w of ['host', 'girl']) {
    const el = document.getElementById('cp-' + w), bub = document.getElementById('cb-' + w); if (!el || !bub) continue;
    const on = w === who && txt;
    el.innerHTML = w === 'host' ? presSVG(on ? ZE_UP : ZE_IDLE, ZE_PAL, 'Seu Zé') : presHTML('girl', on); el.classList.toggle('talk', !!on);
    bub.textContent = on ? txt : ''; bub.classList.toggle('on', !!on);
  }
}
function cbShowHTML(m) {
  const i = m.ph, R = S.comp.CB.rounds[i] || [], done = !!(m.done && m.done[i]), fill = m.fill || {};
  const tabs = CB_PHASES().map(x => `<button class="chip ${x === i ? 'on' : ''}" data-act="cbph" data-i="${x}">${esc(cbPhaseName(x))}</button>`).join('');
  const drawn = new Set(); R.forEach((p, n) => { const f = done ? 2 : fill[n] || 0; if (f >= 1) drawn.add(p[0]); if (f >= 2) drawn.add(p[1]); });
  const pool = R.flat().slice().sort((a, b) => a.localeCompare(b)).map(c => `<span class="cbpool ${drawn.has(c) ? 'out' : ''} ${c === S.club ? 'me' : Wd.isHuman(S, c) ? 'hum' : ''}" id="cbp-${esc(c).replace(/\W/g, '_')}">${crest(c, 'sm')}<i>${esc(c)}</i></span>`).join('');
  const left = R.flat().length - drawn.size;
  return `<div class="drawshow cbshow cmp-CB">
    <div class="dhead"><h2 class="sech big" style="margin:0">${ic('trophy')} Sorteio</h2><div class="dctl">${done ? '' : `<button class="chip ${m.sp > 1 ? 'on' : ''}" data-act="cbspeed">×2</button><button class="chip" data-act="cbskip">Pular</button>`}</div></div>
    <div class="chips hs">${tabs}</div>
    <div class="dstage cbstage"><div class="dtv"><span class="dtvl"><img class="zetv" src="${ZETV_URI}" alt="Seu Zé TV"><span class="vivo"><i></i>VIVO</span></span><span class="dcname">Copa do Brasil · ${esc(cbPhaseName(i))}</span></div>
      <div class="dcenter ${done ? 'done' : ''}">
        <div class="dpres l"><div class="dbub ${done ? 'on' : ''}" id="cb-host">${done ? 'Tá definido! Boa sorte a todos.' : ''}</div><div class="dpx" id="cp-host">${presSVG(ZE_IDLE, ZE_PAL, 'Seu Zé')}</div></div>
        <div class="dmid"><div class="cbglobe" id="cbglobe"><span class="rim"></span>${Array.from({ length: Math.min(12, left) }, (_, k) => `<i class="bb" style="left:${[18, 42, 66, 30, 54, 78, 12, 44, 60, 24, 70, 36][k]}%;bottom:${[8, 6, 8, 26, 24, 28, 30, 44, 42, 50, 46, 60][k]}%"></i>`).join('')}<span class="glare"></span></div>
          <div class="dball" id="cbball"><div class="dbin"></div></div><div class="dcap" id="cbcap">${done ? 'Sorteio concluído' : `${left} bolinhas no globo`}</div></div>
        <div class="dpres r"><div class="dbub" id="cb-girl"></div><div class="dpx" id="cp-girl">${presHTML('girl', false)}</div></div>
      </div><div class="cbtable"><span>COPA DO BRASIL</span></div></div>
    <div class="cbboard" id="cbboard">${R.map((p, n) => cbRowHTML(p, n, i, done ? 2 : fill[n] || 0, done)).join('')}</div>
    <div class="eyebrow" style="margin:4px 0 0">Clubes no globo</div><div class="cbpools" id="cbpools">${pool}</div>
  </div>`;
}
let CB_TOK = 0;
async function cbRun() {
  const m = UI.modal; if (!m || m.type !== 'cbdraw') return;
  const i = m.ph; if (m.done && m.done[i]) return;
  const R = S.comp.CB.rounds[i] || [];
  const tok = ++CB_TOK, alive = () => tok === CB_TOK && UI.modal === m && document.getElementById('cbball');
  const sp = () => m.sp || 1; m.fill = m.fill || {};
  cbSay('host', `Boa noite! Aqui é o Seu Zé, e começa o sorteio ${i >= 4 ? 'da final' : `da ${cbPhaseName(i)}`} da Copa do Brasil!`);
  await dwait(2400 / sp()); if (!alive()) return;
  for (let n = 0; n < R.length; n++) {
    if ((m.fill[n] || 0) >= 2) continue;
    const [h, a] = R[n], hot = [h, a].some(c => Wd.isHuman(S, c)), duel = Wd.isHuman(S, h) && Wd.isHuman(S, a);
    const row = document.getElementById('cbr-' + n), board = document.getElementById('cbboard');
    if (row && board) board.scrollTo({ top: Math.max(0, row.offsetTop - board.offsetTop - 60), behavior: 'smooth' });
    document.querySelectorAll('.cbrow').forEach(x => x.classList.toggle('cur', x.id === 'cbr-' + n));
    for (const side of [0, 1]) {
      if (!alive()) return;
      const c = side ? a : h, me = c === S.club, hu = Wd.isHuman(S, c), slow = hot;
      const ball = document.getElementById('cbball'), inn = ball.querySelector('.dbin'), cap = document.getElementById('cbcap'), globe = document.getElementById('cbglobe');
      globe.classList.remove('shake'); void globe.offsetWidth; globe.classList.add('shake');
      const bb = globe.querySelector('.bb:not(.out)'); if (bb && R.length * 2 - (n * 2 + side) <= globe.querySelectorAll('.bb').length) bb.classList.add('out');
      cbSay(side ? 'girl' : 'host', side ? (duel ? 'Olha o duelo de treinadores…' : slow ? 'Atenção pra essa…' : 'E o adversário…') : `Confronto ${String(n + 1).padStart(2, '0')}!`);
      cap.textContent = side ? 'Visitante' : 'Mandante';
      await dwait((slow ? 1300 : 650) / sp()); if (!alive()) return;
      ball.className = 'dball spin' + (slow ? ' slow' : ''); inn.innerHTML = '';
      await dwait((slow ? 2000 : 700) / sp()); if (!alive()) return;
      ball.className = 'dball open ' + (me ? 'me' : hu ? 'hum' : '');
      inn.innerHTML = `${crest(c, 'lg')}<span>${esc(c)}</span>`;
      cbSay(side ? 'girl' : 'host', side ? `${c}!` : `${c} joga em casa!`);
      try { if (me || hu) SFX.star(); else SFX.flip(); } catch (e) {}
      await dwait((slow ? 2000 : 950) / sp()); if (!alive()) return;
      m.fill[n] = side + 1;
      const r2 = document.getElementById('cbr-' + n); if (r2) { r2.outerHTML = cbRowHTML(R[n], n, i, side + 1, false); const r3 = document.getElementById('cbr-' + n); if (r3) r3.classList.add('cur', 'pop'); }
      const pc = document.getElementById('cbp-' + esc(c).replace(/\W/g, '_')); if (pc) pc.classList.add('out');
      ball.className = 'dball'; inn.innerHTML = '';
      await dwait(260 / sp());
    }
    if (duel) { cbSay('host', 'Duelo de treinadores na Copa do Brasil!'); await dwait(1600 / sp()); if (!alive()) return; }
  }
  if (!alive()) return;
  cbSay('host', 'Tá definido! Boa sorte a todos.');
  m.done = m.done || {}; m.done[i] = true; cbMark(i);
  try { SFX.applause(); } catch (e) {}
  await dwait(900); if (UI.modal !== m) return;
  m.force = true; renderModal();
}
function cbOpen(i) { const L = CB_PHASES(); if (!L.length) return; UI.modal = { type: 'cbdraw', ph: i != null && L.includes(+i) ? +i : L[L.length - 1], sp: 1, done: {}, fill: {}, force: true }; renderModal(); cbRun(); }
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act; if (!/^cb(show|ph|speed|skip)$/.test(a)) return;
  ev.stopImmediatePropagation();
  const m = UI.modal;
  if (a === 'cbshow') return cbOpen(el.dataset.i != null ? +el.dataset.i : null);
  if (!m || m.type !== 'cbdraw') return;
  if (a === 'cbph') { CB_TOK++; m.ph = +el.dataset.i; m.fill = {}; m.force = true; renderModal(); cbRun(); }
  else if (a === 'cbspeed') { m.sp = m.sp > 1 ? 1 : 2.2; el.classList.toggle('on', m.sp > 1); }
  else if (a === 'cbskip') { CB_TOK++; m.done = m.done || {}; m.done[m.ph] = true; cbMark(m.ph); m.force = true; renderModal(); }
}, true);

// ===== UI parte 14 (v262, teste): chat da liga — "Zona mista" (v266) =====
// Mensagens no banco (tabela league_chat, fora da liga); o aviso de novidade vem na consulta leve (NET.chat).
// Tela cheia (UI.view = 'chat'). Imprensa: marca no botão ao lado do Enviar; a mensagem vira declaração no jornal (mesmo caminho da declaração avulsa), 1 por dia do jogo.
function chatBtn() {
  if (!NET.online || !S || !S.league || !NET.chat || !NET.chat.on) return '';
  const n = NET.chat.unread(), at = NET.chat.mentioned();
  return `<button class="chatbtn" data-act="goto" data-v="chat" aria-label="Zona mista${n ? `: ${n} nova(s)` : ''}">${ic('chat')}<span>Zona mista</span>${n ? `<i class="chatdot${at ? ' at' : ''}">${at ? '@' : n > 9 ? '9+' : n}</i>` : ''}</button>`;
}
function topRow() { const wa = waLeague(), ch = chatBtn(); if (!wa && !ch) return ''; return `<div class="toprow">${wa}${ch}</div>`; }
function chatTime(t) {
  const d = new Date(t), now = new Date(), hh = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toDateString() === now.toDateString() ? hh : `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${hh}`;
}
const chatText = s => esc(s).replace(/@\[([^\]]+)\]|@([\p{L}\-]+)/gu, (m0, a, b) => `<b class="cm">@${a || b}</b>`);
function chatListHTML() {
  const L = NET.chat.list, me = S.__me, adm = NET.isAdmin && NET.isAdmin();
  if (NET.chat.ok === false) return NET.chat.why === 'fora' ? '<p class="muted small chatempty">Não consegui confirmar o seu acesso à Zona mista neste aparelho. Feche e abra o app; se continuar, entre de novo com o seu código de acesso (fica em Carreira).</p>' : '<p class="muted small chatempty">A Zona mista ainda não está ligada nesta liga.</p>';
  if (!L.length) return `<p class="muted small chatempty">${NET.chat.ok == null ? 'Carregando…' : 'Ninguém escreveu ainda. Mande a primeira mensagem e use @ pra chamar outro treinador.'}</p>`;
  return L.map(x => {
    const mine = x.token === me, atMe = !mine && (x.ment || []).includes(me);
    return `<div class="cmsg ${mine ? 'me' : ''} ${atMe ? 'at' : ''}">
      ${mine ? '' : `<div class="cwho">${x.club ? crest(x.club, 'sm') : ''}<b>${esc(x.name || 'Treinador')}</b>${x.club ? `<small>${esc(x.club)}</small>` : ''}</div>`}
      <div class="cbub">${chatText(x.msg)}</div>
      <div class="cmeta"><small>${chatTime(x.at)}</small>${x.press ? `<span class="cpress">${ic('news')} foi pra imprensa</span>` : ''}${mine || adm ? `<button class="cact cdel" data-act="chathide" data-id="${x.id}" aria-label="Esconder mensagem">${ic('trash')}</button>` : ''}</div></div>`;
  }).join('');
}
// v262: tela cheia (não é mais caixa suspensa); a imprensa é marcada antes de enviar, no botão ao lado do Enviar
const CHAT_UI = () => (UI.chat = UI.chat || { draft: '', press: false, busy: false });
// v268: imprensa 1 por dia do jogo E no máximo 1 a cada 20 horas reais (o banco também confere)
const CHAT_PRESS_MS = 20 * 3600000;
const chatPressUsed = () => S.chatPress === S.lastDay || (S.chatPressAt && Date.now() - S.chatPressAt < CHAT_PRESS_MS);
function vChat() {
  const c = CHAT_UI(), used = chatPressUsed();
  if (!c.f) { c.f = 1; NET.chat.fetch(); }
  if (used) c.press = false;
  return `<div class="chatv">
    <header class="chath"><button class="chback" data-act="goto" data-v="home" aria-label="Voltar">${ic('arrowR')}</button><div class="grow"><b class="disp">Zona mista</b><small>${esc((S.league && S.league.name) || '')} · ${Object.values(S.desks || {}).filter(d => !d.unemployed && d.club).length} treinadores</small></div>${waLeague() ? `<a class="chwa" href="${esc(leagueWa())}" target="_blank" rel="noopener" aria-label="Grupo da liga no WhatsApp">${ic('chat')}</a>` : ''}</header>
    <div class="chatl" id="chatl">${chatListHTML()}</div>
    <div class="chatfoot">
      <div class="mentions" id="chat-ment"></div>
      ${c.press ? `<div class="cpnote">${ic('news')} Esta mensagem vai pro jornal da liga e mexe nos pilares como uma declaração.</div>` : ''}
      <div class="chatin"><textarea id="chat-in" maxlength="280" rows="1" placeholder="Mensagem (@ pra citar)">${esc(c.draft || '')}</textarea>
        <button class="cpt ${c.press ? 'on' : ''}" data-act="chatpt" aria-pressed="${c.press}" ${used ? 'disabled' : ''} title="${used ? 'Você já falou à imprensa hoje (1 por dia)' : 'Mandar esta mensagem pra imprensa'}">${ic('news')}<small>${used ? 'amanhã' : 'Imprensa'}</small></button>
        <button class="btn csend" data-act="chatsend" aria-label="Enviar" ${c.busy ? 'disabled' : ''}>${ic('arrowR')}</button></div>
    </div></div>`;
}
function chatScrolled() { const l = $('#chatl'); if (l) l.scrollTop = l.scrollHeight; if (UI.view === 'chat' && NET.chat) NET.chat.seen(); }
function chatRefresh() {
  const b = document.querySelector('.chatbtn'); if (b) b.outerHTML = chatBtn() || '';
  if (UI.view === 'chat') { const l = $('#chatl'); if (l) { const atEnd = l.scrollHeight - l.scrollTop - l.clientHeight < 60; l.innerHTML = chatListHTML(); if (atEnd) chatScrolled(); } }
}
NET.on(ev => { if (ev === 'chat') chatRefresh(); });
const CHAT_WHY = { devagar: 'Calma: muitas mensagens seguidas. Espere um pouco.', longa: 'Mensagem longa demais (até 280 caracteres).', vazia: 'Escreva alguma coisa.', fora: 'Só quem está nesta liga pode escrever aqui.', nofn: 'O chat ainda não foi ligado no banco.', offline: 'Sem conexão com a liga.', rede: 'Não deu pra enviar. Tente de novo.', nao: 'Não deu: a mensagem não é sua ou já saiu.' };
function chatRedraw() { if (UI.view !== 'chat') return; const app = $('#app'); app.innerHTML = vChat(); chatScrolled(); const t = $('#chat-in'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }
async function chatSend() {
  const c = CHAT_UI(), ta = $('#chat-in'), txt = ((ta && ta.value) || '').trim();
  if (!txt) return toast('Escreva alguma coisa.', true);
  const ments = resolveMentions(txt), toks = ments.filter(x => x.type === 'coach').map(x => x.token);
  const wantPress = c.press && !chatPressUsed();
  c.busy = true; c.draft = txt; chatRedraw();
  const r = await NET.chat.post(txt, toks, S.manager, S.club);
  c.busy = false;
  if (r && r.ok) {
    c.draft = '';
    if (wantPress) { c.press = false; chatPressGo(r.id, txt, ments); }
  } else toast(CHAT_WHY[r && r.why] || CHAT_WHY.rede, true);
  chatRedraw();
}
async function chatPressGo(id, txt, ments) {
  // v268: o banco confere primeiro (1 a cada 20 h); só depois a matéria sai e mexe nos pilares
  if (id) { const pr = await NET.chat.press(id);
    if (!pr || !pr.ok) { if (pr && pr.why === 'hoje') { S.chatPressAt = Date.now(); save(); }
      toast(pr && pr.why === 'hoje' ? 'Você já falou à imprensa nas últimas 20 horas. A mensagem ficou só na Zona mista.' : 'Não deu pra mandar pra imprensa agora. A mensagem ficou só na Zona mista.', true);
      if (UI.view === 'chat') chatRedraw(); return; } }
  let res = null;
  if (SAMPLE) { try { res = await pressSendAI(txt, ments); } catch (e) { res = null; } }   // etapa 2: IA no servidor
  if (!res && NET.chat.ai) {   // v265: IA da imprensa no servidor (Railway); sem ela, texto pronto
    toast('A redação está escrevendo a matéria…');
    let ctx = `técnico ${S.manager}, do ${S.club}`;
    try { const div = Wd.divOf(S, S.club) || 'B', pos = SE.standings(S.comp[div].table).findIndex(r => r.c === S.club) + 1, lm = S.lastMatch; ctx = `Técnico: ${S.manager}, do ${S.club} (${pos}º na Série ${div}, temporada ${S.season}).${lm ? ` Último jogo: ${lm.f.h} ${lm.res.gh}×${lm.res.ga} ${lm.f.a}.` : ''}`; } catch (e) {}
    const mm = ments.map(x => ({ tipo: x.type === 'club' ? 'clube' : x.type === 'coach' ? 'tecnico' : x.type === 'ref' ? 'arbitro' : 'jogador', nome: x.name, clube: x.club || '' }));
    try { res = await NET.chat.ai(id, ctx, mm); } catch (e) { res = null; }
  }
  if (!res || !res.manchete) res = templatePress(txt, ments);
  res.manchete = noColetiva(res.manchete);
  if (!res.ia) res.lide = String(res.lide || '').replace(/disse o técnico do (.+)\.$/, 'disse o técnico do $1 na zona mista.');   // v266: o chat da liga se chama Zona mista
  applyPress(txt, res, ments);
  const last = (S.press || [])[S.press.length - 1]; if (last) last.free = true;
  for (const mm of ments) if (mm.type === 'player') playerReply(mm.id, res.tom === 'elogio' ? 'pos' : res.tom === 'neutro' ? 'neu' : 'neg');
  S.chatPress = S.lastDay; S.chatPressAt = Date.now(); save(); if (UI.view === 'chat') chatRedraw();
  toast(`No jornal: ${res.manchete}`);
}
document.addEventListener('input', ev => {
  const t = ev.target; if (t.id !== 'chat-in' || UI.view !== 'chat') return;
  ev.stopImmediatePropagation(); CHAT_UI().draft = t.value;
  t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px';
  const mm = t.value.match(/@([^\s@]{1,20})$/), box = $('#chat-ment');
  if (box) box.innerHTML = mm ? mentionList(mm[1]).replaceAll('data-act="mention"', 'data-act="cment"') : '';
}, true);
document.addEventListener('keydown', ev => { if (ev.target && ev.target.id === 'chat-in' && ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); chatSend(); } }, true);
document.addEventListener('click', ev => {
  if (UI.view !== 'chat') return;
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'chatsend') { ev.stopPropagation(); chatSend(); }
  else if (act === 'chatpt') { ev.stopPropagation(); const c = CHAT_UI(); const ta = $('#chat-in'); if (ta) c.draft = ta.value; c.press = !c.press; chatRedraw(); }
  else if (act === 'chathide') { ev.stopPropagation(); NET.chat.hide(+el.dataset.id).then(r => { if (!(r && r.ok)) toast(CHAT_WHY[r && r.why] || CHAT_WHY.rede, true); }); }
  else if (act === 'cment') {
    ev.stopPropagation(); ev.preventDefault();
    const ta = $('#chat-in'); if (!ta) return;
    const v = el.dataset.v;
    ta.value = ta.value.replace(/@([^\s@]*)$/, v.includes(' ') ? `@[${v}] ` : `@${v} `);
    CHAT_UI().draft = ta.value; const box = $('#chat-ment'); if (box) box.innerHTML = '';
    ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
  }
}, true);
})();
