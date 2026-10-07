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
import { Latex } from './grafico';

/* Quem mostra o quadro decide para onde vai o "Não entendi" (painel de dúvida
   da lição, conversa do tutor). Sem provedor, o botão não aparece. */
export const NaoEntendiContext = createContext<((pergunta: string) => void) | null>(null);

export interface ParteDoQuadro { latex: string; porque?: string; lado?: string }

const BOTAO = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors';

/* "condicao" fica no canto (a ≠ 0), "ajuda" num cantinho ao lado com a peça
   usada no meio da conta: o quadro do Universo Narrado (Pablo, 07/10/2026). */
export function Quadro({ partes, condicao, ajuda }: { partes: ParteDoQuadro[]; condicao?: string; ajuda?: string[] }) {
  const reduzir = useReducedMotion() ?? false;
  const naoEntendi = useContext(NaoEntendiContext);
  const [atual, setAtual] = useState(0);
  const [escrita, setEscrita] = useState(false);
  const [rodada, setRodada] = useState(0);

  useEffect(() => { prepararCaneta([...partes.map((p) => p.latex), ...(ajuda ?? [])]); }, [partes, ajuda]);

  const ultima = atual === partes.length - 1;
  const continuar = () => { setAtual((a) => a + 1); setEscrita(false); };
  const repetir = () => { setRodada((r) => r + 1); setEscrita(false); };
  const recomecar = () => { setAtual(0); setRodada((r) => r + 1); setEscrita(false); };
  const parte = partes[atual];

  return (
    <div className="rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] border border-border px-4 py-3 space-y-3">
      {condicao && (
        <p className="type-meta font-semibold" style={{ color: 'hsl(var(--chart-2))' }}><Latex fonte={condicao} /></p>
      )}
      {ajuda && (
        <aside className="rounded-[var(--radius-control)] border border-dashed border-border px-3 py-2 flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Peça usada na conta">
          <span className="type-caption text-muted-foreground">Ajuda</span>
          {ajuda.map((a) => <Caneta key={a} linhas={[a]} className="text-[0.8em]" />)}
        </aside>
      )}
      <ol className="space-y-2 min-w-0">
        {partes.slice(0, atual + 1).map((p, i) => (
          <li key={i}>
            <Caneta key={`${i}-${rodada}`} linhas={[p.latex]} jaEscrita={i < atual}
              onFim={i === atual ? () => setEscrita(true) : undefined}
              className={i < atual ? 'opacity-70 t-colors' : undefined} />
            {(p.porque || p.lado) && (i < atual || escrita) && (
              <motion.div className="type-meta text-muted-foreground" initial={{ opacity: 0, y: reduzir ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                {/* A operação feita, como o professor anota ao lado da linha. */}
                {p.lado && <span className="inline-block mr-2 px-1.5 rounded-[var(--radius-data)] bg-muted text-foreground font-semibold"><Latex fonte={p.lado} /></span>}
                {p.porque && <MathText text={p.porque} />}
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
