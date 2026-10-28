'use client';
// Passos 4 a 7: introdução, D1, D2 e conclusão. Tela grande: o painel do
// molde à esquerda rola sozinho e a caixa de texto à direita fica parada
// (sticky), com os autores em cima dela: tudo visível sem rolar a página
// (antes: 1.419 px de altura numa tela de 762, autores e exemplo fora da
// vista). Celular: o painel do molde recolhe acima da caixa.
// O painel alterna Molde e Exemplo (o parágrafo do tema de 2020).

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  causaPorChave, CONECTIVOS, ELEMENTOS, ERROS_PROPOSTA, introducaoComTese, moldeDaFrase, PONTE, PONTE_AVISO,
  type ChaveCausa, type ChaveElemento, type Paragrafo,
} from '@/lib/redacao/receita';
import { EXEMPLO_ANO, EXEMPLO_PARAGRAFOS } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso, CaixaTexto, ContadorLinhas, PerguntasGuia } from './pecas';
import { AutoresEmLinha } from './autores';
import { AvisoMotivo } from './passo-causas';

interface Props {
  paragrafo: Paragrafo;
  tema: string;
  texto: string;
  aoMudar: (t: string) => void;
  causaA: ChaveCausa | null;
  causaB: ChaveCausa | null;
  tese: string;
  elementos: Record<ChaveElemento, boolean>;
  aoMarcarElemento: (e: ChaveElemento, v: boolean) => void;
  aoTrocarMotivos: () => void;
  perguntas: string[];
}

/* Uma frase por linha da lista: o nome da função em cima, o molde em texto
   de leitura. A tese (3ª frase da introdução) é a do passo 3 e entra sozinha. */
function ListaDeFrases({ paragrafo, frases, tese }: { paragrafo: Paragrafo; frases: string[]; tese?: string }) {
  return (
    <ol className="space-y-4">
      {frases.map((frase, i) => {
        const ehTese = tese !== undefined && paragrafo.chave === 'introducao' && i === 2;
        return (
          <li key={paragrafo.frases[i]?.funcao ?? i} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
            <span data-numeric className="type-rotulo text-primary-text pt-px">{i + 1}</span>
            <div className="min-w-0">
              <p className="type-rotulo text-muted-foreground">{paragrafo.frases[i]?.funcao}</p>
              <p className="font-reading type-body mt-0.5">{ehTese && tese ? tese : frase}</p>
              {ehTese && <p className="type-rotulo text-primary-text mt-1">Entra sozinha: é a sua tese do passo 3.</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* A ponte em 3 passos, no molde ou com os trechos do exemplo. */
function Ponte({ itens, titulo }: { itens: { passo: string; texto: string }[]; titulo: string }) {
  return (
    <div className="mt-5 pt-4 border-t border-border">
      <p className="type-rotulo text-muted-foreground mb-1.5">{titulo}</p>
      <ol className="space-y-1">
        {itens.map((p, i) => (
          <li key={p.passo} className="type-meta"><span data-numeric className="font-semibold">{i + 1}. {p.passo}:</span> {p.texto}</li>
        ))}
      </ol>
    </div>
  );
}

function Painel(props: Props) {
  const { paragrafo, causaA, causaB, tema, tese, perguntas } = props;
  const [aba, setAba] = useState<'molde' | 'exemplo'>('molde');
  /* Celular: começa recolhido, para a caixa de texto aparecer sem rolar. */
  const [aberto, setAberto] = useState(false);
  const exemplo = EXEMPLO_PARAGRAFOS[paragrafo.chave];
  const moldes = paragrafo.frases.map((_, i) => moldeDaFrase(paragrafo.chave, i, tema, causaA, causaB));
  const temPonte = paragrafo.chave !== 'conclusao';
  const abas: { chave: typeof aba; nome: string }[] = [{ chave: 'molde', nome: 'Molde' }, { chave: 'exemplo', nome: 'Ver exemplo' }];

  return (
    <section
      data-medir="molde"
      className="surface-1 rounded-[var(--radius-surface)] border border-border lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100dvh-var(--altura-fixa-passo))] lg:overflow-y-auto"
      aria-label={`Molde da ${paragrafo.titulo.toLowerCase()}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 md:px-5 py-2 lg:sticky lg:top-0 lg:z-[1] surface-1">
        <div className="flex gap-1" role="tablist" aria-label="O que ver">
          {abas.map((a) => (
            <button
              key={a.chave}
              type="button"
              role="tab"
              aria-selected={aba === a.chave}
              data-medir={a.chave === 'exemplo' ? 'exemplo' : undefined}
              onClick={() => { setAba(a.chave); setAberto(true); }}
              className="rounded-[var(--radius-control)] px-3 py-2 type-meta font-medium t-colors hover:bg-muted aria-selected:bg-muted aria-selected:text-foreground text-muted-foreground"
            >
              {a.nome}
            </button>
          ))}
        </div>
        {!aberto && <span className="lg:hidden type-meta text-muted-foreground"><span data-numeric>{paragrafo.frases.length}</span> frases</span>}
        {/* No celular o painel recolhe; na tela grande fica sempre aberto. */}
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] t-colors hover:bg-muted"
          aria-label={aberto ? 'Recolher o molde' : 'Abrir o molde'}
        >
          <ChevronDown className="w-5 h-5 transition-transform duration-200 motion-reduce:transition-none" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
        </button>
      </div>

      <div className={`${aberto ? 'block' : 'hidden'} lg:block px-4 md:px-5 py-4`}>
        {aba === 'molde' ? (
          <>
            <div className="mb-5"><PerguntasGuia perguntas={perguntas} /></div>
            <ListaDeFrases paragrafo={paragrafo} frases={moldes} tese={tese} />
            {temPonte && <Ponte titulo="Ponte em 3 passos" itens={PONTE.map((p) => ({ passo: p.passo, texto: p.o_que }))} />}
            {temPonte && <p className="type-meta text-muted-foreground mt-2">{PONTE_AVISO}</p>}
            {paragrafo.chave === 'desenvolvimento1' && <p className="type-meta text-muted-foreground mt-4">Conectivos para variar: {CONECTIVOS.join(' / ')}.</p>}
            {paragrafo.chave === 'conclusao' && <p className="type-meta text-muted-foreground mt-4">Erros: {ERROS_PROPOSTA}</p>}
          </>
        ) : (
          <>
            <p className="type-rotulo text-primary-text mb-3">Exemplo de estrutura, não copie · <span data-numeric>ENEM {EXEMPLO_ANO}</span></p>
            <ListaDeFrases paragrafo={paragrafo} frases={exemplo.frases} />
            {exemplo.ponte && <Ponte titulo="A ponte neste exemplo" itens={exemplo.ponte.map((p) => ({ passo: p.passo, texto: p.trecho }))} />}
          </>
        )}
      </div>
    </section>
  );
}

/* Os 5 elementos da proposta em pílulas de marcar: cabem numa linha ao lado
   da caixa, em vez de 5 linhas inteiras. */
function Elementos({ elementos, aoMarcar }: { elementos: Props['elementos']; aoMarcar: Props['aoMarcarElemento'] }) {
  const feitos = ELEMENTOS.filter((e) => elementos[e.chave]).length;
  return (
    <div className="mt-4">
      <p data-numeric className="type-rotulo text-muted-foreground mb-2">Os 5 elementos: {feitos} de 5</p>
      <div className="flex flex-wrap gap-2">
        {ELEMENTOS.map((e) => (
          <button
            key={e.chave}
            type="button"
            role="checkbox"
            aria-checked={elementos[e.chave]}
            onClick={() => aoMarcar(e.chave, !elementos[e.chave])}
            title={e.pergunta}
            className="rounded-full border px-3 py-1.5 type-meta t-colors hover:bg-muted aria-checked:border-primary aria-checked:bg-[hsl(var(--primary)/0.12)] aria-checked:font-semibold border-border"
          >
            {e.nome} <span className="text-muted-foreground">· {e.pergunta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PassoParagrafo(props: Props) {
  const { paragrafo, texto, aoMudar, causaA, causaB, tema, tese } = props;
  const ehIntroducao = paragrafo.chave === 'introducao';
  /* Introdução: autores dos 2 motivos; D1 e D2: do motivo do parágrafo. */
  const causas = ehIntroducao ? [causaA, causaB] : paragrafo.chave === 'desenvolvimento1' ? [causaA] : paragrafo.chave === 'desenvolvimento2' ? [causaB] : [];
  const nomes = Array.from(new Set(causas.flatMap((c) => causaPorChave(c)?.repertorios ?? [])));
  const contado = ehIntroducao ? introducaoComTese(texto, tese) : texto;

  return (
    <div>
      <CabecalhoPasso titulo={paragrafo.titulo} instrucao={`Uma frase por função do molde. Meta: ${paragrafo.linhasMin} a ${paragrafo.linhasMax} linhas.`} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-8">
        <Painel {...props} />
        <div className="lg:sticky lg:top-[4.25rem] lg:flex lg:h-[calc(100dvh-var(--altura-fixa-passo))] lg:min-h-[22rem] lg:flex-col">
          {nomes.length > 0 && (
            <div data-medir="autores" className="mb-4">
              <AutoresEmLinha nomes={nomes} titulo={ehIntroducao ? 'Abra com um autor dos seus motivos' : 'Autores deste motivo'} />
            </div>
          )}
          <CaixaTexto
            id={`texto-${paragrafo.chave}`}
            rotulo={ehIntroducao ? 'Seu texto: frases 1 e 2 (a tese entra sozinha depois)' : 'Seu texto'}
            valor={texto}
            aoMudar={aoMudar}
            placeholder="Escreva aqui."
            alto
            encher
          />
          <div className="mt-2"><ContadorLinhas texto={contado} min={paragrafo.linhasMin} max={paragrafo.linhasMax} /></div>
          <AvisoMotivo tema={tema} causaA={causaA} causaB={causaB} aoTrocar={props.aoTrocarMotivos} />
          {paragrafo.chave === 'conclusao' && <Elementos elementos={props.elementos} aoMarcar={props.aoMarcarElemento} />}
        </div>
      </div>
    </div>
  );
}
