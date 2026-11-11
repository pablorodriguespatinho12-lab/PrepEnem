# Provas do dia 2 (Matemática e Natureza)

Pedido do Pablo em 10/11/2026: 3 provas escritas à mão (Fácil, Médio, Difícil,
40 questões cada) e 1 prova de questões reais do ENEM (40), todas com explicação
pronta (não gasta a IA do site), só nos 22 conteúdos que mais caem
(`docs/revisao-final/dia-2/*.js`, `data/revisao-final/o-que-mais-cai.json`).

Cada prova = 2 arquivos de 20 questões: `<nivel>-natureza.json` (Física, Química,
Biologia) e `<nivel>-matematica.json`. Natureza vem antes, como na prova de verdade.
Conferência automática: `data/revisao-final/provas-dia-2.test.ts` (`npx vitest run data/revisao-final/provas-dia-2.test.ts`).
Gravar no banco (quem roda é o Pablo): `scripts/criar-provas-dia-2.ts`.

## Quantas de cada conteúdo (por arquivo de 20)

Matemática: Aritmética e Porcentagem 5 · Grandezas e Medidas 3 · Estatística 3 ·
Funções 3 · Geometria Plana 3 · Geometria Espacial 3.

Natureza: Física 6 (Eletricidade e Circuitos 2, Termodinâmica e Calor 1, Ondas e
Acústica 1, Óptica 1, Dinâmica e Leis de Newton 1) · Biologia 7 (Ecologia 2,
Fisiologia Humana e Saúde 1, Genética 1, Citologia 1, Evolução 1, Microbiologia e
Doenças 1) · Química 7 (Química Orgânica 2, Química Ambiental e Energia 2,
Soluções, pH e Titulação 1, Eletroquímica 1, Estequiometria 1).

Na ENEM (reais) a divisão é a mais próxima disso que o banco permite.

## Os níveis

- **Fácil:** pergunta curta e direta ("O que é X?", ou conta de 1 passo com números
  redondos). 1 a 2 linhas.
- **Médio:** uma situação do dia a dia em 2 a 4 linhas, 2 passos de raciocínio.
- **Difícil:** no jeito do ENEM, NÃO real: texto-base de 4 a 8 linhas (notícia,
  experimento, tabela escrita em texto), 2 a 3 passos, distratores que são os erros
  típicos (esquecer de converter unidade, usar o que caiu em vez do que sobrou...).
  Pergunta final clara, terminando em ":" ou "é" / "foi" / "de".

## Formato de cada questão (escrita à mão)

```json
{
  "id": "d2-facil-mat-01",
  "materia": "Matemática",
  "tema": "Aritmética e Porcentagem",
  "enunciado": "...",
  "A": "...", "B": "...", "C": "...", "D": "...", "E": "...",
  "resposta": "C",
  "explicacao": {
    "conferencia": "conta feita de novo + de onde sai cada alternativa errada",
    "ideia": "1 ou 2 frases práticas",
    "pecas": [{ "termo": "...", "significado": "o que é + exemplo do dia a dia" }],
    "passos": [{ "titulo": "A pergunta", "texto": "...", "visual": { } }],
    "seuErro": null,
    "checagem": { "pergunta": "...", "opcoes": ["...", "...", "...", "..."], "certa": "...", "resposta": "por quê, 1 frase" }
  }
}
```

Na prova ENEM (reais) só muda: `"id"` é o id do banco, há `"origem": "ENEM 2022 · questão 149"`,
e `enunciado`, `A`..`E` e `resposta` são COPIADOS do banco (servem para conferir;
o script não regrava questão real).

## Regras da explicação (o código confere as marcadas com *)

- Passos, nesta ordem: **A pergunta** → **O que acontece** → **Jeito rápido** →
  **Por que funciona** → **A resposta**. 2 a 6 passos.*
- Questão de Matemática, Física ou Química com número no enunciado: no mínimo 4
  passos*, um passo com visual `quadro`* (dados COM número*), um passo com
  "funciona" ou "de onde" no título* e um com "resposta" no título*.
- Biologia e questão sem conta: 2 a 4 passos; o último se chama "A resposta"*.
- TODO primeiro passo tem visual (tabela, legenda, processo, molecula, quadro...).
  Biologia com processo (fotossíntese, digestão, cadeia alimentar) usa `processo`.
- "A resposta" diz a letra e o porquê das erradas mais tentadoras.
- `checagem` ("Sua vez"): caso NOVO com outros números ou outro exemplo*,
  pergunta com até 140 letras*, 2 a 4 opções curtas (até 60 letras), `certa` é
  igual, letra por letra, a uma das opções*.
- `pecas`: até 3, termo até 60 letras, significado até 320.
- `ideia` até 300 letras; texto de passo até 900; título até 80.
- `seuErro`: sempre `null` (não sabemos o que o aluno marcou).
- Proibido: emoji, "é importante notar", "vale ressaltar", "vamos analisar",
  elogio, derivada, integral, limite.*
- LaTeX dentro do JSON com barra DUPLA: `"\\frac{12}{2}"`, `"6\\,\\Omega"`.
  Unidade dentro do quadro: `"72\\,\\text{km/h}"`. Decimal com vírgula: `"0{,}5"`.
- Conversão km/h para m/s: o atalho (÷ 3,6), nunca × 1000 ÷ 3600.
- O aluno só sabe as 4 operações: todo termo técnico e símbolo é explicado
  entre parênteses na 1ª vez (ex.: "massa molar (quanto pesa 1 mol)").
- Formato de cada desenho: `lib/visual/especificacao.ts`, linhas 479 a 500.
  Exemplo completo de questão com quadro: `aquec-rf-23` em
  `data/revisao-final/aquecimento.json`.

## O que o aluno-do-zero achou na 1ª leitura (10/11/2026: refaria 9 de 13)

Os 26 tropeços caíram em 4 padrões; vale para toda explicação nova:
1. Termo ou símbolo sem explicação: traço de fração, "·", cm², m³, π, índice
   ("N_0"), elétron, organela, enzima, tensão, peso em newtons.
2. Conta pulada: "15 ÷ 60 = 0,25", "72 ÷ 3,6 = 20" sem o caminho de cabeça.
3. Frase que afirma sem mostrar ("três pirâmides enchem o prisma").
4. "A resposta" sem dizer por que CADA errada falha; "Passo 1" dentro de um passo.

## Regras da questão (o que torna questão sem sentido)

- Exatamente UMA alternativa certa; as 5 diferentes entre si.*
- Toda informação necessária está no enunciado (nada de "observe a figura").
- Números que fecham: a conta dá EXATAMENTE a alternativa certa, sem arredondar
  escondido. Refazer cada conta antes de escrever.
- Fato científico verdadeiro e atual; nada de "pegadinha" de palavra.
- Distratores plausíveis: cada um vem de um erro que um aluno faria (anotar na
  `conferencia` de onde sai cada um). E possíveis no mundo da questão: nota 19
  numa prova até 10 ou 300 000 km de casa à escola se descartam sem conta
  (achados do revisor-de-fatos em 10/11/2026).
- Letra certa espalhada: em cada arquivo, cada letra A–E é a certa 3 a 5 vezes.*
- Nada de "todas as anteriores" / "nenhuma das anteriores".
