# Nivest — Demo Investment Portfolio App

A static, offline-capable demo of a foreign-investment portfolio app (inspired by apps like Pluang). The portfolio itself is **hypothetical** — a fictional Rp30,000,000 split evenly into five instruments (NVDA, MU, TTWO, QQQ, VTI) on **15 May 2026** — but each instrument's daily value is driven by its **real historical closing price** (via Yahoo Finance) through the most recent trading day (17 Jul 2026), converted at a flat ~Rp18,000/USD rate. No real money, no brokerage backend, no live trading.

This is plain HTML/CSS/JS with no build step, so it can be hosted directly.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploy to GitHub Pages

A workflow at `.github/workflows/pages.yml` deploys automatically on every push to `main`. One-time setup:

1. Push this repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the site will be published at `https://<username>.github.io/<repo>/`.

## Turning it into an APK

Once the GitHub Pages URL is live, you can wrap it as an installable Android app using a PWA-to-APK tool, e.g.:

- [PWABuilder](https://www.pwabuilder.com/) — paste the Pages URL, it reads `manifest.json`, and generates a signed APK/AAB.
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) — same idea, command-line based (Trusted Web Activity).

The app already ships a `manifest.json`, icons, and a service worker for offline caching, so it qualifies as an installable PWA out of the box.
