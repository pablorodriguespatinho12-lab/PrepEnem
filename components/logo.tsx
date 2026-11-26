/* Logo (26/11/2026): livro aberto com um broto saindo do meio, na cor do tema.
   O mesmo desenho está em public/favicon.svg. */
export function Logo({ tamanho = 46 }: { tamanho?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={tamanho} height={tamanho} aria-hidden="true">
      <rect width="48" height="48" rx="15" fill="hsl(var(--destaque))" />
      <g fill="hsl(var(--destaque-tinta))">
        <path d="M9 27c5.5-1.8 10.500-1 14 2v10c-3.500-2.600-8.500-3.300-14-1.800z" />
        <path d="M39 27c-5.5-1.8-10.500-1-14 2v10c3.500-2.600 8.500-3.300 14-1.800z" />
        <path d="M23 28V18h2v10z" />
        <path d="M23.500 20c-6.500.6-10-2.800-10.500-9 6.500-.4 10.300 2.800 10.500 9z" />
        <path d="M24.500 17c.2-6.200 4-9.400 10.500-9-.5 6.200-4 9.600-10.500 9z" />
      </g>
    </svg>
  );
}
