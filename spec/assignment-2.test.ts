import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const byType = (type: string) => api.nodes.filter((node) => node.type === type);

describe("assignment 2 spec", () => {
  it("keeps the three digits the repo was provisioned with", () => {
    expect(api.course.code.slice(-3)).toBe("374");
  });

  it("runs across twelve dated teaching weeks", () => {
    const sessions = byType("sessions");
    const weeks = sessions.map((session) => session.meta?.week).sort((a, b) => Number(a) - Number(b));
    expect(weeks, "one session per week, weeks 1-12").toEqual(
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    for (const session of sessions) {
      expect(session.meta?.date, `${session.id} has no date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("has at least one lecture carrying a real deck, linked from its page", () => {
    const lectures = byType("lectures");
    const withSlides = lectures.filter((lecture) => typeof lecture.meta?.slides === "string");
    expect(withSlides.length, "at least one lecture needs a slides: link").toBeGreaterThan(0);

    for (const lecture of withSlides) {
      const slidesPath = lecture.meta?.slides as string;
      const builtDeck = resolve("dist", slidesPath.replace(/^\//, ""), "index.html");
      expect(existsSync(builtDeck), `${lecture.id} links a deck that didn't build: ${slidesPath}`).toBe(
        true,
      );
    }
  });

  it("adds assessment weight up to 100%", () => {
    const assessments = byType("assessments");
    const total = assessments.reduce((sum, node) => sum + Number(node.meta?.weight ?? 0), 0);
    expect(total, `assessment weights sum to ${total}, not 100`).toBe(100);
  });
});
