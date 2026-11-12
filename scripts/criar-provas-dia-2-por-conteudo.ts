import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Provas do dia 2 POR CONTEÚDO (Pablo, 12/11/2026: "começa com uma fácil de
// velocidade média, depois média, difícil, ENEM; aí vai para o próximo conteúdo").
// Usa as MESMAS 160 questões das 4 provas por nível (já no banco); só muda a
// ordem. Não apaga nem mexe nas provas antigas. Dentro de cada conteúdo:
// Fácil → Médio → Difícil → ENEM, e repete se o conteúdo tiver mais de uma de cada.
// Sem --gravar só mostra o que faria. Uso:
//   DB_CONFIRMED=1 npx tsx scripts/criar-provas-dia-2-por-conteudo.ts <username> [--gravar]

const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const NIVEIS = ['facil', 'medio', 'dificil', 'enem'] as const;
const AREAS = ['natureza', 'matematica'] as const;

type Questao = { id: string; materia: string; tema: string };
type Nivel = (typeof NIVEIS)[number];

// Mais cobrado primeiro dentro de cada área (ordem da revisão do dia 2).
const PROVAS: { nome: string; temas: string[] }[] = [
  { nome: 'Dia 2 por conteúdo · Física', temas: ['Eletricidade e Circuitos', 'Dinâmica e Leis de Newton', 'Termodinâmica e Calor', 'Ondas e Acústica', 'Óptica'] },
  { nome: 'Dia 2 por conteúdo · Química', temas: ['Química Orgânica', 'Química Ambiental e Energia', 'Estequiometria', 'Eletroquímica', 'Soluções, pH e Titulação'] },
  { nome: 'Dia 2 por conteúdo · Biologia', temas: ['Ecologia', 'Fisiologia Humana e Saúde', 'Genética', 'Citologia', 'Evolução', 'Microbiologia e Doenças'] },
  { nome: 'Dia 2 por conteúdo · Matemática 1', temas: ['Aritmética e Porcentagem', 'Estatística', 'Funções'] },
  { nome: 'Dia 2 por conteúdo · Matemática 2', temas: ['Geometria Espacial', 'Geometria Plana', 'Grandezas e Medidas'] },
];

const porNivel = Object.fromEntries(
  NIVEIS.map((n) => [n, AREAS.flatMap((a) => JSON.parse(readFileSync(join(PASTA, `${n}-${a}.json`), 'utf8')) as Questao[])]),
) as Record<Nivel, Questao[]>;

/** Fácil, Médio, Difícil, ENEM do tema; depois a 2ª de cada; e assim por diante. */
export function escadaDoTema(tema: string): Questao[] {
  const filas = NIVEIS.map((n) => porNivel[n].filter((q) => q.tema === tema));
  const voltas = Math.max(...filas.map((f) => f.length));
  return Array.from({ length: voltas }, (_, i) => filas.map((f) => f[i]).filter(Boolean)).flat();
}

async function main() {
  const [username] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const gravar = process.argv.includes('--gravar');
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error(`Conta não encontrada: ${username}`);

  const todas = new Set(NIVEIS.flatMap((n) => porNivel[n].map((q) => q.id)));
  const usadas = new Set<string>();
  const montadas = PROVAS.map((p) => {
    const questoes = p.temas.flatMap(escadaDoTema);
    questoes.forEach((q) => usadas.add(q.id));
    return { ...p, questoes };
  });
  const faltando = [...todas].filter((id) => !usadas.has(id));
  if (faltando.length) throw new Error(`Questões sem prova: ${faltando.join(', ')}`);
  const noBanco = await prisma.question.count({ where: { id: { in: [...usadas] } } });
  if (noBanco !== usadas.size) throw new Error(`Só ${noBanco} de ${usadas.size} questões estão no banco; nada gravado`);

  for (const p of montadas) {
    console.log(`${p.nome}: ${p.questoes.length} questões. Começo: ${p.questoes.slice(0, 5).map((q) => q.id.replace('d2-', '')).join(', ')}`);
  }
  console.log(`Total: ${usadas.size} de ${todas.size} questões, todas no banco.`);
  if (!gravar) return console.log('Nada gravado (use --gravar).');

  for (const p of montadas) {
    const ja = await prisma.customExam.findFirst({ where: { userId: user.id, nome: p.nome } });
    if (ja) {
      console.log(`${p.nome}: já existe, deixei como está.`);
      continue;
    }
    await prisma.customExam.create({
      data: {
        userId: user.id, nome: p.nome, nivel: 'escada',
        materias: Array.from(new Set(p.questoes.map((q) => q.materia))),
        totalQuestoes: p.questoes.length,
        questions: { create: p.questoes.map((q, ordem) => ({ questionId: q.id, ordem })) },
      },
    });
    console.log(`${p.nome}: criada.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
