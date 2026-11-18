/* "Prove você" da aba Descobrir: o código confere a escolha de cada linha. Acertou,
   a dedução anda uma linha; errou, fica e diz o que aconteceu com aquela escolha. */
import type { EtapaDaProva } from './tipos';

export type Resultado = { andou: true } | { andou: false; aviso: string };

export function conferirEscolha(etapa: Pick<EtapaDaProva, 'certa' | 'erros'>, escolha: number): Resultado {
  if (escolha === etapa.certa) return { andou: true };
  return { andou: false, aviso: etapa.erros[escolha] || 'Essa não solta a letra. Tente outra.' };
}

/** Problemas de uma etapa escrita à mão (o teste roda em todas as aulas). */
export function problemasDaEtapa(etapa: Pick<EtapaDaProva, 'certa' | 'erros' | 'opcoes' | 'pede'>): string[] {
  const p: string[] = [];
  if (etapa.opcoes.length < 2 || etapa.opcoes.length > 4) p.push('de 2 a 4 botões');
  if (etapa.certa < 0 || etapa.certa >= etapa.opcoes.length) p.push('a certa fora dos botões');
  if (etapa.erros.length !== etapa.opcoes.length) p.push('um aviso por botão');
  if (etapa.erros[etapa.certa]) p.push('a certa não tem aviso de erro');
  if (etapa.erros.some((e, i) => i !== etapa.certa && !e.trim())) p.push('botão errado sem aviso');
  if (new Set(etapa.opcoes).size !== etapa.opcoes.length) p.push('botões repetidos');
  if (!etapa.pede.trim()) p.push('sem pergunta');
  return p;
}
