# ADR 0002: Motion stack and division of labour

- Status: accepted
- Date: 2026-11-12

## Context

The site's main job is to impress, so motion carries a lot of weight: an opening sequence, scroll
reveals, a pinned horizontal gallery, tilting cards, shared-element page transitions, a
velocity-reactive marquee, a cursor spotlight and magnetic buttons. Using several animation
libraries risks two of them fighting over the same element, inconsistent timing, and a heavy
bundle.

## Decision

- **Motion** (`motion/react`) for component-level interaction: enter and exit, layout animation,
  gestures, springs (tilt, magnetic pull, cursor).
- **GSAP** with ScrollTrigger and SplitText, via `@gsap/react`, only for scroll-driven sections and
  line-by-line text splitting.
- **Lenis** for smooth scrolling, driven from GSAP's ticker so ScrollTrigger and Lenis share one
  frame loop.
- **React `<ViewTransition>`** (stable in the App Router since Next.js 16.3, no flag) for the
  project card to case study shared-element transition.
- **One element, one engine.** No element is animated by both Motion and GSAP.
- **Shared tokens.** Easing curves and durations are defined once in `lib/motion/tokens.ts` and
  mirrored as CSS custom properties; a unit test keeps them in sync.
- **Reduced motion is a first-class mode**, not an afterthought: every effect has a calm fallback
  that keeps all content readable.

## Alternatives considered

- **Motion only:** no equivalent of ScrollTrigger pinning or SplitText.
- **GSAP only:** gestures, springs and exit animations in React are clumsier.
- **Native CSS only (scroll-driven animations, view transitions):** promising, but uneven browser
  support for scroll timelines and no velocity input for the marquee.

## Consequences

- Two animation libraries ship, so both are loaded only by the client components that need them,
  after first paint.
- New effects pick an engine by the rule above, which keeps reviews simple.
