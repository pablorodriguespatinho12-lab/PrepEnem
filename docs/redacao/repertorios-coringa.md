# Repertórios coringa raros

Pedido do Pablo (29/10/2026): "repertórios que nunca são utilizados, coisa muito
rara, mas que serve para tudo, em todo tipo de contexto: um argumento coringa".
Estão em `lib/redacao/autores.ts` (`CORINGAS`). No site, aparecem em
`receita.ts` (`coringas` de cada motivo), nas pílulas de autores (com a marca
"raro") e na ajuda da IA.

## O que o INEP diz (e por que cada coringa tem uma "amarra")

Cartilha do Participante 2025 (paginação impressa). Cópia usada:
https://curso-objetivo.br/vestibular/assets/download/a-redacao-no-enem-2025-cartilha-do-participante.pdf

- **p.16, "Cuidado com o repertório de bolso!":** são referências "prontas,
  memorizadas e frequentemente utilizadas", usadas "de forma genérica e pouco
  aprofundada, sem uma conexão genuína com o tema proposto". "É como se fosse um
  repertório 'guardado no bolso' para ser usado com qualquer tema."
- **p.16:** se o avaliador "perceber que o repertório foi inserido de forma
  decorada, automática ou forçada", pode considerá-lo **não produtivo**, e isso
  prejudica a Competência II.
- **p.18, exemplo do Bauman:** "ainda que se trate de um autor respeitado e de um
  conceito relevante", perde ponto, porque "a argumentação apoia-se mais na
  autoridade do autor do que na construção efetiva de um raciocínio próprio".
- **p.19, "Como evitar":** "Articule o repertório usado com as ideias utilizadas
  para defender seu ponto de vista. Mostre que você entende o conteúdo citado."
- **p.26:** a Competência II só chega a 200 com "repertório sociocultural produtivo".

Conclusão. Um repertório "que serve para qualquer tema" não é proibido e não
zera a redação. Ele é punido quando entra decorado e solto. Por isso cada
coringa daqui vem com duas coisas:

1. a **ideia em 1 linha**, para o aluno explicar com as palavras dele;
2. a **frase de amarra** para cada motivo em que ele serve, mostrando o caminho
   até o tema.

O site lembra isso na ficha: "Escreva com as suas palavras e ligue ao tema.
Decorado e solto, o corretor tira ponto."

O raro ajuda de um jeito: o corretor reconhece o "de bolso" também pela
repetição (o Bauman aparece em 4 de 4 listas de cursinho). Mas raro e forçado
continua perdendo ponto.

## O que as redações bem avaliadas usam

Nas 20 redações das cartilhas de 2024 e 2025 (`docs/redacao/introducoes-1000.md`),
o repertório da introdução foi:

- **cultura em 13:** filme, música, livro, peça. Exemplos: "Bença" (Djonga),
  "Negro Drama" (Racionais), *As Intermitências da Morte* (Saramago), *Vestido
  de Noiva* (Nelson Rodrigues).
- **fato histórico em 3**, e só 1 conceito sem autor.

Por isso 6 dos 10 coringas são de cultura.

## Critérios (nota de 0 a 2 em cada, máximo 8)

| Critério | 2 | 1 | 0 |
|---|---|---|---|
| Raro | a busca "<nome> redação enem" não achou página de cursinho | aparece em poucas | aparece em listas de "repertório coringa" |
| Serve a vários motivos (com amarra que não força) | 3 ou mais dos 5 | 2 | 1 |
| O leigo entende | a ideia cabe em 1 linha sem palavra técnica | precisa de 1 explicação | abstrata |
| Fato conferido | autor, obra e ano em fonte primária ou acadêmica | só em fonte secundária | não conferido |

## Os 10 escolhidos

"Motivos" são os que têm frase de amarra no código. A nota do critério "o
leigo entende" é da 1ª leitura do agente `aluno-do-zero` (sim 2, mais ou menos
1, não 0). As fichas foram reescritas depois dessa leitura, para explicar o
que travou: Vargas, abolição, oleiro, "hipótese".

| Coringa | Área | Motivos | Nota | Fonte |
|---|---|---|---|---|
| Efeito Mateus, Robert K. Merton, *Science*, 1968 | Sociologia | acesso, mercado, história | 7 | Merton, "The Matthew Effect in Science", *Science* 159 (1968) |
| Efeito espectador, Darley e Latané, 1968 | Psicologia | estigma, Estado | 7 | *Journal of Personality and Social Psychology* (1968) |
| Crença no mundo justo, Melvin Lerner, 1980 | Psicologia | estigma, acesso | 6 | *The Belief in a Just World*, Plenum (1980) |
| Cidadania regulada, Wanderley Guilherme dos Santos, 1979 | Ciência política | Estado, história, acesso | 6 | *Cidadania e Justiça*, Campus (1979); oasisbr.ibict.br |
| "Vozes da Seca", Luiz Gonzaga e Zé Dantas, 1953 | Música | Estado, estigma, acesso | 7 | Diário do Nordeste e Rádio Senado, centenário de Zé Dantas |
| "A Cidade", Chico Science & Nação Zumbi, 1994 | Música | acesso, mercado | 6 | disco *Da Lama ao Caos*; afropop.org |
| *A Caverna*, José Saramago, 2000 | Literatura | mercado, estigma, acesso | 8 | Companhia das Letras; en.wikipedia.org/wiki/The_Cave_(novel) |
| *Recordações do Escrivão Isaías Caminha*, Lima Barreto, 1909 | Literatura | estigma, história, acesso | 7 | anaisonline.uems.br |
| *Uma História de Amor e Fúria*, Luiz Bolognesi, 2013 | Cinema | história, mercado, acesso | 6 | annecyfestival.com (Cristal de 2013) |
| *A Revolta da Vacina*, Nicolau Sevcenko, 1984 | História | Estado, acesso, estigma | 6 | Brasiliense (1984); epsjv.fiocruz.br |

**Correções do professor-checador (29/10/2026), já aplicadas nas fichas:**

- **Efeito Mateus:** o artigo de 1968 é sobre **crédito na ciência**. "Vantagem
  que se acumula" é a extensão posterior. A amarra de mercado diz "o mesmo
  mecanismo com o dinheiro", sem pôr na boca de Merton o que ele não disse.
- **Efeito espectador:** no experimento, as pessoas **ouviam** a crise (não viam).
  O que caía era a chance de **cada um** ajudar. A amarra de Estado é analogia e
  diz "como no efeito espectador".
- **Cidadania regulada:** eram os direitos **trabalhistas e a aposentadoria**, não
  todos os direitos. A Constituição de 1988 universalizou direitos; a amarra fala
  em "restos dessa lógica".
- **"Vozes da Seca":** sem a palavra "esmola" na ficha. O verso "esmola vicia" é
  usado contra programa social e pode soar como ataque ao Bolsa Família. A ficha
  fala em "ajuda que acaba logo, sem a obra que fica".
- ***A Caverna*:** o Centro é um shopping gigante (com moradia). O estigma é por
  ser visto como **antigo**.
- **Isaías Caminha:** no romance ele é "mulato". O livro não trata da abolição:
  a amarra de história diz que ele foi "escrito 21 anos após o fim da escravidão".
- **Amor e Fúria:** de 1566 a 2096 são uns 530 anos, então a ficha diz "mais de 500".
- **Revolta da Vacina:** sem risco. O livro diz que a vacina era boa e que o erro
  foi o modo autoritário do "bota-abaixo".

Em cada motivo, os 3 coringas cobrem pelo menos 2 áreas diferentes:

| Motivo | Coringas |
|---|---|
| Omissão do Estado | Vozes da Seca, Cidadania regulada, Revolta da Vacina |
| Herança histórica | Amor e Fúria, Cidadania regulada, Isaías Caminha |
| Desigualdade de acesso | Efeito Mateus, A Cidade, Mundo justo |
| Estigma e invisibilidade | Efeito espectador, Mundo justo, Isaías Caminha |
| Mercado acima das pessoas | A Caverna, Efeito Mateus, A Cidade |

## Os cortados, e por quê

| Candidato | Motivo do corte |
|---|---|
| Janelas quebradas (Wilson e Kelling, 1982) | virou bandeira de política policial dura; risco de soar como defesa de repressão |
| Paradoxo de Jevons (1865), externalidade (Pigou, 1920) | servem só ao motivo "mercado"; e Pigou não usava a palavra "externalidade" |
| Lei de Campbell (1979) e Goodhart (1975) | abstratas demais para o iniciante; a frase famosa é de Marilyn Strathern (1997), não de Goodhart |
| Cegueira deliberada (Heffernan, 2011) | sem edição brasileira; há um livro jurídico brasileiro com o mesmo nome, o que confunde |
| Tragédia dos comuns (Hardin, 1968) | média em raridade; bom para meio ambiente, fraco para os outros motivos |
| Honneth, Jessé Souza, Hans Jonas, Krenak, Crenshaw, Milton Santos, *O Alienista* | a checagem achou em páginas de cursinho: já são comuns |
| *Estamira*, *O Menino e o Mundo*, *Terra Sonâmbula*, *Estação Carandiru* | já aparecem em listas de filmes e livros para o ENEM 2026 |
| *Cabra Marcado para Morrer*, *Gota d'Água*, Rosana Paulino, Claudia Andujar, Cildo Meireles, BaianaSystem, Agualusa | bons e raros, mas servem a menos motivos ou pedem mais contexto; ficam de reserva |

## Como usar: cita, explica, amarra

Exemplo para o tema de 2020 ("O estigma associado às doenças mentais na
sociedade brasileira"), motivo "estigma":

> Segundo o experimento de Darley e Latané (1968), quanto mais gente vê um
> problema, menos alguém age, porque cada um acha que outro vai resolver. Isso
> se verifica no Brasil quando todos percebem o sofrimento de quem tem
> depressão e, justamente por isso, ninguém se sente responsável por ajudar.

1. **Cita:** quem e onde ("o experimento de Darley e Latané, de 1968").
2. **Explica:** a ideia com as suas palavras.
3. **Amarra:** liga a ideia ao tema do dia ("quem tem depressão").

Sem o passo 3, vira repertório de bolso.

## Limites desta análise

- A raridade foi medida por busca ("<nome> redação enem"), não por contagem em
  redações reais. A busca roda nos EUA e traz poucas páginas brasileiras.
- A lista do que é batido saiu de 4 listas abertas, e a contagem é fraca. Bauman
  apareceu em 4 de 4.
- Letras de música: o site cita só o verso curto de "A Cidade" ("o de cima sobe e
  o de baixo desce"). Confira a letra numa fonte licenciada antes de citar outro verso.
