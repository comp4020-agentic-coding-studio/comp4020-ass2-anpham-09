# Process overview

## What I built

**SLOP2374 Software Archaeology** — a second-year course in excavating intent
from abandoned code. Students choose one dead repository in week 1 and spend
twelve weeks applying a different forensic method to it: dating the commit
history as stratigraphy, reading commit messages as inscriptions, dating the
project by its dependency manifest, and eventually diagnosing a cause of death
and deciding whether the thing should be revived at all.

## The course-design position I started from

My position is that a good course is **one idea explored through twelve
different methods, not twelve different topics**. Twelve topics is a reading
list; twelve methods applied to the same object is a discipline, because the
findings accumulate. The archaeology metaphor gave me that structure for free —
each week is a different technique brought to the same dig site, so week 8 can
ask students to combine six earlier readings into a diagnosis instead of
starting fresh.

That decision is what the site had to encode, and it is why the digs index is a
custom component rather than a card grid: the card grid rendered twelve equal,
unordered things, which is exactly the shape I was arguing against. The
[stratigraphic section](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/commit/5ea6e44) groups the weeks into four phases
and draws them as layers.

## What I encoded in the harness

I wrote [`c69e846`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/commit/c69e846) — eight harness rules — **before any
content existed**, so the rules were a contract the content had to satisfy
rather than a description of what I had already written. Rule 1 is the load
bearing one: *every session is a method, not a topic.*

Seven of those rules are judgement and stay judgement. Rule 1 is the one a test
can hold, so it got a sensor: `spec/course-integrity.test.ts` asserts that
every dig's description names a forensic method from a fixed vocabulary
([`2cfc5e1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/commit/2cfc5e1)). It earned its place immediately — it failed
on `sessions/03`, whose *title* said "inscriptions" but whose *description*
named no method at all. I fixed the content rather than widening the test.
Being explicit about which rules have sensors and which do not is itself part
of the harness.

## Two failures worth citing

The [base path](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/commit/5ea6e44). My `CLAUDE.md` warns that hand-written
root-absolute hrefs skip Astro's base handling, and notes this template ships
no `route()` helper — then I wrote twelve of them anyway and the build
rejected all twelve. The fix was not to patch the strings but to add
`src/lib/url.ts` with tests, because a rule I have to remember is weaker than a
function with a test around it. Worth recording separately: the build reported
this under a misleading *"document or window is not defined"* hint, with the
real error twelve lines above it.

The [artwork](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/commit/cc6ba01) is generated from code, and had two bugs
that no check in the roster could see. The depth term was inverted, so the
first render was a skyline instead of a section; and `mix-blend-mode` is
silently ignored by the rasteriser, so a warm two-ink palette was compositing
to a cool grey. Both were only visible by looking at the rendered PNG.

## Where to look

The history runs [`c69e846...5ea6e44`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-anpham-09/compare/c69e846...5ea6e44) in the
order the work happened: harness, then identity, then people, then content in
batches, then the checks, then the artwork and the index component.
