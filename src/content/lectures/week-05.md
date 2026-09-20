---
title: Reconstructing architecture
description: >-
  Reading a project's structure as a site plan — what directory layout, naming
  conventions, and entry points reveal about how the team thought.
week: 5
date: 2027-03-22
teachers:
  - maren-voss
slides: /decks/week-05/
related:
  - sessions/05-architecture-from-ruins
---

## Learning outcomes

By the end of this week you should be able to:

1. reconstruct a system's intended decomposition from directory structure and entry points alone
2. evaluate an observed structure against Conway's law and Parnas's decomposition criteria
3. distinguish designed architecture from accreted architecture

## Outline

- **Directory structure as worldview:** MVC, feature folders, the flat dump
- **The `utils/` problem:** when a folder name means "we did not know where to put this"
- **Entry points as front doors:** `index.js`, `main.py`, `App.tsx`
- **Case study: Backbone.js** — a framework whose directory convention shaped a generation of JavaScript projects, now itself an artefact
- **Dead architecture patterns:** patterns that were standard practice in one era and are unrecognisable in the next
- **Drawing the map they never drew:** reconstructing intent from structure

## Required reading

- Parnas, D.L. (1972) 'On the Criteria To Be Used in Decomposing Systems into Modules', *Communications of the ACM* 15(12), pp. 1053–1058.
- Conway, M.E. (1968) 'How Do Committees Invent?', *Datamation* 14(5), pp. 28–31.

## Further reading

- Brooks, F.P. (1975) *The Mythical Man-Month*. Addison-Wesley. Chapters 4–5 on conceptual integrity.
- Hodder, I. (1986) *Reading the Past: Current Approaches to Interpretation in Archaeology*. Cambridge University Press.

## Seminar questions

1. Parnas distinguishes decomposition by flowchart from decomposition by information hiding. Which did your dig site use, and did its authors appear to know?
2. If Conway's law holds, what team structure does your dig site's directory layout imply? Can you corroborate that from the contributor graph?
3. Hodder argues material culture is read, not simply decoded. What is lost if we treat a directory tree as a decodable signal rather than a text?
