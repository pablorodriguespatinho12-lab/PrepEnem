import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/* Segurança de toda página (12/11/2026, skill seguranca-site-nextjs):
   1. Sem login, a página nem abre: vai para /login (antes o esqueleto da tela
      abria e só os dados pediam login).
   2. Content-Security-Policy com nonce por requisição: só roda script que o
      próprio site mandou. Script injetado (XSS) é bloqueado pelo navegador.
   As APIs conferem a sessão nelas mesmas (getServerSession); o middleware não
   passa por /api, arquivos estáticos nem /revisao (páginas prontas de estudo). */

const PUBLICAS = ['/login', '/signup'];

function politica(nonce: string): string {
  const dev = process.env.NODE_ENV !== 'production';
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    // framer-motion e o mundo pixel escrevem estilo inline
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const publica = PUBLICAS.includes(pathname);

  if (!publica) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }).catch(() => null);
    if (!token) {
      const login = new URL('/login', req.url);
      // volta para onde ia depois de entrar (só caminho interno)
      if (pathname !== '/' && pathname.startsWith('/') && !pathname.startsWith('//')) {
        login.searchParams.set('callbackUrl', pathname + search);
      }
      return NextResponse.redirect(login);
    }
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = politica(nonce);
  const cabecalhos = new Headers(req.headers);
  cabecalhos.set('x-nonce', nonce);
  cabecalhos.set('Content-Security-Policy', csp);
  const res = NextResponse.next({ request: { headers: cabecalhos } });
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|revisao|fonts|favicon|.*\\.[a-zA-Z0-9]+$).*)',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
  ],
};
