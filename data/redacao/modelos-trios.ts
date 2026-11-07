// Mais 2 redações por trio (Pablo, 07/11/2026: "faz em tipo 3 temas com o
// trio 1 e com o trio 2... preciso saber como você usa cada argumento em
// vários temas"). Mesmo molde das redações dos trios em modelos.ts. Citação,
// sentido e ligação de cada autor = os aprovados pelos juízes NESTE tema
// (lib/redacao/coringas-por-tema.json). Fora isso, só o Pacto (artigos
// conferidos no Decreto 591/1992, ver lib/redacao/lei-coringa.ts).

import type { RedacaoModelo } from './modelos';

const PACTO = 'O Pacto Internacional sobre Direitos Econômicos, Sociais e Culturais, adotado pela ONU em 1966 e assumido pelo Brasil em 1992,';
const DRUMMOND = 'como escreveu Carlos Drummond de Andrade no poema "Nosso tempo", "as leis não bastam. Os lírios não nascem da lei"';
const RUI = 'Na "Oração aos Moços" (1921), Rui Barbosa ensina que tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real';
const DOM_HELDER = 'Como dizia Dom Hélder Câmara, "quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles são pobres, chamam-me de comunista"';
const GALEANO = 'Eduardo Galeano, no texto "Os ninguéns", de "O Livro dos Abraços" (1989), descreve "os ninguéns: os filhos de ninguém, os donos de nada"';

export const TRIO1_MAIS: RedacaoModelo[] = [
  {
    id: 'trio1-saude-mental-2020',
    tema: 'O estigma associado às doenças mentais na sociedade brasileira',
    anoEnem: 2020,
    trio: 1,
    rotulo: 'Saúde mental',
    contexto: 'Depressão, ansiedade e outras doenças mentais ainda carregam rótulos como "louco" ou "fraco", e esse estigma afasta as pessoas do tratamento. Esta redação usa o Trio 1: Pacto + Drummond na introdução, Rui Barbosa no 1º desenvolvimento e Dom Hélder no 2º.',
    usos: {
      Drummond: 'Pacto, art. 12 (saúde). A Lei da Reforma Psiquiátrica existe, mas o rótulo de "louco" continua.',
      'Rui Barbosa': 'A mesma cobrança para quem está doente e para quem está saudável.',
      'Dom Hélder': 'O Setembro Amarelo é aplaudido; perguntar por que falta psicólogo incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 12, o direito ao mais elevado nível possível de saúde física e mental. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: a Lei da Reforma Psiquiátrica (Lei 10.216/2001) garante tratamento humanizado às pessoas com transtornos mentais, mas o estigma associado a essas doenças ainda afasta muitos brasileiros do trabalho, da escola e da busca por ajuda. Tal cenário decorre, sobretudo, da cobrança igual para quem está doente e para quem está saudável e da falta de atenção às causas desse preconceito.`,
        anotacoes: [
          { trecho: `${PACTO} garante a todos, em seu artigo 12, o direito ao mais elevado nível possível de saúde física e mental`, papel: 'repertorio', porque: 'A lei do trio: abre a introdução. O artigo 12 (saúde física e mental) é o que combina com o tema.' },
          { trecho: DRUMMOND, papel: 'repertorio', porque: 'Drummond, igual nas 6 redações: a lei existe, mas sozinha não muda a vida.' },
          { trecho: 'a Lei da Reforma Psiquiátrica (Lei 10.216/2001) garante tratamento humanizado às pessoas com transtornos mentais', papel: 'contextualizacao', porque: 'A lei DESTE tema. É só isso que muda no Drummond de um tema para outro.' },
          { trecho: 'o estigma associado a essas doenças ainda afasta muitos brasileiros do trabalho, da escola e da busca por ajuda', papel: 'tese', porque: 'A tese usa a palavra do tema: estigma.' },
          { trecho: 'da cobrança igual para quem está doente e para quem está saudável e da falta de atenção às causas desse preconceito', papel: 'anuncio', porque: 'Motivo A (vai com o Rui: tratar igual quem está diferente) e motivo B (vai com o Dom Hélder: a causa).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, cobrar de quem enfrenta uma doença mental o mesmo desempenho de quem está saudável reforça o estigma. ${RUI}. Ou seja, quem vive em situação diferente precisa de cuidado diferente para ter os mesmos direitos. Por isso, quem enfrenta uma depressão ou uma crise de ansiedade e recebe no trabalho ou na escola a mesma cobrança dos outros, sem pausa nem acompanhamento, acaba visto como preguiçoso. Logo, esse tratamento "igual" transforma a doença em defeito de caráter.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'cobrar de quem enfrenta uma doença mental o mesmo desempenho de quem está saudável reforça o estigma', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, igual nas 3 redações do Trio 1, citado como ideia (sem aspas).' },
          { trecho: 'Ou seja, quem vive em situação diferente precisa de cuidado diferente para ter os mesmos direitos', papel: 'analise', porque: 'O que o Rui quer dizer. Esta frase também é igual nas 3.' },
          { trecho: 'quem enfrenta uma depressão ou uma crise de ansiedade e recebe no trabalho ou na escola a mesma cobrança dos outros, sem pausa nem acompanhamento, acaba visto como preguiçoso', papel: 'analise', porque: 'A ligação: quem está "desigual" aqui é quem está doente.' },
          { trecho: 'Logo, esse tratamento "igual" transforma a doença em defeito de caráter', papel: 'fecho', porque: 'Volta à tese (estigma).' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste. ${DOM_HELDER}. Em outras palavras, socorrer é aplaudido, mas investigar a causa incomoda. Assim, campanhas de um mês, como o Setembro Amarelo, são elogiadas, porém pouco se pergunta por que o estigma continua e por que o atendimento psicológico público é tão escasso. Dessa forma, enquanto só a urgência for lembrada, o rótulo de "louco" continuará a afastar quem precisa de ajuda.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade apoia ações pontuais sem perguntar por que o preconceito persiste', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual nas 3 redações do Trio 1.' },
          { trecho: 'Em outras palavras, socorrer é aplaudido, mas investigar a causa incomoda', papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual nas 3.' },
          { trecho: 'campanhas de um mês, como o Setembro Amarelo, são elogiadas, porém pouco se pergunta por que o estigma continua e por que o atendimento psicológico público é tão escasso', papel: 'analise', porque: 'A ligação: a "comida" aqui é a campanha; a pergunta incômoda é a falta de psicólogo.' },
          { trecho: 'Dessa forma, enquanto só a urgência for lembrada, o rótulo de "louco" continuará a afastar quem precisa de ajuda', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que o artigo 12 do Pacto saia do papel, é preciso combater o estigma na raiz. O Ministério da Saúde, em parceria com o Ministério da Educação, deve ampliar o atendimento psicológico gratuito em escolas e unidades básicas de saúde, por meio da contratação de psicólogos e de rodas de conversa permanentes com alunos, professores e famílias, que expliquem que doença mental é doença, e não fraqueza, a fim de que quem sofre procure ajuda sem medo. Desse modo, os lírios de Drummond poderão enfim nascer.',
        anotacoes: [
          { trecho: 'para que o artigo 12 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Ministério da Saúde, em parceria com o Ministério da Educação', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar o atendimento psicológico gratuito em escolas e unidades básicas de saúde', papel: 'acao', porque: 'O que faz: ataca o motivo B (falta de atendimento).' },
          { trecho: 'por meio da contratação de psicólogos e de rodas de conversa permanentes com alunos, professores e famílias', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'que expliquem que doença mental é doença, e não fraqueza', papel: 'detalhamento', porque: 'Detalha o modo e responde ao motivo A (visto como preguiçoso).' },
          { trecho: 'a fim de que quem sofre procure ajuda sem medo', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'os lírios de Drummond poderão enfim nascer', papel: 'retomada', porque: 'Última frase: volta ao Drummond.' },
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
    contexto: 'Redes sociais e sites coletam o que cada pessoa curte, procura e compra, e usam esses dados para decidir o que ela vai ver a seguir. Esta redação usa o Trio 1: Pacto + Drummond na introdução, Rui Barbosa no 1º desenvolvimento e Dom Hélder no 2º.',
    usos: {
      Drummond: 'Pacto, art. 15 (progresso científico). A LGPD existe, mas o usuário segue manipulado.',
      'Rui Barbosa': 'Usuário e empresa assinam o mesmo termo de uso, sem o mesmo poder.',
      'Dom Hélder': 'Ensinar a ajustar a privacidade é bem-visto; questionar o lucro das plataformas incomoda.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante a todos, em seu artigo 15, o direito de desfrutar do progresso científico e de suas aplicações. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: a Lei Geral de Proteção de Dados, aprovada em 2018, protege as informações pessoais, mas os usuários continuam tendo seu comportamento manipulado por quem controla seus dados. Tal cenário decorre, sobretudo, da falsa igualdade entre o usuário e as grandes empresas de tecnologia e da falta de debate sobre o modelo de negócio das plataformas.`,
        anotacoes: [
          { trecho: `${PACTO} garante a todos, em seu artigo 15, o direito de desfrutar do progresso científico e de suas aplicações`, papel: 'repertorio', porque: 'A lei do trio. O artigo 15 (progresso científico) é o que combina com tecnologia.' },
          { trecho: DRUMMOND, papel: 'repertorio', porque: 'Drummond, igual nas 6 redações.' },
          { trecho: 'a Lei Geral de Proteção de Dados, aprovada em 2018, protege as informações pessoais', papel: 'contextualizacao', porque: 'A lei DESTE tema: a LGPD.' },
          { trecho: 'os usuários continuam tendo seu comportamento manipulado por quem controla seus dados', papel: 'tese', porque: 'A tese usa as palavras do tema: comportamento, manipulado, dados.' },
          { trecho: 'da falsa igualdade entre o usuário e as grandes empresas de tecnologia e da falta de debate sobre o modelo de negócio das plataformas', papel: 'anuncio', porque: 'Motivo A (Rui: falsa igualdade) e motivo B (Dom Hélder: a causa que ninguém discute).' },
        ],
      },
      desenvolvimento1: {
        texto: `Em primeiro lugar, tratar o usuário comum como se tivesse o mesmo poder de uma grande empresa facilita a manipulação. ${RUI}. Ou seja, quem vive em situação diferente precisa de cuidado diferente para ter os mesmos direitos. Por isso, quando o usuário e a plataforma assinam o mesmo "termo de uso", só a empresa sabe o que fará com os dados coletados, e quem clica em "aceito" sem entender fica exposto. Logo, essa igualdade de fachada entrega o comportamento do usuário a quem controla seus dados.`,
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'tratar o usuário comum como se tivesse o mesmo poder de uma grande empresa facilita a manipulação', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: RUI, papel: 'repertorio', porque: 'Rui Barbosa, a mesma frase das outras 2 redações do Trio 1.' },
          { trecho: 'Ou seja, quem vive em situação diferente precisa de cuidado diferente para ter os mesmos direitos', papel: 'analise', porque: 'O que o Rui quer dizer. Igual nas 3.' },
          { trecho: 'quando o usuário e a plataforma assinam o mesmo "termo de uso", só a empresa sabe o que fará com os dados coletados', papel: 'analise', porque: 'A ligação: os "desiguais tratados igual" aqui são o usuário e a empresa.' },
          { trecho: 'Logo, essa igualdade de fachada entrega o comportamento do usuário a quem controla seus dados', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, a sociedade combate os sintomas sem questionar a causa da manipulação. ${DOM_HELDER}. Em outras palavras, socorrer é aplaudido, mas investigar a causa incomoda. Assim, ensinar o usuário a ajustar a privacidade é bem-visto, mas perguntar por que o modelo de negócio das plataformas depende de manipular comportamentos encontra forte resistência. Dessa forma, enquanto só o usuário for cobrado, o sistema que o manipula continuará intacto.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'a sociedade combate os sintomas sem questionar a causa da manipulação', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: DOM_HELDER, papel: 'repertorio', porque: 'Dom Hélder, igual nas 3 redações do Trio 1.' },
          { trecho: 'Em outras palavras, socorrer é aplaudido, mas investigar a causa incomoda', papel: 'analise', porque: 'O que o Dom Hélder quer dizer. Igual nas 3.' },
          { trecho: 'ensinar o usuário a ajustar a privacidade é bem-visto, mas perguntar por que o modelo de negócio das plataformas depende de manipular comportamentos encontra forte resistência', papel: 'analise', porque: 'A ligação: a "comida" é a dica de privacidade; a pergunta incômoda é o lucro das plataformas.' },
          { trecho: 'Dessa forma, enquanto só o usuário for cobrado, o sistema que o manipula continuará intacto', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que a Lei Geral de Proteção de Dados proteja de fato o usuário, é preciso equilibrar essa relação. A Autoridade Nacional de Proteção de Dados deve fiscalizar os termos de uso das grandes plataformas, por meio de auditorias periódicas e da exigência de um resumo, em linguagem simples, de quais dados são coletados e para quê, a fim de que o usuário decida com consciência. Ademais, as escolas devem incluir a educação digital nas aulas, para que os jovens reconheçam quando um algoritmo tenta conduzir suas escolhas. Desse modo, os lírios de Drummond poderão enfim nascer.',
        anotacoes: [
          { trecho: 'para que a Lei Geral de Proteção de Dados proteja de fato o usuário', papel: 'retomada', porque: 'Retoma a lei e a tese.' },
          { trecho: 'A Autoridade Nacional de Proteção de Dados', papel: 'agente', porque: 'Quem faz: o órgão que cuida da LGPD.' },
          { trecho: 'fiscalizar os termos de uso das grandes plataformas', papel: 'acao', porque: 'O que faz: ataca o motivo A (o termo de uso desigual).' },
          { trecho: 'por meio de auditorias periódicas', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'da exigência de um resumo, em linguagem simples, de quais dados são coletados e para quê', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de que o usuário decida com consciência', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'os lírios de Drummond poderão enfim nascer', papel: 'retomada', porque: 'Última frase: volta ao Drummond.' },
        ],
      },
    },
  },
];

export const TRIO2_MAIS: RedacaoModelo[] = [
  {
    id: 'trio2-crianca-2000',
    tema: 'Direitos da criança e do adolescente: como enfrentar esse desafio nacional',
    anoEnem: 2000,
    trio: 2,
    rotulo: 'Criança',
    contexto: 'Crianças e adolescentes têm direito à escola, à saúde e a brincar, mas muitos trabalham, abandonam os estudos ou crescem sem proteção. Esta redação usa o Trio 2: Pacto + Drummond na introdução, Graciliano no 1º desenvolvimento e Galeano no 2º.',
    usos: {
      Drummond: 'Pacto, art. 10 (proteção da criança). O ECA existe, mas o trabalho infantil continua.',
      Graciliano: 'Os filhos de Fabiano nem têm nome; a criança pobre sai da escola para trabalhar.',
      Galeano: 'A criança que some da escola sem ninguém notar é um filho de ninguém.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: o Estatuto da Criança e do Adolescente, de 1990, é considerado avançado, mas, com o trabalho infantil e a evasão escolar ainda presentes, os direitos de muitas crianças e adolescentes não saem do papel. Tal cenário decorre, sobretudo, da miséria que tira a criança da escola e da invisibilidade de quem cresce sem proteção.`,
        anotacoes: [
          { trecho: `${PACTO} garante, em seu artigo 10, medidas especiais de proteção e de assistência a todas as crianças e adolescentes`, papel: 'repertorio', porque: 'A lei do trio. O artigo 10 (proteção da criança) é o que combina com o tema.' },
          { trecho: DRUMMOND, papel: 'repertorio', porque: 'Drummond, igual nas 6 redações.' },
          { trecho: 'o Estatuto da Criança e do Adolescente, de 1990, é considerado avançado', papel: 'contextualizacao', porque: 'A lei DESTE tema: o ECA.' },
          { trecho: 'os direitos de muitas crianças e adolescentes não saem do papel', papel: 'tese', porque: 'A tese usa as palavras do tema: direitos da criança e do adolescente.' },
          { trecho: 'da miséria que tira a criança da escola e da invisibilidade de quem cresce sem proteção', papel: 'anuncio', porque: 'Motivo A (Graciliano: a miséria) e motivo B (Galeano: a invisibilidade).' },
        ],
      },
      desenvolvimento1: {
        texto: 'Em primeiro lugar, a pobreza rouba da criança o direito de aprender e de brincar. Em "Vidas Secas" (1938), de Graciliano Ramos, Fabiano, sertanejo pobre e explorado pelo patrão, conclui: "Você é um bicho, Fabiano". No livro, seus filhos nem têm nome e, quando o menino mais velho pergunta o que é inferno, recebe um cascudo da mãe. Ou seja, a miséria tira da criança até o direito de perguntar. Da mesma forma, crianças pobres ainda são afastadas da escola para ajudar no sustento da família. Logo, sem renda digna para os pais, o filho herda o destino de Fabiano.',
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'a pobreza rouba da criança o direito de aprender e de brincar', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: 'Em "Vidas Secas" (1938), de Graciliano Ramos, Fabiano, sertanejo pobre e explorado pelo patrão, conclui: "Você é um bicho, Fabiano"', papel: 'repertorio', porque: 'Graciliano, a mesma fala das outras 2 redações do Trio 2.' },
          { trecho: 'No livro, seus filhos nem têm nome e, quando o menino mais velho pergunta o que é inferno, recebe um cascudo da mãe', papel: 'repertorio', porque: 'Detalhe do livro que só serve neste tema: os filhos de Fabiano.' },
          { trecho: 'Ou seja, a miséria tira da criança até o direito de perguntar', papel: 'analise', porque: 'O que o Graciliano quer dizer aqui.' },
          { trecho: 'crianças pobres ainda são afastadas da escola para ajudar no sustento da família', papel: 'analise', porque: 'A ligação: o filho do Fabiano de hoje.' },
          { trecho: 'Logo, sem renda digna para os pais, o filho herda o destino de Fabiano', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, muitas crianças e adolescentes crescem sem que ninguém as veja. ${GALEANO}. Em outras palavras, há gente que a sociedade trata como se não existisse. Assim, a criança que trabalha nas ruas ou abandona a escola sem que a escola, o bairro ou o Estado percebam vive exatamente como esse filho de ninguém. Dessa forma, enfrentar esse desafio nacional é, antes de tudo, tirá-la dessa condição.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'muitas crianças e adolescentes crescem sem que ninguém as veja', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: GALEANO, papel: 'repertorio', porque: 'Galeano, igual nas 3 redações do Trio 2.' },
          { trecho: 'Em outras palavras, há gente que a sociedade trata como se não existisse', papel: 'analise', porque: 'O que o Galeano quer dizer.' },
          { trecho: 'a criança que trabalha nas ruas ou abandona a escola sem que a escola, o bairro ou o Estado percebam vive exatamente como esse filho de ninguém', papel: 'analise', porque: 'A ligação: aqui o "ninguém" é literalmente um filho.' },
          { trecho: 'Dessa forma, enfrentar esse desafio nacional é, antes de tudo, tirá-la dessa condição', papel: 'fecho', porque: 'Volta à tese com as palavras do tema ("desafio nacional").' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que o Estatuto da Criança e do Adolescente saia do papel, são necessárias duas medidas. Primeiramente, o Governo Federal, em parceria com os municípios, deve ampliar programas de renda e de escola em tempo integral para famílias pobres, por meio de vagas com refeição e atividades no contraturno, a fim de que nenhuma criança precise trabalhar para ajudar em casa. Ademais, os conselhos tutelares devem ser estruturados, com equipes que acompanhem cada aluno que falta à escola, para que essas crianças deixem de ser invisíveis. Desse modo, os lírios de Drummond poderão enfim nascer.',
        anotacoes: [
          { trecho: 'para que o Estatuto da Criança e do Adolescente saia do papel', papel: 'retomada', porque: 'Retoma a lei e a tese.' },
          { trecho: 'o Governo Federal, em parceria com os municípios', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'ampliar programas de renda e de escola em tempo integral para famílias pobres', papel: 'acao', porque: 'O que faz: ataca o motivo A (a miséria).' },
          { trecho: 'por meio de vagas com refeição e atividades no contraturno', papel: 'modo', porque: 'Como faz.' },
          { trecho: 'a fim de que nenhuma criança precise trabalhar para ajudar em casa', papel: 'efeito', porque: 'Para quê.' },
          { trecho: 'com equipes que acompanhem cada aluno que falta à escola', papel: 'detalhamento', porque: 'Detalha a 2ª medida: ataca o motivo B (ninguém nota).' },
          { trecho: 'os lírios de Drummond poderão enfim nascer', papel: 'retomada', porque: 'Última frase: volta ao Drummond.' },
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
    contexto: 'Conviver com a diferença é respeitar quem tem outra cor, outro sotaque, outra religião ou outro jeito de amar. Esta redação usa o Trio 2: Pacto + Drummond na introdução, Graciliano no 1º desenvolvimento e Galeano no 2º.',
    usos: {
      Drummond: 'Pacto, art. 13 (educação para a tolerância). Racismo e homofobia são crime, mas as ofensas continuam.',
      Graciliano: 'O nordestino que esconde o sotaque: o preconceito vira a imagem de si.',
      Galeano: 'Quem foge do padrão vira um ninguém, invisível ou rejeitado.',
    },
    partes: {
      introducao: {
        texto: `${PACTO} determina, em seu artigo 13, que a educação favoreça a compreensão e a tolerância entre todos os grupos raciais, étnicos ou religiosos. Contudo, ${DRUMMOND}. Essa reflexão se aplica ao Brasil de hoje: a Constituição de 1988 tornou o racismo crime inafiançável e, em 2019, o STF equiparou a homofobia ao racismo, mas ofensas contra negros, pessoas LGBT e migrantes continuam frequentes, o que mostra que o país ainda não aprendeu a conviver com a diferença. Tal cenário decorre, sobretudo, do preconceito que faz o outro se ver como inferior e da invisibilidade de quem foge do padrão dominante.`,
        anotacoes: [
          { trecho: `${PACTO} determina, em seu artigo 13, que a educação favoreça a compreensão e a tolerância entre todos os grupos raciais, étnicos ou religiosos`, papel: 'repertorio', porque: 'A lei do trio. O artigo 13 (educação para a tolerância) é o que combina com o tema.' },
          { trecho: DRUMMOND, papel: 'repertorio', porque: 'Drummond, igual nas 6 redações.' },
          { trecho: 'a Constituição de 1988 tornou o racismo crime inafiançável e, em 2019, o STF equiparou a homofobia ao racismo', papel: 'contextualizacao', porque: 'As leis DESTE tema: punem, mas não ensinam a conviver.' },
          { trecho: 'o país ainda não aprendeu a conviver com a diferença', papel: 'tese', porque: 'A tese usa as palavras do tema: conviver com a diferença.' },
          { trecho: 'do preconceito que faz o outro se ver como inferior e da invisibilidade de quem foge do padrão dominante', papel: 'anuncio', porque: 'Motivo A (Graciliano: se ver como bicho) e motivo B (Galeano: os ninguéns).' },
        ],
      },
      desenvolvimento1: {
        texto: 'Em primeiro lugar, o preconceito repetido faz quem é diferente acreditar que vale menos. Em "Vidas Secas" (1938), de Graciliano Ramos, Fabiano, sertanejo pobre e explorado pelo patrão, internaliza o desprezo: "Você é um bicho, Fabiano". Ou seja, o preconceito alheio acaba virando a imagem que a pessoa tem de si. O mesmo acontece com migrantes nordestinos alvo de piadas e ofensas no Sudeste, que muitas vezes escondem o sotaque para serem aceitos. Logo, uma sociedade que não convive com a diferença obriga o outro a apagar quem é.',
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Abre o 1º desenvolvimento.' },
          { trecho: 'o preconceito repetido faz quem é diferente acreditar que vale menos', papel: 'topico', porque: 'Retoma o motivo A.' },
          { trecho: 'Em "Vidas Secas" (1938), de Graciliano Ramos, Fabiano, sertanejo pobre e explorado pelo patrão, internaliza o desprezo: "Você é um bicho, Fabiano"', papel: 'repertorio', porque: 'Graciliano, a mesma fala das outras 2 redações do Trio 2.' },
          { trecho: 'Ou seja, o preconceito alheio acaba virando a imagem que a pessoa tem de si', papel: 'analise', porque: 'O que o Graciliano quer dizer aqui.' },
          { trecho: 'migrantes nordestinos alvo de piadas e ofensas no Sudeste, que muitas vezes escondem o sotaque para serem aceitos', papel: 'analise', porque: 'A ligação: o Fabiano de hoje é quem esconde o sotaque.' },
          { trecho: 'Logo, uma sociedade que não convive com a diferença obriga o outro a apagar quem é', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: `Além disso, quem foge do padrão dominante costuma ser tratado como se não existisse. ${GALEANO}. Em outras palavras, há gente que a sociedade apaga, sem nome, sem voz e sem nada. Assim, a pessoa negra, LGBT ou com deficiência que raramente aparece nos livros, nas novelas e nos cargos de destaque vira esse ninguém, invisível ou rejeitada. Dessa forma, conviver com a diferença começa por reconhecer que ela existe e tem lugar.`,
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Abre o 2º desenvolvimento.' },
          { trecho: 'quem foge do padrão dominante costuma ser tratado como se não existisse', papel: 'topico', porque: 'Retoma o motivo B.' },
          { trecho: GALEANO, papel: 'repertorio', porque: 'Galeano, igual nas 3 redações do Trio 2.' },
          { trecho: 'Em outras palavras, há gente que a sociedade apaga, sem nome, sem voz e sem nada', papel: 'analise', porque: 'O que o Galeano quer dizer. Igual na redação da imigração.' },
          { trecho: 'a pessoa negra, LGBT ou com deficiência que raramente aparece nos livros, nas novelas e nos cargos de destaque vira esse ninguém', papel: 'analise', porque: 'A ligação: aqui o "ninguém" é quem é diferente do padrão.' },
          { trecho: 'Dessa forma, conviver com a diferença começa por reconhecer que ela existe e tem lugar', papel: 'fecho', porque: 'Volta à tese.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que o artigo 13 do Pacto saia do papel, é preciso ensinar a conviver. O Ministério da Educação deve incluir o respeito à diversidade em todas as etapas da escola, por meio de projetos em sala com histórias de vida de pessoas negras, LGBT, nordestinas e com deficiência, contadas por elas mesmas em rodas de conversa, a fim de que o diferente deixe de ser visto como inferior. Desse modo, a lei que pune será acompanhada da escola que ensina, e os lírios de Drummond poderão enfim nascer.',
        anotacoes: [
          { trecho: 'para que o artigo 13 do Pacto saia do papel', papel: 'retomada', porque: 'Retoma o Pacto e a tese.' },
          { trecho: 'O Ministério da Educação', papel: 'agente', porque: 'Quem faz.' },
          { trecho: 'incluir o respeito à diversidade em todas as etapas da escola', papel: 'acao', porque: 'O que faz.' },
          { trecho: 'por meio de projetos em sala com histórias de vida de pessoas negras, LGBT, nordestinas e com deficiência', papel: 'modo', porque: 'Como faz: dá rosto a quem era "ninguém" (motivo B).' },
          { trecho: 'contadas por elas mesmas em rodas de conversa', papel: 'detalhamento', porque: 'Detalha o modo.' },
          { trecho: 'a fim de que o diferente deixe de ser visto como inferior', papel: 'efeito', porque: 'Para quê: responde ao motivo A.' },
          { trecho: 'os lírios de Drummond poderão enfim nascer', papel: 'retomada', porque: 'Última frase: volta ao Drummond.' },
        ],
      },
    },
  },
];
