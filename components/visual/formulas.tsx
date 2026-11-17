'use client';
/* "As fórmulas desta questão" (Pablo, 17/11/2026: "a aula só mostra as fórmulas que
   eu vou ter que utilizar no exercício, com a imagenzinha: área do quadrado, triângulo,
   isso aqui está pronto"). Uma figurinha em vetor por fórmula, com o nome e a conta. */
import type { FiguraFormula, VisualFormulas } from '@/lib/visual/especificacao';
import { CHAO, CORTE, LIMPO, PAPEL, SECO, SUJO, TINTA } from './diagramas-base';

const T = { stroke: TINTA, strokeWidth: 3, strokeLinejoin: 'round' as const };
const Rot = ({ x, y, children }: { x: number; y: number; children: string }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={11} fontWeight={700} fill={CORTE}>{children}</text>
);

const FIGURAS: Record<FiguraFormula, () => JSX.Element> = {
  quadrado: () => <><rect x={14} y={14} width={44} height={44} fill={CHAO} {...T} /><Rot x={36} y={70}>l</Rot></>,
  retangulo: () => <><rect x={6} y={20} width={50} height={34} fill={CHAO} {...T} /><Rot x={31} y={67}>b</Rot><Rot x={64} y={41}>h</Rot></>,
  triangulo: () => <><path d="M36 10 L8 60 H64 Z" fill={CHAO} {...T} /><line x1={36} y1={10} x2={36} y2={60} stroke={CORTE} strokeDasharray="4 3" strokeWidth={2} /><Rot x={36} y={72}>b</Rot><Rot x={42} y={42}>h</Rot></>,
  'triangulo-retangulo': () => <><path d="M12 10 V60 H62 Z" fill={CHAO} {...T} /><path d="M12 52 H20 V60" fill="none" stroke={TINTA} strokeWidth={2} /><Rot x={37} y={72}>b</Rot><Rot x={4} y={38}>c</Rot><Rot x={44} y={30}>a</Rot></>,
  circulo: () => <><circle cx={36} cy={36} r={26} fill={LIMPO} {...T} /><line x1={36} y1={36} x2={62} y2={36} stroke={SUJO} strokeWidth={3} /><circle cx={36} cy={36} r={3} fill={TINTA} /><Rot x={49} y={30}>r</Rot></>,
  trapezio: () => <><path d="M22 16 H50 L66 58 H6 Z" fill={CHAO} {...T} /><Rot x={36} y={11}>b</Rot><Rot x={36} y={71}>B</Rot></>,
  cilindro: () => <><path d="M14 16 V56 A22 7 0 0 0 58 56 V16" fill={LIMPO} {...T} /><ellipse cx={36} cy={16} rx={22} ry={7} fill={LIMPO} {...T} /><Rot x={66} y={40}>h</Rot></>,
  caixa: () => <><path d="M10 24 L26 12 H64 V48 L48 60 H10 Z" fill={CHAO} {...T} /><path d="M10 24 H48 L64 12 M48 24 V60" fill="none" {...T} /></>,
  cone: () => <><path d="M36 8 L12 56 A24 7 0 0 0 60 56 Z" fill={SECO} {...T} /><line x1={36} y1={8} x2={36} y2={56} stroke={CORTE} strokeDasharray="4 3" strokeWidth={2} /><Rot x={42} y={38}>h</Rot></>,
  esfera: () => <><circle cx={36} cy={36} r={26} fill={LIMPO} {...T} /><ellipse cx={36} cy={36} rx={26} ry={8} fill="none" stroke={TINTA} strokeWidth={1.5} strokeDasharray="4 3" /></>,
  porcentagem: () => <><rect x={8} y={26} width={56} height={20} fill={PAPEL} {...T} /><rect x={8} y={26} width={21} height={20} fill={SUJO} /><rect x={8} y={26} width={56} height={20} fill="none" {...T} /><Rot x={36} y={64}>%</Rot></>,
  grafico: () => <><path d="M10 8 V62 H66" fill="none" {...T} /><path d="M14 54 L30 40 L44 44 L62 16" fill="none" stroke={SUJO} strokeWidth={3} /></>,
  contagem: () => <>{[0, 1, 2].map((i) => <circle key={i} cx={14 + i * 22} cy={36} r={8} fill={i === 1 ? SECO : LIMPO} {...T} />)}<Rot x={36} y={64}>× × ×</Rot></>,
  media: () => <>{[30, 46, 22, 40].map((h, i) => <rect key={i} x={8 + i * 15} y={62 - h} width={11} height={h} fill={LIMPO} {...T} />)}<line x1={4} y1={28} x2={68} y2={28} stroke={SUJO} strokeWidth={2.5} strokeDasharray="5 3" /></>,
};

export function Formulas({ v }: { v: VisualFormulas }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {v.itens.map((item) => {
        const Figura = FIGURAS[item.figura];
        return (
          <li key={`${item.figura}-${item.nome}`} className="flex items-center gap-3 rounded-[var(--radius-control)] p-2" style={{ background: PAPEL, color: TINTA }}>
            <svg viewBox="0 0 72 76" className="h-16 w-16 shrink-0" role="img" aria-label={item.nome}><Figura /></svg>
            <div className="min-w-0">
              <p className="type-meta font-semibold">{item.nome}</p>
              <p className="font-semibold tabular-nums">{item.formula}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
