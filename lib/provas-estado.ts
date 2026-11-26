/* O que cada cartão da página Estudar diz sobre a prova, e qual vai no botão
   Continuar (opção B, 26/11/2026). */

/* < 5 questões: sem %. Mesma regra do dashboard e da tela de resultado. */
const MIN_QUESTOES_PARA_TAXA = 5;

export type ProvaDoQuadro = {
  id: string;
  nome: string;
  nivel: string;
  status: string;
  totalQuestoes: number;
  currentIdx: number;
  acertos: number;
  updatedAt: string;
};

export function estadoDaProva(p: ProvaDoQuadro): { texto: string; progresso: number | null } {
  const total = p.totalQuestoes || 0;
  if (p.status === 'finalizada') {
    const taxa = total >= MIN_QUESTOES_PARA_TAXA ? ` · ${Math.round(((p.acertos || 0) / total) * 100)}% acertos` : '';
    return { texto: `Feita${taxa}`, progresso: null };
  }
  if (p.status === 'em_andamento' && total > 0) {
    return { texto: `${p.currentIdx} de ${total}`, progresso: p.currentIdx / total };
  }
  return { texto: `${total} questões`, progresso: null };
}

/** A prova começada em que ele mexeu por último. */
export function provaParaContinuar(provas: ProvaDoQuadro[]): ProvaDoQuadro | null {
  const abertas = provas.filter((p) => p.status === 'em_andamento');
  return [...abertas].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;
}
