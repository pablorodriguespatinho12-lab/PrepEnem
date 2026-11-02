'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, BookOpen, CheckCircle2, XCircle, RefreshCcw, Search, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { materiaColors } from '@/lib/theme-colors';
import { EsqueletoLista } from '@/components/esqueletos';
import { VoltarAoTreino } from '@/components/treino/voltar-ao-treino';
import Link from 'next/link';

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
      <VoltarAoTreino />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-6 h-6 text-primary-text" />
          <h1 className="font-display type-headline font-bold tracking-tight">Caderno de Erros</h1>
        </div>
        <p className="type-meta text-muted-foreground mb-6">Revise as questões que você errou e acompanhe sua evolução</p>
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
            className="w-full pl-10 pr-4 py-2.5 border border-input rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] type-meta focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={materiaFilter}
          onChange={(e) => setMateriaFilter(e.target.value)}
          className="px-3 py-2.5 border border-input rounded-[var(--radius-control)] bg-[hsl(var(--surface-2))] type-meta focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas as matérias</option>
          {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {loading ? (
        <EsqueletoLista rotulo="Carregando seus erros" linhas={5} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'hsl(var(--success))' }} />
          {(erros ?? []).length === 0 ? (
            <>
              <p className="font-display type-lead font-semibold">Ainda não há erro para refazer</p>
              <p className="type-meta text-muted-foreground mb-4">Quando você errar uma questão no treino, ela aparece aqui.</p>
              <Link href="/provas" className="inline-flex items-center px-5 py-2.5 rounded-[var(--radius-control)] bg-primary text-primary-foreground type-meta font-medium">Ir para o Treino</Link>
            </>
          ) : (
            <p className="font-display type-lead font-semibold">Nenhum erro com essa busca</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length > 1 && (
            <button
              onClick={() => {
                const ids = filtered.map((e: any) => e?.question?.id).filter(Boolean).join(',');
                router.push(`/treino?mode=erros&questionIds=${ids}`);
              }}
              className="w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] type-meta font-medium hover:opacity-90 transition-opacity duration-micro shadow-elev-2 flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Revisar todos os erros (<span data-numeric>{filtered.length}</span> questões)
            </button>
          )}
          {filtered.map((item: any, i: number) => (
            <motion.div
              key={item?.question?.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-1 rounded-[var(--radius-surface)] p-5 t-lift hover:-translate-y-px hover:shadow-elev-2"
            >
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-3 type-meta text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                    style={{ backgroundColor: materiaColors[item?.question?.materia] ?? 'hsl(var(--muted-foreground))' }}
                  />
                  {item?.question?.materia ?? ''}
                </span>
                <span aria-hidden className="w-px h-3 bg-border shrink-0" />
                <span className="px-2 py-0.5 rounded-[var(--radius-data)] bg-muted">
                  {item?.question?.subtema ?? ''}
                </span>
                {item?.dominada && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-data)] font-medium"
                    style={{ backgroundColor: 'hsl(var(--success-surface))', color: 'hsl(var(--success))' }}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} /> Dominada
                  </span>
                )}
                <span
                  data-numeric
                  className="px-2 py-0.5 rounded-[var(--radius-data)] font-medium"
                  style={{ backgroundColor: 'hsl(var(--danger-surface))', color: 'hsl(var(--danger))' }}
                >
                  {item?.erros ?? 0}x errada
                </span>
              </div>

              <p className="font-reading type-body measure-reading line-clamp-3 mb-3 text-foreground">{item?.question?.enunciado ?? ''}</p>

              <div className="flex flex-wrap items-center gap-4 type-meta mb-3">
                <span className="flex items-center gap-1" style={{ color: 'hsl(var(--danger))' }}>
                  <XCircle className="w-3.5 h-3.5" /> Sua: {item?.respostaDada ?? '-'}
                </span>
                <span className="flex items-center gap-1" style={{ color: 'hsl(var(--success))' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correta: {item?.question?.respostaCorreta ?? '-'}
                </span>
                <span className="text-muted-foreground">
                  Última: {item?.ultimaTentativa ? new Date(item.ultimaTentativa).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>

              {item?.explicacaoEstudante && (
                <div className="bg-primary/5 rounded-[var(--radius-control)] p-3 mb-3">
                  <p className="type-caption text-primary-text mb-1">Sua explicação (Feynman)</p>
                  <p className="font-reading type-meta measure-reading text-foreground/80">{item.explicacaoEstudante}</p>
                </div>
              )}

              <button
                onClick={() => router.push(`/treino?mode=erros&questionIds=${item?.question?.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary-text type-meta font-medium rounded-[var(--radius-control)] hover:bg-primary/20 t-colors"
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
