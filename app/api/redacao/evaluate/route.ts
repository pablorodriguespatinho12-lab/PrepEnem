export const dynamic = 'force-dynamic';
export const maxDuration = 120;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const SYSTEM_PROMPT = `Você é um especialista avaliador de redações do ENEM com mais de 20 anos de experiência como corretor oficial do INEP. Analise redações dissertativo-argumentativas com máxima precisão seguindo rigorosamente os critérios oficiais.

Avalie cada competência (nota de 0 a 200, múltiplos de 40):

C1 — Domínio da norma culta: ortografia, acentuação, concordância, regência, crase, pontuação.
C2 — Compreensão da proposta: abordagem do tema, estrutura dissertativo-argumentativa.
C3 — Argumentação: coerência, tese clara, argumentos sólidos, progressão lógica.
C4 — Coesão textual: conectivos, operadores argumentativos, progressão referencial.
C5 — Proposta de intervenção: agente, ação, meio/modo, finalidade, detalhamento, respeito aos DH.

Estrutura da resposta (OBRIGATÓRIA em Markdown):

## Visão Geral
(2-3 parágrafos: impressão geral, pontos fortes, desafios)

## Análise por Competência

### Competência 1 — Norma Culta (Nota: X/200)
(Justificativa detalhada com trechos citados entre aspas, sugestões)

### Competência 2 — Tema (Nota: X/200)
(Justificativa detalhada)

### Competência 3 — Argumentação (Nota: X/200)
(Justificativa detalhada)

### Competência 4 — Coesão (Nota: X/200)
(Justificativa detalhada)

### Competência 5 — Proposta de Intervenção (Nota: X/200)
(Verificar 5 elementos: agente, ação, meio, finalidade, detalhamento)

## Tabela de Notas
| Competência | Nota |
|---|---|
| C1 - Norma Culta | X |
| C2 - Tema | X |
| C3 - Argumentação | X |
| C4 - Coesão | X |
| C5 - Proposta | X |
| **TOTAL** | **X** |

## Trechos para Reescrita
(Reescreva os trechos com problemas graves)

## Plano de Melhoria
(3-5 ações específicas, do mais urgente ao menos)

Regras:
- NUNCA atribua nota 1000 facilmente
- SEMPRE cite trechos reais da redação
- Tom respeitoso, pedagógico e motivador
- Seja criterioso mas construtivo

APÓS o Markdown, inclua na ÚLTIMA LINHA este JSON (exatamente neste formato):
|||NOTAS_JSON|||{"c1":X,"c2":X,"c3":X,"c4":X,"c5":X,"total":X}|||END_JSON|||`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { essayId } = await req.json();
    if (!essayId) return NextResponse.json({ error: 'essayId obrigatório' }, { status: 400 });

    const essay = await prisma.essay.findUnique({
      where: { id: essayId },
      include: { theme: true },
    });
    if (!essay) return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
    if (essay.userId !== userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    // Mark as evaluating
    await prisma.essay.update({ where: { id: essayId }, data: { status: 'avaliando' } });

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      await prisma.essay.update({ where: { id: essayId }, data: { status: 'pendente' } });
      return NextResponse.json({ error: 'API key não configurada' }, { status: 500 });
    }

    const userPrompt = `TEMA: ${essay.theme.tema}${essay.theme.anoEnem ? ` (ENEM ${essay.theme.anoEnem})` : ''}

${essay.theme.textoMotivador ? `TEXTOS MOTIVADORES:\n${essay.theme.textoMotivador}\n\n` : ''}REDAÇÃO DO ALUNO:\n${essay.texto}`;

    const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 6000,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      console.error('LLM evaluate error:', res.status);
      await prisma.essay.update({ where: { id: essayId }, data: { status: 'pendente' } });
      return NextResponse.json({ error: 'Erro na avaliação' }, { status: 500 });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    // Extract scores from JSON tag
    let c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0, total = 0;
    const jsonMatch = content.match(/\|\|\|NOTAS_JSON\|\|\|(.+?)\|\|\|END_JSON\|\|\|/);
    if (jsonMatch) {
      try {
        const scores = JSON.parse(jsonMatch[1]);
        c1 = Math.round(scores.c1 / 40) * 40;
        c2 = Math.round(scores.c2 / 40) * 40;
        c3 = Math.round(scores.c3 / 40) * 40;
        c4 = Math.round(scores.c4 / 40) * 40;
        c5 = Math.round(scores.c5 / 40) * 40;
        total = c1 + c2 + c3 + c4 + c5;
      } catch (e) {
        console.error('Score parse error:', e);
      }
    }

    // Clean the markdown (remove JSON tag)
    const avaliacao = content.replace(/\|\|\|NOTAS_JSON\|\|\|.+?\|\|\|END_JSON\|\|\|/g, '').trim();

    await prisma.essay.update({
      where: { id: essayId },
      data: {
        status: 'avaliada',
        notaC1: c1, notaC2: c2, notaC3: c3, notaC4: c4, notaC5: c5,
        notaTotal: total,
        avaliacao,
      },
    });

    return NextResponse.json({ success: true, notaTotal: total });
  } catch (error: any) {
    console.error('Evaluate error:', error);
    return NextResponse.json({ error: 'Erro ao avaliar redação' }, { status: 500 });
  }
}
