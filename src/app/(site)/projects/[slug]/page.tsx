import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailLayout } from "@/features/shared/detail-layout";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { toSlugParams } from "@/lib/content/static-params";
import { formatDateRange } from "@/lib/utils/date";

export async function generateStaticParams() {
  return toSlugParams(await getProjects());
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();

  return (
    <DetailLayout
      backHref="/projects"
      backLabel="All projects"
      title={project.title}
      meta={formatDateRange(project.startDate, project.endDate)}
      summary={project.summary}
      tags={project.techStack}
      links={project.links}
      coverImage={project.coverImage}
      body={project.body}
      gallery={project.gallery}
      videos={project.videos}
    />
  );
}
