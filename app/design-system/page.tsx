'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useReducedMotion } from 'framer-motion';
import { Check, Loader2, Play, Search, X } from 'lucide-react';

/* PAINEL DE DESIGN — documentação viva dos tokens de app/globals.css. Rota
   interna, só logado. Tudo aqui lê o token real; nada é redigitado. */

/* ─── Contraste: cálculo local, sem dependência ──────────────────────────── */

type Hsl = { h: number; s: number; l: number };
type Rgb = [number, number, number];

/** Aceita o formato de token do projeto: "192 84% 28%". */
function parseHslTriplet(bruto: string): Hsl | null {
  const partes = bruto.trim().replace(/%/g, '').split(/[\s,/]+/).filter(Boolean);
  if (partes.length < 3) return null;
  const [h, s, l] = partes.slice(0, 3).map(Number);
  if ([h, s, l].some((n) => Number.isNaN(n))) return null;
  return { h, s: s / 100, l: l / 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const setor = ((((h % 360) + 360) % 360) / 60);
  const x = c * (1 - Math.abs((setor % 2) - 1));
  const base: Rgb =
    setor < 1 ? [c, x, 0]
      : setor < 2 ? [x, c, 0]
        : setor < 3 ? [0, c, x]
          : setor < 4 ? [0, x, c]
            : setor < 5 ? [x, 0, c]
              : [c, 0, x];
  const m = l - c / 2;
  return [base[0] + m, base[1] + m, base[2] + m];
}

function relativeLuminance([r, g, b]: Rgb): number {
  const linear = (c: number): number => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(a: Hsl, b: Hsl): number {
  const la = relativeLuminance(hslToRgb(a));
  const lb = relativeLuminance(hslToRgb(b));
  const maior = Math.max(la, lb);
  const menor = Math.min(la, lb);
  return (maior + 0.05) / (menor + 0.05);
}

type Veredito = 'AA' | 'AA grande' | 'falha';

function classificar(razao: number): Veredito {
  if (razao >= 4.5) return 'AA';
  if (razao >= 3) return 'AA grande';
  return 'falha';
}

/* ─── Dados declarativos ─────────────────────────────────────────────────── */

type NivelTipo = {
  token: string;
  classe: string;
  rem: string;
  px: string;
  lh: string;
  uso: string;
  amostra: string;
};

const NIVEIS_TIPO: readonly NivelTipo[] = [
  { token: '--type-caption', classe: 'type-caption', rem: '0.680rem', px: '10.9px', lh: 'lh-normal 1.45', uso: 'anotação de n, unidade, rodapé', amostra: 'Base de 128 questões' },
  { token: '--type-meta', classe: 'type-meta', rem: '0.850rem', px: '13.6px', lh: 'lh-normal 1.45', uso: 'chrome de UI, rótulo, metadado', amostra: 'Matemática e suas Tecnologias' },
  { token: '--type-body', classe: 'type-body', rem: '1.0625rem', px: '17.0px', lh: 'lh-reading 1.65', uso: 'leitura: enunciado e alternativa', amostra: 'Um corpo de massa 2 kg parte do repouso e percorre 12 m em 4 s.' },
  { token: '--type-lead', classe: 'type-lead', rem: '1.328rem', px: '21.2px', lh: 'lh-snug 1.24', uso: 'abertura de texto, número em destaque', amostra: 'Você acertou 34 das 40 questões' },
  { token: '--type-title', classe: 'type-title', rem: '1.660rem', px: '26.6px', lh: 'lh-snug 1.24', uso: 'título de seção', amostra: 'Caderno de erros' },
  { token: '--type-headline', classe: 'type-headline', rem: '2.075rem', px: '33.2px', lh: 'lh-snug 1.24', uso: 'título de página', amostra: 'Banco de questões' },
  { token: '--type-display', classe: 'type-display', rem: '2.594rem', px: '41.5px', lh: 'lh-tight 1.08', uso: 'display de abertura', amostra: 'Semana 3' },
  { token: '--type-hero', classe: 'type-hero', rem: '3.242rem', px: '51.9px', lh: 'lh-tight 1.08', uso: 'número-herói, tela de resultado', amostra: '847' },
];

const FAMILIAS: readonly { classe: string; nome: string; papel: string }[] = [
  { classe: 'font-display', nome: 'Fraunces', papel: 'títulos — a voz editorial do produto' },
  { classe: 'font-reading', nome: 'Source Serif 4', papel: 'corpo de leitura — enunciado e alternativa' },
  { classe: 'font-sans', nome: 'DM Sans', papel: 'chrome de UI — rótulo, botão, metadado' },
  { classe: 'font-mono', nome: 'JetBrains Mono', papel: 'código, token, valor bruto' },
];

const ELEVACOES: readonly { superficie: string; sombra: string; classe: string; uso: string }[] = [
  { superficie: '--surface-0', sombra: 'nenhuma', classe: '', uso: 'fundo de página — plano zero, nunca elevado' },
  { superficie: '--surface-1', sombra: '--elev-1', classe: 'surface-1', uso: 'card, painel — assenta sobre a página' },
  { superficie: '--surface-2', sombra: '--elev-2', classe: 'surface-2', uso: 'elemento elevado, menu ancorado' },
  { superficie: '--surface-3', sombra: '--elev-3', classe: 'surface-3', uso: 'overlay, popover, modal' },
];

const RAIOS: readonly { token: string; valor: string; uso: string }[] = [
  { token: '--radius-data', valor: '3px', uso: 'dado e badge — quase reto, lê como rótulo' },
  { token: '--radius-control', valor: '8px', uso: 'clicável: botão, alternativa, input' },
  { token: '--radius-surface', valor: '14px', uso: 'card e painel' },
  { token: '--radius-container', valor: '20px', uso: 'container grande, modal' },
  { token: '--radius-pill', valor: '9999px', uso: 'apenas toggle e pill de estado' },
];

type TokenCor = { nome: string; uso: string };

const TOKENS_COR: readonly TokenCor[] = [
  { nome: '--background', uso: 'fundo da página' },
  { nome: '--foreground', uso: 'texto principal' },
  { nome: '--card', uso: 'superfície de card' },
  { nome: '--primary', uso: 'ação primária, seleção' },
  { nome: '--primary-foreground', uso: 'texto sobre a ação primária' },
  { nome: '--muted', uso: 'fundo secundário' },
  { nome: '--muted-foreground', uso: 'texto de apoio' },
  { nome: '--border', uso: 'divisa e contorno' },
  { nome: '--ring', uso: 'anel de foco' },
  { nome: '--success', uso: 'acerto — texto e ícone' },
  { nome: '--success-surface', uso: 'acerto — fundo' },
  { nome: '--success-border', uso: 'acerto — contorno' },
  { nome: '--danger', uso: 'erro — texto e ícone' },
  { nome: '--danger-surface', uso: 'erro — fundo' },
  { nome: '--danger-border', uso: 'erro — contorno' },
];

type Curva = { token: string; valor: string; uso: string };

const CURVAS: readonly Curva[] = [
  { token: '--ease-out-quart', valor: 'cubic-bezier(0.25, 1, 0.5, 1)', uso: 'saída natural — o elemento desacelera até parar' },
  { token: '--ease-in-out-quad', valor: 'cubic-bezier(0.45, 0, 0.55, 1)', uso: 'ida e volta — simétrica, para movimento reversível' },
  { token: '--ease-entrance', valor: 'cubic-bezier(0.16, 1, 0.3, 1)', uso: 'entrada — arranque forte, chegada longa' },
];

const DURACOES: readonly { token: string; valor: string; uso: string }[] = [
  { token: '--dur-micro', valor: '120ms', uso: 'mudança de estado imediata: hover, foco' },
  { token: '--dur-short', valor: '220ms', uso: 'transição de componente' },
  { token: '--dur-medium', valor: '420ms', uso: 'entrada e saída de tela' },
];

/* ─── Peças de layout ────────────────────────────────────────────────────── */

type SecaoProps = { id: string; indice: string; titulo: string; resumo: string; children: React.ReactNode };

function Secao({ id, indice, titulo, resumo, children }: SecaoProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-8">
      <header className="mb-8 border-b border-border pb-5">
        <p className="type-caption text-muted-foreground">Seção {indice}</p>
        <h2 id={`${id}-titulo`} className="type-headline mt-1">{titulo}</h2>
        <p className="type-meta measure-reading mt-3 text-muted-foreground">{resumo}</p>
      </header>
      {children}
    </section>
  );
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="type-caption mb-2 text-muted-foreground">{children}</p>;
}

function Codigo({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[var(--radius-data)] bg-muted px-1.5 py-0.5 font-mono text-caption normal-case tracking-normal text-foreground">
      {children}
    </code>
  );
}

/* ─── Seção 1: escala tipográfica ────────────────────────────────────────── */

function LinhaTipo({ nivel }: { nivel: NivelTipo }) {
  return (
    <div className="grid gap-4 border-b border-border/60 py-6 last:border-b-0 md:grid-cols-[1fr_16rem]">
      <p className={`${nivel.classe} font-reading`}>{nivel.amostra}</p>
      <dl className="type-meta self-center text-muted-foreground">
        <dt className="sr-only">Token</dt><dd><Codigo>{nivel.token}</Codigo></dd>
        <dt className="sr-only">Tamanho e altura de linha</dt>
        <dd className="tabular mt-1.5">{nivel.rem} · {nivel.px} · {nivel.lh}</dd>
        <dt className="sr-only">Uso</dt><dd className="mt-1.5 text-foreground/70">{nivel.uso}</dd>
      </dl>
    </div>
  );
}

function SecaoTipografia() {
  return (
    <Secao
      id="tipografia"
      indice="01"
      titulo="Escala tipográfica"
      resumo="Razão modular 1.250 (major third), ancorada em 17px — o corpo de leitura. Oito níveis, range medido de 4.76x (10.9px a 51.9px)."
    >
      <p className="type-body measure-reading mb-10 font-reading text-foreground/80">
        Por que 1.250 e não 1.333 (perfect fourth): esta é uma tela de leitura longa. A quarta
        gera saltos grandes demais entre níveis adjacentes e, num texto denso, isso vira ruído a
        cada parágrafo. A terça maior mantém os níveis distinguíveis sem exigir reajuste do olho.
        O range de 4.76x vem de estender a escala só nas pontas, onde o salto não atrapalha a
        leitura corrida.
      </p>

      <div className="mb-10">
        <Rotulo>Famílias</Rotulo>
        <div className="grid gap-3 sm:grid-cols-2">
          {FAMILIAS.map((f) => (
            <div key={f.classe} className="surface-1 rounded-[var(--radius-surface)] p-4">
              <p className={`${f.classe} type-lead`}>{f.nome}</p>
              <p className="type-meta mt-1 text-muted-foreground">
                <Codigo>{f.classe}</Codigo> — {f.papel}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-1 rounded-[var(--radius-container)] px-6">
        {NIVEIS_TIPO.map((n) => <LinhaTipo key={n.token} nivel={n} />)}
      </div>
    </Secao>
  );
}

/* ─── Seção 2: elevação e raio ───────────────────────────────────────────── */

function SecaoElevacao() {
  return (
    <Secao
      id="elevacao"
      indice="02"
      titulo="Elevação e forma"
      resumo="Quatro superfícies e três sombras de duas camadas: uma camada curta e opaca marca o contato, uma longa e difusa marca a distância. Sombra de camada única é o que produz o visual chapado."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ELEVACOES.map((e) => (
          <div
            key={e.superficie}
            className={`${e.classe || 'border border-border'} rounded-[var(--radius-surface)] p-5`}
            style={e.classe ? undefined : { backgroundColor: 'hsl(var(--surface-0))' }}
          >
            <p className="type-meta font-medium">
              <Codigo>{e.superficie}</Codigo>
            </p>
            <p className="type-meta mt-1 text-muted-foreground">
              sombra: <Codigo>{e.sombra}</Codigo>
            </p>
            <p className="type-meta mt-3 text-muted-foreground">{e.uso}</p>
          </div>
        ))}
      </div>

      <p className="type-meta measure-reading mt-6 border-l-2 border-primary pl-4 text-muted-foreground">
        No modo escuro a elevação vem principalmente da superfície ficar mais clara, não da
        sombra: sombra sobre fundo escuro quase não aparece. Alterne o tema e compare — no claro
        os quatro blocos se separam pela sombra, no escuro pela luminância da própria superfície.
      </p>

      <div className="mt-10">
        <Rotulo>Raio semântico</Rotulo>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {RAIOS.map((r) => (
            <div key={r.token} className="surface-1 p-4" style={{ borderRadius: `var(${r.token})` }}>
              <p className="type-meta font-medium tabular">{r.valor}</p>
              <p className="type-meta mt-1"><Codigo>{r.token}</Codigo></p>
              <p className="type-meta mt-2 text-muted-foreground">{r.uso}</p>
            </div>
          ))}
        </div>
      </div>
    </Secao>
  );
}

/* ─── Seção 3: paleta com contraste medido em runtime ────────────────────── */

function useTokensDeCor(): { pronto: boolean; valores: Record<string, string> } {
  const { resolvedTheme } = useTheme();
  const [valores, setValores] = useState<Record<string, string>>({});
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const estilo = getComputedStyle(document.documentElement);
    const lidos: Record<string, string> = {};
    for (const token of TOKENS_COR) {
      lidos[token.nome] = estilo.getPropertyValue(token.nome).trim();
    }
    setValores(lidos);
    setPronto(true);
  }, [resolvedTheme]);

  return { pronto, valores };
}

function SeloContraste({ razao }: { razao: number | null }) {
  if (razao === null) {
    return <span className="type-caption text-muted-foreground">n/d</span>;
  }
  const veredito = classificar(razao);
  const cor =
    veredito === 'AA'
      ? 'hsl(var(--success))'
      : veredito === 'AA grande'
        ? 'hsl(var(--foreground))'
        : 'hsl(var(--danger))';
  return (
    <span className="type-meta tabular whitespace-nowrap" style={{ color: cor }}>
      {razao.toFixed(2)} · {veredito}
    </span>
  );
}

function SwatchCor({ token, valor, fundo, card }: { token: TokenCor; valor: string; fundo: Hsl | null; card: Hsl | null }) {
  const cor = parseHslTriplet(valor);
  const vsFundo = cor && fundo ? contrastRatio(cor, fundo) : null;
  const vsCard = cor && card ? contrastRatio(cor, card) : null;

  return (
    <div className="surface-1 flex items-center gap-4 rounded-[var(--radius-surface)] p-3">
      <div
        className="h-14 w-14 shrink-0 rounded-[var(--radius-control)] border border-border"
        style={{ backgroundColor: `hsl(var(${token.nome}))` }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="type-meta font-medium"><Codigo>{token.nome}</Codigo></p>
        <p className="type-meta tabular truncate text-muted-foreground">{valor || '—'}</p>
        <p className="type-meta text-muted-foreground">{token.uso}</p>
      </div>
      <dl className="type-meta shrink-0 text-right">
        <div className="flex items-baseline justify-end gap-2">
          <dt className="text-muted-foreground">vs fundo</dt><dd><SeloContraste razao={vsFundo} /></dd>
        </div>
        <div className="mt-1 flex items-baseline justify-end gap-2">
          <dt className="text-muted-foreground">vs card</dt><dd><SeloContraste razao={vsCard} /></dd>
        </div>
      </dl>
    </div>
  );
}

function SecaoPaleta() {
  const { pronto, valores } = useTokensDeCor();
  const fundo = pronto ? parseHslTriplet(valores['--background'] ?? '') : null;
  const card = pronto ? parseHslTriplet(valores['--card'] ?? '') : null;

  return (
    <Secao
      id="paleta"
      indice="03"
      titulo="Paleta e contraste"
      resumo="Valores lidos do documento em tempo de execução, não redigitados. As razões são recalculadas quando o tema muda: AA a partir de 4.5, AA grande a partir de 3, falha abaixo de 3."
    >
      {!pronto ? (
        <p className="type-meta text-muted-foreground">Lendo os tokens do documento…</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {TOKENS_COR.map((t) => (
            <SwatchCor key={t.nome} token={t} valor={valores[t.nome] ?? ''} fundo={fundo} card={card} />
          ))}
        </div>
      )}
      <p className="type-meta measure-reading mt-6 text-muted-foreground">
        Um token de superfície comparado com o próprio fundo tende a falhar por definição — a
        razão só é exigível de token que carrega texto ou ícone. As linhas de superfície ficam
        aqui para tornar visível a distância real entre os planos.
      </p>
    </Secao>
  );
}

/* ─── Seção 4: estados de componente ─────────────────────────────────────── */

function Estado({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div>
      <Rotulo>{rotulo}</Rotulo>
      {children}
    </div>
  );
}

const BOTAO_BASE =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 py-2 type-meta font-medium t-colors';

function BotoesDemo() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <Estado rotulo="Repouso (interativo)">
        <button
          type="button"
          className={`${BOTAO_BASE} bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active`}
        >
          Responder
        </button>
      </Estado>
      <Estado rotulo="Hover (estático)">
        <button type="button" tabIndex={-1} className={`${BOTAO_BASE} bg-primary-hover text-primary-foreground`}>
          Responder
        </button>
      </Estado>
      <Estado rotulo="Ativo (estático)">
        <button type="button" tabIndex={-1} className={`${BOTAO_BASE} bg-primary-active text-primary-foreground`}>
          Responder
        </button>
      </Estado>
      <Estado rotulo="Desabilitado">
        <button type="button" disabled className={`${BOTAO_BASE} bg-primary text-primary-foreground opacity-45`}>
          Responder
        </button>
      </Estado>
      <Estado rotulo="Carregando">
        <button type="button" disabled className={`${BOTAO_BASE} bg-primary text-primary-foreground opacity-80`}>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Enviando
        </button>
      </Estado>
    </div>
  );
}

type EstiloAlternativa = {
  rotulo: string;
  letra: string;
  texto: string;
  container: React.CSSProperties;
  chip: React.CSSProperties;
  icone?: 'certo' | 'errado';
};

const ALTERNATIVAS: readonly EstiloAlternativa[] = [
  {
    rotulo: 'Repouso',
    letra: 'A',
    texto: 'A energia cinética do corpo permanece constante ao longo do trajeto.',
    container: { backgroundColor: 'hsl(var(--surface-1))', borderColor: 'hsl(var(--border))' },
    chip: { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' },
  },
  {
    rotulo: 'Hover (estático)',
    letra: 'B',
    texto: 'A aceleração média vale 1,5 m/s² e o movimento é uniformemente variado.',
    container: { backgroundColor: 'hsl(var(--surface-2))', borderColor: 'hsl(var(--primary) / 0.45)' },
    chip: { backgroundColor: 'hsl(var(--primary) / 0.14)', color: 'hsl(var(--primary))' },
  },
  {
    rotulo: 'Selecionada',
    letra: 'C',
    texto: 'O trabalho da força resultante é igual à variação da energia cinética.',
    container: { backgroundColor: 'hsl(var(--primary) / 0.10)', borderColor: 'hsl(var(--primary))' },
    chip: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
  },
  {
    rotulo: 'Correta revelada',
    letra: 'D',
    texto: 'A força resultante tem a mesma direção e o mesmo sentido do deslocamento.',
    container: { backgroundColor: 'hsl(var(--success-surface))', borderColor: 'hsl(var(--success-border))' },
    chip: { backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--surface-1))' },
    icone: 'certo',
  },
  {
    rotulo: 'Errada revelada',
    letra: 'E',
    texto: 'O corpo mantém velocidade constante porque a força resultante é nula.',
    container: { backgroundColor: 'hsl(var(--danger-surface))', borderColor: 'hsl(var(--danger-border))' },
    chip: { backgroundColor: 'hsl(var(--danger))', color: 'hsl(var(--surface-1))' },
    icone: 'errado',
  },
];

function AlternativaDemo({ item }: { item: EstiloAlternativa }) {
  return (
    <Estado rotulo={item.rotulo}>
      <div
        className="flex items-start gap-3 rounded-[var(--radius-control)] border p-3.5"
        style={item.container}
      >
        <span
          className="type-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-pill)] font-semibold tabular"
          style={item.chip}
          aria-hidden="true"
        >
          {item.letra}
        </span>
        <p className="type-body font-reading">{item.texto}</p>
        {item.icone === 'certo' && (
          <Check className="h-5 w-5 shrink-0" style={{ color: 'hsl(var(--success))' }} aria-hidden="true" />
        )}
        {item.icone === 'errado' && (
          <X className="h-5 w-5 shrink-0" style={{ color: 'hsl(var(--danger))' }} aria-hidden="true" />
        )}
      </div>
    </Estado>
  );
}

function Badge({ fundo, cor, children }: { fundo: string; cor: string; children: React.ReactNode }) {
  return (
    <span
      className="type-caption rounded-[var(--radius-data)] px-2 py-1"
      style={{ backgroundColor: fundo, color: cor }}
    >
      {children}
    </span>
  );
}

function OutrosComponentes() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Estado rotulo="Card">
        <article className="surface-1 card-3d rounded-[var(--radius-surface)] p-5">
          <p className="type-caption text-muted-foreground">Ciências da Natureza</p>
          <h3 className="type-title mt-1">Cinemática</h3>
          <p className="type-meta mt-2 text-muted-foreground">
            <span className="tabular">42</span> questões respondidas ·{' '}
            <span className="tabular">78%</span> de acerto
          </p>
        </article>
      </Estado>

      <Estado rotulo="Input">
        <div className="space-y-3">
          <label htmlFor="ds-busca" className="type-caption block text-muted-foreground">
            Buscar questão
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="ds-busca"
              type="text"
              placeholder="Por enunciado ou tema"
              className="type-meta t-colors w-full rounded-[var(--radius-control)] border border-input bg-[hsl(var(--surface-1))] py-2 pl-9 pr-3 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
            />
          </div>
          <input
            type="text"
            value="Campo desabilitado"
            disabled
            readOnly
            aria-label="Exemplo de campo desabilitado"
            className="type-meta w-full rounded-[var(--radius-control)] border border-input bg-muted px-3 py-2 text-muted-foreground opacity-60"
          />
        </div>
      </Estado>

      <Estado rotulo="Badge">
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-caption rounded-[var(--radius-data)] bg-muted px-2 py-1 text-muted-foreground">
            Neutro
          </span>
          <Badge fundo="hsl(var(--primary) / 0.14)" cor="hsl(var(--primary))">Em revisão</Badge>
          <Badge fundo="hsl(var(--success-surface))" cor="hsl(var(--success))">Dominado</Badge>
          <Badge fundo="hsl(var(--danger-surface))" cor="hsl(var(--danger))">Reforçar</Badge>
          <span className="type-caption rounded-[var(--radius-pill)] border border-border px-2.5 py-1 text-muted-foreground">
            Pill de estado
          </span>
        </div>
      </Estado>
    </div>
  );
}

function SecaoEstados() {
  return (
    <Secao
      id="estados"
      indice="04"
      titulo="Estados de componente"
      resumo="Os estados que normalmente exigem ponteiro estão renderizados na forma estática, para que todos fiquem visíveis ao mesmo tempo. Verde e vermelho aparecem exclusivamente para acerto e erro."
    >
      <div className="space-y-10">
        <div>
          <h3 className="type-lead mb-4">Botão</h3>
          <BotoesDemo />
        </div>

        <div>
          <h3 className="type-lead mb-4">Alternativa de questão</h3>
          <div className="grid gap-5 lg:grid-cols-2">
            {ALTERNATIVAS.map((a) => <AlternativaDemo key={a.rotulo} item={a} />)}
          </div>
        </div>

        <div>
          <h3 className="type-lead mb-4">Superfície, campo e rótulo</h3>
          <OutrosComponentes />
        </div>
      </div>
    </Secao>
  );
}

/* ─── Seção 5: curvas de easing, animadas de verdade ─────────────────────── */

const POSICAO_INICIAL = 'translateX(0%)';
const POSICAO_FINAL = 'translateX(calc(100% - 2.25rem))';

type ControleDemo = { play: () => void };

/**
 * Anima via Web Animations API — e não por transição CSS — porque a regra
 * global de prefers-reduced-motion em globals.css zera transition-duration com
 * !important, o que mataria a demonstração. Sob movimento reduzido a duração
 * cai para --dur-micro; a curva continua sendo a real.
 */
function useDemoEasing(easing: string, duracaoMs: number) {
  const alvo = useRef<HTMLDivElement>(null);
  const animacao = useRef<Animation | null>(null);
  const noFim = useRef(false);

  const play = useCallback(() => {
    const el = alvo.current;
    if (!el || typeof el.animate !== 'function') return;
    animacao.current?.cancel();
    const de = noFim.current ? POSICAO_FINAL : POSICAO_INICIAL;
    const para = noFim.current ? POSICAO_INICIAL : POSICAO_FINAL;
    noFim.current = !noFim.current;
    animacao.current = el.animate(
      [{ transform: de }, { transform: para }],
      { duration: duracaoMs, easing, fill: 'forwards' },
    );
  }, [easing, duracaoMs]);

  useEffect(() => () => animacao.current?.cancel(), []);

  return { alvo, play };
}

type DemoCurvaProps = { curva: Curva; duracaoMs: number; registrar: (controle: ControleDemo) => void };

function DemoCurva({ curva, duracaoMs, registrar }: DemoCurvaProps) {
  const { alvo, play } = useDemoEasing(curva.valor, duracaoMs);

  useEffect(() => { registrar({ play }); }, [registrar, play]);

  return (
    <div className="surface-1 rounded-[var(--radius-surface)] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="type-meta font-medium"><Codigo>{curva.token}</Codigo></p>
          <p className="type-meta tabular mt-1 text-muted-foreground">{curva.valor}</p>
        </div>
        <p className="type-caption tabular text-muted-foreground">{duracaoMs}ms</p>
      </div>

      <p className="type-meta mt-2 text-muted-foreground">{curva.uso}</p>

      <div
        className="relative mt-4 overflow-hidden rounded-[var(--radius-control)] border border-border bg-[hsl(var(--surface-0))] p-2"
        aria-hidden="true"
      >
        <div ref={alvo} className="w-full" style={{ transform: POSICAO_INICIAL, willChange: 'transform' }}>
          <div
            className="h-9 w-9 rounded-[var(--radius-control)]"
            style={{ backgroundColor: 'hsl(var(--primary))' }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={play}
        className={`${BOTAO_BASE} mt-4 border border-border bg-[hsl(var(--surface-2))] text-foreground hover:border-primary/50 hover:text-primary`}
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Reproduzir {curva.token.replace('--ease-', '')}
      </button>
    </div>
  );
}

function SecaoMovimento() {
  const reduzirMovimento = useReducedMotion();
  const duracaoMs = reduzirMovimento ? 120 : 420;
  const controles = useRef<Map<string, ControleDemo>>(new Map());

  const criarRegistro = useCallback(
    (token: string) => (controle: ControleDemo) => { controles.current.set(token, controle); },
    [],
  );

  const reproduzirTodas = useCallback(() => {
    controles.current.forEach((c) => c.play());
  }, []);

  return (
    <Secao
      id="movimento"
      indice="05"
      titulo="Curvas de movimento"
      resumo="Três curvas nomeadas, demonstradas em animação real. Só transform é animado — o deslocamento roda no compositor, sem recalcular layout."
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reproduzirTodas}
          className={`${BOTAO_BASE} bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active`}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Reproduzir todas
        </button>
        <p className="type-meta text-muted-foreground">
          {reduzirMovimento
            ? 'Movimento reduzido detectado: a duração cai para 120ms e nenhuma curva ultrapassa o ponto final.'
            : 'Cada botão alterna o sentido do percurso, de ida e de volta.'}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {CURVAS.map((c) => (
          <DemoCurva key={c.token} curva={c} duracaoMs={duracaoMs} registrar={criarRegistro(c.token)} />
        ))}
      </div>

      <div className="mt-8">
        <Rotulo>Durações</Rotulo>
        <div className="grid gap-3 sm:grid-cols-3">
          {DURACOES.map((d) => (
            <div key={d.token} className="surface-1 rounded-[var(--radius-surface)] p-4">
              <p className="type-lead tabular">{d.valor}</p>
              <p className="type-meta mt-1"><Codigo>{d.token}</Codigo></p>
              <p className="type-meta mt-2 text-muted-foreground">{d.uso}</p>
            </div>
          ))}
        </div>
      </div>
    </Secao>
  );
}

/* ─── Casca da página ────────────────────────────────────────────────────── */

const INDICE: readonly { id: string; nome: string }[] = [
  { id: 'tipografia', nome: 'Tipografia' },
  { id: 'elevacao', nome: 'Elevação' },
  { id: 'paleta', nome: 'Paleta' },
  { id: 'estados', nome: 'Estados' },
  { id: 'movimento', nome: 'Movimento' },
];

function PainelDesign() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <header className="mb-14 border-b border-border pb-10">
        <p className="type-caption text-muted-foreground">Painel interno</p>
        <h1 className="type-display mt-2">Sistema de design</h1>
        <p className="type-body measure-reading mt-4 font-reading text-foreground/80">
          A fonte de verdade é <Codigo>app/globals.css</Codigo>. Esta página lê os tokens do
          documento em tempo de execução — se um valor mudar lá, ele muda aqui. Alterne o tema
          para verificar que cada seção se sustenta nos dois modos.
        </p>
        <nav aria-label="Seções do painel" className="mt-6 flex flex-wrap gap-2">
          {INDICE.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="type-caption t-colors rounded-[var(--radius-pill)] border border-border px-3 py-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary"
            >
              {item.nome}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-20">
        <SecaoTipografia />
        <SecaoElevacao />
        <SecaoPaleta />
        <SecaoEstados />
        <SecaoMovimento />
      </div>
    </main>
  );
}

export default function DesignSystemPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="type-meta flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {status === 'loading' ? 'Verificando a sessão…' : 'Redirecionando para o login…'}
        </p>
      </div>
    );
  }

  return <PainelDesign />;
}
