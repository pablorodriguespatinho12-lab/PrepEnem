export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { enunciado, alternativas, respostaCorreta, respostaDada, materia } = body;
    if (!enunciado || !respostaCorreta) {
      return new Response(JSON.stringify({ error: 'Dados da questão incompletos' }), { status: 400 });
    }

    const isExatas = ['Física', 'Matemática', 'Química'].includes(materia ?? '');
    const isFisicaMat = ['Física', 'Matemática'].includes(materia ?? '');

    const formulaSection = isFisicaMat
      ? `\n\n**🧮 Fórmula(s) envolvida(s):**\nApresente a(s) fórmula(s) relevante(s) usando LaTeX entre $...$ para inline e $$...$$ para destaque. Ex: $S = S_0 + v_0 \\cdot t + \\frac{1}{2} a t^2$. Defina cada variável.`
      : isExatas
        ? `\n\n**🧮 Conceito-chave / Reação / Equação:**\nApresente a fórmula química, equação balanceada ou conceito quantitativo usando LaTeX entre $...$ para notação.`
        : '';

    // Truncate very long enunciados and clean special chars
    const maxEnunciadoLen = 1200;
    const cleanEnunciado = (enunciado ?? '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');
    const enunciadoTrimmed = cleanEnunciado.length > maxEnunciadoLen
      ? cleanEnunciado.slice(0, maxEnunciadoLen) + '... [texto resumido]'
      : cleanEnunciado;

    const prompt = `Você é um professor especialista em preparação para vestibulares brasileiros (ENEM, FUVEST, UNICAMP, etc.), com domínio profundo de ${materia ?? 'todas as áreas'}.

Ao explicar uma questão, siga OBRIGATORIAMENTE esta estrutura, baseada em princípios de aprendizagem ativa e metacognição:

REGRAS OBRIGATÓRIAS:
• Use LaTeX ($...$) para fórmulas matemáticas/físicas. NUNCA use ², ³, √ — use $x^2$, $\\sqrt{x}$, $\\frac{a}{b}$
• Linguagem clara, didática, como se estivesse conversando com o aluno
• Markdown com emojis nos títulos
• Use analogias do dia a dia quando ajudarem na compreensão

---
**Matéria:** ${materia ?? 'Geral'}
**Questão:** ${enunciadoTrimmed}
**Alternativas:** A) ${alternativas?.A ?? ''} | B) ${alternativas?.B ?? ''} | C) ${alternativas?.C ?? ''} | D) ${alternativas?.D ?? ''} | E) ${alternativas?.E ?? ''}
**Correta:** ${respostaCorreta} | **Aluno marcou:** ${respostaDada}
---

Responda EXATAMENTE nesta estrutura:

**📚 1. CONTEXTO DA QUESTÃO**
Explique brevemente o tema geral abordado e por que ele costuma cair em vestibulares. (2-3 frases)
${formulaSection}

**🔍 2. INTERPRETAÇÃO**
Destrinche o enunciado em partes simples. Identifique o que a questão realmente está pedindo, eliminando possíveis armadilhas ou confusões comuns. Destaque palavras-chave do enunciado.

**🧩 3. RESOLUÇÃO PASSO A PASSO**
Resolva de forma progressiva (passos 1, 2, 3...), explicando o raciocínio de cada etapa, não apenas o resultado final. Em questões de cálculo, mostre cada operação com LaTeX.

**❌ 4. POR QUE AS ALTERNATIVAS ERRADAS ESTÃO ERRADAS**
Explique o erro de CADA distrator (uma por uma: A, B, C, D, E — exceto a correta). Mostre qual confusão conceitual leva o aluno a marcar cada uma. Isso evita que ele erre por confusão futura.
${respostaDada !== respostaCorreta ? `\nAtenção especial: o aluno marcou "${respostaDada}". Aprofunde o motivo dessa alternativa estar incorreta.\n` : ''}
**💡 5. CONCEITO-CHAVE PARA FIXAR**
Resuma em 2-3 linhas o conceito principal que essa questão testa, de forma que o aluno consiga resolver questões semelhantes sozinho. Pode ser um mnemônico, regra prática ou frase-chave que ele leve para a vida.

IMPORTANTE: Siga rigorosamente essa estrutura de 5 partes. Seja completo mas objetivo — cada seção deve ser densa em conteúdo útil, sem enrolação.`;

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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('LLM API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Erro na API de explicação. Tente novamente.' }), { status: 500 });
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
