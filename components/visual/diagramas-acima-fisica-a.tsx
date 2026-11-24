'use client';
/* Desenhos novos do nível acima v2 (fisica-a), 24/11/2026. Regras e cores: ver diagramas-nivel-acima.tsx.
   Rótulos com valor padrão = DADO do enunciado (aparecem sempre); rótulos sem padrão (dado(rotulos, i))
   = RESULTADO: só aparecem quando a tela da conta os manda. */
import { AGUA, APAGADO, CHAO, CORTE, LIMPO, PAPEL, ROBO, SECO, SUJO, TINTA, Texto, r, type Props } from './diagramas-base';

const dado = (rotulos: string[] | undefined, i: number) => rotulos?.[i] || '';

// Marca de ângulo reto: quadradinho com o canto em (x, y), indo por u e por v (vetores unitários).
const Reto = ({ x, y, u, v, t = 9 }: { x: number; y: number; u: [number, number]; v: [number, number]; t?: number }) => (
  <path d={`M${x + u[0] * t} ${y + u[1] * t} L${x + (u[0] + v[0]) * t} ${y + (u[1] + v[1]) * t} L${x + v[0] * t} ${y + v[1] * t}`} fill="none" stroke={TINTA} strokeWidth={2} />
);

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

// Seta de força: haste + ponta cheia, de (x1, y1) até (x2, y2).
const Seta = ({ x1, y1, x2, y2, cor = TINTA, w = 3.5 }: { x1: number; y1: number; x2: number; y2: number; cor?: string; w?: number }) => {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  const bx = x2 - ux * 10, by = y2 - uy * 10;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={cor} strokeWidth={w} />
      <polygon points={`${x2},${y2} ${bx - uy * 6},${by + ux * 6} ${bx + uy * 6},${by - ux * 6}`} fill={cor} />
    </g>
  );
};

// Torre de 20 m com a esfera no alto; canhão numa plataforma de 5 m, a 8 m. Resultado: a reta canhão-esfera (17 m) e o tempo de queda.
function TorreEsferaCanhao({ rotulos }: Props) {
  const reta = dado(rotulos, 6);
  return (
    <svg viewBox="0 0 420 350" className="w-full max-w-[420px] h-auto" role="img" aria-label="esfera no alto de uma torre de 20 metros e canhão numa plataforma de 5 metros, a 8 metros da torre">
      <rect x="20" y="300" width="380" height="14" fill={CHAO} />
      <line x1="20" y1="300" x2="400" y2="300" stroke={TINTA} strokeWidth={3} />
      <rect x="84" y="40" width="32" height="260" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <circle cx="100" cy="31" r="9" fill={SUJO} stroke={TINTA} strokeWidth={2.5} />
      <rect x="188" y="235" width="32" height="65" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <line x1="204" y1="235" x2="186" y2="215" stroke={ROBO} strokeWidth={9} strokeLinecap="round" />
      <circle cx="204" cy="235" r="9" fill={ROBO} />
      {reta && <line x1="204" y1="235" x2="100" y2="31" stroke={CORTE} strokeWidth={3.5} strokeDasharray="8 6" />}
      <Medida x1={60} y1={40} x2={60} y2={300} />
      <Texto x={52} y={175} ancora="end">{r(rotulos, 0, '20 m')}</Texto>
      <Medida x1={250} y1={235} x2={250} y2={300} />
      <Texto x={258} y={272} ancora="start">{r(rotulos, 1, '5 m')}</Texto>
      <Medida x1={100} y1={322} x2={204} y2={322} />
      <Texto x={152} y={344}>{r(rotulos, 2, '8 m')}</Texto>
      <Texto x={410} y={52} ancora="end" tam={14}>{r(rotulos, 3, 'g = 10 m/s²')}</Texto>
      <Texto x={118} y={26} ancora="start" tam={14}>{r(rotulos, 4, 'esfera')}</Texto>
      <Texto x={232} y={222} ancora="start" tam={14}>{r(rotulos, 5, 'canhão')}</Texto>
      {reta && <Texto x={162} y={98} ancora="start">{reta}</Texto>}
      {reta && dado(rotulos, 7) && <Texto x={162} y={120} ancora="start" tam={14}>{dado(rotulos, 7)}</Texto>}
    </svg>
  );
}

// Gráfico v × t de Ana: os pontos da tabela são dado; a reta que sobe até 10 s e as duas áreas são resultado.
function GraficoVtAna({ rotulos }: Props) {
  const x0 = 50, y0 = 250, px = 18, py = 36;
  const X = (t: number) => x0 + t * px;
  const Y = (v: number) => y0 - v * py;
  const pontos: [number, number][] = [[0, 0], [4, 2], [8, 4], [12, 5], [16, 5], [20, 5]];
  const curva = dado(rotulos, 3);
  const ac = dado(rotulos, 4);
  const cte = dado(rotulos, 5);
  return (
    <svg viewBox="0 0 480 300" className="w-full max-w-[480px] h-auto" role="img" aria-label="gráfico da velocidade de Ana pelo tempo, com os pontos da tabela e a saída de Bia aos 20 segundos">
      {ac && <polygon points={`${X(0)},${Y(0)} ${X(10)},${Y(0)} ${X(10)},${Y(5)}`} fill={AGUA} />}
      {cte && <rect x={X(10)} y={Y(5)} width={X(20) - X(10)} height={Y(0) - Y(5)} fill={LIMPO} />}
      <line x1={x0} y1={y0} x2={x0} y2={30} stroke={TINTA} strokeWidth={3} />
      <line x1={x0} y1={y0} x2={432} y2={y0} stroke={TINTA} strokeWidth={3} />
      <line x1={X(20)} y1={y0} x2={X(20)} y2={44} stroke={SUJO} strokeWidth={3} strokeDasharray="7 5" />
      {curva && <path d={`M${X(0)} ${Y(0)} L${X(10)} ${Y(5)} L${X(20)} ${Y(5)}`} fill="none" stroke={CORTE} strokeWidth={4} strokeLinejoin="round" />}
      {pontos.map(([t, v]) => <circle key={t} cx={X(t)} cy={Y(v)} r={5.5} fill={TINTA} />)}
      {[4, 8, 12, 16, 20].map((t) => <Texto key={t} x={X(t)} y={272} tam={14}>{String(t)}</Texto>)}
      {[2, 4, 5].map((v) => <Texto key={v} x={42} y={Y(v) + 5} ancora="end" tam={14}>{String(v)}</Texto>)}
      <Texto x={58} y={22} ancora="start" tam={14}>{r(rotulos, 0, 'v (m/s)')}</Texto>
      <Texto x={438} y={256} ancora="start" tam={14}>{r(rotulos, 1, 't (s)')}</Texto>
      <Texto x={X(20)} y={36} tam={14} cor={SUJO}>{r(rotulos, 2, 'Bia sai aos 20 s')}</Texto>
      {curva && <Texto x={X(10)} y={Y(5) - 12} tam={14}>{curva}</Texto>}
      {ac && <Texto x={186} y={238} tam={14}>{ac}</Texto>}
      {cte && <Texto x={322} y={170} tam={15}>{cte}</Texto>}
    </svg>
  );
}

// Rampa 3-4-5 com o bloco subindo. Dados: medidas, atrito, massa, velocidade. Resultado: as forças (peso, aperta, puxa, atrito).
function RampaComForcas({ rotulos }: Props) {
  const A = [100, 260], C = [340, 80];
  const u = [0.8, -0.6], n = [-0.6, -0.8];
  const p = (t: number, d = 0) => [A[0] + 240 * t + n[0] * d, A[1] - 180 * t + n[1] * d];
  const P0 = p(0.4);
  const Cb = p(0.4, 17);
  const peso = dado(rotulos, 4), aperta = dado(rotulos, 5), puxa = dado(rotulos, 6), atrito = dado(rotulos, 7);
  const v0 = p(0.62, 14), v1 = p(0.82, 14);
  return (
    <svg viewBox="0 0 480 320" className="w-full max-w-[480px] h-auto" role="img" aria-label="rampa que sobe 3 metros a cada 5 metros de rampa, com um bloco subindo">
      <path d={`M${A[0]} 260 H340 V${C[1]} Z`} fill={CHAO} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <Reto x={340} y={260} u={[-1, 0]} v={[0, -1]} />
      <g transform={`translate(${P0[0]} ${P0[1]}) rotate(-36.87)`}>
        <rect x={-17} y={-34} width={34} height={34} fill={SECO} stroke={TINTA} strokeWidth={3} />
      </g>
      <Seta x1={v0[0]} y1={v0[1]} x2={v1[0]} y2={v1[1]} cor={TINTA} w={3} />
      <Texto x={v0[0] - 14} y={v0[1] - 22} ancora="end" tam={14}>{r(rotulos, 1, '12 m/s')}</Texto>
      <Texto x={236} y={198} tam={14}>{r(rotulos, 0, '5 m')}</Texto>
      <Medida x1={352} y1={C[1]} x2={352} y2={260} />
      <Texto x={362} y={175} ancora="start" tam={14}>{r(rotulos, 2, '3 m')}</Texto>
      <Texto x={220} y={304} tam={14}>{r(rotulos, 3, '2 kg · μ = 0,45')}</Texto>
      {peso && <Seta x1={Cb[0]} y1={Cb[1]} x2={Cb[0]} y2={Cb[1] + 60} cor={TINTA} />}
      {peso && <Texto x={Cb[0] + 8} y={Cb[1] + 76} ancora="start" tam={14}>{peso}</Texto>}
      {aperta && <Seta x1={Cb[0]} y1={Cb[1]} x2={Cb[0] + n[0] * 48} y2={Cb[1] + n[1] * 48} cor={CORTE} />}
      {aperta && <Texto x={Cb[0] + n[0] * 48 - 6} y={Cb[1] + n[1] * 48 - 2} ancora="end" tam={14}>{aperta}</Texto>}
      {puxa && <Seta x1={Cb[0]} y1={Cb[1]} x2={Cb[0] - u[0] * 36} y2={Cb[1] - u[1] * 36} cor={ROBO} />}
      {puxa && <Texto x={Cb[0] - u[0] * 36 - 6} y={Cb[1] - u[1] * 36 + 6} ancora="end" tam={14}>{puxa}</Texto>}
      {atrito && <Seta x1={P0[0] + u[0] * 34} y1={P0[1] + u[1] * 34} x2={P0[0] + u[0] * 10} y2={P0[1] + u[1] * 10} cor={SUJO} w={4} />}
      {atrito && <Texto x={212} y={226} ancora="start" tam={14}>{atrito}</Texto>}
    </svg>
  );
}

// Bloco de 1 kg na ponta da frente de uma prancha de 4 kg e 1,25 m, puxada por 30 N sobre mesa sem atrito.
function BlocoSobrePrancha({ rotulos }: Props) {
  const ab = dado(rotulos, 5), ap = dado(rotulos, 6), at = dado(rotulos, 7);
  return (
    <svg viewBox="0 0 480 275" className="w-full max-w-[480px] h-auto" role="img" aria-label="bloco de 1 quilo sobre a ponta da frente de uma prancha de 4 quilos, puxada para frente por 30 newtons">
      <rect x="20" y="190" width="440" height="22" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <Texto x={240} y={206} tam={13}>{r(rotulos, 4, 'mesa sem atrito')}</Texto>
      <rect x="60" y="150" width="300" height="40" fill={LIMPO} stroke={TINTA} strokeWidth={3} />
      <Texto x={170} y={176}>{r(rotulos, 1, '4 kg')}</Texto>
      <rect x="318" y="112" width="40" height="38" fill={SECO} stroke={TINTA} strokeWidth={3} />
      <Texto x={338} y={137} tam={13}>{r(rotulos, 0, '1 kg')}</Texto>
      <Medida x1={60} y1={96} x2={360} y2={96} />
      <Texto x={210} y={86}>{r(rotulos, 2, '1,25 m')}</Texto>
      <Seta x1={362} y1={172} x2={446} y2={172} cor={TINTA} />
      <Texto x={404} y={160}>{r(rotulos, 3, '30 N')}</Texto>
      {at && <Seta x1={366} y1={131} x2={420} y2={131} cor={SUJO} />}
      {at && <Texto x={366} y={120} ancora="start" tam={14}>{at}</Texto>}
      {at && <Seta x1={330} y1={162} x2={272} y2={162} cor={SUJO} />}
      {at && <Texto x={301} y={184} tam={14}>{at}</Texto>}
      {ab && <Texto x={60} y={238} ancora="start" tam={14}>{ab}</Texto>}
      {ab && <Seta x1={236} y1={232} x2={236 + 4 * 14} y2={232} cor={CORTE} />}
      {ap && <Texto x={60} y={260} ancora="start" tam={14}>{ap}</Texto>}
      {ap && <Seta x1={236} y1={254} x2={236 + 6.5 * 14} y2={254} cor={CORTE} />}
    </svg>
  );
}

// Pêndulo solto na horizontal; o fio encosta num pino a 4/5 de L e a esfera passa a girar em torno dele.
function PenduloComPino({ rotulos }: Props) {
  const raio = dado(rotulos, 5), queda = dado(rotulos, 6);
  return (
    <svg viewBox="0 0 480 300" className="w-full max-w-[480px] h-auto" role="img" aria-label="pêndulo de fio L solto na horizontal, com um pino a 4/5 de L abaixo da fixação, em volta do qual a esfera gira">
      <path d="M350 40 A200 200 0 0 1 150 240" fill="none" stroke={APAGADO} strokeWidth={2.5} strokeDasharray="7 6" />
      <circle cx="150" cy="200" r="40" fill="none" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <line x1="150" y1="40" x2="150" y2="240" stroke={TINTA} strokeWidth={3} />
      <line x1="150" y1="40" x2="350" y2="40" stroke={TINTA} strokeWidth={3} />
      <circle cx="150" cy="240" r="12" fill="none" stroke={TINTA} strokeWidth={2.5} strokeDasharray="4 3" />
      <circle cx="350" cy="40" r="13" fill={SUJO} stroke={TINTA} strokeWidth={3} />
      <rect x="140" y="30" width="20" height="10" fill={TINTA} />
      <circle cx="150" cy="200" r="7" fill={ROBO} stroke={TINTA} strokeWidth={2} />
      <Medida x1={90} y1={40} x2={90} y2={200} />
      <line x1="90" y1="200" x2="143" y2="200" stroke={TINTA} strokeWidth={1.5} strokeDasharray="4 4" />
      <Texto x={82} y={125} ancora="end" tam={14}>{r(rotulos, 2, '4/5 de L')}</Texto>
      <Texto x={250} y={30}>{r(rotulos, 0, 'L')}</Texto>
      <Texto x={150} y={20} tam={14}>{r(rotulos, 4, 'fixação')}</Texto>
      <Texto x={372} y={46} ancora="start" tam={14}>{r(rotulos, 1, '2 kg')}</Texto>
      <Texto x={138} y={190} ancora="end" tam={14}>{r(rotulos, 3, 'pino')}</Texto>
      <Texto x={240} y={290} tam={13}>{r(rotulos, 7, 'solta do repouso, fio na horizontal')}</Texto>
      {raio && <line x1="150" y1="200" x2="122" y2="228" stroke={SUJO} strokeWidth={4} />}
      {raio && <Texto x={114} y={250} ancora="end" tam={14}>{raio}</Texto>}
      {queda && <Medida x1={210} y1={40} x2={210} y2={160} />}
      {queda && <line x1="150" y1="160" x2="217" y2="160" stroke={TINTA} strokeWidth={1.5} strokeDasharray="4 4" />}
      {queda && <Texto x={220} y={106} ancora="start" tam={14}>{queda}</Texto>}
    </svg>
  );
}

// Diagrama p × V: A (1 L, 3), B (mesma temperatura, p = 1/3 de A), C (volume de B, pressão de A). A área do trapézio é resultado.
function DiagramaPvTrapezio({ rotulos }: Props) {
  const x0 = 70, y0 = 280, px = 80, py = 60;
  const X = (v: number) => x0 + v * px;
  const Y = (p: number) => y0 - p * py;
  const volB = dado(rotulos, 5), area = dado(rotulos, 6), joules = dado(rotulos, 7);
  return (
    <svg viewBox="0 0 480 320" className="w-full max-w-[480px] h-auto" role="img" aria-label="diagrama pressão por volume: de A a B uma reta, de B a C volume constante">
      {area && <polygon points={`${X(1)},${Y(0)} ${X(3)},${Y(0)} ${X(3)},${Y(1)} ${X(1)},${Y(3)}`} fill={AGUA} opacity={0.75} />}
      <line x1={x0} y1={y0} x2={x0} y2={30} stroke={TINTA} strokeWidth={3} />
      <line x1={x0} y1={y0} x2={410} y2={y0} stroke={TINTA} strokeWidth={3} />
      <g stroke={TINTA} strokeWidth={1.5} strokeDasharray="5 5" fill="none">
        <line x1={x0} y1={Y(3)} x2={X(3)} y2={Y(3)} />
        <line x1={x0} y1={Y(1)} x2={X(3)} y2={Y(1)} />
        <line x1={X(1)} y1={Y(3)} x2={X(1)} y2={y0} />
        {volB && <line x1={X(3)} y1={Y(1)} x2={X(3)} y2={y0} />}
      </g>
      <line x1={X(1)} y1={Y(3)} x2={X(3)} y2={Y(1)} stroke={CORTE} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={X(3)} y1={Y(1)} x2={X(3)} y2={Y(3)} stroke={SUJO} strokeWidth={4.5} strokeLinecap="round" />
      {[[1, 3], [3, 1], [3, 3]].map(([v, p]) => <circle key={`${v}${p}`} cx={X(v)} cy={Y(p)} r={6.5} fill={TINTA} />)}
      <Texto x={X(1) - 14} y={Y(3) - 12} tam={16}>A</Texto>
      <Texto x={X(3) + 16} y={Y(1) + 22} tam={16}>B</Texto>
      <Texto x={X(3) - 14} y={Y(3) - 12} tam={16}>C</Texto>
      <Texto x={62} y={Y(3) + 5} ancora="end" tam={14}>3</Texto>
      <Texto x={62} y={Y(1) + 5} ancora="end" tam={14}>1</Texto>
      <Texto x={X(1)} y={y0 + 20} tam={14}>1</Texto>
      {volB && <Texto x={X(3)} y={y0 + 20} tam={14}>{volB}</Texto>}
      <Texto x={78} y={24} ancora="start" tam={14}>{r(rotulos, 0, 'p (10⁵ Pa)')}</Texto>
      <Texto x={416} y={y0 + 5} ancora="start" tam={14}>{r(rotulos, 1, 'V (L)')}</Texto>
      <Texto x={X(1) + 18} y={Y(3) - 12} ancora="start" tam={13}>{r(rotulos, 2, '3 · 10⁵ Pa, 1 L')}</Texto>
      <Texto x={X(3) + 14} y={Y(1) + 2} ancora="start" tam={13}>{r(rotulos, 3, 'p = 1/3 de A')}</Texto>
      <Texto x={X(3) + 14} y={Y(3) + 4} ancora="start" tam={13}>{r(rotulos, 4, 'p igual à de A')}</Texto>
      {area && <Texto x={236} y={246} tam={14}>{area}</Texto>}
      {joules && <Texto x={236} y={266} tam={15}>{joules}</Texto>}
    </svg>
  );
}

// Escada de barras: fonte a 100 °C, barras horizontais de 0,5 m, verticais de 1,0 m até o frio a 0 °C, padrão sem fim.
function EscadaDeBarras({ rotulos }: Props) {
  const nos = [130, 200, 270, 340];
  const temps = [dado(rotulos, 4), dado(rotulos, 5), dado(rotulos, 6)];
  const fluxo = dado(rotulos, 7);
  return (
    <svg viewBox="0 0 440 250" className="w-full max-w-[440px] h-auto" role="img" aria-label="escada de barras: fonte quente à esquerda, barras horizontais e verticais que descem até o reservatório frio, repetindo sem fim">
      <rect x="115" y="200" width="270" height="16" fill={AGUA} stroke={TINTA} strokeWidth={3} />
      <rect x="20" y="50" width="40" height="40" fill={SUJO} stroke={TINTA} strokeWidth={3} />
      <g stroke={TINTA} strokeWidth={5} strokeLinecap="round">
        <line x1="60" y1="70" x2="370" y2="70" />
        {nos.map((x) => <line key={x} x1={x} y1="70" x2={x} y2="200" />)}
      </g>
      {[380, 392, 404].map((x) => <circle key={x} cx={x} cy={70} r={2.5} fill={TINTA} />)}
      {nos.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={70} r={11} fill={PAPEL} stroke={TINTA} strokeWidth={2.5} />
          {i < 3 && <Texto x={x} y={75} tam={13}>{String(i + 1)}</Texto>}
        </g>
      ))}
      <Texto x={40} y={40} tam={14}>{r(rotulos, 0, '100 °C')}</Texto>
      <Texto x={247} y={238} tam={14}>{r(rotulos, 1, '0 °C')}</Texto>
      <Texto x={95} y={92} tam={13}>{r(rotulos, 2, '0,5 m')}</Texto>
      <Texto x={140} y={140} ancora="start" tam={14}>{r(rotulos, 3, '1,0 m')}</Texto>
      {[0, 1, 2].map((i) => temps[i] && <Texto key={i} x={nos[i]} y={50} tam={14}>{temps[i]}</Texto>)}
      {fluxo && <Texto x={278} y={140} ancora="start" tam={14}>{fluxo}</Texto>}
    </svg>
  );
}

// Lago visto de lado: barco na superfície, cardume a 270 m na horizontal, fundo abaixo do barco, dois ecos.
function SonarEcoObliquo({ rotulos }: Props) {
  const fundo = dado(rotulos, 4), obl = dado(rotulos, 5), prof = dado(rotulos, 6), dist = dado(rotulos, 7);
  return (
    <svg viewBox="0 0 440 350" className="w-full max-w-[440px] h-auto" role="img" aria-label="lago visto de lado: barco na superfície, cardume a 270 metros na horizontal e fundo do lago abaixo do barco, com dois ecos do sonar">
      <rect x="10" y="50" width="420" height="270" fill={AGUA} opacity={0.55} />
      <rect x="10" y="320" width="420" height="20" fill={CHAO} stroke={TINTA} strokeWidth={2} />
      <line x1="10" y1="50" x2="430" y2="50" stroke={TINTA} strokeWidth={3} />
      <polygon points="48,38 92,38 82,54 58,54" fill={SUJO} stroke={TINTA} strokeWidth={2.5} strokeLinejoin="round" />
      <line x1="70" y1="38" x2="70" y2="20" stroke={TINTA} strokeWidth={3} />
      <line x1="70" y1="54" x2="70" y2="318" stroke={CORTE} strokeWidth={3.5} strokeDasharray="8 6" />
      <line x1="70" y1="54" x2="191.5" y2="212" stroke={CORTE} strokeWidth={3.5} strokeDasharray="8 6" />
      {prof && <line x1="191.5" y1="50" x2="191.5" y2="212" stroke={TINTA} strokeWidth={2.5} strokeDasharray="5 5" />}
      {prof && <Reto x={191.5} y={50} u={[-1, 0]} v={[0, 1]} />}
      <Medida x1={70} y1={50} x2={191.5} y2={50} />
      {[[186, 205], [199, 214], [184, 220]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx={8} ry={4.5} fill={SECO} stroke={TINTA} strokeWidth={1.5} />)}
      {dist && <Medida x1={191.5} y1={226} x2={191.5} y2={320} />}
      <Texto x={146} y={38} tam={14}>{r(rotulos, 0, '270 m')}</Texto>
      <Texto x={188} y={100} ancora="end" tam={14}>{r(rotulos, 1, '0,6 s')}</Texto>
      <Texto x={62} y={130} ancora="end" tam={14}>{r(rotulos, 2, '0,8 s')}</Texto>
      <Texto x={222} y={217} ancora="start" tam={14}>{r(rotulos, 3, 'cardume')}</Texto>
      {fundo && <Texto x={62} y={232} ancora="end" tam={14}>{fundo}</Texto>}
      {obl && <Texto x={188} y={122} ancora="end" tam={14}>{obl}</Texto>}
      {prof && <Texto x={200} y={135} ancora="start" tam={14}>{prof}</Texto>}
      {dist && <Texto x={200} y={278} ancora="start" tam={14}>{dist}</Texto>}
    </svg>
  );
}

export const DESENHOS_ACIMA_FISICA_A = {
  'torre-esfera-canhao': TorreEsferaCanhao,
  'grafico-vt-ana': GraficoVtAna,
  'rampa-com-forcas': RampaComForcas,
  'bloco-sobre-prancha': BlocoSobrePrancha,
  'pendulo-com-pino': PenduloComPino,
  'diagrama-pv-trapezio': DiagramaPvTrapezio,
  'escada-de-barras': EscadaDeBarras,
  'sonar-eco-obliquo': SonarEcoObliquo,
} as Record<string, (p: Props) => React.ReactElement>;
