'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Filter, Search, ChevronDown, Play, Hash, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { materiaColors } from '@/lib/theme-colors';
import { ETAPA_LABEL, etapaDaQuestao } from '@/lib/treino-etapas';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// O enunciado tem fórmula em $...$: em <p> cru aparecia "$\\log_2$" (passeio do iniciante, 02/11/2026).
const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

const MATERIAS = [
  'Matemática', 'Português', 'Biologia', 'Química', 'Física',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'
];

export default function BancoQuestoesPage() {
  const router = useRouter();
  const [materia, setMateria] = useState('');
  const [subtema, setSubtema] = useState('');
  const [subtemasData, setSubtemasData] = useState<Record<string, string[]>>({});
  const [counts, setCounts] = useState<Record<string, Record<string, number>>>({});
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubtemas = useCallback(async () => {
    try {
      const res = await fetch('/api/questions/subtemas');
      const data = await res.json();
      setSubtemasData(data.subtemas ?? {});
      setCounts(data.counts ?? {});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (materia) params.set('materia', materia);
      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(data.questions ?? data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [materia]);

  useEffect(() => {
    fetchSubtemas();
  }, [fetchSubtemas]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Filter questions
  const filtered = questions.filter((q) => {
    if (subtema && q.subtema !== subtema) return false;
    if (search) {
      const s = search.toLowerCase();
      return q.enunciado?.toLowerCase().includes(s) || q.subtema?.toLowerCase().includes(s);
    }
    return true;
  });

  // Compute total per materia from subtemasData counts
  const materiaTotals: Record<string, number> = {};
  for (const m of MATERIAS) {
    materiaTotals[m] = Object.values(counts[m] ?? {}).reduce((a, b) => a + b, 0);
  }

  const [generating, setGenerating] = useState(false);

  const startFiltered = () => {
    const params = new URLSearchParams();
    params.set('mode', 'filtered');
    if (materia) params.set('materia', materia);
    if (subtema) params.set('subtema', subtema);
    router.push(`/treino?${params.toString()}`);
  };

  const generateAIQuestions = async (dificuldade: 'facil' | 'medio' | 'dificil') => {
    if (!materia) {
      toast.error('Selecione uma matéria primeiro');
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/questions/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materia, subtema: subtema || undefined, dificuldade, quantidade: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      toast.success(`${data.total} questões geradas pela IA!`);
      await fetchSubtemas();
      await fetchQuestions();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar questões');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-primary-text" />
          <h1 className="font-display type-headline font-bold tracking-tight">
            Banco de Questões
          </h1>
        </div>
        <p className="type-body text-muted-foreground mb-6">
          Filtre por matéria e subtema, depois inicie um treino personalizado.
        </p>
      </motion.div>

      {/* Materia Grid */}
      <motion.div
        initial={{ opacity: 1, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6"
      >
        <button
          onClick={() => { setMateria(''); setSubtema(''); }}
          className={`p-3 rounded-[var(--radius-control)] text-center border t-colors ${
            !materia ? 'border-primary bg-primary/10 shadow-elev-1' : 'border-border hover:border-primary/30 hover:bg-muted/50'
          }`}
        >
          <p className="type-meta font-medium">Todas</p>
          <p data-numeric className="type-caption text-muted-foreground mt-0.5">
            {Object.values(materiaTotals).reduce((a, b) => a + b, 0)} q
          </p>
        </button>
        {MATERIAS.map((m) => (
          <button
            key={m}
            onClick={() => { setMateria(m); setSubtema(''); }}
            className={`p-3 rounded-[var(--radius-control)] text-center border t-colors ${
              materia === m ? 'border-primary bg-primary/10 shadow-elev-1' : 'border-border hover:border-primary/30 hover:bg-muted/50'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mx-auto mb-1.5"
              style={{ backgroundColor: (materiaColors as any)[m] ?? '#888' }}
            />
            <p className="type-meta font-medium text-foreground">{m}</p>
            <p data-numeric className="type-caption text-muted-foreground">{materiaTotals[m] ?? 0} q</p>
          </button>
        ))}
      </motion.div>

      {/* Subtema Filter */}
      {materia && (subtemasData[materia]?.length ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <p className="type-meta font-semibold text-foreground mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Subtemas de {materia}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubtema('')}
              className={`px-3 py-1.5 rounded-[var(--radius-control)] type-meta font-medium t-colors ${
                !subtema ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              Todos
            </button>
            {(subtemasData[materia] ?? []).map((st) => (
              <button
                key={st}
                onClick={() => setSubtema(st)}
                className={`px-3 py-1.5 rounded-[var(--radius-control)] type-meta font-medium t-colors ${
                  subtema === st ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {st}
                <span data-numeric className="ml-1 opacity-60">({counts[materia]?.[st] ?? 0})</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Generate CTA - only when materia is selected */}
      {materia && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-primary/5 border border-primary/20 rounded-[var(--radius-surface)] p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-[var(--radius-control)] bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-text" />
            </div>
            <div className="flex-1">
              <h3 className="font-display type-lead font-semibold mb-1">Gerar questões com IA</h3>
              <p className="type-meta text-muted-foreground">
                Poucas questões para essa matéria? A IA pode gerar questões estilo ENEM agora mesmo, com formula e explicação detalhada.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generateAIQuestions('facil')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-control)] type-meta font-medium bg-muted text-foreground hover:bg-muted/80 t-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              5 fáceis
            </button>
            <button
              onClick={() => generateAIQuestions('medio')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-control)] type-meta font-medium bg-muted text-foreground hover:bg-muted/80 t-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              5 médias
            </button>
            <button
              onClick={() => generateAIQuestions('dificil')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-control)] type-meta font-medium bg-muted text-foreground hover:bg-muted/80 t-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              5 difíceis
            </button>
          </div>
        </motion.div>
      )}

      {/* Search + Action */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar questões..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] border border-input type-meta focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={startFiltered}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 transition-opacity duration-micro disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          Treinar (<span data-numeric>{filtered.length}</span> questões)
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma questão encontrada</p>
            <p className="type-meta text-muted-foreground mt-1">Importe PDFs para adicionar questões ao banco</p>
          </div>
        ) : (
          filtered.slice(0, 50).map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-1 rounded-[var(--radius-surface)] p-4 t-lift hover:-translate-y-px hover:shadow-elev-2"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: (materiaColors as any)[q.materia] ?? '#888' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-2.5 gap-y-1 mb-1.5 flex-wrap type-meta text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <span
                        aria-hidden
                        className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                        style={{ backgroundColor: (materiaColors as any)[q.materia] ?? 'hsl(var(--muted-foreground))' }}
                      />
                      {q.materia}
                    </span>
                    <span aria-hidden className="w-px h-3 bg-border shrink-0" />
                    <span>{q.subtema}</span>
                    <span
                      className="type-caption px-2 py-0.5 rounded-[var(--radius-data)] bg-muted text-muted-foreground"
                    >
                      {ETAPA_LABEL[etapaDaQuestao(q)]}
                    </span>
                  </div>
                  <div className="font-reading type-body measure-reading line-clamp-2 text-foreground"><MathText text={q.enunciado} /></div>
                  {q.origem && (
                    <p className="type-micro text-muted-foreground mt-1">Origem: {q.origem}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        {filtered.length > 50 && (
          <p className="text-center type-meta text-muted-foreground py-4">
            Mostrando 50 de <span data-numeric>{filtered.length}</span> questões. Use os filtros para refinar.
          </p>
        )}
      </div>
    </div>
  );
}
