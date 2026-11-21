import json, sys
src, dst = sys.argv[1], sys.argv[2]
ev = json.load(open(src))["events"]
out, last = [], -1
for e in ev:
    segs = e.get("segs")
    if not segs: continue
    txt = "".join(s.get("utf8", "") for s in segs).replace("\n", " ").strip()
    if not txt: continue
    t = e["tStartMs"] // 1000
    if t // 30 != last:
        last = t // 30
        out.append(f"\n[{t//3600}:{t%3600//60:02d}:{t%60:02d}] ")
    out.append(txt + " ")
open(dst, "w").write("".join(out))
