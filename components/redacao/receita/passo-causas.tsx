'use client';
// Passo 2: escolher 2 das 5 causas coringa. A 1ª vira o D1, a 2ª o D2.
// Tema da lista com dupla na receita: os 2 cartões ganham o selo "Sugerido"
// (e vêm pré-selecionados se nenhum motivo foi escolhido). Tocar de novo desmarca.
// Os autores ficam fora do botão de escolher (botão dentro de botão não vale):
// cada nome abre a ficha.

import { CAUSAS, causaPorChave, meuMotivo, motivosQueCombinamPouco, type ChaveCausa, type MeusMotivos } from '@/lib/redacao/receita';
import { conteudoDoTema } from '@/lib/redacao/conteudo-temas';
import { EXEMPLO_CAUSAS } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso } from './pecas';
import { criarMarcador } from './glossario';
import { AutoresEmLinha, VerExemplo } from './autores';

const DESTAQUE = { borderColor: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary) / 0.1)' };
const SELO = { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' };

export function PassoCausas({ perguntas, tema, causaA, causaB, sugeridas, aoMudar, meusMotivos, aoMudarMeus }: {
  perguntas: string[];
  tema: string;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  sugeridas: ChaveCausa[];
  aoMudar: (a: ChaveCausa | null, b: ChaveCausa | null) => void;
  meusMotivos: MeusMotivos;
  aoMudarMeus: (m: MeusMotivos) => void;
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
      <CabecalhoPasso titulo="Por que esse problema existe?" instrucao={criarMarcador()('Escolha 2 motivos, ou escreva os seus no fim da página. Eles viram sua tese e os 2 parágrafos do meio.')} perguntas={perguntas} />
      {/* O aviso fica em cima dos cartões: embaixo, ficava fora da tela. */}
      <AvisoMotivo tema={tema} causaA={causaA} causaB={causaB} />
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
                {sugerida && <span className="block type-rotulo text-primary-text mb-2">Sugerido para este tema</span>}
                <span className="block type-rotulo text-muted-foreground">Vai para o fim da sua tese:</span>
                <span className="block font-reading type-body">{c.fraseDeTese}</span>
              </button>
              <div className="px-4 pb-4">
                <AutoresEmLinha nomes={c.repertorios} coringas={c.coringas} causas={[c.chave]} titulo="Autores para citar" />
              </div>
            </li>
          );
        })}
      </ul>
      <MeusMotivosCampos meus={meusMotivos} aoMudar={aoMudarMeus} />
      <MiniMapa causaA={causaA} causaB={causaB} meus={meusMotivos} />
      <VerExemplo>
        <p className="type-meta"><span className="font-semibold">1º motivo:</span> {causaPorChave(EXEMPLO_CAUSAS[0])?.nome}</p>
        <p className="type-meta"><span className="font-semibold">2º motivo:</span> {causaPorChave(EXEMPLO_CAUSAS[1])?.nome}</p>
        <p className="type-meta text-muted-foreground mt-2">Quem tem doença mental é visto só pela doença (estigma), e falta atendimento perto de casa (omissão do Estado).</p>
      </VerExemplo>
    </div>
  );
}

/* O motivo com as palavras dele (Pablo, 02/11/2026: escreveu "a
   desinformação" e "a falta de empatia", que não estão nas 5 causas, e o
   molde seguia outro caminho). Opcional: escrito, ele manda no molde e na
   tese; a causa escolhida acima continua dando os autores. */
function MeusMotivosCampos({ meus, aoMudar }: { meus: MeusMotivos; aoMudar: (m: MeusMotivos) => void }) {
  const campo = (i: 0 | 1, rotulo: string, exemplo: string) => (
    <div>
      <label htmlFor={`meu-motivo-${i}`} className="type-meta font-semibold block mb-1.5">{rotulo}</label>
      <input
        id={`meu-motivo-${i}`}
        value={meus[i]}
        maxLength={160}
        onChange={(e) => aoMudar(i === 0 ? [e.target.value, meus[1]] : [meus[0], e.target.value])}
        placeholder={exemplo}
        className="block w-full rounded-[var(--radius-control)] border border-muted-foreground bg-[hsl(var(--surface-2))] px-4 py-2.5 type-body placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
  return (
    <section className="mt-6" aria-labelledby="meus-motivos-titulo">
      <h3 id="meus-motivos-titulo" className="font-display type-lead font-semibold">Tem outro motivo? Escreva do seu jeito</h3>
      <p className="type-meta text-muted-foreground mt-1 mb-3">Opcional. O que você escrever aqui vai para a tese e para os moldes no lugar da frase do cartão.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {campo(0, '1º motivo, com suas palavras', 'Ex.: a desinformação sobre o assunto')}
        {campo(1, '2º motivo, com suas palavras', 'Ex.: a falta de empatia da população')}
      </div>
    </section>
  );
}
/* Onde cada motivo vai parar na redação, preenchido ao escolher. */
function MiniMapa({ causaA, causaB, meus }: { causaA: ChaveCausa | null; causaB: ChaveCausa | null; meus: MeusMotivos }) {
  const nome = (causa: ChaveCausa | null, meu: string) => meuMotivo(meu) || causaPorChave(causa)?.nome || null;
  const linhas: [string, string | null, string][] = [['1º motivo', nome(causaA, meus[0]), 'Desenvolvimento 1'], ['2º motivo', nome(causaB, meus[1]), 'Desenvolvimento 2']];
  return (
    <section className="surface-1 rounded-[var(--radius-surface)] p-4 mt-5" aria-label="Para onde vai cada motivo">
      <ul className="space-y-1.5">
        {linhas.map(([ordem, causa, destino]) => (
          <li key={ordem} className="type-meta">
            <span className="font-semibold">{ordem}</span>
            <span className="text-muted-foreground">{causa ? ` (${causa})` : ' (escolha ou escreva acima)'}</span>
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
    <p className="mb-4 mt-1 border-l-2 border-[hsl(var(--chart-5))] pl-3 type-meta" role="status">
      <span className="font-semibold">{fracos.map((c) => causaPorChave(c)?.nome).join(' e ')}:</span>{' '}
      {fracos.length === 1 ? 'esse motivo combina' : 'esses motivos combinam'} pouco com o tema. Os sugeridos são {x} e {y}.
      {aoTrocar && (
        <> <button type="button" onClick={aoTrocar} className="font-semibold text-primary-text underline underline-offset-2">Trocar motivos</button></>
      )}
    </p>
  );
}
