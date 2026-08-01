// Reescreve Question.pdfFileUrl do bucket S3 da Abacus (403, credenciais nunca migradas)
// para o INEP, fonte oficial pública dos mesmos PDFs (nomes de arquivo preservados
// pela Abacus, só com prefixo de timestamp a mais). paginaPdf continua válido.
// Uso: npx tsx scripts/fix-pdf-urls-to-inep.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const URL_MAP: Record<string, string> = {
  'https://abacusai-apps-09da44b3d54c2c5c6272024c-us-west-2.s3.us-west-2.amazonaws.com/42562/pdfs/1778092743323_2023_PV_impresso_D1_CD1.pdf':
    'https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD1.pdf',
  'https://abacusai-apps-09da44b3d54c2c5c6272024c-us-west-2.s3.us-west-2.amazonaws.com/42562/pdfs/1778091679962_2022_PV_impresso_D2_CD5.pdf':
    'https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD5.pdf',
  'https://abacusai-apps-09da44b3d54c2c5c6272024c-us-west-2.s3.us-west-2.amazonaws.com/42562/pdfs/1778091324686_2022_PV_impresso_D1_CD1.pdf':
    'https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD1.pdf',
  'https://abacusai-apps-09da44b3d54c2c5c6272024c-us-west-2.s3.us-west-2.amazonaws.com/42562/pdfs/1778089947301_2021_PV_impresso_D2_CD5.pdf':
    'https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D2_CD5.pdf',
  'https://abacusai-apps-09da44b3d54c2c5c6272024c-us-west-2.s3.us-west-2.amazonaws.com/42562/pdfs/1778089315305_2021_PV_impresso_D1_CD1.pdf':
    'https://download.inep.gov.br/enem/provas_e_gabaritos/2021_PV_impresso_D1_CD1.pdf',
};

async function main() {
  console.log('Reescrevendo pdfFileUrl (S3 Abacus -> INEP)...\n');

  let totalUpdated = 0;
  for (const [oldUrl, newUrl] of Object.entries(URL_MAP)) {
    const result = await prisma.question.updateMany({
      where: { pdfFileUrl: oldUrl },
      data: { pdfFileUrl: newUrl },
    });
    console.log(`  ${result.count}x  ${oldUrl.split('/').pop()}`);
    totalUpdated += result.count;
  }
  console.log(`\nTotal atualizado: ${totalUpdated}`);

  const remaining = await prisma.question.count({
    where: { pdfFileUrl: { contains: 'amazonaws.com' } },
  });
  const semPdf = await prisma.question.count({
    where: { dependeImagem: true, pdfFileUrl: null },
  });
  console.log(`Restantes apontando pro S3 (deveria ser 0): ${remaining}`);
  console.log(`Sem pdfFileUrl e dependeImagem=true (perda conhecida, sem solução): ${semPdf}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
