---
name: animation-system
description: "Use ao mexer em qualquer animação, transição ou movimento visual do PrepEnem — entrada de questões, flip de flashcards, partículas de fundo."
---

# Sistema de Animação do PrepEnem

Biblioteca: **Framer Motion 11** (`motion`, `AnimatePresence`). Fundo de
partículas é CSS puro (`components/particles-bg.tsx` + `.particula` em
`globals.css`): só `transform`/`opacity`, roda no compositor. Era canvas
redesenhado a 60 fps na thread principal e travava o treino (05/10/2026) —
não volte para canvas nem para rAF.

## Padrões já em uso (seguir, não inventar novos)

| Contexto | Padrão observado |
|---|---|
| Entrada de listas (cards de deck/matéria) | `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`, stagger via `transition={{ delay: idx * 0.04 }}` |
| Troca de tela/etapa (`AnimatePresence mode="wait"`) | `initial={{ opacity: 0, x: 30 }}` → `exit={{ opacity: 0, x: 30 }}` |
| Transição de questão (Treino/Simulado) | `initial={{ opacity: 0, x: 50 }}` → `exit={{ opacity: 0, x: -50 }}`, `duration: 0.25` |
| Flip 3D de flashcard | `animate={{ rotateY: flipped ? 180 : 0 }}`, `transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}`, `transformStyle: 'preserve-3d'` + `backfaceVisibility: 'hidden'` nas duas faces |
| Hover em card clicável | `whileHover={{ y: -6, transition: { duration: 0.2 } }}` |
| Botão de ação | `whileHover={{ scale: 1.05 }}` `whileTap={{ scale: 0.95 }}` |
| Barra de progresso | `initial={{ width: 0 }}` → `animate={{ width: '${pct}%' }}`, `duration: 0.6` |
| Troca de card sem "buraco" em branco (`AnimatePresence`) | Use `mode="popLayout"` (não `mode="wait"`) quando o card exibido tem altura fixa e a troca precisa parecer contínua — remove o elemento que sai do fluxo (`position: absolute`) em vez de esperar a saída terminar antes de montar o próximo. Envolva num `<div className="relative">` só ao redor do `AnimatePresence` para a posição absoluta não vazar para o header/progresso acima. |
| Feedback de acerto/erro em botão | Pulso de escala (`animate={{ scale: [1, 1.12, 1] }}`, ~0.35s) + `ring-4` na cor do botão clicado; o botão NÃO clicado cai para `opacity-40` (em vez de ambos ficarem pálidos por causa do `disabled:opacity-50`). Isso deixa claro qual resposta foi registrada, sem alert(). |

## Regras

- Durações curtas: 200–300ms para transições de UI, 500–600ms só para o
  flip 3D (efeito físico, spring).
- Anime **apenas** `transform` (`x`, `y`, `scale`, `rotateY`) e `opacity`.
  Nunca anime `width`/`height` de layout real fora de barras de progresso
  (que já são elementos dedicados, sem reflow de vizinhos).
- `AnimatePresence mode="wait"` ao trocar componentes-chave inteiros (evita
  dois estados montados ao mesmo tempo).

## prefers-reduced-motion

Implementado em `app/flashcards/[deckId]/page.tsx` (flip do card, slide de
entrada/saída entre cards, spin do troféu na tela final) via:

```ts
const shouldReduceMotion = useReducedMotion(); // do próprio framer-motion
```

Com `shouldReduceMotion`, os offsets de `x`/`rotate` viram `0` e a
`transition.duration` cai para `0`/`0.01` — sem slide, sem spin, mantendo
a troca de conteúdo instantânea. Esse é o padrão a copiar (gate no offset
+ na duration, não reescrever a estrutura do componente).

### Exceção: o flip do flashcard (commit `a2df4d0`)

O flip é a **única exceção** — ele continua animando sob reduced-motion:

```ts
transition={shouldReduceMotion
  ? { duration: 0.25, ease: 'easeOut' }        // mais curto, sem bounce
  : { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
```

Motivo: ali a rotação **é** o feedback do gesto (a carta virou, o conteúdo
mudou), não decoração. Com `duration: 0` a carta trocava de lado
instantaneamente e não havia sinal nenhum de que a resposta apareceu.
Uma rotação de eixo único em 250ms não é o tipo de movimento que a
diretriz mira (parallax rápido, zoom, deslocamento grande).

Isso **não** se estende ao resto: partículas de fundo e parallax respeitam
reduced-motion sempre. Ver [[decisoes-prepenem]] para a decisão registrada.

Treino e partículas já respeitam (partículas ficam paradas, não somem).
**Ainda sem esse tratamento**: transição de questão no Simulado,
demais páginas com `motion.div` de entrada. Aplique o mesmo padrão sempre
que tocar nessas telas — não precisa refatorar tudo de uma vez.

Ver também [[flashcard-pattern]] para o fluxo completo que usa o flip 3D.
