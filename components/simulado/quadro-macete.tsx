'use client';
// O macete num quadro branco (Pablo, 14/11/2026: "não entendi nada do macete, faz um
// quadro"). Antes era um parágrafo, 4 itens e o exemplo numa frase só. Agora: o nome
// grande, a regra curta e o exemplo resolvido uma conta por linha, como no quadro da
// escola, com a resposta em verde. As linhas entram uma de cada vez.

import { motion, useReducedMotion } from 'framer-motion';
import type { Macete } from '@/lib/aulas-dia-2';

const ATRASO_POR_LINHA = 0.35;

export function QuadroMacete({ m, comPassos = true }: { m: Macete; comPassos?: boolean }) {
  const reduzir = useReducedMotion();
  const linhas = m.quadro ?? [];
  const ultima = linhas.length - 1;

  return (
    <div className="space-y-3">
      <p className="font-reading type-lead">{m.regra}</p>

      {linhas.length > 0 && (
        <div className="quadro-escola rounded-[var(--radius-control)] px-4 py-3 md:px-5" style={{ color: 'hsl(var(--quadro-tinta))' }}>
          <p className="type-caption font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: 'hsl(var(--quadro-laranja))' }}>
            Exemplo
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-baseline">
            {linhas.map(([rotulo, conta], i) => {
              const fim = i === ultima;
              // Opacidade no dt e no dd: num wrapper "contents" ela não chega aos filhos.
              const entrada = {
                initial: reduzir ? false : { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: reduzir ? 0 : i * ATRASO_POR_LINHA, duration: 0.25 },
              } as const;
              return [
                <motion.dt key={`r${i}`} {...entrada} className="type-meta font-medium" style={{ color: 'hsl(var(--quadro-apagado))' }}>
                  {rotulo}
                </motion.dt>,
                <motion.dd
                  key={`c${i}`}
                  {...entrada}
                  className={`font-reading ${fim ? 'type-lead font-bold' : 'type-body font-semibold'}`}
                  style={fim ? { color: 'hsl(var(--quadro-verde))' } : undefined}
                >
                  {conta}
                </motion.dd>,
              ];
            })}
          </dl>
        </div>
      )}

      {comPassos && m.passos.length > 0 && (
        <div>
          <p className="type-caption font-medium text-muted-foreground mb-1">Também serve para</p>
          <ul className="space-y-1 font-reading type-meta text-foreground/85">
            {m.passos.map((p) => <li key={p} className="flex gap-2"><span aria-hidden className="text-primary-text">•</span>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
