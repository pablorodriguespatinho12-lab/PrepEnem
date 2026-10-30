// Baralho "Coringas da redação" (Pablo, 30/10/2026: "tem que decorar os
// argumentos para conseguir fazer uma boa redação"). Os cartões saem de
// CORINGAS (autores.ts), a mesma fonte das fichas do Treino por partes.
// Informação mínima (flashcard-pattern): 2 cartões por coringa.
// - "Quando usar": o argumento leva ao coringa. É o que o aluno precisa na
//   prova: olhar o tema, achar o mecanismo e lembrar quem disse.
// - "Complete": o começo leva à frase exata. A dica é a imagem, que foi o que
//   os 3 alunos do teste guardaram (lírio, santo e comunista, bicho, batatas).

import { CORINGAS } from './autores';

export interface Cartao { frente: string; verso: string; dica: string }

/* O argumento que cada coringa prova e a imagem que ajuda a lembrar. */
export const MEMORIA: Record<string, { mecanismo: string; imagem: string }> = {
  Drummond: { mecanismo: 'a lei existe, mas não resolve', imagem: 'Uma flor e um decreto.' },
  'Dom Hélder': { mecanismo: 'ajudar não basta, é preciso atacar a causa', imagem: 'Dois apelidos: um elogio e uma acusação.' },
  'Rui Barbosa': { mecanismo: 'tratar igual quem é desigual é injusto', imagem: 'Dar o mesmo a quem começou atrás.' },
  'Elie Wiesel': { mecanismo: 'a sociedade ignora quem sofre', imagem: 'Fingir que não vê quem sofre.' },
  Graciliano: { mecanismo: 'tratado como menos que gente', imagem: 'Um sertanejo pobre e a seca.' },
  'Luther King': { mecanismo: 'a injustiça contra um grupo ameaça todos', imagem: 'Escrita atrás das grades, em 1963.' },
  Machado: { mecanismo: 'quem vence leva tudo, quem perde ganha pena', imagem: 'Um prêmio que se come.' },
  'Dado 1888': { mecanismo: 'a herança da escravidão', imagem: 'Treze de maio.' },
};

/* Corta a frase no meio, numa palavra: o cartão mostra o começo. */
function comeco(texto: string): string {
  const palavras = texto.split(' ');
  return `${palavras.slice(0, Math.max(3, Math.ceil(palavras.length / 2))).join(' ')}...`;
}

export function cartoesDosCoringas(): Cartao[] {
  const cartoes: Cartao[] = [];
  for (const [chave, k] of Object.entries(CORINGAS)) {
    const m = MEMORIA[chave];
    if (!m) continue;
    const onde = k.restricao ? ` Use em temas como: ${k.restricao.replace(/^serviu em temas de /, '')}.` : '';
    const frase = k.tipo === 'fala' ? `"${k.texto}"` : k.texto;
    const assinatura = k.tipo === 'fala' ? `${k.rotulo}, ${k.fonte} (${k.quando})` : `${k.fonte}`;
    cartoes.push({
      frente: `Coringa para: ${m.mecanismo}`,
      verso: `${assinatura}: ${k.curta ?? frase}${onde}`,
      dica: m.imagem,
    });
    cartoes.push({
      frente: k.tipo === 'fala' ? `${k.rotulo}: "${comeco(k.texto)}"` : `Dado: ${k.rotulo}. Qual é?`,
      verso: frase,
      dica: m.imagem,
    });
  }
  cartoes.push({
    frente: 'Como ligar um coringa ao tema?',
    verso: 'Cite quem disse, explique com suas palavras e mostre no tema: "Isso se vê no Brasil quando [um fato do tema]".',
    dica: 'Cita, explica, amarra.',
  });
  return cartoes;
}
