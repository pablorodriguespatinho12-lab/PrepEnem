import type { Aula } from '@/lib/descobrir/tipos';
import { velocidadeMedia } from './velocidade-media';
import { funcaoAfim } from './funcao-afim';
import { paPg } from './pa-pg';
import { retaEDistancia } from './reta-e-distancia';
import { areaDistancia } from './area-distancia';
import { torricelli } from './torricelli';

export const AULAS: Aula[] = [velocidadeMedia, funcaoAfim, paPg, retaEDistancia, areaDistancia, torricelli];

export const aulaPorId = (id: string) => AULAS.find((a) => a.id === id) ?? null;
