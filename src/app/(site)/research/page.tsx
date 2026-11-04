import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ResearchGrid } from "@/features/research/research-grid";
import { getResearch } from "@/lib/content";

export const metadata: Metadata = { title: "Research" };

export default async function ResearchPage() {
  const items = await getResearch();
  return (
    <Container>
      <PageHeader title="Research" description="AI/ML and high-performance computing research." />
      <ResearchGrid items={items} />
    </Container>
  );
}
