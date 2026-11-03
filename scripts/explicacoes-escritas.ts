// Explicações escritas pelo Claude da sessão (não pela IA do site), para as
// questões da prova "Revisão final" (Pablo, 03/11/2026: "a explicação feita
// por você, da melhor forma possível, com imagem, como se eu fosse um bebê").
// Entra como explicação pronta: sai na hora na tela, sem gastar cota.
// Passa pelo mesmo validador da IA (validarExplicacao) e pela revisão de
// formato (problemasDaExplicacao); com problema, não grava.
// Uso: npx tsx scripts/explicacoes-escritas.ts <arquivo.json> [--gravar]
//   arquivo: { "<questionId>": { ideia, pecas, passos, checagem } }
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO, problemasDaExplicacao } from '../lib/tutor/pronta';

const prisma = new PrismaClient();
const MODELO = 'claude-opus-5-5 (escrita na sessão)';

async function main() {
  const [arquivo] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  if (!arquivo) throw new Error('Uso: npx tsx scripts/explicacoes-escritas.ts <arquivo.json> [--gravar]');
  const lote: Record<string, unknown> = JSON.parse(readFileSync(arquivo, 'utf8'));
  const qs = await prisma.question.findMany({ where: { id: { in: Object.keys(lote) } }, select: { id: true, materia: true, enunciado: true, origem: true } });
  let ok = 0;
  let ruins = 0;
  for (const [id, bruto] of Object.entries(lote)) {
    const q = qs.find((x) => x.id === id);
    if (!q) { console.log(`✗ ${id}: questão não existe`); ruins++; continue; }
    const valida = validarExplicacao(bruto, q.materia);
    if (!valida) { console.log(`✗ ${q.origem} ${id}: o validador recusou (campo faltando ou formato errado)`); ruins++; continue; }
    const passosAntes = Array.isArray((bruto as { passos?: unknown[] }).passos) ? (bruto as { passos: unknown[] }).passos.length : 0;
    const visuaisPerdidos = (bruto as { passos?: { visual?: unknown }[] }).passos?.filter((p, i) => p?.visual && !valida.passos[i]?.visual).length ?? 0;
    const problemas = problemasDaExplicacao(valida, q.enunciado, q.materia);
    if (valida.passos.length < passosAntes) problemas.push(`o validador cortou ${passosAntes - valida.passos.length} passo(s)`);
    if (visuaisPerdidos) problemas.push(`${visuaisPerdidos} desenho(s) recusado(s) pelo validador`);
    if (problemas.length) { console.log(`⚠ ${q.origem} ${id}: ${problemas.join('; ')}`); ruins++; continue; }
    ok++;
    if (gravar) {
      const dados = { versao: VERSAO_EXPLICACAO, conteudo: valida as object, revisada: true, problemas: null, modelo: MODELO };
      await prisma.explicacaoPronta.upsert({ where: { questionId: id }, create: { questionId: id, ...dados }, update: dados });
    }
  }
  console.log(`\n${ok} ok · ${ruins} com problema${gravar ? ` · ${ok} gravadas` : ' · nada gravado (use --gravar)'}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
