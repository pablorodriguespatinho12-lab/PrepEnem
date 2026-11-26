# Auditoria: só o maior problema, rápido (Pablo, 26/11/2026)

Pedido (voz): terminar rápido, só os maiores problemas, usar agentes, para ele estudar tranquilo.
Substitui a ordem dos lotes de `docs/auditoria/achados.md`.

## Medido em 26/11 (SQL): questões reais do ENEM 2019-2025 SEM aula
Mat 41, Fís 15, Bio 23, Quím 15 (todas com imagem). Humanas e linguagens: 171.

## Entra
| Leva | O que | Quem | Pronto quando |
|---|---|---|---|
| 1 | 56 aulas de lousa de Mat/Fís | 4 agentes Sonnet, ~14 questões cada | `aplicar-aulas-robo` aprova; foto de amostra; gravado |
| 2 | 38 aulas de Bio/Quím | agentes, depois da leva 1 conferida | gabarito às cegas bate; foto; gravado |

Gabarito às cegas de graça: o redator NÃO recebe o gabarito; o gravador compara a letra dele com a do banco.

## Fica de fora (ele pediu: só o grande)
Repetição de números nas aulas, Humanas e linguagens, temas com poucos exercícios, perfumaria de tela.

## FEITO em 26/11/2026
- Questões reais de exatas, Biologia e Química com lousa: 177 de 178 (SQL). 44 + 49 aulas novas e 22 antigas.
- Falta 1: `cmoudnnv8002tuoz97ib0k63g` (Biologia, forame oval): o redator não achou alternativa segura; conferir o gabarito oficial.
- Sem leitor iniciante (`aluno-do-zero`) nem `revisor-de-fatos` nas aulas novas: a conferência foi a letra contra o gabarito e foto de amostra.

## Aprendi
- Redator sem o gabarito = conferência às cegas de graça (manter).
- Guia de aula precisa dizer: resultado da conta sem palavras depois do número; rótulos que mudam já na 1ª palavra.
- Gravar 3 lotes no mesmo minuto repete o nome da cópia de segurança (`aplicar-aulas-robo.ts`).
