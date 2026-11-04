// Degraus: questões menores que quebram UMA questão do ENEM nas peças que ela
// exige. O estudante resolve as peças (Fácil → Médio → Difícil) e chega à questão
// real já com elas na mão. Gerados por IA uma vez por questão-âncora e salvos
// com `ancoraId` — da segunda vez em diante saem do banco, sem custo nem espera.
//
// Junto vem UMA questão de nível acima (nivel 'acima'): o mesmo conteúdo no
// estilo de vestibular mais difícil, para estudar um passo além do que o ENEM
// cobra (pedido do Pablo, 05/10/2026). Ela entra logo DEPOIS da questão do ENEM.

import type { Question } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getAbacusApiKey } from '@/lib/ai-client';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { concorda, resolverIndependente } from '@/lib/verificar-respostas';

const DEGRAUS_BASE = 2;
const DEGRAUS_INTERMEDIARIOS = 2;
const DEGRAUS_DIFICEIS = 1;
const QUESTOES_ACIMA = 1;
const ORCAMENTO_ACIMA_MS = 30_000; // geração avulsa do nível acima só se a rota ainda tem folga
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
  nivel: 'facil' | 'medio' | 'dificil' | 'acima';
  explicacao: string;
}

const EXATAS = ['Matemática', 'Física', 'Química'];

/* Banca de referência do nível acima. ITA e IME só fazem sentido nas exatas. */
function bancasAcima(materia: string): string {
  return EXATAS.includes(materia) ? 'ITA, IME, Fuvest e Unicamp' : 'Fuvest e Unicamp';
}

function regraAcima(ancora: Question): string {
  return `- ${QUESTOES_ACIMA} com nivel "acima": o MESMO conteúdo um nível além do ENEM, no estilo das provas de ${bancasAcima(ancora.materia)} — combina duas peças, exige um passo a mais de raciocínio ou um conceito vizinho que o ENEM não cobra. Questão original no estilo da banca: não copie questão real nem diga que é de uma prova. Enunciado de até 8 linhas.
  - Só programa do ensino médio que essas bancas cobram; nada de conteúdo de faculdade.
  - Autossuficiente: todo texto, trecho, tabela ou dado que a questão usa está escrito no próprio enunciado.
  - Calcule a resposta ANTES de escrever as alternativas e confira cada conversão e conta.`;
}

function montarPrompt(ancora: Question): string {
  const alternativas = LETRAS.map((l) => `${l}) ${ancora[`alternativa${l}` as const]}`).join('\n');
  return `Você prepara um estudante para resolver UMA questão do ENEM. Primeiro identifique as 2 a 4 peças de conhecimento que a questão exige (conceito, fórmula, leitura de dado, relação causa-efeito). Depois escreva questões curtas que treinam essas peças, uma peça por questão.

QUESTÃO DO ENEM (${ancora.materia} — ${ancora.subtema}):
${ancora.enunciado}

${alternativas}
Resposta correta: ${ancora.respostaCorreta}

Gere exatamente ${DEGRAUS_BASE + DEGRAUS_INTERMEDIARIOS + DEGRAUS_DIFICEIS + QUESTOES_ACIMA} questões:
- ${DEGRAUS_BASE} com nivel "facil": pergunta direta e curta sobre um conceito que a questão usa, do tipo "O que é X?" ou "O que acontece quando...?". Uma ou duas linhas, sem texto de apoio.
- ${DEGRAUS_INTERMEDIARIOS} com nivel "medio": um texto curto (3 a 5 linhas) com uma situação, e a pergunta aplica uma peça nele.
- ${DEGRAUS_DIFICEIS} com nivel "dificil": texto de apoio longo no jeito do ENEM (8 a 12 linhas: situação real, dado, gráfico descrito ou trecho), juntando as peças. Questão original: não copie nem cite questão real.
${regraAcima(ancora)}

REGRAS:
- NÃO copie nem resolva a questão do ENEM; ela vem depois, o estudante precisa resolvê-la sozinho. Nenhum degrau pergunta o que a questão do ENEM pergunta, nem cita o resultado dela (se a resposta do ENEM é "mês 5", nenhum degrau calcula o mês do máximo DAQUELA função). Use outros números e outras situações para treinar a mesma peça.
- Nada de decoreba de fórmula: nunca "qual é a fórmula de...". O fácil pergunta o que o conceito É; médio e difícil pedem para USAR a peça (calcular, comparar, interpretar um gráfico).
- Faça cada conta duas vezes antes de marcar a alternativa correta.
- 5 alternativas plausíveis, uma só correta.
- Explicação: 2 ou 3 frases curtas, a conta principal e o porquê. O tutor do app faz a explicação desenhada; esta só fica atrás de "Ver texto completo" (e gastava a cota de tokens da Groq).
- Português do Brasil. Sem emoji, sem elogio, sem "É importante notar".

Retorne SOMENTE JSON: {"degraus":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","nivel":"facil","explicacao":"..."}]}`;
}

export function montarPromptAcima(ancora: Question): string {
  const alternativas = LETRAS.map((l) => `${l}) ${ancora[`alternativa${l}` as const]}`).join('\n');
  return `Você prepara um estudante para ir um nível além desta questão do ENEM.

QUESTÃO DO ENEM (${ancora.materia} — ${ancora.subtema}):
${ancora.enunciado}

${alternativas}
Resposta correta: ${ancora.respostaCorreta}

Gere exatamente ${QUESTOES_ACIMA} questão:
${regraAcima(ancora)}

REGRAS:
- Não repita a pergunta da questão do ENEM; use outros números e outra situação.
- Faça cada conta duas vezes antes de marcar a alternativa correta.
- 5 alternativas plausíveis, uma só correta.
- Explicação: 2 ou 3 frases curtas, a conta principal e o porquê. O tutor do app faz a explicação desenhada; esta só fica atrás de "Ver texto completo" (e gastava a cota de tokens da Groq).
- Português do Brasil. Sem emoji, sem elogio, sem "É importante notar".

Retorne SOMENTE JSON: {"degraus":[{"enunciado":"...","alternativaA":"...","alternativaB":"...","alternativaC":"...","alternativaD":"...","alternativaE":"...","respostaCorreta":"A","nivel":"acima","explicacao":"..."}]}`;
}

function validarDegrau(bruto: unknown): DegrauGerado | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const d = bruto as Record<string, unknown>;
  const textos = ['enunciado', 'alternativaA', 'alternativaB', 'alternativaC', 'alternativaD', 'alternativaE', 'explicacao'];
  if (!textos.every((k) => typeof d[k] === 'string' && (d[k] as string).trim().length > 0)) return null;
  const resposta = String(d.respostaCorreta ?? '').trim().toUpperCase();
  if (!(LETRAS as readonly string[]).includes(resposta)) return null;
  const nivel = d.nivel === 'facil' || d.nivel === 'dificil' || d.nivel === 'acima' ? d.nivel : 'medio';
  return { ...(d as unknown as DegrauGerado), respostaCorreta: resposta, nivel };
}

const ehAcima = (d: { nivel?: string | null }) => d.nivel === 'acima';
const MIN_DEGRAUS = 3;

function lerLista(bruto: unknown): DegrauGerado[] {
  const lista = Array.isArray((bruto as { degraus?: unknown })?.degraus) ? (bruto as { degraus: unknown[] }).degraus : [];
  return lista.map(validarDegrau).filter((d): d is DegrauGerado => d !== null);
}

/* Pelo menos 3 degraus válidos (fora o nível acima), senão não serve como escada. */
function validarLista(bruto: unknown): DegrauGerado[] | null {
  const validos = lerLista(bruto);
  return validos.filter((d) => !ehAcima(d)).length >= MIN_DEGRAUS ? validos : null;
}

export function validarAcima(bruto: unknown): DegrauGerado[] | null {
  const validos = lerLista(bruto).filter(ehAcima);
  return validos.length > 0 ? validos : null;
}
async function gerarDegraus(ancora: Question): Promise<Question[]> {
  const r = await pedirJson(montarPrompt(ancora), validarLista, {
    maxTokens: 5500, temperature: 0.4, modelo: MODELO_IA.degraus(), pensar: 'medium', timeoutMs: TIMEOUT_GERACAO_MS,
  });
  if (!r.ok) {
    console.error('Degraus: falha ao gerar para a âncora', ancora.id, r.erro);
    return [];
  }
  return verificarESalvar(ancora, r.dado, MIN_DEGRAUS);
}

async function gerarAcima(ancora: Question): Promise<Question[]> {
  const r = await pedirJson(montarPromptAcima(ancora), validarAcima, {
    maxTokens: 2500, temperature: 0.4, modelo: MODELO_IA.degraus(), pensar: 'medium', timeoutMs: TIMEOUT_GERACAO_MS,
  });
  if (!r.ok) {
    console.error('Nível acima: falha ao gerar para a âncora', ancora.id, r.erro);
    return [];
  }
  return verificarESalvar(ancora, r.dado, 0);
}

/* Resolução independente por outro modelo: só fica a questão em que os dois
   chegam à mesma alternativa (lib/verificar-respostas.ts). `minimo` conta só
   os degraus, sem o nível acima. */
async function verificarESalvar(ancora: Question, dado: DegrauGerado[], minimo: number): Promise<Question[]> {
  const verificadas = await resolverIndependente(dado.map((d) => ({
    enunciado: d.enunciado,
    opcoes: [d.alternativaA, d.alternativaB, d.alternativaC, d.alternativaD, d.alternativaE],
  })));
  const validos = verificadas
    ? dado.filter((d, i) => concorda({ tipo: 'escolha', correta: LETRAS.indexOf(d.respostaCorreta as (typeof LETRAS)[number]) }, verificadas[i]))
    : [];
  if (!verificadas) console.error(`Degraus: a verificação independente falhou (âncora ${ancora.id}); nenhum degrau salvo`);
  else {
    dado.forEach((d, i) => {
      const v = verificadas[i];
      if (!validos.includes(d)) console.error(`Degraus: descartado, gerador marcou ${d.respostaCorreta} e o verificador ${v && 'indice' in v ? LETRAS[v.indice] : 'nada'}: ${d.enunciado.slice(0, 80)}`);
    });
  }
  if (validos.filter((d) => !ehAcima(d)).length < minimo || validos.length === 0) return [];
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
          dificuldade: ehAcima(d) ? 'dificil' : d.nivel,
          origem: ehAcima(d) ? `IA Nível acima (estilo ${bancasAcima(ancora.materia)})` : 'IA Degrau',
          geradaPorIA: true,
          ancoraId: ancora.id,
        },
      }),
    ),
  );
}

const ORDEM_NIVEL: Record<string, number> = { facil: 0, medio: 1, dificil: 2, acima: 3 };
const ordemNivel = (q: Question) => ORDEM_NIVEL[q.nivel ?? 'medio'] ?? 1;

/* Degraus de cada âncora, do banco ou gerados agora (um por vez). Âncora
   cuja geração falhar volta sem degraus — quem chama decide o que fazer. */
export async function degrausDasAncoras(ancoras: Question[]): Promise<Map<string, Question[]>> {
  const ids = ancoras.map((a) => a.id);
  const salvos = await prisma.question.findMany({ where: { ancoraId: { in: ids } } });
  const porAncora = new Map<string, Question[]>(ids.map((id) => [id, salvos.filter((q) => q.ancoraId === id)]));

  const inicio = Date.now();
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

  // Âncoras com degraus de antes do nível acima: gera só ele, se ainda houver
  // tempo na rota. O que não couber agora fica para a próxima sessão.
  const semAcima = ancoras.filter((a) => {
    const qs = porAncora.get(a.id) ?? [];
    return qs.length > 0 && !qs.some(ehAcima);
  });
  for (const a of semAcima) {
    if (!getAbacusApiKey() || Date.now() - inicio > ORCAMENTO_ACIMA_MS) break;
    const novas = await gerarAcima(a).catch((erro) => {
      console.error('Nível acima: falha ao gerar para a âncora', a.id, erro);
      return [] as Question[];
    });
    porAncora.set(a.id, [...(porAncora.get(a.id) ?? []), ...novas]);
  }

  return new Map(Array.from(porAncora, ([id, qs]) => [id, [...qs].sort((x, y) => ordemNivel(x) - ordemNivel(y))]));
}
