'use client';
// Processo em etapas, animado: o que entra cai na etapa, o que sai desce dela,
// e o que uma etapa entrega para a outra anda pela seta entre elas (ex.:
// fotossíntese, fase clara → ATP e NADPH → fase escura). Pedido do Pablo em
// 06/10/2026: processo em desenho, não em texto, e sempre animado.
// Só transform e opacity (classes .fluxo-* em globals.css).

import type { VisualProcesso } from '@/lib/visual/especificacao';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { COR } from './grafico';

const CORES = [COR.a, COR.b, COR.c];

function Chip({ texto, cor }: { texto: string; cor?: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full type-caption font-semibold normal-case tracking-normal border"
      style={cor ? { color: cor, borderColor: cor } : { borderColor: 'hsl(var(--border))' }}>
      {texto}
    </span>
  );
}

/* Seta vertical: linha, ponta e um ponto descendo por ela, em laço. O ponto
   não é cortado pela linha (antes parecia um tracinho). */
function SetaDesce({ cor, atraso, alta = false }: { cor: string; atraso: number; alta?: boolean }) {
  return (
    <div className={`relative ${alta ? 'h-10' : 'h-8'} w-4 flex flex-col items-center`} aria-hidden>
      <span className="absolute inset-y-0 left-1/2 w-0.5 -ml-px bg-border" />
      <span className="fluxo-desce absolute left-1/2 top-0 w-2.5 h-2.5 -ml-[5px] rounded-full" style={{ background: cor, animationDelay: `${atraso}s` }} />
      <ChevronDown className="absolute -bottom-2 w-4 h-4 text-muted-foreground" />
    </div>
  );
}
/* Seta horizontal entre etapas (computador): o ponto atravessa de uma etapa à outra. */
function SetaAnda({ cor }: { cor: string }) {
  return (
    <div className="relative w-full h-4" aria-hidden>
      <span className="absolute inset-x-0 top-1/2 h-0.5 -mt-px bg-border" />
      <span className="fluxo-anda absolute inset-0">
        <span className="absolute left-0 top-1/2 w-2.5 h-2.5 -mt-[5px] -ml-[5px] rounded-full" style={{ background: cor }} />
      </span>
      <ChevronRight className="absolute -right-2 top-1/2 -mt-2 w-4 h-4 text-muted-foreground" />
    </div>
  );
}
export function Processo({ v }: { v: VisualProcesso }) {
  const ligacaoEntre = (i: number) => v.ligacoes.find((l) => l.de === i && l.para === i + 1);
  const outras = v.ligacoes.filter((l) => l.para !== l.de + 1);
  const descricao = v.etapas.map((e) => `${e.nome}: entra ${e.entra.join(', ') || 'nada'}, sai ${e.sai.join(', ') || 'nada'}`).join('. ');

  return (
    <div className="space-y-3" role="img" aria-label={descricao}>
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-2">
        {v.etapas.map((e, i) => {
          const cor = CORES[i % CORES.length];
          const liga = ligacaoEntre(i);
          return (
            <div key={i} className="contents">
              <div className="flex flex-col items-center gap-1.5 min-w-[9rem]">
                <div className="flex flex-wrap justify-center gap-1 min-h-[1.75rem] items-end">
                  {e.entra.map((m) => <Chip key={m} texto={m} />)}
                </div>
                {e.entra.length > 0 && <SetaDesce cor="hsl(var(--muted-foreground))" atraso={i * 0.4} />}
                <div className="w-full rounded-[var(--radius-control)] border-2 px-3 py-3 text-center font-display type-body font-semibold"
                  style={{ borderColor: cor, background: `color-mix(in srgb, ${cor} 12%, transparent)` }}>
                  {e.nome}
                </div>
                {e.sai.length > 0 && <SetaDesce cor={cor} atraso={i * 0.4 + 0.8} />}
                <div className="flex flex-wrap justify-center gap-1 min-h-[1.75rem]">
                  {e.sai.map((m) => <Chip key={m} texto={m} cor={cor} />)}
                </div>
              </div>
              {i < v.etapas.length - 1 && (
                <div className="flex flex-col items-center justify-center gap-1.5 md:min-w-[7rem] md:px-1 py-1" aria-hidden>
                  {liga && <Chip texto={liga.leva} cor={CORES[(i + 1) % CORES.length]} />}
                  {/* No celular as etapas empilham e a seta desce; no computador ela anda para o lado. */}
                  <div className="md:hidden"><SetaDesce cor={CORES[(i + 1) % CORES.length]} atraso={0.3} alta /></div>
                  <div className="hidden md:block w-full"><SetaAnda cor={CORES[(i + 1) % CORES.length]} /></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {outras.length > 0 && (
        <p className="type-caption text-muted-foreground text-center normal-case tracking-normal">
          {outras.map((l) => `${v.etapas[l.de].nome} entrega ${l.leva} para ${v.etapas[l.para].nome}`).join(' · ')}
        </p>
      )}
    </div>
  );
}
