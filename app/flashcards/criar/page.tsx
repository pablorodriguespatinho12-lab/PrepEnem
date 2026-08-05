'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

const MATERIAS = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'];

export default function CriarBaralhoPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [materia, setMateria] = useState(MATERIAS[0]);
  const [subtema, setSubtema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [criando, setCriando] = useState(false);

  const handleCriar = async () => {
    if (!nome.trim()) return toast.error('Dê um nome para o baralho');

    setCriando(true);
    try {
      const resDeck = await fetch('/api/flashcards/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          materia,
          subtema: subtema || null,
          descricao: descricao || null,
          cor: materiaColors[materia] || '#06b6d4',
        }),
      });
      const deckData = await resDeck.json();
      if (!resDeck.ok) {
        toast.error(deckData.error || 'Erro ao criar');
        return;
      }

      // Baralho criado vazio — adicionar cards (manual ou IA com preview)
      // acontece na própria página do deck, não aqui.
      router.push(`/flashcards/${deckData.deck.id}`);
    } catch (e) {
      toast.error('Erro ao criar baralho');
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => router.push('/flashcards')}
        className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="type-headline">Novo Baralho</h1>
        <p className="type-lead text-muted-foreground mt-2">Depois de criar, adicione cards manualmente ou com IA</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-1 rounded-[var(--radius-surface)] p-6">
          <label className="block type-meta font-medium mb-2">Nome do baralho</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Folhetos embrionários"
            className="w-full px-4 py-3 font-reading type-body rounded-[var(--radius-control)] border border-input bg-[hsl(var(--surface-2))] t-colors focus:outline-none focus:border-primary hover:border-primary/50"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-1 rounded-[var(--radius-surface)] p-6">
          <label className="block type-meta font-medium mb-3">Matéria</label>
          <div className="flex flex-wrap gap-2">
            {MATERIAS.map((m) => {
              const isActive = materia === m;
              const corM = materiaColors[m] || '#06b6d4';
              return (
                <motion.button
                  key={m}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMateria(m)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-control)] font-medium type-meta t-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-elev-1'
                      : 'bg-[hsl(var(--surface-2))] border border-border hover:border-primary/40'
                  }`}
                >
                  <span aria-hidden className="w-2 h-2 rounded-[var(--radius-data)]" style={{ backgroundColor: corM }} />
                  {m}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-1 rounded-[var(--radius-surface)] p-6">
          <label className="block type-meta font-medium mb-2">Subtema (opcional)</label>
          <input
            type="text"
            value={subtema}
            onChange={(e) => setSubtema(e.target.value)}
            placeholder="Ex: Embriologia, Eletrodinâmica, Funções Orgânicas"
            className="w-full px-4 py-3 font-reading type-body rounded-[var(--radius-control)] border border-input bg-[hsl(var(--surface-2))] t-colors focus:outline-none focus:border-primary hover:border-primary/50"
          />
          <p className="type-meta text-muted-foreground mt-2">Se preencher, a IA vai focar exclusivamente nesse subtema ao gerar cards depois.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={criando}
            onClick={handleCriar}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-semibold type-lead shadow-elev-2 t-lift hover:shadow-elev-3 disabled:opacity-50"
          >
            {criando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Criar Baralho
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
