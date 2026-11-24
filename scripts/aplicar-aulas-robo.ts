import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { lousaDoRobo } from '../lib/aula-lousa/do-robo';
import { letraCombina } from '../lib/aula-lousa/letras';
import { validarLousa } from '../lib/aula-lousa/validar';
import { validarExplicacao } from '../lib/tutor/validar';
import { VERSAO_EXPLICACAO } from '../lib/tutor/pronta';

// Aplica as aulas reescritas no molde do robô (docs/aula-robo-do-antigo.md) em questões de Matemática e Física que
// estavam no molde antigo, SEM equação montada (Pablo, 22/11/2026). Cada arquivo de <pasta>/saida/<id>.json passa por
// conferências antes de qualquer escrita: molde, letras pela inicial, "Letra X" = gabarito, valor_final = alternativa certa,
// o validador do site e o porteiro da lousa. Só grava com --gravar, com cópia do conteúdo antigo.
// Uso: DB_CONFIRMED=1 npx tsx scripts/aplicar-aulas-robo.ts <pasta> [--gravar]

const prisma = new PrismaClient();
type Passo = { titulo?: unknown; texto?: unknown; visual?: unknown };

/** "R$ 1 400,50" → 1400.5; "15 km" → 15; sem número → null. */
export function primeiroNumero(s: string): number | null {
  const m = s.replace(/\s(?=\d{3}\b)/g, '').match(/-?\d+(?:[.,]\d+)?/);
  return m ? Number(m[0].replace(',', '.')) : null;
}

/** Aula nova não tem "ideia": usa o que a questão quer, que abre o texto do passo "A equação em letras" (até 300 letras, em frases inteiras). */
function ideiaDosPassos(passos: Passo[]): string {
  const texto = String(passos.find((p) => p.titulo === 'A equação em letras')?.texto ?? '').replace(/\s+/g, ' ').trim();
  const frases = texto.match(/[^.!?]+[.!?]/g) ?? [texto];
  let saida = '';
  for (const f of frases) if ((saida + f).trim().length <= 300) saida = `${saida}${f}`;
  return saida.trim() || texto.slice(0, 300);
}

function conferir(passos: Passo[], resposta: string, valorFinal: unknown, alternativaCerta: string): string[] {
  const erros: string[] = [];
  if (passos[0]?.titulo !== 'As fórmulas desta questão') erros.push('1º passo não é "As fórmulas desta questão"');
  const titulos = passos.map((p) => String(p.titulo ?? ''));
  for (const t of ['O que eu tenho', 'A equação em letras', 'Volta na equação']) if (!titulos.includes(t)) erros.push(`falta o passo "${t}"`);
  if (!titulos.some((t) => /parecida/i.test(t))) erros.push('falta "Questão parecida?"');
  if (passos.length > 9) erros.push(`passos demais (${passos.length})`);
  const eq = passos.find((p) => p.titulo === 'A equação em letras');
  const letras = ((eq?.visual as { letras?: { letra: string; oque: string }[] } | undefined)?.letras ?? []);
  for (const l of letras) if (/^[A-Za-z]$/.test(l.letra) && !letraCombina(l.letra, l.oque)) erros.push(`letra ${l.letra} não combina com "${l.oque}"`);
  const volta = passos.find((p) => p.titulo === 'Volta na equação');
  if (!new RegExp(`Letra ${resposta}\\b`).test(String(volta?.texto ?? ''))) erros.push(`"Volta na equação" não termina em "Letra ${resposta}"`);
  const esperado = primeiroNumero(alternativaCerta);
  if (typeof valorFinal !== 'number') erros.push('falta valor_final numérico');
  else if (esperado !== null && Math.abs(valorFinal - esperado) > Math.max(1e-6, Math.abs(esperado) * 1e-6)) erros.push(`valor_final ${valorFinal} ≠ alternativa certa ${esperado}`);
  const tudo = JSON.stringify(passos);
  if (/(?<!R)\$|\\frac|\\times|\\cdot/.test(tudo)) erros.push('LaTeX ou $ no texto');
  return erros;
}

async function main() {
  const [pasta] = process.argv.slice(2);
  const gravar = process.argv.includes('--gravar');
  if (!pasta) throw new Error('uso: aplicar-aulas-robo.ts <pasta> [--gravar]');
  const dir = `${pasta}/saida`;
  if (!existsSync(dir)) throw new Error(`sem ${dir}`);
  const aprovadas: { id: string; nova: boolean; antes: unknown; depois: object }[] = [];
  let semConta = 0;
  for (const arq of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const id = arq.replace(/\.json$/, '');
    const saida = JSON.parse(readFileSync(`${dir}/${arq}`, 'utf8')) as { passos?: Passo[]; valor_final?: unknown; semConta?: boolean; motivo?: string };
    if (saida.semConta) { semConta++; console.log(`${id}: sem conta (${saida.motivo ?? '?'}) — fica como está`); continue; }
    const q = await prisma.question.findUnique({ where: { id } });
    const e = await prisma.explicacaoPronta.findUnique({ where: { questionId: id } });
    // Sem aula no banco (questão real do ENEM nunca explicada): nasce uma linha nova (24/11/2026).
    if (!q || !saida.passos) { console.log(`${id}: ✗ questão ou passos ausentes`); continue; }
    if (!['Matemática', 'Física'].includes(q.materia)) { console.log(`${id}: ✗ fora de Mat/Fís`); continue; }
    const certa = ({ A: q.alternativaA, B: q.alternativaB, C: q.alternativaC, D: q.alternativaD, E: q.alternativaE } as Record<string, string | null>)[q.respostaCorreta] ?? '';
    const erros = conferir(saida.passos, q.respostaCorreta, saida.valor_final, certa);
    const antigo = (e?.conteudo ?? { ideia: ideiaDosPassos(saida.passos), pecas: [], seuErro: null }) as Record<string, unknown>;
    const { lousa: _l, ...semLousa } = antigo;
    void _l;
    const mesclado = validarExplicacao({ ...semLousa, passos: saida.passos }, q.materia);
    if (!mesclado) erros.push('o validador do site recusou a explicação');
    const alternativas = [q.alternativaA, q.alternativaB, q.alternativaC, q.alternativaD, q.alternativaE].filter((x): x is string => !!x);
    const r = lousaDoRobo({ enunciado: q.enunciado, alternativas, tema: q.tema, passos: saida.passos });
    const aula = r.ok ? validarLousa(r.aula) : null;
    if (!r.ok) erros.push(`lousa: ${r.motivo}`);
    else if (!aula || aula.cenas.length !== r.aula.cenas.length) erros.push('o porteiro da lousa cortou tela');
    if (erros.length || !mesclado || !aula) { console.log(`${id}: ✗ ${erros.join(' · ')}`); continue; }
    console.log(`${id}: ✓ ${aula.cenas.length} telas · resposta ${q.respostaCorreta} = ${saida.valor_final}`);
    aprovadas.push({ id, nova: !e, antes: antigo, depois: { ...(mesclado as object), lousa: aula } });
  }
  console.log(`\naprovadas: ${aprovadas.length} · sem conta: ${semConta}`);
  if (!gravar) { console.log('Simulação: nada gravado. Rode com --gravar.'); return; }
  const copia = `${process.env.HOME}/backups-prepenem/explicacoes-antes-aulas-robo-${new Date().toISOString().slice(0, 16).replace(':', 'h')}.json`;
  writeFileSync(copia, JSON.stringify(Object.fromEntries(aprovadas.map((a) => [a.id, a.antes]))));
  console.log(`Cópia: ${copia}`);
  for (const a of aprovadas) {
    if (a.nova) await prisma.explicacaoPronta.create({ data: { questionId: a.id, versao: VERSAO_EXPLICACAO, conteudo: a.depois as object, revisada: true, problemas: null, modelo: 'escrita na sessão' } });
    else await prisma.explicacaoPronta.update({ where: { questionId: a.id }, data: { conteudo: a.depois } });
  }
  console.log(`Gravadas: ${aprovadas.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
