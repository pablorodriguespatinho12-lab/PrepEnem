---
name: montar-referencia
description: "O PrepEnem não tem site de referência. Esta skill monta uma por TELA (questão, flashcard, redação, progresso), mede a tela de estudo e não a de venda, com scripts/medir-referencia.mts, compara com a nossa em número e separa o que ensina do que vende. Usar antes de decidir forma de tela, quando o Pablo achar algo 'genérico' ou 'feio' sem dizer por quê, e quando uma ideia de design não tiver com o que ser comparada."
---

# Montar referência

O logica-app tem o coddy.tech. Toda decisão de tela lá passa por "medir a
referência antes de decidir", e a regra pegou erro várias vezes: oito achados
numa comparação, quatro mortos antes de virar código. **O PrepEnem não tem
referência.** O redesign editorial de 05/08/2026 foi decidido e medido só contra
si mesmo: contraste, escala, raio. Ele é coerente, mas nunca foi comparado com
nenhuma tela de estudo de verdade. No logica-app, a crítica mais dura do Pablo
foi "está muito genérico, é óbvio que foi feito por IA". Quem não tem
referência não tem como ver isso chegando.

Regra única: **a referência não é um site, é UMA TELA por tarefa de estudo.**
Nenhum site de ENEM acerta tudo. Cada tela daqui tem a sua.

## O mapa, medido em 05/10/2026

| Tela daqui | Candidata | Abre sem login? | O que a medida disse |
|---|---|---|---|
| treino / questão | `app.estuda.com/questoes/?cat=1` | sim | enunciado ~121 caracteres por linha a 1440, Open Sans 16px; a questão começa no y≈615 de 900 |
| treino / questão | `qconcursos.com` | **403** | precisa do Pablo logado ou de um print |
| redação | `redacaonline.com.br` | sim | Inter, parágrafo 18/28px, ~85 caracteres, 166 variáveis de CSS |
| redação | `projetoagathaedu.com.br` | sim | corpo em Times New Roman: fonte padrão do navegador, sinal de descuido |
| geral / venda | `descomplica.com.br/enem/` | sim | é página de venda: parágrafo de ~37 caracteres, não serve para tela de estudo |
| flashcard | Anki, RemNote | AnkiWeb devolve 25 caracteres | a medir, com a conta do Pablo |
| progresso | Khan Academy | home sim; painel só logado | a medir, com a conta do Pablo |

`stoodi.com.br` deu 403. `mesalva.com` não respondeu em 20s. `tecconcursos.com.br/questoes`
devolve 795 caracteres, porque a página é montada por JS e quase não traz texto.

## Meça a tela de estudo, nunca a de venda

Este é o contra-exemplo, e ele aconteceu nesta medição. A primeira rodada mediu
as páginas iniciais e saiu número para tudo. Mas a página do Descomplica tem
parágrafo de 37 caracteres porque é copy de venda em colunas estreitas. Aplicar
isso à leitura de enunciado estaria errado. **Número certo, tela errada:** não dá
erro e parece dado. Antes de medir, ache a URL onde a pessoa ESTUDA (questão,
cartão, editor de redação). Se ela exige login, peça ao Pablo para abrir a conta
ou mandar print. Não meça a página inicial no lugar dela.

## Como medir

```bash
DB_CONFIRMED=1 MEDIR_SAIDA=<scratchpad> npx tsx scripts/medir-referencia.mts "<url>" 1440
DB_CONFIRMED=1 MEDIR_SAIDA=<scratchpad> npx tsx scripts/medir-referencia.mts "<url>" 375
```

- O `DB_CONFIRMED=1` vem do `db-guard`, que barra **qualquer** comando com
  `scripts/` no caminho. Este script não toca no banco, então o aviso não se
  aplica, mas sem a variável o comando não roda.
- O script imprime uma linha de resumo. O JSON completo e o screenshot ficam em
  `MEDIR_SAIDA`. Leia o screenshot com `Read`: o número diz quanto, a imagem
  diz o quê.
- O resumo traz `innerWidth`. Confira que bate com a largura pedida. Medida sem a
  própria largura não dá para conferir.
- Meça **a nossa tela equivalente com o mesmo script**, autenticado como manda
  `verificacao-local`. Comparar número da referência com lembrança da nossa
  tela não é comparação.

## A comparação só termina com três itens, cada um com número

1. **O que ela faz e nós não.** Ex.: estuda.com tem marca-texto e A−/A+ de
   fonte na própria tela da questão.
2. **O que fazemos pior.** Precisa medir a nossa para saber.
3. **O que ali é venda e não ensino.** No estuda.com, 4 peças vêm antes da
   questão: faixa de cadastro, banner "Assinar o Combo", botão de login grátis
   e aviso de cookies. Juntas empurram a questão até o pixel 615 de 900.

A pergunta que separa os dois lados, vinda do logica-app: **esta peça existe
para me ensinar ou para me fazer voltar e pagar?** O PrepEnem é de um usuário
só e não tem plano pago. Toda peça de venda fica de fora, por mais bem
desenhada que seja.

## Medir não é obedecer

A referência perde para decisão fechada. A linha de ~121 caracteres do
estuda.com não derruba a medida controlada da leitura (`decisoes-prepenem`,
commit `5009e92`): ela mostra o que acontece sem esse controle. Antes de adotar
qualquer número de fora, abra `decisoes-prepenem`. Se a decisão tem medida, a
referência só confirma ou mostra o contraste.

## O Pablo escolhe olhando

Ele não descreve gosto em palavras (`perguntar-ao-pablo`). Monte uma página
`Artifact` com as duas candidatas da tela, cada uma com screenshot e os três
itens. Ele escolhe uma. Registre a escolha com data em `decisoes-prepenem`,
numa seção "Referência por tela". A partir daí ela é **a** referência daquela
tela, e a regra do logica-app passa a valer aqui também: antes de mudar a tela,
meça de novo e diga o número na mensagem.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
