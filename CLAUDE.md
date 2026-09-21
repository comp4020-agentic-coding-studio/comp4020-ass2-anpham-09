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
  `vitest run spec src`. `spec/data-integrity.test.ts` checks the one
  cross-page fact the build can't (dated material stays inside the teaching
  period); the tests I write for this week's spec run alongside it.
  **The template ships this as `vitest run spec` alone**, so a test co-located
  with its source in `src/` is collected by no script and runs in no CI job.
  `src/lib/url.test.ts` sat in exactly that blind spot until I checked. A test
  that cannot run is worse than no test, because it reads as coverage. The
  `src` path is added deliberately; `scripts/` stays out, since those are
  template-maintainer tests and `test:template` owns them.
- **check:evidence** --- `PROCESS.md` exists, its template boilerplate is gone,
  and every commit it cites resolves; `CLAUDE.md` exists. **No
  `reflections/` file is required for an assignment repo** ---
  `scripts/check-evidence.ts`'s `expectedReflections()` returns `[]` for any
  `comp4020-ass*` repo, because the written account here is `PROCESS.md`
  itself (the retro crit reads that, not a second document). Specific to A2:
  every `STARTER_CONTENT` fragment in `src/` must be gone (`git grep`-checked),
  and four starter assets are hash-checked byte-for-byte --- `card.png`,
  `hero-home.avif`, and both people photos --- so replacing or deleting each
  one is required, not optional. Remove a fragment's marker the moment I
  replace it, not in a batch at the end.
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
- **A `: ` inside an unquoted YAML description breaks the frontmatter.** The
  content schemas take multi-line plain scalars, and a colon-space anywhere in
  one reads as a mapping key — the error is `bad indentation of a mapping
  entry`, pointing at the line but not explaining why. Use `description: >-`
  for any description containing a colon. Cost one build on
  `sessions/11-the-restoration`, whose description was `…restores a painting:
  stabilise, do not repaint`.
- **Never write `*/` inside a CSS comment** --- it closes the comment early,
  and lightningcss reports the error somewhere unrelated to it.
- **Astro inlines small module scripts straight into the HTML.** A test that
  filters `dist/**` to `.js` files can see an empty bundle for a page that
  actually has handlers --- read the inline `<script>` elements too.
- **The clock is an input; inject it at the call site.** `read()` in
  `src/lib/stratigraphy.ts` defaults `today` to the last commit, which makes
  months-silent 0 and the verdict "active" for every input — including a
  project dead for five years, which is the one number the tool exists to
  produce. Every test passed an explicit date, so the default path was never
  exercised and the suite stayed green over a broken feature. It was only
  visible by using the page. A default that is never tested is not a default,
  it is a trap.
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
- **No reflection file for this repo.** Assignment repos carry none ---
  `PROCESS.md` is the written account, full stop. Don't add
  `reflections/assignment-2.md`; it would just be a file nothing reads.
- **This file is process evidence too.** Keep it honest and current as the
  harness learns things --- a convention to hold the agent to, a sensor that
  keeps catching mistakes, a fact about this stack the agent gets wrong.

This file and any sensors added to `spec/` are what carries forward to the next
repo; the course content and this week's spec answers stay behind.

## Software Archaeology harness rules

These are the rules for *this course*, not for the stack. They were written
before any content existed, because they are what the content had to satisfy.

1. **Every session is a method, not a topic.** The week title names a domain
   ("The inscriptions") but the content teaches a forensic technique the
   student applies to their own dig site. A session that describes a subject
   without teaching a method is filler — reject it.
2. **The metaphor is used, never explained.** Don't write "commit messages are
   like inscriptions because…" — just call them inscriptions. The reader gets
   it from context or re-reads week 1. Explaining the conceit is how it dies.
3. **No session mentions a technology as something to learn.** This is not a
   Git course or a Node course. Tools appear as artefacts to be examined,
   never as skills to acquire: "read the dependency manifest", not "learn how
   npm works".
4. **Assessment descriptions name what the student argues, not what they
   submit.** "Revise your cause-of-death diagnosis", not "submit a 1500-word
   report". The format belongs under "What you submit".
5. **People have specificity.** Bios name research interests and personality
   traits, not just credentials. A one-line title and a generic paragraph is a
   placeholder, not a person.
6. **Weeks build.** Each session's "Before the dig" can reference findings from
   earlier weeks. By week 8 the student is combining methods, not using each
   one in isolation. A semester of twelve independent topics is twelve
   lectures; a semester of twelve methods on one dig site is a course.
7. **Case studies are real.** Every lecture names a real project, a real event,
   or a real person. No hypothetical examples. If a claim needs a source, find
   one or cut the claim.
8. **The voice is academic but warm.** Takes dead code seriously without being
   solemn. The humour comes from how well the archaeology metaphor holds up,
   not from jokes about it.

### Holding these mechanically

Rule 1 is the one a person would otherwise have to police by reading all
twelve sessions, so it is meant to have a sensor: `spec/course-integrity.test.ts`,
asserting every session description names a forensic method from a fixed
vocabulary. **That file does not exist yet.** Describing a test here and not
writing it is the failure this course teaches students to detect — a claim with
nothing behind it — so either write it or cut this sentence.

Rule 7 has `spec/source-integrity.test.ts`. No runner can confirm a cited work
exists, and it does not pretend to: a test named "case studies are real" would
be one whose name makes a claim its body cannot check. What it holds is the
shape fabrication actually took when it arrived here — a parallel draft of all
twelve decks carrying six invented colleagues, signing off commits from eight
example.com and kernel.org addresses. So: every address in teaching content
must be in-world (`@slop.university`), no example is framed as hypothetical,
every lecture carries a source with an author and a year, and each deck's
reading slide matches its lecture's exactly — the anti-drift property 51301c6
asserted and nothing enforced. `src/content/people` is out of scope, since the
staff are invented on purpose under rule 5.

Run against that draft, the sensor fails on all four counts. Watch for `\Z` in
a JavaScript regex while reading it: JS has no such anchor and reads it as a
literal Z, which silently truncated a section mid-citation and bought one green
run this file had not earned.

The remaining six are judgement, and they stay judgement — a rule I can't test
is still worth writing down, but I should know which kind I'm holding.
