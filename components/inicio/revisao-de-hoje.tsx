'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* Revisão de hoje (Pablo, 22/11/2026: "um sistema de revisão para relembrar das fórmulas").
   Cartões já estudados que venceram pelos intervalos de 1, 3, 7, 21 e 45 dias
   (lib/flashcard-dominio.ts). `questoes` = questões do treino esperando revisão. */
export function RevisaoDeHoje({ questoes }: { questoes: number }) {
  const [cartoes, setCartoes] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;
    fetch('/api/flashcards/revisao')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!ativo || typeof d?.total !== 'number') return;
        setCartoes(typeof d.nestaSessao === 'number' ? d.nestaSessao : d.total);
      })
      .catch(() => {});
    return () => { ativo = false; };
  }, []);

  return (
    <section aria-labelledby="revisao-de-hoje" className="m-cartao m-col4">
      <h2 id="revisao-de-hoje">Revisão de hoje</h2>
      <div className="m-numero px" data-numeric>{cartoes ?? '–'}</div>
      <p className="m-mut">{cartoes === 1 ? 'cartão esperando' : 'cartões esperando'}</p>
      <div className="m-acoes">
        {cartoes ? (
          <Link href="/flashcards/revisao" className="m-sec">Revisar</Link>
        ) : (
          <Link href="/flashcards" className="m-sec">Ver cartões</Link>
        )}
        {questoes > 0 && (
          <Link href="/treino?mode=review" className="m-sec">
            {questoes} {questoes === 1 ? 'questão' : 'questões'}
          </Link>
        )}
      </div>
    </section>
  );
}
