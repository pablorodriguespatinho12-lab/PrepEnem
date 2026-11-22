# Plano: "nível acima" de verdade — questões ORIGINAIS aprendidas de ITA, IME, Fuvest, Oxford e Harvard

## O que o Pablo decidiu (22/11/2026)
1. As questões reais (ITA, IME, Fuvest, Oxford, "Harvard/Stanford") **não entram no site**. Elas são **exemplos**: eu estudo como são feitas e crio
   questões **originais** de nível acima. (Isso também tira o problema de direitos: nada de prova copiada, repositório público.)
2. **Fuvest também**: o vídeo do Universo Narrado sobre a Fuvest já está aqui (23 capítulos `fuv-*`, 7 temas) e serve de base.
3. **Escada**: o aluno só pode ser cobrado no que já viu. Cada nível acima combina o conteúdo do degrau com conteúdos **dos degraus anteriores**
   (`precisaAntes` em `data/escadas.ts`). Ex.: começou em porcentagem → regra de três → junta os dois → junta com aritmética.
4. **Juntar de jeitos novos e criativos**. Modelo dele: a questão do ENEM dos 3 círculos e o disco (**geometria plana + probabilidade**: o conteúdo
   de cada parte é simples, o difícil é raciocinar sobre a junção).
5. A amostra "estrada em 3 trechos" (artefato) ele **achou legal** como direção; falta o veredito final de dificuldade.
6. Antes de tudo: geral sem bug (feito). Depois: `/clear`, e eu executo este plano.

## O erro que originou isto
- "Nove operários... 3 saem" no nível acima de Grandezas: "muito fácil, muito genérico". Medido: minhas 36 questões de nível acima têm 220 a 264
  letras; as do ENEM real, 544 a 676; nenhuma com tabela ou figura. Eu medi dificuldade por nº de passos e escrevi variações curtas de clássicos.
- Regra: texto de prova (≥ 600 letras quando couber), tabela ou desenho, 4+ passos, pegadinha de unidade ou de enunciado, **junção de conteúdos**.

## Fase 0 — Preparação (feita)
- `scripts/varredura-geral.ts` (só leitura): 1.406 questões e 757 explicações, **0 bug real** (10 títulos de lousa que passavam do quadro foram corrigidos).
  Falsos alarmes conhecidos: `NaN₃`, `R$/g`, LaTeX do quadro (KaTeX), `$R$`. A varredura confere estrutura, **não** se cada conta está certa.
- Lacunas: 181 lousas de Mat/Fís sem equação montada (`docs/aula-robo-do-antigo.md`) e 19 questões de Matemática em escadas sem explicação pronta.

## Fase 1 — Corpus de exemplos (quase tudo já está aqui; nada vai para o site)
| Exemplo | Onde | Quantos |
|---|---|---|
| Fuvest explicada pelo canal | `docs/universo-narrado/capitulos/fuv-*` (geom. espacial, trigonometria, combinatória/prob., geom. analítica, funções, exponencial/log., geom. plana) | 23 capítulos |
| Provas reais já no repositório | `data/vestibular/` (Fuvest, IME 2024, ITA 2025, Unesp 2025, Unicamp 2024) | 48 questões |
| ENEM real | banco (`anoProva`) | Mat 85, Fís 33, Qui 24 (média 676 letras na Mat) |
| Oxford MAT, HMMT (Harvard–MIT) | só para LER; baixar para pasta fora do repo; `maths.ox.ac.uk` tem 2010–2025 com soluções; HMMT oficial **não confirmado** | opcional, 2ª leva |
- ITA/IME antigos: material livre de Sergio Lima Netto (UFRJ); PDF do ITA costuma vir com fonte codificada (usar a imagem da página).

## Fase 2 — Análise dos exemplos → "gramática do nível acima"
Para cada exemplo: conteúdos que se juntam, técnica, nº de passos, conversões, armadilhas, tamanho, figura/tabela, tipo de enunciado.
Saída: `docs/nivel-acima/gramatica.md` com (a) **catálogo de junções** (par de conteúdos → ideia de questão, ex. círculos + probabilidade),
(b) **régua de dificuldade** medida (letras, passos, conversões, armadilhas, figura), (c) **tipos de pegadinha**, (d) estrutura do enunciado.
Responde "como funciona uma questão de nível acima".

## Fase 3 — Mapa da escada (o que o aluno sabe em cada degrau)
Matemática (ordem e pré-requisito): 1 Aritmética e Porcentagem → 2 Grandezas (antes: 1) · 3 Estatística (1) · 4 Equações (1) → 5 Funções (4) ·
6 Geometria Plana (2) → 7 Geometria Espacial (6) · 8 Análise Combinatória e Probabilidade (1).
- Matriz degrau k × junções permitidas (só degraus ≤ k, respeitando `precisaAntes`).
- **`aluno-do-zero`** lê a jornada até o degrau k e tenta cada junção: onde trava = lacuna → aula "Antes" ou questão-ponte.

## Fase 4 — Fábrica de questões originais (por degrau)
Para cada degrau, ≥ 4 candidatas (2 entram na prova, as outras ficam no banco). Cada uma traz: junção declarada, exemplo que inspirou
(sem copiar), texto grande, tabela ou desenho, 5 alternativas (cada errada = um erro típico), resolução passo a passo.
Controles: (1) **outro agente resolve sem ver a resolução**; (2) `aluno-do-zero` com a jornada do degrau; (3) régua da fase 2; (4) **amostra ao
Pablo (artefato) antes de cada lote**; (5) figura gerada em SVG/webp quando a questão pede.
Primeiro lote: Matemática 2 a 8. Depois Física e Química, mesma receita.

## Fase 5 — Aulas
Lousa de cada uma: canal primeiro (`aula-nova-comeca-pelo-canal`; os capítulos da Fuvest contam), molde dados → letras pela inicial → equação
montada → achando → volta; geometria desenhada; fração em pé; ≤ 300 letras de fala por tela; `revisor-de-fatos` antes de gravar.

## Fase 6 — Trocar as 36 antigas e fechar
Substituir as de nível acima atuais (Mat 20, Fís 13, Qui 3) pelas novas nas escadas (ids `d2-escada-<mat>-ita-<tema>-NN`); as antigas viram
banco, não somem. `varredura-geral`, testes, `npm run build`, navegador (390 px também), Vercel depois do push.
**Cuidado:** `scripts/criar-provas-escada.ts --gravar` regrava a explicação inteira e apaga lousa e letras trocadas.

## Medidas de sucesso
- Nível acima com média ≥ 600 letras, ≥ 40% com tabela ou figura, 100% com junção declarada e lousa.
- Cada questão só usa conteúdo de degraus ≤ ao dela (conferido pelo `aluno-do-zero`).
- Varredura geral sem achado real; o Pablo aprova a amostra de cada lote.

## Decisões em aberto
1. Quantas questões novas por degrau (proposta: 4, 2 na prova). 2. Física e Química entram no 1º lote ou depois da Matemática (proposta: depois).
3. Oxford e HMMT agora ou só se a Fuvest/ITA/IME não bastarem (proposta: só se não bastarem).
