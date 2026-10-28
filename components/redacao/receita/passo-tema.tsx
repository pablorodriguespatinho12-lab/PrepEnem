'use client';
// Passo 1: escolher um tema que já existe ou digitar um livre.

import { EXEMPLO_TEMA } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso } from './pecas';
import { VerExemplo } from './autores';
import type { TemaDaLista } from './use-temas';

export function PassoTema({ perguntas, tema, temas, erro, aoMudar }: {
  perguntas: string[];
  tema: string;
  temas: TemaDaLista[];
  erro: boolean;
  aoMudar: (t: string) => void;
}) {
  return (
    <div>
      {/* Pedido do Pablo (27/10/2026): o iniciante sabe o tamanho da tarefa antes. */}
      <div className="surface-1 rounded-[var(--radius-surface)] px-4 py-3 mb-5">
        <p data-numeric className="type-meta font-semibold">7 passos, cerca de 40 minutos.</p>
        <p className="type-meta text-muted-foreground">No fim você tem a redação inteira montada para copiar.</p>
      </div>
      <CabecalhoPasso titulo="Tema" instrucao="Escolha um tema da lista ou digite outro." perguntas={perguntas} />
      <label htmlFor="tema-livre" className="type-meta font-semibold block mb-2">Tema</label>
      <input
        id="tema-livre"
        value={tema}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder="Digite o tema"
        className="block w-full rounded-[var(--radius-control)] border border-muted-foreground bg-[hsl(var(--surface-2))] px-4 py-3 type-body placeholder:text-muted-foreground focus:outline-none mb-5"
      />
      {erro && <p className="type-meta text-muted-foreground">Não deu para carregar a lista. Digite o tema acima.</p>}
      {temas.length > 0 && (
        <ul className="space-y-2" aria-label="Temas de provas anteriores">
          {temas.map((t) => {
            const escolhido = t.tema === tema;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => aoMudar(t.tema)}
                  aria-pressed={escolhido}
                  className="w-full text-left rounded-[var(--radius-control)] border px-4 py-3 t-colors hover:bg-muted"
                  style={escolhido ? { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' } : undefined}
                >
                  {t.anoEnem && <span data-numeric className="type-meta text-muted-foreground mr-2">{t.anoEnem}</span>}
                  <span className="type-meta font-medium">{t.tema}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <VerExemplo>
        <p className="font-reading type-body">{EXEMPLO_TEMA}</p>
        <p className="type-meta text-muted-foreground mt-2">O tema já diz o problema. Você vai repetir essas palavras na tese e no começo de cada parágrafo.</p>
      </VerExemplo>
    </div>
  );
}
