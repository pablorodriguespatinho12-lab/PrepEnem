import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { FICHAS_GEOMETRIA } from '../data/lousas/geometria';
import { capaEPapelGeometria, lousaGeometria } from '../lib/aula-lousa/geometria';
import { validarLousa } from '../lib/aula-lousa/validar';
import type { AulaLousa, Cena } from '../lib/aula-lousa/tipos';

// Grava a lousa de GEOMETRIA (22/11/2026): figura desenhada + equação pelos lados. Só mexe em `conteudo.lousa` das questões das fichas; guarda cópia antes.
// Uso: DB_CONFIRMED=1 npx tsx scripts/gravar-lousa-geometria.ts <previa.json> <texto.txt>            (simula)
//      DB_CONFIRMED=1 npx tsx scripts/gravar-lousa-geometria.ts <previa.json> <texto.txt> --gravar   (grava)

const prisma = new PrismaClient();

/** Texto para o aluno-do-zero: o que o professor diz e o que está escrito, tela a tela. */
function comoTexto(id: string, aula: AulaLousa): string {
  const telas = aula.cenas.map((c: Cena, i) => {
    const fala = c.fala.map((f) => f[1]).join(' ');
    const escrito = c.tipo === 'lousa' ? c.desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])).join(' | ') : c.tipo === 'papel' ? `${c.texto} ${(c.alternativas ?? []).join(' / ')}` : '';
    return `[tela ${i + 1}] professor diz: ${fala}\n   escrito na lousa: ${escrito}`;
  });
  return `## ${id}\n${telas.join('\n')}\n`;
}

async function main() {
  const [previa, texto] = process.argv.slice(2);
  if (!previa || !texto) throw new Error('faltou <previa.json> <texto.txt>');
  const gravar = process.argv.includes('--gravar');

  const novas: Record<string, AulaLousa> = {};
  const antes: Record<string, unknown> = {};
  const conteudos: Record<string, Record<string, unknown>> = {};
  for (const ficha of FICHAS_GEOMETRIA) {
    const q = await prisma.question.findUnique({ where: { id: ficha.id } });
    const e = await prisma.explicacaoPronta.findUnique({ where: { questionId: ficha.id } });
    if (!q || !e) throw new Error(`${ficha.id}: questão ou explicação não encontrada`);
    const alternativas = [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x);
    const [capa, papel] = capaEPapelGeometria(q.tema ?? 'Geometria Plana', q.enunciado, alternativas);
    const aula = validarLousa(lousaGeometria(ficha, capa, papel));
    if (!aula) throw new Error(`${ficha.id}: o porteiro recusou a lousa`);
    novas[ficha.id] = aula;
    conteudos[ficha.id] = (e.conteudo ?? {}) as Record<string, unknown>;
    antes[ficha.id] = e.conteudo;
    console.log(`${ficha.id}: ${aula.cenas.length} telas`);
  }
  writeFileSync(previa, JSON.stringify(novas, null, 1));
  writeFileSync(texto, Object.entries(novas).map(([id, a]) => comoTexto(id, a)).join('\n'));
  console.log(`Prévia: ${previa} · texto: ${texto}`);

  if (!gravar) { console.log('Simulação: nada gravado.'); return; }
  const copia = `${process.env.HOME}/backups-prepenem/lousa-geometria-antes-${new Date().toISOString().slice(0, 16).replace(':', 'h')}.json`;
  writeFileSync(copia, JSON.stringify(antes));
  console.log(`Cópia: ${copia}`);
  for (const [id, aula] of Object.entries(novas)) {
    await prisma.explicacaoPronta.update({ where: { questionId: id }, data: { conteudo: { ...conteudos[id], lousa: aula } as object } });
  }
  console.log(`Gravadas: ${Object.keys(novas).length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
