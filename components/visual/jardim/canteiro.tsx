'use client';
import { Planta } from '@/components/visual/jardim/desenhos';
import { FaixaJardim } from '@/components/visual/jardim/faixa';
import { canteiroDeEstudo, DIAS_DO_CANTEIRO } from '@/lib/jardim/canteiro';

const ATRASO_POR_PLANTA = 25;

export function CanteiroJardim({ porDia }: { porDia: Record<string, { total: number }> }) {
  const dias = canteiroDeEstudo(porDia, new Date());
  const plantados = dias.filter((d) => d.questoes > 0).length;
  const titulo = plantados === 0 ? 'Seu jardim começa hoje' : `${plantados} ${plantados === 1 ? 'dia plantado' : 'dias plantados'}`;
  return (
    <>
      <FaixaJardim arte="biologia" sobre="Seu jardim de estudo" titulo={titulo} nota={`cada dia estudado nos últimos ${DIAS_DO_CANTEIRO} vira uma planta`} />
      <ul className="so-jardim jv-canteiro" aria-label="Um canteiro por dia">
        {dias.map((d, i) => {
          const legenda = `${d.data}: ${d.questoes} ${d.questoes === 1 ? 'questão' : 'questões'}`;
          return (
            <li key={d.data} title={legenda}>
              <Planta estagio={d.estagio} atraso={i * ATRASO_POR_PLANTA} />
              <span className="sr-only">{legenda}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
