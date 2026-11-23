"""Âncora real (regra do Pablo, 22/11/2026: "pega questões reais como exemplo... se não fez, errou").

Cada questão nova de Física e de Aritmética ganha `ancora`: a questão REAL do repositório (ENEM no banco, vestibulares
em data/vestibular) cuja técnica ela segue, com a força: "forte" (mesma técnica), "parcial" (mesmo tema ou jeito, técnica
diferente) ou "sem" (não há real do tema no repositório). As 5 questões de estilo ENEM que ficaram menores que as reais
(422 a 583 letras contra 552 a 1 010 nas ENEM de Física) ganharam contexto, sem mudar nenhum número.
"""
from acima_fisica_ajustes import aj

# ---- Física ----
aj('cin-00a', ancora='parcial · ENEM 2022 q.105 (mangueira: medida do dia a dia leva a uma grandeza pedida em 2 etapas)')
aj('cin-00b', ancora='forte · ENEM 2021 q.128 (lançamento: velocidade em componentes) e ITA 2025 q.13 (Cinemática)')
aj('cin-00c', ancora='sem · não há real de encontro de móveis no repositório (técnica clássica de Fuvest)')
aj('cin-00d', ancora='sem · estilo Harvard–MIT; não há real no repositório (ideia: relacionar duas medições da mesma coisa)')
aj('din-00a', ancora='parcial · ENEM 2022 q.126 (balanço: força além do peso quando há aceleração)')
aj('din-00b', ancora='forte · Unesp 2025 q.78 (esteira: atrito e aceleração máxima do corpo)')
aj('din-00c', ancora='parcial · Unicamp 2024 q.38 (forças em um corpo ligado a outra força)')
aj('din-00d', ancora='forte · ENEM 2022 q.126 (balanço solto a 90°: tração no ponto mais baixo, 3 vezes o peso)')
aj('ter-00a', ancora='sem · não há calorimetria de mistura nas ENEM reais do repositório',
   enunciado=('Para a hora do banho dos netos, uma família enche uma banheira de 40 L misturando água quente do aquecedor a gás, que sai a 70 °C, com água fria da torneira, a 20 °C. '
              'O pediatra recomendou que a água do banho esteja a 38 °C. O pai lembra que o termômetro só mede depois de misturar tudo, então prefere calcular antes quantos litros de cada água usar. '
              'Ele já tentou colocar metade de cada, e a água ficou quente demais. Despreze a troca de calor com a banheira e com o ar, e lembre que 1 L de água tem massa de 1 kg e que o calor '
              'específico é o mesmo para toda a água. Quantos litros de água quente devem ser colocados na banheira?'))
aj('ter-00b', ancora='sem · não há real de gás ideal no repositório (técnica de 1ª lei do ITA)')
aj('ter-00c', ancora='sem · não há real de mudança de fase no repositório (técnica de Fuvest)')
aj('ter-00d', ancora='forte · ENEM 2021 q.126 (panelas: taxa de condução de calor, k, ΔT e espessura)')
aj('ond-00a', ancora='forte · ENEM 2022 q.95 (sinal sonoro: distância pelo tempo, com a velocidade do som no meio)',
   enunciado=('Um barco de pesquisa usa um sonar, aparelho que emite pulsos de ultrassom na água e mede o tempo que cada eco leva para voltar. Os biólogos querem saber a que distância do fundo do lago '
              'um cardume está nadando, para decidir até que profundidade soltar as redes. Em um ponto do lago, o sonar registra dois ecos de um mesmo pulso: o primeiro, vindo do cardume, chega 0,2 s '
              'depois da emissão, e o segundo, vindo do fundo do lago, chega 0,8 s depois da emissão. A velocidade do som na água é de 1 500 m/s, e o pulso vai e volta pelo mesmo caminho vertical. '
              'A distância, em metros, entre o cardume e o fundo do lago é:'))
aj('ond-00b', ancora='sem · não há real de efeito Doppler no repositório (técnica clássica de ITA)')
aj('ond-00c', ancora='parcial · ENEM 2021 q.134 (sino dos ventos: frequência fundamental depende do comprimento)')
aj('ond-00d', ancora='parcial · ENEM 2021 q.134 (frequência fundamental e comprimento); estilo Harvard–MIT')
aj('opt-00a', ancora='parcial · ENEM 2022 q.96 (garrafa PET: óptica do dia a dia; a real é só conceitual, a nova pede a conta)',
   enunciado=('Um projetor antigo de slides, achado no almoxarifado de uma escola, usa uma lente delgada convergente de distância focal 20 cm. O slide, que tem uma figura de 5 cm de altura, '
              'é colocado a 30 cm da lente, e a imagem se forma, nítida, na parede da sala, sem precisar de ajuste. Para não errar a posição do slide, ele marcou com fita a distância de 30 cm entre o slide e a lente, e confirmou que a figura aparece de cabeça para baixo na parede. O professor quer saber o tamanho da figura que a plateia vai ver '
              'e se ela ficará grande o bastante para a turma do fundo. Qual é a altura da imagem projetada na parede, em centímetros?'))
aj('opt-00b', ancora='forte · IME 2024 q.28 (lente: equação dos fabricantes e o índice de refração)')
aj('opt-00c', ancora='parcial · ENEM 2022 q.96 (refração da luz em meio transparente)')
aj('opt-00d', ancora='sem · não há real de espelho plano no repositório (estilo Harvard–MIT)')
aj('ele-00a', ancora='forte · ENEM 2022 q.111 (ducha elétrica: 220 V, vazão, calor específico 4,2 J/(g·°C))',
   enunciado=('O manual de um chuveiro elétrico informa que ele consome 4 200 W e esquenta a água que passa por ele, com vazão de 6 L por minuto. Por causa de perdas na resistência e nos fios, '
              'só 80% da potência elétrica vira calor na água. O fabricante testou o aparelho com a água entrando na temperatura ambiente, e um morador quer saber se o banho sai morno ou frio no inverno. '
              'Considere que 1 L de água tem massa de 1 kg, que o calor específico da água é 4 200 J/(kg · °C) e que a água sai do chuveiro numa temperatura constante, sem perder calor no caminho '
              'até o ralo. Qual é o aumento de temperatura da água ao passar pelo chuveiro, em °C?'))
aj('ele-00b', ancora='forte · ENEM 2022 q.133 (pilhas com resistência interna ligadas a uma lâmpada)')
aj('ele-00c', ancora='parcial · ENEM 2021 q.96 (carro elétrico: tensão e corrente) e q.105 (circuito de lâmpadas)')
aj('ele-00d', ancora='sem · não há real de resistores em cubo no repositório (estilo Harvard–MIT)')
