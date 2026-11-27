# Como orquestrar agentes: o que os estudos dizem (27/11/2026)

Complementa `pesquisa-agentes-tokens-2026-11-26.md`. **Limite:** li resumos de busca, não os artigos inteiros;
números dos autores, não medidos aqui.

| Achado | Fonte | O que muda aqui |
|---|---|---|
| Multiagente com orquestrador: +90,2% no teste interno de pesquisa, gastando ~15x os tokens de uma conversa; o pedido precisa de objetivo, formato de saída, ferramentas e limite | [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | agente só em trabalho que vale o custo; pedido com os 4 itens |
| 180 configurações: agentes soltos multiplicam o erro 17,2x, com orquestrador 4,4x; em tarefa em sequência, todo multiagente piorou 39 a 70% | [Google + MIT](https://arxiv.org/abs/2512.08296) | sequência: fazer sozinho; paralelo: eu confiro tudo antes de entregar |
| Com o mesmo orçamento de raciocínio, 1 agente empata ou ganha; time ganha quando o contexto de um fica longo ou sujo (teto testado de 10 mil, contestado) | [Stanford](https://arxiv.org/abs/2604.02460) | padrão é 1 agente; dividir para limpar contexto |
| 14 modos de falha em 3 grupos: desenho do sistema, desalinhamento, verificação ausente ou errada | [Berkeley, MAST](https://arxiv.org/abs/2503.13657) | consertar o pedido e o arquivo do agente; verificação com comando |
| Manual que cresce em itens curtos, atualizados um a um (sem reescrever tudo), aprende com o retorno da execução: +10,6% em agentes | [Stanford, SambaNova, Berkeley (ACE)](https://arxiv.org/abs/2510.04618) | cada erro vira 1 linha no arquivo do agente; editar a linha velha, não duplicar |
| Gestores acharam menos erros quando pensavam que o texto era de uma IA | [NYT, reproduzido no The Star](https://www.thestar.com.my/tech/tech-news/2026/07/07/were-only-starting-to-grasp-the-pitfalls-of-using-ai-at-work) | conferir na fonte, nunca aceitar relatório |

Não achei estudo de Harvard sobre o tema nas buscas.

## Regras de orquestração (resultado)
1. Padrão: fazer sozinho. Agente quando as partes são independentes, a leitura sujaria o contexto, ou a conferência pede olhos limpos.
2. Nunca dividir raciocínio em sequência.
3. Pedido: objetivo, fonte, ferramentas, limite, formato de saída.
4. Toda saída passa por conferência com comando antes de chegar ao Pablo.
5. Erro de agente: 1 linha no arquivo dele no mesmo turno; linha vencida sai.
