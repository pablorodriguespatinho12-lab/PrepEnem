'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { LicaoPlayer } from '@/components/calculo/licao-player';
import { NOME_MODULO, buscarDegrau } from '@/data/calculo/trilha';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import type { LicaoCompleta } from '@/lib/calculo/tipos';
/* Lição escrita à mão já está no bundle: abre na hora, sem esperar a rota
   (pedido do Pablo, 06/10/2026: "a tela de carregamento demora"). A rota
   continua sendo chamada e, se disser que o degrau está bloqueado, vale ela. */
function licaoEscrita(id: string): LicaoCompleta | null {
  const degrau = buscarDegrau(id);
  const conteudo = LICOES_ESCRITAS[id];
  return degrau && conteudo ? { ...degrau, conteudo, origem: 'escrita' } : null;
}

export default function LicaoCalculoPage({ params }: { params: { id: string } }) {
  const [licao, setLicao] = useState<LicaoCompleta | null>(() => licaoEscrita(params.id));
  const [erro, setErro] = useState<string | null>(null);

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
    <div className="p-4 md:p-8 max-w-[46rem] mx-auto space-y-4">
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
          <LicaoPlayer licao={licao} />
        </>
      )}
    </div>
  );
}
