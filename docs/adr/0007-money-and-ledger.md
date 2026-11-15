# ADR 0007: Money and the ledger

- Status: accepted
- Date: 2026-11-15

> This records how the tool keeps its books. It is not accounting advice; a professional should
> confirm the method and the chart of accounts before real records depend on them.

## Context

The tool will report profit, what partners are owed, and totals for tax preparation. If each is
computed from its own table (invoices here, expenses there, payouts somewhere else), they will
eventually disagree and nothing will say which is right. Money also has to be represented so that
arithmetic is exact.

## Decision

### Representing money

- **Integer minor units.** An amount is a whole number of cents in a `bigint`, with a currency
  code beside it. Binary floating point cannot represent most decimal fractions (0.1 + 0.2 is not
  0.3), and errors accumulate across thousands of additions.
- **One currency, USD**, for now. The currency column exists so adding others is not a migration
  of every table.
- **Percentages are basis points** (10,000 is 100%); **quantities are thousandths**.
- **Rounding happens once, at a defined point,** and never loses a cent. When an amount is divided
  between parties, each gets the rounded-down share and the leftover cents go to the largest
  remainders, so the parts always add up to the whole.
- A small `Money` module holds all arithmetic. Nothing else adds, multiplies or formats amounts.

### Double-entry ledger

- **Every financial event is a journal entry made of lines that sum to zero.** A line is a debit
  (positive) or a credit (negative) against an account. Because each entry balances, the whole
  ledger balances, and money cannot appear or vanish: it only moves between accounts.
- **Accounts** form a chart with five types: asset, liability, equity, income, expense.
- **Each line can carry an engagement and a party.** Profit per engagement and the balance owed to
  each partner are then sums over the same lines that produce the overall profit and loss, so they
  reconcile by construction.
- **The ledger is the source of truth.** Invoices, expenses, payments and payouts are documents
  that _cause_ entries; reports read the ledger, never the documents.
- **Append-only.** A posted entry is never changed or deleted. A mistake is fixed by posting a
  reversing entry and then a correct one, so the history shows what was believed at each point.
  Database triggers reject updates and deletes, and reject an entry whose lines do not balance.
- **Idempotent posting.** Each entry has an idempotency key derived from the event that caused it
  (for example `payment:<id>`), unique per entity. Posting the same event twice, after a retry or
  a double click, creates one entry.
- **Period locks.** Once a period is closed, nothing can be posted on or before its end date.
- **Posting rules live in one module** that maps a business event to its entry.

### Accounting basis

- **Cash basis by default**, stored on the entity. Income is recorded when money is received and
  expenses when they are paid. On cash basis, issuing an invoice posts nothing: the invoice table
  is the record of what is owed, and the payment posts the income.
- **Accrual is a second set of posting rules**, selected by the entity's setting, in which issuing
  an invoice posts a receivable. Switching is a decision for the owner with a professional; the
  model does not change.

### Examples (cash basis)

| Event                                 | Debit                  | Credit                  |
| ------------------------------------- | ---------------------- | ----------------------- |
| Client pays an invoice of 1,000.00    | Bank 1,000.00          | Service income 1,000.00 |
| Software subscription paid, 20.00     | Software 20.00         | Bank 20.00              |
| Partner's 25% share of profit accrues | Contract labour 245.00 | Partner payable 245.00  |
| Partner is paid                       | Partner payable 245.00 | Bank 245.00             |
| Owner takes money out                 | Owner draws 500.00     | Bank 500.00             |

An owner's draw is not an expense: it moves equity, and does not reduce profit.

## Alternatives considered

- **Single-entry (a list of income and expenses):** enough for a simple profit figure, and much
  less to build. But there is nowhere to record what is owed to a partner or set aside for tax,
  and no built-in check that the numbers are complete.
- **Computing reports from the document tables:** no ledger at all. Works until a partial payment,
  a refund or a correction arrives, each of which then needs special handling in every report.
- **Decimal types end to end:** exact in the database, but JavaScript has no decimal type, so
  values would cross the boundary as strings or lose precision as numbers. Integers avoid the
  problem.
- **An accounting service or library:** hosted accounting products have monthly fees, and the
  ledger is a few tables and one module.
- **Accrual from the start:** more complete, but it forces receivables and timing concepts onto a
  sole proprietor's records before they are needed.

## Consequences

- More to build than a list of transactions, and every money feature has to state its posting
  rule. In return, one invariant (debits equal credits) guards every report.
- Property-based tests can attack the invariants with random data: any sequence of events must
  leave the ledger balanced, and any split must add up to the amount split.
- Corrections are visible as reversals, never silent edits.
- Reports are sums over journal lines; at this volume, a plain indexed query is enough.
- Cash-basis books do not show receivables in the ledger; unpaid invoices are reported from the
  invoice table.
