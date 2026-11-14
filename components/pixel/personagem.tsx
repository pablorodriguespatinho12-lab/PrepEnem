'use client';
import { useEffect, useState } from 'react';
import { QUADRO_H, QUADRO_W, QUADROS, desenharPersonagem, tipoDaMateria } from '@/lib/pixel/personagem';
import { imagemPixel } from './imagem-pixel';

/* Personagem da matéria em pé em cima do cartão da questão (Pablo, 14/11/2026).
   Parado, respira e pisca; acertou, pula; errou, coça a cabeça. Do lado do cartão
   não cabia: na tela dele sobram ~45 px de cada lado. CSS em globals.css (.px-boneco). */

export type Reacao = 'acerto' | 'erro' | null;

export function Personagem({ materia, reacao, animado }: { materia: string | null | undefined; reacao: Reacao; animado: boolean }) {
  const tipo = tipoDaMateria(materia);
  const [url, setUrl] = useState('');
  useEffect(() => setUrl(imagemPixel(`boneco-${tipo}`, QUADRO_W * QUADROS, QUADRO_H, (c) => desenharPersonagem(c, tipo))), [tipo]);
  if (!url) return null;
  return (
    <div
      aria-hidden
      className="px-boneco"
      data-tipo={tipo}
      data-reacao={reacao ?? 'nenhuma'}
      data-animado={animado ? 'sim' : 'nao'}
      style={{ backgroundImage: `url(${url})`, aspectRatio: `${QUADRO_W} / ${QUADRO_H}` }}
    />
  );
}
