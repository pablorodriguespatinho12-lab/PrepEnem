"""Contraste do texto do cartão da questão translúcido sobre o fundo em pixel
(Pablo, 13/11/2026: "deixa a questão transparente para ver o fundo, mas dá para ler").

Mistura a cor do cartão (com a opacidade testada) com a cor MAIS clara e a MAIS
escura do desenho em pixel e mede o contraste do texto normal e do texto cinza.
AA pede 4,5:1. Uso: python3 scripts/contraste-cartao.py [opacidade ...]
"""
import colorsys
import re
import sys

CORES_FUNDO = sorted(set(re.findall(r'#[0-9a-fA-F]{6}', open('lib/pixel/desenho.ts').read())))
TEMAS = {
    'claro': {'cartao': (195, 33, 99.0), 'texto': (200, 30, 11), 'cinza': (200, 14, 38)},
    'escuro': {'cartao': (200, 22, 10.5), 'texto': (190, 18, 93), 'cinza': (195, 12, 68)},
}


def hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360, l / 100, s / 100)
    return (r * 255, g * 255, b * 255)


def hexa(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def luz(rgb):
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (canal(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = sorted((luz(a), luz(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def pior(opacidade, tema):
    t = TEMAS[tema]
    cartao = hsl(*t['cartao'])
    resultados = []
    for cor in CORES_FUNDO:
        fundo = hexa(cor)
        misto = tuple(opacidade * c + (1 - opacidade) * f for c, f in zip(cartao, fundo))
        resultados.append((contraste(hsl(*t['cinza']), misto), contraste(hsl(*t['texto']), misto), cor))
    return min(resultados)


def main() -> None:
    for op in [float(x) for x in sys.argv[1:]] or [0.7, 0.75, 0.8, 0.85]:
        for tema in TEMAS:
            cinza, texto, cor = pior(op, tema)
            ok = 'ok' if cinza >= 4.5 else 'BAIXO'
            print(f'{op:.2f} {tema:6} texto {texto:5.1f}:1  cinza {cinza:4.1f}:1 ({ok}, pior fundo {cor})')


if __name__ == '__main__':
    main()
