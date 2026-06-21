'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Settings, User, Palette, Save, LogOut, Check, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { themeColors } from '@/lib/theme-colors';
import { useAppTheme } from '@/components/app-theme-provider';
import { useTheme } from 'next-themes';

const THEME_OPTIONS = [
  { key: 'purple', label: 'Roxo', color: '#7c3aed' },
  { key: 'blue', label: 'Azul', color: '#2563eb' },
  { key: 'green', label: 'Verde', color: '#16a34a' },
  { key: 'orange', label: 'Laranja', color: '#ea580c' },
];

export default function PerfilPage() {
  const { data: session, update } = useSession() || {};
  const { color: currentTheme, setColor: setTheme } = useAppTheme();
  const [name, setName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { theme: darkMode, setTheme: setDarkMode } = useTheme();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data?.name ?? '');
        setSelectedTheme(data?.themeColor ?? 'purple');
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
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Perfil & Configurações</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Personalize sua experiência de estudo</p>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 shadow-sm border border-border mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-display text-base font-semibold">Informações Pessoais</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={session?.user?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-muted text-sm text-muted-foreground"
            />
          </div>
          {profile?.createdAt && (
            <p className="text-xs text-muted-foreground">
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
        className="bg-card rounded-xl p-6 shadow-sm border border-border mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-display text-base font-semibold">Tema de Cores</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.key}
              onClick={() => setSelectedTheme(theme.key)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedTheme === theme.key
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full shadow-inner"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-medium">{theme.label}</span>
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
        className="bg-card rounded-xl p-6 shadow-sm border border-border mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            <div>
              <h2 className="font-display text-base font-semibold">Modo Escuro</h2>
              <p className="text-xs text-muted-foreground">Altere entre modo claro e escuro</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              darkMode === 'dark' ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              animate={{ left: darkMode === 'dark' ? '30px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {darkMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-primary" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg font-medium text-sm hover:bg-destructive/20 transition"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );
}
