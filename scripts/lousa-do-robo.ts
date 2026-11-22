import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { lousaDoRobo } from '../lib/aula-lousa/do-robo';
import { validarLousa } from '../lib/aula-lousa/validar';

// Põe a lousa nas aulas que ainda estão só no molde do robô (Pablo, 21/11/2026: "não tá que nem o
// quadro do Universo Narrado"). Não mexe nas que já têm lousa feita à mão.
// Uso:
//   DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts <saida.json>            (só mostra e salva amostra)
//   DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts <saida.json> --gravar   (grava no banco)

// Pablo, 22/11/2026: "tirando Natureza, Química, Português, só exatas". Química e Biologia
// ficam de fora (as 3 de Química já feitas à mão continuam).
const MATERIAS_DE_EXATAS = ['Matemática', 'Física'];

const prisma = new PrismaClient();

async function main() {
  const saida = process.argv[2];
  const gravar = process.argv.includes('--gravar');
  if (!saida) throw new Error('faltou o arquivo de saída');

  const linhas = await prisma.explicacaoPronta.findMany({ include: { question: true } });
  const feitas: Record<string, unknown> = {};
  const motivos = new Map<string, number>();
  let jaTem = 0;
  let outroMolde = 0;
  let foraDaMateria = 0;
  for (const l of linhas) {
    const c = (l.conteudo ?? {}) as Record<string, unknown>;
    if (c.lousa && typeof c.lousa === 'object') { jaTem++; continue; }
    const passos = Array.isArray(c.passos) ? (c.passos as { titulo?: unknown; texto?: unknown; visual?: unknown }[]) : [];
    if (passos[0]?.titulo !== 'As fórmulas desta questão') { outroMolde++; continue; }
    const q = l.question;
    if (!MATERIAS_DE_EXATAS.includes(q.materia)) { foraDaMateria++; continue; }
    const r = lousaDoRobo({
      enunciado: q.enunciado,
      alternativas: [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x),
      tema: q.tema,
      passos,
    });
    if (!r.ok) { motivos.set(r.motivo, (motivos.get(r.motivo) ?? 0) + 1); continue; }
    const aula = validarLousa(r.aula);
    if (!aula || aula.cenas.length !== r.aula.cenas.length) { motivos.set('porteiro cortou tela', (motivos.get('porteiro cortou tela') ?? 0) + 1); continue; }
    feitas[q.id] = { aula, conteudo: c };
  }

  const ids = Object.keys(feitas);
  console.log(`já tinham lousa: ${jaTem} · outro molde (fica como está): ${outroMolde} · fora de Mat/Fís: ${foraDaMateria} · convertidas: ${ids.length}`);
  for (const [m, n] of motivos) console.log(`  não deu: ${n} × ${m}`);
  writeFileSync(saida, JSON.stringify(Object.fromEntries(ids.map((id) => [id, (feitas[id] as { aula: unknown }).aula])), null, 1));

  if (!gravar) { console.log('Simulação: nada gravado. Rode com --gravar.'); return; }
  const copia = `${process.env.HOME}/backups-prepenem/explicacoes-antes-lousa-do-robo-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(copia, JSON.stringify(Object.fromEntries(ids.map((id) => [id, (feitas[id] as { conteudo: unknown }).conteudo]))));
  console.log(`Cópia do conteúdo antigo: ${copia}`);
  let n = 0;
  for (const id of ids) {
    const { aula, conteudo } = feitas[id] as { aula: unknown; conteudo: Record<string, unknown> };
    await prisma.explicacaoPronta.update({ where: { questionId: id }, data: { conteudo: { ...conteudo, lousa: aula } as object } });
    n++;
  }
  console.log(`Gravadas: ${n}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
