# Studio tools: product spec

> Record keeping, not advice: see the note in the [plan overview](README.md).

## Problem

The site takes project enquiries, but nothing happens to them: the form validates the submission
and logs a redacted line. Everything that follows an enquiry (talking to the lead, agreeing scope,
doing the work, logging time, splitting income with a partner, knowing what was earned and what is
owed in tax) would live in scattered notes and spreadsheets. Numbers kept in separate places stop
agreeing with each other, and nobody can say which one is right.

The studio tools give the owner one private place for that record, built so that the numbers
reconcile: profit, partner shares and tax totals are all read from the same ledger.

## Users

| User           | Stage    | What they do                                                                                                                                    |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**      | Now      | The only person who signs in. Full access to everything.                                                                                        |
| **Visitor**    | Now      | Uses the public site. Sending an enquiry creates a lead; nothing else.                                                                          |
| **Partner**    | Business | Someone with a share in an engagement or product. Later: a read-only view of their own statements. Until then they receive exported statements. |
| **Accountant** | Business | Receives an export pack. No sign-in planned.                                                                                                    |
| **Client**     | Business | Receives invoices and documents by email or PDF. A client portal is not planned.                                                                |

## Personal now, business later

The first releases serve one person tracking freelance work and side projects. The model is built
so that becoming a business changes data, not code.

| Concept          | Now (personal)                                        | Later (business)                                               |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| Legal entity     | One record: sole proprietor                           | A second record (for example an LLC) with its own books        |
| Owners           | The owner holds 100%                                  | Several parties with effective-dated shares                    |
| Partner deals    | None, or an occasional subcontractor paid a fixed fee | Profit share, revenue share, equity, each tied to an agreement |
| Users            | One                                                   | Read-only partner view                                         |
| Payments         | Recorded by hand                                      | Online payment of invoices through a payment provider          |
| Accounting basis | Cash                                                  | Accrual, if a professional recommends it                       |
| Authorisation    | Checked in application code on every query            | The same, plus database row-level security as a second layer   |
| Hosting          | Free plan (personal, non-commercial)                  | Revisit: see [hosting and free tiers](hosting-and-limits.md)   |

## Modules

Each module lists what it does, when it ships, and what is deliberately left out. Release numbers
match the [roadmap](roadmap.md).

### 1. Leads and pipeline (Release 1)

- Every valid enquiry from the contact form becomes a lead. The spam checks that exist today still
  run first, and a suspected bot still creates nothing.
- Leads can also be added by hand (a referral, a conversation), with a **source**.
- **Stages:** new, contacted, qualified, proposal sent, won, lost. Moving stage is one action and
  is recorded on the lead's timeline.
- **Notes** and a **timeline** of everything that happened to the lead.
- **Follow-ups:** a date and a note. Due and overdue follow-ups appear on the dashboard and in a
  daily digest email.
- **Win and loss reasons**, chosen from an editable list, so patterns show up over time.
- **Estimated value**, so the pipeline has a total.
- **Convert:** a won lead becomes a client and an engagement, linked back to the lead.
- **Notification:** a short email says a new enquiry arrived. It carries no name, address or
  message, only a link to the lead.

Left out: email sync, sending email from the tool, lead scoring, web analytics.

### 2. Clients and contacts (Release 1)

- People and organisations, with contact details, and the roles they hold: client, partner,
  contractor, vendor. One record can hold several roles.
- A client page shows its leads, engagements and (from Release 2) invoices and payments.

Left out: marketing lists, bulk import.

### 3. Engagements (Release 1)

- An engagement is a piece of work: for a **client**, on a **product** the owner builds for
  themselves, or **internal**.
- Scope summary, status (proposed, active, paused, done, cancelled), dates, billing model (fixed
  price, hourly, retainer, none) and budget.
- **Milestones** with due dates and, optionally, an amount.
- Links to outside documents until the document vault exists.

Later: **publish to showcase**, which would turn a finished engagement into a public case study so
`content/projects.ts` is no longer edited by hand. It is deferred because it changes how the public
pages get their content, and needs its own decision record.

### 4. Time and work log (Release 1)

- Entries: date, minutes, engagement, description, billable or not.
- The hourly rate is copied onto the entry when it is created (a **snapshot**), so changing a rate
  later never rewrites history.
- Weekly view, totals per engagement, CSV export.
- Entries become read-only once they are invoiced (Release 2).

Left out: a running timer in the first release (entries are typed in), screenshots, idle
detection.

### 5. Money (Release 2)

- **Expenses** with a category, an optional engagement, a business-use percentage and a receipt
  file.
- **Invoices** with lines (typed in, or pulled from unbilled time and milestones), numbered in
  sequence, printable to PDF from the browser.
- **Payments** recorded by hand against one or more invoices, including partial payments.
- **Profit** per engagement and overall, by period.
- **Owner draws and contributions**, kept apart from income and expenses.
- All of it posts to a **double-entry ledger**, the single source of truth. See
  [ADR 0007](../adr/0007-money-and-ledger.md).

Left out: bank feeds, card processing, payroll, sales tax, inventory, multiple currencies.

### 6. Documents (Release 2 for receipts, Release 3 for agreements)

- A private vault for receipts, signed agreements, statements of work and non-disclosure
  agreements, each linked to the record it supports.
- Files are private, downloaded only through an authorised request.

Left out: drafting proposals and contracts in the tool, electronic signatures, storing tax
identification forms or numbers (see [security](security.md): these stay offline).

### 7. Ownership and partners (Release 3)

- **Agreements:** who signed what, when it takes effect, the signed file.
- **Split terms** per engagement or product: fixed fee, hourly, share of profit, share of revenue,
  or equity. Each term has effective dates and points to its agreement. Terms are never edited;
  a change is a new term that supersedes the old one.
- **Allocation runs:** for a period, compute each party's share from the ledger and post it.
- **Payouts** to partners, and a **statement** per partner per period: opening balance, shares
  earned, payouts, closing balance.

Left out: vesting calculations (the schedule is recorded, not computed), capital accounts for a
multi-member company's tax return, anything that decides how a deal _should_ be structured.

### 8. Tax preparation (Release 4)

- Every income and expense account maps to a **tax category**. The categories and their form
  lines are data, seeded for a US sole proprietor (Schedule C) and editable.
- **Profit and loss by tax category** for any period.
- **Estimated-tax helper:** shows year-to-date net profit, the amount to set aside at rates the
  owner enters, and the quarterly due dates. It does not know tax law; the owner supplies the
  parameters.
- **Year-end summaries** per contractor and partner (total paid in the year), flagged when the
  total crosses a reporting threshold that is stored as a setting per tax year.
- **Export pack:** CSV files (ledger, categorised profit and loss, expenses with receipt
  references, payments to contractors) plus the receipts, as one download.
- **Period close:** lock a period so nothing in it changes after it has been exported.

Left out: filing, tax calculations beyond the helper's arithmetic, state-specific forms,
depreciation schedules.

### 9. Dashboard (grows with each release)

- Release 1: open leads by stage and their value, follow-ups due, hours this week, active
  engagements.
- Release 2: income, expenses and profit for the period; unpaid invoices by age.
- Release 3: amounts owed to partners.
- Release 4: next estimated-tax date and set-aside amount.

### 10. Cross-cutting

- **Audit log** of every change, from Foundations onward.
- **Full data export** at any time, in open formats.
- **Backups**, encrypted, described in [security](security.md).
- **Reminders** by daily digest.
- **No AI features are planned.** Any future one must be free to run and approved by the owner.

## Release 1: what "done" means

Release 1 is done when the owner can do all of this on the live site, on a phone, without touching
the database:

1. Sign in with GitHub or a passkey. Nobody else can.
2. See a new enquiry appear as a lead within a minute of it being sent, and get the notification.
3. Move the lead through stages, add notes, set a follow-up and see it listed when due.
4. Mark it won (with a reason), which creates the client and the engagement.
5. Add milestones and log time against the engagement.
6. See the dashboard reflect all of it.
7. Export everything as a file.

And when these hold:

- Every public page is still static, with Lighthouse at 95 or above on mobile.
- An automated test proves that each private page and action refuses a signed-out request.
- The repository contains no real data: fixtures and seeds are synthetic.

## Non-goals

- **Not tax, legal or accounting software of record.** It keeps organised records and exports
  them. It does not file, advise or guarantee correctness.
- **Not multi-tenant.** One workspace. The model has a workspace boundary so this could change,
  but nothing is built for other studios to sign up.
- **No client or public access** to private data.
- **No bank connections, payroll, sales tax or multi-currency.**
- **No sensitive identifiers.** No tax identification numbers, bank account numbers or card
  numbers are stored, ever.
- **Nothing that needs a paid plan** without the owner's explicit approval.
