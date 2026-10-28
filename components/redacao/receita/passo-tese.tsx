'use client';
// Passo 3: a tese já vem no molde com as palavras do tema e as frases das
// causas escolhidas; o aluno edita. Avisa se a tese perdeu todas as
// palavras-chave do tema (regra 1 da receita: protege contra tangenciamento).

import { causaPorChave, moldeTese, teseTemPalavraDoTema, type ChaveCausa } from '@/lib/redacao/receita';
import { EXEMPLO_TESE } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso, CaixaTexto } from './pecas';
import { VerExemplo } from './autores';

export function PassoTese({ perguntas, tese, tema, causaA, causaB, aoMudar, desatualizada, aoAtualizar }: {
  perguntas: string[];
  tese: string;
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  aoMudar: (t: string) => void;
  desatualizada: boolean;
  aoAtualizar: () => void;
}) {
  const molde = moldeTese(causaA, causaB, tema);
  const semPalavraDoTema = !teseTemPalavraDoTema(tese, tema);
  return (
    <div>
      <CabecalhoPasso titulo="Tese" instrucao="Uma frase: o problema do tema e os 2 motivos." perguntas={perguntas} />
      <div className="surface-1 rounded-[var(--radius-surface)] p-4 mb-5">
        <p className="type-rotulo text-primary-text mb-1">Molde</p>
        <p className="font-reading type-body">[palavras do tema] decorre, sobretudo, de [motivo 1] e de [motivo 2].</p>
        <p className="type-meta text-muted-foreground mt-2">
          Motivo 1: {causaPorChave(causaA)?.nome ?? 'não escolhido'} → D1 · Motivo 2: {causaPorChave(causaB)?.nome ?? 'não escolhido'} → D2
        </p>
      </div>
      {desatualizada && (
        <p className="mb-3 type-meta" role="status">
          Seus motivos mudaram. Atualizar a tese?{' '}
          <button type="button" onClick={aoAtualizar} className="font-semibold text-primary-text underline underline-offset-2">Atualizar a tese</button>
        </p>
      )}
      <CaixaTexto id="tese" rotulo="Sua tese" valor={tese} aoMudar={aoMudar} placeholder={molde} />
      {semPalavraDoTema && (
        <p className="type-meta font-medium mt-2" role="status">Sua tese não tem nenhuma palavra do tema. Use as palavras do tema.</p>
      )}
      <VerExemplo>
        <p className="font-reading type-body">{EXEMPLO_TESE}</p>
        <p className="type-meta text-muted-foreground mt-2">Começa com as palavras do tema e termina com os 2 motivos, na ordem do D1 e do D2.</p>
      </VerExemplo>
    </div>
  );
}
