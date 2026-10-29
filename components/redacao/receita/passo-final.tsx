'use client';
// Passo final: a redação montada, o contador total, a correção com o que
// treinar (corrigir-no-treino.tsx), o checklist e "Copiar redação".

import { useState } from 'react';
import { Copy, FolderInput } from 'lucide-react';
import { toast } from 'sonner';
import { CHECKLIST_FINAL, LINHAS_TOTAL } from '@/lib/redacao/receita';
import { guardarEmSalvas, type CorrecaoDoTreino } from '@/lib/redacao/rascunho-receita';
import { CorrigirNoTreino } from './corrigir-no-treino';
import { CabecalhoPasso, ContadorLinhas, Marcavel } from './pecas';

export function PassoFinal({ tema, redacao, checklist, aoMarcar, correcao, aoGuardarCorrecao, aoIrPara }: {
  tema: string;
  redacao: string;
  checklist: boolean[];
  aoMarcar: (i: number, v: boolean) => void;
  correcao: CorrecaoDoTreino | null;
  aoGuardarCorrecao: (c: CorrecaoDoTreino) => void;
  aoIrPara: (passo: number) => void;
}) {
  const [copiada, setCopiada] = useState(false);
  const feitos = CHECKLIST_FINAL.filter((_, i) => checklist[i]).length;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(tema ? `Tema: ${tema}\n\n${redacao}` : redacao);
      setCopiada(true);
      toast.success('Redação copiada.');
    } catch {
      toast.error('Não deu para copiar. Selecione o texto e copie à mão.');
    }
  };
  const guardar = () => {
    if (guardarEmSalvas(tema || 'Sem tema', redacao)) toast.success('Guardada em Salvas, na tela de Redação.');
    else toast.error('O navegador não deixou guardar.');
  };

  return (
    <div>
      <CabecalhoPasso titulo="Redação montada" instrucao="Corrija para ver a nota e o que treinar na próxima." />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-start">
        <section className="surface-1 rounded-[var(--radius-surface)] p-4 md:p-6" aria-label="Redação inteira">
          {tema && <p className="type-meta text-muted-foreground mb-3">{tema}</p>}
          {redacao
            ? <div className="max-w-[var(--measure-reading)] font-reading text-body leading-[var(--lh-reading)] whitespace-pre-wrap break-words">{redacao}</div>
            : <p className="type-meta text-muted-foreground">Nenhum parágrafo escrito ainda.</p>}
          <div className="mt-4 pt-3 border-t border-border">
            <ContadorLinhas texto={redacao} min={LINHAS_TOTAL.min} max={LINHAS_TOTAL.max} />
          </div>
        </section>
        <div>
          <CorrigirNoTreino tema={tema} redacao={redacao} salva={correcao} aoGuardar={aoGuardarCorrecao} aoIrPara={aoIrPara} />
          <p data-numeric className="type-meta font-semibold mb-2">Antes de passar a limpo: {feitos} de {CHECKLIST_FINAL.length}</p>
          <div className="space-y-2 mb-5">
            {CHECKLIST_FINAL.map((item, i) => (
              <Marcavel key={item} marcado={!!checklist[i]} aoMudar={(v) => aoMarcar(i, v)}>{item}</Marcavel>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copiar}
              disabled={!redacao}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 surface-1 rounded-[var(--radius-control)] font-medium type-meta t-colors hover:bg-muted disabled:opacity-40"
            >
              <Copy className="w-4 h-4" aria-hidden /> {copiada ? 'Copiada' : 'Copiar redação'}
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={!redacao}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 surface-1 rounded-[var(--radius-control)] font-medium type-meta t-colors hover:bg-muted disabled:opacity-40"
            >
              <FolderInput className="w-4 h-4" aria-hidden /> Guardar em Salvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
