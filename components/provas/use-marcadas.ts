'use client';
import { useEffect, useState } from 'react';

/* Questões marcadas para revisar: ficam neste navegador, por prova. */
export function useMarcadas(examId: string) {
  const chave = `prova-marcadas-${examId}`;
  const [marcadas, setMarcadas] = useState<string[]>([]);

  useEffect(() => {
    try {
      setMarcadas(JSON.parse(localStorage.getItem(chave) ?? '[]'));
    } catch {
      setMarcadas([]);
    }
  }, [chave]);

  const alternar = (id: string) => {
    const novas = marcadas.includes(id) ? marcadas.filter((x) => x !== id) : [...marcadas, id];
    setMarcadas(novas);
    try {
      localStorage.setItem(chave, JSON.stringify(novas));
    } catch {
      // sem armazenamento: a marca vale só até sair da prova
    }
  };

  return { marcadas, alternar };
}
