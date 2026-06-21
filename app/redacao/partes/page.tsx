'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  PenTool, ChevronLeft, Loader2, Send, Star, BarChart3,
  BookOpen, RefreshCcw, CheckCircle2, ArrowRight, Sparkles, FileText
} from 'lucide-react';
import { toast } from 'sonner';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

type PartType = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';
type View = 'home' | 'exercise' | 'result';

const PARTS: { type: PartType; label: string; emoji: string; description: string; color: string }[] = [
  { type: 'introducao', label: 'Introdução', emoji: '📝', description: 'Apresentar tema, contextualizar e formular tese', color: 'bg-blue-500' },
  { type: 'desenvolvimento1', label: 'Desenvolvimento 1', emoji: '💡', description: 'Primeiro argumento com fundamentação', color: 'bg-green-500' },
  { type: 'desenvolvimento2', label: 'Desenvolvimento 2', emoji: '🔍', description: 'Segundo argumento com repertório', color: 'bg-purple-500' },
  { type: 'conclusao', label: 'Conclusão', emoji: '🎯', description: 'Retomar tese e proposta de intervenção', color: 'bg-orange-500' },
];

export default function RedacaoPartesPage() {
  const [view, setView] = useState<View>('home');
  const [selectedPart, setSelectedPart] = useState<PartType | null>(null);
  const [exercise, setExercise] = useState<any>(null);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [stats, setStats] = useState<Record<string, { total: number; avgNota: number; lastNota: number | null }>>({});

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/redacao/parts/history');
      const data = await res.json();
      setStats(data?.stats ?? {});
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const startExercise = async (partType: PartType) => {
    setSelectedPart(partType);
    setLoading(true);
    setResposta('');
    setResult(null);
    try {
      const res = await fetch('/api/redacao/parts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partType }),
      });
      const data = await res.json();
      if (data?.tema) {
        setExercise(data);
        setView('exercise');
      } else {
        toast.error(data?.error || 'Erro ao gerar exercício');
      }
    } catch (e) {
      toast.error('Erro ao gerar exercício');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!exercise || !resposta.trim() || resposta.trim().length < 50) {
      toast.error('Escreva pelo menos 50 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/redacao/parts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partType: selectedPart,
          tema: exercise.tema,
          textoBase: exercise.textoBase,
          resposta,
        }),
      });
      const data = await res.json();
      if (data?.feedback) {
        setResult(data);
        setView('result');
        fetchStats();
      } else {
        toast.error(data?.error || 'Erro ao avaliar');
      }
    } catch (e) {
      toast.error('Erro ao enviar');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = resposta.trim().split(/\s+/).filter(Boolean).length;
  const currentPartInfo = PARTS.find(p => p.type === selectedPart);

  // ==== RESULT VIEW ====
  if (view === 'result' && result && currentPartInfo) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => { setView('home'); setResult(null); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Score */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-2xl text-white ${
                (result.nota ?? 0) >= 8 ? 'bg-green-500' : (result.nota ?? 0) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {result.nota}/10
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">{currentPartInfo.emoji} {currentPartInfo.label}</h2>
                <p className="text-sm text-muted-foreground">{exercise?.tema}</p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Feedback da IA
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              <MathText text={result.feedback} />
            </div>
          </div>

          {/* User's text */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
            <h3 className="font-display text-base font-bold mb-3">Seu Texto</h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/50 rounded-xl p-4">
              {resposta}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setView('exercise'); setResult(null); }}
              className="py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Refazer
            </button>
            <button
              onClick={() => startExercise(selectedPart!)}
              className="py-3 bg-card border border-border rounded-xl font-medium text-sm hover:bg-muted transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Novo Exercício
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==== EXERCISE VIEW ====
  if (view === 'exercise' && exercise && currentPartInfo) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${currentPartInfo.color}`}>
                {currentPartInfo.emoji} {currentPartInfo.label}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold mb-1">{exercise.tema}</h2>
            {exercise.textosMotivadores && (
              <details className="mt-3">
                <summary className="text-sm text-primary font-medium cursor-pointer hover:underline">Ver textos motivadores</summary>
                <div className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap bg-muted/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {exercise.textosMotivadores}
                </div>
              </details>
            )}
          </div>

          {/* Texto base (existing parts) */}
          {exercise.textoBase && (
            <div className="bg-muted/30 rounded-2xl p-5 border border-border mb-4">
              <h3 className="text-sm font-bold mb-2 text-muted-foreground">Texto já escrito:</h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {exercise.textoBase}
              </div>
            </div>
          )}

          {/* Instruction */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mb-4">
            <p className="text-sm font-medium text-primary">📌 {exercise.instrucao}</p>
          </div>

          {/* Editor */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">Sua {currentPartInfo.label}</span>
              <span className="text-xs text-muted-foreground">{wordCount} palavras</span>
            </div>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder={`Escreva sua ${currentPartInfo.label.toLowerCase()} aqui...`}
              className="w-full min-h-[250px] p-4 bg-background text-sm leading-relaxed resize-y focus:outline-none"
              style={{ fontFamily: 'serif', lineHeight: '1.8' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (resposta.trim().length < 10) {
                  toast.error('Escreva pelo menos 10 caracteres');
                  return;
                }
                try {
                  const existing = JSON.parse(localStorage.getItem('redacao_saved_list') || '[]');
                  existing.unshift({
                    id: `draft_${Date.now()}`,
                    tema: `${currentPartInfo?.label}: ${exercise?.tema}`,
                    theme: { tema: exercise?.tema },
                    texto: resposta.trim(),
                    wordCount,
                    savedAt: new Date().toISOString(),
                  });
                  localStorage.setItem('redacao_saved_list', JSON.stringify(existing.slice(0, 50)));
                  toast.success('Redação salva!');
                } catch (e) { toast.error('Erro ao salvar'); }
              }}
              disabled={wordCount < 5}
              className="px-5 py-3 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 disabled:opacity-40 transition flex items-center gap-2 border border-border"
            >
              <FileText className="w-4 h-4" /> Salvar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || wordCount < 10}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-40 transition shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Avaliando...</> : <><Send className="w-4 h-4" /> Enviar para Correção</>}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==== HOME VIEW ====
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <button onClick={() => window.history.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar para Redação
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Treino por Partes</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Pratique cada parte da redação separadamente e receba feedback da IA</p>

        <div className="space-y-4">
          {PARTS.map((part) => {
            const partStats = stats[part.type];
            return (
              <motion.button
                key={part.type}
                whileHover={{ scale: 1.01 }}
                onClick={() => startExercise(part.type)}
                disabled={loading && selectedPart === part.type}
                className="w-full bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${part.color} flex items-center justify-center text-xl text-white`}>
                    {part.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base">{part.label}</h3>
                    <p className="text-xs text-muted-foreground">{part.description}</p>
                    {partStats && (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">{partStats.total} treinos</span>
                        <span className={`text-xs font-semibold ${partStats.avgNota >= 7 ? 'text-green-600' : partStats.avgNota >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                          Média: {partStats.avgNota}/10
                        </span>
                        {partStats.lastNota != null && (
                          <span className="text-xs text-muted-foreground">Última: {partStats.lastNota}/10</span>
                        )}
                      </div>
                    )}
                  </div>
                  {loading && selectedPart === part.type ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
