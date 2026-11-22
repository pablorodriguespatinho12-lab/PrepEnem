import type { CSSProperties } from 'react';
import { LARGURA } from '@/lib/aula-lousa/tipos';
import { partirEmFracoes } from '@/lib/aula-lousa/fracoes';

const TAM_PADRAO = 24;
const ALTURA_EM_TAMANHOS = 2.8; // cabe cima + traço + baixo
const SUBIDA_DO_CENTRO = 0.3; // o traço da fração fica na altura do meio das letras, acima da linha de base

interface Props {
  x: number;
  y: number;
  s: string;
  cor: string;
  tam?: number;
  ancora?: 'start' | 'middle' | 'end';
  estilo: CSSProperties;
}

/** Texto da lousa com as frações desenhadas em pé (cima, traço, baixo). Mesmo lugar e mesma entrada do `<text>`. */
export function TextoComFracoes({ x, y, s, cor, tam = TAM_PADRAO, ancora = 'middle', estilo }: Props) {
  const alt = tam * ALTURA_EM_TAMANHOS;
  const largura = ancora === 'start' ? LARGURA - x : ancora === 'end' ? x : 2 * Math.min(x, LARGURA - x);
  const esquerda = ancora === 'start' ? x : ancora === 'end' ? 0 : x - largura / 2;
  const alinha = ancora === 'start' ? 'flex-start' : ancora === 'end' ? 'flex-end' : 'center';
  return (
    <foreignObject className="tx fo-tx" x={esquerda} y={y - tam * SUBIDA_DO_CENTRO - alt / 2} width={Math.max(largura, tam)} height={alt} style={estilo}>
      <div className="fo-linha" style={{ color: cor, fontSize: tam, justifyContent: alinha }}>
        {partirEmFracoes(s).map((p, k) =>
          typeof p === 'string' ? (
            <span key={k}>{p}</span>
          ) : (
            <span key={k} className="frac">
              <span>{p.cima}</span>
              <i />
              <span>{p.baixo}</span>
            </span>
          ),
        )}
      </div>
    </foreignObject>
  );
}
