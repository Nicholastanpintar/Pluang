// app.js — UI wiring for the Nivest demo investment app.

const state = {
  homeRange: "ALL",
  detailRange: "ALL",
  detailTicker: PORTFOLIO.assets[0].ticker,
};

const days = PORTFOLIO.days;
const lastIdx = days.length - 1;

function getAsset(ticker) {
  return PORTFOLIO.assets.find((a) => a.ticker === ticker);
}

function currentChange(series) {
  const first = series[0];
  const last = series[series.length - 1];
  const diff = last - first;
  const pct = (diff / first) * 100;
  return { first, last, diff, pct };
}

// ---------- Home screen ----------

function renderHome() {
  const totalNow = PORTFOLIO.totalSeries[lastIdx];
  document.getElementById("home-total-value").textContent = formatRupiah(totalNow);

  const { days: rDays, series: rSeries } = filterRange(days, PORTFOLIO.totalSeries, state.homeRange);
  const { diff, pct } = currentChange(rSeries);
  const pill = document.getElementById("home-gain-pill");
  pill.textContent = `${formatSignedRupiah(diff)} (${formatPercent(pct)})`;
  pill.className = "pill " + (diff >= 0 ? "up" : "down");

  document.getElementById("home-range-start").textContent = formatDateLong(rDays[0]);
  document.getElementById("home-range-end").textContent = formatDateLong(rDays[rDays.length - 1]);

  drawAreaChart(document.getElementById("home-chart"), rSeries, {
    color: diff >= 0 ? "#1fd67a" : "#ff4d5e",
  });

  const totalInvested = TOTAL_INVESTED;
  const totalReturn = totalNow - totalInvested;
  const totalPct = (totalReturn / totalInvested) * 100;
  const trPill = document.getElementById("home-total-return-pill");
  trPill.textContent = `${formatSignedRupiah(totalReturn)} (${formatPercent(totalPct)})`;
  trPill.style.color = totalReturn >= 0 ? "var(--green)" : "var(--red)";
  document.getElementById("home-total-invested").textContent = formatRupiah(totalInvested);
  document.getElementById("home-total-portfolio").textContent = formatRupiah(totalNow);

  renderAssetList("home-asset-list");
}

function assetItemHTML(asset) {
  const last = asset.series[lastIdx];
  const { diff, pct } = currentChange(asset.series);
  const up = diff >= 0;
  return `
    <div class="asset-item" data-action="detail" data-ticker="${asset.ticker}">
      <div class="asset-badge" style="background:${asset.badgeBg}; color:${asset.badgeColor};">${asset.badgeText}</div>
      <div class="asset-info">
        <div class="name-row">
          <span class="ticker">${asset.ticker}</span>
          <span class="alloc">${Math.round(asset.allocation * 100)}%</span>
        </div>
        <div class="company">${asset.name}</div>
      </div>
      <canvas class="asset-sparkline" data-spark="${asset.ticker}"></canvas>
      <div class="asset-numbers">
        <div class="amount">${formatRupiah(last)}</div>
        <div class="change ${up ? "up" : "down"}">${formatSignedRupiah(diff)} (${formatPercent(pct)})</div>
      </div>
    </div>`;
}

function renderAssetList(containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = PORTFOLIO.assets.map(assetItemHTML).join("");
  el.querySelectorAll("canvas[data-spark]").forEach((cv) => {
    const asset = getAsset(cv.getAttribute("data-spark"));
    const { diff } = currentChange(asset.series);
    drawAreaChart(cv, asset.series, {
      color: diff >= 0 ? "#1fd67a" : "#ff4d5e",
      lineWidth: 1.5,
      padding: { top: 2, right: 2, bottom: 2, left: 2 },
    });
  });
}

// ---------- Portfolio tab ----------

function renderPortfolio() {
  const totalNow = PORTFOLIO.totalSeries[lastIdx];
  document.getElementById("pf-total-value").textContent = formatRupiah(totalNow);
  const totalReturn = totalNow - TOTAL_INVESTED;
  const totalPct = (totalReturn / TOTAL_INVESTED) * 100;
  const pfPill = document.getElementById("pf-total-pill");
  pfPill.textContent = formatPercent(totalPct);
  pfPill.className = "pill " + (totalReturn >= 0 ? "up" : "down");
  renderAssetList("portfolio-asset-list");
}

// ---------- Explore tab ----------

function renderExplore() {
  const el = document.getElementById("explore-asset-list");
  el.innerHTML = PORTFOLIO.assets
    .map((asset) => {
      const last = asset.series[lastIdx];
      const prev = asset.series[lastIdx - 1];
      const dayDiff = last - prev;
      const dayPct = (dayDiff / prev) * 100;
      const up = dayDiff >= 0;
      return `
      <div class="asset-item" data-action="detail" data-ticker="${asset.ticker}">
        <div class="asset-badge" style="background:${asset.badgeBg}; color:${asset.badgeColor};">${asset.badgeText}</div>
        <div class="asset-info">
          <div class="name-row"><span class="ticker">${asset.ticker}</span></div>
          <div class="company">${asset.name}</div>
        </div>
        <div class="asset-numbers">
          <div class="amount">${formatRupiah(last)}</div>
          <div class="change ${up ? "up" : "down"}">${formatSignedRupiah(dayDiff)} (${formatPercent(dayPct)}) hari ini</div>
        </div>
      </div>`;
    })
    .join("");
}

// ---------- Feed tab ----------

const FEED_ITEMS = [
  {
    tag: "Ringkasan Mingguan",
    headline: "MU menopang portofolio di tengah koreksi NVDA",
    body: "Sejak 15 Mei 2026, penguatan tajam pada MU menjadi penopang utama nilai portofolio, sementara NVDA mengalami koreksi harga di periode yang sama.",
    meta: "Ringkasan performa portofolio",
  },
  {
    tag: "Edukasi",
    headline: "Kenapa diversifikasi ke banyak aset itu penting",
    body: "Menyebar dana ke beberapa saham dan ETF dapat membantu meredam dampak penurunan tajam pada satu instrumen saja — seperti terlihat pada selisih performa NVDA dan MU belakangan ini.",
    meta: "Artikel edukasi",
  },
  {
    tag: "Catatan Pasar",
    headline: "ETF seperti QQQ dan VTI melengkapi saham individual",
    body: "QQQ dan VTI memberi eksposur pasar yang lebih luas dan cenderung lebih stabil dibanding memegang saham individual seperti NVDA, MU, atau TTWO saja.",
    meta: "Catatan pasar",
  },
];

function renderFeed() {
  const el = document.getElementById("feed-list");
  el.innerHTML = FEED_ITEMS.map(
    (f) => `
    <div class="feed-card">
      <div class="tag">${f.tag}</div>
      <div class="headline">${f.headline}</div>
      <div class="body">${f.body}</div>
      <div class="meta">${f.meta}</div>
    </div>`
  ).join("");
}

// ---------- Transaksi tab ----------

function renderTransactions() {
  const el = document.getElementById("tx-list");
  const txDate = formatDateLong(days[0]);
  const rows = PORTFOLIO.assets
    .map(
      (asset) => `
      <div class="tx-item" data-action="detail" data-ticker="${asset.ticker}">
        <div class="tx-icon" style="background:${asset.badgeBg}; color:${asset.badgeColor}; font-weight:800; font-size:11px;">${asset.badgeText}</div>
        <div class="tx-info">
          <div class="t1">Beli ${asset.ticker}</div>
          <div class="t2">${asset.name}</div>
        </div>
        <div class="tx-amount">
          <div class="amt">${formatRupiah(asset.startVal)}</div>
          <div class="status">Selesai</div>
        </div>
      </div>`
    )
    .join("");

  el.innerHTML = `<div class="tx-group-label">${txDate}</div>${rows}`;
}

// ---------- Asset detail ----------

function renderDetail() {
  const asset = getAsset(state.detailTicker);
  document.getElementById("detail-badge").style.background = asset.badgeBg;
  document.getElementById("detail-badge").style.color = asset.badgeColor;
  document.getElementById("detail-badge").textContent = asset.badgeText;
  document.getElementById("detail-ticker").textContent = asset.ticker;
  document.getElementById("detail-company").textContent = asset.name;

  const last = asset.series[lastIdx];
  document.getElementById("detail-value").textContent = formatRupiah(last);

  const { days: rDays, series: rSeries } = filterRange(days, asset.series, state.detailRange);
  const { diff, pct } = currentChange(rSeries);
  const pill = document.getElementById("detail-gain-pill");
  pill.textContent = `${formatSignedRupiah(diff)} (${formatPercent(pct)})`;
  pill.className = "pill " + (diff >= 0 ? "up" : "down");

  document.getElementById("detail-range-start").textContent = formatDateShort(rDays[0]);
  document.getElementById("detail-range-end").textContent = formatDateShort(rDays[rDays.length - 1]);

  drawAreaChart(document.getElementById("detail-chart"), rSeries, {
    color: diff >= 0 ? "#1fd67a" : "#ff4d5e",
  });

  const totalDiff = last - asset.startVal;
  const totalPct = (totalDiff / asset.startVal) * 100;
  document.getElementById("detail-alloc").textContent = Math.round(asset.allocation * 100) + "%";
  document.getElementById("detail-invested").textContent = formatRupiah(asset.startVal);
  document.getElementById("detail-current").textContent = formatRupiah(last);
  const profitEl = document.getElementById("detail-profit");
  profitEl.textContent = `${formatSignedRupiah(totalDiff)} (${formatPercent(totalPct)})`;
  profitEl.style.color = totalDiff >= 0 ? "var(--green)" : "var(--red)";

  document
    .querySelectorAll("#detail-range-tabs .range-tab")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.range === state.detailRange));
}

function openDetail(ticker) {
  state.detailTicker = ticker;
  state.detailRange = "ALL";
  showScreen("screen-detail");
}

// ---------- Navigation ----------

// Canvas charts can only measure real dimensions once their screen is
// visible (display:none yields a 0x0 rect), so each screen redraws its
// own charts right after becoming active rather than being pre-rendered.
const SCREEN_RENDERERS = {
  "screen-home": renderHome,
  "screen-portfolio": renderPortfolio,
  "screen-detail": renderDetail,
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.nav === id));
  window.scrollTo(0, 0);
  if (SCREEN_RENDERERS[id]) SCREEN_RENDERERS[id]();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function initRangeTabs(containerId, onChange) {
  const container = document.getElementById(containerId);
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".range-tab");
    if (!btn) return;
    container.querySelectorAll(".range-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    onChange(btn.dataset.range);
  });
}

function init() {
  // screen-home is active by default; portfolio/detail render lazily via
  // showScreen() once visible so their canvases measure real dimensions.
  renderHome();
  renderExplore();
  renderFeed();
  renderTransactions();

  initRangeTabs("home-range-tabs", (range) => {
    state.homeRange = range;
    renderHome();
    document
      .querySelectorAll("#home-range-tabs .range-tab")
      .forEach((b) => b.classList.toggle("active", b.dataset.range === range));
  });

  initRangeTabs("detail-range-tabs", (range) => {
    state.detailRange = range;
    renderDetail();
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.nav));
  });

  document.body.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (action === "toast") showToast(actionEl.dataset.msg);
    else if (action === "goto") showScreen(actionEl.dataset.screen);
    else if (action === "detail") openDetail(actionEl.dataset.ticker);
    else if (action === "close-modal") document.getElementById("profile-modal").classList.remove("active");
  });

  document.getElementById("btn-profile").addEventListener("click", () => {
    document.getElementById("profile-modal").classList.add("active");
  });
  document.getElementById("profile-modal").addEventListener("click", (e) => {
    if (e.target.id === "profile-modal") e.target.classList.remove("active");
  });

  window.addEventListener("resize", () => {
    renderHome();
    if (document.getElementById("screen-detail").classList.contains("active")) renderDetail();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", init);
