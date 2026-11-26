'use client';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { QuadroDeProvas } from '@/components/provas/quadro-de-provas';
import type { ProvaDoQuadro } from '@/lib/provas-estado';

export default function ProvasPage() {
  const [exams, setExams] = useState<ProvaDoQuadro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch('/api/provas/listar');
      const data = await res.json();
      setExams(data.exams || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta prova?')) return;
    try {
      await fetch(`/api/provas/${id}`, { method: 'DELETE' });
      toast.success('Prova excluída');
      fetchExams();
    } catch (e) {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {loading ? (
        <div className="text-center py-20 text-muted-foreground type-meta">Carregando...</div>
      ) : (
        <QuadroDeProvas provas={exams} onExcluir={handleDelete} />
      )}
    </div>
  );
}
