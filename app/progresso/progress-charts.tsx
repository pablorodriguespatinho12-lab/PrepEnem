'use client';
import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
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

export default function ProgressCharts({ stats }: Props) {
  // Pie chart data: acertos vs erros
  const pieData = [
    { name: 'Acertos', value: stats?.totalAcertos ?? 0 },
    { name: 'Erros', value: Math.max(0, (stats?.totalRespondidas ?? 0) - (stats?.totalAcertos ?? 0)) },
  ];
  const PIE_COLORS = ['hsl(var(--success))', 'hsl(var(--danger))'];

  // Bar chart: by materia
  const barData = Object.entries(stats?.byMateria ?? {}).map(([materia, data]: [string, any]) => ({
    materia,
    acertos: data?.acertos ?? 0,
    erros: Math.max(0, (data?.total ?? 0) - (data?.acertos ?? 0)),
    total: data?.total ?? 0,
  }));

  // Line chart: daily evolution (last 30 days)
  const lineData = Object.entries(stats?.dailyData ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]: [string, any]) => ({
      date: date.slice(5), // MM-DD
      acertos: data?.acertos ?? 0,
      total: data?.total ?? 0,
      taxa: data?.total > 0 ? Math.round((data.acertos / data.total) * 100) : 0,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-6 shadow-elev-1 border border-border">
        <h3 className="font-display type-lead font-semibold mb-5">Acertos vs Erros</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry: any, idx: number) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP} />
              <Legend verticalAlign="top" wrapperStyle={LEGEND} formatter={LEGEND_TEXT} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-6 shadow-elev-1 border border-border">
        <h3 className="font-display type-lead font-semibold mb-5">Acertos por Matéria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ bottom: 40, left: 10 }}>
              <XAxis
                dataKey="materia"
                tickLine={false}
                tick={TICK}
                angle={-45}
                textAnchor="end"
                height={50}
                interval={0}
              />
              <YAxis tickLine={false} tick={TICK} />
              <Tooltip contentStyle={TOOLTIP} cursor={{ fill: 'hsl(var(--surface-2))' }} />
              <Bar dataKey="acertos" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} name="Acertos" />
              <Bar dataKey="erros" fill="hsl(var(--danger))" radius={[3, 3, 0, 0]} name="Erros" />
              <Legend verticalAlign="top" wrapperStyle={LEGEND} formatter={LEGEND_TEXT} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      {lineData.length > 0 && (
        <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-6 shadow-elev-1 border border-border lg:col-span-2">
          <h3 className="font-display type-lead font-semibold mb-5">Evolução nos Últimos 30 Dias</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ bottom: 20, left: 10, right: 10 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tick={TICK}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} tick={TICK} />
                <Tooltip contentStyle={TOOLTIP} />
                <Line type="monotone" dataKey="taxa" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2.5 }} name="Taxa (%)" />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 2.5 }} name="Questões" />
                <Legend verticalAlign="top" wrapperStyle={LEGEND} formatter={LEGEND_TEXT} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
