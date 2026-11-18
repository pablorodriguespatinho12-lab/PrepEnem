/* Peças das aulas da aba Descobrir: equação que se transforma (uma linha nasce da de
   cima, com a operação ao lado), tabela e cores por letra. Movimento só em CSS
   (descobrir.css); --dur e --atraso vão no style de cada peça. */
import type { CSSProperties, ReactNode } from 'react';

type Filhos = { children: ReactNode };

export const tempo = (dur: number, atraso = 0) => ({ '--dur': `${dur}s`, '--atraso': `${atraso}s` }) as CSSProperties;

export const Eq = ({ children }: Filhos) => <div className="dsc-eq">{children}</div>;

/** Uma linha da equação. `op` diz o que foi feito dos dois lados para chegar nela. */
export function Linha({ children, op, atraso = 0 }: Filhos & { op?: string; atraso?: number }) {
  return (
    <div className="dsc-linha dsc-a dsc-entra" style={tempo(0.55, atraso)}>
      <span className="dsc-m">{children}</span>
      {op && <span className="dsc-op">{op}</span>}
    </div>
  );
}

export const Fr = ({ cima, baixo }: { cima: ReactNode; baixo: ReactNode }) => (
  <span className="dsc-fr"><span>{cima}</span><span>{baixo}</span></span>
);
export const Az = ({ children }: Filhos) => <span className="dsc-az">{children}</span>;
export const Lj = ({ children }: Filhos) => <span className="dsc-lj">{children}</span>;
export const Vd = ({ children }: Filhos) => <span className="dsc-vd">{children}</span>;
/** Termo que acabou de aparecer: acende em laranja e pisca 2 vezes. */
export const Novo = ({ children }: Filhos) => <span className="dsc-novo">{children}</span>;
/** O que cancela: riscado. */
export const Corta = ({ children }: Filhos) => <span className="dsc-corta">{children}</span>;
export const Caixa = ({ children }: Filhos) => <span className="dsc-caixa">{children}</span>;
export const Raiz = ({ children }: Filhos) => <span>√<span className="dsc-raiz">{children}</span></span>;

/** Tabela de números; as linhas entram uma a uma (ritmo em segundos). */
export function Tabela({ cabecalho, linhas, acende = [], ritmo = 0.25 }: {
  cabecalho: string[]; linhas: ReactNode[][]; acende?: [number, number][]; ritmo?: number;
}) {
  const aceso = (l: number, c: number) => acende.some(([a, b]) => a === l && b === c);
  return (
    <table>
      <thead><tr>{cabecalho.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {linhas.map((linha, l) => (
          <tr key={l} className="dsc-a dsc-entra" style={tempo(0.5, l * ritmo)}>
            {linha.map((cel, c) => <td key={c} className={aceso(l, c) ? 'dsc-acende' : ''}>{cel}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Tabela de 2 colunas "o que é / aqui" da tela de cada letra. */
export function Definicao({ linhas }: { linhas: [ReactNode, ReactNode][] }) {
  return (
    <table>
      <tbody>
        {linhas.map(([rot, valor], i) => (
          <tr key={i}><th>{rot}</th><td className={i === linhas.length - 1 ? 'dsc-acende' : ''}>{valor}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
