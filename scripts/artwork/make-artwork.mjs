// Generates the site's two pieces of key artwork from code.
//
// The motif is a stratigraphic section: horizontal bands of sediment, dense
// and unbroken at the base, thinning upward into dashes and then into nothing,
// with a single fine trench cut vertically through every layer. It is the
// course's argument in one image — a history you read by its layers, and an
// excavation that goes straight down through all of them.
//
// Two inks on cream, in the Slop house style. Risograph prints misregister, so
// the gold plate is offset a couple of pixels from the black one and the
// overlap is allowed to darken; a perfectly aligned two-ink print looks
// digital, which is the one thing this must not look like.
//
// Run: node scripts/artwork/make-artwork.mjs
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const CREAM = "#f4efe4";
const GOLD = "#b97d1c";
const INK = "#3a2413";
const INK_DEEP = "#241608";

/** Deterministic PRNG, so re-running this produces the same artwork rather
 *  than a new random one every build. */
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** One stratum: a horizontal band, optionally broken into dashes. `solidity`
 *  runs 1 (unbroken) to 0 (absent), and decay is what thins the upper layers. */
function stratum({ y, height, solidity, width, fill, opacity, rand }) {
  if (solidity >= 0.98) {
    return `<rect x="0" y="${y}" width="${width}" height="${height}" fill="${fill}" opacity="${opacity}"/>`;
  }
  const pieces = [];
  let x = -rand() * 40;
  while (x < width) {
    const run = 30 + rand() * 260 * solidity;
    const gap = 10 + rand() * 120 * (1 - solidity);
    if (rand() < solidity) {
      pieces.push(
        `<rect x="${x.toFixed(1)}" y="${y}" width="${run.toFixed(1)}" height="${height}" fill="${fill}" opacity="${opacity}"/>`,
      );
    }
    x += run + gap;
  }
  return pieces.join("");
}

/** The section itself, as one ink plate. */
function plate({ width, height, fill, seed, baseOpacity, deepOnly = false }) {
  const rand = rng(seed);
  const out = [];
  // Layers accumulate from the bottom up: the deepest are the oldest and the
  // most intact, which is true of sediment and of commit history alike.
  let y = height;
  let i = 0;
  while (y > height * 0.06) {
    const h = 5 + rand() * 26 * (0.35 + (y / height) * 0.8);
    y -= h + 4 + rand() * 14;
    // 1 at the base, 0 at the surface. Sediment (and commit history) is
    // intact at the bottom and fragmentary at the top, not the other way
    // round — the first version of this had the term inverted and printed a
    // skyline instead of a section.
    const depth = y / height;
    const solidity = Math.min(1, Math.max(0.04, Math.pow(depth, 1.7) * 1.25 - 0.06));
    // The deep plate only prints in the bottom third — that is what makes
    // the base read as compacted rather than merely busy.
    if (!deepOnly || depth > 0.72) {
      out.push(
        stratum({
          y: y.toFixed(1),
          height: h.toFixed(1),
          solidity,
          width,
          fill,
          opacity: (baseOpacity * (0.72 + solidity * 0.28)).toFixed(3),
          rand,
        }),
      );
    }
    i += 1;
    if (i > 60) break;
  }
  return out.join("");
}

/** The trench: a narrow vertical cut through every layer, the only straight
 *  line in the image. */
function trench({ width, height, x }) {
  const w = Math.max(7, width * 0.011);
  return [
    // the cut itself: cream, because the trench is empty
    `<rect x="${x - w / 2}" y="0" width="${w}" height="${height}" fill="${CREAM}"/>`,
    // one shadowed wall, so it reads as a cut into the section rather than a
    // line drawn on top of it
    `<rect x="${x - w / 2}" y="0" width="${w * 0.22}" height="${height}" fill="${INK}" opacity="0.38"/>`,
    `<rect x="${x + w / 2 - w * 0.08}" y="0" width="${w * 0.08}" height="${height}" fill="${GOLD}" opacity="0.55"/>`,
  ].join("");
}

function svg({ width, height, seed }) {
  const trenchX = Math.round(width * 0.63);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
    <filter id="soften"><feGaussianBlur stdDeviation="0.35"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="${CREAM}"/>
  <g filter="url(#soften)">
    <!-- gold plate, offset: the misregistration is the point -->
    <g transform="translate(-3, 2)">${plate({ width, height, fill: GOLD, seed, baseOpacity: 0.95 })}</g>
    <!-- ink plate, multiplied over it so the overlap reads as a third tone -->
    <g style="mix-blend-mode: multiply">${plate({ width, height, fill: INK, seed: seed + 977, baseOpacity: 0.82 })}</g>
  </g>
  ${trench({ width, height, x: trenchX })}
  <rect width="${width}" height="${height}" filter="url(#grain)" fill="${INK}"/>
</svg>`;
}

const outDir = resolve("src/assets/images");

// The link-preview card is a fixed 1200x630 and gets re-encoded to JPEG by the
// theme for scrapers, so it is authored at exactly that size.
const cardSvg = svg({ width: 1200, height: 630, seed: 2374 });
await sharp(Buffer.from(cardSvg)).png().toFile(resolve(outDir, "card.png"));

// The hero is taller in proportion, and seeded differently so the two images
// are the same motif rather than the same picture.
const heroSvg = svg({ width: 1600, height: 900, seed: 1374 });
await sharp(Buffer.from(heroSvg)).avif({ quality: 62 }).toFile(resolve(outDir, "hero-home.avif"));

writeFileSync(resolve(outDir, "card.svg"), cardSvg);
console.log("wrote card.png (1200x630), hero-home.avif (1600x900), card.svg");
