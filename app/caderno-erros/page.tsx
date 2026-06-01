'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, BookOpen, CheckCircle2, XCircle, RefreshCcw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { materiaColors } from '@/lib/theme-colors';

const MATERIAS = ['Matemática', 'Português', 'Biologia', 'Química', 'Física', 'História', 'Geografia', 'Filosofia', 'Sociologia'];

export default function CadernoErrosPage() {
  const router = useRouter();
  const [erros, setErros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [materiaFilter, setMateriaFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchErros = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (materiaFilter) params.set('materia', materiaFilter);
      const res = await fetch(`/api/caderno-erros?${params.toString()}`);
      const data = await res.json();
      setErros(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [materiaFilter]);

  useEffect(() => {
    fetchErros();
  }, [fetchErros]);

  const filtered = (erros ?? []).filter((e: any) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        e?.question?.enunciado?.toLowerCase()?.includes(term) ||
        e?.question?.subtema?.toLowerCase()?.includes(term)
      );
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Caderno de Erros</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Revise as questões que você errou e acompanhe sua evolução</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por enunciado ou subtema..."
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={materiaFilter}
          onChange={(e) => setMateriaFilter(e.target.value)}
          className="px-3 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas as matérias</option>
          {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-display text-lg font-semibold">Nenhum erro encontrado!</p>
          <p className="text-sm text-muted-foreground">Continue assim 🚀</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length > 1 && (
            <button
              onClick={() => {
                const ids = filtered.map((e: any) => e?.question?.id).filter(Boolean).join(',');
                router.push(`/treino?mode=erros&questionIds=${ids}`);
              }}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Revisar todos os erros ({filtered.length} questões)
            </button>
          )}
          {filtered.map((item: any, i: number) => (
            <motion.div
              key={item?.question?.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: materiaColors[item?.question?.materia] ?? '#888' }}
                >
                  {item?.question?.materia ?? ''}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {item?.question?.subtema ?? ''}
                </span>
                {item?.dominada && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-700">
                    ✓ Dominada
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-700">
                  {item?.erros ?? 0}x errada
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-3 line-clamp-3">{item?.question?.enunciado ?? ''}</p>

              <div className="flex items-center gap-4 text-xs mb-3">
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-3.5 h-3.5" /> Sua: {item?.respostaDada ?? '-'}
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correta: {item?.question?.respostaCorreta ?? '-'}
                </span>
                <span className="text-muted-foreground">
                  Última: {item?.ultimaTentativa ? new Date(item.ultimaTentativa).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>

              {item?.explicacaoEstudante && (
                <div className="bg-primary/5 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-primary mb-1">Sua explicação (Feynman):</p>
                  <p className="text-xs text-foreground/70">{item.explicacaoEstudante}</p>
                </div>
              )}

              <button
                onClick={() => router.push(`/treino?mode=erros&questionIds=${item?.question?.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition"
              >
                <RefreshCcw className="w-3 h-3" /> Revisar até acertar
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
