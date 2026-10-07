'use client';
// Exercício de desenhar (Pablo, 06/10/2026): ele risca os eixos e a reta com o
// dedo ou o mouse; cada traço vira linha reta na hora, desenhada como caneta.
// A conferência é conta (lib/calculo/desenho.ts), nunca palpite.

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Eraser, Undo2, X } from 'lucide-react';
import { ajustarTraco, conferirDesenho, type Conferencia, type Ponto, type TracoAjustado } from '@/lib/calculo/desenho';
import { COR, EIXO, GRADE, HALO } from '@/components/visual/grafico';

const LIMITE = 5; // quadriculado de -5 a 5
const UNIDADE = 30;
const MARGEM = 20;
const LADO = 2 * MARGEM + 2 * LIMITE * UNIDADE;
/* Distância mínima entre pontos guardados do traço (em quadradinhos). */
const PASSO_MINIMO = 0.06;

const px = (x: number) => MARGEM + (x + LIMITE) * UNIDADE;
const py = (y: number) => MARGEM + (LIMITE - y) * UNIDADE;
const QUADRADOS = Array.from({ length: 2 * LIMITE + 1 }, (_, i) => i - LIMITE);

interface Props {
  reta: { a: number; b: number };
  respondido: boolean;
  onResponder: (acertou: boolean) => void;
}

function Linha({ t, cor, tracejada = false, reduzir }: { t: TracoAjustado; cor: string; tracejada?: boolean; reduzir: boolean }) {
  return (
    <motion.line x1={px(t.de.x)} y1={py(t.de.y)} x2={px(t.ate.x)} y2={py(t.ate.y)}
      stroke={cor} strokeWidth={3} strokeLinecap="round" strokeDasharray={tracejada ? '6 6' : undefined}
      // pathLength usa o dasharray por baixo: a tracejada aparece por opacidade.
      initial={tracejada ? { opacity: 0 } : { pathLength: 0 }} animate={tracejada ? { opacity: 1 } : { pathLength: 1 }}
      transition={{ duration: reduzir ? 0 : 0.35, ease: [0.2, 0.8, 0.2, 1] }} />
  );
}

export function DesenharReta({ reta, respondido, onResponder }: Props) {
  const reduzir = useReducedMotion() ?? false;
  const svg = useRef<SVGSVGElement>(null);
  const [tracos, setTracos] = useState<TracoAjustado[]>([]);
  const [atual, setAtual] = useState<Ponto[] | null>(null);
  const [resultado, setResultado] = useState<Conferencia | null>(null);

  const paraPonto = (e: React.PointerEvent): Ponto => {
    const r = svg.current!.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * LADO;
    const sy = ((e.clientY - r.top) / r.height) * LADO;
    return { x: (sx - MARGEM) / UNIDADE - LIMITE, y: LIMITE - (sy - MARGEM) / UNIDADE };
  };

  const comecar = (e: React.PointerEvent<SVGSVGElement>) => {
    if (respondido) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setAtual([paraPonto(e)]);
  };
  const mover = (e: React.PointerEvent) => {
    if (!atual) return;
    const p = paraPonto(e);
    const ultimo = atual[atual.length - 1];
    if (Math.hypot(p.x - ultimo.x, p.y - ultimo.y) >= PASSO_MINIMO) setAtual([...atual, p]);
  };
  const terminar = () => {
    if (!atual) return;
    const ajustado = ajustarTraco(atual);
    setAtual(null);
    if (ajustado) setTracos([...tracos, ajustado]);
  };

  const conferir = () => {
    const r = conferirDesenho(tracos, reta);
    setResultado(r);
    onResponder(r.certo);
  };

  const gabarito: TracoAjustado = {
    tipo: 'reta',
    de: { x: -LIMITE, y: reta.a * -LIMITE + reta.b },
    ate: { x: LIMITE, y: reta.a * LIMITE + reta.b },
  };

  return (
    <div className="space-y-3">
      <p className="type-meta text-muted-foreground">Risque com o dedo ou o mouse: os dois eixos e depois a reta. Cada risco fica reto sozinho.</p>
      <svg ref={svg} viewBox={`0 0 ${LADO} ${LADO}`} role="img" aria-label="Quadriculado para desenhar os eixos e a reta"
        className="w-full max-w-[22rem] rounded-[var(--radius-surface)] bg-[hsl(var(--surface-2))] border border-border select-none"
        style={{ touchAction: 'none', cursor: respondido ? 'default' : 'crosshair' }}
        onPointerDown={comecar} onPointerMove={mover} onPointerUp={terminar} onPointerCancel={terminar}>
        <defs>
          <clipPath id="quadro-desenho"><rect x={MARGEM} y={MARGEM} width={LADO - 2 * MARGEM} height={LADO - 2 * MARGEM} /></clipPath>
        </defs>
        {QUADRADOS.map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={py(LIMITE)} x2={px(v)} y2={py(-LIMITE)} stroke={GRADE} strokeWidth={1} />
            <line x1={px(-LIMITE)} y1={py(v)} x2={px(LIMITE)} y2={py(v)} stroke={GRADE} strokeWidth={1} />
          </g>
        ))}
        <g clipPath="url(#quadro-desenho)">
          {respondido && resultado && !resultado.certo && <Linha t={gabarito} cor={COR.b} tracejada reduzir={reduzir} />}
          {tracos.map((t, i) => (
            <Linha key={i} t={t} reduzir={reduzir}
              cor={t.tipo === 'reta' ? COR.a : t.tipo === 'rabisco' ? COR.erro : EIXO} tracejada={t.tipo === 'rabisco'} />
          ))}
          {atual && atual.length > 1 && (
            <polyline points={atual.map((p) => `${px(p.x)},${py(p.y)}`).join(' ')}
              fill="none" stroke={COR.a} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          )}
        </g>
        {tracos.filter((t) => t.tipo === 'eixoX' || t.tipo === 'eixoY').map((t, i) => (
          <text key={`r${i}`} {...HALO} fill={EIXO} fontSize={14} fontWeight={600}
            x={t.tipo === 'eixoX' ? Math.min(px(t.ate.x) + 4, LADO - 12) : px(0) + 8}
            y={t.tipo === 'eixoX' ? py(0) - 8 : Math.max(py(t.ate.y) + 4, 16)}>
            {t.tipo === 'eixoX' ? 'x' : 'y'}
          </text>
        ))}
      </svg>

      {!respondido && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTracos(tracos.slice(0, -1))} disabled={tracos.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] border border-border type-meta t-colors enabled:hover:bg-muted disabled:opacity-40">
            <Undo2 className="w-4 h-4" /> Desfazer
          </button>
          <button type="button" onClick={() => setTracos([])} disabled={tracos.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-control)] border border-border type-meta t-colors enabled:hover:bg-muted disabled:opacity-40">
            <Eraser className="w-4 h-4" /> Apagar
          </button>
          <button type="button" onClick={conferir} disabled={tracos.length === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta disabled:opacity-50 t-colors hover:bg-[hsl(var(--primary-hover))]">
            Conferir
          </button>
        </div>
      )}

      {resultado && (
        <div role="status" className="space-y-1">
          <p className="inline-flex items-center gap-1 type-meta font-semibold"
            style={{ color: resultado.certo ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
            {resultado.certo ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
            {resultado.certo ? 'Certo: eixos e reta no lugar' : 'Ainda não. A reta certa está tracejada.'}
          </p>
          {resultado.falta.map((f) => <p key={f} className="type-meta">{f}</p>)}
        </div>
      )}
    </div>
  );
}
