"""Rigenera la pagina Sostenibilità di www.cablaggitalia.com dai dati misurati.

Uso:
  python strumenti/aggiorna_sostenibilita.py                      # ricalcola da dati-energia.json
  python strumenti/aggiorna_sostenibilita.py --letture letture.json  # applica nuove letture dell'inverter

letture.json (totali cumulativi dall'entrata in esercizio, in kWh):
  {"data": "2026-11-09", "produzione": 8203.8, "consumo": 10160.1,
   "prelevata": 3467.4, "immessa": 1463.7, "batteria_caricata": 1892.7}
Facoltativo, per i mezzi: "mobilita": {"data": "...", "km_model3": ..., "km_proace": ..., "wallbox_kwh": ...}

Calcoli (gli stessi spiegati nella pagina):
  autoprodotta e consumata = consumo - prelevata
  autosufficienza = autoprodotta / consumo
  CO2 evitata fotovoltaico = produzione x fattore ISPRA (g/kWh)
Solo libreria standard Python.
"""
import argparse, datetime, json, os, re, sys

QUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_P = os.path.join(QUI, "dati-energia.json")
TPL_P = os.path.join(QUI, "sostenibilita.template.html")
OUT_P = os.path.join(QUI, "sostenibilita.html")
SITEMAP_P = os.path.join(QUI, "sitemap.xml")
MESI_IT = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
MESI_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"]


def it_int(x):  # 10160 -> "10.160"
    return f"{int(round(x)):,}".replace(",", ".")

def en_int(x):
    return f"{int(round(x)):,}"

def it_dec(x, d=1):  # 65.9 -> "65,9"
    return f"{x:.{d}f}".replace(".", ",")

def data_it(s):
    y, m, d = map(int, s.split("-")); return f"{d} {MESI_IT[m-1]} {y}"

def data_en(s):
    y, m, d = map(int, s.split("-")); return f"{d} {MESI_EN[m-1]} {y}"


def applica_letture(d, L):
    e, i = d["energia"], d["impianto"]
    e["produzione_totale_kwh"] = round(L["produzione"])
    e["consumo_sede_kwh"] = round(L["consumo"])
    e["prelevata_da_rete_kwh"] = round(L["prelevata"])
    e["immessa_in_rete_kwh"] = round(L["immessa"])
    e["batteria_caricata_kwh"] = round(L["batteria_caricata"])
    e["autoprodotta_consumata_kwh"] = round(L["consumo"] - L["prelevata"])
    e["autosufficienza_pct"] = round((L["consumo"] - L["prelevata"]) / L["consumo"] * 100, 1)
    avvio = datetime.date.fromisoformat(i["in_esercizio_dal"])
    i["giorni_esercizio"] = (datetime.date.fromisoformat(L["data"]) - avvio).days
    d["aggiornato"] = L["data"]
    if "mobilita" in L:
        mo, m = L["mobilita"], d["mobilita"]
        m["km_model3"], m["km_proace"] = round(mo["km_model3"]), round(mo["km_proace"])
        m["km_totali"] = m["km_model3"] + m["km_proace"]
        m["wallbox_erogati_kwh"] = round(mo["wallbox_kwh"])
        m["aggiornato"] = mo["data"]
    return d


def ricalcola_emissioni(d):
    c, e = d["emissioni"], d["energia"]
    f = c["fattore_ispra_g_kwh"] / 1000
    c["evitate_fotovoltaico_kg"] = round(e["produzione_totale_kwh"] * f)
    c["evitate_totali_kg"] = c["evitate_fotovoltaico_kg"] + c["evitate_mobilita_kg"]
    return d


def controlla(d):
    e = d["energia"]
    assert 0 < e["autosufficienza_pct"] < 100, "autosufficienza fuori scala"
    assert e["autoprodotta_consumata_kwh"] <= e["produzione_totale_kwh"] + 1, "autoconsumo > produzione"
    assert e["immessa_in_rete_kwh"] < e["produzione_totale_kwh"], "immessa > produzione"


def rendi(d):
    e, i, c, m = d["energia"], d["impianto"], d["emissioni"], d["mobilita"]
    pct = e["autosufficienza_pct"]; g = round(100 - pct, 1)
    v = {
        "data_it": data_it(d["aggiornato"]), "data_en": data_en(d["aggiornato"]),
        "data_mob_it": data_it(m.get("aggiornato", d["aggiornato"])),
        "data_mob_en": data_en(m.get("aggiornato", d["aggiornato"])),
        "prod": it_int(e["produzione_totale_kwh"]), "cons": it_int(e["consumo_sede_kwh"]),
        "cons_en": en_int(e["consumo_sede_kwh"]), "self": it_int(e["autoprodotta_consumata_kwh"]),
        "grid": it_int(e["prelevata_da_rete_kwh"]), "exp": it_int(e["immessa_in_rete_kwh"]),
        "batt": it_int(e["batteria_caricata_kwh"]), "co2pv": it_int(c["evitate_fotovoltaico_kg"]),
        "pct": it_dec(pct), "pct_css": f"{pct:.1f}", "gpct": it_dec(g), "gpct_css": f"{g:.1f}",
        "co2t": it_dec(c["evitate_totali_kg"] / 1000), "days": str(i["giorni_esercizio"]),
    }
    t = open(TPL_P, encoding="utf-8").read()
    out = re.sub(r"\{\{(\w+)\}\}", lambda mm: v[mm.group(1)], t)
    assert "{{" not in out, "segnaposto non sostituito"
    open(OUT_P, "w", encoding="utf-8", newline="\n").write(out)
    if os.path.exists(SITEMAP_P):  # lastmod della pagina = data dei dati
        s = open(SITEMAP_P, encoding="utf-8").read()
        s = re.sub(r"(sostenibilita\.html</loc>\s*<lastmod>)[^<]*", lambda mm: mm.group(1) + d["aggiornato"], s)
        open(SITEMAP_P, "w", encoding="utf-8", newline="\n").write(s)
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--letture", help="file JSON con le nuove letture dell'inverter")
    a = ap.parse_args()
    d = json.load(open(JSON_P, encoding="utf-8"))
    if a.letture:
        d = applica_letture(d, json.load(open(a.letture, encoding="utf-8")))
    d = ricalcola_emissioni(d)
    controlla(d)
    open(JSON_P, "w", encoding="utf-8", newline="\n").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
    v = rendi(d)
    print(f"Pagina aggiornata al {v['data_it']}: produzione {v['prod']} kWh, autosufficienza {v['pct']}%")


if __name__ == "__main__":
    main()
