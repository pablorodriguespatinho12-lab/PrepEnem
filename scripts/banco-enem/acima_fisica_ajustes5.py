"""Canal Universo Narrado (regra de 21/11/2026, "aula-nova-comeca-pelo-canal"): cada questão nova diz onde o canal ensina o tema
(`arquivo [h:mm:ss]`, em docs/universo-narrado/capitulos) ou "fora do canal: motivo". Conferido em 23/11/2026 com grep nos 9 vídeos.
Achados que mudam o jeito de explicar: o canal usa o FATOR 3,6 (km/h para m/s) e o FATOR 1,2 / 0,8 (porcentagem), como já fazem as questões.
Fora do canal (dito ao Pablo): lançamento horizontal, plano inclinado, mistura de água quente e fria, tubo e corda, resistência interna,
equação dos fabricantes de lentes, resistores em cubo, escada rolante.
"""
from acima_fisica_ajustes import aj

aj('cin-00a', canal='cin-01-video-inteiro-parte-2-13.txt [0:55:31] (fator 3,6)')
aj('cin-00b', canal='fora do canal: lançamento horizontal (0 hits); queda em cin-08-video-inteiro-parte-9-13.txt [5:33:01]; soma de vetores 3-4-5 em cin-04-video-inteiro-parte-5-13.txt [2:44:01]')
aj('cin-00c', canal='cin-03-video-inteiro-parte-4-13.txt [2:22:01] (um para cada lado)')
aj('cin-00d', canal='fora do canal: escada rolante (0 hits); velocidade relativa em cin-03-video-inteiro-parte-4-13.txt [2:22:31]')
aj('din-00a', canal='fis-02-leis-de-newton.txt [1:12:00] (balança no elevador mede a normal)')
aj('din-00b', canal='fora do canal: plano inclinado (0 hits); atrito em fis-02-leis-de-newton.txt [1:35:30]')
aj('din-00c', canal='fis-02-leis-de-newton.txt [0:57:30]')
aj('din-00d', canal='fis-03-movimento-circular.txt [2:02:31] (a tensão do fio faz o papel de força centrípeta)')
aj('ter-00a', canal='fora do canal: mistura de água quente e fria; calor específico em fis-06-calorimetria.txt [5:42:30]')
aj('ter-00b', canal='fis-07-gases-e-leis-da-termodinamica.txt [6:23:01]')
aj('ter-00c', canal='fis-06-calorimetria.txt [5:44:31] (calor latente, Q = m · L)')
aj('ter-00d', canal='fis-06-calorimetria.txt [5:15:00] (condução)')
aj('ond-00a', canal='fis-09-ondulatoria.txt [8:45:01] (v = λ · f); eco em fis-16-som-acustica-e-efeito-doppler.txt [13:22:30], sem conta')
aj('ond-00b', canal='fis-16-som-acustica-e-efeito-doppler.txt [13:29:04]')
aj('ond-00c', canal='fora do canal: tubo sonoro (só harmônicos em fis-16 [13:19:32]); v = λ · f em fis-09-ondulatoria.txt [8:45:01]')
aj('ond-00d', canal='fora do canal: corda vibrante; v = λ · f em fis-09-ondulatoria.txt [8:45:01]')
aj('opt-00a', canal='fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [7:55:30]')
aj('opt-00b', canal='fora do canal: equação dos fabricantes (0 hits); índice de refração em fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]')
aj('opt-00c', canal='cin-00-video-inteiro-parte-1-13.txt [0:28:33] e fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:14:31]')
aj('opt-00d', canal='fis-08-optica-espelhos-esfericos-lentes-e-refra.txt [8:11:34]')
aj('ele-00a', canal='fis-13-potencia-eletrica-e-efeito-joule.txt [11:19:01] (chuveiro)')
aj('ele-00b', canal='fora do canal: resistência interna da bateria (0 hits); Ohm em fis-12-circuitos-eletricos.txt [10:29:33]')
aj('ele-00c', canal='fis-12-circuitos-eletricos.txt [10:40:01] (série) e [10:42:00] (paralelo)')
aj('ele-00d', canal='fora do canal: resistores em cubo (0 hits); série e paralelo em fis-12-circuitos-eletricos.txt [10:40:01]')
