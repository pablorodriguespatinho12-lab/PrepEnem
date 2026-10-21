'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { LEITURAS } from '@/data/leituras';

const CHAVE_PAGINAS = 'prepenem-leitura-paginas';
const CHAVE_FECHADO = 'prepenem-leitura-fechado';

type Paginas = Record<string, number>;

function lerPaginas(): Paginas {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_PAGINAS) ?? '{}');
    return typeof salvo === 'object' && salvo !== null ? salvo : {};
  } catch {
    return {};
  }
}

/* Lembrete de leitura ao entrar no site (Pablo, 21/10/2026): os livros e a
   página onde parou, num cartão no canto. Fechado, só volta na próxima vez
   que ele abrir o site (sessionStorage). O − e o + mudam a página e ficam
   guardados no navegador. */
export function LembreteLeitura() {
  const reduzir = useReducedMotion();
  const [aberto, setAberto] = useState(false);
  const [paginas, setPaginas] = useState<Paginas>({});

  useEffect(() => {
    setPaginas(lerPaginas());
    try {
      if (sessionStorage.getItem(CHAVE_FECHADO)) return;
    } catch {
      // sem sessionStorage: mostra mesmo assim
    }
    setAberto(true);
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

  function fechar() {
    setAberto(false);
    try {
      sessionStorage.setItem(CHAVE_FECHADO, '1');
    } catch {
      // sem sessionStorage: volta ao recarregar
    }
  }

  return (
    <AnimatePresence>
      {aberto && (
        <motion.aside
          aria-label="Lembrete de leitura"
          initial={{ opacity: 0, y: reduzir ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduzir ? 0 : 20 }}
          transition={{ duration: reduzir ? 0.01 : 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-50 p-4 rounded-[var(--radius-surface)] bg-[hsl(var(--surface-2))] border border-border shadow-elev-2"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2 className="font-display text-lg leading-tight">Leitura de hoje</h2>
            <button
              onClick={fechar}
              aria-label="Fechar lembrete"
              className="-mt-1 -mr-1 p-2 rounded-[var(--radius-control)] text-muted-foreground hover:bg-muted t-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-3">
            {LEITURAS.map((livro) => {
              const pagina = paginas[livro.id] ?? livro.pagina;
              return (
                <li key={livro.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium leading-snug">{livro.titulo}</p>
                    <p className="type-meta text-muted-foreground">
                      Parou na página <span data-numeric className="text-primary font-semibold">{pagina}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => mudarPagina(livro.id, pagina, -1)}
                      aria-label={`Voltar uma página em ${livro.titulo}`}
                      className="h-9 w-9 grid place-items-center rounded-[var(--radius-control)] border border-border hover:bg-muted t-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => mudarPagina(livro.id, pagina, 1)}
                      aria-label={`Avançar uma página em ${livro.titulo}`}
                      className="h-9 w-9 grid place-items-center rounded-[var(--radius-control)] border border-border hover:bg-muted t-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
