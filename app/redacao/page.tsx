'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  PenTool, FileText, Clock, CheckCircle2, Loader2, ChevronLeft,
  Send, BookOpen, History, Star, AlertTriangle, BarChart3, RefreshCcw,
  Sparkles, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

type View = 'home' | 'write' | 'history' | 'result' | 'saved';

export default function RedacaoPage() {
  const [view, setView] = useState<View>('home');
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [texto, setTexto] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [essays, setEssays] = useState<any[]>([]);
  const [currentEssay, setCurrentEssay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [customTema, setCustomTema] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load saved drafts from localStorage
  const loadSavedDrafts = useCallback(() => {
    try {
      const saved = localStorage.getItem('redacao_saved_list');
      if (saved) {
        setSavedDrafts(JSON.parse(saved));
      }
    } catch (e) { /* ignore */ }
  }, []);

  // Save current essay to saved list
  const saveEssay = useCallback(() => {
    if (!selectedTheme || texto.trim().length < 10) {
      toast.error('Escreva pelo menos 10 caracteres para salvar');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('redacao_saved_list') || '[]');
      const id = `draft_${Date.now()}`;
      const draft = {
        id,
        tema: selectedTheme.tema,
        theme: selectedTheme,
        texto: texto.trim(),
        wordCount: texto.trim().split(/\s+/).filter(Boolean).length,
        savedAt: new Date().toISOString(),
      };
      // Check if we're editing an existing saved draft
      const editingIdx = existing.findIndex((d: any) => d.id === (selectedTheme as any)?._draftId);
      if (editingIdx >= 0) {
        existing[editingIdx] = { ...draft, id: existing[editingIdx].id };
      } else {
        existing.unshift(draft);
      }
      localStorage.setItem('redacao_saved_list', JSON.stringify(existing.slice(0, 50))); // max 50
      setSavedDrafts(existing.slice(0, 50));
      setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      toast.success('Redação salva!');
    } catch (e) {
      toast.error('Erro ao salvar');
    }
  }, [selectedTheme, texto]);

  const fetchThemes = useCallback(async () => {
    try {
      const res = await fetch('/api/redacao/themes');
      const data = await res.json();
      setThemes(data?.themes ?? []);
    } catch (e) { console.error(e); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/redacao/history');
      const data = await res.json();
      setEssays(data?.essays ?? []);
    } catch (e) { console.error(e); }
  }, []);

  // Restore draft from localStorage on mount
  useEffect(() => {
    Promise.all([fetchThemes(), fetchHistory()]).then(() => {
      setLoading(false);
      loadSavedDrafts();
      try {
        const saved = localStorage.getItem('redacao_draft');
        if (saved) {
          const draft = JSON.parse(saved);
          if (draft.texto && draft.theme) {
            setTexto(draft.texto);
            setSelectedTheme(draft.theme);
            setView('write');
            toast.success('Rascunho restaurado! Continue de onde parou.');
          }
        }
      } catch (e) { /* ignore */ }
    });
  }, [fetchThemes, fetchHistory, loadSavedDrafts]);

  // Auto-save draft to localStorage when writing
  useEffect(() => {
    if (view === 'write' && selectedTheme && texto.trim().length > 0) {
      const timeout = setTimeout(() => {
        try {
          localStorage.setItem('redacao_draft', JSON.stringify({ texto, theme: selectedTheme }));
        } catch (e) { /* ignore */ }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [texto, selectedTheme, view]);

  // Clear draft when essay is submitted successfully
  const clearDraft = useCallback(() => {
    try { localStorage.removeItem('redacao_draft'); } catch (e) { /* ignore */ }
  }, []);

  // Poll for evaluation result
  useEffect(() => {
    if (!polling || !currentEssay?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/redacao/history?id=${currentEssay.id}`);
        const data = await res.json();
        if (data?.essay?.status === 'avaliada') {
          setCurrentEssay(data.essay);
          setPolling(false);
          fetchHistory();
        }
      } catch (e) { console.error(e); }
    }, 5000);
    return () => clearInterval(interval);
  }, [polling, currentEssay?.id, fetchHistory]);

  const handleSubmit = async () => {
    if (!selectedTheme || texto.trim().length < 100) {
      toast.error('Escreva pelo menos 100 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      const isCustom = selectedTheme._custom === true;
      const payload: any = { texto };
      if (isCustom) {
        payload.customTema = selectedTheme.tema;
      } else {
        payload.themeId = selectedTheme.id;
      }
      const res = await fetch('/api/redacao/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.essayId) {
        toast.success('Redação enviada! A IA está avaliando...');
        setCurrentEssay({ id: data.essayId, status: 'avaliando' });
        setPolling(true);
        setView('result');
        setTexto('');
        clearDraft();
      } else {
        toast.error(data?.error || 'Erro ao enviar');
      }
    } catch (e) {
      toast.error('Erro ao enviar redação');
    } finally {
      setSubmitting(false);
    }
  };

  const viewEssay = async (essayId: string) => {
    try {
      const res = await fetch(`/api/redacao/history?id=${essayId}`);
      const data = await res.json();
      if (data?.essay) {
        setCurrentEssay(data.essay);
        setView('result');
        if (data.essay.status !== 'avaliada') setPolling(true);
      }
    } catch (e) {
      toast.error('Erro ao carregar redação');
    }
  };

  const wordCount = texto.trim().split(/\s+/).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ==== RESULT VIEW ====
  if (view === 'result' && currentEssay) {
    const isEvaluating = currentEssay.status !== 'avaliada';
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => { setView('home'); setPolling(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        {isEvaluating ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">A IA está avaliando sua redação...</h2>
            <p className="text-sm text-muted-foreground">Isso pode levar até 1 minuto. Você pode sair e voltar depois — a avaliação continua em segundo plano.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score Header */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-xl text-white ${
                  (currentEssay.notaTotal ?? 0) >= 800 ? 'bg-green-500' : (currentEssay.notaTotal ?? 0) >= 600 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {currentEssay.notaTotal ?? 0}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold">{currentEssay.theme?.tema ?? 'Redação'}</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentEssay.theme?.anoEnem ? `ENEM ${currentEssay.theme.anoEnem}` : ''} • {new Date(currentEssay.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Score bars */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: 'C1', nota: currentEssay.notaC1 },
                  { label: 'C2', nota: currentEssay.notaC2 },
                  { label: 'C3', nota: currentEssay.notaC3 },
                  { label: 'C4', nota: currentEssay.notaC4 },
                  { label: 'C5', nota: currentEssay.notaC5 },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <div className="text-xs font-medium text-muted-foreground mb-1">{c.label}</div>
                    <div className="h-20 bg-muted rounded-lg relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full rounded-lg transition-all ${
                          (c.nota ?? 0) >= 160 ? 'bg-green-500' : (c.nota ?? 0) >= 120 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ height: `${((c.nota ?? 0) / 200) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-bold mt-1">{c.nota ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full evaluation */}
            {currentEssay.avaliacao && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
                <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Avaliação Completa
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MathText text={currentEssay.avaliacao} />
                </div>
              </div>
            )}

            {/* Original text */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Seu Texto
              </h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-xl p-4">
                {currentEssay.texto}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ==== WRITE VIEW ====
  if (view === 'write' && selectedTheme) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        {/* Theme header */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
          <h2 className="font-display text-lg font-bold mb-1">{selectedTheme.tema}</h2>
          {selectedTheme.anoEnem && (
            <span className="text-xs text-muted-foreground">ENEM {selectedTheme.anoEnem}</span>
          )}
          {selectedTheme.textoMotivador && (
            <details className="mt-3">
              <summary className="text-sm text-primary font-medium cursor-pointer hover:underline">Ver textos motivadores</summary>
              <div className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap bg-muted/50 rounded-lg p-3 max-h-64 overflow-y-auto">
                {selectedTheme.textoMotivador}
              </div>
            </details>
          )}
        </div>

        {/* Editor */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Sua redação</span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{wordCount} palavras</span>
            </div>
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva sua redação aqui...\n\nLembre-se da estrutura:\n- Introdução com tese\n- Desenvolvimento 1 (argumento)\n- Desenvolvimento 2 (argumento)\n- Conclusão com proposta de intervenção"
            className="w-full min-h-[400px] p-4 bg-background text-sm leading-relaxed resize-y focus:outline-none"
            style={{ fontFamily: 'serif', lineHeight: '1.8' }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveEssay}
            disabled={wordCount < 5}
            className="px-5 py-3 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 disabled:opacity-40 transition flex items-center justify-center gap-2 border border-border"
          >
            <FileText className="w-4 h-4" /> Salvar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || wordCount < 20}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-40 transition shadow-md flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar para Correção</>}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          {lastSaved ? `✅ Último salvamento: ${lastSaved} • ` : ''}A IA avaliará sua redação nas 5 competências do ENEM.
        </p>
      </div>
    );
  }

  // ==== HISTORY VIEW ====
  if (view === 'history') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Histórico de Redações
        </h2>

        {essays.length === 0 ? (
          <div className="text-center py-12">
            <PenTool className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma redação escrita ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {essays.map((e: any) => (
              <button
                key={e.id}
                onClick={() => viewEssay(e.id)}
                className="w-full bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{e.theme?.tema ?? 'Redação'}</span>
                  {e.status === 'avaliada' ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                      (e.notaTotal ?? 0) >= 800 ? 'bg-green-500' : (e.notaTotal ?? 0) >= 600 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>{e.notaTotal ?? 0}/1000</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Avaliando
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {e.theme?.anoEnem ? `ENEM ${e.theme.anoEnem} • ` : ''}
                  {new Date(e.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==== SAVED VIEW ====
  if (view === 'saved') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Redações Salvas
        </h2>

        {savedDrafts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma redação salva</p>
            <p className="text-xs text-muted-foreground mt-1">Ao escrever, clique em "Salvar" para guardar seu rascunho</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedDrafts.map((d: any) => (
              <div key={d.id} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{d.tema}</span>
                  <span className="text-xs text-muted-foreground">{d.wordCount} palavras</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {d.texto.slice(0, 150)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(d.savedAt).toLocaleDateString('pt-BR')} às {new Date(d.savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        try {
                          const list = JSON.parse(localStorage.getItem('redacao_saved_list') || '[]');
                          const filtered = list.filter((x: any) => x.id !== d.id);
                          localStorage.setItem('redacao_saved_list', JSON.stringify(filtered));
                          setSavedDrafts(filtered);
                          toast.success('Redação removida');
                        } catch (e) {}
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTheme({ ...d.theme, _draftId: d.id });
                        setTexto(d.texto);
                        setView('write');
                      }}
                      className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg font-medium hover:opacity-90"
                    >
                      Continuar Escrevendo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==== HOME VIEW ====
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Treino de Redação</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Pratique com temas reais do ENEM e receba correção detalhada por IA nas 5 competências</p>

        {/* Stats */}
        {essays.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-primary">{essays.length}</p>
              <p className="text-xs text-muted-foreground">Redações</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-primary">
                {essays.filter((e: any) => e.status === 'avaliada').length > 0
                  ? Math.round(essays.filter((e: any) => e.status === 'avaliada').reduce((s: number, e: any) => s + (e.notaTotal ?? 0), 0) / essays.filter((e: any) => e.status === 'avaliada').length)
                  : '-'}
              </p>
              <p className="text-xs text-muted-foreground">Média</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.max(0, ...essays.filter((e: any) => e.status === 'avaliada').map((e: any) => e.notaTotal ?? 0)) || '-'}
              </p>
              <p className="text-xs text-muted-foreground">Melhor</p>
            </div>
          </div>
        )}

        {/* Treino por Partes */}
        <button
          onClick={() => window.location.href = '/redacao/partes'}
          className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20 shadow-sm hover:shadow-md transition text-left mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-base">Treino por Partes</h3>
              <p className="text-xs text-muted-foreground">Pratique Introdução, Desenvolvimento e Conclusão separadamente com feedback da IA</p>
            </div>
          </div>
        </button>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setView('history')}
            className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition text-left"
          >
            <History className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-display font-bold text-sm">Histórico</h3>
            <p className="text-xs text-muted-foreground">Correções anteriores</p>
          </button>
          <button
            onClick={() => { loadSavedDrafts(); setView('saved'); }}
            className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition text-left"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-display font-bold text-sm">Redações Salvas {savedDrafts.length > 0 && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">{savedDrafts.length}</span>}</h3>
            <p className="text-xs text-muted-foreground">Rascunhos guardados</p>
          </button>
          <button
            onClick={() => { fetchHistory(); toast.info('Atualizado!'); }}
            className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition text-left"
          >
            <RefreshCcw className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-display font-bold text-sm">Atualizar</h3>
            <p className="text-xs text-muted-foreground">Verificar correções</p>
          </button>
        </div>

        {/* Theme selection */}
        <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Escolha um Tema
        </h2>

        <div className="space-y-3">
          {/* Custom theme card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 overflow-hidden"
          >
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="w-full p-5 text-left flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-display font-bold text-sm">Tema Livre</h3>
                </div>
                <p className="text-xs text-muted-foreground">Escreva sobre qualquer assunto que você quiser treinar</p>
              </div>
              <Plus className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transition-transform ${showCustomInput ? 'rotate-45' : ''}`} />
            </button>

            <AnimatePresence>
              {showCustomInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3">
                    <input
                      type="text"
                      value={customTema}
                      onChange={(e) => setCustomTema(e.target.value)}
                      placeholder="Ex: A importância da leitura na formação cidadã"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={200}
                    />
                    <button
                      onClick={() => {
                        if (customTema.trim().length < 5) {
                          toast.error('Digite um tema com pelo menos 5 caracteres');
                          return;
                        }
                        setSelectedTheme({ tema: customTema.trim(), _custom: true });
                        setTexto('');
                        setView('write');
                        setShowCustomInput(false);
                      }}
                      disabled={customTema.trim().length < 5}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2"
                    >
                      <PenTool className="w-4 h-4" /> Começar a Escrever
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {themes.map((theme: any) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => { setSelectedTheme(theme); setTexto(''); setView('write'); }}
              className="w-full bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-sm mb-1">{theme.tema}</h3>
                  {theme.anoEnem && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      ENEM {theme.anoEnem}
                    </span>
                  )}
                </div>
                <PenTool className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
