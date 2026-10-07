export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { gerarQuestoesConferidas } from '@/lib/questoes-geradas';

const MATERIAS_VALIDAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

const MAX_QUANTIDADE = 10;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { materia, subtema, dificuldade = 'medio', quantidade: pedida = 5, save = true } = await req.json();
    // Sem teto, "quantidade: 500" ia direto para o prompt (custo e banco cheio).
    const quantidade = Math.min(Math.max(Number.parseInt(String(pedida), 10) || 5, 1), MAX_QUANTIDADE);
    if (!materia || !MATERIAS_VALIDAS.includes(materia)) {
      return NextResponse.json({ error: 'Matéria inválida' }, { status: 400 });
    }
    const isFisicaMat = ['Física', 'Matemática'].includes(materia);
    const formulaInstruction = isFisicaMat
      ? '\nSEMPRE inclua na explicação: (1) a fórmula relevante; (2) substituição numérica passo a passo.'
      : '';

    const prompt = `Gere ${quantidade} questões objetivas estilo ENEM, com 5 alternativas (A-E), sobre:
- Matéria: ${materia}
- Subtema: ${subtema || 'variado'}
- Dificuldade: ${dificuldade}

Cada questão deve ter:
- enunciado: contexto + pergunta (estilo ENEM, com texto de apoio quando apropriado)
- alternativaA-E: 5 alternativas plausíveis, apenas 1 correta
- respostaCorreta: letra A-E
- subtema: subtema específico
- dificuldade: "${dificuldade}"
- explicacao: explicação didática do porquê da resposta correta${formulaInstruction}

Retorne JSON: {"questoes":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","subtema":"...","dificuldade":"${dificuldade}","explicacao":"..."}]}
Retorne SOMENTE JSON, sem markdown.`;

    // Validada e conferida por outro modelo (lib/questoes-geradas.ts); antes
    // o gabarito inválido virava 'A' e ia para o banco de todos.
    const questoes = await gerarQuestoesConferidas(prompt, 40_000);
    if (questoes.length === 0) {
      return NextResponse.json({ error: 'A IA não gerou questões conferidas agora. Tente de novo.' }, { status: 502 });
    }
    const saved: any[] = [];
    for (const q of questoes) {
      const dados = { ...q, materia, subtema: q.subtema ?? subtema ?? 'Geral', dificuldade: q.dificuldade ?? dificuldade, origem: 'IA Gerada', geradaPorIA: true };
      if (!save) {
        saved.push({ ...dados, id: `ai-${Date.now()}-${saved.length}` });
        continue;
      }
      try {
        saved.push(await prisma.question.create({ data: dados }));
      } catch (e: any) {
        console.error('Save error:', e.message);
      }
    }
    return NextResponse.json({ questoes: saved, total: saved.length });
  } catch (error: any) {
    console.error('AI generate error:', error);
    return NextResponse.json({ error: 'Erro ao gerar questões' }, { status: 500 });
  }
}
