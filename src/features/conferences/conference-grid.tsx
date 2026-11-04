import type { Conference, ConferenceRole } from "@/domain/content";
import { ContentCard } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateRange } from "@/lib/utils/date";

export const conferenceRoleLabel: Record<ConferenceRole, string> = {
  attendee: "Attendee",
  presenter: "Presenter",
  poster: "Poster",
  speaker: "Speaker",
  volunteer: "Volunteer",
};

export function conferenceMeta(c: Conference): string {
  return [formatDateRange(c.startDate, c.endDate, ""), c.location, conferenceRoleLabel[c.role]]
    .filter(Boolean)
    .join(" · ");
}

export function ConferenceGrid({ items }: { items: Conference[] }) {
  if (items.length === 0) return <EmptyState message="No conferences published yet." />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((c) => (
        <ContentCard
          key={c.id}
          href={`/conferences/${c.slug}`}
          title={c.name}
          summary={c.summary}
          meta={conferenceMeta(c)}
          image={c.coverImage ?? c.gallery[0]}
        />
      ))}
    </div>
  );
}
