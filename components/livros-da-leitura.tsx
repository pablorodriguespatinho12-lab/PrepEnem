'use client';
import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Leitura } from '@/data/leituras';

type Props = {
  livros: readonly Leitura[];
  paginas: Record<string, number>;
  mudarPagina: (id: string, atual: number, passo: number) => void;
  /* Só no Início: o × para tirar o livro da lista quando terminar. */
  tirarLivro?: (id: string) => void;
};

const BOTAO = 'h-10 w-10 grid place-items-center rounded-full bg-primary/10 text-primary-text hover:bg-primary/15 active:scale-95 t-colors';

/* Os livros, a página onde parou e o − / +. */
export function LivrosDaLeitura({ livros, paginas, mudarPagina, tirarLivro }: Props) {
  if (livros.length === 0) return <p className="type-meta text-muted-foreground">Nenhum livro na lista.</p>;
  return (
    <ul className="space-y-3">
      {livros.map((livro) => {
        const pagina = paginas[livro.id] ?? livro.pagina;
        return (
          <li key={livro.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium leading-snug">{livro.titulo}</p>
              <p className="type-meta text-muted-foreground">
                Parou na página <span data-numeric className="text-primary-text font-semibold">{pagina}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => mudarPagina(livro.id, pagina, -1)} aria-label={`Voltar uma página em ${livro.titulo}`} className={BOTAO}>
                <Minus className="h-4 w-4" />
              </button>
              <button onClick={() => mudarPagina(livro.id, pagina, 1)} aria-label={`Avançar uma página em ${livro.titulo}`} className={BOTAO}>
                <Plus className="h-4 w-4" />
              </button>
              {tirarLivro && (
                <button onClick={() => tirarLivro(livro.id)} aria-label={`Tirar ${livro.titulo} da lista`} title="Terminei: tirar da lista"
                  className="h-10 w-8 grid place-items-center rounded-full text-muted-foreground hover:text-foreground t-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* "+ Adicionar livro" do Início (Pablo, 18/11/2026): o nome e a página em que está. */
export function AdicionarLivro({ adicionar }: { adicionar: (titulo: string, pagina: number) => void }) {
  const [aberto, setAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [pagina, setPagina] = useState('1');

  const salvar = () => {
    if (!titulo.trim()) return;
    adicionar(titulo, Number(pagina));
    setTitulo('');
    setPagina('1');
    setAberto(false);
  };

  if (!aberto) {
    return (
      <button type="button" onClick={() => setAberto(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 type-meta font-medium text-primary-text hover:bg-primary/15 t-colors">
        <Plus className="h-4 w-4" aria-hidden /> Adicionar livro
      </button>
    );
  }
  return (
    <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); salvar(); }}>
      <label className="grid min-w-[12rem] flex-1 gap-1 type-meta text-muted-foreground">
        Nome do livro
        <input autoFocus value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={80}
          className="h-10 rounded-[var(--radius-control)] border border-border bg-background px-3 text-base text-foreground outline-none" />
      </label>
      <label className="grid w-28 gap-1 type-meta text-muted-foreground">
        Está na página
        <input inputMode="numeric" value={pagina} onChange={(e) => setPagina(e.target.value.replace(/\D/g, '').slice(0, 5))}
          className="h-10 rounded-[var(--radius-control)] border border-border bg-background px-3 text-base text-foreground outline-none tabular-nums" />
      </label>
      <button type="submit" disabled={!titulo.trim()} className="h-10 rounded-full bg-primary px-4 type-meta font-semibold text-primary-foreground disabled:opacity-40">Adicionar</button>
      <button type="button" onClick={() => setAberto(false)} className="h-10 rounded-full px-3 type-meta text-muted-foreground hover:text-foreground">Cancelar</button>
    </form>
  );
}
