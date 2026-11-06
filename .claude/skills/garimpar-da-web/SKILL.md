---
name: garimpar-da-web
description: "Procurar ideia, biblioteca ou repositório na web e no GitHub, filtrar contra as decisões do PrepEnem e entregar a menor experiência que prova que funciona aqui — com a ordem de ferramentas da mais barata para a mais cara e teto de três candidatos. Usar quando o pedido for 'pesquisa e vê se dá', e antes de escrever do zero algo que provavelmente existe pronto."
---

# Garimpar da web

Pesquisa entra mal de dois jeitos: a lista de dez links que ninguém lê, e a
dependência adotada por parecer legal que vira bug. **A entrega não é o achado,
é a menor experiência que prova que ele funciona aqui.**

## A ordem das ferramentas

| Pergunta | Ferramenta | Nunca |
|---|---|---|
| como se usa a API desta lib | `context7` | responder de memória |
| existe implementação pronta | `gh search repos` / `gh api` (instalado e logado desde nov/2026) ou o `curl` abaixo | ler o README inteiro de 10 repos |
| isto existe, como se chama | `WebSearch` | abrir os dez resultados |
| descoberta ampla, se as de cima falharam | Exa | usar primeiro |
| ler a página que já sei que é a certa | `WebFetch` | usar para decidir relevância |

Relevância se decide pelo trecho da busca. **Teto de três candidatos abertos.**

```bash
curl -s --max-time 20 "https://api.github.com/search/repositories?q=TERMO+language:typescript&sort=stars&per_page=5" | python3 -c "import json,sys;d=json.load(sys.stdin);[print(r['stargazers_count'],(r.get('license') or {}).get('spdx_id','SEM-LICENCA'),r['full_name'],(r.get('description') or '')[:80]) for r in d.get('items',[])]"
```

Nunca despeje o JSON cru.

## O filtro do PrepEnem

Um candidato só passa se:

1. **Não desfaz decisão fechada** (`decisoes-prepenem`): sem treemap, sem
   emoji, sem trocar o teal, movimento só em transform/opacity.
2. **Cabe no stack:** Next 14 App Router, React 18, Prisma 5, NextAuth **v4**
   (exemplo de Auth.js v5 não serve).
3. **Peso justificado:** rota mais pesada hoje tem 161 kB de JS; teto do app é
   300 kB.
4. **Licença** permite uso (`SEM-LICENCA` reprova).
5. **Não pede serviço pago novo** nem AWS (decidido: não será configurada).

## A menor experiência

Antes de propor, rode a menor prova: um componente numa rota de rascunho, um
script em `scripts/` que roda e imprime. Sem isso, você navegou, não pesquisou.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
