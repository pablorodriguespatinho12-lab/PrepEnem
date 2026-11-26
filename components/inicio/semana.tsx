'use client';
import type { getWeekScheduleByNumber } from '@/lib/schedule-data';
import { datasDaSemana } from '@/lib/datas-da-semana';

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

/* A semana do cronograma: a data é a desta semana; o status vem do progresso real. */
export function Semana({ weekNumber, weekTitle, weekSchedule, diaAtual, diaAberto, abrirDia, statusDoDia }: Props) {
  const aberto = diaAberto !== null ? weekSchedule[diaAberto] : null;
  const { datas, hoje } = datasDaSemana(new Date());
  return (
    <section aria-labelledby="a-semana" className="m-cartao m-col12">
      <h2 id="a-semana">A semana {weekNumber}: {weekTitle}</h2>
      <div className="m-semana">
        {weekSchedule.map((day, dayIndex) => {
          const status = statusDoDia(dayIndex);
          const marca = status === 'concluido' ? '✓ feito' : diaAtual === dayIndex ? 'atual' : status === 'em_andamento' ? 'começado' : '';
          return (
            <button
              key={dayIndex}
              type="button"
              className="m-dia"
              data-hoje={day.dayOfWeek === hoje ? 'sim' : undefined}
              aria-pressed={diaAberto === dayIndex}
              onClick={() => abrirDia(dayIndex)}
            >
              {DIAS[day.dayOfWeek]}
              <b data-numeric>{datas[day.dayOfWeek]}</b>
              <span className="block min-h-[1.2em]">{marca}</span>
            </button>
          );
        })}
      </div>
      {aberto && (
        <p className="m-mut !mb-0 mt-3">
          <strong>{aberto.dayName}: </strong>
          {aberto.isSimulado
            ? 'Simulado da semana'
            : [...aberto.manha, ...aberto.trabalho].map((b) => b.materia).join(' • ') || 'Sem blocos programados'}
        </p>
      )}
    </section>
  );
}
