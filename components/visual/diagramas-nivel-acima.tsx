'use client';
/* Desenhos das questões de nível acima de Matemática (22/11/2026). O aluno-do-zero se perdeu
   por falta de figura ("sem desenho do L", "qual é a base?") e, na 2ª leitura, porque a figura
   mostrava o RESULTADO antes da conta. Regra destes desenhos:
   - os rótulos de 0 em diante com valor padrão são DADOS do enunciado e aparecem sempre;
   - os rótulos marcados "só com rotulos" são RESULTADO: só aparecem quando a tela da conta os manda.
   A mesma figura entra duas vezes na aula: na abertura (só dados) e no passo que acha o resultado.
   Papel claro e cores de diagramas.tsx. */
import { AGUA, CHAO, CORTE, LIMPO, PAPEL, SECO, SUJO, TINTA, Texto, r, type Props } from './diagramas-base';

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

// Gramado em L: retângulo de 40 m por 30 m com o canto da casa (15 m por 10 m) fora.
function GramadoEmL({ rotulos }: Props) {
  const resultado = dado(rotulos, 6);
  return (
    <svg viewBox="0 0 440 290" className="w-full max-w-[440px] h-auto" role="img" aria-label="terreno em L: retângulo de 40 por 30 metros sem o canto da casa de 15 por 10">
      <rect x="235" y="40" width="105" height="70" fill={CHAO} stroke={TINTA} strokeWidth={3} strokeDasharray="7 5" />
      <path d="M60 40 H235 V110 H340 V250 H60 Z" fill={LIMPO} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <Texto x={287} y={78} tam={13}>{r(rotulos, 0, 'casa')}</Texto>
      <Medida x1={60} y1={26} x2={340} y2={26} />
      <Texto x={200} y={18}>{r(rotulos, 3, '40 m')}</Texto>
      <Medida x1={40} y1={40} x2={40} y2={250} />
      <Texto x={68} y={86} ancora="start">{r(rotulos, 4, '30 m')}</Texto>
      <Medida x1={356} y1={40} x2={356} y2={110} />
      <Texto x={364} y={80} ancora="start">{r(rotulos, 2, '10 m')}</Texto>
      <Medida x1={235} y1={124} x2={340} y2={124} />
      <Texto x={287} y={144}>{r(rotulos, 1, '15 m')}</Texto>
      {resultado && <Texto x={150} y={170} tam={14}>{resultado}</Texto>}
      {resultado && <Texto x={150} y={192} tam={15}>{dado(rotulos, 7)}</Texto>}
      <Texto x={220} y={278} tam={13}>{r(rotulos, 5, 'tracejado: o canto da casa, que fica sem grama')}</Texto>
    </svg>
  );
}

// Triângulo 5, 12, 13 com a circunferência dentro, encostando nos 3 lados; cada raio chega ao lado em ângulo reto.
function CirculoNoTriangulo({ rotulos }: Props) {
  const tres = dado(rotulos, 5);
  return (
    <svg viewBox="0 0 280 300" className="w-full max-w-[280px] h-auto" role="img" aria-label="triângulo retângulo de lados 5, 12 e 13 com a circunferência inscrita">
      <path d="M40 260 V20 L140 260 Z" fill={CHAO} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <circle cx="80" cy="220" r="40" fill={AGUA} stroke={TINTA} strokeWidth={3} />
      {tres && <g stroke={SUJO} strokeWidth={2.5}><line x1="80" y1="220" x2="40" y2="20" /><line x1="80" y1="220" x2="40" y2="260" /><line x1="80" y1="220" x2="140" y2="260" /></g>}
      <g stroke={CORTE} strokeWidth={3} strokeDasharray="5 4">
        <line x1="80" y1="220" x2="40" y2="220" />
        <line x1="80" y1="220" x2="80" y2="260" />
        <line x1="80" y1="220" x2="116.9" y2="204.6" />
      </g>
      <circle cx="80" cy="220" r="5" fill={TINTA} />
      <Reto x={40} y={260} u={[1, 0]} v={[0, -1]} />
      <Reto x={40} y={220} u={[1, 0]} v={[0, -1]} t={8} />
      <Reto x={80} y={260} u={[0, -1]} v={[1, 0]} t={8} />
      <Reto x={116.9} y={204.6} u={[-0.9231, 0.3846]} v={[-0.3846, -0.9231]} t={8} />
      <Texto x={100} y={282}>{r(rotulos, 0, '5')}</Texto>
      <Texto x={26} y={140} ancora="end">{r(rotulos, 1, '12')}</Texto>
      <Texto x={112} y={120} ancora="start">{r(rotulos, 2, '13')}</Texto>
      <Texto x={62} y={212} tam={13}>{r(rotulos, 3, 'r')}</Texto>
      {dado(rotulos, 4) && <Texto x={150} y={236} ancora="start" tam={14}>{dado(rotulos, 4)}</Texto>}
      {tres && <Texto x={150} y={258} ancora="start" tam={12}>{tres}</Texto>}
      {tres && <Texto x={150} y={274} ancora="start" tam={12}>um por lado</Texto>}
    </svg>
  );
}

// Retângulo com os 4 cantos na circunferência: cada canto é ângulo reto; a diagonal é o diâmetro.
function RetanguloNaRoda({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 330 270" className="w-full max-w-[330px] h-auto" role="img" aria-label="retângulo inscrito numa circunferência, com a diagonal passando pelo centro">
      <circle cx="160" cy="130" r="100" fill={SECO} stroke={TINTA} strokeWidth={3} />
      <rect x="80" y="70" width="160" height="120" fill={AGUA} stroke={TINTA} strokeWidth={4} />
      <Reto x={80} y={70} u={[1, 0]} v={[0, 1]} t={10} /><Reto x={240} y={70} u={[-1, 0]} v={[0, 1]} t={10} />
      <Reto x={240} y={190} u={[-1, 0]} v={[0, -1]} t={10} /><Reto x={80} y={190} u={[1, 0]} v={[0, -1]} t={10} />
      <line x1="80" y1="190" x2="240" y2="70" stroke={CORTE} strokeWidth={4} />
      <circle cx="160" cy="130" r="6" fill={TINTA} />
      <Texto x={160} y={62}>{r(rotulos, 0, '4k')}</Texto>
      <Texto x={52} y={134} ancora="end">{r(rotulos, 1, '3k')}</Texto>
      <Texto x={165} y={20} cor={CORTE}>{r(rotulos, 2, 'diagonal')}</Texto>
      <Texto x={165} y={254} tam={13}>{r(rotulos, 3, 'lados na razão 3 : 4 · perímetro 28 cm')}</Texto>
    </svg>
  );
}

// Canteiro 12 por 8 com P no lado de cima: ABP no meio e as duas laterais.
function CanteiroTriangulos({ rotulos }: Props) {
  return (
    <svg viewBox="0 0 360 310" className="w-full max-w-[360px] h-auto" role="img" aria-label="canteiro retangular dividido em três triângulos pelo ponto P no lado de cima">
      <path d="M40 200 L40 40 L140 40 Z" fill={LIMPO} />
      <path d="M280 200 L280 40 L140 40 Z" fill={LIMPO} />
      <path d="M40 200 L280 200 L140 40 Z" fill={SUJO} />
      <rect x="40" y="40" width="240" height="160" fill="none" stroke={TINTA} strokeWidth={4} />
      <path d="M40 200 L140 40 L280 200" fill="none" stroke={TINTA} strokeWidth={3} />
      <line x1="140" y1="40" x2="140" y2="200" stroke={TINTA} strokeWidth={2} strokeDasharray="6 5" />
      <Reto x={140} y={200} u={[-1, 0]} v={[0, -1]} t={9} />
      <Reto x={40} y={200} u={[1, 0]} v={[0, -1]} t={9} /><Reto x={280} y={200} u={[-1, 0]} v={[0, -1]} t={9} />
      <circle cx="140" cy="40" r="6" fill={TINTA} />
      <Texto x={28} y={212} ancora="end">A</Texto>
      <Texto x={292} y={212} ancora="start">B</Texto>
      <Texto x={292} y={34} ancora="start">C</Texto>
      <Texto x={28} y={34} ancora="end">D</Texto>
      <Texto x={140} y={28}>P</Texto>
      <Texto x={90} y={32} tam={13}>{r(rotulos, 0, '5 m')}</Texto>
      {dado(rotulos, 1) && <Texto x={210} y={32} tam={13}>{dado(rotulos, 1)}</Texto>}
      <Texto x={160} y={222}>{r(rotulos, 2, '12 m')}</Texto>
      <Texto x={148} y={130} ancora="start">{r(rotulos, 3, '8 m')}</Texto>
      <Texto x={62} y={112} tam={12}>ADP</Texto>
      <Texto x={236} y={112} tam={12}>BCP</Texto>
      <Texto x={110} y={180} tam={12}>ABP</Texto>
      {dado(rotulos, 4) && <Texto x={152} y={180} ancora="start" tam={13}>{dado(rotulos, 4)}</Texto>}
      {dado(rotulos, 5) && <Texto x={62} y={130} tam={12}>{dado(rotulos, 5)}</Texto>}
      {dado(rotulos, 7) && <Texto x={250} y={130} tam={12}>{dado(rotulos, 7)}</Texto>}
      <Texto x={180} y={268} tam={12}>{r(rotulos, 6, 'verde: grama (R$ 20 por m²)')}</Texto>
      <Texto x={180} y={286} tam={12}>rosa: flores (R$ 35 por m²)</Texto>
    </svg>
  );
}

// Pirâmide vista de lado, cortada por um plano paralelo à base. O resultado (4 cm e a distância) só com rotulos.
function PiramideCortada({ rotulos }: Props) {
  const menor = dado(rotulos, 2);
  return (
    <svg viewBox="0 0 480 300" className="w-full max-w-[480px] h-auto" role="img" aria-label="pirâmide de 12 centímetros de altura cortada por um plano paralelo à base, com a pirâmide menor no topo e o tronco embaixo">
      <path d="M150 30 L40 240 L260 240 Z" fill={AGUA} stroke={TINTA} strokeWidth={4} strokeLinejoin="round" />
      <path d="M150 30 L113.3 100 L186.7 100 Z" fill={SECO} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <line x1="95" y1="100" x2="205" y2="100" stroke={CORTE} strokeWidth={3} strokeDasharray="6 5" />
      <circle cx="150" cy="30" r="4" fill={TINTA} />
      <Texto x={150} y={18} tam={13}>ápice</Texto>
      <Texto x={214} y={104} ancora="start" tam={12} cor={CORTE}>plano de corte</Texto>
      <Texto x={150} y={88} tam={12}>menor</Texto>
      <Texto x={150} y={180} tam={13}>tronco</Texto>
      <Medida x1={400} y1={30} x2={400} y2={240} />
      <Texto x={410} y={140} ancora="start" tam={13}>{r(rotulos, 0, '12 cm')}</Texto>
      {menor && <><Medida x1={340} y1={30} x2={340} y2={100} /><Texto x={332} y={70} ancora="end" tam={13}>{menor}</Texto></>}
      {dado(rotulos, 3) && <><Medida x1={340} y1={100} x2={340} y2={240} /><Texto x={332} y={176} ancora="end" tam={13}>{dado(rotulos, 3)}</Texto></>}
      <Texto x={240} y={264} tam={12}>{r(rotulos, 1, 'volume do tronco = 26 vezes o volume da menor')}</Texto>
      <Texto x={240} y={284} tam={12}>{r(rotulos, 4, 'a base é um quadrado (vista de lado, é só uma linha)')}</Texto>
    </svg>
  );
}

// Caixa 6 por 8 por 24 em pé. As diagonais (e o ângulo reto) só aparecem com rotulos.
function VaretaNaCaixa({ rotulos }: Props) {
  const base = dado(rotulos, 3);
  const bloco = dado(rotulos, 4);
  return (
    <svg viewBox="0 0 440 280" className="w-full max-w-[440px] h-auto" role="img" aria-label="caixa de 6 por 8 por 24 centímetros em pé, com a diagonal da base e a diagonal do bloco">
      <path d="M60 50 H120 L156 23 H96 Z" fill={CHAO} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <path d="M120 50 L156 23 V203 L120 230 Z" fill={AGUA} stroke={TINTA} strokeWidth={3} strokeLinejoin="round" />
      <rect x="60" y="50" width="60" height="180" fill={LIMPO} fillOpacity={0.55} stroke={TINTA} strokeWidth={3} />
      <path d="M60 230 L96 203 H156 M96 203 V23" fill="none" stroke={TINTA} strokeWidth={2} strokeDasharray="5 4" />
      {base && <line x1="60" y1="230" x2="156" y2="203" stroke={SUJO} strokeWidth={4} />}
      {bloco && <line x1="60" y1="230" x2="156" y2="23" stroke={CORTE} strokeWidth={4} />}
      {bloco && <Reto x={156} y={203} u={[-0.963, 0.271]} v={[0, -1]} t={9} />}
      <circle cx="60" cy="230" r="5" fill={TINTA} />
      <Texto x={90} y={252}>{r(rotulos, 0, '8 (b)')}</Texto>
      <Texto x={152} y={232} ancora="start">{r(rotulos, 1, '6 (a)')}</Texto>
      <Texto x={52} y={146} ancora="end">{r(rotulos, 2, '24 (c)')}</Texto>
      {base && <Texto x={176} y={214} ancora="start" cor={SUJO} tam={13}>{base}</Texto>}
      {bloco && <Texto x={176} y={110} ancora="start" cor={CORTE} tam={13}>{bloco}</Texto>}
      <Texto x={220} y={272} tam={12}>{r(rotulos, 5, 'a caixa está em pé: base 6 por 8, altura 24')}</Texto>
    </svg>
  );
}

// Lata vista de lado: 3 bolas de raio r empilhadas, altura 6r. As frações (do volume) só com rotulos.
function LataBolas({ rotulos }: Props) {
  const bolas = dado(rotulos, 3);
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-auto" role="img" aria-label="lata cilíndrica vista de lado com 3 bolas empilhadas, cada uma encostando nas paredes e nas outras">
      <rect x="135" y="40" width="70" height="210" fill={dado(rotulos, 4) ? AGUA : PAPEL} stroke={TINTA} strokeWidth={4} />
      <g fill={SECO} stroke={TINTA} strokeWidth={3}>
        <circle cx="170" cy="75" r="35" /><circle cx="170" cy="145" r="35" /><circle cx="170" cy="215" r="35" />
      </g>
      <line x1="170" y1="145" x2="205" y2="145" stroke={CORTE} strokeWidth={3} />
      <circle cx="170" cy="145" r="4" fill={TINTA} />
      <Medida x1={135} y1={26} x2={205} y2={26} />
      <Texto x={170} y={18}>{r(rotulos, 0, '2r')}</Texto>
      <Medida x1={116} y1={40} x2={116} y2={250} />
      <Texto x={108} y={150} ancora="end">{r(rotulos, 1, '6r')}</Texto>
      <Texto x={186} y={137} tam={13}>{r(rotulos, 2, 'r')}</Texto>
      {bolas && <Texto x={226} y={100} ancora="start" tam={13}>{bolas}</Texto>}
      {dado(rotulos, 4) && <Texto x={226} y={176} ancora="start" tam={13} cor={CORTE}>{dado(rotulos, 4)}</Texto>}
      {dado(rotulos, 6) && <Texto x={200} y={288} tam={11}>{dado(rotulos, 6)}</Texto>}
      <Texto x={200} y={270} tam={13}>{r(rotulos, 5, 'lata de 1,5 L com 3 bolas de tênis')}</Texto>
    </svg>
  );
}

// Ladrilho de 10 cm com rejunte fino ao redor; a ficha (raio 3 cm), com o centro a 2 cm do rejunte de baixo, passa por cima dele.
// Com rotulos[4] mostra as regiões: 0 rejuntes (16), 1 rejunte (4 faixas de 12), 2 rejuntes (4 cantos de 9).
function LadrilhoFicha({ rotulos }: Props) {
  const regioes = dado(rotulos, 4);
  const REGIOES: [number, number, number, number, string, string][] = [
    [110, 100, 80, 80, LIMPO, '16'],
    [50, 40, 60, 60, SUJO, '9'], [190, 40, 60, 60, SUJO, '9'], [50, 180, 60, 60, SUJO, '9'], [190, 180, 60, 60, SUJO, '9'],
    [110, 40, 80, 60, SECO, '12'], [110, 180, 80, 60, SECO, '12'], [50, 100, 60, 80, SECO, '12'], [190, 100, 60, 80, SECO, '12'],
  ];
  return (
    <svg viewBox={`0 0 330 ${regioes ? 356 : 310}`} className="w-full max-w-[330px] h-auto" role="img" aria-label="ladrilho de 10 centímetros com rejunte fino ao redor e a ficha de raio 3 centímetros passando por cima do rejunte de baixo">
      <rect x="50" y="246" width="200" height="50" fill={PAPEL} fillOpacity={0.6} stroke={TINTA} strokeWidth={1.5} strokeDasharray="6 5" />
      <rect x="42" y="32" width="216" height="216" fill="#b6ae9b" />
      <rect x="50" y="40" width="200" height="200" fill={CHAO} stroke={TINTA} strokeWidth={3} />
      {regioes && REGIOES.map(([x, y, w, h, cor]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={cor} fillOpacity={0.7} stroke={TINTA} strokeWidth={1.5} />
      ))}
      <circle cx="170" cy="190" r="60" fill={regioes ? 'none' : AGUA} fillOpacity={0.8} stroke={TINTA} strokeWidth={regioes ? 2.5 : 3} strokeDasharray={regioes ? '3 5' : undefined} />
      {regioes && REGIOES.map(([x, y, w, h, , n]) => <Texto key={`t${x}-${y}`} x={x + w / 2} y={y + h / 2 + 5} tam={14}>{n}</Texto>)}
      <line x1="170" y1="190" x2="230" y2="190" stroke={TINTA} strokeWidth={2.5} />
      <circle cx="170" cy="190" r="4" fill={TINTA} />
      <Medida x1={32} y1={40} x2={32} y2={240} />
      <text x={16} y={140} transform="rotate(-90 16 140)" textAnchor="middle" fontSize={13} fontWeight={700} fill={TINTA}>{r(rotulos, 0, '10 cm')}</text>
      {!regioes && <Texto x={186} y={176} tam={11}>{r(rotulos, 1, 'raio 3 cm')}</Texto>}
      <line x1="268" y1="144" x2="258" y2="144" stroke={TINTA} strokeWidth={2} />
      <Texto x={272} y={148} ancora="start" tam={12}>{r(rotulos, 3, 'rejunte')}</Texto>
      <Texto x={150} y={276} tam={11}>ladrilho vizinho</Texto>
      {regioes && <Texto x={165} y={318} tam={12}>{regioes}</Texto>}
      {regioes && <Texto x={165} y={336} tam={12}>{dado(rotulos, 5)}</Texto>}
      {regioes && <Texto x={165} y={352} tam={12}>{dado(rotulos, 6)}</Texto>}
    </svg>
  );
}

// Painel de 6 lâmpadas aprovado. Com rotulos[2], mostra as 3 apagadas em fila e os 4 vãos.
const ACESAS = [true, false, true, false, false, true];
function PainelLampadas({ rotulos }: Props) {
  const vaos = dado(rotulos, 2);
  return (
    <svg viewBox={`0 0 340 ${vaos ? 290 : 160}`} className="w-full max-w-[340px] h-auto" role="img" aria-label="painel aprovado com 6 lâmpadas: acesa, apagada, acesa, apagada, apagada, acesa">
      <rect x="4" y="10" width="332" height="72" fill={CHAO} stroke={TINTA} strokeWidth={4} />
      {ACESAS.map((acesa, i) => (
        <circle key={i} cx={38 + i * 53} cy={46} r={20} fill={acesa ? SECO : PAPEL} stroke={TINTA} strokeWidth={3} />
      ))}
      <Texto x={170} y={104} tam={13}>{r(rotulos, 0, 'um painel aprovado')}</Texto>
      <Texto x={170} y={124} tam={12}>{r(rotulos, 1, 'amarelo = acesa · branco = apagada')}</Texto>
      <Texto x={170} y={144} tam={12}>nenhuma acesa ao lado de outra acesa</Texto>
      {vaos && (<>
        <g stroke={TINTA} strokeWidth={3} fill={PAPEL}>
          <circle cx={90} cy={196} r={18} /><circle cx={170} cy={196} r={18} /><circle cx={250} cy={196} r={18} />
        </g>
        <g stroke={CORTE} strokeWidth={3} strokeDasharray="5 4">
          <line x1="50" y1="170" x2="50" y2="222" /><line x1="130" y1="170" x2="130" y2="222" />
          <line x1="210" y1="170" x2="210" y2="222" /><line x1="290" y1="170" x2="290" y2="222" />
        </g>
        {['1', '2', '3', '4'].map((n, i) => <Texto key={n} x={50 + i * 80} y={240} cor={CORTE}>{n}</Texto>)}
        <Texto x={170} y={262} tam={12}>{vaos}</Texto>
        <Texto x={170} y={280} tam={12}>{dado(rotulos, 3)}</Texto>
      </>)}
    </svg>
  );
}

export const DESENHOS_NIVEL_ACIMA = {
  'gramado-em-l': GramadoEmL,
  'circulo-no-triangulo': CirculoNoTriangulo,
  'retangulo-na-roda': RetanguloNaRoda,
  'canteiro-triangulos': CanteiroTriangulos,
  'piramide-cortada': PiramideCortada,
  'vareta-na-caixa': VaretaNaCaixa,
  'lata-bolas': LataBolas,
  'ladrilho-ficha': LadrilhoFicha,
  'painel-lampadas': PainelLampadas,
};
