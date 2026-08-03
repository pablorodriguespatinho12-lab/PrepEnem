'use client';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'prepenem-sound-enabled';
const CHANGE_EVENT = 'prepenem-sound-pref-change';

// Som desligado por padrão — autoplay de som é falha grave de UX. Só liga
// se o usuário explicitamente ativar no Perfil.
export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === 'true';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, String(enabled));
  // localStorage "storage" event não dispara na mesma aba que fez a
  // mudança — evento customizado avisa outros componentes montados
  // (ex.: o toggle no Perfil e o player em uso na tela de treino).
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: enabled }));
}

export function useSoundEnabled(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    setEnabledState(getSoundEnabled());
    const onChange = (e: Event) => setEnabledState(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  const update = useCallback((v: boolean) => setSoundEnabled(v), []);
  return [enabled, update];
}
