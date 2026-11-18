'use client';
import { useEffect, useState } from 'react';
import { LEITURAS, PLANO_DE_LEITURA, type Leitura } from '@/data/leituras';
import { metaDePaginas } from '@/lib/meta-leitura';

const CHAVE_PAGINAS = 'prepenem-leitura-paginas';
/* Livros que ele adiciona e os que tira da lista (Pablo, 18/11/2026: "um maisinho no
   Início para adicionar um livro e ele aparecer ali"). Ficam no navegador, como as páginas. */
const CHAVE_EXTRAS = 'prepenem-leitura-livros';
const CHAVE_TIRADOS = 'prepenem-leitura-tirados';

type Paginas = Record<string, number>;

function ler<T>(chave: string, vazio: T): T {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) ?? 'null');
    return salvo !== null && typeof salvo === typeof vazio ? (salvo as T) : vazio;
  } catch {
    return vazio;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // sem localStorage: vale só até recarregar
  }
}

const idDoTitulo = (titulo: string) =>
  `${titulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;

/* Os livros, a página onde o Pablo parou em cada um e a meta do dia (tudo no navegador).
   Usado pelo cartão flutuante e pela seção Leitura do Início. */
export function useLeitura() {
  const [paginas, setPaginas] = useState<Paginas>({});
  const [extras, setExtras] = useState<Leitura[]>([]);
  const [tirados, setTirados] = useState<string[]>([]);
  const [meta, setMeta] = useState<number | null>(null);

  useEffect(() => {
    setPaginas(ler<Paginas>(CHAVE_PAGINAS, {}));
    setExtras(ler<Leitura[]>(CHAVE_EXTRAS, []).filter((l) => l && typeof l.titulo === 'string'));
    setTirados(ler<string[]>(CHAVE_TIRADOS, []));
    // No efeito, não no render: a data do servidor e a do navegador podem divergir.
    setMeta(metaDePaginas(PLANO_DE_LEITURA, new Date()));
  }, []);

  const livros = [...LEITURAS, ...extras].filter((l) => !tirados.includes(l.id));

  function mudarPagina(id: string, atual: number, passo: number) {
    const novas = { ...paginas, [id]: Math.max(1, atual + passo) };
    setPaginas(novas);
    gravar(CHAVE_PAGINAS, novas);
  }

  function adicionarLivro(titulo: string, pagina: number) {
    const limpo = titulo.trim();
    if (!limpo) return;
    const novos = [...extras, { id: idDoTitulo(limpo), titulo: limpo, pagina: Math.max(1, Math.floor(pagina) || 1) }];
    setExtras(novos);
    gravar(CHAVE_EXTRAS, novos);
  }

  function tirarLivro(id: string) {
    const novos = [...tirados, id];
    setTirados(novos);
    gravar(CHAVE_TIRADOS, novos);
  }

  return { livros, paginas, meta, mudarPagina, adicionarLivro, tirarLivro };
}
