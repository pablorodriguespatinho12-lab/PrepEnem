'use client';
// Lista de temas de redação (/api/redacao/themes), carregada uma vez pela tela
// inteira: o passo 1 mostra, o passo 2 usa para reconhecer o tema da lista.
import { useEffect, useState } from 'react';
export interface TemaDaLista { id: string; tema: string; anoEnem: number | null }
export function useTemas(): { temas: TemaDaLista[]; erro: boolean } {
  const [temas, setTemas] = useState<TemaDaLista[]>([]);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    let vivo = true;
    fetch('/api/redacao/themes')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (vivo) setTemas(Array.isArray(d?.themes) ? d.themes : []); })
      .catch(() => { if (vivo) setErro(true); });
    return () => { vivo = false; };
  }, []);
  return { temas, erro };
}
