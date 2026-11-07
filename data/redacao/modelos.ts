// Redações-modelo do PrepEnem: textos ORIGINAIS (não são redações do INEP),
// sobre temas reais do ENEM, comentados trecho a trecho pela grade oficial
// (docs/redacao-enem-correcao.md). Servem para três coisas: estudar como uma
// parte é construída, treinar por partes (o aluno escreve a parte retirada) e
// comparar a parte dele com a do modelo depois da correção.
//
// Repertório: só fato verificável (autor, obra, lei, ano). Os textos de
// contexto são resumos escritos aqui, não os textos motivadores oficiais.

import type { AutorDosTrios } from '@/lib/redacao/cartoes-trios';
import { MODELOS_TRIOS } from './modelos-trios';

export type TipoParte = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';

export const ROTULO_PARTE: Record<TipoParte, string> = {
  introducao: 'Introdução',
  desenvolvimento1: 'Desenvolvimento 1',
  desenvolvimento2: 'Desenvolvimento 2',
  conclusao: 'Conclusão',
};

export const ORDEM_PARTES: TipoParte[] = ['introducao', 'desenvolvimento1', 'desenvolvimento2', 'conclusao'];

/* O papel de cada trecho na grade. Os cinco da proposta são os elementos da C5. */
export type Papel =
  | 'repertorio' | 'contextualizacao' | 'tese' | 'anuncio'
  | 'operador' | 'topico' | 'analise' | 'fecho' | 'retomada'
  | 'agente' | 'acao' | 'modo' | 'efeito' | 'detalhamento';

export const ROTULO_PAPEL: Record<Papel, string> = {
  repertorio: 'Repertório', contextualizacao: 'Ligação com o Brasil', tese: 'Tese', anuncio: 'Anúncio dos argumentos',
  operador: 'Operador entre parágrafos', topico: 'Tópico frasal', analise: 'Análise', fecho: 'Fecho do parágrafo',
  retomada: 'Retomada', agente: 'Agente', acao: 'Ação', modo: 'Modo/meio', efeito: 'Efeito', detalhamento: 'Detalhamento',
};

export interface Anotacao { trecho: string; papel: Papel; porque: string }
export interface ParteModelo { texto: string; anotacoes: Anotacao[] }

export interface RedacaoModelo {
  id: string;
  tema: string;
  anoEnem: number;
  contexto: string;
  /* Redação montada com um dos 2 trios de coringas (lib/redacao/cartoes-trios.ts). */
  trio?: 1 | 2;
  /* Nome curto do tema na aba ("Saúde mental"). */
  rotulo?: string;
  /* Redação de trio: como cada autor foi ligado a ESTE tema, em 1 linha
     (a tela "O mesmo autor em 3 temas" põe as 3 lado a lado). */
  usos?: Partial<Record<AutorDosTrios, string>>;
  partes: Record<TipoParte, ParteModelo>;
}

export const MODELOS: RedacaoModelo[] = [
  // As 6 dos trios (3 temas cada), só com o repertório do trio: modelos-trios.ts.
  ...MODELOS_TRIOS,
  {
    id: 'saude-mental-2020',
    tema: 'O estigma associado às doenças mentais na sociedade brasileira',
    anoEnem: 2020,
    contexto: 'Transtornos mentais, como depressão e ansiedade, são comuns e tratáveis. Ainda assim, quem sofre com eles costuma ser visto como fraco, perigoso ou incapaz, o que leva muitas pessoas a esconder os sintomas e adiar o tratamento. Desde a Lei 10.216/2001, o Brasil substituiu o modelo de internação em manicômios por uma rede de atendimento em liberdade, com os Centros de Atenção Psicossocial (CAPS).',
    partes: {
      introducao: {
        texto: 'Em "Estigma", de 1963, o sociólogo Erving Goffman descreve como a sociedade reduz uma pessoa a um único traço considerado negativo, que passa a definir toda a sua identidade. No Brasil, esse processo atinge quem convive com doenças mentais: o diagnóstico vira rótulo de fraqueza ou de perigo, e o sofrimento passa a ser escondido em vez de tratado. Esse estigma persiste, sobretudo, pela herança do modelo manicomial, que associou a doença ao isolamento, e pela desinformação que circula sobre saúde mental.',
        anotacoes: [
          { trecho: 'Em "Estigma", de 1963, o sociólogo Erving Goffman descreve como a sociedade reduz uma pessoa a um único traço considerado negativo', papel: 'repertorio', porque: 'Legitimado (obra e autor reais da sociologia), pertinente (o tema fala em estigma) e produtivo: o conceito é explicado e usado na frase seguinte, não só citado.' },
          { trecho: 'No Brasil, esse processo atinge quem convive com doenças mentais', papel: 'contextualizacao', porque: 'Liga o repertório à realidade brasileira usando os termos do tema: estigma, doenças mentais, sociedade brasileira.' },
          { trecho: 'o diagnóstico vira rótulo de fraqueza ou de perigo, e o sofrimento passa a ser escondido em vez de tratado', papel: 'tese', porque: 'É o ponto de vista que o texto vai defender: o estigma faz a pessoa esconder a doença.' },
          { trecho: 'pela herança do modelo manicomial, que associou a doença ao isolamento, e pela desinformação que circula sobre saúde mental', papel: 'anuncio', porque: 'Anuncia as duas causas que os desenvolvimentos vão explicar, uma por parágrafo. É o projeto de texto aparecendo cedo (C3).' },
        ],
      },
      desenvolvimento1: {
        texto: 'Em primeira análise, a origem do problema está na forma como o país tratou a loucura durante boa parte do século XX. Em "História da Loucura", Michel Foucault mostra que, a partir do século XVII, a sociedade passou a internar os considerados loucos para afastá-los do convívio, e não para curá-los. No Brasil, essa lógica marcou hospitais psiquiátricos superlotados, e a ideia de que o doente mental deve ficar longe dos outros ficou no imaginário coletivo mesmo depois da Lei 10.216/2001, que trocou a internação pela rede de atendimento em liberdade. Dessa forma, o medo do "louco" sobrevive à mudança da lei e alimenta o preconceito.',
        anotacoes: [
          { trecho: 'Em primeira análise', papel: 'operador', porque: 'Conecta este parágrafo à introdução e sinaliza que é o primeiro argumento (C4: operador entre parágrafos).' },
          { trecho: 'a origem do problema está na forma como o país tratou a loucura durante boa parte do século XX', papel: 'topico', porque: 'Tópico frasal: retoma a primeira causa anunciada (herança manicomial) e diz do que o parágrafo trata.' },
          { trecho: 'Em "História da Loucura", Michel Foucault mostra que, a partir do século XVII, a sociedade passou a internar os considerados loucos para afastá-los do convívio, e não para curá-los', papel: 'repertorio', porque: 'Sustenta o argumento com uma obra reconhecida; não está solto, explica de onde vem a ideia de isolar o doente.' },
          { trecho: 'a ideia de que o doente mental deve ficar longe dos outros ficou no imaginário coletivo mesmo depois da Lei 10.216/2001', papel: 'analise', porque: 'Análise: explica a ligação entre o passado e o problema de hoje, em vez de deixar o leitor fazer a conexão (C3).' },
          { trecho: 'Dessa forma, o medo do "louco" sobrevive à mudança da lei e alimenta o preconceito', papel: 'fecho', porque: 'Fecha o parágrafo com a consequência, ligando de volta à tese.' },
        ],
      },
      desenvolvimento2: {
        texto: 'Além disso, a desinformação reforça o estigma ao tratar transtornos como falha de caráter. Frases como "depressão é falta de força de vontade" circulam nas conversas e nas redes sociais, embora a medicina reconheça esses transtornos como doenças com causas biológicas, psicológicas e sociais. Como consequência, quem sente os sintomas tende a negá-los para não ser julgado e só procura ajuda quando o quadro já se agravou. Assim, a falta de informação transforma uma doença tratável em um sofrimento silencioso.',
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Operador de adição entre parágrafos: com "Em primeira análise", já são dois, o mínimo para a C4 chegar a 200.' },
          { trecho: 'a desinformação reforça o estigma ao tratar transtornos como falha de caráter', papel: 'topico', porque: 'Retoma a segunda causa anunciada na introdução, cumprindo o projeto de texto.' },
          { trecho: 'embora a medicina reconheça esses transtornos como doenças com causas biológicas, psicológicas e sociais', papel: 'repertorio', porque: 'Repertório de conhecimento científico geral; legitimado e ligado ao argumento (desmente a frase anterior).' },
          { trecho: 'quem sente os sintomas tende a negá-los para não ser julgado e só procura ajuda quando o quadro já se agravou', papel: 'analise', porque: 'Mostra a consequência concreta do preconceito: o atraso no tratamento.' },
          { trecho: 'Assim, a falta de informação transforma uma doença tratável em um sofrimento silencioso', papel: 'fecho', porque: 'Fecho que volta à tese (o sofrimento escondido).' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que o diagnóstico deixe de ser o rótulo descrito por Goffman, é preciso enfrentar as duas causas do estigma. Cabe ao Ministério da Saúde, em parceria com o Ministério da Educação, criar campanhas permanentes sobre saúde mental, por meio de rodas de conversa nas escolas conduzidas por profissionais dos CAPS e de conteúdos nas redes sociais com relatos de pessoas em tratamento, a fim de mostrar que esses transtornos são doenças tratáveis. Com isso, a busca por ajuda deixará de ser motivo de vergonha.',
        anotacoes: [
          { trecho: 'Portanto', papel: 'operador', porque: 'Operador conclusivo: anuncia o fechamento.' },
          { trecho: 'para que o diagnóstico deixe de ser o rótulo descrito por Goffman, é preciso enfrentar as duas causas do estigma', papel: 'retomada', porque: 'Retoma a tese e o repertório da introdução, fechando o texto em círculo.' },
          { trecho: 'o Ministério da Saúde, em parceria com o Ministério da Educação', papel: 'agente', porque: 'Agente específico, quem vai agir. "O governo" também valeria, mas nomear o órgão deixa a proposta mais concreta.' },
          { trecho: 'criar campanhas permanentes sobre saúde mental', papel: 'acao', porque: 'Ação interventiva, que é o elemento essencial da proposta: diz o que fazer, não só constata o problema.' },
          { trecho: 'por meio de rodas de conversa nas escolas conduzidas por profissionais dos CAPS e de conteúdos nas redes sociais', papel: 'modo', porque: 'Modo/meio: como a ação será feita.' },
          { trecho: 'a fim de mostrar que esses transtornos são doenças tratáveis', papel: 'efeito', porque: 'Finalidade: o resultado esperado, ligado à causa da desinformação.' },
          { trecho: 'com relatos de pessoas em tratamento', papel: 'detalhamento', porque: 'Detalhamento do modo: especifica que conteúdo é esse. Com ele, os 5 elementos estão presentes: C5 em 200.' },
        ],
      },
    },
  },
  {
    id: 'cinema-2019',
    tema: 'Democratização do acesso ao cinema no Brasil',
    anoEnem: 2019,
    contexto: 'O cinema é uma forma de cultura e de lazer, mas as salas se concentram nas capitais e em shoppings de bairros mais ricos, e o ingresso pesa no orçamento de muitas famílias. A Constituição de 1988 garante a todos o exercício dos direitos culturais. Ao mesmo tempo, o streaming ampliou o acesso a filmes em casa, mas depende de internet e de assinatura.',
    partes: {
      introducao: {
        texto: 'No filme "Cinema Paradiso", de 1988, a sala de projeção é o lugar onde uma pequena cidade italiana inteira se encontra, ri e se emociona junta. No Brasil, porém, essa experiência coletiva ainda é privilégio de poucos, já que o acesso ao cinema depende de onde se mora e de quanto se ganha. Essa exclusão se mantém pela concentração das salas nos grandes centros e pela barreira econômica, que afasta as camadas mais pobres mesmo quando há uma sala por perto.',
        anotacoes: [
          { trecho: 'No filme "Cinema Paradiso", de 1988, a sala de projeção é o lugar onde uma pequena cidade italiana inteira se encontra', papel: 'repertorio', porque: 'Repertório de obra cultural, pertinente ao tema (cinema) e usado como contraste com a realidade brasileira: produtivo.' },
          { trecho: 'No Brasil, porém, essa experiência coletiva ainda é privilégio de poucos', papel: 'contextualizacao', porque: 'O "porém" faz a virada do repertório para o problema brasileiro.' },
          { trecho: 'o acesso ao cinema depende de onde se mora e de quanto se ganha', papel: 'tese', porque: 'Tese: o acesso não é democrático porque depende de lugar e renda.' },
          { trecho: 'pela concentração das salas nos grandes centros e pela barreira econômica', papel: 'anuncio', porque: 'As duas causas que serão desenvolvidas, na mesma ordem dos parágrafos.' },
        ],
      },
      desenvolvimento1: {
        texto: 'Em primeiro lugar, a distribuição das salas exclui boa parte da população. Os cinemas se instalaram, sobretudo, em shoppings de capitais e de cidades grandes, onde o público pagante é maior, enquanto muitos municípios do interior e as periferias ficaram sem nenhuma sala. Isso contraria o artigo 215 da Constituição Federal, segundo o qual o Estado deve garantir a todos o pleno exercício dos direitos culturais. Desse modo, para milhões de brasileiros, ir ao cinema exige uma viagem que poucos podem fazer.',
        anotacoes: [
          { trecho: 'Em primeiro lugar', papel: 'operador', porque: 'Operador de ordenação entre parágrafos.' },
          { trecho: 'a distribuição das salas exclui boa parte da população', papel: 'topico', porque: 'Tópico frasal que retoma a primeira causa (concentração geográfica).' },
          { trecho: 'enquanto muitos municípios do interior e as periferias ficaram sem nenhuma sala', papel: 'analise', porque: 'Explica a causa: as salas seguem o lucro, e quem mora longe fica de fora.' },
          { trecho: 'o artigo 215 da Constituição Federal, segundo o qual o Estado deve garantir a todos o pleno exercício dos direitos culturais', papel: 'repertorio', porque: 'Lei como repertório legitimado; mostra que a exclusão contraria um direito, dando peso ao argumento.' },
          { trecho: 'Desse modo, para milhões de brasileiros, ir ao cinema exige uma viagem que poucos podem fazer', papel: 'fecho', porque: 'Consequência concreta, fechando o raciocínio do parágrafo.' },
        ],
      },
      desenvolvimento2: {
        texto: 'Ademais, o preço afasta os mais pobres até das salas próximas. Para o sociólogo Pierre Bourdieu, o acesso à cultura depende de um "capital cultural" que se transmite pela família e pela escola, e quem não teve esse contato tende a sentir que certos espaços não são para si. Somado ao custo do ingresso e do transporte, esse sentimento faz com que o cinema pareça um lazer de outra classe social. Por conseguinte, a desigualdade de renda se converte em desigualdade cultural.',
        anotacoes: [
          { trecho: 'Ademais', papel: 'operador', porque: 'Segundo operador entre parágrafos.' },
          { trecho: 'o preço afasta os mais pobres até das salas próximas', papel: 'topico', porque: 'Retoma a segunda causa anunciada: a barreira econômica.' },
          { trecho: 'Para o sociólogo Pierre Bourdieu, o acesso à cultura depende de um "capital cultural" que se transmite pela família e pela escola', papel: 'repertorio', porque: 'Conceito com autor e definição; está articulado: explica por que o preço não é a única barreira.' },
          { trecho: 'Somado ao custo do ingresso e do transporte, esse sentimento faz com que o cinema pareça um lazer de outra classe social', papel: 'analise', porque: 'Junta o repertório ao fato brasileiro, sem deixar a citação solta.' },
          { trecho: 'Por conseguinte, a desigualdade de renda se converte em desigualdade cultural', papel: 'fecho', porque: 'Fecho com a consequência mais ampla.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que a experiência de "Cinema Paradiso" seja de todos, é preciso levar o cinema até quem está longe dele. O Ministério da Cultura deve criar um programa de salas públicas em escolas e centros comunitários de periferias e cidades do interior, por meio de editais que financiem equipamentos de projeção e sessões gratuitas semanais com filmes nacionais, a fim de aproximar essas comunidades da produção audiovisual. Dessa maneira, o acesso ao cinema deixará de depender do endereço e da renda.',
        anotacoes: [
          { trecho: 'para que a experiência de "Cinema Paradiso" seja de todos', papel: 'retomada', porque: 'Volta ao repertório da introdução.' },
          { trecho: 'O Ministério da Cultura', papel: 'agente', porque: 'Agente específico.' },
          { trecho: 'criar um programa de salas públicas em escolas e centros comunitários de periferias e cidades do interior', papel: 'acao', porque: 'Ação que responde à primeira causa (falta de salas onde as pessoas moram).' },
          { trecho: 'por meio de editais que financiem equipamentos de projeção', papel: 'modo', porque: 'Modo: como o programa sai do papel.' },
          { trecho: 'sessões gratuitas semanais com filmes nacionais', papel: 'detalhamento', porque: 'Detalha a ação e responde à segunda causa (preço).' },
          { trecho: 'a fim de aproximar essas comunidades da produção audiovisual', papel: 'efeito', porque: 'Finalidade da proposta.' },
        ],
      },
    },
  },
  {
    id: 'registro-civil-2021',
    tema: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
    anoEnem: 2021,
    contexto: 'A certidão de nascimento é o primeiro documento de uma pessoa e é exigida para tirar os demais, matricular-se na escola, ser atendido em programas sociais e votar. Desde a Lei 9.534/1997, o registro de nascimento e a primeira certidão são gratuitos. Mesmo assim, há brasileiros sem registro, sobretudo em regiões afastadas, comunidades rurais e populações em situação de rua.',
    partes: {
      introducao: {
        texto: 'A filósofa Hannah Arendt, em "Origens do Totalitarismo", afirma que o primeiro direito de uma pessoa é o "direito a ter direitos", isto é, ser reconhecida como membro de uma comunidade política. No Brasil, quem não tem registro civil vive sem esse reconhecimento: para o Estado, essa pessoa simplesmente não existe e, por isso, não alcança a cidadania. Tal invisibilidade decorre da distância entre os cartórios e as populações mais vulneráveis e da desinformação sobre a importância e a gratuidade do registro.',
        anotacoes: [
          { trecho: 'A filósofa Hannah Arendt, em "Origens do Totalitarismo", afirma que o primeiro direito de uma pessoa é o "direito a ter direitos"', papel: 'repertorio', porque: 'Repertório legitimado e explicado logo depois ("isto é..."), o que o torna produtivo.' },
          { trecho: 'No Brasil, quem não tem registro civil vive sem esse reconhecimento', papel: 'contextualizacao', porque: 'Liga o conceito ao tema com os termos "registro civil" e "cidadania".' },
          { trecho: 'para o Estado, essa pessoa simplesmente não existe e, por isso, não alcança a cidadania', papel: 'tese', porque: 'Tese: sem registro não há cidadania. Responde à palavra "invisibilidade" do tema.' },
          { trecho: 'da distância entre os cartórios e as populações mais vulneráveis e da desinformação sobre a importância e a gratuidade do registro', papel: 'anuncio', porque: 'Duas causas anunciadas para os desenvolvimentos.' },
        ],
      },
      desenvolvimento1: {
        texto: 'Inicialmente, a geografia do país afasta os cartórios de quem mais precisa deles. Em comunidades ribeirinhas, aldeias e zonas rurais isoladas, chegar a um cartório pode exigir dias de viagem e um gasto que a família não tem, de modo que o registro do recém-nascido é adiado indefinidamente. Sem a certidão, essa criança não consegue tirar outros documentos nem acessar programas sociais e fica à margem dos direitos que o artigo 6º da Constituição garante a todos, como a educação e a saúde. Logo, a ausência do Estado em certos territórios produz cidadãos que existem apenas para a própria comunidade.',
        anotacoes: [
          { trecho: 'Inicialmente', papel: 'operador', porque: 'Operador entre parágrafos.' },
          { trecho: 'a geografia do país afasta os cartórios de quem mais precisa deles', papel: 'topico', porque: 'Retoma a primeira causa anunciada.' },
          { trecho: 'chegar a um cartório pode exigir dias de viagem e um gasto que a família não tem', papel: 'analise', porque: 'Mostra o mecanismo da causa com um exemplo concreto.' },
          { trecho: 'Sem a certidão, essa criança não consegue tirar outros documentos nem acessar programas sociais', papel: 'analise', porque: 'Encadeia as consequências: liga o problema à cidadania pedida no tema.' },
          { trecho: 'os direitos que o artigo 6º da Constituição garante a todos, como a educação e a saúde', papel: 'repertorio', porque: 'A Constituição como repertório legitimado: mostra que a falta do registro bloqueia direitos sociais, não só um papel.' },
          { trecho: 'Logo, a ausência do Estado em certos territórios produz cidadãos que existem apenas para a própria comunidade', papel: 'fecho', porque: 'Fecho que conversa com a ideia de invisibilidade da tese.' },
        ],
      },
      desenvolvimento2: {
        texto: 'Outrossim, a falta de informação mantém pessoas sem registro mesmo onde o cartório é acessível. Embora a Lei 9.534/1997 tenha tornado gratuitos o registro de nascimento e a primeira certidão, muitas famílias ainda acreditam que precisam pagar ou não sabem que o documento pode ser feito mais tarde, ainda na vida adulta. Essa desinformação atinge principalmente pessoas com pouca escolaridade e em situação de rua, justamente as que mais dependem de políticas públicas. Dessa forma, um direito já garantido em lei não chega a quem deveria protegê-lo.',
        anotacoes: [
          { trecho: 'Outrossim', papel: 'operador', porque: 'Segundo operador entre parágrafos.' },
          { trecho: 'a falta de informação mantém pessoas sem registro mesmo onde o cartório é acessível', papel: 'topico', porque: 'Retoma a segunda causa e já a diferencia da primeira.' },
          { trecho: 'Embora a Lei 9.534/1997 tenha tornado gratuitos o registro de nascimento e a primeira certidão', papel: 'repertorio', porque: 'Lei como repertório legitimado, usada para mostrar que o problema não é a falta de direito, mas a falta de informação.' },
          { trecho: 'atinge principalmente pessoas com pouca escolaridade e em situação de rua, justamente as que mais dependem de políticas públicas', papel: 'analise', porque: 'Explica quem é afetado e por que isso agrava a exclusão.' },
          { trecho: 'Dessa forma, um direito já garantido em lei não chega a quem deveria protegê-lo', papel: 'fecho', porque: 'Fecho com a consequência.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, garantir o "direito a ter direitos" de Arendt exige levar o registro civil até os invisíveis. O Conselho Nacional de Justiça, junto às secretarias estaduais de assistência social, deve organizar mutirões itinerantes de registro civil, por meio de unidades móveis com cartorários que visitem comunidades isoladas e abrigos e que expliquem às famílias que o documento é gratuito, a fim de incluir essas pessoas nos serviços públicos. Assim, ninguém mais precisará provar que existe para ser cidadão.',
        anotacoes: [
          { trecho: 'garantir o "direito a ter direitos" de Arendt exige levar o registro civil até os invisíveis', papel: 'retomada', porque: 'Retoma o repertório e a tese.' },
          { trecho: 'O Conselho Nacional de Justiça, junto às secretarias estaduais de assistência social', papel: 'agente', porque: 'Agentes específicos e ligados ao tema (o CNJ regula os cartórios).' },
          { trecho: 'organizar mutirões itinerantes de registro civil', papel: 'acao', porque: 'Ação que ataca a primeira causa (distância).' },
          { trecho: 'por meio de unidades móveis com cartorários que visitem comunidades isoladas e abrigos', papel: 'modo', porque: 'Modo/meio.' },
          { trecho: 'que expliquem às famílias que o documento é gratuito', papel: 'detalhamento', porque: 'Detalha o modo e responde à segunda causa (desinformação).' },
          { trecho: 'a fim de incluir essas pessoas nos serviços públicos', papel: 'efeito', porque: 'Finalidade.' },
        ],
      },
    },
  },
  {
    id: 'trabalho-cuidado-2023',
    tema: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
    anoEnem: 2023,
    contexto: 'Cuidar da casa, dos filhos, de idosos e de doentes é um trabalho que sustenta a vida em sociedade, mas, quando feito dentro da família, não é pago nem contado como trabalho. No Brasil, pesquisas do IBGE mostram que as mulheres dedicam a essas tarefas quase o dobro de horas semanais que os homens, muitas vezes somadas a um emprego remunerado.',
    partes: {
      introducao: {
        texto: 'Em "O Segundo Sexo", de 1949, Simone de Beauvoir afirma que "ninguém nasce mulher: torna-se mulher", indicando que os papéis femininos são construídos pela sociedade, e não pela natureza. No Brasil, uma dessas construções é a ideia de que cuidar da casa e da família é obrigação natural da mulher, o que torna esse trabalho invisível: ele consome horas, mas não é reconhecido nem dividido. Enfrentar essa invisibilidade é difícil, sobretudo, pela naturalização do cuidado como tarefa feminina e pela ausência de políticas públicas que dividam esse peso.',
        anotacoes: [
          { trecho: 'Em "O Segundo Sexo", de 1949, Simone de Beauvoir afirma que "ninguém nasce mulher: torna-se mulher"', papel: 'repertorio', porque: 'Citação famosa, mas produtiva: é explicada e aplicada ao tema na frase seguinte. Sem essa ligação, viraria "repertório de bolso".' },
          { trecho: 'No Brasil, uma dessas construções é a ideia de que cuidar da casa e da família é obrigação natural da mulher', papel: 'contextualizacao', porque: 'Liga o conceito ao trabalho de cuidado no Brasil.' },
          { trecho: 'o que torna esse trabalho invisível: ele consome horas, mas não é reconhecido nem dividido', papel: 'tese', porque: 'Tese que usa a palavra-chave do tema: invisibilidade.' },
          { trecho: 'pela naturalização do cuidado como tarefa feminina e pela ausência de políticas públicas que dividam esse peso', papel: 'anuncio', porque: 'Responde à palavra "desafios" do tema com dois desafios, um por desenvolvimento.' },
        ],
      },
      desenvolvimento1: {
        texto: 'Em primeira análise, a naturalização do cuidado impede que ele seja visto como trabalho. Desde a infância, meninas ganham bonecas e panelinhas e são chamadas a ajudar em casa, enquanto aos meninos esse papel raramente é cobrado. A filósofa Silvia Federici resume o efeito disso ao dizer que "o que eles chamam de amor, nós chamamos de trabalho não pago": por ser apresentado como afeto, o cuidado deixa de ser percebido como esforço. Desse modo, a mulher acumula a dupla jornada sem que a família ou a sociedade reconheçam o tempo que ela gasta.',
        anotacoes: [
          { trecho: 'Em primeira análise', papel: 'operador', porque: 'Operador entre parágrafos.' },
          { trecho: 'a naturalização do cuidado impede que ele seja visto como trabalho', papel: 'topico', porque: 'Retoma o primeiro desafio.' },
          { trecho: 'Desde a infância, meninas ganham bonecas e panelinhas e são chamadas a ajudar em casa', papel: 'analise', porque: 'Mostra como a naturalização acontece na prática, concretizando o argumento.' },
          { trecho: 'A filósofa Silvia Federici resume o efeito disso ao dizer que "o que eles chamam de amor, nós chamamos de trabalho não pago"', papel: 'repertorio', porque: 'Repertório pertinente e explicado logo após os dois-pontos.' },
          { trecho: 'Desse modo, a mulher acumula a dupla jornada sem que a família ou a sociedade reconheçam o tempo que ela gasta', papel: 'fecho', porque: 'Fecho que volta à invisibilidade.' },
        ],
      },
      desenvolvimento2: {
        texto: 'Além disso, a falta de políticas públicas deixa o cuidado inteiramente nas mãos das famílias, ou seja, das mulheres. Quando faltam vagas em creches e serviços de apoio a idosos, alguém precisa ficar em casa, e os dados do IBGE mostram que é quase sempre a mulher, que dedica a essas tarefas quase o dobro de horas semanais que o homem. Isso limita sua escolaridade, sua carreira e sua renda, criando um ciclo de dependência. Por isso, a omissão do Estado transforma a desigualdade dentro de casa em desigualdade no mercado de trabalho.',
        anotacoes: [
          { trecho: 'Além disso', papel: 'operador', porque: 'Segundo operador entre parágrafos.' },
          { trecho: 'a falta de políticas públicas deixa o cuidado inteiramente nas mãos das famílias, ou seja, das mulheres', papel: 'topico', porque: 'Retoma o segundo desafio.' },
          { trecho: 'os dados do IBGE mostram que é quase sempre a mulher, que dedica a essas tarefas quase o dobro de horas semanais que o homem', papel: 'repertorio', porque: 'Dado de pesquisa como repertório. Cuidado: se o dado vier só do texto motivador, não conta como repertório legitimado.' },
          { trecho: 'Isso limita sua escolaridade, sua carreira e sua renda, criando um ciclo de dependência', papel: 'analise', porque: 'Consequências encadeadas.' },
          { trecho: 'Por isso, a omissão do Estado transforma a desigualdade dentro de casa em desigualdade no mercado de trabalho', papel: 'fecho', porque: 'Fecho do parágrafo.' },
        ],
      },
      conclusao: {
        texto: 'Portanto, para que o cuidado deixe de ser o destino "construído" de que falava Beauvoir, é necessário dividi-lo e torná-lo visível. O Governo Federal, por meio do Ministério das Mulheres, deve criar uma Política Nacional de Cuidados que amplie as vagas em creches e centros-dia para idosos, financiada em parceria com os municípios e acompanhada de campanhas escolares sobre a divisão das tarefas domésticas entre meninos e meninas, a fim de reduzir a sobrecarga feminina. Assim, o trabalho de cuidado passará a ser reconhecido como responsabilidade de todos.',
        anotacoes: [
          { trecho: 'para que o cuidado deixe de ser o destino "construído" de que falava Beauvoir', papel: 'retomada', porque: 'Retoma o repertório da introdução.' },
          { trecho: 'O Governo Federal', papel: 'agente', porque: 'Agente.' },
          { trecho: 'criar uma Política Nacional de Cuidados que amplie as vagas em creches e centros-dia para idosos', papel: 'acao', porque: 'Ação que responde ao segundo desafio (falta de políticas).' },
          { trecho: 'financiada em parceria com os municípios', papel: 'modo', porque: 'Modo/meio: como a política se sustenta.' },
          { trecho: 'acompanhada de campanhas escolares sobre a divisão das tarefas domésticas entre meninos e meninas', papel: 'detalhamento', porque: 'Detalhamento que responde ao primeiro desafio (naturalização desde a infância).' },
          { trecho: 'a fim de reduzir a sobrecarga feminina', papel: 'efeito', porque: 'Finalidade.' },
        ],
      },
    },
  },
];

export function buscarModelo(id: string): RedacaoModelo | undefined {
  return MODELOS.find((m) => m.id === id);
}

/* Texto da redação com a parte retirada marcada, para o treino por partes. */
export function textoBaseSemParte(modelo: RedacaoModelo, parte: TipoParte): string {
  return ORDEM_PARTES.map((p) =>
    p === parte ? `[${ROTULO_PARTE[p].toUpperCase()}: escreva esta parte]` : modelo.partes[p].texto,
  ).join('\n\n');
}
