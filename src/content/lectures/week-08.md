---
title: Cause of death
description: >-
  A taxonomy of software failure — why projects die, how to tell the modes
  apart, and why the diagnosis matters.
week: 8
date: 2027-04-12
teachers:
  - kai-nakamura
slides: /decks/week-08/
related:
  - sessions/08-cause-of-death
  - assessments/forensic-analysis
---

## Learning outcomes

By the end of this week you should be able to:

1. diagnose a project's cause of death against an explicit taxonomy of failure modes
2. construct a differential diagnosis distinguishing failure modes that present identically
3. evaluate the evidentiary strength of a diagnosis, including admitting multiple causes

## Outline

- **The taxonomy:** burnout, ecosystem shift, hostile fork, funding loss, dependency failure, mission accomplished, rewrite trap
- **Differential diagnosis:** burnout and ecosystem shift look the same from the commit graph; the dependency manifest separates them
- **Case study: CoffeeScript** — a language that succeeded, influenced its successor (ES6), and then lost its reason to exist. Success as a cause of death.
- **The rewrite trap in detail:** why "let us rewrite it in [new thing]" kills more projects than any external force
- **Misdiagnosis:** the cost of calling something dead when it is dormant, or done when it is abandoned
- **Multiple causes:** most real projects die of more than one thing

## Required reading

- Coelho, J. and Valente, M.T. (2017) 'Why modern open source projects fail', *Proceedings of the 2017 11th Joint Meeting on Foundations of Software Engineering* (ESEC/FSE), pp. 186–196.
- Avelino, G., Passos, L., Hora, A. and Valente, M.T. (2016) 'A Novel Approach for Estimating Truck Factors', *IEEE International Conference on Program Comprehension* (ICPC).

## Further reading

- Raymond, E.S. (1999) *The Cathedral and the Bazaar*. O'Reilly.
- Khondhu, J., Capiluppi, A. and Stol, K.-J. (2013) 'Is It All Lost? A Study of Inactive Open Source Projects', *IFIP International Conference on Open Source Systems*.

## Seminar questions

1. Coelho and Valente derive their taxonomy from maintainer self-reports. What failure modes would that method systematically under-count?
2. Khondhu et al. find many inactive projects are not failed. Where is the line, and who gets to draw it?
3. Defend the claim that your dig site died of more than one cause — then say which cause you would put first, and why.
