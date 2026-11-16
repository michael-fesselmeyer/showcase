# Studio tools: security and privacy

The repository is public. The design assumes an attacker has read every line of it, knows every
route, table and check, and still gets nothing.

## Principles

1. **No security through obscurity.** Nothing is protected by being unlinked, unlisted or
   unguessable. The private area is at a documented URL.
2. **Authorise next to the data, on every call.** Not in the layout, not in the browser.
3. **Collect less.** The safest record is the one that was never stored.
4. **Secrets never touch git.** Real values exist only in `.env.local` and the host's encrypted
   settings.
5. **Defence in depth.** Each control assumes the one before it failed.

## What is being protected

| Asset                                             | Why it matters                                  |
| ------------------------------------------------- | ----------------------------------------------- |
| Contact details and messages of leads and clients | Other people's personal data                    |
| Financial records: income, expenses, invoices     | Private, and the basis of tax records           |
| Partner terms and signed agreements               | Confidential between the parties                |
| Receipts and documents                            | May show addresses, account fragments           |
| The owner's session and sign-in methods           | The key to all of the above                     |
| Secrets: database URL, signing secret, API keys   | Each one bypasses the application entirely      |
| Integrity of the ledger and audit log             | Records are only useful if they are trustworthy |

## Threat model

| Threat                                                              | Control                                                                                                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Someone opens `/studio` or calls a server action without signing in | Every DAL function calls `requireOwner()`; tests generated from the function list prove each one refuses                                  |
| Someone else signs in with their own GitHub account                 | Only one account id is allow-listed; any other is rejected before a user row is created                                                   |
| A stolen session cookie                                             | `HttpOnly`, `Secure`, `SameSite=Lax`, host-only cookie; sessions are database rows with an expiry and can be revoked from the tool        |
| Phishing of sign-in credentials                                     | No password exists. Passkeys are bound to the site's domain and cannot be replayed elsewhere                                              |
| Cross-site request forgery                                          | `SameSite` cookies, origin checks on server actions and auth endpoints, no state changes on GET                                           |
| Cross-site scripting                                                | React escapes output; no raw HTML from stored data; a content security policy on private routes; uploaded files are never rendered inline |
| SQL injection                                                       | Parameterised queries only, through the query builder                                                                                     |
| Guessing another record's id                                        | Every query filters by workspace as well as id; ids are random                                                                            |
| Private data served from a shared cache                             | No shared caching of private data; `Cache-Control: private, no-store` on private responses                                                |
| A script floods the contact form to fill the database               | Honeypot and timing checks, per-sender rate limit, a daily cap, size limits, graceful fallback                                            |
| A malicious upload                                                  | Type allow-list checked by content, size limit, random storage key, download-only responses                                               |
| A secret committed by mistake                                       | Secret scanning and push protection on the repository; `.env*` ignored; `.env.example` holds names only                                   |
| Real data committed in a fixture or screenshot                      | Synthetic-only rule in `AGENTS.md`; hygiene check on every pull request                                                                   |
| A preview deployment exposes production data                        | Previews have no database and no private area                                                                                             |
| A compromised dependency                                            | Pinned versions and a lockfile; few dependencies; dependency alerts                                                                       |
| Data loss: a bad migration, a deleted project, a provider outage    | Encrypted backups held with a second provider, plus an owner-held copy; restore is rehearsed                                              |
| The ledger or audit log is altered                                  | Append-only tables enforced by database triggers; corrections are new entries                                                             |
| The hosting or database account is taken over                       | Two-factor authentication on GitHub, the host and the database provider; this is outside the code and on the launch checklist             |

Out of scope: an attacker with access to the owner's unlocked device or accounts, and
vulnerabilities in the hosting, database or sign-in providers themselves.

## Authentication

Decision and alternatives: [ADR 0005](../adr/0005-authentication.md).

- **Two ways in, no password.**
  - _GitHub sign-in_ using OAuth: GitHub confirms who the person is and returns their account id.
    Only the id stored in `STUDIO_OWNER_GITHUB_ID` is accepted. The numeric id is used, not the
    username or email address, because the id never changes and the others can.
  - _Passkeys_ (WebAuthn): a key pair held by the owner's device and unlocked with a fingerprint,
    face or PIN. The site stores only the public key. A passkey can only be added by someone who
    is already signed in.
- **No sign-up.** Creating a user is refused for everyone except the allow-listed account's first
  sign-in.
- **Sessions are rows in the database**, not self-contained tokens. A stateless token (a JWT)
  cannot be revoked before it expires; a session row can be deleted, which ends that session at
  once. The cost is one indexed lookup per request, which is negligible here.
- **Sign-in attempts are rate limited** and recorded in the audit log.
- **Step-up for sensitive actions** (a full export, revoking sessions, removing a passkey): the
  session must have been verified recently, or the owner confirms with a passkey again.

## Authorisation

- **Role check:** `requireOwner()` loads the session, the user and the membership, and throws
  unless the role is `owner`. It is the first line of every DAL function.
- **Row-level authorisation:** every query filters on `workspace_id` taken from the session, never
  from the request. A record is looked up by `(workspace_id, id)`, so a valid id from another
  workspace finds nothing. This is the defence against insecure direct object references.
- **Server actions are treated as public endpoints.** Each validates its input with Zod and calls
  the DAL; none trusts that the page which normally calls it did any checking.
- **Return only what the screen needs.** DAL functions return plain objects with chosen fields, so
  a column added later cannot leak through a page that never meant to show it.
- **Later, a second layer:** when a second kind of user exists (a partner viewing their own
  statements), Postgres row-level security policies will enforce the same workspace and party
  rules inside the database, so a missed filter in application code still returns nothing. It is
  deferred because, with a single owner, it adds a transaction-scoped setting to every request for
  no extra protection. Every table already carries the columns the policies need.

## Data minimisation

The tool deliberately does **not** store:

- tax identification numbers (personal or business), or completed tax forms that contain them;
- bank account or routing numbers, card numbers;
- passwords (there are none);
- raw sender addresses for rate limiting (only a salted hash, discarded after its window);
- enquiry content in logs or notification emails.

Where a record needs to say such a document exists (for example, that a contractor's tax form is
on file), it stores a yes/no and a date, and the document stays offline.

Leads are other people's personal data. The contact page will say what happens to an enquiry and
how long it is kept, and a retention job deletes leads past the period set by the owner.

## Encryption

- **In transit:** HTTPS everywhere; database connections require TLS.
- **At rest:** the database and the file store encrypt their storage. That protects against
  someone obtaining the provider's disks, not against someone who has the application's
  credentials, which is why the credentials are the real secret.
- **Backups** are encrypted by the application before they leave it, with a key held only in the
  host's settings and in the owner's password manager. A backup file is useless without the key.
- **Field-level encryption** is not planned, because the fields that would need it are not stored.

## Audit log

An append-only `audit_event` table records who did what and when: the actor, the action, the
record's type and id, a summary of the change, and the time.

- It is written **in the same transaction** as the change it describes. Either both happen or
  neither does, so the log can never claim something that was rolled back, or miss something that
  was committed.
- A database trigger rejects updates and deletes on the table.
- Events hold ids and field names, not personal content, so the log can outlive a deleted lead.
- Sign-ins, failed sign-ins, exports and session revocations are recorded too.

## Backups and recovery

The free database plan keeps only a few hours of history, so backups are the application's job.

- **Daily (from Release 2):** a scheduled job exports every table to a single file, encrypts it,
  and stores it in private file storage, which is a different provider from the database. The last
  14 daily and 12 monthly files are kept. Until file storage exists, the owner downloads an
  encrypted backup by hand.
- **Monthly:** the owner downloads a backup and keeps it off-line.
- **On demand:** "Export everything" produces the same data in open formats (CSV and JSON), so
  the records never depend on this tool continuing to exist.
- **Restore is rehearsed:** a script restores a backup into an empty local database and checks
  row counts and ledger balances. An untested backup is a hope, not a backup.

## What never enters git

- Real names, email addresses, phone numbers, addresses, schedules.
- Real client, lead, partner or financial data, in any form: fixtures, seeds, screenshots, test
  snapshots, examples in docs.
- The owner's rates, partner terms, tax category choices, tax parameters or home state.
- Secrets of any kind, including in URLs and CI logs.
- Database dumps and backup files.

Fixtures and seeds use invented companies and `example.test` addresses.

## Repository controls

| Control                                                                                                                                                               | State                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Secret scanning                                                                                                                                                       | Enabled                                             |
| Push protection for secrets                                                                                                                                           | Enabled                                             |
| Pull request hygiene check                                                                                                                                            | Enabled; the optional blocked-terms list is not set |
| Rules on `main`: changes only through a pull request, merged by rebase, with the branch up to date and the CI and hygiene checks passing; no force pushes or deletion | Enabled, as a repository ruleset with no bypass     |
| Dependency alerts and security updates                                                                                                                                | Not yet enabled: on the backlog                     |

## Before production sign-in is switched on

A checklist for the owner, tracked as a backlog issue:

- [ ] Two-factor authentication on the GitHub, hosting and database accounts.
- [ ] Production secrets generated fresh, stored only in the host's settings.
- [ ] `STUDIO_ENABLED` set in production only.
- [ ] The authorisation test suite and end-to-end tests are green.
- [ ] A backup has been taken and restored once.
- [ ] The contact page states how enquiries are stored and for how long.
