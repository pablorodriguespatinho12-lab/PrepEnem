# Leitura do aluno-do-zero, rodada 2: Física cin / din / ter (12 questões)

Data: 24/11/2026. Lido: enunciado, alternativas, explicação inteira (ideia, peças, passos com figuras, checagem) e as aulas "Antes" ligadas em `data/revisao-final/antes-da-questao.json`. O que a Antes ensina não foi contado como tropeço. Figuras conferidas em `components/visual/diagramas-acima-fisica-a.tsx`.

## Resultado

- Contas: 12 de 12 gabaritos refeitos por script e certos. As 48 explicações de erro das alternativas também batem (ex.: din-00c 0,62 / 0,71 / 0,85 / 1,12; ter-00a 1,00 / 38,40 / 48,00 / 150,00; cin-00d 4 / 5 / 8 / 20). Meta da rodada (0 conta errada): atingida.
- Bugs de fato de conta, gabarito ou dado: 0.
- Defeito de texto (não é conta): 3 ideias com pontuação quebrada (cin-00c, ter-00b, ter-00d) e 1 frase repetida (din-00d).
- Tropeços novos ou que continuam: 22 em 12 questões (todos de detalhe). Limpas: cin-00c e ter-00b (só o defeito de texto).
- Figura ausente onde a geometria exige: nenhuma. Figuras existem em cin-00b, cin-00c, din-00b, din-00c, din-00d, ter-00b, ter-00d. Faltam rótulos em 2 (cin-00b: o 15 m; din-00b: o 4 m, que a Antes dá).
- Tipo que mais se repete: conta com vírgula ou passo de álgebra sem o porquê (tipos 18 e 19: 6 vezes), depois número ou letra que aparece antes de nascer (tipos 10 e 16: 6 vezes).

| Questão | Tropeços | Bug de fato |
|---|---|---|
| cin-00a | 2 | não |
| cin-00b | 2 | não |
| cin-00c | 0 | só texto |
| cin-00d | 3 | não |
| din-00a | 1 | não |
| din-00b | 2 | não |
| din-00c | 2 | não |
| din-00d | 4 | só texto |
| ter-00a | 3 | não |
| ter-00b | 0 | só texto |
| ter-00c | 1 | não |
| ter-00d | 2 | só texto |

---

## d2-escada-fis-ita-cin-00a (radar de trecho) — 2 tropeços

Conta refeita: 12 km a 90 km/h = 8 min; gastou 3; 6 km em 5 min = 72 km/h. Distratores 45, 60, 90, 144 conferem.

1. [Passo 2, tabela] "Não entram na conta: 30 km da rodovia, km 100, limite de caminhões" -> por que o 30 km e o km 100 não entram? (tipo 5; a tabela diz que não entram, não diz por quê.)
2. [Conferência, alternativa C] "Fez a média aritmética das velocidades: 2 · 90 − 120" -> de onde vem "2 · 90 − 120"? e "média aritmética" é palavra que a Antes não tem (tipos 10 e 1).

Figura: não há desenho da estrada com os 3 pórticos; a geometria é uma reta e a tabela do enunciado cobre. Não é falta.

## d2-escada-fis-ita-cin-00b (esfera e canhão) — 2 tropeços

Conta refeita: 8² + 15² = 289, dr = 17 m, queda de 20 m = 2 s, 17 ÷ 2 = 8,5. Distratores 4, 7,5, 11,5, 17 conferem. Checagem (45 m, 24 m, 51 m, 17 m/s) correta.

1. [Passo 5, figura] "20 − 5 = 15 m ... Os dois formam um canto reto" -> a figura só marca 20 m, 5 m, 8 m e "17 m em linha reta"; o 15 m não está desenhado nem o canto reto, e "os dois" não diz quais lados (tipo 3; equação de lado sem o lado marcado na figura).
2. [Passo 1] "dr² = lado1² + lado2²" -> como leio o "²"? A Antes de Pitágoras escreve "diagonal · diagonal" (tipo 12).

## d2-escada-fis-ita-cin-00c (Ana e Bia) — 0 tropeços, 1 defeito de texto

Conta refeita: a = 0,5; chega a 5 m/s em 10 s; 25 m + 50 m = 75 m aos 20 s; 925 ÷ 10 = 92,5 s; 75 + 5 · 92,5 = 537,5 m. Distratores 462,5, 500, 525, 550 conferem. A curva do gráfico (0,5x até 10 s, depois 5) bate com a tabela.

Defeito de texto: [Ideia] "...a 5 m/s. quando Bia sai (20 s)... das duas; A tabela mostra..." (minúscula depois do ponto e ";" seguido de maiúscula).

Limpa quanto ao aluno.

## d2-escada-fis-ita-cin-00d (carrinho, soma em degraus) — 3 tropeços

Conta refeita por busca em todos os divisores de 240: servem seg = 3, 5 e 15 (v1 = 41, 26, 15); 8 casos de paridade certa; 20 divisores. Tabela do passo 7 confere nas 8 linhas. Checagem (12 m = 1) correta. Distratores 4, 5, 8, 20 conferem.

1. [Passo 5] "240 = 16 · 15. Os divisores de 15 são 1, 3, 5, 15. O 16 inteiro fica num só deles" -> de onde sai "16 · 15"? e por que o 16 não pode ser repartido, como 4 · 60? (tipos 10 e 18; a Antes de par e ímpar não diz que o número ímpar não tem fator 2 e por isso o 16 inteiro vai para o outro.)
2. [Passo 4] "seg = 3 e v1 = 41 (41 + 40 + 39)" -> o 41 aparece aqui antes de v1 ser achado (só no passo 7) (tipo 10).
3. [Passo 7] "v1 = (pu + seg − 1) ÷ 2" -> como isolei o v1 de "pu = 2 · v1 − seg + 1"? Tem teste com número, mas não diz as duas operações desfeitas (tipo 18).

## d2-escada-fis-ita-din-00a (balança no elevador) — 1 tropeço

Conta refeita: 21,6 km/h = 6 m/s; a = +2 e −3; leituras 72, 60, 42 kg; 72 − 42 = 30. Distratores 12, 26, 108, 300 conferem (108 = 103,2 + 4,8).

1. [Passo 3] "empurrão = massa · (10 + aceleração)" -> a Antes mostra 600 + 120 = 720, não 60 · (10 + 2). Falta o teste com número que ligue as duas escritas (tipo 18).

## d2-escada-fis-ita-din-00b (rampa com atrito) — 2 tropeços

Conta refeita: a de subida 9,6; dis 7,5 m; desce (12 N > 7,2 N); a de descida 2,4; v · v = 36; v = 6. Distratores 0, 7,59, 9,49, 12 conferem.

1. [Passo 5] "Atrito: 0,45 · 16 = 7,2 N (45 · 16 = 720, 2 casas)" -> "2 casas" de quê? (tipo 19; contar as casas depois da vírgula não foi ensinado.)
2. [Conferência passo 8] "6 ÷ 2,4 = 2,5 s" -> dividir por número com vírgula sem passo (tipo 19; a Antes dividir-por-decimal não está ligada a esta questão).

Figura: marca 5 m, 3 m, 12 m/s e as forças; o lado de baixo (4 m) só existe na Antes. Não falta para esta conta.

## d2-escada-fis-ita-din-00c (bloco sobre prancha) — 2 tropeços

Conta refeita: juntos 30 ÷ 5 = 6 N pedidos, máximo 4 N, escorrega; bl = 4; pr = 6,5; rel = 2,5; tem² = 1; tem = 1 s. Distratores 0,62, 0,71, 0,85, 1,12 conferem (a ordem das alternativas é D = 1,1 e E = 1,0, certa).

1. [Passo 4] "tem · tem = 2 · cmp ÷ rel" -> tem, cmp e rel aparecem aqui, e só são definidos no passo 6 (tipo 16).
2. [Passos 4 e 12] "tem · tem" -> "tem" lê-se como o verbo "tem" ("tem vezes tem") (tipo 8; palavra comum no lugar de letra).

## d2-escada-fis-ita-din-00d (pêndulo com pino) — 4 tropeços e 1 defeito de texto

Conta refeita: raio 0,2 L; queda 0,6 L; vv = 12 L; tração = 24 L ÷ 0,2 L − 20 = 100 N. Distratores 10 (raio 0,8 L), 60, 120, 140 conferem.

1. [Passos 3 e 4] "tra = 2 · vv ÷ rai − 20" -> tra, vv e rai são usados antes de a equação em letras do passo 6 defini-los (tipo 16).
2. [Passo 4] "4/5 de L e 0,2 L ainda têm o L dentro" -> o 0,2 L nasce aqui, e só no passo 7 se acha (tipo 10).
3. [Conferência, alternativas C e conferência final] "3 · m · g" e "5 · m · g" -> de onde vem o 3 e o 5? Nenhuma tela mostra a cadeia (tipo 10).
4. [Passo 8] "vv = 12 L é maior que 10 · rai = 2 L: sim" -> a Antes diz "força da curva pelo menos o peso"; falta a conta que leva a "vv maior que 10 · rai" (tipo 19).

Defeito de texto: a frase "vamos deixar L na conta e ver se ele some" aparece no passo 4 e de novo no passo 6.

## d2-escada-fis-ita-ter-00a (aquecedor a gás) — 3 tropeços

Conta refeita: mistura x = 20 L quentes; 20 · 4,2 · 50 = 4 200 kJ = 4,2 MJ; 4,2 ÷ 0,8 = 5,25 MJ = 0,125 kg; 60 · 0,125 · 8 = R$ 60,00. Distratores 1,00, 38,40, 48,00, 150,00 conferem.

1. [Passo 8] "20 · 4,2 = 84; depois 84 · 50 = 4 200" -> conta com vírgula sem passo (tipo 19).
2. [Passo 10] "Como 5,25 = 42 ÷ 8, gas = (42 ÷ 8) ÷ 42 = 1 ÷ 8" -> por que dividir por 42 uma coisa que já é 42 ÷ 8 dá 1 ÷ 8? (tipo 19; é atalho sem o porquê.)
3. [Passos 6 e 7] "A quente esfria de 70 °C a 40 °C" -> "quente" é nome de letra e palavra comum ao mesmo tempo; "A quente" lê-se como adjetivo sem substantivo (tipo 8).

## d2-escada-fis-ita-ter-00b (diagrama p × V) — 0 tropeços, 1 defeito de texto

Conta refeita: volB = 3 L; trabalho 400 J; U de A = 450 J, U de C = 1 350 J; aumento 900 J; calor 1 300 J. Distratores 400, 900, 1 500, 1 750 conferem. Figura completa (A, B, C, eixos, área, 400 J).

Defeito de texto: [Ideia] "...o volume de B. de B a C não há trabalho... p · V; O calor é o trabalho..." (minúscula depois do ponto e maiúscula depois de ";").

Limpa quanto ao aluno. Os estados A, B, C do gás têm o nome das alternativas, mas as alternativas são escritas "alternativa A" por extenso; pela regra do tipo 17 está certo.

## d2-escada-fis-ita-ter-00c (gelo, água e resistência) — 1 tropeço

Conta refeita: gelo pede 1 000 cal, água cede 9 000, sobram 8 000, derretem 100 g; depois 8 000 + 10 000 = 18 000 cal = 72 000 J; ÷ 720 W = 100 s. Distratores 55,6 (56), 64, 80, 144 conferem.

1. [Passo 7] "Aquecer 500 g de água (400 + 100)" -> o 100 do "400 + 100" é o gelo derretido agora, mas o texto acabou de dizer "100 g de gelo" (tipo 10/14; falta dizer que ao fundir esses 100 g viram água).

## d2-escada-fis-ita-ter-00d (escada de barras) — 2 tropeços e 1 defeito de texto

Conta refeita: rhor = 25, rvert = 50 K/W; rede = 25 + 50 · rede ÷ (50 + rede) dá rede = 50; frac = 1/2; temperaturas 50, 25, 12,5 °C; 12,5 ÷ 50 = 0,25 W; soma das verticais 1 + 0,5 + 0,25 + ... tende a 2 W = 100 ÷ 50. Distratores 0,5, 2,0, 12,5, 2 500 conferem. Figura da escada presente (barras, nós 1 a 3, temperaturas).

1. [Passos 7 e 8] "Multiplico os dois lados por (50 + rede)" e "Passo 25 · rede para o outro lado" -> para quê? e por que o sinal muda? (tipo 18; a aula Antes desta questão não inclui a de equação da mistura, onde "somar o mesmo nos dois lados" é ensinado.)
2. [Passo 10] "A queda de temperatura é proporcional à resistência: rhor tem 25 de 50, a metade, e o nó fica com a outra metade" -> regra sem a conta com número (fluxo total 2 W, queda na rhor 2 · 25 = 50 °C, nó a 100 − 50 = 50 °C) (tipo 7; os 2 W só aparecem na conferência final).

Defeito de texto: [Ideia] "...a mesma resistência. isso dá uma equação para ela; com ela..." (minúscula depois do ponto).

---

## O que mais se repete

Tipo 18 e 19 (passo de álgebra ou conta com vírgula sem o porquê): 6 vezes. Tipos 10 e 16 (número ou letra antes de nascer): 6 vezes. Os 3 defeitos de pontuação nas ideias (cin-00c, ter-00b, ter-00d) vêm do mesmo gerador, que junta frases sem ajustar a maiúscula.
