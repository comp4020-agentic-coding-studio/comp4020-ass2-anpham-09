---
title: Tool inventory
description:
  Dependency analysis — reading package manifests as archaeological tool kits
  to date the project and reconstruct the technological era it belongs to.
week: 4
date: 2027-03-15
teachers:
  - kai-nakamura
spec:
  - you can list your dig site's direct dependencies and the era each belongs to
  - you have identified at least one dependency choice that tells you something about the team
  - you have checked which dependencies are themselves now abandoned
related:
  - lectures/week-04
  - assessments/dig-report
---

## Before the dig

Open your dig site's dependency manifest (`package.json`, `requirements.txt`,
`Gemfile`, `go.mod`, or equivalent). For each direct dependency:

1. Look it up. Is it still maintained? When was its last release?
2. What era does it place the project in? A project using `request` instead of
   `node-fetch` or `undici` dates itself to before 2020. jQuery 1.x dates to
   before 2016.
3. Are any dependencies pinned to exact versions? What does pinning tell you
   about the team's relationship to change?

## In the session

Present your tool inventory as a dating report. The class cross-references:
students working on projects in the same language can compare dependency
choices and what they reveal about different teams' priorities.

## Afterwards

**The Dig Report is due next week.** Use this session's findings as the
tool-inventory section of your report.
