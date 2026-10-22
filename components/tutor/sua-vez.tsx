'use client';
// Última tela da explicação: uma questão parecida para o aluno tentar.
// Com opções, ele toca na resposta; sem elas, responde de cabeça e confere.

import { useState } from 'react';
import { Eye } from 'lucide-react';
import MathText from '@/components/math-text';
import type { Explicacao } from '@/lib/tutor/validar';

type Checagem = NonNullable<Explicacao['checagem']>;

export function SuaVez({ checagem }: { checagem: Checagem }) {
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [aberta, setAberta] = useState(false);
  const { opcoes, certa } = checagem;

  if (!opcoes || !certa) {
    return (
      <div className="grid gap-3 w-full">
        <p className="type-caption text-muted-foreground">Responda de cabeça, sem olhar</p>
        {aberta ? (
          <MathText text={checagem.resposta} className="font-reading type-lead" />
        ) : (
          <button onClick={() => setAberta(true)} className="justify-self-start flex items-center gap-1.5 min-h-11 px-4 rounded-[var(--radius-control)] bg-primary/10 text-primary-text font-medium type-meta t-colors hover:bg-primary/15">
            <Eye className="w-4 h-4" /> Conferir
          </button>
        )}
      </div>
    );
  }

  const acertou = escolhida === certa;
  return (
    <div className="grid gap-4 w-full">
      <div className="flex flex-wrap gap-2.5 justify-center" role="group" aria-label="Escolha a resposta">
        {opcoes.map((o) => {
          const marcada = escolhida === o;
          const estado = marcada ? (acertou ? 'certa' : 'errada') : 'repouso';
          return (
            <button
              key={o}
              onClick={() => setEscolhida(o)}
              data-state={estado}
              className="min-h-12 min-w-24 px-5 rounded-[var(--radius-control)] border font-semibold type-body t-colors active:scale-95 border-border bg-[hsl(var(--surface-2))] hover:border-primary/45 data-[state=certa]:border-[hsl(var(--success-border))] data-[state=certa]:bg-[hsl(var(--success-surface))] data-[state=certa]:text-[hsl(var(--success))] data-[state=errada]:border-[hsl(var(--danger-border))] data-[state=errada]:bg-[hsl(var(--danger-surface))] data-[state=errada]:text-[hsl(var(--danger))]"
            >
              <MathText text={o} />
            </button>
          );
        })}
      </div>
      {escolhida && (
        <div className="type-meta text-center" role="status">
          {acertou ? <MathText text={`Isso! ${checagem.resposta}`} /> : 'Ainda não. Tente de novo.'}
        </div>
      )}
    </div>
  );
}
