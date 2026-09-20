---
title: Dating techniques
description: >-
  How to read a commit history as geological layers — construction,
  maintenance, decay — and what the boundaries between them reveal.
week: 2
date: 2027-03-01
teachers:
  - kai-nakamura
slides: /decks/week-02/
related:
  - sessions/02-stratigraphy
---

## Learning outcomes

By the end of this week you should be able to:

1. construct a phase model of a project's history from version-control data
2. apply the logic of archaeological stratigraphy, and its concept of a sequence, to a non-physical record
3. state the systematic distortions that make commit timestamps unreliable evidence

## Outline

- **`git log` as a primary source:** what it records and what it does not
- Commit frequency as a proxy for project health
- Author diversity over time: the bus factor, visible in the log
- **Case study: OpenSSL before Heartbleed** — years of thin maintenance on one of the most critical libraries in the internet's stack
- **Boundary events:** releases, rewrites, the refactor that broke everything
- **The limits of dating:** clock skew, rebased histories, squash merges

## Required reading

- Harris, E.C. (1989) *Principles of Archaeological Stratigraphy*, 2nd edn. Academic Press. Chapters 3–5 on the laws of stratigraphy and the Harris matrix.
- Tornhill, A. (2015) *Your Code as a Crime Scene*. Pragmatic Bookshelf. Part I.

## Further reading

- Schiffer, M.B. (1987) *Formation Processes of the Archaeological Record*. University of New Mexico Press.
- Lehman, M.M. and Ramil, J.F. (2001) 'Rules and Tools for Software Evolution Planning and Management', *Annals of Software Engineering* 11, pp. 15–44.

## Seminar questions

1. Harris insists that stratigraphic sequence is independent of the material in each layer. What is the software equivalent of that claim, and does it survive `git rebase`?
2. Schiffer distinguishes cultural from natural formation processes. Which processes deposit commits that no human intended as a record?
3. Your timeline shows a six-month silence. Enumerate four distinct histories that would produce the same silence.
