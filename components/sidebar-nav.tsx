'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Home, BookOpen, AlertCircle, BarChart3, Settings, ShieldCheck,
  LogOut, Menu, X, GraduationCap, ClipboardList, Library, PenTool, Trophy,
  Layers, FileText, Moon, Sun, Sigma, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppTheme } from './app-theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

type ItemNav = { href: string; label: string; icon: typeof Home };
// Menu enxuto (pedido do Pablo, 06/10/2026: "não deixar tanta coisa num lugar
// só"). Eram 13 itens de uma vez. Ficam à vista os 6 do estudo diário; o resto
// abre em "Mais". "Importar PDF" saiu: depende de S3, que não será configurado.
const principais: ItemNav[] = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/treino', label: 'Treino', icon: BookOpen },
  { href: '/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/redacao', label: 'Redação', icon: PenTool },
  { href: '/calculo', label: 'Cálculo', icon: Sigma },
  { href: '/progresso', label: 'Progresso', icon: BarChart3 },
];
const secundarios: ItemNav[] = [
  { href: '/simulado', label: 'Simulado', icon: ClipboardList },
  { href: '/provas', label: 'Provas', icon: FileText },
  { href: '/caderno-erros', label: 'Caderno de Erros', icon: AlertCircle },
  { href: '/banco-questoes', label: 'Banco de Questões', icon: Library },
  { href: '/vestibular', label: 'Vestibular', icon: Trophy },
  { href: '/perfil', label: 'Perfil', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const [open, setOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'admin';
  const { theme, setTheme } = useTheme();
  const estaEm = (href: string) => pathname === href || pathname?.startsWith(href + '/');
  const [maisAberto, setMaisAberto] = useState(() => secundarios.some((item) => estaEm(item.href)));
  const linkDoMenu = (item: ItemNav, i: number) => {
    const Icon = item.icon;
    const active = estaEm(item.href);
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
          aria-current={active ? 'page' : undefined}
          className={cn(
            'group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] type-meta font-medium transition-[color,background-color,border-color,box-shadow] duration-200',
            active
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Icon className={cn('w-4 h-4 transition-transform duration-200', !active && 'group-hover:scale-110')} />
          {item.label}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-[var(--radius-control)] bg-primary text-primary-foreground shadow-lg md:hidden"
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
          'fixed top-0 left-0 z-40 h-full w-64 bg-[hsl(var(--surface-1))] border-r border-border flex flex-col transition-transform duration-300',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border">
          {/* Antes pulsava em loop infinito. Movimento perpétuo na visão
              periférica durante sessão de uma a três horas é exatamente o que
              a direção evita — e não comunicava estado nenhum. */}
          <div className="w-10 h-10 rounded-[var(--radius-control)] bg-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display type-lead font-semibold">PrepEnem</h1>
            <p className="type-micro text-muted-foreground tracking-wide">Plataforma de Estudos</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {principais.map(linkDoMenu)}
          <button
            type="button"
            onClick={() => setMaisAberto((v) => !v)}
            aria-expanded={maisAberto}
            className="flex w-full items-center gap-3 px-3 py-2.5 mt-3 rounded-[var(--radius-control)] type-meta font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-[color,background-color]"
          >
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', maisAberto && 'rotate-180')} />
            Mais
          </button>
          {maisAberto && <div className="space-y-1">{secundarios.map(linkDoMenu)}</div>}
          {isAdmin && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Link
                href="/admin/questoes"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] type-meta font-medium transition-[color,background-color,border-color,box-shadow] duration-200',
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] type-meta font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-[color,background-color] w-full"
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
              <span className="type-meta font-semibold text-primary-text">
                {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="type-meta font-medium truncate">{session?.user?.name ?? 'Estudante'}</p>
              <p className="type-micro text-muted-foreground truncate">@{session?.user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] type-meta font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-[color,background-color] w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
