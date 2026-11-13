# Briefing: consertar os achados da varredura (13/11/2026)

Lista de achados: `docs/revisao-final/varredura-conteudo-nao-estudado.md` (uma linha por
achado: id | passo | tipo | trecho | o que faltou). O aluno tem TDAH, só sabe as 4
operações e só estudou a aula do tema (`data/revisao-final/dia-2/aulas.json`, campo
`aula` e `paraSubir` do tema da questão) e as telas "Antes" dela
(`data/revisao-final/antes-da-questao.json`; NÃO edite este arquivo).

## Já resolvidos por uma tela "Antes" (só confira; não precisa mexer)
Achado cujo conteúdo é velocidade, velocidade média, aceleração, curva, porcentagem,
achar o número que falta / isolar / "dos dois lados", dividir por decimal, mol e
massa molar, íon/ânodo/cátodo, anticorpo/soro/vacina, hemoglobina, E SE a questão já
está ligada a esse conceito em `antes-da-questao.json` → pule.

## Como consertar o resto (só o campo "texto" dos passos; "visual" só se o achado for nele)
1. **Tipo 4 (conteúdo não estudado), quando é uma palavra ou ideia curta:** explique
   na hora, na linha onde aparece, em até 1 frase com exemplo do dia a dia
   ("Difusão: o gás vai de onde tem mais para onde tem menos, como o cheiro do café que
   se espalha pela casa."). Conteúdo de outro tema também: 1 frase que ensina o
   necessário ("O DNA é a receita do corpo que passa de pais para filhos.").
2. **Tipo 7 (letra antes de número):** ponha ANTES da regra ou fórmula a mesma conta
   com números pequenos de verdade ("Em 2 horas: 20 + 40 × 2 = 100. Com h horas:
   20 + 40 × h."). Regra pronta ("ângulo de saída = de chegada") ganha um caso com
   número (30° chega, 30° sai).
3. **ERRO:** corrija o fato e confira refazendo a conta.
4. Formato: uma ideia por linha, linhas separadas por "\n", cada linha até 170
   letras; no máximo 6 passos (não crie passo novo). Fórmula entre $...$ intacta.
5. TODO número novo que você escrever: refaça a conta. Não mude letra certa, enunciado,
   alternativas, título de passo.
6. Edite trocando só a string do texto no arquivo (leia o JSON, ache o texto antigo
   exato e substitua por json.dumps(novo, ensure_ascii=False) no texto bruto do
   arquivo), para o resto do arquivo não mudar. Confira com `git diff --stat`.

## No fim
- `python3 scripts/conferir-passos-em-linhas.py <seus arquivos>`: "números mudaram" é
  esperado só nos passos que você consertou; linha longa ou sem quebra NÃO pode.
- `npx vitest run data/revisao-final` tem que passar.
- Responda em até 12 linhas: quantos achados consertou, quantos pulou (já com "Antes")
  e, para cada passo que ganhou número novo, a conta em uma linha (para conferência).
