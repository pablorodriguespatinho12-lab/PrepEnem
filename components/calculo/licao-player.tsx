'use client';
// Uma lição, uma etapa por vez: gancho → construção → resumo → exemplos →
// exercícios → resultado. Nada aparece antes da hora: o aluno tenta o gancho
// antes da explicação e responde a lacuna antes de ver o passo.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, Lightbulb, RefreshCcw } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { RespostaInput } from './resposta-input';
import type { ExemploResolvido, Exercicio, LicaoCompleta } from '@/lib/calculo/tipos';
import type { Visual } from '@/lib/visual/especificacao';

type Etapa = 'gancho' | 'construcao' | 'resumo' | 'exemplos' | 'exercicios' | 'resultado';
const ETAPAS: { id: Etapa; nome: string }[] = [
  { id: 'gancho', nome: 'Pense' }, { id: 'construcao', nome: 'Entenda' }, { id: 'resumo', nome: 'Resumo' },
  { id: 'exemplos', nome: 'Exemplos' }, { id: 'exercicios', nome: 'Sua vez' }, { id: 'resultado', nome: 'Fim' },
];

const botao = 'inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-1 t-colors hover:bg-[hsl(var(--primary-hover))]';

function Avancar({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={botao}>{children} <ArrowRight className="w-4 h-4" /></button>;
}

function Exemplo({ exemplo, numero, onFim }: { exemplo: ExemploResolvido; numero: number; onFim: () => void }) {
  const [visiveis, setVisiveis] = useState(1);
  const [respondidas, setRespondidas] = useState<Set<number>>(new Set());
  const passoAtual = exemplo.passos[visiveis - 1];
  const travado = passoAtual?.lacuna && !respondidas.has(visiveis - 1);
  const terminou = visiveis >= exemplo.passos.length && !travado;
  const legenda = numero === 1 ? 'Resolvido inteiro: só acompanhe.' : numero === 2 ? 'O último passo é seu.' : 'Os dois últimos passos são seus.';

  return (
    <div className="space-y-4">
      <p className="type-caption text-muted-foreground" data-numeric>Exemplo {numero} de 3 · {legenda}</p>
      <MathText text={exemplo.enunciado} className="font-reading font-medium" />
      {exemplo.visual && <VisualDesenho visual={exemplo.visual} />}
      <ol className="space-y-3">
        {exemplo.passos.slice(0, visiveis).map((p, i) => {
          const esconder = p.lacuna && !respondidas.has(i);
          return (
            <li key={i} className="rounded-[var(--radius-control)] border border-border p-3 space-y-2">
              {p.lacuna && (
                <div className="space-y-2">
                  <MathText text={p.lacuna.pergunta} className="font-reading" />
                  <RespostaInput resposta={p.lacuna.resposta} respondido={respondidas.has(i)}
                    onResponder={() => setRespondidas((s) => new Set(s).add(i))} />
                </div>
              )}
              {!esconder && (
                <>
                  <MathText text={p.texto} className="font-reading" />
                  <p className="type-meta text-muted-foreground"><MathText text={`Por quê: ${p.porque}`} /></p>
                </>
              )}
            </li>
          );
        })}
      </ol>
      {!travado && (terminou
        ? <Avancar onClick={onFim}>{numero < 3 ? 'Próximo exemplo' : 'Agora é sua vez'}</Avancar>
        : <Avancar onClick={() => setVisiveis((n) => n + 1)}>Próximo passo</Avancar>)}
    </div>
  );
}

function ExercicioView({ exercicio, numero, total, onFim }: { exercicio: Exercicio; numero: number; total: number; onFim: (acertou: boolean) => void }) {
  const [resultado, setResultado] = useState<boolean | null>(null);
  const [dica, setDica] = useState(false);
  return (
    <div className="space-y-4">
      <p className="type-caption text-muted-foreground flex flex-wrap items-center gap-2" data-numeric>
        Exercício {numero} de {total}
        {exercicio.nivelAcima && (
          <span className="rounded-[var(--radius-data)] bg-primary/10 px-2 py-0.5 font-semibold text-primary-text">
            Nível acima · estilo {exercicio.nivelAcima.estilo}
          </span>
        )}
      </p>
      <MathText text={exercicio.enunciado} className="font-reading font-medium" />
      {exercicio.visual && <VisualDesenho visual={exercicio.visual} />}
      {resultado === null && !dica && (
        <button onClick={() => setDica(true)} className="inline-flex items-center gap-1.5 type-meta text-primary-text font-medium hover:underline underline-offset-4">
          <Lightbulb className="w-4 h-4" /> Quero uma dica
        </button>
      )}
      {dica && resultado === null && <p className="type-meta rounded-[var(--radius-control)] bg-muted/60 px-3 py-2"><MathText text={exercicio.dica} /></p>}
      <RespostaInput resposta={exercicio.resposta} respondido={resultado !== null} onResponder={setResultado} />
      {resultado !== null && (
        <div className="space-y-3">
          <div className="rounded-[var(--radius-control)] border border-border p-3 space-y-2">
            <p className="type-caption text-muted-foreground">Resolução</p>
            {exercicio.resolucao.map((r, i) => (
              <div key={i}>
                <MathText text={r.texto} className="font-reading" />
                <p className="type-meta text-muted-foreground"><MathText text={`Por quê: ${r.porque}`} /></p>
              </div>
            ))}
          </div>
          <Avancar onClick={() => onFim(resultado)}>{numero < total ? 'Próximo exercício' : 'Ver resultado'}</Avancar>
        </div>
      )}
    </div>
  );
}

/* O que está na tela, em texto, para o painel de dúvidas (a IA vê o mesmo que
   o aluno). Em exercício, avisa a IA para não entregar a resposta. */
function descreverDesenho(v: Visual | null | undefined): string {
  if (!v) return '';
  if (v.tipo === 'cena') {
    const quem = v.veiculos.map((w) => `${w.rotulo ?? w.veiculo} anda por ${w.nome}(x) = ${w.expr}`).join('; ');
    return `Desenho animado: ${quem}; x é o tempo (${v.unidadeX ?? 'min'}), f(x) é a posição (${v.unidadeY ?? 'km'}).`;
  }
  return `Desenho: ${v.tipo}${v.titulo ? ` (${v.titulo})` : ''}.`;
}

export function LicaoPlayer({ licao, onTela }: { licao: LicaoCompleta; onTela?: (texto: string) => void }) {
  const [etapa, setEtapa] = useState<Etapa>('gancho');
  const [ideiaAberta, setIdeiaAberta] = useState(false);
  const [passos, setPassos] = useState(1);
  // Troca de passo ou de etapa: volta para o topo do cartão, em vez de o
  // conteúdo novo aparecer lá embaixo (Pablo, 06/10/2026).
  const topo = useRef<HTMLElement>(null);
  const primeiraVez = useRef(true);
  const [exemplo, setExemplo] = useState(0);
  // Fila de exercícios: todos na primeira vez; depois, só os que errou.
  const [ordem, setOrdem] = useState<number[]>(() => licao.conteudo.exercicios.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [erradas, setErradas] = useState<number[]>([]);
  const exercicio = ordem[pos] ?? 0;
  useEffect(() => {
    if (!onTela) return;
    const c0 = licao.conteudo;
    const p = c0.construcao[passos - 1];
    let texto = 'Fim da lição.';
    if (etapa === 'gancho') texto = `Pergunta de abertura: ${c0.gancho.pergunta}${ideiaAberta ? `\nResposta mostrada: ${c0.gancho.ideia}` : ''}`;
    else if (etapa === 'construcao' && p) texto = `Passo "${p.titulo}": ${p.texto}\n${descreverDesenho(p.visual)}`;
    else if (etapa === 'resumo') texto = `Resumo: ${c0.resumo}`;
    else if (etapa === 'exemplos') texto = `Exemplo resolvido: ${c0.exemplos[exemplo]?.enunciado ?? ''}`;
    else if (etapa === 'exercicios') texto = `EXERCÍCIO que ele está resolvendo (dê pistas, não a resposta): ${c0.exercicios[exercicio]?.enunciado ?? ''}`;
    onTela(texto);
  }, [onTela, licao, etapa, passos, exemplo, exercicio, ideiaAberta]);

  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return; }
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    topo.current?.scrollIntoView({ block: 'start', behavior: reduzir ? 'auto' : 'smooth' });
  }, [passos, etapa, exemplo, exercicio]);
  const [acertos, setAcertos] = useState(0);
  const [salvo, setSalvo] = useState<{ concluiu: boolean } | null>(null);
  const [recuperacaoAberta, setRecuperacaoAberta] = useState(false);
  const c = licao.conteudo;

  const finalizar = async (totalAcertos: number) => {
    setEtapa('resultado');
    try {
      const res = await fetch('/api/calculo/progresso', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'licao', licaoId: licao.id, acertos: totalAcertos, total: c.exercicios.length }),
      });
      const data = await res.json().catch(() => ({}));
      setSalvo({ concluiu: Boolean(data?.concluiu) });
    } catch {
      setSalvo({ concluiu: false });
    }
  };

  const reiniciarExercicios = () => {
    setOrdem(c.exercicios.map((_, i) => i)); setPos(0); setErradas([]); setAcertos(0); setSalvo(null); setEtapa('exercicios');
  };
  /* Não passou: refaz só as que errou, e os acertos se somam aos de antes
     (Pablo, 06/10/2026: "volta para o que eu errei, não tudo do começo"). */
  const refazerErradas = () => {
    setOrdem(erradas); setPos(0); setErradas([]); setSalvo(null); setEtapa('exercicios');
  };
  const indice = ETAPAS.findIndex((e) => e.id === etapa);

  return (
    <div className="space-y-6">
      {/* Cada etapa é um botão: dá para pular para qualquer uma (Pablo,
          07/10/2026: "toda hora volto do início"). O Fim só depois dos exercícios. */}
      <nav aria-label="Etapas da lição">
        <ol className="flex gap-1">
          {ETAPAS.map((e, i) => (
            <li key={e.id} className="flex-1">
              <button type="button" disabled={e.id === 'resultado' || e.id === etapa}
                onClick={() => (e.id === 'exercicios' ? reiniciarExercicios() : setEtapa(e.id))}
                aria-current={e.id === etapa ? 'step' : undefined}
                className="group w-full text-left enabled:cursor-pointer disabled:cursor-default">
                <div className="h-1 rounded-full t-colors group-enabled:group-hover:opacity-70" style={{ backgroundColor: i <= indice ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }} />
                <span className={`type-caption t-colors ${i === indice ? 'text-foreground' : 'text-muted-foreground group-enabled:group-hover:text-foreground'}`}>{e.nome}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section ref={topo} className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-5 scroll-mt-4">
        {etapa === 'gancho' && (
          <>
            <p className="type-caption text-muted-foreground">Antes de explicar, tente de cabeça</p>
            <MathText text={c.gancho.pergunta} className="font-reading type-lead" />
            {ideiaAberta ? (
              <>
                <div className="rounded-[var(--radius-control)] bg-primary/10 p-4"><MathText text={c.gancho.ideia} className="font-reading" /></div>
                <Avancar onClick={() => setEtapa('construcao')}>Entender por quê</Avancar>
              </>
            ) : (
              <button onClick={() => setIdeiaAberta(true)} className={botao}><Eye className="w-4 h-4" /> Pensei. Mostrar</button>
            )}
          </>
        )}

        {etapa === 'construcao' && (() => {
          // Um passo por vez: o atual sai e o próximo entra no lugar, sem
          // empilhar a lição inteira para baixo (Pablo, 06/10/2026).
          const i = passos - 1;
          const p = c.construcao[i];
          const total = c.construcao.length;
          return (
            <div key={i} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display type-lead font-semibold">{p.titulo}</h3>
                <span className="flex gap-1.5 pt-2 flex-shrink-0" role="img" aria-label={`Passo ${i + 1} de ${total}`}>
                  {c.construcao.map((_, k) => (
                    <span key={k} className={`h-1.5 rounded-full ${k === i ? 'w-4 bg-primary' : k < i ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'}`} />
                  ))}
                </span>
              </div>
              {p.visual && <VisualDesenho visual={p.visual} />}
              <MathText text={p.texto} className="font-reading" />
              <div className="flex items-center gap-4">
                {i > 0 && (
                  <button type="button" onClick={() => setPassos((n) => n - 1)} className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                )}
                {passos < total
                  ? <Avancar onClick={() => setPassos((n) => n + 1)}>Próximo passo</Avancar>
                  : <Avancar onClick={() => setEtapa('resumo')}>Juntar tudo</Avancar>}
              </div>
            </div>
          );
        })()}
        {etapa === 'resumo' && (
          <>
            <p className="type-caption text-muted-foreground">O resumo (a fórmula é o fim do raciocínio, não o começo)</p>
            <div className="rounded-[var(--radius-control)] border-l-4 border-primary bg-muted/40 p-4"><MathText text={c.resumo} className="font-reading" /></div>
            <Avancar onClick={() => setEtapa('exemplos')}>Ver exemplos resolvidos</Avancar>
          </>
        )}

        {etapa === 'exemplos' && (
          <Exemplo key={exemplo} exemplo={c.exemplos[exemplo]} numero={exemplo + 1}
            onFim={() => (exemplo < c.exemplos.length - 1 ? setExemplo((n) => n + 1) : setEtapa('exercicios'))} />
        )}

        {etapa === 'exercicios' && (
          <ExercicioView key={`${exercicio}-${ordem.length}`} exercicio={c.exercicios[exercicio]} numero={pos + 1} total={ordem.length}
            onFim={(acertou) => {
              const total = acertos + (acertou ? 1 : 0);
              setAcertos(total);
              if (!acertou) setErradas((e) => [...e, exercicio]);
              if (pos < ordem.length - 1) setPos((n) => n + 1);
              else finalizar(total);
            }} />
        )}

        {etapa === 'resultado' && (
          <>
            <p className="font-display type-headline font-semibold" data-numeric>{acertos} de {c.exercicios.length}</p>
            {salvo === null ? (
              <p className="type-meta text-muted-foreground">Salvando...</p>
            ) : salvo.concluiu ? (
              <p className="type-body">Lição concluída. Ela volta para uma revisão rápida daqui a 2 dias.</p>
            ) : (
              <p className="type-body">Não deu para salvar agora. Seus acertos aparecem acima.</p>
            )}
            <div className="rounded-[var(--radius-control)] border border-border p-4">
              <p className="type-caption text-muted-foreground mb-1">Responda de cabeça, sem olhar</p>
              <MathText text={c.recuperacao.pergunta} className="font-reading font-medium" />
              {recuperacaoAberta
                ? <div className="mt-2 text-muted-foreground"><MathText text={c.recuperacao.resposta} className="font-reading" /></div>
                : <button onClick={() => setRecuperacaoAberta(true)} className="mt-2 inline-flex items-center gap-1.5 type-meta text-primary-text font-medium hover:underline underline-offset-4"><Eye className="w-4 h-4" /> Conferir</button>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculo" className={botao}>Voltar para a trilha <ArrowRight className="w-4 h-4" /></Link>
              {erradas.length > 0 ? (
                <button onClick={refazerErradas} className={botao}>
                  <RefreshCcw className="w-4 h-4" /> Refazer só as que errei (<span data-numeric>{erradas.length}</span>)
                </button>
              ) : (
                <button onClick={reiniciarExercicios} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] border border-border type-meta hover:bg-muted t-colors">
                  <RefreshCcw className="w-4 h-4" /> Refazer os exercícios
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {licao.origem === 'ia' && (
        <p className="type-caption text-muted-foreground">Lição gerada por IA a partir do roteiro da trilha. Se algo parecer errado, confira com o resumo.</p>
      )}
    </div>
  );
}
