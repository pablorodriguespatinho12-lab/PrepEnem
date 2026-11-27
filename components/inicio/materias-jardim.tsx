import Link from 'next/link';
import { iconeDaMateria } from '@/lib/jardim/artes';

/* "O que cai hoje" no modo Jardim: um cartão desenhado por matéria. */
export function MateriasJardim({ blocos, href }: { blocos: { materia: string; tema: string }[]; href: string }) {
  return (
    <section className="m-col12 so-jardim jv-materias" aria-label="O que cai hoje">
      {blocos.map((b, i) => (
        <Link key={`${b.materia}-${i}`} href={href} className="m-cartao jv-materia jv-entra">
          {/* Desenho constante do código, nunca dado do usuário. */}
          <svg viewBox="0 0 64 64" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden dangerouslySetInnerHTML={{ __html: iconeDaMateria(b.materia) }} />
          <b className="px">{b.materia}</b>
          <span>{b.tema}</span>
        </Link>
      ))}
    </section>
  );
}
