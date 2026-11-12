// Dia 2: Biologia. Ordem das questões de cada conteúdo: Fácil, Médio, Difícil, ENEM real.
window.DIA2 = (window.DIA2 || []).concat([
  {
    m: "Biologia", t: "Ecologia", n: 54,
    aula: [
      "Cadeia alimentar: produtor (planta, faz o próprio alimento) → consumidor (come outro ser) → decompositor (fungos e bactérias, devolvem os nutrientes ao solo).",
      "Quem come a planta é o consumidor primário (1º). Quem come esse bicho é o secundário (2º).",
      "A energia diminui a cada degrau da cadeia: só cerca de 10% passa para o próximo.",
      "Relações: competição (os dois disputam o mesmo recurso), predação (um come o outro), mutualismo (os dois ganham), parasitismo (um ganha, o outro perde).",
      "Espécie exótica é a trazida de fora. Sem inimigo natural, pode virar invasora e tomar o espaço das nativas.",
      "Veneno que o corpo não elimina se acumula ao longo da cadeia: quem está no topo fica com mais."
    ],
    q: [
      { e: "Na cadeia alimentar, o que é um produtor?",
        a: ["Um animal que come só plantas.", "Um animal que come outros animais.", "Um ser que fabrica o próprio alimento, como as plantas.", "Um ser que decompõe restos de seres mortos.", "Um ser que vive dentro de outro e o prejudica."], g: 2,
        r: "Produtor fabrica o próprio alimento pela fotossíntese: plantas e algas. Toda cadeia começa nele." },
      { e: "Abelhas visitam flores para colher néctar e, ao fazer isso, levam pólen de uma flor para outra, o que permite a reprodução da planta.\nA relação entre a abelha e a planta é de",
        a: ["canibalismo.", "competição.", "mutualismo.", "parasitismo.", "predação."], g: 2,
        r: "A abelha ganha alimento e a planta ganha a reprodução. Os dois ganham: mutualismo." },
      { e: "Um rio recebeu por anos o despejo de mercúrio de um garimpo. O mercúrio não é eliminado pelos seres vivos: fica guardado no corpo. Nesse rio, algas são comidas por peixes pequenos, que são comidos por peixes maiores, que são comidos por aves pescadoras.\nAo medir o mercúrio no corpo desses seres, espera-se encontrar a maior concentração",
        a: ["nas algas, que absorvem direto da água.", "nos peixes pequenos, que comem mais vezes.", "nos peixes maiores, que vivem mais no fundo.", "nas aves pescadoras, que estão no topo da cadeia.", "igual em todos, pois a água é a mesma."], g: 3,
        r: "Cada ser guarda o mercúrio de tudo o que comeu na vida. O peixe grande junta o de muitos peixes pequenos, e a ave junta o de muitos peixes grandes. O topo da cadeia fica com a maior concentração." },
      { o: "ENEM 2022 · questão 104",
        e: "A extinção de espécies é uma ameaça real que afeta diversas regiões do país. A introdução de espécies exóticas pode ser considerada um fator maximizador desse processo. A jaqueira (Artocarpus heterophyllus), por exemplo, é uma árvore originária da Índia e de regiões do Sudeste Asiático que foi introduzida ainda na era colonial e se aclimatou muito bem em praticamente todo o território nacional.\nCasos como o dessa árvore podem provocar a redução da biodiversidade, pois elas",
        a: ["ocupam áreas de vegetação nativa e substituem parcialmente a flora original.", "estimulam a competição por seus frutos entre animais típicos da região e eliminam as espécies perdedoras.", "alteram os nichos e aumentam o número de possibilidades de relações entre os seres vivos daquele ambiente.", "apresentam alta taxa de reprodução e se mantêm com um número de indivíduos superior à capacidade suporte do ambiente.", "diminuem a relação de competição entre os polinizadores e facilitam a ação de dispersores de sementes de espécies nativas."], g: 0,
        r: "A jaqueira se espalha pela mata e disputa espaço, luz e nutrientes com as plantas nativas. Parte da flora original some, e a biodiversidade (a variedade de espécies) cai. A alternativa D não se sustenta: uma população não fica muito tempo acima do que o ambiente aguenta." }
    ]
  },
  {
    m: "Biologia", t: "Fisiologia Humana e Saúde", n: 28,
    aula: [
      "Circulação: o coração bombeia o sangue. As hemácias (glóbulos vermelhos) levam oxigênio. Os glóbulos brancos defendem. As plaquetas fazem o sangue coagular, que é fechar o corte.",
      "Respiração: no pulmão, o sangue solta gás carbônico e pega oxigênio.",
      "Digestão: quebra o alimento em pedaços pequenos, que passam para o sangue no intestino delgado.",
      "Sistema nervoso: neurônios levam mensagens elétricas rápidas. Hormônios são mensagens químicas que vão pelo sangue, mais lentas. A insulina é o hormônio que baixa o açúcar do sangue.",
      "Rins filtram o sangue e fazem a urina."
    ],
    q: [
      { e: "Qual parte do sangue leva o oxigênio pelo corpo?",
        a: ["Os glóbulos brancos.", "As hemácias (glóbulos vermelhos).", "As plaquetas.", "Os anticorpos.", "Os hormônios."], g: 1,
        r: "As hemácias carregam o oxigênio do pulmão para o corpo todo. Glóbulos brancos defendem e plaquetas coagulam." },
      { e: "Depois de uma refeição com muito doce, a quantidade de açúcar (glicose) no sangue sobe. O pâncreas então libera um hormônio que faz as células retirarem glicose do sangue.\nEsse hormônio é a",
        a: ["adrenalina.", "hemoglobina.", "insulina.", "melatonina.", "testosterona."], g: 2,
        r: "A insulina faz a glicose entrar nas células, e o açúcar do sangue baixa. No diabetes, a insulina falta ou não funciona bem." },
      { e: "Uma pessoa com hemofilia tem um defeito hereditário: o corpo dela não produz uma das proteínas que participam da coagulação do sangue. As células do sangue são normais e estão em quantidade normal.\nEm um corte pequeno, que em outra pessoa pararia de sangrar em minutos, o hemofílico",
        a: ["fica sem oxigênio, porque as hemácias não funcionam.", "pega infecção na hora, porque não tem glóbulos brancos.", "forma coágulos demais, que entopem as veias.", "sangra por muito mais tempo, porque o coágulo demora a se formar.", "não sangra, porque o sangue é mais grosso."], g: 3,
        r: "Coagular é fechar o corte com um coágulo. Sem uma das proteínas da coagulação, o coágulo demora a se formar e o sangramento continua. Hemácias e glóbulos brancos estão normais, como diz o texto." },
      { o: "ENEM 2022 · questão 114",
        e: "O veneno da cascavel pode causar hemorragia com risco de morte a quem é picado pela serpente. No entanto, pesquisadores do Brasil e da Bélgica desenvolveram uma molécula de interesse farmacêutico, a PEG-collineína-1, a partir de uma proteína encontrada no veneno dessa cobra, capaz de modular a coagulação sanguínea. Embora a técnica não seja nova, foi a primeira vez que o método foi usado a partir de uma toxina animal na sua forma recombinante, ou seja, produzida em laboratório por um fungo geneticamente modificado.\nEsse novo medicamento apresenta potencial aplicação para",
        a: ["impedir a formação de trombos, típicos em alguns casos de acidente vascular cerebral.", "tratar consequências da anemia profunda, em razão da perda de grande volume de sangue.", "evitar a manifestação de urticárias, comumente relacionadas a processos alérgicos.", "reduzir o inchaço dos linfonodos, parte da resposta imunitária de diferentes infecções.", "regular a oscilação da pressão arterial, característica dos quadros de hipertensão."], g: 0,
        r: "O texto diz que a molécula modula (controla) a coagulação, e o veneno de onde ela vem causa hemorragia, ou seja, segura a coagulação. Trombo é um coágulo formado dentro do vaso, que entope a passagem do sangue e pode causar o acidente vascular cerebral (o derrame). Um remédio que segura a coagulação impede o trombo. As outras alternativas falam de anemia, alergia, defesa e pressão." }
    ]
  },
  {
    m: "Biologia", t: "Genética", n: 25,
    aula: [
      "Gene é um trecho do DNA com a receita de uma característica. Cada pessoa tem 2 cópias de cada gene: uma do pai, uma da mãe. As versões de um gene se chamam alelos.",
      "Alelo dominante (letra maiúscula, A) aparece mesmo com 1 cópia. Alelo recessivo (letra minúscula, a) só aparece com 2 cópias (aa).",
      "Aa é o portador: tem o alelo recessivo, mas não mostra.",
      "Cruzamento Aa × Aa: os filhos podem ser AA, Aa, Aa ou aa. Chance de aa: 1 em 4 (25%).",
      "Do gene à proteína: o DNA é copiado em RNA, e o RNA é lido para montar a proteína."
    ],
    q: [
      { e: "O que é um alelo recessivo?",
        a: ["Uma versão do gene que aparece com uma cópia só.", "Um gene que existe só nos homens.", "Um gene que veio de uma mutação recente.", "Uma versão do gene que só aparece com duas cópias.", "Uma versão do gene que nunca passa aos filhos."], g: 3,
        r: "O recessivo só aparece quando a pessoa tem as duas cópias dele (aa). Com uma cópia só (Aa), o dominante esconde." },
      { e: "Em ervilhas, a cor amarela da semente (A) domina sobre a verde (a). Cruzando duas plantas Aa, qual é a chance de nascer uma planta de semente verde?",
        a: ["0%", "25%", "50%", "75%", "100%"], g: 1,
        r: "Aa × Aa dá AA, Aa, Aa e aa. Só aa é verde: 1 em 4, ou 25%." },
      { e: "Um casal sem albinismo teve o primeiro filho albino. O albinismo (falta do pigmento melanina na pele) é causado por um alelo recessivo: só é albino quem tem duas cópias dele. O casal agora espera o segundo filho. Um filho não muda a chance do outro.\nA chance de essa segunda criança NÃO ser albina é de",
        a: ["0%", "25%", "50%", "75%", "100%"], g: 3,
        r: "O filho albino (aa) recebeu um a de cada um, então os dois pais são Aa. Aa × Aa dá AA, Aa, Aa e aa. Três em 4 não são albinos: 75%. Pegadinha: marcar 25%, que é a chance de ser albino." },
      { o: "ENEM 2021 · questão 91",
        e: "A deficiência de lipase ácida lisossômica é uma doença hereditária associada a um gene do cromossomo 10. Os pais dos pacientes podem não saber que são portadores dos genes da doença até o nascimento do primeiro filho afetado. Quando ambos os progenitores são portadores, existe uma chance, em quatro, de que seu bebê possa nascer com essa doença.\nEssa é uma doença hereditária de caráter",
        a: ["recessivo.", "dominante.", "codominante.", "poligênico.", "polialélico."], g: 0,
        r: "Duas pistas. Os pais têm o gene e não têm a doença: são portadores (Aa). E a chance é de 1 em 4, o resultado de Aa × Aa para aa. Só aparece com duas cópias: recessivo." }
    ]
  },
  {
    m: "Biologia", t: "Citologia", n: 20,
    aula: [
      "Célula é a menor parte viva. A membrana é a pele da célula: controla o que entra e sai. O núcleo guarda o DNA.",
      "Organelas: mitocôndria (tira energia do alimento e produz ATP, a moeda de energia da célula), ribossomo (monta proteínas), cloroplasto (faz fotossíntese, só em plantas e algas), lisossomo (faz a digestão dentro da célula).",
      "Respiração celular em 3 etapas: glicólise, ciclo de Krebs (também chamado ciclo do ácido cítrico) e fosforilação oxidativa. A última acontece na mitocôndria e produz quase todo o ATP.",
      "Osmose: a água atravessa a membrana indo do lado com menos coisa dissolvida para o lado com mais.",
      "Bactéria não tem núcleo (procarionte). Plantas, animais e fungos têm (eucariontes)."
    ],
    q: [
      { e: "Qual é a função da mitocôndria?",
        a: ["Guardar o DNA.", "Montar proteínas.", "Fazer fotossíntese.", "Controlar o que entra e sai da célula.", "Produzir energia (ATP) para a célula."], g: 4,
        r: "A mitocôndria tira a energia do alimento e produz ATP. O DNA fica no núcleo, o ribossomo monta proteínas e o cloroplasto faz fotossíntese." },
      { e: "Uma folha de alface murcha foi deixada em um pote com água pura e, depois de um tempo, ficou firme de novo.\nA água entrou nas células da folha porque",
        a: ["a membrana das células se rompeu.", "dentro das células há mais substâncias dissolvidas que na água pura.", "as células gastaram ATP para sugar a água.", "a água pura tem mais sal que as células.", "os cloroplastos puxaram a água para a fotossíntese."], g: 1,
        r: "Na osmose, a água vai do lado com menos coisa dissolvida (a água pura) para o lado com mais (dentro da célula). A célula enche e a folha fica firme. Não gasta ATP." },
      { e: "O cianeto é um veneno que age rápido. Ele trava uma proteína da mitocôndria, e a célula deixa de usar o oxigênio que recebe. O sangue da vítima continua cheio de oxigênio, mas as células param de funcionar em poucos minutos, primeiro as que mais gastam energia, como as do cérebro e as do coração.\nAs células param porque, sem a mitocôndria funcionando, falta",
        a: ["DNA para fazer novas células.", "água dentro da célula.", "ATP, a energia que a célula usa.", "glicose no sangue.", "membrana em volta da célula."], g: 2,
        r: "A mitocôndria usa o oxigênio para produzir ATP. Com ela travada, o ATP acaba, e as células que mais gastam energia param primeiro." },
      { o: "ENEM 2022 · questão 98",
        e: "Os ursos, por não apresentarem uma hibernação verdadeira, acordam por causa da presença de termogenina, uma proteína mitocondrial que impede a chegada dos prótons até a ATP sintetase, gerando calor. Esse calor é importante para aquecer o organismo, permitindo seu despertar.\nEm qual etapa do metabolismo energético celular a termogenina interfere?",
        a: ["Glicólise.", "Fermentação lática.", "Ciclo do ácido cítrico.", "Oxidação do piruvato.", "Fosforilação oxidativa."], g: 4,
        r: "A ATP sintetase é a peça que fabrica ATP na última etapa da respiração celular, usando a passagem de prótons. Essa etapa é a fosforilação oxidativa. Com a termogenina, os prótons não passam pela ATP sintetase, e a energia sai como calor." }
    ]
  },
  {
    m: "Biologia", t: "Evolução", n: 19,
    aula: [
      "Evolução é a mudança das populações ao longo das gerações.",
      "Seleção natural (Darwin): os indivíduos já nascem diferentes. Quem tem a característica que ajuda naquele ambiente sobrevive mais e deixa mais filhos. Com o tempo, ela fica comum.",
      "O ambiente não cria a característica: ele seleciona a que já existia. A bactéria não aprende a resistir ao antibiótico. As resistentes é que sobram.",
      "Lamarck (ideia superada): o uso faria o órgão crescer, e isso passaria aos filhos.",
      "Parasita e hospedeiro evoluem juntos (coevolução). Com muito tempo de convivência, o parasita tende a matar menos, porque hospedeiro morto não espalha parasita."
    ],
    q: [
      { e: "O que é seleção natural?",
        a: ["A mudança do corpo pelo uso, passada aos filhos.", "A sobrevivência e reprodução maior de quem tem características vantajosas no ambiente.", "A escolha, pelo ser humano, dos animais que vão se reproduzir.", "O surgimento de características porque o ambiente pede.", "A cópia do DNA sem nenhum erro."], g: 1,
        r: "Seleção natural: quem tem a característica que ajuda naquele ambiente sobrevive mais e deixa mais filhos. A alternativa A é a ideia de Lamarck. A C é seleção artificial." },
      { e: "Um hospital usou o mesmo antibiótico por anos. Com o tempo, ele deixou de fazer efeito contra certa bactéria.\nA explicação aceita pela biologia é que",
        a: ["as bactérias se acostumaram com o remédio aos poucos.", "o antibiótico provocou a mutação certa em cada bactéria.", "os pacientes ficaram resistentes ao antibiótico.", "bactérias que já eram resistentes sobreviveram e se multiplicaram.", "o antibiótico perdeu a validade dentro do hospital."], g: 3,
        r: "Algumas bactérias já eram resistentes antes do remédio. O antibiótico matou as outras, e as resistentes ficaram com o espaço e se multiplicaram. O remédio seleciona, não cria." },
      { e: "Em uma ilha vivem besouros de cor verde e de cor marrom, e a cor é hereditária. Os pássaros da ilha caçam os besouros que enxergam com mais facilidade. Depois de uma longa seca, a vegetação verde deu lugar a solo e galhos secos, de cor marrom, e assim ficou por muitas gerações de besouros.\nAo fim desse período, espera-se que a população de besouros",
        a: ["tenha mais verdes, porque eles se esforçaram para fugir.", "fique toda verde, porque a cor verde é dominante.", "tenha mais marrons, porque os verdes foram mais caçados.", "mude de cor a cada estação, conforme o solo.", "fique igual, porque a cor não muda a sobrevivência."], g: 2,
        r: "No fundo marrom, o besouro verde aparece mais e é mais caçado. Os marrons sobrevivem mais e deixam mais filhos marrons. Nenhum besouro mudou de cor: mudou a proporção na população." },
      { o: "ENEM 2021 · questão 100",
        e: "Entre 2014 e 2016, as regiões central e oeste da África sofreram uma grave epidemia de febre hemorrágica causada pelo vírus ebola, que se manifesta em até 21 dias após a infecção e cuja taxa de letalidade (enfermos que vão a óbito) pode chegar a 90%. Em regiões de clima tropical e subtropical, um outro vírus também pode causar febre hemorrágica: o vírus da dengue, que, embora tenha período de incubação menor (até 10 dias), apresenta taxa de letalidade abaixo de 1%.\nSegundo as informações do texto e aplicando princípios de evolução biológica às relações do tipo patógeno-hospedeiro, qual dos dois vírus infecta os humanos há mais tempo?",
        a: ["Ebola, pois o maior período de incubação reflete duração mais longa do processo de coevolução patógeno-hospedeiro.", "Dengue, pois o menor período de incubação reflete duração mais longa do processo de coevolução patógeno-hospedeiro.", "Ebola, cuja alta letalidade indica maior eficiência do vírus em parasitar seus hospedeiros, estabelecida ao longo de sua evolução.", "Ebola, cujos surtos epidêmicos concentram-se no continente africano, reconhecido como berço da origem evolutiva dos seres humanos.", "Dengue, cuja baixa letalidade indica maior eficiência do vírus em parasitar seus hospedeiros, estabelecida ao longo de sua longa coevolução patógeno-hospedeiro."], g: 4,
        r: "Patógeno é o causador da doença. Vírus que mata rápido perde o hospedeiro e se espalha menos. Com muito tempo de convivência, sobram as formas do vírus que matam menos e os hospedeiros que resistem mais. Letalidade baixa indica convivência longa: dengue. O tempo de incubação não mede isso, o que derruba a alternativa B." }
    ]
  },
  {
    m: "Biologia", t: "Microbiologia e Doenças", n: 17,
    aula: [
      "Vírus: não tem célula e só se multiplica dentro de uma. Antibiótico não funciona contra vírus (dengue, gripe, covid, aids).",
      "Bactéria: uma célula sem núcleo. Antibiótico funciona (tuberculose, cólera, leptospirose).",
      "Protozoário: uma célula com núcleo (malária, doença de Chagas, leishmaniose). Verme: um animal (esquistossomose, lombriga, filariose).",
      "Vetor é o animal que leva o causador de uma pessoa a outra. O mosquito Aedes leva o vírus da dengue. O mosquito não é o causador.",
      "A prevenção depende do caminho da doença. Mosquito: acabar com os criadouros. Água e esgoto: saneamento. A vacina treina a defesa antes da doença. Profilaxia é o nome dado à prevenção."
    ],
    q: [
      { e: "O que é o vetor de uma doença?",
        a: ["O micróbio que causa a doença.", "O remédio que cura a doença.", "O animal que transmite o causador da doença.", "A pessoa que já teve a doença.", "O primeiro sintoma da doença."], g: 2,
        r: "Vetor é quem transporta o causador, como o mosquito da dengue. O causador da dengue é um vírus." },
      { e: "Uma pessoa com gripe, que é causada por vírus, pede antibiótico na farmácia.\nO antibiótico não vai curar a gripe porque",
        a: ["o vírus da gripe é grande demais para o remédio.", "antibiótico só funciona junto com vacina.", "a gripe é causada por protozoário.", "o corpo destrói o antibiótico antes de ele agir.", "antibióticos atacam estruturas de bactérias, que os vírus não têm."], g: 4,
        r: "O antibiótico ataca partes da célula da bactéria. O vírus não tem célula, então o remédio não tem o que atacar." },
      { e: "Depois de uma enchente, um bairro sem rede de esgoto registrou muitos casos de leptospirose. A doença é causada por uma bactéria que sai na urina de ratos e entra no corpo pela pele, no contato com água ou lama contaminada. A prefeitura quer evitar novos surtos nas próximas chuvas.\nA medida que ataca a causa do problema é",
        a: ["distribuir repelente contra mosquitos.", "controlar os ratos e levar saneamento ao bairro.", "vacinar a população contra a gripe.", "orientar a população a cozinhar bem a carne.", "aplicar inseticida nas casas."], g: 1,
        r: "O caminho da doença é rato → urina → água da enchente → pele. Corta-se o caminho com menos ratos e com saneamento (esgoto, coleta de lixo, drenagem). Mosquito e carne não entram nessa doença." },
      { o: "ENEM 2022 · questão 123",
        e: "De acordo com a Organização Mundial da Saúde, a filariose e a leishmaniose são consideradas doenças tropicais infecciosas e constituem uma preocupação para a saúde pública por ser alto o índice de mortalidade a elas associado.\nUma medida profilática comum a essas duas doenças é o(a)",
        a: ["incineração do lixo orgânico.", "construção de rede de esgoto.", "uso de vermífugo pela população.", "controle das populações dos vetores.", "consumo de carnes vermelhas bem cozidas."], g: 3,
        r: "Medida profilática é medida de prevenção. As duas doenças são levadas por insetos que picam: a filariose por mosquito e a leishmaniose pelo mosquito-palha. Controlar os vetores serve para as duas. Rede de esgoto e vermífugo servem para verminoses de água e solo. Carne bem cozida evita a tênia." }
    ]
  }
]);
