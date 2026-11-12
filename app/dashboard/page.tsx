'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { getWeekScheduleByNumber, studyCycle } from '@/lib/schedule-data';
import { materiaColors } from '@/lib/theme-colors';
import { useLeitura } from '@/hooks/use-leitura';
import { LivrosDaLeitura } from '@/components/livros-da-leitura';
import { Atalhos } from '@/components/inicio/atalhos';
import { Semana } from '@/components/inicio/semana';
import { AnelInicio } from '@/components/pixel/anel-inicio';

// Mesma curva de --ease-entrance (globals.css).
const ENTRADA = [0.16, 1, 0.3, 1] as const;

/* Início no jeito Nubank (Pablo escolheu a opção B em 21/10/2026, artefato
   https://claude.ai/artifact/Wy2USfyj6hiYfSKA4dKdfs): bloco de cor com o dia
   em letra grande e o Começar, atalhos redondos, e o resto em seções
   separadas por linha fina, sem caixa. Continua sem saudação e sem banner
   (06/10/2026): o bloco É o cronograma de hoje. */
export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [studyProgress, setStudyProgress] = useState<any[]>([]);
  // A semana repete as matérias do dia: fica fechada até o aluno pedir.
  const [semanaAberta, setSemanaAberta] = useState(false);
  const [carregandoDia, setCarregandoDia] = useState(true);
  const [activeDay, setActiveDay] = useState<{ weekNumber: number; dayIndex: number; cycleComplete: boolean } | null>(null);
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);
  const leitura = useLeitura();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchStudyProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/study-progress');
      if (res.ok) {
        const data = await res.json();
        setStudyProgress(data?.progress ?? []);
        setActiveDay(data?.active ?? null);
        setExpandedDayIndex((prev) => prev ?? data?.active?.dayIndex ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregandoDia(false);
    }
  }, []);

  useEffect(() => { fetchStats(); fetchStudyProgress(); }, [fetchStats, fetchStudyProgress]);

  const weekNumber = activeDay?.weekNumber ?? 1;
  const weekTitle = studyCycle[weekNumber - 1]?.weekTitle ?? '';
  const weekSchedule = getWeekScheduleByNumber(weekNumber);
  const activeDaySchedule = activeDay && !activeDay.cycleComplete ? weekSchedule[activeDay.dayIndex] : null;
  const blocos = activeDaySchedule ? [...activeDaySchedule.manha, ...activeDaySchedule.trabalho] : [];
  const materias = Array.from(new Set(blocos.map((b) => b.materia)));
  // "pulado" (do antigo Pular este dia) não é estudado: aparece pendente.
  const statusDoDia = (dayIndex: number): string => {
    const status = studyProgress.find((p) => p.weekNumber === weekNumber && p.dayIndex === dayIndex)?.status ?? 'nao_iniciado';
    return status === 'pulado' ? 'nao_iniciado' : status;
  };
  const comecarHref = activeDaySchedule?.isSimulado
    ? '/simulado'
    : activeDay ? `/treino?weekNumber=${activeDay.weekNumber}&dayIndex=${activeDay.dayIndex}` : '/provas';
  // Dia de verdade, no horário de Brasília: "Quinta-feira".
  const hojeNome = (() => {
    const nome = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date());
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  })();
  /* O conteúdo é o do primeiro dia não estudado; o rótulo diz o dia de verdade
     e de qual dia é o conteúdo (Pablo, 15/10/2026). */
  const rotuloDoDia = !activeDaySchedule ? '' : hojeNome === activeDaySchedule.dayName
    ? `Semana ${weekNumber} · ${activeDaySchedule.dayName}`
    : `${hojeNome} · conteúdo de ${activeDaySchedule.dayName.replace('-feira', '').toLowerCase()} (semana ${weekNumber})`;
  const titulo = activeDay?.cycleComplete
    ? 'Ciclo de 4 semanas concluído'
    : activeDaySchedule?.isSimulado
      ? 'Dia de simulado'
      : `${materias.length} ${materias.length === 1 ? 'matéria' : 'matérias'} hoje`;
  const revisoes = stats?.pendingReviews ?? 0;

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      {/* Bloco de cor de ponta a ponta. No celular sobe por baixo do botão do
          menu (o main tem pt-12 para ele). */}
      {/* Anéis e luz atrás do bloco (voto 1B, 12/11/2026); texto sempre claro sobre eles. */}
      <header className="relative overflow-hidden -mt-12 md:mt-0 bg-primary text-white" aria-labelledby="hoje-titulo">
        <AnelInicio />
        <div className="relative max-w-6xl mx-auto px-4 md:px-10 pt-[4.5rem] pb-6 md:pt-14 md:pb-12 flex flex-col gap-5">
          {carregandoDia && !activeDay ? (
            <div role="status" aria-label="Carregando o cronograma de hoje" className="space-y-5">
              <div className="h-4 w-48 rounded-full bg-current opacity-20 motion-safe:animate-pulse" />
              <div className="h-14 w-72 max-w-full rounded-[var(--radius-control)] bg-current opacity-20 motion-safe:animate-pulse" />
              <div className="h-14 w-full md:w-80 rounded-full bg-current opacity-20 motion-safe:animate-pulse" />
            </div>
          ) : (
            <>
              {rotuloDoDia && <span data-numeric className="type-meta">{rotuloDoDia}</span>}
              <motion.h1
                id="hoje-titulo"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: ENTRADA }}
                className="font-sans font-extrabold leading-[0.95] tracking-[-0.035em] text-[length:var(--type-mega)] max-w-[12ch]"
              >
                {titulo}
              </motion.h1>
              {activeDay?.cycleComplete ? (
                <p className="type-body opacity-90">Continue treinando livremente pelas outras telas.</p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.08, ease: ENTRADA }}
                >
                  <Link
                    href={comecarHref}
                    className="group flex md:inline-flex items-center justify-between gap-8 rounded-full bg-primary-foreground text-primary-text dark:bg-primary dark:text-primary-foreground px-6 md:px-8 py-4 type-lead font-bold shadow-elev-2 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Começar
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-8">
        {/* Só no celular: no computador o menu lateral já mostra os mesmos 4. */}
        <div className="md:hidden mb-8">
          <Atalhos />
        </div>

        {/* Uma coluna no celular (na ordem do DOM); duas no computador, para a
            direita não ficar vazia sob um bloco de ponta a ponta. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: ENTRADA }}
          className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start"
        >
          {blocos.length > 0 && (
            <section aria-labelledby="cai-hoje" className="py-5 border-t border-border lg:col-start-1 lg:row-start-1">
              <h2 id="cai-hoje" className="font-sans type-lead font-bold mb-3">O que cai hoje</h2>
              <ul className="space-y-2.5">
                {blocos.map((block, i) => (
                  <li key={`${block.materia}-${i}`} className="flex items-baseline gap-3 min-w-0">
                    <span aria-hidden className="w-2.5 h-2.5 rounded-full flex-shrink-0 translate-y-[-1px]" style={{ backgroundColor: materiaColors[block.materia] ?? 'hsl(var(--muted-foreground))' }} />
                    {/* Tema quebra para baixo no celular: com truncate virava "Mol, Massa molar, Conceito d…". */}
                    <span className="min-w-0 flex flex-col sm:grid sm:grid-cols-[7.5rem_1fr] sm:items-baseline sm:gap-3">
                      <span className="type-body font-medium whitespace-nowrap">{block.materia}</span>
                      <span className="type-meta text-muted-foreground">{block.tema}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="leitura" className="py-5 border-t border-border lg:col-start-2 lg:row-start-1">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h2 id="leitura" className="font-sans type-lead font-bold">Leitura</h2>
              {leitura.meta !== null && (
                <span className="type-meta text-muted-foreground">
                  Meta de hoje: <span data-numeric className="font-semibold text-foreground">{leitura.meta}</span> páginas
                </span>
              )}
            </div>
            <LivrosDaLeitura paginas={leitura.paginas} mudarPagina={leitura.mudarPagina} />
          </section>

          {revisoes > 0 && (
            <Link href="/treino?mode=review" className="group flex items-center justify-between gap-3 py-5 border-t border-border lg:col-start-2 lg:row-start-2">
              <span className="flex flex-col gap-0.5">
                <span className="type-lead font-bold">Revisões</span>
                <span className="type-meta text-muted-foreground">
                  <span data-numeric>{revisoes}</span> {revisoes === 1 ? 'questão esperando' : 'questões esperando'}
                </span>
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}

          <div className="border-y border-border lg:col-start-1 lg:row-start-2">
            <button
              type="button"
              onClick={() => setSemanaAberta((v) => !v)}
              aria-expanded={semanaAberta}
              className="w-full flex items-center justify-between gap-3 py-5 text-left"
            >
              <span className="type-lead font-bold">A semana</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${semanaAberta ? 'rotate-180' : ''}`} />
            </button>
            {semanaAberta && (
              <Semana
                weekNumber={weekNumber}
                weekTitle={weekTitle}
                weekSchedule={weekSchedule}
                diaAtual={activeDay?.dayIndex ?? null}
                diaAberto={expandedDayIndex}
                abrirDia={setExpandedDayIndex}
                statusDoDia={statusDoDia}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
