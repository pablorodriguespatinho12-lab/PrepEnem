/* Desenhos do modo Jardim (prévia "Jardim vivo", 26/11/2026): capa por matéria,
   ícone redondo por matéria e a planta que mostra quanto já foi estudado. */

const sol = (x: number, y: number, cor = '#fff3bd') =>
  `<circle cx="${x}" cy="${y}" r="58" fill="none" stroke="${cor}" opacity=".35" stroke-width="2"/><circle cx="${x}" cy="${y}" r="40" fill="none" stroke="${cor}" opacity=".6" stroke-width="2"/><circle cx="${x}" cy="${y}" r="24" fill="${cor}"/>`;

const monte = (y: number, cor: string, k = 0) =>
  `<path d="M0 ${y}C60 ${y - 34 - k} 110 ${y + 10} 180 ${y - 12}S320 ${y - 40 + k} 400 ${y - 6}V200H0Z" fill="${cor}"/>`;

export type NomeDaArte = 'matematica' | 'fisica' | 'quimica' | 'biologia' | 'portugues' | 'historia' | 'redacao';

/* [cor do alto do céu, cor de baixo, desenho] em viewBox 400×200 */
export const ARTES: Record<NomeDaArte, readonly [string, string, string]> = {
  matematica: ['#8ec3c9', '#f6ecc4', sol(310, 52) + '<path d="M30 170L110 62L190 170Z" fill="#4f8f74"/><path d="M110 62L190 170H110Z" fill="#3d775f"/><path d="M130 175L230 90L330 175Z" fill="#76ad78"/><path d="M230 90L330 175H230Z" fill="#5f9763"/>' + monte(170, '#3f7a42')],
  fisica: ['#14213f', '#3d5a80', sol(300, 60, '#f3f1de') + '<g fill="none" stroke="#f2c94c" stroke-width="2.5"><ellipse cx="130" cy="86" rx="92" ry="30" transform="rotate(-16 130 86)"/></g><circle cx="130" cy="86" r="34" fill="#e07a5f"/><circle cx="216" cy="62" r="9" fill="#f6ecc4"/>' + monte(160, '#24405a', 14)],
  quimica: ['#b7a8e8', '#f6e3d4', '<path d="M175 30h50M185 30v45l-48 78q-8 18 14 18h98q22 0 14-18l-48-78V30" fill="#ffffffaa" stroke="#4a3f80" stroke-width="5" stroke-linejoin="round"/><path d="M156 122h88l20 33q6 12-10 12h-108q-16 0-10-12Z" fill="#5fb89a"/><circle cx="185" cy="105" r="6" fill="#5fb89a"/><circle cx="212" cy="82" r="4" fill="#5fb89a"/>' + monte(176, '#6b5f9e')],
  biologia: ['#a7d8c4', '#f9efc9', sol(70, 50) + monte(135, '#79b87a', 10) + monte(165, '#4d8c46') + '<path d="M290 175V90" stroke="#6b4a32" stroke-width="10"/><circle cx="290" cy="76" r="40" fill="#2f7a45"/><circle cx="262" cy="96" r="26" fill="#3f8f4f"/><circle cx="318" cy="96" r="28" fill="#68ad5c"/>'],
  portugues: ['#f4b183', '#fbe9c6', sol(200, 92, '#fff1b8') + monte(130, '#b9714f', 8) + '<path d="M80 168Q140 132 200 165Q260 132 320 168V190Q260 162 200 192Q140 162 80 190Z" fill="#fcf7ea" stroke="#7a4630" stroke-width="3"/><path d="M200 165v27M110 168q30-12 62 0M228 168q30-12 62 0" stroke="#7a4630" stroke-width="2" fill="none"/>'],
  historia: ['#e7c59a', '#fbefd6', sol(320, 56) + monte(150, '#c4975f') + '<path d="M90 70L190 30L290 70Z" fill="#fcf7ea"/><g fill="#fcf7ea"><rect x="104" y="76" width="20" height="80"/><rect x="148" y="76" width="20" height="80"/><rect x="212" y="76" width="20" height="80"/><rect x="256" y="76" width="20" height="80"/><rect x="88" y="156" width="204" height="12"/></g>' + monte(180, '#8c6a42')],
  redacao: ['#9cc9d6', '#fdeec2', sol(90, 56) + monte(135, '#8dbb8f', 12) + monte(165, '#4f8f58') + '<g transform="rotate(38 260 100)"><rect x="248" y="30" width="24" height="110" rx="5" fill="#f2c94c"/><path d="M248 140L260 168L272 140Z" fill="#f6dcc0"/><path d="M256 159L260 168L264 159Z" fill="#33291f"/><rect x="248" y="30" width="24" height="18" fill="#e07a5f"/></g>'],
};

const ARTE_DA_MATERIA: Record<string, NomeDaArte> = {
  'Matemática': 'matematica',
  'Física': 'fisica',
  'Química': 'quimica',
  'Biologia': 'biologia',
  'Português': 'portugues',
  'Literatura': 'portugues',
  'Livros': 'portugues',
  'História': 'historia',
  'Filosofia': 'historia',
  'Sociologia': 'historia',
  'Geografia': 'biologia',
  'Redação': 'redacao',
};

export function arteDaMateria(materia: string): NomeDaArte {
  return ARTE_DA_MATERIA[materia] ?? 'matematica';
}

export type EstagioDaPlanta = 0 | 1 | 2 | 3;

export const NOME_DO_ESTAGIO = ['ainda semente', 'brotando', 'crescendo', 'floriu'] as const;

/* 0 sem nada feito; 3 só com tudo feito. */
export function estagioDaPlanta(progresso: number): EstagioDaPlanta {
  if (progresso <= 0) return 0;
  if (progresso >= 1) return 3;
  return progresso < 0.5 ? 1 : 2;
}

/* Miolo do SVG 60×60 (o fundo redondo usa a cor do cartão do tema). */
export function desenhoDaPlanta(estagio: EstagioDaPlanta): string {
  const terra = '<circle cx="30" cy="30" r="29" fill="var(--m-card2)"/><path d="M12 47Q30 40 48 47" fill="#8a6444"/>';
  if (estagio === 0) return `${terra}<circle cx="30" cy="42" r="3" fill="#6b4a32"/>`;
  const caule = `<path d="M30 45V${estagio > 2 ? 20 : 30}" stroke="#2f7a45" stroke-width="3" stroke-linecap="round"/><path d="M30 36C20 36 17 29 18 26C26 26 30 30 30 36ZM30 32C40 32 43 25 42 22C34 22 30 26 30 32Z" fill="#4f9e55"/>`;
  const folha = estagio > 1 ? '<path d="M30 26C23 24 22 17 24 14C29 16 31 20 30 26Z" fill="#68ad5c"/>' : '';
  const flor = estagio > 2
    ? [0, 72, 144, 216, 288].map((a) => `<ellipse cx="30" cy="12" rx="4" ry="6" fill="#f2c94c" transform="rotate(${a} 30 18)"/>`).join('') + '<circle cx="30" cy="18" r="4" fill="#c96a3a"/>'
    : '';
  return terra + caule + folha + flor;
}

/* Ícone de linha por matéria, viewBox 64×64. */
const ICONES: Record<string, string> = {
  'Matemática': '<path d="M12 48L32 14L52 48Z"/><path d="M32 14V48"/>',
  'Física': '<circle cx="32" cy="32" r="5"/><ellipse cx="32" cy="32" rx="22" ry="9"/><ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(120 32 32)"/>',
  'Química': '<path d="M26 12H38M28 12V26L16 48Q14 53 20 53H44Q50 53 48 48L36 26V12"/><path d="M22 40H42"/>',
  'Biologia': '<path d="M14 50C14 24 32 12 52 12C52 40 36 52 14 50ZM14 50L40 24"/>',
  'Português': '<path d="M12 16Q22 12 32 18Q42 12 52 16V48Q42 44 32 50Q22 44 12 48ZM32 18V50"/>',
  'Redação': '<path d="M16 48l3-11 24-24 8 8-24 24zM37 19l8 8"/>',
};

export function iconeDaMateria(materia: string): string {
  const desenho = ICONES[materia] ?? ICONES['Português'];
  return `<circle cx="32" cy="32" r="31" fill="var(--m-card2)" stroke="none"/>${desenho}`;
}
