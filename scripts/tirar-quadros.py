"""Lê a seção 'Quadro' de cada resumo e tira uma foto do vídeo em cada horário."""
import glob, json, os, re, subprocess, sys, unicodedata

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
PREFIXO = {"fuv": "KHUAr8Svoik", "sim": "cJkXRwVftAs", "tri": "BVS0Rs2nCiY", "cin": "8k8Y1cK7724",
           "dif": "rXqZ7g0gYqc", "dica": "03A-gMP3gqw", "rap": "eO_xiGEQ2IY"}
novos = json.load(open(f"{BASE}/bruto/lotes-novos.json"))
zerados = []
for lote in lotes:
    # lotes antigos (A..M): um vídeo só; lotes N01..N16: cada seção tem o seu vídeo (ordem dos arquivos)
    por_secao = [PREFIXO[a.split("-")[0]] for a in novos[lote]] if lote in novos else None
    if por_secao:
        n_secoes = sum(1 for l in open(f"{BASE}/resumos/lote-{lote}.md") if l.startswith("## "))
        if n_secoes != len(por_secao):
            sys.exit(f"PARE: lote {lote} tem {n_secoes} seções e {len(por_secao)} arquivos")
    cap, em_quadro, pedidos, i_secao = None, False, [], -1
    vid = por_secao[0] if por_secao else VIDEO[lote]
    for linha in open(f"{BASE}/resumos/lote-{lote}.md"):
        if linha.startswith("## "):
            cap, em_quadro = linha[3:].strip(), False
            i_secao += 1
            if por_secao:
                vid = por_secao[i_secao]
            if vid not in urls:
                urls[vid] = url_do_video(vid)
            continue
        if re.match(r"\s*(\*\*)?(\d\.\s*)?(\*\*)?(Gancho|Ordem|Analogias|De onde|Pegadinhas|Quest|Quadro|N[ií]vel)", linha):
            em_quadro = "Quadro" in linha
        if em_quadro and cap:
            for h in HORA.findall(linha):
                if (cap, h, vid) not in pedidos and sum(1 for c, _, _ in pedidos if c == cap) < 4:
                    pedidos.append((cap, h, vid))
    print(f"lote {lote}: {len(pedidos)} horários de quadro", file=sys.stderr)
    for cap, h, vid in pedidos:
        nome = f"{vid[:4]}-{h.replace(':', '')}-{slug(cap)}.jpg"
        destino = f"{BASE}/quadros/{nome}"
        if os.path.exists(destino):
            continue
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", h, "-i", urls[vid],
                        "-frames:v", "1", "-q:v", "4", destino])
        print(nome)
    if not pedidos:
        zerados.append(lote)

if zerados:
    print(f"ATENÇÃO: lotes com 0 horários de quadro: {', '.join(zerados)} (conferir o formato do resumo)", file=sys.stderr)
