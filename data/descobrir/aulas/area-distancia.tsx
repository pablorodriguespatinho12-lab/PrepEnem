/* No gráfico velocidade × tempo, a área embaixo da linha é a distância: retângulo
   com velocidade fixa (d = v · t), trapézio quando a velocidade sobe. */
import type { Aula } from '@/lib/descobrir/tipos';
import { Az, Caixa, Corta, Definicao, Eq, Fr, Linha, Lj, Novo, Tabela, Vd } from '@/components/descobrir/pecas';
import { Plano, type PlanoProps, type Ponto } from '@/components/descobrir/plano';

const base: PlanoProps = {
  x: { max: 4, passo: 1, nome: 'tempo', unidade: 's' },
  y: { max: 8, passo: 2, nome: 'velocidade', unidade: 'm/s' },
  rotulo: 'Gráfico da velocidade pelo tempo',
};
const FIXA: Ponto[] = [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]];
const SOBE: Ponto[] = [[0, 2], [1, 4], [2, 6], [3, 8]];
const RET: Ponto[] = [[0, 0], [4, 0], [4, 3], [0, 3]];
const TRAP: Ponto[] = [[0, 0], [3, 0], [3, 8], [0, 2]];
const zero = <span>v<sub>0</sub></span>;

export const areaDistancia: Aula = {
  id: 'area-distancia',
  titulo: 'Área = distância',
  treino: ['Física 1 · Cinemática'],
  passos: [
    { nome: 'Outro gráfico', frase: 'Agora embaixo é o tempo, e do lado a velocidade.',
      esquerda: <Tabela cabecalho={['tempo', 'velocidade']} linhas={FIXA.map(([t, v]) => [`${t} s`, `${v} m/s`])} />,
      direita: <Plano {...base} pontos={FIXA} reta={[[0, 3], [4, 3]]} /> },
    { nome: 'Quanto andou?', frase: 'A 3 m/s por 4 segundos, anda 3 × 4 metros.',
      esquerda: <Eq>
        <Linha op="velocidade × tempo">d = v · t</Linha>
        <Linha atraso={0.5}>d = 3 · 4 = <Caixa>12 m</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 3], [4, 3]]} /> },
    { nome: 'É a área', frase: 'O retângulo embaixo da linha tem base 4 e altura 3.',
      esquerda: <Eq>
        <Linha op="base × altura">área = 4 × 3 = 12</Linha>
        <Linha op="a mesma conta" atraso={0.6}><Novo>área = distância</Novo></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 3], [4, 3]]} area={RET} areaRotulo={{ em: [2, 1.3], texto: '12 m' }} /> },
    { nome: 'E se a velocidade sobe?', frase: 'O carro vai de 2 m/s para 8 m/s em 3 segundos.',
      esquerda: <Tabela cabecalho={['tempo', 'velocidade']} linhas={SOBE.map(([t, v]) => [`${t} s`, `${v} m/s`])} />,
      direita: <Plano {...base} pontos={SOBE} reta={[[0, 2], [3, 8]]} /> },
    { nome: 'A área é um trapézio', frase: 'Um lado mede 2, o outro 8, e a largura é 3.',
      esquerda: <Eq>
        <Linha op="média dos lados × largura">área = <Fr cima="2 + 8" baixo="2" /> × 3</Linha>
        <Linha atraso={0.5}>área = 5 × 3 = <Caixa>15 m</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 2], [3, 8]]} area={TRAP} areaRotulo={{ em: [1.5, 2], texto: '15 m' }} /> },
    { nome: 'Por que funciona', frase: 'O meio entre 2 e 8 é a velocidade média: 5 m/s.',
      esquerda: <Eq>
        <Linha op="velocidade média"><Fr cima="2 + 8" baixo="2" /> = 5 m/s</Linha>
        <Linha op="média × tempo" atraso={0.5}>d = 5 · 3 = 15 m</Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 2], [3, 8]]} area={TRAP} segmentos={[{ de: [0, 5], para: [3, 5], cor: 'vd', rotulo: '5 m/s', lado: 'cima' }]} /> },
    { nome: 'A equação em letras', frase: 'Velocidade do começo, velocidade do fim e o tempo.',
      esquerda: <Eq>
        <Linha><Fr cima={<><Az>2</Az> + <Lj>8</Lj></>} baixo="2" /> · <Vd>3</Vd> = 15</Linha>
        <Linha op="troca os números" atraso={0.5}>d = <Fr cima={<><Az><Novo>{zero}</Novo></Az> + <Lj><Novo>v</Novo></Lj></>} baixo="2" /> · <Vd><Novo>t</Novo></Vd></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 2], [3, 8]]} area={TRAP} /> },
    { nome: 'Achar o v₀', frase: 'v₀ é a velocidade no começo, no tempo 0.',
      esquerda: <Definicao linhas={[['v₀', 'a velocidade quando t = 0'], ['aqui', '2 m/s']]} />,
      direita: <Plano {...base} pontos={[[0, 2]]} guias reta={[[0, 2], [3, 8]]} /> },
    { nome: 'Achar o v', frase: 'v é a velocidade no fim.',
      esquerda: <Definicao linhas={[['v', 'a velocidade no último instante'], ['aqui', '8 m/s']]} />,
      direita: <Plano {...base} pontos={[[3, 8]]} guias reta={[[0, 2], [3, 8]]} /> },
    { nome: 'Achar o t', frase: 't é a largura do trapézio.',
      esquerda: <Definicao linhas={[['t', 'tempo do fim − tempo do começo'], ['aqui', '3 − 0 = 3 s']]} />,
      direita: <Plano {...base} reta={[[0, 2], [3, 8]]} segmentos={[{ de: [0, 0], para: [3, 0], cor: 'vd', rotulo: 't = 3 s', lado: 'cima' }]} /> },
    { nome: 'Volta na equação', frase: 'Põe os números no lugar das letras.',
      esquerda: <Eq>
        <Linha>d = <Fr cima={<>{zero} + v</>} baixo="2" /> · t</Linha>
        <Linha atraso={0.4}>d = <Fr cima="2 + 8" baixo="2" /> · 3</Linha>
        <Linha atraso={0.8}><Caixa>d = 15 m</Caixa></Linha>
      </Eq>,
      direita: <Plano {...base} reta={[[0, 2], [3, 8]]} area={TRAP} areaRotulo={{ em: [1.5, 2], texto: '15 m' }} /> },
  ],
  prova: {
    inicio: <Linha op="a área do trapézio">d = <Fr cima={<>{zero} + v</>} baixo="2" /> · t</Linha>,
    etapas: [
      { pede: 'Com a velocidade parada, v₀ = v. O que fica em cima da fração?', certa: 0,
        opcoes: ['v + v', 'v · v', 'v − v'],
        erros: ['', 'A regra soma as duas velocidades, não multiplica.', 'Na regra é mais, não menos.'],
        linha: <Linha op="troca v₀ por v">d = <Fr cima="v + v" baixo="2" /> · t</Linha> },
      { pede: 'v + v é 2 · v. Quanto é 2 · v dividido por 2?', certa: 0,
        opcoes: ['v', '2', 'v ÷ 2'],
        erros: ['', 'Sobra o v: o 2 de cima cancela com o 2 de baixo.', 'O 2 de baixo já foi usado para cancelar o 2 de cima. Não sobra outro para dividir.'],
        linha: <Linha op="o 2 cancela">d = <Fr cima={<><Corta>2</Corta> · v</>} baixo={<Corta>2</Corta>} /> · t = <Caixa>v · t</Caixa></Linha> },
      { pede: 'Confira com o retângulo: v = 3 e t = 4. Quanto dá?', certa: 0,
        opcoes: ['12 m', '7 m', '1 m'],
        erros: ['', 'Somou 3 + 4. A área do retângulo é base vezes altura.', 'Subtraiu. Velocidade vezes tempo dá a distância.'],
        linha: <Linha op="bate com a área">d = 3 · 4 = <Caixa>12 m</Caixa></Linha> },
    ],
    provado: 'Provado: velocidade fixa é o trapézio com os dois lados iguais, um retângulo.',
    desenho: <Plano {...base} reta={[[0, 3], [4, 3]]} area={RET} areaRotulo={{ em: [2, 1.3], texto: '12 m' }} />,
  },
};
