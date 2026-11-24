# Prompt para corrigir um módulo v2 depois da leitura do aluno-do-zero (23 e 24/11/2026)

Use com um agente `executor` novo (os agentes antigos somem no `/clear`). Troque `<slug>`, `<arquivo-da-leitura>` e os ids.

> Projeto /home/pablo/prepenem-app. Leia INTEIRO `docs/nivel-acima/prompt-autor-v2.md` e `docs/nivel-acima/molde-v2.md`.
> O aluno-do-zero leu as questões do módulo `scripts/banco-enem/v2/<slug>.py` (relatório em `docs/nivel-acima/leitura/<arquivo-da-leitura>.md`, seção dos seus ids).
> Corrija TODOS os tropeços dessas questões, só no módulo `<slug>.py`. Regras:
> (a) letras da equação nunca iguais a A..E nem a outra letra ou unidade da mesma questão (D, F, N, Q, m, t, U, s...): abreviações próprias e a MESMA em todas as telas e fórmulas;
> (b) conteúdo que as aulas Antes não cobrem vira conceito em `ANTES_NOVOS` com id começando com `<prefixo>-` e 2 exercícios (linhas ≤ 170 letras; a 1ª linha da `resolucao` contém o 1º token da alternativa certa);
> (c) conta com vírgula, fração, raiz e potência de dez: passo a passo e com o porquê (teste com número pequeno);
> (d) dado que sobra no enunciado ganha linha "não entra na conta" na tabela "O que eu tenho";
> (e) geometria, circuito ou diagrama sem figura: use um desenho que já existe em `DIAGRAMAS` (`lib/visual/especificacao.ts`); se não existir, liste em "desenhos pendentes" no relatório (nome e rótulos);
> (f) as questões que o aluno achou FÁCEIS DEMAIS: torne MAIS DIFÍCIL mantendo a técnica e a âncora: 2ª ideia escondida e/ou junção de conteúdo de degraus anteriores, conta por `assert`;
> (g) mantenha ids, âncoras e canal; resposta pode mudar só nas que foram dificultadas;
> (h) valide com `python3 scripts/banco-enem/montar_v2.py --seco <slug>` (NUNCA sem `--seco`: vários agentes escrevem ao mesmo tempo). Relatório curto: o que mudou por id e os desenhos pendentes.

Quem grava de verdade é o coordenador (uma vez): `python3 scripts/banco-enem/montar_v2.py` e depois `npx vitest run`.
