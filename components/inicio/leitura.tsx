'use client';
import { useState } from 'react';
import { useLeitura } from '@/hooks/use-leitura';
import { AdicionarLivro, LivrosDaLeitura } from '@/components/livros-da-leitura';

/* Bloco Leitura: a meta de páginas em número grande; os livros abrem no botão. */
export function BlocoLeitura() {
  const leitura = useLeitura();
  const [aberto, setAberto] = useState(false);
  return (
    <section aria-labelledby="leitura" className="m-cartao m-col4">
      <h2 id="leitura">Leitura</h2>
      <div className="m-numero px" data-numeric>{leitura.meta ?? '–'}</div>
      <p className="m-mut">páginas para hoje</p>
      <button type="button" className="m-sec" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
        {aberto ? 'Fechar' : 'Marcar página'}
      </button>
      {aberto && (
        <div className="mt-4">
          <LivrosDaLeitura livros={leitura.livros} paginas={leitura.paginas} mudarPagina={leitura.mudarPagina} tirarLivro={leitura.tirarLivro} />
          <AdicionarLivro adicionar={leitura.adicionarLivro} />
        </div>
      )}
    </section>
  );
}
