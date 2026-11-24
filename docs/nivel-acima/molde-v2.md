# Molde da fábrica v2 (nível acima, 23/11/2026)

Quem escreve uma questão nova ou reescrita usa `scripts/banco-enem/molde_acima.py` (função `montar`) através de um módulo em
`scripts/banco-enem/v2/<slug>.py`; o programa `scripts/banco-enem/montar_v2.py <slug>` troca a questão no JSON de `data/revisao-final/escada/`.
Exemplos completos de dict: `scripts/banco-enem/acima_fisica_novas.py` (Física) e `acima_aritmetica_novas.py` (Aritmética).

## O módulo `v2/<slug>.py`
```python
ARQUIVO = 'fisica-acima-novas.json'      # ou 'matematica-acima-novas.json' / 'matematica-aritmetica-novas.json'
Q = [ {...}, ... ]                       # só as REESCRITAS e TROCADAS (mesmo id da antiga: d2-escada-fis-ita-cin-00a ...)
MANTER = { 'd2-escada-...-00c': {'ancora': '...', 'canal': '...', 'antes': ['velocidade']} }   # as que ficam, com campos corrigidos
ANTES_NOVOS = { 'id-do-conceito': {'titulo': ..., 'linhas': [...], 'visual': {...}, 'exercicios': [... 2 ...]} }   # opcional
```

## Campos do dict de cada questão (todos obrigatórios, salvo "opcional")
- `id`, `materia` ('Física' ou 'Matemática'), `tema` (texto exato do degrau em `data/escadas.ts`), `calc` (número da resposta certa; a conta tem que estar num `assert` do módulo), `pos` (opcional).
- `enunciado` (SEM a linha "Dados:", o programa acrescenta) e `dados` = lista de (rótulo, valor); cada valor até 60 letras.
- `alts` = 5 tuplas (texto, valor numérico, motivo do erro); a certa tem motivo `'OK'`; ordem crescente; cada erro é um erro típico com a conta que o gera.
- `resumo` (a conta da resolução em 1 frase), `ideia` (até 300 letras e 2 frases), `pecas` (até 3 termos com significado), `pista`, `rec1`, `rec3`.
- `formulas` = lista de (figura, nome até 30 letras, fórmula até 60). Figuras válidas: quadrado, retangulo, triangulo, triangulo-retangulo, circulo, trapezio, cilindro, caixa, cone, esfera, porcentagem, grafico, contagem, media, carro, onda, termometro, lente, circuito, texto, fala, livro.
- `eq`, `leitura`, `letras` = lista de (letra, o que é); a 1ª é o que a questão pede; `eq_texto` (o que a equação diz e "Agora é só achar ...").
- `achando` = lista de (título que começa com "Achando <letra>:", texto, visual opcional); uma para cada letra, menos a primeira. Passo até 300 letras (o programa corta); ≤ 900 sempre.
- `volta` (termina com "Resposta: alternativa X."; o programa troca X pela certa), `valores` = lista de (letra, valor), `checagem` = (pergunta, até 4 opções de até 60 letras, certa, resposta).
- `origem` (opcional): ideia que só esta questão traz; **conteúdo de outro tema vai para a aula "Antes", não aqui**.
- `desenho` (opcional) = (texto, nome em `DIAGRAMAS` de `lib/visual/especificacao.ts`, rótulos); regra: dados na abertura, resultado só no passo da conta.
- `ancora` = `'forte|parcial|sem · Banca ANO q.N (técnica em palavras)'`, de uma questão REAL que você abriu em `/home/pablo/provas-reais/`; `canal` = `'arquivo.txt [h:mm:ss]'` (pasta `docs/universo-narrado/capitulos`) ou `'fora do canal: motivo'`; `antes` = ids de `antes-da-questao.json` (pelo menos 1).

## O que tem que valer (o porteiro `data/revisao-final/nivel-acima-regras.test.ts` e `provas-dia-2.test.ts` conferem)
1. Estilo certo: a = ENEM (enunciado de 600 letras ou mais, contexto do dia a dia, dado indireto, tabela ou figura), b = ITA/IME (seco, ideia escondida), c = Fuvest (tabela ou gráfico, 2 a 3 etapas), d = Harvard–MIT/Oxford (ideia criativa, contagem, invariante).
2. **Difícil de verdade**: ideia escondida + junção de conteúdos de degraus ANTERIORES + pegadinha de unidade ou de enunciado; mais difícil que a real da âncora.
3. Letras da equação únicas e diferentes de A a E; resposta sempre "alternativa X" por extenso; nenhum conteúdo de outro tema ensinado dentro da explicação (vai para `ANTES_NOVOS`).
4. Nenhum enunciado real copiado (repositório público): escreva o seu, com a MESMA técnica da âncora.
5. Conta conferida por código dentro do módulo (`assert`).
