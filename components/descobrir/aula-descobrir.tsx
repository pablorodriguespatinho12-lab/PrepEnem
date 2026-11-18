'use client';
/* Uma aula da aba Descobrir: uma tela por passo, sem rolar (amostra aprovada em
   17/11/2026). Depois dos passos, "Prove você" e "Onde mais isso aparece". */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Aula } from '@/lib/descobrir/tipos';
import { conferirEscolha } from '@/lib/descobrir/conferir-prova';
import { Eq } from './pecas';
import { MapaDescobrir } from './mapa';
import { marcarVisitada } from './visitadas';
import './descobrir.css';

type Tela = { nome: string; frase: string; esquerda: React.ReactNode; direita?: React.ReactNode };

export function AulaDescobrir({ aula }: { aula: Aula }) {
  const total = aula.passos.length + 2;
  const [atual, setAtual] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [aviso, setAviso] = useState('');

  useEffect(() => marcarVisitada(aula.id), [aula.id]);

  const ir = useCallback((n: number) => {
    const novo = Math.max(0, Math.min(total - 1, n));
    if (novo === aula.passos.length) { setEtapa(0); setAviso(''); }
    setAtual(novo);
  }, [total, aula.passos.length]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') ir(atual + 1);
      if (e.key === 'ArrowLeft') ir(atual - 1);
    };
    addEventListener('keydown', tecla);
    return () => removeEventListener('keydown', tecla);
  }, [atual, ir]);

  const escolher = (i: number) => {
    const r = conferirEscolha(aula.prova.etapas[etapa], i);
    if (r.andou) { setEtapa((e) => e + 1); setAviso(''); } else setAviso(r.aviso);
  };

  const tela: Tela = atual < aula.passos.length ? aula.passos[atual]
    : atual === aula.passos.length ? telaDaProva(aula, etapa, aviso, escolher)
      : telaOndeMais(aula);

  return (
    <div className="dsc mx-auto flex h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col gap-3 px-3 pb-3 pt-1 md:h-dvh md:px-6 md:py-6">
      <div className="flex items-center justify-between gap-3 pl-12 md:pl-0">
        <div className="flex items-center gap-3">
          <Link href="/descobrir" className="type-meta text-muted-foreground hover:text-foreground">‹ Mapa</Link>
          <h1 className="font-display text-2xl leading-none sm:text-3xl">{aula.titulo}</h1>
        </div>
        {/* no celular, o número no lugar dos pontinhos (13 pontos não cabem ao lado do título) */}
        <span className="type-meta tabular-nums text-muted-foreground sm:hidden">{atual + 1}/{total}</span>
        <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className="block h-2.5 w-2.5" style={{ background: i <= atual ? 'hsl(var(--primary))' : 'var(--dsc-grade)' }} />
          ))}
        </div>
      </div>
      <section key={atual} className="px-cartao m-1 grid min-h-0 flex-1 grid-rows-[auto_auto_1fr] gap-3 p-4 sm:p-5" aria-live="polite">
        <p className="font-display text-xl leading-none" style={{ color: 'hsl(var(--primary-text, var(--primary)))' }}>{tela.nome}</p>
        {tela.frase ? <p className="text-lg font-bold leading-snug [text-wrap:balance]">{tela.frase}</p> : <span />}
        <div className={`dsc-corpo ${tela.direita ? '' : 'dsc-largo'}`}>
          <div className="dsc-lado">{tela.esquerda}</div>
          {tela.direita && <div className="dsc-lado">{tela.direita}</div>}
        </div>
      </section>
      <div className="flex justify-between gap-3">
        <button type="button" className="px-chip" onClick={() => ir(atual - 1)} disabled={atual === 0} style={atual === 0 ? { opacity: 0.35 } : undefined}>Voltar</button>
        {atual < total - 1
          ? <button type="button" className="px-chip" aria-pressed="true" onClick={() => ir(atual + 1)}>Próximo</button>
          : <Link href="/descobrir" className="px-chip" aria-pressed="true">Voltar ao mapa</Link>}
      </div>
    </div>
  );
}

function telaDaProva(aula: Aula, etapa: number, aviso: string, escolher: (i: number) => void): Tela {
  const { inicio, etapas, provado, desenho } = aula.prova;
  const fim = etapa >= etapas.length;
  const pergunta = etapas[etapa];
  return {
    nome: 'Prove você',
    frase: '',
    esquerda: <div className="dsc-lado dsc-inicio w-full"><Eq>{inicio}{etapas.slice(0, etapa).map((e, i) => <div key={i}>{e.linha}</div>)}</Eq></div>,
    direita: (
      <div className="dsc-lado dsc-inicio w-full">
        {fim ? (
          <><p className="dsc-aviso certo">{provado}</p>{desenho}</>
        ) : (
          <>
            <p className="text-base font-bold">{pergunta.pede}</p>
            <div className="dsc-escolhas">
              {pergunta.opcoes.map((o, i) => (
                <button key={o} type="button" className="px-chip font-sans text-base" onClick={() => escolher(i)}>{o}</button>
              ))}
            </div>
            <p className="dsc-aviso errado" role="status">{aviso}</p>
          </>
        )}
      </div>
    ),
  };
}

function telaOndeMais(aula: Aula): Tela {
  return {
    nome: 'Onde mais isso aparece',
    frase: 'A mesma ideia mora em outros lugares do mapa.',
    esquerda: (
      <div className="dsc-lado w-full">
        <MapaDescobrir atual={aula.id} />
        <p className="type-meta text-muted-foreground">
          Treinar: {aula.treino.map((t, i) => <span key={t}>{i > 0 && ' · '}<Link href="/provas" className="font-semibold text-foreground underline">{t}</Link></span>)}
        </p>
      </div>
    ),
  };
}
