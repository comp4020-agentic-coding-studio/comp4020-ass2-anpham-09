// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { renderReading } from "./section-reader";
import { read } from "./stratigraphy";

function fixture(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <p data-empty hidden></p>
    <div data-output hidden>
      <div data-chart></div>
      <span data-field="total"></span>
      <span data-field="range"></span>
      <span data-field="peak"></span>
      <span data-field="boundary"></span>
      <span data-field="silent"></span>
      <span data-field="verdict"></span>
    </div>`;
  return root;
}

const LOG = [
  ...Array.from({ length: 8 }, (_, i) => `2019-01-0${(i % 9) + 1} 10:00:00 +1100`),
  ...Array.from({ length: 3 }, (_, i) => `2019-02-0${(i % 9) + 1} 10:00:00 +1100`),
  "2021-05-01 10:00:00 +1100",
].join("\n");

describe("renderReading", () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = fixture();
  });

  it("explains itself rather than failing silently on unparseable input", () => {
    renderReading(root, read("nothing here"));
    const empty = root.querySelector<HTMLElement>("[data-empty]");
    expect(empty?.hidden).toBe(false);
    expect(empty?.textContent).toContain("No dates found");
    expect(root.querySelector<HTMLElement>("[data-output]")?.hidden).toBe(true);
  });

  it("draws one bar per month including the silent ones", () => {
    renderReading(root, read(LOG, "2021-05"));
    // 2019-01 through 2021-05 inclusive is 29 months.
    expect(root.querySelectorAll("[data-chart] .bar")).toHaveLength(29);
  });

  it("marks the boundary month", () => {
    renderReading(root, read(LOG, "2021-05"));
    const marked = root.querySelectorAll("[data-chart] .bar[data-boundary]");
    expect(marked).toHaveLength(1);
  });

  it("reports the findings the session asks students to name", () => {
    renderReading(root, read(LOG, "2023-05"));
    const field = (n: string) => root.querySelector(`[data-field="${n}"]`)?.textContent;
    expect(field("total")).toBe("12");
    expect(field("peak")).toBe("2019-01");
    expect(field("verdict")).toBe("dead");
    expect(field("silent")).toBe("24 months");
  });

  it("phases each bar, so the chart is not one undifferentiated run", () => {
    renderReading(root, read(LOG, "2021-05"));
    const phases = new Set(
      [...root.querySelectorAll<HTMLElement>("[data-chart] .bar")].map((b) => b.dataset.phase),
    );
    expect(phases).toContain("construction");
    expect(phases).toContain("decay");
  });
});
