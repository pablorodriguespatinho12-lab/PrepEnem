/* Aba Descobrir (Pablo, 17/11/2026): aulas no jeito do canal Universo Narrado, de onde
   vem a equação. Molde aprovado: docs/descobrir/amostra-velocidade-media.html.
   Uma tela por passo, sem rolar, no máximo 1 frase; a equação se transforma na tela,
   uma tela por letra, e no fim "Prove você" (ele escolhe o que fazer dos dois lados). */
import type { ReactNode } from 'react';

export interface PassoDaAula {
  nome: string;
  /** Uma frase só (pode ficar vazia). */
  frase: string;
  /** Lado da equação ou da tabela. */
  esquerda: ReactNode;
  /** Lado do desenho; sem ele, a esquerda ocupa a largura toda. */
  direita?: ReactNode;
}

/** Uma etapa do "Prove você": a pergunta, os botões e a linha que aparece no acerto. */
export interface EtapaDaProva {
  pede: string;
  opcoes: string[];
  certa: number;
  /** O que acontece com cada escolha errada (a da certa fica vazia). */
  erros: string[];
  linha: ReactNode;
}

export interface ProveVoce {
  /** A linha de partida, que já está na tela. */
  inicio: ReactNode;
  etapas: EtapaDaProva[];
  /** Frase de quando termina. */
  provado: string;
  /** Desenho que aparece no fim (a mesma figura da aula). */
  desenho?: ReactNode;
}

export interface Aula {
  id: string;
  titulo: string;
  passos: PassoDaAula[];
  prova: ProveVoce;
  /** Prova da escada que treina este conteúdo, pelo nome (lib/prova-da-escada.ts). */
  treino: string[];
}
