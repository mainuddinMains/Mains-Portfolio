import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

let client: SanityClient | undefined;

/**
 * Read-only client for published content. Uses the CDN and the "published"
 * perspective, so drafts are never shown on the public site.
 *
 * Created lazily: `createClient` throws without a projectId, and the app
 * must still build when Sanity is not configured.
 */
export function getSanityClient(): SanityClient {
  client ??= createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
    // Optional: only needed when the dataset is private.
    token: process.env.SANITY_API_READ_TOKEN || undefined,
  });
  return client;
}
