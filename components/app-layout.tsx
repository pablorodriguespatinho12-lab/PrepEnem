'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';
import { AppThemeProvider } from './app-theme-provider';
import { ScrollProgress } from './animations';
import { ParticlesBg } from './particles-bg';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login', '/signup'];
  const isPublic = publicPaths.includes(pathname ?? '');

  // Login e cadastro não dependem da sessão: aparecem na hora. Antes, a tela
  // inteira esperava /api/auth/session (que acorda o Neon quando ele dorme):
  // 6,7 s de círculo girando antes do formulário (medido em 06/10/2026).
  if (isPublic) {
    if (session) {
      if (typeof window !== 'undefined') router.replace('/dashboard');
      return null;
    }
    return <AppThemeProvider>{children}</AppThemeProvider>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session && !isPublic) {
    if (typeof window !== 'undefined') {
      router.replace('/login');
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AppThemeProvider>
      <div className="min-h-screen relative">
        <ParticlesBg />
        <ScrollProgress />
        <SidebarNav />
        {/* pt-12 no celular: o botão fixo do menu (top-4, 36 px) cobria o topo das páginas, ex. o "Voltar". */}
        <main className="md:ml-64 min-h-screen relative pt-12 md:pt-0" style={{ zIndex: 1 }}>
          {children}
        </main>
      </div>
    </AppThemeProvider>
  );
}
