/* Pablo, 14/11/2026: entrou na "Dia 2 · 1 Fácil" (só fáceis, todos os conteúdos)
   achando que era a escada por conteúdo. As provas "Do fácil ao ENEM" (nivel
   'escada') vêm primeiro, num grupo próprio; as por nível (mesmas questões) depois. */
export const TITULO_POR_CONTEUDO = 'Por conteúdo: fácil, médio, difícil e ENEM';
export const TITULO_OUTRAS = 'Outras provas';

export function agruparProvas<T extends { nivel: string }>(exams: T[]) {
  const grupos = [
    { titulo: TITULO_POR_CONTEUDO, lista: exams.filter((e) => e.nivel === 'escada') },
    { titulo: TITULO_OUTRAS, lista: exams.filter((e) => e.nivel !== 'escada') },
  ];
  return grupos.filter((g) => g.lista.length > 0);
}
