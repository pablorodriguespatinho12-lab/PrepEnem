'use client';
import { useEffect, useState } from 'react';
import { PLANO_DE_LEITURA } from '@/data/leituras';
import { metaDePaginas } from '@/lib/meta-leitura';

const CHAVE_PAGINAS = 'prepenem-leitura-paginas';

type Paginas = Record<string, number>;

function lerPaginas(): Paginas {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_PAGINAS) ?? '{}');
    return typeof salvo === 'object' && salvo !== null ? salvo : {};
  } catch {
    return {};
  }
}

/* A página onde o Pablo parou em cada livro (guardada no navegador) e a meta
   do dia. Usado pelo cartão flutuante e pela seção Leitura do Início. */
export function useLeitura() {
  const [paginas, setPaginas] = useState<Paginas>({});
  const [meta, setMeta] = useState<number | null>(null);

  useEffect(() => {
    setPaginas(lerPaginas());
    // No efeito, não no render: a data do servidor e a do navegador podem divergir.
    setMeta(metaDePaginas(PLANO_DE_LEITURA, new Date()));
  }, []);

  function mudarPagina(id: string, atual: number, passo: number) {
    const novas = { ...paginas, [id]: Math.max(1, atual + passo) };
    setPaginas(novas);
    try {
      localStorage.setItem(CHAVE_PAGINAS, JSON.stringify(novas));
    } catch {
      // sem localStorage: vale só até recarregar
    }
  }

  return { paginas, meta, mudarPagina };
}
