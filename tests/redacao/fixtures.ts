// Redação ORIGINAL do PrepEnem (não é da cartilha), escrita na receita de 4
// parágrafos, e a evidência que uma IA bem-comportada devolveria para ela.
// Serve aos testes sem IA: cada trecho da evidência existe no texto.

export const TEMA = 'O estigma associado às doenças mentais na sociedade brasileira';

export const REDACAO = [
  'Segundo Erving Goffman, em Estigma, a sociedade reduz a pessoa a um atributo e passa a excluí-la por ele. Essa reflexão se aplica ao Brasil contemporâneo, onde o estigma associado às doenças mentais ainda afasta pacientes do cuidado. Tal cenário decorre, sobretudo, da desinformação sobre o sofrimento psíquico e da herança manicomial das instituições.',
  'Em primeiro lugar, cabe destacar a desinformação como fator central do estigma. Nesse sentido, a ideia de Goffman mostra que o rótulo de "louco" apaga a pessoa e deixa só a doença. Isso se verifica no país quando estudantes escondem crises de ansiedade por medo de chacota, o que atrasa o diagnóstico. Assim, a falta de informação mantém o preconceito contra quem adoece.',
  'Além disso, a herança manicomial também contribui para o estigma. Sob essa ótica, a Lei 10.216, de 2001, trocou a internação em manicômio pelo cuidado em liberdade, na comunidade. Na realidade brasileira, porém, os CAPS ainda são poucos em muitas cidades, o que faz a internação parecer a única saída. Logo, enquanto o cuidado em liberdade não chegar a todos, o doente continuará visto como alguém a ser isolado.',
  'Portanto, é preciso enfrentar a desinformação e a herança manicomial. Para isso, o Ministério da Saúde deve criar campanhas permanentes contra o estigma, por meio de anúncios nas redes sociais e nas unidades básicas de saúde, a fim de que pessoas em sofrimento busquem tratamento sem vergonha. As campanhas devem trazer depoimentos de pacientes que se recuperaram nos CAPS. Dessa forma, a sociedade deixará de reduzir a pessoa à doença, como alertava Goffman.',
].join('\n\n');

const el = (trecho: string | null, valido = trecho !== null) => ({ trecho, valido });

/* Evidência de uma redação nota 1000. Os testes sobrescrevem um pedaço por vez. */
export function evidencia1000(sobrescrever: Record<string, unknown> = {}) {
  return {
    c1: { estrutura: 'excelente', trecho: 'Essa reflexão se aplica ao Brasil contemporâneo', descritor: 'no máximo 1 falha', desvios: [] },
    c2: {
      abordagem: 'completa', trecho: 'o estigma associado às doenças mentais ainda afasta pacientes do cuidado', descritor: 'completa',
      outroTipoTextual: false, copiaMotivadores: false, partesEmbrionarias: 0,
      repertorios: [{
        cita: 'Segundo Erving Goffman, em Estigma',
        explica: 'a sociedade reduz a pessoa a um atributo e passa a excluí-la por ele',
        amarra: 'estudantes escondem crises de ansiedade por medo de chacota',
        legitimado: true, pertinente: true, comentario: '',
      }],
    },
    c3: {
      nivel: 200, trecho: 'Tal cenário decorre, sobretudo, da desinformação', descritor: 'projeto estratégico', contradicaoGrave: false,
      paragrafos: [1, 2, 3, 4].map((numero) => ({ numero, ideia: 'x', desenvolvida: true, comentario: '' })),
    },
    c4: {
      nivel: 200, trecho: 'Além disso, a herança manicomial', descritor: 'presença expressiva',
      operadoresEntreParagrafos: ['Em primeiro lugar', 'Além disso', 'Portanto'], todoParagrafoTemCoesivo: true, inadequacoes: [], repeticoes: [],
    },
    c5: {
      agente: el('o Ministério da Saúde'),
      acao: el('deve criar campanhas permanentes contra o estigma'),
      modo: el('por meio de anúncios nas redes sociais'),
      efeito: el('a fim de que pessoas em sofrimento busquem tratamento sem vergonha'),
      detalhamento: el('depoimentos de pacientes que se recuperaram nos CAPS'),
      desrespeitaDH: false, condicional: false,
    },
    proximoPasso: {},
    reescritas: [],
    ...sobrescrever,
  };
}
