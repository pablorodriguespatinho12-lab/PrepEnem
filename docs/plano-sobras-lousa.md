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
