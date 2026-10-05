'use client';
// Um parágrafo da redação-modelo com os trechos marcados e numerados. Abaixo,
// a lista: número, papel na grade e por que funciona. O número liga a marca
// no texto à explicação (contiguidade sem esconder nada atrás de hover).

import { Fragment } from 'react';
import { ROTULO_PAPEL, type Papel, type ParteModelo } from '@/data/redacao/modelos';

/* Cores por família de papel: repertório, estrutura, proposta (C5). */
const FAMILIA: Record<Papel, 'repertorio' | 'estrutura' | 'proposta'> = {
  repertorio: 'repertorio',
  contextualizacao: 'estrutura', tese: 'estrutura', anuncio: 'estrutura', operador: 'estrutura', topico: 'estrutura',
  analise: 'estrutura', fecho: 'estrutura', retomada: 'estrutura',
  agente: 'proposta', acao: 'proposta', modo: 'proposta', efeito: 'proposta', detalhamento: 'proposta',
};
const COR_FAMILIA = {
  repertorio: 'hsl(var(--chart-2))',
  estrutura: 'hsl(var(--chart-1))',
  proposta: 'hsl(var(--chart-3))',
};

interface Pedaco { texto: string; indice: number | null }

/* Quebra o texto nos trechos anotados (na ordem em que aparecem; trecho que
   se sobrepõe a um anterior é ignorado na marcação, mas fica na lista). */
function quebrar(parte: ParteModelo): Pedaco[] {
  const posicoes = parte.anotacoes
    .map((a, indice) => ({ indice, inicio: parte.texto.indexOf(a.trecho), fim: parte.texto.indexOf(a.trecho) + a.trecho.length }))
    .filter((p) => p.inicio >= 0)
    .sort((a, b) => a.inicio - b.inicio);
  const pedacos: Pedaco[] = [];
  let cursor = 0;
  for (const p of posicoes) {
    if (p.inicio < cursor) continue;
    if (p.inicio > cursor) pedacos.push({ texto: parte.texto.slice(cursor, p.inicio), indice: null });
    pedacos.push({ texto: parte.texto.slice(p.inicio, p.fim), indice: p.indice });
    cursor = p.fim;
  }
  if (cursor < parte.texto.length) pedacos.push({ texto: parte.texto.slice(cursor), indice: null });
  return pedacos;
}

export function ModeloComentado({ parte }: { parte: ParteModelo }) {
  const pedacos = quebrar(parte);
  return (
    <div className="space-y-4">
      <p className="font-reading text-body leading-[var(--lh-reading)] measure-reading">
        {pedacos.map((p, i) => {
          if (p.indice === null) return <Fragment key={i}>{p.texto}</Fragment>;
          const cor = COR_FAMILIA[FAMILIA[parte.anotacoes[p.indice].papel]];
          return (
            <mark key={i} className="bg-transparent text-inherit" style={{ boxShadow: `inset 0 -0.45em 0 color-mix(in srgb, ${cor} 22%, transparent)` }}>
              {p.texto}
              <sup className="font-sans font-semibold ml-0.5" style={{ color: cor }}>{p.indice + 1}</sup>
            </mark>
          );
        })}
      </p>
      <ol className="space-y-2">
        {parte.anotacoes.map((a, i) => {
          const cor = COR_FAMILIA[FAMILIA[a.papel]];
          return (
            <li key={i} className="grid grid-cols-[1.5rem_1fr] gap-2 type-meta">
              <span className="font-semibold tabular-nums" style={{ color: cor }}>{i + 1}</span>
              <span>
                <strong style={{ color: cor }}>{ROTULO_PAPEL[a.papel]}.</strong>{' '}
                <span className="text-muted-foreground">{a.porque}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
