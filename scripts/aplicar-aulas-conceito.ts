import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readdirSync, readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { lousaDoAntigo } from '../lib/aula-lousa/do-antigo';
import { validarLousa } from '../lib/aula-lousa/validar';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Aulas sem equação (Biologia, Química e as conceituais de Matemática e Física): ideia + passos viram lousa.
// Cada <pasta>/saida/<id>.json = { ideia, passos, resposta }. A letra foi achada sem ver o gabarito e tem de bater.
// Só CRIA aula onde não existe. Uso: DB_CONFIRMED=1 npx tsx scripts/aplicar-aulas-conceito.ts <pasta> [--gravar]

const MAX_PASSOS = 6;
const prisma = new PrismaClient();
type Saida = { ideia?: string; passos?: { titulo?: string; texto?: string; visual?: unknown }[]; resposta?: string; duvida?: string };

async function main() {
  const pasta = process.argv[2];
  const gravar = process.argv.includes('--gravar');
  if (!pasta) throw new Error('faltou a pasta');
  const aprovadas: { id: string; conteudo: object }[] = [];
  for (const arq of readdirSync(`${pasta}/saida`).filter((f) => f.endsWith('.json'))) {
    const id = arq.replace(/\.json$/, '');
    const s = JSON.parse(readFileSync(`${pasta}/saida/${arq}`, 'utf8')) as Saida;
    const q = await prisma.question.findUnique({ where: { id } });
    const jaTem = await prisma.explicacaoPronta.findUnique({ where: { questionId: id } });
    if (!q || jaTem) { console.log(`${id}: ✗ ${q ? 'já tem aula' : 'questão não existe'}`); continue; }
    if (!s.ideia || !s.passos?.length) { console.log(`${id}: ✗ sem ideia ou passos (${s.duvida ?? '?'})`); continue; }
    const erros: string[] = [];
    if (s.resposta !== q.respostaCorreta) erros.push('a letra não bate com o gabarito');
    const ultimo = s.passos[s.passos.length - 1];
    if (!new RegExp(`^Letra ${q.respostaCorreta}\\b`).test(String(ultimo?.texto ?? ''))) erros.push('o último passo não começa com a letra certa');
    if (s.passos.length > MAX_PASSOS) erros.push(`passos demais (${s.passos.length})`);
    const explicacao = validarExplicacao({ ideia: s.ideia, pecas: [], seuErro: null, passos: s.passos }, q.materia);
    if (!explicacao) erros.push('o validador do site recusou');
    const alternativas = [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x);
    const r = lousaDoAntigo({ enunciado: q.enunciado, alternativas, tema: q.tema, ideia: s.ideia, passos: s.passos });
    const aula = r.ok ? validarLousa(r.aula) : null;
    if (!r.ok) erros.push(`lousa: ${r.motivo}`);
    else if (!aula || aula.cenas.length !== r.aula.cenas.length) erros.push('o porteiro da lousa cortou tela');
    if (erros.length || !explicacao || !aula) { console.log(`${id}: ✗ ${erros.join(' · ')}`); continue; }
    aprovadas.push({ id, conteudo: { ...(explicacao as object), lousa: aula } });
  }
  console.log(`aprovadas: ${aprovadas.length}`);
  if (!gravar) { console.log('Simulação: nada gravado.'); return; }
  for (const a of aprovadas) {
    await prisma.explicacaoPronta.create({ data: { questionId: a.id, versao: VERSAO_EXPLICACAO, conteudo: a.conteudo, revisada: true, problemas: null, modelo: 'escrita na sessão' } });
  }
  console.log(`Gravadas: ${aprovadas.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
