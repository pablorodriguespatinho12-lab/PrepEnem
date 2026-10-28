// Glossário do Treino por partes, para quem sabe zero (Pablo, 28/10/2026).
// Na 1ª vez que um termo aparece numa tela, ele ganha sublinhado pontilhado;
// tocar mostra 1 frase simples. Sem IA: as frases são fixas.

export interface Termo {
  chave: string;
  /* Formas que contam como o termo, em minúsculas (singular e plural). */
  formas: string[];
  frase: string;
}

export const GLOSSARIO: Termo[] = [
  /* "Proposta de intervenção" antes de qualquer termo mais curto que ela contenha. */
  { chave: 'proposta', formas: ['proposta de intervenção', 'propostas de intervenção'], frase: 'Proposta de intervenção: a solução que você sugere no fim, dizendo quem faz, o quê, como e para quê.' },
  { chave: 'repertorio', formas: ['repertório', 'repertórios'], frase: 'Repertório: algo que você sabe de fora (livro, lei, fato) e usa para provar sua ideia.' },
  { chave: 'topico', formas: ['tópico frasal', 'tópicos frasais'], frase: 'Tópico frasal: a 1ª frase do parágrafo, que diz o que ele vai provar.' },
  { chave: 'tese', formas: ['tese', 'teses'], frase: 'Tese: a sua opinião sobre o tema, numa frase só, com os 2 motivos.' },
  { chave: 'ponte', formas: ['ponte', 'pontes'], frase: 'Ponte: a frase que liga o autor que você citou ao Brasil de hoje.' },
  { chave: 'molde', formas: ['molde', 'moldes'], frase: 'Molde: uma frase pronta com lacunas; você troca o que está entre colchetes.' },
  { chave: 'agente', formas: ['agente', 'agentes'], frase: 'Agente: quem vai fazer a ação da proposta (um ministério, a escola, o governo).' },
];

export type Pedaco = { texto: string; termo?: Termo };

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* Letra antes ou depois = está dentro de outra palavra ("hipótese" não é tese). */
const padrao = new RegExp(
  `(?<!\\p{L})(${GLOSSARIO.flatMap((t) => t.formas).sort((a, b) => b.length - a.length).map(escapar).join('|')})(?!\\p{L})`,
  'giu',
);
const termoDaForma = (forma: string) => GLOSSARIO.find((t) => t.formas.includes(forma.toLowerCase()));

/* Corta o texto em pedaços; só a 1ª vez de cada termo (contando o que já foi
   marcado na tela, em `usados`) vira pedaço com termo. Muda `usados`: quem
   chama cria um Set novo por tela e passa os textos na ordem da leitura. */
export function marcarTermos(texto: string, usados: Set<string>): Pedaco[] {
  const pedacos: Pedaco[] = [];
  let resto = 0;
  for (const m of Array.from(texto.matchAll(padrao))) {
    const termo = termoDaForma(m[0]);
    if (!termo || usados.has(termo.chave) || m.index === undefined) continue;
    usados.add(termo.chave);
    if (m.index > resto) pedacos.push({ texto: texto.slice(resto, m.index) });
    pedacos.push({ texto: m[0], termo });
    resto = m.index + m[0].length;
  }
  if (resto < texto.length) pedacos.push({ texto: texto.slice(resto) });
  return pedacos;
}
