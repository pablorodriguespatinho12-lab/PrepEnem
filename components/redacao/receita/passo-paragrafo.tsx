'use client';
// Passos 4 a 7: introdução, D1, D2 e conclusão. Molde à esquerda (em cima no
// celular), caixa de texto à direita. [problema] já vem trocado pelo tema.
// A introdução mostra os autores das 2 causas; D1/D2, os da sua causa e a
// ponte em 3 passos; a conclusão, os 5 elementos que o aluno marca. Cada passo
// tem "Ver exemplo" com o parágrafo do tema de 2020.

import {
  causaPorChave, CONECTIVOS, ELEMENTOS, ERROS_PROPOSTA, moldeTese, PONTE, PONTE_AVISO, preencherProblema,
  type ChaveCausa, type ChaveElemento, type Paragrafo,
} from '@/lib/redacao/receita';
import { EXEMPLO_PARAGRAFOS } from '@/lib/redacao/exemplo-receita';
import { CabecalhoPasso, CaixaTexto, ContadorLinhas, Marcavel } from './pecas';
import { ListaAutores, VerExemplo } from './autores';

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
}

/* Troca [causa A]/[causa B] do molde pelo nome da causa escolhida e
   [problema] pelo problema do tema. */
function preencher(molde: string, causaA: ChaveCausa | null, causaB: ChaveCausa | null, tema: string): string {
  const a = causaPorChave(causaA)?.nome.toLowerCase();
  const b = causaPorChave(causaB)?.nome.toLowerCase();
  const comCausas = molde.split('[causa A]').join(a ? `[${a}]` : '[causa A]').split('[causa B]').join(b ? `[${b}]` : '[causa B]');
  return preencherProblema(comCausas, tema);
}

function Molde({ paragrafo, causaA, causaB, tese, tema }: Pick<Props, 'paragrafo' | 'causaA' | 'causaB' | 'tese' | 'tema'>) {
  return (
    <ol className="space-y-3">
      {paragrafo.frases.map((f, i) => {
        const naTese = paragrafo.chave === 'introducao' && i === paragrafo.frases.length - 1;
        const ehTese = naTese && tese.trim();
        return (
          <li key={f.funcao} className="flex gap-3">
            <span data-numeric className="type-meta font-semibold text-primary-text w-5 flex-shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <p className="type-caption font-semibold text-muted-foreground">{f.funcao}</p>
              <p className="font-reading type-meta">{ehTese ? tese : naTese ? moldeTese(causaA, causaB, tema) : preencher(f.molde, causaA, causaB, tema)}</p>
              {ehTese && <p className="type-caption text-muted-foreground">Sua tese do passo 3.</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Repertorios({ causa }: { causa: ChaveCausa | null }) {
  const c = causaPorChave(causa);
  return (
    <div className="mt-5 pt-4 border-t border-border">
      {c
        ? <ListaAutores nomes={c.repertorios} titulo={`Autores de ${c.nome.toLowerCase()}`} />
        : <p className="type-meta">Volte ao passo 2 e escolha a causa.</p>}
      <p className="type-caption font-semibold text-muted-foreground mt-4 mb-1">Ponte em 3 passos</p>
      <ol className="space-y-1">
        {PONTE.map((p, i) => (
          <li key={p.passo} className="type-meta"><span data-numeric className="font-semibold">{i + 1}. {p.passo}:</span> {p.o_que}</li>
        ))}
      </ol>
      <p className="type-meta text-muted-foreground mt-2">{PONTE_AVISO}</p>
    </div>
  );
}

function Elementos({ elementos, aoMarcar }: { elementos: Props['elementos']; aoMarcar: Props['aoMarcarElemento'] }) {
  const feitos = ELEMENTOS.filter((e) => elementos[e.chave]).length;
  return (
    <div className="mt-5">
      <p data-numeric className="type-meta font-semibold mb-2">Os 5 elementos: {feitos} de 5</p>
      <div className="space-y-2">
        {ELEMENTOS.map((e) => (
          <Marcavel key={e.chave} marcado={elementos[e.chave]} aoMudar={(v) => aoMarcar(e.chave, v)}>
            <strong>{e.nome}</strong> <span className="text-muted-foreground">· {e.pergunta}</span>
          </Marcavel>
        ))}
      </div>
      <p className="type-meta text-muted-foreground mt-3">Erros: {ERROS_PROPOSTA}</p>
    </div>
  );
}

/* Autores das 2 causas, para abrir a introdução com um deles. */
function AutoresDasCausas({ causaA, causaB }: Pick<Props, 'causaA' | 'causaB'>) {
  const causas = [causaPorChave(causaA), causaPorChave(causaB)].filter((c) => c !== null);
  if (causas.length === 0) return null;
  return (
    <div className="mt-5 pt-4 border-t border-border space-y-4">
      <p className="type-meta text-muted-foreground">Abra com um autor dos seus motivos:</p>
      {causas.map((c) => <ListaAutores key={c.chave} nomes={c.repertorios} titulo={c.nome} />)}
    </div>
  );
}
/* O parágrafo do exemplo, frase por frase com a função do molde, e a ponte. */
function Exemplo({ paragrafo }: { paragrafo: Paragrafo }) {
  const ex = EXEMPLO_PARAGRAFOS[paragrafo.chave];
  return (
    <>
      <ol className="space-y-2">
        {ex.frases.map((frase, i) => (
          <li key={frase} className="flex gap-3">
            <span data-numeric className="type-meta font-semibold text-primary-text w-5 flex-shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <p className="type-caption font-semibold text-muted-foreground">{paragrafo.frases[i]?.funcao}</p>
              <p className="font-reading type-meta">{frase}</p>
            </div>
          </li>
        ))}
      </ol>
      {ex.ponte && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="type-caption font-semibold text-muted-foreground mb-1">A ponte neste exemplo</p>
          <ol className="space-y-1">
            {ex.ponte.map((p, i) => (
              <li key={p.passo} className="type-meta"><span data-numeric className="font-semibold">{i + 1}. {p.passo}:</span> {p.trecho}</li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
export function PassoParagrafo(props: Props) {
  const { paragrafo, texto, aoMudar, causaA, causaB, tema } = props;
  const causaDoParagrafo = paragrafo.chave === 'desenvolvimento1' ? causaA : paragrafo.chave === 'desenvolvimento2' ? causaB : null;
  return (
    <div>
      <CabecalhoPasso titulo={paragrafo.titulo} instrucao={`Siga o molde, uma frase por função. Meta: ${paragrafo.linhasMin} a ${paragrafo.linhasMax} linhas.`} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <section className="surface-1 rounded-[var(--radius-surface)] p-4 md:p-5" aria-label={`Molde da ${paragrafo.titulo.toLowerCase()}`}>
          <p className="type-caption font-semibold text-primary-text mb-3">Molde</p>
          <Molde paragrafo={paragrafo} causaA={causaA} causaB={causaB} tese={props.tese} tema={tema} />
          {paragrafo.chave === 'introducao' && <AutoresDasCausas causaA={causaA} causaB={causaB} />}
          {causaDoParagrafo !== null && <Repertorios causa={causaDoParagrafo} />}
          {paragrafo.chave === 'desenvolvimento1' && <p className="type-meta text-muted-foreground mt-4">Conectivos para variar: {CONECTIVOS.join(' / ')}.</p>}
        </section>
        <div>
          <CaixaTexto id={`texto-${paragrafo.chave}`} rotulo="Seu texto" valor={texto} aoMudar={aoMudar} placeholder="Escreva aqui." alto />
          <div className="mt-2"><ContadorLinhas texto={texto} min={paragrafo.linhasMin} max={paragrafo.linhasMax} /></div>
          {paragrafo.chave === 'conclusao' && <Elementos elementos={props.elementos} aoMarcar={props.aoMarcarElemento} />}
          <VerExemplo><Exemplo paragrafo={paragrafo} /></VerExemplo>
        </div>
      </div>
    </div>
  );
}
