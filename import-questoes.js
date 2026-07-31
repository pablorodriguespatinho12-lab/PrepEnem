// Script para importar as 719 questões do Abacus AI para o banco Neon.tech
// Uso: node import-questoes.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'questoes-prepenem.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const questions = JSON.parse(raw);
  console.log(`Encontradas ${questions.length} questões para importar.`);

  let created = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      // Evita duplicar se já rodar o script duas vezes
      const existing = await prisma.question.findUnique({ where: { id: q.id } });
      if (existing) {
        skipped++;
        continue;
      }

      await prisma.question.create({
        data: {
          id: q.id,
          enunciado: q.enunciado,
          alternativaA: q.alternativaA,
          alternativaB: q.alternativaB,
          alternativaC: q.alternativaC,
          alternativaD: q.alternativaD,
          alternativaE: q.alternativaE,
          respostaCorreta: q.respostaCorreta,
          materia: q.materia,
          subtema: q.subtema,
          dificuldade: q.dificuldade,
          nivel: q.nivel ?? null,
          explicacao: q.explicacao ?? null,
          origem: q.origem ?? null,
          dependeImagem: q.dependeImagem ?? false,
          geradaPorIA: q.geradaPorIA ?? false,
          numeroQuestao: q.numeroQuestao ?? null,
          anoProva: q.anoProva ?? null,
          diaProva: q.diaProva ?? null,
          pdfFileUrl: q.pdfFileUrl ?? null,
          paginaPdf: q.paginaPdf ?? null,
          createdAt: q.createdAt ? new Date(q.createdAt) : undefined,
          updatedAt: q.updatedAt ? new Date(q.updatedAt) : undefined,
        },
      });
      created++;
      if (created % 50 === 0) console.log(`  ${created} importadas...`);
    } catch (err) {
      console.error(`Erro na questão ${q.id}:`, err.message);
    }
  }

  console.log(`\n✅ Concluído! ${created} criadas, ${skipped} já existiam.`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
