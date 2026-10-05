---
name: decisoes-prepenem
description: "Use antes de qualquer mudança de UI, conteúdo gerado por IA, ou visualização de dados no PrepEnem — também ao definir temas/taxonomia ou mexer em animação. Decisões de produto já fechadas, com o motivo de cada uma."
---

# Decisões já tomadas — PrepEnem

Cada item aqui é uma decisão **fechada**, com o motivo. Não são sugestões.
Se algo aqui parecer errado para a tarefa atual, levante a questão com o
usuário em vez de contrariar em silêncio.

## Identidade visual — o que é trava e o que é aberto

Definido no início do redesign visual (2026-08-05). A distinção importa:
o redesign pode reinventar quase tudo, **menos** os itens abaixo.

**Travado (não se renegocia):**

- **Teal "Clareza" é a base cromática.** `--primary: 189 80% 52%`
  (`app/globals.css:75`, também em `--ring` e `--chart-1`). Toda a paleta
  do redesign se constrói a partir dele.
- **Zero emoji na UI** (ver seção abaixo).
- **Limiares de dado esparso** (`<5` sem %, `5–15` com alerta, `15+` limpa).
- **Exceção do flip no reduced-motion.**
- **Proibição de treemap.**

**Aberto para o redesign:** tipografia, escala, densidade, elevação, forma
dos componentes, movimento, personalidade visual. Nada disso está decidido
— não trate o estado atual como referência a preservar.

## Conteúdo gerado por IA

- **Zero emoji** em explicações, feedback ou UI. Hierarquia se faz com
  tipografia (peso, tamanho, cor), não com ícone decorativo.
- **Explicações seguem estrutura baseada em evidência.** Wisniewski/Zierer/
  Hattie (2020): feedback de alta informação tem d=0.99, contra d=0.46 do
  meramente corretivo e d=0.24 do reforço. A ordem importa — começar pelo
  erro explora o efeito de hipercorreção:
  1. O que a questão pedia de fato
  2. Por que a alternativa marcada falha (**começa pelo erro**)
  3. Caminho passo a passo, com o raciocínio explícito
  4. O princípio por trás (feedback de processo, não de resultado)
  5. Como reconhecer uma questão parecida
- **Proibido**: elogio, tom motivacional genérico, "É importante notar",
  parágrafo-preview ("Vamos analisar..."), conclusão vazia que só repete o
  que já foi dito.
- **Flashcards seguem o princípio da informação mínima do SuperMemo**: um
  fato por card, resposta o mais curta possível, sem enumeração longa
  (quebre em cards separados ou use cloze). Ver [[flashcard-pattern]].

## Treino

- **Treino é escada, decidida pelo Pablo em 05/10/2026:** resumo do conteúdo
  do dia → questões Base → Intermediárias → ENEM real por último. Só matérias
  do cronograma do dia. A etapa sai da ORIGEM (`lib/treino-etapas.ts`), não de
  `dificuldade`: as reais do ENEM estão cadastradas como fácil/médio e são as
  mais difíceis da sessão.
- **Degraus:** para até 2 questões do ENEM do assunto do dia (assunto no
  subtema/tema, não no enunciado), a IA gera 2 base + 3 intermediárias que
  quebram a questão em peças; ficam no banco com `ancoraId` e a questão do
  ENEM vem logo depois delas. Sem âncora ou sem IA, cai na escada do banco.
- Sessão aberta só é retomada se tiver menos de 12 h — a de outro dia foi
  montada para outro dia do cronograma.

## Visualização de dados

- **Dado esparso é ruído, não informação.** Numa amostra binária pequena,
  uma resposta a mais muda a taxa em 20-33 pontos:
  - `< 5` questões: **não mostra %** — mostra "poucos dados"
  - `5–15`: mostra a % **com indicador de baixa confiança**
  - `15+`: mostra a % limpa
  - Em todos os casos, **o n fica visível** ("73% · 15 questões", nunca o
    número solto). Implementado em `TaxaAcerto` (`app/progresso/page.tsx`).
- **Sem treemap** para comparar desempenho entre matérias/subtemas. Área
  visual não permite comparação precisa entre categorias (Nielsen Norman
  Group) — e comparar taxa de acerto é exatamente esse caso de uso.

## Animação

- `prefers-reduced-motion` é respeitado, **exceto no flip do flashcard** —
  ali a rotação comunica o estado (a carta virou, o conteúdo mudou), não é
  decoração. Sob reduced-motion o flip fica mais curto e sem bounce
  (`{ duration: 0.25, ease: 'easeOut' }`), mas continua visível.
- **Partículas de fundo e parallax respeitam sempre** — esses são
  decorativos e são exatamente o tipo de movimento que a diretriz mira.
- Detalhes de implementação e padrões em uso: [[animation-system]].

## Taxonomia de temas

- Temas usam **nomes de conteúdo reconhecíveis** pelo estudante
  ("Estequiometria", "Geometria Analítica"), não jargão de competência da
  matriz do INEP.
- **Categorias temáticas foram rejeitadas** ("Esporte e Sociedade", "Temas
  Culturais e Sociais"). Essas são categorias de *tema de prova*, não de
  conteúdo disciplinar — a questão vai para o tema de conteúdo mais próximo,
  senão a navegação por tema deixa de servir ao propósito (achar o que
  estudar).
- Taxonomia em `lib/tema-taxonomy.ts`; o campo `subtema` original fica
  intacto no banco, `tema` é populado a partir dele.

## Infraestrutura

- **Neon é o mesmo banco de dev e de produção.** Não há banco separado.
  Qualquer script que escreve, escreve em produção — descoberto quando o
  script de geração de imagens atualizou produção antes do deploy. Ver
  [[prisma-neon-safety]] para o checklist antes de escrever.
- **AWS não será configurada.** As credenciais eram do bucket da Abacus (não
  do usuário) e o bucket já responde 403. Upload de PDF degrada com mensagem
  clara (`lib/aws-client.ts`, 503) em vez de estourar 500. As questões com
  imagem usam `public/questoes-imagens/` pré-renderizado e o `pdf-proxy`
  busca do INEP — nenhum dos dois depende de S3.
- **`AUTH_TRUST_HOST` não é necessário.** É conceito do Auth.js v5; este
  projeto usa NextAuth v4, onde a variável não tem efeito.
- **Validar em produção depois do push, nunca só local.** Já houve caso de
  bug reportado em produção que não reproduzia local — porque produção
  rodava código de antes do push. Ver [[vercel-deploy-checklist]].
