# showcase

A showcase website for an independent web development studio. It presents selected projects as
case studies, maps the technologies behind them, and takes project enquiries, with a dark
editorial look, deliberate motion and a mobile-first performance budget.

[![CI](https://github.com/michael-fesselmeyer/showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/michael-fesselmeyer/showcase/actions/workflows/ci.yml)

**Live:** [showcase-khaki-psi.vercel.app](https://showcase-khaki-psi.vercel.app) · **Status:** launched with sample content

> All projects currently on the site are **samples** with invented clients, used to demonstrate
> layout and features. The brand name is a placeholder.

## What the site does

- **Home:** opening sequence, shader-gradient hero, pinned horizontal gallery of featured work,
  velocity-reactive marquee, an interactive constellation of technologies and projects, the
  engagement process, and a contact call to action.
- **Work:** a grid of tilting project cards with stack tags, each expanding into its case study.
- **Case studies:** the problem, what was built, the stack, results, links and media, generated
  statically from one typed file.
- **Contact:** an enquiry form with validation, spam protection and clear pending, success and
  error states, plus an optional booking link.

Features land phase by phase; see [Roadmap](#roadmap) for what is built today.

## Stack

| Area                | Choice                                                           |
| ------------------- | ---------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router, Cache Components), React 19, TypeScript  |
| Hosting             | Vercel; every page static, one server action for enquiries       |
| Styling             | Tailwind CSS 4 with design tokens as CSS custom properties       |
| Component motion    | Motion (`motion/react`)                                          |
| Scroll choreography | GSAP with ScrollTrigger and SplitText, Lenis smooth scrolling    |
| UI primitives       | shadcn/ui on Radix, restyled                                     |
| Validation          | Zod                                                              |
| Quality             | ESLint, Prettier, Vitest, Playwright with axe, GitHub Actions CI |

Why these choices: [ADR 0001](docs/adr/0001-stack-and-rendering.md) (stack and rendering) and
[ADR 0002](docs/adr/0002-motion-stack.md) (motion).

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```bash
git clone https://github.com/michael-fesselmeyer/showcase.git
cd showcase
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Development server                              |
| `npm run build`      | Production build                                |
| `npm run lint`       | ESLint                                          |
| `npm run typecheck`  | Generates route types, then runs `tsc`          |
| `npm run format`     | Prettier (with Tailwind class sorting)          |
| `npm test`           | Unit tests (Vitest)                             |
| `npm run test:e2e`   | End-to-end and accessibility tests (Playwright) |
| `npm run lighthouse` | Lighthouse CI against a production build        |

End-to-end tests run against a production build: run `npm run build` first. The first run also
needs a browser: `npx playwright install chromium`.

## Configuration

Everything an owner changes day to day is configuration, never a component edit.

- **`site.config.ts`:** brand name, wordmark, tagline and description; navigation; social links
  (GitHub, LinkedIn, X, Instagram, Bluesky, YouTube); and the booking link. Each link is
  `{ url, enabled }`, and only enabled ones render. All ship disabled.
- **`app/globals.css`:** design tokens. The brand accent is two colour stops, `--brand-from` and
  `--brand-to`; changing them re-themes the gradient, glows, links and focus rings.
- **`lib/fonts.ts`:** the display, text and mono typefaces. Swap a face here and every token picks
  it up.

### Adding a project

Projects live in `content/projects.ts`, one typed entry each, validated by a Zod schema in
`lib/projects-schema.ts`. An entry holds the slug, title, client, summary, year, role, stack
tags, links, media and the case-study sections (problem, what was built, highlights, results).
Adding an entry is all it takes: the work index, the case-study page (generated at build time),
the featured gallery (when `featured: true`) and the stack constellation all update from it.

- **Stack tags** come from `lib/stack.ts`, which also assigns each technology to a group (front
  end, back end, data, payments, testing, infrastructure). Add a technology there first.
- **Media** is either generated art (`{ kind: 'art', pattern, colors }`, used by the samples) or
  a screenshot (`{ kind: 'image', src, alt, width, height, previewVideo? }`) with an optional
  muted loop that plays on hover.
- **`sample: true`** labels a project as a sample everywhere it appears and disables its links.

### Enquiries

> **The enquiry form does not reach anyone yet.** Submissions are validated and then passed to
> `deliverEnquiry` in `lib/enquiry/deliver.ts`, whose only implementation logs a redacted
> summary on the server (no name, mailbox or message body). Plug in an email provider before
> launch.

- **Fields:** name, email, project type, budget range, timeline and project details, validated
  with Zod in a server action (`app/contact/actions.ts`). Errors come back per field, with the
  visitor's input intact.
- **Works without JavaScript:** choices are native radio buttons, native validation applies until
  the page hydrates, and the server action re-renders the page with errors or the confirmation.
- **Spam protection:** a hidden honeypot field and a minimum time between the form appearing and
  being sent. Both run only on otherwise valid submissions; suspected bots get a normal-looking
  success and nothing is delivered. Without JavaScript only the honeypot applies, because the
  timestamp is set in the browser.
- **Connecting a provider:** implement the `DeliverEnquiry` type (for example with Resend), point
  `deliverEnquiry` at it, and add the provider's key to `.env.local` and the host's settings.
  Nothing else changes.
- **Booking link:** set `booking.url` and `booking.enabled` in `site.config.ts` to show a "book a
  call" card next to the form.

### Environment variables

| Name                   | Required | Purpose                                                   |
| ---------------------- | -------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Absolute origin for metadata. Falls back to Vercel's URL. |

Secrets only ever live in `.env.local` (git-ignored) and the host's settings.

## Project structure

```
app/                 routes, root layout, global styles and tokens
components/layout/   header, footer, navigation, wordmark
components/ui/       restyled shadcn/ui primitives
lib/                 config schema, helpers, fonts, motion tokens
lib/enquiry/         enquiry schema, spam checks, delivery interface
docs/adr/            architecture decision records
components/contact/  enquiry form
components/home/     home page sections
components/motion/   opening sequence, reveals, cursor, magnetic, smooth scroll, grain
components/work/     project cards, media, art and stack tags
content/             typed project entries
e2e/                 Playwright tests and the axe helper
site.config.ts       brand, navigation and link toggles
```

## Accessibility and performance

**Accessibility**

- Full keyboard navigation with a skip link, visible focus states, semantic landmarks and
  sequential headings. Every interactive effect is a real control (the constellation's nodes are
  buttons and links), and focusing a project in the pinned gallery scrolls it into view.
- Automated WCAG 2.1 AA checks with axe in every end-to-end run, on every page and in the form's
  error state.
- Colour tokens are chosen for contrast on the dark theme (body and label text at least 4.5:1).
- `prefers-reduced-motion` gets a calm, complete site: no opening sequence, smooth scrolling,
  cursor effects or marquee movement; the gallery becomes a native scroll row and the
  constellation a grouped list.

**Performance**

Lighthouse CI runs on every pull request against a production build, on an emulated mid-range
phone with simulated throttling, and fails below 95 in any category (median of three runs). Last
local run: 99–100 for performance, accessibility, best practices and SEO on the home page, the work
index, a case study and the contact page.

- Every route is static, enforced by `ensureStatic = 'navigation'` in the root layout.
- The largest contentful element is always text. The hero shader loads after the page is idle,
  over a CSS gradient in the same colours, and is skipped entirely when WebGL is not hardware
  accelerated. It pauses off screen and when the tab is hidden.
- The opening sequence is CSS driven and never hides the headline from the first paint.
- Line reveals split text only as it nears the viewport. Only `transform` and `opacity` animate,
  and late-loading media has reserved space, so layout shift stays near zero.

See [ADR 0003](docs/adr/0003-performance-budget.md) for the reasoning.

## Deployment

The site runs on Vercel, linked to this repository: every push to `main` deploys to production,
and every pull request gets its own preview deployment. To set up a new copy:

1. Import the GitHub repository in Vercel. The framework (Next.js) and build command are detected
   automatically; Node.js 24 comes from `.nvmrc` and `engines`.
2. Optionally set `NEXT_PUBLIC_SITE_URL` to the final domain. Without it, metadata, the sitemap and
   Open Graph images use Vercel's production domain.
3. Before launch: replace the placeholder brand in `site.config.ts`, swap the sample projects in
   `content/projects.ts`, enable the social and booking links you want, and connect an email
   provider for enquiries (see [Enquiries](#enquiries)).
4. Add the custom domain in the Vercel project settings.

Open Graph images are generated at build time and fetch font subsets from Google Fonts; if that
fetch fails, the images fall back to the default font and the build still succeeds.

## Roadmap

1. **Foundation:** tooling, tokens, typography, layout, navigation, footer, config. ✅
2. **Motion system and hero:** Lenis and GSAP setup, reveal utilities, opening sequence, shader
   hero, custom cursor, magnetic buttons, film grain. ✅
3. **Work:** project data, pinned gallery, tilting cards, work index, case studies, page
   transitions. ✅
4. **Skills and marquee:** technology constellation with an accessible list, velocity marquee,
   process and about sections. ✅
5. **Intake:** contact page, enquiry form, server action, delivery interface, booking toggle. ✅
6. **Polish and launch:** metadata and Open Graph images, 404, accessibility and performance
   passes, Lighthouse CI, deployment notes. ✅
