/* Removes the solid white background from the Seriart logo and writes a
   proper RGBA PNG with un-premultiplied edge colors (so there's no white
   fringing when the logo sits over a dark background). Pure Node, no deps. */
"use strict";
const fs = require("fs");
const path = require("path");
const { decodePNG, encodePNG } = require("./png-lib.js");

const SRC = path.join(__dirname, "..", "assets", "photos", "source", "logo.png");
const OUT = path.join(__dirname, "..", "assets", "img", "logo.png");

const WHITE_LEVEL = 252; // avg lightness at/above this => fully transparent
const EDGE_LEVEL = 200;  // avg lightness at/below this => fully opaque

const buf = fs.readFileSync(SRC);
const { width, height, pixels } = decodePNG(buf);
const out = new Uint8Array(width * height * 4);

let transparentCount = 0, opaqueCount = 0, edgeCount = 0;

for (let i = 0; i < width * height; i++) {
  const o = i * 4;
  const r = pixels[o], g = pixels[o + 1], b = pixels[o + 2];
  const L = (r + g + b) / 3;
  let alphaFrac = (WHITE_LEVEL - L) / (WHITE_LEVEL - EDGE_LEVEL);
  alphaFrac = Math.min(1, Math.max(0, alphaFrac));

  const divisor = Math.max(alphaFrac, 0.12);
  let fr = (r - (1 - divisor) * 255) / divisor;
  let fg = (g - (1 - divisor) * 255) / divisor;
  let fb = (b - (1 - divisor) * 255) / divisor;
  fr = Math.min(255, Math.max(0, Math.round(fr)));
  fg = Math.min(255, Math.max(0, Math.round(fg)));
  fb = Math.min(255, Math.max(0, Math.round(fb)));

  out[o] = fr; out[o + 1] = fg; out[o + 2] = fb; out[o + 3] = Math.round(alphaFrac * 255);

  if (alphaFrac <= 0.02) transparentCount++;
  else if (alphaFrac >= 0.98) opaqueCount++;
  else edgeCount++;
}

fs.writeFileSync(OUT, encodePNG(width, height, out));
console.log("Written:", OUT);
console.log("transparent:", transparentCount, "opaque:", opaqueCount, "edge/anti-aliased:", edgeCount);
console.log("total px:", width * height);
