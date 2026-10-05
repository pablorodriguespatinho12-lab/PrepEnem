// Degraus: questões menores que quebram UMA questão do ENEM nas peças que ela
// exige. O estudante resolve as peças (base → intermediária) e chega à questão
// real já com elas na mão. Gerados por IA uma vez por questão-âncora e salvos
// com `ancoraId` — da segunda vez em diante saem do banco, sem custo nem espera.

import type { Question } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getAbacusApiKey } from '@/lib/ai-client';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { concorda, resolverIndependente } from '@/lib/verificar-respostas';

const DEGRAUS_BASE = 2;
const DEGRAUS_INTERMEDIARIOS = 3;
const TIMEOUT_GERACAO_MS = 25_000; // duas âncoras em série cabem nos 60 s da rota
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
- NÃO copie nem resolva a questão do ENEM; ela vem depois, o estudante precisa resolvê-la sozinho. Nenhum degrau pergunta o que a questão do ENEM pergunta, nem cita o resultado dela (se a resposta do ENEM é "mês 5", nenhum degrau calcula o mês do máximo DAQUELA função). Use outros números e outras situações para treinar a mesma peça.
- Nada de decoreba: nunca "qual é a fórmula de...". O degrau pede para USAR ou ENTENDER a peça (calcular, comparar, interpretar um gráfico).
- Faça cada conta duas vezes antes de marcar a alternativa correta.
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

/* Pelo menos 3 degraus válidos, senão a lista não serve como escada. */
function validarLista(bruto: unknown): DegrauGerado[] | null {
  const lista = Array.isArray((bruto as { degraus?: unknown })?.degraus) ? (bruto as { degraus: unknown[] }).degraus : [];
  const validos = lista.map(validarDegrau).filter((d): d is DegrauGerado => d !== null);
  return validos.length >= 3 ? validos : null;
}
async function gerarDegraus(ancora: Question): Promise<Question[]> {
  const r = await pedirJson(montarPrompt(ancora), validarLista, {
    maxTokens: 4500, temperature: 0.4, modelo: MODELO_IA.degraus(), pensar: 'medium', timeoutMs: TIMEOUT_GERACAO_MS,
  });
  if (!r.ok) {
    console.error('Degraus: falha ao gerar para a âncora', ancora.id, r.erro);
    return [];
  }
  // Resolução independente por outro modelo: só fica o degrau em que os
  // dois chegam à mesma alternativa (lib/verificar-respostas.ts).
  const verificadas = await resolverIndependente(r.dado.map((d) => ({
    enunciado: d.enunciado,
    opcoes: [d.alternativaA, d.alternativaB, d.alternativaC, d.alternativaD, d.alternativaE],
  })));
  const validos = verificadas
    ? r.dado.filter((d, i) => concorda({ tipo: 'escolha', correta: LETRAS.indexOf(d.respostaCorreta as (typeof LETRAS)[number]) }, verificadas[i]))
    : [];
  if (!verificadas) console.error(`Degraus: a verificação independente falhou (âncora ${ancora.id}); nenhum degrau salvo`);
  else {
    r.dado.forEach((d, i) => {
      const v = verificadas[i];
      if (!validos.includes(d)) console.error(`Degraus: descartado, gerador marcou ${d.respostaCorreta} e o verificador ${v && 'indice' in v ? LETRAS[v.indice] : 'nada'}: ${d.enunciado.slice(0, 80)}`);
    });
  }
  if (validos.length < 3) return [];
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

/* Degraus de cada âncora, do banco ou gerados agora (um por vez). Âncora
   cuja geração falhar volta sem degraus — quem chama decide o que fazer. */
export async function degrausDasAncoras(ancoras: Question[]): Promise<Map<string, Question[]>> {
  const ids = ancoras.map((a) => a.id);
  const salvos = await prisma.question.findMany({ where: { ancoraId: { in: ids } } });
  const porAncora = new Map<string, Question[]>(ids.map((id) => [id, salvos.filter((q) => q.ancoraId === id)]));

  const faltando = ancoras.filter((a) => (porAncora.get(a.id)?.length ?? 0) === 0);
  if (faltando.length > 0 && getAbacusApiKey()) {
    // Uma âncora de cada vez: em paralelo, as duas estouravam juntas o limite
    // de tokens por minuto do modelo na Groq gratuita.
    for (const a of faltando) {
      porAncora.set(a.id, await gerarDegraus(a).catch((erro) => {
        console.error('Degraus: falha ao gerar para a âncora', a.id, erro);
        return [] as Question[];
      }));
    }
  }

  return new Map(Array.from(porAncora, ([id, qs]) => [id, [...qs].sort((x, y) => ordemNivel(x) - ordemNivel(y))]));
}
