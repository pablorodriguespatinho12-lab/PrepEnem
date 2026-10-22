// Qual modelo da Groq faz cada trabalho. Na conta gratuita o limite é por
// modelo (medido em 05/10/2026: 8.000 tokens/min e 1.000 pedidos/dia em cada
// um), então espalhar as tarefas multiplica a capacidade. O mais forte fica
// com o que precisa de conta certa e texto longo; a conversa, que vem em
// rajada, vai para um modelo rápido com cota própria.
//
// Cada um pode ser trocado por variável de ambiente sem mexer no código.

const modelo = (env: string, padrao: string): string => process.env[env] || padrao;

export const MODELO_IA = {
  explicacao: () => modelo('AI_MODEL_EXPLICACAO', 'openai/gpt-oss-120b'),
  // qwen era rápido mas errou conta no teste ("pode ser 10 voltas"); o 20b
  // pensa antes e acertou. Cota própria, separada do 120b.
  conversa: () => modelo('AI_MODEL_CONVERSA', 'openai/gpt-oss-20b'),
  // O 20b ficou abstrato demais no teste de 05/10/2026 ("Definir número de
  // entidades"); o 120b seguiu situação → desenho → fórmula.
  // Dúvida no meio da lição de Cálculo: o 20b acertou a conta mas respondeu
  // seco ("Não.") e chamou o carro de saída (teste de 06/10/2026). Vem uma
  // pergunta por vez, não em rajada: cabe no 120b.
  duvidaLicao: () => modelo('AI_MODEL_DUVIDA_LICAO', 'openai/gpt-oss-120b'),
  resumo: () => modelo('AI_MODEL_RESUMO', 'openai/gpt-oss-120b'),
  redacao: () => modelo('AI_MODEL_REDACAO', 'openai/gpt-oss-120b'),
  licao: () => modelo('AI_MODEL_LICAO', 'openai/gpt-oss-120b'),
  degraus: () => modelo('AI_MODEL_DEGRAUS', 'openai/gpt-oss-120b'),
  // Resolve de novo o que outro modelo gerou (lib/verificar-respostas.ts).
  // Modelo DIFERENTE do gerador de propósito: erra em lugares diferentes.
  verificacao: () => modelo('AI_MODEL_VERIFICACAO', 'qwen/qwen3.8-27b'),
};

/* Cota esgotada (429) num modelo não vale para os outros: cada um tem a sua
   (8 mil tokens/min, 200 mil/dia no 120b). Medido em 15/10/2026: explicação
   gasta ~6.700 tokens, ~30 por dia no 120b, e a 2ª questão em menos de um
   minuto dava erro depois de 16 s esperando. Agora troca na hora: resposta de
   modelo menor (e ainda validada) é melhor que tela de erro. */
const RESERVAS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
/* Reservas que podem treinar com o que recebem (Gemini e Mistral gratuitos).
   Só entram quando quem chama liga IA_RESERVAS_QUE_TREINAM=1: o gerador de
   explicações prontas (questões públicas), nunca a conversa com o aluno.
   A Mistral pediu plano pago na conta do Pablo (22/10/2026); fica pronta
   caso a chave apareça. */
function reservasQueTreinam(): string[] {
  if (process.env.IA_RESERVAS_QUE_TREINAM !== '1') return [];
  return [
    process.env.GEMINI_API_KEY ? `gemini:${process.env.AI_MODEL_GEMINI || 'gemini-3-flash-preview'}` : null,
    process.env.MISTRAL_API_KEY ? `mistral:${process.env.AI_MODEL_MISTRAL || 'mistral-medium-latest'}` : null,
  ].filter((m): m is string => m !== null);
}
export function modelosEmOrdem(principal: string | undefined): (string | undefined)[] {
  if (!principal || !RESERVAS.includes(principal)) return [principal];
  // No gerador, o Gemini vem logo depois do principal: nos testes de 22/10/2026
  // ele acertou o formato, e as reservas pequenas da Groq erravam o "Sua vez".
  return [principal, ...reservasQueTreinam(), ...RESERVAS.filter((m) => m !== principal)];
}
