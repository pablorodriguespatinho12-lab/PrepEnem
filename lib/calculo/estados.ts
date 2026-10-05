// Leitura e escrita do progresso no banco, convertendo para EstadoDegrau.

import { prisma } from '@/lib/db';
import type { EstadoDegrau } from './progresso';

export async function lerEstados(userId: string): Promise<Map<string, EstadoDegrau>> {
  const linhas = await prisma.calculoProgresso.findMany({ where: { userId } });
  return new Map(linhas.map((l) => [l.licaoId, {
    licaoId: l.licaoId,
    status: l.status === 'concluida' ? 'concluida' : 'em_andamento',
    acertos: l.acertos,
    tentativas: l.tentativas,
    revisoes: l.revisoes,
    proximaRevisao: l.proximaRevisao,
  }]));
}

export async function salvarEstado(userId: string, e: EstadoDegrau): Promise<void> {
  const dados = {
    status: e.status, acertos: e.acertos, tentativas: e.tentativas, revisoes: e.revisoes, proximaRevisao: e.proximaRevisao,
  };
  await prisma.calculoProgresso.upsert({
    where: { userId_licaoId: { userId, licaoId: e.licaoId } },
    create: { userId, licaoId: e.licaoId, ...dados },
    update: dados,
  });
}
