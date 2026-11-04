import type {
  Conference,
  Education,
  Experience,
  Hobby,
  Project,
  Research,
  SiteSettings,
  Skill,
} from "@/domain/content";

/**
 * The single contract between the app and any content source.
 * Swap the CMS by providing another implementation of this interface.
 */
export interface ContentRepository {
  getSiteSettings(): Promise<SiteSettings>;

  getProjects(options?: { featuredOnly?: boolean }): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;

  getResearch(options?: { featuredOnly?: boolean }): Promise<Research[]>;
  getResearchBySlug(slug: string): Promise<Research | null>;

  getExperience(): Promise<Experience[]>;

  getConferences(): Promise<Conference[]>;
  getConferenceBySlug(slug: string): Promise<Conference | null>;

  getSkills(): Promise<Skill[]>;
  getEducation(): Promise<Education[]>;
  getHobbies(): Promise<Hobby[]>;
}
