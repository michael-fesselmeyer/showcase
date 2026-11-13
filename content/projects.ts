import type { Project } from '@/lib/projects-schema'

/**
 * Every project on the site. Cards, the featured gallery, case-study pages
 * and the skills constellation are all generated from this list, so adding a
 * project is a matter of adding an entry here.
 *
 * All entries below are SAMPLES with invented clients and figures. They are
 * labelled as samples wherever they appear. Replace them with real projects.
 */
export const projects: Project[] = [
  {
    slug: 'tidewater-clinics',
    title: 'Tidewater Clinics',
    client: 'Tidewater Physio (sample)',
    summary:
      'Online booking and payments for a group of physiotherapy clinics, replacing phone queues with a two-minute flow.',
    year: 2026,
    role: 'Design and full-stack build',
    sample: true,
    featured: true,
    stack: [
      'nextjs',
      'typescript',
      'tailwind',
      'postgres',
      'prisma',
      'stripe',
      'playwright',
      'vercel',
    ],
    links: {
      live: 'https://tidewater.example.test',
      repo: 'https://code.example.test/tidewater-clinics',
    },
    media: { kind: 'art', pattern: 'orbits', colors: ['#2ec4b6', '#3a86ff'] },
    caseStudy: {
      problem: [
        'Five clinics took every booking by phone. Reception spent most mornings on hold queues, and roughly one appointment in eight was a no-show with no deposit to cover it.',
        'Patients wanted to book after work, when the phones were off. The clinics needed availability to stay correct across therapists who split their week between sites.',
      ],
      built: [
        'A booking flow that finds the next suitable slot across all five clinics in three steps, with deposits taken at booking and refunded automatically on time-compliant cancellations.',
        'Behind it, a schedule model that treats each therapist’s week as rules plus exceptions, so a sick day or a moved shift updates every clinic at once. Staff manage it from a small admin with an audit log.',
      ],
      highlights: [
        {
          title: 'No double bookings',
          body: 'Slots are reserved inside a database transaction with a short hold, so two patients can never pay for the same appointment.',
        },
        {
          title: 'Deposits without friction',
          body: 'Card details are saved once with the patient’s consent; repeat bookings take one tap.',
        },
        {
          title: 'Tested end to end',
          body: 'Every booking path, including failed payments and cancellations, runs in Playwright against a seeded database on each pull request.',
        },
      ],
      results: [
        { value: '64%', label: 'of bookings now made online' },
        { value: '−71%', label: 'no-shows after deposits' },
        { value: '2 min', label: 'median time to book' },
      ],
    },
  },
  {
    slug: 'fernhill-coffee',
    title: 'Fernhill Coffee',
    client: 'Fernhill Roasters (sample)',
    summary:
      'A headless storefront for a specialty roaster: editorial product stories, subscriptions and a checkout that loads instantly.',
    year: 2026,
    role: 'Front-end lead',
    sample: true,
    featured: true,
    stack: ['nextjs', 'typescript', 'tailwind', 'shopify-storefront', 'sanity', 'vitest', 'vercel'],
    links: {
      live: 'https://fernhill.example.test',
      repo: 'https://code.example.test/fernhill-coffee',
    },
    media: { kind: 'art', pattern: 'waves', colors: ['#ffb347', '#ff6b3d'] },
    caseStudy: {
      problem: [
        'The roaster’s template store looked like every other coffee shop and took over five seconds to show a product on a phone. Their story, the farms they buy from, lived in a separate blog nobody found.',
      ],
      built: [
        'A storefront where each coffee is an editorial page: origin, producer, tasting notes and brewing guides, written in a CMS and stitched to live stock and pricing from the commerce platform.',
        'Product pages are static and revalidated when stock or copy changes, so they load from the edge while staying accurate.',
      ],
      highlights: [
        {
          title: 'Content and commerce, one page',
          body: 'Editors write in the CMS; prices, variants and stock come from the store. Neither team waits on the other.',
        },
        {
          title: 'Subscriptions that flex',
          body: 'Customers skip, swap or pause a delivery from the account page without emailing support.',
        },
        {
          title: 'Fast on a phone',
          body: 'Images are sized per device and the cart is the only client-side state on product pages.',
        },
      ],
      results: [
        { value: '0.9 s', label: 'largest contentful paint on mobile' },
        { value: '+38%', label: 'conversion rate' },
        { value: '3×', label: 'subscription sign-ups' },
      ],
    },
  },
  {
    slug: 'ledgerline',
    title: 'Ledgerline',
    client: 'Ledgerline (sample)',
    summary:
      'A cash-flow dashboard for small agencies that turns invoices, payroll and project budgets into one forecast.',
    year: 2025,
    role: 'Full-stack build and architecture',
    sample: true,
    featured: true,
    stack: [
      'react',
      'typescript',
      'trpc',
      'nodejs',
      'postgres',
      'drizzle',
      'redis',
      'vitest',
      'docker',
      'aws',
    ],
    links: {
      live: 'https://ledgerline.example.test',
      repo: 'https://code.example.test/ledgerline',
    },
    media: { kind: 'art', pattern: 'bars', colors: ['#7b5cff', '#ff2e93'] },
    caseStudy: {
      problem: [
        'Agency owners ran their cash flow from spreadsheets exported from three tools. By the time a forecast was assembled it was already a week old, and late invoices showed up as surprises.',
      ],
      built: [
        'A dashboard that syncs invoices, payroll runs and project budgets overnight, then projects the next twelve weeks of cash with the assumptions spelled out.',
        'Type-safe end to end: the API contract is shared between server and client, so a renamed field fails the build, not the dashboard.',
      ],
      highlights: [
        {
          title: 'Forecasts you can question',
          body: 'Every projected figure links to the invoices and assumptions behind it.',
        },
        {
          title: 'Quick on large ledgers',
          body: 'Aggregates are cached and invalidated by the sync job, so the dashboard opens in under a second for five years of data.',
        },
        {
          title: 'What-if scenarios',
          body: 'Owners model a new hire or a lost client and see the runway change live.',
        },
      ],
      results: [
        { value: '6 h', label: 'saved per month on reporting' },
        { value: '12 wks', label: 'rolling cash forecast' },
        { value: '<1 s', label: 'dashboard load, five years of data' },
      ],
    },
  },
  {
    slug: 'kiteboard',
    title: 'Kiteboard',
    client: 'Kiteboard (sample)',
    summary:
      'A real-time whiteboard for remote workshops, with live cursors, sticky notes and voting that stays in sync for fifty people.',
    year: 2025,
    role: 'Real-time engineering',
    sample: true,
    featured: true,
    stack: ['sveltekit', 'typescript', 'websockets', 'cloudflare', 'redis', 'playwright'],
    links: {
      live: 'https://kiteboard.example.test',
      repo: 'https://code.example.test/kiteboard',
    },
    media: { kind: 'art', pattern: 'grid', colors: ['#00d4a3', '#c6ff3d'] },
    caseStudy: {
      problem: [
        'Workshop facilitators were juggling a video call, a whiteboard tool and a voting tool. Boards lagged once more than twenty people joined, and votes were counted by hand.',
      ],
      built: [
        'A board where every change is an operation broadcast over WebSockets from a single coordinating instance per room, so everyone sees the same state within a frame or two.',
        'Facilitators run timed rounds, hide or reveal notes and run dot votes that tally themselves.',
      ],
      highlights: [
        {
          title: 'One source of truth per room',
          body: 'Each board is owned by one edge instance, which orders operations and resolves conflicts.',
        },
        {
          title: 'Survives bad Wi-Fi',
          body: 'Clients queue changes while offline and replay them on reconnect.',
        },
        {
          title: 'Load tested',
          body: 'Automated sessions with fifty simulated participants run before every release.',
        },
      ],
      results: [
        { value: '50+', label: 'participants per board' },
        { value: '~40 ms', label: 'median sync latency' },
        { value: '1 tool', label: 'instead of three per workshop' },
      ],
    },
  },
  {
    slug: 'mosaic-museum-guide',
    title: 'Mosaic Museum Guide',
    client: 'City Mosaic Museum (sample)',
    summary:
      'A visitor guide that works offline in the galleries, with 3D views of the collection’s most fragile pieces.',
    year: 2024,
    role: 'Design and front-end build',
    sample: true,
    featured: false,
    stack: ['astro', 'typescript', 'sanity', 'threejs', 'github-actions'],
    links: {
      live: 'https://mosaic.example.test',
      repo: 'https://code.example.test/mosaic-museum-guide',
    },
    media: { kind: 'art', pattern: 'rings', colors: ['#ff4d6d', '#ffd166'] },
    caseStudy: {
      problem: [
        'The museum’s printed guide was out of date within months, and signal inside the stone galleries was unreliable.',
      ],
      built: [
        'A static guide that installs itself on a visitor’s phone and works offline, with curator-written stops published from a CMS and 3D models of pieces too fragile to display.',
      ],
      highlights: [
        {
          title: 'Offline first',
          body: 'The whole tour downloads on the entrance Wi-Fi; nothing depends on signal after that.',
        },
        {
          title: 'Light 3D',
          body: 'Models are compressed and loaded only when a visitor opens a piece.',
        },
      ],
      results: [
        { value: '41%', label: 'of visitors used the guide' },
        { value: '0', label: 'print runs since launch' },
        { value: '4.7/5', label: 'visitor rating' },
      ],
    },
  },
  {
    slug: 'ridgeway-fitness',
    title: 'Ridgeway Fitness',
    client: 'Ridgeway Gyms (sample)',
    summary:
      'A members’ app for a regional gym chain: class booking, waitlists and memberships, on iOS and Android from one codebase.',
    year: 2024,
    role: 'Mobile and API build',
    sample: true,
    featured: false,
    stack: ['react-native', 'typescript', 'graphql', 'nodejs', 'postgres', 'stripe', 'jest', 'aws'],
    links: {
      live: 'https://ridgeway.example.test',
      repo: 'https://code.example.test/ridgeway-fitness',
    },
    media: { kind: 'art', pattern: 'blocks', colors: ['#4cc9f0', '#b5179e'] },
    caseStudy: {
      problem: [
        'Popular classes filled within minutes and members found out they had missed a waitlist spot hours later.',
      ],
      built: [
        'A members’ app with live class availability, instant waitlist promotion by push notification, and membership management backed by recurring payments.',
      ],
      highlights: [
        {
          title: 'Fair waitlists',
          body: 'Promotions happen in order, with a short window to accept before the next member is offered the spot.',
        },
        {
          title: 'One codebase',
          body: 'iOS and Android share almost all of their code and ship on the same day.',
        },
      ],
      results: [
        { value: '92%', label: 'of class spots now filled' },
        { value: '18k', label: 'monthly active members' },
        { value: '4.8★', label: 'average store rating' },
      ],
    },
  },
]
