'use client';
// Busca o conceito do assunto novo (ver lib/conceito-antes.ts). Já pede o da
// próxima questão enquanto o aluno resolve esta: na hora de mostrar, ele
// costuma estar pronto. Falhou a IA? A questão segue sem o cartão.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ResumoAssunto } from '@/lib/tutor/resumo';
import { assuntoSemConceito, chaveAssunto, type Assunto } from '@/lib/conceito-antes';

type QuestaoComAssunto = { materia?: string | null; subtema?: string | null };

async function buscarConceito(assunto: Assunto): Promise<ResumoAssunto | null> {
  try {
    const r = await fetch('/api/treino/resumo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subtemas: [assunto] }),
    });
    if (!r.ok) return null;
    const d: { resumos?: ResumoAssunto[] } = await r.json();
    return d.resumos?.[0] ?? null;
  } catch {
    return null;
  }
}

export function useConceitoAntes(questoes: QuestaoComAssunto[], idx: number, ativo: boolean, revisados: ResumoAssunto[]) {
  const pedidos = useRef(new Map<string, Promise<ResumoAssunto | null>>());
  const [vistos, setVistos] = useState<ReadonlySet<string>>(() => new Set());
  const [prontos, setProntos] = useState<ReadonlyMap<string, ResumoAssunto | null>>(() => new Map());
  const cobertos = useMemo(() => new Set(revisados.map((r) => chaveAssunto(r.materia, r.subtema))), [revisados]);

  const pedir = useCallback((assunto: Assunto) => {
    const chave = chaveAssunto(assunto.materia, assunto.subtema);
    if (pedidos.current.has(chave)) return;
    const pedido = buscarConceito(assunto);
    pedidos.current.set(chave, pedido);
    void pedido.then((resumo) => setProntos((antes) => new Map(antes).set(chave, resumo)));
  }, []);

  const atual = ativo ? assuntoSemConceito(questoes, idx, cobertos, vistos) : null;
  const proximo = ativo ? assuntoSemConceito(questoes, idx + 1, cobertos, vistos) : null;
  useEffect(() => { if (atual) pedir(atual); }, [atual?.materia, atual?.subtema, pedir]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (proximo) pedir(proximo); }, [proximo?.materia, proximo?.subtema, pedir]); // eslint-disable-line react-hooks/exhaustive-deps

  const chaveAtual = atual ? chaveAssunto(atual.materia, atual.subtema) : null;
  const dispensar = useCallback(() => {
    if (chaveAtual) setVistos((antes) => new Set(antes).add(chaveAtual));
  }, [chaveAtual]);

  // IA sem resposta: segue para a questão em vez de prender o aluno.
  useEffect(() => { if (chaveAtual && prontos.get(chaveAtual) === null) dispensar(); }, [chaveAtual, prontos, dispensar]);

  return {
    assunto: atual,
    resumo: chaveAtual ? prontos.get(chaveAtual) ?? null : null,
    carregando: !!chaveAtual && !prontos.has(chaveAtual),
    dispensar,
  };
}
