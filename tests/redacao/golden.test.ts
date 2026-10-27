// Camada B: golden set com a IA de verdade. Só roda com RODAR_IA=1
// (npm run test:redacao), porque gasta cota e leva minutos.
// - Redações nota 1000: a fixture original e as da cartilha em
//   tests/redacao/textos/*.txt (fora do git: texto do INEP não se copia).
//   Média tem que dar 880 ou mais.
// - Versões degradadas da fixture: cada uma perde ponto na competência certa.
// - Onde o comentário do INEP declara o nível (niveis-inep.ts), a nota fica a
//   no máximo 40 dele. A cartilha não diz que as redações tiraram 1000.

import fs from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';
import { pedirJson } from '@/lib/pedir-json';
import { opcoesCorrecaoCompleta, promptRedacaoCompleta } from '@/lib/redacao/prompts';
import { corrigirRedacao, COMPETENCIAS, type CorrecaoCompleta } from '@/lib/redacao/correcao';
import { REDACAO, TEMA } from './fixtures';
import { ARQUIVO_CARTILHA_ESTRAGADA, DEGRADACOES_CARTILHA, DEGRADACOES_FIXTURE, degradar } from './degradacoes';
import { NIVEIS_INEP } from './niveis-inep';

const RODAR = process.env.RODAR_IA === '1';
const MEDIA_MINIMA = 880;
const PRAZO_TESTE_MS = 300_000;
const PASTA_TEXTOS = path.join(__dirname, 'textos');
/* A Groq gratuita aceita 8.000 tokens por minuto e uma correção gasta ~6.000:
   em rajada, a 3ª já volta 429 (medido em 27/10/2026). */
const PAUSA_ENTRE_CORRECOES_MS = Number(process.env.REDACAO_PAUSA_MS ?? 60_000);
let ultimaChamada = 0;
/* Outro modelo só no teste, sem mexer no site:
     REDACAO_MODELO=gemini:gemini-3-flash-preview REDACAO_PENSAR=medium REDACAO_MAX_TOKENS=16000
   Nota de um modelo não vale para outro: trocou, roda o golden set inteiro.
   O Gemini não está em RESERVAS (lib/ia-modelos.ts), então não cai para outro
   modelo no 429. O gpt-oss-120b cai para o 20b e o qwen: a rodada de 27/10
   terminou com a cota do dia esgotada, e as últimas notas podem ser deles. */
const OPCOES_TESTE = {
  ...opcoesCorrecaoCompleta(),
  ...(process.env.REDACAO_MODELO ? { modelo: process.env.REDACAO_MODELO } : {}),
  ...(process.env.REDACAO_PENSAR ? { pensar: process.env.REDACAO_PENSAR as 'low' | 'medium' | 'high' } : {}),
  ...(process.env.REDACAO_MAX_TOKENS ? { maxTokens: Number(process.env.REDACAO_MAX_TOKENS) } : {}),
  /* Sem corte: o tempo de cada correção é medido, e o que passar de 55 s é
     marcado (a Vercel mata a função aos 60 s). */
  timeoutMs: 120_000,
};
const LIMITE_VERCEL_MS = 55_000;
/* Retomar uma rodada que parou na cota (o Gemini gratuito dá 20 pedidos por
   dia): REDACAO_ANTERIOR aponta para o JSON salvo por REDACAO_SALVAR, e as
   redações que já estão nele não são corrigidas de novo. O arquivo diz o
   modelo: só vale juntar notas do mesmo modelo. */
const ANTERIORES: Record<string, CorrecaoCompleta> = (() => {
  const arq = process.env.REDACAO_ANTERIOR;
  if (!arq) return {};
  const salvo = JSON.parse(fs.readFileSync(arq, 'utf8')) as { modelo: string; notas: Record<string, CorrecaoCompleta> };
  if (salvo.modelo !== OPCOES_TESTE.modelo) throw new Error(`REDACAO_ANTERIOR é de ${salvo.modelo}, e esta rodada usa ${OPCOES_TESTE.modelo}`);
  return salvo.notas;
})();
const tempos: { nome: string; ms: number }[] = [];
const corrigidas = new Map<string, CorrecaoCompleta>();
/* Grupo separado: redações que não serviram para escrever nenhuma regra do
   corretor (a 2026 #02 e a #10 serviram). Se a média delas ficar mais de 40
   abaixo da média das outras da cartilha, o corretor está decorado nelas. */
const SEPARADAS = ['cartilha2026-05', 'cartilha2026-07', 'cartilha2025-04', 'cartilha2025-06'];
const DIFERENCA_MAXIMA_SEPARADAS = 40;
const media = (ns: number[]) => Math.round(ns.reduce((a, b) => a + b, 0) / Math.max(ns.length, 1));

/* A rede cai às vezes ("fetch failed" 8 vezes na rodada de 27/10/2026, que
   parou na 7ª redação): cada correção tenta até 3 vezes antes de desistir. */
const TENTATIVAS_POR_CORRECAO = 3;
async function corrigir(tema: string, texto: string, nome = ''): Promise<CorrecaoCompleta> {
  let erro = '';
  for (let i = 0; i < TENTATIVAS_POR_CORRECAO; i++) {
    const falta = ultimaChamada + PAUSA_ENTRE_CORRECOES_MS - Date.now();
    if (ultimaChamada > 0 && falta > 0) await new Promise((resolve) => setTimeout(resolve, falta));
    ultimaChamada = Date.now();
    const r = await pedirJson(
      promptRedacaoCompleta(tema, null, texto),
      (bruto) => corrigirRedacao(bruto, texto),
      { ...OPCOES_TESTE, prazoMs: 180_000 },
    );
    if (r.ok) {
      tempos.push({ nome, ms: Date.now() - ultimaChamada });
      return r.dado;
    }
    erro = r.erro;
  }
  throw new Error(`IA falhou ${TENTATIVAS_POR_CORRECAO} vezes: ${erro}`);
}

/* Cada .txt da pasta: 1ª linha "TEMA: ...", depois a redação. */
function textosDaCartilha(): { nome: string; tema: string; texto: string }[] {
  if (!fs.existsSync(PASTA_TEXTOS)) return [];
  return fs.readdirSync(PASTA_TEXTOS).filter((f) => f.endsWith('.txt')).sort().map((f) => {
    const [primeira, ...resto] = fs.readFileSync(path.join(PASTA_TEXTOS, f), 'utf8').split('\n');
    return { nome: f.replace('.txt', ''), tema: primeira.replace(/^TEMA:\s*/, ''), texto: resto.join('\n').trim() };
  });
}

const linha = (nome: string, c: CorrecaoCompleta) =>
  `| ${nome} | ${COMPETENCIAS.map((k) => c.notas[k]).join(' | ')} | ${c.total} |`;
const CABECALHO = '| redação | C1 | C2 | C3 | C4 | C5 | total |\n|---|---|---|---|---|---|---|';

describe.skipIf(!RODAR)('golden set da redação (IA real)', () => {
  test('nota 1000: média de 880 ou mais, e toda nota com trecho', async () => {
    const lista = [{ nome: 'fixture (original)', tema: TEMA, texto: REDACAO }, ...textosDaCartilha()];
    const linhas: string[] = [];
    const falhas: string[] = [];
    let soma = 0;
    for (const r of lista) {
      let c: CorrecaoCompleta;
      const anterior = ANTERIORES[r.nome];
      if (anterior) {
        corrigidas.set(r.nome, anterior);
        linhas.push(`${linha(r.nome, anterior)} (rodada anterior)`);
        soma += anterior.total;
        continue;
      }
      try {
        c = await corrigir(r.tema, r.texto, r.nome);
      } catch (e) {
        falhas.push(`${r.nome}: ${(e as Error).message}`);
        continue;
      }
      corrigidas.set(r.nome, c);
      for (const k of ['c1', 'c2', 'c3', 'c4'] as const) expect(c.justificativas?.[k].trecho, `${r.nome} ${k}`).toBeTruthy();
      linhas.push(linha(r.nome, c));
      soma += c.total;
    }
    const mediaGeral = Math.round(soma / Math.max(linhas.length, 1));
    console.info(`\n${CABECALHO}\n${linhas.join('\n')}\n\nMédia: ${mediaGeral} (${linhas.length} redações)${falhas.length ? `\nFalharam: ${falhas.join('; ')}` : ''}`);
    if (process.env.REDACAO_SALVAR) {
      const notas = Object.fromEntries([...corrigidas].map(([nome, c]) => [nome, { notas: c.notas, total: c.total }]));
      fs.writeFileSync(process.env.REDACAO_SALVAR, JSON.stringify({ modelo: OPCOES_TESTE.modelo, notas }, null, 1));
    }
    expect(falhas).toEqual([]);
    expect(mediaGeral).toBeGreaterThanOrEqual(MEDIA_MINIMA);
  }, PRAZO_TESTE_MS * 12);

  test('o grupo separado não fica mais de 40 abaixo das outras da cartilha', () => {
    const daCartilha = [...corrigidas].filter(([nome]) => nome.startsWith('cartilha'));
    const separadas = daCartilha.filter(([nome]) => SEPARADAS.includes(nome)).map(([, c]) => c.total);
    const outras = daCartilha.filter(([nome]) => !SEPARADAS.includes(nome)).map(([, c]) => c.total);
    if (separadas.length === 0) return;
    console.info(`\nGrupo separado: média ${media(separadas)} (${separadas.length}). Outras da cartilha: média ${media(outras)} (${outras.length}).`);
    expect(media(outras) - media(separadas)).toBeLessThanOrEqual(DIFERENCA_MAXIMA_SEPARADAS);
  });
  test('onde o INEP declara o nível, a nota fica a no máximo 40 dele', () => {
    const longe: string[] = [];
    let comparadas = 0;
    /* Uma tabela por competência: se a diferença é sempre do mesmo lado, é
       viés do corretor, não ruído. */
    for (const k of ['c1', 'c4'] as const) {
      const linhas: string[] = [];
      const difs: number[] = [];
      for (const [nome, niveis] of Object.entries(NIVEIS_INEP)) {
        const c = corrigidas.get(nome);
        const n = niveis[k];
        if (!c || !n) continue;
        const dif = c.notas[k] - n.nivel;
        difs.push(dif);
        linhas.push(`| ${nome} | ${n.nivel} | ${c.notas[k]} | ${dif === 0 ? 'igual' : dif > 0 ? `+${dif}` : dif} |`);
        if (Math.abs(dif) > 40) longe.push(`${nome} ${k}`);
      }
      comparadas += linhas.length;
      const abaixo = difs.filter((d) => d < 0).length;
      const acima = difs.filter((d) => d > 0).length;
      console.info(`\n${k.toUpperCase()}: nossa nota contra o nível do INEP\n| redação | INEP | nossa | diferença |\n|---|---|---|---|\n${linhas.join('\n')}\nAbaixo: ${abaixo} · igual: ${difs.length - abaixo - acima} · acima: ${acima}`);
    }
    expect(comparadas).toBeGreaterThan(0);
    expect(longe).toEqual([]);
  });
  test('versões degradadas perdem ponto na competência certa', async () => {
    const original = corrigidas.get('fixture (original)') ?? await corrigir(TEMA, REDACAO, 'fixture original');
    const linhas = [linha('original', original)];
    const erradas: string[] = [];
    for (const d of DEGRADACOES_FIXTURE) {
      const c = await corrigir(TEMA, degradar(REDACAO, d), `fixture ${d.nome}`);
      linhas.push(linha(`${d.nome} (${d.competencia.toUpperCase()})`, c));
      if (c.notas[d.competencia] >= original.notas[d.competencia]) erradas.push(d.nome);
    }
    console.info(`\n${CABECALHO}\n${linhas.join('\n')}`);
    expect(erradas).toEqual([]);
  }, PRAZO_TESTE_MS * 3);

  test('estragos numa redação real da cartilha perdem ponto na competência certa', async () => {
    const real = textosDaCartilha().find((r) => r.nome === ARQUIVO_CARTILHA_ESTRAGADA);
    if (!real) return;
    const original = corrigidas.get(real.nome) ?? await corrigir(real.tema, real.texto, real.nome);
    const linhas = [linha(`${real.nome} original`, original)];
    const quedas: string[] = [];
    const erradas: string[] = [];
    for (const d of DEGRADACOES_CARTILHA) {
      const c = await corrigir(real.tema, degradar(real.texto, d), `${real.nome} ${d.nome}`);
      linhas.push(linha(`${d.nome} (${d.competencia.toUpperCase()})`, c));
      quedas.push(`${d.nome}${d.soReporta ? ' (só reporta)' : ''}: ${COMPETENCIAS.map((k) => `${k.toUpperCase()} ${c.notas[k] - original.notas[k]}`).join(', ')}`);
      if (!d.soReporta && c.notas[d.competencia] >= original.notas[d.competencia]) erradas.push(d.nome);
    }
    console.info(`\n${CABECALHO}\n${linhas.join('\n')}\n\nQueda por competência:\n${quedas.join('\n')}`);
    expect(erradas).toEqual([]);
  }, PRAZO_TESTE_MS * 3);

  test('nenhuma correção passa de 55 s (a Vercel corta aos 60 s)', () => {
    if (tempos.length === 0) return;
    const ordenados = [...tempos].sort((a, b) => b.ms - a.ms);
    const seg = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
    const lentas = ordenados.filter((t) => t.ms > LIMITE_VERCEL_MS);
    console.info(`\nModelo: ${OPCOES_TESTE.modelo} (${OPCOES_TESTE.pensar}, teto ${OPCOES_TESTE.maxTokens})\nTempo: máximo ${seg(ordenados[0].ms)} (${ordenados[0].nome}) · média ${seg(media(tempos.map((t) => t.ms)))} · ${tempos.length} correções${lentas.length ? `\nPassaram de 55 s: ${lentas.map((t) => `${t.nome} ${seg(t.ms)}`).join('; ')}` : ''}`);
    expect(lentas.map((t) => t.nome)).toEqual([]);
  });
});
