// Converte a aula no molde do robô (passos: fórmulas, o que eu tenho, equação, achando cada letra,
// volta, pista) para a aula de lousa (Pablo, 21/11/2026: "não tá que nem o quadro do Universo
// Narrado"). Função pura: recebe a questão e os passos, devolve a lousa ou o motivo de não dar.
import type { AulaLousa, Cena, Cor, Desenho, Fala } from './tipos';
import { comResposta, telaDaFigura, telasDosConceitos } from './extras';
import { legendaCurta, pecasDaConta, separarContas, telaDaFormula, telasDosDados, telasDeContas, tituloNumerado } from './quadro-de-conta';

export type Passo = { titulo?: unknown; texto?: unknown; visual?: unknown };
export type EntradaDoRobo = {
  enunciado: string;
  alternativas: string[];
  tema: string | null;
  passos: Passo[];
};
export type Resultado = { ok: true; aula: AulaLousa } | { ok: false; motivo: string };

const TITULO_PRIMEIRO_PASSO = 'As fórmulas desta questão';
export const MAX_PAPEL = 3000; // vira várias telas de papel (dividirEnunciado)
export const MAX_ALTERNATIVA = 60;
const MAX_FALA = 150;
const MAX_FALA_DA_TELA = 250;
export const MAX_CENAS = 44;
const LINHAS_POR_TELA = 5;
const LARGURA_TELA = 360;
const LARGURA_DA_LETRA = 0.4; // mesma estimativa de lousa.py (em × tamanho)
const SEGUNDOS_POR_LETRA = 1 / 15;

export const texto = (v: unknown): string => (typeof v === 'string' ? v : '');
export const limpa = (s: string): string => s.replace(/(?<!R)\$|(?<=R)\$(?!\s?\d)/g, '').replace(/\s+/g, ' ').trim();

export function cabem(tam: number): number {
  return Math.floor(LARGURA_TELA / (tam * LARGURA_DA_LETRA));
}

/** Quebra em linhas de até `max` letras, só entre palavras. */
const ESPACO_DE_MILHAR = /(?<=\d) (?=\d{3}(?!\d))/g;
const MARCA_DE_MILHAR = '\u0001';

export function quebrar(s: string, max: number): string[] {
  const linhas: string[] = [];
  let atual = '';
  // "1 500 000" não pode quebrar no meio: o espaço do milhar vira um marcador até a linha sair.
  for (const palavra of limpa(s).replace(ESPACO_DE_MILHAR, MARCA_DE_MILHAR).split(' ').map((p) => p.split(MARCA_DE_MILHAR).join(' '))) {
    if (!palavra) continue;
    if (atual && atual.length + 1 + palavra.length > max) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = atual ? `${atual} ${palavra}` : palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export type Linha = { s: string; cor: Cor; tam: number };

/** Frase maior que uma fala quebra depois de ":", ";" ou "," e, sem isso, entre palavras: nunca no meio delas. */
function pedacosDaFala(frase: string): string[] {
  if (frase.length <= MAX_FALA) return [frase];
  const janela = frase.slice(0, MAX_FALA + 1);
  const pontuacao = Math.max(...[': ', '; ', ', '].map((marca) => janela.lastIndexOf(marca)));
  const corte = pontuacao > 0 ? pontuacao + 1 : janela.lastIndexOf(' ');
  const fim = corte > 0 ? corte : MAX_FALA;
  return [frase.slice(0, fim).trim(), ...pedacosDaFala(frase.slice(fim).trim())];
}

/** A última fala não pode terminar anunciando algo que não vem ("Atenção:"): rótulo curto sai, o resto ganha ponto. */
function semPontaSolta(frases: string[]): string[] {
  const ultima = frases[frases.length - 1];
  if (!ultima || !/[:;,]$/.test(ultima)) return frases;
  const antes = frases.slice(0, -1);
  if (antes.length && ultima.split(' ').length < 3) return semPontaSolta(antes);
  return [...antes, ultima.replace(/[:;,]$/, '.')];
}

/** Frases do professor: as frases do passo, até 4 e até ~250 letras na tela toda. */
export function falas(textoDoPasso: string): Fala[] {
  // "1 : 50 000" é uma escala: cola os dois-pontos entre números.
  const frases = limpa(textoDoPasso.replace(/\n/g, ' ').replace(/(\d)\s*:\s*(\d)/g, '$1:$2'))
    .split(/(?<=[.?!])\s+/)
    .flatMap(pedacosDaFala)
    .filter(Boolean);
  const escolhidas: string[] = [];
  let total = 0;
  for (const f of frases) {
    if (escolhidas.length >= 4 || total + f.length > MAX_FALA_DA_TELA) break;
    escolhidas.push(f);
    total += f.length;
  }
  if (!escolhidas.length && frases[0]) escolhidas.push(frases[0]);
  let t = 0.3;
  return semPontaSolta(escolhidas).map((f): Fala => {
    const par: Fala = [Math.round(t * 10) / 10, f];
    t += Math.max(2.2, f.length * SEGUNDOS_POR_LETRA + 0.8);
    return par;
  });
}

/** Telas de texto: título no alto e até 5 linhas por tela, uma a uma, com sublinhado verde no que tem "=". */
export function telas(titulo: string, linhas: Linha[], fala: Fala[]): Cena[] {
  const paginas: Linha[][] = [];
  for (let i = 0; i < linhas.length; i += LINHAS_POR_TELA) paginas.push(linhas.slice(i, i + LINHAS_POR_TELA));
  if (!paginas.length) paginas.push([]);
  return paginas.map((pagina, n): Cena => {
    const tituloDaTela = n ? tituloNumerado(titulo, n + 1) : tituloNumerado(titulo, 1).replace(/ \(1\)$/, '');
    const desenho: Desenho[] = [
      { k: 'tx', x: 200, y: 34, s: tituloDaTela, cor: 'tinta', tam: Math.min(28, Math.floor(LARGURA_TELA / (tituloDaTela.length * LARGURA_DA_LETRA))), t: 0.2 }, // título longo encolhe: não passa do quadro
    ];
    pagina.forEach((l, i) => {
      desenho.push({ k: 'tx', x: 30, y: 84 + i * 44, s: l.s, cor: l.cor, tam: l.tam, t: 0.8 + i * 1.4, ancora: 'start' });
    });
    return { tipo: 'lousa', fala: n === 0 ? fala : fala.slice(-1), desenho };
  });
}

export function linhasDoTexto(s: string, tam = 24): Linha[] {
  const max = cabem(tam);
  const saida: Linha[] = [];
  for (const parte of s.split('\n')) {
    for (const l of quebrar(parte, max)) {
      const conta = /[=×÷]/.test(l) && !/[a-zà-ú]{5,}/i.test(l.replace(/\([^)]*\)/g, ''));
      saida.push({ s: l, cor: conta ? 'verde' : 'tinta', tam });
    }
  }
  return saida;
}

export function visualDe(p: Passo): Record<string, unknown> | null {
  return p.visual && typeof p.visual === 'object' ? (p.visual as Record<string, unknown>) : null;
}

export function linhasDaTabela(v: Record<string, unknown> | null): Linha[] {
  const linhas = Array.isArray(v?.linhas) ? (v!.linhas as unknown[]) : [];
  return linhas.flatMap((l) => {
    if (!Array.isArray(l)) return [];
    const [a, b] = l.map((x) => limpa(texto(x)));
    return quebrar(`${a}: ${b}`, cabem(24)).map((s) => ({ s, cor: 'tinta' as Cor, tam: 24 }));
  });
}

/** "E = estrada (o que a questão quer)" → "estrada": a fala lê o significado sem o aparte. */
const semAparte = (s: string): string => limpa(s.replace(/\([^)]*\)/g, ''));

/** Falas da tela das letras: "T é terras. D é dias." juntando letras até ~140 letras por fala. */
function falasDasLetras(letras: Record<string, unknown>[]): Fala[] {
  const frases = letras.map((l) => `${limpa(texto(l.letra))} é ${semAparte(texto(l.oque))}.`);
  const grupos: string[] = [];
  for (const f of frases) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.length + 1 + f.length <= 140) grupos[grupos.length - 1] = `${ultimo} ${f}`;
    else grupos.push(f);
  }
  let t = 0.3;
  return grupos.slice(0, 4).map((f): Fala => {
    const par: Fala = [Math.round(t * 10) / 10, f];
    t += Math.max(2.2, f.length * SEGUNDOS_POR_LETRA + 0.8);
    return par;
  });
}

/** Pablo, 22/11/2026: "só logo o significado de cada palavra; no outro quadro você explica; fica muita coisa em cima
 *  da outra". A equação vira 3 telas: as letras (só "letra = palavra"), a equação sozinha e, depois, o porquê. */
export function telasDaEquacao(formula: string, leitura: string, letras: Record<string, unknown>[], explicacao: string): Cena[] {
  const cenas: Cena[] = [];
  const legenda: Linha[] = letras.flatMap((l) =>
    quebrar(`${limpa(texto(l.letra))} = ${limpa(texto(l.oque))}`, cabem(26)).map((s) => ({ s, cor: 'tinta' as Cor, tam: 26 })),
  );
  if (legenda.length) cenas.push(...telas('as letras', legenda, falasDasLetras(letras)));
  const linhas: Linha[] = [
    ...quebrar(formula, cabem(36)).map((s) => ({ s, cor: 'verde' as Cor, tam: 36 })),
    ...quebrar(leitura, cabem(26)).map((s) => ({ s, cor: 'azul' as Cor, tam: 26 })),
  ];
  cenas.push(...telas('a equação', linhas, [[0.3, `A equação é ${formula}.`.slice(0, MAX_FALA)]]));
  const porque = linhasDoTexto(explicacao);
  if (porque.length) cenas.push(...telas('por quê', porque, falas(explicacao)));
  return cenas;
}

const MAX_PAPEL_POR_TELA = 380; // o quadro tem altura fixa: acima disso as alternativas ficam abaixo da dobra (sem rolar)

/** Enunciado longo vira várias telas de papel, quebrando entre frases; as alternativas vão na última. */
export function dividirEnunciado(bruto: string): string[] {
  // "[IMAGEM]" é marca do banco: no papel da lousa vira um aviso que o aluno entende.
  const enunciado = bruto.replace(/\[IMAGEM[^\]]*\]/g, '(figura na questão)');
  if (enunciado.length <= MAX_PAPEL_POR_TELA) return [enunciado];
  const frases = enunciado.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [enunciado];
  const partes: string[] = [];
  let atual = '';
  for (const f of frases) {
    if (atual && (atual + f).length > MAX_PAPEL_POR_TELA) {
      partes.push(atual.trim());
      atual = '';
    }
    atual += f;
  }
  if (atual.trim()) partes.push(atual.trim());
  return partes;
}

const MAX_PISTA = 88; // 2 linhas de 44 letras no pé do quadro

/** A pista que cabe no pé do quadro: a 1ª frase; se for comprida, só o conselho (depois da seta) ou o começo até uma palavra inteira. */
export function resumoDaPista(t: string): string {
  const frase = limpa(t).replace(/^Pista:\s*/i, '').split(/(?<=[.!?])\s/)[0];
  if (frase.length <= MAX_PISTA) return frase;
  const depoisDaSeta = frase.split('→').pop()?.trim() ?? frase;
  const antesDosDoisPontos = depoisDaSeta.split(':')[0];
  const base = antesDosDoisPontos.length <= MAX_PISTA ? antesDosDoisPontos : depoisDaSeta;
  if (base.length <= MAX_PISTA) return base;
  const corte = base.slice(0, MAX_PISTA).lastIndexOf(' ');
  return `${base.slice(0, corte > 0 ? corte : MAX_PISTA)}…`;
}

/** Equação em quadro: a fórmula com legenda embaixo de cada letra e, depois, a mesma conta com o porquê só na fala. */
function equacaoEmQuadro(formula: string, leitura: string, letras: Record<string, unknown>[], explicacao: string): Cena[] {
  const dasLetras = letras.map((l) => ({ letra: limpa(texto(l.letra)), oque: limpa(texto(l.oque)) }));
  const tela = telaDaFormula(formula, dasLetras, falasDasLetras(letras));
  if (!tela) return telasDaEquacao(formula, leitura, letras, explicacao);
  const cenas: Cena[] = [tela];
  const conta = pecasDaConta(formula, true);
  const porque = limpa(explicacao);
  if (conta && porque) cenas.push(...telasDeContas('por quê', [conta], falas(porque)));
  return cenas;
}

function telasDosDadosDe(v: Record<string, unknown> | null, t: string): Cena[] {
  const linhas = (Array.isArray(v?.linhas) ? (v!.linhas as unknown[]) : []).flatMap((l): [string, string][] => {
    if (!Array.isArray(l)) return [];
    const [a, b] = l.map((x) => limpa(texto(x)));
    return a && b ? [[a, b]] : [];
  });
  return telasDosDados(linhas, falas(t));
}

export function lousaDoRobo(e: EntradaDoRobo): Resultado {
  const passos = e.passos;
  if (texto(passos[0]?.titulo) !== TITULO_PRIMEIRO_PASSO) return { ok: false, motivo: 'não é o molde do robô' };
  if (!e.enunciado || e.enunciado.length > MAX_PAPEL) return { ok: false, motivo: 'enunciado vazio ou longo demais' };
  const alts = e.alternativas.map((a) => limpa(a));
  if (alts.length < 2 || alts.some((a) => !a)) return { ok: false, motivo: 'alternativa vazia' };
  // Alternativa longa vazaria da fileira do papel: nesse caso o papel leva só o enunciado.
  const cabemNoPapel = alts.every((a) => a.length <= MAX_ALTERNATIVA);

  const cenas: Cena[] = [];
  const nome = (e.tema ?? 'Questão').slice(0, 30);
  cenas.push({
    tipo: 'lousa',
    fala: [[0.3, `Questão de ${nome}. A aula segue a conta dela, uma peça por vez.`]],
    desenho: [
      { k: 'tx', x: 200, y: 120, s: nome, cor: 'tinta', tam: nome.length > 20 ? 32 : 40, t: 0.2 },
      { k: 'linha', x1: 90, y1: 142, x2: 310, y2: 142, cor: 'verde', t: 1.0, dur: 0.8 },
      { k: 'tx', x: 200, y: 196, s: 'passo a passo', cor: 'cinza', tam: 28, t: 2.0 },
    ],
  });
  const partes = dividirEnunciado(e.enunciado);
  partes.forEach((parte, k) => {
    const ultima = k === partes.length - 1;
    cenas.push({
      tipo: 'papel',
      fala: [[0.3, k === 0 ? 'Esta é a questão. Primeiro vamos separar o que ela dá e o que ela quer.' : 'Continua a questão.']],
      rotulo: partes.length > 1 ? `A questão (${k + 1} de ${partes.length})` : 'A questão',
      texto: parte,
      ...(ultima && cabemNoPapel ? { alternativas: alts } : {}),
    });
  });

  for (const p of passos) {
    const titulo = limpa(texto(p.titulo));
    const t = texto(p.texto);
    const v = visualDe(p);
    if (!titulo) continue;
    // Passo com desenho: o desenho vai para o quadro. "O desenho" é só ele; os outros seguem com as contas.
    const figura = telaDaFigura(v, falas(t));
    if (figura) {
      cenas.push(figura);
      if (/^O desenho/i.test(titulo)) continue;
    }
    if (titulo === TITULO_PRIMEIRO_PASSO) {
      const itens = Array.isArray(v?.itens) ? (v!.itens as Record<string, unknown>[]) : [];
      const conceitos = telasDosConceitos(itens);
      // "Por que ⅓" com números soltos sai quando a tela "de onde vem" explica.
      const formulas = conceitos.length ? itens.filter((it) => !/^Por que/i.test(texto(it.nome))) : itens;
      const linhas = formulas.flatMap((it) => [
        ...quebrar(limpa(texto(it.nome)), cabem(24)).map((s) => ({ s, cor: 'azul' as Cor, tam: 24 })),
        ...quebrar(limpa(texto(it.formula)), cabem(26)).map((s) => ({ s, cor: 'verde' as Cor, tam: 26 })),
      ]);
      const contas = formulas.map((it) => pecasDaConta(limpa(texto(it.formula)), true));
      // O nome da fórmula ("Calor para derreter") vira legenda da letra da esquerda: sem ela o aluno não sabe o que é Q.
      const comNome = contas.map((c, i) => (c ? c.map((p, k) => (k === 0 ? { ...p, leg: legendaCurta(limpa(texto(formulas[i]?.nome))), cor: 'verde' as Cor } : p)) : null));
      if (contas.length > 0 && comNome.every((c) => c !== null)) cenas.push(...telasDeContas('as fórmulas', comNome as NonNullable<(typeof comNome)[number]>[], falas(t)));
      else cenas.push(...telas('as fórmulas', linhas, falas(t)));
      cenas.push(...conceitos);
    } else if (v?.tipo === 'equacao') {
      const formula = limpa(texto(v.formula));
      // As letras que aparecem na fórmula vêm primeiro, na ordem em que aparecem: assim nenhuma
      // letra da equação é explicada só na tela seguinte (Pablo, 22/11/2026: "o que significa o M?").
      const posicao = (l: Record<string, unknown>): number => {
        const i = formula.indexOf(limpa(texto(l.letra)));
        return i < 0 ? Number.MAX_SAFE_INTEGER : i;
      };
      const letras = (Array.isArray(v.letras) ? (v.letras as Record<string, unknown>[]) : [])
        .map((l, i) => ({ l, i }))
        .sort((a, b) => posicao(a.l) - posicao(b.l) || a.i - b.i)
        .map(({ l }) => l);
      cenas.push(...equacaoEmQuadro(formula, limpa(texto(v.leitura)), letras, t));
    } else if (/receita|parecida/i.test(titulo)) {
      // A receita repete a aula: só as contas dela vão para o quadro (numa tela) e a pista vira fala.
      const contas = (Array.isArray(v?.linhas) ? (v!.linhas as unknown[]) : []).flatMap((l) => (Array.isArray(l) ? separarContas(limpa(texto(l[1]))).contas : []));
      const pista = resumoDaPista(t);
      if (contas.length > 0) cenas.push(...telasDeContas('questão parecida?', contas.slice(0, 2), falas(t), pista));
      else cenas.push(...telas('questão parecida?', [...linhasDoTexto(t), ...linhasDaTabela(v)], falas(t)));
    } else if (/^O que eu tenho/i.test(titulo) && v?.tipo === 'tabela' && telasDosDadosDe(v, t).length > 0) {
      cenas.push(...telasDosDadosDe(v, t));
    } else if (!/receita|parecida/i.test(titulo) && separarContas(t).contas.length > 0) {
      const { contas, prosa } = separarContas(t);
      cenas.push(...telasDeContas(titulo.replace(/^Achando /, 'achando '), contas, falas(prosa || `${titulo}.`)));
    } else {
      const base = v?.tipo === 'tabela' ? [...linhasDoTexto(t.split('\n')[0] ?? ''), ...linhasDaTabela(v)] : linhasDoTexto(t);
      cenas.push(...telas(titulo.replace(/^Achando /, 'achando '), base, falas(t)));
    }
  }

  const volta = passos.find((p) => /^Volta na equa/i.test(texto(p.titulo)));
  const completas = volta ? comResposta(cenas, texto(volta.texto), alts) : cenas;

  if (completas.length < 3) return { ok: false, motivo: 'poucas telas' };
  if (completas.length > MAX_CENAS) return { ok: false, motivo: `telas demais (${completas.length})` };
  return { ok: true, aula: { cenas: completas } };
}
