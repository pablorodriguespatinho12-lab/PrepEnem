import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { aulaCostureiras, ID_COSTUREIRAS } from '../data/lousas/costureiras';
import { validarLousa } from '../lib/aula-lousa/validar';
import type { Cena } from '../lib/aula-lousa/tipos';

// Troca a lousa da questão das costureiras pela do jeito do Pablo (22/11/2026). Só mexe em
// `conteudo.lousa` desta questão; guarda cópia antes.
// Uso: DB_CONFIRMED=1 npx tsx scripts/gravar-lousa-costureiras.ts <saida.json>            (só monta e salva a prévia)
//      DB_CONFIRMED=1 npx tsx scripts/gravar-lousa-costureiras.ts <saida.json> --gravar   (grava no banco)

const prisma = new PrismaClient();

async function main() {
  const saida = process.argv[2];
  if (!saida) throw new Error('faltou o arquivo de saída');
  const linha = await prisma.explicacaoPronta.findUnique({ where: { questionId: ID_COSTUREIRAS } });
  if (!linha) throw new Error('explicação não encontrada');
  const conteudo = (linha.conteudo ?? {}) as { lousa?: { cenas?: Cena[] } };
  const [capa, papel] = conteudo.lousa?.cenas ?? [];
  if (capa?.tipo !== 'lousa' || papel?.tipo !== 'papel') throw new Error('capa ou papel não está como esperado');

  const nova = aulaCostureiras(capa, papel);
  const valida = validarLousa(nova);
  if (!valida || valida.cenas.length !== nova.cenas.length) throw new Error('o porteiro cortou alguma tela');
  writeFileSync(saida, JSON.stringify({ [ID_COSTUREIRAS]: valida }, null, 1));
  console.log(`Prévia salva: ${valida.cenas.length} telas em ${saida}`);

  if (!process.argv.includes('--gravar')) { console.log('Simulação: nada gravado.'); return; }
  const copia = `${process.env.HOME}/backups-prepenem/lousa-costureiras-antes-${new Date().toISOString().slice(0, 16).replace(':', 'h')}.json`;
  writeFileSync(copia, JSON.stringify(conteudo));
  console.log(`Cópia: ${copia}`);
  await prisma.explicacaoPronta.update({ where: { questionId: ID_COSTUREIRAS }, data: { conteudo: { ...conteudo, lousa: valida } as object } });
  console.log('Gravado.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
