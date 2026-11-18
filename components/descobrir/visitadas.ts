'use client';
/* Aulas já abertas, só neste navegador (conveniência: acende o lugar no mapa). */
import { useEffect, useState } from 'react';

const CHAVE = 'descobrir-visitadas';

function ler(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function marcarVisitada(id: string) {
  try {
    const atuais = ler();
    if (!atuais.includes(id)) localStorage.setItem(CHAVE, JSON.stringify([...atuais, id]));
  } catch {
    /* navegador sem armazenamento: o mapa só não acende */
  }
}

export function useVisitadas(): string[] {
  const [lista, setLista] = useState<string[]>([]);
  useEffect(() => setLista(ler()), []);
  return lista;
}
