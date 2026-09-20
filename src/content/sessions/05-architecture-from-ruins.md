---
title: Architecture from ruins
description:
  Spatial analysis — reconstructing the mental model the original authors had
  from directory structure, entry points, and file naming conventions alone.
week: 5
date: 2027-03-22
teachers:
  - maren-voss
spec:
  - you have drawn an architecture diagram of your dig site based on its directory structure
  - you can identify the entry point and the main data flow without reading function bodies
  - you can name at least one structural decision that tells you how the team thought about the problem
related:
  - lectures/week-05
---

## Before the dig

Run `find . -type f | head -200` (or equivalent) on your dig site. Without
reading the code inside any file, draw a diagram of the project's structure:

- Where is the entry point?
- Where does configuration live?
- Where are tests, if any?
- Is there a clear separation between interface and logic?
- What naming conventions do the files follow?

The diagram is the artefact. Hand-drawn is fine; the tool is not the point.

## In the session

Present your diagram. The class challenges your reading: does the directory
structure reflect the application's architecture, or is it an accident of
history? A `utils/` folder that contains half the codebase is a diagnostic
finding, not a neutral fact.

## Afterwards

Write a 200-word site plan summarising the architecture you reconstructed.
Name the structural decisions you can identify — MVC, monolith, plugin
architecture, no architecture — and what they tell you about the team's
experience level and priorities.
