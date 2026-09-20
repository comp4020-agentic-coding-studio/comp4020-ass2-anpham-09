---
title: Archives and time capsules
description: >-
  Software preservation — the institutions that try, the difference between
  archiving code and preserving the ability to run it, and what still gets lost.
week: 9
date: 2027-04-19
teachers:
  - maren-voss
slides: /decks/week-09/
related:
  - sessions/09-preservation
---

## Learning outcomes

By the end of this week you should be able to:

1. distinguish bit preservation, source preservation and preservation of executability
2. evaluate the coverage and the blind spots of the major software-preservation institutions
3. identify what is lost when a repository is deleted beyond the source itself

## Outline

- **Software Heritage:** the largest archive of source code, and what it does and does not preserve
- **The Internet Archive and the Wayback Machine:** preserving the web as it was
- **GitHub's Arctic Code Vault:** a 21TB snapshot in a decommissioned coal mine in Svalbard. What it includes, what it excludes, and what a future reader would need to make sense of it.
- **The executability problem:** archiving source code is easy; archiving the ability to run it is nearly impossible. Every dependency, OS call, environment variable, and hardware assumption is a link in the chain.
- **Case study: the BBC Domesday Project** — a 1986 multimedia time capsule that was unreadable by 2001 because the hardware no longer existed
- **Container archaeology:** can you `docker build` a 2014 Dockerfile?

## Required reading

- Rothenberg, J. (1995) 'Ensuring the Longevity of Digital Documents', *Scientific American* 272(1), pp. 42–47.
- Di Cosmo, R. and Zacchiroli, S. (2017) 'Software Heritage: Why and How to Preserve Software Source Code', *iPRES 2017*.

## Further reading

- Owens, T. (2018) *The Theory and Craft of Digital Preservation*. Johns Hopkins University Press.
- McDonough, J. et al. (2010) *Preserving Virtual Worlds Final Report*. University of Illinois.

## Seminar questions

1. Rothenberg wrote in 1995 that emulation was the only durable strategy. Thirty years on, was he right?
2. Software Heritage preserves source but not issues, review threads or CI history. Argue for or against calling those part of the software.
3. What would a reader in 2125 need, beyond your dig site's source, to understand what it was for?
