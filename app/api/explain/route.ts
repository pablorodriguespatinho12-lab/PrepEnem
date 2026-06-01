export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401 });
    }

    const { enunciado, alternativas, respostaCorreta, respostaDada, materia } = await request.json();

    const isExatas = ['Física', 'Matemática', 'Química'].includes(materia ?? '');
    const isFisicaMat = ['Física', 'Matemática'].includes(materia ?? '');

    const formulaSection = isFisicaMat
      ? `\n\n**🧮 Fórmula(s) envolvida(s):**\nApresente a(s) fórmula(s) relevante(s) usando LaTeX entre $...$ para inline e $$...$$ para destaque. Ex: $S = S_0 + v_0 \\cdot t + \\frac{1}{2} a t^2$. Defina cada variável.\n\n**✏️ Exemplo resolvido passo a passo:**\nResolva NUMERICAMENTE a questão substituindo valores na fórmula. Use LaTeX para cada expressão. Mostre cada cálculo intermediário.`
      : isExatas
        ? `\n\n**🧮 Conceito-chave / Reação / Equação:**\nApresente a fórmula química, equação balanceada ou conceito quantitativo usando LaTeX entre $...$ para notação.`
        : '';

    // Truncate very long enunciados to leave room for a good explanation
    const maxEnunciadoLen = 1200;
    const enunciadoTrimmed = (enunciado ?? '').length > maxEnunciadoLen
      ? (enunciado as string).slice(0, maxEnunciadoLen) + '... [texto resumido]'
      : (enunciado ?? '');

    const prompt = `Você é um professor preparatório de ENEM/vestibular, especialista em ${materia ?? 'todas as áreas'}.

OBJETIVO: Explicar passo a passo, de forma SIMPLES e DIDÁTICA, por que a resposta correta é "${respostaCorreta}" e por que "${respostaDada}" está errada. O aluno precisa ENTENDER a lógica e MEMORIZAR o conceito.

REGRAS OBRIGATÓRIAS:
• Use LaTeX ($...$) para fórmulas. NUNCA use ², ³, √ — use $x^2$, $\\sqrt{x}$, $\\frac{a}{b}$
• Seja DIRETO — vá direto ao ponto, sem repetir o enunciado inteiro
• Use linguagem simples, como se estivesse conversando com o aluno
• Use analogias do dia a dia para facilitar a memorização
• Markdown com emojis nos títulos

---
**Matéria:** ${materia ?? 'Geral'}
**Questão (resumo):** ${enunciadoTrimmed}
**Alternativas:** A) ${alternativas?.A ?? ''} | B) ${alternativas?.B ?? ''} | C) ${alternativas?.C ?? ''} | D) ${alternativas?.D ?? ''} | E) ${alternativas?.E ?? ''}
**Correta:** ${respostaCorreta} | **Aluno marcou:** ${respostaDada}
---

Responda nesta estrutura:

**📚 O que a questão cobra:**
Em 2-3 frases, explique qual CONCEITO está sendo testado. Não repita o enunciado — só identifique o tema central.
${formulaSection}

**✅ Passo a passo — por que "${respostaCorreta}" é a certa:**
Numere os passos do raciocínio (1, 2, 3...). Cada passo deve ser uma frase curta e clara. Destaque as palavras-chave do enunciado que levam à resposta.

${respostaDada !== respostaCorreta ? `**❌ O erro de marcar "${respostaDada}":**
Explique em 2-3 frases qual foi a armadilha ou confusão. Mostre EXATAMENTE onde o raciocínio desvia.\n\n` : ''}**🎯 Descartando as outras:**
Uma frase para cada alternativa errada explicando o motivo.

**💡 Macete para decorar:**
Dê um mnemônico, frase-chave ou regra prática que ajude a NUNCA mais errar esse tipo de questão. Seja criativo e memorável!

**🔗 Cai junto no ENEM:**
Cite 1-2 temas relacionados que o aluno deve revisar.

IMPORTANTE: Seja conciso mas completo. Priorize CLAREZA sobre quantidade de texto.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Erro na API LLM' }), { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        try {
          while (true) {
            const { done, value } = await (reader as any).read();
            if (done) break;
            const chunk = decoder.decode(value);
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Explain error:', error);
    return new Response(JSON.stringify({ error: 'Erro ao gerar explicação' }), { status: 500 });
  }
}
