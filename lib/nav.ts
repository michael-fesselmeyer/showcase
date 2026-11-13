/**
 * True when `href` points at the current page. In-page section links
 * (`/#about`) are never marked current; nested pages mark their parent
 * (`/work/some-project` marks `/work`).
 */
export function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
