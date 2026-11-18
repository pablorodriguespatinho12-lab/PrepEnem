/* PA × PG: o carro que soma (5, 8, 11, 14: a mesma reta da velocidade média, em
   passos) e o contador que dobra (2, 4, 8, 16). Ele não sabia PG (17/11/2026). */
import type { Aula } from '@/lib/descobrir/tipos';
import { Caixa, Definicao, Eq, Linha, Lj, Novo, Tabela } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const base: PlanoProps = {
  x: { max: 5, passo: 1, nome: 'passo n' },
  y: { max: 32, passo: 8, nome: 'valor' },
  rotulo: 'Pontos da PA (somando 3) e da PG (dobrando)',
};
const PA: Ponto[] = [[1, 5], [2, 8], [3, 11], [4, 14], [5, 17]];
const PG: Ponto[] = [[1, 2], [2, 4], [3, 8], [4, 16], [5, 32]];
const sub = (l: string, i: string) => <span>{l}<sub>{i}</sub></span>;
const pot = (b: string, e: string) => <span>{b}<sup>{e}</sup></span>;

export const paPg: Aula = {
  id: 'pa-pg',
  titulo: 'PA × PG',
  treino: ['Matemática 5 · Funções'],
  passos: [
    { nome: 'Dois jeitos de crescer', frase: 'Um soma 3 a cada passo. O outro dobra.',
      esquerda: <Tabela cabecalho={['passo', 'soma 3', 'dobra']} linhas={PA.map(([n, a], i) => [n, a, PG[i][1]])} />,
      direita: <Plano {...base} pontos={PA} pontos2={PG} /> },
    { nome: 'O que soma é uma reta', frase: 'Sobe sempre igual: é a função afim, em passos. Chama PA.',
      esquerda: <Eq>
        <Linha>8 − 5 = 3</Linha>
        <Linha atraso={0.3}>11 − 8 = 3</Linha>
        <Linha op="razão da PA: quanto soma" atraso={0.7}><Caixa>r = 3</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={PA} reta={[[1, 5], [5, 17]]} /> },
    { nome: 'O que dobra não é reta', frase: 'Cada passo sobe mais que o anterior. Chama PG.',
      esquerda: <Eq>
        <Linha>4 ÷ 2 = 2</Linha>
        <Linha atraso={0.3}>8 ÷ 4 = 2</Linha>
        <Linha op="razão da PG: quanto multiplica" atraso={0.7}><Caixa>q = 2</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos2={PG} /> },
    { nome: 'A PA em letras', frase: 'Para chegar no passo 4, somo o 3 três vezes.',
      esquerda: <Eq>
        <Linha>{sub('a', '4')} = 5 + 3 + 3 + 3</Linha>
        <Linha op="três vezes o 3" atraso={0.4}>{sub('a', '4')} = 5 + <Novo>3</Novo> · 3 = 14</Linha>
        <Linha op="troca os números" atraso={0.9}><Caixa>{sub('a', 'n')} = {sub('a', '1')} + (n − 1) · r</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={PA} reta={[[1, 5], [5, 17]]} /> },
    { nome: 'Achar o n − 1', frase: 'Do passo 1 até o passo 4 são 3 pulos, não 4.',
      esquerda: <Definicao linhas={[['n − 1', 'quantos pulos depois do 1º'], ['aqui', '4 − 1 = 3']]} />,
      direita: <Plano {...base} pontos={PA.slice(0, 4)} reta={[[1, 5], [4, 14]]} /> },
    { nome: 'A PG em letras', frase: 'Na PG, em vez de somar, multiplico.',
      esquerda: <Eq>
        <Linha>{sub('a', '4')} = 2 · 2 · 2 · 2 = 16</Linha>
        <Linha op="3 pulos de × 2" atraso={0.4}>{sub('a', '4')} = 2 · <Lj>{pot('2', '3')}</Lj></Linha>
        <Linha op="troca os números" atraso={0.9}><Caixa>{sub('a', 'n')} = {sub('a', '1')} · {pot('q', 'n − 1')}</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos2={PG.slice(0, 4)} /> },
    { nome: 'Volta nas equações', frase: 'No passo 10, a PG já passou longe.',
      esquerda: <Eq>
        <Linha op="PA">{sub('a', '10')} = 5 + 9 · 3 = <Caixa>32</Caixa></Linha>
        <Linha op="PG" atraso={0.6}>{sub('a', '10')} = 2 · {pot('2', '9')} = 2 · 512 = <Caixa>1 024</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={PA} pontos2={PG} /> },
  ],
  prova: {
    inicio: <Linha op="a regra da PA">{sub('a', 'n')} = {sub('a', '1')} + (n − 1) · r</Linha>,
    etapas: [
      { pede: 'Ache o 6º termo da PA 4, 7, 10... Qual é a razão r?', certa: 0,
        opcoes: ['3', '4', '7'],
        erros: ['', '4 é o primeiro termo, o a₁.', '7 é o segundo termo. A razão é quanto sobe: 7 − 4.'],
        linha: <Linha op="quanto sobe">r = 7 − 4 = 3</Linha> },
      { pede: 'Do 1º ao 6º termo, quantos pulos?', certa: 0,
        opcoes: ['5', '6', '7'],
        erros: ['', 'O 1º termo já está lá: são 6 − 1 pulos.', 'Contou dois a mais. São 6 − 1 = 5.'],
        linha: <Linha op="n − 1 = 5">{sub('a', '6')} = 4 + 5 · 3</Linha> },
      { pede: 'Quanto dá 4 + 5 · 3?', certa: 0,
        opcoes: ['19', '22', '27'],
        erros: ['', 'Esse é 4 + 6 · 3: um pulo a mais.', 'Somou antes de multiplicar. Primeiro o vezes: 5 · 3 = 15.'],
        linha: <Linha op="4, 7, 10, 13, 16, 19">{sub('a', '6')} = 4 + 15 = <Caixa>19</Caixa></Linha> },
    ],
    provado: 'Provado: o 6º termo é 19. A regra pula direto, sem escrever a lista.',
    desenho: <Plano x={{ max: 6, passo: 1, nome: 'passo n' }} y={{ max: 20, passo: 4, nome: 'valor' }} rotulo="A PA 4, 7, 10, 13, 16, 19"
      pontos={[[1, 4], [2, 7], [3, 10], [4, 13], [5, 16], [6, 19]]} reta={[[1, 4], [6, 19]]} />,
  },
};
