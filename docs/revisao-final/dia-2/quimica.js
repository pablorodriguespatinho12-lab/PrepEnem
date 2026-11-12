// Dia 2: Química. Ordem das questões de cada conteúdo: Fácil, Médio, Difícil, ENEM real.
window.DIA2 = (window.DIA2 || []).concat([
  {
    m: "Química", t: "Química Orgânica", n: 51,
    aula: [
      "Palavra-chave: Ache o pedaço, do maior para o menor: COOH = ácido; COO sem H = éster; OH num carbono comum = álcool (no anel = fenol); N ligado só a C ou H = amina (N colado no C=O = amida); só C e H = hidrocarboneto.",
      "Química orgânica estuda os compostos de carbono. O carbono faz 4 ligações.",
      "Hidrocarboneto: só tem carbono (C) e hidrogênio (H). Exemplo: o metano do gás de cozinha.",
      "Função orgânica é a família da molécula. Você reconhece por um pedaço dela.",
      "Álcool: tem OH preso a um carbono que só faz ligações simples (etanol). OH preso ao anel benzênico é fenol. Ácido carboxílico: tem COOH (vinagre). Éster: tem COO no meio da cadeia (aromas de fruta, gorduras). Amina: tem nitrogênio (N).",
      "Ácido + álcool → éster + água (esterificação). Gordura + base forte, como a soda cáustica → sabão (saponificação).",
      "Cadeia saturada: só ligações simples entre os carbonos. O anel benzênico (C6H5 nas fórmulas) tem ligações duplas, então não é saturado."
    ],
    q: [
      { e: "Qual grupo identifica um álcool?",
        a: ["OH ligado a um carbono de ligações simples.", "COOH no fim da cadeia.", "COO no meio da cadeia.", "Um átomo de nitrogênio.", "Uma ligação dupla entre carbonos."], g: 0,
        r: "Álcool tem o grupo OH preso a um carbono de ligações simples. COOH é ácido carboxílico. COO no meio é éster. Nitrogênio é amina." },
      { e: "O vinagre tem ácido acético (CH3COOH) e a cachaça tem etanol (CH3CH2OH). Quando um ácido carboxílico reage com um álcool, forma-se água e um composto usado como aroma artificial.\nA função orgânica desse composto é",
        a: ["álcool.", "amina.", "éster.", "cetona.", "hidrocarboneto."], g: 2,
        r: "Ácido + álcool → éster + água. Essa reação se chama esterificação. Muitos aromas de fruta são ésteres." },
      { e: "O biodiesel é um combustível feito a partir de óleos vegetais, como o de soja. Os óleos são ésteres de cadeia longa. Na fábrica, o óleo reage com um álcool de cadeia curta (metanol ou etanol), na presença de uma base, e o resultado são ésteres menores, que são o biodiesel, e glicerina.\nSe, em vez do álcool, o óleo reagisse só com a base forte em água, o produto principal seria",
        a: ["açúcar.", "etanol.", "gasolina.", "plástico.", "sabão."], g: 4,
        r: "Óleo ou gordura + base forte em água → sabão. É a saponificação, a mesma reação de quem faz sabão em casa com óleo usado e soda cáustica." },
      { o: "ENEM 2021 · questão 98",
        e: "Com o objetivo de proporcionar aroma e sabor a diversos alimentos, a indústria alimentícia se utiliza de flavorizantes. Em geral, essas substâncias são ésteres, como as apresentadas no quadro.\n• Benzoato de metila: C6H5CO2CH3. Aroma: kiwi.\n• Acetato de isoamila: CH3CO2(CH2)2CH(CH3)2. Aroma: banana.\n• Acetato de benzila: CH3CO2CH2C6H5. Aroma: pêssego.\n• Propanoato de isobutila: CH3CH2CO2CH2CH(CH3)2. Aroma: rum.\n• Antranilato de metila: C6H4NH2CO2CH3. Aroma: uva.\nO aroma do flavorizante derivado do ácido etanoico e que apresenta cadeia carbônica saturada é de",
        a: ["kiwi.", "banana.", "pêssego.", "rum.", "uva."], g: 1,
        r: "Ácido etanoico é o nome oficial do ácido acético. Quem vem dele se chama acetato: sobram banana e pêssego. O de pêssego tem C6H5, o anel benzênico, que não é saturado. O de banana só tem ligações simples entre carbonos. Resposta: banana." }
    ]
  },
  {
    m: "Química", t: "Química Ambiental e Energia", n: 40,
    aula: [
      "Palavra-chave: CO2 esquenta, enxofre azeda: CO2 e metano = efeito estufa; enxofre e nitrogênio = chuva ácida.",
      "Efeito estufa: gases como o gás carbônico (CO2) e o metano (CH4) seguram o calor na Terra. Queimar petróleo e carvão joga CO2 extra no ar.",
      "Chuva ácida: gases de enxofre e de nitrogênio, vindos da queima de combustíveis, viram ácido na água da chuva.",
      "Biocombustíveis vêm de seres vivos: etanol (cana), biodiesel (óleos) e biogás (metano de lixo e esterco apodrecendo sem oxigênio).",
      "Camada de ozônio (O3): fica no alto da atmosfera e filtra os raios ultravioleta do Sol."
    ],
    q: [
      { e: "O que é o efeito estufa?",
        a: ["A destruição do ozônio por gases de geladeira.", "A retenção de calor na Terra por gases da atmosfera.", "A queda de chuva com ácido sobre as cidades.", "O acúmulo de lixo plástico nos oceanos.", "O aumento de nutrientes em rios e lagos."], g: 1,
        r: "Gases como CO2 e metano seguram parte do calor que a Terra devolveria ao espaço. O efeito natural mantém o planeta habitável. O problema é o excesso." },
      { e: "Usinas que queimam carvão com muito enxofre soltam dióxido de enxofre (SO2) no ar. Na atmosfera, esse gás reage com a água e volta ao solo.\nO problema ambiental ligado diretamente a essa emissão é",
        a: ["o buraco na camada de ozônio.", "a maré vermelha.", "a ilha de calor.", "a chuva ácida.", "a inversão térmica."], g: 3,
        r: "O SO2 reage com a água da atmosfera e forma ácido, que cai com a chuva. Ela corrói monumentos e deixa solos e lagos ácidos." },
      { e: "O etanol de cana e a gasolina soltam gás carbônico (CO2) quando queimam no motor. Mesmo assim, o etanol é considerado melhor para o clima. A gasolina vem do petróleo, que guarda carbono preso debaixo da terra há milhões de anos. A cana, enquanto cresce, faz fotossíntese.\nA vantagem do etanol para o clima é que o CO2 liberado na queima",
        a: ["é mais leve e escapa para o espaço.", "não é um gás de efeito estufa.", "foi retirado do ar pela cana durante o crescimento.", "vira oxigênio ao sair do escapamento.", "é absorvido pelo motor antes de sair."], g: 2,
        r: "Na fotossíntese, a cana tira CO2 do ar para crescer. A queima do etanol devolve esse mesmo CO2: o ciclo quase fecha. A gasolina põe no ar um carbono que estava guardado debaixo da terra." },
      { o: "ENEM 2021 · questão 109",
        e: "Com o aumento da população de suínos no Brasil, torna-se necessária a adoção de métodos para reduzir o potencial poluidor dos resíduos dessa agroindústria, uma vez que, comparativamente ao esgoto doméstico, os dejetos suínos são 200 vezes mais poluentes. Sendo assim, a utilização desses resíduos como matéria-prima na obtenção de combustíveis é uma alternativa que permite diversificar a matriz energética nacional, ao mesmo tempo em que parte dos recursos hídricos do país são preservados.\nO biocombustível a que se refere o texto é o",
        a: ["etanol.", "biogás.", "butano.", "metanol.", "biodiesel."], g: 1,
        r: "Dejetos (esterco) apodrecendo sem oxigênio soltam metano: é o biogás. Etanol vem da cana ou do milho. Biodiesel vem de óleos e gorduras. Butano vem do petróleo." }
    ]
  },
  {
    m: "Química", t: "Soluções, pH e Titulação", n: 30,
    aula: [
      "Palavra-chave: 7 é o meio: abaixo de 7 é ácido, acima é básico. Ácido + base = sal + água.",
      "Solução é uma mistura homogênea: soluto (o que é dissolvido, como o sal) + solvente (onde dissolve, como a água).",
      "Concentração é quanto soluto há em cada litro. Em g/L: massa ÷ volume. Em mol/L: quantidade em mol ÷ volume.",
      "Mol é um pacote de contar partículas, como a dúzia. Massa molar é quanto pesa 1 mol.",
      "pH mede a acidez, de 0 a 14. Abaixo de 7 é ácido (limão). 7 é neutro (água pura). Acima de 7 é básico (sabão).",
      "Ácido + base se neutralizam e formam sal e água. A titulação usa isso: gasta-se uma base de concentração conhecida até neutralizar o ácido. Pela quantidade gasta, descobre-se quanto ácido havia."
    ],
    q: [
      { e: "Uma solução tem pH 3. Ela é", a: ["ácida.", "básica.", "neutra.", "salgada.", "saturada."], g: 0,
        r: "pH abaixo de 7 é ácido. Quanto menor o número, mais ácido." },
      { e: "Dissolvem-se 20 g de sal em água até completar 500 mL de solução. Qual é a concentração dessa solução?",
        a: ["0,04 g/L", "4 g/L", "10 g/L", "40 g/L", "10 000 g/L"], g: 3,
        r: "Passe o volume para litros: 500 mL = 0,5 L. Concentração = massa ÷ volume = 20 ÷ 0,5 = 40 g/L." },
      { e: "Um agricultor mediu o pH do solo e encontrou 4,5, ácido demais para o milho, que produz melhor com pH perto de 6,5. Para corrigir, ele precisa espalhar no terreno uma substância que neutralize parte dessa acidez, prática conhecida como calagem.\nA substância adequada para isso é",
        a: ["o vinagre (ácido acético), que eleva o pH.", "o calcário (CaCO3), que reage com ácidos e eleva o pH.", "o sal de cozinha (NaCl), que é neutro e eleva o pH.", "o ácido sulfúrico (H2SO4), que consome a acidez.", "a água destilada, que reage com os ácidos."], g: 1,
        r: "Para subir o pH é preciso algo de caráter básico. O calcário reage com os ácidos do solo e os neutraliza. Vinagre e ácido sulfúrico deixariam o solo mais ácido. O sal e a água não neutralizam." },
      { o: "ENEM 2022 · questão 110",
        e: "O ácido tartárico é o principal ácido do vinho e está diretamente relacionado com sua qualidade. Na avaliação de um vinho branco em produção, uma analista neutralizou uma alíquota de 25,0 mL do vinho com NaOH a 0,10 mol L⁻¹, consumindo um volume igual a 8,0 mL dessa base. A reação para esse processo de titulação é representada pela equação química:\n[Equação da prova, desenhada com as fórmulas: 1 ácido tartárico + 2 NaOH → 1 sal + 2 H2O. Ácido tartárico: massa molar 150 g mol⁻¹.]\nA concentração de ácido tartárico no vinho analisado é mais próxima de:",
        a: ["1,8 g L⁻¹", "2,4 g L⁻¹", "3,6 g L⁻¹", "4,8 g L⁻¹", "9,6 g L⁻¹"], g: 1,
        r: "Alíquota é uma amostra. g L⁻¹ é o mesmo que g/L. NaOH gasto: 0,10 mol/L × 0,008 L = 0,0008 mol. Cada ácido gasta 2 NaOH, então havia a metade: 0,0004 mol de ácido. Em gramas: 0,0004 × 150 = 0,06 g, dentro de 25 mL (0,025 L). 0,06 ÷ 0,025 = 2,4 g/L. Pegadinha: esquecer o 2 da equação dá 4,8." }
    ]
  },
  {
    m: "Química", t: "Eletroquímica", n: 22,
    aula: [
      "Palavra-chave: PERDE OXIDA, GANHA REDUZ (elétrons). O zinco se sacrifica pelo ferro.",
      "Oxidar é perder elétrons. Reduzir é ganhar elétrons. As duas coisas acontecem juntas.",
      "Pilha: uma reação que acontece sozinha e gera corrente elétrica. Os elétrons saem do metal que oxida e vão pelo fio até quem reduz.",
      "Eletrólise é o contrário: gasta-se energia elétrica para forçar a reação. É assim que se produz alumínio.",
      "Ferrugem é o ferro oxidando com oxigênio e água. Duas proteções: cobrir o ferro (barreira, como a tinta) ou ligar a ele um metal que oxida mais fácil, como o zinco (metal de sacrifício)."
    ],
    q: [
      { e: "Em uma reação química, o que é oxidação?",
        a: ["O ganho de elétrons.", "A perda de elétrons.", "A perda de prótons.", "O ganho de nêutrons.", "A quebra do núcleo do átomo."], g: 1,
        r: "Oxidar é perder elétrons. Ganhar elétrons é reduzir." },
      { e: "Uma pilha comum faz uma lanterna acender. Dentro da pilha, o que produz a corrente elétrica?",
        a: ["O atrito entre as partes de metal.", "A energia da tomada guardada na fábrica.", "Uma reação química espontânea que transfere elétrons.", "O calor do ambiente em volta da pilha.", "A quebra de núcleos dos átomos de zinco."], g: 2,
        r: "Na pilha, um material oxida (perde elétrons) e outro reduz (ganha). Os elétrons passam pelo fio de um para o outro: essa passagem é a corrente." },
      { e: "Cascos de navio são de aço, feito de ferro, e ficam o tempo todo na água do mar, onde enferrujam rápido. Para proteger o casco, prendem-se nele blocos de zinco, que são trocados de tempos em tempos porque vão sendo consumidos. O zinco perde elétrons com mais facilidade que o ferro.\nOs blocos de zinco protegem o casco porque",
        a: ["formam uma camada de tinta que isola o casco.", "deixam a água do mar menos salgada.", "reduzem no lugar do ferro.", "oxidam no lugar do ferro.", "esfriam o casco e param a reação."], g: 3,
        r: "O zinco perde elétrons mais fácil, então é ele que oxida, e o ferro fica inteiro. Por isso o bloco é consumido e precisa ser trocado. O nome é metal de sacrifício." },
      { o: "ENEM 2022 · questão 127",
        e: "A nanotecnologia é responsável pelo aprimoramento de diversos materiais, incluindo os que são impactados com a presença de poluentes e da umidade na atmosfera, causadores de corrosão. O processo de corrosão é espontâneo e provoca a deterioração de metais como o ferro, que, em presença de oxigênio e água, sofre oxidação, conforme ilustra a equação química:\n4 Fe (s) + 2 H2O (l) + 3 O2 (g) → 2 Fe2O3 · H2O (s)\nUma forma de garantir a durabilidade da estrutura metálica e a sua resistência à umidade consiste na deposição de filmes finos nanocerâmicos à base de zircônia (ZrO2) e alumina (Al2O3) sobre a superfície do objeto que se deseja proteger.\nEssa nanotecnologia aplicada na proteção contra a corrosão se baseia no(a)",
        a: ["proteção catódica, que utiliza um metal fortemente redutor.", "uso de metais de sacrifício, que se oxidam no lugar do ferro.", "passivação do ferro, que fica revestido pelo seu próprio óxido.", "efeito de barreira, que impede o contato com o agente oxidante.", "galvanização, que usa outros metais de menor potencial de redução."], g: 3,
        r: "O filme de cerâmica cobre o metal. Sem contato com oxigênio e água, o ferro não oxida: é barreira, como a tinta. Não é metal de sacrifício: zircônia e alumina são óxidos, não metais que oxidam no lugar do ferro. Não é passivação: a camada não é o óxido do próprio ferro." }
    ]
  },
  {
    m: "Química", t: "Estequiometria", n: 18,
    aula: [
      "Palavra-chave: A equação é a receita: pegue a proporção da receita e faça regra de três.",
      "Estequiometria é a conta da receita química: quanto entra e quanto sai.",
      "A equação balanceada é a receita. Em 2 H2 + O2 → 2 H2O, cada 2 mol de H2 reagem com 1 mol de O2 e dão 2 mol de água.",
      "Massa molar transforma mol em gramas. H = 1, C = 12, O = 16. Água (H2O): 1 + 1 + 16 = 18 g por mol.",
      "Proporção em massa vale como regra de três: se 100 g dão 50 g, então 200 g dão 100 g.",
      "Rendimento de 80%: sai só 80% do que a conta prevê. Densidade = massa ÷ volume."
    ],
    q: [
      { e: "Qual é a massa de 1 mol de água (H2O)? Use H = 1 e O = 16.",
        a: ["3 g", "10 g", "17 g", "18 g", "34 g"], g: 3,
        r: "São 2 hidrogênios e 1 oxigênio: 1 + 1 + 16 = 18 g." },
      { e: "Na equação 2 H2 + O2 → 2 H2O, quantos mols de água se formam quando 4 mol de H2 reagem com oxigênio suficiente?",
        a: ["1", "2", "4", "6", "8"], g: 2,
        r: "A receita diz: 2 mol de H2 dão 2 mol de água, um para um. Então 4 mol de H2 dão 4 mol de água." },
      { e: "A cal viva (CaO), usada na construção, é feita aquecendo calcário (CaCO3) em fornos: CaCO3 → CaO + CO2. Pela massa molar, cada 100 g de calcário produzem 56 g de cal viva. Um forno recebeu 1 000 kg de calcário, mas a queima teve rendimento de 90%.\nQuantos quilos de cal viva foram produzidos?",
        a: ["396", "504", "560", "622", "900"], g: 1,
        r: "Se 100 g dão 56 g, então 1 000 kg dão 560 kg. Com rendimento de 90%: 560 × 0,90 = 504 kg. Parar em 560 é esquecer o rendimento." },
      { o: "ENEM 2021 · questão 113",
        e: "A obtenção de etanol utilizando a cana-de-açúcar envolve a fermentação dos monossacarídeos formadores da sacarose contida no melaço. Um desses formadores é a glicose (C6H12O6), cuja fermentação produz cerca de 50 g de etanol a partir de 100 g de glicose, conforme a equação química descrita:\nC6H12O6 → 2 CH3CH2OH + 2 CO2 (fermentação alcoólica)\nEm uma condição específica de fermentação, obtém-se 80% de conversão em etanol que, após sua purificação, apresenta densidade igual a 0,80 g/mL. O melaço utilizado apresentou 50 kg de monossacarídeos na forma de glicose.\nO volume de etanol, em litro, obtido nesse processo é mais próximo de",
        a: ["16.", "20.", "25.", "64.", "100."], g: 2,
        r: "Se 100 g de glicose dão 50 g de etanol, então 50 kg dão 25 kg. Com 80% de conversão: 25 × 0,80 = 20 kg = 20 000 g. Volume = massa ÷ densidade = 20 000 ÷ 0,80 = 25 000 mL = 25 L. Pegadinha: parar nos 20 kg e marcar 20. Esta questão também está na prova Revisão final do site." }
    ]
  }
]);
