/* Explosão de folhas do botão amarelo e do acerto (prévia "Jardim vivo").
   Só no modo Jardim e com o mundo animado ligado. Animação por transform e
   opacity; cada folha sai do DOM ao terminar. */
const CORES = ['#3f8f4f', '#68ad5c', '#f2c94c'];
const QUANTAS = 22;
const DURACAO = 900;

function animacaoDesligada(): boolean {
  try {
    return localStorage.getItem('prepenem:mundo-animado') === 'nao';
  } catch {
    return false;
  }
}

export function soltarFolhas(x: number, y: number): void {
  if (!document.documentElement.hasAttribute('data-jardim') || animacaoDesligada()) return;
  for (let i = 0; i < QUANTAS; i++) {
    const folha = document.createElement('i');
    folha.className = 'jv-folha';
    folha.setAttribute('aria-hidden', 'true');
    folha.style.cssText = `left:${x}px;top:${y}px;background:${CORES[i % CORES.length]}`;
    document.body.append(folha);
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 50 + Math.random() * 110;
    const voo = folha.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translate(${Math.cos(angulo) * distancia}px, ${Math.sin(angulo) * distancia + 60}px) rotate(${Math.random() * 600}deg)`, opacity: 0 },
      ],
      { duration: DURACAO, easing: 'cubic-bezier(.1,.7,.4,1)' },
    );
    voo.onfinish = () => folha.remove();
  }
}

/* Do centro do elemento clicado (funciona também pelo teclado). */
export function soltarFolhasDe(alvo: Element): void {
  const r = alvo.getBoundingClientRect();
  soltarFolhas(r.left + r.width / 2, r.top + r.height / 2);
}
