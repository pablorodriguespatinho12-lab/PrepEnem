/* Mede a taxa de erro de conteúdo das explicações antes e depois da segunda
   IA conferir (lib/tutor/conferir.ts). Só leitura no banco; não grava cache.
   Para cada questão: gera, confere (verificador), corrige se preciso e confere
   de novo a versão final. Grava uma linha JSON por questão para leitura humana:
   a conferência é o juiz aqui, então os casos marcados precisam ser lidos.

   Uso: DB_CONFIRMED=1 npx tsx --env-file=.env scripts/medir-conferencia.mts [quantas=50] [saida.jsonl] */
import { appendFileSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { promptExplicacao, textoDaQuestao, type QuestaoParaTutor } from '../lib/tutor/prompts';
import { validarExplicacao, type Explicacao } from '../lib/tutor/validar';
import { explicarConferido, promptConferencia, textoParaConferir, validarConferencia, type ErroDeConteudo } from '../lib/tutor/conferir';
import { pedirJson, type ResultadoIA } from '../lib/pedir-json';
import { MODELO_IA } from '../lib/ia-modelos';

const QUANTAS = Number(process.argv[2] ?? 50);
const SAIDA = process.argv[3] ?? 'medir-conferencia.jsonl';
const POR_MATERIA_MAX = 300;

type QuestaoMedida = QuestaoParaTutor & { id: string };

async function escolher(): Promise<QuestaoMedida[]> {
  const prisma = new PrismaClient();
  const questoes = await prisma.question.findMany({
    where: { origem: { contains: 'ENEM' }, dependeImagem: false, geradaPorIA: false },
    take: POR_MATERIA_MAX * 4,
    orderBy: { id: 'asc' },
  });
  await prisma.$disconnect();
  // Revezamento por matéria: 50 questões espalhadas, não 50 de Português.
  const filas = new Map<string, typeof questoes>();
  for (const q of questoes) filas.set(q.materia, [...(filas.get(q.materia) ?? []), q]);
  const escolhidas: typeof questoes = [];
  for (let i = 0; escolhidas.length < QUANTAS; i++) {
    const rodada = [...filas.values()].map((f) => f[i]).filter(Boolean);
    if (rodada.length === 0) break;
    escolhidas.push(...rodada);
  }
  return escolhidas.slice(0, QUANTAS).map((q) => ({
    id: q.id,
    enunciado: q.enunciado,
    alternativas: { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE },
    respostaCorreta: q.respostaCorreta,
    respostaDada: (['A', 'B', 'C', 'D', 'E'] as const).find((l) => l !== q.respostaCorreta) ?? null,
    materia: q.materia,
    subtema: q.subtema,
  }));
}

async function main() {
  writeFileSync(SAIDA, '');
  const questoes = await escolher();
  const totais = { questoes: 0, falhou: 0, marcadasAntes: 0, corrigidas: 0, marcadasDepois: 0 };
  for (const q of questoes) {
    const gerar = (p: string) => pedirJson(p, (b) => validarExplicacao(b, q.materia), { maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000 });
    const conferir = (e: Explicacao) => pedirJson(promptConferencia(textoDaQuestao(q), e), validarConferencia, { maxTokens: 1500, temperature: 0, modelo: MODELO_IA.verificacao() });
    let primeira: Explicacao | null = null;
    let errosAntes: ErroDeConteudo[] | null = null;
    const inicio = Date.now();
    const final: ResultadoIA<Explicacao> = await explicarConferido(
      promptExplicacao(q),
      async (p) => { const r = await gerar(p); if (r.ok && !primeira) primeira = r.dado; return r; },
      async (e) => { const r = await conferir(e); if (r.ok) errosAntes = r.dado; return r; },
    );
    totais.questoes++;
    if (!final.ok || !primeira) { totais.falhou++; appendFileSync(SAIDA, JSON.stringify({ id: q.id, materia: q.materia, falhou: final.ok ? 'sem primeira' : final.erro }) + '\n'); continue; }
    const mudou = final.dado !== primeira;
    const depois = mudou ? await conferir(final.dado) : null;
    const errosDepois = depois?.ok ? depois.dado : mudou ? null : errosAntes;
    if ((errosAntes ?? []).length > 0) totais.marcadasAntes++;
    if (mudou) totais.corrigidas++;
    if ((errosDepois ?? []).length > 0) totais.marcadasDepois++;
    appendFileSync(SAIDA, JSON.stringify({
      id: q.id, materia: q.materia, subtema: q.subtema, segundos: Math.round((Date.now() - inicio) / 1000),
      correta: q.respostaCorreta, errosAntes, errosDepois,
      primeira: textoParaConferir(primeira), final: mudou ? textoParaConferir(final.dado) : null,
    }) + '\n');
    console.log(`${totais.questoes}/${questoes.length} ${q.materia}: antes ${errosAntes?.length ?? '?'} erro(s), ${mudou ? 'corrigida' : 'mantida'}, depois ${errosDepois?.length ?? '?'}`);
  }
  console.log('TOTAIS', JSON.stringify(totais));
}

main().catch((e) => { console.error(e); process.exit(1); });
