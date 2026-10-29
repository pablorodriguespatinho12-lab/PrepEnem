// Devolutiva do Treino por partes (Pablo, 29/10/2026: "como um pai querendo
// ensinar o filho a engatinhar", "melhorar com o tempo, atingir novos
// objetivos"). Pega a correção oficial do site (correcao.ts) e diz, sem
// jargão: o que já funciona, UMA coisa para treinar agora e em qual passo,
// a próxima meta e o que mudou desde a última redação. Sem IA: tudo sai dos
// campos da correção, então o mesmo texto dá sempre a mesma devolutiva.
//
// Regra (revisores, 29/10/2026): toda frase precisa de um campo da correção
// que a sustente. Sem campo, a frase é geral e não acusa nada.

import { COMPETENCIAS, type ChaveElemento, type Competencia, type CorrecaoCompleta, type Repertorio } from './correcao';
import { notaC5, type Notas } from './grade';

export const NOME_SIMPLES: Record<Competencia, string> = {
  c1: 'Escrever certo',
  c2: 'Ficar no tema e usar um exemplo de fora',
  c3: 'Explicar as ideias',
  c4: 'Ligar frases e parágrafos',
  c5: 'Proposta de solução',
};

/* Empate na nota mais baixa: treina primeiro o que tem molde ou lista pronta.
   A proposta (5 lacunas) e o conectivo (troca da lista) sobem mais rápido que
   explicar uma ideia; gramática por último. */
const ORDEM_DE_TREINO: Competencia[] = ['c5', 'c2', 'c4', 'c3', 'c1'];
const ELEMENTOS: ChaveElemento[] = ['agente', 'acao', 'modo', 'efeito', 'detalhamento'];
/* As palavras do molde do passo 7 entre parênteses: é lá que ele vai procurar. */
const ELEMENTO_SIMPLES: Record<ChaveElemento, string> = {
  agente: 'quem faz (agente)', acao: 'o que fazer (ação)', modo: 'como fazer (meio)',
  efeito: 'para quê (finalidade)', detalhamento: 'um detalhe a mais sobre uma dessas partes (detalhamento)',
};
/* Com o artigo: "A introdução", "O 1º desenvolvimento". */
const PARAGRAFO: Record<number, string> = { 1: 'A introdução', 2: 'O 1º desenvolvimento', 3: 'O 2º desenvolvimento', 4: 'A conclusão' };
/* Parágrafo N da redação montada = passo N + 3 do treino. */
const passoDoParagrafo = (n: number) => Math.min(Math.max(n, 1), 4) + 3;
const MAX_TRECHO = 80;
export const DEGRAU = 40;
export const NOTA_MAXIMA_PARTE = 200;

export interface Treino {
  competencia: Competencia;
  /* O que falta, em palavras de quem nunca viu uma correção. */
  oQueFalta: string;
  /* Como fazer, apontando a frase do molde. */
  comoFazer: string;
  passo: number;
}

export interface Devolutiva {
  total: number;
  jaFunciona: string | null;
  treinar: Treino | null;
  /* Próximo degrau da parte a treinar, em pontos (cada parte vai até 200). */
  meta: { competencia: Competencia; de: number; para: number } | null;
}

export interface Comparacao {
  antes: number;
  agora: number;
  /* A parte que mais mudou, para cima ou para baixo; null se nenhuma mudou. */
  maisMudou: { competencia: Competencia; diferenca: number } | null;
}

const curto = (t: string) => (t.length > MAX_TRECHO ? `${t.slice(0, MAX_TRECHO).replace(/\s+\S*$/, '')}...` : t);
const aspas = (t: string) => `"${curto(t.trim())}"`;
const paragrafosDe = (redacao: string) => redacao.split(/\n\s*\n/).filter((p) => p.trim());

/* Em que parágrafo da redação está o trecho (1 a 4); 0 se não achou. */
export function paragrafoDoTrecho(redacao: string, trecho: string): number {
  const alvo = trecho.trim().toLowerCase();
  if (!alvo) return 0;
  return paragrafosDe(redacao).findIndex((p) => p.toLowerCase().includes(alvo)) + 1;
}

/* O parágrafo mais curto (1 a 4): é ele que fica "curto demais". */
function maisCurto(redacao: string): number {
  const ps = paragrafosDe(redacao);
  if (ps.length === 0) return 2;
  return ps.reduce((menor, p, i) => (p.length < ps[menor].length ? i : menor), 0) + 1;
}

/* O que derruba a redação inteira vem antes de qualquer parte. */
function travaGeral(c: CorrecaoCompleta, redacao: string): Treino | null {
  const zeroPorTamanho = c.total === 0 && c.travas.some((t) => /até \d+ linhas/.test(t));
  if (zeroPorTamanho) return { competencia: 'c2', oQueFalta: 'O texto tem menos de 8 linhas, e o ENEM dá zero assim.', comoFazer: 'Escreva as 4 frases do molde em cada parágrafo: com isso você passa das 8 linhas.', passo: passoDoParagrafo(maisCurto(redacao)) };
  if (c.c2.abordagem === 'fuga') return { competencia: 'c2', oQueFalta: 'O texto não fala do tema pedido, e o ENEM dá zero assim.', comoFazer: 'Releia a frase do tema e escreva a tese com as palavras dela.', passo: 3 };
  return null;
}

/* Repertório com problema: diz qual dos passos falta (cita, explica, amarra). */
function treinoDoRepertorio(r: Repertorio, redacao: string): Treino {
  const passo = passoDoParagrafo(paragrafoDoTrecho(redacao, r.trecho) || 2);
  if (!r.legitimado || !r.pertinente) {
    return { competencia: 'c2', oQueFalta: `O exemplo ${aspas(r.trecho)} não é conhecido ou não fala do tema.`, comoFazer: `No passo ${passo}, troque por um dos "Autores deste motivo": cada um já vem com a ideia dele.`, passo };
  }
  const falta = !r.explica ? 'dizer, com as suas palavras, o que ele pensa' : 'ligar essa ideia ao seu motivo, no Brasil de hoje';
  return { competencia: 'c2', oQueFalta: `Você citou ${aspas(r.trecho)}. Agora falta ${falta}.`, comoFazer: 'Escreva isso na frase logo depois da citação.', passo };
}

function treinoDe(c: CorrecaoCompleta, comp: Competencia, redacao: string, tema: string): Treino {
  const noTrecho = (trecho: string, padrao: number) => passoDoParagrafo(paragrafoDoTrecho(redacao, trecho) || padrao);
  switch (comp) {
    case 'c5': {
      if (c.c5.desrespeitaDH) return { competencia: comp, oQueFalta: 'A proposta prejudica um grupo de pessoas.', comoFazer: 'Troque por uma ação que ajude, sem punir nem excluir ninguém.', passo: 7 };
      if (c.c5.condicional) return { competencia: comp, oQueFalta: 'A proposta começa com "se", e isso segura essa parte em 80 pontos.', comoFazer: 'Troque o "se" por uma ação firme: "o governo deve...".', passo: 7 };
      const faltam = ELEMENTOS.filter((k) => !c.c5[k].valido).map((k) => ELEMENTO_SIMPLES[k]);
      return {
        competencia: comp,
        oQueFalta: `Sua proposta ainda não diz: ${faltam.join('; ')}.`,
        comoFazer: 'No passo 7, a frase 2 do molde tem um espaço para cada parte. Preencha um espaço por vez.',
        passo: 7,
      };
    }
    case 'c2': {
      if (c.c2.copiaMotivadores) return { competencia: comp, oQueFalta: 'Partes do texto copiam os textos de apoio da prova.', comoFazer: 'Escreva com as suas palavras: os textos de apoio só dão ideias.', passo: 4 };
      if (c.c2.abordagem === 'tangencia') return { competencia: comp, oQueFalta: 'O texto fala do assunto em geral, e não do pedaço exato do tema.', comoFazer: tema ? `Na tese, fale de "${curto(tema)}", não do assunto inteiro.` : 'Na tese, use as palavras exatas do tema, não só o assunto.', passo: 3 };
      if (c.c2.repertorios.length === 0) return { competencia: comp, oQueFalta: 'O texto ainda não usa nenhum exemplo de fora (autor, lei, dado ou fato).', comoFazer: 'No passo 5, toque em "Autores deste motivo": cada um vem com a ideia dele. Escreva: "Nesse sentido, [autor] mostra que [ideia]."', passo: 5 };
      const fraco = c.c2.repertorios.find((r) => !r.legitimado || !r.pertinente || r.bolso || !r.produtivo);
      if (fraco) return treinoDoRepertorio(fraco, redacao);
      const n = maisCurto(redacao);
      if (c.c2.partesEmbrionarias > 0) return { competencia: comp, oQueFalta: `${PARAGRAFO[n] ?? 'Um parágrafo'} ficou curto demais para provar a ideia.`, comoFazer: 'Escreva as 4 frases do molde, uma por função.', passo: passoDoParagrafo(n) };
      return { competencia: comp, oQueFalta: 'Um exemplo de fora a mais deixaria o texto mais forte.', comoFazer: 'No 2º desenvolvimento, use um autor diferente do primeiro e diga o que ele prova.', passo: 6 };
    }
    case 'c3': {
      if (c.c3.contradicaoGrave) return { competencia: comp, oQueFalta: 'Duas partes do texto dizem coisas opostas.', comoFazer: 'Releia a tese e deixe cada parágrafo defender só o que ela anunciou.', passo: 3 };
      const solto = c.c3.paragrafos.find((p) => !p.desenvolvida);
      if (solto) return { competencia: comp, oQueFalta: `${PARAGRAFO[solto.numero] ?? 'Um parágrafo'} afirma uma ideia, mas não explica por quê.`, comoFazer: 'Depois da 1ª frase, escreva por que isso acontece e dê um exemplo do Brasil.', passo: passoDoParagrafo(solto.numero) };
      return { competencia: comp, oQueFalta: 'As ideias estão no lugar certo, mas cada uma pode ser mais explicada.', comoFazer: 'Em cada desenvolvimento, depois do autor, diga por que isso acontece e dê um exemplo do Brasil.', passo: 5 };
    }
    case 'c4': {
      const errada = c.c4.inadequacoes[0];
      if (errada) {
        const passo = noTrecho(errada.trecho, 2);
        return { competencia: comp, oQueFalta: `A palavra de ligação ${aspas(errada.trecho)} não combina com o que vem depois.`, comoFazer: `No passo ${passo}, troque por outra da lista em "Mais dicas".`, passo };
      }
      const repetida = c.c4.repeticoes[0];
      if (repetida) {
        const passo = noTrecho(repetida, 2);
        return { competencia: comp, oQueFalta: `Você usou ${aspas(repetida)} muitas vezes.`, comoFazer: `No passo ${passo}, troque uma das vezes por outra palavra da lista em "Mais dicas".`, passo };
      }
      const ops = c.c4.operadoresEntreParagrafos.length;
      if (ops < 2) return { competencia: comp, oQueFalta: ops === 0 ? 'Nenhum parágrafo começa com palavra de ligação.' : 'Só 1 parágrafo começa com palavra de ligação.', comoFazer: 'Comece com "Em primeiro lugar", "Além disso" e "Portanto": o molde de cada passo já traz.', passo: 5 };
      return { competencia: comp, oQueFalta: 'A ligação entre uma frase e outra pode ficar mais clara.', comoFazer: 'Dentro dos parágrafos, ligue as frases com "porque", "por isso" ou "ou seja".', passo: 5 };
    }
    case 'c1': {
      const d = c.c1.desvios[0];
      if (d) return { competencia: comp, oQueFalta: `Em ${aspas(d.trecho)}, o certo é: ${d.correcao}.`, comoFazer: 'Corrija esse trecho e procure o mesmo erro no resto do texto.', passo: noTrecho(d.trecho, 1) };
      if (c.c1.estrutura === 'regular' || c.c1.estrutura === 'deficitaria') return { competencia: comp, oQueFalta: 'Algumas frases ficaram confusas.', comoFazer: 'Leia cada frase em voz alta; se faltar ar, corte em duas.', passo: 4 };
      return { competencia: comp, oQueFalta: 'Faltam poucos detalhes de português.', comoFazer: 'Releia em voz alta procurando acento e vírgula.', passo: 4 };
    }
  }
}

/* Um fato do texto dele, sem elogio. Null se a parte não tem o que mostrar. */
function fatoBom(c: CorrecaoCompleta, comp: Competencia): string | null {
  switch (comp) {
    case 'c5': {
      const tem = ELEMENTOS.filter((k) => c.c5[k].valido);
      if (tem.length === 0) return null;
      const quem = c.c5.agente.valido && c.c5.agente.trecho ? ` Quem faz: ${aspas(c.c5.agente.trecho)}.` : '';
      return `Sua proposta já tem ${tem.length === 5 ? 'as 5 partes' : `${tem.length} das 5 partes`}.${quem}`;
    }
    case 'c2': {
      const r = c.c2.repertorios.find((x) => x.legitimado && x.pertinente && !x.bolso);
      return r ? `Você usou um exemplo de fora que fala do tema: ${aspas(r.trecho)}.` : null;
    }
    case 'c4': {
      const ops = c.c4.operadoresEntreParagrafos.slice(0, 3);
      return ops.length > 0 ? `Você ligou os parágrafos com ${ops.map((o) => `"${o}"`).join(', ')}.` : null;
    }
    case 'c3':
      return c.c3.paragrafos.length > 0 && c.c3.paragrafos.every((p) => p.desenvolvida) ? 'Cada parágrafo explica a ideia que ele defende.' : null;
    case 'c1': {
      if (c.c1.estrutura === 'inexistente') return null;
      const n = c.c1.desvios.length;
      return n === 0 ? 'Nenhum erro de português apontado no texto.' : n <= 2 ? `Só ${n} erro${n > 1 ? 's' : ''} de português no texto todo.` : null;
    }
  }
}

const NOTA_QUE_JA_CONTA = 80;

/* O degrau seguinte. Com o "se", a proposta sobe até onde os elementos já
   valem; nas outras, +40. */
function metaDe(c: CorrecaoCompleta, alvo: Competencia): number {
  if (alvo === 'c5' && c.c5.condicional) {
    const valido = (k: ChaveElemento) => c.c5[k].valido;
    const semSe = notaC5({ agente: valido('agente'), acao: valido('acao'), modo: valido('modo'), efeito: valido('efeito'), detalhamento: valido('detalhamento') });
    if (semSe > c.notas.c5) return semSe;
  }
  return Math.min(NOTA_MAXIMA_PARTE, c.notas[alvo] + DEGRAU);
}

export function montarDevolutiva(c: CorrecaoCompleta, redacao: string, tema = ''): Devolutiva {
  const geral = travaGeral(c, redacao);
  if (geral) return { total: c.total, jaFunciona: null, treinar: geral, meta: null };
  const abaixo = COMPETENCIAS.filter((k) => c.notas[k] < NOTA_MAXIMA_PARTE);
  const menor = abaixo.length > 0 ? Math.min(...abaixo.map((k) => c.notas[k])) : NOTA_MAXIMA_PARTE;
  const alvo = ORDEM_DE_TREINO.find((k) => abaixo.includes(k) && c.notas[k] === menor) ?? null;
  const porNota = [...COMPETENCIAS].filter((k) => k !== alvo && c.notas[k] >= NOTA_QUE_JA_CONTA).sort((a, b) => c.notas[b] - c.notas[a]);
  /* No treino o texto sai sempre na ordem introdução, 2 desenvolvimentos e conclusão. */
  const jaFunciona = porNota.map((k) => fatoBom(c, k)).find(Boolean)
    ?? (paragrafosDe(redacao).length >= 4 ? 'Você escreveu os 4 parágrafos: introdução, 2 desenvolvimentos e conclusão.' : null);
  return {
    total: c.total,
    jaFunciona,
    treinar: alvo ? treinoDe(c, alvo, redacao, tema) : null,
    meta: alvo ? { competencia: alvo, de: c.notas[alvo], para: metaDe(c, alvo) } : null,
  };
}

export function comparar(antes: Notas, agora: Notas): Comparacao {
  const soma = (n: Notas) => COMPETENCIAS.reduce((s, k) => s + n[k], 0);
  const maior = COMPETENCIAS
    .map((k) => ({ competencia: k, diferenca: agora[k] - antes[k] }))
    .filter((d) => d.diferenca !== 0)
    .sort((a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca))[0] ?? null;
  return { antes: soma(antes), agora: soma(agora), maisMudou: maior };
}
