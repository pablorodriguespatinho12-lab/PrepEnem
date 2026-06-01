'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { themeColors } from '@/lib/theme-colors';

interface ThemeContextType {
  color: string;
  setColor: (c: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({ color: 'purple', setColor: () => {} });

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() || {};
  const [color, setColor] = useState('purple');

  useEffect(() => {
    const tc = (session?.user as any)?.themeColor;
    if (tc && themeColors[tc]) {
      setColor(tc);
    }
  }, [session]);

  useEffect(() => {
    const tc = themeColors[color];
    if (!tc) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', tc.primaryHsl);
    root.style.setProperty('--ring', tc.ring);
  }, [color]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
