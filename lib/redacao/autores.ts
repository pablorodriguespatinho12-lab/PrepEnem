// Ficha de cada autor das 5 causas: obra, ano e a ideia em 1 linha. Sem ela o
// aluno cita só o nome, o que o INEP chama de repertório de bolso (Pablo,
// 27/10/2026). Fonte: docs/redacao/receita-redacao.md, "Repertório por eixo"
// e "Ideia de cada autor". A chave é o texto exato de Causa.repertorios.

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

export const autorPorNome = (nome: string): Autor | null => AUTORES[nome] ?? null;
