'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionGuard } from '@/components/session-guard';
import { Toaster } from 'sonner';
import { MotionConfig } from 'framer-motion';
import React from 'react';

/* nonce: o script do next-themes (evita piscar o tema) é inline; sem o nonce do
   middleware.ts a Content-Security-Policy o bloqueia (12/11/2026). */
export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  return (
    <SessionProvider>
      <SessionGuard />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storageKey="prepenem-theme"
        nonce={nonce}
      >
        {/* Reduzir movimento do sistema vale no app inteiro: o framer desliga
            transform (x, y, scale) e mantém opacity. Antes cada tela tratava por
            conta própria e várias não tratavam. Exceção: o flip do flashcard. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
