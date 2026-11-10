// Dia 2: Matemática. Ordem das questões de cada conteúdo: Fácil, Médio, Difícil, ENEM real.
// n = questões do tema nas 15 provas de 2009 a 2023 (data/revisao-final/o-que-mais-cai.json).
window.DIA2 = (window.DIA2 || []).concat([
  {
    m: "Matemática", t: "Aritmética e Porcentagem", n: 128,
    aula: [
      "Porcentagem é uma fração de 100. 25% = 25 ÷ 100 = 0,25.",
      "Achar 25% de 80: 0,25 × 80 = 20.",
      "Aumentar 10%: multiplique por 1,10. Descontar 10%: multiplique por 0,90.",
      "Pegadinha: se caiu 75%, sobrou 25%. A conta usa o que sobrou."
    ],
    q: [
      { e: "Quanto é 20% de 150?", a: ["3", "15", "30", "75", "300"], g: 2,
        r: "20% = 0,20. Então 0,20 × 150 = 30." },
      { e: "Uma camiseta custa R$ 80,00 e está com 15% de desconto. Qual é o preço com o desconto?",
        a: ["R$ 65,00", "R$ 68,00", "R$ 70,00", "R$ 72,00", "R$ 92,00"], g: 1,
        r: "Desconto de 15% deixa 85% do preço. 0,85 × 80 = 68." },
      { e: "Uma loja aumentou o preço de um fogão em 20%. Como as vendas caíram, o dono deu 20% de desconto sobre o preço novo. Antes do aumento, o fogão custava R$ 1 000,00.\nEm relação ao preço inicial, o preço final ficou",
        a: ["igual.", "2% maior.", "4% maior.", "4% menor.", "20% menor."], g: 3,
        r: "1 000 × 1,20 = 1 200. Depois, 1 200 × 0,80 = 960. Faltam 40 reais em 1 000: 4% menor. O desconto foi calculado sobre um número maior, por isso não empata." },
      { o: "ENEM 2022 · questão 149",
        e: "Em janeiro de 2013, foram declaradas 1 794 272 admissões e 1 765 372 desligamentos no Brasil, ou seja, foram criadas 28 900 vagas de emprego, segundo dados do Cadastro Geral de Empregados e Desempregados (Caged), divulgados pelo Ministério do Trabalho e Emprego (MTE). Segundo o Caged, o número de vagas criadas em janeiro de 2013 sofreu uma queda de 75%, quando comparado com o mesmo período de 2012.\nDe acordo com as informações dadas, o número de vagas criadas em janeiro de 2012 foi",
        a: ["16 514.", "86 700.", "115 600.", "441 343.", "448 568."], g: 2,
        r: "Queda de 75% quer dizer que sobraram 25%. Então 28 900 é 25% do número de 2012. 28 900 ÷ 0,25 = 115 600. Jeito rápido: 25% é um quarto, então multiplique por 4." }
    ]
  },
  {
    m: "Matemática", t: "Grandezas e Medidas", n: 81,
    aula: [
      "Grandezas diretas: uma dobra, a outra dobra (mais gasolina, mais quilômetros).",
      "Grandezas inversas: uma dobra, a outra cai pela metade (mais pedreiros, menos dias).",
      "Regra de três: escreva as duas grandezas lado a lado e multiplique cruzado. Na inversa, o produto das duas fica igual.",
      "Unidades: 1 km = 1 000 m. 1 m = 100 cm. 1 h = 60 min. 1 L = 1 000 mL.",
      "Escala 1 : 50 quer dizer: 1 cm no desenho vale 50 cm de verdade."
    ],
    q: [
      { e: "Quantos metros há em 2,5 km?", a: ["25", "250", "2 500", "25 000", "250 000"], g: 2,
        r: "1 km = 1 000 m. Então 2,5 × 1 000 = 2 500 m." },
      { e: "Um carro percorre 12 km com 1 litro de gasolina. Quantos litros ele gasta para percorrer 180 km?",
        a: ["12", "15", "18", "20", "2 160"], g: 1,
        r: "Mais quilômetros, mais litros: é direta. 180 ÷ 12 = 15 litros." },
      { e: "Em uma obra, 6 pedreiros levantam um muro em 10 dias, todos no mesmo ritmo. O dono quer o muro pronto antes e contrata mais pedreiros, ficando com 15 no total.\nMantido o ritmo de cada um, em quantos dias o muro fica pronto?",
        a: ["3", "4", "5", "9", "25"], g: 1,
        r: "Mais pedreiros, menos dias: é inversa. O trabalho todo vale 6 × 10 = 60 dias de um pedreiro. 60 ÷ 15 = 4 dias. A regra de três direta daria 25 dias, mais tempo com mais gente: sinal de erro." },
      { o: "ENEM 2022 · questão 138",
        e: "Definem-se o dia e o ano de um planeta de um sistema solar como sendo, respectivamente, o tempo que o planeta leva para dar 1 volta completa em torno de seu próprio eixo de rotação e o tempo para dar 1 volta completa em torno de seu Sol.\nSuponha que exista um planeta Z, em algum sistema solar, onde um dia corresponda a 73 dias terrestres e que 2 de seus anos correspondam a 1 ano terrestre. Considere que 1 ano terrestre tem 365 de seus dias.\nNo planeta Z, seu ano corresponderia a quantos de seus dias?",
        a: ["2,5", "10,0", "730,0", "13 322,5", "53 290,0"], g: 0,
        r: "2 anos de Z = 365 dias terrestres, então 1 ano de Z = 182,5 dias terrestres. Um dia de Z dura 73 dias terrestres. 182,5 ÷ 73 = 2,5 dias de Z." }
    ]
  },
  {
    m: "Matemática", t: "Estatística", n: 75,
    aula: [
      "Média: some tudo e divida pela quantidade.",
      "Mediana: ponha em ordem e pegue o valor do meio. Se a quantidade for par, faça a média dos dois do meio.",
      "Moda: o valor que mais aparece.",
      "Média ponderada: multiplique cada valor pelo seu peso, some, e divida pela soma dos pesos."
    ],
    q: [
      { e: "Qual é a média de 4, 6 e 11?", a: ["6", "7", "8", "10,5", "21"], g: 1,
        r: "Soma: 4 + 6 + 11 = 21. São 3 números: 21 ÷ 3 = 7." },
      { e: "As idades de cinco jogadores de um time são 18, 20, 20, 23 e 34 anos. Qual é a mediana dessas idades?",
        a: ["16", "20", "21", "23", "34"], g: 1,
        r: "Já estão em ordem. O valor do meio (o 3º de 5) é 20. A média daria 23, puxada pelo 34. Por isso a mediana é usada quando há um valor muito diferente dos outros." },
      { e: "Em uma disciplina, a nota final é a média ponderada de duas provas: a primeira tem peso 2 e a segunda tem peso 3. Um aluno tirou 5,0 na primeira prova. Para ser aprovado, ele precisa de nota final de pelo menos 6,5.\nQual é a menor nota que ele precisa tirar na segunda prova?",
        a: ["6,5", "7,0", "7,5", "8,0", "8,5"], g: 2,
        r: "A soma dos pesos é 5. Para a média dar 6,5, o total precisa ser 6,5 × 5 = 32,5. A primeira prova já deu 2 × 5,0 = 10. Falta 22,5, que vem de 3 × nota. 22,5 ÷ 3 = 7,5." },
      { o: "ENEM 2022 · questão 136",
        e: "Em uma universidade, atuam professores que estão enquadrados funcionalmente pela sua maior titulação: mestre ou doutor. Nela há, atualmente, 60 mestres e 40 doutores. Os salários mensais dos professores mestres e dos doutores são, respectivamente, R$ 8 000,00 e R$ 12 000,00.\nA diretoria da instituição pretende proporcionar um aumento salarial diferenciado para o ano seguinte, de tal forma que o salário médio mensal dos professores dessa instituição não ultrapasse R$ 12 240,00. A universidade já estabeleceu que o aumento salarial será de 25% para os mestres e precisa ainda definir o percentual de reajuste para os doutores.\nMantido o número atual de professores com suas atuais titulações, o aumento salarial, em porcentagem, a ser concedido aos doutores deverá ser de, no máximo,",
        a: ["14,4.", "20,7.", "22,0.", "30,0.", "37,5."], g: 3,
        r: "Mestres: 8 000 × 1,25 = 10 000. São 100 professores, então a folha pode chegar a 12 240 × 100 = 1 224 000. Os mestres levam 60 × 10 000 = 600 000. Sobra 624 000 para 40 doutores: 15 600 cada. 15 600 ÷ 12 000 = 1,30. Aumento de 30%." }
    ]
  },
  {
    m: "Matemática", t: "Funções", n: 73,
    aula: [
      "Função é uma máquina: entra um número (x), sai outro (y).",
      "Função do 1º grau: y = ax + b. O b é o valor de partida. O a é quanto sobe a cada 1 de x. O gráfico é uma reta.",
      "Função do 2º grau: y = ax² + bx + c. O gráfico é uma curva chamada parábola. Com a negativo, ela tem um ponto mais alto.",
      "O x do ponto mais alto (o vértice): x = −b ÷ (2a)."
    ],
    q: [
      { e: "Na função f(x) = 2x + 3, quanto vale f(4)?", a: ["8", "9", "11", "14", "24"], g: 2,
        r: "Troque o x por 4: 2 × 4 + 3 = 8 + 3 = 11." },
      { e: "Um táxi cobra R$ 5,00 de bandeirada (valor fixo) mais R$ 3,00 por quilômetro rodado. Qual função dá o preço P, em reais, de uma corrida de x quilômetros?",
        a: ["P = 5x + 3", "P = 3x + 5", "P = 8x", "P = 3x − 5", "P = 15x"], g: 1,
        r: "O valor fixo (5) é o de partida, fica sozinho. O 3 é cobrado a cada quilômetro, então multiplica o x. P = 3x + 5." },
      { e: "Um vendedor de sucos percebeu que o lucro diário L, em reais, depende do preço x, em reais, cobrado por copo, segundo a função L(x) = −10x² + 80x − 60. Com preço muito baixo ele ganha pouco por copo. Com preço muito alto, vende poucos copos.\nQual preço por copo dá o maior lucro?",
        a: ["R$ 2,00", "R$ 3,00", "R$ 4,00", "R$ 6,00", "R$ 8,00"], g: 2,
        r: "Aqui a = −10 e b = 80. O ponto mais alto fica em x = −b ÷ (2a) = −80 ÷ (−20) = 4. Com R$ 4,00 o lucro é −160 + 320 − 60 = 100 reais." },
      { o: "ENEM 2022 · questão 176",
        e: "Ao analisar os dados de uma epidemia em uma cidade, peritos obtiveram um modelo que avalia a quantidade de pessoas infectadas a cada mês, ao longo de um ano. O modelo é dado por p(t) = −t² + 10t + 24, sendo t um número natural, variando de 1 a 12, que representa os meses do ano, e p(t) a quantidade de pessoas infectadas no mês t do ano. Para tentar diminuir o número de infectados no próximo ano, a Secretaria Municipal de Saúde decidiu intensificar a propaganda oficial sobre os cuidados com a epidemia. Foram apresentadas cinco propostas (I, II, III, IV e V), com diferentes períodos de intensificação das propagandas:\n• I: 1 ≤ t ≤ 2;\n• II: 3 ≤ t ≤ 4;\n• III: 5 ≤ t ≤ 6;\n• IV: 7 ≤ t ≤ 9;\n• V: 10 ≤ t ≤ 12.\nA sugestão dos peritos é que seja escolhida a proposta cujo período de intensificação da propaganda englobe o mês em que, segundo o modelo, há a maior quantidade de infectados. A sugestão foi aceita.\nA proposta escolhida foi a",
        a: ["I.", "II.", "III.", "IV.", "V."], g: 2,
        r: "É o ponto mais alto da parábola. a = −1 e b = 10. t = −b ÷ (2a) = −10 ÷ (−2) = 5. O mês 5 está na proposta III (de 5 a 6)." }
    ]
  },
  {
    m: "Matemática", t: "Geometria Plana", n: 67,
    aula: [
      "Perímetro é a volta (a soma dos lados). Área é o tamanho da superfície, o chão que a figura cobre.",
      "Retângulo: área = base × altura. Triângulo: base × altura ÷ 2.",
      "Círculo: área = π × raio². Volta = 2 × π × raio. O raio é a metade do diâmetro. O π (pi) vale cerca de 3,14.",
      "Triângulo retângulo é o que tem um canto de 90°. Pitágoras: cateto² + cateto² = hipotenusa². A hipotenusa é o lado maior, de frente para o canto de 90°. Os catetos são os outros dois.",
      "1 hectare = 10 000 m²."
    ],
    q: [
      { e: "Qual é a área de um retângulo de 5 m de base e 3 m de altura?",
        a: ["8 m²", "15 m²", "16 m²", "25 m²", "30 m²"], g: 1,
        r: "Área do retângulo = base × altura = 5 × 3 = 15 m². O 16 é o perímetro (a volta)." },
      { e: "Uma praça circular tem 10 m de raio. Usando 3 como aproximação para π, qual é a área da praça?",
        a: ["30 m²", "60 m²", "100 m²", "300 m²", "900 m²"], g: 3,
        r: "Área = π × raio² = 3 × 10² = 3 × 100 = 300 m². O 60 é a volta (2 × 3 × 10)." },
      { e: "Uma escada será apoiada em uma parede para alcançar uma janela que fica a 4 m do chão. Por segurança, o pé da escada deve ficar a 3 m da parede. O chão é plano e a parede é reta, formando um canto de 90°.\nQual é o menor comprimento que a escada precisa ter?",
        a: ["3,5 m", "5 m", "7 m", "12 m", "25 m"], g: 1,
        r: "Parede, chão e escada formam um triângulo retângulo. A escada é a hipotenusa. 3² + 4² = 9 + 16 = 25. O número que ao quadrado dá 25 é 5. A escada precisa de 5 m." },
      { o: "ENEM 2021 · questão 138",
        e: "Uma unidade de medida comum usada para expressar áreas de terrenos de grandes dimensões é o hectare, que equivale a 10 000 m². Um fazendeiro decide fazer um loteamento utilizando 3 hectares de sua fazenda, dos quais 0,9 hectare será usado para a construção de ruas e calçadas e o restante será dividido em terrenos com área de 300 m² cada um. Os 20 primeiros terrenos vendidos terão preços promocionais de R$ 20 000,00 cada um, e os demais, R$ 30 000,00 cada um.\nNas condições estabelecidas, o valor total, em real, obtido pelo fazendeiro com a venda de todos os terrenos será igual a",
        a: ["700 000.", "1 600 000.", "1 900 000.", "2 200 000.", "2 800 000."], g: 2,
        r: "Sobra para terrenos: 3 − 0,9 = 2,1 hectares = 21 000 m². Terrenos: 21 000 ÷ 300 = 70. Os 20 primeiros: 20 × 20 000 = 400 000. Os outros 50: 50 × 30 000 = 1 500 000. Total: 1 900 000." }
    ]
  },
  {
    m: "Matemática", t: "Geometria Espacial", n: 66,
    aula: [
      "Volume é quanto cabe dentro de um sólido.",
      "Caixa (paralelepípedo): comprimento × largura × altura.",
      "Cilindro (forma de lata): área da base × altura = π × raio² × altura.",
      "1 m³ = 1 000 L. 1 L = 1 000 cm³.",
      "Dobrou todas as medidas? O volume fica 2 × 2 × 2 = 8 vezes maior."
    ],
    q: [
      { e: "Qual é o volume de uma caixa de 2 m de comprimento, 3 m de largura e 4 m de altura?",
        a: ["9 m³", "12 m³", "24 m³", "26 m³", "48 m³"], g: 2,
        r: "Volume = comprimento × largura × altura = 2 × 3 × 4 = 24 m³." },
      { e: "Uma caixa-d'água tem a forma de um paralelepípedo com 2 m de comprimento, 1 m de largura e 1,5 m de altura. Quantos litros de água cabem nela?",
        a: ["3", "30", "300", "3 000", "4 500"], g: 3,
        r: "Volume = 2 × 1 × 1,5 = 3 m³. Cada m³ tem 1 000 L. Cabem 3 000 L." },
      { e: "Uma lata de tinta tem a forma de um cilindro com 10 cm de raio e 30 cm de altura. O fabricante vai lançar uma lata menor, também cilíndrica, com metade do raio e a mesma altura. Use 3 como aproximação para π.\nQuantos litros de tinta cabem na lata menor?",
        a: ["1,125", "2,25", "4,5", "9", "22,5"], g: 1,
        r: "Raio novo: 5 cm. Volume = 3 × 5² × 30 = 3 × 25 × 30 = 2 250 cm³ = 2,25 L. A lata grande tem 9 L: metade do raio dá um quarto do volume, porque o raio entra ao quadrado." },
      { o: "ENEM 2021 · questão 153",
        e: "Um povoado com 100 habitantes está passando por uma situação de seca prolongada e os responsáveis pela administração pública local decidem contratar a construção de um reservatório. Ele deverá ter a forma de um cilindro circular reto, cuja base tenha 5 metros de diâmetro interno, e atender à demanda de água da população por um período de exatamente sete dias consecutivos. No oitavo dia, o reservatório vazio é completamente reabastecido por carros-pipa. Considere que o consumo médio diário por habitante é de 120 litros de água. Use 3 como aproximação para π.\nNas condições apresentadas, o reservatório deverá ser construído com uma altura interna mínima, em metro, igual a",
        a: ["1,12", "3,10", "4,35", "4,48", "5,60"], g: 3,
        r: "Água para 7 dias: 100 × 120 × 7 = 84 000 L = 84 m³. O diâmetro é 5 m, então o raio é 2,5 m. Área da base: 3 × 2,5² = 3 × 6,25 = 18,75 m². Altura = volume ÷ base = 84 ÷ 18,75 = 4,48 m." }
    ]
  }
]);
