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
const LIRIOS = 'os lírios de Drummond poderão enfim nascer';

/* Anotações que se repetem em toda redação de trio. */
const intro = (artigo: string, porqueArtigo: string) => [
  { trecho: `${PACTO} ${artigo}`, papel: 'repertorio' as const, porque: `A lei do trio: abre a introdução. ${porqueArtigo}` },
  { trecho: DRUMMOND, papel: 'repertorio' as const, porque: 'Drummond, igual em todas as redações: a lei existe, mas sozinha não muda a vida.' },
  { trecho: COMPROMISSO, papel: 'contextualizacao' as const, porque: 'Liga o Drummond ao Brasil usando o próprio Pacto. Nenhuma lei nova: é igual em todas.' },
];
const lirios = { trecho: LIRIOS, papel: 'retomada' as const, porque: 'Última frase: volta ao Drummond.' };

export const MODELOS_TRIOS: RedacaoModelo[] = [
  {
    id: 'trio1-povos-tradicionais-2022',
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    anoEnem: 2022,
    trio: 1,
    rotulo: 'Povos tradicionais',
    contexto: `Povos e comunidades tradicionais, como indígenas, quilombolas e ribeirinhos, vivem de um jeito ligado à terra onde estão: dela tiram o sustento, a cultura e a história.`,
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
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Esta frase também é igual em todas.' },
          { trecho: 'garantir a esses povos a terra onde vivem e uma escola que respeite sua língua e seu modo de vida não é privilégio', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem vive da terra.' },
          { trecho: 'Logo, a igualdade apenas no papel apaga justamente o que os torna diferentes', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade costuma ajudar esses povos nas crises sem perguntar por que elas acontecem. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, entregar cestas a aldeias e comunidades em crise é necessário, mas valorizar os povos tradicionais exige perguntar por que eles perderam a terra de onde tiravam o próprio sustento. Dessa forma, enquanto só a urgência for atendida, o problema continuará a se repetir.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade costuma ajudar esses povos nas crises sem perguntar por que elas acontecem', papel: 'topico', porque: 'Retoma o motivo B da introdução.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
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
    contexto: `Depressão, ansiedade e outras doenças mentais ainda carregam rótulos como "louco" ou "fraco", e esse estigma afasta as pessoas do tratamento.`,
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
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'quem enfrenta uma depressão ou uma crise de ansiedade e recebe no trabalho ou na escola a mesma cobrança dos outros, sem pausa nem acompanhamento, acaba visto como preguiçoso', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem está doente.' },
          { trecho: 'Logo, esse tratamento "igual" transforma a doença em defeito de caráter', papel: 'fecho', porque: 'Volta à tese (estigma).' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, campanhas de conscientização que duram um mês são elogiadas, porém pouco se pergunta por que o estigma continua e por que é tão difícil conseguir um psicólogo de graça. Dessa forma, enquanto só a urgência for lembrada, o rótulo de "louco" continuará a afastar quem precisa de ajuda.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
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
    contexto: `Redes sociais e sites coletam o que cada pessoa curte, procura e compra, e usam esses dados para decidir o que ela vai ver a seguir.`,
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
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações.' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'quando o usuário e a plataforma assinam o mesmo "termo de uso", só a empresa sabe o que fará com os dados coletados', papel: 'analise', porque: 'A ligação: os "desiguais tratados igual" aqui são o usuário e a empresa.' },
          { trecho: 'Logo, essa igualdade de fachada entrega o comportamento do usuário a quem controla seus dados', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade combate os sintomas sem questionar a causa da manipulação. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, ensinar o usuário a ajustar a privacidade é bem-visto, mas perguntar por que o lucro das plataformas depende de prender a atenção e conduzir escolhas encontra forte resistência. Dessa forma, enquanto só o usuário for cobrado, o sistema que o manipula continuará intacto.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade combate os sintomas sem questionar a causa da manipulação', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
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
  {
    id: 'trio1-cinema-2019',
    tema: 'Democratização do acesso ao cinema no Brasil',
    anoEnem: 2019,
    trio: 1,
    rotulo: 'Cinema',
    contexto: 'O cinema é uma forma de cultura e de lazer, mas as salas se concentram nas capitais e em shoppings de bairros mais ricos, e o ingresso pesa no orçamento de muitas famílias.',
    usos: {
      Drummond: 'Pacto, art. 15 (vida cultural): o direito existe, mas o cinema é de poucos.',
      'Rui Barbosa': 'O mesmo ingresso para quem ganha muito e para quem ganha pouco.',
      'Dom Hélder': 'Sessão grátis uma vez por ano é aplaudida; perguntar por que o bairro não tem cinema incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 15, o direito de participar da vida cultural. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas ir ao cinema ainda é privilégio de poucos, o que mostra que o acesso a ele não é democrático. Tal cenário decorre, sobretudo, do preço igual cobrado de quem ganha muito e de quem ganha pouco e da falta de atenção às causas da ausência de salas nas periferias e no interior.`,
        anotacoes: [
          ...intro('garante a todos, em seu artigo 15, o direito de participar da vida cultural', 'O artigo 15 (vida cultural) é o que combina com cinema.'),
          { trecho: 'ir ao cinema ainda é privilégio de poucos, o que mostra que o acesso a ele não é democrático', papel: 'tese', porque: 'A tese responde à palavra "democratização" do tema.' },
          { trecho: 'do preço igual cobrado de quem ganha muito e de quem ganha pouco e da falta de atenção às causas da ausência de salas nas periferias e no interior', papel: 'anuncio', porque: 'Motivo A (Rui: preço igual para desiguais) e motivo B (Dom Hélder: a causa da falta de salas).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, cobrar o mesmo ingresso de todos, sem olhar a renda de cada um, afasta os mais pobres das salas. ${RUI}. ${RUI_SENTIDO}. Por isso, para uma família que ganha pouco, o ingresso, a passagem de ônibus e o lanche pesam muito mais do que para quem ganha bem, e o "preço igual" vira uma porta fechada. Logo, sem ingresso mais barato para quem precisa, o cinema continua sendo de poucos.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'cobrar o mesmo ingresso de todos, sem olhar a renda de cada um, afasta os mais pobres das salas', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'para uma família que ganha pouco, o ingresso, a passagem de ônibus e o lanche pesam muito mais do que para quem ganha bem', papel: 'analise', porque: 'A ligação: os "desiguais tratados igual" aqui são o rico e o pobre na bilheteria.' },
          { trecho: 'Logo, sem ingresso mais barato para quem precisa, o cinema continua sendo de poucos', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade comemora ações pontuais sem perguntar por que tantos bairros não têm cinema. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, uma sessão gratuita na praça uma vez por ano é aplaudida, mas perguntar por que as salas ficam só nos shoppings das regiões mais ricas incomoda. Dessa forma, enquanto só o evento for lembrado, a periferia e o interior continuarão sem tela.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade comemora ações pontuais sem perguntar por que tantos bairros não têm cinema', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
          { trecho: 'uma sessão gratuita na praça uma vez por ano é aplaudida, mas perguntar por que as salas ficam só nos shoppings das regiões mais ricas incomoda', papel: 'analise', porque: 'A ligação: a "comida" é a sessão grátis; a pergunta incômoda é onde ficam as salas.' },
          { trecho: 'Dessa forma, enquanto só o evento for lembrado, a periferia e o interior continuarão sem tela', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 15 do Pacto saia do papel, é preciso levar o cinema até quem está longe dele. O Ministério da Cultura, em parceria com as prefeituras, deve criar salas de cinema públicas em escolas e centros culturais de bairros afastados e de cidades do interior, por meio de sessões semanais com ingresso a preço baixo ou gratuito para estudantes e famílias de baixa renda, a fim de que assistir a um filme deixe de ser privilégio. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 15 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Ministério da Cultura, em parceria com as prefeituras', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'criar salas de cinema públicas em escolas e centros culturais de bairros afastados e de cidades do interior', papel: 'acao', porque: 'O que faz: ataca o motivo B (falta de salas).' },
          { trecho: 'por meio de sessões semanais', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'com ingresso a preço baixo ou gratuito para estudantes e famílias de baixa renda', papel: 'detalhamento', porque: 'Detalha o modo e responde ao motivo A (preço igual).' },
          { trecho: 'a fim de que assistir a um filme deixe de ser privilégio', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio1-cuidado-2023',
    tema: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    anoEnem: 2023,
    trio: 1,
    rotulo: 'Trabalho de cuidado',
    contexto: 'Cuidar da casa, dos filhos, de idosos e de doentes é um trabalho que sustenta a vida em sociedade, mas, quando feito dentro da família, não é pago nem contado como trabalho, e recai sobretudo sobre as mulheres.',
    usos: {
      Drummond: 'Pacto, art. 7º (trabalho justo): o direito existe, mas o cuidado feito pela mulher segue invisível.',
      'Rui Barbosa': 'A mesma cobrança no emprego para quem ainda tem a jornada de casa.',
      'Dom Hélder': 'Chamar a mãe de "guerreira" é aplaudido; perguntar por que só ela cuida incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 7º, o direito a condições de trabalho justas e favoráveis. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas o trabalho de cuidar da casa, dos filhos e dos idosos, feito sobretudo pelas mulheres, continua invisível, sem pagamento nem reconhecimento. Tal cenário decorre, sobretudo, da cobrança igual para mulheres que já carregam uma segunda jornada em casa e da falta de atenção às causas dessa divisão desigual.`,
        anotacoes: [
          ...intro('garante a todos, em seu artigo 7º, o direito a condições de trabalho justas e favoráveis', 'O artigo 7º (trabalho justo) combina com um trabalho que ninguém paga.'),
          { trecho: 'o trabalho de cuidar da casa, dos filhos e dos idosos, feito sobretudo pelas mulheres, continua invisível', papel: 'tese', porque: 'A tese usa a palavra do tema: invisível.' },
          { trecho: 'da cobrança igual para mulheres que já carregam uma segunda jornada em casa e da falta de atenção às causas dessa divisão desigual', papel: 'anuncio', porque: 'Motivo A (Rui: cobrança igual) e motivo B (Dom Hélder: a causa).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, cobrar da mulher o mesmo desempenho no emprego, sem considerar o trabalho que ela faz em casa, aprofunda a desigualdade. ${RUI}. ${RUI_SENTIDO}. Por isso, a mãe que sai do serviço e ainda cozinha, limpa e cuida dos filhos é cobrada como se tivesse o mesmo tempo livre dos colegas, e acaba vista como menos dedicada. Logo, esse tratamento "igual" esconde um trabalho que ninguém vê.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'cobrar da mulher o mesmo desempenho no emprego, sem considerar o trabalho que ela faz em casa, aprofunda a desigualdade', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'a mãe que sai do serviço e ainda cozinha, limpa e cuida dos filhos é cobrada como se tivesse o mesmo tempo livre dos colegas', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é a mulher com dupla jornada.' },
          { trecho: 'Logo, esse tratamento "igual" esconde um trabalho que ninguém vê', papel: 'fecho', porque: 'Volta à tese (invisível).' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade elogia quem cuida sem perguntar por que esse peso cai quase sempre sobre a mulher. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, chamar a mãe de "guerreira" é aplaudido, mas perguntar por que o pai, a família e o Estado dividem tão pouco essa tarefa incomoda. Dessa forma, enquanto só o esforço for elogiado, o cuidado continuará invisível.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade elogia quem cuida sem perguntar por que esse peso cai quase sempre sobre a mulher', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
          { trecho: 'chamar a mãe de "guerreira" é aplaudido, mas perguntar por que o pai, a família e o Estado dividem tão pouco essa tarefa incomoda', papel: 'analise', porque: 'A ligação: o "santo" é o elogio; a pergunta incômoda é por que só ela cuida.' },
          { trecho: 'Dessa forma, enquanto só o esforço for elogiado, o cuidado continuará invisível', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 7º do Pacto saia do papel, é preciso dividir o cuidado. O Governo Federal, em parceria com os municípios, deve ampliar as vagas em creches e os centros de convivência para idosos, por meio de verba destinada a essas obras, com horário estendido para atender mães que trabalham fora, a fim de que o cuidado deixe de recair apenas sobre a mulher. Ademais, as escolas devem promover conversas sobre a divisão das tarefas de casa entre meninos e meninas, para que essa responsabilidade seja vista como de todos. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 7º do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Governo Federal, em parceria com os municípios', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar as vagas em creches e os centros de convivência para idosos', papel: 'acao', porque: 'O que faz: divide o peso (motivo B).' },
          { trecho: 'por meio de verba destinada a essas obras', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'com horário estendido para atender mães que trabalham fora', papel: 'detalhamento', porque: 'Detalha e responde ao motivo A (a dupla jornada).' },
          { trecho: 'a fim de que o cuidado deixe de recair apenas sobre a mulher', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
  // Antes Trio 2 (Graciliano + Galeano). Pablo, 07/11/2026: "prefiro o trio 1...
  // tenta encaixar ele nesses outros temas". Rui passou nos 4 temas pelos juízes;
  // Dom Hélder só no registro civil. Criança: D2 reescrito e aprovado pelo agy
  // (DOM_HELDER_FORA_DA_PROVA). Imigração e diferença SAÍRAM: o agy reprovou o
  // Dom Hélder 2 vezes ("ligação forçada"), como os juízes.
  {
    id: 'trio1-crianca-2000',
    tema: 'Direitos da criança e do adolescente: como enfrentar esse desafio nacional',
    anoEnem: 2000,
    trio: 1,
    rotulo: 'Criança',
    contexto: 'Crianças e adolescentes têm direito à escola, à saúde e a brincar, mas muitos trabalham, abandonam os estudos ou crescem sem proteção.',
    usos: {
      Drummond: 'Pacto, art. 10 (proteção da criança): o direito existe, mas há criança trabalhando.',
      'Rui Barbosa': 'As mesmas cobranças para a criança que trabalha e para a que só estuda.',
      'Dom Hélder': 'Brinquedo no Natal é aplaudido; perguntar por que a criança trabalha incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas, com crianças ainda trabalhando e abandonando a escola, os direitos de muitas crianças e adolescentes não saem do papel. Tal cenário decorre, sobretudo, do tratamento igual dado a crianças que vivem realidades desiguais e da falta de atenção às causas do trabalho infantil.`,
        anotacoes: [
          ...intro('garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes', 'O artigo 10 (proteção da criança) é o que combina com o tema.'),
          { trecho: 'os direitos de muitas crianças e adolescentes não saem do papel', papel: 'tese', porque: 'A tese usa as palavras do tema: direitos da criança e do adolescente.' },
          { trecho: 'do tratamento igual dado a crianças que vivem realidades desiguais e da falta de atenção às causas do trabalho infantil', papel: 'anuncio', porque: 'Motivo A (Rui: igual para desiguais) e motivo B (Dom Hélder: a causa).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, oferecer a mesma escola a todos, sem olhar a realidade de cada criança, mantém os mais pobres para trás. ${RUI}. ${RUI_SENTIDO}. Por isso, a criança que ajuda no sustento da casa e chega cansada à aula recebe as mesmas cobranças de quem só estuda, vai ficando para trás e acaba abandonando a escola. Logo, sem apoio a mais para quem precisa, a igualdade apenas no papel tira dela o direito de aprender.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'oferecer a mesma escola a todos, sem olhar a realidade de cada criança, mantém os mais pobres para trás', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'a criança que ajuda no sustento da casa e chega cansada à aula recebe as mesmas cobranças de quem só estuda', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é a criança que trabalha.' },
          { trecho: 'Logo, sem apoio a mais para quem precisa, a igualdade apenas no papel tira dela o direito de aprender', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade socorre essas crianças em datas especiais sem perguntar por que elas precisam trabalhar. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, distribuir brinquedos no Natal é aplaudido, mas perguntar por que tantas famílias dependem do trabalho dos filhos para comer incomoda. Dessa forma, enfrentar esse desafio nacional exige ir além da caridade e atacar a pobreza que tira a criança da escola.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade socorre essas crianças em datas especiais sem perguntar por que elas precisam trabalhar', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
          { trecho: 'distribuir brinquedos no Natal é aplaudido, mas perguntar por que tantas famílias dependem do trabalho dos filhos para comer incomoda', papel: 'analise', porque: 'A ligação: a "comida" é o brinquedo; a pergunta incômoda é a pobreza da família.' },
          { trecho: 'Dessa forma, enfrentar esse desafio nacional exige ir além da caridade e atacar a pobreza que tira a criança da escola', papel: 'fecho', porque: 'Volta à tese com as palavras do tema ("desafio nacional").' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 10 do Pacto saia do papel, são necessárias duas medidas. Primeiramente, o Governo Federal, em parceria com os municípios, deve ampliar programas de renda para famílias pobres com filhos na escola, por meio de um auxílio mensal ligado à frequência escolar, a fim de que nenhuma criança precise trabalhar para ajudar em casa. Ademais, as escolas devem oferecer reforço e período integral, com refeição e acompanhamento dos alunos que mais faltam, para que quem começou em desvantagem tenha as mesmas chances. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 10 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'o Governo Federal, em parceria com os municípios', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar programas de renda para famílias pobres com filhos na escola', papel: 'acao', porque: 'O que faz: ataca o motivo B (a pobreza por trás do trabalho infantil).' },
          { trecho: 'por meio de um auxílio mensal ligado à frequência escolar', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'a fim de que nenhuma criança precise trabalhar para ajudar em casa', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'com refeição e acompanhamento dos alunos que mais faltam', papel: 'detalhamento', porque: 'Detalha a 2ª medida: o apoio a mais do motivo A (Rui).' },
          lirios,
        ],
      },
    },
  },
  {
    id: 'trio1-registro-civil-2021',
    tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    anoEnem: 2021,
    trio: 1,
    rotulo: 'Registro civil',
    contexto: 'A certidão de nascimento é o primeiro documento de uma pessoa e é exigida para tirar os demais, matricular-se na escola, ser atendido em programas sociais e votar. Mesmo assim, há brasileiros sem registro, sobretudo em regiões afastadas e entre a população de rua.',
    usos: {
      Drummond: 'Pacto, art. 9º (previdência social): o direito existe, mas quem não tem certidão não o alcança.',
      'Rui Barbosa': 'O mesmo caminho até o cartório para quem mora perto e para quem mora longe.',
      'Dom Hélder': 'Mutirão de um dia é elogiado; perguntar por que o cartório não chega lá incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} reconhece, em seu artigo 9º, o direito de toda pessoa à previdência social. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: ${COMPROMISSO}, mas há brasileiros sem certidão de nascimento que, por não existirem no papel, não conseguem alcançar a cidadania. Tal cenário decorre, sobretudo, do mesmo caminho até o cartório exigido de quem mora perto e de quem mora longe e da falta de atenção às causas dessa invisibilidade.`,
        anotacoes: [
          ...intro('reconhece, em seu artigo 9º, o direito de toda pessoa à previdência social', 'O artigo 9º (previdência social) combina: sem certidão, não há benefício.'),
          { trecho: 'há brasileiros sem certidão de nascimento que, por não existirem no papel, não conseguem alcançar a cidadania', papel: 'tese', porque: 'A tese usa as palavras do tema: registro (certidão) e cidadania.' },
          { trecho: 'do mesmo caminho até o cartório exigido de quem mora perto e de quem mora longe e da falta de atenção às causas dessa invisibilidade', papel: 'anuncio', porque: 'Motivo A (Rui: igual para desiguais) e motivo B (Dom Hélder: a causa).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, exigir de todos o mesmo esforço para chegar ao cartório deixa de fora quem mora longe. ${RUI}. ${RUI_SENTIDO}. Por isso, para uma família pobre da zona rural, a viagem até a cidade custa um dinheiro que ela não tem, e o filho cresce sem certidão, sem escola e sem os benefícios. Logo, a mesma regra para realidades diferentes produz brasileiros que não existem no papel.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'exigir de todos o mesmo esforço para chegar ao cartório deixa de fora quem mora longe', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual em todas as redações, citado como ideia (sem aspas).' },
          { trecho: RUI_SENTIDO, papel: 'analise', porque: 'O que o Rui quer dizer. Igual em todas.' },
          { trecho: 'para uma família pobre da zona rural, a viagem até a cidade custa um dinheiro que ela não tem', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem mora longe do cartório.' },
          { trecho: 'Logo, a mesma regra para realidades diferentes produz brasileiros que não existem no papel', papel: 'fecho', porque: 'Volta à tese (invisibilidade).' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade comemora ações pontuais sem perguntar por que tantas pessoas continuam sem documento. ${DOM_HELDER}. ${DOM_HELDER_SENTIDO}. Assim, um mutirão de um dia que entrega certidões é elogiado, mas perguntar por que o cartório não chega às comunidades afastadas e às pessoas em situação de rua incomoda. Dessa forma, enquanto só o evento for lembrado, essas pessoas continuarão invisíveis.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade comemora ações pontuais sem perguntar por que tantas pessoas continuam sem documento', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual em todas as redações.' },
          { trecho: DOM_HELDER_SENTIDO, papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual em todas.' },
          { trecho: 'um mutirão de um dia que entrega certidões é elogiado, mas perguntar por que o cartório não chega às comunidades afastadas e às pessoas em situação de rua incomoda', papel: 'analise', porque: 'A ligação: a "comida" é o mutirão; a pergunta incômoda é por que o cartório não chega.' },
          { trecho: 'Dessa forma, enquanto só o evento for lembrado, essas pessoas continuarão invisíveis', papel: 'fecho', porque: 'Volta à tese com a palavra do tema (invisibilidade).' },
        ],
      },
      conclusao: {
        texto: `Portanto, para que o artigo 9º do Pacto saia do papel, é preciso levar o registro até os invisíveis. O Governo Federal, em parceria com os cartórios e as prefeituras, deve criar postos de registro permanentes, por meio de unidades móveis que visitem comunidades afastadas e abrigos todos os meses, com equipes que expliquem às famílias como tirar a certidão, a fim de incluir essas pessoas nos serviços públicos. Desse modo, ${LIRIOS}.`,
        anotacoes: [
          { trecho: 'para que o artigo 9º do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Governo Federal, em parceria com os cartórios e as prefeituras', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'criar postos de registro permanentes', papel: 'acao', porque: 'O que faz: o contrário do mutirão de um dia (motivo B).' },
          { trecho: 'por meio de unidades móveis que visitem comunidades afastadas e abrigos todos os meses', papel: 'modo', porque: 'Como faz: leva o cartório a quem mora longe (motivo A).' },
          { trecho: 'com equipes que expliquem às famílias como tirar a certidão', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de incluir essas pessoas nos serviços públicos', papel: 'efeito', porque: 'Para quê.' },
          lirios,
        ],
      },
    },
  },
];
