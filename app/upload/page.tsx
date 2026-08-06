'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle2, XCircle, AlertTriangle, BookOpen, FileSearch } from 'lucide-react';
import { toast } from 'sonner';
import { materiaColors } from '@/lib/theme-colors';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.substring(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const [provaFile, setProvaFile] = useState<File | null>(null);
  const [gabaritoFile, setGabaritoFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState('');
  const provaRef = useRef<HTMLInputElement>(null);
  const gabaritoRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (type: 'prova' | 'gabarito') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type === 'application/pdf') {
      if (type === 'prova') { setProvaFile(f); setResult(null); }
      else { setGabaritoFile(f); setResult(null); }
    } else {
      toast.error('Por favor, selecione um arquivo PDF');
    }
  };

  const handleDrop = (type: 'prova' | 'gabarito') => (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === 'application/pdf') {
      if (type === 'prova') { setProvaFile(f); setResult(null); }
      else { setGabaritoFile(f); setResult(null); }
    } else {
      toast.error('Por favor, solte um arquivo PDF');
    }
  };

  const processFiles = async () => {
    if (!provaFile) { toast.error('Selecione o PDF da prova'); return; }
    if (!gabaritoFile) { toast.error('Selecione o PDF do gabarito'); return; }
    setProcessing(true);
    setProgress('Lendo arquivos...');
    setResult(null);

    try {
      const [provaBase64, gabaritoBase64] = await Promise.all([
        fileToBase64(provaFile),
        fileToBase64(gabaritoFile),
      ]);

      setProgress('Extraindo gabarito...');

      const res = await fetch('/api/pdf-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: provaBase64,
          gabaritoBase64,
          fileName: provaFile.name,
          gabaritoFileName: gabaritoFile.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao processar');

      setResult(data);
      toast.success(`${data.total} questões importadas!`);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar PDFs');
      setResult({ error: err.message });
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  const groupedByMateria = result?.questoes?.reduce((acc: any, q: any) => {
    if (!acc[q.materia]) acc[q.materia] = [];
    acc[q.materia].push(q);
    return acc;
  }, {} as Record<string, any[]>) ?? {};

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-7 h-7 text-primary" />
          <h1 className="font-display type-headline font-bold">Importar Questões de Vestibular</h1>
        </div>
        <p className="type-body measure-reading text-muted-foreground mb-8">
          Envie o PDF da prova e o PDF do gabarito. A IA vai extrair as questões e cruzar com o gabarito oficial para garantir as respostas corretas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prova Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="type-caption text-muted-foreground mb-3 block">Prova (Questões)</label>
          <div
            className={`border-2 border-dashed rounded-[var(--radius-surface)] p-6 md:p-8 text-center t-colors cursor-pointer min-h-[180px] flex items-center justify-center ${
              provaFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
            onClick={() => provaRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop('prova')}
          >
            <input ref={provaRef} type="file" accept=".pdf" onChange={handleFileChange('prova')} className="hidden" />
            {provaFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-[var(--radius-control)] bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display type-meta font-semibold truncate max-w-full">{provaFile.name}</p>
                <p className="type-meta text-muted-foreground">{(provaFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-[var(--radius-control)] bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-display type-meta font-semibold">Arraste o PDF da prova</p>
                <p className="type-meta text-muted-foreground">ou clique para selecionar</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Gabarito Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="type-caption text-muted-foreground mb-3 block">Gabarito (Respostas)</label>
          <div
            className={`border-2 border-dashed rounded-[var(--radius-surface)] p-6 md:p-8 text-center t-colors cursor-pointer min-h-[180px] flex items-center justify-center ${
              gabaritoFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
            onClick={() => gabaritoRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop('gabarito')}
          >
            <input ref={gabaritoRef} type="file" accept=".pdf" onChange={handleFileChange('gabarito')} className="hidden" />
            {gabaritoFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-[var(--radius-control)] bg-primary/10 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display type-meta font-semibold truncate max-w-full">{gabaritoFile.name}</p>
                <p className="type-meta text-muted-foreground">{(gabaritoFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-[var(--radius-control)] bg-muted flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-display type-meta font-semibold">Arraste o PDF do gabarito</p>
                <p className="type-meta text-muted-foreground">ou clique para selecionar</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Process Button */}
      {provaFile && gabaritoFile && !processing && !result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-center">
          <button
            onClick={processFiles}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-[var(--radius-control)] font-display font-semibold type-lead t-lift hover:-translate-y-px shadow-elev-2 hover:shadow-elev-3"
          >
            <BookOpen className="w-5 h-5" />
            Processar com IA
          </button>
        </motion.div>
      )}

      {/* Processing State */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 surface-1 rounded-[var(--radius-surface)] p-8 text-center"
          >
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="type-lead font-semibold">{progress}</p>
            <p className="type-meta text-muted-foreground mt-2">
              A IA está lendo o gabarito, extraindo questões e cruzando as respostas...
            </p>
            <p className="type-meta text-muted-foreground mt-1">Isso pode levar de 1 a 5 minutos dependendo do tamanho da prova</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !result.error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
            <div
              className="rounded-[var(--radius-surface)] border p-6 flex items-center gap-4"
              style={{ backgroundColor: 'hsl(var(--success-surface))', borderColor: 'hsl(var(--success-border))' }}
            >
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
              <div>
                <p className="font-display type-lead font-bold" style={{ color: 'hsl(var(--success))' }}>{result.message}</p>
                {result.gabaritoUsado && (
                  <p className="type-meta mt-1" style={{ color: 'hsl(var(--success))' }}>Respostas cruzadas com gabarito oficial</p>
                )}
                {result.anuladas > 0 && (
                  <p className="type-meta text-amber-600 mt-1">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {result.anuladas} questão(ões) anulada(s) no gabarito foram ignoradas
                  </p>
                )}
                {result.erros && result.erros.length > 0 && (
                  <p className="type-meta text-amber-600 mt-1">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    {result.erros.length} questões com problemas foram ignoradas
                  </p>
                )}
              </div>
            </div>

            <div className="surface-1 rounded-[var(--radius-surface)] p-6">
              <h3 className="font-display type-lead font-semibold mb-4">Questões por Matéria</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(groupedByMateria).map(([materia, qs]: [string, any]) => (
                  <div key={materia} className="flex items-center gap-3 p-3 rounded-[var(--radius-control)] bg-muted/50">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: (materiaColors as any)[materia] ?? '#888' }} />
                    <div>
                      <p className="type-meta font-medium">{materia}</p>
                      <p className="type-meta text-muted-foreground" data-numeric>{qs.length} questões</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setProvaFile(null); setGabaritoFile(null); setResult(null); }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-[var(--radius-control)] font-medium t-lift hover:-translate-y-px shadow-elev-1 hover:shadow-elev-2"
              >
                <Upload className="w-4 h-4" />
                Importar outra prova
              </button>
              <button
                onClick={() => window.location.href = '/banco-questoes'}
                className="flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-[var(--radius-control)] font-medium hover:bg-muted t-colors"
              >
                <BookOpen className="w-4 h-4" />
                Ver Banco de Questões
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {result?.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-[var(--radius-surface)] border p-6 flex items-center gap-4"
          style={{ backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' }}
        >
          <XCircle className="w-8 h-8 flex-shrink-0" style={{ color: 'hsl(var(--danger))' }} />
          <div>
            <p className="font-display font-bold" style={{ color: 'hsl(var(--danger))' }}>{result.error}</p>
            <p className="type-meta text-muted-foreground mt-1">Verifique se os PDFs estão corretos e tente novamente</p>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 surface-1 rounded-[var(--radius-surface)] p-6"
      >
        <h3 className="font-display type-body font-semibold mb-3">Como usar</h3>
        <ul className="space-y-2 type-meta text-foreground/70">
          <li>• <strong className="text-foreground">Prova (PV):</strong> o PDF com as questões da prova ENEM</li>
          <li>• <strong className="text-foreground">Gabarito (GB):</strong> o PDF oficial com as respostas corretas</li>
          <li>• A IA extrai as questões e cruza com o gabarito para garantir respostas 100% corretas</li>
          <li>• Questões anuladas no gabarito são automaticamente ignoradas</li>
          <li>• Provas de anos diferentes: basta importar cada par (prova + gabarito) separadamente</li>
          <li>• Arquivos disponíveis em <a href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos" target="_blank" rel="noopener" className="text-primary underline font-medium">gov.br/inep</a></li>
        </ul>
      </motion.div>
    </div>
  );
}
