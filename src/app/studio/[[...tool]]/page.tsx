import { NextStudio } from "next-sanity/studio";
import { isSanityConfigured } from "@/sanity/env";
import config from "../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

/**
 * Embedded Sanity Studio. Authentication is handled by Sanity: only users
 * invited to the project (sanity.io/manage → Members) can log in and edit.
 */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-semibold">Sanity Studio is not configured</h1>
        <p className="mt-4 text-muted">
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code>{" "}
          in <code>.env.local</code> (see <code>.env.example</code>), then restart the dev server.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
