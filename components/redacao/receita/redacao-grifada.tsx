'use client';
// "Ver uma redação pronta, explicada" (Pablo, 28/10/2026): a redação inteira
// do tema de 2020, cada trecho grifado pela FUNÇÃO. O grifo não depende só da
// cor (daltonismo): cada trecho tem o rótulo curto em cima e um traço
// diferente embaixo (contínuo, tracejado, pontilhado, duplo). Tocar num
// trecho mostra 1 linha do que ele faz. Os dados são a lista de trechos de
// lib/redacao/exemplo-receita.ts, não uma string com índices.

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BookOpenText, X } from 'lucide-react';
import { contarLinhas, PARAGRAFOS } from '@/lib/redacao/receita';
import {
  EXEMPLO_ANO, EXEMPLO_TEMA, FUNCOES, funcaoInfo, REDACAO_GRIFADA, textoDaFrase,
  type FuncaoTrecho, type Trecho,
} from '@/lib/redacao/exemplo-receita';

type Grifo = { cor: string; traco: 'solid' | 'dashed' | 'dotted' | 'double' };
/* Grupo de cor + traço. As 5 partes da proposta dividem a cor e se separam
   pelo rótulo, que é o que o aluno precisa ler um a um. */
const GRIFO: Record<FuncaoTrecho, Grifo> = {
  repertorio: { cor: '--chart-1', traco: 'solid' },
  ponte: { cor: '--chart-2', traco: 'dashed' },
  tese: { cor: '--chart-5', traco: 'double' },
  topico: { cor: '--chart-4', traco: 'solid' },
  explicacao: { cor: '--chart-3', traco: 'dotted' },
  fechamento: { cor: '--muted-foreground', traco: 'dashed' },
  agente: { cor: '--chart-5', traco: 'solid' },
  acao: { cor: '--chart-5', traco: 'solid' },
  meio: { cor: '--chart-5', traco: 'solid' },
  finalidade: { cor: '--chart-5', traco: 'solid' },
  detalhamento: { cor: '--chart-5', traco: 'solid' },
};
const estiloGrifo = (f: FuncaoTrecho, ativo: boolean): React.CSSProperties => {
  const g = GRIFO[f];
  return {
    backgroundColor: `hsl(var(${g.cor}) / ${ativo ? 0.32 : 0.14})`,
    borderBottom: `${g.traco === 'double' ? 4 : 2}px ${g.traco} hsl(var(${g.cor}))`,
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };
};

const rotuloDoTrecho = (t: Trecho) => `${funcaoInfo(t.funcao!).rotulo}${t.fato ? ' · fato histórico' : ''}`;

export function BotaoRedacaoPronta({ destaque = false }: { destaque?: boolean }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {destaque ? (
          <button type="button" className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border surface-1 px-4 py-3 type-meta font-semibold t-colors hover:bg-muted">
            <BookOpenText className="w-4 h-4 text-primary-text" aria-hidden /> Ver uma redação pronta, explicada
          </button>
        ) : (
          <button type="button" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
            <BookOpenText className="w-4 h-4" aria-hidden /> Redação pronta
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col bg-background md:inset-y-6 md:mx-auto md:w-[min(48rem,calc(100vw-3rem))] md:rounded-[var(--radius-surface)] md:shadow-elev-3 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none focus:outline-none"
          aria-describedby="redacao-grifada-descricao"
        >
          <RedacaoGrifada />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RedacaoGrifada() {
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const trechos = PARAGRAFOS.flatMap((p) => REDACAO_GRIFADA[p.chave].flatMap((f, i) => f.map((t, j) => ({ id: `${p.chave}-${i}-${j}`, t }))));
  const atual = trechos.find((x) => x.id === escolhido)?.t;
  const linhas = contarLinhas(PARAGRAFOS.map((p) => REDACAO_GRIFADA[p.chave].map(textoDaFrase).join(' ')).join('\n'));

  return (
    <>
      <header className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-8">
        <div className="min-w-0">
          <Dialog.Title className="font-display type-title font-semibold">Redação pronta, explicada</Dialog.Title>
          <p id="redacao-grifada-descricao" className="type-meta text-muted-foreground mt-1">
            <span data-numeric>ENEM {EXEMPLO_ANO}</span>: {EXEMPLO_TEMA}. <span data-numeric>{linhas}</span> linhas. Exemplo de estrutura, não copie.
          </p>
        </div>
        <Dialog.Close className="-mr-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[var(--radius-control)] t-colors hover:bg-muted" aria-label="Fechar">
          <X className="w-5 h-5" aria-hidden />
        </Dialog.Close>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
        <Legenda />
        <div className="mt-6 space-y-6 max-w-[var(--measure-reading)]">
          {PARAGRAFOS.map((p) => (
            <section key={p.chave} aria-label={p.titulo}>
              <h3 className="font-sans type-rotulo text-muted-foreground mb-2">{p.titulo}</h3>
              <p className="font-reading type-body leading-[2.1]">
                {REDACAO_GRIFADA[p.chave].map((frase, i) => (
                  <span key={i}>
                    {frase.map((t, j) => {
                      const id = `${p.chave}-${i}-${j}`;
                      if (!t.funcao) return <span key={id}>{t.texto}</span>;
                      const ativo = id === escolhido;
                      return (
                        /* span, não button: botão é um bloco inteiro na linha e
                           não quebra no meio do trecho; a pontuação caía sozinha. */
                        <span
                          key={id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setEscolhido(ativo ? null : id)}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter' && e.key !== ' ') return;
                            e.preventDefault();
                            setEscolhido(ativo ? null : id);
                          }}
                          aria-pressed={ativo}
                          className="cursor-pointer rounded-[2px] px-0.5 t-colors"
                          style={estiloGrifo(t.funcao, ativo)}
                        >
                          <span className="type-rotulo text-muted-foreground mr-1 align-[0.15em] font-sans">{rotuloDoTrecho(t)}</span>
                          {t.texto}
                        </span>
                      );
                    })}
                    {i < REDACAO_GRIFADA[p.chave].length - 1 && ' '}
                  </span>
                ))}
              </p>
            </section>
          ))}
        </div>
      </div>

      {/* A linha do que o trecho faz fica presa embaixo: aparece onde o dedo está. */}
      <p className="border-t border-border surface-1 px-4 py-3 md:px-8 type-meta min-h-[3.5rem] md:rounded-b-[var(--radius-surface)]" aria-live="polite">
        {atual?.funcao
          ? <><span className="font-semibold">{rotuloDoTrecho(atual)}.</span> {atual.nota ?? funcaoInfo(atual.funcao).explica}</>
          : <span className="text-muted-foreground">Toque num trecho grifado para ver o que ele faz.</span>}
      </p>
    </>
  );
}

/* Cada função com a amostra do grifo (cor + traço) e o nome. A proposta vem
   inteira, elemento por elemento. */
function Legenda() {
  const comuns = FUNCOES.filter((f) => !f.proposta);
  const proposta = FUNCOES.filter((f) => f.proposta);
  const item = (f: (typeof FUNCOES)[number]) => (
    <li key={f.chave} className="flex items-center gap-2 type-meta">
      <span className="inline-block h-4 w-6 flex-shrink-0 rounded-[2px]" style={estiloGrifo(f.chave, false)} aria-hidden />
      {f.rotulo}
    </li>
  );
  return (
    <section aria-label="Legenda dos grifos" className="grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">{comuns.map(item)}</ul>
      <div>
        <p className="type-rotulo text-muted-foreground mb-1.5">Proposta, um a um</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">{proposta.map(item)}</ul>
      </div>
    </section>
  );
}
