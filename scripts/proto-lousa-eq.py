"""Protótipo da fase 2 (24/11/2026): queda livre e velocidade média com equação + legendas.
Grava em app/revisao/lousa-preview/lousas.json (prévia local, não vai ao banco)."""
import json
from pathlib import Path

CAMINHO = Path(__file__).resolve().parent.parent / "app/revisao/lousa-preview/lousas.json"


def lousa(fala, desenho):
    return {"tipo": "lousa", "fala": fala, "desenho": desenho}


def titulo(s):
    return {"k": "tx", "x": 200, "y": 34, "s": s, "cor": "tinta", "tam": 26, "t": 0.2}


def eq(y, t, partes, tam=44):
    return {"k": "eq", "y": y, "t": t, "tam": tam, "partes": partes}


def p(s, leg=None, cor=None):
    d = {"s": s}
    if leg:
        d["leg"] = leg
    if cor:
        d["cor"] = cor
    return d


# Regra 24: ~20% das telas dizem o que a questão quer e quais dados pegar; o resto é só equação.
queda = {"cenas": [
    lousa([[0.3, "A questão quer a altura da queda. Dados: 2 segundos, gravidade 10."]], [
        titulo("queda livre: o que pede"),
        eq(90, 0.6, [p("h", "altura (quer)", "verde"), p("="), p("?")]),
        eq(165, 1.6, [p("t", "tempo"), p("="), p("2", "s")]),
        eq(240, 2.6, [p("g", "gravidade"), p("="), p("10", "m/s²")]),
    ]),
    lousa([[0.3, "A velocidade cresce 10 por segundo. Em 2 segundos chega a 20."]], [
        titulo("1. velocidade no fim"),
        eq(120, 0.6, [p("v", "velocidade"), p("="), p("g", "gravidade"), p("×"), p("t", "tempo")]),
        eq(240, 2.6, [p("v", "m/s"), p("="), p("10", "g"), p("×"), p("2", "s"), p("="), p("20", "m/s", "verde")]),
    ]),
    lousa([[0.3, "Ela começa em 0 e termina em 20: a média é a soma sobre 2."]], [
        titulo("2. velocidade média"),
        eq(120, 0.6, [p("vm", "média"), p("="), p("0 + 20|2", "média das pontas")]),
        eq(235, 3.0, [p("vm", "m/s"), p("="), p("10", "metade de 20", "vermelho")]),
    ]),
    lousa([[0.3, "Altura é velocidade média vezes tempo."]], [
        titulo("3. altura"),
        eq(120, 0.6, [p("h", "altura"), p("="), p("vm", "média"), p("×"), p("t", "tempo")]),
        eq(235, 2.6, [p("h", "metros"), p("="), p("10", "m/s"), p("×"), p("2", "s"), p("="), p("20", "m", "verde")]),
    ]),
    lousa([[0.3, "Atalho da fórmula: g sobre 2, a metade que veio da média."]], [
        titulo("o atalho da fórmula"),
        eq(110, 0.6, [p("h", "altura"), p("="), p("g|2", "metade de g", "vermelho"), p("×"), p("t"), p("×"), p("t")]),
        eq(218, 3.0, [p("h"), p("="), p("10|2"), p("×"), p("2"), p("×"), p("2"), p("="), p("20", "m", "verde")], 36),
    ]),
]}

media = {"cenas": [
    lousa([[0.3, "Velocidade média é quanto andou por quanto tempo levou."]], [
        titulo("velocidade média"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "v", "leg": "velocidade", "cor": "verde"}, {"s": "="},
            {"s": "d|t", "leg": "distância por tempo"}]},
    ]),
    lousa([[0.3, "Trocando as letras pelos números: 120 km em 2 horas."]], [
        titulo("com os números"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "v", "leg": "km/h"}, {"s": "="},
            {"s": "120|2", "leg": "km por horas"}]},
        {"k": "eq", "y": 225, "t": 3.0, "tam": 44, "partes": [
            {"s": "v"}, {"s": "="}, {"s": "60", "leg": "km/h", "cor": "verde"}]},
    ]),
    lousa([[0.3, "Resposta: 60 km por hora."]], [
        titulo("resposta"),
        {"k": "eq", "y": 150, "t": 0.6, "tam": 52, "partes": [{"s": "60", "leg": "km por hora", "cor": "verde"}]},
    ]),
]}

dados = json.loads(CAMINHO.read_text())
dados["proto-queda"] = queda
dados["proto-media"] = media
CAMINHO.write_text(json.dumps(dados, ensure_ascii=False))
print("ok", len(dados))
