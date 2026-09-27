/* Image pipeline — no npm dependencies, uses Chrome in headless mode as the
   image encoder (canvas → WebP). Run with: node tools/optimize-images.js

   - Every .jpg/.jpeg/.png/.webp in assets/uploads/ (the Pages CMS media
     folder) gets WebP versions at 640 / 1280 / 1920 px wide (never upscaled).
   - Output goes to .cache/img/ with a manifest keyed by source path and a hash
     of the source, so only new or changed photos are processed. The build
     copies what it needs into _site/assets/opt/.
   - The logo is trimmed and exported as assets/img/logo-trim.png plus a white
     version (logo-white.png) whenever assets/img/logo.png changes. */
"use strict";
const { spawn } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "assets", "uploads");
const CACHE = path.join(ROOT, ".cache", "img");
const MANIFEST = path.join(CACHE, "manifest.json");
const IMG = path.join(ROOT, "assets", "img");
const WIDTHS = [640, 1280, 1920];
const OK_EXT = /\.(jpe?g|png|webp)$/i;
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toPosix = (p) => p.split(path.sep).join("/");
const hashFile = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex");
/* "assets/uploads/Obras/Furgo 1.jpg" → "uploads-obras-furgo-1" */
const outBase = (rel) => rel.replace(/^assets\//, "").replace(/\.[^.]+$/, "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((out, d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) return out.concat(walk(full));
    if (d.name.startsWith(".")) return out;
    out.push(full);
    return out;
  }, []);
}

async function openChrome() {
  const exe = CHROME_PATHS.find((p) => fs.existsSync(p));
  if (!exe) throw new Error("Chrome not found — set CHROME_PATH");
  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "seriart-img-"));
  const args = ["--headless=new", "--remote-debugging-port=" + port, "--user-data-dir=" + profile,
    "--allow-file-access-from-files", "--no-first-run", "--disable-gpu"];
  if (process.env.CI) args.push("--no-sandbox"); // GitHub runners block the Chrome sandbox
  const proc = spawn(exe, args.concat("about:blank"), { stdio: "ignore" });
  let wsUrl;
  for (let i = 0; i < 100 && !wsUrl; i++) {
    try {
      const list = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
      const pg = list.find((t) => t.type === "page");
      if (pg) wsUrl = pg.webSocketDebuggerUrl;
    } catch (e) { /* not up yet */ }
    if (!wsUrl) await sleep(200);
  }
  if (!wsUrl) { proc.kill(); throw new Error("Chrome did not start"); }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0; const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  const send = (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  async function evaluate(expression) {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400));
    return r.result.result.value;
  }
  await send("Page.navigate", { url: "file:///" + toPosix(ROOT).replace(/^\//, "") + "/" });
  await sleep(500);
  await evaluate(HELPERS);
  return { evaluate, close() { ws.close(); proc.kill(); } };
}

const HELPERS = `
window.__load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('cannot decode ' + src)); i.src = src; });
window.__webp = async (src, widths) => {
  const img = await __load(src);
  const out = { w: img.naturalWidth, h: img.naturalHeight, files: {} };
  const list = widths.filter((w) => w < img.naturalWidth);
  list.push(Math.min(img.naturalWidth, widths[widths.length - 1]));
  for (const w of [...new Set(list)]) {
    const h = Math.round(img.naturalHeight * w / img.naturalWidth);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
    out.files[w] = c.toDataURL('image/webp', 0.78).split(',')[1];
  }
  return out;
};
window.__logo = async (src, targetH) => {
  const img = await __load(src);
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    const ink = d[i + 3] > 24 && !(d[i] > 238 && d[i + 1] > 238 && d[i + 2] > 238);
    if (ink) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const pad = 4, cw = x1 - x0 + 1 + pad * 2, ch = y1 - y0 + 1 + pad * 2;
  const W = Math.round(cw * targetH / ch), H = targetH;
  function render(white) {
    const o = document.createElement('canvas'); o.width = W; o.height = H;
    const octx = o.getContext('2d'); octx.imageSmoothingQuality = 'high';
    octx.drawImage(c, x0 - pad, y0 - pad, cw, ch, 0, 0, W, H);
    const px = octx.getImageData(0, 0, W, H); const p = px.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      if (r > 238 && g > 238 && b > 238) { p[i + 3] = 0; continue; }
      if (white) {
        const gray = Math.max(r, g, b) - Math.min(r, g, b) < 40;
        p[i] = p[i + 1] = p[i + 2] = 255; if (gray) p[i + 3] = Math.round(p[i + 3] * 0.7);
      }
    }
    octx.putImageData(px, 0, 0);
    return o.toDataURL('image/png').split(',')[1];
  }
  return { w: W, h: H, color: render(false), white: render(true) };
};
true;`;

(async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch (e) { /* first run */ }

  const sources = walk(SRC).map((f) => toPosix(path.relative(ROOT, f)));
  const skipped = sources.filter((f) => !OK_EXT.test(f));
  skipped.forEach((f) => console.warn("  ! formato no soportado (usa JPG, PNG o WebP): " + f));
  const images = sources.filter((f) => OK_EXT.test(f));

  /* Drop entries whose source photo was deleted */
  Object.keys(manifest).forEach((rel) => {
    if (images.indexOf(rel) !== -1) return;
    (manifest[rel].widths || []).forEach((w) => fs.rmSync(path.join(CACHE, manifest[rel].base + "-" + w + ".webp"), { force: true }));
    delete manifest[rel];
  });

  const todo = images.filter((rel) => {
    const m = manifest[rel];
    if (!m) return true;
    if (m.hash !== hashFile(path.join(ROOT, rel))) return true;
    return !m.widths.every((w) => fs.existsSync(path.join(CACHE, m.base + "-" + w + ".webp")));
  });

  const logoSrc = path.join(IMG, "logo.png");
  const logoOut = path.join(IMG, "logo-trim.png");
  const logoTodo = fs.existsSync(logoSrc) && (!fs.existsSync(logoOut) || fs.statSync(logoSrc).mtimeMs > fs.statSync(logoOut).mtimeMs);

  console.log("Imágenes: " + images.length + " en total, " + todo.length + " nuevas o cambiadas");
  if (todo.length || logoTodo) {
    const chrome = await openChrome();
    try {
      for (const rel of todo) {
        try {
          const r = await chrome.evaluate(`__webp(${JSON.stringify(encodeURI(rel))}, ${JSON.stringify(WIDTHS)})`);
          const base = outBase(rel);
          const widths = Object.keys(r.files).map(Number).sort((a, b) => a - b);
          widths.forEach((w) => fs.writeFileSync(path.join(CACHE, base + "-" + w + ".webp"), Buffer.from(r.files[w], "base64")));
          manifest[rel] = { hash: hashFile(path.join(ROOT, rel)), base, w: r.w, h: r.h, widths };
          console.log("  " + rel + "  " + r.w + "x" + r.h + " → " + widths.join(", "));
        } catch (e) {
          console.warn("  ! no se pudo procesar " + rel + ": " + e.message.slice(0, 120));
        }
      }
      if (logoTodo) {
        const logo = await chrome.evaluate(`__logo("assets/img/logo.png", 160)`);
        fs.writeFileSync(logoOut, Buffer.from(logo.color, "base64"));
        fs.writeFileSync(path.join(IMG, "logo-white.png"), Buffer.from(logo.white, "base64"));
        console.log("  logo → " + logo.w + "x" + logo.h);
      }
    } finally {
      chrome.close();
    }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log("Listo.");
})().catch((e) => { console.error(e); process.exit(1); });
