# Studio tools: proposed backlog

Proposed issues for Foundations and Release 1, each small enough for one short pull request, with
acceptance criteria. Later releases are listed as outlines and will be broken down when their turn
comes. Each issue below is tracked on GitHub, linked beside its title.

Conventions:

- Ids here (`F-01`) are for this document only; the linked number is the GitHub issue, which is
  where progress is tracked. The checkboxes here are not updated as work lands.
- **Labels:** an area (`foundations`, `auth`, `leads`, `clients`, `engagements`, `time`,
  `dashboard`, `ops`), plus `schema` on anything that adds a migration. Only one `schema` pull
  request is in review at a time.
- **Every issue** also requires: tests for the change, docs updated where the change makes them
  stale, synthetic data only, and CI green including the unchanged Lighthouse budgets.
- **Owner's OK** marks issues that create production infrastructure or accounts. They are built
  and tested locally first and wait for approval before touching production.

## Phase 0: Foundations

### F-01 Split the app into public and private route groups ([#11](https://github.com/michael-fesselmeyer/showcase/issues/11))

Labels: `foundations`. Depends on: nothing. This is the spike for
[ADR 0004](../adr/0004-private-area-beside-static-site.md).

- [ ] Public routes live under `app/(site)`; every public URL is unchanged.
- [ ] `ensureStatic = 'navigation'` is exported from `app/(site)/layout.tsx` and no longer from the
      root layout.
- [ ] The build output lists every public route as static.
- [ ] Unknown URLs and unknown project slugs still return 404 with the designed page.
- [ ] End-to-end tests and Lighthouse CI pass with no change to a threshold or a test's intent.
- [ ] If the approach has to change, ADR 0004 is updated in the same pull request.

### F-02 Guard the boundary between public and private code ([#12](https://github.com/michael-fesselmeyer/showcase/issues/12))

Labels: `foundations`. Depends on: F-01.

- [ ] A unit test fails when a page or route handler exists outside `(site)`, `(studio)` or `api`.
- [ ] A lint rule fails when code under `app/(site)` or the public component folders imports from
      `lib/studio` or `db`.
- [ ] Both are demonstrated failing in the pull request description, then fixed.

### F-03 Add the private area switch ([#13](https://github.com/michael-fesselmeyer/showcase/issues/13))

Labels: `foundations`. Depends on: F-01.

- [ ] With `STUDIO_ENABLED` unset, every path under `/studio` and `/api/auth` returns 404.
- [ ] `.env.example` lists the name with a comment; the README's environment table is updated.
- [ ] A test covers both states.

### F-04 Database tooling ([#14](https://github.com/michael-fesselmeyer/showcase/issues/14))

Labels: `foundations`, `schema`. Depends on: nothing.

- [ ] Drizzle and the Postgres driver are installed with pinned versions; `db/` holds the client
      and an empty schema.
- [ ] `npm run db:generate` and `npm run db:migrate` exist and are documented.
- [ ] A test helper starts an in-process Postgres with all migrations applied, and one sample test
      uses it.
- [ ] CI fails when the schema and the committed migrations disagree.
- [ ] No public route's bundle changes size.

### F-05 Local database setup ([#15](https://github.com/michael-fesselmeyer/showcase/issues/15))

Labels: `foundations`. Depends on: F-04.

- [ ] A script creates a local database named after the current branch.
- [ ] The README explains local setup, including one database and one port per working copy.
- [ ] A seed script loads synthetic data only (`example.test` addresses, invented companies).

### F-06 Workspace, entity and membership tables ([#16](https://github.com/michael-fesselmeyer/showcase/issues/16))

Labels: `foundations`, `schema`. Depends on: F-04.

- [ ] Tables `workspace`, `entity`, `membership` and `setting` exist with the constraints in the
      [data model](data-model.md).
- [ ] The seed creates one workspace and one sole-proprietor entity with invented names.
- [ ] Tests cover the constraints (for example, a membership without a workspace is rejected).

### F-07 Sign in with GitHub, owner only ([#17](https://github.com/michael-fesselmeyer/showcase/issues/17))

Labels: `auth`, `schema`. Depends on: F-03, F-06. **Owner's OK** for the production OAuth
application.

- [ ] Signing in with the allow-listed account creates a session and reaches `/studio`.
- [ ] Signing in with any other account is refused and creates no user row; a test proves it.
- [ ] The session cookie is `HttpOnly`, `Secure` and `SameSite=Lax`; a test asserts the flags.
- [ ] Signing out deletes the session row.
- [ ] Sign-ins and refusals are rate limited.

### F-08 Passkeys ([#18](https://github.com/michael-fesselmeyer/showcase/issues/18))

Labels: `auth`, `schema`. Depends on: F-07.

- [ ] A signed-in owner can register, name and remove passkeys.
- [ ] A registered passkey signs in without GitHub.
- [ ] A passkey cannot be registered without a session; a test proves it.

### F-09 The data access layer and `requireOwner()` ([#19](https://github.com/michael-fesselmeyer/showcase/issues/19))

Labels: `auth`. Depends on: F-07.

- [ ] `requireOwner()` returns the user and workspace, or throws for a missing session or a role
      other than `owner`.
- [ ] DAL modules are marked `server-only`; a lint rule forbids importing the database client
      anywhere else except `lib/intake`.
- [ ] A generated test calls every exported DAL function without a session and expects a refusal,
      and fails when a new function is added without that behaviour.

### F-10 Audit log ([#20](https://github.com/michael-fesselmeyer/showcase/issues/20))

Labels: `foundations`, `schema`. Depends on: F-06.

- [ ] An `audit_event` table and a helper that writes an event inside the caller's transaction.
- [ ] A trigger rejects updates and deletes; a test proves both are refused.
- [ ] A test proves that rolling back a change also rolls back its event.
- [ ] Sign-in, refused sign-in and sign-out are recorded.

### F-11 The studio shell ([#21](https://github.com/michael-fesselmeyer/showcase/issues/21))

Labels: `foundations`. Depends on: F-07, F-09.

- [ ] `/studio` shows a layout with navigation and an empty dashboard; `/studio/sign-in` shows the
      sign-in page.
- [ ] A signed-out request to any private page redirects to sign-in.
- [ ] Private responses send `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`;
      `robots.ts` disallows `/studio`; the sitemap does not list it.
- [ ] The shell works at phone and desktop widths, with a keyboard, and passes axe.
- [ ] It uses the site's design tokens and loads none of the public site's motion libraries.

### F-12 Security headers for private routes ([#22](https://github.com/michael-fesselmeyer/showcase/issues/22))

Labels: `auth`. Depends on: F-11.

- [ ] Private routes send a content security policy, `frame-ancestors 'none'`, a strict referrer
      policy and `nosniff`.
- [ ] Public routes' headers and Lighthouse scores are unchanged.
- [ ] An end-to-end test asserts the headers.

### F-13 Sessions page and step-up ([#23](https://github.com/michael-fesselmeyer/showcase/issues/23))

Labels: `auth`. Depends on: F-08, F-10.

- [ ] The owner can list active sessions and revoke any of them.
- [ ] Revoking sessions and removing a passkey require a recent verification.
- [ ] Each is recorded in the audit log.

### F-14 End-to-end tests for the private area ([#24](https://github.com/michael-fesselmeyer/showcase/issues/24))

Labels: `foundations`. Depends on: F-11.

- [ ] CI runs Playwright against a build with a migrated database and synthetic seed data.
- [ ] Tests sign in through a test-only helper that cannot be enabled in production; a test proves
      the helper is absent from a production build.
- [ ] A smoke test covers sign-in, the dashboard and sign-out.

### F-15 Repository protections ([#25](https://github.com/michael-fesselmeyer/showcase/issues/25))

Labels: `ops`. Depends on: nothing. **Owner's OK** (repository settings).

- [x] `main` requires the CI and hygiene checks, an up-to-date branch, and allows rebase merges
      only. Done as a repository ruleset; see the [security model](security.md#repository-controls).
- [ ] Dependency alerts and security updates are enabled.
- [ ] The optional blocked-terms secret for the hygiene check is set, or the decision not to use
      it is recorded.

### F-16 Production setup ([#26](https://github.com/michael-fesselmeyer/showcase/issues/26))

Labels: `ops`. Depends on: F-01 to F-14. **Owner's OK** for each step.

- [ ] A database project exists on the free plan; migrations are applied.
- [ ] The OAuth application and production environment variables are created; nothing is echoed
      or committed.
- [ ] The checklist in the [security model](security.md) is complete.
- [ ] The owner signs in on the live site, and a second account is refused.

## Phase 1: Pipeline and work (Release 1)

### People and organisations

**C-01 Party tables ([#27](https://github.com/michael-fesselmeyer/showcase/issues/27)).** Labels: `clients`, `schema`. Depends on: F-06.

- [ ] `party`, `party_role` and `contact_point` exist with their constraints.
- [ ] DAL functions create, read, update and archive a party, scoped to the workspace.
- [ ] A test proves a party in another workspace cannot be read by id.

**C-02 Clients and contacts screens ([#28](https://github.com/michael-fesselmeyer/showcase/issues/28)).** Labels: `clients`. Depends on: C-01, F-11.

- [ ] List with search, a detail page, create and edit forms with per-field errors.
- [ ] Archiving hides a party from lists without breaking records that refer to it.
- [ ] Every change writes an audit event.

### Leads

**L-01 Lead tables ([#29](https://github.com/michael-fesselmeyer/showcase/issues/29)).** Labels: `leads`, `schema`. Depends on: C-01.

- [ ] `lead`, `lead_event` and `outcome_reason` exist; the stage list and the "closed leads need
      a reason" rule are check constraints.
- [ ] `lead_event` is append-only, enforced by a trigger.
- [ ] `intake_key` is unique.

**L-02 Enquiries become leads ([#30](https://github.com/michael-fesselmeyer/showcase/issues/30)).** Labels: `leads`. Depends on: L-01, F-03.

- [ ] A valid enquiry creates one lead and one "created" event in a single transaction.
- [ ] Sending the same submission twice creates one lead; a test proves it.
- [ ] A suspected bot still creates nothing and still sees a normal success.
- [ ] With the private area off, delivery falls back to the redacted log line.
- [ ] The contact page is still static, and its Lighthouse scores are unchanged.

**L-03 Protect the intake ([#31](https://github.com/michael-fesselmeyer/showcase/issues/31)).** Labels: `leads`, `schema`. Depends on: L-02.

- [ ] A per-sender limit and an overall daily cap, stored in the database with salted hashes and
      no raw addresses.
- [ ] Over a limit, the visitor still sees success, nothing is written, and a redacted line is
      logged.
- [ ] Tests cover under, at and over each limit.

**L-04 Say what happens to an enquiry ([#32](https://github.com/michael-fesselmeyer/showcase/issues/32)).** Labels: `leads`. Depends on: L-02.

- [ ] The contact page states that enquiries are stored, for what purpose and for how long.
- [ ] The retention period comes from one place and matches the retention job (O-04).

**L-05 Leads list and pipeline board ([#33](https://github.com/michael-fesselmeyer/showcase/issues/33)).** Labels: `leads`. Depends on: L-01, F-11.

- [ ] A list with filters (stage, source) and a board grouped by stage with a value total each.
- [ ] Moving a lead to another stage works by keyboard and by pointer, and writes a timeline
      event.
- [ ] Empty, loading and error states exist; the page passes axe.

**L-06 Lead detail, notes and timeline ([#34](https://github.com/michael-fesselmeyer/showcase/issues/34)).** Labels: `leads`. Depends on: L-05.

- [ ] The detail page shows the enquiry, the contact, the stage and the timeline.
- [ ] Notes can be added; they appear on the timeline and cannot be edited afterwards.
- [ ] Estimated value can be set and feeds the board totals.

**L-07 Follow-ups ([#35](https://github.com/michael-fesselmeyer/showcase/issues/35)).** Labels: `leads`. Depends on: L-06.

- [ ] A follow-up date and note can be set, changed and marked done.
- [ ] A "due" view lists today's and overdue follow-ups, oldest first.

**L-08 Add a lead by hand ([#36](https://github.com/michael-fesselmeyer/showcase/issues/36)).** Labels: `leads`. Depends on: L-05.

- [ ] A form creates a lead with a source other than the contact form, linked to a new or
      existing party.

**L-09 Win, lose and convert ([#37](https://github.com/michael-fesselmeyer/showcase/issues/37)).** Labels: `leads`. Depends on: L-06, E-01.

- [ ] Marking a lead won or lost requires a reason from an editable list.
- [ ] Winning offers to create the client role and an engagement, pre-filled, in one transaction.
- [ ] The engagement links back to the lead.

**L-10 Notify the owner of a new enquiry ([#38](https://github.com/michael-fesselmeyer/showcase/issues/38)).** Labels: `leads`, `schema`. Depends on: L-02.
**Owner's OK** for the email provider account.

- [ ] Creating a lead inserts an outbox row in the same transaction.
- [ ] After the commit the notification is sent and the row marked sent; a failed send leaves it
      for retry and never fails the enquiry.
- [ ] The email contains no name, address or message, only a link.
- [ ] The provider sits behind an interface, with a fake for tests and a log-only default.

### Engagements and time

**E-01 Engagement and milestone tables ([#39](https://github.com/michael-fesselmeyer/showcase/issues/39)).** Labels: `engagements`, `schema`. Depends on: C-01.

- [ ] `engagement`, `milestone` and `engagement_link` exist; a client engagement requires a
      client.
- [ ] DAL functions are scoped to the workspace, with tests.

**E-02 Engagement screens ([#40](https://github.com/michael-fesselmeyer/showcase/issues/40)).** Labels: `engagements`. Depends on: E-01, F-11.

- [ ] List with status filter; detail page; create and edit with per-field errors.
- [ ] Status changes are recorded in the audit log.

**E-03 Milestones ([#41](https://github.com/michael-fesselmeyer/showcase/issues/41)).** Labels: `engagements`. Depends on: E-02.

- [ ] Milestones can be added, reordered, completed and given an optional amount.
- [ ] Upcoming and overdue milestones are visible on the engagement.

**T-01 Time entry table and the money module ([#42](https://github.com/michael-fesselmeyer/showcase/issues/42)).** Labels: `time`, `schema`. Depends on: E-01.

- [ ] A `Money` module covers creation, addition, multiplication by a rate and formatting, with
      integer minor units only; property-based tests cover its arithmetic.
- [ ] `time_entry` exists; minutes are positive; the rate is copied onto the entry when created.
- [ ] A test proves that changing a default rate does not change existing entries.

**T-02 Log time ([#43](https://github.com/michael-fesselmeyer/showcase/issues/43)).** Labels: `time`. Depends on: T-01, E-02.

- [ ] A quick-add form (date, engagement, duration, note, billable) that is comfortable on a
      phone.
- [ ] A weekly view with totals per day and per engagement.
- [ ] Entries can be edited and deleted until invoiced.

**T-03 Rates and time export ([#44](https://github.com/michael-fesselmeyer/showcase/issues/44)).** Labels: `time`. Depends on: T-02.

- [ ] Default and per-engagement rates are stored as effective-dated settings, not constants.
- [ ] Time entries for a date range export as CSV.

### Dashboard and operations

**D-01 Dashboard ([#45](https://github.com/michael-fesselmeyer/showcase/issues/45)).** Labels: `dashboard`. Depends on: L-07, E-03, T-02.

- [ ] Shows open leads and value by stage, follow-ups due, hours this week and active
      engagements.
- [ ] Loads its data in parallel, in a handful of queries; skeletons hold the layout.

**O-01 Scheduled job endpoint ([#46](https://github.com/michael-fesselmeyer/showcase/issues/46)).** Labels: `ops`. Depends on: F-03.

- [ ] A route handler runs the daily jobs, refuses requests without the secret, and is safe to
      call twice.
- [ ] Each job's outcome is logged without personal data.

**O-02 Daily digest ([#47](https://github.com/michael-fesselmeyer/showcase/issues/47)).** Labels: `ops`. Depends on: O-01, L-07, L-10.

- [ ] One email a day listing counts of follow-ups due and unsent notifications, with links; no
      personal content.
- [ ] No email is sent when there is nothing to report.

**O-03 Export everything ([#48](https://github.com/michael-fesselmeyer/showcase/issues/48)).** Labels: `ops`. Depends on: D-01.

- [ ] One action downloads every table as CSV and JSON in a single archive.
- [ ] It requires a recent verification and writes an audit event.
- [ ] An encrypted variant can be restored by a documented script; the restore is tested.

**O-04 Lead retention ([#49](https://github.com/michael-fesselmeyer/showcase/issues/49)).** Labels: `ops`. Depends on: O-01, L-04.

- [ ] The daily job deletes closed leads older than the retention setting, with their contact
      details.
- [ ] The audit event for a deletion holds no personal data.

**O-05 Free-tier usage on the dashboard ([#50](https://github.com/michael-fesselmeyer/showcase/issues/50)).** Labels: `ops`. Depends on: D-01.

- [ ] Shows database size against the plan's limit, with a warning at 70%.
- [ ] The limits come from one module that links to
      [hosting and free tiers](hosting-and-limits.md).

## Later releases: outlines

Broken into issues when each release starts.

**Release 2, money**

- File storage adapter, upload and authorised download; usage tracking.
- Scheduled encrypted backup to private storage, with pruning and a restore rehearsal.
- Chart of accounts with seed; account management screen.
- Ledger core: tables, balance and append-only triggers, idempotent posting, reversal;
  property-based tests.
- Posting rules for cash basis.
- Expenses with receipts and business-use percentage.
- Invoices: numbering, lines from time and milestones, print layout, statuses.
- Payments and allocations, including partial payments.
- Owner draws and contributions.
- Reports: profit and loss, profit per engagement, unpaid invoices by age.
- Dashboard money tiles.

**Release 3, partners**

- Agreements and the document vault.
- Split terms with effective dating and the 100% check.
- Allocation runs, with the rounding rule and idempotency.
- Payouts, partner statements, statement export.
- Dashboard: amounts owed.

**Release 4, tax preparation**

- Tax categories with seed data; account mapping screen.
- Profit and loss by tax category.
- Tax parameters per year as settings; estimated-tax helper; due-date reminders in the digest.
- Year-end summaries per contractor and partner, with the reporting threshold as a setting.
- Export pack.
- Period close and lock.
