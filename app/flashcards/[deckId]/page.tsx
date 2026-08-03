'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, CheckCircle, XCircle, RotateCw, Trophy, Lightbulb, Loader2, RefreshCw, Sparkles, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { playSound } from '@/lib/sounds';

interface CardCandidato {
  frente: string;
  verso: string;
  dica: string | null;
}

/* ── Adicionar card manualmente ── */
function AdicionarCardDialog({
  open,
  onOpenChange,
  deckId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deckId: string;
  onSaved: () => void;
}) {
  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  const [dica, setDica] = useState('');
  const [salvando, setSalvando] = useState(false);

  const reset = () => {
    setFrente('');
    setVerso('');
    setDica('');
  };

  const handleSalvar = async () => {
    if (!frente.trim() || !verso.trim()) {
      toast.error('Preencha a frente e o verso do card');
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch('/api/flashcards/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId,
          cards: [{ frente: frente.trim(), verso: verso.trim(), dica: dica.trim() || null }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar card');
        return;
      }
      toast.success('Card adicionado');
      playSound('cardSalvo');
      reset();
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error('Erro ao salvar card');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar card</DialogTitle>
          <DialogDescription>Frente e verso do flashcard.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Frente (pergunta)</label>
            <Textarea value={frente} onChange={(e) => setFrente(e.target.value)} rows={2} placeholder="Ex: O que é osmose?" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Verso (resposta)</label>
            <Textarea value={verso} onChange={(e) => setVerso(e.target.value)} rows={2} placeholder="Resposta curta e direta" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Dica (opcional)</label>
            <Input value={dica} onChange={(e) => setDica(e.target.value)} placeholder="Mnemônico ou pista" />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Salvar card
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Gerar cards com IA, com preview obrigatório antes de salvar ── */
function GerarComIADialog({
  open,
  onOpenChange,
  deckId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deckId: string;
  onSaved: () => void;
}) {
  const [etapa, setEtapa] = useState<'form' | 'preview'>('form');
  const [quantidade, setQuantidade] = useState(10);
  const [topico, setTopico] = useState('');
  const [gerando, setGerando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [candidatos, setCandidatos] = useState<CardCandidato[]>([]);
  const [descartadosPorDuplicata, setDescartadosPorDuplicata] = useState(0);

  const fecharEResetar = () => {
    onOpenChange(false);
    setEtapa('form');
    setTopico('');
    setCandidatos([]);
    setDescartadosPorDuplicata(0);
  };

  const handleGerar = async () => {
    setGerando(true);
    try {
      const res = await fetch('/api/flashcards/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId, quantidade, topico: topico.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao gerar cards');
        return;
      }
      if (!data.candidatos || data.candidatos.length === 0) {
        toast.error('A IA não gerou nenhum card novo (tudo parecido demais com o que já existe?)');
        return;
      }
      setCandidatos(data.candidatos);
      setDescartadosPorDuplicata(data.descartadosPorDuplicata ?? 0);
      setEtapa('preview');
    } catch {
      toast.error('Erro ao gerar cards');
    } finally {
      setGerando(false);
    }
  };

  const updateCandidato = (i: number, field: keyof CardCandidato, value: string) => {
    setCandidatos((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const descartarCandidato = (i: number) => {
    setCandidatos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSalvarAceitos = async () => {
    if (candidatos.length === 0) {
      toast.error('Nenhum card pra salvar');
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch('/api/flashcards/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId, cards: candidatos }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar cards');
        return;
      }
      toast.success(`${data.created} card${data.created !== 1 ? 's' : ''} salvo${data.created !== 1 ? 's' : ''}`);
      playSound('cardSalvo');
      fecharEResetar();
      onSaved();
    } catch {
      toast.error('Erro ao salvar cards');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : fecharEResetar())}>
      <DialogContent className={etapa === 'preview' ? 'max-w-2xl max-h-[85vh] overflow-y-auto' : undefined}>
        {etapa === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Gerar cards com IA</DialogTitle>
              <DialogDescription>Você revisa antes de salvar — nada é gravado automaticamente.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Sobre o que? (opcional — refina o foco da IA)
                </label>
                <Input
                  value={topico}
                  onChange={(e) => setTopico(e.target.value)}
                  placeholder="Ex: reações de eliminação, funções orgânicas..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Quantidade: {quantidade}
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={handleGerar}
                disabled={gerando}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {gerando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {gerando ? 'Gerando...' : 'Gerar'}
              </button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Revise antes de salvar</DialogTitle>
              <DialogDescription>
                {candidatos.length} card{candidatos.length !== 1 ? 's' : ''} pronto{candidatos.length !== 1 ? 's' : ''} para salvar
                {descartadosPorDuplicata > 0
                  ? ` — ${descartadosPorDuplicata} descartado${descartadosPorDuplicata !== 1 ? 's' : ''} automaticamente por serem parecidos demais com cards que já existem`
                  : ''}
                . Edite ou descarte cada um antes de confirmar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {candidatos.map((c, i) => (
                <div key={i} className="bg-muted/40 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Textarea
                      value={c.frente}
                      onChange={(e) => updateCandidato(i, 'frente', e.target.value)}
                      rows={2}
                      className="flex-1 text-sm font-medium"
                    />
                    <button
                      onClick={() => descartarCandidato(i)}
                      title="Descartar este card"
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Textarea
                    value={c.verso}
                    onChange={(e) => updateCandidato(i, 'verso', e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              ))}
              {candidatos.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Todos os cards foram descartados. Feche e gere novamente se quiser tentar de novo.
                </p>
              )}
            </div>
            <DialogFooter>
              <button
                onClick={handleSalvarAceitos}
                disabled={salvando || candidatos.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Salvar {candidatos.length} card{candidatos.length !== 1 ? 's' : ''}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function FlashcardDeckPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const deckId = params.deckId as string;
  const initialMode = (searchParams.get('mode') || 'todos') as 'todos' | 'revisar';
  const shouldReduceMotion = useReducedMotion();

  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [cardsToRevise, setCardsToRevise] = useState(0);
  const [cardsAcertados, setCardsAcertados] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'todos' | 'revisar'>(initialMode);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({ acertos: 0, erros: 0 });
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showGerarDialog, setShowGerarDialog] = useState(false);

  const fetchDeck = useCallback(
    async (m: 'todos' | 'revisar' = mode) => {
      try {
        const res = await fetch(`/api/flashcards/decks/${deckId}?mode=${m}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || 'Erro');
          router.push('/flashcards');
          return;
        }
        setDeck(data.deck);
        setCards(data.cards || []);
        setTotalCards(data.totalCards || 0);
        setCardsToRevise(data.cardsToRevise || 0);
        setCardsAcertados(data.cardsAcertados || 0);
        setCurrentIdx(0);
        setFlipped(false);
        setShowHint(false);
        setFinished(data.cards?.length === 0);
        setSessionStats({ acertos: 0, erros: 0 });
      } catch (e) {
        toast.error('Erro ao carregar baralho');
      } finally {
        setLoading(false);
      }
    },
    [deckId, mode, router]
  );

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, mode]);

  const handleAnswer = async (acertou: boolean) => {
    if (animating) return;
    setAnimating(true);
    setLastAnswer(acertou ? 'correct' : 'wrong');
    playSound(acertou ? 'acerto' : 'erro');
    const currentCard = cards[currentIdx];
    if (!currentCard) return;

    try {
      await fetch('/api/flashcards/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: currentCard.id, acertou }),
      });

      setSessionStats((s) => ({
        acertos: acertou ? s.acertos + 1 : s.acertos,
        erros: !acertou ? s.erros + 1 : s.erros,
      }));

      // Move to next card
      setTimeout(() => {
        if (currentIdx + 1 >= cards.length) {
          setFinished(true);
          playSound('sessaoConcluida');
        } else {
          setCurrentIdx((i) => i + 1);
          setFlipped(false);
          setShowHint(false);
        }
        setAnimating(false);
        setLastAnswer(null);
      }, 400);
    } catch (e) {
      toast.error('Erro ao salvar resposta');
      setAnimating(false);
      setLastAnswer(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!deck) return null;

  const cor = deck.cor || materiaColors[deck.materia] || '#06b6d4';
  const currentCard = cards[currentIdx];
  const progress = cards.length > 0 ? ((currentIdx + (finished ? 1 : 0)) / cards.length) * 100 : 0;

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-3xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => router.push('/flashcards')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-md text-white font-bold uppercase"
            style={{ backgroundColor: cor }}
          >
            {deck.materia}
          </span>
          {deck.subtema && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground font-bold">{deck.subtema}</span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{deck.nome}</h1>
      </motion.div>

      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setMode('todos')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            mode === 'todos' ? 'text-white shadow-md' : 'bg-card border border-border hover:bg-muted'
          }`}
          style={mode === 'todos' ? { backgroundColor: cor } : {}}
        >
          Estudar ({totalCards - cardsAcertados})
        </button>
        <button
          onClick={() => setMode('revisar')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-1 ${
            mode === 'revisar' ? 'bg-rose-500 text-white shadow-md' : 'bg-card border border-border hover:bg-muted'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Revisar erros ({cardsToRevise})
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-3 py-2 rounded-xl font-medium text-xs bg-card border border-border hover:bg-muted transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar card
        </button>
        <button
          onClick={() => setShowGerarDialog(true)}
          className="px-3 py-2 rounded-xl font-medium text-xs bg-card border border-border hover:bg-muted transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Gerar com IA
        </button>
      </div>

      {/* Progress */}
      {cards.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>
              Card {Math.min(currentIdx + 1, cards.length)} de {cards.length}
            </span>
            <div className="flex gap-3">
              <span className="text-emerald-600 font-bold">✓ {sessionStats.acertos}</span>
              <span className="text-rose-600 font-bold">✗ {sessionStats.erros}</span>
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: cor }}
            />
          </div>
        </div>
      )}

      {/* Card or Finished */}
      <div className="relative">
      <AnimatePresence mode="popLayout">
        {finished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: shouldReduceMotion ? 0 : -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { type: 'spring', delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Trophy className="w-20 h-20 text-amber-500" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              {cards.length === 0 ? 'Nada para estudar!' : 'Parabéns!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {cards.length === 0
                ? mode === 'revisar'
                  ? 'Você não tem cards marcados para revisão!'
                  : 'Você já dominou todos os cards deste baralho!'
                : `Você completou ${sessionStats.acertos + sessionStats.erros} cards nesta sessão.`}
            </p>

            {sessionStats.acertos + sessionStats.erros > 0 && (
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-3xl font-bold text-emerald-600">{sessionStats.acertos}</div>
                  <div className="text-xs text-muted-foreground">Acertos</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="text-3xl font-bold text-rose-600">{sessionStats.erros}</div>
                  <div className="text-xs text-muted-foreground">A revisar</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchDeck()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-md"
              >
                <RotateCw className="w-4 h-4" />
                Estudar Novamente
              </motion.button>
              {sessionStats.erros > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('revisar')}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  Revisar Erros
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGerarDialog(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-xl font-bold shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Gerar mais cards
              </motion.button>
            </div>
          </motion.div>
        ) : currentCard ? (
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -50 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.25 }}
          >
            {/* 3D flip card */}
            <div
              className="relative w-full mb-6 cursor-pointer select-none"
              style={{ perspective: '1500px', minHeight: '400px' }}
              onClick={() => setFlipped((f) => !f)}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }
                }
                style={{ transformStyle: 'preserve-3d', minHeight: '400px' }}
                className="relative w-full"
              >
                {/* Front */}
                <div
                  className="absolute inset-0 w-full rounded-3xl shadow-xl flex flex-col items-center justify-center text-white p-8 md:p-10"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: `linear-gradient(135deg, ${cor}, ${cor}dd)`,
                    minHeight: '400px',
                  }}
                >
                  <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider opacity-70">Pergunta</div>
                  <div className="text-xl md:text-2xl font-semibold text-center leading-relaxed">{currentCard.frente}</div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-70">Toque para ver a resposta</div>
                  {currentCard.dica && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint((h) => !h);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      aria-label="Mostrar dica"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 w-full rounded-3xl shadow-xl flex flex-col items-center justify-center bg-card border-4 p-8 md:p-10"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderColor: cor,
                    minHeight: '400px',
                  }}
                >
                  <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Resposta</div>
                  <div className="text-lg md:text-xl text-foreground text-center leading-relaxed font-medium">{currentCard.verso}</div>
                  {currentCard.dica && (
                    <div className="mt-4 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2 max-w-md">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{currentCard.dica}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">Toque para virar</div>
                </div>
              </motion.div>
            </div>

            {/* Hint overlay (front side only) */}
            {!flipped && currentCard.dica && (
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 mx-auto max-w-md px-4 py-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2"
                  >
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{currentCard.dica}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Action buttons - shown when flipped */}
            <AnimatePresence>
              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={
                      !shouldReduceMotion && lastAnswer === 'wrong' ? { scale: [1, 1.12, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={() => handleAnswer(false)}
                    disabled={animating}
                    className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-2xl font-bold shadow-lg transition-shadow ${
                      lastAnswer === 'wrong'
                        ? 'ring-4 ring-rose-300 shadow-xl'
                        : lastAnswer === 'correct'
                        ? 'opacity-40'
                        : 'hover:shadow-xl disabled:opacity-50'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    Errei
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={
                      !shouldReduceMotion && lastAnswer === 'correct' ? { scale: [1, 1.12, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onClick={() => handleAnswer(true)}
                    disabled={animating}
                    className={`flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold shadow-lg transition-shadow ${
                      lastAnswer === 'correct'
                        ? 'ring-4 ring-emerald-300 shadow-xl'
                        : lastAnswer === 'wrong'
                        ? 'opacity-40'
                        : 'hover:shadow-xl disabled:opacity-50'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Acertei
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl">
            <h3 className="text-2xl font-bold mb-2">Baralho vazio</h3>
            <p className="text-muted-foreground mb-6">Este baralho ainda não tem flashcards.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-border rounded-xl font-bold hover:border-primary/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar manualmente
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGerarDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold"
              >
                <Sparkles className="w-4 h-4" />
                Gerar com IA
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>
      </div>

      <AdicionarCardDialog open={showAddDialog} onOpenChange={setShowAddDialog} deckId={deckId} onSaved={() => fetchDeck()} />
      <GerarComIADialog open={showGerarDialog} onOpenChange={setShowGerarDialog} deckId={deckId} onSaved={() => fetchDeck()} />
    </div>
  );
}
