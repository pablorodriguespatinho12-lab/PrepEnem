import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

/* Simulado e Caderno de Erros moram dentro do Treino (02/11/2026): o
   iniciante precisa do caminho de volta à tela onde escolheu. */
export function VoltarAoTreino() {
  return (
    <Link
      href="/provas"
      className="inline-flex items-center gap-1 mb-4 py-1 type-meta text-muted-foreground hover:text-foreground t-colors"
    >
      <ChevronLeft className="w-4 h-4" aria-hidden /> Treino
    </Link>
  );
}
