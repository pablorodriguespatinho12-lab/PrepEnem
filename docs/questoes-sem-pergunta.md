# Questões reais do ENEM sem a frase da pergunta

Achado em 09/11/2026, ao montar a revisão do dia 2: o enunciado no banco acaba no
texto-base (ou na fonte do texto) e as alternativas começam soltas. O aluno lê o
texto e não sabe o que está sendo perguntado.

**61 questões** (Neon, só leitura, 09/11/2026):

| Prova | Quantas | Números |
|---|---|---|
| ENEM 2021, dia 1 | 14 | 22, 23, 24, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 74 |
| ENEM 2021, dia 2 | 2 | 91, 109 |
| ENEM 2022, dia 1 | 24 | 1, 2, 3, 4, 5, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40, 41, 42, 61, 62, 63 |
| ENEM 2023, dia 1 | 21 | 24, 35, 44, 67, 68, 69, 70, 71, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88 |

## Como foi medido

Questão real (`anoProva` preenchido) cujo enunciado, tirada a marca `[IMAGEM]` do fim,
termina em ponto final, aspas, exclamação ou fonte ("(adaptado)."), e não em
reticências. Conferi à mão o fim das 108 suspeitas de uma busca mais larga; as que
terminam em frase incompleta ("...deve-se ao(à)", "será") estão certas e ficaram de fora.
A busca pode deixar passar caso em que a pergunta sumiu e o texto termina sem ponto.

## Estado

- **Dia 2 (Q91 e Q109 de 2021):** transcritas da página escaneada e postas em
  `scripts/data/correcao-texto-base-enem.ts`. Falta gravar no banco (quem roda é o Pablo):
  `DB_CONFIRMED=1 npx tsx --env-file=.env scripts/corrigir-texto-base.ts` mostra o que muda;
  com `--gravar` no fim, grava e salva cópia em `backups/`.
- **Dia 1 (59 questões):** em aberto. O texto certo está na imagem da página
  (`public/questoes-imagens/<id>.webp`); o PDF do INEP não serve (fonte codificada).
  Mesmo caminho das 14 corrigidas em 06/10/2026: transcrever para o arquivo de correções.

## Outras estragadas achadas ao montar as provas do dia 2 (10/11/2026)

Os agentes resolveram cada candidata; estas não fecharam com o texto do banco e
ficaram fora da prova "Dia 2 · 4 ENEM real". Conferir na página escaneada antes de consertar.

| Questão | Problema |
|---|---|
| ENEM 2021 Q158 (pneus) | texto cortado ("ficou reduzido de pessoas"); a conta não dá nenhuma alternativa |
| ENEM 2021 Q159 (suplementos) | a conta dá o fornecedor V, o gabarito do banco é D |
| ENEM 2022 Q154 (gemas) | a conta dá 500 000, o gabarito do banco é 400 000 |
| ENEM 2021 Q112 | trecho ilegível no meio do enunciado (ruído de leitura da página) |
| ENEM 2021 Q92 | cadastrada como Física, mas é pilha (Química) |
