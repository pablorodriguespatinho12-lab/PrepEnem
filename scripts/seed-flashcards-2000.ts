import { PrismaClient } from '@prisma/client';
import { expansionLinguagens } from './data/flashcards-expansion-linguagens';
import { portuguesDecks } from './data/flashcards-portugues';
import { literaturaDecks } from './data/flashcards-literatura';
import { historiaDecks } from './data/flashcards-historia';
import { geografiaDecks } from './data/flashcards-geografia';
import { filosofiaDecks } from './data/flashcards-filosofia';
import { sociologiaDecks } from './data/flashcards-sociologia';
import { biologiaDecks } from './data/flashcards-biologia';
import { quimicaDecks } from './data/flashcards-quimica';
import { fisicaDecks } from './data/flashcards-fisica';
import { matematicaDecks } from './data/flashcards-matematica';

const prisma = new PrismaClient();

const materiaColors: Record<string, string> = {
  'Matemática': '#60B5FF',
  'Português': '#FF9149',
  'Biologia': '#80D8C3',
  'Química': '#A19AD3',
  'Física': '#FF6363',
  'História': '#FF9898',
  'Geografia': '#72BF78',
  'Filosofia': '#FF90BB',
  'Sociologia': '#B8860B',
  'Literatura': '#E07C24',
};

const allDecks = [
  ...portuguesDecks,
  ...literaturaDecks,
  ...historiaDecks,
  ...geografiaDecks,
  ...filosofiaDecks,
  ...sociologiaDecks,
  ...biologiaDecks,
  ...quimicaDecks,
  ...fisicaDecks,
  ...matematicaDecks,
];

// Adiciona cards novos a um deck padrão já existente, sem duplicar (compara por `frente`)
// e sem apagar os cards que já estão lá. Usado para "expandir" decks em vez de recriá-los.
async function appendCardsToExistingDeck(
  targetNome: string,
  materia: string,
  cards: { frente: string; verso: string }[]
): Promise<number> {
  const deck = await prisma.flashcardDeck.findFirst({
    where: { nome: targetNome, materia, isDefault: true },
  });
  if (!deck) {
    console.log(`  [SKIP] ${materia} - ${targetNome} (deck não encontrado)`);
    return 0;
  }

  const existing = await prisma.flashcard.findMany({
    where: { deckId: deck.id },
    select: { frente: true },
  });
  const existingSet = new Set(existing.map((c) => c.frente.trim().toLowerCase()));
  const newCards = cards.filter((c) => !existingSet.has(c.frente.trim().toLowerCase()));

  if (newCards.length === 0) {
    console.log(`  [SKIP] ${materia} - ${targetNome} (sem cards novos)`);
    return 0;
  }

  await prisma.flashcard.createMany({
    data: newCards.map((c, idx) => ({
      deckId: deck.id,
      frente: c.frente,
      verso: c.verso,
      ordem: existing.length + idx,
    })),
  });
  console.log(`  [EXPAND] ${materia} - ${targetNome} (+${newCards.length} cards)`);
  return newCards.length;
}

async function seedExpansionLinguagens() {
  console.log(`\n=== Expandindo decks com flashcards-expansion-linguagens.ts (${expansionLinguagens.length} grupos) ===`);
  let added = 0;
  for (const group of expansionLinguagens) {
    added += await appendCardsToExistingDeck(group.deckNome, group.materia, group.cards);
  }
  console.log(`\n✅ Expansão linguagens: ${added} novos flashcards`);
}

// Conteúdo curado de scripts/seed-flashcards.ts (10 decks "avulsos", com nomes que não
// batem 1:1 com os decks padrão). Roteado manualmente para o deck padrão do mesmo tema —
// evita criar um segundo deck redundante por matéria. Física e Matemática são divididos
// entre mais de um deck existente porque o deck de origem misturava sub-temas.
const curatedExtras: { targetNome: string; materia: string; cards: { frente: string; verso: string }[] }[] = [
  { targetNome: 'Embriologia e Zoologia', materia: 'Biologia', cards: [
    { frente: 'O que é segmentação (clivagem)?', verso: 'São as mitóses sucessivas que ocorrem no zigoto sem aumento de volume, formando blástulas e gerando os blastômeros.' },
    { frente: 'O que é mórula?', verso: 'Macço compacto de blastômeros formado pela clivagem; possui ~16-32 células. Lembra uma amora.' },
    { frente: 'O que é blástula?', verso: 'Embrião com cavidade interna (blastocele) e camada celular externa (blastoderme); precede a gastrulação.' },
    { frente: 'O que é gástrula?', verso: 'Embrião após gastrulação, com 2 ou 3 folhetos germinativos (ectoderme, mesoderme, endoderme) e arquentéron.' },
    { frente: 'Quais são os 3 folhetos germinativos?', verso: 'Ectoderme (externa), Mesoderme (intermediária), Endoderme (interna). Originam todos os tecidos.' },
    { frente: 'O que origina-se da ectoderme?', verso: 'Sistema nervoso, epiderme, pelos, unhas, glandulas sudoríparas, esmalte dentário.' },
    { frente: 'O que origina-se da mesoderme?', verso: 'Músculos, ossos, sangue, sistema circulatório, rins, gônadas, derme.' },
    { frente: 'O que origina-se da endoderme?', verso: 'Tubo digestivo, fígado, pâncreas, pulmões, bexiga.' },
    { frente: 'O que é nêurula?', verso: 'Etapa em que se forma o tubo neural a partir da ectoderme; precede a formação do SNC.' },
    { frente: 'O que são anexos embrionários?', verso: 'Estruturas temporárias: córion, âmnio, alantoide, sacó vitelino e placenta (mamíferos).' },
  ]},
  { targetNome: 'Genética Mendeliana', materia: 'Biologia', cards: [
    { frente: '1ª Lei de Mendel', verso: 'Lei da Segregação dos Fatores: cada característica é determinada por um par de fatores (alelos) que se separam na formação dos gametas.' },
    { frente: '2ª Lei de Mendel', verso: 'Lei da Segregação Independente: dois ou mais pares de alelos se separam de forma independente durante a meiose.' },
    { frente: 'O que é genótipo?', verso: 'Conjunto de genes (alelos) de um indivíduo, ex: Aa, BB, aa.' },
    { frente: 'O que é fenótipo?', verso: 'Característica observável resultante da interação genótipo + ambiente, ex: olhos azuis.' },
    { frente: 'Homozigoto vs Heterozigoto', verso: 'Homozigoto: 2 alelos iguais (AA ou aa). Heterozigoto: 2 alelos diferentes (Aa).' },
    { frente: 'Cruzamento Aa x Aa - proporção', verso: '1 AA : 2 Aa : 1 aa (fenótipo 3 dominantes : 1 recessivo).' },
    { frente: 'O que é codominância?', verso: 'Ambos alelos se expressam igualmente, ex: tipo sanguíneo AB.' },
    { frente: 'O que é alelo múltiplo?', verso: 'Mais de 2 alelos para um mesmo gene na população, ex: sistema ABO (IA, IB, i).' },
    { frente: 'O que é herança ligada ao sexo?', verso: 'Características determinadas por genes nos cromossomos sexuais X ou Y, ex: hemofilia, daltonismo.' },
    { frente: 'Fórmula cálculo de probabilidade genética', verso: 'Multiplique probabilidades de eventos independentes. Ex: P(menino daltonico) = 1/2 (sexo) × 1/2 (recessivo) = 1/4.' },
  ]},
  { targetNome: 'Dinâmica — Leis de Newton', materia: 'Física', cards: [
    { frente: '1ª Lei de Newton', verso: 'Lei da Inércia: um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme se a força resultante for nula.' },
    { frente: '2ª Lei de Newton', verso: 'F = m × a. A força resultante é igual ao produto da massa pela aceleração.' },
    { frente: '3ª Lei de Newton', verso: 'Lei da Ação e Reação: para toda ação, existe uma reação de mesma intensidade, direção e sentido oposto.' },
  ]},
  { targetNome: 'Cinemática', materia: 'Física', cards: [
    { frente: 'Fórmula MUV (velocidade)', verso: 'v = v₀ + at' },
    { frente: 'Fórmula MUV (posição)', verso: 's = s₀ + v₀t + (1/2)at²' },
    { frente: 'Equação de Torricelli', verso: 'v² = v₀² + 2aΔs. Independe do tempo.' },
  ]},
  { targetNome: 'Energia e Trabalho', materia: 'Física', cards: [
    { frente: 'Energia cinética', verso: 'Ec = (m×v²)/2. Unidade: Joule (J).' },
    { frente: 'Energia potencial gravitacional', verso: 'Ep = m×g×h. g≈9,8m/s².' },
    { frente: 'Conservação da energia mecânica', verso: 'Em₀ = Em_f → Ec₀ + Ep₀ = Ec_f + Ep_f (sem atrito).' },
    { frente: 'Quantidade de movimento (momentum)', verso: 'Q = m×v. Vetorial. Conservada em sistemas isolados.' },
  ]},
  { targetNome: 'Reações Químicas e Estequiometria', materia: 'Química', cards: [
    { frente: 'O que é mol?', verso: 'Quantidade de matéria que contém 6,022 × 10²³ entidades (número de Avogadro).' },
    { frente: 'Massa molar', verso: 'Massa de 1 mol de substância, expressa em g/mol. Numericamente igual à massa atômica/molecular em u.' },
    { frente: 'Volume molar nas CNTP', verso: '22,4 L/mol (0°C e 1 atm). Para qualquer gás ideal.' },
    { frente: 'Como balancear equações?', verso: 'Iguale o número de átomos de cada elemento nos reagentes e produtos usando coeficientes.' },
    { frente: 'Cálculo de mol a partir de massa', verso: 'n (mol) = m (g) / M (g/mol)' },
    { frente: 'Lei das proporções definidas (Proust)', verso: 'Uma substância composta sempre apresenta a mesma proporção de massa entre seus elementos.' },
    { frente: 'Rendimento de uma reação', verso: 'Rendimento (%) = (massa obtida / massa teórica) × 100.' },
    { frente: 'Reagente limitante', verso: 'Reagente que se esgota primeiro, limitando a quantidade de produto formado.' },
    { frente: 'Pureza vs rendimento', verso: 'Pureza: fração da substância ativa na amostra. Rendimento: fração convertida em produto.' },
    { frente: 'Concentração em mol/L (molaridade)', verso: 'M = n/V, onde n é mols do soluto e V o volume em litros da solução.' },
  ]},
  { targetNome: 'Funções — Conceito, 1º e 2º Grau', materia: 'Matemática', cards: [
    { frente: 'Função do 1º grau (afim)', verso: 'f(x) = ax + b, onde a ≠ 0. Gráfico: reta. Crescente se a>0, decrescente se a<0.' },
    { frente: 'Raiz da função afim', verso: 'x = -b/a. É o ponto onde a reta cruza o eixo X.' },
    { frente: 'Função do 2º grau (quadrática)', verso: 'f(x) = ax² + bx + c, com a≠0. Gráfico: parábola. Concavidade para cima se a>0.' },
    { frente: 'Vértice da parábola', verso: 'Xv = -b/(2a). Yv = -Δ/(4a). Ponto máximo (a<0) ou mínimo (a>0).' },
    { frente: 'Fórmula de Bhaskara', verso: 'x = (-b ± √Δ) / (2a), onde Δ = b² - 4ac.' },
    { frente: 'Análise do Δ na quadrática', verso: 'Δ > 0: 2 raízes reais. Δ = 0: 1 raiz dupla. Δ < 0: sem raízes reais.' },
  ]},
  { targetNome: 'Funções Exponencial e Logarítmica', materia: 'Matemática', cards: [
    { frente: 'Função exponencial', verso: 'f(x) = aˣ, onde a > 0 e a ≠ 1. Crescente se a>1, decrescente se 0<a<1.' },
    { frente: 'Função logarítmica', verso: 'f(x) = logₐ(x), inversa da exponencial. Definida para x > 0.' },
    { frente: 'Propriedade logarítmica do produto', verso: 'log(a×b) = log(a) + log(b).' },
    { frente: 'Mudança de base', verso: 'log_b(a) = log_c(a) / log_c(b).' },
  ]},
  { targetNome: 'Figuras de Linguagem', materia: 'Português', cards: [
    { frente: 'Metáfora', verso: 'Comparação implícita, sem conectivo. Ex: "Seus olhos são estrelas".' },
    { frente: 'Comparação (simile)', verso: 'Comparação explícita com conectivos (como, tal qual). Ex: "Seus olhos são como estrelas".' },
    { frente: 'Metonimia', verso: 'Substituição de termo por outro relacionado. Ex: "Tomei um Bordeaux" (vinho da região de Bordeaux).' },
    { frente: 'Antonomásia', verso: 'Substituição de nome próprio por uma expressão. Ex: "O pássaro verde-amarelo" (Brasil).' },
    { frente: 'Hipérbole', verso: 'Exagero intencional. Ex: "Chorei rios de lágrimas".' },
    { frente: 'Antitese', verso: 'Oposição de ideias. Ex: "A vida é curta, a arte é longa".' },
    { frente: 'Paradoxo', verso: 'Contradição aparente, mas com sentido. Ex: "Cego de tanta luz".' },
    { frente: 'Personificação (prosopopeia)', verso: 'Atribuir qualidades humanas a seres inanimados. Ex: "O vento gemia".' },
    { frente: 'Ironía', verso: 'Dizer o contrário do que se pensa. Ex: "Que dia lindo!" durante uma tempestade.' },
    { frente: 'Sinestesia', verso: 'Mistura de sentidos. Ex: "Voz doce e quente".' },
  ]},
  { targetNome: 'Brasil Colônia', materia: 'História', cards: [
    { frente: 'Quem foi Pedro Álvares Cabral?', verso: 'Navegador português que chegou ao Brasil em 22 de abril de 1500.' },
    { frente: 'Capitanias Hereditárias (1534)', verso: 'Divisão do território brasileiro em 15 faixas dadas a donatários portugueses. Fracassou na maioria.' },
    { frente: 'Governo-Geral (1549)', verso: 'Sistema centralizado iniciado por Tomé de Sousa, com sede em Salvador. Substituiu as capitanias.' },
    { frente: 'Cana-de-açúcar', verso: 'Principal atividade econômica colonial nos séculos XVI-XVII, em engenhos no Nordeste.' },
    { frente: 'Tráfico negreiro', verso: 'Mão de obra escravizada africana foi a base da economia colonial; cerca de 5 milhões de africanos chegaram ao Brasil.' },
    { frente: 'Invaões holandesas (1630-1654)', verso: 'Ocupação de Pernambuco pela Companhia das Índias Ocidentais; expulsos na Batalha de Guararapes.' },
    { frente: 'Ciclo do Ouro (séc. XVIII)', verso: 'Mineração em Minas Gerais; deslocou eixo econômico para o Sudeste. Gerou conflitos como Vila Rica.' },
    { frente: 'Inconfidência Mineira (1789)', verso: 'Movimento que buscava independência em MG; Tiradentes foi enforcado em 1792.' },
    { frente: 'Conjuração Baiana (1798)', verso: 'Movimento popular em Salvador; envolveu camadas pobres e mestiças. Também chamada de "Revolta dos Alfaiates".' },
    { frente: 'Vinda da Família Real (1808)', verso: 'D. João VI transferiu a Corte portuguesa para o Brasil fugindo de Napoleão; marcou o fim do pacto colonial.' },
  ]},
  { targetNome: 'Clima e Fenômenos Climáticos', materia: 'Geografia', cards: [
    { frente: 'Clima vs Tempo', verso: 'Clima: comportamento médio em longo prazo (30+ anos). Tempo: condição atmosférica de curto prazo.' },
    { frente: 'Massas de ar do Brasil', verso: 'mEa (Equatorial Atlântica), mEc (Equatorial Continental), mTa (Tropical Atlântica), mTc (Tropical Continental), mPa (Polar Atlântica).' },
    { frente: 'El Niño', verso: 'Aquecimento anormal do Pacífico Equatorial. Causa secas no Norte/Nordeste e chuvas no Sul do Brasil.' },
    { frente: 'La Niña', verso: 'Resfriamento do Pacífico. Causa o oposto: mais chuvas no Norte/Nordeste e secas no Sul.' },
    { frente: 'Clima tropical', verso: 'Quente, com chuvas no verão e estiação no inverno. Predominante no Brasil Central.' },
    { frente: 'Clima semiárido', verso: 'Pouca chuva (<800mm/ano), altas temperaturas, vegetação de caatinga. Típico do Sertão Nordestino.' },
    { frente: 'Clima equatorial', verso: 'Quente e úmido o ano todo, com chuvas abundantes. Típico da Amazônia.' },
    { frente: 'Efeito estufa', verso: 'Retenção de calor pela atmosfera devido a gases (CO₂, CH₄). Natural e necessário, mas intensificado pela ação humana.' },
    { frente: 'Inverção térmica', verso: 'Camada de ar quente impede dispersão de ar frio e poluentes próximos ao solo. Comum no inverno paulistano.' },
    { frente: 'Ilhas de calor', verso: 'Fenômeno em áreas urbanas onde a temperatura é mais alta que zonas periféricas. Por concreto, asfalto e poluição.' },
  ]},
  { targetNome: 'Filosofia Antiga — Sócrates, Platão, Aristóteles', materia: 'Filosofia', cards: [
    { frente: 'Quem foi Tales de Mileto?', verso: 'Primeiro filósofo, da escola jonica. Afirmava que a água era o princípio (arché) de tudo.' },
    { frente: 'Quem foi Heráclito?', verso: 'Defendia que tudo flui ("panta rhei"). "Não entramos duas vezes no mesmo rio".' },
    { frente: 'Quem foi Parmênides?', verso: 'Oposto a Heráclito: o ser é imutável; mudança é ilusão sensorial.' },
    { frente: 'Método socrático', verso: 'Maieutica (parto das ideias): perguntas que levam o interlocutor a descobrir a verdade por si mesmo.' },
    { frente: 'Frase de Sócrates', verso: '"Só sei que nada sei" - reconhecimento da ignorância como princípio do conhecimento.' },
    { frente: 'Teoria das Ideias de Platão', verso: 'Existem dois mundos: das ideias (verdadeiro, eterno) e sensível (cópia imperfeita). Filme "Matrix" é inspirado.' },
    { frente: 'Mito da Caverna (Platão)', verso: 'Prisioneiros veem sombras na parede e creem ser realidade. Só ao sair encontram a verdade (mundo das ideias).' },
    { frente: 'Aristóteles - Substancia e Acidente', verso: 'Substância: o que algo é (essencia). Acidente: característica variável (cor, lugar).' },
    { frente: 'Quatro Causas de Aristóteles', verso: 'Material (de que é feito), Formal (forma), Eficiente (quem fez), Final (para quê).' },
    { frente: 'Eudaimonia', verso: 'Conceito aristotélico: felicidade como fim último da vida, alcançada pela virtude e o equilíbrio.' },
  ]},
  { targetNome: 'Clássicos da Sociologia', materia: 'Sociologia', cards: [
    { frente: 'Quem foi Émile Durkheim?', verso: 'Fundador da Sociologia como ciência. Estudou fato social, anomia e suicídio.' },
    { frente: 'O que é fato social (Durkheim)?', verso: 'Maneiras de agir, pensar e sentir externas ao indivíduo e que exercem coerção sobre ele.' },
    { frente: 'Anomia (Durkheim)', verso: 'Estado de ausência ou enfraquecimento de normas sociais que regulam o comportamento individual.' },
    { frente: 'Karl Marx - tese central', verso: 'A história é a história da luta de classes. O modo de produção determina a estrutura social.' },
    { frente: 'Mais-valia (Marx)', verso: 'Diferença entre o valor produzido pelo trabalhador e o salário que recebe. Apropriação pela burguesia.' },
    { frente: 'Alienação (Marx)', verso: 'Trabalhador não se reconhece em sua produção. Perde-se de si, do produto, do processo e dos outros.' },
    { frente: 'Max Weber - foco', verso: 'Ação social: comportamento dotado de sentido orientado para outros. Compreensiva, não causal.' },
    { frente: 'Tipos de dominação (Weber)', verso: 'Tradicional (costume), Carismática (líder), Legal-racional (regras/burocracia).' },
    { frente: 'Burocracia (Weber)', verso: 'Forma racional de organização moderna: hierarquia, regras, especialização, impessoalidade.' },
    { frente: 'Ética protestante e capitalismo (Weber)', verso: 'Tese de que valores protestantes (disciplina, poupança, trabalho) favoreceram a expansão capitalista.' },
  ]},
];

async function seedCuratedExtras() {
  console.log(`\n=== Aproveitando conteúdo único de seed-flashcards.ts (${curatedExtras.length} grupos) ===`);
  let added = 0;
  for (const group of curatedExtras) {
    added += await appendCardsToExistingDeck(group.targetNome, group.materia, group.cards);
  }
  console.log(`\n✅ Curados aproveitados: ${added} novos flashcards`);
}

async function main() {
  console.log(`\n=== Seeding ${allDecks.length} decks ===`);
  let totalCards = 0;
  let deckCount = 0;

  for (const deckData of allDecks) {
    // Check if deck already exists (by nome + materia)
    const existing = await prisma.flashcardDeck.findFirst({
      where: { nome: deckData.nome, materia: deckData.materia, isDefault: true },
    });

    if (existing) {
      // Check if cards already exist
      const cardCount = await prisma.flashcard.count({ where: { deckId: existing.id } });
      if (cardCount >= deckData.cards.length) {
        console.log(`  [SKIP] ${deckData.materia} - ${deckData.nome} (já existe com ${cardCount} cards)`);
        totalCards += cardCount;
        deckCount++;
        continue;
      }
      // Delete existing cards and re-insert
      await prisma.flashcard.deleteMany({ where: { deckId: existing.id } });
      await prisma.flashcard.createMany({
        data: deckData.cards.map((c, idx) => ({
          deckId: existing.id,
          frente: c.frente,
          verso: c.verso,
          ordem: idx,
        })),
      });
      console.log(`  [UPDATE] ${deckData.materia} - ${deckData.nome} (${deckData.cards.length} cards)`);
      totalCards += deckData.cards.length;
      deckCount++;
      continue;
    }

    // Create new deck
    const deck = await prisma.flashcardDeck.create({
      data: {
        nome: deckData.nome,
        materia: deckData.materia,
        subtema: deckData.subtema || null,
        cor: materiaColors[deckData.materia] || '#06b6d4',
        isDefault: true,
        cards: {
          create: deckData.cards.map((c, idx) => ({
            frente: c.frente,
            verso: c.verso,
            ordem: idx,
          })),
        },
      },
    });
    console.log(`  [NEW] ${deckData.materia} - ${deckData.nome} (${deckData.cards.length} cards)`);
    totalCards += deckData.cards.length;
    deckCount++;
  }

  console.log(`\n✅ Total: ${deckCount} decks, ${totalCards} flashcards`);

  await seedExpansionLinguagens();
  await seedCuratedExtras();
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
