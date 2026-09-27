/* Dev-time image pipeline — no npm dependencies, uses the local Chrome in
   headless mode as the image encoder (canvas → WebP).
   Run with: node tools/optimize-images.js

   - Every .jpg/.jpeg/.png in assets/img/ (except logo/favicon) gets WebP
     versions at 640 / 1280 / 1920 px wide (never upscaled) in assets/img/opt/.
   - assets/img/opt/manifest.json stores the natural size and generated widths;
     the build script reads it to write srcset / width / height.
   - The logo is trimmed (transparent padding removed) and exported as
     logo-trim.png plus a white version (logo-white.png) for dark backgrounds.

   Drop real photos into assets/img/, run this, then run tools/build.js. */
"use strict";
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.join(__dirname, "..");
const IMG = path.join(ROOT, "assets", "img");
const OUT = path.join(IMG, "opt");
const WIDTHS = [640, 1280, 1920];
const SKIP = new Set(["logo.png", "favicon.svg", "logo-trim.png", "logo-white.png"]);
// Images listed in .gitignore (private drafts) are never published.
try {
  fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8").split(/\r?\n/)
    .filter((l) => l.startsWith("assets/img/")).forEach((l) => SKIP.add(l.slice("assets/img/".length)));
} catch (e) { /* no .gitignore */ }
const CHROME_PATHS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome"
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openChrome() {
  const exe = CHROME_PATHS.find((p) => fs.existsSync(p));
  if (!exe) throw new Error("Chrome not found — set CHROME_PATH");
  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "seriart-img-"));
  const proc = spawn(exe, ["--headless=new", "--remote-debugging-port=" + port, "--user-data-dir=" + profile,
    "--allow-file-access-from-files", "--no-first-run", "about:blank"], { stdio: "ignore" });
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const list = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
      const pg = list.find((t) => t.type === "page");
      if (pg) wsUrl = pg.webSocketDebuggerUrl;
    } catch (e) { /* not up yet */ }
    if (!wsUrl) await sleep(200);
  }
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
  await send("Page.navigate", { url: "file:///" + IMG.replace(/\\/g, "/") + "/" });
  await sleep(500);
  return { evaluate, close() { ws.close(); proc.kill(); } };
}

const HELPERS = `
window.__load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
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
  const scale = targetH / ch, W = Math.round(cw * scale), H = targetH;
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
  fs.mkdirSync(OUT, { recursive: true });
  const chrome = await openChrome();
  try {
    await chrome.evaluate(HELPERS);
    const manifest = {};
    const files = fs.readdirSync(IMG).filter((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f));
    for (const f of files) {
      const base = f.replace(/\.(jpe?g|png)$/i, "");
      const r = await chrome.evaluate(`__webp(${JSON.stringify(f)}, ${JSON.stringify(WIDTHS)})`);
      const widths = Object.keys(r.files).map(Number).sort((a, b) => a - b);
      widths.forEach((w) => fs.writeFileSync(path.join(OUT, base + "-" + w + ".webp"), Buffer.from(r.files[w], "base64")));
      manifest[f] = { w: r.w, h: r.h, widths };
      const kb = widths.map((w) => w + ":" + Math.round(fs.statSync(path.join(OUT, base + "-" + w + ".webp")).size / 1024) + "KB").join(" ");
      console.log("  " + f.padEnd(30) + r.w + "x" + r.h + "  → " + kb);
    }
    const logo = await chrome.evaluate(`__logo("logo.png", 160)`);
    fs.writeFileSync(path.join(IMG, "logo-trim.png"), Buffer.from(logo.color, "base64"));
    fs.writeFileSync(path.join(IMG, "logo-white.png"), Buffer.from(logo.white, "base64"));
    manifest["logo-trim.png"] = { w: logo.w, h: logo.h, widths: [] };
    console.log("  logo → " + logo.w + "x" + logo.h + " (logo-trim.png, logo-white.png)");
    fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log("\nDone: " + files.length + " images");
  } finally {
    chrome.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
