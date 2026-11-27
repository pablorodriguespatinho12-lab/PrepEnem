/* Sobe o build local numa porta própria, com banco inexistente e sem chaves de
   IA ou de armazenamento. Variável já definida vence o arquivo de ambiente. */
import { spawn } from 'node:child_process';

import { AMBIENTE, PORTA } from '../ambiente.mjs';

export const BASE = AMBIENTE.NEXTAUTH_URL;
export const SEGREDO = AMBIENTE.NEXTAUTH_SECRET;

export default async function subir() {
  const ocupada = await fetch(BASE).then(() => true, () => false);
  if (ocupada) throw new Error(`A porta ${PORTA} já está em uso: encerre o servidor antigo antes.`);
  const filho = spawn('node_modules/.bin/next', ['start', '-p', String(PORTA)], {
    env: { ...process.env, ...AMBIENTE, NODE_ENV: 'production' },
    stdio: 'ignore',
    detached: true,
  });
  const encerrar = () => { try { process.kill(-filho.pid!); } catch { /* já saiu */ } };
  for (let i = 0; i < 60; i += 1) {
    if (await fetch(`${BASE}/login`).then((r) => r.ok, () => false)) return async () => encerrar();
    await new Promise((r) => setTimeout(r, 500));
  }
  encerrar();
  throw new Error('O servidor local não subiu em 30 s. Rode o build antes.');
}
