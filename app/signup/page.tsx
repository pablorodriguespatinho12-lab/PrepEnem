'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { GraduationCap, Lock, User, Eye, EyeOff, AtSign } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !name) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (username.length < 3) {
      toast.error('Usuário deve ter pelo menos 3 caracteres');
      return;
    }
    if (/\s/.test(username)) {
      toast.error('Usuário não pode conter espaços');
      return;
    }
    if (password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Erro ao criar conta');
        return;
      }
      // Auto login after signup
      await signIn('credentials', {
        username,
        password,
        redirect: true,
        callbackUrl: '/dashboard',
      });
    } catch {
      toast.error('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">PrepEnem</h1>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <h2 className="font-display text-xl font-semibold mb-1">Criar conta</h2>
          <p className="text-sm text-muted-foreground mb-6">Comece seus estudos para o ENEM agora</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Nome de usuário</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="seu_usuario"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
