import "server-only";
import { isSanityConfigured } from "@/sanity/env";
import { fallbackRepository } from "./fallback-repository";
import type { ContentRepository } from "./repository";
import { sanityRepository } from "./sanity-repository";

/** Selects the active content source. Replace here to swap CMS. */
export const repository: ContentRepository = isSanityConfigured
  ? sanityRepository
  : fallbackRepository;
