import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ExperienceTimeline } from "@/features/experience/experience-timeline";
import { getExperience } from "@/lib/content";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const items = await getExperience();
  return (
    <Container>
      <PageHeader title="Experience" description="Professional and research positions." />
      <ExperienceTimeline items={items} />
    </Container>
  );
}
