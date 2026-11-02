'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Sparkles, Target, Trophy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';
import { EscolhaDeNumero } from '@/components/escolha-de-numero';
import { MATERIAS_COM_QUESTOES, nomeAutomatico } from '@/lib/materias-com-questoes';

const MATERIAS_DISPONIVEIS = MATERIAS_COM_QUESTOES;

const NIVEIS = [
  {
    id: 'facil',
    label: 'Fácil',
    desc: 'Questões de nível fácil e médio. Ideal para revisão.',
    dotColor: 'hsl(var(--chart-2))',
    icon: Sparkles,
  },
  {
    id: 'medio',
    label: 'Médio',
    desc: 'Questões de nível médio e modelo ENEM. Treinamento padrão.',
    dotColor: 'hsl(var(--chart-5))',
    icon: Target,
  },
  {
    id: 'vestibular',
    label: 'Vestibular',
    desc: 'Questões de vestibulares e modelo ENEM. Nível mais desafiador.',
    dotColor: 'hsl(var(--chart-4))',
    icon: Trophy,
  },
];

export default function CriarProvaPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('medio');
  const [materias, setMaterias] = useState<string[]>([]);
  const [totalQuestoes, setTotalQuestoes] = useState(10);
  // Flashcards do dia antes da 1ª questão (Pablo, 22/10/2026; antes ficavam no Simulado).
  const [cartoesAntes, setCartoesAntes] = useState(0);
  const [criando, setCriando] = useState(false);

  const toggleMateria = (m: string) => {
    setMaterias((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleCriar = async () => {
    if (materias.length === 0) return toast.error('Escolha pelo menos uma matéria');
    if (totalQuestoes < 1) return toast.error('Número mínimo: 1 questão');

    setCriando(true);
    try {
      const res = await fetch('/api/provas/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() || nomeAutomatico(materias), nivel, materias, totalQuestoes }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar prova');
        return;
      }
      toast.success(`Prova criada com ${data.totalQuestoes} questões!`);
      router.push(cartoesAntes > 0 ? `/provas/${data.examId}?cartoes=${cartoesAntes}` : `/provas/${data.examId}`);
    } catch (e) {
      toast.error('Erro ao criar prova');
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/provas')}
        className="flex items-center gap-2 type-meta text-muted-foreground hover:text-foreground t-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display type-display font-semibold text-foreground">Nova Prova</h1>
        <p className="text-muted-foreground mt-2 type-lead">Personalize sua prova de treinamento</p>
      </motion.div>

      <div className="space-y-8">
        {/* Nome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6"
        >
          <label className="block type-meta font-semibold text-foreground mb-3">Nome da prova <span className="text-muted-foreground font-normal">(opcional)</span></label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Se deixar em branco, vira o nome das matérias"
            className="w-full px-4 py-3 rounded-[var(--radius-control)] border border-border bg-[hsl(var(--surface-2))] shadow-elev-1 focus:border-primary outline-none t-colors text-foreground placeholder:text-muted-foreground/60"
          />
        </motion.div>

        {/* Nível */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6"
        >
          <label className="block type-meta font-semibold text-foreground mb-4">Nível</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {NIVEIS.map((n) => {
              const NIcon = n.icon;
              const selected = nivel === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setNivel(n.id)}
                  data-state={selected ? 'selecionado' : 'repouso'}
                  style={selected ? { borderColor: n.dotColor } : undefined}
                  className={`relative p-5 rounded-[var(--radius-control)] text-left t-lift ${
                    selected
                      ? 'bg-primary/[0.07] border shadow-elev-2'
                      : 'bg-[hsl(var(--surface-2))] border border-border shadow-elev-1 hover:border-primary/45 hover:shadow-elev-2 hover:-translate-y-px'
                  }`}
                >
                  {selected && (
                    <span
                      aria-hidden
                      className="absolute top-3 right-3 rounded-[var(--radius-data)] p-1"
                      style={{ backgroundColor: n.dotColor, color: 'hsl(var(--surface-1))' }}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <NIcon className="w-6 h-6 mb-2" style={{ color: n.dotColor }} />
                  <div className="font-display type-lead font-semibold text-foreground">{n.label}</div>
                  <div className="type-meta text-muted-foreground mt-1">{n.desc}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Matérias */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6"
        >
          <label className="block type-meta font-semibold text-foreground mb-4">
            Matérias <span className="text-muted-foreground font-normal">(escolha uma ou mais)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MATERIAS_DISPONIVEIS.map((m) => {
              const selected = materias.includes(m);
              return (
                <button
                  key={m}
                  onClick={() => toggleMateria(m)}
                  data-state={selected ? 'selecionado' : 'repouso'}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-control)] type-meta font-medium t-colors ${
                    selected
                      ? 'bg-primary/[0.08] border border-primary text-foreground'
                      : 'bg-[hsl(var(--surface-2))] border border-border text-foreground hover:border-primary/40'
                  }`}
                >
                  <span
                    aria-hidden
                    className="w-2 h-2 rounded-[var(--radius-data)] shrink-0"
                    style={{ backgroundColor: materiaColors[m] ?? 'hsl(var(--muted-foreground))' }}
                  />
                  {m}
                  {selected && <Check className="w-3.5 h-3.5 text-primary-text" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Número de questões */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6"
        >
          <p className="type-meta font-semibold text-foreground mb-3">Número de questões</p>
          <EscolhaDeNumero rotulo="Número de questões" opcoes={[5, 10, 20, 30, 45]} valor={totalQuestoes} aoEscolher={setTotalQuestoes} />
        </motion.div>

        {/* Flashcards antes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="surface-1 rounded-[var(--radius-surface)] p-6"
        >
          <p className="type-meta font-semibold text-foreground mb-1">Flashcards antes</p>
          <p className="type-meta text-muted-foreground mb-3">Os cartões do dia, para aquecer antes da primeira questão.</p>
          <EscolhaDeNumero rotulo="Flashcards antes da prova" opcoes={[0, 5, 10, 15]} valor={cartoesAntes} aoEscolher={setCartoesAntes} nomeDoZero="Sem" />
        </motion.div>

        {/* Botão criar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <button
            disabled={criando}
            onClick={handleCriar}
            className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium text-body shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-40 disabled:shadow-elev-1"
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
          </button>
        </motion.div>
      </div>
    </div>
  );
}
