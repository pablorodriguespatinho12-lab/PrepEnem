export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, themeColor: true, role: true, streakDays: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const body = await request.json();
    const { name, themeColor } = body ?? {};
    const data: any = {};
    if (name) data.name = name;
    if (themeColor) data.themeColor = themeColor;
    const user = await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json({ name: user.name, themeColor: user.themeColor });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
