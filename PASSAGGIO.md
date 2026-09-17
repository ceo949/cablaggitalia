# PASSAGGIO — cablaggitalia.com

Documento di passaggio consegne per il sito **Nuova Elettronica S.r.l.**
Ultimo aggiornamento: 2026-09-17

- **Cartella locale:** `C:\Users\info\sito\`
- **Repository GitHub:** https://github.com/ceo949/cablaggitalia (branch `master`)
- **Sito live:** https://www.cablaggitalia.com

> ⚠️ Il repository viene modificato anche dal sito web di GitHub (es. commit di maggio–luglio 2026).
> Prima di lavorare in locale eseguire sempre `git pull`.

---

## 1. Obiettivo e posizionamento

Sito vetrina B2B di **Nuova Elettronica S.r.l.** (Avigliana, TO), dal 1978:
**cablaggi su disegno cliente, crimpatura controllata, collaudo al 100%,
rilavorazione / riparazione / restauro di cablaggi**, con qualità documentata.

Pubblico: uffici acquisti e tecnici di costruttori di macchine, integratori di automazione,
robotica, filiera automotive, uffici manutenzione. Sito bilingue **IT/EN**.

**Scelta di tono (decisa dal titolare):** presentare una struttura solida e in espansione,
ma senza dati tecnici o attrezzature che non esistono.

---

## 2. Mappa delle pagine

| File | Pagina | Note |
|------|--------|------|
| `index.html` | Home | card A–G: cablaggi industriali, automotive, **tracciabilità**, assemblaggi, **rilavorazione/restauro**, prototipi, collaudo |
| `chi-siamo.html` | Chi siamo | storia 1978 → Almese 1988 → Avigliana 2023 |
| `servizi.html` | Servizi (8 linee) | 01 cablaggi · 02 crimpatura · 03 assemblaggi · 04 **tracciabilità & report qualità** · 05 collaudo · 06 **rilavorazione, riparazione e restauro** · 07 prototipazione · 08 co-progettazione & valutazione in sede |
| `settori.html` | Settori | 01 robotica · 02 automazione · 03 automotive · 04 **rilavorazione & restauro** |
| `processo.html` | Processo (8 fasi) | + sezione "Obiettivi qualità 2026" |
| `certificazioni.html` | Certificazioni | ISO 9001, IPC/WHMA-A-620 (CIS), rilavorazione IPC, laboratorio (6 voci) |
| `contatti.html` | Contatti | form Formsubmit |
| `privacy.html`, `cookie.html`, `note-legali.html` | Legali | |
| `demo-particelle.html` | Demo animazioni | non in navigazione, **non versionata** |

**Rimosse il 2026-09-17:** `fibra-ottica.html` e `fiber-particles.js` (attività mai svolta),
più ogni riferimento alla fibra (menu, home, servizi, settori, certificazioni, form, sitemap).

### Asset
- `style.css` — stile unico con variabili CSS.
- `partials.js` — header/footer condivisi, menu (6 voci), toggle IT/EN (attributi `data-en`).
- `connector3d.js` (connettore 3D in home), `particles.js` (hero home).
- `img/logo-mark.png` — simbolo del logo (header e footer).
- `img/logo.png` — logo completo con scritta (Open Graph, JSON-LD).
- `favicon.ico`, `img/favicon-32.png`, `img/favicon-512.png`, `apple-touch-icon.png`.
- `img/tracciabilita.svg` — illustrazione etichetta Data Matrix + rapporto micrografico (servizi 04).
- `ChatGPT Image 9 lug 2026, 15_59_36.png` — foto rilavorazione auto (servizi 06, settori 04).
- `docs/` — `certificato-iso-9001.pdf`, `politica-qualita.pdf`.
- `social/` — materiale social, **non versionato** (contiene `node_modules/`).

---

## 3. Tecnologie e pubblicazione

- HTML/CSS/JS statico, nessun framework né build. Google Fonts, Three.js + GSAP via CDN.
- **Hosting:** GitHub Pages, branch `master` (root); `CNAME` = `www.cablaggitalia.com`.
- **DNS:** Aruba. **Email:** Google Workspace (`ceo@`, `info@`, `candidature@`).
- **Form contatti:** Formsubmit.co → `info@cablaggitalia.com`, conferma su
  `https://www.cablaggitalia.com/contatti.html?sent=1`. Funziona: **non cambiare servizio**
  senza aver configurato e testato l'alternativa (un tentativo Web3Forms senza chiave è stato scartato).
- **Deploy:** commit + `git push` su `master`.
- Il repository ha terminazioni di riga **CRLF** (checkout Windows).

---

## 4. Identità visiva

Palette bianco / nero / oro:

| Variabile | HEX | Variabile | HEX |
|---|---|---|---|
| `--paper` | `#ffffff` | `--ink` | `#0e0e0c` |
| `--paper-2` | `#f6f3ec` | `--ink-soft` | `#2a2826` |
| `--paper-3` | `#efe9db` | `--ink-dim` | `#6b655a` |
| `--gold` | `#f5c518` | `--ink-faint` | `#b5ac98` |
| `--gold-deep` | `#c99902` | `--gold-soft` | `#fff3b4` |

Font: **Fraunces** (titoli, anche corsivo) + **JetBrains Mono** (etichette).
Logo: omino nel cerchio con spina "E", saette oro e "N" oro. Ora servito **in locale** (non più da Wix).

---

## 5. Dati reali da rispettare (verificati con il titolare)

**Azienda:** P.IVA 12220630011 · REA 1273965/TO · PEC nuovaelettronica@pec.it ·
Viale Caduti della Polveriera 21, 10051 Avigliana (TO) · tel. +39 380 218 9876.

**Certificazioni**
- ISO 9001:2015, certificato **WCS** (ente accreditato Accredia).
- IPC/WHMA-A-620: certificazione **CIS** (non CIT).
- **Nessuna** IATF 16949. La progettazione **non** è certificata.

**Attrezzature**
- Macchine taglio/spellatura **Nuova Gamma**, presse di crimpatura **MECAL** (niente Komax, niente "25/40 kN").
- **CableEye M4:** continuità punto-punto, cortocircuiti, inversioni, resistenza.
  **Niente** alta tensione: niente 1500 V DC, >100 MΩ, hipot, 2 kV AC.
- Microscopio **digitale 4,5×** (non metallografico, non misura da solo).
- **Software proprietario** di analisi micrografica: misura altezza/larghezza di crimpatura
  dall'immagine, esito rispetto alle tolleranze del master, trend di usura per pressa e applicatore.
- Tracciabilità: etichetta a bandiera con codice anonimo a 7 cifre e **Data Matrix cifrato**,
  collegato a S/N, report CableEye e storico rilavorazioni.
- **Non esistono:** marcatura laser CableMark, magazzino automatico, avvitatori in coppia
  con log, database "Q-TRACK", report 8D. Non citarli.

**Processo**
- Micrografia + pull test **a inizio e fine di ogni commessa**, con rapporto consegnato al cliente.
- **Nessun intervento on-site:** solo valutazione tecnica presso il cliente e preventivo.
  Il sopralluogo/visita nello stabilimento di Avigliana resta.
- **Nessuna lavorazione in fibra ottica.**
- Slipring: attività reale ma **volutamente non citata** (troppo di nicchia).

**Indicatori:** i volumi (fino a 10.000 pz/mese, ~10.000 crimp/giorno) sono coerenti con la realtà.
Gli indicatori di qualità sono presentati come **obiettivi 2026** (FTR ≥ 99,5%, resi < 50 PPM,
offerta entro 48 h, 2 micrografie per commessa), non come valori misurati.
Se arrivano dati reali, sostituirli.

---

## 6. Cronologia recente

- **2026-04-16/17** — migrazione da Wix, 11 pagine, SEO completa.
- **2026-05/07** — modifiche dal web GitHub: hero, font, sezioni rilavorazioni IPC (servizi, home, certificazioni).
- **2026-09-17** — revisione contenuti con il titolare:
  - redirect Formsubmit su dominio proprio;
  - rimossi testimonial inventato, IATF, CIT → CIS, dati CableEye in alta tensione, microscopio metallografico;
  - aggiunti software proprietario, tracciabilità Data Matrix, rapporto micrografico, restauro, co-progettazione;
  - rimossa la fibra ottica e gli interventi on-site; Komax → Nuova Gamma / MECAL;
  - KPI trasformati in obiettivi; corretti errori tecnici (crimp height, OS2, cleaving);
  - rimossi CableMark, magazzino automatico, avvitatori, Q-TRACK, 8D;
  - logo e favicon portati in locale.

---

## 7. Da fare / aperti

- Confermare o togliere **"3.240 commesse concluse"** (home).
- Da verificare: "blocco automatico del lotto" (certificazioni), "archivio 10 anni",
  consegne JIT / kanban, settori extra citati (ferroviario, energia, difesa, packaging).
- Sostituire la foto `ChatGPT Image ...png` con foto reali del reparto e rinominarla senza spazi.
- Valutare foto reali di: banco crimpatura, postazione micrografia, etichetta Data Matrix, report di esempio anonimo.
- Decidere se versionare `social/` (con `.gitignore` per `node_modules/`) e `demo-particelle.html`.
- Verificare PageSpeed dopo le modifiche (storico: ~84 mobile / ~91 desktop).

## 8. Idee scartate

- Riferimenti a clienti specifici (ABB, KUKA, FANUC, YASKAWA, RMD) — rimossi per riservatezza.
- Hack font-loading + `content-visibility` — peggioravano il CLS.
- Connettore SVG statico Deutsch — sostituito dal 3D.
- Web3Forms — non configurato, si resta su Formsubmit.
- Pagina fibra ottica — attività mai svolta.
