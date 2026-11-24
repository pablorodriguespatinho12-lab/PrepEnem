# Instruções do autor de questões v2 (um agente por conteúdo)

Você escreve as questões de nível acima de UM conteúdo do PrepEnem (repositório PÚBLICO), mais difíceis e no jeito das provas reais. O Pablo
(23/11/2026) reprovou as primeiras: eram fáceis, de uma conta só, sem prova real por trás. Agora a régua é a da banca real.

## Leia, nesta ordem
1. `docs/nivel-acima/molde-v2.md` (formato do dict, regras) e `docs/nivel-acima/regras-do-pablo.md`.
2. O índice do seu conteúdo em `docs/nivel-acima/indice/` (as reais lidas, "Como a banca cobra aqui", os vereditos e as PROPOSTAS de nova versão).
3. Exemplos completos de dict: `scripts/banco-enem/acima_fisica_novas.py` (leia 2 questões inteiras) e, para Matemática, `scripts/banco-enem/acima_aritmetica_novas.py`.
4. As 4 questões atuais do conteúdo (python3 lendo o JSON indicado) para manter o `id` e o `tema`.
5. `data/revisao-final/antes-da-questao.json` (aulas "Antes" existentes: velocidade, queda, aceleracao, curva, porcentagem, numero-que-falta, dividir-por-decimal, mol, pilha, anticorpo, hemoglobina, isomeros, pitagoras, fracoes, multiplicar-decimais, potencia-de-dez, seno-cosseno) e `scripts/banco-enem/antes_nivel_acima.py` (formato de conceito novo).
6. As reais da âncora, abertas em `/home/pablo/provas-reais/` (caminhos no índice; ENEM 2021 e ITA 2022 1ª fase estão ilegíveis). Escreva MAIS DIFÍCIL que a real, com a MESMA técnica.

## O que escrever
Um módulo `scripts/banco-enem/v2/<slug>.py` (formato em `molde-v2.md`: `ARQUIVO`, `Q`, `MANTER`, `ANTES_NOVOS`).
- `Q`: uma questão para cada id que o veredito mandou REESCREVER ou TROCAR (siga a PROPOSTA do índice; pode melhorar; confira a conta). Mantenha o `id` e o `tema`. Ordem: a = ENEM, b = ITA, c = Fuvest, d = Harvard–MIT/Oxford.
- `MANTER`: para cada id que o veredito mandou MANTER, `ancora` (corrigida como o índice manda), `canal` e `antes`.
- **Cada questão:** conta conferida por `assert` no módulo; 5 alternativas, cada erro um erro típico com a conta que o gera (nenhuma "sem sentido"); `ancora` de uma real que você abriu; `canal` (grep em `docs/universo-narrado/capitulos/*.txt`, ou "fora do canal: motivo"); `antes` com pelo menos 1 conceito.
- **Estilo:** a = ENEM (enunciado de 600 letras ou mais, contexto do dia a dia, dado indireto, pegadinha de unidade; tabela quando a proposta pedir); b = ITA/IME (seco, ideia escondida); c = Fuvest (tabela ou gráfico no texto, 2 a 3 etapas encadeadas); d = Harvard–MIT/Oxford (ideia criativa, contagem, invariante; âncora por técnica quando não há real do tema).
- **Dificuldade:** ideia escondida + junção de conteúdos de degraus ANTERIORES (Matemática: 1 Aritmética, 2 Grandezas, 3 Estatística, 4 Equações, 5 Funções, 6 Geometria Plana, 7 Geometria Espacial, 8 Combinatória; Física: Cinemática, Dinâmica, Termodinâmica, Ondas, Óptica, Eletricidade, só os anteriores ao seu) + pegadinha. Nunca copie enunciado real.
- **Explicação no molde do robô:** letras únicas (sem A a E), uma letra por tela ("Achando X:"), conta sem salto (decimal e fração passo a passo), "Resposta: alternativa X" por extenso; conteúdo de outro tema vai para uma aula "Antes" (existente, ou nova em `ANTES_NOVOS` com 2 exercícios, linhas de até 170 letras e `resolucao` cuja 1ª linha contém o 1º token da alternativa certa). Passos de até 300 letras.
- Figura: se a proposta pede desenho, use a chave `desenho` com um nome JÁ existente em `lib/visual/especificacao.ts` (`DIAGRAMAS`); se precisar de desenho novo, descreva no relatório (não crie o componente).

## Conferência (OBRIGATÓRIA e só assim)
`python3 scripts/banco-enem/montar_v2.py --seco <slug>` valida o módulo SEM gravar. **Nunca rode sem `--seco`**: vários agentes trabalham ao mesmo tempo e gravar em JSON compartilhado perde dados. Corrija até rodar limpo.
Arquivo de várias linhas se cria com a ferramenta Write (heredoc é barrado). Não use `rm -rf`. Não edite nada fora de `scripts/banco-enem/v2/<slug>.py`.

## Relatório final (curto)
Por id: estilo, resposta, nº de letras do enunciado, âncora usada, conteúdos juntados, conceitos Antes, desenho (existente, novo ou nenhum) e o que ficou incerto (conta que você não conseguiu conferir por código, real que não leu inteira).
