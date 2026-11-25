import { readFileSync } from 'fs';
import { lousaDoRobo } from '../lib/aula-lousa/do-robo';
import { letrasPelaInicial } from '../lib/aula-lousa/letras';
import { numerosSemOrigem } from '../lib/aula-lousa/origem-dos-numeros';
import { validarLousa } from '../lib/aula-lousa/validar';

// Confere, SEM banco, se cada questão de um arquivo da escada vira lousa inteira e se algum
// número entra numa conta sem origem. Uso: DB_CONFIRMED=1 npx tsx scripts/conferir-lousa-de-arquivo.ts <arquivo.json>
// (o DB_CONFIRMED é só porque a guarda do projeto pede em todo script; aqui nada toca o banco).

interface Questao {
  id: string; materia: string; tema: string; enunciado: string; A: string; B: string; C: string; D: string; E: string;
  explicacao: { passos: { titulo?: unknown; texto?: unknown; visual?: unknown }[] };
}

for (const q of JSON.parse(readFileSync(process.argv[2], 'utf8')) as Questao[]) {
  // Matemática: o gravador de lousa troca as letras pela inicial; mostrar a troca aqui evita surpresa.
  const { passos, trocas } = q.materia === 'Matemática'
    ? letrasPelaInicial(q.explicacao.passos, q.enunciado)
    : { passos: q.explicacao.passos, trocas: [] };
  const r = lousaDoRobo({ enunciado: q.enunciado, alternativas: [q.A, q.B, q.C, q.D, q.E], tema: q.tema, passos });
  if (!r.ok) { console.log(q.id, 'FALHOU', r.motivo); continue; }
  const aula = validarLousa(r.aula);
  const cortou = !aula || aula.cenas.length !== r.aula.cenas.length;
  console.log(
    q.id, `telas ${r.aula.cenas.length}`, cortou ? 'PORTEIRO CORTOU' : 'ok',
    'sem origem:', JSON.stringify(aula ? numerosSemOrigem(aula.cenas).map((n) => n.linha) : []),
    trocas.length ? `letras trocadas: ${trocas.map((t) => `${t.de}→${t.para}`).join(' ')}` : '',
  );
}
