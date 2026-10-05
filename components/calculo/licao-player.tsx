'use client';
// Uma lição, uma etapa por vez: gancho → construção → resumo → exemplos →
// exercícios → resultado. Nada aparece antes da hora: o aluno tenta o gancho
// antes da explicação e responde a lacuna antes de ver o passo.

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, Lightbulb, RefreshCcw } from 'lucide-react';
import MathText from '@/components/math-text';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { RespostaInput } from './resposta-input';
import type { ExemploResolvido, Exercicio, LicaoCompleta } from '@/lib/calculo/tipos';

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
      <p className="type-caption text-muted-foreground" data-numeric>Exercício {numero} de {total}</p>
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

export function LicaoPlayer({ licao }: { licao: LicaoCompleta }) {
  const [etapa, setEtapa] = useState<Etapa>('gancho');
  const [ideiaAberta, setIdeiaAberta] = useState(false);
  const [passos, setPassos] = useState(1);
  const [exemplo, setExemplo] = useState(0);
  const [exercicio, setExercicio] = useState(0);
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

  const reiniciarExercicios = () => { setExercicio(0); setAcertos(0); setSalvo(null); setEtapa('exercicios'); };
  const indice = ETAPAS.findIndex((e) => e.id === etapa);

  return (
    <div className="space-y-6">
      <nav aria-label="Etapas da lição">
        <ol className="flex gap-1">
          {ETAPAS.map((e, i) => (
            <li key={e.id} className="flex-1">
              <div className="h-1 rounded-full" style={{ backgroundColor: i <= indice ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }} />
              <span className={`type-caption ${i === indice ? 'text-foreground' : 'text-muted-foreground'}`}>{e.nome}</span>
            </li>
          ))}
        </ol>
      </nav>

      <section className="surface-1 rounded-[var(--radius-surface)] p-6 space-y-5">
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

        {etapa === 'construcao' && (
          <>
            <ol className="space-y-6">
              {c.construcao.slice(0, passos).map((p, i) => (
                <li key={i} className="space-y-3">
                  <p className="type-caption text-muted-foreground" data-numeric>Passo {i + 1} de {c.construcao.length}</p>
                  {p.visual && <VisualDesenho visual={p.visual} />}
                  <h3 className="font-display type-body font-semibold">{p.titulo}</h3>
                  <MathText text={p.texto} className="font-reading" />
                </li>
              ))}
            </ol>
            {passos < c.construcao.length
              ? <Avancar onClick={() => setPassos((n) => n + 1)}>Próximo passo</Avancar>
              : <Avancar onClick={() => setEtapa('resumo')}>Juntar tudo</Avancar>}
          </>
        )}

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
          <ExercicioView key={exercicio} exercicio={c.exercicios[exercicio]} numero={exercicio + 1} total={c.exercicios.length}
            onFim={(acertou) => {
              const total = acertos + (acertou ? 1 : 0);
              setAcertos(total);
              if (exercicio < c.exercicios.length - 1) setExercicio((n) => n + 1);
              else finalizar(total);
            }} />
        )}

        {etapa === 'resultado' && (
          <>
            <p className="font-display type-headline font-semibold" data-numeric>{acertos} de {c.exercicios.length}</p>
            {salvo === null ? (
              <p className="type-meta text-muted-foreground">Salvando...</p>
            ) : salvo.concluiu ? (
              <p className="type-body">Degrau concluído. O próximo está aberto, e este volta para uma revisão rápida daqui a 2 dias.</p>
            ) : (
              <p className="type-body">Para subir de degrau, acerte pelo menos 70%. Releia os exemplos e tente de novo: é aqui que o raciocínio se fixa.</p>
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
              <button onClick={reiniciarExercicios} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] border border-border type-meta hover:bg-muted t-colors">
                <RefreshCcw className="w-4 h-4" /> Refazer os exercícios
              </button>
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
