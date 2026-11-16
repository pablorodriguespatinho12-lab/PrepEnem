// Mede o tamanho de cada pedido à IA do site, sem chamar a IA (custo zero).
// Pablo, 16/11/2026: "antes de tudo, melhora para economizar tokens".
// A Groq gratuita conta prompt + max_tokens pedido contra 8 mil tokens/min.
// Uso: npx tsx scripts/medir-tokens-ia.ts
import { promptExplicacao, promptSeuErro, promptConversa, textoDaQuestao, type QuestaoParaTutor } from '../lib/tutor/prompts';
import { promptConferencia } from '../lib/tutor/conferir';
import { promptResumo } from '../lib/tutor/resumo';
import { promptRedacaoCompleta } from '../lib/redacao/prompts';

const LETRAS_POR_TOKEN = 3.2; // mesma régua de lib/tutor/gerar.ts
const tokens = (texto: string) => Math.ceil(texto.length / LETRAS_POR_TOKEN);

const questao: QuestaoParaTutor = {
  enunciado: 'Um alvo é um círculo de raio 10 cm. Um disco de raio 2 cm é lançado e a jogada vale sempre que o centro do disco cai no alvo. Ganha quem deixa o disco inteiramente dentro do alvo. Qual a chance de ganhar?',
  alternativas: { A: '20%', B: '36%', C: '64%', D: '80%', E: '96%' },
  respostaCorreta: 'C', respostaDada: 'D', materia: 'Matemática', subtema: 'Geometria Plana',
};
const explicacaoExemplo = {
  ideia: 'O centro do disco anda num círculo menor.', pecas: [], conferencia: '64 ÷ 100 = 64%',
  passos: [{ titulo: 'Jeito rápido', texto: 'Raio onde ganha: 10 − 2 = 8. Área: 64π. Divide por 100π: 64%.' }],
} as never;
const historico = Array.from({ length: 6 }, (_, i) => ({ papel: (i % 2 ? 'tutor' : 'aluno') as 'aluno' | 'tutor', texto: 'Por que o raio fica 10 − 2 e não 10 − 4?' }));
const redacao = 'Texto de redação de exemplo. '.repeat(100); // ~3.000 letras, uma redação média

// [rota, prompt, max_tokens pedido no código]
const rotas: [string, string, number][] = [
  ['explicação (tutor)', promptExplicacao(questao), 4000],
  ['conferência da explicação', promptConferencia(textoDaQuestao(questao), explicacaoExemplo), 1500],
  ['seu erro', promptSeuErro(questao), 1200],
  ['conversa (6 falas)', promptConversa(questao, 'Resumo da explicação. '.repeat(40), historico), 1600],
  ['resumo do treino (5 assuntos)', promptResumo(Array.from({ length: 5 }, (_, i) => ({ materia: 'Matemática', subtema: `Assunto ${i}` }))), 2000],
  ['correção de redação', promptRedacaoCompleta('Tema de exemplo', null, redacao), 4500],
];

console.log('rota | prompt | teto de resposta | total contra a cota de 8 mil/min');
for (const [nome, prompt, teto] of rotas) {
  console.log(`${nome} | ${tokens(prompt)} | ${teto} | ${tokens(prompt) + teto}`);
}
