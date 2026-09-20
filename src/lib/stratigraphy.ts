// The week 2 method, as a function.
//
// Students run `git log --format=%ai` on their dig site and read the result as
// a stratigraphic section: construction, maintenance, decay, and the boundary
// between the last active period and the silence. This module does the
// arithmetic so the page can draw it, and so the reading can be tested rather
// than eyeballed.
//
// Nothing here touches the DOM. That is deliberate: the measurement is
// arithmetic and belongs in a pure function, where a test can check it without
// a layout engine. (JSDOM reports every rect as zero, so any geometry assertion
// made against it passes for the wrong reason.)

export interface MonthBucket {
  /** `YYYY-MM`, so buckets sort lexicographically. */
  key: string;
  count: number;
  phase: Phase;
}

export type Phase = "construction" | "maintenance" | "decay";

export interface Reading {
  bucketed: MonthBucket[];
  total: number;
  first: string;
  last: string;
  peak: string;
  /** Last month whose activity cleared the active threshold. The boundary the
   *  session asks students to name. */
  boundary: string;
  /** Whole months between the last commit and the most recent date in the
   *  input. */
  monthsSilent: number;
  /** The course's own criterion from week 1: no human commit in 18 months. */
  verdict: "dead" | "dormant" | "active";
}

/** Any ISO-8601-ish date at the start of a line, which is what
 *  `git log --format=%ai`, `--format=%aI` and `git log --date=short` all emit. */
const DATE_AT_LINE_START = /^\s*(\d{4})-(\d{2})-\d{2}/;

export function parseDates(input: string): string[] {
  const months: string[] = [];
  for (const line of input.split("\n")) {
    const m = DATE_AT_LINE_START.exec(line);
    if (m) months.push(`${m[1]}-${m[2]}`);
  }
  return months;
}

/** Every month between two keys inclusive, so a silence renders as a gap with
 *  width rather than two bars sitting next to each other. */
export function monthRange(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return (ty - fy) * 12 + (tm - fm);
}

/** Share of the peak month a month must reach to count as active. A threshold
 *  rather than a slope: decay is not a gentle decline, it is a project that
 *  stops clearing the bar it used to clear. */
const ACTIVE_SHARE = 0.25;

/** This month as `YYYY-MM`. Separated from read() so the reading stays a pure
 *  function of its inputs and the clock is injected at the call site. */
export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function read(input: string, today?: string): Reading | null {
  const months = parseDates(input);
  if (months.length === 0) return null;

  const counts = new Map<string, number>();
  for (const key of months) counts.set(key, (counts.get(key) ?? 0) + 1);

  const sorted = [...counts.keys()].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const peakCount = Math.max(...counts.values());
  // Ties go to the earliest month: a project's peak is when it first reached
  // that level, not the last time it managed it again.
  const peak = sorted.find((k) => counts.get(k) === peakCount) as string;
  const threshold = peakCount * ACTIVE_SHARE;

  const active = sorted.filter((k) => (counts.get(k) ?? 0) >= threshold);
  const boundary = active[active.length - 1] ?? last;

  const bucketed: MonthBucket[] = monthRange(first, last).map((key) => {
    const count = counts.get(key) ?? 0;
    let phase: Phase;
    if (key > boundary) phase = "decay";
    else if (key <= peak) phase = "construction";
    else phase = "maintenance";
    return { key, count, phase };
  });

  const now = today ?? last;
  const monthsSilent = Math.max(0, monthsBetween(last, now));
  const verdict = monthsSilent >= 18 ? "dead" : monthsSilent >= 6 ? "dormant" : "active";

  return {
    bucketed,
    total: months.length,
    first,
    last,
    peak,
    boundary,
    monthsSilent,
    verdict,
  };
}
