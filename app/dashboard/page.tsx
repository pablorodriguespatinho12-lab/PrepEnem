'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  BookOpen, Target, Flame, RefreshCcw, Calendar,
  Trophy, ArrowRight, AlertTriangle, CheckCircle2, Brain, Sparkles,
  Sun, Briefcase, FileText, Upload, ClipboardList
} from 'lucide-react';
import { getWeekScheduleByNumber, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';
import { CheckCircle2 as DayDoneIcon, Circle, CircleDashed } from 'lucide-react';

const ThreeScene = dynamic(() => import('@/components/three-scene'), { ssr: false });

/* ── Animated number counter ── */
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.floor(value * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);
  return <span>{display}{suffix}</span>;
}

/* ── Saudação + badge de semana ──
   Direto ao ponto: sem título animado (o nome do produto já está na
   sidebar), só o contexto de quem está estudando e em qual semana. */
function Greeting({ name, weekNumber }: { name: string; weekNumber: number }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pt-2">
      <p className="text-sm md:text-base font-display font-semibold whitespace-nowrap">
        Olá, {name}!
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
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
  const [activeDay, setActiveDay] = useState<{ weekNumber: number; dayIndex: number; cycleComplete: boolean } | null>(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);
  const dashRef = useRef<HTMLDivElement>(null);

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

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    if (loading) return;

    let ctx: any;
    import('gsap').then(gsapMod => {
      import('gsap/ScrollTrigger').then(stMod => {
        const gsap = gsapMod.gsap || gsapMod.default;
        const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          /* stat cards: rotateX reveal */
          gsap.fromTo('.gsap-stat', {
            rotationX: 50, y: 40, opacity: 0,
          }, {
            rotationX: 0, y: 0, opacity: 1,
            stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: '.gsap-stats-grid', start: 'top 88%', toggleActions: 'play none none none' },
          });

          /* action buttons: slide+rotate */
          gsap.fromTo('.gsap-action', {
            rotationX: 30, y: 30, opacity: 0,
          }, {
            rotationX: 0, y: 0, opacity: 1,
            stagger: 0.08, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: '.gsap-actions-grid', start: 'top 88%', toggleActions: 'play none none none' },
          });

          /* schedule sections: fade up */
          gsap.utils.toArray('.gsap-section').forEach((el: any) => {
            gsap.fromTo(el, { y: 50, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            });
          });

          // Em telas altas o suficiente pra caber a página inteira sem scroll
          // (ou quando o refresh inicial do ScrollTrigger mede o layout antes
          // dos dados assíncronos terminarem de empurrar o conteúdo), o
          // trigger de "top 88%" nunca é cruzado e o elemento fica em
          // opacity:0 pra sempre. Depois de um refresh (layout já assentado),
          // qualquer .gsap-reveal que já esteja visível no viewport revela
          // na hora, sem depender de o usuário rolar a página.
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            document.querySelectorAll('.gsap-reveal').forEach((el) => {
              const rect = el.getBoundingClientRect();
              const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
              if (alreadyVisible) {
                gsap.set(el, { opacity: 1, y: 0, rotationX: 0 });
              }
            });
          });
        }, dashRef);
      });
    });

    return () => { if (ctx) ctx.revert(); };
  }, [loading]);

  const weekNumber = activeDay?.weekNumber ?? 1;
  const weekTitle = studyCycle[weekNumber - 1]?.weekTitle ?? '';
  const weekSchedule = getWeekScheduleByNumber(weekNumber);
  const activeDaySchedule = activeDay ? weekSchedule[activeDay.dayIndex] : null;
  const expandedDaySchedule = expandedDayIndex !== null ? weekSchedule[expandedDayIndex] : null;
  const statusForDayIndex = (dayIndex: number): string =>
    studyProgress.find((p) => p.weekNumber === weekNumber && p.dayIndex === dayIndex)?.status ?? 'nao_iniciado';
  const treinoHref = activeDay ? `/treino?weekNumber=${activeDay.weekNumber}&dayIndex=${activeDay.dayIndex}` : '/treino';
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // indexado por day.dayOfWeek (0=Dom civil), não por dayIndex

  const statCards = [
    { label: 'Questões Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Taxa de Acerto', value: stats?.taxaAcerto ?? 0, suffix: '%', icon: Target, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    { label: 'Dias de Sequência', value: stats?.streakDays ?? 0, icon: Flame, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { label: 'Revisões Pendentes', value: stats?.pendingReviews ?? 0, icon: RefreshCcw, color: 'bg-primary/10 text-primary' },
  ];

  return (
    <>
      <ThreeScene />
      <div ref={dashRef} className="p-4 md:p-8 max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
        <Greeting name={session?.user?.name ?? 'Estudante'} weekNumber={weekNumber} />

        {/* ── Estudo Atual (protagonista, com CTA de treino embutido) ──
             "Atual" em vez de "Hoje": o dia mostrado é o próximo pendente no
             SEU progresso, não necessariamente o dia da semana civil de hoje. */}
        {activeDay?.cycleComplete ? (
          <div className="gsap-section gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border mb-6 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-base font-semibold">Ciclo de 4 semanas concluído!</p>
            <p className="text-xs text-muted-foreground mt-1">Continue treinando livremente pelas outras telas.</p>
          </div>
        ) : activeDaySchedule && (
          <div className="gsap-section gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border mb-6">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h2 className="font-display text-lg font-semibold">Estudo Atual</h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Semana {weekNumber} • {activeDaySchedule.dayName}
                </span>
              </div>
              <button
                onClick={skipActiveDay}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Pular este dia
              </button>
            </div>

            <button
              onClick={() => router.push(treinoHref)}
              className="w-full flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-4 md:p-5 shadow-lg hover:opacity-90 transition-all group shimmer-btn cta-glow mb-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-display text-base md:text-lg font-bold">Iniciar Treino (20 questões)</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            {activeDaySchedule.isSimulado ? (
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
                <ClipboardList className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Dia de Simulado</p>
                <p className="text-xs text-muted-foreground mt-1">Questões das matérias da semana</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDaySchedule.manha.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Matérias ENEM
                    </p>
                    <div className="space-y-2">
                      {activeDaySchedule.manha.map((block, i) => (
                        <button
                          key={i}
                          onClick={() => router.push(`/treino?mode=filtered&materia=${encodeURIComponent(block.materia)}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{block.materia}</p>
                            <p className="text-xs text-muted-foreground truncate">{block.tema}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeDaySchedule.trabalho.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Treino Diário
                    </p>
                    <div className="space-y-2">
                      {activeDaySchedule.trabalho.map((block, i) => (
                        <button
                          key={i}
                          onClick={() => router.push(`/treino?mode=filtered&materia=${encodeURIComponent(block.materia)}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: (materiaColors as any)[block.materia] ?? '#ccc' }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{block.materia}</p>
                            <p className="text-xs text-muted-foreground truncate">{block.tema}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Stats compactos (contexto, não protagonista) ── */}
        <div className="gsap-stats-grid flex items-stretch divide-x divide-border bg-card/60 backdrop-blur-sm rounded-xl border border-border mb-4 overflow-x-auto" style={{ perspective: '800px' }}>
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="gsap-stat gsap-reveal flex items-center gap-2 px-4 py-3 flex-1 min-w-[140px]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-tight">
                    <AnimatedNumber value={card.value} suffix={card.suffix} />
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Ações secundárias ── */}
        <div className="gsap-actions-grid grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6" style={{ perspective: '800px' }}>
          <button
            onClick={() => router.push('/treino?mode=review')}
            className="gsap-action gsap-reveal flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <RefreshCcw className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-display text-sm font-bold truncate">Revisar Agora</p>
              <p className="text-xs text-muted-foreground truncate">
                {(stats?.pendingReviews ?? 0) > 0 ? `${stats.pendingReviews} pendentes` : 'Nenhuma pendente'}
              </p>
            </div>
            {(stats?.pendingReviews ?? 0) > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex-shrink-0">{stats.pendingReviews}</span>
            )}
          </button>

          <button
            onClick={() => router.push('/simulado')}
            className="gsap-action gsap-reveal flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-display text-sm font-bold truncate">Simulado ENEM</p>
              <p className="text-xs text-muted-foreground truncate">
                {activeDaySchedule?.isSimulado ? 'Dia de simulado no seu plano atual' : 'Até 180 questões'}
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push('/upload')}
            className="gsap-action gsap-reveal flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-display text-sm font-bold truncate">Importar PDF</p>
              <p className="text-xs text-muted-foreground truncate">Provas e simulados</p>
            </div>
          </button>
        </div>

        {/* ── Weekly Calendar: pills horizontais, status vem do progresso real,
             não da data (dia atual do plano expandido por padrão) ── */}
        <div className="gsap-section gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Semana {weekNumber}: {weekTitle}</h2>
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
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all min-w-[52px] ${
                    isExpanded ? 'border-primary shadow-sm' : 'border-transparent hover:bg-muted/50'
                  }`}
                  style={isExpanded ? { backgroundColor: `${day.color}20` } : undefined}
                >
                  <div
                    className="relative w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: day.color }}
                  >
                    {weekDays[day.dayOfWeek]}
                    <StatusIcon className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-card ${
                      status === 'concluido' ? 'text-green-600' : status === 'pulado' ? 'text-muted-foreground' : status === 'em_andamento' ? 'text-primary' : 'text-border'
                    }`} />
                  </div>
                  {isActive && <span className="text-[9px] font-bold text-primary">Atual</span>}
                </button>
              );
            })}
          </div>

          {expandedDaySchedule && (
            <div className="mt-4 p-3 rounded-lg bg-muted/40">
              <p className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                {expandedDaySchedule.dayName}
                {expandedDaySchedule.manha.length > 0 && !expandedDaySchedule.isSimulado && (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
                {activeDay?.dayIndex === expandedDayIndex && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Atual</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {expandedDaySchedule.isSimulado
                  ? 'Simulado ENEM'
                  : [...expandedDaySchedule.manha, ...expandedDaySchedule.trabalho].map((b) => b.materia).join(' • ') || 'Sem blocos programados'}
              </p>
            </div>
          )}
        </div>

        {/* ── Subjects status ── */}
        {stats && (
          <div className="gsap-section gsap-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {(stats?.dominadas?.length ?? 0) > 0 && (
              <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-3d">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-display text-base font-semibold">Matérias Dominadas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(stats.dominadas ?? []).map((m: string) => (
                    <span key={m} className="px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            )}
            {(stats?.reforcar?.length ?? 0) > 0 && (
              <div className="bg-card rounded-xl p-5 shadow-sm border border-border card-3d">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-display text-base font-semibold">Matérias para Reforçar</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(stats.reforcar ?? []).map((m: string) => (
                    <span key={m} className="px-3 py-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
