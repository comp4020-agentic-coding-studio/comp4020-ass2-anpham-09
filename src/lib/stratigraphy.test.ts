import { describe, expect, it } from "vitest";
import { monthRange, monthsBetween, parseDates, read } from "./stratigraphy";

// A small synthetic history with the shape the course teaches: a burst of
// construction, a lower plateau of maintenance, then a long thin decay.
function history(): string {
  const lines: string[] = [];
  const push = (month: string, n: number) => {
    for (let i = 0; i < n; i++) lines.push(`${month}-0${(i % 9) + 1} 10:00:00 +1100`);
  };
  push("2019-01", 9);
  push("2019-02", 8);
  push("2019-03", 4);
  push("2019-04", 3);
  push("2020-06", 1);
  push("2021-02", 1);
  return lines.join("\n");
}

describe("parseDates", () => {
  it("takes the month from any ISO date at the start of a line", () => {
    expect(parseDates("2019-03-14 10:23:01 +1100")).toEqual(["2019-03"]);
    expect(parseDates("2019-03-14T10:23:01+11:00")).toEqual(["2019-03"]);
    expect(parseDates("2019-03-14")).toEqual(["2019-03"]);
  });

  it("ignores lines that are not dates, so a pasted full log still works", () => {
    expect(parseDates("commit abc123\nAuthor: A\n\n2019-03-14 10:00:00 +1100")).toEqual(["2019-03"]);
  });

  it("returns nothing for empty input", () => {
    expect(parseDates("")).toEqual([]);
  });
});

describe("monthRange", () => {
  it("includes both ends and crosses a year boundary", () => {
    expect(monthRange("2019-11", "2020-02")).toEqual(["2019-11", "2019-12", "2020-01", "2020-02"]);
  });

  it("returns a single month when both ends match", () => {
    expect(monthRange("2019-11", "2019-11")).toEqual(["2019-11"]);
  });
});

describe("monthsBetween", () => {
  it("counts across years", () => {
    expect(monthsBetween("2019-01", "2021-02")).toBe(25);
  });
});

describe("read", () => {
  it("returns null rather than an empty reading when nothing parses", () => {
    expect(read("no dates here")).toBeNull();
  });

  it("finds the peak, and breaks ties toward the earliest month", () => {
    const r = read(history());
    expect(r?.peak).toBe("2019-01");
  });

  it("puts the boundary at the last month that cleared the active threshold", () => {
    const r = read(history());
    expect(r?.boundary).toBe("2019-04");
  });

  it("fills silent months so a gap has width", () => {
    const r = read(history());
    const keys = r?.bucketed.map((b) => b.key) ?? [];
    expect(keys).toContain("2019-08");
    expect(r?.bucketed.find((b) => b.key === "2019-08")?.count).toBe(0);
  });

  it("phases every month as construction, maintenance or decay", () => {
    const r = read(history());
    expect(r?.bucketed.find((b) => b.key === "2019-01")?.phase).toBe("construction");
    expect(r?.bucketed.find((b) => b.key === "2019-03")?.phase).toBe("maintenance");
    expect(r?.bucketed.find((b) => b.key === "2020-06")?.phase).toBe("decay");
  });

  it("applies the course's own 18-month criterion", () => {
    expect(read(history(), "2021-02")?.verdict).toBe("active");
    expect(read(history(), "2021-10")?.verdict).toBe("dormant");
    expect(read(history(), "2023-01")?.verdict).toBe("dead");
  });

  it("counts every commit, not every month", () => {
    expect(read(history())?.total).toBe(26);
  });
});

describe("currentMonth", () => {
  it("formats as YYYY-MM with a padded month", async () => {
    const { currentMonth } = await import("./stratigraphy");
    expect(currentMonth(new Date(2027, 2, 15))).toBe("2027-03");
    expect(currentMonth(new Date(2027, 11, 1))).toBe("2027-12");
  });
});

describe("read without an explicit today", () => {
  // The bug this covers: defaulting `today` to the last commit makes
  // monthsSilent 0 and the verdict "active" for every input, including a
  // project that has been dead for years. The default is documented as
  // relative-to-last-commit; callers that care about liveness must pass a
  // clock, and section-reader.ts now does.
  it("reports zero silence, which is why the browser must pass a clock", () => {
    const r = read("2018-04-01 10:00:00 +1100\n2020-11-01 10:00:00 +1100");
    expect(r?.monthsSilent).toBe(0);
    expect(r?.verdict).toBe("active");
  });

  it("reports the real verdict once a clock is supplied", () => {
    const r = read("2018-04-01 10:00:00 +1100\n2020-11-01 10:00:00 +1100", "2023-05");
    expect(r?.monthsSilent).toBe(30);
    expect(r?.verdict).toBe("dead");
  });
});
