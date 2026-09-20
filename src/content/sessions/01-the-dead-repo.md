---
title: The dead repo
description:
  Survey — what makes software dead, how to tell, and how to choose a dig site
  you will spend the semester excavating.
week: 1
date: 2027-02-22
teachers:
  - maren-voss
spec:
  - you have chosen a dig site — a public, abandoned repository with a visible history
  - you can clone it, read its log, and name its last active date
  - you can articulate why you chose it over the alternatives you considered
related:
  - lectures/week-01
---

## Before the dig

Find three candidate dig sites: public repositories on GitHub, GitLab, or
SourceForge whose last meaningful commit is at least eighteen months old.
"Meaningful" excludes bot-authored dependency bumps and CI config changes — a
project with a Dependabot commit last Tuesday and a human commit in 2021 is
dead.

For each candidate, note: the language, the approximate size (files, commits,
contributors), the licence, and the date range of human activity. Bring all
three to the session.

## In the session

Present your three candidates. The class helps you choose: the best dig site is
big enough to reward twelve weeks of investigation, dead enough to be
unambiguous, and licensed permissively enough that you can fork it for the
restoration in week 11.

You will work with this codebase for the rest of the semester. Choose one you
can live with.

## Afterwards

Clone your chosen site. Run `git log --oneline | wc -l` and
`git log --format='%ai' | head -1` / `tail -1` to confirm the date range. Write
a one-paragraph summary of what the project appears to be, based only on the
README and the file listing — do not read the code yet.
