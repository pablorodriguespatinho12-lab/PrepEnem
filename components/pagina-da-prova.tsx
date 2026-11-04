'use client';
// A página escaneada da prova traz outras questões em volta da sua (84 a 87
// em torno da 86) e enchia a tela de coisa que não é para ler agora (Pablo,
// 06/10/2026: "está muito poluído"). Ela só abre sozinha quando a questão
// depende da imagem; nas outras, o texto já está em cima e a página fica
// atrás de um clique.

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, FileText } from 'lucide-react';

const PdfPageViewer = dynamic(() => import('@/components/pdf-page-viewer'), { ssr: false });

interface PaginaDaProvaProps {
  pdfUrl: string;
  pagina: number;
  imagemUrl?: string | null;
  imagemUrlExpandida?: string | null;
  precisaDaImagem: boolean;
  className?: string;
}

export function PaginaDaProva({ pdfUrl, pagina, imagemUrl, imagemUrlExpandida, precisaDaImagem, className = '' }: PaginaDaProvaProps) {
  const [aberta, setAberta] = useState(precisaDaImagem);

  if (aberta) {
    return (
      <figure className={className}>
        <PdfPageViewer pdfUrl={pdfUrl} pageNumber={pagina} imagemUrl={imagemUrl} imagemUrlExpandida={imagemUrlExpandida} abrirAmpliada={precisaDaImagem} />
        {!precisaDaImagem && (
          <button type="button" onClick={() => setAberta(false)} className="mt-2 inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
            <ChevronDown className="w-4 h-4 rotate-180" /> Esconder a página da prova
          </button>
        )}
      </figure>
    );
  }
  return (
    <button type="button" onClick={() => setAberta(true)} className={`inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors ${className}`}>
      <FileText className="w-4 h-4" /> Ver na página da prova
    </button>
  );
}
