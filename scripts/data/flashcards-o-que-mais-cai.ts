// Baralho "O que mais cai" (Pablo, 03/11/2026, 3 dias antes do ENEM).
// Temas tirados de data/revisao-final/o-que-mais-cai.json (2.694 questões
// reais de 2009 a 2023): os que somam 70% de cada área e os 3 seguintes.
// Um fato por cartão, escrito à mão, sem IA do site. A ordem dos cartões
// segue o quanto o tema cai (o script ordena pelo ranking).

export interface CartaoRevisao {
  materia: string;
  /** Chave do ranking: "<matéria do ranking>|<tema>". */
  tema: string;
  frente: string;
  verso: string;
  dica?: string;
}

export const CARTOES_O_QUE_MAIS_CAI: CartaoRevisao[] = [
  // ── Linguagens (baralho de Português) ─────────────────────────────
  { materia: 'Português', tema: 'Português|Interpretação e Leitura de Texto', frente: 'Na questão de interpretação, onde está a resposta?', verso: 'No texto. A alternativa certa diz o que o texto diz, nem mais nem menos. A que vai além do texto (generaliza, exagera) está errada.' },
  { materia: 'Português', tema: 'Português|Interpretação e Leitura de Texto', frente: 'O que é a "tese" de um texto?', verso: 'A ideia principal que o autor defende. Costuma estar no começo e volta na conclusão.' },
  { materia: 'Português', tema: 'Português|Interpretação e Leitura de Texto', frente: 'Que palavras mais pegam o aluno na alternativa?', verso: '"Sempre", "nunca", "todos", "apenas", "exclusivamente": quase sempre generalizam o que o texto não disse.' },
  { materia: 'Português', tema: 'Português|Literatura Brasileira', frente: 'Romantismo: qual o traço que o ENEM mais cobra?', verso: 'Idealização: amor impossível, mulher perfeita, índio herói (José de Alencar), natureza como refúgio, emoção acima da razão.' },
  { materia: 'Português', tema: 'Português|Literatura Brasileira', frente: 'Realismo (Machado de Assis): o que o diferencia do Romantismo?', verso: 'Olha a sociedade sem idealizar: ironia, crítica ao casamento por interesse e à elite, personagem com defeito (Dom Casmurro, Brás Cubas).' },
  { materia: 'Português', tema: 'Português|Literatura Brasileira', frente: 'Modernismo (Semana de 1922): o que ele quis?', verso: 'Romper com a forma antiga: verso livre, linguagem do dia a dia, humor, identidade brasileira (Oswald, Mário de Andrade, depois Drummond).', dica: 'Pense em "antropofagia".' },
  { materia: 'Português', tema: 'Português|Gêneros Textuais e Multimodalidade', frente: 'O que é um texto multimodal?', verso: 'Texto que junta linguagens: palavra + imagem, cor, gráfico. Charge, anúncio, infográfico e tirinha. O sentido vem da soma.' },
  { materia: 'Português', tema: 'Português|Gêneros Textuais e Multimodalidade', frente: 'Qual a função de uma charge?', verso: 'Criticar um fato atual com humor. Para entender, ligue o desenho à notícia da época.' },
  { materia: 'Português', tema: 'Português|Gêneros Textuais e Multimodalidade', frente: 'Como reconhecer o gênero de um texto no ENEM?', verso: 'Pela finalidade: anúncio quer convencer a comprar, notícia informa, campanha muda comportamento, artigo de opinião defende uma ideia.' },
  { materia: 'Inglês', tema: 'Inglês|Reading Comprehension e Interpretação', frente: 'Por onde começar a questão de inglês?', verso: 'Pelo comando em português. Ele diz o que procurar; depois ache só esse trecho no texto em inglês.' },
  { materia: 'Inglês', tema: 'Inglês|Reading Comprehension e Interpretação', frente: 'O que são cognatos?', verso: 'Palavras parecidas com o português e com o mesmo sentido (important, information, society). São a maior parte do texto.' },
  { materia: 'Inglês', tema: 'Inglês|Reading Comprehension e Interpretação', frente: 'Cuidado: o que é falso cognato?', verso: 'Parece português, mas não é: "pretend" = fingir, "actually" = na verdade, "library" = biblioteca, "push" = empurrar.' },
  { materia: 'Português', tema: 'Português|Variação Linguística e Norma-Padrão', frente: 'O que o ENEM pensa de "nós vai", "pra" e gíria?', verso: 'Não existe "erro" de fala: existe variedade adequada ou não à situação. Preconceito linguístico é a alternativa errada.' },
  { materia: 'Português', tema: 'Português|Variação Linguística e Norma-Padrão', frente: 'Quais os tipos de variação linguística?', verso: 'Regional (lugar), social (grupo, idade, profissão), situacional (formal ou informal) e histórica (muda com o tempo).' },
  { materia: 'Português', tema: 'Português|Variação Linguística e Norma-Padrão', frente: 'Quando usar a norma-padrão?', verso: 'Em situação formal: redação, documento, entrevista de emprego. Na conversa com amigo, a informal é a adequada.' },
  { materia: 'Português', tema: 'Artes|-', frente: 'O que é performance (arte)?', verso: 'Obra feita com o corpo do artista, ao vivo, muitas vezes com o público. A obra é a ação, não um objeto.' },
  { materia: 'Português', tema: 'Artes|-', frente: 'O que é intervenção urbana?', verso: 'Arte feita na rua (grafite, instalação) que muda o espaço público e faz quem passa pensar na cidade.' },
  { materia: 'Português', tema: 'Artes|-', frente: 'O que a arte contemporânea costuma querer do público?', verso: 'Provocar reflexão e participação, não só ser bonita. A pergunta do ENEM é quase sempre "que crítica a obra faz?".' },
  { materia: 'Português', tema: 'Educação Física|-', frente: 'Como o ENEM vê o esporte e a dança?', verso: 'Como cultura corporal: expressão, lazer, identidade de um grupo. Não só competição e rendimento.' },
  { materia: 'Português', tema: 'Educação Física|-', frente: 'O que o ENEM critica sobre o corpo?', verso: 'O padrão de beleza da mídia e o corpo como produto. A saída valorizada é saúde, inclusão e respeito à diferença.' },
  { materia: 'Português', tema: 'Português|Funções da Linguagem', frente: 'Função apelativa (conativa): como reconhecer?', verso: 'Fala com o leitor para convencê-lo: verbo no imperativo, "você". Típica de anúncio e campanha.' },
  { materia: 'Português', tema: 'Português|Funções da Linguagem', frente: 'Função metalinguística: o que é?', verso: 'A linguagem fala dela mesma: poema sobre fazer poema, dicionário explicando palavra, filme sobre cinema.' },

  // ── Matemática ────────────────────────────────────────────────────
  { materia: 'Matemática', tema: 'Matemática|Aritmética e Porcentagem', frente: 'Aumento de 20%: por quanto multiplica?', verso: 'Por 1,2. Desconto de 20%: por 0,8. Dois aumentos de 10% dão ×1,1×1,1 = 1,21 (21%, não 20%).' },
  { materia: 'Matemática', tema: 'Matemática|Aritmética e Porcentagem', frente: 'Como montar uma regra de três?', verso: 'Duas grandezas lado a lado. Se uma sobe e a outra sobe junto, é direta (multiplica cruzado). Se uma sobe e a outra desce, é inversa.' },
  { materia: 'Matemática', tema: 'Matemática|Aritmética e Porcentagem', frente: 'Quanto é 15% de 80, de cabeça?', verso: '10% = 8, 5% = 4, então 15% = 12. Quebre em 10%, 5% e 1%.' },
  { materia: 'Matemática', tema: 'Matemática|Grandezas e Medidas', frente: '1 m³ tem quantos litros?', verso: '1.000 litros. E 1 dm³ = 1 L; 1 cm³ = 1 mL.' },
  { materia: 'Matemática', tema: 'Matemática|Grandezas e Medidas', frente: 'Escala 1 : 50.000. Quanto vale 1 cm no mapa?', verso: '50.000 cm = 500 m no real. Distância real = distância no mapa × denominador.' },
  { materia: 'Matemática', tema: 'Matemática|Grandezas e Medidas', frente: 'A escala de comprimento é 1:k. Qual a escala de área?', verso: '1 : k². Dobrou o lado, a área fica 4 vezes maior; o volume, 8 vezes (k³).' },
  { materia: 'Matemática', tema: 'Matemática|Estatística', frente: 'Como achar a mediana?', verso: 'Coloque os números em ordem. É o do meio; se forem pares, a média dos dois do meio.' },
  { materia: 'Matemática', tema: 'Matemática|Estatística', frente: 'O que é moda?', verso: 'O valor que mais se repete. Pode haver mais de uma moda, ou nenhuma.' },
  { materia: 'Matemática', tema: 'Matemática|Estatística', frente: 'Média ponderada: como calcular?', verso: 'Multiplique cada nota pelo peso, some tudo e divida pela soma dos pesos.' },
  { materia: 'Matemática', tema: 'Matemática|Funções', frente: 'Função afim f(x) = ax + b: o que é o "a"?', verso: 'A taxa: quanto y muda quando x sobe 1. O "b" é o valor inicial (onde a reta corta o eixo y).' },
  { materia: 'Matemática', tema: 'Matemática|Funções', frente: 'Onde está o máximo ou mínimo da parábola?', verso: 'No vértice: x = −b/(2a). Se a < 0 a parábola é "triste" e o vértice é máximo; se a > 0, mínimo.' },
  { materia: 'Matemática', tema: 'Matemática|Funções', frente: 'No gráfico, como saber se a grandeza cresce mais rápido?', verso: 'Pela inclinação: quanto mais "em pé" a linha, maior a taxa de variação naquele trecho.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Plana', frente: 'Teorema de Pitágoras', verso: 'a² = b² + c² (hipotenusa ao quadrado = soma dos catetos ao quadrado). Trio que cai: 3, 4, 5.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Plana', frente: 'Área do círculo e comprimento da circunferência', verso: 'Área = π·r². Comprimento = 2·π·r. No ENEM, π costuma ser 3 ou 3,14.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Plana', frente: 'Área do triângulo', verso: 'base × altura ÷ 2. A altura é perpendicular à base.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Espacial', frente: 'Volume de prisma e cilindro', verso: 'Área da base × altura. Cilindro: π·r²·h.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Espacial', frente: 'Volume de cone e pirâmide', verso: 'Área da base × altura ÷ 3. Um terço do prisma (ou cilindro) de mesma base e altura.' },
  { materia: 'Matemática', tema: 'Matemática|Geometria Espacial', frente: 'O que é planificação?', verso: 'O sólido "aberto" no plano. Cubo: 6 quadrados; cilindro: 2 círculos e 1 retângulo; cone: círculo e setor.' },
  { materia: 'Matemática', tema: 'Matemática|Análise Combinatória e Probabilidade', frente: 'Probabilidade: qual a conta?', verso: 'P = casos favoráveis ÷ casos possíveis. Dois eventos independentes seguidos: multiplique as probabilidades.' },
  { materia: 'Matemática', tema: 'Matemática|Análise Combinatória e Probabilidade', frente: 'Arranjo ou combinação?', verso: 'Pergunte: trocar a ordem muda o resultado? Muda (senha, pódio) = arranjo. Não muda (grupo, comissão) = combinação.' },
  { materia: 'Matemática', tema: 'Matemática|Análise Combinatória e Probabilidade', frente: 'Princípio multiplicativo', verso: 'Escolhas em etapas: multiplique o número de opções de cada uma. 3 camisas e 4 calças = 12 jeitos.' },
  { materia: 'Matemática', tema: 'Matemática|Álgebra', frente: 'Como resolver ax² + bx + c = 0?', verso: 'Δ = b² − 4ac; x = (−b ± √Δ) ÷ 2a. Δ < 0: sem raiz real.' },
  { materia: 'Matemática', tema: 'Matemática|Lógica e Numeração', frente: 'Para que serve o MMC no ENEM?', verso: 'Achar quando coisas que se repetem coincidem de novo (ônibus a cada 15 e 20 min se encontram a cada 60).' },

  // ── Biologia ──────────────────────────────────────────────────────
  { materia: 'Biologia', tema: 'Biologia|Ecologia', frente: 'O que é eutrofização?', verso: 'Excesso de nutrientes (esgoto, adubo) na água → algas proliferam → decomposição consome o O₂ → peixes morrem.' },
  { materia: 'Biologia', tema: 'Biologia|Ecologia', frente: 'O que é bioacumulação (magnificação trófica)?', verso: 'Substância que não se elimina (mercúrio, DDT) se concentra mais a cada nível da cadeia: o predador do topo tem mais.' },
  { materia: 'Biologia', tema: 'Biologia|Ecologia', frente: 'Mutualismo, comensalismo e parasitismo', verso: 'Mutualismo: os dois ganham. Comensalismo: um ganha e o outro nem ganha nem perde. Parasitismo: um ganha e o outro perde.' },
  { materia: 'Biologia', tema: 'Biologia|Fisiologia Humana e Saúde', frente: 'Onde acontece a maior parte da absorção dos nutrientes?', verso: 'No intestino delgado (vilosidades). O grosso absorve principalmente água.' },
  { materia: 'Biologia', tema: 'Biologia|Fisiologia Humana e Saúde', frente: 'Qual a função dos rins?', verso: 'Filtrar o sangue, tirar ureia e controlar água e sais. A unidade é o néfron.' },
  { materia: 'Biologia', tema: 'Biologia|Fisiologia Humana e Saúde', frente: 'O que a hemoglobina faz?', verso: 'Transporta O₂ nas hemácias. Monóxido de carbono (CO) se liga a ela no lugar do O₂ e mata por asfixia.' },
  { materia: 'Biologia', tema: 'Biologia|Genética', frente: 'Aa × Aa: qual a proporção dos filhos?', verso: '1 AA : 2 Aa : 1 aa. Se A domina: 3 com a característica dominante para 1 recessiva.' },
  { materia: 'Biologia', tema: 'Biologia|Genética', frente: 'Qual o caminho da informação genética?', verso: 'DNA → (transcrição) RNA → (tradução, no ribossomo) proteína.' },
  { materia: 'Biologia', tema: 'Biologia|Genética', frente: 'Quem é o doador e o receptor universal (ABO)?', verso: 'Doador universal: O negativo. Receptor universal: AB positivo.' },
  { materia: 'Biologia', tema: 'Biologia|Citologia', frente: 'Para que serve a mitocôndria?', verso: 'Respiração celular: produz ATP (energia) usando glicose e O₂.' },
  { materia: 'Biologia', tema: 'Biologia|Citologia', frente: 'Mitose e meiose: qual a diferença?', verso: 'Mitose: 1 célula vira 2 iguais (crescimento). Meiose: vira 4 com metade dos cromossomos (gametas).' },
  { materia: 'Biologia', tema: 'Biologia|Citologia', frente: 'O que o ribossomo faz?', verso: 'Fabrica proteínas, lendo o RNA mensageiro.' },
  { materia: 'Biologia', tema: 'Biologia|Evolução', frente: 'Seleção natural (Darwin) em uma frase', verso: 'Os indivíduos já variam; o ambiente favorece os mais adaptados, que deixam mais filhos.' },
  { materia: 'Biologia', tema: 'Biologia|Evolução', frente: 'Por que bactérias ficam resistentes ao antibiótico?', verso: 'O antibiótico mata as sensíveis e sobram as que já eram resistentes, que se multiplicam. Ele seleciona, não cria a resistência.', dica: 'A alternativa "a bactéria se adaptou para resistir" é Lamarck.' },
  { materia: 'Biologia', tema: 'Biologia|Evolução', frente: 'O que é Lamarck no ENEM?', verso: 'Uso e desuso + herança do adquirido ("a girafa esticou o pescoço"). Quase sempre a alternativa errada.' },
  { materia: 'Biologia', tema: 'Biologia|Microbiologia e Doenças', frente: 'Dengue, zika e chikungunya: como prevenir?', verso: 'São vírus levados pelo Aedes aegypti. Prevenção: acabar com água parada.' },
  { materia: 'Biologia', tema: 'Biologia|Microbiologia e Doenças', frente: 'Antibiótico serve contra vírus?', verso: 'Não. Antibiótico mata bactéria. Contra vírus: vacina (prevenção) e antivirais.' },
  { materia: 'Biologia', tema: 'Biologia|Microbiologia e Doenças', frente: 'Esquistossomose: como pega?', verso: 'Verme que entra pela pele em água doce com caramujo contaminado. Prevenção: saneamento básico.' },
  { materia: 'Biologia', tema: 'Biologia|Metabolismo Energético e Enzimas', frente: 'Fotossíntese x respiração', verso: 'Fotossíntese: CO₂ + água + luz → glicose + O₂ (guarda energia). Respiração: o contrário (libera energia, ATP).' },
  { materia: 'Biologia', tema: 'Biologia|Metabolismo Energético e Enzimas', frente: 'O que é fermentação?', verso: 'Tirar energia da glicose sem O₂. Levedura faz álcool + CO₂ (pão, cerveja); músculo faz ácido lático.' },
  { materia: 'Biologia', tema: 'Biologia|Botânica e Fisiologia Vegetal', frente: 'Xilema e floema', verso: 'Xilema leva água e sais da raiz para cima. Floema leva a seiva com açúcar das folhas para a planta toda.' },
  { materia: 'Biologia', tema: 'Biologia|Botânica e Fisiologia Vegetal', frente: 'Para que servem os estômatos?', verso: 'Trocas gasosas e transpiração. Na seca, fecham para não perder água.' },

  // ── Química ───────────────────────────────────────────────────────
  { materia: 'Química', tema: 'Química|Química Orgânica', frente: 'Como reconhecer álcool, ácido carboxílico e éster?', verso: 'Álcool: –OH em carbono. Ácido: –COOH. Éster: –COO– entre dois carbonos (cheiro de fruta).' },
  { materia: 'Química', tema: 'Química|Química Orgânica', frente: 'O que é isomeria?', verso: 'Mesma fórmula molecular, estrutura diferente, propriedades diferentes.' },
  { materia: 'Química', tema: 'Química|Química Orgânica', frente: 'Como se faz sabão?', verso: 'Saponificação: gordura (éster) + base forte (NaOH). O sabão tem uma ponta que gosta de água e outra que gosta de gordura.' },
  { materia: 'Química', tema: 'Química|Química Ambiental e Energia', frente: 'O que causa a chuva ácida?', verso: 'SO₂ (enxofre de combustível fóssil) e NOx (motores) reagem com a água do ar e formam ácidos.' },
  { materia: 'Química', tema: 'Química|Química Ambiental e Energia', frente: 'Qual o principal gás do efeito estufa por ação humana?', verso: 'CO₂, da queima de combustível fóssil e do desmatamento. Metano (CH₄) vem do gado e do lixo.' },
  { materia: 'Química', tema: 'Química|Química Ambiental e Energia', frente: 'Por que o etanol é chamado de renovável?', verso: 'Vem da cana: o CO₂ que ele solta na queima é o que a planta tirou do ar ao crescer.' },
  { materia: 'Química', tema: 'Química|Soluções, pH e Titulação', frente: 'pH: o que é ácido e o que é básico?', verso: 'pH < 7 ácido, = 7 neutro, > 7 básico. Cada ponto de pH é 10 vezes mais ácido ou básico.' },
  { materia: 'Química', tema: 'Química|Soluções, pH e Titulação', frente: 'Diluição: qual a fórmula?', verso: 'C₁·V₁ = C₂·V₂. Pôr água aumenta o volume e baixa a concentração; a quantidade de soluto não muda.' },
  { materia: 'Química', tema: 'Química|Soluções, pH e Titulação', frente: 'O que é neutralização?', verso: 'Ácido + base → sal + água. Ex.: antiácido (base) contra azia (ácido do estômago).' },
  { materia: 'Química', tema: 'Química|Eletroquímica', frente: 'Na pilha, quem perde elétron?', verso: 'Quem oxida perde elétron: é o ânodo (polo negativo), que se desgasta. Quem reduz ganha elétron: cátodo.' },
  { materia: 'Química', tema: 'Química|Eletroquímica', frente: 'Por que se usa zinco ou magnésio para proteger o ferro?', verso: 'Metal de sacrifício: oxida mais fácil que o ferro, então enferruja no lugar dele (galvanização).' },
  { materia: 'Química', tema: 'Química|Estequiometria e Leis Ponderais', frente: '1 mol equivale a quê?', verso: 'A massa molar em gramas (H₂O = 18 g), 6×10²³ partículas e, para gás nas CNTP, 22,4 L.' },
  { materia: 'Química', tema: 'Química|Estequiometria e Leis Ponderais', frente: 'Primeiro passo de toda conta de estequiometria', verso: 'Balancear a equação. A proporção dos coeficientes é a proporção em mol; depois é regra de três.' },

  // ── Física ────────────────────────────────────────────────────────
  { materia: 'Física', tema: 'Física|Eletricidade e Circuitos', frente: 'Como calcular o gasto de energia de um aparelho?', verso: 'E = P × t. Potência em kW × horas = kWh, a unidade da conta de luz.' },
  { materia: 'Física', tema: 'Física|Eletricidade e Circuitos', frente: 'Lei de Ohm e potência', verso: 'U = R·i e P = U·i. Chuveiro no "inverno" tem resistência menor, corrente maior e mais potência.' },
  { materia: 'Física', tema: 'Física|Eletricidade e Circuitos', frente: 'Associação em série x paralelo', verso: 'Série: mesma corrente, resistências somam (uma queima, apaga tudo). Paralelo: mesma tensão, como nas tomadas de casa.' },
  { materia: 'Física', tema: 'Física|Termodinâmica e Calor', frente: 'Calor sensível: qual a fórmula?', verso: 'Q = m·c·ΔT. Água tem calor específico alto: demora para esquentar e para esfriar.' },
  { materia: 'Física', tema: 'Física|Termodinâmica e Calor', frente: 'Condução, convecção e radiação', verso: 'Condução: pelo contato (cabo da panela). Convecção: o fluido se move (ar-condicionado no alto). Radiação: sem meio (Sol).' },
  { materia: 'Física', tema: 'Física|Termodinâmica e Calor', frente: 'Uma máquina térmica pode render 100%?', verso: 'Não (2ª lei da termodinâmica). Sempre perde parte da energia como calor para a fonte fria.' },
  { materia: 'Física', tema: 'Física|Ondas e Acústica', frente: 'Equação fundamental da onda', verso: 'v = λ·f (velocidade = comprimento de onda × frequência).' },
  { materia: 'Física', tema: 'Física|Ondas e Acústica', frente: 'Som agudo x som alto', verso: 'Agudo = frequência alta. Alto (forte) = amplitude grande (intensidade). Timbre diferencia instrumentos.' },
  { materia: 'Física', tema: 'Física|Ondas e Acústica', frente: 'O que é ressonância?', verso: 'Quando a frequência de fora é igual à natural do corpo, a vibração cresce muito (taça que quebra com a voz, sintonizar rádio).' },
  { materia: 'Física', tema: 'Física|Óptica', frente: 'Miopia e hipermetropia: que lente corrige?', verso: 'Miopia (não vê longe): lente divergente. Hipermetropia (não vê perto): lente convergente.' },
  { materia: 'Física', tema: 'Física|Óptica', frente: 'O que é refração?', verso: 'A luz muda de velocidade e de direção ao passar de um meio para outro (canudo "quebrado" no copo d’água).' },
  { materia: 'Física', tema: 'Física|Dinâmica e Leis de Newton', frente: 'As 3 leis de Newton', verso: '1ª inércia (sem força, mantém o movimento). 2ª F = m·a. 3ª ação e reação (forças em corpos diferentes).' },
  { materia: 'Física', tema: 'Física|Dinâmica e Leis de Newton', frente: 'Por que o cinto de segurança funciona?', verso: 'Inércia: na freada o corpo continua indo para a frente; o cinto aplica a força que o para.' },
  { materia: 'Física', tema: 'Física|Cinemática', frente: 'Como passar km/h para m/s?', verso: 'Divida por 3,6. 72 km/h = 20 m/s. De m/s para km/h, multiplique por 3,6.' },

  // ── Geografia ─────────────────────────────────────────────────────
  { materia: 'Geografia', tema: 'Geografia|Geopolítica Mundial', frente: 'O que é globalização?', verso: 'Integração mundial de economia, informação e cultura, puxada pela tecnologia. Aumenta fluxos e também desigualdades.' },
  { materia: 'Geografia', tema: 'Geografia|Geopolítica Mundial', frente: 'O que é bloco econômico? Exemplos.', verso: 'Acordo entre países para reduzir barreiras de comércio: Mercosul, União Europeia (tem moeda única, o euro).' },
  { materia: 'Geografia', tema: 'Geografia|Questão Agrária e Agronegócio', frente: 'Qual o problema central da questão agrária no Brasil?', verso: 'Concentração de terra em poucas mãos (latifúndio), herança das sesmarias. Gera conflito no campo e luta por reforma agrária (MST).' },
  { materia: 'Geografia', tema: 'Geografia|Questão Agrária e Agronegócio', frente: 'Agronegócio x agricultura familiar', verso: 'Agronegócio: grande área, monocultura de exportação (soja), muita máquina. Agricultura familiar: pequena, emprega mais gente e produz boa parte do alimento do dia a dia (feijão, mandioca, leite).' },
  { materia: 'Geografia', tema: 'Geografia|Questão Agrária e Agronegócio', frente: 'O que é êxodo rural?', verso: 'Saída do campo para a cidade, acelerada pela mecanização e pela concentração de terra.' },
  { materia: 'Geografia', tema: 'Geografia|Sustentabilidade e Problemas Ambientais', frente: 'O que é ilha de calor?', verso: 'Centro da cidade mais quente que a periferia: asfalto e concreto guardam calor, pouco verde, muitos carros.' },
  { materia: 'Geografia', tema: 'Geografia|Sustentabilidade e Problemas Ambientais', frente: 'O que é desenvolvimento sustentável?', verso: 'Atender às necessidades de hoje sem tirar das próximas gerações a chance de atender às delas.' },
  { materia: 'Geografia', tema: 'Geografia|Geologia e Geomorfologia', frente: 'Por que o Brasil quase não tem terremoto forte?', verso: 'Está no meio da placa Sul-Americana, longe das bordas, onde as placas se chocam.' },
  { materia: 'Geografia', tema: 'Geografia|Geologia e Geomorfologia', frente: 'Intemperismo x erosão', verso: 'Intemperismo: a rocha se quebra no lugar (chuva, calor). Erosão: o material é levado (água, vento). Desmatamento acelera a erosão.' },
  { materia: 'Geografia', tema: 'Geografia|Urbanização e Problemas Urbanos', frente: 'O que é conurbação?', verso: 'Duas ou mais cidades crescem até se juntar numa mancha urbana só.' },
  { materia: 'Geografia', tema: 'Geografia|Urbanização e Problemas Urbanos', frente: 'O que é segregação socioespacial?', verso: 'Os pobres empurrados para a periferia e áreas de risco, longe de emprego e serviço; os ricos em áreas centrais ou condomínios.' },
  { materia: 'Geografia', tema: 'Geografia|Demografia e Migrações', frente: 'O que é transição demográfica?', verso: 'Primeiro cai a mortalidade, depois a natalidade. A população envelhece (pirâmide com base estreita), como no Brasil hoje.' },
  { materia: 'Geografia', tema: 'Geografia|Climatologia', frente: 'Por que o Sertão é seco?', verso: 'Clima semiárido: as massas de ar úmidas perdem a umidade antes de chegar; chuva pouca e mal distribuída. Vegetação: Caatinga.' },
  { materia: 'Geografia', tema: 'Geografia|Climatologia', frente: 'O que é El Niño?', verso: 'Aquecimento das águas do Pacífico que muda o clima: seca no Nordeste e na Amazônia, chuva no Sul do Brasil.' },
  { materia: 'Geografia', tema: 'Geografia|Cartografia, Fusos Horários e Movimentos da Terra', frente: 'Fuso horário: quantos graus por hora?', verso: '15° = 1 hora (360° ÷ 24 h). Para o leste o horário é adiantado; para o oeste, atrasado.' },
  { materia: 'Geografia', tema: 'Geografia|Cartografia, Fusos Horários e Movimentos da Terra', frente: 'Escala grande x pequena', verso: 'Grande (1:1.000): mostra pouca área com muito detalhe. Pequena (1:10.000.000): muita área, pouco detalhe.' },
  { materia: 'Geografia', tema: 'Geografia|Energia', frente: 'Qual a principal fonte da eletricidade no Brasil?', verso: 'Hidrelétrica. Renovável, mas alaga áreas, desloca populações e muda o rio.' },

  // ── História ──────────────────────────────────────────────────────
  { materia: 'História', tema: 'História|República Velha e Era Vargas', frente: 'O que era o coronelismo?', verso: 'Na República Velha, o coronel (fazendeiro) controlava o voto da região: voto de cabresto, troca de favores.' },
  { materia: 'História', tema: 'História|República Velha e Era Vargas', frente: 'Política do café com leite', verso: 'São Paulo (café) e Minas (leite) se revezavam na presidência na República Velha. Acabou com a Revolução de 1930.' },
  { materia: 'História', tema: 'História|República Velha e Era Vargas', frente: 'O que Vargas deu ao trabalhador?', verso: 'CLT (1943): carteira assinada, salário mínimo, férias. Em troca, sindicatos controlados pelo Estado (trabalhismo, populismo).' },
  { materia: 'História', tema: 'História|República Velha e Era Vargas', frente: 'O que foi o Estado Novo?', verso: 'Ditadura de Vargas (1937–1945): Congresso fechado, censura (DIP), propaganda do líder.' },
  { materia: 'História', tema: 'História|Antiguidade e Idade Média', frente: 'Quem votava na democracia de Atenas?', verso: 'Só homens livres, adultos e filhos de atenienses. Mulheres, escravos e estrangeiros ficavam de fora.' },
  { materia: 'História', tema: 'História|Antiguidade e Idade Média', frente: 'O que é feudalismo?', verso: 'Idade Média: terra no centro de tudo, servo preso à terra pagando obrigações ao senhor, Igreja com grande poder.' },
  { materia: 'História', tema: 'História|Brasil Império', frente: 'O que era o Poder Moderador?', verso: 'Quarto poder da Constituição de 1824, só do imperador, acima dos outros três.' },
  { materia: 'História', tema: 'História|Brasil Império', frente: 'Leis da abolição em ordem', verso: 'Eusébio de Queirós (1850, fim do tráfico), Ventre Livre (1871), Sexagenários (1885), Áurea (1888).' },
  { materia: 'História', tema: 'História|Ditadura Militar e Redemocratização', frente: 'O que foi o AI-5 (1968)?', verso: 'O ato mais duro da ditadura: fechou o Congresso, suspendeu o habeas corpus, ampliou censura e tortura.' },
  { materia: 'História', tema: 'História|Ditadura Militar e Redemocratização', frente: 'O que marca o fim da ditadura?', verso: 'Anistia (1979), Diretas Já (1984), eleição indireta de Tancredo (1985) e a Constituição Cidadã (1988).' },
  { materia: 'História', tema: 'História|Historiografia e Memória', frente: 'O que é fonte histórica?', verso: 'Qualquer vestígio do passado: documento, foto, objeto, música, relato oral. Toda fonte tem um ponto de vista.' },
  { materia: 'História', tema: 'História|Brasil Colonial', frente: 'O que era o pacto colonial?', verso: 'A colônia só podia comerciar com a metrópole (Portugal), vendendo matéria-prima e comprando manufaturados.' },
  { materia: 'História', tema: 'História|Escravidão e Resistência no Brasil', frente: 'O que eram os quilombos?', verso: 'Comunidades de pessoas que fugiam da escravidão. O maior foi Palmares (Zumbi). Também havia resistência no dia a dia.' },
  { materia: 'História', tema: 'História|Iluminismo e Revoluções Burguesas', frente: 'Montesquieu: qual a ideia?', verso: 'Separar o poder em três: Executivo, Legislativo e Judiciário, contra o rei absoluto.' },
  { materia: 'História', tema: 'História|Iluminismo e Revoluções Burguesas', frente: 'Lema da Revolução Francesa', verso: 'Liberdade, igualdade e fraternidade. Fim dos privilégios do clero e da nobreza; a burguesia sobe ao poder.' },
  { materia: 'História', tema: 'História|Culturas Indígenas e Pré-Colombianas', frente: 'Maias, astecas e incas: onde ficavam?', verso: 'Maias e astecas no México e América Central; incas nos Andes (Peru), com Machu Picchu.' },

  // ── Sociologia ────────────────────────────────────────────────────
  { materia: 'Sociologia', tema: 'Sociologia|Mídia, Cultura e Sociedade Digital', frente: 'O que é indústria cultural (Adorno e Horkheimer)?', verso: 'Cultura feita como produto em série para vender e entreter, deixando o público passivo e pouco crítico.' },
  { materia: 'Sociologia', tema: 'Sociologia|Mídia, Cultura e Sociedade Digital', frente: 'O que é bolha (filtro) nas redes?', verso: 'O algoritmo mostra só o que você já concorda, isolando grupos e facilitando a desinformação.' },
  { materia: 'Sociologia', tema: 'Sociologia|Trabalho e Sociedade', frente: 'Fordismo x toyotismo', verso: 'Fordismo: linha de montagem, produção em massa, estoque grande. Toyotismo: produção enxuta, "just in time", trabalhador multifuncional.' },
  { materia: 'Sociologia', tema: 'Sociologia|Trabalho e Sociedade', frente: 'O que é uberização?', verso: 'Trabalho por aplicativo sem vínculo nem direitos: o trabalhador assume o risco e o custo. Forma de precarização.' },
  { materia: 'Sociologia', tema: 'Sociologia|Cultura e Diversidade', frente: 'Etnocentrismo x relativismo cultural', verso: 'Etnocentrismo: julgar o outro pela própria cultura, como se ela fosse a certa. Relativismo: entender cada cultura nos termos dela.' },
  { materia: 'Sociologia', tema: 'Sociologia|Movimentos Sociais e Cidadania', frente: 'Direitos civis, políticos e sociais (Marshall)', verso: 'Civis: liberdade, propriedade. Políticos: votar e ser votado. Sociais: saúde, educação, trabalho.' },
  { materia: 'Sociologia', tema: 'Sociologia|Gênero e Violência', frente: 'O que é a Lei Maria da Penha?', verso: 'Lei de 2006 contra a violência doméstica e familiar contra a mulher (física, psicológica, sexual, patrimonial, moral).' },

  // ── Filosofia ─────────────────────────────────────────────────────
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Política', frente: 'Hobbes: por que precisamos do Estado?', verso: 'No estado de natureza é "guerra de todos contra todos" (o homem é lobo do homem). As pessoas dão poder ao soberano em troca de segurança.' },
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Política', frente: 'Locke e Rousseau: a diferença', verso: 'Locke: o Estado existe para proteger vida, liberdade e propriedade. Rousseau: o homem nasce bom, a sociedade corrompe; vale a vontade geral.' },
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Política', frente: 'Maquiavel em uma frase', verso: 'Política como ela é, separada da moral: o príncipe faz o que for preciso para manter o poder ("é melhor ser temido que amado").' },
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Antiga', frente: 'O que é o Mundo das Ideias (Platão)?', verso: 'O mundo que vemos é cópia imperfeita; a verdade está nas Ideias, alcançadas pela razão (Mito da Caverna).' },
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Antiga', frente: 'Ética de Aristóteles', verso: 'A virtude está no meio-termo entre dois excessos (coragem entre covardia e imprudência). O fim da vida é a felicidade (eudaimonia).' },
  { materia: 'Filosofia', tema: 'Filosofia|Filosofia Antiga', frente: 'Sócrates: qual o método?', verso: 'Perguntar até a pessoa ver que não sabia (ironia) e então chegar ao conceito (maiêutica). "Só sei que nada sei."' },
];
