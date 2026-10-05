'use client';
// Campo de resposta: número (aceita vírgula) ou múltipla escolha. Confere na
// hora e devolve se acertou — feedback imediato, sem esperar o fim da lição.

import { useId, useState } from 'react';
import { Check, X } from 'lucide-react';
import MathText from '@/components/math-text';
import { conferirResposta, type Resposta } from '@/lib/calculo/tipos';

interface Props {
  resposta: Resposta;
  onResponder: (acertou: boolean) => void;
  /* Depois de respondido, trava o campo e mostra certo/errado. */
  respondido: boolean;
}

export function RespostaInput({ resposta, onResponder, respondido }: Props) {
  const campoId = useId();
  const [valor, setValor] = useState('');
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [acertou, setAcertou] = useState<boolean | null>(null);

  const enviar = (dado: string | number) => {
    if (respondido) return;
    const ok = conferirResposta(resposta, dado);
    setAcertou(ok);
    onResponder(ok);
  };

  const marca = acertou !== null && (
    <span className="inline-flex items-center gap-1 type-meta font-semibold" role="status"
      style={{ color: acertou ? 'hsl(var(--success))' : 'hsl(var(--danger))' }}>
      {acertou ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
      {acertou ? 'Certo' : resposta.tipo === 'numero' ? `Não. A resposta é ${String(resposta.valor).replace('.', ',')}` : 'Não é essa'}
    </span>
  );

  if (resposta.tipo === 'escolha') {
    return (
      <div className="space-y-2">
        {resposta.opcoes.map((op, i) => {
          const certa = respondido && i === resposta.correta;
          const errada = respondido && i === escolhida && i !== resposta.correta;
          return (
            <button key={i} disabled={respondido}
              onClick={() => { setEscolhida(i); enviar(i); }}
              className="w-full text-left px-4 py-3 rounded-[var(--radius-control)] border t-colors enabled:hover:bg-muted disabled:cursor-default"
              style={{
                borderColor: certa ? 'hsl(var(--success-border))' : errada ? 'hsl(var(--danger-border))' : 'hsl(var(--border))',
                backgroundColor: certa ? 'hsl(var(--success-surface))' : errada ? 'hsl(var(--danger-surface))' : undefined,
              }}>
              <MathText text={op} className="font-reading" />
            </button>
          );
        })}
        {marca}
      </div>
    );
  }

  return (
    <form className="flex flex-wrap items-center gap-3" onSubmit={(e) => { e.preventDefault(); if (valor.trim()) enviar(valor); }}>
      <label className="sr-only" htmlFor={campoId}>Sua resposta</label>
      <input id={campoId} inputMode="decimal" autoComplete="off" value={valor} disabled={respondido}
        onChange={(e) => setValor(e.target.value)} placeholder="sua resposta"
        className="w-40 px-3 py-2.5 border border-input rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      {!respondido && (
        <button type="submit" disabled={!valor.trim()}
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta disabled:opacity-50 t-colors hover:bg-[hsl(var(--primary-hover))]">
          Conferir
        </button>
      )}
      {marca}
    </form>
  );
}
