'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { aulaPorId } from '@/data/descobrir/aulas';
import { AulaDescobrir } from '@/components/descobrir/aula-descobrir';

export default function AulaDescobrirPage() {
  const { id } = useParams<{ id: string }>();
  const aula = aulaPorId(id);
  if (!aula) {
    return <p className="p-8">Essa aula não existe. <Link href="/descobrir" className="underline">Voltar ao mapa</Link></p>;
  }
  return <AulaDescobrir aula={aula} />;
}
