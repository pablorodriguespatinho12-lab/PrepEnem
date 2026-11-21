/* Meta de provas por dia (Pablo, 21/11/2026: "umas 2 provas por dia"). A meta fica no aparelho
   (localStorage); quantas provas ele terminou hoje vem do servidor (CustomExam.finishedAt). */

export const OPCOES_DA_META = [1, 2, 3, 4] as const;
export const META_PADRAO = 2;
const CHAVE = 'prepenem:meta-provas-dia';

export type ProgressoDaMeta = {
  feitas: number;
  meta: number;
  restam: number;
  bateu: boolean;
};

export function metaValida(valor: unknown): valor is (typeof OPCOES_DA_META)[number] {
  return typeof valor === 'number' && (OPCOES_DA_META as readonly number[]).includes(valor);
}

export function progressoDaMeta(feitas: number, meta: number): ProgressoDaMeta {
  const feitasOk = Math.max(0, Math.floor(feitas));
  return { feitas: feitasOk, meta, restam: Math.max(0, meta - feitasOk), bateu: feitasOk >= meta };
}

export function lerMeta(): number {
  try {
    const valor = Number(window.localStorage.getItem(CHAVE));
    return metaValida(valor) ? valor : META_PADRAO;
  } catch {
    return META_PADRAO;
  }
}

export function guardarMeta(meta: number): void {
  try {
    window.localStorage.setItem(CHAVE, String(meta));
  } catch {
    /* sem armazenamento: a meta volta ao padrão na próxima visita */
  }
}
