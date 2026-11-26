'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getWeekScheduleByNumber, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';
import { MetaDoDia } from '@/components/inicio/meta-do-dia';
import { RevisaoDeHoje } from '@/components/inicio/revisao-de-hoje';
import { Semana } from '@/components/inicio/semana';
import { BlocoLeitura } from '@/components/inicio/leitura';
import { ContinuarProva } from '@/components/inicio/continuar-prova';
import { CapaPixel } from '@/components/visual/capa-pixel';

/* Início da opção A (26/11/2026): capa em pixel com o dia e o Começar, e blocos
   embaixo. Sem saudação e sem banner: a capa É o cronograma de hoje. */
export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [studyProgress, setStudyProgress] = useState<any[]>([]);
  const [carregandoDia, setCarregandoDia] = useState(true);
  const [activeDay, setActiveDay] = useState<{ weekNumber: number; dayIndex: number; cycleComplete: boolean } | null>(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchStudyProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/study-progress');
      if (res.ok) {
        const data = await res.json();
        setStudyProgress(data?.progress ?? []);
        setActiveDay(data?.active ?? null);
        setExpandedDayIndex((prev) => prev ?? data?.active?.dayIndex ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregandoDia(false);
    }
  }, []);

  useEffect(() => { fetchStats(); fetchStudyProgress(); }, [fetchStats, fetchStudyProgress]);

  const weekNumber = activeDay?.weekNumber ?? 1;
  const weekTitle = studyCycle[weekNumber - 1]?.weekTitle ?? '';
  const weekSchedule = getWeekScheduleByNumber(weekNumber);
  const activeDaySchedule = activeDay && !activeDay.cycleComplete ? weekSchedule[activeDay.dayIndex] : null;
  const blocos = activeDaySchedule ? [...activeDaySchedule.manha, ...activeDaySchedule.trabalho] : [];
  const materias = Array.from(new Set(blocos.map((b) => b.materia)));
  // "pulado" (do antigo Pular este dia) não é estudado: aparece pendente.
  const statusDoDia = (dayIndex: number): string => {
    const status = studyProgress.find((p) => p.weekNumber === weekNumber && p.dayIndex === dayIndex)?.status ?? 'nao_iniciado';
    return status === 'pulado' ? 'nao_iniciado' : status;
  };
  const comecarHref = activeDaySchedule?.isSimulado
    ? '/simulado'
    : activeDay ? `/treino?weekNumber=${activeDay.weekNumber}&dayIndex=${activeDay.dayIndex}` : '/provas';
  // Dia de verdade, no horário de Brasília: "Quinta-feira".
  const hojeNome = (() => {
    const nome = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date());
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  })();
  /* O conteúdo é o do primeiro dia não estudado; o rótulo diz o dia de verdade
     e de qual dia é o conteúdo (Pablo, 15/10/2026). */
  const rotuloDoDia = !activeDaySchedule ? '' : hojeNome === activeDaySchedule.dayName
    ? `Semana ${weekNumber} · ${activeDaySchedule.dayName}`
    : `${hojeNome} · conteúdo de ${activeDaySchedule.dayName.replace('-feira', '').toLowerCase()} (semana ${weekNumber})`;
  const titulo = activeDay?.cycleComplete
    ? 'Ciclo de 4 semanas concluído'
    : activeDaySchedule?.isSimulado
      ? 'Dia de simulado'
      : `${materias.length} ${materias.length === 1 ? 'matéria' : 'matérias'} hoje`;
  const revisoes = stats?.pendingReviews ?? 0;
  const carregando = carregandoDia && !activeDay;

  return (
    <div className="moderno m-pagina">
      <CapaPixel
        id="hoje-titulo"
        sobre={carregando ? 'Carregando o cronograma' : rotuloDoDia}
        titulo={carregando ? 'Hoje' : titulo}
      >
        {!carregando && !activeDay?.cycleComplete && (
          <Link href={comecarHref} className="m-vai">Começar</Link>
        )}
      </CapaPixel>

      <div className="m-blocos">
        <section aria-labelledby="cai-hoje" className="m-cartao m-col7">
          <h2 id="cai-hoje">O que cai hoje</h2>
          {blocos.length === 0 && <p className="m-mut">{carregando ? 'Carregando' : 'Sem blocos hoje'}</p>}
          {blocos.map((block, i) => (
            <div key={`${block.materia}-${i}`} className="m-materia">
              <i aria-hidden style={{ backgroundColor: materiaColors[block.materia] ?? 'var(--m-mut)' }} />
              <div className="min-w-0">
                <b>{block.materia}</b>
                <span>{block.tema}</span>
              </div>
            </div>
          ))}
        </section>

        <MetaDoDia />
        <RevisaoDeHoje questoes={revisoes} />
        <BlocoLeitura />
        <ContinuarProva />

        <Semana
          weekNumber={weekNumber}
          weekTitle={weekTitle}
          weekSchedule={weekSchedule}
          diaAtual={activeDay?.dayIndex ?? null}
          diaAberto={expandedDayIndex}
          abrirDia={setExpandedDayIndex}
          statusDoDia={statusDoDia}
        />
      </div>
    </div>
  );
}
