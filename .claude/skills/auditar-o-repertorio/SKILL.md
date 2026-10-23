---
name: auditar-o-repertorio
description: "Varrer CLAUDE.md, skills, agentes e hooks do PrepEnem atrás de fato morto, ponteiro quebrado, regra escrita em dois lugares e gordura que custa por sessão. Usar ao fechar toda frente (o que ela tornou FALSO?), depois de mudança de direção, e quando o Pablo pedir para revisar as ferramentas."
---

# Auditar o repertório

Ferramenta escrita apodrece mais rápido que código, porque **ninguém relê uma
skill que não está carregando**. Código tem build; `CLAUDE.md` não tem.

O pior caso não é a skill podre que ninguém chama — é a que se chama por
obrigação e devolve regra errada com cara de autoridade. Ex. real daqui: o
`STYLE_GUIDE.md` ainda manda usar Plus Jakarta Sans, que saiu no redesign de
05/08/2026.

## Gatilhos

1. **Fim de toda frente:** que afirmação do repertório esta frente tornou
   falsa? Corrija no mesmo commit — é a varredura mais barata, porque você
   acabou de medir o fato novo.
2. Mudou direção ou formato (paleta, fonte, rota apagada).
3. Skill parece longa demais para o que entrega.
4. O Pablo pede.

## As cinco varreduras

1. **Marcador do formato morto.** Conte o termo do que morreu por arquivo:
   ```bash
   for f in .claude/skills/*/SKILL.md .claude/agents/*.md CLAUDE.md STYLE_GUIDE.md; do n=$(grep -icE "termo1|termo2" "$f"); [ "$n" -gt 0 ] && echo "$n $f"; done
   ```
   Fato morto citado como **história** ou **aviso** fica. Sai o citado como
   regra vigente. Teste: seguindo esta linha hoje, faço a coisa certa?
2. **Ponteiro quebrado.** Todo caminho, comando e nome de arquivo citado,
   conferido contra o disco e o `package.json` (aqui só existem `dev`, `build`,
   `start`). Comando quebrado é pior que caminho: alguém roda.
3. **Segunda fonte.** A mesma regra em dois lugares diverge no primeiro ajuste.
   Uma casa, e no outro um ponteiro. E o par: regra escrita uma vez, na skill
   que ninguém abre naquele momento.
4. **Custo por sessão.** Sempre no contexto: `CLAUDE.md` inteiro + a
   `description` de cada skill e agente. Corpo só quando carrega.
   ```bash
   wc -c CLAUDE.md; python3 -c "import re,glob;print(sum(len(re.search(r'description:\s*(.*?)\n',open(p).read()).group(1)) for p in glob.glob('.claude/skills/*/SKILL.md')+glob.glob('.claude/agents/*.md')))"
   ```
   Divida por ~3,6 para tokens. Description é roteamento (o que faz, quando
   chamar); história e número vão no corpo.
5. **A guarda automática.** `.claude/hooks/` (commit-guard, push-guard,
   db-guard, typecheck) e os dois `settings.json`. Guarda podre roda sozinha,
   em toda ferramenta.

## O que não cortar

O porquê e o número medido. Corte nesta ordem: fato morto, duplicação, anedota
sem consequência, enumeração que a description já dava.

## Antes de fechar

Rode as varreduras 1 e 2 de novo e diga o antes e o depois em número. Confira
que o `CLAUDE.md` e `combinar-skills` listam o que existe.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
