'use client';
// Quadro: a resolução escrita pela caneta, uma parte por vez. Termina a parte,
// aparece o porquê pequeno embaixo e três botões: Continuar, Repetir e Não
// entendi (Pablo, 07/10/2026: "como um professor escrevendo pra mim ao vivo").
// "Não entendi" manda a pergunta para a IA ao lado, quando a tela tem uma.

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, HelpCircle, RotateCcw } from 'lucide-react';
import MathText from '@/components/math-text';
import { Caneta, prepararCaneta } from './caneta';

/* Quem mostra o quadro decide para onde vai o "Não entendi" (painel de dúvida
   da lição, conversa do tutor). Sem provedor, o botão não aparece. */
export const NaoEntendiContext = createContext<((pergunta: string) => void) | null>(null);

export interface ParteDoQuadro { latex: string; porque?: string }

const BOTAO = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors';

export function Quadro({ partes }: { partes: ParteDoQuadro[] }) {
  const reduzir = useReducedMotion() ?? false;
  const naoEntendi = useContext(NaoEntendiContext);
  const [atual, setAtual] = useState(0);
  const [escrita, setEscrita] = useState(false);
  const [rodada, setRodada] = useState(0);

  useEffect(() => { prepararCaneta(partes.map((p) => p.latex)); }, [partes]);

  const ultima = atual === partes.length - 1;
  const continuar = () => { setAtual((a) => a + 1); setEscrita(false); };
  const repetir = () => { setRodada((r) => r + 1); setEscrita(false); };
  const recomecar = () => { setAtual(0); setRodada((r) => r + 1); setEscrita(false); };
  const parte = partes[atual];

  return (
    <div className="rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] border border-border px-4 py-3 space-y-3">
      <ol className="space-y-2">
        {partes.slice(0, atual + 1).map((p, i) => (
          <li key={i}>
            <Caneta key={`${i}-${rodada}`} linhas={[p.latex]} jaEscrita={i < atual}
              onFim={i === atual ? () => setEscrita(true) : undefined}
              className={i < atual ? 'opacity-70 t-colors' : undefined} />
            {p.porque && (i < atual || escrita) && (
              <motion.div initial={{ opacity: 0, y: reduzir ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <MathText text={p.porque} className="type-meta text-muted-foreground block" />
              </motion.div>
            )}
          </li>
        ))}
      </ol>

      {escrita && (
        <motion.div className="flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {!ultima && (
            <button type="button" onClick={continuar} className={`${BOTAO} bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]`}>
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button type="button" onClick={repetir} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
            <RotateCcw className="w-4 h-4" /> Repetir
          </button>
          {ultima && partes.length > 1 && (
            <button type="button" onClick={recomecar} className={`${BOTAO} bg-muted hover:bg-muted/80`}>
              <RotateCcw className="w-4 h-4" /> Ver tudo de novo
            </button>
          )}
          {naoEntendi && (
            <button type="button" className={`${BOTAO} bg-muted hover:bg-muted/80`}
              onClick={() => naoEntendi(`Não entendi esta parte: $${parte.latex}$${parte.porque ? ` (${parte.porque})` : ''}. Explica de outro jeito?`)}>
              <HelpCircle className="w-4 h-4" /> Não entendi
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
