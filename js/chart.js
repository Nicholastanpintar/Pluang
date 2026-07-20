// chart.js — tiny dependency-free canvas area/line chart.

function drawAreaChart(canvas, values, options) {
  const opts = Object.assign(
    {
      color: "#00d16c",
      lineWidth: 2,
      padding: { top: 10, right: 8, bottom: 10, left: 8 },
      showAxis: false,
    },
    options
  );

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width || canvas.parentElement.clientWidth;
  const cssH = rect.height || canvas.height;

  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  if (!values || values.length < 2) return;

  const { top, right, bottom, left } = opts.padding;
  const w = cssW - left - right;
  const h = cssH - top - bottom;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const xAt = (i) => left + (i / (values.length - 1)) * w;
  const yAt = (v) => top + h - ((v - min) / range) * h;

  // smooth path via quadratic mid-point curve
  const points = values.map((v, i) => [xAt(i), yAt(v)]);

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    ctx.quadraticCurveTo(x0, y0, mx, my);
  }
  ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.lineWidth;
  ctx.stroke();

  // area fill
  const grad = ctx.createLinearGradient(0, top, 0, top + h);
  grad.addColorStop(0, opts.color + "55");
  grad.addColorStop(1, opts.color + "00");

  ctx.lineTo(points[points.length - 1][0], top + h);
  ctx.lineTo(points[0][0], top + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
}
