'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCcw, Trophy, ArrowRight, Sparkles, Sun, ChevronDown } from 'lucide-react';
import { getWeekScheduleByNumber, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';
import { CheckCircle2 as DayDoneIcon, Circle, CircleDashed } from 'lucide-react';
// Mesma curva de --ease-entrance (globals.css).
const ENTRADA = [0.16, 1, 0.3, 1] as const;



/* ══════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyProgress, setStudyProgress] = useState<any[]>([]);
  // A semana repete as matérias do dia: fica fechada até o aluno pedir.
  const [semanaAberta, setSemanaAberta] = useState(false);
  const [carregandoDia, setCarregandoDia] = useState(true);
  const [activeDay, setActiveDay] = useState<{ weekNumber: number; dayIndex: number; cycleComplete: boolean } | null>(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

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
  const activeDaySchedule = activeDay ? weekSchedule[activeDay.dayIndex] : null;
  const expandedDaySchedule = expandedDayIndex !== null ? weekSchedule[expandedDayIndex] : null;
  // "pulado" (do antigo Pular este dia) não é estudado: aparece pendente.
  const statusForDayIndex = (dayIndex: number): string => {
    const status = studyProgress.find((p) => p.weekNumber === weekNumber && p.dayIndex === dayIndex)?.status ?? 'nao_iniciado';
    return status === 'pulado' ? 'nao_iniciado' : status;
  };
  const treinoHref = activeDay ? `/treino?weekNumber=${activeDay.weekNumber}&dayIndex=${activeDay.dayIndex}` : '/treino';
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // indexado por day.dayOfWeek (0=Dom civil), não por dayIndex
  // Dia de verdade, no horário de Brasília: "Quinta-feira".
  const hojeNome = (() => {
    const nome = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date());
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  })();



  return (
    <>
      <div className="p-4 md:p-8 max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Pablo, 06/10/2026: "tira esse negócio de iniciar treino, coloca só
            meu cronograma de hoje e começar; tira o olá". Sem saudação, sem
            banner. O dia é o próximo pendente no progresso, não o do calendário.
            As revisões ficam num link lá embaixo ("deixar para depois"). */}
        {carregandoDia && !activeDay && (
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6 space-y-4" role="status" aria-label="Carregando o cronograma de hoje">
            <div className="h-6 w-24 rounded-[var(--radius-data)] bg-muted motion-safe:animate-pulse" />
            <div className="h-4 w-64 rounded-[var(--radius-data)] bg-muted motion-safe:animate-pulse" />
            <div className="h-4 w-56 rounded-[var(--radius-data)] bg-muted motion-safe:animate-pulse" />
            <div className="h-11 w-36 rounded-[var(--radius-control)] bg-muted motion-safe:animate-pulse" />
          </div>
        )}
        {activeDay?.cycleComplete ? (
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6 text-center">
            <Trophy className="w-8 h-8 text-primary-text mx-auto mb-2" />
            <p className="font-display type-body font-semibold">Ciclo de 4 semanas concluído!</p>
            <p className="type-meta text-muted-foreground mt-1">Continue treinando livremente pelas outras telas.</p>
          </div>
        ) : activeDaySchedule && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: ENTRADA }}
            className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
            aria-labelledby="hoje-titulo"
          >
            <div className="flex items-baseline justify-between gap-2 mb-4 flex-wrap">
              <h1 id="hoje-titulo" className="font-display type-title font-semibold">Hoje</h1>
              {/* O conteúdo é o do primeiro dia não estudado; o rótulo diz o dia
                  de verdade e de qual dia é o conteúdo (Pablo, 15/10/2026: "mostra
                  o dia de hoje, que é quinta, mas com o conteúdo de segunda"). */}
              <span data-numeric className="type-meta text-muted-foreground">
                {hojeNome === activeDaySchedule.dayName
                  ? `Semana ${weekNumber} · ${activeDaySchedule.dayName}`
                  : `${hojeNome} · conteúdo de ${activeDaySchedule.dayName.replace('-feira', '').toLowerCase()} (semana ${weekNumber})`}
              </span>
            </div>
            {activeDaySchedule.isSimulado ? (
              <p className="type-body mb-6">Dia do simulado da semana: uma matéria, de 10 a 20 questões.</p>
            ) : (
              <ul className="space-y-2.5 mb-6">
                {[...activeDaySchedule.manha, ...activeDaySchedule.trabalho].map((block, i) => (
                  <motion.li
                    key={`${block.materia}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.12 + i * 0.05, ease: ENTRADA }}
                    className="flex items-baseline gap-3 min-w-0"
                  >
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full flex-shrink-0 translate-y-[-1px]" style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }} />
                    {/* Tema quebra para baixo no celular: com truncate virava "Mol, Massa molar, Conceito d…". */}
                    <span className="min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="type-body font-medium whitespace-nowrap">{block.materia}</span>
                      <span className="type-meta text-muted-foreground">{block.tema}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(activeDaySchedule.isSimulado ? '/simulado' : treinoHref)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] px-6 py-3 font-display type-lead font-semibold shadow-elev-1 hover:opacity-90 t-colors group"
              >
                Começar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.section>
        )}
        {/* ── Weekly Calendar: pills horizontais, status vem do progresso real,
             não da data (dia atual do plano expandido por padrão) ── */}
        <button
          type="button"
          onClick={() => setSemanaAberta((v) => !v)}
          aria-expanded={semanaAberta}
          className="mb-4 inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${semanaAberta ? 'rotate-180' : ''}`} />
          {semanaAberta ? 'Esconder a semana' : 'Ver a semana'}
        </button>
        {(stats?.pendingReviews ?? 0) > 0 && (
          <button
            type="button"
            onClick={() => router.push('/treino?mode=review')}
            className="mb-4 ml-6 inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Revisões <span data-numeric>({stats.pendingReviews})</span>
          </button>
        )}
        {semanaAberta && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: ENTRADA }}
          className="surface-1 rounded-[var(--radius-surface)] p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-text" />
            <h2 className="font-display type-lead font-semibold">Semana {weekNumber}: {weekTitle}</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {weekSchedule.map((day, dayIndex) => {
              const status = statusForDayIndex(dayIndex);
              const isActive = activeDay?.dayIndex === dayIndex;
              const isExpanded = expandedDayIndex === dayIndex;
              const StatusIcon = status === 'concluido' || status === 'pulado' ? DayDoneIcon : status === 'em_andamento' ? CircleDashed : Circle;
              return (
                <button
                  key={dayIndex}
                  onClick={() => setExpandedDayIndex(dayIndex)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius-control)] border t-colors min-w-[52px] ${
                    isExpanded ? 'border-primary shadow-elev-1' : 'border-transparent hover:bg-muted/50'
                  }`}
                >
                  {/* A cor do dia preenchia o chip inteiro com texto branco em
                      cima — mesmo problema de contraste das pílulas de matéria.
                      Agora ela vira um marcador de 4px no topo e o chip usa a
                      superfície do sistema. */}
                  <div
                    className={`relative w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center type-caption flex-shrink-0 overflow-hidden ${
                      isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ backgroundColor: day.color }}
                    />
                    {weekDays[day.dayOfWeek]}
                    <StatusIcon className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-card ${
                      status === 'concluido' ? 'text-primary-text' : status === 'pulado' ? 'text-muted-foreground' : status === 'em_andamento' ? 'text-primary-text' : 'text-border'
                    }`} />
                  </div>
                  {isActive && <span className="type-caption text-primary-text">Atual</span>}
                </button>
              );
            })}
          </div>

          {expandedDaySchedule && (
            <div className="mt-4 p-3 rounded-[var(--radius-control)] bg-muted/40">
              <p className="type-meta font-medium mb-1.5 flex items-center gap-1.5">
                {expandedDaySchedule.dayName}
                {expandedDaySchedule.manha.length > 0 && !expandedDaySchedule.isSimulado && (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
                {activeDay?.dayIndex === expandedDayIndex && (
                  <span className="type-meta bg-primary text-primary-foreground px-2 py-0.5 rounded-[var(--radius-data)] font-medium">Atual</span>
                )}
              </p>
              <p className="type-meta text-muted-foreground">
                {expandedDaySchedule.isSimulado
                  ? 'Simulado da semana'
                  : [...expandedDaySchedule.manha, ...expandedDaySchedule.trabalho].map((b) => b.materia).join(' • ') || 'Sem blocos programados'}
              </p>
            </div>
          )}
        </motion.div>
        )}
      </div>
    </>
  );
}
