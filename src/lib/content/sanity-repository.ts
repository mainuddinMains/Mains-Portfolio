import "server-only";
import type { Education, Experience, Skill } from "@/domain/content";
import { getSanityClient } from "@/sanity/lib/client";
import {
  mapConference,
  mapHobby,
  mapProject,
  mapResearch,
  mapSiteSettings,
  stripNulls,
} from "@/sanity/lib/mappers";
import * as q from "@/sanity/lib/queries";
import type { ContentRepository } from "./repository";

type Raw = Record<string, unknown>;

async function fetchList(query: string, params: Record<string, unknown> = {}): Promise<Raw[]> {
  return (await getSanityClient().fetch<Raw[] | null>(query, params)) ?? [];
}

export const sanityRepository: ContentRepository = {
  async getSiteSettings() {
    return mapSiteSettings(await getSanityClient().fetch(q.siteSettingsQuery));
  },

  async getProjects({ featuredOnly = false } = {}) {
    return (await fetchList(q.projectsQuery, { featuredOnly })).map(mapProject);
  },
  async getProjectBySlug(slug) {
    const raw = await getSanityClient().fetch(q.projectBySlugQuery, { slug });
    return raw ? mapProject(raw) : null;
  },

  async getResearch({ featuredOnly = false } = {}) {
    return (await fetchList(q.researchQuery, { featuredOnly })).map(mapResearch);
  },
  async getResearchBySlug(slug) {
    const raw = await getSanityClient().fetch(q.researchBySlugQuery, { slug });
    return raw ? mapResearch(raw) : null;
  },

  async getExperience() {
    return (await fetchList(q.experienceQuery)).map((r) =>
      stripNulls<Experience>(r, ["highlights", "techStack"]),
    );
  },

  async getConferences() {
    return (await fetchList(q.conferencesQuery)).map(mapConference);
  },
  async getConferenceBySlug(slug) {
    const raw = await getSanityClient().fetch(q.conferenceBySlugQuery, { slug });
    return raw ? mapConference(raw) : null;
  },

  async getSkills() {
    return (await fetchList(q.skillsQuery)).map((r) => stripNulls<Skill>(r));
  },
  async getEducation() {
    return (await fetchList(q.educationQuery)).map((r) => stripNulls<Education>(r, ["highlights"]));
  },
  async getHobbies() {
    return (await fetchList(q.hobbiesQuery)).map(mapHobby);
  },
};
