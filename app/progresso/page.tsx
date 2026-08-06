'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, BookOpen, PenTool, AlertCircle, FileText, Lightbulb, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { materiaColors } from '@/lib/theme-colors';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Abaixo disso, uma % individual é ruído estatístico, não informação — numa
// amostra binária pequena, uma resposta a mais ou a menos muda a taxa em
// 20-33 pontos. Acima do limiar mas ainda baixo, mostra a % com um indicador
// de incerteza em vez de escondê-la.
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

function TaxaAcerto({ total, acertos }: { total: number; acertos: number }) {
  if (total < MIN_QUESTOES_PARA_TAXA) {
    return (
      <span className="type-meta text-muted-foreground italic whitespace-nowrap">
        poucos dados · responda mais para ver seu desempenho
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

const ProgressCharts = dynamic(() => import('./progress-charts'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" /></div> });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary-text" />
          <h1 className="font-display type-headline font-bold">Dashboard de Progresso</h1>
        </div>
        <p className="type-meta text-muted-foreground mb-8">Acompanhe sua evolução detalhada nos estudos</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'text-muted-foreground' },
          { label: 'Acertos', value: stats?.totalAcertos ?? 0, icon: Target, style: { color: 'hsl(var(--success))' } },
          { label: 'Taxa de Acerto', value: `${stats?.taxaAcerto ?? 0}%`, icon: TrendingUp, color: 'text-primary-text' },
          { label: 'Sequência', value: `${stats?.streakDays ?? 0} dias`, icon: BarChart3, color: 'text-muted-foreground' },
        ].map((card, i) => {
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
                      <div className="flex items-center justify-between w-full pr-2 gap-3">
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
                            className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0"
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
