'use client';
// A redação pronta, uma parte por tela (Pablo, 02/11/2026: "primeiro ele mostra
// uma redação nota 1000... olha, essa é a introdução, essa é a tese, esse é o
// primeiro bloco argumentativo... a conclusão"; "explicação de cada partezinha,
// depois a minha vez"). Cada frase vem com o nome da função do molde em cima,
// sem precisar tocar. Uma tela por parte, sem rolar, com Voltar/Próximo (o
// jeito da explicação de questão). A última tela é a vez dele.
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CARACTERES_POR_LINHA, ELEMENTOS, PARAGRAFOS, type ChaveParagrafo } from '@/lib/redacao/receita';
import { REDACAO_GRIFADA, type Frase, type FuncaoTrecho } from '@/lib/redacao/exemplo-receita';
import { estiloGrifo } from './grifo';

/* Para que serve cada parágrafo, em uma linha. */
const PARA_QUE: Record<ChaveParagrafo, string> = {
  introducao: 'Apresenta o problema e, na última frase, anuncia os 2 motivos: a tese.',
  desenvolvimento1: 'Prova o motivo 1 da tese com um autor e um fato do Brasil.',
  desenvolvimento2: 'Prova o motivo 2, com outro autor ou dado. Mesma receita do anterior.',
  conclusao: 'Resolve o problema: uma proposta para cada motivo, com os 5 elementos, e volta ao autor do começo.',
};

const ehElemento = (f?: FuncaoTrecho) => ELEMENTOS.some((e) => e.chave === f);

/* A frase da proposta com cada elemento grifado na cor dele, e a legenda em
   uma linha: listar os 5 embaixo de cada proposta passava 225 px da tela. */
function FraseDaProposta({ frase }: { frase: Frase }) {
  return (
    <p className="font-reading type-body mt-0.5 leading-[1.9]">
      {frase.map((t, j) => (ehElemento(t.funcao)
        ? <span key={j} className="rounded-[var(--radius-data)] px-0.5" style={estiloGrifo(t.funcao!, false)}>{t.texto}</span>
        : <span key={j}>{t.texto}</span>))}
    </p>
  );
}
function LegendaDaProposta() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 type-meta" aria-label="Os 5 elementos">
      {ELEMENTOS.map((e) => (
        <li key={e.chave} className="flex items-center gap-1.5">
          <span className="rounded-[var(--radius-data)] px-1 font-medium" style={estiloGrifo(e.chave, false)}>{e.nome}</span>
          <span className="text-muted-foreground">{e.pergunta.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
}
/* A função que dá a cor da frase: a do 1º trecho grifado (a proposta fica na
   cor do agente, o 1º elemento). */
const corDaFrase = (frase: Frase): FuncaoTrecho => frase.find((t) => t.funcao)?.funcao ?? 'fechamento';
const tinta = (f: FuncaoTrecho) => `hsl(var(--grifo-${f}) var(--grifo-luz-traco))`;
const fundo = (f: FuncaoTrecho) => `hsl(var(--grifo-${f}) var(--grifo-luz))`;
/* Quantas linhas da folha cada frase ocupa (~70 caracteres por linha). */
const linhasDaFrase = (frase: Frase) => Math.max(1, Math.round(frase.map((t) => t.texto).join('').length / CARACTERES_POR_LINHA));
/* A folha da prova em miniatura: os 4 parágrafos como linhas, o de agora
   colorido frase por frase, na mesma cor do nome da frase ao lado. Mostra
   onde a parte fica e quanto espaço cada frase ocupa, sem texto a mais. */
function Folha({ atual }: { atual: ChaveParagrafo | 'todas' }) {
  return (
    <figure className="hidden md:block" aria-hidden>
      <div className="rounded-[var(--radius-control)] border border-border bg-card px-3 py-3.5 shadow-elev-1">
        {PARAGRAFOS.map((p) => {
          const eAtual = atual === 'todas' || p.chave === atual;
          const linhas = REDACAO_GRIFADA[p.chave].flatMap((f) => Array.from({ length: linhasDaFrase(f) }, () => corDaFrase(f)));
          return (
            <div key={p.chave} className="mb-2.5 last:mb-0 flex flex-col gap-[5px]">
              {linhas.map((cor, k) => (
                <span
                  key={k}
                  className={`block h-[3px] rounded-full t-colors ${k === 0 ? 'ml-2.5' : ''} ${k === linhas.length - 1 ? 'w-3/5' : ''}`}
                  style={{ backgroundColor: eAtual ? tinta(cor) : 'hsl(var(--muted-foreground) / 0.34)' }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <figcaption className="type-meta text-muted-foreground mt-2 text-center">Na folha</figcaption>
    </figure>
  );
}
function TelaDoParagrafo({ chave, numero }: { chave: ChaveParagrafo; numero: number }) {
  const paragrafo = PARAGRAFOS.find((p) => p.chave === chave)!;
  return (
    <section aria-label={paragrafo.titulo} className="grid gap-x-8 md:grid-cols-[6.5rem_minmax(0,1fr)]">
      <Folha atual={chave} />
      <div className="min-w-0">
        {/* "Parte N de 4" vai no nome, para não gastar uma linha. */}
        <h3 className="font-display type-title font-semibold">
          {paragrafo.titulo} <span data-numeric className="type-meta font-sans font-normal text-muted-foreground">parte {numero} de {PARAGRAFOS.length}</span>
        </h3>
        <p className="type-meta text-muted-foreground mt-1">{PARA_QUE[chave]}</p>
        <ol className="mt-3 space-y-2.5">
          {REDACAO_GRIFADA[chave].map((frase, i) => {
            const funcao = paragrafo.frases[i]?.funcao ?? '';
            const cor = corDaFrase(frase);
            const temProposta = frase.some((t) => ehElemento(t.funcao));
            return (
              /* A barra da esquerda tem a cor da frase: a mesma das linhas da folha. */
              <li key={i} className="grid grid-cols-[3px_minmax(0,1fr)] gap-x-3">
                <span className="rounded-full" style={{ backgroundColor: tinta(cor) }} aria-hidden />
                <div className="min-w-0">
                  <p className="type-rotulo">
                    <span className="rounded-[var(--radius-data)] px-1.5 py-px font-semibold" style={{ backgroundColor: fundo(cor) }}>
                      <span data-numeric>{i + 1}</span> · {funcao}
                    </span>
                  </p>
                  {temProposta
                    ? <FraseDaProposta frase={frase} />
                    : <p className="font-reading type-body mt-1">{frase.map((t) => t.texto).join('')}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        {chave === 'conclusao' && <LegendaDaProposta />}
      </div>
    </section>
  );
}
function TelaSuaVez() {
  return (
    <section aria-label="Sua vez" className="grid gap-x-8 md:grid-cols-[6.5rem_minmax(0,1fr)]">
      {/* A folha inteira acesa: é o formato que a dele vai ter. */}
      <Folha atual="todas" />
      <div className="min-w-0 max-w-[var(--measure-reading)]">
      <h3 className="font-display type-title font-semibold">Agora é a sua vez</h3>
      <p className="font-reading type-body mt-3">
        Escolha um tema e escreva a sua, parte por parte. Em cada passo o site mostra o molde da frase, igual ao que você acabou de ver.
      </p>
      <p className="type-meta text-muted-foreground mt-3">Use a mesma receita, não as mesmas frases: o corretor percebe texto decorado.</p>
      <Dialog.Close className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-primary text-primary-foreground px-5 py-2.5 type-meta font-medium shadow-elev-2 t-lift hover:-translate-y-px">
        Começar a minha <ArrowRight className="w-4 h-4" aria-hidden />
      </Dialog.Close>
      </div>
    </section>
  );
}

export function RedacaoPorPartes() {
  const telas = PARAGRAFOS.length + 1;
  const [tela, setTela] = useState(0);
  /* 1 = foi para a frente, -1 = voltou: o conteúdo entra do lado certo. */
  const [direcao, setDirecao] = useState(1);
  const reduzir = useReducedMotion();
  const paragrafo = PARAGRAFOS[tela];
  const ir = (passo: 1 | -1) => {
    setDirecao(passo);
    setTela((t) => t + passo);
  };
  const conteudo = paragrafo ? <TelaDoParagrafo chave={paragrafo.chave} numero={tela + 1} /> : <TelaSuaVez />;
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8" data-medir="redacao-por-partes">
        {/* Troca de parte desliza, como os passos do treino; com movimento
            reduzido troca na hora, sem AnimatePresence (senão a tela pisca em
            branco enquanto o antigo some: animation-system). */}
        {reduzir ? conteudo : (
          <AnimatePresence mode="wait" initial={false} custom={direcao}>
            <motion.div
              key={tela}
              custom={direcao}
              initial={{ opacity: 0, x: 24 * direcao }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 * direcao }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {conteudo}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <nav className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 md:px-8" aria-label="Partes da redação">
        <button
          type="button"
          onClick={() => ir(-1)}
          disabled={tela === 0}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 type-meta font-medium surface-1 t-colors hover:bg-muted disabled:invisible"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden /> Voltar
        </button>
        <ol className="flex gap-1.5" aria-label={`Tela ${tela + 1} de ${telas}`}>
          {Array.from({ length: telas }, (_, i) => (
            <li key={i} className={`h-2 w-2 rounded-full ${i === tela ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </ol>
        <button
          type="button"
          onClick={() => ir(1)}
          disabled={tela === telas - 1}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] px-5 py-2.5 type-meta font-medium bg-primary text-primary-foreground t-colors hover:opacity-90 disabled:invisible"
        >
          Próximo <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
      </nav>
    </div>
  );
}
