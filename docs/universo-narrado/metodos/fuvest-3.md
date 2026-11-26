# Métodos — Fuvest 3: geometria analítica (fuv-11 a 13) e funções (fuv-14 a 16)

Palavras próprias; citação literal só em regra de bolso. Contas refeitas. "?" marca o que a legenda não deixa fechar. Os horários são os do bloco da transcrição.

### fuv-11-geometria-analitica-parte-1-3.txt

- **Método: ler um sistema de coordenadas qualquer (eixos inclinados)** `[5:37:30]`: avisa quando os eixos formam um ângulo θ diferente de 90°. Passos: coordenada X se mede andando paralelo ao eixo X, coordenada Y andando paralelo ao eixo Y (linhas paralelas aos eixos, não perpendiculares). Por que funciona: sistema de coordenadas só precisa localizar cada ponto com dois números.
- **Método: coordenadas polares** `[5:39:01]`: ponto dado por distância R à origem e ângulo θ. Passos: andar R e girar θ. Por que funciona: dois números bastam no plano.
- **Método: separar ponto de coordenada** `[5:43:30]`: avisa quando há dois referenciais ou troca de sistema. Passos: o ponto e a distância entre pontos não mudam; os números que descrevem o ponto mudam. Por que funciona: posição é absoluta, coordenada depende da origem e dos eixos.
- **Método: distância usual é Pitágoras** `[5:44:30]`: eixos perpendiculares. Passos: ΔX e ΔY são catetos, d = √(ΔX² + ΔY²). Por que funciona: as paralelas aos eixos formam triângulo retângulo.
- **Método: distância em eixos inclinados (lei dos cossenos)** `[5:47:30]`: ângulo θ entre os eixos. Passos: levar ΔX e ΔY por paralelas até formar um paralelogramo; o ângulo oposto ao segmento é 180° − θ; usar cos(180° − θ) = −cos θ; d² = ΔX² + ΔY² + 2·ΔX·ΔY·cos θ. Por que funciona: o triângulo deixa de ser retângulo.
- **Método: achar o cosseno do ângulo por uma distância conhecida** `[5:51:31]`: o enunciado dá dois pontos e a distância entre eles, e pede outra distância. Passos: aplicar a fórmula ao par conhecido, isolar cos θ, aplicar ao segundo par. O ângulo em si não precisa. Por que funciona: a única incógnita da fórmula é cos θ.
- **Método alternativo: converter para eixos perpendiculares** `[5:59:30]`: se souber o ângulo, converter as coordenadas e usar Pitágoras. Ele julga bem mais trabalhoso.
- **Método: completar quadrados na circunferência** `[6:04:30]`: equação aberta com x², y², termos lineares. Passos: agrupar x e y; somar e subtrair o quadrado da metade do coeficiente linear; ler (x − a)² + (y − b)² = R². Por que funciona: somar e subtrair o mesmo número não muda a equação e refaz o produto notável.
- **Método: esboço antes da conta** `[6:07:31]`: marcar centro, raio, reta dada e a posição das retas procuradas. Por que funciona: mostra quantas respostas existem e qual a condição extra elimina.
- **Método: perpendicularidade** `[6:10:30]`: retas perpendiculares. Passos: produto dos coeficientes angulares = −1 (inverte e troca o sinal); deixa só o coeficiente linear k como incógnita. Por que funciona: condição de perpendicularidade para retas não paralelas aos eixos.
- **Método: tangência por substituição e Δ = 0 (força bruta, sempre funciona)** `[6:13:00]`: reta tangente a circunferência. Passos: substituir y da reta na equação da circunferência; sai equação de 2º grau em x com k; impor Δ = 0 (continua em fuv-12). Por que funciona: tangente tem um só ponto comum.

- **Erro que ele avisa** `[5:41:01]`: usar Pitágoras em eixos não perpendiculares.
- **Erro que ele avisa** `[5:46:02]`: traçar a coordenada perpendicular ao eixo, por vício, em vez de paralela ao outro eixo (eles mesmos escorregam e corrigem).
- **Erro que ele avisa** `[5:51:31]`: trocar a ordem dos pontos só em ΔX ou só em ΔY. Com o termo cruzado (e no coeficiente angular) o sinal importa; trocar os dois não muda nada. Regra: A→B nos dois ou B→A nos dois.
- **Erro que ele avisa** `[6:08:00]`: sinal da coordenada do centro: (y + 1)² dá centro y = −1.
- **Conselho de prova** `[5:44:00]`: entender de onde vem a fórmula, não só decorar.
- **Conselho de prova** `[6:01:33]`: a prova nova cobra ângulo como 15° e não perdoa musiquinha decorada; estudar com substância.
- **Conselho de prova** `[6:04:02]`: não descartar assunto como só cai em prova militar; circunferência em forma aberta cai.
- **Conselho de prova** `[6:14:00]`: levar o procedimento padrão (substituição) como ferramenta garantida, mesmo havendo caminho mais bonito.

- **Questão resolvida** `[5:37:30]`: banca/ano não ditos com clareza (ele só diz que apareceu). Eixos inclinados; A(1,0), B(0,1) distam √3; pede distância entre C(−1,3) e D(2,1). Ideia: 3 = 2 − 2cos θ, então cos θ = −1/2 (120°); d² = 9 + 4 + 6 = 19. Resposta √19, conferida.
- **Questão resolvida** `[6:02:00]` (termina em fuv-12): banca/ano não ditos. Jardim x² − 6x + y² + 2y + 5 = 0; parede x − 2y + 4 = 0; caminho perpendicular à parede, tangente ao jardim e sem passar pela origem. Centro (3, −1), raio √5, coeficiente angular −2. Resposta y = −2x + 10, conferida.

- **O que ele desenha**: dois eixos inclinados com paralelas pontilhadas até o ponto; ponto polar com R e θ; retângulo (90°) contra paralelogramo com o ângulo externo marcado; dois sistemas diferentes sobre os mesmos pontos; plano com centro (3, −1), circunferência, reta crescente que corta y em 2 e duas tangentes decrescentes.

### fuv-12-geometria-analitica-parte-2-3.txt

- **Método: discriminante e número de interseções** `[6:16:02]`: reta e circunferência. Passos: Δ > 0 secante (2 pontos), Δ = 0 tangente (1), Δ < 0 não toca. Por que funciona: cada raiz real é um ponto comum.
- **Método: fechar a tangência com k** `[6:17:00]`: 5x² − (10 + 4k)x + k² + 2k + 5 = 0; Δ = −4k² + 40k = −4k(k − 10) = 0; k = 0 ou 10; descartar pela condição (k = 0 passa pela origem). Duas raízes em k = duas tangentes paralelas, como o esboço previa. Conferido.
- **Método: ponto de tangência caminhando o raio** `[6:25:01]`: tangente com direção conhecida e centro e raio conhecidos. Passos: o raio até o ponto de tangência é perpendicular à tangente, logo paralelo à reta dada (m = 1/2); o passo (2, 1) mede √5, igual ao raio; do centro (3, −1) chega-se em (5, 0) (ou (1, −2) no sentido oposto); substituir em y = −2x + k para achar k. Por que funciona: raio é perpendicular à tangente. Conferido.
- **Método: distância de ponto a reta** `[6:31:00]`: tangência (distância do centro = raio). Passos: reta em ax + by + c = 0; d = |a·xP + b·yP + c| / √(a² + b²); aqui |5 − k|/√5 = √5, então k = 0 ou 10. Por que funciona: a distância é medida na perpendicular. Ele acha pesado para a Fuvest, mas sempre funciona.
- **Método: módulo como duas distâncias** `[6:35:31]`: |5 − k| = 5 pede os números a 5 unidades de 5: 0 e 10.
- **Método: ângulo reto é lugar geométrico (circunferência)** `[6:41:32]`: ponto P tal que PA ⟂ PB. Passos: os P possíveis ficam na circunferência de diâmetro AB; cruzar com a reta ou curva onde P deve estar. Por que funciona: triângulo retângulo se inscreve em semicircunferência de diâmetro igual à hipotenusa. (A e B ficam fora do lugar válido.)
- **Método analítico para o mesmo** `[6:44:32]`: sem lembrar da geometria plana. Passos: m(PA)·m(PB) = −1, com m = Δy/Δx: [y/(x + 5)]·[y/(x − 5)] = −1, que vira x² + y² = 25. Por que funciona: definição de coeficiente angular mais perpendicularidade.
- **Método: interseção reta com circunferência** `[6:48:30]`: substituir y = x + 1: x² + x − 12 = 0, x = 3 ou −4; pontos (3, 4) e (−4, −3). Conferido.
- **Método: testar terno pitagórico** `[6:49:31]`: x² + (x + 1)² = 25 é cateto, cateto + 1, hipotenusa 5: sai 3-4-5; a segunda raiz é −4. Por que funciona: catetos consecutivos 3 e 4.
- **Método: Δ iguais viram diagonal** `[6:51:30]`: ΔX = ΔY = 7, distância 7√2.
- **Método: reflexão com ponto simétrico** `[6:53:30]` (termina em fuv-13): menor caminho passando por uma reta ou espelho. Passos: refletir o destino B em B'; a distância A–P–B é o segmento AB'. Por que funciona: PB = PB' e a luz segue o menor tempo (princípio de Fermat).

- **Erro que ele avisa** `[6:17:30]`: esquecer o termo cruzado ao elevar (−2x + k) ao quadrado (ele quase erra).
- **Erro que ele avisa** `[6:24:00]`: aceitar as duas raízes sem checar a condição do enunciado.
- **Erro que ele avisa** `[6:55:01]`: menor distância não é sempre menor tempo (muda de meio).
- **Conselho de prova** `[6:19:30]`: a substituição com Δ = 0 é braçal, mas é o procedimento padrão que sempre funciona.
- **Conselho de prova** `[6:19:00]`: Bhaskara às vezes se evita; aqui o Δ não.
- **Conselho de prova** `[6:24:30]`: o esboço já diz qual das duas retas interessa e permite pular o Δ.

- **Questão resolvida** `[6:37:00]`: banca/ano não ditos. A(−5, 0), B(5, 0), câmera na reta y = x + 1, quer PA ⟂ PB; distância entre os dois pontos possíveis. Resposta 7√2, conferida.
- **Questão iniciada** `[6:52:31]`: laser com espelho (resolvida em fuv-13).

- **O que ele desenha**: reta secante, tangente e externa; triângulo 1-2-√5 sobre a reta S para andar o raio; dois pontos no eixo x com vários P formando ângulo reto, depois a semicircunferência e a circunferência inteira; reta y = x + 1 cortando-a; salva-vidas na praia.

### fuv-13-geometria-analitica-parte-3-3.txt

- **Método: caminho de menor tempo** `[6:56:00]`: meios com velocidades diferentes. Passos: andar mais onde é rápido, menos onde é lento; equacionando sai a lei da refração, n1·sen θ1 = n2·sen θ2. Por que funciona: Fermat.
- **Método: mesmo meio, menor tempo = menor distância** `[6:58:30]`: reflexão. Passos: B' simétrico; ligar A a B'; o cruzamento com o espelho é o ponto de reflexão P; a resposta é AB' numa conta só. Por que funciona: t = d/v com v constante; a simetria preserva comprimentos. Dá de brinde ângulo de incidência = ângulo de reflexão `[7:00:31]`.
- **Método: achar o simétrico de um ponto** `[7:03:30]`: Passos: reta S por B perpendicular ao espelho; M = interseção de S com o espelho; M é ponto médio de BB', então B' = 2M − B. Por que funciona: definição de simétrico em relação a uma reta.
- **Método: reta por um ponto** `[7:05:31]`: y = ax + b, substituir o ponto e isolar b.
- **Método: ponto médio** `[7:07:30]`: coordenadas são as médias.
- **Método: andar o mesmo passo para dobrar** `[7:10:01]`: do ponto até M anda-se um Δ; repetir o mesmo Δ a partir de M dá o simétrico (5 → 13/5 → 1/5; 4 → 26/5 → 32/5).
- **Método: reduzir o triângulo antes de Pitágoras** `[7:13:31]`: catetos com fator comum. Passos: 24/5 e 32/5 são (8/5)·(3, 4); hipotenusa (8/5)·5 = 8. Por que funciona: semelhança.

- **Erro que ele avisa** `[7:12:31]`: eles somam 3 + 4 sem elevar ao quadrado e acham 56/5; o certo é √(3² + 4²) = 5, resposta 8.
- **Erro (de sinal) no caminho** `[7:08:32]`: confusão em 26/5 − 5; o certo é xB' = 1/5.
- **Conselho de prova** `[7:15:01]`: "Não vale do pena fazer conta. Não vale, velho. Foge da conta." (sentido: simplificar antes de calcular).
- **Conselho de prova** `[7:05:31]`: a questão junta coeficiente angular, perpendicularidade, distância e física; a Fuvest mistura matemática e física.

- **Questão resolvida** de `[6:52:31]` (em fuv-12) até `[7:14:30]`: banca/ano não ditos. Espelho y = 2x (deduzido das contas), laser de A para B(5, 4); A = (5, 0) deduzido das contas, pois a legenda diz outra coisa ou nada (?). M = (13/5, 26/5), B' = (1/5, 32/5), percurso 8, conferido. Na legenda o b da reta S aparece como 3/2; o certo é 13/2 (y = −x/2 + 13/2).

- **O que ele desenha**: praia com salva-vidas e caminho quebrado; espelho com várias trajetórias possíveis; ponto B' pontilhado como se estivesse dentro do espelho, segmento AB' e a parte real rebatida; reta S perpendicular passando por B, M e B'; triângulo reduzido 3-4-5.

### fuv-14-funcoes-parte-1-3.txt

- **Método: abrir o somatório** `[7:19:30]`: Σ|x − k|, k de 1 a 5: escrever os cinco módulos.
- **Método: módulo é distância** `[7:20:33]`: |x − a| é a distância de x até a. Por que funciona: distância nunca é negativa; |x − 0| é a distância ao zero.
- **Método: existe máximo?** `[7:21:00]`: afastando x, todas as distâncias crescem: não há máximo.
- **Método: mínimo no ponto central (mediana)** `[7:21:30]`: soma de distâncias com quantidade ímpar de pontos: o mínimo é no do meio (x = 3, valor 2+1+0+1+2 = 6). Conferido.
- **Método: mínimo de um único módulo** `[7:25:31]`: é zero, quando o dentro zera.
- **Método: gráfico de |x − a| por distância** `[7:27:01]`: V com ponta em (a, 0), simétrico em x = a, sem parte abaixo do eixo.
- **Método: módulo por definição** `[7:29:30]`: x − 2 se x ≥ 2; −x + 2 se x < 2; desenhar cada reta só no seu trecho. (A legenda troca o sinal da desigualdade.)
- **Método: quadro de sinais para vários módulos** `[7:32:00]`: dividir em intervalos e abrir cada um. Ele não recomenda aqui.
- **Método do barbante** `[7:36:00]`: soma de módulos. Passos: uma estaca em cada raiz; andando, conta quantos barbantes esticam e quantos encurtam; o saldo é a inclinação; mínimo onde o saldo muda de negativo para positivo. Inclinações à direita de 3: +1, +3, +5; simétrico à esquerda. Por que funciona: cada distância varia 1 para 1.
- **Método: quantidade par de pontos dá patamar** `[7:44:03]`: Σ de 1 a 4: entre 2 e 3 os ganhos e perdas se anulam; mínimo constante 4 em [2, 3]. Conferido.
- **Método: ponto de simetria** `[7:41:31]`: achar o centro das estacas e estudar ali (não garante um único mínimo).
- **Método: expoente negativo inverte a base** `[7:48:31]`: 2^(−algo) = (1/2)^algo; deixa o módulo sem sinal.
- **Método: reduzir a função por camadas** `[7:49:30]`: contar as dificuldades (módulo no expoente, módulo externo) e montar de dentro para fora.
- **Método: exponencial com módulo no expoente** `[7:52:01]`: para x ≥ 0 é a exponencial normal; apagar o lado esquerdo e espelhar o direito. Por que funciona: |x| é par, o gráfico herda a simetria.
- **Método: |x − 1| no expoente** `[7:53:31]`: mesmo gráfico deslocado 1 para a direita, simetria em x = 1.

- **Erro que ele avisa** `[7:24:01]`: sem a leitura como distância, abrir módulo a módulo é longo e fácil de errar.
- **Erro que ele avisa** `[7:48:02]`: travar por não saber começar uma função com vários módulos.
- **Conselho de prova** `[7:17:30]`: transformação de gráfico apareceu no simulado oficial.
- **Conselho de prova** `[7:18:30]`: quem não reconhece o somatório já sai em desvantagem.
- **Conselho de prova** `[7:46:30]` / `[7:52:30]`: módulo fora: barbante; módulo no expoente: desenhar metade e refletir.

- **Questão citada** `[7:18:00]`: simulado oficial Fuvest, literal: de f(x) = √x para uma versão com A, B, C, D maiores que 1; identificar as transformações. Não resolvida aqui.
- **Questão resolvida** `[7:19:00]`: banca/ano não ditos. Mínimo de Σ|x − k|, k = 1..5: 6, conferido.
- **Variação resolvida** `[7:42:30]`: k = 1..4: 4 em [2, 3], conferido.
- **Questão iniciada** `[7:46:30]`: intervalos de crescimento de |2^(−|x−1|) − 1/2| (termina em fuv-15).

- **O que ele desenha**: reta numérica com distâncias; V de |x − 2| com pontilhada no eixo de simetria; as duas retas prolongadas com o trecho inválido; estacas com barbantes; gráfico em trechos com patamar; exponencial com ramo esquerdo apagado e espelhado.

### fuv-15-funcoes-parte-2-3.txt

- **Método: base entre 0 e 1** `[7:56:00]`: exponencial decrescente; (1/2)^|x| é o ramo direito espelhado, máximo 1.
- **Método: deslocamento horizontal** `[7:57:31]`: (1/2)^|x − 1|: máximo em x = 1, assíntota y = 0.
- **Método: deslocamento vertical** `[7:59:00]`: − 1/2 desce tudo, inclusive a assíntota (y = −1/2); máximo passa a 1/2 e o gráfico passa pela origem.
- **Método: marcar ponto de controle** `[8:00:30]`: testar x = 0 para travar o desenho.
- **Método: módulo da função inteira** `[8:02:30]`: parte positiva fica; parte negativa reflete para cima no eixo x (assíntota vira y = 1/2). Vale para qualquer função (exemplo |x² − 4|).
- **Método: módulo de módulo** `[8:06:30]`: módulo sobre algo já não negativo não muda nada.
- **Método: ler os intervalos no gráfico** `[8:06:00]`: achar as raízes (x = 0 e 2) e o pico (x = 1). Crescente em (0, 1) e depois de 2. Conferido.
- **Método: papel de A, B, C, D em A + B·f(Cx + D)** `[8:10:02]`: A sobe (positivo) ou desce; B estica ou comprime na vertical e, negativo, inverte; C comprime (|C| > 1) ou estica na horizontal; D desloca na horizontal. Regra: "Sempre que tá multiplicando ou dividindo, é esticando ou comprimindo." `[8:10:31]`; somar e subtrair desloca.
- **Método: dentro é contrário à intuição** `[8:11:30]`: C maior comprime; D positivo vai para a esquerda; fora da função é como parece.
- **Método: parábola refletida** `[8:18:30]`: −(x² − 4) = 4 − x², concavidade para baixo, máximo 4 porque subtrai um quadrado.
- **Método: julgar sinais pelo gráfico** `[8:15:30]`: comparar f e g: desceu ou subiu, invertida ou não, mais estreita ou larga, andou para onde.
- **Método: C pela distância entre pontos correspondentes** `[8:21:00]`: pontos de g vindos das raízes de f distam 2; as raízes distam 4; |C| = 2 (C > 0 pelo contexto). Por que funciona: só C altera distâncias horizontais.
- **Método: igualdade de polinômios** `[8:23:03]`: calcular f(2x + D), montar A + B·[(2x + D)² − 4] e igualar a g coeficiente a coeficiente: x², depois x, depois constante.
- **Método: deslocamento real é D/C** `[8:32:30]`: colocar C em evidência: Cx + D = C(x + D/C). "o que desloca para a direita ou paraa esquerda é o que está subtraído do X" `[8:33:03]`.
- **Método: achar onde o argumento repete o valor** `[8:34:01]`: ver em que x o dentro dá o mesmo valor (raiz de x zerava em 0; raiz de 2x − 2 zera em 1: andou 1, não 2).

- **Erro que ele avisa** `[8:17:31]`: confundir B negativo (inverte) com B entre 0 e 1 (comprime).
- **Erro que ele avisa** `[8:20:01]`: achar que C > 1 estica; comprime.
- **Erro que ele avisa** `[8:31:00]`: com D = −6 e C = 2 responder 6 para a direita; são 3.
- **Conselho de prova** `[8:14:30]`: questão conceitual é mais difícil que a numérica; treinar a versão literal.
- **Conselho de prova** `[8:35:32]`: rever essa resolução de transformações; ele diz que cai nesse nível.

- **Questão resolvida** `[7:59:00]` (início em fuv-14): crescimento de |2^(−|x−1|) − 1/2|: (0, 1) e (2, +∞), conferido.
- **Questão resolvida** `[8:08:00]`: banca/ano não ditos; ele compara com o simulado Fuvest (versão literal). f(x) = x² − 4, g(x) = −4x² + 24x − 31 = A + B·f(Cx + D). A = 1, B = −1, C = 2, D = −6, conferido. (C = −2 com D = 6 daria a mesma g; usa-se C > 0.)
- **Exemplo em dúvida** `[8:35:00]`: o caso final de raiz com deslocamento de "três unidades" não fecha pela legenda (?).

- **O que ele desenha**: exponencial decrescente, espelhada, deslocada, com pontilhada da assíntota e depois refletida pelo módulo; parábola com a barriga virada para cima; gráfico genérico f e sua versão deslocada e comprimida; as duas raízes de f e os pontos correspondentes em g.

### fuv-16-funcoes-parte-3-3.txt

- **Método: função inversa** `[8:38:30]`: inversa desfaz a função. Passos: trocar x por y e isolar o novo y. Teste: f(3) = 7 e a inversa leva 7 a 3 (exemplo 2x + 1, inversa (x − 1)/2).
- **Método: inversa com exponencial** `[8:41:30]`: trocar e^(−y) por 1/e^y; multiplicar em cima e embaixo por e^y (ou dividir frações multiplicando pelo inverso); obter x = (e^(2y) − 1)/(e^(2y) + 1).
- **Método: juntar o que tem y de um lado** `[8:44:00]`: multiplicar cruzado, distribuir, passar os termos e fatorar: e^(2y)·(1 − x) = 1 + x.
- **Método: tirar o quadrado** `[8:45:31]`: e^y = √((1 + x)/(1 − x)), só a raiz positiva porque e^y > 0.
- **Método: ln quando precisar de y** `[8:46:00]`: y = ln √((1 + x)/(1 − x)).
- **Método: substituir u** `[8:43:30]`: dar nome a e^y se ajudar; ele acha dispensável.
- **Método: composta troca a variável inteira** `[8:47:30]`: g(qualquer coisa) = e^(coisa).
- **Método: olhar a composta antes de terminar a inversa** `[8:47:00]`: se g = e^x, h = g(f⁻¹(x)) = e^(f⁻¹(x)): parar em e^y, sem tirar ln.

- **Erro que ele avisa** `[8:44:00]`: esquecer o objetivo (juntar y de um lado, x do outro).
- **Erro que ele avisa** `[8:47:30]` / `[8:48:31]`: achar que a regra de f só vale para a letra x.
- **Erro que ele avisa** `[8:50:00]`: fazer um passo (ln) para depois desfazer.
- **Conselho de prova** `[8:36:32]`: função inversa já caiu na Fuvest antiga e pode voltar.
- **Conselho de prova** `[8:51:31]`: voltar e rever o bloco de modular, inversa e deslocamento algumas vezes.

- **Questão resolvida** `[8:36:32]`: banca/ano não ditos. f(x) = (e^x − e^(−x))/(e^x + e^(−x)) (denominador deduzido das contas), g(x) = e^x, h = g∘f⁻¹; h(1/2) = √3, conferido (vale para −1 < x < 1).

- **O que ele desenha**: nenhuma figura descrita; só a conta em linha.

## Cobertura

| Capítulo | Palavras (`wc -w`) | Li inteiro | Nº de métodos |
|---|---|---|---|
| fuv-11-geometria-analitica-parte-1-3 | 8095 | sim | 11 |
| fuv-12-geometria-analitica-parte-2-3 | 7559 | sim | 11 |
| fuv-13-geometria-analitica-parte-3-3 | 3985 | sim | 7 |
| fuv-14-funcoes-parte-1-3 | 8574 | sim | 15 |
| fuv-15-funcoes-parte-2-3 | 7729 | sim | 15 |
| fuv-16-funcoes-parte-3-3 | 3206 | sim | 8 |

Total: 67 métodos.
