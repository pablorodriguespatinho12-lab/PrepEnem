'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { FileText, ExternalLink, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

let pdfjsLoaded = false;
let pdfjsLib: any = null;

async function loadPdfJs() {
  if (pdfjsLoaded && pdfjsLib) return pdfjsLib;
  const pdfjs = await import('pdfjs-dist');
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  pdfjsLib = pdfjs;
  pdfjsLoaded = true;
  return pdfjs;
}

type PdfPageViewerProps = {
  pdfUrl: string;
  pageNumber: number;
  imagemUrl?: string | null;
  imagemUrlExpandida?: string | null;
  className?: string;
};

type ViewerHeaderProps = {
  pageNumber: number;
  pdfUrl: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRetry: () => void;
};

function ViewerHeader({ pageNumber, pdfUrl, isExpanded, onToggleExpand, onRetry }: ViewerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-muted/60 border-b border-border">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Página {pageNumber} da prova</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onRetry} className="text-xs text-muted-foreground hover:text-primary transition-[color]" title="Recarregar">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button onClick={onToggleExpand} className="text-xs font-medium text-primary hover:underline">
          {isExpanded ? 'Reduzir' : 'Ampliar'}
        </button>
        <a href={`/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

type ImagemIndisponivelProps = {
  className?: string;
};

// Estado neutro pra qualquer questão sem imagem pra mostrar — seja porque nunca teve pdfFileUrl,
// seja porque o render (pré-gerado ou o fallback legado via pdf.js) falhou de verdade. Nunca é
// "erro, tente de novo": se chegou aqui é porque não há imagem disponível pra essa questão agora,
// então nenhum retry vai mudar isso — e usar linguagem de erro passa alarme falso pro estudante.
export function ImagemIndisponivel({ className = '' }: ImagemIndisponivelProps) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border ${className}`}>
      <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <p className="text-sm text-muted-foreground">Imagem da questão não disponível.</p>
    </div>
  );
}

// Caminho principal: a imagem já foi pré-renderizada em scripts/generate-question-images.ts
// e vive em public/questoes-imagens/. Isso substitui o fetch+render client-side do pdf.js
// (que gerava múltiplos downloads de 6.7MB em paralelo e derrubava a function com 502).
type PreRenderedPdfPageProps = Pick<PdfPageViewerProps, 'pdfUrl' | 'pageNumber' | 'imagemUrlExpandida' | 'className'> & {
  imagemUrl: string;
};

function PreRenderedPdfPage({ pdfUrl, pageNumber, imagemUrl, imagemUrlExpandida, className = '' }: PreRenderedPdfPageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setRetryCount(c => c + 1);
  }, []);

  const src = isExpanded && imagemUrlExpandida ? imagemUrlExpandida : imagemUrl;

  if (hasError) {
    return <ImagemIndisponivel className={className} />;
  }

  return (
    <div className={`exam-scan-frame ${className}`}>
      <ViewerHeader
        pageNumber={pageNumber}
        pdfUrl={pdfUrl}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onRetry={handleRetry}
      />
      <div className={`exam-scan-mat overflow-auto ${isExpanded ? 'max-h-[80vh]' : 'max-h-[400px]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`${src}-${retryCount}`}
          src={src}
          alt={`Página ${pageNumber} da prova original`}
          className="w-full h-auto"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
}

// Fallback legado: só é alcançado se a questão ainda não tiver imagemUrl (ex.: questão nova
// adicionada antes de rodar o script de pré-renderização). Mantido pra não deixar a questão
// sem nenhuma exibição enquanto a imagem não é gerada.
function LegacyPdfRender({ pdfUrl, pageNumber, className = '' }: Pick<PdfPageViewerProps, 'pdfUrl' | 'pageNumber' | 'className'>) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const renderPage = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const pdfjs = await loadPdfJs();
      const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
      const loadingTask = pdfjs.getDocument({ url: proxyUrl, disableAutoFetch: true, disableStream: true });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const scale = isExpanded ? 2 : 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      setImageUrl(canvas.toDataURL('image/png'));
      canvas.remove();
    } catch (e) {
      console.error('PDF render error:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [pdfUrl, pageNumber, isExpanded]);

  useEffect(() => {
    renderPage();
  }, [renderPage, retryCount]);

  const handleRetry = () => setRetryCount(c => c + 1);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl border border-border animate-pulse ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Carregando imagem da prova...</span>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    return <ImagemIndisponivel className={className} />;
  }

  return (
    <div className={`exam-scan-frame ${className}`}>
      <ViewerHeader
        pageNumber={pageNumber}
        pdfUrl={pdfUrl}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onRetry={handleRetry}
      />
      <div className={`exam-scan-mat overflow-auto ${isExpanded ? 'max-h-[80vh]' : 'max-h-[400px]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={`Página ${pageNumber} da prova original`} className="w-full h-auto" />
      </div>
    </div>
  );
}

export default function PdfPageViewer({ pdfUrl, pageNumber, imagemUrl, imagemUrlExpandida, className = '' }: PdfPageViewerProps) {
  if (imagemUrl) {
    return (
      <PreRenderedPdfPage
        pdfUrl={pdfUrl}
        pageNumber={pageNumber}
        imagemUrl={imagemUrl}
        imagemUrlExpandida={imagemUrlExpandida}
        className={className}
      />
    );
  }
  return <LegacyPdfRender pdfUrl={pdfUrl} pageNumber={pageNumber} className={className} />;
}
