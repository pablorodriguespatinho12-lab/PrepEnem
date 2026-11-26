'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { degrauDaProva } from '@/lib/provas-grupos';
import { estadoDaProva, provaParaContinuar, type ProvaDoQuadro } from '@/lib/provas-estado';

/* A prova começada em que ele mexeu por último. */
export function ContinuarProva() {
  // undefined = ainda carregando; null = nenhuma aberta.
  const [prova, setProva] = useState<ProvaDoQuadro | null | undefined>(undefined);

  useEffect(() => {
    let ativo = true;
    fetch('/api/provas/listar')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (ativo) setProva(provaParaContinuar(d?.exams ?? [])); })
      .catch(() => { if (ativo) setProva(null); });
    return () => { ativo = false; };
  }, []);

  const estado = prova ? estadoDaProva(prova) : null;

  return (
    <section aria-labelledby="continuar-prova" className="m-cartao m-col4">
      <h2 id="continuar-prova">Continuar prova</h2>
      {prova && estado ? (
        <>
          <b className="block">{prova.nome}</b>
          <div className="m-trilha" aria-hidden><i style={{ transform: `scaleX(${estado.progresso ?? 0})` }} /></div>
          <p className="m-mut" data-numeric>{estado.texto}</p>
          <Link href={`/provas/${prova.id}`} className="m-sec" aria-label={`Continuar ${degrauDaProva(prova.nome)?.degrau.tema ?? prova.nome}`}>
            Continuar
          </Link>
        </>
      ) : (
        <>
          <p className="m-mut">{prova === null ? 'Nenhuma prova aberta' : 'Carregando'}</p>
          <Link href="/provas" className="m-sec">Escolher prova</Link>
        </>
      )}
    </section>
  );
}
