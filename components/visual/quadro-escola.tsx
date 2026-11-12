'use client';
// Quadro de escola: a conta resolvida do jeito que o professor faz no quadro
// branco (Pablo, 08/10/2026, com a foto do quadro do Professor Ferretto).
// Forma da prévia escolhida em 15/10/2026 (artefato 15stmsNn2K6a3xQEzfwLaj,
// "assim que eu quero"): compacto e inteiro de uma vez, sem rótulos nem
// botões. Dados à esquerda; à direita a fórmula, "troca as letras pelos
// números" em laranja (só se a fórmula tem "=") e as contas, com o resultado em verde. Antes a caneta
// escrevia bloco por bloco e o quadro ocupava a coluna toda.

import { useEffect } from 'react';
import type { VisualQuadro } from '@/lib/visual/especificacao';
import { Caneta, prepararCaneta } from './caneta';

export function QuadroEscola({ v }: { v: VisualQuadro }) {
  useEffect(() => { prepararCaneta([...v.dados, v.formula, ...v.contas, v.resultado]); }, [v]);

  // A última conta costuma já terminar no resultado; se não, ele vem embaixo.
  const ultima = v.contas[v.contas.length - 1] ?? '';
  const resultadoNaConta = ultima.replace(/\s/g, '').endsWith(v.resultado.replace(/\s/g, '').split('=').pop() ?? '');
  const contas = resultadoNaConta ? v.contas.slice(0, -1) : v.contas;
  // Só há letras para trocar quando a fórmula é uma igualdade com conta em número.
  // Num quadro de Biologia ("Transcrição → RNA") a frase não fazia sentido.
  const trocaLetras = v.formula.includes('=') && /\d/.test(v.contas.join(''));

  return (
    // flex-wrap: em caixa estreita a resolução desce para baixo dos dados em
    // vez de ficar espremida e cortada (tutor em tela grande, 23/10/2026).
    <div
      // Na tela do passo da aula (.passo-visual: caixa larga e baixa) fica sempre deitado:
      // quebrado em pé, a lanterna media 420 px de alto e encolhia para 60% (12/11/2026).
      className="quadro-escola rounded-[var(--radius-control)] px-4 py-3.5 md:px-5 md:py-4 flex flex-wrap sm:[.passo-visual_&]:flex-nowrap gap-3 gap-x-5 md:gap-x-6 items-start"
      style={{ color: 'hsl(var(--quadro-tinta))' }}
    >
      {/* Os dados que a questão deu, como o professor anota no canto. */}
      <section aria-label="Dados da questão" className="max-w-full pr-4 md:pr-5 border-r border-dashed border-[hsl(var(--quadro-linha))] text-[0.9em]">
        <Caneta linhas={v.dados} jaEscrita />
      </section>

      {/* 11rem e não 18rem: com 18rem o quadro do passo (caixa de 508 px) quebrava
          em pé no computador do Pablo e encolhia até ficar ilegível (12/11/2026). */}
      <section aria-label="Resolução" className="flex-1 min-w-[min(100%,11rem)] space-y-1.5">
        <Caneta linhas={[v.formula]} jaEscrita className="text-[1.1em]" />
        {trocaLetras && (
          <p className="type-meta font-medium" style={{ color: 'hsl(var(--quadro-laranja))' }}>
            troca as letras pelos números →
          </p>
        )}
        {contas.length > 0 && <Caneta linhas={contas} jaEscrita />}
        {resultadoNaConta ? (
          <div style={{ color: 'hsl(var(--quadro-verde))' }}><Caneta linhas={[ultima]} jaEscrita /></div>
        ) : (
          <div style={{ color: 'hsl(var(--quadro-verde))' }}><Caneta linhas={[v.resultado]} jaEscrita /></div>
        )}
      </section>
    </div>
  );
}
