"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";

/** Shown when a page fails to render, for example when the content source is unreachable. */
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-muted">This content could not be loaded. Please try again.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-lg border border-border px-4 py-2 text-sm hover:border-foreground/30"
      >
        Try again
      </button>
    </Container>
  );
}
