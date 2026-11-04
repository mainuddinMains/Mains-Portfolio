import type { SiteSettings } from "@/domain/content";
import type { ContentRepository } from "./repository";

/** Shown when no CMS is configured, so the site still renders. */
export const fallbackSiteSettings: SiteSettings = {
  name: "Mainuddin",
  headline: "MS Computer Science student · Software Engineer · AI/ML & HPC Researcher",
  bio: "Portfolio content has not been configured yet. Connect Sanity and add content from /studio.",
  social: {},
  seo: {
    title: "Mainuddin — Developer & Research Portfolio",
    description:
      "Software engineering projects, AI/ML and HPC research, experience, and conferences.",
  },
};

/**
 * Returns empty collections and default settings. Used when Sanity
 * credentials are missing (local dev before setup, CI builds, previews).
 */
export const fallbackRepository: ContentRepository = {
  getSiteSettings: async () => fallbackSiteSettings,
  getProjects: async () => [],
  getProjectBySlug: async () => null,
  getResearch: async () => [],
  getResearchBySlug: async () => null,
  getExperience: async () => [],
  getConferences: async () => [],
  getConferenceBySlug: async () => null,
  getSkills: async () => [],
  getEducation: async () => [],
  getHobbies: async () => [],
};
