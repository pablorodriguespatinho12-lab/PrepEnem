// Gera data/revisao-final/dia-2/aulas.json a partir da revisão do dia 2
// (docs/revisao-final/dia-2/*.js): por tema, a aula de 5 frases e os degraus
// Médio, Difícil e ENEM, para a Fácil preparar as provas de cima.
// Questão de exemplo que já está numa das 4 provas fica de fora (não estraga a surpresa).
// Rodar: node scripts/gerar-aulas-dia-2.cjs
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const PASTA_DOCS = path.join(RAIZ, 'docs/revisao-final/dia-2');
const PASTA_PROVAS = path.join(RAIZ, 'data/revisao-final/dia-2');
const SAIDA = path.join(PASTA_PROVAS, 'aulas.json');
const NIVEIS = ['Fácil', 'Médio', 'Difícil', 'ENEM'];
const PREFIXO = 60;

global.window = {};
for (const f of ['fisica', 'quimica', 'biologia', 'matematica']) {
  require(path.join(PASTA_DOCS, `${f}.js`));
}

// O que a questão de cima cobra e a aula não ensina (aluno-do-zero, 11/11/2026).
const SUBIR = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/data/aulas-dia-2-subir.json'), 'utf8'));
// Frase de bastidor da página de revisão não vai para a tela do aluno.
const semBastidor = (texto) => texto.replace(/\s*Esta questão também está na prova[^.]*\./g, '');

const naProva = new Set();
for (const f of fs.readdirSync(PASTA_PROVAS).filter((n) => n.endsWith('.json') && n !== 'aulas.json')) {
  for (const q of JSON.parse(fs.readFileSync(path.join(PASTA_PROVAS, f), 'utf8'))) {
    naProva.add(q.enunciado.slice(0, PREFIXO));
  }
}

const aulas = {};
for (const c of window.DIA2) {
  const degraus = c.q
    .map((q, i) => ({ q, nivel: NIVEIS[i] }))
    .filter(({ nivel, q }) => nivel !== 'Fácil' && !naProva.has(q.e.slice(0, PREFIXO)))
    .map(({ q, nivel }) => ({
      nivel,
      ...(q.o ? { origem: q.o } : {}),
      enunciado: q.e,
      alternativas: q.a,
      certa: q.g,
      resolucao: semBastidor(q.r),
    }));
  aulas[c.t] = { materia: c.m, aula: c.aula, paraSubir: SUBIR[c.t] ?? [], degraus };
}
const sobrando = Object.keys(SUBIR).filter((t) => !aulas[t]);
if (sobrando.length) throw new Error(`tema sem aula em aulas-dia-2-subir.json: ${sobrando.join(', ')}`);

fs.writeFileSync(SAIDA, JSON.stringify(aulas, null, 2) + '\n');
console.log(`${Object.keys(aulas).length} temas, ${Object.values(aulas).reduce((s, a) => s + a.degraus.length, 0)} degraus`);
