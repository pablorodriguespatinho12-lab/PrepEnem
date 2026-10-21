'use client';
// A trilha de Cálculo: degraus do pré-cálculo ao Cálculo 3. Opcional, para o
// tempo livre. Mostra o próximo degrau, as revisões vencidas e a escada.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Circle, RefreshCcw } from 'lucide-react';
import { NOME_MODULO } from '@/data/calculo/trilha';
import type { Degrau, Modulo } from '@/lib/calculo/tipos';
import type { Situacao } from '@/lib/calculo/progresso';
import { EsqueletoLista } from '@/components/esqueletos';

interface DegrauTela extends Degrau { situacao: Situacao; escrita: boolean; acertos: number; tentativas: number }
interface Trilha { degraus: DegrauTela[]; proximo: string | null; revisoesPendentes: number }

const MODULOS: Modulo[] = ['pre', 'calc1', 'calc2', 'calc3'];
// Mesma curva de --ease-entrance (globals.css). Atraso por item com teto: lista
// longa não pode deixar o último degrau esperando quase um segundo.
const ENTRADA = [0.16, 1, 0.3, 1] as const;
const atraso = (i: number) => Math.min(i, 10) * 0.035;

function Icone({ s }: { s: Situacao }) {
  if (s === 'concluida') return <Check className="w-4 h-4" strokeWidth={3} style={{ color: 'hsl(var(--success))' }} aria-label="concluído" />;
  return <Circle className="w-4 h-4 text-primary-text" aria-label={s === 'em_andamento' ? 'em andamento' : 'aberto'} />;
}

export default function CalculoPage() {
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/calculo/trilha')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setTrilha)
      .catch(() => setErro('Não deu para carregar a trilha.'));
  }, []);

  if (erro) return <p className="p-8 type-meta text-[hsl(var(--danger))]">{erro}</p>;
  if (!trilha) {
    return <div className="p-4 md:p-8 max-w-[52rem] mx-auto"><EsqueletoLista rotulo="Carregando a trilha" linhas={8} /></div>;
  }

  const proximo = trilha.degraus.find((d) => d.id === trilha.proximo);
  const concluidos = trilha.degraus.filter((d) => d.situacao === 'concluida').length;

  return (
    <div className="p-4 md:p-8 max-w-[52rem] mx-auto space-y-8">
      <header>
        <p className="type-caption text-muted-foreground">Opcional · para o tempo livre</p>
        <h1 className="font-display type-headline font-bold">Cálculo, degrau por degrau</h1>
        <p className="type-meta text-muted-foreground mt-2 measure-reading">
          Do pré-cálculo ao Cálculo 3. Cada lição começa por uma pergunta, mostra como o raciocínio foi construído e só então chega à fórmula.
          Exemplos resolvidos primeiro, depois você. Todas as lições estão abertas: pode pular para a que quiser.
        </p>
        <p className="type-meta mt-2" data-numeric>{concluidos} de {trilha.degraus.length} degraus concluídos</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: ENTRADA }}
        className="grid gap-3 sm:grid-cols-2"
      >
        {proximo && (
          <Link href={`/calculo/${proximo.id}`} className="block rounded-[var(--radius-surface)] bg-primary text-primary-foreground p-5 shadow-elev-2 t-lift hover:-translate-y-px hover:shadow-elev-3">
            <p className="type-caption opacity-80">Próximo degrau · {proximo.minutos} min</p>
            <p className="font-display type-lead font-semibold mt-1">{proximo.titulo}</p>
            <p className="type-meta opacity-90 mt-1">{proximo.pergunta}</p>
            <span className="inline-flex items-center gap-1 type-meta font-semibold mt-3">Começar <ArrowRight className="w-4 h-4" /></span>
          </Link>
        )}
        {trilha.revisoesPendentes > 0 && (
          <Link href="/calculo/revisao" className="block rounded-[var(--radius-surface)] surface-1 p-5 t-lift hover:-translate-y-px">
            <p className="type-caption text-muted-foreground">Revisão espaçada</p>
            <p className="font-display type-lead font-semibold mt-1" data-numeric>{trilha.revisoesPendentes} para revisar</p>
            <p className="type-meta text-muted-foreground mt-1">Uma questão de cada lição que está na hora de lembrar.</p>
            <span className="inline-flex items-center gap-1 type-meta font-semibold text-primary-text mt-3"><RefreshCcw className="w-4 h-4" /> Revisar</span>
          </Link>
        )}
      </motion.div>

      {MODULOS.map((m) => {
        const doModulo = trilha.degraus.filter((d) => d.modulo === m);
        const prontas = doModulo.filter((d) => d.escrita);
        // Lição sem versão escrita vira uma linha só: eram 22 itens
        // "em preparação" no meio da trilha (foto de 07/10/2026).
        const emPreparo = doModulo.filter((d) => !d.escrita);
        return (
          <section key={m} aria-labelledby={`modulo-${m}`}>
            <h2 id={`modulo-${m}`} className="font-display type-title font-semibold mb-3">{NOME_MODULO[m]}</h2>
            {prontas.length > 0 && (
              <ol className="space-y-1 border-l-2 border-border ml-2">
                {prontas.map((d, i) => (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 + atraso(i), ease: ENTRADA }}
                  >
                    <Link href={`/calculo/${d.id}`} className="block px-2 py-2 rounded-[var(--radius-control)] hover:bg-muted t-colors">
                      <div className="flex items-start gap-3 -ml-[9px]">
                        <span className="mt-1 rounded-full bg-background p-0.5"><Icone s={d.situacao} /></span>
                        <div className="min-w-0">
                          <p className="type-meta font-semibold">{d.titulo}</p>
                          <p className="type-meta text-muted-foreground">{d.pergunta}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ol>
            )}
            {emPreparo.length > 0 && (
              <details className="mt-2 ml-2">
                <summary className="cursor-pointer type-meta text-muted-foreground hover:text-foreground t-colors py-2" data-numeric>
                  Em preparação: {emPreparo.length} {emPreparo.length === 1 ? 'lição' : 'lições'}
                </summary>
                <ul className="mt-1 space-y-1 type-meta text-muted-foreground">
                  {emPreparo.map((d) => <li key={d.id}>{d.titulo}</li>)}
                </ul>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
