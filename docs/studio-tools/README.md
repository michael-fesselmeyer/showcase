# Studio tools: plan

A private, owner-only area inside this site for running the studio: tracking leads, work
performed, partner ownership, profit and tax preparation. The public showcase stays exactly as it
is.

**Status:** plan only. Nothing here is built yet, and no production infrastructure (database, sign-in
provider, storage, environment variables) exists.

> **Record keeping, not advice.** Everything in this plan that touches tax, accounting or legal
> agreements describes how the tool _records and exports_ information. It is not tax, accounting or
> legal advice, the tool never files anything, and a qualified professional should confirm how the
> records are used.

## Documents

| Document                                        | What it answers                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| [Product spec](product-spec.md)                 | Who it is for, the modules, scope per release, non-goals, now versus later |
| [Architecture](architecture.md)                 | How a private dynamic area lives beside a fully static public site         |
| [Data model](data-model.md)                     | Entities, relations, how money and time are represented                    |
| [Security and privacy](security.md)             | Threat model, sign-in, authorisation, encryption, backups, what stays out  |
| [Hosting and free tiers](hosting-and-limits.md) | Every free-tier limit, and when the hosting plan needs revisiting          |
| [Roadmap](roadmap.md)                           | Phases, what "done" means for each, what only matters for a business       |
| [Backlog](backlog.md)                           | Proposed issues with acceptance criteria                                   |

Decisions with trade-offs are recorded as ADRs:

| ADR                                                    | Decision                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [0004](../adr/0004-private-area-beside-static-site.md) | Route groups scope the static contract to the public site     |
| [0005](../adr/0005-authentication.md)                  | Self-hosted sessions, GitHub sign-in plus passkeys, one owner |
| [0006](../adr/0006-database-and-orm.md)                | Postgres on Neon, Drizzle ORM, committed SQL migrations       |
| [0007](../adr/0007-money-and-ledger.md)                | Integer minor units and a double-entry ledger                 |
| [0008](../adr/0008-ownership-and-splits.md)            | Effective-dated split terms tied to signed agreements         |
| [0009](../adr/0009-file-storage.md)                    | Private object storage behind an adapter                      |

## The plan in one page

- **Who:** one owner today, tracking their own freelance work and side projects. Running it as a
  registered business with partners is a later stage that the data model already allows for.
- **Where:** `/studio`, in the same Next.js app. Public routes stay static and keep their Lighthouse
  budget; only `/studio` and the sign-in endpoints render per request.
- **Order of delivery:**
  1. **Foundations:** route split, database, sign-in, authorisation layer, audit log.
  2. **Release 1, pipeline and work:** enquiries become leads; clients; engagements; time log.
  3. **Release 2, money:** expenses with receipts, invoices, payments, profit, on a ledger.
  4. **Release 3, partners:** agreements, split terms, payouts, statements.
  5. **Release 4, tax preparation:** categorised reports, estimated-tax helper, export pack.
- **Rules that shape everything:**
  - The repository is public, so nothing depends on the code being secret. Business data lives in
    the database and private storage; secrets live in environment settings; fixtures are synthetic.
  - Every read and write is authorised on the server. A hidden URL is not a control.
  - Free services only. Each limit is written down, and features degrade before a limit is hit.
  - Owner-specific values (rates, split terms, tax categories, tax parameters, home state) are
    rows in the database, never constants in code.

## Decisions made

| Area              | Decision                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Jurisdiction      | United States, federal level. State details are a database setting, never in the repo     |
| Business entity   | Starts as a sole proprietor; the entity is a record, so a later LLC is new data, not code |
| Users             | Owner only. Roles exist in the model; a read-only partner view is a business-stage item   |
| Sign-in           | GitHub account (one allow-listed account) and passkeys; database-backed sessions          |
| Database          | Postgres on Neon's free plan, Drizzle ORM, SQL migrations in git                          |
| Money             | Integer minor units, one currency (USD) for now, double-entry ledger from Release 2       |
| Accounting basis  | Cash basis by default, stored per entity; accrual is a later posting rule, not a rewrite  |
| Partner deals     | Fixed fee, hourly, profit share, revenue share and equity are all representable           |
| Payments          | Recorded by hand. Online payments are a business-stage item                               |
| Accountant export | CSV pack (plus printable reports); no accounting-software integration planned             |
| New enquiries     | Saved as a lead, plus a short notification email with no enquiry content                  |
| Files             | Private object storage, arriving with Release 2 (receipts)                                |
| Hosting           | Stays on the free plan while use is personal; see the triggers in hosting and free tiers  |

## Open questions

These do not block Foundations or Release 1.

1. **Custom domain.** Passkeys and the GitHub sign-in callback are bound to the site's domain.
   Moving to a custom domain later means registering passkeys again. Decide the domain before
   production sign-in is set up, if possible.
2. **Accounting method.** Cash basis is the planned default for a sole proprietor. Confirm with a
   tax professional before Release 2 posts its first entry.
3. **Chart of accounts.** The seed chart in the [data model](data-model.md) is a starting point.
   A professional may prefer different accounts or categories.
4. **Partner terms.** No partner deal exists yet. The first real agreement should be reviewed
   against what [ADR 0008](../adr/0008-ownership-and-splits.md) can represent.
5. **Notification email provider.** Needs an account on a free plan and an API key in the host's
   settings. Not created until the owner approves it.
6. **Hosting plan.** The free plan is for personal, non-commercial use. See the triggers in
   [hosting and free tiers](hosting-and-limits.md); the choice at that point is the owner's.
7. **Lead retention.** How long lost or stale leads are kept before they are deleted. Planned
   default: 24 months, as a setting.
8. **Publishing case studies from the tool.** Deferred until the private area has real
   engagements; it needs its own decision because it touches the public static pages.
