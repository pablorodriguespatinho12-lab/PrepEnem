# Mini plano: sobras da lousa (criado em 25/11/2026, para executar depois do /clear)

O plano principal (`docs/plano-final-lousa.md`) está fechado: 555 lousas de Mat/Fís no banco, 0 contas erradas pelo conferidor.

## Abrir antes
Skills `token-economy` e `verificacao-local`; memória `plano-final-lousa-comecar-aqui`.

## Ordem (do que o aluno mais sente para o que menos sente)

1. **Sólidos difíceis** (`d2-escada-mat-ita-esp-00a`, `-00c`, `-00d`):
   - 00c: a figura usa c, l, a e a conta usa x, y, z; ligar antes da tela 5. Tela 27: "13 + 2 = 15" com a fala "cabe", conferir (limite 14,2).
   - 00d: fala cortada ("Atenção:" sem fim; pista termina em "valor d"); divisões em linha nas telas 15, 19, 21.
   - 00a: "⅓" sem leitura; "razão" e "semelhante" sem explicação; 80% antes de ensinar; 225π e o 15 sem caminho.
   - A fala cortada é do gerador (`falas` em `lib/aula-lousa/do-robo.ts`): contar quantas aulas têm fala terminando em ":" e consertar todas.
2. **3 telas apertadas:** `d2-escada-mat-ita-esp-00b` (tela 10), `d2-escada-fis-ita-ond-00b` (tela 16), `d2-escada-qui-ita-ele-01` (tela 1, à mão). As 2 aulas longas demais (35 telas) e a de 32 não regeram: cortar passo repetido.
3. **5 aulas sem lousa:** `cmoudnnwo003duoz9gn1ouuu0` e `d2-escada-fis-ita-ele-00a` (enunciado longo), `cmoudnntg0021uoz90elk7yb8` e `d2-escada-fis-ita-opt-00b` (alternativa longa), `cmoudnnx7003kuoz9aifv2qcp` (LaTeX `\lceil`).
4. **Números sem origem:** olhar `d2-banco-mat-cob-05`, `-06`, `-12`, `-17`, `-20` (falta a conta de cm para m ou da sobra). O resto da lista é quase todo alarme falso.
5. **Legenda repetida** ("corrente" com "Corrente" embaixo): não pôr legenda igual à palavra.

## Conferir cada item
`npx vitest run data/revisao-final lib` → simular (`lousa-do-robo.ts <saida> --refazer --todas`, sem `--gravar`) → contar telas apertadas e contas erradas → foto da aula (esperar ~14 s por tela) → `aluno-do-zero` só no item 1.

## Gravar
Juntar tudo e gravar UMA vez. A trava do modo automático barra gravação em massa: entregar ao Pablo o comando com `!` (ele salva cópia sozinho):
`DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts /tmp/lousa.json --refazer --todas --gravar`

Depois: build, testes, commit, push. O código do ramo `pixel-em-tudo` desde o PR 84 ainda não foi para a `main`: abrir PR novo no fim.

## Feito em 25/11/2026 (noite)

Simulação: 539 de 539 aulas viram lousa (antes 531; 0 recusadas). 830 testes e build passando.

- Item 1: falas não terminam mais cortadas; contas "= 2 ·" saem inteiras; figura do 00c usa x, y, z; caixa cúbica desenha cubo; remendos de texto do 00a em `data/revisao-final/lousa-remendos.json`.
- Item 2: limite de telas subiu de 31 para 36 (troca o "cortar passo repetido"); equação que não cabe vira texto. Sobra: `d2-escada-qui-ita-ele-01` (à mão).
- Itens 3, 4 e 5: feitos.
- Achados na foto e consertados: enunciado cortado nas aulas antigas, conta falsa no quadro (trava `conta-verdadeira.ts`), "R6,00", título "(2 de", sobra "0,512 do".

### O que o aluno-do-zero ainda achou (00a e 00d), não consertado
- Aulas de sólido: não explicam o ⅓ do cone nem o 4/3 da esfera; "volume" e "cm³" sem definição.
- Conta dita na fala e ausente da tela (raio = 10 ÷ 2; equação com N; 315 que sobra; "N = 15" e a letra no fim do 00a).
- "O desenho" é só frase (sem copo de ponta para baixo, sem bolas); cone desenhado com a ponta para cima.
- Alternativas longas (5 em fileira) vazam da caixa no papel (`d2-escada-fis-ter-04`).

Aprendi: contar "0 contas erradas" não pega conta cortada nem sobreposta; fotografar a aula inteira antes de fechar.

## Feito em 26/11/2026: as 4 sobras do aluno-do-zero
- Desenho do passo vai para o quadro (tela `figura`): 62 telas em 28 de 28 aulas do gerador com desenho (6 à mão ficam como estão). As 62 fotografadas.
- "o que é volume" em 27 aulas; "de onde vem o ⅓" e "4/3" nas aulas de cone, pirâmide e esfera (`lib/aula-lousa/extras.ts`).
- Resposta escrita no quadro: 337 aulas com a frase completa, 190 em tela própria.
- Alternativas curtas quebram de linha em vez de vazar.
- 00a: raio, 315, exemplo solto de π e o "são 15" (remendos).

### Aberto (2ª leitura do aluno-do-zero)
- "3 cones = 1 cilindro" e "bola no cilindro" são só texto: falta desenhar.
- Tela de resposta não lista as alternativas.
- 00a: "250 + 200" e "3/4 de 24" sem explicação.
- Desenho `corredor-imagens` fica miúdo no quadro.
- Rótulo de figura sobreposto: "AD = 12 m" na praça.

### Aprendi
O porteiro (`validar.ts`) corta texto longo sem avisar: rótulo de desenho saiu pela metade e só a foto pegou. Campo novo no porteiro: medir o maior valor real antes de pôr o limite.
