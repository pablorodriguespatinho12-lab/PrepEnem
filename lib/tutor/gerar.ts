// Gerar e conferir a explicação de uma questão. Uma função só para a rota
// (aluno esperando) e para o script que deixa explicações prontas.

import { pedirJson, type ResultadoIA } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { promptExplicacao, textoDaQuestao, type QuestaoParaTutor } from './prompts';
import { validarExplicacao, type Explicacao } from './validar';
import { explicarConferido, promptConferencia, validarConferencia } from './conferir';

/* Gerar, conferir e (se preciso) gerar de novo dividem um prazo só: a Vercel
   mata a função aos 60 s. A conferência tem teto próprio para sobrar tempo
   para a correção; se não sobrar, fica a primeira versão. */
const PRAZO_CONFERENCIA_MS = 15_000;
const MINIMO_PARA_TENTAR_MS = 8_000;

export async function gerarExplicacao(questao: QuestaoParaTutor, prazoMs: number): Promise<ResultadoIA<Explicacao>> {
  const fim = Date.now() + prazoMs;
  const resta = () => fim - Date.now();
  const semTempo = { ok: false as const, erro: 'Sem tempo para conferir', status: 504 };
  const prompt = promptExplicacao(questao);
  return explicarConferido(
    prompt,
    (p) => resta() < MINIMO_PARA_TENTAR_MS
      ? Promise.resolve(semTempo)
      : pedirJson(p, (bruto) => validarExplicacao(bruto, questao.materia), {
        maxTokens: 4000, temperature: 0.2, modelo: MODELO_IA.explicacao(), timeoutMs: 45_000, prazoMs: resta(),
      }),
    (primeira) => resta() < MINIMO_PARA_TENTAR_MS * 2
      ? Promise.resolve(semTempo)
      : pedirJson(promptConferencia(textoDaQuestao(questao), primeira), validarConferencia, {
        maxTokens: 1500, temperature: 0, modelo: MODELO_IA.verificacao(), prazoMs: Math.min(PRAZO_CONFERENCIA_MS, resta() - MINIMO_PARA_TENTAR_MS),
      }),
  );
}
