import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { lousaDoRobo } from '../lib/aula-lousa/do-robo';
import { lousaDoAntigo } from '../lib/aula-lousa/do-antigo';
import { comFiguraDoSolido } from '../lib/aula-lousa/solido';
import { validarLousa } from '../lib/aula-lousa/validar';
import { META_DE_CONTA, TOLERANCIA_DA_META, ehTelaDeConta } from '../lib/aula-lousa/quadro-de-conta';
import { letrasPelaInicial, type Troca } from '../lib/aula-lousa/letras';

// Põe a lousa nas aulas que ainda estão só no molde do robô (Pablo, 21/11/2026: "não tá que nem o
// quadro do Universo Narrado"). Não mexe nas que já têm lousa feita à mão.
// Uso:
//   DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts <saida.json>            (só mostra e salva amostra)
//   DB_CONFIRMED=1 npx tsx scripts/lousa-do-robo.ts <saida.json> --gravar   (grava no banco)

// Pablo, 22/11/2026: "tirando Natureza, Química, Português, só exatas". Química e Biologia
// ficam de fora (as 3 de Química já feitas à mão continuam).
const MATERIAS_DE_EXATAS = ['Matemática', 'Física'];

const prisma = new PrismaClient();

/** A lousa gravada foi feita POR ESTE gerador? A capa tem a frase dele; as feitas à mão (grandezas, geometria, ITA) têm outra. */
function lousaEDoGerador(lousa: unknown): boolean {
  const capa = (lousa as { cenas?: { fala?: [number, string][] }[] })?.cenas?.[0]?.fala?.[0]?.[1] ?? '';
  return capa.includes('A aula segue a conta dela') || capa.includes('Vamos pela ideia dela e depois pela conta');
}

function idsJaConvertidos(): Set<string> {
  const pasta = `${process.env.HOME}/backups-prepenem`;
  const ids = new Set<string>();
  for (const f of readdirSync(pasta).filter((n) => n.startsWith('explicacoes-antes-lousa-do-robo-'))) {
    for (const id of Object.keys(JSON.parse(readFileSync(`${pasta}/${f}`, 'utf8')))) ids.add(id);
  }
  return ids;
}

async function main() {
  const saida = process.argv[2];
  const gravar = process.argv.includes('--gravar');
  if (!saida) throw new Error('faltou o arquivo de saída');

  // --refazer: regera a lousa só das que ESTE script já converteu (ids das cópias em ~/backups-prepenem),
  // nunca das feitas à mão.
  // --todas (com --refazer): vale para qualquer lousa que tenha a capa deste gerador (as de aplicar-aulas-robo também), nunca as feitas à mão.
  const refazer = process.argv.includes('--refazer');
  const todas = process.argv.includes('--todas');
  const meus = refazer && !todas ? idsJaConvertidos() : new Set<string>();
  const ehMinha = (id: string): boolean => todas || meus.has(id);
  const linhas = await prisma.explicacaoPronta.findMany({ include: { question: true } });
  const feitas: Record<string, unknown> = {};
  const motivos = new Map<string, number>();
  let jaTem = 0;
  let feitaAMao = 0;
  let outroMolde = 0;
  let foraDaMateria = 0;
  for (const l of linhas) {
    const c = (l.conteudo ?? {}) as Record<string, unknown>;
    if (c.lousa && typeof c.lousa === 'object' && !(refazer && ehMinha(l.questionId))) { jaTem++; continue; }
    if (refazer && !ehMinha(l.questionId)) continue;
    // Nunca sobrescrever lousa feita à mão: um id que o script converteu antes pode ter ganho lousa à mão depois.
    if (refazer && !lousaEDoGerador(c.lousa)) { feitaAMao++; continue; }
    const passos = Array.isArray(c.passos) ? (c.passos as { titulo?: unknown; texto?: unknown; visual?: unknown }[]) : [];
    const q = l.question;
    if (!MATERIAS_DE_EXATAS.includes(q.materia)) { foraDaMateria++; continue; }
    const doRobo = passos[0]?.titulo === 'As fórmulas desta questão';
    if (!doRobo && !passos.length) { outroMolde++; continue; }
    // Letra = inicial da palavra (Pablo, 22/11/2026): troca nos passos E na lousa, para as duas aulas usarem as mesmas letras.
    // Só Matemática: as letras de Física (p, q, i, o da óptica; F, m, v) são clássicas e não se mexem.
    const { passos: passosNovos, trocas } = doRobo && q.materia === 'Matemática' ? letrasPelaInicial(passos, q.enunciado) : { passos, trocas: [] as Troca[] };
    const entrada = {
      enunciado: q.enunciado,
      alternativas: [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x),
      tema: q.tema,
      passos: passosNovos,
    };
    const r = doRobo ? lousaDoRobo(entrada) : lousaDoAntigo({ ...entrada, ideia: typeof c.ideia === 'string' ? c.ideia : '' });
    if (!r.ok) { motivos.set(r.motivo, (motivos.get(r.motivo) ?? 0) + 1); if (process.argv.includes('--quais')) console.log(`recusada ${q.id} · ${r.motivo}`); continue; }
    // Regra 21: enunciado de sólido sem imagem → a lousa desenha a figura (só Matemática).
    const comFigura = q.materia === 'Matemática' ? comFiguraDoSolido(r.aula, q.enunciado, !!q.imagemUrl || q.dependeImagem) : r.aula;
    const aula = validarLousa(comFigura);
    if (!aula || aula.cenas.length !== comFigura.cenas.length) { motivos.set('porteiro cortou tela', (motivos.get('porteiro cortou tela') ?? 0) + 1); continue; }
    feitas[q.id] = { aula, antes: c, conteudo: { ...c, passos: passosNovos }, trocas };
  }

  const ids = Object.keys(feitas);
  // Regra 24: parte das telas de lousa (fora a capa) que é só conta, antes e depois.
  const lousasDe = (x: unknown): ReturnType<typeof validarLousa> => validarLousa(x);
  const parteDeConta = (aula: { cenas: Parameters<typeof ehTelaDeConta>[0][] } | null): [number, number] => {
    const telas = (aula?.cenas ?? []).filter((c) => c.tipo === 'lousa').slice(1);
    return [telas.filter(ehTelaDeConta).length, telas.length];
  };
  let [contasDepois, telasDepois, contasAntes, telasAntes, aulasNaFaixa] = [0, 0, 0, 0, 0];
  for (const id of ids) {
    const f = feitas[id] as { aula: Parameters<typeof parteDeConta>[0]; antes: { lousa?: unknown } };
    const [cd, td] = parteDeConta(f.aula);
    const [ca, ta] = parteDeConta(lousasDe(f.antes.lousa));
    contasDepois += cd; telasDepois += td; contasAntes += ca; telasAntes += ta;
    if (td > 0 && Math.abs(cd / td - META_DE_CONTA) <= TOLERANCIA_DA_META) aulasNaFaixa++;
  }
  console.log(`telas só de conta: antes ${contasAntes} de ${telasAntes} · depois ${contasDepois} de ${telasDepois} · aulas entre 70% e 90%: ${aulasNaFaixa} de ${ids.length} (média geral ${((100 * contasDepois) / Math.max(1, telasDepois)).toFixed(0)}%; meta é MÉDIA de mais ou menos 80%)`);
  const comTroca = ids.filter((id) => (feitas[id] as { trocas: Troca[] }).trocas.length);
  console.log(`letras trocadas pela inicial: ${comTroca.length} aulas, ${comTroca.reduce((n, id) => n + (feitas[id] as { trocas: Troca[] }).trocas.length, 0)} letras`);
  // Relatório de cada frase que mudou na troca de letra, para conferir linha a linha antes de gravar.
  const textosDe = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(textosDe) : v && typeof v === 'object' ? Object.values(v).flatMap(textosDe) : []);
  const diffs = comTroca.flatMap((id) => {
    const f = feitas[id] as { antes: { passos?: unknown }; conteudo: { passos?: unknown } };
    const antes = textosDe(f.antes.passos);
    const depois = textosDe(f.conteudo.passos);
    return antes.flatMap((a, i) => (a !== depois[i] ? [`${id}\n   - ${a.replace(/\n/g, ' / ')}\n   + ${depois[i].replace(/\n/g, ' / ')}`] : []));
  });
  writeFileSync(saida.replace(/\.json$/, '-frases-trocadas.txt'), diffs.join('\n'));
  writeFileSync(saida.replace(/\.json$/, '-letras.txt'), comTroca.map((id) => `${id}: ${(feitas[id] as { trocas: Troca[] }).trocas.map((x) => `${x.de}→${x.para} (${x.oque})`).join(' · ')}`).join('\n'));
  console.log(`já tinham lousa: ${jaTem} · feitas à mão (intocadas): ${feitaAMao} · outro molde (fica como está): ${outroMolde} · fora de Mat/Fís: ${foraDaMateria} · convertidas: ${ids.length}`);
  for (const [m, n] of motivos) console.log(`  não deu: ${n} × ${m}`);
  writeFileSync(saida, JSON.stringify(Object.fromEntries(ids.map((id) => [id, (feitas[id] as { aula: unknown }).aula])), null, 1));

  if (!gravar) { console.log('Simulação: nada gravado. Rode com --gravar.'); return; }
  const copia = `${process.env.HOME}/backups-prepenem/explicacoes-antes-lousa-do-robo-${new Date().toISOString().slice(0, 16).replace(":", "h")}.json`;
  writeFileSync(copia, JSON.stringify(Object.fromEntries(ids.map((id) => [id, (feitas[id] as { antes: unknown }).antes]))));
  console.log(`Cópia do conteúdo antigo: ${copia}`);
  let n = 0;
  for (const id of ids) {
    const { aula, conteudo } = feitas[id] as { aula: unknown; conteudo: Record<string, unknown> };
    await prisma.explicacaoPronta.update({ where: { questionId: id }, data: { conteudo: { ...conteudo, lousa: aula } as object } });
    n++;
  }
  console.log(`Gravadas: ${n}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
