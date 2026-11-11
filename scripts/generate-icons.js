import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.38 : width * 0.44;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Background: Obsidian pure black #000000
      buffer[idx] = 0;     // R
      buffer[idx + 1] = 0; // G
      buffer[idx + 2] = 0; // B
      buffer[idx + 3] = 255; // A

      // Check distance from center for boundary ring / shape
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Draw mathematical delta / triangle lines
      // Point A: (cx, cy - radius * 0.7)
      // Point B: (cx - radius * 0.7, cy + radius * 0.6)
      // Point C: (cx + radius * 0.7, cy + radius * 0.6)
      const ax = cx, ay = cy - radius * 0.7;
      const bx = cx - radius * 0.7, by = cy + radius * 0.6;
      const cxPoint = cx + radius * 0.7, cyPoint = cy + radius * 0.6;

      const distToLine = (px, py, x1, y1, x2, y2) => {
        const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projx = x1 + t * (x2 - x1);
        const projy = y1 + t * (y2 - y1);
        return Math.sqrt((px - projx) * (px - projx) + (py - projy) * (py - projy));
      };

      const lineThickness = Math.max(2, width * 0.025);
      const d1 = distToLine(x, y, ax, ay, bx, by);
      const d2 = distToLine(x, y, bx, by, cxPoint, cyPoint);
      const d3 = distToLine(x, y, cxPoint, cyPoint, ax, ay);
      const d4 = distToLine(x, y, ax, ay, cx, cy + radius * 0.6); // Altitude line
      const d5 = distToLine(x, y, bx + (cxPoint - bx) * 0.25, cy, cxPoint - (cxPoint - bx) * 0.25, cy); // Horizontal transversal

      const isLine = d1 <= lineThickness || d2 <= lineThickness || d3 <= lineThickness || d4 <= lineThickness * 0.7 || d5 <= lineThickness * 0.7;

      // Vertex dots
      const dDotA = Math.sqrt((x - ax) * (x - ax) + (y - ay) * (y - ay));
      const dDotB = Math.sqrt((x - bx) * (x - bx) + (y - by) * (y - by));
      const dDotC = Math.sqrt((x - cxPoint) * (x - cxPoint) + (y - cyPoint) * (y - cyPoint));
      const dDotCenter = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
      const dotRadius = Math.max(4, width * 0.04);

      if (dDotA <= dotRadius || dDotB <= dotRadius || dDotC <= dotRadius) {
        // Crisp white vertex dot
        buffer[idx] = 255;
        buffer[idx + 1] = 255;
        buffer[idx + 2] = 255;
      } else if (dDotCenter <= dotRadius * 0.8) {
        // Emerald center focus
        buffer[idx] = 16;
        buffer[idx + 1] = 185;
        buffer[idx + 2] = 129;
      } else if (isLine) {
        buffer[idx] = 255;
        buffer[idx + 1] = 255;
        buffer[idx + 2] = 255;
      }
    }
  }

  // Construct PNG file format manually
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // Filter type 0: None
    buffer.copy(rawData, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        byte = byte >>> 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcValue = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcValue, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type 6: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180));
fs.writeFileSync('public/favicon.ico', createPNG(32, 32));
console.log('Successfully generated all PWA icons.');
