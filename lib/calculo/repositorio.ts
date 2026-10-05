// Onde a lição vem: escrita à mão, salva no banco, ou gerada agora e salva.

import { prisma } from '@/lib/db';
import { pedirJson, type ResultadoIA } from '@/lib/pedir-json';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import { TRILHA, buscarDegrau } from '@/data/calculo/trilha';
import { promptLicao } from './prompts';
import { validarLicao } from './validar';
import type { LicaoCompleta } from './tipos';

/* Pré-requisitos diretos e indiretos, na ordem da trilha. */
function anteriores(id: string): string[] {
  const vistos = new Set<string>();
  const visitar = (atual: string) => {
    for (const p of buscarDegrau(atual)?.prerequisitos ?? []) {
      if (!vistos.has(p)) { vistos.add(p); visitar(p); }
    }
  };
  visitar(id);
  return TRILHA.filter((d) => vistos.has(d.id)).map((d) => d.id);
}

export async function obterLicao(id: string): Promise<ResultadoIA<LicaoCompleta>> {
  const degrau = buscarDegrau(id);
  if (!degrau) return { ok: false, erro: 'Lição não encontrada.', status: 404 };

  const escrita = LICOES_ESCRITAS[id];
  if (escrita) return { ok: true, dado: { ...degrau, conteudo: escrita, origem: 'escrita' } };

  const salva = await prisma.calculoLicaoGerada.findUnique({ where: { licaoId: id } });
  const salvaValida = salva ? validarLicao(salva.conteudo) : null;
  if (salvaValida) return { ok: true, dado: { ...degrau, conteudo: salvaValida, origem: 'ia' } };

  const r = await pedirJson(
    promptLicao(degrau, anteriores(id).map((x) => buscarDegrau(x)!), LICOES_ESCRITAS.p3),
    validarLicao,
    { maxTokens: 8000, temperature: 0.3 },
  );
  if (!r.ok) return r;
  await prisma.calculoLicaoGerada.upsert({
    where: { licaoId: id },
    create: { licaoId: id, conteudo: r.dado as object, modelo: process.env.AI_MODEL_TUTOR || process.env.AI_MODEL || null },
    update: { conteudo: r.dado as object },
  });
  return { ok: true, dado: { ...degrau, conteudo: r.dado, origem: 'ia' } };
}
