import type { Pincel } from '@/lib/pixel/desenho';

/* Desenha uma vez numa grade pequena e devolve a imagem (data URL) para usar
   como fundo CSS com image-rendering: pixelated. Guarda por chave: trocar de
   tela e voltar não redesenha. */
const guardadas = new Map<string, string>();

export function imagemPixel(chave: string, W: number, H: number, desenhar: (c: Pincel) => void): string {
  const pronta = guardadas.get(chave);
  if (pronta) return pronta;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, W);
  canvas.height = Math.max(1, H);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  desenhar(ctx);
  const url = canvas.toDataURL('image/png');
  guardadas.set(chave, url);
  return url;
}

/** Tamanho do pixel na tela: 4 px no celular, 5 no computador. */
export function tamanhoDoPixel(): number {
  return window.innerWidth < 640 ? 4 : 5;
}
