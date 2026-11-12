'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';
import { AppThemeProvider } from './app-theme-provider';
import { ScrollProgress } from './animations';
import { MundoPixel } from './pixel/mundo-pixel';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';
import { useLetraPixel } from '@/hooks/use-letra-pixel';
import { LembreteLeitura } from './lembrete-leitura';
import { EsqueletoApp } from './esqueletos';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const mundo = useMundoAnimado();
  useLetraPixel(); // aplica a escolha de "Letras em pixel" em toda tela
  // A prova tem o mundo dela, forte e sem véu (components/pixel/mundo-pixel.tsx).
  const provaAberta = /^\/provas\/(?!criar)[^/]+/.test(pathname ?? '');

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

  if (status === 'loading') return <EsqueletoApp />;

  if (!session && !isPublic) {
    if (typeof window !== 'undefined') {
      router.replace('/login');
    }
    return <EsqueletoApp />;
  }

  return (
    <AppThemeProvider>
      <div className="min-h-screen relative">
        {/* Mundo pixel no fundo do site inteiro (Pablo, 12/11/2026: "literalmente
            tudo"), com um véu da cor da página por cima para o texto seguir legível.
            Substituiu as partículas. */}
        {!provaAberta && (
          <>
            <MundoPixel animado={mundo.animado} />
            <div className="mundo-veu" aria-hidden />
          </>
        )}
        <ScrollProgress />
        <SidebarNav />
        {/* pt-12 no celular: o botão fixo do menu (top-4, 36 px) cobria o topo das páginas, ex. o "Voltar". */}
        <main className="md:ml-64 min-h-screen relative pt-12 md:pt-0" style={{ zIndex: 1 }}>
          {children}
        </main>
        <LembreteLeitura />
      </div>
    </AppThemeProvider>
  );
}
