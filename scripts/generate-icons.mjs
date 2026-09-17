import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/logo.png";
const BG = { r: 13, g: 13, b: 13, alpha: 1 };

await mkdir("public/icons", { recursive: true });

const sizes = [
  ["app/favicon.ico", 32, 32],
  ["app/icon.png", 512, 512],
  ["app/apple-icon.png", 180, 180],
  ["public/icons/icon-192.png", 192, 192],
  ["public/icons/icon-512.png", 512, 512],
];

for (const [out, w, h] of sizes) {
  await sharp(SRC)
    .resize(w, h, { fit: "contain", background: BG })
    .toFormat("png")
    .toFile(out);
  console.log("wrote", out);
}

await sharp(SRC)
  .resize(1200, 630, { fit: "contain", background: BG })
  .toFormat("png")
  .toFile("public/og-image.png");

console.log("wrote public/og-image.png");
console.log("done");
