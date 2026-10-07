'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { LicaoPlayer } from '@/components/calculo/licao-player';
import { DuvidaLicao } from '@/components/calculo/duvida-licao';
import { NaoEntendiContext } from '@/components/visual/quadro';
import { NOME_MODULO, buscarDegrau } from '@/data/calculo/trilha';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import type { LicaoCompleta } from '@/lib/calculo/tipos';
/* Lição escrita à mão já está no bundle: abre na hora, sem esperar a rota
   (pedido do Pablo, 06/10/2026: "a tela de carregamento demora"). A rota
   continua sendo chamada para a lição que ainda não está escrita. */
function licaoEscrita(id: string): LicaoCompleta | null {
  const degrau = buscarDegrau(id);
  const conteudo = LICOES_ESCRITAS[id];
  return degrau && conteudo ? { ...degrau, conteudo, origem: 'escrita' } : null;
}

export default function LicaoCalculoPage({ params }: { params: { id: string } }) {
  const [licao, setLicao] = useState<LicaoCompleta | null>(() => licaoEscrita(params.id));
  const [erro, setErro] = useState<string | null>(null);
  const [naTela, setNaTela] = useState('');
  const [pronta, setPronta] = useState<{ id: number; texto: string } | null>(null);
  const naoEntendi = useCallback((texto: string) => setPronta((p) => ({ id: (p?.id ?? 0) + 1, texto })), []);

  useEffect(() => {
    fetch(`/api/calculo/licao/${encodeURIComponent(params.id)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? 'Não deu para abrir a lição.');
        setLicao((atual) => atual ?? data.licao);
      })
      .catch((e: Error) => { setLicao(null); setErro(e.message); });
  }, [params.id]);

  return (
    // Lição e painel de dúvidas lado a lado no computador; no celular, o painel
    // vira um botão embaixo da lição.
    <div className="p-4 md:p-8 max-w-[46rem] lg:max-w-[72rem] mx-auto space-y-4">
      <Link href="/calculo" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
        <ChevronLeft className="w-4 h-4" /> Trilha
      </Link>
      {erro && <p className="type-meta text-[hsl(var(--danger))]">{erro}</p>}
      {!licao && !erro && (
        <div className="flex items-center gap-2 text-muted-foreground" role="status">
          <Loader2 className="w-4 h-4 animate-spin" /> Preparando a lição (a primeira vez de uma lição nova pode levar alguns segundos)...
        </div>
      )}
      {licao && (
        <>
          <header>
            <p className="type-caption text-muted-foreground" data-numeric>{NOME_MODULO[licao.modulo]} · {licao.minutos} min</p>
            <h1 className="font-display type-headline font-bold">{licao.titulo}</h1>
          </header>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)]">
            <NaoEntendiContext.Provider value={naoEntendi}>
              <LicaoPlayer licao={licao} onTela={setNaTela} />
            </NaoEntendiContext.Provider>
            <DuvidaLicao licaoId={licao.id} naTela={naTela} pronta={pronta} />
          </div>
        </>
      )}
    </div>
  );
}
