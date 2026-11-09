# 3 buracos reais em serviços públicos (pesquisa de 09/11/2026)

Investiguei 12 candidatas. 9 caíram no teste "não existe" (lista no fim).
As 3 abaixo passaram nos 3 testes. Os números marcados com **(medi)** saíram de
script que eu rodei nos arquivos oficiais nesta pesquisa.

---

## 1. Vigia do Remédio — aviso quando o remédio de casa é proibido ou recolhido

**Ideia:** a pessoa digita os remédios que usa (nome ou registro). O site confere
todo dia a lista de medidas da Anvisa (proibição, recolhimento, suspensão) e
mostra/avisa quando bate com algum remédio dela, em linguagem simples e com o link oficial.

### Dor real
- Proteste, 02/02/2026 ("Recolhimento de medicamentos Anvisa: saiba como agir"):
  > "Embora a Anvisa utilize canais oficiais, a notícia nem sempre alcança o paciente
  > no tempo ideal. Isso ocorre porque os comunicados usam termos muito técnicos.
  > Além do mais, poucas pessoas consultam o portal do governo diariamente."
  https://minhasaude.proteste.org.br/recolhimento-de-medicamentos-anvisa-veja-a-lista-de-lotes-e-como-agir/
  (exemplos do mesmo texto: caixa de pantoprazol com outro remédio dentro; lote falso de Mounjaro)
- iG Saúde, 10/07/2026, "Como saber se um produto foi recolhido pela Anvisa" — o caminho
  ensinado é entrar no portal e conferir lote a lote, à mão.
  https://saude.ig.com.br/2026-07-10/como-saber-se-um-produto-foi-recolhido-pela-anvisa.html
- Volume **(medi)**: 239 casos (dossiês) de medicamento com medida da Anvisa em 2026
  até outubro, contra 172 em 2025 inteiro. Em 2026: 2.237 proibições, 412 apreensões,
  280 suspensões, 57 recolhimentos (linhas do arquivo).

### Dado aberto (funcionando em nov/2026)
- **Produtos irregulares** — CSV, separador `;`, latin1, 98 MB, carga de 13/10/2026:
  https://dados.anvisa.gov.br/dados/CONSULTAS/EMPRESA_FISCALIZACAO_PRODUTO/TA_CONSULTA_PRODUTOS_IRREGULARES_RESULTADO.CSV
  Colunas úteis: `DS_TIPO_PRODUTO` (Medicamento), `PRODUTO`, `REGISTRO`,
  `DS_ACAO_FISCALIZACAO`, `DT_PUBLICACAO`, `NO_EMPRESA_INVESTIGADA`. Baixei e li (medi).
- **Medicamentos registrados** (para o campo de busca com autocompletar) — CSV mensal:
  https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv (atualizado 13/10/2026)
- Bônus: espelho em Parquet de terceiro, com dicionário explicado:
  https://vasfvitor.github.io/anvisa-api/dicionario.html

### Não existe (o que achei e o que falta)
- **PharmaDB** (pharmadb.com.br/monitoramento-regulatorio): faz exatamente o alerta,
  mas é para empresa — webhook com assinatura HMAC, plano pago. Cidadão não usa.
- **Sara.com.br/recall-de-medicamento**: só remédios do grupo EMS.
- **QARACloud**: dispositivos médicos, para empresas.
- **Anvisa (consultas.anvisa.gov.br, consultarecall)**: só consulta manual, sem lista
  pessoal e sem aviso.
- GitHub: projetos de bula, preço e MCP (mcp-saude-br), nenhum com "minha caixinha + aviso".
  O parecido (RecallAlert-AI) é dos EUA (FDA).

### 1ª versão para iniciante: 2 dias
- Dia 1: script (GitHub Actions, 1x por dia) baixa o CSV, filtra `Medicamento` e salva
  um JSON pequeno no repositório. Página Next.js com busca e "minha caixinha" salva no navegador.
- Dia 2: ao abrir a página, cruza a caixinha com o JSON e mostra o alerta com o link oficial.
  E-mail diário (Resend, plano gratuito) fica para a versão 2.
- Não se passar por oficial: rodapé "projeto independente, não é a Anvisa; confira sempre
  o lote no link oficial; não pare remédio sem falar com o médico".
- Cuidado técnico: o nome do produto vem escrito de jeitos diferentes; casar por
  número de registro quando houver.

---

## 2. Onde Nascer — taxa de cesárea de cada maternidade da minha cidade

**Ideia:** a gestante digita a cidade e vê as maternidades, com quantos partos foram
normais e quantos cesárea — e a taxa no grupo de baixo risco (grupo 1 de Robson),
que é a comparação justa entre hospitais.

### Dor real
- BBC Brasil, 24/10/2014 (sobre a regra da ANS, que só vale para plano de saúde):
  > "são muito comuns os casos de médicos que, ao longo da gestação, convencem a grávida
  > que queria parto normal a fazer uma cesárea."
  https://www.bbc.com/portuguese/noticias/2014/10/141021_ans_normas_cesareas_mdb
- Doutor Jairo, 22/07/2022, médico citado na matéria:
  > "entre 70% e 80% das mulheres brasileiras que dão à luz pelos serviços oferecidos pela
  > saúde suplementar preferiam um parto vaginal" ... "É fundamental que a maternidade
  > publique ou deixe acessível ... suas taxas de partos por via vaginal e as de cesáreas."
  https://doutorjairo.com.br/leia/maternidade-12-pontos-para-levar-em-conta-na-hora-de-escolher/
- Hoje, quem tem plano precisa **pedir** a taxa à operadora e esperar até 15 dias úteis
  (cartão da gestante da ANS). Quem usa o SUS não tem nem esse caminho.
- Tamanho do problema **(medi, SINASC 2024)**: 2.389.325 nascimentos; 3.031 locais com 30
  ou mais partos; taxa de cesárea mediana por local = 71%. No grupo de baixo risco a taxa
  vai de 16% (10% melhores) a 87% (10% piores) — diferença enorme entre hospitais vizinhos.

### Dado aberto (funcionando em nov/2026)
- **SINASC** (nascidos vivos) — CSV zipado, Portal de Dados Abertos do SUS:
  - 2024: https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/SINASC/csv/SINASC_2024_csv.zip
    (92 MB, publicado 08/05/2026 — baixei e processei)
  - 2025 preliminar: https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/SINASC/csv/SINASC_2025_csv.zip
    (102 MB, 31/08/2026)
  - Colunas: `CODESTAB` (código CNES do hospital), `PARTO` (1 vaginal, 2 cesárea),
    `TPROBSON` (grupo de risco), `CODMUNNASC`.
- **CNES** (nome e endereço do hospital pelo código) — CSV/API:
  https://dadosabertos.saude.gov.br (conjunto "CNES - Cadastro Nacional de Estabelecimentos de Saúde")

### Não existe (o que achei e o que falta)
- **Painel da ANS** (Atenção Materna e Neonatal): por hospital, mas só rede privada/planos.
- **Parto dos Dados (USP)**: por hospital, mas só a cidade de São Paulo.
- **Prefeitura do Rio**: PDF mensal só das maternidades da cidade.
- **Painel Robson do Ministério da Saúde** (plataforma.saude.gov.br/natalidade/grupos-de-robson):
  filtra por UF e localidade; não achei visão por hospital.
- Nenhum site nacional, por cidade, com todos os hospitais, em linguagem simples.

### 1ª versão para iniciante: 2 a 3 dias
- Dia 1: script Python lê o SINASC uma vez e gera um JSON por cidade
  (hospital, total de partos, % cesárea, % cesárea no grupo 1). Só hospitais com 30+ partos.
- Dia 2: página Next.js — escolhe a cidade, vê a lista ordenada, com barra simples.
- Dia 3 (opcional): nome e endereço pelo CNES.
- Cuidados: (1) hospital de alto risco tem mais cesárea por motivo bom — por isso o
  número principal é o do grupo 1, e o texto diz isso; (2) aviso "não é o Ministério da
  Saúde; converse com seu médico"; (3) não mostrar nada de pessoa, só total por hospital.

---

## 3. Gratuidade na Estrada — em que dia o ônibus tem vaga grátis (idoso, ID Jovem, PcD)

**Ideia:** a pessoa escolhe origem e destino interestaduais e vê só os horários em que a
gratuidade é obrigatória, em que dias da semana, de qual empresa. Se for negada, o site
monta o texto da denúncia para a ANTT (166 / Fala.BR) com os dados certos.

### Dor real (Reclame Aqui, 2026)
- Gontijo, viagem de 22/10/2026, Guanambi/BA → São Paulo/SP: a passageira não achava viagem
  com ID Jovem; a empresa respondeu que o serviço convencional (único com gratuidade) só roda
  "às terças, quartas, sextas, sábados e domingos".
  https://www.reclameaqui.com.br/gontijo/nao-consigo-usar-meu-id-jovem-para-comprar-passagens-na-gontijo_lkqd1e4beMpRNzSq/
- Expresso Guanabara, viagem de 10/01/2026, Juazeiro do Norte → Brasília:
  > "o sistema informa que a passagem ID Jovem não está disponível para a data (final de
  > semana)... o veículo está quase totalmente vago."
  https://www.reclameaqui.com.br/expresso-guanabara/negaram-meu-direito-a-passagem-id-jovem-na-expresso-guanabara_qA9xbVPoLYa3pK7P/
- ClickBus/Expresso Nordeste, avaliada em 09/10/2026: só havia semileito e leito na data.
  https://www.reclameaqui.com.br/clickbus/clickbus-impede-uso-do-beneficio-id-jovem-em-passagens-interestaduais-desrespeitando-legislacao_ATlYs7nL115qeB6X/
- O motivo, **medido (horários ANTT de nov/2026)**: 10.852 horários; 52% têm gratuidade;
  **90% desses rodam só 1 dia por semana** (mediana 1 dia), contra mediana de 6 dias nos
  horários sem gratuidade. A pessoa procura no dia errado e acha que foi enganada (ou é).

### Dado aberto (funcionando em nov/2026)
- **Horários – SIGMA (ANTT)** — CSV `;` latin1, ~6 MB, atualizado 08/11/2026:
  https://dados.antt.gov.br/dataset/a8729428-f382-430c-abe5-6e5f85aa9a03/resource/fe7e6692-d36c-49ad-ae13-1799931c74cb/download/11-2026_horarios_sigma.csv
  Colunas: `razao_social`, `descricao_linha`, `tipo_veiculo`, `sentido`, `horario`,
  **`gratuidade` (sim/não)**, uma coluna por dia da semana e por mês. Baixei e li (medi).
- **Empresas, Linhas e Seções – SIGMA** (cidades intermediárias de cada linha), mesmo conjunto:
  https://dados.antt.gov.br/dataset/gerenciamento-de-autorizacoes
- Bônus: **Monitriip Bilhetes** (até set/2026) traz, por trecho, quantos bilhetes de
  "Bilhete de Viagem do Idoso 100%" e ID Jovem foram emitidos — prova de que o trecho dá gratuidade.
  https://dados.antt.gov.br/dataset/monitriip-bilhetes-de-passagem

### Não existe (o que achei e o que falta)
- **Quadro de Horários da ANTT** (oficial): mostra linhas, dias e tipo de serviço. Não abri
  a tela por dentro; pelo texto oficial, ela não filtra "só horários com gratuidade" nem
  ajuda a reclamar. É o ponto mais fraco desta candidata — conferir antes de começar.
- Sites de notícia/blog (Gente e Mercado 19/10/2026, DaniMeller 22/10/2025): só explicam a regra.
- ClickBus e sites das empresas escondem a viagem quando não há convencional — exatamente a queixa.

### 1ª versão para iniciante: 1 a 2 dias
- Dia 1: script converte o CSV em JSON (só `gratuidade = sim`); página com dois campos
  (origem, destino) e a resposta "toda terça, 19h, Empresa X".
- Dia 2: botão "fui recusado" gera o texto pronto para o Fala.BR/166 com empresa, linha,
  data e o lembrete de pedir o documento de recusa.
- Aviso: "não é a ANTT; a vaga depende de lotação (2 grátis + 2 com 50% por ônibus)".
- Cuidado técnico: `descricao_linha` só tem as pontas; para cidades do meio usar o arquivo
  de seções.

---

## As 9 que caíram (o que já existe)

| Candidata | Por que caiu |
|---|---|
| Remédio grátis no Farmácia Popular | Já existem Busca-Remédio (buscaremedio.app), RotaMed (rotamed.com.br), Tem no SUS, farmaciapopular.com |
| Calculadora "quais benefícios tenho direito" | Raio-X Social, guiacadunico.com/ferramentas, calculadoravirtual.com (dezenas) |
| Preço máximo do remédio (CMED) | Painel oficial da Anvisa (2024) + Busca-Remédio + Reco do Remédio |
| "O SUS cobre esse exame/cirurgia?" | PerguntaSaúde tem página por código SIGTAP, atualizada set/2026 |
| Fila do INSS | Bússola do INSS (atualizada 02/11/2026) + painel oficial |
| Água da torneira (SISAGUA) | MPF "Água Boa de Beber" por município; Mapa da Água (Repórter Brasil) parado em dados de 2021 |
| Obras de creche/escola paradas | Painel SIMEC Obras, Painel do Pacto (TCU/MPF), app União Cidadã |
| Escola com sala de recursos (AEE) perto | escol.as já mostra AEE por escola (Censo 2024); a dor maior é falta de profissional de apoio, que não tem dado aberto |
| Remédio de alto custo (CEAF) por doença | RotaMed já cobre "Alto Custo"; documentos mudam por estado (sem base única) |

## Arquivos que baixei para medir (scratchpad, não vão para o repositório)
- anvisa/irreg.csv, antt/horarios.csv, sinasc/s24.zip
