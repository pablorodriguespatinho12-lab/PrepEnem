// Testa a explicação do tutor contra questões reais do ENEM, só leitura no banco.
// Uso: npx tsx --env-file=.env scripts/testar-tutor.ts [quantas=3] [materia]
// Imprime a explicação e mede o que dá para medir sem ler: tempo, passos,
// frases longas, emoji e frases proibidas (decisoes-prepenem).

import { PrismaClient } from '@prisma/client';
import { promptExplicacao, type QuestaoParaTutor } from '../lib/tutor/prompts';
import { validarExplicacao, type Explicacao } from '../lib/tutor/validar';
import { pedirJson } from '../lib/pedir-json';
import { MODELO_IA } from '../lib/ia-modelos';

const QUANTAS = Number(process.argv[2] ?? 3);
const MATERIA = process.argv[3];
const MAX_PALAVRAS_FRASE = 20;
const PROIBIDAS = [/é importante notar/i, /vale ressaltar/i, /vamos analisar/i, /ótima pergunta/i, /muito bem/i, /parabéns/i];
const EMOJI = /\p{Extended_Pictographic}/u;

function frasesLongas(texto: string): string[] {
  return texto
    .replace(/\$[^$]*\$/g, 'X')
    .split(/(?<=[.!?])\s+/)
    .filter((f) => f.split(/\s+/).length > MAX_PALAVRAS_FRASE);
}

function medir(e: Explicacao) {
  const textos = [e.ideia, e.seuErro ?? '', ...e.passos.flatMap((p) => [p.titulo, p.texto]), e.checagem?.pergunta ?? ''];
  const tudo = textos.join(' ');
  return {
    passos: e.passos.length,
    comVisual: e.passos.filter((p) => p.visual).length,
    primeiroTemVisual: Boolean(e.passos[0]?.visual),
    frasesLongas: textos.flatMap(frasesLongas).length,
    emoji: EMOJI.test(tudo),
    proibidas: PROIBIDAS.filter((r) => r.test(tudo)).map(String),
    deOndeVem: e.passos.some((p) => /^de onde vem/i.test(p.titulo)),
  };
}

async function main() {
const prisma = new PrismaClient();
const questoes = await prisma.question.findMany({
  where: { origem: { contains: 'ENEM' }, dependeImagem: false, geradaPorIA: false, ...(MATERIA ? { materia: MATERIA } : {}) },
  take: 40,
  orderBy: { id: 'asc' },
});
await prisma.$disconnect();

// Espalha por matéria para não testar 3 de Português.
const porMateria = new Map<string, typeof questoes[number]>();
for (const q of questoes) if (!porMateria.has(q.materia)) porMateria.set(q.materia, q);
const escolhidas = [...porMateria.values(), ...questoes].filter((q, i, a) => a.indexOf(q) === i).slice(0, QUANTAS);

for (const q of escolhidas) {
  const errada = (['A', 'B', 'C', 'D', 'E'] as const).find((l) => l !== q.respostaCorreta) ?? null;
  const entrada: QuestaoParaTutor = {
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta,
    respostaDada: errada,
    materia: q.materia,
    subtema: q.subtema,
  };
  const inicio = Date.now();
  const r = await pedirJson(promptExplicacao(entrada), validarExplicacao, {
    maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000,
  });
  const segundos = ((Date.now() - inicio) / 1000).toFixed(1);
  console.log(`\n===== ${q.materia} — ${q.subtema} (${q.id}) — ${segundos}s`);
  console.log(`Enunciado: ${q.enunciado.slice(0, 300).replace(/\s+/g, ' ')}...`);
  if (!r.ok) { console.log('FALHOU:', r.status, r.erro); continue; }
  const e = r.dado;
  console.log('Ideia:', e.ideia);
  if (e.seuErro) console.log('Seu erro:', e.seuErro);
  e.passos.forEach((p, i) => console.log(`  ${i + 1}. [${p.titulo}]${p.visual ? ` (visual: ${(p.visual as { tipo?: string }).tipo})` : ''} ${p.texto}`));
  console.log('Checagem:', e.checagem?.pergunta, '→', e.checagem?.resposta);
  console.log('MEDIDAS:', JSON.stringify(medir(e)));
}
}

main().catch((e) => { console.error(e); process.exit(1); });
