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
  carro: () => <><path d="M6 46 V34 L18 22 H44 L56 34 H64 V46 Z" fill={LIMPO} {...T} /><circle cx={20} cy={48} r={6} fill={TINTA} /><circle cx={50} cy={48} r={6} fill={TINTA} /><path d="M10 64 H60 M52 58 L60 64 L52 70" fill="none" stroke={SUJO} strokeWidth={3} /><Rot x={34} y={14}>v</Rot></>,
  onda: () => <><path d="M4 36 Q13 12 22 36 T40 36 T58 36 T68 30" fill="none" stroke={SUJO} strokeWidth={3} /><path d="M13 58 H49 M13 54 V62 M49 54 V62" fill="none" stroke={TINTA} strokeWidth={2} /><Rot x={31} y={72}>λ</Rot></>,
  termometro: () => <><rect x={30} y={6} width={12} height={46} rx={6} fill={PAPEL} {...T} /><circle cx={36} cy={58} r={10} fill={SUJO} {...T} /><rect x={33} y={26} width={6} height={30} fill={SUJO} /><Rot x={58} y={30}>T</Rot></>,
  lente: () => <><path d="M36 8 Q48 36 36 64 Q24 36 36 8 Z" fill={LIMPO} {...T} /><line x1={2} y1={36} x2={70} y2={36} stroke={CORTE} strokeDasharray="4 3" strokeWidth={2} /><circle cx={60} cy={36} r={3} fill={TINTA} /><Rot x={60} y={52}>f</Rot></>,
  texto: () => <><rect x={14} y={8} width={44} height={58} fill={PAPEL} {...T} />{[20, 30, 40, 50].map((y) => <line key={y} x1={22} y1={y} x2={y === 50 ? 40 : 50} y2={y} stroke={SUJO} strokeWidth={3} />)}</>,
  fala: () => <><path d="M8 12 H64 V46 H30 L18 60 V46 H8 Z" fill={LIMPO} {...T} /><Rot x={36} y={34}>“ ”</Rot></>,
  livro: () => <><path d="M36 18 C26 12 14 12 6 16 V60 C14 56 26 56 36 62 C46 56 58 56 66 60 V16 C58 12 46 12 36 18 Z" fill={PAPEL} {...T} /><line x1={36} y1={18} x2={36} y2={62} stroke={TINTA} strokeWidth={2} /></>,
  circuito: () => <><rect x={10} y={14} width={52} height={44} fill="none" {...T} /><rect x={24} y={8} width={24} height={12} fill={SECO} {...T} /><path d="M6 34 H14 M8 42 H12" stroke={TINTA} strokeWidth={3} /><Rot x={36} y={72}>R</Rot></>,
};

/* Grande o bastante para a caixa da aula "Não sei isso: ver a aula" (Pablo, 18/11/2026:
   "a imagem tá muito pequena"): era 64 px, feita só para o cartão da explicação. */
export function Formulas({ v }: { v: VisualFormulas }) {
  return (
    // Colunas pela largura de verdade (cabe 1 no cartão da explicação, 2 na aula larga):
    // 2 colunas fixas espremiam o texto a uma letra por linha no cartão (18/11/2026).
    <ul className="mx-auto grid w-full max-w-2xl gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>
      {v.itens.map((item) => {
        const Figura = FIGURAS[item.figura];
        return (
          <li key={`${item.figura}-${item.nome}`} className="flex items-center gap-4 rounded-[var(--radius-control)] p-3 sm:p-4" style={{ background: PAPEL, color: TINTA }}>
            <svg viewBox="0 0 72 76" className="h-16 w-16 shrink-0 sm:h-24 sm:w-24" role="img" aria-label={item.nome}><Figura /></svg>
            <div className="min-w-0">
              <p className="text-base font-semibold">{item.nome}</p>
              <p className="text-lg font-semibold tabular-nums sm:text-xl">{item.formula}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
