---
name: inventar-daqui
description: "Gerar ideia de dentro do repositório (o decidido, o apagado, a dívida declarada, a frente que acabou) e matar a ideia falsa antes de ela custar trabalho; no fim de toda frente, depositar o que ela tornou VERDADEIRO numa linha de skill. Usar quando a pergunta for 'o que a gente faz agora?' e ao FIM de toda frente."
---

# Inventar daqui

`garimpar-da-web` traz ideia de fora. Esta cobre a origem mais barata e mais
ignorada: o próprio repositório.

Falha de origem (logica-app, 26/08/2026): comparei com a referência e entreguei
oito achados. Quatro morreram — e **três tinham a resposta escrita no arquivo
que eu ia editar**. Uma era peça que já existia havia um dia.

## As três perguntas, antes de propor

1. **O arquivo que eu ia mexer já discorda de mim?** Leia o comentário e o
   commit dele primeiro. Aqui os commits têm corpo longo com medida (ex.:
   `901e5d5` explica cada valor de `--primary-text`). Discorda com medida: a
   ideia acabou. Sem medida: achou uma dívida.
2. **Isto já existe?** `grep` pelo **nome** que a peça teria, não pelo sintoma.
   Sintoma aparece em todo lugar e cada achado confirma que o problema é real —
   a sensação que precede reconstruir o que está pronto. Procure também em
   `.claude/` e `docs/`.
3. **Eu medi, ou li um número parecido?** Nomeie o seletor, o arquivo, a rota.

## Onde a ideia boa mora aqui

- **A dívida declarada** em `docs/CONTEXTO-CLAUDE-DESKTOP.md` ("O que falta").
  Confira se ainda existe antes de gastar nela.
- **O que foi apagado e o que sobrou:** AWS/S3 (`lib/aws-client.ts`, `lib/s3.ts`)
  sobrevive degradado; confira a cadeia de import antes de chamar de morto.
- **A assimetria entre telas vizinhas:** treino, simulado e provas mostram a
  mesma alternativa — o commit `1e39bf3` unificou; o que divergiu de novo?
- **A frente que acabou de fechar.** É a fonte mais produtiva, e ninguém chama
  de fonte.

## O roteamento

| A ideia é sobre | Vai para |
|---|---|
| algo pronto lá fora | `garimpar-da-web` |
| tela, cor, forma | `decisoes-prepenem` → `perguntar-ao-pablo` |
| movimento | `animation-system` |
| flashcard ou explicação da IA | `flashcard-pattern` / `decisoes-prepenem` |
| banco | `prisma-neon-safety` |
| procedimento que vai se repetir | `desenhar-skill` |

## O par: o fim de toda frente

`auditar-o-repertorio` pergunta o que a frente tornou **FALSO**. Esta pergunta
o que ela tornou **VERDADEIRO que nenhuma skill sabe**. As duas rodam no mesmo
commit. A linha candidata passa por três cortes:

1. Um agente competente faria o contrário sem a linha? Se não, enfeite.
2. Trocando o nome do projeto, continua valendo? Se sim, é de outro lugar.
3. Nomeia o custo de descumprir, com número ou episódio datado? Se não, não
   será obedecida.

Passou nas três: entra. Em duas: vira frase da mensagem final, não arquivo.

**Memória ≠ skill.** Memória guarda o Pablo e o estado da máquina; procedimento
que se repete vai para skill, porque memória chega por lembrança e skill chega
por nome.

## O corte

Ideia que não muda linha de nenhum arquivo sai. Ideia que muda linha protegida
por comentário com medida sai mais rápido. Ideia de hook morre se um teste ou
o build já cobre — hook custa em toda chamada de ferramenta.

## A regra comum: meça antes de despejar

Saída de comando entra inteira no contexto, e contexto gasto no começo é
trabalho que não cabe no fim. Antes de ler vários arquivos, rodar build ou
chamar subagente, carregue `token-economy`.
