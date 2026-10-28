'use client';
// Peças de apoio do Treino por partes: a lista de autores que abre (obra, ano
// e ideia), o "Ver exemplo" do tema de 2020 e a linha fixa com o tema.

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { autorPorNome } from '@/lib/redacao/autores';
import { EXEMPLO_ANO, EXEMPLO_TEMA } from '@/lib/redacao/exemplo-receita';

/* Cada nome é um botão que abre a ficha. Sem a ficha o aluno cita só o nome,
   e o INEP chama isso de repertório de bolso. */
export function ListaAutores({ nomes, titulo = 'Autores para citar' }: { nomes: string[]; titulo?: string }) {
  return (
    <div>
      <p className="type-caption font-semibold text-muted-foreground mb-1">{titulo}</p>
      <ul className="divide-y divide-border border-y border-border">
        {nomes.map((nome) => <ItemAutor key={nome} nome={nome} />)}
      </ul>
    </div>
  );
}

function ItemAutor({ nome }: { nome: string }) {
  const [aberto, setAberto] = useState(false);
  const autor = autorPorNome(nome);
  if (!autor) return <li className="py-2 type-meta">{nome}</li>;
  const id = `autor-${nome.replace(/[^a-zA-Z0-9]/g, '-')}`;
  return (
    <li>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-3 py-2 text-left type-meta font-medium t-colors hover:text-primary-text"
      >
        <span>{autor.nome}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
      </button>
      {aberto && (
        <div id={id} className="pb-3">
          <p className="type-meta"><cite className="font-reading italic">{autor.obra}</cite> <span data-numeric className="text-muted-foreground">({autor.ano})</span></p>
          <p className="type-meta text-muted-foreground mt-0.5">{autor.ideia}</p>
        </div>
      )}
    </li>
  );
}

/* "Ver exemplo" fechado por padrão: o aluno tenta primeiro. */
export function VerExemplo({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-2 type-meta font-medium t-colors hover:bg-muted"
      >
        {aberto ? 'Fechar exemplo' : 'Ver exemplo'}
        <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
      </button>
      {aberto && (
        <section className="mt-3 rounded-[var(--radius-surface)] border-l-4 border-primary surface-1 p-4" aria-label="Exemplo de estrutura">
          <p className="type-caption font-semibold text-primary-text">Exemplo de estrutura, não copie</p>
          <p className="type-caption text-muted-foreground mb-3"><span data-numeric>ENEM {EXEMPLO_ANO}</span>: {EXEMPLO_TEMA}</p>
          {children}
        </section>
      )}
    </div>
  );
}

/* Linha presa no topo com o tema. No celular o botão fixo do menu fica no
   canto esquerdo (top-4, 44 px): a linha começa depois dele. */
export function LinhaTema({ tema }: { tema: string }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 md:-mx-8 mb-5 border-b border-border bg-background px-4 md:px-8">
      <p className="flex min-h-[3.75rem] md:min-h-0 items-center pl-14 md:pl-0 md:py-2.5 type-meta">
        <span className="font-semibold text-primary-text mr-2 flex-shrink-0">Tema</span>
        <span className="line-clamp-2">{tema}</span>
      </p>
    </div>
  );
}
