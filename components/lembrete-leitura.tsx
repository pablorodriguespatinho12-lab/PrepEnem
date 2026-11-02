'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLeitura } from '@/hooks/use-leitura';
import { LivrosDaLeitura } from './livros-da-leitura';

const CHAVE_FECHADO = 'prepenem-leitura-fechado';
// Provas, Simulado e Treino: o cartão no canto cobria o Confirmar e, no
// celular, os botões de Criar prova (22/10/2026). Treino por partes: cobria
// o Próximo da barra de baixo (27/10/2026).
const TELA_DE_QUESTAO = /^\/(provas|simulado|treino|redacao\/partes)(\/|$)/;

/* Lembrete de leitura ao entrar no site (Pablo, 21/10/2026): os livros e a
   página onde parou, num cartão no canto. Fechado, só volta na próxima vez
   que ele abrir o site (sessionStorage). No Início não aparece: lá a Leitura
   é uma seção da própria tela (um número, um lugar). */
export function LembreteLeitura() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  // Só na PRIMEIRA tela da visita (passeio do iniciante, 02/11/2026: ficava
  // em cima do conteúdo em 8 telas até ele achar o X). Trocou de tela, conta
  // como lembrado. Entrou pelo Início: a seção Leitura de lá já é o lembrete.
  const [primeiraTela, setPrimeiraTela] = useState<string | null>(null);
  const { paginas, meta, mudarPagina } = useLeitura();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CHAVE_FECHADO)) return;
    } catch {
      // sem sessionStorage: mostra mesmo assim
    }
    setAberto(true);
  }, []);

  useEffect(() => {
    if (!aberto || !pathname) return;
    if (primeiraTela === null) {
      if (pathname === '/dashboard') fechar();
      else setPrimeiraTela(pathname);
      return;
    }
    if (pathname !== primeiraTela) fechar();
  }, [aberto, pathname, primeiraTela]);

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
      {aberto && pathname !== '/dashboard' && !TELA_DE_QUESTAO.test(pathname ?? '') && (
        <motion.aside
          aria-label="Lembrete de leitura"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-50 p-4 rounded-[var(--radius-surface)] bg-[hsl(var(--surface-2))] border border-border shadow-elev-2"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h2 className="font-display text-lg leading-tight">Leitura de hoje</h2>
              {meta !== null && (
                <p className="type-meta text-muted-foreground mt-0.5">
                  Meta: <span data-numeric className="font-semibold text-foreground">{meta}</span> páginas
                </p>
              )}
            </div>
            <button
              onClick={fechar}
              aria-label="Fechar lembrete"
              className="-mt-1 -mr-1 p-2 rounded-[var(--radius-control)] text-muted-foreground hover:bg-muted t-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <LivrosDaLeitura paginas={paginas} mudarPagina={mudarPagina} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
