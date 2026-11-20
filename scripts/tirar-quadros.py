"""Lê a seção 'Quadro' de cada resumo e tira uma foto do vídeo em cada horário."""
import glob, os, re, subprocess, sys, unicodedata

BASE = "/home/pablo/prepenem-app/docs/universo-narrado"
VIDEO = {"A": "ZhinYiA6TEw", "B": "ZhinYiA6TEw", "C": "ZhinYiA6TEw", "D": "ZhinYiA6TEw",
         "E": "ZhinYiA6TEw", "F": "ZhinYiA6TEw", "G": "ZhinYiA6TEw", "H": "ZhinYiA6TEw",
         "I": "ZhinYiA6TEw", "J": "oqwFZCRApmA", "K": "oqwFZCRApmA", "L": "oqwFZCRApmA",
         "M": "oqwFZCRApmA"}
lotes = sys.argv[1:]
HORA = re.compile(r"\b(\d+:\d\d:\d\d)\b")


def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:30]


def url_do_video(vid):
    saida = subprocess.run(["yt-dlp", "-f", "bv*[height<=480]", "-g", vid], capture_output=True, text=True)
    return saida.stdout.split("\n")[0]


urls = {}
os.makedirs(f"{BASE}/quadros", exist_ok=True)
for lote in lotes:
    vid = VIDEO[lote]
    if vid not in urls:
        urls[vid] = url_do_video(vid)
    cap, em_quadro, pedidos = None, False, []
    for linha in open(f"{BASE}/resumos/lote-{lote}.md"):
        if linha.startswith("## "):
            cap, em_quadro = linha[3:].strip(), False
            continue
        if re.match(r"\s*\d\.\s*\*\*", linha):
            em_quadro = "Quadro" in linha
        if em_quadro and cap:
            for h in HORA.findall(linha):
                if (cap, h) not in pedidos and sum(1 for c, _ in pedidos if c == cap) < 3:
                    pedidos.append((cap, h))
    for cap, h in pedidos:
        nome = f"{vid[:4]}-{h.replace(':', '')}-{slug(cap)}.jpg"
        destino = f"{BASE}/quadros/{nome}"
        if os.path.exists(destino):
            continue
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", h, "-i", urls[vid],
                        "-frames:v", "1", "-q:v", "4", destino])
        print(nome)
