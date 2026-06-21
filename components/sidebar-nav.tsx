'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Home, BookOpen, AlertCircle, BarChart3, Settings, ShieldCheck,
  LogOut, Menu, X, GraduationCap, Upload, ClipboardList, Library, PenTool, Trophy,
  Layers, FileText, Moon, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppTheme } from './app-theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/treino', label: 'Treino', icon: BookOpen },
  { href: '/simulado', label: 'Simulado', icon: ClipboardList },
  { href: '/provas', label: 'Provas', icon: FileText },
  { href: '/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/banco-questoes', label: 'Banco de Questões', icon: Library },
  { href: '/caderno-erros', label: 'Caderno de Erros', icon: AlertCircle },
  { href: '/redacao', label: 'Redação', icon: PenTool },
  { href: '/progresso', label: 'Progresso', icon: BarChart3 },
  { href: '/vestibular', label: 'Vestibular', icon: Trophy },
  { href: '/upload', label: 'Importar PDF', icon: Upload },
  { href: '/perfil', label: 'Perfil', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const [open, setOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'admin';
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Mobile toggle */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Menu"
        whileTap={{ scale: 0.9 }}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight">PrepEnem</h1>
            <p className="text-xs text-muted-foreground">Plataforma de Estudos</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.15 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-transform duration-200', !active && 'group-hover:scale-110')} />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}

          {isAdmin && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Link
                href="/admin/questoes"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname?.startsWith('/admin')
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Questões
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.div>
            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </button>

          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name ?? 'Estudante'}</p>
              <p className="text-xs text-muted-foreground truncate">@{session?.user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
