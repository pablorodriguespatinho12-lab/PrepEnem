'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Layers, BookOpen, CheckCircle, AlertCircle, Loader2, Star,
  Search, ChevronLeft, ChevronRight, Calculator, Dna, FlaskConical,
  Zap, Landmark, Globe2, Brain, Users, BookText, X, Plus,
} from 'lucide-react';
import { materiaColors } from '@/lib/theme-colors';

const Subject3DIcon = dynamic(() => import('@/components/subject-3d-icon'), { ssr: false });

const materiaIcons: Record<string, any> = {
  'Matemática': Calculator,
  'Português': BookOpen,
  'Literatura': BookText,
  'Biologia': Dna,
  'Química': FlaskConical,
  'Física': Zap,
  'História': Landmark,
  'Geografia': Globe2,
  'Filosofia': Brain,
  'Sociologia': Users,
};

const materiaOrder = [
  'Português', 'Literatura',
  'História', 'Geografia', 'Filosofia', 'Sociologia',
  'Biologia', 'Química', 'Física',
  'Matemática',
];

interface DeckInfo {
  id: string;
  nome: string;
  materia: string;
  subtema: string | null;
  descricao: string | null;
  cor: string | null;
  isDefault: boolean;
  totalCards: number;
  acertos: number;
  erros: number;
  restantes: number;
}

interface MateriaGroup {
  materia: string;
  decks: DeckInfo[];
  totalCards: number;
  totalAcertos: number;
  totalDecks: number;
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDecks = useCallback(async () => {
    try {
      const res = await fetch('/api/flashcards/decks');
      const data = await res.json();
      setDecks(data.decks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Group decks by matéria
  const materiaGroups = useMemo(() => {
    const groups: Record<string, MateriaGroup> = {};
    decks.forEach((d) => {
      if (!groups[d.materia]) {
        groups[d.materia] = {
          materia: d.materia,
          decks: [],
          totalCards: 0,
          totalAcertos: 0,
          totalDecks: 0,
        };
      }
      groups[d.materia].decks.push(d);
      groups[d.materia].totalCards += d.totalCards;
      groups[d.materia].totalAcertos += d.acertos;
      groups[d.materia].totalDecks += 1;
    });
    // Sort by predefined order
    return materiaOrder
      .filter((m) => groups[m])
      .map((m) => groups[m])
      .concat(
        Object.keys(groups)
          .filter((m) => !materiaOrder.includes(m))
          .map((m) => groups[m])
      );
  }, [decks]);

  // Search filter
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return materiaGroups;
    const q = searchQuery.toLowerCase();
    return materiaGroups
      .map((g) => ({
        ...g,
        decks: g.decks.filter(
          (d) =>
            d.nome.toLowerCase().includes(q) ||
            d.materia.toLowerCase().includes(q) ||
            (d.subtema && d.subtema.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.decks.length > 0);
  }, [materiaGroups, searchQuery]);

  // Decks for selected matéria (filtered by search too)
  const selectedDecks = useMemo(() => {
    if (!selectedMateria) return [];
    const q = searchQuery.toLowerCase();
    const group = materiaGroups.find((g) => g.materia === selectedMateria);
    if (!group) return [];
    if (!q) return group.decks;
    return group.decks.filter(
      (d) =>
        d.nome.toLowerCase().includes(q) ||
        (d.subtema && d.subtema.toLowerCase().includes(q))
    );
  }, [selectedMateria, materiaGroups, searchQuery]);

  const selectedGroup = materiaGroups.find((g) => g.materia === selectedMateria);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="type-headline">Flashcards</h1>
            <p className="type-lead text-muted-foreground mt-2">
              {selectedMateria
                ? `Baralhos de ${selectedMateria}`
                : 'Escolha uma matéria para começar a estudar'}
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/flashcards/criar')}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift hover:shadow-elev-3 self-start"
          >
            <Plus className="w-4 h-4" />
            Novo Baralho
          </motion.button>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar baralho por nome ou tema..."
            className="w-full pl-12 pr-10 py-3 type-meta rounded-[var(--radius-control)] border border-input bg-[hsl(var(--surface-1))] t-colors focus:outline-none focus:border-primary hover:border-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-[var(--radius-control)] t-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-text mx-auto" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!selectedMateria ? (
            /* ===== LEVEL 1: MATÉRIA CARDS ===== */
            <motion.div
              key="materias"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {filteredGroups.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 surface-1 rounded-[var(--radius-container)]"
                >
                  <Layers className="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="type-headline mb-2">Nenhum resultado</h3>
                  <p className="type-body text-muted-foreground">Tente buscar por outro termo</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredGroups.map((group) => {
                    const cor = materiaColors[group.materia] || '#06b6d4';
                    const progressPct =
                      group.totalCards > 0
                        ? Math.round((group.totalAcertos / group.totalCards) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={group.materia}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        onClick={() => {
                          setSelectedMateria(group.materia);
                          setSearchQuery('');
                        }}
                        className="relative surface-1 rounded-[var(--radius-surface)] overflow-hidden cursor-pointer group card-3d t-lift hover:shadow-elev-3"
                      >
                        {/* Color band */}
                        <div className="h-2" style={{ backgroundColor: cor }} />

                        <div className="p-5">
                          {/* 3D Icon */}
                          <div
                            className="w-14 h-14 rounded-[var(--radius-control)] flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${cor}20` }}
                          >
                            <Subject3DIcon materia={group.materia} color={cor} size={48} />
                          </div>

                          {/* Subject name */}
                          <h3 className="type-lead text-foreground mb-1 group-hover:text-primary-text t-colors">
                            {group.materia}
                          </h3>

                          {/* Stats */}
                          <div className="flex items-center gap-2 type-meta text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              <span data-numeric>{group.totalDecks}</span> {group.totalDecks === 1 ? 'baralho' : 'baralhos'}
                            </span>
                            <span aria-hidden>•</span>
                            <span data-numeric>{group.totalCards} cards</span>
                          </div>

                          {/* Progress */}
                          <div className="h-1.5 bg-muted rounded-[var(--radius-data)] overflow-hidden">
                            <div
                              className="h-full origin-left rounded-[var(--radius-data)] transition-transform duration-medium ease-out-quart"
                              style={{ transform: `scaleX(${progressPct / 100})`, backgroundColor: cor }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <span data-numeric className="type-caption text-muted-foreground">{progressPct}%</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground t-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* ===== LEVEL 2: DECKS DENTRO DA MATÉRIA ===== */
            <motion.div
              key="decks"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
            >
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -4 }}
                onClick={() => {
                  setSelectedMateria(null);
                  setSearchQuery('');
                }}
                className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6 -mt-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Todas as matérias
              </motion.button>

              {/* Matéria header */}
              {selectedGroup && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-[var(--radius-container)] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${materiaColors[selectedMateria] || '#06b6d4'}20` }}
                  >
                    <Subject3DIcon
                      materia={selectedMateria}
                      color={materiaColors[selectedMateria] || '#06b6d4'}
                      size={56}
                    />
                  </div>
                  <div>
                    <h2 className="type-headline">{selectedMateria}</h2>
                    <p className="type-meta text-muted-foreground">
                      <span data-numeric>{selectedGroup.totalDecks}</span> {selectedGroup.totalDecks === 1 ? 'baralho' : 'baralhos'} · <span data-numeric>{selectedGroup.totalCards}</span> cards
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Search within matéria */}
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Buscar em ${selectedMateria}...`}
                  className="w-full pl-12 pr-10 py-3 type-meta rounded-[var(--radius-control)] border border-input bg-[hsl(var(--surface-1))] t-colors focus:outline-none focus:border-primary hover:border-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-[var(--radius-control)] t-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Decks grid */}
              {selectedDecks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 surface-1 rounded-[var(--radius-container)]"
                >
                  <Layers className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="type-title mb-2">Nenhum baralho encontrado</h3>
                  <p className="type-body text-muted-foreground">Tente buscar por outro termo</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedDecks.map((deck) => {
                    const cor = deck.cor || materiaColors[deck.materia] || '#06b6d4';
                    const progressPct =
                      deck.totalCards > 0 ? Math.round((deck.acertos / deck.totalCards) * 100) : 0;
                    return (
                      <motion.div
                        key={deck.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="relative surface-1 rounded-[var(--radius-surface)] overflow-hidden cursor-pointer group card-3d t-lift hover:shadow-elev-3"
                        onClick={() => router.push(`/flashcards/${deck.id}`)}
                      >
                        {/* Color band */}
                        <div className="h-2" style={{ backgroundColor: cor }} />

                        <div className="p-5">
                          {/* Procedência: ponto de cor + nome, não pílula preenchida com
                              texto branco (contraste reprova — ver MIGRACAO.md §4). */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3 type-meta text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                              <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)] shrink-0" style={{ backgroundColor: cor }} />
                              {deck.materia}
                            </span>
                            {deck.isDefault && (
                              <>
                                <span aria-hidden className="text-border">/</span>
                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                  <Star className="w-3 h-3 fill-current" /> Padrão
                                </span>
                              </>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="type-lead text-foreground mb-1 line-clamp-2 group-hover:text-primary-text t-colors">
                            {deck.subtema || deck.nome}
                          </h3>
                          {deck.descricao && (
                            <p className="type-meta text-muted-foreground mb-3 line-clamp-2">{deck.descricao}</p>
                          )}

                          {/* Stats — verde/vermelho aqui são legítimos: expressam
                              acerto e erro, via tokens semânticos. */}
                          <div className="flex items-center gap-3 mb-3 type-meta">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Layers className="w-3.5 h-3.5" />
                              <span data-numeric>{deck.totalCards}</span> cards
                            </span>
                            {deck.acertos > 0 && (
                              <span className="flex items-center gap-1" style={{ color: 'hsl(var(--success))' }}>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span data-numeric>{deck.acertos}</span>
                              </span>
                            )}
                            {deck.erros > 0 && (
                              <span className="flex items-center gap-1" style={{ color: 'hsl(var(--danger))' }}>
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span data-numeric>{deck.erros}</span>
                              </span>
                            )}
                          </div>

                          {/* Progress bar — escala no eixo X, sem animar width. */}
                          <div className="h-1.5 bg-muted rounded-[var(--radius-data)] overflow-hidden">
                            <div
                              className="h-full origin-left rounded-[var(--radius-data)] transition-transform duration-medium ease-out-quart"
                              style={{ transform: `scaleX(${progressPct / 100})`, backgroundColor: cor }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span data-numeric className="type-caption text-muted-foreground">{progressPct}% dominado</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground t-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
