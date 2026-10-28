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
    <div className="px-4 pt-4 md:px-8 md:pt-8 max-w-6xl mx-auto">
      <Link href="/redacao" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-2">
        <ChevronLeft className="w-4 h-4" aria-hidden /> Redação
      </Link>
      {/* O título fica na mesma linha da barra de passos (TreinoReceita): o
          passo 4 precisa da altura toda da tela. */}
      <TreinoReceita />
    </div>
  );
}
