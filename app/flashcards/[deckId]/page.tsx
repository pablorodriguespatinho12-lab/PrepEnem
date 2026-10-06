'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, CheckCircle, XCircle, RotateCw, Trophy, Lightbulb, Loader2, RefreshCw, Sparkles, Plus, Trash2, Check, X } from 'lucide-react';
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
            <label className="block type-meta font-medium text-muted-foreground mb-1">Frente (pergunta)</label>
            <Textarea value={frente} onChange={(e) => setFrente(e.target.value)} rows={2} placeholder="Ex: O que é osmose?" className="font-reading" />
          </div>
          <div>
            <label className="block type-meta font-medium text-muted-foreground mb-1">Verso (resposta)</label>
            <Textarea value={verso} onChange={(e) => setVerso(e.target.value)} rows={2} placeholder="Resposta curta e direta" className="font-reading" />
          </div>
          <div>
            <label className="block type-meta font-medium text-muted-foreground mb-1">Dica (opcional)</label>
            <Input value={dica} onChange={(e) => setDica(e.target.value)} placeholder="Mnemônico ou pista" />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 transition-opacity duration-micro ease-out-quart disabled:opacity-50"
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
                <label className="block type-meta font-medium text-muted-foreground mb-1">
                  Sobre o que? (opcional — refina o foco da IA)
                </label>
                <Input
                  value={topico}
                  onChange={(e) => setTopico(e.target.value)}
                  placeholder="Ex: reações de eliminação, funções orgânicas..."
                />
              </div>
              <div>
                <label className="block type-meta font-medium text-muted-foreground mb-2">
                  Quantidade: <span data-numeric>{quantidade}</span>
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 transition-opacity duration-micro ease-out-quart disabled:opacity-50"
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
                <span data-numeric>{candidatos.length}</span> card{candidatos.length !== 1 ? 's' : ''} pronto{candidatos.length !== 1 ? 's' : ''} para salvar
                {descartadosPorDuplicata > 0
                  ? ` — ${descartadosPorDuplicata} descartado${descartadosPorDuplicata !== 1 ? 's' : ''} automaticamente por serem parecidos demais com cards que já existem`
                  : ''}
                . Edite ou descarte cada um antes de confirmar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {candidatos.map((c, i) => (
                <div key={i} className="rounded-[var(--radius-control)] p-3 space-y-2 bg-[hsl(var(--surface-2))] shadow-elev-1">
                  <div className="flex items-start justify-between gap-2">
                    <Textarea
                      value={c.frente}
                      onChange={(e) => updateCandidato(i, 'frente', e.target.value)}
                      rows={2}
                      className="flex-1 font-reading type-body font-medium"
                    />
                    <button
                      onClick={() => descartarCandidato(i)}
                      title="Descartar este card"
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[var(--radius-control)] t-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Textarea
                    value={c.verso}
                    onChange={(e) => updateCandidato(i, 'verso', e.target.value)}
                    rows={2}
                    className="font-reading type-body"
                  />
                </div>
              ))}
              {candidatos.length === 0 && (
                <p className="type-meta text-muted-foreground text-center py-4">
                  Todos os cards foram descartados. Feche e gere novamente se quiser tentar de novo.
                </p>
              )}
            </div>
            <DialogFooter>
              <button
                onClick={handleSalvarAceitos}
                disabled={salvando || candidatos.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 transition-opacity duration-micro ease-out-quart disabled:opacity-50"
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

/* Tempo para o feedback do botão (pulso + anel) aparecer antes de trocar o cartão. */
const ESPERA_FEEDBACK_MS = 400;
const CURVA_FIRME = [0.2, 0.8, 0.2, 1] as const;
/* Opção A, escolhida pelo Pablo em 05/10/2026: o novo cartão sobe da pilha e o
   respondido sai para o lado da resposta (Errei esquerda, Acertei direita).
   Só transform e opacity. Sob reduced-motion, só troca de opacidade. */
function cartaoVariantes(reduzir: boolean): Variants {
  return {
    entra: { opacity: 0, y: reduzir ? 0 : 12 },
    parado: { opacity: 1, y: 0, x: 0, rotate: 0, transition: { duration: reduzir ? 0.01 : 0.24, ease: CURVA_FIRME } },
    sai: (lado: 'esq' | 'dir') => ({
      opacity: 0,
      x: reduzir ? 0 : lado === 'dir' ? 60 : -60,
      rotate: reduzir ? 0 : lado === 'dir' ? 3 : -3,
      transition: { duration: reduzir ? 0.01 : 0.26, ease: 'easeIn' },
    }),
  };
}
/* Cartões que ainda faltam, empilhados atrás do atual: mostra que a sessão
   tem fim e quanto falta, sem número a mais na tela. */
function PilhaDeCartoes({ restantes }: { restantes: number }) {
  const camadas = Math.min(restantes, 2);
  return (
    <div aria-hidden className="absolute inset-x-0 top-0 h-[400px] pointer-events-none">
      {/* A mais funda primeiro, para a de cima pintar por cima dela. */}
      {Array.from({ length: camadas }, (_, k) => camadas - 1 - k).map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-[var(--radius-container)] surface-1"
          style={{ transform: `translateY(${(i + 1) * 10}px) scale(${1 - (i + 1) * 0.04})`, opacity: i === 0 ? 0.7 : 0.4 }}
        />
      ))}
    </div>
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
  // Lado para onde o cartão respondido sai (Errei esquerda, Acertei direita).
  // Fica guardado depois do reset de lastAnswer: o AnimatePresence lê no exit.
  const [saida, setSaida] = useState<'esq' | 'dir'>('esq');
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

  // Avança sem esperar a rede: o feedback vem na hora e a gravação segue em
  // paralelo. Antes, rede lenta deixava o cartão parado depois do clique.
  const handleAnswer = (acertou: boolean) => {
    const currentCard = cards[currentIdx];
    if (animating || !currentCard) return;
    setAnimating(true);
    setLastAnswer(acertou ? 'correct' : 'wrong');
    setSaida(acertou ? 'dir' : 'esq');
    playSound(acertou ? 'acerto' : 'erro');
    setSessionStats((s) => ({
      acertos: acertou ? s.acertos + 1 : s.acertos,
      erros: !acertou ? s.erros + 1 : s.erros,
    }));
    fetch('/api/flashcards/progresso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: currentCard.id, acertou }),
    })
      .then((res) => { if (!res.ok) throw new Error(String(res.status)); })
      .catch(() => toast.error('Não salvou a resposta deste cartão. Confira a conexão.'));
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
    }, ESPERA_FEEDBACK_MS);
  };
  // Teclado: Espaço vira, 1 = Errei, 2 = Acertei (só com o cartão virado).
  const teclaRef = useRef<(e: KeyboardEvent) => void>(() => {});
  teclaRef.current = (e: KeyboardEvent) => {
    if (finished || !cards[currentIdx] || showAddDialog || showGerarDialog) return;
    const alvo = e.target as HTMLElement | null;
    if (alvo && (alvo.closest('input, textarea, select, [contenteditable="true"]') || (alvo.tagName === 'BUTTON' && e.key === ' '))) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setFlipped((f) => !f);
    } else if (flipped && e.key === '1') {
      handleAnswer(false);
    } else if (flipped && e.key === '2') {
      handleAnswer(true);
    }
  };
  useEffect(() => {
    const ouvir = (e: KeyboardEvent) => teclaRef.current(e);
    window.addEventListener('keydown', ouvir);
    return () => window.removeEventListener('keydown', ouvir);
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-text" />
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
        className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      {/* Header — procedência como metadado (ponto de cor + nome), não pílula
          preenchida com texto branco. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-2 type-meta text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)] shrink-0" style={{ backgroundColor: cor }} />
            {deck.materia}
          </span>
          {deck.subtema && (
            <>
              <span aria-hidden className="text-border">/</span>
              <span>{deck.subtema}</span>
            </>
          )}
        </div>
        <h1 className="type-headline">{deck.nome}</h1>
      </motion.div>

      {/* Mode toggle — "Revisar erros" usa --danger porque é, de fato, sobre
          erros; não é decoração de categoria. */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setMode('todos')}
          className={`px-4 py-2 rounded-[var(--radius-control)] font-semibold type-meta t-colors ${
            mode === 'todos'
              ? 'bg-primary text-primary-foreground shadow-elev-2'
              : 'bg-[hsl(var(--surface-2))] border border-border hover:bg-muted'
          }`}
        >
          Estudar (<span data-numeric>{totalCards - cardsAcertados}</span>)
        </button>
        <button
          onClick={() => setMode('revisar')}
          style={mode === 'revisar' ? { backgroundColor: 'hsl(var(--danger))', color: 'hsl(var(--surface-1))' } : undefined}
          className={`px-4 py-2 rounded-[var(--radius-control)] font-semibold type-meta t-colors flex items-center gap-1 ${
            mode === 'revisar' ? 'shadow-elev-2' : 'bg-[hsl(var(--surface-2))] border border-border hover:bg-muted'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Revisar erros (<span data-numeric>{cardsToRevise}</span>)
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-3 py-2 rounded-[var(--radius-control)] font-medium type-meta bg-[hsl(var(--surface-2))] border border-border hover:bg-muted t-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar card
        </button>
        <button
          onClick={() => setShowGerarDialog(true)}
          className="px-3 py-2 rounded-[var(--radius-control)] font-medium type-meta bg-[hsl(var(--surface-2))] border border-border hover:bg-muted t-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Gerar com IA
        </button>
      </div>

      {/* Progress */}
      {cards.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between type-meta text-muted-foreground mb-1.5">
            <span>
              Card <span data-numeric>{Math.min(currentIdx + 1, cards.length)}</span> de <span data-numeric>{cards.length}</span>
            </span>
            <div className="flex gap-3">
              <span data-numeric className="inline-flex items-center gap-1 font-semibold" style={{ color: 'hsl(var(--success))' }}>
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> {sessionStats.acertos}
              </span>
              <span data-numeric className="inline-flex items-center gap-1 font-semibold" style={{ color: 'hsl(var(--danger))' }}>
                <X className="w-3.5 h-3.5" strokeWidth={2.5} /> {sessionStats.erros}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-[var(--radius-data)] overflow-hidden">
            <div
              className="h-full origin-left rounded-[var(--radius-data)] transition-transform duration-medium ease-out-quart"
              style={{ transform: `scaleX(${progress / 100})`, backgroundColor: cor }}
            />
          </div>
        </div>
      )}

      {/* Card or Finished */}
      <div className="relative">
      {!finished && !loading && cards.length - currentIdx > 1 && <PilhaDeCartoes restantes={cards.length - currentIdx - 1} />}
      <AnimatePresence mode="popLayout" custom={saida}>
        {finished ? (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center surface-1 rounded-[var(--radius-container)] p-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: shouldReduceMotion ? 0 : -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { type: 'spring', delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Trophy className="w-20 h-20 text-amber-500" />
            </motion.div>
            <h2 className="type-headline mb-2">
              {cards.length === 0 ? 'Nada para estudar!' : 'Parabéns!'}
            </h2>
            <p className="type-body text-muted-foreground mb-6">
              {cards.length === 0
                ? mode === 'revisar'
                  ? 'Você não tem cards marcados para revisão!'
                  : 'Você já dominou todos os cards deste baralho!'
                : `Você completou ${sessionStats.acertos + sessionStats.erros} cards nesta sessão.`}
            </p>

            {sessionStats.acertos + sessionStats.erros > 0 && (
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="surface-1 rounded-[var(--radius-surface)] p-4">
                  <div data-numeric className="font-display type-display font-semibold" style={{ color: 'hsl(var(--success))' }}>{sessionStats.acertos}</div>
                  <div className="type-meta text-muted-foreground">Acertos</div>
                </div>
                <div className="surface-1 rounded-[var(--radius-surface)] p-4">
                  <div data-numeric className="font-display type-display font-semibold" style={{ color: 'hsl(var(--danger))' }}>{sessionStats.erros}</div>
                  <div className="type-meta text-muted-foreground">A revisar</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fetchDeck()}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-semibold type-meta shadow-elev-2 t-lift hover:shadow-elev-3"
              >
                <RotateCw className="w-4 h-4" />
                Estudar Novamente
              </motion.button>
              {sessionStats.erros > 0 && (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMode('revisar')}
                  style={{ backgroundColor: 'hsl(var(--danger))', color: 'hsl(var(--surface-1))' }}
                  className="flex items-center gap-2 px-6 py-3 rounded-[var(--radius-control)] font-semibold type-meta shadow-elev-2 t-lift hover:shadow-elev-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Revisar Erros
                </motion.button>
              )}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowGerarDialog(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary-text border border-primary/30 rounded-[var(--radius-control)] font-semibold type-meta t-colors hover:bg-primary/15"
              >
                <Sparkles className="w-4 h-4" />
                Gerar mais cards
              </motion.button>
            </div>
          </motion.div>
        ) : currentCard ? (
          <motion.div
            key={currentCard.id}
            custom={saida}
            variants={cartaoVariantes(Boolean(shouldReduceMotion))}
            initial="entra"
            animate="parado"
            exit="sai"
          >
            {/* 3D flip card */}
            <div
              className="relative w-full mb-6 cursor-pointer select-none"
              style={{ perspective: '1500px', minHeight: '400px' }}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={flipped ? 'Virar para a pergunta' : 'Virar para ver a resposta'}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                // Exceção deliberada ao padrão de reduced-motion do resto do
                // app: aqui a rotação é o próprio feedback de que a resposta
                // trocou de lado, não decoração (diferente do parallax de
                // fundo, que é puramente estético). Uma rotação de eixo único
                // em 250-600ms não é o tipo de movimento que a diretriz mira
                // (parallax rápido, zoom, deslocamento grande) — só encurta
                // e tira o bounce quando reduced-motion está ativo.
                transition={
                  shouldReduceMotion
                    ? { duration: 0.25, ease: 'easeOut' }
                    : { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] } // opção A (05/10/2026): firme, sem quique
                }
                style={{ transformStyle: 'preserve-3d', minHeight: '400px' }}
                className="relative w-full"
              >
                {/* Front — surface-2 (elevada): a frente é o lado ativo da
                    pergunta. Identidade da matéria vira ponto de cor, não
                    fundo — texto branco sobre pastel reprova contraste. */}
                <div
                  className="absolute inset-0 w-full rounded-[var(--radius-container)] surface-2 flex flex-col items-center justify-center p-8 md:p-10"
                  style={{
                    backfaceVisibility: 'hidden',
                    minHeight: '400px',
                  }}
                >
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 type-caption text-muted-foreground">
                    <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: cor }} />
                    Pergunta
                  </div>
                  <p className="font-reading type-title measure-reading text-center text-foreground">
                    {currentCard.frente}
                  </p>
                  <div className="absolute bottom-4 left-0 right-0 text-center type-meta text-muted-foreground">Toque para ver a resposta <span className="hidden md:inline">· Espaço</span></div>
                  {currentCard.dica && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint((h) => !h);
                      }}
                      className="absolute top-4 right-4 p-2 bg-muted rounded-[var(--radius-control)] hover:bg-muted/70 t-colors"
                      aria-label="Mostrar dica"
                    >
                      <Lightbulb className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                </div>

                {/* Back — surface-1 (repouso): a resposta é o lado de chegada. */}
                <div
                  className="absolute inset-0 w-full rounded-[var(--radius-container)] surface-1 flex flex-col items-center justify-center p-8 md:p-10"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    minHeight: '400px',
                  }}
                >
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 type-caption text-muted-foreground">
                    <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: cor }} />
                    Resposta
                  </div>
                  <p className="font-reading type-lead measure-reading text-center text-foreground font-medium">
                    {currentCard.verso}
                  </p>
                  {currentCard.dica && (
                    <div
                      className="mt-4 px-4 py-2 rounded-[var(--radius-control)] type-meta flex items-start gap-2 max-w-md bg-[hsl(var(--surface-2))] shadow-elev-1"
                    >
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <span className="font-reading">{currentCard.dica}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-0 right-0 text-center type-meta text-muted-foreground">Toque para virar <span className="hidden md:inline">· 1 errei · 2 acertei</span></div>
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
                    className="mb-4 mx-auto max-w-md px-4 py-3 rounded-[var(--radius-control)] type-meta flex items-start gap-2 bg-[hsl(var(--surface-2))] shadow-elev-1"
                  >
                    <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span className="font-reading">{currentCard.dica}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Action buttons - shown when flipped. Verde/vermelho legítimos:
                classificam acerto/erro da própria revisão. */}
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
                    style={{
                      backgroundColor: 'hsl(var(--danger))',
                      color: 'hsl(var(--surface-1))',
                      opacity: lastAnswer === 'correct' ? 0.4 : undefined,
                      boxShadow: lastAnswer === 'wrong' ? '0 0 0 4px hsl(var(--danger) / 0.3), var(--elev-3)' : undefined,
                    }}
                    className="flex items-center justify-center gap-2 py-4 rounded-[var(--radius-control)] font-semibold type-body t-lift enabled:hover:shadow-elev-3 disabled:opacity-50"
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
                    style={{
                      backgroundColor: 'hsl(var(--success))',
                      color: 'hsl(var(--surface-1))',
                      opacity: lastAnswer === 'wrong' ? 0.4 : undefined,
                      boxShadow: lastAnswer === 'correct' ? '0 0 0 4px hsl(var(--success) / 0.3), var(--elev-3)' : undefined,
                    }}
                    className="flex items-center justify-center gap-2 py-4 rounded-[var(--radius-control)] font-semibold type-body t-lift enabled:hover:shadow-elev-3 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Acertei
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 surface-1 rounded-[var(--radius-container)]">
            <h3 className="type-headline mb-2">Baralho vazio</h3>
            <p className="type-body text-muted-foreground mb-6">Este baralho ainda não tem flashcards.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--surface-2))] border border-border rounded-[var(--radius-control)] font-semibold type-meta t-colors hover:border-primary/50"
              >
                <Plus className="w-4 h-4" />
                Adicionar manualmente
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowGerarDialog(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-semibold type-meta shadow-elev-2 t-lift hover:shadow-elev-3"
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
