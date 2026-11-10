# Decisões já tomadas: Redação

Parte da skill `decisoes-prepenem` (o índice e as outras decisões estão em `SKILL.md`).
Cada item é decisão fechada, com o motivo.

- **A IA levanta evidência, o código dá a nota (05/10/2026).** C1, C2 e C5
  saem inteiras das regras da grade do INEP (`lib/redacao/grade.ts`); C3 e C4
  usam o nível da IA com teto pela evidência e pelas travas. Régua e fontes
  em `docs/redacao-enem-correcao.md` — mude lá antes de mudar o código.
- **Correção v3 (Pablo, 27/10/2026): nota sem trecho é inválida.** Cada
  competência traz o trecho que a justifica e o código confere que está no
  texto (`lib/redacao/trecho.ts`, tolera 1 letra errada em trecho de 5+
  palavras: a IA copiou "Estima" por "Estigma"). Repertório só é produtivo com
  cita + explica + amarra; sem explicar ou sem amarrar é "de bolso" (C2 160;
  a Cartilha 2025 chama de bolso o Bauman só nomeado). "Conscientizar"
  sem meio não é ação. Conectivo repetido trava C4 em 160. Raciocínio da IA em
  'low': 'medium' cortava o JSON. Prova: `npm test` (sem IA) e
  `npm run test:redacao` (IA real, ~30 min pela cota da Groq; 20 redações das
  cartilhas 2025 e 2026 em `tests/redacao/textos/`, PDFs em
  `docs/redacao/fontes/`, os dois fora do git). As cartilhas NÃO dizem que as
  redações tiraram 1000: o teste compara com o nível que o comentário do INEP
  declara (`tests/redacao/niveis-inep.ts`).
- **Flashcards de Redação = só o TRIO 1 (Pablo, 07/11/2026: "apaga todos os flash
  cards da parte de redação"; à noite: "não vou conseguir decorar as duas coisas,
  prefiro o trio 1, o do Rui Barbosa"):** trio = introdução (Drummond + Pacto), 1º
  desenvolvimento Rui Barbosa, 2º Dom Hélder. O Trio 2 (Graciliano + Galeano) SAIU do
  site. 4 baralhos, nada mais em Redação: "1. O que cada autor fala" (3), "2. O que
  cada autor quer dizer" (3), "3. Onde cada um entra" (5), "4. Como o Rui e o Dom
  Hélder entram no tema" (1 por redação pronta, verso = `RedacaoModelo.usos`). Fonte
  `lib/redacao/cartoes-trios.ts`; `scripts/seed-trios-redacao.ts` APAGA todo baralho
  padrão de Redação e recria os 4 (zera o progresso; o classificador barra eu rodar:
  o Pablo roda com `!`). Estudam SEMPRE inteiros e na ordem
  (`lib/flashcards/ordem-fixa.ts`). Depois dos baralhos: Redação → "Redações prontas
  dos trios" (`/redacao/modelos`, abas pelo tema, `data/redacao/modelos-trios.ts`).
  **7 redações, todas Trio 1:** povos tradicionais, saúde mental, dados na internet,
  cinema, cuidado, criança, registro civil. Imigração e diferença SAÍRAM: o Dom Hélder
  foi reprovado pelos juízes e 2 vezes pelo agy ("ligação forçada"); criança passou no
  agy depois de reescrita (`DOM_HELDER_FORA_DA_PROVA`). TODA redação-modelo é de trio
  (o teste barra modelo sem trio). Acima da redação, "o mesmo autor em N temas"
  (`components/redacao/autor-em-temas.tsx`): fala igual, 1 linha de ligação por tema,
  molde. **Só o repertório do trio ("eu só sei os trios... nada mais"):** a 1ª versão
  copiou a ligação dos juízes, com Lei 10.216, LGPD, ECA, STF, Setembro Amarelo. Agora
  o Drummond se liga ao próprio Pacto ("o Brasil assumiu esse compromisso há mais de
  trinta anos, mas...") e o resto é fato do dia a dia sem nome nem número; o teste
  barra ano e lei de fora. Pacto por tema: art. 7º trabalho, 9º previdência, 10
  criança, 11 moradia, 12 saúde, 13 educação, 15 cultura e ciência. Tela
  `/redacao/plano` ("Planejar com os trios"): tema real dos 28, ele escreve o plano e
  o site avalia sem IA (`lib/redacao/plano-quarteto.ts`); sugere só o Trio 1 (serve
  em 19 de 28) e mostra só a ligação das redações prontas, nunca a dos juízes.
- **Treino por partes = guia da receita de bolso (Pablo, 27/10/2026), sem IA por partes:**
  tema → 2 das 5 causas coringa → tese no molde → introdução, D1, D2,
  conclusão (molde à esquerda, caixa à direita, contador de ~70 caracteres
  por linha) → redação montada com a correção do site (desde 29/10, ver
  "Corrigir no passo 8"), checklist e "Copiar redação". Fonte única: `docs/redacao/receita-redacao.md` (dados em
  `lib/redacao/receita.ts`). Rascunho no localStorage a cada mudança, sem
  Neon. As rotas `/api/redacao/parts/*` e a correção por partes pela IA foram
  apagadas; a tabela EssayPartPractice fica (histórico, lida em /api/stats).
  **Para iniciante (Pablo, 27/10/2026):** todo nome de autor abre obra + ano +
  ideia em 1 linha (`lib/redacao/autores.ts`, ficha também na receita; nome
  solto = repertório de bolso); a introdução lista os autores das 2 causas; a
  tese já vem com as palavras do tema (`moldeTese`) e avisa sem palavra-chave;
  linha fixa com o tema e [problema] trocado nos moldes (`problemaDoTema`);
  "Ver exemplo" em cada passo, tema de 2020, escrito à mão
  (`lib/redacao/exemplo-receita.ts`, o teste confere molde, ponte e linhas). Desde
  07/11/2026 só com o Trio 1 (Drummond + Pacto, Rui, Dom Hélder); saíram Foucault,
  Barbacena, Goffman, Lei 10.216 e o dado do IBGE.
  **Rodada de qualidade (Pablo, 28/10/2026):** conteúdo por tema escrito à mão
  em `lib/redacao/conteudo-temas.ts` (7 temas da receita: forma curta, tópico
  por motivo, motivos fracos, perguntas-guia); o tema inteiro só na ponte da
  introdução, depois a forma curta ("Esse estigma decorre..."). Tese guarda
  `teseGerada`: automática é regerada ao trocar motivos, editada ganha "Seus
  motivos mudaram. Atualizar a tese?" (nunca sobrescreve). A tese entra
  sozinha como 3ª frase da introdução. "Ver uma redação pronta, explicada":
  a redação de 2020 como lista de trechos `{texto, funcao}`, grifo = rótulo +
  cor + traço (não só cor), tocar mostra 1 linha. Passo 4-7 na tela grande:
  molde à esquerda rola sozinho, caixa à direita parada, cabe em 1440×762
  sem rolar; abaixo de 1024 px o molde abre na 1ª visita de cada passo e
  recolhe nas outras (`moldesVistos`, 29/10/2026). Trocar de tema: motivos
  ainda iguais aos sugeridos do tema antigo viram os do novo (livre: nenhum);
  escolhidos à mão ficam, com o aviso "combina pouco" nos passos 1, 2 e 3.
  Frase genérica de motivo nunca depende do sujeito do tema ("esse grupo");
  motivo com aposto ganha a vírgula de fecho (`encaixar`); a ponte tira o
  "no Brasil"/"na sociedade brasileira" do fim do tema. Rótulos em `.type-rotulo`
  (12,8 px, sem caixa-alta); texto de leitura em `font-reading type-body`.
- **Me ajuda enquanto escreve (Pablo, 29/10/2026: "onde eu estou, qual a
  minha próxima ação, como posso explicar isso"):** nos passos 4 a 7, o botão
  "Me ajuda" abre a aba Ajuda do painel. Onde ele está (frase N de M) é
  CONTADO pelo código (`lib/redacao/onde-estou.ts`); a IA (Groq 120b,
  `AI_MODEL_AJUDA_REDACAO`, nunca o Gemini de 20/dia) dá a próxima ação e 2 a 3
  COMEÇOS de frase com o que completar, e responde "Travou? Pergunte". Nunca
  a frase inteira: o validador corta o começo em 14 palavras e descarta
  número que não está no texto, no tema ou na ficha (`lib/redacao/ajuda.ts`).
  "Usar este começo" não repete o pedaço que ele já tinha escrito. Medido:
  3 s por resposta. Teste: `tests/e2e/ajuda-escrita.e2e.ts`.
  **Contar frase não basta (aluno-do-zero, mesmo dia):** 2 frases fora do
  molde davam "Frase 3 de 4" e a ajuda mandava "continuar" a frase errada. A
  IA devolve `fraseAgora` (1ª função do molde ainda não feita); o código
  aceita só 1..total+1 e nunca além do contado. "Complete com" é cortado em 16
  palavras. Exemplo de formato com texto de verdade fez a IA copiar o exemplo
  e aceitar frase errada: o formato fica com lacunas `<...>`. Rótulos dizem
  "motivo 1/2" (o nome do passo 2), nunca "causa A/B" na tela.
- **Corrigir no passo 8 (Pablo, 29/10/2026: "melhorar com o tempo", "como um
  pai ensinando a engatinhar"; ele mandou escolher, e a escolha foi corrigir +
  comparar):** usa a correção OFICIAL (submit + evaluate, grava no histórico);
  nada de IA nova. `lib/redacao/devolutiva.ts` traduz os campos: nota grande,
  "+N desde a redação anterior", "Já funciona" (um fato do texto, sem
  elogio), "Treine agora" com UMA parte (nota mais baixa; empate c5, c2, c4,
  c3, c1; fuga e texto curto antes de tudo) e o botão "Treinar no passo N",
  meta em pontos ("de 120 para 160 pontos, cada parte vai até 200"). Regra:
  frase só com campo da correção que a sustente (4 revisores acharam 9 frases
  falsas na 1ª versão). O rascunho guarda `{essayId, texto}`: texto mudou =
  "Corrigir de novo"; igual = reabre sem gastar IA. Menos de 8 linhas não
  envia. Teste: `tests/e2e/corrigir-no-treino.e2e.ts` (devolve a correção
  real gravada em `correcao-leigo.json`, sem Neon). **Achado:** a correção
  oficial recusava texto com erro em 2 de 4 rodadas (a IA cola 2 frases ao
  citar a C4); `trechoExiste` aceita frase por frase, com 3+ palavras cada.
  **Aberto:** ela deu C5 = 200 para "o governo deve ajudar... campanhas na
  televisão", generosa demais; calibrar custa o golden set (1 rodada/dia).
- **Coringas PROVADOS (Pablo, 29/10/2026: "você tem que provar, não achismo"):**
  `CORINGAS` em `lib/redacao/autores.ts` traz só o que passou: 3 juízes cegos
  (Opus, Sonnet, Fable), 11 temas do ENEM de 2015 a 2025, com controles (Bauman
  colado "de bolso" teve 0 de 11 aprovados; âncoras repetidas deram o mesmo
  resultado). Passaram em 11 de 11: Drummond ("As leis não bastam"), Dom Hélder
  e Rui Barbosa. Em 8: Wiesel. Em 7: Graciliano e Luther King. Dado não é
  coringa: esgoto e violência tiveram 0 de 11, e o de 1888 só serviu em temas de
  raça (fica com `restricao`). Nas 47 redações nota 1000 (censo), "a lei
  existe, mas não basta" aparece em 18, nos 5 temas (a Constituição de 1988 em
  15), e "indiferença" em 29. Frase entre aspas aparece em só 5 de 47. Cada
  ficha mostra "Testado: serviu em X de 11". Coringa novo só entra depois de
  passar pela mesma prova (`docs/redacao/prova-coringas/`, scripts
  `montar_pilha.py` e `somar.py`). **Iniciante (30/10):** 3 alunos simulados
  foram de 0/9 para 4/9 parágrafos com repertório nota 200 após 1 leitura; a frase
  longa (Rui Barbosa) ninguém decora (ganhou `curta`), e ligar ao tema é o mais
  difícil (a ficha ganhou o molde "Isso se vê quando [fato do tema]"). A ficha
  não pode rolar: medido em 1440x900 com a ficha mais longa (0 px escondidos,
  contador fora da caixa; o e2e mede). **Corretor (30/10):** a IA escrevia a
  análise em "explica" e "amarra" no lugar da frase do aluno, e todo repertório
  virava "de bolso". O prompt pede a cópia e diz que a explicação pode estar na
  frase da citação. Em 6 correções, as originais voltaram a C2 = 200 e o Bauman
  colado foi pego. Aberto: a IA nem sempre lista o repertório da introdução, e
  falta o golden set. Também pede TODOS os repertórios, a começar pelo da
  introdução (que ficava de fora), e não aceita ligação genérica ("se relaciona
  com a problemática") como amarra. **Decorar (30/10):** baralho padrão "Coringas
  da redação" (matéria Redação, cor #0E7490), gerado de `CORINGAS` por
  `lib/redacao/cartoes-coringas.ts`. São 2 cartões por coringa: "Coringa para:
  <argumento>" e "complete a frase". A dica é a imagem e nunca usa palavra do
  verso (o teste barra). APAGADO em 07/11/2026 (ver "Flashcards de Redação = só a
  escadinha dos TRIOS"); o MEMORIA de cartoes-coringas.ts segue em uso. Antes:
  CORINGAS mudar. A lista de baralhos mostra o subtema como título.
  **Grandes assuntos (30/10):** nos 28 temas do ENEM de 1998 a 2025, agrupados
  em 9 grupos (o maior é "grupos vulneráveis", com 11), Drummond passou em
  28/28, Rui Barbosa em 24, Dom Hélder em 21, Graciliano em 19 e Wiesel em 18.
  A `prova` de cada ficha conta de 28. Nas 47 redações nota 1000, o coringa
  COLADO no parágrafo pronto vira "de bolso" (2/43 sustentam 200), e o
  parágrafo CONSTRUÍDO em volta dele, pelo molde do site, passa (34/47, contra
  17/47 do original). Regra: coringa é o esqueleto do parágrafo, nunca enfeite.
  Graciliano construído ficou 1/5 (forçado em racismo e velhice), então ganhou
  `restricao`. Relatório: `docs/redacao/repertorios-coringa.md`.
  **Rodadas 3 e 4 (06/11/2026):** 5 candidatos novos nos 28 temas, juízes
  mais baratos (Haiku, Sonnet, Fable), que repetiram as âncoras. Galeano e
  Brecht passaram em 18/28 e ENTRARAM no lugar de Luther King (12) e Machado
  (6), que saíram do site (estigma: Graciliano, Wiesel, Galeano; mercado:
  Drummond, Graciliano, Brecht). Darcy 16, João Cabral 12 (era 9/11 só nos
  temas recentes) e Milton Santos ficaram de fora. Melhor quarteto: Pacto +
  Drummond + Rui Barbosa + Dom Hélder (os 3 passaram juntos em 18 de 28).
  Gerador dos exemplos: `prova-coringas/novos.py`.
- **Menos poluição nos passos 4 a 7 (mesmo dia):** o molde destaca só a frase
  de agora (feitas com visto, futuras apagadas); "Pense antes" mudou para a
  aba Ajuda; ponte, conectivos e erros da proposta foram para "Mais dicas";
  autores recolhidos numa linha, abertos sozinhos na frase de repertório.
- **Lado a lado, como Bíblia em duas línguas (Pablo, 31/10/2026):** na tela
  grande, "Como escrever" à esquerda e "Sua vez" à direita, com uma linha no
  meio e sem caixa em volta do molde. O molde é UM parágrafo corrido em letra
  de 19 px (nada de lista 1, 2, 3); a frase de agora tem fundo, o nome dela
  vai em cima ("Agora, frase 2: Ponte..."), as feitas apagam e a tese vem
  sublinhada. "Sua vez" fica colado na caixa (no topo da coluna, cortava a
  ficha do autor; o `coringas.e2e` mede). Aba Exemplo segue em lista.
- **Aba Exemplo no SEU tema (Pablo, 02/11/2026: "o exemplo tem que ser desse
  tema", "quais frases eu posso utilizar, quais não"):** muda a regra antiga
  de nunca mostrar o tema do aluno. Tema do ENEM (os 28 da prova dos coringas):
  "Qual autor usar no seu tema?", autores com ✓/✗ pelo veredito dos 3 juízes
  NESSE tema, o parágrafo aprovado nele em 3 partes, "Pôr a frase do autor no
  meu texto" e "Me testar" (esconde as marcas; tocar revela uma). Sem
  "Escolha um assunto"; a redação pronta fica recolhida embaixo. Tema
  digitado fora da lista: exemplo em outro tema, como antes. Conclusão: só a
  redação pronta. Dados: `lib/redacao/coringas-por-tema.json`, de
  `docs/redacao/prova-coringas/por_tema.py`; teste `autores-no-tema.e2e`.
  Já falhava antes (não é desta mudança): no `coringas.e2e`, a ficha do
  Luther King passa 19 px em 1440 px.
- **Redação pronta parte por parte (Pablo, 02/11/2026: "primeiro mostra uma
  redação nota 1000... essa é a introdução, essa é a tese... depois a minha
  vez"):** o diálogo abre em "Parte por parte" (`redacao-por-partes.tsx`):
  uma tela por parágrafo, cada frase com o nome da função do molde em cima, a
  proposta com os 5 elementos grifados na frase e a legenda embaixo, e a
  última tela "Agora é a sua vez". "Inteira, com grifos" é a versão de 28/10.
  Medido: 0 px escondidos em 1366x768 e 2 px em 1440x762; no celular (375)
  rola dentro da tela, 154 a 320 px. Aba Exemplo, Drummond: "Em palavras
  simples" (de `MEMORIA`) e "Seu tema não tem uma lei própria?" com o molde
  da ligação e o Pacto Internacional dos Direitos Econômicos, Sociais e
  Culturais (`lib/redacao/lei-coringa.ts`; não é coringa, não passou pela
  prova, é a lei da amarra). Baralho padrão "Autores por tema": 28 cartões,
  um por tema, até 3 autores além do Drummond (que serve em todos), de
  `coringas-por-tema.json` (apagado em 07/11/2026 com a escadinha dos trios).
  **2ª rodada (mesmo dia, "mais bonitinho, bem ilustrado", sem texto a
  mais):** cada parte tem a folha da prova em miniatura à esquerda (as 30
  linhas, a parte de agora colorida frase por frase), a frase com barra e
  rótulo na cor da função dela (as mesmas `--grifo-*`), troca deslizando
  (sem AnimatePresence sob movimento reduzido) e a tela "Sua vez" com a folha
  inteira acesa. Quadro alargado para 58rem: 0 px escondidos em 1366x768,
  1440x762 e 1920x1030. **Motivo próprio** (`meusMotivos` no rascunho): no
  passo 2, "Tem outro motivo? Escreva do seu jeito", opcional; escrito, manda
  na tese ("da desinformação... e da falta de empatia...") e nos moldes
  (`meuMotivo` tira o ponto e põe o artigo em minúscula para contrair); a
  causa marcada continua dando os autores, e vale passar só com os
  escritos. **Correção:** número grudado na palavra ("desinformação1") é
  sobra de digitação (`ehSobraDeDigitacao`), não conta na C1 nem no "Treine
  agora". D2, "Mais dicas": ligar o 2º motivo ao 1º ("gerado pelo [motivo 1]").
- As redações-modelo de `data/redacao/modelos.ts` (textos originais, temas
  reais, cada trecho comentado) seguem em /redacao/modelos. Não inventa
  texto-base com IA. Repertório nos modelos: só o dos trios (ver acima).

