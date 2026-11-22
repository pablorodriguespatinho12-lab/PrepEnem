'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* Revisão de hoje (Pablo, 22/11/2026: "um sistema de revisão para relembrar das fórmulas").
   Cartões já estudados que venceram pelos intervalos de 1, 3, 7, 21 e 45 dias
   (lib/flashcard-dominio.ts). Sem nada vencido, a seção some: tela limpa. */
export function RevisaoDeHoje() {
  const [total, setTotal] = useState<number | null>(null);
  const [nestaSessao, setNestaSessao] = useState(0);

  useEffect(() => {
    let ativo = true;
    fetch('/api/flashcards/revisao')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!ativo || typeof d?.total !== 'number') return;
        setTotal(d.total);
        setNestaSessao(typeof d.nestaSessao === 'number' ? d.nestaSessao : d.total);
      })
      .catch(() => {});
    return () => { ativo = false; };
  }, []);

  if (!total) return null;

  return (
    <section aria-labelledby="revisao-de-hoje" className="py-5 border-t border-border">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="revisao-de-hoje" className="type-meta font-medium text-foreground">Revisão de hoje</h2>
        <span className="type-meta text-muted-foreground" data-numeric>
          {nestaSessao} {nestaSessao === 1 ? 'cartão' : 'cartões'} hoje
        </span>
      </div>
      <p className="mt-2 type-body text-muted-foreground">
        Fórmulas e conteúdos que você já estudou e está na hora de lembrar.
      </p>
      <Link
        href="/flashcards/revisao"
        className="mt-3 inline-flex items-center rounded-full bg-primary px-5 py-2.5 type-meta font-medium text-primary-foreground"
      >
        Revisar {nestaSessao}
      </Link>
    </section>
  );
}
