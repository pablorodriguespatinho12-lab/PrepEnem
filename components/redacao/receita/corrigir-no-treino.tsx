'use client';
// Corrigir no passo 8 (Pablo, 29/10/2026: "melhorar com o tempo, atingir
// novos objetivos", "como um pai ensinando a engatinhar"). Usa a correção
// oficial do site (submit + evaluate, a mesma da tela de Redação) e mostra a
// devolutiva: o que já funciona, UMA coisa para treinar com o botão do passo,
// a próxima meta e o que mudou desde a última redação corrigida.

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';
import { CorrecaoCompletaView, lerCorrecao } from '@/components/redacao/correcao-completa';
import { comparar, montarDevolutiva, NOME_SIMPLES, NOTA_MAXIMA_PARTE, type Comparacao, type Devolutiva } from '@/lib/redacao/devolutiva';
import { MINIMO_LINHAS, linhasAproximadas, type Notas } from '@/lib/redacao/grade';
import type { CorrecaoCompleta } from '@/lib/redacao/correcao';
import type { CorrecaoDoTreino } from '@/lib/redacao/rascunho-receita';

interface Resultado { correcao: CorrecaoCompleta; devolutiva: Devolutiva; comparacao: Comparacao | null }
type Estado =
  | { fase: 'parada' }
  | { fase: 'corrigindo' }
  | { fase: 'pronta'; resultado: Resultado }
  | { fase: 'erro'; mensagem: string };

interface EssayDoHistorico {
  id: string; createdAt: string; notaTotal: number | null; avaliacao?: string | null;
  notaC1: number | null; notaC2: number | null; notaC3: number | null; notaC4: number | null; notaC5: number | null;
}

const notasDe = (e: EssayDoHistorico): Notas | null =>
  e.notaC1 === null || e.notaC2 === null || e.notaC3 === null || e.notaC4 === null || e.notaC5 === null
    ? null
    : ({ c1: e.notaC1, c2: e.notaC2, c3: e.notaC3, c4: e.notaC4, c5: e.notaC5 } as Notas);

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof corpo?.error === 'string' ? corpo.error : 'A correção não respondeu. Tente de novo.');
  return corpo as T;
}
const postar = (url: string, corpo: unknown) =>
  ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }) satisfies RequestInit;

/* A correção desta redação e a redação corrigida logo antes dela. */
async function carregarResultado(essayId: string, redacao: string, tema: string): Promise<Resultado> {
  const [{ essay }, { essays }] = await Promise.all([
    pedir<{ essay: EssayDoHistorico }>(`/api/redacao/history?id=${encodeURIComponent(essayId)}`),
    pedir<{ essays: EssayDoHistorico[] }>('/api/redacao/history'),
  ]);
  const correcao = lerCorrecao(essay.avaliacao);
  if (!correcao) throw new Error('A correção ainda não ficou pronta. Tente de novo.');
  const anterior = essays
    .filter((e) => e.id !== essayId && e.notaTotal !== null && e.createdAt < essay.createdAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const notasAntes = anterior ? notasDe(anterior) : null;
  return { correcao, devolutiva: montarDevolutiva(correcao, redacao, tema), comparacao: notasAntes ? comparar(notasAntes, correcao.notas) : null };
}

interface Props {
  tema: string;
  redacao: string;
  salva: CorrecaoDoTreino | null;
  aoGuardar: (c: CorrecaoDoTreino) => void;
  aoIrPara: (passo: number) => void;
}

export function CorrigirNoTreino({ tema, redacao, salva, aoGuardar, aoIrPara }: Props) {
  const [estado, setEstado] = useState<Estado>({ fase: 'parada' });
  /* Redação gravada cuja correção falhou: tentar de novo corrige a mesma,
     sem criar outra no histórico, só se o texto ainda é o mesmo (senão a
     nota do texto antigo ficaria guardada como do novo). */
  const [pendente, setPendente] = useState<CorrecaoDoTreino | null>(null);
  /* StrictMode roda o efeito 2 vezes no dev: abre a correção salva 1 vez só. */
  const abriu = useRef<string | null>(null);
  const mudouDepois = !!salva && salva.texto !== redacao;
  const linhas = linhasAproximadas(redacao);

  const abrirSalva = useCallback(async (essayId: string) => {
    setEstado({ fase: 'corrigindo' });
    try {
      setEstado({ fase: 'pronta', resultado: await carregarResultado(essayId, redacao, tema) });
    } catch (e) {
      setEstado({ fase: 'erro', mensagem: (e as Error).message });
    }
  }, [redacao, tema]);

  /* Voltou ao passo 8 sem mexer no texto: mostra a correção que já tinha. */
  useEffect(() => {
    if (!salva || salva.texto !== redacao || estado.fase !== 'parada' || abriu.current === salva.essayId) return;
    abriu.current = salva.essayId;
    abrirSalva(salva.essayId);
  }, [salva, redacao, estado.fase, abrirSalva]);

  const corrigir = async () => {
    /* A correção deste texto já existe (só falhou ao abrir): reabre, não corrige de novo. */
    if (salva && salva.texto === redacao) return abrirSalva(salva.essayId);
    setEstado({ fase: 'corrigindo' });
    try {
      const essayId = pendente?.texto === redacao
        ? pendente.essayId
        : (await pedir<{ essayId: string }>('/api/redacao/submit', postar('/api/redacao/submit', { customTema: tema, texto: redacao }))).essayId;
      setPendente({ essayId, texto: redacao });
      await pedir('/api/redacao/evaluate', postar('/api/redacao/evaluate', { essayId }));
      setPendente(null);
      aoGuardar({ essayId, texto: redacao });
      setEstado({ fase: 'pronta', resultado: await carregarResultado(essayId, redacao, tema) });
    } catch (e) {
      setEstado({ fase: 'erro', mensagem: (e as Error).message });
    }
  };

  if (linhas < MINIMO_LINHAS) {
    return (
      <Caixa>
        <p className="type-rotulo text-muted-foreground">Correção</p>
        <p className="font-reading type-body mt-1">
          Faltam <span data-numeric>{MINIMO_LINHAS - linhas}</span> linhas para o ENEM corrigir: ele só corrige a partir de <span data-numeric>{MINIMO_LINHAS}</span>, e a sua tem <span data-numeric>{linhas}</span>.
        </p>
        <p className="type-meta text-muted-foreground mt-1">Com as 4 frases do molde em cada parágrafo, você passa disso. Depois volte aqui.</p>
        <BotaoPasso passo={5} aoIrPara={aoIrPara} rotulo="Escrever no passo 5" />
      </Caixa>
    );
  }

  if (estado.fase === 'pronta' && !mudouDepois) return <DevolutivaView resultado={estado.resultado} aoIrPara={aoIrPara} />;

  return (
    <Caixa>
      <p className="type-rotulo text-muted-foreground">Correção</p>
      <p className="font-reading type-body mt-1">
        {mudouDepois
          ? 'Você mudou o texto depois da última correção. Corrija de novo para ver o que melhorou.'
          : 'Veja a nota no padrão do ENEM e o que treinar na próxima.'}
      </p>
      {estado.fase === 'erro' && <p className="type-meta text-destructive mt-2" role="alert">{estado.mensagem}</p>}
      <button
        type="button"
        onClick={corrigir}
        disabled={estado.fase === 'corrigindo' || !redacao}
        className="mt-3 w-full min-h-11 inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-[var(--radius-control)] font-medium type-meta shadow-elev-2 t-lift enabled:hover:-translate-y-px disabled:opacity-60"
      >
        {estado.fase === 'corrigindo'
          ? <><Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden /> Corrigindo, leva até 30 s</>
          : mudouDepois ? <><RotateCcw className="w-4 h-4" aria-hidden /> Corrigir de novo</> : 'Corrigir minha redação'}
      </button>
      <p className="type-meta text-muted-foreground mt-2">Fica no seu histórico, na tela de Redação.</p>
    </Caixa>
  );
}

function Caixa({ children }: { children: React.ReactNode }) {
  return <section aria-label="Correção" className="surface-1 rounded-[var(--radius-surface)] p-4 md:p-5 mb-5">{children}</section>;
}

function BotaoPasso({ passo, rotulo, aoIrPara }: { passo: number; rotulo: string; aoIrPara: (p: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => aoIrPara(passo)}
      className="mt-3 min-h-11 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 py-2.5 type-meta font-medium text-primary-foreground shadow-elev-2 t-lift hover:-translate-y-px"
    >
      {rotulo} <ArrowRight className="w-4 h-4" aria-hidden />
    </button>
  );
}

const sinal = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/* "+160 desde a anterior (600)" com a cor do sentido; e a parte que mais mudou. */
function Mudanca({ comparacao: c }: { comparacao: Comparacao }) {
  const diferenca = c.agora - c.antes;
  const cor = diferenca > 0 ? 'hsl(var(--success))' : diferenca < 0 ? 'hsl(var(--danger))' : undefined;
  const parte = c.maisMudou;
  return (
    <p className="type-meta mt-2" data-numeric>
      <strong className="font-semibold" style={{ color: cor }}>{diferenca === 0 ? 'Igual' : sinal(diferenca)}</strong>
      {' '}desde a redação anterior ({c.antes}).
      {parte && <> O que mais {parte.diferenca > 0 ? 'subiu' : 'caiu'}: {NOME_SIMPLES[parte.competencia]} ({sinal(parte.diferenca)}).</>}
    </p>
  );
}

function DevolutivaView({ resultado, aoIrPara }: { resultado: Resultado; aoIrPara: (p: number) => void }) {
  const { correcao, devolutiva: d, comparacao } = resultado;
  return (
    <motion.section
      aria-label="Correção"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="surface-1 rounded-[var(--radius-surface)] p-4 md:p-5 mb-5"
    >
      {/* A nota manda: número grande à esquerda, a mudança logo embaixo. */}
      <p className="type-rotulo text-muted-foreground">Sua nota</p>
      <p data-numeric className="font-display type-headline font-semibold leading-none mt-1">
        {d.total}<span className="ml-1.5 type-meta font-normal text-muted-foreground">de&nbsp;1000</span>
      </p>
      {comparacao && <Mudanca comparacao={comparacao} />}

      {d.jaFunciona && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 type-rotulo text-muted-foreground">
            <Check className="w-3.5 h-3.5" style={{ color: 'hsl(var(--success))' }} strokeWidth={3} aria-hidden /> Já funciona
          </p>
          <p className="type-meta mt-0.5">{d.jaFunciona}</p>
        </div>
      )}

      {/* A tarefa pesa mais que o "já funciona": serifa maior e a pausa antes. */}
      {d.treinar ? (
        <div className="mt-6 border-l-2 border-primary pl-3">
          <p className="type-rotulo text-primary-text">Treine agora · {NOME_SIMPLES[d.treinar.competencia]}</p>
          <p className="font-reading type-lead mt-1">{d.treinar.oQueFalta}</p>
          <p className="type-meta text-muted-foreground mt-1.5">{d.treinar.comoFazer}</p>
          {d.meta && (
            <p className="type-meta mt-2" data-numeric>
              Próxima meta: {NOME_SIMPLES[d.meta.competencia]}, de {d.meta.de} para {d.meta.para} pontos. Cada parte vai até {NOTA_MAXIMA_PARTE}.
            </p>
          )}
          <BotaoPasso passo={d.treinar.passo} aoIrPara={aoIrPara} rotulo={`Treinar no passo ${d.treinar.passo}`} />
        </div>
      ) : (
        <p className="font-reading type-body mt-6">Nota máxima em todas as partes. Treine outro tema para ver se repete.</p>
      )}

      <details className="group mt-5 pt-1 border-t border-border">
        <summary className="cursor-pointer list-none flex min-h-11 items-center type-meta font-medium text-muted-foreground hover:text-foreground t-colors [&::-webkit-details-marker]:hidden">
          Ver a correção inteira
        </summary>
        <div className="pt-3"><CorrecaoCompletaView correcao={correcao} /></div>
      </details>
    </motion.section>
  );
}
