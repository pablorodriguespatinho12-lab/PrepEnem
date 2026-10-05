'use client';
import React, { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { renderizarTextoMatematico } from '@/lib/visual/texto-matematico';

interface MathTextProps {
  text: string;
  className?: string;
}

// LaTeX + markdown mínimo. O HTML sai de renderizarTextoMatematico, que escapa
// tudo fora das fórmulas — é isso que torna seguro o innerHTML abaixo.
export default function MathText({ text, className = '' }: MathTextProps) {
  const rendered = useMemo(() => renderizarTextoMatematico(text), [text]);

  return (
    <div
      className={`math-text prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
