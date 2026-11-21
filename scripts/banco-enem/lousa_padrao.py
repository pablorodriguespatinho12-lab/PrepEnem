"""Telas que se repetem em toda aula de lousa de questão de nível acima (21/11/2026).
Sobre lousa.py: a questão em papel, "por que as outras letras erram" e "o que a questão ensinou"."""
from lousa import hl, lousa, papel, tx

TEMPO_DAS_LETRAS = (.8, 2.2, 3.6, 5.0)


def papel_da_questao(fala, enun, alts):
    return papel(fala, 'Questão de nível acima', enun, alts)


def outras_letras(fala, erradas, certa):
    """erradas: até 4 textos curtos (até 34 letras), um por letra errada; certa: texto verde."""
    ys = (76, 114, 152, 190)
    desenhos = [tx(200, 32, 'por que as outras letras erram', 'tinta', 28, .2)]
    for (texto, y, t) in zip(erradas, ys, TEMPO_DAS_LETRAS):
        desenhos.append(tx(24, y, texto, 'vermelho', 25, t, 'start'))
    desenhos += [hl(26, 208, 340, 44, 6.4, 'verdeClaro'), tx(200, 240, certa, 'verde', 32, 6.5)]
    return lousa(fala, *desenhos)


def ensinou(fala, primeiro, segundo, terceiro):
    """Três ideias curtas (até 34 letras cada) e a segunda sublinhada."""
    return lousa(fala,
                 tx(200, 36, 'o que a questão ensinou', 'tinta', 30, .2),
                 tx(30, 100, primeiro, 'tinta', 26, .8, 'start'),
                 tx(30, 156, segundo, 'tinta', 28, 2.8, 'start'), hl(26, 172, 270, 6, 3.8),
                 tx(30, 216, terceiro, 'tinta', 26, 5.0, 'start'))
