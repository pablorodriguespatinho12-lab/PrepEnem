export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAbacusApiKey, AI_UNAVAILABLE_MESSAGE, chatCompletion } from '@/lib/ai-client';

const PART_LABELS: Record<string, string> = {
  introducao: 'Introdução',
  desenvolvimento1: 'Desenvolvimento 1',
  desenvolvimento2: 'Desenvolvimento 2',
  conclusao: 'Conclusão',
};

const PART_INSTRUCTIONS: Record<string, string> = {
  introducao:
    'Você precisa escrever a INTRODUÇÃO da redação. Apresente o tema, contextualize-o e formule sua tese (aproximadamente 4-6 linhas).',
  desenvolvimento1:
    'Você precisa escrever o DESENVOLVIMENTO 1. Apresente o primeiro argumento que sustenta a tese da introdução, usando dados, fatos históricos, exemplos ou citações (8-10 linhas).',
  desenvolvimento2:
    'Você precisa escrever o DESENVOLVIMENTO 2. Apresente o segundo argumento, diferente do primeiro, conectado com a tese (8-10 linhas).',
  conclusao:
    'Você precisa escrever a CONCLUSÃO com proposta de intervenção: retome a tese, sintetize os argumentos e proponha agente, ação, meio/modo, finalidade e detalhamento (6-8 linhas).',
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { partType, templateId } = body;
    if (!PART_LABELS[partType]) {
      return NextResponse.json({ error: 'Tipo de parte inválido' }, { status: 400 });
    }

    // If specific template requested, use it
    if (templateId) {
      const tpl = await prisma.essayPartTemplate.findUnique({ where: { id: templateId } });
      if (tpl && tpl.partType === partType) {
        return NextResponse.json({
          tema: tpl.tema,
          textosMotivadores: tpl.textoMotivador,
          textoBase: tpl.textoBase,
          instrucao: PART_INSTRUCTIONS[partType],
          partType,
          partLabel: PART_LABELS[partType],
          templateId: tpl.id,
        });
      }
    }

    // Get random active template from DB
    const templates = await prisma.essayPartTemplate.findMany({
      where: { partType, isActive: true },
    });

    if (templates.length > 0) {
      const tpl = templates[Math.floor(Math.random() * templates.length)];
      return NextResponse.json({
        tema: tpl.tema,
        textosMotivadores: tpl.textoMotivador,
        textoBase: tpl.textoBase,
        instrucao: PART_INSTRUCTIONS[partType],
        partType,
        partLabel: PART_LABELS[partType],
        templateId: tpl.id,
      });
    }

    // Fallback: AI generation if no templates exist
    const apiKey = getAbacusApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: `${AI_UNAVAILABLE_MESSAGE} Nenhuma proposta pré-pronta disponível para este tipo no momento.` },
        { status: 503 }
      );
    }

    const partInstruction: Record<string, string> = {
      introducao:
        'Forneça o TEMA e os TEXTOS MOTIVADORES. No textoBase, inclua o restante da redação (DESENVOLVIMENTO 1, DESENVOLVIMENTO 2 e CONCLUSÃO) já escritos para que o aluno veja o contexto e crie a INTRODUÇÃO.',
      desenvolvimento1:
        'Forneça o tema, textos motivadores. No textoBase: a INTRODUÇÃO já escrita + DESENVOLVIMENTO 2 já escrito + CONCLUSÃO já escrita. O aluno escreverá o DESENVOLVIMENTO 1.',
      desenvolvimento2:
        'Forneça o tema, textos motivadores. No textoBase: a INTRODUÇÃO já escrita + DESENVOLVIMENTO 1 já escrito + CONCLUSÃO já escrita. O aluno escreverá o DESENVOLVIMENTO 2.',
      conclusao:
        'Forneça o tema, textos motivadores. No textoBase: a INTRODUÇÃO já escrita + DESENVOLVIMENTO 1 já escrito + DESENVOLVIMENTO 2 já escrito. O aluno escreverá a CONCLUSÃO.',
    };

    const prompt = `Você é um especialista em redação ENEM. ${partInstruction[partType]}

IMPORTANTE:
- Tema atual estilo ENEM (assuntos sociais, ambientais, tecnológicos, culturais)
- Textos motivadores: 3 textos curtos e informativos (citação de autor, dado estatístico, contexto histórico) em único bloco com "Texto I", "Texto II", "Texto III"
- As partes já escritas: qualidade boa (nota ~700-800), didáticas, com argumentação clara
- Tudo em português brasileiro formal

Retorne JSON:
{
  "tema": "...",
  "textosMotivadores": "...",
  "textoBase": "..."
}
Apenas JSON válido.`;

    const result = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 5000,
      temperature: 0.8,
      responseFormat: { type: 'json_object' },
    });
    if (!result.ok) return result.response;

    const raw = result.data?.choices?.[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      tema: parsed.tema ?? 'Tema ENEM',
      textosMotivadores: parsed.textosMotivadores ?? '',
      textoBase: parsed.textoBase ?? '',
      instrucao: PART_INSTRUCTIONS[partType],
      partType,
      partLabel: PART_LABELS[partType],
    });
  } catch (error: any) {
    console.error('Generate essay part error:', error);
    return NextResponse.json({ error: 'Erro ao gerar exercício' }, { status: 500 });
  }
}
