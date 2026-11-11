// Correção de 14 questões reais do ENEM que entraram no banco sem o texto-base
// (05/10/2026). A importação perdeu o texto porque o PDF do INEP usa fonte com
// codificação própria: extração de texto devolve lixo. Fonte desta transcrição:
// a imagem da página oficial em public/questoes-imagens/<id>.webp, conferida
// com a prova azul do 1º dia (2021_PV_impresso_D1_CD1.pdf e 2023). Gabaritos
// conferidos com o oficial (2021_GB e 2023_GB): todos já estavam certos.
//
// Além do texto, várias alternativas tinham palavra trocada. Na Q75, a correta
// (E) dizia "negação" onde o original diz "conjugação de saberes empíricos".
// Só entram aqui as alternativas que diferem do original.

type Letra = 'A' | 'B' | 'C' | 'D' | 'E';

export interface CorrecaoQuestao {
  id: string;
  rotulo: string;
  /* Começo do enunciado que está no banco hoje: só corrige se ainda bater. */
  enunciadoAtualComeca: string;
  enunciado: string;
  alternativas?: Partial<Record<Letra, string>>;
  materia?: string;
  subtema?: string;
  tema?: string;
}

export const CORRECOES: CorrecaoQuestao[] = [
  {
    id: 'cmoucu2ns0000uoz9m3bc8s2n',
    rotulo: 'ENEM 2021 D1 Q1 (espanhol)',
    enunciadoAtualComeca: 'Esse trecho da resenha de um livro de entrevistas',
    enunciado: `Se reunieron en un volumen todas las entrevistas dadas por el poeta y dramaturgo Federico García Lorca. Lorca concedió 133 entrevistas; leyéndolas se sabrá qué estaba por detrás de la poética del escritor andaluz. Sobre su obra declaró en una de ellas: "No he sido nunca poeta de minoría. He tratado de poner en mis poemas lo de todos los tiempos, lo permanente, lo humano. A mí me ataca lo humano, es el elemento fundamental en toda obra de arte". Y en otra dijo: "Hoy no interesa más que una problemática: lo social. La obra que no siga esa dirección está condenada al fracaso, aunque sea muy buena". En su última entrevista, de junio de 1936, Lorca se muestra profético: "Ni el poeta ni nadie tiene la clave y el secreto del mundo. Quiero ser bueno. Sé que la poesía eleva y creo firmemente que si hay un más allá tendré la agradable sorpresa de encontrarme con él. Pero el dolor del hombre y la injusticia constante que mana del mundo, y mi propio cuerpo y mi propio pensamiento, me evitan trasladar mi casa a las estrellas".

AYÉN, X. Retrato del poeta como "muchachón gitanazo". Disponível em: www.clarin.com. Acesso em: 8 dez. 2017 (adaptado).

Esse trecho da resenha de um livro de entrevistas concedidas por Federico García Lorca tem por finalidade`,
  },
  {
    id: 'cmoucu2nx0001uoz9hp4gztpn',
    rotulo: 'ENEM 2021 D1 Q2 (espanhol)',
    enunciadoAtualComeca: 'No fragmento de Amuleto, de Roberto Bolaño',
    enunciado: `Amuleto

Lo único cierto es que llegué a México en 1965 y me planté en casa de León Felipe y en casa de Pedro Garfias y les dije aquí estoy para lo que gusten mandar. Y les debí de caer simpática, porque antipática no soy, aunque a veces soy pesada, pero antipática nunca. Y lo primero que hice fue coger una escoba y ponerme a barrer el suelo de sus casas y luego a limpiar las ventanas y cada vez que podía les pedía dinero y les hacía compra. Y ellos me decían con ese tono español tan peculiar, esa musiquilla distinta que no los abandonó nunca, como si encircularan las zetas y las ces y como si dejaran a las eses más huérfanas y libidinosas que nunca, Auxilio, me decían, deja ya de trasegar por el piso, Auxilio, deja esos papeles tranquilos, mujer, que el polvo siempre se ha avenido con la literatura.

BOLAÑO, R. A. Tres novelas. Barcelona: Círculo de Lectores, 2003.

No fragmento do romance, a uruguaia Auxilio narra a experiência que viveu no México ao trabalhar voluntariamente para dois escritores espanhóis. Com base na relação com os escritores, ela reflete sobre a(s)`,
    alternativas: {
      B: 'sujeira dos livros de literatura.',
      C: 'distintas maneiras de acolher do mexicano.',
    },
  },
  {
    id: 'cmoucu2o70005uoz9ywazkbq4',
    rotulo: 'ENEM 2021 D1 Q6',
    enunciadoAtualComeca: 'Um asteroide de cerca de mil metros de diâmetro',
    enunciado: `Um asteroide de cerca de um mil metros de diâmetro, viajando a 288 mil quilômetros por hora, passou a uma distância insignificante — em termos cósmicos — da Terra, pouco mais do dobro da distância que nos separa da Lua. Segundo os cálculos matemáticos, o asteroide cruzou a órbita da Terra e somente não colidiu porque ela não estava naquele ponto de interseção. Se ele tivesse sido capturado pelo campo gravitacional do nosso planeta e colidido, o impacto equivaleria a 40 bilhões de toneladas de TNT, ou o equivalente à explosão de 40 mil bombas de hidrogênio, conforme calcularam os computadores operados pelos astrônomos do programa de Exploração do Sistema Solar da Nasa; se caísse no continente, abriria uma cratera de cinco quilômetros, no mínimo, e destruiria tudo o que houvesse num raio de milhares de outros; se desabasse no oceano, provocaria maremotos que devastariam imensas regiões costeiras. Enfim, uma visão do Apocalipse.

Disponível em: http://bdjur.stj.jus.br. Acesso em: 23 abr. 2010.

Qual estratégia caracteriza o texto como uma notícia alarmante?`,
    alternativas: {
      B: 'A recorrência de formulações hipotéticas.',
      C: 'A referência à opinião dos astrônomos.',
      D: 'A utilização da locução adverbial "no mínimo".',
      E: 'A comparação com a distância da Lua à Terra.',
    },
    // Estava em Física ("astronomia"): é leitura de notícia, de Linguagens.
    materia: 'Português',
    subtema: 'Notícia: estratégia argumentativa para criar tom alarmante',
    tema: 'Gêneros Textuais e Multimodalidade',
  },
  {
    id: 'cmoucu2oi000auoz96om3ftc2',
    rotulo: 'ENEM 2021 D1 Q11',
    enunciadoAtualComeca: 'Sinhá',
    enunciado: `Sinhá

Se a dona se banhou
Eu não estava lá
Por Deus Nosso Senhor
Eu não olhei Sinhá
Estava lá na roça
Sou de olhar ninguém
Não tenho mais cobiça
Nem enxergo bem

Para que me pôr no tronco
Para que me aleijar
Eu juro a vosmecê
Que nunca vi Sinhá
[...]
Por que talhar meu corpo
Eu não olhei Sinhá
Para que que vosmincê
Meus olhos vai furar
Eu choro em iorubá
Mas oro por Jesus
Para que que vassuncê
Me tira a luz.

CHICO BUARQUE; JOÃO BOSCO. Chico. Rio de Janeiro: Biscoito Fino, 2011 (fragmento).

No fragmento da letra da canção, o vocabulário empregado e a situação retratada são relevantes para o patrimônio linguístico e identitário do país, na medida em que`,
    alternativas: {
      A: 'remetem à violência física e simbólica contra os povos escravizados.',
      B: 'valorizam as influências da cultura africana sobre a música nacional.',
      C: 'relativizam o sincretismo constitutivo das práticas religiosas brasileiras.',
      D: 'narram os infortúnios da relação amorosa entre membros de classes sociais diferentes.',
      E: 'problematizam as diferentes visões de mundo na sociedade durante o período colonial.',
    },
  },
  {
    id: 'cmoucu2ou000guoz9vo2vod6w',
    rotulo: 'ENEM 2021 D1 Q17',
    enunciadoAtualComeca: 'A história do futebol brasileiro contém',
    enunciado: `A história do futebol brasileiro contém, ao longo de um século, registros de episódios racistas. Eis o paradoxo: se, de um lado, a atividade futebolística era depreciada aos olhos da "boa sociedade" como profissão destinada aos pobres, negros e marginais, de outro, achava-se investida do poder de representar e projetar a nação em escala mundial. A Copa do Mundo no Brasil, em 1950, viria a se constituir, nesse sentido, em uma rara oportunidade. Contudo, na decisão contra o Uruguai sobreveio o inesperado revés. As crônicas esportivas elegiam o goleiro Barbosa e o defensor Bigode como bodes expiatórios, "descarregando nas costas" dos jogadores os "prejuízos" da derrota. Uma chibata moral, eis a sentença proferida no tribunal dos brancos. Nos anos 1970, por não atender às expectativas normativas suscitadas pelo estereótipo do "bom negro", Paulo César Lima foi classificado como "jogador-problema". Ele esboçava a revolta da chibata no futebol brasileiro. Enquanto Barbosa e Bigode, sem alternativa, suportaram o linchamento moral na derrota de 1950, Paulo César contra-atacava os que pretendiam condená-lo pelo insucesso de 1974. O jogador assumia as cores e as causas defendidas pela esquadra dos pretos em todas as esferas da vida social. "Sinto na pele esse racismo subjacente", revelou à imprensa francesa: "Isto é, ninguém ousa pronunciar a palavra 'racismo'. Mas posso garantir que ele existe, mesmo na Seleção Brasileira". Sua ousadia consistiu em pronunciar a palavra interdita no espaço simbólico do discurso oficial para reafirmar o mito da democracia racial.

Disponível em: https://observatorioracialfutebol.com.br. Acesso em: 22 jun. 2019 (adaptado).

O texto atribui o enfraquecimento do mito da democracia racial no futebol à`,
  },
  {
    id: 'cmoucu2oz000iuoz91igit2f9',
    rotulo: 'ENEM 2021 D1 Q19',
    enunciadoAtualComeca: 'Coincidindo com o Dia Internacional dos Direitos',
    enunciado: `Coincidindo com o Dia Internacional dos Direitos da Infância, foram apresentados diversos trabalhos que mostram as mudanças que afetam a vida das crianças. Um desses estudos compara o que sonham e brincam as crianças hoje em relação às dos anos 1990. E o que se descobriu é que as crianças têm agora menos lazer e estão mais sobrecarregadas por deveres e atividades extracurriculares do que as de 25 anos atrás. As crianças de hoje não só dedicam menos tempo para brincar, como também, quando brincam, a maioria não o faz com outras crianças no parque, na rua ou na praça, mas em casa e muitas vezes sozinhas. E já não brincam tanto com brinquedos, mas com aparelhos eletrônicos, entre os quais predomina o jogo individual com a máquina.

OLIVA, M. P. O direito das crianças ao lazer... e a crescer sem carências. El País, 20 nov. 2015 (adaptado).

O texto indica que as transformações nas experiências lúdicas na infância`,
  },
  {
    id: 'cmoucu2ph000ouoz9vjgferc6',
    rotulo: 'ENEM 2021 D1 Q25',
    enunciadoAtualComeca: 'No fragmento de diálogo, a fala de uma personagem',
    enunciado: `– O senhor pensa que só porque o deixaram morar neste país pode logo ir fazendo o que quer? Nunca ouviu falar num troço chamado autoridades constituídas? Não sabe que tem de conhecer as leis do país? Não sabe que existe uma coisa chamada Exército Brasileiro, que o senhor tem de respeitar? Que negócio é esse? [...] Eu ensino o senhor a cumprir a lei, ali no duro: "dura lex"! Seus filhos são uns moleques e outra vez que eu souber que andaram incomodando o General, vai tudo em cana. Morou? Sei como tratar gringos feito o senhor. [...] Foi então que a mulher do vizinho do General interveio:
– Era tudo que o senhor tinha a dizer a meu marido?
O delegado apenas olhou-a, espantado com o atrevimento.
– Pois então fique sabendo que eu também sei tratar tipos como o senhor. Meu marido não é gringo nem meus filhos são moleques. Se por acaso importunaram o General, ele que viesse falar comigo, pois o senhor também está nos importunando. E fique sabendo que sou brasileira, sou prima de um Major do Exército, sobrinha de um Coronel, e filha de um General! Morou? Estarrecido, o delegado só teve força para engolir em seco e balbuciar humildemente: – Da ativa, minha senhora?.

SABINO, F. A mulher do vizinho. In: Os melhores contos. Rio de Janeiro: Record, 1986.

A representação do discurso intimidador engendrada no fragmento é responsável por`,
    alternativas: {
      A: 'ironizar atitudes e ideias xenofóbicas.',
      E: 'exaltar relações de poder estereotipadas.',
    },
  },
  {
    id: 'cmoucu2pj000puoz9qyzysrk8',
    rotulo: 'ENEM 2021 D1 Q26',
    enunciadoAtualComeca: 'Os velhos papéis, quando não são consumidos',
    enunciado: `Os velhos papéis, quando não são consumidos pelo fogo, às vezes acordam de seu sono para contar notícias do passado.

É assim que se descobre algo novo de um nome antigo, sobre o qual já se julgava saber tudo, como Machado de Assis.

Por exemplo, você provavelmente não sabe que o autor carioca, morto em 1908, escreveu uma letra do hino nacional em 1867 — e não poderia saber mesmo, porque os versos seguiam inéditos. Até hoje.

Essa letra acaba de ser descoberta, em um jornal antigo de Florianópolis, pelo pesquisador independente Felipe Rissato.

"Das florestas em que habito/ Solto um canto varonil:/ Em honra e glória de Pedro/ O gigante do Brasil", diz o começo do hino, composto de sete estrofes em redondilhas maiores, ou seja, versos de sete sílabas poéticas. O trecho também é o refrão da música.

O Pedro mencionado é o imperador Dom Pedro II. O bruxo do Cosme Velho compôs a letra para o aniversário de 42 anos do monarca, em 2 de dezembro daquele ano — o hino seria apresentado naquele dia no teatro da cidade de Desterro, antigo nome de Florianópolis.

Disponível em: www.revistaprosaversoearte.com. Acesso em: 4 dez. 2018 (adaptado).

Considerando-se as operações de retomada de informações na estruturação do texto, há interdependência entre as expressões`,
  },
  {
    id: 'cmoucu2pn000ruoz98l0osbd4',
    rotulo: 'ENEM 2021 D1 Q28',
    enunciadoAtualComeca: 'O texto relata que uma rede social virtual',
    enunciado: `Thumbs Up

Ponto positivo para o Facebook, que vai dar uma ajeitada na casa para, quem sabe, não ser mais conhecido como o espaço da treta. Durante a F8, sua conferência anual, a empresa anunciou a maior mudança de design do serviço em 5 anos. Agora, o polêmico feed de notícias deixa de ser o protagonista, e o queridinho da rede social se torna o segmento de Grupos (é o Orkut fazendo escola?). Segundo Mark Zuckerberg, mais de 1 bilhão de usuários mensais entram nessa aba do aplicativo, e 400 mil deles já estão integrados em grupos de "assuntos significativos". O objetivo agora é aumentar o tráfego, oferecendo mais sugestões e ferramentas especiais para quem gerencia essas comunidades. Além disso, o Marketplace, que já tem mais de 800 milhões de usuários, vai ganhar mais atenção e integração. Com isso, parece que há um novo padrão se montando na rede social: sai o feed, entra a segmentação, que pode ser uma boa porta para monetização nos próximos anos. No mesmo evento, Zuckerberg também disse que o futuro do Facebook é a privacidade, mas não deu muitos detalhes de como vai proteger seus clientes daqui para frente. Evitar que vazamentos de dados dos usuários aconteçam é um bom começo.

#FicaaDica

Disponível em: https://thebrief.us16.list-manage.com. Acesso em: 3 maio 2019 (adaptado).

O texto relata que uma rede social virtual realizará sua maior mudança de design dos últimos anos. Esse fato revela que as tecnologias de informação e comunicação`,
    alternativas: {
      A: 'buscam oferecer mais privacidade.',
    },
  },
  {
    id: 'cmoucu2pp000suoz9wsfobpla',
    rotulo: 'ENEM 2021 D1 Q29',
    enunciadoAtualComeca: 'Reaprender a ler notícias. O texto defende',
    enunciado: `Reaprender a ler notícias

Não dá mais para ler um jornal, revista ou assistir a um telejornal da mesma forma que fazíamos até o surgimento da rede mundial de computadores. O Observatório da Imprensa antecipou isso lá nos idos de 1996 quando cunhou o slogan "Você nunca mais vai ler jornal do mesmo jeito". De fato, hoje já não basta mais ler o que está escrito ou falado para estar bem informado. É preciso conhecer as entrelinhas e saber que não há objetividade e nem isenção absolutas, porque cada ser humano vê o mundo de uma forma diferente. Ter um pé atrás passou a ser a regra básica número um de quem passa os olhos por uma primeira página, capa de revista ou chamadas de um noticiário na TV.

Há uma diferença importante entre desconfiar de tudo e procurar ver o maior número possível de lados de um mesmo fato, dado ou evento. Apenas desconfiar não resolve porque se trata de uma atitude passiva. É claro, tudo começa com a dúvida, mas a partir dela é necessário ser proativo, ou seja, investigar, estudar, procurar os elementos ocultos que sempre existem numa notícia. No começo é um esforço solitário que pode se tornar coletivo à medida que mais pessoas descobrem sua vulnerabilidade informativa.

Disponível em: www.observatoriodaimprensa.com.br. Acesso em: 30 set. 2015 (adaptado).

No texto, os argumentos apresentados permitem inferir que o objetivo do autor é convencer os leitores a`,
    alternativas: {
      C: 'adotarem uma postura crítica em relação às informações recebidas.',
      E: 'valorizarem reportagens redigidas com imparcialidade diante dos fatos.',
    },
  },
  {
    id: 'cmoucu2pv000vuoz9o1jsv3sx',
    rotulo: 'ENEM 2021 D1 Q62',
    enunciadoAtualComeca: 'Instituições da indústria brasileira',
    enunciado: `Constatou-se uma ínfima inserção da indústria brasileira nas novas tecnologias ancoradas na microeletrônica, capazes de acarretar elevação da produtividade nacional de forma sustentada. Os motores do crescimento nacional, há décadas, são os grupos relacionados a commodities agroindustriais e à indústria representativa do antigo padrão fordista de produção, esta última também limitada pela baixa potencialidade futura de desencadear inovações tecnológicas capazes de proporcionar elevação sustentada da produtividade.

AREND, M. A industrialização do Brasil ante a nova divisão internacional do trabalho. Disponível em: www.ipea.gov.br. Acesso em: 16 jul. 2015 (adaptado).

Um efeito desse cenário para a sociedade brasileira tem sido o(a)`,
    alternativas: {
      B: 'retorno à estatização econômica.',
    },
  },
  {
    id: 'cmoucu2qm0018uoz9bznua8gs',
    rotulo: 'ENEM 2021 D1 Q75',
    enunciadoAtualComeca: 'O texto trata da medicina nos primeiros séculos',
    enunciado: `De um lado, ancorados pela prática médica europeia, por outro, pela terapêutica indígena, com seu amplo uso da flora nativa, os jesuítas foram os reais iniciadores do exercício de uma medicina híbrida que se tornou marca do Brasil colonial. Alguns religiosos vinham de Portugal já versados nas artes de curar, mas a maioria aprendeu na prática diária as funções que deveriam ser atribuídas a um físico, cirurgião, barbeiro ou boticário.

GURGEL, C. Doenças e curas: o Brasil nos primeiros séculos. São Paulo: Contexto, 2010 (adaptado).

Conforme o texto, o que caracteriza a construção da prática medicinal descrita é a`,
    alternativas: {
      B: 'rejeição dos dogmas cristãos.',
      E: 'conjugação de saberes empíricos.',
    },
  },
  {
    id: 'cmoucu2qq001auoz9o3y2m6jd',
    rotulo: 'ENEM 2021 D1 Q77',
    enunciadoAtualComeca: 'Por que o Brasil continuou um só',
    enunciado: `Por que o Brasil continuou um só enquanto a América espanhola se dividiu em vários países?

Para o historiador brasileiro José Murilo de Carvalho, no Brasil, parte da sociedade era muito mais coesa ideologicamente do que a espanhola. Carvalho argumenta que isso se deveu à tradição burocrática portuguesa. "Portugal nunca permitiu a criação de universidades em sua colônia". Por outro lado, na América espanhola, entre 1772 e 1872, 150 mil estudantes se formaram em universidades locais. Para o historiador mexicano Alfredo Ávila Rueda, as universidades na América espanhola eram, em sua maioria, reacionárias. Nesse sentido, o historiador mexicano diz acreditar que a livre circulação de impressos (jornais, livros e panfletos) na América espanhola, que não era permitida na América portuguesa (a proibição só foi revertida em 1808), teve função muito mais importante na construção de regionalismos do que propriamente as universidades.

BARRUCHO, L. Disponível em: www.bbc.com. Acesso em: 8 set. 2019 (adaptado).

Os pontos de vista dos historiadores referidos no texto são divergentes em relação ao`,
    alternativas: {
      A: 'papel desempenhado pelas instituições de ensino na criação das múltiplas identidades.',
      B: 'controle exercido pelos grupos de imprensa na centralização das esferas administrativas.',
      C: 'abandono sofrido pelas comunidades de docentes na concepção de coletividades políticas.',
    },
  },
  {
    id: 'cmoueopqw008zuoz9bf3fc8n4',
    rotulo: 'ENEM 2023 D1 Q23',
    enunciadoAtualComeca: 'A representação da mulher apresentada no Texto I',
    enunciado: `TEXTO I

Zapeei os canais, como há dezenas de anos faço, e pá: parei num que exibia um episódio daquela velha família do futuro, Os Jetsons.

Nesse episódio em particular, a Jane Jetson, esposa do George, tratava de dirigir aquele veículo voador deles. Meu queixo foi caindo à medida que as piadinhas machistas sobre mulheres dirigirem foram se acumulando. Impressionante! Que futuro careta aqueles roteiristas imaginavam! Seriam incapazes de projetar algo melhor, e não apenas em termos de tecnologias, robôs e carros voadores? Será que nossa máxima visão de futuro só atinge as coisas, e jamais as pessoas? Como a Jane, uma mulher de 33 anos no desenho, poderia ser o que foram as minhas bisavós?

O futuro, naquele desenho, se esqueceu de ser melhor nas relações entre as pessoas. Aliás... tão parecido com a vida.

Fiquei de cara, como dizemos aqui, ou como dizíamos na minha adolescência, pobre adolescência, aprendendo, sem querer e sem muita defesa, um futuro tão besta quanto o passado.

RIBEIRO, A. E. Disponível em: www.rascunho.com.br. Acesso em: 21 out. 2021 (adaptado).

TEXTO II

Masculino e feminino são campos escorregadios que só se definem por oposição, sempre incompleta, um do outro. São formações imaginárias que buscam produzir uma diferença radical e complementar onde só existem, de fato, mínimas diferenças. O resto é questão de estilo. Até pelo menos a segunda metade do século 19, o divisor de águas era claro: os homens ocupavam o espaço público. As mulheres tratavam da vida privada. Privada de quê? De visibilidade, diria Hannah Arendt. De visibilidade pública. Do que as mulheres estiveram privadas até o século 20 foi de presença pública manifesta não em imagem, mas em palavra. A palavra feminina, reservada ao espaço doméstico, não produzia diferença na vida social.

KHEL, M. R. Disponível em: https://alias.estadao.com.br. Acesso em: 19 out. 2021 (adaptado).

A representação da mulher apresentada no Texto I pode ser explicada pelo Texto II no que diz respeito à(às)`,
  },
  // 09/11/2026: duas do 2º dia que estavam sem a frase da pergunta (o enunciado
  // acabava no texto-base e as alternativas ficavam soltas). Transcritas da
  // página em public/questoes-imagens/<id>.webp; o gabarito já estava certo.
  {
    id: 'cmoudnnsk001ouoz94ovrthg9',
    rotulo: 'ENEM 2021 D2 Q91 (lipase ácida lisossômica)',
    enunciadoAtualComeca: 'A deficiência de lipase ácida lisossômica é uma doença hereditária',
    enunciado: `A deficiência de lipase ácida lisossômica é uma doença hereditária associada a um gene do cromossomo 10. Os pais dos pacientes podem não saber que são portadores dos genes da doença até o nascimento do primeiro filho afetado. Quando ambos os progenitores são portadores, existe uma chance, em quatro, de que seu bebê possa nascer com essa doença.

ANDERSON, R. A. et. al. In: Situ Localization of the Genetic Locus Encoding the Lysosomal Acid Lipase/Cholesteryl Esterase (LIPA) Deficient in Wolman Disease to Chromosome 10q23.2-q23.3. Genomics, n. 1, jan. 1993 (adaptado).

Essa é uma doença hereditária de caráter`,
  },
  {
    id: 'cmoudnnts0026uoz9sp6lvi9f',
    rotulo: 'ENEM 2021 D2 Q109 (dejetos suínos)',
    enunciadoAtualComeca: 'Com o aumento da população de suínos no Brasil',
    enunciado: `Com o aumento da população de suínos no Brasil, torna-se necessária a adoção de métodos para reduzir o potencial poluidor dos resíduos dessa agroindústria, uma vez que, comparativamente ao esgoto doméstico, os dejetos suínos são 200 vezes mais poluentes. Sendo assim, a utilização desses resíduos como matéria-prima na obtenção de combustíveis é uma alternativa que permite diversificar a matriz energética nacional, ao mesmo tempo em que parte dos recursos hídricos do país são preservados.

BECK, A. M. Resíduos suínos como alternativa energética sustentável. XXVII Encontro Nacional de Engenharia de Produção. Anais ENEGEP, Foz do Iguaçu, 2007 (adaptado).

O biocombustível a que se refere o texto é o`,
  },
];
