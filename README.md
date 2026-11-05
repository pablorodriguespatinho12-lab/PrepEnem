# PrepEnem

Plataforma de estudo para o ENEM: cronograma do dia, treino em escada de dificuldade com questões reais, explicação passo a passo com desenho, correção de redação pela grade do INEP, flashcards com revisão espaçada e uma trilha opcional de Cálculo.

<!-- Pablo: coloque aqui o link do site no ar e um print da tela inicial -->

## O que tem dentro

| Área | O que faz |
|---|---|
| **Início** | O cronograma de hoje e um botão "Começar". O dia só avança com o treino terminado. |
| **Treino** | Escada: fácil → médio → difícil → ENEM real por último. Antes de cada assunto novo, o conceito vem primeiro. Provas montadas abrem com um aquecimento de questões fáceis. |
| **Explicação** | Um passo por tela, sem rolar: a pergunta, o que acontece, o jeito rápido (quadro de escola), por que funciona, a resposta e uma pergunta para você. |
| **Redação** | Treino por partes (tema → motivos → tese → parágrafos) e correção nas 5 competências, com o trecho do texto que justifica cada nota. |
| **Flashcards** | Um fato por cartão; os errados no treino viram cartão sozinhos. |
| **Cálculo** | 41 degraus do pré-cálculo ao Cálculo 3, cada lição aberta com uma cena que se mexe. |

## Decisões e por quê

- **A IA levanta evidência, o código dá a nota.** Na redação, C1, C2 e C5 saem de regras da grade do INEP, e o código confere se o trecho citado pela IA existe no texto. Nota sem trecho é inválida.
- **O que não pode falhar, o código garante.** A IA descreve o desenho em JSON e o app desenha (gerador de imagem erra eixo e número). Questão gerada com gabarito inválido é descartada, nunca vira "A".
- **Uma segunda IA confere antes de guardar.** Outro modelo procura erro de conteúdo na explicação. Medido em 50 questões: ~12% tinham erro real, agora corrigido direto no texto.
- **Cache de respostas da IA:** a explicação caiu de 10.838 ms para 41 ms.
- **Dado esparso não vira porcentagem.** Com menos de 5 questões aparece "poucos dados", porque uma resposta a mais muda a taxa em 20 a 33 pontos.
- **Repertório de redação só entra se for provado:** 3 juízes cegos avaliam cada candidato em temas reais do ENEM, com controles. Drummond ("As leis não bastam") passou nos 28 temas de 1998 a 2025.
- **Explicação baseada em evidência:** começa pelo erro (efeito de hipercorreção) e explica o processo, não só o resultado (Wisniewski, Zierer e Hattie, 2020).

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Prisma 5 · NextAuth 4 · Postgres (Neon) · Vercel · Vitest e Playwright.

## Como foi construído

Construído com Claude Code como par de programação. Eu tomo as decisões de produto e de arquitetura, e reviso o que entra. O projeto tem a própria "equipe" em `.claude/`:

- **Agentes** com uma função cada: `build-guard` (build antes do commit), `db-inspector` (confere o banco antes de escrever), `revisor-adversarial` (revisa o diff sem ver a conversa), `aluno-do-zero` (lê as explicações como alguém que só sabe as quatro operações) e `inspetor-visual`.
- **Hooks** que bloqueiam commit com erro de tipo, push automático e escrita no banco sem confirmação.
- **Skills** com as decisões do produto (`decisoes-prepenem`) e os procedimentos que se repetem.

## Rodar localmente

```bash
npm install
# crie um .env com DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL e as chaves de IA
npm run dev
```

Testes: `npm test` (sem IA) · e2e em `tests/e2e/`.
