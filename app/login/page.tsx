'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GraduationCap, User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ParticlesBg } from '@/components/particles-bg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      // Sem redirecionar sozinho: assim a tela mostra o motivo do erro
      // (senha errada ou bloqueio por tentativas, lib/limite-login.ts).
      const res = await signIn('credentials', { username, password, redirect: false });
      if (res?.error) {
        toast.error(res.error.startsWith('Muitas tentativas') ? res.error : 'Usuário ou senha inválidos');
        return;
      }
      // Volta para onde ia (o middleware manda ?callbackUrl=). Só caminho interno.
      const destino = new URLSearchParams(window.location.search).get('callbackUrl') ?? '';
      const seguro = destino.startsWith('/') && !destino.startsWith('//') && !destino.startsWith('/\\');
      window.location.assign(seguro ? destino : '/dashboard');
    } catch {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <ParticlesBg />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-[var(--radius-control)] bg-primary flex items-center justify-center shadow-elev-2">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display type-display font-bold">PrepEnem</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="surface-2 rounded-[var(--radius-surface)] p-8"
        >
          <h2 className="font-display type-title font-semibold mb-1">Bem-vindo de volta!</h2>
          <p className="type-meta text-muted-foreground mb-6">Faça login para continuar seus estudos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block type-meta font-medium mb-1.5">Nome de usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-[var(--radius-control)] bg-background type-meta focus:outline-none focus:ring-2 focus:ring-ring transition-[box-shadow] duration-short ease-out-quart"
                  placeholder="Seu nome de usuário"
                  autoComplete="username"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block type-meta font-medium mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-input rounded-[var(--radius-control)] bg-background type-meta focus:outline-none focus:ring-2 focus:ring-ring transition-[box-shadow] duration-short ease-out-quart"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground t-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta hover:opacity-90 t-lift disabled:opacity-50 shadow-elev-2 hover:shadow-elev-3 hover:-translate-y-px"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
