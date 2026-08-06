'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { themeColors, DEFAULT_THEME_COLOR, surfaceScale, primaryStates } from '@/lib/theme-colors';

interface ThemeContextType {
  color: string;
  setColor: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({ color: DEFAULT_THEME_COLOR, setColor: () => {} });

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() || {};
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState(DEFAULT_THEME_COLOR);

  useEffect(() => {
    const tc = (session?.user as any)?.themeColor;
    if (tc && themeColors[tc]) {
      setColor(tc);
    }
  }, [session]);

  useEffect(() => {
    const set = themeColors[color];
    if (!set) return;
    // resolvedTheme só existe depois do mount do next-themes (evita paint com valores errados
    // durante SSR); até lá, assume claro — mesmo fallback que o next-themes usa internamente.
    const mode = resolvedTheme === 'dark' ? set.dark : set.light;
    const root = document.documentElement;
    root.style.setProperty('--primary', mode.primary);
    root.style.setProperty('--primary-foreground', mode.primaryForeground);
    root.style.setProperty('--ring', mode.ring);
    root.style.setProperty('--accent', mode.accent);
    root.style.setProperty('--chart-1', mode.chart1);
    // A escala de superfície é a fonte da elevação; --background/--card/--popover
    // derivam dela para os componentes shadcn continuarem funcionando.
    const estados = primaryStates(mode, resolvedTheme === 'dark');
    root.style.setProperty('--primary-hover', estados.hover);
    root.style.setProperty('--primary-active', estados.active);
    const surfaces = surfaceScale(mode, resolvedTheme === 'dark');
    root.style.setProperty('--surface-0', surfaces.surface0);
    root.style.setProperty('--surface-1', surfaces.surface1);
    root.style.setProperty('--surface-2', surfaces.surface2);
    root.style.setProperty('--surface-3', surfaces.surface3);
    root.style.setProperty('--background', surfaces.surface0);
    root.style.setProperty('--card', surfaces.surface1);
    root.style.setProperty('--popover', surfaces.surface3);
    root.style.setProperty('--foreground', mode.foreground);
    root.style.setProperty('--card-foreground', mode.foreground);
    root.style.setProperty('--popover-foreground', mode.foreground);
    root.style.setProperty('--muted', mode.muted);
    root.style.setProperty('--muted-foreground', mode.mutedForeground);
    root.style.setProperty('--border', mode.border);
    root.style.setProperty('--input', mode.border);
  }, [color, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
