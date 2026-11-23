// Letra da equação = inicial da palavra (Pablo, 22/11/2026, caderno dele: T = terras, D = dias, C = cidades;
// "usa letras que sejam de acordo com as palavras"). As aulas do robô foram escritas com letras soltas
// ("G = chance de ficar toda dentro"). Aqui: se a letra não é inicial de nenhuma palavra do que ela quer dizer,
// troca pela inicial da 1ª palavra que importa, em TODO o texto da aula (fórmula, leitura, passos, tabelas).
// Função pura: recebe os passos, devolve passos novos e o que foi trocado.

export type PassoBruto = { titulo?: unknown; texto?: unknown; visual?: unknown };
export type Troca = { de: string; para: string; oque: string };

const PALAVRAS_VAZIAS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'e', 'ou',
  'que', 'quer', 'questao', 'por', 'para', 'com', 'sem', 'cada', 'se', 'ao', 'aos', 'ja', 'mais', 'menos', 'ate', 'entre', 'sobre',
  'como', 'qual', 'quais', 'ser', 'tem', 'tenho', 'fica', 'sai', 'pede',
]);
/** Letras clássicas de Matemática e Física (começo da palavra → letras aceitas): H = altura, Q = calor, U = tensão... */
const LETRAS_CONVENCIONAIS: [string, string][] = [
  ['veloc', 'vV'], ['temp', 'tT'], ['dist', 'dDsS'], ['deslocamento', 'sSdD'], ['posicao', 'xXsS'], ['aceler', 'aA'], ['forca', 'fF'],
  ['massa', 'mM'], ['energia', 'eEwW'], ['trabalho', 'wWtT'], ['potencia', 'pP'], ['tensao', 'uUvV'], ['corrente', 'iI'],
  ['resistencia', 'rR'], ['carga', 'qQ'], ['calor', 'qQ'], ['pressao', 'pP'], ['volume', 'vV'], ['densidade', 'dDpP'], ['altura', 'hH'],
  ['raio', 'rR'], ['comprimento', 'lLcC'], ['lado', 'lL'], ['angulo', 'aAxX'], ['frequencia', 'fF'], ['periodo', 'tT'],
  ['probabilidade', 'pP'], ['chance', 'pPcC'], ['media', 'mM'], ['desvio', 'dDsS'], ['juros', 'jJ'], ['capital', 'cC'], ['montante', 'mM'],
  ['taxa', 'iItT'], ['razao', 'rR'], ['diferenca', 'dD'], ['soma', 'sS'], ['numero', 'nN'], ['quantidade', 'nNqQ'], ['porcentagem', 'pP'],
  ['preco', 'pP'], ['custo', 'cCpP'], ['lucro', 'lL'], ['salario', 'sS'], ['area', 'aA'], ['perimetro', 'pP'], ['indice', 'iI'],
];
/** Incógnita clássica: não se troca. */
const INCOGNITAS = new Set(['x', 'y', 'n', 'k']); // incógnita e contagem clássicas
/** Letra que no texto de uma aula também é palavra (artigo, "e", "o"): só se troca ao lado de sinal de conta. */
const LETRA_AMBIGUA = new Set(['a', 'e', 'o']);

const semAcento = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Palavras que importam de "estrada (o que a questão quer)": sem o aparte, sem artigo, sem número. */
export function palavrasDoSignificado(oque: string): string[] {
  const limpo = oque.replace(/\([^)]*\)/g, ' ').replace(/[^A-Za-zÀ-ÿ\s]/g, ' ');
  return limpo
    .split(/\s+/)
    .map(semAcento)
    .filter((p) => p.length >= 2 && !PALAVRAS_VAZIAS.has(p));
}

/** A letra já é inicial de alguma palavra do significado? ("T = temperatura" sim; "G = chance de ficar" não.) */
export const letraCombina = (letra: string, oque: string): boolean => {
  const l = semAcento(letra);
  if (INCOGNITAS.has(l)) return true;
  if (/\d|[²³]/.test(oque)) return true; // significado com número ou unidade ("m³ que passaram de 10"): não adivinhar
  if (/multiplica|termo|coeficiente/i.test(oque)) return true; // a, b, c do 2º grau e afins: letras clássicas
  const palavras = palavrasDoSignificado(oque);
  return palavras.some((p) => p[0] === l || LETRAS_CONVENCIONAIS.some(([comeco, letras]) => p.startsWith(comeco) && letras.includes(letra)));
};

type Letra = { letra: string; oque: string };

function letrasDaAula(passos: PassoBruto[]): Letra[] {
  const todas: Letra[] = [];
  for (const p of passos) {
    const v = p.visual as { tipo?: unknown; letras?: unknown } | null | undefined;
    if (v?.tipo !== 'equacao' || !Array.isArray(v.letras)) continue;
    for (const l of v.letras as Record<string, unknown>[]) {
      if (typeof l.letra === 'string' && typeof l.oque === 'string') todas.push({ letra: l.letra.trim(), oque: l.oque });
    }
  }
  return todas;
}

/** Letras soltas que aparecem em algum texto (pontos A, B, D da figura; "tipo A"): trocar para uma delas confundiria. */
function letrasSoltasNosTextos(textos: string[]): Set<string> {
  const achadas = new Set<string>();
  for (const texto of textos) for (const m of texto.matchAll(/(?<![A-Za-zÀ-ÿ0-9_°$])([A-Za-z])(?![A-Za-zÀ-ÿ0-9_$])/g)) achadas.add(m[1]);
  return achadas;
}

function textosDe(v: unknown): string[] {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v.flatMap(textosDe);
  if (v && typeof v === 'object') return Object.values(v).flatMap(textosDe);
  return [];
}

/** Quais letras trocar e por quê. Só letra única; "CM", "ΔT" e as que já combinam ficam. Só vale trocar pela inicial da
 *  1ª palavra que importa, e só se a letra nova NÃO aparece em lugar nenhum do enunciado nem da aula (nem como ponto da figura). */
export function trocasDaAula(passos: PassoBruto[], enunciado = ''): Troca[] {
  const letras = letrasDaAula(passos);
  const tudo = [enunciado, ...passos.flatMap((p) => textosDe(p))];
  const soltas = letrasSoltasNosTextos(tudo);
  const emUso = new Set(letras.map((l) => l.letra));
  const trocas: Troca[] = [];
  for (const { letra, oque } of letras) {
    if (!/^[A-Za-z]$/.test(letra) || letraCombina(letra, oque)) continue;
    if (letrasSoltasNosTextos([enunciado]).has(letra) && !LETRA_AMBIGUA.has(letra.toLowerCase())) continue; // a letra velha também é ponto/nome na questão
    const primeira = palavrasDoSignificado(oque)[0];
    if (!primeira) continue;
    const nova = /[A-Z]/.test(letra) ? primeira[0].toUpperCase() : primeira[0];
    const livre = ![nova, nova.toLowerCase(), nova.toUpperCase()].some((c) => emUso.has(c) || soltas.has(c));
    if (!livre || !/^[A-Za-z]$/.test(nova) || trocas.some((x) => x.de === letra)) continue;
    emUso.add(nova);
    trocas.push({ de: letra, para: nova, oque });
  }
  return trocas;
}

const SINAL = String.raw`[=×÷+−*/()²]`;

/** Troca a letra solta `de` por `para` num texto. Nunca em palavra, "R$", unidade com grau ou frase ("A questão"). */
export function trocarLetra(texto: string, de: string, para: string): string {
  const ambigua = LETRA_AMBIGUA.has(de.toLowerCase());
  // "Letra C" e "alternativa C" são a resposta da prova, nunca a letra da equação.
  const solta = String.raw`(?<![A-Za-zÀ-ÿ0-9_°$])(?<![Ll]etra\s)(?<![Aa]lternativa\s)${de}(?![A-Za-zÀ-ÿ0-9_$])`;
  if (!ambigua) return texto.replace(new RegExp(solta, 'g'), para);
  // a/e/o: só ao lado de sinal de conta ("E = R × 1,25"), nunca no meio da frase.
  const colada = new RegExp(String.raw`(?<=${SINAL}\s?)${solta}|${solta}(?=\s?${SINAL})`, 'g');
  return texto.replace(colada, para);
}

function trocarNoValor(v: unknown, trocas: Troca[]): unknown {
  if (typeof v === 'string') return trocas.reduce((s, t) => trocarLetra(s, t.de, t.para), v);
  if (Array.isArray(v)) return v.map((x) => trocarNoValor(x, trocas));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, trocarNoValor(x, trocas)]));
  return v;
}

/** Passos com as letras trocadas em tudo (título, texto, fórmula, leitura, letras, tabelas). Sem troca: o mesmo array. */
export function letrasPelaInicial(passos: PassoBruto[], enunciado = ''): { passos: PassoBruto[]; trocas: Troca[] } {
  const trocas = trocasDaAula(passos, enunciado);
  if (!trocas.length) return { passos, trocas };
  return { passos: passos.map((p) => trocarNoValor(p, trocas) as PassoBruto), trocas };
}
