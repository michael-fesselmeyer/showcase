/**
 * Every technology a project can be tagged with, and the group it belongs to.
 * Projects reference these ids, and the skills constellation is derived from
 * them, so adding a tag here is all it takes to show a new technology.
 */

export const stackGroups = {
  frontend: 'Front end',
  backend: 'Back end',
  data: 'Data',
  payments: 'Payments',
  testing: 'Testing',
  infrastructure: 'Infrastructure',
} as const

export type StackGroup = keyof typeof stackGroups

export const stack = {
  nextjs: { label: 'Next.js', group: 'frontend' },
  react: { label: 'React', group: 'frontend' },
  'react-native': { label: 'React Native', group: 'frontend' },
  sveltekit: { label: 'SvelteKit', group: 'frontend' },
  astro: { label: 'Astro', group: 'frontend' },
  typescript: { label: 'TypeScript', group: 'frontend' },
  tailwind: { label: 'Tailwind CSS', group: 'frontend' },
  threejs: { label: 'Three.js', group: 'frontend' },

  nodejs: { label: 'Node.js', group: 'backend' },
  trpc: { label: 'tRPC', group: 'backend' },
  graphql: { label: 'GraphQL', group: 'backend' },
  websockets: { label: 'WebSockets', group: 'backend' },
  python: { label: 'Python', group: 'backend' },

  postgres: { label: 'PostgreSQL', group: 'data' },
  prisma: { label: 'Prisma', group: 'data' },
  drizzle: { label: 'Drizzle', group: 'data' },
  redis: { label: 'Redis', group: 'data' },
  sanity: { label: 'Sanity', group: 'data' },

  stripe: { label: 'Stripe', group: 'payments' },
  'shopify-storefront': { label: 'Shopify Storefront API', group: 'payments' },

  vitest: { label: 'Vitest', group: 'testing' },
  playwright: { label: 'Playwright', group: 'testing' },
  jest: { label: 'Jest', group: 'testing' },

  vercel: { label: 'Vercel', group: 'infrastructure' },
  aws: { label: 'AWS', group: 'infrastructure' },
  cloudflare: { label: 'Cloudflare Workers', group: 'infrastructure' },
  docker: { label: 'Docker', group: 'infrastructure' },
  'github-actions': { label: 'GitHub Actions', group: 'infrastructure' },
} as const satisfies Record<string, { label: string; group: StackGroup }>

export type StackId = keyof typeof stack

export const stackLabel = (id: StackId) => stack[id].label
export const stackGroupOf = (id: StackId): StackGroup => stack[id].group
