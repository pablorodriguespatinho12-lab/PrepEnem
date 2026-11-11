// Dia 2: 5 cartões por conteúdo (f = frente, v = verso). Um fato por cartão, verso curto.
// A chave é o mesmo nome do conteúdo (campo t) nos arquivos de questões.
window.DIA2_CARTOES = {
  "Aritmética e Porcentagem": [
    { f: "Quanto é 25% em número decimal?", v: "0,25. Porcentagem é dividir por 100: 25 ÷ 100." },
    { f: "Aumento de 20%: por quanto multiplica?", v: "Por 1,20. Fica 100% + 20% = 120%. Ex.: R$ 50 × 1,2 = R$ 60." },
    { f: "Desconto de 20%: por quanto multiplica?", v: "Por 0,80. Sobra 100% − 20% = 80%. Ex.: R$ 50 × 0,8 = R$ 40." },
    { f: "Quanto é 15% de 80, de cabeça?", v: "12. Ache 10% (8) e 5% (4) e some." },
    { f: "Um valor caiu 75% e ficou em 100. Quanto era antes?", v: "400. Se caiu 75%, sobrou 25%, que é um quarto. 100 é um quarto de 400." }
  ],
  "Grandezas e Medidas": [
    { f: "Como saber se duas grandezas são diretas?", v: "Uma dobra e a outra dobra junto. Ex.: mais gasolina, mais quilômetros." },
    { f: "Como saber se duas grandezas são inversas?", v: "Uma dobra e a outra cai pela metade. Ex.: mais pedreiros, menos dias de obra." },
    { f: "1 m³ tem quantos litros?", v: "1 000 litros. É uma caixa de 1 m × 1 m × 1 m." },
    { f: "Escala 1 : 50. Quanto vale 1 cm do desenho?", v: "50 cm de verdade (meio metro). Medida real = medida do desenho × 50." },
    { f: "Dobrei o lado de um quadrado. E a área?", v: "Fica 4 vezes maior (2 × 2). Lado 2 cm: área 4 cm². Lado 4 cm: área 16 cm²." }
  ],
  "Estatística": [
    { f: "Como calcular a média?", v: "Some tudo e divida pela quantidade. Ex.: 4, 6 e 11 somam 21. 21 ÷ 3 = 7." },
    { f: "Como achar a mediana?", v: "Ponha em ordem e pegue o valor do meio. Ex.: 3, 5, 9 → 5." },
    { f: "Mediana com quantidade par de números?", v: "Faça a média dos dois do meio. Ex.: 3, 5, 9, 11 → (5 + 9) ÷ 2 = 7." },
    { f: "O que é moda?", v: "O valor que mais se repete." },
    { f: "Média ponderada: como calcular?", v: "Cada valor vezes o seu peso, some, e divida pela soma dos pesos. Ex.: 8 com peso 2 e 5 com peso 1: 21 ÷ 3 = 7." }
  ],
  "Funções": [
    { f: "Em f(x) = ax + b, o que é o b?", v: "O valor de partida, quando x = 0. No táxi, é a bandeirada." },
    { f: "Em f(x) = ax + b, o que é o a?", v: "Quanto o valor sobe a cada 1 de x. No táxi, é o preço por quilômetro." },
    { f: "Qual é o gráfico da função do 2º grau?", v: "Uma parábola, curva em forma de U." },
    { f: "Onde fica o ponto mais alto ou mais baixo da parábola?", v: "Em x = −b ÷ (2a). Esse ponto se chama vértice." },
    { f: "Parábola com a negativo tem máximo ou mínimo?", v: "Máximo. O U fica de cabeça para baixo e a ponta é o ponto mais alto." }
  ],
  "Geometria Plana": [
    { f: "Qual a diferença entre perímetro e área?", v: "Perímetro é a volta, a soma dos lados. Área é o tamanho da superfície, o chão que a figura cobre." },
    { f: "Área do triângulo", v: "base × altura ÷ 2." },
    { f: "Área do círculo", v: "π × raio × raio. O raio vai do centro até a borda. Ex.: raio 10 e π = 3: área 300." },
    { f: "Teorema de Pitágoras", v: "No triângulo com canto de 90°: cateto² + cateto² = hipotenusa². Ex.: 3² + 4² = 25, então a hipotenusa é 5." },
    { f: "1 hectare tem quantos m²?", v: "10 000 m². É um quadrado de 100 m × 100 m." }
  ],
  "Geometria Espacial": [
    { f: "Volume de uma caixa (paralelepípedo)", v: "comprimento × largura × altura." },
    { f: "Volume do cilindro", v: "Área da base × altura = π × raio² × altura." },
    { f: "Volume de cone e de pirâmide", v: "Área da base × altura ÷ 3. É um terço do cilindro ou do prisma de mesma base e altura." },
    { f: "1 litro tem quantos cm³?", v: "1 000 cm³. É uma caixa de 10 cm × 10 cm × 10 cm." },
    { f: "Dobrei todas as medidas de um sólido. E o volume?", v: "Fica 8 vezes maior (2 × 2 × 2)." }
  ],

  "Ecologia": [
    { f: "O que é um produtor na cadeia alimentar?", v: "O ser que fabrica o próprio alimento pela fotossíntese: plantas e algas." },
    { f: "O que fazem os decompositores?", v: "São fungos e bactérias que apodrecem os restos e devolvem os nutrientes ao solo." },
    { f: "Mutualismo e parasitismo: qual a diferença?", v: "Mutualismo: os dois ganham. Parasitismo: um ganha e o outro perde." },
    { f: "O que é eutrofização?", v: "Esgoto ou adubo põem nutrientes demais na água. As algas crescem e morrem, o apodrecimento gasta o oxigênio e os peixes morrem." },
    { f: "Veneno que o corpo não elimina: quem acumula mais na cadeia?", v: "Quem está no topo. Cada ser guarda o veneno de tudo o que comeu." }
  ],
  "Fisiologia Humana e Saúde": [
    { f: "O que as hemácias fazem?", v: "Levam o oxigênio pelo sangue. São os glóbulos vermelhos." },
    { f: "O que as plaquetas fazem?", v: "Fazem o sangue coagular, que é fechar o corte." },
    { f: "Onde os nutrientes passam para o sangue?", v: "No intestino delgado. O intestino grosso absorve principalmente água." },
    { f: "O que a insulina faz?", v: "Baixa o açúcar do sangue: faz a glicose entrar nas células. É um hormônio do pâncreas." },
    { f: "Qual é a função dos rins?", v: "Filtrar o sangue e fazer a urina." }
  ],
  "Genética": [
    { f: "O que é um alelo dominante?", v: "A versão do gene que aparece mesmo com uma cópia só. Escreve-se com letra maiúscula (A)." },
    { f: "O que é um alelo recessivo?", v: "A versão do gene que só aparece com duas cópias (aa)." },
    { f: "O que é um portador (Aa)?", v: "Quem tem o alelo recessivo mas não mostra a característica. Pode passar o alelo aos filhos." },
    { f: "Aa × Aa: qual a chance de um filho aa?", v: "1 em 4 (25%). Os filhos podem ser AA, Aa, Aa ou aa." },
    { f: "Qual é o caminho da informação genética?", v: "DNA → RNA → proteína. O DNA é copiado em RNA, e o RNA é lido para montar a proteína." }
  ],
  "Citologia": [
    { f: "Para que serve a mitocôndria?", v: "Tira a energia do alimento e produz ATP, a moeda de energia da célula." },
    { f: "O que o ribossomo faz?", v: "Monta proteínas." },
    { f: "O que é osmose?", v: "A água atravessa a membrana indo do lado com menos coisa dissolvida para o lado com mais." },
    { f: "Qual etapa da respiração celular produz quase todo o ATP?", v: "A fosforilação oxidativa, a última etapa. Acontece na mitocôndria." },
    { f: "Bactéria tem núcleo?", v: "Não. É procarionte. Plantas, animais e fungos têm núcleo: são eucariontes." }
  ],
  "Evolução": [
    { f: "Seleção natural em uma frase", v: "Os indivíduos já nascem diferentes. Quem tem a característica que ajuda no ambiente deixa mais filhos." },
    { f: "Por que bactérias ficam resistentes ao antibiótico?", v: "O antibiótico mata as sensíveis e sobram as que já eram resistentes. Ele seleciona, não cria a resistência." },
    { f: "Qual era a ideia de Lamarck?", v: "O uso faria o órgão crescer e isso passaria aos filhos. No ENEM, costuma ser a alternativa errada." },
    { f: "O ambiente cria a característica de que o ser precisa?", v: "Não. O ambiente só seleciona a que já existia." },
    { f: "Parasita que convive há muito tempo com o hospedeiro tende a matar mais ou menos?", v: "Menos. Hospedeiro morto não espalha parasita." }
  ],
  "Microbiologia e Doenças": [
    { f: "Antibiótico serve contra vírus?", v: "Não. Antibiótico mata bactéria. Contra vírus, a prevenção é a vacina." },
    { f: "O que é o vetor de uma doença?", v: "O animal que leva o causador de uma pessoa a outra. Ex.: o mosquito Aedes leva o vírus da dengue." },
    { f: "Dengue, zika e chikungunya: como prevenir?", v: "Acabar com a água parada, onde o mosquito Aedes aegypti se cria." },
    { f: "O que causa a malária e a doença de Chagas?", v: "Protozoários: seres de uma célula só, com núcleo." },
    { f: "Esquistossomose: como se pega?", v: "O verme entra pela pele em água doce com caramujo contaminado. Prevenção: saneamento." }
  ],

  "Química Orgânica": [
    { f: "Como reconhecer um álcool?", v: "Tem o grupo OH preso a um carbono que só faz ligações simples. Ex.: etanol. (OH preso ao anel benzênico é fenol.)" },
    { f: "Como reconhecer um ácido carboxílico?", v: "Tem o grupo COOH. Ex.: o ácido do vinagre." },
    { f: "Como reconhecer um éster?", v: "Tem COO no meio da cadeia. Muitos têm cheiro de fruta." },
    { f: "Ácido carboxílico + álcool forma o quê?", v: "Éster + água. A reação se chama esterificação." },
    { f: "Como se faz sabão?", v: "Gordura ou óleo + base forte (soda cáustica). A reação se chama saponificação." }
  ],
  "Química Ambiental e Energia": [
    { f: "O que é o efeito estufa?", v: "Gases da atmosfera seguram parte do calor da Terra. O excesso desses gases aquece o planeta." },
    { f: "Quais são os principais gases do efeito estufa?", v: "Gás carbônico (CO2), da queima de petróleo e carvão, e metano (CH4), do gado e do lixo." },
    { f: "O que causa a chuva ácida?", v: "Gases de enxofre e de nitrogênio, da queima de combustíveis, viram ácido na água da chuva." },
    { f: "O que é biogás?", v: "Metano produzido por lixo e esterco apodrecendo sem oxigênio." },
    { f: "Por que o etanol é melhor para o clima que a gasolina?", v: "O CO2 da queima é o que a cana tirou do ar ao crescer. A gasolina solta carbono que estava debaixo da terra." }
  ],
  "Soluções, pH e Titulação": [
    { f: "pH 3, pH 7 e pH 10: qual é ácido, neutro e básico?", v: "pH 3 é ácido, pH 7 é neutro, pH 10 é básico. Abaixo de 7, ácido. Acima de 7, básico." },
    { f: "Como calcular a concentração em g/L?", v: "Massa do soluto ÷ volume em litros. Ex.: 20 g em 0,5 L = 40 g/L." },
    { f: "O que é neutralização?", v: "Ácido + base formam sal e água." },
    { f: "Pus mais água numa solução. O que muda?", v: "A concentração cai. A quantidade de soluto continua a mesma." },
    { f: "Para que serve a titulação?", v: "Descobrir quanto ácido há numa amostra, medindo quanta base de concentração conhecida ela gasta para neutralizar." }
  ],
  "Eletroquímica": [
    { f: "O que é oxidar?", v: "Perder elétrons." },
    { f: "O que é reduzir?", v: "Ganhar elétrons." },
    { f: "O que acontece dentro de uma pilha?", v: "Uma reação espontânea: um material perde elétrons, outro ganha, e os elétrons passam pelo fio." },
    { f: "Qual a diferença entre pilha e eletrólise?", v: "A pilha gera energia elétrica com uma reação. A eletrólise gasta energia elétrica para forçar uma reação." },
    { f: "O que é metal de sacrifício?", v: "Um metal que oxida mais fácil que o ferro, como o zinco. Ligado ao ferro, ele se desgasta no lugar dele." }
  ],
  "Estequiometria": [
    { f: "O que é mol?", v: "Um pacote de contar partículas, como a dúzia. 1 mol tem 6 × 10²³ partículas." },
    { f: "Quanto pesa 1 mol de água (H2O)?", v: "18 g. H = 1 e O = 16: 1 + 1 + 16." },
    { f: "Primeiro passo de toda conta de estequiometria", v: "Balancear a equação: o mesmo número de cada átomo dos dois lados." },
    { f: "O que dizem os números da frente na equação?", v: "A proporção em mol. Em 2 H2 + O2 → 2 H2O: 2 de H2 para 1 de O2 para 2 de água." },
    { f: "Rendimento de 80%: o que fazer com o resultado?", v: "Multiplicar por 0,80. Sai só 80% do que a conta prevê." }
  ],

  "Eletricidade e Circuitos": [
    { f: "Lei de Ohm", v: "U = R × i. Tensão (em volts) = resistência (em ohms) × corrente (em ampères)." },
    { f: "Fórmula da potência elétrica", v: "P = U × i. Potência (em watts) = tensão × corrente." },
    { f: "Como calcular a energia gasta por um aparelho?", v: "Potência × tempo. Em kWh: quilowatts × horas. Ex.: 5 kW por 2 h = 10 kWh." },
    { f: "Resistores em série: como achar a resistência total?", v: "Somar todas." },
    { f: "Série e paralelo: qual a diferença?", v: "Série: um caminho só, um queima e apaga tudo. Paralelo: cada aparelho no seu caminho, como as tomadas de casa." }
  ],
  "Termodinâmica e Calor": [
    { f: "Qual a diferença entre calor e temperatura?", v: "Temperatura mede a agitação das partículas. Calor é a energia passando do mais quente para o mais frio." },
    { f: "Os 3 jeitos de o calor passar", v: "Condução (encostando), convecção (o ar ou o líquido se move) e radiação (sem encostar, como o Sol)." },
    { f: "Fórmula do calor para esquentar algo", v: "Q = m × c × ΔT. Massa × calor específico × quanto a temperatura mudou." },
    { f: "Por que o ar-condicionado fica no alto?", v: "O ar frio é mais denso e desce. O ar quente sobe e é resfriado. É a convecção." },
    { f: "Uma máquina térmica pode render 100%?", v: "Não. Parte da energia sempre sai como calor para o ambiente." }
  ],
  "Ondas e Acústica": [
    { f: "Equação da onda", v: "v = λ × f. Velocidade = comprimento de onda × frequência." },
    { f: "O que é frequência?", v: "Quantas vibrações por segundo. Mede-se em hertz (Hz)." },
    { f: "Som agudo e som grave: o que muda?", v: "A frequência. Agudo tem frequência alta. Grave, baixa." },
    { f: "Qual a velocidade do som no ar?", v: "Cerca de 340 m/s. Na água e nos sólidos é mais rápido." },
    { f: "O que é ressonância?", v: "Algo de fora vibra no ritmo próprio do objeto e a vibração cresce muito. Ex.: a taça que quebra com a voz." }
  ],
  "Óptica": [
    { f: "O que é reflexão?", v: "A luz bate numa superfície e volta. Ex.: espelho." },
    { f: "O que é refração?", v: "A luz passa de um meio para outro e muda de velocidade. Se entra inclinada, também desvia. Ex.: o canudo que parece quebrado no copo." },
    { f: "Que lente corrige a miopia?", v: "A divergente, que espalha a luz. Miopia é ver mal de longe." },
    { f: "Que lente corrige a hipermetropia?", v: "A convergente, que junta a luz, como a lupa. Hipermetropia é ver mal de perto." },
    { f: "O que é difração?", v: "A onda contorna um obstáculo ou uma abertura de tamanho parecido com o comprimento de onda." }
  ],
  "Dinâmica e Leis de Newton": [
    { f: "1ª lei de Newton (inércia)", v: "Sem força resultante, o corpo fica como está: parado, ou em linha reta com a mesma velocidade." },
    { f: "2ª lei de Newton", v: "F = m × a. Força resultante = massa × aceleração." },
    { f: "3ª lei de Newton", v: "Toda força tem um par. Você empurra a parede e ela empurra você com a mesma força." },
    { f: "Como calcular o peso?", v: "P = m × g. Massa × gravidade (cerca de 10 m/s² na Terra). Ex.: 50 kg pesam 500 N." },
    { f: "Por que o cinto de segurança funciona?", v: "Na freada, o corpo continua indo para a frente (inércia). O cinto aplica a força que o para." }
  ]
};
