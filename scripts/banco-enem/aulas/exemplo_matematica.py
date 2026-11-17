"""Exemplo do jeito do robô em questões que já existem (17/11/2026). Os agentes que
escrevem as outras aulas copiam ESTE formato. Campos:

- formulas: até 4 (figura, nome, conta). Figuras: quadrado, retangulo, triangulo,
  triangulo-retangulo, circulo, trapezio, cilindro, caixa, cone, esfera, porcentagem,
  grafico, contagem, media. Só as fórmulas que a questão USA, já prontas.
- tenho: tabela (informação, valor) com os números do enunciado.
- quer: 1 frase "A questão quer ...".
- equacao: a equação com letras e, entre parênteses, o que ela diz em palavras.
- porque: por que a conta é essa (dividir, multiplicar, tirar...), com exemplo do dia a dia.
- letras: (letra, o que é). A 1ª é o que a questão quer. Cada uma das outras tem
  uma tela "Achando <letra> ..." em telas.
- telas: uma por letra, na ordem; uma delas é "o seu jeito" (o erro que dá a
  alternativa errada mais tentadora) e diz por que não dá. Uma conta por linha.
- volta: a conta final com os valores, depois "Letra X." e o que o número quer dizer.
- valores: (letra, valor) das letras achadas.
- pista e receita: para a questão parecida.
- confere: a conta em Python; tem que dar o número da alternativa certa.
"""

ARQUIVO = 'data/revisao-final/dia-2/dificil-matematica.json'

AULAS = {
  'd2-dificil-mat-15': dict(
    confere=(20 * 15 - 3 * 3 * 3) * 12,
    formulas=[('retangulo', 'Área do retângulo', 'base × altura'), ('circulo', 'Área do círculo', 'π × raio × raio')],
    tenho=[('Quintal', '20 m por 15 m'), ('Raio da piscina', '3 m'), ('Preço da grama', 'R$ 12 por m²'), ('π', '3')],
    quer='A questão quer quanto custa a grama do quintal, sem a piscina.',
    equacao='G = (AQ − AP) × 12 (gasto = área com grama × preço de 1 m²)',
    porque='Por que tirar e depois multiplicar? A grama vai no quintal todo menos a piscina. E cada m² custa R$ 12: 10 m² custam 10 × 12.',
    letras=[('G', 'gasto (o que a questão quer)'), ('AQ', 'área do quintal'), ('AP', 'área da piscina')],
    telas=[
      dict(titulo='Achando AQ (área do quintal)', texto='O quintal é um retângulo: base × altura.\nAQ = 20 × 15 = 300 m²'),
      dict(titulo='Achando AP: o seu jeito',
        texto='Parece certo fazer 2 × 3 × 3 = 18. Mas essa é a VOLTA da piscina, a borda, não o chão dela.\nO chão da piscina é a área do círculo: π × raio × raio.\nAP = 3 × 3 × 3 = 27 m²'),
    ],
    volta='G = (300 − 27) × 12 = 273 × 12 = 3 276\nLetra A. São 273 m² de grama a R$ 12 cada.',
    valores=[('AQ', '300'), ('AP', '27')],
    pista='cobrir "tudo menos" uma parte → área de fora − área de dentro; pediu preço → multiplique no fim.',
    receita=[('1. Tabela do que eu tenho', '20 × 15, raio 3, R$ 12'), ('2. Equação em letras', 'G = (AQ − AP) × 12'), ('3. Achar cada letra', 'AQ = 300; AP = 27'), ('4. Substituir', '273 × 12 = 3 276')]),
}
