'use client';
// Treino por partes guiado pela receita de bolso (docs/redacao/receita-redacao.md).
// Um passo por tela, Voltar/Próximo sempre no mesmo lugar (barra presa embaixo),
// rascunho salvo no navegador a cada mudança. Sem IA: zero gasto de cota.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { montarRedacao, moldeTese, PARAGRAFOS, type ChaveParagrafo } from '@/lib/redacao/receita';
import { apagarRascunho, lerRascunho, rascunhoVazio, salvarRascunho, type Rascunho } from '@/lib/redacao/rascunho-receita';
import { BarraProgresso, TOTAL_PASSOS } from './pecas';
import { PassoTema } from './passo-tema';
import { PassoCausas } from './passo-causas';
import { PassoTese } from './passo-tese';
import { PassoParagrafo } from './passo-paragrafo';
import { PassoFinal } from './passo-final';

const PASSO_FINAL = TOTAL_PASSOS + 1;
/* Passos 4 a 7 são os parágrafos, na ordem da receita. */
const PARAGRAFO_DO_PASSO: Record<number, ChaveParagrafo> = { 4: 'introducao', 5: 'desenvolvimento1', 6: 'desenvolvimento2', 7: 'conclusao' };

/* O que falta para seguir; null = pode seguir. Só tema e causas travam:
   o resto o aluno pode deixar para depois. */
function falta(r: Rascunho): string | null {
  if (r.passo === 1 && !r.tema.trim()) return 'Escolha ou digite um tema.';
  if (r.passo === 2 && !(r.causaA && r.causaB)) return 'Escolha 2 causas.';
  return null;
}

export function TreinoReceita() {
  const [r, setR] = useState<Rascunho>(rascunhoVazio);
  const [carregado, setCarregado] = useState(false);

  /* Lê depois de montar: no servidor não há localStorage. */
  useEffect(() => {
    setR(lerRascunho());
    setCarregado(true);
  }, []);
  useEffect(() => {
    if (carregado) salvarRascunho(r);
  }, [r, carregado]);

  const mudar = (parcial: Partial<Rascunho>) => setR((atual) => ({ ...atual, ...parcial }));
  const mudarParagrafo = (chave: ChaveParagrafo, texto: string) =>
    setR((atual) => ({ ...atual, paragrafos: { ...atual.paragrafos, [chave]: texto } }));
  const irPara = (passo: number) => {
    setR((atual) => ({
      ...atual,
      passo,
      /* A tese chega preenchida com o molde das causas escolhidas. */
      tese: passo === 3 && !atual.tese.trim() ? moldeTese(atual.causaA, atual.causaB) : atual.tese,
    }));
    window.scrollTo({ top: 0 });
  };
  const recomecar = () => {
    apagarRascunho();
    setR(rascunhoVazio());
    window.scrollTo({ top: 0 });
  };

  if (!carregado) return <div className="min-h-[60vh]" aria-busy="true" />;

  const bloqueio = falta(r);
  const chaveParagrafo = PARAGRAFO_DO_PASSO[r.passo];
  const paragrafo = PARAGRAFOS.find((p) => p.chave === chaveParagrafo);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md"><BarraProgresso passo={r.passo} /></div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" className="inline-flex items-center gap-1.5 type-meta text-muted-foreground hover:text-foreground t-colors">
              <RotateCcw className="w-4 h-4" aria-hidden /> Recomeçar
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Recomeçar do zero?</AlertDialogTitle>
              <AlertDialogDescription>Tema, causas e tudo o que você escreveu aqui serão apagados.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={recomecar}>Apagar e recomeçar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="flex-1 pb-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={r.passo}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {r.passo === 1 && <PassoTema tema={r.tema} aoMudar={(tema) => mudar({ tema })} />}
            {r.passo === 2 && <PassoCausas causaA={r.causaA} causaB={r.causaB} aoMudar={(causaA, causaB) => mudar({ causaA, causaB })} />}
            {r.passo === 3 && <PassoTese tese={r.tese} causaA={r.causaA} causaB={r.causaB} aoMudar={(tese) => mudar({ tese })} />}
            {paragrafo && (
              <PassoParagrafo
                paragrafo={paragrafo}
                texto={r.paragrafos[paragrafo.chave]}
                aoMudar={(t) => mudarParagrafo(paragrafo.chave, t)}
                causaA={r.causaA}
                causaB={r.causaB}
                tese={r.tese}
                elementos={r.elementos}
                aoMarcarElemento={(e, v) => setR((atual) => ({ ...atual, elementos: { ...atual.elementos, [e]: v } }))}
              />
            )}
            {r.passo === PASSO_FINAL && (
              <PassoFinal
                tema={r.tema}
                redacao={montarRedacao(r.paragrafos)}
                checklist={r.checklist}
                aoMarcar={(i, v) => setR((atual) => {
                  const checklist = [...atual.checklist];
                  checklist[i] = v;
                  return { ...atual, checklist };
                })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barra presa embaixo: Voltar e Próximo nunca mudam de lugar. */}
      <nav className="sticky bottom-0 -mx-4 md:-mx-8 border-t border-border bg-background px-4 md:px-8 py-3" aria-label="Passos">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => irPara(r.passo - 1)}
            disabled={r.passo === 1}
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 type-meta font-medium surface-1 t-colors hover:bg-muted disabled:invisible"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Voltar
          </button>
          {bloqueio && <p className="type-meta text-muted-foreground text-center flex-1">{bloqueio}</p>}
          <button
            type="button"
            onClick={() => irPara(r.passo + 1)}
            disabled={r.passo === PASSO_FINAL || bloqueio !== null}
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] px-5 py-2.5 type-meta font-medium bg-primary text-primary-foreground shadow-elev-2 t-lift enabled:hover:-translate-y-px disabled:opacity-40 data-[fim=true]:invisible"
            data-fim={r.passo === PASSO_FINAL}
          >
            {r.passo === TOTAL_PASSOS ? 'Montar redação' : 'Próximo'} <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      </nav>
    </div>
  );
}
