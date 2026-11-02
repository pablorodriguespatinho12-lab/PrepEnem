'use client';
// Peças comuns do Treino por partes guiado: barra de progresso, contador de
// linhas, caixa de texto e caixa de marcar. Movimento só em transform/opacity.

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { contarLinhas, situacaoLinhas, type SituacaoLinhas } from '@/lib/redacao/receita';

export const TOTAL_PASSOS = 7;

/* Barra por scaleX (não width): roda no compositor. */
export function BarraProgresso({ passo }: { passo: number }) {
  const fracao = Math.min(passo, TOTAL_PASSOS) / TOTAL_PASSOS;
  const rotulo = passo > TOTAL_PASSOS ? 'Pronto para copiar' : `Passo ${passo} de ${TOTAL_PASSOS}`;
  return (
    <div>
      <p data-numeric className="type-meta text-muted-foreground mb-2">{rotulo}</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_PASSOS} aria-valuenow={Math.min(passo, TOTAL_PASSOS)} aria-label={rotulo}>
        <motion.div
          className="h-full w-full bg-primary origin-left"
          initial={false}
          animate={{ scaleX: fracao }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* Verde e vermelho são só para acerto e erro (app/globals.css): aqui a
   situação vem escrita, e "na meta" usa a cor de destaque do texto. */
const COR_SITUACAO: Record<SituacaoLinhas, string> = {
  vazio: 'hsl(var(--muted-foreground))',
  curto: 'hsl(var(--foreground))',
  'na-meta': 'hsl(var(--primary-text))',
  longo: 'hsl(var(--foreground))',
};
const TEXTO_SITUACAO: Record<SituacaoLinhas, string> = {
  vazio: '',
  curto: 'continue escrevendo',
  'na-meta': 'na meta',
  longo: 'passou um pouco, pode cortar',
};

export function ContadorLinhas({ texto, min, max }: { texto: string; min: number; max: number }) {
  const linhas = contarLinhas(texto);
  const situacao = situacaoLinhas(linhas, min, max);
  return (
    <p data-numeric className="type-meta font-medium" style={{ color: COR_SITUACAO[situacao] }} aria-live="polite">
      {linhas} {linhas === 1 ? 'linha' : 'linhas'} · o ideal é {min} a {max}
      {TEXTO_SITUACAO[situacao] && ` · ${TEXTO_SITUACAO[situacao]}`}
    </p>
  );
}

/* encher: na tela grande a caixa ocupa a altura que sobra na coluna (o pai é
   flex em coluna com altura fixa), em vez de uma altura chutada. */
export function CaixaTexto({ id, valor, aoMudar, rotulo, placeholder, alto = false, encher = false }: {
  id: string;
  valor: string;
  aoMudar: (v: string) => void;
  rotulo: React.ReactNode;
  placeholder: string;
  alto?: boolean;
  encher?: boolean;
}) {
  return (
    <div className={encher ? 'lg:flex lg:flex-1 lg:flex-col' : undefined}>
      <label htmlFor={id} className="type-meta font-semibold block mb-2">{rotulo}</label>
      <textarea
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        className={`block w-full max-w-[var(--measure-reading)] rounded-[var(--radius-control)] border border-muted-foreground bg-[hsl(var(--surface-2))] p-4 font-reading text-body leading-[var(--lh-reading)] placeholder:text-muted-foreground resize-y focus:outline-none ${alto ? 'min-h-[18rem]' : 'min-h-[7rem]'} ${encher ? 'lg:min-h-[9rem] lg:flex-1 lg:resize-none' : ''}`}
      />
    </div>
  );
}

export function Marcavel({ marcado, aoMudar, children }: { marcado: boolean; aoMudar: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={marcado}
      onClick={() => aoMudar(!marcado)}
      className="w-full flex items-start gap-3 text-left rounded-[var(--radius-control)] border border-border px-3 py-2.5 t-colors hover:bg-muted"
    >
      <span
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[var(--radius-data)] border-2 t-colors"
        style={marcado
          ? { backgroundColor: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }
          : { borderColor: 'hsl(var(--muted-foreground))' }}
        aria-hidden
      >
        {marcado && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className="type-meta">{children}</span>
    </button>
  );
}

/* Título de cada passo: o que fazer, em uma linha; embaixo, as perguntas-guia. */
export function CabecalhoPasso({ titulo, instrucao, perguntas = [] }: { titulo: string; instrucao: React.ReactNode; perguntas?: string[] }) {
  return (
    <div className="mb-5">
      <h2 className="font-display type-title font-semibold">{titulo}</h2>
      <p className="type-meta text-muted-foreground mt-1">{instrucao}</p>
      {perguntas.length > 0 && <div className="mt-4"><PerguntasGuia perguntas={perguntas} /></div>}
    </div>
  );
}
/* As perguntas-guia do passo: o site questiona o aluno antes de ele escrever.
   Texto de leitura (serif), sem ação: não disputa com o Próximo. */
export function PerguntasGuia({ perguntas }: { perguntas: string[] }) {
  if (perguntas.length === 0) return null;
  return (
    <section className="border-l-2 border-primary pl-4" aria-label="Perguntas para pensar">
      <p className="type-rotulo text-primary-text mb-1">Pense antes (de cabeça, não precisa escrever)</p>
      <ul className="space-y-1">
        {perguntas.map((p) => <li key={p} className="font-reading type-body">{p}</li>)}
      </ul>
    </section>
  );
}
