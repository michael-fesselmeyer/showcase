# ADR 0003: Performance budget and progressive effects

- Status: accepted
- Date: 2026-11-13

## Context

Most prospective clients open the site on a phone, from a link. The site's effects (opening
sequence, WebGL shader, scroll choreography, line reveals) are the point of the site, but a slow
first load undercuts it. The target is 95 or more in every Lighthouse category on mobile.

The first measurement of the home page scored 42 to 97 across three runs. Two causes:

- **Software WebGL.** Without a GPU the shader rendered on the CPU, producing a four-second
  long task. Headless test browsers have no GPU, but neither do some real devices.
- **A hidden headline.** The opening sequence raised the headline words out of an overflow mask.
  Clipped text is not painted, so the largest contentful paint waited for the animation.

## Decision

- **Measure in CI.** Lighthouse CI runs on every pull request against a production build on an
  emulated phone, asserting a minimum of 95 per category on the median of three runs. The
  optimistic default (best run) hid the problem and is not used.
- **Effects are enhancements, never prerequisites.** Each one has a fallback that is already on
  the page before JavaScript runs:
  - the shader loads after idle over a CSS gradient in the same colours, and only when WebGL is
    hardware accelerated (`failIfMajorPerformanceCaveat`);
  - the opening sequence is CSS, decided by a tiny pre-paint script, and the headline stays
    painted underneath it, settling into place with transform and blur rather than a mask;
  - text reveals split lines lazily, just before each block scrolls into view.
- **Static by contract.** `ensureStatic = 'navigation'` makes the build fail if any route needs
  request-time rendering.

## Alternatives considered

- **Drop the shader on mobile:** simpler, but phones with good GPUs would lose the hero's main
  effect for no reason.
- **Skip the opening sequence when a performance audit is detected:** hides the problem from the
  measurement instead of fixing it for people.
- **Pre-split all text at hydration:** cheaper to write, but measuring every block at load added
  around 100 ms of blocking time on a throttled phone.

## Consequences

- Median scores went from 66 to 99 on the home page, with largest contentful paint around 0.9 s
  and total blocking time under 50 ms in local runs.
- New effects must ship with a fallback that works before JavaScript and with reduced motion, and
  Lighthouse CI will catch regressions in review.
