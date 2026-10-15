// Roda a conversa do tutor contra perguntas de "como você fez?" e imprime a
// resposta e o tipo de visual. Só leitura: não grava nada no banco.
//   npx tsx --env-file=.env scripts/testar-conversa.ts
import { promptConversa, type QuestaoParaTutor } from '@/lib/tutor/prompts';
import { validarRespostaTutor } from '@/lib/tutor/validar';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';

function questao(enunciado: string, alts: string[], certa: string, materia: string, subtema: string): QuestaoParaTutor {
  const [A, B, C, D, E] = alts;
  return { enunciado, alternativas: { A, B, C, D, E }, respostaCorreta: certa, materia, subtema };
}

const CASOS: { q: QuestaoParaTutor; resumo: string; pergunta: string }[] = [
  {
    q: questao('Um carro parte do repouso e atinge 72 km/h em 10 segundos. Sua aceleração média é:', ['1 m/s²', '2 m/s²', '7,2 m/s²', '10 m/s²', '20 m/s²'], 'B', 'Física', 'Cinemática'),
    resumo: 'Aceleração = variação da velocidade dividida pelo tempo. 72 km/h = 20 m/s; a = 20/10 = 2 m/s².',
    pergunta: 'como vc converteu km por hora em metros por segundo',
  },
  {
    q: questao('Um produto de R$ 80 tem desconto de 25%. Quanto passa a custar?', ['R$ 20', 'R$ 55', 'R$ 60', 'R$ 64', 'R$ 75'], 'C', 'Matemática', 'Porcentagem'),
    resumo: '25% de 80 = 20; 80 − 20 = 60.',
    pergunta: 'como voce achou 25% de 80 tao rapido?',
  },
  {
    q: questao('Uma solução tem 0,5 mol de NaCl em 250 mL. Qual a concentração em mol/L?', ['0,125', '0,5', '1', '2', '4'], 'D', 'Química', 'Soluções'),
    resumo: 'C = n / V. 250 mL = 0,25 L; C = 0,5 / 0,25 = 2 mol/L.',
    pergunta: 'como voce passou mL pra L?',
  },
];

async function main() {
  for (const c of CASOS) {
    const r = await pedirJson(promptConversa(c.q, c.resumo, [{ papel: 'aluno', texto: c.pergunta }]), validarRespostaTutor, {
      maxTokens: 1600, temperature: 0.5, modelo: MODELO_IA.conversa(), pensar: 'medium',
    });
    console.log('\nALUNO:', c.pergunta);
    if (!r.ok) { console.log('FALHOU:', r.erro); continue; }
    const visual = (r.dado as { visual?: { tipo?: string } | null }).visual;
    console.log('TUTOR:', (r.dado as { resposta: string }).resposta);
    console.log('VISUAL:', visual ? visual.tipo : 'nenhum', visual ? JSON.stringify(visual).slice(0, 200) : '');
  }
}
main();
