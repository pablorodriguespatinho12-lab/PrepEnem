'use client';
import React from 'react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { diasDoGrafico } from '@/lib/evolucao-diaria';

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
   mostram. Barras de acertos e erros por dia (21/10/2026): eram duas linhas
   (taxa % e questões no mesmo eixo), só nos dias com resposta, e 1 questão
   errada virava "0%". Com menos de 2 dias com resposta, não há evolução. */
const MIN_DIAS_PARA_EVOLUCAO = 2;
const JANELA_DIAS = 30;
export default function ProgressCharts({ stats }: Props) {
  const dias = diasDoGrafico(stats?.dailyData ?? {}, new Date(), JANELA_DIAS);
  const diasComResposta = dias.filter((d) => d.acertos + d.erros > 0).length;
  if (diasComResposta < MIN_DIAS_PARA_EVOLUCAO) return null;
  return (
    <div className="bg-[hsl(var(--surface-1))] rounded-[var(--radius-surface)] p-6 shadow-elev-1 border border-border">
      <h3 className="font-display type-lead font-semibold mb-5">Questões por dia · últimos 30 dias</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dias} margin={{ bottom: 20, left: 0, right: 10 }} barCategoryGap="20%">
            <XAxis dataKey="data" tickLine={false} axisLine={false} tick={TICK} interval={6} />
            <YAxis tickLine={false} axisLine={false} tick={TICK} allowDecimals={false} width={28} />
            <Tooltip contentStyle={TOOLTIP} cursor={{ fill: 'hsl(var(--muted) / 0.6)' }} />
            <Bar dataKey="acertos" stackId="dia" fill="hsl(var(--success))" name="Acertos" />
            <Bar dataKey="erros" stackId="dia" fill="hsl(var(--danger) / 0.7)" name="Erros" radius={[3, 3, 0, 0]} />
            <Legend verticalAlign="top" wrapperStyle={LEGEND} formatter={LEGEND_TEXT} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
