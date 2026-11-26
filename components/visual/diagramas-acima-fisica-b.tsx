'use client';
/* Desenhos novos do nível acima v2 (fisica-b), 24/11/2026. Regras e cores: ver diagramas-nivel-acima.tsx.
   Rótulos com valor padrão = DADO do enunciado (aparecem sempre); os sem padrão (dado()) = RESULTADO, só quando a tela da conta os manda. */
import { AGUA, APAGADO, CHAO, CORTE, LIMPO, PAPEL, SECO, SUJO, TINTA, Texto, r, type Props } from './diagramas-base';

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

// Seta de (x1, y1) até (x2, y2), com a ponta em (x2, y2).
const Seta = ({ x1, y1, x2, y2, cor = TINTA, larg = 3, tracejada = false }: { x1: number; y1: number; x2: number; y2: number; cor?: string; larg?: number; tracejada?: boolean }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (d: number) => `${x2 - 11 * Math.cos(a + d)},${y2 - 11 * Math.sin(a + d)}`;
  return (
    <g stroke={cor} strokeWidth={larg}>
      <line x1={x1} y1={y1} x2={x2 - 5 * Math.cos(a)} y2={y2 - 5 * Math.sin(a)} strokeDasharray={tracejada ? '6 4' : undefined} />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} fill={cor} strokeWidth={1} />
    </g>
  );
};

// Sirene girando na ponta do fio, vista de cima. Dados: 0,8 kg, fio 1,7 m, 420 Hz (máx) e 380 Hz (mín). Resultado: vf e a tração.
function SireneNoCirculo({ rotulos }: Props) {
  const vf = dado(rotulos, 5);
  const tra = dado(rotulos, 6);
  const O = [150, 150];
  return (
    <svg viewBox={`0 0 470 ${vf ? 340 : 300}`} className="w-full max-w-[470px] h-auto" role="img" aria-label="vista de cima: uma sirene presa a um fio gira em círculo numa mesa; num ponto ela vai direto ao microfone distante e emite 420 hertz, no ponto oposto ela se afasta e emite 380 hertz">
      <circle cx={O[0]} cy={O[1]} r="90" fill={LIMPO} fillOpacity={0.45} stroke={TINTA} strokeWidth={3} strokeDasharray="7 5" />
      <line x1={O[0]} y1={O[1]} x2={150} y2={240} stroke={TINTA} strokeWidth={3} />
      <line x1={O[0]} y1={O[1]} x2={150} y2={60} stroke={TINTA} strokeWidth={3} />
      <circle cx={O[0]} cy={O[1]} r="5" fill={TINTA} />
      <Texto x={160} y={168} ancora="start" tam={13}>centro</Texto>
      <Texto x={142} y={190} ancora="end" tam={13}>{r(rotulos, 1, 'fio 1,7 m')}</Texto>
      <circle cx="150" cy="240" r="9" fill={SUJO} stroke={TINTA} strokeWidth={2.5} />
      <circle cx="150" cy="60" r="9" fill={SUJO} stroke={TINTA} strokeWidth={2.5} />
      <Seta x1={165} y1={240} x2={225} y2={240} cor={CORTE} />
      <Seta x1={135} y1={60} x2={75} y2={60} cor={CORTE} />
      <Texto x={232} y={246} ancora="start" tam={15}>{r(rotulos, 2, '420 Hz (máxima)')}</Texto>
      <Texto x={232} y={266} ancora="start" tam={13} cor={CORTE}>vem ao microfone  →</Texto>
      <Texto x={70} y={36} ancora="start" tam={15}>{r(rotulos, 3, '380 Hz (mínima)')}</Texto>
      <Texto x={150} y={284} tam={13}>{r(rotulos, 0, 'sirene de 0,8 kg')}</Texto>
      <rect x="395" y="136" width="18" height="34" rx="9" fill={SECO} stroke={TINTA} strokeWidth={3} />
      <line x1="404" y1="170" x2="404" y2="186" stroke={TINTA} strokeWidth={3} />
      <Texto x={404} y={208} tam={14}>{r(rotulos, 4, 'microfone')}</Texto>
      <Texto x={404} y={226} tam={13}>muito longe</Texto>
      <Texto x={248} y={64} ancora="start" tam={13} cor={CORTE}>←  se afasta do microfone</Texto>
      {vf && <Texto x={235} y={308} tam={15}>{vf}</Texto>}
      {tra && <Texto x={235} y={328} tam={15}>{tra}</Texto>}
    </svg>
  );
}

// Tubo com água e diapasão: duas ressonâncias seguidas (16,0 cm e 50,0 cm de ar). Escala 3,6 px por cm; a água está no nível da 2ª.
function TuboComAgua({ rotulos }: Props) {
  const topo = 60;
  const y1 = topo + 16 * 3.6;
  const y2 = topo + 50 * 3.6;
  const dif = dado(rotulos, 3);
  const lam = dado(rotulos, 4);
  return (
    <svg viewBox={`0 0 460 ${lam ? 376 : 346}`} className="w-full max-w-[460px] h-auto" role="img" aria-label="tubo de vidro vertical ligado por mangueira a um reservatório de água, com um diapasão de 500 hertz na boca; o som reforça com 16 centímetros de ar e de novo com 50 centímetros">
      <rect x="120" y={y2} width="30" height={296 - y2} fill={AGUA} />
      <path d={`M120 ${topo} V296 H150 V${topo}`} fill="none" stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <path d="M135 296 H300 V262" fill="none" stroke={TINTA} strokeWidth={4} />
      <rect x="300" y="250" width="90" height="62" fill={AGUA} stroke={TINTA} strokeWidth={4} />
      <Texto x={345} y={332} tam={13}>reservatório</Texto>
      <line x1="112" y1={y1} x2="158" y2={y1} stroke={CORTE} strokeWidth={3} strokeDasharray="6 4" />
      <line x1="112" y1={y2} x2="158" y2={y2} stroke={CORTE} strokeWidth={3} />
      <path d="M130 22 V40 M140 22 V40 M125 14 V22 H145 V14" fill="none" stroke={TINTA} strokeWidth={3} strokeLinecap="round" />
      <Texto x={160} y={32} ancora="start" tam={15}>{r(rotulos, 0, 'diapasão 500 Hz')}</Texto>
      <Medida x1={96} y1={topo} x2={96} y2={y2} />
      <Texto x={88} y={(topo + y2) / 2 + 5} ancora="end">{r(rotulos, 2, '50,0 cm')}</Texto>
      <Medida x1={178} y1={topo} x2={178} y2={y1} />
      <Texto x={188} y={(topo + y1) / 2 + 5} ancora="start">{r(rotulos, 1, '16,0 cm')}</Texto>
      <Texto x={188} y={y1 + 4} ancora="start" tam={12} cor={CORTE}>1ª ressonância</Texto>
      <Texto x={188} y={y2 + 4} ancora="start" tam={12} cor={CORTE}>2ª ressonância</Texto>
      <Texto x={188} y={284} ancora="start" tam={13}>água no tubo</Texto>
      {dif && <Medida x1={178} y1={y1 + 20} x2={178} y2={y2} />}
      {dif && <Texto x={188} y={(y1 + y2) / 2 + 22} ancora="start" tam={14}>{dif}</Texto>}
      {lam && <Texto x={230} y={368} tam={15}>{lam}</Texto>}
    </svg>
  );
}

// Corda de 0,9 m presa nas pontas, em dois modos de número desconhecido (3 e 5 barrigas são só exemplo). Resultado: f1 = mdc ÷ kk.
function Onda({ x0, x1, y, barrigas, cor }: { x0: number; x1: number; y: number; barrigas: number; cor: string }) {
  const pts = Array.from({ length: 121 }, (_, i) => `${x0 + ((x1 - x0) * i) / 120},${y - 26 * Math.sin((Math.PI * barrigas * i) / 120)}`).join(' ');
  const pts2 = Array.from({ length: 121 }, (_, i) => `${x0 + ((x1 - x0) * i) / 120},${y + 26 * Math.sin((Math.PI * barrigas * i) / 120)}`).join(' ');
  return (
    <g fill="none" stroke={cor} strokeWidth={3} strokeLinejoin="round">
      <polyline points={pts} /><polyline points={pts2} />
    </g>
  );
}
function CordaModos({ rotulos }: Props) {
  const f1 = dado(rotulos, 4);
  return (
    <svg viewBox={`0 0 460 ${f1 ? 296 : 262}`} className="w-full max-w-[460px] h-auto" role="img" aria-label="corda de violão de 0,9 metro presa nas duas pontas, desenhada em dois modos: um de 420 hertz e outro de 700 hertz; quantas barrigas cada um tem não é dado">
      {[{ y: 60, f: 3, t: r(rotulos, 1, '420 Hz'), cor: CORTE }, { y: 160, f: 5, t: r(rotulos, 2, '700 Hz'), cor: SUJO }].map((c) => (
        <g key={c.y}>
          <line x1="50" y1={c.y} x2="410" y2={c.y} stroke={TINTA} strokeWidth={1.5} strokeDasharray="3 4" />
          <Onda x0={50} x1={410} y={c.y} barrigas={c.f} cor={c.cor} />
          <rect x="40" y={c.y - 22} width="10" height="44" fill={TINTA} /><rect x="410" y={c.y - 22} width="10" height="44" fill={TINTA} />
          <Texto x={230} y={c.y - 34} tam={16} cor={TINTA}>{c.t}</Texto>
        </g>
      ))}
      <Medida x1={50} y1={226} x2={410} y2={226} />
      <Texto x={230} y={218}>{r(rotulos, 0, '0,9 m')}</Texto>
      <Texto x={230} y={252} tam={13}>{r(rotulos, 3, 'o número de barrigas não é dado: 3 e 5 são só exemplo')}</Texto>
      {f1 && <Texto x={230} y={282} tam={15}>{f1}</Texto>}
    </svg>
  );
}

// Lente de lado (biconvexa) com setinhas nas pontas.
const Lente = ({ x, y, alt, nome }: { x: number; y: number; alt: number; nome: string }) => (
  <g>
    <path d={`M${x} ${y - alt} Q${x + 17} ${y} ${x} ${y + alt} Q${x - 17} ${y} ${x} ${y - alt} Z`} fill={AGUA} fillOpacity={0.7} stroke={TINTA} strokeWidth={3} />
    <Texto x={x} y={y - alt - 8} tam={14}>{nome}</Texto>
  </g>
);

// Projetor de dois estágios, fora de escala. Dados: slide 3,6 cm a 6,0 cm da lente 1 (f1 = 5,0), lentes a 37,5 cm, lente 2 (f2 = 10,0) se afasta a 0,50 cm/s, parede com 72 cm.
function ProjetorDuasLentes({ rotulos }: Props) {
  const q1 = dado(rotulos, 7);
  const p2 = dado(rotulos, 8);
  const eixo = 140;
  return (
    <svg viewBox={`0 0 500 ${q1 ? 362 : 312}`} className="w-full max-w-[500px] h-auto" role="img" aria-label="slide de 3,6 centímetros a 6 centímetros de uma lente de foco 5; a segunda lente, de foco 10, está a 37,5 centímetros da primeira e se afasta a 0,5 centímetro por segundo; a parede mostra uma imagem de 72 centímetros">
      <line x1="20" y1={eixo} x2="480" y2={eixo} stroke={TINTA} strokeWidth={1.5} strokeDasharray="3 4" />
      <Seta x1={40} y1={eixo} x2={40} y2={eixo - 34} cor={SECO} larg={5} />
      <Texto x={40} y={eixo + 24} tam={13}>slide</Texto>
      <Texto x={38} y={eixo - 46} tam={14}>{r(rotulos, 1, '3,6 cm')}</Texto>
      <Lente x={130} y={eixo} alt={62} nome="lente 1" />
      <Lente x={310} y={eixo} alt={62} nome="lente 2" />
      <g fill={TINTA}><circle cx="83" cy={eixo} r="4" /><circle cx="177" cy={eixo} r="4" /><circle cx="250" cy={eixo} r="4" /><circle cx="370" cy={eixo} r="4" /></g>
      <rect x="448" y={eixo - 78} width="8" height="156" fill={CHAO} stroke={TINTA} strokeWidth={2} />
      <Seta x1={430} y1={eixo + 62} x2={430} y2={eixo - 62} cor={CORTE} larg={5} />
      <Texto x={420} y={eixo - 72} ancora="end" tam={15}>{r(rotulos, 6, '72 cm')}</Texto>
      <Texto x={452} y={eixo + 98} tam={13}>parede</Texto>
      <Texto x={130} y={36} tam={14}>{r(rotulos, 3, 'f1 = 5,0 cm')}</Texto>
      <Texto x={310} y={36} tam={14}>{r(rotulos, 4, 'f2 = 10,0 cm')}</Texto>
      {[83, 177, 250, 370].map((x) => <Texto key={x} x={x} y={eixo - 9} tam={12}>F</Texto>)}
      <Medida x1={40} y1={eixo + 76} x2={130} y2={eixo + 76} />
      <Texto x={85} y={eixo + 96} tam={14}>{r(rotulos, 0, '6,0 cm')}</Texto>
      <Medida x1={130} y1={eixo + 118} x2={310} y2={eixo + 118} />
      <Texto x={220} y={eixo + 138} tam={14}>{r(rotulos, 2, '37,5 cm')}</Texto>
      <Seta x1={322} y1={eixo + 76} x2={372} y2={eixo + 76} cor={SUJO} />
      <Texto x={347} y={eixo + 98} tam={13} cor={SUJO}>{r(rotulos, 5, '0,50 cm/s')}</Texto>
      {q1 && <Seta x1={262} y1={eixo} x2={262} y2={eixo + 32} cor={SUJO} larg={3} tracejada />}
      {q1 && <Texto x={250} y={eixo - 34} tam={13} cor={SUJO}>imagem 1</Texto>}
      {q1 && <Texto x={250} y={eixo + 168} tam={14}>{q1}</Texto>}
      {p2 && <Texto x={250} y={eixo + 188} tam={14}>{p2}</Texto>}
      <Texto x={250} y={q1 ? 352 : 304} tam={12} cor="#5b6b5e">desenho fora de escala</Texto>
    </svg>
  );
}

// Corredor de espelhos visto de cima (12 m por 3 m). Resultado: o corredor desdobrado, com as imagens do sensor e o cone de 45°.
function CorredorImagens({ rotulos }: Props) {
  const conta = dado(rotulos, 5);
  const E = 28; // px por metro no corredor
  const x0 = 40, yB = 90; // espelho de baixo (y = 0)
  const Y = (m: number) => yB - m * E;
  // painel desdobrado: 10 px por m na horizontal e 8 px por m na vertical
  const px0 = 60, pw = 160, ps = 8, pyz = 330; // y = 0 do painel
  const PY = (m: number) => pyz - m * ps;
  const imagens = [-10, -8, -4, -2, 2, 4, 8, 10];
  const fora = [-16, -14, 14, 16];
  return (
    <svg viewBox={conta ? '0 148 460 358' : '0 0 460 190'} className="w-full max-w-[460px] h-auto" role="img" aria-label="corredor de 12 por 3 metros com espelhos nas paredes compridas, um laser a 1 metro do espelho de baixo numa ponta e um sensor a 2 metros do mesmo espelho na outra">
      <rect x={x0} y={Y(3)} width={12 * E} height={3 * E} fill={PAPEL} />
      <line x1={x0} y1={Y(3)} x2={x0 + 12 * E} y2={Y(3)} stroke={CORTE} strokeWidth={6} />
      <line x1={x0} y1={Y(0)} x2={x0 + 12 * E} y2={Y(0)} stroke={CORTE} strokeWidth={6} />
      <Texto x={x0 + 6 * E} y={Y(3) - 10}>{r(rotulos, 0, '12 m')}</Texto>
      <Medida x1={x0 + 12 * E + 14} y1={Y(3)} x2={x0 + 12 * E + 14} y2={Y(0)} />
      <Texto x={x0 + 12 * E + 24} y={Y(1.5) + 5} ancora="start">{r(rotulos, 1, '3 m')}</Texto>
      <line x1={x0} y1={Y(3)} x2={x0} y2={Y(0)} stroke={APAGADO} strokeWidth={6} />
      <line x1={x0 + 12 * E} y1={Y(3)} x2={x0 + 12 * E} y2={Y(0)} stroke={APAGADO} strokeWidth={6} />
      <circle cx={x0} cy={Y(1)} r="7" fill={SUJO} stroke={TINTA} strokeWidth={2.5} />
      <rect x={x0 + 12 * E - 8} y={Y(2) - 8} width="16" height="16" fill={SECO} stroke={TINTA} strokeWidth={2.5} />
      <Texto x={x0 + 4} y={Y(0) + 24} ancora="start" tam={13}>{'laser a 1 m'}</Texto>
      <Texto x={x0 + 12 * E} y={Y(0) + 24} ancora="end" tam={13}>{'sensor a 2 m'}</Texto>
      <Texto x={x0 + 6 * E} y={Y(0) + 24} tam={13}>{r(rotulos, 2, 'até 45°')}</Texto>
      <Texto x={x0 + 6 * E} y={Y(0) + 42} tam={12} cor={CORTE}>azul: espelho · cinza: ponta que absorve</Texto>
      {conta && (
        <g>
          <Texto x={230} y={166} tam={19}>{conta}</Texto>
          {[...Array(11)].map((_, i) => {
            const y = -15 + 3 * i;
            return <line key={y} x1={px0} y1={PY(y)} x2={px0 + pw} y2={PY(y)} stroke={CORTE} strokeWidth={2} opacity={0.55} />;
          })}
          <line x1={px0 + pw} y1={PY(-11)} x2={px0 + pw} y2={PY(13)} stroke={TINTA} strokeWidth={2} />
          <line x1={px0} y1={PY(1)} x2={px0 + pw} y2={PY(13)} stroke={TINTA} strokeWidth={2} strokeDasharray="6 4" />
          <line x1={px0} y1={PY(1)} x2={px0 + pw} y2={PY(-11)} stroke={TINTA} strokeWidth={2} strokeDasharray="6 4" />
          {imagens.map((y) => <line key={y} x1={px0} y1={PY(1)} x2={px0 + pw} y2={PY(y)} stroke={SUJO} strokeWidth={2.5} />)}
          {imagens.map((y) => <circle key={y} cx={px0 + pw} cy={PY(y)} r="6" fill={SECO} stroke={TINTA} strokeWidth={2} />)}
          {fora.map((y) => <circle key={y} cx={px0 + pw} cy={PY(y)} r="6" fill={PAPEL} stroke={TINTA} strokeWidth={2} strokeDasharray="3 3" />)}
          <circle cx={px0} cy={PY(1)} r="7" fill={SUJO} stroke={TINTA} strokeWidth={2.5} />
          <Texto x={px0 - 10} y={PY(1) + 5} ancora="end" tam={18}>laser</Texto>
          <Texto x={px0 + pw + 14} y={PY(10) + 5} ancora="start" tam={19}>y = 10</Texto>
          <Texto x={px0 + pw + 14} y={PY(-10) + 5} ancora="start" tam={19}>y = −10</Texto>
          <Texto x={px0 + pw + 14} y={PY(2) + 5} ancora="start" tam={19}>y = 2</Texto>
          <Texto x={px0 + pw + 14} y={PY(14) + 5} ancora="start" tam={19}>fora do cone</Texto>
          <Texto x={px0 + pw + 14} y={PY(-14) + 5} ancora="start" tam={19}>fora do cone</Texto>
          <Texto x={230} y={PY(-16) + 40} tam={18}>{dado(rotulos, 6)}</Texto>
        </g>
      )}
    </svg>
  );
}

// Fibra óptica: raio axial e o raio mais lento (rente ao ângulo limite). Fora de escala. Resultado: revestimento escolhido e caminho do raio lento.
function FibraZigueZague({ rotulos }: Props) {
  const esc = dado(rotulos, 5);
  const cam = dado(rotulos, 6);
  const altura = esc ? 300 : 250;
  return (
    <svg viewBox={`0 0 460 ${altura}`} className="w-full max-w-[460px] h-auto" role="img" aria-label="fibra óptica de 3 quilômetros: o núcleo de índice 1,50 entre dois revestimentos, com o raio axial em linha reta e o raio mais lento em zigue-zague">
      <rect x="40" y="55" width="380" height="30" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <rect x="40" y="155" width="380" height="30" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      <rect x="40" y="85" width="380" height="70" fill={LIMPO} />
      <line x1="40" y1="120" x2="420" y2="120" stroke={CORTE} strokeWidth={4} />
      <polyline points="40,120 100,85 220,155 340,85 420,131" fill="none" stroke={SUJO} strokeWidth={4} strokeLinejoin="round" />
      <Texto x={230} y={76} tam={13}>{r(rotulos, 2, 'revestimento: 1,20 · 1,35 · 1,45 · 1,50')}</Texto>
      <Texto x={415} y={150} ancora="end" tam={13}>{r(rotulos, 0, 'núcleo 1,50')}</Texto>
      {esc && <Texto x={230} y={176} tam={13}>{esc}</Texto>}
      <Seta x1={60} y1={208} x2={100} y2={208} cor={CORTE} />
      <Texto x={108} y={213} ancora="start" tam={13}>{r(rotulos, 3, 'raio axial')}</Texto>
      <Seta x1={215} y1={208} x2={255} y2={208} cor={SUJO} />
      <Texto x={263} y={213} ancora="start" tam={13}>{r(rotulos, 4, 'raio mais lento')}</Texto>
      <Medida x1={40} y1={236} x2={420} y2={236} />
      <Texto x={230} y={230}>{r(rotulos, 1, '3,0 km')}</Texto>
      {cam && <Texto x={230} y={268} tam={14}>{cam}</Texto>}
      {cam && <Texto x={230} y={288} tam={12} cor="#5b6b5e">desenho fora de escala</Texto>}
    </svg>
  );
}

// Resistor em pé (retângulo) entre y1 e y2, no x dado; devolve só o corpo, os fios saem por fora.
const Resistor = ({ x, y1, y2, cor = AGUA }: { x: number; y1: number; y2: number; cor?: string }) => {
  const meio = (y1 + y2) / 2;
  return (
    <g stroke={TINTA} strokeWidth={3}>
      <line x1={x} y1={y1} x2={x} y2={meio - 17} /><line x1={x} y1={meio + 17} x2={x} y2={y2} />
      <rect x={x - 8} y={meio - 17} width="16" height="34" fill={cor} />
    </g>
  );
};

// Protoboard: 5 linhas (barras), 6 resistores e a fonte de 18 V. R3 aberto (a linha 5 não leva a nada) e R4 em curto: só no resultado.
function ProtoboardCurtoAberto({ rotulos }: Props) {
  const curto = dado(rotulos, 7);
  const aberto = dado(rotulos, 8);
  const i6 = dado(rotulos, 9);
  const barra = (x1: number, x2: number, y: number, nome: string) => (
    <g key={nome}>
      <rect x={x1} y={y - 10} width={x2 - x1} height="20" rx="3" fill={CHAO} stroke={TINTA} strokeWidth={2.5} />
      <Texto x={x1 + 7} y={y + 4} ancora="start" tam={12}>{nome}</Texto>
    </g>
  );
  return (
    <svg viewBox={`0 0 480 ${curto ? 330 : 300}`} className="w-full max-w-[480px] h-auto" role="img" aria-label="protoboard com cinco linhas: a fonte de 18 volts liga as linhas 1 e 3; R1 vai da linha 1 à 2; R2 da 2 à 3; R3 sai da linha 2 e termina na 5, sem mais nada; R4 tem as duas pontas na linha 2; R5 vai da 2 à 4 e R6 da 4 à 3">
      <path d="M70 40 H30 V132 M30 152 V270 H70" fill="none" stroke={TINTA} strokeWidth={3} />
      <line x1="14" y1="132" x2="46" y2="132" stroke={TINTA} strokeWidth={4} /><line x1="21" y1="146" x2="39" y2="146" stroke={TINTA} strokeWidth={4} />
      <line x1="30" y1="146" x2="30" y2="152" stroke={TINTA} strokeWidth={3} />
      <Texto x={52} y={146} ancora="start" tam={15}>{r(rotulos, 0, '18 V')}</Texto>
      <Texto x={4} y={126} ancora="start" tam={14}>+</Texto>
      {barra(70, 210, 40, 'linha 1')}
      {barra(70, 430, 120, 'linha 2')}
      {barra(200, 290, 195, 'linha 4')}
      {barra(70, 300, 270, 'linha 3')}
      {barra(360, 430, 195, 'linha 5')}
      <Resistor x={130} y1={50} y2={110} />
      <Texto x={146} y={84} ancora="start" tam={13}>{r(rotulos, 1, 'R1 0,10 kΩ')}</Texto>
      <Resistor x={95} y1={130} y2={260} />
      <Texto x={106} y={205} ancora="start" tam={13}>{r(rotulos, 2, 'R2 300 Ω')}</Texto>
      <Resistor x={245} y1={130} y2={185} />
      <Texto x={257} y={162} ancora="start" tam={13}>{r(rotulos, 5, 'R5 60 Ω')}</Texto>
      <Resistor x={245} y1={205} y2={260} />
      <Texto x={257} y={236} ancora="start" tam={13}>{r(rotulos, 6, 'R6 90 Ω')}</Texto>
      <g stroke={curto ? SUJO : TINTA} strokeWidth={3}>
        <path d="M305 110 V92 H345 V110" fill="none" />
        <rect x="315" y="84" width="20" height="16" fill={curto ? SUJO : AGUA} />
      </g>
      <Texto x={325} y={72} tam={13}>{r(rotulos, 4, 'R4 0,47 kΩ')}</Texto>
      <Resistor x={395} y1={130} y2={185} cor={aberto ? SUJO : AGUA} />
      <Texto x={395} y={226} tam={13}>{r(rotulos, 3, 'R3 0,15 kΩ')}</Texto>
      {curto && <Texto x={325} y={52} tam={13} cor={SUJO}>{curto}</Texto>}
      {aberto && <Texto x={474} y={254} ancora="end" tam={13} cor={SUJO}>{aberto}</Texto>}
      {i6 && <Texto x={200} y={308} tam={15}>{i6}</Texto>}
    </svg>
  );
}

// Símbolo de bateria em pé: placa longa em cima (positivo), curta embaixo.
const Pilha = ({ x, y }: { x: number; y: number }) => (
  <g stroke={TINTA} strokeWidth={4}>
    <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
    <line x1={x - 10} y1={y + 12} x2={x + 10} y2={y + 12} />
  </g>
);

// Duas baterias em paralelo ligadas a um resistor R ajustável mergulhado em água. Resultado: a bateria única e a potência máxima.
function BateriasParalelo({ rotulos }: Props) {
  const unica = dado(rotulos, 6);
  const pot = dado(rotulos, 7);
  return (
    <svg viewBox={`0 0 540 ${unica ? 330 : 290}`} className="w-full max-w-[540px] h-auto" role="img" aria-label="duas baterias reais ligadas em paralelo, uma de 16 volts com resistência interna de 1,5 ohm e outra de 4 volts com 3 ohms, ligadas a um resistor ajustável mergulhado em 100 gramas de água">
      <path d="M70 50 H370 V135 M70 230 H370 V195" fill="none" stroke={TINTA} strokeWidth={3} />
      {[{ x: 100, v: r(rotulos, 0, '16 V'), rin: r(rotulos, 1, 'Rin = 1,5 Ω') }, { x: 215, v: r(rotulos, 2, '4 V'), rin: r(rotulos, 3, 'Rin = 3 Ω') }].map((b) => (
        <g key={b.x}>
          <line x1={b.x} y1={50} x2={b.x} y2={100} stroke={TINTA} strokeWidth={3} />
          <Pilha x={b.x} y={100} />
          <line x1={b.x} y1={112} x2={b.x} y2={150} stroke={TINTA} strokeWidth={3} />
          <Resistor x={b.x} y1={150} y2={230} />
          <Texto x={b.x - 26} y={112} ancora="end" tam={15}>{b.v}</Texto>
          <Texto x={b.x + 16} y={195} ancora="start" tam={13}>{b.rin}</Texto>
          <Texto x={b.x + 14} y={96} ancora="start" tam={14}>+</Texto>
        </g>
      ))}
      <path d="M320 118 H420 V230 H320 Z" fill={AGUA} fillOpacity={0.55} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <rect x="355" y="135" width="30" height="60" fill={SECO} stroke={TINTA} strokeWidth={3} />
      <Seta x1={349} y1={190} x2={391} y2={140} cor={SUJO} larg={3} />
      <Texto x={370} y={219} tam={13}>{r(rotulos, 5, 'água 100 g')}</Texto>
      <Texto x={430} y={170} ancora="start" tam={14}>{r(rotulos, 4, 'R ajustável')}</Texto>
      <Texto x={160} y={270} tam={13}>em paralelo: + com + e − com −</Texto>
      {unica && <Texto x={270} y={304} tam={15}>{unica}</Texto>}
      {pot && <Texto x={270} y={324} tam={15}>{pot}</Texto>}
    </svg>
  );
}

export const DESENHOS_ACIMA_FISICA_B: Record<string, (p: Props) => React.ReactElement> = {
  'sirene-no-circulo': SireneNoCirculo,
  'tubo-com-agua': TuboComAgua,
  'corda-modos': CordaModos,
  'projetor-duas-lentes': ProjetorDuasLentes,
  'corredor-imagens': CorredorImagens,
  'fibra-zigue-zague': FibraZigueZague,
  'protoboard-curto-aberto': ProtoboardCurtoAberto,
  'baterias-paralelo': BateriasParalelo,
};
