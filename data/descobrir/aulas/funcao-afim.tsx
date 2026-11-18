/* Função afim = a mesma reta do carro (s = 5 + 3 · t) com outros nomes: y = b + a · x. */
import type { Aula } from '@/lib/descobrir/tipos';
import { Az, Caixa, Definicao, Eq, Fr, Linha, Lj, Novo, Tabela } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const base: PlanoProps = {
  x: { max: 4, passo: 1, nome: 'x' },
  y: { max: 16, passo: 4, nome: 'y' },
  rotulo: 'Plano cartesiano com a reta y = 5 + 3 · x',
};
const PONTOS: Ponto[] = [[0, 5], [1, 8], [2, 11], [3, 14]];
const RETA: [Ponto, Ponto] = [[0, 5], [11 / 3, 16]];
const TAXI: Ponto[] = [[0, 4], [1, 6], [2, 8], [3, 10]];
const baseTaxi: PlanoProps = {
  x: { max: 4, passo: 1, nome: 'distância', unidade: 'km' },
  y: { max: 12, passo: 4, nome: 'preço', unidade: 'R$' },
  rotulo: 'Preço do táxi: começa em 4 reais e sobe 2 reais por km',
};
const PROVA: Ponto[] = [[0, 4], [2, 10]];

export const funcaoAfim: Aula = {
  id: 'funcao-afim',
  titulo: 'Função afim',
  treino: ['Matemática 5 · Funções', 'Matemática 4 · Equações e Sistemas'],
  passos: [
    { nome: 'A reta do carro', frase: 'Na velocidade média, a reta do carro deu s = 5 + 3 · t.',
      esquerda: <Eq><Linha><Caixa>s = 5 + 3 · t</Caixa></Linha></Eq>,
      direita: <Plano {...base} x={{ ...base.x, nome: 'tempo', unidade: 's' }} y={{ ...base.y, nome: 'posição', unidade: 'm' }} pontos={PONTOS} reta={RETA} /> },
    { nome: 'Troco os nomes', frase: 'Na matemática, o de baixo vira x e o do lado vira y.',
      esquerda: <Eq>
        <Linha>s = 5 + 3 · t</Linha>
        <Linha op="s vira y, t vira x" atraso={0.5}><Novo>y</Novo> = 5 + 3 · <Novo>x</Novo></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={PONTOS} reta={RETA} /> },
    { nome: 'Em letras', frase: 'Toda reta tem um começo e uma subida.',
      esquerda: <Eq>
        <Linha>y = <Lj>5</Lj> + <Az>3</Az> · x</Linha>
        <Linha op="começo b, subida a" atraso={0.5}>y = <Lj><Novo>b</Novo></Lj> + <Az><Novo>a</Novo></Az> · x</Linha>
      </Eq>,
      direita: <Plano {...base} pontos={PONTOS} reta={RETA} /> },
    { nome: 'Achar o b', frase: 'b é onde a reta corta o eixo do y, quando x = 0.',
      esquerda: <><Eq><Linha>y = <Lj><Novo>b</Novo></Lj> + a · x</Linha></Eq>
        <Definicao linhas={[['b', 'o y quando x = 0'], ['aqui', 'y = 5 + 3 · 0 = 5']]} /></>,
      direita: <Plano {...base} pontos={[[0, 5]]} guias reta={RETA} /> },
    { nome: 'Achar o a', frase: 'a é quanto o y sobe quando o x anda 1.',
      esquerda: <><Eq><Linha>y = b + <Az><Novo>a</Novo></Az> · x</Linha></Eq>
        <Definicao linhas={[['a', 'Δy ÷ Δx'], ['aqui', '(11 − 5) ÷ (2 − 0) = 6 ÷ 2 = 3']]} /></>,
      direita: <Plano {...base} reta={RETA} segmentos={[
        { de: [0, 5], para: [2, 5], cor: 'az', rotulo: 'Δx = 2' },
        { de: [2, 5], para: [2, 11], cor: 'lj', rotulo: 'Δy = 6' }]} /> },
    { nome: 'Outra reta, a mesma regra', frase: 'Táxi: R$ 4 para entrar e R$ 2 por km.',
      esquerda: <><Tabela cabecalho={['km', 'preço']} linhas={TAXI.map(([k, p]) => [k, `R$ ${p}`])} />
        <Eq><Linha atraso={1}>y = <Lj>4</Lj> + <Az>2</Az> · x</Linha></Eq></>,
      direita: <Plano {...baseTaxi} pontos={TAXI} reta={[[0, 4], [4, 12]]} /> },
    { nome: 'Volta na equação', frase: 'Dois pontos da reta bastam para achar a e b.',
      esquerda: <Eq>
        <Linha op="o subiu ÷ o andou"><Az>a</Az> = <Fr cima="11 − 5" baixo="2 − 0" /> = 3</Linha>
        <Linha op="o y com x = 0" atraso={0.5}><Lj>b</Lj> = 5</Linha>
        <Linha atraso={1}><Caixa>y = 5 + 3 · x</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} pontos={[[0, 5], [2, 11]]} reta={RETA} /> },
  ],
  prova: {
    inicio: <Linha op="a regra de toda reta">y = b + a · x</Linha>,
    etapas: [
      { pede: 'Ache a reta que passa por (0, 4) e (2, 10). Quanto vale b?', certa: 0,
        opcoes: ['b = 4', 'b = 0', 'b = 10'],
        erros: ['', 'Com x = 0 a conta fica y = b. E ali o y é 4.', '10 é o y do outro ponto, onde x = 2.'],
        linha: <Linha op="x = 0 dá y = b">y = <Lj>4</Lj> + a · x</Linha> },
      { pede: 'Agora o a: quanto o y subiu, dividido por quanto o x andou?', certa: 0,
        opcoes: ['(10 − 4) ÷ (2 − 0)', '10 ÷ 2', '(2 − 0) ÷ (10 − 4)'],
        erros: ['', '10 ÷ 2 esquece que a reta já começou no 4.', 'Invertido: é o y que sobe dividido pelo x que anda.'],
        linha: <Linha op="subiu 6, andou 2"><Az>a</Az> = <Fr cima="10 − 4" baixo="2 − 0" /> = <Fr cima="6" baixo="2" /> = 3</Linha> },
      { pede: 'Confira com x = 1: quanto dá y = 4 + 3 · x?', certa: 1,
        opcoes: ['5', '7', '3'],
        erros: ['Isso é 4 + 1. O a vale 3: soma 3 × 1.', '', '3 é só a subida; falta o 4 do começo.'],
        linha: <Linha op="fica entre 4 e 10">y = 4 + 3 · 1 = <Caixa>7</Caixa></Linha> },
    ],
    provado: 'Provado: y = 4 + 3 · x passa pelos dois pontos.',
    desenho: <Plano {...base} pontos={PROVA} reta={[[0, 4], [4, 16]]} />,
  },
};
