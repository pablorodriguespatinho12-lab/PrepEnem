# Plano: lousa mais visual, conta desenhada e base de exercícios (Pablo, 24/11/2026)

## O que o Pablo pediu (palavras dele, resumidas)
1. **Mais quadro de conta, menos texto.** Valores, cálculo, equação. Texto só o que o quadro não mostra. Visual cansa menos a vista.
2. **Equação grande com micro legendas** embaixo de cada letra (como as placas de estação de trem): `A = H × V`, e embaixo de A "aceleração", de H "altura", de V "velocidade". Depois a MESMA equação com os números. Não repetir a fala duas vezes.
3. **Todo número que não está no enunciado mostra de onde vem.** Queda livre: `5 × t × t` tinha um "5" sem origem (5 = g ÷ 2 = 10 ÷ 2).
4. **Base antes da junção.** 1 exercício só de velocidade média, 1 só de aceleração, depois 1 com os dois. Um exercício por conceito é pouco para aprender. O aluno-do-zero confere.
5. **Geometria sem figura no enunciado:** a solução DESENHA a figura (prisma, cilindro, pirâmide).
6. **Auto-melhora obrigatória:** toda correção dele vira melhoria gravada (memória, skill, agente ou gancho), sem ele pedir.

## Fases (cada uma termina com tela mostrada ao Pablo)
| Fase | O que fazer | Prova de pronto |
|---|---|---|
| 0 | Gravar as regras 17 a 21 em `regras-do-pablo.md` e na memória | `grep -c` das regras |
| 1 | Cena nova na lousa: equação grande + legendas embaixo (`k:'eq'`), e a mesma equação trocando letra por número, em linhas `a ÷ b = c` | foto da tela, 1366 e 390 px |
| 2 | Protótipo de 2 aulas: queda livre (de onde vem o 5) e velocidade média | Pablo aprova na foto |
| 3 | `do-robo.ts` passa a gerar o quadro novo das 190 lousas e corta a fala repetida | SQL por prova: X de Y; varredura de tela |
| 4 | Contar por conceito (SQL) quantos exercícios existem; escrever os que faltam: só A, só B, depois A+B | tabela conceito x quantidade antes e depois |
| 5 | Figura de sólido na solução quando o enunciado não tem figura (prisma, cilindro, cone, pirâmide) | foto de 1 questão de cada |
| 6 | `aluno-do-zero` em rodadas nas aulas novas; `revisor-de-fatos` nas contas | relatório sem conta errada |
| 7 | Auto-melhora: o gancho `detectar-correcao.py` já avisa; conferir que cada correção desta sessão virou regra | lista correção -> onde foi gravada |

## Regras novas (entram em `regras-do-pablo.md`)
- **17** Quadro de conta antes de texto: valores, cálculo e equação desenhados; fala curta, sem repetir o que está na tela.
- **18** Equação com legendas embaixo de cada letra, depois a mesma equação com números.
- **19** Número que não está no enunciado (constante, 5 = g ÷ 2) mostra a origem na própria tela.
- **20** Cada conceito tem exercício SÓ dele antes de entrar em junção (velocidade média sozinha, aceleração sozinha, depois as duas).
- **21** Questão de geometria sem figura: a solução desenha a figura.

## Ordem de modelos
Haiku (`explorador`): contar e listar por SQL, ler figuras. Sonnet (`executor`): código, telas, conferir tela. Opus só se travar.

## Regra 24 (Pablo, 24/11/2026, depois de ver o protótipo)
- **Mais ou menos 80% das telas só equação, mais ou menos 20% outras: são MÉDIAS (Pablo: "não é exatamente 80%"), nunca limite exato por aula.** Telas só equação (letras com legendas, depois a mesma com números, `a + b = c`); ~20% no começo dizem o que a questão quer e quais dados pegar.
- **Fator na fórmula tem tela do porquê**: queda livre, "÷ 2" = velocidade média (0 a 20, média 10). Protótipo refeito com 5 telas: pede, v no fim, v média, altura, atalho.
- Fase 3 ganha um TESTE: média de telas `eq` entre 70 e 90% nas lousas de exatas (não por aula) (contar por comando, dizer "X de Y").
- `aluno-do-zero` ganhou os tropeços 20 (origem sem porquê) e 21 (texto onde cabia equação).
- Limite do validador subiu de 8 para 10 peças por equação (a 9ª peça sumia em silêncio).

## Estado em 24/11/2026 ~20h (fases)
| Fase | Estado |
|---|---|
| 0 regras 17-25 | feita |
| 1 cena `eq` + fração (`cima|baixo`) | feita, `equacao.ts` |
| 2 protótipo (queda livre 5 telas, velocidade média) | feito, Pablo viu; pediu fração no lugar do ÷ (feito); o porquê do ÷ 2 ele mandou deixar de lado |
| 3 gerador (`quadro-de-conta.ts`, `do-robo.ts`, `do-antigo.ts`) | feita e GRAVADA no banco: 443 lousas, média de telas só de conta 0% -> 70% (robô 78%, antigo 48%); 1 aula não coube (33 telas, máx 31); cópia em `~/backups-prepenem/explicacoes-antes-lousa-do-robo-2026-11-24T22h49.json` |
| 4 base por conceito | NÃO feita. Tema x quantidade (Mat/Fís): Cinemática só 16 (8 do dia 2); Grandezas 27, Equações 32, Combinatória 34. Falta o sub-conceito (velocidade média, aceleração, queda livre) |
| 5 figura de sólido | NÃO feita |
| 6 aluno-do-zero + revisor-de-fatos nas lousas novas | NÃO feita (14 mil tokens por questão; rodar em 2 a 3 aulas por tema) |
| 7 auto-melhora | feita (ver lista abaixo) |

Correção -> onde gravei: build com dev ligado -> `scripts/checar-dev-parado.mjs` (trava no `npm run build`); 80/20 é média -> regra 24 + teste com tolerância; ÷ em fração -> regra 25 + aluno-do-zero 22; "por que ÷ 2" -> aluno-do-zero 20; localhost pede login -> prévia por artefato com fotos; texto onde cabia equação -> aluno-do-zero 21.
Defeitos achados SÓ olhando foto de aula real (o teste não pegava): 3 linhas com fração estouravam o quadro, legenda cortada em "em", "72 km/h" virou fração, ";" juntava duas contas. Lição: foto de 2 aulas reais depois de todo gerador novo, antes de gravar.

## Fase 6 (24/11 ~20h30): aluno-do-zero em 2 aulas (cin-02, ter-01)
Consertado no gerador e regravado (cópia `~/backups-prepenem/...T23h23.json`): legenda colada na peça; pista da "questão parecida?" no pé do quadro (só o conselho, até 88 letras); nome da fórmula vira legenda da letra na tela "as fórmulas".
LACUNAS DO TEXTO DE ORIGEM (não são do gerador; precisam reescrever o passo na aula): passo intermediário só na fala ou ausente (60 ÷ 3 × 2 = 40 min; 1 + 2/3 = 5/3; 30 − 0 = 30 de ΔT); "o seu jeito" no título é jargão; símbolo novo (Δ) sem leitura; o × 1 (c da água) sem origem; "só vale quando o mesmo tempo" sem caso com número. Próximo: regra no molde do robô (cada número que entra numa conta tem a conta anterior desenhada).
