'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import './lousa.css';
import { ALTURA, LARGURA, type AulaLousa as Aula, type Cena, type Cor, type Desenho, type Fala } from '@/lib/aula-lousa/tipos';
import { temFracao } from '@/lib/aula-lousa/fracoes';
import { acomodarFracoes } from '@/lib/aula-lousa/espaco';
import { TextoComFracoes } from './texto-com-fracoes';
import { Diagrama } from '@/components/visual/diagramas';
import type { NomeDiagrama } from '@/lib/visual/especificacao';

const COR: Record<Cor, string> = {
  tinta: '#1b2430', azul: '#1f6fd1', vermelho: '#d63a2f', verde: '#1f9d55',
  amarelo: '#ffe14a', cinza: '#5a6b66', rosa: '#ff8d7a', verdeClaro: '#b9ecc0',
};
const SEGUNDOS_DE_FOLGA = 1.6;
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/** Variáveis de tempo do CSS (--t = quando começa, --d = quanto dura). */
const tempo = (t: number, d?: number): CSSProperties => ({ '--t': `${t}s`, ...(d ? { '--d': `${d}s` } : {}) } as CSSProperties);

function Traco({ d }: { d: Desenho }) {
  const cor = COR[('cor' in d && d.cor) || 'tinta'];
  switch (d.k) {
    case 'tx':
      if (temFracao(d.s)) return <TextoComFracoes x={d.x} y={d.y} s={d.s} cor={cor} tam={d.tam} ancora={d.ancora} estilo={tempo(d.t)} />;
      return <text className="tx" x={d.x} y={d.y} fill={cor} fontSize={d.tam} textAnchor={d.ancora} style={tempo(d.t)}>{d.s}</text>;
    case 'hl':
      return <rect className="wipe" x={d.x} y={d.y} width={d.w} height={d.h} fill={cor} fillOpacity={0.85} style={tempo(d.t)} />;
    case 'linha':
      return <path className="tr" d={`M${d.x1} ${d.y1}L${d.x2} ${d.y2}`} pathLength={1} stroke={cor} strokeWidth={3} style={tempo(d.t, d.dur)} />;
    case 'circ':
      return <circle className="tr" cx={d.cx} cy={d.cy} r={d.r} pathLength={1} stroke={cor} strokeWidth={3} style={tempo(d.t, 0.5)} />;
    case 'caixa':
      return <path className="tr" d={`M${d.x} ${d.y}h${d.w}v${d.h}h${-d.w}z`} pathLength={1} stroke={cor} strokeWidth={3} style={tempo(d.t, d.dur)} />;
    case 'caminho':
      return <path className="tr" d={d.d} pathLength={1} stroke={cor} strokeWidth={d.larg} style={tempo(d.t, d.dur)} />;
    case 'grade': {
      const marcados = new Set(d.marcados ?? []);
      return (
        <g>
          {Array.from({ length: d.cols * d.rows }, (_, i) => (
            <rect
              key={i}
              className="pop"
              x={d.x0 + (i % d.cols) * (d.s + d.gap)}
              y={d.y0 + Math.floor(i / d.cols) * (d.s + d.gap)}
              width={d.s}
              height={d.s}
              fill={marcados.has(i) ? COR.rosa : '#e2e8e4'}
              stroke={COR.tinta}
              strokeWidth={2}
              style={tempo(d.t0 + i * d.passo)}
            />
          ))}
        </g>
      );
    }
  }
}

/** O que um leitor de tela ouve no lugar do desenho: os textos da lousa, em ordem. */
const descricao = (desenho: Desenho[]): string => desenho.flatMap((d) => (d.k === 'tx' ? [d.s] : [])).join('. ');

function Professor({ falando }: { falando: boolean }) {
  return (
    <svg className={`lousa-prof${falando ? ' fala' : ''}`} viewBox="0 0 16 16" shapeRendering="crispEdges" role="img" aria-label="Professor de pixel">
      <rect x="4" y="1" width="8" height="3" fill="#2b2118" /><rect x="4" y="4" width="8" height="6" fill="#e8b98f" />
      <rect x="5" y="5" width="2" height="2" fill="#fff" stroke="#2b2118" strokeWidth=".6" /><rect x="9" y="5" width="2" height="2" fill="#fff" stroke="#2b2118" strokeWidth=".6" />
      <rect className="boca" x="7" y="8" width="2" height="1" fill="#7a2e2e" />
      <rect x="3" y="10" width="10" height="6" fill="#2f6f55" /><rect x="13" y="10" width="1" height="5" fill="#d63a2f" />
    </svg>
  );
}

function Prova({ cena, marcada, onEscolher }: { cena: Extract<Cena, { tipo: 'prova' }>; marcada: number | undefined; onEscolher: (k: number) => void }) {
  const respondeu = marcada !== undefined;
  return (
    <div className="lousa-prova">
      <small>Prove você</small>
      <p className="q">{cena.pergunta}</p>
      <div className="lousa-ops">
        {cena.opcoes.map((o, k) => (
          <button
            key={k}
            type="button"
            disabled={respondeu}
            className={`lousa-opt${respondeu && k === cena.certa ? ' certo' : ''}${respondeu && k === marcada && k !== cena.certa ? ' errado' : ''}`}
            onClick={() => onEscolher(k)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** As falas da cena, em linhas que entram no segundo marcado. */
function Balao({ falas }: { falas: Fala[] }) {
  return (
    <div className="lousa-balao" aria-live="polite">
      {falas.map(([t, frase], i) => <p key={i} className="f" style={tempo(t)}>{frase}</p>)}
    </div>
  );
}

export function AulaLousa({ aula, onFechar }: { aula: Aula; onFechar?: () => void }) {
  const total = aula.cenas.length;
  const [i, setI] = useState(0);
  const [rodada, setRodada] = useState(0); // "ver de novo" remonta a cena e o traço recomeça
  const [pronto, setPronto] = useState(false); // "mostrar tudo"
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [falando, setFalando] = useState(true);
  const cena = aula.cenas[i];
  const marcada = respostas[i];

  // Falas da cena: se já respondeu a prova, só o motivo da letra escolhida.
  const falas: Fala[] = cena.tipo === 'prova' && marcada !== undefined ? [[0.1, cena.porque[marcada]]] : cena.fala;
  const fimDaFala = falas.reduce((m, [t]) => Math.max(m, t), 0) + SEGUNDOS_DE_FOLGA;
  const aviso = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setFalando(true);
    aviso.current = setTimeout(() => setFalando(false), fimDaFala * 1000);
    return () => { if (aviso.current) clearTimeout(aviso.current); };
  }, [i, rodada, marcada, fimDaFala]);

  // Lousa aberta: o fundo animado do site espera (globals.css). Medido no build com CPU 4x mais lenta:
  // 1.441 ms de tarefa em 6 s caem para 532 ms; sem isso, o mundo pixel atrás gastava 2/3 do tempo.
  useEffect(() => {
    document.documentElement.setAttribute('data-lousa-aberta', 'sim');
    return () => document.documentElement.removeAttribute('data-lousa-aberta');
  }, []);

  const vai = useCallback((n: number) => { setI(Math.min(total - 1, Math.max(0, n))); setPronto(false); }, [total]);
  const proximo = () => {
    if (i < total - 1) return vai(i + 1);
    setRespostas({});
    vai(0);
  };
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') vai(i + 1);
      else if (e.key === 'ArrowLeft') vai(i - 1);
    };
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [i, vai]);

  const ultima = i === total - 1;
  return (
    <div className={`lousa${pronto ? ' fim' : ''}`}>
      <div className="lousa-topo">
        <span>{i + 1}/{total}</span>
        <div className="lousa-barra"><i style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
      </div>

      <div className="lousa-quadro" key={`${i}-${rodada}`}>
        {cena.tipo === 'lousa' && (
          <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={descricao(cena.desenho)}>
            {acomodarFracoes(cena.desenho).map((d, k) => <Traco key={k} d={d} />)}
          </svg>
        )}
        {cena.tipo === 'papel' && (
          <div className="lousa-papel">
            <small>{cena.rotulo}</small>
            <p>{cena.texto}</p>
            {cena.alternativas && (
              <div className={cena.alternativas.some((x) => x.length > 14) ? 'lousa-alts longas' : 'lousa-alts'}>
                {cena.alternativas.map((a, k) => <span key={k}>{LETRAS[k]} {a}</span>)}
              </div>
            )}
          </div>
        )}
        {cena.tipo === 'figura' && (
          <div className="lousa-figura"><Diagrama nome={cena.nome as NomeDiagrama} rotulos={cena.rotulos} /></div>
        )}
        {cena.tipo === 'prova' && (
          <Prova cena={cena} marcada={marcada} onEscolher={(k) => setRespostas((r) => ({ ...r, [i]: k }))} />
        )}
      </div>

      <div className="lousa-fala">
        <Professor falando={falando} />
        <Balao key={`${i}-${rodada}-${marcada ?? 'x'}`} falas={falas} />
      </div>

      <div className="lousa-ctrl">
        <button type="button" className="lousa-btn lado" hidden={i === 0} onClick={() => vai(i - 1)} aria-label="Voltar">←</button>
        <button type="button" className="lousa-btn lado" hidden={cena.tipo === 'prova'} onClick={() => setRodada((r) => r + 1)} aria-label="Ver de novo">↻</button>
        <button type="button" className="lousa-btn lado" hidden={cena.tipo === 'prova' || pronto} onClick={() => setPronto(true)} aria-label="Mostrar tudo de uma vez">⏭</button>
        {ultima && onFechar ? (
          <button type="button" className="lousa-btn" onClick={onFechar}>Voltar à questão</button>
        ) : (
          <button type="button" className="lousa-btn" onClick={proximo}>{i === 0 ? 'Começar' : ultima ? 'De novo' : 'Próximo'}</button>
        )}
      </div>
    </div>
  );
}
