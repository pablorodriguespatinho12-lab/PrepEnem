'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Layers, BookOpen, CheckCircle, AlertCircle, Loader2, Star,
  Search, ChevronLeft, ChevronRight, Calculator, Dna, FlaskConical,
  Zap, Landmark, Globe2, Brain, Users, BookText, X,
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
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-primary bg-clip-text text-transparent"
            >
              Flashcards
            </motion.h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {selectedMateria
                ? `Baralhos de ${selectedMateria}`
                : 'Escolha uma matéria para começar a estudar'}
            </p>
          </div>
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
            className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-border bg-card focus:border-cyan-500 outline-none transition-colors text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto" />
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
                  className="text-center py-20 bg-card border border-border rounded-3xl"
                >
                  <Layers className="w-20 h-20 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Nenhum resultado</h3>
                  <p className="text-muted-foreground">Tente buscar por outro termo</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredGroups.map((group, idx) => {
                    const cor = materiaColors[group.materia] || '#06b6d4';
                    const Icon = materiaIcons[group.materia] || BookOpen;
                    const progressPct =
                      group.totalCards > 0
                        ? Math.round((group.totalAcertos / group.totalCards) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={group.materia}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        onClick={() => {
                          setSelectedMateria(group.materia);
                          setSearchQuery('');
                        }}
                        className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group card-3d card-shine"
                      >
                        {/* Color band */}
                        <div className="h-2" style={{ backgroundColor: cor }} />

                        <div className="p-5">
                          {/* 3D Icon */}
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${cor}20` }}
                          >
                            <Subject3DIcon materia={group.materia} color={cor} size={48} />
                          </div>

                          {/* Subject name */}
                          <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                            {group.materia}
                          </h3>

                          {/* Stats */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {group.totalDecks} {group.totalDecks === 1 ? 'baralho' : 'baralhos'}
                            </span>
                            <span>•</span>
                            <span>{group.totalCards} cards</span>
                          </div>

                          {/* Progress */}
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPct}%` }}
                              transition={{ duration: 0.6, delay: 0.3 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: cor }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{progressPct}%</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 -mt-2"
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${materiaColors[selectedMateria] || '#06b6d4'}20` }}
                  >
                    <Subject3DIcon
                      materia={selectedMateria}
                      color={materiaColors[selectedMateria] || '#06b6d4'}
                      size={56}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMateria}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedGroup.totalDecks} {selectedGroup.totalDecks === 1 ? 'baralho' : 'baralhos'} • {selectedGroup.totalCards} cards
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
                  className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-border bg-card focus:border-cyan-500 outline-none transition-colors text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
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
                  className="text-center py-16 bg-card border border-border rounded-3xl"
                >
                  <Layers className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum baralho encontrado</h3>
                  <p className="text-muted-foreground text-sm">Tente buscar por outro termo</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedDecks.map((deck, idx) => {
                    const cor = deck.cor || materiaColors[deck.materia] || '#06b6d4';
                    const progressPct =
                      deck.totalCards > 0 ? Math.round((deck.acertos / deck.totalCards) * 100) : 0;
                    return (
                      <motion.div
                        key={deck.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group card-3d card-shine"
                        onClick={() => router.push(`/flashcards/${deck.id}`)}
                      >
                        {/* Color band */}
                        <div className="h-2" style={{ backgroundColor: cor }} />

                        <div className="p-5">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-md text-white font-bold uppercase tracking-wider"
                              style={{ backgroundColor: cor }}
                            >
                              {deck.materia}
                            </span>
                            {deck.isDefault && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-current" /> Padrão
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {deck.subtema || deck.nome}
                          </h3>
                          {deck.descricao && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{deck.descricao}</p>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-3 mb-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Layers className="w-3.5 h-3.5" />
                              {deck.totalCards} cards
                            </span>
                            {deck.acertos > 0 && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {deck.acertos}
                              </span>
                            )}
                            {deck.erros > 0 && (
                              <span className="flex items-center gap-1 text-rose-600">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {deck.erros}
                              </span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPct}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: cor }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-muted-foreground">{progressPct}% dominado</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
