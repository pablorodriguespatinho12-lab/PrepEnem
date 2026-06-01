'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';
import { AppThemeProvider } from './app-theme-provider';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/login', '/signup'];
  const isPublic = publicPaths.includes(pathname ?? '');

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

  if (session && isPublic) {
    if (typeof window !== 'undefined') {
      router.replace('/dashboard');
    }
    return null;
  }

  if (isPublic) {
    return <AppThemeProvider>{children}</AppThemeProvider>;
  }

  return (
    <AppThemeProvider>
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <main className="md:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </AppThemeProvider>
  );
}
