'use client';
// O termo do glossário na tela: sublinhado pontilhado; tocar abre 1 frase
// simples (lib/redacao/glossario.ts). Cada passo cria um marcador e passa os
// textos na ordem de leitura: só a 1ª vez de cada termo ganha o sublinhado.

import { Fragment, type ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { marcarTermos, type Termo } from '@/lib/redacao/glossario';

function TermoGlossario({ texto, termo }: { texto: string; termo: Termo }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-termo={termo.chave}
          className="inline cursor-help underline decoration-dotted decoration-2 underline-offset-4 decoration-[hsl(var(--primary-text))] t-colors hover:text-primary-text"
        >
          {texto}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-72 type-meta motion-reduce:animate-none" role="note">
        {termo.frase}
      </PopoverContent>
    </Popover>
  );
}

export type Marcador = (texto: string) => ReactNode;

/* Um marcador por render, usado SÓ no componente que o criou (o modo estrito
   renderiza 2 vezes; um filho com o marcador do pai acharia tudo usado).
   Lembra os termos já marcados. Componente filho que
   renderiza sozinho (troca de aba) cria o seu, com `jaMarcados` = os termos
   que o pai marcou antes dele; senão o sublinhado sumiria no 2º render. */
export function criarMarcador(jaMarcados: Iterable<string> = []): Marcador {
  const usados = new Set<string>(jaMarcados);
  return (texto) => (
    <>
      {marcarTermos(texto, usados).map((p, i) => (
        <Fragment key={i}>{p.termo ? <TermoGlossario texto={p.texto} termo={p.termo} /> : p.texto}</Fragment>
      ))}
    </>
  );
}

/* As chaves dos termos que um texto marca (para passar como jaMarcados). */
export function termosDe(texto: string): string[] {
  const usados = new Set<string>();
  marcarTermos(texto, usados);
  return Array.from(usados);
}
