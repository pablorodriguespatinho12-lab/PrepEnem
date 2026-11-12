'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { aulaDoTema, type Degrau } from '@/lib/aulas-dia-2';
import { antesDaQuestao, type Exercicio } from '@/lib/antes-da-questao';
import { desenhoDoTema } from '@/lib/aulas-desenho';
import { TelaDesenho, TelaProporcoes, TelaSentido } from '@/components/simulado/telas-desenho';
import { TelaEstaQuestao, TelaPasso, useAulaDaQuestao } from '@/components/simulado/resolver-esta-questao';
import type { QuestaoTutor } from '@/components/tutor/explicacao-tutor';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

type Tela = { rotulo: string; listas?: string[]; degrau?: Degrau; conteudo?: ReactNode };

// Botão "Não sei isso" das provas do dia 2. Ordem (Pablo, 11/11/2026: "cada exercício
// tem uma aula diferente"): o conceito em desenho → a aula DESTA questão, passo a passo,
// sem a resposta → "Tentar responder". Depois, opcional: o conteúdo e como cai no Médio,
// Difícil e ENEM.
export function AulaDoTema({ tema, questao, className }: { tema: string | null | undefined; questao?: QuestaoTutor; className?: string }) {
  const aula = aulaDoTema(tema);
  const [aberta, setAberta] = useState(false);
  const [tela, setTela] = useState(0);
  const reduzir = useReducedMotion();
  const daQuestao = useAulaDaQuestao(questao, aberta);
  if (!aula || !tema) return null;

  const desenho = desenhoDoTema(tema);
  const conceito: Tela[] = desenho
    ? [
        { rotulo: 'O conceito em desenho', conteudo: <TelaDesenho d={desenho} /> },
        ...(desenho.proporcoes.length ? [{ rotulo: 'Direta ou inversa', conteudo: <TelaProporcoes d={desenho} /> }] : []),
      ]
    : [];
  // O que a questão cobra e a aula do tema não ensina: aula curta + exercícios (12/11/2026).
  const antes: Tela[] = antesDaQuestao(questao?.id).flatMap((c) => [
    { rotulo: `Antes: ${c.titulo}`, conteudo: <TelaPasso passo={c.aula} /> },
    ...c.exercicios.map((e, i) => ({
      rotulo: `Antes: ${c.titulo}, exercício ${i + 1}`,
      conteudo: <QuestaoDegrau degrau={e} />,
    })),
  ]);
  const estaQuestao: Tela[] = !questao || !daQuestao
    ? []
    : [
        { rotulo: 'Esta questão: a ideia', conteudo: <TelaEstaQuestao aula={daQuestao} /> },
        ...(daQuestao.estado === 'pronta'
          ? daQuestao.passos.map((p) => ({ rotulo: `Esta questão: ${p.titulo}`, conteudo: <TelaPasso passo={p} /> }))
          : []),
      ];
  const fimDaQuestao = conceito.length + antes.length + estaQuestao.length - 1;
  const telas: Tela[] = [
    ...conceito,
    ...antes,
    ...estaQuestao,
    ...(desenho ? [{ rotulo: 'Por que faz sentido', conteudo: <TelaSentido d={desenho} /> }] : []),
    { rotulo: 'Aula do conteúdo', listas: aula.aula },
    ...(aula.paraSubir.length ? [{ rotulo: 'Para subir de nível', listas: aula.paraSubir }] : []),
    ...aula.degraus.map((d) => ({ rotulo: `Como cai no ${d.nivel}`, degrau: d })),
  ];
  const atual = telas[Math.min(tela, telas.length - 1)];
  const total = telas.length;
  const ultima = tela === total - 1;
  const naHoraDeTentar = tela === fimDaQuestao && !ultima;
  const abrir = () => { setTela(0); setAberta(true); };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary/10 text-primary-text type-meta font-medium t-colors hover:bg-primary/15 ${className ?? ''}`}
      >
        <BookOpen className="w-4 h-4" aria-hidden />
        Não sei isso: ver a aula
      </button>

      <Dialog open={aberta} onOpenChange={setAberta}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-w-xl max-h-[90dvh] overflow-y-auto rounded-[var(--radius-surface)]"
        >
          <div className="pr-8">
            <p className="type-caption text-primary-text font-medium">
              {atual.rotulo}
            </p>
            <DialogTitle className="font-display type-title font-semibold">{tema}</DialogTitle>
            <DialogDescription className="sr-only">
              Aula curta do conteúdo e exemplos de questão de nível mais alto.
            </DialogDescription>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tela}
              initial={reduzir ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={reduzir ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={reduzir ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduzir ? 0.12 : 0.22 }}
            >
              {atual.conteudo ? (
                atual.conteudo
              ) : atual.listas ? (
                <ul className="space-y-3">
                  {atual.listas.map((frase) => (
                    <li key={frase} className="flex gap-3 font-reading type-body">
                      <span aria-hidden className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span><MathText text={frase} /></span>
                    </li>
                  ))}
                </ul>
              ) : (
                atual.degrau && <QuestaoDegrau degrau={atual.degrau} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setTela((t) => t - 1)}
              disabled={tela === 0}
              aria-label="Tela anterior"
              className="w-11 h-11 grid place-items-center rounded-[var(--radius-control)] bg-primary/10 text-primary-text t-colors hover:bg-primary/15 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === tela ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            {naHoraDeTentar ? (
              <button
                type="button"
                onClick={() => setAberta(false)}
                className="h-11 px-4 inline-flex items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground type-meta font-medium t-colors hover:bg-[hsl(var(--primary-hover))]"
              >
                Tentar responder
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (ultima ? setAberta(false) : setTela((t) => t + 1))}
                className="h-11 px-4 inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-primary text-primary-foreground type-meta font-medium t-colors hover:bg-[hsl(var(--primary-hover))]"
              >
                {ultima ? 'Voltar à questão' : 'Próximo'}
                {!ultima && <ChevronRight className="w-4 h-4" aria-hidden />}
              </button>
            )}
          </div>
          {naHoraDeTentar && (
            <button
              type="button"
              onClick={() => setTela((t) => t + 1)}
              className="justify-self-end type-meta text-primary-text font-medium hover:underline"
            >
              Mais do conteúdo (Médio, Difícil, ENEM)
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Uma questão de nível mais alto do mesmo conteúdo: toca numa letra e vê a resolução.
// Também serve ao exercício do "Antes" (sem nível nem origem).
function QuestaoDegrau({ degrau }: { degrau: Degrau | Exercicio }) {
  const [marcada, setMarcada] = useState<number | null>(null);
  const respondeu = marcada !== null;

  return (
    <div className="space-y-4">
      {(degrau as Partial<Degrau>).origem && <p className="type-caption text-muted-foreground">{(degrau as Partial<Degrau>).origem}</p>}
      <div className="font-reading type-body whitespace-pre-line"><MathText text={degrau.enunciado} /></div>
      <div className="space-y-2">
        {degrau.alternativas.map((texto, i) => {
          const certa = respondeu && i === degrau.certa;
          const errada = respondeu && i === marcada && i !== degrau.certa;
          const cor = certa ? 'hsl(var(--success))' : errada ? 'hsl(var(--danger))' : undefined;
          return (
            <button
              key={i}
              type="button"
              disabled={respondeu}
              onClick={() => setMarcada(i)}
              className="w-full flex items-start gap-3 p-3 rounded-[var(--radius-control)] border text-left t-colors hover:bg-muted/50 disabled:hover:bg-transparent"
              style={cor ? { borderColor: cor } : undefined}
            >
              <span
                className="w-7 h-7 shrink-0 grid place-items-center rounded-[var(--radius-control)] type-meta font-semibold bg-muted"
                style={cor ? { backgroundColor: cor, color: 'white' } : undefined}
              >
                {certa ? <Check className="w-4 h-4" aria-label="certa" /> : errada ? <X className="w-4 h-4" aria-label="sua resposta" /> : LETRAS[i]}
              </span>
              <span className="font-reading type-body pt-0.5 flex-1"><MathText text={texto} /></span>
            </button>
          );
        })}
      </div>
      {respondeu && (
        <div className="rounded-[var(--radius-control)] bg-muted/60 p-4">
          <p className="type-caption font-medium mb-1">Resolução</p>
          <div className="font-reading type-body"><MathText text={degrau.resolucao} /></div>
        </div>
      )}
      {!respondeu && <p className="type-caption text-muted-foreground">Tente antes de ver: toque numa letra.</p>}
    </div>
  );
}
