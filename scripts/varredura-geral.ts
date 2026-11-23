import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { validarLousa } from '../lib/aula-lousa/validar';
import { ALTURA, LARGURA } from '../lib/aula-lousa/tipos';

// Varredura geral, SÓ LEITURA (Pablo, 22/11/2026: "dá uma geral em tudo... nada de bug"). Procura, em todas as questões
// e aulas: LaTeX solto fora de $...$, $ sem par, texto quebrado (undefined, NaN, null), validador do site recusando,
// lousa cortada pelo porteiro ou com texto fora do quadro, "Letra X" diferente do gabarito, [IMAGEM] sem imagem,
// enunciado com problema. Uso: DB_CONFIRMED=1 npx tsx scripts/varredura-geral.ts <saida.txt>
const prisma = new PrismaClient();

const strings = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const semMatematica = (s: string) => s.replace(/\$[^$]*\$/g, ' ');
const cifroesSoltos = (s: string) => (s.replace(/R\$(?=\s?\d)/g, 'R').match(/\$/g) ?? []).length; // "R$ 5" é dinheiro; "$R$" é matemática
const LATEX = /\\(frac|times|cdot|sqrt|pi|approx|div|text|left|right|geq|leq)\b/;
const QUEBRADO = /\bundefined\b|\[object|(^|[^A-Za-z])NaN(?![A-Za-z₀-₉0-9_{])|"null"/; // NaN₃ é a azida de sódio

type Achado = { categoria: string; id: string; detalhe: string };
const achados: Achado[] = [];
const acha = (categoria: string, id: string, detalhe: string) => achados.push({ categoria, id, detalhe: detalhe.slice(0, 140) });

async function main() {
  const saida = process.argv[2];
  const linhas = await prisma.explicacaoPronta.findMany({ include: { question: true } });
  const questoes = await prisma.question.findMany();

  for (const q of questoes) {
    if (!['Matemática', 'Física', 'Química', 'Biologia', 'Português'].includes(q.materia)) continue;
    const textos = [q.enunciado, q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x);
    if (!q.enunciado || q.enunciado.trim().length < 15) acha('enunciado vazio ou curto', q.id, q.enunciado ?? '');
    for (const t of textos) {
      if (cifroesSoltos(t) % 2 === 1) acha('$ sem par no enunciado/alternativa', q.id, t);
      if (LATEX.test(semMatematica(t))) acha('LaTeX solto no enunciado/alternativa', q.id, t);
      if (QUEBRADO.test(t)) acha('texto quebrado (undefined/NaN/null)', q.id, t);
    }
    const imagens = textos.filter((t) => t.includes('[IMAGEM]')).length;
    if (imagens > 0 && !q.dependeImagem && !q.imagemUrl && !q.pdfFileUrl) acha('[IMAGEM] sem imagem cadastrada', q.id, q.enunciado);
    const certa = ({ A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE } as Record<string, string | null>)[q.respostaCorreta];
    if (!certa) acha('gabarito aponta alternativa vazia', q.id, q.respostaCorreta);
  }

  for (const l of linhas) {
    const q = l.question;
    const c = (l.conteudo ?? {}) as Record<string, unknown>;
    const { lousa, ...semLousa } = c;
    // LaTeX só é bug nos campos de TEXTO; o quadro e as fórmulas são desenhados pelo KaTeX e levam LaTeX sem $.
    const textoCorrido = [c.ideia, ...(Array.isArray(c.passos) ? (c.passos as { titulo?: unknown; texto?: unknown }[]).flatMap((p) => [p.titulo, p.texto]) : [])].filter((x): x is string => typeof x === 'string');
    const todas = strings(semLousa);
    for (const s of todas) {
      if (cifroesSoltos(s) % 2 === 1) acha('$ sem par na explicação', q.id, s);
      if (textoCorrido.includes(s) && LATEX.test(semMatematica(s))) acha('LaTeX solto no texto da explicação', q.id, s);
      if (QUEBRADO.test(s)) acha('texto quebrado na explicação', q.id, s);
    }
    if (Array.isArray(c.passos) && c.passos.length) {
      if (!validarExplicacao(semLousa, q.materia)) acha('validador do site recusa a explicação', q.id, 'validarExplicacao = null');
      const volta = (c.passos as { titulo?: string; texto?: string }[]).find((p) => p.titulo === 'Volta na equação');
      const letra = /Letra ([A-E])\b/.exec(volta?.texto ?? '')?.[1];
      if (letra && letra !== q.respostaCorreta) acha('"Letra X" da explicação ≠ gabarito', q.id, `${letra} ≠ ${q.respostaCorreta}`);
    }
    if (lousa) {
      const aula = validarLousa(lousa);
      const cenas = (lousa as { cenas?: unknown[] }).cenas ?? [];
      if (!aula || aula.cenas.length !== cenas.length) acha('porteiro da lousa corta tela', q.id, `${aula?.cenas.length ?? 0} de ${cenas.length}`);
      for (const [i, cena] of (aula?.cenas ?? []).entries()) {
        if (cena.tipo !== 'lousa') continue;
        for (const d of cena.desenho) {
          if (d.k !== 'tx') continue;
          const larg = d.s.length * (d.tam ?? 24) * 0.4;
          const x0 = d.ancora === 'start' ? d.x : d.ancora === 'end' ? d.x - larg : d.x - larg / 2;
          const x1 = x0 + larg;
          if (x1 > LARGURA + 6 || x0 < -6) acha('lousa: texto passa da largura do quadro', q.id, `tela ${i + 1}: ${d.s}`);
          if (d.y > ALTURA) acha('lousa: texto abaixo do quadro', q.id, `tela ${i + 1}: ${d.s}`);
          if (/[$\\]/.test(d.s.replace(/R\$/g, ''))) acha('lousa: $ ou \\ no texto', q.id, `tela ${i + 1}: ${d.s}`);
        }
      }
    }
  }

  const porCategoria = new Map<string, Achado[]>();
  for (const a of achados) porCategoria.set(a.categoria, [...(porCategoria.get(a.categoria) ?? []), a]);
  let texto = `Questões: ${questoes.length} · explicações: ${linhas.length} · achados: ${achados.length}\n`;
  for (const [cat, lista] of [...porCategoria].sort((a, b) => b[1].length - a[1].length)) {
    texto += `\n## ${cat}: ${lista.length} (${new Set(lista.map((a) => a.id)).size} questões)\n`;
    for (const a of lista.slice(0, 25)) texto += `- ${a.id}: ${a.detalhe.replace(/\s+/g, ' ')}\n`;
  }
  if (!achados.length) texto += '\nNada encontrado.\n';
  writeFileSync(saida, texto);
  console.log(texto.split('\n').filter((l) => l.startsWith('Questões') || l.startsWith('##')).join('\n'));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
