"""Corta a transcrição dos vídeos novos em pedaços (capítulo, ou janelas de 40 min) e agrupa em lotes de ~30 mil palavras."""
import json, re, os, unicodedata

BASE = "/home/pablo/prepenem-app/docs/universo-narrado"
VIDEOS = (("KHUAr8Svoik", "fuv"), ("cJkXRwVftAs", "sim"), ("BVS0Rs2nCiY", "tri"), ("8k8Y1cK7724", "cin"),
          ("rXqZ7g0gYqc", "dif"), ("03A-gMP3gqw", "dica"), ("eO_xiGEQ2IY", "rap"))
JANELA = 40 * 60
LOTE_PALAVRAS = 30000


def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:30]


def segundos(m):
    h, mi, s = m.split(":")
    return int(h) * 3600 + int(mi) * 60 + int(s)


def hora(t):
    return f"{t//3600}:{t%3600//60:02d}:{t%60:02d}"


arquivos = []
for vid, pre in VIDEOS:
    texto = open(f"{BASE}/bruto/{vid}.txt").read()
    blocos = [(segundos(m.group(1)), m.group(2)) for m in re.finditer(r"\[(\d+:\d\d:\d\d)\] (.*)", texto)]
    fim_total = blocos[-1][0] + 1
    caps = json.load(open(f"{BASE}/bruto/{vid}.capitulos.json")) or [{"t": 0, "titulo": "Vídeo inteiro"}]
    pedacos = []
    for i, c in enumerate(caps):
        ini = int(c["t"])
        fim = int(caps[i + 1]["t"]) if i + 1 < len(caps) else fim_total
        n = max(1, -(-(fim - ini) // JANELA))
        for k in range(n):
            a, b = ini + k * JANELA, min(fim, ini + (k + 1) * JANELA)
            sufixo = f" (parte {k+1}/{n})" if n > 1 else ""
            pedacos.append((c["titulo"] + sufixo, a, b))
    for j, (titulo, a, b) in enumerate(pedacos):
        linhas = [f"[{hora(t)}] {x}" for t, x in blocos if a <= t < b]
        nome = f"{pre}-{j:02d}-{slug(titulo)}.txt"
        palavras = sum(len(l.split()) for l in linhas)
        open(f"{BASE}/capitulos/{nome}", "w").write(f"# {titulo} ({vid}, de {hora(a)} a {hora(b)})\n" + "\n".join(linhas))
        arquivos.append((nome, palavras))

lotes, atual, soma = [], [], 0
for nome, p in arquivos:
    if atual and soma + p > LOTE_PALAVRAS:
        lotes.append(atual)
        atual, soma = [], 0
    atual.append(nome)
    soma += p
lotes.append(atual)
for i, l in enumerate(lotes):
    print(f"N{i+1:02d}", len(l), "arquivos:", l[0].split(".")[0], "...", l[-1].split(".")[0])
json.dump({f"N{i+1:02d}": l for i, l in enumerate(lotes)}, open(f"{BASE}/bruto/lotes-novos.json", "w"))
