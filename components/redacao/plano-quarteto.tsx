'use client';
// Treino "Planejar com os trios" (Pablo, 07/11/2026): tema real do ENEM,
// ele escreve o plano com as palavras dele e o site avalia na hora, sem IA
// (lib/redacao/plano-quarteto.ts).

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { avaliarPlano, respostaSugerida, TEMAS_DO_PLANO, NOME_DA_PARTE, type Avaliacao } from '@/lib/redacao/plano-quarteto';

const EXEMPLO = 'Ex.: Pacto e Drummond na introdução, Rui no primeiro argumento e Dom Hélder no segundo.';

const sortear = (atual?: string): string => {
  const outros = TEMAS_DO_PLANO.filter((t) => t !== atual);
  return outros[Math.floor(Math.random() * outros.length)];
};

function Marca({ serve }: { serve: boolean }) {
  return serve
    ? <Check className="w-5 h-5 shrink-0" style={{ color: 'hsl(var(--success))' }} aria-label="serve" />
    : <X className="w-5 h-5 shrink-0 text-destructive" aria-label="não serve" />;
}

function Resultado({ tema, avaliacao }: { tema: string; avaliacao: Avaliacao }) {
  const [verResposta, setVerResposta] = useState(false);
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-live="polite"
      data-testid="resultado-plano"
      className="mt-5 space-y-4"
    >
      <p className="font-display type-lead font-semibold" style={avaliacao.certo ? { color: 'hsl(var(--success))' } : undefined}>
        {avaliacao.titulo}
      </p>
      <ul className="space-y-2">
        {avaliacao.partes.map((p) => (
          <li key={p.parte} className="flex items-start gap-3 rounded-[var(--radius-control)] border border-border p-3">
            {p.autor ? <Marca serve={p.serve} /> : <X className="w-5 h-5 shrink-0 text-muted-foreground" aria-label="faltou" />}
            <span>
              <span className="type-meta text-muted-foreground">{NOME_DA_PARTE[p.parte]}: </span>
              <span className="font-semibold">{p.autor ?? 'faltou'}</span>
              {p.autor && !p.serve && <span className="type-meta text-muted-foreground"> · não passou neste tema</span>}
              {p.aviso && <span className="block type-meta text-muted-foreground mt-0.5">{p.aviso}</span>}
            </span>
          </li>
        ))}
      </ul>
      {avaliacao.dicas.length > 0 && (
        <ul className="space-y-1 type-meta">
          {avaliacao.dicas.map((d) => <li key={d}>• {d}</li>)}
        </ul>
      )}
      {avaliacao.ligacoes.length > 0 && (
        <div className="space-y-2">
          <p className="type-meta font-semibold">Como ligar ao tema (exemplo aprovado):</p>
          {avaliacao.ligacoes.map((l) => (
            <p key={l.autor} className="type-meta text-muted-foreground"><span className="font-semibold text-foreground">{l.autor}:</span> {l.texto}</p>
          ))}
        </div>
      )}
      {!avaliacao.certo && (
        verResposta
          ? <p className="type-meta rounded-[var(--radius-control)] bg-muted p-3" data-testid="resposta-sugerida">{respostaSugerida(tema)}</p>
          : <button type="button" onClick={() => setVerResposta(true)} className="type-meta font-medium text-primary-text py-2 t-colors">Ver a resposta</button>
      )}
    </motion.section>
  );
}

export function PlanoQuarteto() {
  const [tema, setTema] = useState<string>(() => TEMAS_DO_PLANO[0]);
  const [texto, setTexto] = useState('');
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);

  const trocarTema = () => {
    setTema((t) => sortear(t));
    setTexto('');
    setAvaliacao(null);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display type-title font-semibold">Planejar com os trios</h1>
      <p className="type-meta text-muted-foreground mt-1">Leia o tema e escreva quem vai na introdução, no 1º e no 2º argumento.</p>

      <div className="mt-5 rounded-[var(--radius-surface)] border border-border bg-card p-5 shadow-elev-1">
        <div className="flex items-start justify-between gap-3">
          <p className="type-caption uppercase tracking-wide text-muted-foreground">Tema do ENEM</p>
          <button type="button" onClick={trocarTema} className="inline-flex items-center gap-1.5 type-meta font-medium text-primary-text py-1 t-colors">
            <Shuffle className="w-4 h-4" aria-hidden /> Outro tema
          </button>
        </div>
        <p className="font-display type-lead font-semibold mt-1" data-testid="tema-plano">{tema}</p>

        <label htmlFor="plano-texto" className="block type-meta font-semibold mt-5 mb-2">Seu plano</label>
        <Textarea
          id="plano-texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={EXEMPLO}
          rows={4}
          className="text-base"
        />
        <Button className="mt-3 w-full sm:w-auto" disabled={texto.trim().length === 0} onClick={() => setAvaliacao(avaliarPlano(tema, texto))}>
          Avaliar meu plano
        </Button>

        {avaliacao && <Resultado key={`${tema}|${texto}`} tema={tema} avaliacao={avaliacao} />}
      </div>
      <a href="/redacao/modelos" className="inline-block mt-4 type-meta font-medium text-primary-text py-2 t-colors">
        Ver as redações prontas do Trio 1 e do Trio 2 →
      </a>
    </div>
  );
}
