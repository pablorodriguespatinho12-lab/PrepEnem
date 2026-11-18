'use client';
/* Mapa de exploração da aba Descobrir. Lugar visitado acende (guardado só neste
   navegador). Na tela estreita, vira a lista na ordem da escadinha. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CAMINHOS, LUGARES, ORDEM_DAS_AULAS } from '@/data/descobrir/mapa';
import { useVisitadas } from './visitadas';

const LARGURA = 158;
const ALTURA = 44;

export function MapaDescobrir({ atual }: { atual?: string }) {
  const router = useRouter();
  const visitadas = useVisitadas();
  const lugar = (id: string) => LUGARES.find((l) => l.id === id)!;
  return (
    <svg className="dsc-mapa" viewBox="0 0 640 300" role="group" aria-label="Mapa das aulas: o plano cartesiano no meio e as aulas em volta">
      {CAMINHOS.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={lugar(a).x} y1={lugar(a).y} x2={lugar(b).x} y2={lugar(b).y}
          stroke="var(--dsc-grade)" strokeWidth={4} strokeDasharray="8 6" />
      ))}
      {LUGARES.map((l) => {
        const centro = l.id === 'plano';
        const aceso = centro || l.id === atual || visitadas.includes(l.id);
        const caixa = (
          <g>
            <rect x={l.x - LARGURA / 2} y={l.y - ALTURA / 2} width={LARGURA} height={ALTURA}
              fill={aceso ? 'var(--dsc-teal)' : 'hsl(var(--surface-1))'} stroke="var(--dsc-teal)" strokeWidth={l.id === atual ? 5 : 3} />
            <text x={l.x} y={l.formula ? l.y - 3 : l.y + 5} textAnchor="middle" style={aceso ? { fill: 'hsl(var(--primary-foreground))' } : undefined}>
              {centro ? l.nome : `${l.ordem}. ${l.nome}`}
            </text>
            {l.formula && (
              <text x={l.x} y={l.y + 14} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, ...(aceso ? { fill: 'hsl(var(--primary-foreground))' } : {}) }}>{l.formula}</text>
            )}
          </g>
        );
        if (centro) return <g key={l.id}>{caixa}</g>;
        return (
          <a key={l.id} href={`/descobrir/${l.id}`} aria-label={`Aula ${l.ordem}: ${l.nome}`}
            onClick={(e) => { e.preventDefault(); router.push(`/descobrir/${l.id}`); }}>
            {caixa}
          </a>
        );
      })}
    </svg>
  );
}

/** No celular: a mesma escadinha em lista. */
export function ListaDescobrir() {
  const visitadas = useVisitadas();
  return (
    <ol className="flex flex-col gap-3">
      {ORDEM_DAS_AULAS.map((id) => {
        const l = LUGARES.find((x) => x.id === id)!;
        return (
          <li key={id}>
            <Link href={`/descobrir/${id}`} className="px-chip flex w-full items-center justify-between gap-3" aria-pressed={visitadas.includes(id)}>
              <span>{l.ordem}. {l.nome}</span>
              <span className="font-sans text-sm font-semibold opacity-80">{l.formula}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
