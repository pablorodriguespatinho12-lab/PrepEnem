"""Protótipo da fase 2 (24/11/2026): queda livre e velocidade média com equação + legendas.
Grava em app/revisao/lousa-preview/lousas.json (prévia local, não vai ao banco)."""
import json
from pathlib import Path

CAMINHO = Path(__file__).resolve().parent.parent / "app/revisao/lousa-preview/lousas.json"


def lousa(fala, desenho):
    return {"tipo": "lousa", "fala": fala, "desenho": desenho}


def titulo(s):
    return {"k": "tx", "x": 200, "y": 34, "s": s, "cor": "tinta", "tam": 26, "t": 0.2}


queda = {"cenas": [
    lousa([[0.3, "Queda livre: a altura depende só do tempo."]], [
        titulo("queda livre"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "h", "leg": "altura", "cor": "verde"}, {"s": "="},
            {"s": "5", "leg": "g ÷ 2", "cor": "vermelho"}, {"s": "×"},
            {"s": "t", "leg": "tempo"}, {"s": "×"}, {"s": "t", "leg": "tempo"}]},
    ]),
    lousa([[0.3, "O 5 vem da gravidade: 10 dividido por 2."]], [
        titulo("de onde vem o 5"),
        {"k": "eq", "y": 120, "t": 0.6, "tam": 44, "partes": [
            {"s": "g", "leg": "gravidade"}, {"s": "="}, {"s": "10", "leg": "m/s²"}]},
        {"k": "eq", "y": 210, "t": 2.4, "tam": 44, "partes": [
            {"s": "10", "leg": "gravidade"}, {"s": "÷"}, {"s": "2", "leg": "metade"},
            {"s": "="}, {"s": "5", "leg": "o número da fórmula", "cor": "vermelho"}]},
    ]),
    lousa([[0.3, "Agora a mesma equação com os números da questão."]], [
        titulo("com os números"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "h", "leg": "altura"}, {"s": "="},
            {"s": "5", "leg": "10 ÷ 2"}, {"s": "×"},
            {"s": "2", "leg": "s"}, {"s": "×"}, {"s": "2", "leg": "s"}]},
        {"k": "eq", "y": 230, "t": 3.0, "tam": 44, "partes": [
            {"s": "h"}, {"s": "="}, {"s": "20", "leg": "metros", "cor": "verde"}]},
    ]),
]}

media = {"cenas": [
    lousa([[0.3, "Velocidade média é quanto andou por quanto tempo levou."]], [
        titulo("velocidade média"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "v", "leg": "velocidade", "cor": "verde"}, {"s": "="},
            {"s": "d", "leg": "distância"}, {"s": "÷"}, {"s": "t", "leg": "tempo"}]},
    ]),
    lousa([[0.3, "Trocando as letras pelos números: 120 km em 2 horas."]], [
        titulo("com os números"),
        {"k": "eq", "y": 130, "t": 0.6, "tam": 44, "partes": [
            {"s": "v", "leg": "km/h"}, {"s": "="},
            {"s": "120", "leg": "km"}, {"s": "÷"}, {"s": "2", "leg": "horas"}]},
        {"k": "eq", "y": 230, "t": 3.0, "tam": 44, "partes": [
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
