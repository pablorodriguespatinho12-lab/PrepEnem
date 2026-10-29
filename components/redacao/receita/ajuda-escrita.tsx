'use client';
// Aba "Ajuda" do painel dos passos 4 a 7 (Pablo, 29/10/2026: "onde eu estou,
// qual a minha próxima ação, como posso explicar isso ou aquilo"). Em cima,
// onde ele está, contado pelo código; embaixo, o que a IA sugere: a próxima
// ação e começos de frase que ele completa. A IA nunca escreve a frase toda.

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import type { RespostaAjuda } from '@/lib/redacao/ajuda';
import type { OndeEstou } from '@/lib/redacao/onde-estou';
import type { ChaveCausa, Paragrafo } from '@/lib/redacao/receita';
import { PerguntasGuia } from './pecas';

export interface DadosDaAjuda {
  tema: string;
  paragrafo: Paragrafo;
  texto: string;
  tese: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
}

/* Estado da ajuda guardado pelo pai: trocar de aba não apaga a resposta. */
export interface EstadoAjuda {
  carregando: boolean;
  erro: string | null;
  resposta: RespostaAjuda | null;
  pergunta: string;
}
export const ajudaVazia = (): EstadoAjuda => ({ carregando: false, erro: null, resposta: null, pergunta: '' });

export async function pedirAjuda(dados: DadosDaAjuda, pergunta: string): Promise<RespostaAjuda> {
  const res = await fetch('/api/redacao/ajuda', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tema: dados.tema, paragrafo: dados.paragrafo.chave, texto: dados.texto, tese: dados.tese,
      causaA: dados.causaA, causaB: dados.causaB, pergunta,
    }),
  });
  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof corpo?.error === 'string' ? corpo.error : 'A ajuda não respondeu. Tente de novo.');
  return corpo as RespostaAjuda;
}

/* As frases do molde em bolinhas: feita, a de agora, as que faltam. */
export function OndeVoceEsta({ paragrafo, onde }: { paragrafo: Paragrafo; onde: OndeEstou }) {
  const terminou = onde.atual >= onde.total;
  return (
    <div>
      <p className="type-rotulo text-muted-foreground mb-2">Onde você está</p>
      <ol className="flex items-center gap-1.5" aria-label="Frases do parágrafo">
        {Array.from({ length: onde.total }, (_, i) => {
          const feita = i < onde.atual;
          const agora = i === onde.atual;
          return (
            <li
              key={i}
              data-numeric
              aria-current={agora ? 'step' : undefined}
              className={`flex h-7 w-7 items-center justify-center rounded-full type-meta font-semibold ${feita ? 'bg-primary text-primary-foreground' : agora ? 'border-2 border-primary text-primary-text' : 'border border-border text-muted-foreground'}`}
            >
              {feita ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-label={`Frase ${i + 1} feita`} /> : i + 1}
            </li>
          );
        })}
      </ol>
      <p className="font-reading type-body mt-2">
        {terminou
          ? 'Você escreveu todas as frases. Agora confira as linhas e se cada frase faz a sua função.'
          : <>Frase <span data-numeric>{onde.atual + 1}</span> de <span data-numeric>{onde.total}</span>: {paragrafo.frases[onde.atual].funcao.toLowerCase()}.</>}
      </p>
    </div>
  );
}

interface Props {
  paragrafo: Paragrafo;
  onde: OndeEstou;
  perguntas: string[];
  estado: EstadoAjuda;
  aoPedir: (pergunta: string) => void;
  aoMudarPergunta: (p: string) => void;
  aoUsarComeco: (comeco: string) => void;
}

export function AjudaEscrita({ paragrafo, onde, perguntas, estado, aoPedir, aoMudarPergunta, aoUsarComeco }: Props) {
  const { carregando, erro, resposta, pergunta } = estado;
  const [ultimaPergunta, setUltimaPergunta] = useState('');
  const pedirCaminhos = () => {
    setUltimaPergunta('');
    aoPedir('');
  };
  const perguntar = () => {
    setUltimaPergunta(pergunta.trim());
    aoPedir(pergunta.trim());
  };

  return (
    <div className="space-y-5">
      <OndeVoceEsta paragrafo={paragrafo} onde={onde} />
      {!resposta && <PerguntasGuia perguntas={perguntas} />}

      {(!resposta || carregando) && (
        <button
          type="button"
          onClick={pedirCaminhos}
          disabled={carregando}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 py-2.5 type-meta font-medium text-primary-foreground shadow-elev-2 t-lift enabled:hover:-translate-y-px disabled:opacity-60"
        >
          {carregando && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
          {carregando ? 'Pensando...' : 'Me mostre caminhos'}
        </button>
      )}

      {erro && <p className="type-meta text-destructive" role="alert">{erro}</p>}

      {resposta && !carregando && (
        <section aria-live="polite" className="space-y-4">
          <div className="border-l-2 border-primary pl-3">
            <p className="type-rotulo text-primary-text">Próxima ação</p>
            <p className="font-reading type-body mt-0.5">{resposta.proximaAcao}</p>
            {resposta.sobreOTexto && <p className="type-meta text-muted-foreground mt-1">{resposta.sobreOTexto}</p>}
          </div>
          <div>
            <p className="type-rotulo text-muted-foreground mb-2">Caminhos para começar a frase</p>
            <ul className="space-y-2">
              {resposta.caminhos.map((c) => (
                <li key={c.comeco} className="rounded-[var(--radius-control)] border border-border p-3">
                  <p className="font-reading type-body">{c.comeco}</p>
                  <p className="type-meta text-muted-foreground mt-0.5">Depois: {c.completar}</p>
                  <button
                    type="button"
                    onClick={() => aoUsarComeco(c.comeco)}
                    className="mt-2 inline-flex items-center gap-1 type-meta font-medium text-primary-text hover:underline"
                  >
                    Usar este começo <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={pedirCaminhos} className="mt-2 type-meta font-medium text-muted-foreground hover:text-foreground t-colors">
              Outros caminhos
            </button>
          </div>
          {resposta.resposta && ultimaPergunta && (
            <div>
              <p className="type-rotulo text-muted-foreground">Sua pergunta: {ultimaPergunta}</p>
              <p className="font-reading type-body mt-0.5">{resposta.resposta}</p>
            </div>
          )}
        </section>
      )}

      <form
        className="pt-4 border-t border-border"
        onSubmit={(e) => { e.preventDefault(); if (pergunta.trim() && !carregando) perguntar(); }}
      >
        <label htmlFor="pergunta-ajuda" className="type-rotulo text-muted-foreground block mb-1.5">Travou? Pergunte</label>
        <div className="flex gap-2">
          <input
            id="pergunta-ajuda"
            value={pergunta}
            onChange={(e) => aoMudarPergunta(e.target.value)}
            maxLength={400}
            placeholder="Ex.: como explico a ideia do Bourdieu?"
            className="min-w-0 flex-1 rounded-[var(--radius-control)] border border-muted-foreground bg-[hsl(var(--surface-2))] px-3 py-2 type-meta placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!pergunta.trim() || carregando}
            className="rounded-[var(--radius-control)] border border-border px-3 py-2 type-meta font-medium t-colors hover:bg-muted disabled:opacity-50"
          >
            Perguntar
          </button>
        </div>
      </form>
    </div>
  );
}
