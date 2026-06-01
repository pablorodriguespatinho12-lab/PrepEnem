export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, username, password } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Usuário deve ter pelo menos 3 caracteres' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'Nome de usuário já em uso' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, username, password: hashed },
    });

    return NextResponse.json({ id: user.id, username: user.username, name: user.name });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }
}
