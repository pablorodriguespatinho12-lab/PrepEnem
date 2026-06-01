'use client';
import React, { useState, useEffect, useCallback } from 'react';
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

interface PdfPageViewerProps {
  pdfUrl: string;
  pageNumber: number;
  className?: string;
}

export default function PdfPageViewer({ pdfUrl, pageNumber, className = '' }: PdfPageViewerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const renderPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const pdfjs = await loadPdfJs();
      const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
      const loadingTask = pdfjs.getDocument({ url: proxyUrl, disableAutoFetch: true, disableStream: true });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      const scale = expanded ? 2 : 1.5;
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
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, pageNumber, expanded]);

  useEffect(() => {
    renderPage();
  }, [renderPage, retryCount]);

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-xl border border-border animate-pulse ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Carregando imagem da prova...</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 ${className}`}>
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Erro ao carregar imagem</p>
          <p className="text-xs text-amber-600 dark:text-amber-400">Tente recarregar ou abra o PDF original</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recarregar
          </button>
          <a
            href={`/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-border overflow-hidden bg-white dark:bg-gray-900 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Página {pageNumber} da prova</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRetry} className="text-xs text-muted-foreground hover:text-primary transition-colors" title="Recarregar">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="text-xs font-medium text-primary hover:underline">
            {expanded ? 'Reduzir' : 'Ampliar'}
          </button>
          <a href={`/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
      <div className={`overflow-auto ${expanded ? 'max-h-[80vh]' : 'max-h-[400px]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={`Página ${pageNumber} da prova original`} className="w-full h-auto" />
      </div>
    </div>
  );
}
