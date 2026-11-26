'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { CaminhosDoTreino } from '@/components/treino/caminhos-do-treino';
import { CapaPixel } from '@/components/visual/capa-pixel';
import { agruparProvas, degrauDaProva, TITULO_OUTRAS } from '@/lib/provas-grupos';
import { estadoDaProva, provaParaContinuar, type ProvaDoQuadro } from '@/lib/provas-estado';

/* Página Estudar, opção A de 26/11/2026: capa com o Continuar, ações, uma aba por
   matéria e uma linha por prova. */
const JA_NO_TOPO = ['/simulado', '/caderno-erros'];

function Linha({ prova, numero, destaque, apagando, onExcluir }: { prova: ProvaDoQuadro; numero: number; destaque: boolean; apagando: boolean; onExcluir: (id: string) => void }) {
  const escada = prova.nivel === 'escada' ? degrauDaProva(prova.nome) : null;
  const estado = estadoDaProva(prova);
  const aberta = prova.status === 'em_andamento';
  return (
    <li className="m-item-lista">
      <Link href={`/provas/${prova.id}`} className="m-linha" data-aberta={destaque ? 'sim' : undefined}>
        <span className="m-n" data-numeric>{escada?.posicao ?? numero}</span>
        <span className="m-t">
          <b>{escada ? escada.degrau.tema : prova.nome}</b>
          <span data-numeric>{estado.texto}</span>
          {escada?.degrau.precisaAntes && <span>Antes: {escada.degrau.precisaAntes}</span>}
        </span>
        <span className="m-sec">{aberta ? 'Continuar' : 'Abrir'}</span>
      </Link>
      {apagando && (
        <button type="button" className="m-sec" onClick={() => onExcluir(prova.id)} aria-label={`Excluir prova ${prova.nome}`}>
          <Trash2 className="w-4 h-4" aria-hidden />
        </button>
      )}
    </li>
  );
}

export function QuadroDeProvas({ provas, onExcluir }: { provas: ProvaDoQuadro[]; onExcluir: (id: string) => void }) {
  const [maisJeitos, setMaisJeitos] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const grupos = agruparProvas(provas);
  const continuar = provaParaContinuar(provas);
  // Sem escolha: a aba da prova aberta, senão a primeira matéria.
  const grupo =
    grupos.find((g) => g.titulo === escolhida) ??
    grupos.find((g) => g.lista.some((p) => p.id === continuar?.id)) ??
    grupos[0];

  return (
    <>
      {continuar ? (
        <CapaPixel
          id="estudar-titulo"
          sobre="Continuar de onde parou"
          titulo={`${degrauDaProva(continuar.nome)?.degrau.tema ?? continuar.nome} · ${estadoDaProva(continuar).texto}`}
        >
          <Link href={`/provas/${continuar.id}`} className="m-vai">Continuar</Link>
        </CapaPixel>
      ) : (
        <CapaPixel id="estudar-titulo" sobre="Estudar" titulo="Escolha uma prova">
          <Link href="/provas/criar" className="m-vai">Nova prova</Link>
        </CapaPixel>
      )}

      <div className="m-acoes">
        <Link href="/provas/criar" className="m-sec">+ Nova prova</Link>
        <Link href="/simulado" className="m-sec">Rápida ou simulado</Link>
        <Link href="/caderno-erros" className="m-sec">Refazer erros</Link>
        <button type="button" className="m-sec" aria-expanded={maisJeitos} onClick={() => setMaisJeitos((v) => !v)}>
          Mais jeitos
        </button>
      </div>

      {maisJeitos && <CaminhosDoTreino soSecundarios fora={JA_NO_TOPO} />}

      {grupo && (
        <>
          <div className="m-abas" role="group" aria-label="Matéria">
            {grupos.map((g) => (
              <button key={g.titulo} type="button" aria-pressed={g.titulo === grupo.titulo} onClick={() => setEscolhida(g.titulo)}>
                {g.titulo === TITULO_OUTRAS ? `Outras (${g.lista.length})` : g.titulo}
              </button>
            ))}
          </div>
          <ul className="m-lista">
            {grupo.lista.map((p, i) => (
              <Linha key={p.id} prova={p} numero={i + 1} destaque={p.id === continuar?.id} apagando={apagando} onExcluir={onExcluir} />
            ))}
          </ul>
          <div>
            <button type="button" className="m-sec" aria-pressed={apagando} onClick={() => setApagando((v) => !v)}>
              {apagando ? 'Parar de apagar' : 'Apagar provas'}
            </button>
          </div>
        </>
      )}
    </>
  );
}
