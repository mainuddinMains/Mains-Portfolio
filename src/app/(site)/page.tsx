import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Hero } from "@/features/home/hero";
import { ProjectGrid } from "@/features/projects/project-grid";
import { ResearchGrid } from "@/features/research/research-grid";
import { getProjects, getResearch, getSiteSettings } from "@/lib/content";

export default async function HomePage() {
  const [settings, projects, research] = await Promise.all([
    getSiteSettings(),
    getProjects(true),
    getResearch(true),
  ]);

  return (
    <Container className="space-y-16">
      <Hero settings={settings} />
      <HomeSection title="Featured projects" href="/projects">
        <ProjectGrid projects={projects} />
      </HomeSection>
      <HomeSection title="Featured research" href="/research">
        <ResearchGrid items={research} />
      </HomeSection>
    </Container>
  );
}

function HomeSection({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <Link href={href} className="text-sm text-muted hover:text-foreground">
          View all →
        </Link>
      </div>
      {children}
    </section>
  );
}
