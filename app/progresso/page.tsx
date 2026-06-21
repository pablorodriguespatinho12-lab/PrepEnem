'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, BookOpen, PenTool } from 'lucide-react';
import dynamic from 'next/dynamic';
import { materiaColors } from '@/lib/theme-colors';

function getContrastText(hex: string): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a2e' : '#ffffff';
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
          { label: 'Taxa de Acerto', value: `${stats?.taxaAcerto ?? 0}%`, icon: TrendingUp, color: 'text-purple-600' },
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
              { key: 'desenvolvimento2', label: 'Desenvolvimento 2', emoji: '🔍', color: 'bg-purple-500' },
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

      {/* Subtema Table */}
      {stats?.bySubtema && Object.keys(stats.bySubtema).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 shadow-sm border border-border mt-8"
        >
          <h3 className="font-display text-base font-semibold mb-4">Desempenho por Subtema</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-border">
                  <th className="pb-2 font-medium">Subtema</th>
                  <th className="pb-2 font-medium">Matéria</th>
                  <th className="pb-2 font-medium text-center">Total</th>
                  <th className="pb-2 font-medium text-center">Acertos</th>
                  <th className="pb-2 font-medium text-center">Taxa</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.bySubtema ?? {}).map(([subtema, data]: [string, any]) => {
                  const rate = data?.total > 0 ? Math.round((data.acertos / data.total) * 100) : 0;
                  return (
                    <tr key={subtema} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{subtema}</td>
                      <td className="py-2.5">
                        {(() => {
                          const bg = materiaColors[data?.materia] ?? '#888';
                          return (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: bg, color: getContrastText(bg) }}
                            >
                              {data?.materia ?? ''}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-2.5 text-center">{data?.total ?? 0}</td>
                      <td className="py-2.5 text-center">{data?.acertos ?? 0}</td>
                      <td className="py-2.5 text-center">
                        <span className={`font-semibold ${rate >= 70 ? 'text-green-700 dark:text-green-500' : rate >= 50 ? 'text-yellow-700 dark:text-yellow-500' : 'text-red-700 dark:text-red-500'}`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
