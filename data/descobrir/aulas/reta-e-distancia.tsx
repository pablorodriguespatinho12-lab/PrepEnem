/* Distância entre dois pontos = Pitágoras no plano: o caminho pela grade vira os
   dois lados do triângulo, e a linha reta é o lado maior. */
import type { Aula } from '@/lib/descobrir/tipos';
import { Az, Caixa, Definicao, Eq, Linha, Lj, Novo, Raiz, Tabela, Vd } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const base: PlanoProps = {
  x: { max: 5, passo: 1, nome: 'x' },
  y: { max: 7, passo: 1, nome: 'y' },
  rotulo: 'Mapa com grade: a casa no ponto (1, 2) e a escola no ponto (4, 6)',
};
const CASA: Ponto = [1, 2];
const ESCOLA: Ponto = [4, 6];
const DX = { de: CASA, para: [4, 2] as Ponto, cor: 'az' as const, rotulo: 'Δx = 3' };
const DY = { de: [4, 2] as Ponto, para: ESCOLA, cor: 'lj' as const, rotulo: 'Δy = 4' };
const q = (t: string) => <span>{t}<sup>2</sup></span>;

export const retaEDistancia: Aula = {
  id: 'reta-e-distancia',
  titulo: 'Reta e distância',
  treino: ['Matemática 6 · Geometria Plana'],
  passos: [
    { nome: 'Dois pontos', frase: 'Num mapa com grade, a casa está em (1, 2) e a escola em (4, 6).',
      esquerda: <Tabela cabecalho={['lugar', 'x', 'y']} linhas={[['casa', 1, 2], ['escola', 4, 6]]} />,
      direita: <Plano {...base} pontos={[CASA, ESCOLA]} guias /> },
    { nome: 'A linha reta', frase: 'Quanto mede a linha reta da casa até a escola?',
      esquerda: <Eq><Linha><Vd>d</Vd> = ?</Linha></Eq>,
      direita: <Plano {...base} pontos={[CASA, ESCOLA]} reta={[CASA, ESCOLA]} /> },
    { nome: 'Vira um triângulo', frase: 'Pela grade: 3 para o lado e 4 para cima.',
      esquerda: <Eq>
        <Linha op="para o lado"><Az>4 − 1 = 3</Az></Linha>
        <Linha op="para cima" atraso={0.4}><Lj>6 − 2 = 4</Lj></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={[CASA, ESCOLA]} reta={[CASA, ESCOLA]} segmentos={[DX, DY]} /> },
    { nome: 'Pitágoras', frase: 'No triângulo de canto reto, o lado maior ao quadrado é a soma dos outros dois ao quadrado.',
      esquerda: <Eq>
        <Linha op="ao quadrado = vezes ele mesmo">{q('3')} = 3 × 3 = 9</Linha>
        <Linha op="Pitágoras" atraso={0.5}><Vd>{q('d')}</Vd> = <Az>{q('Δx')}</Az> + <Lj>{q('Δy')}</Lj></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[CASA, ESCOLA]} segmentos={[DX, DY]} /> },
    { nome: 'Achar o Δx', frase: 'Δx é o pedaço deitado do triângulo.',
      esquerda: <><Eq><Linha>{q('d')} = <Az><Novo>{q('Δx')}</Novo></Az> + {q('Δy')}</Linha></Eq>
        <Definicao linhas={[['Δx', 'x do fim − x do começo'], ['aqui', '4 − 1 = 3']]} /></>,
      direita: <Plano {...base} reta={[CASA, ESCOLA]} segmentos={[DX]} /> },
    { nome: 'Achar o Δy', frase: 'Δy é o pedaço em pé do triângulo.',
      esquerda: <><Eq><Linha>{q('d')} = {q('Δx')} + <Lj><Novo>{q('Δy')}</Novo></Lj></Linha></Eq>
        <Definicao linhas={[['Δy', 'y do fim − y do começo'], ['aqui', '6 − 2 = 4']]} /></>,
      direita: <Plano {...base} reta={[CASA, ESCOLA]} segmentos={[DY]} /> },
    { nome: 'Volta na equação', frase: 'Põe os números e acha o d.',
      esquerda: <Eq>
        <Linha>{q('d')} = <Az>{q('3')}</Az> + <Lj>{q('4')}</Lj></Linha>
        <Linha op="3 × 3 e 4 × 4" atraso={0.4}>{q('d')} = 9 + 16 = 25</Linha>
        <Linha op="que número vezes ele mesmo dá 25?" atraso={0.8}><Caixa><Vd>d</Vd> = 5</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={[CASA, ESCOLA]} reta={[CASA, ESCOLA]} segmentos={[DX, DY]} /> },
    { nome: 'A equação se transforma', frase: 'Solto o d: tiro a raiz dos dois lados.',
      esquerda: <Eq>
        <Linha>{q('d')} = {q('Δx')} + {q('Δy')}</Linha>
        <Linha op="√ dos dois lados" atraso={0.6}><Caixa>d = <Raiz>{q('Δx')} + {q('Δy')}</Raiz></Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[CASA, ESCOLA]} segmentos={[DX, DY]} /> },
  ],
  prova: {
    inicio: <Linha op="Pitágoras no plano">{q('d')} = {q('Δx')} + {q('Δy')}</Linha>,
    etapas: [
      { pede: 'Ache a distância de (0, 0) até (6, 8). Quanto valem Δx e Δy?', certa: 0,
        opcoes: ['Δx = 6 e Δy = 8', 'Δx = 8 e Δy = 6', 'Δx = 0 e Δy = 0'],
        erros: ['', 'Trocou: Δx é o que anda no x, de 0 até 6.', 'Δ é fim menos começo: 6 − 0 e 8 − 0.'],
        linha: <Linha op="6 × 6 e 8 × 8">{q('d')} = 36 + 64 = 100</Linha> },
      { pede: 'Ficou d² = 100. Como soltar o d?', certa: 0,
        opcoes: ['√ dos dois lados', '÷ 2 dos dois lados', '− 100 dos dois lados'],
        erros: ['', 'd² é d × d, não d + d: dividir por 2 não desfaz.', 'Fica d² − 100 = 0: o d continua preso.'],
        linha: <Linha op="10 × 10 = 100">d = <Raiz>100</Raiz> = <Caixa>10</Caixa></Linha> },
      { pede: 'A distância podia ser 6 + 8 = 14?', certa: 1,
        opcoes: ['Sim', 'Não: a linha reta é mais curta'],
        erros: ['14 é o caminho andando pela grade, em L. A linha reta corta caminho.', ''],
        linha: <Linha op="a reta é o atalho">10 &lt; 6 + 8 = 14</Linha> },
    ],
    provado: 'Provado: d = √(Δx² + Δy²) mede a linha reta entre dois pontos.',
    desenho: <Plano x={{ max: 6, passo: 2, nome: 'x' }} y={{ max: 8, passo: 2, nome: 'y' }} rotulo="Do ponto (0, 0) ao ponto (6, 8)"
      pontos={[[0, 0], [6, 8]]} reta={[[0, 0], [6, 8]]}
      segmentos={[{ de: [0, 0], para: [6, 0], cor: 'az', rotulo: '6', lado: 'cima' }, { de: [6, 0], para: [6, 8], cor: 'lj', rotulo: '8', lado: 'esquerda' }]} />,
  },
};
