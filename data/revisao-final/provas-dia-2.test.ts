import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { frases, validarExplicacao } from '@/lib/tutor/validar';
import { problemasDaExplicacao } from '@/lib/tutor/pronta';

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
  return [...erros, ...textoCortado(q.explicacao), ...problemasDaExplicacao(valida, q.enunciado, q.materia)];
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
