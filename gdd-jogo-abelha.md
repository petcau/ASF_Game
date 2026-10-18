# GDD — Abelhas Nativas: Meliponicultura

Oct 17, 2026 · @Peterson · Rascunho v0.1

## Visão geral

Abelhas Nativas: Meliponicultura é um simulador de manejo: o jogador é um meliponicultor que cria abelhas sem ferrão num sítio. O jogo mostra a realidade do manejo, sem ficção.

| Item | Definição |
| --- | --- |
| Nome | Abelhas Nativas: Meliponicultura |
| Gênero | Simulação de manejo, contínua, sem fases |
| Jogador | Um meliponicultor |
| Cenário | Um sítio com floresta nativa, áreas abertas para plantio e áreas para o meliponário |
| Começo | Uma colônia de Jataí numa caixa padrão INPA, só com o ninho |
| Progressão | A colônia se desenvolve e a caixa ganha módulos |
| Plataforma | App para Android e iOS, 100% offline, sem versão web |
| Público | 13 anos ou mais |
| Modelo | Parte grátis e conteúdo pago por compra única, sem anúncios e sem loot box |
| Arte | Cartoon estilizado |

## Pilares de design

&#91;embedded content: pilares de design · 1 meta, 3 pilares e a base\]

Toda decisão de design passa por estes três pilares; a base vem da arquitetura.

## Jogabilidade

O jogador vive a rotina de um meliponicultor: cuida da colônia, ela se desenvolve e a caixa ganha módulos. Não há etapas: o jogo é contínuo.

### O jogador

O jogador é o meliponicultor e cuida da saúde das abelhas. Como o jogo é contínuo, os papéis dele se repetem ao longo do ano, no ritmo das estações e de cada colônia.

- Alimentar as colônias no inverno.
- Colher mel, própolis e saburá.
- Plantar flores.
- Vender mel, própolis e saburá na lojinha.
- Dividir colônias, que é a forma de multiplicá-las.
- Pôr iscas nas árvores para capturar enxames.

Proposta: cada papel tem o custo que teria na vida real.

- Colher mel pede colônia populosa, potes fechados e a época da florada ou logo depois, e sempre deixa uma reserva para quando faltam flores.
- Colher saburá deixa potes de pólen abertos, que atraem forídeos.
- Falta e excesso de alimento podem matar a colônia.
- Só se dividem colônias populosas, na primavera ou no começo do verão, em dia quente e de manhã.

Proposta: a lojinha fica no sítio e paga em dinheiro do jogo, que só se ganha jogando. Ela é diferente da Loja, onde ficam as compras do app.

A validar: o que o dinheiro do jogo compra; que regras reais valem para vender mel, própolis e saburá; e as épocas no sítio na Bahia, já que a da divisão vem de uma fonte de Santa Catarina e falta confirmar se lá a falta de flores cai no inverno. Fontes: [Epagri, 2018](https://publicacoes.epagri.sc.gov.br/BD/article/download/408/304/2860) e [Embrapa, 2024, cap. 8](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1163992/1/27762.pdf).

### Ações de manejo

Cada ação imita uma prática real da meliponicultura. Decidido = definido por você; Proposta = sugestão para você validar.

| Ação | O que o jogador faz | Status |
| --- | --- | --- |
| Acrescentar módulo | Põe sobreninho ou melgueira na caixa INPA conforme a colônia se desenvolve | Decidido |
| Montar o meliponário | Escolhe onde ficam as caixas, nas áreas do sítio reservadas para isso | Decidido |
| Plantar flores | Planta flores nas áreas abertas do sítio | Decidido |
| Alimentar | Alimenta as colônias no inverno | Decidido |
| Colher mel | Retira o mel dos potes da melgueira | Decidido |
| Colher própolis | Retira o própolis da caixa; nas melíponas, como a uruçu, ele vem misturado com barro, o geoprópolis | Decidido |
| Colher saburá | Retira o saburá, o pólen fermentado guardado nos potes | Decidido |
| Vender na lojinha | Vende mel, própolis e saburá | Decidido |
| Dividir a colônia | Multiplica as colônias, formando uma nova a partir de uma forte com o sobreninho | Decidido |
| Capturar enxame | Põe iscas nas árvores e transfere o enxame capturado para uma caixa | Decidido |
| Revisar a caixa | Abre a caixa e observa os discos de cria, os potes de alimento e sinais de invasores | Proposta |
| Proteger | Defende a caixa de inimigos naturais e de abelhas ladras | Proposta |

### Tempo e estações

- O tempo só anda quando o jogador joga.
- O ano tem 365 dias e as quatro estações; o jogo começa na primavera.
- Um ano equivale a 36,5 horas de jogo contínuo: cada dia no sítio dura 6 minutos, e cada estação, cerca de 9 horas (valores a revisar).
- Na tela, uma barra do ano mostra as estações, e um marcador mostra o dia.
- Proposta: a barra também marca a safra e a entressafra da região do sítio.

Assim os prazos reais cabem no jogo: os 3 dias de espera antes de pôr a melgueira numa colônia recém-dividida viram 18 minutos, e os cerca de 3 meses até transferir um enxame do ninho-isca viram umas 9 horas ([Embrapa, 2023](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1156873/1/EmbrapaFlorestas-2023-ModelosRestauracaoReservaLegalAraucaria-cap5.pdf)).

### Controles

Toque na tela: tocar para escolher, arrastar para mover. Proposta, a detalhar no protótipo.

### Metas de longo prazo

Em aberto. Proposta: metas ligadas ao manejo real, como manter colônias fortes, colher mel e completar o álbum.

## Progressão

Não há etapas: a colônia cresce dentro da caixa, e o meliponário cresce no sítio.

### A caixa INPA

A caixa cresce de baixo para cima ([Plantando Vida](https://fablablivresp.prefeitura.sp.gov.br/sites/default/files/projetos/arquivos/modelo_de_caixa_para_jatai_plantando_vida.pdf)), e cabe ao meliponicultor decidir quando acrescentar ou retirar cada módulo ([Embrapa, 2024](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164345/1/500P500R-Meliponicultura-98-104.pdf)).

1. Porão: o módulo do fundo, abaixo do ninho. Na cartilha do INPA ele aparece como lixeira: tem 1 cm de altura e recebe lixo, fezes e restos de células de cria ([Carvalho-Zilse et al., 2005](https://acervo.socioambiental.org/sites/default/files/documents/l3d00057.pdf)).
2. Ninho: o começo do jogo, com a colônia de Jataí; 7 cm de altura na cartilha.
3. Sobreninho: amplia a área de cria e é a parte usada para dividir a colônia; também 7 cm.
4. Melgueira: módulo sem cria, onde fica a maior parte dos potes de mel e pólen; 5 cm na cartilha. Colônias populosas usam uma ou duas.

Em aberto: o porão do jogo é a lixeira da cartilha do INPA ou outro módulo?

### Medidas por espécie

A estrutura da caixa é a mesma para todas as espécies; muda o lado interno. A regra é fazer a caixa 2 a 3 cm maior que o maior disco de cria da espécie ([Embrapa, 2016](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1053592/1/CT383GuilhermeSchuhli.pdf)), e a cartilha do INPA mantém as alturas dos módulos de uma espécie para outra.

| Espécie | Lado interno (cm) | Fonte e observação |
| --- | --- | --- |
| Jataí | 13 × 13 | Embrapa, modelo baseado na INPA ([Embrapa, 2023](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1156873/1/EmbrapaFlorestas-2023-ModelosRestauracaoReservaLegalAraucaria-cap5.pdf)) |
| Mandaçaia | 15 × 15 | Embrapa, com módulos de 7,5 cm de altura ([Embrapa, 2016](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1053592/1/CT383GuilhermeSchuhli.pdf)) |
| Uruçu-nordestina | 20 × 20 | Wikipedia; confirmar com fonte técnica ([Caixa racional](https://pt.wikipedia.org/wiki/Caixa_racional)) |
| Mandaguari | 20 a 25 | 25 na cartilha do INPA (canudo); 20 na Wikipedia |
| Jupará | 15 × 15 | Cartilha do INPA ([Carvalho-Zilse et al., 2005](https://acervo.socioambiental.org/sites/default/files/documents/l3d00057.pdf)) |
| Uruçu-boca-de-renda | 25 × 25 | Cartilha do INPA |
| Jandaíra | A confirmar | Há relato de adaptação melhor a caixas horizontais (Wikipedia) |
| Moça-branca | A confirmar | Faz a cria em cachos e costuma pedir caixas especiais para a divisão (Wikipedia) |
| Tiúba | A confirmar | Sem fonte ainda |
| Rajada | A confirmar | Sem fonte ainda |

Atenção: jandaíra e moça-branca podem não se dar bem na caixa INPA; vale confirmar antes de fixar que todas as caixas são INPA.

Acrescentar cedo demais tem custo real: espaço vazio faz a colônia gastar mais energia com temperatura, limpeza e defesa, e consumir mais mel. Na entressafra, a melgueira vazia pode ser retirada ([Embrapa, 2024](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1164450/1/Meliponicultura500Perguntas500RespostasCap12.pdf)).

### O meliponário

Novas colônias vêm da divisão das que o jogador já tem ou dos caminhos previstos na Resolução CONAMA 496/2020: recipiente-isca, compra de meliponário autorizado, depósito pelo órgão ambiental e resgate ([Embrapa, 2024](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164393/1/PL-SEDE-22052024a.pdf)). Proposta: o jogo não oferece práticas ilegais, como derrubar árvores para tirar ninhos.

As regras reais podem virar marcos do jogo (proposta):

- até 49 colônias, sem fins comerciais: dispensa de autorização;
- mais de 49 colônias: inscrição no Cadastro Técnico Federal e autorização ambiental;
- transportar colônias: autorização para todos, qualquer que seja o tamanho do meliponário;
- vender colônias: só as que vêm da multiplicação, com autorização do órgão estadual.

### Novas espécies

Depois da Jataí entram outras espécies, listadas em Mundo e espécies. Como e quando cada uma chega: em aberto.

## Mundo, espécies e personagens

O jogo se passa num sítio e começa com a Jataí; depois entram mais nove espécies reais, entre as mais criadas no Brasil.

### O sítio

| Área | Papel no jogo |
| --- | --- |
| Floresta nativa | Mata do sítio que as abelhas visitam em busca de alimento |
| Áreas abertas para plantio | Onde o jogador planta; o que plantar ainda está em aberto |
| Meliponário | Onde ficam as caixas; cresce com novas colônias |

O jogador é um meliponicultor; se ele começa iniciante ou experiente, está em aberto.

### As 10 espécies

| Nº | Espécie | Por que entrou | Onde ocorre naturalmente |
| --- | --- | --- | --- |
| 1 | Jataí (*Tetragonisca angustula*) | Sua escolha; entre as 5 mais criadas do país | 23 estados e o DF; não consta em AL, RN e SE |
| 2 | Uruçu-nordestina (*Melipona scutellaris*) | Sua escolha; entre as 5 mais criadas; em perigo de extinção | AL, BA, CE, PB, PE, RN, SE |
| 3 | Mandaçaia (*Melipona quadrifasciata*) | Sua escolha; entre as 5 mais criadas | AL, BA, ES, GO, MG, MS, PB, PE, PR, RJ, RS, SC, SE, SP |
| 4 | Jandaíra (*Melipona subnitida*) | Entre as 5 mais criadas | AL, BA, CE, MA, PB, PE, PI, RN, SE |
| 5 | Tiúba (*Melipona fasciculata*) | Entre as 5 mais criadas | AM, AP, GO, MA, MT, PA, PI, TO |
| 6 | Mandaguari (*Scaptotrigona* spp.) | Sua escolha; entre as mais criadas na PB e no RN | Depende da espécie; *S. xanthotricha*: BA, ES, MG, PR, RJ, SC, SP |
| 7 | Rajada (*Melipona asilvai*) | Entre as mais criadas na PB e no RN | AL, BA, CE, MG, PB, PE, PI, RN, SE |
| 8 | Moça-branca (*Frieseomelitta* sp.) | Entre as mais criadas na PB e no RN | Depende da espécie; *F. doederleini*: BA, CE, DF, MA, MG, PA, PB, PE, PI, RN, TO |
| 9 | Jupará (*Melipona compressipes*) | Entre as mais criadas na Amazônia | AC, AM, AP, MA, MT, PA, RR, TO |
| 10 | Uruçu-boca-de-renda (*Melipona seminigra*) | Entre as mais criadas na Amazônia | AC, AM, MA, MT, PA, RO, RR, TO |

De 1 a 5 estão as cinco mais criadas num levantamento com 251 meliponicultores de 20 estados ([Jaffé et al., 2015](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1012744/1/journal.pone.0121157.pdf)), com Jataí e Uruçu-nordestina à frente por sua escolha. De 6 a 8, as mais criadas na Paraíba e no Rio Grande do Norte ([UFPB, 2019](https://repositorio.ufpb.br/jspui/handle/123456789/15186)); 9 e 10, da cartilha do INPA ([Carvalho-Zilse et al., 2005](https://acervo.socioambiental.org/sites/default/files/documents/l3d00057.pdf)). Estados: Catálogo Nacional do ICMBio ([Portaria 665/2021](https://abrapch.org.br/wp-content/uploads/2021/11/Diario-Oficial-da-Uniao-Secao-1-n-210-09112021.pdf)). Perigo de extinção: Portaria MMA 300/2022 ([Embrapa, 2024](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164393/1/PL-SEDE-22052024a.pdf)).

Em aberto: qual mandaguari, qual moça-branca e qual mandaçaia. No Nordeste, mandaçaia também designa *Melipona mandacaia*, da Caatinga (AL, BA, CE, PE, PI, SE).

### Onde fica o sítio

Pela Resolução CONAMA 496/2020, cada espécie só pode ser criada nos estados onde ocorre naturalmente; fora deles, só com autorização após análise de risco ([Embrapa, 2024](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164393/1/PL-SEDE-22052024a.pdf)).

- Jataí e uruçu-nordestina só ocorrem juntas na Bahia, no Ceará, na Paraíba e em Pernambuco.
- Na Bahia, até 7 das 10 espécies podem ser criadas; mandaguari e moça-branca dependem da espécie escolhida.
- Tiúba, jupará e uruçu-boca-de-renda são do Norte e do Maranhão e pediriam um segundo sítio.
- Proposta: o primeiro sítio fica na Bahia, e um sítio no Norte entra depois, talvez como conteúdo pago.
- A uruçu-nordestina está em perigo de extinção: criá-la exige cadastro no Sisfauna e as autorizações previstas. Proposta: esse passo real aparece no jogo.

## Vida das abelhas

Cada espécie tem seus próprios números de ciclo de vida, e cada abelha do jogo tem um motor próprio, com idade, casta, fase e tarefa que mudam como na vida real.

### O motor de cada abelha

- Cada abelha nasce de um ovo posto numa célula, passa pelas fases de cria e, adulta, muda de tarefa conforme a idade.
- A casta define o caminho: operária, rainha ou macho.
- Os números vêm do arquivo de dados da espécie, com a fonte de cada um; a tabela abaixo é a primeira versão.
- Desempenho: proposta em Requisitos técnicos e legais.

&#91;embedded content: motor de cada abelha · cria, operária, rainha e macho\]

Na jataí, só os soldados fazem a guarda; na uruçu, a rainha não nasce de realeira.

### O que o jogador vê

Enquanto se joga, o motor roda ao vivo, e uma camada de animação mostra na tela o que ele está fazendo.

- No sítio, as campeiras saem da caixa, vão às flores e voltam com néctar ou pólen; o pólen aparece nas corbículas das patas traseiras.
- Na entrada, as guardas ficam visíveis e, num ataque, saem para defender a colônia.
- Com a caixa aberta, dá para ver a rainha e as operárias trabalhando nos favos.
- Proposta: cada abelha animada é uma abelha real do motor, fazendo a tarefa que a fase dela manda; quando a colônia tem milhares, a tela mostra uma amostra que respeita as proporções.
- Proposta: como o jogo corre 240 vezes mais rápido que a vida real, a animação usa um ritmo natural de voo, e o motor conta as viagens no tempo acelerado.

### Ações das abelhas

Cada ação tem quem a faz, a fase em que acontece e o gatilho que a dispara no motor. As ações vêm das fontes desta seção; os gatilhos são proposta.

| Ação | Quem faz | Fase | Gatilho no jogo (proposta) | Espécie |
| --- | --- | --- | --- | --- |
| Comer todo o alimento da célula | Larva | Cria | Ovo eclodiu | Ambas |
| Tecer o casulo | Pré-pupa | Cria | Alimento acabou | Ambas |
| Limpar o próprio corpo | Recém-nascida | Adulta, 1º dia | Nascimento | Jataí |
| Abastecer a célula com alimento e fechá-la após a postura | Operária | Jovem, no ninho | Célula pronta e rainha por perto | Ambas |
| Construir com cerume células, potes e pilares; na jataí, também o invólucro | Operária | Jovem, no ninho | Favo novo ou cria crescendo | Ambas |
| Tirar o cerume de cima das células para a abelha nascer | Operária | No ninho | Pupas perto de nascer | Ambas |
| Aquecer a cria | Operária | No ninho | Favo com pupas | Jataí |
| Desmanchar favos vazios e reaproveitar o material | Operária | No ninho | Todas as abelhas do favo nasceram | Jataí |
| Rodear a rainha e ajudar na postura | Operária | Jovem, no ninho | Rainha em postura | Jataí |
| Limpar o ninho e levar o lixo aos depósitos | Operária | No ninho | Lixo acumulado | Ambas |
| Receber e desidratar o néctar | Operária; na uruçu, também o macho | Mais velha, no ninho | Campeira chega com néctar | Uruçu; jataí a confirmar |
| Manipular resina | Operária | Mais velha; na jataí, 20 a 55 dias | Resina chegando ou fresta a vedar | Ambas |
| Pôr ovos que viram machos | Operária poedeira | Adulta | Célula aberta sem ovo da rainha | Ambas |
| Pairar diante da entrada e derrubar invasores de outras espécies | Soldado | Guarda | Invasor de outra espécie, como a abelha-limão | Jataí |
| Barrar, no tubo, abelhas de outras colônias | Soldado | Guarda | Abelha da mesma espécie, de outra colônia | Jataí |
| Pairar na entrada e conferir quem chega | 1 ou 2 guardas | Guarda | Dia claro | Uruçu |
| Morder e imobilizar o invasor | Guarda | Guarda | Ataque | Ambas |
| Recuar para dentro do ninho | Guarda | Guarda | Animal grande por perto | Jataí |
| Fechar o tubo com uma lâmina de cera cheia de furinhos | Operárias | Colônia | Noite | Jataí |
| Coletar néctar, pólen e resina | Campeira | Campo; na jataí, desde uns 16 dias | Reservas a repor e flores abertas | Ambas |
| Coletar barro e água | Campeira | Campo | Batume em obra; tempo seco | Uruçu |
| Recrutar com esbarrões e indicar a direção da fonte | Campeira | Campo | Achou uma fonte boa | Uruçu |
| Buscar alimento sozinha, pela memória e pelo cheiro | Campeira | Campo | Saída para o campo | Jataí |
| Pôr um ovo em cada célula abastecida | Rainha | Fisogástrica | Célula pronta | Ambas |
| Comer ovos de operárias | Rainha | Fisogástrica | Ovo de operária numa célula | Jataí |
| Voo de orientação e voo nupcial | Princesa | Virgem; na jataí, 7 a 15 dias | Ninho novo pronto ou colônia sem rainha | Ambas |
| Fugir e invadir colônias órfãs | Princesa | Virgem | Ameaça das operárias, ao entardecer | Uruçu |
| Sair para acasalar, agrupar-se perto de colônias com princesa e não voltar | Macho | Adulto; na uruçu, maduro aos 9 a 11 dias | Maturidade | Ambas |
| Achar e limpar um oco, levar cerume e fazer o tubo | Batedoras e operárias | Enxame | Colônia forte e oco disponível | Ambas |

O voo de orientação foi descrito na jataí; o nupcial, nas duas espécies. Fontes extras desta tabela: [manual de criação da uruçu, UFRPE](https://philarchive.org/archive/DASCEM-2) e [atividade externa da uruçu, Univille](https://periodicos.univille.br/ABC/article/download/265/229/508).

### Inimigos das abelhas

Os três inimigos principais entram no jogo com dados reais. Proposta: o motor resolve a defesa das abelhas, e o jogador previne e responde com ações de manejo.

| Inimigo | Quando é mais comum | Dano | Defesa das abelhas | O que o jogador faz |
| --- | --- | --- | --- | --- |
| Forídeos (mosquinhas de até 5,5 mm) | Na época das chuvas; em Sergipe, de março a agosto. Entram sobretudo ao entardecer, e o risco é maior em colônia fraca, recém-dividida ou recém-transferida | As larvas comem o pólen e a cria nova e podem destruir a colmeia em poucos dias | Comem os ovos do parasita, cobrem o invasor com resina, cera e barro e retiram os mortos; colônia populosa se defende melhor | Armadilha de vinagre com furos de 2 a 4 mm na melgueira, trocada a cada 4 ou 5 dias; vedar frestas, não deixar pólen exposto e dividir em dia quente, de manhã |
| Abelha-limão (iratim) | De dia, com pico de saque entre 11h e 16h; num estudo em Ribeirão Preto, os ataques repetidos foram no inverno | Cerca a entrada com uma lâmina de cerume e leva mel, pólen e cerume; colônia fraca pode morrer após 3 ou 4 ataques seguidos. No estudo, 70% dos ataques foram em jataí | Na jataí, as guardas que pairam sentem o cheiro de limão e interceptam a invasora; outras espécies fecham a entrada com resina | Fechar a entrada da caixa atacada e manter por perto espécies que se defendem bem |
| Formigas (sarassará e lava-pés) | Sem época definida nas fontes; risco maior em colmeia fraca, recém-dividida ou recém-alimentada | Invadem a colmeia atrás de alimento e podem colonizá-la | Defesa geral: mordidas, bolinhas de própolis que imobilizam pequenos invasores e vedação da entrada | Vedar frestas, não pôr a caixa no chão, proteger os pés do suporte com graxa ou óleo e afastar galhos |

A validar: o calendário de ameaças do sítio na Bahia, já que os dados vêm de Sergipe, São Paulo e Santa Catarina. Fontes desta tabela: [Embrapa, 2024, cap. 8](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1163992/1/27762.pdf), [Lima et al., 2019](https://periodicos.ufs.br/AGRO/article/download/11776/8961/33013), [Epagri, 2018](https://publicacoes.epagri.sc.gov.br/BD/article/download/408/304/2860), [Santana et al., 2004](https://www.beesp.ib.usp.br/lestrimelitta_limao_msg_doce.pdf) e [Agência Fapesp, 2018](https://agencia.fapesp.br/28640).

### Jataí e uruçu-nordestina

| Aspecto | Jataí | Uruçu-nordestina |
| --- | --- | --- |
| Do ovo à adulta | 36,5 dias em média (33,5 a 40,3) | Cerca de 40 dias |
| Fases da cria | Ovo 6, larva 10, pré-pupa 3 e pupa 14,5 a 21,5 dias | A confirmar (Almeida, 1974) |
| Vida da operária adulta | Média de 21 dias; muitas chegam a 60 | Média de 31 dias; operárias poedeiras, 110 |
| Tarefas por idade | No ninho até uns 15 dias; campeira a partir de uns 16 | Começa no ninho, depois guarda e campo; idades a confirmar |
| Guarda | Soldados maiores, de 1% a 6% das operárias, no tubo ou pairando, por até 20 dias | 1 ou 2 abelhas pairando na entrada durante o dia |
| Como nasce a rainha | Em realeira, célula maior na borda do favo, com mais alimento | Em células iguais às das operárias; genética e alimento decidem |
| Princesas | Cerca de 0,2% da cria | Produzidas em excesso, a maioria é morta pelas operárias; algumas fogem e invadem colônias órfãs ao entardecer |
| Voo nupcial e postura | Voo aos 7 a 15 dias de idade; postura 2 a 4 dias depois | Da escolha da nova rainha à postura, cerca de 6 dias; o voo pode ocorrer com a rainha velha ainda viva |
| Vida da rainha | Indefinida, segundo a Embrapa | Média de 22 meses; até 7 anos |
| Machos | Cerca de 16% da cria; saem e não voltam | Maduros aos 9 a 11 dias, saem e não voltam; parte é filha de operárias |
| Tamanho da colônia | Cerca de 3.000 abelhas | Cerca de 1.500 operárias |
| Enxame | 500 a 1.000 operárias seguem a princesa | Fica a até cerca de 200 m da colônia-mãe |

No relógio do jogo (6 minutos por dia), uma operária de jataí leva cerca de 3h40 para nascer e vive umas 2 horas de jogo; a de uruçu leva 4 horas e vive pouco mais de 3.

Fontes da jataí: [Nates-Parra et al.](https://revistas.unal.edu.co/index.php/actabiol/article/download/21929/28500/100433), [Grüter et al., 2011](http://www.scielo.br/j/ne/a/9jqvvjnPSfZrfdcjWMTdXcw/?lang=en), [van Veen e Sommeijer, 2000](https://link.springer.com/article/10.1007/s000400050011), [Wikipedia](https://en.wikipedia.org/wiki/Tetragonisca_angustula) e [Embrapa, 2023](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1156873/1/EmbrapaFlorestas-2023-ModelosRestauracaoReservaLegalAraucaria-cap5.pdf). Fontes da uruçu: [Carvalho-Zilse e Kerr, 2004](https://cadaf.inpa.gov.br/fasciculos/34-4/PDF/v34n4a13.pdf), [Santana, 2003](https://repositorio.ufu.br/bitstream/123456789/27323/1/Detec%C3%A7%C3%A3oGenesDiferencialmente.pdf) e [Wikipedia](https://en.wikipedia.org/wiki/Melipona_scutellaris).

A validar: quantos enxames a jataí solta por ano (1, segundo van Veen e Sommeijer, ou 4 a 6, segundo a Apam); o tamanho da colônia de uruçu (1.500 operárias ou 4.000 a 6.000 abelhas, conforme a fonte); e as fases da cria da uruçu.

## Conteúdo educativo

O conhecimento sobre ASF entra no jogo de quatro formas, todas escolhidas por você.

| Forma | Como aparece no jogo contínuo |
| --- | --- |
| Nas regras do jogo | As mecânicas imitam o comportamento real das abelhas e o manejo real; um módulo posto cedo demais tem o custo que teria na vida real |
| Álbum de descobertas | Fichas de espécies, flores e ameaças, desbloqueadas jogando |
| Curiosidade por marco | Um texto curto quando algo acontece pela primeira vez, como o primeiro sobreninho; sem fases, a curiosidade vem nos marcos |
| Perguntas rápidas | Desafios de conhecimento; proposta: opcionais e ligados às fichas do álbum, nunca exigidos para avançar |

### Objetivos de aprendizagem (proposta)

1. Reconhecer as espécies do jogo e saber onde cada uma ocorre naturalmente.
2. Entender a caixa INPA: os módulos, o porão e por que as medidas mudam de uma espécie para outra.
3. Aplicar o manejo real: revisão, alimentação na entressafra, proteção, colheita e divisão.
4. Conhecer as regras reais da meliponicultura, como a Resolução CONAMA 496/2020.
5. Relacionar a floresta nativa e o plantio com a saúde das colônias.

Revisão científica: quem valida o conteúdo antes do lançamento ainda está em aberto.

## Arte e som

Estilo cartoon estilizado, com cara de jogo para adolescente e fiel à realidade.

- Sem visual infantil: o Google pode recusar o público 13+ se a página do jogo atrair crianças.
- Fiel à realidade: abelhas, caixas, plantas e manejo desenhados como são; nada de fantasia, como abelhas que falam.
- Proposta: cada espécie com suas marcas reais de cor, tamanho e entrada do ninho, para o jogador aprender a reconhecê-las.
- Som (proposta): ambiente do sítio e da floresta, sons do manejo e trilha discreta.
- Produção: quem desenha e quem faz o som, em aberto.

## Interface e telas

Sem etapas, o mapa de etapas vira o sítio, e a tela de etapa vira a caixa.

| Tela | Para que serve |
| --- | --- |
| Menu | Continuar o jogo, configurações e créditos |
| Sítio | Visão geral da floresta nativa, das áreas de plantio e do meliponário |
| Meliponário | As caixas instaladas e o estado de cada colônia |
| Caixa | Abrir a caixa INPA, ver os módulos e fazer o manejo |
| Caderno do meliponicultor | Ficha de cada colônia com o histórico do manejo (proposta) |
| Álbum | Fichas de espécies, flores e ameaças descobertas |
| Loja | Compras únicas, Restaurar compras e aguardando aprovação |
| Lojinha | Venda de mel, própolis e saburá; fica no sítio e é diferente da Loja de compras (proposta) |
| Configurações | Som, termos de uso e política de privacidade |

Em todas as telas de jogo aparece a barra do ano: as quatro estações e um marcador com o dia, de 1 a 365.

O caderno imita a escrituração zootécnica, o registro com fichas individuais por colônia que a Embrapa recomenda ([Embrapa, 2024](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1164450/1/Meliponicultura500Perguntas500RespostasCap12.pdf)).

## Monetização e design ético

O modelo segue o da arquitetura: parte grátis e compra única, sem anúncios e sem loot box. Sem etapas, falta decidir o que é pago.

### O que pode ser pago (proposta)

| Opção | Como funciona | Ponto de atenção |
| --- | --- | --- |
| Espécies | A Jataí é grátis; cada espécie nova é uma compra | Só espécies que ocorrem naturalmente na região do sítio |
| Regiões | Um sítio em outra região, com as espécies nativas de lá | Mais arte e conteúdo por compra |
| Jogo completo | Uma parte grátis e o resto liberado numa compra só | Definir onde termina a parte grátis |

Também dá para vender um pacote com tudo. A arquitetura serve para qualquer opção: o JSON marca cada conteúdo como grátis ou pago, com o ID do produto na loja. Preços: em aberto.

### Regras que não mudam

- Compra única, não consumível, pela Google Play e pela App Store.
- Loja com Restaurar compras e o estado aguardando aprovação, que destrava sozinho quando a loja confirma.
- Sem cronômetro de oferta, sem "só hoje" e sem bônus por tempo jogado (ECA Digital).
- Como o tempo só anda enquanto se joga, não existe espera fora do jogo; proposta: nunca vender aceleração do tempo.
- Proposta: o dinheiro da lojinha só se ganha jogando e nunca é vendido por dinheiro real.

## Requisitos técnicos e legais

A arquitetura registrada no projeto continua valendo, com três ajustes por causa do jogo contínuo.

- Base: Phaser 4 + TypeScript, empacotado com Capacitor para Android e iOS, Vite no desenvolvimento; 100% offline, sem servidor, sem login e sem coleta de dados pessoais.
- Ajuste 1: as cenas mudam; o mapa de etapas vira o sítio, e a etapa vira a caixa.
- Ajuste 2: o núcleo de regras passa a simular o tempo jogado, as colônias e o sítio; o save guarda o dia do ano e o estado de cada colônia e de cada área. Como o tempo só anda com o jogo aberto, o jogo não depende do relógio do celular.
- Ajuste 3: o que é pago deixa de ser etapa e vira o conteúdo que você definir (espécie, região ou jogo completo).
- Proposta: espécies, medidas de caixa, plantas e textos também em JSON, cada dado com a sua fonte, para facilitar a revisão científica.

### Desempenho do motor de abelhas

Proposta para o motor por abelha não pesar no celular:

- Cada abelha é um registro compacto de dados, e não um objeto desenhado na tela.
- O motor anda em passos do relógio do jogo, por exemplo a cada hora do sítio (15 segundos reais), e não a cada quadro; mudanças de fase bastam uma vez por dia do jogo.
- Só as abelhas que o jogador está vendo são desenhadas e animadas, com um limite por tela.
- A simulação roda num Web Worker, separada da tela, para o toque não travar.
- Teste de carga no protótipo: 49 colônias de jataí com 3.000 abelhas cada, cerca de 150 mil, num Android de entrada.

### Lojas e legislação

Resumo da arquitetura; levantamento informativo, não é parecer jurídico.

- ECA Digital: compras autorizadas pelos pais pela loja, sem loot box e sem interfaces que manipulem a decisão.
- Google Play: público só de 13 anos para cima, com ícone, telas e descrição de jogo para adolescente.
- App Store: idade mínima 13+, desbloqueio por compra dentro do app e botão Restaurar compras.
- Termos de uso e política de privacidade em português, pela lei brasileira, dizendo que o jogo não coleta dados pessoais.
- Nome nas lojas (proposta): Abelhas Nativas, com Meliponicultura no subtítulo da App Store e na descrição curta da Google Play. O nome completo tem 32 caracteres, e as duas lojas aceitam até 30 no nome do app.

## Escopo e cronograma

Proposta: provar a simulação com uma caixa de Jataí antes de construir o sítio inteiro. Datas: em aberto.

1. Protótipo: uma caixa INPA com porão e ninho, uma colônia de Jataí com motor por abelha, a barra do ano andando enquanto se joga e o primeiro sobreninho acrescentado. Substitui o protótipo da arquitetura (abelha, flor e etapa trancada), que supunha etapas.
2. Primeiro ano jogável: o sítio com as três áreas, o manejo básico, as quatro estações e o álbum, só com a Jataí.
3. Versão 1.0: as próximas espécies, a loja com o conteúdo pago definido, os termos de uso, a política de privacidade e a revisão científica.

## Pontos em aberto

- [ ] O que é pago num jogo sem etapas (espécies, regiões ou o jogo completo) e os preços.
- [ ] Onde fica o sítio, estado e bioma; a Bahia é a proposta, por abrigar até 7 das 10 espécies.
- [ ] Qual mandaguari, qual moça-branca e qual mandaçaia entram no jogo.
- [ ] O porão é a lixeira da cartilha do INPA ou outro módulo.
- [ ] Medidas da caixa INPA com fonte técnica para uruçu-nordestina, jandaíra, tiúba, rajada e moça-branca.
- [ ] Se jandaíra e moça-branca vão bem na caixa INPA.
- [ ] Rever a duração do ano, hoje 36,5 horas de jogo.
- [ ] Quais ações de manejo entram na primeira versão (tabela da Jogabilidade).
- [ ] O que plantar nas áreas abertas.
- [ ] Metas de longo prazo e se o jogador começa iniciante ou experiente.
- [ ] Onde entram as perguntas rápidas.
- [ ] Quem faz a revisão científica e quais dados calibram a simulação.
- [ ] Quem produz a arte e o som.
- [x] Nome do jogo: Abelhas Nativas: Meliponicultura.
- [ ] Conferir se o nome está livre nas lojas e no INPI; a UFV tem um jogo acadêmico com nome parecido, Abelhas Nativas Brasileiras (2024).
- [ ] Rascunho dos termos de uso e da política de privacidade.
- [ ] Atualizar a arquitetura do projeto: cenas, núcleo de regras e conteúdo pago.
- [ ] O que o dinheiro do jogo compra e quanto vale cada produto na lojinha.
- [ ] Regras reais para vender mel, própolis e saburá.
- [ ] Calendário do sítio na Bahia: falta de flores, divisão de colônias e ameaças.

## Fontes

- [Jaffé et al. (2015), Bees for Development: Brazilian survey reveals how to optimize stingless beekeeping, PLOS ONE](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1012744/1/journal.pone.0121157.pdf)
- [ICMBio, Portaria nº 665/2021, Catálogo Nacional de Abelhas-Nativas-Sem-Ferrão (DOU de 9/11/2021)](https://abrapch.org.br/wp-content/uploads/2021/11/Diario-Oficial-da-Uniao-Secao-1-n-210-09112021.pdf)
- [Embrapa (2024), Meliponicultura: o produtor pergunta, a Embrapa responde, cap. 8, Pragas e doenças](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1163992/1/27762.pdf)
- [Embrapa (2024), cap. 9, Caixas padronizadas](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164345/1/500P500R-Meliponicultura-98-104.pdf)
- [Embrapa (2024), cap. 12, Manejo do meliponário](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1164450/1/Meliponicultura500Perguntas500RespostasCap12.pdf)
- [Embrapa (2024), cap. 19, Legislação ambiental](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1164393/1/PL-SEDE-22052024a.pdf)
- [Embrapa Florestas (2016), Comunicado Técnico 383, Modelos de colmeias racionais para a criação de mandaçaia](https://www.infoteca.cnptia.embrapa.br/infoteca/bitstream/doc/1053592/1/CT383GuilhermeSchuhli.pdf)
- [Embrapa Florestas (2023), Pequeno manual de criação de jataí](https://www.alice.cnptia.embrapa.br/alice/bitstream/doc/1156873/1/EmbrapaFlorestas-2023-ModelosRestauracaoReservaLegalAraucaria-cap5.pdf)
- [Epagri (2018), Boletim Didático 141, Meliponicultura](https://publicacoes.epagri.sc.gov.br/BD/article/download/408/304/2860)
- [Carvalho-Zilse et al. (2005), Criação de abelhas sem ferrão, INPA e Ibama](https://acervo.socioambiental.org/sites/default/files/documents/l3d00057.pdf)
- [UFPB (2019), Potencial socioeconômico da criação de abelhas sem ferrão na Paraíba e no Rio Grande do Norte (resumo)](https://repositorio.ufpb.br/jspui/handle/123456789/15186)
- [Plantando Vida (2013), Modelo de caixa para Jataí](https://fablablivresp.prefeitura.sp.gov.br/sites/default/files/projetos/arquivos/modelo_de_caixa_para_jatai_plantando_vida.pdf)
- [Wikipedia, Caixa racional](https://pt.wikipedia.org/wiki/Caixa_racional)
- [Nates-Parra, Villa e Vergara, Ciclo de desarrollo de Trigona (Tetragonisca) angustula, Acta Biológica Colombiana](https://revistas.unal.edu.co/index.php/actabiol/article/download/21929/28500/100433)
- [Grüter, Kärcher e Ratnieks (2011), defesa do ninho da jataí, Neotropical Entomology](http://www.scielo.br/j/ne/a/9jqvvjnPSfZrfdcjWMTdXcw/?lang=en)
- [van Veen e Sommeijer (2000), reprodução da colônia da jataí, Insectes Sociaux](https://link.springer.com/article/10.1007/s000400050011)
- [Agência Fapesp (2018), defesa dos ninhos de jataí](https://agencia.fapesp.br/28640)
- [Santana et al. (2004), abelha iratim, Mensagem Doce 78](https://www.beesp.ib.usp.br/lestrimelitta_limao_msg_doce.pdf)
- [Wikipedia, Tetragonisca angustula](https://en.wikipedia.org/wiki/Tetragonisca_angustula)
- [Carvalho-Zilse e Kerr (2004), substituição de rainhas da uruçu e da tiúba, Acta Amazonica](https://cadaf.inpa.gov.br/fasciculos/34-4/PDF/v34n4a13.pdf)
- [Santana (2003), dissertação sobre Melipona scutellaris, UFU](https://repositorio.ufu.br/bitstream/123456789/27323/1/Detec%C3%A7%C3%A3oGenesDiferencialmente.pdf)
- [Wikipedia, Melipona scutellaris](https://en.wikipedia.org/wiki/Melipona_scutellaris)
- [UFRPE, Criação e manejo da abelha uruçu nordestina (manual)](https://philarchive.org/archive/DASCEM-2)
- [Univille, atividade externa de Melipona scutellaris](https://periodicos.univille.br/ABC/article/download/265/229/508)
- [Lima et al. (2019), flutuação de forídeos em uruçu e mandaçaia, Japaratuba (SE), Agroforestalis News](https://periodicos.ufs.br/AGRO/article/download/11776/8961/33013)
- [Apple, Ajuda do App Store Connect: informações do app (nome e subtítulo com até 30 caracteres)](https://developer.apple.com/help/app-store-connect/reference/app-information/)
- [Google, Ajuda do Play Console: página do app na loja (nome com até 30 caracteres, descrição curta com até 80)](https://support.google.com/googleplay/android-developer/answer/113469)
- [Oda et al. (2024), Abelhas Nativas Brasileiras: jogo digital para educação ambiental, Anais do WSIS, SBC](https://sol.sbc.org.br/index.php/wsis/article/view/33693)
