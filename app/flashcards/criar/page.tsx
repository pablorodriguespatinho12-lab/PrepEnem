'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

const MATERIAS = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês'];

export default function CriarBaralhoPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [materia, setMateria] = useState(MATERIAS[0]);
  const [subtema, setSubtema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState(15);
  const [criando, setCriando] = useState(false);

  const handleCriar = async () => {
    if (!nome.trim()) return toast.error('Dê um nome para o baralho');

    setCriando(true);
    try {
      // Create deck
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

      toast.info(`Gerando ${quantidade} flashcards com IA...`);

      // Generate cards with AI
      const resGen = await fetch('/api/flashcards/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: deckData.deck.id, quantidade }),
      });
      const genData = await resGen.json();
      if (!resGen.ok) {
        toast.error(genData.error || 'Erro ao gerar cards (baralho criado vazio)');
      } else {
        toast.success(`${genData.created} flashcards criados!`);
      }

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
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Novo Baralho
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">A IA vai gerar os flashcards para você</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-bold mb-2">Nome do baralho</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Folhetos embrionários"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-cyan-500 outline-none transition-colors"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-bold mb-3">Matéria</label>
          <div className="flex flex-wrap gap-2">
            {MATERIAS.map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMateria(m)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  materia === m ? 'text-white shadow-md' : 'bg-background border-2 border-border hover:border-cyan-300'
                }`}
                style={materia === m ? { backgroundColor: materiaColors[m] || '#06b6d4' } : {}}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-bold mb-2">Subtema (opcional)</label>
          <input
            type="text"
            value={subtema}
            onChange={(e) => setSubtema(e.target.value)}
            placeholder="Ex: Embriologia, Eletrodinâmica, Funções Orgânicas"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-cyan-500 outline-none transition-colors"
          />
          <p className="text-xs text-muted-foreground mt-2">Se preencher, a IA vai focar exclusivamente nesse subtema.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-bold mb-3">Quantidade de flashcards</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={30}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="flex-1 accent-cyan-500"
            />
            <motion.div
              key={quantidade}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="min-w-[60px] text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg"
            >
              {quantidade}
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={criando}
            onClick={handleCriar}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow disabled:opacity-50"
          >
            {criando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Criar Baralho
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
