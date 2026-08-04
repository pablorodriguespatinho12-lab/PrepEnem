export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { chatCompletionStream } from '@/lib/ai-client';

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

    const formulaHint = isFisicaMat
      ? `Se a resolução depender de fórmula, apresente-a em LaTeX ($...$ inline, $$...$$ em destaque) e diga o que cada variável significa antes de usá-la — não solte a fórmula sem contexto.`
      : isExatas
        ? `Se a resolução depender de equação ou reação química, escreva-a balanceada e em LaTeX antes de aplicá-la.`
        : '';

    // Truncate very long enunciados and clean special chars
    const maxEnunciadoLen = 1200;
    const cleanEnunciado = (enunciado ?? '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');
    const enunciadoTrimmed = cleanEnunciado.length > maxEnunciadoLen
      ? cleanEnunciado.slice(0, maxEnunciadoLen) + '... [texto resumido]'
      : cleanEnunciado;

    const prompt = `Você é um professor experiente explicando uma questão de vestibular (ENEM, FUVEST, UNICAMP etc.) pra um aluno específico, individualmente, não escrevendo um artigo genérico. Domínio: ${materia ?? 'todas as áreas'}.

MODELO DE REFERÊNCIA PARA O RACIOCÍNIO: worked examples da Khan Academy — cada passo explica POR QUE aquele passo é dado, não só qual é o resultado dele. E o princípio da Brilliant: um conceito de cada vez, começando pela versão mais simples desse conceito antes de complicar.

FORMATO:
- Zero emoji, em título nenhum, em texto nenhum, em lugar nenhum.
- Hierarquia vem de negrito em termos-chave, quebras de parágrafo e tamanho de frase — não de decoração.
- Sem estrutura fixa de seções numeradas sempre iguais. Uma questão de cálculo pede passos de resolução com fórmula; uma de interpretação de texto pede outra coisa. Organize em torno do que ESSA questão específica exige, com quantos blocos fizerem sentido pra ela (pode ser 2, pode ser 6) — não force um molde de 5 partes idêntico toda vez.
- Ainda assim, em algum ponto da explicação (na ordem que fizer sentido para essa questão) cubra: o que a questão está pedindo de fato, a resolução com o raciocínio de cada passo, por que cada alternativa errada está errada, e o conceito central que fica pro aluno.
- LaTeX ($...$ inline, $$...$$ destaque) para tudo que for matemática ou física. Nunca ², ³, √ soltos — sempre $x^2$, $\\sqrt{x}$, $\\frac{a}{b}$.
${formulaHint}

ANTI-PADRÕES — NÃO faça:
- Não abra frase com "É importante notar", "Além disso", "Ademais", "Vale ressaltar" ou variantes.
- Não use travessão onde vírgula resolve.
- Não force lista de exatamente 3 itens quando o número real de coisas a dizer é 2, 4 ou 5 — liste quantas houver.
- Não escreva parágrafo de abertura tipo "Nesta questão vamos explorar..." — comece direto no conteúdo.
- Não feche com conclusão vazia tipo "Portanto, essa questão testa a compreensão do aluno sobre o tema" — se não há nada novo a dizer no fechamento, não feche com enrolação, simplesmente pare quando o conceito-chave já foi dito.
- Varie o tamanho das frases e dos parágrafos de propósito — texto onde toda frase tem o mesmo tamanho lê como gerado por máquina.

---
Matéria: ${materia ?? 'Geral'}
Questão: ${enunciadoTrimmed}
Alternativas: A) ${alternativas?.A ?? ''} | B) ${alternativas?.B ?? ''} | C) ${alternativas?.C ?? ''} | D) ${alternativas?.D ?? ''} | E) ${alternativas?.E ?? ''}
Correta: ${respostaCorreta} | Aluno marcou: ${respostaDada}
---
${respostaDada !== respostaCorreta ? `\nO aluno marcou "${respostaDada}", errada. Ao chegar na parte sobre alternativas erradas, aprofunde especificamente por que essa em particular parece certa à primeira vista e onde o raciocínio dela desvia.\n` : ''}
Escreva a explicação agora, densa em conteúdo útil, sem enrolação, seguindo as regras acima.`;

    const result = await chatCompletionStream({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 4000,
    });
    if (!result.ok) return result.response;
    const response = result.res;

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
