"""Baixa a legenda automática (pt) e os capítulos de vídeos do YouTube e grava texto com horário.
Uso: python3 -I scripts/baixar-legendas.py ID [ID ...]   (ID pode ser 'busca:texto')"""
import json, os, subprocess, sys

BASE = "/home/pablo/prepenem-app/docs/universo-narrado/bruto"
YT = os.path.expanduser("~/.local/bin/yt-dlp")


def achar_id(busca):
    saida = subprocess.run([YT, "--flat-playlist", "--print", "%(id)s|%(channel)s", f"ytsearch5:{busca}"],
                           capture_output=True, text=True).stdout.splitlines()
    for linha in saida:
        vid, canal = linha.split("|", 1)
        if "Universo Narrado" in canal:
            return vid
    raise SystemExit(f"não achei: {busca}")


def baixar(vid):
    subprocess.run([YT, "-q", "--skip-download", "--write-auto-subs", "--sub-langs", "pt-orig",
                    "--sub-format", "json3", "-o", f"{BASE}/%(id)s", "--", vid])
    info = subprocess.run([YT, "--skip-download", "--dump-json", "--", vid], capture_output=True, text=True)
    meta = json.loads(info.stdout)
    caps = [{"t": c["start_time"], "titulo": c["title"]} for c in (meta.get("chapters") or [])]
    json.dump(caps, open(f"{BASE}/{vid}.capitulos.json", "w"), ensure_ascii=False)
    subprocess.run(["python3", "-I", "/home/pablo/prepenem-app/scripts/legenda-para-texto.py",
                    f"{BASE}/{vid}.pt-orig.json3", f"{BASE}/{vid}.txt"])
    palavras = len(open(f"{BASE}/{vid}.txt").read().split())
    print(vid, meta["duration_string"], len(caps), "capitulos", palavras, "palavras |", meta["title"][:50])


for alvo in sys.argv[1:]:
    baixar(achar_id(alvo[6:]) if alvo.startswith("busca:") else alvo)
