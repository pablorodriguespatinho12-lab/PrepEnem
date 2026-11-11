'use client';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, BookOpen, PenTool, AlertCircle, FileText, Lightbulb, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { materiaColors } from '@/lib/theme-colors';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EsqueletoLista } from '@/components/esqueletos';

// Abaixo disso, uma % individual é ruído estatístico, não informação — numa
// amostra binária pequena, uma resposta a mais ou a menos muda a taxa em
// 20-33 pontos. Acima do limiar mas ainda baixo, mostra a % com um indicador
// de incerteza em vez de escondê-la.
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

function TaxaAcerto({ total, acertos }: { total: number; acertos: number }) {
  if (total < MIN_QUESTOES_PARA_TAXA) {
    return (
      <span className="type-meta text-muted-foreground italic whitespace-nowrap" title="Responda mais para ver a porcentagem">
        poucos dados · <span data-numeric>{total}</span> {total === 1 ? 'questão' : 'questões'}
      </span>
    );
  }
  const rate = Math.round((acertos / total) * 100);
  const baixaConfianca = total < LIMIAR_BAIXA_CONFIANCA;
  // Extremos usam o token semântico (alto = success, baixo = danger); a
  // faixa intermediária fica neutra — o sistema não define um terceiro
  // token de cor entre os dois, e inventar um "warning" ad hoc pra taxa de
  // acerto contrariaria a regra de verde/vermelho exclusivos.
  const rateStyle =
    rate >= 70 ? { color: 'hsl(var(--success))' } : rate < 50 ? { color: 'hsl(var(--danger))' } : undefined;
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span data-numeric className="font-semibold type-meta" style={rateStyle}>{rate}%</span>
      <span className="type-meta text-muted-foreground">
        · <span data-numeric>{total}</span> questões
      </span>
      {baixaConfianca && (
        <AlertCircle
          className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0"
          aria-label="Amostra pequena: a taxa ainda pode mudar bastante"
        />
      )}
    </span>
  );
}

const ProgressCharts = dynamic(() => import('./progress-charts'), { ssr: false, loading: () => <div aria-hidden className="h-80 rounded-[var(--radius-surface)] bg-muted motion-safe:animate-pulse" /> });

const ESSAY_PART_ICONS: Record<string, typeof FileText> = {
  introducao: FileText,
  desenvolvimento1: Lightbulb,
  desenvolvimento2: Search,
  conclusao: Target,
};

export default function ProgressoPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto"><EsqueletoLista rotulo="Carregando seu progresso" linhas={5} /></div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary-text" />
          <h1 className="font-display type-headline font-bold">Seu progresso</h1>
        </div>

      </motion.div>

      {/* Só dois números (Pablo, 06/10/2026: "pode deixar só total respondidas
          e acertos"). Taxa e sequência saíram. */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl">
        {[
          { label: 'Total Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'text-muted-foreground' },
          { label: 'Acertos', value: stats?.totalAcertos ?? 0, icon: Target, style: { color: 'hsl(var(--success))' } },
        ].map((card: { label: string; value: number; icon: typeof BookOpen; color?: string; style?: React.CSSProperties }, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="surface-1 rounded-[var(--radius-surface)] p-4"
            >
              <Icon className={`w-5 h-5 mb-2 ${card.color ?? ''}`} style={card.style} />
              <p data-numeric className="font-display type-title font-semibold">{card.value}</p>
              <p className="type-caption text-muted-foreground">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Conta nova: a tela era dois zeros e fundo vazio (foto de 07/10/2026). */}
      {stats && (stats.totalRespondidas ?? 0) < MIN_QUESTOES_PARA_TAXA && (
        <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-8 max-w-xl flex items-center gap-5">
          <svg viewBox="0 0 120 60" className="w-28 h-14 flex-shrink-0 text-primary-text" aria-hidden>
            <line x1="4" y1="56" x2="116" y2="56" stroke="hsl(var(--border))" strokeWidth="2" />
            <motion.path
              d="M6 50 L34 42 L60 46 L86 24 L114 10"
              fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="min-w-0">
            <p className="font-display type-lead font-semibold">Sua evolução aparece aqui</p>
            <p className="type-meta text-muted-foreground mt-1">Responda <span data-numeric>{MIN_QUESTOES_PARA_TAXA}</span> questões e a linha começa a subir.</p>
            <Link href="/provas" className="inline-block mt-2 py-2 type-meta font-semibold text-primary-text hover:underline underline-offset-4">Começar o treino</Link>
          </div>
        </div>
      )}
      {/* Charts */}
      {stats && <ProgressCharts stats={stats} />}

      {/* Essay Parts Progress */}
      {stats?.essayPartStats && Object.keys(stats.essayPartStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="surface-1 rounded-[var(--radius-surface)] p-6 mt-8"
        >
          <h3 className="font-display type-body font-semibold mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary-text" /> Treino de Redação por Partes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'introducao', label: 'Introdução' },
              { key: 'desenvolvimento1', label: 'Desenvolvimento 1' },
              { key: 'desenvolvimento2', label: 'Desenvolvimento 2' },
              { key: 'conclusao', label: 'Conclusão' },
            ].map(part => {
              const s = stats.essayPartStats[part.key];
              const Icon = ESSAY_PART_ICONS[part.key];
              if (!s) return (
                <div key={part.key} className="bg-muted/30 rounded-[var(--radius-control)] p-4 text-center">
                  <Icon className="w-5 h-5 text-muted-foreground mx-auto" />
                  <p className="type-caption text-muted-foreground mt-1">{part.label}</p>
                  <p className="type-meta text-muted-foreground mt-1">Nenhum treino</p>
                </div>
              );
              return (
                <div key={part.key} className="bg-muted/30 rounded-[var(--radius-control)] p-4 text-center">
                  <Icon className="w-5 h-5 text-primary-text mx-auto" />
                  <p className="type-caption text-muted-foreground mt-1">{part.label}</p>
                  <p data-numeric className="type-title font-semibold mt-1">
                    {s.avgNota}/10
                  </p>
                  <p data-numeric className="type-meta text-muted-foreground">{s.total} treinos</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Desempenho por Matéria — drill-down (matéria agregada, subtemas ao expandir) */}
      {stats?.byMateria && Object.keys(stats.byMateria).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="surface-1 rounded-[var(--radius-surface)] p-6 mt-8"
        >
          <h3 className="font-display type-body font-semibold mb-1">Desempenho por Matéria</h3>
          <p className="type-meta text-muted-foreground mb-4">Clique numa matéria para ver os subtemas</p>

          <Accordion type="multiple" className="w-full">
            {Object.entries(stats.byMateria)
              .sort(([, a]: [string, any], [, b]: [string, any]) => (b?.total ?? 0) - (a?.total ?? 0))
              .map(([materia, materiaData]: [string, any]) => {
                const dotColor = materiaColors[materia] ?? 'hsl(var(--muted-foreground))';
                const subtemas = Object.entries(stats.bySubtema ?? {})
                  .filter(([, d]: [string, any]) => d?.materia === materia)
                  .sort(([, a]: [string, any], [, b]: [string, any]) => (b?.total ?? 0) - (a?.total ?? 0));

                return (
                  <AccordionItem key={materia} value={materia}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-wrap items-center justify-between w-full pr-2 gap-x-3 gap-y-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-flex items-center gap-1.5 type-meta font-semibold whitespace-nowrap">
                            <span
                              aria-hidden
                              className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                              style={{ backgroundColor: dotColor }}
                            />
                            {materia}
                          </span>
                          <span data-numeric className="type-meta text-muted-foreground whitespace-nowrap">
                            {subtemas.length} subtema{subtemas.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <TaxaAcerto total={materiaData?.total ?? 0} acertos={materiaData?.acertos ?? 0} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-1">
                        {subtemas.map(([subtema, sdata]: [string, any]) => (
                          <div
                            key={subtema}
                            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2 border-b border-border/40 last:border-0"
                          >
                            <span className="type-meta truncate">{subtema}</span>
                            <TaxaAcerto total={sdata?.total ?? 0} acertos={sdata?.acertos ?? 0} />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </motion.div>
      )}
    </div>
  );
}
