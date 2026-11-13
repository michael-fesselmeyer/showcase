# ADR 0001: Stack and rendering model

- Status: accepted
- Date: 2026-11-12

## Context

The site wins web development clients. Most visitors open it on a phone, from a link, once. It has
to look exceptional and still load fast on a mid-range device. Scope is small (home, work index,
case studies, contact), there is no user data to store, and the only server-side behaviour is
receiving project enquiries.

## Decision

- **Next.js 16 (App Router), React 19, TypeScript strict**, hosted on **Vercel**.
- **Every page is static.** Content is typed TypeScript config (`site.config.ts`,
  `content/projects.ts`), not a database or CMS. Case studies are generated at build time from the
  projects file.
- **Cache Components** is on, so anything time-based in a server component must be cached
  explicitly (the footer year uses `'use cache'`), which keeps every route prerenderable.
- **Server components by default.** Client components only where interaction needs them (menus,
  motion, the enquiry form).
- **The enquiry form is the only server code**: a server action validated with Zod.
- **Tailwind CSS 4** with design tokens as CSS custom properties, and **shadcn/ui** (Radix) for
  accessible form and menu primitives, restyled to the site's look.

## Alternatives considered

- **A headless CMS or database for projects:** more moving parts and a runtime dependency for
  content that changes a few times a year. A typed file gives compile-time checks and zero latency.
- **A static export (`output: 'export'`):** rules out the server action for enquiries.
- **Effect kits (Aceternity UI, Magic UI, React Bits) used as-is:** fast, but recognisably
  templated. Used for ideas only; every showcase component is custom.

## Consequences

- Adding a project or switching on a social or booking link is a config change, never a component
  change.
- Builds are the only time content changes, so a content edit means a redeploy.
- Pages are served from the CDN, so the performance budget is spent almost entirely on fonts,
  motion and the hero shader, which are covered in ADR 0002.
