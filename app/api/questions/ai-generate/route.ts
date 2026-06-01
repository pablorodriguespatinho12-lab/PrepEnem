export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MATERIAS_VALIDAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { materia, subtema, dificuldade = 'medio', quantidade = 5, save = true } = await req.json();
    if (!materia || !MATERIAS_VALIDAS.includes(materia)) {
      return NextResponse.json({ error: 'Matéria inválida' }, { status: 400 });
    }
    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });

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

    const llmResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 8000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      console.error('AI gen LLM error:', errText);
      return NextResponse.json({ error: 'Erro ao gerar questões com IA' }, { status: 500 });
    }
    const data = await llmResponse.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    let questoes: any[] = [];
    try {
      const parsed = JSON.parse(raw);
      questoes = parsed?.questoes ?? parsed ?? [];
    } catch (e) {
      console.error('Parse error:', raw.substring(0, 300));
      return NextResponse.json({ error: 'Erro ao interpretar questões geradas' }, { status: 500 });
    }

    const saved: any[] = [];
    for (const q of questoes) {
      try {
        let resposta = (q.respostaCorreta ?? 'A').toUpperCase();
        if (!['A','B','C','D','E'].includes(resposta)) resposta = 'A';
        let dif = (q.dificuldade ?? dificuldade).toLowerCase();
        if (!['facil','medio','dificil'].includes(dif)) dif = dificuldade;

        if (save) {
          const created = await prisma.question.create({
            data: {
              enunciado: q.enunciado ?? 'Questão',
              alternativaA: q.alternativaA ?? 'N/A',
              alternativaB: q.alternativaB ?? 'N/A',
              alternativaC: q.alternativaC ?? 'N/A',
              alternativaD: q.alternativaD ?? 'N/A',
              alternativaE: q.alternativaE ?? 'N/A',
              respostaCorreta: resposta,
              materia,
              subtema: q.subtema ?? subtema ?? 'Geral',
              dificuldade: dif,
              explicacao: q.explicacao ?? null,
              origem: 'IA Gerada',
            },
          });
          saved.push(created);
        } else {
          saved.push({ ...q, id: `ai-${Date.now()}-${Math.random()}`, materia, dificuldade: dif, respostaCorreta: resposta, origem: 'IA Gerada' });
        }
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
