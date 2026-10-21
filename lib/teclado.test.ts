import { describe, expect, test, vi } from 'vitest';
import type { KeyboardEvent } from 'react';
import { abrirComTeclado } from './teclado';
const tecla = (key: string) => ({ key, preventDefault: vi.fn() }) as unknown as KeyboardEvent;
describe('abrirComTeclado', () => {
  test('Enter e Espaço abrem e não rolam a página', () => {
    for (const key of ['Enter', ' ']) {
      const abrir = vi.fn();
      const e = tecla(key);
      abrirComTeclado(e, abrir);
      expect(abrir).toHaveBeenCalledOnce();
      expect(e.preventDefault).toHaveBeenCalled();
    }
  });
  test('outra tecla não faz nada (Tab segue para o próximo)', () => {
    const abrir = vi.fn();
    const e = tecla('Tab');
    abrirComTeclado(e, abrir);
    expect(abrir).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});
