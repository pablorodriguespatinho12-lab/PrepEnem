# Universo Narrado x PrepEnem: o que mudar

Esforço: P = até 3 arquivos, M = 1 aula nova ou 1 banco, G = 3+ aulas. Peso no ENEM: `data/revisao-final/o-que-mais-cai.json` (2009–2023). "?" = palpite meu.

## Top 10 mudanças

1. **Aula de Combinatória + Probabilidade** (9,5% das questões; hoje não há aula, só 8 questões): árvore, "casa mais restrita", problema do Iago. G
2. **Porcentagem como fator** (19%): aula Descobrir com 1,2 e 0,8 na equação, abrindo pelo Jeremias. M
3. **Direta e inversa por razão/produto constante**, com gráfico (reta × hipérbole) e escala² e ³ (Grandezas, 12%). M
4. **Parábola sem decorar** (Funções, 10,8%): graveto de 1 m, raízes, vértice no meio, 25 × 25. M
5. **Circuitos: de onde vem P = U × i** e série × paralelo com conta (5,6%). M
6. **Calorimetria por etapas** e "área do gráfico = energia" (5,5%). M
7. **Banco de Física (dinâmica, termo, eletricidade, óptica, ondas)**: trocar o plugue de fórmula e o "Jeito rápido" por pergunta conceitual do canal e "de onde vem". G
8. **Óptica: espelho côncavo em 4 posições**, tabela "é o ouro" [7:41:00] (3,1%). M
9. **Média: soma escondida e média harmônica** (72 km/h) (Estatística, 11,1%). P
10. **Energia ligada ao Torricelli** (P) e **Hidrostática** (Stevin do bloquinho de água) (2,3% + 2,0%, hoje sem aula). P e G

## 1. Mapa de temas (nos dois lados)

| Tema | Onde no site | Jeito bate? |
|---|---|---|
| Frações, decimais | `dia-2/aulas.json` (Aritmética), `antes-da-questao.json` (dividir-por-decimal) | PARCIAL |
| MMC e MDC | só cita em `dicas.json`; sem aula | NÃO |
| Porcentagem | `dia-2/aulas.json` (Aritmética), conceito `porcentagem` | PARCIAL |
| Regra de três, proporção | `dia-2/aulas.json` (Grandezas) | PARCIAL |
| Escalas | mesma aula, 1 linha | NÃO |
| Função afim | `data/descobrir/aulas/funcao-afim.tsx` | SIM |
| Função 2º grau | `dia-2/aulas.json` (Funções), `calculo/licoes/p4-quadratica.ts` | NÃO |
| Exponencial | `calculo/licoes/p7-exponencial.ts` | PARCIAL (Trilha, jeito que ele recusou) |
| PA × PG | `descobrir/aulas/pa-pg.tsx` | SIM |
| Juros, amortização | nenhuma aula | NÃO |
| Combinatória, probabilidade | `escadas.ts` + 4 questões em `escada/matematica.json`; sem aula | NÃO |
| Médias, estatística | `dia-2/aulas.json` (Estatística) | PARCIAL |
| Geometria plana e espacial | `dia-2/aulas.json`, `aulas-desenho-dados.js` | PARCIAL (? não li o canal em detalhe) |
| Geometria analítica | `descobrir/aulas/reta-e-distancia.tsx` | SIM |
| Cinemática | `descobrir/velocidade-media`, `area-distancia`, `torricelli` | PARCIAL (falta referencial e gráficos) |
| Newton | `dia-2/aulas.json` (Dinâmica) | PARCIAL |
| Energia, hidrostática | nenhuma | NÃO |
| Calorimetria, termo | `dia-2/aulas.json` (Termodinâmica) | PARCIAL |
| Óptica | `dia-2/aulas.json` (Óptica) | NÃO |
| Ondulatória | `dia-2/aulas.json` (Ondas) | PARCIAL |
| Circuitos | `dia-2/aulas.json` (Eletricidade) | PARCIAL |

## 2. Os 10 temas que menos batem

| Tema | Canal abre e ordena | Nosso | Mudar (máx. 3) |
|---|---|---|---|
| Porcentagem | Abre com Jeremias (lucro 80%, desconto 40%) [2:15:00]; fator 1,2 e 0,8 [2:06:00]; 1,2 × 0,8 dá queda de 4% [2:11:32]; quadro [2:12:00] | 6 frases + macete "Ache 10%"; sem fator em sequência | (1) `descobrir/aulas/porcentagem.tsx`, equação 1000 → ×1,2 → ×0,8 = 960; (2) pegadinha "aumentar e descontar não volta" [2:13:01]; (3) pegadinha "300% é o triplo" [1:50:31] |
| Grandezas | Razão constante, y = kx [2:23:32]; produto constante [2:30:31]; gráfico reta × ramo de hipérbole [2:28:00] [2:41:01]; "jamais saia multiplicando" [3:04:33]; escala² e ³ [3:55:30] | Regra de três cruzada + macete "Quanto vale 1"; escala em 1 linha | (1) aula Descobrir com tabela 20/10, 40/20 e plano cartesiano; (2) inversa com 360 km, 30 km/h = 12 h [2:34:01]; (3) tela escala 1:30 → área ×900, volume ×27.000 [4:01:01] |
| 2º grau | Parte da partícula 0, 20, 0 [5:29:03]; forma a(t − r1)(t − r2) [5:41:31]; Δ = 0 "beija o eixo" [6:07:31]; xv = −b/2a deduzido [6:10:01]; graveto [5:57:00] | `dia-2/aulas.json` entrega x = −b ÷ (2a) sem origem; Trilha tem Bhaskara por completar quadrado | (1) 7ª aula no `mapa.ts`: graveto, A = x(50 − x), raízes 0 e 50, vértice no meio; (2) tela "espelho" [6:11:01]; (3) tela forma fatorada para 3 pontos |
| Combinatória e probabilidade | Árvore bermuda × camisa [21:38:30]; casa mais restrita [21:48:30]; "contar o que não quer" [22:06:31]; C(n,p) = arranjo ÷ p! [23:51:32]; Iago [25:01:33] | Sem aula; só `parecidas-2026-contagem.json` | (1) aula "Contar" na Descobrir (árvore, ×); (2) aula "Chance" com 16 caminhos [25:15:01]; (3) botão "Não sei isso" em `escada/matematica.json` apontando para ela |
| Circuitos | Questão do voltímetro [10:29:01]; série 4 V + 6 V = 10 V [10:40:01]; paralelo 2X + X = 10 [10:42:30]; P = i·U de volt = J/C [11:24:00]; chuveiro [11:48:30] | "URI e PUI" dado pronto; caixa-d'água em desenho | (1) tela "volt = energia por carga" em `aulas-desenho-dados.js`; (2) série e paralelo com 10 V, 2 Ω e 3 Ω; (3) pegadinha "tomada fixa: menor R esquenta mais" |
| Calorimetria | Ebulidor [5:10:30]; gráfico A–D [5:40:31]; etapas do gelo, 12.600 cal [5:47:00]; área sob P × t [5:58:00] | Q = m·c·ΔT e Q = m·L em frases | (1) tela do gráfico de 4 trechos; (2) gelo 120 g em 3 contas; (3) "calor é energia em trânsito" [5:14:31] |
| Ondulatória | Música/razão 3/2 [8:27:01]; v = Δx/Δt, Δx = λ, Δt = T [8:43:30]; "Ctrl C, Ctrl V" [8:35:00]; amplitude é metade [8:30:01] | v = λ × f dado; só "virar a fórmula" | (1) tela "de onde vem" com a dedução; (2) analogia do Ctrl C; (3) pegadinha da amplitude |
| Óptica | Côncavo: C, F, V; 4 posições [7:26:01]; tabela "é o ouro" [7:41:00]; "direita = virtual" [8:12:31]; lente = espelho [7:55:30] | "BATE, PASSA, CONTORNA" + espelho plano; `escada/fisica.json` salta para 1/p | (1) aula com uma tela por posição; (2) quadro do canal [7:37:33] como tabela; (3) eliminar por tipo de imagem |
| Newton | Elevador [0:57:00]; ação e reação em corpos diferentes [1:05:32]; "balança mede a normal" [1:13:00]; F = m·a deduz a 1ª lei [1:21:30] | "FAMA" em 4 frases | (1) abrir com o elevador; (2) tela "balança mede a normal"; (3) atrito μ·N [1:35:02] |
| Estatística | "Se todos tivessem a mesma idade" [27:11:01]; divide por 25, não por 5 [27:14:03]; harmônica 72 km/h [27:44:32] | Média, mediana, moda, ponderada; média ao contrário | (1) tela harmônica em `dia-2/aulas.json`; (2) tela frequência; (3) analogia da idade igual |

## 3. Doze questões lidas

Padrão do canal: questão é o motivador, aula depois, pegadinha nomeada. O site tem a pegadinha nomeada ("O seu jeito") nas de Matemática.

| Id (arquivo) | Veredito |
|---|---|
| `d2-facil-mat-07` (`dia-2/facil-matematica.json`) pães, 2 kg → 6 kg | Resolução SIM (erro 30 × 6 nomeado); enunciado simples demais, canal abre com caso difícil |
| `d2-medio-mat-04` (`dia-2/medio-matematica.json`) meninas de óculos | SIM: "20% das meninas, não da escola" é pegadinha nomeada |
| `cmoudnnx3003iuoz9dzbc13hb` (`dia-2/enem-matematica.json`) voo | SIM no jeito (1,10 × 0,90 = 0,99), mas a aula de porcentagem não ensina fator em sequência |
| `d2-dificil-mat-11` (`dia-2/dificil-matematica.json`) média 24 pessoas | SIM: é o futsal do canal [27:46:30] |
| `d2-escada-mat-jun-est-02` (`escada/matematica.json`) consumo médio | SIM: é a harmônica do canal, mas nenhuma aula a ensina |
| `d2-banco-mat-p26-02` (`parecidas-2026-contagem.json`) trilhas, 84 caminhos | PARCIAL: tem "Por que multiplicar", mas não há aula de árvore antes |
| `d2-banco-mat-cob-04` (`cobrir-e-chance.json`) porta, 1/4 de círculo | SIM: cena concreta; o "seu jeito" nomeia o quadrado do canto |
| `d2-banco-fis-din-06` (`banco-enem/dinamica.json`) carro 1 200 kg | NÃO: plugue de F = m × a, "Jeito rápido"; canal usa pergunta conceitual |
| `d2-banco-fis-ter-03` (`termodinamica.json`) gelo no copo | PARCIAL: conceito certo (temperatura parada), sem gráfico |
| `d2-banco-fis-ele-05` (`eletricidade.json`) torneira, 220 V e 20 A | NÃO: só U = R × i; canal cobra variação ao dobrar R |
| `d2-banco-fis-opt-02` (`optica.json`) laser a 40° | PARCIAL: pegadinha (ângulo com o espelho, não com a normal) é boa, sem raios |
| `d2-banco-fis-ond-07` (`ondas.json`) micro-ondas, 12 cm | SIM: v/f num caso real; falta a dedução |

Diferença estrutural (lido): Matemática usa os passos do robô (`O que eu tenho`, `A equação em letras`, `O seu jeito`); Física do banco usa `A pergunta / O que acontece / Jeito rápido / Por que funciona / A resposta`. O canal desaconselha decorar [19:30:00].

## 4. Lacunas (temas do canal sem aula no site), por queda no ENEM

1. Combinatória e probabilidade: 9,5%; canal [21:34:31]–[25:33:32].
2. Progressões: 2,5%. Aula Descobrir existe, mas nenhuma questão no banco dia-2 (não achei tema "Progressões"). Falta Gauss [19:35:30] e soma infinita [20:05:01].
3. Geometria analítica: 2,4%. Canal: mat-30 e mat-31. Falta circunferência (? conferir).
4. Eletromagnetismo: 2,3%. Canal: fis-14 e fis-15.
5. Hidrostática: 2,3%. Canal [4:03:00]–[5:08:30].
6. Trabalho, energia, potência: 2,0%. Canal [3:11:01]–[4:00:32].
7. Trigonometria: 1,6%. Canal: seno e cosseno [7:03:31].
8. Matemática financeira: 1,6%. Juros [20:19:30], amortização [20:58:01]. Sem aula.
9. Gravitação: 1,2%. Movimento circular, "órbita é queda" [2:19:00].
10. MMC e MDC: o canal abre com primos [0:46:00]; só cita em `dicas.json`.

Obs.: o chuveiro [11:19:30] e o ebulidor (1 cal = 4 J, canal usa 4 e diz 4,2) têm inconsistências marcadas no resumo; conferir antes de copiar.
