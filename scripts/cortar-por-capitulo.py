import json, re, os, unicodedata

BASE = "/home/pablo/prepenem-app/docs/universo-narrado"
VIDEOS = (("ZhinYiA6TEw", "mat"), ("oqwFZCRApmA", "fis"))


def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40]


def segundos(marca):
    h, m, s = marca.split(":")
    return int(h) * 3600 + int(m) * 60 + int(s)


os.makedirs(f"{BASE}/capitulos", exist_ok=True)
for vid, prefixo in VIDEOS:
    caps = json.load(open(f"{BASE}/bruto/{vid}.capitulos.json"))
    texto = open(f"{BASE}/bruto/{vid}.txt").read()
    blocos = [(segundos(m.group(1)), m.group(2)) for m in re.finditer(r"\[(\d+:\d\d:\d\d)\] (.*)", texto)]
    for i, c in enumerate(caps):
        ini = c["t"]
        fim = caps[i + 1]["t"] if i + 1 < len(caps) else 10**9
        linhas = [f"[{t//3600}:{t%3600//60:02d}:{t%60:02d}] {x}" for t, x in blocos if ini <= t < fim]
        nome = f"{prefixo}-{i:02d}-{slug(c['titulo'])}.txt"
        open(f"{BASE}/capitulos/{nome}", "w").write(f"# {c['titulo']} ({vid}, a partir de {int(ini)}s)\n" + "\n".join(linhas))
        print(nome, sum(len(l.split()) for l in linhas), "palavras")
