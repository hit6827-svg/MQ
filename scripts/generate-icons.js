import fs from 'fs';
import zlib from 'zlib';

// Helper signed-distance functions for razor-sharp anti-aliased rendering
function distToSegment(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const c1 = wx * vx + wy * vy;
  if (c1 <= 0) return Math.hypot(px - x1, py - y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return Math.hypot(px - x2, py - y2);
  const b = c1 / c2;
  return Math.hypot(px - (x1 + b * vx), py - (y1 + b * vy));
}

function sdBox(px, py, cx, cy, halfW, halfH) {
  const dx = Math.abs(px - cx) - halfW;
  const dy = Math.abs(py - cy) - halfH;
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  const inside = Math.min(Math.max(dx, dy), 0);
  return outside + inside;
}

function sdRoundedBox(px, py, cx, cy, halfW, halfH, r) {
  const qx = Math.abs(px - cx) - (halfW - r);
  const qy = Math.abs(py - cy) - (halfH - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - r;
}

function pointInPolygon(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1];
    const xj = pts[j][0], yj = pts[j][1];
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function sdPolygon(px, py, pts) {
  let minD = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const d = distToSegment(px, py, pts[j][0], pts[j][1], pts[i][0], pts[i][1]);
    if (d < minD) minD = d;
  }
  return pointInPolygon(px, py, pts) ? -minD : minD;
}

// Geometric "M" polygon in normalized 512x512 coordinates matching public/icon.svg
const M_POLY = [
  [84, 156],
  [120, 156],
  [164, 262],
  [208, 156],
  [244, 156],
  [244, 356],
  [214, 356],
  [214, 212],
  [174, 306],
  [154, 306],
  [114, 212],
  [114, 356],
  [84, 356],
];

// Tail of "Q" oriented rectangle corners around (348,298)->(404,366) with half-width 14
function sdQTail(px, py) {
  const x1 = 348, y1 = 298;
  const x2 = 404, y2 = 366;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const rx = px - mx;
  const ry = py - my;
  const localX = rx * ux + ry * uy;
  const localY = -rx * uy + ry * ux;
  return sdBox(localX, localY, 0, 0, len / 2 + 12, 14);
}

function createPNG(width, height, isMaskable = false) {
  const buffer = Buffer.alloc(width * height * 4);
  const aaWidth = Math.max(0.75, 512 / width);

  // For maskable icons, inset emblem inside safe central 72% zone
  const scale = isMaskable ? 0.72 : 1.0;
  const offset = (512 * (1 - scale)) / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Map pixel center to 512x512 virtual canvas
      const vxFull = ((x + 0.5) / width) * 512;
      const vyFull = ((y + 0.5) / height) * 512;

      // Background: #0a0a0a (neutral-950)
      let r = 10;
      let g = 10;
      let b = 10;

      // Crisp sharp square border (white at 25% opacity) matching TopBar MQ emblem
      if (!isMaskable) {
        const dInnerBorder = sdBox(vxFull, vyFull, 256, 256, 240, 240);
        if (dInnerBorder >= 0) {
          const borderAlpha = Math.min(1, Math.max(0, dInnerBorder / aaWidth)) * 0.25;
          r = Math.round(r * (1 - borderAlpha) + 255 * borderAlpha);
          g = Math.round(g * (1 - borderAlpha) + 255 * borderAlpha);
          b = Math.round(b * (1 - borderAlpha) + 255 * borderAlpha);
        }
      }

      // Map into glyph coordinate space
      const gx = (vxFull - offset) / scale;
      const gy = (vyFull - offset) / scale;

      // "M" signed distance
      const dM = sdPolygon(gx, gy, M_POLY);

      // "Q" ring signed distance (center 348, 256; outer half 77x100, stroke 30 -> ring half 62x85, halfStroke 15)
      const dQBox = sdRoundedBox(gx, gy, 348, 256, 62, 85, 44);
      const dQRing = Math.abs(dQBox) - 15;

      // "Q" tail signed distance
      const dTail = sdQTail(gx, gy);

      const dGlyph = Math.min(dM, dQRing, dTail);
      const glyphCoverage = Math.min(1, Math.max(0, 0.5 - dGlyph / (aaWidth / scale)));

      if (glyphCoverage > 0) {
        r = Math.round(r * (1 - glyphCoverage) + 255 * glyphCoverage);
        g = Math.round(g * (1 - glyphCoverage) + 255 * glyphCoverage);
        b = Math.round(b * (1 - glyphCoverage) + 255 * glyphCoverage);
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = 255;
    }
  }

  // Construct PNG chunks
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0;
    buffer.copy(rawData, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressedData = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc ^ byte) & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressedData),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function wrapPngAsIco(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(1, 4); // Count: 1 image

  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size;
  entry[1] = size >= 256 ? 0 : size;
  entry[2] = 0; // Palette count
  entry[3] = 0; // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12); // Offset = 6 + 16

  return Buffer.concat([header, entry, pngBuf]);
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
fs.writeFileSync('public/favicon.ico', wrapPngAsIco(createPNG(32, 32), 32));
console.log('Successfully generated all MQ PWA icons.');
