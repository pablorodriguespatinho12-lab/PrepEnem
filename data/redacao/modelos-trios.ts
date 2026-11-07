// Redações prontas dos trios: 3 temas por trio (Pablo, 07/11/2026: "faz em
// tipo 3 temas com o trio 1 e com o trio 2... preciso saber como você usa cada
// argumento em vários temas").
//
// REGRA (Pablo, mesmo dia: "eu só sei os trios... repertório que você vai
// utilizar: esses trios, nada mais"): o único repertório é o do trio — Pacto +
// Drummond, Rui Barbosa e Dom Hélder (Trio 1), Graciliano e Galeano (Trio 2).
// Nenhuma lei, órgão, campanha, dado ou detalhe de livro que ele não decorou:
// o Drummond se liga ao próprio Pacto ("o Brasil assumiu esse compromisso...,
// mas na prática..."), e a ligação de cada autor é fato do dia a dia, sem nome
// nem número. O teste (lib/redacao/trio-em-temas.test.ts) barra ano e lei de fora.
// Artigos do Pacto conferidos no Decreto 591/1992 (lib/redacao/lei-coringa.ts).

import type { RedacaoModelo } from './modelos';

const PACTO = 'O Pacto Internacional sobre Direitos Econômicos, Sociais e Culturais, adotado pela ONU em 1966 e assumido pelo Brasil em 1992,';
const DRUMMOND = 'como escreveu Carlos Drummond de Andrade no poema "Nosso tempo", "as leis não bastam. Os lírios não nascem da lei"';
const COMPROMISSO = 'o Brasil assumiu esse compromisso há mais de trinta anos';
const RUI = 'Na "Oração aos Moços" (1921), Rui Barbosa ensina que tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real';
const RUI_SENTIDO = 'Ou seja, quem vive em situação diferente precisa de cuidado diferente para ter os mesmos direitos';
const DOM_HELDER = 'Como dizia Dom Hélder Câmara, "quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles são pobres, chamam-me de comunista"';
const DOM_HELDER_SENTIDO = 'Em outras palavras, socorrer é aplaudido, mas investigar a causa incomoda';
const GRACILIANO = 'Em "Vidas Secas" (1938), de Graciliano Ramos, Fabiano, sertanejo pobre e explorado pelo patrão, passa a se ver como bicho: "Você é um bicho, Fabiano"';
const GALEANO = 'Eduardo Galeano, no texto "Os ninguéns", de "O Livro dos Abraços" (1989), descreve "os ninguéns: os filhos de ninguém, os donos de nada"';
const GALEANO_SENTIDO = 'Em outras palavras, há gente que a sociedade apaga, sem nome, sem voz e sem nada';
const LIRIOS = 'os lírios de Drummond poderão enfim nascer';

const CONTEXTO_TRIO = {
  1: 'Esta redação usa o Trio 1: Pacto + Drummond na introdução, Rui Barbosa no 1º desenvolvimento e Dom Hélder no 2º.',
  2: 'Esta redação usa o Trio 2: Pacto + Drummond na introdução, Graciliano no 1º desenvolvimento e Galeano no 2º.',
} as const;

/* Anotações que se repetem em toda redação de trio. */
const intro = (artigo: string, porqueArtigo: string) => [
  { trecho: `${PACTO} ${artigo}`, papel: 'repertorio' as const, porque: `A lei do trio: abre a introdução. ${porqueArtigo}` },
  { trecho: DRUMMOND, papel: 'repertorio' as const, porque: 'Drummond, igual nas 6 redações: a lei existe, mas sozinha não muda a vida.' },
  { trecho: COMPROMISSO, papel: 'contextualizacao' as const, porque: 'Liga o Drummond ao Brasil usando o próprio Pacto. Nenhuma lei nova: é igual nas 6.' },
];
const lirios = { trecho: LIRIOS, papel: 'retomada' as const, porque: 'Última frase: volta ao Drummond.' };

export const MODELOS_TRIOS: RedacaoModelo[] = [
  // ---------------------------------------------------------------- Trio 1
  {
    id: 'trio1-povos-tradicionais-2022',
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    anoEnem: 2022,
    trio: 1,
    rotulo: 'Povos tradicionais',
    contexto: `Povos e comunidades tradicionais, como indígenas, quilombolas e ribeirinhos, vivem de um jeito ligado à terra onde estão: dela tiram o sustento, a cultura e a história. ${CONTEXTO_TRIO[1]}`,
    usos: {
      Drummond: 'Pacto, art. 11 (alimentação e moradia): o direito existe, mas esses povos não são valorizados.',
      'Rui Barbosa': 'As mesmas regras da cidade para quem vive da terra.',
      'Dom Hélder': 'Cesta básica na crise, sem perguntar por que perderam a terra.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 11, o direito à alimentação e à moradia. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas indígenas, quilombolas e ribeirinhos ainda não são valorizados na prática. Tal cenário decorre, sobretudo, de regras iguais para quem vive de modo diferente e da falta de atenção às causas da perda de seus territórios.`,
        anotacoes: [
          ...intro('garante a todos, em seu artigo 11, o direito à alimentação e à moradia', 'O artigo 11 (alimentação e moradia) combina com povos que vivem da terra.'),
          { trecho: 'indígenas, quilombolas e ribeirinhos ainda não são valorizados na prática', papel: 'tese', porque: 'A tese responde à palavra "valorização" do tema.' },
          { trecho: 'de regras iguais para quem vive de modo diferente e da falta de atenção às causas da perda de seus territórios', papel: 'anuncio', porque: 'Motivo A (vai com o Rui) e motivo B (vai com o Dom Hélder).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, tratar os povos tradicionais com as mesmas regras pensadas para a cidade mantém a sua desvalorização. ${RUI}. ${RUI_SENTIDO}. Por isso, garantir a esses povos a terra onde vivem e uma escola que respeite sua língua e seu modo de vida não é privilégio, mas condição para que sejam valorizados. Logo, a igualdade apenas no papel apaga justamente o que os torna diferentes.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'tratar os povos tradicionais com as mesmas regras pensadas para a cidade mantém a sua desvalorização', papel: 'topico', porque: 'Retoma o motivo A da introdução.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual nas 3 redações do Trio 1, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Esta frase também é igual nas 3.' },
          { trecho: 'garantir a esses povos a terra onde vivem e uma escola que respeite sua língua e seu modo de vida não é privilégio', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem vive da terra.' },
          { trecho: 'Logo, a igualdade apenas no papel apaga justamente o que os torna diferentes', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade costuma ajudar esses povos nas crises sem perguntar por que elas acontecem. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, entregar cestas a aldeias e comunidades em crise é necessário, mas valorizar os povos tradicionais exige perguntar por que eles perderam a terra de onde tiravam o próprio sustento. Dessa forma, enquanto só a urgência for atendida, o problema continuará a se repetir.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade costuma ajudar esses povos nas crises sem perguntar por que elas acontecem', papel: 'topico', porque: 'Retoma o motivo B da introdução.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual nas 3 redações do Trio 1.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual nas 3.' },
          { trecho: 'entregar cestas a aldeias e comunidades em crise é necessário, mas valorizar os povos tradicionais exige perguntar por que eles perderam a terra', papel: 'analise', porque: 'A ligação: a "comida" é a cesta; a pergunta incômoda é a terra perdida.' },
          { trecho: 'Dessa forma, enquanto só a urgência for atendida, o problema continuará a se repetir', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 11 do Pacto saia do papel, são necessárias duas medidas. Primeiramente, o Governo Federal deve garantir a esses povos a posse das terras onde vivem, com equipes permanentes de fiscalização contra invasores, a fim de proteger o lugar de onde tiram o sustento. Ademais, o Ministério da Educação deve ampliar as escolas indígenas e quilombolas, com professores das próprias comunidades e material na língua de cada povo, para que a diferença seja tratada como valor. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 11 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'o Governo Federal', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'garantir a esses povos a posse das terras onde vivem', papel: 'acao', porque: 'O que faz: ataca o motivo B (a perda da terra).' },
          { trecho: 'com equipes permanentes de fiscalização contra invasores', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'a fim de proteger o lugar de onde tiram o sustento', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'com professores das próprias comunidades e material na língua de cada povo', papel: 'detalhamento', porque: 'Detalhe da 2ª proposta, que ataca o motivo A (regras iguais).' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio1-saude-mental-2020',
    tema: 'O estigma associado às doenças mentais na sociedade brasileira',
    anoEnem: 2020,
    trio: 1,
    rotulo: 'Saúde mental',
    contexto: `Depressão, ansiedade e outras doenças mentais ainda carregam rótulos como "louco" ou "fraco", e esse estigma afasta as pessoas do tratamento. ${CONTEXTO_TRIO[1]}`,
    usos: {
      Drummond: 'Pacto, art. 12 (saúde física e mental): o direito existe, mas o rótulo de "louco" continua.',
      'Rui Barbosa': 'A mesma cobrança para quem está doente e para quem está saudável.',
      'Dom Hélder': 'Campanha de um mês é aplaudida; perguntar por que falta psicólogo incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 12, o direito ao mais elevado nível possível de saúde física e mental. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas o estigma associado às doenças mentais ainda afasta muitos brasileiros do trabalho, da escola e da busca por ajuda. Tal cenário decorre, sobretudo, da cobrança igual para quem está doente e para quem está saudável e da falta de atenção às causas desse preconceito.`,
        anotacoes: [
          ...intro('garante a todos, em seu artigo 12, o direito ao mais elevado nível possível de saúde física e mental', 'O artigo 12 (saúde física e mental) é o que combina com o tema.'),
          { trecho: 'o estigma associado às doenças mentais ainda afasta muitos brasileiros do trabalho, da escola e da busca por ajuda', papel: 'tese', porque: 'A tese usa a palavra do tema: estigma.' },
          { trecho: 'da cobrança igual para quem está doente e para quem está saudável e da falta de atenção às causas desse preconceito', papel: 'anuncio', porque: 'Motivo A (vai com o Rui: tratar igual quem está diferente) e motivo B (vai com o Dom Hélder: a causa).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, cobrar de quem enfrenta uma doença mental o mesmo desempenho de quem está saudável reforça o estigma. ${RUI}. ${RUI_SENTIDO}. Por isso, quem enfrenta uma depressão ou uma crise de ansiedade e recebe no trabalho ou na escola a mesma cobrança dos outros, sem pausa nem acompanhamento, acaba visto como preguiçoso. Logo, esse tratamento "igual" transforma a doença em defeito de caráter.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'cobrar de quem enfrenta uma doença mental o mesmo desempenho de quem está saudável reforça o estigma', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual nas 3 redações do Trio 1, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual nas 3.' },
          { trecho: 'quem enfrenta uma depressão ou uma crise de ansiedade e recebe no trabalho ou na escola a mesma cobrança dos outros, sem pausa nem acompanhamento, acaba visto como preguiçoso', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem está doente.' },
          { trecho: 'Logo, esse tratamento "igual" transforma a doença em defeito de caráter', papel: 'fecho', porque: 'Volta à tese (estigma).' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, campanhas de conscientização que duram um mês são elogiadas, porém pouco se pergunta por que o estigma continua e por que é tão difícil conseguir um psicólogo de graça. Dessa forma, enquanto só a urgência for lembrada, o rótulo de "louco" continuará a afastar quem precisa de ajuda.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual nas 3 redações do Trio 1.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual nas 3.' },
          { trecho: 'campanhas de conscientização que duram um mês são elogiadas, porém pouco se pergunta por que o estigma continua e por que é tão difícil conseguir um psicólogo de graça', papel: 'analise', porque: 'A ligação: a "comida" aqui é a campanha; a pergunta incômoda é a falta de psicólogo.' },
          { trecho: 'Dessa forma, enquanto só a urgência for lembrada, o rótulo de "louco" continuará a afastar quem precisa de ajuda', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 12 do Pacto saia do papel, é preciso combater o estigma na raiz. O Ministério da Saúde, em parceria com o Ministério da Educação, deve ampliar o atendimento psicológico gratuito em escolas e postos de saúde, por meio da contratação de psicólogos e de rodas de conversa permanentes com alunos, professores e famílias, que expliquem que doença mental é doença, e não fraqueza, a fim de que quem sofre procure ajuda sem medo. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 12 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Ministério da Saúde, em parceria com o Ministério da Educação', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar o atendimento psicológico gratuito em escolas e postos de saúde', papel: 'acao', porque: 'O que faz: ataca o motivo B (falta de atendimento).' },
          { trecho: 'por meio da contratação de psicólogos e de rodas de conversa permanentes com alunos, professores e famílias', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'que expliquem que doença mental é doença, e não fraqueza', papel: 'detalhamento', porque: 'Detalha o modo e responde ao motivo A (visto como preguiçoso).' },
          { trecho: 'a fim de que quem sofre procure ajuda sem medo', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio1-dados-internet-2018',
    tema: 'Manipulação do comportamento do usuário pelo controle de dados na internet',
    anoEnem: 2018,
    trio: 1,
    rotulo: 'Dados na internet',
    contexto: `Redes sociais e sites coletam o que cada pessoa curte, procura e compra, e usam esses dados para decidir o que ela vai ver a seguir. ${CONTEXTO_TRIO[1]}`,
    usos: {
      Drummond: 'Pacto, art. 15 (progresso científico): o direito existe, mas o usuário segue manipulado.',
      'Rui Barbosa': 'Usuário e empresa assinam o mesmo termo de uso, sem o mesmo poder.',
      'Dom Hélder': 'Ensinar a ajustar a privacidade é bem-visto; questionar o lucro das plataformas incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 15, o direito de desfrutar do progresso científico e de suas aplicações. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas os usuários da internet continuam tendo seu comportamento manipulado por quem controla seus dados. Tal cenário decorre, sobretudo, da falsa igualdade entre o usuário e as grandes empresas de tecnologia e da falta de debate sobre o modelo de negócio das plataformas.`,
        anotacoes: [
          ...intro('garante a todos, em seu artigo 15, o direito de desfrutar do progresso científico e de suas aplicações', 'O artigo 15 (progresso científico) é o que combina com tecnologia.'),
          { trecho: 'os usuários da internet continuam tendo seu comportamento manipulado por quem controla seus dados', papel: 'tese', porque: 'A tese usa as palavras do tema: comportamento, manipulado, dados.' },
          { trecho: 'da falsa igualdade entre o usuário e as grandes empresas de tecnologia e da falta de debate sobre o modelo de negócio das plataformas', papel: 'anuncio', porque: 'Motivo A (Rui: falsa igualdade) e motivo B (Dom Hélder: a causa que ninguém discute).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, tratar o usuário comum como se tivesse o mesmo poder de uma grande empresa facilita a manipulação. ${RUI}. ${RUI_SENTIDO}. Por isso, quando o usuário e a plataforma assinam o mesmo "termo de uso", só a empresa sabe o que fará com os dados coletados, e quem clica em "aceito" sem entender fica exposto. Logo, essa igualdade de fachada entrega o comportamento do usuário a quem controla seus dados.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'tratar o usuário comum como se tivesse o mesmo poder de uma grande empresa facilita a manipulação', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, a mesma frase das outras 2 redações do Trio 1.' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual nas 3.' },
          { trecho: 'quando o usuário e a plataforma assinam o mesmo "termo de uso", só a empresa sabe o que fará com os dados coletados', papel: 'analise', porque: 'A ligação: os "desiguais tratados igual" aqui são o usuário e a empresa.' },
          { trecho: 'Logo, essa igualdade de fachada entrega o comportamento do usuário a quem controla seus dados', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade combate os sintomas sem questionar a causa da manipulação. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, ensinar o usuário a ajustar a privacidade é bem-visto, mas perguntar por que o lucro das plataformas depende de prender a atenção e conduzir escolhas encontra forte resistência. Dessa forma, enquanto só o usuário for cobrado, o sistema que o manipula continuará intacto.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade combate os sintomas sem questionar a causa da manipulação', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual nas 3 redações do Trio 1.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual nas 3.' },
          { trecho: 'ensinar o usuário a ajustar a privacidade é bem-visto, mas perguntar por que o lucro das plataformas depende de prender a atenção e conduzir escolhas encontra forte resistência', papel: 'analise', porque: 'A ligação: a "comida" é a dica de privacidade; a pergunta incômoda é o lucro das plataformas.' },
          { trecho: 'Dessa forma, enquanto só o usuário for cobrado, o sistema que o manipula continuará intacto', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 15 do Pacto se cumpra também na internet, é preciso equilibrar essa relação. O Governo Federal deve fiscalizar os termos de uso das grandes plataformas, por meio de auditorias periódicas e da exigência de um resumo, em linguagem simples, de quais dados são coletados e para quê, a fim de que o usuário decida com consciência. Ademais, as escolas devem ensinar educação digital nas aulas, para que os jovens reconheçam quando um aplicativo tenta conduzir suas escolhas. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 15 do Pacto se cumpra também na internet', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Governo Federal', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'fiscalizar os termos de uso das grandes plataformas', papel: 'acao', porque: 'O que faz: ataca o motivo A (o termo de uso desigual).' },
          { trecho: 'por meio de auditorias periódicas', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'da exigência de um resumo, em linguagem simples, de quais dados são coletados e para quê', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de que o usuário decida com consciência', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
  // ---------------------------------------------------------------- Trio 2
  {
    id: 'trio2-imigracao-2012',
    tema: 'O movimento imigratório para o Brasil no século XXI',
    anoEnem: 2012,
    trio: 2,
    rotulo: 'Imigração',
    contexto: `No século XXI, o Brasil passou a receber imigrantes de vários países, como haitianos, venezuelanos e bolivianos, que chegam em busca de trabalho e de uma vida melhor. ${CONTEXTO_TRIO[2]}`,
    usos: {
      Drummond: 'Pacto, art. 6º e 7º (trabalho digno): o direito existe, mas o imigrante não o tem na prática.',
      Graciliano: 'O imigrante sem documento, explorado no trabalho, é o Fabiano de hoje.',
      Galeano: 'Sem documento e sem falar português, o imigrante vira um ninguém.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seus artigos 6º e 7º, o direito ao trabalho digno. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil do século XXI: ${COMPROMISSO}, mas muitos dos imigrantes que chegam ao país ainda não têm esse direito na prática. Tal cenário decorre, sobretudo, da exploração do trabalho de quem está sem documentos e da invisibilidade desses imigrantes na sociedade.`,
        anotacoes: [
          ...intro('garante a todos, em seus artigos 6º e 7º, o direito ao trabalho digno', 'Artigos 6º e 7º (trabalho) combinam com quem migra para trabalhar.'),
          { trecho: 'muitos dos imigrantes que chegam ao país ainda não têm esse direito na prática', papel: 'tese', porque: 'A tese: o direito não chegou ao imigrante.' },
          { trecho: 'da exploração do trabalho de quem está sem documentos e da invisibilidade desses imigrantes na sociedade', papel: 'anuncio', porque: 'Motivo A (vai com o Graciliano) e motivo B (vai com o Galeano).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, a falta de documentos deixa o imigrante exposto à exploração. ${GRACILIANO}. Ou seja, quem é explorado sem direitos acaba perdendo a noção da própria dignidade. Da mesma forma, muitos imigrantes sem documentos aceitam jornadas longas e mal pagas, sem carteira assinada, por medo de serem mandados embora do país. Logo, sem trabalho formal, o imigrante de hoje repete a história do retirante do sertão.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'a falta de documentos deixa o imigrante exposto à exploração', papel: 'topico', porque: 'Retoma o motivo A da introdução.' },
          { trecho: GRACILIANO, papel: 'repertorio', porque: 'Graciliano, igual nas 3 redações do Trio 2.' },
          { trecho: 'Ou seja, quem é explorado sem direitos acaba perdendo a noção da própria dignidade', papel: 'analise', porque: 'O que o Graciliano quer dizer.' },
          { trecho: 'muitos imigrantes sem documentos aceitam jornadas longas e mal pagas, sem carteira assinada, por medo de serem mandados embora do país', papel: 'analise', porque: 'A ligação com o tema: o Fabiano de hoje.' },
          { trecho: 'Logo, sem trabalho formal, o imigrante de hoje repete a história do retirante do sertão', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade ainda trata o imigrante recém-chegado como se ele não existisse. ${GALEANO}. ${GALEANO_SENTIDO}. Assim, o imigrante sem documentos, sem rede de apoio e sem falar português corre o risco de virar esse ninguém, invisível para os serviços públicos e para os vizinhos. Dessa forma, acolhê-lo é, antes de tudo, reconhecer que ele existe e tem direitos.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade ainda trata o imigrante recém-chegado como se ele não existisse', papel: 'topico', porque: 'Retoma o motivo B da introdução.' },
          { trecho: GALEANO, papel: 'repertorio', porque: 'Galeano, igual nas 3 redações do Trio 2.' },
          { trecho: GALEANO_SENTIDO, papel: 'analise', porque: 'O que o Galeano quer dizer. Igual nas 3.' },
          { trecho: 'o imigrante sem documentos, sem rede de apoio e sem falar português corre o risco de virar esse ninguém', papel: 'analise', porque: 'A ligação com o tema.' },
          { trecho: 'Dessa forma, acolhê-lo é, antes de tudo, reconhecer que ele existe e tem direitos', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que os artigos 6º e 7º do Pacto saiam do papel, são necessárias duas medidas. Primeiramente, o Ministério do Trabalho deve ampliar a fiscalização em oficinas e fazendas que empregam imigrantes, por meio de equipes que visitem esses locais e ajudem os trabalhadores a tirar a carteira de trabalho, a fim de acabar com a exploração de quem está sem documentos. Ademais, as prefeituras das cidades que mais recebem imigrantes devem oferecer cursos gratuitos de português e centros de acolhida, para que essas pessoas deixem de ser invisíveis. Desse modo, além da lei, haverá ação, e ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que os artigos 6º e 7º do Pacto saiam do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'o Ministério do Trabalho', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar a fiscalização em oficinas e fazendas que empregam imigrantes', papel: 'acao', porque: 'O que faz: ataca o motivo A (exploração).' },
          { trecho: 'por meio de equipes que visitem esses locais', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'ajudem os trabalhadores a tirar a carteira de trabalho', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de acabar com a exploração de quem está sem documentos', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio2-crianca-2000',
    tema: 'Direitos da criança e do adolescente: como enfrentar esse desafio nacional',
    anoEnem: 2000,
    trio: 2,
    rotulo: 'Criança',
    contexto: `Crianças e adolescentes têm direito à escola, à saúde e a brincar, mas muitos trabalham, abandonam os estudos ou crescem sem proteção. ${CONTEXTO_TRIO[2]}`,
    usos: {
      Drummond: 'Pacto, art. 10 (proteção da criança): o direito existe, mas há criança trabalhando.',
      Graciliano: 'A criança pobre que sai da escola para trabalhar herda o destino de Fabiano.',
      Galeano: 'A criança que some da escola sem ninguém notar é um filho de ninguém.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas, com crianças ainda trabalhando e abandonando a escola, os direitos de muitas crianças e adolescentes não saem do papel. Tal cenário decorre, sobretudo, da miséria que tira a criança da escola e da invisibilidade de quem cresce sem proteção.`,
        anotacoes: [
          ...intro('garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes', 'O artigo 10 (proteção da criança) é o que combina com o tema.'),
          { trecho: 'os direitos de muitas crianças e adolescentes não saem do papel', papel: 'tese', porque: 'A tese usa as palavras do tema: direitos da criança e do adolescente.' },
          { trecho: 'da miséria que tira a criança da escola e da invisibilidade de quem cresce sem proteção', papel: 'anuncio', porque: 'Motivo A (Graciliano: a miséria) e motivo B (Galeano: a invisibilidade).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, a pobreza rouba da criança o direito de aprender e de brincar. ${GRACILIANO}. Ou seja, a miséria faz a pessoa se ver como menos que gente, e esse peso passa dos pais para os filhos. Da mesma forma, crianças pobres ainda são afastadas da escola para ajudar no sustento da família. Logo, sem renda digna para os pais, o filho herda o destino de Fabiano.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'a pobreza rouba da criança o direito de aprender e de brincar', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: GRACILIANO, papel: 'repertorio', porque: 'Graciliano, igual nas 3 redações do Trio 2.' },
          { trecho: 'Ou seja, a miséria faz a pessoa se ver como menos que gente, e esse peso passa dos pais para os filhos', papel: 'analise', porque: 'O que o Graciliano quer dizer, puxado para a criança.' },
          { trecho: 'crianças pobres ainda são afastadas da escola para ajudar no sustento da família', papel: 'analise', porque: 'A ligação: o filho do Fabiano de hoje.' },
          { trecho: 'Logo, sem renda digna para os pais, o filho herda o destino de Fabiano', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, muitas crianças e adolescentes crescem sem que ninguém as veja. ${GALEANO}. ${GALEANO_SENTIDO}. Assim, a criança que trabalha nas ruas ou abandona a escola sem que a escola, o bairro ou o Estado percebam vive exatamente como esse filho de ninguém. Dessa forma, enfrentar esse desafio nacional é, antes de tudo, tirá-la dessa condição.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'muitas crianças e adolescentes crescem sem que ninguém as veja', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: GALEANO, papel: 'repertorio', porque: 'Galeano, igual nas 3 redações do Trio 2.' },
          { trecho: GALEANO_SENTIDO, papel: 'analise', porque: 'O que o Galeano quer dizer. Igual nas 3.' },
          { trecho: 'a criança que trabalha nas ruas ou abandona a escola sem que a escola, o bairro ou o Estado percebam vive exatamente como esse filho de ninguém', papel: 'analise', porque: 'A ligação: aqui o "ninguém" é literalmente um filho.' },
          { trecho: 'Dessa forma, enfrentar esse desafio nacional é, antes de tudo, tirá-la dessa condição', papel: 'fecho', porque: 'Volta à tese com as palavras do tema ("desafio nacional").' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 10 do Pacto saia do papel, são necessárias duas medidas. Primeiramente, o Governo Federal, em parceria com os municípios, deve ampliar programas de renda e de escola em tempo integral para famílias pobres, por meio de vagas com refeição e atividades no contraturno, a fim de que nenhuma criança precise trabalhar para ajudar em casa. Ademais, as escolas, junto com as prefeituras, devem acompanhar cada aluno que falta muito às aulas, com visitas às famílias, para que essas crianças deixem de ser invisíveis. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 10 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'o Governo Federal, em parceria com os municípios', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar programas de renda e de escola em tempo integral para famílias pobres', papel: 'acao', porque: 'O que faz: ataca o motivo A (a miséria).' },
          { trecho: 'por meio de vagas com refeição e atividades no contraturno', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'a fim de que nenhuma criança precise trabalhar para ajudar em casa', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'com visitas às famílias', papel: 'detalhamento', porque: 'Detalha a 2ª medida: ataca o motivo B (ninguém nota).' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio2-diferenca-2007',
    tema: 'O desafio de se conviver com a diferença',
    anoEnem: 2007,
    trio: 2,
    rotulo: 'Diferença',
    contexto: `Conviver com a diferença é respeitar quem tem outra cor, outro sotaque, outra religião ou outro jeito de amar. ${CONTEXTO_TRIO[2]}`,
    usos: {
      Drummond: 'Pacto, art. 13 (educação para a tolerância): o direito existe, mas as ofensas continuam.',
      Graciliano: 'O nordestino que esconde o sotaque: o preconceito vira a imagem de si.',
      Galeano: 'Quem foge do padrão vira um ninguém, invisível ou rejeitado.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} determina, em seu artigo 13, que a educação favoreça a compreensão e a tolerância entre todos os grupos raciais, étnicos ou religiosos. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas ofensas contra negros, pessoas LGBT e nordestinos continuam frequentes, o que mostra que o país ainda não aprendeu a conviver com a diferença. Tal cenário decorre, sobretudo, do preconceito que faz o outro se ver como inferior e da invisibilidade de quem foge do padrão dominante.`,
        anotacoes: [
          ...intro('determina, em seu artigo 13, que a educação favoreça a compreensão e a tolerância entre todos os grupos raciais, étnicos ou religiosos', 'O artigo 13 (educação para a tolerância) é o que combina com o tema.'),
          { trecho: 'o país ainda não aprendeu a conviver com a diferença', papel: 'tese', porque: 'A tese usa as palavras do tema: conviver com a diferença.' },
          { trecho: 'do preconceito que faz o outro se ver como inferior e da invisibilidade de quem foge do padrão dominante', papel: 'anuncio', porque: 'Motivo A (Graciliano: se ver como bicho) e motivo B (Galeano: os ninguéns).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, o preconceito repetido faz quem é diferente acreditar que vale menos. ${GRACILIANO}. Ou seja, o desprezo dos outros acaba virando a imagem que a pessoa tem de si. O mesmo acontece com nordestinos alvo de piadas e ofensas em outras regiões, que muitas vezes escondem o sotaque para serem aceitos. Logo, uma sociedade que não convive com a diferença obriga o outro a apagar quem é.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'o preconceito repetido faz quem é diferente acreditar que vale menos', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: GRACILIANO, papel: 'repertorio', porque: 'Graciliano, igual nas 3 redações do Trio 2.' },
          { trecho: 'Ou seja, o desprezo dos outros acaba virando a imagem que a pessoa tem de si', papel: 'analise', porque: 'O que o Graciliano quer dizer aqui.' },
          { trecho: 'nordestinos alvo de piadas e ofensas em outras regiões, que muitas vezes escondem o sotaque para serem aceitos', papel: 'analise', porque: 'A ligação: o Fabiano de hoje é quem esconde o sotaque.' },
          { trecho: 'Logo, uma sociedade que não convive com a diferença obriga o outro a apagar quem é', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, quem foge do padrão dominante costuma ser tratado como se não existisse. ${GALEANO}. ${GALEANO_SENTIDO}. Assim, a pessoa negra, LGBT ou com deficiência que raramente aparece nos livros, nas novelas e nos cargos de destaque vira esse ninguém, invisível ou rejeitada. Dessa forma, conviver com a diferença começa por reconhecer que ela existe e tem lugar.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'quem foge do padrão dominante costuma ser tratado como se não existisse', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: GALEANO, papel: 'repertorio', porque: 'Galeano, igual nas 3 redações do Trio 2.' },
          { trecho: GALEANO_SENTIDO, papel: 'analise', porque: 'O que o Galeano quer dizer. Igual nas 3.' },
          { trecho: 'a pessoa negra, LGBT ou com deficiência que raramente aparece nos livros, nas novelas e nos cargos de destaque vira esse ninguém', papel: 'analise', porque: 'A ligação: aqui o "ninguém" é quem é diferente do padrão.' },
          { trecho: 'Dessa forma, conviver com a diferença começa por reconhecer que ela existe e tem lugar', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 13 do Pacto saia do papel, é preciso ensinar a conviver. O Ministério da Educação deve incluir o respeito à diversidade em todas as etapas da escola, por meio de projetos em sala com histórias de vida de pessoas negras, LGBT, nordestinas e com deficiência, contadas por elas mesmas em rodas de conversa, a fim de que o diferente deixe de ser visto como inferior. Desse modo, a escola ensinará o que a lei sozinha não ensina, e ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 13 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Ministério da Educação', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'incluir o respeito à diversidade em todas as etapas da escola', papel: 'acao', porque: 'O que faz.' },
          { trecho: 'por meio de projetos em sala com histórias de vida de pessoas negras, LGBT, nordestinas e com deficiência', papel: 'modo', porque: 'Como faz: dá rosto a quem era "ninguém" (motivo B).' },
          { trecho: 'contadas por elas mesmas em rodas de conversa', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de que o diferente deixe de ser visto como inferior', papel: 'efeito', porque: 'Para quê: responde ao motivo A.' },
          lirios,
        ],
      },
    },
  },
];
