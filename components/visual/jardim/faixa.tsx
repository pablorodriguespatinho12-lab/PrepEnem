import { ArteJardim } from '@/components/visual/jardim/desenhos';
import type { NomeDaArte } from '@/lib/jardim/artes';

/* Faixa do modo Jardim: texto à esquerda, desenho à direita (em cima no celular).
   Nos outros temas some (classe so-jardim). */
export function FaixaJardim({ arte, sobre, titulo, nota }: { arte: NomeDaArte; sobre: string; titulo: string; nota?: string }) {
  return (
    <section className="so-jardim jv-banner">
      <div>
        <span className="type-meta text-muted-foreground">{sobre}</span>
        <h1 className="font-display font-semibold">{titulo}</h1>
        {nota && <span data-numeric className="type-meta text-muted-foreground">{nota}</span>}
      </div>
      <ArteJardim nome={arte} />
    </section>
  );
}
