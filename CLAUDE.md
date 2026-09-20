# Assignment 2: SlopU course site

This repo's platform is fixed (see `README.md`): Astro, the `astro-theme-university`
/`astro-theme-slop` branding, four content collections, and the generated course
API. There is no stack choice to make here. Everything else --- the course, the
pages, the content, the navigation, the visual treatment --- is mine.

The course website publishes this deliverable's brief and spec. The brief poses
the problem; the spec is the fixed contract every response must satisfy. Read
both before planning or building. This harness carries forward from Crit 5
(`comp4020-crit5-anpham-09`), trimmed and extended for a different, fixed
template.

## How to work in here

- Keep the dev server running (`pnpm dev`). It serves under the repo's base
  path, so the address is `http://localhost:4321/comp4020-ass2-anpham-09/` ---
  the bare `http://localhost:4321` Astro prints is a 404.
- Before pushing, run `pnpm check` (typecheck, then build + `spec/`). There is
  no separate lint step in this template and no `check:links` script --- the
  build's own link checker and `axe-core` pass run as part of `pnpm build`.
  `pnpm check:evidence` is the final submission gate: process citations, the
  reflection, and that every `STARTER_CONTENT` marker and placeholder image
  has been replaced. Run it before shipping, not just at the end.
- To see what the page actually looks like rather than what I assume it looks
  like, open it in a browser (`agent-browser` CLI). A screenshot is a moment,
  not a state --- zoom or wait before believing a transition looks broken, and
  scroll before deciding content has vanished.
- **To render the 390×844 marking viewport, use an iframe, not the window.**
  Chrome on macOS clamps how narrow a window can go, so `resize_window`
  reports success while the page still lays out wide. Load the built page into
  a same-origin `<iframe>` sized 390×844 instead; media queries resolve
  against the frame. Read `innerWidth`, `scrollWidth`, and computed grid
  columns off `iframe.contentDocument` --- `scrollWidth` exceeding
  `innerWidth` is the horizontal-overflow failure this viewport checks for.
- When a check fails, read its output before changing anything. Treat a red
  check as authoritative --- the page is wrong until the check is green.
- Commit when the checks pass. Never commit a red state.
- **Never tell a reviewer what not to flag.** Pre-judging a finding in a task
  prompt is the one reliable way to make a review structurally unable to catch
  it. Let a possible issue be raised and argue it down on the record.

## The checks (fixed by this template)

- **typecheck** --- `astro check` runs first. It can't read `.astro` files the
  way `tsc` can, which is why the script uses it instead.
- **build** (`pnpm build`) --- itself several checks: `axe-core` over every
  rendered page, internal links resolved against the base path, dangling
  content refs fail the build, decks compile, and the versioned course API is
  emitted. Nothing else matters until this is green.
- **test** (`pnpm test`, part of `pnpm check`) --- builds first, then
  `vitest run spec`. `spec/data-integrity.test.ts` checks the one cross-page
  fact the build can't (dated material stays inside the teaching period); the
  tests I write for this week's spec run alongside it.
- **check:evidence** --- process citations resolve to real commits, the exact
  current reflection (`reflections/assignment-2.md`) is present, CLAUDE.md
  exists, and --- specific to this template --- every tracked
  `STARTER_CONTENT` fragment and unchanged placeholder image is gone. Remove a
  fragment's marker the moment I replace it, not in a batch at the end.
- **deploy / online** (CI only) --- the live GitHub Pages URL must return 200.
  Not gated on `check`: a red spec doesn't take the live site down.
- **secrets** (CI only) --- trufflehog scans for verified secrets and for the
  course-key shape specifically. The local pre-commit hook
  (`.githooks/pre-commit`) catches key-shaped strings before they're even
  pushed.

## The content model

- Four fixed collections under `src/content/`: `sessions`, `assessments`,
  `lectures`, `people`, declared in `src/content.config.ts`. A collection key
  is the whole address --- `sessions/foo` is the file, the page, the JSON, and
  the ref other pages use --- so renaming one means renaming all of them.
- `related:` entries are refs (`<collection>/<slug>`, or a bare slug for the
  same collection). **The build fails on a ref that doesn't resolve** ---
  that's the point, not a bug to route around.
- `src/course-config.ts` is the single source for the course record (SLOP
  code, title, description, tags, session label, dates). The home page,
  navigation, and `/api/index.json` all read it --- don't restate those facts
  elsewhere. Keep the code's last three digits; the level (first digit) is
  free to choose and doesn't affect the mark.
- `published: false` drops an entry from the production build entirely but
  keeps it visible in `pnpm dev` (staging). `draft: true` keeps the page live
  but marked not-final.
- Decks (`src/decks/*.deck.mdx`, via astromotion) are not content-collection
  entries, so they have no `related:` edges --- link them from their lecture
  page with a normal markdown link.
- Base-path handling is automatic (`astro.config.ts` derives it from the repo,
  markdown links and theme components get rewritten). Still: don't hand-write
  a root-absolute `href` in a `.astro` file --- it skips that rewriting, works
  on `localhost`, and 404s on the deployed site. There's no `route()`/`asset()`
  helper in this template the way Crit 5 had one; the build's link checker is
  the sensor here.

## Astro facts to work from

- **A `<script>` with any attribute is `is:inline`, and inline means
  invisible.** `define:vars` or any other attribute makes Astro ship the block
  untouched --- no imports, no typechecking. `astro check` reporting a real
  variable as unresolvable while the page works fine in the browser is the
  symptom; believe the hint.
- **Astro eats the whitespace between a text node and a following element.**
  `…is\n<a href=…>` renders with no space. Write `is{" "}` before the link.
- **A test for code that doesn't exist yet must import it dynamically.**
  `pnpm check` typechecks before it lints or tests, so a static `import` of an
  unwritten module is a `ts(2307)` that blacks out the whole roster. Hold the
  specifier in a variable and `await import()` behind an `existsSync` guard.
- **A test whose name makes a claim its body doesn't check is worse than no
  test.** If the assertion is hard to write, that's the code's shape talking,
  not the test's. Break the thing a new test covers once to confirm it can go
  red.
- **Never write `*/` inside a CSS comment** --- it closes the comment early,
  and lightningcss reports the error somewhere unrelated to it.
- **Astro inlines small module scripts straight into the HTML.** A test that
  filters `dist/**` to `.js` files can see an empty bundle for a page that
  actually has handlers --- read the inline `<script>` elements too.
- **JSDOM has no layout engine: every rect it reports is zero.** Anything
  dividing by a height silently becomes `NaN`. Give a geometry measurement its
  own pure function so it's testable as arithmetic, and stub
  `getBoundingClientRect` when the wiring itself is under test.

## Rules for the page itself

Constraints on the artefact that no check above can see:

- **Colour only ever comes from a custom property.** No literal hex in a rule
  body --- the theme's brand tokens exist so dark mode is one
  `prefers-color-scheme` block, not scattered overrides.
- **Judge colour separation in OKLab, not RGB or hue angle** when colours need
  to be told apart at a glance --- both rank pairs backwards. Clear a distance
  floor, then choose by meaning; maximising minimum distance produces gamut
  extremes.
- **Every transition and animation needs a `prefers-reduced-motion` escape.**
  Decks (astromotion) are the likely place this bites --- motion that can't be
  turned off is an accessibility defect, not an edge case.
- **No `100vh`.** Use `dvh` with a fallback; sticky bars use
  `position: sticky; top: 0`.
- **Interactive targets are at least 44×44px** (WCAG 2.5.5), including where
  the visible element is smaller than the hit area --- grow the target with an
  absolutely positioned `::after` rather than the element itself.
- **No web font.** An external font request is a failure mode nothing in the
  check roster catches.
- **Commit the updated `pnpm-lock.yaml`** --- CI installs with
  `--frozen-lockfile`.

## Process is part of the mark

- **Commit as you go.** A trail that grew alongside the work is the strongest
  evidence of process; a single dump the night before is the weakest.
- **`PROCESS.md`** is a reading guide, not an essay --- what I built, the
  moments that mattered, each pointing at a commit, a `CLAUDE.md` change, or a
  prompt and the commit it produced. `pnpm check:evidence` verifies citations
  resolve to real commits.
- **`reflections/assignment-2.md`** --- named for this exact deliverable;
  `check:evidence` checks the current name against the course API, not just
  the presence of a file.
- **This file is process evidence too.** Keep it honest and current as the
  harness learns things --- a convention to hold the agent to, a sensor that
  keeps catching mistakes, a fact about this stack the agent gets wrong.

This file and any sensors added to `spec/` are what carries forward to the next
repo; the course content and this week's spec answers stay behind.
