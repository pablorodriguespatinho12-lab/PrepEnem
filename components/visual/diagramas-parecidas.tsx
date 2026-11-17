'use client';
/* Desenhos das aulas no molde do robô (17/11/2026): porta que abre, holofote no palco
   de 3 pontas (parecida com a 176 do ENEM 2026) e trilhas do parque (parecida com a 174).
   Mesmo papel e mesmas cores de diagramas.tsx; só se mexem no clique. */
import { APAGADO, CHAO, CORTE, LIMPO, ROBO, SECO, SUJO, TINTA, Texto, BotaoVer, r, useAoClicar, type Props } from './diagramas-base';

// Porta vista de cima: gira na dobradiça e varre 1/4 de círculo no chão.
const DOBRA = { x: 40, y: 40 };
const PORTA = 200;
function PortaAbrindo({ rotulos }: Props) {
  const [f, abrir, rodando] = useAoClicar(2500);
  const ang = (Math.PI / 2) * f;
  const ponta = { x: DOBRA.x + PORTA * Math.cos(ang), y: DOBRA.y + PORTA * Math.sin(ang) };
  const varrido = `M${DOBRA.x} ${DOBRA.y} L${DOBRA.x + PORTA} ${DOBRA.y} A${PORTA} ${PORTA} 0 0 1 ${ponta.x} ${ponta.y} Z`;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 270 270" className="w-full max-w-[300px] h-auto" role="img" aria-label="porta girando na dobradiça vista de cima">
        <rect x={DOBRA.x} y={DOBRA.y} width={PORTA} height={PORTA} fill={CHAO} />
        <path d={varrido} fill={LIMPO} />
        <path d={`M${DOBRA.x} ${DOBRA.y - 6} H260 M${DOBRA.x - 6} ${DOBRA.y} V260`} stroke={TINTA} strokeWidth={8} />
        <line x1={DOBRA.x} y1={DOBRA.y} x2={ponta.x} y2={ponta.y} stroke={ROBO} strokeWidth={10} strokeLinecap="round" />
        <circle cx={DOBRA.x} cy={DOBRA.y} r={7} fill={TINTA} />
        <Texto x={140} y={264}>{r(rotulos, 0, 'porta: 80 cm')}</Texto>
      </svg>
      <BotaoVer onClick={abrir} rodando={rodando}>Ver a porta abrir</BotaoVer>
    </div>
  );
}

// Triângulo de lados iguais: o centro divide a altura em 2 partes até a ponta e 1 até o lado.
const A = { x: 150, y: 30 };
const B = { x: 30, y: 238 };
const C = { x: 270, y: 238 };
const G = { x: 150, y: 30 + (2 / 3) * 208 };
const TRIANGULO = `M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} Z`;
function TrianguloCentro({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 330 270" className="w-full max-w-[320px] h-auto" role="img" aria-label="triângulo com a altura dividida em 3 partes pelo centro">
      <path d={TRIANGULO} fill={CHAO} stroke={TINTA} strokeWidth={4} />
      <line x1={A.x} y1={A.y} x2={G.x} y2={G.y} stroke={SUJO} strokeWidth={6} />
      <line x1={G.x} y1={G.y} x2={150} y2={238} stroke={CORTE} strokeWidth={6} />
      <circle cx={G.x} cy={G.y} r={7} fill={TINTA} />
      <Texto x={160} y={110} ancora="start" tam={13}>{r(rotulos, 0, '2 partes: até a ponta')}</Texto>
      <Texto x={160} y={212} ancora="start" tam={13}>{r(rotulos, 1, '1 parte: até o lado')}</Texto>
      <Texto x={150} y={262}>{r(rotulos, 2, 'altura = 3 partes')}</Texto>
    </svg>
  );
}

// O holofote no centro: a luz cresce até passar das 3 pontas com a sobra.
const ALCANCE = (2 / 3) * 208;
const SOBRA = 20;
function HolofotePalco({ rotulos }: Props) {
  const [f, acender, rodando] = useAoClicar(2500);
  const raio = (ALCANCE + SOBRA) * f;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="-15 0 330 340" className="w-full max-w-[300px] h-auto" role="img" aria-label="luz do holofote crescendo até passar das 3 pontas do palco">
        <circle cx={G.x} cy={G.y} r={raio} fill={SECO} opacity={0.45} />
        <path d={TRIANGULO} fill={CHAO} stroke={TINTA} strokeWidth={4} opacity={0.9} />
        <line x1={G.x} y1={G.y} x2={A.x} y2={A.y} stroke={SUJO} strokeWidth={4} strokeDasharray="7 5" />
        <circle cx={G.x} cy={G.y} r={8} fill={TINTA} />
        <Texto x={G.x + 10} y={110} ancora="start">{r(rotulos, 0, 'centro até a ponta')}</Texto>
        <Texto x={G.x} y={334}>{r(rotulos, 1, '+ 1 m de sobra')}</Texto>
      </svg>
      <BotaoVer onClick={acender} rodando={rodando}>Ver a luz chegar</BotaoVer>
    </div>
  );
}

// Trilhas do parque: portaria → lago → mirante → cachoeira → saída.
const NOS = [{ x: 35, n: 'Portaria' }, { x: 120, n: 'Lago' }, { x: 210, n: 'Mirante' }, { x: 270, n: 'Cachoeira' }, { x: 335, n: 'Saída' }];
const TRILHAS = [4, 7, 1, 3];
const Y = 110;
const desvios = (n: number) => Array.from({ length: n }, (_, i) => (n === 1 ? 0 : -60 + (120 * i) / (n - 1)));
function curva(trecho: number, d: number) {
  const x1 = NOS[trecho].x;
  const x2 = NOS[trecho + 1].x;
  return `M${x1} ${Y} Q${(x1 + x2) / 2} ${Y + d * 1.6} ${x2} ${Y}`;
}
// 12 caminhos de exemplo, para o botão acender um de cada vez.
const EXEMPLOS = Array.from({ length: 12 }, (_, k) => [k % 4, (k * 3) % 7, 0, k % 3]);
function TrilhasParque({ rotulos }: Props) {
  const [f, contar, rodando] = useAoClicar(6000);
  const atual = rodando ? EXEMPLOS[Math.min(EXEMPLOS.length - 1, Math.floor(f * EXEMPLOS.length))] : null;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 370 200" className="w-full max-w-[340px] h-auto" role="img" aria-label="trilhas entre portaria, lago, mirante, cachoeira e saída">
        {TRILHAS.map((n, t) => desvios(n).map((d, i) => {
          const acesa = atual?.[t] === i;
          return <path key={`${t}-${i}`} d={curva(t, d)} fill="none" stroke={acesa ? SUJO : APAGADO} strokeWidth={acesa ? 5 : 2} opacity={acesa ? 1 : 0.55} />;
        }))}
        {NOS.map((no) => (
          <g key={no.n}>
            <circle cx={no.x} cy={Y} r={9} fill={TINTA} />
            <Texto x={no.x} y={Y + 78} tam={11}>{no.n}</Texto>
          </g>
        ))}
        {TRILHAS.map((n, t) => <Texto key={t} x={(NOS[t].x + NOS[t + 1].x) / 2} y={18} cor={CORTE}>{String(n)}</Texto>)}
        <Texto x={180} y={40} tam={13}>{r(rotulos, 0, '4 × 7 × 1 × 3 = 84 caminhos')}</Texto>
      </svg>
      <BotaoVer onClick={contar} rodando={rodando}>Ver os caminhos</BotaoVer>
    </div>
  );
}

export const DESENHOS_PARECIDAS = {
  'porta-abrindo': PortaAbrindo,
  'triangulo-centro': TrianguloCentro,
  'holofote-palco': HolofotePalco,
  'trilhas-parque': TrilhasParque,
} as const;
