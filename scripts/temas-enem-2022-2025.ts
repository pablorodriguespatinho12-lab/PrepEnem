// Grava os temas de redação do ENEM 2022, 2024 e 2025 na tabela EssayTheme.
// Só cria ou atualiza estes três (por `tema`, que é único); nunca apaga nada.
// Sem --gravar, só mostra o diff. Texto conferido em 27/10/2026 na imprensa
// (Preparaenem, O Povo, Agência Brasil); o "contexto" é resumo nosso, não a
// coletânea do INEP.
//   DB_CONFIRMED=1 npx tsx --env-file=.env scripts/temas-enem-2022-2025.ts [--gravar]
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEMAS = [
  {
    tema: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
    anoEnem: 2022,
    areaConhecimento: 'Cidadania e desigualdade',
    textoMotivador: 'Recorte: valorizar comunidades e povos tradicionais (indígenas, quilombolas, ribeirinhos, extrativistas). Discutir o que impede essa valorização: território, preconceito, invisibilidade, acesso a direitos.',
  },
  {
    tema: 'Desafios para a valorização da herança africana no Brasil',
    anoEnem: 2024,
    areaConhecimento: 'Cidadania e desigualdade',
    textoMotivador: 'Recorte: valorizar a herança africana na cultura, na língua, na religião e na história do Brasil. Discutir o que impede essa valorização: racismo, apagamento na escola, intolerância religiosa.',
  },
  {
    tema: 'Perspectivas acerca do envelhecimento na sociedade brasileira',
    anoEnem: 2025,
    areaConhecimento: 'Saúde',
    textoMotivador: 'Recorte: como a sociedade brasileira vê e se prepara para o envelhecimento da população. Discutir cuidado, trabalho, previdência, saúde, idadismo e o lugar do idoso na família e na cidade.',
  },
];

async function main() {
  const gravar = process.argv.includes('--gravar');
  const antes = await prisma.essayTheme.count();

  for (const t of TEMAS) {
    const atual = await prisma.essayTheme.findUnique({ where: { tema: t.tema } });
    const muda = !atual || atual.anoEnem !== t.anoEnem || atual.areaConhecimento !== t.areaConhecimento || atual.textoMotivador !== t.textoMotivador;
    console.info(`${!atual ? '+ cria' : muda ? '~ atualiza' : '= igual'}  ${t.anoEnem}  ${t.tema}`);
    if (gravar && muda) await prisma.essayTheme.upsert({ where: { tema: t.tema }, create: t, update: t });
  }

  const depois = await prisma.essayTheme.count();
  console.info(`\nTemas: ${antes} antes, ${depois} depois.${gravar ? '' : ' (só mostrei; use --gravar para gravar)'}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
