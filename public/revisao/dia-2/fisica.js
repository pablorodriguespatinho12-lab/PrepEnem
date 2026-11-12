// Dia 2: Física. Ordem das questões de cada conteúdo: Fácil, Médio, Difícil, ENEM real.
window.DIA2 = (window.DIA2 || []).concat([
  {
    m: "Física", t: "Eletricidade e Circuitos", n: 37,
    aula: [
      "Palavra-chave: URI e PUI. U = R × i e P = U × i: o empurrão (U) vezes a corrente (i) dá a potência.",
      "Tensão (U, em volts, V) é o empurrão nas cargas. Corrente (i, em ampères, A) é quanta carga passa. Resistência (R, em ohms, Ω) é o que atrapalha a passagem.",
      "Lei de Ohm: U = R × i.",
      "Potência (P, em watts, W) é a energia gasta por segundo: P = U × i.",
      "Conta de luz: energia = potência × tempo. Em kWh: quilowatts × horas. 1 kW = 1 000 W.",
      "Em série (um depois do outro), as resistências somam."
    ],
    q: [
      { e: "O que a resistência elétrica faz em um circuito?",
        a: ["Empurra as cargas pelo fio.", "Guarda energia para usar depois.", "Mede a energia gasta no mês.", "Dificulta a passagem da corrente.", "Transforma corrente em tensão."], g: 3,
        r: "Resistência é o que atrapalha a passagem da corrente. Quem empurra as cargas é a tensão." },
      { e: "Um chuveiro ligado em 220 V é percorrido por uma corrente de 20 A. Qual é a potência desse chuveiro?",
        a: ["11 W", "240 W", "2 200 W", "4 400 W", "8 800 W"], g: 3,
        r: "P = U × i = 220 × 20 = 4 400 W." },
      { e: "Uma família quer saber quanto o chuveiro pesa na conta de luz. O chuveiro tem potência de 5 000 W e fica ligado, somando todos os banhos, 1 hora por dia. A distribuidora cobra R$ 0,80 por kWh.\nQuanto o chuveiro custa em um mês de 30 dias?",
        a: ["R$ 4,00", "R$ 40,00", "R$ 120,00", "R$ 150,00", "R$ 400,00"], g: 2,
        r: "5 000 W = 5 kW. Por dia: 5 kW × 1 h = 5 kWh. No mês: 5 × 30 = 150 kWh. Custo: 150 × 0,80 = 120 reais. O 150 é a energia, não o preço." },
      { o: "ENEM 2022 · questão 133",
        e: "Uma lanterna funciona com três pilhas de resistência interna igual a 0,5 Ω cada, ligadas em série. Quando posicionadas corretamente, devem acender a lâmpada incandescente de especificações 4,5 W e 4,5 V. Cada pilha na posição correta gera uma f.e.m. (força eletromotriz) de 1,5 V. Uma pessoa, ao trocar as pilhas da lanterna, comete o equívoco de inverter a posição de uma das pilhas. Considere que as pilhas mantêm contato independentemente da posição.\nCom esse equívoco, qual é a intensidade de corrente que passa pela lâmpada ao se ligar a lanterna?",
        a: ["0,25 A", "0,33 A", "0,75 A", "1,00 A", "1,33 A"], g: 0,
        r: "Força eletromotriz (f.e.m.) é a tensão que a pilha gera. Lâmpada: P = U × i, então 4,5 = 4,5 × i e i = 1 A. Resistência dela: R = U ÷ i = 4,5 Ω. A pilha invertida empurra para o outro lado: 1,5 + 1,5 − 1,5 = 1,5 V. Resistência total em série: 4,5 + 0,5 + 0,5 + 0,5 = 6 Ω. Corrente: 1,5 ÷ 6 = 0,25 A." }
    ]
  },
  {
    m: "Física", t: "Termodinâmica e Calor", n: 36,
    aula: [
      "Palavra-chave: QUE MACETE: Q = m × c × ΔT quando a temperatura muda. Mudando de estado (gelo derretendo), a temperatura fica parada e Q = m × L.",
      "Temperatura mede a agitação das partículas. Calor é energia passando do mais quente para o mais frio.",
      "O calor anda de 3 jeitos: condução (encostando, como no cabo da panela), convecção (o líquido ou o ar quente sobe e o frio desce) e radiação (sem encostar, como o calor do Sol).",
      "Para esquentar algo: Q = m × c × ΔT. É massa × calor específico × quanto a temperatura mudou. O calor específico (c) diz quanto o material custa para esquentar.",
      "Metal conduz bem o calor (condutor). Ar, isopor e lã conduzem mal (isolantes)."
    ],
    q: [
      { e: "O cabo de metal de uma panela no fogo esquenta mesmo longe da chama. Por qual processo o calor chega até ele?",
        a: ["Condução.", "Convecção.", "Radiação.", "Dilatação.", "Evaporação."], g: 0,
        r: "O calor passa de partícula em partícula pelo metal, encostando: é condução. Convecção precisa de líquido ou gás se movendo." },
      { e: "Quanta energia é necessária para aquecer 200 g de água de 20 °C até 70 °C? O calor específico da água é 1 cal/(g·°C).",
        a: ["1 000 cal", "4 000 cal", "10 000 cal", "14 000 cal", "18 000 cal"], g: 2,
        r: "A temperatura mudou 70 − 20 = 50 °C. Q = m × c × ΔT = 200 × 1 × 50 = 10 000 cal. Usar 70 no lugar de 50 dá 14 000." },
      { e: "Em uma casa, o aparelho de ar-condicionado costuma ser instalado no alto da parede, e o aquecedor fica perto do chão. A escolha tem a ver com o jeito como o ar se movimenta quando muda de temperatura.\nO ar-condicionado fica no alto porque o ar frio",
        a: ["é menos denso e sobe, ficando preso no teto.", "conduz calor melhor que o ar quente.", "é mais denso e desce, empurrando o ar quente para cima.", "emite mais radiação que o ar quente.", "ocupa mais espaço que o ar quente."], g: 2,
        r: "Ar frio é mais denso (mais pesado para o mesmo espaço) e desce. O ar quente sobe, é resfriado pelo aparelho e desce de novo. Esse vai e vem é a convecção, e ele resfria a sala inteira." },
      { o: "ENEM 2021 · questão 126",
        e: "Na montagem de uma cozinha para um restaurante, a escolha do material correto para as panelas é importante, pois a panela que conduz mais calor é capaz de cozinhar os alimentos mais rapidamente e, com isso, há economia de gás. A taxa de condução do calor depende da condutividade k do material, de sua área A, da diferença de temperatura ΔT e da espessura d do material, sendo dada pela relação ΔQ/Δt = kA(ΔT/d). Em panelas com dois materiais, a taxa de condução é dada por ΔQ/Δt = AΔT/(d1/k1 + d2/k2), em que d1 e d2 são as espessuras dos dois materiais, e k1 e k2 são as condutividades de cada material. Os materiais mais comuns no mercado para panelas são o alumínio (k = 20 W/m·K), o ferro (k = 8 W/m·K) e o aço (k = 5 W/m·K) combinado com o cobre (k = 40 W/m·K).\nCompara-se uma panela de ferro, uma de alumínio e uma composta de 1/2 da espessura em cobre e 1/2 da espessura em aço, todas com a mesma espessura total e com a mesma área de fundo.\nA ordem crescente de mais econômica para a menos econômica é",
        a: ["cobre-aço, alumínio e ferro.", "alumínio, cobre-aço e ferro.", "cobre-aço, ferro e alumínio.", "alumínio, ferro e cobre-aço.", "ferro, alumínio e cobre-aço."], g: 1,
        r: "Área, ΔT e espessura são iguais nas três, então basta comparar um número de cada. Alumínio: 20. Ferro: 8. Cobre-aço, pela 2ª fórmula com metade da espessura em cada: 1 ÷ (0,5 ÷ 40 + 0,5 ÷ 5) = 1 ÷ 0,1125 ≈ 8,9. Conduz mais, economiza mais: alumínio (20), cobre-aço (8,9), ferro (8). Pegadinha: o cobre é ótimo, mas o aço segura o calor." }
    ]
  },
  {
    m: "Física", t: "Ondas e Acústica", n: 31,
    aula: [
      "Palavra-chave: VÊ LÁ FORA: v = λ × f. Som agudo = frequência alta.",
      "Onda leva energia sem levar matéria. O som é uma onda no ar, na água ou no metal.",
      "Frequência (f, em hertz, Hz): quantas vibrações por segundo. Som agudo tem frequência alta. Som grave, baixa.",
      "Comprimento de onda (λ, a letra lambda): o tamanho de uma onda inteira.",
      "Velocidade da onda: v = λ × f. E, como toda velocidade, v = distância ÷ tempo.",
      "O som anda a cerca de 340 m/s no ar. Na água e nos sólidos é mais rápido."
    ],
    q: [
      { e: "O que é a frequência de uma onda?",
        a: ["O tamanho de uma onda inteira.", "O número de vibrações por segundo.", "A altura máxima da onda.", "A distância que a onda anda por segundo.", "O tempo que a onda leva para sumir."], g: 1,
        r: "Frequência é quantas vibrações acontecem em 1 segundo. O tamanho de uma onda inteira é o comprimento de onda." },
      { e: "Uma onda sonora no ar tem velocidade de 340 m/s e frequência de 170 Hz. Qual é o comprimento dessa onda?",
        a: ["0,5 m", "2 m", "170 m", "510 m", "57 800 m"], g: 1,
        r: "v = λ × f, então λ = v ÷ f = 340 ÷ 170 = 2 m." },
      { e: "Durante uma tempestade, uma pessoa vê o clarão de um raio e começa a contar. O trovão chega 5 segundos depois. A luz chega praticamente na hora, e o som viaja pelo ar a 340 m/s.\nA que distância da pessoa o raio caiu, aproximadamente?",
        a: ["68 m", "340 m", "1 700 m", "3 400 m", "17 000 m"], g: 2,
        r: "Distância = velocidade × tempo = 340 × 5 = 1 700 m." },
      { o: "ENEM 2022 · questão 95",
        e: "O sinal sonoro oriundo da queda de um grande bloco de gelo de uma geleira é detectado por dois dispositivos situados em um barco, sendo que o detector A está imerso em água e o B, na proa da embarcação. Sabe-se que a velocidade do som na água é de 1 540 m/s e no ar é de 340 m/s.\n[Figura da prova: o barco está a uma distância L da geleira. O detector A fica dentro da água e o B fica no ar.]\nOs gráficos indicam, em tempo real, o sinal sonoro detectado pelos dois dispositivos, os quais foram ligados simultaneamente em um instante anterior à queda do bloco de gelo. Ao comparar pontos correspondentes desse sinal em cada dispositivo, é possível obter informações sobre a onda sonora.\n[Gráficos da prova: no detector A, o sinal aparece perto de 220 s. No detector B, o mesmo sinal aparece perto de 232 s.]\nA distância L, em metro, entre o barco e a geleira é mais próxima de",
        a: ["339 000.", "78 900.", "14 400.", "5 240.", "100."], g: 3,
        r: "O som sai junto pelos dois caminhos e chega antes pela água. Diferença nos gráficos: 232 − 220 = 12 s. Tempo = distância ÷ velocidade, então L ÷ 340 − L ÷ 1 540 = 12. Teste a alternativa 5 240: pelo ar, 5 240 ÷ 340 ≈ 15,4 s. Pela água, 5 240 ÷ 1 540 ≈ 3,4 s. Diferença: 12 s. Fecha." }
    ]
  },
  {
    m: "Física", t: "Óptica", n: 20,
    aula: [
      "Palavra-chave: BATE, PASSA, CONTORNA: reflexão bate e volta; refração passa e muda de velocidade (desvia se entrar inclinada); difração contorna.",
      "Reflexão: a luz bate e volta (espelho).",
      "Refração: a luz passa de um meio para outro (do ar para a água) e muda de velocidade. Se entra inclinada, também desvia. É o que faz o canudo parecer quebrado no copo.",
      "Lentes funcionam por refração. A que junta a luz (convergente) é a da lupa. A que espalha (divergente) corrige a miopia.",
      "Difração: a onda contorna um obstáculo ou uma abertura de tamanho parecido com o comprimento de onda.",
      "Absorção: a luz vira calor (roupa preta esquenta mais)."
    ],
    q: [
      { e: "O que é a refração da luz?",
        a: ["A volta da luz ao bater em uma superfície.", "A transformação da luz em calor.", "A separação da luz em duas cópias iguais.", "A mudança de velocidade da luz ao passar de um meio para outro, que pode desviá-la.", "O contorno da luz em volta de um obstáculo."], g: 3,
        r: "Refração é a mudança de velocidade da luz quando ela troca de meio. Entrando inclinada, ela desvia. Bater e voltar é reflexão. Virar calor é absorção. Contornar é difração." },
      { e: "Uma colher dentro de um copo com água parece quebrada na altura da superfície da água. Isso acontece porque a luz",
        a: ["muda de velocidade ao sair da água para o ar e desvia.", "é absorvida pela água e perde brilho.", "bate na superfície da água e volta toda para dentro.", "contorna a colher, que é um obstáculo pequeno.", "passa a vibrar em uma única direção."], g: 0,
        r: "A luz que vem da parte da colher dentro da água desvia ao sair para o ar (refração). O olho enxerga essa parte fora do lugar." },
      { e: "Uma pessoa com miopia enxerga bem de perto, mas vê embaçado o que está longe. No olho dela, a imagem dos objetos distantes se forma antes da retina (o fundo do olho, onde a imagem deveria cair). Os óculos corrigem isso com uma lente que desvia a luz antes de ela entrar no olho.\nA lente usada e o fenômeno em que ela se baseia são",
        a: ["convergente, reflexão.", "convergente, refração.", "divergente, reflexão.", "divergente, refração.", "plana, absorção."], g: 3,
        r: "A imagem cai antes da retina porque a luz se junta cedo demais. A lente divergente espalha um pouco a luz e empurra a imagem para trás, até a retina. Toda lente funciona por refração." },
      { o: "ENEM 2022 · questão 96",
        e: "Em 2002, um mecânico da cidade mineira de Uberaba (MG) teve uma ideia para economizar o consumo de energia elétrica e iluminar a própria casa num dia de sol. Para isso, ele utilizou garrafas plásticas PET com água e cloro, conforme ilustram as figuras.\nCada garrafa foi fixada ao telhado de sua casa em um buraco com diâmetro igual ao da garrafa, muito maior que o comprimento de onda da luz. Nos últimos dois anos, sua ideia já alcançou diversas partes do mundo e deve atingir a marca de 1 milhão de casas utilizando a “luz engarrafada”.\n[Fotos da prova: uma garrafa com água presa no telhado, brilhando, e um galpão iluminado por várias delas.]\nQue fenômeno óptico explica o funcionamento da “luz engarrafada”?",
        a: ["Difração.", "Absorção.", "Polarização.", "Reflexão.", "Refração."], g: 4,
        r: "A luz do Sol entra pela parte de cima da garrafa, passa do ar para a água e da água para o ar. A cada troca de meio ela desvia (refração) e se espalha pelo cômodo. Não é difração: o texto avisa que o buraco é muito maior que o comprimento de onda da luz. Esta questão também está na prova Revisão final do site." }
    ]
  },
  {
    m: "Física", t: "Dinâmica e Leis de Newton", n: 17,
    aula: [
      "Palavra-chave: FAMA: F = m × a. Toda força tem um par.",
      "Força é empurrão ou puxão, medida em newtons (N).",
      "1ª lei (inércia): sem força resultante, o corpo continua como está, parado ou em linha reta com a mesma velocidade. Força resultante é a soma de todas as forças.",
      "2ª lei: força resultante = massa × aceleração (F = m × a).",
      "3ª lei: toda força tem um par. Se você empurra a parede, a parede empurra você com a mesma força.",
      "Peso é a força da gravidade: P = m × g. Na Terra, g vale cerca de 10 m/s²."
    ],
    q: [
      { e: "O que diz a lei da inércia (1ª lei de Newton)?",
        a: ["Toda força aplicada tem uma reação igual e contrária.", "A força é igual à massa vezes a aceleração.", "Sem força resultante, o corpo mantém o estado em que está.", "Corpos mais pesados sempre caem mais rápido.", "Todo corpo em movimento acaba parando sozinho."], g: 2,
        r: "Inércia: sem força resultante, quem está parado fica parado e quem está em movimento segue reto com a mesma velocidade. As coisas param no dia a dia por causa do atrito, que é uma força." },
      { e: "Um carrinho de 20 kg é empurrado sobre um piso liso por uma força resultante de 60 N. Qual é a aceleração do carrinho?",
        a: ["0,3 m/s²", "3 m/s²", "40 m/s²", "80 m/s²", "1 200 m/s²"], g: 1,
        r: "F = m × a, então a = F ÷ m = 60 ÷ 20 = 3 m/s²." },
      { e: "Um elevador de 500 kg, já contando os passageiros, começa a subir puxado por um cabo de aço. Na arrancada, ele acelera para cima a 2 m/s². Considere g = 10 m/s².\nDurante a arrancada, a força que o cabo faz sobre o elevador é de",
        a: ["1 000 N", "4 000 N", "5 000 N", "6 000 N", "10 000 N"], g: 3,
        r: "Peso: 500 × 10 = 5 000 N, para baixo. Para acelerar para cima, sobra uma força resultante de m × a = 500 × 2 = 1 000 N para cima. O cabo precisa segurar o peso e ainda dar essa sobra: 5 000 + 1 000 = 6 000 N." },
      { o: "ENEM 2022 · questão 126",
        e: "Um pai faz um balanço utilizando dois segmentos paralelos e iguais da mesma corda para fixar uma tábua a uma barra horizontal. Por segurança, opta por um tipo de corda cuja tensão de ruptura seja 25% superior à tensão máxima calculada nas seguintes condições:\n• O ângulo máximo atingido pelo balanço em relação à vertical é igual a 90°;\n• Os filhos utilizarão o balanço até que tenham uma massa de 24 kg.\nAlém disso, ele aproxima o movimento do balanço para o movimento circular uniforme, considera que a aceleração da gravidade é igual a 10 m/s² e despreza forças dissipativas.\nQual é a tensão de ruptura da corda escolhida?",
        a: ["120 N", "300 N", "360 N", "450 N", "900 N"], g: 3,
        r: "A corda sofre mais no ponto mais baixo: segura o peso e ainda puxa a criança para fazer a curva. Peso: 24 × 10 = 240 N. Solto de 90°, o balanço desce uma altura igual ao comprimento da corda, e a conta de energia dá uma força de curva igual a 2 vezes o peso: 480 N. Total: 240 + 480 = 720 N. São 2 cordas: 360 N em cada. Com 25% a mais: 360 × 1,25 = 450 N. Esta é uma das difíceis da prova: se travar nela, siga em frente." }
    ]
  }
]);
