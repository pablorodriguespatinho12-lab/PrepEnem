import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import aulas from './dia-2/aulas.json';

// Macete curinga por conteúdo (Pablo, 14/11/2026): um macete que serve da fácil ao ENEM,
// e o Jeito rápido de cada questão aplicando ele. Vai entrando por matéria (Química primeiro).
const COM_MACETE = [
  'Química Orgânica', 'Química Ambiental e Energia', 'Estequiometria', 'Eletroquímica', 'Soluções, pH e Titulação',
  'Eletricidade e Circuitos', 'Dinâmica e Leis de Newton', 'Termodinâmica e Calor', 'Ondas e Acústica', 'Óptica',
  'Ecologia', 'Fisiologia Humana e Saúde', 'Genética', 'Citologia', 'Evolução', 'Microbiologia e Doenças',
  'Aritmética e Porcentagem', 'Estatística', 'Funções', 'Grandezas e Medidas', 'Geometria Plana', 'Geometria Espacial',
];
type Macete = { nome: string; regra: string; passos: string[]; exemplo: string };
const A = aulas as unknown as Record<string, { macete?: Macete }>;

describe('macete curinga', () => {
  it('cada conteúdo pronto tem macete curto, sem rolar a tela', () => {
    for (const tema of COM_MACETE) {
      const m = A[tema].macete;
      expect(m, tema).toBeDefined();
      expect(m!.regra.length, tema).toBeLessThanOrEqual(170);
      expect(m!.passos.length, tema).toBeLessThanOrEqual(4);
      expect(m!.passos.every((p) => p.length <= 170), tema).toBe(true);
      expect(m!.exemplo.length, tema).toBeLessThanOrEqual(170);
    }
  });

  it('o Jeito rápido de toda questão desses conteúdos aplica o macete', () => {
    const pasta = join(__dirname, 'dia-2');
    const arquivos = readdirSync(pasta).filter((f) => /^(facil|medio|dificil|enem)-(natureza|matematica)\.json$/.test(f));
    let conferidas = 0;
    for (const f of arquivos) {
      const qs = JSON.parse(readFileSync(join(pasta, f), 'utf8')) as { id: string; tema: string; explicacao: { passos: { titulo: string; texto: string }[] } }[];
      for (const q of qs.filter((x) => COM_MACETE.includes(x.tema))) {
        const jr = q.explicacao.passos.find((p) => p.titulo === 'Jeito rápido');
        expect(jr?.texto.startsWith('Macete de'), q.id).toBe(true);
        expect(jr!.texto.split('\n').every((l) => l.length <= 170), q.id).toBe(true);
        conferidas++;
      }
    }
    expect(conferidas).toBeGreaterThanOrEqual(20);
  });

  it('o banco ENEM também aplica o macete em todo Jeito rápido', () => {
    const pasta = join(__dirname, 'banco-enem');
    let conferidas = 0;
    for (const f of readdirSync(pasta).filter((x) => x.endsWith('.json'))) {
      const qs = JSON.parse(readFileSync(join(pasta, f), 'utf8')) as { id: string; explicacao: { passos: { titulo: string; texto: string }[] } }[];
      for (const q of qs) {
        const jr = q.explicacao.passos.find((p) => p.titulo === 'Jeito rápido');
        expect(jr?.texto.startsWith('Macete de'), q.id).toBe(true);
        expect(jr!.texto.split('\n').every((l) => l.length <= 170), q.id).toBe(true);
        conferidas++;
      }
    }
    expect(conferidas).toBeGreaterThanOrEqual(240);
  });
});
