'use client';
// Treino por partes = guia da receita de bolso (Pablo, 27/10/2026). Sem IA:
// a tela mostra o molde de cada parte e conta as linhas; a correção é feita
// fora do site. A versão antiga (parte avulsa corrigida pela IA) e as rotas
// /api/redacao/parts/* foram apagadas; a tabela EssayPartPractice fica no
// Neon com o histórico (a página de estatísticas ainda lê dela).

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { TreinoReceita } from '@/components/redacao/receita/treino-receita';

export default function RedacaoPartesPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Link href="/redacao" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-4">
        <ChevronLeft className="w-4 h-4" aria-hidden /> Redação
      </Link>
      <h1 className="font-display type-headline font-bold mb-6">Treino por partes</h1>
      <TreinoReceita />
    </div>
  );
}
