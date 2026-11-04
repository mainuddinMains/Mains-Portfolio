import type { Research, ResearchStatus } from "@/domain/content";
import { ContentCard } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";

export const researchStatusLabel: Record<ResearchStatus, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  "under-review": "Under review",
  published: "Published",
};

export function ResearchGrid({ items }: { items: Research[] }) {
  if (items.length === 0) return <EmptyState message="No research published yet." />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((r) => (
        <ContentCard
          key={r.id}
          href={`/research/${r.slug}`}
          title={r.title}
          summary={r.summary}
          meta={researchStatusLabel[r.status]}
          tags={r.areas}
          image={r.coverImage}
        />
      ))}
    </div>
  );
}
