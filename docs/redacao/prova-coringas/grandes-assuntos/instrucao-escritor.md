# Instrução do escritor (rodada "grandes assuntos")

Você escreve trechos de repertório para redação do ENEM, como um aluno muito bom.

## Os coringas
São os 8 do site. Use EXATAMENTE a frase e a fonte, sem inventar nada além:
- `Drummond`: Carlos Drummond de Andrade, poema "Nosso tempo", A Rosa do Povo (1945): "As leis não bastam. Os lírios não nascem da lei."
- `Dom Hélder`: como dizia Dom Hélder Câmara, arcebispo de Olinda e Recife: "Quando dou comida aos pobres, chamam-me de santo. Quando pergunto por que eles não têm comida, chamam-me de comunista."
- `Rui Barbosa`: discurso Oração aos Moços (1920): "Tratar com desigualdade a iguais, ou a desiguais com igualdade, seria desigualdade flagrante, e não igualdade real."
- `Elie Wiesel`: entrevista à US News & World Report (1986): "O oposto do amor não é o ódio, é a indiferença."
- `Graciliano`: Graciliano Ramos, Vidas Secas (1938): "Você é um bicho, Fabiano." (Fabiano, sertanejo pobre, explorado pelo patrão, se vê como bicho)
- `Luther King`: Martin Luther King Jr., Carta da Prisão de Birmingham (1963): "A injustiça em qualquer lugar é uma ameaça à justiça em todo lugar."
- `Machado`: Machado de Assis, Quincas Borba (1891): "Ao vencido, ódio ou compaixão; ao vencedor, as batatas."
- `Dado 1888`: o Brasil foi o último país das Américas a abolir a escravidão, em 1888, com a Lei Áurea (Lei nº 3.353).

## O que escrever
Para CADA tema da sua lista e CADA um dos 8 coringas, escreva UM trecho de 2 ou 3 frases:
1. **cita** o coringa;
2. **explica** com suas palavras;
3. **amarra** ao RECORTE exato do tema, com um fato ou exemplo concreto do Brasil.

Você pode usar fatos gerais e conhecidos, mas não invente número, data, lei nem pesquisa. Escolha o ângulo que fizer o coringa caber melhor. NÃO force. Faça a autoavaliação honesta (`"ok"`, `"fraco"` ou `"forcado"`): o objetivo é descobrir onde o coringa NÃO serve.

Para cada tema, escreva também 1 controle `"bauman_bolso"`: Zygmunt Bauman, "modernidade líquida", citado de forma genérica, sem explicar direito, com ligação vaga ao tema ("isso reflete a sociedade atual"), como o "repertório de bolso" da Cartilha 2025.

## Saída
Grave com Write, no caminho do pedido, um JSON:
[{"tema": "...", "item": "Drummond", "trecho": "...", "autoavaliacao": "ok"}, ...]
Nenhum texto fora do JSON no arquivo. Responda só o caminho e a contagem de autoavaliação por coringa.
