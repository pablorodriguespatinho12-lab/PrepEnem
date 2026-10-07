// Onde a lição vem: escrita à mão, salva no banco, ou gerada agora e salva.

import { prisma } from '@/lib/db';
import { pedirJson, type ResultadoIA } from '@/lib/pedir-json';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import { TRILHA, buscarDegrau } from '@/data/calculo/trilha';
import { promptLicao } from './prompts';
import { validarLicao } from './validar';
import type { ConteudoLicao, LicaoCompleta } from './tipos';
import { concorda, resolverIndependente, type QuestaoParaVerificar } from '@/lib/verificar-respostas';
import { MODELO_IA } from '@/lib/ia-modelos';

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

  // Geração por IA desligada por padrão (teste de 05/10/2026: contas certas,
  // explicação sem sentido). Lição sem versão escrita fica "em preparação".
  // CALCULO_LICAO_IA=1 religa, com validação e resolução independente.
  if (process.env.CALCULO_LICAO_IA !== '1') {
    return { ok: false, erro: 'Esta lição ainda está sendo escrita. As anteriores já estão prontas.', status: 404 };
  }
  const r = await pedirJson(
    promptLicao(degrau, anteriores(id).map((x) => buscarDegrau(x)!), LICOES_ESCRITAS.p3),
    (bruto) => {
      const motivos: string[] = [];
      const licao = validarLicao(bruto, motivos);
      if (!licao) console.error(`Lição ${id} recusada:`, motivos.join('; '));
      return licao;
    },
    { maxTokens: 5500, temperature: 0.3, modelo: MODELO_IA.licao(), pensar: 'low', timeoutMs: 55_000 },
  );
  if (!r.ok) return r;
  const conferida = await conferirComOutroModelo(id, r.dado);
  if (!conferida) return { ok: false, erro: 'Não deu para confirmar as respostas desta lição. Tente de novo em um minuto.', status: 502 };
  await prisma.calculoLicaoGerada.upsert({
    where: { licaoId: id },
    create: { licaoId: id, conteudo: conferida as object, modelo: MODELO_IA.licao() },
    update: { conteudo: conferida as object },
  });
  return { ok: true, dado: { ...degrau, conteudo: conferida, origem: 'ia' } };
}
const MIN_EXERCICIOS = 3;
/* Outro modelo resolve exercícios e lacunas do zero (lib/verificar-respostas.ts).
   Exercício em que discordam sai; lacuna em que discordam vira passo
   resolvido. Menos de 3 exercícios confirmados: a lição não é salva. */
async function conferirComOutroModelo(id: string, l: ConteudoLicao): Promise<ConteudoLicao | null> {
  const lacunas = l.exemplos.flatMap((e, ie) => e.passos.flatMap((p, ip) => (p.lacuna ? [{ ie, ip, p, e }] : [])));
  const questoes: QuestaoParaVerificar[] = [
    ...l.exercicios.map((x) => ({ enunciado: x.enunciado, opcoes: x.resposta.tipo === 'escolha' ? x.resposta.opcoes : undefined })),
    ...lacunas.map(({ e, ip, p }) => ({
      enunciado: `${e.enunciado}\nPassos já feitos: ${e.passos.slice(0, ip).map((q) => q.texto).join(' ')}\n${p.lacuna!.pergunta}`,
      opcoes: p.lacuna!.resposta.tipo === 'escolha' ? p.lacuna!.resposta.opcoes : undefined,
    })),
  ];
  const v = await resolverIndependente(questoes);
  if (!v) {
    console.error(`Lição ${id}: verificação independente falhou`);
    return null;
  }
  const exercicios = l.exercicios.filter((x, i) => x.resposta.tipo !== 'desenho' && concorda(x.resposta, v[i]));
  // Desenho não tem como ser resolvido por outro modelo: sai.
  const lacunaOk = new Set(lacunas.filter(({ p }, i) => p.lacuna!.resposta.tipo !== 'desenho' && concorda(p.lacuna!.resposta, v[l.exercicios.length + i])).map(({ ie, ip }) => `${ie}:${ip}`));
  const exemplos = l.exemplos.map((e, ie) => ({
    ...e,
    passos: e.passos.map((p, ip) => (p.lacuna && !lacunaOk.has(`${ie}:${ip}`) ? { texto: p.texto, porque: p.porque } : p)),
  }));
  console.log(`Lição ${id}: ${exercicios.length}/${l.exercicios.length} exercícios e ${lacunaOk.size}/${lacunas.length} lacunas confirmados`);
  return exercicios.length >= MIN_EXERCICIOS ? { ...l, exercicios, exemplos } : null;
}
