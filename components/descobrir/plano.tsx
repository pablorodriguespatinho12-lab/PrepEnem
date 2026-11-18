/* Plano cartesiano das aulas da aba Descobrir: grade, eixos com nome, pontos que
   aparecem um a um, reta que se desenha, triângulo Δx/Δy, área pintada e o carro em
   pixel que desliza pela reta deixando o rastro (amostra aprovada, 17/11/2026). */
import type { CSSProperties } from 'react';
import { tempo } from './pecas';

export type Ponto = [number, number];
type Cor = 'az' | 'lj' | 'vd' | 'teal';
const COR: Record<Cor, string> = { az: 'var(--dsc-az)', lj: 'var(--dsc-lj)', vd: 'var(--dsc-vd)', teal: 'var(--dsc-teal)' };

export interface Eixo { max: number; passo: number; nome: string; unidade?: string; min?: number }
export interface Segmento { de: Ponto; para: Ponto; cor: Cor; rotulo?: string; lado?: 'cima' | 'baixo' | 'direita' | 'esquerda' }

export interface PlanoProps {
  x: Eixo;
  y: Eixo;
  rotulo: string;
  pontos?: Ponto[];
  /** Segunda série, em laranja (o que multiplica, na PA × PG). */
  pontos2?: Ponto[];
  /** Tracinhos do ponto até os dois eixos, com o valor de cada um. */
  guias?: boolean;
  reta?: [Ponto, Ponto];
  segmentos?: Segmento[];
  /** Polígono pintado (a área embaixo do gráfico). */
  area?: Ponto[];
  areaRotulo?: { em: Ponto; texto: string };
  /** O carro sai do 1º ponto e chega no último, passando por todos no ritmo. */
  carro?: boolean;
  ritmo?: number;
}

const L = { esq: 34, dir: 290, cima: 16, baixo: 195 };

export function Plano({ x, y, rotulo, pontos = [], pontos2 = [], guias, reta, segmentos = [], area, areaRotulo, carro, ritmo = 0.25 }: PlanoProps) {
  const x0 = x.min ?? 0;
  const y0 = y.min ?? 0;
  const px = (v: number) => L.esq + ((v - x0) / (x.max - x0)) * (L.dir - L.esq);
  const py = (v: number) => L.baixo - ((v - y0) / (y.max - y0)) * (L.baixo - L.cima);
  const P = ([a, b]: Ponto) => [px(a), py(b)] as const;
  const marcas = (e: Eixo) => Array.from({ length: Math.floor(((e.max - (e.min ?? 0)) / e.passo) + 1e-9) + 1 }, (_, i) => (e.min ?? 0) + i * e.passo);
  const viagem = (pontos.length - 1) * ritmo;
  const fmt = (v: number) => String(v).replace('.', ',');

  return (
    <svg className="dsc-graf" viewBox="0 0 310 232" role="img" aria-label={rotulo}>
      {marcas(x).map((v) => (
        <g key={`x${v}`}>
          <line x1={px(v)} y1={L.cima} x2={px(v)} y2={L.baixo} stroke="var(--dsc-grade)" strokeWidth={1} />
          <text x={px(v)} y={212} textAnchor="middle" fontSize={12} fill="var(--dsc-suave)">{fmt(v)}</text>
        </g>
      ))}
      {marcas(y).map((v) => (
        <g key={`y${v}`}>
          <line x1={L.esq} y1={py(v)} x2={L.dir} y2={py(v)} stroke="var(--dsc-grade)" strokeWidth={1} />
          <text x={L.esq - 6} y={py(v) + 4} textAnchor="end" fontSize={12} fill="var(--dsc-suave)">{fmt(v)}</text>
        </g>
      ))}
      <line x1={L.esq} y1={L.baixo} x2={L.dir + 5} y2={L.baixo} stroke="var(--dsc-tinta)" strokeWidth={2} />
      <line x1={L.esq} y1={L.cima - 6} x2={L.esq} y2={L.baixo} stroke="var(--dsc-tinta)" strokeWidth={2} />
      <text x={L.dir + 4} y={228} textAnchor="end" fontSize={12} fontWeight={800} fill="var(--dsc-tinta)">{x.nome}{x.unidade ? ` (${x.unidade})` : ''}</text>
      <text x={L.esq + 4} y={11} fontSize={12} fontWeight={800} fill="var(--dsc-tinta)">{y.nome}{y.unidade ? ` (${y.unidade})` : ''}</text>

      {area && (
        <polygon className="dsc-a dsc-aparece" style={tempo(0.8)} points={area.map((p) => P(p).join(',')).join(' ')}
          fill="var(--dsc-teal)" fillOpacity={0.28} stroke="var(--dsc-teal)" strokeWidth={2} />
      )}
      {areaRotulo && (
        <text className="dsc-a dsc-aparece" style={tempo(0.6, 0.6)} x={P(areaRotulo.em)[0]} y={P(areaRotulo.em)[1]} textAnchor="middle"
          fontSize={15} fontWeight={800} fill="var(--dsc-tinta)">{areaRotulo.texto}</text>
      )}
      {reta && <line className="dsc-a dsc-traco" style={tempo(1)} x1={P(reta[0])[0]} y1={P(reta[0])[1]} x2={P(reta[1])[0]} y2={P(reta[1])[1]} stroke="var(--dsc-teal)" strokeWidth={3} />}
      {carro && pontos.length > 1 && <Rastro de={P(pontos[0])} para={P(pontos[pontos.length - 1])} dur={viagem} />}
      {segmentos.map((s, i) => <SegmentoComRotulo key={i} s={s} de={P(s.de)} para={P(s.para)} />)}

      {pontos.map((p, i) => {
        const [a, b] = P(p);
        const atraso = i * ritmo;
        return (
          <g key={i}>
            {guias && (
              <g className="dsc-a dsc-aparece" style={tempo(0.4, atraso)}>
                <line x1={a} y1={b} x2={a} y2={L.baixo} stroke="var(--dsc-az)" strokeWidth={2} strokeDasharray="4 4" />
                <line x1={a} y1={b} x2={L.esq} y2={b} stroke="var(--dsc-lj)" strokeWidth={2} strokeDasharray="4 4" />
                <text x={L.esq + 4} y={b - 4} fontSize={12} fontWeight={800} fill="var(--dsc-lj)">{fmt(p[1])}</text>
                <text x={a + 4} y={L.baixo - 5} fontSize={12} fontWeight={800} fill="var(--dsc-az)">{fmt(p[0])}</text>
              </g>
            )}
            <rect className="dsc-a dsc-aparece" style={tempo(0.3, atraso)} x={a - 5} y={b - 5} width={10} height={10} fill="var(--dsc-tinta)" />
          </g>
        );
      })}
      {pontos2.map((p, i) => (
        <rect key={`b${i}`} className="dsc-a dsc-aparece" style={tempo(0.3, i * ritmo)} x={P(p)[0] - 5} y={P(p)[1] - 5} width={10} height={10} fill="var(--dsc-lj)" />
      ))}
      {carro && pontos.length > 1 && <Carro de={P(pontos[0])} para={P(pontos[pontos.length - 1])} dur={viagem} />}
    </svg>
  );
}

function SegmentoComRotulo({ s, de, para }: { s: Segmento; de: readonly [number, number]; para: readonly [number, number] }) {
  const meio = [(de[0] + para[0]) / 2, (de[1] + para[1]) / 2];
  const lado = s.lado ?? (de[1] === para[1] ? 'baixo' : 'direita');
  const pos = { baixo: [meio[0], meio[1] + 18, 'middle'], cima: [meio[0], meio[1] - 8, 'middle'], direita: [meio[0] + 8, meio[1] + 5, 'start'], esquerda: [meio[0] - 8, meio[1] + 5, 'end'] }[lado];
  return (
    <g>
      <line className="dsc-a dsc-traco" style={tempo(1)} x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} stroke={COR[s.cor]} strokeWidth={5} />
      {s.rotulo && <text x={pos[0] as number} y={pos[1] as number} textAnchor={pos[2] as 'middle'} fontSize={15} fontWeight={800} fill={COR[s.cor]}>{s.rotulo}</text>}
    </g>
  );
}

/* O rastro cresce junto com o carro, sem pular. */
function Rastro({ de, para, dur }: { de: readonly [number, number]; para: readonly [number, number]; dur: number }) {
  const len = Math.hypot(para[0] - de[0], para[1] - de[1]);
  return <line className="dsc-a dsc-rastro" style={{ ...tempo(dur), '--len': len } as CSSProperties} x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} stroke="var(--dsc-teal)" strokeWidth={3} />;
}

/* Carro em pixel, inclinado como a reta, que para no último ponto. */
function Carro({ de, para, dur }: { de: readonly [number, number]; para: readonly [number, number]; dur: number }) {
  const ang = (Math.atan2(para[1] - de[1], para[0] - de[0]) * 180) / Math.PI;
  const estilo = { ...tempo(dur), '--x1': `${de[0]}px`, '--y1': `${de[1]}px`, '--x2': `${para[0]}px`, '--y2': `${para[1]}px` } as CSSProperties;
  return (
    <g className="dsc-a dsc-viagem" style={estilo}>
      <g transform={`rotate(${ang.toFixed(1)}) translate(0,-6)`}>
        <rect x={-14} y={-8} width={28} height={8} fill="var(--dsc-lj)" />
        <rect x={-8} y={-14} width={14} height={6} fill="var(--dsc-lj)" />
        <rect x={-4} y={-12} width={8} height={3} fill="hsl(var(--surface-1))" />
        <rect x={-11} y={0} width={6} height={5} fill="var(--dsc-tinta)" />
        <rect x={5} y={0} width={6} height={5} fill="var(--dsc-tinta)" />
      </g>
    </g>
  );
}
