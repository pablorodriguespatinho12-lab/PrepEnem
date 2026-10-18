/* Monta a "jornada" de um aluno novo: o texto que ele leria no PrepEnem num
   primeiro dia, na ordem da tela. Quem lê é o agente aluno-do-zero.

   Rodar contra o build de produção, com sessão (ver verificacao-local):
     DB_CONFIRMED=1 PREPENEM_TOKEN=... npx tsx scripts/jornada-do-aluno.mts saida.md

   Só lê o banco. As rotas de IA guardam cache, como no uso normal; nada
   grava resposta nem progresso na conta. */
import nextEnv from '@next/env';
import { writeFileSync } from 'node:fs';

nextEnv.loadEnvConfig(process.cwd());
const { PrismaClient } = await import('@prisma/client');

const BASE = process.env.PREPENEM_URL ?? 'http://localhost:3000';
const TOKEN = process.env.PREPENEM_TOKEN;
const SAIDA = process.argv[2] ?? 'jornada.md';
if (!TOKEN) throw new Error('Falta PREPENEM_TOKEN');

/* Primeiro nível de cada matéria (lib/learning-order.ts e o banco). */
const ASSUNTOS = [
  { materia: 'Matemática', subtemas: ['Porcentagem', 'Razão e Proporção', 'Aritmética'] },
  { materia: 'Física', subtemas: ['Cinemática', 'MRU e MRUV', 'Movimento Retilíneo'] },
  { materia: 'Química', subtemas: ['Estequiometria', 'Atomística', 'Propriedades da matéria'] },
  { materia: 'Biologia', subtemas: ['Citologia', 'Ecologia', 'Bioquímica'] },
];
const QUESTOES_POR_MATERIA = 2;
const LICOES_CALCULO = ['p1', 'p2'];
/* A Groq gratuita dá 8 mil tokens por minuto por modelo; uma explicação gasta
   ~6.700. Sem pausa, a jornada estoura a cota e mede o 429, não o ensino.
   Um aluno de verdade leva mais que isso em cada questão. */
const PAUSA_ENTRE_IA_MS = Number(process.env.PAUSA_MS ?? 30_000);
const pausa = () => new Promise((r) => setTimeout(r, PAUSA_ENTRE_IA_MS));

async function chamar(rota: string, corpo?: unknown): Promise<unknown> {
  const r = await fetch(BASE + rota, {
    method: corpo ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', Cookie: `__Secure-next-auth.session-token=${TOKEN}` },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) return { erro: `${r.status} ${JSON.stringify(json).slice(0, 200)}` };
  return json;
}

/* O aluno vê o desenho; aqui ele vira uma linha com o tipo e os rótulos. */
function desenho(v: unknown): string {
  if (!v || typeof v !== 'object') return '';
  const json = JSON.stringify(v);
  return `\n  [desenho ${(v as { tipo?: string }).tipo ?? '?'}: ${json.length > 400 ? json.slice(0, 400) + '…' : json}]`;
}
type Passo = { titulo: string; texto: string; visual?: unknown };
const passos = (lista: Passo[] | undefined) =>
  (lista ?? []).map((p, i) => `${i + 1}. **${p.titulo}** — ${p.texto}${desenho(p.visual)}`).join('\n');

const linhas: string[] = ['# Jornada do aluno novo (o que a tela mostra, em ordem)\n'];
const p = new PrismaClient();

// 1. Revisão de conceitos do dia: um assunto por matéria.
const assuntosDoDia: { materia: string; subtema: string }[] = [];
const questoes = [];
for (const a of ASSUNTOS) {
  const achadas = await p.question.findMany({
    where: { materia: a.materia, subtema: { in: a.subtemas }, dependeImagem: false, nivel: { in: ['facil', 'medio'] } },
    take: QUESTOES_POR_MATERIA, orderBy: { id: 'asc' },
  });
  if (achadas[0]) assuntosDoDia.push({ materia: a.materia, subtema: achadas[0].subtema });
  questoes.push(...achadas);
}
await p.$disconnect();

linhas.push('## Parte 1 — Revisão de conceitos (antes da primeira questão)\n');
const resumo = (await chamar('/api/treino/resumo', { subtemas: assuntosDoDia })) as { resumos?: Record<string, unknown>[]; erro?: string };
if (resumo.erro) linhas.push(`ERRO NA TELA: ${resumo.erro}\n`);
for (const r of resumo.resumos ?? []) {
  linhas.push(`### ${r.materia} — ${r.subtema}`,
    `O que é: ${r.oQueE}`,
    `Antes, saiba:\n${passos(r.antes as Passo[])}`,
    `A ideia: ${r.ideia}`,
    `Como se constrói:\n${passos(r.construcao as Passo[])}`,
    `Regra: ${r.regra}`, `No ENEM: ${r.dicaEnem}\n`);
}

// 2. Questões: o aluno erra (marca a primeira errada) e lê a explicação.
linhas.push('## Parte 2 — Questões do treino (o aluno errou cada uma)\n');
for (const [i, q] of questoes.entries()) {
  const alternativas = { A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE };
  const errada = (['A', 'B', 'C', 'D', 'E'] as const).find((l) => l !== q.respostaCorreta)!;
  linhas.push(`### Questão ${i + 1} — ${q.materia} / ${q.subtema}`, q.enunciado,
    ...Object.entries(alternativas).map(([l, t]) => `${l}) ${t}`),
    `(marcou ${errada}; correta ${q.respostaCorreta})\n`);
  await pausa();
  const r = (await chamar('/api/tutor/explicacao', { enunciado: q.enunciado, alternativas, respostaCorreta: q.respostaCorreta, respostaDada: errada, materia: q.materia, subtema: q.subtema })) as { explicacao?: Record<string, unknown>; erro?: string };
  if (r.erro || !r.explicacao) { linhas.push(`ERRO NA TELA: ${r.erro}\n`); continue; }
  const e = r.explicacao;
  linhas.push(`Onde seu raciocínio desviou: ${e.seuErro ?? '(nada)'}`,
    `Peças: ${((e.pecas as { termo: string; significado: string }[]) ?? []).map((x) => `${x.termo} = ${x.significado}`).join(' | ') || '(nenhuma)'}`,
    `A ideia: ${e.ideia}`, `Passos:\n${passos(e.passos as Passo[])}`,
    `Para fixar: ${(e.checagem as { pergunta?: string } | null)?.pergunta ?? '(nada)'}\n`);
}

// 3. Trilha de Cálculo: as primeiras lições.
linhas.push('## Parte 3 — Trilha de Cálculo, primeiras lições\n');
for (const id of LICOES_CALCULO) {
  await pausa();
  const r = (await chamar(`/api/calculo/licao/${id}`)) as { licao?: Record<string, unknown>; erro?: string } & Record<string, unknown>;
  const l = (r.licao ?? r) as Record<string, unknown>;
  const c = l.conteudo as Record<string, unknown> | undefined;
  if (!c) { linhas.push(`### ${id}\nERRO NA TELA: ${r.erro ?? JSON.stringify(r).slice(0, 200)}\n`); continue; }
  const g = c.gancho as { pergunta: string; ideia: string };
  linhas.push(`### ${l.titulo}`, `Pergunta: ${g.pergunta}`, `Ideia: ${g.ideia}`,
    `Construção:\n${passos(c.construcao as Passo[])}`, `Resumo: ${c.resumo}`);
  for (const ex of (c.exemplos as { enunciado: string; passos: { texto: string; porque?: string }[] }[]) ?? []) {
    linhas.push(`Exemplo: ${ex.enunciado}\n${ex.passos.map((s) => `- ${s.texto}${s.porque ? ` (porque: ${s.porque})` : ''}`).join('\n')}`);
  }
  for (const ex of (c.exercicios as { enunciado: string; dica: string }[]) ?? []) {
    linhas.push(`Exercício: ${ex.enunciado} (dica: ${ex.dica})`);
  }
  linhas.push('');
}

writeFileSync(SAIDA, linhas.join('\n'));
console.log(`jornada: ${SAIDA} (${questoes.length} questões, ${resumo.resumos?.length ?? 0} conceitos, ${LICOES_CALCULO.length} lições)`);
