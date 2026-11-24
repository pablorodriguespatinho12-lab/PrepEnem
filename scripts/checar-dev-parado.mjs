// Trava do `npm run build`: dev e build escrevem na mesma pasta `.next`. Build com o servidor de
// teste ligado apaga os arquivos dele e a página fica em branco (24/11/2026; antes: 28/10/2026).
// Na Vercel (VERCEL=1) não há servidor de teste, então passa direto.
import { execSync } from 'node:child_process';

if (process.env.VERCEL) process.exit(0);

const PORTAS = [3000, 3123];
let achou = '';
for (const porta of PORTAS) {
  try {
    const saida = execSync(`ss -ltnp 2>/dev/null | grep ':${porta} '`, { encoding: 'utf8' });
    if (saida.trim()) achou += `porta ${porta}: ${saida.trim()}\n`;
  } catch {
    // grep sem resultado = porta livre
  }
}

if (achou) {
  console.error(`\nBUILD BARRADO: há servidor de teste ligado (usa a mesma pasta .next).\n${achou}`);
  console.error('Encerre pelo PID (kill <PID>), rode o build e depois suba `npm run dev` de novo.');
  console.error('Para ignorar de propósito: SEM_TRAVA_DEV=1 npm run build\n');
  process.exit(process.env.SEM_TRAVA_DEV ? 0 : 1);
}
