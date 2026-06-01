export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
    }

    let body: any = {};
    try { body = await req.json(); } catch { /* empty body */ }
    const { subtemas } = body;
    // subtemas: Array<{ materia: string, subtema: string }>
    if (!subtemas || !Array.isArray(subtemas) || subtemas.length === 0) {
      return NextResponse.json({ error: 'Subtemas não informados' }, { status: 400 });
    }

    // Dedupe and limit
    const unique = Array.from(new Map(subtemas.map((s: any) => [`${s.materia}::${s.subtema}`, s])).values()).slice(0, 8);

    const subtemasText = unique.map((s: any, i: number) => `${i + 1}. ${s.materia} — ${s.subtema}`).join('\n');

    const prompt = `Você é um professor preparador para o ENEM. O estudante vai treinar questões sobre os seguintes assuntos:

${subtemasText}

Para CADA assunto, gere um RESUMO conceitual compacto e didático com:
- **Conceitos-chave** (3-5 bullet points com as ideias principais)
- **Fórmulas importantes** (para Matemática, Física e Química — usando notação clara como S = S₀ + v₀t + ½·a·t²)
- **Dica ENEM** (1 frase sobre como o tema costuma cair no ENEM)
- **image_suggestion** (em INGLÊS: descreva uma imagem/diagrama educativo que ajudaria a visualizar o conceito, ex: "periodic table of elements with group highlights", "human digestive system anatomy diagram", "kinematic motion graph with velocity and acceleration")

Retorne JSON:
{"resumos": [{"materia": "...", "subtema": "...", "conceitos": ["..."], "formulas": ["..."], "dica_enem": "...", "image_suggestion": "..."}]}
Retorne SOMENTE JSON, sem markdown.`;

    const llmRes = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.5,
        response_format: { type: 'json_object' },
      }),
    });

    if (!llmRes.ok) {
      const txt = await llmRes.text();
      console.error('Resumo LLM error:', txt.substring(0, 300));
      return NextResponse.json({ error: 'Erro ao gerar resumo com IA' }, { status: 500 });
    }

    const data = await llmRes.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json(parsed);
    } catch (e) {
      console.error('Resumo parse error');
      return NextResponse.json({ error: 'Erro ao interpretar resumo' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Resumo error:', error);
    return NextResponse.json({ error: 'Erro ao gerar resumo' }, { status: 500 });
  }
}
