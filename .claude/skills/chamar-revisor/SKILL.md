---
name: chamar-revisor
description: "Decidir se revisor-adversarial ou inspetor-visual valem ~66 mil tokens nesta frente, prevendo o achado antes de pagar, e qual conferência barata substitui cada um (design-system-auditor, build-guard, olhar a foto). Usar antes de chamar qualquer revisor, e sempre que a vontade for chamar todos 'por segurança'."
---

# Chamar revisor

Revisor custa **~66 mil tokens** (medido no logica-app: seis chamadas, 395 mil;
duas mudaram o commit, duas acharam pouco, duas nada). No fim daquela sessão o
limite mensal estourou e derrubou agentes no meio do trabalho.

**Preveja o achado antes de pagar.** Escreva em uma frase o que o revisor vai
dizer. Conseguiu? Não chame — vá corrigir. Não consegue prever? Ali ele vale.

## Quem entra, por gatilho

| Revisor | Entra quando | Não entra quando |
|---|---|---|
| `revisor-adversarial` | mecanismo novo: recurso do Next/Prisma/NextAuth não usado antes aqui, rota de API nova, arquivo mudando de pasta, derivação nova de dado | reusa caminho existente e o build passou |
| `inspetor-visual` | composição que não existia: tela nova, grade nova | composição só mudou de lugar e você já olhou a foto |

## A conferência barata que substitui

- **No lugar do inspetor:** agente `design-system-auditor` (tabela com número)
  e olhar a foto você mesmo. O inspetor é o segundo par de olhos, nunca o primeiro.
- **No lugar do adversarial:** agente `build-guard` + `grep` do risco que você
  nomeou na previsão.

## O que nunca se pula

Frente que mexe em **auth** (`lib/auth.ts`, `session-guard`, acesso de usuário
único) ou em **script que escreve no Neon** — o banco é o de produção. Aqui o
adversarial entra sem triagem.

## Depois de decidir

Diga em voz alta: "não chamei o inspetor porque a composição só mudou de lugar
e a foto mostrou X". Pular em silêncio é indistinguível de esquecer.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
