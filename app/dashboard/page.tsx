'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  RefreshCcw, Calendar, Trophy, ArrowRight, Brain, Sparkles,
  Sun, Briefcase, ClipboardList, ChevronDown,
} from 'lucide-react';
import { getWeekScheduleByNumber, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';
import { CheckCircle2 as DayDoneIcon, Circle, CircleDashed } from 'lucide-react';



/* ── Saudação + badge de semana ──
   Direto ao ponto: sem título animado (o nome do produto já está na
   sidebar), só o contexto de quem está estudando e em qual semana. */
function Greeting({ name, weekNumber }: { name: string; weekNumber: number }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pt-2">
      {/* Âncora editorial da página. A tela inteira estava presa entre 10.9px
          e 26.6px (range 2.44x) — sem nenhum elemento no topo da escala, a
          hierarquia dependia só de peso e cor. */}
      <h1 className="type-headline font-display font-semibold whitespace-nowrap">
        Olá, {name}
      </h1>
      <div className="flex items-center gap-2 flex-wrap">
        <span data-numeric className="px-2.5 py-1 bg-primary/10 text-primary-text type-meta font-semibold rounded-[var(--radius-data)] whitespace-nowrap">
          Semana {weekNumber}/4
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(w => (
            <div key={w} className={`w-2 h-2 rounded-full ${w <= weekNumber ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════ */
export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyProgress, setStudyProgress] = useState<any[]>([]);
  // A semana repete as matérias do dia: fica fechada até o aluno pedir.
  const [semanaAberta, setSemanaAberta] = useState(false);
  // Pablo, 06/10/2026: "deixa mais escondido aquilo que eu não vou usar no
  // dia". A lista de matérias clicáveis fica atrás de um clique.
  const [materiasAbertas, setMateriasAbertas] = useState(false);
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

  const skipActiveDay = useCallback(async () => {
    if (!activeDay) return;
    await fetch('/api/study-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber: activeDay.weekNumber, dayIndex: activeDay.dayIndex, status: 'pulado' }),
    }).catch(() => {});
    fetchStudyProgress();
  }, [activeDay, fetchStudyProgress]);

  const weekNumber = activeDay?.weekNumber ?? 1;
  const weekTitle = studyCycle[weekNumber - 1]?.weekTitle ?? '';
  const weekSchedule = getWeekScheduleByNumber(weekNumber);
  const activeDaySchedule = activeDay ? weekSchedule[activeDay.dayIndex] : null;
  const expandedDaySchedule = expandedDayIndex !== null ? weekSchedule[expandedDayIndex] : null;
  const statusForDayIndex = (dayIndex: number): string =>
    studyProgress.find((p) => p.weekNumber === weekNumber && p.dayIndex === dayIndex)?.status ?? 'nao_iniciado';
  const treinoHref = activeDay ? `/treino?weekNumber=${activeDay.weekNumber}&dayIndex=${activeDay.dayIndex}` : '/treino';
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // indexado por day.dayOfWeek (0=Dom civil), não por dayIndex



  return (
    <>
      <div className="p-4 md:p-8 max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
        <Greeting name={session?.user?.name ?? 'Estudante'} weekNumber={weekNumber} />

        {/* ── Estudo Atual (protagonista, com CTA de treino embutido) ──
             "Atual" em vez de "Hoje": o dia mostrado é o próximo pendente no
             SEU progresso, não necessariamente o dia da semana civil de hoje. */}
        {carregandoDia && !activeDay && (
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6 space-y-4" role="status" aria-label="Carregando o estudo de hoje">
            <div className="h-5 w-40 rounded-[var(--radius-data)] bg-muted motion-safe:animate-pulse" />
            <div className="h-20 rounded-[var(--radius-control)] bg-muted motion-safe:animate-pulse" />
            <div className="h-4 w-64 rounded-[var(--radius-data)] bg-muted motion-safe:animate-pulse" />
          </div>
        )}

        {activeDay?.cycleComplete ? (
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6 text-center">
            <Trophy className="w-8 h-8 text-primary-text mx-auto mb-2" />
            <p className="font-display type-body font-semibold">Ciclo de 4 semanas concluído!</p>
            <p className="type-meta text-muted-foreground mt-1">Continue treinando livremente pelas outras telas.</p>
          </div>
        ) : activeDaySchedule && (
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h2 className="font-display type-lead font-semibold">Estudo Atual</h2>
                <span data-numeric className="type-meta bg-primary/10 text-primary-text px-2 py-0.5 rounded-[var(--radius-data)]">
                  Semana {weekNumber} • {activeDaySchedule.dayName}
                </span>
              </div>
              <button
                onClick={skipActiveDay}
                className="type-meta text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Pular este dia
              </button>
            </div>

            <button
              onClick={() => router.push(treinoHref)}
              className="w-full flex items-center gap-4 bg-primary text-primary-foreground rounded-[var(--radius-control)] p-4 md:p-5 shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 group mb-4"
            >
              <div className="w-12 h-12 rounded-[var(--radius-control)] bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-display type-title font-bold">Iniciar Treino (20 questões)</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            {activeDaySchedule.isSimulado ? (
              <button
                type="button"
                onClick={() => router.push('/simulado')}
                className="w-full p-4 rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] border border-border text-center hover:border-primary t-colors"
              >
                <ClipboardList className="w-8 h-8 text-foreground mx-auto mb-2" />
                <p className="type-meta font-medium text-foreground">Hoje é dia do simulado da semana</p>
                <p className="type-caption text-muted-foreground mt-1">Uma matéria, de 10 a 20 questões</p>
              </button>
            ) : (
              <>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 type-meta text-muted-foreground">
                <span>Hoje:</span>
                {[...activeDaySchedule.manha, ...activeDaySchedule.trabalho].map((block, i) => (
                  <span key={`${block.materia}-${i}`} className="inline-flex items-center gap-1.5 text-foreground">
                    <span aria-hidden className="w-2 h-2 rounded-full" style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }} />
                    {block.materia}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMateriasAbertas((v) => !v)}
                aria-expanded={materiasAbertas}
                className="mt-3 inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${materiasAbertas ? 'rotate-180' : ''}`} />
                {materiasAbertas ? 'Esconder as matérias' : 'Estudar uma matéria só'}
              </button>
              {materiasAbertas && (
              <div className="space-y-3 mt-3">
                {activeDaySchedule.manha.length > 0 && (
                  <div>
                    <p className="type-caption text-muted-foreground mb-2 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Matérias ENEM
                    </p>
                    <div className="space-y-2">
                      {activeDaySchedule.manha.map((block, i) => (
                        <button
                          key={i}
                          onClick={() => router.push(`/treino?mode=filtered&materia=${encodeURIComponent(block.materia)}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-control)] bg-muted/50 hover:bg-muted t-colors text-left group"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="type-meta font-medium">{block.materia}</p>
                            <p className="type-meta text-muted-foreground truncate">{block.tema}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-text t-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeDaySchedule.trabalho.length > 0 && (
                  <div>
                    <p className="type-caption text-muted-foreground mb-2 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Treino Diário
                    </p>
                    <div className="space-y-2">
                      {activeDaySchedule.trabalho.map((block, i) => (
                        <button
                          key={i}
                          onClick={() => router.push(`/treino?mode=filtered&materia=${encodeURIComponent(block.materia)}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-[var(--radius-control)] bg-muted/50 hover:bg-muted t-colors text-left group"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="type-meta font-medium">{block.materia}</p>
                            <p className="type-meta text-muted-foreground truncate">{block.tema}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-text t-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
              </>
            )}
          </div>
        )}

        {/* Tela inicial enxuta (Pablo, 06/10/2026: "não deixar tanta coisa num
            lugar só"). Saíram daqui os números (estão em Progresso), os atalhos
            de Simulado e Importar PDF (estão no menu) e as matérias para
            reforçar (Progresso). Fica só o que é ação de hoje: revisar. */}
        {(stats?.pendingReviews ?? 0) > 0 && (
          <button
            onClick={() => router.push('/treino?mode=review')}
            className="w-full flex items-center gap-3 surface-1 rounded-[var(--radius-surface)] p-4 mb-6 t-lift group text-left"
          >
            <div className="w-9 h-9 rounded-[var(--radius-control)] bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RefreshCcw className="w-4 h-4 text-primary-text" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display type-body font-semibold">Revisar o que você errou</p>
              <p className="type-meta text-muted-foreground"><span data-numeric>{stats.pendingReviews}</span> questões esperando revisão</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-text group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
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
        {semanaAberta && (
        <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-8">
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
        </div>
        )}
      </div>
    </>
  );
}
