// Conteúdo escrito à mão para os 7 temas da tabela "Ano | Tema | Causas" de
// docs/redacao/receita-redacao.md (Pablo, 28/10/2026). Para cada tema:
// - formaCurta: como o tema volta depois da 1ª vez (a frase inteira do tema
//   só aparece uma vez; repetir a frase inteira cansa e conta contra a C4);
// - topico: o motivo dito COM as palavras do tema, para o tópico frasal não
//   ficar circular ("destacar o estigma como fator central do estigma");
// - combinaPouco: motivos que servem mal ao tema (avisa, não bloqueia);
// - perguntas: as perguntas-guia que levam o aluno à resposta.
// Tema fora da lista usa as perguntas gerais e o molde com colchetes.
// Sem IA e sem Neon: tudo aqui é texto fixo.

import type { ChaveCausa } from './receita';

export interface ConteudoTema {
  ano: number;
  /* Texto do tema como está na lista (EssayTheme e data/redacao/modelos.ts). */
  tema: string;
  /* O problema escrito por inteiro, quando o tema não é uma frase de problema. */
  problema?: string;
  formaCurta: string;
  causas: [ChaveCausa, ChaveCausa];
  topico: Record<ChaveCausa, string>;
  combinaPouco: ChaveCausa[];
  perguntas: {
    /* Uma pergunta por motivo: aparece no passo 2 e no parágrafo do motivo. */
    motivo: Record<ChaveCausa, string>;
    introducao: string[];
    conclusao: string[];
  };
}

export const CONTEUDO_TEMAS: ConteudoTema[] = [
  {
    ano: 2025,
    tema: 'Perspectivas acerca do envelhecimento na sociedade brasileira',
    problema: 'o desafio do envelhecimento na sociedade brasileira',
    formaCurta: 'o desafio do envelhecimento',
    causas: ['estigma', 'estado'],
    topico: {
      estigma: 'o preconceito contra a velhice, que trata o idoso como peso',
      estado: 'a falta de políticas públicas de cuidado para a pessoa idosa',
      historia: 'o costume de deixar o cuidado do idoso só para a família',
      acesso: 'a desigualdade no acesso à saúde e à renda na velhice',
      mercado: 'o mercado de trabalho que descarta quem tem mais idade',
    },
    combinaPouco: ['historia'],
    perguntas: {
      motivo: {
        estigma: 'Por que tanta gente vê o idoso como alguém que só dá trabalho?',
        estado: 'O governo prepara o país para ter mais idosos?',
        historia: 'Desde quando o cuidado do idoso fica só com a família?',
        acesso: 'Todo idoso consegue médico e renda do mesmo jeito?',
        mercado: 'Por que é difícil conseguir emprego depois dos 50?',
      },
      introducao: ['Que autor fala de quem é deixado de lado pela sociedade?', 'Que mudança na população do Brasil liga esse autor ao tema?'],
      conclusao: ['Quem cuida da política para idosos no país?', 'Com o quê ele chega até o idoso?', 'Para quê: o que muda na vida dele?'],
    },
  },
  {
    ano: 2024,
    tema: 'Desafios para a valorização da herança africana no Brasil',
    formaCurta: 'o apagamento da herança africana',
    causas: ['historia', 'estigma'],
    topico: {
      historia: 'a herança da escravidão, que pôs a cultura africana à margem',
      estigma: 'o racismo que trata religiões e costumes africanos como inferiores',
      estado: 'o descumprimento da lei que manda ensinar história africana nas escolas',
      acesso: 'a pouca presença de autores e artistas negros nos espaços de cultura',
      mercado: 'o uso comercial da cultura negra sem retorno para quem a criou',
    },
    combinaPouco: ['mercado'],
    perguntas: {
      motivo: {
        historia: 'O que a escravidão deixou na forma como o país vê a cultura africana?',
        estigma: 'Por que religiões de matriz africana ainda sofrem ataques?',
        estado: 'A escola ensina a história da África como a lei manda?',
        acesso: 'Quantos autores negros você leu na escola?',
        mercado: 'Quem ganha dinheiro com a cultura negra?',
      },
      introducao: ['Que autor fala da cultura feita por africanos no Brasil?', 'Que fato do passado mostra esse apagamento?'],
      conclusao: ['Quem decide o que a escola ensina?', 'Com o quê essa história chega à sala de aula?', 'Para quê: o que muda para o aluno?'],
    },
  },
  {
    ano: 2023,
    tema: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    problema: 'a invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    formaCurta: 'a invisibilidade do trabalho de cuidado',
    causas: ['estigma', 'historia'],
    topico: {
      estigma: 'a ideia de que cuidar da casa e da família não é trabalho',
      historia: 'a herança patriarcal que entregou o cuidado só às mulheres',
      estado: 'a falta de creches e de apoio público a quem cuida',
      acesso: 'a desigualdade que pesa mais sobre as mulheres pobres',
      mercado: 'a economia que não conta o cuidado sem salário como trabalho',
    },
    combinaPouco: ['acesso'],
    perguntas: {
      motivo: {
        estigma: 'Por que lavar, cozinhar e cuidar dos filhos não parece trabalho?',
        historia: 'Desde quando o cuidado da casa é visto como coisa de mulher?',
        estado: 'Há creche para todas as mães que precisam trabalhar?',
        acesso: 'Quem paga mais caro por esse trabalho sem salário?',
        mercado: 'Por que esse trabalho não entra na conta da economia?',
      },
      introducao: ['Que autora fala do lugar da mulher na sociedade?', 'Que fato do Brasil mostra quem faz o trabalho de casa?'],
      conclusao: ['Quem pode dividir esse cuidado com as famílias?', 'Com o quê: creche, lei, campanha?', 'Para quê: o que muda para a mulher?'],
    },
  },
  {
    ano: 2022,
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    formaCurta: 'a desvalorização dos povos tradicionais',
    causas: ['historia', 'estado'],
    topico: {
      historia: 'a herança colonial de tomar as terras dos povos originários',
      estado: 'a demora do Estado em demarcar e proteger esses territórios',
      estigma: 'o preconceito que vê esses povos como atrasados',
      acesso: 'a falta de escola e de saúde que respeitem a cultura dessas comunidades',
      mercado: 'o avanço do garimpo e do desmatamento sobre as terras tradicionais',
    },
    combinaPouco: ['acesso'],
    perguntas: {
      motivo: {
        historia: 'O que aconteceu com as terras indígenas desde 1500?',
        estado: 'O governo protege as terras dessas comunidades?',
        estigma: 'Por que tanta gente acha que esses povos são atrasados?',
        acesso: 'A escola dessas comunidades fala a língua delas?',
        mercado: 'Quem lucra quando a floresta vira garimpo?',
      },
      introducao: ['Que autor indígena fala da relação com a terra?', 'Que fato do Brasil mostra essa ameaça?'],
      conclusao: ['Quem demarca e protege essas terras?', 'Com o quê essa proteção chega lá?', 'Para quê: o que muda para a comunidade?'],
    },
  },
  {
    ano: 2021,
    tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    problema: 'a invisibilidade de quem não tem registro civil',
    formaCurta: 'a falta de registro civil',
    causas: ['estado', 'estigma'],
    topico: {
      estado: 'a omissão do Estado em levar o cartório a quem mora longe',
      estigma: 'a invisibilidade social de quem vive à margem, como a população de rua',
      historia: 'a herança de exclusão que nunca contou parte da população',
      acesso: 'a distância e a burocracia que afastam os mais pobres do cartório',
      mercado: 'o desinteresse por quem não tem documento para consumir',
    },
    combinaPouco: ['mercado'],
    perguntas: {
      motivo: {
        estado: 'O cartório chega a quem mora longe da cidade?',
        estigma: 'Quem a sociedade não enxerga, como a população de rua?',
        historia: 'Que grupos o Brasil nunca contou direito?',
        acesso: 'Quanto custa, em tempo e viagem, tirar uma certidão?',
        mercado: 'Quem perde dinheiro quando alguém não tem documento?',
      },
      introducao: ['Que autor fala do "direito a ter direitos"?', 'O que uma pessoa sem certidão não consegue fazer no Brasil?'],
      conclusao: ['Quem cuida dos cartórios e do registro?', 'Com o quê o registro chega até quem não tem?', 'Para quê: que direito a pessoa ganha?'],
    },
  },
  {
    ano: 2020,
    tema: 'O estigma associado às doenças mentais na sociedade brasileira',
    formaCurta: 'o estigma',
    causas: ['estigma', 'estado'],
    topico: {
      estigma: 'o preconceito social que esconde quem tem transtorno mental',
      estado: 'a omissão do Estado no cuidado em saúde mental',
      historia: 'a herança dos manicômios, que ensinou o país a isolar o doente',
      acesso: 'a falta de atendimento psicológico para quem não pode pagar',
      mercado: 'a cobrança por produtividade, que trata o sofrimento como fraqueza',
    },
    combinaPouco: ['mercado'],
    perguntas: {
      motivo: {
        estigma: 'Por que as pessoas têm preconceito com doença mental?',
        estado: 'O governo faz a parte dele?',
        historia: 'Como o Brasil tratava quem tinha doença mental no passado?',
        acesso: 'Quem não pode pagar consegue um psicólogo?',
        mercado: 'O trabalho deixa espaço para quem está sofrendo?',
      },
      introducao: ['Que autor fala de isolar quem é diferente?', 'Que fato do passado mostra esse preconceito no Brasil?'],
      conclusao: ['Quem cuida da saúde mental no país?', 'Com o quê ele chega a quem precisa?', 'Para quê: o que muda na vida do paciente?'],
    },
  },
  {
    ano: 2019,
    tema: 'Democratização do acesso ao cinema no Brasil',
    problema: 'o acesso desigual ao cinema no Brasil',
    formaCurta: 'o acesso desigual ao cinema',
    causas: ['acesso', 'mercado'],
    topico: {
      acesso: 'a concentração das salas de cinema nos bairros ricos das grandes cidades',
      mercado: 'o preço alto do ingresso, definido pela lógica do lucro',
      estado: 'a falta de política pública que leve o cinema ao interior',
      historia: 'a herança de uma cultura vista como privilégio da elite',
      estigma: 'a ideia de que o cinema não é para o pobre',
    },
    combinaPouco: ['estigma'],
    perguntas: {
      motivo: {
        acesso: 'Tem cinema perto da sua casa?',
        mercado: 'Quanto custa ir ao cinema com a família?',
        estado: 'O governo ajuda a levar o cinema a cidades pequenas?',
        historia: 'Desde quando a cultura é coisa de quem tem dinheiro?',
        estigma: 'Quem acha que cinema não é lugar para ele?',
      },
      introducao: ['Que autor fala de cultura como direito de todos?', 'Que fato do Brasil mostra quem fica sem cinema?'],
      conclusao: ['Quem pode levar o cinema a quem não tem?', 'Com o quê: sala itinerante, ingresso barato?', 'Para quê: o que muda para quem assiste?'],
    },
  },
];

/* Perguntas para tema livre e para os passos que valem para qualquer tema. */
export const PERGUNTAS_GERAIS = {
  tema: ['Qual problema o tema aponta?', 'Quem sofre com ele no Brasil?'],
  motivos: ['Por que esse problema existe?', 'Alguém deveria resolver e não resolve?', 'Desde quando isso acontece?'],
  tese: ['Qual é o problema, em poucas palavras?', 'Seus 2 motivos estão na frase, na ordem?'],
  introducao: ['Que autor dos seus motivos abre bem o assunto?', 'Que fato do Brasil liga esse autor ao tema?'],
  desenvolvimento: ['Que fato do Brasil prova esse motivo?', 'O que o autor diria disso?'],
  conclusao: ['Quem pode resolver?', 'Com o quê?', 'Para quê?'],
};

const comparavel = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
/* Pelo texto do tema, sem diferenciar maiúsculas e espaços. */
export function conteudoDoTema(tema: string): ConteudoTema | null {
  const t = comparavel(tema);
  if (!t) return null;
  return CONTEUDO_TEMAS.find((c) => comparavel(c.tema) === t) ?? null;
}
