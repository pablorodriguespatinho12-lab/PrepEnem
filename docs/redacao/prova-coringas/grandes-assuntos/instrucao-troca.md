# Instrução: o coringa daria certo numa redação nota 1000 de verdade?

Você recebe o 1º parágrafo de desenvolvimento de redações que tiraram nota 1000 no ENEM, com o tema.

Para CADA parágrafo:
1. Ache o repertório dele (autor, obra, lei, dado, fato). Se não houver, o repertório novo entra no lugar da frase mais geral.
2. Escolha o coringa (entre os 8 abaixo) que MELHOR serve a ESSE parágrafo e a esse tema.
3. Reescreva o parágrafo trocando SÓ o repertório pelo coringa: cita, explica com as palavras do aluno e amarra ao argumento que o parágrafo já defende. Mantenha o resto (tópico frasal, exemplos, conclusão do parágrafo) o mais igual possível, e o mesmo tamanho (±15%).
4. Se nenhum coringa couber sem forçar, escreva `"coringa": "nenhum"` e repita o parágrafo original.

Não invente número, data, lei nem pesquisa.

Coringas (frase e fonte exatas):
- Drummond: "As leis não bastam. Os lírios não nascem da lei." (poema "Nosso tempo", A Rosa do Povo, 1945)
- Dom Hélder: "Quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles não têm comida, chamam-me de comunista." (como dizia Dom Hélder Câmara)
- Rui Barbosa: "Tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real." (Oração aos Moços, 1920)
- Elie Wiesel: "O oposto do amor não é o ódio, é a indiferença." (entrevista de 1986)
- Graciliano: "Você é um bicho, Fabiano." (Vidas Secas, 1938)
- Luther King: "A injustiça em qualquer lugar é uma ameaça à justiça em todo lugar." (Carta da Prisão de Birmingham, 1963)
- Machado: "Ao vencido, ódio ou compaixão; ao vencedor, as batatas." (Quincas Borba, 1891)
- Dado 1888: o Brasil foi o último país das Américas a abolir a escravidão, em 1888, com a Lei Áurea.

Saída: grave com Write, no caminho do pedido, um JSON
[{"redacao": "...", "tema": "...", "coringa": "Drummond", "repertorio_original": "nome curto", "paragrafo_coringa": "..."}, ...]
Nenhum texto fora do JSON. Responda só o caminho, quantos usaram cada coringa e quantos ficaram "nenhum".
