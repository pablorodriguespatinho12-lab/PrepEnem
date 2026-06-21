'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trophy, CheckCircle, XCircle, Clock, Play, Trash2, BookOpen, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

export default function ProvasPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch('/api/provas/listar');
      const data = await res.json();
      setExams(data.exams || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta prova?')) return;
    try {
      await fetch(`/api/provas/${id}`, { method: 'DELETE' });
      toast.success('Prova excluída');
      fetchExams();
    } catch (e) {
      toast.error('Erro ao excluir');
    }
  };

  const nivelLabels: Record<string, { label: string; color: string; icon: any }> = {
    facil: { label: 'Fácil', color: 'from-emerald-500 to-green-600', icon: Sparkles },
    medio: { label: 'Médio', color: 'from-amber-500 to-orange-500', icon: Target },
    vestibular: { label: 'Vestibular', color: 'from-rose-500 to-red-600', icon: Trophy },
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Minhas Provas
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Crie provas personalizadas com o nível e matérias que você quer treinar
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/provas/criar')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Nova Prova
          </motion.button>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {[
          { label: 'Total de Provas', value: exams.length, icon: FileText, color: 'from-blue-500 to-cyan-500' },
          { label: 'Finalizadas', value: exams.filter((e) => e.status === 'finalizada').length, icon: CheckCircle, color: 'from-emerald-500 to-green-600' },
          { label: 'Em andamento', value: exams.filter((e) => e.status === 'em_andamento').length, icon: Clock, color: 'from-amber-500 to-orange-500' },
          {
            label: 'Média geral',
            value:
              exams.filter((e) => e.status === 'finalizada').length > 0
                ? Math.round(
                    (exams
                      .filter((e) => e.status === 'finalizada')
                      .reduce((acc, e) => acc + (e.totalQuestoes > 0 ? (e.acertos / e.totalQuestoes) * 100 : 0), 0) /
                      exams.filter((e) => e.status === 'finalizada').length) || 0
                  ) + '%'
                : '—',
            icon: Trophy,
            color: 'from-purple-500 to-fuchsia-500',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Exams list */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Carregando...</div>
      ) : exams.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-card border border-border rounded-3xl"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <FileText className="w-20 h-20 text-muted-foreground/40" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2">Nenhuma prova ainda</h3>
          <p className="text-muted-foreground mb-6">Crie sua primeira prova personalizada para começar a treinar</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/provas/criar')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Criar Prova
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {exams.map((exam, idx) => {
              const nivelInfo = nivelLabels[exam.nivel] || nivelLabels.medio;
              const NivelIcon = nivelInfo.icon;
              const pct = exam.totalQuestoes > 0 ? Math.round((exam.acertos / exam.totalQuestoes) * 100) : 0;
              const progress = exam.totalQuestoes > 0 ? Math.round((exam.currentIdx / exam.totalQuestoes) * 100) : 0;
              return (
                <motion.div
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  {/* Decorative gradient corner */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${nivelInfo.color} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${nivelInfo.color} text-white text-xs font-bold uppercase flex items-center gap-1.5 shadow-md`}>
                        <NivelIcon className="w-3.5 h-3.5" />
                        {nivelInfo.label}
                      </div>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{exam.nome}</h3>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(exam.materias || []).slice(0, 3).map((m: string) => (
                        <span
                          key={m}
                          className="text-[10px] px-2 py-0.5 rounded-md text-white font-semibold"
                          style={{ backgroundColor: materiaColors[m] || '#888' }}
                        >
                          {m}
                        </span>
                      ))}
                      {(exam.materias || []).length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                          +{exam.materias.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{exam.totalQuestoes} questões</span>
                      {exam.status === 'finalizada' && (
                        <span className="font-bold text-foreground">{pct}% acertos</span>
                      )}
                    </div>

                    {exam.status !== 'finalizada' && (
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r ${nivelInfo.color} rounded-full`}
                        />
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/provas/${exam.id}`)}
                      className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                        exam.status === 'finalizada'
                          ? 'bg-muted text-foreground hover:bg-muted/80'
                          : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg'
                      } transition-all`}
                    >
                      {exam.status === 'finalizada' ? (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Ver resultado
                        </>
                      ) : exam.status === 'em_andamento' ? (
                        <>
                          <Play className="w-4 h-4" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Começar
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
