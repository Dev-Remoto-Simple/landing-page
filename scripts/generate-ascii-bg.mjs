/**
 * Generates a static ASCII background PNG for the "En Empresas" section.
 * Run with: node scripts/generate-ascii-bg.mjs
 * Outputs: public/ascii-bg.png
 */
import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1920;
const H = 1080;
const GRID = 14;
const BRAND = "#134D91";
const CHARS = [".", ".", "+", "*", "\u2022", "@", "*"];

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// White background
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, W, H);

// Draw ASCII characters
ctx.fillStyle = BRAND;
ctx.font = "13px monospace";
ctx.textBaseline = "middle";

for (let x = GRID / 2; x < W; x += GRID) {
  for (let y = GRID / 2; y < H; y += GRID) {
    const dx = (x - W / 2) / (W / 2);
    const dy = (y - H / 2) / (H / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const norm = Math.min(dist / 1.41, 1);

    let probability = 0;
    let charIndex = 0;

    if (norm < 0.3) {
      probability = 0;
    } else if (norm < 0.5) {
      probability = ((norm - 0.3) / 0.2) * 0.25;
      charIndex = 0;
    } else if (norm < 0.7) {
      probability = 0.25 + ((norm - 0.5) / 0.2) * 0.3;
      charIndex = Math.random() < 0.5 ? 0 : 2;
    } else if (norm < 0.85) {
      probability = 0.55 + ((norm - 0.7) / 0.15) * 0.25;
      charIndex = Math.random() < 0.5 ? 3 : 4;
    } else {
      probability = 1;
      charIndex = Math.random() < 0.5 ? 5 : 6;
    }

    if (Math.random() < probability) {
      ctx.globalAlpha = 0.2;
      ctx.fillText(CHARS[charIndex], x, y);
    }
  }
}

const outPath = resolve(__dirname, "../public/ascii-bg.png");
const buffer = canvas.toBuffer("image/png");
writeFileSync(outPath, buffer);
console.log(`Generated ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
