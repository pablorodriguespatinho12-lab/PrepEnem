/* Velocidade média: a amostra que o Pablo aprovou (17/11/2026, "legal"), igual
   a docs/descobrir/amostra-velocidade-media.html. */
import type { Aula } from '@/lib/descobrir/tipos';
import { Az, Caixa, Corta, Definicao, Eq, Fr, Linha, Lj, Novo, Tabela, Vd } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const PONTOS: Ponto[] = [[0, 5], [1, 8], [2, 11], [3, 14]];
const VIAGEM_POR_PONTO = 1.5;
const base: PlanoProps = {
  x: { max: 4, passo: 1, nome: 'tempo', unidade: 's' },
  y: { max: 16, passo: 4, nome: 'posição', unidade: 'm' },
  rotulo: 'Plano cartesiano: tempo em segundos embaixo e posição em metros do lado',
};
const RETA: [Ponto, Ponto] = [[0, 5], [11 / 3, 16]];
const DT = { de: [0, 5] as Ponto, para: [3, 5] as Ponto, cor: 'az' as const, rotulo: 'Δt = 3 s' };
const DS = { de: [3, 5] as Ponto, para: [3, 14] as Ponto, cor: 'lj' as const, rotulo: 'Δs = 9 m' };
const tabela = (ritmo?: number) => (
  <Tabela cabecalho={['tempo', 'posição']} linhas={PONTOS.map(([t, s]) => [`${t} s`, `${s} m`])} ritmo={ritmo} />
);

export const velocidadeMedia: Aula = {
  id: 'velocidade-media',
  titulo: 'Velocidade média',
  treino: ['Física 1 · Cinemática'],
  passos: [
    { nome: 'O carro', frase: 'O carro anda, e a cada segundo eu marco onde ele está.',
      esquerda: tabela(VIAGEM_POR_PONTO), direita: <Plano {...base} pontos={PONTOS} carro guias ritmo={VIAGEM_POR_PONTO} /> },
    { nome: 'No plano cartesiano', frase: 'Cada ponto: o tempo embaixo, a posição do lado.',
      esquerda: tabela(), direita: <Plano {...base} pontos={PONTOS} guias /> },
    { nome: 'Os pontos formam uma reta', frase: 'Sobe sempre igual: 3 metros a cada segundo.',
      esquerda: <Eq><Linha>8 − 5 = <Lj><b>3</b></Lj></Linha><Linha atraso={0.3}>11 − 8 = <Lj><b>3</b></Lj></Linha><Linha atraso={0.6}>14 − 11 = <Lj><b>3</b></Lj></Linha></Eq>,
      direita: <Plano {...base} pontos={PONTOS} reta={RETA} /> },
    { nome: 'A conta com números', frase: 'Quanto andou, dividido pelo tempo que levou.',
      esquerda: <Eq>
        <Linha op="andou"><Lj>14 − 5</Lj> = <Lj>9 m</Lj></Linha>
        <Linha op="levou" atraso={0.4}><Az>3 − 0</Az> = <Az>3 s</Az></Linha>
        <Linha atraso={0.8}><Fr cima={<Lj>9</Lj>} baixo={<Az>3</Az>} /> = <Caixa>3 m/s</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} segmentos={[DT, DS]} /> },
    { nome: 'A equação em letras', frase: 'Troco cada número pelo nome dele.',
      esquerda: <Eq>
        <Linha><Fr cima={<Lj>9</Lj>} baixo={<Az>3</Az>} /> = 3</Linha>
        <Linha op="troca os números" atraso={0.5}><Fr cima={<Lj><Novo>Δs</Novo></Lj>} baixo={<Az><Novo>Δt</Novo></Az>} /> = <Vd><Novo>v</Novo></Vd></Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} segmentos={[DT, DS]} /> },
    { nome: 'Achar o Δs', frase: 'Δs é o pedaço em pé do triângulo.',
      esquerda: <><Eq><Linha><Vd>v</Vd> = <Fr cima={<Lj><Novo>Δs</Novo></Lj>} baixo={<Az>Δt</Az>} /></Linha></Eq>
        <Definicao linhas={[['Δs', 'posição do fim − posição do começo'], ['aqui', '14 − 5 = 9 m']]} /></>,
      direita: <Plano {...base} reta={RETA} segmentos={[DS]} /> },
    { nome: 'Achar o Δt', frase: 'Δt é o pedaço deitado do triângulo.',
      esquerda: <><Eq><Linha><Vd>v</Vd> = <Fr cima={<Lj>Δs</Lj>} baixo={<Az><Novo>Δt</Novo></Az>} /></Linha></Eq>
        <Definicao linhas={[['Δt', 'tempo do fim − tempo do começo'], ['aqui', '3 − 0 = 3 s']]} /></>,
      direita: <Plano {...base} reta={RETA} segmentos={[DT]} /> },
    { nome: 'Volta na equação', frase: 'A velocidade é a inclinação da reta.',
      esquerda: <Eq>
        <Linha><Vd>v</Vd> = <Fr cima={<Lj>Δs</Lj>} baixo={<Az>Δt</Az>} /></Linha>
        <Linha op="põe os números" atraso={0.4}><Vd>v</Vd> = <Fr cima={<Lj>9</Lj>} baixo={<Az>3</Az>} /></Linha>
        <Linha atraso={0.8}><Caixa><Vd>v</Vd> = 3 m/s</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} segmentos={[DT, DS]} /> },
    { nome: 'A equação se transforma', frase: 'Solto o Δs: faço a mesma coisa dos dois lados.',
      esquerda: <Eq>
        <Linha>v = <Fr cima="Δs" baixo="Δt" /></Linha>
        <Linha op="× Δt dos dois lados" atraso={0.5}>v <Novo>· Δt</Novo> = <Fr cima="Δs" baixo={<Corta>Δt</Corta>} /> <Corta>· Δt</Corta></Linha>
        <Linha op="arruma" atraso={1.3}><Lj>Δs</Lj> = v · Δt</Linha>
        <Linha op="Δs = s − 5 e Δt = t" atraso={2}><Novo>s − 5</Novo> = 3 · <Novo>t</Novo></Linha>
        <Linha op="+ 5 dos dois lados" atraso={2.7}><Caixa>s = 5 + 3 · t</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={RETA} /> },
  ],
  prova: {
    inicio: <Linha op="da tabela: andou ÷ tempo">v = <Fr cima="s − 5" baixo="t" /></Linha>,
    etapas: [
      { pede: 'Como soltar o s? Primeiro, tire o t de baixo.', certa: 0,
        opcoes: ['× t dos dois lados', '÷ t dos dois lados', '− 5 dos dois lados'],
        erros: ['', 'Com ÷ t, o t de baixo vira t × t: ficou pior.', 'O 5 está preso em cima do t: tire o t primeiro.'],
        linha: <Linha op="× t dos dois lados">v <Novo>· t</Novo> = <Fr cima="s − 5" baixo={<Corta>t</Corta>} /> <Corta>· t</Corta></Linha> },
      { pede: 'Agora o s está junto do − 5. Como soltar?', certa: 1,
        opcoes: ['− 5 dos dois lados', '+ 5 dos dois lados', '÷ v dos dois lados'],
        erros: ['Com − 5, fica s − 10: o 5 não sai.', '', 'Dividir por v não mexe no − 5.'],
        linha: <Linha op="+ 5 dos dois lados"><Novo>5 +</Novo> v · t = s <Corta>− 5</Corta> <Novo>+ 5</Novo></Linha> },
      { pede: 'Confira com a tabela: com t = 2 s, quanto dá s = 5 + 3 · t?', certa: 2,
        opcoes: ['9 m', '6 m', '11 m'],
        erros: ['9 é o quanto ele andou de 0 a 3 s. A pergunta é onde ele está em 2 s.', 'Faltou somar o 5 da largada: 3 · 2 = 6, mais 5.', ''],
        linha: <Linha op="bate com a tabela">s = 5 + 3 · 2 = <Caixa>11 m</Caixa></Linha> },
    ],
    provado: 'Provado: s = 5 + v · t. É a mesma reta do gráfico.',
    desenho: <Plano {...base} pontos={PONTOS} reta={RETA} />,
  },
};
