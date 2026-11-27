'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import { CAMADAS, montarCena } from '@/lib/jardim/cena';
import { useMundoAnimado } from '@/hooks/use-mundo-animado';

/* Texto fixo do próprio código (nada do usuário entra aqui). */
const FUNDO = { __html: montarCena() };
const QUADRO = { viewBox: '0 0 1000 480', preserveAspectRatio: 'xMidYMid slice' };
const PAUSA_DEPOIS_DE_ROLAR = 180;

/* Cena viva da capa no modo Jardim. Para fora da tela, com a aba escondida e
   durante a rolagem (skill medir-fluidez); desliga junto com o mundo animado
   em Perfil. */
export function CenaJardim() {
  const ref = useRef<HTMLDivElement>(null);
  const { animado } = useMundoAnimado();

  useEffect(() => {
    const cena = ref.current;
    if (!cena) return;
    let visivel = true;
    let rolando = false;
    let fim: ReturnType<typeof setTimeout> | undefined;
    const aplicar = () => {
      cena.toggleAttribute('data-pausada', !visivel || document.hidden);
      cena.toggleAttribute('data-rolando', rolando);
    };
    const olho = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; aplicar(); });
    const aoRolar = () => {
      clearTimeout(fim);
      if (!rolando) { rolando = true; aplicar(); }
      fim = setTimeout(() => { rolando = false; aplicar(); }, PAUSA_DEPOIS_DE_ROLAR);
    };
    olho.observe(cena);
    window.addEventListener('scroll', aoRolar, { passive: true });
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      clearTimeout(fim);
      olho.disconnect();
      window.removeEventListener('scroll', aoRolar);
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, []);

  return (
    <div ref={ref} className="jv-cena" data-animada={animado ? 'sim' : 'nao'} aria-hidden>
      <svg {...QUADRO} className="jv-fundo" dangerouslySetInnerHTML={FUNDO} />
      {CAMADAS.map((c, i) => (
        <svg key={i} {...QUADRO} className={c.classe} style={c.estilo as CSSProperties} dangerouslySetInnerHTML={{ __html: c.desenho }} />
      ))}
    </div>
  );
}
