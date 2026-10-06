'use client';
// A explicação antiga da questão importada, atrás de um clique e sem emoji. A
// explicação curta com desenho (ExplicacaoTutor) vem primeiro (Pablo,
// 06/10/2026: "resposta curta, curta mesmo").

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import MathText from '@/components/math-text';
import { limparExplicacaoAntiga } from '@/lib/explicacao-antiga';

export function TextoCompleto({ texto }: { texto: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}
        className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`} />
        {aberto ? 'Esconder o texto completo' : 'Ver texto completo'}
      </button>
      {aberto && (
        <div className="prose-reading mt-3">
          <MathText text={limparExplicacaoAntiga(texto)} />
        </div>
      )}
    </div>
  );
}
