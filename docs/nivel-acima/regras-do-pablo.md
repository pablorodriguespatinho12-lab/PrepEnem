# Regras do Pablo para questão e aula de nível acima (lista única, 23/11/2026)

**Por que este arquivo existe.** Em 23/11/2026 o Pablo disse: "tenho que te lembrar de coisas que você já sabe ou já viu... você já tem que saber antes de eu falar".
Eu escrevi 28 questões (24 de Física, 4 de Aritmética) sem ler a memória do projeto, e ele teve de lembrar 5 regras que já estavam gravadas.
Regra só escrita em memória não me obriga a olhar. Por isso: (1) ritual de abertura abaixo, (2) o que dá para checar por programa virou teste:
`npx vitest run data/revisao-final/nivel-acima-regras.test.ts`.

## Ritual de abertura (antes de escrever UMA questão ou aula nova)
1. `ls ~/.claude/projects/-home-pablo-prepenem-app/memory` e ler a descrição de cada arquivo; abrir inteiro o que toca a tarefa
   (hoje: `nivel-acima-*`, `plano-nivel-acima`, `explicacao-*`, `aula-nova-comeca-pelo-canal`, `testar-como-aluno-antes-de-entregar`,
   `nao-entendi-vira-regra-do-aluno-do-zero`, `pablo-ve-a-versao-do-ar`).
2. Ler este arquivo. 3. No fim de cada lote, conferir contra TODAS as linhas abaixo, não só contra a última correção.

## As regras, a fonte e quem confere
| # | Regra | Fonte | Confere |
|---|---|---|---|
| 1 | 1 estilo principal por questão (ENEM, ITA, Fuvest ou Harvard) + toques dos outros; 4 candidatas por conteúdo com 4 principais diferentes (a ENEM, b ITA, c Fuvest, d Harvard); a e b entram na prova | plano-nivel-acima (22/11) | teste |
| 2 | Cada questão nasce de UMA questão real (âncora); sem real no repositório, dizer "sem" e o motivo | nivel-acima-ancorar-em-questao-real | teste (campo `ancora`) |
| 3 | Difícil de verdade: texto de prova (a ≥ 600 letras), junção de conteúdos, pegadinha, 4+ passos; "operários" é fácil demais | nivel-acima-dificil-de-verdade | teste (tamanho, "operários") |
| 4 | Tabela ou desenho em pelo menos 40% | idem (medidas de sucesso) | **ABERTO**: Física 1 de 24; ver abaixo |
| 5 | Dizer onde o canal Universo Narrado ensina (`arquivo [h:mm:ss]`) ou "fora do canal: motivo" | aula-nova-comeca-pelo-canal | teste (campo `canal`) |
| 6 | Conteúdo de outro tema vira aula "Antes" (aula + 2 exercícios), não parágrafo na explicação | explicacao-so-com-o-que-ele-estudou | teste (`antes-da-questao.json`) |
| 7 | Passo com mais de ~300 letras é longo: não rolar a tela | explicacao-curta-sem-rolar | teste |
| 8 | Molde do robô: dados, equação em letras, uma letra por tela, volta na equação, "Sua vez" | provas-dia-2.test.ts | teste |
| 9 | Gabarito conferido por outro agente às cegas | plano (controle 1) | processo (agente) |
| 10 | `aluno-do-zero` lê a explicação, em rodadas até os tropeços serem detalhe | nao-entendi-vira-regra-do-aluno-do-zero | processo (agente) |
| 11 | Substituir as antigas: listar no banco o que cada prova tem; prova com resposta só acrescenta | licoes.md (23/11) | `scripts/tirar-acima-antigo-das-provas.ts` + consulta |
| 12 | Abrir a prova na tela antes de dizer "está no site" (`scripts/varrer-prova.mts`) | testar-como-aluno-antes-de-entregar | processo (ver abaixo) |
| 13 | Resposta escrita por extenso ("Resposta: alternativa B"), nunca "Letra B" | aluno-do-zero tipo 17 | teste |
| 14 | Mostrar UMA amostra ao Pablo antes de gravar um lote novo (ele pode dispensar, como em 23/11) | nivel-acima-dificil-de-verdade | processo |

## Lacunas abertas (23/11/2026)
- **Regra 4:** Física tem 1 desenho (cubo) em 24; Matemática tem 9 desenhos em 28. Faltam ~9 desenhos de Física (plano inclinado, circuito série/paralelo, lente com raios, espelho, tubo, corda, projétil, encontro, escada rolante).
- **Regra 2:** 9 de 28 sem real no repositório (Doppler, gás ideal, gelo, mistura, espelho, cubo...). Baixar ENEM 2019 a 2023 de Física (INEP) para ancorar de verdade.
- **Regra 12 (feita em 23/11/2026):** `varrer-prova.mts` nas 6 provas de Física: 26 questões e 251 passos, 0 achados em 1366 px e em 390 px. Achou um defeito real: com 12 a 20 passos, os tracinhos de passo passavam da borda no celular (corrigido em `components/tutor/explicacao-tutor.tsx`). Matemática 1 #3 trava no varredor porque a questão já foi respondida (limite do teste, não da tela).
- **Regra 5:** 9 temas fora do canal (lançamento horizontal, plano inclinado, mistura quente e fria, tubo, corda, resistência interna, fabricantes de lentes, cubo, escada rolante). Marcado em cada questão; dizer ao Pablo.
