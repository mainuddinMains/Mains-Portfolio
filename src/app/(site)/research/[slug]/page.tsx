import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { researchStatusLabel } from "@/features/research/research-grid";
import { DetailLayout } from "@/features/shared/detail-layout";
import { getResearch, getResearchBySlug } from "@/lib/content";
import { toSlugParams } from "@/lib/content/static-params";
import { formatDateRange } from "@/lib/utils/date";

export async function generateStaticParams() {
  return toSlugParams(await getResearch());
}

export async function generateMetadata({
  params,
}: PageProps<"/research/[slug]">): Promise<Metadata> {
  const item = await getResearchBySlug((await params).slug);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function ResearchDetailPage({ params }: PageProps<"/research/[slug]">) {
  const item = await getResearchBySlug((await params).slug);
  if (!item) notFound();

  const meta = [
    researchStatusLabel[item.status],
    item.institution,
    item.advisor && `Advisor: ${item.advisor}`,
    formatDateRange(item.startDate, item.endDate),
  ]
    .filter(Boolean)
    .join(" · ");

  const pub = item.publication;

  return (
    <DetailLayout
      backHref="/research"
      backLabel="All research"
      title={item.title}
      meta={meta}
      summary={item.summary}
      tags={item.areas}
      links={item.links}
      coverImage={item.coverImage}
      body={item.body}
      gallery={item.gallery}
      videos={item.videos}
    >
      {pub && (pub.venue || pub.authors) && (
        <section className="rounded-lg bg-surface p-4 text-sm">
          {pub.authors && <p>{pub.authors}</p>}
          <p className="text-muted">
            {[pub.venue, pub.year].filter(Boolean).join(", ")}
            {pub.doi && ` · DOI: ${pub.doi}`}
          </p>
          {pub.url && (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Read the paper
            </a>
          )}
        </section>
      )}
    </DetailLayout>
  );
}
