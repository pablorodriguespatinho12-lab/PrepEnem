// Consertos de texto em aulas que já estão no banco: aplicados aos passos antes de gerar a lousa,
// para o texto e a lousa serem gravados juntos, uma vez só.
import remendos from '../../data/revisao-final/lousa-remendos.json';

/** Troca o trecho `de` por `para` no texto dos passos da questão; já remendado, não muda nada. */
export function remendar<P extends { texto?: unknown }>(id: string, passos: P[]): P[] {
  const daQuestao = remendos.filter((r) => r.id === id);
  if (!daQuestao.length) return passos;
  return passos.map((p) => {
    if (typeof p.texto !== 'string') return p;
    const texto = daQuestao.reduce((t, r) => (t.includes(r.para) ? t : t.replace(r.de, r.para)), p.texto);
    return { ...p, texto };
  });
}
