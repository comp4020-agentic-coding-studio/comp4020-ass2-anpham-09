import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const byType = (type: string) => api.nodes.filter((node) => node.type === type);

const sessions = byType("sessions");
const lectures = byType("lectures");
const assessments = byType("assessments");

// The published spec for this deliverable, line by line, where a line is
// mechanically checkable. The judged lines — whether the course is niche,
// whether the curriculum coheres, whether the prose has a voice — are not
// here, because no assertion holds them and pretending otherwise would be
// worse than leaving them to the crit.
describe("SLOP2374 course integrity", () => {
  // spec: "under a SLOPxxxx code that keeps the three digits your repo arrived with"
  it("keeps the three digits the repo was provisioned with", () => {
    expect(api.course.code).toMatch(/^SLOP[123468]374$/);
  });

  // spec: "running across twelve dated teaching weeks"
  it("runs one dated dig in each of twelve teaching weeks", () => {
    const weeks = sessions.map((s) => Number(s.meta?.week)).sort((a, b) => a - b);
    expect(weeks).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    for (const session of sessions) {
      expect(String(session.meta?.date), `${session.id} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("pairs every dig with a lecture in the same week", () => {
    const lectureWeeks = new Set(lectures.map((l) => Number(l.meta?.week)));
    for (const session of sessions) {
      const week = Number(session.meta?.week);
      expect(lectureWeeks.has(week), `week ${week} has a dig but no lecture`).toBe(true);
    }
  });

  // spec: "at least one lecture carries a real deck, linked from its page"
  // Asserting the deck *built* matters more than asserting the frontmatter
  // key exists: a slides: path pointing at a deck that never compiled is
  // exactly the failure this is meant to catch.
  it("has at least one lecture linking a deck that actually built", () => {
    const withSlides = lectures.filter((l) => typeof l.meta?.slides === "string");
    expect(withSlides.length, "no lecture carries a deck").toBeGreaterThan(0);

    for (const lecture of withSlides) {
      const slides = lecture.meta?.slides as string;
      const built = resolve("dist", slides.replace(/^\//, ""), "index.html");
      expect(existsSync(built), `${lecture.id} links ${slides}, which did not build`).toBe(true);
    }
  });

  // spec: "assessment that adds up to 100%"
  it("adds assessment weight up to 100%", () => {
    const total = assessments.reduce((sum, a) => sum + Number(a.meta?.weight ?? 0), 0);
    expect(total, `weights sum to ${total}`).toBe(100);
  });

  it("gives students four weeks of method before the first assessment", () => {
    for (const a of assessments) {
      expect(Number(a.meta?.week), `${a.id} is due too early`).toBeGreaterThanOrEqual(4);
    }
  });

  // This is the sensor for CLAUDE.md rule 1 — "every session is a method, not
  // a topic". It is the only one of the eight harness rules a test can hold,
  // and it is here because a session that stops teaching a method is the way
  // this course quietly turns into twelve unrelated lectures.
  it("names a forensic method in every dig's description", () => {
    const methods = [
      "survey", "dating", "stratigraphy", "reading", "inscriptions",
      "dependency", "tool", "inventory", "architecture", "spatial",
      "epigraphy", "documentation", "interview", "oral history",
      "forensic", "diagnosis", "conservation", "preservation",
      "ethics", "restoration", "minimum intervention", "exhibit",
      "presentation",
    ];
    for (const session of sessions) {
      const desc = String(session.description ?? "").toLowerCase();
      const named = methods.filter((m) => desc.includes(m));
      expect(named.length, `${session.id} names no forensic method in its description`).toBeGreaterThan(0);
    }
  });

  it("gives every dig a distinct title", () => {
    const titles = sessions.map((s) => s.title);
    expect(new Set(titles).size, "two digs share a title").toBe(titles.length);
  });
});
