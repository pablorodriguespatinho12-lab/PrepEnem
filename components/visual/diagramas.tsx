'use client';
/* Desenhos de geometria em vetor (Pablo, 16/11/2026, na prévia do robô: "a parte do
   robô limpando e a divisão de um quarto, perfeito, é isso que eu queria").
   Cada um mostra o PORQUÊ de uma conta. Ficam num papel claro, como o quadro branco,
   então as cores são fixas e valem nos dois temas. Em repouso o desenho já está
   completo; o robô só anda no clique (Pablo tem "reduzir movimento" ligado). */
import { useEffect, useRef, useState } from 'react';
import type { NomeDiagrama } from '@/lib/visual/especificacao';
import { AGUA, CHAO, CORTE, LIMPO, PAPEL, ROBO, SECO, SUJO, TINTA, Texto, r, type Props } from './diagramas-base';
import { DESENHOS_PARECIDAS } from './diagramas-parecidas';

// O robô dá a volta encostado nas paredes e depois varre o meio em faixas da largura dele:
// o rastro limpo cobre tudo, menos as 4 pontinhas. Sem a volta, sobravam dentes nas laterais.
const CAMINHO = 'M50 50 H370 V370 H50 V50 V130 H370 V210 H50 V290 H370';
const DURACAO_MS = 6000;
function RoboLimpando({ rotulos }: Props) {
  const rastro = useRef<SVGPathElement>(null);
  const [fracao, setFracao] = useState(1);
  const [ponto, setPonto] = useState({ x: 370, y: 370 });
  const [rodando, setRodando] = useState(false);
  useEffect(() => {
    const p = rastro.current;
    if (!p) return;
    const total = p.getTotalLength();
    const pt = p.getPointAtLength(total * fracao);
    setPonto({ x: pt.x, y: pt.y });
  }, [fracao]);
  useEffect(() => {
    if (!rodando) return;
    const inicio = performance.now();
    let quadro = 0;
    const passo = (t: number) => {
      const f = Math.min(1, (t - inicio) / DURACAO_MS);
      setFracao(f);
      if (f < 1) quadro = requestAnimationFrame(passo); else setRodando(false);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [rodando]);
  const total = rastro.current?.getTotalLength() ?? 1;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 420 420" className="w-full max-w-[320px] h-auto" role="img" aria-label="robô limpando a sala em faixas">
        <rect x="10" y="10" width="400" height="400" fill={SUJO} />
        <path ref={rastro} d={CAMINHO} fill="none" stroke={LIMPO} strokeWidth={80} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={`${total * fracao} ${total}`} />
        <rect x="10" y="10" width="400" height="400" fill="none" stroke={TINTA} strokeWidth={6} />
        <circle cx={ponto.x} cy={ponto.y} r={40} fill={ROBO} />
        <circle cx={ponto.x + 12} cy={ponto.y - 10} r={7} fill={LIMPO} />
      </svg>
      {rotulos?.[0] && <span className="type-meta text-center" style={{ color: TINTA }}>{rotulos[0]}</span>}
      <button type="button" onClick={() => { setFracao(0); setRodando(true); }} disabled={rodando}
        className="rounded-[var(--radius-control)] bg-primary px-4 py-2 type-meta font-semibold text-primary-foreground disabled:opacity-50">
        Ver o robô limpar
      </button>
    </div>
  );
}

// Robô encostado no canto: o centro a r de cada parede, a pontinha rosa sem limpar.
function CantoZoom({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 270 270" className="w-full max-w-[300px] h-auto" role="img" aria-label="robô encostado no canto da sala">
      <rect x="20" y="20" width="240" height="240" fill={LIMPO} />
      <path d="M20 20 H140 A120 120 0 0 0 20 140 Z" fill={SUJO} />
      <circle cx="140" cy="140" r="120" fill={ROBO} opacity={0.85} />
      <path d="M20 20 H260 M20 20 V260" stroke={TINTA} strokeWidth={6} />
      <line x1="140" y1="140" x2="140" y2="20" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <line x1="140" y1="140" x2="20" y2="140" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <Texto x={146} y={86} ancora="start" cor={PAPEL}>{r(rotulos, 0, '20 cm')}</Texto>
      <Texto x={44} y={160} ancora="start" cor={PAPEL}>{r(rotulos, 1, '20 cm')}</Texto>
    </svg>
  );
}

// Sala quadrada com a medida dos lados (Aula do Robô Aspirador, 17/11/2026).
function SalaQuadrada({ rotulos }: Props) {
  const lado = r(rotulos, 0, '200 cm');
  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[300px] h-auto" role="img" aria-label="sala quadrada com a medida dos lados">
      <rect x="20" y="20" width="200" height="200" fill={CHAO} stroke={TINTA} strokeWidth={4} />
      <text x="120" y="14" textAnchor="middle" fontSize={13} fill={TINTA}>{lado}</text>
      <text x="232" y="124" textAnchor="middle" fontSize={13} fill={TINTA} transform="rotate(90 232 124)">{lado}</text>
    </svg>
  );
}

// O robô cortado em 4 fatias: o quadradinho do canto pega exatamente 1.
function RoboQuatroFatias() {
  const Quarto = ({ x, y, forte }: { x: number; y: number; forte?: boolean }) => (
    <text x={x} y={y} textAnchor="middle" fontSize={22} fontWeight={forte ? 800 : 400} fill={forte ? TINTA : '#5b6b5e'}>¼</text>
  );
  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[300px] h-auto" role="img" aria-label="robô cortado em 4 fatias iguais">
      <rect x="20" y="20" width="120" height="120" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <circle cx="140" cy="140" r="120" fill="none" stroke={ROBO} strokeWidth={4} />
      <path d="M140 140 V20 A120 120 0 0 0 20 140 Z" fill={LIMPO} />
      <line x1="140" y1="20" x2="140" y2="260" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <line x1="20" y1="140" x2="260" y2="140" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <path d="M20 20 H140 A120 120 0 0 0 20 140 Z" fill={SUJO} />
      <Quarto x={200} y={200} /><Quarto x={80} y={200} /><Quarto x={200} y={80} /><Quarto x={104} y={112} forte />
    </svg>
  );
}

// O raio é o lado do quadradinho do canto: sujo = quadradinho − 1/4 do círculo.
function CantoRaio({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 260 200" className="w-full max-w-[300px] h-auto" role="img" aria-label="quadradinho do canto com lado igual ao raio">
      <rect x="20" y="20" width="150" height="150" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <path d="M170 170 V20 A150 150 0 0 0 20 170 Z" fill={LIMPO} />
      <path d="M20 20 H170 A150 150 0 0 0 20 170 Z" fill={SUJO} />
      <rect x="20" y="20" width="150" height="150" fill="none" stroke={TINTA} strokeWidth={3} />
      <Texto x={95} y={192}>{r(rotulos, 0, 'r = 20')}</Texto>
      <Texto x={200} y={100} ancora="start">{r(rotulos, 1, 'r = 20')}</Texto>
    </svg>
  );
}

// Círculo que encosta nos 4 lados do quadrado: sobram 4 cantinhos.
function CirculoNoQuadrado({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] h-auto" role="img" aria-label="círculo dentro do quadrado, encostando nos lados">
      <rect x="30" y="30" width="240" height="240" fill={SECO} stroke={TINTA} strokeWidth={4} />
      <circle cx="150" cy="150" r="120" fill={AGUA} stroke={TINTA} strokeWidth={2} />
      <line x1="150" y1="150" x2="270" y2="150" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <circle cx="150" cy="150" r="5" fill={TINTA} />
      <Texto x={210} y={142}>{r(rotulos, 0, 'r = 20 m')}</Texto>
      <Texto x={150} y={22}>{r(rotulos, 1, 'lado = 40 m')}</Texto>
      <Texto x={150} y={292}>{r(rotulos, 2, 'amarelo: cantos secos')}</Texto>
    </svg>
  );
}

// Retângulo com a antena no centro: o canto fica na ponta da meia diagonal.
function RetanguloDiagonal({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-[320px] h-auto" role="img" aria-label="retângulo com a diagonal e a antena no centro">
      <circle cx="160" cy="130" r="100" fill={AGUA} opacity={0.45} />
      <rect x="80" y="70" width="160" height="120" fill="none" stroke={TINTA} strokeWidth={4} />
      <line x1="80" y1="190" x2="240" y2="70" stroke={CORTE} strokeWidth={3} />
      <circle cx="160" cy="130" r="6" fill={SUJO} />
      <Texto x={160} y={62}>{r(rotulos, 0, '1,6 km')}</Texto>
      <Texto x={250} y={134} ancora="start">{r(rotulos, 1, '1,2 km')}</Texto>
      <Texto x={160} y={250}>{r(rotulos, 2, 'meia diagonal = alcance')}</Texto>
    </svg>
  );
}

const DESENHOS: Record<NomeDiagrama, (p: Props) => JSX.Element> = {
  'sala-quadrada': SalaQuadrada, 'robo-limpando': RoboLimpando, 'canto-zoom': CantoZoom,
  'robo-quatro-fatias': RoboQuatroFatias, 'canto-raio': CantoRaio,
  'circulo-no-quadrado': CirculoNoQuadrado, 'retangulo-diagonal': RetanguloDiagonal,
  ...DESENHOS_PARECIDAS,
};

export function Diagrama({ nome, rotulos }: { nome: NomeDiagrama; rotulos?: string[] }) {
  const Desenho = DESENHOS[nome];
  return (
    <div className="flex justify-center rounded-[var(--radius-control)] p-3" style={{ background: PAPEL }}>
      <Desenho rotulos={rotulos} />
    </div>
  );
}
