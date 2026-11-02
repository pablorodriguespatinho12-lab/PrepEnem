// A ligação do Drummond quando o tema não tem lei própria (Pablo, 02/11/2026:
// "como eu poderia linkar sem usar a lei?", e não quer a Constituição de 1988,
// que aparece em 15 das 47 redações nota 1000 do censo). Não é coringa: não
// passou pela prova dos 3 juízes, é a LEI que entra na amarra do Drummond.
//
// Fonte: Pacto Internacional sobre Direitos Econômicos, Sociais e Culturais
// (ONU, 1966), promulgado no Brasil pelo Decreto 591, de 6 de julho de 1992
// (planalto.gov.br/ccivil_03/decreto/1990-1994/d0591.htm). Art. 6º e 7º
// trabalho; art. 11 alimentação, vestimenta e moradia; art. 12 "o mais elevado
// nível possível de saúde física e mental"; art. 13 educação.

export const MOLDE_LIGACAO_SEM_LEI =
  'No Brasil, [o problema do tema] confirma isso: a lei garante [o direito], mas na prática [o que acontece de verdade].';

export const LEI_CORINGA = {
  nome: 'Pacto Internacional sobre Direitos Econômicos, Sociais e Culturais',
  quando: 'ONU, 1966; o Brasil adotou em 1992',
  artigos: [
    { artigo: 'art. 6º e 7º', assunto: 'trabalho digno' },
    { artigo: 'art. 11', assunto: 'alimentação e moradia' },
    { artigo: 'art. 12', assunto: 'saúde física e mental' },
    { artigo: 'art. 13', assunto: 'educação' },
  ],
} as const;
