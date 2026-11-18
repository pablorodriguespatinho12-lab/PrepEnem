import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Leva ao banco as aulas no jeito do robô de questões que já existem
// (data/revisao-final/aulas-escada/<materia>.json, feito por aplicar_aulas_escada.py).
// Junta com a explicação pronta que já havia (troca passos e o que a ficha trouxer);
// questão sem explicação precisa trazer ideia, conferência e "Sua vez".
// Uso:
//   DB_CONFIRMED=1 npx tsx scripts/gravar-aulas-escada.ts --dump <ids.json> <saida.json>   (lista para o .py)
//   DB_CONFIRMED=1 npx tsx scripts/gravar-aulas-escada.ts <aulas.json> [--gravar]

const prisma = new PrismaClient();
const MODELO = 'claude-opus-5-5 (escrita na sessão)';
type Parcial = { explicacao: Record<string, unknown>; enunciado?: string; alternativa?: [string, string] };
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

async function dump(idsArquivo: string, saida: string) {
  const ids: string[] = JSON.parse(readFileSync(idsArquivo, 'utf8'));
  const qs = await prisma.question.findMany({ where: { id: { in: ids } } });
  writeFileSync(saida, JSON.stringify(qs.map((q) => ({
    id: q.id, A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE, resposta: q.respostaCorreta,
  })), null, 1));
  console.log(`${qs.length} de ${ids.length} questões no dump.`);
}

async function gravar(arquivo: string, deVerdade: boolean) {
  const aulas: Record<string, Parcial> = JSON.parse(readFileSync(arquivo, 'utf8'));
  const ids = Object.keys(aulas);
  const qs = await prisma.question.findMany({ where: { id: { in: ids } }, include: { explicacaoPronta: true } });
  const prontas: { id: string; conteudo: object; enunciado?: string; alternativa?: [string, string] }[] = [];
  const erros: string[] = [];
  for (const id of ids) {
    const q = qs.find((x) => x.id === id);
    if (!q) { erros.push(`${id}: não está no banco`); continue; }
    const antes = (q.explicacaoPronta?.conteudo as Record<string, unknown> | undefined) ?? { pecas: [], seuErro: null };
    const junto = { ...antes, ...aulas[id].explicacao };
    const valida = validarExplicacao(junto, q.materia);
    const passos = (junto.passos as unknown[]).length;
    if (!valida) erros.push(`${id}: explicação recusada pelo validador`);
    else if (valida.passos.length < passos) erros.push(`${id}: o validador cortou ${passos - valida.passos.length} passo(s)`);
    else if (aulas[id].alternativa && !LETRAS.includes(aulas[id].alternativa![0])) erros.push(`${id}: letra inválida na alternativa`);
    else prontas.push({ id, conteudo: valida as object, enunciado: aulas[id].enunciado, alternativa: aulas[id].alternativa });
  }
  if (erros.length) throw new Error(`Nada gravado:\n${erros.join('\n')}`);
  console.log(`${prontas.length} aulas conferidas (${prontas.filter((p) => p.enunciado || p.alternativa).length} com texto restaurado).`);
  if (!deVerdade) return console.log('Nada gravado (use --gravar).');
  for (const p of prontas) {
    const explicacao = { versao: VERSAO_EXPLICACAO, conteudo: p.conteudo, revisada: true, problemas: null, modelo: MODELO };
    await prisma.explicacaoPronta.upsert({ where: { questionId: p.id }, create: { questionId: p.id, ...explicacao }, update: explicacao });
    if (p.enunciado) await prisma.question.update({ where: { id: p.id }, data: { enunciado: p.enunciado } });
    if (p.alternativa) await prisma.question.update({ where: { id: p.id }, data: { [`alternativa${p.alternativa[0]}`]: p.alternativa[1] } });
  }
  console.log(`Gravadas: ${prontas.length}.`);
}

const args = process.argv.slice(2);
(args[0] === '--dump' ? dump(args[1], args[2]) : gravar(args[0], args.includes('--gravar')))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
