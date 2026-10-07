// Exercício de desenhar o gráfico (pedido do Pablo, 06/10/2026): ele risca os
// eixos e a reta à mão, o app endireita cada traço e confere contra a função.
// Tudo em unidades do quadriculado (1 = um quadradinho). A conferência é conta,
// não IA: rápida e sempre a mesma resposta para o mesmo desenho.

export interface Ponto { x: number; y: number }

export type TipoTraco = 'eixoX' | 'eixoY' | 'reta' | 'rabisco';

export interface TracoAjustado { tipo: TipoTraco; de: Ponto; ate: Ponto }

export interface Conferencia { certo: boolean; falta: string[] }

/* Menor traço que conta como risco (toque solto não vira nada). */
const MIN_COMPRIMENTO = 0.6;
/* Desvio máximo do traço em relação à reta ajustada, como fração do comprimento. */
const MAX_CURVATURA = 0.12;
/* Até 10° de inclinação ainda é eixo deitado/em pé. */
const SENO_EIXO = Math.sin((10 * Math.PI) / 180);
/* Eixo precisa passar a até meio quadradinho do zero. */
const TOL_EIXO = 0.5;
/* Erro aceito na reta: um terço de quadradinho, medido nas pontas. */
const TOL_RETA = 0.35;
/* Reta curta demais não dá para conferir a inclinação. */
const MIN_LARGURA_RETA = 2;

const br = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',').replace('-', '−');

/* Ajuste por mínimos quadrados totais (direção principal dos pontos). */
export function ajustarTraco(pontos: readonly Ponto[]): TracoAjustado | null {
  if (pontos.length < 2) return null;
  const n = pontos.length;
  const cx = pontos.reduce((s, p) => s + p.x, 0) / n;
  const cy = pontos.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of pontos) {
    sxx += (p.x - cx) ** 2; syy += (p.y - cy) ** 2; sxy += (p.x - cx) * (p.y - cy);
  }
  const angulo = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const ux = Math.cos(angulo), uy = Math.sin(angulo);
  const ts = pontos.map((p) => (p.x - cx) * ux + (p.y - cy) * uy);
  const tMin = Math.min(...ts), tMax = Math.max(...ts);
  const comprimento = tMax - tMin;
  if (comprimento < MIN_COMPRIMENTO) return null;

  const desvio = Math.max(...pontos.map((p) => Math.abs(-(p.x - cx) * uy + (p.y - cy) * ux)));
  const a = { x: cx + ux * tMin, y: cy + uy * tMin };
  const b = { x: cx + ux * tMax, y: cy + uy * tMax };
  const [de, ate] = a.x <= b.x ? [a, b] : [b, a];
  if (desvio / comprimento > MAX_CURVATURA) return { tipo: 'rabisco', de, ate };

  if (Math.abs(uy) < SENO_EIXO && Math.abs(cy) <= TOL_EIXO) {
    return { tipo: 'eixoX', de: { x: de.x, y: 0 }, ate: { x: ate.x, y: 0 } };
  }
  if (Math.abs(ux) < SENO_EIXO && Math.abs(cx) <= TOL_EIXO) {
    const [baixo, cima] = a.y <= b.y ? [a, b] : [b, a];
    return { tipo: 'eixoY', de: { x: 0, y: baixo.y }, ate: { x: 0, y: cima.y } };
  }
  return { tipo: 'reta', de, ate };
}

function conferirReta(r: TracoAjustado, alvo: { a: number; b: number }): string[] {
  const largura = r.ate.x - r.de.x;
  if (largura < 1e-6 || Math.abs((r.ate.y - r.de.y) / largura) > 50) {
    return ['A reta não pode ficar em pé: num gráfico de função, cada x tem um y só.'];
  }
  if (largura < MIN_LARGURA_RETA) {
    return [`Faça a reta mais comprida (pelo menos ${MIN_LARGURA_RETA} quadradinhos de largura), para dar para conferir.`];
  }
  const m = (r.ate.y - r.de.y) / largura;
  const c = r.de.y - m * r.de.x;
  const erro = Math.max(...[r.de.x, r.ate.x].map((x) => Math.abs(m * x + c - (alvo.a * x + alvo.b))));
  if (erro <= TOL_RETA) return [];

  if (alvo.a !== 0 && Math.sign(m) !== Math.sign(alvo.a)) {
    return [alvo.a > 0
      ? `A reta tem de subir da esquerda para a direita: o número na frente do x (${br(alvo.a)}) é positivo.`
      : `A reta tem de descer da esquerda para a direita: o número na frente do x (${br(alvo.a)}) é negativo.`];
  }
  const falta: string[] = [];
  if (Math.abs(m - alvo.a) > TOL_RETA / 2) {
    const verbo = alvo.a >= 0 ? 'sobe' : 'desce';
    falta.push(`Inclinação: a cada 1 quadradinho para a direita, a reta ${verbo} ${br(Math.abs(alvo.a))}.`);
  }
  if (Math.abs(c - alvo.b) > TOL_RETA) {
    falta.push(`A reta tem de cortar o eixo y em y = ${br(alvo.b)} (é o valor de f(0)).`);
  }
  return falta.length ? falta : ['A reta passou perto, mas não em cima: confira dois pontos da tabela.'];
}

export function conferirDesenho(tracos: readonly TracoAjustado[], alvo: { a: number; b: number }): Conferencia {
  const falta: string[] = [];
  if (!tracos.some((t) => t.tipo === 'eixoX')) falta.push('Falta o eixo x: uma linha deitada passando pelo 0.');
  if (!tracos.some((t) => t.tipo === 'eixoY')) falta.push('Falta o eixo y: uma linha em pé passando pelo 0.');
  const retas = tracos.filter((t) => t.tipo === 'reta');
  if (retas.length === 0) {
    falta.push(tracos.some((t) => t.tipo === 'rabisco')
      ? 'O traço da reta saiu curvo: apague e risque de novo, num movimento só.'
      : 'Falta a reta da função.');
  } else {
    falta.push(...conferirReta(retas[retas.length - 1], alvo));
  }
  return { certo: falta.length === 0, falta };
}
