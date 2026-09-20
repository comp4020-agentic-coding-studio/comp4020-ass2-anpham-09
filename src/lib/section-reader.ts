// DOM adapter for the stratigraphy reader.
//
// Every function here takes its root as an argument rather than reaching for
// `document`, so a test can hand it a JSDOM tree and assert on what a visitor
// would actually see.
import { type Reading, currentMonth, read } from "./stratigraphy";

const PHASE_LABEL = {
  construction: "Construction",
  maintenance: "Maintenance",
  decay: "Decay",
} as const;

export function renderReading(root: ParentNode, reading: Reading | null): void {
  const output = root.querySelector<HTMLElement>("[data-output]");
  const empty = root.querySelector<HTMLElement>("[data-empty]");
  if (!output || !empty) return;

  if (!reading) {
    output.hidden = true;
    empty.hidden = false;
    empty.textContent =
      "No dates found. Paste the output of `git log --format=%ai` — one date per line.";
    return;
  }

  empty.hidden = true;
  output.hidden = false;

  const peakCount = Math.max(...reading.bucketed.map((b) => b.count), 1);

  const chart = root.querySelector<HTMLElement>("[data-chart]");
  if (chart) {
    chart.replaceChildren();
    for (const bucket of reading.bucketed) {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.dataset.phase = bucket.phase;
      // A month with no commits still occupies its column: the silence is the
      // finding, so it has to have width.
      bar.style.setProperty("--h", `${Math.round((bucket.count / peakCount) * 100)}%`);
      if (bucket.key === reading.boundary) bar.dataset.boundary = "true";
      bar.title = `${bucket.key}: ${bucket.count} commit${bucket.count === 1 ? "" : "s"} (${PHASE_LABEL[bucket.phase]})`;
      chart.append(bar);
    }
  }

  const set = (name: string, value: string) => {
    const el = root.querySelector<HTMLElement>(`[data-field="${name}"]`);
    if (el) el.textContent = value;
  };

  set("total", String(reading.total));
  set("range", `${reading.first} to ${reading.last}`);
  set("peak", reading.peak);
  set("boundary", reading.boundary);
  set("silent", `${reading.monthsSilent} month${reading.monthsSilent === 1 ? "" : "s"}`);
  set("verdict", reading.verdict);
}

/** Wires the form up. Returns nothing; all state lives in the DOM. */
export function initSectionReader(root: ParentNode): void {
  const form = root.querySelector<HTMLFormElement>("[data-reader-form]");
  const input = root.querySelector<HTMLTextAreaElement>("[data-input]");
  const tool = root.querySelector<HTMLElement>("[data-tool]");
  if (!form || !input || !tool) return;

  // The tool is inert without scripting, so it stays hidden until it works.
  tool.hidden = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Pass today explicitly. read() defaults `today` to the last commit,
    // which makes monthsSilent 0 and the verdict always "active" — the
    // one number this tool exists to produce. Every test passed an
    // explicit date, so the default path was never exercised until I
    // used the page.
    renderReading(root, read(input.value, currentMonth()));
  });
}
