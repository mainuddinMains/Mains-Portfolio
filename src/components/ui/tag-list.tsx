export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}
