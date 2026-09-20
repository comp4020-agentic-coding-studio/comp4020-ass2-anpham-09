---
title: Preservation
description:
  Conservation — the difference between preserving code and preserving the
  ability to run it, and the institutions that try to do both.
week: 9
date: 2027-04-19
teachers:
  - maren-voss
spec:
  - you can explain the difference between archiving source code and preserving executability
  - you have tested whether your dig site can be built or run today
  - you can name one thing that would be lost if the repository were deleted tomorrow
related:
  - lectures/week-09
---

## Before the dig

Try to build and run your dig site on your current machine. Document what
happens:

1. Can you install the dependencies? Do they still resolve? Are any yanked or missing?
2. Does the build succeed? Does it need a Node version that no longer exists? A Python 2 interpreter?
3. If it runs, does it do what the README says it does?

If it fails, document exactly where. The failure itself is a finding.

Also: check whether your dig site is archived anywhere — Software Heritage, the
Internet Archive's Wayback Machine, GitHub's Arctic Code Vault. Is the archive
a snapshot of the same state you cloned?

## In the session

Share build-and-run results. The class compiles an executability report: what
proportion of dig sites can still be built? What is the most common point of
failure? npm's `node-gyp` and Python 2's `print` statement are frequent
offenders.

## Afterwards

Write 200 words on what would be lost if your dig site's repository were
deleted tomorrow. Not the code — that is in your clone and maybe an archive.
What else? The issues, the pull requests, the discussion threads, the
contributor graph, the stars-over-time chart. Which of those are artefacts and
which are metadata?
