/* Cabeçalhos de segurança fixos (12/11/2026, skill seguranca-site-nextjs).
   A Content-Security-Policy tem nonce por requisição, então mora no
   middleware.ts; aqui ficam os que não mudam. */
const CABECALHOS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // site de uso pessoal: fora do Google
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: CABECALHOS }];
  },
};
