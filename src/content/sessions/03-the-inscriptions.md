---
title: The inscriptions
description:
  Commit messages as primary sources — reconstructing a team's communication
  norms, morale, and working patterns from the messages they left behind.
week: 3
date: 2027-03-08
teachers:
  - maren-voss
spec:
  - you have categorised your dig site's commit messages by convention and quality
  - you can describe the team's communication norms without reading their code
  - you have identified at least one commit message that reveals something the code alone would not
related:
  - lectures/week-03
---

## Before the dig

Read the last 100 commit messages on your dig site (or all of them if fewer
than 100). Categorise each by type:

- **Descriptive:** says what changed and why (`Fix race condition in session cleanup`)
- **Terse:** says what changed but not why (`Fix bug`, `Update`)
- **Opaque:** says nothing useful (`wip`, `stuff`, `asdf`, `.`)
- **Conventional:** follows a named convention (`feat:`, `fix:`, `chore:`)

Count the proportions. What do they tell you about the team?

## In the session

Compare proportions across the class. Projects with high descriptive rates and
projects with high opaque rates have something to say about team health, review
culture, and whether the authors expected anyone else to read the history.
Discuss: is a terse commit message a sign of low effort, high velocity, or
working alone?

## Afterwards

Find the single most diagnostic commit message in your dig site — the one that
reveals the most about the project's life that the code alone would not. Write
100 words explaining what it tells you.
