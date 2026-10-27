// A correção de redação não troca de modelo e grava quem corrigiu dentro do
// JSON da avaliação (sem mudar o schema). Pablo, 27/10/2026.

import { describe, expect, test } from 'vitest';
import { opcoesCorrecaoCompleta, PRAZOS_CORRECAO } from '@/lib/redacao/prompts';
import { corrigirRedacao, ERRO_CORRECAO_IA } from '@/lib/redacao/correcao';
import { lerCorrecao } from '@/components/redacao/correcao-completa';
import { REDACAO, evidencia1000 } from './fixtures';

const MAX_DURATION_ROTA_MS = 120_000;

describe('correção de redação sem reserva', () => {
  test('as opções da correção completa pedem semReserva', () => {
    expect(opcoesCorrecaoCompleta().semReserva).toBe(true);
  });
  test('o prazo da IA cabe nos 120 s da rota, com folga para gravar', () => {
    expect(PRAZOS_CORRECAO.timeoutMs).toBeLessThanOrEqual(PRAZOS_CORRECAO.prazoMs);
    expect(PRAZOS_CORRECAO.prazoMs).toBeLessThan(MAX_DURATION_ROTA_MS);
  });
  test('falhou, a mensagem é a combinada', () => {
    expect(ERRO_CORRECAO_IA).toBe('Tente de novo em 1 minuto.');
  });
});

describe('modelo gravado na avaliação', () => {
  test('o modelo vai dentro do JSON e volta ao ler a correção', () => {
    const correcao = { ...corrigirRedacao(evidencia1000(), REDACAO)!, corrigidaPor: 'gemini:gemini-3-flash-preview' };
    const lida = lerCorrecao(JSON.stringify(correcao));
    expect(lida?.corrigidaPor).toBe('gemini:gemini-3-flash-preview');
    expect(lida?.total).toBe(1000);
  });
  test('correção antiga, sem o campo, continua sendo lida', () => {
    const antiga = corrigirRedacao(evidencia1000(), REDACAO)!;
    expect(lerCorrecao(JSON.stringify(antiga))?.corrigidaPor).toBeUndefined();
  });
});
