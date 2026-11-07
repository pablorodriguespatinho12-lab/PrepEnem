// Treino "Planejar com os quartetos" (Pablo, 07/11/2026).
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PlanoQuarteto } from '@/components/redacao/plano-quarteto';

export default function RedacaoPlanoPage() {
  return (
    <div className="px-4 pt-4 pb-10 md:px-8 md:pt-8 max-w-6xl mx-auto">
      <Link href="/redacao" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors mb-2">
        <ChevronLeft className="w-4 h-4" aria-hidden /> Redação
      </Link>
      <PlanoQuarteto />
    </div>
  );
}
