// The one place the base path is assembled.
//
// The site deploys under https://<owner>.github.io/<repo>/, so every internal
// URL carries a /<repo>/ prefix. The theme's own components (Card, Hero, the
// markdown pipeline) handle this for you; a hand-written <a href="/sessions/">
// in an .astro file does not, and the failure is invisible locally because
// `astro dev` and `astro preview` both serve at the root.
//
// This template ships no such helper, which is precisely how twelve links in
// SemesterSection.astro escaped the base on their first build. A rule I have
// to remember is weaker than a function with a test around it.
const BASE = import.meta.env.BASE_URL;

/** An internal page URL, base-prefixed, with the trailing slash Astro's
 *  directory output needs (asking for `/foo` makes Pages issue a redirect). */
export function route(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const base = BASE.endsWith("/") ? BASE : `${BASE}/`;
  return clean === "" ? base : `${base}${clean}/`;
}
