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

export default function ProgressCharts({ stats }: Props) {
  // Pie chart data: acertos vs erros
  const pieData = [
    { name: 'Acertos', value: stats?.totalAcertos ?? 0 },
    { name: 'Erros', value: Math.max(0, (stats?.totalRespondidas ?? 0) - (stats?.totalAcertos ?? 0)) },
  ];
  const PIE_COLORS = ['#22c55e', '#ef4444'];

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
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="font-display text-base font-semibold mb-4">Acertos vs Erros</h3>
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
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="font-display text-base font-semibold mb-4">Acertos por Matéria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ bottom: 40, left: 10 }}>
              <XAxis
                dataKey="materia"
                tickLine={false}
                tick={{ fontSize: 9 }}
                angle={-45}
                textAnchor="end"
                height={50}
                interval={0}
              />
              <YAxis tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="acertos" fill="#22c55e" radius={[4, 4, 0, 0]} name="Acertos" />
              <Bar dataKey="erros" fill="#ef4444" radius={[4, 4, 0, 0]} name="Erros" />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      {lineData.length > 0 && (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border lg:col-span-2">
          <h3 className="font-display text-base font-semibold mb-4">Evolução nos Últimos 30 Dias</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ bottom: 20, left: 10, right: 10 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="taxa" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Taxa (%)" />
                <Line type="monotone" dataKey="total" stroke="#60B5FF" strokeWidth={2} dot={{ r: 3 }} name="Questões" />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
