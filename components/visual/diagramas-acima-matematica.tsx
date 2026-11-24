'use client';
/* Desenhos novos do nível acima v2 (matematica), 24/11/2026. Regras e cores: ver diagramas-nivel-acima.tsx.
   Rótulos com valor padrão = DADO do enunciado (aparecem sempre); os sem padrão (dado()) = RESULTADO, só quando a tela da conta os manda. */
import { AGUA, CHAO, CORTE, LIMPO, PAPEL, SECO, SUJO, TINTA, Texto, r, type Props } from './diagramas-base';

const dado = (rotulos: string[] | undefined, i: number) => rotulos?.[i] || '';

// Linha de medida com tracinhos nas pontas (horizontal ou vertical).
const Medida = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  const horizontal = y1 === y2;
  const t = 6;
  return (
    <g stroke={TINTA} strokeWidth={2}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {horizontal ? (<><line x1={x1} y1={y1 - t} x2={x1} y2={y1 + t} /><line x1={x2} y1={y2 - t} x2={x2} y2={y2 + t} /></>)
        : (<><line x1={x1 - t} y1={y1} x2={x1 + t} y2={y1} /><line x1={x2 - t} y1={y2} x2={x2 + t} y2={y2} /></>)}
    </g>
  );
};

// Planta e duas cópias: o desenho do terreno em 3 folhas de tamanhos diferentes. Dados: 1 : 30 000, 50%, 150%, 17,5 cm². Contas: só com rotulos.
const TERRENO: [number, number][] = [[0.15, 0.3], [0.45, 0.12], [0.8, 0.2], [0.88, 0.55], [0.6, 0.85], [0.25, 0.78]];
function TerrenoEscala({ rotulos }: Props) {
  const folhas = [
    { x: 15, y: 76, w: 130, h: 94, nome: 'planta original', nota: 'escala 1 : 30 000' },
    { x: 205, y: 123, w: 65, h: 47, nome: '1ª cópia', nota: '50% da planta' },
    { x: 345, y: 100, w: 98, h: 70, nome: '2ª cópia (final)', nota: '150% da 1ª cópia' },
  ];
  const conta1 = dado(rotulos, 1);
  const conta2 = dado(rotulos, 2);
  return (
    <svg viewBox={`0 0 460 ${conta1 ? 270 : 228}`} className="w-full max-w-[460px] h-auto" role="img" aria-label="planta original em escala 1 para 30 000, reduzida a 50% na 1ª cópia e ampliada a 150% da 1ª cópia na 2ª cópia, com o terreno desenhado em cada folha">
      {folhas.map((f) => (
        <g key={f.nome}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={PAPEL} stroke={TINTA} strokeWidth={3} />
          <polygon points={TERRENO.map(([u, v]) => `${f.x + u * f.w},${f.y + v * f.h}`).join(' ')} fill={LIMPO} stroke={TINTA} strokeWidth={2} strokeLinejoin="round" />
          <Texto x={f.x + f.w / 2} y={192} tam={14}>{f.nome}</Texto>
          <Texto x={f.x + f.w / 2} y={210} tam={12}>{f.nota}</Texto>
        </g>
      ))}
      <Texto x={394} y={144} tam={12}>{r(rotulos, 0, '17,5 cm²')}</Texto>
      {[[150, 200, '50%'], [275, 340, '150%']].map(([a, b, t]) => (
        <g key={t}>
          <line x1={Number(a)} y1={146} x2={Number(b)} y2={146} stroke={CORTE} strokeWidth={3} />
          <path d={`M${Number(b) - 9} 140 L${Number(b)} 146 L${Number(b) - 9} 152`} fill="none" stroke={CORTE} strokeWidth={3} />
          <Texto x={(Number(a) + Number(b)) / 2 - 3} y={134} tam={14} cor={CORTE}>{String(t)}</Texto>
        </g>
      ))}
      {conta1 && <Texto x={230} y={242} tam={14}>{conta1}</Texto>}
      {conta2 && <Texto x={230} y={262} tam={14}>{conta2}</Texto>}
    </svg>
  );
}

// Lúnulas: triângulo XYZ reto em X (XY = 8, YZ = 17, XZ = 15 só como resultado), semicírculos nos catetos e a circunferência Γ de diâmetro YZ.
// Escala 12 px por cm. A parte dos semicírculos que fica fora de Γ é a pedida.
function Lunulas({ rotulos }: Props) {
  const ac = dado(rotulos, 2);
  const conta = dado(rotulos, 3);
  const meio = dado(rotulos, 5);
  return (
    <svg viewBox={`0 0 430 ${328 + (conta ? 22 : 0) + (meio ? 22 : 0)}`} className="w-full max-w-[430px] h-auto" role="img" aria-label="triângulo retângulo XYZ com semicírculos sobre os catetos XY e XZ e a circunferência Γ de diâmetro YZ; a parte dos semicírculos fora de Γ está pintada">
      <path d="M160 104 A48 48 0 0 0 160 200 Z" fill={SUJO} />
      <path d="M160 200 A90 90 0 0 0 340 200 Z" fill={SUJO} />
      <circle cx="250" cy="152" r="102" fill={PAPEL} />
      <path d="M160 104 A48 48 0 0 0 160 200 Z" fill="none" stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <path d="M160 200 A90 90 0 0 0 340 200 Z" fill="none" stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <circle cx="250" cy="152" r="102" fill="none" stroke={CORTE} strokeWidth={3.5} />
      <path d="M160 104 V200 H340 Z" fill={CHAO} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <path d="M160 104 L340 200" stroke={CORTE} strokeWidth={4} />
      <path d="M160 190 H170 V200" fill="none" stroke={TINTA} strokeWidth={2} />
      <Texto x={148} y={100} ancora="end">Y</Texto>
      <Texto x={150} y={224} ancora="end">X</Texto>
      <Texto x={350} y={192} ancora="start">Z</Texto>
      <Texto x={103} y={158} ancora="end">{r(rotulos, 0, '8 cm')}</Texto>
      <Texto x={268} y={118} ancora="start">{r(rotulos, 1, '17 cm')}</Texto>
      {ac && <Texto x={250} y={186} tam={14}>{ac}</Texto>}
      <Texto x={316} y={64} cor={CORTE} tam={20}>Γ</Texto>
      <Texto x={215} y={318} tam={13}>{r(rotulos, 4, 'rosa: a parte dos semicírculos que fica fora de Γ')}</Texto>
      {conta && <Texto x={215} y={338} tam={13}>{conta}</Texto>}
      {meio && <Texto x={215} y={conta ? 360 : 338} tam={13}>{meio}</Texto>}
    </svg>
  );
}

// Praça ABCD (A embaixo à esquerda, sentido anti-horário) com P no meio, ligado aos 4 vértices. O dado é só "AB = AD + 8" e o perímetro; 20 e 12 são resultado.
// A e B embaixo, C e D em cima (sentido anti-horário).
function PracaQuatroTriangulos({ rotulos }: Props) {
  const A = [50, 196], B = [310, 196], C = [310, 40], D = [50, 40], P = [148, 118];
  const tri = (a: number[], b: number[]) => `${a[0]},${a[1]} ${b[0]},${b[1]} ${P[0]},${P[1]}`;
  const soma = dado(rotulos, 2);
  return (
    <svg viewBox={`0 0 380 ${soma ? 320 : 292}`} className="w-full max-w-[380px] h-auto" role="img" aria-label="praça retangular ABCD com o ponto P dentro, ligado aos 4 vértices: flores no triângulo de baixo, grama no de cima e pedras nos dois das laterais">
      <polygon points={tri(A, B)} fill={SUJO} fillOpacity={0.75} />
      <polygon points={tri(D, C)} fill={LIMPO} />
      <polygon points={tri(B, C)} fill={CHAO} />
      <polygon points={tri(D, A)} fill={CHAO} />
      <rect x="50" y="40" width="260" height="156" fill="none" stroke={TINTA} strokeWidth={4} />
      <g stroke={TINTA} strokeWidth={2.5}>
        <line x1={A[0]} y1={A[1]} x2={P[0]} y2={P[1]} /><line x1={B[0]} y1={B[1]} x2={P[0]} y2={P[1]} />
        <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} /><line x1={D[0]} y1={D[1]} x2={P[0]} y2={P[1]} />
      </g>
      <line x1={P[0]} y1={P[1]} x2={P[0]} y2={40} stroke={CORTE} strokeWidth={3.5} strokeDasharray="6 4" />
      <circle cx={P[0]} cy={P[1]} r="6" fill={TINTA} />
      <Texto x={P[0] + 10} y={P[1] + 4} ancora="start" tam={16}>P</Texto>
      <Texto x={P[0] + 8} y={84} ancora="start" tam={14} cor={CORTE}>{r(rotulos, 3, '?')}</Texto>
      <Texto x={40} y={214} ancora="end">A</Texto>
      <Texto x={320} y={214} ancora="start">B</Texto>
      <Texto x={320} y={36} ancora="start">C</Texto>
      <Texto x={40} y={36} ancora="end">D</Texto>
      <Texto x={180} y={172} tam={13}>flores · R$ 40</Texto>
      <Texto x={180} y={58} tam={13}>grama · R$ 10</Texto>
      <Texto x={252} y={112} tam={13}>pedras</Texto><Texto x={252} y={130} tam={13}>R$ 25</Texto>
      <Texto x={92} y={106} tam={12}>pedras</Texto><Texto x={92} y={122} tam={12}>R$ 25</Texto>
      <Texto x={180} y={240} tam={14}>{r(rotulos, 0, 'AB = AD + 8 m · perímetro 64 m')}</Texto>
      <Texto x={22} y={122} tam={13} ancora="middle">{dado(rotulos, 1)}</Texto>
      <Texto x={180} y={264} tam={13} cor={CORTE}>tracejado: a distância pedida, de P a CD</Texto>
      {soma && <Texto x={190} y={288} tam={13}>{soma}</Texto>}
      {soma && <Texto x={190} y={308} tam={13}>{dado(rotulos, 4)}</Texto>}
    </svg>
  );
}

// Copo cone (ponta para baixo): 10 cm de diâmetro, 9 cm de altura, suco até 80% da altura. Razão 0,8 e as medidas do cone menor: só com rotulos.
function CopoCone80({ rotulos }: Props) {
  const alt = dado(rotulos, 0);
  const larg = dado(rotulos, 1);
  return (
    <svg viewBox="0 0 450 300" className="w-full max-w-[450px] h-auto" role="img" aria-label="copo em forma de cone com a ponta para baixo, 10 centímetros de diâmetro e 9 de altura, com suco até 80% da altura formando um cone menor do mesmo formato">
      <path d="M140 50 H340 L240 230 Z" fill={PAPEL} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <path d="M160 86 H320 L240 230 Z" fill={AGUA} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <line x1="160" y1="86" x2="320" y2="86" stroke={CORTE} strokeWidth={3} />
      <Medida x1={140} y1={34} x2={340} y2={34} />
      <Texto x={240} y={26}>{r(rotulos, 2, '10 cm')}</Texto>
      <Medida x1={372} y1={50} x2={372} y2={230} />
      <Texto x={382} y={146} ancora="start">{r(rotulos, 3, '9 cm')}</Texto>
      <Medida x1={112} y1={86} x2={112} y2={230} />
      <Texto x={104} y={150} ancora="end" tam={13}>suco: 80%</Texto>
      <Texto x={104} y={168} ancora="end" tam={13}>da altura</Texto>
      {alt && <Texto x={104} y={190} ancora="end" tam={14} cor={CORTE}>{alt}</Texto>}
      {larg && <Texto x={240} y={112} tam={14}>{larg}</Texto>}
      <Texto x={240} y={158} tam={13}>suco</Texto>
      <Texto x={210} y={270} tam={13}>{r(rotulos, 4, 'o suco forma um cone menor, do mesmo formato do copo')}</Texto>
    </svg>
  );
}

// Esferas de raio r: ficam sempre as mesmas 8, o que muda é a embalagem. Cada esfera é um círculo na vista de frente.
const Bola = ({ cx, cy, rr, fundo = SECO, opaco = 1 }: { cx: number; cy: number; rr: number; fundo?: string; opaco?: number }) => (
  <circle cx={cx} cy={cy} r={rr} fill={fundo} fillOpacity={opaco} stroke={TINTA} strokeWidth={2.5} />
);

// Caixa cúbica em perspectiva simples: 2 camadas (frente e fundo) de 4 bolas (2 por 2). A aresta 4r só com rotulos.
function CaixaBolas2x2x2({ rotulos }: Props) {
  const aresta = dado(rotulos, 1);
  const frente = [[76, 136], [148, 136], [76, 208], [148, 208]];
  const fundo = frente.map(([x, y]) => [x + 54, y - 40]);
  return (
    <svg viewBox="0 0 330 316" className="w-full max-w-[330px] h-auto" role="img" aria-label="caixa cúbica vista em perspectiva com 8 bolas de raio r: 2 camadas de 4 bolas, encostadas umas nas outras e nas paredes">
      <rect x="94" y="60" width="144" height="144" fill={PAPEL} stroke={TINTA} strokeWidth={2.5} strokeDasharray="6 5" />
      <g stroke={TINTA} strokeWidth={2.5} strokeDasharray="6 5"><line x1="40" y1="100" x2="94" y2="60" /><line x1="184" y1="100" x2="238" y2="60" /><line x1="184" y1="244" x2="238" y2="204" /><line x1="40" y1="244" x2="94" y2="204" /></g>
      {fundo.map(([x, y]) => <Bola key={`f${x}-${y}`} cx={x} cy={y} rr={36} opaco={0.55} />)}
      <rect x="40" y="100" width="144" height="144" fill={PAPEL} fillOpacity={0.2} stroke={TINTA} strokeWidth={4} />
      {frente.map(([x, y]) => <Bola key={`t${x}-${y}`} cx={x} cy={y} rr={36} />)}
      <line x1="76" y1="136" x2="112" y2="136" stroke={CORTE} strokeWidth={3} />
      <circle cx="76" cy="136" r="4" fill={TINTA} />
      <Texto x={94} y={128} tam={14} cor={CORTE}>r</Texto>
      {aresta && (<>
        <Medida x1={40} y1={260} x2={184} y2={260} /><Texto x={112} y={282}>{aresta}</Texto>
        <Medida x1={262} y1={60} x2={262} y2={204} /><Texto x={272} y={140} ancora="start">{aresta}</Texto>
        <Texto x={52} y={74} ancora="end">{aresta}</Texto>
      </>)}
      <Texto x={165} y={aresta ? 308 : 280} tam={13}>{r(rotulos, 0, '2 camadas de 4 bolas, encostadas')}</Texto>
    </svg>
  );
}

// Tubo cilíndrico visto de lado: 4 camadas de 2 bolas, uma em cima da outra, encostadas nas duas tampas. Medidas 4r, 8r e 2r só com rotulos.
function TuboBolas4x2({ rotulos }: Props) {
  const largura = dado(rotulos, 1);
  const altura = dado(rotulos, 2);
  const raio = dado(rotulos, 3);
  const camadas = [75, 125, 175, 225];
  return (
    <svg viewBox="0 0 360 330" className="w-full max-w-[360px] h-auto" role="img" aria-label="tubo cilíndrico visto de lado com 4 camadas de 2 bolas de raio r, uma camada em cima da outra, encostadas nas tampas de cima e de baixo">
      <rect x="100" y="50" width="100" height="200" fill={PAPEL} stroke={TINTA} strokeWidth={3} />
      <line x1="96" y1="50" x2="204" y2="50" stroke={TINTA} strokeWidth={7} strokeLinecap="round" />
      <line x1="96" y1="250" x2="204" y2="250" stroke={TINTA} strokeWidth={7} strokeLinecap="round" />
      {camadas.flatMap((y) => [125, 175].map((x) => <Bola key={`${x}-${y}`} cx={x} cy={y} rr={25} />))}
      <line x1="125" y1="75" x2="150" y2="75" stroke={CORTE} strokeWidth={3} />
      <circle cx="125" cy="75" r="3.5" fill={TINTA} />
      <Texto x={137} y={68} tam={13} cor={CORTE}>r</Texto>
      <Texto x={218} y={55} ancora="start" tam={13}>tampa</Texto>
      <Texto x={218} y={255} ancora="start" tam={13}>tampa</Texto>
      {largura && <><Medida x1={100} y1={32} x2={200} y2={32} /><Texto x={150} y={22}>{largura}</Texto></>}
      {altura && <><Medida x1={74} y1={50} x2={74} y2={250} /><Texto x={64} y={156} ancora="end">{altura}</Texto></>}
      {raio && <Texto x={218} y={156} ancora="start" tam={14}>{raio}</Texto>}
      <Texto x={180} y={286} tam={13}>{r(rotulos, 0, '4 camadas de 2 bolas, uma em cima da outra')}</Texto>
      <Texto x={180} y={306} tam={12}>vista de lado: cada camada tem 2 bolas lado a lado</Texto>
    </svg>
  );
}

// Caixa nova: mesma base da cúbica, mais alta. Pontilhado = a altura da cúbica (4r); o trecho de cima é o que a nova tem a mais. Medidas só com rotulos.
function CaixaNova6r({ rotulos }: Props) {
  const cubica = dado(rotulos, 0);
  const extra = dado(rotulos, 1);
  const total = dado(rotulos, 2);
  const base = dado(rotulos, 3);
  const conta = dado(rotulos, 5);
  return (
    <svg viewBox={`0 0 360 ${conta ? 352 : 322}`} className="w-full max-w-[360px] h-auto" role="img" aria-label="caixa nova com a mesma base quadrada da caixa cúbica e mais alta: 6r de altura contra 4r da cúbica, que aparece pontilhada por dentro">
      <path d="M180 60 L220 30 V210 L180 240 Z" fill={CHAO} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <path d="M60 60 L100 30 H220 L180 60 Z" fill={PAPEL} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <rect x="60" y="120" width="120" height="120" fill={AGUA} fillOpacity={0.65} />
      <rect x="60" y="60" width="120" height="60" fill={SUJO} fillOpacity={0.6} />
      <rect x="60" y="60" width="120" height="180" fill="none" stroke={TINTA} strokeWidth={4} />
      <line x1="60" y1="120" x2="180" y2="120" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <line x1="180" y1="120" x2="220" y2="90" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <Texto x={120} y={96} tam={13}>mais alta</Texto>
      <Texto x={120} y={184} tam={13}>caixa cúbica</Texto>
      {cubica && <><Medida x1={40} y1={120} x2={40} y2={240} /><Texto x={32} y={186} ancora="end">{cubica}</Texto></>}
      {extra && <><Medida x1={40} y1={60} x2={40} y2={120} /><Texto x={32} y={96} ancora="end">{extra}</Texto></>}
      {total && <><Medida x1={254} y1={30} x2={254} y2={210} /><Texto x={264} y={126} ancora="start">{total}</Texto></>}
      {base && <><Medida x1={60} y1={262} x2={180} y2={262} /><Texto x={120} y={284}>{base}</Texto></>}
      <Texto x={180} y={base ? 308 : 280} tam={13}>{r(rotulos, 4, 'mesma base da caixa cúbica')}</Texto>
      {conta && <Texto x={180} y={332} tam={14}>{conta}</Texto>}
    </svg>
  );
}

export const DESENHOS_ACIMA_MATEMATICA = {
  'terreno-escala': TerrenoEscala,
  'praca-quatro-triangulos': PracaQuatroTriangulos,
  'lunulas': Lunulas,
  'copo-cone-80': CopoCone80,
  'caixa-bolas-2x2x2': CaixaBolas2x2x2,
  'tubo-bolas-4x2': TuboBolas4x2,
  'caixa-nova-6r': CaixaNova6r,
} as Record<string, (p: Props) => React.ReactElement>;
