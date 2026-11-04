'use client';
// Aba Exemplo quando o tema é do ENEM (Pablo, 02/11/2026): em vez de escolher
// assunto e ver um exemplo em OUTRO tema, ele vê quais autores servem no SEU
// tema (veredito dos 3 juízes) e o exemplo pronto nele, em 3 partes. "Me
// testar" esconde as marcas: ele adivinha se serve antes de ver.

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { coringaPorNome } from '@/lib/redacao/autores';
import type { AutorNoTema } from '@/lib/redacao/coringas-por-tema';
import { MEMORIA } from '@/lib/redacao/cartoes-coringas';
import { LEI_CORINGA, MOLDE_LIGACAO_SEM_LEI } from '@/lib/redacao/lei-coringa';

const PARTES = [
  { chave: 'citacao', nome: 'A frase do autor', faz: 'copie igual' },
  { chave: 'sentido', nome: 'O que ela quer dizer', faz: 'diga com suas palavras' },
  { chave: 'ligacao', nome: 'A ligação com o seu tema', faz: 'use a ideia e escreva do seu jeito' },
] as const;

const PILULA = 'inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 type-meta font-medium t-colors hover:bg-muted aria-pressed:border-primary aria-pressed:bg-[hsl(var(--primary)/0.12)]';

function Marca({ serve }: { serve: boolean }) {
  return serve
    ? <Check className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--success))' }} aria-label="serve" />
    : <X className="w-4 h-4 shrink-0 text-muted-foreground" aria-label="não serve" />;
}

export function AutoresNoTema({ autores, escolhido, aoEscolher, aoUsarFrase }: {
  autores: AutorNoTema[];
  escolhido: string | null;
  aoEscolher: (nome: string) => void;
  aoUsarFrase: (frase: string) => void;
}) {
  const [testando, setTestando] = useState(false);
  const [vistos, setVistos] = useState<string[]>([]);
  const atual = autores.find((a) => a.coringa === escolhido) ?? (testando ? null : autores.find((a) => a.serve) ?? null);
  const rotulo = (nome: string) => coringaPorNome(nome)?.rotulo ?? nome;
  const mostraMarca = (nome: string) => !testando || vistos.includes(nome);
  const escolher = (nome: string) => {
    aoEscolher(nome);
    if (testando && !vistos.includes(nome)) setVistos((v) => [...v, nome]);
  };
  const alternarTeste = () => {
    setTestando((t) => !t);
    setVistos([]);
  };

  return (
    <section aria-label="Autores no seu tema" data-medir="autores-no-tema">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display type-lead font-semibold">Qual autor usar no seu tema?</h4>
          <p className="type-meta text-muted-foreground mt-1">
            {testando ? 'Adivinhe: toque num autor e veja se ele serve neste tema.' : 'Testados neste tema. Toque num autor com ✓ para ver o exemplo.'}
          </p>
        </div>
        <button type="button" onClick={alternarTeste} aria-pressed={testando} className="shrink-0 rounded-[var(--radius-control)] px-3 py-2 type-meta font-medium text-primary-text t-colors hover:bg-muted">
          {testando ? 'Mostrar tudo' : 'Me testar'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Autores">
        {autores.map((a) => (
          <button key={a.coringa} type="button" aria-pressed={a.coringa === atual?.coringa} onClick={() => escolher(a.coringa)} className={PILULA}>
            {mostraMarca(a.coringa) && <Marca serve={a.serve} />}
            {rotulo(a.coringa)}
          </button>
        ))}
      </div>

      {atual && !atual.serve && (
        <p className="mt-6 type-body">
          <span className="font-semibold">Não serve neste tema.</span>{' '}
          <span className="text-muted-foreground">Nos testes, os avaliadores reprovaram {rotulo(atual.coringa)} aqui: a frase não se liga ao problema. Escolha um com ✓.</span>
        </p>
      )}

      {atual?.serve && (
        <div className="mt-6">
          <p className="type-rotulo text-primary-text flex items-center gap-1.5"><Marca serve /> Serve no seu tema. Assim ficou:</p>
          <ol className="mt-4 space-y-5">
            {PARTES.map((p, i) => (
              <li key={p.chave} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2">
                <span data-numeric className="type-rotulo text-primary-text pt-px">{i + 1}</span>
                <div className="min-w-0">
                  <p className="type-rotulo text-muted-foreground">{p.nome} · <span className="text-primary-text">{p.faz}</span></p>
                  <p className="font-reading type-body mt-1">{atual[p.chave]}</p>
                  {/* Para dizer com suas palavras, primeiro é preciso entender a frase
                      (Pablo, 02/11/2026: "os lírios não nascem da lei", o que é isso?). */}
                  {p.chave === 'sentido' && MEMORIA[atual.coringa] && (
                    <p className="type-meta text-muted-foreground mt-1.5">
                      Em palavras simples: {MEMORIA[atual.coringa].mecanismo}.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {atual.coringa === 'Drummond' && <LigacaoSemLei />}
          <button
            type="button"
            onClick={() => aoUsarFrase(atual.citacao ?? '')}
            className="mt-5 rounded-[var(--radius-control)] bg-primary text-primary-foreground px-4 py-2.5 type-meta font-medium t-colors hover:opacity-90"
          >
            Pôr a frase do autor no meu texto
          </button>
        </div>
      )}
    </section>
  );
}

/* Tema sem lei própria: o molde da ligação e uma lei que serve em quase tudo
   e pouca gente usa (lib/redacao/lei-coringa.ts). */
function LigacaoSemLei() {
  return (
    <div className="mt-5 border-l-2 border-primary pl-4">
      <p className="type-rotulo text-primary-text">Seu tema não tem uma lei própria?</p>
      <p className="font-reading type-body mt-1">{MOLDE_LIGACAO_SEM_LEI}</p>
      <p className="type-meta text-muted-foreground mt-2">
        Uma lei que serve em quase todo tema e pouca gente usa: o {LEI_CORINGA.nome} ({LEI_CORINGA.quando}).
      </p>
      <ul className="mt-1.5 type-meta text-muted-foreground">
        {LEI_CORINGA.artigos.map((a) => (
          <li key={a.artigo}><span className="text-foreground font-medium">{a.artigo}</span>: {a.assunto}</li>
        ))}
      </ul>
    </div>
  );
}
