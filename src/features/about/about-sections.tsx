import type { Education, Hobby, Skill, SkillCategory } from "@/domain/content";
import { CmsImage } from "@/components/media/cms-image";
import { PhotoGallery } from "@/components/media/photo-gallery";
import { EmptyState } from "@/components/ui/empty-state";
import { TagList } from "@/components/ui/tag-list";
import { formatDateRange } from "@/lib/utils/date";

const categoryLabel: Record<SkillCategory, string> = {
  language: "Languages",
  framework: "Frameworks & libraries",
  ml: "AI / ML",
  hpc: "HPC",
  cloud: "Cloud & DevOps",
  database: "Databases",
  tool: "Tools",
  other: "Other",
};

export function groupSkills(skills: Skill[]): [SkillCategory, string[]][] {
  const groups = new Map<SkillCategory, string[]>();
  for (const s of skills) groups.set(s.category, [...(groups.get(s.category) ?? []), s.name]);
  return (Object.keys(categoryLabel) as SkillCategory[])
    .filter((c) => groups.has(c))
    .map((c) => [c, groups.get(c)!]);
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = groupSkills(skills);
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Skills</h2>
      {groups.length === 0 ? (
        <EmptyState message="No skills published yet." />
      ) : (
        <dl className="space-y-4">
          {groups.map(([category, names]) => (
            <div key={category} className="space-y-2">
              <dt className="text-sm font-medium">{categoryLabel[category]}</dt>
              <dd>
                <TagList tags={names} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export function EducationSection({ items }: { items: Education[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Education</h2>
      {items.length === 0 ? (
        <EmptyState message="No education published yet." />
      ) : (
        <ul className="space-y-6">
          {items.map((e) => (
            <li key={e.id}>
              <h3 className="font-semibold">
                {e.degree}
                {e.field && ` in ${e.field}`}
              </h3>
              <p className="text-muted">
                {e.institution} · {formatDateRange(e.startDate, e.endDate)}
                {e.gpa && ` · GPA ${e.gpa}`}
              </p>
              {e.highlights.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {e.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function HobbiesSection({ items }: { items: Hobby[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Hobbies</h2>
      {items.length === 0 ? (
        <EmptyState message="No hobbies published yet." />
      ) : (
        <ul className="space-y-8">
          {items.map((h) => (
            <li key={h.id} className="space-y-3">
              <div className="flex items-center gap-4">
                {h.image && (
                  <CmsImage
                    image={h.image}
                    sizes="64px"
                    className="size-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  {h.description && <p className="text-sm text-muted">{h.description}</p>}
                </div>
              </div>
              <PhotoGallery images={h.gallery} title={`${h.name} photos`} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
