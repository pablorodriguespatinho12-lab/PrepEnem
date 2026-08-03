'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, BookOpen, PenTool, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { materiaColors } from '@/lib/theme-colors';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function getContrastText(hex: string): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a2e' : '#ffffff';
}

// Abaixo disso, uma % individual é ruído estatístico, não informação — numa
// amostra binária pequena, uma resposta a mais ou a menos muda a taxa em
// 20-33 pontos. Acima do limiar mas ainda baixo, mostra a % com um indicador
// de incerteza em vez de escondê-la.
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

function TaxaAcerto({ total, acertos }: { total: number; acertos: number }) {
  if (total < MIN_QUESTOES_PARA_TAXA) {
    return (
      <span className="text-xs text-muted-foreground italic whitespace-nowrap">
        poucos dados · responda mais para ver seu desempenho
      </span>
    );
  }
  const rate = Math.round((acertos / total) * 100);
  const baixaConfianca = total < LIMIAR_BAIXA_CONFIANCA;
  const colorClass =
    rate >= 70 ? 'text-green-700 dark:text-green-500' : rate >= 50 ? 'text-yellow-700 dark:text-yellow-500' : 'text-red-700 dark:text-red-500';
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className={`font-semibold text-sm ${colorClass}`}>{rate}%</span>
      <span className="text-xs text-muted-foreground">· {total} questões</span>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard de Progresso</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Acompanhe sua evolução detalhada nos estudos</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'text-blue-600' },
          { label: 'Acertos', value: stats?.totalAcertos ?? 0, icon: Target, color: 'text-green-600' },
          { label: 'Taxa de Acerto', value: `${stats?.taxaAcerto ?? 0}%`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Sequência', value: `${stats?.streakDays ?? 0} dias`, icon: BarChart3, color: 'text-orange-600' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border"
            >
              <Icon className={`w-5 h-5 mb-2 ${card.color}`} />
              <p className="font-display text-xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      {stats && <ProgressCharts stats={stats} />}

      {/* Essay Parts Progress */}
      {stats?.essayPartStats && Object.keys(stats.essayPartStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-xl p-6 shadow-sm border border-border mt-8"
        >
          <h3 className="font-display text-base font-semibold mb-4 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" /> Treino de Redação por Partes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'introducao', label: 'Introdução', emoji: '📝', color: 'bg-blue-500' },
              { key: 'desenvolvimento1', label: 'Desenvolvimento 1', emoji: '💡', color: 'bg-green-500' },
              { key: 'desenvolvimento2', label: 'Desenvolvimento 2', emoji: '🔍', color: 'bg-primary' },
              { key: 'conclusao', label: 'Conclusão', emoji: '🎯', color: 'bg-orange-500' },
            ].map(part => {
              const s = stats.essayPartStats[part.key];
              if (!s) return (
                <div key={part.key} className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-lg">{part.emoji}</p>
                  <p className="text-xs font-medium mt-1">{part.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">Nenhum treino</p>
                </div>
              );
              return (
                <div key={part.key} className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-lg">{part.emoji}</p>
                  <p className="text-xs font-medium mt-1">{part.label}</p>
                  <p className={`text-xl font-bold mt-1 ${s.avgNota >= 7 ? 'text-green-600' : s.avgNota >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {s.avgNota}/10
                  </p>
                  <p className="text-xs text-muted-foreground">{s.total} treinos</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Desempenho por Matéria — drill-down (matéria agregada, subtemas ao expandir) */}
      {stats?.byMateria && Object.keys(stats.byMateria).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 shadow-sm border border-border mt-8"
        >
          <h3 className="font-display text-base font-semibold mb-1">Desempenho por Matéria</h3>
          <p className="text-xs text-muted-foreground mb-4">Clique numa matéria para ver os subtemas</p>

          <Accordion type="multiple" className="w-full">
            {Object.entries(stats.byMateria)
              .sort(([, a]: [string, any], [, b]: [string, any]) => (b?.total ?? 0) - (a?.total ?? 0))
              .map(([materia, materiaData]: [string, any]) => {
                const bg = materiaColors[materia] ?? '#888';
                const subtemas = Object.entries(stats.bySubtema ?? {})
                  .filter(([, d]: [string, any]) => d?.materia === materia)
                  .sort(([, a]: [string, any], [, b]: [string, any]) => (b?.total ?? 0) - (a?.total ?? 0));

                return (
                  <AccordionItem key={materia} value={materia}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                            style={{ backgroundColor: bg, color: getContrastText(bg) }}
                          >
                            {materia}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
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
                            <span className="text-sm truncate">{subtema}</span>
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
