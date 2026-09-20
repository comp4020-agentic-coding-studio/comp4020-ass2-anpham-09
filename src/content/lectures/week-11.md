---
title: Minimum intervention
description: >-
  Restoration practice — reviving one piece of dead software with the smallest
  possible change, the way a conservator stabilises a painting.
week: 11
date: 2027-05-03
teachers:
  - maren-voss
  - kai-nakamura
slides: /decks/week-11/
related:
  - sessions/11-the-restoration
  - assessments/the-exhibit
---

## Learning outcomes

By the end of this week you should be able to:

1. apply the principle of minimum intervention to a concrete restoration
2. produce a restoration log adequate for another practitioner to audit
3. distinguish stabilisation from modernisation, and justify the boundary chosen

## Outline

- **The conservation principle:** stabilise, do not repaint. Change only what is necessary to make it work, and document every change.
- **What "minimum" means in practice:** updating a dependency vs rewriting the code that uses it. Shim vs migration. Compatibility vs modernisation.
- **Case study: HTMX** — old ideas (HTML-over-the-wire, progressive enhancement) revived in modern packaging. Is it restoration or reinvention?
- **The restoration log:** a complete list of changes, in order, each with a justification. The log is as important as the code.
- **What you deliberately do not change:** the temptation to refactor, modernise, improve. Every improvement is a departure from the original.
- **When restoration is not appropriate:** projects that should stay dead

## Required reading

- Brandi, C. (2005 [1963]) *Theory of Restoration*, trans. C. Rockwell. Istituto Centrale per il Restauro / Nardini.
- ICOMOS (1964) *International Charter for the Conservation and Restoration of Monuments and Sites* (The Venice Charter).

## Further reading

- Feathers, M.C. (2004) *Working Effectively with Legacy Code*. Prentice Hall. Chapters 1–6.
- Muñoz Viñas, S. (2005) *Contemporary Theory of Conservation*. Elsevier.

## Seminar questions

1. The Venice Charter requires that restoration work be distinguishable from the original and reversible. What is the software equivalent of reversibility — a branch, a flag, a patch file?
2. Brandi distinguishes the historical from the aesthetic instance of a work. Does code have an aesthetic instance, and would preserving it ever justify leaving a bug in place?
3. Feathers defines legacy code as code without tests. Does adding tests to your dig site violate minimum intervention?
