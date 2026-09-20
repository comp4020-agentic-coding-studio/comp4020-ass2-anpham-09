---
title: The tool kit
description: >-
  Dependency manifests as archaeological artefacts — what a project's chosen
  tools reveal about its era, its team, and its assumptions.
week: 4
date: 2027-03-15
teachers:
  - kai-nakamura
slides: /decks/week-04/
related:
  - sessions/04-tool-inventory
  - assessments/dig-report
---

## Learning outcomes

By the end of this week you should be able to:

1. date a codebase from its dependency manifest and defend the estimate
2. analyse version-pinning strategy as evidence of a team's risk posture
3. assess the transitive dependency graph as inherited, unchosen infrastructure

## Outline

- **The dependency manifest as a time capsule:** jQuery dates a project the way pottery dates a stratum
- Version pinning as preservation instinct vs version ranges as trust
- **Transitive dependencies:** the code you did not choose but cannot run without
- **Case study: left-pad** — eleven lines of code, one unpublish, and the day the internet learned what `node_modules` actually contains
- **Abandoned dependencies:** when your tool kit contains a dead tool
- **Security archaeology:** CVEs in abandoned dependencies as unexploded ordnance

## Required reading

- Cox, R. (2019) 'Surviving Software Dependencies', *Communications of the ACM* 62(9), pp. 36–43.
- Decan, A., Mens, T. and Grosjean, P. (2019) 'An empirical comparison of dependency network evolution in seven software packaging ecosystems', *Empirical Software Engineering* 24, pp. 381–416.

## Further reading

- Zimmermann, M., Staicu, C.-A., Tenny, C. and Pradel, M. (2019) 'Small World with High Risks: A Study of Security Threats in the npm Ecosystem', *USENIX Security Symposium*.
- Star, S.L. and Ruhleder, K. (1996) 'Steps Toward an Ecology of Infrastructure', *Information Systems Research* 7(1), pp. 111–134.

## Seminar questions

1. Cox argues dependency adoption deserves the scrutiny of a hiring decision. Whose labour does that framing make visible, and whose does it still hide?
2. Star and Ruhleder claim infrastructure becomes visible only on breakdown. Was your dig site's dependency graph ever visible to its authors?
3. Does a pinned lockfile preserve a project or embalm it?
