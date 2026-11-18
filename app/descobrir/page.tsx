'use client';
/* Aba Descobrir (Pablo, 17/11/2026): aulas no jeito do canal Universo Narrado, de
   onde vem cada equação. O plano cartesiano no meio, as aulas em volta. */
import { ListaDescobrir, MapaDescobrir } from '@/components/descobrir/mapa';
import '@/components/descobrir/descobrir.css';

export default function DescobrirPage() {
  return (
    <div className="dsc mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-6 pt-2 md:px-6 md:py-8">
      <header className="pl-12 md:pl-0">
        <h1 className="font-display text-3xl leading-none">Descobrir</h1>
        <p className="mt-2 text-muted-foreground">De onde vem cada equação. Comece pela 1 e siga os números.</p>
      </header>
      <div className="px-cartao m-1 hidden p-4 sm:block">
        <MapaDescobrir />
      </div>
      <div className="sm:hidden">
        <ListaDescobrir />
      </div>
    </div>
  );
}
