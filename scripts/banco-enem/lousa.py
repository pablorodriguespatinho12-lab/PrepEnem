"""Pincéis da aula de lousa (jeito Universo Narrado, Pablo, 21/11/2026).

Cada função devolve um dicionário no formato de lib/aula-lousa/tipos.ts. A lousa tem
400 de largura por 280 de altura; `t` é o segundo em que o traço começa. As travas daqui
espelham lib/aula-lousa/validar.ts (o teste data/revisao-final/lousa-das-questoes.test.ts
confere que nenhuma tela some no porteiro) e avisam de texto largo demais, o defeito que
mais aparece quando não se olha a tela.
"""

LARGURA, ALTURA = 400, 280
LARGURA_DO_CARACTERE = 0.40  # letra de mão (Caveat negrito): ~0,40 do tamanho, medido na amostra
MARGEM = 6
CORES = {'tinta', 'azul', 'vermelho', 'verde', 'amarelo', 'cinza', 'rosa', 'verdeClaro'}
MAX_TEXTO, MAX_FALA, MAX_FALAS, MAX_CENAS = 80, 160, 4, 16
AVISOS = []


def _erro(msg):
    raise SystemExit(f'lousa: {msg}')


def _cor(cor):
    if cor not in CORES:
        _erro(f'cor desconhecida: {cor}')
    return cor


def tx(x, y, s, cor='tinta', tam=28, t=0, ancora='middle'):
    if len(s) > MAX_TEXTO:
        _erro(f'texto com mais de {MAX_TEXTO} letras: {s[:30]}')
    largura = len(s) * tam * LARGURA_DO_CARACTERE
    ini = {'start': x, 'middle': x - largura / 2, 'end': x - largura}[ancora]
    # Os avisos se juntam e param tudo em aula_lousa(): assim vêm todos de uma vez.
    if ini < MARGEM or ini + largura > LARGURA - MARGEM:
        AVISOS.append(f'texto largo demais ({largura:.0f} de {LARGURA - 2 * MARGEM}): "{s}" em x={x}, tam={tam}')
    if not 10 <= y <= ALTURA:
        AVISOS.append(f'texto fora da lousa em y={y}: "{s}"')
    return dict(k='tx', x=x, y=y, s=s, cor=_cor(cor), tam=tam, t=t, ancora=ancora)


def hl(x, y, w, h, t, cor='amarelo'):
    return dict(k='hl', x=x, y=y, w=w, h=h, t=t, cor=_cor(cor))


def linha(x1, y1, x2, y2, cor='tinta', t=0, dur=.5):
    return dict(k='linha', x1=x1, y1=y1, x2=x2, y2=y2, cor=_cor(cor), t=t, dur=dur)


def circ(cx, cy, r, cor='tinta', t=0):
    return dict(k='circ', cx=cx, cy=cy, r=r, cor=_cor(cor), t=t)


def caixa(x, y, w, h, cor='tinta', t=0, dur=.6):
    return dict(k='caixa', x=x, y=y, w=w, h=h, cor=_cor(cor), t=t, dur=dur)


def caminho(d, cor='tinta', t=0, dur=.5, larg=3):
    return dict(k='caminho', d=d, cor=_cor(cor), t=t, dur=dur, larg=larg)


def grade(cols, rows, x0, y0, s, gap, t0, passo, marcados=()):
    return dict(k='grade', cols=cols, rows=rows, x0=x0, y0=y0, s=s, gap=gap, t0=t0, passo=passo, marcados=list(marcados))


def _fala(fala):
    if not 1 <= len(fala) <= MAX_FALAS:
        _erro(f'cada tela tem de 1 a {MAX_FALAS} falas')
    for _, frase in fala:
        if len(frase) > MAX_FALA:
            _erro(f'fala com mais de {MAX_FALA} letras: {frase[:40]}')
    return [[t, frase] for t, frase in fala]


def lousa(fala, *desenhos):
    return dict(tipo='lousa', fala=_fala(fala), desenho=list(desenhos))


def papel(fala, rotulo, texto, alternativas=None):
    return dict(tipo='papel', fala=_fala(fala), rotulo=rotulo, texto=texto, **({'alternativas': alternativas} if alternativas else {}))


def prova(pergunta, opcoes, certa, porque, fala=None):
    if len(opcoes) != len(porque) or not 0 <= certa < len(opcoes):
        _erro(f'prova "{pergunta[:30]}": um motivo por opção e a certa dentro da lista')
    return dict(tipo='prova', fala=_fala(fala or [(.3, 'Sua vez! Escolhe uma.')]), pergunta=pergunta, opcoes=opcoes, certa=certa, porque=porque)


def aula_lousa(*cenas):
    if AVISOS:
        avisos = list(AVISOS)
        AVISOS.clear()
        _erro(f'{len(avisos)} problema(s):\n  ' + '\n  '.join(avisos))
    if not 3 <= len(cenas) <= MAX_CENAS:
        _erro(f'a aula tem de 3 a {MAX_CENAS} telas, veio {len(cenas)}')
    return dict(cenas=list(cenas))
