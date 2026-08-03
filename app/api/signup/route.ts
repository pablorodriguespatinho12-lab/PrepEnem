export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

// Cadastro público desabilitado: o site é de uso pessoal (ver ALLOWED_USERS
// em lib/auth.ts). Reabrir cadastro exige reverter este arquivo no código,
// não é um toggle de ambiente — decisão deliberada, diferente do login.
export async function POST() {
  return NextResponse.json({ error: 'Cadastro desabilitado' }, { status: 403 });
}
