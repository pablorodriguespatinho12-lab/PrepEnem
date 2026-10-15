// Gera a explicação de UMA questão do banco (pelo começo do enunciado) e
// imprime os passos e o tipo de visual. Só leitura.
//   npx tsx --env-file=.env scripts/testar-uma-explicacao.ts "A energia cinética de um corpo"
import { prisma } from '@/lib/db';
import { promptExplicacao } from '@/lib/tutor/prompts';
import { validarExplicacao } from '@/lib/tutor/validar';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';

async function main() {
  const q = await prisma.question.findFirst({ where: { enunciado: { startsWith: process.argv[2] ?? '' } } });
  if (!q) throw new Error('questão não encontrada');
  const r = await pedirJson(promptExplicacao({
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta, materia: q.materia, subtema: q.subtema,
  }), (bruto) => validarExplicacao(bruto, q.materia), { maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao() });
  console.log('QUESTÃO:', q.enunciado.slice(0, 120));
  if (!r.ok) { console.log('FALHOU', r.erro); return; }
  r.dado.passos.forEach((p, i) => console.log(`${i + 1}. [${p.titulo}] ${p.visual ? (p.visual as { tipo: string }).tipo : 'sem visual'}: ${JSON.stringify(p.visual).slice(0, 240)}`));
  await prisma.$disconnect();
}
main();
