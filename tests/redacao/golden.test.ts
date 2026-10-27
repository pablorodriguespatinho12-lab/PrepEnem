// Camada B: golden set com a IA de verdade. Só roda com RODAR_IA=1
// (npm run test:redacao), porque gasta cota e leva minutos.
// - Redações nota 1000: a fixture original e as da cartilha em
//   tests/redacao/textos/*.txt (fora do git: texto do INEP não se copia).
//   Média tem que dar 880 ou mais.
// - Versões degradadas da fixture: cada uma perde ponto na competência certa.

import fs from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';
import { pedirJson } from '@/lib/pedir-json';
import { promptRedacaoCompleta } from '@/lib/redacao/prompts';
import { corrigirRedacao, COMPETENCIAS, type CorrecaoCompleta } from '@/lib/redacao/correcao';
import { MODELO_IA } from '@/lib/ia-modelos';
import { REDACAO, TEMA } from './fixtures';
import { DEGRADACOES_FIXTURE, degradar } from './degradacoes';

const RODAR = process.env.RODAR_IA === '1';
const MEDIA_MINIMA = 880;
const PRAZO_TESTE_MS = 300_000;
const PASTA_TEXTOS = path.join(__dirname, 'textos');
/* A Groq gratuita aceita 8.000 tokens por minuto e uma correção gasta ~6.000:
   em rajada, a 3ª já volta 429 (medido em 27/10/2026). */
const PAUSA_ENTRE_CORRECOES_MS = 60_000;
let ultimaChamada = 0;

async function corrigir(tema: string, texto: string): Promise<CorrecaoCompleta> {
  const falta = ultimaChamada + PAUSA_ENTRE_CORRECOES_MS - Date.now();
  if (ultimaChamada > 0 && falta > 0) await new Promise((resolve) => setTimeout(resolve, falta));
  ultimaChamada = Date.now();
  const r = await pedirJson(
    promptRedacaoCompleta(tema, null, texto),
    (bruto) => corrigirRedacao(bruto, texto),
    { maxTokens: 4500, temperature: 0.2, modelo: MODELO_IA.redacao(), pensar: 'medium', timeoutMs: 55_000, prazoMs: 180_000 },
  );
  if (!r.ok) throw new Error(`IA falhou: ${r.erro}`);
  return r.dado;
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
    let soma = 0;
    for (const r of lista) {
      const c = await corrigir(r.tema, r.texto);
      for (const k of ['c1', 'c2', 'c3', 'c4'] as const) expect(c.justificativas?.[k].trecho, `${r.nome} ${k}`).toBeTruthy();
      linhas.push(linha(r.nome, c));
      soma += c.total;
    }
    const media = Math.round(soma / lista.length);
    console.info(`\n${CABECALHO}\n${linhas.join('\n')}\n\nMédia: ${media} (${lista.length} redações)`);
    expect(media).toBeGreaterThanOrEqual(MEDIA_MINIMA);
  }, PRAZO_TESTE_MS * 3);

  test('versões degradadas perdem ponto na competência certa', async () => {
    const original = await corrigir(TEMA, REDACAO);
    const linhas = [linha('original', original)];
    const erradas: string[] = [];
    for (const d of DEGRADACOES_FIXTURE) {
      const c = await corrigir(TEMA, degradar(REDACAO, d));
      linhas.push(linha(`${d.nome} (${d.competencia.toUpperCase()})`, c));
      if (c.notas[d.competencia] >= original.notas[d.competencia]) erradas.push(d.nome);
    }
    console.info(`\n${CABECALHO}\n${linhas.join('\n')}`);
    expect(erradas).toEqual([]);
  }, PRAZO_TESTE_MS * 3);
});
