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
