'use client';
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; size: number;
  speedY: number; speedX: number; opacity: number;
  layer: number;
}

// Camadas de parallax: farthest → near. Quanto maior a camada, maior o
// tamanho e mais rápida a partícula (correlação size↔speed↔profundidade).
// Contagem total permanece 50 (apenas redistribuída), sem custo extra de
// desenho por frame.
const LAYER_CONFIGS = [
  { count: 20, sizeRange: [0.6, 1.3] as const, speedYRange: [0.08, 0.16] as const, speedXScale: 0.15, opacityRange: [0.05, 0.15] as const }, // farthest
  { count: 18, sizeRange: [1.3, 2.1] as const, speedYRange: [0.16, 0.32] as const, speedXScale: 0.25, opacityRange: [0.08, 0.2] as const }, // mid
  { count: 12, sizeRange: [2.1, 3.2] as const, speedYRange: [0.32, 0.55] as const, speedXScale: 0.35, opacityRange: [0.12, 0.3] as const }, // near
];

// Distância (em px) da borda superior/inferior onde a partícula esmaece,
// suavizando a entrada/saída em vez de um "pop" abrupto ao reciclar.
const FADE_MARGIN = 30;

function randomInRange([min, max]: readonly [number, number]): number {
  return Math.random() * (max - min) + min;
}

export function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches; };
    motionQuery.addEventListener('change', onMotionChange);

    // Init particles por camada. Com movimento normal, o y inicial é sorteado
    // num intervalo maior que a altura visível (canvas.height + 200, offset
    // -100) para que cada partícula comece sua jornada de reciclagem numa
    // fase diferente — evita que todas (em especial a camada "near", mais
    // rápida) pareçam reaparecer em sincronia a cada ciclo. Com reduced
    // motion já ativo no mount, as partículas nunca se movem para "corrigir"
    // essa distribuição, então usamos direto o intervalo visível para não
    // deixar ~18% delas congeladas fora da tela.
    particlesRef.current = LAYER_CONFIGS.flatMap((cfg, layer) =>
      Array.from({ length: cfg.count }, () => ({
        x: Math.random() * canvas.width,
        y: reducedMotionRef.current
          ? Math.random() * canvas.height
          : Math.random() * (canvas.height + 200) - 100,
        size: randomInRange(cfg.sizeRange),
        speedY: randomInRange(cfg.speedYRange),
        speedX: Math.sin(Math.random() * Math.PI * 2) * cfg.speedXScale,
        opacity: randomInRange(cfg.opacityRange),
        layer,
      }))
    );

    let visible = true;
    const onVisChange = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisChange);

    const animate = () => {
      if (!visible) { animRef.current = requestAnimationFrame(animate); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      const reduceMotion = reducedMotionRef.current;
      particlesRef.current.forEach(p => {
        if (!reduceMotion) {
          p.y -= p.speedY;
          p.x += p.speedX;
          if (p.y < -10) {
            p.y = canvas.height + Math.random() * 30;
            p.x = Math.random() * canvas.width;
          }
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        }

        // Fade suave perto das bordas (saída pelo topo / entrada por baixo)
        let fade = 1;
        if (p.y < FADE_MARGIN) {
          fade = Math.max(0, p.y / FADE_MARGIN);
        } else if (p.y > canvas.height - FADE_MARGIN) {
          fade = Math.max(0, (canvas.height - p.y) / FADE_MARGIN);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(150, 180, 255, ${p.opacity * fade})`
          : `rgba(100, 80, 180, ${p.opacity * 0.6 * fade})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisChange);
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
