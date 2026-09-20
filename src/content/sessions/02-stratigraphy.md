---
title: Stratigraphy
description:
  Dating techniques — reading the commit history as geological layers to
  identify periods of construction, maintenance, and abandonment.
week: 2
date: 2027-03-01
teachers:
  - kai-nakamura
spec:
  - you can produce a commit-frequency timeline for your dig site
  - you have identified at least two distinct periods in its history
  - you can name the boundary event between the active and decay periods
related:
  - lectures/week-02
---

## Before the dig

Run `git log --format='%ai'` on your dig site and pipe it through a tool of
your choice to produce a commit-frequency graph (commits per week or per
month). Any tool works — a spreadsheet, a Python script, a shell one-liner. The
graph is the artefact; the tool is not.

Read the graph before the session. Look for:

- **Construction phase:** high-frequency early commits, often by one or two authors
- **Maintenance phase:** lower frequency, broader authorship, more merge commits
- **Decay phase:** sporadic commits, often only dependency updates or CI fixes
- **Boundary events:** a week with an unusual spike or drop. What happened?

## In the session

Present your timeline. Name the phases you see and the boundary between the
last active period and the decay. The class pressure-tests your reading: is
that spike a release, a rewrite, or a weekend? Is the silence after it
abandonment or stability?

## Afterwards

Write a 200-word stratigraphic summary of your dig site: when it was built,
when it was maintained, when it was abandoned, and what (if anything) the
boundary event appears to have been. Cite specific commits.
