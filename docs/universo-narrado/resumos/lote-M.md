## fis-12 Circuitos elétricos

**Gancho:** "vamos desenrolar esse trem então já começando por uma questãozinha" [10:29:01]. Voltímetro num circuito de três resistores; se todas dobram, qual a variação da tensão marcada? Resposta só no fim [11:17:30].

**Ordem das etapas**
1. Questão de abertura [10:29:01]
2. Primeira lei de Ohm, U = R·I, só para resistor ôhmico [10:29:33]–[10:32:30]
3. Série: mesma corrente, tensão se divide, resistências somam [10:34:00]–[10:36:01]
4. Exemplo: 10 V, 2 Ω + 3 Ω [10:37:00]–[10:40:31]
5. Paralelo: mesma tensão, corrente se divide, lei dos nós [10:41:30]–[10:43:02]
6. Equivalente de paralelo: produto pela soma [10:46:00]–[10:47:02]
7. Lâmpadas em paralelo, como a casa funciona [10:52:00]–[11:02:30]
8. Amperímetro (série) e voltímetro (paralelo) [11:03:32]–[11:11:30]
9. Volta à questão [11:12:02]–[11:17:30]

**Analogias e frases marcantes**
- "o circuito externo não sente diferença" [10:35:00]: é a resistência equivalente.
- "Isso aqui é a lei da conservação de energia" [10:40:01]: 4 V + 6 V = 10 V.

**De onde vem a fórmula**
- Série: corrente igual, tensão se divide (4 V + 6 V = 10 V), R_eq = R1 + R2.
- Paralelo: tensão igual, corrente inversamente proporcional à resistência. Com 10 A no total, o ramo de 3 Ω leva 2X e o de 6 Ω leva X: 2X + X = 10, X = 10/3 A [10:42:30]–[10:50:00]. Daí o "produto pela soma".

**Pegadinhas e dicas**
- Dois iguais em paralelo dão metade; três iguais, um terço [10:53:00]–[10:56:00].
- Em paralelo, cada aparelho funciona sozinho, mas a bateria precisa de mais corrente, o que esquenta o fio [10:59:30]–[11:02:01].
- Amperímetro: em série, resistência ideal zero. Voltímetro: em paralelo, resistência ideal infinita [11:11:02].

**Questões que ele resolve**
- Voltímetro, três resistores, todas dobram: variação 0 V (4 V antes e 4 V depois). Jeito: R dobra, I cai à metade, U = R·I no voltímetro fica igual [11:17:30].
- 10 V, 2 Ω em série com 3 Ω: I = 2 A; quedas de 4 V e 6 V [10:37:00]–[10:40:01].
- 20 V, 3 Ω em paralelo com 6 Ω: R_eq = 2 Ω, corrente total 10 A [10:47:02].
- Duas lâmpadas de 6 Ω em paralelo, 12 V: 4 A no total. Com a terceira, 6 A; cada uma continua com 2 A [10:54:01]–[10:58:32].

**Quadro**
- [10:42:30]: nó com ramos X e Y somando I.
- [10:52:00]: duas lâmpadas em paralelo ligadas a 12 V.
- [11:08:01]: voltímetro em paralelo com um resistor.

## fis-13 Potência elétrica e efeito Joule

**Gancho:** "quase todo ano tem uma questãozinha" [11:18:30]. Abre com um chuveiro de 3.600 W e 12 A no modo quente, em série com 600 Ω numa fonte de 90 V: qual a potência no chuveiro? [11:19:01]–[11:19:30]

**Ordem das etapas**
1. Questão do chuveiro [11:19:01]
2. Corrente = carga por tempo [11:20:01]–[11:23:30]
3. Volt = joule por coulomb; a carga perde energia no aparelho [11:24:00]–[11:30:01]
4. P = i·U, vale para qualquer aparelho [11:31:02]–[11:34:30]
5. Efeito Joule: o resistor converte energia elétrica em térmica [11:35:31]–[11:37:32]
6. Trocando U por R·i: P = R·i² e P = U²/R [11:38:30]–[11:39:30]
7. Qual fórmula usar, em série ou em paralelo [11:43:30]–[11:48:01]
8. Chuveiro: tensão da tomada fixa; menor resistência é a posição mais quente [11:48:30]–[11:55:02]
9. Resolução da questão [11:56:01]–[12:01:00]

**Analogias e frases marcantes**
- "Esquentar, meu irmão... é a função de vida de um resistor" [11:36:03].
- "Não tem certo e errado" [11:46:30]: depende de qual equação escolher.
- "Aquela resistência fica debaixo da água mesmo" [11:55:30]: é o chuveiro.

**De onde vem a fórmula**
1. i = Q/Δt (coulomb por segundo = ampère).
2. Energia perdida pela carga: ΔE = Q·U.
3. P = ΔE/Δt = i·U.
4. Resistor: U = R·i. Substituindo: P = R·i².
5. Com i = U/R: P = U²/R.

**Pegadinhas e dicas**
- P = R·i² e P = U²/R valem só para resistor. P = i·U vale para tudo [11:34:30]–[11:37:01].
- Série: corrente igual, então maior R dá maior P. Paralelo: tensão igual, então maior R dá menor P [11:44:00]–[11:47:31].
- Na tomada a tensão não muda. Trocar a posição do chuveiro muda só a resistência [11:52:00]–[11:54:00].

**Questão que ele resolve (chuveiro)**
- Resistência do chuveiro: R = P/i² = 3.600/12² = 25 Ω [11:57:31]–[11:58:30].
- ? Conflito: o enunciado diz 600 Ω [11:19:30]; a resolução usa 300 Ω [11:59:00]. Com 300 Ω: I = 90/325 ≈ 0,277 A e P ≈ 1,92 W (ele arredondou I para 0,27 e chegou a 1,82 W). Com 600 Ω: R_total = 625 Ω, I ≈ 0,144 A, P ≈ 0,52 W. Conferir antes de usar.

**Quadro**
- [11:44:31]: dois resistores em paralelo (2 Ω e 5 Ω) ligados a 12 V.
- [11:49:00]: chave S com três posições, cada uma adiciona resistência em série.
- [11:53:01]: fiação desenhada até a tomada.

## fis-14 Magnetismo e fontes de campo magnético

**Gancho:** "uma questãozinha até meio difícil" [12:01:30]. Espira circular percorrida por corrente entra num campo uniforme: em qual posição ela para? [12:01:30]–[12:02:31]

**Ordem das etapas**
1. Questão da espira [12:01:30]
2. Ímã: linhas saem do norte e entram no sul, sem origem [12:03:02]–[12:06:30]
3. Bússola se alinha ao campo; B é tangente à linha [12:07:01]–[12:09:31]
4. Oersted: corrente cria campo magnético [12:10:01]–[12:13:00]
5. Fio retilíneo: circunferências e regra da mão direita [12:13:30]–[12:16:03]
6. Vista de cima: corrente vindo ao olho é um ponto [12:16:30]–[12:18:30]
7. Fórmula do fio [12:19:01]–[12:21:01]
8. Espira: campo parecido com ímã; fórmula no centro [12:21:31]–[12:27:30]
9. Espira como agulha; volta à questão [12:28:01]–[12:34:01]

**Analogias e frases marcantes**
- "Uma espirazinha... gera um campo muito parecido com um ímã" [12:28:31].
- "O mais importante... você tinha que entender qualitativamente" [12:20:30]: a prova cobra o sentido, não o cálculo.

**De onde vem a fórmula**
- Corrente gera campo: regra da mão direita (dedão na corrente, dedos abraçam o fio).
- Fio retilíneo: B = μ0·i/(2π·r). Cresce com a corrente e cai com a distância.
- Espira, no centro: B = μ0·i/(2r). O raio é a distância de todo o fio ao centro.

**Pegadinhas e dicas**
- Linhas do campo magnético não têm começo nem fim. Campo elétrico tem origem numa carga [12:04:01].
- B é tangente à linha, não aponta para o fio.
- É regra da mão direita, não da esquerda [12:14:30].
- Espira = ímã: o eixo norte-sul se alinha com o campo externo, como uma bússola [12:28:31]–[12:32:01].
- Ele diz que a questão caiu "dois anos atrás no Enem" [12:13:00]: ? não confirmado.

**Questão que ele resolve**
- Espira em campo uniforme: letra B, com o campo da espira alinhado ao campo externo [12:32:01]–[12:33:01]. Jeito: a espira vira um ímã e se alinha como bússola. ? As alternativas completas não estão na legenda.

**Quadro**
- [12:03:30]: ímã com as linhas saindo do norte e entrando no sul.
- [12:16:03]: fio retilíneo com circunferências concêntricas.
- [12:31:30]: espira com corrente e campo externo, a própria questão.

## fis-15 Indução eletromagnética

**Gancho:** "o fenômeno que justifica por que você aperta um botão ali na parede da sua casa e, puf, acende luz" [12:35:00]. Logo depois, a questão: duas espiras giram num campo magnético constante [12:35:31].

**Ordem das etapas**
1. Gancho do botão e questão [12:35:00]–[12:35:31]
2. Fluxo, com analogia de água [12:36:31]–[12:38:32]
3. Fluxo depende da componente perpendicular e da área [12:38:32]–[12:45:30]
4. Ímã aproximado da espira: corrente sem bateria [12:46:31]–[12:48:30]
5. Variação do fluxo gera ddp, campo elétrico e corrente induzida [12:49:31]–[12:51:30]
6. Onda eletromagnética, de passagem [12:51:30]–[12:53:00]
7. Lei de Lenz: sentido da corrente [12:53:30]–[12:57:31]
8. Lei de Faraday, com exemplo numérico [12:59:31]–[13:03:00]
9. Volta à questão, girando a espira [13:04:00]–[13:13:30]
10. Hidrelétrica como fonte de energia [13:13:30]–[13:14:30]

**Analogias e frases marcantes**
- Fluxo como "linhas de corrente de água escoando através desta superfície" [12:37:02].
- "O que importa não é o fluxo, e sim... a variação" [12:50:30].
- Lenz: "a natureza querendo buscar um equilíbrio" [12:54:31].

**De onde vem a fórmula**
1. Fluxo: Φ = B⊥·A. Só a componente perpendicular à superfície conta [12:40:31]–[12:45:02].
2. Força eletromotriz induzida: ε = variação de Φ por tempo [13:00:00].
3. Corrente: i = ε/R, como se houvesse uma bateria [13:02:02].
4. Lenz: a corrente gira para criar um campo que se opõe à variação do fluxo [12:57:00].

**Pegadinhas e dicas**
- Campo forte paralelo à espira: fluxo zero, corrente zero [12:45:02] e [13:08:00].
- Fluxo alto não gera corrente. Quem gera é a variação [12:50:30].
- Lenz se opõe à variação do fluxo, não ao fluxo em si [12:57:00].
- Corrente alternada: troca de sentido quando o fluxo passa de subir para descer [13:11:30].

**Questões que ele resolve**
- Duas espiras girando (12:35:31): letra B, corrente alternada na espira cujo fluxo sobe e desce. A que tem fluxo zero o tempo todo tem corrente nula. ? A legenda não diz claramente qual espira é qual, e as alternativas não aparecem completas.
- Faraday (13:01:02): fluxo vai de 10 Wb para 18 Wb em 2 s, R = 4 Ω. ε = 8/2 = 4 V; i = 4/4 = 1 A. O sentido sai da lei de Lenz.

**Quadro**
- [12:38:32]: três superfícies de mesma área com o campo em orientações diferentes.
- [12:41:01]: campo decomposto em componente perpendicular (gera fluxo) e paralela (não gera).
- [13:10:31]: gráfico do fluxo pelo ângulo de rotação.

## fis-16 Som, acústica e efeito Doppler

**Gancho:** "uma questão zinha extra... eu vou deixar a questão para daqui a pouco" [13:15:00]. No fim: Alfredo, Bartolomeu e uma ambulância de 120 Hz na BR 381 [13:39:31].

**Ordem das etapas**
1. Gancho: questão guardada para o fim [13:15:00]
2. Som: onda mecânica longitudinal, precisa de meio [13:15:30]
3. Três qualidades: altura (frequência), intensidade (energia) e timbre (forma) [13:16:00]–[13:22:02]
4. Eco: som direto e refletido, com intervalo mínimo de 0,1 s [13:22:30]–[13:26:02]
5. Ecolocalização do morcego [13:27:00]–[13:28:30]
6. Efeito Doppler: definição [13:29:04]
7. Fonte parada: frentes circulares, mesmo comprimento de onda [13:29:31]–[13:30:30]
8. Fonte em movimento: frentes se juntam na frente e se afastam atrás [13:31:01]–[13:33:30]
9. A velocidade do som não muda, então a frequência muda [13:34:32]–[13:36:31]
10. Aproximação: frequência maior. Afastamento: frequência menor [13:37:01]–[13:38:31]
11. Resolve a questão pelo gráfico [13:39:31]–[13:52:30]

**Analogias e frases marcantes**
- Timbre como "impressão digital" da onda [13:19:01].
- "Corpos que compartilham de um mesmo movimento estão em repouso em relação ao outro" [13:47:31].

**De onde vem a fórmula**
1. v = λ·f. No mesmo meio, a velocidade é fixa [13:20:31]–[13:21:00].
2. Fonte parada: λ fixo, então a frequência percebida é a real.
3. Fonte se movendo: λ encurta à frente e alonga atrás. Como v não muda, f = v/λ muda.
4. Eco: ida e volta, 2d = v·t, logo d = v·t/2 [13:25:01].

**Pegadinhas e dicas**
- Na física, "som alto" é som agudo, frequência alta. Volume é intensidade [13:16:00]–[13:18:32].
- Eco só se o intervalo entre os dois sons for de pelo menos 0,1 s. Num quarto pequeno não há eco [13:24:00].
- Não precisa decorar os valores; a prova dá [13:25:31].
- Se A se aproxima de B, B se aproxima de A. O referencial não muda isso [13:50:30].

**Questões que ele resolve**
- Eco: distância mínima para ouvir eco, t = 0,1 s, v = 340 m/s: d = 340 × 0,1 / 2 = 17 m [13:26:02].
- Doppler (Alfredo, Bartolomeu, 120 Hz): letra E, "o Alfredo se aproxima da ambulância em algum momento" [13:49:30]. Ele falou "afasta" e corrigiu na hora. A ambulância se afasta sempre de Bartolomeu, com frequência menor que 120 Hz [13:42:00]. ? As alternativas não estão na legenda.

**Quadro**
- [13:30:30]: ambulância parada, com frentes de onda circulares.
- [13:31:01]: ambulância em movimento, com frentes empilhadas à frente.
- [13:40:30]: gráfico das frequências percebidas por Alfredo e Bartolomeu.
