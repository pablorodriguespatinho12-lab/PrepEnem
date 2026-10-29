export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';
import { lerPedidoAjuda, promptAjuda, validarAjuda } from '@/lib/redacao/ajuda';

// Ajuda enquanto escreve, no Treino por partes: onde ele está, a próxima
// ação e começos de frase. Nada é gravado: o rascunho fica no navegador.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const pedido = lerPedidoAjuda(await req.json().catch(() => null));
  if (!pedido) return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 });

  const r = await pedirJson(promptAjuda(pedido), (bruto) => validarAjuda(bruto, pedido), {
    maxTokens: 1500,
    temperature: 0.6,
    modelo: MODELO_IA.ajudaRedacao(),
    pensar: 'low',
  });
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json(r.dado);
}
