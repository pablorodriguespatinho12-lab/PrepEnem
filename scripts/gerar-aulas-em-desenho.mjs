// Monta a prévia das aulas em desenho (página Artifact) a partir da fonte única
// lib/aulas-desenho-dados.js e do modelo scripts/data/aulas-em-desenho.template.html.
// Rodar: node scripts/gerar-aulas-em-desenho.mjs  →  docs/revisao-final/dia-2/aulas-em-desenho.html
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const dados = readFileSync(join(RAIZ, 'lib/aulas-desenho-dados.js'), 'utf8').replace(/^export /gm, '');
const modelo = readFileSync(join(RAIZ, 'scripts/data/aulas-em-desenho.template.html'), 'utf8');
if (modelo.split('/*DADOS*/').length !== 2) throw new Error('modelo sem o marcador /*DADOS*/ (ou com mais de um)');
const saida = join(RAIZ, 'docs/revisao-final/dia-2/aulas-em-desenho.html');
writeFileSync(saida, modelo.replace('/*DADOS*/', () => dados));
console.log('ok', saida);
