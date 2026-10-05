// Prompt de geração de lição da trilha. Segue o formato e o tom das lições
// escritas à mão (data/calculo/licoes): a melhor instrução é um exemplo real.

import { FORMATO_VISUAL_PARA_IA } from '@/lib/visual/especificacao';
import type { ConteudoLicao, Degrau } from './tipos';

/* Um pedaço de cada seção da lição escrita, não ela inteira: a lição inteira
   são ~6 mil tokens, e o limite da Groq gratuita é 8 mil por minuto somando
   pedido e resposta. O pedaço mostra formato e tom do mesmo jeito. */
function amostra(l: ConteudoLicao): Partial<ConteudoLicao> {
  return {
    gancho: l.gancho,
    construcao: l.construcao.slice(1, 2),
    resumo: l.resumo,
    exemplos: [l.exemplos[1]],
    exercicios: l.exercicios.slice(0, 1),
    recuperacao: l.recuperacao,
  };
}
export function promptLicao(degrau: Degrau, anteriores: Degrau[], exemplo: ConteudoLicao): string {
  const base = anteriores.map((d) => `- ${d.titulo}: ${d.objetivo}`).join('\n') || '- (é a primeira lição)';
  return `Você escreve uma lição de uma trilha de pré-cálculo a cálculo para um estudante que vai cursar engenharia, tem TDAH e diz que se assusta com cálculo. Ele quer ENTENDER COMO O RACIOCÍNIO FOI CONSTRUÍDO, não decorar fórmula. Resolva cada conta você mesmo, com cuidado, antes de escrever: a lição não pode ter erro de conta nem passo pulado.

LIÇÃO: ${degrau.titulo}
PERGUNTA QUE MOVE A LIÇÃO: ${degrau.pergunta}
OBJETIVO: ${degrau.objetivo}

O QUE ELE JÁ VIU (use, não reexplique):
${base}

ORDEM DA LIÇÃO (é a ordem da pesquisa sobre aprendizagem, não mude):
1. "gancho": uma situação concreta com uma pergunta que ele tenta responder de cabeça ANTES da explicação; "ideia" é a resposta curta.
2. "construcao": de 4 a 6 passos que CONSTROEM a ideia: concreto → desenho → símbolo. A fórmula só aparece no fim, como resumo do que ele já viu. Use visual em quase todo passo. Use "transformacao" para mostrar de onde a fórmula sai, linha a linha, com o porquê.
3. "resumo": a fórmula ou regra, curta, com o significado de cada símbolo.
4. "exemplos": EXATAMENTE 3. O 1º totalmente resolvido: NENHUM passo dele tem o campo "lacuna". O 2º com o ÚLTIMO passo como lacuna. O 3º com os DOIS últimos passos como lacuna. Cada passo diz o porquê.
5. "exercicios": 5, do mais fácil ao mais difícil, cada um com dica e resolução comentada.
   RESPOSTA SÓ DE DOIS TIPOS: {"tipo":"numero","valor":3} ou {"tipo":"escolha","opcoes":[...],"correta":0}. Não existe tipo "texto". Se a resposta é uma expressão, um ponto, um par de números ou uma palavra ("para baixo", "(2, 5)", "2 e −4"), faça uma pergunta de escolha com 4 opções plausíveis.
6. "recuperacao": uma pergunta para responder de cabeça.

ESTILO: frases curtas, palavras simples, um conceito por passo. Zero emoji, zero elogio, nada de "É importante notar". LaTeX para toda matemática ($...$). Use [[a:termo]] para ligar o termo à cor do traço no desenho.
Lacuna: fica DENTRO do passo que ela esconde. O passo tem "texto" (a conta completa, com o resultado) e "porque", e a lacuna pergunta o resultado DESSE passo: {"texto": "$x_v = \\frac{6}{2} = 3$", "porque": "...", "lacuna": {"pergunta": "Quanto vale $x_v$?", "resposta": {"tipo": "numero", "valor": 3}}}. Nunca crie passo vazio só para a lacuna. Resposta numérica exata; se for irracional, use escolha.
NENHUMA fórmula pode aparecer "dada" ("use a fórmula do vértice"): se a lição usa uma fórmula, um passo da construção mostra de onde ela sai.

${FORMATO_VISUAL_PARA_IA}

TRECHOS DE UMA LIÇÃO PRONTA (mesmo formato e tom; a sua tem TODAS as seções completas, com as quantidades pedidas acima):
${JSON.stringify(amostra(exemplo))}

Devolva SOMENTE o JSON da lição, com as chaves: gancho, construcao, resumo, exemplos, exercicios, recuperacao.`;
}
