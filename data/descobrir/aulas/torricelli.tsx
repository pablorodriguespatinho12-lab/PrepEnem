/* Torricelli provado pela área: v = v₀ + a · t (a reta) e d = (v₀ + v) ÷ 2 · t (o
   trapézio). Tirando o t de uma e pondo na outra, sai v² = v₀² + 2 · a · d. */
import type { ReactNode } from 'react';
import type { Aula } from '@/lib/descobrir/tipos';
import { Caixa, Corta, Eq, Fr, Linha, Lj, Novo, Raiz, Tabela } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const base: PlanoProps = {
  x: { max: 4, passo: 1, nome: 'tempo', unidade: 's' },
  y: { max: 8, passo: 2, nome: 'velocidade', unidade: 'm/s' },
  rotulo: 'Gráfico da velocidade pelo tempo: de 2 a 8 m/s em 3 segundos',
};
const SOBE: Ponto[] = [[0, 2], [1, 4], [2, 6], [3, 8]];
const TRAP: Ponto[] = [[0, 0], [3, 0], [3, 8], [0, 2]];
const RETA: [Ponto, Ponto] = [[0, 2], [3, 8]];
const v0 = <span>v<sub>0</sub></span>;
const q = (t: ReactNode) => <span>{t}<sup>2</sup></span>;

export const torricelli: Aula = {
  id: 'torricelli',
  titulo: 'Torricelli',
  treino: ['Física 1 · Cinemática'],
  passos: [
    { nome: 'O carro da área', frase: 'O mesmo carro: de 2 m/s para 8 m/s em 3 s, andando 15 m.',
      esquerda: <Tabela cabecalho={['tempo', 'velocidade']} linhas={SOBE.map(([t, v]) => [`${t} s`, `${v} m/s`])} />,
      direita: <Plano {...base} pontos={SOBE} reta={RETA} area={TRAP} areaRotulo={{ em: [1.5, 2], texto: '15 m' }} /> },
    { nome: 'Quanto sobe por segundo', frase: 'A velocidade sobe 2 m/s a cada segundo: é a aceleração.',
      esquerda: <Eq>
        <Linha>4 − 2 = <Lj>2</Lj></Linha>
        <Linha atraso={0.3}>6 − 4 = <Lj>2</Lj></Linha>
        <Linha atraso={0.6}>8 − 6 = <Lj>2</Lj></Linha>
        <Linha op="aceleração" atraso={0.9}><Caixa>a = 2 m/s²</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={SOBE} reta={RETA} /> },
    { nome: 'Duas regras que já temos', frase: 'Uma vem da reta, a outra da área.',
      esquerda: <Eq>
        <Linha op="a reta: começa em v₀ e sobe a por segundo">v = {v0} + a · t</Linha>
        <Linha op="confere: 2 + 2 · 3 = 8" atraso={0.3}>v = 2 + 2 · 3 = 8</Linha>
        <Linha op="a área do trapézio" atraso={0.8}>d = <Fr cima={<>{v0} + v</>} baixo="2" /> · t</Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} area={TRAP} /> },
    { nome: 'Sem o tempo', frase: 'Muita questão não dá o t. Tiro o t da reta.',
      esquerda: <Eq>
        <Linha>v = {v0} + a · t</Linha>
        <Linha op="− v₀ dos dois lados" atraso={0.5}>v <Novo>− {v0}</Novo> = a · t</Linha>
        <Linha op="÷ a dos dois lados" atraso={1.1}><Caixa>t = <Fr cima={<>v − {v0}</>} baixo="a" /></Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} /> },
    { nome: 'Troca o t na área', frase: 'Ponho essa conta no lugar do t.',
      esquerda: <Eq>
        <Linha>d = <Fr cima={<>{v0} + v</>} baixo="2" /> · <Novo>t</Novo></Linha>
        <Linha op="t = (v − v₀) ÷ a" atraso={0.5}>d = <Fr cima={<>{v0} + v</>} baixo="2" /> · <Novo><Fr cima={<>v − {v0}</>} baixo="a" /></Novo></Linha>
        <Linha op="junta as frações" atraso={1.1}>d = <Fr cima={<>(v + {v0}) · (v − {v0})</>} baixo="2 · a" /></Linha>
      </Eq> },
    { nome: 'A conta que cancela', frase: 'Com números: (8 + 2) · (8 − 2) dá o mesmo que 8² − 2².',
      esquerda: <Eq>
        <Linha op="primeiro com números">(8 + 2) · (8 − 2) = 10 · 6 = 60</Linha>
        <Linha atraso={0.4}>{q('8')} − {q('2')} = 64 − 4 = 60</Linha>
        <Linha op="cada termo vezes cada termo" atraso={0.9}>(v + {v0}) · (v − {v0}) = v · v <Corta>− v · {v0}</Corta> <Corta>+ {v0} · v</Corta> − {v0} · {v0}</Linha>
        <Linha op="os do meio se cancelam" atraso={1.6}><Caixa>{q('v')} − {q(v0)}</Caixa></Linha>
      </Eq> },
    { nome: 'Solta o v²', frase: 'Faço a mesma coisa dos dois lados até o v² ficar sozinho.',
      esquerda: <Eq>
        <Linha>d = <Fr cima={<>{q('v')} − {q(v0)}</>} baixo="2 · a" /></Linha>
        <Linha op="× 2 · a dos dois lados" atraso={0.5}><Novo>2 · a ·</Novo> d = {q('v')} − {q(v0)}</Linha>
        <Linha op="+ v₀² dos dois lados" atraso={1.1}><Caixa>{q('v')} = {q(v0)} + 2 · a · d</Caixa></Linha>
      </Eq> },
    { nome: 'Volta com os números', frase: 'O mesmo carro: v₀ = 2, a = 2 e d = 15.',
      esquerda: <Eq>
        <Linha>{q('v')} = {q('2')} + 2 · 2 · 15</Linha>
        <Linha atraso={0.4}>{q('v')} = 4 + 60 = 64</Linha>
        <Linha op="bate com a tabela" atraso={0.8}>v = <Raiz>64</Raiz> = <Caixa>8 m/s</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={[[3, 8]]} guias reta={RETA} area={TRAP} /> },
  ],
  prova: {
    inicio: <Linha op="Torricelli">{q('v')} = {q(v0)} + 2 · a · d</Linha>,
    etapas: [
      { pede: 'Um carro sai parado (v₀ = 0), com a = 4 m/s², e anda 8 m. O que vira o v₀²?', certa: 0,
        opcoes: ['0', '2', 'v₀'],
        erros: ['', '0 × 0 é 0, não 2.', 'Troque pelo número: v₀ vale 0.'],
        linha: <Linha op="2 · 4 · 8 = 64">{q('v')} = 0 + 2 · 4 · 8 = 64</Linha> },
      { pede: 'Ficou v² = 64. Como achar o v?', certa: 0,
        opcoes: ['√ dos dois lados', '÷ 2 dos dois lados', '÷ 64 dos dois lados'],
        erros: ['', 'v² é v × v. Dividir por 2 dá 32, e 32 × 32 não é 64.', 'Fica v² ÷ 64 = 1: o v continua preso.'],
        linha: <Linha op="8 × 8 = 64">v = <Raiz>64</Raiz> = <Caixa>8 m/s</Caixa></Linha> },
      { pede: 'Confira pelo caminho longo: com a = 4, quanto tempo até 8 m/s?', certa: 0,
        opcoes: ['2 s', '4 s', '32 s'],
        erros: ['', 'Em 4 s a velocidade chegaria a 4 × 4 = 16 m/s.', 'Multiplicou. O tempo é 8 ÷ 4.'],
        linha: <Linha op="bate com os 8 m">t = 8 ÷ 4 = 2 s, d = <Fr cima="0 + 8" baixo="2" /> · 2 = 8 m</Linha> },
    ],
    provado: 'Provado: v² = v₀² + 2 · a · d acha a velocidade sem saber o tempo.',
    desenho: <Plano x={{ max: 3, passo: 1, nome: 'tempo', unidade: 's' }} y={{ max: 8, passo: 2, nome: 'velocidade', unidade: 'm/s' }}
      rotulo="De 0 a 8 m/s em 2 segundos" reta={[[0, 0], [2, 8]]} area={[[0, 0], [2, 0], [2, 8]]} areaRotulo={{ em: [1.4, 2.2], texto: '8 m' }} />,
  },
};
