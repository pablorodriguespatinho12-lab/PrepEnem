export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MAX_LINHAS, MAX_TAMANHO, texParaSvg } from '@/lib/caneta/tex-para-svg';
// Contas da caneta (components/visual/caneta.tsx): LaTeX entra, SVG com cada
// letra como traço sai. Linha que o MathJax não lê volta null.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  const corpo = await req.json().catch(() => null);
  const linhas: unknown = corpo?.linhas;
  if (!Array.isArray(linhas) || linhas.length === 0 || linhas.length > MAX_LINHAS
    || !linhas.every((l) => typeof l === 'string' && l.length > 0 && l.length <= MAX_TAMANHO)) {
    return NextResponse.json({ error: `Mande de 1 a ${MAX_LINHAS} linhas de até ${MAX_TAMANHO} caracteres` }, { status: 400 });
  }
  return NextResponse.json({ svgs: (linhas as string[]).map(texParaSvg) });
}
