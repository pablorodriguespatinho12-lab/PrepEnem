/* Revisão das explicações prontas (ExplicacaoPronta).
   - sem argumento: refaz a revisão automática de todas as não revisadas e
     mostra quantas passaram e o que as outras têm;
   - "aprovar id id ...": marca como revisadas as que eu li e estão certas;
   - "apagar id id ...": tira a pronta (a questão volta para a fila do gerador).

   Só mexe em ExplicacaoPronta, sempre por id.
   Uso: DB_CONFIRMED=1 npx tsx --env-file=.env scripts/revisar-explicacoes.ts [aprovar|apagar] [ids...] */
import { PrismaClient } from '@prisma/client';
import { problemasDaExplicacao } from '../lib/tutor/pronta';
import { validarExplicacao } from '../lib/tutor/validar';

const prisma = new PrismaClient();

async function revisarTodas() {
  const prontas = await prisma.explicacaoPronta.findMany({ where: { revisada: false }, include: { question: true } });
  let passaram = 0;
  for (const p of prontas) {
    const e = validarExplicacao(p.conteudo, p.question.materia);
    const problemas = e ? problemasDaExplicacao(e, p.question.enunciado, p.question.materia) : ['não passa mais no validador'];
    await prisma.explicacaoPronta.update({ where: { id: p.id }, data: { problemas: problemas.join('; ') || null } });
    if (problemas.length === 0) passaram++;
    else console.log(`⚠ ${p.id} ${p.question.materia}: ${problemas.join('; ')}`);
  }
  const revisadas = await prisma.explicacaoPronta.count({ where: { revisada: true } });
  console.log(`\nNão revisadas: ${prontas.length} (${passaram} passaram na automática) · revisadas: ${revisadas}`);
}

async function main() {
  const [acao, ...ids] = process.argv.slice(2);
  if (acao === 'aprovar' && ids.length) {
    const r = await prisma.explicacaoPronta.updateMany({ where: { id: { in: ids } }, data: { revisada: true } });
    console.log(`Aprovadas: ${r.count}`);
  } else if (acao === 'apagar' && ids.length) {
    const r = await prisma.explicacaoPronta.deleteMany({ where: { id: { in: ids } } });
    console.log(`Apagadas: ${r.count}`);
  } else {
    await revisarTodas();
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
