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

## Antes de entregar
- Refaça TODA conta. Uma só alternativa certa.
- `npx vitest run data/revisao-final/provas-dia-2.test.ts` (bloco "banco ENEM do dia 2") passando.
- `python3 scripts/conferir-passos-em-linhas.py` não roda nesta pasta; confira você: nenhum
  passo acima de 200 letras sem "\n", nenhuma linha acima de 170.
- Responda em 3 linhas: quantas questões, "teste passou" com a linha "Tests N passed", e as
  3 contas mais difíceis refeitas.
