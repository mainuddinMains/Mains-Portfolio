import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectGrid } from "@/features/projects/project-grid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <Container>
      <PageHeader title="Projects" description="Software engineering projects and side builds." />
      <ProjectGrid projects={projects} />
    </Container>
  );
}
