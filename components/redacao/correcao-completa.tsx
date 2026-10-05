'use client';
// Correção da redação inteira, na ordem dos comentários da cartilha do INEP:
// norma → tema e repertório → projeto → coesão → proposta. Cada competência
// mostra a nota, a evidência que a justifica e o que fazer para subir.

import { Check, X } from 'lucide-react';
import type { ChaveElemento, CorrecaoCompleta, Competencia } from '@/lib/redacao/correcao';

const NOMES: Record<Competencia, string> = {
  c1: 'C1 · Norma escrita',
  c2: 'C2 · Tema e repertório',
  c3: 'C3 · Projeto de texto',
  c4: 'C4 · Coesão',
  c5: 'C5 · Proposta de intervenção',
};

const ELEMENTOS: { chave: ChaveElemento; nome: string }[] = [
  { chave: 'agente', nome: 'Agente' }, { chave: 'acao', nome: 'Ação' }, { chave: 'modo', nome: 'Modo/meio' },
  { chave: 'efeito', nome: 'Efeito' }, { chave: 'detalhamento', nome: 'Detalhamento' },
];

function Marca({ ok }: { ok: boolean }) {
  return (
    <span style={{ color: ok ? 'hsl(var(--success))' : 'hsl(var(--danger))' }} aria-label={ok ? 'sim' : 'não'}>
      {ok ? <Check className="w-4 h-4 inline" strokeWidth={3} /> : <X className="w-4 h-4 inline" strokeWidth={3} />}
    </span>
  );
}

function Competencia({ c, nota, proximo, children }: { c: Competencia; nota: number; proximo?: string; children: React.ReactNode }) {
  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-3" aria-labelledby={`${c}-titulo`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`${c}-titulo`} className="font-display type-body font-semibold">{NOMES[c]}</h3>
        <span data-numeric className="font-display type-lead font-semibold">{nota}<span className="type-meta text-muted-foreground">/200</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden" aria-hidden>
        <div className="h-full w-full bg-primary origin-left" style={{ transform: `scaleX(${nota / 200})` }} />
      </div>
      {children}
      {proximo && (
        <p className="type-meta rounded-[var(--radius-control)] bg-primary/10 px-3 py-2">
          <strong className="text-primary-text">Para subir: </strong>{proximo}
        </p>
      )}
    </section>
  );
}

export function CorrecaoCompletaView({ correcao }: { correcao: CorrecaoCompleta }) {
  const { notas, proximoPasso: p } = correcao;
  return (
    <div className="space-y-4">
      {correcao.travas.length > 0 && (
        <div className="rounded-[var(--radius-control)] border p-4"
          style={{ backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }}>
          <p className="type-caption font-semibold mb-1" style={{ color: 'hsl(var(--danger))' }}>O que travou a nota</p>
          <ul className="type-meta space-y-1">{correcao.travas.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}

      <Competencia c="c1" nota={notas.c1} proximo={p.c1}>
        <p className="type-meta text-muted-foreground">Estrutura das frases: <strong className="text-foreground">{correcao.c1.estrutura}</strong> · <span data-numeric>{correcao.c1.desvios.length}</span> desvio(s). Para 200: no máximo 2.</p>
        {correcao.c1.desvios.length > 0 && (
          <ul className="space-y-1.5">
            {correcao.c1.desvios.map((d, i) => (
              <li key={i} className="type-meta">
                <span className="line-through text-muted-foreground">{d.trecho}</span> <strong>{d.correcao}</strong> <span className="text-muted-foreground">({d.tipo})</span>
              </li>
            ))}
          </ul>
        )}
      </Competencia>

      <Competencia c="c2" nota={notas.c2} proximo={p.c2}>
        <p className="type-meta text-muted-foreground">
          Abordagem: <strong className="text-foreground">{correcao.c2.abordagem}</strong>
          {correcao.c2.partesEmbrionarias > 0 && <> · <span data-numeric>{correcao.c2.partesEmbrionarias}</span> parte(s) curta(s) demais</>}
        </p>
        {correcao.c2.repertorios.length === 0 ? (
          <p className="type-meta">Nenhum repertório próprio encontrado. Sem ele a C2 para em 120.</p>
        ) : (
          <ul className="space-y-2">
            {correcao.c2.repertorios.map((r, i) => (
              <li key={i} className="type-meta">
                <p className="font-reading">&ldquo;{r.trecho}&rdquo;</p>
                <p className="text-muted-foreground">
                  <Marca ok={r.legitimado} /> legitimado · <Marca ok={r.pertinente} /> pertinente · <Marca ok={r.produtivo} /> produtivo
                  {r.comentario && <> · {r.comentario}</>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Competencia>

      <Competencia c="c3" nota={notas.c3} proximo={p.c3}>
        <ol className="space-y-1.5">
          {correcao.c3.paragrafos.map((par) => (
            <li key={par.numero} className="type-meta grid grid-cols-[1.25rem_1fr] gap-2">
              <Marca ok={par.desenvolvida} />
              <span><strong>§{par.numero}</strong> {par.ideia}{par.comentario && <span className="text-muted-foreground"> · {par.comentario}</span>}</span>
            </li>
          ))}
        </ol>
      </Competencia>

      <Competencia c="c4" nota={notas.c4} proximo={p.c4}>
        <p className="type-meta text-muted-foreground">
          Operadores entre parágrafos: <strong className="text-foreground">{correcao.c4.operadoresEntreParagrafos.join(', ') || 'nenhum'}</strong>. Para 200: pelo menos 2 e nenhuma inadequação.
        </p>
        {correcao.c4.inadequacoes.map((x, i) => (
          <p key={i} className="type-meta"><span className="line-through text-muted-foreground">{x.trecho}</span> · {x.porque}</p>
        ))}
        {correcao.c4.repeticoes.length > 0 && <p className="type-meta text-muted-foreground">Repetições: {correcao.c4.repeticoes.join(', ')}</p>}
      </Competencia>

      <Competencia c="c5" nota={notas.c5} proximo={p.c5}>
        <ul className="space-y-1.5">
          {ELEMENTOS.map(({ chave, nome }) => {
            const e = correcao.c5[chave];
            return (
              <li key={chave} className="type-meta grid grid-cols-[1.25rem_7rem_1fr] gap-2">
                <Marca ok={e.valido} />
                <strong>{nome}</strong>
                <span className="text-muted-foreground font-reading">{e.trecho ? `“${e.trecho}”` : 'não encontrado'}</span>
              </li>
            );
          })}
        </ul>
      </Competencia>

      {correcao.reescritas.length > 0 && (
        <section className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-4" aria-labelledby="reescritas-titulo">
          <h3 id="reescritas-titulo" className="font-display type-body font-semibold">Trechos para reescrever</h3>
          {correcao.reescritas.map((r, i) => (
            <div key={i} className="space-y-1">
              <p className="type-meta line-through text-muted-foreground font-reading">{r.original}</p>
              <p className="font-reading text-body">{r.sugestao}</p>
              <p className="type-meta text-muted-foreground">{r.porque}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/* A avaliação no banco é JSON (versão 2) ou markdown antigo. */
export function lerCorrecao(avaliacao: string | null | undefined): CorrecaoCompleta | null {
  if (!avaliacao?.startsWith('{')) return null;
  try {
    const c = JSON.parse(avaliacao);
    return c?.versao === 2 ? (c as CorrecaoCompleta) : null;
  } catch {
    return null;
  }
}
