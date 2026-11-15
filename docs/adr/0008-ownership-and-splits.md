# ADR 0008: Ownership and revenue-share terms

- Status: accepted
- Date: 2026-11-15

> This records how the tool represents deals between parties. It is not legal or tax advice. How a
> deal should be structured, and what it means for the people in it, is a question for a
> professional and for the written agreement itself.

## Context

Some work is done alone, some with a subcontractor, and some may later be done with a partner who
shares in a project's income or owns part of a product. The forms differ: a fixed fee, an hourly
rate, a share of profit, a share of revenue, or equity. Terms change over time, and a statement
for last year must still be computed under last year's terms. Today there are no partner deals at
all, so the model has to cost nothing until one exists.

## Decision

- **A split term attaches a party to an engagement** (client work or a product) with a **basis**:
  `fixed_fee`, `hourly`, `profit_share`, `revenue_share` or `equity`, and the numbers that basis
  needs (an amount, a rate, or a share in basis points).
- **The owner's own entity is a party too.** For share-based terms, the shares in force on any
  date must total 100%, which the database checks. With no partner, the owner's entity holds 100%
  and nothing else is needed.
- **Terms are effective-dated and never edited.** A change closes the old term and adds a new one
  that points to the term it supersedes. Any past period can be recomputed exactly as it was.
- **Every term points to an agreement record** with its signing parties, dates and the signed
  file. A term without a signed agreement can be saved as a draft but cannot be used in an
  allocation.
- **Profit is defined by the term, from the ledger.** A profit-share term names which expense
  accounts count against the engagement's income, so "profit" means what the agreement says, and
  is computed from journal lines tagged with that engagement.
- **Allocation runs.** For an engagement and a period, a run reads the ledger, applies the terms
  in priority order (fixed fees and hourly amounts first, then shares of what remains), rounds so
  that the parts add up exactly ([ADR 0007](0007-money-and-ledger.md)), and posts one journal
  entry crediting each party's payable. The run stores its inputs and the terms it used, and its
  idempotency key makes running it twice harmless.
- **Payouts** debit the party's payable. A **statement** is that party's payable account for a
  period: opening balance, shares earned, payouts, closing balance.
- **Equity** in a product is recorded as a share with effective dates and, if the agreement has
  one, a vesting schedule kept as dates and text. The tool records it; it does not compute
  vesting.

## Alternatives considered

- **A percentage column on the engagement:** enough for "we split it evenly", but it cannot
  express a fixed fee, a change of terms, or more than two parties, and it overwrites history.
- **Ownership at the level of the whole business only:** matches a company's cap table, but most
  early deals are per project.
- **Computing shares on the fly in reports, without posting them:** simpler, but the amount owed
  to a partner would change retroactively whenever an old expense was corrected, and there would
  be no record of what was agreed at the time a statement was sent.
- **Separate models for subcontractors and partners:** they differ in basis, not in shape. One
  model keeps payouts and statements identical for both.

## Consequences

- Subcontractors (fixed fee, hourly) and partners (shares) use the same tables, runs and
  statements.
- Statements reconcile to the ledger by construction, because they are ledger balances.
- The model can represent revenue share, but representing a deal is not endorsing it: under a
  revenue share a party is paid before costs, so the other can carry a loss on the same work.
- How a partner's share is classified in the accounts (a cost of the work, or a distribution of
  profit) depends on the legal relationship and is the owner's and a professional's call. The
  account a term posts to is therefore a setting on the term.
- Sharing profit with someone can itself create a legal relationship with tax filings of its own.
  The tool flags share-based terms that have no signed agreement; it does not judge the
  arrangement.
- Vesting, capital accounts and company-level equity are deliberately left as records, not
  computations.
