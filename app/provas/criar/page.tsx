'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, FileText, Sparkles, Target, Trophy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

const MATERIAS_DISPONIVEIS = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Português',
  'História',
  'Geografia',
  'Filosofia',
  'Sociologia',
  'Inglês',
];

const NIVEIS = [
  {
    id: 'facil',
    label: 'Fácil',
    desc: 'Questões de nível fácil e médio. Ideal para revisão.',
    color: 'from-emerald-500 to-green-600',
    icon: Sparkles,
  },
  {
    id: 'medio',
    label: 'Médio',
    desc: 'Questões de nível médio e modelo ENEM. Treinamento padrão.',
    color: 'from-amber-500 to-orange-500',
    icon: Target,
  },
  {
    id: 'vestibular',
    label: 'Vestibular',
    desc: 'Questões de vestibulares e modelo ENEM. Nível mais desafiador.',
    color: 'from-rose-500 to-red-600',
    icon: Trophy,
  },
];

export default function CriarProvaPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('medio');
  const [materias, setMaterias] = useState<string[]>([]);
  const [totalQuestoes, setTotalQuestoes] = useState(10);
  const [criando, setCriando] = useState(false);

  const toggleMateria = (m: string) => {
    setMaterias((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleCriar = async () => {
    if (!nome.trim()) return toast.error('Dê um nome para a prova');
    if (materias.length === 0) return toast.error('Escolha pelo menos uma matéria');
    if (totalQuestoes < 1) return toast.error('Número mínimo: 1 questão');

    setCriando(true);
    try {
      const res = await fetch('/api/provas/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, nivel, materias, totalQuestoes }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar prova');
        return;
      }
      toast.success(`Prova criada com ${data.totalQuestoes} questões!`);
      router.push(`/provas/${data.examId}`);
    } catch (e) {
      toast.error('Erro ao criar prova');
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => router.push('/provas')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Voltar
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/85 to-[hsl(var(--chart-2))] bg-clip-text text-transparent">
          Nova Prova
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Personalize sua prova de treinamento</p>
      </motion.div>

      <div className="space-y-8">
        {/* Nome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <label className="block text-sm font-bold text-foreground mb-3">Nome da prova</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Simulado de Ciências da Natureza"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground/60"
          />
        </motion.div>

        {/* Nível */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <label className="block text-sm font-bold text-foreground mb-4">Nível</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {NIVEIS.map((n) => {
              const NIcon = n.icon;
              const selected = nivel === n.id;
              return (
                <motion.button
                  key={n.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNivel(n.id)}
                  className={`relative p-5 rounded-2xl text-left transition-all overflow-hidden ${
                    selected
                      ? `bg-gradient-to-br ${n.color} text-white shadow-xl`
                      : 'bg-background border-2 border-border hover:border-primary/30'
                  }`}
                >
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 bg-white/20 rounded-full p-1"
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                  <NIcon className={`w-7 h-7 mb-2 ${selected ? 'text-white' : 'text-primary'}`} />
                  <div className="font-bold text-lg">{n.label}</div>
                  <div className={`text-xs mt-1 ${selected ? 'text-white/90' : 'text-muted-foreground'}`}>{n.desc}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Matérias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <label className="block text-sm font-bold text-foreground mb-4">
            Matérias <span className="text-muted-foreground font-normal">(escolha uma ou mais)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MATERIAS_DISPONIVEIS.map((m) => {
              const selected = materias.includes(m);
              return (
                <motion.button
                  key={m}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMateria(m)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    selected
                      ? 'text-white shadow-md'
                      : 'bg-background border-2 border-border text-foreground hover:border-primary/30'
                  }`}
                  style={selected ? { backgroundColor: materiaColors[m] || '#a855f7' } : {}}
                >
                  {selected && <Check className="inline w-4 h-4 mr-1" />}
                  {m}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Número de questões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <label className="block text-sm font-bold text-foreground mb-3">Número de questões</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={50}
              value={totalQuestoes}
              onChange={(e) => setTotalQuestoes(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <motion.div
              key={totalQuestoes}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="min-w-[60px] text-center px-4 py-2 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-xl font-bold text-lg"
            >
              {totalQuestoes}
            </motion.div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {[5, 10, 20, 30, 45].map((n) => (
              <button
                key={n}
                onClick={() => setTotalQuestoes(n)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  totalQuestoes === n
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Botão criar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={criando}
            onClick={handleCriar}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow disabled:opacity-50"
          >
            {criando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando prova...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Criar Prova
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
