/** The nav href that owns `pathname`: an exact match, else the longest href that prefixes it. */
export function activeHref(pathname: string | null, hrefs: string[]): string | null {
  if (!pathname) return null;
  let best: string | null = null;
  for (const h of hrefs) {
    if ((pathname === h || pathname.startsWith(h + '/')) && (!best || h.length > best.length)) best = h;
  }
  return best;
}
