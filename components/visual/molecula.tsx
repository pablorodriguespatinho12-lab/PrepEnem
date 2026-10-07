'use client';
// Molécula como mapa mental (Pablo, 07/10/2026, opção A): cada átomo desenhado
// de verdade (núcleo de bolinhas, camadas com elétrons girando, símbolo
// embaixo), uma linha até a etiqueta com a massa dele e a soma embaixo. Monta
// em ordem: átomos, ligações, etiquetas, soma. Só opacity e transform.

import { motion, useReducedMotion } from 'framer-motion';
import type { VisualMolecula } from '@/lib/visual/especificacao';
import { COR, HALO } from './grafico';

const LARGURA = 360;
const CENTRO = { x: 180, y: 150 };
const ESPACO = 34;
const ETIQUETA_ALTURA = 28;
const MARGEM = 12;

/* Número atômico dos elementos que mais caem no ENEM; o resto ganha 2 camadas. */
const NUMERO_ATOMICO: Record<string, number> = {
  H: 1, He: 2, Li: 3, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20,
};
const LIMITE_CAMADA = [2, 8, 8, 2];

function camadas(simbolo: string): number[] {
  let z = NUMERO_ATOMICO[simbolo] ?? 10;
  return LIMITE_CAMADA.flatMap((max) => {
    if (z <= 0) return [];
    const aqui = Math.min(z, max);
    z -= aqui;
    return [aqui];
  });
}
const raioDaCamada = (i: number) => 18 + i * 13;
const raioDoAtomo = (simbolo: string) => raioDaCamada(camadas(simbolo).length - 1) + 6;

interface Posicao { x: number; y: number; dx: number; dy: number }

/* O primeiro fica no meio; os outros em volta, da direita para a esquerda
   por baixo, para o alto ficar livre para a etiqueta do átomo do meio. */
function posicoes(v: VisualMolecula): Posicao[] {
  const [meio, ...resto] = v.atomos;
  const r0 = raioDoAtomo(meio.simbolo);
  const angulos = resto.length === 1 ? [0]
    : resto.length <= 3 ? resto.map((_, i) => Math.PI * (0.15 + (0.7 * i) / (resto.length - 1)))
      : resto.map((_, i) => (Math.PI * i) / (resto.length - 1));
  const centro = resto.length === 1 ? { x: CENTRO.x - 60, y: CENTRO.y } : CENTRO;
  return [
    { x: centro.x, y: centro.y, dx: 0, dy: -1 },
    ...resto.map((a, i) => {
      const d = r0 + raioDoAtomo(a.simbolo) + ESPACO;
      const dx = Math.cos(angulos[i]);
      const dy = Math.sin(angulos[i]);
      return { x: centro.x + dx * d, y: centro.y + dy * d, dx, dy };
    }),
  ];
}

const corDoElemento = (simbolos: string[]) => {
  const distintos = Array.from(new Set(simbolos));
  const paleta = [COR.b, COR.a, COR.c];
  return (s: string) => paleta[distintos.indexOf(s) % paleta.length];
};

function Atomo({ simbolo, x, y, cor, girar }: { simbolo: string; x: number; y: number; cor: string; girar: boolean }) {
  const z = NUMERO_ATOMICO[simbolo] ?? 10;
  const bolinhas = Math.min(z * 2 - 1, 15);
  const raioNucleo = 3 + Math.sqrt(bolinhas) * 1.6;
  return (
    <g>
      <circle cx={x} cy={y} r={raioDoAtomo(simbolo) + 2} fill={cor} fillOpacity={0.08} />
      {camadas(simbolo).map((qtd, i) => {
        const r = raioDaCamada(i);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="none" stroke={cor} strokeOpacity={0.45} strokeDasharray="2 3" />
            <g style={girar ? { animation: `girar ${7 + i * 3}s linear infinite`, transformOrigin: `${x}px ${y}px` } : undefined}>
              {Array.from({ length: qtd }, (_, k) => (
                <circle key={k} cx={x + r * Math.cos((2 * Math.PI * k) / qtd)} cy={y + r * Math.sin((2 * Math.PI * k) / qtd)} r={3.2} fill={cor} />
              ))}
            </g>
          </g>
        );
      })}
      {Array.from({ length: bolinhas }, (_, k) => {
        const ang = k * 2.4;
        const rad = raioNucleo * Math.sqrt(k / bolinhas) * 0.9;
        return <circle key={k} cx={x + rad * Math.cos(ang)} cy={y + rad * Math.sin(ang)} r={3.4}
          fill={k % 2 === 0 ? cor : 'hsl(var(--muted-foreground))'} stroke="hsl(var(--surface-2))" strokeWidth={1} />;
      })}
    </g>
  );
}

export function Molecula({ v }: { v: VisualMolecula }) {
  const reduzir = useReducedMotion() ?? false;
  const pos = posicoes(v);
  const cor = corDoElemento(v.atomos.map((a) => a.simbolo));
  const etiquetas = v.atomos.map((a, i) => {
    const p = pos[i];
    const r = raioDoAtomo(a.simbolo);
    const texto = a.massa !== undefined ? `${a.simbolo}: massa ${a.massa.toLocaleString('pt-BR')}` : a.simbolo;
    const largura = texto.length * 7.4 + 22;
    // Átomo de baixo: etiqueta embaixo, depois do símbolo; os outros: em cima,
    // puxada para fora. Assim a etiqueta nunca cobre a letra do átomo.
    const embaixo = i > 0 && p.dy > 0.5;
    const cx = Math.min(Math.max(p.x + p.dx * 18, largura / 2 + MARGEM), LARGURA - largura / 2 - MARGEM);
    const cy = embaixo ? p.y + r + 48 : Math.max(p.y - r - 26, ETIQUETA_ALTURA / 2 + MARGEM + 18);
    const de = embaixo ? { x: p.x + r * 0.7, y: p.y + r * 0.7 } : { x: p.x + p.dx * r * 0.7, y: p.y - r * 0.7 };
    return { texto, largura, cx, cy, de };
  });
  const somaY = Math.max(...pos.map((p, i) => p.y + raioDoAtomo(v.atomos[i].simbolo) + 26), ...etiquetas.map((e) => e.cy + ETIQUETA_ALTURA)) + 20;
  const altura = somaY + (v.soma ? 52 : 0);
  const total = v.atomos.reduce((t, a) => t + (a.massa ?? 0), 0);
  const conta = `${v.atomos.map((a) => (a.massa ?? 0).toLocaleString('pt-BR')).join(' + ')} = ${total.toLocaleString('pt-BR')}`;

  const entra = (atraso: number) => (reduzir
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: atraso } });
  const passoAtomo = 0.35;
  const depoisDosAtomos = v.atomos.length * passoAtomo + 0.2;

  return (
    <svg viewBox={`0 0 ${LARGURA} ${altura}`} className="w-full h-auto max-w-md mx-auto" role="img"
      aria-label={`${v.nome ?? 'Molécula'}: ${v.atomos.map((a) => a.simbolo).join(', ')}${v.soma ? `. Massa: ${conta}` : ''}`}>
      {v.nome && <text x={LARGURA / 2} y={20} textAnchor="middle" fontSize={13} fill="hsl(var(--muted-foreground))">{v.nome}</text>}
      <motion.g {...entra(depoisDosAtomos - 0.2)}>
        {pos.slice(1).map((p, i) => (
          <line key={i} x1={pos[0].x + p.dx * raioDoAtomo(v.atomos[0].simbolo)} y1={pos[0].y + p.dy * raioDoAtomo(v.atomos[0].simbolo)}
            x2={p.x - p.dx * raioDoAtomo(v.atomos[i + 1].simbolo)} y2={p.y - p.dy * raioDoAtomo(v.atomos[i + 1].simbolo)}
            stroke="hsl(var(--muted-foreground))" strokeWidth={4} strokeLinecap="round" />
        ))}
      </motion.g>
      {v.atomos.map((a, i) => (
        <motion.g key={i} {...entra(i * passoAtomo)}>
          <Atomo simbolo={a.simbolo} x={pos[i].x} y={pos[i].y} cor={cor(a.simbolo)} girar={!reduzir} />
          <text x={pos[i].x} y={pos[i].y + raioDoAtomo(a.simbolo) + 18} textAnchor="middle" fontSize={15} fontWeight={700} fill={cor(a.simbolo)} {...HALO}>{a.simbolo}</text>
        </motion.g>
      ))}
      {etiquetas.map((e, i) => {
        const c = cor(v.atomos[i].simbolo);
        const atraso = depoisDosAtomos + i * 0.3;
        return (
          <g key={`e${i}`}>
            <motion.path d={`M${e.de.x},${e.de.y} L${e.cx},${e.cy + (e.cy < e.de.y ? ETIQUETA_ALTURA / 2 : -ETIQUETA_ALTURA / 2)}`}
              fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round"
              initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: atraso }} />
            <motion.circle cx={e.de.x} cy={e.de.y} r={3.5} fill={c} {...entra(atraso)} />
            <motion.g {...entra(atraso + 0.4)}>
              <rect x={e.cx - e.largura / 2} y={e.cy - ETIQUETA_ALTURA / 2} width={e.largura} height={ETIQUETA_ALTURA} rx={ETIQUETA_ALTURA / 2}
                fill="hsl(var(--surface-1))" stroke={c} strokeWidth={1.5} />
              <text x={e.cx} y={e.cy + 5} textAnchor="middle" fontSize={13.5} fontWeight={700} fill={c}>{e.texto}</text>
            </motion.g>
          </g>
        );
      })}
      {v.soma && (
        <motion.g {...entra(depoisDosAtomos + v.atomos.length * 0.3 + 0.5)}>
          <rect x={LARGURA / 2 - (conta.length * 5 + 24)} y={somaY} width={conta.length * 10 + 48} height={40} rx={10} fill="hsl(var(--primary) / 0.14)" />
          <text x={LARGURA / 2} y={somaY + 26} textAnchor="middle" fontSize={17} fontWeight={700} fill="hsl(var(--foreground))">{conta}</text>
        </motion.g>
      )}
    </svg>
  );
}
