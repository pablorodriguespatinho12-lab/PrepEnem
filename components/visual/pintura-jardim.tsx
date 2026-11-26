/* Pintura da capa no modo Jardim: casa no alto do morro, de frente para a água
   (o Pablo preferiu a pousada creme e a paisagem do Epic, 26/11/2026).
   Só aparece com html[data-jardim] (app/jardim.css). Parada. */
const PINHEIROS = [[96, 214, 1], [128, 228, .8], [262, 196, 1.15], [292, 214, .85], [316, 232, .7]] as const;

export function PinturaJardim() {
  return (
    <svg className="m-pintura" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="j-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc3bd" />
          <stop offset="1" stopColor="#eef0d6" />
        </linearGradient>
        <linearGradient id="j-agua" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fbcae" />
          <stop offset="1" stopColor="#3f7568" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" fill="url(#j-ceu)" />
      <circle cx="455" cy="95" r="38" fill="#fbf3cf" />
      <path d="M300 92c30-18 52-6 66 2 22-8 40 0 48 12H292c0-6 2-10 8-14z" fill="#fff" opacity=".55" />
      <path d="M210 262c60-62 118-74 176-40 58-52 140-60 214-18v76H210z" fill="#a5c6a0" />
      <path d="M0 252h600v168H0z" fill="url(#j-agua)" />
      <g stroke="#e4f1e4" strokeWidth="3" strokeLinecap="round" opacity=".6">
        <path d="M418 290h74M446 306h40M382 338h56M498 356h62M340 392h44" />
      </g>
      <path d="M0 214c70-48 150-62 232-30 62 24 92 70 130 120l34 116H0z" fill="#6d9a5f" />
      <path d="M0 290c82-30 170-18 232 24 44 30 70 66 82 106H0z" fill="#487a49" />
      <path d="M0 362c70-22 140-8 196 58H0z" fill="#2f5b3a" />
      <g>
        <path d="M158 150h62v42h-62z" fill="#f4ead2" />
        <path d="M150 152l39-28 39 28z" fill="#c0674a" />
        <path d="M222 164h30v28h-30z" fill="#e9dcc0" />
        <path d="M216 166l21-17 21 17z" fill="#a8563d" />
        <path d="M182 172h14v20h-14z" fill="#8a5a3c" />
        <path d="M165 162h10v11h-10zM203 162h10v11h-10zM232 172h9v9h-9z" fill="#5d7f78" />
      </g>
      {PINHEIROS.map(([x, y, e]) => (
        <path key={x} transform={`translate(${x} ${y}) scale(${e})`} d="M0-56c9 18 14 34 14 46 0 9-6 12-11 12v10h-6V2c-5 0-11-3-11-12 0-12 5-28 14-46z" fill="#2f5b3a" />
      ))}
      <path d="M190 192c-6 30 30 44 14 74s6 48 40 70" fill="none" stroke="#e7d9ae" strokeWidth="7" strokeLinecap="round" opacity=".75" />
    </svg>
  );
}
