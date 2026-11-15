# Studio tools: architecture

How a private, per-request area lives in the same Next.js app as a fully static public site,
without the public pages changing.

## The constraint

Today every route is static. The root layout exports `ensureStatic = 'navigation'`, which makes the
build fail if any route needs request-time rendering ([ADR 0003](../adr/0003-performance-budget.md)).
The private area is the opposite: every page depends on who is asking, so it must render per
request and must never be cached for anyone else.

Both have to be true at once, and the public half must stay provably static.

## Overview

```
                        ┌──────────────────────── one Next.js app ────────────────────────┐
 visitor ── CDN ───────▶│ app/(site)/…      static HTML, built once        ensureStatic   │
                        │   /  /work  /work/[slug]  /contact               = 'navigation' │
                        │        │                                                        │
                        │        └─ contact form ─ server action ─▶ lib/intake ──┐        │
                        │                                                        ▼        │
 owner ─── function ───▶│ app/(studio)/studio/…   rendered per request     ┌──────────┐   │
                        │   pages, server actions                          │ Postgres │   │
                        │        │                                         └──────────┘   │
                        │        ▼                                               ▲        │
                        │   lib/studio/dal  ── requireOwner() on every call ─────┘        │
                        │        │                                                        │
                        │        └────────────▶ private file storage (Release 2)          │
                        └─────────────────────────────────────────────────────────────────┘
```

## Route layout

Route groups (folders in parentheses) organise routes without changing URLs. The app is split into
two groups under one small root layout:

```
app/
├── layout.tsx                 root: <html>, <body>, fonts, tokens. No ensureStatic.
├── globals.css
├── not-found.tsx              the designed 404
├── icon.svg, apple-icon.tsx, opengraph-image.tsx, robots.ts, sitemap.ts
├── (site)/
│   ├── layout.tsx             header, footer, motion. ensureStatic = 'navigation'
│   ├── page.tsx               /
│   ├── work/…                 /work, /work/[slug]
│   └── contact/…              /contact
├── (studio)/
│   └── studio/
│       ├── layout.tsx         studio chrome. ensureStatic = false. Checks the session.
│       ├── sign-in/page.tsx
│       ├── page.tsx           dashboard
│       ├── leads/…  clients/…  engagements/…  time/…
│       └── …
└── api/
    ├── auth/[...all]/route.ts sign-in endpoints
    └── cron/…/route.ts        scheduled jobs, protected by a secret
```

### How the static contract is scoped

`ensureStatic` set on a layout applies to every route that renders that layout, and covers the
whole route, including layouts above it. A child can be stricter than its parent but never weaker.
That last rule is why the export cannot stay on the root layout: no route beneath it could ever be
dynamic.

So the export moves down one level:

- `app/(site)/layout.tsx` exports `ensureStatic = 'navigation'`. Every public route renders this
  layout, so every public route is still required to be completely static, exactly as today.
- `app/(studio)/studio/layout.tsx` exports `ensureStatic = false`, which states that these routes
  are not meant to be static and fails the build if anything beneath tries to set a static level.
- The root layout exports nothing. It holds only what both areas share and nothing that reads a
  request.

The public guarantee is kept by the build itself, not by convention. Two extra checks stop a route
from slipping out of the contract:

- A unit test walks `app/` and fails if a page or route handler sits outside `(site)`, `(studio)`
  or `api`.
- A lint rule stops public components importing anything from `lib/studio` or the database
  client, so private code can never end up in a public page's JavaScript.

Lighthouse CI keeps measuring the same four public URLs with the same thresholds. Private pages
are not in Lighthouse CI (they need a session), but they are covered by end-to-end and
accessibility tests against synthetic data.

The reasoning and the alternatives (two separate root layouts, a second app, a subdomain) are in
[ADR 0004](../adr/0004-private-area-beside-static-site.md).

### Rendering private pages

The app runs with Cache Components, where anything that reads the request (cookies, headers) or
uncached data must sit inside a `<Suspense>` boundary. Private pages follow one shape:

- The studio layout renders the frame (navigation, headings) and a `<Suspense>` boundary with a
  skeleton that holds the content's space.
- Inside it, the page reads the session and its data, per request.
- **Private data is never put in a shared cache.** No `use cache` on anything that reads business
  data. A cached entry is shared between requests; caching private data is how one person's data
  ends up on another person's screen. If caching is ever needed, it is the per-user private kind,
  decided case by case.
- Private responses send `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`, and
  `/studio` is disallowed in `robots.ts` and absent from the sitemap.

## Layers

```
app/(studio)/…            pages and server actions: parse input, call the DAL, render
lib/studio/dal/…          data access layer: authorise, query, return plain objects
lib/studio/domain/…       pure logic: money, splits, posting rules, validation schemas
lib/intake/…              the one public write path: enquiry → lead
db/schema/…               table definitions
drizzle/…                 generated SQL migrations
```

- **Pages and server actions** contain no SQL. A server action validates its input with Zod, calls
  one DAL function, and revalidates or redirects.
- **The data access layer (DAL)** is the only code that imports the database client, and it is
  marked `server-only` so it can never be bundled for the browser. Every exported function starts
  by establishing who is calling (`requireOwner()`), scopes its query to the caller's workspace,
  and returns a plain object with only the fields the screen needs (a data transfer object), never
  a raw row.
- **Domain logic** is pure functions with no database or framework imports: adding money, splitting
  an amount, building journal entries from a business event. This is where most unit tests live,
  because pure functions are cheap to test exhaustively.

Why a DAL rather than checking the session in the layout: a layout does not re-run on every
navigation, and a server action is a public HTTP endpoint that anyone can call with any arguments,
whether or not a page shows a button for it. Authorisation therefore has to sit next to the data,
on every call. The layout's check only decides whether to show the sign-in page.

## The public write path: enquiry to lead

The contact form is the only way an anonymous visitor writes to the system, so it gets the most
care.

```
form ─▶ server action ─▶ validate (Zod) ─▶ spam checks ─▶ rate limit ─▶ intake
                                                                          │
                              one transaction: insert lead + timeline ────┤
                              event + outbox row (idempotent by key)      │
                                                                          ▼
                                                    after commit: send notification
```

- **Same form, same static page.** The form already posts to a server action; only the
  implementation behind `deliverEnquiry` changes. The contact page stays static.
- **Idempotency.** The form sends a random submission key generated in the browser. The lead table
  has a unique index on it, and the insert ignores a conflict. A double click, a retry after a
  timeout, or a resubmitted page therefore creates one lead, not two. Without JavaScript the key is
  derived from the submission's content and a short time window.
- **Rate limiting.** A counter per salted hash of the sender's address, kept in the database,
  plus a daily cap on new leads overall. This protects the free database from being filled by a
  script. Over the cap, the form still succeeds for the visitor, the submission is logged in
  redacted form as it is today, and the owner is alerted.
- **Transactional outbox.** The notification is not sent inside the request's main path. The
  transaction that creates the lead also inserts an "outbox" row. After the commit, the row is
  sent and marked done; a daily job retries anything unsent. The lead can never exist without its
  notification being queued, and a failing email provider can never lose a lead.
- **Minimal notification.** The email says an enquiry arrived and links to it. It contains no
  name, address or message, so nothing personal sits in a mailbox or a provider's logs.
- **Fallback.** With no database configured (local development, preview deployments), delivery
  falls back to today's redacted log line.

## Scheduled work

The free hosting plan runs scheduled jobs at most once a day, at an imprecise time. That is enough
for everything planned:

- send the daily digest (follow-ups due, invoices overdue);
- retry unsent notifications;
- write an encrypted backup;
- delete leads past their retention period.

Each job is a route handler that checks a secret header before doing anything, is safe to run
twice (idempotent), and holds no state between runs. Because it is a plain HTTP endpoint, any
scheduler can call it, which keeps the app portable between hosts.

## Environments

| Environment | Database                                              | Sign-in             | Private area |
| ----------- | ----------------------------------------------------- | ------------------- | ------------ |
| Local       | Local Postgres, one database per worktree             | Seeded test session | On           |
| Tests       | In-process Postgres (PGlite), migrated fresh per file | Test helper         | On           |
| Preview     | None                                                  | None                | **Off**      |
| Production  | Neon                                                  | GitHub and passkeys | On           |

- **Preview deployments have no private area.** A preview URL is public and its domain differs
  per branch, so sign-in cannot work there and the production database must never be reachable
  from it. A single `STUDIO_ENABLED` setting, present only in production and local development,
  turns the area on; without it `/studio` and the sign-in endpoints return 404 and enquiries fall
  back to the log line.
- **Local development never touches production data.** Seeds are synthetic.

## Planned environment variables

Names only. Values live in `.env.local` and the host's encrypted settings, and `.env.example`
gains each name in the pull request that first uses it.

| Name                                       | Purpose                                      | From        |
| ------------------------------------------ | -------------------------------------------- | ----------- |
| `STUDIO_ENABLED`                           | Turns the private area on                    | Foundations |
| `DATABASE_URL`                             | Pooled Postgres connection for the app       | Foundations |
| `DATABASE_URL_UNPOOLED`                    | Direct connection for migrations             | Foundations |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`    | Session signing secret and the site's origin | Foundations |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | The sign-in OAuth application                | Foundations |
| `STUDIO_OWNER_GITHUB_ID`                   | The one account allowed to sign in           | Foundations |
| `CRON_SECRET`                              | Authenticates scheduled jobs                 | Release 1   |
| `RESEND_API_KEY`, `STUDIO_NOTIFY_TO`       | Notification email provider and recipient    | Release 1   |
| `RATE_LIMIT_SALT`                          | Salt for hashing sender addresses            | Release 1   |
| `BLOB_READ_WRITE_TOKEN`                    | Private file storage                         | Release 2   |
| `BACKUP_ENCRYPTION_KEY`                    | Encrypts backup files                        | Release 1   |

## New dependencies

All free and open source.

| Package                              | For                                           |
| ------------------------------------ | --------------------------------------------- |
| `drizzle-orm`, `drizzle-kit`         | Queries, schema and migrations                |
| `pg`                                 | Postgres driver                               |
| `@electric-sql/pglite`               | In-process Postgres for tests                 |
| `better-auth` and its passkey plugin | Sessions, GitHub sign-in, passkeys            |
| `server-only`                        | Build-time guard against bundling server code |
| `@vercel/blob` (Release 2)           | Private file storage, behind an adapter       |

None of them is imported by a public page, so the public bundles do not change.

## Testing

| Layer             | Tool                                  | What it proves                                                                   |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| Domain logic      | Vitest                                | Money arithmetic, split rounding, posting rules, validation                      |
| Data access layer | Vitest with PGlite                    | Queries, constraints, and that every function refuses a missing or wrong session |
| Migrations        | CI                                    | Schema and migrations agree; migrations apply to an empty database               |
| Private pages     | Playwright with axe                   | Signed-out requests are refused; key flows work on synthetic data; accessibility |
| Public pages      | Existing Playwright and Lighthouse CI | Unchanged: static, accessible, within budget                                     |

The authorisation tests are generated from the list of DAL functions, so adding a function without
a session check fails the suite instead of relying on someone remembering to write the test.

## Portability

Nothing in the domain or data layers depends on the host:

- the database is reached through a standard Postgres connection string;
- file storage sits behind a small `FileStore` interface;
- email sits behind the existing `DeliverEnquiry`-style interface;
- scheduled jobs are plain authenticated HTTP endpoints.

That keeps the options in [hosting and free tiers](hosting-and-limits.md) open.
