import { Container } from "@/components/ui/container";

/** Shown while a page that is not cached yet (for example newly published content) renders. */
export default function Loading() {
  return (
    <Container>
      <div role="status" aria-live="polite" className="animate-pulse space-y-4">
        <span className="sr-only">Loading…</span>
        <div className="h-9 w-2/3 rounded-lg bg-surface" />
        <div className="h-5 w-full max-w-3xl rounded bg-surface" />
        <div className="aspect-video w-full rounded-xl bg-surface" />
      </div>
    </Container>
  );
}
