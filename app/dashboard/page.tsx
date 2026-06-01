'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Target, Flame, RefreshCcw, Calendar,
  Trophy, ArrowRight, AlertTriangle, CheckCircle2, Brain, Sparkles,
  Sun, Briefcase, FileText, Upload, ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import { weeklySchedule } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';

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

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const todaySchedule = weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const statCards = [
    { label: 'Questões Respondidas', value: stats?.totalRespondidas ?? 0, icon: BookOpen, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Taxa de Acerto', value: stats?.taxaAcerto ?? 0, suffix: '%', icon: Target, color: 'bg-green-500/10 text-green-600' },
    { label: 'Dias de Sequência', value: stats?.streakDays ?? 0, icon: Flame, color: 'bg-orange-500/10 text-orange-600' },
    { label: 'Revisões Pendentes', value: stats?.pendingReviews ?? 0, icon: RefreshCcw, color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          Olá, {session?.user?.name ?? 'Estudante'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Acompanhe seu progresso e continue evoluindo para o ENEM</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 md:p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-display text-2xl font-bold">
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons - 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push('/treino')}
          className="flex items-center gap-4 bg-primary text-primary-foreground rounded-xl p-5 shadow-lg hover:opacity-90 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display text-lg font-bold">Iniciar Treino</p>
            <p className="text-sm opacity-80">20 questões inteligentes</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push('/treino?mode=review')}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
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
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => router.push('/simulado')}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
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
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => router.push('/upload')}
          className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display text-lg font-bold">Importar PDF</p>
            <p className="text-sm text-muted-foreground">Provas e simulados</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Today's Plan: Morning + Work */}
      {todaySchedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Morning Plan */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-lg font-semibold">Estudo da Manhã</h2>
              <span className="text-xs bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-full">Matérias ENEM</span>
            </div>
            {todaySchedule.manha.length > 0 ? (
              <div className="space-y-3">
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
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{block.questoes}q</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            ) : todaySchedule.isSimulado ? (
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
                <ClipboardList className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700">Dia de Simulado!</p>
                <p className="text-xs text-muted-foreground mt-1">Faça o simulado completo hoje</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem estudo matinal hoje</p>
            )}
          </div>

          {/* Work Plan */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h2 className="font-display text-lg font-semibold">Treino no Trabalho</h2>
              <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full">Diário</span>
            </div>
            {todaySchedule.trabalho.length > 0 ? (
              <div className="space-y-3">
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
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{block.questoes}q</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem treino de trabalho hoje</p>
            )}
            {todaySchedule.revisao && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 mt-3">
                <RefreshCcw className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <p className="text-xs text-orange-700">{todaySchedule.revisao}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Weekly Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Próximos 7 Dias</h2>
        </div>
        <div className="space-y-2">
          {weeklySchedule.map((day) => {
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
                <div className="flex gap-1">
                  {day.manha.length > 0 && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  {day.trabalho.length > 0 && <Briefcase className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                {isToday && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Hoje</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Subjects status */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {(stats?.dominadas?.length ?? 0) > 0 && (
            <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-display text-base font-semibold">Matérias Dominadas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(stats.dominadas ?? []).map((m: string) => (
                  <span key={m} className="px-3 py-1.5 bg-green-500/10 text-green-700 text-xs font-medium rounded-full">{m}</span>
                ))}
              </div>
            </div>
          )}
          {(stats?.reforcar?.length ?? 0) > 0 && (
            <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-display text-base font-semibold">Matérias para Reforçar</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(stats.reforcar ?? []).map((m: string) => (
                  <span key={m} className="px-3 py-1.5 bg-orange-500/10 text-orange-700 text-xs font-medium rounded-full">{m}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
