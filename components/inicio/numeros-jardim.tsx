'use client';
import { Contador } from '@/components/visual/jardim/contador';
import { diasDoGrafico } from '@/lib/evolucao-diaria';
import { diaNoBrasil } from '@/lib/dia-brasil';

type Stats = {
  totalRespondidas: number;
  totalAcertos: number;
  dailyData: Record<string, { total: number; acertos: number }>;
};

/* Limiares de dado esparso (decisoes-prepenem): menos de 5 respostas não tem %. */
const MINIMO_PARA_TAXA = 5;
const TAXA_CONFIAVEL = 15;

/* Os três cartões de números do Início no modo Jardim (prévia de 26/11/2026). */
export function NumerosJardim({ stats }: { stats: Stats | null }) {
  const total = stats?.totalRespondidas ?? 0;
  const acertos = stats?.totalAcertos ?? 0;
  const agora = new Date();
  const hoje = stats?.dailyData?.[diaNoBrasil(agora)]?.total ?? 0;
  const dias = diasDoGrafico(stats?.dailyData ?? {}, agora, 7);
  const maior = Math.max(1, ...dias.map((d) => d.acertos + d.erros));
  const temTaxa = total >= MINIMO_PARA_TAXA;
  const taxa = temTaxa ? Math.round((acertos / total) * 100) : 0;

  return (
    <>
      <section className="m-cartao m-col4 so-jardim jv-entra" aria-label="Questões feitas">
        <h2>Questões feitas</h2>
        <div className="m-numero px" data-numeric>{stats ? <Contador valor={total} /> : '–'}</div>
        <p className="m-mut" data-numeric>{hoje > 0 ? `+${hoje} hoje` : 'nenhuma hoje'}</p>
      </section>

      <section className="m-cartao m-col4 so-jardim jv-entra" aria-label="Acertos">
        <h2>Acertos</h2>
        <svg className="jv-anel-taxa" viewBox="0 0 40 40" aria-hidden>
          <circle cx="20" cy="20" r="15.9" />
          <circle className="jv-parte" cx="20" cy="20" r="15.9" style={{ strokeDashoffset: 100 - taxa }} />
        </svg>
        <p className="m-mut" data-numeric>
          {!stats
            ? 'Carregando'
            : !temTaxa
              ? `${acertos} de ${total} respostas`
              : `${taxa}%${total < TAXA_CONFIAVEL ? ' · ainda poucas respostas' : ` · ${acertos} certas`}`}
        </p>
      </section>

      <section className="m-cartao m-col4 so-jardim jv-entra" aria-label="Últimos 7 dias">
        <h2>Últimos 7 dias</h2>
        <ul className="jv-dias">
          {dias.map((d, i) => {
            const n = d.acertos + d.erros;
            return (
              <li key={d.data} style={{ height: `${n ? 12 + (n / maior) * 88 : 6}%`, animationDelay: `${300 + i * 60}ms` }} data-vazio={n ? undefined : 'sim'}>
                <span className="sr-only">{d.data}: {n} {n === 1 ? 'questão' : 'questões'}</span>
              </li>
            );
          })}
        </ul>
        <p className="m-mut">cada barra é um dia</p>
      </section>
    </>
  );
}
