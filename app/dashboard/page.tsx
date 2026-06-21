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
import { getCurrentCycleInfo, getCurrentWeekSchedule, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';

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

/* ── Hero title with GSAP 3D letter animation ── */
function HeroTitle({ name }: { name: string }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const greetRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let gsapModule: typeof import('gsap') | null = null;
    import('gsap').then(mod => {
      gsapModule = mod;
      const gsap = mod.gsap || mod.default;
      if (!titleRef.current) return;

      const letters = titleRef.current.querySelectorAll('.hero-letter');
      const tl = gsap.timeline();

      tl.fromTo(
        letters,
        { y: -100, rotationX: 90, opacity: 0, transformOrigin: 'center bottom' },
        { y: 0, rotationX: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'back.out(1.7)' }
      );

      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }

      if (greetRef.current) {
        tl.fromTo(
          greetRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      }
    });
  }, [name]);

  return (
    <div className="text-center mb-10 pt-4">
      <div ref={titleRef} style={{ perspective: '1000px' }}>
        {'PrepEnem'.split('').map((letter, i) => (
          <span
            key={i}
            className="hero-letter inline-block text-5xl md:text-7xl font-display font-black bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm"
            style={{ transformStyle: 'preserve-3d', opacity: 0 }}
          >
            {letter}
          </span>
        ))}
      </div>
      <p
        ref={subRef}
        className="text-muted-foreground text-base md:text-lg mt-3"
        style={{ opacity: 0 }}
      >
        Sua plataforma inteligente de estudos para o ENEM
      </p>
      <p
        ref={greetRef}
        className="text-xl md:text-2xl font-display font-bold mt-4"
        style={{ opacity: 0 }}
      >
        Olá, {name}! 👋
      </p>
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

  useEffect(() => { fetchStats(); }, [fetchStats]);

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
        }, dashRef);
      });
    });

    return () => { if (ctx) ctx.revert(); };
  }, [loading]);

  const cycleInfo = getCurrentCycleInfo();
  const weekSchedule = getCurrentWeekSchedule();
  const todaySchedule = weekSchedule.find(d => d.dayOfWeek === new Date().getDay());
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayOfWeek = new Date().getDay();

  const statCards = [
    { label: 'Questões Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Taxa de Acerto', value: stats?.taxaAcerto ?? 0, suffix: '%', icon: Target, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    { label: 'Dias de Sequência', value: stats?.streakDays ?? 0, icon: Flame, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
    { label: 'Revisões Pendentes', value: stats?.pendingReviews ?? 0, icon: RefreshCcw, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  ];

  return (
    <>
      <ThreeScene />
      <div ref={dashRef} className="p-4 md:p-8 max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* ── Hero ── */}
        <HeroTitle name={session?.user?.name ?? 'Estudante'} />

        {/* Week indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            Semana {cycleInfo.weekNumber}/4
          </span>
          <span className="text-sm text-muted-foreground">{cycleInfo.currentWeek.weekTitle}</span>
          <div className="flex gap-1 ml-2">
            {[1,2,3,4].map(w => (
              <div key={w} className={`w-2.5 h-2.5 rounded-full ${w <= cycleInfo.weekNumber ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="gsap-stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" style={{ perspective: '800px' }}>
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="gsap-stat gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-sm border border-border card-3d card-shine cursor-default"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-display text-2xl font-bold">
                  <AnimatedNumber value={card.value} suffix={card.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Action Buttons ── */}
        <div className="gsap-actions-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" style={{ perspective: '800px' }}>
          <button
            onClick={() => router.push('/treino')}
            className="gsap-action gsap-reveal flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 shadow-lg hover:opacity-90 transition-all group shimmer-btn cta-glow"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-display text-lg font-bold">Iniciar Treino</p>
              <p className="text-sm opacity-80">20 questões do dia</p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push('/treino?mode=review')}
            className="gsap-action gsap-reveal flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <RefreshCcw className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-display text-lg font-bold">Revisar Agora</p>
              <p className="text-sm text-muted-foreground">
                {(stats?.pendingReviews ?? 0) > 0 ? `${stats.pendingReviews} pendentes` : 'Nenhuma pendente'}
              </p>
            </div>
            {(stats?.pendingReviews ?? 0) > 0 && (
              <span className="px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">{stats.pendingReviews}</span>
            )}
          </button>

          <button
            onClick={() => router.push('/simulado')}
            className="gsap-action gsap-reveal flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-display text-lg font-bold">Simulado ENEM</p>
              <p className="text-sm text-muted-foreground">
                {todaySchedule?.isSimulado ? '🔥 Hoje é dia de simulado!' : 'Até 180 questões cronometradas'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push('/upload')}
            className="gsap-action gsap-reveal flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group card-3d"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-display text-lg font-bold">Importar PDF</p>
              <p className="text-sm text-muted-foreground">Provas e simulados</p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ── Today's Study Plan ── */}
        {todaySchedule && (
          <div className="gsap-section gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-lg font-semibold">Estudo de Hoje</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Semana {cycleInfo.weekNumber} • {todaySchedule.dayName}
              </span>
            </div>

            {todaySchedule.isSimulado ? (
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
                <ClipboardList className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">📝 Dia de Simulado!</p>
                <p className="text-xs text-muted-foreground mt-1">Questões das matérias da semana</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedule.manha.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Matérias ENEM
                    </p>
                    <div className="space-y-2">
                      {todaySchedule.manha.map((block, i) => (
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

                {todaySchedule.trabalho.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Treino Diário
                    </p>
                    <div className="space-y-2">
                      {todaySchedule.trabalho.map((block, i) => (
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

        {/* ── Weekly Calendar ── */}
        <div className="gsap-section gsap-reveal bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Semana {cycleInfo.weekNumber}: {cycleInfo.currentWeek.weekTitle}</h2>
          </div>
          <div className="space-y-2">
            {weekSchedule.map((day) => {
              const isToday = day.dayOfWeek === dayOfWeek;
              const allBlocks = [...day.manha, ...day.trabalho];
              return (
                <div
                  key={day.dayOfWeek}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                    isToday ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: day.color }}
                  >
                    {weekDays[day.dayOfWeek]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{day.dayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {day.isSimulado ? '📝 Simulado ENEM' : allBlocks.map((b) => b.materia).join(' • ')}
                    </p>
                  </div>
                  {day.manha.length > 0 && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  {isToday && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Hoje</span>
                  )}
                </div>
              );
            })}
          </div>
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
