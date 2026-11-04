/**
 * Cache tags for on-demand revalidation. A tag maps 1:1 to a CMS document
 * type, so a webhook for `_type: "project"` revalidates `content:project`.
 */
export const CONTENT_TYPES = [
  "siteSettings",
  "project",
  "research",
  "experience",
  "conference",
  "skill",
  "education",
  "hobby",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const contentTag = (type: ContentType) => `content:${type}` as const;

export function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && (CONTENT_TYPES as readonly string[]).includes(value);
}
