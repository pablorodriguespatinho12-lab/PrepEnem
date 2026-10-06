'use client';
import React from 'react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { materiaColors } from '@/lib/theme-colors';

interface Props {
  stats: any;
}

/* O gráfico é parte do sistema, não um anexo. Antes: fontSize 9/10/11 soltos
   (fora da escala) e #22c55e/#ef4444 literais. O texto da legenda do recharts
   herda a cor da série, então "Acertos" saía em verde sobre branco a 2.24:1 —
   reprovado em AA. Agora a cor identifica só o traço; o rótulo fica em
   foreground. Verde e vermelho continuam porque ali significam acerto e erro,
   mas vêm de --success/--danger. */
const TICK = { fontSize: 10.9, fill: 'hsl(var(--muted-foreground))' };
const LEGEND = { fontSize: 10.9, color: 'hsl(var(--foreground))' };
const TOOLTIP = {
  fontSize: 13.6,
  background: 'hsl(var(--surface-2))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-control)',
  color: 'hsl(var(--foreground))',
};
const LEGEND_TEXT = (value: string) => (
  <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
);

/* Só a evolução por dia (06/10/2026): a rosca "acertos × erros" e as barras
   por matéria repetiam o que os cartões e a lista "Desempenho por Matéria" já
   mostram, e três vistas do mesmo número poluíam a tela. Com menos de 2 dias
   não há evolução para mostrar. */
const MIN_DIAS_PARA_EVOLUCAO = 2;
export default function ProgressCharts({ stats }: Props) {
  const lineData = Object.entries(stats?.dailyData ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]: [string, any]) => ({
      date: `${date.slice(8, 10)}/${date.slice(5, 7)}`,
      acertos: data?.acertos ?? 0,
      total: data?.total ?? 0,
      taxa: data?.total > 0 ? Math.round((data.acertos / data.total) * 100) : 0,
    }));
  if (lineData.length < MIN_DIAS_PARA_EVOLUCAO) return null;
  return (
    <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-6 shadow-elev-1 border border-border">
      <h3 className="font-display type-lead font-semibold mb-5">Evolução nos últimos 30 dias</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ bottom: 20, left: 10, right: 10 }}>
            <XAxis dataKey="date" tickLine={false} tick={TICK} interval="preserveStartEnd" />
            <YAxis tickLine={false} tick={TICK} />
            <Tooltip contentStyle={TOOLTIP} />
            <Line type="monotone" dataKey="taxa" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2.5 }} name="Taxa (%)" />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 2.5 }} name="Questões" />
            <Legend verticalAlign="top" wrapperStyle={LEGEND} formatter={LEGEND_TEXT} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
