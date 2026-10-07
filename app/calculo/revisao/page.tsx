'use client';
// Revisão espaçada da trilha: uma questão de cada lição vencida, misturadas.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { RespostaInput } from '@/components/calculo/resposta-input';
import type { Exercicio } from '@/lib/calculo/tipos';

interface Questao { licaoId: string; titulo: string; exercicio: Exercicio }

export default function RevisaoCalculoPage() {
  const [questoes, setQuestoes] = useState<Questao[] | null>(null);
  const [indice, setIndice] = useState(0);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);

  useEffect(() => {
    fetch('/api/calculo/revisao').then((r) => r.json()).then((d) => setQuestoes(d?.questoes ?? [])).catch(() => setQuestoes([]));
  }, []);

  const responder = (acertou: boolean, q: Questao) => {
    setRespondida(true);
    if (acertou) setAcertos((n) => n + 1);
    fetch('/api/calculo/progresso', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'revisao', licaoId: q.licaoId, acertou }),
    }).catch(() => {});
  };

  const voltar = (
    <Link href="/calculo" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
      <ChevronLeft className="w-4 h-4" /> Trilha
    </Link>
  );

  if (!questoes) {
    return <div className="p-8 flex items-center gap-2 text-muted-foreground" role="status"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</div>;
  }
  if (questoes.length === 0 || indice >= questoes.length) {
    return (
      <div className="p-4 md:p-8 max-w-[46rem] mx-auto space-y-4">
        {voltar}
        <h1 className="font-display type-headline font-bold">
          {questoes.length === 0 ? 'Nada para revisar agora' : <span data-numeric>{acertos} de {questoes.length}</span>}
        </h1>
        <p className="type-meta text-muted-foreground">
          {questoes.length === 0
            ? 'As lições concluídas voltam aqui em 2, 7, 21 e 60 dias.'
            : 'Quem você acertou volta mais tarde; quem você errou volta amanhã.'}
        </p>
      </div>
    );
  }

  const q = questoes[indice];
  return (
    <div className="p-4 md:p-8 max-w-[46rem] mx-auto space-y-4">
      {voltar}
      <p className="type-caption text-muted-foreground" data-numeric>Revisão {indice + 1} de {questoes.length} · {q.titulo}</p>
      <section key={indice} className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-4">
        <MathText text={q.exercicio.enunciado} className="font-reading font-medium" />
        {q.exercicio.visual && <VisualDesenho visual={q.exercicio.visual} />}
        <RespostaInput resposta={q.exercicio.resposta} respondido={respondida} onResponder={(ok) => responder(ok, q)} />
        {respondida && (
          <>
            <div className="rounded-[var(--radius-control)] border border-border p-3 space-y-2">
              {q.exercicio.resolucao.map((r, i) => (
                <div key={i}>
                  <MathText text={r.texto} className="font-reading" />
                  <div className="type-meta text-muted-foreground"><MathText text={`Por quê: ${r.porque}`} /></div>
                </div>
              ))}
            </div>
            <button onClick={() => { setIndice((n) => n + 1); setRespondida(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta t-colors hover:bg-[hsl(var(--primary-hover))]">
              {indice < questoes.length - 1 ? 'Próxima' : 'Terminar'} <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </section>
    </div>
  );
}
