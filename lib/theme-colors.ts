export const DEFAULT_THEME_COLOR = 'clareza';

type ThemeModeTokens = {
  primary: string;
  primaryForeground: string;
  ring: string;
  accent: string;
  chart1: string;
  background: string;
  card: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
};

type ThemeColorSet = {
  label: string;
  swatch: string;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
};

// Todos os valores em "H S% L%" (mesma convenção do globals.css, prontos pra hsl(var(--token))).
// primaryForeground é escolhido por par de contraste (branco quando passa 4.5:1 contra o primary daquele
// modo, senão um "ink" escuro no matiz do próprio tema) — ver contrast-check em Frente 2 antes de editar.
export const themeColors: Record<string, ThemeColorSet> = {
  clareza: {
    label: 'Clareza',
    swatch: '#0b687f',
    light: {
      primary: '192 84% 27%',
      primaryForeground: '0 0% 100%',
      ring: '192 84% 27%',
      accent: '190 20% 92%',
      chart1: '192 84% 27%',
      background: '190 20% 97%',
      card: '190 25% 99%',
      foreground: '200 25% 12%',
      muted: '190 20% 92%',
      mutedForeground: '200 15% 40%',
      border: '190 20% 88%',
    },
    dark: {
      primary: '189 80% 52%',
      primaryForeground: '200 30% 10%',
      ring: '189 80% 52%',
      accent: '200 20% 20%',
      chart1: '189 80% 52%',
      background: '200 28% 8%',
      card: '200 26% 11%',
      foreground: '190 15% 94%',
      muted: '200 20% 20%',
      mutedForeground: '190 10% 65%',
      border: '200 20% 20%',
    },
  },
  ambar: {
    label: 'Âmbar de Estudo',
    swatch: '#a3421f',
    light: {
      primary: '16 68% 38%',
      primaryForeground: '0 0% 100%',
      ring: '16 68% 38%',
      accent: '30 15% 91%',
      chart1: '16 68% 38%',
      background: '30 12% 96%',
      card: '30 15% 99%',
      foreground: '20 15% 14%',
      muted: '30 15% 91%',
      mutedForeground: '25 8% 40%',
      border: '30 12% 87%',
    },
    dark: {
      primary: '18 75% 56%',
      primaryForeground: '20 20% 10%',
      ring: '18 75% 56%',
      accent: '22 14% 20%',
      chart1: '18 75% 56%',
      background: '22 18% 9%',
      card: '22 16% 12%',
      foreground: '30 20% 94%',
      muted: '22 14% 20%',
      mutedForeground: '28 10% 65%',
      border: '22 14% 20%',
    },
  },
  academico: {
    label: 'Índigo Acadêmico',
    swatch: '#2c386d',
    light: {
      primary: '229 42% 30%',
      primaryForeground: '0 0% 100%',
      ring: '229 42% 30%',
      accent: '225 18% 93%',
      chart1: '229 42% 30%',
      background: '225 20% 97%',
      card: '0 0% 100%',
      foreground: '228 30% 14%',
      muted: '225 18% 93%',
      mutedForeground: '225 12% 40%',
      border: '225 18% 88%',
    },
    dark: {
      primary: '228 55% 62%',
      primaryForeground: '228 30% 10%',
      ring: '228 55% 62%',
      accent: '228 20% 20%',
      chart1: '228 55% 62%',
      background: '228 30% 7%',
      card: '228 26% 10%',
      foreground: '225 20% 95%',
      muted: '228 20% 20%',
      mutedForeground: '225 10% 65%',
      border: '228 20% 20%',
    },
  },
  blue: {
    label: 'Azul',
    swatch: '#0a58d6',
    light: {
      primary: '217 91% 44%',
      primaryForeground: '0 0% 100%',
      ring: '217 91% 44%',
      accent: '217 20% 93%',
      chart1: '217 91% 44%',
      background: '217 20% 97%',
      card: '217 25% 99%',
      foreground: '220 25% 12%',
      muted: '217 20% 92%',
      mutedForeground: '220 12% 42%',
      border: '217 18% 88%',
    },
    dark: {
      primary: '217 85% 65%',
      primaryForeground: '217 40% 10%',
      ring: '217 85% 65%',
      accent: '217 20% 20%',
      chart1: '217 85% 65%',
      background: '217 28% 8%',
      card: '217 24% 11%',
      foreground: '217 15% 94%',
      muted: '217 20% 20%',
      mutedForeground: '217 10% 65%',
      border: '217 20% 20%',
    },
  },
  green: {
    label: 'Verde',
    swatch: '#126d34',
    light: {
      primary: '142 71% 25%',
      primaryForeground: '0 0% 100%',
      ring: '142 71% 25%',
      accent: '142 20% 93%',
      chart1: '142 71% 25%',
      background: '142 15% 97%',
      card: '142 20% 99%',
      foreground: '145 25% 12%',
      muted: '142 18% 92%',
      mutedForeground: '145 12% 40%',
      border: '142 15% 88%',
    },
    dark: {
      primary: '142 55% 48%',
      primaryForeground: '142 30% 10%',
      ring: '142 55% 48%',
      accent: '142 18% 20%',
      chart1: '142 55% 48%',
      background: '145 24% 8%',
      card: '145 22% 11%',
      foreground: '142 15% 94%',
      muted: '142 18% 20%',
      mutedForeground: '142 10% 65%',
      border: '142 18% 20%',
    },
  },
  orange: {
    label: 'Laranja',
    swatch: '#a53f09',
    light: {
      primary: '21 90% 34%',
      primaryForeground: '0 0% 100%',
      ring: '21 90% 34%',
      accent: '21 20% 93%',
      chart1: '21 90% 34%',
      background: '25 15% 97%',
      card: '25 20% 99%',
      foreground: '22 25% 12%',
      muted: '25 18% 92%',
      mutedForeground: '22 12% 40%',
      border: '25 15% 88%',
    },
    dark: {
      primary: '21 85% 58%',
      primaryForeground: '21 30% 10%',
      ring: '21 85% 58%',
      accent: '22 18% 20%',
      chart1: '21 85% 58%',
      background: '22 24% 8%',
      card: '22 22% 11%',
      foreground: '25 15% 94%',
      muted: '22 18% 20%',
      mutedForeground: '22 10% 65%',
      border: '22 18% 20%',
    },
  },
};

/**
 * Desloca só o L de uma string "H S% L%", mantendo matiz e saturação.
 * Usado para derivar os níveis de elevação a partir da superfície do card,
 * em vez de manter 24 valores escritos à mão que saem de sincronia.
 */
function shiftLightness(hsl: string, delta: number): string {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length !== 3) return hsl;
  const l = Number.parseFloat(parts[2]);
  if (Number.isNaN(l)) return hsl;
  const next = Math.min(100, Math.max(0, l + delta));
  return `${parts[0]} ${parts[1]} ${Math.round(next * 10) / 10}%`;
}

/**
 * Estados interativos do primary.
 *
 * Antes o hover e o ativo eram `bg-primary/90` e `bg-primary/80`, ou seja,
 * transparência. Isso desbota o botão contra a página em vez de escurecê-lo:
 * branco sobre primary/80 media 3.76:1, reprovado em AA, e nenhuma
 * luminosidade de primary resolve enquanto o estado for transparência.
 *
 * Agora os dois estados são cores sólidas. No claro o botão escurece ao ser
 * pressionado; no escuro clareia, porque ali o primary já é o elemento claro
 * sobre fundo escuro e escurecer leria como "apagando".
 */
export function primaryStates(mode: ThemeModeTokens, isDark: boolean) {
  const passo = isDark ? [4, 8] : [-4, -8];
  return {
    hover: shiftLightness(mode.primary, passo[0]),
    active: shiftLightness(mode.primary, passo[1]),
  };
}

export type SurfaceScale = {
  surface0: string;
  surface1: string;
  surface2: string;
  surface3: string;
};

/**
 * Escala de elevação por superfície.
 *
 * No claro, a elevação vem sobretudo da sombra — as superfícies já estão perto
 * do branco e não há para onde clarear. No escuro é o inverso: sombra sobre
 * fundo escuro quase não aparece, então cada nível precisa ficar visivelmente
 * mais claro que o anterior. Daí os deltas assimétricos.
 */
export function surfaceScale(mode: ThemeModeTokens, isDark: boolean): SurfaceScale {
  const steps = isDark ? [3.5, 7] : [0.6, 1];
  return {
    surface0: mode.background,
    surface1: mode.card,
    surface2: shiftLightness(mode.card, steps[0]),
    surface3: shiftLightness(mode.card, steps[1]),
  };
}

export const materiaColors: Record<string, string> = {
  'Matemática': '#60B5FF',
  'Português': '#FF9149',
  'Biologia': '#80D8C3',
  'Química': '#A19AD3',
  'Física': '#FF6363',
  'História': '#FF9898',
  'Geografia': '#72BF78',
  'Filosofia': '#FF90BB',
  'Sociologia': '#B8860B',
  'Literatura': '#E07C24',
};
