---
title: The documentation layer
description:
  Epigraphy — reading the writing the authors left behind, and diagnosing the
  project from the gap between what the docs promise and what the code does.
week: 6
date: 2027-03-29
teachers:
  - kai-nakamura
spec:
  - you have catalogued every piece of documentation in your dig site
  - you can describe the gap between what the docs promise and what the code delivers
  - you have identified at least one undocumented behaviour that matters
related:
  - lectures/week-06
---

## Before the dig

Catalogue every piece of writing in your dig site:

- README (length, last updated, accuracy)
- Inline comments (density, quality, staleness)
- API documentation (generated or hand-written?)
- Wiki pages, if any
- Issue templates, contributing guides, changelogs

For each, note: does it describe the code as it is now, or as it was when
someone last cared? The gap between the two is the most diagnostic artefact on
any dig site.

## In the session

Present your documentation audit. The class discusses which kinds of
documentation survive abandonment — READMEs often do; inline comments rot
first — and what the documentation gap reveals about the project's death.

A project whose README is accurate but whose inline comments are stale died
recently. A project whose README describes features the code no longer has
died slowly.

## Afterwards

Find one undocumented behaviour in your dig site — something the code does that
no documentation mentions. Write 100 words explaining what it is and why it
might have gone undocumented.
