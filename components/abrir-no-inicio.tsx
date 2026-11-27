'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/* "Toda vez que eu entrar no site, eu quero entrar no início" (Pablo,
   27/11/2026): o navegador reabria a aba Estudar pelo endereço guardado.
   Vale só na ENTRADA (aba nova); recarregar ou navegar dentro do site não muda.
   Só as telas do menu: o link de uma prova ou baralho específico abre direto.
   Teste automático (webdriver) abre a tela que pediu. */
const TELAS_DO_MENU = ['/provas', '/flashcards', '/redacao', '/calculo', '/progresso', '/perfil', '/descobrir'];
const MARCA = 'prepenem-entrou';

export function AbrirNoInicio() {
  const caminho = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (navigator.webdriver) return;
    try {
      if (sessionStorage.getItem(MARCA)) return;
      sessionStorage.setItem(MARCA, '1');
    } catch {
      return; // sem armazenamento não dá para saber se é a entrada: fica onde está
    }
    const [navegacao] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navegacao?.type === 'reload') return;
    if (TELAS_DO_MENU.includes(caminho)) router.replace('/dashboard');
    // só a primeira tela conta; trocar de tela depois não dispara de novo (a marca barra)
  }, [caminho, router]);

  return null;
}
