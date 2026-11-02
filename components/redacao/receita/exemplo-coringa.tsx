'use client';
// Exemplo pronto com coringa, na aba Exemplo: um texto aprovado pelos juízes
// num tema X, cortado nas 3 partes que o aluno imita no tema Y dele (Pablo,
// 30/10/2026: "um exemplo com o tema X para eu fazer um texto Y"). Só a
// parte 3 muda de tema; a pergunta do coringa diz como achar a nova.

import { useState } from 'react';
import { coringaPorNome } from '@/lib/redacao/autores';
import { exemplosDoCoringa, PERGUNTA_DO_CORINGA } from '@/lib/redacao/exemplos-coringas';

const PARTES = [
  /* Teste do iniciante (30/10/2026): com "copie igual" ele inventou uma frase de outro autor;
     "pode começar com Assim" em cada parte confundiu onde o exemplo começa de outro jeito. */
  { chave: 'citacao', nome: 'A frase do autor', faz: 'use esta mesma frase no seu tema, não invente outra' },
  { chave: 'sentido', nome: 'O que ela quer dizer', faz: 'diga com suas palavras' },
  { chave: 'ligacao', nome: 'A ligação com o tema', faz: 'esta você troca pelo seu tema' },
] as const;

const PILULA = 'rounded-full border border-border px-3 py-1.5 type-meta font-medium t-colors hover:bg-muted aria-pressed:border-primary aria-pressed:bg-[hsl(var(--primary)/0.12)]';

export function ExemploComCoringa({ coringas, tema, escolhido, aoEscolher }: {
  coringas: string[];
  tema: string;
  escolhido: string | null;
  aoEscolher: (nome: string) => void;
}) {
  const comExemplo = coringas.filter((c) => exemplosDoCoringa(c, tema).length > 0);
  const atual = escolhido && comExemplo.includes(escolhido) ? escolhido : comExemplo[0];
  const exemplos = atual ? exemplosDoCoringa(atual, tema) : [];
  const [indice, setIndice] = useState(0);
  if (!atual || exemplos.length === 0) return null;
  const exemplo = exemplos[Math.min(indice, exemplos.length - 1)];
  const rotulo = (nome: string) => coringaPorNome(nome)?.rotulo ?? nome;

  return (
    <section aria-label="Exemplo pronto com coringa" data-medir="exemplo-coringa">
      <p className="type-rotulo text-primary-text">Exemplo pronto, em outro tema</p>
      <p className="type-meta text-muted-foreground mt-0.5">Veja como ficou num tema do ENEM e faça igual no seu. As palavras que abrem cada parte (&ldquo;Ou seja&rdquo;, &ldquo;É o que ocorre&rdquo;) você pode copiar.</p>

      {comExemplo.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Coringa do exemplo">
          {comExemplo.map((c) => (
            <button key={c} type="button" aria-pressed={c === atual} onClick={() => { aoEscolher(c); setIndice(0); }} className={PILULA}>
              {rotulo(c)}
            </button>
          ))}
        </div>
      )}

      <p className="type-rotulo text-muted-foreground mt-4 mb-2">Escolha um assunto</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Assunto do exemplo">
        {exemplos.map((e, i) => (
          <button key={e.tema} type="button" aria-pressed={e === exemplo} onClick={() => setIndice(i)} className={PILULA}>
            {e.assuntos[0]}{exemplos.slice(0, i).filter((o) => o.assuntos[0] === e.assuntos[0]).length > 0 && <span data-numeric> {exemplos.slice(0, i + 1).filter((o) => o.assuntos[0] === e.assuntos[0]).length}</span>}
          </button>
        ))}
      </div>

      <p className="type-meta mt-4"><span className="font-semibold text-primary-text">Tema do exemplo </span>{exemplo.tema}</p>
      <ol className="mt-3 space-y-3">
        {PARTES.map((p, i) => (
          <li key={p.chave} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
            <span data-numeric className="type-rotulo text-primary-text pt-px">{i + 1}</span>
            <div className="min-w-0">
              <p className="type-rotulo text-muted-foreground">{p.nome} · <span className="text-primary-text">{p.faz}</span></p>
              <p className="font-reading type-body mt-0.5">{exemplo[p.chave]}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-[var(--radius-control)] bg-[hsl(var(--primary)/0.08)] px-3 py-2.5">
        <p className="type-meta font-semibold">Agora você, no seu tema</p>
        <p className="type-meta mt-0.5">{PERGUNTA_DO_CORINGA[atual]} A resposta vira a parte 3.</p>
      </div>
    </section>
  );
}
