'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Filter, Search, ChevronDown, Play, Hash, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { materiaColors } from '@/lib/theme-colors';
import { toast } from 'sonner';

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
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">
          📚 Banco de Questões
        </h1>
        <p className="text-muted-foreground mb-6">
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
          className={`p-3 rounded-xl text-center transition-all border ${
            !materia ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/30 hover:bg-muted/50'
          }`}
        >
          <p className="text-sm font-medium">Todas</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {Object.values(materiaTotals).reduce((a, b) => a + b, 0)} q
          </p>
        </button>
        {MATERIAS.map((m) => (
          <button
            key={m}
            onClick={() => { setMateria(m); setSubtema(''); }}
            className={`p-3 rounded-xl text-center transition-all border ${
              materia === m ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/30 hover:bg-muted/50'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mx-auto mb-1.5"
              style={{ backgroundColor: (materiaColors as any)[m] ?? '#888' }}
            />
            <p className="text-xs font-medium text-foreground">{m}</p>
            <p className="text-xs text-muted-foreground">{materiaTotals[m] ?? 0} q</p>
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
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Subtemas de {materia}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubtema('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !subtema ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Todos
            </button>
            {(subtemasData[materia] ?? []).map((st) => (
              <button
                key={st}
                onClick={() => setSubtema(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  subtema === st ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {st}
                <span className="ml-1 opacity-60">({counts[materia]?.[st] ?? 0})</span>
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
          className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-semibold mb-1">Gerar questões com IA</h3>
              <p className="text-sm text-muted-foreground">
                Poucas questões para essa matéria? A IA pode gerar questões estilo ENEM agora mesmo, com formula e explicação detalhada.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generateAIQuestions('facil')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              5 fáceis
            </button>
            <button
              onClick={() => generateAIQuestions('medio')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              5 médias
            </button>
            <button
              onClick={() => generateAIQuestions('dificil')}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={startFiltered}
          disabled={filtered.length === 0}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          Treinar ({filtered.length} questões)
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
            <p className="text-sm text-muted-foreground mt-1">Importe PDFs para adicionar questões ao banco</p>
          </div>
        ) : (
          filtered.slice(0, 50).map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 1, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: (materiaColors as any)[q.materia] ?? '#888' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: (materiaColors as any)[q.materia] ?? '#888' }}>{q.materia}</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{q.subtema}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      q.dificuldade === 'facil' ? 'bg-green-600 text-white' :
                      q.dificuldade === 'dificil' ? 'bg-red-600 text-white' :
                      'bg-amber-600 text-white'
                    }`}>
                      {q.dificuldade === 'facil' ? 'Fácil' : q.dificuldade === 'dificil' ? 'Difícil' : 'Médio'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{q.enunciado}</p>
                  {q.origem && (
                    <p className="text-xs text-muted-foreground mt-1">Origem: {q.origem}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        {filtered.length > 50 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Mostrando 50 de {filtered.length} questões. Use os filtros para refinar.
          </p>
        )}
      </div>
    </div>
  );
}
