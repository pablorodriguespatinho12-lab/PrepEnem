'use client';
// Vitrine dos desenhos do tutor (components/visual). Serve para conferir os
// cinco tipos nos dois modos sem depender da IA responder.

import { VisualDesenho } from '@/components/visual/visual-desenho';
import { validarVisual, type Visual } from '@/lib/visual/especificacao';
import MathText from '@/components/math-text';

const EXEMPLOS: { nome: string; bruto: unknown }[] = [
  {
    nome: 'Gráfico: raízes de uma parábola',
    bruto: {
      tipo: 'grafico', titulo: 'f(x) = x² − 4',
      funcoes: [{ expr: 'x^2 - 4', rotulo: 'f(x)', cor: 'a' }, { expr: '2x - 1', rotulo: 'g(x)', cor: 'c' }],
      pontos: [{ x: -2, y: 0, rotulo: 'raiz', cor: 'b' }, { x: 2, y: 0, rotulo: 'raiz', cor: 'b' }, { x: 0, y: -4, rotulo: 'vértice', cor: 'b' }],
      x: [-4, 4], y: [-6, 8],
    },
  },
  {
    nome: 'Gráfico: assíntota (1/x) com faixa automática',
    bruto: { tipo: 'grafico', funcoes: [{ expr: '1/x', rotulo: 'y = 1/x' }], x: [-5, 5] },
  },
  {
    nome: 'Reta numérica: inequação',
    bruto: {
      tipo: 'reta', titulo: '2x − 4 ≥ 0', de: -2, ate: 6,
      trechos: [{ de: 2, ate: 6, rotulo: 'x ≥ 2', fechadoDe: true, fechadoAte: false, cor: 'a' }],
      marcas: [{ x: 2, rotulo: 'fronteira', cor: 'b' }],
    },
  },
  {
    nome: 'Transformação: de onde vem Bhaskara',
    bruto: {
      tipo: 'transformacao',
      linhas: [
        { latex: 'ax^2+bx+c=0', porque: 'ponto de partida' },
        { latex: 'x^2+\\frac{b}{a}x=-\\frac{c}{a}', porque: 'divide tudo por a' },
        { latex: '\\left(x+\\frac{b}{2a}\\right)^2=\\frac{b^2-4ac}{4a^2}', porque: 'completa o quadrado' },
        { latex: 'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}', porque: 'tira a raiz dos dois lados' },
      ],
    },
  },
  {
    nome: 'Tabela: proporção do mol',
    bruto: { tipo: 'tabela', cabecalho: ['n (mol)', 'massa de H₂O (g)', 'moléculas'], linhas: [['1', '18', '$6\\cdot10^{23}$'], ['2', '36', '$12\\cdot10^{23}$']] },
  },
  {
    nome: 'Vetores: forças num bloco',
    bruto: {
      tipo: 'vetores',
      vetores: [
        { de: [0, 0], para: [3, 0], rotulo: 'F₁ = 30 N', cor: 'a' },
        { de: [0, 0], para: [-1.5, 0], rotulo: 'atrito', cor: 'erro' },
        { de: [0, 0], para: [0, -2], rotulo: 'peso', cor: 'c' },
      ],
      pontos: [{ x: 0, y: 0, rotulo: 'bloco' }],
    },
  },
  {
    nome: 'Processo: fotossíntese (animado)',
    bruto: {
      tipo: 'processo', titulo: 'Fotossíntese',
      etapas: [
        { nome: 'Fase clara', entra: ['luz', 'H₂O'], sai: ['O₂'] },
        { nome: 'Fase escura', entra: ['CO₂'], sai: ['glicose'] },
      ],
      ligacoes: [{ de: 0, para: 1, leva: 'ATP e NADPH' }],
    },
  },
];

export function SecaoVisual() {
  const exemplos = EXEMPLOS.map((e) => ({ nome: e.nome, visual: validarVisual(e.bruto) }))
    .filter((e): e is { nome: string; visual: Visual } => e.visual !== null);
  return (
    <section id="visual" aria-labelledby="visual-titulo" className="scroll-mt-8">
      <header className="mb-8 border-b border-border pb-5">
        <p className="type-caption text-muted-foreground">Seção 06</p>
        <h2 id="visual-titulo" className="type-headline mt-1">Desenhos do tutor</h2>
        <p className="type-meta measure-reading mt-3 text-muted-foreground">
          A IA descreve, o app desenha. Rótulo dentro do desenho, junto da parte que nomeia; a cor do traço é a mesma do termo no texto.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {exemplos.map((e) => (
          <div key={e.nome}>
            <p className="type-caption mb-2 text-muted-foreground">{e.nome}</p>
            <VisualDesenho visual={e.visual} />
          </div>
        ))}
        <div>
          <p className="type-caption mb-2 text-muted-foreground">Texto ligado ao desenho</p>
          <MathText className="font-reading" text="As [[b:raízes]] são onde [[a:f(x)]] corta o eixo x: $x = \pm 2$." />
        </div>
      </div>
    </section>
  );
}
