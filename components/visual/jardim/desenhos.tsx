'use client';
import { useId } from 'react';
import { ARTES, desenhoDaPlanta, type EstagioDaPlanta, type NomeDaArte } from '@/lib/jardim/artes';

/* Os textos SVG são constantes de lib/jardim/artes.ts, nunca dado do usuário. */

export function ArteJardim({ nome, className }: { nome: NomeDaArte; className?: string }) {
  const id = `jv-arte-${useId().replace(/:/g, '')}`;
  const [alto, baixo, desenho] = ARTES[nome];
  const html = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${alto}"/><stop offset="1" stop-color="${baixo}"/></linearGradient></defs><rect width="400" height="200" fill="url(#${id})"/>${desenho}`;
  return (
    <svg
      className={`jv-arte ${className ?? ''}`}
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Planta({ estagio, className, atraso }: { estagio: EstagioDaPlanta; className?: string; atraso?: number }) {
  return (
    <svg
      className={`jv-planta ${className ?? ''}`}
      style={atraso === undefined ? undefined : { animationDelay: `${atraso}ms` }}
      viewBox="0 0 60 60"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: desenhoDaPlanta(estagio) }}
    />
  );
}
