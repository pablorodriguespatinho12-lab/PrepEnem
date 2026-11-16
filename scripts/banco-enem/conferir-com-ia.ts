// A IA do site (modelo de verificação, lib/ia-modelos.ts) resolve as questões
// de um arquivo do banco ENEM sem ver o gabarito. Só aponta: quem decide é a
// revisão humana. Roda local, nunca no site no ar (Pablo, 16/11/2026: "ver se
// ela não vai dar problema"). Gasta ~1 pedido por lote de 5 questões.
// Uso: npx tsx scripts/banco-enem/conferir-com-ia.ts cobrir-e-chance
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolverIndependente } from '../../lib/verificar-respostas';

const LETRAS = 'ABCDE';
const POR_LOTE = 5;
const ESPERA_ENTRE_LOTES_MS = 15_000; // a cota da Groq gratuita é por minuto

type Q = { id: string; enunciado: string; resposta: string; A: string; B: string; C: string; D: string; E: string };

async function main() {
  const nome = process.argv[2];
  if (!nome) throw new Error('Diga o arquivo: npx tsx scripts/banco-enem/conferir-com-ia.ts cobrir-e-chance');
  const qs = JSON.parse(readFileSync(join(process.cwd(), 'data/revisao-final/banco-enem', `${nome}.json`), 'utf8')) as Q[];
  const discordam: string[] = [];
  let semResposta = 0;
  for (let i = 0; i < qs.length; i += POR_LOTE) {
    const lote = qs.slice(i, i + POR_LOTE);
    const r = await resolverIndependente(lote.map((q) => ({ enunciado: q.enunciado, opcoes: [...LETRAS].map((l) => q[l as keyof Q]) })));
    lote.forEach((q, k) => {
      const dada = r?.[k];
      if (!dada || !('indice' in dada)) { semResposta++; return; }
      const letra = LETRAS[dada.indice];
      if (letra !== q.resposta) discordam.push(`${q.id}: gabarito ${q.resposta}, a IA marcou ${letra}`);
    });
    if (i + POR_LOTE < qs.length) await new Promise((ok) => setTimeout(ok, ESPERA_ENTRE_LOTES_MS));
  }
  console.log(`${qs.length} questões: ${qs.length - discordam.length - semResposta} concordam, ${discordam.length} discordam, ${semResposta} sem resposta da IA.`);
  discordam.forEach((d) => console.log(' -', d));
}

main().catch((e) => { console.error(e); process.exit(1); });
