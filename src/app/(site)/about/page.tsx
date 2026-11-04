import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EducationSection, HobbiesSection, SkillsSection } from "@/features/about/about-sections";
import { getEducation, getHobbies, getSiteSettings, getSkills } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, education, skills, hobbies] = await Promise.all([
    getSiteSettings(),
    getEducation(),
    getSkills(),
    getHobbies(),
  ]);
  return (
    <Container className="space-y-12">
      <PageHeader title="About" description={settings.bio} />
      <EducationSection items={education} />
      <SkillsSection skills={skills} />
      <HobbiesSection items={hobbies} />
    </Container>
  );
}
