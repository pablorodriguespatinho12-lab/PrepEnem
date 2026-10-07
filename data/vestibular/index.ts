import { chaveVestibular, type QuestaoVestibular } from '@/lib/vestibular/tipos';
import { FUVEST } from './fuvest';
import { IME_2024 } from './ime-2024';
import { ITA_2025 } from './ita-2025';
import { UNESP_2025 } from './unesp-2025';
import { UNICAMP_2024 } from './unicamp-2024';

export const QUESTOES_VESTIBULAR: QuestaoVestibular[] = [...ITA_2025, ...IME_2024, ...FUVEST, ...UNICAMP_2024, ...UNESP_2025];

/* A mesma chave do banco: Question.origem + numeroQuestao. */
export function acharQuestaoVestibular(origem: string | null | undefined, numero: number | null | undefined): QuestaoVestibular | null {
  if (!origem || numero == null) return null;
  return QUESTOES_VESTIBULAR.find((q) => chaveVestibular(q) === origem && q.numero === numero) ?? null;
}
