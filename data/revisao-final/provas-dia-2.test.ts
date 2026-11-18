import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { frases, validarExplicacao } from '@/lib/tutor/validar';
import { problemasDaExplicacao } from '@/lib/tutor/pronta';
import { ESCADAS } from '@/data/escadas';

// Provas do dia 2 (data/revisao-final/dia-2/LEIA-ME.md): confere o que o código
// consegue conferir antes de o Pablo gravar no banco. Fato e conta ficam com o
// agente revisor-de-fatos; clareza, com o aluno-do-zero.

const PASTA = join(process.cwd(), 'data/revisao-final/dia-2');
const NIVEIS = ['facil', 'medio', 'dificil', 'enem'] as const;
const AREAS = ['natureza', 'matematica'] as const;
const LETRAS = ['A', 'B', 'C', 'D', 'E'] as const;
const POR_ARQUIVO = 20;
const MIN_POR_LETRA = 3;
const MAX_POR_LETRA = 5;

const COTAS: Record<(typeof AREAS)[number], Record<string, number>> = {
  matematica: {
    'Matemática|Aritmética e Porcentagem': 5, 'Matemática|Grandezas e Medidas': 3, 'Matemática|Estatística': 3,
    'Matemática|Funções': 3, 'Matemática|Geometria Plana': 3, 'Matemática|Geometria Espacial': 3,
  },
  natureza: {
    'Física|Eletricidade e Circuitos': 2, 'Física|Termodinâmica e Calor': 1, 'Física|Ondas e Acústica': 1,
    'Física|Óptica': 1, 'Física|Dinâmica e Leis de Newton': 1,
    'Biologia|Ecologia': 2, 'Biologia|Fisiologia Humana e Saúde': 1, 'Biologia|Genética': 1, 'Biologia|Citologia': 1,
    'Biologia|Evolução': 1, 'Biologia|Microbiologia e Doenças': 1,
    'Química|Química Orgânica': 2, 'Química|Química Ambiental e Energia': 2, 'Química|Soluções, pH e Titulação': 1,
    'Química|Eletroquímica': 1, 'Química|Estequiometria': 1,
  },
};

interface Questao {
  id: string; materia: string; tema: string; enunciado: string; resposta: string; origem?: string;
  A: string; B: string; C: string; D: string; E: string;
  explicacao: Record<string, unknown>;
}

const PROIBIDO = /é importante notar|vale ressaltar|vamos analisar|derivad|integral|\\int|\\lim|[\p{Extended_Pictographic}]/iu;
const PEDE_FIGURA = /observe a (figura|imagem)|na figura|no gráfico abaixo|na imagem/i;

const ler = (nivel: string, area: string): Questao[] | null => {
  const caminho = join(PASTA, `${nivel}-${area}.json`);
  return existsSync(caminho) ? (JSON.parse(readFileSync(caminho, 'utf8')) as Questao[]) : null;
};

/* Molde da "Aula do Robô Aspirador" (17/11/2026, o Pablo aprovou: "copia exatamente
   essa explicação"): o que eu tenho → equação em letras → uma tela por letra →
   volta na equação → receita. Não tem quadro nem "A resposta"; cada letra da
   equação, menos a que a questão pede, tem a sua tela "Achando <letra>". */
type PassoBruto = { titulo: string; visual?: { tipo?: string; linhas?: string[][] } };
const passosDe = (q: Questao) => (q.explicacao.passos as PassoBruto[]) ?? [];
const TITULO_FORMULAS = 'As fórmulas desta questão';
const ehMoldeRobo = (q: Questao) => ['O que eu tenho', TITULO_FORMULAS, 'A regra desta questão'].includes(passosDe(q)[0]?.titulo);
function problemasDoMolde(q: Questao): string[] {
  const passos = passosDe(q);
  const titulos = passos.map((p) => p.titulo);
  const erros = ['O que eu tenho', 'Volta na equação', 'Questão parecida? Faça assim']
    .filter((t) => !titulos.includes(t)).map((t) => `sem a tela "${t}"`);
  // Questão sem conta (Biologia, parte de Química): "A regra em palavras" no lugar da equação.
  const regra = passos.find((p) => p.titulo === 'A equação em letras' || p.titulo === 'A regra em palavras');
  if (!regra) erros.push('sem a tela "A equação em letras" (ou "A regra em palavras")');
  const letras = regra?.visual?.linhas?.map((l) => l[0]) ?? [];
  if (letras.length < 2) erros.push('equação sem a tabela das letras');
  for (const l of letras.slice(1)) {
    if (!titulos.some((t) => t.startsWith(`Achando ${l} `) || t.startsWith(`Achando ${l}:`))) erros.push(`a letra ${l} não tem tela "Achando ${l}"`);
  }
  if (!passos.some((p) => p.visual?.tipo === 'diagrama' || p.visual?.tipo === 'formulas')) erros.push('sem desenho: nem fórmulas nem diagrama');
  return erros;
}

function problemasDaQuestao(q: Questao): string[] {
  const erros: string[] = [];
  if (!LETRAS.includes(q.resposta as (typeof LETRAS)[number])) erros.push(`resposta inválida: ${q.resposta}`);
  if (LETRAS.some((l) => !q[l]?.trim())) erros.push('alternativa vazia');
  if (new Set(LETRAS.map((l) => q[l]?.trim())).size !== LETRAS.length) erros.push('alternativas repetidas');
  if (PROIBIDO.test(JSON.stringify(q.explicacao))) erros.push('frase ou símbolo proibido na explicação');
  if (!q.explicacao?.conferencia) erros.push('sem conferencia');
  if (q.explicacao?.seuErro !== null) erros.push('seuErro tem que ser null');
  const valida = validarExplicacao(q.explicacao, q.materia);
  if (!valida) return [...erros, 'o validador recusou a explicação'];
  const passosAntes = (q.explicacao.passos as unknown[] | undefined)?.length ?? 0;
  if (valida.passos.length < passosAntes) erros.push(`o validador cortou ${passosAntes - valida.passos.length} passo(s)`);
  const brutos = (q.explicacao.passos as { visual?: unknown }[]) ?? [];
  brutos.forEach((p, i) => {
    if (p.visual && !valida.passos[i]?.visual) erros.push(`desenho do passo ${i + 1} recusado`);
  });
  if (!brutos[0]?.visual) erros.push('primeiro passo sem desenho');
  const sua = q.explicacao.checagem as { certa?: string; opcoes?: string[] } | null;
  if (!sua?.opcoes?.includes(sua.certa ?? '')) erros.push('"Sua vez" com a certa fora das opções');
  const doMolde = ehMoldeRobo(q) ? problemasDoMolde(q) : problemasDaExplicacao(valida, q.enunciado, q.materia);
  return [...erros, ...textoCortado(q.explicacao), ...doMolde];
}

/* O validador corta texto longo sem avisar (ideia na 2ª frase, passo em 900
   letras): a tela mostraria a explicação pela metade. Limites de lib/tutor/validar.ts. */
const LIMITES = { ideia: 300, frasesIdeia: 2, titulo: 80, passo: 900, termo: 60, significado: 320, pecas: 3, opcao: 60, opcoes: 4 };
function textoCortado(e: Record<string, unknown>): string[] {
  const erros: string[] = [];
  const ideia = String(e.ideia ?? '');
  if (ideia.length > LIMITES.ideia || frases(ideia).length > LIMITES.frasesIdeia) erros.push('ideia longa (até 300 letras e 2 frases)');
  ((e.passos as { titulo?: string; texto?: string }[]) ?? []).forEach((p, i) => {
    if ((p.titulo ?? '').length > LIMITES.titulo) erros.push(`título do passo ${i + 1} longo`);
    if ((p.texto ?? '').length > LIMITES.passo) erros.push(`texto do passo ${i + 1} passa de 900 letras`);
  });
  const pecas = (e.pecas as { termo?: string; significado?: string }[]) ?? [];
  if (pecas.length > LIMITES.pecas) erros.push('mais de 3 peças');
  pecas.forEach((p) => {
    if ((p.termo ?? '').length > LIMITES.termo || (p.significado ?? '').length > LIMITES.significado) erros.push(`peça "${p.termo}" longa`);
  });
  const opcoes = ((e.checagem as { opcoes?: string[] } | null)?.opcoes) ?? [];
  if (opcoes.length > LIMITES.opcoes || opcoes.some((o) => o.length > LIMITES.opcao)) erros.push('opção do "Sua vez" longa ou demais');
  return erros;
}

describe('provas do dia 2', () => {
  const todas = NIVEIS.flatMap((n) => AREAS.flatMap((a) => ler(n, a) ?? []));

  it('ids únicos entre as 4 provas', () => {
    const ids = todas.map((q) => q.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  for (const nivel of NIVEIS) {
    for (const area of AREAS) {
      const questoes = ler(nivel, area);
      describe.skipIf(!questoes)(`${nivel}-${area}`, () => {
        const qs = questoes ?? [];
        it(`tem ${POR_ARQUIVO} questões`, () => expect(qs.length).toBe(POR_ARQUIVO));

        it('cada questão passa na conferência da explicação', () => {
          const ruins = qs.map((q) => [q.id, problemasDaQuestao(q)] as const).filter(([, e]) => e.length > 0);
          expect(ruins.map(([id, e]) => `${id}: ${e.join('; ')}`)).toEqual([]);
        });

        it('só conteúdo que mais cai', () => {
          const fora = qs.filter((q) => !(`${q.materia}|${q.tema}` in COTAS[area])).map((q) => `${q.id}: ${q.materia}|${q.tema}`);
          expect(fora).toEqual([]);
        });

        if (nivel === 'enem') {
          it('real: id do banco e origem', () => {
            expect(qs.filter((q) => !/^c[a-z0-9]{20,}$/.test(q.id) || !/^ENEM 20\d\d · questão \d+$/.test(q.origem ?? '')).map((q) => q.id)).toEqual([]);
          });
          return;
        }

        it('quantas de cada conteúdo', () => {
          const contagem: Record<string, number> = {};
          qs.forEach((q) => { contagem[`${q.materia}|${q.tema}`] = (contagem[`${q.materia}|${q.tema}`] ?? 0) + 1; });
          expect(contagem).toEqual(COTAS[area]);
        });

        it('id no padrão do arquivo', () => {
          const prefixo = `d2-${nivel}-${area === 'matematica' ? 'mat' : 'nat'}-`;
          expect(qs.filter((q) => !q.id.startsWith(prefixo)).map((q) => q.id)).toEqual([]);
        });

        it('letra certa espalhada', () => {
          const porLetra = LETRAS.map((l) => qs.filter((q) => q.resposta === l).length);
          expect(porLetra.every((n) => n >= MIN_POR_LETRA && n <= MAX_POR_LETRA), `A–E: ${porLetra.join(', ')}`).toBe(true);
        });

        it('não pede figura que não existe', () => {
          expect(qs.filter((q) => PEDE_FIGURA.test(q.enunciado)).map((q) => q.id)).toEqual([]);
        });
      });
    }
  }
});

/* Nível acima (Pablo, 17/11/2026: "um nível a mais, banca difícil, para o ENEM ficar
   leve"): 2 por conteúdo, todas no jeito do robô. */
const POR_CONTEUDO_ACIMA = 2;
describe('nível acima do dia 2', () => {
  for (const area of AREAS) {
    const questoes = ler('acima', area);
    describe.skipIf(!questoes)(`acima-${area}`, () => {
      const qs = questoes ?? [];
      it('2 de cada conteúdo que mais cai', () => {
        const contagem: Record<string, number> = {};
        qs.forEach((q) => { contagem[`${q.materia}|${q.tema}`] = (contagem[`${q.materia}|${q.tema}`] ?? 0) + 1; });
        expect(contagem).toEqual(Object.fromEntries(Object.keys(COTAS[area]).map((k) => [k, POR_CONTEUDO_ACIMA])));
      });
      it('cada questão no jeito do robô e conferida', () => {
        const ruins = qs.map((q) => [q.id, ehMoldeRobo(q) ? problemasDaQuestao(q) : ['fora do jeito do robô']] as const).filter(([, e]) => e.length > 0);
        expect(ruins.map(([id, e]) => `${id}: ${e.join('; ')}`)).toEqual([]);
      });
      it('id no padrão, letra certa espalhada e sem figura inexistente', () => {
        expect(qs.filter((q) => !q.id.startsWith(`d2-acima-${area === 'matematica' ? 'mat' : 'nat'}-`)).map((q) => q.id)).toEqual([]);
        const porLetra = LETRAS.map((l) => qs.filter((q) => q.resposta === l).length);
        expect(Math.max(...porLetra) - Math.min(...porLetra)).toBeLessThanOrEqual(2);
        expect(qs.filter((q) => PEDE_FIGURA.test(q.enunciado)).map((q) => q.id)).toEqual([]);
      });
    });
  }
});

/* Questões que completam as provas em escada (Pablo, 17/11/2026): uma por arquivo de
   matéria em data/revisao-final/escada, cada uma com o degrau em `nivel`. Mesma
   conferência das provas, sempre no jeito do robô. */
const PASTA_ESCADA = join(process.cwd(), 'data/revisao-final/escada');
const NIVEIS_ESCADA = ['facil', 'medio', 'dificil', 'acima'];
describe('questões das provas em escada', () => {
  const arquivos = existsSync(PASTA_ESCADA) ? readdirSync(PASTA_ESCADA).filter((f) => f.endsWith('.json')) : [];
  const todas = arquivos.flatMap((f) => JSON.parse(readFileSync(join(PASTA_ESCADA, f), 'utf8')) as (Questao & { nivel?: string })[]);
  it('ids únicos no padrão d2-escada-', () => {
    const ids = todas.map((q) => q.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i || !id.startsWith('d2-escada-'))).toEqual([]);
  });
  it('cada questão no jeito do robô e conferida', () => {
    const ruins = todas.map((q) => [q.id, ehMoldeRobo(q) ? problemasDaQuestao(q) : ['fora do jeito do robô']] as const).filter(([, e]) => e.length > 0);
    expect(ruins.map(([id, e]) => `${id}: ${e.join('; ')}`)).toEqual([]);
  });
  it('degrau válido, tema da escada e sem figura inexistente', () => {
    const temas = new Set(ESCADAS.flatMap((e) => e.degraus.map((d) => `${e.materia}|${d.tema}`)));
    expect(todas.filter((q) => !NIVEIS_ESCADA.includes(q.nivel ?? '') || !temas.has(`${q.materia}|${q.tema}`)).map((q) => q.id)).toEqual([]);
    expect(todas.filter((q) => PEDE_FIGURA.test(q.enunciado)).map((q) => q.id)).toEqual([]);
  });
});

/* Questões de reforço (Pablo, 12/11/2026): errou na prova, a próxima é uma
   parecida do mesmo conteúdo, estilo ENEM (nunca "ENEM real"). Mesma
   conferência das provas e uma figura em pixel no 1º passo. */
describe('reforço do dia 2', () => {
  const arquivos = readdirSync(PASTA).filter((f) => f.startsWith('reforco-') && f.endsWith('.json'));
  it('ids únicos entre todos os arquivos de reforço', () => {
    const ids = arquivos.flatMap((f) => (JSON.parse(readFileSync(join(PASTA, f), 'utf8')) as Questao[]).map((q) => q.id));
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
  for (const arquivo of arquivos) {
    const qs = JSON.parse(readFileSync(join(PASTA, arquivo), 'utf8')) as Questao[];
    describe(arquivo, () => {
      it('cada questão passa na conferência da explicação', () => {
        const ruins = qs.map((q) => [q.id, problemasDaQuestao(q)] as const).filter(([, e]) => e.length > 0);
        expect(ruins.map(([id, e]) => `${id}: ${e.join('; ')}`)).toEqual([]);
      });
      it('toda questão abre com figura em pixel e é do reforço', () => {
        const sem = qs.filter((q) => (q.explicacao.passos as { visual?: { tipo?: string } }[])[0]?.visual?.tipo !== 'figura' || q.origem !== 'Reforço do dia 2');
        expect(sem.map((q) => q.id)).toEqual([]);
      });
      it('ids únicos no padrão d2-reforco-', () => {
        expect(qs.filter((q) => !q.id.startsWith('d2-reforco-')).map((q) => q.id)).toEqual([]);
        expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
      });
      it('não pede figura que não existe no enunciado', () => {
        expect(qs.filter((q) => PEDE_FIGURA.test(q.enunciado)).map((q) => q.id)).toEqual([]);
      });
    });
  }
});

/* Banco ENEM do dia 2 (Pablo, 13/11/2026: "umas 20 nível ENEM para cada conteúdo,
   guardadinho no banco"): um arquivo por conteúdo em data/revisao-final/banco-enem,
   mesma conferência do reforço, origem própria para não entrar em prova nem reforço. */
const PASTA_BANCO = join(__dirname, 'banco-enem');
describe('banco ENEM do dia 2', () => {
  const arquivos = existsSync(PASTA_BANCO) ? readdirSync(PASTA_BANCO).filter((f) => f.endsWith('.json')) : [];
  const todas = arquivos.flatMap((f) => JSON.parse(readFileSync(join(PASTA_BANCO, f), 'utf8')) as Questao[]);
  it('ids únicos no padrão d2-banco-', () => {
    const ids = todas.map((q) => q.id);
    expect(ids.filter((id) => !id.startsWith('d2-banco-'))).toEqual([]);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
  for (const arquivo of arquivos) {
    const qs = JSON.parse(readFileSync(join(PASTA_BANCO, arquivo), 'utf8')) as Questao[];
    const noMolde = qs.filter((q) => !ehMoldeRobo(q));
    describe(arquivo, () => {
      it('cada questão passa na conferência da explicação', () => {
        const ruins = qs.map((q) => [q.id, problemasDaQuestao(q)] as const).filter(([, e]) => e.length > 0);
        expect(ruins.map(([id, e]) => `${id}: ${e.join('; ')}`)).toEqual([]);
      });
      it('abre com figura em pixel, é do banco e é de um tema só', () => {
        const sem = noMolde.filter((q) => (q.explicacao.passos as { visual?: { tipo?: string } }[])[0]?.visual?.tipo !== 'figura' || q.origem !== 'Banco ENEM do dia 2');
        expect(sem.map((q) => q.id)).toEqual([]);
        expect(new Set(qs.map((q) => q.tema)).size).toBe(1);
      });
      it('letra certa espalhada e sem figura inexistente', () => {
        const porLetra = LETRAS.map((l) => qs.filter((q) => q.resposta === l).length);
        expect(Math.max(...porLetra) - Math.min(...porLetra)).toBeLessThanOrEqual(3);
        expect(qs.filter((q) => PEDE_FIGURA.test(q.enunciado)).map((q) => q.id)).toEqual([]);
      });
    });
  }
});
