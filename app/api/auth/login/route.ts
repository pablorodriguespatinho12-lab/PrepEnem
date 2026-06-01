export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    return NextResponse.json({ id: user.id, username: user.username, name: user.name });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
