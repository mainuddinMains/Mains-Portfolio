import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ConferenceGrid } from "@/features/conferences/conference-grid";
import { getConferences } from "@/lib/content";

export const metadata: Metadata = { title: "Conferences" };

export default async function ConferencesPage() {
  const items = await getConferences();
  return (
    <Container>
      <PageHeader
        title="Conferences"
        description="Conferences, workshops and events I have attended or presented at."
      />
      <ConferenceGrid items={items} />
    </Container>
  );
}
