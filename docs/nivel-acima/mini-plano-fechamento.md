# Mini plano: fechar o nível acima v2 (24/11/2026)

Continua o plano grande (`~/.claude/plans/eu-estou-com-uma-precious-marshmallow-*.md`). Estado de partida: est, equ, fun, pla corrigidos; 197 testes ok; falta esp/com, rodada 2, desenhos, banco, PR.

| # | Parte | Quem faz | Prova de pronto |
|---|---|---|---|
| 1 | Aluno-do-zero lê esp e com | agente, Sonnet | `leitura/matematica-esp-com.md` existe |
| 2 | Corrigir esp e com | executor + `prompt-corrigir-v2.md` | `montar_v2.py --seco` + `vitest run data/revisao-final` verdes |
| 3 | Desenhos: 16 de Física + 5 de Matemática | executor em levas de 4; eu olho cada foto | cada desenho renderizado e visto; `desenho` ligado no módulo; teste de regra 4 (≥ 40% com figura) |
| 4 | Rodada 2 do aluno-do-zero + gabarito às cegas nas dificultadas | 2 levas de agentes | relatório novo; meta: 0 conta errada |
| 5 | Gravar no banco | eu | `montar_v2` → vitest → `criar-provas-escada.ts --gravar` → SQL lista o que cada prova tem ("conferi X de Y") |
| 6 | Varrer telas 1366 e 390 px, `npm run build` | eu | prints + build sem erro |
| 7 | PR novo (merge é do Pablo), conferir Vercel | eu | hash de `origin/main` no ar |
| 8 | Fechar: `regras-do-pablo.md`, memória, `auditar-o-repertorio`, `inventar-daqui` | eu | commit |

Regras: levas pequenas (429); um commit por parte; uma publicação no fim (cada uma custa ~6 min).
