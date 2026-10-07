// Ordem das opções de cada passo: embaralhada, mas sempre igual para o mesmo
// passo (nos dados a certa vem primeiro; na tela não pode vir sempre primeiro).
export function ordemFixa(n: number, semente: number): number[] {
  const ordem = Array.from({ length: n }, (_, i) => i);
  let s = semente;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  return ordem;
}
export const sementeDoPasso = (q: { numero: number; ano: number }, passo: number) => q.numero * 31 + passo * 7 + q.ano;
