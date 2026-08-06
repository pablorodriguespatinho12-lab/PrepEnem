'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  PenTool, ChevronLeft, Loader2, Send, Star, BarChart3,
  BookOpen, RefreshCcw, CheckCircle2, ArrowRight, Sparkles, FileText,
  Lightbulb, Search, Target, Info
} from 'lucide-react';
import { toast } from 'sonner';

const MathText = dynamic(() => import('@/components/math-text'), { ssr: false });

type PartType = 'introducao' | 'desenvolvimento1' | 'desenvolvimento2' | 'conclusao';
type View = 'home' | 'exercise' | 'result';

const PARTS: { type: PartType; label: string; icon: typeof FileText; description: string }[] = [
  { type: 'introducao', label: 'Introdução', icon: FileText, description: 'Apresentar tema, contextualizar e formular tese' },
  { type: 'desenvolvimento1', label: 'Desenvolvimento 1', icon: Lightbulb, description: 'Primeiro argumento com fundamentação' },
  { type: 'desenvolvimento2', label: 'Desenvolvimento 2', icon: Search, description: 'Segundo argumento com repertório' },
  { type: 'conclusao', label: 'Conclusão', icon: Target, description: 'Retomar tese e proposta de intervenção' },
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
  const CurrentPartIcon = currentPartInfo?.icon;

  // ==== RESULT VIEW ====
  if (view === 'result' && result && currentPartInfo) {
    return (
      <div className="p-4 md:p-8 max-w-[46rem] mx-auto">
        <button onClick={() => { setView('home'); setResult(null); }} className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          {/* Score */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-[var(--radius-control)] flex items-center justify-center font-display type-title font-semibold flex-shrink-0"
                style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
              >
                <span data-numeric>{result.nota}/10</span>
              </div>
              <div>
                <h2 className="font-display type-lead font-semibold flex items-center gap-2">
                  {CurrentPartIcon && <CurrentPartIcon className="w-5 h-5 text-primary" />} {currentPartInfo.label}
                </h2>
                <p className="type-meta text-muted-foreground">{exercise?.tema}</p>
              </div>
            </div>
          </div>

          {/* Feedback — conteúdo gerado por IA é conteúdo de leitura. */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6">
            <h3 className="font-display type-body font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Feedback da IA
            </h3>
            <div className="prose-reading whitespace-pre-wrap">
              <MathText text={result.feedback} />
            </div>
          </div>

          {/* User's text */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6">
            <h3 className="font-display type-body font-semibold mb-3">Seu Texto</h3>
            <div className="prose-reading whitespace-pre-wrap bg-muted/50 rounded-[var(--radius-control)] p-4">
              {resposta}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setView('exercise'); setResult(null); }}
              className="py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3 flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Refazer
            </button>
            <button
              onClick={() => startExercise(selectedPart!)}
              className="py-3 surface-1 rounded-[var(--radius-control)] font-medium type-meta t-colors hover:bg-muted flex items-center justify-center gap-2"
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
      <div className="p-4 md:p-8 max-w-[46rem] mx-auto">
        <button onClick={() => setView('home')} className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          {/* Header */}
          <div className="surface-1 rounded-[var(--radius-surface)] p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 type-meta font-semibold rounded-[var(--radius-data)] bg-primary/10 text-primary">
                {CurrentPartIcon && <CurrentPartIcon className="w-3.5 h-3.5" />} {currentPartInfo.label}
              </span>
            </div>
            <h2 className="font-display type-lead font-semibold mb-1">{exercise.tema}</h2>
            {exercise.textosMotivadores && (
              <details className="mt-3">
                <summary className="type-meta text-primary font-medium cursor-pointer hover:underline underline-offset-4">Ver textos motivadores</summary>
                <div className="prose-reading text-foreground/80 whitespace-pre-wrap bg-muted/50 rounded-[var(--radius-control)] p-3 mt-2 max-h-48 overflow-y-auto">
                  {exercise.textosMotivadores}
                </div>
              </details>
            )}
          </div>

          {/* Texto base (existing parts) */}
          {exercise.textoBase && (
            <div className="bg-muted/30 rounded-[var(--radius-surface)] p-5 border border-border mb-4">
              <h3 className="type-meta font-semibold mb-2 text-muted-foreground">Texto já escrito:</h3>
              <div className="prose-reading whitespace-pre-wrap">
                {exercise.textoBase}
              </div>
            </div>
          )}

          {/* Instruction */}
          <div className="bg-primary/5 rounded-[var(--radius-control)] p-4 border border-primary/10 mb-4 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="type-meta font-medium text-primary">{exercise.instrucao}</p>
          </div>

          {/* Editor */}
          <div className="surface-1 rounded-[var(--radius-surface)] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
              <span className="type-caption text-muted-foreground">Sua {currentPartInfo.label}</span>
              <span data-numeric className="type-meta text-muted-foreground">{wordCount} palavras</span>
            </div>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder={`Escreva sua ${currentPartInfo.label.toLowerCase()} aqui...`}
              className="block w-full max-w-[var(--measure-reading)] mx-auto min-h-[250px] p-4 bg-[hsl(var(--surface-2))] font-reading text-body leading-[var(--lh-reading)] resize-y focus:outline-none"
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
              className="px-5 py-3 bg-muted text-foreground rounded-[var(--radius-control)] font-medium type-meta hover:bg-secondary t-colors disabled:opacity-40 flex items-center gap-2 border border-border"
            >
              <FileText className="w-4 h-4" /> Salvar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || wordCount < 10}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-40 disabled:shadow-elev-1 flex items-center justify-center gap-2"
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
      <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar para Redação
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="w-6 h-6 text-primary" />
          <h1 className="font-display type-headline font-bold">Treino por Partes</h1>
        </div>
        <p className="type-meta text-muted-foreground mb-6">Pratique cada parte da redação separadamente e receba feedback da IA</p>

        <div className="space-y-4">
          {PARTS.map((part) => {
            const partStats = stats[part.type];
            const Icon = part.icon;
            const isLoadingThis = loading && selectedPart === part.type;
            return (
              <motion.button
                key={part.type}
                whileHover={{ scale: 1.005 }}
                onClick={() => startExercise(part.type)}
                disabled={isLoadingThis}
                className="w-full bg-[hsl(var(--surface-2))] rounded-[var(--radius-control)] p-5 border border-border shadow-elev-1 t-lift hover:border-primary/45 hover:shadow-elev-2 hover:-translate-y-px text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-control)] bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display type-body font-semibold">{part.label}</h3>
                    <p className="type-meta text-muted-foreground">{part.description}</p>
                    {partStats && (
                      <div className="flex items-center gap-3 mt-1.5 type-meta text-muted-foreground">
                        <span data-numeric>{partStats.total} treinos</span>
                        <span data-numeric className="font-semibold text-foreground">
                          Média: {partStats.avgNota}/10
                        </span>
                        {partStats.lastNota != null && (
                          <span data-numeric>Última: {partStats.lastNota}/10</span>
                        )}
                      </div>
                    )}
                  </div>
                  {isLoadingThis ? (
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
