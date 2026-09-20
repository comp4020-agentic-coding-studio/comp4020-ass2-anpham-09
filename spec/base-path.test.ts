import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The build already catches a root-absolute internal link — but it reports it
// under an "Astro couldn't find document or window" hint, with the real error
// a dozen lines above. That cost me two debugging detours, so this asserts the
// same contract against the source with a message that says what to do.
//
// The rule: in an .astro file, write href={route("…")}, never href="/…".
// Markdown links and the theme's own components are rewritten for the base
// path; a hand-written attribute is not.
function astroFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...astroFiles(full));
    else if (entry.name.endsWith(".astro")) out.push(full);
  }
  return out;
}

// Only plain HTML elements — a lowercase tag name. A capitalised tag is a
// component (the theme's <Card>, <Hero>), and those resolve the base path
// themselves, which is why the build accepts them. The first version of this
// test matched any attribute and fired on four correct <Card> links; a test
// that flags correct code is a false positive, and narrowing it to the real
// contract was the fix rather than editing the Cards to satisfy it.
//
// Interpolated values (href={…}) are fine — that is the route() path.
const ROOT_ABSOLUTE = /<([a-z][a-z0-9-]*)\b[^>]*?\b(?:href|src)\s*=\s*"\/(?!\/)/g;

describe("base path", () => {
  it("routes every internal link in .astro source through route()", () => {
    const srcDir = resolve("src");
    const offenders: string[] = [];

    for (const file of astroFiles(srcDir)) {
      const text = readFileSync(file, "utf8");
      // Tags can wrap across lines, so match the whole file rather than
      // line by line.
      for (const match of text.matchAll(ROOT_ABSOLUTE)) {
        offenders.push(`${relative(srcDir, file)}: <${match[1]} … ${match[0].slice(-12)}`);
      }
    }

    expect(
      offenders,
      `root-absolute link(s) in .astro source. These work on localhost and 404 on ` +
        `the deployed site. Use href={route("path")} from src/lib/url.ts:\n` +
        offenders.join("\n"),
    ).toEqual([]);
  });
});
