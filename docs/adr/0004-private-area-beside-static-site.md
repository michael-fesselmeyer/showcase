# ADR 0004: A private area beside the static public site

- Status: accepted
- Date: 2026-11-15

## Context

Every route is static, enforced by `ensureStatic = 'navigation'` on the root layout
([ADR 0003](0003-performance-budget.md)). The studio tools need pages that render per request for
a signed-in owner. Next.js applies an `ensureStatic` level to every route that renders the layout
exporting it, and a child segment may be stricter than its parent but never weaker. With the
export on the root layout, no route in the app can ever be dynamic.

The public pages must stay static, and it must stay impossible to make one dynamic by accident.

## Decision

- **Two route groups under one small root layout.** `app/(site)` holds the public routes;
  `app/(studio)` holds the private ones. Route groups do not change URLs.
- **The static contract moves to the public group.** `app/(site)/layout.tsx` exports
  `ensureStatic = 'navigation'` and takes over the header, footer and motion components. Every
  public route renders it, so the build still fails if any public route needs request-time
  rendering.
- **The private group opts out explicitly.** `app/(studio)/studio/layout.tsx` exports
  `ensureStatic = false`, so the build fails if a static level is ever set beneath it.
- **The root layout holds only what both share** (`<html>`, `<body>`, fonts, tokens) and reads
  nothing from the request.
- **Guards:** a unit test fails if a page or route handler sits outside `(site)`, `(studio)` or
  `api`; a lint rule stops public code importing private modules or the database client.
- **The private area can be switched off** with `STUDIO_ENABLED`; when off, its routes return 404.

The move is done first, on its own, as a spike: if the public build output, the 404 page or the
Lighthouse scores change, the approach is revisited before anything else is built on it.

## Alternatives considered

- **Two root layouts** (one per group, no shared root): the strongest isolation, and the public
  root layout would move untouched. But with no shared root there is no layout to render the
  not-found page for unmatched URLs, which needs an experimental flag. An experimental feature on
  the 404 path of the public site is a worse trade than a small shared root. Kept as the fallback
  if the shared root causes problems.
- **A separate app or repository on a subdomain:** complete separation, but two deployments, two
  pipelines and a duplicated design system for one person's tool, and the enquiry form would have
  to call across origins.
- **Leave the export on the root and make private pages client-rendered:** the pages would be
  static shells fetching data from API routes in the browser. It keeps the letter of the contract
  but gives up server rendering, doubles the surface to authorise, and ships data-fetching code to
  the browser.
- **Drop `ensureStatic` and rely on review:** the contract exists because review misses things.

## Consequences

- Public pages are still static by contract; the guarantee is scoped to them instead of global.
- The not-found page sits under the root layout and must bring its own header and footer.
- Anything added to the root layout affects both areas, so it stays minimal; the pre-paint script
  for the opening sequence is checked during the spike for effects on private pages.
- Private pages must put request-dependent work inside `<Suspense>`, as Cache Components requires.
- Lighthouse CI keeps covering the public URLs only.
