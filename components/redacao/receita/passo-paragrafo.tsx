'use client';
// Passos 4 a 7: introdução, D1, D2 e conclusão. Tela grande: o painel do
// molde à esquerda rola sozinho e a caixa de texto à direita fica parada
// (sticky): tudo visível sem rolar a página (antes: 1.419 px de altura numa
// tela de 762). Celular: o painel recolhe acima da caixa.
// O painel alterna Molde, Ajuda (IA, a pedido) e Exemplo (tema de 2020).
// Menos coisa à vista (Pablo, 29/10/2026: "muita poluição visual"): o molde
// destaca só a frase de agora, as dicas da ponte e os autores recolhem.

import { useEffect, useState, type ReactNode } from 'react';
import { Check, ChevronDown, LifeBuoy } from 'lucide-react';
import {
  causaPorChave, coringasDosMotivos, CONECTIVOS,ELEMENTOS, ERROS_PROPOSTA, introducaoComTese, moldeDaFrase, PONTE, PONTE_AVISO,
  type ChaveCausa, type ChaveElemento, type Paragrafo,
} from '@/lib/redacao/receita';
import { EXEMPLO_ANO, EXEMPLO_PARAGRAFOS } from '@/lib/redacao/exemplo-receita';
import { juntarComeco, ondeEstou, type OndeEstou } from '@/lib/redacao/onde-estou';
import { CabecalhoPasso, CaixaTexto, ContadorLinhas } from './pecas';
import { AutoresEmLinha } from './autores';
import { ExemploComCoringa } from './exemplo-coringa';
import { criarMarcador, termosDe } from './glossario';
import { AvisoMotivo } from './passo-causas';
import { AjudaEscrita, ajudaVazia, pedirAjuda, type EstadoAjuda } from './ajuda-escrita';

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
  primeiraVisita: boolean;
  aoVerMolde: () => void;
}

type Aba = 'molde' | 'ajuda' | 'exemplo';
const CORINGAS_A_VISTA = 3;
const ABAS: { chave: Aba; nome: string }[] =[{ chave: 'molde', nome: 'Molde' }, { chave: 'ajuda', nome: 'Ajuda' }, { chave: 'exemplo', nome: 'Exemplo' }];

/* Uma frase por linha da lista: o nome da função em cima, o molde em texto
   de leitura. A tese (3ª frase da introdução) é a do passo 3 e entra sozinha.
   Com `onde`, a frase de agora fica em destaque, as feitas ganham o visto e
   as que faltam ficam apagadas: o olho vai direto para o que fazer. */
function ListaDeFrases({ paragrafo, frases, tese, rotulos, onde }: { paragrafo: Paragrafo; frases: string[]; tese?: string; rotulos: ReactNode[]; onde?: OndeEstou }) {
  return (
    <ol className="space-y-3">
      {frases.map((frase, i) => {
        const ehTese = tese !== undefined && paragrafo.chave === 'introducao' && i === 2;
        const feita = onde ? i < onde.atual || (ehTese && onde.atual >= onde.total) : false;
        const agora = onde ? i === onde.atual : false;
        const depois = onde ? i > onde.atual && !ehTese : false;
        return (
          <li
            key={paragrafo.frases[i]?.funcao ?? i}
            aria-current={agora ? 'step' : undefined}
            className={`grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 rounded-[var(--radius-control)] t-colors ${agora ? 'bg-[hsl(var(--primary)/0.08)] -mx-2 px-2 py-2' : ''} ${depois ? 'opacity-70' : ''}`}
          >
            <span data-numeric className="type-rotulo text-primary-text pt-px">
              {feita ? <Check className="h-3.5 w-3.5 mt-0.5" strokeWidth={3} aria-label={`Frase ${i + 1} feita`} /> : i + 1}
            </span>
            <div className="min-w-0">
              <p className="type-rotulo text-muted-foreground">{rotulos[i]}{agora && <span className="text-primary-text"> · agora</span>}</p>
              <p className={`font-reading type-body mt-0.5 ${feita ? 'text-muted-foreground' : ''}`}>{ehTese && tese ? tese : frase}</p>
              {ehTese && <p className="type-rotulo text-primary-text mt-1">Entra sozinha: é a sua tese do passo 3.</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* O molde como um parágrafo só, em letra grande, para comparar lado a lado
   com o texto dele, como uma Bíblia com duas línguas (Pablo, 31/10/2026: "não
   deixar 1, 2, 3 separado"). A frase de agora fica marcada e só o nome dela
   aparece em cima; as feitas apagam. A tese entra com traço: vem do passo 3. */
function MoldeCorrido({ paragrafo, frases, tese, rotulos, onde }: { paragrafo: Paragrafo; frases: string[]; tese: string; rotulos: ReactNode[]; onde: OndeEstou }) {
  const temTese = paragrafo.chave === 'introducao';
  const agora = onde.atual < frases.length && !(temTese && onde.atual === 2) ? onde.atual : null;
  return (
    <div>
      {agora !== null && (
        <p className="type-rotulo text-muted-foreground mb-2">
          <span data-numeric className="text-primary-text font-semibold">Agora, frase {agora + 1}:</span> {rotulos[agora]}
        </p>
      )}
      <p className="font-reading text-[1.1875rem] leading-[var(--lh-reading)]">
        {frases.map((frase, i) => {
          const ehTese = temTese && i === 2;
          const feita = i < onde.atual || (ehTese && onde.atual >= onde.total);
          const estilo = i === agora
            ? 'rounded-[3px] bg-[hsl(var(--primary)/0.16)] [box-decoration-break:clone] px-1 -mx-1'
            : ehTese ? 'underline decoration-dotted decoration-[hsl(var(--primary))] underline-offset-[6px]'
            : feita ? 'text-muted-foreground' : '';
          return (
            <span key={paragrafo.frases[i]?.funcao ?? i} aria-current={i === agora ? 'step' : undefined}>
              <span className={estilo}>{ehTese && tese ? tese : frase}</span>{' '}
            </span>
          );
        })}
      </p>
      {temTese && <p className="type-rotulo text-primary-text mt-2">A frase sublinhada é a sua tese do passo 3: ela entra sozinha.</p>}
    </div>
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

/* Ponte, conectivos e erros da proposta: úteis, mas não a cada frase. */
function MaisDicas({ paragrafo }: { paragrafo: Paragrafo }) {
  const [aberto, setAberto] = useState(false);
  const temPonte = paragrafo.chave !== 'conclusao';
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        className="inline-flex items-center gap-1.5 type-meta font-medium text-muted-foreground hover:text-foreground t-colors"
      >
        {aberto ? 'Fechar dicas' : 'Mais dicas'}
        <ChevronDown className="w-4 h-4 transition-transform duration-200 motion-reduce:transition-none" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
      </button>
      {aberto && (
        <>
          {temPonte && <Ponte titulo="Ponte em 3 passos" itens={PONTE.map((p) => ({ passo: p.passo, texto: p.o_que }))} />}
          {temPonte && <p className="type-meta text-muted-foreground mt-2">{PONTE_AVISO}</p>}
          {paragrafo.chave === 'desenvolvimento1' && <p className="type-meta text-muted-foreground mt-4">Conectivos para variar: {CONECTIVOS.join(' / ')}.</p>}
          {paragrafo.chave === 'conclusao' && <p className="type-meta text-muted-foreground mt-4">Erros: {ERROS_PROPOSTA}</p>}
        </>
      )}
    </div>
  );
}

interface PainelProps extends Props {
  jaMarcados: string[];
  coringas: string[];
  coringaExemplo: string | null;
  aoEscolherCoringa: (nome: string) => void;
  onde: OndeEstou;
  aba: Aba;
  aoTrocarAba: (a: Aba) => void;
  aberto: boolean;
  aoAbrir: (v: boolean) => void;
  ajuda: ReactNode;
}

function Painel({ jaMarcados, onde, aba, aoTrocarAba, aberto, aoAbrir, ajuda, coringas, coringaExemplo, aoEscolherCoringa, ...props }: PainelProps) {
  /* O marcador é usado no mesmo render que o criou: o modo estrito renderiza
     2 vezes, e um filho que usasse o marcador do pai acharia tudo já usado. */
  const { paragrafo, causaA, causaB, tema, tese, primeiraVisita, aoVerMolde } = props;
  const m = criarMarcador(jaMarcados);
  const rotulos = paragrafo.frases.map((f) => m(f.funcao));
  useEffect(() => {
    if (primeiraVisita) aoVerMolde();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na entrada do passo
  }, []);
  const exemplo = EXEMPLO_PARAGRAFOS[paragrafo.chave];
  const moldes = paragrafo.frases.map((_, i) => moldeDaFrase(paragrafo.chave, i, tema, causaA, causaB));

  return (
    <section
      id="painel-molde"
      data-medir="molde"
      className="surface-1 rounded-[var(--radius-surface)] border border-border lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none lg:sticky lg:top-[4.25rem] lg:max-h-[calc(100dvh-var(--altura-fixa-passo))] lg:overflow-y-auto"
      aria-label={`Molde da ${paragrafo.titulo.toLowerCase()}`}
    >
      {/* Na tela grande, as duas colunas abrem com um título do mesmo tamanho:
          "Como escrever" aqui, "Sua vez" do outro lado da linha do meio. */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 md:px-5 lg:px-0 py-2 lg:pt-0 lg:sticky lg:top-0 lg:z-[1] surface-1 lg:border-x-0 lg:border-t-0 lg:shadow-none lg:bg-background">
        <h3 className="hidden lg:block font-display type-lead font-semibold">Como escrever</h3>
        <div className="flex gap-1" role="tablist" aria-label="O que ver">
          {ABAS.map((a) => (
            <button
              key={a.chave}
              type="button"
              role="tab"
              aria-selected={aba === a.chave}
              data-medir={a.chave === 'exemplo' ? 'exemplo' : undefined}
              onClick={() => { aoTrocarAba(a.chave); aoAbrir(true); }}
              className="rounded-[var(--radius-control)] px-3 py-2 type-meta font-medium t-colors hover:bg-muted aria-selected:bg-muted aria-selected:text-foreground text-muted-foreground"
            >
              {a.nome}
            </button>
          ))}
        </div>
        {!aberto && <span className="hidden sm:inline lg:hidden type-meta text-muted-foreground whitespace-nowrap">Frase <span data-numeric>{Math.min(onde.atual + 1, onde.total)}</span> de <span data-numeric>{onde.total}</span></span>}
        {/* No celular o painel recolhe; na tela grande fica sempre aberto. */}
        <button
          type="button"
          onClick={() => aoAbrir(!aberto)}
          aria-expanded={aberto}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] t-colors hover:bg-muted"
          aria-label={aberto ? 'Recolher o molde' : 'Abrir o molde'}
        >
          <ChevronDown className="w-5 h-5 transition-transform duration-200 motion-reduce:transition-none" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
        </button>
      </div>

      <div className={`${aberto ? 'block' : 'hidden'} lg:block px-4 md:px-5 lg:px-0 py-4 lg:pt-3 lg:pb-0`}>
        {aba === 'molde' && (
          <>
            <MoldeCorrido paragrafo={paragrafo} frases={moldes} tese={tese} rotulos={rotulos} onde={onde} />
            <MaisDicas paragrafo={paragrafo} />
          </>
        )}
        {aba === 'ajuda' && ajuda}
        {aba === 'exemplo' && (
          <>
            {/* Introdução: primeiro o texto com coringa em outro tema (ele É a
                introdução). D1 e D2: primeiro o parágrafo deste passo; o coringa
                vem depois, para a frase do autor (teste do iniciante, 31/10/2026:
                o mesmo texto no topo dos passos 4, 5 e 6 parecia passo errado). */}
            {paragrafo.chave === 'introducao' && (
              <div className="mb-5 border-b border-border pb-5">
                <ExemploComCoringa coringas={coringas} tema={tema} escolhido={coringaExemplo} aoEscolher={aoEscolherCoringa} />
              </div>
            )}
            <p className="type-rotulo text-primary-text mb-3">Este parágrafo numa redação de exemplo, não copie · <span data-numeric>ENEM {EXEMPLO_ANO}</span></p>
            <ListaDeFrases paragrafo={paragrafo} frases={exemplo.frases} rotulos={rotulos} />
            {exemplo.ponte && <Ponte titulo="A ponte neste exemplo" itens={exemplo.ponte.map((p) => ({ passo: p.passo, texto: p.trecho }))} />}
            {(paragrafo.chave === 'desenvolvimento1' || paragrafo.chave === 'desenvolvimento2') && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="type-meta font-semibold mb-3">Para a frase 2 (a do autor), faça como neste exemplo:</p>
                <ExemploComCoringa coringas={coringas} tema={tema} escolhido={coringaExemplo} aoEscolher={aoEscolherCoringa} />
              </div>
            )}
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
            className="rounded-full border px-3 py-1.5 type-meta t-colors hover:bg-muted aria-checked:border-primary aria-checked:bg-[hsl(var(--primary)/0.12)] aria-checked:font-semibold border-border"
          >
            {/* A pergunta à vista: "agente, meio, finalidade" travou o iniciante (31/10/2026). */}
            {e.nome} <span className="text-muted-foreground">· {e.pergunta.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Autores recolhidos numa linha; abrem sozinhos quando a frase de agora é a
   do repertório, que é quando ele precisa deles. Tocar decide de vez. */
function Autores({ nomes, coringas, causas, titulo, fraseDeRepertorio, aoVerExemplo }: {
  nomes: string[]; coringas: string[]; causas: (ChaveCausa | null)[]; titulo: string; fraseDeRepertorio: boolean; aoVerExemplo: (nome: string) => void;
}) {
  const [escolha, setEscolha] = useState<boolean | null>(null);
  const aberto = escolha ?? fraseDeRepertorio;
  return (
    /* Trava: a caixa de texto nunca vai para baixo da barra, mesmo com
       "Outros autores" aberto. Em tela baixa quem encolhe (e rola por dentro)
       é a lista, não a caixa — senão ela passa por cima do contador (30/10/2026). */
    <div data-medir="autores" className="mb-4 lg:max-h-[60%] lg:min-h-[4.5rem] lg:shrink lg:overflow-y-auto">
      <button
        type="button"
        onClick={() => setEscolha(!aberto)}
        aria-expanded={aberto}
        className="inline-flex items-center gap-1.5 type-rotulo text-muted-foreground hover:text-foreground t-colors"
      >
        {titulo} · <span data-numeric>{nomes.length + coringas.length}</span>
        <ChevronDown className="w-4 h-4 transition-transform duration-200 motion-reduce:transition-none" style={{ transform: aberto ? 'rotate(180deg)' : undefined }} aria-hidden />
      </button>
      {aberto && <div className="mt-2"><AutoresEmLinha nomes={nomes} coringas={coringas} causas={causas} titulo="" aoVerExemplo={aoVerExemplo} /></div>}
    </div>
  );
}

export function PassoParagrafo(props: Props) {
  const { paragrafo, texto, aoMudar, causaA, causaB, tema, tese, primeiraVisita } = props;
  const ehIntroducao = paragrafo.chave === 'introducao';
  /* Introdução: autores dos 2 motivos; D1 e D2: do motivo do parágrafo. */
  const causas = ehIntroducao ? [causaA, causaB] : paragrafo.chave === 'desenvolvimento1' ? [causaA] : paragrafo.chave === 'desenvolvimento2' ? [causaB] : [];
  const nomes = Array.from(new Set(causas.flatMap((c) => causaPorChave(c)?.repertorios ?? [])));
  /* Só 3 coringas à vista (sem rolagem); na introdução, alternando os 2 motivos. */
  const coringas = coringasDosMotivos(causas, CORINGAS_A_VISTA);
  const contado = ehIntroducao ? introducaoComTese(texto, tese) : texto;
  const onde = ondeEstou(texto, paragrafo.chave, paragrafo.frases.length);
  /* A frase do autor: "Repertório: ..." na introdução, "Um autor, ..." no D1 e no D2. */
  const fraseDeRepertorio = /^(repert[óo]rio|um autor)/i.test(paragrafo.frases[onde.atual]?.funcao ?? '');

  const [aba, setAba] = useState<Aba>('molde');
  /* Abaixo de 1024 px: aberto na 1ª visita do passo, para o aluno ver o
     molde (Pablo, 29/10/2026); nas outras, recolhido, para a caixa de texto
     aparecer sem rolar. */
  const [aberto, setAberto] = useState(primeiraVisita);
  const [ajuda, setAjuda] = useState<EstadoAjuda>(ajudaVazia);
  const [coringaExemplo, setCoringaExemplo] = useState<string | null>(null);

  const pedir = async (pergunta: string) => {
    setAjuda((a) => ({ ...a, carregando: true, erro: null }));
    try {
      const resposta = await pedirAjuda({ tema, paragrafo, texto, tese, causaA, causaB }, pergunta);
      setAjuda((a) => ({ ...a, carregando: false, resposta, pergunta: pergunta ? '' : a.pergunta }));
    } catch (e) {
      setAjuda((a) => ({ ...a, carregando: false, erro: (e as Error).message }));
    }
  };
  const abrirAjuda = () => {
    setAba('ajuda');
    setAberto(true);
    if (!ajuda.resposta && !ajuda.carregando) pedir('');
    if (window.matchMedia('(max-width: 1023px)').matches) document.getElementById('painel-molde')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  /* "Ver exemplo pronto" na ficha do coringa: abre a aba Exemplo nele. */
  const verExemplo = (nome: string) => {
    setCoringaExemplo(nome);
    setAba('exemplo');
    setAberto(true);
    if (window.matchMedia('(max-width: 1023px)').matches) document.getElementById('painel-molde')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  const usarComeco = (comeco: string) => {
    aoMudar(juntarComeco(texto, comeco));
    const caixa = document.getElementById(`texto-${paragrafo.chave}`) as HTMLTextAreaElement | null;
    requestAnimationFrame(() => {
      caixa?.focus();
      caixa?.setSelectionRange(caixa.value.length, caixa.value.length);
    });
  };

  /* Glossário: a instrução vem antes dos rótulos do molde na leitura. */
  const m = criarMarcador();
  const instrucao = paragrafo.chave === 'conclusao'
    /* Uma linha só: em 2 linhas a tela rolava 9 px (01/11/2026). Os 5
       elementos (quem faz, o que faz...) já estão nos botões ao lado. */
    ? `Feche com a proposta de intervenção: uma para cada motivo, com os 5 elementos. Siga o molde. Meta: ${paragrafo.linhasMin} a ${paragrafo.linhasMax} linhas.`
    : `Uma frase por função do molde. Meta: ${paragrafo.linhasMin} a ${paragrafo.linhasMax} linhas.`;

  return (
    <div>
      <CabecalhoPasso titulo={paragrafo.titulo} instrucao={m(instrucao)} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-8">
        <Painel
          {...props}
          jaMarcados={termosDe(instrucao)}
          coringas={coringas}
          coringaExemplo={coringaExemplo}
          aoEscolherCoringa={setCoringaExemplo}
          onde={onde}
          aba={aba}
          aoTrocarAba={setAba}
          aberto={aberto}
          aoAbrir={setAberto}
          ajuda={(
            <AjudaEscrita
              paragrafo={paragrafo}
              onde={onde}
              perguntas={props.perguntas}
              estado={ajuda}
              aoPedir={pedir}
              aoMudarPergunta={(pergunta) => setAjuda((a) => ({ ...a, pergunta }))}
              aoUsarComeco={usarComeco}
            />
          )}
        />
        <div className="lg:sticky lg:top-[4.25rem] lg:flex lg:h-[calc(100dvh-var(--altura-fixa-passo))] lg:min-h-[22rem] lg:flex-col lg:border-l lg:border-border lg:pl-8">
          {nomes.length > 0 && (
            <Autores nomes={nomes} coringas={coringas} causas={causas} titulo={ehIntroducao ? 'Autores dos seus motivos' : 'Autores deste motivo'} fraseDeRepertorio={fraseDeRepertorio} aoVerExemplo={verExemplo} />
          )}
          {/* "Sua vez" grande, colado na caixa: o aluno não via onde o molde
              acabava e a parte dele começava (Pablo, 31/10/2026). No topo da
              coluna, roubava o espaço da ficha do autor. */}
          <CaixaTexto
            id={`texto-${paragrafo.chave}`}
            rotulo={(
              <>
                <span className="font-display type-lead font-semibold leading-none">Sua vez</span>
                <span className="font-normal text-muted-foreground"> · {ehIntroducao ? 'frases 1 e 2, imitando o modelo ao lado' : 'imite o modelo ao lado, uma frase de cada vez'}</span>
              </>
            )}
            valor={texto}
            aoMudar={aoMudar}
            placeholder="Escreva aqui."
            alto
            encher
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <ContadorLinhas texto={contado} min={paragrafo.linhasMin} max={paragrafo.linhasMax} />
            <button
              type="button"
              onClick={abrirAjuda}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3.5 py-1.5 type-meta font-medium text-primary-text t-colors hover:bg-[hsl(var(--primary)/0.1)]"
            >
              <LifeBuoy className="w-4 h-4" aria-hidden /> Me ajuda
            </button>
          </div>
          <AvisoMotivo tema={tema} causaA={causaA} causaB={causaB} aoTrocar={props.aoTrocarMotivos} />
          {paragrafo.chave === 'conclusao' && <Elementos elementos={props.elementos} aoMarcar={props.aoMarcarElemento} />}
        </div>
      </div>
    </div>
  );
}
