import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { conferenceMeta } from "@/features/conferences/conference-grid";
import { DetailLayout } from "@/features/shared/detail-layout";
import { getConferenceBySlug, getConferences } from "@/lib/content";
import { toSlugParams } from "@/lib/content/static-params";

export async function generateStaticParams() {
  return toSlugParams(await getConferences());
}

export async function generateMetadata({
  params,
}: PageProps<"/conferences/[slug]">): Promise<Metadata> {
  const item = await getConferenceBySlug((await params).slug);
  return item ? { title: item.name, description: item.summary } : {};
}

export default async function ConferencePage({ params }: PageProps<"/conferences/[slug]">) {
  const item = await getConferenceBySlug((await params).slug);
  if (!item) notFound();

  return (
    <DetailLayout
      backHref="/conferences"
      backLabel="All conferences"
      title={item.name}
      meta={conferenceMeta(item)}
      summary={item.summary}
      links={item.website ? [{ label: "Conference website", url: item.website }] : []}
      coverImage={item.coverImage}
      body={item.body}
      gallery={item.gallery}
      videos={item.videos}
    />
  );
}
