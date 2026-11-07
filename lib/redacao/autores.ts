// Ficha de cada autor das 5 causas: obra, ano e a ideia em 1 linha. Sem ela o
// aluno cita só o nome, o que o INEP chama de repertório de bolso (Pablo,
// 27/10/2026). Fonte: docs/redacao/receita-redacao.md, "Repertório por eixo"
// e "Ideia de cada autor". A chave é o texto exato de Causa.repertorios.

import type { ChaveCausa } from './receita';

export interface Autor {
  nome: string;
  obra: string;
  ano: number;
  ideia: string;
}

export const AUTORES: Record<string, Autor> = {
  'CF art. 3º e 6º': {
    nome: 'Constituição Federal, art. 3º e 6º', obra: 'Constituição da República', ano: 1988,
    ideia: 'Reduzir desigualdades é objetivo do país, e saúde, educação e moradia são direitos sociais.',
  },
  'Amartya Sen': {
    nome: 'Amartya Sen', obra: 'Desenvolvimento como Liberdade', ano: 1999,
    ideia: 'Desenvolver é ampliar as liberdades reais das pessoas, não só o direito no papel.',
  },
  'José Murilo de Carvalho': {
    nome: 'José Murilo de Carvalho', obra: 'Cidadania no Brasil', ano: 2001,
    ideia: 'A cidadania brasileira é incompleta: os direitos existem, mas não chegam a todos.',
  },
  'Lei do SUS': {
    nome: 'Lei do SUS (Lei 8.080)', obra: 'Lei Orgânica da Saúde', ano: 1990,
    ideia: 'Saúde é direito de todos e dever do Estado, com acesso universal e gratuito.',
  },
  'Celso Furtado': {
    nome: 'Celso Furtado', obra: 'Formação Econômica do Brasil', ano: 1959,
    ideia: 'A economia colonial, voltada para fora, deixou a desigualdade que o país ainda carrega.',
  },
  'Sérgio Buarque': {
    nome: 'Sérgio Buarque de Holanda', obra: 'Raízes do Brasil', ano: 1936,
    ideia: 'O "homem cordial" mistura o público e o privado e decide pelo afeto, não pela regra.',
  },
  'Lélia Gonzalez': {
    nome: 'Lélia Gonzalez', obra: 'A categoria político-cultural de amefricanidade', ano: 1988,
    ideia: 'A cultura brasileira foi feita por africanos e indígenas, e o racismo apaga essa herança.',
  },
  Bourdieu: {
    nome: 'Pierre Bourdieu (com Passeron)', obra: 'A Reprodução', ano: 1970,
    ideia: 'A escola premia quem já chega com mais cultura em casa e assim repete a desigualdade.',
  },
  Piketty: {
    nome: 'Thomas Piketty', obra: 'O Capital no Século XXI', ano: 2013,
    ideia: 'Quando a riqueza rende mais que a economia cresce, a desigualdade só aumenta.',
  },
  'Josué de Castro': {
    nome: 'Josué de Castro', obra: 'Geografia da Fome', ano: 1946,
    ideia: 'A fome no Brasil é produto da desigualdade social, não da natureza.',
  },
  'Anísio Teixeira': {
    nome: 'Anísio Teixeira', obra: 'Educação não é privilégio', ano: 1957,
    ideia: 'Escola pública de qualidade é direito de todos, não privilégio de poucos.',
  },
  Goffman: {
    nome: 'Erving Goffman', obra: 'Estigma', ano: 1963,
    ideia: 'O estigma reduz a pessoa a uma marca, e ela deixa de ser vista por inteiro.',
  },
  'Hannah Arendt': {
    nome: 'Hannah Arendt', obra: 'Origens do Totalitarismo', ano: 1951,
    ideia: 'Quem perde o lugar na comunidade perde o "direito a ter direitos".',
  },
  Foucault: {
    nome: 'Michel Foucault', obra: 'História da Loucura', ano: 1961,
    ideia: 'A sociedade aprendeu a isolar quem foge da norma em vez de acolher.',
  },
  'Nise da Silveira': {
    nome: 'Nise da Silveira', obra: 'Museu de Imagens do Inconsciente (fundação)', ano: 1952,
    ideia: 'Tratou pacientes psiquiátricos com arte e afeto, contra o isolamento e o eletrochoque.',
  },
  Zuboff: {
    nome: 'Shoshana Zuboff', obra: 'A Era do Capitalismo de Vigilância', ano: 2019,
    ideia: 'Empresas lucram transformando o comportamento das pessoas em dado para prever escolhas.',
  },
  'Ricardo Antunes': {
    nome: 'Ricardo Antunes', obra: 'O privilégio da servidão', ano: 2018,
    ideia: 'O trabalho precário virou regra, e ter qualquer emprego passou a parecer privilégio.',
  },
  'Byung-Chul Han': {
    nome: 'Byung-Chul Han', obra: 'Sociedade do cansaço', ano: 2010,
    ideia: 'A cobrança por desempenho faz a pessoa se explorar até o esgotamento.',
  },
  'Ulrich Beck': {
    nome: 'Ulrich Beck', obra: 'Sociedade de Risco', ano: 1986,
    ideia: 'O progresso produz riscos para todos, mas eles pesam mais sobre os pobres.',
  },
};

/* Coringas (Pablo, 29/10/2026: "coisa muito rara, mas que serve para tudo";
   depois de ver conceitos no ar: "fáceis de memorizar, falas de autores ou
   dados"). Cada motivo tem 2 frases exatas de autor e 1 dado oficial, todos
   conferidos em fonte (frase sem fonte primária, como a "metade da humanidade
   não come" atribuída a Josué de Castro, ficou de fora).
   Análise e fontes: docs/redacao/repertorios-coringa.md. A Cartilha 2025
   (p.16) pune o "repertório de bolso", o que é usado em qualquer tema "de
   forma decorada, automática ou forçada": por isso cada coringa traz a frase
   que o AMARRA a cada motivo em que ele serve. */
export interface Coringa {
  tipo: 'fala' | 'dado';
  /* O que aparece na pílula: o autor (fala) ou o dado em poucas palavras. */
  rotulo: string;
  /* A frase exata do autor (vai entre aspas na tela) ou o dado com o número. */
  texto: string;
  /* A frase em palavras simples: quem nunca leu a obra entende logo
     (aluno-do-zero, 29/10/2026: "lírios", "as batatas" travavam). */
  sentido?: string;
  /* Quem disse e onde (fala), ou a pesquisa (dado). */
  fonte: string;
  quando: string;
  /* Em quantos dos 28 temas do ENEM de 1998 a 2025 ele sustentou nota 200,
     com 3 juízes cegos (docs/redacao/repertorios-coringa.md). */
  prova: { aprovados: number; temas: number };
  /* Forma curta para decorar, citada como ideia (sem aspas): nenhum dos 3
     alunos do teste decorou a frase longa do Rui Barbosa. */
  curta?: string;
  /* Para quem não serve em quase todo tema: onde ele funcionou. */
  restricao?: string;
  amarra: Partial<Record<ChaveCausa, string>>;
}

export const CORINGAS: Record<string, Coringa> = {
  Drummond: {
    tipo: 'fala', rotulo: 'Carlos Drummond de Andrade', quando: '1945', prova: { aprovados: 28, temas: 28 },
    texto: 'As leis não bastam. Os lírios não nascem da lei.',
    sentido: 'Lírio é uma flor: a vida boa não nasce só porque uma lei manda.',
    fonte: 'poema "Nosso tempo", do livro A Rosa do Povo',
    amarra: {
      estado: 'A lei já garante o direito, mas, como diz Drummond, só a lei não faz o direito chegar a quem precisa.',
      acesso: 'O direito existe no papel, mas sem ação ele não chega a quem mais precisa dele.',
      historia: 'A Lei Áurea acabou com a escravidão no papel, mas, como diz Drummond, só a lei não deu terra, escola nem trabalho.',
      mercado: 'Há leis que protegem o trabalhador e o consumidor, mas só a lei não impede que o lucro passe por cima das pessoas.',
    },
  },
  'Dom Hélder': {
    tipo: 'fala', rotulo: 'Dom Hélder Câmara', quando: 'viveu de 1909 a 1999', prova: { aprovados: 21, temas: 28 },
    texto: 'Quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles são pobres, chamam-me de comunista.',
    sentido: 'Ajudar é aplaudido; perguntar a causa do problema incomoda. Na redação, escreva "como dizia Dom Hélder", sem data.',
    fonte: 'arcebispo de Olinda e Recife',
    amarra: {
      estado: 'Ajudar na emergência é preciso, mas o Estado também tem de perguntar por que o problema existe e atacar a causa.',
      acesso: 'Doar resolve o dia; perguntar por que falta é o que muda o acesso de verdade.',
    },
  },
  'Rui Barbosa': {
    tipo: 'fala', rotulo: 'Rui Barbosa', quando: '1921', prova: { aprovados: 24, temas: 28 },
    texto: 'Tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real.',
    sentido: 'Tratar todo mundo igual parece justo, mas quem começa em desvantagem precisa de mais para chegar ao mesmo lugar.',
    curta: 'Tratar igual quem é desigual é desigualdade, e não igualdade real.',
    fonte: 'discurso Oração aos Moços',
    amarra: {
      estado: 'O Estado não pode dar o mesmo a quem precisa de mais: tratar igual quem está em desvantagem mantém a desigualdade.',
      acesso: 'Oferecer o mesmo a todos não basta se uns partem de trás: a justiça dá mais a quem tem menos.',
      historia: 'Grupos deixados para trás pela história só alcançam os outros com tratamento diferente, como as cotas.',
    },
  },
  'Elie Wiesel': {
    tipo: 'fala', rotulo: 'Elie Wiesel', quando: '1986', prova: { aprovados: 18, temas: 28 },
    texto: 'O oposto do amor não é o ódio, é a indiferença.',
    sentido: 'Fingir que não vê quem sofre é tão grave quanto agredir.',
    fonte: 'entrevista à revista US News & World Report, em tradução',
    amarra: {
      estigma: 'Ignorar quem sofre também fere: a indiferença da sociedade é o que mantém o grupo invisível.',
    },
  },
  Graciliano: {
    tipo: 'fala', rotulo: 'Graciliano Ramos', quando: '1938', prova: { aprovados: 19, temas: 28 },
    /* Nas redações nota 1000, construído em volta dele: 1 de 5 (forçado em racismo e velhice). */
    restricao: 'serviu em temas de pobreza, trabalho e exclusão; em racismo e velhice ficou forçado',
    texto: 'Você é um bicho, Fabiano.',
    sentido: 'Fabiano é um sertanejo pobre, tão maltratado pela seca e pelo patrão que passa a se ver como bicho.',
    fonte: 'romance Vidas Secas',
    amarra: {
      estigma: 'Fabiano, tratado como menos que gente, passa a se ver como bicho, e é isso que o preconceito faz.',
      mercado: 'Enganado nas contas pelo patrão, Fabiano aceita calado: quem trabalha sem direitos se sente menos que gente.',
    },
  },
  /* Rodadas 3 e 4 (06/11/2026): Galeano e Brecht passaram em 18 de 28 e
     entraram no lugar de Luther King (12) e Machado (6), na mesma posição para
     o baralho manter a ordem dos cartões. João Cabral (12) e Darcy (16) ficaram
     de fora. Fontes: docs/redacao/repertorios-coringa.md. */
  Galeano: {
    tipo: 'fala', rotulo: 'Eduardo Galeano', quando: '1989', prova: { aprovados: 18, temas: 28 },
    texto: 'Os ninguéns: os filhos de ninguém, os donos de nada.',
    sentido: 'Há gente que a sociedade trata como se não existisse: sem nome, sem voz e sem nada.',
    fonte: 'texto "Os ninguéns", em O Livro dos Abraços',
    amarra: {
      estigma: 'Como os "ninguéns" de Galeano, quem sofre com o problema vira invisível: ninguém vê, ninguém cuida.',
    },
  },
  Brecht: {
    tipo: 'fala', rotulo: 'Bertolt Brecht', quando: 'anos 1930', prova: { aprovados: 18, temas: 28 },
    texto: 'Do rio que tudo arrasta se diz que é violento, mas ninguém diz violentas as margens que o comprimem.',
    sentido: 'Culpam a força do rio, mas não as margens que o apertam: culpam a reação de quem sofre, e não o que a causou.',
    fonte: 'poema "Sobre a violência", em tradução',
    amarra: {
      mercado: 'Condena-se a reação de quem é explorado, mas não a lógica de lucro que o aperta, como as margens do rio.',
    },
  },
  'Dado 1888': {
    tipo: 'dado', rotulo: 'último a abolir a escravidão', quando: '1888', prova: { aprovados: 12, temas: 28 },
    restricao: 'serviu em temas de raça, trabalho e cidadania: herança africana, religião, trabalho infantil e de cuidado, imigração, voto',
    texto: 'O Brasil foi o último país das Américas a acabar com a escravidão, em 1888, com a Lei Áurea.',
    fonte: 'Lei nº 3.353, de 13 de maio de 1888 (a Lei Áurea)',
    amarra: {
      historia: 'Mais de três séculos de escravidão e um fim sem terra, escola nem trabalho para os libertos ainda pesam sobre o país.',
    },
  },
};

export const autorPorNome = (nome: string): Autor | null => AUTORES[nome] ?? null;
export const coringaPorNome = (nome: string): Coringa | null => CORINGAS[nome] ?? null;
