import type { Experience } from "@/domain/content";
import { EmptyState } from "@/components/ui/empty-state";
import { TagList } from "@/components/ui/tag-list";
import { formatDateRange } from "@/lib/utils/date";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  if (items.length === 0) return <EmptyState message="No experience published yet." />;
  return (
    <ol className="space-y-8 border-l border-border pl-6">
      {items.map((e) => (
        <li key={e.id} className="space-y-2">
          <p className="text-xs tracking-wide text-muted uppercase">
            {formatDateRange(e.startDate, e.endDate)}
            {e.location && ` · ${e.location}`}
          </p>
          <h3 className="text-lg font-semibold">
            {e.role} ·{" "}
            {e.organizationUrl ? (
              <a
                href={e.organizationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {e.organization}
              </a>
            ) : (
              e.organization
            )}
          </h3>
          {e.summary && <p className="text-muted">{e.summary}</p>}
          {e.highlights.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <TagList tags={e.techStack} />
        </li>
      ))}
    </ol>
  );
}
