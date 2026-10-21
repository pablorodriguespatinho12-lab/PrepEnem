'use client';
import { motion } from 'framer-motion';
import { Sparkles, Sun, CheckCircle2 as DayDoneIcon, Circle, CircleDashed } from 'lucide-react';
import type { getWeekScheduleByNumber } from '@/lib/schedule-data';

type DiaDaSemana = ReturnType<typeof getWeekScheduleByNumber>[number];

type Props = {
  weekNumber: number;
  weekTitle: string;
  weekSchedule: DiaDaSemana[];
  diaAtual: number | null;
  diaAberto: number | null;
  abrirDia: (dayIndex: number) => void;
  statusDoDia: (dayIndex: number) => string;
};

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // por day.dayOfWeek (0=Dom civil), não por dayIndex
const ENTRADA = [0.16, 1, 0.3, 1] as const;

/* A semana do cronograma: status vem do progresso real, não da data. */
export function Semana({ weekNumber, weekTitle, weekSchedule, diaAtual, diaAberto, abrirDia, statusDoDia }: Props) {
  const aberto = diaAberto !== null ? weekSchedule[diaAberto] : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: ENTRADA }}
      className="pb-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary-text" />
        <h3 className="font-display type-lead font-semibold">Semana {weekNumber}: {weekTitle}</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {weekSchedule.map((day, dayIndex) => {
          const status = statusDoDia(dayIndex);
          const isActive = diaAtual === dayIndex;
          const isExpanded = diaAberto === dayIndex;
          const StatusIcon = status === 'concluido' ? DayDoneIcon : status === 'em_andamento' ? CircleDashed : Circle;
          return (
            <button
              key={dayIndex}
              onClick={() => abrirDia(dayIndex)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius-control)] border t-colors min-w-[52px] ${
                isExpanded ? 'border-primary shadow-elev-1' : 'border-transparent hover:bg-muted/50'
              }`}
            >
              {/* A cor do dia é um marcador de 4px no topo: preenchendo o chip
                  inteiro com texto branco, o contraste reprovava. */}
              <div
                className={`relative w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center type-caption flex-shrink-0 overflow-hidden ${
                  isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: day.color }} />
                {DIAS[day.dayOfWeek]}
                <StatusIcon className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-card ${
                  status === 'concluido' || status === 'em_andamento' ? 'text-primary-text' : 'text-muted-foreground'
                }`} />
              </div>
              {isActive && <span className="type-caption text-primary-text">Atual</span>}
            </button>
          );
        })}
      </div>

      {aberto && (
        <div className="mt-4 p-3 rounded-[var(--radius-control)] bg-muted/40">
          <p className="type-meta font-medium mb-1.5 flex items-center gap-1.5">
            {aberto.dayName}
            {aberto.manha.length > 0 && !aberto.isSimulado && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {diaAtual === diaAberto && (
              <span className="type-meta bg-primary text-primary-foreground px-2 py-0.5 rounded-[var(--radius-data)] font-medium">Atual</span>
            )}
          </p>
          <p className="type-meta text-muted-foreground">
            {aberto.isSimulado
              ? 'Simulado da semana'
              : [...aberto.manha, ...aberto.trabalho].map((b) => b.materia).join(' • ') || 'Sem blocos programados'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
