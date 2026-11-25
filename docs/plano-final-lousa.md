# Plano final: terminar a lousa visual (criado em 25/11/2026, para executar depois do /clear)

## Autorização do Pablo (25/11, caixa de pergunta)
"Sim, gravar direto": cada prova de base pode ir para o banco SEM pedir de novo, desde que passe em testes, gabarito às cegas e aluno iniciante. Só acrescentar, nunca apagar. Dispensa a regra 14 (amostra) para ESTAS 12 provas.
Pedido dele: "faz um plano para já fazer tudo". Trabalhar até o fim, sem parar a cada prova.

## Abertura (ler antes de escrever)
1. Skills `token-economy`, `distribuir-trabalho` (Porteiro do orquestrador), `explicar-ao-pablo` no fim.
2. Memória `pablo-quer-lousa-visual-conta-desenhada`; `docs/nivel-acima/regras-do-pablo.md`.
3. Modelo de ficha: `scripts/banco-enem/base_ondas.py` (copiar o formato; não reler `montar.py`).

## Já feito
| Prova | Questões | Onde |
|---|---|---|
| Cinemática · Base | 7 | no ar |
| Ondas · Base | 6 | no ar, aberta na tela |
| 1 Óptica · Base | 6 | no ar (25/11), aberta na tela |
| 2 Termodinâmica e Calor · Base | 6 | no ar (25/11), aberta na tela |
| 3 Eletricidade · Base | 7 | no ar (25/11), aberta na tela |
| 4 Dinâmica · Base | 6 | no ar (25/11), aberta na tela |
| 5 Contagem e Probabilidade · Base | 6 | no ar (25/11), aberta na tela |
| 6 Equações e Sistemas · Base | 5 | no ar (25/11), aberta na tela |
| 7 Grandezas e Medidas · Base | 6 | no ar (25/11), aberta na tela |
| 8 Geometria Espacial · Base | 5 | no ar (25/11), aberta na tela |
| 9 Geometria Plana · Base | 6 | no ar (25/11), aberta na tela |
| 10 Funções · Base | 6 | no ar (25/11), aberta na tela |
| 11 Estatística · Base | 5 | no ar (25/11), aberta na tela |
| 12 Aritmética e Porcentagem · Base | 6 | no ar (25/11), aberta na tela |

## Estado em 25/11 (depois da execução)
A: 12 de 12 no ar (70 questões, todas com lousa no banco). `varrer-prova` em 13 provas: 76 questões, 640 passos, 0 achados.
B1 feito (lousa fotografada em 8 provas de Matemática; achado e consertado: letras da figura da caixa, 12 lousas regravadas).
B2: 45 lousas com número sem origem listadas, NÃO consertadas (amostra parece conta trivial). B3: 2 aulas com telas demais
(`d2-escada-mat-ita-pla-00d` 34, `d2-escada-fis-ita-ond-00b` 32), não mexidas. B4: 12 recusadas listadas com
`lousa-do-robo.ts --quais` (8 LaTeX, 2 enunciado, 2 alternativa), não consertadas. B5 não feito.
Consertos pós-agente sem 2ª leitura. Falta no molde: o desenho do triângulo da fórmula usa a, b, c fixos (colide em pla-b05).

## Estado em 25/11, 2ª sessão (PR 84 publicado)
- `varrer-prova` nas 14 provas "· Base": 83 questões, 698 passos, 0 achados.
- Achado olhando foto (o varredor NÃO pega): legendas uma em cima da outra, 198 telas em 157 aulas na simulação. Consertado no gerador (1 sobra, `d2-escada-mat-ita-esp-00b`).
- GRAVADO com o ok do Pablo (25/11, ~15h50): 250 lousas regravadas + 7 novas; banco igual ao gerador novo (0 de 525 mudariam). Cópias em `~/backups-prepenem/` (`...18h49-250-legendas.json` e `...18h50.json`). Aula de Geometria Espacial, tela "a equação", fotografada lendo do banco.
- 3a rodada (25/11, ~16h): 5 lousas com conta ERRADA na tela (número cortado: "72 · 100 = 7"). Consertado no gerador (milhar, "milhões", aparte entre parênteses): 0 contas erradas na simulação. FALTA GRAVAR (107 aulas; a trava do modo automático barrou): `DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts /tmp/lousa.json --refazer --todas --gravar`.
- Conferido: `varrer-prova` de novo nas 14 provas, 83 questões, 698 passos, 0 achados. Banco: 555 lousas de Mat/Fís, 5 sem; 3 telas apertadas.
- Aluno-do-zero nas figuras de sólidos (`esp-00a/c/d`) FEITO, achados abertos: letras da figura (c, l, a) não batem com a conta (x, y, z) na 00c; fala cortada ("Atenção:" sem fim) na 00d; "⅓", "razão" e "semelhante" sem explicação na 00a; 00c tela 27 diz "cabe" em 13 + 2 = 15 (conferir).
- Ainda abertos: 5 recusadas, 2 aulas com telas demais (36), números sem origem (58 marcadas, maioria alarme falso; olhar `d2-banco-mat-cob-05/06/12/17/20`), aluno-do-zero nas figuras de sólidos.
- Aprendi: foto de aula espera ~14 s por tela (com menos, o desenho sai pela metade); prévia sem gravar = trocar a lousa na resposta de `/api/tutor/explicacao`.

## Falta A (feito): 12 provas de base (um conceito por questão, a última junta 2)
Ordem: a de menos questões fáceis primeiro. Nome do tema = exatamente o do banco. 5 a 7 questões por prova.

| # | Tema (banco) | Fáceis hoje | Conceitos sozinhos, em ordem | Canal |
|---|---|---|---|---|
| 1 | Óptica | 3 | reflexão (ângulo igual); imagem no espelho plano (distância); índice de refração n = c ÷ v; foco = raio ÷ 2; aumento da imagem; junção | fis-08 |
| 2 | Termodinâmica e Calor | 5 | °C para K; Q = m·c·ΔT; calor latente Q = m·L; potência × tempo; trabalho do gás p·ΔV; junção | fis-06, fis-07 |
| 3 | Eletricidade e Circuitos | 5 | corrente = carga ÷ tempo; U = R·i; série; paralelo (2 iguais); potência P = U·i; energia em kWh; junção | fis-12, fis-13 |
| 4 | Dinâmica e Leis de Newton | 9 | resultante (soma e subtrai); F = m·a; velocidade constante = resultante zero; atrito; ação e reação com número; junção (peso já existe) | fis-02 |
| 5 | Análise Combinatória e Probabilidade | 3 | princípio multiplicativo; arranjo; combinação = arranjo ÷ p!; probabilidade; "não acontecer"; junção | procurar |
| 6 | Equações e Sistemas | 5 | 1º grau; montar a equação do texto; sistema por substituição; sistema somando; junção | procurar |
| 7 | Grandezas e Medidas | 6 | unidades; área e volume com unidade; escala; regra de três direta; inversa; junção (memória `regra-de-tres-composta-jeito-do-pablo`) | procurar |
| 8 | Geometria Espacial | 8 | volume caixa; cilindro; capacidade em litros; cone/pirâmide = 1/3; junção. Enunciado sem figura: a lousa desenha (regra 21) | procurar |
| 9 | Geometria Plana | 9 | perímetro; área retângulo; triângulo; círculo; Pitágoras; junção | procurar |
| 10 | Funções | 11 | valor da função; fixo + variável; achar a taxa; raiz; ler gráfico em tabela; junção | procurar |
| 11 | Estatística | 13 | média; mediana; moda; média ponderada pelo PESO [27:16:00]; junção | procurar |
| 12 | Aritmética e Porcentagem | 29 | porcentagem por FATOR [2:08:30]; aumento; desconto; dois descontos; razão; junção | procurar |

Canal de Matemática: `grep -n -i -- palavra docs/universo-narrado/capitulos/*.txt` (série `cin-*` e `mat`), e `docs/universo-narrado/comparacao.md`. Não achou: `canal='fora do canal: motivo'`.

## Receita por prova (repetir 12 vezes)
1. **Âncora real:** `grep -n -i -E "palavra" /home/pablo/provas-reais/enem/*/*PV*D2_CD7.txt` (não há `pdftotext` nem `pdftoppm`; usar os `.txt`). Citar ano e, se o gabarito `*GB*.txt` confirmar, o número. Sem real: dizer "sem" e o motivo.
2. **Ids livres:** `grep -h -o "d2-escada-<mat>-<tem>-[0-9]*" data/revisao-final/escada/*.json | sort -u` e conferir no banco (SQL só leitura, projeto `spring-hall-29447602`, tabela `"Question"`).
3. **Escrever** `scripts/banco-enem/base_<tema>.py` com `ARQUIVO = '../escada/<materia>-base-<tema>'`, `nivel` `facil` (junção `medio`), letras certas espalhadas.
4. `cd scripts/banco-enem && python3 montar.py base_<tema>`
5. `DB_CONFIRMED=1 npx tsx scripts/conferir-lousa-de-arquivo.ts data/revisao-final/escada/<arquivo>.json` (não toca o banco)
6. `npx vitest run data/revisao-final lib`
7. **Agentes** (até 4 por leva = 2 provas): `revisor-de-fatos` com `model: sonnet` (gabarito às cegas) e `aluno-do-zero` (Haiku, já é o padrão). Usar os pedidos prontos abaixo.
8. Consertar. Se mudou conta ou explicação grande, o aluno relê (continuar o agente com `SendMessage`).
9. Gravar: `DB_CONFIRMED=1 npx tsx scripts/gravar-questoes-de-arquivo.ts <json> --gravar` → `DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts <scratchpad>/l.json --gravar` (conferir "convertidas" = nº de questões) → `DB_CONFIRMED=1 npx tsx scripts/banco-enem/criar-prova-do-banco.ts pablo123 "<Tema curto> · Base" <ids> --gravar`
   Regravar explicação já gravada: acrescentar `--atualizar-aula` e rodar a lousa de novo.
10. Contar no banco: `jsonb_typeof(conteudo->'lousa')='object'` por prova (nunca LIKE).
11. `npm run build` (dev/start parado: `ss -ltnp | grep ':3000 '`), `git add` com os arquivos listados, commit, e `git push` em comando SEPARADO (a guarda exige).

**Nunca rodar** `scripts/criar-provas-escada.ts`: ele esconde as provas "· Base".

## Aprendi em 25/11 (conferir ANTES de escrever ficha)
- Cada letra da equação tem sua tela "Achando X"; no máximo 3 peças; fórmula com até 60 letras; `confere` de fração é o numerador.
- A letra da equação bate com a letra do DESENHO da tela.
- Definição vale fora do caso: "proporcional" é "dobrou, dobra", nunca "cresce junto".
- "Sua vez" mostra o caminho inteiro da conta, não só o resultado.
- "Parece certo fazer X" tem de levar a uma resposta diferente da certa.
- `conferencia` de distrator também é conta: conferir cada letra.

## Pedidos prontos
- **Gabarito:** "Arquivo: <json>. Resolva cada questão só com enunciado e alternativas, depois compare com \"resposta\". Confira cada conta dos passos e do \"Sua vez\" (certa única) e se alguma definição é falsa. Não edite. Até 8 linhas: \"N de N batem\" ou id + erro."
- **Aluno:** "Texto de estudo: <json> (ordem do arquivo = ordem de estudo). Leia só com Read: enunciado, pecas e passos, como quem só sabe as 4 operações. Tropeço = trecho que não consegue seguir: palavra ou símbolo sem leitura, número sem conta, passo pulado, letra que muda de sentido. NÃO conta: campo conferencia, estilo, \"poderia ter mais exemplo\", as frases fixas de fórmulas, nem o que já foi explicado antes. Não confira gabarito, não edite. Até 10 linhas \"id | trecho exato | o que falta\" ou \"nenhum tropeço\"."

## Erros já cometidos (conferir ANTES de escrever)
- Unidade ou símbolo novo (km/h, m/s², Hz, π, !, %) tem peça com a leitura.
- A mesma letra não muda de sentido dentro da prova. Matemática: letra = inicial da palavra (o gravador troca; ver a saída do passo 5).
- "Por que dividir / multiplicar?" sempre com exemplo de número pequeno ("com 2 s seriam...").
- Conta com vírgula ou divisão que não é exata: passo a passo (corte, décimos, centésimos, vezes 10 nos dois).
- Todo número de uma conta apareceu antes ou tem a conta dele (regra 19).
- Definição não pode ser falsa fora do caso (média = meio só com "subindo por igual").
- Em `tenho`, número que não vem do enunciado diz que é para decorar.
- Divisão difícil não vai só na fala: aparece na tela.

## Falta B: consertos pequenos (depois das 12)
1. Abrir 1 questão de cada prova nova na tela, 1366 px: `PREPENEM_TOKEN` pela skill `verificacao-local` + `npx tsx scripts/varrer-prova.mts <idDaProva>`; olhar 3 fotos de 1 aula por prova de Matemática. Incluir "Ondas · Base" (`cmww17dev0001hf592wtc1hyh`).
2. 57 lousas com número sem origem: `DB_CONFIRMED=1 npx tsx scripts/medir-origem-dos-numeros.ts <backup.json> --lista`. Consertar só as lacunas reais; dizer quantas eram alarme falso.
3. 2 aulas que passam de 31 telas (34 e 32): a saída do `lousa-do-robo.ts --refazer --todas` (sem `--gravar`) diz quais; cortar passo repetido.
4. 12 aulas que o gerador recusa (8 LaTeX, 2 enunciado longo, 2 alternativa longa): listar; consertar as que forem baratas.
5. `aluno-do-zero` nas figuras de sólidos (2 a 3 aulas).

## Fim
Atualizar a tabela "Já feito" a cada prova (é o ponto de retomada se o contexto ou o limite acabar). Mensagem final curta: quantas provas no ar de 12, o que não foi conferido na tela, próximo passo único.
