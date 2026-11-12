'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Settings, User, Palette, Save, LogOut, Check, Moon, Sun, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { themeColors, DEFAULT_THEME_COLOR } from '@/lib/theme-colors';
import { useAppTheme } from '@/components/app-theme-provider';
import { useTheme } from 'next-themes';
import { useSoundEnabled } from '@/lib/use-sound-preference';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';

const THEME_OPTIONS = Object.entries(themeColors).map(([key, set]) => ({
  key,
  label: set.label,
  color: set.swatch,
}));

export default function PerfilPage() {
  const { data: session, update } = useSession() || {};
  const { color: currentTheme, setColor: setTheme } = useAppTheme();
  const [name, setName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME_COLOR);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { theme: darkMode, setTheme: setDarkMode } = useTheme();
  const [soundEnabled, setSoundEnabled] = useSoundEnabled();
  const mundo = useMundoAnimado();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data?.name ?? '');
        setSelectedTheme(data?.themeColor ?? DEFAULT_THEME_COLOR);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, themeColor: selectedTheme }),
      });
      if (res.ok) {
        setTheme(selectedTheme);
        await update?.({ themeColor: selectedTheme, name });
        toast.success('Perfil atualizado!');
      }
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-primary-text" />
          <h1 className="font-display type-headline font-bold">Perfil & Configurações</h1>
        </div>
        <p className="type-meta text-muted-foreground mb-8">Personalize sua experiência de estudo</p>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary-text" />
          <h2 className="font-display type-body font-semibold">Informações Pessoais</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block type-meta font-medium mb-1.5">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-[var(--radius-control)] bg-background type-meta focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block type-meta font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={session?.user?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 border border-input rounded-[var(--radius-control)] bg-muted type-meta text-muted-foreground"
            />
          </div>
          {profile?.createdAt && (
            <p className="type-meta text-muted-foreground">
              Membro desde {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </motion.div>

      {/* Theme Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary-text" />
          <h2 className="font-display type-body font-semibold">Tema de Cores</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.key}
              onClick={() => setSelectedTheme(theme.key)}
              data-state={selectedTheme === theme.key ? 'selecionado' : 'repouso'}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-[var(--radius-control)] border t-colors ${
                selectedTheme === theme.key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/40 hover:bg-muted/40'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full shadow-inner"
                style={{ backgroundColor: theme.color }}
              />
              <span className="type-meta font-medium">{theme.label}</span>
              {selectedTheme === theme.key && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Dark Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode === 'dark' ? <Moon className="w-5 h-5 text-primary-text" /> : <Sun className="w-5 h-5 text-primary-text" />}
            <div>
              <h2 className="font-display type-body font-semibold">Modo Escuro</h2>
              <p className="type-meta text-muted-foreground">Altere entre modo claro e escuro</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
            role="switch"
            aria-checked={darkMode === 'dark'}
            aria-label="Modo escuro"
            className={`relative w-14 h-7 rounded-full t-colors ${
              darkMode === 'dark' ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-elev-1 flex items-center justify-center"
              animate={{ x: darkMode === 'dark' ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {darkMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-primary-text" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Sound */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? <Volume2 className="w-5 h-5 text-primary-text" /> : <VolumeX className="w-5 h-5 text-primary-text" />}
            <div>
              <h2 className="font-display type-body font-semibold">Som</h2>
              <p className="type-meta text-muted-foreground">Feedback sonoro discreto em acerto, erro, card salvo e sessão concluída</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            role="switch"
            aria-checked={soundEnabled}
            aria-label="Som"
            className={`relative w-14 h-7 rounded-full t-colors flex-shrink-0 ${
              soundEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-elev-1 flex items-center justify-center"
              animate={{ x: soundEnabled ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-primary-text" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Mundo pixel animado: ligado por padrão (Pablo, 12/11/2026); quem quiser parado desliga aqui. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="surface-1 rounded-[var(--radius-surface)] p-6 mb-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-text" />
            <div>
              <h2 className="font-display type-body font-semibold">Mundo pixel animado</h2>
              <p className="type-meta text-muted-foreground">Dia e noite passando no fundo da prova, faíscas e luz no Início</p>
            </div>
          </div>
          <button
            onClick={mundo.alternar}
            role="switch"
            aria-checked={mundo.animado}
            aria-label="Mundo pixel animado"
            className={`relative w-14 h-7 rounded-full t-colors flex-shrink-0 ${mundo.animado ? 'bg-primary' : 'bg-muted'}`}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-elev-1"
              animate={{ x: mundo.animado ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift enabled:hover:-translate-y-px enabled:hover:shadow-elev-3 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-[var(--radius-control)] font-medium type-meta hover:bg-secondary t-colors"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );
}
