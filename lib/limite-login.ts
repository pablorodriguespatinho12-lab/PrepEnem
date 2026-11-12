import { createHash } from 'crypto';
import { prisma } from '@/lib/db';

/* Limite contra chute de senha (12/11/2026, skill seguranca-site-nextjs).
   Serverless não tem memória entre chamadas, então conta no banco
   (TentativaLogin). Guarda só o hash do IP. */

export const ERROS_POR_IP = 5;
export const ERROS_NO_TOTAL = 30;
export const JANELA_MS = 15 * 60_000;
const GUARDA_MS = 24 * 60 * 60_000;
export const MSG_BLOQUEIO = 'Muitas tentativas. Espere 15 minutos e tente de novo.';

/** IP de quem pediu, pelo cabeçalho da Vercel. Sem IP, um valor fixo (conta no total). */
export function ipDoPedido(headers: Record<string, string | string[] | undefined> | undefined): string {
  const bruto = headers?.['x-forwarded-for'] ?? headers?.['x-real-ip'] ?? '';
  const valor = Array.isArray(bruto) ? bruto[0] : bruto;
  return valor.split(',')[0].trim() || 'sem-ip';
}

export const hashDoIp = (ip: string): string => createHash('sha256').update(`prepenem:${ip}`).digest('hex');

/** true quando este IP (ou o site todo) passou do limite nos últimos 15 minutos. */
export async function bloqueado(ipHash: string, agora = Date.now()): Promise<boolean> {
  const desde = new Date(agora - JANELA_MS);
  const [doIp, total] = await Promise.all([
    prisma.tentativaLogin.count({ where: { ipHash, criadaEm: { gte: desde } } }),
    prisma.tentativaLogin.count({ where: { criadaEm: { gte: desde } } }),
  ]);
  return doIp >= ERROS_POR_IP || total >= ERROS_NO_TOTAL;
}

/** Anota um erro e aproveita para apagar o que tem mais de 1 dia. */
export async function anotarErro(ipHash: string, agora = Date.now()): Promise<void> {
  await prisma.tentativaLogin.create({ data: { ipHash } });
  await prisma.tentativaLogin.deleteMany({ where: { criadaEm: { lt: new Date(agora - GUARDA_MS) } } });
}

/** Entrou certo: zera os erros deste IP. */
export async function limparErros(ipHash: string): Promise<void> {
  await prisma.tentativaLogin.deleteMany({ where: { ipHash } });
}
