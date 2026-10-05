// Degraus: questões menores que quebram UMA questão do ENEM nas peças que ela
// exige. O estudante resolve as peças (base → intermediária) e chega à questão
// real já com elas na mão. Gerados por IA uma vez por questão-âncora e salvos
// com `ancoraId` — da segunda vez em diante saem do banco, sem custo nem espera.

import type { Question } from '@prisma/client';
import { prisma } from '@/lib/db';
import { chatCompletion, getAbacusApiKey } from '@/lib/ai-client';

const DEGRAUS_BASE = 2;
const DEGRAUS_INTERMEDIARIOS = 3;
const TIMEOUT_GERACAO_MS = 25_000;
const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;

interface DegrauGerado {
  enunciado: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
  respostaCorreta: string;
  nivel: 'facil' | 'medio';
  explicacao: string;
}

function montarPrompt(ancora: Question): string {
  const alternativas = LETRAS.map((l) => `${l}) ${ancora[`alternativa${l}` as const]}`).join('\n');
  return `Você prepara um estudante para resolver UMA questão do ENEM. Primeiro identifique as 2 a 4 peças de conhecimento que a questão exige (conceito, fórmula, leitura de dado, relação causa-efeito). Depois escreva questões curtas que treinam essas peças, uma peça por questão.

QUESTÃO DO ENEM (${ancora.materia} — ${ancora.subtema}):
${ancora.enunciado}

${alternativas}
Resposta correta: ${ancora.respostaCorreta}

Gere exatamente ${DEGRAUS_BASE + DEGRAUS_INTERMEDIARIOS} questões:
- ${DEGRAUS_BASE} com nivel "facil": revisão direta de um conceito que a questão usa. Enunciado de 1 a 3 linhas.
- ${DEGRAUS_INTERMEDIARIOS} com nivel "medio": aplicam uma peça num contexto pequeno, mais perto do raciocínio da questão. Enunciado de até 5 linhas.

REGRAS:
- NÃO copie nem resolva a questão do ENEM; ela vem depois, o estudante precisa resolvê-la sozinho.
- 5 alternativas plausíveis, uma só correta.
- Explicação: 1) o que a questão pedia; 2) por que o erro mais comum falha; 3) o caminho passo a passo; 4) o princípio por trás; 5) onde essa peça aparece na questão do ENEM.
- Português do Brasil. Sem emoji, sem elogio, sem "É importante notar".

Retorne SOMENTE JSON: {"degraus":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","nivel":"facil","explicacao":"..."}]}`;
}

function validarDegrau(bruto: unknown): DegrauGerado | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const d = bruto as Record<string, unknown>;
  const textos = ['enunciado', 'alternativaA', 'alternativaB', 'alternativaC', 'alternativaD', 'alternativaE', 'explicacao'];
  if (!textos.every((k) => typeof d[k] === 'string' && (d[k] as string).trim().length > 0)) return null;
  const resposta = String(d.respostaCorreta ?? '').trim().toUpperCase();
  if (!(LETRAS as readonly string[]).includes(resposta)) return null;
  const nivel = d.nivel === 'facil' ? 'facil' : 'medio';
  return { ...(d as unknown as DegrauGerado), respostaCorreta: resposta, nivel };
}

async function gerarDegraus(ancora: Question): Promise<Question[]> {
  const resultado = await chatCompletion({
    messages: [{ role: 'user', content: montarPrompt(ancora) }],
    maxTokens: 6000,
    temperature: 0.5,
    responseFormat: { type: 'json_object' },
    timeoutMs: TIMEOUT_GERACAO_MS,
  });
  if (!resultado.ok) return [];

  let lista: unknown[] = [];
  try {
    const conteudo = resultado.data?.choices?.[0]?.message?.content ?? '';
    lista = JSON.parse(conteudo)?.degraus ?? [];
  } catch (erro) {
    console.error('Degraus: JSON inválido para a âncora', ancora.id, erro);
    return [];
  }

  const validos = lista.map(validarDegrau).filter((d): d is DegrauGerado => d !== null);
  if (validos.length === 0) return [];

  return prisma.$transaction(
    validos.map((d) =>
      prisma.question.create({
        data: {
          enunciado: d.enunciado,
          alternativaA: d.alternativaA,
          alternativaB: d.alternativaB,
          alternativaC: d.alternativaC,
          alternativaD: d.alternativaD,
          alternativaE: d.alternativaE,
          respostaCorreta: d.respostaCorreta,
          explicacao: d.explicacao,
          materia: ancora.materia,
          subtema: ancora.subtema,
          tema: ancora.tema,
          nivel: d.nivel,
          dificuldade: d.nivel,
          origem: 'IA Degrau',
          geradaPorIA: true,
          ancoraId: ancora.id,
        },
      }),
    ),
  );
}

const ordemNivel = (q: Question) => (q.nivel === 'facil' ? 0 : 1);

/* Degraus de cada âncora, do banco ou gerados agora (em paralelo). Âncora
   cuja geração falhar volta sem degraus — quem chama decide o que fazer. */
export async function degrausDasAncoras(ancoras: Question[]): Promise<Map<string, Question[]>> {
  const ids = ancoras.map((a) => a.id);
  const salvos = await prisma.question.findMany({ where: { ancoraId: { in: ids } } });
  const porAncora = new Map<string, Question[]>(ids.map((id) => [id, salvos.filter((q) => q.ancoraId === id)]));

  const faltando = ancoras.filter((a) => (porAncora.get(a.id)?.length ?? 0) === 0);
  if (faltando.length > 0 && getAbacusApiKey()) {
    const gerados = await Promise.all(
      faltando.map((a) =>
        gerarDegraus(a).catch((erro) => {
          console.error('Degraus: falha ao gerar para a âncora', a.id, erro);
          return [] as Question[];
        }),
      ),
    );
    faltando.forEach((a, i) => porAncora.set(a.id, gerados[i]));
  }

  return new Map(Array.from(porAncora, ([id, qs]) => [id, [...qs].sort((x, y) => ordemNivel(x) - ordemNivel(y))]));
}
