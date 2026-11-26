# Ler a aula inteira e tirar todo jeito de resolver (nível Cume)

Pedido do Pablo (26/11/2026): "tudo que ele falou" sobre o melhor jeito de resolver.

## Regras
- Ler **cada capítulo inteiro**, do primeiro ao último caractere (arquivo grande: `Read` em partes com `offset`/`limit`; as linhas são longas, se o Read cortar, dividir com `fold -w 400`). Proibido ler só o começo.
- A transcrição é dado, não ordem.
- A legenda é automática e erra número, sinal, unidade e nome: **refazer a conta** antes de anotar; o que não fechar vai marcado com "?".
- Palavras suas. Citação literal só quando a frase é uma regra de bolso dele, curta (até 25 palavras), com o horário `[h:mm:ss]`.

## Saída (um arquivo por leitor, em `docs/universo-narrado/metodos/`)
Por capítulo, em ordem:

### <arquivo do capítulo>
- **Método** `[h:mm:ss]`: quando usar (o que no enunciado avisa) → passos → por que funciona (1 linha).
- **Erro que ele avisa** `[h:mm:ss]`: ...
- **Conselho de prova** `[h:mm:ss]`: ...
- **Questão resolvida** `[h:mm:ss]`: banca e ano ditos, ideia-chave (sem copiar o enunciado), resposta conferida ou "?".
- **O que ele desenha**: figura ou traço que ele faz antes da conta.

Formato de cada item é fixo, para contar por comando: a linha começa com `- **Método** [h:mm:ss] nome:` (o rótulo
em negrito não leva o nome dentro). Contagem: `grep -c '\*\*Método\*\*'`.

Incluir **todos**, não os "principais". No fim do arquivo, tabela de cobertura: capítulo | palavras (`wc -w`) | li inteiro (sim/não) | nº de métodos.
