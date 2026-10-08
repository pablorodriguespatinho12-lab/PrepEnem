'use client';
// Quadro de escola: a conta resolvida do jeito que o professor faz no quadro
// branco (Pablo, 08/10/2026, com a foto do quadro do Professor Ferretto:
// "exatamente desse jeito"). Dados da questão à esquerda; no meio a fórmula,
// o que cada letra é, os números no lugar das letras e o resultado em verde.
// A caneta escreve um bloco depois do outro, na ordem em que se resolve.

import { useContext, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle, RotateCcw } from 'lucide-react';
import MathText from '@/components/math-text';
import type { VisualQuadro } from '@/lib/visual/especificacao';
import { Caneta, prepararCaneta } from './caneta';
import { NaoEntendiContext } from './quadro';

const BOTAO = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors';
const ROTULO = 'type-caption font-semibold tracking-[var(--tracking-wide)] uppercase';

/* Ordem em que a caneta escreve. */
const DADOS = 0;
const FORMULA = 1;
const CONTAS = 2;
const RESULTADO = 3;
const FIM = 4;

/* Seta laranja do quadro: da fórmula até a conta com os números. */
function SetaTroca({ reduzir }: { reduzir: boolean }) {
  return (
    <svg viewBox="0 0 40 28" className="w-8 h-6 shrink-0" aria-hidden>
      <motion.path d="M6 2 C 6 16, 14 22, 32 22" fill="none" stroke="hsl(var(--quadro-laranja))" strokeWidth={2.4} strokeLinecap="round"
        initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }} />
      <motion.path d="M26 16 L33 22 L26 27" fill="none" stroke="hsl(var(--quadro-laranja))" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
        initial={reduzir ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, delay: 0.4 }} />
    </svg>
  );
}

export function QuadroEscola({ v }: { v: VisualQuadro }) {
  const reduzir = useReducedMotion() ?? false;
  const naoEntendi = useContext(NaoEntendiContext);
  const [etapa, setEtapa] = useState(DADOS);
  const [rodada, setRodada] = useState(0);
  const avancar = (de: number) => () => setEtapa((e) => (e === de ? de + 1 : e));
  const temContas = v.contas.length > 0;

  useEffect(() => { prepararCaneta([...v.dados, v.formula, ...v.contas, v.resultado]); }, [v]);

  const repetir = () => { setEtapa(DADOS); setRodada((r) => r + 1); };
  const aparece = { initial: { opacity: 0, y: reduzir ? 0 : 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

  return (
    <div className="space-y-3">
      <div className="quadro-escola rounded-[var(--radius-control)] px-4 py-4 md:px-6 md:py-5 grid gap-5 md:grid-cols-[minmax(9rem,auto)_1fr] md:gap-8"
        style={{ color: 'hsl(var(--quadro-tinta))' }}>
        {/* Os dados que a questão deu, como o professor anota no canto. */}
        <section aria-label="Dados da questão" className="md:pr-6 md:border-r border-dashed border-[hsl(var(--quadro-linha))]">
          <p className={`${ROTULO} mb-1`} style={{ color: 'hsl(var(--quadro-apagado))' }}>Dados</p>
          <Caneta key={`d${rodada}`} linhas={v.dados} onFim={avancar(DADOS)} />
        </section>

        <section aria-label="Resolução" className="min-w-0 space-y-2">
          {etapa >= FORMULA && (
            <div>
              <p className={`${ROTULO} mb-1`} style={{ color: 'hsl(var(--quadro-apagado))' }}>Fórmula</p>
              <Caneta key={`f${rodada}`} linhas={[v.formula]} onFim={avancar(FORMULA)} className="text-[1.15em]" />
              {v.legenda && etapa >= CONTAS && (
                <motion.ul {...aparece} className="mt-1 space-y-0.5 type-meta" style={{ color: 'hsl(var(--quadro-apagado))' }}>
                  {v.legenda.map((l) => <li key={l}><MathText text={l} /></li>)}
                </motion.ul>
              )}
            </div>
          )}

          {etapa >= CONTAS && temContas && (
            <div className="flex items-start gap-2 pt-1">
              <SetaTroca key={`s${rodada}`} reduzir={reduzir} />
              <div className="min-w-0 flex-1">
                <p className="type-meta" style={{ color: 'hsl(var(--quadro-laranja))' }}>troca as letras pelos números</p>
                <Caneta key={`c${rodada}`} linhas={v.contas} onFim={avancar(CONTAS)} />
              </div>
            </div>
          )}
          {etapa === CONTAS && !temContas && <EfeitoAvancar onFim={avancar(CONTAS)} />}

          {etapa >= RESULTADO && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1">
              <div className="rounded-[var(--radius-data)] px-2 border-2" style={{ borderColor: 'hsl(var(--quadro-verde))', color: 'hsl(var(--quadro-verde))' }}>
                <Caneta key={`r${rodada}`} linhas={[v.resultado]} onFim={avancar(RESULTADO)} />
              </div>
              {v.nota && etapa >= FIM && (
                <motion.div {...aparece} className="type-meta font-semibold max-w-xs" style={{ color: 'hsl(var(--quadro-verde))' }}>
                  <MathText text={v.nota} />
                </motion.div>
              )}
            </div>
          )}
        </section>
      </div>

      {etapa >= FIM && (
        <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <button type="button" onClick={repetir} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
            <RotateCcw className="w-4 h-4" /> Escrever de novo
          </button>
          {naoEntendi && (
            <button type="button" className={`${BOTAO} bg-muted hover:bg-muted/80`}
              onClick={() => naoEntendi(`Não entendi o quadro: $${v.formula}$ virou $${v.resultado}$. Explica de outro jeito?`)}>
              <HelpCircle className="w-4 h-4" /> Não entendi
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* Quadro sem linha de conta: pula direto para o resultado. */
function EfeitoAvancar({ onFim }: { onFim: () => void }) {
  useEffect(() => { onFim(); }, [onFim]);
  return null;
}
