'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { CaminhosDoTreino } from '@/components/treino/caminhos-do-treino';
import { agruparProvas, degrauDaProva, TITULO_OUTRAS } from '@/lib/provas-grupos';
import { estadoDaProva, provaParaContinuar, type ProvaDoQuadro } from '@/lib/provas-estado';

/* Página Estudar, opção B do quadro de 26/11/2026 ("gostei mais do b"): a trilha
   inteira numa tela, uma coluna por matéria. Antes eram 50 cartões grandes (7,7
   telas no PC, 17 no celular). */
const BOTAO =
  'inline-flex items-center justify-center min-h-12 px-4 rounded-[var(--radius-control)] type-meta font-semibold t-colors';
const BOTAO_NEUTRO = `${BOTAO} surface-1 text-foreground hover:bg-muted`;
const BOTAO_FORTE = `${BOTAO} bg-primary text-primary-foreground shadow-elev-2`;

function Lixeira({ nome, onClick }: { nome: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Excluir prova ${nome}`}
      className="shrink-0 w-9 grid place-items-center rounded-[var(--radius-control)] surface-1 text-muted-foreground hover:text-foreground t-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function Cartao({ prova, apagando, onExcluir }: { prova: ProvaDoQuadro; apagando: boolean; onExcluir: (id: string) => void }) {
  const escada = prova.nivel === 'escada' ? degrauDaProva(prova.nome) : null;
  const titulo = escada ? escada.degrau.tema : prova.nome;
  const estado = estadoDaProva(prova);
  return (
    <li className="flex gap-1.5">
      <Link
        href={`/provas/${prova.id}`}
        className={`flex-1 min-w-0 flex gap-2.5 min-h-[4.5rem] p-2.5 rounded-[var(--radius-control)] surface-1 t-lift hover:-translate-y-px hover:shadow-elev-2 ${
          prova.status === 'em_andamento' ? 'ring-2 ring-primary' : ''
        }`}
      >
        {escada && <span data-numeric className="font-display type-lead text-primary-text">{escada.posicao}</span>}
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="type-meta font-semibold text-foreground break-words">{titulo}</span>
          {escada?.degrau.precisaAntes && (
            <span className="text-xs text-muted-foreground">Antes: {escada.degrau.precisaAntes}</span>
          )}
          <span data-numeric className="text-xs text-muted-foreground">{estado.texto}</span>
          {estado.progresso !== null && (
            <span className="block h-1 bg-muted" role="presentation">
              <span className="block h-full bg-primary origin-left" style={{ transform: `scaleX(${estado.progresso})` }} />
            </span>
          )}
        </span>
      </Link>
      {apagando && <Lixeira nome={prova.nome} onClick={() => onExcluir(prova.id)} />}
    </li>
  );
}

export function QuadroDeProvas({ provas, onExcluir }: { provas: ProvaDoQuadro[]; onExcluir: (id: string) => void }) {
  const [maisJeitos, setMaisJeitos] = useState(false);
  const [verOutras, setVerOutras] = useState(false);
  const [apagando, setApagando] = useState(false);
  const grupos = agruparProvas(provas);
  const colunas = grupos.filter((g) => g.titulo !== TITULO_OUTRAS);
  const outras = grupos.find((g) => g.titulo === TITULO_OUTRAS)?.lista ?? [];
  const continuar = provaParaContinuar(provas);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="mr-auto font-display type-display font-semibold text-foreground">Estudar</h1>
        {continuar && (
          <Link href={`/provas/${continuar.id}`} className={BOTAO_FORTE}>
            Continuar {degrauDaProva(continuar.nome)?.degrau.tema ?? continuar.nome} · {estadoDaProva(continuar).texto}
          </Link>
        )}
        <Link href="/provas/criar" className={`${continuar ? BOTAO_NEUTRO : BOTAO_FORTE}`}>+ Nova prova</Link>
        <button type="button" aria-expanded={maisJeitos} onClick={() => setMaisJeitos((v) => !v)} className={BOTAO_NEUTRO}>
          <span className="type-meta font-semibold">Mais jeitos</span>
        </button>
      </div>

      {maisJeitos && <CaminhosDoTreino soSecundarios />}

      <div className="grid gap-x-3.5 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {colunas.map(({ titulo, lista }) => (
          <section key={titulo}>
            <h2 className="font-display type-title font-semibold text-foreground pb-1.5 mb-2.5 border-b-4 border-primary">{titulo}</h2>
            <ul className="space-y-2">
              {lista.map((p) => <Cartao key={p.id} prova={p} apagando={apagando} onExcluir={onExcluir} />)}
            </ul>
          </section>
        ))}
      </div>

      {provas.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-8">
          {outras.length > 0 && (
            <button type="button" aria-expanded={verOutras} onClick={() => setVerOutras((v) => !v)} className={BOTAO_NEUTRO}>
              {TITULO_OUTRAS} ({outras.length})
            </button>
          )}
          <button type="button" aria-pressed={apagando} onClick={() => setApagando((v) => !v)} className={BOTAO_NEUTRO}>
            {apagando ? 'Parar de apagar' : 'Apagar provas'}
          </button>
        </div>
      )}

      {verOutras && (
        <ul className="grid gap-2 mt-4 sm:grid-cols-2 xl:grid-cols-4">
          {outras.map((p) => <Cartao key={p.id} prova={p} apagando={apagando} onExcluir={onExcluir} />)}
        </ul>
      )}
    </>
  );
}
