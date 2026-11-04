export function EmptyState({ message = "Nothing here yet." }: { message?: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted">
      {message}
    </p>
  );
}
