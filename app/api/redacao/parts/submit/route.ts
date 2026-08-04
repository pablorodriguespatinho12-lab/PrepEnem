export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { chatCompletion } from '@/lib/ai-client';

const PART_LABELS: Record<string, string> = {
  introducao: 'Introdução',
  desenvolvimento1: 'Desenvolvimento 1',
  desenvolvimento2: 'Desenvolvimento 2',
  conclusao: 'Conclusão',
};

const PART_CRITERIA: Record<string, string> = {
  introducao: `Avalie a INTRODUÇÃO do aluno nos seguintes critérios:
1. Contextualização do tema (apresentou o assunto de forma clara?)
2. Tese (formulou uma tese/ponto de vista claro?)
3. Repertório sociocultural (usou alguma referência?)
4. Coerência com o tema proposto
5. Domínio da norma culta`,
  desenvolvimento1: `Avalie o DESENVOLVIMENTO 1 do aluno:
1. Apresentação do argumento (claro e bem definido?)
2. Fundamentação (usou dados, exemplos, citações?)
3. Coerência com a tese da introdução
4. Progessão textual (as ideias avançam logicamente?)
5. Domínio da norma culta`,
  desenvolvimento2: `Avalie o DESENVOLVIMENTO 2 do aluno:
1. Novo argumento (diferente do D1?)
2. Fundamentação com repertório
3. Coerência com tese e D1
4. Aprofundamento do tema
5. Domínio da norma culta`,
  conclusao: `Avalie a CONCLUSÃO do aluno:
1. Proposta de intervenção (tem agente, ação, meio, efeito, detalhamento?)
2. Retomada da tese
3. Coerência com os argumentos apresentados
4. Viabilidade da proposta
5. Domínio da norma culta`,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { partType, tema, textoBase, resposta } = await request.json();
    if (!PART_LABELS[partType] || !resposta?.trim()) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const prompt = `Você é um corretor de redação ENEM especialista. 

TEMA: ${tema}

TEXTO BASE (partes já escritas):
${textoBase || '(Nenhum — o aluno escreveu a introdução do zero)'}

PARTE ESCRITA PELO ALUNO (${PART_LABELS[partType]}):
${resposta}

${PART_CRITERIA[partType]}

RETORNE JSON:
{
  "nota": <0 a 10, inteiro>,
  "feedback": "Feedback detalhado com:\n- Pontos positivos\n- Pontos a melhorar\n- Sugestões específicas de reescrita\n- Dica para a próxima vez",
  "exemploBom": "Exemplo de como essa parte ficaria bem escrita (para o aluno comparar)"
}
Retorne SOMENTE JSON válido.`;

    const result = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 4000,
      temperature: 0.3,
      responseFormat: { type: 'json_object' },
    });
    if (!result.ok) return result.response;

    const raw = result.data?.choices?.[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);

    const nota = Math.min(10, Math.max(0, parsed.nota ?? 5));
    const feedback = parsed.feedback ?? 'Sem feedback';
    const exemploBom = parsed.exemploBom ?? '';
    const fullFeedback = exemploBom ? `${feedback}\n\n🎯 **Exemplo de referência:**\n${exemploBom}` : feedback;

    // Save to DB
    const practice = await prisma.essayPartPractice.create({
      data: {
        userId,
        partType,
        tema,
        textoBase: textoBase || '',
        resposta,
        feedback: fullFeedback,
        nota,
      },
    });

    return NextResponse.json({
      id: practice.id,
      nota,
      feedback: fullFeedback,
    });
  } catch (error: any) {
    console.error('Submit essay part error:', error);
    return NextResponse.json({ error: 'Erro ao avaliar' }, { status: 500 });
  }
}
