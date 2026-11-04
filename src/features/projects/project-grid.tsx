import type { Project } from "@/domain/content";
import { ContentCard } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateRange } from "@/lib/utils/date";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState message="No projects published yet." />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p) => (
        <ContentCard
          key={p.id}
          href={`/projects/${p.slug}`}
          title={p.title}
          summary={p.summary}
          meta={formatDateRange(p.startDate, p.endDate)}
          tags={p.techStack}
          image={p.coverImage}
        />
      ))}
    </div>
  );
}
