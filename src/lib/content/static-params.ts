/**
 * With Cache Components, `generateStaticParams` must return at least one
 * entry. Before any content exists we return a placeholder slug that the
 * page resolves to `notFound()`.
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

export function toSlugParams(items: { slug: string }[]): { slug: string }[] {
  const params = items.filter((i) => i.slug).map((i) => ({ slug: i.slug }));
  return params.length > 0 ? params : [{ slug: PLACEHOLDER_SLUG }];
}
