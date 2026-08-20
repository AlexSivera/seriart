/* Minimal pure-Node PNG decode/encode for 8-bit RGB <-> RGBA. No dependencies. */
"use strict";
const zlib = require("zlib");

const CRC_TABLE = (function () {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readChunks(buf) {
  if (!buf.slice(0, 8).equals(SIG)) throw new Error("Not a PNG file");
  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.slice(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 12 + len;
    if (type === "IEND") break;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/* Decode an 8-bit, non-interlaced PNG (color type 2=RGB or 6=RGBA) to a flat RGBA Uint8Array. */
function decodePNG(buf) {
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const bitDepth = ihdr.readUInt8(8);
  const colorType = ihdr.readUInt8(9);
  const interlace = ihdr.readUInt8(12);
  if (bitDepth !== 8) throw new Error("Only 8-bit PNGs supported, got bitDepth=" + bitDepth);
  if (interlace !== 0) throw new Error("Interlaced PNGs not supported");
  if (colorType !== 2 && colorType !== 6) throw new Error("Only RGB(2) or RGBA(6) PNGs supported, got colorType=" + colorType);
  const channels = colorType === 6 ? 4 : 3;

  const idat = Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data));
  const raw = zlib.inflateSync(idat);

  const stride = width * channels;
  const out = new Uint8Array(width * height * 4);
  let prevRow = new Uint8Array(stride);
  let off = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[off]; off += 1;
    const row = raw.slice(off, off + stride); off += stride;
    const cur = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prevRow[x];
      const c = x >= channels ? prevRow[x - channels] : 0;
      let v = row[x];
      if (filterType === 1) v = (v + a) & 0xff;
      else if (filterType === 2) v = (v + b) & 0xff;
      else if (filterType === 3) v = (v + ((a + b) >> 1)) & 0xff;
      else if (filterType === 4) v = (v + paeth(a, b, c)) & 0xff;
      cur[x] = v;
    }
    for (let px = 0; px < width; px++) {
      const si = px * channels;
      const di = (y * width + px) * 4;
      out[di] = cur[si];
      out[di + 1] = cur[si + 1];
      out[di + 2] = cur[si + 2];
      out[di + 3] = channels === 4 ? cur[si + 3] : 255;
    }
    prevRow = cur;
  }
  return { width, height, pixels: out };
}

/* Encode a flat RGBA Uint8Array back to an 8-bit RGBA PNG buffer. */
function encodePNG(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type: None
    for (let x = 0; x < stride; x++) {
      raw[y * (stride + 1) + 1 + x] = pixels[y * stride + x];
    }
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    SIG,
    chunk("IHDR", ihdr),
    chunk("IDAT", idatData),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

module.exports = { decodePNG, encodePNG };
