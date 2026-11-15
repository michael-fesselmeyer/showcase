# Studio tools: roadmap

Steady, incremental delivery: small pull requests, each one leaving `main` working and the public
site untouched. Phases are ordered so that each is useful on its own and the hardest part (the
ledger) is built on a base that is already in daily use.

**Stage** says who a phase is for: **Personal** is useful to one person tracking their own work
today; **Business** only matters once the studio is run as a business with partners or paying
clients.

| Phase                            | Stage    | Outcome                                                                    |
| -------------------------------- | -------- | -------------------------------------------------------------------------- |
| 0. Foundations                   | Personal | A signed-in owner sees an empty private area; the public site is unchanged |
| 1. Pipeline and work (Release 1) | Personal | Enquiries become leads; clients, engagements and time are tracked          |
| 2. Money (Release 2)             | Personal | Expenses, invoices, payments and profit, on a double-entry ledger          |
| 3. Partners (Release 3)          | Mixed    | Agreements, split terms, payouts and statements                            |
| 4. Tax preparation (Release 4)   | Personal | Categorised reports, estimated-tax helper, export pack, period close       |
| 5. Showcase publishing           | Personal | A finished engagement becomes a public case study                          |
| 6. Business stage                | Business | Online payments, partner sign-in, a second legal entity, accrual           |

## Phase 0: Foundations

No visible features. This phase carries the risk, so it goes first and in small pieces.

- Split the app into the public and private route groups and move the static contract onto the
  public group ([ADR 0004](../adr/0004-private-area-beside-static-site.md)). The first pull
  request is a spike that proves the public output, the 404 page and the Lighthouse scores are
  unchanged.
- Database tooling: schema, migrations, an in-process Postgres for tests, a CI check that schema
  and migrations agree.
- Sign-in with GitHub and passkeys, restricted to the owner.
- The data access layer with `requireOwner()`, and the generated authorisation tests.
- Audit log.
- The studio shell: layout, navigation, sign-in page, security headers, no indexing.
- The `STUDIO_ENABLED` switch, so previews and unconfigured environments have no private area.

**Done when:** on a local machine, the owner signs in and reaches an empty dashboard; a
signed-out request to any private page or action is refused, and a test proves it; every public
page is still static with unchanged Lighthouse scores.

**Needs the owner's approval before it reaches production:** creating the database project, the
GitHub OAuth application and the production environment variables. Everything is built and tested
locally first.

## Phase 1: Pipeline and work (Release 1)

- Enquiry to lead, with idempotency, rate limiting and the notification email.
- Leads: list, pipeline board, detail page with notes and timeline, follow-ups, win and loss
  reasons, manual entry, conversion to a client and an engagement.
- Clients and contacts.
- Engagements with milestones.
- Time log with rate snapshots and CSV export.
- Dashboard: pipeline by stage, follow-ups due, hours this week, active engagements.
- Daily digest email.
- Full data export, including an encrypted backup the owner downloads. The scheduled daily backup
  starts in Phase 2, when private file storage exists to hold it.
- A privacy note on the contact page.

**Done when:** the list in the [product spec](product-spec.md#release-1-what-done-means) holds on
the live site.

## Phase 2: Money (Release 2)

- Private file storage and receipt upload ([ADR 0009](../adr/0009-file-storage.md)).
- Chart of accounts and the ledger core: balanced entries, append-only, idempotent posting,
  reversal ([ADR 0007](../adr/0007-money-and-ledger.md)).
- Expenses with receipts.
- Invoices from time and milestones, printable.
- Payments recorded by hand, with partial payments.
- Owner draws and contributions.
- Reports: profit and loss by period, profit per engagement, unpaid invoices by age.

**Done when:** every amount on every report can be traced to journal lines, the ledger's debits
equal its credits, and a property-based test has tried to break both with random inputs.

Expenses come first within this phase: they are useful before the first invoice exists.

## Phase 3: Partners (Release 3)

- Agreements and the document vault.
- Split terms with effective dates ([ADR 0008](../adr/0008-ownership-and-splits.md)).
- Allocation runs that post each party's share.
- Payouts and per-partner statements.

**Stage:** paying a subcontractor a fixed fee or an hourly rate is useful straight away
(Personal). Profit share, revenue share and equity only matter once there is a real partner
agreement (Business); they are built in the same phase because they share the model.

**Done when:** for a sample engagement with two parties and a change of terms mid-period, the
statement totals equal the ledger balances to the cent.

## Phase 4: Tax preparation (Release 4)

- Tax categories as data, with the seed mapping for a US sole proprietor.
- Profit and loss by tax category.
- Estimated-tax helper driven by parameters the owner enters.
- Year-end summaries per contractor and partner.
- Export pack: CSV files and receipts in one download.
- Period close.

**Done when:** the export pack for a sample year reconciles to the ledger, and a closed period
rejects every attempt to post into it.

This phase is record keeping and exports. It does not file anything or give advice.

## Phase 5: Showcase publishing

Turn a finished engagement into a public case study, so `content/projects.ts` is no longer edited
by hand. It needs its own decision record first, because it changes where public pages get their
content: they must remain static, must still build when the database is asleep or unreachable, and
must only ever show what the owner explicitly published.

## Phase 6: Business stage

Each item is separate, and none is started without a decision by the owner.

| Item                               | What it brings in                                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A second legal entity              | A new `entity` row with its own books; opening balances; reports per entity                                                  |
| Online payment of invoices         | A payment provider's hosted checkout; webhooks verified by signature and made idempotent by event id; commercial-use hosting |
| Partner sign-in                    | The `partner_viewer` role; row-level security in the database as a second layer                                              |
| Accrual accounting                 | A posting rule at invoice issue; receivables in the ledger                                                                   |
| Proposals and electronic signature | Document generation; a signing provider                                                                                      |
| Multiple currencies                | Exchange rates per entry; gains and losses                                                                                   |
| Hosting plan                       | See [hosting and free tiers](hosting-and-limits.md)                                                                          |

## Order within a phase

- One schema change is in review at a time, so migrations never race.
- Each pull request updates the docs it makes stale, including this roadmap's phase status.
- A missed performance budget on a public page is a bug fixed in the same pull request.
- Production infrastructure is created only with the owner's approval.
