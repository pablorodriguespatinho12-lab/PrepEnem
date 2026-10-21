/* Livros que o Pablo está lendo (21/10/2026). A página aqui é só o ponto de
   partida: o lembrete guarda no navegador a página que ele for marcando. */
export type Leitura = {
  id: string;
  titulo: string;
  pagina: number;
};

export const LEITURAS: readonly Leitura[] = [
  { id: 'cronicas-de-narnia', titulo: 'As Crônicas de Nárnia', pagina: 23 },
  { id: 'cartas-de-um-diabo', titulo: 'Cartas de um Diabo a seu Aprendiz', pagina: 21 },
];
