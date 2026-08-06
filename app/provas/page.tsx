'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trophy, CheckCircle, XCircle, Clock, Play, Trash2, BookOpen, Sparkles, Target, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

/* Limiares de dado esparso — mesma regra usada em app/dashboard/page.tsx.
   < 5 questões: sem %. 5–15: % com indicador de baixa confiança. 15+: limpa. */
const MIN_QUESTOES_PARA_TAXA = 5;
const LIMIAR_BAIXA_CONFIANCA = 15;

const nivelLabels: Record<string, { label: string; dotColor: string; icon: any }> = {
  facil: { label: 'Fácil', dotColor: 'hsl(var(--chart-2))', icon: Sparkles },
  medio: { label: 'Médio', dotColor: 'hsl(var(--chart-5))', icon: Target },
  vestibular: { label: 'Vestibular', dotColor: 'hsl(var(--chart-4))', icon: Trophy },
};

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

  const finalizadas = exams.filter((e) => e.status === 'finalizada');
  const finalizadasTotalQuestoes = finalizadas.reduce((acc, e) => acc + (e.totalQuestoes || 0), 0);
  const finalizadasAcertos = finalizadas.reduce((acc, e) => acc + (e.acertos || 0), 0);
  const mediaSparse = finalizadasTotalQuestoes < MIN_QUESTOES_PARA_TAXA;
  const mediaLowConfidence = !mediaSparse && finalizadasTotalQuestoes < LIMIAR_BAIXA_CONFIANCA;
  const mediaPct = finalizadasTotalQuestoes > 0 ? Math.round((finalizadasAcertos / finalizadasTotalQuestoes) * 100) : 0;

  const statCards = [
    { key: 'total', label: 'Total de provas', value: exams.length, icon: FileText },
    { key: 'finalizadas', label: 'Finalizadas', value: finalizadas.length, icon: CheckCircle },
    { key: 'andamento', label: 'Em andamento', value: exams.filter((e) => e.status === 'em_andamento').length, icon: Clock },
    { key: 'media', label: 'Média geral', value: `${mediaPct}%`, icon: Trophy },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display type-display font-semibold text-foreground">
              Minhas Provas
            </h1>
            <p className="text-muted-foreground mt-2 type-lead">
              Crie provas personalizadas com o nível e matérias que você quer treinar
            </p>
          </div>
          <button
            onClick={() => router.push('/provas/criar')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nova Prova
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="flex items-stretch divide-x divide-border surface-1 rounded-[var(--radius-surface)] mb-10 overflow-x-auto"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isMedia = stat.key === 'media';
          return (
            <div key={stat.label} className="flex items-center gap-2.5 px-4 py-3.5 flex-1 min-w-[150px]">
              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p data-numeric className="font-display type-lead font-semibold flex items-center gap-1">
                  {isMedia && mediaSparse ? '—' : stat.value}
                  {isMedia && mediaLowConfidence && (
                    <AlertCircle
                      className="w-3 h-3 text-muted-foreground"
                      aria-label="Amostra pequena: a média ainda pode mudar bastante"
                    />
                  )}
                </p>
                <p className="type-caption text-muted-foreground truncate">
                  {isMedia
                    ? mediaSparse
                      ? 'poucos dados'
                      : `${stat.label} · ${finalizadasTotalQuestoes}`
                    : stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Exams list */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground type-meta">Carregando...</div>
      ) : exams.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 surface-1 rounded-[var(--radius-container)]"
        >
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display type-title font-semibold mb-2">Nenhuma prova ainda</h3>
          <p className="text-muted-foreground mb-6">Crie sua primeira prova personalizada para começar a treinar</p>
          <button
            onClick={() => router.push('/provas/criar')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3"
          >
            <Plus className="w-4 h-4" />
            Criar Prova
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {exams.map((exam, idx) => {
              const nivelInfo = nivelLabels[exam.nivel] || nivelLabels.medio;
              const NivelIcon = nivelInfo.icon;
              const isFinalizada = exam.status === 'finalizada';
              const totalQuestoes = exam.totalQuestoes || 0;
              const acertos = exam.acertos || 0;
              const sparse = isFinalizada && totalQuestoes < MIN_QUESTOES_PARA_TAXA;
              const lowConfidence = isFinalizada && !sparse && totalQuestoes < LIMIAR_BAIXA_CONFIANCA;
              const pct = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;
              const progress = totalQuestoes > 0 ? exam.currentIdx / totalQuestoes : 0;
              return (
                <motion.div
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(idx, 6) * 0.04 }}
                  className="surface-1 rounded-[var(--radius-surface)] p-5 t-lift hover:shadow-elev-3"
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className="inline-flex items-center gap-1.5 type-meta font-medium text-foreground">
                      <span
                        aria-hidden
                        className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                        style={{ backgroundColor: nivelInfo.dotColor }}
                      />
                      <NivelIcon className="w-3.5 h-3.5" style={{ color: nivelInfo.dotColor }} />
                      {nivelInfo.label}
                    </span>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      aria-label="Excluir prova"
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[var(--radius-control)] t-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-display type-title font-semibold text-foreground mb-2 line-clamp-2">{exam.nome}</h3>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3 type-meta text-muted-foreground">
                    {(exam.materias || []).slice(0, 3).map((m: string, i: number) => (
                      <span key={m} className="inline-flex items-center gap-1.5">
                        {i > 0 && <span aria-hidden className="text-border">/</span>}
                        <span
                          aria-hidden
                          className="w-1.5 h-1.5 rounded-[var(--radius-data)] shrink-0"
                          style={{ backgroundColor: materiaColors[m] ?? 'hsl(var(--muted-foreground))' }}
                        />
                        {m}
                      </span>
                    ))}
                    {(exam.materias || []).length > 3 && <span>+{exam.materias.length - 3}</span>}
                  </div>

                  <div className="flex items-center justify-between type-meta text-muted-foreground mb-3">
                    <span data-numeric>{totalQuestoes} questões</span>
                    {isFinalizada && (
                      <span data-numeric className="inline-flex items-center gap-1 font-medium text-foreground">
                        {sparse ? '—' : `${pct}% acertos`}
                        {lowConfidence && (
                          <AlertCircle
                            className="w-3 h-3 text-muted-foreground"
                            aria-label="Poucas questões: percentual pouco confiável"
                          />
                        )}
                      </span>
                    )}
                  </div>

                  {!isFinalizada && (
                    <div className="h-1 bg-muted rounded-[var(--radius-data)] overflow-hidden mb-3" role="presentation">
                      <div
                        className="h-full bg-primary origin-left transition-transform duration-medium ease-out-quart"
                        style={{ transform: `scaleX(${progress})` }}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => router.push(`/provas/${exam.id}`)}
                    className={`w-full py-2.5 rounded-[var(--radius-control)] font-medium type-meta flex items-center justify-center gap-2 t-colors ${
                      isFinalizada
                        ? 'bg-muted text-foreground hover:bg-secondary'
                        : 'bg-primary text-primary-foreground shadow-elev-1 hover:shadow-elev-2'
                    }`}
                  >
                    {isFinalizada ? (
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
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
