# Studio tools: hosting and free tiers

Everything the studio tools use must be free to run. This page records each provider's limit, what
the tool does as it nears one, and the point at which the hosting plan itself needs another look.

Figures were read from each provider's own pages on **2026-11-15**. Providers change them; check
the linked page before relying on a number, and update this table in the same pull request that
adds or changes a provider.

## Free-tier budget

| Service               | Used for                                       | Free limit                                                                                                                               | As the limit nears                                                                                                                                  |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon (Postgres)       | All business data                              | 1 GB storage per project; 100 compute-hours a month; compute sleeps after 5 minutes idle; about 6 hours of restore history; 10 branches  | Dashboard shows database size; warn at 70%; the contact form's daily cap stops a flood; no write fails silently                                     |
| Vercel, Hobby plan    | Hosting, functions                             | 1,000,000 function invocations a month; 4 hours of active CPU; 100 GB data transfer; 100 deployments a day; runtime logs kept for 1 hour | Public pages are static and use no function time; private use by one person is far below the limits                                                 |
| Vercel scheduled jobs | Digest, retries, backups, retention            | Once a day at most on the free plan, within an hour of the set time                                                                      | Every job is designed to run daily; nothing needs finer timing                                                                                      |
| Vercel Blob (private) | Receipts, agreements, backups (from Release 2) | 1 GB storage; 10,000 simple and 2,000 advanced operations a month; 10 GB transfer. **Exceeding a limit blocks the store for 30 days**    | The tool totals file sizes from its own table; warns at 70% and refuses new uploads at 90%; images are downscaled before upload; backups are pruned |
| Resend                | Notification and digest email                  | 100 emails a day, 3,000 a month                                                                                                          | One email per enquiry and one digest a day; over a daily cap, enquiries are still saved and the digest reports them                                 |
| GitHub OAuth          | Sign-in                                        | Free                                                                                                                                     | n/a                                                                                                                                                 |
| GitHub Actions        | CI                                             | Free for public repositories                                                                                                             | n/a                                                                                                                                                 |

Sources: [Neon free plan limits](https://neon.com/faqs/free-plan-limits-and-quotas),
[Vercel Hobby plan](https://vercel.com/docs/plans/hobby),
[Vercel cron usage](https://vercel.com/docs/cron-jobs/usage-and-pricing),
[Vercel Blob usage](https://vercel.com/docs/vercel-blob/usage-and-pricing),
[Resend quotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits).

Two consequences worth knowing:

- **The database sleeps.** After five idle minutes the first request waits for it to wake, a
  fraction of a second to a couple of seconds. Only private pages and the enquiry action touch the
  database, so no public page is affected. Private pages show a skeleton while it wakes.
- **Restore history is short.** Six hours of point-in-time recovery is a safety net for a bad
  migration, not a backup. Backups are described in [security](security.md).

## The hosting plan

The site is on Vercel's free Hobby plan.

**What the terms say.** Vercel's Terms of Service (section 4, last updated 2026-10-19) limit the
Hobby plan to "personal or non-commercial use", and allow Vercel to disable a Hobby project
without notice. Vercel's pricing page says the same in its FAQ. Vercel's published guidance has
described commercial use broadly: a deployment used for the financial gain of anyone involved in
making it, with examples such as requesting or processing payment from visitors, advertising the
sale of a product or service, and being paid to build or host the site. That detailed wording was
not on Vercel's documentation pages when checked, so the Terms of Service are the text that
governs, and borderline cases are a question for Vercel's support.

**Where the site stands today.** It carries a placeholder brand and sample projects, sells
nothing, takes no payments, and the private tools hold one person's own records. That is personal
use.

**When to revisit.** The plan needs another look at the _first_ of these, whichever comes first.
They are listed from earliest to latest, and the first is about the public site, not the private
tools:

1. **The public site starts advertising real paid services:** a real brand replaces the
   placeholder and enquiries are invitations to hire the studio. Under the broad reading above,
   this is already commercial use.
2. **The first paying client** whose work is found through, or managed with, this site.
3. **Online payments** are added, so the site itself requests or processes money.
4. **Anyone else gets a sign-in** (a partner viewing statements), making it a tool a business
   runs on.

**Options at that point.** None is chosen here; anything with a monthly bill needs the owner's
explicit approval.

| Option                        | Cost                                                   | Notes                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel Pro                    | 20 USD a month, with 20 USD of included usage          | No code changes. Removes the daily limit on scheduled jobs and raises every allowance                                                                                               |
| Netlify, free plan            | Free within a monthly credit allowance                 | Netlify states its free plan may be used for commercial projects. Needs a compatibility check for this Next.js version and its caching features, and a replacement for Blob storage |
| Cloudflare Workers, free plan | Free: 100,000 requests a day, 10 ms of CPU per request | Runs Next.js through an adapter; the CPU limit and feature support need a real test before relying on it. Check the terms for commercial use at the time                            |
| A small virtual server        | A few USD a month                                      | Full control, more upkeep: updates, TLS, backups                                                                                                                                    |
| Ask Vercel support            | Free                                                   | For a genuinely borderline stage, a written answer settles it                                                                                                                       |

The architecture keeps these open: the database is a standard Postgres connection string, file
storage and email sit behind small interfaces, and scheduled jobs are ordinary authenticated HTTP
endpoints that any scheduler can call. Moving hosts would mean replacing the storage adapter and
the scheduler, not the application.

The other providers' terms were not reviewed for commercial use, and their limits were judged
against one person's records. Revisit the whole table, terms included, at the same point.
