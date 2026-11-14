'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VisualDesenho } from '@/components/visual/visual-desenho';
import { CaberNaCaixa } from '@/components/tutor/caber-na-caixa';
import type { QuestaoTutor } from '@/components/tutor/explicacao-tutor';
import type { Explicacao, PassoExplicacao } from '@/lib/tutor/validar';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

// A aula DESTA questão antes de responder (Pablo, 11/11/2026: "cada exercício tem uma
// aula diferente, de como resolver"). Usa a explicação pronta do banco, escrita à mão
// e revisada; o passo "A resposta" fica de fora para ele ainda tentar.

export type AulaDaQuestao =
  | { estado: 'carregando' }
  | { estado: 'sem-aula'; motivo: string }
  | { estado: 'pronta'; explicacao: Explicacao; passos: PassoExplicacao[] };

const ehResposta = (p: PassoExplicacao) => /resposta/i.test(p.titulo);

export function useAulaDaQuestao(questao: QuestaoTutor | null | undefined, ativa: boolean): AulaDaQuestao | null {
  const [aula, setAula] = useState<AulaDaQuestao | null>(null);
  const id = questao?.id;

  useEffect(() => {
    if (!ativa || !questao || aula?.estado === 'pronta') return;
    let cancelada = false;
    setAula({ estado: 'carregando' });
    fetch('/api/tutor/explicacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: questao.id,
        enunciado: questao.enunciado,
        alternativas: { A: questao.alternativaA, B: questao.alternativaB, C: questao.alternativaC, D: questao.alternativaD, E: questao.alternativaE },
        respostaCorreta: questao.respostaCorreta,
        respostaDada: null,
        materia: questao.materia,
        subtema: questao.subtema,
        soPronta: true,
      }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (cancelada) return;
        if (!r.ok || !data?.explicacao) {
          setAula({ estado: 'sem-aula', motivo: data?.error ?? 'Não deu para abrir a aula desta questão agora.' });
          return;
        }
        const e = data.explicacao as Explicacao;
        setAula({ estado: 'pronta', explicacao: e, passos: e.passos.filter((p) => !ehResposta(p)) });
      })
      .catch(() => { if (!cancelada) setAula({ estado: 'sem-aula', motivo: 'Sem internet agora. Tente de novo em instantes.' }); });
    return () => { cancelada = true; };
    // Busca uma vez por questão aberta; a tela da prova remonta o botão a cada questão (key).
  }, [ativa, id]);

  return aula;
}

export function TelaEstaQuestao({ aula }: { aula: AulaDaQuestao }) {
  if (aula.estado === 'carregando') return <p className="type-meta text-muted-foreground">Abrindo a aula desta questão…</p>;
  if (aula.estado === 'sem-aula') return <p className="type-meta text-muted-foreground">{aula.motivo}</p>;
  const { explicacao } = aula;
  return (
    <div className="space-y-4">
      {/* Frase em letra normal: em pixel e negrito ficava difícil de ler (14/11/2026). */}
      <div className="font-reading type-lead font-semibold"><MathText text={explicacao.ideia} /></div>
      {explicacao.pecas.length > 0 && (
        <ul className="space-y-3">
          {explicacao.pecas.map((p, i) => (
            <li key={`${i}-${p.termo}`} className="font-reading type-body">
              <span className="font-semibold text-primary-text"><MathText text={p.termo} /></span>
              <div className="text-foreground/85"><MathText text={p.significado} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TelaPasso({ passo }: { passo: PassoExplicacao }) {
  // min-w-0: um quadro largo (ésteres do ENEM) empurrava a janela para o lado e o
  // Próximo sumia (14/11/2026). O desenho encolhe dentro da caixa; a janela não cresce.
  return (
    <div className="space-y-4 min-w-0">
      {/* Uma ideia por linha, com respiro entre elas (Pablo, 12/11/2026: o passo
          vinha num bloco de 8 linhas e ele não entendia). Texto longo desce de
          type-lead para type-body, para a figura não encolher. */}
      <div className={`font-reading space-y-2 ${passo.texto.length > 220 ? 'type-body' : 'type-lead'}`}>
        {passo.texto.split('\n').filter((l) => l.trim()).map((linha, i) => (
          <MathText key={i} text={linha} />
        ))}
      </div>
      {passo.visual && (
        <div className="passo-visual h-[min(18rem,38dvh)] min-w-0 overflow-hidden rounded-[var(--radius-control)] border border-border bg-[hsl(var(--surface-2))] p-2">
          <CaberNaCaixa>
            <VisualDesenho visual={passo.visual} semMoldura />
          </CaberNaCaixa>
        </div>
      )}
    </div>
  );
}
