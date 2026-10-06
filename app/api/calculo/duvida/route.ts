export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buscarDegrau } from '@/data/calculo/trilha';
import { LICOES_ESCRITAS } from '@/data/calculo/licoes';
import { promptDuvidaLicao } from '@/lib/tutor/prompts';
import { validarRespostaTutor } from '@/lib/tutor/validar';
import { lerHistorico } from '@/lib/tutor/entrada';
import { pedirJson } from '@/lib/pedir-json';
import { MODELO_IA } from '@/lib/ia-modelos';

const MAX_NA_TELA = 1500;

// Dúvida no meio de uma lição de Cálculo. A lição (título, objetivo, resumo)
// vem do servidor; do navegador só vem o trecho na tela e a conversa, que não
// é salva no banco.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.licaoId === 'string' ? body.licaoId : '';
  const degrau = buscarDegrau(id);
  const licao = LICOES_ESCRITAS[id];
  const historico = lerHistorico(body?.historico);
  const naTela = typeof body?.naTela === 'string' ? body.naTela.slice(0, MAX_NA_TELA) : '';
  if (!degrau || !licao || historico.length === 0 || historico[historico.length - 1].papel !== 'aluno') {
    return NextResponse.json({ error: 'Pergunta inválida' }, { status: 400 });
  }

  const r = await pedirJson(
    promptDuvidaLicao({ titulo: degrau.titulo, objetivo: degrau.objetivo, resumo: licao.resumo, naTela }, historico),
    validarRespostaTutor,
    { maxTokens: 1600, temperature: 0.4, modelo: MODELO_IA.duvidaLicao(), pensar: 'medium' },
  );
  if (!r.ok) return NextResponse.json({ error: r.erro }, { status: r.status });
  return NextResponse.json(r.dado);
}
