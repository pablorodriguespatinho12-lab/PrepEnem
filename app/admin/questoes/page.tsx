'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Plus, Edit2, Trash2, Save, X, BookOpen, Search, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

const MATERIAS = ['Matemática', 'Português', 'Biologia', 'Química', 'Física', 'História', 'Geografia', 'Filosofia', 'Sociologia'];
const DIFICULDADES = ['facil', 'medio', 'dificil'];
const DIFICULDADE_LABELS: Record<string, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

const emptyQuestion = {
  enunciado: '', alternativaA: '', alternativaB: '', alternativaC: '',
  alternativaD: '', alternativaE: '', respostaCorreta: 'A',
  materia: 'Matemática', subtema: '', dificuldade: 'medio', explicacao: '', origem: '',
};

export default function AdminQuestoesPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyQuestion });
  const [searchTerm, setSearchTerm] = useState('');
  const [materiaFilter, setMateriaFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (materiaFilter) params.set('materia', materiaFilter);
      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  }, [materiaFilter]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    if (!isAdmin && session) {
      router.replace('/dashboard');
    }
  }, [isAdmin, session, router]);

  const handleSave = async () => {
    if (!form.enunciado || !form.alternativaA) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/questions/${editId}` : '/api/questions';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editId ? 'Questão atualizada!' : 'Questão criada!');
        setShowForm(false);
        setEditId(null);
        setForm({ ...emptyQuestion });
        fetchQuestions();
      } else {
        const err = await res.json();
        toast.error(err?.error ?? 'Erro');
      }
    } catch { toast.error('Erro ao salvar'); } finally { setSaving(false); }
  };

  const handleEdit = (q: any) => {
    setForm({
      enunciado: q?.enunciado ?? '',
      alternativaA: q?.alternativaA ?? '',
      alternativaB: q?.alternativaB ?? '',
      alternativaC: q?.alternativaC ?? '',
      alternativaD: q?.alternativaD ?? '',
      alternativaE: q?.alternativaE ?? '',
      respostaCorreta: q?.respostaCorreta ?? 'A',
      materia: q?.materia ?? 'Matemática',
      subtema: q?.subtema ?? '',
      dificuldade: q?.dificuldade ?? 'medio',
      explicacao: q?.explicacao ?? '',
      origem: q?.origem ?? '',
    });
    setEditId(q?.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta questão?')) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Questão excluída');
        fetchQuestions();
      }
    } catch { toast.error('Erro ao excluir'); }
  };

  const filtered = (questions ?? []).filter((q: any) => {
    if (searchTerm) {
      return q?.enunciado?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        q?.subtema?.toLowerCase()?.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Gerenciar Questões</h1>
              <p className="text-sm text-muted-foreground">{questions?.length ?? 0} questões cadastradas</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyQuestion }); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Nova Questão
          </button>
        </div>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 shadow-lg border border-border w-full max-w-2xl mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">
                  {editId ? 'Editar Questão' : 'Nova Questão'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Enunciado *</label>
                  <textarea
                    value={form.enunciado}
                    onChange={(e) => setForm({ ...form, enunciado: e.target.value })}
                    className="w-full p-3 border border-input rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={4}
                  />
                </div>

                {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                  <div key={letter}>
                    <label className="text-xs font-medium">Alternativa {letter} *</label>
                    <input
                      value={(form as any)[`alternativa${letter}`] ?? ''}
                      onChange={(e) => setForm({ ...form, [`alternativa${letter}`]: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium">Resposta Correta</label>
                    <select
                      value={form.respostaCorreta}
                      onChange={(e) => setForm({ ...form, respostaCorreta: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    >
                      {['A', 'B', 'C', 'D', 'E'].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Matéria</label>
                    <select
                      value={form.materia}
                      onChange={(e) => setForm({ ...form, materia: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    >
                      {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Dificuldade</label>
                    <select
                      value={form.dificuldade}
                      onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    >
                      {DIFICULDADES.map((d) => <option key={d} value={d}>{DIFICULDADE_LABELS[d]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Subtema</label>
                    <input
                      value={form.subtema}
                      onChange={(e) => setForm({ ...form, subtema: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium">Explicação</label>
                  <textarea
                    value={form.explicacao}
                    onChange={(e) => setForm({ ...form, explicacao: e.target.value })}
                    className="w-full p-3 border border-input rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium">Origem</label>
                  <input
                    value={form.origem}
                    onChange={(e) => setForm({ ...form, origem: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                    placeholder="Ex: ENEM 2023, Elaboração própria"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar questões..."
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={materiaFilter}
          onChange={(e) => setMateriaFilter(e.target.value)}
          className="px-3 py-2.5 border border-input rounded-lg bg-background text-sm"
        >
          <option value="">Todas</option>
          {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q: any, i: number) => (
            <motion.div
              key={q?.id ?? i}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-600">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: materiaColors[q?.materia] ?? '#666' }} />
                      {q?.materia}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                      {q?.subtema}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      q?.dificuldade === 'facil' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                      q?.dificuldade === 'dificil' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' :
                      'bg-amber-100 text-amber-800 dark:bg-yellow-500/20 dark:text-yellow-300'
                    }`}>
                      {DIFICULDADE_LABELS[q?.dificuldade] ?? q?.dificuldade}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-200 text-green-900 dark:bg-green-500/20 dark:text-green-300">
                      Resp: {q?.respostaCorreta}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{q?.enunciado}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 rounded-lg hover:bg-muted transition"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(q?.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
