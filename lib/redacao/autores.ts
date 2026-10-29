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

/* Coringas raros (Pablo, 29/10/2026: "coisa muito rara, mas que serve para
   tudo"). Critério, nota 0 a 2 em cada: raro em redação de ENEM, serve a 3
   ou mais dos 5 motivos, o leigo entende em 1 linha, fato conferido em fonte.
   Análise e fontes: docs/redacao/repertorios-coringa.md. A Cartilha 2025
   (p.16) pune o "repertório de bolso", o que é usado em qualquer tema "de
   forma decorada, automática ou forçada": por isso cada coringa traz a frase
   que o AMARRA a cada motivo em que ele serve. */
export interface Coringa extends Autor {
  area: string;
  amarra: Partial<Record<ChaveCausa, string>>;
}

export const CORINGAS: Record<string, Coringa> = {
  'Efeito Mateus': {
    nome: 'Robert K. Merton (Efeito Mateus)', obra: 'artigo "O Efeito Mateus na ciência", revista Science', ano: 1968, area: 'Sociologia',
    ideia: 'Cientistas famosos levam mais crédito pelo mesmo trabalho: quem já tem vantagem ganha mais (o nome vem do Evangelho de Mateus).',
    amarra: {
      acesso: 'Quem nasce com acesso a boa escola e saúde acumula mais chances, e a distância para os outros só cresce.',
      mercado: 'É o mesmo mecanismo com o dinheiro: renda gera mais renda, e quem começou sem nada fica para trás.',
      historia: 'A vantagem que alguns grupos tiveram no passado se acumula até hoje, geração após geração.',
    },
  },
  'Efeito espectador': {
    nome: 'Darley e Latané (efeito espectador)', obra: 'experimento de psicologia publicado em revista científica', ano: 1968, area: 'Psicologia',
    ideia: 'Num experimento, cada pessoa demorava mais a ajudar quando sabia que outras também tinham percebido o problema.',
    amarra: {
      estigma: 'Todos percebem quem sofre com o problema e, justamente por isso, ninguém se sente responsável por ajudar.',
      estado: 'Como no efeito espectador, quando vários órgãos dividem a tarefa, cada um espera o outro e o problema fica sem dono.',
    },
  },
  'Mundo justo': {
    nome: 'Melvin Lerner (crença no mundo justo)', obra: 'livro The Belief in a Just World ("A crença num mundo justo")', ano: 1980, area: 'Psicologia',
    ideia: 'As pessoas querem acreditar que cada um recebe o que merece; por isso tendem a culpar quem sofre pelo próprio sofrimento.',
    amarra: {
      estigma: 'Quem sofre com o problema é visto como culpado pela própria situação, e isso serve de desculpa para não ajudar.',
      acesso: 'Quem não tem acesso é acusado de "não ter se esforçado", e a desigualdade passa a parecer justa.',
    },
  },
  'Cidadania regulada': {
    nome: 'Wanderley Guilherme dos Santos (cidadania regulada)', obra: 'livro Cidadania e Justiça', ano: 1979, area: 'Ciência política',
    ideia: 'No governo de Getúlio Vargas (anos 1930 e 1940), só tinha direito trabalhista e aposentadoria quem tinha carteira assinada.',
    amarra: {
      estado: 'Restos dessa lógica ainda deixam quem trabalha sem carteira com menos proteção do que a lei promete a todos.',
      historia: 'Desde Vargas, os direitos chegaram primeiro a quem tinha carteira assinada, e quem ficou de fora ainda espera.',
      acesso: 'Quem trabalha sem carteira ainda tem menos acesso a aposentadoria e proteção quando adoece.',
    },
  },
  'Vozes da Seca': {
    nome: 'Luiz Gonzaga e Zé Dantas, "Vozes da Seca"', obra: 'canção', ano: 1953, area: 'Música',
    ideia: 'O sertanejo pede aos políticos obra que resolva a seca, como açude e trabalho, e não só uma ajuda que acaba logo.',
    amarra: {
      estado: 'O Estado ainda responde com ajuda emergencial, sem a obra que resolveria o problema de vez.',
      estigma: 'Quem precisa de apoio é tratado como pedinte, e não como cidadão com direitos.',
      acesso: 'Sem a obra que fica, o acesso à água e ao trabalho continua dependendo de favor.',
    },
  },
  'A Cidade': {
    nome: 'Chico Science & Nação Zumbi, "A Cidade"', obra: 'canção do disco Da Lama ao Caos', ano: 1994, area: 'Música',
    ideia: 'A cidade cresce sem parar, mas "o de cima sobe e o de baixo desce": o rico fica mais rico, e o pobre, mais pobre.',
    amarra: {
      acesso: 'O país cresce, mas o acesso fica com quem já está em cima, e quem está embaixo desce ainda mais.',
      mercado: 'A cidade cresce como negócio, e o lucro de poucos aumenta a distância entre as pessoas.',
    },
  },
  'A Caverna': {
    nome: 'José Saramago, A Caverna', obra: 'romance', ano: 2000, area: 'Literatura',
    ideia: 'Um artesão de louça de barro perde o único comprador, um shopping gigante que só quer prato de plástico: o mercado descarta pessoas.',
    amarra: {
      mercado: 'Como o artesão de Saramago, quem não dá lucro é descartado, mesmo quando o que faz tem valor.',
      estigma: 'Quem é visto como antigo é descartado, como o artesão do romance, mesmo sabendo fazer bem o seu trabalho.',
      acesso: 'Quem não acompanha o que o mercado quer perde o acesso ao próprio sustento.',
    },
  },
  'Isaías Caminha': {
    nome: 'Lima Barreto, Recordações do Escrivão Isaías Caminha', obra: 'romance', ano: 1909, area: 'Literatura',
    ideia: 'Um jovem mulato e pobre acredita que estudar basta para subir na vida e esbarra no racismo: o esforço sozinho não abre porta fechada.',
    amarra: {
      estigma: 'Como Isaías Caminha, quem carrega o estigma é julgado antes de mostrar o que sabe.',
      historia: 'Escrito 21 anos após o fim da escravidão, o livro mostra uma liberdade sem integração que ainda pesa hoje.',
      acesso: 'Estudar não basta quando a porta já está fechada para alguns grupos.',
    },
  },
  'Amor e Fúria': {
    nome: 'Luiz Bolognesi, Uma História de Amor e Fúria', obra: 'animação premiada no festival de Annecy, na França', ano: 2013, area: 'Cinema',
    ideia: 'Um herói atravessa mais de 500 anos de Brasil, da colonização até 2096, e vê sempre os mesmos vencedores.',
    amarra: {
      historia: 'Os mesmos grupos vencem há 500 anos, e o problema de hoje é mais um capítulo dessa história.',
      mercado: 'No filme, em 2096, até a água vira mercadoria: quem não pode pagar fica sem.',
      acesso: 'Quem não pode pagar fica sem o básico, como a água no Rio de 2096 do filme.',
    },
  },
  'Revolta da Vacina': {
    nome: 'Nicolau Sevcenko, A Revolta da Vacina', obra: 'livro de história', ano: 1984, area: 'História',
    ideia: 'Em 1904, o povo do Rio se revoltou também contra as obras que derrubaram as casas dos pobres: o problema era a imposição, não a vacina.',
    amarra: {
      estado: 'Quando o Estado impõe sem explicar, como em 1904, a população desconfia até do que é bom para ela.',
      acesso: 'Os pobres foram tirados do centro do Rio, e morar perto do trabalho virou privilégio.',
      estigma: 'Em 1904, o pobre foi tratado como foco de doença, e não como cidadão.',
    },
  },
};

export const autorPorNome = (nome: string): Autor | null => AUTORES[nome] ?? CORINGAS[nome] ?? null;
export const coringaPorNome = (nome: string): Coringa | null => CORINGAS[nome] ?? null;
