import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Harness rule 7: "Case studies are real. Every lecture names a real project, a
// real event, or a real person. No hypothetical examples. If a claim needs a
// source, find one or cut the claim."
//
// What no runner can hold: whether a cited work exists. Confirming that
// Tornhill (2018) is a real book needs a library, not a test, and that stays a
// judgement for the crit. Naming this file "case studies are real" would be
// the exact failure CLAUDE.md warns about --- a test whose name makes a claim
// its body does not check.
//
// What it holds instead is the shape fabrication actually took when it turned
// up in this repo: a draft of all twelve decks arrived with nine invented
// colleagues signing off commits from example.com and kernel.org addresses.
// Nobody reading a slide can tell an invented maintainer from a real one, so
// the sensor draws the line where a machine can see it --- an address is
// either in-world or it is a fabrication --- and leaves the bibliography's
// truth to a human.

const TEACHING_DIRS = [
  "src/content/lectures",
  "src/content/sessions",
  "src/content/assessments",
  "src/decks",
];

// src/content/people is deliberately out of scope. SlopU's teaching staff are
// invented on purpose (harness rule 5); they are the course's cast, not
// evidence the course cites.

interface Doc {
  path: string;
  text: string;
}

const docs: Doc[] = TEACHING_DIRS.flatMap((dir) => {
  const root = resolve(dir);
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => ({
      path: `${dir}/${entry.name}`,
      text: readFileSync(join(root, entry.name), "utf8"),
    }));
});

const weeks = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

const read = (path: string): string => readFileSync(resolve(path), "utf8");

/**
 * Lines under `heading`, stopping at `stopAt`. Scanned rather than matched with
 * a lookahead: JavaScript has no `\Z` anchor, so `(?=^## |\Z)` silently reads
 * as "or a literal Z" and ends the section at the Z in "Zacchiroli". That bug
 * cost this file one green run it had not earned.
 */
const sectionUnder = (text: string, heading: string, stopAt: RegExp): string => {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => stopAt.test(line));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
};

/** A lecture section runs to the next heading; a deck slide ends at its `---`. */
const lectureSection = (text: string, heading: string): string =>
  sectionUnder(text, heading, /^## /);

const deckSlide = (text: string, heading: string): string =>
  sectionUnder(text, heading, /^---\s*$/);

/**
 * One entry per citation. A citation wraps across lines in a lecture bullet and
 * sits in its own paragraph on a slide, so entries are grouped by list marker
 * and blank line rather than split per line — `Di Cosmo, R. and\nZacchiroli, S.
 * (2017)` is one source, not two.
 */
const citations = (section: string): string[] => {
  const entries: string[] = [];
  let current: string[] = [];
  const flush = (): void => {
    if (current.length > 0) {
      entries.push(current.join(" ").replace(/\s+/g, " ").trim());
      current = [];
    }
  };
  for (const raw of section.split("\n")) {
    const line = raw.trim();
    if (line.length === 0 || line.startsWith("{/*") || line.startsWith("---")) {
      flush();
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flush();
      current.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    current.push(line);
  }
  flush();
  return entries;
};

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const IN_WORLD = /@slop\.university$/;

/**
 * An author and a year — the minimum a marker needs to look a source up. The
 * year need only open the parenthesis: a reprint cites both dates, as in
 * `Brandi, C. (2005 [1963])`, and that is a more precise citation, not a
 * malformed one.
 */
const CITATION_SHAPE = /[A-Z][\p{L}'’-]+[\s\S]*\(\d{4}/u;

const HYPOTHETICAL: Array<[RegExp, string]> = [
  [/\bimagine (a|an|that|you)\b/i, "imagine …"],
  [/\bsuppose (a|an|that)\b/i, "suppose …"],
  [/\blet['’]s say\b/i, "let's say"],
  [/\bhypothetical/i, "hypothetical"],
  [/\ba fictional\b/i, "a fictional …"],
  [/\bfor the sake of (argument|example)\b/i, "for the sake of argument"],
];

describe("harness rule 7: sources and identities", () => {
  it("scans every teaching document", () => {
    // Guards the glob itself: a rename that empties this list would make every
    // other assertion below pass over nothing.
    expect(docs.length, "no teaching documents found — check TEACHING_DIRS").toBeGreaterThanOrEqual(
      24,
    );
  });

  it("names no person at an address outside the university", () => {
    for (const doc of docs) {
      for (const email of doc.text.match(EMAIL) ?? []) {
        expect(
          IN_WORLD.test(email),
          `${doc.path} cites <${email}>. A placeholder or borrowed address is an invented person presented as evidence; use an @slop.university address or cut the name.`,
        ).toBe(true);
      }
    }
  });

  it("frames no example as hypothetical", () => {
    for (const doc of docs) {
      for (const [pattern, label] of HYPOTHETICAL) {
        expect(
          pattern.test(doc.text),
          `${doc.path} reads "${label}". Rule 7 takes examples from real projects; find a case that actually happened or cut the claim.`,
        ).toBe(false);
      }
    }
  });

  it("gives every lecture a source carrying an author and a year", () => {
    for (const week of weeks) {
      const path = `src/content/lectures/week-${week}.md`;
      const entries = citations(lectureSection(read(path), "## Required reading"));
      expect(entries.length, `${path} lists no required reading`).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(
          CITATION_SHAPE.test(entry),
          `${path} cites "${entry}" without an author and a year, so no marker can look it up.`,
        ).toBe(true);
      }
    }
  });

  it("keeps each deck's reading slide identical to its lecture's", () => {
    // 51301c6 generated each deck's reading slide from its lecture "so the two
    // cannot drift". Nothing enforced that, and a deck is exactly where an
    // uncited reading would appear — on a slide nobody cross-checks.
    for (const week of weeks) {
      const lecturePath = `src/content/lectures/week-${week}.md`;
      const deckPath = `src/decks/week-${week}.deck.mdx`;
      const fromLecture = citations(lectureSection(read(lecturePath), "## Required reading"));
      const fromDeck = citations(deckSlide(read(deckPath), "## Required reading"));
      expect(fromDeck.length, `${deckPath} has no required-reading slide`).toBeGreaterThan(0);
      expect(
        [...fromDeck].sort(),
        `${deckPath} and ${lecturePath} list different required reading; the slide must not introduce a source the lecture never cited.`,
      ).toEqual([...fromLecture].sort());
    }
  });
});
