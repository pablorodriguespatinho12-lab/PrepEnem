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
  /* Em quantos dos 11 temas do ENEM de 2015 a 2025 ele sustentou nota 200,
     com 3 juízes cegos (docs/redacao/prova-coringas.md). */
  prova: { aprovados: number; temas: number };
  /* Para quem não serve em quase todo tema: onde ele funcionou. */
  restricao?: string;
  amarra: Partial<Record<ChaveCausa, string>>;
}

export const CORINGAS: Record<string, Coringa> = {
  Drummond: {
    tipo: 'fala', rotulo: 'Carlos Drummond de Andrade', quando: '1945', prova: { aprovados: 11, temas: 11 },
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
    tipo: 'fala', rotulo: 'Dom Hélder Câmara', quando: 'anos 1960 e 1970', prova: { aprovados: 11, temas: 11 },
    texto: 'Quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles não têm comida, chamam-me de comunista.',
    sentido: 'Ajudar é aplaudido; perguntar a causa do problema incomoda. Na redação, escreva "como dizia Dom Hélder", sem data.',
    fonte: 'arcebispo de Olinda e Recife',
    amarra: {
      estado: 'Ajudar na emergência é preciso, mas o Estado também tem de perguntar por que o problema existe e atacar a causa.',
      acesso: 'Doar resolve o dia; perguntar por que falta é o que muda o acesso de verdade.',
    },
  },
  'Rui Barbosa': {
    tipo: 'fala', rotulo: 'Rui Barbosa', quando: '1920', prova: { aprovados: 11, temas: 11 },
    texto: 'Tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real.',
    sentido: 'Tratar todo mundo igual parece justo, mas quem começa em desvantagem precisa de mais para chegar ao mesmo lugar.',
    fonte: 'discurso Oração aos Moços',
    amarra: {
      estado: 'O Estado não pode dar o mesmo a quem precisa de mais: tratar igual quem está em desvantagem mantém a desigualdade.',
      acesso: 'Oferecer o mesmo a todos não basta se uns partem de trás: a justiça dá mais a quem tem menos.',
      historia: 'Grupos deixados para trás pela história só alcançam os outros com tratamento diferente, como as cotas.',
    },
  },
  'Elie Wiesel': {
    tipo: 'fala', rotulo: 'Elie Wiesel', quando: '1986', prova: { aprovados: 8, temas: 11 },
    texto: 'O oposto do amor não é o ódio, é a indiferença.',
    sentido: 'Fingir que não vê quem sofre é tão grave quanto agredir.',
    fonte: 'entrevista à revista US News & World Report (tradução)',
    amarra: {
      estigma: 'Ignorar quem sofre também fere: a indiferença da sociedade é o que mantém o grupo invisível.',
    },
  },
  Graciliano: {
    tipo: 'fala', rotulo: 'Graciliano Ramos', quando: '1938', prova: { aprovados: 7, temas: 11 },
    texto: 'Você é um bicho, Fabiano.',
    sentido: 'Fabiano é um sertanejo pobre, tão maltratado pela seca e pelo patrão que passa a se ver como bicho.',
    fonte: 'romance Vidas Secas',
    amarra: {
      estigma: 'Fabiano, tratado como menos que gente, passa a se ver como bicho, e é isso que o preconceito faz.',
      mercado: 'Enganado nas contas pelo patrão, Fabiano aceita calado: quem trabalha sem direitos se sente menos que gente.',
    },
  },
  'Luther King': {
    tipo: 'fala', rotulo: 'Martin Luther King Jr.', quando: '1963', prova: { aprovados: 7, temas: 11 },
    texto: 'A injustiça em qualquer lugar é uma ameaça à justiça em todo lugar.',
    sentido: 'Quando um grupo perde direitos, ninguém está seguro: a injustiça se espalha.',
    fonte: 'Carta da Prisão de Birmingham (tradução)',
    amarra: {
      estigma: 'O preconceito contra um grupo ameaça os direitos de todos, não só os de quem é atingido.',
    },
  },
  Machado: {
    tipo: 'fala', rotulo: 'Machado de Assis', quando: '1891', prova: { aprovados: 4, temas: 11 },
    restricao: 'serviu em temas de desigualdade e disputa: herança africana, povos tradicionais, trabalho de cuidado, cinema',
    texto: 'Ao vencido, ódio ou compaixão; ao vencedor, as batatas.',
    sentido: 'Quem vence a disputa leva o prêmio (as batatas); quem perde ganha só raiva ou pena. Machado zomba dessa lei do mais forte.',
    fonte: 'romance Quincas Borba, capítulo VI',
    amarra: {
      mercado: 'Na competição sem limites, como ironizava Machado, quem vence leva tudo e quem perde recebe, no máximo, pena.',
    },
  },
  'Dado 1888': {
    tipo: 'dado', rotulo: 'último a abolir a escravidão', quando: '1888', prova: { aprovados: 4, temas: 11 },
    restricao: 'serviu em temas de população negra, religião de matriz africana, povos tradicionais e trabalho de cuidado',
    texto: 'O Brasil foi o último país das Américas a acabar com a escravidão, em 1888, com a Lei Áurea.',
    fonte: 'Lei nº 3.353, de 13 de maio de 1888 (a Lei Áurea)',
    amarra: {
      historia: 'Mais de três séculos de escravidão e um fim sem terra, escola nem trabalho para os libertos ainda pesam sobre o país.',
    },
  },
};

export const autorPorNome = (nome: string): Autor | null => AUTORES[nome] ?? null;
export const coringaPorNome = (nome: string): Coringa | null => CORINGAS[nome] ?? null;
