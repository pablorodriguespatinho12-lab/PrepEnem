---
name: medir-fluidez
description: "Usar quando o Pablo disser que o PrepEnem está lento, travando ou com fps baixo, ou antes de pôr animação contínua (fundo, 3D, loop). Qual número olhar (o fps do headless engana), o script e as causas já achadas."
---

# Medir fluidez

"Tá meio lento" (Pablo, 18/10/2026) e o headless dava **60 fps em todas as
telas**. O fps do `requestAnimationFrame` não enxerga a placa de vídeo: mede a
thread principal, que estava folgada. O custo estava na composição, e só
apareceu num trace.

## O roteiro

1. Parar o dev e medir no build: `npm run build && npm start`. O modo dev é
   lento por natureza e mente para os dois lados.
2. Token de sessão como em `verificacao-local` (rodar o script de dentro do
   projeto, ou com `NODE_PATH=$PWD/node_modules`).
3. `DB_CONFIRMED=1 PREPENEM_TOKEN=$(cat <token>) npx tsx scripts/medir-fps.mts /dashboard /treino ...`
   O `DB_CONFIRMED` é para o hook do Neon: o script só lê, devolve `{}` a todo POST.
4. Achar o culpado por **eliminação**: injetar `page.addStyleTag` escondendo
   um suspeito por vez (`.particulas{display:none}`, `*{backdrop-filter:none}`,
   `*{animation:none}`) e comparar a coluna de composição. Ler código não acha:
   o vidro com `backdrop-blur-xl` parecia o vilão e nem é usado.
5. Medir de novo depois da mudança, na mesma máquina. Número absoluto do
   headless não vale; a diferença vale.

## Qual coluna olhar

| Coluna | Bom | O que significa se estiver ruim |
|---|---|---|
| composição ms (parado) | perto de 0 | animação infinita rodando: a tela é redesenhada a cada quadro, para sempre |
| layouts (rolando) | 0 | algo muda `width`/`top`/`height` ou faz `setState` no scroll |
| tarefas longas / pior quadro | 0 / ≤ 33 ms | JS pesado na thread principal (com CPU freada 4×) |
| fps | — | só acusa problema de thread principal; 60 aqui não prova nada |

## Causas já achadas (18/10/2026)

- **Partículas de fundo**: ~450 ms de composição em 4 s no dashboard; 2 ms sem
  elas. **Cortar partículas não resolve** (1/3 delas: quase igual): o custo é
  a animação existir. Hoje pausam ao rolar e andam em passos alinhados de 20/s.
  Ficou ~1/3 menor parado; o resto é o preço de ter fundo animado.
- **Barra de progresso do topo**: `setState` + `width` a cada scroll = 162
  layouts em 3 s. Ref + `scaleX` + rAF = 0.
- **Medalha 3D do resultado**: WebGL a 60 fps para sempre, inclusive fora da
  tela. Agora 60 na entrada, 30 depois, 0 fora da tela. Para conferir, contar
  quadros desenhados interceptando `drawElements` (não basta ver o print).

- **Mundo pixel (12/11/2026, "parece lento")**: dia/noite, sol e nuvens em
  `linear` redesenhavam a tela inteira a 60 fps: composição parada de 2.254 ms
  em 3 s no Início, 1.623 nos flashcards, 1.482 na prova. Com `steps()` (o
  anoitecer em degraus de 3 s, a nuvem 1 pixel por vez) e pausa ao rolar
  (`data-rolando`, sem React): **180 / 271 / 191 ms**. Fundo grande animado:
  sempre em passos. A seleção da alternativa em `steps(2)` parecia atrasada;
  virou 90 ms liso.

## Regras para animação nova

- Animação contínua (loop, fundo, 3D) precisa **parar quando ninguém vê**:
  fora da tela (`IntersectionObserver`), aba escondida, durante a rolagem.
- Nada que rode no scroll pode passar pelo React nem mexer em layout.
- Tempo de animação JS vem do relógio (`performance.now()`), nunca de
  "+0.016 por quadro": em monitor de 30 ou 120 Hz a cena muda de velocidade.
- Antes de dizer "ficou mais leve", a tabela de antes e depois.

## Armadilhas do próprio script

- O `tsx` injeta `__name` em função nomeada passada a `page.evaluate`; no
  navegador ela não existe. Mande o código como texto.
- Página que não rola nessa largura (o dashboard em 1366 px) não testa nada
  de rolagem: confira `scrollHeight > innerHeight` antes de concluir.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
