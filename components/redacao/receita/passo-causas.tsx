'use client';
// Passo 2: escolher 2 das 5 causas coringa. A 1ª vira o D1, a 2ª o D2.
// Tema da lista com dupla na receita: os 2 cartões ganham o selo "Sugerido"
// (e vêm pré-selecionados se nenhum motivo foi escolhido). Tocar de novo desmarca.
// Os autores ficam fora do botão de escolher (botão dentro de botão não vale):
// cada nome abre a ficha.

import { CAUSAS, causaPorChave, motivosQueCombinamPouco, type ChaveCausa } from '@/lib/redacao/receita';
import { conteudoDoTema } from '@/lib/redacao/conteudo-temas';
import { EXEMPLO_CAUSAS } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso } from './pecas';
import { ListaAutores, VerExemplo } from './autores';

const DESTAQUE = { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' };
const SELO = { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' };

export function PassoCausas({ tema, causaA, causaB, sugeridas, aoMudar }: {
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  sugeridas: ChaveCausa[];
  aoMudar: (a: ChaveCausa | null, b: ChaveCausa | null) => void;
}) {
  const tocar = (c: ChaveCausa) => {
    if (c === causaA) return aoMudar(causaB, null);
    if (c === causaB) return aoMudar(causaA, null);
    if (!causaA) return aoMudar(c, causaB);
    if (!causaB) return aoMudar(causaA, c);
    aoMudar(causaA, c);
  };
  return (
    <div>
      <CabecalhoPasso titulo="Por que esse problema existe?" instrucao="Escolha 2 motivos. Eles viram sua tese e os 2 parágrafos do meio." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {CAUSAS.map((c) => {
          const ordem = c.chave === causaA ? '1º motivo' : c.chave === causaB ? '2º motivo' : null;
          const sugerida = sugeridas.includes(c.chave);
          return (
            <li key={c.chave} className="h-full flex flex-col rounded-[var(--radius-surface)] border t-colors" style={ordem ? DESTAQUE : undefined}>
              <button
                type="button"
                onClick={() => tocar(c.chave)}
                aria-pressed={ordem !== null}
                className="w-full text-left rounded-t-[var(--radius-surface)] p-4 pb-3 t-colors hover:bg-muted"
              >
                <span className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-display type-body font-semibold">{c.nome}</span>
                  {ordem && <span className="type-meta font-semibold rounded-[var(--radius-data)] px-2 py-0.5" style={SELO}>{ordem}</span>}
                </span>
                {sugerida && <span className="block type-caption font-semibold text-primary-text mb-2">Sugerido para este tema</span>}
                <span className="block type-caption font-semibold text-muted-foreground">Entra na tese:</span>
                <span className="block font-reading type-meta">{c.fraseDeTese}</span>
              </button>
              <div className="px-4 pb-4">
                <ListaAutores nomes={c.repertorios} />
              </div>
            </li>
          );
        })}
      </ul>
      <AvisoMotivo tema={tema} causaA={causaA} causaB={causaB} />
      <MiniMapa causaA={causaA} causaB={causaB} />
      <VerExemplo>
        <p className="type-meta"><span className="font-semibold">1º motivo:</span> {causaPorChave(EXEMPLO_CAUSAS[0])?.nome}</p>
        <p className="type-meta"><span className="font-semibold">2º motivo:</span> {causaPorChave(EXEMPLO_CAUSAS[1])?.nome}</p>
        <p className="type-meta text-muted-foreground mt-2">Quem tem doença mental é visto só pela doença (estigma), e falta atendimento perto de casa (omissão do Estado).</p>
      </VerExemplo>
    </div>
  );
}

/* Onde cada motivo vai parar na redação, preenchido ao escolher. */
function MiniMapa({ causaA, causaB }: { causaA: ChaveCausa | null; causaB: ChaveCausa | null }) {
  const linhas: [string, ChaveCausa | null, string][] = [['1º motivo', causaA, 'Desenvolvimento 1'], ['2º motivo', causaB, 'Desenvolvimento 2']];
  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-4 mt-5" aria-label="Para onde vai cada motivo">
      <ul className="space-y-1.5">
        {linhas.map(([ordem, causa, destino]) => (
          <li key={ordem} className="type-meta">
            <span className="font-semibold">{ordem}</span>
            <span className="text-muted-foreground">{causa ? ` (${causaPorChave(causa)?.nome})` : ' (escolha acima)'}</span>
            <span aria-hidden> → </span><span className="sr-only"> vai para o </span>{destino}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Avisa, não bloqueia: o aluno pode ter um bom argumento para o motivo. */
export function AvisoMotivo({ tema, causaA, causaB, aoTrocar }: {
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  aoTrocar?: () => void;
}) {
  const fracos = motivosQueCombinamPouco(tema, causaA, causaB);
  const sugeridos = conteudoDoTema(tema)?.causas;
  if (fracos.length === 0 || !sugeridos) return null;
  const [x, y] = sugeridos.map((c) => causaPorChave(c)?.nome);
  return (
    <p className="mt-4 type-meta" role="status">
      {fracos.length === 1 ? 'Esse motivo combina' : 'Esses motivos combinam'} pouco com o tema. Os sugeridos são {x} e {y}.
      {aoTrocar && (
        <> <button type="button" onClick={aoTrocar} className="font-semibold text-primary-text underline underline-offset-2">Trocar motivos</button></>
      )}
    </p>
  );
}
