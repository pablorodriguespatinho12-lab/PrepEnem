/* Dá um tema da escada (data/escadas.ts) à questão que só tem subtema
   (17/11/2026: 490 questões das 5 matérias do dia estavam sem tema).
   A primeira regra que casa vence: a ordem importa. Física moderna, nuclear e
   astronomia ficam sem tema (não estão na escada). */

type Regra = [RegExp, string];

const REGRAS: Record<string, Regra[]> = {
  Física: [
    [/lan[çc]amento|queda|cinem[áa]tica|mru|velocidade m[ée]dia|projétil|projéteis/, 'Cinemática'],
    [/fotovolt|el[ée]tr|pilha|circuit|ohm|corrente|bateria|magn[ée]t|resist[êe]ncia el/, 'Eletricidade e Circuitos'],
    [/[óo]ptica|refra[çc]|luz|espelho|lente/, 'Óptica'],
    [/onda|som|ac[úu]stic|frequ[êe]ncia/, 'Ondas e Acústica'],
    [/termo|calor|t[ée]rmic|dilata/, 'Termodinâmica e Calor'],
    [/newton|din[âa]mica|energia mec|trabalho|pot[êe]ncia mec|impulso|quantidade de movimento|est[áa]tica|hidrost|fluido|gravita|circular|for[çc]a|energia/, 'Dinâmica e Leis de Newton'],
  ],
  Matemática: [
    [/fun[çc](ão|ões) trigon/, 'Funções'],
    [/probabil|combinat|contagem|multiplicativo|casa dos pombos|binômio/, 'Análise Combinatória e Probabilidade'],
    [/estat[íi]stic|m[ée]dia|mediana|moda|histograma|percentil|varia[çc][ãa]o e interpreta|dispers/, 'Estatística'],
    [/espacial|volume|cilindr|cone|esfera|cubo|octaedro|paralelep|prisma|pir[âa]mide|proje[çc][ãa]o ortogonal/, 'Geometria Espacial'],
    [/plana|[áa]rea|per[íi]metro|tri[âa]ngul|pit[áa]goras|c[íi]rculo|circunfer|pol[íi]gono|simetria|trigonometria|anal[íi]tica|c[ôo]nicas/, 'Geometria Plana'],
    [/escala|unidade|medida|convers[ãa]o|hectare|trajeto/, 'Grandezas e Medidas'],
    [/fun[çc]|gr[áa]fico|progress|sequ[êe]ncia|logar|exponencial|pa e pg/, 'Funções'],
    [/equa[çc]|inequa|sistema|polin[ôo]mio|girard|complex|matriz|alg[ée]bric|otimiza/, 'Equações e Sistemas'],
    [/porcent|percent|fra[çc]|raz[ãa]o|propor|regra de tr[êe]s|financeira|custo|pre[çc]o|despesa|lucro|divisor|pot[êe]ncia|base|numera|m[óo]dulo|soma|conjunto|l[óo]gica|criptograf|cronograma|grandezas/, 'Aritmética e Porcentagem'],
  ],
  Português: [
    [/literatura|romantismo|modernis|poema|lirismo|conto|narrador|regionalismo|maneirismo|po[ée]tic/, 'Literatura Brasileira'],
    [/figura|fun[çc][ãa]o (expressiva|da linguagem)|fun[çc][õo]es da linguagem|ironia|met[áa]fora|analogia|metaling/, 'Funções e Figuras de Linguagem'],
    [/varia[çc][ãa]o|norma|formalidade|adequa[çc]|oralidade|libras|patrim[ôo]nio lingu|preconceito lingu/, 'Variação Linguística e Norma-Padrão'],
    [/per[íi]odo|verbo|conjun[çc]|pronome|coes|crase|concord|reg[êe]ncia|acentua|ortografia|fonologia|classes|sem[âa]ntica|gram[áa]tica|sequ[êe]ncias verbais/, 'Gramática e Coesão'],
    [/interpreta|leitura|argumenta/, 'Interpretação de Texto'],
    [/g[êe]nero|publicid|campanha|charge|tirinha|reportagem|resenha|cr[ôo]nica|carta|not[íi]cia|digita|redes sociais|multimodal|intertext|can[çc][ãa]o|imagem|arte|di[áa]rio/, 'Gêneros Textuais e Multimodalidade'],
    [/.*/, 'Interpretação de Texto'],
  ],
  Biologia: [
    [/bot[âa]nica|vegeta|fitorm|angiosperm|semente|planta/, 'Botânica'],
    [/evolu|sele[çc][ãa]o natural|mimetismo|coevolu|estrat[ée]gias reprodutivas/, 'Evolução'],
    [/gen[ée]tic|heran[çc]a|cromossomo|muta[çc]|rna|dna|biotecnolog|terapia g[êe]nica|pcr/, 'Genética'],
    [/ecolog|cadeia alimentar|bioacumula|ciclo do nitrog|esgoto|invasor|biodivers|controle biol[óo]gico/, 'Ecologia'],
    [/c[ée]lul|citolog|osmose|enzima|metabolismo|respira[çc][ãa]o celular/, 'Citologia'],
    [/doen[çc]a|dengue|parasit|v[íi]rus|bact[ée]r|f[úu]ng|fermenta|microrgan|imunolog|vetor|sa[úu]de p[úu]blica/, 'Microbiologia e Doenças'],
    [/fisiolog|horm[ôo]n|nervoso|coagula|circula|embriolog|endocrin|vis[ãa]o|sa[úu]de/, 'Fisiologia Humana e Saúde'],
  ],
  Química: [
    [/eletroqu|pilha|oxirredu|corros|oxidante|c[ée]lulas? a combust/, 'Eletroquímica'],
    [/org[âa]nica|pol[íi]mero|is[ôo]mer|arom[áa]tic|[ée]ster|sab[ãa]o|funções orgânicas/, 'Química Orgânica'],
    [/ambiental|combust[íi]ve|energia|biog[áa]s|atmosfera|ur[âa]nio|radioativ|meia-vida|remedia|tratamento de [áa]gua/, 'Química Ambiental e Energia'],
    [/titula|ph|solu[çc]|mistura|[áa]cido-base/, 'Soluções, pH e Titulação'],
    [/equil[íi]brio|cin[ée]tica|termoqu|cat[áa]lise/, 'Equilíbrio, Cinética e Termoquímica'],
    [/estequio|mol|leis ponderais|rea[çc][õo]es|rea[çc][ãa]o de|f[óo]rmulas/, 'Estequiometria'],
    [/at[ôo]m|peri[óo]dica|liga[çc]|eletr[ôo]nica|geometria molecular|incompatib/, 'Atomística e Ligações'],
  ],
};

/** Tema da escada para este subtema, ou null se nenhuma regra casar. */
export function temaPeloSubtema(materia: string, subtema: string | null): string | null {
  if (!subtema) return null;
  const s = subtema.toLowerCase();
  const achada = (REGRAS[materia] ?? []).find(([re]) => re.test(s));
  return achada ? achada[1] : null;
}
