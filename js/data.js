// data.js — portfolio data built from real historical closing prices
// (NVDA, MU, TTWO, QQQ, VTI) fetched for 15 May 2026 - 17 Jul 2026.
// Rp30,000,000 was split into 5 equal Rp6,000,000 buys on 15 May 2026,
// converted at a flat USD/IDR rate of 18,000, then re-valued each
// trading day using that ticker's real closing price.

const TRADING_DATES = [
  "2026-05-15", "2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21", "2026-05-22",
  "2026-05-26", "2026-05-27", "2026-05-28", "2026-05-29", "2026-06-01", "2026-06-02",
  "2026-06-03", "2026-06-04", "2026-06-05", "2026-06-08", "2026-06-09", "2026-06-10",
  "2026-06-11", "2026-06-12", "2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18",
  "2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25", "2026-06-26", "2026-06-29",
  "2026-06-30", "2026-07-01", "2026-07-02", "2026-07-06", "2026-07-07", "2026-07-08",
  "2026-07-09", "2026-07-10", "2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16",
  "2026-07-17",
];

const INITIAL_CASH = 78450;

const REAL_SERIES = {
  NVDA: [6000000, 5920114, 5874578, 5950737, 5845286, 5733978, 5721463, 5661282, 5705219, 5622403, 5974436, 5933428, 5718533, 5822652, 5461566, 5555832, 5543849, 5336943, 5455441, 5463962, 5657287, 5523078, 5449582, 5610421, 5556098, 5326824, 5299130, 5212320, 5126842, 5191816, 5328155, 5261317, 5188088, 5207261, 5244008, 5435469, 5399787, 5617611, 5419758, 5639979, 5658619, 5522812, 5400586],
  MU: [6000000, 5642977, 5785389, 6060691, 6309994, 6218089, 7417658, 7686998, 7646511, 8039633, 8573676, 8810477, 8938564, 8246626, 7153783, 7859797, 7748931, 7384539, 8245550, 8127481, 9008280, 8451633, 8637347, 9389148, 10029918, 8708388, 8681396, 10047968, 9375404, 9482627, 9557228, 8547016, 8077388, 8153479, 7769547, 7855822, 8210527, 8108354, 7758121, 8139983, 7487208, 7064279, 7029090],
  TTWO: [6000000, 5993070, 5893582, 5855964, 5892097, 5631496, 5461227, 5406534, 5391932, 5547599, 5617390, 5503547, 5340703, 5361739, 5305808, 5260271, 5247896, 5208547, 5248639, 5240472, 5351345, 5691388, 5643376, 5921795, 5928972, 6004950, 5834928, 5907936, 5903234, 6116565, 6186603, 6195017, 6310592, 6395232, 6379888, 6221251, 6090579, 6018809, 6041082, 5866358, 6033658, 5928972, 5857449],
  QQQ: [6000000, 5974187, 5937371, 6035716, 6047226, 6072870, 6180695, 6173670, 6225720, 6248656, 6286150, 6315094, 6298591, 6268122, 5967246, 6060429, 5990690, 5871017, 6069316, 6105032, 6296814, 6177140, 6114934, 6268207, 6245610, 6039948, 6014303, 6063053, 5979603, 6128222, 6232491, 6137446, 6031061, 6117558, 6004232, 6021243, 6121451, 6140324, 6023782, 6091067, 6074563, 5974694, 5884897],
  VTI: [6000000, 5993714, 5955671, 6023984, 6038871, 6066990, 6111154, 6109500, 6147544, 6162100, 6176325, 6192204, 6147378, 6175994, 6010586, 6028616, 6015383, 5922259, 6025804, 6059878, 6161934, 6126206, 6049953, 6119921, 6100403, 6015880, 6015052, 6020511, 5991399, 6072449, 6120748, 6108011, 6099576, 6147709, 6113635, 6091140, 6144071, 6164581, 6116447, 6139274, 6160115, 6129680, 6070629],
};

const ASSETS = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    badgeText: "N",
    badgeBg: "#1a2b05",
    badgeColor: "#8ee000",
    allocation: 0.2,
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    badgeText: "M",
    badgeBg: "#0c2540",
    badgeColor: "#5aa9f2",
    allocation: 0.2,
  },
  {
    ticker: "TTWO",
    name: "Take-Two Interactive",
    badgeText: "T2",
    badgeBg: "#f5f5f7",
    badgeColor: "#111114",
    allocation: 0.2,
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    badgeText: "QQQ",
    badgeBg: "#241638",
    badgeColor: "#b394f7",
    allocation: 0.2,
  },
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Mkt",
    badgeText: "V",
    badgeBg: "#340b0f",
    badgeColor: "#ff8a94",
    allocation: 0.2,
  },
].map((a) => ({ ...a, series: REAL_SERIES[a.ticker], startVal: REAL_SERIES[a.ticker][0] }));

const TOTAL_INVESTED = ASSETS.reduce((s, a) => s + a.startVal, 0);

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const PORTFOLIO = (function build() {
  const days = TRADING_DATES.map(parseISODate);
  const totalSeries = days.map((_, i) => ASSETS.reduce((s, a) => s + a.series[i], 0));
  return { days, assets: ASSETS, totalSeries };
})();

function filterRange(days, series, range) {
  const n = days.length;
  if (range === "ALL" || range === "1Y") return { days, series };
  let count;
  if (range === "1M") count = 22;
  else if (range === "1W") count = 5;
  else count = n; // fallback
  const start = Math.max(0, n - count);
  return { days: days.slice(start), series: series.slice(start) };
}

function formatRupiah(n, withDecimals) {
  const rounded = withDecimals ? n : Math.round(n);
  return "Rp" + rounded.toLocaleString("id-ID", { maximumFractionDigits: withDecimals ? 2 : 0 });
}

function formatSignedRupiah(n) {
  const sign = n >= 0 ? "+" : "-";
  return sign + formatRupiah(Math.abs(n));
}

function formatPercent(n) {
  const sign = n >= 0 ? "+" : "-";
  return sign + Math.abs(n).toFixed(2).replace(".", ",") + "%";
}

function formatDateShort(d) {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function formatDateLong(d) {
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
