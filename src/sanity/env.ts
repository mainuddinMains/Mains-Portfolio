/**
 * Sanity environment configuration.
 *
 * Public values (NEXT_PUBLIC_*) are safe to expose: the project id and
 * dataset are not secrets. Tokens are read only on the server and are never
 * prefixed with NEXT_PUBLIC_.
 *
 * Missing values do NOT throw: the app falls back to placeholder content so
 * it can run and build before Sanity is set up.
 */

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Sanity project ids are lowercase alphanumerics (plus dashes). */
export function isValidProjectId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id);
}

export const isSanityConfigured = isValidProjectId(projectId);
