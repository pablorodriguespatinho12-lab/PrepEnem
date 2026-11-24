# Auditoria das 56 questões novas de nível acima contra as provas reais (23/11/2026)

Fonte: 14 arquivos `docs/nivel-acima/indice/<conteudo>.md` (cada um com 8 a 18 reais lidas de `~/provas-reais/` e a comparação das nossas 4).
Contagem por comando (`grep` dos vereditos): **13 MANTER, 28 REESCREVER, 15 TROCAR** de 56.

| Conteúdo | a (ENEM) | b (ITA) | c (Fuvest) | d (Harvard) |
|---|---|---|---|---|
| Cinemática | REESCREVER | TROCAR | REESCREVER | TROCAR |
| Dinâmica | REESCREVER | REESCREVER | TROCAR | REESCREVER |
| Termodinâmica | REESCREVER | REESCREVER | REESCREVER | TROCAR |
| Ondas | MANTER | REESCREVER | REESCREVER | TROCAR |
| Óptica | REESCREVER | REESCREVER | REESCREVER | TROCAR |
| Eletricidade | REESCREVER | REESCREVER | REESCREVER | MANTER |
| Aritmética | MANTER | REESCREVER | REESCREVER | TROCAR |
| Grandezas | MANTER | REESCREVER | TROCAR | TROCAR |
| Estatística | MANTER | MANTER | REESCREVER | TROCAR |
| Equações | REESCREVER | TROCAR | MANTER | TROCAR |
| Funções | MANTER | REESCREVER | REESCREVER | TROCAR |
| Geometria Plana | MANTER | TROCAR | REESCREVER | TROCAR |
| Geometria Espacial | MANTER | REESCREVER | REESCREVER | REESCREVER |
| Combinatória | MANTER | REESCREVER | MANTER | MANTER |

## O que a auditoria mostrou
- **43 de 56 não passam** (reescrever ou trocar). Padrão: 1 conta só, ideia já dita no enunciado, sem tabela nem figura, estilo `d` (Harvard) que na verdade é técnica de ENEM.
- **Âncoras erradas ou fracas: cerca de 30** (soma dos relatórios dos agentes, não contada por comando; ?). Exemplos: cin-00b citava ITA 2025 q.13 (é função horária), din-00a citava balanço (a questão é elevador), opt-00a/00c citavam a "luz engarrafada" (conceitual), ele-00c citava uma questão de Química, equ-00d e fun-00d citavam questões de outra técnica.
- **Âncora forte existia** em temas que eu tinha marcado "sem real" (termodinâmica a, b, c; ondas b, c; espelho plano na Fuvest 2021 F04): faltou procurar de verdade.
- **Regra 4 (tabela ou figura):** nenhuma das 56 tem tabela ou figura no enunciado; só a linha "Dados:".
- **Texto ilegível** (fonte cifrada): ENEM 2021, ITA 2022 1ª fase, ITA 2026; usei o banco do site quando possível.

## Os erros meus (causa e onde gravei)
1. Escrevi nível acima de cabeça, sem abrir prova real → âncora "forte" falsa em várias. Gravado em `licoes.md`, `nivel-acima-ancorar-em-questao-real.md` e no porteiro (campo `ancora`).
2. Medi dificuldade por nº de passos, não por ideia escondida → 43 fáceis. Gravado em `docs/nivel-acima/gramatica.md` (a reescrever na Fase 4) e nos índices.
3. Não li a memória do projeto depois do `/clear` → `ler-memoria-do-projeto-antes-de-escrever.md` e linha no `CLAUDE.md`.
4. Disse "substituí as antigas" sem listar o banco → `licoes.md` e `tirar-acima-antigo-das-provas.ts`.
5. Passos de 733 letras e tracinhos que passavam da borda do celular → `cortar_passos.py`, `explicacao-tutor.tsx` e o porteiro.
