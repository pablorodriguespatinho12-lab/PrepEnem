# Briefing: banco ENEM do dia 2 (20 questões por conteúdo)

Pedido do Pablo (13/11/2026): "faz umas 20 nível ENEM para cada conteúdo e deixa
guardado no banco". Ele tem TDAH, sabe pouco e só estudou a aula do conteúdo.

## Base: siga TUDO de `docs/revisao-final/dia-2-briefing-reforco.md`
(formato campo a campo, explicação, figuras em pixel, quadro, proibidos), com estas trocas:

- **Arquivo:** só `data/revisao-final/banco-enem/<slug>.json` que o pedido indicar.
  NÃO mexa em nenhum outro. NÃO grave no banco. NÃO faça commit.
- **id:** `d2-banco-<area>-<tema-curto>-NN` (ex.: `d2-banco-fis-ele-01`), NN de 01 a 20.
- **origem:** "Banco ENEM do dia 2". `materia` e `tema` exatamente como em
  `data/revisao-final/dia-2/aulas.json` (a chave do tema).
- **20 questões**, letra certa espalhada (4 de cada letra).
- **Nível ENEM de verdade:** texto-base de 4 a 8 linhas (notícia, experimento, situação
  do dia a dia, tabela escrita em texto), 2 a 3 passos de raciocínio, distratores que são
  erros típicos de aluno. Pergunta final clara. Contextos variados entre as 20 (não repita
  a mesma situação trocando números) e diferentes das questões já existentes do tema nos
  arquivos `data/revisao-final/dia-2/*.json` (procure pelo `tema`).

## As 3 regras do Pablo (as que mais o fizeram travar)
1. **Só o que ele estudou:** a explicação usa só a aula do tema (`aula` e `paraSubir`
   em `aulas.json`). Precisa de outra coisa? Explique na hora, em 1 frase com exemplo
   ("Difusão: o gás vai de onde tem mais para onde tem menos, como o cheiro do café").
   Porcentagem, achar o número que falta, dividir por decimal, mol, pilha, anticorpo e
   hemoglobina já têm aula própria, mas mesmo assim lembre em meia frase.
2. **Número antes de letra:** toda fórmula ou regra vem DEPOIS da mesma conta feita com
   números pequenos de verdade (1 s, 2 s, 3 s; corda de 2 m e de 5 m). "t²" também como "t × t".
3. **Uma ideia por linha:** texto do passo em linhas separadas por "\n", cada linha até 170
   letras, 3 a 5 linhas. "A resposta": "Letra X, ..." e depois uma linha por alternativa errada.

## Andamento (atualizar a cada leva)
- Leva 1 (13/11, gravada no banco, PR 22): eletricidade, termodinamica, ondas, optica.
- Leva 2 (13/11, gravada no banco): dinamica, organica, ambiental, solucoes-ph.
- Leva 3 (escrita, NÃO gravada): eletroquimica, estequiometria, ecologia, fisiologia.
  Próximo passo dela em `docs/revisao-final/banco-enem-leva-3-achados.md`.
- Faltam escrever (levas 4 a 6): genetica, citologia, evolucao, microbiologia, aritmetica,
  grandezas, estatistica, funcoes, geometria-plana, geometria-espacial.
- Slugs e ids: bio-gen, bio-cit, bio-evo, bio-mic, mat-ari, mat-gra, mat-est, mat-fun,
  mat-pla, mat-esp (ex.: d2-banco-bio-gen-01). Tema = chave de `aulas.json`.
- Ciclo de cada leva: 4 escritores → teste → revisor-de-fatos (2 arquivos cada) e
  aluno-do-zero (`scripts/jornada-aula-questoes.py`) → 1 consertador → commit →
  `DB_CONFIRMED=1 npx tsx scripts/criar-banco-enem.ts --gravar`. Divisão com vírgula foi o
  tropeço mais comum da leva 1: já pedir no briefing do escritor.

## Contas que mais travaram nas levas 1 e 2 (mostre SEMPRE num caso pequeno)
- Dividir por decimal: 1 ÷ 0,5 = 2 (cabem 2 metades em 1).
- Multiplicar decimais: 0,2 × 0,1 = 2 décimos de 1 décimo = 2 centésimos = 0,02
  (ou: 2 × 1 = 2, e a vírgula anda 1 + 1 = 2 casas porque cada décimo divide por 10).
- Cortar zeros: 120 ÷ 40 = 12 ÷ 4, porque dividir os dois por 10 não muda quantas vezes um cabe no outro.
- Porcentagem: 30% = 30 de cada 100 = 3 de cada 10.
- Palavras: atrito, kWh, ácido graxo, ação e reação: explique na 1ª vez, com exemplo.

## Antes de entregar
- Refaça TODA conta. Uma só alternativa certa.
- `npx vitest run data/revisao-final/provas-dia-2.test.ts` (bloco "banco ENEM do dia 2") passando.
- `python3 scripts/conferir-passos-em-linhas.py` não roda nesta pasta; confira você: nenhum
  passo acima de 200 letras sem "\n", nenhuma linha acima de 170.
- Responda em 3 linhas: quantas questões, "teste passou" com a linha "Tests N passed", e as
  3 contas mais difíceis refeitas.
