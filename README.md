# Nivest — Demo Investment Portfolio App

A static, offline-capable demo of a foreign-investment portfolio app (inspired by apps like Pluang). The portfolio itself is **hypothetical** — a fictional Rp30,000,000 split evenly into five instruments (NVDA, MU, TTWO, QQQ, VTI) on **15 May 2026** — but each instrument's daily value is driven by its **real historical closing price** (via Yahoo Finance) through the most recent trading day (17 Jul 2026), converted at a flat ~Rp18,000/USD rate. No real money, no brokerage backend, no live trading.

The actual app (`www/`) is plain HTML/CSS/JS with no build step. The repo root also carries a thin [Capacitor](https://capacitorjs.com/) wrapper config (`capacitor.config.json`, `package.json`, `resources/`) used only by the Android build workflow below — it doesn't affect running the site directly.

## Run locally

Open `www/index.html` in a browser, or serve the folder with any static server, e.g.:

```
cd www
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploy to GitHub Pages

A workflow at `.github/workflows/pages.yml` deploys `www/` automatically on every push to `main`. One-time setup:

1. Push this repo to GitHub.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the site will be published at `https://<username>.github.io/<repo>/`.

## Building the APK (via GitHub Actions)

A workflow at `.github/workflows/android-apk.yml` builds an installable **debug APK** entirely on GitHub's runners — no local Android Studio setup needed:

1. Push to `main`, or open the repo's **Actions** tab → **Build Android APK** → **Run workflow**.
2. When it finishes, open the workflow run and download the **nivest-debug-apk** artifact (a zip containing `app-debug.apk`).
3. Copy the APK to your phone and install it (you'll need to allow "install from unknown sources" — it's unsigned/debug, not from the Play Store).

This uses [Capacitor](https://capacitorjs.com/) to wrap `www/` into a native Android WebView shell: the workflow installs the npm deps, scaffolds the `android/` project fresh each run (`npx cap add android`), generates launcher icons + splash screen from `resources/icon.png`, syncs the web assets in, then runs `./gradlew assembleDebug`. The generated `android/` project isn't committed — it's rebuilt from scratch every run, so `www/` stays the single source of truth.

Note: this produces a debug-signed APK, good for sideloading and testing. Publishing to the Play Store would additionally require a release keystore and signing config, which isn't set up here.

### Alternative: PWA-to-APK tools

Since the app also ships a `manifest.json` and service worker, it qualifies as an installable PWA on its own — you can instead point a tool like [PWABuilder](https://www.pwabuilder.com/) at the live GitHub Pages URL to generate a signed APK/AAB without touching this repo's Actions.
