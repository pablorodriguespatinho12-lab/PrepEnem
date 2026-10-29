'use client';
// Peças de apoio do Treino por partes: a lista de autores que abre (obra, ano
// e ideia), o "Ver exemplo" do tema de 2020 e a linha fixa com o tema.

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { autorPorNome, coringaPorNome } from '@/lib/redacao/autores';
import type { ChaveCausa } from '@/lib/redacao/receita';
import { EXEMPLO_ANO, EXEMPLO_TEMA } from '@/lib/redacao/exemplo-receita';

/* Cada nome é um botão que abre a ficha. Sem a ficha o aluno cita só o nome,
   e o INEP chama isso de repertório de bolso. */
export function ListaAutores({ nomes, titulo = 'Autores para citar' }: { nomes: string[]; titulo?: string }) {
  return (
    <div>
      <p className="type-rotulo text-muted-foreground mb-1">{titulo}</p>
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
          <p className="font-reading type-body mt-0.5">{autor.ideia}</p>
        </div>
      )}
    </li>
  );
}

/* Os autores numa linha de pílulas, em cima da caixa de texto: visíveis sem
   rolar. Primeiro até 3 coringas (frase de autor ou dado, fáceis de decorar);
   os outros autores ficam atrás de "Outros autores", para a coluna caber na
   tela (Pablo, 29/10/2026: 14 pílulas e a ficha empurravam a caixa de texto
   para baixo da barra). Tocar abre a ficha curta logo abaixo, uma por vez. */
export function AutoresEmLinha({ nomes, titulo, coringas = [], causas = [] }: {
  nomes: string[]; titulo: string; coringas?: string[]; causas?: (ChaveCausa | null)[];
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [verOutros, setVerOutros] = useState(coringas.length === 0);
  const outros = nomes.filter((n) => !coringas.includes(n));
  const visiveis = verOutros ? [...coringas, ...outros] : coringas;
  const coringa = aberto ? coringaPorNome(aberto) : null;
  const autor = aberto && !coringa ? autorPorNome(aberto) : null;
  const amarra = coringa ? causas.map((c) => (c ? coringa.amarra[c] : undefined)).find(Boolean) ?? Object.values(coringa.amarra)[0] : null;
  const pilula = 'inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 type-meta font-medium t-colors hover:bg-muted aria-expanded:border-primary aria-expanded:bg-[hsl(var(--primary)/0.12)]';
  return (
    <div>
      {titulo && <p className="type-rotulo text-muted-foreground mb-2">{titulo}</p>}
      <ul className="flex flex-wrap gap-2">
        {visiveis.map((nome) => {
          const ativo = nome === aberto;
          const k = coringaPorNome(nome);
          return (
            <li key={nome}>
              <button type="button" onClick={() => setAberto(ativo ? null : nome)} aria-expanded={ativo} aria-controls="ficha-autor" className={pilula}>
                {k && <span className="type-micro font-semibold uppercase tracking-wide text-primary-text">{k.tipo}</span>}
                {k ? k.rotulo : autorPorNome(nome)?.nome ?? nome}
              </button>
            </li>
          );
        })}
        {coringas.length > 0 && outros.length > 0 && (
          <li>
            <button type="button" onClick={() => setVerOutros(!verOutros)} aria-expanded={verOutros} className={`${pilula} text-muted-foreground`}>
              {verOutros ? 'Menos autores' : <>Outros autores · <span data-numeric>{outros.length}</span></>}
            </button>
          </li>
        )}
      </ul>
      {coringa && (
        <div id="ficha-autor" className="mt-3 border-l-2 border-primary pl-3" aria-live="polite">
          <p className="font-reading type-body">{coringa.tipo === 'fala' ? <>&ldquo;{coringa.texto}&rdquo;</> : coringa.texto}</p>
          <p className="type-meta mt-0.5">
            <span className="text-muted-foreground">{coringa.fonte} <span data-numeric>({coringa.quando})</span>.</span>
            {coringa.sentido && <> {coringa.sentido}</>}
          </p>
          {amarra && (
            <p className="type-meta mt-1.5">
              <span className="font-medium text-primary-text">Ligue ao seu tema assim: </span>{amarra}
            </p>
          )}
        </div>
      )}
      {autor && (
        <div id="ficha-autor" className="mt-3 border-l-2 border-primary pl-3" aria-live="polite">
          <p className="type-meta"><cite className="font-reading italic">{autor.obra}</cite> <span data-numeric className="text-muted-foreground">({autor.ano})</span></p>
          <p className="font-reading type-body mt-0.5">{autor.ideia}</p>
        </div>
      )}
    </div>
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
          <p className="type-rotulo text-primary-text">Exemplo de estrutura, não copie</p>
          <p className="type-rotulo font-normal text-muted-foreground mb-3"><span data-numeric>ENEM {EXEMPLO_ANO}</span>: {EXEMPLO_TEMA}</p>
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
