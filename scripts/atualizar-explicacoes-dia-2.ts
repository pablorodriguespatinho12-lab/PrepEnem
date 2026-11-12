import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Regrava SÓ a explicação pronta das questões passadas, a partir dos JSON de
// data/revisao-final/dia-2 (a fonte). Não mexe em prova, questão nem conta.
// Nasceu do teste do aluno-do-zero (12/11/2026): "multiplique por 3" sem o
// porquê (d2-facil-mat-01) e P = U × i sem origem (d2-facil-nat-01).
// Sem --gravar só mostra o antes e o depois. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/atualizar-explicacoes-dia-2.ts <id> [<id>...] [--gravar]

const prisma = new PrismaClient();
const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const ARQUIVOS = ['facil', 'medio', 'dificil', 'enem'].flatMap((n) => ['matematica', 'natureza'].map((a) => `${n}-${a}.json`));

type Questao = { id: string; materia: string; explicacao: unknown };
const todas: Questao[] = ARQUIVOS.flatMap((f) => JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as Questao[]);

type Passo = { titulo?: string; texto?: string };
const textos = (c: unknown): string[] =>
  ((c as { passos?: Passo[] })?.passos ?? []).map((p) => `${p.titulo}: ${p.texto}`);

async function main() {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  if (ids.length === 0) throw new Error('Passe ao menos um id de questão');

  for (const id of ids) {
    const q = todas.find((x) => x.id === id);
    if (!q) throw new Error(`${id}: não está nos JSON do dia 2`);
    const conteudo = validarExplicacao(q.explicacao, q.materia);
    if (!conteudo) throw new Error(`${id}: explicação recusada pelo validador; nada gravado`);
    const atual = await prisma.explicacaoPronta.findUnique({ where: { questionId: id } });
    if (!atual) throw new Error(`${id}: não há explicação pronta no banco; nada gravado`);

    const antes = textos(atual.conteudo);
    const depois = textos(conteudo);
    const mudou = depois.filter((t, i) => t !== antes[i]);
    console.log(`\n${id}: ${mudou.length} passo(s) mudam`);
    mudou.forEach((t) => console.log(`  depois → ${t}`));

    if (gravar && mudou.length > 0) {
      await prisma.explicacaoPronta.update({
        where: { questionId: id },
        data: { conteudo: conteudo as object, versao: VERSAO_EXPLICACAO },
      });
      console.log(`  gravado.`);
    }
  }
  if (!gravar) console.log('\nNada gravado (use --gravar).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
