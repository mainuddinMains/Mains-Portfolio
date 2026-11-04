"use cache";

/**
 * Public, cached content API. Pages and components import from here only.
 *
 * Every function is cached with Next.js `use cache`, tagged by content type
 * for webhook revalidation, and given a short lifetime as a safety net if
 * the webhook is not configured.
 */
import { cacheLife, cacheTag } from "next/cache";
import { repository } from "./source";
import { contentTag, type ContentType } from "./tags";

function cache(type: ContentType) {
  cacheTag(contentTag(type));
  cacheLife("minutes");
}

export async function getSiteSettings() {
  cache("siteSettings");
  return repository.getSiteSettings();
}

export async function getProjects(featuredOnly = false) {
  cache("project");
  return repository.getProjects({ featuredOnly });
}

export async function getProjectBySlug(slug: string) {
  cache("project");
  return repository.getProjectBySlug(slug);
}

export async function getResearch(featuredOnly = false) {
  cache("research");
  return repository.getResearch({ featuredOnly });
}

export async function getResearchBySlug(slug: string) {
  cache("research");
  return repository.getResearchBySlug(slug);
}

export async function getExperience() {
  cache("experience");
  return repository.getExperience();
}

export async function getConferences() {
  cache("conference");
  return repository.getConferences();
}

export async function getConferenceBySlug(slug: string) {
  cache("conference");
  return repository.getConferenceBySlug(slug);
}

export async function getSkills() {
  cache("skill");
  return repository.getSkills();
}

export async function getEducation() {
  cache("education");
  return repository.getEducation();
}

export async function getHobbies() {
  cache("hobby");
  return repository.getHobbies();
}
